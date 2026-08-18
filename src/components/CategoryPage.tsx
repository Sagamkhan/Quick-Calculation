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
  CheckCircle2
} from 'lucide-react';
import { CategoryInfo, ToolItem } from '../data/categoriesAndTools';
import BentoCatalog from './BentoCatalog';
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

  const IconComponent = CATEGORY_ICONS[category.iconName] || Bot;

  // Filter tools by local category search
  const filteredTools = tools.filter((tool) => {
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 font-sans">
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
          onClick={onGoHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Categories</span>
        </button>
      </div>

      {/* Category Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-10 shadow-xl"
      >
        {/* Top Header Accent Line */}
        <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${category.gradientHeader}`} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
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
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
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

          {/* Quick Search within Category */}
          <div className="w-full md:w-80 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700/60 space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Filter Category Tools
            </span>
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                value={catSearch}
                onChange={(e) => setCatSearch(e.target.value)}
                placeholder={`Search ${category.shortName}...`}
                className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="absolute right-2">
                <VoiceInputButton
                  onTranscript={(text) => setCatSearch(text)}
                  size="sm"
                  title="Filter tools by voice"
                />
              </div>
            </div>
            {catSearch && (
              <button
                onClick={() => setCatSearch('')}
                className="text-xs font-mono text-indigo-500 hover:underline block text-right"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Category Pills Switcher Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider mr-2">
            Other Categories:
          </span>
          <button
            onClick={() => onSelectCategory(null)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            All Tools
          </button>
          {allCategories.map((cat) => {
            const isActive = cat.id === category.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
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

      {/* Category Tools Bento Catalog */}
      <div>
        <BentoCatalog
          tools={filteredTools}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={onToggleBookmark}
          onSelectTool={onSelectTool}
          onOpenCompare={onOpenCompare}
          activeCategoryFilter={category.id}
          searchQuery={catSearch}
        />
      </div>
    </div>
  );
}
