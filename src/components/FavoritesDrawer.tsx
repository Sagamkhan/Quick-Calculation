import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Bookmark, 
  Trash2, 
  Sparkles, 
  ArrowRight, 
  Star,
  ExternalLink 
} from 'lucide-react';
import { ToolItem } from '../data/categoriesAndTools';
import { getToolPath } from '../utils/permalinks';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedTools: ToolItem[];
  onRemoveBookmark: (tool: ToolItem) => void;
  onSelectTool: (tool: ToolItem) => void;
}

export default function FavoritesDrawer({
  isOpen,
  onClose,
  bookmarkedTools,
  onRemoveBookmark,
  onSelectTool
}: FavoritesDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs"
          />

          {/* Drawer Slide-Over */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 p-6 overflow-y-auto flex flex-col font-sans shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white">
                  Saved Tools ({bookmarkedTools.length})
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="py-6 space-y-4 flex-1">
              {bookmarkedTools.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <Star className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto" />
                  <p className="font-display font-semibold text-neutral-800 dark:text-neutral-200 text-sm">
                    No bookmarked tools yet
                  </p>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                    Click the star icon on any tool card in the catalog to add it to your quick-access bookmarks list.
                  </p>
                </div>
              ) : (
                bookmarkedTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 group hover:border-indigo-500 transition-all"
                  >
                    <a
                      href={getToolPath(tool)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 cursor-pointer block"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-500">#{tool.number}</span>
                        <h4 className="font-display font-bold text-sm text-neutral-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                          {tool.name}
                        </h4>
                      </div>
                      <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                        {tool.description}
                      </p>
                    </a>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={getToolPath(tool)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all cursor-pointer"
                        title="Open in new window / tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => onRemoveBookmark(tool)}
                        className="p-2 rounded-xl text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                        title="Remove Bookmark"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Info */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 text-center text-xs font-mono text-neutral-500">
              Bookmarks are automatically saved in browser local storage.
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
