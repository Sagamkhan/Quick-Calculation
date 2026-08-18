import React, { useState } from 'react';
import { Globe, Smartphone, Monitor, Copy, Check, Sparkles, ExternalLink } from 'lucide-react';
import { triggerConfetti } from '../../utils/confetti';

interface SerpSimulatorProps {
  initialTitle?: string;
  initialDescription?: string;
  initialUrl?: string;
  isPixelCalculatorOnly?: boolean;
}

export function SerpSimulator({
  initialTitle = 'Quick Calculator - 250+ Free Online Financial, SEO & Developer Tools',
  initialDescription = 'Discover fast, private, and 100% free online calculators, SEO webmaster utilities, JSON formatters, PDF compressors, and AI prompts. Zero signup required.',
  initialUrl = 'https://quickcalculator.app/category/seo-website-tools',
  isPixelCalculatorOnly = false
}: SerpSimulatorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [url, setUrl] = useState(initialUrl);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [brandSuffix, setBrandSuffix] = useState(' | Quick Calculator');
  const [rating, setRating] = useState('4.9');
  const [reviewCount, setReviewCount] = useState('1,420');
  const [copied, setCopied] = useState(false);

  // Approximate proportional pixel calculation for Arial 20px (Google SERP standard)
  const calculatePixelWidth = (text: string): number => {
    let px = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if ('ijl|!.:;'.includes(char)) px += 4.5;
      else if ('frtI'.includes(char)) px += 6.5;
      else if ('mwMWOQ@%'.includes(char)) px += 14.5;
      else if (char >= 'A' && char <= 'Z') px += 11.5;
      else if (char === ' ') px += 4.5;
      else px += 8.5;
    }
    return Math.round(px);
  };

  const fullTitle = isPixelCalculatorOnly ? `${title}${brandSuffix}` : title;
  const titlePixels = calculatePixelWidth(fullTitle);
  const maxTitlePixels = device === 'desktop' ? 580 : 640;
  const titleCharCount = fullTitle.length;
  const descCharCount = description.length;

  const isTitleTruncated = titlePixels > maxTitlePixels;
  const isDescTruncated = descCharCount > (device === 'desktop' ? 158 : 120);

  const cleanDomain = url.replace(/^https?:\/\//, '').split('/')[0] || 'quickcalculator.app';
  const breadcrumbPath = url.replace(/^https?:\/\/[^\/]+/, '').replace(/\/$/, '') || '/category/seo';

  const handleCopyMetaTags = () => {
    const code = `<!-- Primary Meta Tags -->
<title>${fullTitle}</title>
<meta name="title" content="${fullTitle}" />
<meta name="description" content="${description}" />
<link rel="canonical" href="${url}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${fullTitle}" />
<meta property="og:description" content="${description}" />

<!-- Twitter / X -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${fullTitle}" />
<meta property="twitter:description" content="${description}" />`;

    navigator.clipboard.writeText(code);
    setCopied(true);
    triggerConfetti(0.3);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Device & Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/90 border border-cyan-500/20">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-cyan-500/20">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              device === 'desktop' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop SERP</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              device === 'mobile' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile SERP</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopyMetaTags}
          className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono flex items-center gap-1.5 transition-all cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Meta Tags!' : 'Copy Head HTML'}</span>
        </button>
      </div>

      {/* Input Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title Input & Pixel Width Meter */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold text-cyan-300">SEO Page Title Tag</label>
            <span className={`text-xs font-mono font-bold ${isTitleTruncated ? 'text-amber-400' : 'text-emerald-400'}`}>
              {titlePixels}px / {maxTitlePixels}px max ({titleCharCount} chars)
            </span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-sans text-white focus:outline-none focus:border-cyan-400"
            placeholder="Enter high-ranking page title..."
          />
          {/* Visual Pixel Gauge */}
          <div className="space-y-1">
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  titlePixels <= 500
                    ? 'bg-emerald-400'
                    : titlePixels <= maxTitlePixels
                    ? 'bg-cyan-400'
                    : 'bg-amber-400'
                }`}
                style={{ width: `${Math.min(100, (titlePixels / maxTitlePixels) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>0px (Too Short)</span>
              <span>450px - 580px (Optimal)</span>
              <span>600px+ (Truncation ...)</span>
            </div>
          </div>

          {isPixelCalculatorOnly && (
            <div className="pt-2">
              <label className="text-[11px] font-mono text-slate-400">Brand Suffix</label>
              <input
                type="text"
                value={brandSuffix}
                onChange={(e) => setBrandSuffix(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-200"
              />
            </div>
          )}
        </div>

        {/* URL & Meta Description */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono font-bold text-cyan-300">Target Canonical URL</label>
              <span className="text-[11px] font-mono text-slate-400">{cleanDomain}</span>
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-mono font-bold text-cyan-300">Meta Description</label>
              <span className={`text-xs font-mono font-bold ${descCharCount > 160 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {descCharCount} / 160 chars
              </span>
            </div>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-sans text-slate-200 focus:outline-none focus:border-cyan-400"
              placeholder="Action-driven meta description summarizing content value..."
            />
          </div>
        </div>
      </div>

      {/* Realistic Google Search Simulator Box */}
      <div className="p-6 rounded-3xl bg-white text-slate-900 border border-slate-200 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs text-slate-400 font-sans">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-600">Google Search Live Simulator ({device})</span>
          </div>
          <span>About 14,800,000 results (0.28 seconds)</span>
        </div>

        {/* Desktop / Mobile Search Snippet Card */}
        <div className={`space-y-1.5 ${device === 'mobile' ? 'max-w-md p-4 rounded-2xl bg-slate-50 border border-slate-200' : 'max-w-2xl'}`}>
          {/* Favicon & Breadcrumb URL */}
          <div className="flex items-center gap-2 text-xs text-slate-800">
            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-cyan-600 font-bold text-[10px] shrink-0">
              QC
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-slate-800 text-xs">{cleanDomain}</span>
              <span className="text-[11px] text-slate-500 font-mono truncate">{url}</span>
            </div>
          </div>

          {/* Blue Title Link */}
          <h4 className="text-xl font-normal text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-1">
            {fullTitle}
          </h4>

          {/* Rich Snippet Star Rating */}
          <div className="flex items-center gap-1 text-xs text-slate-600">
            <div className="flex text-amber-500">
              {'★★★★★'.split('').map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
            <span className="font-bold text-slate-700">Rating: {rating}/5</span>
            <span>·</span>
            <span>{reviewCount} reviews</span>
            <span>·</span>
            <span className="text-emerald-700 font-semibold">Free Online</span>
          </div>

          {/* Meta Description snippet */}
          <p className="text-sm text-[#4d5156] leading-relaxed font-sans">
            <span className="text-slate-500">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} — </span>
            {description}
          </p>

          {/* Sitelinks Mini Simulation */}
          <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-slate-100/70">
              <span className="text-[#1a0dab] font-semibold hover:underline block cursor-pointer">Popular Tools</span>
              <span className="text-[11px] text-slate-500">Explore 250+ instant online calculators.</span>
            </div>
            <div className="p-2 rounded bg-slate-100/70">
              <span className="text-[#1a0dab] font-semibold hover:underline block cursor-pointer">SEO Webmaster Tools</span>
              <span className="text-[11px] text-slate-500">Audit meta tags, robots.txt, and sitemaps.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
