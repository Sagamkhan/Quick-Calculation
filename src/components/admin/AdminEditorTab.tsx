import React, { useState, useMemo, useCallback } from 'react';
import {
  Sparkles,
  Link as LinkIcon,
  Copy,
  Download,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit3,
  Check,
  Smartphone,
  Monitor,
  Plus,
  Trash2,
  HelpCircle,
  Layers,
  Calendar,
  User,
  Image as ImageIcon,
  Zap,
  ArrowRight
} from 'lucide-react';
import MarkdownRenderer from '../MarkdownRenderer';
import { ToolItem } from '../../data/categoriesAndTools';
import { AdminCategory } from '../AdminCMS';
import { SeoAnalysisResult, FaqItem } from '../../utils/adminSeoAnalyzer';
import AdminLinkSuggester from './AdminLinkSuggester';
import RadialSeoGauge from './RadialSeoGauge';
import {
  scanDraftForToolLinks,
  convertSingleSuggestion,
  convertAllSuggestions,
  LinkSuggestion
} from '../../utils/internalLinkSuggester';

interface AdminEditorTabProps {
  editingSlug: string | null;
  postTitle: string;
  onTitleChange: (val: string) => void;
  postSlug: string;
  setPostSlug: (slug: string) => void;
  postCategory: string;
  setPostCategory: (cat: string) => void;
  postFocusKeyword: string;
  setPostFocusKeyword: (kw: string) => void;
  postMetaDescription: string;
  setPostMetaDescription: (desc: string) => void;
  postCanonicalUrl: string;
  setPostCanonicalUrl: (url: string) => void;
  postAuthor: string;
  setPostAuthor: (auth: string) => void;
  postAuthorRole: string;
  setPostAuthorRole: (role: string) => void;
  postCoverImage: string;
  setPostCoverImage: (img: string) => void;
  postCoverImageAlt: string;
  setPostCoverImageAlt: (alt: string) => void;
  postPublishedDate: string;
  setPostPublishedDate: (date: string) => void;
  postIsFeatured: boolean;
  setPostIsFeatured: (featured: boolean) => void;
  postBody: string;
  setPostBody: (body: string | ((prev: string) => string)) => void;
  faqs: FaqItem[];
  setFaqs: React.Dispatch<React.SetStateAction<FaqItem[]>>;
  categories: AdminCategory[];
  seoAnalysis: SeoAnalysisResult;
  onOpenToolPicker: () => void;
  onSaveAndPublish: () => void;
  onCopyMarkdown: () => void;
  onDownloadMarkdown: () => void;
  copiedStatus: string | null;
  onShowToast?: (msg: string) => void;
}

export default function AdminEditorTab({
  editingSlug,
  postTitle,
  onTitleChange,
  postSlug,
  setPostSlug,
  postCategory,
  setPostCategory,
  postFocusKeyword,
  setPostFocusKeyword,
  postMetaDescription,
  setPostMetaDescription,
  postCanonicalUrl,
  setPostCanonicalUrl,
  postAuthor,
  setPostAuthor,
  postAuthorRole,
  setPostAuthorRole,
  postCoverImage,
  setPostCoverImage,
  postCoverImageAlt,
  setPostCoverImageAlt,
  postPublishedDate,
  setPostPublishedDate,
  postIsFeatured,
  setPostIsFeatured,
  postBody,
  setPostBody,
  faqs,
  setFaqs,
  categories,
  seoAnalysis,
  onOpenToolPicker,
  onSaveAndPublish,
  onCopyMarkdown,
  onDownloadMarkdown,
  copiedStatus,
  onShowToast
}: AdminEditorTabProps) {
  const [editorViewMode, setEditorViewMode] = useState<'split' | 'write' | 'preview'>('split');
  const [serpViewDevice, setSerpViewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showFaqSection, setShowFaqSection] = useState<boolean>(true);
  const [ignoredSuggestionIds, setIgnoredSuggestionIds] = useState<Set<string>>(new Set());
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Auto-scan draft content for unlinked technical terms matching tool slugs
  const scanResult = useMemo(() => {
    return scanDraftForToolLinks(postBody, ignoredSuggestionIds);
  }, [postBody, ignoredSuggestionIds]);

  // One-click conversion handlers
  const handleConvertSingle = useCallback(
    (suggestion: LinkSuggestion) => {
      setPostBody((prev) => {
        const updated = convertSingleSuggestion(prev, suggestion, false);
        return updated;
      });
      if (onShowToast) {
        onShowToast(`Linked "${suggestion.term}" to ${suggestion.tool.name}`);
      }
    },
    [setPostBody, onShowToast]
  );

  const handleConvertAll = useCallback(() => {
    if (scanResult.suggestions.length === 0) return;
    const { updatedContent, convertedCount } = convertAllSuggestions(
      postBody,
      scanResult.suggestions
    );
    setPostBody(updatedContent);
    if (onShowToast) {
      onShowToast(
        `Successfully converted ${convertedCount} term${
          convertedCount > 1 ? 's' : ''
        } into internal tool links!`
      );
    }
  }, [postBody, scanResult.suggestions, setPostBody, onShowToast]);

  const handleDismissSuggestion = useCallback((id: string) => {
    setIgnoredSuggestionIds((prev) => new Set([...prev, id]));
  }, []);

  const handleRescan = useCallback(() => {
    setIsScanning(true);
    setIgnoredSuggestionIds(new Set());
    setTimeout(() => {
      setIsScanning(false);
      if (onShowToast) {
        onShowToast('Refreshed tool mention scan');
      }
    }, 400);
  }, [onShowToast]);

  // FAQ Handlers
  const handleAddFaq = () => {
    const newId = `faq-${Date.now()}`;
    setFaqs((prev) => [...prev, { id: newId, question: '', answer: '' }]);
  };

  const handleUpdateFaq = (id: string, field: 'question' | 'answer', value: string) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const handleRemoveFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Editor Action Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">
              {editingSlug ? `Editing Article: ${postSlug}` : 'New Article Draft'}
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Auto-calculating SERP rank score & FAQ JSON-LD
            </span>
          </div>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Auto-Link Tool Bar Action */}
          {scanResult.totalSuggestions > 0 && (
            <button
              type="button"
              onClick={handleConvertAll}
              className="px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm animate-pulse"
              title="1-Click convert all matching tool terms to internal links"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Auto-Link All ({scanResult.totalSuggestions})</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenToolPicker}
            className="px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Insert Tool Link</span>
          </button>

          <button
            type="button"
            onClick={onCopyMarkdown}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedStatus === 'markdown' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>Copy .md</span>
          </button>

          <button
            type="button"
            onClick={onDownloadMarkdown}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .md</span>
          </button>

          <button
            type="button"
            onClick={onSaveAndPublish}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save & Publish Live</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Inputs (Left 2 cols) & SEO/SERP Sidebar (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Input Controls & Body */}
        <div className="lg:col-span-2 space-y-4">
          {/* Article Title */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                ARTICLE TITLE (H1)
              </label>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    seoAnalysis.titleCharStatus === 'optimal'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : seoAnalysis.titleCharStatus === 'short'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {postTitle.length} chars (Target: 50-60)
                </span>
              </div>
            </div>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="e.g. 10 Essential SIP and Wealth Calculators for Financial Growth in 2026"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm font-semibold"
            />
          </div>

          {/* URL Slug & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
              <label className="block text-xs font-mono text-slate-300 font-semibold">
                URL PERMALINK SLUG
              </label>
              <input
                type="text"
                value={postSlug}
                onChange={(e) => setPostSlug(e.target.value)}
                placeholder="e.g. sip-wealth-calculators-guide"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500 font-mono block truncate">
                Route: /blog/{postSlug || 'slug'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
              <label className="block text-xs font-mono text-slate-300 font-semibold">
                CATEGORY
              </label>
              <select
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-500 font-mono block">
                Controls navigation filtering & breadcrumbs
              </span>
            </div>
          </div>

          {/* Focus Keyword & Meta Description */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
              <label className="block text-xs font-mono text-slate-300 font-semibold">
                TARGET FOCUS KEYWORD
              </label>
              <input
                type="text"
                value={postFocusKeyword}
                onChange={(e) => setPostFocusKeyword(e.target.value)}
                placeholder="e.g. sip calculator"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 font-medium"
              />
              <span className="text-[10px] text-slate-500 font-mono block">
                Density: {seoAnalysis.keywordDensity}% ({seoAnalysis.keywordCount}x)
              </span>
            </div>

            <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-slate-300 font-semibold">
                  META DESCRIPTION
                </label>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    seoAnalysis.metaCharStatus === 'optimal'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : seoAnalysis.metaCharStatus === 'short'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {postMetaDescription.length} chars (Target: 120-160)
                </span>
              </div>
              <input
                type="text"
                value={postMetaDescription}
                onChange={(e) => setPostMetaDescription(e.target.value)}
                placeholder="Concise SEO summary snippet for search engine SERP snippets..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Canonical URL & Author Details Accordion */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
              <label className="block text-xs font-mono text-slate-300 font-semibold">
                CANONICAL URL
              </label>
              <input
                type="url"
                value={postCanonicalUrl || `https://quickcalc.in/blogs/${postSlug || 'article'}`}
                onChange={(e) => setPostCanonicalUrl(e.target.value)}
                placeholder="https://quickcalc.in/blogs/..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-slate-300 font-semibold">
                  AUTHOR NAME
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPostAuthor('Sagam Khan');
                      setPostAuthorRole('Founder & Lead Engineer');
                    }}
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold"
                  >
                    Sagam Khan
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPostAuthor('QuickCalc Editorial Team');
                      setPostAuthorRole('Editorial Staff');
                    }}
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                  >
                    Editorial
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={postAuthor}
                onChange={(e) => setPostAuthor(e.target.value)}
                placeholder="Author name..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
              <label className="block text-xs font-mono text-slate-300 font-semibold">
                PUBLISHED DATE
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={postPublishedDate ? postPublishedDate.slice(0, 10) : ''}
                  onChange={(e) => setPostPublishedDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setPostPublishedDate(new Date().toISOString().slice(0, 10))}
                  className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-cyan-400 font-bold whitespace-nowrap"
                  title="Set Today"
                >
                  Today
                </button>
              </div>
            </div>
          </div>

          {/* Markdown Content Editor */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-xs font-mono text-slate-300 font-semibold">
                  MARKDOWN ARTICLE BODY
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  ({seoAnalysis.words} words • ~{seoAnalysis.readingTimeMinutes} min read)
                </span>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setEditorViewMode('write')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    editorViewMode === 'write'
                      ? 'bg-cyan-500/20 text-cyan-400 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setEditorViewMode('preview')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    editorViewMode === 'preview'
                      ? 'bg-cyan-500/20 text-cyan-400 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => setEditorViewMode('split')}
                  className={`px-3 py-1 rounded-lg transition-colors hidden sm:block cursor-pointer ${
                    editorViewMode === 'split'
                      ? 'bg-cyan-500/20 text-cyan-400 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Split View
                </button>
              </div>
            </div>

            {/* Split / Single View Editor Container */}
            <div
              className={`grid gap-4 ${
                editorViewMode === 'split' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
              }`}
            >
              {(editorViewMode === 'write' || editorViewMode === 'split') && (
                <textarea
                  value={postBody}
                  onChange={(e) => setPostBody(e.target.value)}
                  rows={20}
                  placeholder="Write markdown content here (## Headings, lists, code blocks, tool links)..."
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:border-cyan-500 resize-y shadow-inner custom-scrollbar"
                />
              )}

              {(editorViewMode === 'preview' || editorViewMode === 'split') && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-y-auto max-h-[500px] text-xs leading-relaxed custom-scrollbar">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-3 pb-2 border-b border-slate-800">
                    Live Markdown Preview
                  </span>
                  <MarkdownRenderer content={postBody} />
                </div>
              )}
            </div>
          </div>

          {/* Auto-Scan Tool Mentions & 1-Click Internal Link Suggester */}
          <AdminLinkSuggester
            scanResult={scanResult}
            onConvertSingle={handleConvertSingle}
            onConvertAll={handleConvertAll}
            onDismissSuggestion={handleDismissSuggestion}
            onRescan={handleRescan}
            onOpenToolPicker={onOpenToolPicker}
            isScanning={isScanning}
          />

          {/* Dedicated FAQ Repeater & Schema Generator */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-sm text-white">
                  FAQ Repeater & Rich Schema Generator
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono">
                  {faqs.length} Questions
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddFaq}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add FAQ Item</span>
              </button>
            </div>

            {faqs.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center space-y-2">
                <p className="text-xs text-slate-400">
                  No FAQs added yet. Adding FAQ questions triggers structured <code className="text-cyan-400 font-mono">FAQPage</code> schema in Google search results.
                </p>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                >
                  + Add First FAQ
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div
                    key={faq.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-cyan-400 font-bold">
                        FAQ #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(faq.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                        title="Remove question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleUpdateFaq(faq.id, 'question', e.target.value)}
                      placeholder="e.g. Is this calculation 100% free and accurate?"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-semibold focus:outline-none focus:border-cyan-500"
                    />

                    <textarea
                      value={faq.answer}
                      onChange={(e) => handleUpdateFaq(faq.id, 'answer', e.target.value)}
                      placeholder="e.g. Yes! Quick Calculator uses browser-native mathematical engines with zero server latency."
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-cyan-500 resize-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Real-Time Live SEO Rank Score & SERP Snippet */}
        <div className="space-y-6">
          {/* Live SEO Score Gauge Card */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg sticky top-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-sm text-white">Live SEO Score</h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Real-Time Analyzer
              </span>
            </div>

            {/* Radial Gauge Chart with Smooth CSS Transitions */}
            <RadialSeoGauge
              score={seoAnalysis.score}
              rating={seoAnalysis.rating}
              size={136}
              strokeWidth={9}
              analysis={seoAnalysis}
            />

            {/* Checklist items */}
            <div className="space-y-2.5 pt-1">
              {seoAnalysis.checks.map((check) => (
                <div key={check.id} className="flex items-start gap-2 text-xs">
                  {check.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`font-medium ${
                          check.passed ? 'text-slate-200' : 'text-slate-400'
                        }`}
                      >
                        {check.label}
                      </span>
                      {check.id === 'internal-links' && scanResult.totalSuggestions > 0 && (
                        <button
                          type="button"
                          onClick={handleConvertAll}
                          className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                          title="1-Click convert all suggestions"
                        >
                          <Zap className="w-2.5 h-2.5" />
                          <span>Link {scanResult.totalSuggestions}</span>
                        </button>
                      )}
                    </div>
                    {!check.passed && (
                      <span className="block text-[10px] text-amber-400/80 font-mono mt-0.5 leading-tight">
                        {check.tip}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Density: {seoAnalysis.keywordDensity}%</span>
              <span>Tool Links: {seoAnalysis.internalLinkCount}</span>
            </div>

            {/* Google SERP Snippet Simulator */}
            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  SERP Snippet Preview
                </span>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSerpViewDevice('desktop')}
                    className={`p-1 rounded ${
                      serpViewDevice === 'desktop' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500'
                    }`}
                    title="Desktop Preview"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSerpViewDevice('mobile')}
                    className={`p-1 rounded ${
                      serpViewDevice === 'mobile' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500'
                    }`}
                    title="Mobile Preview"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div
                className={`p-3.5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-1 ${
                  serpViewDevice === 'mobile' ? 'max-w-[280px] mx-auto' : ''
                }`}
              >
                <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 truncate">
                  <span>https://quickcalc.in › blogs › </span>
                  <span className="text-cyan-400 font-bold">{postSlug || 'article-slug'}</span>
                </div>
                <div className="text-xs font-semibold text-blue-400 hover:underline line-clamp-2 leading-snug cursor-pointer">
                  {postTitle || 'Article Title - Quick Calculator'}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {postMetaDescription ||
                    'Explore comprehensive guides and calculator utilities at Quick Calculator.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
