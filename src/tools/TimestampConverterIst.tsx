import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Clock, Calendar, RefreshCw, Zap } from 'lucide-react';
import { ToolComponentProps } from './registry';

// Convert Date to IST (UTC+5:30) string representation
function formatDateToIst(date: Date): { istString: string; istTimeOnly: string; istDateOnly: string } {
  try {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const istString = new Intl.DateTimeFormat('en-IN', options).format(date);
    const dateOnly = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium' }).format(date);
    const timeOnly = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', timeStyle: 'medium' }).format(date);
    return { istString, istDateOnly: dateOnly, istTimeOnly: timeOnly };
  } catch {
    // fallback +5:30 offset
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);
    return {
      istString: istDate.toUTCString().replace('GMT', 'IST'),
      istDateOnly: istDate.toISOString().slice(0, 10),
      istTimeOnly: istDate.toISOString().slice(11, 19)
    };
  }
}

export default function TimestampConverterIst({ tool, onBack }: ToolComponentProps) {
  const [currentEpochSec, setCurrentEpochSec] = useState<number>(Math.floor(Date.now() / 1000));
  const [inputEpoch, setInputEpoch] = useState<string>(String(Math.floor(Date.now() / 1000)));
  const [isMilliseconds, setIsMilliseconds] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpochSec(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const results = useMemo(() => {
    const rawNum = Number(inputEpoch.trim());
    if (isNaN(rawNum) || !inputEpoch.trim()) {
      return { isValid: false, date: null };
    }

    // Auto-detect milliseconds if string length >= 13
    const isMilli = isMilliseconds || inputEpoch.trim().length >= 13;
    const ms = isMilli ? rawNum : rawNum * 1000;
    const date = new Date(ms);

    if (isNaN(date.getTime())) {
      return { isValid: false, date: null };
    }

    const { istString, istDateOnly, istTimeOnly } = formatDateToIst(date);
    const utcString = date.toUTCString();
    const isoString = date.toISOString();
    const localString = date.toString();

    // Relative time
    const diffSec = Math.round((Date.now() - date.getTime()) / 1000);
    let relative = '';
    if (Math.abs(diffSec) < 60) {
      relative = 'Just now';
    } else if (diffSec > 0) {
      if (diffSec < 3600) relative = `${Math.floor(diffSec / 60)} minutes ago`;
      else if (diffSec < 86400) relative = `${Math.floor(diffSec / 3600)} hours ago`;
      else relative = `${Math.floor(diffSec / 86400)} days ago`;
    } else {
      const futureSec = Math.abs(diffSec);
      if (futureSec < 3600) relative = `in ${Math.floor(futureSec / 60)} minutes`;
      else if (futureSec < 86400) relative = `in ${Math.floor(futureSec / 3600)} hours`;
      else relative = `in ${Math.floor(futureSec / 86400)} days`;
    }

    return {
      isValid: true,
      seconds: Math.floor(date.getTime() / 1000),
      milliseconds: date.getTime(),
      istString,
      istDateOnly,
      istTimeOnly,
      utcString,
      isoString,
      localString,
      relative
    };
  }, [inputEpoch, isMilliseconds]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleUseCurrent = () => {
    setInputEpoch(String(Math.floor(Date.now() / 1000)));
    setIsMilliseconds(false);
  };

  const applyOffset = (offsetSec: number) => {
    const base = results.isValid && results.seconds ? results.seconds : Math.floor(Date.now() / 1000);
    setInputEpoch(String(base + offsetSec));
    setIsMilliseconds(false);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Epoch Timestamp Converter - Unix to IST (Indian Standard Time) & UTC
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Convert Unix epoch timestamps to Indian Standard Time (IST UTC+5:30), Greenwich Mean Time (UTC), and ISO 8601 with relative age calculations.
        </p>
      </div>

      {/* Live Ticker Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-400 font-medium">Current Unix Timestamp (Live):</span>
          <span className="font-mono text-lg font-bold text-cyan-400">{currentEpochSec}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUseCurrent}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Clock className="w-3.5 h-3.5" /> Use Current Time
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-200">Enter Epoch Timestamp</span>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMilliseconds}
                  onChange={(e) => setIsMilliseconds(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span>Milliseconds (13 Digits)</span>
              </label>
            </div>
          </div>

          <input
            type="text"
            value={inputEpoch}
            onChange={(e) => setInputEpoch(e.target.value)}
            placeholder="e.g. 1735689600"
            className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Quick Shift Offsets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" /> Quick Offsets:
          </span>
          <button
            type="button"
            onClick={() => applyOffset(3600)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            +1 Hour
          </button>
          <button
            type="button"
            onClick={() => applyOffset(86400)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            +1 Day
          </button>
          <button
            type="button"
            onClick={() => applyOffset(86400 * 7)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            +7 Days
          </button>
          <button
            type="button"
            onClick={() => applyOffset(-86400)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            -1 Day
          </button>
        </div>
      </div>

      {/* Results Cards */}
      {results.isValid && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* IST Card */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Indian Standard Time (IST - UTC+05:30)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(results.istString || '', 'ist')}
                className="text-amber-400 hover:text-amber-300"
              >
                {copiedKey === 'ist' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="font-mono text-base font-bold text-white tracking-wide">
              {results.istString}
            </div>
            <p className="text-xs text-slate-400">Date: {results.istDateOnly} | Time: {results.istTimeOnly}</p>
          </div>

          {/* UTC Card */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Universal Time Coordinated (UTC / GMT)
              </span>
              <button
                type="button"
                onClick={() => handleCopy(results.utcString || '', 'utc')}
                className="text-cyan-400 hover:text-cyan-300"
              >
                {copiedKey === 'utc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="font-mono text-base font-bold text-white tracking-wide">
              {results.utcString}
            </div>
            <p className="text-xs text-slate-400">Relative: {results.relative}</p>
          </div>

          {/* ISO 8601 */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold">ISO 8601 Standard String</span>
              <button
                type="button"
                onClick={() => handleCopy(results.isoString || '', 'iso')}
                className="text-cyan-400 hover:text-cyan-300"
              >
                {copiedKey === 'iso' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="font-mono text-xs text-emerald-400 break-all select-all">
              {results.isoString}
            </div>
          </div>

          {/* Raw Values */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold">Seconds vs Milliseconds</span>
            </div>
            <div className="font-mono text-xs text-slate-300 space-y-1">
              <div>Seconds: <span className="text-cyan-300 font-bold">{results.seconds}</span></div>
              <div>Milliseconds: <span className="text-purple-300 font-bold">{results.milliseconds}</span></div>
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
            <strong className="text-slate-300">What is Unix Epoch time and when does it begin?</strong>
            <p className="mt-0.5">Unix Epoch time is the count of seconds that have elapsed since midnight (00:00:00 UTC) on Thursday, 1 January 1970.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">How many hours is Indian Standard Time (IST) ahead of UTC?</strong>
            <p className="mt-0.5">IST is exactly 5 hours and 30 minutes ahead of UTC (Coordinated Universal Time), with no daylight saving time adjustments.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">How do I distinguish 10-digit from 13-digit Unix timestamps?</strong>
            <p className="mt-0.5">10-digit timestamps measure resolution in whole seconds, whereas 13-digit timestamps measure precision in milliseconds (common in JavaScript).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
