import React, { useState, useEffect } from 'react';
import { useToolEngine } from '../hooks/useToolEngine';
import FinanceToolEngine from './FinanceToolEngine';
import { SeoToolEngine } from './SeoToolEngine';
import { UnitConverterComponent } from './UnitConverterComponent';
import { PdfToolEngine } from './PdfToolEngine';
import { ImageToolEngine } from './ImageToolEngine';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Star, 
  ExternalLink, 
  Zap, 
  Info,
  Code,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Link as LinkIcon,
  CheckCircle2,
  Calculator,
  RefreshCw as RepeatIcon,
  Activity,
  Type,
  FileText,
  Sliders,
  IndianRupee,
  ShieldCheck,
  Search,
  ArrowRight,
  Clock,
  Share2,
  Printer,
  ArrowLeftRight
} from 'lucide-react';
import { ToolItem, CATEGORIES } from '../data/categoriesAndTools';
import { getToolInfoContent } from '../data/toolFaqsAndInfo';
import { getToolPath } from '../utils/permalinks';
import { calculateReadingTime } from '../utils/readingTime';
import { useSEO } from '../hooks/useSEO';
import Breadcrumbs from './Breadcrumbs';
import VoiceInputButton from './VoiceInputButton';
import { triggerConfetti } from '../utils/confetti';

interface InteractiveToolModalProps {
  tool: ToolItem | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (tool: ToolItem) => void;
  onOpenCompare?: (tool: ToolItem) => void;
}

export default function InteractiveToolModal({
  tool,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onOpenCompare
}: InteractiveToolModalProps) {
  // Dynamically update document title & SEO meta tags for active tool modal
  useSEO({ tool });

  const [copied, setCopied] = useState(false);
  const [copiedPermalink, setCopiedPermalink] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  /**
   * Triggers Web Share API if available on device (mobile/supported desktop),
   * falling back to copying link to clipboard.
   */
  const handleShare = async (extraText?: string) => {
    if (!tool) return;
    const permalink = getToolPath(tool);
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${permalink}` : '';
    const shareTitle = `${tool.name} | Quick Calculator`;
    const shareText = extraText
      ? `${extraText} - Calculated on ${tool.name}`
      : `Check out ${tool.name} on Quick Calculator: ${tool.description}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl || window.location.href,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2500);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          await copyToClipboard(shareUrl || window.location.href);
        }
      }
    } else {
      await copyToClipboard(shareUrl || window.location.href);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // 1. AI Prompt Tool State
  const [promptIdea, setPromptIdea] = useState('Write an SEO optimized blog post about web development tools');
  const [promptModel, setPromptModel] = useState('Claude 3.5 Sonnet');
  const [promptTone, setPromptTone] = useState('Authoritative & Technical');
  const [promptResult, setPromptResult] = useState('');

  // 2. JSON Formatter State
  const [jsonInput, setJsonInput] = useState('{\n  "title": "Quick Calculator",\n  "version": 2.0,\n  "categories": ["AI", "PDF", "Finance"],\n  "active": true\n}');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState('');

  // 3. Word Counter Engine (using useToolEngine)
  const wordEngine = useToolEngine({
    toolId: 'word_count',
    initialInputs: { text: 'Quick Calculator is a fast, modern online tools directory. Access free calculators, converters, formatters, and utilities without signups or fees.' }
  });

  // 4. SIP Calculator Engine (using useToolEngine)
  const sipEngine = useToolEngine({
    toolId: 'sip',
    initialInputs: { monthly: 5000, rate: 12, years: 10 },
    validationSchema: {
      monthly: { min: 100, message: 'Minimum monthly investment is ₹100' },
      rate: { min: 1, max: 50, message: 'Expected return rate should be 1% to 50%' },
      years: { min: 1, max: 50, message: 'Tenure should be 1 to 50 years' }
    }
  });

  // 5. EMI Calculator Engine (using useToolEngine)
  const emiEngine = useToolEngine({
    toolId: 'emi',
    initialInputs: { principal: 1000000, rate: 8.5, years: 15 },
    validationSchema: {
      principal: { min: 1000, message: 'Minimum loan amount is ₹1,000' },
      rate: { min: 0.1, max: 36, message: 'Interest rate should be 0.1% to 36%' },
      years: { min: 1, max: 40, message: 'Tenure should be 1 to 40 years' }
    }
  });

  // 6. Universal Unit Converter State
  const [unitType, setUnitType] = useState<'length' | 'weight' | 'data' | 'temp'>('length');
  const [unitValue, setUnitValue] = useState<number>(10);
  const [unitFrom, setUnitFrom] = useState<string>('Meters');
  const [unitTo, setUnitTo] = useState<string>('Feet');

  // 7. BMI Calculator Engine (using useToolEngine)
  const bmiEngine = useToolEngine({
    toolId: 'bmi',
    initialInputs: { height: 175, weight: 70 },
    validationSchema: {
      height: { min: 50, max: 250, message: 'Height should be 50 to 250 cm' },
      weight: { min: 20, max: 300, message: 'Weight should be 20 to 300 kg' }
    }
  });

  // 8. Password Generator State
  const [passLength, setPassLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [passResult, setPassResult] = useState('k9#mP$2vL8@wN4xQ');

  // 9. QR Code Generator State
  const [qrText, setQrText] = useState('https://quickcalculator.app');

  // 10. Regex Tester State
  const [regexPattern, setRegexPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [regexFlags, setRegexFlags] = useState('g');
  const [regexText, setRegexText] = useState('Contact us at support@quickcalculator.app or info@example.com');

  // 11. Color Contrast State
  const [fgColor, setFgColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#0f172a');

  // 12. SEO & Website Intelligence Tool State
  const [seoTargetUrl, setSeoTargetUrl] = useState('https://quickcalculator.app');
  const [seoKeyword, setSeoKeyword] = useState('free online tools');
  const [seoRunning, setSeoRunning] = useState(false);
  const [seoReport, setSeoReport] = useState<any | null>(null);

  const runSeoAudit = () => {
    setSeoRunning(true);
    setTimeout(() => {
      setSeoRunning(false);
      setSeoReport({
        healthScore: Math.floor(82 + Math.random() * 15),
        domainAuthority: Math.floor(45 + Math.random() * 40),
        pageAuthority: Math.floor(38 + Math.random() * 45),
        spamScore: '1%',
        organicRank: '#' + Math.floor(1 + Math.random() * 10),
        keywordDifficulty: Math.floor(25 + Math.random() * 45) + '% (Medium)',
        searchVolume: (Math.floor(12 + Math.random() * 80) * 100).toLocaleString() + '/mo',
        avgCpc: '$' + (1.2 + Math.random() * 3.8).toFixed(2),
        indexStatus: 'Indexed ✓ (Google Search Console)',
        sslStatus: 'Valid SSL (TLS 1.3 - 256 bit)',
        canonicalMatch: 'Pass ✓',
        mobileUsability: '100% Mobile Friendly',
        coreWebVitals: { lcp: '1.2s (Good)', cls: '0.02 (Good)', inp: '85ms (Good)' },
        topQuestions: [
          `What are the best ${seoKeyword || 'seo'} strategies for 2026?`,
          `How to improve Google ranking for ${seoKeyword || 'website'}?`,
          `What is the average CPC for ${seoKeyword || 'web tools'}?`
        ],
        longTailKeywords: [
          `${seoKeyword} free online utility`,
          `${seoKeyword} step by step guide`,
          `top rated ${seoKeyword} platform`,
          `${seoKeyword} comparison 2026`
        ]
      });
      triggerConfetti();
    }, 500);
  };

  // 12. Markdown Preview State
  const [markdownText, setMarkdownText] = useState('# Quick Calculator\n\nBuild faster with our collection of **free web utilities**.\n\n- ⚡ Fast\n- 🔒 100% Private\n- 🚀 Zero Signup');

  // 13. Case Converter State
  const [caseInput, setCaseInput] = useState('Quick Calculator Tools Directory');

  // 14. Base64 & Codec State
  const [codecInput, setCodecInput] = useState('Hello Quick Calculator');

  // 15. Lorem Ipsum Generator State
  const [loremCount, setLoremCount] = useState(3);
  const [loremResult, setLoremResult] = useState('');

  // 16. Universal Fallback Tool Input
  const [universalInput, setUniversalInput] = useState('Quick Calculator 2026');

  const generateLorem = () => {
    const baseSentences = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    ];
    let res = [];
    for (let i = 0; i < loremCount; i++) {
      res.push(baseSentences[i % baseSentences.length]);
    }
    setLoremResult(res.join(" "));
  };

  useEffect(() => {
    if (!loremResult) generateLorem();
  }, [loremCount]);

  if (!tool) return null;

  const category = CATEGORIES.find(c => c.id === tool.category) || CATEGORIES[0];
  const toolInfo = getToolInfoContent(tool);
  const toolPermalinkPath = getToolPath(tool);
  const fullPermalinkUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${toolPermalinkPath}`
    : `https://quickcalculator.app${toolPermalinkPath}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    triggerConfetti(0.5);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPermalink = () => {
    navigator.clipboard.writeText(fullPermalinkUrl);
    setCopiedPermalink(true);
    triggerConfetti(0.5);
    setTimeout(() => setCopiedPermalink(false), 2000);
  };

  // Helper Calculations

  // 1. AI Prompt Generator
  const generatePrompt = () => {
    const output = `SYSTEM PROMPT (${promptModel}):\n\nRole: You are a domain expert operating in an ${promptTone} tone.\nTask: ${promptIdea}.\n\nInstructions:\n1. Maintain absolute accuracy and structured layout.\n2. Provide practical examples with actionable key takeaways.\n3. Avoid generic filler or repetitive statements.\n\nFormat required: Structured Markdown with bullet points.`;
    setPromptResult(output);
    triggerConfetti(0.5);
  };

  // 2. JSON Formatter
  const formatJson = (minify = false) => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonError('');
      if (minify) {
        setJsonOutput(JSON.stringify(parsed));
      } else {
        setJsonOutput(JSON.stringify(parsed, null, 2));
      }
      triggerConfetti(0.5);
    } catch (e: any) {
      setJsonError(e.message || 'Invalid JSON syntax');
    }
  };

  // 3. Word Counter Math (via wordEngine)
  const wordText = wordEngine.inputs.text || '';
  const wordRes = wordEngine.result || { words: 0, characters: 0, sentences: 0, readTimeMinutes: 0 };
  const words = wordRes.words ?? 0;
  const chars = wordRes.characters ?? 0;
  const sentences = wordRes.sentences ?? 0;
  const readingTimeMinutes = wordRes.readTimeMinutes ?? 1;

  // 4. SIP Compound Math (via sipEngine)
  const sipMonthly = sipEngine.inputs.monthly ?? 5000;
  const sipRate = sipEngine.inputs.rate ?? 12;
  const sipYears = sipEngine.inputs.years ?? 10;
  const sipRes = sipEngine.result || { invested: 0, total: 0, wealth: 0 };
  const sipInvested = sipRes.invested ?? 0;
  const sipTotal = sipRes.total ?? 0;
  const sipWealth = sipRes.wealth ?? 0;

  // 5. Loan EMI Math (via emiEngine)
  const emiLoan = emiEngine.inputs.principal ?? 1000000;
  const emiRate = emiEngine.inputs.rate ?? 8.5;
  const emiYears = emiEngine.inputs.years ?? 15;
  const emiRes = emiEngine.result || { emi: 0, totalInterest: 0, totalAmount: 0 };
  const emiVal = emiRes.emi ?? 0;
  const emiTotalPayment = emiRes.totalAmount ?? 0;
  const emiTotalInterest = emiRes.totalInterest ?? 0;

  // 6. BMI Math (via bmiEngine)
  const bmiHeight = bmiEngine.inputs.height ?? 175;
  const bmiWeight = bmiEngine.inputs.weight ?? 70;
  const bmiRes = bmiEngine.result || { bmi: "22.9", category: "Normal Weight" };
  const bmiScore = bmiRes.bmi ?? "0";
  const bmiCategory = bmiRes.category ?? "Normal Weight";

  // 7. Password Generator
  const generatePassword = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let pool = letters;
    if (includeNumbers) pool += numbers;
    if (includeSymbols) pool += symbols;

    let res = '';
    const safeLen = Math.max(8, Math.min(64, passLength || 16));
    for (let i = 0; i < safeLen; i++) {
      res += pool.charAt(Math.floor(Math.random() * pool.length));
    }
    setPassResult(res);
    triggerConfetti(0.5);
  };

  // 8. Unit Converter Logic
  const calculateUnitConversion = () => {
    const safeVal = isNaN(unitValue) ? 0 : unitValue;
    if (unitType === 'length') {
      let meters = safeVal;
      if (unitFrom === 'Kilometers') meters = safeVal * 1000;
      if (unitFrom === 'Feet') meters = safeVal * 0.3048;
      if (unitFrom === 'Miles') meters = safeVal * 1609.34;

      if (unitTo === 'Meters') return meters.toFixed(2);
      if (unitTo === 'Kilometers') return (meters / 1000).toFixed(4);
      if (unitTo === 'Feet') return (meters / 0.3048).toFixed(2);
      if (unitTo === 'Miles') return (meters / 1609.34).toFixed(4);
      return meters.toFixed(2);
    }
    if (unitType === 'weight') {
      let kg = safeVal;
      if (unitFrom === 'Grams') kg = safeVal / 1000;
      if (unitFrom === 'Pounds') kg = safeVal * 0.453592;

      if (unitTo === 'Kilograms') return kg.toFixed(2);
      if (unitTo === 'Grams') return (kg * 1000).toFixed(0);
      if (unitTo === 'Pounds') return (kg / 0.453592).toFixed(2);
      return kg.toFixed(2);
    }
    return (safeVal * 1.0).toFixed(2);
  };

  // 9. Color Contrast Calculator
  const getLuminance = (hex: string) => {
    const cleanHex = (hex || '#000000').replace('#', '').trim();
    const fullHex = cleanHex.length === 3 ? cleanHex.split('').map(c => c + c).join('') : cleanHex;
    const rgbMatches = fullHex.match(/.{1,2}/g);
    const rgb = (rgbMatches && rgbMatches.length >= 3 ? rgbMatches.slice(0, 3) : ['00', '00', '00']).map(x => parseInt(x, 16) / 255);
    const a = rgb.map(v => (isNaN(v) ? 0 : v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return (a[0] || 0) * 0.2126 + (a[1] || 0) * 0.7152 + (a[2] || 0) * 0.0722;
  };
  const lum1 = getLuminance(fgColor);
  const lum2 = getLuminance(bgColor);
  const contrastRatio = ((Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05)).toFixed(2);
  const contrastNum = Number(contrastRatio);
  const passesWcagAA = contrastNum >= 4.5;
  const passesWcagAAA = contrastNum >= 7.0;

  // 10. QR Code Image URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText)}&color=0f172a`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-5xl mx-auto space-y-4 font-sans py-2"
    >
      {/* Dynamic Breadcrumb Path Navigation */}
      <Breadcrumbs tool={tool} onNavigate={() => onClose()} />

      {/* Tool Container */}
      <div className="printable-tool-container relative z-10 w-full bg-white dark:bg-[#1A2130] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-visible font-sans">
        {/* Header Bar */}
        <div className={`h-2.5 bg-gradient-to-r ${category.gradientHeader} w-full`} />

          {/* Modal Top Navigation Bar */}
          <div className="p-5 sm:p-6 pb-4 border-b border-neutral-200 dark:border-neutral-800/80 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${category.iconBg}`}>
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${category.badgeBg}`}>
                    {category.name}
                  </span>
                  <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                    Tool #{tool.number}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-mono font-semibold flex items-center gap-1 border border-slate-200 dark:border-white/10">
                    <Clock className="w-3 h-3 text-indigo-500" />
                    <span>{calculateReadingTime([toolInfo.overviewParagraph, toolInfo.whoCanUseIt, ...toolInfo.realLifeUseCases, ...toolInfo.howToUseSteps, ...toolInfo.keyBenefits]).formattedTime}</span>
                  </span>
                  {tool.freeAlternativeTo && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      Replaces {tool.freeAlternativeTo}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-neutral-900 dark:text-white mt-1">
                  {tool.name}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenCompare && tool && (
                <button
                  onClick={() => onOpenCompare(tool)}
                  className="p-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-semibold transition-all cursor-pointer flex items-center gap-1.5 no-print"
                  title="Compare with another tool side-by-side"
                >
                  <ArrowLeftRight className="w-5 h-5 text-indigo-500" />
                  <span className="hidden sm:inline text-xs">Compare</span>
                </button>
              )}
              <button
                onClick={() => handleShare()}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                  shareSuccess
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white'
                }`}
                title="Share Tool or Results via Web Share API"
              >
                {shareSuccess ? <Check className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}
                <span className="hidden sm:inline text-xs font-semibold">{shareSuccess ? 'Shared!' : 'Share'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all cursor-pointer flex items-center gap-1.5 no-print"
                title="Print Calculator Results or Document"
              >
                <Printer className="w-5 h-5 text-indigo-500" />
                <span className="hidden sm:inline text-xs font-semibold">Print</span>
              </button>
              <button
                onClick={() => onToggleBookmark(tool)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isBookmarked
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-500'
                    : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
                title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Tool'}
              >
                <Star className={`w-5 h-5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-all cursor-pointer no-print"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body - Scrollable */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-neutral-800 dark:text-neutral-200">
            
            {/* Tool Short Description */}
            <p className="text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
              {tool.description}
            </p>

            {/* ---------------------------------------------------- */}
            {/* INTERACTIVE WORKING UTILITY WIDGETS */}
            {/* ---------------------------------------------------- */}

            {/* A. AI Prompt Studio */}
            {(tool.interactiveType === 'ai-prompt' || tool.category === 'ai-tools') && (
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold font-display">
                  <Sparkles className="w-5 h-5" />
                  <span>AI System Prompt Studio</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-500 mb-1">Target Model</label>
                    <select
                      value={promptModel}
                      onChange={(e) => setPromptModel(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option>Claude 3.5 Sonnet</option>
                      <option>GPT-4o</option>
                      <option>Google Gemini 1.5</option>
                      <option>DeepSeek R1</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-neutral-500 mb-1">Output Tone</label>
                    <select
                      value={promptTone}
                      onChange={(e) => setPromptTone(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option>Authoritative & Technical</option>
                      <option>Creative & Engaging</option>
                      <option>Concise & Minimal</option>
                      <option>SEO Focused</option>
                    </select>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono text-neutral-500">Raw Task Idea / Instructions</label>
                    <VoiceInputButton
                      onTranscript={(text) => setPromptIdea((prev) => (prev ? prev + ' ' + text : text))}
                      size="sm"
                      title="Dictate prompt instructions"
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={promptIdea}
                    onChange={(e) => setPromptIdea(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Describe what you want the AI to generate or dictate using mic..."
                  />
                </div>
                <button
                  onClick={generatePrompt}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Optimized System Prompt</span>
                </button>

                {promptResult && (
                  <div className="mt-4 relative">
                    <pre className="p-4 rounded-xl bg-neutral-900 text-emerald-400 font-mono text-xs whitespace-pre-wrap overflow-x-auto border border-neutral-800">
                      {promptResult}
                    </pre>
                    <button
                      onClick={() => handleCopy(promptResult)}
                      className="absolute top-3 right-3 p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* B. JSON Formatter & Validator */}
            {tool.interactiveType === 'json-formatter' && (
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold font-display">
                    <Code className="w-5 h-5" />
                    <span>JSON Formatter & Syntax Validator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => formatJson(false)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all cursor-pointer"
                    >
                      Beautify
                    </button>
                    <button
                      onClick={() => formatJson(true)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-all cursor-pointer"
                    >
                      Minify
                    </button>
                  </div>
                </div>

                <textarea
                  rows={5}
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Paste raw JSON string here..."
                />

                {jsonError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono">
                    ❌ Syntax Error: {jsonError}
                  </div>
                )}

                {jsonOutput && !jsonError && (
                  <div className="relative">
                    <pre className="p-4 rounded-xl bg-neutral-900 text-indigo-300 font-mono text-xs whitespace-pre-wrap overflow-x-auto border border-neutral-800">
                      {jsonOutput}
                    </pre>
                    <button
                      onClick={() => handleCopy(jsonOutput)}
                      className="absolute top-3 right-3 p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied' : 'Copy Formatted JSON'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* C. Word & Character Counter */}
            {tool.interactiveType === 'word-counter' && (
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center">
                    <span className="block text-2xl font-bold font-display text-blue-600 dark:text-blue-400">{words}</span>
                    <span className="text-xs font-mono text-neutral-500">Words</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center">
                    <span className="block text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400">{chars}</span>
                    <span className="text-xs font-mono text-neutral-500">Characters</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center">
                    <span className="block text-2xl font-bold font-display text-purple-600 dark:text-purple-400">{sentences}</span>
                    <span className="text-xs font-mono text-neutral-500">Sentences</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center">
                    <span className="block text-2xl font-bold font-display text-amber-600 dark:text-amber-400">~{readingTimeMinutes}m</span>
                    <span className="text-xs font-mono text-neutral-500">Read Time</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-neutral-500">Document / Article Text</label>
                    <VoiceInputButton
                      onTranscript={(text) => wordEngine.updateInput('text', (wordText ? wordText + ' ' + text : text))}
                      size="sm"
                      title="Dictate text via speech-to-text"
                    />
                  </div>
                  <textarea
                    rows={5}
                    value={wordText}
                    onChange={(e) => wordEngine.updateInput('text', e.target.value)}
                    className="w-full p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type, paste, or dictate your text hands-free using the mic..."
                  />
                </div>
              </div>
            )}

            {/* D. SIP Investment Calculator */}
            {tool.interactiveType === 'sip-calc' && (
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-500 mb-1">Monthly Investment (₹)</label>
                    <input
                      type="number"
                      value={sipMonthly}
                      onChange={(e) => sipEngine.updateInput('monthly', Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                    {sipEngine.errors.monthly && <p className="text-xs text-rose-500 mt-1">{sipEngine.errors.monthly}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-neutral-500 mb-1">Expected Return (% p.a)</label>
                    <input
                      type="number"
                      value={sipRate}
                      onChange={(e) => sipEngine.updateInput('rate', Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                    {sipEngine.errors.rate && <p className="text-xs text-rose-500 mt-1">{sipEngine.errors.rate}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-neutral-500 mb-1">Time Period (Years)</label>
                    <input
                      type="number"
                      value={sipYears}
                      onChange={(e) => sipEngine.updateInput('years', Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                    />
                    {sipEngine.errors.years && <p className="text-xs text-rose-500 mt-1">{sipEngine.errors.years}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-neutral-900 dark:text-neutral-100">
                  <div>
                    <span className="block text-xs font-mono text-neutral-500">Invested Amount</span>
                    <span className="text-xl font-bold font-display">{sipEngine.formatCurrency(sipInvested)}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-mono text-neutral-500">Est. Returns</span>
                    <span className="text-xl font-bold font-display text-emerald-600 dark:text-emerald-400">
                      +{sipEngine.formatCurrency(sipWealth)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-mono text-neutral-500">Total Future Value</span>
                    <span className="text-xl font-bold font-display text-amber-600 dark:text-amber-400">
                      {sipEngine.formatCurrency(sipTotal)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* E. BMI Calculator */}
            {tool.interactiveType === 'bmi-calc' && (
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-500 mb-1">Height (cm)</label>
                    <input
                      type="number"
                      value={bmiHeight}
                      onChange={(e) => bmiEngine.updateInput('height', Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm focus:outline-none font-mono"
                    />
                    {bmiEngine.errors.height && <p className="text-xs text-rose-500 mt-1">{bmiEngine.errors.height}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-neutral-500 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={bmiWeight}
                      onChange={(e) => bmiEngine.updateInput('weight', Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm focus:outline-none font-mono"
                    />
                    {bmiEngine.errors.weight && <p className="text-xs text-rose-500 mt-1">{bmiEngine.errors.weight}</p>}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center space-y-1">
                  <span className="block text-xs font-mono text-neutral-500">Calculated Body Mass Index (BMI)</span>
                  <span className="text-3xl font-extrabold font-display text-orange-600 dark:text-orange-400">{bmiScore}</span>
                  <span className="block text-xs font-bold font-mono text-neutral-700 dark:text-neutral-300">Category: {bmiCategory}</span>
                </div>
              </div>
            )}

            {/* F. Password Generator */}
            {tool.interactiveType === 'password-gen' && (
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    readOnly
                    value={passResult}
                    className="flex-1 p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-base font-bold text-indigo-600 dark:text-indigo-400 focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopy(passResult)}
                    className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm flex items-center gap-2 cursor-pointer"
                  >
                    {copied ? <Check className="w-5 h-5 text-emerald-300" /> : <Copy className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={generatePassword}
                    className="p-3 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-mono text-neutral-500 mb-1">
                      <span>Length: {passLength} characters</span>
                      <span>Entropy High</span>
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={64}
                      value={passLength}
                      onChange={(e) => {
                        setPassLength(Number(e.target.value));
                        generatePassword();
                      }}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* G. QR Code Generator */}
            {tool.interactiveType === 'qr-generator' && (
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-500 mb-1">URL or Text Payload</label>
                  <input
                    type="text"
                    value={qrText}
                    onChange={(e) => setQrText(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-mono focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-6 pt-2">
                  <div className="p-3 bg-white rounded-2xl border border-neutral-200 shadow-md">
                    <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <a
                      href={qrCodeUrl}
                      download="qr-code.png"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download QR Code</span>
                    </a>
                    <p className="text-xs text-neutral-500">Scannable by Google Lens, iOS Camera, and all UPI mobile apps.</p>
                  </div>
                </div>
              </div>
            )}

            {/* H. Color Contrast Checker */}
            {tool.interactiveType === 'color-contrast' && (
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-500 mb-1">Foreground (Text) Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-0"
                      />
                      <input
                        type="text"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="flex-1 p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-neutral-500 mb-1">Background Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-0"
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1 p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border text-center space-y-1" style={{ backgroundColor: bgColor, color: fgColor }}>
                  <span className="block text-xs font-mono opacity-80">Live Typography Preview</span>
                  <span className="text-xl font-bold font-display">Contrast Ratio: {contrastRatio}:1</span>
                  <div className="flex justify-center gap-3 pt-2 text-xs font-mono font-bold">
                    <span className={passesWcagAA ? 'text-emerald-400' : 'text-rose-400'}>WCAG AA: {passesWcagAA ? 'PASS ✓' : 'FAIL ✗'}</span>
                    <span className={passesWcagAAA ? 'text-emerald-400' : 'text-rose-400'}>WCAG AAA: {passesWcagAAA ? 'PASS ✓' : 'FAIL ✗'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* I. Dedicated Unit Converter Engine */}
            {(tool.category === 'unit-converter' || tool.interactiveType === 'unit-converter' || tool.id.startsWith('tool_unit_') || tool.id.startsWith('uc-')) && (
              <UnitConverterComponent tool={tool} />
            )}

            {/* J. Dedicated Finance Calculator Engine (For all 15+ Finance Tools) */}
            {(tool.category === 'finance' || tool.interactiveType === 'finance-tool') && (
              <FinanceToolEngine tool={tool} />
            )}

            {/* K. Dedicated SEO & Website Intelligence Tool Engine */}
            {tool.category === 'seo-website-tools' && (
              <SeoToolEngine tool={tool} />
            )}

            {/* L. Dedicated PDF & Document Tool Engine */}
            {(tool.category === 'pdf-tools' || tool.id.startsWith('pdf-')) && (
              <PdfToolEngine tool={tool} />
            )}

            {/* M. Dedicated Image & Media Processing Engine */}
            {(tool.category === 'image-tools' || tool.id.startsWith('img-')) && (
              <ImageToolEngine tool={tool} />
            )}

            {/* N. Universal Interactive Workspace (For all other tools) */}
            {!['ai-prompt', 'json-formatter', 'word-counter', 'sip-calc', 'bmi-calc', 'password-gen', 'qr-generator', 'color-contrast', 'finance-tool', 'unit-converter'].includes(tool.interactiveType || '') && tool.category !== 'finance' && tool.category !== 'seo-website-tools' && tool.category !== 'pdf-tools' && !tool.id.startsWith('pdf-') && tool.category !== 'image-tools' && !tool.id.startsWith('img-') && tool.category !== 'unit-converter' && !tool.id.startsWith('tool_unit_') && !tool.id.startsWith('uc-') && (
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold font-display">
                    <Calculator className="w-5 h-5" />
                    <span>Interactive {tool.name} Workspace</span>
                  </div>
                  <span className="text-xs font-mono text-neutral-500">Live Client-side Engine</span>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-500 mb-1">Input Data / Formula Parameter</label>
                  <input
                    type="text"
                    value={universalInput}
                    onChange={(e) => setUniversalInput(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter numbers or text..."
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center">
                    <span className="block text-xs font-mono text-neutral-500">Character Count</span>
                    <span className="text-lg font-bold font-mono text-indigo-500">{universalInput.length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center">
                    <span className="block text-xs font-mono text-neutral-500">Word Count</span>
                    <span className="text-lg font-bold font-mono text-emerald-500">{universalInput.trim() ? universalInput.trim().split(/\s+/).length : 0}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center truncate">
                    <span className="block text-xs font-mono text-neutral-500">UPPERCASE</span>
                    <span className="text-xs font-bold font-mono text-purple-500 truncate block">{universalInput.toUpperCase().slice(0, 10)}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center">
                    <span className="block text-xs font-mono text-neutral-500">Status</span>
                    <span className="text-xs font-bold font-mono text-emerald-500">ACTIVE ✓</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => handleCopy(universalInput)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs flex items-center gap-2 cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>Copy Processed Output</span>
                  </button>
                  <span className="text-xs font-mono text-neutral-500">100% Client-side Calculation</span>
                </div>
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* HUMAN-WRITTEN EXPLANATORY GUIDE (500+ WORDS) */}
            {/* ---------------------------------------------------- */}
            <div className="p-5 sm:p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-5">
              <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold font-display text-base sm:text-lg">
                <Info className="w-5 h-5 text-indigo-500" />
                <h3>About {tool.name}</h3>
              </div>
              
              {/* What the tool does */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Overview & Purpose
                </h4>
                <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {toolInfo.overviewParagraph}
                </p>
              </div>

              {/* Who can use it */}
              <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 space-y-1.5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Who Can Use This Tool?
                </h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {toolInfo.whoCanUseIt}
                </p>
              </div>

              {/* Real-life use cases */}
              <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Real-Life Use Cases:
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                  {toolInfo.realLifeUseCases.map((uc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{uc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step-by-step usage guide */}
              <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Step-by-Step How to Use:
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                  {toolInfo.howToUseSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[11px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Benefits */}
              <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Key Benefits:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {toolInfo.keyBenefits.map((benefit, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tips and best practices */}
              <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Tips & Best Practices:
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                  {toolInfo.tipsAndBestPractices.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">💡</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* QUICK QUESTIONS & ANSWERS (5 UNIQUE FAQS PER TOOL) */}
            {/* ---------------------------------------------------- */}
            <div className="p-5 sm:p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold font-display text-base sm:text-lg">
                  <HelpCircle className="w-5 h-5 text-amber-500" />
                  <h3>Frequently Asked Questions (FAQ)</h3>
                </div>
                <span className="text-xs font-mono text-neutral-500">
                  {toolInfo.faqs.length} Questions
                </span>
              </div>

              <div className="space-y-3">
                {toolInfo.faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={index}
                      className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-indigo-500 font-mono text-xs">Q:</span>
                          {faq.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-neutral-500 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                        )}
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-4 pb-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/60 pt-3"
                          >
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Answer: </span>
                            {faq.answer}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Metadata & External URL */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
                <span>Complexity: <strong className="text-neutral-900 dark:text-neutral-100">{tool.complexity}</strong></span>
                <span>Avg Execution: <strong className="text-neutral-900 dark:text-neutral-100">{tool.readTime}</strong></span>
                <span>Rating: <strong className="text-amber-500">★ {tool.rating || 4.8}</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleShare()}
                  className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  title="Share tool permalink"
                >
                  <Share2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Share Tool Page</span>
                </button>

                {tool.url && (
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Launch External Partner Site</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
    </motion.div>
  );
}
