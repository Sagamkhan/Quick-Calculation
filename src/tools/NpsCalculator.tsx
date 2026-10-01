import React, { useState, useMemo } from 'react';
import { Sparkles, TrendingUp, HelpCircle, Check, Copy, ShieldCheck, Wallet } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function NpsCalculator({ tool, onBack }: ToolComponentProps) {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(10000);
  const [expectedRoi, setExpectedRoi] = useState<number>(10);
  const [annuityPercentage, setAnnuityPercentage] = useState<number>(40);
  const [annuityReturnRate, setAnnuityReturnRate] = useState<number>(6);
  const [copied, setCopied] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  const results = useMemo(() => {
    const retirementAge = 60;
    const investmentYears = Math.max(1, retirementAge - currentAge);
    const totalMonths = investmentYears * 12;
    const monthlyRate = expectedRoi / 100 / 12;

    // Monthly compound future value formula
    const totalCorpus = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvested = monthlyContribution * totalMonths;
    const totalGain = totalCorpus - totalInvested;

    const annuityCorpus = (totalCorpus * annuityPercentage) / 100;
    const lumpSumWithdrawal = totalCorpus - annuityCorpus;
    const monthlyPension = (annuityCorpus * (annuityReturnRate / 100)) / 12;

    return {
      investmentYears,
      totalInvested: Math.round(totalInvested),
      totalGain: Math.round(totalGain),
      totalCorpus: Math.round(totalCorpus),
      lumpSumWithdrawal: Math.round(lumpSumWithdrawal),
      annuityCorpus: Math.round(annuityCorpus),
      monthlyPension: Math.round(monthlyPension)
    };
  }, [currentAge, monthlyContribution, expectedRoi, annuityPercentage, annuityReturnRate]);

  const handleCopy = () => {
    const text = `NPS Calculator India 2026 Summary:
Current Age: ${currentAge} | Retirement: 60
Monthly Contribution: ₹${monthlyContribution.toLocaleString('en-IN')}
Total Invested: ₹${results.totalInvested.toLocaleString('en-IN')}
Total Corpus at 60: ₹${results.totalCorpus.toLocaleString('en-IN')}
Lump Sum Withdrawal (Tax-Free): ₹${results.lumpSumWithdrawal.toLocaleString('en-IN')}
Monthly Pension: ₹${results.monthlyPension.toLocaleString('en-IN')}/month`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          NPS Calculator India 2026 - Pension & Lump Sum Corpus Estimator
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate wealth accumulation, 60% tax-free lump sum withdrawal, and guaranteed lifelong monthly pension under National Pension System.
        </p>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Age */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Current Age (Years)</span>
            <span className="font-mono text-cyan-400 font-bold">{currentAge} Yrs</span>
          </div>
          <input
            type="number"
            min={18}
            max={59}
            value={currentAge || ''}
            onChange={(e) => setCurrentAge(Math.min(59, Math.max(18, Number(e.target.value))))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
          <input
            type="range"
            min={18}
            max={59}
            value={currentAge}
            onChange={(e) => setCurrentAge(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <span className="text-[11px] text-slate-500">Retirement fixed at age 60</span>
        </div>

        {/* Monthly Contribution */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Monthly Contribution</span>
            <span className="font-mono text-cyan-400 font-bold">₹{monthlyContribution.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="number"
            min={500}
            max={500000}
            step={500}
            value={monthlyContribution || ''}
            onChange={(e) => setMonthlyContribution(Math.max(500, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
          <input
            type="range"
            min={500}
            max={100000}
            step={500}
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <span className="text-[11px] text-slate-500">Additional ₹50k 80CCD(1B) benefit</span>
        </div>

        {/* Expected ROI */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Expected Annual Return</span>
            <span className="font-mono text-cyan-400 font-bold">{expectedRoi}% p.a.</span>
          </div>
          <input
            type="number"
            min={5}
            max={18}
            step={0.5}
            value={expectedRoi || ''}
            onChange={(e) => setExpectedRoi(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
          <input
            type="range"
            min={6}
            max={15}
            step={0.5}
            value={expectedRoi}
            onChange={(e) => setExpectedRoi(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <span className="text-[11px] text-slate-500">Historic equity+debt avg: 9% - 11%</span>
        </div>
      </div>

      {/* Annuity Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">Annuity Reinvestment %</span>
            <span className="font-mono text-white font-bold">{annuityPercentage}% (Lump sum: {100 - annuityPercentage}%)</span>
          </div>
          <input
            type="range"
            min={40}
            max={100}
            step={5}
            value={annuityPercentage}
            onChange={(e) => setAnnuityPercentage(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <span className="text-[11px] text-slate-500">Legal minimum annuity requirement is 40%</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">Expected Annuity Return</span>
            <span className="font-mono text-white font-bold">{annuityReturnRate}% p.a.</span>
          </div>
          <input
            type="range"
            min={5}
            max={10}
            step={0.25}
            value={annuityReturnRate}
            onChange={(e) => setAnnuityReturnRate(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
          <span className="text-[11px] text-slate-500">Typical annuity provider yield in India: 6%</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setHasCalculated(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Calculate NPS Wealth & Pension</span>
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
              <span className="text-xs text-slate-400 block">Total Investment</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-white mt-1 block">
                ₹{results.totalInvested.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">{results.investmentYears} years of SIP</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40">
              <span className="text-xs text-cyan-400 font-semibold block">Total Corpus at 60</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1 block">
                ₹{results.totalCorpus.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Gain: ₹{results.totalGain.toLocaleString('en-IN')}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40">
              <span className="text-xs text-emerald-400 font-semibold block">Lump Sum Withdrawal</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                ₹{results.lumpSumWithdrawal.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-emerald-500/80 mt-1 block">100% Tax-Free ({100 - annuityPercentage}%)</span>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/40">
              <span className="text-xs text-indigo-300 font-semibold block">Monthly Pension</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-white mt-1 block">
                ₹{results.monthlyPension.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Lifelong from {annuityPercentage}% Annuity</span>
            </div>
          </div>
        </div>
      )}

      {/* 3-Line FAQ */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frequently Asked Questions (NPS India 2026)</span>
        </h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">1. What percentage of NPS corpus can be withdrawn as a lump sum at age 60?</p>
            <p className="mt-0.5 text-slate-400">Up to 60% of your total accumulated corpus can be withdrawn completely tax-free; the remaining 40% must be annuitized for monthly pension.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">2. What are the tax deduction benefits of NPS Tier 1?</p>
            <p className="mt-0.5 text-slate-400">You can claim up to ₹1.5 Lakhs under Section 80CCD(1) plus an exclusive additional deduction of ₹50,000 under Section 80CCD(1B).</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">3. Is monthly pension received from NPS taxable?</p>
            <p className="mt-0.5 text-slate-400">Yes, the annuity pension is treated as normal taxable income in the year it is disbursed and taxed according to your applicable slab rate.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
