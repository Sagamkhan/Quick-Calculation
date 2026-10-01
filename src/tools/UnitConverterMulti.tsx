import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, ArrowLeftRight, Ruler, Scale, Thermometer } from 'lucide-react';
import { ToolComponentProps } from './registry';

// Length conversions to meters
const LENGTH_FACTORS: Record<string, number> = {
  m: 1,
  km: 1000,
  cm: 0.01,
  mm: 0.001,
  ft: 0.3048,
  in: 0.0254,
  yd: 0.9144,
  mi: 1609.344
};

const LENGTH_LABELS: Record<string, string> = {
  m: 'Meters (m)',
  km: 'Kilometers (km)',
  cm: 'Centimeters (cm)',
  mm: 'Millimeters (mm)',
  ft: 'Feet (ft)',
  in: 'Inches (in)',
  yd: 'Yards (yd)',
  mi: 'Miles (mi)'
};

// Weight conversions to grams
const WEIGHT_FACTORS: Record<string, number> = {
  kg: 1000,
  g: 1,
  mg: 0.001,
  tonne: 1000000,
  lb: 453.59237,
  oz: 28.34952
};

const WEIGHT_LABELS: Record<string, string> = {
  kg: 'Kilograms (kg)',
  g: 'Grams (g)',
  mg: 'Milligrams (mg)',
  tonne: 'Metric Tonnes (t)',
  lb: 'Pounds (lb)',
  oz: 'Ounces (oz)'
};

export default function UnitConverterMulti({ tool, onBack }: ToolComponentProps) {
  const [category, setCategory] = useState<'length' | 'weight' | 'temp'>('length');
  const [valInput, setValInput] = useState<number>(100);
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('ft');
  const [copied, setCopied] = useState<boolean>(false);

  // Switch category defaults
  const handleCategorySwitch = (cat: 'length' | 'weight' | 'temp') => {
    setCategory(cat);
    if (cat === 'length') {
      setFromUnit('m');
      setToUnit('ft');
      setValInput(100);
    } else if (cat === 'weight') {
      setFromUnit('kg');
      setToUnit('lb');
      setValInput(70);
    } else {
      setFromUnit('c');
      setToUnit('f');
      setValInput(37);
    }
  };

  const convertedValue = useMemo(() => {
    const val = Number(valInput) || 0;

    if (category === 'length') {
      const fromF = LENGTH_FACTORS[fromUnit] || 1;
      const toF = LENGTH_FACTORS[toUnit] || 1;
      const inMeters = val * fromF;
      return inMeters / toF;
    } else if (category === 'weight') {
      const fromF = WEIGHT_FACTORS[fromUnit] || 1;
      const toF = WEIGHT_FACTORS[toUnit] || 1;
      const inGrams = val * fromF;
      return inGrams / toF;
    } else {
      // Temperature
      let inCelsius = val;
      if (fromUnit === 'f') inCelsius = (val - 32) * (5 / 9);
      else if (fromUnit === 'k') inCelsius = val - 273.15;

      if (toUnit === 'c') return inCelsius;
      if (toUnit === 'f') return inCelsius * (9 / 5) + 32;
      if (toUnit === 'k') return inCelsius + 273.15;
      return inCelsius;
    }
  }, [category, valInput, fromUnit, toUnit]);

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${valInput} ${fromUnit.toUpperCase()} = ${convertedValue.toFixed(4)} ${toUnit.toUpperCase()}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Unit Converter Length, Weight & Temperature - All-in-One Metric & Imperial Engine
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Precision conversions across length (meters, feet, miles), weight (kilograms, pounds, ounces), and temperature (Celsius, Fahrenheit, Kelvin).
        </p>
      </div>

      {/* Category selector */}
      <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => handleCategorySwitch('length')}
          className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
            category === 'length' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Ruler className="w-4 h-4" /> Length
        </button>
        <button
          type="button"
          onClick={() => handleCategorySwitch('weight')}
          className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
            category === 'weight' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scale className="w-4 h-4" /> Weight & Mass
        </button>
        <button
          type="button"
          onClick={() => handleCategorySwitch('temp')}
          className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
            category === 'temp' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Thermometer className="w-4 h-4" /> Temperature
        </button>
      </div>

      {/* Converter Inputs */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
          {/* From Value & Unit */}
          <div className="sm:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-slate-300">From Value</label>
            <input
              type="number"
              value={valInput}
              onChange={(e) => setValInput(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {category === 'length' && Object.keys(LENGTH_LABELS).map((k) => <option key={k} value={k}>{LENGTH_LABELS[k]}</option>)}
              {category === 'weight' && Object.keys(WEIGHT_LABELS).map((k) => <option key={k} value={k}>{WEIGHT_LABELS[k]}</option>)}
              {category === 'temp' && (
                <>
                  <option value="c">Celsius (°C)</option>
                  <option value="f">Fahrenheit (°F)</option>
                  <option value="k">Kelvin (K)</option>
                </>
              )}
            </select>
          </div>

          {/* Swap */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSwap}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700/80 transition"
              title="Swap Units"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* To Value & Unit */}
          <div className="sm:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-slate-300">Converted Result</label>
            <input
              readOnly
              type="text"
              value={convertedValue.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-cyan-500/40 font-mono text-base text-cyan-300 focus:outline-none"
            />
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {category === 'length' && Object.keys(LENGTH_LABELS).map((k) => <option key={k} value={k}>{LENGTH_LABELS[k]}</option>)}
              {category === 'weight' && Object.keys(WEIGHT_LABELS).map((k) => <option key={k} value={k}>{WEIGHT_LABELS[k]}</option>)}
              {category === 'temp' && (
                <>
                  <option value="c">Celsius (°C)</option>
                  <option value="f">Fahrenheit (°F)</option>
                  <option value="k">Kelvin (K)</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Result'}
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
            <strong className="text-slate-300">How do you convert Celsius to Fahrenheit accurately?</strong>
            <p className="mt-0.5">Multiply the Celsius temperature by 9/5 (or 1.8) and then add 32: `°F = (°C × 1.8) + 32`.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">How many pounds are in one kilogram?</strong>
            <p className="mt-0.5">One kilogram equals exactly 2.20462 pounds according to International Metric standards.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">What is the exact definition of Absolute Zero in Kelvin?</strong>
            <p className="mt-0.5">Zero Kelvin (0 K) is absolute zero, corresponding to -273.15° Celsius or -459.67° Fahrenheit.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
