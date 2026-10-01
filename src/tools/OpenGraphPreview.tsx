import React, { useState } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Share2, Globe, Image as ImageIcon, Code } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function OpenGraphPreview({ tool, onBack }: ToolComponentProps) {
  const [ogTitle, setOgTitle] = useState<string>('Quick Calculator - 250+ All-in-One Free Online Calculators');
  const [ogDescription, setOgDescription] = useState<string>(
    'Access over 250+ free online calculators, AI prompt builders, PDF tools, SIP financial engines, developer formatters, and unit converters with 100% in-browser privacy.'
  );
  const [ogUrl, setOgUrl] = useState<string>('https://quickcalc.online');
  const [ogSiteName, setOgSiteName] = useState<string>('Quick Calculator');
  const [ogImage, setOgImage] = useState<string>('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=630&fit=crop');
  const [activePlatform, setActivePlatform] = useState<'facebook' | 'twitter' | 'linkedin'>('facebook');
  const [copiedMeta, setCopiedMeta] = useState<boolean>(false);

  const metaTagsCode = `<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${ogUrl}" />
<meta property="og:title" content="${ogTitle}" />
<meta property="og:description" content="${ogDescription}" />
<meta property="og:image" content="${ogImage}" />
<meta property="og:site_name" content="${ogSiteName}" />

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="${ogUrl}" />
<meta name="twitter:title" content="${ogTitle}" />
<meta name="twitter:description" content="${ogDescription}" />
<meta name="twitter:image" content="${ogImage}" />`;

  const handleCopyMeta = () => {
    navigator.clipboard.writeText(metaTagsCode);
    setCopiedMeta(true);
    setTimeout(() => setCopiedMeta(false), 2000);
  };

  const domain = (() => {
    try {
      return new URL(ogUrl).hostname;
    } catch {
      return 'quickcalc.online';
    }
  })();

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Open Graph Preview Tool - Facebook, LinkedIn & Twitter / X Social Card Simulator
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Simulate how your URLs appear when shared on social networks. Preview Open Graph image ratios and generate valid HTML meta tags.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-cyan-400" /> Open Graph Tags Configuration
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">og:title (Social Headline)</label>
              <input
                type="text"
                value={ogTitle}
                onChange={(e) => setOgTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">og:description (Summary Text)</label>
              <textarea
                rows={3}
                value={ogDescription}
                onChange={(e) => setOgDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">og:url (Canonical URL)</label>
                <input
                  type="text"
                  value={ogUrl}
                  onChange={(e) => setOgUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">og:site_name (Brand)</label>
                <input
                  type="text"
                  value={ogSiteName}
                  onChange={(e) => setOgSiteName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" /> og:image URL (Recommended: 1200 × 630 px)
              </label>
              <input
                type="text"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleCopyMeta}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
              >
                {copiedMeta ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedMeta ? 'Copied HTML Meta Tags' : 'Copy HTML Meta Tags'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Platform Mockup */}
        <div className="lg:col-span-6 space-y-4 flex flex-col">
          {/* Platform Tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700/80 text-xs self-start">
            <button
              type="button"
              onClick={() => setActivePlatform('facebook')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${activePlatform === 'facebook' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Facebook
            </button>
            <button
              type="button"
              onClick={() => setActivePlatform('twitter')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${activePlatform === 'twitter' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Twitter / X
            </button>
            <button
              type="button"
              onClick={() => setActivePlatform('linkedin')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${activePlatform === 'linkedin' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
            >
              LinkedIn
            </button>
          </div>

          {/* Social Card Simulation */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 flex-1 flex flex-col justify-center">
            {activePlatform === 'facebook' && (
              <div className="max-w-md mx-auto w-full bg-[#18191a] text-white rounded-lg border border-slate-700 overflow-hidden shadow-xl">
                <div className="aspect-[1.91/1] w-full bg-slate-800 relative overflow-hidden">
                  <img
                    src={ogImage}
                    alt="OG Card"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as any).src = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=630&fit=crop';
                    }}
                  />
                </div>
                <div className="p-3 bg-[#242526] space-y-1">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wide truncate">{domain}</div>
                  <h4 className="text-sm font-semibold text-slate-100 line-clamp-1">{ogTitle}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{ogDescription}</p>
                </div>
              </div>
            )}

            {activePlatform === 'twitter' && (
              <div className="max-w-md mx-auto w-full bg-black text-white rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="aspect-[2/1] w-full bg-slate-800 relative overflow-hidden">
                  <img
                    src={ogImage}
                    alt="Twitter Card"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as any).src = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=630&fit=crop';
                    }}
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] text-white font-medium">
                    {domain}
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <h4 className="text-sm font-semibold text-white line-clamp-1">{ogTitle}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{ogDescription}</p>
                </div>
              </div>
            )}

            {activePlatform === 'linkedin' && (
              <div className="max-w-md mx-auto w-full bg-[#1b1f23] text-white rounded-lg border border-slate-700 overflow-hidden shadow-xl">
                <div className="aspect-[1.91/1] w-full bg-slate-800 relative overflow-hidden">
                  <img
                    src={ogImage}
                    alt="LinkedIn Card"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as any).src = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=630&fit=crop';
                    }}
                  />
                </div>
                <div className="p-3 bg-[#242b35] space-y-1">
                  <h4 className="text-sm font-bold text-white line-clamp-1">{ogTitle}</h4>
                  <div className="text-[11px] text-slate-400 truncate">{domain}</div>
                </div>
              </div>
            )}
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
            <strong className="text-slate-300">What is the optimal image dimension for Open Graph sharing?</strong>
            <p className="mt-0.5">The recommended standard is 1200 × 630 pixels (an aspect ratio of 1.91:1) to ensure crisp rendering on high-DPI retina screens.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Why does Twitter require its own `twitter:card` meta tags?</strong>
            <p className="mt-0.5">While Twitter falls back to Open Graph tags, specifying `twitter:card="summary_large_image"` guarantees prominent edge-to-edge media cards.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">How do social crawlers refresh outdated cached Open Graph previews?</strong>
            <p className="mt-0.5">You can force cache invalidation using the official Facebook Sharing Debugger, Twitter Card Validator, or LinkedIn Post Inspector.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
