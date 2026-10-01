import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, RefreshCw, Download, Layers, ShieldCheck } from 'lucide-react';
import { ToolComponentProps } from './registry';

function generateSingleUuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for RFC 4122 v4
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  array[6] = (array[6] & 0x0f) | 0x40; // v4
  array[8] = (array[8] & 0x3f) | 0x80; // variant
  const hex = Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export default function UuidGeneratorBulk({ tool, onBack }: ToolComponentProps) {
  const [count, setCount] = useState<number>(10);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [removeHyphens, setRemoveHyphens] = useState<boolean>(false);
  const [includeBraces, setIncludeBraces] = useState<boolean>(false);
  const [wrapQuotes, setWrapQuotes] = useState<boolean>(false);
  const [seed, setSeed] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const uuidList = useMemo(() => {
    const list: string[] = [];
    const targetCount = Math.max(1, Math.min(500, count));

    for (let i = 0; i < targetCount; i++) {
      let id = generateSingleUuid();
      if (removeHyphens) id = id.replace(/-/g, '');
      if (uppercase) id = id.toUpperCase();
      if (includeBraces) id = `{${id}}`;
      if (wrapQuotes) id = `"${id}"`;
      list.push(id);
    }
    return list;
  }, [count, uppercase, removeHyphens, includeBraces, wrapQuotes, seed]);

  const outputText = uuidList.join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids-${count}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Bulk UUID / GUID Generator - RFC 4122 Version 4 Unique Identifier Engine
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Generate cryptographically secure v4 UUIDs in bulk with custom casing, brace wrapping, and delimiter stripping.
        </p>
      </div>

      {/* Control Card */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          {/* Quantity */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="font-semibold">Quantity to Generate</span>
              <span className="font-mono text-cyan-400 font-bold">{count} UUIDs</span>
            </div>
            <input
              type="number"
              min={1}
              max={500}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(500, Number(e.target.value) || 1)))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Quick presets */}
          <div className="space-y-1 sm:col-span-3">
            <span className="text-xs text-slate-400 font-semibold block">Quick Batch Counts</span>
            <div className="flex flex-wrap gap-2">
              {[1, 5, 10, 25, 50, 100, 250].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCount(num)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                    count === num ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Options Row */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-800 text-xs text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>UPPERCASE</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={removeHyphens}
              onChange={(e) => setRemoveHyphens(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Strip Hyphens (-)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeBraces}
              onChange={(e) => setIncludeBraces(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Include Braces {'{...}'}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={wrapQuotes}
              onChange={(e) => setWrapQuotes(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Wrap Quotes ("...")</span>
          </label>
        </div>
      </div>

      {/* Output Display Card */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" /> Generated Identifiers
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">{uuidList.length} items</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSeed((prev) => prev + 1)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-generate
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy All'}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" /> Export .txt
            </button>
          </div>
        </div>

        <textarea
          readOnly
          rows={12}
          value={outputText}
          className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 focus:outline-none resize-none leading-relaxed select-all"
        />
      </div>

      {/* 3-Line FAQ */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-cyan-400" /> Frequently Asked Questions
        </h4>
        <div className="space-y-2 text-xs text-slate-400 divide-y divide-slate-800/80">
          <div className="pt-2">
            <strong className="text-slate-300">Are these generated UUIDs cryptographically random?</strong>
            <p className="mt-0.5">Yes, identifiers are generated using browser-native CSPRNG `crypto.randomUUID` conforming to the RFC 4122 v4 specification.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">What is the probability of a collision when using Version 4 UUIDs?</strong>
            <p className="mt-0.5">With 122 random bits of entropy, the mathematical likelihood of duplicate collisions is practically zero even across billions of records.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">What is the difference between a GUID and a UUID?</strong>
            <p className="mt-0.5">GUID (Globally Unique Identifier) is Microsoft's implementation of the standard UUID (Universally Unique Identifier); format-wise they are identical.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
