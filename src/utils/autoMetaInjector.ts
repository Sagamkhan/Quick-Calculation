import { ToolItem, CATEGORIES, CategoryInfo } from '../data/categoriesAndTools';
import { getToolPath, getCategoryPath, getToolSlug } from './permalinks';
import { getToolInfoContent } from '../data/toolFaqsAndInfo';

export interface AutoMetaResult {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  robots: string;
  googlebot?: string;
  bingbot?: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogType: string;
  ogSiteName: string;
  ogLocale?: string;
  ogImage: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite?: string;
  twitterCreator?: string;
  applicationName?: string;
  tags?: string[];
  jsonLdSchemas: Array<Record<string, any>>;
}

const DEFAULT_ORIGIN = 'https://quickcalculator.app';
const AUTHOR_NAME = 'Shahroz Khan';

/**
 * Gets clean current origin
 */
export function getOrigin(originOverride?: string): string {
  if (originOverride) {
    return originOverride.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin.replace(/\/+$/, '');
  }
  return DEFAULT_ORIGIN;
}

/**
 * Generates an SVG Data URI placeholder / social banner image for OpenGraph / Twitter previews
 */
export function generateToolSocialBannerSvg(toolName: string, categoryName: string, tags: string[] = []): string {
  const cleanName = toolName.replace(/[<>&"]/g, '');
  const cleanCat = categoryName.replace(/[<>&"]/g, '');
  const tagsSummary = tags.slice(0, 3).join(' • ').replace(/[<>&"]/g, '');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#0f172a"/>
    <circle cx="1100" cy="100" r="300" fill="#4f46e5" opacity="0.25" filter="blur(60px)"/>
    <circle cx="100" cy="530" r="250" fill="#06b6d4" opacity="0.2" filter="blur(50px)"/>
    <rect x="80" y="80" width="1040" height="470" rx="24" fill="#1e293b" stroke="#334155" stroke-width="2"/>
    <text x="130" y="170" fill="#818cf8" font-family="sans-serif" font-size="22" font-weight="700" letter-spacing="2">
      ${cleanCat.toUpperCase()} • FREE ONLINE UTILITY
    </text>
    <text x="130" y="260" fill="#ffffff" font-family="sans-serif" font-size="50" font-weight="800">
      ${cleanName}
    </text>
    <text x="130" y="330" fill="#94a3b8" font-family="sans-serif" font-size="24" font-weight="400">
      100% Free Browser Utility • Zero Signup Required • Client-Side Privacy
    </text>
    ${tagsSummary ? `<text x="130" y="380" fill="#38bdf8" font-family="sans-serif" font-size="18" font-weight="600">
      Tags: ${tagsSummary}
    </text>` : ''}
    <rect x="130" y="420" width="280" height="60" rx="14" fill="#4f46e5"/>
    <text x="270" y="458" fill="#ffffff" font-family="sans-serif" font-size="22" font-weight="700" text-anchor="middle">
      Launch Tool ➔
    </text>
    <text x="1000" y="500" fill="#64748b" font-family="sans-serif" font-size="20" font-weight="600" text-anchor="end">
      Quick Calculator
    </text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Auto-generates a rich FAQ Schema (JSON-LD FAQPage) based on the tool's name, description, category, and tags
 */
export function generateToolFaqSchema(
  tool: {
    name: string;
    description?: string;
    category?: string;
    tags?: string[];
    freeAlternativeTo?: string;
  },
  customFaqs?: Array<{ question: string; answer: string }>
): Record<string, any> {
  const catObj = CATEGORIES.find(c => c.id === tool.category);
  const catName = catObj ? catObj.name : 'Calculators & Utilities';
  
  // Format tool description cleanly for QA
  const descText = tool.description ? tool.description.trim() : `A fast and accurate ${catName.toLowerCase()} calculation utility.`;
  
  // Built-in intelligent FAQs derived directly from tool's name and description
  const defaultFaqs: Array<{ question: string; answer: string }> = [
    {
      question: `What is the ${tool.name} and how does it work?`,
      answer: `The ${tool.name} is a free online tool designed to ${descText.toLowerCase().startsWith('a ') || descText.toLowerCase().startsWith('the ') ? 'provide ' + descText : descText}. It processes your input in real time using verified client-side algorithms to produce instantaneous, accurate results.`
    },
    {
      question: `How do I use the ${tool.name}?`,
      answer: `To use the ${tool.name}, simply enter or configure your input values into the fields above. The results will calculate and display automatically with options to copy, download, or print your output.`
    },
    {
      question: `Is the ${tool.name} free to use?`,
      answer: `Yes, ${tool.name} is 100% free to use. There are no fees, subscription plans, usage quotas, or registration requirements.`
    },
    {
      question: `Is my data private and secure when using ${tool.name}?`,
      answer: `Yes. All calculations with ${tool.name} are performed locally in your web browser (client-side). Your data is never uploaded to any remote server or stored in external databases.`
    }
  ];

  if (tool.freeAlternativeTo) {
    defaultFaqs.push({
      question: `Is ${tool.name} a good free alternative to ${tool.freeAlternativeTo}?`,
      answer: `Yes, ${tool.name} is designed as a fast, lightweight, and completely free web-based alternative to ${tool.freeAlternativeTo}, accessible directly from any browser without installation.`
    });
  }

  // Combine custom editorial FAQs with dynamic fallback FAQs
  const faqList = customFaqs && customFaqs.length > 0 ? customFaqs : defaultFaqs;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqList.map((f) => ({
      '@type': 'Question',
      'name': f.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.answer
      }
    }))
  };
}

/**
 * Injects a specific JSON-LD Schema directly into document.head
 */
export function injectJsonLdSchema(id: string, schema: Record<string, any>): void {
  if (typeof document === 'undefined') return;
  
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.setAttribute('data-auto-meta-jsonld', 'true');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schema, null, 2);
}

/**
 * Automated Dynamic Meta Tag Generator for Individual Tool Pages based on active tool's name, description, and tags
 */
export function generateToolMetaResult(tool: ToolItem, originOverride?: string): AutoMetaResult {
  const origin = getOrigin(originOverride);
  const toolPath = getToolPath(tool);
  const toolUrl = `${origin}${toolPath}`;
  const toolInfo = getToolInfoContent(tool);
  const catObj = CATEGORIES.find(c => c.id === tool.category);
  const catName = catObj ? catObj.name : 'Calculators';

  // Dynamic high-CTR SERP Title Tag optimized with tool name, category & value prop
  const title = `${tool.name} - Free Online Calculator & Tool | Quick Calculator`;

  // Dynamic High-converting SERP description combining tool name, description, and core tags
  const tagsList = tool.tags && tool.tags.length > 0 ? tool.tags.join(', ') : '';
  const altText = tool.freeAlternativeTo ? ` Great free replacement for ${tool.freeAlternativeTo}.` : '';
  const rawDesc = `${tool.name}: ${tool.description}${altText} Fast, 100% free online calculator with instant results, client-side browser privacy, and zero registration required.`;
  const description = rawDesc.length > 160 ? rawDesc.substring(0, 157).trim() + '...' : rawDesc;

  // Search intent keywords synthesized from tool name, tags, and category
  const keywordSet = new Set<string>();
  keywordSet.add(tool.name.toLowerCase());
  keywordSet.add(`free ${tool.name.toLowerCase()}`);
  keywordSet.add(`${tool.name.toLowerCase()} online`);
  keywordSet.add(`${tool.name.toLowerCase()} calculator`);
  keywordSet.add(catName.toLowerCase());
  if (tool.tags) {
    tool.tags.forEach(t => {
      keywordSet.add(t.toLowerCase());
      keywordSet.add(`${t.toLowerCase()} tool`);
      keywordSet.add(`${t.toLowerCase()} calculator`);
    });
  }
  if (tool.freeAlternativeTo) {
    keywordSet.add(`free alternative to ${tool.freeAlternativeTo.toLowerCase()}`);
  }
  keywordSet.add('quick calculator');
  keywordSet.add('free online tools');
  keywordSet.add(AUTHOR_NAME.toLowerCase());
  const keywords = Array.from(keywordSet).join(', ');

  const bannerImg = generateToolSocialBannerSvg(tool.name, catName, tool.tags || []);

  // 1. WebApplication / SoftwareApplication Schema for Google Rich Snippets
  const webAppSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': tool.name,
    'alternateName': `${tool.name} Calculator`,
    'url': toolUrl,
    'description': tool.description || toolInfo.overviewParagraph,
    'applicationCategory': 'UtilitiesApplication',
    'operatingSystem': 'All Modern Web Browsers (Chrome, Safari, Firefox, Edge, iOS, Android)',
    'browserRequirements': 'Requires JavaScript. Requires HTML5.',
    'softwareVersion': '2.5.0',
    'keywords': keywords,
    'featureList': tool.tags || [tool.name, 'Calculations', 'Free Utility', 'Instant Output'],
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
      'category': 'Free'
    },
    'author': {
      '@type': 'Person',
      'name': AUTHOR_NAME,
      'email': 'shahrozaslamk@gmail.com'
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': tool.rating || 4.9,
      'bestRating': '5',
      'worstRating': '1',
      'ratingCount': parseInt(tool.useCount ? tool.useCount.replace(/[^0-9]/g, '') : '1250', 10) || 1250
    }
  };

  // 2. FAQPage Schema auto-generated based on tool name and description
  const faqSchema = generateToolFaqSchema(tool, toolInfo.faqs);

  // 3. BreadcrumbList Schema
  const breadcrumbSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': origin
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': catName,
        'item': `${origin}${getCategoryPath(tool.category)}`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': tool.name,
        'item': toolUrl
      }
    ]
  };

  // 4. HowTo Schema (Instructions)
  const howToSteps = toolInfo.howToUseSteps && toolInfo.howToUseSteps.length > 0
    ? toolInfo.howToUseSteps
    : [
        'Enter your input values in the designated fields.',
        'Review the automated real-time calculation output.',
        'Copy or download your results.'
      ];

  const howToSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': `How to use ${tool.name}`,
    'description': `Step-by-step instructions for getting fast, accurate results with the free online ${tool.name}.`,
    'step': howToSteps.map((stepText, idx) => ({
      '@type': 'HowToStep',
      'position': idx + 1,
      'name': `Step ${idx + 1}`,
      'text': stepText
    }))
  };

  return {
    title,
    description,
    keywords,
    canonicalUrl: toolUrl,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    googlebot: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    bingbot: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    ogTitle: title,
    ogDescription: description,
    ogUrl: toolUrl,
    ogType: 'website',
    ogSiteName: 'Quick Calculator',
    ogLocale: 'en_US',
    ogImage: bannerImg,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: bannerImg,
    twitterSite: '@quickcalcapp',
    twitterCreator: '@shahroz_khan',
    applicationName: 'Quick Calculator',
    tags: tool.tags || [],
    jsonLdSchemas: [webAppSchema, faqSchema, breadcrumbSchema, howToSchema]
  };
}

/**
 * Automated Meta Tag Generator for Category Pages
 */
export function generateCategoryMetaResult(category: CategoryInfo, originOverride?: string): AutoMetaResult {
  const origin = getOrigin(originOverride);
  const catUrl = `${origin}${getCategoryPath(category.id)}`;
  const title = `${category.name} Tools & Calculators - Quick Calculator`;
  const description = `${category.description} Explore ${category.count}+ free online ${category.name} utilities created by ${AUTHOR_NAME}. Zero signup, 100% free forever.`;
  const keywords = `${category.name}, ${category.shortName}, free calculators, web utilities, online tools, ${AUTHOR_NAME}`;
  const bannerImg = generateToolSocialBannerSvg(`${category.name} Collection`, category.shortName);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': origin
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': category.name,
        'item': catUrl
      }
    ]
  };

  return {
    title,
    description,
    keywords,
    canonicalUrl: catUrl,
    robots: 'index, follow',
    googlebot: 'index, follow',
    bingbot: 'index, follow',
    ogTitle: title,
    ogDescription: description,
    ogUrl: catUrl,
    ogType: 'website',
    ogSiteName: 'Quick Calculator',
    ogLocale: 'en_US',
    ogImage: bannerImg,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: bannerImg,
    twitterSite: '@quickcalcapp',
    twitterCreator: '@shahroz_khan',
    applicationName: 'Quick Calculator',
    tags: [category.name, category.shortName],
    jsonLdSchemas: [breadcrumbSchema]
  };
}

/**
 * Automated Imperative DOM Meta Tag Injector
 * Safely creates or updates meta tags in document.head for search crawlers
 */
export function injectMetaTagsToDOM(meta: AutoMetaResult): void {
  if (typeof document === 'undefined') return;

  // 1. Update Title
  document.title = meta.title;

  // Helper for setting meta tag by name or property
  const setMeta = (attrName: string, attrVal: string, contentVal: string) => {
    if (!contentVal) return;
    let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrVal);
      document.head.appendChild(el);
    }
    el.setAttribute('content', contentVal);
  };

  // 2. Core SEO & SERP Crawl Directives
  setMeta('name', 'description', meta.description);
  setMeta('name', 'keywords', meta.keywords);
  setMeta('name', 'robots', meta.robots);
  setMeta('name', 'googlebot', meta.googlebot);
  setMeta('name', 'bingbot', meta.bingbot);
  setMeta('name', 'author', AUTHOR_NAME);
  setMeta('name', 'application-name', meta.applicationName);
  setMeta('name', 'apple-mobile-web-app-title', meta.applicationName);

  // 3. OpenGraph Protocol Meta Tags (Facebook, LinkedIn, Discord, Telegram)
  setMeta('property', 'og:title', meta.ogTitle);
  setMeta('property', 'og:description', meta.ogDescription);
  setMeta('property', 'og:url', meta.ogUrl);
  setMeta('property', 'og:type', meta.ogType);
  setMeta('property', 'og:site_name', meta.ogSiteName);
  setMeta('property', 'og:locale', meta.ogLocale);
  setMeta('property', 'og:image', meta.ogImage);

  // 4. Twitter / X Card Meta Tags
  setMeta('name', 'twitter:card', meta.twitterCard);
  setMeta('name', 'twitter:title', meta.twitterTitle);
  setMeta('name', 'twitter:description', meta.twitterDescription);
  setMeta('name', 'twitter:image', meta.twitterImage);
  setMeta('name', 'twitter:site', meta.twitterSite);
  setMeta('name', 'twitter:creator', meta.twitterCreator);

  // 5. Article / Subject Tags if available
  // Remove old article tag elements
  document.querySelectorAll('meta[property="article:tag"]').forEach(e => e.remove());
  if (meta.tags && meta.tags.length > 0) {
    meta.tags.forEach(tag => {
      const el = document.createElement('meta');
      el.setAttribute('property', 'article:tag');
      el.setAttribute('content', tag);
      document.head.appendChild(el);
    });
  }

  // 6. Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', meta.canonicalUrl);

  // 7. JSON-LD Schemas Injection
  const existingScripts = document.querySelectorAll('script[data-auto-meta-jsonld="true"]');
  existingScripts.forEach((s) => s.remove());

  if (meta.jsonLdSchemas && meta.jsonLdSchemas.length > 0) {
    meta.jsonLdSchemas.forEach((schemaObj, idx) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-auto-meta-jsonld', 'true');
      script.id = `auto-jsonld-schema-${idx}`;
      script.text = JSON.stringify(schemaObj);
      document.head.appendChild(script);
    });
  }
}
