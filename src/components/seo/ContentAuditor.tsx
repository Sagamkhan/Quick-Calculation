import React, { useState } from 'react';
import { FileText, AlertTriangle, CheckCircle2, Copy, Check, BarChart2, Layers, AlignLeft, BookOpen, Download } from 'lucide-react';
import { triggerConfetti } from '../../utils/confetti';

interface ContentAuditorProps {
  mode: 'density' | 'headings' | 'readability' | 'htmlstrip';
}

export function ContentAuditor({ mode }: ContentAuditorProps) {
  const [inputText, setInputText] = useState(() => {
    if (mode === 'headings') {
      return `<h1>Best Free SEO Tools and Online Web Calculators</h1>
<p>Introductory paragraph outlining web performance and audit tools.</p>
<h2>1. Core Technical SEO Features</h2>
<p>Technical search factors include XML sitemaps, robots.txt, and meta tags.</p>
<h3>1.1 XML Sitemap Generation</h3>
<p>Submit valid XML sitemaps to Google Search Console for instant crawling.</p>
<h3>1.2 Robots.txt Directives</h3>
<p>Manage Googlebot user-agent crawl-delays and disallowed private directories.</p>
<h2>2. On-Page Keyword Optimization</h2>
<p>Target search intent with exact keyword density and heading hierarchy.</p>
<h3>2.1 Schema Markup JSON-LD</h3>
<p>Rich snippet accordions and FAQPage schema formatting.</p>`;
    }
    if (mode === 'htmlstrip') {
      return `<div class="article-container">
  <header>
    <h1>Comprehensive Guide to Online Financial Planning</h1>
    <nav><a href="/">Home</a> | <a href="/tools">Calculators</a></nav>
  </header>
  <main>
    <p>Calculating your monthly <strong>SIP returns</strong> and loan EMI is essential for long-term financial security.</p>
    <script>console.log("Tracking analytics script");</script>
    <style>.article-container { font-family: sans-serif; }</style>
    <!-- Internal Developer Comment -->
    <p>Compound interest accumulates exponential gains over 10 to 20 year horizons.</p>
  </main>
</div>`;
    }
    return `Quick Calculator is an all-in-one suite of free online calculators, developer utilities, and SEO website audit tools. Calculate monthly SIP mutual fund returns, loan EMI schedules, compress heavy PDF files, and audit meta tags in real-time. Our client-side privacy architecture guarantees zero server tracking and instant calculation speeds. Optimize your web workflow with 250+ free tools today.`;
  });

  const [copied, setCopied] = useState(false);
  const [ngramType, setNgramType] = useState<1 | 2 | 3>(1);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    triggerConfetti(0.3);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Keyword Density & N-Gram Analyzer
  const analyzeDensity = () => {
    const cleanTokens = inputText
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2);

    const totalWords = cleanTokens.length;
    const freqMap: Record<string, number> = {};

    if (ngramType === 1) {
      cleanTokens.forEach(t => {
        freqMap[t] = (freqMap[t] || 0) + 1;
      });
    } else if (ngramType === 2) {
      for (let i = 0; i < cleanTokens.length - 1; i++) {
        const bigram = `${cleanTokens[i]} ${cleanTokens[i + 1]}`;
        freqMap[bigram] = (freqMap[bigram] || 0) + 1;
      }
    } else {
      for (let i = 0; i < cleanTokens.length - 2; i++) {
        const trigram = `${cleanTokens[i]} ${cleanTokens[i + 1]} ${cleanTokens[i + 2]}`;
        freqMap[trigram] = (freqMap[trigram] || 0) + 1;
      }
    }

    const sortedPhrases = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([phrase, count]) => {
        const density = totalWords > 0 ? ((count / totalWords) * 100).toFixed(1) : '0.0';
        return {
          phrase,
          count,
          density: `${density}%`,
          isHigh: parseFloat(density) > 3.5
        };
      });

    return { totalWords, phrases: sortedPhrases };
  };

  // 2. Heading Hierarchy Inspector
  const analyzeHeadings = () => {
    // Match <h1> to <h6> tags or markdown # to ######
    const headingRegex = /<(h[1-6])[^>]*>(.*?)<\/\1>|^(#{1,6})\s+(.+)$/gim;
    const headings: { level: number; text: string; rawTag: string }[] = [];
    let match;

    while ((match = headingRegex.exec(inputText)) !== null) {
      if (match[1]) {
        headings.push({
          level: parseInt(match[1].replace('h', '')),
          text: match[2].replace(/<[^>]+>/g, '').trim(),
          rawTag: match[1].toUpperCase()
        });
      } else if (match[3]) {
        headings.push({
          level: match[3].length,
          text: match[4].trim(),
          rawTag: `H${match[3].length}`
        });
      }
    }

    const h1Count = headings.filter(h => h.level === 1).length;
    const issues: { type: 'pass' | 'warning' | 'error'; message: string }[] = [];

    if (h1Count === 1) {
      issues.push({ type: 'pass', message: 'Optimal single H1 tag detected.' });
    } else if (h1Count === 0) {
      issues.push({ type: 'error', message: 'Missing primary H1 tag! Search engines require 1 clear H1.' });
    } else {
      issues.push({ type: 'warning', message: `Found ${h1Count} H1 tags. Best practice is exactly 1 H1 per page.` });
    }

    let prevLevel = 1;
    let hasSkipped = false;
    headings.forEach(h => {
      if (h.level > prevLevel + 1) {
        hasSkipped = true;
      }
      prevLevel = h.level;
    });

    if (hasSkipped) {
      issues.push({ type: 'warning', message: 'Skipped heading hierarchy detected (e.g. H2 straight to H4).' });
    } else if (headings.length > 1) {
      issues.push({ type: 'pass', message: 'Logical heading sequence maintained without skipping levels.' });
    }

    return { headings, issues, h1Count };
  };

  // 3. Flesch-Kincaid Readability Calculator
  const calculateReadability = () => {
    const rawWords = inputText.trim().split(/\s+/).filter(Boolean);
    const totalWords = rawWords.length || 1;
    const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const totalSentences = sentences.length || 1;

    // Approximate syllable count
    let totalSyllables = 0;
    rawWords.forEach(word => {
      const w = word.toLowerCase().replace(/[^a-z]/g, '');
      if (w.length <= 3) {
        totalSyllables += 1;
      } else {
        const matches = w.match(/[aeiouy]{1,2}/g);
        totalSyllables += matches ? matches.length : 1;
      }
    });

    // Flesch Reading Ease: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
    const wordsPerSentence = totalWords / totalSentences;
    const syllablesPerWord = totalSyllables / totalWords;
    let fleschScore = Math.round(206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord));
    fleschScore = Math.max(0, Math.min(100, fleschScore));

    // Grade Level
    let grade = Math.round(0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59);
    grade = Math.max(1, grade);

    let easeLabel = 'Standard / Plain English';
    let easeColor = 'text-emerald-400';
    if (fleschScore >= 80) {
      easeLabel = 'Very Easy (6th Grade)';
      easeColor = 'text-teal-400';
    } else if (fleschScore >= 60) {
      easeLabel = 'Standard / Conversational (8th-9th Grade)';
      easeColor = 'text-emerald-400';
    } else if (fleschScore >= 40) {
      easeLabel = 'Difficult / Academic (College Level)';
      easeColor = 'text-amber-400';
    } else {
      easeLabel = 'Very Confusing / Technical Post-Graduate';
      easeColor = 'text-rose-400';
    }

    return {
      fleschScore,
      grade,
      totalWords,
      totalSentences,
      avgWordsPerSentence: wordsPerSentence.toFixed(1),
      easeLabel,
      easeColor
    };
  };

  // 4. HTML to Clean Text Stripper
  const processHtmlStrip = () => {
    let clean = inputText;
    // Remove scripts and styles
    clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
    clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
    // Remove HTML comments
    clean = clean.replace(/<!--[\s\S]*?-->/g, ' ');
    // Remove tags
    clean = clean.replace(/<[^>]+>/g, ' ');
    // Normalize whitespace
    clean = clean.replace(/\s+/g, ' ').trim();

    const rawBytes = new Blob([inputText]).size;
    const cleanBytes = new Blob([clean]).size;
    const codeToTextRatio = rawBytes > 0 ? ((cleanBytes / rawBytes) * 100).toFixed(1) : '100';

    return {
      cleanText: clean,
      rawBytes,
      cleanBytes,
      codeToTextRatio,
      wordCount: clean.split(/\s+/).filter(Boolean).length
    };
  };

  return (
    <div className="space-y-6">
      {/* 1. Keyword Density View */}
      {mode === 'density' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-cyan-300">Article Content or Webpage Copy</label>
              <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                {([1, 2, 3] as const).map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNgramType(n)}
                    className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                      ngramType === n ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {n}-Word N-Grams
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-sans text-slate-200 focus:outline-none focus:border-cyan-400 leading-relaxed"
              placeholder="Paste article body copy to audit phrase frequency..."
            />
          </div>

          {(() => {
            const data = analyzeDensity();
            return (
              <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-300">
                    N-Gram Frequency Breakdown ({data.totalWords} Total Analyzed Words)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-2">Phrase</th>
                        <th className="pb-2">Occurrences</th>
                        <th className="pb-2">Density %</th>
                        <th className="pb-2">SEO Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {data.phrases.map((item, idx) => (
                        <tr key={idx} className="hover:bg-cyan-500/5">
                          <td className="py-2.5 font-bold text-slate-200">{item.phrase}</td>
                          <td className="py-2.5 text-cyan-300 font-bold">{item.count}x</td>
                          <td className="py-2.5 text-emerald-400 font-bold">{item.density}</td>
                          <td className="py-2.5">
                            {item.isHigh ? (
                              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">
                                High Density Alert (&gt;3.5%)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                                Optimal Density (1-3%)
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 2. Heading Hierarchy Inspector View */}
      {mode === 'headings' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 space-y-3">
            <label className="text-xs font-mono font-bold text-cyan-300">HTML Source Code or Markdown Outline</label>
            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-100 focus:outline-none focus:border-cyan-400"
              placeholder="Paste HTML with <h1> to <h6> tags or Markdown # headings..."
            />
          </div>

          {(() => {
            const data = analyzeHeadings();
            return (
              <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4">
                {/* Structural Score & Diagnostics */}
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-cyan-300">Structural Validation Matrix</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {data.issues.map((issue, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-sans ${
                          issue.type === 'pass'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : issue.type === 'warning'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        }`}
                      >
                        {issue.type === 'pass' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />}
                        {issue.type === 'warning' && <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />}
                        {issue.type === 'error' && <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />}
                        <span>{issue.message}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tree Outline Visualizer */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-xs font-mono font-bold text-slate-300">
                    Heading Tree Outline ({data.headings.length} Headings Found)
                  </span>
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800 max-h-60 overflow-y-auto font-mono text-xs">
                    {data.headings.map((h, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2"
                        style={{ paddingLeft: `${(h.level - 1) * 20}px` }}
                      >
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          h.level === 1 ? 'bg-cyan-500 text-slate-950' : h.level === 2 ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {h.rawTag}
                        </span>
                        <span className="text-slate-200">{h.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 3. Readability Calculator View */}
      {mode === 'readability' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 space-y-3">
            <label className="text-xs font-mono font-bold text-cyan-300">Content Copy for Readability Evaluation</label>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-sans text-slate-200 focus:outline-none focus:border-cyan-400 leading-relaxed"
              placeholder="Paste article paragraphs..."
            />
          </div>

          {(() => {
            const data = calculateReadability();
            return (
              <div className="p-6 rounded-3xl bg-slate-950 border border-cyan-500/30 space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="block text-[10px] font-mono text-slate-400">Flesch Reading Ease</span>
                    <span className={`text-2xl font-bold ${data.easeColor}`}>{data.fleschScore} / 100</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="block text-[10px] font-mono text-slate-400">Flesch-Kincaid Grade</span>
                    <span className="text-2xl font-bold text-cyan-300">Grade {data.grade}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="block text-[10px] font-mono text-slate-400">Total Word Count</span>
                    <span className="text-2xl font-bold text-white">{data.totalWords}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="block text-[10px] font-mono text-slate-400">Avg Sentence Length</span>
                    <span className="text-2xl font-bold text-purple-300">{data.avgWordsPerSentence} w/s</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-xs font-mono font-bold text-cyan-300">SEO Readability Verdict:</span>
                  <p className={`text-sm font-semibold ${data.easeColor}`}>{data.easeLabel}</p>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans pt-1">
                    Search engine algorithms favor conversational content written at an 8th-grade reading level (Flesch score 60-70) for higher dwell time and featured snippet acquisition.
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* 4. HTML to Clean Text Stripper View */}
      {mode === 'htmlstrip' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 space-y-3">
            <label className="text-xs font-mono font-bold text-cyan-300">Raw HTML Markup Payload</label>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-100 focus:outline-none focus:border-cyan-400"
              placeholder="Paste HTML source code with tags, scripts, and styles..."
            />
          </div>

          {(() => {
            const data = processHtmlStrip();
            return (
              <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="block text-[10px] font-mono text-slate-400">HTML Payload Size</span>
                    <span className="text-base font-bold text-white">{data.rawBytes} bytes</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="block text-[10px] font-mono text-slate-400">Clean Text Size</span>
                    <span className="text-base font-bold text-emerald-400">{data.cleanBytes} bytes</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="block text-[10px] font-mono text-slate-400">Code-to-Text Ratio</span>
                    <span className="text-base font-bold text-cyan-300">{data.codeToTextRatio}%</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      Clean Indexable Body Text ({data.wordCount} words)
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(data.cleanText)}
                      className="px-2.5 py-1 rounded bg-slate-800 text-xs font-mono text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copied ? 'Copied!' : 'Copy Clean Text'}</span>
                    </button>
                  </div>
                  <p className="text-xs font-sans text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed max-h-48 overflow-y-auto">
                    {data.cleanText}
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
