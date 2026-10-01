import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Calendar, Heart, Baby } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function PregnancyDueDateLmp({ tool, onBack }: ToolComponentProps) {
  const [lmpDate, setLmpDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 70); // ~10 weeks ago as friendly default
    return d.toISOString().split('T')[0];
  });
  const [cycleLengthDays, setCycleLengthDays] = useState<number>(28);
  const [copied, setCopied] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  // Naegele's Rule: LMP + 280 days + (cycleLength - 28)
  const results = useMemo(() => {
    const lmp = new Date(lmpDate);
    if (isNaN(lmp.getTime())) return null;

    const cycleAdjustment = cycleLengthDays - 28;
    const totalGestationDays = 280 + cycleAdjustment;

    const dueDate = new Date(lmp.getTime() + totalGestationDays * 24 * 60 * 60 * 1000);

    const today = new Date();
    const elapsedMs = today.getTime() - lmp.getTime();
    const elapsedDays = Math.max(0, Math.floor(elapsedMs / (1000 * 60 * 60 * 24)));
    const currentWeeks = Math.floor(elapsedDays / 7);
    const currentRemainingDays = elapsedDays % 7;

    // Trimester
    let trimester = 'First Trimester (Weeks 1 - 13)';
    let trimesterColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    if (currentWeeks >= 14 && currentWeeks <= 27) {
      trimester = 'Second Trimester (Weeks 14 - 27)';
      trimesterColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    } else if (currentWeeks >= 28) {
      trimester = 'Third Trimester (Weeks 28 - 40+)';
      trimesterColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    }

    // Milestones
    const endT1 = new Date(lmp.getTime() + 13 * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const anatomyScan = new Date(lmp.getTime() + 20 * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const fullTerm = new Date(lmp.getTime() + 37 * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return {
      dueDateString: dueDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      currentWeeks,
      currentRemainingDays,
      trimester,
      trimesterColor,
      daysRemaining: Math.max(0, Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))),
      endT1,
      anatomyScan,
      fullTerm
    };
  }, [lmpDate, cycleLengthDays]);

  const handleCopy = () => {
    if (!results) return;
    const text = `Pregnancy Due Date (LMP: ${lmpDate}):
Estimated Due Date: ${results.dueDateString}
Current Gestational Age: ${results.currentWeeks} Weeks, ${results.currentRemainingDays} Days
Trimester: ${results.trimester}
Days Until Baby: ${results.daysRemaining} Days`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Pregnancy Due Date Calculator LMP - Naegele's Rule & Trimester Timeline
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Estimate your baby's expected arrival date, track your current gestational week, and view key clinical ultrasound milestones.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">First Day of Last Menstrual Period (LMP)</label>
          <input
            type="date"
            value={lmpDate}
            onChange={(e) => setLmpDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Average Menstrual Cycle Length</span>
            <span className="font-mono text-rose-400 font-bold">{cycleLengthDays} Days</span>
          </div>
          <input
            type="number"
            min={21}
            max={45}
            value={cycleLengthDays}
            onChange={(e) => setCycleLengthDays(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-rose-500"
          />
          <span className="text-[11px] text-slate-500">Standard average: 28 days</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setHasCalculated(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-500/20 transition-all"
        >
          <Baby className="w-4 h-4" />
          <span>Calculate Due Date</span>
        </button>

        {results && (
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
          </button>
        )}
      </div>

      {hasCalculated && results && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/40 border border-rose-500/40 text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-rose-400 font-mono font-bold">Estimated Arrival Date</span>
            <div className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {results.dueDateString}
            </div>
            <p className="text-xs text-rose-300/80 font-mono">
              ~{results.daysRemaining} Days Remaining Until Full Term
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Current Gestational Age</span>
              <span className="text-2xl font-bold font-mono text-cyan-400 mt-1 block">
                {results.currentWeeks} Weeks, {results.currentRemainingDays} Days
              </span>
              <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold border ${results.trimesterColor}`}>
                {results.trimester}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2">
              <span className="text-xs text-slate-400 block font-semibold">Key Pregnancy Milestones</span>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between text-slate-300">
                  <span>End of 1st Trimester:</span>
                  <span className="text-white font-bold">{results.endT1}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Anatomy Scan (Week 20):</span>
                  <span className="text-white font-bold">{results.anatomyScan}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Full Term (Week 37):</span>
                  <span className="text-emerald-400 font-bold">{results.fullTerm}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3-Line FAQ */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frequently Asked Questions (Pregnancy Due Date LMP)</span>
        </h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">1. What is Naegele's Rule in obstetrics?</p>
            <p className="mt-0.5 text-slate-400">Naegele's rule calculates the Estimated Due Date (EDD) by adding 280 days (40 weeks) from the first day of your last normal menstrual period.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">2. How does menstrual cycle duration adjust the due date?</p>
            <p className="mt-0.5 text-slate-400">If your menstrual cycle is longer than 28 days, ovulation happens later, pushing your due date back by the corresponding number of days.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">3. What percentage of infants are delivered on their exact calculated due date?</p>
            <p className="mt-0.5 text-slate-400">Only roughly 4% to 5% of babies arrive on their exact projected due date; most arrive safely between week 37 and week 41.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
