/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, ShieldCheck } from "lucide-react";

export type AdFormat = "horizontal" | "vertical" | "rectangle" | "leaderboard" | "in-article";

interface AdSenseSlotProps {
  id?: string;
  format?: AdFormat;
  className?: string;
  slotId?: string;
}

/**
 * Policy-safe, zero-CLS Google AdSense placement wrapper.
 * Enforces explicit min-height reservations and visible "ADVERTISEMENT" labels.
 */
export default function AdSenseSlot({ 
  id = "default-ad", 
  format = "horizontal", 
  className = "",
  slotId = "1234567890"
}: AdSenseSlotProps) {
  // Strict min-height definitions to ensure 0 Cumulative Layout Shift (CLS)
  const formatConfigs = {
    horizontal: {
      wrapper: "min-h-[100px] h-[100px] w-full max-w-4xl mx-auto my-6",
      label: "Responsive Horizontal Banner (728x90 / Fluid)"
    },
    leaderboard: {
      wrapper: "min-h-[110px] h-[110px] w-full max-w-5xl mx-auto my-4",
      label: "Header Leaderboard Unit (970x90 / 728x90)"
    },
    vertical: {
      wrapper: "min-h-[600px] h-[600px] w-full max-w-[300px] mx-auto my-4",
      label: "Sidebar Skyscraper Unit (300x600 / 160x600)"
    },
    rectangle: {
      wrapper: "min-h-[280px] h-[280px] w-full max-w-[336px] mx-auto my-4",
      label: "Display Medium Rectangle (300x250 / 336x280)"
    },
    "in-article": {
      wrapper: "min-h-[250px] h-[250px] w-full max-w-3xl mx-auto my-6",
      label: "In-Article Fluid Ad Container"
    }
  };

  const config = formatConfigs[format] || formatConfigs.horizontal;

  return (
    <div
      id={`adsense-wrapper-${id}`}
      aria-label="Advertisement"
      className={`relative overflow-hidden rounded-2xl border border-dashed border-slate-300/80 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-950/40 flex flex-col items-center justify-center p-3 text-center transition-all ${config.wrapper} ${className}`}
    >
      {/* 10px Muted Uppercase Policy Label */}
      <span className="absolute top-2 left-3 font-mono text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase select-none">
        ADVERTISEMENT • GOOGLE ADSENSE
      </span>

      {/* Simulated Ad Container Graphic */}
      <div className="flex flex-col items-center gap-1.5 pointer-events-none select-none">
        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 font-mono text-xs">
          <Sparkles className="h-3.5 w-3.5 text-amber-500/70" />
          <span className="font-semibold">{config.label}</span>
        </div>
        <p className="font-sans text-[11px] text-slate-400 dark:text-slate-500 max-w-sm">
          AdSense will serve policy-compliant ads here once your publisher ID (<code className="font-mono text-[10px]">pub-XXXXXXXXXXXXXXXX</code>) is activated.
        </p>
      </div>

      {/* Slot Metadata Tag */}
      <div className="absolute bottom-2 right-3 flex items-center gap-1 text-[9px] font-mono text-slate-400 dark:text-slate-600 select-none">
        <ShieldCheck className="w-3 h-3 text-emerald-500/70" />
        <span>CLS Guard: Active (Slot: {slotId})</span>
      </div>
    </div>
  );
}
