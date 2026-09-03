import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  Download,
  IndianRupee,
  DollarSign,
  Euro,
  PoundSterling,
  TrendingUp,
  PieChart as PieIcon,
  Table as TableIcon,
  CheckCircle2,
  Sparkles,
  Info,
  FileSpreadsheet,
  MoveHorizontal,
  SlidersHorizontal,
  Copy,
  Check,
  RefreshCw,
  Scale,
  ShieldCheck,
  Calculator,
  ArrowRightLeft
} from 'lucide-react';
import jsPDF from 'jspdf';
import { ToolItem } from '../data/categoriesAndTools';
import { triggerConfetti } from '../utils/confetti';
import { recordToolUsage } from '../utils/usageTracker';

interface FinanceToolEngineProps {
  tool: ToolItem;
}

// ----------------------------------------------------
// SYNCHRONIZED INPUT & SLIDER COMPONENT
// Strict compliance: 16px font to prevent mobile browser zoom,
// visible high-contrast border (1px solid #334155), instant real-time sync
// ----------------------------------------------------
interface SynchronizedInputSliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  quickPresets?: { label: string; value: number }[];
  accentColor?: 'emerald' | 'indigo' | 'cyan' | 'amber';
}

function SynchronizedInputSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix = '',
  suffix = '',
  quickPresets,
  accentColor = 'emerald'
}: SynchronizedInputSliderProps) {
  const accentClass = {
    emerald: 'accent-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    indigo: 'accent-indigo-500 focus:border-indigo-500 focus:ring-indigo-500/20 text-indigo-600 dark:text-indigo-400',
    cyan: 'accent-cyan-500 focus:border-cyan-500 focus:ring-cyan-500/20 text-cyan-600 dark:text-cyan-400',
    amber: 'accent-amber-500 focus:border-amber-500 focus:ring-amber-500/20 text-amber-600 dark:text-amber-400'
  }[accentColor];

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      onChange(0);
      return;
    }
    const num = parseFloat(raw);
    if (!isNaN(num)) {
      onChange(num);
    }
  };

  return (
    <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/60 dark:bg-slate-900/70 border border-slate-700/80 shadow-inner">
      {/* Label and formatted display */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-semibold text-slate-300 dark:text-slate-300 select-none">
          {label}
        </label>
        <span className="text-xs font-mono font-bold text-slate-400">
          Range: {prefix}{min.toLocaleString()}{suffix} – {prefix}{max.toLocaleString()}{suffix}
        </span>
      </div>

      {/* Synchronized Numeric Input Box */}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-slate-400 font-mono font-bold text-sm pointer-events-none select-none">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value === 0 ? '' : value}
          onChange={handleTextChange}
          min={min}
          max={max}
          step={step}
          className={`w-full py-2.5 rounded-lg bg-slate-950 dark:bg-slate-950 border border-slate-700 font-mono font-bold text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${
            prefix ? 'pl-8' : 'pl-3'
          } ${suffix ? 'pr-12' : 'pr-3'}`}
          style={{ fontSize: '16px' }} // Explicit 16px to prevent iOS/Android zoom
        />
        {suffix && (
          <span className="absolute right-3 text-slate-400 font-mono text-xs font-bold pointer-events-none select-none">
            {suffix}
          </span>
        )}
      </div>

      {/* Synchronized Range Slider */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-lg bg-slate-800 cursor-pointer ${accentClass}`}
      />

      {/* Quick Presets */}
      {quickPresets && quickPresets.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mr-1">
            Presets:
          </span>
          {quickPresets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(preset.value)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-all border cursor-pointer ${
                value === preset.value
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// RESPONSIVE BREAKDOWN TABLE WITH EDGE FADE & COLUMN PRIORITIZATION
// ----------------------------------------------------
interface ResponsiveBreakdownTableProps {
  headers: string[];
  rows: string[][];
  maxHeight?: string;
}

function ResponsiveBreakdownTable({ headers, rows, maxHeight = 'max-h-96' }: ResponsiveBreakdownTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showAllColumnsMobile, setShowAllColumnsMobile] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < maxScrollLeft - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkScroll, headers, rows]);

  const getColumnVisibilityClass = (header: string, index: number, totalCols: number) => {
    if (showAllColumnsMobile) return 'table-cell';

    const h = header.toLowerCase();

    // First column always visible
    if (index === 0) return 'table-cell font-bold text-slate-100';

    // Last column always visible & highlighted
    if (index === totalCols - 1) return 'table-cell font-bold text-emerald-400 text-right';

    // High Priority Key Metrics
    if (
      h.includes('interest') ||
      h.includes('repaid') ||
      h.includes('balance') ||
      h.includes('total') ||
      h.includes('growth') ||
      h.includes('tax')
    ) {
      return 'table-cell font-semibold text-slate-200';
    }

    // Intermediate columns hidden on smaller screens
    return 'hidden sm:table-cell text-slate-400';
  };

  return (
    <div className="space-y-2">
      {/* Scroll indicator & Mobile Toggle */}
      <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          {canScrollLeft || canScrollRight ? (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 font-semibold text-[10px] uppercase tracking-wider animate-pulse">
              <MoveHorizontal className="w-3 h-3" />
              <span>Scroll horizontally for all columns</span>
            </span>
          ) : (
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
              Schedule Active
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowAllColumnsMobile(!showAllColumnsMobile)}
          className="sm:hidden text-[11px] font-semibold text-cyan-400 hover:underline cursor-pointer flex items-center gap-1 shrink-0"
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span>{showAllColumnsMobile ? 'Compact View' : 'Show All Columns'}</span>
        </button>
      </div>

      {/* Table Container with Edge Fade */}
      <div className="relative rounded-xl border border-slate-700/80 bg-slate-950 shadow-sm overflow-hidden">
        {/* Left Fade */}
        <div
          className={`pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-slate-950 to-transparent z-20 transition-opacity duration-300 ${
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Right Fade */}
        <div
          className={`pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-slate-950 to-transparent z-20 transition-opacity duration-300 ${
            canScrollRight ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Scrollable Viewport */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className={`${maxHeight} overflow-y-auto overflow-x-auto touch-pan-x scrollbar-thin scrollbar-thumb-slate-700`}
        >
          <table className="w-full text-left text-xs font-mono whitespace-nowrap">
            <thead className="bg-slate-900 text-slate-200 sticky top-0 z-10 border-b border-slate-800">
              <tr>
                {headers.map((h, i) => {
                  const visClass = getColumnVisibilityClass(h, i, headers.length);
                  return (
                    <th key={i} className={`p-3 font-bold tracking-tight ${visClass}`}>
                      {h}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {rows.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className={`hover:bg-slate-900/60 transition-colors ${
                    rIdx % 2 === 0 ? 'bg-transparent' : 'bg-slate-900/30'
                  }`}
                >
                  {row.map((cell, cIdx) => {
                    const headerName = headers[cIdx] || '';
                    const visClass = getColumnVisibilityClass(headerName, cIdx, headers.length);
                    return (
                      <td key={cIdx} className={`p-3 ${visClass}`}>
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// MAIN FINANCE TOOL ENGINE
// ----------------------------------------------------
export default function FinanceToolEngine({ tool }: FinanceToolEngineProps) {
  const toolSlug = (tool.slug || tool.id || '').toLowerCase();
  const toolName = (tool.name || '').toLowerCase();

  // Currency selector state
  const [currencySymbol, setCurrencySymbol] = useState<'₹' | '$' | '€' | '£'>('₹');

  // Core Numerical Parameters
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

  const [years, setYears] = useState<number>(() => {
    if (toolSlug.includes('emi') || toolSlug.includes('loan')) return 15;
    if (toolSlug.includes('sip')) return 10;
    if (toolSlug.includes('compound')) return 5;
    if (toolSlug.includes('retirement')) return 20;
    return 5;
  });

  // Specialized state variables
  const [frequency, setFrequency] = useState<'12' | '4' | '1'>('12'); // Monthly, Quarterly, Annual
  const [depositType, setDepositType] = useState<'fd' | 'rd'>('fd');
  const [taxMode, setTaxMode] = useState<'add' | 'remove'>('add');
  const [gstRate, setGstRate] = useState<number>(18);
  const [percentageMode, setPercentageMode] = useState<'discount' | 'percent_of' | 'increase' | 'decrease'>('discount');

  // Salary specific
  const [pfRate, setPfRate] = useState<number>(12);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);

  // Net worth specific
  const [cashAsset, setCashAsset] = useState<number>(200000);
  const [stockAsset, setStockAsset] = useState<number>(800000);
  const [propertyAsset, setPropertyAsset] = useState<number>(3500000);
  const [homeLoanLiab, setHomeLoanLiab] = useState<number>(1500000);
  const [otherLiab, setOtherLiab] = useState<number>(100000);

  // DTI specific
  const [monthlyIncome, setMonthlyIncome] = useState<number>(80000);
  const [rentMortgage, setRentMortgage] = useState<number>(20000);
  const [carLoan, setCarLoan] = useState<number>(8000);
  const [creditCardMin, setCreditCardMin] = useState<number>(4000);

  // Emergency Fund
  const [essentialExpense, setEssentialExpense] = useState<number>(35000);
  const [targetMonths, setTargetMonths] = useState<number>(6);

  // Brokerage
  const [buyPrice, setBuyPrice] = useState<number>(500);
  const [sellPrice, setSellPrice] = useState<number>(580);
  const [quantity, setQuantity] = useState<number>(100);

  // View toggle & Copy state
  const [activeTab, setActiveTab] = useState<'summary' | 'breakdown'>('summary');
  const [copied, setCopied] = useState(false);

  // Track usage metric
  useEffect(() => {
    recordToolUsage(tool.id, tool.name);
  }, [tool.id, tool.name]);

  // Currency Formatter
  const formatCurrency = useCallback((val: number, symbol = currencySymbol) => {
    if (isNaN(val)) return `${symbol}0`;
    return `${symbol}${Math.round(val).toLocaleString()}`;
  }, [currencySymbol]);

  // ----------------------------------------------------
  // REAL-TIME CLIENT-SIDE COMPUTATIONS
  // ----------------------------------------------------
  const computation = useMemo(() => {
    const isSip = toolSlug.includes('sip') || toolName.includes('sip');
    const isEmi = toolSlug.includes('emi') || toolSlug.includes('loan') || toolName.includes('emi') || toolName.includes('loan');
    const isCompound = toolSlug.includes('compound') || toolName.includes('compound');
    const isRetirement = toolSlug.includes('retirement') || toolName.includes('retirement');
    const isGst = toolSlug.includes('gst') || toolSlug.includes('tax') || toolName.includes('gst') || toolName.includes('sales tax');
    const isInflation = toolSlug.includes('inflation') || toolName.includes('inflation');
    const isPpf = toolSlug.includes('ppf') || toolSlug.includes('epf') || toolName.includes('ppf') || toolName.includes('epf');
    const isSimpleInterest = toolSlug.includes('simple') || toolName.includes('simple interest');
    const isFdRd = toolSlug.includes('fd') || toolSlug.includes('rd') || toolName.includes('fixed deposit') || toolName.includes('recurring deposit');
    const isPercentage = toolSlug.includes('percentage') || toolName.includes('percentage');
    const isDiscount = toolSlug.includes('discount') || toolName.includes('discount');
    const isSalary = toolSlug.includes('salary') || toolSlug.includes('take-home') || toolName.includes('salary') || toolName.includes('in-hand');
    const isNetWorth = toolSlug.includes('net-worth') || toolSlug.includes('networth') || toolName.includes('net worth');
    const isDti = toolSlug.includes('dti') || toolName.includes('debt-to-income');
    const isEmergency = toolSlug.includes('emergency') || toolName.includes('emergency fund');
    const isBrokerage = toolSlug.includes('brokerage') || toolName.includes('brokerage') || toolName.includes('stock profit');
    const isCagr = toolSlug.includes('cagr') || toolSlug.includes('roi') || toolName.includes('cagr') || toolName.includes('roi');

    let summaryMetrics: Array<{ label: string; value: string; accent?: string }> = [];
    let ratioBreakdown: { labelA: string; valA: number; labelB: string; valB: number } | null = null;
    let breakdownHeaders: string[] = ['Period', 'Principal', 'Interest Earned', 'Total Balance'];
    let breakdownRows: string[][] = [];

    // 1. SIP CALCULATOR
    if (isSip) {
      const p = amount;
      const r = rate / 100 / 12;
      const n = years * 12;
      const totalInvested = p * n;
      const totalWealth = r > 0 ? p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : totalInvested;
      const totalReturns = totalWealth - totalInvested;
      const wealthMultiplier = totalInvested > 0 ? (totalWealth / totalInvested).toFixed(2) : '1.00';

      summaryMetrics = [
        { label: 'Total Invested Capital', value: formatCurrency(totalInvested), accent: '#06B6D4' },
        { label: 'Estimated Wealth Gain', value: formatCurrency(totalReturns), accent: '#00A49F' },
        { label: 'Total Maturity Corpus', value: formatCurrency(totalWealth), accent: '#10B981' },
        { label: 'Corpus Growth Factor', value: `${wealthMultiplier}x`, accent: '#6366F1' }
      ];

      ratioBreakdown = {
        labelA: 'Invested Principal',
        valA: totalInvested,
        labelB: 'Wealth Growth Returns',
        valB: totalReturns
      };

      breakdownHeaders = ['Year', 'Monthly Deposit', 'Total Invested', 'Wealth Gain', 'Maturity Corpus'];
      for (let y = 1; y <= years; y++) {
        const mCount = y * 12;
        const invY = p * mCount;
        const valY = r > 0 ? p * ((Math.pow(1 + r, mCount) - 1) / r) * (1 + r) : invY;
        breakdownRows.push([
          `Year ${y}`,
          formatCurrency(p),
          formatCurrency(invY),
          formatCurrency(valY - invY),
          formatCurrency(valY)
        ]);
      }
    }
    // 2. LOAN EMI & MORTGAGE
    else if (isEmi) {
      const p = amount;
      const r = (rate / 12) / 100;
      const n = years * 12;
      const emi = r > 0 ? (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : p / n;
      const totalPayable = emi * n;
      const totalInterest = totalPayable - p;
      const interestRatio = totalPayable > 0 ? ((totalInterest / totalPayable) * 100).toFixed(1) : '0';

      summaryMetrics = [
        { label: 'Monthly Loan EMI', value: formatCurrency(emi), accent: '#00A49F' },
        { label: 'Total Interest Payable', value: formatCurrency(totalInterest), accent: '#F59E0B' },
        { label: 'Total Repayment Amount', value: formatCurrency(totalPayable), accent: '#10B981' },
        { label: 'Interest-to-Loan Ratio', value: `${interestRatio}%`, accent: '#6366F1' }
      ];

      ratioBreakdown = {
        labelA: 'Principal Loan Amount',
        valA: p,
        labelB: 'Total Interest Payable',
        valB: totalInterest
      };

      breakdownHeaders = ['Year', 'Beginning Balance', 'Annual EMI Paid', 'Principal Repaid', 'Interest Paid', 'Closing Balance'];
      let bal = p;
      for (let y = 1; y <= years; y++) {
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
        breakdownRows.push([
          `Year ${y}`,
          formatCurrency(start),
          formatCurrency(emi * 12),
          formatCurrency(yPrinc),
          formatCurrency(yInt),
          formatCurrency(bal)
        ]);
      }
    }
    // 3. COMPOUND INTEREST
    else if (isCompound) {
      const p = amount;
      const r = rate / 100;
      const f = parseInt(frequency, 10);
      const futureVal = p * Math.pow(1 + r / f, f * years);
      const interestEarned = futureVal - p;
      const apy = ((Math.pow(1 + r / f, f) - 1) * 100).toFixed(2);

      summaryMetrics = [
        { label: 'Initial Principal Deposit', value: formatCurrency(p), accent: '#06B6D4' },
        { label: 'Compound Interest Accrued', value: formatCurrency(interestEarned), accent: '#00A49F' },
        { label: 'Total Future Value', value: formatCurrency(futureVal), accent: '#10B981' },
        { label: 'Effective Annual Yield (APY)', value: `${apy}%`, accent: '#6366F1' }
      ];

      ratioBreakdown = {
        labelA: 'Initial Principal',
        valA: p,
        labelB: 'Compound Interest',
        valB: interestEarned
      };

      breakdownHeaders = ['Year', 'Principal', 'Compounding Rate', 'Interest Accrued', 'Accumulated Balance'];
      for (let y = 1; y <= years; y++) {
        const valY = p * Math.pow(1 + r / f, f * y);
        breakdownRows.push([
          `Year ${y}`,
          formatCurrency(p),
          `${rate}% (${f === 12 ? 'Monthly' : f === 4 ? 'Quarterly' : 'Annual'})`,
          formatCurrency(valY - p),
          formatCurrency(valY)
        ]);
      }
    }
    // 4. GST & SALES TAX
    else if (isGst) {
      const raw = amount;
      let baseVal = raw;
      let taxVal = 0;
      let grossVal = raw;

      if (taxMode === 'add') {
        taxVal = (raw * gstRate) / 100;
        grossVal = raw + taxVal;
      } else {
        grossVal = raw;
        baseVal = raw / (1 + gstRate / 100);
        taxVal = grossVal - baseVal;
      }

      summaryMetrics = [
        { label: 'Net Base Amount', value: formatCurrency(baseVal), accent: '#06B6D4' },
        { label: `Total Tax (${gstRate}%)`, value: formatCurrency(taxVal), accent: '#F59E0B' },
        { label: 'CGST / State Split (50:50)', value: formatCurrency(taxVal / 2), accent: '#6366F1' },
        { label: 'Final Gross Amount', value: formatCurrency(grossVal), accent: '#00A49F' }
      ];

      ratioBreakdown = {
        labelA: 'Base Net Price',
        valA: baseVal,
        labelB: 'GST Tax Component',
        valB: taxVal
      };

      breakdownHeaders = ['Tax Slab', 'Base Amount', 'CGST Component', 'SGST Component', 'Final Total Price'];
      [5, 12, 18, 28].forEach((slab) => {
        const sTax = (baseVal * slab) / 100;
        breakdownRows.push([
          `${slab}% Standard Slab`,
          formatCurrency(baseVal),
          formatCurrency(sTax / 2),
          formatCurrency(sTax / 2),
          formatCurrency(baseVal + sTax)
        ]);
      });
    }
    // 5. PERCENTAGE & DISCOUNT
    else if (isPercentage || isDiscount) {
      const base = amount;
      const pRate = rate;
      let resultVal = 0;
      let deltaVal = 0;

      if (percentageMode === 'discount') {
        deltaVal = (base * pRate) / 100;
        resultVal = Math.max(0, base - deltaVal);
      } else if (percentageMode === 'percent_of') {
        resultVal = (base * pRate) / 100;
        deltaVal = resultVal;
      } else if (percentageMode === 'increase') {
        deltaVal = (base * pRate) / 100;
        resultVal = base + deltaVal;
      } else {
        deltaVal = (base * pRate) / 100;
        resultVal = base - deltaVal;
      }

      summaryMetrics = [
        { label: 'Original Base Price', value: formatCurrency(base), accent: '#06B6D4' },
        { label: `${pRate}% Value / Savings`, value: formatCurrency(deltaVal), accent: '#F59E0B' },
        { label: 'Final Calculated Value', value: formatCurrency(resultVal), accent: '#00A49F' },
        { label: 'Effective Ratio', value: `${(100 - pRate).toFixed(1)}% of Base`, accent: '#6366F1' }
      ];

      ratioBreakdown = {
        labelA: 'Final Value',
        valA: resultVal,
        labelB: 'Savings / Discount',
        valB: deltaVal
      };

      breakdownHeaders = ['Percentage Tier', 'Base Value', 'Discount / Portion', 'Net Final Result'];
      [10, 15, 20, 25, 30, 40, 50].forEach((tier) => {
        const tierSavings = (base * tier) / 100;
        breakdownRows.push([
          `${tier}% Tier`,
          formatCurrency(base),
          formatCurrency(tierSavings),
          formatCurrency(base - tierSavings)
        ]);
      });
    }
    // 6. INFLATION CALCULATOR
    else if (isInflation) {
      const p = amount;
      const r = rate / 100;
      const futureCost = p * Math.pow(1 + r, years);
      const lossPct = ((futureCost - p) / futureCost) * 100;
      const purchasingPower = 100 / Math.pow(1 + r, years);

      summaryMetrics = [
        { label: 'Current Cost of Goods', value: formatCurrency(p), accent: '#06B6D4' },
        { label: `Future Cost in ${years} Years`, value: formatCurrency(futureCost), accent: '#F43F5E' },
        { label: 'Purchasing Power Loss', value: `${lossPct.toFixed(1)}%`, accent: '#F59E0B' },
        { label: 'Future Value of 100 Units', value: `${purchasingPower.toFixed(1)} Units`, accent: '#6366F1' }
      ];

      ratioBreakdown = {
        labelA: 'Original Purchasing Power',
        valA: p,
        labelB: 'Inflation Cost Escalation',
        valB: futureCost - p
      };

      breakdownHeaders = ['Year', 'Equivalent Item Cost', 'Inflation Accrued', 'Purchasing Power of 100'];
      for (let y = 1; y <= years; y++) {
        const costY = p * Math.pow(1 + r, y);
        breakdownRows.push([
          `Year ${y}`,
          formatCurrency(costY),
          formatCurrency(costY - p),
          `${(100 / Math.pow(1 + r, y)).toFixed(1)} Units`
        ]);
      }
    }
    // 7. RETIREMENT PLANNER
    else if (isRetirement) {
      const currentMonthlyExpense = amount;
      const inf = rate / 100;
      const futureMonthlyExpense = currentMonthlyExpense * Math.pow(1 + inf, years);
      const targetCorpus = futureMonthlyExpense * 12 * 25; // 25x Annual Expenses
      const monthlySavingsNeeded = (targetCorpus / (years * 12)) * 0.45;

      summaryMetrics = [
        { label: 'Monthly Expense at Retirement', value: formatCurrency(futureMonthlyExpense), accent: '#06B6D4' },
        { label: 'Target Retirement Corpus Needed', value: formatCurrency(targetCorpus), accent: '#00A49F' },
        { label: 'Recommended Monthly SIP', value: formatCurrency(monthlySavingsNeeded), accent: '#10B981' },
        { label: 'Target Horizon', value: `${years} Years`, accent: '#6366F1' }
      ];

      ratioBreakdown = {
        labelA: 'Current Annual Living Cost',
        valA: currentMonthlyExpense * 12,
        labelB: 'Target Corpus Needed (25x)',
        valB: targetCorpus
      };

      breakdownHeaders = ['Milestone Timeline', 'Projected Monthly Expense', 'Required Nest Egg (25x)', 'Accumulation Target'];
      for (let y = 1; y <= years; y += Math.max(1, Math.floor(years / 6))) {
        const expY = currentMonthlyExpense * Math.pow(1 + inf, y);
        breakdownRows.push([
          `In ${y} Years`,
          formatCurrency(expY),
          formatCurrency(expY * 12 * 25),
          `${Math.round((y / years) * 100)}% Milestone`
        ]);
      }
    }
    // 8. SALARY & TAKE-HOME PAY
    else if (isSalary) {
      const grossAnnual = amount;
      const grossMonthly = grossAnnual / 12;
      const monthlyPf = (grossMonthly * 0.5 * (pfRate / 100)); // PF on 50% basic
      const monthlyPt = 200; // Standard professional tax
      const annualTaxable = Math.max(0, grossAnnual - 75000 - (monthlyPf * 12));
      const annualTax = annualTaxable > 700000 ? (annualTaxable - 700000) * 0.15 : 0;
      const monthlyTax = annualTax / 12;
      const netMonthly = Math.max(0, grossMonthly - monthlyPf - monthlyPt - monthlyTax - (otherDeductions / 12));

      summaryMetrics = [
        { label: 'Gross Monthly CTC', value: formatCurrency(grossMonthly), accent: '#06B6D4' },
        { label: 'Monthly Deductions (PF & Tax)', value: formatCurrency(monthlyPf + monthlyPt + monthlyTax), accent: '#F43F5E' },
        { label: 'Net Monthly In-Hand Salary', value: formatCurrency(netMonthly), accent: '#00A49F' },
        { label: 'Annual Net Take-Home', value: formatCurrency(netMonthly * 12), accent: '#10B981' }
      ];

      ratioBreakdown = {
        labelA: 'Net In-Hand Take-Home',
        valA: netMonthly * 12,
        labelB: 'Taxes & PF Deductions',
        valB: (monthlyPf + monthlyPt + monthlyTax) * 12
      };

      breakdownHeaders = ['Pay Component', 'Calculation Rule', 'Monthly Amount', 'Annual Total'];
      breakdownRows = [
        ['Base Monthly Gross CTC', 'Annual CTC ÷ 12', formatCurrency(grossMonthly), formatCurrency(grossAnnual)],
        ['Employee PF (EPF)', `${pfRate}% Contribution`, formatCurrency(monthlyPf), formatCurrency(monthlyPf * 12)],
        ['Professional Tax (PT)', 'Statutory State Levy', formatCurrency(monthlyPt), formatCurrency(2400)],
        ['Income Tax (TDS)', 'Estimated Slab Rate', formatCurrency(monthlyTax), formatCurrency(annualTax)],
        ['Net Take-Home Salary', 'Gross CTC - Deductions', formatCurrency(netMonthly), formatCurrency(netMonthly * 12)]
      ];
    }
    // 9. NET WORTH CALCULATOR
    else if (isNetWorth) {
      const totalAssets = cashAsset + stockAsset + propertyAsset;
      const totalLiabilities = homeLoanLiab + otherLiab;
      const netWorth = totalAssets - totalLiabilities;
      const debtRatio = totalAssets > 0 ? ((totalLiabilities / totalAssets) * 100).toFixed(1) : '0';

      summaryMetrics = [
        { label: 'Total Liquid & Fixed Assets', value: formatCurrency(totalAssets), accent: '#00A49F' },
        { label: 'Total Outstanding Liabilities', value: formatCurrency(totalLiabilities), accent: '#F43F5E' },
        { label: 'Total Net Worth', value: formatCurrency(netWorth), accent: '#10B981' },
        { label: 'Debt-to-Asset Ratio', value: `${debtRatio}%`, accent: '#6366F1' }
      ];

      ratioBreakdown = {
        labelA: 'Net Worth Equity',
        valA: Math.max(0, netWorth),
        labelB: 'Total Liabilities',
        valB: totalLiabilities
      };

      breakdownHeaders = ['Category', 'Asset / Debt Component', 'Market Value', '% Share of Portfolio'];
      breakdownRows = [
        ['Assets', 'Cash & Bank Balances', formatCurrency(cashAsset), `${((cashAsset / (totalAssets || 1)) * 100).toFixed(1)}%`],
        ['Assets', 'Equities, MF & Investments', formatCurrency(stockAsset), `${((stockAsset / (totalAssets || 1)) * 100).toFixed(1)}%`],
        ['Assets', 'Real Estate & Property', formatCurrency(propertyAsset), `${((propertyAsset / (totalAssets || 1)) * 100).toFixed(1)}%`],
        ['Liabilities', 'Mortgage & Home Loan', formatCurrency(homeLoanLiab), 'Debt Component'],
        ['Liabilities', 'Personal Loans & Cards', formatCurrency(otherLiab), 'Debt Component'],
        ['Summary', 'Net Worth Total', formatCurrency(netWorth), '100% Equity']
      ];
    }
    // 10. DEBT-TO-INCOME (DTI)
    else if (isDti) {
      const totalDebt = rentMortgage + carLoan + creditCardMin;
      const dtiRatio = monthlyIncome > 0 ? (totalDebt / monthlyIncome) * 100 : 0;
      let status = 'Healthy (<36%)';
      if (dtiRatio > 43) status = 'High Risk (>43%)';
      else if (dtiRatio > 35) status = 'Moderate Risk (36-43%)';

      summaryMetrics = [
        { label: 'Gross Monthly Income', value: formatCurrency(monthlyIncome), accent: '#06B6D4' },
        { label: 'Monthly Debt Payments', value: formatCurrency(totalDebt), accent: '#F43F5E' },
        { label: 'Debt-to-Income (DTI)', value: `${dtiRatio.toFixed(1)}%`, accent: '#00A49F' },
        { label: 'Lender Health Assessment', value: status, accent: '#6366F1' }
      ];

      ratioBreakdown = {
        labelA: 'Remaining Disposable Income',
        valA: Math.max(0, monthlyIncome - totalDebt),
        labelB: 'Monthly Debt Payments',
        valB: totalDebt
      };

      breakdownHeaders = ['Debt Component', 'Monthly Payment', '% Share of Income', 'Recommended Limit'];
      breakdownRows = [
        ['Housing Rent / Mortgage', formatCurrency(rentMortgage), `${((rentMortgage / monthlyIncome) * 100).toFixed(1)}%`, 'Max 28%'],
        ['Auto & Vehicle Loans', formatCurrency(carLoan), `${((carLoan / monthlyIncome) * 100).toFixed(1)}%`, 'Max 10%'],
        ['Credit Cards & Revolving', formatCurrency(creditCardMin), `${((creditCardMin / monthlyIncome) * 100).toFixed(1)}%`, 'Max 5%'],
        ['Total Liabilities Combined', formatCurrency(totalDebt), `${dtiRatio.toFixed(1)}%`, 'Ideal < 36%']
      ];
    }
    // 11. EMERGENCY FUND PLANNER
    else if (isEmergency) {
      const reqFund = essentialExpense * targetMonths;
      summaryMetrics = [
        { label: 'Essential Monthly Expense', value: formatCurrency(essentialExpense), accent: '#06B6D4' },
        { label: `Target Cushion (${targetMonths} Mo)`, value: formatCurrency(reqFund), accent: '#00A49F' },
        { label: 'Monthly Saving Target (1-Yr Goal)', value: formatCurrency(reqFund / 12), accent: '#10B981' },
        { label: 'Coverage Horizon', value: `${targetMonths} Months Safety`, accent: '#6366F1' }
      ];

      ratioBreakdown = {
        labelA: 'Current Monthly Living Cost',
        valA: essentialExpense,
        labelB: `Total Emergency Target (${targetMonths} Mo)`,
        valB: reqFund
      };

      breakdownHeaders = ['Coverage Milestone', 'Target Horizon', 'Emergency Reserve Fund', 'Status'];
      [3, 6, 9, 12].forEach((m) => {
        breakdownRows.push([
          `${m}-Month Buffer`,
          `${m} Months of Essentials`,
          formatCurrency(essentialExpense * m),
          targetMonths === m ? '★ Active Target' : 'Benchmark'
        ]);
      });
    }
    // 12. STOCK BROKERAGE & PROFIT
    else if (isBrokerage) {
      const buyVal = buyPrice * quantity;
      const sellVal = sellPrice * quantity;
      const grossPnl = sellVal - buyVal;
      const brokerage = Math.min(20, sellVal * 0.0003) * 2;
      const stt = sellVal * 0.001;
      const exchangeFee = (buyVal + sellVal) * 0.0000345;
      const gst = (brokerage + exchangeFee) * 0.18;
      const stampDuty = buyVal * 0.00015;
      const totalCharges = brokerage + stt + exchangeFee + gst + stampDuty;
      const netPnl = grossPnl - totalCharges;

      summaryMetrics = [
        { label: 'Gross Trade P&L', value: formatCurrency(grossPnl), accent: grossPnl >= 0 ? '#10B981' : '#F43F5E' },
        { label: 'Total Regulatory & Broker Fees', value: formatCurrency(totalCharges), accent: '#F59E0B' },
        { label: 'Net Profit After Taxes', value: formatCurrency(netPnl), accent: netPnl >= 0 ? '#00A49F' : '#F43F5E' },
        { label: 'Return on Capital', value: `${buyVal > 0 ? ((netPnl / buyVal) * 100).toFixed(2) : 0}%`, accent: '#6366F1' }
      ];

      ratioBreakdown = {
        labelA: 'Net Realized Profit',
        valA: Math.max(0, netPnl),
        labelB: 'Regulatory & Broker Fees',
        valB: totalCharges
      };

      breakdownHeaders = ['Fee Component', 'Rate / Statutory Rule', 'Fee Amount', 'Levied By'];
      breakdownRows = [
        ['Brokerage Commission', 'Flat ₹20 / Order Max', formatCurrency(brokerage), 'Stock Broker'],
        ['Securities Transaction Tax (STT)', '0.1% on Delivery', formatCurrency(stt), 'Govt Tax'],
        ['Exchange Turnover Fee', '0.00345%', formatCurrency(exchangeFee), 'Stock Exchange'],
        ['GST on Charges', '18% on Brokerage & Turnover', formatCurrency(gst), 'Govt Tax'],
        ['Stamp Duty', '0.015% on Buy Order', formatCurrency(stampDuty), 'State Levy'],
        ['Total Trade Charges', 'All Regulatory Deductions', formatCurrency(totalCharges), 'Combined']
      ];
    }
    // 13. CAGR / ROI CALCULATOR
    else if (isCagr) {
      const initial = amount;
      const finalVal = amount * Math.pow(1 + rate / 100, years);
      const cagrRate = years > 0 && initial > 0 ? (Math.pow(finalVal / initial, 1 / years) - 1) * 100 : 0;
      const absoluteReturn = initial > 0 ? ((finalVal - initial) / initial) * 100 : 0;

      summaryMetrics = [
        { label: 'Initial Investment', value: formatCurrency(initial), accent: '#06B6D4' },
        { label: 'Final Maturity Value', value: formatCurrency(finalVal), accent: '#00A49F' },
        { label: 'Compounded Annual Growth (CAGR)', value: `${cagrRate.toFixed(2)}%`, accent: '#10B981' },
        { label: 'Absolute Total Return', value: `${absoluteReturn.toFixed(1)}%`, accent: '#6366F1' }
      ];

      ratioBreakdown = {
        labelA: 'Initial Investment',
        valA: initial,
        labelB: 'Total Capital Gains',
        valB: finalVal - initial
      };

      breakdownHeaders = ['Year', 'Starting Capital', 'Annual Return', 'Closing Portfolio Value'];
      for (let y = 1; y <= years; y++) {
        const yVal = initial * Math.pow(1 + rate / 100, y);
        breakdownRows.push([
          `Year ${y}`,
          formatCurrency(initial * Math.pow(1 + rate / 100, y - 1)),
          `${rate}%`,
          formatCurrency(yVal)
        ]);
      }
    }
    // 14. SIMPLE INTEREST & GENERIC FALLBACK
    else {
      const p = amount;
      const r = rate / 100;
      const totalInterest = p * r * years;
      const maturity = p + totalInterest;

      summaryMetrics = [
        { label: 'Principal Loan Amount', value: formatCurrency(p), accent: '#06B6D4' },
        { label: 'Total Interest Payable', value: formatCurrency(totalInterest), accent: '#00A49F' },
        { label: 'Total Maturity / Payable', value: formatCurrency(maturity), accent: '#10B981' },
        { label: 'Effective Growth Multiplier', value: `${(maturity / (p || 1)).toFixed(2)}x`, accent: '#6366F1' }
      ];

      ratioBreakdown = {
        labelA: 'Base Principal',
        valA: p,
        labelB: 'Interest Accrued',
        valB: totalInterest
      };

      breakdownHeaders = ['Year', 'Principal', 'Interest Rate', 'Annual Interest Accrued', 'Total Accumulated'];
      for (let y = 1; y <= years; y++) {
        const intY = p * r * y;
        breakdownRows.push([
          `Year ${y}`,
          formatCurrency(p),
          `${rate}%`,
          formatCurrency(p * r),
          formatCurrency(p + intY)
        ]);
      }
    }

    return {
      isSip, isEmi, isCompound, isRetirement, isGst, isInflation, isPpf,
      isSimpleInterest, isFdRd, isPercentage, isDiscount, isSalary,
      isNetWorth, isDti, isEmergency, isBrokerage, isCagr,
      summaryMetrics, ratioBreakdown, breakdownHeaders, breakdownRows
    };
  }, [
    toolSlug, toolName, amount, rate, years, frequency, depositType, taxMode, gstRate,
    percentageMode, pfRate, otherDeductions, cashAsset, stockAsset, propertyAsset,
    homeLoanLiab, otherLiab, monthlyIncome, rentMortgage, carLoan, creditCardMin,
    essentialExpense, targetMonths, buyPrice, sellPrice, quantity, formatCurrency, currencySymbol
  ]);

  // ----------------------------------------------------
  // ACTION UTILITIES: COPY SUMMARY, EXPORT PDF, RESET
  // ----------------------------------------------------
  const handleCopySummary = async () => {
    try {
      const text = [
        `====================================`,
        `${tool.name.toUpperCase()} - SUMMARY RESULTS`,
        `====================================`,
        ...computation.summaryMetrics.map(m => `${m.label}: ${m.value}`),
        `Generated via Quick Calculator (100% Client-Side Engine)`,
        `====================================`
      ].join('\n');
      await navigator.clipboard.writeText(text);
      setCopied(true);
      triggerConfetti(0.35);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDownloadPdf = () => {
    try {
      triggerConfetti();
      const doc = new jsPDF();

      // Top Banner
      doc.setFillColor(0, 164, 159); // Teal #00A49F
      doc.rect(0, 0, 210, 26, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Quick Calculator - Official Financial Report', 14, 16);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 155, 16);

      // Tool Title
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(tool.name, 14, 38);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text('Client-Side High-Precision Financial Simulation & Amortization Schedule.', 14, 45);

      // Summary Cards
      let startY = 55;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Calculation Summary Results:', 14, startY);
      startY += 8;

      computation.summaryMetrics.forEach((m, idx) => {
        const xPos = 14 + (idx % 2) * 92;
        const yPos = startY + Math.floor(idx / 2) * 18;
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(xPos, yPos, 88, 14, 2, 2, 'F');

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(m.label, xPos + 4, yPos + 5);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 164, 159);
        doc.text(m.value, xPos + 4, yPos + 11);
      });

      startY += Math.ceil(computation.summaryMetrics.length / 2) * 18 + 10;

      // Table Header
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Detailed Amortization & Growth Schedule Table:', 14, startY);
      startY += 8;

      const colCount = computation.breakdownHeaders.length;
      const tableWidth = 182;
      const colWidth = tableWidth / colCount;

      doc.setFillColor(30, 41, 59);
      doc.rect(14, startY, tableWidth, 8, 'F');
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      computation.breakdownHeaders.forEach((h, colIdx) => {
        doc.text(h, 16 + colIdx * colWidth, startY + 5.5);
      });
      startY += 8;

      // Table Rows
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      computation.breakdownRows.forEach((row, rIdx) => {
        if (startY > 275) {
          doc.addPage();
          startY = 20;
        }
        if (rIdx % 2 === 0) {
          doc.setFillColor(255, 255, 255);
        } else {
          doc.setFillColor(248, 250, 252);
        }
        doc.rect(14, startY, tableWidth, 6.5, 'F');
        doc.setTextColor(30, 41, 59);
        row.forEach((cell, cIdx) => {
          doc.text(String(cell), 16 + cIdx * colWidth, startY + 4.5);
        });
        startY += 6.5;
      });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Quick Calculator (https://quickcalculator.app) — 100% Client-Side Financial Tools', 14, 288);

      const fileName = `${tool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-report.pdf`;
      doc.save(fileName);
    } catch (e) {
      console.error('PDF generation error', e);
      window.print();
    }
  };

  const handleResetDefaults = () => {
    setAmount(10000);
    setRate(12);
    setYears(10);
    triggerConfetti(0.2);
  };

  return (
    <div className="w-full space-y-6">
      {/* Micro Action Bar: Currency Toggle + PDF Export */}
      <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 dark:bg-slate-900/90 border border-slate-700 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Currency:
          </span>
          <div className="flex items-center gap-1">
            {(['₹', '$', '€', '£'] as const).map((sym) => (
              <button
                key={sym}
                type="button"
                onClick={() => setCurrencySymbol(sym)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  currencySymbol === sym
                    ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                }`}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Summary!' : 'Copy Summary'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs transition-colors cursor-pointer"
            title="Reset to Defaults"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2-PART WORKSPACE: INPUT CANVAS (LEFT/TOP) + LIVE OUTPUT DASHBOARD (RIGHT/BOTTOM) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* PART A: INPUT CANVAS */}
        <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-slate-900/90 dark:bg-slate-900 border border-slate-700 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Input Canvas
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              Live Real-Time
            </span>
          </div>

          {/* SIP CALCULATOR INPUTS */}
          {computation.isSip && (
            <>
              <SynchronizedInputSlider
                label="Monthly SIP Investment"
                value={amount}
                onChange={setAmount}
                min={500}
                max={200000}
                step={500}
                prefix={currencySymbol}
                quickPresets={[
                  { label: '₹2.5k', value: 2500 },
                  { label: '₹5k', value: 5000 },
                  { label: '₹10k', value: 10000 },
                  { label: '₹25k', value: 25000 },
                  { label: '₹50k', value: 50000 }
                ]}
                accentColor="emerald"
              />
              <SynchronizedInputSlider
                label="Expected Annual Return (%)"
                value={rate}
                onChange={setRate}
                min={1}
                max={30}
                step={0.5}
                suffix="%"
                quickPresets={[
                  { label: '8% (FD+)', value: 8 },
                  { label: '12% (Index)', value: 12 },
                  { label: '15% (Equity)', value: 15 },
                  { label: '18% (Aggressive)', value: 18 }
                ]}
                accentColor="emerald"
              />
              <SynchronizedInputSlider
                label="Investment Tenure (Years)"
                value={years}
                onChange={setYears}
                min={1}
                max={40}
                step={1}
                suffix="Years"
                quickPresets={[
                  { label: '3Y', value: 3 },
                  { label: '5Y', value: 5 },
                  { label: '10Y', value: 10 },
                  { label: '15Y', value: 15 },
                  { label: '20Y', value: 20 }
                ]}
                accentColor="emerald"
              />
            </>
          )}

          {/* LOAN EMI & MORTGAGE INPUTS */}
          {computation.isEmi && (
            <>
              <SynchronizedInputSlider
                label="Loan Principal Amount"
                value={amount}
                onChange={setAmount}
                min={50000}
                max={50000000}
                step={50000}
                prefix={currencySymbol}
                quickPresets={[
                  { label: '5 Lakhs', value: 500000 },
                  { label: '10 Lakhs', value: 1000000 },
                  { label: '25 Lakhs', value: 2500000 },
                  { label: '50 Lakhs', value: 5000000 }
                ]}
                accentColor="indigo"
              />
              <SynchronizedInputSlider
                label="Interest Rate (% p.a.)"
                value={rate}
                onChange={setRate}
                min={3}
                max={25}
                step={0.1}
                suffix="%"
                quickPresets={[
                  { label: '8.4% (Home)', value: 8.4 },
                  { label: '9.5% (Car)', value: 9.5 },
                  { label: '11.5% (Personal)', value: 11.5 },
                  { label: '14% (Business)', value: 14 }
                ]}
                accentColor="indigo"
              />
              <SynchronizedInputSlider
                label="Loan Tenure (Years)"
                value={years}
                onChange={setYears}
                min={1}
                max={35}
                step={1}
                suffix="Years"
                quickPresets={[
                  { label: '5Y', value: 5 },
                  { label: '10Y', value: 10 },
                  { label: '15Y', value: 15 },
                  { label: '20Y', value: 20 },
                  { label: '30Y', value: 30 }
                ]}
                accentColor="indigo"
              />
            </>
          )}

          {/* COMPOUND INTEREST INPUTS */}
          {computation.isCompound && (
            <>
              <SynchronizedInputSlider
                label="Initial Principal Deposit"
                value={amount}
                onChange={setAmount}
                min={1000}
                max={10000000}
                step={1000}
                prefix={currencySymbol}
                accentColor="cyan"
              />
              <SynchronizedInputSlider
                label="Annual Interest Rate (%)"
                value={rate}
                onChange={setRate}
                min={1}
                max={30}
                step={0.25}
                suffix="%"
                accentColor="cyan"
              />
              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/80">
                <label className="text-xs font-semibold text-slate-300 block">
                  Compounding Interval Frequency:
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono font-bold text-slate-100 focus:border-cyan-400 outline-none cursor-pointer"
                >
                  <option value="12">Compounded Monthly (12 times / yr)</option>
                  <option value="4">Compounded Quarterly (4 times / yr)</option>
                  <option value="1">Compounded Annually (1 time / yr)</option>
                </select>
              </div>
              <SynchronizedInputSlider
                label="Time Horizon (Years)"
                value={years}
                onChange={setYears}
                min={1}
                max={40}
                step={1}
                suffix="Years"
                accentColor="cyan"
              />
            </>
          )}

          {/* GST & SALES TAX INPUTS */}
          {computation.isGst && (
            <>
              <SynchronizedInputSlider
                label={`Amount (${taxMode === 'add' ? 'Net Base Price' : 'Gross Total Price'})`}
                value={amount}
                onChange={setAmount}
                min={100}
                max={10000000}
                step={500}
                prefix={currencySymbol}
                accentColor="emerald"
              />
              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/80">
                <label className="text-xs font-semibold text-slate-300 block">
                  Calculation Mode:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTaxMode('add')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      taxMode === 'add'
                        ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                        : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    Add GST (+ Tax)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaxMode('remove')}
                    className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      taxMode === 'remove'
                        ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                        : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    Remove GST (Inclusive)
                  </button>
                </div>
              </div>
              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/80">
                <label className="text-xs font-semibold text-slate-300 block">
                  Standard GST Tax Slab:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 12, 18, 28].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setGstRate(s)}
                      className={`py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        gstRate === s
                          ? 'bg-emerald-500 text-slate-950 font-extrabold'
                          : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {s}%
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* PERCENTAGE & DISCOUNT INPUTS */}
          {(computation.isPercentage || computation.isDiscount) && (
            <>
              <SynchronizedInputSlider
                label="Original Base Price / Value"
                value={amount}
                onChange={setAmount}
                min={10}
                max={500000}
                step={10}
                prefix={currencySymbol}
                accentColor="emerald"
              />
              <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/80">
                <label className="text-xs font-semibold text-slate-300 block">
                  Calculation Mode:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'discount', label: 'Discount Off (%)' },
                    { id: 'percent_of', label: '% of Base Value' },
                    { id: 'increase', label: 'Markup / Increase (%)' },
                    { id: 'decrease', label: 'Percentage Decrease' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPercentageMode(m.id as any)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        percentageMode === m.id
                          ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                          : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              <SynchronizedInputSlider
                label="Percentage / Discount Rate (%)"
                value={rate}
                onChange={setRate}
                min={1}
                max={99}
                step={1}
                suffix="%"
                quickPresets={[
                  { label: '5%', value: 5 },
                  { label: '10%', value: 10 },
                  { label: '15%', value: 15 },
                  { label: '20%', value: 20 },
                  { label: '25%', value: 25 },
                  { label: '50%', value: 50 }
                ]}
                accentColor="emerald"
              />
            </>
          )}

          {/* INFLATION INPUTS */}
          {computation.isInflation && (
            <>
              <SynchronizedInputSlider
                label="Current Cost of Goods / Living"
                value={amount}
                onChange={setAmount}
                min={100}
                max={1000000}
                step={500}
                prefix={currencySymbol}
                accentColor="amber"
              />
              <SynchronizedInputSlider
                label="Expected Annual Inflation Rate (%)"
                value={rate}
                onChange={setRate}
                min={1}
                max={25}
                step={0.5}
                suffix="%"
                accentColor="amber"
              />
              <SynchronizedInputSlider
                label="Years into the Future"
                value={years}
                onChange={setYears}
                min={1}
                max={40}
                step={1}
                suffix="Years"
                accentColor="amber"
              />
            </>
          )}

          {/* RETIREMENT PLANNER INPUTS */}
          {computation.isRetirement && (
            <>
              <SynchronizedInputSlider
                label="Current Monthly Living Expenses"
                value={amount}
                onChange={setAmount}
                min={5000}
                max={500000}
                step={2500}
                prefix={currencySymbol}
                accentColor="emerald"
              />
              <SynchronizedInputSlider
                label="Years to Retirement"
                value={years}
                onChange={setYears}
                min={1}
                max={40}
                step={1}
                suffix="Years"
                accentColor="emerald"
              />
              <SynchronizedInputSlider
                label="Expected Inflation Rate (%)"
                value={rate}
                onChange={setRate}
                min={2}
                max={15}
                step={0.5}
                suffix="%"
                accentColor="emerald"
              />
            </>
          )}

          {/* SALARY INPUTS */}
          {computation.isSalary && (
            <>
              <SynchronizedInputSlider
                label="Annual Gross CTC"
                value={amount}
                onChange={setAmount}
                min={200000}
                max={10000000}
                step={50000}
                prefix={currencySymbol}
                quickPresets={[
                  { label: '₹6L', value: 600000 },
                  { label: '₹12L', value: 1200000 },
                  { label: '₹18L', value: 1800000 },
                  { label: '₹25L', value: 2500000 }
                ]}
                accentColor="emerald"
              />
              <SynchronizedInputSlider
                label="Employee PF Contribution (%)"
                value={pfRate}
                onChange={setPfRate}
                min={0}
                max={15}
                step={1}
                suffix="%"
                accentColor="emerald"
              />
            </>
          )}

          {/* NET WORTH INPUTS */}
          {computation.isNetWorth && (
            <>
              <SynchronizedInputSlider
                label="Cash & Bank Balances"
                value={cashAsset}
                onChange={setCashAsset}
                min={0}
                max={5000000}
                step={25000}
                prefix={currencySymbol}
                accentColor="emerald"
              />
              <SynchronizedInputSlider
                label="Stock & Mutual Fund Portfolio"
                value={stockAsset}
                onChange={setStockAsset}
                min={0}
                max={20000000}
                step={50000}
                prefix={currencySymbol}
                accentColor="emerald"
              />
              <SynchronizedInputSlider
                label="Real Estate & Property Assets"
                value={propertyAsset}
                onChange={setPropertyAsset}
                min={0}
                max={50000000}
                step={100000}
                prefix={currencySymbol}
                accentColor="emerald"
              />
              <SynchronizedInputSlider
                label="Home Loan & Mortgage Liabilities"
                value={homeLoanLiab}
                onChange={setHomeLoanLiab}
                min={0}
                max={30000000}
                step={50000}
                prefix={currencySymbol}
                accentColor="amber"
              />
            </>
          )}

          {/* DTI INPUTS */}
          {computation.isDti && (
            <>
              <SynchronizedInputSlider
                label="Gross Monthly Income"
                value={monthlyIncome}
                onChange={setMonthlyIncome}
                min={10000}
                max={1000000}
                step={5000}
                prefix={currencySymbol}
                accentColor="emerald"
              />
              <SynchronizedInputSlider
                label="Monthly Rent / Housing Mortgage"
                value={rentMortgage}
                onChange={setRentMortgage}
                min={0}
                max={500000}
                step={2500}
                prefix={currencySymbol}
                accentColor="amber"
              />
              <SynchronizedInputSlider
                label="Auto & Vehicle Loan EMI"
                value={carLoan}
                onChange={setCarLoan}
                min={0}
                max={200000}
                step={1000}
                prefix={currencySymbol}
                accentColor="amber"
              />
            </>
          )}

          {/* EMERGENCY FUND INPUTS */}
          {computation.isEmergency && (
            <>
              <SynchronizedInputSlider
                label="Essential Monthly Living Costs"
                value={essentialExpense}
                onChange={setEssentialExpense}
                min={5000}
                max={300000}
                step={2500}
                prefix={currencySymbol}
                accentColor="emerald"
              />
              <SynchronizedInputSlider
                label="Target Coverage Horizon (Months)"
                value={targetMonths}
                onChange={setTargetMonths}
                min={3}
                max={24}
                step={1}
                suffix="Months"
                quickPresets={[
                  { label: '3 Months', value: 3 },
                  { label: '6 Months', value: 6 },
                  { label: '9 Months', value: 9 },
                  { label: '12 Months', value: 12 }
                ]}
                accentColor="emerald"
              />
            </>
          )}

          {/* STOCK BROKERAGE INPUTS */}
          {computation.isBrokerage && (
            <>
              <SynchronizedInputSlider
                label="Buy Price per Share"
                value={buyPrice}
                onChange={setBuyPrice}
                min={1}
                max={100000}
                step={5}
                prefix={currencySymbol}
                accentColor="emerald"
              />
              <SynchronizedInputSlider
                label="Sell Price per Share"
                value={sellPrice}
                onChange={setSellPrice}
                min={1}
                max={100000}
                step={5}
                prefix={currencySymbol}
                accentColor="emerald"
              />
              <SynchronizedInputSlider
                label="Quantity of Shares"
                value={quantity}
                onChange={setQuantity}
                min={1}
                max={10000}
                step={5}
                accentColor="emerald"
              />
            </>
          )}

          {/* GENERIC FALLBACK INPUTS */}
          {!computation.isSip &&
            !computation.isEmi &&
            !computation.isCompound &&
            !computation.isGst &&
            !computation.isPercentage &&
            !computation.isDiscount &&
            !computation.isInflation &&
            !computation.isRetirement &&
            !computation.isSalary &&
            !computation.isNetWorth &&
            !computation.isDti &&
            !computation.isEmergency &&
            !computation.isBrokerage && (
              <>
                <SynchronizedInputSlider
                  label="Primary Calculation Amount / Principal"
                  value={amount}
                  onChange={setAmount}
                  min={100}
                  max={5000000}
                  step={500}
                  prefix={currencySymbol}
                  accentColor="emerald"
                />
                <SynchronizedInputSlider
                  label="Target Rate / Multiplier (%)"
                  value={rate}
                  onChange={setRate}
                  min={1}
                  max={50}
                  step={0.5}
                  suffix="%"
                  accentColor="emerald"
                />
                <SynchronizedInputSlider
                  label="Time Period / Duration (Years)"
                  value={years}
                  onChange={setYears}
                  min={1}
                  max={40}
                  step={1}
                  suffix="Years"
                  accentColor="emerald"
                />
              </>
            )}
        </div>

        {/* PART B: LIVE OUTPUT DASHBOARD */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Dynamic Metric Cards Grid (3 or 4 prominent cards with 24px-32px bold numbers in accent colors) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {computation.summaryMetrics.map((metric, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 dark:bg-slate-900 border border-slate-700 space-y-1.5 shadow-lg relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block truncate">
                    {metric.label}
                  </span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: metric.accent || '#00A49F' }} />
                </div>
                <div
                  className="text-2xl sm:text-3xl font-mono font-extrabold tracking-tight truncate"
                  style={{ color: metric.accent || '#00A49F' }}
                >
                  {metric.value}
                </div>
              </div>
            ))}
          </div>

          {/* Visual Ratio Breakdown Segmented Bar */}
          {computation.ratioBreakdown && (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 dark:bg-slate-900 border border-slate-700 space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <PieIcon className="w-4 h-4 text-emerald-400" />
                  <span>Proportional Value Distribution</span>
                </span>
                <span className="text-slate-400">100% Total Ratio</span>
              </div>

              {/* Segmented Progress Bar */}
              {(() => {
                const total = computation.ratioBreakdown.valA + computation.ratioBreakdown.valB;
                const pctA = total > 0 ? ((computation.ratioBreakdown.valA / total) * 100).toFixed(1) : '50.0';
                const pctB = total > 0 ? ((computation.ratioBreakdown.valB / total) * 100).toFixed(1) : '50.0';

                return (
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden flex shadow-inner">
                      <div
                        className="h-full bg-cyan-500 transition-all duration-300"
                        style={{ width: `${pctA}%` }}
                        title={`${computation.ratioBreakdown.labelA}: ${pctA}%`}
                      />
                      <div
                        className="h-full bg-emerald-400 transition-all duration-300"
                        style={{ width: `${pctB}%` }}
                        title={`${computation.ratioBreakdown.labelB}: ${pctB}%`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono pt-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                        <span className="text-slate-300 font-medium">
                          {computation.ratioBreakdown.labelA}: <strong className="text-cyan-400">{pctA}%</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        <span className="text-slate-300 font-medium">
                          {computation.ratioBreakdown.labelB}: <strong className="text-emerald-400">{pctB}%</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Toggle View Tabs: Summary Insights vs Full Schedule Table */}
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('summary')}
              className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'summary'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Summary Insights</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('breakdown')}
              className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'breakdown'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full Schedule Table ({computation.breakdownRows.length} Rows)</span>
            </button>
          </div>

          {/* Active Tab Panel Content */}
          {activeTab === 'summary' ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 dark:bg-slate-900 border border-slate-700 space-y-4 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Calculation Insights & Schedule Snapshot</span>
                </h4>
                <span className="text-[11px] font-mono text-slate-400">
                  First 3 Periods
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Client-Side Computation Verified</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  All metrics recalculate instantaneously on the client side with 0ms server latency. Export the full report as a PDF to preserve your results.
                </p>
              </div>

              {/* Schedule Snapshot Table */}
              <ResponsiveBreakdownTable
                headers={computation.breakdownHeaders}
                rows={computation.breakdownRows.slice(0, 3)}
                maxHeight="max-h-48"
              />
            </div>
          ) : (
            /* Full Detailed Schedule Table */
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 dark:bg-slate-900 border border-slate-700 space-y-3 shadow-lg overflow-hidden">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800 flex-wrap">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                  <span>Complete Amortization & Growth Breakdown</span>
                </span>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="text-xs font-mono font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>

              <ResponsiveBreakdownTable
                headers={computation.breakdownHeaders}
                rows={computation.breakdownRows}
                maxHeight="max-h-96"
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
