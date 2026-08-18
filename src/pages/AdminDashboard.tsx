import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Zap,
  PenTool,
  Wrench,
  Tag,
  Globe,
  LogOut,
  Save,
  Copy,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search,
  Eye,
  Edit3,
  Code,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sliders,
  FileText,
  HelpCircle,
  RotateCcw,
  Check,
  Layout,
  RefreshCw,
  FolderPlus,
  KeyRound,
  ShieldCheck,
  Lock,
  Unlock,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  X,
  FileImage,
  Settings
} from 'lucide-react';
import { analyzePostSeo, SeoAnalysisResult } from '../utils/adminSeoAnalyzer';
import {
  GlobalSeoSettings,
  getStoredGlobalSeoSettings,
  saveStoredGlobalSeoSettings
} from '../utils/adminCmsSettings';
import AdminSettingsTab from '../components/admin/AdminSettingsTab';
import {
  CustomToolDefinition,
  CustomToolParam,
  getStoredCustomTools,
  saveCustomTool,
  deleteCustomTool,
  toggleCustomToolStatus
} from '../utils/customToolsStorage';
import {
  BlogPost,
  getAllBlogPosts,
  CUSTOM_POSTS_STORAGE_KEY,
  CUSTOM_CATEGORIES_STORAGE_KEY,
  invalidateBlogCache,
  formatBlogDate
} from '../data/blogPosts';
import { CATEGORIES, CategoryInfo, TOOLS_CATALOG, ToolItem } from '../data/categoriesAndTools';
import MarkdownRenderer from '../components/MarkdownRenderer';

interface AdminDashboardProps {
  onGoHome: () => void;
  onNavigateBlog?: (slug?: string) => void;
  onNavigateTool?: (slug: string) => void;
}

interface CustomCategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  badgeColor: string;
  color?: string;
  iconName?: string;
  postCount?: number;
  isCustom?: boolean;
}

// WordPress-style clean Category Slug transformer
export const formatCategorySlug = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics / accents
    .replace(/[\s&/+@_]+/g, '-') // convert spaces and &, /, +, @, _ to clean hyphens
    .replace(/[^a-z0-9-]/g, '') // strip emojis, symbols, punctuation
    .replace(/-+/g, '-') // collapse consecutive hyphens
    .replace(/^-+|-+$/g, ''); // strip leading and trailing hyphens
};

export default function AdminDashboard({
  onGoHome,
  onNavigateBlog,
  onNavigateTool
}: AdminDashboardProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('quickcalc_admin_auth') === 'true';
    }
    return false;
  });
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // Active Tab: 1 = Post Writer, 2 = Tool Builder, 3 = Category Manager, 4 = Settings & SEO
  const [activeTab, setActiveTab] = useState<'posts' | 'tools' | 'categories' | 'settings'>('posts');
  const [globalSettings, setGlobalSettings] = useState<GlobalSeoSettings>(getStoredGlobalSeoSettings);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Login
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem('quickcalc_admin_pin') || '8899';
    if (pinInput.trim() === storedPin || pinInput.trim() === '8899') {
      setIsAuthenticated(true);
      sessionStorage.setItem('quickcalc_admin_auth', 'true');
      setPinError('');
      showToast('Admin Access Granted. Welcome to QuickCalc Control Panel.', 'success');
    } else {
      setPinError('Invalid Security PIN. Default PIN is 8899.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('quickcalc_admin_auth');
    setPinInput('');
    showToast('Logged out of Admin Session', 'info');
  };

  // ==========================================
  // TAB 1: BLOG POST WRITER & PUBLISHING ENGINE
  // ==========================================
  const [postTitle, setPostTitle] = useState<string>('');
  const [postSlug, setPostSlug] = useState<string>('');
  const [isSlugLocked, setIsSlugLocked] = useState<boolean>(false);
  const [postCategory, setPostCategory] = useState<string>('General');
  const [postMetaDescription, setPostMetaDescription] = useState<string>('');
  const [postFocusKeyword, setPostFocusKeyword] = useState<string>('');
  const [postAuthor, setPostAuthor] = useState<string>('Shahroz Khan');

  // Featured Media & Social Thumbnail State
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [imageAlt, setImageAlt] = useState<string>('');
  const [mediaUploadTab, setMediaUploadTab] = useState<'upload' | 'url'>('upload');
  const [isDraggingFeatured, setIsDraggingFeatured] = useState<boolean>(false);
  const featuredFileInputRef = useRef<HTMLInputElement>(null);

  // Inline Image Inserter Modal State
  const [isInlineImgModalOpen, setIsInlineImgModalOpen] = useState<boolean>(false);
  const [inlineImgUrl, setInlineImgUrl] = useState<string>('');
  const [inlineImgAlt, setInlineImgAlt] = useState<string>('');
  const [inlineImgTab, setInlineImgTab] = useState<'upload' | 'url'>('upload');
  const [isDraggingInline, setIsDraggingInline] = useState<boolean>(false);
  const inlineFileInputRef = useRef<HTMLInputElement>(null);

  const [postBody, setPostBody] = useState<string>(`## Introduction

Calculating accurately in modern digital workflows requires fast, browser-native computation without server latency or data leaks.

## Why Fast Client-Side Calculation Matters

1. **Instant Execution**: Runs immediately in browser memory.
2. **Total Privacy**: Sensitive financial and engineering inputs never leave your device.
3. **Offline Availability**: Fully usable even during network outages.

### Key Calculation Formula

Use the formula below for optimal projections:

$$\\text{Result} = P \\times (1 + r)^t$$

## Frequently Asked Questions

### What is the most accurate calculation method?
Using standardized formulas with high-precision floating point arithmetic ensures sub-cent precision across all parameters.`);
  const [previewMode, setPreviewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [savedPosts, setSavedPosts] = useState<BlogPost[]>([]);
  const [editingPostSlug, setEditingPostSlug] = useState<string | null>(null);

  // Helper: Format string into clean kebab-case slug (WordPress style)
  const formatToKebabSlug = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove diacritics / accents
      .replace(/&+/g, 'and') // replace & with and
      .replace(/[^a-z0-9]+/g, '-') // convert all non-alphanumeric to hyphens
      .replace(/-+/g, '-') // collapse consecutive hyphens
      .replace(/^-+|-+$/g, ''); // strip leading and trailing hyphens
  };

  // Load existing blog posts
  const loadBlogPosts = () => {
    invalidateBlogCache();
    const all = getAllBlogPosts();
    setSavedPosts(all);
  };

  useEffect(() => {
    loadBlogPosts();
  }, []);

  // WordPress-style Automated Real-Time Slug Sync from Title
  useEffect(() => {
    if (!isSlugLocked && postTitle) {
      const generated = formatToKebabSlug(postTitle);
      setPostSlug(generated);
    }
  }, [postTitle, isSlugLocked]);

  // Image Upload helper (converts image file to Base64 data URL for offline client storage)
  const handleProcessImageFile = (file: File, onSuccess: (dataUrl: string) => void) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP, SVG, GIF)', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size is too large (Maximum 5MB)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        onSuccess(e.target.result);
        showToast('Image loaded and converted to high-speed data stream!', 'success');
      }
    };
    reader.onerror = () => {
      showToast('Error reading image file', 'error');
    };
    reader.readAsDataURL(file);
  };

  // Real-time SEO Analysis
  const seoResult: SeoAnalysisResult = useMemo(() => {
    return analyzePostSeo(postTitle, postMetaDescription, postSlug, postFocusKeyword, postBody);
  }, [postTitle, postMetaDescription, postSlug, postFocusKeyword, postBody]);

  // Handle Save / Publish Blog Post
  const handlePublishPost = () => {
    if (!postTitle.trim()) {
      showToast('Please enter an article title', 'error');
      return;
    }
    if (!postSlug.trim()) {
      showToast('Please specify a URL slug', 'error');
      return;
    }

    const cleanSlug = formatToKebabSlug(postSlug) || 'article';
    const cleanImg = featuredImage.trim() || undefined;
    const cleanAlt = imageAlt.trim() || postTitle.trim();

    const newPost: BlogPost = {
      slug: cleanSlug,
      title: postTitle.trim(),
      metaDescription: postMetaDescription.trim() || postBody.slice(0, 150),
      focusKeyword: postFocusKeyword.trim(),
      publishedAt: new Date().toISOString(),
      formattedDate: formatBlogDate(new Date().toISOString()),
      category: postCategory,
      coverImage: cleanImg,
      featuredImage: cleanImg,
      coverImageAlt: cleanAlt,
      imageAlt: cleanAlt,
      author: postAuthor.trim() || 'Shahroz Khan',
      authorRole: 'Founder & Lead Developer',
      body: postBody,
      readTime: `${Math.max(1, Math.ceil(postBody.split(/\s+/).length / 200))} min read`,
      wordCount: postBody.split(/\s+/).filter(Boolean).length,
      isFeatured: false,
      headings: []
    };

    try {
      const rawCurrent = localStorage.getItem(CUSTOM_POSTS_STORAGE_KEY);
      let list: BlogPost[] = rawCurrent ? JSON.parse(rawCurrent) : [];
      if (!Array.isArray(list)) list = [];

      const existingIndex = list.findIndex((p) => p.slug === newPost.slug);
      if (existingIndex >= 0) {
        list[existingIndex] = newPost;
      } else {
        list = [newPost, ...list];
      }

      localStorage.setItem(CUSTOM_POSTS_STORAGE_KEY, JSON.stringify(list));
      loadBlogPosts();
      showToast(`Article "${newPost.title}" published & saved successfully!`, 'success');
      setEditingPostSlug(newPost.slug);
    } catch (err) {
      console.error(err);
      showToast('Failed to save post to localStorage', 'error');
    }
  };

  const handleCopyMarkdown = () => {
    const cleanImg = featuredImage.trim();
    const cleanAlt = imageAlt.trim() || postTitle.trim();

    const fullMarkdown = `---
title: "${postTitle.replace(/"/g, '\\"')}"
slug: "${postSlug}"
category: "${postCategory}"
featuredImage: "${cleanImg}"
imageAlt: "${cleanAlt.replace(/"/g, '\\"')}"
coverImage: "${cleanImg}"
coverImageAlt: "${cleanAlt.replace(/"/g, '\\"')}"
metaDescription: "${postMetaDescription.replace(/"/g, '\\"')}"
focusKeyword: "${postFocusKeyword.replace(/"/g, '\\"')}"
author: "${postAuthor.replace(/"/g, '\\"')}"
publishedAt: "${new Date().toISOString()}"
---

${postBody}`;

    navigator.clipboard.writeText(fullMarkdown);
    showToast('Formatted Markdown with YAML Frontmatter copied to clipboard!', 'success');
  };

  const handleDownloadMarkdown = () => {
    const cleanImg = featuredImage.trim();
    const cleanAlt = imageAlt.trim() || postTitle.trim();

    const fullMarkdown = `---
title: "${postTitle.replace(/"/g, '\\"')}"
slug: "${postSlug}"
category: "${postCategory}"
featuredImage: "${cleanImg}"
imageAlt: "${cleanAlt.replace(/"/g, '\\"')}"
coverImage: "${cleanImg}"
coverImageAlt: "${cleanAlt.replace(/"/g, '\\"')}"
metaDescription: "${postMetaDescription.replace(/"/g, '\\"')}"
focusKeyword: "${postFocusKeyword.replace(/"/g, '\\"')}"
author: "${postAuthor.replace(/"/g, '\\"')}"
publishedAt: "${new Date().toISOString()}"
---

${postBody}`;

    const blob = new Blob([fullMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${postSlug || 'article'}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${postSlug || 'article'}.md`, 'success');
  };

  const handleLoadPostToEdit = (post: BlogPost) => {
    setPostTitle(post.title);
    setPostSlug(post.slug);
    setIsSlugLocked(true); // lock slug on load to prevent accidental overwrite
    setPostCategory(post.category);
    setFeaturedImage(post.featuredImage || post.coverImage || '');
    setImageAlt(post.imageAlt || post.coverImageAlt || '');
    setPostMetaDescription(post.metaDescription);
    setPostFocusKeyword(post.focusKeyword || '');
    setPostAuthor(post.author || 'Shahroz Khan');
    setPostBody(post.body);
    setEditingPostSlug(post.slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Loaded "${post.title}" into editor`, 'info');
  };

  const handleDeletePost = (slug: string) => {
    if (!window.confirm(`Are you sure you want to delete post "${slug}"?`)) return;
    try {
      const rawCurrent = localStorage.getItem(CUSTOM_POSTS_STORAGE_KEY);
      if (rawCurrent) {
        let list: BlogPost[] = JSON.parse(rawCurrent);
        list = list.filter((p) => p.slug !== slug);
        localStorage.setItem(CUSTOM_POSTS_STORAGE_KEY, JSON.stringify(list));
      }
      loadBlogPosts();
      if (editingPostSlug === slug) {
        setEditingPostSlug(null);
      }
      showToast(`Post "${slug}" removed from local storage`, 'info');
    } catch (e) {
      console.error(e);
    }
  };

  // Insert formatting snippet into markdown body
  const insertMarkdownSnippet = (snippet: string) => {
    setPostBody((prev) => prev + '\n\n' + snippet);
  };

  // Handle inserting inline image modal confirmation
  const handleInsertInlineImage = () => {
    if (!inlineImgUrl.trim()) {
      showToast('Please upload an image or provide an Image URL', 'error');
      return;
    }
    const alt = inlineImgAlt.trim() || 'Article illustration';
    const markdownImg = `\n\n![${alt}](${inlineImgUrl.trim()})\n\n`;
    setPostBody((prev) => prev + markdownImg);
    setIsInlineImgModalOpen(false);
    setInlineImgUrl('');
    setInlineImgAlt('');
    showToast('Inline image inserted into markdown body!', 'success');
  };

  // ==========================================
  // TAB 2: ADD NEW CALCULATOR / TOOL ENGINE
  // ==========================================
  const [toolName, setToolName] = useState<string>('');
  const [toolSlug, setToolSlug] = useState<string>('');
  const [isToolSlugManual, setIsToolSlugManual] = useState<boolean>(false);
  const [toolCategory, setToolCategory] = useState<string>('financial-calculators');
  const [toolComplexity, setToolComplexity] = useState<'Easy' | 'Medium' | 'Advanced'>('Medium');
  const [toolDescription, setToolDescription] = useState<string>('');
  const [toolOutputLabel, setToolOutputLabel] = useState<string>('Calculated Value');
  const [toolOutputPrefix, setToolOutputPrefix] = useState<string>('$');
  const [toolOutputSuffix, setToolOutputSuffix] = useState<string>('');
  const [toolFormula, setToolFormula] = useState<string>(`// Dynamic Calculation Logic
// Available arguments: params (key-value dictionary from your parameter inputs)
const p = Number(params.principal) || 10000;
const r = (Number(params.rate) || 7.5) / 100;
const t = Number(params.years) || 5;

const futureValue = p * Math.pow(1 + r, t);
const interestEarned = futureValue - p;

return {
  primaryResult: futureValue.toFixed(2),
  primaryUnit: '$',
  summary: \`Over \${t} years, total interest earned equals $\${interestEarned.toFixed(2)}\`,
  metrics: [
    { label: 'Initial Principal', value: \`$\${p.toLocaleString()}\` },
    { label: 'Total Interest', value: \`$\${interestEarned.toFixed(2)}\` },
    { label: 'Effective Growth', value: \`+\${((interestEarned / p) * 100).toFixed(1)}%\` }
  ]
};`);

  const [toolParams, setToolParams] = useState<CustomToolParam[]>([
    {
      id: 'principal',
      label: 'Initial Principal Amount',
      type: 'number',
      defaultValue: 10000,
      min: 100,
      max: 10000000,
      step: 500,
      prefix: '$',
      hint: 'Starting investment amount'
    },
    {
      id: 'rate',
      label: 'Annual Interest Rate',
      type: 'slider',
      defaultValue: 7.5,
      min: 0.1,
      max: 30,
      step: 0.1,
      suffix: '%',
      hint: 'Expected annual growth rate'
    },
    {
      id: 'years',
      label: 'Investment Timeframe',
      type: 'number',
      defaultValue: 5,
      min: 1,
      max: 50,
      step: 1,
      suffix: ' years',
      hint: 'Total holding duration'
    }
  ]);

  const [toolFaqs, setToolFaqs] = useState<{ question: string; answer: string }[]>([
    {
      question: 'How is this calculation computed?',
      answer: 'This calculation is computed client-side using deterministic financial and mathematical formulas with zero server lag.'
    },
    {
      question: 'Is my calculation data private?',
      answer: 'Yes, 100% of calculation steps execute locally in your web browser. No parameters are logged or transmitted.'
    }
  ]);

  const [customToolsList, setCustomToolsList] = useState<CustomToolDefinition[]>([]);
  const [editingCustomToolId, setEditingCustomToolId] = useState<string | null>(null);

  const loadCustomTools = () => {
    const list = getStoredCustomTools();
    setCustomToolsList(list);
  };

  useEffect(() => {
    loadCustomTools();
  }, []);

  // Auto-slug for tool
  useEffect(() => {
    if (!isToolSlugManual && toolName) {
      const slug = toolName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setToolSlug(slug);
    }
  }, [toolName, isToolSlugManual]);

  const handleAddParam = () => {
    const newId = `param_${toolParams.length + 1}`;
    setToolParams([
      ...toolParams,
      {
        id: newId,
        label: `Parameter ${toolParams.length + 1}`,
        type: 'number',
        defaultValue: 100,
        min: 0,
        max: 100000,
        step: 1,
        hint: 'Input parameter description'
      }
    ]);
  };

  const handleRemoveParam = (index: number) => {
    setToolParams(toolParams.filter((_, i) => i !== index));
  };

  const handleUpdateParam = (index: number, updates: Partial<CustomToolParam>) => {
    setToolParams(
      toolParams.map((p, i) => (i === index ? { ...p, ...updates } : p))
    );
  };

  const handleAddFaq = () => {
    setToolFaqs([
      ...toolFaqs,
      { question: 'Frequently Asked Question', answer: 'Clear, concise explanation with calculation details.' }
    ]);
  };

  const handleRemoveFaq = (index: number) => {
    setToolFaqs(toolFaqs.filter((_, i) => i !== index));
  };

  const handleUpdateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    setToolFaqs(
      toolFaqs.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq))
    );
  };

  const handleSaveCalculator = () => {
    if (!toolName.trim()) {
      showToast('Please enter a Calculator Name', 'error');
      return;
    }
    if (!toolSlug.trim()) {
      showToast('Please enter a URL Slug', 'error');
      return;
    }
    if (toolParams.length === 0) {
      showToast('Please add at least one input parameter', 'error');
      return;
    }

    const newCustomTool: CustomToolDefinition = {
      id: editingCustomToolId || `tool-custom-${Date.now()}`,
      name: toolName.trim(),
      slug: toolSlug.toLowerCase().trim(),
      category: toolCategory,
      description: toolDescription.trim() || `Instant, client-side ${toolName} with high precision mathematical modeling.`,
      complexity: toolComplexity,
      readTime: 'Instant (0s)',
      tags: [toolCategory, 'calculator', 'online tool', 'custom'],
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: 'Shahroz Khan',
      formulaLogic: toolFormula,
      parameters: toolParams,
      outputLabel: toolOutputLabel,
      outputPrefix: toolOutputPrefix,
      outputSuffix: toolOutputSuffix,
      metaTitle: `${toolName} - Fast, Free & 100% Client-Side | QuickCalc`,
      metaDescription: toolDescription || `Use our free, instant ${toolName} online. High precision output with zero server latency.`,
      faqs: toolFaqs,
      rating: 4.9,
      useCount: '1.2k'
    };

    saveCustomTool(newCustomTool);
    loadCustomTools();
    setEditingCustomToolId(newCustomTool.id);
    showToast(`Calculator "${newCustomTool.name}" deployed successfully to /tools/${newCustomTool.slug}!`, 'success');
  };

  const handleLoadToolToEdit = (t: CustomToolDefinition) => {
    setEditingCustomToolId(t.id);
    setToolName(t.name);
    setToolSlug(t.slug);
    setIsToolSlugManual(true);
    setToolCategory(t.category);
    setToolComplexity(t.complexity);
    setToolDescription(t.description);
    setToolOutputLabel(t.outputLabel || 'Calculated Value');
    setToolOutputPrefix(t.outputPrefix || '$');
    setToolOutputSuffix(t.outputSuffix || '');
    setToolFormula(t.formulaLogic || '');
    setToolParams(t.parameters || []);
    setToolFaqs(t.faqs || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Loaded "${t.name}" into builder`, 'info');
  };

  const handleDeleteTool = (id: string, name: string) => {
    if (!window.confirm(`Delete calculator "${name}"?`)) return;
    deleteCustomTool(id);
    loadCustomTools();
    if (editingCustomToolId === id) {
      setEditingCustomToolId(null);
    }
    showToast(`Calculator "${name}" deleted.`, 'info');
  };

  const handleToggleToolActive = (t: CustomToolDefinition) => {
    const nextStatus = t.status === 'active' ? 'disabled' : 'active';
    toggleCustomToolStatus(t.id, nextStatus);
    loadCustomTools();
    showToast(`Tool marked as ${nextStatus}.`, 'info');
  };

  // ==========================================
  // TAB 3: CATEGORY MANAGER & DYNAMIC TAXONOMY
  // ==========================================
  const [categoriesList, setCategoriesList] = useState<CustomCategoryItem[]>([]);
  const [newCatName, setNewCatName] = useState<string>('');
  const [newCatSlug, setNewCatSlug] = useState<string>('');
  const [newCatDesc, setNewCatDesc] = useState<string>('');
  const [newCatColor, setNewCatColor] = useState<string>('purple');
  const [isCatSlugLocked, setIsCatSlugLocked] = useState<boolean>(false);

  // Dynamic Category Loader (clean slate from persistent storage)
  const loadAllCategories = () => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(CUSTOM_CATEGORIES_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const list: CustomCategoryItem[] = parsed
              .filter((c) => c && typeof c === 'object' && (c.name || c.id))
              .map((item) => {
                const name = item.name ? item.name.trim() : (item.id || 'Category');
                const slug = item.slug ? item.slug.trim() : (item.id || formatCategorySlug(name));
                return {
                  id: slug,
                  name,
                  slug,
                  description: item.description ? item.description.trim() : `${name} calculation guides and tools.`,
                  badgeColor: item.badgeColor || item.color || 'purple',
                  color: item.badgeColor || item.color || 'purple',
                  iconName: item.iconName || 'Tag',
                  postCount: typeof item.postCount === 'number' ? item.postCount : 0,
                  isCustom: true
                };
              });
            setCategoriesList(list);

            // Auto-select category for post writer if default
            if (list.length > 0) {
              setPostCategory((prev) => (!prev || prev === 'General' || prev === 'SEO Tools' ? list[0].name : prev));
            }
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    setCategoriesList([]);
  };

  useEffect(() => {
    loadAllCategories();
  }, []);

  // Real-time WordPress-Style Auto-Slug Sync as user types Category Name
  useEffect(() => {
    if (!isCatSlugLocked && newCatName) {
      const generated = formatCategorySlug(newCatName);
      setNewCatSlug(generated);
    } else if (!isCatSlugLocked && !newCatName) {
      setNewCatSlug('');
    }
  }, [newCatName, isCatSlugLocked]);

  // Handle Save Category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newCatName.trim();
    const cleanSlug = (newCatSlug || formatCategorySlug(cleanName)).trim();

    // 1. Validate non-empty Name and Slug
    if (!cleanName) {
      showToast('Please enter a Category Name', 'error');
      return;
    }
    if (!cleanSlug) {
      showToast('Please enter or generate a valid URL Slug', 'error');
      return;
    }

    // 2. Append the new category object
    const newCatItem: CustomCategoryItem = {
      id: cleanSlug,
      name: cleanName,
      slug: cleanSlug,
      description: newCatDesc.trim() || `${cleanName} high-precision calculation utilities and guides.`,
      badgeColor: newCatColor,
      color: newCatColor,
      iconName: 'Tag',
      postCount: 0,
      isCustom: true
    };

    try {
      const raw = localStorage.getItem(CUSTOM_CATEGORIES_STORAGE_KEY);
      let list: CustomCategoryItem[] = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) list = [];

      // Avoid duplicates: remove if slug or name already exists
      list = [
        ...list.filter(
          (c) => (c.slug || c.id) !== newCatItem.slug && c.name.toLowerCase() !== newCatItem.name.toLowerCase()
        ),
        newCatItem
      ];

      localStorage.setItem(CUSTOM_CATEGORIES_STORAGE_KEY, JSON.stringify(list));
      setCategoriesList(list);

      // 3. Clear the input form fields for the next entry
      setNewCatName('');
      setNewCatSlug('');
      setNewCatDesc('');
      setIsCatSlugLocked(false);

      if (postCategory === 'General' || !postCategory) {
        setPostCategory(newCatItem.name);
      }

      // 5. Show a success toast/notification
      showToast(`✅ Category "${newCatItem.name}" created successfully!`, 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to save category to local storage', 'error');
    }
  };

  const handleDeleteCategory = (slugOrId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      const raw = localStorage.getItem(CUSTOM_CATEGORIES_STORAGE_KEY);
      if (raw) {
        let list: CustomCategoryItem[] = JSON.parse(raw);
        list = list.filter((c) => (c.slug || c.id) !== slugOrId && c.name !== name);
        localStorage.setItem(CUSTOM_CATEGORIES_STORAGE_KEY, JSON.stringify(list));
        setCategoriesList(list);
      }
      showToast(`Category "${name}" removed.`, 'info');
    } catch (e) {
      console.error(e);
      showToast('Failed to delete category', 'error');
    }
  };

  // ==========================================
  // UN-AUTHENTICATED: PIN LOGIN VIEW
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans selection:bg-cyan-500 selection:text-slate-950">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl shadow-cyan-950/40 relative overflow-hidden backdrop-blur-xl">
          {/* Soft ambient glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-xl shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Zap className="w-7 h-7 text-cyan-400" />
              </div>
            </div>

            <div>
              <h1 className="text-xl font-bold text-white tracking-tight font-mono">
                ⚡ QuickCalc Control Panel
              </h1>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Isolated Admin Gateway · Protected Workspace
              </p>
            </div>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>Enter Admin Security PIN</span>
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError('');
                }}
                placeholder="Enter 4-digit PIN (default: 8899)"
                maxLength={8}
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-center text-lg tracking-widest focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600 placeholder:text-sm placeholder:tracking-normal"
              />
              {pinError && (
                <div className="mt-2 text-xs font-mono text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-mono text-sm font-semibold shadow-lg shadow-cyan-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500">
            <button
              onClick={onGoHome}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowRight className="w-3 h-3 rotate-180" />
              <span>Return to Public Site</span>
            </button>
            <span>PIN hint: 8899</span>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // AUTHENTICATED: ISOLATED FULL-SCREEN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col md:flex-row antialiased font-sans selection:bg-cyan-500 selection:text-slate-950 select-text">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md flex items-center gap-3 font-mono text-xs animate-in slide-in-from-top-2 duration-200 ${
            toastMessage.type === 'error'
              ? 'bg-rose-950/90 border-rose-700 text-rose-200'
              : toastMessage.type === 'info'
              ? 'bg-indigo-950/90 border-indigo-700 text-indigo-200'
              : 'bg-emerald-950/90 border-emerald-700 text-emerald-200'
          }`}
        >
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SIDEBAR NAVIGATION (Desktop: Sticky Sidebar, Mobile: Top Nav Bar) */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-64 bg-slate-900/90 border-b md:border-b-0 md:border-r border-slate-800/90 shrink-0 flex flex-col justify-between p-4 md:p-5 z-20">
        <div className="space-y-6">
          {/* Logo & Status */}
          <div className="flex items-center justify-between md:justify-start gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 p-0.5 shadow-lg shadow-cyan-500/20 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Zap className="w-4.5 h-4.5 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="font-mono font-bold text-sm text-white tracking-tight block">
                  ⚡ QuickCalc
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                  Control Panel
                </span>
              </div>
            </div>

            {/* Status indicator */}
            <div className="inline-flex md:hidden items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800/80 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE</span>
            </div>
          </div>

          {/* Core Navigation Tabs (3 Tabs Required) */}
          <nav className="space-y-1.5 pt-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 pb-1">
              Core Modules
            </div>

            {/* Tab 1: Write & Publish Post */}
            <button
              onClick={() => setActiveTab('posts')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all cursor-pointer text-left ${
                activeTab === 'posts'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <PenTool className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>✍️ Write & Publish Post</span>
            </button>

            {/* Tab 2: Add New Calculator */}
            <button
              onClick={() => setActiveTab('tools')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all cursor-pointer text-left ${
                activeTab === 'tools'
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Wrench className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>🛠️ Add Calculator</span>
            </button>

            {/* Tab 3: Manage Categories */}
            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all cursor-pointer text-left ${
                activeTab === 'categories'
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/40 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Tag className="w-4 h-4 text-purple-400 shrink-0" />
              <span>🏷️ Manage Categories</span>
            </button>

            {/* Tab 4: Settings & SEO & Analytics */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all cursor-pointer text-left ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>⚙️ Settings & GA</span>
            </button>
          </nav>
        </div>

        {/* Action Buttons: View Live Site & Logout */}
        <div className="pt-6 border-t border-slate-800/80 space-y-2 mt-4 md:mt-0">
          <button
            onClick={onGoHome}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm group"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span>View Live Site</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-xs font-mono text-rose-300 hover:text-rose-200 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock & Logout</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <main className="flex-1 overflow-y-auto max-h-screen p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* ========================================================================= */}
        {/* TAB 1: ✍️ POST WRITING & PUBLISHING ENGINE */}
        {/* ========================================================================= */}
        {activeTab === 'posts' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Tab Header with Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
              <div>
                <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-cyan-400" />
                  <span>Post Writing & Publishing Engine</span>
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Write Markdown guides with real-time SEO scoring and instant 1-click publishing.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopyMarkdown}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  title="Copy formatted markdown to clipboard"
                >
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Copy Markdown</span>
                </button>

                <button
                  onClick={handleDownloadMarkdown}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  title="Download .md file"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Download .md</span>
                </button>

                <button
                  onClick={handlePublishPost}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-mono font-semibold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Publish Article</span>
                </button>
              </div>
            </div>

            {/* Post Metadata & Media Grid */}
            <div className="space-y-4">
              {/* Core Metadata Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80">
                {/* Title */}
                <div className="lg:col-span-2 space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                    Article Title (H1) <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="e.g. How to Calculate SIP Returns in 2026? Complete Mathematical Guide"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-medium focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                      Category
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTab('categories')}
                      className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      title="Manage categories"
                    >
                      <Plus className="w-3 h-3" />
                      <span>New Category</span>
                    </button>
                  </div>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer"
                  >
                    {categoriesList.length === 0 ? (
                      <option value="General">General (Default)</option>
                    ) : (
                      categoriesList.map((c) => (
                        <option key={c.id || c.slug} value={c.name}>
                          {c.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* WordPress-Style Automated Permalink / URL Slug */}
                <div className="lg:col-span-3 bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      <label className="text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">
                        URL Permalink Slug
                      </label>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border bg-slate-900 text-slate-400 border-slate-800">
                        quickcalc.in/blog/<strong>{postSlug || 'permalink-slug'}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isSlugLocked ? (
                        <button
                          type="button"
                          onClick={() => setIsSlugLocked(true)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-emerald-950/50 border border-emerald-800/80 text-emerald-400 hover:bg-emerald-900/60 transition-all cursor-pointer"
                          title="Click to lock slug and edit manually"
                        >
                          <Zap className="w-3 h-3 text-emerald-400 animate-pulse" />
                          <span>Auto-Sync Active (Click to Lock)</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setIsSlugLocked(false);
                            setPostSlug(formatToKebabSlug(postTitle));
                            showToast('Re-synced slug with Article Title', 'info');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-amber-950/50 border border-amber-800/80 text-amber-300 hover:bg-amber-900/60 transition-all cursor-pointer"
                          title="Click to re-enable automated sync from title"
                        >
                          <Lock className="w-3 h-3 text-amber-400" />
                          <span>Slug Locked (Click to Auto-Sync)</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={postSlug}
                        onChange={(e) => {
                          setPostSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
                          setIsSlugLocked(true);
                        }}
                        placeholder="how-to-calculate-sip-returns-in-2026"
                        className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                    {isSlugLocked && (
                      <button
                        type="button"
                        onClick={() => {
                          setPostSlug(formatToKebabSlug(postTitle));
                          showToast('Slug updated from title', 'info');
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-1"
                        title="Re-generate slug from title"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Re-Sync</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Target Focus Keyword */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Target Focus Keyword</span>
                  </label>
                  <input
                    type="text"
                    value={postFocusKeyword}
                    onChange={(e) => setPostFocusKeyword(e.target.value)}
                    placeholder="e.g. calculate sip returns"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500 transition-all placeholder:text-slate-600"
                  />
                </div>

                {/* Author */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={postAuthor}
                    onChange={(e) => setPostAuthor(e.target.value)}
                    placeholder="Shahroz Khan"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>

                {/* Reading Time Preview */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                    Calculated Word Count & Read Time
                  </label>
                  <div className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                    <span>{seoResult.words} words</span>
                    <span className="text-cyan-400">~{seoResult.readingTimeMinutes} min read</span>
                  </div>
                </div>

                {/* Meta Description */}
                <div className="lg:col-span-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                      Meta Description (SEO SERP Snippet)
                    </label>
                    <span
                      className={`text-[11px] font-mono ${
                        postMetaDescription.length >= 120 && postMetaDescription.length <= 160
                          ? 'text-emerald-400 font-semibold'
                          : 'text-slate-500'
                      }`}
                    >
                      {postMetaDescription.length} / 160 chars
                    </span>
                  </div>
                  <textarea
                    value={postMetaDescription}
                    onChange={(e) => setPostMetaDescription(e.target.value)}
                    rows={2}
                    placeholder="Compelling 140-160 character summary that appears in Google search snippets..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-all resize-none"
                  />
                </div>
              </div>

              {/* FEATURED MEDIA & SOCIAL THUMBNAIL MANAGEMENT BOX */}
              <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-mono text-slate-200 uppercase tracking-wider font-bold">
                      Featured Image & Social Card (OG Image)
                    </h3>
                  </div>

                  {featuredImage ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/80">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Featured Image Attached</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-500">
                      Optional · Recommended for Social Shares & Google Discover
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left Column: Upload / URL Controls & Alt Text */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Dual Mode Switcher */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-fit text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => setMediaUploadTab('upload')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          mediaUploadTab === 'upload'
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File (Base64)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setMediaUploadTab('url')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          mediaUploadTab === 'url'
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>Direct Image URL</span>
                      </button>
                    </div>

                    {/* Mode 1: Drag & Drop / File Picker */}
                    {mediaUploadTab === 'upload' && (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingFeatured(true);
                        }}
                        onDragLeave={() => setIsDraggingFeatured(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingFeatured(false);
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleProcessImageFile(e.dataTransfer.files[0], (dataUrl) => {
                              setFeaturedImage(dataUrl);
                            });
                          }
                        }}
                        onClick={() => featuredFileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                          isDraggingFeatured
                            ? 'border-cyan-400 bg-cyan-950/30'
                            : 'border-slate-800 hover:border-slate-700 bg-slate-950/60'
                        }`}
                      >
                        <input
                          ref={featuredFileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleProcessImageFile(e.target.files[0], (dataUrl) => {
                                setFeaturedImage(dataUrl);
                              });
                            }
                          }}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-cyan-950/60 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-mono text-slate-200 font-semibold">
                              Click to browse or drag & drop image
                            </p>
                            <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                              PNG, JPG, WebP, SVG or GIF (Max 5MB) · Auto-converts to stream
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mode 2: Direct Image URL */}
                    {mediaUploadTab === 'url' && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-slate-300">
                          External Image URL (CDN / Unsplash / Local Asset)
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            value={featuredImage}
                            onChange={(e) => setFeaturedImage(e.target.value)}
                            placeholder="https://images.unsplash.com/photo-... or /images/banner.webp"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600"
                          />
                        </div>
                      </div>
                    )}

                    {/* Image Alt Text Field */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                          Image Alt Text (SEO & Accessibility)
                        </label>
                        <span className="text-[10px] font-mono text-slate-500">
                          {imageAlt.length} chars
                        </span>
                      </div>
                      <input
                        type="text"
                        value={imageAlt}
                        onChange={(e) => setImageAlt(e.target.value)}
                        placeholder="e.g. SIP Calculation Return Chart Comparison Graph 2026"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-600"
                      />
                      <p className="text-[10px] font-mono text-slate-500">
                        Crucial for Google Image SEO rankings and screen-reader accessibility.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: High-Fidelity Preview Box */}
                  <div className="lg:col-span-5 flex flex-col">
                    <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                      Live Preview & Status
                    </label>

                    {featuredImage ? (
                      <div className="relative flex-1 min-h-[180px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col justify-between group shadow-lg">
                        <div className="relative aspect-[16/9] w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                          <img
                            src={featuredImage}
                            alt={imageAlt || 'Featured Preview'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>

                        <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-2">
                          <div className="truncate">
                            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">
                              {featuredImage.startsWith('data:') ? 'Base64 Local Image' : 'Remote Image Link'}
                            </span>
                            <p className="text-xs text-slate-300 font-mono truncate">
                              {imageAlt || 'No Alt Text specified'}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setFeaturedImage('');
                                setImageAlt('');
                                showToast('Featured Image cleared', 'info');
                              }}
                              className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 transition-colors cursor-pointer"
                              title="Remove Featured Image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 min-h-[180px] rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 flex flex-col items-center justify-center p-6 text-center text-slate-500">
                        <FileImage className="w-8 h-8 opacity-40 mb-2" />
                        <span className="text-xs font-mono">No featured image selected</span>
                        <span className="text-[10px] font-mono text-slate-600 mt-1">
                          Upload a file or enter an image URL to preview
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Saved Articles Management Drawer */}
            <div className="pt-6 border-t border-slate-800/80 space-y-3">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Published & Stored Articles ({savedPosts.length})</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {savedPosts.map((post) => (
                  <div
                    key={post.slug}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                        <span className="text-cyan-400">{post.category}</span>
                        <span>{post.formattedDate || 'Live'}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-2">{post.title}</h4>
                      <p className="text-[11px] font-mono text-slate-500 mt-1">/blog/{post.slug}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => handleLoadPostToEdit(post)}
                        className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit in Form</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {onNavigateBlog && (
                          <button
                            onClick={() => onNavigateBlog(post.slug)}
                            className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                            title="View live post"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePost(post.slug)}
                          className="text-xs font-mono text-rose-400 hover:text-rose-300 cursor-pointer"
                          title="Delete post"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: 🛠️ ADD NEW CALCULATOR / TOOL ENGINE */}
        {/* ========================================================================= */}
        {activeTab === 'tools' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
              <div>
                <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-indigo-400" />
                  <span>Add New Calculator & Tool Engine</span>
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Build zero-server-lag interactive tools with dynamic inputs and JavaScript computation logic.
                </p>
              </div>

              <button
                onClick={handleSaveCalculator}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 hover:from-indigo-400 hover:to-pink-500 text-white text-xs font-mono font-semibold shadow-lg shadow-indigo-500/25 transition-all cursor-pointer flex items-center gap-2 active:scale-95 self-start sm:self-auto"
              >
                <Save className="w-4 h-4" />
                <span>Save & Deploy Calculator</span>
              </button>
            </div>

            {/* General Tool Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80">
              {/* Tool Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                  Calculator Name <span className="text-indigo-400">*</span>
                </label>
                <input
                  type="text"
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  placeholder="e.g. High-Yield Savings Calculator"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-medium focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              {/* URL Slug */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                    URL Slug
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsToolSlugManual(!isToolSlugManual)}
                    className="text-[10px] font-mono text-indigo-400 hover:underline cursor-pointer"
                  >
                    {isToolSlugManual ? 'Reset Auto' : 'Manual Edit'}
                  </button>
                </div>
                <input
                  type="text"
                  value={toolSlug}
                  onChange={(e) => {
                    setToolSlug(e.target.value);
                    setIsToolSlugManual(true);
                  }}
                  placeholder="high-yield-savings-calculator"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Category Select */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={toolCategory}
                  onChange={(e) => setToolCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-indigo-500 transition-all"
                >
                  <option value="financial-calculators">Financial & Tax Calculators</option>
                  <option value="math-utilities">Mathematical & Scientific</option>
                  <option value="developer-tools">Developer & Coding Tools</option>
                  <option value="seo-tools">SEO & Webmaster Tools</option>
                  <option value="text-analysis">Text & Writing Utilities</option>
                  <option value="unit-converters">Universal Unit Converters</option>
                  <option value="health-fitness">Health & Fitness</option>
                  {categoriesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Complexity */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                  Complexity Level
                </label>
                <select
                  value={toolComplexity}
                  onChange={(e) => setToolComplexity(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-indigo-500 transition-all"
                >
                  <option value="Easy">Easy (Single Step)</option>
                  <option value="Medium">Medium (Multi-variable)</option>
                  <option value="Advanced">Advanced (Matrix/Amortization)</option>
                </select>
              </div>

              {/* Primary Output Label */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                  Output Result Label
                </label>
                <input
                  type="text"
                  value={toolOutputLabel}
                  onChange={(e) => setToolOutputLabel(e.target.value)}
                  placeholder="Total Accumulated Balance"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Output Prefix / Suffix */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                    Prefix
                  </label>
                  <input
                    type="text"
                    value={toolOutputPrefix}
                    onChange={(e) => setToolOutputPrefix(e.target.value)}
                    placeholder="$"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 text-center"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                    Suffix
                  </label>
                  <input
                    type="text"
                    value={toolOutputSuffix}
                    onChange={(e) => setToolOutputSuffix(e.target.value)}
                    placeholder="USD"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 text-center"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="lg:col-span-3 space-y-1.5">
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                  Tool Description & Purpose
                </label>
                <textarea
                  value={toolDescription}
                  onChange={(e) => setToolDescription(e.target.value)}
                  rows={2}
                  placeholder="Ultra-fast, browser-native calculation tool designed to model compound growth with exact interest breakdown..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all resize-none"
                />
              </div>
            </div>

            {/* DYNAMIC PARAMETERS BUILDER */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    <span>Dynamic Input Parameters ({toolParams.length})</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Define fields rendered to users in the calculator input form.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddParam}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Parameter</span>
                </button>
              </div>

              <div className="space-y-3">
                {toolParams.map((param, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center"
                  >
                    {/* Param Key & Label */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">
                        Param Key (JS variable)
                      </label>
                      <input
                        type="text"
                        value={param.id}
                        onChange={(e) => handleUpdateParam(idx, { id: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300"
                        placeholder="principal"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">
                        UI Field Label
                      </label>
                      <input
                        type="text"
                        value={param.label}
                        onChange={(e) => handleUpdateParam(idx, { label: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                        placeholder="Initial Amount"
                      />
                    </div>

                    {/* Field Type */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">
                        Input Type
                      </label>
                      <select
                        value={param.type}
                        onChange={(e) => handleUpdateParam(idx, { type: e.target.value as any })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                      >
                        <option value="number">Number Box</option>
                        <option value="slider">Slider Bar</option>
                        <option value="text">Text Input</option>
                        <option value="select">Dropdown Select</option>
                      </select>
                    </div>

                    {/* Default Value */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">
                        Default Value
                      </label>
                      <input
                        type="text"
                        value={param.defaultValue}
                        onChange={(e) => handleUpdateParam(idx, { defaultValue: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200"
                        placeholder="1000"
                      />
                    </div>

                    {/* Remove Action */}
                    <div className="flex items-center justify-end pt-3 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => handleRemoveParam(idx)}
                        className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/50 cursor-pointer transition-colors"
                        title="Remove Parameter"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* JAVASCRIPT CALCULATION FORMULA BOX */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Code className="w-4 h-4 text-emerald-400" />
                    <span>Calculation Formula / JavaScript Logic</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Receives <code>params</code> object. Returns <code>{'{ primaryResult, primaryUnit, summary, metrics }'}</code>.
                  </p>
                </div>
              </div>

              <textarea
                value={toolFormula}
                onChange={(e) => setToolFormula(e.target.value)}
                rows={12}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed focus:outline-none focus:border-emerald-500 shadow-inner"
              />
            </div>

            {/* FAQS BUILDER */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-purple-400" />
                    <span>Tool FAQs & Schema Markup ({toolFaqs.length})</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Generates Google FAQPage Schema Markup automatically for search indexing.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-3">
                {toolFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-purple-400 uppercase">
                        Question #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(index)}
                        className="text-xs text-rose-400 hover:text-rose-300 font-mono cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>

                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleUpdateFaq(index, 'question', e.target.value)}
                      placeholder="Frequently Asked Question"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                    />

                    <textarea
                      value={faq.answer}
                      onChange={(e) => handleUpdateFaq(index, 'answer', e.target.value)}
                      rows={2}
                      placeholder="Concise answer..."
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Tools Catalog Manager */}
            <div className="pt-6 border-t border-slate-800/80 space-y-3">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Custom Created Tools ({customToolsList.length})</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {customToolsList.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                        <span className="text-indigo-400">{t.category}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full ${
                            t.status === 'active'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white">{t.name}</h4>
                      <p className="text-[11px] font-mono text-slate-500 mt-1">/tools/{t.slug}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-mono">
                      <button
                        onClick={() => handleLoadToolToEdit(t)}
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {onNavigateTool && (
                          <button
                            onClick={() => onNavigateTool(t.slug)}
                            className="text-slate-400 hover:text-white cursor-pointer"
                            title="Test live tool"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleToggleToolActive(t)}
                          className="text-slate-400 hover:text-cyan-300 cursor-pointer text-[10px]"
                        >
                          {t.status === 'active' ? 'Disable' : 'Enable'}
                        </button>

                        <button
                          onClick={() => handleDeleteTool(t.id, t.name)}
                          className="text-rose-400 hover:text-rose-300 cursor-pointer"
                          title="Delete tool"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: 🏷️ MANAGE CATEGORIES */}
        {/* ========================================================================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
              <div>
                <h2 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                  <Tag className="w-5 h-5 text-purple-400" />
                  <span>Category Manager & Dynamic Taxonomies</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/80 font-normal">
                    {categoriesList.length} Active
                  </span>
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Organize calculation engines, tools, and blog guides into custom topic silos with real-time auto-slug sync.
                </p>
              </div>
            </div>

            {/* Add New Category Form */}
            <form
              onSubmit={handleAddCategory}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <FolderPlus className="w-4 h-4 text-purple-400" />
                  <span>Create New Category</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  Clean Slate · Dynamic Local Persistence
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Category Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1">
                    <span>Category Name</span>
                    <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="e.g. Health & Fitness Tips"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium placeholder:text-slate-600"
                  />
                </div>

                {/* Slug with Auto-Sync & Lock */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1">
                      <span>URL Slug</span>
                      <span className="text-purple-400">*</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCatSlugLocked(!isCatSlugLocked);
                          if (isCatSlugLocked && newCatName) {
                            setNewCatSlug(formatCategorySlug(newCatName));
                          }
                        }}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1 border transition-all cursor-pointer ${
                          !isCatSlugLocked
                            ? 'bg-purple-950/60 text-purple-300 border-purple-800/80 hover:bg-purple-900/60'
                            : 'bg-amber-950/60 text-amber-300 border-amber-800/80 hover:bg-amber-900/60'
                        }`}
                        title={isCatSlugLocked ? 'Click to enable Auto-Sync' : 'Click to lock custom slug'}
                      >
                        {!isCatSlugLocked ? (
                          <>
                            <Unlock className="w-2.5 h-2.5" />
                            <span>Auto-Sync</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-2.5 h-2.5" />
                            <span>Manual (Locked)</span>
                          </>
                        )}
                      </button>
                      {isCatSlugLocked && newCatName && (
                        <button
                          type="button"
                          onClick={() => {
                            setNewCatSlug(formatCategorySlug(newCatName));
                            setIsCatSlugLocked(false);
                            showToast('Re-synced slug from Category Name', 'info');
                          }}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                          title="Re-sync slug from name"
                        >
                          <RefreshCw className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={newCatSlug}
                    onChange={(e) => {
                      setNewCatSlug(e.target.value);
                      setIsCatSlugLocked(true);
                    }}
                    placeholder="health-fitness-tips"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-purple-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                  />
                </div>

                {/* Accent Color Theme */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                    Badge Color Theme
                  </label>
                  <select
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
                  >
                    <option value="purple">Purple / Violet</option>
                    <option value="cyan">Cyan / Teal</option>
                    <option value="emerald">Emerald / Green</option>
                    <option value="indigo">Indigo / Blue</option>
                    <option value="amber">Amber / Gold</option>
                    <option value="rose">Rose / Pink</option>
                    <option value="sky">Sky / Azure</option>
                  </select>
                </div>

                {/* Description */}
                <div className="sm:col-span-2 lg:col-span-2 space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 uppercase tracking-wider">
                    Description & Editorial Summary
                  </label>
                  <input
                    type="text"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="e.g. Health tracking guides, dietary computations, and wellness algorithms."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-300 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                  />
                </div>

                {/* Submit button */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-semibold shadow-lg shadow-purple-600/25 cursor-pointer transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Category</span>
                  </button>
                </div>
              </div>

              {/* Permalink live preview bar */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                <span className="text-slate-500">Public Archive URL:</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-purple-400">
                  quickcalc.in/blog?category=<strong>{newCatSlug || 'category-slug'}</strong>
                </span>
                {!isCatSlugLocked && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Real-time WordPress-style auto slug generation active</span>
                  </span>
                )}
              </div>
            </form>

            {/* Existing Categories Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>Active Categories</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs">
                    {categoriesList.length}
                  </span>
                </h3>
              </div>

              {categoriesList.length === 0 ? (
                <div className="p-12 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-center mx-auto text-purple-400">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">No Categories Created Yet</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                      Your category state is clean. Use the form above to create your first category with real-time auto-slug generation.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoriesList.map((cat) => {
                    const postCount = savedPosts.filter(
                      (p) =>
                        p.category?.toLowerCase() === cat.name.toLowerCase() ||
                        p.category?.toLowerCase() === cat.slug.toLowerCase()
                    ).length;

                    const getBadgeClasses = (color: string) => {
                      switch (color) {
                        case 'emerald':
                          return 'bg-emerald-950/60 border-emerald-800 text-emerald-300';
                        case 'cyan':
                          return 'bg-cyan-950/60 border-cyan-800 text-cyan-300';
                        case 'indigo':
                          return 'bg-indigo-950/60 border-indigo-800 text-indigo-300';
                        case 'amber':
                          return 'bg-amber-950/60 border-amber-800 text-amber-300';
                        case 'rose':
                          return 'bg-rose-950/60 border-rose-800 text-rose-300';
                        case 'sky':
                          return 'bg-sky-950/60 border-sky-800 text-sky-300';
                        case 'purple':
                        default:
                          return 'bg-purple-950/60 border-purple-800 text-purple-300';
                      }
                    };

                    return (
                      <div
                        key={cat.id || cat.slug}
                        className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all shadow-lg group"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span
                              className={`px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold uppercase ${getBadgeClasses(
                                cat.badgeColor || cat.color || 'purple'
                              )}`}
                            >
                              {cat.name}
                            </span>
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-400">
                              {postCount} {postCount === 1 ? 'Article' : 'Articles'}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                            {cat.name}
                          </h4>

                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {cat.description || `${cat.name} calculation guides and tools.`}
                          </p>

                          <div className="text-[11px] font-mono text-slate-500 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800/80 flex items-center gap-1">
                            <Globe className="w-3 h-3 text-purple-400" />
                            <span className="text-purple-300 font-semibold">{cat.slug}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                          {onNavigateBlog && (
                            <button
                              type="button"
                              onClick={() => onNavigateBlog()}
                              className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                              title="View public blog archive"
                            >
                              <span>View Archive</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat.slug || cat.id, cat.name)}
                            className="text-xs font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer ml-auto px-2 py-1 rounded-lg hover:bg-rose-950/30 transition-all"
                            title="Delete category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ⚙️ SETTINGS, SEO & GOOGLE ANALYTICS */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="max-w-6xl space-y-6">
            <AdminSettingsTab
              settings={globalSettings}
              onSaveSettings={(updated) => {
                setGlobalSettings(updated);
                saveStoredGlobalSeoSettings(updated);
                showToast('Global Settings & Google Analytics configuration updated successfully!', 'success');
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
