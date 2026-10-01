import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calculator,
  Type,
  ArrowLeftRight,
  Copy,
  Check,
  Download,
  RefreshCw,
  Sliders,
  Sparkles,
  TrendingUp,
  Table as TableIcon,
  PieChart as PieIcon,
  MoveHorizontal,
  SlidersHorizontal,
  ClipboardPaste,
  Trash2,
  Zap,
  Info,
  Layers,
  Scale,
  DollarSign,
  IndianRupee,
  Euro,
  PoundSterling,
  Clock,
  BookOpen,
  FileSpreadsheet
} from 'lucide-react';
import jsPDF from 'jspdf';
import { ToolItem } from '../data/categoriesAndTools';
import { triggerConfetti } from '../utils/confetti';
import { recordToolUsage } from '../utils/usageTracker';
import { analyzeTextMetrics } from '../utils/outputFormatters';
import { UNIT_CONVERSION_SPECS, convertUnitValue } from '../data/unitConverters';
import VoiceInputButton from './VoiceInputButton';

export type ToolCategoryType = 'text' | 'math' | 'converter';

interface InteractiveToolEngineProps {
  tool: ToolItem;
  onCopyMarkdown?: () => void;
  onDownloadPdf?: () => void;
}

// ---------------------------------------------------------------------------
// UNIFIED OUTPUT DATA MODEL
// ---------------------------------------------------------------------------
export interface ToolOutputMetric {
  id: string;
  label: string;
  value: string;
  subtext?: string;
  accentColor?: 'emerald' | 'cyan' | 'indigo' | 'amber' | 'rose' | 'purple';
}

export interface ToolRatioBreakdown {
  labelA: string;
  valA: number;
  labelB: string;
  valB: number;
}

export interface ToolOutputData {
  category: ToolCategoryType;
  heroTitle: string;
  heroValue: string;
  heroSubtitle: string;
  metrics: ToolOutputMetric[];
  ratioBreakdown?: ToolRatioBreakdown | null;
  tableHeaders?: string[];
  tableRows?: string[][];
  previewText?: string;
  copyableSummary: string;
}

// ---------------------------------------------------------------------------
// CATEGORY RESOLUTION HELPER
// ---------------------------------------------------------------------------
export function resolveToolCategory(tool: ToolItem): ToolCategoryType {
  const cat = (tool.category || '').toLowerCase();
  const slug = (tool.slug || tool.id || '').toLowerCase();
  const name = (tool.name || '').toLowerCase();

  // 1. Converter Tools
  if (
    cat.includes('unit') ||
    cat.includes('converter') ||
    tool.interactiveType === 'unit-converter' ||
    slug.includes('unit-converter') ||
    (name.includes('converter') && !name.includes('case') && !name.includes('markdown'))
  ) {
    return 'converter';
  }

  // 2. Math & Financial Calculators
  if (
    cat.includes('finance') ||
    cat.includes('math') ||
    cat.includes('health') || // BMI, calorie, BMR calculators
    slug.includes('sip') ||
    slug.includes('emi') ||
    slug.includes('loan') ||
    slug.includes('tax') ||
    slug.includes('gst') ||
    slug.includes('interest') ||
    slug.includes('cagr') ||
    slug.includes('salary') ||
    slug.includes('percentage') ||
    slug.includes('discount') ||
    slug.includes('compound') ||
    slug.includes('retirement') ||
    slug.includes('networth') ||
    slug.includes('inflation') ||
    slug.includes('mortgage') ||
    slug.includes('calorie') ||
    slug.includes('bmi') ||
    name.includes('calculator') ||
    name.includes('sip') ||
    name.includes('emi') ||
    name.includes('interest')
  ) {
    return 'math';
  }

  // 3. Text & Writing Tools (Default)
  return 'text';
}

// ---------------------------------------------------------------------------
// COMMON STATE HOOK: useToolEngine
// Centralizes inputs, real-time reactive calculations, and actions
// ---------------------------------------------------------------------------
export function useToolEngine(tool: ToolItem) {
  const categoryType = useMemo(() => resolveToolCategory(tool), [tool]);
  const toolSlug = (tool.slug || tool.id || '').toLowerCase();
  const toolName = (tool.name || '').toLowerCase();

  // --- TEXT STATE ---
  const [textInput, setTextInput] = useState<string>(() => {
    if (toolSlug.includes('case') || toolName.includes('case')) {
      return 'Quick Calculator: enterprise-grade web tools, instant financial math, and real-time developer utilities built for modern workflows.';
    }
    if (toolSlug.includes('slug') || toolName.includes('slug')) {
      return '10 Best Online Financial Calculators & Developer Tools for 2026!';
    }
    if (toolSlug.includes('plagiarism') || toolName.includes('plagiarism')) {
      return 'Client-side web computation eliminates server latency by processing all calculations directly in the browser with 100% data security.';
    }
    return 'Transform your everyday productivity with fast, client-side calculations and real-time utilities designed for precision.';
  });
  const [textTransform, setTextTransform] = useState<string>('none');

  // --- MATH STATE ---
  const [mathCurrency, setMathCurrency] = useState<'₹' | '$' | '€' | '£'>('₹');
  const [amount, setAmount] = useState<number>(() => {
    if (toolSlug.includes('emi') || toolSlug.includes('loan')) return 1000000;
    if (toolSlug.includes('sip')) return 10000;
    if (toolSlug.includes('gst') || toolSlug.includes('tax')) return 50000;
    if (toolSlug.includes('salary')) return 1200000;
    if (toolSlug.includes('compound')) return 100000;
    if (toolSlug.includes('percentage') || toolSlug.includes('discount')) return 2500;
    return 25000;
  });
  const [rate, setRate] = useState<number>(() => {
    if (toolSlug.includes('sip')) return 12;
    if (toolSlug.includes('emi') || toolSlug.includes('loan')) return 8.5;
    if (toolSlug.includes('gst')) return 18;
    if (toolSlug.includes('inflation')) return 6;
    if (toolSlug.includes('percentage') || toolSlug.includes('discount')) return 20;
    return 10;
  });
  const [tenure, setTenure] = useState<number>(() => {
    if (toolSlug.includes('emi') || toolSlug.includes('loan')) return 15;
    if (toolSlug.includes('sip')) return 10;
    if (toolSlug.includes('compound')) return 5;
    if (toolSlug.includes('retirement')) return 20;
    return 5;
  });

  // --- CONVERTER STATE ---
  const converterCategoryKey = useMemo(() => {
    for (const key of Object.keys(UNIT_CONVERSION_SPECS)) {
      if (toolSlug.includes(key) || toolName.toLowerCase().includes(key)) {
        return key;
      }
    }
    return 'length';
  }, [toolSlug, toolName]);

  const [converterValue, setConverterValue] = useState<number>(100);
  const currentSpec = UNIT_CONVERSION_SPECS[converterCategoryKey] || UNIT_CONVERSION_SPECS.length;
  const [fromUnit, setFromUnit] = useState<string>(() => currentSpec.units[0]?.id || 'meter');
  const [toUnit, setToUnit] = useState<string>(() => currentSpec.units[1]?.id || currentSpec.units[0]?.id || 'kilometer');

  // Track tool usage once
  useEffect(() => {
    recordToolUsage(tool.id, tool.name);
  }, [tool.id, tool.name]);

  // Synchronize converter units when category key updates
  useEffect(() => {
    const spec = UNIT_CONVERSION_SPECS[converterCategoryKey] || UNIT_CONVERSION_SPECS.length;
    if (spec.units.length > 1) {
      setFromUnit(spec.units[0].id);
      setToUnit(spec.units[1].id);
    }
  }, [converterCategoryKey]);

  // Helpers
  const formatMoney = useCallback((val: number) => {
    if (isNaN(val)) return `${mathCurrency}0`;
    return `${mathCurrency}${Math.round(val).toLocaleString()}`;
  }, [mathCurrency]);

  // ---------------------------------------------------------------------------
  // REACTIVE OUTPUT CALCULATION
  // ---------------------------------------------------------------------------
  const output: ToolOutputData = useMemo(() => {
    // ---------------------------------------------------------
    // 1. CONVERTER CATEGORY CALCULATION
    // ---------------------------------------------------------
    if (categoryType === 'converter') {
      const conv = convertUnitValue(converterCategoryKey, converterValue, fromUnit, toUnit);
      const metrics: ToolOutputMetric[] = [
        {
          id: 'from-val',
          label: 'Input Value',
          value: `${converterValue} ${conv.fromSymbol}`,
          subtext: 'Base Source',
          accentColor: 'cyan'
        },
        {
          id: 'to-val',
          label: 'Calculated Result',
          value: `${conv.result.toLocaleString()} ${conv.toSymbol}`,
          subtext: 'Precision Result',
          accentColor: 'emerald'
        },
        {
          id: 'ratio',
          label: 'Conversion Formula',
          value: conv.formula,
          subtext: 'Unit Relationship',
          accentColor: 'indigo'
        },
        {
          id: 'units-count',
          label: 'Available Units in Category',
          value: `${currentSpec.units.length} Units`,
          subtext: currentSpec.name,
          accentColor: 'purple'
        }
      ];

      const tableHeaders = ['Target Unit', 'Unit Symbol', 'Equivalent Value', 'Ratio Formula'];
      const tableRows = currentSpec.units.map(u => {
        const rowRes = convertUnitValue(converterCategoryKey, converterValue, fromUnit, u.id);
        return [
          u.name,
          u.symbol,
          `${rowRes.result.toLocaleString()} ${u.symbol}`,
          rowRes.formula
        ];
      });

      const copyable = [
        `====================================`,
        `${tool.name.toUpperCase()} - CONVERSION RESULT`,
        `====================================`,
        `Input: ${converterValue} ${conv.fromSymbol}`,
        `Result: ${conv.result} ${conv.toSymbol}`,
        `Formula: ${conv.formula}`,
        `====================================`
      ].join('\n');

      return {
        category: 'converter',
        heroTitle: 'Instant Calculated Equivalent',
        heroValue: `${conv.result.toLocaleString()} ${conv.toSymbol}`,
        heroSubtitle: `Ratio Formula: ${conv.formula}`,
        metrics,
        ratioBreakdown: null,
        tableHeaders,
        tableRows,
        copyableSummary: copyable
      };
    }

    // ---------------------------------------------------------
    // 2. MATH & FINANCE CATEGORY CALCULATION
    // ---------------------------------------------------------
    if (categoryType === 'math') {
      const isSip = toolSlug.includes('sip') || toolName.includes('sip');
      const isEmi = toolSlug.includes('emi') || toolSlug.includes('loan') || toolName.includes('emi');
      const isCompound = toolSlug.includes('compound') || toolName.includes('compound');
      const isGst = toolSlug.includes('gst') || toolSlug.includes('tax') || toolName.includes('gst');
      const isDiscount = toolSlug.includes('discount') || toolSlug.includes('percentage');

      if (isSip) {
        const p = amount;
        const r = rate / 100 / 12;
        const n = tenure * 12;
        const totalInvested = p * n;
        const totalWealth = r > 0 ? p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : totalInvested;
        const totalReturns = totalWealth - totalInvested;
        const multiplier = totalInvested > 0 ? (totalWealth / totalInvested).toFixed(2) : '1.00';

        const tableHeaders = ['Timeline', 'Monthly Deposit', 'Total Invested', 'Wealth Gain', 'Corpus Value'];
        const tableRows: string[][] = [];
        for (let y = 1; y <= tenure; y++) {
          const mCount = y * 12;
          const invY = p * mCount;
          const valY = r > 0 ? p * ((Math.pow(1 + r, mCount) - 1) / r) * (1 + r) : invY;
          tableRows.push([
            `Year ${y}`,
            formatMoney(p),
            formatMoney(invY),
            formatMoney(valY - invY),
            formatMoney(valY)
          ]);
        }

        return {
          category: 'math',
          heroTitle: 'Total Maturity Corpus',
          heroValue: formatMoney(totalWealth),
          heroSubtitle: `Invested: ${formatMoney(totalInvested)} | Estimated Gain: ${formatMoney(totalReturns)}`,
          metrics: [
            { id: 'inv', label: 'Total Invested Capital', value: formatMoney(totalInvested), accentColor: 'cyan' },
            { id: 'gain', label: 'Estimated Wealth Gain', value: formatMoney(totalReturns), accentColor: 'emerald' },
            { id: 'corpus', label: 'Total Maturity Value', value: formatMoney(totalWealth), accentColor: 'indigo' },
            { id: 'mult', label: 'Wealth Multiplier', value: `${multiplier}x Growth`, accentColor: 'purple' }
          ],
          ratioBreakdown: {
            labelA: 'Invested Principal',
            valA: totalInvested,
            labelB: 'Wealth Returns',
            valB: totalReturns
          },
          tableHeaders,
          tableRows,
          copyableSummary: `SIP Calculation Result:\nInvested: ${formatMoney(totalInvested)}\nGain: ${formatMoney(totalReturns)}\nMaturity: ${formatMoney(totalWealth)}`
        };
      }

      if (isEmi) {
        const p = amount;
        const r = (rate / 12) / 100;
        const n = tenure * 12;
        const emi = r > 0 ? (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : p / n;
        const totalPayable = emi * n;
        const totalInterest = totalPayable - p;
        const ratioPct = totalPayable > 0 ? ((totalInterest / totalPayable) * 100).toFixed(1) : '0';

        const tableHeaders = ['Year', 'Beginning Balance', 'Annual Repaid', 'Principal Repaid', 'Interest Paid', 'Closing Balance'];
        const tableRows: string[][] = [];
        let bal = p;
        for (let y = 1; y <= tenure; y++) {
          const start = bal;
          let yInt = 0;
          let yPrinc = 0;
          for (let m = 1; m <= 12; m++) {
            const mInt = bal * r;
            const mPrinc = emi - mInt;
            yInt += mInt;
            yPrinc += mPrinc;
            bal = Math.max(0, bal - mPrinc);
          }
          tableRows.push([
            `Year ${y}`,
            formatMoney(start),
            formatMoney(emi * 12),
            formatMoney(yPrinc),
            formatMoney(yInt),
            formatMoney(bal)
          ]);
        }

        return {
          category: 'math',
          heroTitle: 'Monthly Loan EMI',
          heroValue: formatMoney(emi),
          heroSubtitle: `Total Interest: ${formatMoney(totalInterest)} | Total Repayment: ${formatMoney(totalPayable)}`,
          metrics: [
            { id: 'emi', label: 'Monthly Repayment EMI', value: formatMoney(emi), accentColor: 'emerald' },
            { id: 'interest', label: 'Total Interest Payable', value: formatMoney(totalInterest), accentColor: 'amber' },
            { id: 'total', label: 'Total Repayment Amount', value: formatMoney(totalPayable), accentColor: 'cyan' },
            { id: 'ratio', label: 'Interest Share of Loan', value: `${ratioPct}%`, accentColor: 'rose' }
          ],
          ratioBreakdown: {
            labelA: 'Principal Loan',
            valA: p,
            labelB: 'Total Interest',
            valB: totalInterest
          },
          tableHeaders,
          tableRows,
          copyableSummary: `Loan EMI Calculation:\nMonthly EMI: ${formatMoney(emi)}\nTotal Interest: ${formatMoney(totalInterest)}\nTotal Payable: ${formatMoney(totalPayable)}`
        };
      }

      if (isGst) {
        const base = amount;
        const tax = (base * rate) / 100;
        const gross = base + tax;

        return {
          category: 'math',
          heroTitle: 'Final Gross Amount',
          heroValue: formatMoney(gross),
          heroSubtitle: `Base: ${formatMoney(base)} + Tax (${rate}%): ${formatMoney(tax)}`,
          metrics: [
            { id: 'base', label: 'Net Base Amount', value: formatMoney(base), accentColor: 'cyan' },
            { id: 'tax', label: `Total Tax (${rate}%)`, value: formatMoney(tax), accentColor: 'amber' },
            { id: 'cgst', label: 'CGST Component (50%)', value: formatMoney(tax / 2), accentColor: 'indigo' },
            { id: 'gross', label: 'Final Total Amount', value: formatMoney(gross), accentColor: 'emerald' }
          ],
          ratioBreakdown: {
            labelA: 'Base Price',
            valA: base,
            labelB: 'Tax Levy',
            valB: tax
          },
          tableHeaders: ['Tax Slab', 'Base Price', 'CGST Component', 'SGST Component', 'Final Total Price'],
          tableRows: [5, 12, 18, 28].map(slab => {
            const sTax = (base * slab) / 100;
            return [
              `${slab}% Standard Slab`,
              formatMoney(base),
              formatMoney(sTax / 2),
              formatMoney(sTax / 2),
              formatMoney(base + sTax)
            ];
          }),
          copyableSummary: `Tax Calculation:\nBase: ${formatMoney(base)}\nTax: ${formatMoney(tax)}\nTotal: ${formatMoney(gross)}`
        };
      }

      // Default Math / Simple / Compound
      const p = amount;
      const r = rate / 100;
      const future = isCompound ? p * Math.pow(1 + r, tenure) : p + p * r * tenure;
      const interestEarned = future - p;

      return {
        category: 'math',
        heroTitle: 'Total Accumulated Value',
        heroValue: formatMoney(future),
        heroSubtitle: `Principal: ${formatMoney(p)} | Interest Accrued: ${formatMoney(interestEarned)}`,
        metrics: [
          { id: 'princ', label: 'Initial Principal', value: formatMoney(p), accentColor: 'cyan' },
          { id: 'accrued', label: 'Interest Accrued', value: formatMoney(interestEarned), accentColor: 'emerald' },
          { id: 'future', label: 'Maturity Balance', value: formatMoney(future), accentColor: 'indigo' },
          { id: 'mult', label: 'Effective Growth', value: `${(future / (p || 1)).toFixed(2)}x`, accentColor: 'purple' }
        ],
        ratioBreakdown: {
          labelA: 'Initial Principal',
          valA: p,
          labelB: 'Interest Growth',
          valB: interestEarned
        },
        tableHeaders: ['Year', 'Principal', 'Interest Earned', 'Closing Balance'],
        tableRows: Array.from({ length: tenure }, (_, i) => {
          const y = i + 1;
          const yVal = isCompound ? p * Math.pow(1 + r, y) : p + p * r * y;
          return [`Year ${y}`, formatMoney(p), formatMoney(yVal - p), formatMoney(yVal)];
        }),
        copyableSummary: `Math Calculation Result:\nPrincipal: ${formatMoney(p)}\nAccrued: ${formatMoney(interestEarned)}\nTotal: ${formatMoney(future)}`
      };
    }

    // ---------------------------------------------------------
    // 3. TEXT CATEGORY CALCULATION (DEFAULT)
    // ---------------------------------------------------------
    const metricsData = analyzeTextMetrics(textInput);
    let processedText = textInput;

    if (textTransform === 'uppercase') {
      processedText = textInput.toUpperCase();
    } else if (textTransform === 'lowercase') {
      processedText = textInput.toLowerCase();
    } else if (textTransform === 'titlecase') {
      processedText = textInput.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
    } else if (textTransform === 'slugify') {
      processedText = textInput.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    } else if (textTransform === 'clean-whitespace') {
      processedText = textInput.replace(/\s+/g, ' ').trim();
    }

    const copyable = [
      `====================================`,
      `${tool.name.toUpperCase()} - TEXT ANALYSIS`,
      `====================================`,
      `Word Count: ${metricsData.words}`,
      `Character Count: ${metricsData.chars}`,
      `Reading Time: ${metricsData.readingTimeFormatted}`,
      `Speaking Time: ${metricsData.speakingTimeFormatted}`,
      `Sentences: ${metricsData.sentences}`,
      `Paragraphs: ${metricsData.paragraphs}`,
      `Readability Score: ${metricsData.fleschReadingScore} (${metricsData.readabilityGrade})`,
      `====================================`,
      `Processed Content:\n${processedText}`
    ].join('\n');

    return {
      category: 'text',
      heroTitle: 'Live Content Analysis',
      heroValue: `${metricsData.words.toLocaleString()} Words`,
      heroSubtitle: `${metricsData.chars.toLocaleString()} Characters | ~${metricsData.readingTimeFormatted} read`,
      metrics: [
        { id: 'words', label: 'Word Count', value: metricsData.words.toLocaleString(), subtext: 'Exact count', accentColor: 'emerald' },
        { id: 'chars', label: 'Character Count', value: metricsData.chars.toLocaleString(), subtext: 'Total symbols', accentColor: 'cyan' },
        { id: 'read-time', label: 'Estimated Reading Time', value: metricsData.readingTimeFormatted, subtext: 'Avg. 225 WPM', accentColor: 'indigo' },
        { id: 'readability', label: 'Flesch Readability', value: `${metricsData.fleschReadingScore}/100`, subtext: metricsData.readabilityGrade, accentColor: 'purple' }
      ],
      ratioBreakdown: {
        labelA: 'Letters & Digits',
        valA: metricsData.charsNoSpaces,
        labelB: 'Spaces & Punctuation',
        valB: Math.max(0, metricsData.chars - metricsData.charsNoSpaces)
      },
      tableHeaders: ['Text Metric', 'Count / Value', 'Assessment & Standard'],
      tableRows: [
        ['Words', metricsData.words.toLocaleString(), 'Total tokens separated by whitespace'],
        ['Characters (All)', metricsData.chars.toLocaleString(), 'Including spaces and formatting'],
        ['Characters (No Spaces)', metricsData.charsNoSpaces.toLocaleString(), 'Pure text length'],
        ['Sentences', metricsData.sentences.toLocaleString(), 'Punctuation delimited sentences'],
        ['Paragraphs', metricsData.paragraphs.toLocaleString(), 'Newline blocks'],
        ['Reading Ease', `${metricsData.fleschReadingScore} / 100`, metricsData.readabilityGrade],
        ['Speaking Time', metricsData.speakingTimeFormatted, 'Based on normal conversational pace']
      ],
      previewText: textTransform !== 'none' ? processedText : undefined,
      copyableSummary: copyable
    };
  }, [
    categoryType,
    converterCategoryKey,
    converterValue,
    fromUnit,
    toUnit,
    currentSpec,
    tool.name,
    toolSlug,
    toolName,
    amount,
    rate,
    tenure,
    formatMoney,
    textInput,
    textTransform
  ]);

  // Actions
  const handleSwapUnits = useCallback(() => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  }, [fromUnit, toUnit]);

  const handleResetDefaults = useCallback(() => {
    setAmount(25000);
    setRate(10);
    setTenure(5);
    setConverterValue(100);
    setTextTransform('none');
    triggerConfetti(0.2);
  }, []);

  return {
    categoryType,
    // State
    textInput,
    setTextInput,
    textTransform,
    setTextTransform,
    mathCurrency,
    setMathCurrency,
    amount,
    setAmount,
    rate,
    setRate,
    tenure,
    setTenure,
    converterValue,
    setConverterValue,
    converterCategoryKey,
    currentSpec,
    fromUnit,
    setFromUnit,
    toUnit,
    setToUnit,
    // Unified Output
    output,
    // Actions
    handleSwapUnits,
    handleResetDefaults
  };
}

// ---------------------------------------------------------------------------
// INPUT SECTION 1: TEXT & CONTENT
// ---------------------------------------------------------------------------
interface TextInputSectionProps {
  tool: ToolItem;
  state: ReturnType<typeof useToolEngine>;
}

function TextInputSection({ tool, state }: TextInputSectionProps) {
  const { textInput, setTextInput, textTransform, setTextTransform } = state;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setTextInput(text);
    } catch {
      // ignore
    }
  };

  const handleClear = () => {
    setTextInput('');
  };

  const transforms = [
    { id: 'none', label: 'Original' },
    { id: 'uppercase', label: 'UPPERCASE' },
    { id: 'lowercase', label: 'lowercase' },
    { id: 'titlecase', label: 'Title Case' },
    { id: 'slugify', label: 'slug-case' },
    { id: 'clean-whitespace', label: 'Trim Spaces' }
  ];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 dark:bg-slate-900 border border-slate-700 space-y-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Text Input Canvas
          </span>
        </div>
        <div className="flex items-center gap-2">
          <VoiceInputButton
            onTranscript={(transcript) => {
              setTextInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
            }}
            size="sm"
          />
          <button
            type="button"
            onClick={handlePaste}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-mono font-semibold flex items-center gap-1 transition-all cursor-pointer"
            title="Paste from clipboard"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Paste</span>
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs transition-all cursor-pointer"
            title="Clear text"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">
          Source Text Content
        </label>
        <textarea
          rows={7}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Paste or type your content here to instantly calculate metrics..."
          className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-sans text-sm sm:text-base leading-relaxed resize-y transition-all shadow-inner"
          style={{ fontSize: '16px' }}
        />
      </div>

      {/* Text Transformation Quick Actions */}
      <div className="space-y-2 pt-1">
        <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
          Text Transforms:
        </label>
        <div className="flex items-center gap-1.5 flex-wrap">
          {transforms.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTextTransform(t.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all border cursor-pointer ${
                textTransform === t.id
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// INPUT SECTION 2: MATH & FINANCE
// ---------------------------------------------------------------------------
interface MathInputSectionProps {
  tool: ToolItem;
  state: ReturnType<typeof useToolEngine>;
}

function MathInputSection({ tool, state }: MathInputSectionProps) {
  const {
    amount,
    setAmount,
    rate,
    setRate,
    tenure,
    setTenure,
    mathCurrency,
    setMathCurrency
  } = state;

  const toolSlug = (tool.slug || tool.id || '').toLowerCase();
  const isSip = toolSlug.includes('sip');
  const isEmi = toolSlug.includes('emi') || toolSlug.includes('loan');

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 dark:bg-slate-900 border border-slate-700 space-y-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Mathematical Inputs
          </span>
        </div>
        {/* Currency Switcher */}
        <div className="flex items-center gap-1">
          {(['₹', '$', '€', '£'] as const).map((sym) => (
            <button
              key={sym}
              type="button"
              onClick={() => setMathCurrency(sym)}
              className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                mathCurrency === sym
                  ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
              }`}
            >
              {sym}
            </button>
          ))}
        </div>
      </div>

      {/* Input 1: Amount / Principal */}
      <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/70 border border-slate-700/80 shadow-inner">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-semibold text-slate-300">
            {isSip ? 'Monthly SIP Investment' : isEmi ? 'Loan Principal Amount' : 'Initial Principal / Base Amount'}
          </label>
          <span className="text-xs font-mono font-bold text-slate-400">
            {mathCurrency}{amount.toLocaleString()}
          </span>
        </div>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-slate-400 font-mono font-bold text-sm pointer-events-none">
            {mathCurrency}
          </span>
          <input
            type="number"
            value={amount === 0 ? '' : amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="w-full py-2.5 pl-8 pr-3 rounded-lg bg-slate-900 border border-slate-700 font-mono font-bold text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            style={{ fontSize: '16px' }}
          />
        </div>
        <input
          type="range"
          min={isSip ? 500 : 1000}
          max={isSip ? 200000 : 10000000}
          step={isSip ? 500 : 10000}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full h-2 rounded-lg bg-slate-800 cursor-pointer accent-emerald-500"
        />
      </div>

      {/* Input 2: Rate of Interest / Percentage */}
      <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/70 border border-slate-700/80 shadow-inner">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-semibold text-slate-300">
            {isSip ? 'Expected Annual Return (%)' : 'Interest / Tax Rate (%)'}
          </label>
          <span className="text-xs font-mono font-bold text-slate-400">
            {rate}%
          </span>
        </div>
        <div className="relative flex items-center">
          <input
            type="number"
            step="0.1"
            value={rate === 0 ? '' : rate}
            onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
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
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full h-2 rounded-lg bg-slate-800 cursor-pointer accent-emerald-500"
        />
      </div>

      {/* Input 3: Tenure (Years) */}
      <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/70 border border-slate-700/80 shadow-inner">
        <div className="flex items-center justify-between gap-2">
          <label className="text-xs font-semibold text-slate-300">
            Investment / Repayment Tenure
          </label>
          <span className="text-xs font-mono font-bold text-slate-400">
            {tenure} Years
          </span>
        </div>
        <div className="relative flex items-center">
          <input
            type="number"
            min="1"
            max="40"
            value={tenure === 0 ? '' : tenure}
            onChange={(e) => setTenure(parseInt(e.target.value, 10) || 1)}
            className="w-full py-2.5 pl-3 pr-14 rounded-lg bg-slate-900 border border-slate-700 font-mono font-bold text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            style={{ fontSize: '16px' }}
          />
          <span className="absolute right-3 text-slate-400 font-mono font-bold text-xs pointer-events-none">
            Years
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={35}
          step={1}
          value={tenure}
          onChange={(e) => setTenure(Number(e.target.value))}
          className="w-full h-2 rounded-lg bg-slate-800 cursor-pointer accent-emerald-500"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// INPUT SECTION 3: UNIT CONVERTERS
// ---------------------------------------------------------------------------
interface ConverterInputSectionProps {
  tool: ToolItem;
  state: ReturnType<typeof useToolEngine>;
}

function ConverterInputSection({ tool, state }: ConverterInputSectionProps) {
  const {
    converterValue,
    setConverterValue,
    currentSpec,
    fromUnit,
    setFromUnit,
    toUnit,
    setToUnit,
    handleSwapUnits
  } = state;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 dark:bg-slate-900 border border-slate-700 space-y-4 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-pink-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Converter Canvas
          </span>
        </div>
        <span className="text-[11px] font-mono text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/30">
          {currentSpec.name}
        </span>
      </div>

      {/* Input Numerical Value */}
      <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-700">
        <label className="text-xs font-semibold text-slate-300">
          Input Numerical Value
        </label>
        <input
          type="number"
          value={converterValue === 0 ? '' : converterValue}
          onChange={(e) => setConverterValue(parseFloat(e.target.value) || 0)}
          className="w-full h-11 px-3.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
          style={{ fontSize: '16px' }}
        />
      </div>

      {/* From Unit Selector */}
      <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-700">
        <label className="text-xs font-semibold text-slate-300">From Unit</label>
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
          className="w-full h-11 px-3 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:border-pink-500 outline-none cursor-pointer"
          style={{ fontSize: '16px' }}
        >
          {currentSpec.units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.symbol})
            </option>
          ))}
        </select>
      </div>

      {/* Directional Swap Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleSwapUnits}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-pink-500/20 border border-slate-700 text-pink-400 hover:border-pink-500 transition-all cursor-pointer flex items-center gap-2 text-xs font-mono font-bold"
          title="Swap source and target units"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Swap Direction</span>
        </button>
      </div>

      {/* To Unit Selector */}
      <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-700">
        <label className="text-xs font-semibold text-slate-300">To Target Unit</label>
        <select
          value={toUnit}
          onChange={(e) => setToUnit(e.target.value)}
          className="w-full h-11 px-3 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:border-pink-500 outline-none cursor-pointer"
          style={{ fontSize: '16px' }}
        >
          {currentSpec.units.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.symbol})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// UNIFIED OUTPUT DASHBOARD COMPONENT
// Reactive display powered by output data from common state hook
// ---------------------------------------------------------------------------
interface OutputDashboardProps {
  output: ToolOutputData;
  tool: ToolItem;
  onReset: () => void;
}

function OutputDashboard({ output, tool, onReset }: OutputDashboardProps) {
  const [copied, setCopied] = useState(false);
  const [showAllColumnsMobile, setShowAllColumnsMobile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll, output.tableRows]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output.copyableSummary);
      setCopied(true);
      triggerConfetti(0.3);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadPdf = () => {
    try {
      triggerConfetti(0.4);
      const doc = new jsPDF();

      // Top Banner
      doc.setFillColor(0, 164, 159);
      doc.rect(0, 0, 210, 24, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text('Quick Calculator - Official Report', 14, 15);

      // Title & Date
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(tool.name, 14, 36);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated on ${new Date().toLocaleDateString()} | 100% Client-Side Engine`, 14, 43);

      // Summary
      let startY = 54;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Calculation Summary:', 14, startY);
      startY += 8;

      output.metrics.forEach((m, idx) => {
        const xPos = 14 + (idx % 2) * 92;
        const yPos = startY + Math.floor(idx / 2) * 16;
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(xPos, yPos, 88, 13, 2, 2, 'F');

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(m.label, xPos + 4, yPos + 4.5);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 164, 159);
        doc.text(m.value, xPos + 4, yPos + 10);
      });

      startY += Math.ceil(output.metrics.length / 2) * 16 + 10;

      // Table (if present)
      if (output.tableHeaders && output.tableRows && output.tableRows.length > 0) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text('Detailed Breakdown & Schedule:', 14, startY);
        startY += 7;

        const colWidth = 182 / output.tableHeaders.length;
        doc.setFillColor(30, 41, 59);
        doc.rect(14, startY, 182, 8, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        output.tableHeaders.forEach((h, i) => {
          doc.text(h, 16 + i * colWidth, startY + 5.5);
        });
        startY += 8;

        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        output.tableRows.slice(0, 30).forEach((row, rIdx) => {
          if (startY > 275) {
            doc.addPage();
            startY = 20;
          }
          doc.setFillColor(rIdx % 2 === 0 ? 255 : 248, rIdx % 2 === 0 ? 255 : 250, rIdx % 2 === 0 ? 255 : 252);
          doc.rect(14, startY, 182, 6.5, 'F');
          doc.setTextColor(30, 41, 59);
          row.forEach((cell, cIdx) => {
            doc.text(String(cell), 16 + cIdx * colWidth, startY + 4.5);
          });
          startY += 6.5;
        });
      }

      const fileName = `${tool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-report.pdf`;
      doc.save(fileName);
    } catch {
      window.print();
    }
  };

  const accentBorderColor = {
    emerald: 'border-emerald-500/40 text-emerald-400',
    cyan: 'border-cyan-500/40 text-cyan-400',
    indigo: 'border-indigo-500/40 text-indigo-400',
    amber: 'border-amber-500/40 text-amber-400',
    rose: 'border-rose-500/40 text-rose-400',
    purple: 'border-purple-500/40 text-purple-400'
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-700 flex-wrap">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Output Dashboard</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">PDF</span>
          </button>
          <button
            type="button"
            onClick={onReset}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs transition-colors cursor-pointer"
            title="Reset to defaults"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hero Metric Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/30 border border-emerald-500/30 space-y-2 shadow-xl">
        <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>{output.heroTitle}</span>
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
          {output.heroValue}
        </div>
        <p className="text-xs text-slate-400 font-mono">
          {output.heroSubtitle}
        </p>
      </div>

      {/* Transformed Preview Panel (if available) */}
      {output.previewText && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Transformed Result Preview
            </span>
            <button
              type="button"
              onClick={() => {
                if (output.previewText) {
                  navigator.clipboard.writeText(output.previewText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }
              }}
              className="text-[11px] font-mono text-slate-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>Copy Preview</span>
            </button>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 max-h-36 overflow-y-auto whitespace-pre-wrap select-all">
            {output.previewText}
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {output.metrics.map((m) => {
          const accent = m.accentColor || 'emerald';
          return (
            <div
              key={m.id}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-1 shadow-sm"
            >
              <span className="text-[11px] font-mono text-slate-400 font-semibold block uppercase tracking-wider">
                {m.label}
              </span>
              <div className={`text-xl font-mono font-bold ${accentBorderColor[accent]}`}>
                {m.value}
              </div>
              {m.subtext && (
                <span className="text-[11px] font-mono text-slate-500 block">
                  {m.subtext}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Ratio Breakdown Bar (if present) */}
      {output.ratioBreakdown && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-300">
            <span>{output.ratioBreakdown.labelA}</span>
            <span>{output.ratioBreakdown.labelB}</span>
          </div>
          {(() => {
            const total = (output.ratioBreakdown.valA + output.ratioBreakdown.valB) || 1;
            const pctA = Math.round((output.ratioBreakdown.valA / total) * 100);
            const pctB = 100 - pctA;
            return (
              <div className="space-y-1.5">
                <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden flex">
                  <div style={{ width: `${pctA}%` }} className="bg-cyan-500 h-full transition-all" />
                  <div style={{ width: `${pctB}%` }} className="bg-emerald-500 h-full transition-all" />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-cyan-400 font-semibold">{pctA}%</span>
                  <span className="text-emerald-400 font-semibold">{pctB}%</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Breakdown / Schedule / Matrix Table (if present) */}
      {output.tableHeaders && output.tableRows && output.tableRows.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              {canScrollLeft || canScrollRight ? (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 font-semibold text-[10px] uppercase tracking-wider animate-pulse">
                  <MoveHorizontal className="w-3 h-3" />
                  <span>Scroll horizontally for all columns</span>
                </span>
              ) : (
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                  Detailed Itemized Matrix
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowAllColumnsMobile(!showAllColumnsMobile)}
              className="sm:hidden text-[11px] font-semibold text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>{showAllColumnsMobile ? 'Compact' : 'Show All'}</span>
            </button>
          </div>

          <div className="relative rounded-xl border border-slate-700/80 bg-slate-950 shadow-sm overflow-x-auto overflow-y-visible">
            {/* Scroll indicators */}
            <div
              className={`pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-slate-950 to-transparent z-20 transition-opacity ${
                canScrollLeft ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <div
              className={`pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-slate-950 to-transparent z-20 transition-opacity ${
                canScrollRight ? 'opacity-100' : 'opacity-0'
              }`}
            />

            <div
              ref={scrollRef}
              onScroll={checkScroll}
              className="max-h-72 overflow-y-auto overflow-x-auto touch-pan-x scrollbar-thin scrollbar-thumb-slate-700"
            >
              <table className="w-full text-left text-xs font-mono whitespace-nowrap">
                <thead className="bg-slate-900 text-slate-200 sticky top-0 z-10 border-b border-slate-800">
                  <tr>
                    {output.tableHeaders.map((h, i) => (
                      <th
                        key={i}
                        className={`p-3 font-bold tracking-tight ${
                          !showAllColumnsMobile && i > 1 && i < output.tableHeaders!.length - 1
                            ? 'hidden sm:table-cell'
                            : 'table-cell'
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {output.tableRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={`hover:bg-slate-900/60 transition-colors ${
                        rIdx % 2 === 0 ? 'bg-transparent' : 'bg-slate-900/30'
                      }`}
                    >
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={`p-3 ${
                            cIdx === 0
                              ? 'font-bold text-slate-100'
                              : cIdx === row.length - 1
                              ? 'font-semibold text-emerald-400'
                              : 'text-slate-300'
                          } ${
                            !showAllColumnsMobile && cIdx > 1 && cIdx < row.length - 1
                              ? 'hidden sm:table-cell'
                              : 'table-cell'
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN CENTRALIZED INTERACTIVE TOOL ENGINE
// Uses switch-case pattern to dynamically render Input Sections based on
// tool categories (Text vs. Math vs. Converter) and connects to a unified
// Output Dashboard via the common state hook (useToolEngine)
// ---------------------------------------------------------------------------
export default function InteractiveToolEngine({
  tool,
  onCopyMarkdown,
  onDownloadPdf
}: InteractiveToolEngineProps) {
  const engineState = useToolEngine(tool);
  const { categoryType, output, handleResetDefaults } = engineState;

  // Switch-case pattern dynamically renders Input Section based on tool category
  const renderInputSection = () => {
    switch (categoryType) {
      case 'text':
        return <TextInputSection tool={tool} state={engineState} />;
      case 'math':
        return <MathInputSection tool={tool} state={engineState} />;
      case 'converter':
        return <ConverterInputSection tool={tool} state={engineState} />;
      default:
        return <TextInputSection tool={tool} state={engineState} />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 2-Part Synchronized Workspace Layout: Input Section + Unified Output Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Top: Dynamically Switched Input Section */}
        <div className="lg:col-span-5">
          {renderInputSection()}
        </div>

        {/* Right / Bottom: Unified Reactive Output Dashboard */}
        <div className="lg:col-span-7">
          <OutputDashboard
            output={output}
            tool={tool}
            onReset={handleResetDefaults}
          />
        </div>
      </div>
    </div>
  );
}

export { InteractiveToolEngine };

