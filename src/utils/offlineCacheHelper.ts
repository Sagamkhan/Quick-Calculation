import { ToolItem, TOOLS_CATALOG } from '../data/categoriesAndTools';
import { getStoredCustomTools } from './customToolsStorage';

export interface CachedToolInfo {
  tool: ToolItem;
  source: 'recently-used' | 'bookmarked' | 'pre-cached';
  lastUsed?: string;
  useCount?: number;
  isFullyOffline: boolean;
}

/**
 * Checks if a specific tool requires an active external network connection
 * (e.g. live AI generation backend, live SERP pingers)
 */
export function isToolNetworkDependent(tool: ToolItem): boolean {
  const lowerName = tool.name.toLowerCase();
  const lowerDesc = (tool.description || '').toLowerCase();
  const lowerCat = (tool.category || '').toLowerCase();

  // Pure live AI model generation or external search engine pinging
  if (lowerCat === 'seo' && (lowerName.includes('indexer') || lowerName.includes('ping') || lowerName.includes('crawler'))) {
    return true;
  }
  
  if (lowerCat === 'ai' && (lowerName.includes('live') || lowerName.includes('gemini api') || lowerDesc.includes('server-side'))) {
    return true;
  }

  // All financial, math, text, converter, pdf, developer and utility tools run 100% client-side in the browser!
  return false;
}

/**
 * Retrieve recently executed tools from local storage metrics
 */
export function getRecentlyUsedToolsFromStorage(allTools: ToolItem[]): { tool: ToolItem; lastUsed: string; count: number }[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('qc_tool_usage_metrics');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const toolsMap = parsed.tools || {};
    
    const results: { tool: ToolItem; lastUsed: string; count: number }[] = [];

    Object.keys(toolsMap).forEach((toolId) => {
      const entry = toolsMap[toolId];
      const matched = allTools.find((t) => t.id === toolId || t.slug === toolId);
      if (matched) {
        results.push({
          tool: matched,
          lastUsed: entry.lastUsed || '',
          count: entry.count || 1
        });
      }
    });

    // Sort by most recent
    return results.sort((a, b) => {
      return new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime();
    });
  } catch (err) {
    console.warn('[OfflineHelper] Failed to read tool usage metrics:', err);
    return [];
  }
}

/**
 * Retrieve bookmarked tools from local storage
 */
export function getBookmarkedToolsFromStorage(allTools: ToolItem[]): ToolItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('quickcalc-bookmarks');
    if (!raw) return [];
    const ids: string[] = JSON.parse(raw);
    if (!Array.isArray(ids)) return [];
    return allTools.filter((t) => ids.includes(t.id));
  } catch (err) {
    console.warn('[OfflineHelper] Failed to read bookmarks:', err);
    return [];
  }
}

/**
 * Comprehensive compilation of offline tools categorized by cache readiness
 */
export function getOfflineToolsInventory(allTools: ToolItem[]) {
  const recentlyUsed = getRecentlyUsedToolsFromStorage(allTools);
  const bookmarked = getBookmarkedToolsFromStorage(allTools);

  // Group all tools
  const offlineReadyTools: ToolItem[] = [];
  const networkRequiredTools: ToolItem[] = [];

  allTools.forEach((t) => {
    if (isToolNetworkDependent(t)) {
      networkRequiredTools.push(t);
    } else {
      offlineReadyTools.push(t);
    }
  });

  return {
    recentlyUsed,
    bookmarked,
    offlineReadyCount: offlineReadyTools.length,
    networkRequiredCount: networkRequiredTools.length,
    allOfflineTools: offlineReadyTools,
    networkRequiredTools
  };
}

/**
 * Test actual internet reachability (beyond just navigator.onLine)
 */
export async function pingInternetConnectivity(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return false;
  }
  try {
    // Attempt a lightweight cache-busted fetch to test real connectivity
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`/manifest.webmanifest?_ping=${Date.now()}`, {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return res.ok || res.status === 304;
  } catch (e) {
    // If fetch failed and navigator reports offline, it's definitely offline
    return typeof navigator !== 'undefined' ? navigator.onLine : false;
  }
}
