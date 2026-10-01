import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, ArrowLeftRight, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { ToolComponentProps } from './registry';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
  }
  if (clean.length === 6) {
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
  }
  return null;
}

function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export default function ColorContrastCheckerWcag({ tool, onBack }: ToolComponentProps) {
  const [textColor, setTextColor] = useState<string>('#06b6d4'); // cyan
  const [bgColor, setBgColor] = useState<string>('#0f172a'); // slate-900

  const contrastData = useMemo(() => {
    const textRgb = hexToRgb(textColor);
    const bgRgb = hexToRgb(bgColor);

    if (!textRgb || !bgRgb) {
      return { ratio: 1, isValid: false, err: 'Invalid hex color code' };
    }

    const l1 = getRelativeLuminance(textRgb);
    const l2 = getRelativeLuminance(bgRgb);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    const ratio = (lighter + 0.05) / (darker + 0.05);

    return {
      ratio: Number(ratio.toFixed(2)),
      isValid: true,
      textRgb,
      bgRgb
    };
  }, [textColor, bgColor]);

  const handleSwap = () => {
    const temp = textColor;
    setTextColor(bgColor);
    setBgColor(temp);
  };

  const ratio = contrastData.ratio;
  const passAaNormal = ratio >= 4.5;
  const passAaLarge = ratio >= 3.0;
  const passAaaNormal = ratio >= 7.0;
  const passAaaLarge = ratio >= 4.5;
  const passUiComponents = ratio >= 3.0;

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Color Contrast Checker - WCAG 2.1 AA & AAA Accessibility Evaluator
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Evaluate luminance contrast between foreground text and background colors according to Web Content Accessibility Guidelines (WCAG).
        </p>
      </div>

      {/* Input Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
        {/* Text color */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2 lg:col-span-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Text / Foreground Color</span>
            <span className="font-mono text-cyan-400">{textColor}</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={textColor.startsWith('#') && textColor.length === 7 ? textColor : '#06b6d4'}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              placeholder="#06b6d4"
              className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:outline-none focus:border-cyan-500 uppercase"
            />
          </div>
        </div>

        {/* Swap button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSwap}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700/80 transition"
            title="Swap Colors"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>

        {/* Background color */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2 lg:col-span-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Background Color</span>
            <span className="font-mono text-cyan-400">{bgColor}</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={bgColor.startsWith('#') && bgColor.length === 7 ? bgColor : '#0f172a'}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              placeholder="#0f172a"
              className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:outline-none focus:border-cyan-500 uppercase"
            />
          </div>
        </div>
      </div>

      {/* Main Contrast Ratio Display */}
      <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Contrast Ratio</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl sm:text-5xl font-black font-mono text-white">{ratio}:1</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400">
              {passAaNormal ? 'Accessible AA' : 'Low Contrast'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {passAaNormal
              ? 'Meets WCAG 2.1 AA requirement for standard body text (minimum 4.5:1).'
              : 'Does not meet standard body copy requirements. Consider darkening background or lightening text.'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
          {/* AA Normal */}
          <div className={`p-3 rounded-lg border flex items-center gap-2.5 text-xs ${passAaNormal ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
            {passAaNormal ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <XCircle className="w-4 h-4 shrink-0 text-rose-400" />}
            <div>
              <div className="font-bold">WCAG AA Normal</div>
              <div className="text-[10px] opacity-80">Requires 4.5:1</div>
            </div>
          </div>

          {/* AA Large */}
          <div className={`p-3 rounded-lg border flex items-center gap-2.5 text-xs ${passAaLarge ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
            {passAaLarge ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <XCircle className="w-4 h-4 shrink-0 text-rose-400" />}
            <div>
              <div className="font-bold">WCAG AA Large</div>
              <div className="text-[10px] opacity-80">Requires 3.0:1</div>
            </div>
          </div>

          {/* AAA Normal */}
          <div className={`p-3 rounded-lg border flex items-center gap-2.5 text-xs ${passAaaNormal ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
            {passAaaNormal ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <XCircle className="w-4 h-4 shrink-0 text-rose-400" />}
            <div>
              <div className="font-bold">WCAG AAA Normal</div>
              <div className="text-[10px] opacity-80">Requires 7.0:1</div>
            </div>
          </div>

          {/* UI Components */}
          <div className={`p-3 rounded-lg border flex items-center gap-2.5 text-xs ${passUiComponents ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'}`}>
            {passUiComponents ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <XCircle className="w-4 h-4 shrink-0 text-rose-400" />}
            <div>
              <div className="font-bold">UI Elements</div>
              <div className="text-[10px] opacity-80">Requires 3.0:1</div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Visual Preview Box */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
          <Eye className="w-4 h-4 text-cyan-400" /> Real-World Typography Simulation
        </h3>

        <div
          className="p-6 rounded-xl border border-slate-700/80 space-y-4 transition-colors"
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Large Title Heading (24px Bold)</h1>
            <p className="text-xs opacity-75 mt-0.5">Meets WCAG Large text guidelines (18pt / 14pt bold).</p>
          </div>

          <div>
            <p className="text-sm leading-relaxed">
              Standard 14px body paragraph. Accessibility ensures that users with visual impairments or color blindness can read text comfortably under varying lighting conditions.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              className="px-4 py-1.5 rounded-lg text-xs font-bold border"
              style={{ borderColor: textColor, color: textColor, backgroundColor: 'transparent' }}
            >
              Outlined Button
            </button>
            <span className="text-xs font-mono">Sample UI Badge</span>
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
            <strong className="text-slate-300">What is the minimum contrast ratio required for WCAG 2.1 AA compliance?</strong>
            <p className="mt-0.5">WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text (at least 18pt or 14pt bold).</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">How is relative luminance calculated in digital color spaces?</strong>
            <p className="mt-0.5">Relative luminance measures perceived brightness of sRGB colors using standard coefficients: 0.2126 Red + 0.7152 Green + 0.0722 Blue.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Do graphical user interface elements need to pass contrast checks?</strong>
            <p className="mt-0.5">Yes, WCAG 2.1 Success Criterion 1.4.11 mandates a minimum 3:1 ratio for icons, input borders, and active interface boundaries.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
