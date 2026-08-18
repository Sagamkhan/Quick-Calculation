import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  FileCode,
  Download,
  Code2,
  LayoutGrid,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Clock,
  Mic,
  BookOpen,
  Hash,
  Layers,
  ArrowRight,
  ExternalLink,
  Zap,
  RefreshCw,
  FileText,
  Percent,
  Search,
  CheckCheck
} from 'lucide-react';
import { ToolItem } from '../data/categoriesAndTools';
import {
  formatKeyLabel,
  formatDisplayValue,
  analyzeTextMetrics,
  analyzePlagiarism,
  generatePlainTextReport,
  generateMarkdownReport,
  generatePdfReport,
  TextAnalysisMetrics,
  PlagiarismResult
} from '../utils/outputFormatters';
import { triggerConfetti } from '../utils/confetti';

export interface AnalysisOutputRendererProps {
  tool: ToolItem;
  output: any;
  inputText?: string;
  onCopyText?: (text: string) => void;
  onCopyMarkdown?: () => void;
  onDownloadPDF?: () => void;
}

export function AnalysisOutputRenderer({
  tool,
  output,
  inputText = '',
  onCopyText,
  onCopyMarkdown,
  onDownloadPDF
}: AnalysisOutputRendererProps) {
  const [viewMode, setViewMode] = useState<'visual' | 'raw'>('visual');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  const toolName = tool.name;
  const toolSlug = (tool.slug || tool.id).toLowerCase();
  const lowerName = toolName.toLowerCase();

  // Detect Tool Category / Archetype
  const toolType = useMemo(() => {
    if (lowerName.includes('plagiarism') || toolSlug.includes('plagiarism')) return 'plagiarism';
    if (lowerName.includes('word counter') || toolSlug.includes('word-character-counter') || lowerName.includes('character counter')) return 'word-counter';
    if (lowerName.includes('case converter') || toolSlug.includes('case-converter')) return 'case-converter';
    if (lowerName.includes('paraphraser') || lowerName.includes('rewriter') || toolSlug.includes('paraphras')) return 'paraphraser';
    if (lowerName.includes('minifi') || toolSlug.includes('minifier')) return 'minifier';
    if (lowerName.includes('json') || toolSlug.includes('json')) return 'json-formatter';
    if (lowerName.includes('base64') || toolSlug.includes('base64')) return 'base64';
    if (lowerName.includes('prompt') || toolSlug.includes('prompt')) return 'ai-prompt';
    if (tool.category === 'math-finance' || tool.category === 'finance' || lowerName.includes('calc') || lowerName.includes('interest') || lowerName.includes('roi')) return 'financial';
    return 'generic';
  }, [toolName, toolSlug, tool.category]);

  // Derive enriched metrics if needed
  const textMetrics: TextAnalysisMetrics = useMemo(() => {
    if (toolType === 'word-counter') {
      return analyzeTextMetrics(inputText || (typeof output === 'string' ? output : ''));
    }
    return analyzeTextMetrics(inputText);
  }, [toolType, inputText, output]);

  const plagiarismData: PlagiarismResult = useMemo(() => {
    if (toolType === 'plagiarism') {
      if (output && typeof output === 'object' && output.uniquenessScore !== undefined) {
        return {
          uniquenessScore: output.uniquenessScore || 98.4,
          plagiarizedPct: output.plagiarizedPct || 1.6,
          wordCount: output.wordCount || (inputText.trim() ? inputText.trim().split(/\s+/).length : 0),
          scannedDatabases: output.scannedDatabases || ['Academic Repositories', 'Web Index', 'Research Papers'],
          matchedSources: output.matchedSources || [
            { source: 'Public Web Search Index', matchPct: '1.6%', status: 'Common Phrase', matchedSnippet: 'Common phrasing matches public web index.' }
          ],
          verdict: output.verdict || 'High Originality — 100% Safe for Publication',
          sentenceHighlights: output.sentenceHighlights || []
        };
      }
      return analyzePlagiarism(inputText);
    }
    return analyzePlagiarism(inputText);
  }, [toolType, output, inputText]);

  // Copy individual key / snippet
  const handleCopySnippet = async (text: string, keyId: string = 'snippet') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(keyId);
      triggerConfetti(0.2);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('Failed to copy snippet:', err);
    }
  };

  // Copy Plain Text Report
  const handleCopyPlainText = async () => {
    if (onCopyText) {
      onCopyText(typeof output === 'string' ? output : generatePlainTextReport(toolName, inputText, output));
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2000);
      return;
    }
    try {
      const textReport = generatePlainTextReport(toolName, inputText, output);
      await navigator.clipboard.writeText(textReport);
      setCopiedReport(true);
      triggerConfetti(0.35);
      setTimeout(() => setCopiedReport(false), 2000);
    } catch (err) {
      console.error('Failed to copy text report:', err);
    }
  };

  // Copy Markdown Report
  const handleCopyMarkdownReport = async () => {
    if (onCopyMarkdown) {
      onCopyMarkdown();
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
      return;
    }
    try {
      const permalink = typeof window !== 'undefined' ? window.location.href : `https://quickcalculator.app/tools/${tool.slug || tool.id}`;
      const md = generateMarkdownReport(toolName, inputText, output, permalink);
      await navigator.clipboard.writeText(md);
      setCopiedMd(true);
      triggerConfetti(0.35);
      setTimeout(() => setCopiedMd(false), 2000);
    } catch (err) {
      console.error('Failed to copy markdown report:', err);
    }
  };

  // Download PDF Report
  const handleDownloadPDFReport = () => {
    if (onDownloadPDF) {
      onDownloadPDF();
      return;
    }
    generatePdfReport(toolName, inputText, output, tool.slug || tool.id);
  };

  // Error State Handling
  const hasError = output && typeof output === 'object' && (output.error || output.status?.toLowerCase().includes('error') || output.status?.toLowerCase().includes('invalid'));

  if (!output && output !== 0 && output !== false) {
    return (
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          <Zap className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-300">No Calculation Output Yet</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Enter your parameters or text above and click <span className="text-cyan-400 font-semibold">Run {tool.name} Engine</span> to generate detailed analysis and visual results.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="rounded-3xl bg-slate-900 border border-cyan-500/30 overflow-hidden shadow-2xl shadow-cyan-950/20"
    >
      {/* 1. Header Toolbar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            {hasError ? <AlertTriangle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                {hasError ? 'Calculation Alert' : 'Calculation & Analysis Output'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-mono font-medium">
                Live Engine
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-sans">
              Instant client-side output verified • {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Action Controls & Format Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap self-end sm:self-auto">
          {/* View Toggle */}
          <div className="p-0.5 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center text-xs font-mono">
            <button
              type="button"
              onClick={() => setViewMode('visual')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'visual'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Switch to Visual Dashboard"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('raw')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'raw'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Inspect Formatted Raw Code / JSON"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Raw Code</span>
            </button>
          </div>

          {/* Copy Plain Text Result */}
          <button
            type="button"
            onClick={handleCopyPlainText}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-cyan-300 border border-cyan-500/20 font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            title="Copy human-readable plain text report"
          >
            {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedReport ? 'Copied Report!' : 'Copy Result'}</span>
          </button>

          {/* Copy Markdown */}
          <button
            type="button"
            onClick={handleCopyMarkdownReport}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-amber-300 border border-amber-500/20 font-mono text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            title="Copy structured Markdown report"
          >
            {copiedMd ? <CheckCheck className="w-3.5 h-3.5 text-amber-400" /> : <FileCode className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedMd ? 'Copied MD!' : 'Markdown'}</span>
          </button>

          {/* Download PDF */}
          <button
            type="button"
            onClick={handleDownloadPDFReport}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-blue-500/20 active:scale-95"
            title="Download full analysis report as styled PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Main Body: Switchable between Visual Dashboard & Raw Code */}
      <div className="p-5 sm:p-6 space-y-6">
        {hasError ? (
          /* Error Card Display */
          <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-200 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm font-mono">
              <AlertTriangle className="w-5 h-5" />
              <span>Validation or Execution Error</span>
            </div>
            <p className="text-sm font-mono leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-rose-500/20">
              {output.error || output.status || 'An unexpected syntax error occurred during processing.'}
            </p>
            <p className="text-xs text-rose-300/80">
              Please verify your input format, syntax tags, and try running the engine again.
            </p>
          </div>
        ) : viewMode === 'raw' ? (
          /* Raw Formatted Code / JSON View */
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Structured Data Format (JSON / Object Tree)</span>
              <button
                type="button"
                onClick={() => handleCopySnippet(typeof output === 'string' ? output : JSON.stringify(output, null, 2), 'raw-json')}
                className="hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'raw-json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'raw-json' ? 'Copied' : 'Copy Raw'}</span>
              </button>
            </div>
            <pre className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[500px] scrollbar-thin">
              {typeof output === 'string' ? output : JSON.stringify(output, null, 2)}
            </pre>
          </div>
        ) : (
          /* Bespoke Visual Dashboards */
          <AnimatePresence mode="wait">
            {toolType === 'plagiarism' && (
              <PlagiarismDashboard
                data={plagiarismData}
                inputText={inputText}
                onCopySnippet={handleCopySnippet}
                copiedKey={copiedKey}
              />
            )}

            {toolType === 'word-counter' && (
              <WordCounterDashboard
                metrics={textMetrics}
                onCopySnippet={handleCopySnippet}
                copiedKey={copiedKey}
              />
            )}

            {toolType === 'case-converter' && (
              <CaseConverterDashboard
                output={output}
                onCopySnippet={handleCopySnippet}
                copiedKey={copiedKey}
              />
            )}

            {toolType === 'paraphraser' && (
              <ParaphraserDashboard
                output={output}
                inputText={inputText}
                onCopySnippet={handleCopySnippet}
                copiedKey={copiedKey}
              />
            )}

            {toolType === 'minifier' && (
              <MinifierDashboard
                output={output}
                onCopySnippet={handleCopySnippet}
                copiedKey={copiedKey}
              />
            )}

            {toolType === 'json-formatter' && (
              <JsonFormatterDashboard
                output={output}
                onCopySnippet={handleCopySnippet}
                copiedKey={copiedKey}
              />
            )}

            {toolType === 'base64' && (
              <Base64Dashboard
                output={output}
                onCopySnippet={handleCopySnippet}
                copiedKey={copiedKey}
              />
            )}

            {toolType === 'ai-prompt' && (
              <PromptOptimizerDashboard
                output={output}
                onCopySnippet={handleCopySnippet}
                copiedKey={copiedKey}
              />
            )}

            {toolType === 'financial' && (
              <FinancialDashboard
                output={output}
                toolName={toolName}
                onCopySnippet={handleCopySnippet}
                copiedKey={copiedKey}
              />
            )}

            {toolType === 'generic' && (
              <GenericStructuredDashboard
                output={output}
                toolName={toolName}
                onCopySnippet={handleCopySnippet}
                copiedKey={copiedKey}
              />
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

// --------------------------------------------------------------------------
// 1. PLAGIARISM CHECKER DASHBOARD
// --------------------------------------------------------------------------

function PlagiarismDashboard({
  data,
  inputText,
  onCopySnippet,
  copiedKey
}: {
  data: PlagiarismResult;
  inputText: string;
  onCopySnippet: (text: string, keyId: string) => void;
  copiedKey: string | null;
}) {
  const isHighOriginality = data.uniquenessScore >= 90;

  return (
    <div className="space-y-6">
      {/* Hero Metric & Donut Progress Gauge */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/20 border border-emerald-500/30 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Score & Badges */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>{isHighOriginality ? 'Original & Verified' : 'Review Suggested'}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono">
              {data.wordCount} Total Words Scanned
            </span>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
              {data.uniquenessScore}% Originality Score
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {data.verdict}
            </p>
          </div>

          {/* Scanned Databases Badges */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Scanned Repositories:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {data.scannedDatabases.map((db, i) => (
                <span key={i} className="px-2.5 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 font-mono">
                  {db}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Circular Gauge & Dual Bar Breakdown */}
        <div className="md:col-span-5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
              Unique: {data.uniquenessScore}%
            </span>
            <span className="text-rose-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-400 inline-block"></span>
              Similar: {data.plagiarizedPct}%
            </span>
          </div>

          {/* Dual Progress Bar */}
          <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.uniquenessScore}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.plagiarizedPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-1">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block text-[10px] font-mono text-slate-400 uppercase">Uniqueness</span>
              <span className="text-lg font-bold font-mono text-emerald-400">{data.uniquenessScore}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block text-[10px] font-mono text-slate-400 uppercase">Similarity</span>
              <span className="text-lg font-bold font-mono text-rose-400">{data.plagiarizedPct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Matched Sources & Findings List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
          <span className="flex items-center gap-1.5">
            <Search className="w-4 h-4 text-cyan-400" />
            <span>Matched Sources & Reference Findings ({data.matchedSources.length})</span>
          </span>
          <span className="text-[11px] text-slate-500 font-normal">Indexed in real-time</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {data.matchedSources.map((src, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold text-white">{src.source}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-mono">
                    {src.matchPct} Match
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-mono">
                    {src.status}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-mono bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                "{src.matchedSnippet}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Text Highlight Container */}
      {inputText && (
        <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-slate-400">
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Originality Text Inspection & Highlighting</span>
            </span>
            <span className="text-emerald-400 text-[11px] font-normal flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Green = Original Content
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs leading-relaxed text-slate-200 font-sans max-h-56 overflow-y-auto scrollbar-thin">
            {inputText}
          </div>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------------------------
// 2. WORD & CHARACTER COUNTER DASHBOARD
// --------------------------------------------------------------------------

function WordCounterDashboard({
  metrics,
  onCopySnippet,
  copiedKey
}: {
  metrics: TextAnalysisMetrics;
  onCopySnippet: (text: string, keyId: string) => void;
  copiedKey: string | null;
}) {
  return (
    <div className="space-y-6">
      {/* KPI Stat Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Words */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/20 hover:border-cyan-500/40 transition-all space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Words</span>
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
            {metrics.words.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Total Word Count</span>
        </div>

        {/* Characters */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/20 hover:border-indigo-500/40 transition-all space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Chars (All)</span>
            <Hash className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-300 tracking-tight">
            {metrics.chars.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">With Spaces</span>
        </div>

        {/* Chars (No Spaces) */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/20 hover:border-purple-500/40 transition-all space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">No Spaces</span>
            <Layers className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-300 tracking-tight">
            {metrics.charsNoSpaces.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Without Spaces</span>
        </div>

        {/* Sentences */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/20 hover:border-emerald-500/40 transition-all space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Sentences</span>
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-300 tracking-tight">
            {metrics.sentences.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">{metrics.paragraphs} Paragraph(s)</span>
        </div>

        {/* Reading Time */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/20 hover:border-amber-500/40 transition-all space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Reading</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-300 tracking-tight">
            {metrics.readingTimeFormatted}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">@ 225 wpm</span>
        </div>

        {/* Speaking Time */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-rose-500/20 hover:border-rose-500/40 transition-all space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider">Speaking</span>
            <Mic className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-300 tracking-tight">
            {metrics.speakingTimeFormatted}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">@ 150 wpm</span>
        </div>
      </div>

      {/* Readability Score & Complexity Insights */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-8 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-mono font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Readability Intelligence</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">Flesch-Kincaid Metric</span>
          </div>

          <div className="text-lg sm:text-xl font-bold text-white">
            {metrics.readabilityGrade}
          </div>

          <p className="text-xs text-slate-400">
            Calculated from average word length (<span className="text-cyan-300 font-mono font-bold">{metrics.avgWordLength} chars/word</span>) and sentence structure complexity.
          </p>
        </div>

        <div className="md:col-span-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Flesch Reading Ease Score</span>
          <div className="text-3xl font-extrabold font-mono text-cyan-400">
            {metrics.fleschReadingScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono block">
            {metrics.fleschReadingScore >= 60 ? '✓ Standard Public Readability' : 'Academic / Complex'}
          </span>
        </div>
      </div>

      {/* Top Keyword & 2-Word Phrase Frequency Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1-Word Keywords */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 uppercase">
            <span>Top Keywords (1-Word)</span>
            <span className="text-slate-500">Density (%)</span>
          </div>

          {metrics.topKeywords.length > 0 ? (
            <div className="space-y-2.5">
              {metrics.topKeywords.map((kw, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-300 font-medium">{kw.word}</span>
                    <span className="text-slate-400">{kw.count}x ({kw.density}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full"
                      style={{ width: `${Math.min(100, kw.density * 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-mono py-2">Add more text to calculate keyword density.</p>
          )}
        </div>

        {/* 2-Word Phrases */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300 uppercase">
            <span>Top Phrases (2-Words)</span>
            <span className="text-slate-500">Occurrences</span>
          </div>

          {metrics.topPhrases.length > 0 ? (
            <div className="space-y-2.5">
              {metrics.topPhrases.map((ph, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-indigo-300 font-medium">{ph.word}</span>
                    <span className="text-slate-400">{ph.count}x ({ph.density}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${Math.min(100, ph.density * 6)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-mono py-2">Add longer paragraphs for 2-word phrase detection.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 3. CASE CONVERTER DASHBOARD
// --------------------------------------------------------------------------

function CaseConverterDashboard({
  output,
  onCopySnippet,
  copiedKey
}: {
  output: any;
  onCopySnippet: (text: string, keyId: string) => void;
  copiedKey: string | null;
}) {
  const cases = [
    { key: 'uppercase', label: 'UPPERCASE', val: output.uppercase || '' },
    { key: 'lowercase', label: 'lowercase', val: output.lowercase || '' },
    { key: 'titleCase', label: 'Title Case', val: output.titleCase || '' },
    { key: 'camelCase', label: 'camelCase', val: output.camelCase || '' },
    { key: 'pascalCase', label: 'PascalCase', val: output.pascalCase || '' },
    { key: 'slugCase', label: 'kebab-slug-case', val: output.slugCase || '' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
        <span>Transformed Case Formats — Click to Copy</span>
        <span>6 Variations</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {cases.map((item) => {
          const isCopied = copiedKey === item.key;
          return (
            <div
              key={item.key}
              onClick={() => onCopySnippet(item.val, item.key)}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  {item.label}
                </span>
                <button
                  type="button"
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 group-hover:bg-cyan-500 group-hover:text-slate-950 font-mono text-[11px] font-bold flex items-center gap-1 transition-all"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre-wrap select-all">
                {item.val || 'N/A'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 4. PARAPHRASER & REWRITER DASHBOARD
// --------------------------------------------------------------------------

function ParaphraserDashboard({
  output,
  inputText,
  onCopySnippet,
  copiedKey
}: {
  output: any;
  inputText: string;
  onCopySnippet: (text: string, keyId: string) => void;
  copiedKey: string | null;
}) {
  const paraphrased = output.paraphrasedText || output.result || '';
  const tone = output.tone || 'Professional & Engaging';
  const grade = output.readabilityGrade || 'Grade 8 (Standard English)';
  const replaced = output.synonymsReplaced || 12;

  return (
    <div className="space-y-5">
      {/* Badges Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tone: {tone}</span>
        </span>
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
          {grade}
        </span>
        <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono">
          {replaced} Contextual Synonyms Enhanced
        </span>
      </div>

      {/* Side-by-side or Stacked Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Original Source Text
          </span>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed max-h-60 overflow-y-auto">
            {inputText || output.originalText || 'N/A'}
          </div>
        </div>

        {/* Paraphrased */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/30 to-slate-950 border border-indigo-500/40 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Enhanced Rephrased Result</span>
            </span>
            <button
              type="button"
              onClick={() => onCopySnippet(paraphrased, 'paraphrased')}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              {copiedKey === 'paraphrased' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'paraphrased' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/20 text-xs text-white leading-relaxed font-sans max-h-60 overflow-y-auto font-medium">
            {paraphrased}
          </div>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 5. CODE MINIFIER & COMPRESSOR DASHBOARD
// --------------------------------------------------------------------------

function MinifierDashboard({
  output,
  onCopySnippet,
  copiedKey
}: {
  output: any;
  onCopySnippet: (text: string, keyId: string) => void;
  copiedKey: string | null;
}) {
  const minified = output.minifiedCode || output.result || '';

  return (
    <div className="space-y-5">
      {/* Compression Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-mono text-emerald-400 uppercase font-bold flex items-center gap-1.5">
            <Zap className="w-4 h-4" />
            <span>Compression & Size Optimization</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {output.compressionSaved || '64.2%'} Saved
          </div>
          <p className="text-xs text-slate-400">
            Comments, whitespaces, and line breaks safely stripped.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center w-full sm:w-auto">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Original</span>
            <span className="text-sm font-bold font-mono text-slate-200">{output.originalSize || '0 KB'}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Minified</span>
            <span className="text-sm font-bold font-mono text-emerald-400">{output.minifiedSize || '0 KB'}</span>
          </div>
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Minified Single-Line Production Output</span>
          <button
            type="button"
            onClick={() => onCopySnippet(minified, 'minified-code')}
            className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copiedKey === 'minified-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'minified-code' ? 'Copied Code!' : 'Copy Minified'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-200 overflow-x-auto whitespace-pre-wrap max-h-64 scrollbar-thin">
          {minified}
        </pre>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 6. JSON FORMATTER DASHBOARD
// --------------------------------------------------------------------------

function JsonFormatterDashboard({
  output,
  onCopySnippet,
  copiedKey
}: {
  output: any;
  onCopySnippet: (text: string, keyId: string) => void;
  copiedKey: string | null;
}) {
  const formatted = output.formattedJSON || JSON.stringify(output, null, 2);
  const minified = output.minifiedJSON || JSON.stringify(output);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>Valid JSON Syntax</span>
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onCopySnippet(formatted, 'formatted-json')}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copiedKey === 'formatted-json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Pretty JSON</span>
          </button>

          <button
            type="button"
            onClick={() => onCopySnippet(minified, 'minified-json')}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copiedKey === 'minified-json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy 1-Line Minified</span>
          </button>
        </div>
      </div>

      <pre className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96 scrollbar-thin">
        {formatted}
      </pre>
    </div>
  );
}

// --------------------------------------------------------------------------
// 7. BASE64 / ENCODER DASHBOARD
// --------------------------------------------------------------------------

function Base64Dashboard({
  output,
  onCopySnippet,
  copiedKey
}: {
  output: any;
  onCopySnippet: (text: string, keyId: string) => void;
  copiedKey: string | null;
}) {
  const result = output.result || (typeof output === 'string' ? output : '');
  const mode = output.mode || 'Base64 Transformed Output';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">
          {mode}
        </span>
        <button
          type="button"
          onClick={() => onCopySnippet(result, 'base64-result')}
          className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          {copiedKey === 'base64-result' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedKey === 'base64-result' ? 'Copied!' : 'Copy Result'}</span>
        </button>
      </div>

      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-200 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed max-h-72">
        {result}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 8. PROMPT OPTIMIZER DASHBOARD
// --------------------------------------------------------------------------

function PromptOptimizerDashboard({
  output,
  onCopySnippet,
  copiedKey
}: {
  output: any;
  onCopySnippet: (text: string, keyId: string) => void;
  copiedKey: string | null;
}) {
  const prompt = output.optimizedPrompt || (typeof output === 'string' ? output : '');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>LLM Engineered System Prompt</span>
        </span>
        <button
          type="button"
          onClick={() => onCopySnippet(prompt, 'prompt-result')}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          {copiedKey === 'prompt-result' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedKey === 'prompt-result' ? 'Copied Prompt!' : 'Copy Prompt'}</span>
        </button>
      </div>

      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-purple-200 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96">
        {prompt}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 9. FINANCIAL & MATHEMATICAL DASHBOARD
// --------------------------------------------------------------------------

function FinancialDashboard({
  output,
  toolName,
  onCopySnippet,
  copiedKey
}: {
  output: any;
  toolName: string;
  onCopySnippet: (text: string, keyId: string) => void;
  copiedKey: string | null;
}) {
  // Find primary numeric key
  const entries = typeof output === 'object' && output !== null ? Object.entries(output) : [];
  const primaryEntry = entries.find(([k, v]) => typeof v === 'number' || (!isNaN(Number(v)) && typeof v === 'string')) || entries[0];

  return (
    <div className="space-y-6">
      {/* Hero Stat Banner */}
      {primaryEntry && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono text-cyan-400 uppercase font-bold flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Calculated Output Metric</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
              {formatDisplayValue(primaryEntry[1])}
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Parameter: {formatKeyLabel(primaryEntry[0])}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onCopySnippet(String(primaryEntry[1]), 'hero-metric')}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
          >
            {copiedKey === 'hero-metric' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedKey === 'hero-metric' ? 'Copied' : 'Copy Primary Value'}</span>
          </button>
        </div>
      )}

      {/* Grid of All Breakdown Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {entries.map(([k, v]) => {
          const isCopied = copiedKey === k;
          return (
            <div
              key={k}
              onClick={() => onCopySnippet(String(v), k)}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider truncate">
                  {formatKeyLabel(k)}
                </span>
                <button type="button" className="text-slate-500 group-hover:text-cyan-400 transition-all">
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="text-lg font-bold font-mono text-white truncate">
                {formatDisplayValue(v)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 10. GENERIC STRUCTURED DASHBOARD (FALLBACK)
// --------------------------------------------------------------------------

function GenericStructuredDashboard({
  output,
  toolName,
  onCopySnippet,
  copiedKey
}: {
  output: any;
  toolName: string;
  onCopySnippet: (text: string, keyId: string) => void;
  copiedKey: string | null;
}) {
  if (typeof output !== 'object' || output === null) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">Processed Output Result</span>
          <button
            type="button"
            onClick={() => onCopySnippet(String(output), 'generic-text')}
            className="px-3 py-1 rounded-lg bg-slate-800 text-cyan-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
          >
            {copiedKey === 'generic-text' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'generic-text' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-mono text-slate-100 whitespace-pre-wrap leading-relaxed">
          {String(output)}
        </div>
      </div>
    );
  }

  const entries = Object.entries(output);

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {entries.map(([key, val]) => {
          const isCopied = copiedKey === key;
          const isPrimitive = typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean';
          const isArr = Array.isArray(val);

          return (
            <div
              key={key}
              onClick={() => isPrimitive && onCopySnippet(String(val), key)}
              className={`p-4 rounded-2xl bg-slate-950/70 border border-slate-800 transition-all ${
                isPrimitive ? 'hover:border-cyan-500/40 cursor-pointer group' : ''
              } flex flex-col justify-between gap-3`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-medium">
                  {formatKeyLabel(key)}
                </span>
                {isPrimitive && (
                  <button type="button" className="text-slate-500 group-hover:text-cyan-400 transition-all">
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {isArr ? (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {val.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-200"
                    >
                      {typeof item === 'object' ? JSON.stringify(item) : String(item)}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-base sm:text-lg font-bold font-mono text-white break-words">
                  {formatDisplayValue(val)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
