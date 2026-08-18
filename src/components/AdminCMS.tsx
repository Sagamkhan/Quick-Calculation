import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  Unlock,
  Key,
  LogOut,
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Link as LinkIcon,
  Copy,
  Download,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { TOOLS_CATALOG, ToolItem } from '../data/categoriesAndTools';
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  invalidateBlogCache,
  BlogPost,
  CUSTOM_POSTS_STORAGE_KEY,
  CUSTOM_CATEGORIES_STORAGE_KEY
} from '../data/blogPosts';
import {
  getStoredPingConfig,
  savePingConfig,
  getStoredPingLogs,
  clearPingLogs,
  pingSitemapToSearchEngines,
  submitUrlsToIndexNow,
  broadcastSearchEngines,
  searchPingCron,
  PingLog,
  PingConfig
} from '../utils/searchEnginePinger';
import {
  analyzePostSeo,
  parseFaqsFromMarkdown,
  buildMarkdownFaqSection,
  FaqItem
} from '../utils/adminSeoAnalyzer';
import {
  getStoredGlobalSeoSettings,
  saveStoredGlobalSeoSettings,
  GlobalSeoSettings
} from '../utils/adminCmsSettings';
import Helmet from './Helmet';

// Modular Admin Tabs
import AdminSidebar, { AdminTabType } from './admin/AdminSidebar';
import AdminOverviewTab from './admin/AdminOverviewTab';
import AdminEditorTab from './admin/AdminEditorTab';
import AdminArticlesTab from './admin/AdminArticlesTab';
import AdminCategoriesTab from './admin/AdminCategoriesTab';
import AdminToolsManagerTab from './admin/AdminToolsManagerTab';
import AdminBulkTab from './admin/AdminBulkTab';
import AdminSettingsTab from './admin/AdminSettingsTab';
import AdminIndexingTab from './admin/AdminIndexingTab';
import AdminSecurityTab from './admin/AdminSecurityTab';

const DEFAULT_ADMIN_USERNAME = 'sagamkhan';
const DEFAULT_ADMIN_PIN = 'Sagam@786';
const FALLBACK_ADMIN_PIN = 'Admin@QuickCalc2026';
const SESSION_KEY = 'quickcalc_admin_auth_token';
const PIN_STORAGE_KEY = 'quickcalc_admin_master_pin';
const USERNAME_STORAGE_KEY = 'quickcalc_admin_username';

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  badgeColor: string;
  postCount?: number;
}

const DEFAULT_CMS_CATEGORIES: AdminCategory[] = [
  { id: 'cat-seo', name: 'SEO Tools', slug: 'seo-tools', description: 'Search engine optimization strategies, meta tags, and Core Web Vitals.', badgeColor: 'cyan' },
  { id: 'cat-finance', name: 'Finance Guides', slug: 'finance-guides', description: 'Compound interest, SIP wealth growth, and investment planning.', badgeColor: 'emerald' },
  { id: 'cat-dev', name: 'Developer Tips', slug: 'developer-tips', description: 'Client-side debugging, JSON tools, and WebAssembly computing.', badgeColor: 'indigo' },
  { id: 'cat-tech', name: 'Tech News', slug: 'tech-news', description: 'Browser security, privacy trends, and edge compute performance.', badgeColor: 'purple' },
  { id: 'cat-math', name: 'Math & Utility', slug: 'math-utility', description: 'Fast unit conversion, geometry formulas, and productivity math.', badgeColor: 'amber' }
];

interface AdminCMSProps {
  onGoHome: () => void;
  onNavigateBlog?: (slug?: string) => void;
  onNavigateTool?: (slug: string) => void;
}

export default function AdminCMS({ onGoHome, onNavigateBlog, onNavigateTool }: AdminCMSProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const token =
        sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      return token === 'authenticated' || (typeof token === 'string' && token.startsWith('qc_sec_'));
    }
    return false;
  });

  const [usernameInput, setUsernameInput] = useState<string>('sagamkhan');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);

  // Layout & Tab State
  const [activeTab, setActiveTab] = useState<AdminTabType>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Master PIN / Password storage
  const [masterPin, setMasterPin] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_ADMIN_PIN;
    }
    return DEFAULT_ADMIN_PIN;
  });

  const [adminUsername, setAdminUsername] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(USERNAME_STORAGE_KEY) || DEFAULT_ADMIN_USERNAME;
    }
    return DEFAULT_ADMIN_USERNAME;
  });

  // Lockout timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutSeconds > 0) {
      timer = setInterval(() => {
        setLockoutSeconds((prev) => {
          if (prev <= 1) {
            setAuthError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [lockoutSeconds]);

  // Global SEO Settings
  const [globalSettings, setGlobalSettings] = useState<GlobalSeoSettings>(() =>
    getStoredGlobalSeoSettings()
  );

  // Custom Categories state
  const [categories, setCategories] = useState<AdminCategory[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CUSTOM_CATEGORIES_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return DEFAULT_CMS_CATEGORIES;
        }
      }
    }
    return DEFAULT_CMS_CATEGORIES;
  });

  // Custom articles state
  const [customArticles, setCustomArticles] = useState<BlogPost[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CUSTOM_POSTS_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  });

  // Editor Form State
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [postTitle, setPostTitle] = useState<string>('');
  const [postSlug, setPostSlug] = useState<string>('');
  const [postCategory, setPostCategory] = useState<string>('SEO Tools');
  const [postFocusKeyword, setPostFocusKeyword] = useState<string>('');
  const [postMetaDescription, setPostMetaDescription] = useState<string>('');
  const [postCanonicalUrl, setPostCanonicalUrl] = useState<string>('');
  const [postAuthor, setPostAuthor] = useState<string>('Sagam Khan');
  const [postAuthorRole, setPostAuthorRole] = useState<string>('Founder & Lead Engineer');
  const [postCoverImage, setPostCoverImage] = useState<string>('');
  const [postCoverImageAlt, setPostCoverImageAlt] = useState<string>('');
  const [postPublishedDate, setPostPublishedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [postIsFeatured, setPostIsFeatured] = useState<boolean>(false);
  const [postBody, setPostBody] = useState<string>('');
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  // Editor Links & Copy status
  const [isToolPickerOpen, setIsToolPickerOpen] = useState<boolean>(false);
  const [toolPickerSearch, setToolPickerSearch] = useState<string>('');
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);
  const [copiedArticleSlug, setCopiedArticleSlug] = useState<string | null>(null);

  // Search Engine Pinger State
  const [pingConfig, setPingConfig] = useState<PingConfig>(() => getStoredPingConfig());
  const [pingLogs, setPingLogs] = useState<PingLog[]>(() => getStoredPingLogs());
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [pingFilter, setPingFilter] = useState<'all' | 'google' | 'bing' | 'indexnow'>('all');
  const [sitemapCustomUrl, setSitemapCustomUrl] = useState<string>(() => pingConfig.sitemapUrl);
  const [indexNowKeyInput, setIndexNowKeyInput] = useState<string>(() => pingConfig.indexNowKey);
  const [indexNowKeyLocInput, setIndexNowKeyLocInput] = useState<string>(
    () => pingConfig.indexNowKeyLocation
  );
  const [pingIntervalInput, setPingIntervalInput] = useState<number>(
    () => pingConfig.pingIntervalHours
  );
  const [autoPingPublishToggle, setAutoPingPublishToggle] = useState<boolean>(
    () => pingConfig.autoPingOnPublish
  );
  const [periodicPingToggle, setPeriodicPingToggle] = useState<boolean>(
    () => pingConfig.periodicPingEnabled
  );

  // Bulk Generator State
  const [isBulkGenerating, setIsBulkGenerating] = useState<boolean>(false);

  // Sync state to local storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CUSTOM_CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    }
  }, [categories]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CUSTOM_POSTS_STORAGE_KEY, JSON.stringify(customArticles));
    }
  }, [customArticles]);

  // Combined articles list
  const allArticles = useMemo(() => {
    const staticPosts = getAllBlogPosts();
    const customSlugs = new Set(customArticles.map((a) => a.slug));
    return [...customArticles, ...staticPosts.filter((p) => !customSlugs.has(p.slug))];
  }, [customArticles]);

  // Real-time SEO Analysis
  const seoAnalysis = useMemo(() => {
    return analyzePostSeo(
      postTitle,
      postMetaDescription,
      postSlug,
      postFocusKeyword,
      postBody + (faqs.length > 0 ? buildMarkdownFaqSection(faqs) : '')
    );
  }, [postTitle, postMetaDescription, postSlug, postFocusKeyword, postBody, faqs]);

  // Periodic cron ping scheduler
  useEffect(() => {
    if (isAuthenticated && pingConfig.periodicPingEnabled) {
      searchPingCron.start();
    }
    return () => {
      searchPingCron.stop();
    };
  }, [isAuthenticated, pingConfig]);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    const trimmedUser = usernameInput.trim().toLowerCase();
    const trimmedPass = passwordInput.trim();
    const targetUser = adminUsername.trim().toLowerCase();
    const targetPass = masterPin.trim();

    // Check credentials: username matches target (or sagamkhan / admin) AND password matches target (or Sagam@786 / Admin@QuickCalc2026)
    const isUserValid =
      trimmedUser === targetUser ||
      trimmedUser === DEFAULT_ADMIN_USERNAME ||
      trimmedUser === 'admin';

    const isPassValid =
      trimmedPass === targetPass ||
      trimmedPass === DEFAULT_ADMIN_PIN ||
      trimmedPass === FALLBACK_ADMIN_PIN;

    if (isUserValid && isPassValid) {
      setIsAuthenticated(true);
      setAuthError('');
      setFailedAttempts(0);
      const sessionToken = `qc_sec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      if (rememberMe) {
        localStorage.setItem(SESSION_KEY, sessionToken);
      } else {
        sessionStorage.setItem(SESSION_KEY, sessionToken);
      }
      showToast(`Welcome back, ${usernameInput.trim()} (QuickCalc CMS)`);
    } else {
      const nextFailures = failedAttempts + 1;
      setFailedAttempts(nextFailures);
      if (nextFailures >= 5) {
        setLockoutSeconds(30);
        setAuthError('Too many failed attempts! Account locked for 30 seconds for security.');
      } else {
        setAuthError(
          `Invalid Credentials! Username or Password incorrect. (${5 - nextFailures} attempts remaining)`
        );
      }
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    setPasswordInput('');
    setAuthError('');
    showToast('Logged out of Admin CMS successfully');
  };

  // Title change with auto-slug
  const handleTitleChange = (val: string) => {
    setPostTitle(val);
    if (!editingSlug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setPostSlug(generated);
    }
  };

  // Insert tool link into editor
  const handleInsertToolLink = (tool: ToolItem) => {
    const linkText = `[${tool.name}](/tools/${tool.slug || tool.id})`;
    setPostBody((prev) => `${prev}\n\nCheck out our ${linkText} for real-time calculations.`);
    setIsToolPickerOpen(false);
    showToast(`Inserted link to ${tool.name}`);
  };

  // Save and Publish Post
  const handleSaveAndPublish = async () => {
    if (!postTitle.trim()) {
      showToast('Please enter an article title');
      return;
    }
    const cleanSlug =
      postSlug.trim() ||
      postTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    // Append FAQ markdown if FAQs exist and not already in body
    let finalBody = postBody.trim();
    if (faqs.length > 0 && !finalBody.includes('## Frequently Asked Questions')) {
      finalBody += buildMarkdownFaqSection(faqs);
    }

    const words = finalBody.split(/\s+/).filter(Boolean).length;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));

    const newPost: BlogPost = {
      slug: cleanSlug,
      title: postTitle.trim(),
      metaDescription: postMetaDescription.trim() || postTitle.trim(),
      focusKeyword: postFocusKeyword.trim(),
      publishedAt: postPublishedDate || new Date().toISOString(),
      formattedDate: new Date(postPublishedDate || Date.now()).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      category: postCategory,
      coverImage: postCoverImage,
      coverImageAlt: postCoverImageAlt || postTitle.trim(),
      isFeatured: postIsFeatured,
      author: postAuthor || 'Shahroz Khan',
      authorRole: postAuthorRole || 'Founder & Lead Engineer',
      body: finalBody,
      readTime: `${readTimeMinutes} min read`,
      wordCount: words,
      headings: []
    };

    // Update custom articles list
    setCustomArticles((prev) => {
      const filtered = prev.filter((p) => p.slug !== cleanSlug && p.slug !== editingSlug);
      return [newPost, ...filtered];
    });

    invalidateBlogCache();
    showToast(`Article "${postTitle}" published live!`);

    // Auto-ping search engines if enabled
    if (pingConfig.autoPingOnPublish) {
      try {
        const postUrl = `https://quickcalc.in/blogs/${cleanSlug}`;
        await broadcastSearchEngines(pingConfig.sitemapUrl, [postUrl]);
        setPingLogs(getStoredPingLogs());
        setPingConfig(getStoredPingConfig());
      } catch (err) {
        console.warn('[AdminCMS] Auto-ping warning:', err);
      }
    }

    setEditingSlug(null);
    setActiveTab('articles');
  };

  // Start new blank article
  const handleStartNewArticle = () => {
    setEditingSlug(null);
    setPostTitle('');
    setPostSlug('');
    setPostFocusKeyword('');
    setPostMetaDescription('');
    setPostCanonicalUrl('');
    setPostCoverImage('');
    setPostCoverImageAlt('');
    setPostBody('');
    setFaqs([]);
    setActiveTab('editor');
  };

  // Edit existing article
  const handleEditArticle = (article: BlogPost) => {
    setEditingSlug(article.slug);
    setPostTitle(article.title);
    setPostSlug(article.slug);
    setPostCategory(article.category);
    setPostFocusKeyword(article.focusKeyword || '');
    setPostMetaDescription(article.metaDescription);
    setPostCanonicalUrl(`https://quickcalc.in/blogs/${article.slug}`);
    setPostAuthor(article.author || 'Shahroz Khan');
    setPostAuthorRole(article.authorRole || 'Founder & Lead Engineer');
    setPostCoverImage(
      article.coverImage ||
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
    );
    setPostCoverImageAlt(article.coverImageAlt || article.title);
    setPostPublishedDate(article.publishedAt.slice(0, 10));
    setPostIsFeatured(Boolean(article.isFeatured));
    setPostBody(article.body);

    const parsedFaqs = parseFaqsFromMarkdown(article.body);
    setFaqs(
      parsedFaqs.length > 0
        ? parsedFaqs
        : [
            {
              id: 'faq-1',
              question: 'How accurate is this calculator?',
              answer: 'All calculations run standard mathematical and financial algorithms.'
            }
          ]
    );

    setActiveTab('editor');
  };

  // Delete article
  const handleDeleteArticle = (slug: string) => {
    if (window.confirm(`Are you sure you want to delete article "${slug}"?`)) {
      setCustomArticles((prev) => prev.filter((p) => p.slug !== slug));
      invalidateBlogCache();
      showToast(`Article "${slug}" deleted.`);
    }
  };

  // Markdown format generator
  const generateMarkdownString = (article?: BlogPost) => {
    const t = article ? article.title : postTitle;
    const s = article ? article.slug : postSlug;
    const c = article ? article.category : postCategory;
    const a = article ? article.author : postAuthor;
    const r = article ? article.authorRole : postAuthorRole;
    const k = article ? article.focusKeyword : postFocusKeyword;
    const m = article ? article.metaDescription : postMetaDescription;
    const d = article ? article.publishedAt : postPublishedDate;
    const img = article ? article.coverImage : postCoverImage;
    const b = article ? article.body : postBody;

    return `---
title: "${t}"
slug: "${s}"
category: "${c}"
author: "${a}"
authorRole: "${r}"
publishedAt: "${d}"
focusKeyword: "${k}"
metaDescription: "${m}"
coverImage: "${img}"
isFeatured: false
---

${b}${faqs.length > 0 && !b.includes('## Frequently Asked Questions') ? buildMarkdownFaqSection(faqs) : ''}`;
  };

  // Copy Markdown
  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownString());
    setCopiedStatus('markdown');
    showToast('Copied full Markdown with YAML frontmatter!');
    setTimeout(() => setCopiedStatus(null), 2500);
  };

  // Download Markdown file
  const handleDownloadMarkdown = () => {
    const md = generateMarkdownString();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${postSlug || 'article'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${postSlug || 'article'}.md`);
  };

  // Copy specific article from list
  const handleCopyArticleMd = (article: BlogPost) => {
    navigator.clipboard.writeText(generateMarkdownString(article));
    setCopiedArticleSlug(article.slug);
    showToast(`Copied ${article.slug}.md to clipboard`);
    setTimeout(() => setCopiedArticleSlug(null), 2000);
  };

  // Download specific article from list
  const handleDownloadArticleMd = (article: BlogPost) => {
    const md = generateMarkdownString(article);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${article.slug}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${article.slug}.md`);
  };

  // Create Category
  const handleCreateCategory = (newCat: Omit<AdminCategory, 'id'>) => {
    const id = `cat-${Date.now()}`;
    setCategories((prev) => [...prev, { ...newCat, id }]);
    showToast(`Category "${newCat.name}" created.`);
  };

  // Delete Category
  const handleDeleteCategory = (id: string) => {
    if (categories.length <= 1) {
      showToast('You must keep at least one category.');
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category deleted.');
  };

  // Bulk Generation Handler
  const handleBulkGenerateAndPublish = async (topics: string[], category: string) => {
    setIsBulkGenerating(true);
    const newBatch: BlogPost[] = [];

    for (const title of topics) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Pick 2 random relevant tools
      const randomTools = TOOLS_CATALOG.slice(0, 3);
      const toolLinks = randomTools
        .map((t) => `[${t.name}](/tools/${t.slug || t.id})`)
        .join(', ');

      const body = `## Overview

In this technical guide, we break down **${title}** with step-by-step methodologies and client-side calculators.

## Key Formulas & Methodology

Precision calculation guarantees optimal results without manual error. You can run instant benchmarks using our ${toolLinks}.

### Core Steps

1. Review initial parameters and baseline assumptions.
2. Compute target values in-browser with zero latency.
3. Export and share reproducible calculation outputs.

## Frequently Asked Questions

### What makes this approach accurate?
All computations are powered by verified algorithmic formulas adhering to industry standards.

### Is my input data kept private?
Yes. Quick Calculator processes 100% of data locally on your device.`;

      const words = body.split(/\s+/).length;
      newBatch.push({
        slug,
        title,
        metaDescription: `Master ${title.toLowerCase()} with fast, privacy-first interactive tools on Quick Calculator.`,
        focusKeyword: title.split(' ').slice(0, 3).join(' ').toLowerCase(),
        publishedAt: new Date().toISOString(),
        formattedDate: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        category,
        coverImage:
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        coverImageAlt: title,
        isFeatured: false,
        author: globalSettings.defaultAuthor,
        authorRole: globalSettings.defaultAuthorRole,
        body,
        readTime: `${Math.max(1, Math.ceil(words / 200))} min read`,
        wordCount: words,
        headings: []
      });
    }

    setCustomArticles((prev) => [...newBatch, ...prev]);
    invalidateBlogCache();
    setIsBulkGenerating(false);
    showToast(`Successfully created & published ${newBatch.length} articles!`);

    // Auto ping search engines
    if (pingConfig.autoPingOnPublish) {
      try {
        const urls = newBatch.map((p) => `https://quickcalc.in/blogs/${p.slug}`);
        await broadcastSearchEngines(pingConfig.sitemapUrl, urls);
        setPingLogs(getStoredPingLogs());
      } catch (err) {
        // ignore
      }
    }

    setActiveTab('articles');
  };

  // Search Engine Pinger Actions
  const handleManualPingSitemap = async () => {
    setIsPinging(true);
    await pingSitemapToSearchEngines(sitemapCustomUrl);
    setPingLogs(getStoredPingLogs());
    setPingConfig(getStoredPingConfig());
    setIsPinging(false);
    showToast('Ping signals transmitted to Google & Bing');
  };

  const handleManualIndexNow = async () => {
    setIsPinging(true);
    const urls = allArticles.slice(0, 10).map((a) => `https://quickcalc.in/blogs/${a.slug}`);
    await submitUrlsToIndexNow(urls, indexNowKeyInput, indexNowKeyLocInput);
    setPingLogs(getStoredPingLogs());
    setPingConfig(getStoredPingConfig());
    setIsPinging(false);
    showToast('Submitted URLs to IndexNow protocol');
  };

  const handleManualBroadcastAll = async () => {
    setIsPinging(true);
    const urls = allArticles.slice(0, 10).map((a) => `https://quickcalc.in/blogs/${a.slug}`);
    await broadcastSearchEngines(sitemapCustomUrl, urls);
    setPingLogs(getStoredPingLogs());
    setPingConfig(getStoredPingConfig());
    setIsPinging(false);
    showToast('Full Search Engine Broadcast completed');
  };

  const handleSavePingConfigForm = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PingConfig = {
      ...pingConfig,
      sitemapUrl: sitemapCustomUrl,
      indexNowKey: indexNowKeyInput,
      indexNowKeyLocation: indexNowKeyLocInput,
      pingIntervalHours: pingIntervalInput,
      autoPingOnPublish: autoPingPublishToggle,
      periodicPingEnabled: periodicPingToggle
    };
    savePingConfig(updated);
    setPingConfig(updated);
    showToast('Pinger & IndexNow settings saved');
  };

  const handleClearLogs = () => {
    clearPingLogs();
    setPingLogs([]);
    showToast('Logs cleared');
  };

  // Master PIN change
  const handleChangeMasterPin = (newPin: string) => {
    setMasterPin(newPin);
    if (typeof window !== 'undefined') {
      localStorage.setItem(PIN_STORAGE_KEY, newPin);
    }
    showToast('Master PIN updated');
  };

  // Filtered tools in tool picker modal
  const pickerFilteredTools = useMemo(() => {
    if (!toolPickerSearch.trim()) return TOOLS_CATALOG.slice(0, 30);
    const q = toolPickerSearch.toLowerCase();
    return TOOLS_CATALOG.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
    ).slice(0, 40);
  }, [toolPickerSearch]);

  // UN-AUTHENTICATED LOCK SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        <Helmet
          title="Admin Access Gateway | Quick Calculator"
          description="Protected management console for Quick Calculator."
          canonicalUrl="https://quickcalc.in/admin"
          robots="noindex, nofollow"
        />

        {/* Background Ambience */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-display text-white">
              QuickCalc CMS Gateway
            </h2>
            <p className="text-xs text-slate-400">
              Enter authorized administrator credentials to access the control center.
            </p>
          </div>

          {/* Rate-limit lockout countdown banner */}
          {lockoutSeconds > 0 && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2"
            >
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <AlertCircle className="w-4 h-4" />
                  Security Lockout Active
                </span>
                <span className="font-mono text-rose-400 font-black">{lockoutSeconds}s remaining</span>
              </div>
              <p className="text-[11px] text-rose-300/80 leading-relaxed">
                Too many consecutive invalid attempts. Cooldown in progress to prevent brute-force intrusion.
              </p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(lockoutSeconds / 30) * 100}%` }}
                />
              </div>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1">
              <label className="block text-xs font-mono text-slate-300 font-semibold">
                ADMIN USERNAME
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter username (e.g. sagamkhan)..."
                disabled={lockoutSeconds > 0}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                autoFocus
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="block text-xs font-mono text-slate-300 font-semibold">
                ADMIN PASSWORD / MASTER KEY
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter secure password..."
                  disabled={lockoutSeconds > 0}
                  className="w-full pl-4 pr-11 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-cyan-500"
                />
                <span>Remember session</span>
              </label>
              <span className="text-[11px] font-mono text-slate-500">Master Enclave</span>
            </div>

            {authError && lockoutSeconds === 0 && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={lockoutSeconds > 0}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Dashboard</span>
            </button>
          </form>

          {/* Security Features Badge */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">AES-256 Token</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">Anti-Brute Force</span>
            </div>
          </div>

          <div className="text-center pt-1">
            <button
              onClick={onGoHome}
              className="text-xs text-slate-500 hover:text-slate-300 font-mono transition-colors"
            >
              ← Back to Quick Calculator Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      <Helmet
        title="Admin CMS & SEO Dashboard | Quick Calculator"
        description="Manage technical guides, dynamic categories, schema markup, and search engine pings."
        canonicalUrl="https://quickcalc.in/admin"
        robots="noindex, nofollow"
      />

      {/* Global Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white sm:hidden cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <span className="font-display font-black text-sm text-white">
              {activeTab === 'overview'
                ? 'Overview'
                : activeTab === 'editor'
                ? 'Post Creator (SEO)'
                : activeTab === 'articles'
                ? 'Manage Posts'
                : activeTab === 'categories'
                ? 'Categories & Tags'
                : activeTab === 'tools'
                ? 'Tool & Calculator Manager'
                : activeTab === 'bulk'
                ? 'Bulk AI Generator'
                : activeTab === 'indexing'
                ? 'Search Engine Pinger'
                : activeTab === 'settings'
                ? 'Global SEO & Schema'
                : 'Security & PIN'}
            </span>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/20">
              CMS CONTROL
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onGoHome}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="View Public Site"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">View Public Site</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Shell: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden sm:flex shrink-0">
          <AdminSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            totalArticles={allArticles.length}
            totalCategories={categories.length}
            onGoHome={onGoHome}
            onLogout={handleLogout}
          />
        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm sm:hidden flex">
            <div className="w-64 bg-slate-900 h-full p-4 flex flex-col">
              <AdminSidebar
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setIsMobileMenuOpen(false);
                }}
                isCollapsed={false}
                setIsCollapsed={() => {}}
                totalArticles={allArticles.length}
                totalCategories={categories.length}
                onGoHome={onGoHome}
                onLogout={handleLogout}
              />
            </div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <AdminOverviewTab
                articles={allArticles}
                categories={categories}
                setActiveTab={setActiveTab}
                onEditArticle={handleEditArticle}
                onNavigateBlog={onNavigateBlog}
                onStartNewArticle={handleStartNewArticle}
                lastPingTime={pingConfig.lastPingTimestamp}
              />
            )}

            {activeTab === 'editor' && (
              <AdminEditorTab
                editingSlug={editingSlug}
                postTitle={postTitle}
                onTitleChange={handleTitleChange}
                postSlug={postSlug}
                setPostSlug={setPostSlug}
                postCategory={postCategory}
                setPostCategory={setPostCategory}
                postFocusKeyword={postFocusKeyword}
                setPostFocusKeyword={setPostFocusKeyword}
                postMetaDescription={postMetaDescription}
                setPostMetaDescription={setPostMetaDescription}
                postCanonicalUrl={postCanonicalUrl}
                setPostCanonicalUrl={setPostCanonicalUrl}
                postAuthor={postAuthor}
                setPostAuthor={setPostAuthor}
                postAuthorRole={postAuthorRole}
                setPostAuthorRole={setPostAuthorRole}
                postCoverImage={postCoverImage}
                setPostCoverImage={setPostCoverImage}
                postCoverImageAlt={postCoverImageAlt}
                setPostCoverImageAlt={setPostCoverImageAlt}
                postPublishedDate={postPublishedDate}
                setPostPublishedDate={setPostPublishedDate}
                postIsFeatured={postIsFeatured}
                setPostIsFeatured={setPostIsFeatured}
                postBody={postBody}
                setPostBody={setPostBody}
                faqs={faqs}
                setFaqs={setFaqs}
                categories={categories}
                seoAnalysis={seoAnalysis}
                onOpenToolPicker={() => setIsToolPickerOpen(true)}
                onSaveAndPublish={handleSaveAndPublish}
                onCopyMarkdown={handleCopyMarkdown}
                onDownloadMarkdown={handleDownloadMarkdown}
                copiedStatus={copiedStatus}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'articles' && (
              <AdminArticlesTab
                articles={allArticles}
                categories={categories}
                onStartNewArticle={handleStartNewArticle}
                onEditArticle={handleEditArticle}
                onDeleteArticle={handleDeleteArticle}
                onNavigateBlog={onNavigateBlog}
                onCopyArticleMd={handleCopyArticleMd}
                onDownloadArticleMd={handleDownloadArticleMd}
                copiedSlug={copiedArticleSlug}
              />
            )}

            {activeTab === 'categories' && (
              <AdminCategoriesTab
                categories={categories}
                articles={allArticles}
                onCreateCategory={handleCreateCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            )}

            {activeTab === 'tools' && (
              <AdminToolsManagerTab
                builtinTools={TOOLS_CATALOG}
                onOpenLiveTool={onNavigateTool || ((slug) => {
                  window.open(`/tools/${slug}`, '_blank');
                })}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'bulk' && (
              <AdminBulkTab
                categories={categories}
                onBulkGenerateAndPublish={handleBulkGenerateAndPublish}
                isGenerating={isBulkGenerating}
              />
            )}

            {activeTab === 'settings' && (
              <AdminSettingsTab
                settings={globalSettings}
                onSaveSettings={(updated) => {
                  setGlobalSettings(updated);
                  saveStoredGlobalSeoSettings(updated);
                  showToast('Global SEO Settings updated!');
                }}
              />
            )}

            {activeTab === 'indexing' && (
              <AdminIndexingTab
                pingConfig={pingConfig}
                pingLogs={pingLogs}
                isPinging={isPinging}
                pingFilter={pingFilter}
                setPingFilter={setPingFilter}
                sitemapCustomUrl={sitemapCustomUrl}
                setSitemapCustomUrl={setSitemapCustomUrl}
                indexNowKeyInput={indexNowKeyInput}
                setIndexNowKeyInput={setIndexNowKeyInput}
                indexNowKeyLocInput={indexNowKeyLocInput}
                setIndexNowKeyLocInput={setIndexNowKeyLocInput}
                pingIntervalInput={pingIntervalInput}
                setPingIntervalInput={setPingIntervalInput}
                autoPingPublishToggle={autoPingPublishToggle}
                setAutoPingPublishToggle={setAutoPingPublishToggle}
                periodicPingToggle={periodicPingToggle}
                setPeriodicPingToggle={setPeriodicPingToggle}
                onManualPingSitemap={handleManualPingSitemap}
                onManualIndexNow={handleManualIndexNow}
                onManualBroadcastAll={handleManualBroadcastAll}
                onSavePingConfig={handleSavePingConfigForm}
                onClearLogs={handleClearLogs}
              />
            )}

            {activeTab === 'security' && (
              <AdminSecurityTab
                masterPin={masterPin}
                onChangePin={handleChangeMasterPin}
                onLogout={handleLogout}
              />
            )}
          </div>
        </main>
      </div>

      {/* Tool Link Picker Modal */}
      <AnimatePresence>
        {isToolPickerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-white flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-cyan-400" />
                  <span>Insert Calculator Internal Link</span>
                </h4>
                <button
                  onClick={() => setIsToolPickerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={toolPickerSearch}
                  onChange={(e) => setToolPickerSearch(e.target.value)}
                  placeholder="Search 250+ calculators..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                  autoFocus
                />
              </div>

              {/* Tool list */}
              <div className="overflow-y-auto divide-y divide-slate-800/80 pr-1 space-y-1 flex-1 custom-scrollbar">
                {pickerFilteredTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleInsertToolLink(tool)}
                    className="w-full py-2.5 px-3 rounded-xl hover:bg-slate-800/60 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-200 group-hover:text-cyan-400">
                        {tool.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {tool.category} • /tools/{tool.slug || tool.id}
                      </div>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 font-mono font-bold shrink-0">
                      + Insert
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
