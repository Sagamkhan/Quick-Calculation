import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Lightbulb,
  Sparkles,
  Layers,
  Clock,
  Gauge,
  Tag,
  Share2,
  ShieldCheck,
  ArrowRight,
  Terminal,
  Calculator,
  Sliders,
  FileCheck
} from 'lucide-react';
import { ToolItem, CATEGORIES } from '../data/categoriesAndTools';
import { getToolInfoContent } from '../data/toolFaqsAndInfo';
import { triggerConfetti } from '../utils/confetti';

export interface InstructionStep {
  stepNumber: number;
  title: string;
  description: string;
  tip?: string;
}

interface ToolHowToUseSectionProps {
  tool: ToolItem;
  className?: string;
}

/**
 * Automatically extracts and normalizes instructions, steps, and tips
 * directly from the tool's metadata properties (tool.instructions,
 * tool.howToUse, tool.steps, tool.tips, tool.description, tags, etc.)
 * falling back gracefully to catalog knowledge bases.
 */
export function extractToolInstructions(tool: ToolItem): {
  steps: InstructionStep[];
  proTips: string[];
  complexity: 'Easy' | 'Medium' | 'Advanced';
  readTime: string;
  categoryName: string;
} {
  const steps: InstructionStep[] = [];
  const proTips: string[] = [];

  // 1. Fetch catalog metadata fallback as baseline
  const infoContent = getToolInfoContent(tool);
  const categoryObj = CATEGORIES.find(c => c.id === tool.category);
  const categoryName = categoryObj?.name || tool.category || 'Productivity';

  // 2. Extract Steps from metadata properties
  // Hierarchy: tool.instructions -> tool.howToUse -> tool.steps -> infoContent.howToUseSteps
  const rawSteps = tool.instructions || tool.howToUse || tool.steps || infoContent?.howToUseSteps || [];

  if (Array.isArray(rawSteps)) {
    rawSteps.forEach((item, index) => {
      if (typeof item === 'string') {
        // String format: e.g. "Enter your fixed monthly investment amount..."
        // Parse possible title if there is a colon (e.g., "Input Data: Enter your fixed...")
        const parts = item.split(': ');
        let title = `Step ${index + 1}`;
        let desc = item;
        if (parts.length > 1 && parts[0].length < 40) {
          title = parts[0].trim();
          desc = parts.slice(1).join(': ').trim();
        } else {
          // Infer title from first few words or verb
          const firstWords = item.split(' ').slice(0, 3).join(' ');
          if (firstWords) {
            title = firstWords.replace(/[^a-zA-Z0-9 ]/g, '');
          }
        }
        steps.push({
          stepNumber: index + 1,
          title: title.charAt(0).toUpperCase() + title.slice(1),
          description: desc
        });
      } else if (typeof item === 'object' && item !== null) {
        // Object format: { step, title, text, tip }
        steps.push({
          stepNumber: item.step || index + 1,
          title: item.title || `Step ${index + 1}`,
          description: (item as any).text || (item as any).description || '',
          tip: item.tip
        });
      }
    });
  } else if (typeof rawSteps === 'string' && rawSteps.trim().length > 0) {
    // String with newline / numbered list: e.g. "1. Enter inputs\n2. Review..."
    const lines = rawSteps.split(/\r?\n/).filter(line => line.trim().length > 0);
    lines.forEach((line, index) => {
      const cleanLine = line.replace(/^\d+[\.\)\-]\s*/, '').trim();
      const parts = cleanLine.split(': ');
      const title = parts.length > 1 && parts[0].length < 35 ? parts[0] : `Step ${index + 1}`;
      const desc = parts.length > 1 ? parts.slice(1).join(': ') : cleanLine;
      steps.push({
        stepNumber: index + 1,
        title,
        description: desc
      });
    });
  }

  // 3. If steps are still empty, build intelligent contextual instructions based on tool archetype
  if (steps.length === 0) {
    const toolName = tool.name;
    const cat = (tool.category || '').toLowerCase();

    if (cat.includes('finance') || cat.includes('math') || tool.name.toLowerCase().includes('calculator')) {
      steps.push(
        {
          stepNumber: 1,
          title: 'Input Primary Parameters',
          description: `Enter your initial values (such as principal amount, interest rate, or base metrics) into the dedicated numeric input fields or adjust using the sliders.`
        },
        {
          stepNumber: 2,
          title: 'Set Duration or Rate Terms',
          description: `Specify the tenure in years, months, or the compounding frequency applicable to your scenario.`
        },
        {
          stepNumber: 3,
          title: 'Review Real-Time Calculations',
          description: `Observe the live output dashboard instantly updating with principal breakdowns, total maturity value, and periodic schedules.`
        },
        {
          stepNumber: 4,
          title: 'Export or Save Your Results',
          description: `Use the one-click clipboard copy or download the comprehensive PDF report for your personal records or client presentations.`
        }
      );
    } else if (cat.includes('dev') || cat.includes('code') || tool.name.toLowerCase().includes('formatter')) {
      steps.push(
        {
          stepNumber: 1,
          title: 'Paste Source Payload or Code',
          description: `Paste or type your raw JSON, code snippet, or string data directly into the left input editor canvas.`
        },
        {
          stepNumber: 2,
          title: 'Configure Formatting Settings',
          description: `Select your preferred indentation spacing (e.g. 2 spaces, 4 spaces, or 1-line minification) or encoding mode.`
        },
        {
          stepNumber: 3,
          title: 'Validate Syntax & Output',
          description: `Inspect the right-hand live formatted box. Real-time syntax validation will verify integrity and display byte size savings.`
        },
        {
          stepNumber: 4,
          title: 'Copy Converted Code',
          description: `Click the "Copy Converted Result" button to save the clean, standardized code straight to your clipboard.`
        }
      );
    } else {
      steps.push(
        {
          stepNumber: 1,
          title: 'Enter or Paste Content',
          description: `Provide your input data, manuscript, or text payload into the top workspace editor.`
        },
        {
          stepNumber: 2,
          title: 'Adjust Tool Preferences',
          description: `Fine-tune available options, filters, target formats, or unit selectors to tailor the output to your requirements.`
        },
        {
          stepNumber: 3,
          title: 'Inspect Live Computed Metrics',
          description: `Watch as results compute with sub-50ms latency inside your browser with complete privacy.`
        },
        {
          stepNumber: 4,
          title: 'Copy or Download Result',
          description: `Copy your transformed output with a single click or export formatted Markdown and PDF documents.`
        }
      );
    }
  }

  // 4. Extract Pro Tips from tool.tips or infoContent.tipsAndBestPractices
  if (tool.tips && Array.isArray(tool.tips) && tool.tips.length > 0) {
    proTips.push(...tool.tips);
  } else if (infoContent?.tipsAndBestPractices && infoContent.tipsAndBestPractices.length > 0) {
    proTips.push(...infoContent.tipsAndBestPractices);
  } else {
    proTips.push(
      `All computations execute 100% client-side in your browser for zero latency and guaranteed confidentiality.`,
      `You can use keyboard navigation (Tab & Enter) to quickly cycle through inputs and triggers.`,
      `Bookmark this tool's direct URL to access it instantly in your daily workflow.`
    );
  }

  return {
    steps,
    proTips,
    complexity: tool.complexity || 'Easy',
    readTime: tool.readTime || '2 min read',
    categoryName
  };
}

/**
 * Modern, accessible "How to Use" Section
 * Displays automatically extracted instructions, dynamic interactive step checklist,
 * pro tips, and metadata badges.
 */
export default function ToolHowToUseSection({ tool, className = '' }: ToolHowToUseSectionProps) {
  const { steps, proTips, complexity, readTime, categoryName } = useMemo(
    () => extractToolInstructions(tool),
    [tool]
  );

  // Interactive step completion checklist state
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copiedAll, setCopiedAll] = useState(false);

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps(prev => {
      const next = { ...prev, [stepNumber]: !prev[stepNumber] };
      // If completing all steps, trigger celebratory confetti
      const totalCompleted = steps.filter(s => next[s.stepNumber]).length;
      if (totalCompleted === steps.length) {
        triggerConfetti(0.4);
      }
      return next;
    });
  };

  const completedCount = useMemo(() => {
    return steps.filter(s => completedSteps[s.stepNumber]).length;
  }, [steps, completedSteps]);

  // Copy full instructions as structured text
  const handleCopyInstructions = async () => {
    const formatted = [
      `How to Use ${tool.name}:`,
      ...steps.map(s => `${s.stepNumber}. ${s.title}: ${s.description}`),
      '',
      'Pro Tips:',
      ...proTips.map(t => `• ${t}`)
    ].join('\n');

    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedAll(true);
      triggerConfetti(0.25);
      setTimeout(() => setCopiedAll(false), 2200);
    } catch (err) {
      console.error('Failed to copy instructions', err);
    }
  };

  const complexityColor = useMemo(() => {
    switch (complexity) {
      case 'Advanced':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'Medium':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Easy':
      default:
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    }
  }, [complexity]);

  return (
    <section
      id="how-to-use-section"
      aria-labelledby="how-to-use-heading"
      className={`p-6 sm:p-8 rounded-3xl bg-slate-800/90 dark:bg-[#1A2130] border border-slate-700/80 dark:border-white/10 shadow-xl space-y-6 ${className}`}
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            <BookOpen className="w-4 h-4" />
            <span>Instructions & Guidance</span>
          </div>

          <h2
            id="how-to-use-heading"
            className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight"
          >
            How to Use {tool.name}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            Follow these step-by-step instructions automatically extracted from the tool&apos;s specifications:
          </p>
        </div>

        {/* Action Button: Copy All Instructions */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={handleCopyInstructions}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-cyan-500/40 text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Copy step-by-step instructions to clipboard"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-bold">Copied Guide!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copy Guide</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Metadata Properties Badges Bar */}
      <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
        {/* Complexity Badge */}
        <span
          className={`px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1.5 ${complexityColor}`}
          title={`Complexity Level: ${complexity}`}
        >
          <Gauge className="w-3.5 h-3.5" />
          <span>{complexity} Setup</span>
        </span>

        {/* Read / Completion Time */}
        <span
          className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 flex items-center gap-1.5"
          title="Estimated reading & execution time"
        >
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{readTime}</span>
        </span>

        {/* Category Badge */}
        <span
          className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 flex items-center gap-1.5"
          title="Tool Category"
        >
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>{categoryName}</span>
        </span>

        {/* Free Alternative Badge if present */}
        {tool.freeAlternativeTo && (
          <span
            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 flex items-center gap-1.5"
            title={`100% Free alternative to paid service`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Free alternative to {tool.freeAlternativeTo}</span>
          </span>
        )}

        {/* Interactive Progress Indicator */}
        {steps.length > 0 && (
          <span className="ml-auto text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5">
            <span className="font-bold text-cyan-400">{completedCount}</span>
            <span>of {steps.length} steps completed</span>
          </span>
        )}
      </div>

      {/* Step-by-Step Instruction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step) => {
          const isDone = !!completedSteps[step.stepNumber];
          return (
            <div
              key={step.stepNumber}
              onClick={() => toggleStep(step.stepNumber)}
              className={`p-4 sm:p-5 rounded-2xl transition-all cursor-pointer select-none border flex items-start gap-3.5 group ${
                isDone
                  ? 'bg-slate-900/40 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/80 hover:bg-slate-900 border-slate-700/70 hover:border-cyan-500/40 shadow-md'
              }`}
              title="Click to toggle step completion"
            >
              {/* Step Number & Checkbox Circle */}
              <button
                type="button"
                aria-label={`Mark Step ${step.stepNumber} as done`}
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 font-mono font-bold text-xs transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/30'
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <span>0{step.stepNumber}</span>
                )}
              </button>

              {/* Step Content */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3
                    className={`text-sm font-bold font-display transition-colors ${
                      isDone
                        ? 'text-emerald-300 line-through opacity-85'
                        : 'text-slate-100 group-hover:text-cyan-300'
                    }`}
                  >
                    {step.title}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-cyan-400 shrink-0 transition-colors">
                    {isDone ? 'Done ✓' : 'Step ' + step.stepNumber}
                  </span>
                </div>

                <p
                  className={`text-xs sm:text-sm font-sans leading-relaxed transition-colors ${
                    isDone ? 'text-slate-400' : 'text-slate-300'
                  }`}
                  style={{ lineHeight: '1.6' }}
                >
                  {step.description}
                </p>

                {step.tip && (
                  <div className="mt-2 p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
                    <Lightbulb className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span>{step.tip}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pro Tips & Best Practices Callout Card */}
      {proTips.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 to-slate-900/60 border border-amber-500/30 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
            <Lightbulb className="w-4 h-4" />
            <span>Pro Tips & Workflow Best Practices</span>
          </div>

          <ul className="space-y-2 text-xs sm:text-sm text-slate-300 font-sans">
            {proTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tool Tags Chips (if present on tool metadata) */}
      {tool.tags && tool.tags.length > 0 && (
        <div className="pt-2 flex items-center gap-2 flex-wrap border-t border-slate-700/60">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Tag className="w-3 h-3 text-cyan-400" />
            <span>Keywords & Tags:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {tool.tags.map((t, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-700 text-[11px] font-mono"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
