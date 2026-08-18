import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ArrowLeftRight, 
  Check, 
  Minus, 
  Sparkles, 
  Zap, 
  ExternalLink, 
  Search, 
  ShieldCheck, 
  Clock, 
  Star, 
  BarChart3, 
  Cpu, 
  Lock, 
  Award,
  Layers,
  HelpCircle
} from 'lucide-react';
import { ToolItem, TOOLS_CATALOG, CATEGORIES } from '../data/categoriesAndTools';
import { getToolPath } from '../utils/permalinks';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTool1?: ToolItem | null;
  initialTool2?: ToolItem | null;
  onSelectToolToLaunch: (tool: ToolItem) => void;
}

export default function CompareModal({
  isOpen,
  onClose,
  initialTool1 = null,
  initialTool2 = null,
  onSelectToolToLaunch
}: CompareModalProps) {
  // Selected tools state
  const [tool1, setTool1] = useState<ToolItem | null>(initialTool1 || TOOLS_CATALOG[0] || null);
  const [tool2, setTool2] = useState<ToolItem | null>(() => {
    if (initialTool2) return initialTool2;
    // Auto pick a secondary tool from same category or next in catalog
    if (initialTool1) {
      const sameCat = TOOLS_CATALOG.find(t => t.category === initialTool1.category && t.id !== initialTool1.id);
      return sameCat || TOOLS_CATALOG[1] || null;
    }
    return TOOLS_CATALOG[1] || null;
  });

  // Dropdown search queries for selecting tools
  const [search1, setSearch1] = useState('');
  const [search2, setSearch2] = useState('');
  const [isPicker1Open, setIsPicker1Open] = useState(false);
  const [isPicker2Open, setIsPicker2Open] = useState(false);

  // Filtered lists for selection
  const filteredTools1 = useMemo(() => {
    if (!search1.trim()) return TOOLS_CATALOG;
    const q = search1.toLowerCase();
    return TOOLS_CATALOG.filter(t => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  }, [search1]);

  const filteredTools2 = useMemo(() => {
    if (!search2.trim()) return TOOLS_CATALOG;
    const q = search2.toLowerCase();
    return TOOLS_CATALOG.filter(t => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  }, [search2]);

  // Swap tools
  const handleSwap = () => {
    const temp = tool1;
    setTool1(tool2);
    setTool2(temp);
  };

  if (!isOpen) return null;

  // Helper for complexity rating scale (1..3)
  const getComplexityScore = (comp: string) => {
    if (comp === 'Easy') return 1;
    if (comp === 'Medium') return 2;
    return 3;
  };

  // Helper for category name
  const getCatName = (catId: string) => {
    return CATEGORIES.find(c => c.id === catId)?.name || catId;
  };

  // Feature Checklist Definitions
  const FEATURE_CHECKLIST = [
    { name: 'Instant Real-time Output', key: 'instant', check: (t: ToolItem) => true },
    { name: '100% Free Forever (No SaaS Fee)', key: 'free', check: (t: ToolItem) => true },
    { name: 'Client-Side Data Privacy', key: 'privacy', check: (t: ToolItem) => true },
    { name: 'No Signup / Registration Required', key: 'nosignup', check: (t: ToolItem) => true },
    { name: 'Popular / High Demand Tool', key: 'popular', check: (t: ToolItem) => !!t.isPopular },
    { name: 'Trending Tool', key: 'trending', check: (t: ToolItem) => !!t.isTrending },
    { name: 'SaaS Alternative Support', key: 'alternative', check: (t: ToolItem) => !!t.freeAlternativeTo },
    { name: 'Interactive Controls & Inputs', key: 'interactive', check: (t: ToolItem) => !!t.interactiveType },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl bg-white dark:bg-[#151C2C] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-white/10 overflow-hidden flex flex-col max-h-[92vh] my-auto z-10"
        >
          {/* Header Bar */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 text-white flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-md">
                <ArrowLeftRight className="w-6 h-6 text-indigo-300" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Tool Side-by-Side Comparison</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    Pro Specs
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-sans mt-0.5">
                  Compare features, execution model, complexity, and SaaS replacements.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Close Comparison (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tool Selector Bar */}
          <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#1A2130] border-b border-slate-200 dark:border-white/10 grid grid-cols-1 md:grid-cols-11 gap-3 items-center shrink-0">
            {/* Tool 1 Picker */}
            <div className="md:col-span-5 relative">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-bold">
                Select Tool A
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsPicker1Open(!isPicker1Open);
                    setIsPicker2Open(false);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#20293A] border border-slate-300 dark:border-white/10 text-left font-display font-semibold text-sm sm:text-base text-slate-900 dark:text-white flex items-center justify-between hover:border-indigo-500 transition-all cursor-pointer shadow-xs"
                >
                  <span className="truncate">{tool1 ? `#${tool1.number} - ${tool1.name}` : 'Select a tool...'}</span>
                  <Search className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                </button>

                {/* Dropdown */}
                {isPicker1Open && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-30 max-h-60 overflow-y-auto bg-white dark:bg-[#20293A] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-2 space-y-1">
                    <input
                      type="text"
                      placeholder="Type to search tools..."
                      value={search1}
                      onChange={(e) => setSearch1(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-[#151C2C] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {filteredTools1.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setTool1(t);
                          setIsPicker1Open(false);
                          setSearch1('');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-sans flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-all cursor-pointer ${
                          tool1?.id === t.id ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-bold' : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span className="truncate">#{t.number} {t.name}</span>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 ml-2 shrink-0">{getCatName(t.category)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center py-1 md:py-0">
              <button
                type="button"
                onClick={handleSwap}
                className="p-2.5 rounded-full bg-white dark:bg-[#20293A] border border-slate-300 dark:border-white/10 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-all cursor-pointer shadow-xs"
                title="Swap Tools Side"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* Tool 2 Picker */}
            <div className="md:col-span-5 relative">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-bold">
                Select Tool B
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsPicker2Open(!isPicker2Open);
                    setIsPicker1Open(false);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#20293A] border border-slate-300 dark:border-white/10 text-left font-display font-semibold text-sm sm:text-base text-slate-900 dark:text-white flex items-center justify-between hover:border-indigo-500 transition-all cursor-pointer shadow-xs"
                >
                  <span className="truncate">{tool2 ? `#${tool2.number} - ${tool2.name}` : 'Select a tool...'}</span>
                  <Search className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                </button>

                {/* Dropdown */}
                {isPicker2Open && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-30 max-h-60 overflow-y-auto bg-white dark:bg-[#20293A] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-2 space-y-1">
                    <input
                      type="text"
                      placeholder="Type to search tools..."
                      value={search2}
                      onChange={(e) => setSearch2(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-[#151C2C] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {filteredTools2.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setTool2(t);
                          setIsPicker2Open(false);
                          setSearch2('');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-sans flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-all cursor-pointer ${
                          tool2?.id === t.id ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 font-bold' : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span className="truncate">#{t.number} {t.name}</span>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 ml-2 shrink-0">{getCatName(t.category)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6 sm:space-y-8 flex-1">
            {tool1 && tool2 ? (
              <>
                {/* Side-by-Side Overview Headers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Tool 1 Card */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 dark:bg-[#1E2738] border border-slate-200/80 dark:border-white/10 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold border border-indigo-500/20">
                          #{tool1.number} • {getCatName(tool1.category)}
                        </span>
                        {tool1.isPopular && (
                          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                            <Sparkles className="w-3 h-3" /> Popular
                          </span>
                        )}
                      </div>

                      <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white leading-tight">
                        {tool1.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 font-sans line-clamp-3 leading-relaxed">
                        {tool1.description}
                      </p>
                    </div>

                    <a
                      href={getToolPath(tool1)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>Launch {tool1.name} in New Tab</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
                    </a>
                  </div>

                  {/* Tool 2 Card */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/80 dark:bg-[#1E2738] border border-slate-200/80 dark:border-white/10 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-xs font-bold border border-purple-500/20">
                          #{tool2.number} • {getCatName(tool2.category)}
                        </span>
                        {tool2.isPopular && (
                          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                            <Sparkles className="w-3 h-3" /> Popular
                          </span>
                        )}
                      </div>

                      <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white leading-tight">
                        {tool2.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 font-sans line-clamp-3 leading-relaxed">
                        {tool2.description}
                      </p>
                    </div>

                    <a
                      href={getToolPath(tool2)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-display font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>Launch {tool2.name} in New Tab</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
                    </a>
                  </div>
                </div>

                {/* 1. Technical & Complexity Comparison Section */}
                <div className="space-y-4">
                  <h4 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
                    <BarChart3 className="w-5 h-5 text-indigo-500" />
                    <span>1. Complexity & Execution Profile</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tool 1 Spec Box */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#1A2130] border border-slate-200 dark:border-white/10 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-slate-500 dark:text-slate-400 font-bold">COMPLEXITY LEVEL</span>
                        <span className={`px-2.5 py-0.5 rounded-md font-mono font-extrabold ${
                          tool1.complexity === 'Easy' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                          tool1.complexity === 'Medium' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' :
                          'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                        }`}>
                          {tool1.complexity}
                        </span>
                      </div>

                      {/* Visual Meter */}
                      <div className="w-full bg-slate-100 dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            tool1.complexity === 'Easy' ? 'w-1/3 bg-emerald-500' :
                            tool1.complexity === 'Medium' ? 'w-2/3 bg-amber-500' :
                            'w-full bg-indigo-500'
                          }`}
                        />
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 font-mono text-[11px] block">ESTIMATED TIME</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{tool1.readTime}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-mono text-[11px] block">SAAS REPLACEMENT</span>
                          <span className="font-semibold text-purple-600 dark:text-purple-300 truncate block">
                            {tool1.freeAlternativeTo || 'Standalone Tool'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tool 2 Spec Box */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#1A2130] border border-slate-200 dark:border-white/10 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-slate-500 dark:text-slate-400 font-bold">COMPLEXITY LEVEL</span>
                        <span className={`px-2.5 py-0.5 rounded-md font-mono font-extrabold ${
                          tool2.complexity === 'Easy' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                          tool2.complexity === 'Medium' ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' :
                          'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                        }`}>
                          {tool2.complexity}
                        </span>
                      </div>

                      {/* Visual Meter */}
                      <div className="w-full bg-slate-100 dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            tool2.complexity === 'Easy' ? 'w-1/3 bg-emerald-500' :
                            tool2.complexity === 'Medium' ? 'w-2/3 bg-amber-500' :
                            'w-full bg-indigo-500'
                          }`}
                        />
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 font-mono text-[11px] block">ESTIMATED TIME</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{tool2.readTime}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-mono text-[11px] block">SAAS REPLACEMENT</span>
                          <span className="font-semibold text-purple-600 dark:text-purple-300 truncate block">
                            {tool2.freeAlternativeTo || 'Standalone Tool'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Side-by-Side Feature Checklist Table */}
                <div className="space-y-4">
                  <h4 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-500" />
                    <span>2. Core Feature & Capabilities Matrix</span>
                  </h4>

                  <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-[#1A2130]">
                    <div className="grid grid-cols-12 bg-slate-100 dark:bg-white/5 p-3 text-xs font-mono font-bold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-white/10">
                      <div className="col-span-6 sm:col-span-6">CAPABILITY / FEATURE</div>
                      <div className="col-span-3 sm:col-span-3 text-center truncate px-1">{tool1.name}</div>
                      <div className="col-span-3 sm:col-span-3 text-center truncate px-1">{tool2.name}</div>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                      {FEATURE_CHECKLIST.map((feat) => {
                        const has1 = feat.check(tool1);
                        const has2 = feat.check(tool2);

                        return (
                          <div key={feat.key} className="grid grid-cols-12 p-3 text-xs sm:text-sm items-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                            <div className="col-span-6 sm:col-span-6 font-medium text-slate-800 dark:text-slate-200">
                              {feat.name}
                            </div>
                            <div className="col-span-3 sm:col-span-3 flex justify-center">
                              {has1 ? (
                                <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                                  <Check className="w-4 h-4" />
                                </span>
                              ) : (
                                <span className="p-1 rounded-full bg-slate-200 dark:bg-white/10 text-slate-400">
                                  <Minus className="w-4 h-4" />
                                </span>
                              )}
                            </div>
                            <div className="col-span-3 sm:col-span-3 flex justify-center">
                              {has2 ? (
                                <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                                  <Check className="w-4 h-4" />
                                </span>
                              ) : (
                                <span className="p-1 rounded-full bg-slate-200 dark:bg-white/10 text-slate-400">
                                  <Minus className="w-4 h-4" />
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. Tags & Keywords Comparison */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider font-mono text-slate-500 dark:text-slate-400">
                    Associated Search Tags & Domain Focus
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                      {tool1.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-white dark:bg-[#20293A] text-slate-700 dark:text-slate-300 font-mono text-[11px] border border-slate-200 dark:border-white/10">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                      {tool2.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-md bg-white dark:bg-[#20293A] text-slate-700 dark:text-slate-300 font-mono text-[11px] border border-slate-200 dark:border-white/10">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                Please select two tools above to view their side-by-side comparison.
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-4 sm:p-5 bg-slate-100 dark:bg-[#1A2130] border-t border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>All 250+ tools execute 100% locally in your browser with zero data logging.</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white font-sans font-semibold transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
