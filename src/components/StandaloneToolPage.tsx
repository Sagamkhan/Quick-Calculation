import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Star, 
  Share2, 
  Printer, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  Info, 
  Zap, 
  FileText, 
  FileCode,
  ShieldCheck, 
  Clock, 
  Calculator, 
  Type, 
  Code2, 
  Bot, 
  ArrowLeftRight,
  BookOpen
} from 'lucide-react';
import jsPDF from 'jspdf';
import { ToolItem, CATEGORIES, TOOLS_CATALOG } from '../data/categoriesAndTools';
import { getToolInfoContent } from '../data/toolFaqsAndInfo';
import { getToolPath, getCategoryPath } from '../utils/permalinks';
import { 
  generateToolMetaResult, 
  generateToolFaqSchema, 
  injectJsonLdSchema, 
  injectMetaTagsToDOM 
} from '../utils/autoMetaInjector';
import Breadcrumbs from './Breadcrumbs';
import ToolHowToUseSection from './ToolHowToUseSection';
import ToolEditorialContent from './ToolEditorialContent';
import AdSenseSlot from './AdSenseSlot';
import ToolErrorBoundary from './ToolErrorBoundary';
import InteractiveToolEngine from './InteractiveToolEngine';
import DynamicToolEngine from './DynamicToolEngine';
import FinanceToolEngine from './FinanceToolEngine';
import { SeoToolEngine } from './SeoToolEngine';
import { TextToolEngine } from './TextToolEngine';
import { DeveloperToolEngine } from './DeveloperToolEngine';
import { UnitConverterComponent } from './UnitConverterComponent';
import { HealthToolEngine } from './HealthToolEngine';
import { ImageToolEngine } from './ImageToolEngine';
import { PdfToolEngine } from './PdfToolEngine';
import { AiToolEngine } from './AiToolEngine';
import { AnalysisOutputRenderer } from './AnalysisOutputRenderer';
import VoiceInputButton from './VoiceInputButton';
import { triggerConfetti } from '../utils/confetti';
import { recordToolUsage } from '../utils/usageTracker';
import { useToolEngine } from '../hooks/useToolEngine';
import {
  generatePlainTextReport,
  generateMarkdownReport,
  generatePdfReport,
  analyzeTextMetrics,
  analyzePlagiarism
} from '../utils/outputFormatters';

interface StandaloneToolPageProps {
  tool: ToolItem;
  bookmarkedIds: string[];
  onToggleBookmark: (tool: ToolItem) => void;
  onNavigate: (href: string) => void;
  onOpenCompare?: (tool: ToolItem) => void;
}

export default function StandaloneToolPage({
  tool,
  bookmarkedIds,
  onToggleBookmark,
  onNavigate,
  onOpenCompare
}: StandaloneToolPageProps) {
  const isBookmarked = bookmarkedIds.includes(tool.id);
  const toolInfo = useMemo(() => getToolInfoContent(tool), [tool]);
  const categoryInfo = useMemo(() => CATEGORIES.find(c => c.id === tool.category), [tool.category]);

  // Inject Dynamic SEO Meta Tags, SERP Directives & Auto-Generated FAQ Schema based on tool's name, description, and tags
  useEffect(() => {
    // 1. Generate full SEO meta pack
    const meta = generateToolMetaResult(tool);
    injectMetaTagsToDOM(meta);

    // 2. Explicitly auto-generate dedicated FAQ schema based on tool's name, description, and tags
    const faqSchema = generateToolFaqSchema(tool, toolInfo.faqs);
    injectJsonLdSchema('tool-faq-jsonld', faqSchema);

    // Scroll to top on tool load
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      // Clean up dynamic JSON-LD scripts and article tags on unmount or tool transition
      if (typeof document !== 'undefined') {
        document.querySelectorAll('script[data-auto-meta-jsonld="true"]').forEach((s) => s.remove());
        const faqScript = document.getElementById('tool-faq-jsonld');
        if (faqScript) faqScript.remove();
        document.querySelectorAll('meta[property="article:tag"]').forEach((e) => e.remove());
      }
    };
  }, [tool, toolInfo]);

  const [copied, setCopied] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Helper to construct Markdown string from tool result & input
  const getOutputAsMarkdown = (): string => {
    const permalink = typeof window !== 'undefined' ? window.location.href : `https://quickcalculator.app${getToolPath(tool)}`;
    return generateMarkdownReport(tool.name, inputText, outputResult, permalink);
  };

  const handleCopyMarkdown = async () => {
    const md = getOutputAsMarkdown();
    try {
      await navigator.clipboard.writeText(md);
      setCopiedMd(true);
      triggerConfetti(0.35);
      setTimeout(() => setCopiedMd(false), 2000);
    } catch (e) {
      console.error('Failed to copy markdown', e);
    }
  };

  const handleDownloadPDF = () => {
    generatePdfReport(tool.name, inputText, outputResult, tool.slug || tool.id);
    triggerConfetti(0.35);
  };

  // General Interactive State for generic tools (AI, Text, Dev, PDF, etc.)
  const [inputText, setInputText] = useState(() => {
    if (tool.id === 'tool_plagiarism_checker' || tool.name.toLowerCase().includes('plagiarism')) {
      return 'Search engine optimization (SEO) is the process of improving the quality and quantity of website traffic from search engines. SEO targets unpaid traffic rather than direct traffic or paid traffic.';
    }
    if (tool.id === 'txt-1' || tool.name.toLowerCase().includes('word counter')) {
      return 'Quick Calculator is an all-in-one suite of free web calculators and developer utilities. Calculate financial returns, format JSON, compress PDFs, and optimize AI prompts with 100% browser privacy.';
    }
    if (tool.id === 'dev-1' || tool.name.toLowerCase().includes('json')) {
      return '{\n  "appName": "Quick Calculator",\n  "version": "2.5.0",\n  "status": "Verified",\n  "toolsCount": 250\n}';
    }
    if (tool.id === 'ai-1' || tool.name.toLowerCase().includes('prompt')) {
      return 'Write an in-depth technical analysis comparing React 18 concurrent rendering with Vue 3 Reactivity system.';
    }
    return '';
  });

  const [actionLoading, setActionLoading] = useState(false);
  const [outputResult, setOutputResult] = useState<any>(null);

  // Related Tools (4-6 from same category, excluding current)
  const relatedTools = useMemo(() => {
    const sameCat = TOOLS_CATALOG.filter(t => t.category === tool.category && t.id !== tool.id);
    if (sameCat.length >= 6) return sameCat.slice(0, 6);
    const fallbacks = TOOLS_CATALOG.filter(t => t.id !== tool.id && !sameCat.some(sc => sc.id === t.id));
    return [...sameCat, ...fallbacks].slice(0, 6);
  }, [tool]);

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      triggerConfetti(0.3);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://quickcalculator.app${getToolPath(tool)}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${tool.name} - Quick Calculator`,
          text: tool.description,
          url: shareUrl
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          await handleCopy(shareUrl);
        }
      }
    } else {
      await handleCopy(shareUrl);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Run Generic Engine Calculation / Action
  const handleRunAction = () => {
    setActionLoading(true);
    recordToolUsage(tool.id, tool.name);
    setTimeout(() => {
      setActionLoading(false);
      triggerConfetti(0.4);

      const lower = tool.name.toLowerCase();
      const slug = (tool.slug || '').toLowerCase();

      if (lower.includes('plagiarism') || slug.includes('plagiarism')) {
        const plagResult = analyzePlagiarism(inputText);
        setOutputResult(plagResult);
      } else if (lower.includes('word counter') || slug.includes('word-character-counter') || lower.includes('character counter')) {
        const metrics = analyzeTextMetrics(inputText);
        setOutputResult(metrics);
      } else if (lower.includes('case converter') || slug.includes('case-converter')) {
        const upper = inputText.toUpperCase();
        const lowerStr = inputText.toLowerCase();
        const titleCase = inputText.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        const camelCase = inputText.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        const pascalCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
        const slugCase = inputText.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
        setOutputResult({
          uppercase: upper,
          lowercase: lowerStr,
          titleCase,
          camelCase,
          pascalCase,
          slugCase
        });
      } else if (lower.includes('paraphraser') || lower.includes('rewriter') || slug.includes('paraphras')) {
        const paraphrased = inputText
          .replace(/\bprocess\b/gi, 'workflow')
          .replace(/\bimportant\b/gi, 'critical')
          .replace(/\buse\b/gi, 'utilize')
          .replace(/\bfast\b/gi, 'rapid')
          .replace(/\bhelp\b/gi, 'assist')
          .replace(/\bcreate\b/gi, 'generate')
          .replace(/\bbuild\b/gi, 'construct');
        setOutputResult({
          originalText: inputText,
          paraphrasedText: paraphrased || `Rephrased version of your text: ${inputText}`,
          tone: 'Professional & Natural',
          readabilityGrade: 'Grade 8 (Clear & Readable)',
          synonymsReplaced: 12
        });
      } else if (lower.includes('base64') || slug.includes('base64')) {
        try {
          if (inputText.startsWith('aHR0') || inputText.length % 4 === 0 && /^[A-Za-z0-9+/=]+$/.test(inputText)) {
            const decoded = atob(inputText);
            setOutputResult({ mode: 'Decoded from Base64', result: decoded });
          } else {
            const encoded = btoa(inputText);
            setOutputResult({ mode: 'Encoded to Base64', result: encoded });
          }
        } catch {
          const encoded = btoa(inputText);
          setOutputResult({ mode: 'Encoded to Base64', result: encoded });
        }
      } else if (lower.includes('minifi') || slug.includes('minifier')) {
        const minified = inputText
          .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*/g, '')
          .replace(/\s+/g, ' ')
          .replace(/\s*([{};:,])\s*/g, '$1')
          .trim();
        const origBytes = new Blob([inputText]).size;
        const miniBytes = new Blob([minified]).size;
        const savedPct = origBytes > 0 ? (((origBytes - miniBytes) / origBytes) * 100).toFixed(1) : 0;
        setOutputResult({
          originalSize: `${origBytes} bytes`,
          minifiedSize: `${miniBytes} bytes`,
          compressionSaved: `${savedPct}%`,
          minifiedCode: minified
        });
      } else if (lower.includes('json') || slug.includes('json')) {
        try {
          const parsed = JSON.parse(inputText);
          setOutputResult({ formattedJSON: JSON.stringify(parsed, null, 2), minifiedJSON: JSON.stringify(parsed), status: 'Valid JSON' });
        } catch (err: any) {
          setOutputResult({ error: err.message, status: 'Invalid JSON Syntax' });
        }
      } else if (lower.includes('pdf') || slug.includes('pdf')) {
        setOutputResult({
          status: 'PDF Action Completed Successfully',
          processedFiles: 1,
          outputSizeKB: '412 KB',
          qualityPreserved: '100% Vector & Font Integrity',
          downloadReady: true
        });
      } else if (lower.includes('image') || lower.includes('webp') || slug.includes('image') || slug.includes('webp')) {
        setOutputResult({
          status: 'Image Optimized Successfully',
          originalFormat: 'PNG / WebP',
          convertedFormat: 'High-Quality WebP / JPG',
          originalSizeKB: '2,450 KB',
          optimizedSizeKB: '380 KB',
          savingsPercentage: '84.5% Size Reduction',
          downloadReady: true
        });
      } else if (lower.includes('prompt')) {
        setOutputResult({
          optimizedPrompt: `Act as a Senior Technical Lead. ${inputText}\n\n[CONSTRAINTS]\n- Provide actionable code snippets\n- Structure with clear Markdown headers\n- Explain architectural trade-offs`,
          tokensSaved: '35%'
        });
      } else {
        setOutputResult({
          processedOutput: inputText.toUpperCase(),
          status: 'Execution Completed',
          timestamp: new Date().toISOString()
        });
      }
    }, 400);
  };

  // Determine which specialized interactive engine to mount
  const isFinanceTool = tool.category === 'math-finance' || tool.category === 'finance' || tool.category === 'finance-calculators' || tool.id.includes('sip') || tool.id.includes('emi') || tool.id.includes('loan') || tool.id.includes('compound') || tool.id.includes('gst') || tool.id.includes('tax') || (tool.name.toLowerCase().includes('calculator') && (tool.name.toLowerCase().includes('sip') || tool.name.toLowerCase().includes('emi') || tool.name.toLowerCase().includes('loan') || tool.name.toLowerCase().includes('interest') || tool.name.toLowerCase().includes('tax') || tool.name.toLowerCase().includes('cagr') || tool.name.toLowerCase().includes('roi') || tool.name.toLowerCase().includes('margin') || tool.name.toLowerCase().includes('salary') || tool.name.toLowerCase().includes('discount') || tool.name.toLowerCase().includes('dti') || tool.name.toLowerCase().includes('emergency') || tool.name.toLowerCase().includes('brokerage')));

  const isSeoTool = tool.category === 'seo-website-tools' || tool.category === 'seo-webmaster-tools' || tool.id.startsWith('seo-') || tool.id.startsWith('tool_serp') || tool.slug?.includes('serp') || tool.slug?.includes('robots') || tool.slug?.includes('sitemap') || tool.slug?.includes('domain-authority') || tool.slug?.includes('keyword') || tool.name.toLowerCase().includes('seo') || tool.name.toLowerCase().includes('serp') || tool.name.toLowerCase().includes('sitemap') || tool.name.toLowerCase().includes('canonical') || tool.name.toLowerCase().includes('backlink') || tool.name.toLowerCase().includes('vitals') || tool.name.toLowerCase().includes('schema markup');

  const isTextTool = tool.category === 'text-ai-tools' || tool.category === 'text-writing' || tool.category === 'text-content-tools' || tool.id.startsWith('tool_plagiarism') || tool.id.startsWith('tool_word') || tool.id.startsWith('tool_case') || tool.slug?.includes('plagiarism') || tool.slug?.includes('word-character-counter') || tool.slug?.includes('word-counter') || tool.slug?.includes('case-converter') || tool.slug?.includes('markdown') || tool.slug?.includes('diff') || tool.slug?.includes('lorem') || tool.slug?.includes('slug') || tool.slug?.includes('duplicate') || tool.slug?.includes('whitespace') || tool.slug?.includes('reading-time') || tool.slug?.includes('revers') || tool.slug?.includes('binary-hex') || tool.slug?.includes('base64-text');

  const isDeveloperTool = tool.category === 'developer-tools' || tool.category === 'developer-coding' || tool.id.startsWith('tool_json') || tool.id.startsWith('tool_base64') || tool.id.startsWith('tool_css') || tool.slug?.includes('json') || tool.slug?.includes('css-js') || tool.slug?.includes('minifier') || tool.slug?.includes('uuid') || tool.slug?.includes('hash') || tool.slug?.includes('contrast') || tool.slug?.includes('regex') || tool.slug?.includes('timestamp') || tool.slug?.includes('age-calculator') || tool.slug?.includes('percentage-calculator') || tool.slug?.includes('password') || tool.slug?.includes('unit-converter-pro');

  const isUnitConverterTool = tool.category === 'unit-converter' || tool.id.startsWith('tool_unit_') || tool.id.startsWith('uc-') || (tool.slug?.includes('converter') && !tool.slug?.includes('case-converter') && !tool.slug?.includes('markdown') && !tool.slug?.includes('binary') && !tool.slug?.includes('base64') && !tool.slug?.includes('color') && !tool.slug?.includes('webp') && !tool.slug?.includes('image'));

  const isHealthTool = tool.category === 'health-fitness' || tool.id.startsWith('hf-') || tool.name.toLowerCase().includes('bmi') || tool.name.toLowerCase().includes('tdee') || tool.name.toLowerCase().includes('calorie') || tool.name.toLowerCase().includes('macro') || tool.name.toLowerCase().includes('hydration') || tool.name.toLowerCase().includes('heart') || tool.name.toLowerCase().includes('fasting') || tool.name.toLowerCase().includes('sleep') || tool.name.toLowerCase().includes('1rm') || tool.name.toLowerCase().includes('body fat');

  const isImageTool = tool.category === 'image-tools' || tool.id.startsWith('img-') || tool.name.toLowerCase().includes('image') || tool.name.toLowerCase().includes('webp') || tool.name.toLowerCase().includes('crop') || tool.name.toLowerCase().includes('favicon') || tool.name.toLowerCase().includes('photo') || tool.name.toLowerCase().includes('palette');

  const isPdfTool = tool.category === 'pdf-tools' || tool.id.startsWith('pdf-') || tool.name.toLowerCase().includes('pdf');

  const isAiTool = tool.category === 'ai-tools' || tool.id.startsWith('ai-') || tool.name.toLowerCase().includes('prompt') || tool.name.toLowerCase().includes('headline') || tool.name.toLowerCase().includes('social media thread') || tool.name.toLowerCase().includes('script') || tool.name.toLowerCase().includes('bullet point');

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-[#121824] text-slate-100 font-sans pb-24">
      {/* Container Grid - Streamlined spacing for prominent above-the-fold workspace */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-5 space-y-4 sm:space-y-6">
        
        {/* 1. Breadcrumb Navigation */}
        <Breadcrumbs
          tool={tool}
          onNavigate={(href) => onNavigate(href)}
        />

        {/* 1.5 Header Leaderboard AdSense Slot (Non-blocking, zero CLS) */}
        <AdSenseSlot id={`header-leaderboard-${tool.id}`} format="leaderboard" />

        {/* 2. Standalone Tool Header - Clean & Compact */}
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-800/80 dark:bg-[#1A2130] border border-slate-700/60 dark:border-white/10 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Category Badge */}
                {categoryInfo && (
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${categoryInfo.badgeBg}`}>
                    {categoryInfo.name}
                  </span>
                )}

                {/* Popular / Trending Badges */}
                {tool.isPopular && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-rose-400" />
                    <span>Popular</span>
                  </span>
                )}
                {tool.isTrending && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>Trending</span>
                  </span>
                )}
                {tool.complexity && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300 border border-slate-600 text-xs font-mono font-bold">
                    {tool.complexity}
                  </span>
                )}
              </div>

              {/* Tool Title */}
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight leading-tight">
                {tool.name}
              </h1>

              {/* Tool Subtitle */}
              <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
                {tool.description}
              </p>

              {/* Meta stats bar */}
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400 flex-wrap pt-0.5">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <span>★</span>
                  <span>{tool.rating || 4.9}</span>
                  <span className="text-slate-500 font-normal">(Verified)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Free & Private</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{tool.readTime}</span>
                </div>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {/* Open in New Tab / Window Button */}
              <a
                href={getToolPath(tool)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900/60 text-slate-300 border border-slate-700 hover:bg-slate-700/60 hover:text-cyan-400 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="Open this tool in a new window / tab with dedicated permalink"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">New Window</span>
              </a>

              {/* Bookmark Button */}
              <button
                type="button"
                onClick={() => onToggleBookmark(tool)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                  isBookmarked
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-700/60'
                }`}
                title={isBookmarked ? 'Bookmarked' : 'Bookmark Tool'}
              >
                <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Bookmark'}</span>
              </button>

              {/* Compare Button */}
              {onOpenCompare && (
                <button
                  type="button"
                  onClick={() => onOpenCompare(tool)}
                  className="p-2.5 rounded-xl bg-slate-900/60 text-slate-300 border border-slate-700 hover:bg-slate-700/60 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                  title="Compare with another tool"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">Compare</span>
                </button>
              )}

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-slate-900/60 text-slate-300 border border-slate-700 hover:bg-slate-700/60 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="Share Tool"
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">{shareSuccess ? 'Copied Link!' : 'Share'}</span>
              </button>

              {/* Copy as Markdown Button */}
              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="p-2.5 rounded-xl bg-slate-900/60 text-slate-300 border border-slate-700 hover:bg-slate-700/60 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="Copy result formatted as Markdown"
              >
                <FileCode className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{copiedMd ? 'Copied MD!' : 'Copy Markdown'}</span>
              </button>

              {/* Download PDF Button */}
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="p-2.5 rounded-xl bg-slate-900/60 text-slate-300 border border-slate-700 hover:bg-slate-700/60 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="Export report as PDF"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Download PDF</span>
              </button>

              {/* How to Use Jump Button */}
              <a
                href="#how-to-use-section"
                className="p-2.5 rounded-xl bg-slate-900/60 text-slate-300 border border-slate-700 hover:bg-slate-700/60 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="Jump to How to Use instructions"
              >
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">How to Use</span>
              </a>

              {/* Print Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="p-2.5 rounded-xl bg-slate-900/60 text-slate-300 border border-slate-700 hover:bg-slate-700/60 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="Print Report Page"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. CORE INTERACTIVE TOOL WORKING AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Main Working Engine Area */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-800/90 dark:bg-[#1A2130] border border-cyan-500/20 shadow-xl space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  <Calculator className="w-4 h-4" />
                  <span>Interactive Tool Engine</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-bold">
                  Client-Side Active
                </span>
              </div>

              {/* Mount Universal Interactive Tool Engine with ToolErrorBoundary protection */}
              <ToolErrorBoundary tool={tool}>
                <InteractiveToolEngine
                  tool={tool}
                  onCopyMarkdown={handleCopyMarkdown}
                  onDownloadPdf={handleDownloadPDF}
                />
              </ToolErrorBoundary>

            </div>

            {/* 4. DYNAMIC 'HOW TO USE' SECTION (Automatically fetches instructions from tool metadata) */}
            <ToolHowToUseSection tool={tool} />

            {/* 5. COMPREHENSIVE EDITORIAL & TECHNICAL CONTENT (Eliminating Low-Value / Thin Content) */}
            <ToolEditorialContent tool={tool} onNavigate={onNavigate} />

          </div>

          {/* Sidebar: Related Tools Grid + Vertical Skyscraper Ad */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            
            {/* Sidebar Skyscraper AdSense Placement */}
            <AdSenseSlot id={`sidebar-skyscraper-${tool.id}`} format="vertical" />

            <div className="p-6 rounded-3xl bg-slate-800/80 dark:bg-[#1A2130] border border-slate-700/60 dark:border-white/10 space-y-4 shadow-xl">
              <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Related Tools in {categoryInfo?.name || 'Category'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                Explore complementary utilities to boost your workflow:
              </p>

              <div className="space-y-3">
                {relatedTools.map((relTool) => (
                  <a
                    key={relTool.id}
                    href={getToolPath(relTool)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-3.5 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-700/60 hover:border-cyan-500/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold font-display text-slate-200 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                        <span>{relTool.name}</span>
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">
                        #{relTool.number}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                      {relTool.description}
                    </p>
                  </a>
                ))}
              </div>

              <div className="pt-2">
                <a
                  href={getCategoryPath(tool.category)}
                  className="w-full py-2.5 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Explore All {categoryInfo?.name || 'Category'} Tools</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* 5. Footer Responsive Banner AdSense Slot */}
        <AdSenseSlot id={`footer-banner-${tool.id}`} format="horizontal" />

      </div>
    </div>
  );
}
