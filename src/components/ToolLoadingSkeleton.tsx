import React from 'react';
import { Calculator, Sparkles } from 'lucide-react';

interface ToolLoadingSkeletonProps {
  message?: string;
}

export function ToolLoadingSkeleton({ message = 'Loading Quick Calculator Engine...' }: ToolLoadingSkeletonProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
      {/* Breadcrumbs skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-16 bg-slate-800 rounded-md" />
        <span className="text-slate-700">/</span>
        <div className="h-4 w-28 bg-slate-800 rounded-md" />
        <span className="text-slate-700">/</span>
        <div className="h-4 w-36 bg-slate-800/80 rounded-md" />
      </div>

      {/* Header card skeleton */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/60 border border-slate-700/50 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-6 w-24 bg-cyan-950 border border-cyan-800/50 rounded-full" />
          <div className="h-6 w-20 bg-amber-950 border border-amber-800/50 rounded-full" />
        </div>
        <div className="h-10 w-3/4 max-w-md bg-slate-700/60 rounded-xl" />
        <div className="h-5 w-full max-w-xl bg-slate-700/40 rounded-lg" />
        <div className="flex items-center gap-4 pt-2">
          <div className="h-4 w-24 bg-slate-800 rounded" />
          <div className="h-4 w-32 bg-slate-800 rounded" />
        </div>
      </div>

      {/* Main engine skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-slate-800/50 border border-slate-700/50 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-700/40">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs">
              <Calculator className="w-4 h-4 animate-spin" />
              <span>{message}</span>
            </div>
            <div className="h-4 w-20 bg-emerald-950 rounded" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-20 bg-slate-900/80 rounded-2xl border border-slate-800" />
            <div className="h-20 bg-slate-900/80 rounded-2xl border border-slate-800" />
          </div>

          <div className="h-32 bg-slate-950/70 rounded-2xl border border-slate-800" />
        </div>

        <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-800/40 border border-slate-700/40 space-y-4">
          <div className="h-6 w-32 bg-slate-700/60 rounded-lg" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-slate-700/40 rounded" />
            <div className="h-4 w-5/6 bg-slate-700/30 rounded" />
            <div className="h-4 w-4/6 bg-slate-700/30 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ToolLoadingSkeleton;
