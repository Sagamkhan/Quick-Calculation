import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Droplets, Clock } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function DailyWaterIntake({ tool, onBack }: ToolComponentProps) {
  const [weightKg, setWeightKg] = useState<number>(70);
  const [workoutMinutes, setWorkoutMinutes] = useState<number>(45);
  const [climate, setClimate] = useState<'moderate' | 'hot' | 'humid'>('moderate');
  const [specialState, setSpecialState] = useState<'none' | 'pregnant' | 'nursing'>('none');
  const [copied, setCopied] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  const results = useMemo(() => {
    // Base hydration: 35ml per kg body weight
    let liters = weightKg * 0.035;

    // Workout adjustment: 350ml per 30 mins
    liters += (workoutMinutes / 30) * 0.35;

    // Climate addition
    if (climate === 'hot') liters += 0.4;
    if (climate === 'humid') liters += 0.6;

    // Special status
    if (specialState === 'pregnant') liters += 0.3;
    if (specialState === 'nursing') liters += 0.7;

    liters = Math.round(liters * 10) / 10;
    const mlTotal = Math.round(liters * 1000);
    const glasses = Math.round((mlTotal / 250) * 10) / 10;

    return {
      liters,
      mlTotal,
      glasses,
      perHourMl: Math.round(mlTotal / 14) // across 14 waking hours
    };
  }, [weightKg, workoutMinutes, climate, specialState]);

  const handleCopy = () => {
    const text = `Daily Water Intake Goal:
Weight: ${weightKg}kg | Workout: ${workoutMinutes} min | Climate: ${climate}
Daily Water Goal: ${results.liters} Liters (${results.mlTotal} ml)
Standard Glasses (250ml): ${results.glasses} Glasses
Recommended Hourly Intake: ~${results.perHourMl} ml/hour`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Daily Water Intake Calculator - Optimal Hydration by Weight, Climate & Workout
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Compute precise daily fluid targets in liters, standard 250ml glasses, and an hourly daytime drinking schedule.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Weight */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Body Weight (kg)</span>
            <span className="font-mono text-cyan-400 font-bold">{weightKg} kg</span>
          </div>
          <input
            type="number"
            min={30}
            max={200}
            value={weightKg || ''}
            onChange={(e) => setWeightKg(Math.max(30, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
          <input
            type="range"
            min={40}
            max={150}
            value={weightKg}
            onChange={(e) => setWeightKg(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Workout */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Exercise Duration</span>
            <span className="font-mono text-cyan-400 font-bold">{workoutMinutes} mins</span>
          </div>
          <input
            type="number"
            min={0}
            max={240}
            step={15}
            value={workoutMinutes}
            onChange={(e) => setWorkoutMinutes(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
          <input
            type="range"
            min={0}
            max={180}
            step={15}
            value={workoutMinutes}
            onChange={(e) => setWorkoutMinutes(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        {/* Climate */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <span className="text-xs font-semibold text-slate-300 block">Climate & Weather</span>
          <select
            value={climate}
            onChange={(e) => setClimate(e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm focus:outline-none focus:border-cyan-500"
          >
            <option value="moderate">Moderate / Temperate</option>
            <option value="hot">Warm / Hot (&gt;30°C)</option>
            <option value="humid">Tropical / Very Humid</option>
          </select>
          <span className="text-[11px] text-slate-500">Sweat rate compensation</span>
        </div>

        {/* Status */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <span className="text-xs font-semibold text-slate-300 block">Life Stage</span>
          <select
            value={specialState}
            onChange={(e) => setSpecialState(e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm focus:outline-none focus:border-cyan-500"
          >
            <option value="none">Standard Adult</option>
            <option value="pregnant">Pregnant (+300 ml)</option>
            <option value="nursing">Breastfeeding (+700 ml)</option>
          </select>
          <span className="text-[11px] text-slate-500">Clinical guidelines</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setHasCalculated(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Droplets className="w-4 h-4" />
          <span>Calculate Water Goal</span>
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
              <span className="text-xs text-cyan-400 font-semibold block">Target Water Intake</span>
              <span className="text-3xl font-bold font-mono text-white mt-1 block">
                {results.liters} <span className="text-sm font-normal text-slate-400">Liters ({results.mlTotal} ml)</span>
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Total daily hydration</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Standard Glasses (250ml)</span>
              <span className="text-3xl font-bold font-mono text-cyan-400 mt-1 block">
                {results.glasses} <span className="text-sm font-normal text-slate-400">Glasses</span>
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">8oz drinking glasses</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Paced Hourly Intake</span>
              <span className="text-3xl font-bold font-mono text-white mt-1 block">
                ~{results.perHourMl} <span className="text-sm font-normal text-slate-400">ml / hr</span>
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">7:00 AM to 9:00 PM</span>
            </div>
          </div>
        </div>
      )}

      {/* 3-Line FAQ */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frequently Asked Questions (Daily Hydration)</span>
        </h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">1. Does tea, black coffee, and fruit count towards daily water intake?</p>
            <p className="mt-0.5 text-slate-400">Yes, water-rich foods (watermelon, cucumbers) and non-alcoholic beverages contribute approximately 20% to 25% of your baseline hydration.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">2. How much extra water should you drink for every 30 minutes of workout?</p>
            <p className="mt-0.5 text-slate-400">Cardiologists recommend adding approximately 350ml to 500ml of fluid for every 30 minutes of sweat-inducing exercise.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">3. What is the quickest visual indicator of healthy hydration?</p>
            <p className="mt-0.5 text-slate-400">Urine color should be a pale light straw yellow; clear indicates mild overhydration, while dark amber warns of dehydration.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
