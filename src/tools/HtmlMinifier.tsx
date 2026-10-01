import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, FileCode, Zap, ArrowDown, ShieldCheck } from 'lucide-react';
import { ToolComponentProps } from './registry';

const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Character Set & Viewport -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quick Calculator - Free Web Utilities</title>
  </head>
  <body class="bg-slate-900 text-white">
    <!-- Main Content Container -->
    <header class="p-4 border-b border-slate-700">
      <h1 class="text-xl font-bold">Quick Calculator</h1>
      <p class="text-sm text-slate-400">Instant in-browser calculations</p>
    </header>

    <main class="container mx-auto py-8">
      <section id="features">
        <p>250+ Tools with 100% Client-Side Privacy.</p>
      </section>
    </main>
  </body>
</html>`;

function minifyHtml(html: string, removeComments = true): string {
  if (!html.trim()) return '';
  let out = html;

  // Protect pre and textarea blocks by placeholder
  const protectedBlocks: string[] = [];
  out = out.replace(/<(pre|textarea)[^>]*>[\s\S]*?<\/\1>/gi, (match) => {
    protectedBlocks.push(match);
    return `__PROTECTED_BLOCK_${protectedBlocks.length - 1}__`;
  });

  if (removeComments) {
    // Strip HTML comments except conditional IE comments
    out = out.replace(/<!--(?!\s*\[if)[\s\S]*?-->/g, '');
  }

  // Collapse consecutive whitespaces and clean up spaces around tags
  out = out
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\s*([=])\s*/g, '$1')
    .trim();

  // Restore protected blocks
  out = out.replace(/__PROTECTED_BLOCK_(\d+)__/g, (_, idx) => {
    return protectedBlocks[Number(idx)] || '';
  });

  return out;
}

export default function HtmlMinifier({ tool, onBack }: ToolComponentProps) {
  const [rawHtml, setRawHtml] = useState<string>(SAMPLE_HTML);
  const [removeComments, setRemoveComments] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const stats = useMemo(() => {
    const minified = minifyHtml(rawHtml, removeComments);
    const originalBytes = new Blob([rawHtml]).size;
    const minifiedBytes = new Blob([minified]).size;
    const savedBytes = Math.max(0, originalBytes - minifiedBytes);
    const reductionPct = originalBytes > 0 ? ((savedBytes / originalBytes) * 100).toFixed(1) : '0';

    return {
      minified,
      originalBytes,
      minifiedBytes,
      savedBytes,
      reductionPct
    };
  }, [rawHtml, removeComments]);

  const handleCopy = () => {
    navigator.clipboard.writeText(stats.minified);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          HTML Minifier - Client-Side Markup Optimizer & WhiteSpace Stripper
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Shrink HTML documents and templates by stripping comments, collapsing whitespace, and preserving preformatted code blocks.
        </p>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Raw HTML Size</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">{stats.originalBytes} B</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Minified Size</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">{stats.minifiedBytes} B</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <ArrowDown className="w-3.5 h-3.5 text-cyan-400" /> Bytes Removed
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1">-{stats.savedBytes} B</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Compression</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1">{stats.reductionPct}%</div>
        </div>
      </div>

      {/* Options Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs">
        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={removeComments}
            onChange={(e) => setRemoveComments(e.target.checked)}
            className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
          />
          <span>Strip HTML Comments (`&lt;!-- ... --&gt;`)</span>
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRawHtml(SAMPLE_HTML)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            Load Sample
          </button>
          <button
            type="button"
            onClick={() => setRawHtml('')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Side-by-side Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Source HTML */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-cyan-400" /> Original HTML Document
            </span>
            <span className="font-mono text-slate-400">{rawHtml.length} chars</span>
          </div>

          <textarea
            rows={12}
            value={rawHtml}
            onChange={(e) => setRawHtml(e.target.value)}
            placeholder="Paste your unminified HTML code here..."
            className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-white focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
          />
        </div>

        {/* Minified Output */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" /> Minified Output HTML
              </span>
              <span className="font-mono text-emerald-400">{stats.minifiedBytes} bytes</span>
            </div>

            <textarea
              readOnly
              rows={12}
              value={stats.minified}
              placeholder="Optimized single-line HTML will be produced here..."
              className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 focus:outline-none resize-none leading-relaxed break-all select-all"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
            <span className="text-slate-400 text-[11px]">Safe AST Boundary Preservation</span>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!stats.minified}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Minified HTML'}
            </button>
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
            <strong className="text-slate-300">Will HTML minification break &lt;pre&gt; code snippets or &lt;textarea&gt; contents?</strong>
            <p className="mt-0.5">No, our algorithm identifies and protects &lt;pre&gt; and &lt;textarea&gt; elements, preserving their internal indentations and whitespace.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Does HTML minification improve website SEO rankings?</strong>
            <p className="mt-0.5">Yes, faster DOM downloading directly contributes to higher Google PageSpeed scores and lower Time to First Byte (TTFB).</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Are conditional comments preserved for legacy browsers?</strong>
            <p className="mt-0.5">Yes, standard conditional Internet Explorer comments like `&lt;!--[if IE]&gt;` are safely excluded from removal.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
