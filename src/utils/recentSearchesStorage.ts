/**
 * Client-Side Recent Searches Storage Utility
 * Manages privacy-preserving local storage of user search queries.
 */

const STORAGE_KEY = 'quickcalc_recent_searches_v1';
const MAX_RECENT_SEARCHES = 8;
const EVENT_NAME = 'quickcalc_recent_searches_updated';

/**
 * Default curated trending tools to feature when search is empty
 */
export const TRENDING_SEARCH_TERMS = [
  'SIP Calculator',
  'JSON Formatter',
  'PDF Compress',
  'Percentage Calculator',
  'GST Calculator',
  'Age Calculator',
  'Word Counter',
  'BMI Calculator'
];

/**
 * Retrieve stored recent search queries from localStorage
 */
export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0).slice(0, MAX_RECENT_SEARCHES);
    }
  } catch (err) {
    console.warn('[RecentSearches] Failed to read from localStorage:', err);
  }
  return [];
}

/**
 * Add a query to recent searches, avoiding duplicates and trimming whitespace
 */
export function addRecentSearch(query: string): string[] {
  if (typeof window === 'undefined') return [];
  const clean = (query || '').trim();
  if (!clean || clean.length < 2) return getRecentSearches();

  try {
    const current = getRecentSearches();
    // Filter out case-insensitive duplicates
    const filtered = current.filter(item => item.toLowerCase() !== clean.toLowerCase());
    const updated = [clean, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
    return updated;
  } catch (err) {
    console.warn('[RecentSearches] Failed to write to localStorage:', err);
    return [];
  }
}

/**
 * Remove a specific query from recent searches
 */
export function removeRecentSearch(query: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getRecentSearches();
    const updated = current.filter(item => item.toLowerCase() !== query.toLowerCase().trim());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
    return updated;
  } catch (err) {
    console.warn('[RecentSearches] Failed to remove item from localStorage:', err);
    return [];
  }
}

/**
 * Clear all recent searches
 */
export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: [] }));
  } catch (err) {
    console.warn('[RecentSearches] Failed to clear localStorage:', err);
  }
}
