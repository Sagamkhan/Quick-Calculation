import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import MarkdownRenderer from './MarkdownRenderer';
import {
  BookOpen,
  ArrowLeft,
  Clock,
  User,
  Calendar,
  Share2,
  Bookmark,
  Check,
  Tag,
  Sparkles,
  ArrowRight,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  FileCode2,
  ShieldCheck,
  TrendingUp,
  Settings,
  Layers,
  HelpCircle,
  Copy
} from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import Helmet from './Helmet';
import { 
  getAllBlogPosts, 
  getBlogPostBySlug, 
  getRelatedBlogPosts, 
  getAllBlogCategories,
  BlogPost 
} from '../data/blogPosts';

interface BlogGuidesProps {
  initialSlug?: string | null;
  onGoHome: () => void;
  onNavigateSlug?: (slug: string) => void;
}

export default function BlogGuides({ initialSlug, onGoHome, onNavigateSlug }: BlogGuidesProps) {
  const allPosts = useMemo(() => getAllBlogPosts(), []);
  
  // Selected single article state
  const [currentSlug, setCurrentSlug] = useState<string | null>(initialSlug || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Guides');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');

  // Sync state if initialSlug changes via URL popstate/navigation
  useEffect(() => {
    if (initialSlug) {
      setCurrentSlug(initialSlug);
    }
  }, [initialSlug]);

  // Current active post object
  const currentPost = useMemo<BlogPost | null>(() => {
    if (!currentSlug) return null;
    return getBlogPostBySlug(currentSlug) || null;
  }, [currentSlug, allPosts]);

  const allCategories = useMemo(() => getAllBlogCategories(), [allPosts]);

  // Extract FAQs for Schema JSON-LD if present
  const faqSchemaData = useMemo(() => {
    if (!currentPost) return null;
    const body = currentPost.body || '';
    const faqSectionMatch = body.match(/##\s+(?:Frequently Asked Questions|FAQs?)([\s\S]*?)(?:##\s+|$)/i);
    if (!faqSectionMatch) return null;

    const faqContent = faqSectionMatch[1];
    const qAndAs: { question: string; answer: string }[] = [];
    const questionRegex = /###\s+(?:Q:\s*|\d+\.\s*)?([^\n\r]+)([\s\S]*?)(?=###|$)/gi;
    let match;
    while ((match = questionRegex.exec(faqContent)) !== null) {
      const q = match[1].trim();
      const a = match[2].replace(/^A:\s*/i, '').trim();
      if (q && a) {
        qAndAs.push({ question: q, answer: a });
      }
    }

    if (qAndAs.length === 0) return null;

    return {
      '@type': 'FAQPage',
      mainEntity: qAndAs.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        }
      }))
    };
  }, [currentPost]);

  const relatedPosts = useMemo(() => {
    if (!currentPost) return [];
    return getRelatedBlogPosts(currentPost, 3);
  }, [currentPost]);

  // Filtered posts for archive grid
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      // Category filter
      if (selectedCategory !== 'All Guides') {
        const postCat = (post.category || '').toLowerCase().trim();
        const selCat = selectedCategory.toLowerCase().trim();
        const postCatSlug = postCat.replace(/[^a-z0-9]+/g, '-');
        const selCatSlug = selCat.replace(/[^a-z0-9]+/g, '-');
        if (postCat !== selCat && postCatSlug !== selCatSlug) {
          return false;
        }
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = post.title.toLowerCase().includes(q);
        const matchDesc = post.metaDescription.toLowerCase().includes(q);
        const matchKeyword = post.focusKeyword.toLowerCase().includes(q);
        const matchBody = post.body.toLowerCase().includes(q);
        return matchTitle || matchDesc || matchKeyword || matchBody;
      }
      return true;
    });
  }, [allPosts, selectedCategory, searchQuery]);

  // Handle single article selection and URL history update
  const handleSelectArticle = (slug: string) => {
    setCurrentSlug(slug);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/blog/${slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (onNavigateSlug) {
      onNavigateSlug(slug);
    }
  };

  const handleBackToArchive = () => {
    setCurrentSlug(null);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (onNavigateSlug) {
      onNavigateSlug('');
    }
  };

  const handleCopyShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSocialShare = (platform: 'twitter' | 'linkedin' | 'facebook' | 'whatsapp') => {
    if (typeof window === 'undefined' || !currentPost) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${currentPost.title} via @QuickCalculator`);
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
        break;
    }
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Observe heading visibility for active Table of Contents highlighting
  useEffect(() => {
    if (!currentPost) return;
    
    const handleScroll = () => {
      const headings = currentPost.headings.map(h => document.getElementById(h.id)).filter(Boolean);
      for (const el of headings) {
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 200) {
            setActiveHeadingId(el.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPost]);

  // Featured post for the top of the archive
  const featuredPost = useMemo(() => {
    return allPosts.find(p => p.isFeatured) || allPosts[0];
  }, [allPosts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* Dynamic SEO Meta & Schema.org JSON-LD */}
      {currentPost ? (
        <Helmet
          title={`${currentPost.title} | Quick Calculator Guides`}
          description={currentPost.metaDescription}
          canonicalUrl={`https://quickcalculator.app/blog/${currentPost.slug}`}
          ogType="article"
          jsonLd={{
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: currentPost.title,
            description: currentPost.metaDescription,
            image: currentPost.coverImage || 'https://quickcalculator.app/og-image.png',
            datePublished: currentPost.publishedAt,
            dateModified: currentPost.publishedAt,
            author: {
              '@type': 'Person',
              name: currentPost.author,
              url: 'https://quickcalculator.app/about-us'
            },
            publisher: {
              '@type': 'Organization',
              name: 'Quick Calculator',
              url: 'https://quickcalculator.app',
              logo: {
                '@type': 'ImageObject',
                url: 'https://quickcalculator.app/icon.png'
              }
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://quickcalculator.app/blog/${currentPost.slug}`
            },
            keywords: currentPost.focusKeyword
          }}
        />
      ) : (
        <Helmet
          title="Calculators, Web Utilities & Technical SEO Guides | Quick Calculator"
          description="Explore high-value engineering guides, financial planning tutorials, PDF security workflows, and technical SEO insights written by Shahroz Khan."
          canonicalUrl="https://quickcalculator.app/blog"
          ogType="website"
        />
      )}

      {/* Breadcrumbs Navigation */}
      <Breadcrumbs
        currentRoute={{
          path: currentPost ? '/blog/article' : '/blog',
          param: currentPost ? currentPost.title : undefined
        }}
        onNavigate={(path) => {
          if (path === '#/' || path === '/') {
            handleBackToArchive();
            onGoHome();
          } else if (path === '#/blog' || path === '/blog') {
            handleBackToArchive();
          }
        }}
      />

      <AnimatePresence mode="wait">
        {currentPost ? (
          /* =========================================================================
             SINGLE ARTICLE VIEW (/blog/[slug])
             ========================================================================= */
          <motion.div
            key={`article-${currentPost.slug}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="mt-6 space-y-10"
          >
            {/* Top Navigation & Return Bar */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handleBackToArchive}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-xs font-mono font-bold text-cyan-400 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to All Guides & Blog</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href="/admin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-mono border border-slate-800 transition-colors"
                  title="Open Decap CMS Admin Portal"
                >
                  <Settings className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">CMS Admin</span>
                </a>
              </div>
            </div>

            {/* Article Main Layout Grid (Article Body + Sticky Sidebar) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Left Main Article Column */}
              <article className="lg:col-span-8 space-y-8 bg-slate-900/40 p-6 sm:p-10 rounded-3xl border border-slate-800/80 shadow-2xl backdrop-blur-sm">
                
                {/* Header Meta Badge */}
                <div className="space-y-4 border-b border-slate-800/80 pb-8">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/20">
                      {currentPost.category}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 font-mono text-xs font-medium flex items-center gap-1.5 border border-slate-700/60">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{currentPost.readTime}</span>
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-800/80 text-slate-400 font-mono text-xs flex items-center gap-1.5 border border-slate-700/60">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{currentPost.formattedDate}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                    {currentPost.title}
                  </h1>

                  {/* Meta Excerpt / Subtitle */}
                  <p className="text-base text-slate-300 font-medium leading-relaxed">
                    {currentPost.metaDescription}
                  </p>

                  {/* Author Bar & Social Share */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800/60 text-xs font-mono text-slate-400">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                        SK
                      </div>
                      <div>
                        <span className="block font-bold text-slate-200">{currentPost.author}</span>
                        <span className="text-slate-400 text-[11px]">{currentPost.authorRole}</span>
                      </div>
                    </div>

                    {/* Social Share Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleSocialShare('twitter')}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
                        title="Share on Twitter / X"
                      >
                        𝕏 Post
                      </button>
                      <button
                        onClick={() => handleSocialShare('linkedin')}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
                        title="Share on LinkedIn"
                      >
                        LinkedIn
                      </button>
                      <button
                        onClick={() => handleSocialShare('whatsapp')}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
                        title="Share on WhatsApp"
                      >
                        WhatsApp
                      </button>
                      <button
                        onClick={handleCopyShare}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all cursor-pointer text-xs font-bold"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hero Cover Image */}
                {(currentPost.featuredImage || currentPost.coverImage) && (
                  <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative aspect-[16/9] bg-slate-950">
                    <img
                      src={currentPost.featuredImage || currentPost.coverImage}
                      alt={currentPost.imageAlt || currentPost.coverImageAlt || currentPost.title}
                      className="w-full h-full object-cover"
                      loading="eager"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Markdown Rendered Content */}
                <div className="blog-markdown-content space-y-6 text-slate-300 font-sans text-base leading-relaxed">
                  <MarkdownRenderer content={currentPost.body} />
                </div>

                {/* Author E-E-A-T Bio Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start gap-5 shadow-xl">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-lg ring-4 ring-cyan-500/10">
                    SK
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-bold text-base text-white">
                        About {currentPost.author}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-[10px] font-bold border border-cyan-500/20">
                        Author & Verified Reviewer
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      Shahroz Khan is a full-stack engineer and creator of Quick Calculator. Based in Kakrala, Uttar Pradesh, India, he specializes in WebAssembly client-side computation, zero-latency browser utilities, and Google Core Web Vitals optimization.
                    </p>
                    <div className="pt-2 flex items-center gap-4 text-xs font-mono text-cyan-400">
                      <a href="/about-us" className="hover:underline flex items-center gap-1">
                        <span>Editorial Standards & Bio</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

              </article>

              {/* Right Sticky Sidebar (Table of Contents + Related Posts) */}
              <aside className="lg:col-span-4 space-y-6">
                
                {/* Table of Contents Widget */}
                {currentPost.headings.length > 0 && (
                  <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl sticky top-24 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyan-400" />
                        <span>Table of Contents</span>
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400">
                        {currentPost.headings.length} sections
                      </span>
                    </div>

                    <nav className="space-y-1.5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {currentPost.headings.map((heading) => {
                        const isActive = activeHeadingId === heading.id;
                        return (
                          <a
                            key={heading.id}
                            href={`#${heading.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              const target = document.getElementById(heading.id);
                              if (target) {
                                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                setActiveHeadingId(heading.id);
                              }
                            }}
                            className={`block text-xs leading-snug rounded-lg px-2.5 py-1.5 transition-all ${
                              heading.level === 3 ? 'ml-3 text-[11px]' : ''
                            } ${
                              isActive
                                ? 'bg-cyan-500/10 text-cyan-400 font-bold border-l-2 border-cyan-400'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                            }`}
                          >
                            {heading.text}
                          </a>
                        );
                      })}
                    </nav>

                    {/* Quick Decap CMS Entry */}
                    <div className="pt-4 border-t border-slate-800/80">
                      <a
                        href="/admin/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-xs font-mono text-slate-300 border border-slate-800 transition-all text-center"
                      >
                        <Settings className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Edit Post in Decap CMS</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Related Articles Widget */}
                {relatedPosts.length > 0 && (
                  <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
                    <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>Recommended Guides</span>
                    </h3>
                    <div className="space-y-3">
                      {relatedPosts.map((rel) => (
                        <div
                          key={rel.slug}
                          onClick={() => handleSelectArticle(rel.slug)}
                          className="p-3 rounded-2xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all cursor-pointer group space-y-1.5"
                        >
                          <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase">
                            {rel.category}
                          </span>
                          <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-2">
                            {rel.title}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {rel.readTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </aside>
            </div>

          </motion.div>
        ) : (
          /* =========================================================================
             BLOG ARCHIVE DIRECTORY VIEW (/blog)
             ========================================================================= */
          <motion.div
            key="blog-archive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 space-y-10"
          >
            {/* Header Title Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/80 pb-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold border border-cyan-500/20">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Knowledge Hub & Engineering Guides</span>
                </div>
                <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
                  Calculators & SaaS Guides
                </h1>
                <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
                  Deep-dive technical guides on financial algorithms, client-side PDF architectures, Core Web Vitals SEO, and developer productivity tools.
                </p>
              </div>

              {/* Decap CMS Admin Action */}
              <div className="flex items-center gap-3 self-start md:self-auto">
                <a
                  href="/admin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold border border-slate-700 transition-all shadow-md"
                >
                  <Settings className="w-4 h-4 text-cyan-400" />
                  <span>Decap CMS Admin</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Empty State when no posts exist in repository */}
            {allPosts.length === 0 ? (
              <div className="py-16 px-6 sm:px-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4 max-w-2xl mx-auto shadow-2xl">
                <div className="text-5xl select-none" role="img" aria-label="Writing memo">
                  📝
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                  No Articles Published Yet
                </h2>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg mx-auto font-sans">
                  New comprehensive guides, calculator walkthroughs, and tutorials are coming soon. Stay tuned!
                </p>
              </div>
            ) : (
              <>
                {/* Featured Hero Highlight Card */}
                {featuredPost && (
                  <div 
                    onClick={() => handleSelectArticle(featuredPost.slug)}
                    className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-cyan-950/20 border border-slate-800 hover:border-cyan-500/50 shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      <div className="lg:col-span-7 space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/20 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Featured Guide</span>
                          </span>
                          <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-mono text-xs font-semibold">
                            {featuredPost.category}
                          </span>
                        </div>

                        <h2 className="font-display font-bold text-2xl sm:text-3xl text-white group-hover:text-cyan-300 transition-colors leading-tight">
                          {featuredPost.title}
                        </h2>

                        <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                          {featuredPost.metaDescription}
                        </p>

                        <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-2">
                          <span>By {featuredPost.author}</span>
                          <span>•</span>
                          <span>{featuredPost.formattedDate}</span>
                          <span>•</span>
                          <span className="text-cyan-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {featuredPost.readTime}
                          </span>
                        </div>

                        <div className="pt-2">
                          <span className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 group-hover:translate-x-1.5 transition-transform">
                            <span>Read Complete Guide</span>
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>

                      {(featuredPost.featuredImage || featuredPost.coverImage) && (
                        <div className="lg:col-span-5 rounded-2xl overflow-hidden aspect-[16/10] border border-slate-800 shadow-xl">
                          <img
                            src={featuredPost.featuredImage || featuredPost.coverImage}
                            alt={featuredPost.imageAlt || featuredPost.coverImageAlt || featuredPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Filter & Search Bar */}
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    
                    {/* Category Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 custom-scrollbar">
                      {allCategories.map((cat) => {
                        const isSelected = selectedCategory === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-72 shrink-0">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search guides or keywords..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-cyan-500 focus:outline-none text-xs text-slate-200 placeholder:text-slate-500"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-slate-200"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Articles Grid */}
                {filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => (
                      <div
                        key={post.slug}
                        onClick={() => handleSelectArticle(post.slug)}
                        className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between group space-y-4"
                      >
                        {/* Cover Thumbnail if present */}
                        {(post.featuredImage || post.coverImage) && (
                          <div className="rounded-2xl overflow-hidden aspect-[16/9] border border-slate-800/80 bg-slate-950">
                            <img
                              src={post.featuredImage || post.coverImage}
                              alt={post.imageAlt || post.coverImageAlt || post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}

                        <div className="space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between gap-2 text-xs font-mono">
                              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
                                {post.category}
                              </span>
                              <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                                <Clock className="w-3 h-3 text-cyan-400" />
                                {post.readTime}
                              </span>
                            </div>

                            <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                              {post.title}
                            </h3>

                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                              {post.metaDescription}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                            <span>{post.formattedDate}</span>
                            <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                              <span>Read Guide</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center rounded-3xl bg-slate-900/30 border border-slate-800 space-y-3">
                    <p className="text-sm font-mono text-slate-400">
                      No articles found matching "{searchQuery}" in {selectedCategory}.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All Guides');
                      }}
                      className="px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold hover:bg-cyan-500/20"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
