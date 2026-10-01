import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Car, ShieldCheck } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function CarLoanEmiIndia({ tool, onBack }: ToolComponentProps) {
  const [onRoadPrice, setOnRoadPrice] = useState<number>(1000000);
  const [downPayment, setDownPayment] = useState<number>(200000);
  const [interestRate, setInterestRate] = useState<number>(8.75);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [copied, setCopied] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  const results = useMemo(() => {
    const loanAmount = Math.max(0, onRoadPrice - downPayment);
    const totalMonths = tenureYears * 12;
    const monthlyRate = interestRate / 100 / 12;

    let emi = 0;
    if (loanAmount > 0 && monthlyRate > 0) {
      emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else if (loanAmount > 0) {
      emi = loanAmount / totalMonths;
    }

    const totalInterest = emi * totalMonths - loanAmount;
    const totalCostOfCar = downPayment + loanAmount + totalInterest;

    return {
      loanAmount: Math.round(loanAmount),
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalCostOfCar: Math.round(totalCostOfCar),
      downPaymentPercent: Math.round((downPayment / onRoadPrice) * 100)
    };
  }, [onRoadPrice, downPayment, interestRate, tenureYears]);

  const handleCopy = () => {
    const text = `Car Loan EMI India 2026 Summary:
On-Road Car Price: ₹${onRoadPrice.toLocaleString('en-IN')}
Down Payment: ₹${downPayment.toLocaleString('en-IN')} (${results.downPaymentPercent}%)
Loan Principal: ₹${results.loanAmount.toLocaleString('en-IN')}
Interest Rate: ${interestRate}% p.a. | Tenure: ${tenureYears} Years
Monthly Car EMI: ₹${results.monthlyEmi.toLocaleString('en-IN')}/month
Total Interest Payable: ₹${results.totalInterest.toLocaleString('en-IN')}
Total Ownership Cost: ₹${results.totalCostOfCar.toLocaleString('en-IN')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Car Loan EMI Calculator India 2026 - Auto Loan Interest & Down Payment
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate monthly auto loan EMIs, on-road price financing, down payment adjustments, and total interest cost.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* On road price */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">On-Road Car Price</span>
            <span className="font-mono text-cyan-400 font-bold">₹{onRoadPrice.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="number"
            min={100000}
            step={25000}
            value={onRoadPrice || ''}
            onChange={(e) => setOnRoadPrice(Math.max(100000, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Down payment */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Down Payment</span>
            <span className="font-mono text-cyan-400 font-bold">₹{downPayment.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="number"
            min={0}
            step={10000}
            value={downPayment || ''}
            onChange={(e) => setDownPayment(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
          <span className="text-[11px] text-slate-500 font-mono">{results.downPaymentPercent}% of car value</span>
        </div>

        {/* Interest rate */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Interest Rate (% p.a.)</span>
            <span className="font-mono text-cyan-400 font-bold">{interestRate}%</span>
          </div>
          <input
            type="number"
            min={6}
            max={18}
            step={0.1}
            value={interestRate || ''}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
          <span className="text-[11px] text-slate-500">Typical auto loan: 8.5% - 9.5%</span>
        </div>

        {/* Tenure */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Loan Tenure</span>
            <span className="font-mono text-cyan-400 font-bold">{tenureYears} Years</span>
          </div>
          <select
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm focus:outline-none focus:border-cyan-500"
          >
            <option value={1}>1 Year (12 Months)</option>
            <option value={2}>2 Years (24 Months)</option>
            <option value={3}>3 Years (36 Months)</option>
            <option value={4}>4 Years (48 Months)</option>
            <option value={5}>5 Years (60 Months - Standard)</option>
            <option value={7}>7 Years (84 Months)</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setHasCalculated(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Car className="w-4 h-4" />
          <span>Calculate Car Loan EMI</span>
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
              <span className="text-xs text-cyan-400 font-semibold block">Monthly Car EMI</span>
              <span className="text-3xl font-bold font-mono text-white mt-1 block">
                ₹{results.monthlyEmi.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Per month for {tenureYears} yrs</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Financed Loan Amount</span>
              <span className="text-3xl font-bold font-mono text-white mt-1 block">
                ₹{results.loanAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Car price minus down payment</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Total Interest Payable</span>
              <span className="text-3xl font-bold font-mono text-emerald-400 mt-1 block">
                ₹{results.totalInterest.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Total borrowing charge</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/40">
              <span className="text-xs text-indigo-300 font-semibold block">Total Cost of Vehicle</span>
              <span className="text-3xl font-bold font-mono text-indigo-400 mt-1 block">
                ₹{results.totalCostOfCar.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Down Payment + EMI Payments</span>
            </div>
          </div>
        </div>
      )}

      {/* 3-Line FAQ */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frequently Asked Questions (Car Loan EMI India)</span>
        </h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">1. What is the recommended down payment for a car purchase in India?</p>
            <p className="mt-0.5 text-slate-400">Automotive financial planners recommend paying at least 20% down payment to buffer against rapid first-year vehicle depreciation.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">2. Can you obtain 100% on-road funding for brand new cars?</p>
            <p className="mt-0.5 text-slate-400">Several leading Indian banks extend 100% on-road funding (covering ex-showroom, RTO registration, and insurance) exclusively to prime salaried borrowers.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">3. Is a 7-year car loan tenure advisable?</p>
            <p className="mt-0.5 text-slate-400">While 7-year tenures produce smaller monthly payments, they dramatically raise cumulative interest and risk negative equity if you decide to sell the vehicle after 3 to 4 years.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
