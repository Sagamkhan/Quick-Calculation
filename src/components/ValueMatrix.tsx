/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  MessageSquare,
  Paintbrush,
  TrendingUp,
  BarChart3,
  Share2,
  ShieldAlert,
  Check,
  Bookmark,
  Star,
  ArrowUpRight,
  Info,
  DollarSign,
  Undo2,
  Lock,
  Compass,
  Zap,
  CheckCircle2,
  Plus,
  RefreshCw,
  Search,
  CheckSquare,
  Square
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AlternativeTool {
  id: string;
  name: string;
  paidEquivalent: string;
  paidCostINR: number;
  freeAlternative: string;
  freeUrl: string;
  description: string;
  rating: number;
  isPopular?: boolean;
}

interface CategoryGroup {
  id: string;
  title: string;
  emoji: string;
  bgColor: string;
  textColor: string;
  badgeBg: string;
  icon: React.ReactNode;
  items: AlternativeTool[];
}

export default function ValueMatrix() {
  // Search query to filter inside the directory
  const [searchQuery, setSearchQuery] = useState("");

  // Track checked tools for the customized savings calculator
  const [selectedTools, setSelectedTools] = useState<Record<string, boolean>>({
    "chatgpt": true,
    "notion": true,
    "photoshop": true,
    "canva": true,
    "semrush": true,
    "hotjar": true,
    "hootsuite": true,
    "calendly": true,
    "copilot": true,
  });

  // Toggle single tool in simulator
  const toggleTool = (id: string) => {
    setSelectedTools((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Toggle entire category
  const toggleCategory = (categoryItems: AlternativeTool[], forceState?: boolean) => {
    setSelectedTools((prev) => {
      const next = { ...prev };
      const anyUnchecked = categoryItems.some(item => !prev[item.id]);
      const targetState = forceState !== undefined ? forceState : anyUnchecked;
      
      categoryItems.forEach(item => {
        next[item.id] = targetState;
      });
      return next;
    });
  };

  // Select all / Deselect all
  const selectAll = (state: boolean) => {
    const next: Record<string, boolean> = {};
    categoriesData.forEach(cat => {
      cat.items.forEach(item => {
        next[item.id] = state;
      });
    });
    setSelectedTools(next);
  };

  // Hardcoded rich catalog of 30 tools matching standard premium SaaS
  const categoriesData: CategoryGroup[] = [
    {
      id: "ai",
      title: "AI CHAT & WRITING",
      emoji: "🤖",
      bgColor: "bg-emerald-600 dark:bg-emerald-700",
      textColor: "text-emerald-600 dark:text-emerald-400",
      badgeBg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
      icon: <MessageSquare className="h-4.5 w-4.5 text-white" />,
      items: [
        {
          id: "chatgpt",
          name: "ChatGPT Plus",
          paidEquivalent: "ChatGPT Plus",
          paidCostINR: 1700,
          freeAlternative: "Gemini Free / Claude",
          freeUrl: "https://gemini.google.com",
          description: "Official state-of-the-art conversational intelligence models.",
          rating: 4.8,
          isPopular: true
        },
        {
          id: "notion",
          name: "Notion AI",
          paidEquivalent: "Notion AI",
          paidCostINR: 850,
          freeAlternative: "Obsidian / Logseq",
          freeUrl: "https://obsidian.md",
          description: "Privacy-first, offline-capable Markdown personal wiki database.",
          rating: 4.7
        },
        {
          id: "copyai",
          name: "Copy.ai Premium",
          paidEquivalent: "Copy.ai Pro",
          paidCostINR: 3000,
          freeAlternative: "Rytr Free Tier",
          freeUrl: "https://rytr.me",
          description: "Intuitive drag-and-drop marketing copy assistant with monthly credits.",
          rating: 4.6
        },
        {
          id: "grammarly",
          name: "Grammarly Premium",
          paidEquivalent: "Grammarly Premium",
          paidCostINR: 2500,
          freeAlternative: "LanguageTool",
          freeUrl: "https://languagetool.org",
          description: "Open-source multilingual grammatical spell & style analyzer.",
          rating: 4.8,
          isPopular: true
        },
        {
          id: "quillbot",
          name: "QuillBot Premium",
          paidEquivalent: "QuillBot Premium",
          paidCostINR: 1200,
          freeAlternative: "QuillBot Free",
          freeUrl: "https://quillbot.com",
          description: "Smart paragraph rephraser, summaries, and structural modifiers.",
          rating: 4.6
        }
      ]
    },
    {
      id: "design",
      title: "DESIGN & CREATIVE",
      emoji: "🎨",
      bgColor: "bg-rose-500 dark:bg-rose-600",
      textColor: "text-rose-500 dark:text-rose-400",
      badgeBg: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
      icon: <Paintbrush className="h-4.5 w-4.5 text-white" />,
      items: [
        {
          id: "photoshop",
          name: "Adobe Photoshop",
          paidEquivalent: "Adobe Photoshop",
          paidCostINR: 1950,
          freeAlternative: "Photopea",
          freeUrl: "https://www.photopea.com",
          description: "Powerful layer editor directly inside browser. Supports PSD format.",
          rating: 4.9,
          isPopular: true
        },
        {
          id: "illustrator",
          name: "Adobe Illustrator",
          paidEquivalent: "Adobe Illustrator",
          paidCostINR: 1950,
          freeAlternative: "Inkscape",
          freeUrl: "https://inkscape.org",
          description: "Professional open-source vector graphics editor supporting SVG.",
          rating: 4.6
        },
        {
          id: "canva",
          name: "Canva Pro",
          paidEquivalent: "Canva Pro",
          paidCostINR: 1100,
          freeAlternative: "Canva Free Tier",
          freeUrl: "https://www.canva.com",
          description: "Over 250,000 free templates, background items, and stock images.",
          rating: 4.8,
          isPopular: true
        },
        {
          id: "figma",
          name: "Figma Professional",
          paidEquivalent: "Figma Pro",
          paidCostINR: 1300,
          freeAlternative: "Penpot",
          freeUrl: "https://penpot.app",
          description: "Open-source collaborative browser UI/UX vector design workspace.",
          rating: 4.7
        },
        {
          id: "premiere",
          name: "Premiere Pro",
          paidEquivalent: "Premiere Pro",
          paidCostINR: 1950,
          freeAlternative: "CapCut / DaVinci",
          freeUrl: "https://www.capcut.com",
          description: "Professional multi-track timeline video editor & cinematic effects.",
          rating: 4.8
        }
      ]
    },
    {
      id: "marketing",
      title: "MARKETING & SEO",
      emoji: "📈",
      bgColor: "bg-blue-600 dark:bg-blue-700",
      textColor: "text-blue-600 dark:text-blue-400",
      badgeBg: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
      icon: <TrendingUp className="h-4.5 w-4.5 text-white" />,
      items: [
        {
          id: "semrush",
          name: "SEMrush Core",
          paidEquivalent: "SEMrush Core",
          paidCostINR: 11000,
          freeAlternative: "Google Search Console",
          freeUrl: "https://search.google.com/search-console",
          description: "Inspect active search impressions & keyword positions straight from Google.",
          rating: 4.9,
          isPopular: true
        },
        {
          id: "ahrefs",
          name: "Ahrefs Standard",
          paidEquivalent: "Ahrefs Plan",
          paidCostINR: 17000,
          freeAlternative: "Ahrefs Webmaster Tools",
          freeUrl: "https://ahrefs.com/webmaster-tools",
          description: "Comprehensive backlink monitors, indexing checkups, and site audits.",
          rating: 4.8
        },
        {
          id: "mailchimp",
          name: "Mailchimp Essentials",
          paidEquivalent: "Mailchimp Plan",
          paidCostINR: 2200,
          freeAlternative: "Brevo / MailerLite",
          freeUrl: "https://www.brevo.com",
          description: "Professional automated email campaigns. Free up to 9,000 monthly sends.",
          rating: 4.7
        },
        {
          id: "buzzsumo",
          name: "BuzzSumo Pro",
          paidEquivalent: "BuzzSumo Plan",
          paidCostINR: 16000,
          freeAlternative: "Google Trends",
          freeUrl: "https://trends.google.com",
          description: "Analyze world viral content interest, related tags, and trend timelines.",
          rating: 4.5
        },
        {
          id: "screamingfrog",
          name: "Screaming Frog",
          paidEquivalent: "Screaming Frog Pro",
          paidCostINR: 1100, // Monthly equivalent
          freeAlternative: "SEO Spider (Free)",
          freeUrl: "https://www.screamingfrog.co.uk",
          description: "Crawl up to 500 URLs completely free to locate broken links & tags.",
          rating: 4.7
        }
      ]
    },
    {
      id: "analytics",
      title: "ANALYTICS & DATA",
      emoji: "📊",
      bgColor: "bg-indigo-600 dark:bg-indigo-700",
      textColor: "text-indigo-600 dark:text-indigo-400",
      badgeBg: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300",
      icon: <BarChart3 className="h-4.5 w-4.5 text-white" />,
      items: [
        {
          id: "hotjar",
          name: "Hotjar Premium",
          paidEquivalent: "Hotjar Plus",
          paidCostINR: 3300,
          freeAlternative: "Microsoft Clarity",
          freeUrl: "https://clarity.microsoft.com",
          description: "100% free forever. No recording cap, click heatmaps, and session replays.",
          rating: 4.9,
          isPopular: true
        },
        {
          id: "tableau",
          name: "Tableau Creator",
          paidEquivalent: "Tableau Plan",
          paidCostINR: 6000,
          freeAlternative: "Google Looker Studio",
          freeUrl: "https://lookerstudio.google.com",
          description: "Dynamic reporting dashboards. Seamlessly links to Sheets, SQL & GA4.",
          rating: 4.7
        },
        {
          id: "mixpanel",
          name: "Mixpanel Growth",
          paidEquivalent: "Mixpanel Plan",
          paidCostINR: 2100,
          freeAlternative: "Umami Analytics",
          freeUrl: "https://umami.is",
          description: "GDPR-compliant self-hosted lightweight visitor behavior tracker.",
          rating: 4.6
        },
        {
          id: "salesforce",
          name: "Salesforce CRM",
          paidEquivalent: "Salesforce Pro",
          paidCostINR: 6500,
          freeAlternative: "HubSpot CRM Free",
          freeUrl: "https://www.hubspot.com/products/crm",
          description: "Store unlimited company contacts, tracks active deals and tasks free.",
          rating: 4.8
        },
        {
          id: "zapier",
          name: "Zapier Premium",
          paidEquivalent: "Zapier Pro",
          paidCostINR: 2500,
          freeAlternative: "Make.com / n8n",
          freeUrl: "https://www.make.com",
          description: "Visual automated webhook connector. 1,000 monthly tasks for free.",
          rating: 4.7,
          isPopular: true
        }
      ]
    },
    {
      id: "social",
      title: "SOCIAL & WORKFLOW",
      emoji: "📢",
      bgColor: "bg-amber-500 dark:bg-amber-600",
      textColor: "text-amber-600 dark:text-amber-400",
      badgeBg: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
      icon: <Share2 className="h-4.5 w-4.5 text-white" />,
      items: [
        {
          id: "hootsuite",
          name: "Hootsuite Pro",
          paidEquivalent: "Hootsuite Plan",
          paidCostINR: 8400,
          freeAlternative: "Buffer Free Tier",
          freeUrl: "https://buffer.com",
          description: "Directly pre-publish and queue up to 10 automated social media posts.",
          rating: 4.6
        },
        {
          id: "calendly",
          name: "Calendly Premium",
          paidEquivalent: "Calendly Pro",
          paidCostINR: 1000,
          freeAlternative: "Cal.com",
          freeUrl: "https://cal.com",
          description: "Open-source calendar booking pipeline with unlimited schedules and webhooks.",
          rating: 4.9,
          isPopular: true
        },
        {
          id: "loom",
          name: "Loom Business",
          paidEquivalent: "Loom Pro",
          paidCostINR: 1100,
          freeAlternative: "Tella.tv / OBS",
          freeUrl: "https://www.tella.tv",
          description: "Record screen & camera instantly with shareable links and free storage.",
          rating: 4.7
        },
        {
          id: "linktree",
          name: "Linktree Pro",
          paidEquivalent: "Linktree Pro",
          paidCostINR: 750,
          freeAlternative: "Bio.link",
          freeUrl: "https://bio.link",
          description: "High-speed personal link dashboard, customize icons, themes & metrics.",
          rating: 4.8
        },
        {
          id: "typeform",
          name: "Typeform Pro",
          paidEquivalent: "Typeform Pro",
          paidCostINR: 2100,
          freeAlternative: "Tally.so",
          freeUrl: "https://tally.so",
          description: "Highly interactive clean form builder with unlimited questions and fields.",
          rating: 4.9,
          isPopular: true
        }
      ]
    },
    {
      id: "business",
      title: "BUSINESS & TECH",
      emoji: "💼",
      bgColor: "bg-red-500 dark:bg-red-600",
      textColor: "text-red-600 dark:text-red-400",
      badgeBg: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
      icon: <ShieldAlert className="h-4.5 w-4.5 text-white" />,
      items: [
        {
          id: "copilot",
          name: "GitHub Copilot",
          paidEquivalent: "GitHub Copilot",
          paidCostINR: 850,
          freeAlternative: "Codeium",
          freeUrl: "https://codeium.com",
          description: "Remarkably fast free AI coding autocomplete and built-in contextual chat.",
          rating: 4.9,
          isPopular: true
        },
        {
          id: "onepassword",
          name: "1Password Premium",
          paidEquivalent: "1Password Plan",
          paidCostINR: 250,
          freeAlternative: "Bitwarden",
          freeUrl: "https://bitwarden.com",
          description: "Open-source audited credentials manager synced across all devices.",
          rating: 4.9,
          isPopular: true
        },
        {
          id: "slack",
          name: "Slack Pro",
          paidEquivalent: "Slack Pro",
          paidCostINR: 600,
          freeAlternative: "Discord / Zulip",
          freeUrl: "https://discord.com",
          description: "Rich channels, voice communications, and custom automated webhooks.",
          rating: 4.7
        },
        {
          id: "zoom",
          name: "Zoom Pro",
          paidEquivalent: "Zoom Pro",
          paidCostINR: 1300,
          freeAlternative: "Google Meet",
          freeUrl: "https://meet.google.com",
          description: "High-definition browser meetings with screen sharing, scheduling & chats.",
          rating: 4.6
        },
        {
          id: "jira",
          name: "Jira Premium",
          paidEquivalent: "Jira Premium",
          paidCostINR: 1300,
          freeAlternative: "Trello / Linear Free",
          freeUrl: "https://trello.com",
          description: "Collaborative Kanban boards, deadlines, checklists & simple sprint structures.",
          rating: 4.7
        }
      ]
    }
  ];

  // Flat array of all tools
  const allTools = useMemo(() => {
    return categoriesData.flatMap(cat => cat.items.map(item => ({ ...item, categoryId: cat.id })));
  }, [categoriesData]);

  // Search filter implementation
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categoriesData;
    const query = searchQuery.toLowerCase();
    
    return categoriesData.map(category => {
      const matchedItems = category.items.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.freeAlternative.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
      
      return {
        ...category,
        items: matchedItems
      };
    }).filter(category => category.items.length > 0);
  }, [searchQuery, categoriesData]);

  // Compute live savings totals
  const totals = useMemo(() => {
    let count = 0;
    let monthlySavings = 0;
    
    allTools.forEach(tool => {
      if (selectedTools[tool.id]) {
        count++;
        monthlySavings += tool.paidCostINR;
      }
    });

    const annualSavings = monthlySavings * 12;

    return {
      count,
      monthlySavings,
      annualSavings
    };
  }, [selectedTools, allTools]);

  return (
    <section id="comparison" className="border-t border-gray-100 bg-gray-50/50 py-24 transition-colors duration-300 dark:border-gray-900/60 dark:bg-gray-950/60 relative overflow-hidden">
      
      {/* Visual Ambient Background Decals */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[250px] h-[250px] bg-emerald-500/5 blur-[90px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        
        {/* SECTION HEADER MATCHING PIN INFOGRAPHIC TITLE */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-sans text-xs font-bold uppercase tracking-wider animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Premium SaaS Replaced with 100% Free Alternatives</span>
          </div>

          <div className="space-y-1">
            <h1 className="font-display text-5xl sm:text-6xl font-black tracking-tight text-gray-900 dark:text-white flex flex-col sm:flex-row items-center justify-center gap-x-3 gap-y-1 leading-none">
              <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-100/60 dark:bg-indigo-950/50 px-4 py-1.5 rounded-2xl border border-indigo-200/50 dark:border-indigo-900/30 font-mono">30 FREE</span>
              <span>SaaS Alternatives</span>
            </h1>
            <h2 className="font-sans text-lg sm:text-xl font-bold text-gray-700 dark:text-gray-300 tracking-wide uppercase pt-2">
              Categorized By Use Case
            </h2>
          </div>

          <p className="font-sans text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-2xl mx-auto italic">
            "Save Time. Work Smarter. Achieve More. No trial locks, no hidden cards."
          </p>

          {/* Quick Real-Time Search Filter */}
          <div className="relative max-w-md mx-auto pt-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 mt-4">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search tools, paid analogs, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full h-10 rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100 pl-10 pr-4 font-sans text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 mt-2 font-sans text-[10px] font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* COMPREHENSIVE DIRECTORY INFOGRAPHIC GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((category) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={category.id}
                className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 shadow-lg shadow-gray-100/40 dark:shadow-none flex flex-col overflow-hidden group transition-all"
                id={`cat-${category.id}`}
              >
                {/* Vibrant Infographic Style Category Header */}
                <div className={`${category.bgColor} px-5 py-4 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <span className="p-1.5 rounded-lg bg-white/10 text-white shrink-0">
                      {category.icon}
                    </span>
                    <h3 className="font-display text-sm sm:text-base font-black text-white tracking-wider uppercase">
                      {category.title}
                    </h3>
                  </div>
                  
                  {/* Category Action Toggler */}
                  <button
                    onClick={() => toggleCategory(category.items)}
                    className="font-sans text-[10px] font-extrabold uppercase tracking-widest text-white/90 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-md transition-all cursor-pointer"
                    title="Toggle entire category for simulation"
                  >
                    {category.items.some(item => !selectedTools[item.id]) ? "Add All" : "Remove All"}
                  </button>
                </div>

                {/* Category Items List Body */}
                <div className="divide-y divide-gray-100 dark:divide-gray-800/80 flex-1 bg-white dark:bg-gray-900">
                  {category.items.map((item, idx) => {
                    const isSelected = selectedTools[item.id];
                    return (
                      <div
                        key={item.id}
                        className={`p-4 flex items-start justify-between gap-3 group/row transition-all ${
                          isSelected
                            ? "bg-indigo-500/[0.01] dark:bg-indigo-500/[0.01]"
                            : "opacity-60 grayscale-[40%] hover:opacity-100 hover:grayscale-0"
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          {/* Numeric Index Tag styled with category colors */}
                          <div className={`h-6 w-6 shrink-0 rounded-md font-mono text-xs font-bold flex items-center justify-center border ${
                            isSelected
                              ? `${category.bgColor} text-white border-transparent`
                              : "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                          }`}>
                            {idx + 1}
                          </div>

                          {/* Alternative Content Details */}
                          <div className="space-y-1 pr-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-sans text-xs font-medium text-gray-400 dark:text-gray-500 line-through">
                                {item.paidEquivalent}
                              </span>
                              <span className="font-mono text-[10px] font-bold text-red-500 dark:text-red-400">
                                (₹{item.paidCostINR.toLocaleString('en-IN')}/mo)
                              </span>
                              {item.isPopular && (
                                <span className="inline-flex h-4 items-center rounded bg-indigo-50 dark:bg-indigo-950/50 px-1 text-[8px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border border-indigo-200/40">
                                  🔥 POPULAR
                                </span>
                              )}
                            </div>

                            {/* Prominent Free Replacement */}
                            <div className="flex items-center gap-1">
                              <span className="text-gray-400 dark:text-gray-500 text-[10px]">➜</span>
                              <h4 className="font-display text-sm font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1">
                                <a href={item.freeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-0.5">
                                  {item.freeAlternative}
                                  <ArrowUpRight className="h-3 w-3 inline opacity-0 group-hover/row:opacity-100 transition-opacity" />
                                </a>
                              </h4>
                            </div>

                            {/* Short Helper Sourcing description */}
                            <p className="font-sans text-[11px] text-gray-500 dark:text-gray-400 leading-normal line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Simulator Action Checkbox */}
                        <div className="pt-0.5 shrink-0">
                          <button
                            onClick={() => toggleTool(item.id)}
                            className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                            title={isSelected ? "Uncheck to remove savings" : "Check to add to savings"}
                          >
                            {isSelected ? (
                              <CheckSquare className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            ) : (
                              <Square className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  
                  {category.items.length === 0 && (
                    <div className="p-8 text-center">
                      <p className="font-sans text-xs text-gray-400 dark:text-gray-500">
                        No replacements match your filter criteria in this category.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* INTERACTIVE CALCULATED SAVINGS SIMULATOR DASHBOARD */}
        <div className="rounded-3xl border border-indigo-200/60 dark:border-indigo-950/80 bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/20 dark:from-indigo-950/10 dark:via-gray-900/40 dark:to-purple-950/10 p-6 sm:p-8 shadow-xl shadow-indigo-100/20 dark:shadow-none mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Dashboard Headers */}
            <div className="lg:col-span-6 space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 px-3 py-1 text-xs font-bold text-indigo-800 dark:text-indigo-300 border border-indigo-200/30">
                <Zap className="h-3.5 w-3.5 fill-indigo-500 stroke-indigo-500" />
                <span>REAL-TIME SUBSCRIPTION SAVINGS PLANNED</span>
              </div>
              <h3 className="font-display text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Your Customized Value Sourced
              </h3>
              <p className="font-sans text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Check or uncheck individual SaaS items in the grids above to map your current corporate stack. See how much budget switching to free replacements liberates instantly.
              </p>

              {/* Reset/Action Controls */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => selectAll(true)}
                  className="font-sans text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Select All 30 Tools
                </button>
                <span className="text-gray-300 dark:text-gray-700">|</span>
                <button
                  onClick={() => selectAll(false)}
                  className="font-sans text-xs font-bold text-gray-500 dark:text-gray-400 hover:underline cursor-pointer"
                >
                  Deselect All
                </button>
              </div>
            </div>

            {/* Simulated Value Outputs Grid */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Box 1: Monthly Sourced Savings */}
              <div className="rounded-2xl border border-gray-150 dark:border-gray-800 bg-white dark:bg-gray-900/80 p-5 space-y-1.5 shadow-xs relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-bl-full pointer-events-none" />
                <p className="font-display text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Monthly Subscription Value Sourced
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-3xl font-black text-indigo-600 dark:text-indigo-400">
                    ₹{totals.monthlySavings.toLocaleString('en-IN')}
                  </span>
                  <span className="font-sans text-xs text-gray-400 font-semibold">/month</span>
                </div>
                <p className="font-sans text-[10px] text-gray-400 dark:text-gray-500">
                  Replacing <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{totals.count} expensive SaaS licences</strong>
                </p>
              </div>

              {/* Box 2: Annual Cumulative Value Sourced */}
              <div className="rounded-2xl border border-emerald-100 dark:border-emerald-950/40 bg-emerald-500/[0.01] p-5 space-y-1.5 shadow-xs relative overflow-hidden group">
                <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none" />
                <p className="font-display text-[10px] font-black uppercase tracking-wider text-emerald-600/80 dark:text-emerald-500">
                  Annual Cumulative Savings
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-3xl font-black text-emerald-600 dark:text-emerald-400">
                    ₹{totals.annualSavings.toLocaleString('en-IN')}
                  </span>
                  <span className="font-sans text-xs text-emerald-600/70 font-semibold">/year</span>
                </div>
                <div className="mt-1 flex items-center gap-1 font-sans text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md w-fit">
                  <Star className="h-3 w-3 fill-emerald-500 stroke-emerald-500" />
                  <span>100% Value Redeemed</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* BEAUITFUL POSTER SAVINGS CARD ("SAVE THIS BOARD FOR LATER!") */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-6 sm:p-8 bg-white dark:bg-gray-900/40 text-center space-y-6 relative overflow-hidden">
          
          {/* Decals resembling infographic pins */}
          <div className="absolute -top-1 -left-1 overflow-hidden h-14 w-14">
            <div className="h-2 w-14 bg-red-500 -rotate-45 translate-y-3 -translate-x-3 text-[7px] font-bold text-white flex items-center justify-center tracking-widest uppercase">
              PIN
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <Bookmark className="h-10 w-10 text-indigo-600 dark:text-indigo-400 fill-indigo-600/10 shrink-0" />
              <div className="text-left">
                <h4 className="font-display text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  SAVE THIS BOARD FOR LATER!
                </h4>
                <p className="font-sans text-xs text-gray-500 dark:text-gray-400">
                  Bookmark this directory for instant reference. 30 professional grade options.
                </p>
              </div>
            </div>

            <div className="h-px sm:h-12 w-full sm:w-px bg-gray-200 dark:bg-gray-800" />

            <div className="text-left space-y-0.5">
              <p className="font-sans text-[11px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                💡 1000+ SYSTEM POSSIBILITIES
              </p>
              <p className="font-sans text-xs font-semibold text-gray-800 dark:text-gray-200">
                Switching unlocks custom tech autonomy completely free.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-150 dark:border-gray-800 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <p className="font-bold text-gray-600 dark:text-gray-400 tracking-wide uppercase text-[10px]">
                ★ FOLLOW TOOLHUB INDIA FOR MORE PREMIUM DEALS & OPEN-SOURCE DISCOVERIES ★
              </p>
            </div>
            
            <p className="font-mono text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-md">
              SMARTER WORK. FASTER RESULTS. ALL FOR FREE!
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
