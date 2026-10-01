import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, ArrowRight, IndianRupee, ShieldCheck, Scale } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function EmiInAdvanceCalculator({ tool, onBack }: ToolComponentProps) {
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(9.5);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [copied, setCopied] = useState<boolean>(false);

  const results = useMemo(() => {
    const P = Math.max(1000, loanAmount);
    const annualRate = Math.max(0.1, interestRate);
    const r = annualRate / (12 * 100);
    const n = Math.max(1, tenureYears * 12);

    // Standard EMI in Arrears (End of month)
    const emiArrears = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPaymentArrears = emiArrears * n;
    const totalInterestArrears = totalPaymentArrears - P;

    // EMI in Advance (Start of month)
    // EMI_adv = EMI_arrears / (1 + r)
    const emiAdvance = emiArrears / (1 + r);
    const totalPaymentAdvance = emiAdvance * n;
    const totalInterestAdvance = totalPaymentAdvance - P;

    const interestSaved = Math.max(0, totalInterestArrears - totalInterestAdvance);
    const emiDifference = emiArrears - emiAdvance;

    return {
      emiArrears: Math.round(emiArrears),
      totalPaymentArrears: Math.round(totalPaymentArrears),
      totalInterestArrears: Math.round(totalInterestArrears),
      emiAdvance: Math.round(emiAdvance),
      totalPaymentAdvance: Math.round(totalPaymentAdvance),
      totalInterestAdvance: Math.round(totalInterestAdvance),
      interestSaved: Math.round(interestSaved),
      emiDifference: Math.round(emiDifference),
      months: n
    };
  }, [loanAmount, interestRate, tenureYears]);

  const handleCopy = () => {
    const text = `EMI in Advance vs Arrears Analysis:
Loan Amount: ₹${loanAmount.toLocaleString('en-IN')} | Interest Rate: ${interestRate}% | Tenure: ${tenureYears} Years (${results.months} months)
EMI in Arrears (End of Month): ₹${results.emiArrears.toLocaleString('en-IN')}/mo (Total Interest: ₹${results.totalInterestArrears.toLocaleString('en-IN')})
EMI in Advance (Start of Month): ₹${results.emiAdvance.toLocaleString('en-IN')}/mo (Total Interest: ₹${results.totalInterestAdvance.toLocaleString('en-IN')})
Total Interest Savings with Advance EMI: ₹${results.interestSaved.toLocaleString('en-IN')} (Saves ₹${results.emiDifference}/mo)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          EMI in Advance Calculator India - Advance vs Arrears Loan Comparison
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Compare loan payments made in advance (beginning of each period) versus in arrears (end of period) to calculate monthly and total interest savings.
        </p>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Loan Amount</span>
            <span className="font-mono text-cyan-400 font-bold">₹{loanAmount.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="number"
            min={10000}
            step={50000}
            value={loanAmount || ''}
            onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Interest Rate (% p.a.)</span>
            <span className="font-mono text-emerald-400 font-bold">{interestRate}%</span>
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
            <span className="font-semibold text-slate-300">Tenure (Years)</span>
            <span className="font-mono text-amber-400 font-bold">{tenureYears} Years</span>
          </div>
          <input
            type="number"
            min={1}
            max={30}
            value={tenureYears || ''}
            onChange={(e) => setTenureYears(Math.max(1, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Head to Head Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Advance EMI */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">EMI in Advance (Start of Month)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Recommended</span>
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-400">
            ₹{results.emiAdvance.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400">/mo</span>
          </div>
          <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800 font-mono">
            <div>Total Repayment: <span className="text-white">₹{results.totalPaymentAdvance.toLocaleString('en-IN')}</span></div>
            <div>Total Interest: <span className="text-emerald-300 font-bold">₹{results.totalInterestAdvance.toLocaleString('en-IN')}</span></div>
          </div>
        </div>

        {/* Arrears EMI */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">EMI in Arrears (End of Month)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Standard Bank</span>
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            ₹{results.emiArrears.toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-400">/mo</span>
          </div>
          <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800 font-mono">
            <div>Total Repayment: <span className="text-slate-300">₹{results.totalPaymentArrears.toLocaleString('en-IN')}</span></div>
            <div>Total Interest: <span className="text-slate-300 font-bold">₹{results.totalInterestArrears.toLocaleString('en-IN')}</span></div>
          </div>
        </div>

        {/* Total Net Savings */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-cyan-500/30 space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">Total Interest Savings</span>
            <div className="text-3xl font-bold font-mono text-cyan-300 mt-2">
              ₹{results.interestSaved.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Save ₹{results.emiDifference.toLocaleString('en-IN')} on every monthly installment by paying upfront.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold self-start"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Loan Report'}
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
            <strong className="text-slate-300">What is the functional difference between EMI in Advance and EMI in Arrears?</strong>
            <p className="mt-0.5">EMI in Advance is paid on the first day of each loan cycle, reducing principal immediately, whereas Arrears is debited at the end of 30 days.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Why is the monthly installment lower when paying in advance?</strong>
            <p className="mt-0.5">Because the principal balance is reduced 30 days earlier in every compounding cycle, less daily interest accrues over the lifetime of the loan.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Which Indian loans typically offer EMI in Advance options?</strong>
            <p className="mt-0.5">Auto loans, equipment leasing, and commercial machinery financing frequently offer advance EMI structures to lower total interest costs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
