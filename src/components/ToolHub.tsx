import React, { useState, useMemo } from "react";
import { Search, Grid, Star, Tag, Compass, Landmark, RefreshCw, AlertCircle, Sparkles, ChevronDown, Palette, Image, Hash, Activity, Globe, Calculator, Share2, Check, MessageSquare, X, ArrowLeftRight, Trash2, Plus } from "lucide-react";
import { TOOLS_DATA, CATEGORIES, Tool } from "../data/tools";
import { motion, AnimatePresence } from "motion/react";

interface ToolHubProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  forceCategory?: string;
  isStandalone?: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

// Generate deterministic mock reviews based on tool name/description
const getDeterministicMockReviews = (tool: Tool): Review[] => {
  const reviews: Review[] = [];
  const num = parseInt(tool.id.replace("id-", ""), 10) || 5;
  
  // Author 1
  const authors1 = ["Sarah K.", "David M.", "Elena R.", "Alex T.", "Marcus L.", "Chloe P.", "Niko S.", "Jessica H."];
  const comments1 = [
    `Absolute lifesaver! Completely replaced my paid subscription for this exact tool.`,
    `Extremely fast and intuitive interface. Highly recommend trying this free version.`,
    `A solid alternative. It has 95% of the features I was paying $15/month for.`,
    `Excellent tool for my daily workflow. Clean UI and no hidden costs.`,
    `Very smooth. It actually performs faster than the mainstream paid option!`,
    `Incredible value. Love that it's open-source/completely free.`,
  ];
  
  // Author 2
  const authors2 = ["John D.", "Sophia W.", "Michael B.", "Amara O.", "Takahiro N.", "Li Wei", "Emma G.", "Robert C."];
  const comments2 = [
    `Great product. Minor learning curve compared to the commercial version, but totally worth it.`,
    `Saved our startup hundreds of dollars. Highly polished and reliable.`,
    `Does exactly what it says on the tin. No ads, just great functionality.`,
    `Very satisfied. Clean code and runs perfectly in the browser.`,
    `Been using this for 3 months now, zero complaints. An amazing find!`,
    `Outstanding UX. This should be way more popular than it is.`,
  ];

  const rating1 = Math.floor(tool.rating); // e.g. 4
  const rating2 = Math.min(5, Math.ceil(tool.rating)); // e.g. 5

  reviews.push({
    id: `mock-${tool.id}-1`,
    author: authors1[num % authors1.length],
    rating: rating1,
    comment: comments1[num % comments1.length],
    date: `2026-06-${10 + (num % 20)}`,
  });

  reviews.push({
    id: `mock-${tool.id}-2`,
    author: authors2[num % authors2.length],
    rating: rating2,
    comment: comments2[num % comments2.length],
    date: `2026-07-${1 + (num % 10)}`,
  });

  return reviews;
};

// Deterministic saves count based on tool ID for usage statistics
const getSavesCount = (toolId: string) => {
  const num = parseInt(toolId.replace("id-", ""), 10) || 5;
  return ((num * 73) % 750) + 200; // between 200 and 950
};

export default function ToolHub({ 
  searchQuery = "", 
  setSearchQuery = () => {}, 
  forceCategory,
  isStandalone = false
}: ToolHubProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Sync selected category to forceCategory if provided
  React.useEffect(() => {
    if (forceCategory) {
      setSelectedCategory(forceCategory);
    }
  }, [forceCategory]);
  const [displayCount, setDisplayCount] = useState<number>(20);
  const [sortBy, setSortBy] = useState<"popular" | "alphabetical" | "newest">("popular");
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const [favoriteTools, setFavoriteTools] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("favoriteTools");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [compareToolIds, setCompareToolIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("compareToolIds");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const toggleCompare = (id: string) => {
    setCompareToolIds((prev) => {
      let updated: string[];
      if (prev.includes(id)) {
        updated = prev.filter((toolId) => toolId !== id);
      } else {
        if (prev.length >= 3) {
          alert("You can select up to 3 tools for comparison. Please remove one first.");
          return prev;
        }
        updated = [...prev, id];
      }
      try {
        localStorage.setItem("compareToolIds", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save compareToolIds to localStorage", err);
      }
      return updated;
    });
  };

  const sortOptions = [
    { id: "popular", label: "Most Popular", desc: "Highest rated tools first" },
    { id: "alphabetical", label: "Alphabetical", desc: "A to Z by tool name" },
    { id: "newest", label: "Newest Added", desc: "Recently added tools first" },
  ] as const;

  // Toggle tool favorites
  const toggleFavorite = (id: string) => {
    setFavoriteTools((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((favId) => favId !== id)
        : [...prev, id];
      try {
        localStorage.setItem("favoriteTools", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save favorites to localStorage", err);
      }
      return updated;
    });
  };

  const [copiedToolId, setCopiedToolId] = useState<string | null>(null);

  // Load and store community reviews in localStorage
  const [allReviews, setAllReviews] = useState<Record<string, Review[]>>(() => {
    try {
      const stored = localStorage.getItem("tool_community_reviews");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [activeReviewTool, setActiveReviewTool] = useState<Tool | null>(null);

  // Helper to fetch merged reviews for a tool
  const getToolReviews = (tool: Tool): Review[] => {
    const mocks = getDeterministicMockReviews(tool);
    const stored = allReviews[tool.id] || [];
    return [...stored, ...mocks];
  };

  // Helper to calculate the dynamically updated average rating
  const getToolRating = (tool: Tool): number => {
    const reviews = getToolReviews(tool);
    if (reviews.length === 0) return tool.rating;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  };

  // Share tool or copy link fallback
  const handleShare = async (tool: Tool) => {
    const shareData = {
      title: `${tool.name} - Free SaaS Alternative`,
      text: `Discover ${tool.name}, an excellent 100% free alternative to ${tool.freeAlternativeTo}!`,
      url: tool.url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          await copyToClipboard(tool.url, tool.id);
        }
      }
    } else {
      await copyToClipboard(tool.url, tool.id);
    }
  };

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedToolId(id);
      setTimeout(() => setCopiedToolId(null), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleSubmitReview = (toolId: string, rating: number, author: string, comment: string) => {
    const newReview: Review = {
      id: `user-${toolId}-${Date.now()}`,
      author: author.trim() || "Anonymous Builder",
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split("T")[0],
    };

    setAllReviews((prev) => {
      const toolReviews = prev[toolId] || [];
      const updated = {
        ...prev,
        [toolId]: [newReview, ...toolReviews],
      };
      try {
        localStorage.setItem("tool_community_reviews", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save review to localStorage:", err);
      }
      return updated;
    });
  };

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 
      all: TOOLS_DATA.length,
      favorites: favoriteTools.length
    };
    TOOLS_DATA.forEach((tool) => {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
    });
    return counts;
  }, [favoriteTools]);

  // Filter and sort tools based on query, category, and sortBy option
  const filteredTools = useMemo(() => {
    setDisplayCount(20); // Reset load count on filter change
    const filtered = TOOLS_DATA.filter((tool) => {
      let matchesCategory = false;
      if (selectedCategory === "all") {
        matchesCategory = true;
      } else if (selectedCategory === "favorites") {
        matchesCategory = favoriteTools.includes(tool.id);
      } else {
        matchesCategory = tool.category === selectedCategory;
      }
      
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesSearch =
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.freeAlternativeTo.toLowerCase().includes(query) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "newest") {
        const numA = parseInt(a.id.replace("id-", ""), 10) || 0;
        const numB = parseInt(b.id.replace("id-", ""), 10) || 0;
        return numB - numA;
      }
      // default: popular (rating descending). If ratings are equal, sort alphabetically.
      const ratingA = getToolRating(a);
      const ratingB = getToolRating(b);
      if (ratingB !== ratingA) {
        return ratingB - ratingA;
      }
      return a.name.localeCompare(b.name);
    });
  }, [searchQuery, selectedCategory, favoriteTools, sortBy, allReviews]);

  // Paginated/Loaded subset
  const visibleTools = useMemo(() => {
    return filteredTools.slice(0, displayCount);
  }, [filteredTools, displayCount]);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 20);
  };

  return (
    <section id="tool-hub" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-100 dark:border-gray-900 bg-gray-50/20 dark:bg-gray-950/20 transition-all">
      
      {/* Title section */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10">
        <div className="max-w-2xl space-y-2">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Saga's 250+ Tools Library
          </h2>
          <p className="font-sans text-sm text-gray-500 dark:text-gray-400">
            A comprehensive, high-performance database indexing free alternatives to expensive design, marketing, content, speed, and analytical platforms.
          </p>
        </div>
        
        {/* Counter pill */}
        <div className="mt-4 md:mt-0 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 self-start">
          <Compass className="h-4 w-4" />
          <span>{filteredTools.length} Tools Matching</span>
        </div>
      </div>

      {/* Grid Filter Category blocks */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-10 mb-8">
        
        {/* All categories block card */}
        <button
          onClick={() => setSelectedCategory("all")}
          className={`flex flex-col justify-between p-3.5 text-left border rounded-xl transition-all cursor-pointer ${
            selectedCategory === "all"
              ? "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
              : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
          }`}
        >
          <span className="font-display text-xs font-bold uppercase tracking-wider">All Tools</span>
          <span className={`font-mono text-xs font-bold mt-2 ${selectedCategory === "all" ? "text-indigo-100" : "text-gray-400"}`}>
            {categoryCounts.all} Items
          </span>
        </button>

        {/* Saved/Favorites block card */}
        <button
          onClick={() => setSelectedCategory("favorites")}
          className={`flex flex-col justify-between p-3.5 text-left border rounded-xl transition-all cursor-pointer ${
            selectedCategory === "favorites"
              ? "border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-500/10"
              : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
          }`}
        >
          <span className="font-display text-xs font-bold uppercase tracking-wider flex items-center gap-1">
            <Star className={`h-3.5 w-3.5 ${selectedCategory === "favorites" ? "fill-white text-white" : "fill-amber-400 text-amber-500 stroke-amber-500"}`} />
            <span>Saved</span>
          </span>
          <span className={`font-mono text-xs font-bold mt-2 ${selectedCategory === "favorites" ? "text-amber-100" : "text-amber-600 dark:text-amber-400"}`}>
            {categoryCounts.favorites} Items
          </span>
        </button>

        {/* Dynamic Category Blocks */}
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex flex-col justify-between p-3.5 text-left border rounded-xl transition-all cursor-pointer ${
                isSelected
                  ? "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-600/10"
                  : `border-gray-200 bg-white hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700`
              }`}
            >
              <span className={`font-display text-[10px] font-bold uppercase tracking-wider ${
                isSelected ? "text-white" : "text-gray-700 dark:text-gray-300"
              }`}>
                {cat.name.split(" ")[0]}
              </span>
              <span className={`font-mono text-xs font-bold mt-2 ${isSelected ? "text-indigo-100" : "text-gray-400"}`}>
                {categoryCounts[cat.id] || 0} Items
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Sort Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto mb-10">
        {/* Real-time Search input */}
        <div className="relative flex-1 w-full shadow-md rounded-xl">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Filter 250+ tools dynamically by keyword, tags, or replaced platform..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-12 pr-10 font-sans text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-indigo-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-1/2 right-4 -translate-y-1/2 font-sans text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="relative w-full md:w-64 shrink-0 shadow-md rounded-xl">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            onBlur={() => setTimeout(() => setIsSortOpen(false), 200)}
            className="h-12 w-full flex items-center justify-between px-4 rounded-xl border border-gray-200 bg-white font-sans text-sm font-semibold text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700 transition-all focus:border-indigo-500 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-400 dark:text-gray-500 font-normal">Sort:</span>
              <span>{sortOptions.find((opt) => opt.id === sortBy)?.label}</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {isSortOpen && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute right-0 z-30 mt-2 w-full rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl dark:border-gray-800 dark:bg-gray-900 overflow-hidden"
              >
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSortBy(option.id);
                      setIsSortOpen(false);
                    }}
                    className={`w-full flex flex-col text-left px-3 py-2 rounded-lg transition-all cursor-pointer ${
                      sortBy === option.id
                        ? "bg-indigo-50 dark:bg-indigo-950/40"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/60"
                    }`}
                  >
                    <span className={`font-sans text-xs font-bold ${
                      sortBy === option.id ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-300"
                    }`}>
                      {option.label}
                    </span>
                    <span className="font-sans text-[10px] text-gray-400 dark:text-gray-500">
                      {option.desc}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Compare entry button */}
        <button
          onClick={() => setIsCompareModalOpen(true)}
          className="h-12 w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 rounded-xl border border-gray-200 bg-white font-sans text-sm font-semibold text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 transition-all cursor-pointer shadow-md shadow-gray-100/30 dark:shadow-none shrink-0"
        >
          <ArrowLeftRight className="h-4 w-4" />
          <span>Compare Matrix</span>
          {compareToolIds.length > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {compareToolIds.length}
            </span>
          )}
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10 px-2 sm:px-0">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-display text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer ${
            selectedCategory === "all"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-[1.03]"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          <Grid className="h-3.5 w-3.5" />
          <span>All Alternative Tools</span>
          <span className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[9px] font-mono font-bold ${
            selectedCategory === "all"
              ? "bg-indigo-500 text-white"
              : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
          }`}>
            {categoryCounts.all}
          </span>
        </button>

        <button
          onClick={() => setSelectedCategory("favorites")}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-display text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer ${
            selectedCategory === "favorites"
              ? "bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-[1.03]"
              : "border border-amber-200 bg-amber-50/40 text-amber-800 hover:bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-300 dark:hover:bg-amber-950/40"
          }`}
        >
          <Star className={`h-3.5 w-3.5 ${selectedCategory === "favorites" ? "fill-white text-white" : "fill-amber-400 stroke-amber-400 text-amber-500"}`} />
          <span>My Saved Favorites</span>
          <span className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[9px] font-mono font-bold ${
            selectedCategory === "favorites"
              ? "bg-amber-600 text-white"
              : "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200"
          }`}>
            {categoryCounts.favorites}
          </span>
        </button>

        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = categoryCounts[cat.id] || 0;
          
          const getIcon = () => {
            switch (cat.id) {
              case "ideas":
                return <Sparkles className="h-3.5 w-3.5" />;
              case "design":
                return <Palette className="h-3.5 w-3.5" />;
              case "graphs":
                return <Grid className="h-3.5 w-3.5" />;
              case "stock":
                return <Image className="h-3.5 w-3.5" />;
              case "social":
                return <Hash className="h-3.5 w-3.5" />;
              case "analytics":
                return <Activity className="h-3.5 w-3.5" />;
              case "seo":
                return <Globe className="h-3.5 w-3.5" />;
              case "calculators":
                return <Calculator className="h-3.5 w-3.5" />;
              default:
                return <Tag className="h-3.5 w-3.5" />;
            }
          };

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-display text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-[1.03]"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              {getIcon()}
              <span>{cat.name}</span>
              <span className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[9px] font-mono font-bold ${
                isSelected
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Masonry / Cards Grid System */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {visibleTools.map((tool, index) => {
            const catInfo = CATEGORIES.find((c) => c.id === tool.category);
            const isFavorite = favoriteTools.includes(tool.id);
            return (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
                className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-gray-100/50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-500/20 dark:hover:shadow-none"
              >
                {/* Favorite star */}
                <button
                  onClick={() => toggleFavorite(tool.id)}
                  className="absolute top-4.5 right-4.5 text-gray-300 hover:text-amber-400 transition-colors dark:text-gray-700"
                  aria-label="Add to Favorites"
                >
                  <Star className={`h-4.5 w-4.5 ${isFavorite ? "fill-amber-400 stroke-amber-400" : ""}`} />
                </button>

                {/* Compare toggle */}
                <button
                  onClick={() => toggleCompare(tool.id)}
                  className={`absolute top-4.5 right-11.5 transition-colors cursor-pointer ${
                    compareToolIds.includes(tool.id)
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-300 hover:text-indigo-500 dark:text-gray-700 dark:hover:text-indigo-400"
                  }`}
                  title={compareToolIds.includes(tool.id) ? "Remove from comparison" : "Add to comparison"}
                  aria-label="Compare tool"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </button>

                <div className="space-y-3.5">
                  {/* Category Pill and replace label */}
                  <div className="flex flex-col gap-1.5 items-start">
                    <span className={`inline-block rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      catInfo?.color || "border-gray-200 text-gray-500 bg-gray-50"
                    }`}>
                      {catInfo?.name || tool.category}
                    </span>
                    <p className="font-mono text-[10px] font-bold text-red-400 bg-red-500/5 px-2 py-0.5 rounded-md border border-red-500/10">
                      Replaces: {tool.freeAlternativeTo}
                    </p>
                  </div>

                  {/* Tool name and rating */}
                  <div className="space-y-1">
                    <h3 className="font-display text-base font-bold text-gray-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="font-sans text-xs text-gray-400 leading-relaxed line-clamp-3">
                      {tool.description}
                    </p>
                  </div>

                  {/* Usage Statistics Visualization */}
                  <div className="mt-4 pt-3.5 border-t border-dashed border-gray-100 dark:border-gray-800/60 space-y-2.5">
                    {/* Community Rating Row */}
                    <div>
                      <button
                        onClick={() => setActiveReviewTool(tool)}
                        className="w-full flex items-center justify-between text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer group/rate transition-colors"
                        title="Click to view and submit reviews"
                      >
                        <span className="flex items-center gap-1 group-hover/rate:underline">Community Rating ★</span>
                        <span className="text-gray-700 dark:text-gray-300 font-mono group-hover/rate:text-indigo-600 dark:group-hover/rate:text-indigo-400 underline decoration-dotted">
                          {getToolRating(tool).toFixed(1)} / 5.0 ({getToolReviews(tool).length})
                        </span>
                      </button>
                      <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-500"
                          style={{ width: `${(getToolRating(tool) / 5.0) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Saved count Row */}
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1">
                        <span className="flex items-center gap-1">Community Saves</span>
                        <span className="text-gray-700 dark:text-gray-300 font-mono">{getSavesCount(tool.id)} saves</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-amber-500 dark:bg-amber-400 transition-all duration-500"
                          style={{ width: `${(getSavesCount(tool.id) / 1000) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags and Action footer */}
                <div className="mt-4.5 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                  {/* Tags list */}
                  <div className="flex flex-wrap gap-1 max-w-[110px]">
                    {tool.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="inline-flex items-center text-[10px] text-gray-400 font-sans">
                        #{tag.toLowerCase().replace(" ", "")}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center flex-wrap gap-1.5 sm:gap-2.5 justify-end">
                    {/* Share Button */}
                    <button
                      onClick={() => handleShare(tool)}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900/50 dark:hover:bg-gray-800 px-2 py-1.5 font-sans text-[10px] font-bold text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300 transition-all cursor-pointer"
                      title="Share this tool"
                      aria-label="Share tool"
                    >
                      {copiedToolId === tool.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500 stroke-[3px]" />
                          <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="h-3 w-3" />
                          <span>Share</span>
                        </>
                      )}
                    </button>

                    {/* Reviews Button */}
                    <button
                      onClick={() => setActiveReviewTool(tool)}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-indigo-50/40 dark:bg-indigo-950/10 dark:hover:bg-indigo-950/30 px-2 py-1.5 font-sans text-[10px] font-bold text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300 transition-all cursor-pointer"
                      title="Read and write reviews"
                    >
                      <MessageSquare className="h-3 w-3" />
                      <span>Reviews ({getToolReviews(tool).length})</span>
                    </button>

                    {/* Open Link */}
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-display text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                    >
                      <span>Access Free</span>
                      <span>➜</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredTools.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 dark:bg-gray-950 dark:border-gray-800">
          {selectedCategory === "favorites" ? (
            <>
              <Star className="h-10 w-10 text-amber-400 mx-auto mb-3 fill-amber-400/20" />
              <p className="font-display text-base font-bold text-gray-900 dark:text-white">No saved favorites yet</p>
              <p className="font-sans text-xs text-gray-400 max-w-sm mx-auto mt-1">
                Your favorites list is currently empty. Click the star icon on any free tool card to bookmark it here for instant reference!
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("all");
                }}
                className="mt-4 rounded-xl bg-indigo-600 px-5 py-2 font-sans text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer"
              >
                Browse All Tools
              </button>
            </>
          ) : (
            <>
              <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="font-display text-base font-bold text-gray-900 dark:text-white">No alternative tools found</p>
              <p className="font-sans text-xs text-gray-400 max-w-sm mx-auto mt-1">
                We couldn't find a free alternative matching "{searchQuery}" in our database. Try another search or clear the filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 font-sans text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer"
              >
                Clear Filters
              </button>
            </>
          )}
        </div>
      )}

      {/* Load More Trigger */}
      {filteredTools.length > displayCount && (
        <div className="mt-12 text-center">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-sans text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
          >
            <span>Load More Tools ({filteredTools.length - displayCount} left)</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Reviews Modal Backdrop */}
      <AnimatePresence>
        {activeReviewTool && (
          <ReviewsModal
            tool={activeReviewTool}
            reviews={getToolReviews(activeReviewTool)}
            onClose={() => setActiveReviewTool(null)}
            onSubmitReview={(rating, author, comment) => {
              handleSubmitReview(activeReviewTool.id, rating, author, comment);
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating Compare Tray */}
      <AnimatePresence>
        {compareToolIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-40 w-full max-w-xl px-4"
          >
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-indigo-100 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-indigo-950/50 dark:bg-gray-950/95">
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <ArrowLeftRight className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-display text-xs font-bold text-gray-900 dark:text-white">
                    Compare Tools ({compareToolIds.length}/3)
                  </p>
                  <div className="flex gap-1.5 flex-nowrap">
                    {compareToolIds.map((id) => {
                      const tool = TOOLS_DATA.find((t) => t.id === id);
                      if (!tool) return null;
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 rounded-md bg-gray-50 border border-gray-100 px-1.5 py-0.5 font-sans text-[10px] font-semibold text-gray-600 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300 shrink-0"
                        >
                          <span className="truncate max-w-[80px]">{tool.name}</span>
                          <button
                            onClick={() => toggleCompare(id)}
                            className="text-gray-400 hover:text-red-500 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    setCompareToolIds([]);
                    try {
                      localStorage.removeItem("compareToolIds");
                    } catch {}
                  }}
                  className="font-sans text-[11px] font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer px-2 py-1.5"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsCompareModalOpen(true)}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs font-bold px-3.5 py-2 shadow-md shadow-indigo-600/10 cursor-pointer transition-colors"
                >
                  Compare Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare Tools Modal */}
      <AnimatePresence>
        {isCompareModalOpen && (
          <CompareToolsModal
            selectedIds={compareToolIds}
            onClose={() => setIsCompareModalOpen(false)}
            onRemoveTool={(id) => {
              setCompareToolIds((prev) => {
                const updated = prev.filter((tId) => tId !== id);
                try {
                  localStorage.setItem("compareToolIds", JSON.stringify(updated));
                } catch {}
                return updated;
              });
            }}
            onAddTool={(id) => {
              setCompareToolIds((prev) => {
                if (prev.includes(id)) return prev;
                if (prev.length >= 3) {
                  alert("You can select up to 3 tools for comparison. Please remove one first.");
                  return prev;
                }
                const updated = [...prev, id];
                try {
                  localStorage.setItem("compareToolIds", JSON.stringify(updated));
                } catch {}
                return updated;
              });
            }}
            getToolRating={getToolRating}
            getToolReviews={getToolReviews}
          />
        )}
      </AnimatePresence>

    </section>
  );
}

interface ReviewsModalProps {
  tool: Tool;
  reviews: Review[];
  onClose: () => void;
  onSubmitReview: (rating: number, author: string, comment: string) => void;
}

function ReviewsModal({ tool, reviews, onClose, onSubmitReview }: ReviewsModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [author, setAuthor] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const counts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    const idx = Math.min(4, Math.max(0, Math.floor(r.rating) - 1));
    counts[idx]++;
  });
  
  const avgRating = reviews.length
    ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
    : tool.rating;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!comment.trim()) {
      setError("Please write a short review.");
      return;
    }

    if (comment.trim().length < 5) {
      setError("Review must be at least 5 characters.");
      return;
    }

    onSubmitReview(rating, author.trim() || "Anonymous Builder", comment.trim());
    setSuccess(true);
    setAuthor("");
    setComment("");
    setRating(5);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs cursor-pointer dark:bg-black/70"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl border border-gray-200 bg-white shadow-2xl overflow-hidden dark:border-gray-800 dark:bg-gray-950"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-gray-100 p-6 dark:border-gray-800/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-md border border-indigo-100 bg-indigo-50/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:border-indigo-900/30 dark:bg-indigo-950/20 dark:text-indigo-400">
                Community Feedback
              </span>
              <p className="font-mono text-[9px] font-bold text-red-500 bg-red-500/5 px-2 py-0.5 rounded-md border border-red-500/10">
                Alternative to {tool.freeAlternativeTo}
              </p>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
              {tool.name} Reviews
            </h2>
            <p className="font-sans text-xs text-gray-500 dark:text-gray-400">
              {tool.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border border-gray-100 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:border-gray-800 dark:hover:bg-gray-900 dark:hover:text-gray-300 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content wrapper */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Main Grid: Stats & Write Form */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Stats Breakdown Panel */}
            <div className="md:col-span-5 bg-gray-50 border border-gray-100 rounded-2xl p-4.5 space-y-4 dark:bg-gray-900/30 dark:border-gray-800/60">
              <div className="text-center md:text-left space-y-1">
                <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Overall Rating</p>
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                  <span className="font-display text-4xl font-black text-gray-900 dark:text-white">{avgRating.toFixed(1)}</span>
                  <span className="font-sans text-sm font-semibold text-gray-400 dark:text-gray-500">/ 5.0</span>
                </div>
                
                {/* Gold Stars */}
                <div className="flex justify-center md:justify-start gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const diff = avgRating - star;
                    const isFilled = diff >= 0;
                    return (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          isFilled
                            ? "fill-amber-400 text-amber-400"
                            : diff >= -0.5
                            ? "fill-amber-400/50 text-amber-400"
                            : "text-gray-200 dark:text-gray-800"
                        }`}
                      />
                    );
                  })}
                </div>
                <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mt-1">
                  Based on {reviews.length} community ratings
                </p>
              </div>

              {/* Progress bar list */}
              <div className="space-y-2 pt-3 border-t border-gray-200/50 dark:border-gray-800/50">
                {[5, 4, 3, 2, 1].map((starLevel) => {
                  const count = counts[starLevel - 1];
                  const percentage = Math.round((count / reviews.length) * 100) || 0;
                  return (
                    <div key={starLevel} className="flex items-center gap-3 text-xs">
                      <span className="w-10 font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        {starLevel} <Star className="h-3 w-3 fill-amber-400 text-amber-400 inline animate-none" />
                      </span>
                      <div className="h-2 flex-1 rounded-full bg-gray-100 dark:bg-gray-800/80 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-400 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-8 font-mono text-right text-gray-400 dark:text-gray-500">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Write a Review Form Panel */}
            <div className="md:col-span-7 border border-gray-100 rounded-2xl p-4.5 bg-white dark:bg-gray-900/10 dark:border-gray-800/60 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center h-full py-8 space-y-3"
                  >
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                      <Check className="h-6 w-6 stroke-[2.5]" />
                    </div>
                    <h4 className="font-display text-base font-bold text-gray-900 dark:text-white">Review Submitted!</h4>
                    <p className="font-sans text-xs text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                      Thank you for contributing! Your rating and feedback have been persisted and applied to the matrix.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-3.5"
                  >
                    <div>
                      <h4 className="font-display text-sm font-bold text-gray-900 dark:text-white">Write a Review</h4>
                      <p className="font-sans text-[11px] text-gray-400 dark:text-gray-500">Share your experience to help other builders.</p>
                    </div>

                    {/* Interactive Star Selector */}
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Your Rating</label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isFilled = hoverRating !== null ? star <= hoverRating : star <= rating;
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(null)}
                              className="text-2xl transition-transform hover:scale-115 focus:outline-none cursor-pointer"
                              aria-label={`Rate ${star} stars`}
                            >
                              <Star
                                className={`h-6.5 w-6.5 transition-colors ${
                                  isFilled
                                    ? "fill-amber-400 text-amber-400 stroke-amber-500"
                                    : "text-gray-200 dark:text-gray-800"
                                }`}
                              />
                            </button>
                          );
                        })}
                        <span className="text-xs font-mono font-bold text-amber-500 ml-1">
                          {rating} Star{rating > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Name input */}
                    <div className="space-y-1">
                      <label htmlFor="reviewer-name" className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Your Name / Handle</label>
                      <input
                        id="reviewer-name"
                        type="text"
                        placeholder="e.g. Sarah K. (optional)"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        maxLength={40}
                        className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-gray-50/50 font-sans text-xs outline-none focus:border-indigo-500 focus:bg-white dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-200 dark:focus:border-indigo-400"
                      />
                    </div>

                    {/* Comment Area */}
                    <div className="space-y-1">
                      <label htmlFor="reviewer-comment" className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Short Review</label>
                      <textarea
                        id="reviewer-comment"
                        placeholder="What do you think? e.g. Replaces premium flawlessly, great speed!"
                        value={comment}
                        onChange={(e) => {
                          setComment(e.target.value);
                          if (error) setError("");
                        }}
                        maxLength={250}
                        rows={3}
                        className="w-full p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 font-sans text-xs outline-none focus:border-indigo-500 focus:bg-white resize-none dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-200 dark:focus:border-indigo-400"
                      />
                    </div>

                    {/* Error block */}
                    {error && (
                      <div className="flex items-center gap-1.5 rounded-lg bg-red-50 border border-red-150 p-2 text-red-800 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
                        <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                        <span className="text-[10px] font-semibold">{error}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full h-10 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <span>Submit Community Review</span>
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Feedback Feed Section */}
          <div className="space-y-4 border-t border-gray-100 pt-6 dark:border-gray-800/60">
            <h3 className="font-display text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-indigo-500" />
              <span>Community Reviews Feed ({reviews.length})</span>
            </h3>

            {/* Scrollable list */}
            <div className="max-h-64 overflow-y-auto pr-1.5 space-y-3.5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-gray-50/50 border border-gray-100 p-4 rounded-2xl space-y-2 dark:bg-gray-900/20 dark:border-gray-800/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {rev.author}
                      </span>
                      {/* Gold Star Badges */}
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= rev.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-200 dark:text-gray-800"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500">
                      {rev.date}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface CompareToolsModalProps {
  selectedIds: string[];
  onClose: () => void;
  onRemoveTool: (id: string) => void;
  onAddTool: (id: string) => void;
  getToolRating: (tool: Tool) => number;
  getToolReviews: (tool: Tool) => Review[];
}

function CompareToolsModal({
  selectedIds,
  onClose,
  onRemoveTool,
  onAddTool,
  getToolRating,
  getToolReviews,
}: CompareToolsModalProps) {
  const [searchQueries, setSearchQueries] = useState<string[]>(["", "", ""]);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const slots: (Tool | null)[] = [
    selectedIds[0] ? TOOLS_DATA.find((t) => t.id === selectedIds[0]) || null : null,
    selectedIds[1] ? TOOLS_DATA.find((t) => t.id === selectedIds[1]) || null : null,
    selectedIds[2] ? TOOLS_DATA.find((t) => t.id === selectedIds[2]) || null : null,
  ];

  const getSavingsEstimate = (tool: Tool) => {
    const match = tool.freeAlternativeTo.match(/\$(\d+)/);
    const monthlyCost = match ? parseInt(match[1], 10) : 25;
    const annualSavings = monthlyCost * 12;
    return {
      monthly: monthlyCost,
      annual: annualSavings,
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs cursor-pointer dark:bg-black/70"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl border border-gray-200 bg-white shadow-2xl overflow-hidden dark:border-gray-800 dark:bg-gray-950"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-gray-100 p-6 dark:border-gray-800/80 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-md border border-indigo-150 bg-indigo-50/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:border-indigo-900/30 dark:bg-indigo-950/20 dark:text-indigo-400">
                Technical Compare Engine
              </span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Compare specs, ratings, and cost savings side-by-side</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
              Tool Comparison Matrix
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border border-gray-100 p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600 dark:border-gray-800 dark:hover:bg-gray-900 dark:hover:text-gray-300 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Main Layout */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Slot Selector Headers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {slots.map((slotTool, idx) => {
              const query = searchQueries[idx];
              const isDropdownActive = activeDropdownIndex === idx;

              // Filter candidate tools
              const candidates = query.trim()
                ? TOOLS_DATA.filter(
                    (t) =>
                      !selectedIds.includes(t.id) &&
                      (t.name.toLowerCase().includes(query.toLowerCase()) ||
                        t.freeAlternativeTo.toLowerCase().includes(query.toLowerCase()) ||
                        t.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())))
                  ).slice(0, 5)
                : TOOLS_DATA.filter((t) => !selectedIds.includes(t.id)).slice(0, 5);

              return (
                <div
                  key={idx}
                  className="relative flex flex-col justify-between p-4.5 rounded-2xl border border-gray-100 bg-gray-50/40 dark:border-gray-800/60 dark:bg-gray-900/10 min-h-[140px]"
                >
                  {slotTool ? (
                    <div className="space-y-3 h-full flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
                            Slot {idx + 1}
                          </span>
                          <button
                            onClick={() => onRemoveTool(slotTool.id)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                            title="Remove tool from comparison"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                        <h4 className="font-display text-sm font-extrabold text-gray-900 dark:text-white line-clamp-1">
                          {slotTool.name}
                        </h4>
                        <p className="font-sans text-[11px] text-gray-400 dark:text-gray-500 line-clamp-2">
                          {slotTool.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="inline-block rounded-md border border-red-500/10 bg-red-500/5 px-2 py-0.5 text-[10px] font-mono font-bold text-red-400">
                          Replaces: {slotTool.freeAlternativeTo.split(" ")[0]}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 h-full flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
                          Slot {idx + 1} (Empty)
                        </span>
                        <h4 className="font-display text-sm font-extrabold text-gray-400 dark:text-gray-600">
                          Add a tool to compare
                        </h4>
                      </div>

                      {/* Search selection input */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search 250+ tools..."
                          value={query}
                          onFocus={() => setActiveDropdownIndex(idx)}
                          onChange={(e) => {
                            const newQueries = [...searchQueries];
                            newQueries[idx] = e.target.value;
                            setSearchQueries(newQueries);
                          }}
                          className="w-full h-8 px-3 rounded-lg border border-gray-200 bg-white font-sans text-xs outline-none focus:border-indigo-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        />

                        {/* Search icon */}
                        {query ? (
                          <button
                            onClick={() => {
                              const newQueries = [...searchQueries];
                              newQueries[idx] = "";
                              setSearchQueries(newQueries);
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-sans font-bold cursor-pointer"
                          >
                            Clear
                          </button>
                        ) : null}

                        {/* Search candidates dropdown */}
                        <AnimatePresence>
                          {isDropdownActive && (
                            <>
                              {/* Overlay click catcher to close dropdown */}
                              <div
                                className="fixed inset-0 z-10 cursor-default"
                                onClick={() => setActiveDropdownIndex(null)}
                              />
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute left-0 right-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-950"
                              >
                                {candidates.length === 0 ? (
                                  <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center py-2">
                                    No tools match search
                                  </p>
                                ) : (
                                  candidates.map((cand) => (
                                    <button
                                      key={cand.id}
                                      type="button"
                                      onClick={() => {
                                        onAddTool(cand.id);
                                        const newQueries = [...searchQueries];
                                        newQueries[idx] = "";
                                        setSearchQueries(newQueries);
                                        setActiveDropdownIndex(null);
                                      }}
                                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 flex flex-col gap-0.5 cursor-pointer"
                                    >
                                      <span className="font-sans text-xs font-bold text-gray-900 dark:text-white">
                                        {cand.name}
                                      </span>
                                      <span className="font-sans text-[9px] text-gray-400 dark:text-gray-500 truncate">
                                        Replaces: {cand.freeAlternativeTo}
                                      </span>
                                    </button>
                                  ))
                                )}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Technical Side-by-Side Comparison Table Card */}
          <div className="border border-gray-150 rounded-2xl overflow-hidden bg-white dark:border-gray-800 dark:bg-gray-950/40">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left font-sans text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/60 border-b border-gray-150 dark:border-gray-800">
                    <th className="p-4 font-display font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider w-1/4">
                      Specification / Spec
                    </th>
                    <th className="p-4 font-display font-bold text-gray-800 dark:text-gray-200 w-1/4">
                      {slots[0] ? slots[0].name : "Tool Slot 1 (Empty)"}
                    </th>
                    <th className="p-4 font-display font-bold text-gray-800 dark:text-gray-200 w-1/4">
                      {slots[1] ? slots[1].name : "Tool Slot 2 (Empty)"}
                    </th>
                    <th className="p-4 font-display font-bold text-gray-800 dark:text-gray-200 w-1/4">
                      {slots[2] ? slots[2].name : "Tool Slot 3 (Empty)"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-gray-600 dark:text-gray-300">
                  {/* Replaces Platform */}
                  <tr>
                    <td className="p-4 font-semibold text-gray-950 dark:text-gray-400 bg-gray-50/20 dark:bg-gray-900/10">
                      Replaces Platform
                    </td>
                    {slots.map((tool, idx) => (
                      <td key={idx} className="p-4">
                        {tool ? (
                          <span className="font-mono font-bold text-red-500 bg-red-500/5 px-2 py-0.5 rounded-md border border-red-500/10">
                            {tool.freeAlternativeTo}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600">-</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Category */}
                  <tr>
                    <td className="p-4 font-semibold text-gray-950 dark:text-gray-400 bg-gray-50/20 dark:bg-gray-900/10">
                      SaaS Domain / Category
                    </td>
                    {slots.map((tool, idx) => (
                      <td key={idx} className="p-4">
                        {tool ? (
                          <span className="capitalize font-semibold text-indigo-600 dark:text-indigo-400">
                            {CATEGORIES.find((c) => c.id === tool.category)?.name || tool.category}
                          </span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600">-</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Est Pricing Value */}
                  <tr>
                    <td className="p-4 font-semibold text-gray-950 dark:text-gray-400 bg-gray-50/20 dark:bg-gray-900/10">
                      Est. Premium Cost
                    </td>
                    {slots.map((tool, idx) => {
                      if (!tool) return <td key={idx} className="p-4 text-gray-400 dark:text-gray-600">-</td>;
                      const { monthly } = getSavingsEstimate(tool);
                      return (
                        <td key={idx} className="p-4 font-mono font-bold text-gray-900 dark:text-white">
                          ₹{(monthly * 85).toLocaleString('en-IN')}/month
                        </td>
                      );
                    })}
                  </tr>

                  {/* Annual Savings */}
                  <tr>
                    <td className="p-4 font-semibold text-gray-950 dark:text-gray-400 bg-gray-50/20 dark:bg-gray-900/10">
                      Builder Annual Savings
                    </td>
                    {slots.map((tool, idx) => {
                      if (!tool) return <td key={idx} className="p-4 text-gray-400 dark:text-gray-600">-</td>;
                      const { annual } = getSavingsEstimate(tool);
                      return (
                        <td key={idx} className="p-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-400 border border-emerald-500/10">
                            <Sparkles className="h-3 w-3 text-emerald-500 fill-emerald-500" />
                            <span>Save ₹{(annual * 85).toLocaleString('en-IN')}/yr</span>
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Community Rating */}
                  <tr>
                    <td className="p-4 font-semibold text-gray-950 dark:text-gray-400 bg-gray-50/20 dark:bg-gray-900/10">
                      Community Rating
                    </td>
                    {slots.map((tool, idx) => {
                      if (!tool) return <td key={idx} className="p-4 text-gray-400 dark:text-gray-600">-</td>;
                      const ratingVal = getToolRating(tool);
                      const reviewCount = getToolReviews(tool).length;
                      return (
                        <td key={idx} className="p-4 space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="font-mono font-bold text-gray-900 dark:text-white">{ratingVal.toFixed(1)}</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3 w-3 ${
                                    star <= ratingVal
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-gray-200 dark:text-gray-800"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500">Based on {reviewCount} reviews</p>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Tags */}
                  <tr>
                    <td className="p-4 font-semibold text-gray-950 dark:text-gray-400 bg-gray-50/20 dark:bg-gray-900/10">
                      Core Specs & Capabilities
                    </td>
                    {slots.map((tool, idx) => (
                      <td key={idx} className="p-4">
                        {tool ? (
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {tool.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-block rounded-md bg-indigo-50/50 dark:bg-indigo-950/20 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-100/30 dark:border-indigo-950/40"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600">-</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Direct Access link */}
                  <tr>
                    <td className="p-4 font-semibold text-gray-950 dark:text-gray-400 bg-gray-50/20 dark:bg-gray-900/10">
                      Action Spec
                    </td>
                    {slots.map((tool, idx) => (
                      <td key={idx} className="p-4">
                        {tool ? (
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 font-display text-xs font-bold shadow-sm transition-all cursor-pointer"
                          >
                            <span>Access Free Tool</span>
                            <span>➜</span>
                          </a>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-600">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Informational Notice */}
          <div className="flex items-start gap-2.5 rounded-2xl bg-indigo-50/40 border border-indigo-100/30 p-4 text-indigo-900 dark:bg-indigo-950/10 dark:border-indigo-900/30 dark:text-indigo-300">
            <Sparkles className="h-4.5 w-4.5 text-indigo-500 shrink-0 mt-0.5 fill-indigo-500/10" />
            <div className="space-y-1">
              <h5 className="font-display text-xs font-bold">Why Compare Free Tools?</h5>
              <p className="font-sans text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
                While standard commercial software bundles all features under a single premium subscription, open-source and free specialized alternatives are often designed for razor-sharp single-purpose utilities. Comparing their capabilities lets you combine the perfect toolbox to entirely replace expensive subscriptions like Jasper, Copy.ai, and Canva Pro.
              </p>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
