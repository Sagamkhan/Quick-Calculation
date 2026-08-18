import { ToolItem } from '../data/categoriesAndTools';

export interface SeoCheckItem {
  id: string;
  label: string;
  passed: boolean;
  points: number;
  tip: string;
  category: 'critical' | 'content' | 'links' | 'structure';
}

export interface SeoAnalysisResult {
  score: number;
  rating: 'Great' | 'Good' | 'Needs Work' | 'Poor';
  color: string;
  checks: SeoCheckItem[];
  words: number;
  readingTimeMinutes: number;
  keywordCount: number;
  keywordDensity: string;
  internalLinkCount: number;
  h2Count: number;
  h3Count: number;
  hasFaq: boolean;
  hasToc: boolean;
  titleCharStatus: 'optimal' | 'short' | 'long' | 'excessive';
  metaCharStatus: 'optimal' | 'short' | 'long' | 'excessive';
}

export function analyzePostSeo(
  title: string,
  metaDescription: string,
  slug: string,
  focusKeyword: string,
  body: string
): SeoAnalysisResult {
  const kw = focusKeyword.trim().toLowerCase();
  const lowerTitle = title.toLowerCase();
  const lowerMeta = metaDescription.toLowerCase();
  const lowerSlug = slug.toLowerCase();
  const lowerBody = body.toLowerCase();

  // Words & Read Time
  const words = body.trim() ? body.trim().split(/\s+/).filter(Boolean).length : 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  // Headings & Structural counts
  const h2Matches = body.match(/^##\s+.+$/gm) || [];
  const h3Matches = body.match(/^###\s+.+$/gm) || [];
  const h2Count = h2Matches.length;
  const h3Count = h3Matches.length;

  // Internal Links
  const internalLinkMatches = body.match(/\[([^\]]+)\]\((?:\/tools\/|\/category\/|\/blog\/|[^\)]+)\)/g) || [];
  const toolLinkMatches = body.match(/\[([^\]]+)\]\((\/tools\/[^\)]+)\)/g) || [];
  const internalLinkCount = toolLinkMatches.length;

  // First paragraph (first ~100 words of content excluding frontmatter & title)
  const first100Words = lowerBody.split(/\s+/).slice(0, 100).join(' ');

  // FAQ section detection
  const hasFaq = /##\s+(?:Frequently Asked Questions|FAQs?)/i.test(body) || /###\s+(?:Q:|\d+\.)/i.test(body);
  const hasToc = /Table of Contents/i.test(body) || h2Count >= 3;

  // Keyword density
  let keywordCount = 0;
  if (kw && lowerBody) {
    const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedKw}\\b`, 'gi');
    keywordCount = (lowerBody.match(regex) || []).length;
  }
  const rawDensity = words > 0 ? (keywordCount / words) * 100 : 0;
  const keywordDensity = rawDensity.toFixed(1);
  const isDensityOptimal = rawDensity >= 0.8 && rawDensity <= 2.8;

  // Title & Meta lengths
  const titleLen = title.length;
  const metaLen = metaDescription.length;

  const titleCharStatus: SeoAnalysisResult['titleCharStatus'] =
    titleLen >= 50 && titleLen <= 60
      ? 'optimal'
      : titleLen < 50
      ? 'short'
      : titleLen <= 70
      ? 'long'
      : 'excessive';

  const metaCharStatus: SeoAnalysisResult['metaCharStatus'] =
    metaLen >= 120 && metaLen <= 160
      ? 'optimal'
      : metaLen < 120
      ? 'short'
      : metaLen <= 180
      ? 'long'
      : 'excessive';

  // 8 Specific Checklist Checks (Total points = 100)
  const checks: SeoCheckItem[] = [
    {
      id: 'kw-title',
      label: 'Focus keyword appears in H1 Title',
      passed: Boolean(kw && lowerTitle.includes(kw)),
      points: 20,
      tip: kw ? `Add "${kw}" to the title` : 'Define a target focus keyword first',
      category: 'critical'
    },
    {
      id: 'kw-intro',
      label: 'Focus keyword in first 100 words (Intro)',
      passed: Boolean(kw && first100Words.includes(kw)),
      points: 15,
      tip: `Include "${kw || 'focus keyword'}" naturally within your opening introduction paragraph`,
      category: 'content'
    },
    {
      id: 'kw-meta',
      label: 'Focus keyword appears in Meta Description',
      passed: Boolean(kw && lowerMeta.includes(kw)),
      points: 15,
      tip: 'Include your focus keyword in the SERP snippet meta description',
      category: 'critical'
    },
    {
      id: 'kw-slug',
      label: 'Focus keyword in URL Permalink Slug',
      passed: Boolean(kw && lowerSlug.includes(kw.replace(/\s+/g, '-'))),
      points: 10,
      tip: 'Use short, hyphenated keywords in the URL permalink slug',
      category: 'critical'
    },
    {
      id: 'content-length',
      label: 'Word Count reaches 500+ words',
      passed: words >= 500,
      points: 15,
      tip: `Current: ${words} words. Add more actionable context, examples, and breakdown points`,
      category: 'content'
    },
    {
      id: 'kw-density',
      label: 'Optimal Keyword Density (1.0% - 2.5%)',
      passed: isDensityOptimal && keywordCount >= 2,
      points: 10,
      tip: `Current density: ${keywordDensity}% (${keywordCount} occurrences in ${words} words)`,
      category: 'content'
    },
    {
      id: 'internal-links',
      label: 'Internal Links to Quick Calculator Tools',
      passed: internalLinkCount >= 1,
      points: 10,
      tip: `Found ${internalLinkCount} tool links. Use the "Insert Tool Link" button to link relevant calculators`,
      category: 'links'
    },
    {
      id: 'faq-schema',
      label: 'FAQ Section & Headings Structure (H2/H3)',
      passed: Boolean(hasFaq && h2Count >= 2),
      points: 5,
      tip: 'Include at least 2 H2 headings and a FAQ section to trigger rich snippet schemas',
      category: 'structure'
    }
  ];

  let score = 0;
  for (const c of checks) {
    if (c.passed) score += c.points;
  }

  score = Math.min(100, Math.max(0, score));

  let rating: SeoAnalysisResult['rating'] = 'Poor';
  let color = 'rose';

  if (score >= 85) {
    rating = 'Great';
    color = 'emerald';
  } else if (score >= 65) {
    rating = 'Good';
    color = 'cyan';
  } else if (score >= 45) {
    rating = 'Needs Work';
    color = 'amber';
  } else {
    rating = 'Poor';
    color = 'rose';
  }

  return {
    score,
    rating,
    color,
    checks,
    words,
    readingTimeMinutes,
    keywordCount,
    keywordDensity,
    internalLinkCount,
    h2Count,
    h3Count,
    hasFaq,
    hasToc,
    titleCharStatus,
    metaCharStatus
  };
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export function parseFaqsFromMarkdown(body: string): FaqItem[] {
  const faqSectionMatch = body.match(/##\s+(?:Frequently Asked Questions|FAQs?)([\s\S]*?)(?:##\s+|$)/i);
  if (!faqSectionMatch) return [];

  const faqContent = faqSectionMatch[1];
  const qAndAs: FaqItem[] = [];
  const questionRegex = /###\s+(?:Q:\s*|\d+\.\s*)?([^\n\r]+)([\s\S]*?)(?=###|$)/gi;
  let match;
  let idx = 1;
  while ((match = questionRegex.exec(faqContent)) !== null) {
    const q = match[1].trim();
    const a = match[2].replace(/^A:\s*/i, '').trim();
    if (q && a) {
      qAndAs.push({
        id: `faq-${idx++}`,
        question: q,
        answer: a
      });
    }
  }
  return qAndAs;
}

export function buildMarkdownFaqSection(faqs: FaqItem[]): string {
  if (!faqs || faqs.length === 0) return '';
  let section = `\n\n## Frequently Asked Questions\n\n`;
  for (const item of faqs) {
    if (item.question.trim() && item.answer.trim()) {
      section += `### ${item.question.trim()}\n${item.answer.trim()}\n\n`;
    }
  }
  return section.trim();
}
