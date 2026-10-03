import React, { memo, useState, useCallback } from 'react';
import {
  Type,
  Calculator,
  Scale,
  ClipboardPaste,
  Trash2,
  ArrowLeftRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Loader2,
  Copy,
  Check,
  Download,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { ToolItem } from '../data/categoriesAndTools';
import VoiceInputButton from './VoiceInputButton';

export interface ToolInputAreaProps {
  tool?: ToolItem;
  mode?: 'text' | 'math' | 'converter';
  isCalculating?: boolean;
  
  // Text Props
  textValue?: string;
  onTextChange?: (val: string) => void;
  textPlaceholder?: string;
  activeTransform?: string;
  onApplyTransform?: (transformId: string) => void;

  // Math / Calculator Props
  amount?: number;
  onAmountChange?: (val: number) => void;
  rate?: number;
  onRateChange?: (val: number) => void;
  tenure?: number;
  onTenureChange?: (val: number) => void;
  currency?: string;
  onCurrencyChange?: (sym: '₹' | '$' | '€' | '£') => void;

  // Converter Props
  converterValue?: number;
  onConverterValueChange?: (val: number) => void;
  fromUnit?: string;
  onFromUnitChange?: (unit: string) => void;
  toUnit?: string;
  onToUnitChange?: (unit: string) => void;
  unitsList?: { id: string; name: string; symbol?: string }[];
  onSwapUnits?: () => void;

  // Action Buttons
  onCopyRawText?: () => void;
  onExportPdf?: () => void;
  onReset?: () => void;

  className?: string;
}

const ToolInputArea = memo(function ToolInputArea({
  tool,
  mode = 'text',
  isCalculating = false,
  textValue = '',
  onTextChange,
  textPlaceholder,
  activeTransform = 'none',
  onApplyTransform,
  amount = 10000,
  onAmountChange,
  rate = 10,
  onRateChange,
  tenure = 5,
  onTenureChange,
  currency = '₹',
  onCurrencyChange,
  converterValue = 100,
  onConverterValueChange,
  fromUnit = '',
  onFromUnitChange,
  toUnit = '',
  onToUnitChange,
  unitsList = [],
  onSwapUnits,
  onCopyRawText,
  onExportPdf,
  onReset,
  className = ''
}: ToolInputAreaProps) {
  const [copiedLocal, setCopiedLocal] = useState(false);

  // Safe tool name and slug resolution
  const toolName = tool?.name || 'Interactive Utility';
  const toolSlug = (tool?.slug || tool?.id || '').toLowerCase();
  const toolCat = (tool?.category || '').toLowerCase();

  // Resolved dynamic placeholder
  const resolvedPlaceholder = textPlaceholder || (() => {
    if (toolSlug.includes('rephrase') || toolSlug.includes('paraphras') || toolName.toLowerCase().includes('rephras')) {
      return 'Type or paste your text here for instant sentence rephrasing and tone polishing...';
    }
    if (toolSlug.includes('markdown') || toolName.toLowerCase().includes('markdown')) {
      return 'Type or paste Markdown here (headings, lists, code blocks) to render live preview...';
    }
    if (toolSlug.includes('word') || toolSlug.includes('counter') || toolName.toLowerCase().includes('word')) {
      return 'Type or paste your text here to count words, characters, and reading time in real time...';
    }
    if (toolSlug.includes('plagiarism') || toolName.toLowerCase().includes('plagiarism')) {
      return 'Paste your article, essay, or draft here to check readability, originality, and structure...';
    }
    return 'Type or paste your text here to calculate metrics in real time...';
  })();

  // Live text metrics
  const trimmed = textValue.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const charCount = textValue.length;
  const charNoSpaces = textValue.replace(/\s/g, '').length;
  const sentenceCount = trimmed ? textValue.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphCount = trimmed ? textValue.split(/\n+/).filter(Boolean).length : 0;
  const readingTimeMin = (wordCount / 200).toFixed(1);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && onTextChange) {
        onTextChange(text);
      }
    } catch {
      // ignore clipboard error
    }
  }, [onTextChange]);

  const handleClear = useCallback(() => {
    if (onTextChange) onTextChange('');
  }, [onTextChange]);

  const handleCopyAction = useCallback(() => {
    if (onCopyRawText) {
      onCopyRawText();
    } else {
      navigator.clipboard.writeText(textValue || `${amount} ${currency} at ${rate}% for ${tenure} years`);
      setCopiedLocal(true);
      setTimeout(() => setCopiedLocal(false), 2000);
    }
  }, [onCopyRawText, textValue, amount, currency, rate, tenure]);

  // Schema identification for Calculator labels
  const isSip = toolSlug.includes('sip');
  const isEmi = toolSlug.includes('emi') || toolSlug.includes('loan');
  const isTax = toolSlug.includes('tax') || toolSlug.includes('gst');
  const isSalary = toolSlug.includes('salary');
  const isCompound = toolSlug.includes('compound');
  const isPercentage = toolSlug.includes('percentage') || toolSlug.includes('discount');

  const textTransforms = [
    { id: 'none', label: 'Original' },
    { id: 'uppercase', label: 'UPPERCASE' },
    { id: 'lowercase', label: 'lowercase' },
    { id: 'titlecase', label: 'Title Case' },
    { id: 'slugify', label: 'slug-case' },
    { id: 'clean-whitespace', label: 'Trim Spaces' }
  ];

  return (
    <div
      className={`w-full p-4 sm:p-5 rounded-2xl bg-slate-900/90 dark:bg-slate-900 border border-slate-700/80 shadow-xl space-y-4 ${className}`}
    >
      {/* 1. Header Bar with Mode Icon, Tool Name, and Live Calculation Badge */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {mode === 'math' ? (
            <Calculator className="w-4 h-4 text-emerald-400" />
          ) : mode === 'converter' ? (
            <Scale className="w-4 h-4 text-pink-400" />
          ) : (
            <Type className="w-4 h-4 text-cyan-400" />
          )}
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            {mode === 'math'
              ? 'Calculator Inputs'
              : mode === 'converter'
              ? 'Unit Converter Inputs'
              : 'Interactive Text Input'}
          </span>
          <span className="text-[10px] font-mono text-slate-500">·</span>
          <span className="text-[11px] font-mono text-cyan-400 font-semibold truncate max-w-[220px]">
            {toolName}
          </span>
        </div>

        {/* 300ms Debounced Calculation Status Badge & Text Controls */}
        <div className="flex items-center gap-2">
          {isCalculating ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-bold animate-pulse">
              <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
              <span>Calculating...</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Live Active</span>
            </span>
          )}

          {/* Quick paste, voice, & clear for text */}
          {mode === 'text' && (
            <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-700/60">
              <VoiceInputButton
                onTranscript={(transcript) => {
                  if (onTextChange) {
                    onTextChange(textValue ? `${textValue} ${transcript}` : transcript);
                  }
                }}
                size="sm"
              />
              <button
                type="button"
                onClick={handlePaste}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono font-semibold flex items-center gap-1 transition-all cursor-pointer"
                title="Paste text from clipboard"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Paste</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={!textValue}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Clear input text"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. MODE 1: TEXT TOOLS (Word Counter, Sentence Rephraser, Markdown, Fallback) */}
      {mode === 'text' && (
        <div className="space-y-3">
          <div className="relative">
            <textarea
              rows={6}
              value={textValue}
              onChange={(e) => onTextChange && onTextChange(e.target.value)}
              placeholder={resolvedPlaceholder}
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 font-sans text-sm sm:text-base leading-relaxed resize-y transition-all shadow-inner"
              style={{ fontSize: '16px' }}
            />
          </div>

          {/* Live Metrics Counter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200">
                Words: <strong className="text-cyan-400 tabular-nums">{wordCount}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200">
                Characters: <strong className="text-emerald-400 tabular-nums">{charCount}</strong>
              </span>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200">
                No Spaces: <strong className="text-slate-300 tabular-nums">{charNoSpaces}</strong>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200">
                Sentences: <strong className="text-indigo-400 tabular-nums">{sentenceCount}</strong>
              </span>
              <span className="hidden md:inline-block px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200">
                Paragraphs: <strong className="text-purple-400 tabular-nums">{paragraphCount}</strong>
              </span>
              <span className="hidden lg:inline-block px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-200">
                Read: <strong className="text-amber-400 tabular-nums">{readingTimeMin}m</strong>
              </span>
            </div>

            {/* Quick text transforms if supported */}
            {onApplyTransform && (
              <div className="flex items-center gap-1 flex-wrap">
                {textTransforms.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onApplyTransform(t.id)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-all border cursor-pointer ${
                      activeTransform === t.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. MODE 2: CALCULATOR TOOLS (Math & Finance) */}
      {mode === 'math' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-xs font-mono text-slate-400">Currency Symbol:</span>
            <div className="flex items-center gap-1">
              {(['₹', '$', '€', '£'] as const).map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => onCurrencyChange && onCurrencyChange(sym)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-all border cursor-pointer ${
                    currency === sym
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Input 1: Principal / Base Amount */}
            <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/70 border border-slate-700/80 shadow-inner">
              <label className="block text-xs font-semibold text-slate-300">
                {isSip ? 'Monthly Investment' : isEmi ? 'Loan Amount' : isSalary ? 'Annual Salary' : isPercentage ? 'Base Amount' : 'Principal Amount'}
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 font-mono font-bold text-sm pointer-events-none">
                  {currency}
                </span>
                <input
                  type="number"
                  min="0"
                  value={amount === 0 ? '' : amount}
                  onChange={(e) => onAmountChange && onAmountChange(parseFloat(e.target.value) || 0)}
                  className="w-full py-2.5 pl-8 pr-3 rounded-lg bg-slate-900 border border-slate-700 font-mono font-bold text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  style={{ fontSize: '16px' }}
                />
              </div>
              <input
                type="range"
                min={isSip ? 500 : isPercentage ? 100 : 1000}
                max={isSip ? 200000 : isPercentage ? 50000 : 10000000}
                step={isSip ? 500 : isPercentage ? 100 : 5000}
                value={amount}
                onChange={(e) => onAmountChange && onAmountChange(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-800 cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Input 2: Rate of Interest / Return / Tax */}
            <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/70 border border-slate-700/80 shadow-inner">
              <label className="block text-xs font-semibold text-slate-300">
                {isSip ? 'Expected Return (%)' : isTax ? 'Tax Rate (%)' : isPercentage ? 'Percentage / Discount (%)' : 'Interest Rate (%)'}
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={rate === 0 ? '' : rate}
                  onChange={(e) => onRateChange && onRateChange(parseFloat(e.target.value) || 0)}
                  className="w-full py-2.5 pl-3 pr-8 rounded-lg bg-slate-900 border border-slate-700 font-mono font-bold text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  style={{ fontSize: '16px' }}
                />
                <span className="absolute right-3 text-slate-400 font-mono font-bold text-sm pointer-events-none">
                  %
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={35}
                step={0.5}
                value={rate}
                onChange={(e) => onRateChange && onRateChange(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-800 cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Input 3: Tenure / Time Period */}
            <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/70 border border-slate-700/80 shadow-inner">
              <label className="block text-xs font-semibold text-slate-300">
                {isPercentage ? 'Calculation Rounds' : 'Tenure (Years)'}
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={tenure === 0 ? '' : tenure}
                  onChange={(e) => onTenureChange && onTenureChange(parseInt(e.target.value, 10) || 1)}
                  className="w-full py-2.5 pl-3 pr-14 rounded-lg bg-slate-900 border border-slate-700 font-mono font-bold text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  style={{ fontSize: '16px' }}
                />
                <span className="absolute right-3 text-slate-400 font-mono font-bold text-xs pointer-events-none">
                  {isPercentage ? 'Steps' : 'Years'}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={35}
                step={1}
                value={tenure}
                onChange={(e) => onTenureChange && onTenureChange(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-800 cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. MODE 3: CONVERTER TOOLS */}
      {mode === 'converter' && (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Numerical Input Value */}
          <div className="sm:col-span-5 space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-700">
            <label className="text-xs font-semibold text-slate-300">
              Value to Convert
            </label>
            <input
              type="number"
              value={converterValue === 0 ? '' : converterValue}
              onChange={(e) => onConverterValueChange && onConverterValueChange(parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
              style={{ fontSize: '16px' }}
            />
          </div>

          {/* From Unit */}
          <div className="sm:col-span-3 space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-700">
            <label className="text-xs font-semibold text-slate-300">From</label>
            <select
              value={fromUnit}
              onChange={(e) => onFromUnitChange && onFromUnitChange(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-pink-500 outline-none transition-all"
              style={{ fontSize: '16px' }}
            >
              {unitsList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} {u.symbol ? `(${u.symbol})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="sm:col-span-1 flex items-center justify-center pt-2 sm:pt-4">
            <button
              type="button"
              onClick={onSwapUnits}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-400 border border-slate-700 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Swap units"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* To Unit */}
          <div className="sm:col-span-3 space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-700">
            <label className="text-xs font-semibold text-slate-300">To</label>
            <select
              value={toUnit}
              onChange={(e) => onToUnitChange && onToUnitChange(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-pink-500 outline-none transition-all"
              style={{ fontSize: '16px' }}
            >
              {unitsList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} {u.symbol ? `(${u.symbol})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* 5. Action Buttons Bar directly BELOW the input area */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/60 flex-wrap gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleCopyAction}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:border-cyan-500/50"
            title="Copy current input or calculation text"
          >
            {copiedLocal ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copiedLocal ? 'Copied!' : 'Copy Raw Text'}</span>
          </button>
          {onExportPdf && (
            <button
              type="button"
              onClick={onExportPdf}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:border-indigo-500/50"
              title="Download structured PDF report"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export PDF Report</span>
            </button>
          )}
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs transition-colors cursor-pointer"
              title="Reset inputs to defaults"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Zero Data Sent to Cloud</span>
        </span>
      </div>
    </div>
  );
});

export default ToolInputArea;
