export interface ToolUsageConfig {
  totalRuns: number;
  lastUpdated: string;
  tools: Record<string, {
    name: string;
    count: number;
    lastUsed: string;
  }>;
}

const USAGE_STORAGE_KEY = 'qc_tool_usage_metrics';

/**
 * Record a tool run event in local JSON configuration
 */
export function recordToolUsage(toolId: string, toolName: string): ToolUsageConfig {
  let currentMetrics: ToolUsageConfig = {
    totalRuns: 0,
    lastUpdated: new Date().toISOString(),
    tools: {}
  };

  try {
    const raw = localStorage.getItem(USAGE_STORAGE_KEY);
    if (raw) {
      currentMetrics = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to parse tool usage metrics from local config', e);
  }

  // Update counts
  currentMetrics.totalRuns = (currentMetrics.totalRuns || 0) + 1;
  currentMetrics.lastUpdated = new Date().toISOString();

  if (!currentMetrics.tools) {
    currentMetrics.tools = {};
  }

  const existingTool = currentMetrics.tools[toolId] || { name: toolName, count: 0, lastUsed: '' };
  currentMetrics.tools[toolId] = {
    name: toolName || existingTool.name || toolId,
    count: existingTool.count + 1,
    lastUsed: new Date().toISOString()
  };

  try {
    localStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(currentMetrics, null, 2));
  } catch (e) {
    console.warn('Failed to save tool usage metrics to local config', e);
  }

  return currentMetrics;
}

/**
 * Get current recorded tool usage metrics JSON config
 */
export function getToolUsageMetrics(): ToolUsageConfig {
  try {
    const raw = localStorage.getItem(USAGE_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to read tool usage metrics', e);
  }

  return {
    totalRuns: 0,
    lastUpdated: new Date().toISOString(),
    tools: {}
  };
}
