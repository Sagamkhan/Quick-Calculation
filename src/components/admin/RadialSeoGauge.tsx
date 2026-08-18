import React from 'react';
import { SeoAnalysisResult } from '../../utils/adminSeoAnalyzer';

export interface SeoGaugeThresholds {
  redMax?: number; // default 40
  orangeMax?: number; // default 70
}

interface RadialSeoGaugeProps {
  score: number;
  rating?: string;
  size?: number;
  strokeWidth?: number;
  analysis?: SeoAnalysisResult;
  thresholds?: SeoGaugeThresholds;
}

export const RadialSeoGauge: React.FC<RadialSeoGaugeProps> = ({
  score,
  rating,
  size = 140,
  strokeWidth = 10,
  analysis,
  thresholds = { redMax: 40, orangeMax: 70 }
}) => {
  // Clamp score between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));

  // Threshold boundaries (0-40% Red, 41-70% Orange, 71-100% Green)
  const redCutoff = thresholds.redMax ?? 40;
  const orangeCutoff = thresholds.orangeMax ?? 70;

  // SVG Geometry calculation
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Calculate dash offset based on score (starts at top, clockwise)
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Determine active tier based on thresholds
  const isRed = normalizedScore <= redCutoff;
  const isOrange = normalizedScore > redCutoff && normalizedScore <= orangeCutoff;
  const isGreen = normalizedScore > orangeCutoff;

  // Dynamic Theme Palette matching explicit color-coded thresholds:
  // Red (0-40%), Orange (41-70%), Green (71-100%)
  const colorConfig = isGreen
    ? {
        tier: 'green',
        gradientStart: '#10b981', // emerald-500
        gradientEnd: '#059669', // emerald-600
        glowColor: 'rgba(16, 185, 129, 0.28)',
        textColor: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        statusLabel: 'Optimal (71-100%)'
      }
    : isOrange
    ? {
        tier: 'orange',
        gradientStart: '#f97316', // orange-500
        gradientEnd: '#ea580c', // orange-600
        glowColor: 'rgba(249, 115, 22, 0.28)',
        textColor: 'text-orange-400',
        badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
        statusLabel: 'Good (41-70%)'
      }
    : {
        tier: 'red',
        gradientStart: '#ef4444', // red-500
        gradientEnd: '#dc2626', // red-600
        glowColor: 'rgba(239, 68, 68, 0.28)',
        textColor: 'text-red-400',
        badgeBg: 'bg-red-500/10 text-red-400 border-red-500/30',
        statusLabel: 'Needs Work (0-40%)'
      };

  const gradientId = `seo-gauge-gradient-${colorConfig.tier}`;

  return (
    <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/90 relative overflow-hidden">
      {/* Ambient background glow mapped to tier color */}
      <div
        className="absolute w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-40 transition-all duration-700"
        style={{ backgroundColor: colorConfig.glowColor }}
      />

      {/* Radial SVG Container */}
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorConfig.gradientStart} />
              <stop offset="100%" stopColor={colorConfig.gradientEnd} />
            </linearGradient>
            <filter id="gauge-shadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#1e293b" // slate-800
            strokeWidth={strokeWidth}
            className="opacity-70"
          />

          {/* Threshold Boundary Tick Markers (40% and 70%) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#334155" // slate-700
            strokeWidth={strokeWidth + 1}
            strokeDasharray={`2 ${(circumference * 0.4) - 2} 2 ${(circumference * 0.3) - 2} 2 ${circumference}`}
            className="opacity-60"
          />

          {/* Active Radial Progress Arc with smooth CSS transitions */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease'
            }}
          />
        </svg>

        {/* Center Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <div className="flex items-baseline justify-center">
            <span
              className={`text-3xl sm:text-4xl font-black font-mono tracking-tight transition-colors duration-500 ${colorConfig.textColor}`}
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              {normalizedScore}
            </span>
            <span className="text-xs font-mono font-bold text-slate-400 ml-0.5">%</span>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            SEO Score
          </span>
        </div>
      </div>

      {/* Status Rating Badge below Gauge */}
      <div className="mt-2 flex items-center gap-1.5">
        <span
          className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border transition-all duration-500 ${colorConfig.badgeBg}`}
        >
          {rating || colorConfig.statusLabel}
        </span>
      </div>

      {/* Threshold Legend Guide */}
      <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-slate-800/60 text-[9px] font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
          <span>0-40%</span>
        </span>
        <span className="text-slate-600">•</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
          <span>41-70%</span>
        </span>
        <span className="text-slate-600">•</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          <span>71-100%</span>
        </span>
      </div>

      {/* Mini quick metrics footer if analysis provided */}
      {analysis && (
        <div className="w-full grid grid-cols-3 gap-1 pt-2 mt-2 border-t border-slate-800/80 text-[10px] font-mono text-center text-slate-400">
          <div className="p-1 rounded bg-slate-900/80">
            <span className="block text-slate-500">Words</span>
            <span className="font-bold text-slate-200">{analysis.words}</span>
          </div>
          <div className="p-1 rounded bg-slate-900/80">
            <span className="block text-slate-500">Density</span>
            <span className="font-bold text-slate-200">{analysis.keywordDensity}%</span>
          </div>
          <div className="p-1 rounded bg-slate-900/80">
            <span className="block text-slate-500">Links</span>
            <span className="font-bold text-cyan-400">{analysis.internalLinkCount}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RadialSeoGauge;
