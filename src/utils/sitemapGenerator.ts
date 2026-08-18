import { TOOLS_CATALOG, CATEGORIES, ToolItem, CategoryInfo } from '../data/categoriesAndTools';
import { getToolPath, getCategoryPath, getPagePath, getToolSlug } from './permalinks';

export interface SitemapUrlItem {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  title?: string;
  category?: string;
  type: 'home' | 'category' | 'tool' | 'page' | 'guide';
}

export interface SitemapOptions {
  baseUrl?: string;
  includePages?: boolean;
  includeCategories?: boolean;
  includeTools?: boolean;
  includeBlogPosts?: boolean;
  blogPosts?: Array<{ slug: string; title?: string; lastmod?: string; category?: string }>;
  customUrls?: Array<{ loc: string; priority?: number; changefreq?: SitemapUrlItem['changefreq']; title?: string; type?: SitemapUrlItem['type'] }>;
}

export interface SitemapStats {
  totalUrls: number;
  homeCount: number;
  pagesCount: number;
  categoriesCount: number;
  toolsCount: number;
  blogCount: number;
  customCount: number;
  generatedAt: string;
  baseUrl: string;
}

const DEFAULT_BASE_URL = 'https://quickcalculator.app';

export const SEED_BLOG_SLUGS: Array<{ slug: string; title?: string; lastmod?: string; category?: string }> = [
  { slug: 'essential-financial-calculators-2026', title: '10 Essential Financial & Investment Calculators Every Investor Needs in 2026', category: 'Finance Guides' },
  { slug: 'core-web-vitals-seo-tools-guide', title: 'The 2026 Technical SEO Playbook: Core Web Vitals, Schema & Meta Tag Optimization', category: 'SEO Tools' },
  { slug: 'ultimate-developer-toolbelt-debugging', title: 'The Ultimate Developer Toolbelt: JSON Formatting, Regex Testing & Hash Generators', category: 'Developer Tips' },
  { slug: 'client-side-browser-security-ai-trends', title: 'The Rise of Browser-Native Privacy: Client-Side Computing & In-Browser AI in 2026', category: 'Tech News' }
];

/**
 * Gets current date in YYYY-MM-DD ISO format for sitemap <lastmod>
 */
export function getFormattedDate(date?: Date): string {
  const d = date || new Date();
  return d.toISOString().split('T')[0];
}

/**
 * Normalizes base URL removing trailing slashes
 */
export function normalizeBaseUrl(baseUrl?: string): string {
  if (baseUrl && baseUrl.trim().length > 0) {
    return baseUrl.trim().replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin.replace(/\/+$/, '');
  }
  return DEFAULT_BASE_URL;
}

/**
 * Generates an array of structured sitemap items for all tools, categories, and main compliance pages
 */
export function getSitemapUrlItems(options?: SitemapOptions): SitemapUrlItem[] {
  const baseUrl = normalizeBaseUrl(options?.baseUrl);
  const today = getFormattedDate();
  const items: SitemapUrlItem[] = [];

  const includePages = options?.includePages ?? true;
  const includeCategories = options?.includeCategories ?? true;
  const includeTools = options?.includeTools ?? true;

  // 1. Homepage Entry (Highest Priority)
  items.push({
    loc: `${baseUrl}/`,
    lastmod: today,
    changefreq: 'daily',
    priority: 1.0,
    title: 'Quick Calculator - Home Page',
    type: 'home'
  });

  // 2. Main Standalone Application & Legal Compliance Pages
  if (includePages) {
    const mainPages = [
      { id: 'about-us', path: '/about-us', title: 'About Quick Calculator', priority: 0.6, changefreq: 'monthly' as const },
      { id: 'contact-us', path: '/contact-us', title: 'Contact Us', priority: 0.6, changefreq: 'monthly' as const },
      { id: 'privacy-policy', path: '/privacy-policy', title: 'Privacy Policy', priority: 0.5, changefreq: 'monthly' as const },
      { id: 'terms-of-service', path: '/terms-of-service', title: 'Terms of Service', priority: 0.5, changefreq: 'monthly' as const },
      { id: 'disclaimer', path: '/disclaimer', title: 'Disclaimer', priority: 0.5, changefreq: 'monthly' as const },
      { id: 'editorial-guidelines', path: '/editorial-guidelines', title: 'Editorial Guidelines & E-E-A-T Standards', priority: 0.5, changefreq: 'monthly' as const },
      { id: 'blog', path: '/blog', title: 'Calculators & SaaS Guides', priority: 0.7, changefreq: 'weekly' as const },
      { id: 'donate', path: '/donate', title: 'Support & Donate', priority: 0.6, changefreq: 'monthly' as const },
    ];

    for (const p of mainPages) {
      items.push({
        loc: `${baseUrl}${p.path}`,
        lastmod: today,
        changefreq: p.changefreq,
        priority: p.priority,
        title: p.title,
        type: p.id === 'blog' ? 'guide' : 'page'
      });
    }
  }

  // 3. Category Hub Pages
  if (includeCategories) {
    for (const category of CATEGORIES) {
      items.push({
        loc: `${baseUrl}${getCategoryPath(category.id)}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.8,
        title: `${category.name} Tools Directory`,
        category: category.id,
        type: 'category'
      });
    }
  }

  // 4. Individual Tool Workspace Pages
  if (includeTools) {
    for (const tool of TOOLS_CATALOG) {
      items.push({
        loc: `${baseUrl}${getToolPath(tool)}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.8,
        title: tool.name,
        category: tool.category,
        type: 'tool'
      });
    }
  }

  // 5. Individual Blog Articles (/blog/[slug])
  const includeBlogPosts = options?.includeBlogPosts ?? true;
  if (includeBlogPosts) {
    const blogList = options?.blogPosts && options.blogPosts.length > 0 
      ? options.blogPosts 
      : SEED_BLOG_SLUGS;

    for (const post of blogList) {
      items.push({
        loc: `${baseUrl}/blog/${post.slug}`,
        lastmod: post.lastmod || today,
        changefreq: 'weekly',
        priority: 0.7,
        title: post.title || 'Blog Guide',
        category: post.category,
        type: 'guide'
      });
    }
  }

  // 6. Custom URLs if provided
  if (options?.customUrls && options.customUrls.length > 0) {
    for (const custom of options.customUrls) {
      const fullLoc = custom.loc.startsWith('http') 
        ? custom.loc 
        : `${baseUrl}${custom.loc.startsWith('/') ? '' : '/'}${custom.loc}`;
      
      items.push({
        loc: fullLoc,
        lastmod: today,
        changefreq: custom.changefreq || 'weekly',
        priority: custom.priority ?? 0.5,
        title: custom.title || 'Custom Page',
        type: custom.type || 'page'
      });
    }
  }

  return items;
}

/**
 * Calculates statistics regarding sitemap URL distribution
 */
export function getSitemapStats(options?: SitemapOptions): SitemapStats {
  const items = getSitemapUrlItems(options);
  const baseUrl = normalizeBaseUrl(options?.baseUrl);

  return {
    totalUrls: items.length,
    homeCount: items.filter(i => i.type === 'home').length,
    pagesCount: items.filter(i => i.type === 'page').length,
    categoriesCount: items.filter(i => i.type === 'category').length,
    toolsCount: items.filter(i => i.type === 'tool').length,
    blogCount: items.filter(i => i.type === 'guide').length,
    customCount: items.filter(i => i.type === 'page' && !['home', 'category', 'tool'].includes(i.type)).length,
    generatedAt: getFormattedDate(),
    baseUrl
  };
}

/**
 * Dynamically generates valid XML string adhering strictly to Sitemaps.org 0.9 schema standard
 */
export function generateSitemapXml(options?: SitemapOptions): string {
  const urlItems = getSitemapUrlItems(options);

  const xmlEntries = urlItems
    .map((item) => {
      // Escape special XML characters in URL
      const escapedLoc = item.loc
        .replace(/&/g, '&amp;')
        .replace(/'/g, '&apos;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      return `  <url>
    <loc>${escapedLoc}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority.toFixed(1)}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${xmlEntries}
</urlset>`;
}

/**
 * Dynamically generates search-engine and AdSense compliant robots.txt content referencing the dynamic sitemap.xml
 */
export function generateRobotsTxt(baseUrl?: string): string {
  const base = normalizeBaseUrl(baseUrl);
  return `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Mediapartners-Google
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: ${base}/sitemap.xml
`;
}

/**
 * Browser helper to trigger dynamic file download of sitemap.xml
 */
export function downloadSitemapFile(baseUrl?: string, filename = 'sitemap.xml'): void {
  if (typeof window === 'undefined') return;
  const xmlContent = generateSitemapXml({ baseUrl });
  const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

