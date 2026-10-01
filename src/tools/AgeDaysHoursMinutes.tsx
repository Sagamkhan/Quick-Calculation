import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Clock, Calendar, Heart, Wind, Cake } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function AgeDaysHoursMinutes({ tool, onBack }: ToolComponentProps) {
  const [dob, setDob] = useState<string>('1998-05-15');
  const [birthTime, setBirthTime] = useState<string>('08:30');
  const [asOfDate, setAsOfDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [copied, setCopied] = useState<boolean>(false);

  const stats = useMemo(() => {
    const birthDateTime = new Date(`${dob}T${birthTime || '00:00'}:00`);
    const currentDateTime = new Date(`${asOfDate}T12:00:00`);

    if (isNaN(birthDateTime.getTime()) || isNaN(currentDateTime.getTime())) {
      return null;
    }

    const diffMs = currentDateTime.getTime() - birthDateTime.getTime();
    if (diffMs < 0) return null;

    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);

    // Approximate biological stats
    const totalHeartbeats = totalMinutes * 75; // average 75 bpm
    const totalBreaths = totalMinutes * 16; // average 16 breaths/min

    // Calendar breakdown
    let years = currentDateTime.getFullYear() - birthDateTime.getFullYear();
    let months = currentDateTime.getMonth() - birthDateTime.getMonth();
    let days = currentDateTime.getDate() - birthDateTime.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Next Birthday Countdown
    const nextBday = new Date(currentDateTime.getFullYear(), birthDateTime.getMonth(), birthDateTime.getDate());
    if (nextBday < currentDateTime) {
      nextBday.setFullYear(nextBday.getFullYear() + 1);
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - currentDateTime.getTime()) / (1000 * 60 * 60 * 24));

    return {
      years: Math.max(0, years),
      months: Math.max(0, months),
      days: Math.max(0, days),
      totalDays,
      totalWeeks,
      totalHours,
      totalMinutes,
      totalSeconds,
      totalHeartbeats,
      totalBreaths,
      daysToNextBday
    };
  }, [dob, birthTime, asOfDate]);

  const handleCopy = () => {
    if (!stats) return;
    const text = `Chronological Lifetime Breakdown:
Birth: ${dob} ${birthTime}
Age: ${stats.years} Years, ${stats.months} Months, ${stats.days} Days
Total Days: ${stats.totalDays.toLocaleString()}
Total Hours: ${stats.totalHours.toLocaleString()}
Total Minutes: ${stats.totalMinutes.toLocaleString()}
Est. Heartbeats: ~${Math.round(stats.totalHeartbeats / 1e6)} Million
Days to Next Birthday: ${stats.daysToNextBday} Days`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Age in Days, Hours & Minutes - Exact Chronological Lifetime Calculator
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Discover your lifetime down to the exact days, hours, minutes, heartbeats, and next birthday countdown.
        </p>
      </div>

      {/* Inputs */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Time of Birth (Optional)</label>
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">As of Date</label>
            <input
              type="date"
              value={asOfDate}
              onChange={(e) => setAsOfDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Main Stats Display */}
      {stats && (
        <div className="space-y-4">
          {/* Main banner */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-cyan-500/30 text-center space-y-1">
            <span className="text-xs text-slate-400">Total Chronological Age</span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {stats.years} Years, {stats.months} Months, {stats.days} Days
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
              <span className="text-xs text-slate-400">Total Days</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1">
                {stats.totalDays.toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
              <span className="text-xs text-slate-400">Total Hours</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
                {stats.totalHours.toLocaleString()}h
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
              <span className="text-xs text-slate-400">Total Minutes</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1 truncate">
                {stats.totalMinutes.toLocaleString()}m
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Cake className="w-3.5 h-3.5 text-rose-400" /> Next Birthday
              </span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-rose-400 mt-1">
                {stats.daysToNextBday} Days
              </div>
            </div>
          </div>

          {/* Biological trivia cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <span className="text-xs text-slate-400">Estimated Lifetime Heartbeats</span>
                <div className="text-lg font-bold font-mono text-white mt-0.5">
                  ~{(stats.totalHeartbeats / 1e6).toFixed(1)} Million Beats
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <Wind className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <span className="text-xs text-slate-400">Estimated Total Breaths Taken</span>
                <div className="text-lg font-bold font-mono text-white mt-0.5">
                  ~{(stats.totalBreaths / 1e6).toFixed(1)} Million Breaths
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Age Report'}
            </button>
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
            <strong className="text-slate-300">How does the calculator account for leap years in total day count?</strong>
            <p className="mt-0.5">Elapsed milliseconds are computed between timestamp dates, capturing all 366-day leap years precisely.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">How are human heartbeat estimations calculated?</strong>
            <p className="mt-0.5">Calculations assume a standard resting human cardiac baseline of 75 beats per minute over your cumulative lifetime minutes.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Can I calculate age on an official milestone date like retirement?</strong>
            <p className="mt-0.5">Yes, by setting the 'As of Date' to any target day, you can preview exact future retirement age milestones.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
