import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Globe, Clock, Sun, Moon } from 'lucide-react';
import { ToolComponentProps } from './registry';

interface CityTimezone {
  name: string;
  country: string;
  zone: string;
  flag: string;
}

const CITIES: CityTimezone[] = [
  { name: 'New Delhi / Mumbai', country: 'India', zone: 'Asia/Kolkata', flag: '🇮🇳' },
  { name: 'London / UTC', country: 'United Kingdom', zone: 'UTC', flag: '🇬🇧' },
  { name: 'New York', country: 'United States (EST)', zone: 'America/New_York', flag: '🇺🇸' },
  { name: 'San Francisco', country: 'United States (PST)', zone: 'America/Los_Angeles', flag: '🇺🇸' },
  { name: 'Dubai', country: 'United Arab Emirates', zone: 'Asia/Dubai', flag: '🇦🇪' },
  { name: 'Singapore', country: 'Singapore', zone: 'Asia/Singapore', flag: '🇸🇬' },
  { name: 'Tokyo', country: 'Japan', zone: 'Asia/Tokyo', flag: '🇯🇵' },
  { name: 'Sydney', country: 'Australia', zone: 'Australia/Sydney', flag: '🇦🇺' }
];

export default function WorldClockIstUtc({ tool, onBack }: ToolComponentProps) {
  const [now, setNow] = useState<Date>(new Date());
  const [plannerHourOffset, setPlannerHourOffset] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const plannedDate = useMemo(() => {
    return new Date(now.getTime() + plannerHourOffset * 3600 * 1000);
  }, [now, plannerHourOffset]);

  const getTimeInZone = (zone: string, date: Date) => {
    try {
      const timeStr = new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(date);

      const dateStr = new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).format(date);

      // Check if night (between 8 PM and 6 AM)
      const hour24 = Number(new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: 'numeric', hour12: false }).format(date));
      const isNight = hour24 >= 20 || hour24 < 6;

      return { timeStr, dateStr, isNight };
    } catch {
      return { timeStr: date.toLocaleTimeString(), dateStr: date.toLocaleDateString(), isNight: false };
    }
  };

  const handleCopySummary = () => {
    const lines = CITIES.map((c) => {
      const { timeStr, dateStr } = getTimeInZone(c.zone, plannedDate);
      return `${c.name} (${c.country}): ${timeStr}, ${dateStr}`;
    });
    navigator.clipboard.writeText(`Global World Clock Summary:\n${lines.join('\n')}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          World Clock IST UTC - Real-Time Global Timezone Meeting Planner
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor real-time timezones across Indian Standard Time (IST), Coordinated Universal Time (UTC), and international business capitals.
        </p>
      </div>

      {/* Meeting Planner Slider */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" /> Interactive Future Meeting Hour Offset
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-cyan-400 font-bold">
              {plannerHourOffset === 0 ? 'Live Current Time' : `${plannerHourOffset > 0 ? '+' : ''}${plannerHourOffset} Hours`}
            </span>
            {plannerHourOffset !== 0 && (
              <button
                type="button"
                onClick={() => setPlannerHourOffset(0)}
                className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 hover:text-white"
              >
                Reset to Live
              </button>
            )}
          </div>
        </div>

        <input
          type="range"
          min={-12}
          max={12}
          value={plannerHourOffset}
          onChange={(e) => setPlannerHourOffset(Number(e.target.value))}
          className="w-full accent-cyan-500"
        />

        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
          <span>-12 Hours</span>
          <span>Now</span>
          <span>+12 Hours</span>
        </div>
      </div>

      {/* City Clocks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CITIES.map((city) => {
          const { timeStr, dateStr, isNight } = getTimeInZone(city.zone, plannedDate);
          const isPrimaryIst = city.zone === 'Asia/Kolkata';

          return (
            <div
              key={city.name}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                isPrimaryIst
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/70 border-slate-700/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base">{city.flag}</span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  {isNight ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                  {isNight ? 'Night' : 'Day'}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm tracking-tight">{city.name}</h3>
                <div className="text-[11px] text-slate-400 truncate">{city.country}</div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="font-mono text-xl sm:text-2xl font-bold text-cyan-300 tracking-wide">
                  {timeStr}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">{dateStr}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleCopySummary}
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy All City Times'}
        </button>
      </div>

      {/* 3-Line FAQ */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-cyan-400" /> Frequently Asked Questions
        </h4>
        <div className="space-y-2 text-xs text-slate-400 divide-y divide-slate-800/80">
          <div className="pt-2">
            <strong className="text-slate-300">Does Indian Standard Time (IST) observe Daylight Saving Time (DST)?</strong>
            <p className="mt-0.5">No, India maintains a permanent fixed UTC+5:30 offset throughout the year without seasonal clock transitions.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">How many hours difference exists between IST and New York (EST)?</strong>
            <p className="mt-0.5">IST is 10.5 hours ahead during Daylight Saving (EDT) and 9.5 hours ahead during standard winter months (EST).</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">What is the distinction between UTC and GMT?</strong>
            <p className="mt-0.5">UTC is the atomic time measurement standard, whereas GMT (Greenwich Mean Time) is the legal civil timezone utilized in the UK.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
