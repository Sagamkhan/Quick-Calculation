import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Play, Pause, RotateCcw, Flag, Timer } from 'lucide-react';
import { ToolComponentProps } from './registry';

interface LapRecord {
  lapNumber: number;
  lapTime: number; // ms
  overallTime: number; // ms
}

function formatStopwatchTime(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);

  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');
  const cStr = String(centiseconds).padStart(2, '0');

  return `${mStr}:${sStr}.${cStr}`;
}

export default function StopwatchWithLaps({ tool, onBack }: ToolComponentProps) {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [laps, setLaps] = useState<LapRecord[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const startTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now() - elapsedTime;

      const updateTimer = () => {
        setElapsedTime(performance.now() - startTimeRef.current);
        animFrameRef.current = requestAnimationFrame(updateTimer);
      };

      animFrameRef.current = requestAnimationFrame(updateTimer);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
  };

  const handleRecordLap = () => {
    const previousOverall = laps.length > 0 ? laps[0].overallTime : 0;
    const lapTime = elapsedTime - previousOverall;
    const newLap: LapRecord = {
      lapNumber: laps.length + 1,
      lapTime,
      overallTime: elapsedTime
    };
    setLaps([newLap, ...laps]);
  };

  const handleCopyLaps = () => {
    const text = laps
      .map((l) => `Lap ${l.lapNumber}: ${formatStopwatchTime(l.lapTime)} (Total: ${formatStopwatchTime(l.overallTime)})`)
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find min and max lap times
  const lapTimes = laps.map((l) => l.lapTime);
  const minLapTime = lapTimes.length > 1 ? Math.min(...lapTimes) : null;
  const maxLapTime = lapTimes.length > 1 ? Math.max(...lapTimes) : null;

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Digital Online Stopwatch with Split Lap Times & Millisecond Precision
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          High-precision browser stopwatch with split-second lap intervals, fastest/slowest lap tracking, and lap history exports.
        </p>
      </div>

      {/* Main Clock Face Display */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-700/80 flex flex-col items-center justify-center space-y-6">
        <div className="font-mono text-5xl sm:text-7xl font-bold tracking-wider text-white select-none">
          {formatStopwatchTime(elapsedTime)}
        </div>

        {/* Buttons Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleStartStop}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all ${
              isRunning
                ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isRunning ? 'Stop' : 'Start'}
          </button>

          <button
            type="button"
            onClick={handleRecordLap}
            disabled={!isRunning}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center gap-2 disabled:opacity-40 transition"
          >
            <Flag className="w-4 h-4 text-amber-400" /> Lap
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={elapsedTime === 0}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm flex items-center gap-2 disabled:opacity-40 transition"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* Lap Table */}
      {laps.length > 0 && (
        <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Flag className="w-4 h-4 text-cyan-400" /> Recorded Laps ({laps.length})
            </span>
            <button
              type="button"
              onClick={handleCopyLaps}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Laps'}
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1 font-mono text-xs">
            {laps.map((lap) => {
              const isFastest = minLapTime !== null && lap.lapTime === minLapTime;
              const isSlowest = maxLapTime !== null && lap.lapTime === maxLapTime;

              return (
                <div
                  key={lap.lapNumber}
                  className={`p-2.5 rounded-lg flex items-center justify-between border ${
                    isFastest
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : isSlowest
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-400">#{lap.lapNumber}</span>
                    <span>Lap: {formatStopwatchTime(lap.lapTime)}</span>
                    {isFastest && <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded font-bold">Fastest</span>}
                    {isSlowest && <span className="text-[10px] bg-rose-500/20 px-1.5 py-0.5 rounded font-bold">Slowest</span>}
                  </div>
                  <span className="text-slate-400">Total: {formatStopwatchTime(lap.overallTime)}</span>
                </div>
              );
            })}
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
            <strong className="text-slate-300">How accurate is this browser stopwatch?</strong>
            <p className="mt-0.5">The timer uses the High Resolution Time API (`performance.now()`), delivering sub-millisecond precision unaffected by system clock shifts.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">What is the distinction between split time and lap time?</strong>
            <p className="mt-0.5">Lap time measures the single interval between clicks, whereas split time measures total cumulative elapsed duration from initial start.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Does the stopwatch continue running if I switch browser tabs?</strong>
            <p className="mt-0.5">Yes, because timing is delta-calculated against the timestamp reference rather than counting tick intervals, time remains accurate in the background.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
