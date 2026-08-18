import React, { useState } from 'react';
import { Search, Sparkles, Download, Copy, Check, Filter, Layers, Target, Compass, BookOpen, ShoppingBag, CreditCard } from 'lucide-react';
import { triggerConfetti } from '../../utils/confetti';

interface KeywordLabProps {
  mode: 'longtail' | 'intent' | 'typo' | 'stopwords';
}

const STOP_WORDS_SET = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', "aren't",
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', "can't", 'cannot', 'could', "couldn't", 'did', "didn't", 'do', 'does', "doesn't", 'doing',
  "don't", 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', "hadn't", 'has', "hasn't",
  'have', "haven't", 'having', 'he', "he'd", "he'll", "he's", 'her', 'here', "here's", 'hers', 'herself',
  'him', 'himself', 'his', 'how', "how's", 'i', "i'd", "i'll", "i'm", "i've", 'if', 'in', 'into', 'is',
  "isn't", 'it', "it's", 'its', 'itself', 'let', "let's", 'me', 'more', 'most', "mustn't", 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves',
  'out', 'over', 'own', 'same', "shan't", 'she', "she'd", "she'll", "she's", 'should', "shouldn't", 'so',
  'some', 'such', 'than', 'that', "that's", 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
  "there's", 'these', 'they', "they'd", "they'll", "they're", "they've", 'this', 'those', 'through', 'to',
  'too', 'under', 'until', 'up', 'very', 'was', "wasn't", 'we', "we'd", "we'll", "we're", "we've", 'were',
  "weren't", 'what', "what's", 'when', "when's", 'where', "where's", 'which', 'while', 'who', "who's",
  'whom', 'why', "why's", 'with', "won't", 'would', "wouldn't", 'you', "you'd", "you'll", "you're", "you've",
  'your', 'yours', 'yourself', 'yourselves'
]);

export function KeywordLab({ mode }: KeywordLabProps) {
  const [seedKeyword, setSeedKeyword] = useState('online calculator');
  const [inputText, setInputText] = useState(
    'Discover the best free online financial calculator for personal wealth and investment with zero signup.'
  );
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'questions' | 'commercial' | 'prepositions'>('all');

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    triggerConfetti(0.3);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    triggerConfetti(0.4);
  };

  // 1. Long-Tail & LSI Engine
  const generateLongTail = () => {
    const kw = seedKeyword.trim().toLowerCase() || 'seo tools';
    const questions = [
      { kw: `how to use ${kw} for website audit`, vol: '14,200', kd: '18%', intent: 'Informational', type: 'Question' },
      { kw: `what is the best ${kw} free online`, vol: '22,400', kd: '24%', intent: 'Commercial', type: 'Question' },
      { kw: `why is ${kw} important for google ranking`, vol: '9,800', kd: '15%', intent: 'Informational', type: 'Question' },
      { kw: `where to find free ${kw} with no login`, vol: '8,600', kd: '12%', intent: 'Transactional', type: 'Question' },
      { kw: `can ${kw} improve core web vitals`, vol: '6,100', kd: '11%', intent: 'Informational', type: 'Question' },
    ];
    const commercial = [
      { kw: `best ${kw} software vs paid tools 2026`, vol: '18,900', kd: '31%', intent: 'Commercial', type: 'Commercial' },
      { kw: `top 10 ${kw} platforms for agency`, vol: '12,500', kd: '28%', intent: 'Commercial', type: 'Commercial' },
      { kw: `${kw} alternative to semrush and ahrefs`, vol: '15,300', kd: '22%', intent: 'Commercial', type: 'Commercial' },
      { kw: `buy ${kw} lifetime license discount`, vol: '5,400', kd: '35%', intent: 'Transactional', type: 'Commercial' },
    ];
    const prepositions = [
      { kw: `${kw} for beginners step by step`, vol: '11,200', kd: '14%', intent: 'Informational', type: 'Preposition' },
      { kw: `${kw} with export to pdf and csv`, vol: '7,800', kd: '16%', intent: 'Transactional', type: 'Preposition' },
      { kw: `${kw} near me for local business`, vol: '4,900', kd: '21%', intent: 'Commercial', type: 'Preposition' },
      { kw: `${kw} without signup or subscription`, vol: '16,700', kd: '19%', intent: 'Transactional', type: 'Preposition' },
    ];

    const allItems = [...questions, ...commercial, ...prepositions];
    if (activeCategory === 'questions') return questions;
    if (activeCategory === 'commercial') return commercial;
    if (activeCategory === 'prepositions') return prepositions;
    return allItems;
  };

  // 2. Search Intent Classifier
  const analyzeSearchIntent = () => {
    const text = seedKeyword.trim().toLowerCase();
    const isCommercial = /best|top|review|vs|compare|rating|alternative|cheap|pricing/i.test(text);
    const isTransactional = /buy|order|download|price|coupon|discount|sign up|hire|service|calculator|generator/i.test(text);
    const isNavigational = /login|portal|signin|official|website|app|dashboard|account/i.test(text);
    
    let primaryIntent = 'Informational';
    let icon = BookOpen;
    let color = 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    let description = 'User seeks general knowledge, definitions, tutorials, or guides.';
    let serpRecommendation = 'Create comprehensive pillar guides, FAQ accordions, and how-to diagrams.';

    if (isTransactional) {
      primaryIntent = 'Transactional';
      icon = CreditCard;
      color = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      description = 'User has high commercial urgency to purchase, convert, or calculate results directly.';
      serpRecommendation = 'Provide direct interactive web tools, transparent value, fast load speed, and 1-click CTA.';
    } else if (isCommercial) {
      primaryIntent = 'Commercial Investigation';
      icon = ShoppingBag;
      color = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      description = 'User is comparing solutions, exploring alternatives, or evaluating options before buying.';
      serpRecommendation = 'Publish head-to-head comparison matrices, pros & cons lists, and feature benchmark tables.';
    } else if (isNavigational) {
      primaryIntent = 'Navigational';
      icon = Compass;
      color = 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      description = 'User is looking for a specific brand, portal, or login URL.';
      serpRecommendation = 'Ensure exact match brand domain title tags and clear site links in SERP schema.';
    }

    return { primaryIntent, icon, color, description, serpRecommendation };
  };

  // 3. Typo & Misspelling Generator
  const generateTypos = () => {
    const word = seedKeyword.trim().toLowerCase() || 'calculator';
    const typos: { typo: string; type: string }[] = [];

    // Omitted double letters
    for (let i = 0; i < word.length - 1; i++) {
      if (word[i] === word[i + 1]) {
        typos.push({ typo: word.slice(0, i) + word.slice(i + 1), type: 'Double Letter Omission' });
      }
    }

    // Transposed adjacent letters
    for (let i = 0; i < word.length - 1; i++) {
      const transposed = word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2);
      if (transposed !== word) typos.push({ typo: transposed, type: 'Transposed Letters' });
    }

    // Skipped character
    for (let i = 1; i < word.length - 1; i++) {
      typos.push({ typo: word.slice(0, i) + word.slice(i + 1), type: 'Skipped Character' });
    }

    // Fat-finger keyboard proximity (qwerty)
    const keyboardNearby: Record<string, string[]> = {
      a: ['s', 'q', 'z'], c: ['x', 'v', 'd'], e: ['w', 'r', 'd'],
      i: ['u', 'o', 'k'], l: ['k', 'o', 'p'], o: ['i', 'p', 'l'],
      r: ['e', 't', 'f'], s: ['a', 'd', 'w'], t: ['r', 'y', 'g']
    };

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (keyboardNearby[char]) {
        keyboardNearby[char].forEach(near => {
          typos.push({ typo: word.slice(0, i) + near + word.slice(i + 1), type: 'Keyboard Proximity' });
        });
      }
    }

    // Deduplicate
    const uniqueMap = new Map<string, string>();
    typos.forEach(t => {
      if (!uniqueMap.has(t.typo) && t.typo !== word) {
        uniqueMap.set(t.typo, t.type);
      }
    });

    return Array.from(uniqueMap.entries()).slice(0, 24).map(([typo, type]) => ({ typo, type }));
  };

  // 4. Stop Words Filter
  const processStopWords = () => {
    const rawTokens = inputText.split(/\s+/).filter(Boolean);
    const cleanedTokens: string[] = [];
    const strippedWords: string[] = [];

    rawTokens.forEach(t => {
      const clean = t.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (STOP_WORDS_SET.has(clean)) {
        strippedWords.push(t);
      } else if (clean.length > 0) {
        cleanedTokens.push(t);
      }
    });

    const reductionRate = rawTokens.length > 0 
      ? Math.round((strippedWords.length / rawTokens.length) * 100)
      : 0;

    return {
      originalCount: rawTokens.length,
      cleanedCount: cleanedTokens.length,
      strippedCount: strippedWords.length,
      reductionRate,
      cleanedText: cleanedTokens.join(' '),
      strippedList: strippedWords
    };
  };

  return (
    <div className="space-y-6">
      {/* 1. Long-Tail Keyword Generator View */}
      {mode === 'longtail' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 space-y-3">
            <label className="text-xs font-mono font-bold text-cyan-300">Seed Keyword / Topic</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-cyan-400/60" />
                <input
                  type="text"
                  value={seedKeyword}
                  onChange={(e) => setSeedKeyword(e.target.value)}
                  placeholder="e.g. online calculator, web audit..."
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-cyan-100 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
              {(['all', 'questions', 'commercial', 'prepositions'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold capitalize transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat} ({cat === 'all' ? 13 : cat === 'questions' ? 5 : 4})
                </button>
              ))}
            </div>
          </div>

          {/* Results Table */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-300">
                Generated Long-Tail Keywords ({generateLongTail().length})
              </span>
              <button
                type="button"
                onClick={() => {
                  const csv = "Keyword,Search Volume,KD %,Intent,Type\n" + 
                    generateLongTail().map(k => `"${k.kw}",${k.vol},${k.kd},${k.intent},${k.type}`).join("\n");
                  handleDownloadCsv("long-tail-keywords.csv", csv);
                }}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2 font-semibold">Long-Tail Search Query</th>
                    <th className="pb-2 font-semibold">Est. Volume</th>
                    <th className="pb-2 font-semibold">KD%</th>
                    <th className="pb-2 font-semibold">Intent</th>
                    <th className="pb-2 font-semibold">Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {generateLongTail().map((item, idx) => (
                    <tr key={idx} className="hover:bg-cyan-500/5 transition-colors">
                      <td className="py-2.5 font-bold text-slate-100">{item.kw}</td>
                      <td className="py-2.5 text-cyan-300 font-bold">{item.vol}</td>
                      <td className="py-2.5 text-emerald-400 font-bold">{item.kd}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-cyan-300">
                          {item.intent}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-400 text-[11px]">{item.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. Search Intent Classifier View */}
      {mode === 'intent' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 space-y-3">
            <label className="text-xs font-mono font-bold text-cyan-300">Search Query or Keyword Phrase</label>
            <input
              type="text"
              value={seedKeyword}
              onChange={(e) => setSeedKeyword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-cyan-100 focus:outline-none focus:border-cyan-400"
              placeholder="e.g. best free emi calculator, buy seo tool..."
            />
          </div>

          {/* Intent Card Breakdown */}
          {(() => {
            const intent = analyzeSearchIntent();
            const Icon = intent.icon;
            return (
              <div className="p-6 rounded-3xl bg-slate-950 border border-cyan-500/30 space-y-5">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl border ${intent.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Classified Search Intent</span>
                    <h3 className="text-xl font-display font-bold text-white">{intent.primaryIntent}</h3>
                    <p className="text-xs text-slate-300 mt-0.5">{intent.description}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <span className="text-xs font-mono font-bold text-cyan-300">Target SERP Content Strategy</span>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">{intent.serpRecommendation}</p>
                </div>

                {/* Intent Distribution Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="block text-[10px] font-mono text-slate-400">Informational</span>
                    <span className="text-sm font-bold text-blue-400">📘 Guides & Blog</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="block text-[10px] font-mono text-slate-400">Commercial</span>
                    <span className="text-sm font-bold text-amber-400">📊 Comparisons</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="block text-[10px] font-mono text-slate-400">Transactional</span>
                    <span className="text-sm font-bold text-emerald-400">🛒 Tools & Action</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="block text-[10px] font-mono text-slate-400">Navigational</span>
                    <span className="text-sm font-bold text-purple-400">🧭 Brand URLs</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 3. Keyword Typo Generator View */}
      {mode === 'typo' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 space-y-3">
            <label className="text-xs font-mono font-bold text-cyan-300">Base Keyword (Target Domain or Brand)</label>
            <input
              type="text"
              value={seedKeyword}
              onChange={(e) => setSeedKeyword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-cyan-100 focus:outline-none focus:border-cyan-400"
              placeholder="e.g. calculator, google, semrush..."
            />
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-300">
                Generated Misspellings & Typos ({generateTypos().length})
              </span>
              <button
                type="button"
                onClick={() => handleCopyText(generateTypos().map(t => t.typo).join('\n'))}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied List!' : 'Copy Typo List'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {generateTypos().map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="font-mono text-xs text-rose-300 font-bold">{item.typo}</span>
                  <span className="text-[10px] font-mono text-slate-500">{item.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Stop Words Filter View */}
      {mode === 'stopwords' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 space-y-3">
            <label className="text-xs font-mono font-bold text-cyan-300">Raw Content / Keyword String</label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-100 focus:outline-none focus:border-cyan-400"
              placeholder="Paste article copy, page titles, or search queries..."
            />
          </div>

          {(() => {
            const data = processStopWords();
            return (
              <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="block text-[10px] font-mono text-slate-400">Total Input Words</span>
                    <span className="text-lg font-bold text-white">{data.originalCount}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="block text-[10px] font-mono text-slate-400">Core Keyword Tokens</span>
                    <span className="text-lg font-bold text-emerald-400">{data.cleanedCount}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="block text-[10px] font-mono text-slate-400">Stop Words Removed</span>
                    <span className="text-lg font-bold text-amber-400">{data.strippedCount} ({data.reductionRate}%)</span>
                  </div>
                </div>

                {/* Cleaned Result */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400">Cleaned Topical Entities</span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(data.cleanedText)}
                      className="px-2.5 py-1 rounded bg-slate-800 text-xs font-mono text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Clean Text</span>
                    </button>
                  </div>
                  <p className="text-xs font-mono text-cyan-100 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    {data.cleanedText}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
