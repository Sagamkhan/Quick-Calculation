import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, BarChart2, Sigma, ArrowDownUp } from 'lucide-react';
import { ToolComponentProps } from './registry';

const SAMPLE_DATA = '12, 18, 24, 24, 30, 36, 42, 48, 54, 60';

export default function MeanMedianModeCalculator({ tool, onBack }: ToolComponentProps) {
  const [rawInput, setRawInput] = useState<string>(SAMPLE_DATA);
  const [copied, setCopied] = useState<boolean>(false);

  const stats = useMemo(() => {
    const numbers = rawInput
      .split(/[\s,]+/)
      .map(Number)
      .filter((n) => !isNaN(n));

    if (numbers.length === 0) {
      return null;
    }

    const count = numbers.length;
    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / count;

    // Sorted for median and mode
    const sorted = [...numbers].sort((a, b) => a - b);

    // Median
    let median = 0;
    if (count % 2 === 1) {
      median = sorted[Math.floor(count / 2)];
    } else {
      median = (sorted[count / 2 - 1] + sorted[count / 2]) / 2;
    }

    // Mode
    const freqMap = new Map<number, number>();
    sorted.forEach((n) => freqMap.set(n, (freqMap.get(n) || 0) + 1));

    let maxFreq = 0;
    freqMap.forEach((f) => {
      if (f > maxFreq) maxFreq = f;
    });

    let modes: number[] = [];
    if (maxFreq > 1) {
      freqMap.forEach((freq, val) => {
        if (freq === maxFreq) modes.push(val);
      });
    }

    // Range
    const min = sorted[0];
    const max = sorted[count - 1];
    const range = max - min;

    // Variance & Std Dev
    const variance = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);

    return {
      count,
      sum,
      mean: Number(mean.toFixed(4)),
      median: Number(median.toFixed(4)),
      modes,
      min,
      max,
      range,
      variance: Number(variance.toFixed(4)),
      stdDev: Number(stdDev.toFixed(4)),
      sorted
    };
  }, [rawInput]);

  const handleCopy = () => {
    if (!stats) return;
    const text = `Descriptive Statistics Summary:
Count: ${stats.count} | Sum: ${stats.sum}
Mean (Average): ${stats.mean}
Median: ${stats.median}
Mode: ${stats.modes.length > 0 ? stats.modes.join(', ') : 'No unique mode'}
Min: ${stats.min} | Max: ${stats.max} | Range: ${stats.range}
Standard Deviation: ${stats.stdDev}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Mean Median Mode Calculator - Descriptive Statistics & Standard Deviation
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate average mean, median, statistical mode, range, and population standard deviation for any dataset.
        </p>
      </div>

      {/* Input section */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-cyan-400" /> Enter Numbers (Comma or Space Separated)
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRawInput(SAMPLE_DATA)}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Load Sample
            </button>
            <button
              type="button"
              onClick={() => setRawInput('')}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Clear
            </button>
          </div>
        </div>

        <textarea
          rows={3}
          value={rawInput}
          onChange={(e) => setRawInput(e.target.value)}
          placeholder="e.g. 10, 25, 30, 45, 50, 60, 60..."
          className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
        />

        {stats && (
          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
            <ArrowDownUp className="w-3.5 h-3.5 text-cyan-400" />
            <span className="truncate">Sorted: {stats.sorted.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Main Results Grid */}
      {stats && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Mean */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/30">
              <span className="text-xs text-slate-400">Mean (Average)</span>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 mt-1">
                {stats.mean}
              </div>
            </div>

            {/* Median */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
              <span className="text-xs text-slate-400">Median (Middle)</span>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 mt-1">
                {stats.median}
              </div>
            </div>

            {/* Mode */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
              <span className="text-xs text-slate-400">Mode (Frequency)</span>
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1 truncate">
                {stats.modes.length > 0 ? stats.modes.join(', ') : 'None'}
              </div>
            </div>

            {/* Range */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
              <span className="text-xs text-slate-400">Range (Max - Min)</span>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-purple-400 mt-1">
                {stats.range}
              </div>
            </div>
          </div>

          {/* Secondary stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/80">
              <span className="text-xs text-slate-400">Standard Deviation (σ)</span>
              <div className="text-lg font-bold font-mono text-white mt-0.5">{stats.stdDev}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/80">
              <span className="text-xs text-slate-400">Variance (σ²)</span>
              <div className="text-lg font-bold font-mono text-white mt-0.5">{stats.variance}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/80">
              <span className="text-xs text-slate-400">Total Count (N)</span>
              <div className="text-lg font-bold font-mono text-white mt-0.5">{stats.count}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Sum (∑x)</span>
                <div className="text-lg font-bold font-mono text-white mt-0.5">{stats.sum}</div>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition"
                title="Copy statistics summary"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
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
            <strong className="text-slate-300">When is the median preferred over the arithmetic mean?</strong>
            <p className="mt-0.5">The median is preferred when dealing with skewed distributions or extreme outliers (such as household income and real estate prices).</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Can a dataset have more than one mode?</strong>
            <p className="mt-0.5">Yes, a dataset can have two modes (bimodal), multiple modes (multimodal), or zero mode if all values occur with equal frequency.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">What does standard deviation indicate about numbers?</strong>
            <p className="mt-0.5">Standard deviation measures dispersion; a low standard deviation indicates values cluster tightly near the mean average.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
