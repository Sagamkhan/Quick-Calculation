import { ToolItem, CATEGORIES } from '../data/categoriesAndTools';

/**
 * Generate a clean, SEO-friendly URL slug for a tool
 */
export function getToolSlug(tool: ToolItem): string {
  if (tool.slug) return tool.slug;

  const lowerName = tool.name.toLowerCase();
  if (lowerName.includes('plagiarism')) return 'plagiarism-checker';
  if (lowerName.includes('serp') || lowerName.includes('google serp')) return 'google-serp-rank-checker';
  if (lowerName.includes('domain authority') || lowerName.includes('da checker')) return 'domain-authority-checker';
  if (lowerName.includes('sip')) return 'sip-calculator';
  if (lowerName.includes('bmi')) return 'bmi-calculator';
  if (lowerName.includes('age')) return 'age-calculator';
  if (lowerName.includes('emi') || lowerName.includes('mortgage')) return 'emi-calculator';
  if (lowerName.includes('word counter')) return 'word-counter';
  if (lowerName.includes('case converter')) return 'case-converter';
  if (lowerName.includes('json formatter')) return 'json-formatter';
  if (lowerName.includes('password') && lowerName.includes('hash')) return 'password-generator';
  if (lowerName.includes('base64')) return 'base64-encoder';
  if (lowerName.includes('unit converter')) return 'unit-converter';
  if (lowerName.includes('pdf smart compressor') || lowerName.includes('pdf compress')) return 'pdf-compressor';
  if (lowerName.includes('pdf merger')) return 'pdf-merger';
  if (lowerName.includes('prompt')) return 'ai-prompt-optimizer';

  // Fallback slug generation
  return tool.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Get dedicated SEO permalink path for a tool
 * e.g., "/tools/plagiarism-checker"
 */
export function getToolPath(tool: ToolItem): string {
  return `/tools/${getToolSlug(tool)}`;
}

/**
 * Get clean permalink path for a category
 * e.g., "/category/seo-website-tools"
 */
export function getCategoryPath(categoryId: string): string {
  return `/category/${categoryId}`;
}

/**
 * Get clean permalink path for a standalone page
 * e.g., "/about-us", "/privacy-policy", "/donate", "/blog"
 */
export function getPagePath(pageId: string): string {
  if (pageId === 'home') return '/';
  if (pageId === 'about') return '/about-us';
  if (pageId === 'contact') return '/contact-us';
  return `/${pageId}`;
}

/**
 * Match a tool by category + toolSlug or tool ID or tool slug
 */
export function findToolBySlugOrId(
  categorySlug: string,
  toolSlug: string,
  tools: ToolItem[]
): ToolItem | undefined {
  const target = (toolSlug || categorySlug || '').toLowerCase();
  if (!target) return undefined;

  return tools.find((tool) => {
    const slug = getToolSlug(tool).toLowerCase();
    const id = tool.id.toLowerCase();
    const explicitSlug = (tool.slug || '').toLowerCase();

    const isMatch = target === slug || target === id || (explicitSlug && target === explicitSlug);
    if (!isMatch) return false;

    // If category specified and not 'tools', verify category if helpful
    if (categorySlug && categorySlug !== 'tools' && categorySlug !== 'tool') {
      return tool.category === categorySlug || isMatch;
    }
    return true;
  });
}
