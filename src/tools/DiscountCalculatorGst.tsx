import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Tag, Percent, IndianRupee, ShieldCheck } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function DiscountCalculatorGst({ tool, onBack }: ToolComponentProps) {
  const [originalPrice, setOriginalPrice] = useState<number>(5000);
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>('percent');
  const [discountValue, setDiscountValue] = useState<number>(20);
  const [gstRate, setGstRate] = useState<number>(18);
  const [copied, setCopied] = useState<boolean>(false);

  const results = useMemo(() => {
    const orig = Math.max(0, originalPrice);
    let discountAmount = 0;

    if (discountType === 'percent') {
      discountAmount = (orig * Math.min(100, Math.max(0, discountValue))) / 100;
    } else {
      discountAmount = Math.min(orig, Math.max(0, discountValue));
    }

    const priceAfterDiscount = Math.max(0, orig - discountAmount);
    const gstAmount = (priceAfterDiscount * gstRate) / 100;
    const finalPayable = priceAfterDiscount + gstAmount;

    return {
      discountAmount,
      priceAfterDiscount,
      gstAmount,
      cgst: gstAmount / 2,
      sgst: gstAmount / 2,
      finalPayable,
      effectiveSavings: Math.max(0, orig - finalPayable)
    };
  }, [originalPrice, discountType, discountValue, gstRate]);

  const handleCopy = () => {
    const text = `Discount & GST India Summary:
Original MRP: ₹${originalPrice.toLocaleString('en-IN')}
Discount Savings: -₹${results.discountAmount.toLocaleString('en-IN')} (${discountType === 'percent' ? `${discountValue}%` : 'Flat'})
Price After Discount: ₹${results.priceAfterDiscount.toLocaleString('en-IN')}
GST (${gstRate}%): +₹${results.gstAmount.toLocaleString('en-IN')} (CGST: ₹${results.cgst.toLocaleString('en-IN')} | SGST: ₹${results.sgst.toLocaleString('en-IN')})
Final Payable Amount: ₹${results.finalPayable.toLocaleString('en-IN')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Discount Calculator with GST India - Sale Price & Tax Breakdown
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate retail discounts, net sale amounts, and applicable Indian GST tax additions (CGST + SGST) for billing and shopping.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Original Price */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Original MRP / Price</span>
            <span className="font-mono text-cyan-400 font-bold">₹{originalPrice.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="number"
            min={0}
            step={100}
            value={originalPrice || ''}
            onChange={(e) => setOriginalPrice(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Discount Value */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800">
              <button
                type="button"
                onClick={() => setDiscountType('percent')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${discountType === 'percent' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'}`}
              >
                % Off
              </button>
              <button
                type="button"
                onClick={() => setDiscountType('flat')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${discountType === 'flat' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'}`}
              >
                ₹ Flat
              </button>
            </div>
            <span className="font-mono text-emerald-400 font-bold">
              {discountType === 'percent' ? `${discountValue}%` : `₹${discountValue}`}
            </span>
          </div>
          <input
            type="number"
            min={0}
            max={discountType === 'percent' ? 100 : originalPrice}
            value={discountValue || ''}
            onChange={(e) => setDiscountValue(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* GST Slab */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">GST Slab Rate</span>
            <span className="font-mono text-amber-400 font-bold">{gstRate}% GST</span>
          </div>
          <select
            value={gstRate}
            onChange={(e) => setGstRate(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:outline-none focus:border-cyan-500"
          >
            <option value={0}>0% (Exempt)</option>
            <option value={5}>5% (Essential Goods)</option>
            <option value={12}>12% (Standard Tier 1)</option>
            <option value={18}>18% (Standard Tier 2 / Services)</option>
            <option value={28}>28% (Luxury / Automobiles)</option>
          </select>
        </div>
      </div>

      {/* Result Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Discount Savings</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
            -₹{results.discountAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Price After Discount</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
            ₹{results.priceAfterDiscount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">GST Amount ({gstRate}%)</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1">
            +₹{results.gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            CGST: ₹{results.cgst.toFixed(2)} | SGST: ₹{results.sgst.toFixed(2)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/30 flex flex-col justify-between">
          <span className="text-xs text-slate-400">Final Invoice Payable</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1">
            ₹{results.finalPayable.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 self-start font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Summary'}
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
            <strong className="text-slate-300">Is GST calculated before or after applying discounts?</strong>
            <p className="mt-0.5">Under Indian GST law, trade discounts are deducted from the transaction value before computing GST on the taxable net subtotal.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">How is the GST split between central and state governments?</strong>
            <p className="mt-0.5">For intra-state commerce, GST is divided equally: 50% as Central GST (CGST) and 50% as State GST (SGST).</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">What are the active standard GST tax slabs in India?</strong>
            <p className="mt-0.5">India operates four primary standard slabs (5%, 12%, 18%, and 28%) plus a 0% exempt category for essential staples.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
