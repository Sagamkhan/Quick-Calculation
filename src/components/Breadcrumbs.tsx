import React, { useMemo } from "react";
import { ChevronRight, Home, Shield, FileText, Info, Mail, AlertTriangle } from "lucide-react";
import { motion } from "motion/react";
import { CATEGORIES, ToolItem, CategoryInfo } from "../data/categoriesAndTools";
import { getCategoryPath, getToolPath } from "../utils/permalinks";

interface BreadcrumbsProps {
  category?: CategoryInfo | null;
  tool?: ToolItem | null;
  currentRoute?: {
    path: string;
    param?: string;
  };
  onNavigate: (href: string) => void;
}

export default function Breadcrumbs({ category, tool, currentRoute, onNavigate }: BreadcrumbsProps) {
  const breadcrumbs = useMemo(() => {
    interface BreadcrumbSegment {
      label: string;
      icon?: React.ComponentType<any>;
      href: string;
      id: string;
      active: boolean;
    }

    const segments: BreadcrumbSegment[] = [
      {
        label: "Home",
        icon: Home,
        href: "/",
        id: "breadcrumb-home",
        active: false,
      },
    ];

    // If tool is provided directly
    if (tool) {
      const parentCategory = CATEGORIES.find((c) => c.id === tool.category);
      if (parentCategory) {
        segments.push({
          label: parentCategory.name,
          href: getCategoryPath(parentCategory.id),
          id: `breadcrumb-cat-${parentCategory.id}`,
          active: false,
        });
      }
      segments.push({
        label: tool.name,
        href: getToolPath(tool),
        id: `breadcrumb-tool-${tool.id}`,
        active: true,
      });
      return segments;
    }

    // If category is provided directly
    if (category) {
      segments.push({
        label: category.name,
        href: getCategoryPath(category.id),
        id: `breadcrumb-cat-${category.id}`,
        active: true,
      });
      return segments;
    }

    // Fallback to route parameters if category / tool props not passed
    if (currentRoute) {
      const { path, param } = currentRoute;
      if (path === "/" || !path) return [];

      if (path === "/category" && param) {
        const cat = CATEGORIES.find((c) => c.id === param);
        if (cat) {
          segments.push({
            label: cat.name,
            href: getCategoryPath(cat.id),
            id: `breadcrumb-cat-${cat.id}`,
            active: true,
          });
        }
      } else if (path === "/privacy-policy") {
        segments.push({
          label: "Privacy Policy",
          icon: Shield,
          href: "/privacy-policy",
          id: "breadcrumb-privacy",
          active: true,
        });
      } else if (path === "/terms-of-service") {
        segments.push({
          label: "Terms of Service",
          icon: FileText,
          href: "/terms-of-service",
          id: "breadcrumb-terms",
          active: true,
        });
      } else if (path === "/disclaimer") {
        segments.push({
          label: "Disclaimer",
          icon: AlertTriangle,
          href: "/disclaimer",
          id: "breadcrumb-disclaimer",
          active: true,
        });
      } else if (path === "/about-us") {
        segments.push({
          label: "About Us",
          icon: Info,
          href: "/about-us",
          id: "breadcrumb-about",
          active: true,
        });
      } else if (path === "/contact-us") {
        segments.push({
          label: "Contact Us",
          icon: Mail,
          href: "/contact-us",
          id: "breadcrumb-contact",
          active: true,
        });
      } else if (path === "/donate") {
        segments.push({
          label: "Donate & Support",
          href: "/donate",
          id: "breadcrumb-donate",
          active: true,
        });
      }
    }

    return segments.length > 1 ? segments : [];
  }, [category, tool, currentRoute]);

  if (breadcrumbs.length === 0) {
    return null;
  }

  const handleSegmentClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    onNavigate(href);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((segment, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": segment.label,
      "item": `${typeof window !== "undefined" ? window.location.origin : "https://quickcalculator.app"}${segment.href}`
    }))
  };

  return (
    <nav aria-label="Breadcrumb" className="border-b border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-950/40 py-3.5 px-4 sm:px-6 lg:px-8 rounded-2xl mb-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="mx-auto max-w-7xl flex items-center flex-wrap gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-sans">
        {breadcrumbs.map((segment, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const SegmentIcon = segment.icon;

          return (
            <React.Fragment key={segment.id}>
              {index > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-neutral-300 dark:text-neutral-700 mx-0.5 shrink-0" />
              )}
              
              <div className="flex items-center">
                {isLast ? (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md flex items-center gap-1.5"
                  >
                    {SegmentIcon && <SegmentIcon className="h-3.5 w-3.5 shrink-0" />}
                    <span>{segment.label}</span>
                  </motion.span>
                ) : (
                  <a
                    id={segment.id}
                    href={segment.href}
                    onClick={(e) => handleSegmentClick(e, segment.href)}
                    className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-1 px-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-md cursor-pointer font-medium"
                  >
                    {SegmentIcon && <SegmentIcon className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500" />}
                    <span>{segment.label}</span>
                  </a>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
