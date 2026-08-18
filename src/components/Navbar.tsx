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
  Calculator
} from 'lucide-react';
import { CATEGORIES } from '../data/categoriesAndTools';
import { getCategoryPath } from '../utils/permalinks';

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
  onGoHome?: () => void;
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
  onGoHome
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Sidebar toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-all cursor-pointer"
              title="Toggle Menu Sidebar"
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
            
            {/* Prominent Donate Now Button */}
            <a
              href="/donate"
              onClick={(e) => {
                e.preventDefault();
                if (onOpenDonate) onOpenDonate();
              }}
              className="relative px-3 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold shadow-md shadow-rose-500/20 hover:shadow-lg hover:shadow-rose-500/30 group shrink-0"
              title="Donate Now & Support Quick Calculator"
            >
              <Heart className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
              <span className="font-extrabold tracking-tight">Donate Now</span>
            </a>

            {/* Bookmarks Counter Button */}
            <button
              onClick={onOpenBookmarks}
              className="relative p-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:border-amber-500/30 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono font-semibold"
              title="View Bookmarked Tools"
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
              className="relative p-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Category Pills Sub-Bar */}
        <div className="py-2 overflow-x-auto no-scrollbar flex items-center gap-2 border-t border-neutral-100 dark:border-neutral-900">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              if (onGoHome) onGoHome();
              onSelectCategory(null);
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === null
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-semibold'
                : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            All Categories
          </a>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <a
                key={cat.id}
                href={getCategoryPath(cat.id)}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectCategory(isActive ? null : cat.id);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? cat.pillActiveBg + ' font-bold shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800'
                }`}
              >
                <span>{cat.shortName}</span>
                <span className="opacity-60 text-[10px] font-mono">({cat.count})</span>
              </a>
            );
          })}
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
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
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
