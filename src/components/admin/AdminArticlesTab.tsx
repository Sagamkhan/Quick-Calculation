import React, { useState, useMemo } from 'react';
import {
  Search,
  PlusCircle,
  Edit3,
  ExternalLink,
  Trash2,
  Copy,
  Download,
  Check,
  FileText,
  Filter
} from 'lucide-react';
import { BlogPost } from '../../data/blogPosts';
import { AdminCategory } from '../AdminCMS';

interface AdminArticlesTabProps {
  articles: BlogPost[];
  categories: AdminCategory[];
  onStartNewArticle: () => void;
  onEditArticle: (article: BlogPost) => void;
  onDeleteArticle: (slug: string) => void;
  onNavigateBlog?: (slug?: string) => void;
  onCopyArticleMd: (article: BlogPost) => void;
  onDownloadArticleMd: (article: BlogPost) => void;
  copiedSlug: string | null;
}

export default function AdminArticlesTab({
  articles,
  categories,
  onStartNewArticle,
  onEditArticle,
  onDeleteArticle,
  onNavigateBlog,
  onCopyArticleMd,
  onDownloadArticleMd,
  copiedSlug
}: AdminArticlesTabProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      if (selectedCat !== 'all' && a.category !== selectedCat) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.slug.toLowerCase().includes(q) ||
          (a.focusKeyword && a.focusKeyword.toLowerCase().includes(q)) ||
          a.metaDescription.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [articles, selectedCat, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-md">
        <div>
          <h3 className="text-base font-bold font-display text-white">
            All Published Articles & Guides
          </h3>
          <p className="text-xs text-slate-400">
            Total {articles.length} posts indexed ({filteredArticles.length} shown)
          </p>
        </div>

        <button
          onClick={onStartNewArticle}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, keyword, or slug..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="w-full sm:w-64 shrink-0">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Table Grid */}
      <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900 shadow-md">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
            <tr>
              <th className="p-4 font-semibold">TITLE & PERMALINK</th>
              <th className="p-4 font-semibold">CATEGORY</th>
              <th className="p-4 font-semibold">WORDS</th>
              <th className="p-4 font-semibold">PUBLISHED DATE</th>
              <th className="p-4 font-semibold text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-400 font-sans">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-500">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div className="font-bold text-white text-base font-display">No Articles Published Yet</div>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Your blog repository is clean and ready. Create your first production post using the SEO smart editor.
                    </p>
                    <button
                      onClick={onStartNewArticle}
                      className="mt-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>+ Create First Article</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : filteredArticles.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 font-mono">
                  No articles matched your search query.
                </td>
              </tr>
            ) : (
              filteredArticles.map((article) => (
                <tr key={article.slug} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white text-sm line-clamp-1">{article.title}</div>
                    <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
                      /blog/{article.slug}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-200 font-medium border border-slate-800">
                      {article.category}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-400">
                    {article.wordCount || 500} words
                  </td>
                  <td className="p-4 font-mono text-slate-400">{article.formattedDate}</td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => onCopyArticleMd(article)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Copy Markdown"
                      >
                        {copiedSlug === article.slug ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => onDownloadArticleMd(article)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Download .md file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
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
                        title="View live"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteArticle(article.slug)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                        title="Delete article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
