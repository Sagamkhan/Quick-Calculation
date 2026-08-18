import { ToolItem } from './categoriesAndTools';

export interface SEOToolConfig {
  id: string;
  indexNumber: string;
  title: string;
  description: string;
  badges: {
    isPopular?: boolean;
    isTrending?: boolean;
    difficulty: 'Easy' | 'Medium' | 'Advanced';
  };
  actions: {
    canCompare: boolean;
    isFavorite: boolean;
  };
  comparisonText: string;
  executionSpeed: string;
  category: 'Website SEO Tools';
  categoryGradient: 'CYAN / EMERALD';
  engineComponent: string;
}

export const WEBSITE_SEO_TOOLS: SEOToolConfig[] = [
  {
    id: 'seo-1',
    indexNumber: '01',
    title: 'SERP Snippet & Google Preview Simulator',
    description: 'Live Google search preview with pixel-width and character counters for Title & Meta Description.',
    badges: {
      isPopular: true,
      isTrending: true,
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: 'Replaces Yoast / SERP Preview tools with live pixel-based truncation.',
    executionSpeed: 'Instant (< 15ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-2',
    indexNumber: '02',
    title: 'Long-Tail Keyword Generator & LSI Idea Finder',
    description: 'Generates question-based, commercial, and semantic keyword suggestions.',
    badges: {
      isPopular: true,
      isTrending: true,
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: 'Replaces AnswerThePublic ($99/mo) and LSIGraph.',
    executionSpeed: 'Instant (< 25ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-3',
    indexNumber: '03',
    title: 'Keyword Density & N-Gram Frequency Analyzer',
    description: 'Analyzes 1-word, 2-word, and 3-word phrase density with keyword stuffing alerts.',
    badges: {
      isPopular: true,
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: 'In-browser N-gram NLP frequency analysis without word limit caps.',
    executionSpeed: 'Instant (< 30ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-4',
    indexNumber: '04',
    title: 'Robots.txt Directive Builder & Syntax Tester',
    description: 'Generates and tests directives for Googlebot, Bingbot, with crawl-delay and sitemap paths.',
    badges: {
      isPopular: true,
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: 'Interactive bot directive generator with live path testing.',
    executionSpeed: 'Instant (< 20ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-5',
    indexNumber: '05',
    title: 'XML Sitemap URL Generator & Validator',
    description: 'Builds search-engine compliant XML sitemaps with priority, changefreq, and lastmod tags.',
    badges: {
      isPopular: true,
      isTrending: true,
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: 'Replaces XML-Sitemaps.com ($4.19/mo) with unlimited URLs.',
    executionSpeed: 'Instant (< 20ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-6',
    indexNumber: '06',
    title: 'Meta Tag & OpenGraph Live Studio',
    description: 'Generates and previews SEO meta tags, Twitter/X cards, OpenGraph, and canonical tags.',
    badges: {
      isPopular: true,
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: 'Full-stack meta tag generator with responsive social cards preview.',
    executionSpeed: 'Instant (< 20ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-7',
    indexNumber: '07',
    title: 'JSON-LD Schema Markup Generator',
    description: 'Builds structured data schemas for FAQPage, Article, LocalBusiness, Breadcrumbs, and HowTo.',
    badges: {
      isPopular: true,
      isTrending: true,
      difficulty: 'Medium'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: 'Replaces Merkle Schema Generator with 8 rich snippet schemas.',
    executionSpeed: 'Instant (< 15ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-8',
    indexNumber: '08',
    title: 'Heading Hierarchy (H1-H6) & Outline Inspector',
    description: 'Audits text/HTML heading structure for missing H1s and skipped levels.',
    badges: {
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: 'Instant DOM & Markdown heading audit with outline visualization.',
    executionSpeed: 'Instant (< 20ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-9',
    indexNumber: '09',
    title: 'Canonical Link & Hreflang Tag Generator',
    description: 'Generates self-referencing canonicals and multi-language hreflang link tags.',
    badges: {
      difficulty: 'Medium'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: 'Multi-region SEO tag generator with x-default validation.',
    executionSpeed: 'Instant (< 20ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-10',
    indexNumber: '10',
    title: 'Redirect Rule Generator (.htaccess & Nginx)',
    description: 'Generates 301 Permanent and 302 Temporary regex rewrite rules for Apache and Nginx.',
    badges: {
      isPopular: true,
      difficulty: 'Medium'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: 'Bulletproof web server redirect configurations in 1 click.',
    executionSpeed: 'Instant (< 15ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-11',
    indexNumber: '11',
    title: 'UTM Campaign URL Builder & Tracker',
    description: 'Constructs Google Analytics campaign tracking URLs with custom campaign parameters.',
    badges: {
      isPopular: true,
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: 'Replaces Campaign URL Builder with shortener preview & QR code.',
    executionSpeed: 'Instant (< 15ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-12',
    indexNumber: '12',
    title: 'HTTP Status Code & Header Explainer',
    description: 'Lookup tool for 200, 301, 302, 404, 410, and 500 status codes with SEO indexing impact.',
    badges: {
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: 'Comprehensive webmaster guide to status codes & Googlebot crawling.',
    executionSpeed: 'Instant (< 10ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-13',
    indexNumber: '13',
    title: 'Slug & SEO Permalink Sanitizer',
    description: 'Transforms titles into clean, lowercase, stop-word stripped, URL-safe kebab-case slugs.',
    badges: {
      isPopular: true,
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: 'SEO friendly URL slug generator with automatic stop-word removal.',
    executionSpeed: 'Instant (< 10ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-14',
    indexNumber: '14',
    title: 'Content Readability & Flesch-Kincaid Score Inspector',
    description: 'Calculates Flesch Reading Ease and grade levels for SEO copy optimization.',
    badges: {
      isPopular: true,
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: 'Replaces Grammarly / Hemingway readability scoring with instant metrics.',
    executionSpeed: 'Instant (< 25ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-15',
    indexNumber: '15',
    title: 'Alt Text & Image SEO Optimization Helper',
    description: 'Generates descriptive, keyword-aligned image alt attributes and file naming formats.',
    badges: {
      isTrending: true,
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: 'Screen reader accessibility & Google Image search optimization assistant.',
    executionSpeed: 'Instant (< 20ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-16',
    indexNumber: '16',
    title: 'FAQ Schema & Accordion HTML Generator',
    description: 'Builds collapsible FAQ accordions with matching JSON-LD Google Rich Snippet code.',
    badges: {
      isPopular: true,
      isTrending: true,
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: 'Generates HTML5 details/summary markup paired with JSON-LD schema.',
    executionSpeed: 'Instant (< 15ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-17',
    indexNumber: '17',
    title: 'Link Anchor Text & Internal Linking Matrix',
    description: 'Audits anchor text distribution across exact match, partial match, and branded types.',
    badges: {
      difficulty: 'Medium'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: 'Penguin penalty risk detector with anchor distribution analysis.',
    executionSpeed: 'Instant (< 25ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-18',
    indexNumber: '18',
    title: 'Page Title & Pixel Width Calculator',
    description: 'Calculates exact Google desktop/mobile pixel width limit [580px - 600px] instead of just character count.',
    badges: {
      isPopular: true,
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: 'Proportional font metric pixel measurement for SERP title truncation.',
    executionSpeed: 'Instant (< 15ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-19',
    indexNumber: '19',
    title: 'Stop Words Filter & Keyword Stripper',
    description: 'Removes common grammatical stop words to extract core topical keywords and search entities.',
    badges: {
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: 'Cleanses 150+ grammatical noise words to reveal search entity density.',
    executionSpeed: 'Instant (< 20ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-20',
    indexNumber: '20',
    title: 'Search Intent Classifier & Query Analyzer',
    description: 'Classifies search queries into Informational, Navigational, Commercial, or Transactional intent.',
    badges: {
      isPopular: true,
      isTrending: true,
      difficulty: 'Medium'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: 'Automated 4-stage search intent classification with content format advice.',
    executionSpeed: 'Instant (< 20ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-21',
    indexNumber: '21',
    title: 'HTML to Clean Text & SEO Content Stripper',
    description: 'Strips tags, scripts, and styles to audit pure crawlable text content for search engines.',
    badges: {
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: 'Calculates code-to-text ratio and extracts clean crawlable index copy.',
    executionSpeed: 'Instant (< 25ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-22',
    indexNumber: '22',
    title: 'Disavow File Generator for Backlinks',
    description: 'Generates Google Search Console compliant disavow .txt files with domain and URL directives.',
    badges: {
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: 'Format-validated GSC disavow text generator with comment tagging.',
    executionSpeed: 'Instant (< 15ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-23',
    indexNumber: '23',
    title: 'Keyword Typo & Misspelling Generator',
    description: 'Generates common keyword typos and phonetic variations for broad-match search intent.',
    badges: {
      isTrending: true,
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: 'Fat-finger, transposed letters, and missing vowel query generator.',
    executionSpeed: 'Instant (< 25ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-24',
    indexNumber: '24',
    title: 'Social Sharing Preview Debugger',
    description: 'Live responsive visual cards for Facebook, Twitter/X summary cards, and LinkedIn preview snippets.',
    badges: {
      isPopular: true,
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: 'Simulates real-time social sharing embeds for Facebook, Twitter/X, and LinkedIn.',
    executionSpeed: 'Instant (< 20ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  },
  {
    id: 'seo-25',
    indexNumber: '25',
    title: 'Google Indexing Checklist & On-Page Audit Matrix',
    description: 'Interactive step-by-step checklist to audit 35+ critical technical on-page ranking factors.',
    badges: {
      isPopular: true,
      isTrending: true,
      difficulty: 'Advanced'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: '35-point technical SEO audit scoring matrix with instant health rating.',
    executionSpeed: 'Instant (< 15ms)',
    category: 'Website SEO Tools',
    categoryGradient: 'CYAN / EMERALD',
    engineComponent: 'SeoToolEngine'
  }
];

// Helper to convert SEOToolConfig to standard ToolItem for the main app catalog
export const SEO_CATALOG_TOOLS: ToolItem[] = WEBSITE_SEO_TOOLS.map((tool) => {
  const slug = tool.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  return {
    id: tool.id,
    slug: slug,
    number: `SEO-${tool.indexNumber}`,
    name: tool.title,
    description: tool.description,
    category: 'seo-website-tools',
    complexity: tool.badges.difficulty,
    readTime: 'Instant',
    isPopular: tool.badges.isPopular,
    isTrending: tool.badges.isTrending,
    freeAlternativeTo: tool.comparisonText,
    tags: [
      'SEO Tool',
      'Search Engine Optimization',
      tool.title.split(' ')[0],
      'Webmaster Utility'
    ],
    interactiveType: 'seo-tool',
    rating: 4.9,
    useCount: '185.0k'
  };
});
