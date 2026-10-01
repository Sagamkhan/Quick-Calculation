import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Percent, Calendar } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function FdCalculator({ tool, onBack }: ToolComponentProps) {
  const [principal, setPrincipal] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(7.25);
  const [tenureYears, setTenureYears] = useState<number>(3);
  const [tenureMonths, setTenureMonths] = useState<number>(0);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState<boolean>(false);
  const [compoundingFreq, setCompoundingFreq] = useState<'quarterly' | 'monthly' | 'annually'>('quarterly');
  const [copied, setCopied] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  const results = useMemo(() => {
    const effectiveRate = interestRate + (isSeniorCitizen ? 0.50 : 0);
    const totalYears = tenureYears + tenureMonths / 12;

    let n = 4; // quarterly by default in Indian banks
    if (compoundingFreq === 'monthly') n = 12;
    if (compoundingFreq === 'annually') n = 1;

    const maturityAmount = principal * Math.pow(1 + (effectiveRate / 100) / n, n * totalYears);
    const totalInterest = maturityAmount - principal;

    return {
      effectiveRate,
      totalYears: totalYears.toFixed(2),
      maturityAmount: Math.round(maturityAmount),
      totalInterest: Math.round(totalInterest)
    };
  }, [principal, interestRate, tenureYears, tenureMonths, isSeniorCitizen, compoundingFreq]);

  const handleCopy = () => {
    const text = `FD Calculator India 2026 Summary:
Principal Amount: ₹${principal.toLocaleString('en-IN')}
Interest Rate: ${results.effectiveRate}% (${isSeniorCitizen ? 'Senior Citizen +0.50%' : 'Regular'})
Tenure: ${tenureYears} Yrs ${tenureMonths} Mos
Total Interest Earned: ₹${results.totalInterest.toLocaleString('en-IN')}
Maturity Amount: ₹${results.maturityAmount.toLocaleString('en-IN')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          FD Calculator India 2026 - Fixed Deposit Interest & Maturity Estimator
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate compound interest yields, senior citizen rate bonuses, and final maturity corpus for bank and corporate fixed deposits.
        </p>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Principal */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Deposit Amount</span>
            <span className="font-mono text-cyan-400 font-bold">₹{principal.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="number"
            min={1000}
            step={5000}
            value={principal || ''}
            onChange={(e) => setPrincipal(Math.max(1000, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
          <div className="flex gap-1.5 flex-wrap pt-1">
            {[25000, 50000, 100000, 500000].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPrincipal(p)}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 cursor-pointer"
              >
                ₹{p.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Rate & Senior Citizen Toggle */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Interest Rate (% p.a.)</span>
            <span className="font-mono text-cyan-400 font-bold">{results.effectiveRate}%</span>
          </div>
          <input
            type="number"
            min={3}
            max={15}
            step={0.05}
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
            <span>Senior Citizen Benefit (+0.50% extra)</span>
          </label>
        </div>

        {/* Tenure */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Tenure</span>
            <span className="font-mono text-cyan-400 font-bold">{tenureYears}Y {tenureMonths}M</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Years</label>
              <input
                type="number"
                min={0}
                max={20}
                value={tenureYears}
                onChange={(e) => setTenureYears(Math.max(0, Number(e.target.value)))}
                className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Months</label>
              <input
                type="number"
                min={0}
                max={11}
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Math.max(0, Number(e.target.value)))}
                className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm"
              />
            </div>
          </div>
          <span className="text-[11px] text-slate-500">Standard quarterly compounding</span>
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
          <span>Calculate FD Maturity</span>
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
              <span className="text-xs text-slate-400 block">Principal Deposited</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                ₹{principal.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Initial Outlay</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40">
              <span className="text-xs text-emerald-400 font-semibold block">Total Interest Earned</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                ₹{results.totalInterest.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-emerald-500/80 mt-1 block">At {results.effectiveRate}% p.a.</span>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-cyan-500/40">
              <span className="text-xs text-cyan-300 font-semibold block">Maturity Value</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                ₹{results.maturityAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Principal + Compound Interest</span>
            </div>
          </div>
        </div>
      )}

      {/* 3-Line FAQ */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frequently Asked Questions (Fixed Deposit India)</span>
        </h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">1. How is interest compounded in Indian bank Fixed Deposits?</p>
            <p className="mt-0.5 text-slate-400">Most Indian banks compound FD interest on a quarterly basis, adding earned interest to principal every 3 months.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">2. What is the TDS deduction limit on bank FD interest?</p>
            <p className="mt-0.5 text-slate-400">TDS applies under Section 194A at 10% if total FD interest exceeds ₹40,000 per financial year for regular depositors, or ₹50,000 for senior citizens.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">3. Can you break a fixed deposit before the maturity date?</p>
            <p className="mt-0.5 text-slate-400">Yes, premature withdrawals are permitted with a nominal 0.5%–1.0% interest rate penalty on the applicable tenure rate.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
