import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Sparkles, 
  Command, 
  SlidersHorizontal,
  Bookmark,
  Heart,
  Calculator,
  Star
} from 'lucide-react';
import { CATEGORIES, ToolItem, TOOLS_CATALOG } from '../data/categoriesAndTools';
import OfflineStatusIndicator from './OfflineStatusIndicator';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: (e: React.MouseEvent<HTMLButtonElement>) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  bookmarkedCount: number;
  onOpenBookmarks: () => void;
  onToggleSidebar: () => void;
  onOpenDonate?: () => void;
  onOpenAiStudio?: () => void;
  onGoHome?: () => void;
  onSelectTool?: (tool: ToolItem) => void;
  isToolPage?: boolean;
}

export default function Navbar({
  darkMode,
  onToggleDarkMode,
  searchQuery,
  onSearchChange,
  activeCategory,
  onSelectCategory,
  bookmarkedCount,
  onOpenBookmarks,
  onToggleSidebar,
  onOpenDonate,
  onOpenAiStudio,
  onGoHome,
  onSelectTool,
  isToolPage = false
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [topCalcsOpen, setTopCalcsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 dark:bg-[#121824]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 shadow-sm' 
        : 'bg-white dark:bg-[#121824] border-b border-slate-200/50 dark:border-white/10'
    }`}>
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          
          {/* Logo & Sidebar toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onToggleSidebar}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-all cursor-pointer"
              title="Toggle Menu Sidebar"
              aria-label="Toggle Menu Sidebar"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            <button 
              onClick={() => {
                if (onGoHome) onGoHome();
              }}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-500 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <div>
                {/* Animated Logo Name: Quick Calculator */}
                <span className="font-display font-extrabold text-xl tracking-tight text-neutral-900 dark:text-white flex items-center gap-1">
                  Quick <span className="animate-text-gradient bg-gradient-to-r from-indigo-500 via-purple-500 via-rose-500 to-amber-500 bg-[200%_auto] bg-clip-text text-transparent">Calculator</span>
                </span>
                <span className="block text-[10px] font-mono font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase -mt-1">
                  Free Online Tools & Calculators
                </span>
              </div>
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              data-search-input="true"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search 250+ calculators, AI, PDF & developer tools..."
              className="w-full pl-10 pr-12 py-2 text-sm rounded-2xl bg-neutral-100 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800/80 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-[10px] font-mono text-neutral-500">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Offline Status & Cached Tools Indicator */}
            <OfflineStatusIndicator 
              onSelectTool={onSelectTool} 
              onGoHome={onGoHome} 
            />

            {/* Top Calculators Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setTopCalcsOpen(!topCalcsOpen)}
                className="relative px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono shadow-sm shadow-amber-500/20 shrink-0"
                title="Browse Top Trending Financial & Productivity Calculators"
              >
                <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950 shrink-0" />
                <span className="hidden sm:inline">Top Calculators</span>
                <span className="sm:hidden text-[11px]">Top</span>
              </button>

              {topCalcsOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setTopCalcsOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-mono font-bold text-amber-400 flex items-center justify-between">
                    <span>POPULAR CALCULATORS</span>
                    <span className="text-[10px] text-slate-500 font-normal">No Login Req.</span>
                  </div>
                  <div className="py-1 space-y-0.5">
                    {[
                      { id: 'sip-step-up-inflation', name: 'SIP Step-Up Calculator', cat: 'Finance' },
                      { id: 'home-loan-emi-prepayment', name: 'Home Loan EMI & Prepayment', cat: 'Loans' },
                      { id: 'ppf-calculator-india-2026', name: 'PPF Calculator 2026', cat: 'Investment' },
                      { id: 'gst-calculator-india', name: 'GST Calculator India', cat: 'Tax' },
                      { id: 'income-tax-calculator-2026', name: 'Income Tax FY 2025-26', cat: 'Tax' },
                      { id: 'calc_scientific_pro', name: 'Scientific Calculator', cat: 'Math' },
                      { id: 'tool_word_character_counter', name: 'Word & Character Counter', cat: 'Writing' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setTopCalcsOpen(false);
                          if (onSelectTool) {
                            const found = TOOLS_CATALOG.find(t => t.id === item.id || t.slug === item.id);
                            if (found) {
                              onSelectTool(found);
                            } else {
                              if (onGoHome) onGoHome();
                            }
                          } else if (onGoHome) {
                            onGoHome();
                          }
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800/80 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="font-medium truncate">{item.name}</span>
                        <span className="text-[10px] font-mono text-cyan-400 ml-2 shrink-0">{item.cat}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Prominent Donate Now Button - Cleanly displayed on desktop, available in mobile drawer */}
            <a
              href="/donate"
              onClick={(e) => {
                e.preventDefault();
                if (onOpenDonate) onOpenDonate();
              }}
              className="hidden lg:flex relative px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white transition-all cursor-pointer items-center gap-1.5 text-xs font-mono font-bold shadow-xs hover:shadow-sm shrink-0"
              title="Donate Now & Support Quick Calculator"
            >
              <Heart className="w-3.5 h-3.5 fill-white text-white" />
              <span>Donate</span>
            </a>

            {/* Bookmarks Counter Button */}
            <button
              onClick={onOpenBookmarks}
              className="min-h-[44px] min-w-[44px] relative p-2 sm:p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:border-amber-500/30 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-mono font-semibold"
              title="View Bookmarked Tools"
              aria-label="View Bookmarked Tools"
            >
              <Bookmark className={`w-4 h-4 ${bookmarkedCount > 0 ? 'text-amber-500 fill-amber-500' : ''}`} />
              <span className="hidden sm:inline">Saved</span>
              {bookmarkedCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-neutral-950 font-mono text-[10px] font-bold">
                  {bookmarkedCount}
                </span>
              )}
            </button>

            {/* Dark Mode Circular Wipe Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center relative p-2 sm:p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Mobile Search Toggle Button (<768px) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 cursor-pointer"
              title="Search Tools"
              aria-label="Search Tools"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 cursor-pointer"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Collapsible Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-4 space-y-3"
          >
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search tools..."
                style={{ fontSize: '16px' }}
                className="w-full pl-10 pr-4 py-2.5 text-[16px] sm:text-sm rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
              />
            </div>

            {/* Mobile Menu Donate Now Button */}
            <a
              href="/donate"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                if (onOpenDonate) onOpenDonate();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white text-white" />
              <span>Donate Now (Support Us)</span>
            </a>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-left text-xs font-medium text-neutral-800 dark:text-neutral-200 flex items-center justify-between"
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] font-mono text-neutral-400">{cat.count}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
