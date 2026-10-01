import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Scale, Heart } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function IdealWeightIndianChart({ tool, onBack }: ToolComponentProps) {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState<number>(170);
  const [currentWeightKg, setCurrentWeightKg] = useState<number>(68);
  const [frameSize, setFrameSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [copied, setCopied] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  const results = useMemo(() => {
    const heightM = heightCm / 100;
    const heightInches = heightCm / 2.54;

    // ICMR / Asian-Indian Specific BMI Healthy Range (18.5 - 22.9 kg/m2)
    // Note: Western BMI uses 18.5 - 24.9
    const icmrMinKg = Math.round(18.5 * heightM * heightM * 10) / 10;
    const icmrMaxKg = Math.round(22.9 * heightM * heightM * 10) / 10;

    // Devine formula for IBW
    let devineKg = 0;
    if (gender === 'male') {
      devineKg = 50 + 2.3 * (heightInches - 60);
    } else {
      devineKg = 45.5 + 2.3 * (heightInches - 60);
    }

    // Adjust for frame size
    if (frameSize === 'small') devineKg *= 0.9;
    if (frameSize === 'large') devineKg *= 1.1;

    devineKg = Math.round(devineKg * 10) / 10;

    const currentBmi = Math.round((currentWeightKg / (heightM * heightM)) * 10) / 10;
    let status = 'Normal Weight';
    let statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

    if (currentBmi < 18.5) {
      status = 'Underweight (<18.5)';
      statusColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    } else if (currentBmi <= 22.9) {
      status = 'Optimal Indian Range (18.5–22.9)';
      statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    } else if (currentBmi <= 24.9) {
      status = 'Overweight for Asian Indians (23–24.9)';
      statusColor = 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    } else {
      status = 'Obese for Asian Indians (≥25.0)';
      statusColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }

    return {
      icmrMinKg,
      icmrMaxKg,
      devineKg,
      currentBmi,
      status,
      statusColor
    };
  }, [gender, heightCm, currentWeightKg, frameSize]);

  const handleCopy = () => {
    const text = `Ideal Weight Indian Chart Summary:
Gender: ${gender} | Height: ${heightCm}cm | Current: ${currentWeightKg}kg (BMI ${results.currentBmi})
Status: ${results.status}
ICMR Healthy Indian Weight Range: ${results.icmrMinKg} kg – ${results.icmrMaxKg} kg
Devine Ideal Body Weight: ${results.devineKg} kg`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Ideal Weight Calculator Indian Chart 2026 - BMI & Frame Size IBW
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate healthy weight ranges tailored specifically to Indian & South Asian body compositions (ICMR/WHO consensus guidelines: 18.5–22.9 BMI).
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setGender('male')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            gender === 'male' ? 'bg-cyan-500 text-slate-950 shadow' : 'bg-slate-900 border border-slate-800 text-slate-400'
          }`}
        >
          Male
        </button>
        <button
          type="button"
          onClick={() => setGender('female')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            gender === 'female' ? 'bg-rose-500 text-white shadow' : 'bg-slate-900 border border-slate-800 text-slate-400'
          }`}
        >
          Female
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">Height (cm)</label>
          <input
            type="number"
            min={120}
            max={230}
            value={heightCm || ''}
            onChange={(e) => setHeightCm(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
          <span className="text-[11px] text-slate-500">{(heightCm / 30.48).toFixed(1)} Feet</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">Current Weight (kg)</label>
          <input
            type="number"
            min={30}
            max={200}
            value={currentWeightKg || ''}
            onChange={(e) => setCurrentWeightKg(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">Wrist / Frame Size</label>
          <select
            value={frameSize}
            onChange={(e) => setFrameSize(e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm focus:outline-none focus:border-cyan-500"
          >
            <option value="small">Small Frame (-10%)</option>
            <option value="medium">Medium Frame (Standard)</option>
            <option value="large">Large Frame (+10%)</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setHasCalculated(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Scale className="w-4 h-4" />
          <span>Calculate Ideal Body Weight</span>
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
            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40">
              <span className="text-xs text-emerald-400 font-semibold block">ICMR Ideal Weight Range</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                {results.icmrMinKg} – {results.icmrMaxKg} <span className="text-sm font-normal text-slate-400">kg</span>
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Indian BMI 18.5 – 22.9</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Devine Clinical IBW</span>
              <span className="text-2xl font-bold font-mono text-cyan-400 mt-1 block">
                {results.devineKg} <span className="text-sm font-normal text-slate-400">kg</span>
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Pharmacological target</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Current Status</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                BMI {results.currentBmi}
              </span>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold border ${results.statusColor}`}>
                {results.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3-Line FAQ */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frequently Asked Questions (Ideal Weight India)</span>
        </h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">1. Why is the Indian BMI cutoff lower than Western BMI guidelines?</p>
            <p className="mt-0.5 text-slate-400">Research by ICMR and WHO shows South Asians possess a higher proportion of visceral abdominal fat at identical BMIs, triggering diabetes risks at a lower threshold of 23.0.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">2. What is the Devine Formula used for in medicine?</p>
            <p className="mt-0.5 text-slate-400">The Devine formula is the benchmark standard utilized by medical doctors and clinical pharmacologists to calibrate accurate therapeutic drug dosages.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">3. How does skeletal frame size modify your healthy weight target?</p>
            <p className="mt-0.5 text-slate-400">Individuals with larger bone structures and broad wrists can safely carry ~10% more mass, while small-framed individuals target ~10% lighter ranges.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
