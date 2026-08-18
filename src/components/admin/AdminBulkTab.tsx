import React, { useState } from 'react';
import {
  Zap,
  Wand2,
  CheckCircle2,
  Sparkles,
  BookOpen,
  HelpCircle,
  FileCode
} from 'lucide-react';
import { AdminCategory } from '../AdminCMS';
import { TOOLS_CATALOG } from '../../data/categoriesAndTools';

interface AdminBulkTabProps {
  categories: AdminCategory[];
  onBulkGenerateAndPublish: (topics: string[], category: string) => void;
  isGenerating: boolean;
}

const BULK_PRESETS = [
  {
    name: 'Finance & Wealth Calculators',
    category: 'Finance Guides',
    topics: [
      'How to Calculate SIP Returns for 10-Year Wealth Compounding',
      'Step-by-Step Guide to Calculating Home Loan EMI in 2026',
      'Compound Interest vs Simple Interest: Real-World Scenarios',
      'Retirement Corpus Calculator: How Much Do You Need to Retire Early'
    ]
  },
  {
    name: 'Technical SEO & Web Speed',
    category: 'SEO Tools',
    topics: [
      'How to Optimize Meta Tags and Title Lengths for Google SERP',
      'Complete Guide to Implementing FAQPage Schema with JSON-LD',
      'Core Web Vitals Optimization Checklist for React SPAs',
      'XML Sitemap Indexing & IndexNow API Automated Setup'
    ]
  },
  {
    name: 'Developer Utilities & Data Tools',
    category: 'Developer Tips',
    topics: [
      'Top 5 Web Utilities for Cleaning and Formatting JSON Data',
      'How to Securely Hash Passwords Using In-Browser SHA-256 and AES',
      'Client-Side vs Server-Side Calculation: Privacy and Speed Tradeoffs',
      'Base64 Encoding and Decoding Workflows for API Payloads'
    ]
  },
  {
    name: 'Math & Conversions',
    category: 'Math & Utility',
    topics: [
      'Fast Percentage Calculation Formulas for Daily Finance and Discounts',
      'Metric to Imperial Unit Conversion Guide for Engineers',
      'Scientific Calculator Tips for High-Accuracy Precision Computing'
    ]
  }
];

export default function AdminBulkTab({
  categories,
  onBulkGenerateAndPublish,
  isGenerating
}: AdminBulkTabProps) {
  const [topicsText, setTopicsText] = useState<string>(
    `How to Calculate SIP Returns for 10-Year Wealth Compounding\nStep-by-Step Guide to Calculating Home Loan EMI in 2026\nCompound Interest vs Simple Interest: Real-World Scenarios`
  );
  const [selectedCat, setSelectedCat] = useState<string>('Finance Guides');

  const handleApplyPreset = (preset: typeof BULK_PRESETS[0]) => {
    setSelectedCat(preset.category);
    setTopicsText(preset.topics.join('\n'));
  };

  const handleGenerate = () => {
    const rawLines = topicsText.split('\n').map((t) => t.trim()).filter(Boolean);
    if (rawLines.length === 0) return;
    onBulkGenerateAndPublish(rawLines, selectedCat);
  };

  const topicCount = topicsText.split('\n').filter((t) => t.trim().length > 0).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-md">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-white">
              Bulk AI Content Engine & Mass Scaffold
            </h3>
            <p className="text-xs text-slate-400">
              Enter multiple article titles to automatically generate structured markdown posts with complete YAML frontmatter, relevant internal calculator links, and FAQ schemas.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Pickers */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-slate-400 font-semibold block">
          QUICK NICHE PRESETS (CLICK TO LOAD)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {BULK_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-colors cursor-pointer group"
            >
              <div className="font-bold text-xs text-slate-200 group-hover:text-amber-400">
                {preset.name}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-1">
                {preset.topics.length} topics • {preset.category}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Form Container */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
        <div>
          <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
            TARGET CATEGORY
          </label>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-mono text-slate-300 font-semibold">
              ARTICLE TITLES (ONE PER LINE)
            </label>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">
              {topicCount} {topicCount === 1 ? 'article' : 'articles'} queued
            </span>
          </div>
          <textarea
            value={topicsText}
            onChange={(e) => setTopicsText(e.target.value)}
            rows={8}
            placeholder="Enter article titles, one per line..."
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:border-cyan-500 resize-none shadow-inner"
          />
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || topicCount === 0}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Wand2 className="w-4 h-4" />
          <span>
            {isGenerating
              ? 'Scaffolding & Publishing Posts...'
              : `Generate & Publish ${topicCount} Articles Now`}
          </span>
        </button>
      </div>
    </div>
  );
}
