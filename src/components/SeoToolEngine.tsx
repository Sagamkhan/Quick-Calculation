import React from 'react';
import { Search, Globe, Sparkles, Shield, Cpu, ExternalLink } from 'lucide-react';
import { ToolItem } from '../data/categoriesAndTools';
import { SerpSimulator } from './seo/SerpSimulator';
import { KeywordLab } from './seo/KeywordLab';
import { ContentAuditor } from './seo/ContentAuditor';
import { TechnicalGenerator } from './seo/TechnicalGenerator';
import { SchemaSocialStudio } from './seo/SchemaSocialStudio';
import { WebmasterUtilities } from './seo/WebmasterUtilities';

interface SeoToolEngineProps {
  tool: ToolItem;
}

export function SeoToolEngine({ tool }: SeoToolEngineProps) {
  const toolId = tool.id || '';
  const toolSlug = tool.slug || '';

  const renderToolWorkspace = () => {
    // 1. SERP Snippet & Google Preview Simulator (SEO-01)
    if (toolId === 'tool_serp_snippet_simulator' || toolSlug === 'serp-snippet-google-preview-simulator') {
      return <SerpSimulator />;
    }

    // 2. Long-Tail Keyword Generator & LSI Idea Finder (SEO-02)
    if (toolId === 'tool_long_tail_keyword_generator' || toolSlug === 'long-tail-keyword-generator-lsi-idea-finder') {
      return <KeywordLab mode="longtail" />;
    }

    // 3. Keyword Density & N-Gram Frequency Analyzer (SEO-03)
    if (toolId === 'tool_keyword_density_analyzer' || toolSlug === 'keyword-density-ngram-frequency-analyzer') {
      return <ContentAuditor mode="density" />;
    }

    // 4. Robots.txt Directive Builder & Syntax Tester (SEO-04)
    if (toolId === 'tool_robots_txt_builder' || toolSlug === 'robots-txt-directive-builder-syntax-tester') {
      return <TechnicalGenerator mode="robotstxt" />;
    }

    // 5. XML Sitemap URL Generator & Validator (SEO-05)
    if (toolId === 'tool_xml_sitemap_generator' || toolSlug === 'xml-sitemap-url-generator-validator') {
      return <TechnicalGenerator mode="sitemap" />;
    }

    // 6. Meta Tag & OpenGraph Live Studio (SEO-06)
    if (toolId === 'tool_meta_tag_studio' || toolSlug === 'meta-tag-opengraph-live-studio') {
      return <SchemaSocialStudio mode="metatags" />;
    }

    // 7. JSON-LD Schema Markup Generator (SEO-07)
    if (toolId === 'tool_jsonld_schema_generator' || toolSlug === 'jsonld-schema-markup-generator') {
      return <SchemaSocialStudio mode="schema" />;
    }

    // 8. Heading Hierarchy (H1-H6) & Outline Inspector (SEO-08)
    if (toolId === 'tool_heading_hierarchy_inspector' || toolSlug === 'heading-hierarchy-h1-h6-outline-inspector') {
      return <ContentAuditor mode="headings" />;
    }

    // 9. Canonical Link & Hreflang Tag Generator (SEO-09)
    if (toolId === 'tool_canonical_hreflang_generator' || toolSlug === 'canonical-link-hreflang-tag-generator') {
      return <TechnicalGenerator mode="hreflang" />;
    }

    // 10. Redirect Rule Generator (.htaccess & Nginx) (SEO-10)
    if (toolId === 'tool_redirect_rule_generator' || toolSlug === 'redirect-rule-generator-htaccess-nginx') {
      return <TechnicalGenerator mode="redirects" />;
    }

    // 11. UTM Campaign URL Builder & Tracker (SEO-11)
    if (toolId === 'tool_utm_builder' || toolSlug === 'utm-campaign-url-builder-tracker') {
      return <WebmasterUtilities mode="utm" />;
    }

    // 12. HTTP Status Code & Header Explainer (SEO-12)
    if (toolId === 'tool_http_status_explainer' || toolSlug === 'http-status-code-header-explainer') {
      return <WebmasterUtilities mode="httpstatus" />;
    }

    // 13. Slug & SEO Permalink Sanitizer (SEO-13)
    if (toolId === 'tool_slug_sanitizer' || toolSlug === 'slug-seo-permalink-sanitizer') {
      return <WebmasterUtilities mode="slug" />;
    }

    // 14. Content Readability & Flesch-Kincaid Score Inspector (SEO-14)
    if (toolId === 'tool_content_readability_inspector' || toolSlug === 'content-readability-flesch-kincaid-score-inspector') {
      return <ContentAuditor mode="readability" />;
    }

    // 15. Alt Text & Image SEO Optimization Helper (SEO-15)
    if (toolId === 'tool_image_alt_text_helper' || toolSlug === 'alt-text-image-seo-optimization-helper') {
      return <WebmasterUtilities mode="alttext" />;
    }

    // 16. FAQ Schema & Accordion HTML Generator (SEO-16)
    if (toolId === 'tool_faq_schema_accordion_generator' || toolSlug === 'faq-schema-accordion-html-generator') {
      return <SchemaSocialStudio mode="faq" />;
    }

    // 17. Link Anchor Text & Internal Linking Matrix (SEO-17)
    if (toolId === 'tool_anchor_text_matrix' || toolSlug === 'link-anchor-text-internal-linking-matrix') {
      return <WebmasterUtilities mode="anchor" />;
    }

    // 18. Page Title & Pixel Width Calculator (SEO-18)
    if (toolId === 'tool_title_pixel_width_calculator' || toolSlug === 'page-title-pixel-width-calculator') {
      return <SerpSimulator isPixelCalculatorOnly />;
    }

    // 19. Stop Words Filter & Keyword Stripper (SEO-19)
    if (toolId === 'tool_stop_words_filter' || toolSlug === 'stop-words-filter-keyword-stripper') {
      return <KeywordLab mode="stopwords" />;
    }

    // 20. Search Intent Classifier & Query Analyzer (SEO-20)
    if (toolId === 'tool_search_intent_classifier' || toolSlug === 'search-intent-classifier-query-analyzer') {
      return <KeywordLab mode="intent" />;
    }

    // 21. HTML to Clean Text & SEO Content Stripper (SEO-21)
    if (toolId === 'tool_html_to_clean_text_stripper' || toolSlug === 'html-to-clean-text-seo-content-stripper') {
      return <ContentAuditor mode="htmlstrip" />;
    }

    // 22. Disavow File Generator for Backlinks (SEO-22)
    if (toolId === 'tool_disavow_file_generator' || toolSlug === 'disavow-file-generator-backlinks') {
      return <TechnicalGenerator mode="disavow" />;
    }

    // 23. Keyword Typo & Misspelling Generator (SEO-23)
    if (toolId === 'tool_keyword_typo_generator' || toolSlug === 'keyword-typo-misspelling-generator') {
      return <KeywordLab mode="typo" />;
    }

    // 24. Social Sharing Preview Debugger (SEO-24)
    if (toolId === 'tool_social_sharing_debugger' || toolSlug === 'social-sharing-preview-debugger') {
      return <SchemaSocialStudio mode="social" />;
    }

    // 25. Google Indexing Checklist & On-Page Audit Matrix (SEO-25)
    if (toolId === 'tool_google_indexing_checklist' || toolSlug === 'google-indexing-checklist-on-page-audit-matrix') {
      return <WebmasterUtilities mode="checklist" />;
    }

    // Default Fallback
    return <SerpSimulator />;
  };

  return (
    <div className="space-y-6">
      {/* Tool Header Card with Cyan/Emerald Gradient Accent */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-cyan-500/30 text-white space-y-2 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {tool.number || 'SEO UTILITY'}
                </span>
                <span className="text-[11px] font-mono text-emerald-400">100% Free &amp; Client-Side</span>
              </div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-white mt-0.5">{tool.name}</h2>
            </div>
          </div>
          {tool.freeAlternativeTo && (
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 block">Pro Alternative To</span>
              <span className="text-xs font-mono font-bold text-amber-300">{tool.freeAlternativeTo}</span>
            </div>
          )}
        </div>
        <p className="text-xs text-slate-300 font-sans max-w-3xl leading-relaxed pt-1">
          {tool.description}
        </p>
      </div>

      {/* Rendered Tool Functional Workspace */}
      <div className="rounded-3xl bg-slate-900/60 border border-cyan-500/20 p-5 sm:p-6 shadow-xl">
        {renderToolWorkspace()}
      </div>
    </div>
  );
}

export default SeoToolEngine;

