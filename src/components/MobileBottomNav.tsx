import React from 'react';
import { 
  Calculator, 
  Grid3X3, 
  Search, 
  Bookmark, 
  ArrowLeftRight 
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'home' | 'categories' | 'search' | 'saved' | 'compare';
  onSelectTab: (tab: 'home' | 'categories' | 'search' | 'saved' | 'compare') => void;
  bookmarkedCount: number;
  isToolActive: boolean;
  onGoHome: () => void;
  onOpenCategoryDrawer: () => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onOpenCompare: () => void;
}

export default function MobileBottomNav({
  activeTab,
  onSelectTab,
  bookmarkedCount,
  isToolActive,
  onGoHome,
  onOpenCategoryDrawer,
  onOpenSearch,
  onOpenBookmarks,
  onOpenCompare
}: MobileBottomNavProps) {
  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-900/95 dark:bg-[#0c121e]/95 backdrop-blur-xl border-t border-slate-800 shadow-[0_-4px_24px_rgba(0,0,0,0.4)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1 max-w-md mx-auto">
        {/* 1. Home / Calculators */}
        <button
          type="button"
          onClick={() => {
            onSelectTab('home');
            onGoHome();
          }}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'home' && !isToolActive
              ? 'text-cyan-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Calculator className={`w-5 h-5 transition-transform ${activeTab === 'home' ? 'scale-110' : ''}`} />
            {activeTab === 'home' && !isToolActive && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1 leading-none">
            Tools
          </span>
        </button>

        {/* 2. Categories Drawer Trigger */}
        <button
          type="button"
          onClick={() => {
            onSelectTab('categories');
            onOpenCategoryDrawer();
          }}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'categories'
              ? 'text-purple-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Grid3X3 className={`w-5 h-5 transition-transform ${activeTab === 'categories' ? 'scale-110' : ''}`} />
            {activeTab === 'categories' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-400" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1 leading-none">
            Categories
          </span>
        </button>

        {/* 3. Search Quick Trigger */}
        <button
          type="button"
          onClick={() => {
            onSelectTab('search');
            onOpenSearch();
          }}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'search'
              ? 'text-indigo-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Search className={`w-5 h-5 transition-transform ${activeTab === 'search' ? 'scale-110' : ''}`} />
            {activeTab === 'search' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-400" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1 leading-none">
            Search
          </span>
        </button>

        {/* 4. Saved / Bookmarks */}
        <button
          type="button"
          onClick={() => {
            onSelectTab('saved');
            onOpenBookmarks();
          }}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'saved'
              ? 'text-amber-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Bookmark className={`w-5 h-5 transition-transform ${activeTab === 'saved' ? 'scale-110' : ''}`} />
            {bookmarkedCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-slate-950 font-mono text-[9px] font-bold flex items-center justify-center shadow-sm">
                {bookmarkedCount}
              </span>
            )}
            {activeTab === 'saved' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1 leading-none">
            Saved
          </span>
        </button>

        {/* 5. Tool Compare */}
        <button
          type="button"
          onClick={() => {
            onSelectTab('compare');
            onOpenCompare();
          }}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'compare'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <ArrowLeftRight className={`w-5 h-5 transition-transform ${activeTab === 'compare' ? 'scale-110' : ''}`} />
            {activeTab === 'compare' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1 leading-none">
            Compare
          </span>
        </button>
      </div>
    </nav>
  );
}
