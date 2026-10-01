import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Link, ArrowLeftRight, Layers } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function UrlEncoderDecoderBulk({ tool, onBack }: ToolComponentProps) {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeType, setEncodeType] = useState<'component' | 'full'>('component');
  const [inputLines, setInputLines] = useState<string>(
    `https://quickcalc.online/search?q=loan calculator 2026&category=finance & investment
https://example.com/api/v1/auth?redirect=https://mysite.com/dashboard?user=john doe&token=xyz!@#
category=health & wellness & query=bmi 25+ chart`
  );
  const [copied, setCopied] = useState<boolean>(false);

  const outputLines = useMemo(() => {
    if (!inputLines.trim()) return '';

    const lines = inputLines.split('\n');
    const processed = lines.map((line) => {
      if (!line.trim()) return '';
      try {
        if (mode === 'encode') {
          return encodeType === 'component'
            ? encodeURIComponent(line)
            : encodeURI(line);
        } else {
          return decodeURIComponent(line);
        }
      } catch (err: any) {
        return `[Malformed URL Error] ${line}`;
      }
    });

    return processed.join('\n');
  }, [inputLines, mode, encodeType]);

  const lineCount = inputLines ? inputLines.split('\n').filter(Boolean).length : 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(outputLines);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    if (outputLines && !outputLines.includes('[Malformed URL Error]')) {
      setInputLines(outputLines);
      setMode(mode === 'encode' ? 'decode' : 'encode');
    }
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Bulk URL Encoder & Decoder - Batch Percent-Encoding & Query Param Parser
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Encode or decode multiple URLs, paths, and query string parameters simultaneously with full percent-encoding and UTF-8 safe parsing.
        </p>
      </div>

      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-700/80">
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setMode('encode')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              mode === 'encode' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Encode URLs
          </button>
          <button
            type="button"
            onClick={() => setMode('decode')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              mode === 'decode' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Decode URLs
          </button>
        </div>

        {mode === 'encode' && (
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Encoding Level:</span>
            <button
              type="button"
              onClick={() => setEncodeType('component')}
              className={`px-2.5 py-1 rounded text-xs transition ${
                encodeType === 'component' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'
              }`}
            >
              encodeURIComponent (Strict Params)
            </button>
            <button
              type="button"
              onClick={() => setEncodeType('full')}
              className={`px-2.5 py-1 rounded text-xs transition ${
                encodeType === 'full' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'
              }`}
            >
              encodeURI (Full URL Preserve)
            </button>
          </div>
        )}
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold flex items-center gap-1.5">
              <Link className="w-4 h-4 text-cyan-400" />
              {mode === 'encode' ? 'Plain URLs / Query Strings (One per line)' : 'Encoded URLs (One per line)'}
            </span>
            <span className="font-mono text-slate-400">{lineCount} lines</span>
          </div>

          <textarea
            rows={10}
            value={inputLines}
            onChange={(e) => setInputLines(e.target.value)}
            placeholder="Enter URLs or query params (one per line)..."
            className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-white focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setInputLines('')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Clear All
            </button>

            <button
              type="button"
              onClick={handleSwap}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 flex items-center gap-1.5 transition"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" /> Swap Columns
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                {mode === 'encode' ? 'Bulk Encoded Output' : 'Bulk Decoded Plain URLs'}
              </span>
              <span className="font-mono text-slate-400">{outputLines.length} chars</span>
            </div>

            <textarea
              readOnly
              rows={10}
              value={outputLines}
              placeholder="Processed URLs will output here line-by-line..."
              className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 focus:outline-none resize-none leading-relaxed select-all"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
            <span className="text-slate-400 text-[11px]">100% In-Browser Batch Engine</span>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!outputLines}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy All Results'}
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
            <strong className="text-slate-300">What is the difference between encodeURI and encodeURIComponent?</strong>
            <p className="mt-0.5">`encodeURI` preserves protocol delimiters like `http://` and `?`, while `encodeURIComponent` escapes all characters (including `/` and `&`) for safe parameter values.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Why do spaces turn into `%20` or `+` in URL strings?</strong>
            <p className="mt-0.5">RFC 3986 specifies `%20` for standard URL path and parameter encoding, while HTML form submission standards often use `+` for application/x-www-form-urlencoded.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Can I encode thousands of URLs in bulk without server limits?</strong>
            <p className="mt-0.5">Yes, processing executes entirely inside your client browser, allowing batch conversions without API rate limits or network latency.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
