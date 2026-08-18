import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Trash2,
  Eye,
  Sliders,
  Download,
  Upload,
  Copy,
  Check,
  Power,
  Sparkles,
  ExternalLink,
  Code,
  HelpCircle,
  Layers,
  FileCode,
  RefreshCw,
  X
} from 'lucide-react';
import { ToolItem, CATEGORIES } from '../../data/categoriesAndTools';
import {
  CustomToolDefinition,
  CustomToolParam,
  getStoredCustomTools,
  saveCustomTool,
  deleteCustomTool,
  toggleCustomToolStatus,
  getDisabledToolIds,
  toggleBuiltinToolDisabled,
  exportToolsRegistryJson,
  importToolsRegistryJson
} from '../../utils/customToolsStorage';

interface AdminToolsManagerTabProps {
  builtinTools: ToolItem[];
  onOpenLiveTool?: (toolSlug: string) => void;
  onShowToast: (msg: string) => void;
}

const DEFAULT_EMPTY_TOOL: CustomToolDefinition = {
  id: '',
  name: '',
  slug: '',
  category: 'financial-calculators',
  description: '',
  complexity: 'Easy',
  readTime: 'Instant',
  tags: [],
  status: 'active',
  createdAt: '',
  updatedAt: '',
  author: 'Shahroz Khan',
  formulaLogic: `// Execution formula: inputs are passed as object 'params'
// e.g., const { capital, rate, years } = params;
// return {
//   primaryResult: capital * Math.pow(1 + rate/100, years),
//   breakdown: [
//     { label: 'Total Invested', value: capital },
//     { label: 'Total Profit', value: (capital * Math.pow(1 + rate/100, years)) - capital }
//   ]
// };
const { investment, entryPrice, exitPrice, feePercent = 0.1 } = params;
const tokens = investment / (entryPrice || 1);
const grossReturn = tokens * (exitPrice || 0);
const feeAmount = (investment + grossReturn) * ((feePercent || 0) / 100);
const netProfit = grossReturn - investment - feeAmount;
const roiPercent = investment > 0 ? (netProfit / investment) * 100 : 0;

return {
  primaryResult: netProfit.toFixed(2),
  primaryUnit: '$',
  summary: \`Net Profit: $\${netProfit.toFixed(2)} (\${roiPercent.toFixed(2)}% ROI)\`,
  metrics: [
    { label: 'Total Tokens', value: tokens.toFixed(4) },
    { label: 'Gross Value', value: '$' + grossReturn.toFixed(2) },
    { label: 'Total Fees', value: '$' + feeAmount.toFixed(2) },
    { label: 'Net ROI %', value: roiPercent.toFixed(2) + '%' }
  ]
};`,
  parameters: [
    {
      id: 'investment',
      label: 'Initial Investment',
      type: 'number',
      defaultValue: 1000,
      min: 1,
      max: 10000000,
      step: 50,
      prefix: '$',
      hint: 'Amount of fiat or capital invested'
    },
    {
      id: 'entryPrice',
      label: 'Purchase / Entry Price',
      type: 'number',
      defaultValue: 2500,
      min: 0.00001,
      max: 1000000,
      step: 10,
      prefix: '$',
      hint: 'Asset purchase price per unit'
    },
    {
      id: 'exitPrice',
      label: 'Target / Exit Price',
      type: 'number',
      defaultValue: 3800,
      min: 0.00001,
      max: 1000000,
      step: 10,
      prefix: '$',
      hint: 'Expected or current selling price per unit'
    },
    {
      id: 'feePercent',
      label: 'Trading & Network Fee (%)',
      type: 'slider',
      defaultValue: 0.2,
      min: 0,
      max: 5,
      step: 0.05,
      suffix: '%',
      hint: 'Exchange transaction & gas fee estimate'
    }
  ],
  outputLabel: 'Net Estimated Profit',
  outputPrefix: '$',
  outputSuffix: '',
  metaTitle: 'Crypto Profit & Loss Calculator | Quick Calculator',
  metaDescription: 'Calculate cryptocurrency investment returns, net profit, exit values, and trading fee impact with instant browser-side precision.',
  faqs: [
    {
      question: 'How is the crypto profit and loss calculated?',
      answer: 'Profit is determined by finding the total acquired tokens at the entry price, computing the gross valuation at the target exit price, and deducting all associated exchange fees.'
    },
    {
      question: 'Is my financial calculation data private?',
      answer: 'Yes, 100% of calculations execute directly in your client browser without transmitting any financial numbers to external servers.'
    }
  ]
};

export default function AdminToolsManagerTab({
  builtinTools,
  onOpenLiveTool,
  onShowToast
}: AdminToolsManagerTabProps) {
  const [customTools, setCustomTools] = useState<CustomToolDefinition[]>(() => getStoredCustomTools());
  const [disabledIds, setDisabledIds] = useState<string[]>(() => getDisabledToolIds());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'custom' | 'builtin' | 'disabled'>('all');

  // Modal / Form state
  const [isEditorModalOpen, setIsEditorModalOpen] = useState<boolean>(false);
  const [editingTool, setEditingTool] = useState<CustomToolDefinition>(DEFAULT_EMPTY_TOOL);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const refreshToolState = () => {
    setCustomTools(getStoredCustomTools());
    setDisabledIds(getDisabledToolIds());
  };

  // Combine custom tools & builtin tools for tabular management
  const allManagedTools = useMemo(() => {
    const customList = customTools.map((c) => ({
      id: c.id,
      slug: c.slug || c.id,
      name: c.name,
      category: c.category,
      complexity: c.complexity,
      readTime: c.readTime,
      isCustom: true,
      status: c.status,
      isDisabled: c.status === 'disabled',
      tags: c.tags || [],
      customDef: c
    }));

    const builtinList = builtinTools.map((b) => ({
      id: b.id,
      slug: b.slug || b.id,
      name: b.name,
      category: b.category,
      complexity: b.complexity,
      readTime: b.readTime,
      isCustom: false,
      status: disabledIds.includes(b.id) ? ('disabled' as const) : ('active' as const),
      isDisabled: disabledIds.includes(b.id),
      tags: b.tags || [],
      customDef: undefined
    }));

    return [...customList, ...builtinList];
  }, [customTools, builtinTools, disabledIds]);

  // Filtered tools
  const filteredTools = useMemo(() => {
    return allManagedTools.filter((tool) => {
      // Category filter
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (statusFilter === 'custom' && !tool.isCustom) return false;
      if (statusFilter === 'builtin' && tool.isCustom) return false;
      if (statusFilter === 'disabled' && !tool.isDisabled) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = tool.name.toLowerCase().includes(q);
        const matchSlug = tool.slug.toLowerCase().includes(q);
        const matchCat = tool.category.toLowerCase().includes(q);
        return matchName || matchSlug || matchCat;
      }
      return true;
    });
  }, [allManagedTools, selectedCategory, statusFilter, searchQuery]);

  // Handle open registration form
  const handleOpenRegisterModal = () => {
    const randomId = `tool_custom_${Date.now().toString(36)}`;
    setEditingTool({
      ...DEFAULT_EMPTY_TOOL,
      id: randomId,
      name: '',
      slug: '',
      createdAt: new Date().toISOString()
    });
    setIsEditorModalOpen(true);
  };

  const handleEditCustomTool = (toolDef: CustomToolDefinition) => {
    setEditingTool({ ...toolDef });
    setIsEditorModalOpen(true);
  };

  const handleSlugify = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (name: string) => {
    setEditingTool((prev) => ({
      ...prev,
      name,
      slug: prev.slug && prev.slug !== handleSlugify(prev.name) ? prev.slug : handleSlugify(name),
      metaTitle: prev.metaTitle ? prev.metaTitle : `${name} | Quick Calculator`
    }));
  };

  // Add / Remove input parameter
  const handleAddParam = () => {
    const newParam: CustomToolParam = {
      id: `param_${editingTool.parameters.length + 1}`,
      label: `Input Field ${editingTool.parameters.length + 1}`,
      type: 'number',
      defaultValue: 10,
      min: 0,
      max: 1000,
      step: 1,
      prefix: '',
      suffix: '',
      hint: ''
    };
    setEditingTool((prev) => ({
      ...prev,
      parameters: [...prev.parameters, newParam]
    }));
  };

  const handleUpdateParam = (index: number, updates: Partial<CustomToolParam>) => {
    setEditingTool((prev) => {
      const updated = [...prev.parameters];
      updated[index] = { ...updated[index], ...updates };
      return { ...prev, parameters: updated };
    });
  };

  const handleRemoveParam = (index: number) => {
    setEditingTool((prev) => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index)
    }));
  };

  // Add / Remove FAQ
  const handleAddFaq = () => {
    setEditingTool((prev) => ({
      ...prev,
      faqs: [...(prev.faqs || []), { question: '', answer: '' }]
    }));
  };

  const handleUpdateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    setEditingTool((prev) => {
      const updated = [...(prev.faqs || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, faqs: updated };
    });
  };

  const handleRemoveFaq = (index: number) => {
    setEditingTool((prev) => ({
      ...prev,
      faqs: (prev.faqs || []).filter((_, i) => i !== index)
    }));
  };

  // Save custom tool
  const handleSaveTool = () => {
    if (!editingTool.name.trim()) {
      onShowToast('Please provide a valid Tool Name');
      return;
    }
    const finalSlug = (editingTool.slug || handleSlugify(editingTool.name)).trim();
    if (!finalSlug) {
      onShowToast('Please provide a valid Tool URL Slug');
      return;
    }

    const payload: CustomToolDefinition = {
      ...editingTool,
      id: editingTool.id || `tool_custom_${Date.now().toString(36)}`,
      slug: finalSlug,
      status: editingTool.status || 'active',
      updatedAt: new Date().toISOString()
    };

    saveCustomTool(payload);
    refreshToolState();
    setIsEditorModalOpen(false);
    onShowToast(`Tool "${payload.name}" saved and live!`);
  };

  // Delete custom tool
  const handleDeleteTool = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to permanently delete custom tool "${name}"?`)) {
      deleteCustomTool(id);
      refreshToolState();
      onShowToast(`Tool "${name}" deleted.`);
    }
  };

  // Toggle tool status
  const handleToggleTool = (tool: { id: string; isCustom: boolean; isDisabled: boolean; name: string }) => {
    if (tool.isCustom) {
      const newStatus = tool.isDisabled ? 'active' : 'disabled';
      toggleCustomToolStatus(tool.id, newStatus);
      refreshToolState();
      onShowToast(`Custom tool status set to ${newStatus}.`);
    } else {
      const nowDisabled = toggleBuiltinToolDisabled(tool.id);
      refreshToolState();
      onShowToast(`Built-in tool ${nowDisabled ? 'disabled' : 're-enabled'}.`);
    }
  };

  // Copy Tool Slug
  const handleCopySlug = (slug: string) => {
    navigator.clipboard.writeText(`/tools/${slug}`);
    setCopiedId(slug);
    setTimeout(() => setCopiedId(null), 2000);
    onShowToast(`Copied permalink: /tools/${slug}`);
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr = exportToolsRegistryJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quickcalc_custom_tools_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Tools registry JSON exported successfully.');
  };

  // Import JSON
  const handleImportJson = () => {
    if (!importJsonText.trim()) {
      onShowToast('Please paste a valid JSON string');
      return;
    }
    const result = importToolsRegistryJson(importJsonText);
    if (result.success) {
      refreshToolState();
      setIsImportModalOpen(false);
      setImportJsonText('');
      onShowToast(`Successfully imported ${result.count} custom tool definitions!`);
    } else {
      onShowToast(`Import failed: ${result.error}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Metric Summary */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/20 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold border border-cyan-500/20">
            <Wrench className="w-3.5 h-3.5" />
            <span>Dynamic Tool & Calculator Engine</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Tool Catalog & Calculator Builder
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Monitor all 250+ client-side engines, register dynamic custom calculators with interactive parameter sliders, formulas, and instant schema deployment.
          </p>
        </div>

        {/* Action Group */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleExportJson}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold border border-slate-700 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            title="Export Custom Tools Registry to JSON"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Registry</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold border border-slate-700 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            title="Import Tool Definitions"
          >
            <Upload className="w-4 h-4 text-indigo-400" />
            <span>Import JSON</span>
          </button>

          <button
            onClick={handleOpenRegisterModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/25"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Register New Tool</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400">TOTAL MANAGED TOOLS</div>
          <div className="text-2xl font-black text-white font-display">{allManagedTools.length}</div>
          <div className="text-[10px] text-cyan-400 font-mono">250+ core catalog + custom</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400">ACTIVE TOOLS</div>
          <div className="text-2xl font-black text-emerald-400 font-display">
            {allManagedTools.filter((t) => !t.isDisabled).length}
          </div>
          <div className="text-[10px] text-emerald-400/80 font-mono">100% Client-Side Ready</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400">CUSTOM TOOLS</div>
          <div className="text-2xl font-black text-indigo-400 font-display">{customTools.length}</div>
          <div className="text-[10px] text-indigo-400/80 font-mono">Admin registered</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400">DISABLED ENGINES</div>
          <div className="text-2xl font-black text-rose-400 font-display">
            {allManagedTools.filter((t) => t.isDisabled).length}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Toggled off</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by tool name, slug, category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-xs text-slate-200 placeholder:text-slate-500"
          />
        </div>

        {/* Category & Status Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:border-cyan-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories ({CATEGORIES.length})</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-mono">
            {(['all', 'custom', 'builtin', 'disabled'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setStatusFilter(mode)}
                className={`px-3 py-1 rounded-lg text-xs transition-colors cursor-pointer capitalize ${
                  statusFilter === mode
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tool Catalog Table */}
      <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900 shadow-md">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
            <tr>
              <th className="p-4 font-semibold">TOOL NAME & PERMALINK</th>
              <th className="p-4 font-semibold">CATEGORY</th>
              <th className="p-4 font-semibold">TYPE</th>
              <th className="p-4 font-semibold">COMPLEXITY</th>
              <th className="p-4 font-semibold">STATUS</th>
              <th className="p-4 font-semibold text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            {filteredTools.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-500 font-mono">
                  No tools found matching your filter criteria.
                </td>
              </tr>
            ) : (
              filteredTools.map((tool) => (
                <tr key={tool.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white text-sm line-clamp-1">{tool.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] text-cyan-400 font-mono">/tools/{tool.slug}</span>
                      <button
                        onClick={() => handleCopySlug(tool.slug)}
                        className="text-slate-500 hover:text-slate-300 transition-colors"
                        title="Copy Tool URL"
                      >
                        {copiedId === tool.slug ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-200 font-medium border border-slate-800 text-[11px]">
                      {tool.category}
                    </span>
                  </td>

                  <td className="p-4 font-mono">
                    {tool.isCustom ? (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 text-[10px]">
                        CUSTOM BUILDER
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px]">
                        BUILT-IN
                      </span>
                    )}
                  </td>

                  <td className="p-4 font-mono text-slate-400">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        tool.complexity === 'Easy'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : tool.complexity === 'Medium'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {tool.complexity}
                    </span>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleToggleTool(tool)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer border ${
                        tool.isDisabled
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                      }`}
                      title={tool.isDisabled ? 'Click to Enable' : 'Click to Disable'}
                    >
                      <Power className="w-3 h-3" />
                      <span>{tool.isDisabled ? 'Disabled' : 'Active'}</span>
                    </button>
                  </td>

                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {tool.customDef && (
                        <button
                          onClick={() => handleEditCustomTool(tool.customDef!)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit Tool Schema"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                        </button>
                      )}

                      {tool.customDef && (
                        <button
                          onClick={() => handleDeleteTool(tool.id, tool.name)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete Custom Tool"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {onOpenLiveTool && (
                        <button
                          onClick={() => onOpenLiveTool(tool.slug)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                          title="Launch & Test Tool"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* "+ Register / Edit Tool" Modal */}
      <AnimatePresence>
        {isEditorModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-bold">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">
                      {editingTool.id && customTools.some((t) => t.id === editingTool.id)
                        ? 'Edit Dynamic Tool Engine'
                        : 'Register New Dynamic Tool & Calculator'}
                    </h3>
                    <p className="text-xs text-slate-400">Configure interactive schema, formula snippet, and SEO</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditorModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
                {/* 1. Core Tool Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                    <span>1. Basic Meta & Classification</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Tool Name *</label>
                      <input
                        type="text"
                        value={editingTool.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="e.g. Crypto Profit Calculator"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">URL Slug *</label>
                      <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs">
                        <span className="text-slate-500 font-mono">/tools/</span>
                        <input
                          type="text"
                          value={editingTool.slug}
                          onChange={(e) => setEditingTool((prev) => ({ ...prev, slug: e.target.value }))}
                          placeholder="crypto-profit-calculator"
                          className="w-full bg-transparent focus:outline-none text-cyan-300 font-mono ml-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Category Selection *</label>
                      <select
                        value={editingTool.category}
                        onChange={(e) => setEditingTool((prev) => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-xs text-slate-200"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} ({cat.id})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-slate-300">Complexity</label>
                        <select
                          value={editingTool.complexity}
                          onChange={(e) =>
                            setEditingTool((prev) => ({ ...prev, complexity: e.target.value as any }))
                          }
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-xs text-slate-200"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono text-slate-300">Speed / Read Time</label>
                        <input
                          type="text"
                          value={editingTool.readTime}
                          onChange={(e) => setEditingTool((prev) => ({ ...prev, readTime: e.target.value }))}
                          placeholder="Instant"
                          className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-xs text-slate-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Short Description</label>
                    <textarea
                      rows={2}
                      value={editingTool.description}
                      onChange={(e) => setEditingTool((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Concise overview of what this calculator analyzes or solves..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-xs text-slate-200 leading-relaxed"
                    />
                  </div>
                </div>

                {/* 2. Dynamic Input Parameters Configuration */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                      2. Input Parameters Configuration ({editingTool.parameters.length})
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddParam}
                      className="px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>+ Add Parameter</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {editingTool.parameters.map((param, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-3 relative group"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[11px] font-mono font-bold text-slate-400">
                            #{idx + 1} Input Field
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveParam(idx)}
                            className="text-slate-500 hover:text-rose-400 text-xs transition-colors p-1"
                            title="Remove Parameter"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-slate-400">Variable Key (id)</label>
                            <input
                              type="text"
                              value={param.id}
                              onChange={(e) => handleUpdateParam(idx, { id: e.target.value })}
                              placeholder="e.g. capital"
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-slate-400">Display Label</label>
                            <input
                              type="text"
                              value={param.label}
                              onChange={(e) => handleUpdateParam(idx, { label: e.target.value })}
                              placeholder="e.g. Investment Amount"
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-slate-400">Input Type</label>
                            <select
                              value={param.type}
                              onChange={(e) => handleUpdateParam(idx, { type: e.target.value as any })}
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200"
                            >
                              <option value="number">Number</option>
                              <option value="slider">Range Slider</option>
                              <option value="text">Text</option>
                              <option value="textarea">Multi-line Text</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-slate-400">Default Value</label>
                            <input
                              type="text"
                              value={param.defaultValue}
                              onChange={(e) => handleUpdateParam(idx, { defaultValue: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-slate-400">Min / Max</label>
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                placeholder="Min"
                                value={param.min !== undefined ? param.min : ''}
                                onChange={(e) => handleUpdateParam(idx, { min: Number(e.target.value) })}
                                className="w-1/2 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                              />
                              <input
                                type="number"
                                placeholder="Max"
                                value={param.max !== undefined ? param.max : ''}
                                onChange={(e) => handleUpdateParam(idx, { max: Number(e.target.value) })}
                                className="w-1/2 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-slate-400">Prefix / Suffix</label>
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                placeholder="Prefix ($)"
                                value={param.prefix || ''}
                                onChange={(e) => handleUpdateParam(idx, { prefix: e.target.value })}
                                className="w-1/2 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                              />
                              <input
                                type="text"
                                placeholder="Suffix (%)"
                                value={param.suffix || ''}
                                onChange={(e) => handleUpdateParam(idx, { suffix: e.target.value })}
                                className="w-1/2 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-slate-400">Hint / Tooltip</label>
                            <input
                              type="text"
                              value={param.hint || ''}
                              onChange={(e) => handleUpdateParam(idx, { hint: e.target.value })}
                              placeholder="e.g. Total capital"
                              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Formula / Computation Execution Logic */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Code className="w-4 h-4" />
                    <span>3. Execution Formula / Calculation JavaScript Snippet</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Write standard ES6 JavaScript execution logic. The function receives the <code className="text-cyan-300">params</code> object containing all input keys configured above.
                  </p>

                  <textarea
                    rows={8}
                    value={editingTool.formulaLogic || ''}
                    onChange={(e) => setEditingTool((prev) => ({ ...prev, formulaLogic: e.target.value }))}
                    className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 leading-relaxed focus:border-cyan-500 focus:outline-none"
                    placeholder="// Formula code here..."
                  />
                </div>

                {/* 4. SEO & Schema FAQs */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                      4. SEO Meta & Structured FAQ Schema
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddFaq}
                      className="px-3 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>+ Add FAQ</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Meta Title</label>
                      <input
                        type="text"
                        value={editingTool.metaTitle || ''}
                        onChange={(e) => setEditingTool((prev) => ({ ...prev, metaTitle: e.target.value }))}
                        placeholder="SEO Title | Quick Calculator"
                        className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Meta Description</label>
                      <textarea
                        rows={2}
                        value={editingTool.metaDescription || ''}
                        onChange={(e) => setEditingTool((prev) => ({ ...prev, metaDescription: e.target.value }))}
                        placeholder="Concise 150-160 character description for search engine ranking..."
                        className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                      />
                    </div>

                    {/* FAQs */}
                    <div className="space-y-2 pt-2">
                      <label className="text-[11px] font-mono text-slate-400">Structured FAQs (JSON-LD ready):</label>
                      {(editingTool.faqs || []).map((faq, fIdx) => (
                        <div key={fIdx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-cyan-400 font-bold">FAQ #{fIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFaq(fIdx)}
                              className="text-slate-500 hover:text-rose-400 text-xs p-0.5"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => handleUpdateFaq(fIdx, 'question', e.target.value)}
                            placeholder="Question: e.g. How does this calculator compute profit?"
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                          />
                          <textarea
                            rows={2}
                            value={faq.answer}
                            onChange={(e) => handleUpdateFaq(fIdx, 'answer', e.target.value)}
                            placeholder="Answer: Detailed explanation..."
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsEditorModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveTool}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/25"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Save & Deploy Tool</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* JSON Import Modal */}
      <AnimatePresence>
        {isImportModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-display font-bold text-base text-white">Import Tool Definitions JSON</h3>
                </div>
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Paste an array of <code className="text-cyan-300">CustomToolDefinition</code> objects to register or update dynamic calculators in bulk.
              </p>

              <textarea
                rows={10}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='[ { "id": "tool_custom_example", "name": "ROI Planner", "slug": "roi-planner", "category": "financial-calculators", ... } ]'
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 custom-scrollbar"
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImportJson}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Execute Import</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
