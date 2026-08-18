import { useEffect } from 'react';
import { ToolItem, CategoryInfo } from '../data/categoriesAndTools';
import {
  generateToolMetaResult,
  generateCategoryMetaResult,
  injectMetaTagsToDOM,
  AutoMetaResult
} from '../utils/autoMetaInjector';

export interface UseSEOOptions {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
  tool?: ToolItem | null;
  categoryObj?: CategoryInfo | null;
  robots?: string;
}

/**
 * Custom React hook `useSEO` that dynamically updates document title,
 * meta description, OpenGraph tags, Twitter card tags, canonical link,
 * and JSON-LD structured data based on current active tool, category, or page.
 */
export function useSEO(options: UseSEOOptions = {}) {
  const {
    title = 'Quick Calculator - Free Online Tools & Calculators Platform',
    description = 'Discover 250+ free online calculators, AI prompt assistants, PDF editors, developer formatters, and financial calculators created by Shahroz Khan.',
    canonicalUrl,
    ogType = 'website',
    jsonLd,
    tool,
    categoryObj,
    robots = 'index, follow'
  } = options;

  useEffect(() => {
    // 1. Tool-level SEO & indexing
    if (tool) {
      const toolMeta = generateToolMetaResult(tool);
      if (robots !== 'index, follow') {
        toolMeta.robots = robots;
      }
      injectMetaTagsToDOM(toolMeta);
      return;
    }

    // 2. Category-level SEO
    if (categoryObj) {
      const catMeta = generateCategoryMetaResult(categoryObj);
      if (robots !== 'index, follow') {
        catMeta.robots = robots;
      }
      injectMetaTagsToDOM(catMeta);
      return;
    }

    // 3. Fallback / Custom Page SEO
    const finalTitle = title.includes('Quick Calculator') ? title : `${title} | Quick Calculator`;
    const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href.split('#')[0] : '');

    const schemas: Array<Record<string, any>> = [];
    if (jsonLd) {
      if (Array.isArray(jsonLd)) {
        schemas.push(...jsonLd);
      } else {
        schemas.push(jsonLd);
      }
    }

    const fallbackMeta: AutoMetaResult = {
      title: finalTitle,
      description,
      keywords: 'online calculator, free tools, web utilities, financial calculators, developer formatters, Shahroz Khan',
      canonicalUrl: currentUrl,
      robots,
      googlebot: robots,
      bingbot: robots,
      ogTitle: finalTitle,
      ogDescription: description,
      ogUrl: currentUrl,
      ogType,
      ogSiteName: 'Quick Calculator',
      ogLocale: 'en_US',
      ogImage: 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221200%22%20height%3D%22630%22%20viewBox%3D%220%200%201200%20630%22%3E%3Crect%20width%3D%221200%22%20height%3D%22630%22%20fill%3D%22%230f172a%22%2F%3E%3Ctext%20x%3D%22600%22%20y%3D%22320%22%20fill%3D%22%23ffffff%22%20font-family%3D%22sans-serif%22%20font-size%3D%2248%22%20font-weight%3D%22800%22%20text-anchor%3D%22middle%22%3EQuick%20Calculator%3C%2Ftext%3E%3C%2Fsvg%3E',
      twitterCard: 'summary_large_image',
      twitterTitle: finalTitle,
      twitterDescription: description,
      twitterImage: 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221200%22%20height%3D%22630%22%20viewBox%3D%220%200%201200%20630%22%3E%3Crect%20width%3D%221200%22%20height%3D%22630%22%20fill%3D%22%230f172a%22%2F%3E%3Ctext%20x%3D%22600%22%20y%3D%22320%22%20fill%3D%22%23ffffff%22%20font-family%3D%22sans-serif%22%20font-size%3D%2248%22%20font-weight%3D%22800%22%20text-anchor%3D%22middle%22%3EQuick%20Calculator%3C%2Ftext%3E%3C%2Fsvg%3E',
      twitterSite: '@quickcalcapp',
      twitterCreator: '@shahroz_khan',
      applicationName: 'Quick Calculator',
      jsonLdSchemas: schemas
    };

    injectMetaTagsToDOM(fallbackMeta);
  }, [title, description, canonicalUrl, ogType, jsonLd, tool, categoryObj, robots]);
}

export default useSEO;
