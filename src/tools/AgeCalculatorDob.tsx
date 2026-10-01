import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Calendar, Clock, Cake } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function AgeCalculatorDob({ tool, onBack }: ToolComponentProps) {
  const [dob, setDob] = useState<string>('1998-05-15');
  const [targetDate, setTargetDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  const results = useMemo(() => {
    const birth = new Date(dob);
    const target = new Date(targetDate);

    if (isNaN(birth.getTime()) || isNaN(target.getTime()) || birth > target) {
      return null;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // Next birthday calculation
    const currentYear = target.getFullYear();
    let nextBday = new Date(currentYear, birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday = new Date(currentYear + 1, birth.getMonth(), birth.getDate());
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
    const dayOfWeek = nextBday.toLocaleDateString('en-US', { weekday: 'long' });

    return {
      years,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes,
      daysToNextBday,
      nextBdayDayOfWeek: dayOfWeek
    };
  }, [dob, targetDate]);

  const handleCopy = () => {
    if (!results) return;
    const text = `Age Calculator (DOB: ${dob}):
Exact Age: ${results.years} Years, ${results.months} Months, ${results.days} Days
Total Days Lived: ${results.totalDays.toLocaleString()} Days
Next Birthday In: ${results.daysToNextBday} Days (on a ${results.nextBdayDayOfWeek})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Age Calculator by Date of Birth - Exact Years, Months, Days & Next Birthday
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate your precise biological age in completed calendar years, months, days, total hours lived, and countdown to your next birthday.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">Date of Birth (DOB)</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">Age at the Date of</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setHasCalculated(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Calendar className="w-4 h-4" />
          <span>Calculate Exact Age</span>
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
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-cyan-500/40 text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-mono font-bold">Your Exact Age</span>
            <div className="text-3xl sm:text-5xl font-extrabold font-mono text-white tracking-tight">
              {results.years} <span className="text-lg text-slate-400 font-sans">Years</span> {results.months} <span className="text-lg text-slate-400 font-sans">Months</span> {results.days} <span className="text-lg text-slate-400 font-sans">Days</span>
            </div>
            <p className="text-xs text-slate-400">Calculated precisely across all leap years and calendar variations.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Total Days Lived</span>
              <span className="text-2xl font-bold font-mono text-cyan-400 mt-1 block">
                {results.totalDays.toLocaleString()} <span className="text-xs font-normal text-slate-500">Days</span>
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">~{results.totalHours.toLocaleString()} Hours</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40">
              <span className="text-xs text-emerald-400 font-semibold block flex items-center gap-1">
                <Cake className="w-3.5 h-3.5" />
                <span>Next Birthday</span>
              </span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                In {results.daysToNextBday} <span className="text-xs font-normal text-slate-400">Days</span>
              </span>
              <span className="text-[11px] text-emerald-400/80 mt-1 block">Falls on a {results.nextBdayDayOfWeek}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Total Minutes Lived</span>
              <span className="text-2xl font-bold font-mono text-white mt-1 block">
                {results.totalMinutes.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Minutes of existence</span>
            </div>
          </div>
        </div>
      )}

      {/* 3-Line FAQ */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frequently Asked Questions (Age Calculator)</span>
        </h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">1. Does this age calculator account for Gregorian leap years?</p>
            <p className="mt-0.5 text-slate-400">Yes, every 366-day leap year and exact calendar month length (28, 30, or 31 days) is dynamically calculated without approximation.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">2. How is age calculated for government job exam eligibility in India?</p>
            <p className="mt-0.5 text-slate-400">Government exam notifications specify an official cutoff date (e.g., 1st August); enter that date in the "Age at the Date of" field to verify eligibility.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">3. Can you calculate age at a past historical date?</p>
            <p className="mt-0.5 text-slate-400">Yes, you can set the secondary date to any historical date (such as a wedding, graduation, or milestone) to see your exact age on that day.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
