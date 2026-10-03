/**
 * Exponential Backoff Retry Utility for AI Tools
 * Handles transient rate limits (429), quota spikes (RESOURCE_EXHAUSTED),
 * and temporary service outages (503) gracefully with visible countdowns.
 */

export interface RetryState {
  isRetrying: boolean;
  attempt: number;
  maxRetries: number;
  secondsRemaining: number;
  errorMessage: string | null;
  isQuota: boolean;
}

export interface RetryConfig {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  totalMaxWaitMs?: number;
}

const DEFAULT_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  baseDelayMs: 2000,
  maxDelayMs: 8000,
  totalMaxWaitMs: 15000,
};

/**
 * Determines whether an error is transient and safe to retry.
 */
export function isTransientError(error: any, responseStatus?: number): boolean {
  if (responseStatus === 429 || responseStatus === 503 || responseStatus === 502 || responseStatus === 504) {
    return true;
  }

  const msg = (
    error?.message ||
    error?.rawMessage ||
    error?.error ||
    (typeof error === 'string' ? error : '')
  ).toLowerCase();

  const code = (error?.status || error?.code || '').toString().toLowerCase();

  return (
    code === '429' ||
    code === '503' ||
    code === 'resource_exhausted' ||
    msg.includes('429') ||
    msg.includes('503') ||
    msg.includes('resource_exhausted') ||
    msg.includes('quota') ||
    msg.includes('rate limit') ||
    msg.includes('rate-limit') ||
    msg.includes('overloaded') ||
    msg.includes('temporarily unavailable') ||
    msg.includes('limit: 0') ||
    msg.includes('high demand') ||
    msg.includes('capacity') ||
    msg.includes('network') ||
    msg.includes('failed to fetch')
  );
}

/**
 * Calculate delay in milliseconds using exponential backoff with subtle jitter.
 * Attempt is 1-indexed (1, 2, 3).
 * Formula: min(base * 2^(attempt - 1) + jitter, maxDelay)
 */
export function calculateBackoffDelay(
  attempt: number,
  config: Required<RetryConfig> = DEFAULT_CONFIG,
  retryAfterSeconds?: number
): number {
  if (retryAfterSeconds && retryAfterSeconds > 0 && retryAfterSeconds <= 15) {
    return retryAfterSeconds * 1000;
  }

  // 1st retry: ~2000ms, 2nd retry: ~4000ms, 3rd retry: ~8000ms
  const exponential = config.baseDelayMs * Math.pow(2, attempt - 1);
  const jitter = Math.floor(Math.random() * 400) - 200; // ±200ms jitter
  const calculated = Math.max(1000, exponential + jitter);

  return Math.min(calculated, config.maxDelayMs);
}

export interface ExecuteWithRetryOptions<T> {
  task: () => Promise<T>;
  config?: RetryConfig;
  onRetryStateChange: (state: RetryState) => void;
  shouldRetry?: (error: any, status?: number) => boolean;
}

export interface RetryController {
  cancel: () => void;
  retryImmediately: () => void;
}

/**
 * Executes a promise-returning task with exponential backoff retry mechanism.
 * Exposes a controller to manually cancel or trigger immediate retry.
 */
export function executeWithRetry<T>(
  options: ExecuteWithRetryOptions<T>
): { promise: Promise<T>; controller: RetryController } {
  const mergedConfig: Required<RetryConfig> = {
    ...DEFAULT_CONFIG,
    ...options.config,
  };

  let isCancelled = false;
  let activeTimer: ReturnType<typeof setTimeout> | null = null;
  let countdownInterval: ReturnType<typeof setInterval> | null = null;
  let resolveImmediateWait: (() => void) | null = null;

  const controller: RetryController = {
    cancel: () => {
      isCancelled = true;
      if (activeTimer) clearTimeout(activeTimer);
      if (countdownInterval) clearInterval(countdownInterval);
      if (resolveImmediateWait) resolveImmediateWait();
      options.onRetryStateChange({
        isRetrying: false,
        attempt: 0,
        maxRetries: mergedConfig.maxRetries,
        secondsRemaining: 0,
        errorMessage: 'Operation cancelled by user.',
        isQuota: false,
      });
    },
    retryImmediately: () => {
      if (activeTimer) clearTimeout(activeTimer);
      if (countdownInterval) clearInterval(countdownInterval);
      if (resolveImmediateWait) {
        resolveImmediateWait();
        resolveImmediateWait = null;
      }
    },
  };

  const waitWithCountdown = (delayMs: number, attempt: number, errorMsg: string, isQuota: boolean): Promise<boolean> => {
    return new Promise((resolve) => {
      let remainingMs = delayMs;
      const initialSeconds = Math.max(1, Math.ceil(remainingMs / 1000));

      options.onRetryStateChange({
        isRetrying: true,
        attempt,
        maxRetries: mergedConfig.maxRetries,
        secondsRemaining: initialSeconds,
        errorMessage: errorMsg,
        isQuota,
      });

      countdownInterval = setInterval(() => {
        remainingMs -= 100;
        const secondsLeft = Math.max(0, Math.ceil(remainingMs / 1000));
        options.onRetryStateChange({
          isRetrying: true,
          attempt,
          maxRetries: mergedConfig.maxRetries,
          secondsRemaining: secondsLeft,
          errorMessage: errorMsg,
          isQuota,
        });

        if (remainingMs <= 0) {
          if (countdownInterval) clearInterval(countdownInterval);
        }
      }, 100);

      resolveImmediateWait = () => {
        if (countdownInterval) clearInterval(countdownInterval);
        resolve(!isCancelled);
      };

      activeTimer = setTimeout(() => {
        if (countdownInterval) clearInterval(countdownInterval);
        resolve(!isCancelled);
      }, delayMs);
    });
  };

  const run = async (): Promise<T> => {
    let attempt = 0;
    let cumulativeWaitMs = 0;

    while (true) {
      if (isCancelled) {
        throw new Error('Operation cancelled.');
      }

      try {
        const result = await options.task();
        // Reset retry state on success
        options.onRetryStateChange({
          isRetrying: false,
          attempt: 0,
          maxRetries: mergedConfig.maxRetries,
          secondsRemaining: 0,
          errorMessage: null,
          isQuota: false,
        });
        return result;
      } catch (err: any) {
        if (isCancelled) throw err;

        const isCheckQuota = isTransientError(err, err?.status);
        const canRetry = options.shouldRetry ? options.shouldRetry(err, err?.status) : isCheckQuota;

        attempt++;

        if (canRetry && attempt <= mergedConfig.maxRetries) {
          const delay = calculateBackoffDelay(attempt, mergedConfig, err?.retryAfterSeconds);

          if (cumulativeWaitMs + delay > mergedConfig.totalMaxWaitMs && attempt > 1) {
            // Cap to avoid exceeding maximum allowed total wait window (~15s)
            console.warn(`[AI Retry] Exceeded total wait cap (${cumulativeWaitMs}ms + ${delay}ms)`);
          } else {
            cumulativeWaitMs += delay;
            const errorText = err?.message || 'Rate limit or quota threshold reached.';

            const shouldContinue = await waitWithCountdown(delay, attempt, errorText, isCheckQuota);
            if (!shouldContinue || isCancelled) {
              throw new Error('Operation cancelled.');
            }
            continue;
          }
        }

        // Exhausted retries or not retryable
        options.onRetryStateChange({
          isRetrying: false,
          attempt,
          maxRetries: mergedConfig.maxRetries,
          secondsRemaining: 0,
          errorMessage: err?.message || 'AI generation failed after retries.',
          isQuota: isCheckQuota,
        });

        throw err;
      }
    }
  };

  return {
    promise: run(),
    controller,
  };
}
