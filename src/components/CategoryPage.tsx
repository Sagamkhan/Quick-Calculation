import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Bot, 
  Sparkles, 
  FileText, 
  Calculator, 
  Type, 
  Code2, 
  RefreshCw, 
  Activity, 
  ArrowLeft, 
  Search, 
  ShieldCheck, 
  Zap, 
  Sparkle,
  CheckCircle2,
  Star,
  ExternalLink,
  ArrowLeftRight,
  Bookmark,
  SlidersHorizontal
} from 'lucide-react';
import { CategoryInfo, ToolItem } from '../data/categoriesAndTools';
import Breadcrumbs from './Breadcrumbs';
import { useSEO } from '../hooks/useSEO';
import VoiceInputButton from './VoiceInputButton';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Bot,
  Sparkles,
  FileText,
  Calculator,
  Type,
  Code2,
  RefreshCw,
  Activity,
  Search
};

interface CategoryPageProps {
  category: CategoryInfo;
  allCategories: CategoryInfo[];
  tools: ToolItem[];
  bookmarkedIds: string[];
  onToggleBookmark: (tool: ToolItem) => void;
  onSelectTool: (tool: ToolItem) => void;
  onOpenCompare?: (tool: ToolItem) => void;
  onSelectCategory: (categoryId: string | null) => void;
  onGoHome: () => void;
}

export default function CategoryPage({
  category,
  allCategories,
  tools,
  bookmarkedIds,
  onToggleBookmark,
  onSelectTool,
  onOpenCompare,
  onSelectCategory,
  onGoHome,
}: CategoryPageProps) {
  // Dynamically update document title & meta description for category page
  useSEO({ categoryObj: category });

  const [catSearch, setCatSearch] = useState('');
  const [selectedComplexity, setSelectedComplexity] = useState<string | null>(null);

  const IconComponent = CATEGORY_ICONS[category.iconName] || Bot;

  // Filter tools by local search and complexity filter
  const filteredTools = tools.filter((tool) => {
    if (selectedComplexity && tool.complexity !== selectedComplexity) return false;
    if (!catSearch.trim()) return true;
    const q = catSearch.toLowerCase();
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.tags.some((t) => t.toLowerCase().includes(q)) ||
      (tool.freeAlternativeTo && tool.freeAlternativeTo.toLowerCase().includes(q))
    );
  });

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 xl:px-10 py-6 space-y-8 font-sans">
      {/* Breadcrumbs Navigation */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Breadcrumbs
          currentRoute={{ path: '/category', param: category.id }}
          onNavigate={(href) => {
            if (href === '#/' || href === '/') {
              onGoHome();
            } else {
              const catId = href.replace('#/category/', '').replace('/', '');
              onSelectCategory(catId || null);
            }
          }}
        />

        <button
          type="button"
          onClick={onGoHome}
          className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Categories</span>
        </button>
      </div>

      {/* Category Hero Banner - Full-Width with Max-W-4xl Description */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#1A2130] border border-neutral-200 dark:border-white/10 p-6 sm:p-10 shadow-xl"
      >
        {/* Top Header Accent Line */}
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${category.gradientHeader}`} />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-4xl w-full">
            {/* Category Pill Tag */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`p-3 rounded-2xl ${category.iconBg} inline-flex items-center justify-center`}>
                <IconComponent className="w-6 h-6" />
              </span>
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${category.badgeBg}`}>
                {category.count} Tools Available
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                100% Free & Open-Source
              </span>
            </div>

            {/* Title & Description */}
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-neutral-900 dark:text-white tracking-tight leading-tight">
              {category.name}
            </h1>
            <p className="max-w-4xl text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
              {category.description} Explore free interactive web calculators, privacy-first utility tools, and open-source software replacements running entirely in your browser with zero sign-up required.
            </p>

            {/* Category Highlights */}
            <div className="pt-2 flex items-center gap-6 text-xs font-mono text-neutral-500 dark:text-neutral-400 flex-wrap">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Client-Side Privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" /> Instant Execution
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkle className="w-4 h-4 text-purple-500" /> Dedicated Permalink
              </span>
            </div>
          </div>

          {/* Filter Bar: Desktop -> Right-aligned Sidebar / Box, Mobile -> Full-Width */}
          <div className="w-full lg:w-84 shrink-0 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                <span>Filter Tools</span>
              </span>
              <span className="text-xs font-mono text-neutral-400">
                {filteredTools.length} found
              </span>
            </div>

            <div className="relative flex items-center w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                value={catSearch}
                onChange={(e) => setCatSearch(e.target.value)}
                placeholder={`Search ${category.shortName}...`}
                style={{ fontSize: '16px' }}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
              />
              <div className="absolute right-2">
                <VoiceInputButton
                  onTranscript={(text) => setCatSearch(text)}
                  size="sm"
                  title="Filter tools by voice"
                />
              </div>
            </div>

            {/* Complexity Chips Filter */}
            <div className="flex items-center gap-1.5 pt-1">
              {['All', 'Easy', 'Medium', 'Advanced'].map((c) => {
                const isSelected = (c === 'All' && !selectedComplexity) || selectedComplexity === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedComplexity(c === 'All' ? null : c)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer text-center min-h-[36px] ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            {catSearch && (
              <button
                type="button"
                onClick={() => setCatSearch('')}
                className="text-xs font-mono text-indigo-500 hover:underline block text-right pt-1 cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Category Pills Switcher Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1A2130] border border-neutral-200 dark:border-white/10 shadow-sm overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider mr-2">
            Switch Category:
          </span>
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            All Tools
          </button>
          {allCategories.map((cat) => {
            const isActive = cat.id === category.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? `${cat.pillActiveBg} shadow-sm font-bold`
                    : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Tools Grid - Strict Responsive 3-Column Grid on 1440px / 2 on Tablet / 1 on Mobile */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-bold font-display text-neutral-900 dark:text-white flex items-center gap-2">
            <span>{category.name} Catalog</span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-xs font-mono font-bold">
              {filteredTools.length} {filteredTools.length === 1 ? 'Tool' : 'Tools'}
            </span>
          </h2>
          <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
            100% In-Browser Privacy • Zero Server Latency
          </span>
        </div>

        {filteredTools.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#1A2130] border border-neutral-200 dark:border-white/10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-neutral-900 dark:text-white">
              No matching tools found in this category
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Try adjusting your search query or reset the complexity filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setCatSearch('');
                setSelectedComplexity(null);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full items-stretch">
            {filteredTools.map((tool) => {
              const isBookmarked = bookmarkedIds.includes(tool.id);

              return (
                <div
                  key={tool.id}
                  onClick={() => onSelectTool(tool)}
                  className="group relative rounded-2xl p-5 bg-white dark:bg-[#1A2130] border border-slate-200/80 dark:border-white/10 hover:border-indigo-400/60 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer focus:outline-none w-full h-full"
                >
                  {/* Top Bar: Number, Badges, Bookmark, Compare */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                          #{tool.number || '00'}
                        </span>

                        {tool.isPopular && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-[11px] font-mono font-bold">
                            <Sparkles className="w-3 h-3 text-rose-500" />
                            <span>Popular</span>
                          </span>
                        )}

                        {tool.isTrending && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[11px] font-mono font-bold">
                            <Zap className="w-3 h-3 text-amber-500" />
                            <span>Trending</span>
                          </span>
                        )}

                        <span className={`px-2 py-0.5 rounded-full border text-[11px] font-mono font-bold ${
                          tool.complexity === 'Easy'
                            ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                            : tool.complexity === 'Medium'
                            ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
                            : 'bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 border-indigo-500/30'
                        }`}>
                          {tool.complexity || 'Easy'}
                        </span>
                      </div>

                      {/* Bookmark & Compare Actions */}
                      <div className="flex items-center gap-1">
                        {onOpenCompare && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenCompare(tool);
                            }}
                            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all cursor-pointer"
                            title="Compare side-by-side with another tool"
                            aria-label={`Compare ${tool.name}`}
                          >
                            <ArrowLeftRight className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBookmark(tool);
                          }}
                          className={`min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl transition-all cursor-pointer ${
                            isBookmarked
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Tool'}
                          aria-label={`Bookmark ${tool.name}`}
                        >
                          <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Tool Name */}
                    <h3 className="font-display font-bold text-base sm:text-lg text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug line-clamp-2">
                      {tool.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mt-2 line-clamp-3">
                      {tool.description}
                    </p>

                    {/* Free Alternative to Pill */}
                    {tool.freeAlternativeTo && (
                      <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[11px] font-mono font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Replaces: {tool.freeAlternativeTo}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Bar: Tags & Launch Action */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5 space-y-3">
                    {/* Tags preview */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {tool.tags.slice(0, 3).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Launch Button with Touch Target */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTool(tool);
                      }}
                      className="min-h-[44px] w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <span>Open Calculator</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
