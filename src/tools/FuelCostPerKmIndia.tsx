import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Fuel, Gauge, IndianRupee, Car } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function FuelCostPerKmIndia({ tool, onBack }: ToolComponentProps) {
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel' | 'cng' | 'ev'>('petrol');
  const [fuelPrice, setFuelPrice] = useState<number>(104); // ₹/L in Mumbai/Delhi
  const [mileage, setMileage] = useState<number>(16); // km/L
  const [monthlyKm, setMonthlyKm] = useState<number>(1200); // km/month
  const [tripKm, setTripKm] = useState<number>(250);
  const [copied, setCopied] = useState<boolean>(false);

  const handleFuelSelect = (type: 'petrol' | 'diesel' | 'cng' | 'ev') => {
    setFuelType(type);
    if (type === 'petrol') {
      setFuelPrice(104);
      setMileage(16);
    } else if (type === 'diesel') {
      setFuelPrice(92);
      setMileage(20);
    } else if (type === 'cng') {
      setFuelPrice(78);
      setMileage(24);
    } else {
      setFuelPrice(8); // ₹/unit electricity
      setMileage(7); // km/unit
    }
  };

  const results = useMemo(() => {
    const costPerKm = mileage > 0 ? fuelPrice / mileage : 0;
    const tripCost = costPerKm * tripKm;
    const monthlyCost = costPerKm * monthlyKm;
    const annualCost = monthlyCost * 12;

    return {
      costPerKm,
      tripCost,
      monthlyCost,
      annualCost
    };
  }, [fuelPrice, mileage, tripKm, monthlyKm]);

  const handleCopy = () => {
    const text = `Fuel Cost India Summary (${fuelType.toUpperCase()}):
Fuel Rate: ₹${fuelPrice}/${fuelType === 'ev' ? 'kWh' : fuelType === 'cng' ? 'kg' : 'L'} | Mileage: ${mileage} km/${fuelType === 'ev' ? 'kWh' : fuelType === 'cng' ? 'kg' : 'L'}
Running Cost per KM: ₹${results.costPerKm.toFixed(2)}/km
Trip Cost (${tripKm} km): ₹${Math.round(results.tripCost).toLocaleString('en-IN')}
Monthly Fuel Budget (${monthlyKm} km): ₹${Math.round(results.monthlyCost).toLocaleString('en-IN')}
Annual Fuel Cost: ₹${Math.round(results.annualCost).toLocaleString('en-IN')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Fuel Cost per Km Calculator India - Petrol, Diesel & CNG Running Cost
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate vehicle running expenditure per kilometer, single road trip fuel requirements, and monthly commuting budgets across India.
        </p>
      </div>

      {/* Fuel Type selector */}
      <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
        {(['petrol', 'diesel', 'cng', 'ev'] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => handleFuelSelect(type)}
            className={`flex-1 py-2 rounded-lg font-bold uppercase transition ${
              fuelType === type ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Fuel Price</span>
            <span className="font-mono text-cyan-400 font-bold">
              ₹{fuelPrice}/{fuelType === 'ev' ? 'Unit' : fuelType === 'cng' ? 'kg' : 'L'}
            </span>
          </div>
          <input
            type="number"
            step={0.5}
            value={fuelPrice || ''}
            onChange={(e) => setFuelPrice(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Vehicle Mileage</span>
            <span className="font-mono text-emerald-400 font-bold">
              {mileage} km/{fuelType === 'ev' ? 'Unit' : fuelType === 'cng' ? 'kg' : 'L'}
            </span>
          </div>
          <input
            type="number"
            step={0.5}
            value={mileage || ''}
            onChange={(e) => setMileage(Math.max(0.1, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Monthly Commute</span>
            <span className="font-mono text-purple-400 font-bold">{monthlyKm} km</span>
          </div>
          <input
            type="number"
            step={50}
            value={monthlyKm || ''}
            onChange={(e) => setMonthlyKm(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Road Trip Distance</span>
            <span className="font-mono text-amber-400 font-bold">{tripKm} km</span>
          </div>
          <input
            type="number"
            step={25}
            value={tripKm || ''}
            onChange={(e) => setTripKm(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/30">
          <span className="text-xs text-slate-400">Running Cost per Km</span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 mt-1">
            ₹{results.costPerKm.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Direct fuel cost per 1 km</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Single Trip Cost ({tripKm} km)</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
            ₹{Math.round(results.tripCost).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Monthly Fuel Budget</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
            ₹{Math.round(results.monthlyCost).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 flex flex-col justify-between">
          <span className="text-xs text-slate-400">Annual Fuel Cost</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1">
            ₹{Math.round(results.annualCost).toLocaleString('en-IN')}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-2"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
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
            <strong className="text-slate-300">How is vehicle running cost per kilometer calculated?</strong>
            <p className="mt-0.5">Divide the current fuel price per liter (or kg) by your car or bike's observed fuel efficiency mileage (`Price ÷ Mileage = ₹/km`).</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">How does CNG compare financially with Petrol in Indian metros?</strong>
            <p className="mt-0.5">CNG typically reduces running costs by 45% to 60% compared to petrol, delivering substantial savings for high-mileage commuters.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">What is the average running cost of an Electric Vehicle (EV) in India?</strong>
            <p className="mt-0.5">EVs usually cost around ₹1.00 to ₹1.50 per km for cars and under ₹0.40 per km for electric two-wheelers on domestic tariffs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
