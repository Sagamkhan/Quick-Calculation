import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Scale, ShieldCheck } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function IncomeTaxCalculator2026({ tool, onBack }: ToolComponentProps) {
  const [grossSalary, setGrossSalary] = useState<number>(1200000);
  const [otherIncome, setOtherIncome] = useState<number>(50000);
  const [sec80c, setSec80c] = useState<number>(150000);
  const [sec80d, setSec80d] = useState<number>(25000);
  const [homeLoanInterest, setHomeLoanInterest] = useState<number>(100000);
  const [copied, setCopied] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  const results = useMemo(() => {
    const totalGross = grossSalary + otherIncome;

    // --- NEW REGIME FY 2026-27 (AY 2027-28) ---
    // Standard deduction under New Regime: ₹75,000
    const newStdDeduction = 75000;
    const newTaxableIncome = Math.max(0, totalGross - newStdDeduction);

    let newTax = 0;
    if (newTaxableIncome <= 300000) {
      newTax = 0;
    } else if (newTaxableIncome <= 700000) {
      newTax = (newTaxableIncome - 300000) * 0.05;
    } else if (newTaxableIncome <= 1000000) {
      newTax = 400000 * 0.05 + (newTaxableIncome - 700000) * 0.10;
    } else if (newTaxableIncome <= 1200000) {
      newTax = 400000 * 0.05 + 300000 * 0.10 + (newTaxableIncome - 1000000) * 0.15;
    } else if (newTaxableIncome <= 1500000) {
      newTax = 400000 * 0.05 + 300000 * 0.10 + 200000 * 0.15 + (newTaxableIncome - 1200000) * 0.20;
    } else {
      newTax = 400000 * 0.05 + 300000 * 0.10 + 200000 * 0.15 + 300000 * 0.20 + (newTaxableIncome - 1500000) * 0.30;
    }

    // Section 87A rebate for New Regime: If taxable income <= 7,00,000, tax rebate up to ₹25,000 (effectively zero tax)
    if (newTaxableIncome <= 700000) {
      newTax = 0;
    }
    const newCess = Math.round(newTax * 0.04);
    const totalNewTax = Math.round(newTax + newCess);

    // --- OLD REGIME FY 2026-27 ---
    // Standard deduction under Old Regime: ₹50,000
    const oldStdDeduction = 50000;
    const oldDeductions = oldStdDeduction + Math.min(150000, sec80c) + Math.min(75000, sec80d) + Math.min(200000, homeLoanInterest);
    const oldTaxableIncome = Math.max(0, totalGross - oldDeductions);

    let oldTax = 0;
    if (oldTaxableIncome <= 250000) {
      oldTax = 0;
    } else if (oldTaxableIncome <= 500000) {
      oldTax = (oldTaxableIncome - 250000) * 0.05;
    } else if (oldTaxableIncome <= 1000000) {
      oldTax = 250000 * 0.05 + (oldTaxableIncome - 500000) * 0.20;
    } else {
      oldTax = 250000 * 0.05 + 500000 * 0.20 + (oldTaxableIncome - 1000000) * 0.30;
    }

    // Section 87A rebate for Old Regime: If taxable income <= 5,00,000
    if (oldTaxableIncome <= 500000) {
      oldTax = 0;
    }
    const oldCess = Math.round(oldTax * 0.04);
    const totalOldTax = Math.round(oldTax + oldCess);

    const taxDifference = Math.abs(totalNewTax - totalOldTax);
    const recommendation = totalNewTax <= totalOldTax ? 'New Tax Regime' : 'Old Tax Regime';

    return {
      totalGross,
      newTaxableIncome,
      totalNewTax,
      oldTaxableIncome,
      totalOldTax,
      recommendation,
      taxSavings: taxDifference
    };
  }, [grossSalary, otherIncome, sec80c, sec80d, homeLoanInterest]);

  const handleCopy = () => {
    const text = `Income Tax Comparison FY 2026-27:
Gross Income: ₹${results.totalGross.toLocaleString('en-IN')}
New Regime Tax: ₹${results.totalNewTax.toLocaleString('en-IN')}
Old Regime Tax: ₹${results.totalOldTax.toLocaleString('en-IN')}
Recommendation: Opt for ${results.recommendation} to save ₹${results.taxSavings.toLocaleString('en-IN')}!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Income Tax Calculator FY 2026-27 New vs Old Regime India
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Detailed tax comparison under updated Budget slabs, enhanced standard deduction (₹75k), Section 87A rebate, and Chapter VI-A deductions.
        </p>
      </div>

      {/* Income Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">Gross Annual Salary (CTC)</label>
          <input
            type="number"
            min={0}
            step={25000}
            value={grossSalary || ''}
            onChange={(e) => setGrossSalary(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
          <span className="text-[11px] text-slate-500 font-mono">₹{grossSalary.toLocaleString('en-IN')} / year</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">Other Income (FD Interest, Freelance)</label>
          <input
            type="number"
            min={0}
            step={5000}
            value={otherIncome || ''}
            onChange={(e) => setOtherIncome(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
          <span className="text-[11px] text-slate-500 font-mono">₹{otherIncome.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Deductions (Old Regime Specific) */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Deductions & Exemptions (Applies to Old Tax Regime)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-slate-300 block mb-1">Section 80C (PPF, EPF, ELSS)</label>
            <input
              type="number"
              min={0}
              max={150000}
              value={sec80c || ''}
              onChange={(e) => setSec80c(Math.min(150000, Math.max(0, Number(e.target.value))))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm"
            />
            <span className="text-[10px] text-slate-500">Max ₹1,50,000</span>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">Section 80D (Health Insurance)</label>
            <input
              type="number"
              min={0}
              max={100000}
              value={sec80d || ''}
              onChange={(e) => setSec80d(Math.min(100000, Math.max(0, Number(e.target.value))))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm"
            />
            <span className="text-[10px] text-slate-500">Self + Parents</span>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">Sec 24b (Home Loan Interest)</label>
            <input
              type="number"
              min={0}
              max={200000}
              value={homeLoanInterest || ''}
              onChange={(e) => setHomeLoanInterest(Math.min(200000, Math.max(0, Number(e.target.value))))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm"
            />
            <span className="text-[10px] text-slate-500">Max ₹2,00,000</span>
          </div>
        </div>
      </div>

      {/* Calculate & Action */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setHasCalculated(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Compare Tax Regimes</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy Comparison'}</span>
        </button>
      </div>

      {/* Comparison Result Cards */}
      {hasCalculated && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>Recommended: Choose <strong className="text-white underline">{results.recommendation}</strong></span>
            </span>
            <span className="font-mono font-bold text-white bg-emerald-500/20 px-3 py-1 rounded-lg">
              Save ₹{results.taxSavings.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* New Regime Card */}
            <div className={`p-4 rounded-xl border ${results.recommendation === 'New Tax Regime' ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-500/10' : 'bg-slate-900/60 border-slate-800'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  New Tax Regime FY 2026-27
                </span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-mono">
                  Std Ded: ₹75,000
                </span>
              </div>
              <span className="text-3xl font-bold font-mono text-white block mt-1">
                ₹{results.totalNewTax.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 block mt-1">
                Taxable Income: ₹{results.newTaxableIncome.toLocaleString('en-IN')} (incl. 4% cess)
              </span>
            </div>

            {/* Old Regime Card */}
            <div className={`p-4 rounded-xl border ${results.recommendation === 'Old Tax Regime' ? 'bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-500/10' : 'bg-slate-900/60 border-slate-800'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Old Tax Regime
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  Std Ded: ₹50,000 + 80C
                </span>
              </div>
              <span className="text-3xl font-bold font-mono text-white block mt-1">
                ₹{results.totalOldTax.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 block mt-1">
                Taxable Income: ₹{results.oldTaxableIncome.toLocaleString('en-IN')} (incl. 4% cess)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3-Line FAQ */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frequently Asked Questions (Income Tax FY 2026-27)</span>
        </h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">1. What is the standard deduction in the New Tax Regime for FY 2026-27?</p>
            <p className="mt-0.5 text-slate-400">The standard deduction for salaried individuals under the New Tax Regime has been elevated to ₹75,000 (up from ₹50,000).</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">2. Up to what salary is income completely tax-free under New Regime?</p>
            <p className="mt-0.5 text-slate-400">With the ₹75,000 standard deduction and Section 87A full tax rebate on income up to ₹7,00,000, salaried individuals earning up to ₹7,75,000 pay zero income tax.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">3. When does Old Regime save more tax than New Regime?</p>
            <p className="mt-0.5 text-slate-400">Old Regime becomes advantageous only if total deductions (80C + 80D + Home Loan Interest 24b + HRA) exceed approximately ₹3.75 Lakhs to ₹4.25 Lakhs per year.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
