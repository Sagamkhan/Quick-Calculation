import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, CreditCard, ShieldCheck } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function PersonalLoanEmi({ tool, onBack }: ToolComponentProps) {
  const [loanAmount, setLoanAmount] = useState<number>(300000);
  const [interestRate, setInterestRate] = useState<number>(12.5);
  const [tenureMonths, setTenureMonths] = useState<number>(36);
  const [processingFeePercent, setProcessingFeePercent] = useState<number>(1.5);
  const [copied, setCopied] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  const results = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12;
    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - loanAmount;

    // Upfront processing fee + 18% GST on processing fee
    const rawFee = (loanAmount * processingFeePercent) / 100;
    const gstOnFee = rawFee * 0.18;
    const totalProcessingFee = rawFee + gstOnFee;

    const totalCostOfLoan = totalPayment + totalProcessingFee;

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      totalProcessingFee: Math.round(totalProcessingFee),
      totalCostOfLoan: Math.round(totalCostOfLoan),
      tenureYears: (tenureMonths / 12).toFixed(1)
    };
  }, [loanAmount, interestRate, tenureMonths, processingFeePercent]);

  const handleCopy = () => {
    const text = `Personal Loan EMI Summary:
Loan Amount: ₹${loanAmount.toLocaleString('en-IN')}
Interest Rate: ${interestRate}% p.a. | Tenure: ${tenureMonths} Months (${results.tenureYears} Yrs)
Monthly EMI: ₹${results.monthlyEmi.toLocaleString('en-IN')}
Total Interest Payable: ₹${results.totalInterest.toLocaleString('en-IN')}
Processing Fee (incl. 18% GST): ₹${results.totalProcessingFee.toLocaleString('en-IN')}
Total Repayment Cost: ₹${results.totalCostOfLoan.toLocaleString('en-IN')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Personal Loan EMI Calculator India 2026 - Monthly Installment & Interest
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate monthly personal loan payments on a reducing balance basis, factoring in bank processing fees and 18% GST.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Loan Amount */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Loan Amount</span>
            <span className="font-mono text-cyan-400 font-bold">₹{loanAmount.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="number"
            min={10000}
            max={4000000}
            step={10000}
            value={loanAmount || ''}
            onChange={(e) => setLoanAmount(Math.max(10000, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
          <input
            type="range"
            min={20000}
            max={2000000}
            step={20000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Interest Rate */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Interest Rate (% p.a.)</span>
            <span className="font-mono text-cyan-400 font-bold">{interestRate}%</span>
          </div>
          <input
            type="number"
            min={9}
            max={36}
            step={0.25}
            value={interestRate || ''}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
          <input
            type="range"
            min={9.5}
            max={24}
            step={0.25}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Tenure Months */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Tenure (Months)</span>
            <span className="font-mono text-cyan-400 font-bold">{tenureMonths} Mos ({results.tenureYears} Yrs)</span>
          </div>
          <select
            value={tenureMonths}
            onChange={(e) => setTenureMonths(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm focus:outline-none focus:border-cyan-500"
          >
            <option value={12}>12 Months (1 Year)</option>
            <option value={24}>24 Months (2 Years)</option>
            <option value={36}>36 Months (3 Years)</option>
            <option value={48}>48 Months (4 Years)</option>
            <option value={60}>60 Months (5 Years)</option>
          </select>
        </div>

        {/* Processing fee % */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Processing Fee (%)</span>
            <span className="font-mono text-cyan-400 font-bold">{processingFeePercent}%</span>
          </div>
          <input
            type="number"
            min={0}
            max={5}
            step={0.25}
            value={processingFeePercent}
            onChange={(e) => setProcessingFeePercent(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
          <span className="text-[11px] text-slate-500">+18% GST levied on fee</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setHasCalculated(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 transition-all"
        >
          <CreditCard className="w-4 h-4" />
          <span>Calculate Personal Loan EMI</span>
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
            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40">
              <span className="text-xs text-cyan-400 font-semibold block">Monthly EMI</span>
              <span className="text-3xl font-bold font-mono text-white mt-1 block">
                ₹{results.monthlyEmi.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Due each month</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Total Interest Payable</span>
              <span className="text-3xl font-bold font-mono text-white mt-1 block">
                ₹{results.totalInterest.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Borrowing cost</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Processing Fee (incl. GST)</span>
              <span className="text-3xl font-bold font-mono text-white mt-1 block">
                ₹{results.totalProcessingFee.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Deducted from disbursal</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/40">
              <span className="text-xs text-indigo-300 font-semibold block">Total Cost of Loan</span>
              <span className="text-3xl font-bold font-mono text-indigo-400 mt-1 block">
                ₹{results.totalCostOfLoan.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Principal + Interest + Fee</span>
            </div>
          </div>
        </div>
      )}

      {/* 3-Line FAQ */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frequently Asked Questions (Personal Loan EMI)</span>
        </h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">1. What CIBIL score is required for the best personal loan interest rates?</p>
            <p className="mt-0.5 text-slate-400">A CIBIL credit score of 750 or higher qualifies you for prime personal loan interest rates (typically 10.5%–12.5% p.a.).</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">2. What is the difference between a flat interest rate and a reducing balance rate?</p>
            <p className="mt-0.5 text-slate-400">A reducing balance rate calculates interest only on the remaining unpaid principal each month, whereas a flat rate charges interest on the full original principal for the entire loan life.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">3. Can you foreclose a personal loan early in India?</p>
            <p className="mt-0.5 text-slate-400">Most commercial banks allow full foreclosure after paying 6 to 12 regular monthly EMIs, with prepayment penalty fees usually ranging from 2% to 4% + GST.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
