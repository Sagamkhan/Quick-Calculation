import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, ChevronRight, ChevronDown, CheckCircle, AlertTriangle, Braces, Code, FileText } from 'lucide-react';
import { ToolComponentProps } from './registry';

const SAMPLE_JSON = `{
  "app": "Quick Calculator",
  "version": "2.5.0",
  "status": "production",
  "features": [
    "100% In-Browser Privacy",
    "Zero Registration",
    "Fast Client-Side Execution"
  ],
  "stats": {
    "totalTools": 210,
    "categories": 12,
    "activeUsers": 45000,
    "isFreeForever": true,
    "license": null
  }
}`;

// Recursive JSON Tree node
interface JsonNodeProps {
  name?: string;
  value: any;
  isLast?: boolean;
}

const JsonTreeNode: React.FC<JsonNodeProps> = ({ name, value, isLast = true }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);

  if (isObject) {
    const keys = Object.keys(value);
    const isEmpty = keys.length === 0;

    return (
      <div className="pl-4 font-mono text-xs leading-relaxed">
        <div
          className="flex items-center gap-1 cursor-pointer hover:bg-slate-800/50 py-0.5 px-1 rounded select-none group"
          onClick={() => setCollapsed(!collapsed)}
        >
          {isEmpty ? (
            <span className="w-4 h-4 inline-block" />
          ) : collapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          )}

          {name && <span className="text-purple-400 font-semibold font-mono">"{name}": </span>}

          <span className="text-slate-400">
            {isArray ? `Array[${keys.length}]` : `{${keys.length} keys}`}
          </span>
          {collapsed && <span className="text-slate-600 text-[10px] ml-1">...</span>}
        </div>

        {!collapsed && !isEmpty && (
          <div className="border-l border-slate-800 pl-2 ml-2">
            {keys.map((k, index) => (
              <JsonTreeNode
                key={k}
                name={isArray ? undefined : k}
                value={value[k]}
                isLast={index === keys.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Primitive render
  let valColor = 'text-cyan-300';
  let displayVal = String(value);

  if (typeof value === 'string') {
    valColor = 'text-emerald-400';
    displayVal = `"${value}"`;
  } else if (typeof value === 'number') {
    valColor = 'text-amber-400';
  } else if (typeof value === 'boolean') {
    valColor = 'text-rose-400';
  } else if (value === null) {
    valColor = 'text-slate-500 italic';
    displayVal = 'null';
  }

  return (
    <div className="pl-6 font-mono text-xs py-0.5 leading-relaxed">
      {name && <span className="text-purple-400 font-medium">"{name}": </span>}
      <span className={valColor}>{displayVal}</span>
      {!isLast && <span className="text-slate-600">,</span>}
    </div>
  );
};

export default function JsonFormatterValidatorTreeView({ tool, onBack }: ToolComponentProps) {
  const [inputJson, setInputJson] = useState<string>(SAMPLE_JSON);
  const [activeTab, setActiveTab] = useState<'formatted' | 'tree'>('tree');
  const [indentSize, setIndentSize] = useState<number>(2);
  const [copied, setCopied] = useState<boolean>(false);

  // Parsing & validation
  const parsedData = useMemo(() => {
    if (!inputJson.trim()) {
      return { isValid: true, parsed: null, error: null, sizeBytes: 0, formatted: '' };
    }
    try {
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, indentSize);
      return {
        isValid: true,
        parsed,
        error: null,
        sizeBytes: new Blob([formatted]).size,
        formatted
      };
    } catch (err: any) {
      return {
        isValid: false,
        parsed: null,
        error: err.message || 'Invalid JSON syntax',
        sizeBytes: new Blob([inputJson]).size,
        formatted: inputJson
      };
    }
  }, [inputJson, indentSize]);

  const handleMinify = () => {
    if (parsedData.isValid && parsedData.parsed) {
      setInputJson(JSON.stringify(parsedData.parsed));
    }
  };

  const handlePrettify = () => {
    if (parsedData.isValid && parsedData.parsed) {
      setInputJson(JSON.stringify(parsedData.parsed, null, indentSize));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(parsedData.formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          JSON Formatter, Validator & Tree View - Client-Side Syntax Parser
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Validate JSON syntax in real-time, format with custom indents, minify payload sizes, and explore deep hierarchies via collapsible interactive tree nodes.
        </p>
      </div>

      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrettify}
            disabled={!parsedData.isValid}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold disabled:opacity-50 transition"
          >
            Prettify
          </button>
          <button
            type="button"
            onClick={handleMinify}
            disabled={!parsedData.isValid}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Minify Compact
          </button>
          <button
            type="button"
            onClick={() => setInputJson(SAMPLE_JSON)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            Sample
          </button>
          <button
            type="button"
            onClick={() => setInputJson('')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            Clear
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Indent:</span>
            {[2, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setIndentSize(n)}
                className={`px-2 py-0.5 rounded ${indentSize === n ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'}`}
              >
                {n} Spaces
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!inputJson.trim()}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-medium flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Editor Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Textarea */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2 flex flex-col">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold flex items-center gap-1.5">
              <Code className="w-4 h-4 text-cyan-400" /> Raw JSON Source
            </span>
            <span className="font-mono text-slate-400">{new Blob([inputJson]).size} bytes</span>
          </div>

          <textarea
            rows={16}
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder="Paste your JSON string here..."
            className="w-full flex-1 px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none overflow-y-auto leading-relaxed"
          />

          {parsedData.isValid ? (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Valid JSON document. Clean syntax confirmed.</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="truncate">{parsedData.error}</span>
            </div>
          )}
        </div>

        {/* View / Tree Container */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2 flex flex-col">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('tree')}
                className={`px-3 py-1 rounded transition ${activeTab === 'tree' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Tree View
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('formatted')}
                className={`px-3 py-1 rounded transition ${activeTab === 'formatted' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Pretty Code
              </button>
            </div>

            <span className="text-slate-400 font-mono">
              {parsedData.parsed && typeof parsedData.parsed === 'object'
                ? `${Object.keys(parsedData.parsed).length} Root Keys`
                : 'Ready'}
            </span>
          </div>

          <div className="w-full flex-1 min-h-[380px] max-h-[440px] p-3 rounded-lg bg-slate-950 border border-slate-800 overflow-y-auto font-mono text-xs">
            {!parsedData.isValid ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                <AlertTriangle className="w-8 h-8 text-rose-400/80" />
                <p className="text-sm font-semibold text-rose-400">JSON Parse Error</p>
                <p className="text-xs max-w-sm text-slate-400">{parsedData.error}</p>
              </div>
            ) : !parsedData.parsed ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                Enter JSON on the left to inspect tree hierarchy.
              </div>
            ) : activeTab === 'tree' ? (
              <div className="space-y-1">
                <JsonTreeNode value={parsedData.parsed} />
              </div>
            ) : (
              <pre className="text-slate-200 whitespace-pre leading-relaxed select-all">
                {parsedData.formatted}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* 3-Line FAQ */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-cyan-400" /> Frequently Asked Questions
        </h4>
        <div className="space-y-2 text-xs text-slate-400 divide-y divide-slate-800/80">
          <div className="pt-2">
            <strong className="text-slate-300">Is my JSON data uploaded or stored on any server?</strong>
            <p className="mt-0.5">No, all parsing, validation, and tree rendering occur 100% locally inside your web browser memory with complete privacy.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">What are the common causes of JSON parse failures?</strong>
            <p className="mt-0.5">Common issues include trailing commas after the final element, unquoted property keys, and single quotes instead of double quotes.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">How does the interactive tree view simplify debugging nested structures?</strong>
            <p className="mt-0.5">Clickable expand/collapse nodes let you isolate specific sub-objects and arrays without scrolling through thousands of raw lines.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
