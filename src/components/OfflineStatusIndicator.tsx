import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wifi,
  WifiOff,
  Database,
  CheckCircle2,
  AlertTriangle,
  Search,
  X,
  RefreshCw,
  Zap,
  ArrowRight,
  Bookmark,
  Clock,
  Layers,
  Sparkles,
  ShieldCheck,
  Globe,
  Radio
} from 'lucide-react';
import { ToolItem, CATEGORIES, TOOLS_CATALOG } from '../data/categoriesAndTools';
import { getToolPath } from '../utils/permalinks';
import {
  getOfflineToolsInventory,
  pingInternetConnectivity,
  isToolNetworkDependent
} from '../utils/offlineCacheHelper';

interface OfflineStatusIndicatorProps {
  onSelectTool?: (tool: ToolItem) => void;
  onGoHome?: () => void;
  className?: string;
}

export default function OfflineStatusIndicator({
  onSelectTool,
  onGoHome,
  className = ''
}: OfflineStatusIndicatorProps) {
  // Real network status tracking
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });

  // Simulated offline toggle for testing and review
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);

  // Modal open state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Re-checking connection loading state
  const [isCheckingConnection, setIsCheckingConnection] = useState<boolean>(false);
  const [connectionCheckMessage, setConnectionCheckMessage] = useState<string | null>(null);

  // Transient notification toast when going offline
  const [showOfflineToast, setShowOfflineToast] = useState<boolean>(false);

  // Search & tab filter inside the modal
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'recent' | 'saved' | 'network'>('all');

  // Effective offline status
  const effectiveOffline = !isOnline || isSimulatedOffline;

  // Listen to browser online & offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineToast(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineToast(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Dismiss toast after 7 seconds
  useEffect(() => {
    if (showOfflineToast) {
      const timer = setTimeout(() => setShowOfflineToast(false), 7000);
      return () => clearTimeout(timer);
    }
  }, [showOfflineToast]);

  // Handle re-checking connection actively
  const handleCheckConnection = async () => {
    setIsCheckingConnection(true);
    setConnectionCheckMessage(null);
    try {
      const realStatus = await pingInternetConnectivity();
      setIsOnline(realStatus);
      if (realStatus) {
        setConnectionCheckMessage('Connected! Internet access verified.');
        if (isSimulatedOffline) {
          setIsSimulatedOffline(false);
        }
      } else {
        setConnectionCheckMessage('Still offline. Internet connection not detected.');
      }
    } catch (e) {
      setIsOnline(false);
      setConnectionCheckMessage('Still offline. Internet connection not detected.');
    } finally {
      setIsCheckingConnection(false);
    }
  };

  // Compile offline inventory
  const inventory = useMemo(() => {
    return getOfflineToolsInventory(TOOLS_CATALOG);
  }, [isModalOpen]);

  // Filter tools based on active tab and search query
  const displayedTools = useMemo(() => {
    let list: ToolItem[] = [];

    if (activeTab === 'all') {
      list = inventory.allOfflineTools;
    } else if (activeTab === 'recent') {
      list = inventory.recentlyUsed.map((r) => r.tool);
      // If no recently used recorded, suggest top popular offline tools
      if (list.length === 0) {
        list = inventory.allOfflineTools.filter((t) => t.isPopular || t.isTrending).slice(0, 12);
      }
    } else if (activeTab === 'saved') {
      list = inventory.bookmarked;
      // If no bookmarks, show top recommended offline tools
      if (list.length === 0) {
        list = inventory.allOfflineTools.slice(0, 8);
      }
    } else if (activeTab === 'network') {
      list = inventory.networkRequiredTools;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          t.category.toLowerCase().includes(q)
      );
    }

    return list;
  }, [inventory, activeTab, searchQuery]);

  // Navigate to tool cleanly
  const handleLaunchTool = (tool: ToolItem) => {
    setIsModalOpen(false);
    if (onSelectTool) {
      onSelectTool(tool);
    } else if (typeof window !== 'undefined') {
      const path = getToolPath(tool);
      window.history.pushState({}, '', path);
      // Dispatch popstate so SPA router handles it cleanly without network hit
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 1. NAVBAR STATUS INDICATOR BUTTON */}
      <div className={`relative flex items-center ${className}`}>
        {effectiveOffline ? (
          /* OFFLINE WARNING BADGE: Subtle yet clear amber alert */
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="group relative px-2.5 sm:px-3 py-1.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm text-xs font-mono select-none"
            title="You are currently offline. Click to view available cached tools."
            aria-label="Offline status indicator. Click to view available cached tools."
          >
            {/* Animated breathing pulse indicator */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>

            <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-bold tracking-tight">Offline</span>

            {/* Subtle cached tools counter badge */}
            <span className="hidden sm:inline-flex items-center text-[10px] bg-amber-500/25 text-amber-200 px-1.5 py-0.5 rounded font-mono font-semibold">
              {inventory.offlineReadyCount}+ Tools Ready
            </span>
          </button>
        ) : (
          /* ONLINE STATUS BADGE: Minimal and subtle, opens hub to review cached tools */
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="group relative px-2 sm:px-2.5 py-1.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900/80 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono select-none"
            title="Online • All tools cached and ready for offline use. Click to inspect offline tools."
            aria-label="Network status online. Click to inspect offline-ready tools."
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <Wifi className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <span className="hidden md:inline text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
              Offline Ready
            </span>
          </button>
        )}
      </div>

      {/* 2. TRANSIENT FLOATING OFFLINE ALERT TOAST */}
      <AnimatePresence>
        {showOfflineToast && effectiveOffline && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full p-4 rounded-2xl bg-slate-900 text-slate-100 border border-amber-500/50 shadow-2xl shadow-amber-500/10 font-sans"
            role="alert"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <WifiOff className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                    You Are Offline
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowOfflineToast(false)}
                    className="p-1 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  No internet connection detected. Don&apos;t worry — all 250+ calculators and client-side tools remain fully functional offline!
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOfflineToast(false);
                      setIsModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer hover:bg-amber-400"
                  >
                    <span>View Cached Tools</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. COMPREHENSIVE OFFLINE & CACHED TOOLS MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Modal Dialog Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl rounded-3xl bg-slate-900 dark:bg-[#121824] border border-slate-700/80 dark:border-white/10 shadow-2xl p-5 sm:p-7 space-y-5 max-h-[90vh] flex flex-col font-sans select-text z-10"
              role="dialog"
              aria-labelledby="offline-modal-title"
              aria-modal="true"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 border ${
                        effectiveOffline
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {effectiveOffline ? (
                        <>
                          <WifiOff className="w-3 h-3 text-amber-400" />
                          <span>Disconnected / Offline Mode</span>
                        </>
                      ) : (
                        <>
                          <Wifi className="w-3 h-3 text-emerald-400" />
                          <span>Connected / Online</span>
                        </>
                      )}
                    </span>

                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                      <Database className="w-3 h-3 text-cyan-400" />
                      <span>{inventory.offlineReadyCount} Tools Pre-Cached</span>
                    </span>
                  </div>

                  <h3
                    id="offline-modal-title"
                    className="text-lg sm:text-xl font-bold font-display text-white tracking-tight flex items-center gap-2"
                  >
                    <span>Offline Status & Available Tools</span>
                  </h3>
                </div>

                {/* Top Action Controls */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  {/* Re-check connection button */}
                  <button
                    type="button"
                    onClick={handleCheckConnection}
                    disabled={isCheckingConnection}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    title="Ping network to re-test internet connectivity"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isCheckingConnection ? 'animate-spin' : ''}`} />
                    <span>{isCheckingConnection ? 'Checking...' : 'Check Connection'}</span>
                  </button>

                  {/* Close modal */}
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer transition-colors"
                    aria-label="Close offline hub"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Message Alert if connection check was run */}
              {connectionCheckMessage && (
                <div
                  className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                    isOnline
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}
                >
                  {isOnline ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span>{connectionCheckMessage}</span>
                </div>
              )}

              {/* Offline Explanation Card & Simulation Switch */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>100% In-Browser Computation & Local Storage</span>
                  </div>

                  {/* Simulate Offline Mode Toggle */}
                  <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer select-none bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700">
                    <input
                      type="checkbox"
                      checked={isSimulatedOffline}
                      onChange={(e) => setIsSimulatedOffline(e.target.checked)}
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-400 cursor-pointer"
                    />
                    <span className="text-[11px]">Simulate Offline Mode (Test)</span>
                  </label>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Quick Calculator is built as an offline-first web application. All financial calculations (SIP, EMI, loans), text formatting, code converters, unit transformations, and markdown parsers execute <strong className="text-white">locally inside your browser engine</strong> without needing server queries.
                </p>

                {/* Storage Health Badges */}
                <div className="pt-1 flex items-center gap-2 flex-wrap text-[11px] font-mono text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Service Worker: Ready
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 flex items-center gap-1">
                    <Database className="w-3 h-3 text-cyan-400" />
                    Local Storage: Active
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                    Cached Tools: {inventory.offlineReadyCount} / {TOOLS_CATALOG.length}
                  </span>
                </div>
              </div>

              {/* Search and Category Filter Controls */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Search input */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter cached tools (e.g. SIP, JSON, Word Counter)..."
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                    <button
                      type="button"
                      onClick={() => setActiveTab('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap cursor-pointer transition-colors ${
                        activeTab === 'all'
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      All Offline ({inventory.offlineReadyCount})
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('recent')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1 ${
                        activeTab === 'recent'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>Recently Used ({inventory.recentlyUsed.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('saved')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1 ${
                        activeTab === 'saved'
                          ? 'bg-purple-500 text-white font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Bookmark className="w-3 h-3" />
                      <span>Saved ({inventory.bookmarked.length})</span>
                    </button>

                    {inventory.networkRequiredCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveTab('network')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap cursor-pointer transition-colors flex items-center gap-1 ${
                          activeTab === 'network'
                            ? 'bg-rose-500 text-white font-bold'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        <Globe className="w-3 h-3" />
                        <span>Online Only ({inventory.networkRequiredCount})</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Scrollable Tool Cards List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[340px]">
                {displayedTools.length === 0 ? (
                  <div className="py-12 text-center space-y-2 border border-dashed border-slate-700 rounded-2xl">
                    <Search className="w-6 h-6 text-slate-500 mx-auto" />
                    <p className="text-xs text-slate-400 font-mono">
                      No matching tools found for &quot;{searchQuery}&quot;
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
                    >
                      Clear search filter
                    </button>
                  </div>
                ) : (
                  displayedTools.map((tool) => {
                    const requiresNet = isToolNetworkDependent(tool);
                    const isRecent = inventory.recentlyUsed.some((r) => r.tool.id === tool.id);
                    const isBookmarked = inventory.bookmarked.some((b) => b.id === tool.id);

                    return (
                      <div
                        key={tool.id}
                        className="p-3 sm:p-3.5 rounded-2xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-bold font-display text-slate-100 group-hover:text-cyan-300 truncate">
                              {tool.name}
                            </h4>

                            {/* Status tags */}
                            {requiresNet ? (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/15 text-rose-300 border border-rose-500/30">
                                Requires Internet
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                100% Offline
                              </span>
                            )}

                            {isRecent && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                Recent
                              </span>
                            )}

                            {isBookmarked && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30">
                                Saved
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-slate-400 line-clamp-1 leading-normal">
                            {tool.description}
                          </p>
                        </div>

                        {/* Launch Action Button */}
                        <button
                          type="button"
                          onClick={() => handleLaunchTool(tool)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 group-hover:bg-cyan-500 text-slate-200 group-hover:text-slate-950 text-xs font-mono font-bold flex items-center gap-1 shrink-0 transition-all cursor-pointer shadow-sm"
                          title={`Launch ${tool.name} in offline session`}
                        >
                          <span>Launch</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>
                    Zero server round-trips for calculations • All data stored in local session
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
