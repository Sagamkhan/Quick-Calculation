import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  Download, 
  IndianRupee, 
  TrendingUp, 
  PieChart as PieIcon, 
  Table as TableIcon, 
  CheckCircle2, 
  Sparkles,
  Info,
  DollarSign,
  FileSpreadsheet,
  MoveHorizontal,
  SlidersHorizontal
} from 'lucide-react';
import jsPDF from 'jspdf';
import { ToolItem } from '../data/categoriesAndTools';
import { triggerConfetti } from '../utils/confetti';
import { recordToolUsage } from '../utils/usageTracker';

interface FinanceToolEngineProps {
  tool: ToolItem;
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

  // Helper for responsive column visibility & prioritization
  const getColumnVisibilityClass = (header: string, index: number, totalCols: number) => {
    if (showAllColumnsMobile) return 'table-cell'; // Explicit user override to show all columns

    const h = header.toLowerCase();

    // Column 0 (Year, Period, Timeline, Category, Pay Component, Debt Item) -> ALWAYS VISIBLE
    if (index === 0) return 'table-cell font-bold text-neutral-900 dark:text-white';

    // Last Column (Closing Balance, Maturity Value, Total Payable, Final Total Price, Net Profit, In-Hand Salary) -> ALWAYS VISIBLE & HIGHLIGHTED
    if (index === totalCols - 1) return 'table-cell font-bold text-emerald-600 dark:text-emerald-400 text-right';

    // High Priority Key Metrics (Interest Paid, Interest Earned, Interest Accrued, Monthly Breakdown, Charge Amount, Target Reserve)
    if (
      h.includes('interest paid') || 
      h.includes('interest earned') || 
      h.includes('interest accrued') || 
      h.includes('principal repaid') ||
      h.includes('monthly breakdown') ||
      h.includes('value amount') ||
      h.includes('charge amount') ||
      h.includes('target reserve') ||
      h.includes('net profit') ||
      h.includes('monthly obligation')
    ) {
      return 'table-cell font-semibold text-neutral-800 dark:text-neutral-200';
    }

    // Medium Priority Columns (Total Invested, Annual Deposit, Principal, Equivalent Value, % Share, Annual Total) -> Hidden on extra small mobile (<640px)
    if (
      h.includes('total invested') || 
      h.includes('monthly deposit') || 
      h.includes('annual deposit') || 
      h.includes('principal') || 
      h.includes('equivalent value') || 
      h.includes('% share') ||
      h.includes('annual total') ||
      h.includes('coverage duration')
    ) {
      return 'hidden sm:table-cell text-neutral-600 dark:text-neutral-300';
    }

    // Low Priority Intermediate Columns (Beginning Loan Principal, Opening Balance, EMI Paid, CGST/SGST, Calculation Rule, Rate/Formula, Compounding) -> Hidden on mobile/tablet (<768px)
    return 'hidden md:table-cell text-neutral-500 dark:text-neutral-400';
  };

  return (
    <div className="space-y-2">
      {/* Mobile Top Control & Scroll Status */}
      <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-1.5">
          {canScrollLeft || canScrollRight ? (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-[10px] uppercase tracking-wider animate-pulse">
              <MoveHorizontal className="w-3 h-3" />
              <span>Scroll horizontally for all metrics</span>
            </span>
          ) : (
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
              Optimized View Active
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowAllColumnsMobile(!showAllColumnsMobile)}
          className="sm:hidden text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1 shrink-0"
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span>{showAllColumnsMobile ? 'Compact Columns' : 'Show All Columns'}</span>
        </button>
      </div>

      {/* Outer Table Container with Subtle Gradient Edge Fade Overlays */}
      <div className="relative rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden">
        {/* Left Fade Overlay */}
        <div 
          className={`pointer-events-none absolute left-0 top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-r from-white dark:from-neutral-900 via-white/80 dark:via-neutral-900/80 to-transparent z-20 transition-opacity duration-300 ${
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          }`} 
        />

        {/* Right Fade Overlay */}
        <div 
          className={`pointer-events-none absolute right-0 top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-l from-white dark:from-neutral-900 via-white/80 dark:via-neutral-900/80 to-transparent z-20 transition-opacity duration-300 ${
            canScrollRight ? 'opacity-100' : 'opacity-0'
          }`} 
        />

        {/* Scrollable Table Viewport */}
        <div 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className={`${maxHeight} overflow-y-auto overflow-x-auto touch-pan-x scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700`}
        >
          <table className="w-full text-left text-xs font-mono whitespace-nowrap">
            <thead className="bg-neutral-900 text-white dark:bg-neutral-800 sticky top-0 z-10 shadow-sm">
              <tr>
                {headers.map((h, i) => {
                  const visClass = getColumnVisibilityClass(h, i, headers.length);
                  return (
                    <th key={i} className={`p-3 font-bold tracking-tight border-b border-neutral-800 dark:border-neutral-700 ${visClass}`}>
                      {h}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
              {rows.map((row, rIdx) => (
                <tr 
                  key={rIdx} 
                  className={`hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors ${
                    rIdx % 2 === 0 ? 'bg-transparent' : 'bg-neutral-50/40 dark:bg-neutral-850/40'
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

export default function FinanceToolEngine({ tool }: FinanceToolEngineProps) {
  const toolSlug = tool.id;

  // State variables for inputs across various tools
  const [amount, setAmount] = useState<number>(5000);
  const [rate, setRate] = useState<number>(12);
  const [years, setYears] = useState<number>(10);
  const [months, setMonths] = useState<number>(12);
  const [frequency, setFrequency] = useState<string>('12'); // Monthly compounding by default
  const [depositType, setDepositType] = useState<'fd' | 'rd'>('fd');
  const [taxMode, setTaxMode] = useState<'add' | 'remove'>('add');
  const [gstRate, setGstRate] = useState<number>(18);
  const [currencyBase, setCurrencyBase] = useState<string>('USD');
  const [currencyTarget, setCurrencyTarget] = useState<string>('INR');

  // Specific state for Net Worth
  const [assets, setAssets] = useState({
    cash: 250000,
    investments: 500000,
    realEstate: 2500000,
    vehicles: 300000
  });
  const [liabilities, setLiabilities] = useState({
    homeLoan: 1200000,
    personalLoan: 150000,
    creditCard: 25000
  });

  // Specific state for Salary
  const [annualCtc, setAnnualCtc] = useState<number>(1200000);
  const [pfRate, setPfRate] = useState<number>(12);
  const [otherDeductions, setOtherDeductions] = useState<number>(50000);

  // Specific state for DTI
  const [monthlyIncome, setMonthlyIncome] = useState<number>(100000);
  const [rentMortgage, setRentMortgage] = useState<number>(25000);
  const [carLoan, setCarLoan] = useState<number>(10000);
  const [creditCardMin, setCreditCardMin] = useState<number>(5000);

  // Specific state for Emergency Fund
  const [essentialExpense, setEssentialExpense] = useState<number>(45000);
  const [targetMonths, setTargetMonths] = useState<number>(6);

  // Specific state for Brokerage
  const [buyPrice, setBuyPrice] = useState<number>(500);
  const [sellPrice, setSellPrice] = useState<number>(580);
  const [quantity, setQuantity] = useState<number>(100);

  // View toggle state (Visual Summary vs Detailed Breakdown Table)
  const [activeTab, setActiveTab] = useState<'summary' | 'breakdown'>('summary');

  // Record tool usage metric when mounted or tool changes
  useEffect(() => {
    recordToolUsage(tool.id, tool.name);
  }, [tool.id, tool.name]);

  // Format currency helpers
  const formatCurrency = (val: number, symbol = '₹') => {
    if (isNaN(val)) return `${symbol}0`;
    return `${symbol}${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  // ----------------------------------------------------
  // CALCULATIONS & BREAKDOWN COMPUTATIONS
  // ----------------------------------------------------
  const computation = useMemo(() => {
    const isSip = toolSlug.includes('sip') || tool.name.toLowerCase().includes('sip');
    const isEmi = toolSlug.includes('emi') || tool.name.toLowerCase().includes('emi');
    const isCompound = toolSlug.includes('compound') || tool.name.toLowerCase().includes('compound');
    const isRetirement = toolSlug.includes('retirement') || tool.name.toLowerCase().includes('retirement');
    const isGst = toolSlug.includes('gst') || tool.name.toLowerCase().includes('gst') || tool.name.toLowerCase().includes('tax');
    const isInflation = toolSlug.includes('inflation') || tool.name.toLowerCase().includes('inflation');
    const isPpf = toolSlug.includes('ppf') || tool.name.toLowerCase().includes('ppf') || tool.name.toLowerCase().includes('epf');
    const isSimpleInterest = toolSlug.includes('simple') || tool.name.toLowerCase().includes('simple interest');
    const isFdRd = toolSlug.includes('fd-rd') || tool.name.toLowerCase().includes('fixed deposit') || tool.name.toLowerCase().includes('fd');
    const isNetWorth = toolSlug.includes('net-worth') || tool.name.toLowerCase().includes('net worth');
    const isCurrency = toolSlug.includes('currency') || tool.name.toLowerCase().includes('currency');
    const isSalary = toolSlug.includes('salary') || tool.name.toLowerCase().includes('salary') || tool.name.toLowerCase().includes('take-home');
    const isDti = toolSlug.includes('dti') || tool.name.toLowerCase().includes('debt-to-income');
    const isEmergency = toolSlug.includes('emergency') || tool.name.toLowerCase().includes('emergency fund');
    const isBrokerage = toolSlug.includes('brokerage') || tool.name.toLowerCase().includes('brokerage') || tool.name.toLowerCase().includes('trading');

    // Default headers and rows
    let summaryMetrics: Array<{ label: string; value: string }> = [];
    let breakdownHeaders: string[] = ['Period', 'Principal / Invested', 'Interest Earned', 'Total Balance'];
    let breakdownRows: string[][] = [];

    if (isSip) {
      const p = amount;
      const r = rate / 100 / 12;
      const n = years * 12;
      const totalInvested = p * n;
      const totalWealth = r > 0 ? p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : totalInvested;
      const totalInterest = totalWealth - totalInvested;

      summaryMetrics = [
        { label: 'Total Amount Invested', value: formatCurrency(totalInvested) },
        { label: 'Estimated Interest Return', value: formatCurrency(totalInterest) },
        { label: 'Expected Corpus Value', value: formatCurrency(totalWealth) }
      ];

      breakdownHeaders = ['Year', 'Monthly Deposit', 'Total Invested', 'Interest Earned', 'Year-End Balance'];
      let cumulativeInv = 0;
      for (let y = 1; y <= years; y++) {
        const mCount = y * 12;
        cumulativeInv = p * mCount;
        const yearEndValue = r > 0 ? p * ((Math.pow(1 + r, mCount) - 1) / r) * (1 + r) : cumulativeInv;
        const interestEarned = yearEndValue - cumulativeInv;
        breakdownRows.push([
          `Year ${y}`,
          formatCurrency(p),
          formatCurrency(cumulativeInv),
          formatCurrency(interestEarned),
          formatCurrency(yearEndValue)
        ]);
      }
    } else if (isEmi) {
      const p = amount;
      const r = (rate / 12) / 100;
      const n = years * 12;
      const emi = r > 0 ? p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : p / n;
      const totalAmount = emi * n;
      const totalInterest = totalAmount - p;

      summaryMetrics = [
        { label: 'Monthly Loan EMI', value: formatCurrency(emi) },
        { label: 'Total Interest Payable', value: formatCurrency(totalInterest) },
        { label: 'Total Payable Amount', value: formatCurrency(totalAmount) }
      ];

      breakdownHeaders = ['Year', 'Beginning Loan Principal', 'EMI Paid (Annual)', 'Principal Repaid', 'Interest Paid', 'Closing Balance'];
      let balance = p;
      for (let y = 1; y <= years; y++) {
        const startBal = balance;
        let yearlyInterest = 0;
        let yearlyPrincipal = 0;
        for (let m = 1; m <= 12; m++) {
          const interestComponent = balance * r;
          const principalComponent = emi - interestComponent;
          yearlyInterest += interestComponent;
          yearlyPrincipal += principalComponent;
          balance = Math.max(0, balance - principalComponent);
        }
        breakdownRows.push([
          `Year ${y}`,
          formatCurrency(startBal),
          formatCurrency(emi * 12),
          formatCurrency(yearlyPrincipal),
          formatCurrency(yearlyInterest),
          formatCurrency(balance)
        ]);
      }
    } else if (isCompound) {
      const p = amount;
      const r = rate / 100;
      const f = parseInt(frequency, 10);
      const totalFuture = p * Math.pow(1 + r / f, f * years);
      const totalInterest = totalFuture - p;

      summaryMetrics = [
        { label: 'Initial Deposit', value: formatCurrency(p) },
        { label: 'Compound Interest Earned', value: formatCurrency(totalInterest) },
        { label: 'Maturity Value', value: formatCurrency(totalFuture) }
      ];

      breakdownHeaders = ['Year', 'Principal', 'Compound Rate', 'Interest Accrued', 'Accumulated Value'];
      for (let y = 1; y <= years; y++) {
        const val = p * Math.pow(1 + r / f, f * y);
        const intEarned = val - p;
        breakdownRows.push([
          `Year ${y}`,
          formatCurrency(p),
          `${rate}% (${f === 12 ? 'Monthly' : f === 4 ? 'Quarterly' : 'Annual'})`,
          formatCurrency(intEarned),
          formatCurrency(val)
        ]);
      }
    } else if (isRetirement) {
      const currentExpense = amount; // e.g. 50,000 / month
      const inflation = rate / 100;
      const futureExpense = currentExpense * Math.pow(1 + inflation, years);
      const targetCorpus = futureExpense * 12 * 25; // 25x annual expense rule
      const monthlySavingsNeeded = (targetCorpus / (years * 12)) * 0.45;

      summaryMetrics = [
        { label: 'Future Monthly Expense at Retirement', value: formatCurrency(futureExpense) },
        { label: 'Target Retirement Corpus Needed', value: formatCurrency(targetCorpus) },
        { label: 'Recommended Monthly Investment', value: formatCurrency(monthlySavingsNeeded) }
      ];

      breakdownHeaders = ['Timeline', 'Estimated Monthly Expense', 'Corpus Needed (25x Rule)', 'Target Accumulation'];
      for (let y = 1; y <= years; y += Math.max(1, Math.floor(years / 8))) {
        const expAtY = currentExpense * Math.pow(1 + inflation, y);
        const corpAtY = expAtY * 12 * 25;
        breakdownRows.push([
          `In ${y} Years`,
          formatCurrency(expAtY),
          formatCurrency(corpAtY),
          `${Math.round((y / years) * 100)}% Milestone`
        ]);
      }
    } else if (isGst) {
      const net = amount;
      const gRate = gstRate;
      let gstVal = 0;
      let grossVal = 0;
      let baseVal = net;

      if (taxMode === 'add') {
        gstVal = (net * gRate) / 100;
        grossVal = net + gstVal;
      } else {
        grossVal = net;
        baseVal = net / (1 + gRate / 100);
        gstVal = grossVal - baseVal;
      }

      summaryMetrics = [
        { label: 'Base Net Amount', value: formatCurrency(baseVal) },
        { label: `Total GST (${gRate}%)`, value: formatCurrency(gstVal) },
        { label: 'CGST (Central Tax 50%)', value: formatCurrency(gstVal / 2) },
        { label: 'Total Gross Amount', value: formatCurrency(grossVal) }
      ];

      breakdownHeaders = ['Tax Slab', 'Base Amount', 'CGST Component', 'SGST Component', 'Final Total Price'];
      [5, 12, 18, 28].forEach((slab) => {
        const sGst = (baseVal * slab) / 100;
        breakdownRows.push([
          `${slab}% GST Slab`,
          formatCurrency(baseVal),
          formatCurrency(sGst / 2),
          formatCurrency(sGst / 2),
          formatCurrency(baseVal + sGst)
        ]);
      });
    } else if (isInflation) {
      const p = amount;
      const r = rate / 100;
      const futureVal = p * Math.pow(1 + r, years);
      const lossPct = ((futureVal - p) / futureVal) * 100;

      summaryMetrics = [
        { label: 'Current Cost of Goods', value: formatCurrency(p) },
        { label: `Future Cost after ${years} Years`, value: formatCurrency(futureVal) },
        { label: 'Purchasing Power Loss', value: `${lossPct.toFixed(1)}%` }
      ];

      breakdownHeaders = ['Year', 'Equivalent Item Cost', 'Purchasing Power of 100 Units', 'Cumulative Inflation Rate'];
      for (let y = 1; y <= years; y++) {
        const c = p * Math.pow(1 + r, y);
        const power = 100 / Math.pow(1 + r, y);
        breakdownRows.push([
          `Year ${y}`,
          formatCurrency(c),
          `${power.toFixed(1)} Units`,
          `${((Math.pow(1 + r, y) - 1) * 100).toFixed(1)}%`
        ]);
      }
    } else if (isPpf) {
      const p = amount; // Annual deposit
      const r = 7.1 / 100; // Guaranteed PPF Rate
      let totalInv = 0;
      let balance = 0;

      breakdownHeaders = ['Year', 'Opening Balance', 'Annual Deposit', 'Interest Earned (7.1%)', 'Closing Balance'];
      for (let y = 1; y <= years; y++) {
        const openBal = balance;
        totalInv += p;
        const interest = (openBal + p) * r;
        balance = openBal + p + interest;
        breakdownRows.push([
          `Year ${y}`,
          formatCurrency(openBal),
          formatCurrency(p),
          formatCurrency(interest),
          formatCurrency(balance)
        ]);
      }

      summaryMetrics = [
        { label: 'Total Deposited Amount', value: formatCurrency(totalInv) },
        { label: 'Total Guaranteed Interest', value: formatCurrency(balance - totalInv) },
        { label: 'PPF Maturity Corpus Value', value: formatCurrency(balance) }
      ];
    } else if (isSimpleInterest) {
      const p = amount;
      const r = rate / 100;
      const totalInterest = p * r * years;
      const maturity = p + totalInterest;

      summaryMetrics = [
        { label: 'Principal Loan Amount', value: formatCurrency(p) },
        { label: 'Total Simple Interest', value: formatCurrency(totalInterest) },
        { label: 'Total Payable Amount', value: formatCurrency(maturity) }
      ];

      breakdownHeaders = ['Year', 'Principal', 'Interest Rate', 'Annual Interest Accrued', 'Total Value'];
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
    } else if (isFdRd) {
      const p = amount;
      const r = rate / 100;
      let totalInv = p;
      let maturity = p;

      if (depositType === 'fd') {
        maturity = p * Math.pow(1 + r / 4, 4 * years); // Quarterly compounding for FD
        summaryMetrics = [
          { label: 'FD Lumpsum Deposit', value: formatCurrency(p) },
          { label: 'Total Interest Earned', value: formatCurrency(maturity - p) },
          { label: 'Maturity Value', value: formatCurrency(maturity) }
        ];

        breakdownHeaders = ['Year', 'Principal', 'Compounding', 'Interest Earned', 'Maturity Value'];
        for (let y = 1; y <= years; y++) {
          const valY = p * Math.pow(1 + r / 4, 4 * y);
          breakdownRows.push([
            `Year ${y}`,
            formatCurrency(p),
            'Quarterly',
            formatCurrency(valY - p),
            formatCurrency(valY)
          ]);
        }
      } else {
        const n = years * 12;
        totalInv = p * n;
        const i = r / 12;
        maturity = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        summaryMetrics = [
          { label: 'Total Monthly RD Investment', value: formatCurrency(totalInv) },
          { label: 'Total Interest Earned', value: formatCurrency(maturity - totalInv) },
          { label: 'RD Maturity Corpus', value: formatCurrency(maturity) }
        ];

        breakdownHeaders = ['Year', 'Monthly RD Deposit', 'Total Deposited', 'Interest Earned', 'Maturity Value'];
        for (let y = 1; y <= years; y++) {
          const mCount = y * 12;
          const invY = p * mCount;
          const valY = p * ((Math.pow(1 + i, mCount) - 1) / i) * (1 + i);
          breakdownRows.push([
            `Year ${y}`,
            formatCurrency(p),
            formatCurrency(invY),
            formatCurrency(valY - invY),
            formatCurrency(valY)
          ]);
        }
      }
    } else if (isNetWorth) {
      const totalAssets = assets.cash + assets.investments + assets.realEstate + assets.vehicles;
      const totalLiabilities = liabilities.homeLoan + liabilities.personalLoan + liabilities.creditCard;
      const netWorth = totalAssets - totalLiabilities;

      summaryMetrics = [
        { label: 'Total Asset Value', value: formatCurrency(totalAssets) },
        { label: 'Total Liabilities & Debt', value: formatCurrency(totalLiabilities) },
        { label: 'Net Personal Financial Worth', value: formatCurrency(netWorth) }
      ];

      breakdownHeaders = ['Category', 'Item Description', 'Value Amount', '% Share of Portfolio'];
      breakdownRows = [
        ['Assets', 'Cash & Bank Balances', formatCurrency(assets.cash), `${((assets.cash / totalAssets) * 100).toFixed(1)}%`],
        ['Assets', 'Stocks, Mutual Funds & Bonds', formatCurrency(assets.investments), `${((assets.investments / totalAssets) * 100).toFixed(1)}%`],
        ['Assets', 'Real Estate Property', formatCurrency(assets.realEstate), `${((assets.realEstate / totalAssets) * 100).toFixed(1)}%`],
        ['Assets', 'Vehicles & Physical Assets', formatCurrency(assets.vehicles), `${((assets.vehicles / totalAssets) * 100).toFixed(1)}%`],
        ['Liabilities', 'Home Loan Mortgage', formatCurrency(liabilities.homeLoan), `${((liabilities.homeLoan / totalLiabilities) * 100).toFixed(1)}%`],
        ['Liabilities', 'Personal & Education Loans', formatCurrency(liabilities.personalLoan), `${((liabilities.personalLoan / totalLiabilities) * 100).toFixed(1)}%`],
        ['Liabilities', 'Credit Card Balances', formatCurrency(liabilities.creditCard), `${((liabilities.creditCard / totalLiabilities) * 100).toFixed(1)}%`]
      ];
    } else if (isCurrency) {
      const rates: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.78, INR: 83.5, CAD: 1.36, AUD: 1.52, JPY: 155.2 };
      const baseRate = rates[currencyBase] || 1;
      const targetRate = rates[currencyTarget] || 83.5;
      const convertedVal = (amount / baseRate) * targetRate;
      const fee = convertedVal * 0.015;

      summaryMetrics = [
        { label: `Input Amount (${currencyBase})`, value: `${amount.toLocaleString()} ${currencyBase}` },
        { label: `Converted Value (${currencyTarget})`, value: `${convertedVal.toFixed(2)} ${currencyTarget}` },
        { label: 'Estimated Transaction Fee (1.5%)', value: `${fee.toFixed(2)} ${currencyTarget}` },
        { label: 'Net In-Hand Amount', value: `${(convertedVal - fee).toFixed(2)} ${currencyTarget}` }
      ];

      breakdownHeaders = ['Target Currency', 'Code', 'Exchange Rate (vs Base)', 'Equivalent Value'];
      Object.keys(rates).forEach((curr) => {
        const val = (amount / baseRate) * rates[curr];
        breakdownRows.push([
          curr === 'INR' ? 'Indian Rupee' : curr === 'EUR' ? 'Euro' : curr === 'GBP' ? 'British Pound' : curr === 'USD' ? 'US Dollar' : curr,
          curr,
          (rates[curr] / baseRate).toFixed(4),
          `${val.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${curr}`
        ]);
      });
    } else if (isSalary) {
      const grossMonthly = annualCtc / 12;
      const annualPf = annualCtc * (pfRate / 100);
      const monthlyPf = annualPf / 12;
      const monthlyPt = 200; // Standard professional tax
      const annualTaxable = Math.max(0, annualCtc - 75000 - annualPf);
      const estAnnualTax = annualTaxable > 700000 ? (annualTaxable - 700000) * 0.15 : 0;
      const monthlyTax = estAnnualTax / 12;
      const netTakeHome = grossMonthly - monthlyPf - monthlyPt - monthlyTax - (otherDeductions / 12);

      summaryMetrics = [
        { label: 'Gross Monthly CTC', value: formatCurrency(grossMonthly) },
        { label: 'Monthly PF & Tax Deductions', value: formatCurrency(monthlyPf + monthlyPt + monthlyTax) },
        { label: 'Net Monthly In-Hand Salary', value: formatCurrency(netTakeHome) }
      ];

      breakdownHeaders = ['Pay Component', 'Calculation Rule', 'Monthly Breakdown', 'Annual Total'];
      breakdownRows = [
        ['Base Monthly Gross CTC', 'Annual CTC ÷ 12', formatCurrency(grossMonthly), formatCurrency(annualCtc)],
        ['Employee Provident Fund (EPF)', `${pfRate}% Contribution`, formatCurrency(monthlyPf), formatCurrency(annualPf)],
        ['Professional Tax (PT)', 'Statutory State Levy', formatCurrency(monthlyPt), formatCurrency(2400)],
        ['Income Tax Deduction (TDS)', 'New Tax Slab Estimate', formatCurrency(monthlyTax), formatCurrency(estAnnualTax)],
        ['Net Take-Home Salary', 'Gross CTC - Deductions', formatCurrency(netTakeHome), formatCurrency(netTakeHome * 12)]
      ];
    } else if (isDti) {
      const totalDebt = rentMortgage + carLoan + creditCardMin;
      const dtiRatio = monthlyIncome > 0 ? (totalDebt / monthlyIncome) * 100 : 0;
      let status = 'Healthy (<36%)';
      let statusColor = 'text-emerald-500';
      if (dtiRatio > 43) { status = 'High Risk (>43%)'; statusColor = 'text-rose-500'; }
      else if (dtiRatio > 35) { status = 'Moderate Risk (36-43%)'; statusColor = 'text-amber-500'; }

      summaryMetrics = [
        { label: 'Gross Monthly Income', value: formatCurrency(monthlyIncome) },
        { label: 'Total Monthly Debt Payments', value: formatCurrency(totalDebt) },
        { label: 'Debt-to-Income (DTI) Ratio', value: `${dtiRatio.toFixed(1)}% (${status})` }
      ];

      breakdownHeaders = ['Debt Item', 'Monthly Obligation', '% Share of Income', 'Recommended Limit'];
      breakdownRows = [
        ['Rent / Housing Mortgage', formatCurrency(rentMortgage), `${((rentMortgage / monthlyIncome) * 100).toFixed(1)}%`, 'Max 28%'],
        ['Auto & Vehicle Loans', formatCurrency(carLoan), `${((carLoan / monthlyIncome) * 100).toFixed(1)}%`, 'Max 10%'],
        ['Credit Cards Minimums', formatCurrency(creditCardMin), `${((creditCardMin / monthlyIncome) * 100).toFixed(1)}%`, 'Max 5%'],
        ['Total Combined Liabilities', formatCurrency(totalDebt), `${dtiRatio.toFixed(1)}%`, 'Ideal < 36%']
      ];
    } else if (isEmergency) {
      const totalEssential = essentialExpense;
      const requiredFund = totalEssential * targetMonths;

      summaryMetrics = [
        { label: 'Essential Monthly Expense', value: formatCurrency(totalEssential) },
        { label: `Target Coverage (${targetMonths} Months)`, value: formatCurrency(requiredFund) },
        { label: 'Monthly Saving Target (12 Mo Goal)', value: formatCurrency(requiredFund / 12) }
      ];

      breakdownHeaders = ['Milestone Goal', 'Coverage Duration', 'Target Reserve Amount', 'Status'];
      [3, 6, 9, 12].forEach((m) => {
        breakdownRows.push([
          `${m}-Month Cushion`,
          `${m} Months Expenses`,
          formatCurrency(totalEssential * m),
          targetMonths === m ? '★ Active Target' : 'Recommended'
        ]);
      });
    } else if (isBrokerage) {
      const buyVal = buyPrice * quantity;
      const sellVal = sellPrice * quantity;
      const grossPnl = sellVal - buyVal;

      const brokerage = Math.min(20, sellVal * 0.0003) * 2; // Flat Rs 20 or 0.03%
      const stt = sellVal * 0.001; // Securities Transaction Tax
      const exchangeCharges = (buyVal + sellVal) * 0.0000345;
      const gst = (brokerage + exchangeCharges) * 0.18;
      const stampDuty = buyVal * 0.00015;
      const totalCharges = brokerage + stt + exchangeCharges + gst + stampDuty;
      const netPnl = grossPnl - totalCharges;

      summaryMetrics = [
        { label: 'Gross Profit / Loss', value: formatCurrency(grossPnl) },
        { label: 'Total Regulatory & Brokerage Charges', value: formatCurrency(totalCharges) },
        { label: 'Net Profit After Taxes', value: formatCurrency(netPnl) }
      ];

      breakdownHeaders = ['Fee Component', 'Rate / Formula', 'Charge Amount', 'Type'];
      breakdownRows = [
        ['Brokerage Fee', 'Flat ₹20 / Order', formatCurrency(brokerage), 'Broker Charge'],
        ['STT / CTT Tax', '0.1% on Delivery', formatCurrency(stt), 'Government Tax'],
        ['Exchange Turnover Fee', '0.00345%', formatCurrency(exchangeCharges), 'Exchange Fee'],
        ['GST Tax', '18% on Brokerage', formatCurrency(gst), 'Government Tax'],
        ['Stamp Duty', '0.015% on Buy', formatCurrency(stampDuty), 'State Duty'],
        ['Total Deductions', 'All Taxes Combined', formatCurrency(totalCharges), 'Total Fee']
      ];
    } else {
      // Default Fallback
      summaryMetrics = [
        { label: 'Calculation Principal', value: formatCurrency(amount) },
        { label: 'Expected Rate / Multiplier', value: `${rate}%` },
        { label: 'Total Calculated Corpus', value: formatCurrency(amount * (1 + rate / 100)) }
      ];
      breakdownHeaders = ['Period', 'Base Amount', 'Rate', 'Output Value'];
      breakdownRows = [
        ['Year 1', formatCurrency(amount), `${rate}%`, formatCurrency(amount * (1 + rate / 100))]
      ];
    }

    return {
      isSip, isEmi, isCompound, isRetirement, isGst, isInflation, isPpf,
      isSimpleInterest, isFdRd, isNetWorth, isCurrency, isSalary, isDti,
      isEmergency, isBrokerage,
      summaryMetrics, breakdownHeaders, breakdownRows
    };
  }, [
    toolSlug, tool.name, amount, rate, years, months, frequency, depositType,
    taxMode, gstRate, currencyBase, currencyTarget, assets, liabilities,
    annualCtc, pfRate, otherDeductions, monthlyIncome, rentMortgage, carLoan,
    creditCardMin, essentialExpense, targetMonths, buyPrice, sellPrice, quantity
  ]);

  // ----------------------------------------------------
  // GENERATE & DOWNLOAD PDF REPORT FEATURE
  // ----------------------------------------------------
  const handleDownloadPdf = () => {
    try {
      triggerConfetti();
      const doc = new jsPDF();

      // Header Banner
      doc.setFillColor(16, 185, 129); // Emerald
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
      doc.text('Professional financial simulation & complete amortization schedule.', 14, 45);

      // Summary Cards
      let startY = 55;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Executive Summary Results:', 14, startY);
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
        doc.setTextColor(15, 23, 42);
        doc.text(m.value, xPos + 4, yPos + 11);
      });

      startY += Math.ceil(computation.summaryMetrics.length / 2) * 18 + 10;

      // Table Title
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Detailed Amortization & Growth Schedule Table:', 14, startY);
      startY += 8;

      // Table Header
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
      doc.text('Quick Calculator (https://quickcalculator.app) — Free Open-Source Financial Tools', 14, 288);

      const fileName = `${tool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-report.pdf`;
      doc.save(fileName);
    } catch (e) {
      console.error('PDF Generation failed:', e);
      window.print();
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner Action Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/20 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-md">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              Pro Financial Calculator & Breakdown Engine
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono uppercase">
                Detailed PDF Ready
              </span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Interactive inputs with real-time year-by-year schedule breakdown.
            </p>
          </div>
        </div>

        {/* Download PDF Button */}
        <button
          onClick={handleDownloadPdf}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Report</span>
        </button>
      </div>

      {/* Main Interactive Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Input Parameters */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-5 shadow-sm">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            Input Parameters
          </h4>

          {/* Conditional Input Controls */}
          {computation.isSip && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-600 dark:text-neutral-300">Monthly SIP Deposit:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{formatCurrency(amount)}</span>
                </div>
                <input
                  type="range" min={500} max={100000} step={500} value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-600 dark:text-neutral-300">Expected Annual Return (%):</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{rate}%</span>
                </div>
                <input
                  type="range" min={1} max={30} step={0.5} value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-600 dark:text-neutral-300">Investment Tenure (Years):</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{years} Years</span>
                </div>
                <input
                  type="range" min={1} max={35} step={1} value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </>
          )}

          {computation.isEmi && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-600 dark:text-neutral-300">Loan Amount (Principal):</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{formatCurrency(amount)}</span>
                </div>
                <input
                  type="range" min={50000} max={20000000} step={50000} value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-600 dark:text-neutral-300">Interest Rate (% p.a.):</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{rate}%</span>
                </div>
                <input
                  type="range" min={3} max={24} step={0.1} value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-600 dark:text-neutral-300">Loan Tenure (Years):</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{years} Years</span>
                </div>
                <input
                  type="range" min={1} max={30} step={1} value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </>
          )}

          {computation.isCompound && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-600 dark:text-neutral-300">Initial Principal Amount:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">{formatCurrency(amount)}</span>
                </div>
                <input
                  type="range" min={5000} max={5000000} step={5000} value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-600 dark:text-neutral-300">Annual Interest Rate (%):</span>
                  <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">{rate}%</span>
                </div>
                <input
                  type="range" min={1} max={25} step={0.25} value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 block">Compounding Interval:</span>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
                >
                  <option value="12">Compounded Monthly (12x/yr)</option>
                  <option value="4">Compounded Quarterly (4x/yr)</option>
                  <option value="1">Compounded Annually (1x/yr)</option>
                </select>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-600 dark:text-neutral-300">Time Horizon (Years):</span>
                  <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">{years} Years</span>
                </div>
                <input
                  type="range" min={1} max={40} step={1} value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </>
          )}

          {computation.isGst && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 block">Amount ({taxMode === 'add' ? 'Net Base Price' : 'Gross Total Price'}):</label>
                <input
                  type="number" value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm font-mono font-bold text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 block">Calculation Mode:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTaxMode('add')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${taxMode === 'add' ? 'bg-emerald-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'}`}
                  >
                    Add GST (+ Tax)
                  </button>
                  <button
                    onClick={() => setTaxMode('remove')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${taxMode === 'remove' ? 'bg-emerald-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'}`}
                  >
                    Remove GST (Inclusive)
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 block">GST Rate Slab (%):</label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 12, 18, 28].map((s) => (
                    <button
                      key={s} onClick={() => setGstRate(s)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${gstRate === s ? 'bg-indigo-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'}`}
                    >
                      {s}%
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Fallback Input controls for other tools */}
          {!computation.isSip && !computation.isEmi && !computation.isCompound && !computation.isGst && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 block">Primary Amount / Deposit:</label>
                <input
                  type="number" value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm font-mono font-bold text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 block">Rate / Target Percentage (%):</label>
                <input
                  type="number" value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm font-mono font-bold text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 block">Tenure / Time Horizon (Years):</label>
                <input
                  type="number" value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-sm font-mono font-bold text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dynamic Results & Breakdown Table */}
        <div className="lg:col-span-7 space-y-5">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {computation.summaryMetrics.map((metric, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1 shadow-sm"
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-semibold block truncate">
                  {metric.label}
                </span>
                <span className="text-base sm:text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400 block truncate">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>

          {/* Toggle View Tabs (Summary vs Detailed Breakdown Table) */}
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80">
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'summary'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5 text-emerald-500" />
              <span>Summary View</span>
            </button>
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'breakdown'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5 text-indigo-500" />
              <span>Full Schedule Table ({computation.breakdownRows.length} Rows)</span>
            </button>
          </div>

          {/* Active Tab Panel Content */}
          {activeTab === 'summary' ? (
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-sm">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Calculation Insights & Highlights
              </h4>

              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 space-y-2 border border-neutral-200/60 dark:border-neutral-700/50">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Verified Financial Engine Output</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  All projections run in real-time using standard compound interest, tax schedules, or logarithmic growth algorithms. Download the complete report as a PDF to save or print.
                </p>
              </div>

              {/* Preview of Breakdown Table */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-neutral-400 font-semibold uppercase tracking-wider block">
                  Schedule Snapshot (First 3 Periods):
                </span>
                <ResponsiveBreakdownTable
                  headers={computation.breakdownHeaders}
                  rows={computation.breakdownRows.slice(0, 3)}
                  maxHeight="max-h-48"
                />
              </div>
            </div>
          ) : (
            /* Full Detailed Breakdown Schedule Table */
            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-indigo-500" />
                  Full Amortization & Schedule Breakdown
                </span>
                <button
                  onClick={handleDownloadPdf}
                  className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export as PDF
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
