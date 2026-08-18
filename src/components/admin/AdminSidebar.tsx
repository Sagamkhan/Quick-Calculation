import React from 'react';
import {
  LayoutDashboard,
  Edit3,
  FileText,
  Layers,
  Zap,
  Radio,
  Settings,
  Shield,
  Wrench,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  LogOut,
  Sparkles
} from 'lucide-react';

export type AdminTabType =
  | 'overview'
  | 'editor'
  | 'articles'
  | 'categories'
  | 'tools'
  | 'bulk'
  | 'settings'
  | 'indexing'
  | 'security';

interface AdminSidebarProps {
  activeTab: AdminTabType;
  setActiveTab: (tab: AdminTabType) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  totalArticles: number;
  totalCategories: number;
  totalTools?: number;
  onGoHome: () => void;
  onLogout: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  totalArticles,
  totalCategories,
  totalTools,
  onGoHome,
  onLogout
}: AdminSidebarProps) {
  const menuItems: { id: AdminTabType; label: string; icon: React.ComponentType<any>; badge?: string | number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'editor', label: 'Post Creator (SEO)', icon: Edit3 },
    { id: 'articles', label: 'Manage Posts', icon: FileText, badge: totalArticles },
    { id: 'categories', label: 'Categories & Tags', icon: Layers, badge: totalCategories },
    { id: 'tools', label: 'Tool & Calculator Manager', icon: Wrench, badge: totalTools || '250+' },
    { id: 'bulk', label: 'Bulk AI Generator', icon: Zap },
    { id: 'indexing', label: 'Search Engine Pinger', icon: Radio, badge: 'Active' },
    { id: 'settings', label: 'Global SEO & Schema', icon: Settings },
    { id: 'security', label: 'Security & PIN', icon: Shield }
  ];

  return (
    <aside
      className={`relative flex flex-col bg-slate-900 border-r border-slate-800 transition-all duration-300 shrink-0 z-20 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md shadow-cyan-500/20">
              QC
            </div>
            <div className="truncate">
              <div className="font-display font-bold text-sm text-white truncate">QuickCalc CMS</div>
              <div className="text-[10px] font-mono text-cyan-400">v2.6 Control Plane</div>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="mx-auto w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-cyan-500/20">
            QC
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer ${
            isCollapsed ? 'hidden sm:block mx-auto mt-2' : ''
          }`}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group relative ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                  isActive ? 'text-cyan-400 scale-110' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              {!isCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {!isCollapsed && item.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : typeof item.badge === 'string'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Collapsed Tooltip Indicator */}
              {isCollapsed && isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Quick Actions */}
      <div className="p-3 border-t border-slate-800 space-y-1.5">
        <button
          onClick={onGoHome}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="View Live Site"
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-cyan-400" />
          {!isCollapsed && <span>View Live Site</span>}
        </button>

        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Logout"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
