import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Wallet, TrendingUp, ShieldCheck } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function NetWorthCalculator({ tool, onBack }: ToolComponentProps) {
  // Assets
  const [cashBank, setCashBank] = useState<number>(300000);
  const [investments, setInvestments] = useState<number>(1200000);
  const [realEstate, setRealEstate] = useState<number>(4500000);
  const [vehicles, setVehicles] = useState<number>(600000);
  const [goldOther, setGoldOther] = useState<number>(400000);

  // Liabilities
  const [homeMortgage, setHomeMortgage] = useState<number>(2500000);
  const [autoLoan, setAutoLoan] = useState<number>(350000);
  const [creditCardDebt, setCreditCardDebt] = useState<number>(45000);
  const [personalLoan, setPersonalLoan] = useState<number>(100000);

  const [copied, setCopied] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  const results = useMemo(() => {
    const totalAssets = cashBank + investments + realEstate + vehicles + goldOther;
    const totalLiabilities = homeMortgage + autoLoan + creditCardDebt + personalLoan;
    const netWorth = totalAssets - totalLiabilities;
    const debtRatio = totalAssets > 0 ? Math.round((totalLiabilities / totalAssets) * 100) : 0;

    let healthStatus = 'Strong Balance Sheet';
    let statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (netWorth < 0) {
      healthStatus = 'Negative Net Worth (Action Required)';
      statusColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    } else if (debtRatio > 60) {
      healthStatus = 'High Leverage (Over 60% Debt)';
      statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    } else if (debtRatio <= 30) {
      healthStatus = 'Exceptional Financial Health';
      statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }

    return {
      totalAssets,
      totalLiabilities,
      netWorth,
      debtRatio,
      healthStatus,
      statusColor
    };
  }, [cashBank, investments, realEstate, vehicles, goldOther, homeMortgage, autoLoan, creditCardDebt, personalLoan]);

  const handleCopy = () => {
    const text = `Personal Net Worth Summary:
Total Assets: ₹${results.totalAssets.toLocaleString('en-IN')}
Total Liabilities: ₹${results.totalLiabilities.toLocaleString('en-IN')}
Total Net Worth: ₹${results.netWorth.toLocaleString('en-IN')}
Debt-to-Asset Ratio: ${results.debtRatio}% (${results.healthStatus})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Net Worth Calculator - Personal Assets & Liabilities Financial Health
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate your true financial net worth by auditing liquid savings, investments, real estate equity, and personal debt obligations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assets Section */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              What You Own (Assets)
            </span>
            <span className="font-mono text-emerald-400 font-bold text-sm">
              ₹{(cashBank + investments + realEstate + vehicles + goldOther).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <label className="text-[11px] text-slate-300 block mb-0.5">Cash, Savings & Emergency Funds (₹)</label>
              <input
                type="number"
                min={0}
                value={cashBank || ''}
                onChange={(e) => setCashBank(Math.max(0, Number(e.target.value)))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-0.5">Investments (Stocks, Mutual Funds, PF, NPS) (₹)</label>
              <input
                type="number"
                min={0}
                value={investments || ''}
                onChange={(e) => setInvestments(Math.max(0, Number(e.target.value)))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-0.5">Real Estate (Market Property Value) (₹)</label>
              <input
                type="number"
                min={0}
                value={realEstate || ''}
                onChange={(e) => setRealEstate(Math.max(0, Number(e.target.value)))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-0.5">Vehicles (Depreciated Resale Value) (₹)</label>
              <input
                type="number"
                min={0}
                value={vehicles || ''}
                onChange={(e) => setVehicles(Math.max(0, Number(e.target.value)))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-0.5">Physical Gold, Jewelry & Other Valuables (₹)</label>
              <input
                type="number"
                min={0}
                value={goldOther || ''}
                onChange={(e) => setGoldOther(Math.max(0, Number(e.target.value)))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm"
              />
            </div>
          </div>
        </div>

        {/* Liabilities Section */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-rose-500/30 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
              What You Owe (Liabilities)
            </span>
            <span className="font-mono text-rose-400 font-bold text-sm">
              ₹{(homeMortgage + autoLoan + creditCardDebt + personalLoan).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <label className="text-[11px] text-slate-300 block mb-0.5">Home Loan Principal Outstanding (₹)</label>
              <input
                type="number"
                min={0}
                value={homeMortgage || ''}
                onChange={(e) => setHomeMortgage(Math.max(0, Number(e.target.value)))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-0.5">Car / Two-Wheeler Loans (₹)</label>
              <input
                type="number"
                min={0}
                value={autoLoan || ''}
                onChange={(e) => setAutoLoan(Math.max(0, Number(e.target.value)))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-0.5">Credit Card Outstanding Balances (₹)</label>
              <input
                type="number"
                min={0}
                value={creditCardDebt || ''}
                onChange={(e) => setCreditCardDebt(Math.max(0, Number(e.target.value)))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 block mb-0.5">Personal & Student Loans (₹)</label>
              <input
                type="number"
                min={0}
                value={personalLoan || ''}
                onChange={(e) => setPersonalLoan(Math.max(0, Number(e.target.value)))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setHasCalculated(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Wallet className="w-4 h-4" />
          <span>Calculate Total Net Worth</span>
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
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/40">
              <span className="text-xs text-emerald-300 font-semibold block">Total Net Worth</span>
              <span className="text-3xl font-bold font-mono text-white mt-1 block">
                ₹{results.netWorth.toLocaleString('en-IN')}
              </span>
              <span className={`inline-block mt-2 px-2.5 py-0.5 rounded text-xs font-bold border ${results.statusColor}`}>
                {results.healthStatus}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Total Assets</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                ₹{results.totalAssets.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Gross holdings</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Debt-to-Asset Ratio</span>
              <span className="text-2xl font-bold font-mono text-cyan-400 mt-1 block">
                {results.debtRatio}%
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Liabilities: ₹{results.totalLiabilities.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}

      {/* 3-Line FAQ */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frequently Asked Questions (Net Worth Calculator)</span>
        </h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">1. What is the fundamental formula for calculating personal net worth?</p>
            <p className="mt-0.5 text-slate-400">Personal Net Worth equals the sum of all your tangible and financial assets minus all outstanding personal liabilities and debt claims.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">2. Should personal cars be included at original purchase price or current market value?</p>
            <p className="mt-0.5 text-slate-400">Vehicles must always be entered at their current fair resale market value (depreciated) rather than their original invoice sticker price.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">3. What is considered a healthy Debt-to-Asset ratio?</p>
            <p className="mt-0.5 text-slate-400">A Debt-to-Asset ratio below 30% indicates excellent financial health, while ratios above 60% indicate excessive leverage and vulnerability to interest rate spikes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
