import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Percent, ArrowRight, RotateCcw } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function PercentageCalculatorSteps({ tool, onBack }: ToolComponentProps) {
  const [calcMode, setCalcMode] = useState<'percentOf' | 'isWhatPercent' | 'change'>('percentOf');
  const [valA, setValA] = useState<number>(15);
  const [valB, setValB] = useState<number>(2500);
  const [copied, setCopied] = useState<boolean>(false);

  const resultData = useMemo(() => {
    if (calcMode === 'percentOf') {
      const percentage = valA;
      const total = valB;
      const answer = (percentage / 100) * total;
      const steps = [
        `Step 1: Convert ${percentage}% to decimal: ${percentage} ÷ 100 = ${(percentage / 100).toFixed(4)}`,
        `Step 2: Multiply decimal by the base amount: ${(percentage / 100).toFixed(4)} × ${total} = ${answer.toLocaleString('en-IN')}`,
        `Final Answer: ${percentage}% of ${total.toLocaleString('en-IN')} is ${answer.toLocaleString('en-IN')}`
      ];
      return { answer: answer.toLocaleString('en-IN'), steps, formula: `(${percentage} / 100) × ${total}` };
    } else if (calcMode === 'isWhatPercent') {
      const part = valA;
      const whole = valB;
      const answer = whole !== 0 ? (part / whole) * 100 : 0;
      const steps = [
        `Step 1: Divide the part by the whole: ${part} ÷ ${whole} = ${(part / (whole || 1)).toFixed(6)}`,
        `Step 2: Multiply by 100 to convert to percentage: ${(part / (whole || 1)).toFixed(6)} × 100 = ${answer.toFixed(2)}%`,
        `Final Answer: ${part} is ${answer.toFixed(2)}% of ${whole}`
      ];
      return { answer: `${answer.toFixed(2)}%`, steps, formula: `(${part} / ${whole}) × 100%` };
    } else {
      const initial = valA;
      const final = valB;
      const diff = final - initial;
      const pctChange = initial !== 0 ? (diff / initial) * 100 : 0;
      const isIncrease = diff >= 0;
      const steps = [
        `Step 1: Calculate absolute difference: ${final} - ${initial} = ${diff}`,
        `Step 2: Divide difference by initial value: ${diff} ÷ ${initial} = ${(diff / (initial || 1)).toFixed(6)}`,
        `Step 3: Convert to percentage: ${(diff / (initial || 1)).toFixed(6)} × 100 = ${Math.abs(pctChange).toFixed(2)}%`,
        `Final Answer: ${Math.abs(pctChange).toFixed(2)}% ${isIncrease ? 'Increase' : 'Decrease'}`
      ];
      return {
        answer: `${isIncrease ? '+' : ''}${pctChange.toFixed(2)}%`,
        steps,
        formula: `((${final} - ${initial}) / ${initial}) × 100%`
      };
    }
  }, [calcMode, valA, valB]);

  const handleCopy = () => {
    const text = `Percentage Calculation Steps:\nFormula: ${resultData.formula}\n${resultData.steps.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Percentage Calculator with Step-by-Step Mathematical Solutions
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Calculate percentages of numbers, reverse percentages, and percentage increases or decreases with fully transparent formula steps.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => { setCalcMode('percentOf'); setValA(15); setValB(2500); }}
          className={`py-2 px-3 rounded-lg font-bold transition ${calcMode === 'percentOf' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
        >
          What is X% of Y?
        </button>
        <button
          type="button"
          onClick={() => { setCalcMode('isWhatPercent'); setValA(450); setValB(3000); }}
          className={`py-2 px-3 rounded-lg font-bold transition ${calcMode === 'isWhatPercent' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
        >
          X is what % of Y?
        </button>
        <button
          type="button"
          onClick={() => { setCalcMode('change'); setValA(1200); setValB(1560); }}
          className={`py-2 px-3 rounded-lg font-bold transition ${calcMode === 'change' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
        >
          % Increase / Decrease
        </button>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            {calcMode === 'percentOf' ? 'Percentage (X %)' : calcMode === 'isWhatPercent' ? 'Part Value (X)' : 'Initial Old Value (X)'}
          </label>
          <input
            type="number"
            value={valA || ''}
            onChange={(e) => setValA(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            {calcMode === 'percentOf' ? 'Base Total (Y)' : calcMode === 'isWhatPercent' ? 'Whole Total (Y)' : 'Final New Value (Y)'}
          </label>
          <input
            type="number"
            value={valB || ''}
            onChange={(e) => setValB(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Results and Step-by-Step Breakdown */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs text-slate-400">Calculated Result</span>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 mt-0.5">{resultData.answer}</div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied Steps' : 'Copy Steps'}
          </button>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Step-by-Step Formula Solution
          </span>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs text-slate-300">
            <div className="text-cyan-400 font-semibold">Formula: {resultData.formula}</div>
            {resultData.steps.map((st, i) => (
              <div key={i} className="text-slate-300 flex items-start gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{st}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3-Line FAQ */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-cyan-400" /> Frequently Asked Questions
        </h4>
        <div className="space-y-2 text-xs text-slate-400 divide-y divide-slate-800/80">
          <div className="pt-2">
            <strong className="text-slate-300">How do you calculate percentage of any given number?</strong>
            <p className="mt-0.5">Divide the percentage figure by 100 to obtain a decimal multiplier, then multiply that decimal by the base amount.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">What is the mathematical formula for percentage increase?</strong>
            <p className="mt-0.5">Subtract the old value from the new value, divide the difference by the initial old value, and multiply the quotient by 100.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Can percentages exceed 100% in growth calculations?</strong>
            <p className="mt-0.5">Yes, if a quantity doubles it represents a 100% increase, while a quantity that triples represents a 200% increase.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
