import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pingSitemapToSearchEngines, submitUrlsToIndexNow } from '../src/utils/searchEnginePinger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const blogsDir = path.join(rootDir, 'content', 'blogs');

// Command line args parser
const args = process.argv.slice(2);
const isCronMode = args.includes('--cron');
const intervalArg = args.find(a => a.startsWith('--interval='));
const intervalHours = intervalArg ? parseFloat(intervalArg.split('=')[1]) : 6;

const DEFAULT_BASE_URL = process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://quickcalculator.app';
const sitemapUrl = `${DEFAULT_BASE_URL.replace(/\/+$/, '')}/sitemap.xml`;

/**
 * Discovers all Markdown blog post URLs
 */
function getBlogUrls(baseUrl: string): string[] {
  const urls: string[] = [];
  
  // 1. Check content/blogs
  if (fs.existsSync(blogsDir)) {
    const files = fs.readdirSync(blogsDir);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const fullPath = path.join(blogsDir, file);
        const content = fs.readFileSync(fullPath, 'utf-8');
        const slugMatch = content.match(/slug:\s*["']?([^"'\r\n]+)["']?/);
        const slug = slugMatch ? slugMatch[1].trim() : file.replace('.md', '');
        urls.push(`${baseUrl}/blog/${slug}`);
      }
    }
  }

  // 2. Default Seed Slugs if content/blogs empty
  if (urls.length === 0) {
    const seedSlugs = [
      'essential-financial-calculators-2026',
      'core-web-vitals-seo-tools-guide',
      'ultimate-developer-toolbelt-debugging',
      'client-side-browser-security-ai-trends'
    ];
    seedSlugs.forEach(s => urls.push(`${baseUrl}/blog/${s}`));
  }

  return urls;
}

/**
 * Performs a single search engine broadcast
 */
async function executePingTask() {
  const timestamp = new Date().toISOString();
  console.log(`\n======================================================`);
  console.log(`[Search Engine Cron] Running Ping & Indexing Task at ${timestamp}`);
  console.log(`[Target Sitemap] ${sitemapUrl}`);
  console.log(`======================================================`);

  try {
    // 1. Ping Google & Bing with sitemap.xml
    console.log(`📡 Pinging Google & Bing with sitemap...`);
    const { google, bing } = await pingSitemapToSearchEngines(sitemapUrl);

    console.log(`  ✓ Google: [HTTP ${google.httpStatus || 200}] ${google.message} (${google.durationMs}ms)`);
    console.log(`  ✓ Bing:   [HTTP ${bing.httpStatus || 200}] ${bing.message} (${bing.durationMs}ms)`);

    // 2. Submit blog URLs to IndexNow
    const blogUrls = getBlogUrls(DEFAULT_BASE_URL);
    if (blogUrls.length > 0) {
      console.log(`\n🚀 Submitting ${blogUrls.length} blog post URLs to IndexNow protocol...`);
      const indexNowResult = await submitUrlsToIndexNow(blogUrls, { sitemapUrl });
      console.log(`  ✓ IndexNow: [HTTP ${indexNowResult.httpStatus || 200}] ${indexNowResult.message} (${indexNowResult.durationMs}ms)`);
    }

    console.log(`\n✅ Task completed successfully.\n`);
  } catch (err) {
    console.error(`❌ Error during search engine ping:`, err);
  }
}

// Execution Logic
if (isCronMode) {
  const intervalMs = intervalHours * 60 * 60 * 1000;
  console.log(`⚡ [Search Engine Cron Daemon] Started. Running every ${intervalHours} hour(s) (${intervalMs}ms).`);
  console.log(`Press Ctrl+C to terminate background daemon.\n`);

  // Run initial ping
  executePingTask();

  // Schedule recurring cron
  const timer = setInterval(() => {
    executePingTask();
  }, intervalMs);

  // Handle graceful termination
  process.on('SIGINT', () => {
    console.log('\n[Search Engine Cron] Shutting down scheduler gracefully.');
    clearInterval(timer);
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n[Search Engine Cron] Received SIGTERM. Exiting.');
    clearInterval(timer);
    process.exit(0);
  });
} else {
  // One-off CLI run
  executePingTask().then(() => {
    process.exit(0);
  });
}
