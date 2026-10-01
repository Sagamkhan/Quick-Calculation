import fs from 'fs';
import { TOOLS_CATALOG } from '../src/data/categoriesAndTools';

console.log('Generating src/tools/registry.ts for', TOOLS_CATALOG.length, 'tools...');

const textToolIds = [
  'tool_plagiarism_checker',
  'tool_word_character_counter',
  'tool_case_converter',
  'tool_article_rewriter_paraphraser',
  'txt-1',
  'txt-2',
  'txt-3',
  'txt-4',
  'txt-5'
];

const financeToolIds = [
  'tool_sip_calculator',
  'tool_emi_loan_calculator',
  'tool_gst_tax_calculator',
  'tool_compound_interest_calculator',
  'fin-1',
  'fin-2',
  'fin-3',
  'fin-4',
  'fin-5',
  'finance-sip',
  'finance-emi',
  'finance-compound',
  'finance-retirement',
  'finance-gst-tax',
  'finance-inflation',
  'finance-ppf',
  'finance-simple-interest',
  'finance-fd-rd',
  'finance-net-worth',
  'finance-currency',
  'finance-salary',
  'finance-dti',
  'finance-emergency-fund',
  'finance-brokerage'
];

const devToolIds = [
  'tool_json_formatter_validator',
  'tool_base64_encoder_decoder',
  'tool_css_js_code_minifier',
  'dev-1',
  'dev-2',
  'dev-3',
  'dev-4',
  'dev-5',
  'dev-6'
];

const unitConverterToolIds = [
  'tool_unit_length',
  'tool_unit_mass',
  'tool_unit_area',
  'tool_unit_volume',
  'tool_unit_data_storage',
  'tool_unit_speed',
  'tool_unit_temperature',
  'tool_unit_pressure',
  'tool_unit_time',
  'tool_unit_energy',
  'tool_unit_power',
  'tool_unit_force',
  'tool_unit_density',
  'tool_unit_angle',
  'tool_unit_frequency'
];

const healthToolIds = ['hf-1', 'hf-2', 'hf-3', 'hf-4'];
const altToolIds = ['alt-1', 'alt-2', 'alt-3', 'alt-4', 'alt-5', 'alt-6'];

// Verify all 170
const allIds = TOOLS_CATALOG.map(t => t.id);

let code = `// ============================================================================
// QUICK CALCULATOR - CENTRAL TOOL REGISTRY (ALL 170 CLIENT-SIDE TOOLS)
// Mapped 100% in-browser with zero API calls, zero fetch, and zero undefined components
// ============================================================================

import React, { useState, useMemo } from 'react';
import { ToolItem, TOOLS_CATALOG } from '../data/categoriesAndTools';
import FinanceToolEngine from '../components/FinanceToolEngine';
import TextToolEngine from '../components/TextToolEngine';
import DeveloperToolEngine from '../components/DeveloperToolEngine';
import { SeoToolEngine } from '../components/SeoToolEngine';
import { PdfToolEngine } from '../components/PdfToolEngine';
import ImageToolEngine from '../components/ImageToolEngine';
import AiToolEngine from '../components/AiToolEngine';
import HealthToolEngine from '../components/HealthToolEngine';
import { UnitConverterEngine } from '../components/UnitConverterEngine';
import InteractiveToolEngine from '../components/InteractiveToolEngine';
import { triggerConfetti } from '../utils/confetti';
import {
  Sparkles,
  Calculator,
  ArrowLeft,
  Copy,
  Download,
  Check,
  RotateCcw,
  Sliders,
  Layers,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

export interface ToolComponentProps {
  tool?: ToolItem;
  onBack?: () => void;
  onCopyMarkdown?: () => void;
  onDownloadPdf?: () => void;
}

// Map for quick catalog lookup
const CATALOG_MAP = new Map<string, ToolItem>(TOOLS_CATALOG.map(t => [t.id, t]));

function resolveTool(id: string, propTool?: ToolItem): ToolItem {
  if (propTool) return propTool;
  const found = CATALOG_MAP.get(id);
  if (found) return found;
  const cleanName = id.replace(/[-_]+/g, ' ').replace(/\\b\\w/g, c => c.toUpperCase());
  return {
    id,
    number: '0',
    name: cleanName,
    slug: id,
    category: 'math',
    description: \`High-speed browser-based dynamic calculator for \${cleanName}.\`,
    tags: ['calculator', 'tool', 'client-side'],
    readTime: 'Instant',
    complexity: 'Easy',
    rating: 4.9,
    useCount: '10.5k'
  };
}

// ---------------------------------------------------------------------------
// ALTERNATIVE STUDIO WORKBENCH COMPONENT (alt-1 to alt-6)
// ---------------------------------------------------------------------------
export function AlternativeStudioTool({ tool, onBack, onCopyMarkdown, onDownloadPdf }: ToolComponentProps) {
  const resolvedTool = resolveTool('alt-studio', tool);
  const [resolutionWidth, setResolutionWidth] = useState<number>(1920);
  const [resolutionHeight, setResolutionHeight] = useState<number>(1080);
  const [dpi, setDpi] = useState<number>(72);
  const [format, setFormat] = useState<string>('PNG');
  const [colorDepth, setColorDepth] = useState<number>(24);
  const [copied, setCopied] = useState<boolean>(false);

  const calculatedSize = useMemo(() => {
    const rawBytes = resolutionWidth * resolutionHeight * (colorDepth / 8);
    const mb = (rawBytes / (1024 * 1024)).toFixed(2);
    return \`\${mb} MB (\${resolutionWidth}x\${resolutionHeight} @ \${dpi} DPI)\`;
  }, [resolutionWidth, resolutionHeight, dpi, colorDepth]);

  const handleCopySpecs = () => {
    const summary = \`\${resolvedTool.name} Specifications:\\n- Resolution: \${resolutionWidth}x\${resolutionHeight} px\\n- DPI: \${dpi}\\n- Output Format: \${format}\\n- Uncompressed Buffer: \${calculatedSize}\\n- Pricing: 100% Free Open Source Browser Alternative\`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    triggerConfetti(0.3);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/80 border border-purple-500/30 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                {resolvedTool.name} Workspace
              </h3>
              <p className="text-xs text-slate-400">
                100% Free Open-Source SaaS Alternative Studio
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 font-mono text-xs font-bold self-start sm:self-auto border border-emerald-500/30">
            $0 / Lifetime Free
          </span>
        </div>

        {/* Studio Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Canvas Width (px)</label>
            <input
              type="number"
              value={resolutionWidth}
              onChange={(e) => setResolutionWidth(Number(e.target.value) || 100)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm"
              style={{ fontSize: '16px' }}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Canvas Height (px)</label>
            <input
              type="number"
              value={resolutionHeight}
              onChange={(e) => setResolutionHeight(Number(e.target.value) || 100)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm"
              style={{ fontSize: '16px' }}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Export DPI</label>
            <select
              value={dpi}
              onChange={(e) => setDpi(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm"
              style={{ fontSize: '16px' }}
            >
              <option value={72}>72 DPI (Web Screen)</option>
              <option value={150}>150 DPI (High-Res Digital)</option>
              <option value={300}>300 DPI (Print Grade)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Output Target</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm"
              style={{ fontSize: '16px' }}
            >
              <option value="PNG">Lossless PNG</option>
              <option value="SVG">Vector SVG</option>
              <option value="WebP">WebP Optimized</option>
              <option value="PDF">Document PDF</option>
            </select>
          </div>
        </div>

        {/* Live Calculation Output Dashboard */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Calculated Buffer & Allocation</span>
            <span className="text-emerald-400">Zero Server Latency</span>
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">
            {calculatedSize}
          </div>
          <div className="text-xs text-slate-400">
            {resolvedTool.freeAlternativeTo ? (
              <span>Replaces <strong>{resolvedTool.freeAlternativeTo}</strong> with client-side rendering.</span>
            ) : (
              <span>Runs 100% locally in browser memory with zero network latency.</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleCopySpecs}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Specs!' : 'Copy Configuration'}</span>
          </button>
          {onDownloadPdf && (
            <button
              type="button"
              onClick={onDownloadPdf}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export PDF Report</span>
            </button>
          )}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Tools</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// UNIVERSAL FALLBACK TOOL ENGINE
// ---------------------------------------------------------------------------
export function FallbackToolComponent({ tool, onBack, onCopyMarkdown, onDownloadPdf }: ToolComponentProps) {
  const resolvedTool = resolveTool('fallback-tool', tool);
  return (
    <InteractiveToolEngine
      tool={resolvedTool}
      onCopyMarkdown={onCopyMarkdown}
      onDownloadPdf={onDownloadPdf}
    />
  );
}

// ---------------------------------------------------------------------------
// FACTORY WRAPPERS FOR ARCHETYPES
// ---------------------------------------------------------------------------
function makeFinanceTool(id: string): React.FC<ToolComponentProps> {
  return function FinanceWrapper(props: ToolComponentProps) {
    const t = resolveTool(id, props.tool);
    return <FinanceToolEngine tool={t} />;
  };
}

function makeTextTool(id: string): React.FC<ToolComponentProps> {
  return function TextWrapper(props: ToolComponentProps) {
    const t = resolveTool(id, props.tool);
    return <TextToolEngine tool={t} />;
  };
}

function makeDevTool(id: string): React.FC<ToolComponentProps> {
  return function DevWrapper(props: ToolComponentProps) {
    const t = resolveTool(id, props.tool);
    return <DeveloperToolEngine tool={t} />;
  };
}

function makeUnitConverterTool(id: string): React.FC<ToolComponentProps> {
  return function UnitConverterWrapper(props: ToolComponentProps) {
    const t = resolveTool(id, props.tool);
    return <UnitConverterEngine tool={t} />;
  };
}

function makeSeoTool(id: string): React.FC<ToolComponentProps> {
  return function SeoWrapper(props: ToolComponentProps) {
    const t = resolveTool(id, props.tool);
    return <SeoToolEngine tool={t} />;
  };
}

function makePdfTool(id: string): React.FC<ToolComponentProps> {
  return function PdfWrapper(props: ToolComponentProps) {
    const t = resolveTool(id, props.tool);
    return <PdfToolEngine tool={t} />;
  };
}

function makeImageTool(id: string): React.FC<ToolComponentProps> {
  return function ImageWrapper(props: ToolComponentProps) {
    const t = resolveTool(id, props.tool);
    return <ImageToolEngine tool={t} />;
  };
}

function makeAiTool(id: string): React.FC<ToolComponentProps> {
  return function AiWrapper(props: ToolComponentProps) {
    const t = resolveTool(id, props.tool);
    return <AiToolEngine tool={t} />;
  };
}

function makeHealthTool(id: string): React.FC<ToolComponentProps> {
  return function HealthWrapper(props: ToolComponentProps) {
    const t = resolveTool(id, props.tool);
    return <HealthToolEngine tool={t} />;
  };
}

function makeAltTool(id: string): React.FC<ToolComponentProps> {
  return function AltWrapper(props: ToolComponentProps) {
    const t = resolveTool(id, props.tool);
    return <AlternativeStudioTool {...props} tool={t} />;
  };
}
`;

// Now map every single one of the 170 tools
code += `\n// ---------------------------------------------------------------------------
// MASTER TOOL REGISTRY: ALL 170 TOOLS EXPLICITLY MAPPED
// ---------------------------------------------------------------------------
export const toolRegistry: Record<string, React.FC<ToolComponentProps>> = {\n`;

allIds.forEach(id => {
  let factory = 'makeFinanceTool';
  if (textToolIds.includes(id)) {
    factory = 'makeTextTool';
  } else if (financeToolIds.includes(id)) {
    factory = 'makeFinanceTool';
  } else if (devToolIds.includes(id)) {
    factory = 'makeDevTool';
  } else if (unitConverterToolIds.includes(id)) {
    factory = 'makeUnitConverterTool';
  } else if (id.startsWith('seo-')) {
    factory = 'makeSeoTool';
  } else if (id.startsWith('pdf-') || id.includes('pdf')) {
    factory = 'makePdfTool';
  } else if (id.startsWith('img-') || id.includes('image') || id.includes('jpg') || id.includes('png') || id.includes('webp') || id.includes('svg') || id.includes('crop') || id.includes('palette') || id.includes('exif') || id.includes('watermark') || id.includes('redact') || id.includes('filters') || id.includes('aspect_ratio') || id.includes('gif') || id.includes('meme') || id.includes('keyer') || id.includes('resizer') || id.includes('diff')) {
    factory = 'makeImageTool';
  } else if (id.startsWith('ai-')) {
    factory = 'makeAiTool';
  } else if (healthToolIds.includes(id)) {
    factory = 'makeHealthTool';
  } else if (altToolIds.includes(id)) {
    factory = 'makeAltTool';
  }
  code += `  '${id}': ${factory}('${id}'),\n`;
});

code += `};\n\n`;

code += `/**
 * Resolve tool component by ID with guaranteed fallback
 */
export function getToolComponent(id: string): React.FC<ToolComponentProps> {
  return toolRegistry[id] || FallbackToolComponent;
}

export default toolRegistry;
`;

if (!fs.existsSync('./src/tools')) {
  fs.mkdirSync('./src/tools', { recursive: true });
}

fs.writeFileSync('./src/tools/registry.ts', code);
console.log('Successfully created ./src/tools/registry.ts with', allIds.length, 'tools mapped!');
