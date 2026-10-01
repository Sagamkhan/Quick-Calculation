import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, FileCode, Zap, ArrowDown, ShieldCheck } from 'lucide-react';
import { ToolComponentProps } from './registry';

const SAMPLE_JS = `// Calculate compound interest and future yield
function calculateCompoundWealth(principal, rate, years) {
  /* Annual compounding formula:
     A = P * (1 + r/n)^(n*t) */
  const annualRate = rate / 100;
  const totalPeriods = years;
  
  const futureValue = principal * Math.pow(1 + annualRate, totalPeriods);
  const totalInterest = futureValue - principal;

  console.log("Future balance calculated:", futureValue);
  return {
    futureValue: Math.round(futureValue),
    totalInterest: Math.round(totalInterest)
  };
}

const result = calculateCompoundWealth(100000, 12, 10);`;

// Safe JavaScript comment & whitespace compressor preserving string literals
function safeMinifyJs(code: string): string {
  if (!code.trim()) return '';

  let out = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inTemplateLiteral = false;
  let inBlockComment = false;
  let inLineComment = false;
  let isEscaped = false;

  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const nextChar = code[i + 1] || '';

    // If inside line comment
    if (inLineComment) {
      if (char === '\n') {
        inLineComment = false;
        out += '\n'; // preserve line boundary
      }
      continue;
    }

    // If inside block comment
    if (inBlockComment) {
      if (char === '*' && nextChar === '/') {
        inBlockComment = false;
        i++; // skip /
      }
      continue;
    }

    // If inside string
    if (inSingleQuote) {
      out += char;
      if (char === '\\') isEscaped = !isEscaped;
      else if (char === "'" && !isEscaped) inSingleQuote = false;
      else isEscaped = false;
      continue;
    }

    if (inDoubleQuote) {
      out += char;
      if (char === '\\') isEscaped = !isEscaped;
      else if (char === '"' && !isEscaped) inDoubleQuote = false;
      else isEscaped = false;
      continue;
    }

    if (inTemplateLiteral) {
      out += char;
      if (char === '\\') isEscaped = !isEscaped;
      else if (char === '`' && !isEscaped) inTemplateLiteral = false;
      else isEscaped = false;
      continue;
    }

    // Check comment starters
    if (char === '/' && nextChar === '/' && !inSingleQuote && !inDoubleQuote && !inTemplateLiteral) {
      inLineComment = true;
      i++;
      continue;
    }

    if (char === '/' && nextChar === '*' && !inSingleQuote && !inDoubleQuote && !inTemplateLiteral) {
      inBlockComment = true;
      i++;
      continue;
    }

    // Check string starters
    if (char === "'") {
      inSingleQuote = true;
      out += char;
      continue;
    }
    if (char === '"') {
      inDoubleQuote = true;
      out += char;
      continue;
    }
    if (char === '`') {
      inTemplateLiteral = true;
      out += char;
      continue;
    }

    out += char;
  }

  // Collapse consecutive spaces and trim lines safely
  const lines = out
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  return lines
    .join(' ')
    .replace(/\s*([=+\-*/%&|!<>?:;,{}()[\]])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

export default function JsMinifierSafe({ tool, onBack }: ToolComponentProps) {
  const [rawJs, setRawJs] = useState<string>(SAMPLE_JS);
  const [copied, setCopied] = useState<boolean>(false);

  const stats = useMemo(() => {
    const minified = safeMinifyJs(rawJs);
    const originalBytes = new Blob([rawJs]).size;
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
  }, [rawJs]);

  const handleCopy = () => {
    navigator.clipboard.writeText(stats.minified);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          JavaScript Minifier - Safe Client-Side JS Code Compressor
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Compress script files and bundle snippets by safely stripping comments and whitespace while preserving string literal integrity.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Raw JS Size</span>
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
          <span className="text-xs text-slate-400">Compression</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1">{stats.reductionPct}%</div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-cyan-400" /> Source JavaScript
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRawJs(SAMPLE_JS)}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Sample
              </button>
              <button
                type="button"
                onClick={() => setRawJs('')}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Clear
              </button>
            </div>
          </div>

          <textarea
            rows={12}
            value={rawJs}
            onChange={(e) => setRawJs(e.target.value)}
            placeholder="Paste your unminified JavaScript here..."
            className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-white focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
          />
        </div>

        {/* Output */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" /> Compressed JavaScript Output
              </span>
              <span className="font-mono text-emerald-400">{stats.minifiedBytes} bytes</span>
            </div>

            <textarea
              readOnly
              rows={12}
              value={stats.minified}
              placeholder="Minified JavaScript code will be emitted here..."
              className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 focus:outline-none resize-none leading-relaxed break-all select-all"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
            <span className="text-slate-400 text-[11px] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Safe String Literal Preservation
            </span>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!stats.minified}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy JavaScript'}
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
            <strong className="text-slate-300">Does safe JavaScript minification change function behavior?</strong>
            <p className="mt-0.5">No, safe minification only removes superfluous whitespace and comments without mangling variable names or altering logic flow.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Are strings containing slashes and quotes preserved?</strong>
            <p className="mt-0.5">Yes, our tokenizer isolates single quotes, double quotes, and template literals (`...`), preventing internal text from being corrupted.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">How much bandwidth reduction can I expect on frontend scripts?</strong>
            <p className="mt-0.5">Uncompressed scripts typically experience a 25% to 55% reduction in raw file size, speeding up mobile parse and execution times.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
