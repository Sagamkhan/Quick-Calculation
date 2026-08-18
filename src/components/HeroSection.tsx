import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  ArrowRight, 
  Command, 
  ShieldCheck, 
  DollarSign, 
  Layers,
  Star,
  ExternalLink,
  Calculator,
  Heart
} from 'lucide-react';
import VoiceInputButton from './VoiceInputButton';
import { ToolItem, CATEGORIES } from '../data/categoriesAndTools';
import { getToolPath } from '../utils/permalinks';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  toolsCatalog: ToolItem[];
  onSelectTool: (tool: ToolItem) => void;
  onSelectCategory: (catId: string | null) => void;
  activeCategory: string | null;
  onOpenDonate?: () => void;
}

export default function HeroSection({
  searchQuery,
  onSearchChange,
  toolsCatalog,
  onSelectTool,
  onSelectCategory,
  activeCategory,
  onOpenDonate
}: HeroSectionProps) {
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter tools for live suggestions popover
  const suggestions = searchQuery.trim().length > 0
    ? toolsCatalog.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="relative pt-12 pb-16 overflow-hidden bg-slate-50 dark:bg-[#121824] border-b border-slate-200/60 dark:border-white/10">
      
      {/* Background Decorative Gradients & Particle Glow */}
      <div className="absolute inset-0 bg-grid-pattern dark:bg-grid-pattern-dark opacity-60 pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-rose-500/20 blur-3xl pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Top Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#1A2130] border border-slate-200 dark:border-white/10 shadow-sm"
        >
          <Calculator className="w-4 h-4 text-indigo-500 dark:text-indigo-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
            Created by Shahroz Khan • 250+ Online Calculators & Tools
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-bold">
            100% Free
          </span>
        </motion.div>

        {/* Hero Animated Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 max-w-4xl mx-auto"
        >
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Fast, Free & Private <br className="hidden sm:inline" />
            <span className="animate-text-gradient bg-gradient-to-r from-indigo-500 via-purple-500 via-rose-500 to-amber-500 bg-[200%_auto] bg-clip-text text-transparent">
              Quick Calculator
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-600 dark:text-[#D1D5DB] font-sans max-w-2xl mx-auto leading-relaxed">
            Discover lightweight online tools, AI prompt assistants, PDF editors, developer formatters, and financial calculators — completely free with zero registration.
          </p>
        </motion.div>

        {/* Hero Interactive Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          ref={searchRef}
          className="max-w-2xl mx-auto relative z-30"
        >
          <div className="relative group">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-md" />
            <div className="relative flex items-center bg-white dark:bg-[#1A2130] rounded-2xl border border-slate-200 dark:border-white/15 shadow-2xl overflow-hidden p-1.5">
              <Search className="w-5 h-5 ml-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                data-search-input="true"
                value={searchQuery}
                onFocus={() => setIsFocused(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setIsFocused(true);
                }}
                placeholder="Type to search (e.g., SIP Calculator, JSON Formatter, PDF Compress)..."
                className="w-full px-3 py-3 text-sm sm:text-base bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none font-sans"
              />
              <VoiceInputButton
                onTranscript={(text) => {
                  onSearchChange(text);
                  setIsFocused(true);
                }}
                size="md"
                title="Search tools by speaking"
                className="mr-1.5"
              />
              <button 
                onClick={() => onSearchChange(searchQuery)}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold transition-all cursor-pointer shrink-0 hidden sm:flex items-center gap-1.5"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Live Search Suggestions Popover Dropdown */}
          <AnimatePresence>
            {isFocused && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1A2130] rounded-2xl border border-slate-200 dark:border-white/15 shadow-2xl overflow-hidden z-50 text-left p-2 space-y-1"
              >
                <div className="px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  Instant Tool Suggestions
                </div>
                {suggestions.map((tool) => (
                  <div
                    key={tool.id}
                    className="w-full p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#252F45] transition-all flex items-center justify-between gap-3 text-left group"
                  >
                    <a
                      href={getToolPath(tool)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setIsFocused(false);
                      }}
                      className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                        {tool.number}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors truncate">
                          {tool.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-[#D1D5DB] line-clamp-1">
                          {tool.description}
                        </div>
                      </div>
                    </a>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={getToolPath(tool)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          setIsFocused(false);
                        }}
                        className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all cursor-pointer inline-flex items-center gap-1.5"
                        title="Open calculator in a new tab"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Popular Quick Filter Chips */}
        <div className="pt-2 flex items-center justify-center gap-2 flex-wrap text-xs font-mono">
          <span className="text-slate-500 dark:text-slate-300 flex items-center gap-1 font-bold">
            <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
            Popular:
          </span>
          {[
            { label: 'SIP Calculator', query: 'SIP' },
            { label: 'JSON Formatter', query: 'JSON' },
            { label: 'PDF Compress', query: 'PDF' },
            { label: 'Word Counter', query: 'Word' },
            { label: 'BMI Calculator', query: 'BMI' },
            { label: 'Unit Converter', query: 'Unit' },
          ].map((chip) => (
            <button
              key={chip.label}
              onClick={() => onSearchChange(chip.query)}
              className="px-3.5 py-1.5 rounded-full bg-white dark:bg-[#1A2130] hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all cursor-pointer font-medium shadow-xs"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Platform Core Feature Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-6">
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#1A2130] border border-slate-200/80 dark:border-white/10 text-center space-y-1 shadow-md">
            <div className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white">
              250+ Tools
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-300">
              Math, AI, PDF, Health & Dev
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#1A2130] border border-slate-200/80 dark:border-white/10 text-center space-y-1 shadow-md">
            <div className="font-display font-black text-xl sm:text-2xl text-emerald-600 dark:text-emerald-400">
              100% Free
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-300">
              Zero Paywalls or Limits
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#1A2130] border border-slate-200/80 dark:border-white/10 text-center space-y-1 shadow-md">
            <div className="font-display font-black text-xl sm:text-2xl text-purple-600 dark:text-purple-400">
              0 Registration
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-300">
              No Signups or Passwords
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#1A2130] border border-slate-200/80 dark:border-white/10 text-center space-y-1 shadow-md">
            <div className="font-display font-black text-xl sm:text-2xl text-rose-500 dark:text-rose-400">
              Client Private
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-300">
              Runs 100% in Browser
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
