import React, { useState } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Smartphone, Globe, ExternalLink, RefreshCw } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function SerpPreviewMobile({ tool, onBack }: ToolComponentProps) {
  const [siteName, setSiteName] = useState<string>('Quick Calculator');
  const [url, setUrl] = useState<string>('https://quickcalc.online/finance/sip-calculator');
  const [title, setTitle] = useState<string>('SIP Calculator 2026 - Monthly Mutual Fund Returns with Inflation');
  const [description, setDescription] = useState<string>(
    'Calculate your SIP mutual fund returns with step-up investments and inflation adjustments. Free 100% in-browser wealth projector.'
  );
  const [hasSitelinks, setHasSitelinks] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const displayDomain = (() => {
    try {
      const u = new URL(url.startsWith('http') ? url : `https://${url}`);
      return u.hostname;
    } catch {
      return 'example.com';
    }
  })();

  const breadcrumbs = (() => {
    try {
      const u = new URL(url.startsWith('http') ? url : `https://${url}`);
      const parts = u.pathname.split('/').filter(Boolean);
      return parts.length > 0 ? parts.join(' › ') : 'tools';
    } catch {
      return 'tools';
    }
  })();

  const handleCopy = () => {
    const snippet = `Mobile SERP Data:
Site Name: ${siteName}
URL: ${url}
Title: ${title}
Description: ${description}`;
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Mobile SERP Preview Tool - Smartphone Google Search Snippet Simulator
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Inspect how your web pages render on mobile Google search result pages including site name, favicon, breadcrumbs, and sitelinks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-400" /> Page Meta Parameters
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Brand / Site Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Canonical URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span className="font-semibold">Mobile Title Tag</span>
                <span className={title.length > 60 ? 'text-amber-400' : 'text-slate-400'}>{title.length} chars</span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span className="font-semibold">Mobile Meta Description</span>
                <span className={description.length > 130 ? 'text-amber-400' : 'text-slate-400'}>{description.length} chars</span>
              </div>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasSitelinks}
                  onChange={(e) => setHasSitelinks(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
                />
                Include Mock Sitelinks / Quick Actions
              </label>

              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Mobile Phone Mockup */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm rounded-[2.5rem] bg-[#0f172a] border-4 border-slate-700 p-3 shadow-2xl relative">
            {/* Phone Notch/Speaker */}
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-3" />

            {/* Google Search Bar Mock */}
            <div className="bg-[#1f2937] rounded-full px-3.5 py-2 flex items-center justify-between text-xs text-slate-400 mb-3 border border-slate-700/60">
              <div className="flex items-center gap-2 truncate">
                <span className="text-blue-400 font-bold font-display">G</span>
                <span className="truncate text-slate-300 text-[11px]">{displayDomain}</span>
              </div>
              <Smartphone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            </div>

            {/* Mobile Result Card */}
            <div className="bg-white text-slate-900 rounded-2xl p-4 shadow space-y-2 font-sans border border-slate-200">
              {/* Header row */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {siteName.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden leading-tight">
                  <div className="text-xs font-semibold text-slate-800 truncate">{siteName || 'Site Name'}</div>
                  <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                    <span>{displayDomain}</span>
                    <span>›</span>
                    <span>{breadcrumbs}</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-blue-700 font-medium text-sm leading-snug line-clamp-2 cursor-pointer hover:underline">
                {title || 'Sample Title Tag Content for Mobile Search Engine'}
              </h3>

              {/* Snippet */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {description || 'Your meta description will be highlighted here in search result listings with mobile-optimized line clamping.'}
              </p>

              {/* Sitelinks */}
              {hasSitelinks && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                  <div className="p-1.5 rounded bg-slate-50 border border-slate-200/80 text-blue-700 font-medium truncate">
                    Free SIP Calculator
                  </div>
                  <div className="p-1.5 rounded bg-slate-50 border border-slate-200/80 text-blue-700 font-medium truncate">
                    Lump Sum Calculator
                  </div>
                  <div className="p-1.5 rounded bg-slate-50 border border-slate-200/80 text-blue-700 font-medium truncate">
                    Inflation Adjustment
                  </div>
                  <div className="p-1.5 rounded bg-slate-50 border border-slate-200/80 text-blue-700 font-medium truncate">
                    Step Up Mutual Funds
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Home Indicator */}
            <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mt-4" />
          </div>
        </div>
      </div>

      {/* 3-Line FAQ */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-cyan-400" /> Frequently Asked Questions
        </h4>
        <div className="space-y-2 text-xs text-slate-400 divide-y divide-slate-800/80">
          <div className="pt-2">
            <strong className="text-slate-300">How does Google mobile search differ from desktop search results?</strong>
            <p className="mt-0.5">Mobile SERP highlights prominent brand favicons, full site name headers, and wraps titles across up to two lines before truncating.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">How do I control the site name displayed in mobile Google search?</strong>
            <p className="mt-0.5">Specify structured JSON-LD `WebSite` schema markup with `name` and `alternateName` properties to guide Google's brand selector.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">What is the safe mobile snippet character limit?</strong>
            <p className="mt-0.5">Aim for around 110 to 125 characters so critical value propositions remain visible before Google's mobile text boundary cut-off.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
