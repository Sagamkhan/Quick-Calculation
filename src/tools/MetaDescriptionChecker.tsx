import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Laptop, Smartphone, Search, AlertCircle, FileText } from 'lucide-react';
import { ToolComponentProps } from './registry';

function estimatePixelWidthDesc(text: string): number {
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (/[ilI1|\.,:;']/.test(char)) width += 4;
    else if (/[wWmM]/.test(char)) width += 12;
    else if (/[A-Z]/.test(char)) width += 9.5;
    else if (/[0-9]/.test(char)) width += 8;
    else if (char === ' ') width += 4;
    else width += 7.2;
  }
  return Math.round(width);
}

export default function MetaDescriptionChecker({ tool, onBack }: ToolComponentProps) {
  const [description, setDescription] = useState<string>(
    'Free online financial, health, developer, and SEO calculators with 100% in-browser processing. Zero registration, instant calculations, and complete user data privacy.'
  );
  const [focusKeyword, setFocusKeyword] = useState<string>('calculators');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState<boolean>(false);

  const charCount = description.length;
  const pixelWidth = estimatePixelWidthDesc(description);

  // Desktop limit is ~960px (~155-160 chars); Mobile limit is ~680px (~120 chars)
  const maxPixels = deviceMode === 'desktop' ? 960 : 680;
  const maxChars = deviceMode === 'desktop' ? 160 : 120;
  const minChars = 110;

  const isTooShort = charCount > 0 && charCount < minChars;
  const isOptimal = charCount >= minChars && charCount <= maxChars && pixelWidth <= maxPixels;
  const isTooLong = charCount > maxChars || pixelWidth > maxPixels;

  const status = useMemo(() => {
    if (charCount === 0) return { text: 'Empty Description', badge: 'bg-slate-800 text-slate-400' };
    if (isTooLong) return { text: 'Too Long (Will Truncate)', badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/30' };
    if (isOptimal) return { text: 'Perfect Length for SERP', badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' };
    if (isTooShort) return { text: 'Too Short (Expand More)', badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/30' };
    return { text: 'Acceptable', badge: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' };
  }, [charCount, isTooLong, isOptimal, isTooShort]);

  const truncatedDesc = useMemo(() => {
    if (pixelWidth <= maxPixels) return description;
    let truncated = '';
    for (let i = 0; i < description.length; i++) {
      if (estimatePixelWidthDesc(truncated + description[i] + '...') > maxPixels) break;
      truncated += description[i];
    }
    return truncated.trim() + '...';
  }, [description, pixelWidth, maxPixels]);

  const handleCopy = () => {
    navigator.clipboard.writeText(description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Meta Description Checker - SERP Character Counter & Snippet Preview
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Optimize your SEO meta description length, pixel bounds, and keyword prominence to maximize click-through rate (CTR).
        </p>
      </div>

      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-cyan-400" /> Meta Description Content
          </label>
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setDeviceMode('desktop')}
              className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1 transition-all ${
                deviceMode === 'desktop' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" /> Desktop
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode('mobile')}
              className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1 transition-all ${
                deviceMode === 'mobile' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile
            </button>
          </div>
        </div>

        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter meta description tag content..."
          className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:outline-none focus:border-cyan-500 placeholder:text-slate-600 resize-none"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          <div>
            <label className="text-[11px] text-slate-400 font-semibold block mb-1">Focus Target Keyword (for SERP bolding preview)</label>
            <input
              type="text"
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              placeholder="e.g. calculators"
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={() => setDescription('')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Description'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Character Count</span>
            <span className="font-mono text-slate-300 font-bold">{charCount} / {maxChars}</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-300 ${
                charCount > maxChars ? 'bg-rose-500' : charCount >= minChars ? 'bg-emerald-400' : 'bg-cyan-400'
              }`}
              style={{ width: `${Math.min(100, (charCount / maxChars) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">Ideal: 120 – 160 characters</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Pixel Width</span>
            <span className="font-mono text-cyan-400 font-bold">{pixelWidth} px / {maxPixels} px</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-300 ${
                pixelWidth > maxPixels ? 'bg-rose-500' : pixelWidth >= (maxPixels - 80) ? 'bg-emerald-400' : 'bg-cyan-400'
              }`}
              style={{ width: `${Math.min(100, (pixelWidth / maxPixels) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">Max display boundary: ~{maxPixels}px</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 flex flex-col justify-between">
          <span className="text-xs text-slate-400">CTR Optimization Status</span>
          <div className="mt-1">
            <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${status.badge}`}>
              {status.text}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {focusKeyword && description.toLowerCase().includes(focusKeyword.toLowerCase()) ? 'Keyword match detected' : 'Keyword not found in text'}
          </p>
        </div>
      </div>

      {/* Snippet Preview */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            Live Search Snippet ({deviceMode === 'desktop' ? 'Desktop' : 'Mobile'})
          </span>
          <span className="text-[11px] text-slate-500">Google Result Card</span>
        </div>

        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 max-w-2xl">
          <div className="text-[12px] text-slate-400 flex items-center gap-1.5">
            <span className="text-emerald-400">https://example.com</span>
            <span className="text-slate-600">›</span>
            <span className="text-slate-400 truncate">tools</span>
          </div>
          <h3 className="text-blue-400 hover:underline cursor-pointer text-base font-medium leading-snug">
            Free Online Web Calculators & Developer Toolkit
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {truncatedDesc || 'Enter a meta description above to preview how it appears in search results...'}
          </p>
        </div>
      </div>

      {/* 3-Line FAQ */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-cyan-400" /> Frequently Asked Questions
        </h4>
        <div className="space-y-2 text-xs text-slate-400 divide-y divide-slate-800/80">
          <div className="pt-2">
            <strong className="text-slate-300">How long should a meta description be for Google in 2026?</strong>
            <p className="mt-0.5">Google truncates descriptions beyond 155–160 characters (approx. 960 pixels) on desktop, and ~120 characters on mobile devices.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Do meta descriptions directly improve search rankings?</strong>
            <p className="mt-0.5">While not a direct algorithmic factor, a compelling meta description significantly lifts Click-Through Rate (CTR), driving more organic traffic.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Why does Google sometimes ignore my meta description?</strong>
            <p className="mt-0.5">Google automatically extracts snippets from on-page content if the page copy is considered more relevant to the searcher's query than the tag.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
