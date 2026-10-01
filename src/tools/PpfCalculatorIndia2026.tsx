import React, { useState, useMemo } from 'react';
import { IndianRupee, Sparkles, TrendingUp, Info, HelpCircle, Check, Copy } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function PpfCalculatorIndia2026({ tool, onBack }: ToolComponentProps) {
  const [yearlyDeposit, setYearlyDeposit] = useState<number>(150000);
  const [interestRate, setInterestRate] = useState<number>(7.1);
  const [tenureYears, setTenureYears] = useState<number>(15);
  const [copied, setCopied] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  // Calculation logic: PPF compounds annually
  const results = useMemo(() => {
    let balance = 0;
    let totalInvested = 0;
    const schedule: { year: number; deposit: number; interest: number; closingBalance: number }[] = [];

    const rate = interestRate / 100;
    for (let yr = 1; yr <= tenureYears; yr++) {
      totalInvested += yearlyDeposit;
      const interestEarned = Math.round((balance + yearlyDeposit) * rate);
      balance = balance + yearlyDeposit + interestEarned;
      schedule.push({
        year: yr,
        deposit: yearlyDeposit,
        interest: interestEarned,
        closingBalance: balance
      });
    }

    const totalInterest = balance - totalInvested;
    return {
      totalInvested,
      totalInterest,
      maturityAmount: balance,
      schedule
    };
  }, [yearlyDeposit, interestRate, tenureYears]);

  const handleCopy = () => {
    const text = `PPF Calculator India 2026 Summary:
Annual Investment: ₹${yearlyDeposit.toLocaleString('en-IN')}
Interest Rate: ${interestRate}%
Tenure: ${tenureYears} Years
Total Investment: ₹${results.totalInvested.toLocaleString('en-IN')}
Total Interest Earned: ₹${results.totalInterest.toLocaleString('en-IN')}
Maturity Amount: ₹${results.maturityAmount.toLocaleString('en-IN')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Tool Header & SEO Target */}
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          PPF Calculator India 2026 with Interest Chart & Maturity Calculator
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate guaranteed returns, tax-free interest, and maturity corpus for Public Provident Fund accounts.
        </p>
      </div>

      {/* Input Form & Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Yearly Deposit */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Annual Deposit</span>
            <span className="font-mono text-emerald-400 font-bold">₹{yearlyDeposit.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="number"
            min={500}
            max={150000}
            step={500}
            value={yearlyDeposit || ''}
            onChange={(e) => setYearlyDeposit(Math.min(150000, Math.max(0, Number(e.target.value))))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-emerald-500"
          />
          <input
            type="range"
            min={500}
            max={150000}
            step={500}
            value={yearlyDeposit}
            onChange={(e) => setYearlyDeposit(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>Min ₹500</span>
            <span>Max ₹1,50,000 / yr</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Interest Rate (% p.a.)</span>
            <span className="font-mono text-emerald-400 font-bold">{interestRate}%</span>
          </div>
          <input
            type="number"
            min={5}
            max={12}
            step={0.1}
            value={interestRate || ''}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-emerald-500"
          />
          <input
            type="range"
            min={5}
            max={12}
            step={0.1}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>Govt 2026: 7.1%</span>
            <span>Max 12%</span>
          </div>
        </div>

        {/* Tenure */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Tenure (Years)</span>
            <span className="font-mono text-emerald-400 font-bold">{tenureYears} Years</span>
          </div>
          <select
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-emerald-500"
          >
            <option value={15}>15 Years (Base Tenure)</option>
            <option value={20}>20 Years (1 Extension)</option>
            <option value={25}>25 Years (2 Extensions)</option>
            <option value={30}>30 Years (3 Extensions)</option>
          </select>
          <p className="text-[11px] text-slate-500">PPF can be extended indefinitely in 5-year blocks.</p>
        </div>
      </div>

      {/* Calculate Button */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setHasCalculated(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Calculate PPF Returns</span>
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

      {/* Result Cards */}
      {hasCalculated && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Total Investment</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                ₹{results.totalInvested.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Under Section 80C</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 shadow-lg shadow-emerald-500/5">
              <span className="text-xs text-emerald-400 font-semibold block">Total Interest Earned</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                ₹{results.totalInterest.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-emerald-500/80 mt-1 block">100% Tax-Exempt (EEE)</span>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/40">
              <span className="text-xs text-slate-300 font-semibold block">Maturity Amount</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                ₹{results.maturityAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">After {tenureYears} Years</span>
            </div>
          </div>

          {/* Growth Schedule Table */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>PPF Yearly Growth Amortization Schedule</span>
            </h4>
            <div className="overflow-x-auto max-h-56 overflow-y-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 sticky top-0 border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">Year</th>
                    <th className="py-2 px-3">Deposit</th>
                    <th className="py-2 px-3">Interest Earned</th>
                    <th className="py-2 px-3 text-right">Closing Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {results.schedule.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-800/40">
                      <td className="py-1.5 px-3 font-semibold text-slate-400">Year {row.year}</td>
                      <td className="py-1.5 px-3">₹{row.deposit.toLocaleString('en-IN')}</td>
                      <td className="py-1.5 px-3 text-emerald-400">₹{row.interest.toLocaleString('en-IN')}</td>
                      <td className="py-1.5 px-3 text-right font-bold text-white">₹{row.closingBalance.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3-Line FAQ Accordion / Informational Section */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frequently Asked Questions (PPF India 2026)</span>
        </h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">1. What is the current PPF interest rate in India for 2026?</p>
            <p className="mt-0.5 text-slate-400">The Ministry of Finance sets PPF interest quarterly; it currently yields 7.1% per annum, compounded annually with sovereign government backing.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">2. What is the maximum annual investment limit in PPF?</p>
            <p className="mt-0.5 text-slate-400">You can deposit a maximum of ₹1,50,000 per financial year across all PPF accounts held in your name. Any excess deposit earns zero interest and receives no tax rebate.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">3. Can I extend my PPF account after completing 15 years?</p>
            <p className="mt-0.5 text-slate-400">Yes, you can extend your PPF indefinitely in consecutive 5-year blocks, either with fresh contributions or as a non-contributory compounding corpus.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
