import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Calendar, Clock, ArrowRight } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function DateDifferenceCalculator({ tool, onBack }: ToolComponentProps) {
  const [startDate, setStartDate] = useState<string>('2026-01-01');
  const [endDate, setEndDate] = useState<string>('2026-12-31');
  const [includeEndDay, setIncludeEndDay] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const diff = useMemo(() => {
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return null;
    }

    const start = d1 <= d2 ? d1 : d2;
    const end = d1 <= d2 ? d2 : d1;

    let totalMs = end.getTime() - start.getTime();
    if (includeEndDay) {
      totalMs += 24 * 60 * 60 * 1000;
    }

    const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // Calendar breakdown
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate() + (includeEndDay ? 1 : 0);

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return {
      years: Math.max(0, years),
      months: Math.max(0, months),
      days: Math.max(0, days),
      totalDays,
      totalWeeks,
      remainingDays,
      totalHours,
      totalMinutes
    };
  }, [startDate, endDate, includeEndDay]);

  const handleCopy = () => {
    if (!diff) return;
    const text = `Date Difference Report:
From: ${startDate} To: ${endDate} (Include End Day: ${includeEndDay ? 'Yes' : 'No'})
Duration: ${diff.years} Years, ${diff.months} Months, ${diff.days} Days
Total Days: ${diff.totalDays.toLocaleString()} Days (${diff.totalWeeks} Weeks and ${diff.remainingDays} Days)
Total Hours: ${diff.totalHours.toLocaleString()} Hours`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Date Difference Calculator - Exact Days, Months, Years & Hours Between Dates
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate the duration between two calendar dates in years, months, days, weeks, and total elapsed working hours.
        </p>
      </div>

      {/* Input Controls */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeEndDay}
              onChange={(e) => setIncludeEndDay(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Include End Date (Add +1 Day to interval)</span>
          </label>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Summary'}
          </button>
        </div>
      </div>

      {/* Results */}
      {diff && (
        <div className="space-y-4">
          {/* Primary Duration Banner */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-cyan-500/30 text-center space-y-1">
            <span className="text-xs text-slate-400">Total Calendar Duration</span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {diff.years > 0 && <span>{diff.years} Years, </span>}
              <span>{diff.months} Months, </span>
              <span>{diff.days} Days</span>
            </div>
          </div>

          {/* Detailed metrics grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
              <span className="text-xs text-slate-400">Total Days</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1">
                {diff.totalDays.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
              <span className="text-xs text-slate-400">Weeks & Days</span>
              <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-1">
                {diff.totalWeeks}w {diff.remainingDays}d
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
              <span className="text-xs text-slate-400">Total Hours</span>
              <div className="text-lg sm:text-xl font-bold font-mono text-amber-400 mt-1">
                {diff.totalHours.toLocaleString()}h
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
              <span className="text-xs text-slate-400">Total Minutes</span>
              <div className="text-lg sm:text-xl font-bold font-mono text-purple-400 mt-1 truncate">
                {diff.totalMinutes.toLocaleString()}m
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3-Line FAQ */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-cyan-400" /> Frequently Asked Questions
        </h4>
        <div className="space-y-2 text-xs text-slate-400 divide-y divide-slate-800/80">
          <div className="pt-2">
            <strong className="text-slate-300">Why does the date difference vary when including the end date?</strong>
            <p className="mt-0.5">Statutory periods (e.g. lease agreements or leaves) often count both the starting day and the finishing day as inclusive full days.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">How does the calculator handle leap years?</strong>
            <p className="mt-0.5">Native Gregorian calendar math automatically factors in February 29th leap days across past and future milestone years.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Can I calculate past durations like historical anniversary dates?</strong>
            <p className="mt-0.5">Yes, if the starting date is chronologically after the ending date, the calculator automatically computes the elapsed interval without error.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
