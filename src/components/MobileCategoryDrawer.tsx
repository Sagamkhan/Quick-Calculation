import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Layers, 
  ArrowRight,
  Bot, 
  Sparkles, 
  FileText, 
  Calculator, 
  Type, 
  Code2, 
  RefreshCw, 
  Activity,
  Search,
  Image
} from 'lucide-react';
import { CATEGORIES } from '../data/categoriesAndTools';

interface MobileCategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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
  Search,
  Image
};

export default function MobileCategoryDrawer({
  isOpen,
  onClose,
  activeCategory,
  onSelectCategory
}: MobileCategoryDrawerProps) {
  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm cursor-pointer"
          />

          {/* Bottom Sheet Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative z-10 w-full max-h-[85vh] bg-slate-900 border-t border-slate-700/80 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom,16px)]"
          >
            {/* Grab handle affordance */}
            <div className="pt-3 pb-1 flex justify-center">
              <div className="w-12 h-1.5 rounded-full bg-slate-700 select-none" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display text-white">Tool Categories</h3>
                  <p className="text-xs text-slate-400">Jump straight into any calculator suite</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Close categories drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category List */}
            <div className="p-4 overflow-y-auto space-y-2 touch-pan-y">
              {/* All Tools option */}
              <button
                type="button"
                onClick={() => {
                  onSelectCategory(null);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all min-h-[52px] cursor-pointer border ${
                  activeCategory === null
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700/60'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold block">All 250+ Calculators</span>
                    <span className={`text-[11px] ${activeCategory === null ? 'text-purple-200' : 'text-slate-400'}`}>
                      Full comprehensive directory
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-75 shrink-0" />
              </button>

              {/* Individual Categories */}
              {CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat.id;
                const IconComponent = CATEGORY_ICONS[cat.iconName] || Layers;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat.id);
                      onClose();
                    }}
                    className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all min-h-[52px] cursor-pointer border ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20'
                        : 'bg-slate-800/70 hover:bg-slate-800 text-slate-200 border-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className={`p-2.5 rounded-xl ${cat.iconBg}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-bold block leading-tight">{cat.name}</span>
                        <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-purple-200' : 'text-slate-400'}`}>
                          {cat.count} precision tools
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-75 shrink-0" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
