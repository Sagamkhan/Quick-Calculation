import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Users, IndianRupee, Utensils, Receipt } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function TipCalculatorIndia({ tool, onBack }: ToolComponentProps) {
  const [billAmount, setBillAmount] = useState<number>(3200);
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [serviceChargePercent, setServiceChargePercent] = useState<number>(0);
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [copied, setCopied] = useState<boolean>(false);

  const results = useMemo(() => {
    const bill = Math.max(0, billAmount);
    const tip = (bill * Math.max(0, tipPercent)) / 100;
    const serviceCharge = (bill * Math.max(0, serviceChargePercent)) / 100;
    const totalBill = bill + tip + serviceCharge;
    const people = Math.max(1, peopleCount);
    const perPerson = totalBill / people;

    return {
      tipAmount: tip,
      serviceChargeAmount: serviceCharge,
      totalBill,
      perPerson,
      people
    };
  }, [billAmount, tipPercent, serviceChargePercent, peopleCount]);

  const handleCopy = () => {
    const text = `Restaurant Bill & Tip Breakdown:
Base Bill: ₹${billAmount.toLocaleString('en-IN')}
Tip (${tipPercent}%): ₹${results.tipAmount.toLocaleString('en-IN')}
Service Charge (${serviceChargePercent}%): ₹${results.serviceChargeAmount.toLocaleString('en-IN')}
Total Bill: ₹${results.totalBill.toLocaleString('en-IN')}
Per Person (${results.people} people): ₹${Math.round(results.perPerson).toLocaleString('en-IN')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Tip Calculator India - Restaurant Service Charge & Bill Splitter
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate dining gratuity, discretionary restaurant service charges, and individual split shares in Indian Rupees (INR).
        </p>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bill */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Base Food Bill</span>
            <span className="font-mono text-cyan-400 font-bold">₹{billAmount.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="number"
            min={0}
            step={100}
            value={billAmount || ''}
            onChange={(e) => setBillAmount(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Tip % */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Tip / Gratuity</span>
            <span className="font-mono text-emerald-400 font-bold">{tipPercent}%</span>
          </div>
          <div className="flex gap-1">
            {[0, 5, 10, 15].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setTipPercent(pct)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition ${
                  tipPercent === pct ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Service Charge % */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Service Charge</span>
            <span className="font-mono text-amber-400 font-bold">{serviceChargePercent}%</span>
          </div>
          <div className="flex gap-1">
            {[0, 5, 10].map((sc) => (
              <button
                key={sc}
                type="button"
                onClick={() => setServiceChargePercent(sc)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition ${
                  serviceChargePercent === sc ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400'
                }`}
              >
                {sc}%
              </button>
            ))}
          </div>
        </div>

        {/* Split People */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Number of Diners</span>
            <span className="font-mono text-purple-400 font-bold">{peopleCount} People</span>
          </div>
          <input
            type="number"
            min={1}
            max={50}
            value={peopleCount || ''}
            onChange={(e) => setPeopleCount(Math.max(1, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Total Tip Amount</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
            ₹{results.tipAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Service Charge</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1">
            ₹{results.serviceChargeAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Grand Total Bill</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
            ₹{results.totalBill.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/30 flex flex-col justify-between">
          <div>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-cyan-400" /> Share Per Person
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1">
              ₹{results.perPerson.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-2"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy Split'}
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
            <strong className="text-slate-300">Is tipping mandatory in Indian restaurants?</strong>
            <p className="mt-0.5">Tipping is entirely voluntary in India; a standard gratuity of 5% to 10% is customary for pleasant hospitality.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Is restaurant service charge legally enforceable in India?</strong>
            <p className="mt-0.5">Under Central Consumer Protection Authority (CCPA) guidelines, service charges are voluntary and customers may request their removal.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">How does GST apply to restaurant service charges?</strong>
            <p className="mt-0.5">If a restaurant levies a service charge, the 5% restaurant GST applies on the sum of both the food total and the service fee.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
