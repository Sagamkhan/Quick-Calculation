import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Flame, 
  Heart, 
  Droplet, 
  Scale, 
  TrendingUp, 
  Clock, 
  Moon, 
  Footprints, 
  Zap, 
  Percent, 
  Dumbbell, 
  Compass, 
  Calendar, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  Download,
  Info
} from 'lucide-react';
import { ToolItem } from '../data/categoriesAndTools';
import { recordToolUsage } from '../utils/usageTracker';

interface HealthToolEngineProps {
  tool: ToolItem;
}

export function HealthToolEngine({ tool }: HealthToolEngineProps) {
  useEffect(() => {
    recordToolUsage(tool.id, tool.name);
  }, [tool.id, tool.name]);

  const [copied, setCopied] = useState<boolean>(false);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine sub-tool mode
  const toolSlug = (tool.slug || tool.id || '').toLowerCase();
  const toolName = (tool.name || '').toLowerCase();

  const mode = useMemo(() => {
    if (toolSlug.includes('bmi') || toolName.includes('bmi')) return 'bmi';
    if (toolSlug.includes('tdee') || toolName.includes('tdee') || toolName.includes('calorie')) return 'tdee';
    if (toolSlug.includes('macro') || toolName.includes('macro')) return 'macro';
    if (toolSlug.includes('hydration') || toolSlug.includes('water') || toolName.includes('water') || toolName.includes('hydration')) return 'hydration';
    if (toolSlug.includes('heart') || toolName.includes('heart') || toolName.includes('cardio')) return 'heart-rate';
    if (toolSlug.includes('body-fat') || toolName.includes('body fat')) return 'body-fat';
    if (toolSlug.includes('ideal-weight') || toolSlug.includes('ibw') || toolName.includes('ideal body weight')) return 'ideal-weight';
    if (toolSlug.includes('bmr') || toolName.includes('basal metabolic')) return 'bmr';
    if (toolSlug.includes('1rm') || toolSlug.includes('rep-max') || toolName.includes('one rep max')) return '1rm';
    if (toolSlug.includes('fasting') || toolName.includes('fasting')) return 'fasting';
    if (toolSlug.includes('sleep') || toolName.includes('sleep') || toolName.includes('bedtime')) return 'sleep';
    if (toolSlug.includes('pace') || toolName.includes('pace') || toolName.includes('race')) return 'pace';
    if (toolSlug.includes('deficit') || toolName.includes('deficit') || toolName.includes('timeline')) return 'deficit';
    if (toolSlug.includes('step') || toolName.includes('step')) return 'steps';
    if (toolSlug.includes('lean') || toolName.includes('lean body')) return 'lean-mass';
    return 'bmi';
  }, [toolSlug, toolName]);

  // Common Form States
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(28);
  const [weightKg, setWeightKg] = useState<number>(72);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [activityLevel, setActivityLevel] = useState<number>(1.375); // 1.2 Sedentary, 1.375 Light, 1.55 Moderate, 1.725 Very, 1.9 Extra
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('lose');

  // Specific inputs
  const [neckCm, setNeckCm] = useState<number>(38);
  const [waistCm, setWaistCm] = useState<number>(84);
  const [hipCm, setHipCm] = useState<number>(98);
  const [exerciseMinutes, setExerciseMinutes] = useState<number>(45);
  const [restingHeartRate, setRestingHeartRate] = useState<number>(65);
  const [weightLifted, setWeightLifted] = useState<number>(100);
  const [reps, setReps] = useState<number>(5);
  const [fastingProtocol, setFastingProtocol] = useState<'16:8' | '18:6' | '20:4' | '14:10'>('16:8');
  const [fastStartTime, setFastStartTime] = useState<string>('20:00');
  const [wakeUpTime, setWakeUpTime] = useState<string>('07:00');
  const [distanceKm, setDistanceKm] = useState<number>(10);
  const [timeMinutes, setTimeMinutes] = useState<number>(55);
  const [targetWeightLossKg, setTargetWeightLossKg] = useState<number>(6);
  const [dailySteps, setDailySteps] = useState<number>(8500);

  // 1. BMI Calculation
  const bmiData = useMemo(() => {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    let category = 'Normal Weight';
    let color = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
    let advice = 'You are within the healthy body mass index range.';
    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      advice = 'A nutrient-rich surplus diet can help build healthy body mass.';
    } else if (bmi >= 25 && bmi < 29.9) {
      category = 'Overweight';
      color = 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      advice = 'A moderate 300-500 kcal deficit combined with cardio will restore balance.';
    } else if (bmi >= 30) {
      category = 'Obese';
      color = 'text-rose-500 bg-rose-500/10 border-rose-500/30';
      advice = 'Consulting a wellness nutritionist and regular physical activity is recommended.';
    }
    const minHealthyKg = 18.5 * heightM * heightM;
    const maxHealthyKg = 24.9 * heightM * heightM;
    return { bmi: bmi.toFixed(1), category, color, advice, minHealthyKg: minHealthyKg.toFixed(1), maxHealthyKg: maxHealthyKg.toFixed(1) };
  }, [weightKg, heightCm]);

  // 2. BMR & TDEE Calculation (Mifflin-St Jeor)
  const tdeeData = useMemo(() => {
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (gender === 'male' ? 5 : -161);
    const tdee = bmr * activityLevel;
    const weightLossCalories = Math.round(tdee - 500);
    const extremeLossCalories = Math.round(tdee - 750);
    const muscleGainCalories = Math.round(tdee + 350);

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      weightLossCalories,
      extremeLossCalories,
      muscleGainCalories
    };
  }, [weightKg, heightCm, age, gender, activityLevel]);

  // 3. Macro Calculation
  const macroData = useMemo(() => {
    const calories = goal === 'lose' ? tdeeData.weightLossCalories : goal === 'gain' ? tdeeData.muscleGainCalories : tdeeData.tdee;
    // Standard high-protein split: 30% Protein, 40% Carbs, 30% Fat
    const proteinGrams = Math.round((calories * 0.3) / 4);
    const carbsGrams = Math.round((calories * 0.4) / 4);
    const fatGrams = Math.round((calories * 0.3) / 9);

    return {
      calories,
      protein: { grams: proteinGrams, cal: proteinGrams * 4, pct: 30 },
      carbs: { grams: carbsGrams, cal: carbsGrams * 4, pct: 40 },
      fat: { grams: fatGrams, cal: fatGrams * 9, pct: 30 }
    };
  }, [tdeeData, goal]);

  // 4. Hydration Calculation
  const hydrationData = useMemo(() => {
    // Base: 35ml per kg + 500ml per 30 min exercise
    const baseLiters = (weightKg * 35) / 1000;
    const exerciseBonus = (exerciseMinutes / 30) * 0.4;
    const totalLiters = baseLiters + exerciseBonus;
    const glasses = Math.round(totalLiters / 0.25); // 250ml glasses
    return {
      liters: totalLiters.toFixed(2),
      glasses,
      ounces: Math.round(totalLiters * 33.814)
    };
  }, [weightKg, exerciseMinutes]);

  // 5. Target Heart Rate (Karvonen)
  const heartRateData = useMemo(() => {
    const maxHR = 220 - age;
    const hrReserve = maxHR - restingHeartRate;
    const warmUp = Math.round(restingHeartRate + hrReserve * 0.55);
    const fatBurn = Math.round(restingHeartRate + hrReserve * 0.65);
    const aerobic = Math.round(restingHeartRate + hrReserve * 0.75);
    const anaerobic = Math.round(restingHeartRate + hrReserve * 0.85);
    const peak = Math.round(restingHeartRate + hrReserve * 0.95);

    return { maxHR, warmUp, fatBurn, aerobic, anaerobic, peak };
  }, [age, restingHeartRate]);

  // 6. US Navy Body Fat %
  const bodyFatData = useMemo(() => {
    let bf = 15;
    if (gender === 'male') {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
    } else {
      bf = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
    }
    const clampedBf = Math.max(4, Math.min(55, bf));
    const fatMassKg = (weightKg * clampedBf) / 100;
    const leanMassKg = weightKg - fatMassKg;
    return {
      bodyFatPct: clampedBf.toFixed(1),
      fatMassKg: fatMassKg.toFixed(1),
      leanMassKg: leanMassKg.toFixed(1)
    };
  }, [gender, waistCm, neckCm, hipCm, heightCm, weightKg]);

  // 7. Ideal Body Weight (Devine, Robinson, Miller)
  const ibwData = useMemo(() => {
    const heightInches = heightCm / 2.54;
    const inchesOver5Ft = Math.max(0, heightInches - 60);
    let devine = gender === 'male' ? 50 + 2.3 * inchesOver5Ft : 45.5 + 2.3 * inchesOver5Ft;
    let robinson = gender === 'male' ? 52 + 1.9 * inchesOver5Ft : 49 + 1.7 * inchesOver5Ft;
    let miller = gender === 'male' ? 56.2 + 1.41 * inchesOver5Ft : 53.1 + 1.36 * inchesOver5Ft;

    return {
      devine: devine.toFixed(1),
      robinson: robinson.toFixed(1),
      miller: miller.toFixed(1),
      average: ((devine + robinson + miller) / 3).toFixed(1)
    };
  }, [heightCm, gender]);

  // 8. 1-Rep Max (Brzycki & Epley)
  const oneRepMaxData = useMemo(() => {
    const epley = weightLifted * (1 + reps / 30);
    const brzycki = weightLifted * (36 / (37 - reps));
    const avg = (epley + brzycki) / 2;
    return {
      oneRepMax: Math.round(avg),
      percentages: [
        { pct: 95, reps: 2, weight: Math.round(avg * 0.95) },
        { pct: 90, reps: 4, weight: Math.round(avg * 0.90) },
        { pct: 85, reps: 6, weight: Math.round(avg * 0.85) },
        { pct: 80, reps: 8, weight: Math.round(avg * 0.80) },
        { pct: 75, reps: 10, weight: Math.round(avg * 0.75) },
        { pct: 70, reps: 12, weight: Math.round(avg * 0.70) }
      ]
    };
  }, [weightLifted, reps]);

  // 9. Intermittent Fasting Window
  const fastingData = useMemo(() => {
    const [startH, startM] = fastStartTime.split(':').map(Number);
    const fastHours = fastingProtocol === '16:8' ? 16 : fastingProtocol === '18:6' ? 18 : fastingProtocol === '20:4' ? 20 : 14;
    const endH = (startH + fastHours) % 24;
    const eatingH = 24 - fastHours;
    const endFormatted = `${String(endH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`;
    return {
      fastDuration: `${fastHours} Hours`,
      eatingDuration: `${eatingH} Hours`,
      breakFastTime: endFormatted
    };
  }, [fastStartTime, fastingProtocol]);

  // 10. Sleep Cycles (90 min)
  const sleepData = useMemo(() => {
    const [wakeH, wakeM] = wakeUpTime.split(':').map(Number);
    const wakeTotalMinutes = wakeH * 60 + wakeM;
    // Calculate cycles going backwards (each cycle is 90 mins + 15 mins fall asleep)
    const cycles = [6, 5, 4, 3].map(count => {
      const cycleMins = count * 90 + 15;
      let bedTotalMins = wakeTotalMinutes - cycleMins;
      if (bedTotalMins < 0) bedTotalMins += 24 * 60;
      const bedH = Math.floor(bedTotalMins / 60);
      const bedM = bedTotalMins % 60;
      return {
        cycles: count,
        hours: (count * 1.5).toFixed(1),
        bedtime: `${String(bedH).padStart(2, '0')}:${String(bedM).padStart(2, '0')}`,
        recommended: count === 5 || count === 6
      };
    });
    return cycles;
  }, [wakeUpTime]);

  // 11. Pace Predictor
  const paceData = useMemo(() => {
    const paceMinPerKm = timeMinutes / distanceKm;
    const paceMins = Math.floor(paceMinPerKm);
    const paceSecs = Math.round((paceMinPerKm - paceMins) * 60);
    const speedKmh = (distanceKm / (timeMinutes / 60)).toFixed(2);
    
    // Project 5k, 10k, Half Marathon, Full Marathon
    const proj5k = (paceMinPerKm * 5).toFixed(0);
    const proj10k = (paceMinPerKm * 10).toFixed(0);
    const projHalf = (paceMinPerKm * 21.0975 * 1.06).toFixed(0); // slight fatigue multiplier
    const projFull = (paceMinPerKm * 42.195 * 1.12).toFixed(0);

    return {
      pace: `${paceMins}:${String(paceSecs).padStart(2, '0')} /km`,
      speedKmh,
      proj5k: `${Math.floor(Number(proj5k)/60)}h ${Number(proj5k)%60}m`,
      proj10k: `${Math.floor(Number(proj10k)/60)}h ${Number(proj10k)%60}m`,
      projHalf: `${Math.floor(Number(projHalf)/60)}h ${Number(projHalf)%60}m`,
      projFull: `${Math.floor(Number(projFull)/60)}h ${Number(projFull)%60}m`
    };
  }, [distanceKm, timeMinutes]);

  // 12. Calorie Deficit Timeline
  const deficitData = useMemo(() => {
    const totalKcalDeficitNeeded = targetWeightLossKg * 7700; // 7700 kcal per kg fat
    const dailyDeficit = 500; // standard healthy deficit
    const daysNeeded = Math.round(totalKcalDeficitNeeded / dailyDeficit);
    const weeksNeeded = (daysNeeded / 7).toFixed(1);
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysNeeded);
    return {
      totalDeficitKcal: totalKcalDeficitNeeded.toLocaleString(),
      daysNeeded,
      weeksNeeded,
      targetDate: targetDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    };
  }, [targetWeightLossKg]);

  // 13. Steps to Calories / Distance
  const stepData = useMemo(() => {
    // Approx: 1 step = 0.75 meters (0.00075 km), 1 step = 0.04 kcal
    const km = (dailySteps * 0.00075).toFixed(2);
    const miles = (Number(km) * 0.621371).toFixed(2);
    const kcal = Math.round(dailySteps * 0.04);
    return { km, miles, kcal };
  }, [dailySteps]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-orange-500/10 via-rose-500/10 to-amber-500/10 border border-orange-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Health & Fitness Engine</span>
          </div>
          <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
            {tool.name}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            {tool.description}
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => handleCopy(JSON.stringify({ tool: tool.name, bmi: bmiData.bmi, tdee: tdeeData.tdee }, null, 2))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#121824] border border-slate-200 dark:border-white/10 text-xs font-mono font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-700 dark:text-slate-200"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied' : 'Copy Stats'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Inputs vs Real-Time Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-white dark:bg-[#121824] border border-slate-200 dark:border-white/10 shadow-xs">
          <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-orange-500" />
            <span>Biometric Parameters</span>
          </h4>

          {/* Gender & Age */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Gender</label>
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl">
                <button
                  onClick={() => setGender('male')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${gender === 'male' ? 'bg-white dark:bg-orange-500 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
                >
                  Male
                </button>
                <button
                  onClick={() => setGender('female')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${gender === 'female' ? 'bg-white dark:bg-orange-500 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'}`}
                >
                  Female
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Age (Years)</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                min={10}
                max={100}
                className="w-full px-3 py-1.5 text-sm rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Weight & Height */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                min={30}
                max={250}
                className="w-full px-3 py-1.5 text-sm rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                min={100}
                max={230}
                className="w-full px-3 py-1.5 text-sm rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Activity Level Selector for TDEE / Macros */}
          {(mode === 'tdee' || mode === 'macro' || mode === 'bmr' || mode === 'deficit') && (
            <div>
              <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Physical Activity Level</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value={1.2}>Sedentary (Desk job, little exercise)</option>
                <option value={1.375}>Lightly Active (1-3 days/week exercise)</option>
                <option value={1.55}>Moderately Active (3-5 days/week workouts)</option>
                <option value={1.725}>Very Active (6-7 days/week hard training)</option>
                <option value={1.9}>Athlete / Physical Job (2x/day training)</option>
              </select>
            </div>
          )}

          {/* Specific Mode Inputs */}
          {mode === 'body-fat' && (
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
              <div>
                <label className="block text-[11px] font-mono text-slate-400">Neck (cm)</label>
                <input
                  type="number"
                  value={neckCm}
                  onChange={(e) => setNeckCm(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400">Waist (cm)</label>
                <input
                  type="number"
                  value={waistCm}
                  onChange={(e) => setWaistCm(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400">Hips (cm)</label>
                <input
                  type="number"
                  value={hipCm}
                  onChange={(e) => setHipCm(Number(e.target.value))}
                  className="w-full px-2 py-1 text-xs rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                />
              </div>
            </div>
          )}

          {mode === 'hydration' && (
            <div>
              <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Daily Exercise Duration (Minutes)</label>
              <input
                type="number"
                value={exerciseMinutes}
                onChange={(e) => setExerciseMinutes(Number(e.target.value))}
                min={0}
                max={240}
                className="w-full px-3 py-1.5 text-sm rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
              />
            </div>
          )}

          {mode === 'heart-rate' && (
            <div>
              <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Resting Heart Rate (BPM)</label>
              <input
                type="number"
                value={restingHeartRate}
                onChange={(e) => setRestingHeartRate(Number(e.target.value))}
                min={40}
                max={110}
                className="w-full px-3 py-1.5 text-sm rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
              />
            </div>
          )}

          {mode === '1rm' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Weight Lifted (kg)</label>
                <input
                  type="number"
                  value={weightLifted}
                  onChange={(e) => setWeightLifted(Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-1.5 text-sm rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Reps Completed</label>
                <input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(Number(e.target.value))}
                  min={1}
                  max={20}
                  className="w-full px-3 py-1.5 text-sm rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                />
              </div>
            </div>
          )}

          {mode === 'fasting' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Protocol</label>
                <select
                  value={fastingProtocol}
                  onChange={(e) => setFastingProtocol(e.target.value as any)}
                  className="w-full px-2 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                >
                  <option value="16:8">16:8 (Popular)</option>
                  <option value="18:6">18:6 (Advanced)</option>
                  <option value="20:4">20:4 (Warrior)</option>
                  <option value="14:10">14:10 (Beginner)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Fast Starts At</label>
                <input
                  type="time"
                  value={fastStartTime}
                  onChange={(e) => setFastStartTime(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                />
              </div>
            </div>
          )}

          {mode === 'sleep' && (
            <div>
              <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Desired Wake Up Time</label>
              <input
                type="time"
                value={wakeUpTime}
                onChange={(e) => setWakeUpTime(e.target.value)}
                className="w-full px-3 py-1.5 text-sm rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
              />
            </div>
          )}

          {mode === 'pace' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Distance (km)</label>
                <input
                  type="number"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-1.5 text-sm rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Total Time (Minutes)</label>
                <input
                  type="number"
                  value={timeMinutes}
                  onChange={(e) => setTimeMinutes(Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-1.5 text-sm rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                />
              </div>
            </div>
          )}

          {mode === 'deficit' && (
            <div>
              <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Target Weight Loss Goal (kg)</label>
              <input
                type="number"
                value={targetWeightLossKg}
                onChange={(e) => setTargetWeightLossKg(Number(e.target.value))}
                min={1}
                max={50}
                className="w-full px-3 py-1.5 text-sm rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
              />
            </div>
          )}

          {mode === 'steps' && (
            <div>
              <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1">Daily Step Count</label>
              <input
                type="number"
                value={dailySteps}
                onChange={(e) => setDailySteps(Number(e.target.value))}
                min={100}
                max={100000}
                step={500}
                className="w-full px-3 py-1.5 text-sm rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
              />
            </div>
          )}
        </div>

        {/* Right Output Results Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Primary Metric Hero Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121824] border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Primary Health Result
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                <Sparkles className="w-3 h-3" /> Live Real-Time
              </span>
            </div>

            {/* Mode-Specific Renderers */}
            {(mode === 'bmi' || mode === 'lean-mass') && (
              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <div className="font-display font-extrabold text-5xl text-slate-900 dark:text-white">
                    {bmiData.bmi}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${bmiData.color}`}>
                    {bmiData.category}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {bmiData.advice} Healthy weight range for your height: <strong className="text-slate-900 dark:text-white">{bmiData.minHealthyKg} kg – {bmiData.maxHealthyKg} kg</strong>.
                </p>
              </div>
            )}

            {(mode === 'tdee' || mode === 'bmr') && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                    <div className="text-xs font-mono text-orange-600 dark:text-orange-400 font-bold">Daily TDEE Maintenance</div>
                    <div className="font-display font-extrabold text-3xl text-slate-900 dark:text-white mt-1">
                      {tdeeData.tdee} <span className="text-sm font-normal text-slate-400">kcal/day</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold">Basal BMR (At Rest)</div>
                    <div className="font-display font-extrabold text-3xl text-slate-900 dark:text-white mt-1">
                      {tdeeData.bmr} <span className="text-sm font-normal text-slate-400">kcal/day</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">Weight Loss</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">{tdeeData.weightLossCalories} kcal</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold">Maintain</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">{tdeeData.tdee} kcal</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <div className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-bold">Muscle Gain</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">{tdeeData.muscleGainCalories} kcal</div>
                  </div>
                </div>
              </div>
            )}

            {mode === 'macro' && (
              <div className="space-y-4">
                <div className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
                  {macroData.calories} <span className="text-sm font-normal text-slate-400">Daily Target Calories</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
                    <div className="text-xs font-mono font-bold text-rose-500">Protein (30%)</div>
                    <div className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">{macroData.protein.grams}g</div>
                    <div className="text-[10px] text-slate-400">{macroData.protein.cal} kcal</div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                    <div className="text-xs font-mono font-bold text-amber-500">Carbs (40%)</div>
                    <div className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">{macroData.carbs.grams}g</div>
                    <div className="text-[10px] text-slate-400">{macroData.carbs.cal} kcal</div>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                    <div className="text-xs font-mono font-bold text-blue-500">Fats (30%)</div>
                    <div className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">{macroData.fat.grams}g</div>
                    <div className="text-[10px] text-slate-400">{macroData.fat.cal} kcal</div>
                  </div>
                </div>
              </div>
            )}

            {mode === 'hydration' && (
              <div className="space-y-4">
                <div className="flex items-baseline gap-3">
                  <div className="font-display font-extrabold text-5xl text-blue-500">
                    {hydrationData.liters}
                  </div>
                  <span className="text-sm font-mono text-slate-400">Liters / Day</span>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-700 dark:text-slate-200">Standard Glasses (250ml):</span>
                  <strong className="font-mono text-blue-600 dark:text-blue-400">{hydrationData.glasses} Glasses ({hydrationData.ounces} fl oz)</strong>
                </div>
              </div>
            )}

            {mode === 'heart-rate' && (
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <div className="font-display font-extrabold text-4xl text-rose-500">{heartRateData.maxHR}</div>
                  <span className="text-xs font-mono text-slate-400">BPM Maximum Heart Rate</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 rounded-lg bg-slate-100 dark:bg-white/5">
                    <span>Zone 1: Warmup (55-65%)</span>
                    <strong className="font-mono text-emerald-500">{heartRateData.warmUp} - {heartRateData.fatBurn} BPM</strong>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-100 dark:bg-white/5">
                    <span>Zone 2: Fat Burn (65-75%)</span>
                    <strong className="font-mono text-amber-500">{heartRateData.fatBurn} - {heartRateData.aerobic} BPM</strong>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-100 dark:bg-white/5">
                    <span>Zone 3: Aerobic Cardio (75-85%)</span>
                    <strong className="font-mono text-orange-500">{heartRateData.aerobic} - {heartRateData.anaerobic} BPM</strong>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-slate-100 dark:bg-white/5">
                    <span>Zone 4: Anaerobic Peak (85-95%)</span>
                    <strong className="font-mono text-rose-500">{heartRateData.anaerobic} - {heartRateData.peak} BPM</strong>
                  </div>
                </div>
              </div>
            )}

            {mode === 'body-fat' && (
              <div className="space-y-4">
                <div className="flex items-baseline gap-3">
                  <div className="font-display font-extrabold text-5xl text-orange-500">
                    {bodyFatData.bodyFatPct}%
                  </div>
                  <span className="text-xs font-mono text-slate-400">Estimated Body Fat</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
                    <div className="text-xs font-mono text-slate-400">Lean Mass</div>
                    <div className="font-bold text-lg text-slate-900 dark:text-white">{bodyFatData.leanMassKg} kg</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
                    <div className="text-xs font-mono text-slate-400">Fat Mass</div>
                    <div className="font-bold text-lg text-slate-900 dark:text-white">{bodyFatData.fatMassKg} kg</div>
                  </div>
                </div>
              </div>
            )}

            {mode === 'ideal-weight' && (
              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <div className="font-display font-extrabold text-4xl text-emerald-500">{ibwData.average} kg</div>
                  <span className="text-xs font-mono text-slate-400">Average Ideal Weight</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-center">
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-white/5">
                    <div className="text-slate-400">Devine Formula</div>
                    <div className="font-bold text-slate-900 dark:text-white">{ibwData.devine} kg</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-white/5">
                    <div className="text-slate-400">Robinson</div>
                    <div className="font-bold text-slate-900 dark:text-white">{ibwData.robinson} kg</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-white/5">
                    <div className="text-slate-400">Miller</div>
                    <div className="font-bold text-slate-900 dark:text-white">{ibwData.miller} kg</div>
                  </div>
                </div>
              </div>
            )}

            {mode === '1rm' && (
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <div className="font-display font-extrabold text-4xl text-indigo-500">{oneRepMaxData.oneRepMax} kg</div>
                  <span className="text-xs font-mono text-slate-400">Estimated 1-Rep Max</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {oneRepMaxData.percentages.map((p, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-center">
                      <div className="text-slate-400">{p.pct}% (~{p.reps} reps)</div>
                      <div className="font-bold text-slate-900 dark:text-white">{p.weight} kg</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mode === 'fasting' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-mono font-bold">Fast Window</span>
                    <span className="font-bold text-slate-900 dark:text-white">{fastingData.fastDuration}</span>
                  </div>
                  <div className="text-xl font-display font-extrabold text-slate-900 dark:text-white">
                    Break Fast At: <span className="text-purple-500">{fastingData.breakFastTime}</span>
                  </div>
                </div>
              </div>
            )}

            {mode === 'sleep' && (
              <div className="space-y-3">
                <div className="text-xs font-mono text-slate-400">Optimal Bedtimes for 90-Min REM Cycles:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {sleepData.map((s, idx) => (
                    <div key={idx} className={`p-2.5 rounded-xl border ${s.recommended ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10'}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{s.bedtime}</span>
                        {s.recommended && <span className="text-[10px] font-mono text-indigo-500 font-bold">Best</span>}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{s.cycles} cycles ({s.hours} hours)</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mode === 'pace' && (
              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <div className="font-display font-extrabold text-4xl text-emerald-500">{paceData.pace}</div>
                  <span className="text-xs font-mono text-slate-400">{paceData.speedKmh} km/h avg speed</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 flex justify-between">
                    <span>5K Projection:</span>
                    <strong className="text-slate-900 dark:text-white">{paceData.proj5k}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 flex justify-between">
                    <span>10K Projection:</span>
                    <strong className="text-slate-900 dark:text-white">{paceData.proj10k}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 flex justify-between">
                    <span>Half Marathon:</span>
                    <strong className="text-slate-900 dark:text-white">{paceData.projHalf}</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 flex justify-between">
                    <span>Full Marathon:</span>
                    <strong className="text-slate-900 dark:text-white">{paceData.projFull}</strong>
                  </div>
                </div>
              </div>
            )}

            {mode === 'deficit' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 space-y-1">
                  <div className="text-xs font-mono text-orange-600 dark:text-orange-400 font-bold">Projected Goal Date</div>
                  <div className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                    {deficitData.targetDate}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">
                    Achievable in ~{deficitData.daysNeeded} days ({deficitData.weeksNeeded} weeks) with a standard 500 kcal daily deficit.
                  </p>
                </div>
              </div>
            )}

            {mode === 'steps' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="text-xs font-mono text-emerald-600 font-bold">Distance (KM)</div>
                    <div className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">{stepData.km} km</div>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <div className="text-xs font-mono text-blue-600 font-bold">Distance (Miles)</div>
                    <div className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">{stepData.miles} mi</div>
                  </div>
                  <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                    <div className="text-xs font-mono text-orange-600 font-bold">Burnt Calories</div>
                    <div className="font-display font-bold text-xl text-slate-900 dark:text-white mt-1">{stepData.kcal} kcal</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default HealthToolEngine;
