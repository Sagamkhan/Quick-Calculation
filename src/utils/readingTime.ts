/**
 * Reading Time Calculator Utility for SEO & User Engagement Metrics
 * Shahroz Khan - Quick Calculator
 */

export interface ReadingTimeResult {
  minutes: number;
  words: number;
  formattedTime: string; // e.g. "4 min read"
  detailedStats: string; // e.g. "4 min read (850 words)"
}

/**
 * Calculates average reading time for a given plain text string or Markdown/HTML block.
 * Uses standard WPM (Words Per Minute) reading speed of 200 WPM.
 * 
 * @param content - String or array of strings containing long-form article/documentation text
 * @param wordsPerMinute - Reading speed threshold (default: 200 WPM)
 */
export function calculateReadingTime(
  content: string | string[],
  wordsPerMinute: number = 200
): ReadingTimeResult {
  if (!content) {
    return {
      minutes: 1,
      words: 0,
      formattedTime: '1 min read',
      detailedStats: '1 min read (0 words)',
    };
  }

  const rawText = Array.isArray(content) ? content.join(' ') : content;

  // Strips HTML/XML tags and cleans excessive whitespace
  const plainText = rawText
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/[\r\n\t]+/g, ' ')
    .trim();

  // Match words across multi-language / alphanumeric boundary
  const words = plainText ? (plainText.match(/\b\w+\b/g) || []).length : 0;

  // Calculate estimated reading time in minutes (minimum 1 min)
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));

  return {
    minutes,
    words,
    formattedTime: `${minutes} min read`,
    detailedStats: `${minutes} min read (${words.toLocaleString()} words)`,
  };
}

/**
 * Utility helper to format word count and reading time string cleanly for headers
 */
export function formatReadingTimeBadge(
  content: string | string[],
  showWordCount: boolean = false
): string {
  const result = calculateReadingTime(content);
  return showWordCount ? result.detailedStats : result.formattedTime;
}
