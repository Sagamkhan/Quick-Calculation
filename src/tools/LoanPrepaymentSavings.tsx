import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, TrendingDown, Clock, ShieldCheck, IndianRupee } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function LoanPrepaymentSavings({ tool, onBack }: ToolComponentProps) {
  const [balance, setBalance] = useState<number>(3500000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [remainingMonths, setRemainingMonths] = useState<number>(180); // 15 years
  const [lumpSumPrepayment, setLumpSumPrepayment] = useState<number>(300000);
  const [copied, setCopied] = useState<boolean>(false);

  const results = useMemo(() => {
    const P = Math.max(1000, balance);
    const r = Math.max(0.1, interestRate) / (12 * 100);
    const n = Math.max(1, remainingMonths);

    // Existing EMI
    const originalEmi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const originalTotalPayment = originalEmi * n;
    const originalTotalInterest = originalTotalPayment - P;

    // After Lump Sum prepayment
    const prepayment = Math.min(P - 1000, Math.max(0, lumpSumPrepayment));
    const newPrincipal = P - prepayment;

    // Keeping same EMI to reduce tenure:
    // new_n = -ln(1 - (r * newP / EMI)) / ln(1 + r)
    let newMonths = n;
    let newTotalInterest = originalTotalInterest;

    if (newPrincipal > 0 && originalEmi > newPrincipal * r) {
      const top = Math.log(1 - (r * newPrincipal) / originalEmi);
      const bottom = Math.log(1 + r);
      newMonths = Math.ceil(-top / bottom);
      newTotalInterest = originalEmi * newMonths - newPrincipal;
    }

    const interestSaved = Math.max(0, originalTotalInterest - newTotalInterest);
    const monthsReduced = Math.max(0, n - newMonths);
    const yearsReduced = (monthsReduced / 12).toFixed(1);

    return {
      originalEmi: Math.round(originalEmi),
      originalTotalInterest: Math.round(originalTotalInterest),
      newMonths,
      monthsReduced,
      yearsReduced,
      newTotalInterest: Math.round(newTotalInterest),
      interestSaved: Math.round(interestSaved)
    };
  }, [balance, interestRate, remainingMonths, lumpSumPrepayment]);

  const handleCopy = () => {
    const text = `Loan Prepayment Savings Report:
Outstanding Loan: ₹${balance.toLocaleString('en-IN')} | Interest Rate: ${interestRate}% | Existing Tenure: ${remainingMonths} Months
Prepayment Part-Payment: ₹${lumpSumPrepayment.toLocaleString('en-IN')}
Total Interest Saved: ₹${results.interestSaved.toLocaleString('en-IN')}
Tenure Shortened By: ${results.monthsReduced} Months (${results.yearsReduced} Years)
New Remaining Tenure: ${results.newMonths} Months`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Loan Prepayment Savings Calculator - Part-Payment Tenure Reduction & Interest Saver
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate how much interest you save and how many years you shave off your home loan or personal loan with part-payments.
        </p>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Outstanding Balance</span>
            <span className="font-mono text-cyan-400 font-bold">₹{balance.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="number"
            min={10000}
            step={50000}
            value={balance || ''}
            onChange={(e) => setBalance(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Interest Rate</span>
            <span className="font-mono text-emerald-400 font-bold">{interestRate}% p.a.</span>
          </div>
          <input
            type="number"
            min={1}
            max={30}
            step={0.25}
            value={interestRate || ''}
            onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Remaining Tenure</span>
            <span className="font-mono text-amber-400 font-bold">{remainingMonths} Months</span>
          </div>
          <input
            type="number"
            min={6}
            max={360}
            step={6}
            value={remainingMonths || ''}
            onChange={(e) => setRemainingMonths(Math.max(1, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Lump Sum Prepayment</span>
            <span className="font-mono text-purple-400 font-bold">₹{lumpSumPrepayment.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="number"
            min={0}
            step={25000}
            value={lumpSumPrepayment || ''}
            onChange={(e) => setLumpSumPrepayment(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/30">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-400" /> Total Interest Saved
          </span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 mt-1">
            ₹{results.interestSaved.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" /> Tenure Shortened By
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1">
            {results.monthsReduced} Months
          </div>
          <p className="text-[11px] text-slate-500 mt-1">~{results.yearsReduced} Years earlier closure</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Current Monthly EMI</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
            ₹{results.originalEmi.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 flex flex-col justify-between">
          <span className="text-xs text-slate-400">New Loan Tenure</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1">
            {results.newMonths} Months
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-2"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy Savings'}
          </button>
        </div>
      </div>

      {/* 3-Line FAQ */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-cyan-400" /> Frequently Asked Questions
        </h4>
        <div className="space-y-2 text-xs text-slate-400 divide-y divide-slate-800/80">
          <div className="pt-2">
            <strong className="text-slate-300">Are there prepayment penalty charges on home loans in India?</strong>
            <p className="mt-0.5">Under Reserve Bank of India (RBI) directives, banks cannot charge foreclosure or prepayment penalties on floating-rate individual home loans.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Is it better to reduce tenure or reduce EMI when prepaying?</strong>
            <p className="mt-0.5">Reducing tenure while keeping your EMI constant produces substantially higher total lifetime interest savings than reducing monthly EMI.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">When is the most beneficial time to make a loan part-payment?</strong>
            <p className="mt-0.5">Making prepayments during the initial 3 to 7 years of the loan generates the greatest interest reduction because early balances carry the highest interest burden.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
