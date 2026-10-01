import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Heart,
  Clock,
  X,
  Trash2
} from 'lucide-react';
import VoiceInputButton from './VoiceInputButton';
import { ToolItem, CATEGORIES } from '../data/categoriesAndTools';
import { getToolPath } from '../utils/permalinks';
import { 
  getRecentSearches, 
  addRecentSearch, 
  removeRecentSearch, 
  clearRecentSearches, 
  TRENDING_SEARCH_TERMS 
} from '../utils/recentSearchesStorage';

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
  const [recentSearches, setRecentSearches] = useState<string[]>(() => getRecentSearches());
  const searchRef = useRef<HTMLDivElement>(null);

  // Sync recent searches on custom event dispatch
  useEffect(() => {
    const handleStorageUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<string[]>;
      if (customEvent.detail) {
        setRecentSearches(customEvent.detail);
      } else {
        setRecentSearches(getRecentSearches());
      }
    };
    window.addEventListener('quickcalc_recent_searches_updated', handleStorageUpdate);
    return () => window.removeEventListener('quickcalc_recent_searches_updated', handleStorageUpdate);
  }, []);

  // Filter tools for live suggestions popover when typing
  const suggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return toolsCatalog.filter(tool => 
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [searchQuery, toolsCatalog]);

  // Curate top trending tools from catalog matching popular terms
  const trendingTools = useMemo(() => {
    const matched: ToolItem[] = [];
    for (const term of TRENDING_SEARCH_TERMS) {
      const found = toolsCatalog.find(
        t => t.name.toLowerCase() === term.toLowerCase() ||
             t.name.toLowerCase().includes(term.toLowerCase())
      );
      if (found && !matched.some(m => m.id === found.id)) {
        matched.push(found);
      }
    }
    // Guarantee at least 5 tools if specific exact names differ
    if (matched.length < 5) {
      for (const t of toolsCatalog) {
        if (!matched.some(m => m.id === t.id)) {
          matched.push(t);
        }
        if (matched.length >= 5) break;
      }
    }
    return matched.slice(0, 5);
  }, [toolsCatalog]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Action Handlers
  const handleExecuteSearch = (query: string) => {
    const clean = query.trim();
    if (clean) {
      addRecentSearch(clean);
    }
    onSearchChange(clean);
    setIsFocused(false);
  };

  const handleSelectToolAndRecord = (tool: ToolItem) => {
    addRecentSearch(tool.name);
    setIsFocused(false);
    onSelectTool(tool);
  };

  const handleSelectRecent = (term: string) => {
    addRecentSearch(term);
    onSearchChange(term);
    setIsFocused(false);
  };

  const handleRemoveRecent = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    removeRecentSearch(term);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearRecentSearches();
  };

  return (
    <section className="relative pt-6 sm:pt-8 pb-10 sm:pb-12 overflow-hidden bg-slate-50 dark:bg-[#121824] border-b border-slate-200/60 dark:border-white/10">
      
      {/* Background Decorative Gradients & Particle Glow */}
      <div className="absolute inset-0 bg-grid-pattern dark:bg-grid-pattern-dark opacity-60 pointer-events-none" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-rose-500/20 blur-3xl pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 sm:space-y-6">
        
        {/* Top Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-[#1A2130] border border-slate-200 dark:border-white/10 shadow-xs"
        >
          <Calculator className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 animate-pulse" />
          <span className="text-[11px] sm:text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
            Created by Shahroz Khan • 250+ Online Calculators & Tools
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] sm:text-[11px] font-bold">
            100% Free
          </span>
        </motion.div>

        {/* Hero Animated Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3 max-w-4xl mx-auto"
        >
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Fast, Free & Private <br className="hidden sm:inline" />
            <span className="animate-text-gradient bg-gradient-to-r from-indigo-500 via-purple-500 via-rose-500 to-amber-500 bg-[200%_auto] bg-clip-text text-transparent">
              Quick Calculator
            </span>
          </h1>
          <p className="text-sm sm:text-lg text-slate-600 dark:text-[#D1D5DB] font-sans max-w-2xl mx-auto leading-relaxed">
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleExecuteSearch(searchQuery);
                  } else if (e.key === 'Escape') {
                    setIsFocused(false);
                  }
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
                type="button"
                onClick={() => handleExecuteSearch(searchQuery)}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold transition-all cursor-pointer shrink-0 hidden sm:flex items-center gap-1.5"
              >
                <span>Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Popover Dropdown (Recent Searches, Trending Tools, Live Suggestions) */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1A2130] rounded-2xl border border-slate-200 dark:border-white/15 shadow-2xl overflow-hidden z-50 text-left p-3 space-y-3 max-h-[460px] overflow-y-auto"
              >
                {/* CASE A: Active search query typed -> show instant matched suggestions */}
                {searchQuery.trim().length > 0 ? (
                  <div className="space-y-1">
                    <div className="px-2 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Search className="w-3 h-3 text-indigo-500" />
                        Matched Tool Suggestions
                      </span>
                      <span className="text-[10px] lowercase text-slate-500 font-normal">
                        {suggestions.length} match{suggestions.length === 1 ? '' : 'es'}
                      </span>
                    </div>

                    {suggestions.length > 0 ? (
                      suggestions.map((tool) => (
                        <div
                          key={tool.id}
                          className="w-full p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#252F45] transition-all flex items-center justify-between gap-3 text-left group"
                        >
                          <button
                            type="button"
                            onClick={() => handleSelectToolAndRecord(tool)}
                            className="flex items-center gap-3 flex-1 cursor-pointer min-w-0 text-left"
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
                          </button>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleSelectToolAndRecord(tool)}
                              className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all cursor-pointer inline-flex items-center gap-1.5"
                              title="Open calculator"
                            >
                              <span>Open</span>
                              <Zap className="w-3 h-3 text-amber-400" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400 font-mono space-y-2">
                        <p>No tools directly match "{searchQuery}"</p>
                        <div className="flex justify-center gap-2 flex-wrap pt-1">
                          <span className="text-[11px] text-slate-400">Quick suggestions:</span>
                          {['SIP', 'GST', 'JSON', 'PDF', 'Percentage'].map(hint => (
                            <button
                              key={hint}
                              type="button"
                              onClick={() => handleSelectRecent(hint)}
                              className="underline hover:text-indigo-500 cursor-pointer"
                            >
                              {hint}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* CASE B: Empty query focused -> Show Recent Searches + Trending Tools */
                  <div className="space-y-4">
                    {/* Recent Searches Section (if history exists) */}
                    {recentSearches.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="px-2 py-0.5 flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                          <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                            <Clock className="w-3.5 h-3.5" />
                            Recent Searches
                          </span>
                          <button
                            type="button"
                            onClick={handleClearAll}
                            className="text-[10px] font-medium text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1"
                            title="Clear recent searches"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Clear all</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {recentSearches.slice(0, 4).map((query) => (
                            <div
                              key={query}
                              className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#121824] hover:bg-indigo-50/70 dark:hover:bg-[#252F45] border border-slate-100 dark:border-white/5 transition-all group"
                            >
                              <button
                                type="button"
                                onClick={() => handleSelectRecent(query)}
                                className="flex items-center gap-2 text-left min-w-0 flex-1 cursor-pointer"
                              >
                                <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 shrink-0" />
                                <span className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                                  {query}
                                </span>
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleRemoveRecent(e, query)}
                                className="p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors rounded cursor-pointer ml-1"
                                title="Remove from history"
                                aria-label={`Remove ${query} from history`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trending Tools Section */}
                    <div className="space-y-1.5">
                      <div className="px-2 py-0.5 flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400">
                          <TrendingUp className="w-3.5 h-3.5" />
                          Trending Tools
                        </span>
                        <span className="text-[10px] lowercase text-slate-400">250+ available</span>
                      </div>

                      <div className="space-y-1">
                        {trendingTools.map((tool) => (
                          <div
                            key={tool.id}
                            className="w-full p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#252F45] transition-all flex items-center justify-between gap-3 text-left group"
                          >
                            <button
                              type="button"
                              onClick={() => handleSelectToolAndRecord(tool)}
                              className="flex items-center gap-3 flex-1 cursor-pointer min-w-0 text-left"
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
                            </button>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleSelectToolAndRecord(tool)}
                                className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all cursor-pointer inline-flex items-center gap-1.5"
                                title="Open calculator"
                              >
                                <span>Open</span>
                                <Zap className="w-3 h-3 text-amber-400" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Popular & Recent Quick Filter Chips */}
        <div className="pt-2 flex items-center justify-center gap-2 flex-wrap text-xs font-mono">
          {recentSearches.length > 0 && (
            <>
              <span className="text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-bold">
                <Clock className="w-3.5 h-3.5" />
                Recent:
              </span>
              {recentSearches.slice(0, 3).map((query) => (
                <div
                  key={`chip-recent-${query}`}
                  className="inline-flex items-center gap-1 pl-3 pr-1.5 py-1 rounded-full bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/40 text-indigo-900 dark:text-indigo-200 text-xs font-medium shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => handleSelectRecent(query)}
                    className="hover:underline cursor-pointer truncate max-w-[130px]"
                    title={`Search for ${query}`}
                  >
                    {query}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveRecent(e, query)}
                    className="p-0.5 rounded-full hover:bg-indigo-200/50 dark:hover:bg-indigo-800/50 text-indigo-400 hover:text-indigo-700 dark:hover:text-white transition-colors cursor-pointer"
                    title={`Remove ${query}`}
                    aria-label={`Remove ${query}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
            </>
          )}

          <span className="text-slate-500 dark:text-slate-300 flex items-center gap-1 font-bold">
            <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
            Trending:
          </span>
          {[
            { label: 'SIP Calculator', query: 'SIP' },
            { label: 'JSON Formatter', query: 'JSON' },
            { label: 'PDF Compress', query: 'PDF' },
            { label: 'Percentage', query: 'Percentage' },
            { label: 'GST Calculator', query: 'GST' },
            { label: 'Word Counter', query: 'Word' },
            { label: 'BMI Calculator', query: 'BMI' },
          ].map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => handleSelectRecent(chip.query)}
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
