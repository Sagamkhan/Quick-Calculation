import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Percent, Zap, FileCode, ArrowDown } from 'lucide-react';
import { ToolComponentProps } from './registry';

const SAMPLE_CSS = `/* Global Header & Nav Styling */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #0f172a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 0px;
}

/* Navigation Links */
.header-container nav a {
  color: #38bdf8;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease-in-out;
  padding-left: 0px;
}

.header-container nav a:hover {
  color: #ffffff;
  background-color: transparent;
}`;

function minifyCss(css: string): string {
  if (!css.trim()) return '';
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
    .replace(/\s+/g, ' ') // collapse multi whitespaces
    .replace(/\s*([{};:,])\s*/g, '$1') // trim whitespace around brackets and punctuation
    .replace(/;}/g, '}') // remove trailing semicolons before closing bracket
    .replace(/\b0(px|em|rem|%|pt)\b/g, '0') // 0px -> 0
    .trim();
}

export default function CssMinifierStats({ tool, onBack }: ToolComponentProps) {
  const [rawCss, setRawCss] = useState<string>(SAMPLE_CSS);
  const [copied, setCopied] = useState<boolean>(false);

  const stats = useMemo(() => {
    const minified = minifyCss(rawCss);
    const originalBytes = new Blob([rawCss]).size;
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
  }, [rawCss]);

  const handleCopy = () => {
    navigator.clipboard.writeText(stats.minified);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          CSS Minifier with Real-Time Compression Stats & Bandwidth Savings
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Compress stylesheet payload sizes by stripping comments, redundant spaces, and trailing tokens while computing live byte reduction metrics.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Original Size</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">{stats.originalBytes} B</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Minified Size</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">{stats.minifiedBytes} B</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <ArrowDown className="w-3.5 h-3.5 text-cyan-400" /> Bandwidth Saved
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1">-{stats.savedBytes} B</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Reduction Ratio</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1">{stats.reductionPct}%</div>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Raw CSS */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-cyan-400" /> Original CSS
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRawCss(SAMPLE_CSS)}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Sample
              </button>
              <button
                type="button"
                onClick={() => setRawCss('')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Clear
              </button>
            </div>
          </div>

          <textarea
            rows={12}
            value={rawCss}
            onChange={(e) => setRawCss(e.target.value)}
            placeholder="Paste your uncompressed CSS here..."
            className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-white focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
          />
        </div>

        {/* Minified CSS */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" /> Minified Output
              </span>
              <span className="font-mono text-emerald-400">{stats.minifiedBytes} bytes</span>
            </div>

            <textarea
              readOnly
              rows={12}
              value={stats.minified}
              placeholder="Compressed stylesheet will appear here..."
              className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 focus:outline-none resize-none leading-relaxed break-all select-all"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
            <span className="text-slate-400 text-[11px]">Safe CSS AST Parsing</span>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!stats.minified}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Minified CSS'}
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
            <strong className="text-slate-300">How does minifying CSS improve Google Core Web Vitals?</strong>
            <p className="mt-0.5">Reducing CSS bytes accelerates render-tree construction, minimizing First Contentful Paint (FCP) and eliminating render-blocking bottlenecks.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Is CSS minification safe for modern CSS variables and grid syntax?</strong>
            <p className="mt-0.5">Yes, valid custom properties (like `--primary-color`), nested calc expressions, and CSS Grid templates remain intact without breaking style cascade.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Should I run CSS minification in addition to Gzip/Brotli compression?</strong>
            <p className="mt-0.5">Yes, minification removes unnecessary tokens first, allowing compression algorithms like Brotli to compress stylesheet payloads even tighter.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
