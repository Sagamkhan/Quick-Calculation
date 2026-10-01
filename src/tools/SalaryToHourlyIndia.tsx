import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Clock, IndianRupee, Briefcase } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function SalaryToHourlyIndia({ tool, onBack }: ToolComponentProps) {
  const [salaryMode, setSalaryMode] = useState<'annual' | 'monthly'>('annual');
  const [salaryAmount, setSalaryAmount] = useState<number>(1200000);
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState<number>(5);
  const [workHoursPerDay, setWorkHoursPerDay] = useState<number>(8);
  const [paidLeavesPerYear, setPaidLeavesPerYear] = useState<number>(20);
  const [copied, setCopied] = useState<boolean>(false);
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);

  const results = useMemo(() => {
    const annualSalary = salaryMode === 'annual' ? salaryAmount : salaryAmount * 12;
    const monthlySalary = annualSalary / 12;

    // Total weeks in a year = 52.14
    const totalWorkingDays = Math.round(52.14 * workDaysPerWeek);
    // National & festival holidays ~ 10 days in India
    const effectiveWorkingDays = Math.max(1, totalWorkingDays - paidLeavesPerYear - 10);
    const annualHours = effectiveWorkingDays * workHoursPerDay;

    const hourlyRate = annualSalary / annualHours;
    const dailyPay = hourlyRate * workHoursPerDay;
    const weeklyPay = dailyPay * workDaysPerWeek;
    const overtime15x = hourlyRate * 1.5;
    const overtime20x = hourlyRate * 2.0;

    return {
      annualSalary: Math.round(annualSalary),
      monthlySalary: Math.round(monthlySalary),
      effectiveWorkingDays,
      annualHours,
      hourlyRate: Math.round(hourlyRate),
      dailyPay: Math.round(dailyPay),
      weeklyPay: Math.round(weeklyPay),
      overtime15x: Math.round(overtime15x),
      overtime20x: Math.round(overtime20x)
    };
  }, [salaryMode, salaryAmount, workDaysPerWeek, workHoursPerDay, paidLeavesPerYear]);

  const handleCopy = () => {
    const text = `Salary to Hourly India Calculator:
Annual CTC: ₹${results.annualSalary.toLocaleString('en-IN')} (₹${results.monthlySalary.toLocaleString('en-IN')}/mo)
Working Schedule: ${workDaysPerWeek} days/wk, ${workHoursPerDay} hrs/day (${results.annualHours} hrs/yr)
Equivalent Hourly Rate: ₹${results.hourlyRate.toLocaleString('en-IN')}/hour
Overtime (2x Double Rate): ₹${results.overtime20x.toLocaleString('en-IN')}/hour`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Salary to Hourly Calculator India 2026 - Monthly to Hourly Rate & Overtime
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Convert annual CTC or take-home monthly pay into real hourly wages, daily earnings, and statutory overtime compensation.
        </p>
      </div>

      {/* Mode selection */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setSalaryMode('annual')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            salaryMode === 'annual'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Annual CTC / Package
        </button>
        <button
          type="button"
          onClick={() => setSalaryMode('monthly')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            salaryMode === 'monthly'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Monthly Salary / In-Hand
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Amount */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">
              {salaryMode === 'annual' ? 'Annual CTC' : 'Monthly Salary'}
            </span>
            <span className="font-mono text-cyan-400 font-bold">₹{salaryAmount.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="number"
            min={10000}
            step={25000}
            value={salaryAmount || ''}
            onChange={(e) => setSalaryAmount(Math.max(1000, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Days per week */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <span className="text-xs font-semibold text-slate-300 block">Work Days / Week</span>
          <select
            value={workDaysPerWeek}
            onChange={(e) => setWorkDaysPerWeek(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-sm focus:outline-none focus:border-cyan-500"
          >
            <option value={5}>5 Days / Week (Standard Corporate)</option>
            <option value={6}>6 Days / Week (6-Day Working)</option>
            <option value={4}>4 Days / Week (Hybrid / Flexible)</option>
          </select>
        </div>

        {/* Hours per day */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Daily Work Hours</span>
            <span className="font-mono text-cyan-400 font-bold">{workHoursPerDay} hrs</span>
          </div>
          <input
            type="number"
            min={4}
            max={14}
            value={workHoursPerDay}
            onChange={(e) => setWorkHoursPerDay(Math.min(14, Math.max(4, Number(e.target.value))))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Paid leaves */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Paid Leave Days / Year</span>
            <span className="font-mono text-cyan-400 font-bold">{paidLeavesPerYear} days</span>
          </div>
          <input
            type="number"
            min={0}
            max={60}
            value={paidLeavesPerYear}
            onChange={(e) => setPaidLeavesPerYear(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-white text-base focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setHasCalculated(true)}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Clock className="w-4 h-4" />
          <span>Calculate Hourly Rate</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
        </button>
      </div>

      {hasCalculated && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40">
              <span className="text-xs text-cyan-400 font-semibold block">Equivalent Hourly Rate</span>
              <span className="text-3xl font-bold font-mono text-white mt-1 block">
                ₹{results.hourlyRate.toLocaleString('en-IN')} <span className="text-sm font-normal text-slate-400">/ hr</span>
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Net working hours basis</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Daily Earning</span>
              <span className="text-3xl font-bold font-mono text-white mt-1 block">
                ₹{results.dailyPay.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">Per {workHoursPerDay}-hour day</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40">
              <span className="text-xs text-emerald-400 font-semibold block">Overtime (2.0x Double)</span>
              <span className="text-3xl font-bold font-mono text-emerald-400 mt-1 block">
                ₹{results.overtime20x.toLocaleString('en-IN')} <span className="text-sm font-normal text-emerald-300/80">/ hr</span>
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">Indian legal OT benchmark</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
              <span className="text-xs text-slate-400 block">Effective Work Hours / Year</span>
              <span className="text-3xl font-bold font-mono text-white mt-1 block">
                {results.annualHours.toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">{results.effectiveWorkingDays} working days</span>
            </div>
          </div>
        </div>
      )}

      {/* 3-Line FAQ */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Frequently Asked Questions (Salary to Hourly India)</span>
        </h4>
        <div className="space-y-2 text-xs text-slate-400">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">1. How is hourly pay legally computed from annual CTC in India?</p>
            <p className="mt-0.5 text-slate-400">Divide annual compensation by net billable hours after subtracting 52 weekends, declared public national holidays, and entitled paid casual leaves.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">2. What is the statutory overtime pay under the Indian Factories Act?</p>
            <p className="mt-0.5 text-slate-400">Under Indian labor law, employees who work beyond 9 hours on any day or 48 hours in any week are entitled to overtime wages at twice their ordinary rate.</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80">
            <p className="font-semibold text-slate-200">3. How should freelancers convert full-time CTC to a client hourly rate?</p>
            <p className="mt-0.5 text-slate-400">Freelancers typically multiply their salaried hourly rate by 1.4x to 1.7x to compensate for non-billable client acquisition, software licenses, and absence of employer health insurance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
