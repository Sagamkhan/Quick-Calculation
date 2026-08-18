import React, { useState } from 'react';
import { 
  Link, 
  HelpCircle, 
  Copy, 
  Check, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileDown, 
  RefreshCw, 
  Sparkles, 
  QrCode,
  Image,
  Layers,
  ArrowRight
} from 'lucide-react';
import { triggerConfetti } from '../../utils/confetti';

interface WebmasterUtilitiesProps {
  mode: 'utm' | 'httpstatus' | 'slug' | 'alttext' | 'anchor' | 'checklist';
}

const HTTP_STATUS_DATABASE: Record<string, { name: string; type: string; meaning: string; seoImpact: string; headerExample: string }> = {
  '200': {
    name: '200 OK',
    type: 'Success',
    meaning: 'The server successfully returned the requested web document.',
    seoImpact: 'Optimal state. Googlebot indexes the content and caches all rendered assets without friction.',
    headerExample: 'HTTP/1.1 200 OK\nContent-Type: text/html; charset=UTF-8\nCache-Control: public, max-age=3600'
  },
  '301': {
    name: '301 Moved Permanently',
    type: 'Redirect',
    meaning: 'The resource has permanently moved to a new canonical URL destination.',
    seoImpact: 'Passes 99% of PageRank link equity to target URL. Old URL is de-indexed by Google in favor of target.',
    headerExample: 'HTTP/1.1 301 Moved Permanently\nLocation: https://quickcalculator.app/new-tool-path'
  },
  '302': {
    name: '302 Found (Temporary Redirect)',
    type: 'Redirect',
    meaning: 'The resource is temporarily residing on a different URL.',
    seoImpact: 'Does NOT transfer full link equity. Google retains old URL in index. Use for temporary maintenance.',
    headerExample: 'HTTP/1.1 302 Found\nLocation: https://quickcalculator.app/temporary-page'
  },
  '304': {
    name: '304 Not Modified',
    type: 'Cache',
    meaning: 'The client cached version is identical to server; no payload re-download needed.',
    seoImpact: 'Saves valuable search crawler bandwidth and accelerates crawl efficiency for large websites.',
    headerExample: 'HTTP/1.1 304 Not Modified\nETag: "33a64df551425fcc3e47197da15e94b9"'
  },
  '404': {
    name: '404 Not Found',
    type: 'Client Error',
    meaning: 'The server cannot find the requested URL.',
    seoImpact: 'Googlebot drops the page from search index over time. Ensure broken inbound backlinks are 301 redirected.',
    headerExample: 'HTTP/1.1 404 Not Found\nContent-Type: text/html; charset=UTF-8'
  },
  '410': {
    name: '410 Gone',
    type: 'Client Error',
    meaning: 'The resource has been deliberately and permanently deleted.',
    seoImpact: 'Fastest de-indexing signal. Googlebot removes 410 URLs from search index much quicker than 404s.',
    headerExample: 'HTTP/1.1 410 Gone\nContent-Type: text/html; charset=UTF-8'
  },
  '500': {
    name: '500 Internal Server Error',
    type: 'Server Error',
    meaning: 'The server encountered an unexpected condition preventing request completion.',
    seoImpact: 'Severe negative SEO risk. If Googlebot sees persistent 500 errors, rankings will plummet rapidly.',
    headerExample: 'HTTP/1.1 500 Internal Server Error\nRetry-After: 120'
  },
  '503': {
    name: '503 Service Unavailable',
    type: 'Server Error',
    meaning: 'Server is temporarily overloaded or down for maintenance.',
    seoImpact: 'Safe maintenance code. Googlebot knows to return later without de-indexing if Retry-After is supplied.',
    headerExample: 'HTTP/1.1 503 Service Unavailable\nRetry-After: 3600'
  }
};

const CHECKLIST_ITEMS = [
  { id: 'c1', cat: 'Crawling & Indexing', text: 'Self-referencing canonical tag verified on page', defaultChecked: true },
  { id: 'c2', cat: 'Crawling & Indexing', text: 'Meta Robots tag allows "index, follow"', defaultChecked: true },
  { id: 'c3', cat: 'Crawling & Indexing', text: 'URL present in XML sitemap with recent lastmod date', defaultChecked: true },
  { id: 'c4', cat: 'Crawling & Indexing', text: 'Robots.txt does not disallow primary content path', defaultChecked: true },
  { id: 'c5', cat: 'On-Page Content', text: 'Page title contains primary target keyword (under 60 chars)', defaultChecked: true },
  { id: 'c6', cat: 'On-Page Content', text: 'Meta description contains call-to-action (140-160 chars)', defaultChecked: true },
  { id: 'c7', cat: 'On-Page Content', text: 'Single H1 tag exactly aligned with page topic', defaultChecked: true },
  { id: 'c8', cat: 'On-Page Content', text: 'All images contain descriptive ALT text attributes', defaultChecked: false },
  { id: 'c9', cat: 'Performance', text: 'Largest Contentful Paint (LCP) under 2.5 seconds', defaultChecked: true },
  { id: 'c10', cat: 'Performance', text: 'Cumulative Layout Shift (CLS) score under 0.1', defaultChecked: true },
  { id: 'c11', cat: 'Performance', text: 'Images compressed with modern WebP format', defaultChecked: true },
  { id: 'c12', cat: 'Security & Mobile', text: 'Valid SSL Certificate active with 100% HTTPS assets', defaultChecked: true },
  { id: 'c13', cat: 'Security & Mobile', text: 'Viewport meta tag present for responsive touchscreens', defaultChecked: true },
  { id: 'c14', cat: 'Schema & Links', text: 'Valid JSON-LD structured schema markup embedded', defaultChecked: true },
  { id: 'c15', cat: 'Schema & Links', text: 'At least 3 relevant internal links connecting site hierarchy', defaultChecked: false }
];

export function WebmasterUtilities({ mode }: WebmasterUtilitiesProps) {
  const [copied, setCopied] = useState(false);

  // 1. UTM Builder State
  const [baseUrl, setBaseUrl] = useState('https://quickcalculator.app/tool/sip-calculator');
  const [utmSource, setUtmSource] = useState('newsletter');
  const [utmMedium, setUtmMedium] = useState('email');
  const [utmCampaign, setUtmCampaign] = useState('march_finance_launch');
  const [utmTerm, setUtmTerm] = useState('mutual_fund_returns');
  const [utmContent, setUtmContent] = useState('header_banner_cta');

  // 2. HTTP Status State
  const [selectedStatusCode, setSelectedStatusCode] = useState('200');

  // 3. Slug Sanitizer State
  const [rawSlugText, setRawSlugText] = useState('250+ Best Free Online Financial & SEO Tools in 2026!');
  const [delimiter, setDelimiter] = useState<'-' | '_'>('-');
  const [stripStopWords, setStripStopWords] = useState(true);

  // 4. Alt Text Helper State
  const [imageSubject, setImageSubject] = useState('Dashboard screenshot of SIP mutual fund return calculator');
  const [focusKeyword, setFocusKeyword] = useState('sip calculator online');
  const [imageType, setImageType] = useState('Infographic');

  // 5. Anchor Text State
  const [anchorInput, setAnchorInput] = useState(
    `sip calculator online\nhttps://quickcalculator.app\nclick here\nquick calculator tools\nbest loan calculator\nvisit website\nquickcalculator`
  );
  const [brandName, setBrandName] = useState('Quick Calculator');

  // 6. Checklist State
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    CHECKLIST_ITEMS.forEach(item => {
      init[item.id] = item.defaultChecked;
    });
    return init;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    triggerConfetti(0.3);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate UTM URL
  const generateUtmUrl = () => {
    try {
      const urlObj = new URL(baseUrl);
      if (utmSource) urlObj.searchParams.set('utm_source', utmSource);
      if (utmMedium) urlObj.searchParams.set('utm_medium', utmMedium);
      if (utmCampaign) urlObj.searchParams.set('utm_campaign', utmCampaign);
      if (utmTerm) urlObj.searchParams.set('utm_term', utmTerm);
      if (utmContent) urlObj.searchParams.set('utm_content', utmContent);
      return urlObj.toString();
    } catch {
      return `${baseUrl}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;
    }
  };

  // Generate Sanitized Slug
  const generateSlug = () => {
    let text = rawSlugText.toLowerCase();
    if (stripStopWords) {
      const stops = ['in', 'the', 'a', 'an', 'and', 'for', 'of', 'to', 'with', 'on', 'at'];
      const words = text.split(/\s+/).filter(w => !stops.includes(w.replace(/[^a-z0-9]/g, '')));
      text = words.join(' ');
    }
    return text
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, delimiter)
      .replace(/-+/g, delimiter);
  };

  // Anchor text breakdown
  const processAnchors = () => {
    const lines = anchorInput.split('\n').map(l => l.trim()).filter(Boolean);
    let exact = 0;
    let branded = 0;
    let naked = 0;
    let generic = 0;

    lines.forEach(l => {
      const low = l.toLowerCase();
      if (low.startsWith('http') || low.includes('.com') || low.includes('.app')) {
        naked++;
      } else if (low.includes(brandName.toLowerCase())) {
        branded++;
      } else if (low.includes('click') || low.includes('website') || low.includes('read more') || low.includes('here')) {
        generic++;
      } else {
        exact++;
      }
    });

    const total = lines.length || 1;
    return {
      total: lines.length,
      exactPct: Math.round((exact / total) * 100),
      brandedPct: Math.round((branded / total) * 100),
      nakedPct: Math.round((naked / total) * 100),
      genericPct: Math.round((generic / total) * 100),
      isPenguinRisk: (exact / total) > 0.45
    };
  };

  // Checklist score
  const completedCount = Object.values(checkedIds).filter(Boolean).length;
  const auditScore = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="space-y-6">
      {/* 1. UTM Builder View */}
      {mode === 'utm' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 space-y-3">
            <div>
              <label className="text-xs font-mono font-bold text-cyan-300">Target Website Base URL</label>
              <input
                type="url"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-mono text-slate-400">utm_source *</label>
                <input
                  type="text"
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  placeholder="google, newsletter"
                  className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400">utm_medium *</label>
                <input
                  type="text"
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                  placeholder="cpc, email, banner"
                  className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400">utm_campaign *</label>
                <input
                  type="text"
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                  placeholder="spring_sale"
                  className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-mono text-slate-400">utm_term (Optional Keyword)</label>
                <input
                  type="text"
                  value={utmTerm}
                  onChange={(e) => setUtmTerm(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-400">utm_content (A/B Test Variant)</label>
                <input
                  type="text"
                  value={utmContent}
                  onChange={(e) => setUtmContent(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Output Tag */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-300">Generated GA4 UTM Tracking URL</span>
              <button
                type="button"
                onClick={() => handleCopy(generateUtmUrl())}
                className="px-3 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied URL!' : 'Copy Campaign Link'}</span>
              </button>
            </div>
            <p className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-teal-300 break-all">
              {generateUtmUrl()}
            </p>
          </div>
        </div>
      )}

      {/* 2. HTTP Status Code Explainer View */}
      {mode === 'httpstatus' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 space-y-3">
            <label className="text-xs font-mono font-bold text-cyan-300">Select HTTP Status Code</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.keys(HTTP_STATUS_DATABASE).map(code => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSelectedStatusCode(code)}
                  className={`p-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedStatusCode === code
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {code} - {HTTP_STATUS_DATABASE[code].name.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>

          {(() => {
            const data = HTTP_STATUS_DATABASE[selectedStatusCode];
            return (
              <div className="p-6 rounded-3xl bg-slate-950 border border-cyan-500/30 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-xl font-display font-bold text-white">{data.name}</h3>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
                    {data.type}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-slate-400">Technical Meaning</span>
                  <p className="text-xs text-slate-200">{data.meaning}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-mono font-bold text-emerald-400">SEO & Googlebot Crawling Impact:</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{data.seoImpact}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-cyan-300">Server Response Header Example</span>
                  <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-teal-300 overflow-x-auto">
                    {data.headerExample}
                  </pre>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 3. Slug Sanitizer View */}
      {mode === 'slug' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 space-y-3">
            <label className="text-xs font-mono font-bold text-cyan-300">Page Title or Unsanitized Headline</label>
            <input
              type="text"
              value={rawSlugText}
              onChange={(e) => setRawSlugText(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-sans text-white focus:outline-none focus:border-cyan-400"
            />

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Separator:</span>
                <button
                  type="button"
                  onClick={() => setDelimiter('-')}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold cursor-pointer ${
                    delimiter === '-' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Hyphen (-)
                </button>
                <button
                  type="button"
                  onClick={() => setDelimiter('_')}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold cursor-pointer ${
                    delimiter === '_' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Underscore (_)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="stripStops"
                  checked={stripStopWords}
                  onChange={(e) => setStripStopWords(e.target.checked)}
                  className="rounded text-cyan-500 bg-slate-900 border-slate-700 cursor-pointer"
                />
                <label htmlFor="stripStops" className="text-xs font-mono text-slate-300 cursor-pointer">
                  Strip Common Stop Words (in, the, a, for...)
                </label>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-300">Sanitized SEO Permalink Slug</span>
              <button
                type="button"
                onClick={() => handleCopy(generateSlug())}
                className="px-3 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied!' : 'Copy Slug'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-emerald-400 font-bold">
              /{generateSlug()}
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              Live SERP Preview: <span className="text-slate-200">https://quickcalculator.app/tool/{generateSlug()}</span>
            </p>
          </div>
        </div>
      )}

      {/* 4. Alt Text & Image SEO Helper View */}
      {mode === 'alttext' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 space-y-3">
            <div>
              <label className="text-xs font-mono font-bold text-cyan-300">Image Visual Subject Description</label>
              <input
                type="text"
                value={imageSubject}
                onChange={(e) => setImageSubject(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-mono text-slate-400">Focus SEO Keyword</label>
                <input
                  type="text"
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400">Image Role / Context</label>
                <select
                  value={imageType}
                  onChange={(e) => setImageType(e.target.value)}
                  className="w-full mt-1 p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-200"
                >
                  <option value="Screenshot">Product / Tool Screenshot</option>
                  <option value="Infographic">Infographic / Diagram</option>
                  <option value="HeroBanner">Hero Banner Graphic</option>
                  <option value="Icon">Navigation Icon</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4">
            <span className="text-xs font-mono font-bold text-cyan-300">Recommended Image Alt Text Variations</span>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">1. SEO Keyword-Aligned Alt Text</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${imageSubject} - ${focusKeyword}`)}
                    className="text-[10px] font-mono text-cyan-300 hover:underline cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-white font-mono">{imageSubject} - {focusKeyword}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">2. Complete HTML &lt;img&gt; Snippet</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(`<img src="/images/${focusKeyword.replace(/\s+/g, '-')}.webp" alt="${imageSubject}" loading="lazy" decoding="async" width="800" height="450" />`)}
                    className="text-[10px] font-mono text-cyan-300 hover:underline cursor-pointer"
                  >
                    Copy HTML
                  </button>
                </div>
                <p className="text-[11px] text-teal-300 font-mono break-all">
                  &lt;img src="/images/{focusKeyword.replace(/\s+/g, '-')}.webp" alt="{imageSubject}" loading="lazy" decoding="async" width="800" height="450" /&gt;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Anchor Text Matrix View */}
      {mode === 'anchor' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-cyan-300">Anchor Text Backlink List (1 per line)</label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">Brand Name:</span>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-36 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300"
                />
              </div>
            </div>
            <textarea
              rows={5}
              value={anchorInput}
              onChange={(e) => setAnchorInput(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-100 focus:outline-none"
            />
          </div>

          {(() => {
            const data = processAnchors();
            return (
              <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="block text-[10px] font-mono text-slate-400">Branded Anchors</span>
                    <span className="text-base font-bold text-cyan-300">{data.brandedPct}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="block text-[10px] font-mono text-slate-400">Exact Match</span>
                    <span className="text-base font-bold text-purple-300">{data.exactPct}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="block text-[10px] font-mono text-slate-400">Naked URLs</span>
                    <span className="text-base font-bold text-emerald-400">{data.nakedPct}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="block text-[10px] font-mono text-slate-400">Generic</span>
                    <span className="text-base font-bold text-amber-400">{data.genericPct}%</span>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                  data.isPenguinRisk ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}>
                  {data.isPenguinRisk ? <AlertTriangle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                  <div>
                    <span className="font-bold text-xs">
                      {data.isPenguinRisk ? 'Google Penguin Over-Optimization Risk' : 'Natural Anchor Profile Verified'}
                    </span>
                    <p className="text-[11px] text-slate-300 leading-tight mt-0.5">
                      {data.isPenguinRisk
                        ? 'Exact match anchors exceed 45%. Increase branded and naked URL links to prevent algorithm devaluation.'
                        : 'Anchor text diversity meets Google natural link profile guidelines (healthy mix of branded and naked URLs).'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 6. Google Indexing Checklist & On-Page Audit Matrix View */}
      {mode === 'checklist' && (
        <div className="space-y-5">
          {/* Health Score Banner */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Technical Indexing Health Score
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl font-display font-bold text-emerald-400">{auditScore}%</span>
                <span className="text-xs font-mono text-slate-300">({completedCount} of {CHECKLIST_ITEMS.length} Factors Verified)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const report = "Google Indexing Checklist Audit Report\n\n" +
                  CHECKLIST_ITEMS.map(i => `[${checkedIds[i.id] ? 'X' : ' '}] ${i.cat}: ${i.text}`).join("\n");
                handleCopy(report);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-display font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <FileDown className="w-4 h-4" />
              <span>{copied ? 'Copied Audit!' : 'Export Checklist Report'}</span>
            </button>
          </div>

          {/* Interactive Checklist Items */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/20 space-y-3">
            <span className="text-xs font-mono font-bold text-cyan-300">
              35-Point On-Page SEO & Indexability Factors
            </span>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {CHECKLIST_ITEMS.map(item => (
                <label
                  key={item.id}
                  className={`p-3 rounded-xl border flex items-center gap-3 text-xs cursor-pointer transition-all ${
                    checkedIds[item.id]
                      ? 'bg-slate-900/80 border-cyan-500/30 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checkedIds[item.id] || false}
                    onChange={(e) => setCheckedIds({ ...checkedIds, [item.id]: e.target.checked })}
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 cursor-pointer"
                  />
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-medium text-slate-200">{item.text}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 shrink-0 self-start sm:self-auto">
                      {item.cat}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
