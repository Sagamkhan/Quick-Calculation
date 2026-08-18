import { calculateReadingTime } from '../utils/readingTime';

export interface BlogPostHeading {
  id: string;
  text: string;
  level: number; // 2 for H2, 3 for H3
}

export interface BlogPost {
  slug: string;
  title: string;
  metaDescription: string;
  focusKeyword: string;
  publishedAt: string;
  formattedDate: string;
  category: 'SEO Tools' | 'Finance Guides' | 'Developer Tips' | 'Tech News' | string;
  coverImage?: string;
  featuredImage?: string;
  coverImageAlt?: string;
  imageAlt?: string;
  isFeatured: boolean;
  author: string;
  authorRole: string;
  body: string;
  readTime: string;
  wordCount: number;
  headings: BlogPostHeading[];
}

/**
 * Simple, robust frontmatter parser for browser and Node.js environments
 */
export function parseFrontmatter(rawContent: string): { data: Record<string, any>; content: string } {
  const frontmatterRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]*([\s\S]*)$/;
  const match = frontmatterRegex.exec(rawContent.trim());

  if (!match) {
    return { data: {}, content: rawContent };
  }

  const yamlBlock = match[1];
  const markdownBody = match[2];
  const data: Record<string, any> = {};

  const lines = yamlBlock.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex > 0) {
      const key = trimmed.slice(0, colonIndex).trim();
      let value = trimmed.slice(colonIndex + 1).trim();

      // Strip surrounding quotes
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Convert booleans
      if (value.toLowerCase() === 'true') {
        data[key] = true;
      } else if (value.toLowerCase() === 'false') {
        data[key] = false;
      } else {
        data[key] = value;
      }
    }
  }

  return { data, content: markdownBody };
}

/**
 * Extracts Table of Contents headings (H2, H3) with anchor slugs
 */
export function extractHeadings(markdown: string): BlogPostHeading[] {
  const headings: BlogPostHeading[] = [];
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const rawText = match[2].trim();
    // Remove markdown links, bold, code wrappers
    const cleanText = rawText
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/[*_`]/g, '')
      .trim();

    const id = cleanText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    headings.push({
      id: id || `heading-${headings.length}`,
      text: cleanText,
      level
    });
  }

  return headings;
}

/**
 * Format ISO date to Human readable "Month Day, Year"
 */
export function formatBlogDate(isoDateStr: string): string {
  try {
    const date = new Date(isoDateStr);
    if (isNaN(date.getTime())) return isoDateStr;
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return isoDateStr;
  }
}

// Statically import all markdown files from /content/blogs via Vite glob
let cachedBlogPosts: BlogPost[] | null = null;

export const CUSTOM_POSTS_STORAGE_KEY = 'quickcalc_cms_custom_posts';
export const CUSTOM_CATEGORIES_STORAGE_KEY = 'quickcalc_cms_custom_categories';

export function invalidateBlogCache(): void {
  cachedBlogPosts = null;
}

export function getAllBlogPosts(): BlogPost[] {
  if (cachedBlogPosts) {
    return cachedBlogPosts;
  }

  const rawBlogFiles = ((import.meta as any).glob('/content/blogs/*.md', {
    query: '?raw',
    import: 'default',
    eager: true
  }) || {}) as Record<string, string>;

  const postsMap = new Map<string, BlogPost>();

  // 1. Load static markdown files
  for (const [filePath, fileContent] of Object.entries(rawBlogFiles)) {
    const { data, content } = parseFrontmatter(fileContent);

    // Determine slug from frontmatter or filename
    const fileSlug = filePath.split('/').pop()?.replace('.md', '') || 'article';
    const slug = (data.slug || fileSlug).toLowerCase().trim();

    const stats = calculateReadingTime([content]);
    const headings = extractHeadings(content);
    const publishedAt = data.publishedAt || new Date().toISOString();

    const imgUrl = data.featuredImage || data.coverImage;
    const imgAlt = data.imageAlt || data.coverImageAlt || data.title;

    postsMap.set(slug, {
      slug,
      title: data.title || 'Untitled Guide',
      metaDescription: data.metaDescription || data.excerpt || content.slice(0, 150),
      focusKeyword: data.focusKeyword || '',
      publishedAt,
      formattedDate: formatBlogDate(publishedAt),
      category: data.category || 'Developer Tips',
      coverImage: imgUrl,
      featuredImage: imgUrl,
      coverImageAlt: imgAlt,
      imageAlt: imgAlt,
      isFeatured: Boolean(data.isFeatured),
      author: data.author || 'Shahroz Khan',
      authorRole: data.authorRole || 'Founder & Lead Developer',
      body: content,
      readTime: stats.detailedStats,
      wordCount: stats.words,
      headings
    });
  }

  // 2. Load custom / CMS generated posts from localStorage (if in browser)
  if (typeof window !== 'undefined') {
    try {
      const savedCustomPosts = localStorage.getItem(CUSTOM_POSTS_STORAGE_KEY);
      if (savedCustomPosts) {
        const customList: BlogPost[] = JSON.parse(savedCustomPosts);
        if (Array.isArray(customList)) {
          for (const post of customList) {
            if (post && post.slug) {
              const normalizedSlug = post.slug.toLowerCase().trim();
              const stats = calculateReadingTime([post.body || '']);
              const headings = post.headings && post.headings.length > 0 
                ? post.headings 
                : extractHeadings(post.body || '');

              postsMap.set(normalizedSlug, {
                ...post,
                slug: normalizedSlug,
                formattedDate: formatBlogDate(post.publishedAt || new Date().toISOString()),
                readTime: stats.detailedStats,
                wordCount: stats.words,
                headings
              });
            }
          }
        }
      }
    } catch (err) {
      console.warn('[blogPosts] Error parsing custom CMS posts from localStorage:', err);
    }
  }

  const posts = Array.from(postsMap.values());

  // Sort by published date descending (newest first)
  posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  cachedBlogPosts = posts;
  return posts;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const posts = getAllBlogPosts();
  const normalizedSlug = slug.toLowerCase().trim();
  return posts.find((p) => p.slug === normalizedSlug);
}

export function getRelatedBlogPosts(currentPost: BlogPost, limit = 3): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts
    .filter((p) => p.slug !== currentPost.slug)
    .sort((a, b) => {
      // Prioritize same category
      if (a.category === currentPost.category && b.category !== currentPost.category) return -1;
      if (b.category === currentPost.category && a.category !== currentPost.category) return 1;
      return 0;
    })
    .slice(0, limit);
}

export const BLOG_CATEGORIES = [
  'All Guides'
] as const;

export function getAllBlogCategories(): string[] {
  const dynamicSet = new Set<string>(['All Guides']);

  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(CUSTOM_CATEGORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          for (const c of parsed) {
            if (c && c.name && c.name.trim()) {
              dynamicSet.add(c.name.trim());
            }
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // Also include any categories present in loaded articles
  const posts = getAllBlogPosts();
  for (const post of posts) {
    if (post.category && post.category.trim()) {
      dynamicSet.add(post.category.trim());
    }
  }

  return Array.from(dynamicSet);
}
