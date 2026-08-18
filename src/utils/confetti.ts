import confetti from 'canvas-confetti';

/**
 * Triggers a subtle, refined confetti burst for successful tool calculations or actions.
 */
export const triggerConfetti = (originY = 0.65) => {
  try {
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: originY },
      colors: ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'],
      disableForReducedMotion: true,
      scalar: 0.85,
      ticks: 150
    });
  } catch (e) {
    // Gracefully handle environments without canvas support
    console.debug('Confetti canvas unavailable', e);
  }
};
