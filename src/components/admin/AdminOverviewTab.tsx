import React from 'react';
import {
  FileText,
  Sparkles,
  Layers,
  TrendingUp,
  PlusCircle,
  Zap,
  Radio,
  ExternalLink,
  Edit3,
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { BlogPost } from '../../data/blogPosts';
import { AdminCategory } from '../AdminCMS';
import { TOOLS_CATALOG } from '../../data/categoriesAndTools';
import { AdminTabType } from './AdminSidebar';

interface AdminOverviewTabProps {
  articles: BlogPost[];
  categories: AdminCategory[];
  setActiveTab: (tab: AdminTabType) => void;
  onEditArticle: (article: BlogPost) => void;
  onNavigateBlog?: (slug?: string) => void;
  onStartNewArticle: () => void;
  lastPingTime?: string | null;
}

export default function AdminOverviewTab({
  articles,
  categories,
  setActiveTab,
  onEditArticle,
  onNavigateBlog,
  onStartNewArticle,
  lastPingTime
}: AdminOverviewTabProps) {
  const recentArticles = articles.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* 4-Stat Metric Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono font-semibold">TOTAL ARTICLES</span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-display font-black text-white mt-2">{articles.length}</div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3" /> Live & Search Indexed
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono font-semibold">CALCULATORS & TOOLS</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-display font-black text-cyan-400 mt-2">{TOOLS_CATALOG.length}</div>
          <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-2 font-mono">
            100% In-Browser Privacy
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono font-semibold">CATEGORIES</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-display font-black text-indigo-300 mt-2">{categories.length}</div>
          <span className="text-[11px] text-indigo-400 block mt-2 font-mono">
            Dynamic Taxonomy
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono font-semibold">SEARCH PING STATUS</span>
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-400 mt-3 flex items-center gap-1.5 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active</span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1 font-mono truncate">
            {lastPingTime ? `Pinged: ${new Date(lastPingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Auto-Ping Ready'}
          </span>
        </div>
      </div>

      {/* Main Grid: Fast Launcher & Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Launcher Card */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-display text-white">Quick Actions</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono">
              Fast Launch
            </span>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={onStartNewArticle}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-500/30 text-left flex items-center justify-between group transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white group-hover:text-cyan-300">Write New Article</div>
                  <div className="text-[10px] text-slate-400 font-mono">SEO analyzer & schema generator</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => setActiveTab('bulk')}
              className="w-full p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800/60 border border-slate-800 text-left flex items-center justify-between group transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white group-hover:text-amber-300">Bulk AI Generator</div>
                  <div className="text-[10px] text-slate-400 font-mono">Scaffold multiple ready-to-publish posts</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className="w-full p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800/60 border border-slate-800 text-left flex items-center justify-between group transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white group-hover:text-indigo-300">Manage Categories</div>
                  <div className="text-[10px] text-slate-400 font-mono">Custom taxonomy, slugs & tags</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => setActiveTab('indexing')}
              className="w-full p-3.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800/60 border border-slate-800 text-left flex items-center justify-between group transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white group-hover:text-emerald-300">Search Engine Pinger</div>
                  <div className="text-[10px] text-slate-400 font-mono">Ping Google, Bing & IndexNow</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Recent Published Guides */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-display text-white">Recent Published Guides</h3>
              <p className="text-xs text-slate-400">Latest technical articles live on quickcalc.in</p>
            </div>

            <button
              onClick={() => setActiveTab('articles')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({articles.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/80 space-y-1">
            {recentArticles.length === 0 ? (
              <div className="py-10 px-4 text-center rounded-2xl bg-slate-950/60 border border-slate-800/60 space-y-3">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 w-12 h-12 mx-auto flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="font-bold text-white text-sm font-display">No Articles Published Yet</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Start drafting and publishing SEO-optimized articles, tutorials, and calculator walkthroughs.
                </p>
                <button
                  onClick={onStartNewArticle}
                  className="mt-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Create First Article</span>
                </button>
              </div>
            ) : (
              recentArticles.map((article) => (
                <div
                  key={article.slug}
                  className="py-3 flex items-center justify-between gap-4 group hover:bg-slate-800/40 px-3 rounded-xl transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {article.category}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">{article.formattedDate}</span>
                      <span className="text-[10px] text-slate-500 font-mono">• {article.wordCount || 500} words</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-200 truncate group-hover:text-white transition-colors">
                      {article.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onEditArticle(article)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Edit article"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onNavigateBlog && onNavigateBlog(article.slug)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                      title="View live on website"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
