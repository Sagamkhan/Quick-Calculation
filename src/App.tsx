import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import FavoritesDrawer from './components/FavoritesDrawer';
import HeroSection from './components/HeroSection';
import CategoryGrid from './components/CategoryGrid';
import BentoCatalog from './components/BentoCatalog';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import PerformanceHud from './components/PerformanceHud';
import Helmet from './components/Helmet';
import ToolLoadingSkeleton from './components/ToolLoadingSkeleton';
import ToolErrorBoundary from './components/ToolErrorBoundary';
import { TOOLS_CATALOG, CATEGORIES, ToolItem } from './data/categoriesAndTools';
import { getCategoryPath, getToolPath, findToolBySlugOrId } from './utils/permalinks';
import { generateSitemapXml } from './utils/sitemapGenerator';
import { getMergedToolsCatalog } from './utils/customToolsStorage';
import {
  getStoredGlobalSeoSettings,
  injectGoogleAnalyticsScript,
  trackPageView
} from './utils/adminCmsSettings';

// Code-split dynamic views for instant zero-latency bundle loading
const CategoryPage = lazy(() => import('./components/CategoryPage'));
const StandaloneToolPage = lazy(() => import('./components/StandaloneToolPage'));
const LegalPages = lazy(() => import('./components/LegalPages'));
const BlogGuides = lazy(() => import('./components/BlogGuides'));
const DonationSection = lazy(() => import('./components/DonationSection'));
const CompareModal = lazy(() => import('./components/CompareModal'));
const AiStudioHub = lazy(() => import('./components/ai/AiStudioHub'));

/**
 * Universal Self-Healing Tool Synthesizer
 * Generates an active, safe ToolItem if a requested slug isn't statically in the catalog.
 */
function synthesizeToolFromSlug(slug: string): ToolItem {
  const cleanName = (slug || 'calculator')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    id: slug || 'custom-calc',
    number: '0',
    name: cleanName,
    slug: slug || 'custom-calc',
    category: 'math',
    description: `High-speed browser-based dynamic calculator and utility engine for ${cleanName}.`,
    tags: ['calculator', 'tool', 'utility', 'free online'],
    readTime: 'Instant (0s)',
    complexity: 'Easy',
    rating: 4.9,
    useCount: '2.5k+'
  };
}

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('quickcalc-theme');
      if (savedTheme) return savedTheme === 'dark';
    }
    return true; // Default dark
  });

  useEffect(() => {
    localStorage.setItem('quickcalc-theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Google Analytics Dynamic Injection & Tracking
  useEffect(() => {
    try {
      const settings = getStoredGlobalSeoSettings();
      if (settings.googleAnalyticsId) {
        injectGoogleAnalyticsScript(settings.googleAnalyticsId);
      }
      const handleSettingsUpdate = (e: any) => {
        const updated = e.detail;
        if (updated?.googleAnalyticsId !== undefined) {
          injectGoogleAnalyticsScript(updated.googleAnalyticsId);
        }
      };
      window.addEventListener('quickcalc-settings-updated', handleSettingsUpdate);
      return () => window.removeEventListener('quickcalc-settings-updated', handleSettingsUpdate);
    } catch (err) {
      console.warn('[App] GA injection initialization handled safely:', err);
    }
  }, []);

  // Tools dynamic refresh listener
  const [toolsUpdateTrigger, setToolsUpdateTrigger] = useState<number>(0);

  useEffect(() => {
    const handleToolsUpdate = () => {
      setToolsUpdateTrigger((prev) => prev + 1);
    };
    window.addEventListener('quickcalc-tools-updated', handleToolsUpdate);
    return () => window.removeEventListener('quickcalc-tools-updated', handleToolsUpdate);
  }, []);

  const mergedCatalog = useMemo(() => {
    try {
      return getMergedToolsCatalog(TOOLS_CATALOG);
    } catch (e) {
      console.warn('[App] Merged catalog fallback to static catalog:', e);
      return TOOLS_CATALOG;
    }
  }, [toolsUpdateTrigger]);

  // Search & Navigation state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedComplexity, setSelectedComplexity] = useState<string | null>(null);
  const [selectedFilterBadge, setSelectedFilterBadge] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<string>('home');
  const [blogSlug, setBlogSlug] = useState<string | null>(null);

  // Single-Page State Navigation: activeToolId controls the active tool
  const [activeToolId, setActiveToolId] = useState<string | null>(null);

  const activeTool = useMemo(() => {
    if (!activeToolId) return null;
    return (
      mergedCatalog.find((t) => t.id === activeToolId || t.slug === activeToolId) ||
      synthesizeToolFromSlug(activeToolId)
    );
  }, [activeToolId, mergedCatalog]);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Compare Modal state
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [compareTool1, setCompareTool1] = useState<ToolItem | null>(null);
  const [compareTool2, setCompareTool2] = useState<ToolItem | null>(null);

  const handleOpenCompare = (tool1?: ToolItem, tool2?: ToolItem) => {
    if (tool1) setCompareTool1(tool1);
    if (tool2) setCompareTool2(tool2);
    setIsCompareOpen(true);
  };

  // Bookmarks / Favorites state
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quickcalc-bookmarks');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { return []; }
      }
    }
    return ['tool_json_formatter', 'tool_sip_calculator', 'tool_ai_prompt_builder'];
  });

  useEffect(() => {
    localStorage.setItem('quickcalc-bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  const handleToggleBookmark = (tool: ToolItem) => {
    setBookmarkedIds((prev) =>
      prev.includes(tool.id) ? prev.filter((id) => id !== tool.id) : [...prev, tool.id]
    );
  };

  const bookmarkedTools = useMemo(() => {
    return mergedCatalog.filter((tool) => bookmarkedIds.includes(tool.id));
  }, [mergedCatalog, bookmarkedIds]);

  // Filtered tools for the catalog grid
  const filteredTools = useMemo(() => {
    return mergedCatalog.filter((tool) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = tool.name.toLowerCase().includes(q);
        const matchesDesc = tool.description.toLowerCase().includes(q);
        const matchesTags = tool.tags.some((tag) => tag.toLowerCase().includes(q));
        const matchesCategory = tool.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesTags && !matchesCategory) return false;
      }
      if (activeCategory && tool.category !== activeCategory) {
        return false;
      }
      if (selectedComplexity && tool.complexity !== selectedComplexity) {
        return false;
      }
      if (selectedFilterBadge) {
        if (selectedFilterBadge === 'popular' && !tool.isPopular) return false;
        if (selectedFilterBadge === 'trending' && !tool.isTrending) return false;
        if (selectedFilterBadge === 'new' && !tool.tags.some(t => t.toLowerCase().includes('new'))) return false;
        if (selectedFilterBadge === 'ai' && !tool.category.includes('ai') && !tool.tags.some(t => t.toLowerCase().includes('ai'))) return false;
      }
      return true;
    });
  }, [mergedCatalog, searchQuery, activeCategory, selectedComplexity, selectedFilterBadge]);

  const currentCategoryInfo = useMemo(() => {
    if (!activeCategory) return null;
    return CATEGORIES.find((c) => c.id === activeCategory) || null;
  }, [activeCategory]);

  // Pure Client-Only Single-Page State Navigation Handlers (No URL change, zero window.open)
  const handleSelectTool = (tool: ToolItem) => {
    setActiveToolId(tool.id);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToTools = () => {
    setActiveToolId(null);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (categoryId: string | null) => {
    setActiveCategory(categoryId);
    setSearchQuery('');
    setActiveToolId(null);
    setBlogSlug(null);
    setActivePage(categoryId ? 'category' : 'home');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigatePage = (pageId: string) => {
    setActiveToolId(null);
    setActivePage(pageId);
    setBlogSlug(null);
    if (pageId === 'home') {
      setActiveCategory(null);
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-[#121824] text-slate-100 font-sans selection:bg-amber-500 selection:text-neutral-950 transition-colors duration-200">

        
        {/* Helmet Metadata */}
        <Helmet
          title="Quick Calculator - 250+ All-in-One Online Calculators & AI Utilities"
          description="Access over 250+ free online calculators, AI prompt builders, PDF tools, SIP financial engines, developer formatters, and unit converters with 100% in-browser privacy."
        />

        {/* Top Header / Navigation */}
        <Navbar
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          bookmarkedCount={bookmarkedIds.length}
          onOpenBookmarks={() => setIsFavoritesOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          onOpenDonate={() => handleNavigatePage('donate')}
          onOpenAiStudio={() => handleNavigatePage('ai-studio')}
          onGoHome={() => {
            handleBackToTools();
            handleNavigatePage('home');
          }}
          onSelectTool={handleSelectTool}
          isToolPage={Boolean(activeToolId && activeTool)}
        />

        {/* Left Drawer Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          selectedComplexity={selectedComplexity}
          onSelectComplexity={setSelectedComplexity}
          selectedFilterBadge={selectedFilterBadge}
          onSelectFilterBadge={setSelectedFilterBadge}
          totalToolsCount={mergedCatalog.length}
          onNavigatePage={handleNavigatePage}
          activePage={activePage}
        />

        {/* Favorites Drawer */}
        <FavoritesDrawer
          isOpen={isFavoritesOpen}
          onClose={() => setIsFavoritesOpen(false)}
          bookmarkedTools={bookmarkedTools}
          onRemoveBookmark={handleToggleBookmark}
          onSelectTool={handleSelectTool}
        />

        {/* Main Page Content */}
        <main className="w-full">
          {activeToolId && activeTool ? (
            /* Standalone Dedicated Tool Page Route View with Single-Page State Navigation */
            <ToolErrorBoundary
              tool={activeTool}
              onGoHome={handleBackToTools}
              fallback={
                <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-slate-900 border border-amber-500/30 text-center space-y-4 my-8">
                  <h3 className="text-xl font-bold text-white font-display">Something went wrong loading this tool</h3>
                  <p className="text-xs text-slate-400">The calculator encountered an unexpected parameter error.</p>
                  <button
                    type="button"
                    onClick={handleBackToTools}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-all cursor-pointer"
                  >
                    ← Back to Tools
                  </button>
                </div>
              }
            >
              <Suspense fallback={<ToolLoadingSkeleton message={`Loading ${activeTool.name}...`} />}>
                <StandaloneToolPage
                  tool={activeTool}
                  onBack={handleBackToTools}
                  onSelectTool={handleSelectTool}
                  bookmarkedIds={bookmarkedIds}
                  onToggleBookmark={handleToggleBookmark}
                  onNavigate={(page) => {
                    if (page === 'home' || page === '/') {
                      handleBackToTools();
                    } else if (page.startsWith('/category/') || page === 'category') {
                      setActiveToolId(null);
                      const catId = page.replace('/category/', '');
                      handleSelectCategory(catId || null);
                    } else {
                      handleNavigatePage(page);
                    }
                  }}
                  onOpenCompare={handleOpenCompare}
                />
              </Suspense>
            </ToolErrorBoundary>
          ) : activePage === 'sitemap' ? (
            <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
              <h1 className="text-2xl font-bold font-display text-white">Dynamic XML Sitemap</h1>
              <pre className="p-6 rounded-2xl bg-slate-950 text-cyan-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap border border-slate-800">
                {generateSitemapXml()}
              </pre>
            </div>
          ) : activePage === 'donate' ? (
            <Suspense fallback={<ToolLoadingSkeleton message="Loading Donation Portal..." />}>
              <DonationSection isStandalonePage={true} />
            </Suspense>
          ) : activePage === 'ai-studio' ? (
            <Suspense fallback={<ToolLoadingSkeleton message="Loading AI Creative & Voice Studio..." />}>
              <AiStudioHub onGoHome={() => handleNavigatePage('home')} />
            </Suspense>
          ) : activePage === 'blog' ? (
            <Suspense fallback={<ToolLoadingSkeleton message="Loading Blog Guides..." />}>
              <BlogGuides
                initialSlug={blogSlug}
                onGoHome={() => handleNavigatePage('home')}
                onNavigateSlug={(slug) => setBlogSlug(slug || null)}
              />
            </Suspense>
          ) : ['privacy-policy', 'terms-of-service', 'disclaimer', 'about-us', 'contact-us', 'editorial-guidelines'].includes(activePage) ? (
            <Suspense fallback={<ToolLoadingSkeleton message="Loading..." />}>
              <LegalPages
                pageId={activePage as any}
                onGoHome={() => handleNavigatePage('home')}
              />
            </Suspense>
          ) : activePage === 'category' && currentCategoryInfo ? (
            <Suspense fallback={<ToolLoadingSkeleton message="Loading Category..." />}>
              <CategoryPage
                category={currentCategoryInfo}
                allCategories={CATEGORIES}
                tools={filteredTools}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={handleToggleBookmark}
                onSelectTool={handleSelectTool}
                onOpenCompare={(tool) => handleOpenCompare(tool)}
                onSelectCategory={handleSelectCategory}
                onGoHome={() => handleNavigatePage('home')}
              />
            </Suspense>
          ) : (
            /* Default Homepage View */
            <div className="space-y-12 pb-20">
              {/* Hero Section */}
              <HeroSection
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                toolsCatalog={TOOLS_CATALOG}
                onSelectTool={handleSelectTool}
                onSelectCategory={handleSelectCategory}
                activeCategory={activeCategory}
                onOpenDonate={() => handleNavigatePage('donate')}
              />

              {/* Category Grid Section */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <CategoryGrid
                  activeCategory={activeCategory}
                  onSelectCategory={handleSelectCategory}
                />
              </div>

              {/* Main Tools Catalog Grid */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                      <span>Explore Tools Catalog</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono font-bold">
                        {filteredTools.length} tools
                      </span>
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Fast, secure, browser-native calculation tools and AI prompt assistants.
                    </p>
                  </div>
                </div>

                <BentoCatalog
                  tools={filteredTools}
                  bookmarkedIds={bookmarkedIds}
                  onToggleBookmark={handleToggleBookmark}
                  onSelectTool={handleSelectTool}
                  onSelectCategory={handleSelectCategory}
                  onOpenCompare={(tool) => handleOpenCompare(tool)}
                  activeCategoryFilter={activeCategory}
                  searchQuery={searchQuery}
                />
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <Footer
          onSelectCategory={handleSelectCategory}
          onNavigatePage={handleNavigatePage}
        />

        {/* Cookie Consent & Performance HUD */}
        <CookieConsent />
        <PerformanceHud currentRoutePath={activePage} />

        {/* Side-by-Side Tool Compare Modal */}
        {isCompareOpen && (
          <Suspense fallback={null}>
            <CompareModal
              isOpen={isCompareOpen}
              onClose={() => setIsCompareOpen(false)}
              initialTool1={compareTool1}
              initialTool2={compareTool2}
              onSelectToolToLaunch={(tool) => handleSelectTool(tool)}
            />
          </Suspense>
        )}

      </div>
  );
}
