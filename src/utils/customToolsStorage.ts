import { ToolItem, CATEGORIES } from '../data/categoriesAndTools';

export interface CustomToolParam {
  id: string;
  label: string;
  type: 'number' | 'slider' | 'text' | 'select' | 'textarea';
  defaultValue: string | number;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  options?: string[]; // comma-separated or list of options for select
  hint?: string;
}

export interface CustomToolDefinition {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  complexity: 'Easy' | 'Medium' | 'Advanced';
  readTime: string;
  tags: string[];
  status: 'active' | 'draft' | 'disabled';
  createdAt: string;
  updatedAt: string;
  author?: string;
  formulaLogic?: string; // Optional JS formula / computation script
  parameters: CustomToolParam[];
  outputLabel?: string;
  outputPrefix?: string;
  outputSuffix?: string;
  metaTitle?: string;
  metaDescription?: string;
  faqs?: { question: string; answer: string }[];
  rating?: number;
  useCount?: string;
}

export const CUSTOM_TOOLS_STORAGE_KEY = 'quickcalc_custom_tools_registry_v1';
export const DISABLED_TOOLS_STORAGE_KEY = 'quickcalc_disabled_tools_registry_v1';

export function getStoredCustomTools(): CustomToolDefinition[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_TOOLS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading stored custom tools:', e);
    return [];
  }
}

export function saveCustomTool(tool: CustomToolDefinition): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredCustomTools();
    const existingIndex = current.findIndex((t) => t.id === tool.id || t.slug === tool.slug);
    
    let updated: CustomToolDefinition[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...tool, updatedAt: new Date().toISOString() };
    } else {
      updated = [
        { ...tool, createdAt: tool.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() },
        ...current
      ];
    }
    
    localStorage.setItem(CUSTOM_TOOLS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('quickcalc-tools-updated'));
  } catch (e) {
    console.error('Error saving custom tool:', e);
  }
}

export function deleteCustomTool(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredCustomTools();
    const updated = current.filter((t) => t.id !== id && t.slug !== id);
    localStorage.setItem(CUSTOM_TOOLS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('quickcalc-tools-updated'));
  } catch (e) {
    console.error('Error deleting custom tool:', e);
  }
}

export function toggleCustomToolStatus(id: string, status: 'active' | 'disabled' | 'draft'): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredCustomTools();
    const updated = current.map((t) => (t.id === id || t.slug === id ? { ...t, status } : t));
    localStorage.setItem(CUSTOM_TOOLS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('quickcalc-tools-updated'));
  } catch (e) {
    console.error('Error toggling custom tool status:', e);
  }
}

export function getDisabledToolIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DISABLED_TOOLS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleBuiltinToolDisabled(toolId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const current = getDisabledToolIds();
    let updated: string[];
    let isNowDisabled = false;
    if (current.includes(toolId)) {
      updated = current.filter((id) => id !== toolId);
      isNowDisabled = false;
    } else {
      updated = [...current, toolId];
      isNowDisabled = true;
    }
    localStorage.setItem(DISABLED_TOOLS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('quickcalc-tools-updated'));
    return isNowDisabled;
  } catch {
    return false;
  }
}

/**
 * Converts a CustomToolDefinition into a standard ToolItem for the global catalog
 */
export function customToolToToolItem(def: CustomToolDefinition): ToolItem {
  return {
    id: def.id,
    slug: def.slug,
    number: (def.id.replace(/\D/g, '') || '99').slice(0, 3),
    name: def.name,
    description: def.description,
    category: def.category,
    complexity: def.complexity || 'Easy',
    readTime: def.readTime || 'Instant',
    isPopular: false,
    isTrending: true,
    tags: def.tags || [def.name, def.category],
    interactiveType: def.slug,
    rating: def.rating || 4.9,
    useCount: def.useCount || '1.2k'
  };
}

/**
 * Merges default TOOLS_CATALOG with active custom tools and filters out disabled tools
 */
export function getMergedToolsCatalog(baseCatalog: ToolItem[]): ToolItem[] {
  const customTools = getStoredCustomTools().filter((t) => t.status === 'active');
  const disabledIds = getDisabledToolIds();

  const customToolItems = customTools.map(customToolToToolItem);

  // Avoid duplicate slugs/ids
  const existingIds = new Set(customToolItems.map((t) => t.id));
  const existingSlugs = new Set(customToolItems.map((t) => t.slug).filter(Boolean));

  const filteredBase = baseCatalog.filter(
    (t) => !disabledIds.includes(t.id) && !existingIds.has(t.id) && (!t.slug || !existingSlugs.has(t.slug))
  );

  return [...customToolItems, ...filteredBase];
}

export function exportToolsRegistryJson(): string {
  const custom = getStoredCustomTools();
  return JSON.stringify(custom, null, 2);
}

export function importToolsRegistryJson(jsonStr: string): { success: boolean; count: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) {
      return { success: false, count: 0, error: 'JSON content must be an array of tool definitions' };
    }
    const validated: CustomToolDefinition[] = parsed.filter(
      (item) => item && typeof item.id === 'string' && typeof item.name === 'string' && typeof item.slug === 'string'
    );
    if (validated.length === 0) {
      return { success: false, count: 0, error: 'No valid tool definitions found in array' };
    }
    const current = getStoredCustomTools();
    const existingMap = new Map(current.map((t) => [t.id, t]));
    validated.forEach((t) => existingMap.set(t.id, t));
    const merged = Array.from(existingMap.values());

    localStorage.setItem(CUSTOM_TOOLS_STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new Event('quickcalc-tools-updated'));
    return { success: true, count: validated.length };
  } catch (e: any) {
    return { success: false, count: 0, error: e?.message || 'Invalid JSON syntax' };
  }
}
