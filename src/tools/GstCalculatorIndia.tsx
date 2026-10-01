import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Percent, ArrowLeftRight } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function GstCalculatorIndia({ tool, onBack }: ToolComponentProps) {
  const [amount, setAmount] = useState<number>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [tradeType, setTradeType] = useState<'intra' | 'inter'>('intra');
  const [copied, setCopied] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  const results = useMemo(() => {
    let netAmount = 0;
    let gstAmount = 0;
    let grossAmount = 0;

    if (mode === 'exclusive') {
      netAmount = amount;
      gstAmount = (amount * gstRate) / 100;
      grossAmount = netAmount + gstAmount;
    } else {
      grossAmount = amount;
      netAmount = grossAmount / (1 + gstRate / 100);
      gstAmount = grossAmount - netAmount;
    }

    const cgst = tradeType === 'intra' ? gstAmount / 2 : 0;
    const sgst = tradeType === 'intra' ? gstAmount / 2 : 0;
    const igst = tradeType === 'inter' ? gstAmount : 0;

    return {
      netAmount: Math.round(netAmount * 100) / 100,
      gstAmount: Math.round(gstAmount * 100) / 100,
      grossAmount: Math.round(grossAmount * 100) / 100,
      cgst: Math.round(cgst * 100) / 100,
      sgst: Math.round(sgst * 100) / 100,
      igst: Math.round(igst * 100) / 100
    };
  }, [amount, gstRate, mode, tradeType]);

  const handleCopy = () => {
    const text = `GST Calculator India 2026 Summary:
Mode: ${mode === 'exclusive' ? 'GST Exclusive (Added)' : 'GST Inclusive (Extracted)'}
Base Net Amount: ₹${results.netAmount.toLocaleString('en-IN')}
GST Rate: ${gstRate}%
Total GST: ₹${results.gstAmount.toLocaleString('en-IN')} ${tradeType === 'intra' ? `(CGST: ₹${results.cgst.toLocaleString('en-IN')}, SGST: ₹${results.sgst.toLocaleString('en-IN')})` : `(IGST: ₹${results.igst.toLocaleString('en-IN')})`}
Total Invoice Price: ₹${results.grossAmount.toLocaleString('en-IN')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          GST Calculator India Inclusive Exclusive - Reverse Tax & Slab Rates
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Instant GST computation with reverse inclusive breakdown, intra-state CGST/SGST 50/50 splits, and interstate IGST.
        </p>
      </div>

      {/* Mode Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
          <span className="text-xs font-semibold text-slate-400 block">Calculation Type</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode('exclusive')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'exclusive'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              GST Exclusive (+ GST)
            </button>
            <button
              type="button"
              onClick={() => setMode('inclusive')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'inclusive'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              GST Inclusive (Reverse)
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
          <span className="text-xs font-semibold text-slate-400 block">Supply Region</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTradeType('intra')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tradeType === 'intra'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              Intra-State (CGST+SGST)
            </button>
            <button
              type="button"
              onClick={() => setTradeType('inter')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tradeType === 'inter'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              Inter-State (IGST)
            </button>
          </div>
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Amount */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">
              {mode === 'exclusive' ? 'Base Amount (Excl. Tax)' : 'Total Invoice Amount (Incl. Tax)'}
            </span>
            <span className="font-mono text-cyan-400 font-bold">₹{amount.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="number"
            min={0}
            step={100}
            value={amount || ''}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
          <div className="flex gap-1.5 flex-wrap pt-1">
            {[1000, 5000, 10000, 50000, 100000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset)}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 cursor-pointer"
              >
                ₹{preset.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* GST Slab Rates */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">GST Slab Rate (%)</span>
            <span className="font-mono text-cyan-400 font-bold">{gstRate}%</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {[3, 5, 12, 18, 28].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setGstRate(rate)}
                className={`py-2 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer ${
                  gstRate === rate
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
                }`}
              >
                {rate}%
              </button>
            ))}
          </div>
          <input
            type="number"
            min={0}
            max={50}
            step={0.1}
            value={gstRate || ''}
            onChange={(e) => setGstRate(Number(e.target.value))}
            placeholder="Custom GST %"
            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Calculate & Copy */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setHasCalculated(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Calculate GST Breakdown</span>
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

      {/* Results Cards */}
      {hasCalculated && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Net Amount (Pre-Tax)</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                ₹{results.netAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Base Value</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40">
              <span className="text-xs text-cyan-400 font-semibold block">Total GST ({gstRate}%)</span>
              <span className="text-2xl font-bold font-mono text-cyan-400 mt-1 block">
                ₹{results.gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {tradeType === 'intra'
                  ? `CGST: ₹${results.cgst.toLocaleString('en-IN')} | SGST: ₹${results.sgst.toLocaleString('en-IN')}`
                  : `IGST: ₹${results.igst.toLocaleString('en-IN')}`}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/40">
              <span className="text-xs text-emerald-300 font-semibold block">Gross Invoice Amount</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                ₹{results.grossAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Final Buyer Price</span>
            </div>
          </div>
        </div>
      )}

      {/* 3-Line FAQ */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frequently Asked Questions (GST India 2026)</span>
        </h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">1. How do you calculate GST from a GST-inclusive price?</p>
            <p className="mt-0.5 text-slate-400">Use reverse calculation: Net Amount = Total Price / (1 + GST% / 100), and GST Amount = Total Price - Net Amount.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">2. When do CGST + SGST apply instead of IGST?</p>
            <p className="mt-0.5 text-slate-400">Intra-state sales within the same state split GST equally into Central GST (CGST) and State GST (SGST); sales between two different states incur Integrated GST (IGST).</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">3. What are the active GST slabs in India?</p>
            <p className="mt-0.5 text-slate-400">Standard GST rates in India are 0% (essential foods), 5% (mass consumption), 12% (standard products), 18% (most services & goods), and 28% (luxury & demerit items).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
