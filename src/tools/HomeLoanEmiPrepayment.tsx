import React, { useState, useMemo } from 'react';
import { Sparkles, TrendingDown, HelpCircle, Check, Copy, Clock, ShieldCheck } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function HomeLoanEmiPrepayment({ tool, onBack }: ToolComponentProps) {
  const [loanAmount, setLoanAmount] = useState<number>(5000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [prepayType, setPrepayType] = useState<'monthly' | 'yearly'>('monthly');
  const [prepayAmount, setPrepayAmount] = useState<number>(5000);
  const [copied, setCopied] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  const results = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = tenureYears * 12;

    // Standard EMI without prepayment
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    const totalOriginalInterest = emi * totalMonths - loanAmount;

    // Simulation with prepayment
    let balance = loanAmount;
    let monthsWithPrepay = 0;
    let totalInterestWithPrepay = 0;

    for (let m = 1; m <= totalMonths && balance > 0; m++) {
      const interestForMonth = balance * monthlyRate;
      let principalFromEmi = emi - interestForMonth;

      let extraPrepay = 0;
      if (prepayType === 'monthly') {
        extraPrepay = prepayAmount;
      } else if (prepayType === 'yearly' && m % 12 === 0) {
        extraPrepay = prepayAmount;
      }

      const totalPrincipalPaid = Math.min(balance, principalFromEmi + extraPrepay);
      totalInterestWithPrepay += interestForMonth;
      balance -= totalPrincipalPaid;
      monthsWithPrepay = m;

      if (balance <= 0) break;
    }

    const interestSaved = Math.max(0, totalOriginalInterest - totalInterestWithPrepay);
    const monthsSaved = Math.max(0, totalMonths - monthsWithPrepay);
    const yearsSaved = (monthsSaved / 12).toFixed(1);

    return {
      monthlyEmi: Math.round(emi),
      totalOriginalInterest: Math.round(totalOriginalInterest),
      totalInterestWithPrepay: Math.round(totalInterestWithPrepay),
      interestSaved: Math.round(interestSaved),
      monthsSaved,
      yearsSaved,
      newTenureYears: (monthsWithPrepay / 12).toFixed(1)
    };
  }, [loanAmount, interestRate, tenureYears, prepayType, prepayAmount]);

  const handleCopy = () => {
    const text = `Home Loan EMI with Prepayment Summary:
Loan Amount: ₹${loanAmount.toLocaleString('en-IN')}
Interest Rate: ${interestRate}% | Tenure: ${tenureYears} Years
Monthly EMI: ₹${results.monthlyEmi.toLocaleString('en-IN')}
Prepayment: ₹${prepayAmount.toLocaleString('en-IN')} (${prepayType})
Interest Saved: ₹${results.interestSaved.toLocaleString('en-IN')}
Tenure Reduced by: ${results.yearsSaved} Years (New tenure: ${results.newTenureYears} Years)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Home Loan EMI Calculator with Prepayment & Interest Savings 2026
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Simulate how modest monthly or yearly principal prepayments shave years off your mortgage tenure and save lakhs in interest.
        </p>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Loan Amount */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Loan Amount</span>
            <span className="font-mono text-emerald-400 font-bold">₹{loanAmount.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="number"
            min={100000}
            step={50000}
            value={loanAmount || ''}
            onChange={(e) => setLoanAmount(Math.max(100000, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-emerald-500"
          />
          <input
            type="range"
            min={500000}
            max={20000000}
            step={100000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Interest Rate */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Interest Rate (% p.a.)</span>
            <span className="font-mono text-emerald-400 font-bold">{interestRate}%</span>
          </div>
          <input
            type="number"
            min={6}
            max={15}
            step={0.05}
            value={interestRate || ''}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-emerald-500"
          />
          <input
            type="range"
            min={7}
            max={12}
            step={0.1}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Tenure */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Tenure (Years)</span>
            <span className="font-mono text-emerald-400 font-bold">{tenureYears} Years</span>
          </div>
          <input
            type="number"
            min={1}
            max={30}
            value={tenureYears || ''}
            onChange={(e) => setTenureYears(Math.min(30, Math.max(1, Number(e.target.value))))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-emerald-500"
          />
          <input
            type="range"
            min={5}
            max={30}
            step={1}
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Prepayment Settings */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/30 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4" />
            <span>Prepayment Strategy</span>
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPrepayType('monthly')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                prepayType === 'monthly'
                  ? 'bg-indigo-500 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              Extra Monthly Amount
            </button>
            <button
              type="button"
              onClick={() => setPrepayType('yearly')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                prepayType === 'yearly'
                  ? 'bg-indigo-500 text-white shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              Annual Lump Sum
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="text-xs text-slate-300 block mb-1">
              Prepayment Amount ({prepayType === 'monthly' ? '₹ / Month' : '₹ / Year'})
            </label>
            <input
              type="number"
              min={0}
              step={1000}
              value={prepayAmount || ''}
              onChange={(e) => setPrepayAmount(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center text-xs text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <span>
              💡 Paying an extra ₹{prepayAmount.toLocaleString('en-IN')} {prepayType === 'monthly' ? 'every month' : 'each year'} directly reduces your principal debt balance.
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setHasCalculated(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Calculate EMI & Savings</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
        </button>
      </div>

      {/* Results */}
      {hasCalculated && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Monthly Loan EMI</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                ₹{results.monthlyEmi.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Regular Repayment</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40">
              <span className="text-xs text-emerald-400 font-semibold block">Total Interest Saved</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                ₹{results.interestSaved.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-emerald-500/80 mt-1 block">Cash Kept in Your Pocket</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/40">
              <span className="text-xs text-indigo-300 font-semibold block">Tenure Reduced By</span>
              <span className="text-2xl font-bold font-mono text-indigo-400 mt-1 block">
                {results.yearsSaved} Years
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">{results.monthsSaved} Months Ahead</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">New Loan Duration</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                {results.newTenureYears} Years
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Down from {tenureYears} Years</span>
            </div>
          </div>
        </div>
      )}

      {/* 3-Line FAQ */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frequently Asked Questions (Home Loan Prepayment)</span>
        </h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">1. Does RBI allow prepayment penalty on floating rate home loans?</p>
            <p className="mt-0.5 text-slate-400">No, RBI regulations strictly prohibit banks and housing finance companies from charging any foreclosure or prepayment fees on floating-rate home loans for individual borrowers.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">2. Why does reducing tenure save far more money than reducing monthly EMI?</p>
            <p className="mt-0.5 text-slate-400">Keeping your EMI same and cutting loan duration prevents interest from compounding over additional years, yielding 2x to 4x higher total interest savings.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">3. When is the best time in the month to make a home loan prepayment?</p>
            <p className="mt-0.5 text-slate-400">Make prepayments right after your regular monthly EMI clears (usually 5th to 10th of the month) so the maximum portion of your extra payment reduces principal balance immediately.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
