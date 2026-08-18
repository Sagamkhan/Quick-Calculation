import { TOOLS_CATALOG, ToolItem } from '../data/categoriesAndTools';
import { getToolSlug } from './permalinks';

export interface LinkSuggestion {
  id: string;
  term: string; // The exact text matched in the content
  matchedKeyword: string; // The canonical keyword/name that triggered match
  tool: ToolItem;
  toolSlug: string;
  url: string;
  category: string;
  occurrences: number;
  contextSnippet: string; // Surrounding context with highlighted term
  suggestedMarkdown: string; // e.g. "[SIP Calculator](/tools/sip-calculator)"
  status: 'pending' | 'converted' | 'dismissed';
}

export interface AlreadyLinkedTool {
  toolId: string;
  toolName: string;
  toolSlug: string;
  url: string;
  anchorText: string;
  count: number;
}

export interface ScanResult {
  suggestions: LinkSuggestion[];
  totalSuggestions: number;
  alreadyLinked: AlreadyLinkedTool[];
  internalLinkDensity: number; // Links per 100 words
  linkScore: number; // 0-100 quality score for internal linking
}

interface TermDictionaryEntry {
  term: string;
  cleanTerm: string;
  tool: ToolItem;
  toolSlug: string;
  url: string;
  priority: number; // Higher for longer / exact phrases
}

/**
 * Builds a search dictionary from all available tools in the catalog
 */
export function buildToolTermDictionary(customCatalog?: ToolItem[]): TermDictionaryEntry[] {
  const catalog = customCatalog || TOOLS_CATALOG;
  const dictionary: TermDictionaryEntry[] = [];
  const seenTerms = new Set<string>();

  const addTerm = (rawTerm: string, tool: ToolItem, priority: number) => {
    const cleanTerm = rawTerm.trim().replace(/\s+/g, ' ');
    const lowerKey = cleanTerm.toLowerCase();
    // Exclude single characters or very short ambiguous words
    if (!cleanTerm || cleanTerm.length < 3 || seenTerms.has(lowerKey)) {
      return;
    }
    // Filter out generic single English words that could cause aggressive false positives
    const overlyGenericWords = new Set([
      'the', 'and', 'for', 'tool', 'tools', 'free', 'online', 'easy', 'best',
      'fast', 'smart', 'simple', 'clean', 'view', 'help', 'data', 'text', 'card', 'calc'
    ]);
    if (overlyGenericWords.has(lowerKey)) {
      return;
    }

    seenTerms.add(lowerKey);
    const toolSlug = getToolSlug(tool);
    dictionary.push({
      term: cleanTerm,
      cleanTerm,
      tool,
      toolSlug,
      url: `/tools/${toolSlug}`,
      priority
    });
  };

  catalog.forEach((tool) => {
    const slug = getToolSlug(tool);

    // 1. Tool exact name (e.g., "SIP Calculator", "JSON Formatter") - Highest priority
    addTerm(tool.name, tool, 100 + tool.name.length);

    // 2. Cleaned name without marketing suffixes (e.g. "Free Plagiarism Checker Online" -> "Plagiarism Checker")
    const cleanName = tool.name
      .replace(/^(Free|Online|Instant|Smart|Secure|Pro)\s+/i, '')
      .replace(/\s+(Online|Free|Studio|Matrix|Pro|App|Utility|Calculator|Engine)$/i, '')
      .trim();
    if (cleanName && cleanName.length >= 4) {
      addTerm(cleanName, tool, 80 + cleanName.length);
      addTerm(`${cleanName} Calculator`, tool, 85 + cleanName.length);
      addTerm(`${cleanName} Tool`, tool, 82 + cleanName.length);
    }

    // 3. Normalized slug variations (e.g., "sip-calculator" -> "SIP calculator", "sip calculator")
    if (slug) {
      const slugWords = slug.split('-').filter(Boolean).join(' ');
      addTerm(slugWords, tool, 70 + slugWords.length);
      if (!slugWords.endsWith('calculator') && !slugWords.endsWith('tool')) {
        addTerm(`${slugWords} calculator`, tool, 75 + slugWords.length);
        addTerm(`${slugWords} tool`, tool, 72 + slugWords.length);
      }
    }

    // 4. Relevant Tags (e.g., "SIP", "BMI", "TDEE", "Base64", "Regex")
    if (tool.tags && Array.isArray(tool.tags)) {
      tool.tags.forEach((tag) => {
        if (tag.length >= 3) {
          addTerm(tag, tool, 60 + tag.length);
          if (!tag.toLowerCase().includes('calculator') && !tag.toLowerCase().includes('checker')) {
            addTerm(`${tag} calculator`, tool, 65 + tag.length);
            addTerm(`${tag} tool`, tool, 62 + tag.length);
            addTerm(`${tag} checker`, tool, 62 + tag.length);
          }
        }
      });
    }

    // 5. Special common technical terms mapping
    const lowerName = tool.name.toLowerCase();
    if (lowerName.includes('sip')) {
      addTerm('SIP Calculator', tool, 95);
      addTerm('SIP investment', tool, 70);
    }
    if (lowerName.includes('emi') || lowerName.includes('loan')) {
      addTerm('EMI Calculator', tool, 95);
      addTerm('Loan EMI Calculator', tool, 98);
      addTerm('Home Loan EMI', tool, 80);
    }
    if (lowerName.includes('json')) {
      addTerm('JSON Formatter', tool, 95);
      addTerm('JSON Validator', tool, 90);
      addTerm('JSON Parser', tool, 85);
    }
    if (lowerName.includes('bmi')) {
      addTerm('BMI Calculator', tool, 95);
      addTerm('Body Mass Index', tool, 85);
    }
    if (lowerName.includes('base64')) {
      addTerm('Base64 Encoder', tool, 90);
      addTerm('Base64 Decoder', tool, 90);
    }
    if (lowerName.includes('word') && lowerName.includes('count')) {
      addTerm('Word Counter', tool, 95);
      addTerm('Character Counter', tool, 90);
    }
    if (lowerName.includes('plagiarism')) {
      addTerm('Plagiarism Checker', tool, 95);
      addTerm('Duplicate Content Checker', tool, 85);
    }
    if (lowerName.includes('regex')) {
      addTerm('Regex Tester', tool, 95);
      addTerm('Regular Expression', tool, 80);
    }
    if (lowerName.includes('qr')) {
      addTerm('QR Code Generator', tool, 95);
    }
    if (lowerName.includes('pdf') && lowerName.includes('compress')) {
      addTerm('PDF Compressor', tool, 95);
    }
    if (lowerName.includes('pdf') && lowerName.includes('merg')) {
      addTerm('PDF Merger', tool, 95);
    }
    if (lowerName.includes('contrast')) {
      addTerm('Color Contrast Checker', tool, 95);
      addTerm('WCAG Contrast', tool, 85);
    }
    if (lowerName.includes('prompt')) {
      addTerm('AI Prompt Optimizer', tool, 95);
      addTerm('Prompt Generator', tool, 90);
    }
    if (lowerName.includes('age')) {
      addTerm('Age Calculator', tool, 95);
    }
    if (lowerName.includes('tdee')) {
      addTerm('TDEE Calculator', tool, 95);
      addTerm('Daily Calorie Planner', tool, 90);
    }
    if (lowerName.includes('watermark')) {
      addTerm('Watermark Tool', tool, 90);
      addTerm('Add Watermark', tool, 85);
    }
  });

  // Sort dictionary by priority descending (longest & most specific match first)
  return dictionary.sort((a, b) => b.priority - a.priority || b.term.length - a.term.length);
}

// Global cached dictionary
let cachedDictionary: TermDictionaryEntry[] | null = null;
export function getDictionary(): TermDictionaryEntry[] {
  if (!cachedDictionary) {
    cachedDictionary = buildToolTermDictionary();
  }
  return cachedDictionary;
}

/**
 * Extracts already linked markdown items and protects non-linkable zones
 */
export function extractExistingLinks(markdown: string): AlreadyLinkedTool[] {
  const linkedToolsMap = new Map<string, AlreadyLinkedTool>();
  const linkRegex = /\[([^\]]+)\]\((?:\/tools\/|https?:\/\/[^\/]+\/tools\/)([a-zA-Z0-9_-]+)\)/gi;

  let match: RegExpExecArray | null;
  while ((match = linkRegex.exec(markdown)) !== null) {
    const anchorText = match[1];
    const slug = match[2];
    const existing = linkedToolsMap.get(slug);

    if (existing) {
      existing.count += 1;
    } else {
      const tool = TOOLS_CATALOG.find((t) => getToolSlug(t) === slug || t.id === slug);
      linkedToolsMap.set(slug, {
        toolId: tool?.id || slug,
        toolName: tool?.name || anchorText,
        toolSlug: slug,
        url: `/tools/${slug}`,
        anchorText,
        count: 1
      });
    }
  }

  return Array.from(linkedToolsMap.values());
}

/**
 * Generates an illustrative surrounding snippet with highlighting
 */
function createSnippet(content: string, matchIndex: number, termLength: number): string {
  const windowSize = 40;
  const start = Math.max(0, matchIndex - windowSize);
  const end = Math.min(content.length, matchIndex + termLength + windowSize);

  const before = content.slice(start, matchIndex).replace(/\n+/g, ' ');
  const match = content.slice(matchIndex, matchIndex + termLength);
  const after = content.slice(matchIndex + termLength, end).replace(/\n+/g, ' ');

  const prefix = start > 0 ? '...' : '';
  const suffix = end < content.length ? '...' : '';

  return `${prefix}${before}**${match}**${after}${suffix}`;
}

/**
 * Scans markdown draft content for unlinked technical terms matching tool slugs and catalog names.
 */
export function scanDraftForToolLinks(
  markdownContent: string,
  ignoredIds: Set<string> = new Set()
): ScanResult {
  if (!markdownContent || !markdownContent.trim()) {
    return {
      suggestions: [],
      totalSuggestions: 0,
      alreadyLinked: [],
      internalLinkDensity: 0,
      linkScore: 0
    };
  }

  const dictionary = getDictionary();
  const alreadyLinked = extractExistingLinks(markdownContent);
  const alreadyLinkedSlugs = new Set(alreadyLinked.map((l) => l.toolSlug));

  // Mask protected sections: links, code blocks, images, HTML tags, inline code, and URLs
  // We use placeholder tokens of equal length or mask characters to preserve exact character indices
  const protectedRanges: [number, number][] = [];

  const patterns = [
    /```[\s\S]*?```/g, // fenced code blocks
    /`[^`\n]+`/g, // inline code
    /!\[[^\]]*\]\([^\)]*\)/g, // images
    /\[[^\]]+\]\([^\)]*\)/g, // already existing links
    /<[^>]+>/g, // HTML tags
    /https?:\/\/[^\s\)]+/g // raw URLs
  ];

  patterns.forEach((pattern) => {
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(markdownContent)) !== null) {
      protectedRanges.push([m.index, m.index + m[0].length]);
    }
  });

  // Helper to check if an index range overlaps with protected zones
  const isProtected = (start: number, end: number): boolean => {
    return protectedRanges.some(([pStart, pEnd]) => {
      return (start >= pStart && start < pEnd) || (end > pStart && end <= pEnd) || (start <= pStart && end >= pEnd);
    });
  };

  const suggestions: LinkSuggestion[] = [];
  const matchedToolSlugs = new Set<string>();
  const claimedRanges: [number, number][] = [];

  // Helper to check if a range has already been claimed by a higher-priority term
  const isClaimed = (start: number, end: number): boolean => {
    return claimedRanges.some(([cStart, cEnd]) => {
      return (start >= cStart && start < cEnd) || (end > cStart && end <= cEnd) || (start <= cStart && end >= cEnd);
    });
  };

  // Scan terms
  for (const entry of dictionary) {
    // Avoid creating multiple suggestions for the same tool if already matched or already linked heavily
    if (matchedToolSlugs.has(entry.toolSlug)) {
      continue;
    }

    const escaped = entry.cleanTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    // Match whole words only
    const regex = new RegExp(`\\b(${escaped})\\b`, 'gi');

    let m: RegExpExecArray | null;
    let foundOccurrences = 0;
    let firstMatchIndex = -1;
    let firstMatchedText = '';

    while ((m = regex.exec(markdownContent)) !== null) {
      const matchStart = m.index;
      const matchEnd = matchStart + m[0].length;

      if (!isProtected(matchStart, matchEnd) && !isClaimed(matchStart, matchEnd)) {
        foundOccurrences += 1;
        claimedRanges.push([matchStart, matchEnd]);

        if (firstMatchIndex === -1) {
          firstMatchIndex = matchStart;
          firstMatchedText = m[0];
        }
      }
    }

    if (foundOccurrences > 0 && firstMatchIndex !== -1) {
      const id = `sug-${entry.toolSlug}-${firstMatchIndex}`;
      if (!ignoredIds.has(id)) {
        const snippet = createSnippet(markdownContent, firstMatchIndex, firstMatchedText.length);
        suggestions.push({
          id,
          term: firstMatchedText,
          matchedKeyword: entry.term,
          tool: entry.tool,
          toolSlug: entry.toolSlug,
          url: entry.url,
          category: entry.tool.category || 'Calculators',
          occurrences: foundOccurrences,
          contextSnippet: snippet,
          suggestedMarkdown: `[${firstMatchedText}](${entry.url})`,
          status: 'pending'
        });
        matchedToolSlugs.add(entry.toolSlug);
      }
    }
  }

  // Calculate metrics
  const words = markdownContent.trim().split(/\s+/).filter(Boolean).length || 1;
  const totalLinked = alreadyLinked.reduce((sum, item) => sum + item.count, 0);
  const internalLinkDensity = parseFloat(((totalLinked / words) * 100).toFixed(2));

  // Score calculation:
  // - 1-3 tool links = 70-100% ideal
  // - 0 tool links = 20%
  // - Bonus if suggestions are converted
  let linkScore = 20;
  if (totalLinked >= 1) linkScore += 30;
  if (totalLinked >= 2) linkScore += 30;
  if (totalLinked >= 3 && totalLinked <= 8) linkScore += 20;
  if (totalLinked > 8) linkScore += 10; // slightly diminishing if over-linked

  return {
    suggestions,
    totalSuggestions: suggestions.length,
    alreadyLinked,
    internalLinkDensity,
    linkScore: Math.min(100, linkScore)
  };
}

/**
 * Converts a single suggestion in markdown content into an internal link.
 * Can replace only the first occurrence or all unlinked occurrences of the term.
 */
export function convertSingleSuggestion(
  markdownContent: string,
  suggestion: LinkSuggestion,
  replaceAll: boolean = false
): string {
  if (!markdownContent || !suggestion) return markdownContent;

  const escaped = suggestion.term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const targetUrl = suggestion.url;

  // Protect already-linked text and code blocks during replacement
  const linkMatches: string[] = [];
  let tokenCounter = 0;

  // Replace links, images, code with placeholder tokens
  let protectedText = markdownContent.replace(
    /(`[^`\n]+`|```[\s\S]*?```|!\[[^\]]*\]\([^\)]*\)|\[[^\]]+\]\([^\)]*\)|<[^>]+>|https?:\/\/[^\s\)]+)/g,
    (match) => {
      const token = `__PROTECTED_LINK_TOKEN_${tokenCounter++}__`;
      linkMatches.push(match);
      return token;
    }
  );

  const termRegex = new RegExp(`\\b(${escaped})\\b`, replaceAll ? 'gi' : 'i');
  let replaced = false;

  protectedText = protectedText.replace(termRegex, (matched) => {
    if (!replaceAll && replaced) return matched;
    replaced = true;
    return `[${matched}](${targetUrl})`;
  });

  // Restore protected tokens
  for (let i = 0; i < linkMatches.length; i++) {
    protectedText = protectedText.replace(`__PROTECTED_LINK_TOKEN_${i}__`, linkMatches[i]);
  }

  return protectedText;
}

/**
 * Converts all given suggestions into internal links in one click!
 */
export function convertAllSuggestions(
  markdownContent: string,
  suggestions: LinkSuggestion[]
): { updatedContent: string; convertedCount: number } {
  if (!markdownContent || !suggestions || suggestions.length === 0) {
    return { updatedContent: markdownContent, convertedCount: 0 };
  }

  let content = markdownContent;
  let count = 0;

  // Sort suggestions by term length descending so longer phrases get linked before shorter sub-terms
  const sorted = [...suggestions].sort((a, b) => b.term.length - a.term.length);

  for (const suggestion of sorted) {
    const updated = convertSingleSuggestion(content, suggestion, false);
    if (updated !== content) {
      content = updated;
      count += 1;
    }
  }

  return {
    updatedContent: content,
    convertedCount: count
  };
}
