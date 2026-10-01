import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Info
} from 'lucide-react';
import { ToolItem, TOOLS_CATALOG } from '../data/categoriesAndTools';
import { getToolInfoContent } from '../data/toolFaqsAndInfo';

export interface ToolEditorialContentProps {
  tool?: ToolItem;
  toolId?: string;
  id?: string;
  onNavigate?: (href: string) => void;
}

/**
 * Clean, lightweight instruction & FAQ section for every tool.
 * Strictly maintains:
 * 1. 3-step "How to Use" guide
 * 2. Maximum 2 FAQs in a clean accordion (first FAQ open by default)
 */
export default function ToolEditorialContent({ 
  tool: propTool, 
  toolId, 
  id 
}: ToolEditorialContentProps) {
  // First FAQ open by default as confirmed by user preference
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Resolve ToolItem from propTool, toolId, or id
  const tool = useMemo<ToolItem>(() => {
    if (propTool) return propTool;
    const lookupId = (toolId || id || '').trim().toLowerCase();
    if (lookupId) {
      const found = TOOLS_CATALOG.find(
        t => t.id.toLowerCase() === lookupId || 
             t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === lookupId ||
             t.name.toLowerCase() === lookupId
      );
      if (found) return found;
    }
    return TOOLS_CATALOG[0];
  }, [propTool, toolId, id]);

  const toolInfo = useMemo(() => getToolInfoContent(tool), [tool]);

  // Derive exactly 3 practical steps
  const steps = useMemo(() => {
    const raw = tool.instructions || tool.howToUse || tool.steps || toolInfo.howToUseSteps || [];
    const defaultSteps = [
      {
        title: 'Enter Inputs',
        desc: `Fill in the required values, parameters, or text for ${tool.name} in the fields above.`
      },
      {
        title: 'Run Calculation',
        desc: 'Click the Calculate or Process button to execute instant browser-side processing.'
      },
      {
        title: 'Review & Export',
        desc: 'Inspect your full unclipped results, copy the data summary, or export a report.'
      }
    ];

    if (Array.isArray(raw) && raw.length >= 3) {
      return raw.slice(0, 3).map((item, idx) => {
        if (typeof item === 'string') {
          const parts = item.split(': ');
          const title = parts.length > 1 ? parts[0] : `Step ${idx + 1}`;
          const desc = parts.length > 1 ? parts.slice(1).join(': ') : item;
          return { title, desc };
        }
        return {
          title: (item as any).title || `Step ${idx + 1}`,
          desc: (item as any).text || (item as any).description || defaultSteps[idx].desc
        };
      });
    }

    return defaultSteps;
  }, [tool, toolInfo]);

  // Derive exactly max 2 high-value FAQs
  const faqs = useMemo(() => {
    const defaultFaqs = [
      {
        question: `How does ${tool.name} perform calculations?`,
        answer: `${tool.name} runs 100% client-side in your web browser. All calculations, conversions, and formatting execute with sub-second response times and complete privacy.`
      },
      {
        question: `Is there any usage limit or registration needed?`,
        answer: `No. All calculations are completely free with zero limits, zero paywalls, and no account or password required.`
      }
    ];

    if (toolInfo.faqs && toolInfo.faqs.length >= 2) {
      return toolInfo.faqs.slice(0, 2);
    }
    if (toolInfo.faqs && toolInfo.faqs.length === 1) {
      return [toolInfo.faqs[0], defaultFaqs[1]];
    }
    return defaultFaqs;
  }, [tool, toolInfo]);

  return (
    <div className="space-y-6 pt-2" id="how-to-use-section">
      {/* 1. Exactly 3-Step How-to-Use Guide */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-800/80 dark:bg-[#1A2130] border border-slate-700/60 dark:border-white/10 shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
          <Info className="w-4 h-4" />
          <span>How to Use (3 Steps)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/50 flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center">
                  0{idx + 1}
                </span>
                <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                  {idx === 0 ? 'Input' : idx === 1 ? 'Compute' : 'Result'}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-100 font-display">
                {step.title}
              </h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-3">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Exactly Max 2 FAQs Accordion */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-800/80 dark:bg-[#1A2130] border border-slate-700/60 dark:border-white/10 shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
          <HelpCircle className="w-4 h-4" />
          <span>Frequently Asked Questions</span>
        </div>

        <div className="space-y-2 pt-1">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-slate-900/70 border border-slate-700/60 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-3 font-display font-semibold text-xs sm:text-sm text-slate-100 hover:text-white cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-3.5 sm:px-4 pb-3.5 pt-0 text-xs text-slate-300 leading-relaxed font-sans border-t border-slate-800/80">
                    <p className="pt-2">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
