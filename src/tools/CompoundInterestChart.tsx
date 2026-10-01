import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, TrendingUp, BarChart3 } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function CompoundInterestChart({ tool, onBack }: ToolComponentProps) {
  const [initialPrincipal, setInitialPrincipal] = useState<number>(100000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(5000);
  const [interestRate, setInterestRate] = useState<number>(10);
  const [horizonYears, setHorizonYears] = useState<number>(15);
  const [compoundingFreq, setCompoundingFreq] = useState<number>(12); // monthly compounding
  const [copied, setCopied] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  const results = useMemo(() => {
    const rate = interestRate / 100;
    const n = compoundingFreq;

    let balance = initialPrincipal;
    let totalInvested = initialPrincipal;
    const dataPoints: { year: number; balance: number; principalInvested: number; interestEarned: number }[] = [];

    // Push Year 0
    dataPoints.push({
      year: 0,
      balance: initialPrincipal,
      principalInvested: initialPrincipal,
      interestEarned: 0
    });

    for (let yr = 1; yr <= horizonYears; yr++) {
      for (let m = 1; m <= 12; m++) {
        totalInvested += monthlyContribution;
        balance = (balance + monthlyContribution) * (1 + rate / 12);
      }
      const roundedBalance = Math.round(balance);
      const roundedInvested = Math.round(totalInvested);
      const interestEarned = Math.max(0, roundedBalance - roundedInvested);

      dataPoints.push({
        year: yr,
        balance: roundedBalance,
        principalInvested: roundedInvested,
        interestEarned
      });
    }

    const finalBalance = dataPoints[dataPoints.length - 1].balance;
    const finalInvested = dataPoints[dataPoints.length - 1].principalInvested;
    const finalInterest = finalBalance - finalInvested;
    const effectiveAnnualRate = (Math.pow(1 + rate / n, n) - 1) * 100;

    return {
      finalBalance,
      finalInvested,
      finalInterest,
      effectiveAnnualRate: effectiveAnnualRate.toFixed(2),
      dataPoints
    };
  }, [initialPrincipal, monthlyContribution, interestRate, horizonYears, compoundingFreq]);

  const handleCopy = () => {
    const text = `Compound Interest with Chart Summary:
Initial Principal: ₹${initialPrincipal.toLocaleString('en-IN')}
Monthly Addition: ₹${monthlyContribution.toLocaleString('en-IN')}
Interest Rate: ${interestRate}% p.a. | Tenure: ${horizonYears} Years
Total Principal Invested: ₹${results.finalInvested.toLocaleString('en-IN')}
Total Compound Interest Earned: ₹${results.finalInterest.toLocaleString('en-IN')}
Future Balance: ₹${results.finalBalance.toLocaleString('en-IN')} (APY: ${results.effectiveAnnualRate}%)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SVG Chart Dimensions
  const chartHeight = 160;
  const chartWidth = 500;
  const maxVal = Math.max(1, results.finalBalance);

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Compound Interest Calculator with Growth Chart - Daily to Annual Compounding
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate multi-year wealth compounding with monthly contributions, interactive growth charts, and Effective Annual Rate (APY) metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Initial principal */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Initial Principal</span>
            <span className="font-mono text-cyan-400 font-bold">₹{initialPrincipal.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="number"
            min={0}
            step={10000}
            value={initialPrincipal || ''}
            onChange={(e) => setInitialPrincipal(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Monthly deposit */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Monthly Addition</span>
            <span className="font-mono text-cyan-400 font-bold">₹{monthlyContribution.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="number"
            min={0}
            step={1000}
            value={monthlyContribution || ''}
            onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Interest rate */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Annual Return Rate</span>
            <span className="font-mono text-cyan-400 font-bold">{interestRate}%</span>
          </div>
          <input
            type="number"
            min={1}
            max={30}
            step={0.5}
            value={interestRate || ''}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Horizon */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Investment Horizon</span>
            <span className="font-mono text-cyan-400 font-bold">{horizonYears} Years</span>
          </div>
          <input
            type="number"
            min={1}
            max={40}
            value={horizonYears || ''}
            onChange={(e) => setHorizonYears(Math.min(40, Math.max(1, Number(e.target.value))))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setHasCalculated(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Calculate Compound Growth</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Total Principal Invested</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                ₹{results.finalInvested.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Principal Outlay</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40">
              <span className="text-xs text-emerald-400 font-semibold block">Total Interest Earned</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                ₹{results.finalInterest.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-emerald-500/80 mt-1 block">Compounded Wealth</span>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-cyan-500/40">
              <span className="text-xs text-cyan-300 font-semibold block">Future Balance</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                ₹{results.finalBalance.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Effective APY: {results.effectiveAnnualRate}%</span>
            </div>
          </div>

          {/* Interactive SVG Stacked Growth Chart */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Multi-Year Growth Curve: Principal vs Compound Interest</span>
              </h4>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block" />
                  <span>Principal</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  <span>Interest Gain</span>
                </span>
              </div>
            </div>

            {/* Responsive SVG bar visualization */}
            <div className="h-44 flex items-end gap-1 sm:gap-2 pt-6 pb-2 px-2 overflow-x-auto">
              {results.dataPoints.map((pt) => {
                const totalH = Math.max(4, Math.round((pt.balance / maxVal) * 120));
                const principalH = Math.round((pt.principalInvested / pt.balance) * totalH);
                const interestH = Math.max(0, totalH - principalH);

                return (
                  <div key={pt.year} className="flex-1 min-w-[20px] flex flex-col items-center gap-1 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-white font-mono text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-20 border border-slate-700">
                      Yr {pt.year}: ₹{pt.balance.toLocaleString('en-IN')}
                    </div>
                    <div className="w-full flex flex-col justify-end" style={{ height: `${totalH}px` }}>
                      {interestH > 0 && (
                        <div
                          className="w-full bg-emerald-500 rounded-t-sm"
                          style={{ height: `${interestH}px` }}
                        />
                      )}
                      <div
                        className={`w-full bg-slate-600 ${interestH === 0 ? 'rounded-t-sm' : ''}`}
                        style={{ height: `${principalH}px` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 select-none">
                      Y{pt.year}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3-Line FAQ */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frequently Asked Questions (Compound Interest with Chart)</span>
        </h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">1. What is the Rule of 72 in compound interest calculation?</p>
            <p className="mt-0.5 text-slate-400">Divide 72 by your annual interest rate (e.g., 72 / 10% = 7.2 years) to find roughly how many years it will take to double your initial capital.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">2. How does adding monthly deposits affect the compounding hockey stick?</p>
            <p className="mt-0.5 text-slate-400">Monthly contributions constantly expand the principal base upon which subsequent interest is calculated, accelerating the hockey-stick growth curve.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">3. What is the difference between nominal rate and Effective Annual Rate (APY)?</p>
            <p className="mt-0.5 text-slate-400">The nominal rate ignores compounding frequency; the Effective Annual Rate reflects the true annual return earned after compounding interest intra-year.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
