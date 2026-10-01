import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Filter, BarChart2, AlertCircle, FileText } from 'lucide-react';
import { ToolComponentProps } from './registry';

const COMMON_STOP_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as',
  'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will',
  'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which',
  'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year',
  'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its',
  'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
  'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'is', 'are', 'was', 'were', 'been', 'has', 'had'
]);

const SAMPLE_TEXT = `Online financial calculators and investment tools empower individuals to make data-driven decisions. Using a systematic investment plan calculator, investors can project compound interest returns on mutual funds. A reliable loan EMI calculator determines monthly principal and interest payouts. With the rise of digital finance in India, personal loan and home loan calculators help borrowers compare banking rates. Choosing the right investment calculator simplifies long term retirement planning.`;

export default function KeywordDensityChecker({ tool, onBack }: ToolComponentProps) {
  const [content, setContent] = useState<string>(SAMPLE_TEXT);
  const [filterStopWords, setFilterStopWords] = useState<boolean>(true);
  const [ngramType, setNgramType] = useState<1 | 2 | 3>(1);
  const [copied, setCopied] = useState<boolean>(false);

  const stats = useMemo(() => {
    if (!content.trim()) {
      return { totalWords: 0, totalChars: 0, readingTimeMin: 0, keywords: [] };
    }

    const words = content
      .toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 1 && !/^\d+$/.test(w));

    const totalWords = words.length;
    const totalChars = content.length;
    const readingTimeMin = Math.ceil(totalWords / 200);

    const freqMap = new Map<string, number>();

    if (ngramType === 1) {
      for (const word of words) {
        if (filterStopWords && COMMON_STOP_WORDS.has(word)) continue;
        freqMap.set(word, (freqMap.get(word) || 0) + 1);
      }
    } else if (ngramType === 2) {
      for (let i = 0; i < words.length - 1; i++) {
        const w1 = words[i];
        const w2 = words[i + 1];
        if (filterStopWords && (COMMON_STOP_WORDS.has(w1) || COMMON_STOP_WORDS.has(w2))) continue;
        const phrase = `${w1} ${w2}`;
        freqMap.set(phrase, (freqMap.get(phrase) || 0) + 1);
      }
    } else {
      for (let i = 0; i < words.length - 2; i++) {
        const w1 = words[i];
        const w2 = words[i + 1];
        const w3 = words[i + 2];
        if (filterStopWords && (COMMON_STOP_WORDS.has(w1) && COMMON_STOP_WORDS.has(w3))) continue;
        const phrase = `${w1} ${w2} ${w3}`;
        freqMap.set(phrase, (freqMap.get(phrase) || 0) + 1);
      }
    }

    const keywords = Array.from(freqMap.entries())
      .map(([term, count]) => {
        const density = totalWords > 0 ? (count / totalWords) * 100 : 0;
        return { term, count, density: Number(density.toFixed(2)) };
      })
      .sort((a, b) => b.count - a.count || b.density - a.density)
      .slice(0, 20);

    return { totalWords, totalChars, readingTimeMin, keywords };
  }, [content, filterStopWords, ngramType]);

  const handleCopy = () => {
    const list = stats.keywords.map(k => `${k.term}: ${k.count} times (${k.density}%)`).join('\n');
    navigator.clipboard.writeText(`Keyword Density Report:\nTotal Words: ${stats.totalWords}\n\n${list}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Keyword Density Checker - On-Page SEO Frequency & N-Gram Analyzer
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Detect over-optimized keywords, analyze phrase repetition, and identify semantic topic density across 1-word, 2-word, and 3-word n-grams.
        </p>
      </div>

      {/* Input area */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-cyan-400" /> Content to Analyze
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setContent(SAMPLE_TEXT)}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Load Sample
            </button>
            <button
              type="button"
              onClick={() => setContent('')}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Clear
            </button>
          </div>
        </div>

        <textarea
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste blog post, article, or webpage copy to analyze keyword frequency..."
          className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500 placeholder:text-slate-600 resize-y"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={filterStopWords}
                onChange={(e) => setFilterStopWords(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span className="flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-cyan-400" /> Ignore Stop Words (the, is, and)
              </span>
            </label>
          </div>

          {/* N-Gram Selector */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setNgramType(1)}
              className={`px-2.5 py-1 text-xs rounded font-medium transition ${ngramType === 1 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              1-Word
            </button>
            <button
              type="button"
              onClick={() => setNgramType(2)}
              className={`px-2.5 py-1 text-xs rounded font-medium transition ${ngramType === 2 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              2-Word Phrases
            </button>
            <button
              type="button"
              onClick={() => setNgramType(3)}
              className={`px-2.5 py-1 text-xs rounded font-medium transition ${ngramType === 3 ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              3-Word Phrases
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Total Word Count</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">{stats.totalWords}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Character Count</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1">{stats.totalChars}</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Est. Reading Time</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">~{stats.readingTimeMin} min</div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Distinct Terms</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1">{stats.keywords.length}</div>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition"
            title="Copy Report"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Keywords Table */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-cyan-400" /> Frequency Ranking ({ngramType}-word)
          </span>
          <span className="text-xs text-slate-400 font-normal">Ideal SEO Density: 1.0% – 2.5%</span>
        </h3>

        {stats.keywords.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No keywords found. Enter or paste text in the box above to generate density rankings.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 px-3 font-semibold">Keyword / Phrase</th>
                  <th className="py-2 px-3 font-semibold text-center">Occurrences</th>
                  <th className="py-2 px-3 font-semibold text-right">Density (%)</th>
                  <th className="py-2 px-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {stats.keywords.map((kw, i) => {
                  const isWarning = kw.density > 3.5;
                  const isOptimal = kw.density >= 1.0 && kw.density <= 3.0;

                  return (
                    <tr key={i} className="hover:bg-slate-800/40 transition">
                      <td className="py-2.5 px-3 font-medium text-white flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 w-4">{i + 1}.</span>
                        <span>{kw.term}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-cyan-300 font-bold">{kw.count}</td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 bg-slate-950 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full ${isWarning ? 'bg-rose-500' : isOptimal ? 'bg-emerald-400' : 'bg-cyan-400'}`}
                              style={{ width: `${Math.min(100, (kw.density / 4) * 100)}%` }}
                            />
                          </div>
                          <span>{kw.density}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {isWarning ? (
                          <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 text-[10px]">
                            Keyword Stuffing?
                          </span>
                        ) : isOptimal ? (
                          <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px]">
                            Optimal
                          </span>
                        ) : (
                          <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded text-[10px]">
                            Normal
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3-Line FAQ */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-cyan-400" /> Frequently Asked Questions
        </h4>
        <div className="space-y-2 text-xs text-slate-400 divide-y divide-slate-800/80">
          <div className="pt-2">
            <strong className="text-slate-300">What is the ideal keyword density percentage for Google SEO?</strong>
            <p className="mt-0.5">Most SEO specialists recommend an optimal keyword density between 1% and 2.5% to avoid keyword stuffing penalties.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">What is the difference between 1-word and 2/3-word n-grams?</strong>
            <p className="mt-0.5">N-grams group adjacent words into multi-word phrases to analyze long-tail search queries instead of isolated single terms.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">How do stop words affect keyword density calculations?</strong>
            <p className="mt-0.5">Filtering stop words (e.g. 'the', 'and', 'with') ensures frequency counts focus exclusively on meaningful commercial and topical terms.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
