import React from 'react';
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
  Search,
  ArrowUpRight
} from 'lucide-react';
import { CATEGORIES, CategoryInfo } from '../data/categoriesAndTools';
import { getCategoryPath } from '../utils/permalinks';

interface CategoryGridProps {
  activeCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

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

export default function CategoryGrid({
  activeCategory,
  onSelectCategory
}: CategoryGridProps) {
  return (
    <section className="py-12 bg-slate-50/50 dark:bg-[#121824]/80 border-b border-slate-200/60 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 mb-1">
              <span>Catalog Navigation</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
              Browse Tools by Category
            </h2>
          </div>
          {activeCategory && (
            <button
              onClick={() => onSelectCategory(null)}
              className="text-xs font-mono text-indigo-500 dark:text-indigo-400 hover:underline font-semibold cursor-pointer self-start sm:self-auto"
            >
              ← Clear Active Filter
            </button>
          )}
        </div>

        {/* 4-Column Responsive Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat, idx) => {
            const IconComponent = CATEGORY_ICONS[cat.iconName] || Bot;
            const isActive = activeCategory === cat.id;
            const catPath = getCategoryPath(cat.id);

            return (
              <a
                key={cat.id}
                href={catPath}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectCategory(isActive ? null : cat.id);
                }}
                className="block text-left group"
              >
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`relative p-6 rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                    isActive
                      ? `bg-white dark:bg-[#1A2130] ${cat.cardBorder} ring-2 ring-indigo-500 shadow-xl`
                      : `bg-white dark:bg-[#1A2130] border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 group-hover:scale-[1.02] ${cat.glowShadow} shadow-lg shadow-black/20`
                  }`}
                >
                  {/* Top Header Bar Gradient */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${cat.gradientHeader}`} />

                  {/* Card Interior */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className={`p-3.5 rounded-2xl transition-transform group-hover:scale-110 duration-300 ${cat.iconBg}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className={`text-[12px] font-mono font-bold px-3 py-1 rounded-full border ${cat.badgeBg}`}>
                        {cat.count} Tools
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-display font-semibold text-[1.15rem] text-slate-900 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                          {cat.name}
                        </h3>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>
                      <span className="block text-[11px] font-mono text-slate-500 dark:text-slate-300 uppercase tracking-wider mt-0.5">
                        {cat.accentName}
                      </span>
                      <p className="text-[0.95rem] text-slate-600 dark:text-[#D1D5DB] font-sans mt-2 line-clamp-2 leading-[1.6]">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
}
