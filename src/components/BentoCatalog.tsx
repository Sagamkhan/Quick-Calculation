import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Zap, 
  Star, 
  ArrowRight, 
  ExternalLink, 
  SlidersHorizontal,
  Bot,
  FileText,
  Calculator,
  Type,
  Code2,
  RefreshCw,
  Activity,
  Bookmark,
  Check,
  Search,
  Keyboard,
  ArrowLeftRight
} from 'lucide-react';
import { ToolItem, CATEGORIES, CategoryInfo } from '../data/categoriesAndTools';
import { getToolPath, getCategoryPath } from '../utils/permalinks';

interface BentoCatalogProps {
  tools: ToolItem[];
  bookmarkedIds: string[];
  onToggleBookmark: (tool: ToolItem) => void;
  onSelectTool: (tool: ToolItem) => void;
  onSelectCategory?: (catId: string) => void;
  onOpenCompare?: (tool: ToolItem) => void;
  isLoading?: boolean;
  activeCategoryFilter: string | null;
  searchQuery: string;
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

export default function BentoCatalog({
  tools,
  bookmarkedIds,
  onToggleBookmark,
  onSelectTool,
  onSelectCategory,
  onOpenCompare,
  isLoading = false,
  activeCategoryFilter,
  searchQuery
}: BentoCatalogProps) {

  const [focusedToolId, setFocusedToolId] = useState<string | null>(null);
  const [gridCols, setGridCols] = useState<number>(3);
  const toolCardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth < 768) setGridCols(1);
      else if (window.innerWidth < 1024) setGridCols(2);
      else setGridCols(3);
    };
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  // IntersectionObserver custom hook for lazy-loading graphics and cards
  const useLazyIntersection = (rootMargin = '250px 0px') => {
    const targetRef = useRef<HTMLDivElement | null>(null);
    const [isIntersected, setIsIntersected] = useState(false);

    useEffect(() => {
      const node = targetRef.current;
      if (!node) return;

      if (typeof IntersectionObserver === 'undefined') {
        setIsIntersected(true);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsIntersected(true);
            observer.unobserve(entry.target);
          }
        },
        { rootMargin, threshold: 0.01 }
      );

      observer.observe(node);
      return () => {
        if (node) observer.unobserve(node);
      };
    }, [rootMargin]);

    return { targetRef, isIntersected };
  };

  // Group tools by category
  const categoriesToRender = activeCategoryFilter
    ? CATEGORIES.filter(c => c.id === activeCategoryFilter)
    : CATEGORIES;

  const isMultiCategoryView = !activeCategoryFilter && !searchQuery;

  // Flattened list of visible tools for keyboard spatial indexing
  const visibleTools = useMemo(() => {
    return categoriesToRender.flatMap(category => {
      const catTools = tools.filter(t => t.category === category.id);
      return isMultiCategoryView ? catTools.slice(0, 6) : catTools;
    });
  }, [categoriesToRender, tools, isMultiCategoryView]);

  // Ensure focusedToolId stays valid when filtered tools change
  useEffect(() => {
    if (focusedToolId && !visibleTools.some(t => t.id === focusedToolId)) {
      setFocusedToolId(null);
    }
  }, [visibleTools, focusedToolId]);

  // Spatial 2D Arrow Key & Enter Navigation Handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent, currentTool: ToolItem) => {
    const currentIndex = visibleTools.findIndex(t => t.id === currentTool.id);
    if (currentIndex === -1) return;

    const currentCategoryTools = tools.filter(t => t.category === currentTool.category);
    const toolIndexInCategory = currentCategoryTools.findIndex(t => t.id === currentTool.id);
    const categoryIndex = categoriesToRender.findIndex(c => c.id === currentTool.category);

    let nextToolId: string | null = null;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectTool(currentTool);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (toolIndexInCategory < currentCategoryTools.length - 1) {
        nextToolId = currentCategoryTools[toolIndexInCategory + 1].id;
      } else {
        const nextCategoryIndex = categoryIndex + gridCols;
        if (nextCategoryIndex < categoriesToRender.length) {
          const nextCat = categoriesToRender[nextCategoryIndex];
          const nextCatTools = tools.filter(t => t.category === nextCat.id);
          if (nextCatTools.length > 0) {
            nextToolId = nextCatTools[0].id;
          }
        } else if (currentIndex < visibleTools.length - 1) {
          nextToolId = visibleTools[currentIndex + 1].id;
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (toolIndexInCategory > 0) {
        nextToolId = currentCategoryTools[toolIndexInCategory - 1].id;
      } else {
        const prevCategoryIndex = categoryIndex - gridCols;
        if (prevCategoryIndex >= 0) {
          const prevCat = categoriesToRender[prevCategoryIndex];
          const prevCatTools = tools.filter(t => t.category === prevCat.id);
          if (prevCatTools.length > 0) {
            nextToolId = prevCatTools[prevCatTools.length - 1].id;
          }
        } else if (currentIndex > 0) {
          nextToolId = visibleTools[currentIndex - 1].id;
        }
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const rightCategoryIndex = categoryIndex + 1;
      if (rightCategoryIndex < categoriesToRender.length) {
        const rightCat = categoriesToRender[rightCategoryIndex];
        const rightCatTools = tools.filter(t => t.category === rightCat.id);
        if (rightCatTools.length > 0) {
          const targetIndex = Math.min(toolIndexInCategory, rightCatTools.length - 1);
          nextToolId = rightCatTools[targetIndex].id;
        }
      }
      if (!nextToolId && currentIndex < visibleTools.length - 1) {
        nextToolId = visibleTools[currentIndex + 1].id;
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const leftCategoryIndex = categoryIndex - 1;
      if (leftCategoryIndex >= 0) {
        const leftCat = categoriesToRender[leftCategoryIndex];
        const leftCatTools = tools.filter(t => t.category === leftCat.id);
        if (leftCatTools.length > 0) {
          const targetIndex = Math.min(toolIndexInCategory, leftCatTools.length - 1);
          nextToolId = leftCatTools[targetIndex].id;
        }
      }
      if (!nextToolId && currentIndex > 0) {
        nextToolId = visibleTools[currentIndex - 1].id;
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      if (visibleTools.length > 0) {
        nextToolId = visibleTools[0].id;
      }
    } else if (e.key === 'End') {
      e.preventDefault();
      if (visibleTools.length > 0) {
        nextToolId = visibleTools[visibleTools.length - 1].id;
      }
    }

    if (nextToolId) {
      setFocusedToolId(nextToolId);
      const targetEl = toolCardRefs.current[nextToolId];
      if (targetEl) {
        targetEl.focus();
        targetEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [visibleTools, tools, categoriesToRender, gridCols, onSelectTool]);

  return (
    <section id="tools-catalog" className="py-12 bg-slate-50 dark:bg-[#121824]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Catalog Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 mb-1">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Bento Tools Directory</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
              {activeCategoryFilter 
                ? `${CATEGORIES.find(c => c.id === activeCategoryFilter)?.name} Tools` 
                : searchQuery 
                ? `Search Results for "${searchQuery}"` 
                : 'Main Tools Directory'}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Keyboard Shortcut Banner Indicator */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-mono font-medium shadow-xs">
              <Keyboard className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="hidden sm:inline">Use <kbd className="px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold">←</kbd> <kbd className="px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold">→</kbd> <kbd className="px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold">↓</kbd> to navigate • <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold">Enter ↵</kbd> to launch</span>
              <span className="sm:hidden">Keyboard Nav Active</span>
            </div>

            <div className="text-xs font-mono text-slate-500 dark:text-slate-300">
              Showing <strong className="text-slate-900 dark:text-white">{tools.length}</strong> active tools
            </div>
          </div>
        </div>

        {/* Shimmer Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((sk) => (
              <div key={sk} className="p-6 rounded-3xl bg-slate-100 dark:bg-[#1A2130] border border-slate-200 dark:border-white/10 space-y-4 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-1/3" />
                <div className="h-6 bg-slate-200 dark:bg-slate-700/50 rounded w-2/3" />
                <div className="h-12 bg-slate-200 dark:bg-slate-700/50 rounded" />
              </div>
            ))}
          </div>
        ) : tools.length === 0 ? (
          /* Empty Search State */
          <div className="py-16 text-center space-y-4 max-w-md mx-auto">
            <div className="p-4 rounded-full bg-slate-100 dark:bg-[#1A2130] w-16 h-16 mx-auto flex items-center justify-center text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              No matching tools found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Try adjusting your search query or removing active category filters.
            </p>
          </div>
        ) : (
          /* Bento Box Grid Layout (Strict 1 -> 2 -> 3 Column Uniform Grid with Equal Heights) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {categoriesToRender.map((category) => {
              const categoryTools = tools.filter(t => t.category === category.id);
              if (categoryTools.length === 0) return null;

              // Enforce strict slice of max 6 tools on multi-category homepage grid
              const displayedTools = isMultiCategoryView ? categoryTools.slice(0, 6) : categoryTools;

              return (
                <BentoCategoryCard
                  key={category.id}
                  category={category}
                  categoryTools={categoryTools}
                  displayedTools={displayedTools}
                  isMultiCategoryView={isMultiCategoryView}
                  bookmarkedIds={bookmarkedIds}
                  focusedToolId={focusedToolId}
                  visibleTools={visibleTools}
                  toolCardRefs={toolCardRefs}
                  handleKeyDown={handleKeyDown}
                  setFocusedToolId={setFocusedToolId}
                  onSelectTool={onSelectTool}
                  onSelectCategory={onSelectCategory}
                  onToggleBookmark={onToggleBookmark}
                  onOpenCompare={onOpenCompare}
                />
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

interface BentoCategoryCardProps {
  key?: string;
  category: CategoryInfo;
  categoryTools: ToolItem[];
  displayedTools: ToolItem[];
  isMultiCategoryView: boolean;
  bookmarkedIds: string[];
  focusedToolId: string | null;
  visibleTools: ToolItem[];
  toolCardRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  handleKeyDown: (e: React.KeyboardEvent, tool: ToolItem) => void;
  setFocusedToolId: (id: string) => void;
  onSelectTool: (tool: ToolItem) => void;
  onSelectCategory?: (catId: string) => void;
  onToggleBookmark: (tool: ToolItem) => void;
  onOpenCompare?: (tool: ToolItem) => void;
}

function BentoCategoryCard({
  category,
  categoryTools,
  displayedTools,
  isMultiCategoryView,
  bookmarkedIds,
  focusedToolId,
  visibleTools,
  toolCardRefs,
  handleKeyDown,
  setFocusedToolId,
  onSelectTool,
  onSelectCategory,
  onToggleBookmark,
  onOpenCompare
}: BentoCategoryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isIntersected, setIsIntersected] = useState(false);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsIntersected(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersected(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '300px 0px', threshold: 0.01 }
    );

    observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, []);

  const IconComp = CATEGORY_ICONS[category.iconName] || Bot;

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#1A2130] shadow-xl shadow-slate-900/5 dark:shadow-black/40 overflow-hidden flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/20 transition-all duration-200 h-full"
    >
      {/* Bento Box Header Bar with Exact Category Color System Gradient */}
      <div className={`p-5 bg-gradient-to-r ${category.gradientHeader} text-white flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
            {isIntersected ? (
              <IconComp className="w-5 h-5 text-white" />
            ) : (
              <div className="w-5 h-5 bg-white/30 rounded-md animate-pulse" />
            )}
          </div>
          <div>
            <h3 className="font-display font-bold text-lg leading-tight">
              {category.name}
            </h3>
            <span className="text-[11px] font-mono text-white/90 uppercase tracking-wider">
              {category.accentName}
            </span>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-black/25 text-white font-mono text-xs font-bold backdrop-blur-md">
          {categoryTools.length}
        </span>
      </div>

      {/* Vertical Tools List inside Bento Category Box (Sliced to max 6) */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-start space-y-4 divide-y divide-slate-100 dark:divide-white/10">
        {displayedTools.map((tool) => {
          const isBookmarked = bookmarkedIds.includes(tool.id);
          const isFocused = focusedToolId === tool.id;
          const isFirstOverall = visibleTools[0]?.id === tool.id;

          return (
            <div
              key={tool.id}
              ref={(el) => { toolCardRefs.current[tool.id] = el; }}
              tabIndex={isFocused || (!focusedToolId && isFirstOverall) ? 0 : -1}
              role="button"
              aria-label={`Open tool: ${tool.name}`}
              aria-selected={isFocused}
              onKeyDown={(e) => handleKeyDown(e, tool)}
              onFocus={() => setFocusedToolId(tool.id)}
              onClick={() => {
                setFocusedToolId(tool.id);
                onSelectTool(tool);
              }}
              className={`pt-4 first:pt-0 group relative rounded-2xl p-4 sm:p-5 transition-all duration-200 border cursor-pointer focus:outline-none ${
                isFocused
                  ? 'bg-indigo-50/90 dark:bg-indigo-950/70 border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-[#1A2130] shadow-lg scale-[1.01]'
                  : 'bg-slate-50/70 dark:bg-[#20293A] hover:bg-white dark:hover:bg-[#283348] border-slate-200/70 dark:border-white/10 hover:border-indigo-400/50 dark:hover:border-indigo-400/60 shadow-xs hover:shadow-md'
              }`}
            >
              {/* Top Row: Sequential Number, Badges & Bookmark */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Sequential Number Badge */}
                  <span className={`font-mono text-[13px] font-extrabold px-2.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-white/10 ${
                    isFocused ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-300'
                  }`}>
                    #{tool.number}
                  </span>

                  {/* Popular Badge with Lazy Graphic Icon */}
                  {tool.isPopular && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-[13px] font-mono font-bold">
                      {isIntersected ? (
                        <Sparkles className="w-3 h-3 text-rose-500" />
                      ) : (
                        <span className="w-3 h-3 rounded-full bg-rose-400/30 animate-pulse" />
                      )}
                      <span>Popular</span>
                    </span>
                  )}

                  {/* Trending Badge with Lazy Graphic Icon */}
                  {tool.isTrending && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[13px] font-mono font-bold">
                      {isIntersected ? (
                        <Zap className="w-3 h-3 text-amber-500" />
                      ) : (
                        <span className="w-3 h-3 rounded-full bg-amber-400/30 animate-pulse" />
                      )}
                      <span>Trending</span>
                    </span>
                  )}

                  {/* Complexity Badge */}
                  <span className={`px-2.5 py-1 rounded-full border text-[13px] font-mono font-bold ${
                    tool.complexity === 'Easy'
                      ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                      : tool.complexity === 'Medium'
                      ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
                      : 'bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 border-indigo-500/30'
                  }`}>
                    {tool.complexity}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Active Enter Badge Indicator */}
                  {isFocused && (
                    <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-mono text-[11px] font-bold shadow-xs flex items-center gap-1">
                      <span>Enter ↵</span>
                    </span>
                  )}

                  {/* Launch Tool Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTool(tool);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all cursor-pointer"
                    title="Launch Tool"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  {/* Compare Tool Button */}
                  {onOpenCompare && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCompare(tool);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.stopPropagation();
                          e.preventDefault();
                          onOpenCompare(tool);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all cursor-pointer"
                      title="Compare side-by-side with another tool"
                    >
                      <ArrowLeftRight className="w-4 h-4" />
                    </button>
                  )}

                  {/* Bookmark Star Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(tool);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.stopPropagation();
                        e.preventDefault();
                        onToggleBookmark(tool);
                      }
                    }}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      isBookmarked
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700'
                    }`}
                    title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Tool'}
                  >
                    <Star className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Tool Name & Click Action */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTool(tool);
                }}
                className="block w-full text-left space-y-1.5 cursor-pointer"
              >
                <h4 className="font-display font-semibold text-[1.15rem] sm:text-[1.2rem] text-slate-900 dark:text-white dark:text-[#F8FAFC] flex items-center justify-between leading-snug">
                  <span className={`transition-colors ${isFocused ? 'text-indigo-600 dark:text-indigo-300 font-bold' : 'group-hover:text-indigo-500 dark:group-hover:text-indigo-400'}`}>
                    {tool.name}
                  </span>
                  <ArrowRight className={`w-4 h-4 transition-all shrink-0 ml-2 ${
                    isFocused 
                      ? 'text-indigo-600 dark:text-indigo-400 opacity-100 translate-x-1' 
                      : 'text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
                  }`} />
                </h4>

                <p className="text-[0.95rem] text-slate-600 dark:text-[#D1D5DB] font-sans leading-[1.6] line-clamp-2">
                  {tool.description}
                </p>
              </div>

              {/* Bottom Row: Free Alternative & Read Time */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-[13px] font-mono text-slate-500 dark:text-slate-300">
                {tool.freeAlternativeTo ? (
                  <span className="text-purple-600 dark:text-purple-300 font-medium truncate max-w-[200px]">
                    ⇄ {tool.freeAlternativeTo}
                  </span>
                ) : (
                  <span>100% Web Tool</span>
                )}
                <span className="text-slate-500 dark:text-slate-300 font-medium">{tool.readTime}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prominent Action Button: View All Category Tools */}
      {isMultiCategoryView && (
        <div className="p-4 sm:px-5 sm:pb-5 pt-0 mt-auto border-t border-slate-100 dark:border-white/10">
          <button
            type="button"
            onClick={() => {
              if (onSelectCategory) {
                onSelectCategory(category.id);
              }
            }}
            className="group/btn w-full py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-indigo-600 hover:text-white dark:bg-white/5 dark:hover:bg-indigo-600 dark:hover:text-white border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-slate-100 font-display font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-xs hover:shadow-lg cursor-pointer"
          >
            <span>
              {category.id === 'seo-website-tools'
                ? 'View All 22 SEO & Keyword Tools ➔'
                : `View All ${category.name} Tools (${categoryTools.length})`}
            </span>
            {category.id !== 'seo-website-tools' && (
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1.5 text-indigo-500 group-hover/btn:text-white" />
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
}
