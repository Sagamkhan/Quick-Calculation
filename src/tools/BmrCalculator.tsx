import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Flame, Activity } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function BmrCalculator({ tool, onBack }: ToolComponentProps) {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(28);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(172);
  const [copied, setCopied] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  // Mifflin-St Jeor formula
  const results = useMemo(() => {
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    bmr = Math.round(bmr);

    return {
      bmr,
      sedentary: Math.round(bmr * 1.2),
      light: Math.round(bmr * 1.375),
      moderate: Math.round(bmr * 1.55),
      heavy: Math.round(bmr * 1.725),
      athlete: Math.round(bmr * 1.9),
      mildLoss: Math.round(bmr * 1.55 - 250),
      standardLoss: Math.round(bmr * 1.55 - 500)
    };
  }, [gender, age, weightKg, heightCm]);

  const handleCopy = () => {
    const text = `BMR Calculator Results:
Gender: ${gender} | Age: ${age} | Height: ${heightCm}cm | Weight: ${weightKg}kg
Basal Metabolic Rate (BMR): ${results.bmr} kcal/day
Maintenance Calories (Moderate Activity): ${results.moderate} kcal/day
Weight Loss Target (-500 kcal): ${results.standardLoss} kcal/day`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          BMR Calculator Online - Basal Metabolic Rate Mifflin-St Jeor Formula
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Accurately calculate your daily basal caloric expenditure at complete physical rest and activity-based maintenance calories.
        </p>
      </div>

      {/* Gender toggle */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setGender('male')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            gender === 'male'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Male
        </button>
        <button
          type="button"
          onClick={() => setGender('female')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            gender === 'female'
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Female
        </button>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Age (Years)</span>
            <span className="font-mono text-cyan-400 font-bold">{age}</span>
          </div>
          <input
            type="number"
            min={10}
            max={100}
            value={age || ''}
            onChange={(e) => setAge(Math.min(100, Math.max(10, Number(e.target.value))))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Height (cm)</span>
            <span className="font-mono text-cyan-400 font-bold">{heightCm} cm</span>
          </div>
          <input
            type="number"
            min={80}
            max={250}
            value={heightCm || ''}
            onChange={(e) => setHeightCm(Math.max(80, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Weight (kg)</span>
            <span className="font-mono text-cyan-400 font-bold">{weightKg} kg</span>
          </div>
          <input
            type="number"
            min={25}
            max={300}
            value={weightKg || ''}
            onChange={(e) => setWeightKg(Math.max(25, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setHasCalculated(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20 transition-all"
        >
          <Flame className="w-4 h-4" />
          <span>Calculate BMR</span>
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

      {/* Results */}
      {hasCalculated && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-orange-500/40">
              <span className="text-xs text-orange-400 font-semibold block">Basal Metabolic Rate (BMR)</span>
              <span className="text-3xl font-bold font-mono text-white mt-1 block">
                {results.bmr} <span className="text-sm font-normal text-slate-400">kcal/day</span>
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Burned at complete bed rest</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Moderate Activity TDEE</span>
              <span className="text-3xl font-bold font-mono text-white mt-1 block">
                {results.moderate} <span className="text-sm font-normal text-slate-400">kcal/day</span>
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">3–5 workout days/week</span>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/40">
              <span className="text-xs text-emerald-300 font-semibold block">Fat Loss Target (-500 kcal)</span>
              <span className="text-3xl font-bold font-mono text-emerald-400 mt-1 block">
                {results.standardLoss} <span className="text-sm font-normal text-emerald-300/80">kcal/day</span>
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Lose ~0.5 kg fat per week</span>
            </div>
          </div>

          {/* Activity Breakdown */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Daily Calorie Burn by Activity Multiplier
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Sedentary (Desk Job)</span>
                <span className="text-white font-bold">{results.sedentary} kcal</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Light (1-2 days)</span>
                <span className="text-white font-bold">{results.light} kcal</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Heavy (6-7 days)</span>
                <span className="text-white font-bold">{results.heavy} kcal</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Athlete (2x daily)</span>
                <span className="text-white font-bold">{results.athlete} kcal</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3-Line FAQ */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frequently Asked Questions (BMR Calculator)</span>
        </h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">1. What is the difference between BMR and TDEE?</p>
            <p className="mt-0.5 text-slate-400">BMR is the base energy required just to stay alive at rest; TDEE (Total Daily Energy Expenditure) includes your daily physical movement, workouts, and digestion.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">2. Why shouldn't you eat below your BMR?</p>
            <p className="mt-0.5 text-slate-400">Restricting calories below your BMR triggers adaptive thermogenesis, slow thyroid function, muscle loss, and chronic fatigue.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">3. How can you naturally increase your BMR?</p>
            <p className="mt-0.5 text-slate-400">Building lean skeletal muscle through progressive resistance training is the most effective way to permanently raise resting metabolic rate.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
