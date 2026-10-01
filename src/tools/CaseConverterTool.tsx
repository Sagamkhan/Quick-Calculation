import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Type, FileText } from 'lucide-react';
import { ToolComponentProps } from './registry';

const SAMPLE_TEXT = 'Quick calculator 2026 all-in-one developer & finance tools platform.';

export default function CaseConverterTool({ tool, onBack }: ToolComponentProps) {
  const [text, setText] = useState<string>(SAMPLE_TEXT);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const conversions = useMemo(() => {
    if (!text.trim()) {
      return {
        uppercase: '',
        lowercase: '',
        titleCase: '',
        sentenceCase: '',
        camelCase: '',
        pascalCase: '',
        snakeCase: '',
        kebabCase: '',
        constantCase: ''
      };
    }

    const uppercase = text.toUpperCase();
    const lowercase = text.toLowerCase();

    // Title Case
    const titleCase = text.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );

    // Sentence Case
    const sentenceCase = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

    // Words extraction for programming cases
    const words = text
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);

    // camelCase
    const camelCase = words
      .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.substring(1).toLowerCase()))
      .join('');

    // PascalCase
    const pascalCase = words
      .map((w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase())
      .join('');

    // snake_case
    const snakeCase = words.map((w) => w.toLowerCase()).join('_');

    // kebab-case
    const kebabCase = words.map((w) => w.toLowerCase()).join('-');

    // CONSTANT_CASE
    const constantCase = words.map((w) => w.toUpperCase()).join('_');

    return {
      uppercase,
      lowercase,
      titleCase,
      sentenceCase,
      camelCase,
      pascalCase,
      snakeCase,
      kebabCase,
      constantCase
    };
  }, [text]);

  const handleCopy = (content: string, key: string) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Case Converter - UPPERCASE, lowercase, Title Case, camelCase & snake_case
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Transform typography casing between standard prose styles and programming identifiers in real time with single-click clipboard exports.
        </p>
      </div>

      {/* Input Textarea */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            <Type className="w-4 h-4 text-cyan-400" /> Source Text to Convert
          </label>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>{charCount} chars</span>
            <span>•</span>
            <span>{wordCount} words</span>
            <button
              type="button"
              onClick={() => setText('')}
              className="ml-2 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Clear
            </button>
          </div>
        </div>

        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text to convert into multiple letter cases..."
          className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
        />
      </div>

      {/* Conversion Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { key: 'uppercase', label: 'UPPERCASE', val: conversions.uppercase },
          { key: 'lowercase', label: 'lowercase', val: conversions.lowercase },
          { key: 'titleCase', label: 'Title Case', val: conversions.titleCase },
          { key: 'sentenceCase', label: 'Sentence case', val: conversions.sentenceCase },
          { key: 'camelCase', label: 'camelCase', val: conversions.camelCase },
          { key: 'pascalCase', label: 'PascalCase', val: conversions.pascalCase },
          { key: 'snakeCase', label: 'snake_case', val: conversions.snakeCase },
          { key: 'kebabCase', label: 'kebab-case', val: conversions.kebabCase },
          { key: 'constantCase', label: 'CONSTANT_CASE', val: conversions.constantCase }
        ].map((item) => (
          <div key={item.key} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-1.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">{item.label}</span>
              <button
                type="button"
                onClick={() => handleCopy(item.val, item.key)}
                disabled={!item.val}
                className="text-cyan-400 hover:text-cyan-300 disabled:opacity-40"
              >
                {copiedKey === item.key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="font-mono text-xs text-cyan-300 bg-slate-950 p-2 rounded border border-slate-800 break-all select-all max-h-16 overflow-y-auto">
              {item.val || <span className="text-slate-600">Enter text above...</span>}
            </div>
          </div>
        ))}
      </div>

      {/* 3-Line FAQ */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-cyan-400" /> Frequently Asked Questions
        </h4>
        <div className="space-y-2 text-xs text-slate-400 divide-y divide-slate-800/80">
          <div className="pt-2">
            <strong className="text-slate-300">What is the distinction between camelCase and PascalCase?</strong>
            <p className="mt-0.5">camelCase begins with a lowercase initial character, whereas PascalCase capitalizes the initial letter of every concatenated word.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Where are kebab-case and snake_case commonly applied?</strong>
            <p className="mt-0.5">kebab-case is standard for web URLs and CSS class names, while snake_case is predominantly utilized in Python and database columns.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Does Title Case capitalize all words including articles?</strong>
            <p className="mt-0.5">Standard Title Case capitalizes the starting letter of each word; minor prepositions can be edited according to AP or Chicago style manuals.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
