import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Briefcase, Calendar, CheckSquare } from 'lucide-react';
import { ToolComponentProps } from './registry';

// Key Fixed Indian Gazetted Public Holidays (MM-DD)
const GAZETTED_HOLIDAYS: { [date: string]: string } = {
  '01-26': 'Republic Day',
  '08-15': 'Independence Day',
  '10-02': 'Mahatma Gandhi Jayanti',
  '05-01': 'May Day / Labour Day',
  '12-25': 'Christmas Day'
};

export default function WorkingDaysCounterIndia({ tool, onBack }: ToolComponentProps) {
  const [startDate, setStartDate] = useState<string>('2026-01-01');
  const [endDate, setEndDate] = useState<string>('2026-01-31');
  const [weekendType, setWeekendType] = useState<'sat_sun' | 'sun_only'>('sat_sun');
  const [excludeHolidays, setExcludeHolidays] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const stats = useMemo(() => {
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return null;
    }

    const start = d1 <= d2 ? new Date(d1) : new Date(d2);
    const end = d1 <= d2 ? new Date(d2) : new Date(d1);

    let totalDays = 0;
    let weekendDays = 0;
    let holidayDays = 0;
    let workingDays = 0;
    const detectedHolidays: { dateStr: string; name: string }[] = [];

    const curr = new Date(start);
    while (curr <= end) {
      totalDays++;
      const dayOfWeek = curr.getDay(); // 0 is Sun, 6 is Sat
      const isWeekend = weekendType === 'sat_sun' ? dayOfWeek === 0 || dayOfWeek === 6 : dayOfWeek === 0;

      const mmDd = `${String(curr.getMonth() + 1).padStart(2, '0')}-${String(curr.getDate()).padStart(2, '0')}`;
      const holidayName = GAZETTED_HOLIDAYS[mmDd];

      if (isWeekend) {
        weekendDays++;
      } else if (excludeHolidays && holidayName) {
        holidayDays++;
        detectedHolidays.push({ dateStr: curr.toISOString().slice(0, 10), name: holidayName });
      } else {
        workingDays++;
      }

      curr.setDate(curr.getDate() + 1);
    }

    return {
      totalDays,
      weekendDays,
      holidayDays,
      workingDays,
      detectedHolidays
    };
  }, [startDate, endDate, weekendType, excludeHolidays]);

  const handleCopy = () => {
    if (!stats) return;
    const text = `Working Days India Report:
Period: ${startDate} to ${endDate}
Total Calendar Days: ${stats.totalDays}
Weekend Days: ${stats.weekendDays} (${weekendType === 'sat_sun' ? 'Saturday & Sunday' : 'Sunday Only'})
Gazetted Holidays: ${stats.holidayDays}
Net Billable Working Days: ${stats.workingDays}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Working Days Counter India - Business Days & Gazetted Holidays Calculator
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Compute net corporate working days in India excluding 5-day or 6-day weekends and statutory gazetted national holidays.
        </p>
      </div>

      {/* Date Pickers */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Weekend Schedule</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setWeekendType('sat_sun')}
                className={`py-1.5 rounded font-bold transition ${weekendType === 'sat_sun' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'}`}
              >
                Sat & Sun Off (5-Day)
              </button>
              <button
                type="button"
                onClick={() => setWeekendType('sun_only')}
                className={`py-1.5 rounded font-bold transition ${weekendType === 'sun_only' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'}`}
              >
                Sun Only (6-Day)
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-3 sm:pt-4">
              <input
                type="checkbox"
                checked={excludeHolidays}
                onChange={(e) => setExcludeHolidays(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span>Deduct Indian Gazetted Holidays (Republic Day, etc.)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Results */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/70 border border-emerald-500/30">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" /> Net Working Days
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 mt-1">
              {stats.workingDays} Days
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
            <span className="text-xs text-slate-400">Total Calendar Days</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
              {stats.totalDays} Days
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
            <span className="text-xs text-slate-400">Weekend Days Off</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1">
              {stats.weekendDays} Days
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 flex flex-col justify-between">
            <span className="text-xs text-slate-400">National Holidays</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1">
              {stats.holidayDays} Days
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-2"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy Summary'}
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
            <strong className="text-slate-300">What are mandatory national gazetted holidays in India?</strong>
            <p className="mt-0.5">Republic Day (26 Jan), Independence Day (15 Aug), and Mahatma Gandhi Jayanti (2 Oct) are universally mandatory national holidays across all Indian states.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">How do 5-day corporate weeks compare to 6-day manufacturing schedules?</strong>
            <p className="mt-0.5">5-day weeks exclude Saturdays and Sundays (~260 working days/year), while 6-day models only treat Sunday as the statutory off day (~312 days/year).</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">What happens if a gazetted holiday falls on a weekend?</strong>
            <p className="mt-0.5">If a national holiday falls on Sunday, it is only subtracted once as a weekend day to avoid duplicate penalty deductions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
