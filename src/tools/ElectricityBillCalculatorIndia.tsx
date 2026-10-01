import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Zap, IndianRupee, Layers, ShieldCheck } from 'lucide-react';
import { ToolComponentProps } from './registry';

interface SlabTier {
  limit: number;
  rate: number;
}

const STATE_PRESETS: { name: string; slabs: SlabTier[]; fixedCharge: number; dutyPct: number }[] = [
  {
    name: 'Standard Indian Metros (Average)',
    slabs: [
      { limit: 100, rate: 3.5 },
      { limit: 200, rate: 5.5 },
      { limit: 400, rate: 7.5 },
      { limit: Infinity, rate: 9.5 }
    ],
    fixedCharge: 120,
    dutyPct: 9
  },
  {
    name: 'Maharashtra (MSEDCL Residential)',
    slabs: [
      { limit: 100, rate: 4.71 },
      { limit: 300, rate: 8.87 },
      { limit: 500, rate: 12.18 },
      { limit: Infinity, rate: 13.91 }
    ],
    fixedCharge: 138,
    dutyPct: 16
  },
  {
    name: 'Delhi (BSES Domestic with Subsidy)',
    slabs: [
      { limit: 200, rate: 3.0 },
      { limit: 400, rate: 4.5 },
      { limit: 800, rate: 6.5 },
      { limit: Infinity, rate: 8.0 }
    ],
    fixedCharge: 100,
    dutyPct: 5
  },
  {
    name: 'Karnataka (BESCOM Bangalore)',
    slabs: [
      { limit: 50, rate: 4.15 },
      { limit: 100, rate: 5.6 },
      { limit: 200, rate: 7.15 },
      { limit: Infinity, rate: 8.2 }
    ],
    fixedCharge: 110,
    dutyPct: 9
  }
];

export default function ElectricityBillCalculatorIndia({ tool, onBack }: ToolComponentProps) {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [unitsConsumed, setUnitsConsumed] = useState<number>(280);
  const [copied, setCopied] = useState<boolean>(false);

  const currentPreset = STATE_PRESETS[selectedPresetIndex];

  const billBreakdown = useMemo(() => {
    let unitsLeft = Math.max(0, unitsConsumed);
    let energyCharges = 0;
    let prevLimit = 0;
    const slabDetails: { slabRange: string; units: number; rate: number; amount: number }[] = [];

    for (const slab of currentPreset.slabs) {
      const slabCapacity = slab.limit === Infinity ? unitsLeft : slab.limit - prevLimit;
      const consumedInSlab = Math.min(unitsLeft, slabCapacity);

      if (consumedInSlab > 0) {
        const amount = consumedInSlab * slab.rate;
        energyCharges += amount;
        const rangeText = slab.limit === Infinity ? `>${prevLimit} units` : `${prevLimit + 1} - ${slab.limit} units`;
        slabDetails.push({
          slabRange: rangeText,
          units: consumedInSlab,
          rate: slab.rate,
          amount
        });
        unitsLeft -= consumedInSlab;
      }
      prevLimit = slab.limit;
      if (unitsLeft <= 0) break;
    }

    const fixedCharges = currentPreset.fixedCharge;
    const dutyAmount = ((energyCharges + fixedCharges) * currentPreset.dutyPct) / 100;
    const totalPayable = energyCharges + fixedCharges + dutyAmount;

    return {
      energyCharges,
      fixedCharges,
      dutyAmount,
      totalPayable,
      slabDetails
    };
  }, [unitsConsumed, currentPreset]);

  const handleCopy = () => {
    const text = `Electricity Bill India Breakdown (${currentPreset.name}):
Units Consumed: ${unitsConsumed} kWh
Energy Charges: ₹${Math.round(billBreakdown.energyCharges).toLocaleString('en-IN')}
Fixed Demand Meter Charge: ₹${currentPreset.fixedCharge}
Electricity Duty (${currentPreset.dutyPct}%): ₹${Math.round(billBreakdown.dutyAmount).toLocaleString('en-IN')}
Total Bill Payable: ₹${Math.round(billBreakdown.totalPayable).toLocaleString('en-IN')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Electricity Bill Calculator India - State Slab Tariff & Power Consumption Engine
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate monthly power utility bills with multi-tier consumption slabs, fixed meter demand charges, and state electricity duties.
        </p>
      </div>

      {/* Preset and Units Input */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Select State Tariff Model</label>
            <select
              value={selectedPresetIndex}
              onChange={(e) => setSelectedPresetIndex(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {STATE_PRESETS.map((p, idx) => (
                <option key={p.name} value={idx}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-300">
              <span className="font-semibold">Units Consumed (kWh)</span>
              <span className="font-mono text-cyan-400 font-bold">{unitsConsumed} Units</span>
            </div>
            <input
              type="number"
              min={0}
              step={10}
              value={unitsConsumed || ''}
              onChange={(e) => setUnitsConsumed(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Quick Unit Presets */}
        <div className="flex flex-wrap gap-2 text-xs pt-1 border-t border-slate-800">
          <span className="text-slate-400 font-semibold self-center">Typical Households:</span>
          {[100, 150, 250, 350, 500, 800].map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnitsConsumed(u)}
              className={`px-2.5 py-1 rounded font-mono transition ${
                unitsConsumed === u ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {u} kWh
            </button>
          ))}
        </div>
      </div>

      {/* Bill Results Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Energy Consumption</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
            ₹{Math.round(billBreakdown.energyCharges).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Fixed Demand Charge</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-purple-400 mt-1">
            ₹{currentPreset.fixedCharge}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Electricity Tax / Duty</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1">
            ₹{Math.round(billBreakdown.dutyAmount).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/30 flex flex-col justify-between">
          <span className="text-xs text-slate-400">Total Net Bill Payable</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1">
            ₹{Math.round(billBreakdown.totalPayable).toLocaleString('en-IN')}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-2"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy Invoice'}
          </button>
        </div>
      </div>

      {/* Slab breakdown table */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-cyan-400" /> Telescopic Slab Charges Detail
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2 px-3">Consumption Tier</th>
                <th className="py-2 px-3 text-center">Billed Units</th>
                <th className="py-2 px-3 text-right">Tariff Rate (₹/kWh)</th>
                <th className="py-2 px-3 text-right">Subtotal Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {billBreakdown.slabDetails.map((slab, i) => (
                <tr key={i} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-semibold text-white">{slab.slabRange}</td>
                  <td className="py-2.5 px-3 text-center text-cyan-300 font-bold">{slab.units} kWh</td>
                  <td className="py-2.5 px-3 text-right">₹{slab.rate.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                    ₹{slab.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3-Line FAQ */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-cyan-400" /> Frequently Asked Questions
        </h4>
        <div className="space-y-2 text-xs text-slate-400 divide-y divide-slate-800/80">
          <div className="pt-2">
            <strong className="text-slate-300">What is a telescopic electricity tariff slab in India?</strong>
            <p className="mt-0.5">Telescopic billing charges each successive block of units at higher incremental rates so lower consumption is rewarded with lower per-unit tariffs.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">What does 1 Unit of electricity measure on a digital meter?</strong>
            <p className="mt-0.5">One electrical unit equals 1 kilowatt-hour (kWh), which powers a 1,000-watt appliance continuously for exactly one hour.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Why are fixed charges added to domestic electricity bills?</strong>
            <p className="mt-0.5">Discom utilities levy fixed demand charges per connected load (kW) to cover power grid infrastructure maintenance and meter upkeep.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
