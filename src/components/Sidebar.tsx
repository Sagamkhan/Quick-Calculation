import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Layers, 
  Sparkles, 
  Sliders, 
  Bot, 
  FileText, 
  Calculator, 
  Type, 
  Code2, 
  RefreshCw, 
  Activity,
  Search,
  Home,
  BookOpen,
  Heart,
  Info,
  Shield,
  Scale,
  Mail,
  Zap,
  Star
} from 'lucide-react';
import { CATEGORIES } from '../data/categoriesAndTools';
import { getCategoryPath } from '../utils/permalinks';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string | null;
  onSelectCategory: (id: string | null) => void;
  selectedComplexity: string | null;
  onSelectComplexity: (complexity: string | null) => void;
  selectedFilterBadge: string | null;
  onSelectFilterBadge: (badge: string | null) => void;
  totalToolsCount: number;
  onNavigatePage: (pageId: string) => void;
  activePage?: string;
}

export default function Sidebar({
  isOpen,
  onClose,
  activeCategory,
  onSelectCategory,
  selectedComplexity,
  onSelectComplexity,
  selectedFilterBadge,
  onSelectFilterBadge,
  totalToolsCount,
  onNavigatePage,
  activePage = 'home'
}: SidebarProps) {

  const handleNavClick = (pageId: string) => {
    onNavigatePage(pageId);
    onClose();
  };

  const handleCategoryNavClick = (catId: string | null) => {
    onNavigatePage('home');
    onSelectCategory(catId);
    onClose();
  };

  const navCategoryIcons: Record<string, any> = {
    'ai-tools': Bot,
    'free-alternatives': Sparkles,
    'pdf-tools': FileText,
    'math-finance': Calculator,
    'text-writing': Type,
    'developer-coding': Code2,
    'unit-converter': RefreshCw,
    'health-fitness': Activity,
    'seo-website-tools': Search,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-neutral-950/60 backdrop-blur-xs"
          />

          {/* Sidebar Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-80 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 p-6 overflow-y-auto flex flex-col font-sans shadow-2xl"
          >
            {/* Top Close Header */}
            <div className="flex items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-500" />
                <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white">
                  Quick Calculator
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-500 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-6 space-y-6 flex-1">
              
              {/* Main Navigation Pages */}
              <div>
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Navigation
                </h4>
                <div className="space-y-1">
                  
                  {/* Home */}
                  <button
                    onClick={() => handleNavClick('home')}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                      activePage === 'home' && activeCategory === null
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </button>

                  {/* AI Creative & Voice Studio */}
                  <button
                    onClick={() => handleNavClick('ai-studio')}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                      activePage === 'ai-studio'
                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 text-white shadow-md'
                        : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span className="flex-1 text-left">AI Creative & Voice Studio</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-indigo-500/20 text-indigo-300 font-bold">5 Tools</span>
                  </button>

                  {/* All Tools */}
                  <button
                    onClick={() => handleCategoryNavClick(null)}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                      activePage === 'home' && activeCategory === null
                        ? 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-indigo-500" />
                      <span>All Tools Catalog</span>
                    </div>
                    <span className="font-mono text-[10px] text-neutral-400">{totalToolsCount}</span>
                  </button>

                  {/* Donate Page Link */}
                  <a
                    href="/donate"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('donate');
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                      activePage === 'donate'
                        ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-md'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    <span>Donate Now (Support Us)</span>
                  </a>

                  {/* Blog / Guides */}
                  <button
                    onClick={() => handleNavClick('blog')}
                    className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                      activePage === 'blog'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    <span>Blog & Guides</span>
                  </button>

                </div>
              </div>

              {/* Tools Categories List */}
              <div>
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Tool Categories
                </h4>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => {
                    const Icon = navCategoryIcons[cat.id] || Layers;
                    const isActive = activePage === 'home' && activeCategory === cat.id;
                    return (
                      <a
                        key={cat.id}
                        href={getCategoryPath(cat.id)}
                        onClick={(e) => {
                          e.preventDefault();
                          handleCategoryNavClick(cat.id);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                          isActive
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold shadow-md'
                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 opacity-80" />
                          <span>{cat.name}</span>
                        </div>
                        <span className="font-mono text-[10px] opacity-60">({cat.count})</span>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Complexity Filter */}
              <div>
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Filter Complexity
                </h4>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'Easy', label: 'Easy' },
                    { id: 'Medium', label: 'Medium' },
                    { id: 'Advanced', label: 'Advanced' },
                  ].map((lvl) => {
                    const isActive = selectedComplexity === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        onClick={() => onSelectComplexity(isActive ? null : lvl.id)}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-mono font-bold text-center border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-transparent shadow-sm'
                            : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                        }`}
                      >
                        {lvl.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legal & Owner Pages Section */}
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  About & Legal
                </h4>
                <div className="space-y-1 text-xs font-medium">
                  
                  <button
                    onClick={() => handleNavClick('about-us')}
                    className={`w-full px-3 py-1.5 rounded-lg flex items-center gap-2.5 transition-all cursor-pointer ${
                      activePage === 'about-us' ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <Info className="w-3.5 h-3.5 text-indigo-500" />
                    <span>About Us</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('privacy-policy')}
                    className={`w-full px-3 py-1.5 rounded-lg flex items-center gap-2.5 transition-all cursor-pointer ${
                      activePage === 'privacy-policy' ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Privacy Policy</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('terms-of-service')}
                    className={`w-full px-3 py-1.5 rounded-lg flex items-center gap-2.5 transition-all cursor-pointer ${
                      activePage === 'terms-of-service' ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-purple-500" />
                    <span>Terms of Service</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('disclaimer')}
                    className={`w-full px-3 py-1.5 rounded-lg flex items-center gap-2.5 transition-all cursor-pointer ${
                      activePage === 'disclaimer' ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5 text-amber-500" />
                    <span>Disclaimer</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('contact-us')}
                    className={`w-full px-3 py-1.5 rounded-lg flex items-center gap-2.5 transition-all cursor-pointer ${
                      activePage === 'contact-us' ? 'font-bold text-indigo-600 dark:text-indigo-400' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-rose-500" />
                    <span>Contact Us</span>
                  </button>

                </div>
              </div>

            </div>

            {/* Bottom Footer Owner Badge */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-400">
              <p className="font-bold text-neutral-700 dark:text-neutral-300">Quick Calculator v2.5</p>
              <p>Created by Shahroz Khan</p>
            </div>

          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
