import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSitemapXml, generateRobotsTxt, getSitemapUrlItems } from '../src/utils/sitemapGenerator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const blogsDir = path.join(rootDir, 'content', 'blogs');

/**
 * Scans content/blogs directory for markdown files and extracts frontmatter metadata
 */
function discoverBlogPosts() {
  const posts: Array<{ slug: string; title?: string; lastmod?: string; category?: string }> = [];

  if (fs.existsSync(blogsDir)) {
    const files = fs.readdirSync(blogsDir);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const fullPath = path.join(blogsDir, file);
        const content = fs.readFileSync(fullPath, 'utf-8');
        
        // Extract frontmatter
        const slugMatch = content.match(/slug:\s*["']?([^"'\r\n]+)["']?/);
        const titleMatch = content.match(/title:\s*["']?([^"'\r\n]+)["']?/);
        const dateMatch = content.match(/publishedAt:\s*["']?([^"'\r\n]+)["']?/);
        const catMatch = content.match(/category:\s*["']?([^"'\r\n]+)["']?/);

        const fileSlug = file.replace('.md', '');
        const slug = (slugMatch ? slugMatch[1].trim() : fileSlug).toLowerCase();
        const title = titleMatch ? titleMatch[1].trim() : fileSlug;
        const lastmod = dateMatch ? dateMatch[1].trim().split('T')[0] : undefined;
        const category = catMatch ? catMatch[1].trim() : undefined;

        posts.push({ slug, title, lastmod, category });
      }
    }
  }

  return posts;
}

export function generateSitemapAndRobots(customBaseUrl?: string) {
  try {
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const baseUrl = customBaseUrl || process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://quickcalculator.app';
    const blogPosts = discoverBlogPosts();

    console.log(`[Sitemap Generator] Starting sitemap & robots.txt build for: ${baseUrl}`);
    console.log(`[Sitemap Generator] Discovered ${blogPosts.length} Markdown blog posts in content/blogs/`);

    // Generate Sitemap Items & XML
    const urlItems = getSitemapUrlItems({ baseUrl, blogPosts });
    const sitemapXml = generateSitemapXml({ baseUrl, blogPosts });
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    
    fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');
    console.log(`[Sitemap Generator] Successfully generated sitemap.xml with ${urlItems.length} total URLs at ${sitemapPath}`);

    // Generate Robots.txt
    const robotsTxt = generateRobotsTxt(baseUrl);
    const robotsPath = path.join(publicDir, 'robots.txt');
    fs.writeFileSync(robotsPath, robotsTxt, 'utf-8');
    console.log(`[Robots Generator] Successfully generated compliant robots.txt at ${robotsPath}`);

    return { success: true, count: urlItems.length, sitemapPath, robotsPath };
  } catch (err) {
    console.error('[Sitemap Generator] Error during generation:', err);
    throw err;
  }
}

// Execute immediately when run as CLI
generateSitemapAndRobots();
