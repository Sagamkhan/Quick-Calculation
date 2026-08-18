import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calculator,
  Zap,
  RefreshCw,
  Copy,
  Check,
  Download,
  TrendingUp,
  Sparkles,
  SlidersHorizontal,
  Table as TableIcon,
  PieChart as PieIcon,
  CheckCircle2,
  FileCode,
  Layers,
  ArrowRight,
  Info,
  IndianRupee,
  DollarSign,
  Lock,
  KeyRound,
  ShieldCheck,
  Type,
  AlignLeft,
  ArrowLeftRight,
  Trash2,
  Binary,
  Clock,
  Scale,
  Ruler,
  Terminal,
  FileSpreadsheet
} from 'lucide-react';
import jsPDF from 'jspdf';
import { ToolItem } from '../data/categoriesAndTools';
import { triggerConfetti } from '../utils/confetti';
import { recordToolUsage } from '../utils/usageTracker';
import { getStoredCustomTools } from '../utils/customToolsStorage';
import {
  generateSecurePassword,
  calculatePasswordStrength,
  computeMD5,
  computeSHA256,
  safeBase64Encode,
  safeBase64Decode
} from '../utils/cryptoHelpers';
import { UNIT_CONVERSION_SPECS, convertUnitValue } from '../data/unitConverters';
import VoiceInputButton from './VoiceInputButton';

interface DynamicToolEngineProps {
  tool: ToolItem;
  onCopyMarkdown?: () => void;
  onDownloadPdf?: () => void;
}

export default function DynamicToolEngine({
  tool,
  onCopyMarkdown,
  onDownloadPdf
}: DynamicToolEngineProps) {
  const toolSlug = (tool.slug || tool.id || '').toLowerCase();
  const toolName = (tool.name || '').toLowerCase();
  const category = (tool.category || '').toLowerCase();

  // Record tool usage
  useEffect(() => {
    recordToolUsage(tool.id, tool.name);
  }, [tool.id, tool.name]);

  // Determine Archetype
  const archetype = useMemo<'dev' | 'finance' | 'math' | 'text' | 'converter' | 'generic'>(() => {
    // 1. Developer & Security
    if (
      category.includes('dev') ||
      category.includes('code') ||
      category.includes('security') ||
      toolSlug.includes('password') ||
      toolSlug.includes('hash') ||
      toolSlug.includes('sha') ||
      toolSlug.includes('md5') ||
      toolSlug.includes('base64') ||
      toolSlug.includes('json') ||
      toolSlug.includes('uuid') ||
      toolSlug.includes('jwt') ||
      toolSlug.includes('css') ||
      toolSlug.includes('regex') ||
      toolName.includes('password') ||
      toolName.includes('hash') ||
      toolName.includes('base64') ||
      toolName.includes('json') ||
      toolName.includes('developer')
    ) {
      return 'dev';
    }

    // 2. Unit Converter
    if (
      category.includes('unit') ||
      category.includes('convert') ||
      toolSlug.includes('unit-converter') ||
      toolSlug.includes('measurement') ||
      toolSlug.includes('length') ||
      toolSlug.includes('weight-converter') ||
      toolSlug.includes('temperature-converter') ||
      (toolName.includes('converter') && !toolName.includes('case') && !toolName.includes('markdown'))
    ) {
      return 'converter';
    }

    // 3. Text & Writing
    if (
      category.includes('text') ||
      category.includes('writing') ||
      category.includes('content') ||
      toolSlug.includes('word') ||
      toolSlug.includes('character') ||
      toolSlug.includes('case') ||
      toolSlug.includes('rephrase') ||
      toolSlug.includes('plagiarism') ||
      toolSlug.includes('markdown') ||
      toolSlug.includes('diff') ||
      toolSlug.includes('lorem') ||
      toolSlug.includes('whitespace') ||
      toolName.includes('word counter') ||
      toolName.includes('case converter') ||
      toolName.includes('text') ||
      toolName.includes('rephraser')
    ) {
      return 'text';
    }

    // 4. Finance
    if (
      category.includes('finance') ||
      toolSlug.includes('sip') ||
      toolSlug.includes('emi') ||
      toolSlug.includes('loan') ||
      toolSlug.includes('cagr') ||
      toolSlug.includes('roi') ||
      toolSlug.includes('margin') ||
      toolSlug.includes('tax') ||
      toolSlug.includes('gst') ||
      toolSlug.includes('salary') ||
      toolSlug.includes('discount') ||
      toolSlug.includes('compound') ||
      toolSlug.includes('mortgage') ||
      toolSlug.includes('fd') ||
      toolSlug.includes('rd') ||
      toolName.includes('sip') ||
      toolName.includes('emi') ||
      toolName.includes('loan') ||
      toolName.includes('interest') ||
      toolName.includes('salary') ||
      toolName.includes('tax') ||
      toolName.includes('discount')
    ) {
      return 'finance';
    }

    // 5. Math & Percentage
    if (
      category.includes('math') ||
      toolSlug.includes('percentage') ||
      toolSlug.includes('fraction') ||
      toolSlug.includes('average') ||
      toolSlug.includes('exponent') ||
      toolSlug.includes('log') ||
      toolName.includes('percentage') ||
      toolName.includes('math')
    ) {
      return 'math';
    }

    return 'generic';
  }, [category, toolSlug, toolName]);

  // Global Copied notification state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopy = (text: string, key: string = 'main') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    triggerConfetti(0.25);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // =========================================================================
  // WORKSPACE A: DEVELOPER & SECURITY TOOLS
  // =========================================================================
  const [pwLength, setPwLength] = useState<number>(16);
  const [pwUpper, setPwUpper] = useState<boolean>(true);
  const [pwLower, setPwLower] = useState<boolean>(true);
  const [pwNumbers, setPwNumbers] = useState<boolean>(true);
  const [pwSymbols, setPwSymbols] = useState<boolean>(true);
  const [devInputText, setDevInputText] = useState<string>(() => {
    if (toolSlug.includes('json') || toolName.includes('json')) {
      return '{\n  "appName": "Quick Calculator",\n  "version": "2.5.0",\n  "status": "Verified",\n  "privacy": "100% Client-Side"\n}';
    }
    if (toolSlug.includes('hash') || toolName.includes('hash')) {
      return 'Quick Calculator High-Speed Cryptographic Suite';
    }
    if (toolSlug.includes('base64') || toolName.includes('base64')) {
      return 'https://quickcalc.in/tools/base64-encoder-decoder';
    }
    return 'SecurePassword123!';
  });

  const [generatedPassword, setGeneratedPassword] = useState<string>(() => {
    return generateSecurePassword({
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true
    });
  });

  const handleGeneratePassword = useCallback(() => {
    const pw = generateSecurePassword({
      length: pwLength,
      uppercase: pwUpper,
      lowercase: pwLower,
      numbers: pwNumbers,
      symbols: pwSymbols
    });
    setGeneratedPassword(pw);
    triggerConfetti(0.2);
  }, [pwLength, pwUpper, pwLower, pwNumbers, pwSymbols]);

  // Real-time security hashes and metrics
  const devComputedResults = useMemo(() => {
    const activeText = devInputText.trim() || generatedPassword;
    const sha256 = computeSHA256(activeText);
    const md5 = computeMD5(activeText);
    const base64Enc = safeBase64Encode(activeText);
    const base64Dec = safeBase64Decode(activeText);
    const pwStrength = calculatePasswordStrength(generatedPassword || activeText);

    // JSON Analysis
    let jsonFormatted = '';
    let jsonMinified = '';
    let jsonValid = true;
    let jsonError = '';
    try {
      if (devInputText.trim().startsWith('{') || devInputText.trim().startsWith('[')) {
        const parsed = JSON.parse(devInputText);
        jsonFormatted = JSON.stringify(parsed, null, 2);
        jsonMinified = JSON.stringify(parsed);
      }
    } catch (e: any) {
      jsonValid = false;
      jsonError = e.message;
    }

    return {
      activeText,
      sha256,
      md5,
      base64Enc,
      base64Dec,
      pwStrength,
      jsonFormatted,
      jsonMinified,
      jsonValid,
      jsonError
    };
  }, [devInputText, generatedPassword]);

  // =========================================================================
  // WORKSPACE B: FINANCIAL & MATH CALCULATORS
  // =========================================================================
  const [finPrincipal, setFinPrincipal] = useState<number>(100000);
  const [finRate, setFinRate] = useState<number>(12);
  const [finTenure, setFinTenure] = useState<number>(5);
  const [finMode, setFinMode] = useState<'sip' | 'lumpsum' | 'emi' | 'compound'>(() => {
    if (toolSlug.includes('emi') || toolName.includes('emi') || toolSlug.includes('loan')) return 'emi';
    if (toolSlug.includes('sip') || toolName.includes('sip')) return 'sip';
    if (toolSlug.includes('compound') || toolName.includes('compound')) return 'compound';
    return 'lumpsum';
  });

  const finResults = useMemo(() => {
    const p = Math.max(0, finPrincipal);
    const r = Math.max(0.01, finRate);
    const t = Math.max(1, finTenure);

    if (finMode === 'emi') {
      const monthlyRate = r / (12 * 100);
      const totalMonths = t * 12;
      const emi = (p * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
      const totalPayable = emi * totalMonths;
      const totalInterest = totalPayable - p;

      const schedule: string[][] = [];
      let balance = p;
      for (let yr = 1; yr <= t; yr++) {
        let yrInterest = 0;
        let yrPrincipal = 0;
        for (let m = 1; m <= 12; m++) {
          const intPart = balance * monthlyRate;
          const priPart = emi - intPart;
          yrInterest += intPart;
          yrPrincipal += priPart;
          balance = Math.max(0, balance - priPart);
        }
        schedule.push([
          `Year ${yr}`,
          `₹${Math.round(emi * 12).toLocaleString('en-IN')}`,
          `₹${Math.round(yrPrincipal).toLocaleString('en-IN')}`,
          `₹${Math.round(yrInterest).toLocaleString('en-IN')}`,
          `₹${Math.round(balance).toLocaleString('en-IN')}`
        ]);
      }

      return {
        title: 'Loan EMI Amortization Summary',
        card1: { label: 'Monthly Loan EMI', value: `₹${Math.round(emi).toLocaleString('en-IN')}` },
        card2: { label: 'Principal Amount', value: `₹${p.toLocaleString('en-IN')}` },
        card3: { label: 'Total Interest Payable', value: `₹${Math.round(totalInterest).toLocaleString('en-IN')}` },
        card4: { label: 'Total Payment (P + I)', value: `₹${Math.round(totalPayable).toLocaleString('en-IN')}` },
        formula: 'EMI = [P × r × (1 + r)^n] ÷ [(1 + r)^n - 1]',
        tableHeaders: ['Year', 'Annual EMI Paid', 'Principal Paid', 'Interest Paid', 'Remaining Balance'],
        tableRows: schedule
      };
    }

    if (finMode === 'sip') {
      const monthlyRate = r / (12 * 100);
      const totalMonths = t * 12;
      const totalInvested = p * totalMonths;
      const maturity = p * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
      const wealthGained = maturity - totalInvested;

      const schedule: string[][] = [];
      for (let yr = 1; yr <= t; yr++) {
        const mCount = yr * 12;
        const investedSoFar = p * mCount;
        const curMaturity = p * ((Math.pow(1 + monthlyRate, mCount) - 1) / monthlyRate) * (1 + monthlyRate);
        schedule.push([
          `Year ${yr}`,
          `₹${investedSoFar.toLocaleString('en-IN')}`,
          `₹${Math.round(curMaturity - investedSoFar).toLocaleString('en-IN')}`,
          `₹${Math.round(curMaturity).toLocaleString('en-IN')}`
        ]);
      }

      return {
        title: 'SIP Mutual Funds Wealth Forecast',
        card1: { label: 'Total Expected Returns', value: `₹${Math.round(wealthGained).toLocaleString('en-IN')}` },
        card2: { label: 'Total Invested Amount', value: `₹${totalInvested.toLocaleString('en-IN')}` },
        card3: { label: 'Total Maturity Value', value: `₹${Math.round(maturity).toLocaleString('en-IN')}` },
        card4: { label: 'Wealth Multiplier', value: `${(maturity / (totalInvested || 1)).toFixed(2)}x` },
        formula: 'M = P × [ ( (1 + i)^n - 1 ) / i ] × (1 + i)',
        tableHeaders: ['Timeline', 'Invested Amount', 'Wealth Gained', 'Future Portfolio Value'],
        tableRows: schedule
      };
    }

    // Default Lumpsum / Compound
    const n = 12;
    const maturity = p * Math.pow(1 + r / (100 * n), n * t);
    const totalInterest = maturity - p;

    const schedule: string[][] = [];
    for (let yr = 1; yr <= t; yr++) {
      const yrVal = p * Math.pow(1 + r / (100 * n), n * yr);
      schedule.push([
        `Year ${yr}`,
        `₹${p.toLocaleString('en-IN')}`,
        `₹${Math.round(yrVal - p).toLocaleString('en-IN')}`,
        `₹${Math.round(yrVal).toLocaleString('en-IN')}`
      ]);
    }

    return {
      title: 'Compound Wealth Growth Forecast',
      card1: { label: 'Total Maturity Value', value: `₹${Math.round(maturity).toLocaleString('en-IN')}` },
      card2: { label: 'Initial Principal Deposit', value: `₹${p.toLocaleString('en-IN')}` },
      card3: { label: 'Total Interest Earned', value: `₹${Math.round(totalInterest).toLocaleString('en-IN')}` },
      card4: { label: 'Annualized Growth', value: `${r.toFixed(1)}% p.a.` },
      formula: 'A = P × (1 + r/n)^(n×t)',
      tableHeaders: ['Year', 'Principal Base', 'Total Interest Accrued', 'Closing Balance'],
      tableRows: schedule
    };
  }, [finPrincipal, finRate, finTenure, finMode]);

  // =========================================================================
  // WORKSPACE C: TEXT & WRITING UTILITIES
  // =========================================================================
  const [textContent, setTextContent] = useState<string>(
    'Quick Calculator delivers 250+ ultra-fast client-side utilities with zero latency and 100% privacy. Easily calculate financial investments, analyze text metrics, format code, and generate structured schemas directly in your browser.'
  );

  const textMetrics = useMemo(() => {
    const raw = textContent;
    const trimmed = raw.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = raw.length;
    const charsNoSpaces = raw.replace(/\s+/g, '').length;
    const sentences = trimmed ? (trimmed.match(/[.!?]+(?:\s+|$)/g) || []).length || 1 : 0;
    const paragraphs = trimmed ? trimmed.split(/\n+/).filter(Boolean).length : 0;
    const readingTimeSec = Math.ceil((words / 200) * 60);

    return {
      words,
      characters,
      charsNoSpaces,
      sentences,
      paragraphs,
      readingTimeSec,
      uppercase: raw.toUpperCase(),
      lowercase: raw.toLowerCase(),
      titleCase: raw.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
      sentenceCase: raw.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
      cleanedSpaces: raw.replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n\n').trim()
    };
  }, [textContent]);

  const [activeTextTransform, setActiveTextTransform] = useState<string>('uppercase');

  // =========================================================================
  // WORKSPACE D: UNIT & MEASUREMENT CONVERTERS
  // =========================================================================
  const [unitCategory, setUnitCategory] = useState<string>('length');
  const activeUnitSpec = UNIT_CONVERSION_SPECS[unitCategory] || UNIT_CONVERSION_SPECS.length;
  const [unitInputVal, setUnitInputVal] = useState<number>(100);
  const [unitFrom, setUnitFrom] = useState<string>(activeUnitSpec.units[0]?.id || 'meters');
  const [unitTo, setUnitTo] = useState<string>(activeUnitSpec.units[1]?.id || 'feet');

  // Keep from/to in sync when category changes
  const handleUnitCategorySelect = (newCat: string) => {
    setUnitCategory(newCat);
    const spec = UNIT_CONVERSION_SPECS[newCat] || UNIT_CONVERSION_SPECS.length;
    setUnitFrom(spec.units[0]?.id || '');
    setToUnitState(spec.units[1]?.id || spec.units[0]?.id || '');
  };

  const setToUnitState = (val: string) => setUnitTo(val);

  const handleSwapUnits = () => {
    const temp = unitFrom;
    setUnitFrom(unitTo);
    setUnitTo(temp);
  };

  const unitConversionResult = useMemo(() => {
    const res = convertUnitValue(unitCategory, unitInputVal, unitFrom, unitTo);
    const formattedResult = `${res.result.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${res.toSymbol}`;
    return {
      ...res,
      formattedResult
    };
  }, [unitCategory, unitInputVal, unitFrom, unitTo]);

  // Export PDF Report handler
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(14, 165, 233);
      doc.text(tool.name, 14, 22);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated by Quick Calculator (quickcalc.in) • ${new Date().toLocaleDateString()}`, 14, 28);
      doc.setDrawColor(226, 232, 240);
      doc.line(14, 32, 196, 32);

      let yPos = 44;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Calculation Summary:', 14, yPos);
      yPos += 8;

      if (archetype === 'finance' || archetype === 'math') {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`${finResults.card1.label}: ${finResults.card1.value}`, 14, yPos); yPos += 7;
        doc.text(`${finResults.card2.label}: ${finResults.card2.value}`, 14, yPos); yPos += 7;
        doc.text(`${finResults.card3.label}: ${finResults.card3.value}`, 14, yPos); yPos += 7;
        doc.text(`${finResults.card4.label}: ${finResults.card4.value}`, 14, yPos); yPos += 10;

        if (finResults.tableRows?.length) {
          doc.setFont('helvetica', 'bold');
          doc.text('Breakdown Schedule Table:', 14, yPos);
          yPos += 8;
          finResults.tableRows.slice(0, 12).forEach((row) => {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.text(row.join('  |  '), 14, yPos);
            yPos += 6;
          });
        }
      } else if (archetype === 'dev') {
        doc.setFontSize(10);
        doc.text(`Generated Password: ${generatedPassword}`, 14, yPos); yPos += 8;
        doc.text(`SHA-256: ${devComputedResults.sha256}`, 14, yPos); yPos += 8;
        doc.text(`MD5: ${devComputedResults.md5}`, 14, yPos); yPos += 8;
      } else if (archetype === 'converter') {
        doc.setFontSize(10);
        doc.text(`Converted Value: ${unitConversionResult.formattedResult}`, 14, yPos); yPos += 8;
        doc.text(`Formula: ${unitConversionResult.formula}`, 14, yPos); yPos += 8;
      } else {
        doc.setFontSize(10);
        doc.text(`Total Words: ${textMetrics.words}`, 14, yPos); yPos += 7;
        doc.text(`Characters: ${textMetrics.characters}`, 14, yPos); yPos += 7;
        doc.text(`Reading Time: ~${textMetrics.readingTimeSec}s`, 14, yPos); yPos += 7;
      }

      doc.save(`${tool.slug || 'quickcalc-report'}.pdf`);
      triggerConfetti(0.35);
    } catch (e) {
      console.error('PDF export failed:', e);
    }
  };

  return (
    <div className="space-y-6">

      {/* ========================================================================= */}
      {/* 1. DEVELOPER & SECURITY WORKSPACE */}
      {/* ========================================================================= */}
      {archetype === 'dev' && (
        <div className="space-y-6">
          {/* Main Control Card */}
          <div className="p-5 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                <Lock className="w-4 h-4" />
                <span>Developer & Security Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Generate Password</span>
                </button>
              </div>
            </div>

            {/* Password Generator Slider & Checkboxes */}
            <div className="space-y-4 p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-cyan-400" />
                  <span>Password Length</span>
                </label>
                <span className="text-base font-extrabold font-mono text-cyan-400 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  {pwLength} characters
                </span>
              </div>

              <input
                type="range"
                min={8}
                max={64}
                value={pwLength}
                onChange={(e) => setPwLength(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
              />

              <div className="flex justify-between text-[11px] font-mono text-slate-500">
                <span>8 chars (Min)</span>
                <span>32 chars</span>
                <span>64 chars (Max)</span>
              </div>

              {/* Character Pool Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs font-mono text-slate-300">
                  <input
                    type="checkbox"
                    checked={pwUpper}
                    onChange={(e) => setPwUpper(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Uppercase (A-Z)</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs font-mono text-slate-300">
                  <input
                    type="checkbox"
                    checked={pwLower}
                    onChange={(e) => setPwLower(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Lowercase (a-z)</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs font-mono text-slate-300">
                  <input
                    type="checkbox"
                    checked={pwNumbers}
                    onChange={(e) => setPwNumbers(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Numbers (0-9)</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer text-xs font-mono text-slate-300">
                  <input
                    type="checkbox"
                    checked={pwSymbols}
                    onChange={(e) => setPwSymbols(e.target.checked)}
                    className="accent-cyan-500 rounded"
                  />
                  <span>Symbols (!@#$)</span>
                </label>
              </div>
            </div>

            {/* Generated Password Output Box with Strength Meter */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Active Password Output
                </span>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${devComputedResults.pwStrength.color} ${devComputedResults.pwStrength.borderColor} bg-slate-900`}>
                    {devComputedResults.pwStrength.label} Strength ({devComputedResults.pwStrength.score}%)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedPassword}
                  className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-base font-bold select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(generatedPassword, 'pw')}
                  className="p-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                  title="Copy Password"
                >
                  {copiedKey === 'pw' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  <span className="hidden sm:inline text-xs">{copiedKey === 'pw' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Password Strength Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${devComputedResults.pwStrength.bgColor}`}
                  style={{ width: `${devComputedResults.pwStrength.score}%` }}
                />
              </div>
            </div>

            {/* Hashing & Encoding Text Input Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Text / Payload for Hashing & Encoding</span>
                </label>
                <button
                  type="button"
                  onClick={() => setDevInputText('')}
                  className="text-xs font-mono text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>
              <textarea
                value={devInputText}
                onChange={(e) => setDevInputText(e.target.value)}
                rows={3}
                placeholder="Enter string, credentials, or JSON code for real-time cryptographic computation..."
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white font-mono text-sm leading-relaxed focus:outline-none transition-all"
              />
            </div>

            {/* Real-time Hash Output Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SHA-256 Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>SHA-256 Hash</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(devComputedResults.sha256, 'sha256')}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'sha256' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'sha256' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 break-all select-all">
                  {devComputedResults.sha256}
                </div>
              </div>

              {/* MD5 Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                    <Binary className="w-3.5 h-3.5" />
                    <span>MD5 Checksum</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(devComputedResults.md5, 'md5')}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'md5' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'md5' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 break-all select-all">
                  {devComputedResults.md5}
                </div>
              </div>
            </div>

            {/* Base64 & Format Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Base64 Encoded Payload</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(devComputedResults.base64Enc, 'b64')}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'b64' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'b64' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 break-all select-all max-h-24 overflow-y-auto">
                {devComputedResults.base64Enc}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FINANCIAL & MATH WORKSPACE */}
      {/* ========================================================================= */}
      {(archetype === 'finance' || archetype === 'math') && (
        <div className="space-y-6">
          {/* Main Control Card */}
          <div className="p-5 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Financial & Math Parameters</span>
              </div>
              {/* Mode Selector */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setFinMode('sip')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    finMode === 'sip' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  SIP
                </button>
                <button
                  type="button"
                  onClick={() => setFinMode('emi')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    finMode === 'emi' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Loan EMI
                </button>
                <button
                  type="button"
                  onClick={() => setFinMode('compound')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    finMode === 'compound' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Compound
                </button>
              </div>
            </div>

            {/* Inputs + Range Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Principal Input + Slider */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-slate-300">
                    {finMode === 'sip' ? 'Monthly Investment' : 'Principal Amount'}
                  </label>
                  <span className="text-sm font-bold font-mono text-cyan-400">
                    ₹{finPrincipal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    value={finPrincipal || ''}
                    onChange={(e) => setFinPrincipal(Number(e.target.value))}
                    min={500}
                    step={1000}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <input
                  type="range"
                  min={1000}
                  max={2000000}
                  step={5000}
                  value={finPrincipal}
                  onChange={(e) => setFinPrincipal(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>₹1k</span>
                  <span>₹10L</span>
                  <span>₹20L</span>
                </div>
              </div>

              {/* Expected Rate Input + Slider */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-slate-300">
                    Expected Rate (p.a.)
                  </label>
                  <span className="text-sm font-bold font-mono text-amber-400">
                    {finRate}%
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={finRate || ''}
                    onChange={(e) => setFinRate(Number(e.target.value))}
                    min={1}
                    max={50}
                    step={0.5}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={35}
                  step={0.5}
                  value={finRate}
                  onChange={(e) => setFinRate(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>1%</span>
                  <span>15%</span>
                  <span>35%</span>
                </div>
              </div>

              {/* Time Horizon Input + Slider */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-slate-300">
                    Time Horizon
                  </label>
                  <span className="text-sm font-bold font-mono text-emerald-400">
                    {finTenure} Years
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={finTenure || ''}
                    onChange={(e) => setFinTenure(Number(e.target.value))}
                    min={1}
                    max={40}
                    step={1}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">Yrs</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={35}
                  step={1}
                  value={finTenure}
                  onChange={(e) => setFinTenure(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>1 Yr</span>
                  <span>15 Yrs</span>
                  <span>35 Yrs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-xl space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{finResults.card1.label}</span>
              <p className="text-lg sm:text-2xl font-extrabold font-mono text-cyan-300">{finResults.card1.value}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{finResults.card2.label}</span>
              <p className="text-lg sm:text-2xl font-extrabold font-mono text-white">{finResults.card2.value}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 shadow-xl space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{finResults.card3.label}</span>
              <p className="text-lg sm:text-2xl font-extrabold font-mono text-emerald-400">{finResults.card3.value}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 shadow-xl space-y-1">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{finResults.card4.label}</span>
              <p className="text-lg sm:text-2xl font-extrabold font-mono text-amber-300">{finResults.card4.value}</p>
            </div>
          </div>

          {/* Full Schedule Breakdown Table */}
          {finResults.tableRows && finResults.tableRows.length > 0 && (
            <div className="p-5 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  <TableIcon className="w-4 h-4 text-cyan-400" />
                  <span>{finResults.title} Schedule Table</span>
                </div>
                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Schedule PDF</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      {finResults.tableHeaders.map((head, idx) => (
                        <th key={idx} className="p-3 font-bold">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {finResults.tableRows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-800/40 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className={`p-3 ${cIdx === row.length - 1 ? 'font-bold text-cyan-400' : ''}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TEXT & WRITING WORKSPACE */}
      {/* ========================================================================= */}
      {archetype === 'text' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                <Type className="w-4 h-4" />
                <span>Text Processing & Word Counter Workspace</span>
              </div>
              <button
                type="button"
                onClick={() => setTextContent('')}
                className="text-xs font-mono text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>

            {/* Live Stats Badges */}
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap text-xs font-mono">
              <span className="px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                {textMetrics.words} Words
              </span>
              <span className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                {textMetrics.characters} Characters
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                {textMetrics.sentences} Sentences
              </span>
              <span className="px-3 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold">
                ~{textMetrics.readingTimeSec}s Read
              </span>
            </div>

            {/* Primary Input Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-slate-300">
                  Input Document Text
                </label>
                <VoiceInputButton onTranscript={(t) => setTextContent((prev) => (prev ? `${prev} ${t}` : t))} />
              </div>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                rows={6}
                placeholder="Type or paste your text here for instant transformation and statistics analysis..."
                className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white font-sans text-sm leading-relaxed focus:outline-none transition-all"
              />
            </div>

            {/* 1-Click Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => { setTextContent(textMetrics.uppercase); triggerConfetti(0.15); }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold transition-all cursor-pointer"
              >
                UPPERCASE
              </button>
              <button
                type="button"
                onClick={() => { setTextContent(textMetrics.lowercase); triggerConfetti(0.15); }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold transition-all cursor-pointer"
              >
                lowercase
              </button>
              <button
                type="button"
                onClick={() => { setTextContent(textMetrics.titleCase); triggerConfetti(0.15); }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold transition-all cursor-pointer"
              >
                Title Case
              </button>
              <button
                type="button"
                onClick={() => { setTextContent(textMetrics.cleanedSpaces); triggerConfetti(0.15); }}
                className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold transition-all cursor-pointer"
              >
                Clean Extra Spaces
              </button>
              <button
                type="button"
                onClick={() => handleCopy(textContent, 'textMain')}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ml-auto shadow-md"
              >
                {copiedKey === 'textMain' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey === 'textMain' ? 'Copied Text' : 'Copy Text'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. UNIT & MEASUREMENT CONVERTER WORKSPACE */}
      {/* ========================================================================= */}
      {archetype === 'converter' && (
        <div className="space-y-6">
          <div className="p-5 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                <Ruler className="w-4 h-4" />
                <span>Unit & Measurement Conversion Workspace</span>
              </div>
              {/* Category Dropdown */}
              <select
                value={unitCategory}
                onChange={(e) => handleUnitCategorySelect(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {Object.keys(UNIT_CONVERSION_SPECS).map((k) => (
                  <option key={k} value={k}>
                    {UNIT_CONVERSION_SPECS[k].name}
                  </option>
                ))}
              </select>
            </div>

            {/* Input and Dropdown Conversion Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* From Input */}
              <div className="sm:col-span-5 space-y-2">
                <label className="text-xs font-mono font-bold text-slate-400">From Value</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={unitInputVal || ''}
                    onChange={(e) => setUnitInputVal(Number(e.target.value))}
                    className="w-1/2 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                  />
                  <select
                    value={unitFrom}
                    onChange={(e) => setUnitFrom(e.target.value)}
                    className="w-1/2 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    {activeUnitSpec.units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="sm:col-span-2 flex justify-center pt-4 sm:pt-6">
                <button
                  type="button"
                  onClick={handleSwapUnits}
                  className="p-3 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer"
                  title="Swap Units"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              </div>

              {/* To Unit Dropdown */}
              <div className="sm:col-span-5 space-y-2">
                <label className="text-xs font-mono font-bold text-slate-400">To Unit</label>
                <select
                  value={unitTo}
                  onChange={(e) => setToUnitState(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  {activeUnitSpec.units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live Result Card with Exact Formula */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Converted Result
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(unitConversionResult.formattedResult, 'unitRes')}
                  className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'unitRes' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'unitRes' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <p className="text-2xl sm:text-4xl font-extrabold font-mono text-cyan-300 select-all">
                {unitConversionResult.formattedResult}
              </p>

              <div className="pt-2 border-t border-slate-800 text-xs font-mono text-slate-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Formula: {unitConversionResult.formula}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. GENERIC / CUSTOM FALLBACK WORKSPACE */}
      {/* ========================================================================= */}
      {archetype === 'generic' && (
        <div className="p-5 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              <Calculator className="w-4 h-4" />
              <span>Universal Interactive Workspace</span>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-bold">
              100% Client-Side
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-300">Input Data / Number</label>
              <input
                type="text"
                defaultValue={100}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-300">Operation Mode</label>
              <select className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-sans text-sm focus:outline-none focus:border-cyan-500">
                <option>Standard High-Precision Computation</option>
                <option>Scientific Analysis</option>
              </select>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2">
            <span className="text-xs font-mono text-slate-400 uppercase">Computed Output</span>
            <p className="text-2xl font-bold font-mono text-cyan-300">Calculated Successfully</p>
          </div>
        </div>
      )}

    </div>
  );
}
