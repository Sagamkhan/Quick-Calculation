import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, AlertTriangle, CheckCircle, Search, Laptop, Smartphone } from 'lucide-react';
import { ToolComponentProps } from './registry';

// Pixel width approximation for standard Arial/Roboto search font
function estimatePixelWidth(text: string): number {
  let width = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (/[ilI1|\.,:;']/.test(char)) width += 4.5;
    else if (/[wWmM]/.test(char)) width += 14.5;
    else if (/[A-Z]/.test(char)) width += 11;
    else if (/[0-9]/.test(char)) width += 9.5;
    else if (char === ' ') width += 4.5;
    else width += 8.5; // average lowercase
  }
  return Math.round(width);
}

export default function MetaTitleLengthChecker({ tool, onBack }: ToolComponentProps) {
  const [title, setTitle] = useState<string>('Quick Calculator - 250+ All-in-One Free Online Calculators & Dev Tools');
  const [copied, setCopied] = useState<boolean>(false);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  const charCount = title.length;
  const pixelWidth = estimatePixelWidth(title);

  // Desktop pixel limit is ~580px - 600px; Mobile is ~560px
  const maxPixels = deviceMode === 'desktop' ? 580 : 540;
  const maxChars = 60;

  const isTooShort = charCount > 0 && charCount < 30;
  const isOptimal = charCount >= 45 && charCount <= 60 && pixelWidth <= maxPixels;
  const isTooLong = charCount > maxChars || pixelWidth > maxPixels;

  const statusLabel = useMemo(() => {
    if (charCount === 0) return { text: 'Empty Title', color: 'text-slate-400', badge: 'bg-slate-800 text-slate-300' };
    if (isTooLong) return { text: 'Too Long - Truncated on Google', color: 'text-rose-400', badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/30' };
    if (isOptimal) return { text: 'Optimal SERP Length', color: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' };
    if (isTooShort) return { text: 'Too Short - Underutilized', color: 'text-amber-400', badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/30' };
    return { text: 'Acceptable Length', color: 'text-cyan-400', badge: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' };
  }, [charCount, isTooLong, isOptimal, isTooShort]);

  const truncatedTitle = useMemo(() => {
    if (pixelWidth <= maxPixels) return title;
    let truncated = '';
    for (let i = 0; i < title.length; i++) {
      if (estimatePixelWidth(truncated + title[i] + '...') > maxPixels) break;
      truncated += title[i];
    }
    return truncated.trim() + '...';
  }, [title, pixelWidth, maxPixels]);

  const handleCopy = () => {
    navigator.clipboard.writeText(title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const insertSeparator = (sep: string) => {
    setTitle(prev => prev.trim() + ' ' + sep + ' ');
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Header */}
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Meta Title Length Checker - Google SERP Pixel Width & Character Counter
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Verify SEO page title length against Google's desktop and mobile display algorithms to avoid snippet truncation.
        </p>
      </div>

      {/* Input Section */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-semibold text-slate-200">
            Page Title Tag (<code className="text-cyan-400 font-mono">&lt;title&gt;</code>)
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your webpage meta title here..."
          className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:outline-none focus:border-cyan-500 placeholder:text-slate-600 resize-none"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Quick Separators:</span>
            {['|', '-', '–', '•', '»'].map((sep) => (
              <button
                key={sep}
                type="button"
                onClick={() => insertSeparator(sep)}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 font-mono text-xs transition"
              >
                {sep}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTitle('')}
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
              {copied ? 'Copied!' : 'Copy Title'}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bars & Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Character Card */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Character Count</span>
            <span className="font-mono text-slate-300 font-bold">{charCount} / 60</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-300 ${
                charCount > 60 ? 'bg-rose-500' : charCount >= 45 ? 'bg-emerald-400' : 'bg-cyan-400'
              }`}
              style={{ width: `${Math.min(100, (charCount / 60) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">Target range: 50 – 60 characters</p>
        </div>

        {/* Pixel Width Card */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>SERP Pixel Width</span>
            <span className="font-mono text-cyan-400 font-bold">{pixelWidth} px / {maxPixels} px</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-300 ${
                pixelWidth > maxPixels ? 'bg-rose-500' : pixelWidth >= (maxPixels - 60) ? 'bg-emerald-400' : 'bg-cyan-400'
              }`}
              style={{ width: `${Math.min(100, (pixelWidth / maxPixels) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">Max limit: ~{maxPixels}px before cutoff</p>
        </div>

        {/* Status Card */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 flex flex-col justify-between">
          <span className="text-xs text-slate-400">SERP Health Status</span>
          <div className="mt-1">
            <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${statusLabel.badge}`}>
              {statusLabel.text}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {isTooLong ? 'Title exceeds viewport limit' : isOptimal ? 'Will render fully in results' : 'Fine, but room to optimize'}
          </p>
        </div>
      </div>

      {/* Live Google Search Preview */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            Google SERP Snippet Simulation ({deviceMode === 'desktop' ? 'Desktop' : 'Mobile'})
          </span>
          <span className="text-[11px] text-slate-500">Font: Arial 20px / 16px</span>
        </div>

        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 max-w-2xl">
          <div className="text-[12px] text-slate-400 flex items-center gap-1.5">
            <span className="text-emerald-400">https://example.com</span>
            <span className="text-slate-600">›</span>
            <span className="text-slate-400 truncate">tools › calculator</span>
          </div>
          <h3 className="text-blue-400 hover:underline cursor-pointer text-base sm:text-lg font-medium leading-snug">
            {truncatedTitle || 'Your Webpage Title Will Appear Here'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Discover lightning-fast web calculation tools with 100% in-browser processing, privacy encryption, and instant zero-latency outputs.
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
            <strong className="text-slate-300">What is the ideal meta title character length for Google SEO?</strong>
            <p className="mt-0.5">Google displays up to 50–60 characters (approximately 580–600 pixels) on desktop and roughly 540 pixels on mobile search results.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Why does Google measure title tags in pixels instead of characters?</strong>
            <p className="mt-0.5">Search engines use proportional fonts like Arial where capital letters like 'W' consume more horizontal pixel space than lowercase letters like 'i'.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Does Google rewrite meta titles if they are too long or poorly optimized?</strong>
            <p className="mt-0.5">Yes, if the title exceeds pixel boundaries or doesn't match searcher intent, Google may rewrite it using H1 headers or internal anchor text.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
