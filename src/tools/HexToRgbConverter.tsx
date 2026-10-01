import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Palette, Sliders, RefreshCw } from 'lucide-react';
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

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export default function HexToRgbConverter({ tool, onBack }: ToolComponentProps) {
  const [hexInput, setHexInput] = useState<string>('#06B6D4');
  const [alpha, setAlpha] = useState<number>(100);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const colorData = useMemo(() => {
    const rgb = hexToRgb(hexInput);
    if (!rgb) {
      return { isValid: false, rgb: { r: 0, g: 0, b: 0 }, hsl: { h: 0, s: 0, l: 0 }, hexClean: '#000000' };
    }
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return {
      isValid: true,
      rgb,
      hsl,
      hexClean: rgbToHex(rgb.r, rgb.g, rgb.b)
    };
  }, [hexInput]);

  const alphaFrac = (alpha / 100).toFixed(2);
  const rgbaStr = `rgba(${colorData.rgb.r}, ${colorData.rgb.g}, ${colorData.rgb.b}, ${alphaFrac})`;
  const rgbStr = `rgb(${colorData.rgb.r}, ${colorData.rgb.g}, ${colorData.rgb.b})`;
  const hslStr = `hsl(${colorData.hsl.h}, ${colorData.hsl.s}%, ${colorData.hsl.l}%)`;
  const hslaStr = `hsla(${colorData.hsl.h}, ${colorData.hsl.s}%, ${colorData.hsl.l}%, ${alphaFrac})`;

  const handleCopy = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const handleRgbChange = (channel: 'r' | 'g' | 'b', val: number) => {
    const clamped = Math.max(0, Math.min(255, val || 0));
    const newR = channel === 'r' ? clamped : colorData.rgb.r;
    const newG = channel === 'g' ? clamped : colorData.rgb.g;
    const newB = channel === 'b' ? clamped : colorData.rgb.b;
    setHexInput(rgbToHex(newR, newG, newB).toUpperCase());
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          HEX to RGB & RGBA Converter - CSS Color Code Translator
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Convert hexadecimal color codes to RGB, RGBA, and HSL formats with transparency controls, live swatches, and CSS snippet exports.
        </p>
      </div>

      {/* Main Conversion Control Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-cyan-400" /> Color Inputs
            </h3>

            {/* Hex Input */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">HEX Color Code</span>
                <span className="font-mono text-cyan-400">{colorData.hexClean}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorData.hexClean}
                  onChange={(e) => setHexInput(e.target.value.toUpperCase())}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={hexInput}
                  onChange={(e) => setHexInput(e.target.value)}
                  placeholder="#06B6D4"
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:outline-none focus:border-cyan-500 uppercase"
                />
              </div>
            </div>

            {/* RGB Sliders */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-rose-400 font-bold">
                  <span>R</span>
                  <span>{colorData.rgb.r}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={colorData.rgb.r}
                  onChange={(e) => handleRgbChange('r', Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-emerald-400 font-bold">
                  <span>G</span>
                  <span>{colorData.rgb.g}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={colorData.rgb.g}
                  onChange={(e) => handleRgbChange('g', Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-blue-400 font-bold">
                  <span>B</span>
                  <span>{colorData.rgb.b}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={colorData.rgb.b}
                  onChange={(e) => handleRgbChange('b', Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            {/* Alpha Slider */}
            <div className="space-y-1 pt-2 border-t border-slate-800">
              <div className="flex justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Opacity / Alpha Transparency
                </span>
                <span className="font-mono text-cyan-400 font-bold">{alpha}% ({alphaFrac})</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={alpha}
                onChange={(e) => setAlpha(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Right Swatch Preview */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 flex-1 flex flex-col justify-between space-y-4">
            <span className="text-xs font-semibold text-slate-300">Color Swatch & Backdrop</span>

            {/* Swatch box with checkered pattern for alpha */}
            <div
              className="w-full h-36 rounded-xl border border-slate-700 shadow-inner relative overflow-hidden"
              style={{
                backgroundImage:
                  'linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)',
                backgroundSize: '16px 16px',
                backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px'
              }}
            >
              <div className="w-full h-full" style={{ backgroundColor: rgbaStr }} />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>HSL: {colorData.hsl.h}°, {colorData.hsl.s}%, {colorData.hsl.l}%</span>
              <span>Alpha: {alphaFrac}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copy Output Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* HEX */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">HEX</span>
            <button
              type="button"
              onClick={() => handleCopy(colorData.hexClean, 'hex')}
              className="text-cyan-400 hover:text-cyan-300"
            >
              {copiedFormat === 'hex' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="font-mono text-sm font-bold text-white truncate">{colorData.hexClean}</div>
        </div>

        {/* RGB */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">CSS RGB</span>
            <button
              type="button"
              onClick={() => handleCopy(rgbStr, 'rgb')}
              className="text-cyan-400 hover:text-cyan-300"
            >
              {copiedFormat === 'rgb' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="font-mono text-sm font-bold text-white truncate">{rgbStr}</div>
        </div>

        {/* RGBA */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">CSS RGBA</span>
            <button
              type="button"
              onClick={() => handleCopy(rgbaStr, 'rgba')}
              className="text-cyan-400 hover:text-cyan-300"
            >
              {copiedFormat === 'rgba' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="font-mono text-sm font-bold text-white truncate">{rgbaStr}</div>
        </div>

        {/* HSL */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">CSS HSL</span>
            <button
              type="button"
              onClick={() => handleCopy(hslStr, 'hsl')}
              className="text-cyan-400 hover:text-cyan-300"
            >
              {copiedFormat === 'hsl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="font-mono text-sm font-bold text-white truncate">{hslStr}</div>
        </div>
      </div>

      {/* 3-Line FAQ */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-cyan-400" /> Frequently Asked Questions
        </h4>
        <div className="space-y-2 text-xs text-slate-400 divide-y divide-slate-800/80">
          <div className="pt-2">
            <strong className="text-slate-300">How do 6-digit hex color codes translate into RGB components?</strong>
            <p className="mt-0.5">Hex digits are base-16 pairs representing red (00–FF), green (00–FF), and blue (00–FF) ranging from decimal 0 to 255.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">What is the advantage of using HSL over RGB in UI design?</strong>
            <p className="mt-0.5">HSL (Hue, Saturation, Lightness) aligns with human perception, making it easier to create harmonious hover states and lighter tints.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Does RGBA alpha value range between 0 and 1?</strong>
            <p className="mt-0.5">Yes, modern CSS RGBA and HSLA functions expect an alpha opacity decimal ranging between 0.0 (fully transparent) and 1.0 (fully opaque).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
