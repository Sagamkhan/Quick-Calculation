import React, { useState, useMemo } from 'react';
import {
  ArrowLeftRight,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Info,
  Scale,
  Ruler,
  Download,
  Printer,
  Table
} from 'lucide-react';
import { ToolItem } from '../data/categoriesAndTools';
import {
  UNIT_CONVERSION_SPECS,
  convertUnitValue,
  UnitCategorySpec
} from '../data/unitConverters';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

interface UnitConverterEngineProps {
  tool: ToolItem;
}

export function UnitConverterEngine({ tool }: UnitConverterEngineProps) {
  // Map tool.id or slug to UNIT_CONVERSION_SPECS key
  const defaultCategoryKey = useMemo(() => {
    const slug = (tool.slug || '').toLowerCase();
    const id = tool.id.toLowerCase();
    const name = tool.name.toLowerCase();

    if (id.includes('length') || slug.includes('length') || name.includes('length')) return 'length';
    if (id.includes('mass') || slug.includes('weight') || name.includes('weight')) return 'mass';
    if (id.includes('area') || slug.includes('area') || name.includes('area')) return 'area';
    if (id.includes('volume') || slug.includes('volume') || name.includes('volume')) return 'volume';
    if (id.includes('data') || slug.includes('data') || name.includes('data') || name.includes('bandwidth')) return 'data_storage';
    if (id.includes('speed') || slug.includes('speed') || name.includes('speed')) return 'speed';
    if (id.includes('temp') || slug.includes('temp') || name.includes('temp')) return 'temperature';
    if (id.includes('press') || slug.includes('press') || name.includes('pressure')) return 'pressure';
    if (id.includes('time') || slug.includes('time') || name.includes('time')) return 'time';
    if (id.includes('energy') || slug.includes('energy') || name.includes('energy')) return 'energy';
    if (id.includes('power') || slug.includes('power') || name.includes('power')) return 'power';
    if (id.includes('force') || slug.includes('force') || name.includes('force')) return 'force';
    if (id.includes('density') || slug.includes('density') || name.includes('density')) return 'density';
    if (id.includes('angle') || slug.includes('angle') || name.includes('angle')) return 'angle';
    if (id.includes('freq') || slug.includes('freq') || name.includes('frequency')) return 'frequency';

    return 'length';
  }, [tool]);

  const [categoryKey, setCategoryKey] = useState<string>(defaultCategoryKey);
  const spec: UnitCategorySpec = UNIT_CONVERSION_SPECS[categoryKey] || UNIT_CONVERSION_SPECS.length;

  const [inputValue, setInputValue] = useState<number>(10);
  const [fromUnit, setFromUnit] = useState<string>(spec.units[0]?.id || '');
  const [toUnit, setToUnit] = useState<string>(spec.units[1]?.id || spec.units[0]?.id || '');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync units when category changes
  const handleCategoryChange = (newCat: string) => {
    setCategoryKey(newCat);
    const newSpec = UNIT_CONVERSION_SPECS[newCat] || UNIT_CONVERSION_SPECS.length;
    setFromUnit(newSpec.units[0]?.id || '');
    setToUnit(newSpec.units[1]?.id || newSpec.units[0]?.id || '');
  };

  // Swap units
  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  // Perform calculation
  const conversionResult = useMemo(() => {
    return convertUnitValue(categoryKey, inputValue, fromUnit, toUnit);
  }, [categoryKey, inputValue, fromUnit, toUnit]);

  // Copy result
  const handleCopyResult = async (text: string, key: string = 'main') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      confetti({ particleCount: 25, spread: 40, origin: { y: 0.8 } });
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Reset
  const handleReset = () => {
    setInputValue(10);
    setFromUnit(spec.units[0]?.id || '');
    setToUnit(spec.units[1]?.id || spec.units[0]?.id || '');
  };

  // Export PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 32, 'F');

    doc.setFontSize(16);
    doc.setTextColor(244, 114, 182); // Pink-400
    doc.text(`${tool.name} - Conversion Report`, 14, 18);

    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated: ${new Date().toLocaleString()} | Quick Calculator`, 14, 26);

    let y = 42;
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`Input Value: ${inputValue} ${conversionResult.fromSymbol}`, 14, y);
    y += 8;
    doc.text(`Converted Result: ${conversionResult.result} ${conversionResult.toSymbol}`, 14, y);
    y += 8;
    doc.text(`Conversion Formula: ${conversionResult.formula}`, 14, y);

    y += 14;
    doc.setFontSize(11);
    doc.text('Full Category Conversion Matrix:', 14, y);
    y += 8;

    Object.entries(conversionResult.breakdown).forEach(([unitName, val]) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(9.5);
      doc.text(`• ${unitName}: ${val}`, 14, y);
      y += 6;
    });

    doc.save(`${tool.slug || 'unit-conversion'}-report.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Category Picker Bar */}
      <div className="space-y-2">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-pink-400 flex items-center gap-2">
          <Scale className="w-4 h-4" />
          <span>Conversion Dimension Category</span>
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {Object.entries(UNIT_CONVERSION_SPECS).map(([key, item]) => {
            const isActive = categoryKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleCategoryChange(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20 font-bold'
                    : 'bg-slate-900/60 text-slate-300 border border-slate-700/60 hover:bg-slate-700/50'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Controls Grid - 2-Part Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left/Top: Input Controls Canvas */}
        <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-700/60">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
              <Scale className="w-4 h-4" />
              <span>Input Canvas</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              Live Real-Time
            </span>
          </div>

          {/* Input Value */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-700">
            <label className="text-xs font-semibold text-slate-300">Input Numerical Value</label>
            <input
              type="number"
              value={inputValue === 0 ? '' : inputValue}
              onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
              className="w-full h-11 px-3.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 outline-none transition-all"
              style={{ fontSize: '16px' }}
            />
          </div>

          {/* From Unit */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-700">
            <label className="text-xs font-semibold text-slate-300">From Unit</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full h-11 px-3 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:border-pink-500 outline-none cursor-pointer"
              style={{ fontSize: '16px' }}
            >
              {spec.units.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSwap}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-pink-500/20 border border-slate-700 text-pink-400 hover:border-pink-500 transition-all cursor-pointer flex items-center gap-2 text-xs font-mono font-bold"
              title="Swap From and To units"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Swap Direction</span>
            </button>
          </div>

          {/* To Unit */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-700">
            <label className="text-xs font-semibold text-slate-300">To Target Unit</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full h-11 px-3 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold focus:border-pink-500 outline-none cursor-pointer"
              style={{ fontSize: '16px' }}
            >
              {spec.units.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right/Bottom: Live Output Dashboard */}
        <div className="lg:col-span-7 space-y-4">
          {/* Hero Result Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-pink-950/40 via-slate-900 to-rose-950/30 border border-pink-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="text-xs font-mono uppercase tracking-wider text-pink-400 font-bold flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>Instant Calculated Equivalent</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                {conversionResult.result.toLocaleString()}{' '}
                <span className="text-pink-400 text-2xl font-bold">{conversionResult.toSymbol}</span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Formula: {conversionResult.formula}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleCopyResult(`${conversionResult.result} ${conversionResult.toSymbol}`, 'main')}
                className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-pink-600/30 transition-all cursor-pointer font-mono"
              >
                {copiedKey === 'main' ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey === 'main' ? 'Copied!' : 'Copy Result'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPDF}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer font-mono"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>PDF</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer font-mono"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 font-semibold block uppercase tracking-wider">
                Source Value
              </span>
              <div className="text-xl font-mono font-bold text-slate-100">
                {inputValue} {conversionResult.fromSymbol}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 font-semibold block uppercase tracking-wider">
                Converted Target
              </span>
              <div className="text-xl font-mono font-bold text-pink-400">
                {conversionResult.result} {conversionResult.toSymbol}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Itemized Conversion Matrix Table for ALL units in category */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-slate-300">
            <Table className="w-4 h-4 text-pink-400" />
            <span>Full Category Conversion Breakdown ({spec.name})</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Input: {inputValue} {conversionResult.fromSymbol}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(conversionResult.breakdown).map(([unitName, val]) => {
            const rowKey = `unit-${unitName}`;
            const isCopied = copiedKey === rowKey;
            return (
              <div
                key={unitName}
                onClick={() => handleCopyResult(`${val} ${unitName}`, rowKey)}
                className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-pink-500/40 hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-between gap-2 group"
              >
                <div className="overflow-hidden">
                  <div className="text-[11px] font-medium text-slate-400 truncate">{unitName}</div>
                  <div className="text-sm font-bold font-mono text-white truncate">{val.toLocaleString()}</div>
                </div>
                <button
                  type="button"
                  className="p-1.5 rounded-lg bg-slate-700/40 text-slate-400 group-hover:text-pink-400 transition-all"
                  title={`Copy ${val} ${unitName}`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default UnitConverterEngine;

