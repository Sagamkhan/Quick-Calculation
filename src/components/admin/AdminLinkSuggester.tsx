import React, { useState } from 'react';
import {
  Sparkles,
  Link as LinkIcon,
  CheckCircle2,
  ExternalLink,
  Zap,
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import {
  LinkSuggestion,
  AlreadyLinkedTool,
  ScanResult
} from '../../utils/internalLinkSuggester';

interface AdminLinkSuggesterProps {
  scanResult: ScanResult;
  onConvertSingle: (suggestion: LinkSuggestion) => void;
  onConvertAll: () => void;
  onDismissSuggestion: (id: string) => void;
  onRescan: () => void;
  onOpenToolPicker: () => void;
  isScanning?: boolean;
}

export default function AdminLinkSuggester({
  scanResult,
  onConvertSingle,
  onConvertAll,
  onDismissSuggestion,
  onRescan,
  onOpenToolPicker,
  isScanning = false
}: AdminLinkSuggesterProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'linked'>('suggestions');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const { suggestions, alreadyLinked, totalSuggestions } = scanResult;

  // Extract unique categories in suggestions
  const availableCategories = Array.from(new Set(suggestions.map((s) => s.category)));

  const filteredSuggestions = suggestions.filter((s) => {
    if (filterCategory === 'all') return true;
    return s.category === filterCategory;
  });

  return (
    <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg transition-all">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/30 shadow-inner">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-white">
                Auto-Scan Tool Slug & Internal Link Intelligence
              </h4>
              {totalSuggestions > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold flex items-center gap-1 animate-pulse">
                  <Sparkles className="w-3 h-3" />
                  {totalSuggestions} Suggestion{totalSuggestions > 1 ? 's' : ''}
                </span>
              ) : alreadyLinked.length > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {alreadyLinked.length} Linked
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono">
                  Ready
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Scans draft content for technical terms matching existing tool slugs for 1-click SEO internal linking.
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          {totalSuggestions > 0 && (
            <button
              type="button"
              onClick={onConvertAll}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Convert All to Links ({totalSuggestions})</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRescan}
            disabled={isScanning}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
            title="Re-scan Draft Content"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse scanner' : 'Expand scanner'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Content Area */}
      {isExpanded && (
        <div className="space-y-3 pt-2 border-t border-slate-800/80">
          {/* Subheader Navigation & Category Filter */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('suggestions')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'suggestions'
                    ? 'bg-cyan-500/20 text-cyan-400 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Pending Mentions</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {totalSuggestions}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('linked')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'linked'
                    ? 'bg-cyan-500/20 text-cyan-400 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Already Linked</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {alreadyLinked.length}
                </span>
              </button>
            </div>

            {activeTab === 'suggestions' && availableCategories.length > 1 && (
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="w-3 h-3 text-slate-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="all">All Categories ({suggestions.length})</option>
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* TAB 1: PENDING SUGGESTIONS */}
          {activeTab === 'suggestions' && (
            <div className="space-y-2">
              {filteredSuggestions.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-white">
                      {totalSuggestions === 0
                        ? 'No unlinked tool terms detected in this draft'
                        : 'No suggestions match this category filter'}
                    </h5>
                    <p className="text-[11px] text-slate-400 max-w-md mx-auto mt-1">
                      {totalSuggestions === 0
                        ? 'Your draft content is either fully linked or contains no matching calculator terms. Mention tools like "SIP Calculator", "JSON Formatter", or "BMI Calculator" in your text.'
                        : 'Try selecting "All Categories" to see remaining suggestions.'}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={onOpenToolPicker}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>Manually Insert Tool Link</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                  {filteredSuggestions.map((sug) => (
                    <div
                      key={sug.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/90 hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-3 group"
                    >
                      <div className="space-y-2">
                        {/* Top Badge Info */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 font-mono font-bold text-xs border border-cyan-500/20">
                              "{sug.term}"
                            </span>
                            <ArrowRight className="w-3 h-3 text-slate-500" />
                            <span className="text-xs font-semibold text-slate-200 truncate max-w-[150px]">
                              {sug.tool.name}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => onDismissSuggestion(sug.id)}
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                            title="Dismiss suggestion"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Destination permalink slug */}
                        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                          <span className="text-cyan-400 font-medium">{sug.url}</span>
                          <span>•</span>
                          <span className="text-slate-400">{sug.category}</span>
                          {sug.occurrences > 1 && (
                            <>
                              <span>•</span>
                              <span className="text-amber-400 font-bold">
                                {sug.occurrences}x in text
                              </span>
                            </>
                          )}
                        </div>

                        {/* Surrounding context snippet */}
                        <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed font-sans">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: sug.contextSnippet.replace(
                                /\*\*(.*?)\*\*/g,
                                '<span class="text-cyan-300 font-bold bg-cyan-500/10 px-1 rounded">$1</span>'
                              )
                            }}
                          />
                        </div>
                      </div>

                      {/* 1-Click Conversion Action */}
                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-slate-500">
                          Format: <code className="text-slate-400">[{sug.term}]({sug.url})</code>
                        </span>

                        <button
                          type="button"
                          onClick={() => onConvertSingle(sug)}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                        >
                          <Zap className="w-3 h-3" />
                          <span>Convert (1-Click)</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ALREADY LINKED TOOLS */}
          {activeTab === 'linked' && (
            <div className="space-y-2">
              {alreadyLinked.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center space-y-2">
                  <Info className="w-6 h-6 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">
                    No calculator tools are currently linked in this draft.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Linking 2-4 relevant tools significantly improves topical authority and reader engagement.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {alreadyLinked.map((item) => (
                    <div
                      key={item.toolSlug}
                      className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/20 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white flex items-center gap-1.5 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{item.toolName}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                          Anchor: <span className="text-cyan-300">"{item.anchorText}"</span> ({item.url})
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 shrink-0">
                        {item.count}x
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
