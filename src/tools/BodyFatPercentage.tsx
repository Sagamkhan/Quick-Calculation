import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Activity, Scale } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function BodyFatPercentage({ tool, onBack }: ToolComponentProps) {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(75);
  const [waistCm, setWaistCm] = useState<number>(85);
  const [neckCm, setNeckCm] = useState<number>(38);
  const [hipCm, setHipCm] = useState<number>(98);
  const [copied, setCopied] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  // US Navy Body Fat Formula
  const results = useMemo(() => {
    let bf = 0;
    if (gender === 'male') {
      const diff = waistCm - neckCm;
      if (diff > 0) {
        bf = 495 / (1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(heightCm)) - 450;
      }
    } else {
      const sum = waistCm + hipCm - neckCm;
      if (sum > 0) {
        bf = 495 / (1.29579 - 0.35004 * Math.log10(sum) + 0.22100 * Math.log10(heightCm)) - 450;
      }
    }

    bf = Math.max(3, Math.min(60, Math.round(bf * 10) / 10));
    const fatMassKg = Math.round(weightKg * (bf / 100) * 10) / 10;
    const leanMassKg = Math.round((weightKg - fatMassKg) * 10) / 10;

    let category = 'Fitness';
    let badgeColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';

    if (gender === 'male') {
      if (bf < 6) { category = 'Essential Fat'; badgeColor = 'text-amber-400 border-amber-500/40 bg-amber-500/10'; }
      else if (bf <= 13) { category = 'Athletes'; badgeColor = 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10'; }
      else if (bf <= 17) { category = 'Fitness'; badgeColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'; }
      else if (bf <= 24) { category = 'Average'; badgeColor = 'text-blue-400 border-blue-500/40 bg-blue-500/10'; }
      else { category = 'Obese'; badgeColor = 'text-rose-400 border-rose-500/40 bg-rose-500/10'; }
    } else {
      if (bf < 14) { category = 'Essential Fat'; badgeColor = 'text-amber-400 border-amber-500/40 bg-amber-500/10'; }
      else if (bf <= 20) { category = 'Athletes'; badgeColor = 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10'; }
      else if (bf <= 24) { category = 'Fitness'; badgeColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'; }
      else if (bf <= 31) { category = 'Average'; badgeColor = 'text-blue-400 border-blue-500/40 bg-blue-500/10'; }
      else { category = 'Obese'; badgeColor = 'text-rose-400 border-rose-500/40 bg-rose-500/10'; }
    }

    return {
      bodyFat: bf,
      fatMassKg,
      leanMassKg,
      category,
      badgeColor
    };
  }, [gender, heightCm, weightKg, waistCm, neckCm, hipCm]);

  const handleCopy = () => {
    const text = `Body Fat Calculator Results:
Gender: ${gender} | Height: ${heightCm}cm | Weight: ${weightKg}kg
Body Fat: ${results.bodyFat}% (${results.category})
Fat Mass: ${results.fatMassKg} kg | Lean Body Mass: ${results.leanMassKg} kg`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Body Fat Percentage Calculator - US Navy Method & Lean Body Mass
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate your body fat percentage, lean tissue mass, and fitness categorization using standard tape measurements.
        </p>
      </div>

      {/* Gender */}
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

      {/* Measurement Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">Height (cm)</label>
          <input
            type="number"
            min={100}
            max={250}
            value={heightCm || ''}
            onChange={(e) => setHeightCm(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">Weight (kg)</label>
          <input
            type="number"
            min={30}
            max={250}
            value={weightKg || ''}
            onChange={(e) => setWeightKg(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">Neck Circumference (cm)</label>
          <input
            type="number"
            min={20}
            max={70}
            value={neckCm || ''}
            onChange={(e) => setNeckCm(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">Waist Circumference (cm)</label>
          <input
            type="number"
            min={40}
            max={180}
            value={waistCm || ''}
            onChange={(e) => setWaistCm(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
          <span className="text-[10px] text-slate-500">Measure at navel level</span>
        </div>

        {gender === 'female' && (
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Hip Circumference (cm)</label>
            <input
              type="number"
              min={50}
              max={200}
              value={hipCm || ''}
              onChange={(e) => setHipCm(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
            />
            <span className="text-[10px] text-slate-500">Widest point across hips</span>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setHasCalculated(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Calculate Body Fat %</span>
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
            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40">
              <span className="text-xs text-cyan-400 font-semibold block">Body Fat Percentage</span>
              <span className="text-3xl font-bold font-mono text-white mt-1 block">
                {results.bodyFat}%
              </span>
              <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold border ${results.badgeColor}`}>
                {results.category}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Fat Tissue Mass</span>
              <span className="text-3xl font-bold font-mono text-white mt-1 block">
                {results.fatMassKg} <span className="text-sm font-normal text-slate-400">kg</span>
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Total adipose tissue</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40">
              <span className="text-xs text-emerald-400 font-semibold block">Lean Body Mass</span>
              <span className="text-3xl font-bold font-mono text-emerald-400 mt-1 block">
                {results.leanMassKg} <span className="text-sm font-normal text-emerald-300/80">kg</span>
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Muscle, bone & organs</span>
            </div>
          </div>
        </div>
      )}

      {/* 3-Line FAQ */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frequently Asked Questions (Body Fat Percentage)</span>
        </h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">1. How reliable is the US Navy Body Fat method compared to DEXA?</p>
            <p className="mt-0.5 text-slate-400">When circumference measurements are taken precisely on bare skin after waking, the US Navy formula tracks within 1% to 3% of medical DEXA scans.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">2. What is considered an athletic body fat range for men and women?</p>
            <p className="mt-0.5 text-slate-400">For men, athletic body fat is typically 6%–13%; for women, athletic body fat is between 14%–20% to support hormonal equilibrium.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">3. How often should you track body fat percentage changes?</p>
            <p className="mt-0.5 text-slate-400">Measure once every 2 to 4 weeks under identical conditions (morning, fasted, post-bathroom) to account for natural hydration fluctuations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
