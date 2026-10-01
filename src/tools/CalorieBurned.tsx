import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Flame, Activity, Timer } from 'lucide-react';
import { ToolComponentProps } from './registry';

const ACTIVITIES = [
  { name: 'Running (8 km/h / 5 mph)', met: 8.3 },
  { name: 'Running Fast (11 km/h / 7 mph)', met: 11.5 },
  { name: 'Brisk Walking (5.5 km/h)', met: 3.8 },
  { name: 'Cycling / Biking (Moderate 20 km/h)', met: 7.5 },
  { name: 'Weight Lifting / Strength Training', met: 5.0 },
  { name: 'HIIT / Circuit Calisthenics', met: 8.5 },
  { name: 'Swimming (Freestyle Moderate)', met: 7.0 },
  { name: 'Jump Rope / Skipping', met: 11.0 },
  { name: 'Yoga / Pilates', met: 3.0 },
  { name: 'Badminton / Tennis', met: 6.5 }
];

export default function CalorieBurned({ tool, onBack }: ToolComponentProps) {
  const [selectedActivityIndex, setSelectedActivityIndex] = useState<number>(0);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [copied, setCopied] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  const results = useMemo(() => {
    const act = ACTIVITIES[selectedActivityIndex] || ACTIVITIES[0];
    // Formula: Calories = Duration(hrs) * MET * Weight(kg)
    const hours = durationMinutes / 60;
    const calories = Math.round(hours * act.met * weightKg);
    const fatGramsBurned = Math.round((calories / 7.7) * 10) / 10; // ~7.7 kcal per gram of fat tissue

    return {
      activityName: act.name,
      met: act.met,
      calories,
      fatGramsBurned,
      bananaEquiv: (calories / 105).toFixed(1),
      pizzaSliceEquiv: (calories / 285).toFixed(1)
    };
  }, [selectedActivityIndex, weightKg, durationMinutes]);

  const handleCopy = () => {
    const text = `Calorie Burned Calculator:
Activity: ${results.activityName}
Duration: ${durationMinutes} mins | Weight: ${weightKg} kg
Calories Burned: ${results.calories} kcal (MET ${results.met})
Estimated Fat Burned: ${results.fatGramsBurned} grams`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Calorie Burned Calculator - MET Activity & Exercise Energy Expenditure
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate total calories and fat grams expended across running, gym workouts, swimming, and cycling based on clinical MET scores.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Activity */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">Activity / Exercise</label>
          <select
            value={selectedActivityIndex}
            onChange={(e) => setSelectedActivityIndex(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm focus:outline-none focus:border-orange-500"
          >
            {ACTIVITIES.map((act, idx) => (
              <option key={act.name} value={idx}>
                {act.name} (MET {act.met})
              </option>
            ))}
          </select>
        </div>

        {/* Weight */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Body Weight (kg)</span>
            <span className="font-mono text-orange-400 font-bold">{weightKg} kg</span>
          </div>
          <input
            type="number"
            min={30}
            max={200}
            value={weightKg || ''}
            onChange={(e) => setWeightKg(Math.max(30, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Duration */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Duration (Minutes)</span>
            <span className="font-mono text-orange-400 font-bold">{durationMinutes} mins</span>
          </div>
          <input
            type="number"
            min={1}
            max={360}
            step={5}
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Math.max(1, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setHasCalculated(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20 transition-all"
        >
          <Flame className="w-4 h-4" />
          <span>Calculate Calories Burned</span>
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
            <div className="p-4 rounded-xl bg-slate-900/90 border border-orange-500/40">
              <span className="text-xs text-orange-400 font-semibold block">Total Energy Expended</span>
              <span className="text-3xl font-bold font-mono text-white mt-1 block">
                {results.calories} <span className="text-sm font-normal text-slate-400">kcal</span>
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Based on MET {results.met}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Fat Tissue Equivalent</span>
              <span className="text-3xl font-bold font-mono text-emerald-400 mt-1 block">
                ~{results.fatGramsBurned} <span className="text-sm font-normal text-slate-400">grams</span>
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">At 7.7 kcal/g fat deficit</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Dietary Offset Equiv</span>
              <span className="text-xl font-bold font-mono text-white mt-1 block">
                ~{results.bananaEquiv} Bananas
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">or ~{results.pizzaSliceEquiv} slices of pizza</span>
            </div>
          </div>
        </div>
      )}

      {/* 3-Line FAQ */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frequently Asked Questions (Calories Burned)</span>
        </h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">1. What is a MET (Metabolic Equivalent of Task) in sports science?</p>
            <p className="mt-0.5 text-slate-400">One MET represents the rate of energy expenditure while sitting quietly (~1 kcal per kg of body weight per hour); higher MET values denote higher exercise intensity.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">2. Why do heavier individuals burn more calories during identical workouts?</p>
            <p className="mt-0.5 text-slate-400">Cardiovascular mechanics dictate that propelling greater body mass against gravity requires proportionally higher caloric work expenditure.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">3. What is the afterburn effect (EPOC)?</p>
            <p className="mt-0.5 text-slate-400">Excess Post-Exercise Oxygen Consumption (EPOC) causes your body to continue burning calories at an elevated metabolic rate for hours following high-intensity interval training.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
