import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Calendar, RefreshCw } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function RdCalculator({ tool, onBack }: ToolComponentProps) {
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(5000);
  const [interestRate, setInterestRate] = useState<number>(7.0);
  const [tenureMonths, setTenureMonths] = useState<number>(36);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  // RD formula with Indian bank quarterly compounding:
  // M = P * [ (1 + i)^n - 1 ] / [ 1 - (1 + i)^(-1/3) ]
  // where i = rate / 400, n = quarters = tenureMonths / 3
  const results = useMemo(() => {
    const effectiveRate = interestRate + (isSeniorCitizen ? 0.50 : 0);
    const i = effectiveRate / 400;
    const n = tenureMonths / 3;

    let maturityAmount = 0;
    if (i > 0) {
      maturityAmount = monthlyDeposit * ((Math.pow(1 + i, n) - 1) / (1 - Math.pow(1 + i, -1 / 3)));
    } else {
      maturityAmount = monthlyDeposit * tenureMonths;
    }

    const totalInvested = monthlyDeposit * tenureMonths;
    const totalInterest = maturityAmount - totalInvested;

    return {
      effectiveRate,
      totalInvested: Math.round(totalInvested),
      totalInterest: Math.round(totalInterest),
      maturityAmount: Math.round(maturityAmount),
      tenureYears: (tenureMonths / 12).toFixed(1)
    };
  }, [monthlyDeposit, interestRate, tenureMonths, isSeniorCitizen]);

  const handleCopy = () => {
    const text = `RD Calculator India 2026 Summary:
Monthly Deposit: ₹${monthlyDeposit.toLocaleString('en-IN')}
Interest Rate: ${results.effectiveRate}% (${isSeniorCitizen ? 'Senior Citizen +0.50%' : 'Regular'})
Tenure: ${tenureMonths} Months (${results.tenureYears} Years)
Total Investment: ₹${results.totalInvested.toLocaleString('en-IN')}
Total Interest: ₹${results.totalInterest.toLocaleString('en-IN')}
Maturity Amount: ₹${results.maturityAmount.toLocaleString('en-IN')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          RD Calculator India 2026 - Recurring Deposit Maturity & Interest Calculator
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate disciplined monthly recurring deposit accumulation with quarterly compounding and senior citizen rates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Monthly Deposit */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Monthly Installment</span>
            <span className="font-mono text-cyan-400 font-bold">₹{monthlyDeposit.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="number"
            min={500}
            step={500}
            value={monthlyDeposit || ''}
            onChange={(e) => setMonthlyDeposit(Math.max(500, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
          <div className="flex gap-1.5 flex-wrap pt-1">
            {[1000, 2500, 5000, 10000].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setMonthlyDeposit(p)}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 cursor-pointer"
              >
                ₹{p.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Interest Rate */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Interest Rate (% p.a.)</span>
            <span className="font-mono text-cyan-400 font-bold">{results.effectiveRate}%</span>
          </div>
          <input
            type="number"
            min={3}
            max={15}
            step={0.1}
            value={interestRate || ''}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isSeniorCitizen}
              onChange={(e) => setIsSeniorCitizen(e.target.checked)}
              className="rounded accent-cyan-500 w-4 h-4 cursor-pointer"
            />
            <span>Senior Citizen Rate (+0.50% extra)</span>
          </label>
        </div>

        {/* Tenure Months */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Tenure (Months)</span>
            <span className="font-mono text-cyan-400 font-bold">{tenureMonths} Months ({results.tenureYears} Yrs)</span>
          </div>
          <input
            type="number"
            min={6}
            max={120}
            step={3}
            value={tenureMonths || ''}
            onChange={(e) => setTenureMonths(Math.min(120, Math.max(6, Number(e.target.value))))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
          <input
            type="range"
            min={6}
            max={120}
            step={3}
            value={tenureMonths}
            onChange={(e) => setTenureMonths(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setHasCalculated(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Calculate RD Maturity</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Total Invested</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                ₹{results.totalInvested.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">{tenureMonths} monthly deposits</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40">
              <span className="text-xs text-emerald-400 font-semibold block">Total Interest Earned</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                ₹{results.totalInterest.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-emerald-500/80 mt-1 block">Quarterly compounding</span>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-cyan-500/40">
              <span className="text-xs text-cyan-300 font-semibold block">Maturity Value</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                ₹{results.maturityAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Total Return</span>
            </div>
          </div>
        </div>
      )}

      {/* 3-Line FAQ */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frequently Asked Questions (Recurring Deposit India)</span>
        </h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">1. What is the minimum and maximum tenure for an RD in India?</p>
            <p className="mt-0.5 text-slate-400">Recurring Deposit tenures range from a minimum of 6 months to a maximum of 10 years (120 months) in multiples of 3 months.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">2. How is RD interest compounded in Indian commercial banks?</p>
            <p className="mt-0.5 text-slate-400">Indian banks apply the Indian Banks Association (IBA) formula where interest compounds on a quarterly basis on every monthly installment.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">3. Is TDS deducted on recurring deposit returns?</p>
            <p className="mt-0.5 text-slate-400">Yes, TDS is deducted if total interest from RDs across all branches of a bank exceeds ₹40,000 per financial year (₹50,000 for senior citizens).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
