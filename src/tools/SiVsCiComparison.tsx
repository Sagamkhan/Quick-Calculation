import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, TrendingUp, ArrowRight, Scale, IndianRupee } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function SiVsCiComparison({ tool, onBack }: ToolComponentProps) {
  const [principal, setPrincipal] = useState<number>(100000);
  const [rate, setRate] = useState<number>(10);
  const [years, setYears] = useState<number>(10);
  const [compoundFreq, setCompoundFreq] = useState<number>(1); // Annual
  const [copied, setCopied] = useState<boolean>(false);

  const comparison = useMemo(() => {
    const P = Math.max(0, principal);
    const R = Math.max(0, rate);
    const T = Math.max(1, years);
    const n = compoundFreq;

    // Simple Interest
    const siInterest = (P * R * T) / 100;
    const siTotal = P + siInterest;

    // Compound Interest
    const ciTotal = P * Math.pow(1 + R / (100 * n), n * T);
    const ciInterest = ciTotal - P;

    const extraWealth = ciInterest - siInterest;
    const extraPct = siInterest > 0 ? (extraWealth / siInterest) * 100 : 0;

    // Schedule breakdown
    const schedule: { year: number; siBalance: number; ciBalance: number; diff: number }[] = [];
    for (let y = 1; y <= T; y++) {
      const siBal = P + (P * R * y) / 100;
      const ciBal = P * Math.pow(1 + R / (100 * n), n * y);
      schedule.push({
        year: y,
        siBalance: Math.round(siBal),
        ciBalance: Math.round(ciBal),
        diff: Math.round(ciBal - siBal)
      });
    }

    return {
      siInterest: Math.round(siInterest),
      siTotal: Math.round(siTotal),
      ciInterest: Math.round(ciInterest),
      ciTotal: Math.round(ciTotal),
      extraWealth: Math.round(extraWealth),
      extraPct: extraPct.toFixed(1),
      schedule
    };
  }, [principal, rate, years, compoundFreq]);

  const handleCopy = () => {
    const text = `Simple vs Compound Interest Comparison:
Principal: ₹${principal.toLocaleString('en-IN')} | Rate: ${rate}% p.a. | Tenure: ${years} Years
Simple Interest Total: ₹${comparison.siTotal.toLocaleString('en-IN')} (Interest: ₹${comparison.siInterest.toLocaleString('en-IN')})
Compound Interest Total: ₹${comparison.ciTotal.toLocaleString('en-IN')} (Interest: ₹${comparison.ciInterest.toLocaleString('en-IN')})
Compounding Advantage: +₹${comparison.extraWealth.toLocaleString('en-IN')} (+${comparison.extraPct}% extra return)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Simple Interest vs Compound Interest Comparison Calculator - Wealth Growth Head-to-Head
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Compare linear Simple Interest against exponential Compound Interest to visualize the compounding dividend across long-term horizons.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Principal Deposit</span>
            <span className="font-mono text-cyan-400 font-bold">₹{principal.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="number"
            min={0}
            step={10000}
            value={principal || ''}
            onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Annual Interest Rate</span>
            <span className="font-mono text-emerald-400 font-bold">{rate}% p.a.</span>
          </div>
          <input
            type="number"
            min={0}
            max={50}
            step={0.5}
            value={rate || ''}
            onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Time Horizon</span>
            <span className="font-mono text-amber-400 font-bold">{years} Years</span>
          </div>
          <input
            type="number"
            min={1}
            max={40}
            value={years || ''}
            onChange={(e) => setYears(Math.max(1, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">CI Compounding Freq</span>
            <span className="font-mono text-purple-400 font-bold">
              {compoundFreq === 1 ? 'Annually' : compoundFreq === 2 ? 'Half-Yearly' : compoundFreq === 4 ? 'Quarterly' : 'Monthly'}
            </span>
          </div>
          <select
            value={compoundFreq}
            onChange={(e) => setCompoundFreq(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value={1}>Annual (1x / yr)</option>
            <option value={2}>Semi-Annual (2x / yr)</option>
            <option value={4}>Quarterly (4x / yr)</option>
            <option value={12}>Monthly (12x / yr)</option>
          </select>
        </div>
      </div>

      {/* Head-to-Head Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Simple Interest Card */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Simple Interest</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Linear</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            ₹{comparison.siTotal.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800 font-mono">
            <div>Principal: ₹{principal.toLocaleString('en-IN')}</div>
            <div>Total Interest: <span className="text-slate-200">₹{comparison.siInterest.toLocaleString('en-IN')}</span></div>
          </div>
        </div>

        {/* Compound Interest Card */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Compound Interest</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">Exponential</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            ₹{comparison.ciTotal.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800 font-mono">
            <div>Principal: ₹{principal.toLocaleString('en-IN')}</div>
            <div>Total Interest: <span className="text-emerald-300">₹{comparison.ciInterest.toLocaleString('en-IN')}</span></div>
          </div>
        </div>

        {/* Compounding Advantage Card */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-cyan-500/30 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Compounding Dividend
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono">
                +{comparison.extraPct}%
              </span>
            </div>
            <div className="text-2xl font-bold font-mono text-cyan-300 mt-2">
              +₹{comparison.extraWealth.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-400 mt-1">Extra earnings solely generated by interest-on-interest.</p>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold self-start"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Comparison'}
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
            <strong className="text-slate-300">What is the core mathematical difference between SI and CI?</strong>
            <p className="mt-0.5">Simple interest earns returns strictly on the principal deposit, whereas compound interest re-invests accumulated interest, earning interest upon interest.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Why does compounding frequency matter (Annual vs Quarterly)?</strong>
            <p className="mt-0.5">Compounding more frequently (e.g. quarterly as utilized by Indian fixed deposits) increases effective annual yield (APY).</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">At what point does compounding significantly outpace simple interest?</strong>
            <p className="mt-0.5">The compounding curve diverges dramatically after 5 to 7 years, producing exponential multiplier advantages over double-decade horizons.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
