import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, TrendingUp, ShieldCheck } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function SipStepUpInflation({ tool, onBack }: ToolComponentProps) {
  const [initialMonthlySip, setInitialMonthlySip] = useState<number>(10000);
  const [stepUpPercent, setStepUpPercent] = useState<number>(10);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [tenureYears, setTenureYears] = useState<number>(15);
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [copied, setCopied] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  const results = useMemo(() => {
    const monthlyRate = expectedReturn / 100 / 12;
    let totalInvested = 0;
    let flatSipInvested = initialMonthlySip * tenureYears * 12;

    // Simulation month by month
    let futureValue = 0;
    let currentMonthlySip = initialMonthlySip;
    const schedule: { year: number; monthlyDeposit: number; yearlyInvested: number; corpus: number }[] = [];

    for (let yr = 1; yr <= tenureYears; yr++) {
      let yearlyInvestedThisYear = 0;
      for (let m = 1; m <= 12; m++) {
        totalInvested += currentMonthlySip;
        yearlyInvestedThisYear += currentMonthlySip;
        futureValue = (futureValue + currentMonthlySip) * (1 + monthlyRate);
      }
      schedule.push({
        year: yr,
        monthlyDeposit: Math.round(currentMonthlySip),
        yearlyInvested: Math.round(yearlyInvestedThisYear),
        corpus: Math.round(futureValue)
      });
      // Increase SIP amount for next year
      currentMonthlySip = currentMonthlySip * (1 + stepUpPercent / 100);
    }

    // Flat SIP future value for comparison
    const flatSipMonths = tenureYears * 12;
    const flatSipFv = initialMonthlySip * ((Math.pow(1 + monthlyRate, flatSipMonths) - 1) / monthlyRate) * (1 + monthlyRate);

    // Inflation Adjusted (Real) Value: Nominal / (1 + inf)^years
    const realPurchasingPower = futureValue / Math.pow(1 + inflationRate / 100, tenureYears);
    const extraGainVsFlat = Math.max(0, futureValue - flatSipFv);

    return {
      totalInvested: Math.round(totalInvested),
      futureValue: Math.round(futureValue),
      realPurchasingPower: Math.round(realPurchasingPower),
      flatSipFv: Math.round(flatSipFv),
      extraGainVsFlat: Math.round(extraGainVsFlat),
      schedule
    };
  }, [initialMonthlySip, stepUpPercent, expectedReturn, tenureYears, inflationRate]);

  const handleCopy = () => {
    const text = `SIP Step Up with Inflation Summary:
Starting Monthly SIP: ₹${initialMonthlySip.toLocaleString('en-IN')} (+${stepUpPercent}% yearly top-up)
Return Rate: ${expectedReturn}% | Tenure: ${tenureYears} Years | Inflation: ${inflationRate}%
Total Invested: ₹${results.totalInvested.toLocaleString('en-IN')}
Nominal Final Corpus: ₹${results.futureValue.toLocaleString('en-IN')}
Inflation-Adjusted Real Value: ₹${results.realPurchasingPower.toLocaleString('en-IN')}
Extra Corpus vs Flat SIP: +₹${results.extraGainVsFlat.toLocaleString('en-IN')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          SIP Step Up Calculator with Inflation 2026 - Annual Top-Up Wealth Growth
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Simulate how stepping up your monthly mutual fund investments by 10% each year compounds exponential wealth, with real inflation purchasing power.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Initial SIP */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 block">Initial Monthly SIP</label>
          <input
            type="number"
            min={500}
            step={1000}
            value={initialMonthlySip || ''}
            onChange={(e) => setInitialMonthlySip(Math.max(500, Number(e.target.value)))}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm focus:outline-none focus:border-cyan-500"
          />
          <span className="text-[10px] text-emerald-400 font-mono">₹{initialMonthlySip.toLocaleString('en-IN')}</span>
        </div>

        {/* Step-up % */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 block">Annual Step-Up (%)</label>
          <input
            type="number"
            min={0}
            max={50}
            value={stepUpPercent || ''}
            onChange={(e) => setStepUpPercent(Math.max(0, Number(e.target.value)))}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm focus:outline-none focus:border-cyan-500"
          />
          <span className="text-[10px] text-slate-400">Salary hike boost</span>
        </div>

        {/* Expected ROI */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 block">Expected Return (%)</label>
          <input
            type="number"
            min={5}
            max={25}
            step={0.5}
            value={expectedReturn || ''}
            onChange={(e) => setExpectedReturn(Number(e.target.value))}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm focus:outline-none focus:border-cyan-500"
          />
          <span className="text-[10px] text-slate-400">Equity mutual funds</span>
        </div>

        {/* Tenure */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 block">Tenure (Years)</label>
          <input
            type="number"
            min={1}
            max={35}
            value={tenureYears || ''}
            onChange={(e) => setTenureYears(Math.min(35, Math.max(1, Number(e.target.value))))}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm focus:outline-none focus:border-cyan-500"
          />
          <span className="text-[10px] text-slate-400">Long-term horizon</span>
        </div>

        {/* Inflation */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 block">Inflation Rate (%)</label>
          <input
            type="number"
            min={0}
            max={15}
            step={0.5}
            value={inflationRate || ''}
            onChange={(e) => setInflationRate(Number(e.target.value))}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm focus:outline-none focus:border-cyan-500"
          />
          <span className="text-[10px] text-slate-400">Purchasing power</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setHasCalculated(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Calculate Step-Up SIP Wealth</span>
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

      {hasCalculated && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Total Invested</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                ₹{results.totalInvested.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">With {stepUpPercent}% annual top-up</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40">
              <span className="text-xs text-emerald-400 font-semibold block">Nominal Final Corpus</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                ₹{results.futureValue.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-emerald-500/80 mt-1 block">At {expectedReturn}% CAGR</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40">
              <span className="text-xs text-cyan-400 font-semibold block">Real (Inflation-Adjusted) Value</span>
              <span className="text-2xl font-bold font-mono text-cyan-400 mt-1 block">
                ₹{results.realPurchasingPower.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">In today's purchasing power</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/40">
              <span className="text-xs text-indigo-300 font-semibold block">Extra vs Flat SIP</span>
              <span className="text-2xl font-bold font-mono text-indigo-300 mt-1 block">
                +₹{results.extraGainVsFlat.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Advantage of Step-Up</span>
            </div>
          </div>
        </div>
      )}

      {/* 3-Line FAQ */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frequently Asked Questions (Step-Up SIP & Inflation)</span>
        </h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">1. How much does a 10% annual Step-Up boost your final corpus?</p>
            <p className="mt-0.5 text-slate-400">Over a 15-year tenure, a 10% annual step-up typically yields over 70% to 100% higher total wealth compared to maintaining a flat monthly installment.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">2. Why is inflation adjustment critical when evaluating future SIP goals?</p>
            <p className="mt-0.5 text-slate-400">At a 6% average inflation rate, everyday consumer prices double every 12 years; real purchasing power reveals what your future wealth will actually buy in today's terms.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">3. Can you automate a Step-Up SIP with Indian mutual funds?</p>
            <p className="mt-0.5 text-slate-400">Yes, most Asset Management Companies (AMCs) offer a built-in "SIP Booster" or "Top-Up" mandate that automatically hikes your ECS bank debit once every 12 months.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
