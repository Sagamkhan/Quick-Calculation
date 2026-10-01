import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, ArrowLeftRight, FileText, Binary, ShieldCheck } from 'lucide-react';
import { ToolComponentProps } from './registry';

// Robust UTF-8 Base64 encoding
function utf8ToBase64(str: string, urlSafe = false): string {
  try {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    let b64 = btoa(binary);
    if (urlSafe) {
      b64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
    return b64;
  } catch (e: any) {
    return `Error: ${e.message}`;
  }
}

// Robust UTF-8 Base64 decoding
function base64ToUtf8(b64: string, urlSafe = false): string {
  try {
    let clean = b64.trim();
    if (urlSafe || clean.includes('-') || clean.includes('_')) {
      clean = clean.replace(/-/g, '+').replace(/_/g, '/');
      while (clean.length % 4 !== 0) {
        clean += '=';
      }
    }
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e: any) {
    return `Decoding Error: Invalid Base64 character sequence.`;
  }
}

export default function Base64EncodeDecode({ tool, onBack }: ToolComponentProps) {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [inputText, setInputText] = useState<string>('Quick Calculator 🚀 All-in-one free browser utilities.');
  const [isUrlSafe, setIsUrlSafe] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const outputText = useMemo(() => {
    if (!inputText.trim()) return '';
    return mode === 'encode'
      ? utf8ToBase64(inputText, isUrlSafe)
      : base64ToUtf8(inputText, isUrlSafe);
  }, [inputText, mode, isUrlSafe]);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    if (outputText && !outputText.startsWith('Error')) {
      setInputText(outputText);
      setMode(mode === 'encode' ? 'decode' : 'encode');
    }
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Base64 Encoder & Decoder - UTF-8 Client-Side Text and ASCII Converter
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Encode standard strings into Base64 or decode Base64 back to readable text with full Unicode emoji support and URL-safe parameter modes.
        </p>
      </div>

      {/* Mode Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-700/80">
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setMode('encode')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              mode === 'encode' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Encode Text → Base64
          </button>
          <button
            type="button"
            onClick={() => setMode('decode')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              mode === 'decode' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Decode Base64 → Text
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={isUrlSafe}
              onChange={(e) => setIsUrlSafe(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>URL-Safe Format (- and _ without padding)</span>
          </label>
        </div>
      </div>

      {/* Editor Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" />
              {mode === 'encode' ? 'Plain Text Source' : 'Base64 Encoded Input'}
            </span>
            <span className="font-mono text-slate-400">{inputText.length} chars</span>
          </div>

          <textarea
            rows={8}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={mode === 'encode' ? 'Type or paste plain text or JSON...' : 'Paste Base64 string to decode...'}
            className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-white focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setInputText('')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Clear Input
            </button>

            <button
              type="button"
              onClick={handleSwap}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 flex items-center gap-1.5 transition"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" /> Swap Source & Result
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold flex items-center gap-1.5">
                <Binary className="w-4 h-4 text-cyan-400" />
                {mode === 'encode' ? 'Base64 Encoded Output' : 'Decoded Plain Text'}
              </span>
              <span className="font-mono text-slate-400">{outputText.length} chars</span>
            </div>

            <textarea
              readOnly
              rows={8}
              value={outputText}
              placeholder="Output will appear here instantly..."
              className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 focus:outline-none resize-none leading-relaxed select-all"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
            <span className="text-slate-400 font-mono text-[11px]">
              {mode === 'encode'
                ? `Size expansion: ~${inputText ? Math.round((outputText.length / (inputText.length || 1)) * 100) : 133}%`
                : '100% In-Browser Decoded'}
            </span>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!outputText || outputText.startsWith('Decoding Error')}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Output'}
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
            <strong className="text-slate-300">What is Base64 encoding used for in modern web development?</strong>
            <p className="mt-0.5">Base64 converts binary data into ASCII strings to safely transmit images, tokens, and payloads inside HTTP headers and URLs without corruption.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">What makes URL-safe Base64 different from standard Base64?</strong>
            <p className="mt-0.5">URL-safe Base64 replaces '+' with '-' and '/' with '_', while dropping trailing '=' padding characters that can break query strings.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Does Base64 provide encryption or security protection?</strong>
            <p className="mt-0.5">No, Base64 is merely a data format transformation and provides zero cryptographic security; anyone can reverse it instantly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
