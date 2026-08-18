import { ToolItem, CategoryInfo } from "../data/categoriesAndTools";
import { useSEO } from "../hooks/useSEO";

interface HelmetProps {
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
 * Custom React Helmet component with Automated Meta Tag Injector for search engine crawlers.
 * Delegates SEO management to the `useSEO` custom hook.
 */
export default function Helmet({
  title,
  description,
  canonicalUrl,
  ogType,
  jsonLd,
  tool,
  categoryObj,
  robots
}: HelmetProps) {
  useSEO({
    title,
    description,
    canonicalUrl,
    ogType,
    jsonLd,
    tool,
    categoryObj,
    robots
  });

  return null;
}


