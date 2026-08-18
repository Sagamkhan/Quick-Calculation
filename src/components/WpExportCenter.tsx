import React, { useState } from "react";
import { X, Copy, Check, Globe, HelpCircle, Code, FileText, Settings, HelpCircle as HelpIcon } from "lucide-react";

interface WpExportCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WpExportCenter({ isOpen, onClose }: WpExportCenterProps) {
  const [activeTab, setActiveTab] = useState<"blueprint" | "css" | "javascript" | "html">("blueprint");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // 1. Raw Isolated CSS to paste in WP Customizer
  const isolatedCss = `/* ==========================================================================
   TOOLHUB PORTABILITY SYSTEM - CUSTOM WORDPRESS CUSTOMIZER CSS
   Paste this into Appearance > Customize > Additional CSS
   ========================================================================== */

/* Custom Variables & Colors Namespace */
:root {
  --wp-th-indigo: #4f46e5;
  --wp-th-violet: #7c3aed;
  --wp-th-neutral-dark: #0f172a;
  --wp-th-neutral-light: #f8fafc;
}

/* Fluid Aesthetic Grid Backgrounds */
.wp-th-grid-bg {
  background-image: radial-gradient(rgba(79, 70, 229, 0.08) 1px, transparent 1px);
  background-size: 24px 24px;
}

/* CSS Theme Transitions */
.wp-th-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.wp-th-card:hover {
  transform: translateY(-4px);
  border-color: rgba(79, 70, 229, 0.3);
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.1);
}

/* Custom CSS Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(79, 70, 229, 0.2);
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(79, 70, 229, 0.4);
}

/* Responsive Star Rating Display */
.wp-th-star-filled {
  color: #fbbf24;
  fill: #fbbf24;
}

/* Custom Gradients Mapping for Elementor Columns */
.wp-th-hero-gradient-text {
  background: linear-gradient(to right, #4f46e5, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}`;

  // 2. Modular JS scripts powering calculators & search in pure Vanilla JS
  const vanillaJsCode = `/**
 * ==========================================================================
 * TOOLHUB PORTABILITY SYSTEM - MODULAR VANILLA JAVASCRIPT ENGINE
 * Paste this inside an Elementor "HTML Widget" or a Footer Script Plugin
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", function() {
  
  // === MODULE 1: DARK MODE TOGGLE ===
  const themeToggleBtn = document.querySelector("#wp-theme-toggle");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function() {
      document.documentElement.classList.toggle("dark");
      const isDark = document.documentElement.classList.contains("dark");
      localStorage.setItem("wp-th-theme", isDark ? "dark" : "light");
    });
  }

  // === MODULE 2: DIRECTORY SEARCH FILTER ===
  const searchInput = document.querySelector("#wp-tool-search");
  const toolCards = document.querySelectorAll(".wp-tool-card");
  
  if (searchInput && toolCards.length > 0) {
    searchInput.addEventListener("input", function(e) {
      const query = e.target.value.toLowerCase().trim();
      
      toolCards.forEach(function(card) {
        const name = card.querySelector(".tool-name")?.textContent.toLowerCase() || "";
        const desc = card.querySelector(".tool-desc")?.textContent.toLowerCase() || "";
        const replaced = card.querySelector(".tool-replaced")?.textContent.toLowerCase() || "";
        const tags = card.getAttribute("data-tags")?.toLowerCase() || "";
        
        const isMatch = name.includes(query) || 
                        desc.includes(query) || 
                        replaced.includes(query) || 
                        tags.includes(query);
                        
        if (isMatch) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  }

  // === MODULE 3: INTERACTIVE SUBSCRIPTION CALCULATOR ===
  const subCheckboxes = document.querySelectorAll(".wp-sub-checkbox");
  const monthlySavingsEl = document.querySelector("#wp-monthly-savings");
  const annualSavingsEl = document.querySelector("#wp-annual-savings");

  function recalculateSavings() {
    let sum = 0;
    subCheckboxes.forEach(function(checkbox) {
      if (checkbox.checked) {
        sum += parseFloat(checkbox.getAttribute("data-cost") || "0");
      }
    });

    if (monthlySavingsEl) monthlySavingsEl.textContent = "$" + sum.toFixed(2);
    if (annualSavingsEl) annualSavingsEl.textContent = "$" + (sum * 12).toFixed(2);
  }

  subCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener("change", recalculateSavings);
  });

  // Run initial calc
  recalculateSavings();

});`;

  // 3. Clean HTML scaffold mapping to standard Elementor layout
  const semanticHtml = `<!-- ELEMENTOR SECTIONS TEMPLATE MARKUP -->

<!-- HERO SECTION: 2-COLUMN STRUCTURE -->
<section class="elementor-section wp-th-grid-bg" style="padding: 80px 0; background-color: #ffffff;">
  <div class="elementor-container" style="display: flex; flex-wrap: wrap; max-width: 1200px; margin: 0 auto;">
    
    <!-- LEFT COLUMN: VALUE PROP (WIDTH: 60%) -->
    <div class="elementor-column" style="width: 60%; padding: 20px;">
      <h1 style="font-family: 'Space Grotesk', sans-serif; font-size: 48px; font-weight: 800; color: #0f172a;">
        Stop Paying For <span class="wp-th-hero-gradient-text" style="color: #4f46e5;">These Tools</span>
      </h1>
      <p style="font-size: 16px; color: #64748b; line-height: 1.6; margin-top: 15px;">
        Supercharge your workflow without subscription fatigue. Discover elite, 100% free web apps, open-source softwares, and professional utilities mapped directly to expensive corporate platforms.
      </p>
    </div>
    
    <!-- RIGHT COLUMN: SAVINGS CARD (WIDTH: 40%) -->
    <div class="elementor-column" style="width: 40%; padding: 20px;">
      <div class="wp-th-card">
        <h3 style="font-size: 18px; font-weight: 700; color: #0f172a;">Savings Preview</h3>
        <p style="font-size: 36px; font-weight: 800; color: #10b981; margin: 10px 0;">$209.94 <span style="font-size: 14px; color: #94a3b8;">/ mo</span></p>
        <span style="font-size: 12px; font-weight: 700; color: #0d9488;">Annual Savings: $2,519.28</span>
      </div>
    </div>

  </div>
</section>

<!-- COMPARISON MATRIX ROW TEMPLATE -->
<div class="wp-th-matrix-row" style="display: flex; align-items: center; justify-content: space-between; padding: 16px; border-bottom: 1px solid #e2e8f0;">
  <div style="display: flex; align-items: center; gap: 12px;">
    <span style="font-size: 20px;">🎨</span>
    <div>
      <h4 style="font-weight: 700; margin: 0;">Adobe Photoshop</h4>
      <span style="font-size: 10px; color: #ef4444;">$22.99/mo</span>
    </div>
  </div>
  <span style="color: #10b981; font-weight: 700;">➜</span>
  <div>
    <h4 style="font-weight: 700; color: #10b981; margin: 0;">Photopea</h4>
    <span style="font-size: 10px; color: #64748b;">100% Free Equivalent</span>
  </div>
</div>`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/70 p-4 backdrop-blur-sm sm:p-6 lg:p-8 animate-fade-in">
      
      {/* Sliding Dialog Card */}
      <div className="relative flex h-full max-h-[85vh] w-full max-w-5xl flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl transition-colors dark:border-gray-800 dark:bg-gray-950">
        
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 p-1 text-white shadow-md">
              <Globe className="h-full w-full" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-gray-900 dark:text-white">
                WordPress & Elementor Export Portal
              </h2>
              <p className="font-sans text-[11px] text-gray-400">
                Copy isolated blueprints, custom CSS styles, and vanilla JS calculations for quick WordPress setups.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-white"
            aria-label="Close Portal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-gray-100 px-6 py-2.5 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 gap-1 overflow-x-auto">
          {[
            { id: "blueprint", name: "Elementor Layout Guide", icon: FileText },
            { id: "css", name: "Custom CSS Extractor", icon: Code },
            { id: "javascript", name: "Vanilla JS Engine", icon: Settings },
            { id: "html", name: "HTML Code Snippet", icon: Code }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 font-display text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* === TAB 1: BLUEPRINT === */}
          {activeTab === "blueprint" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-blue-500/10 bg-blue-50/50 p-4 dark:bg-blue-950/20 text-xs text-blue-700 dark:text-blue-400 leading-relaxed font-medium">
                ℹ️ <strong>WordPress Mapping Blueprint:</strong> Each visual section in our React app has been optimized to map directly to standard, out-of-the-box Elementor components. Read the structure layout below to replicate it inside your WordPress page editor.
              </div>

              <div className="space-y-4">
                {/* Header Blueprint */}
                <div className="rounded-xl border border-gray-100 bg-gray-50/30 p-4.5 dark:border-gray-800/80 dark:bg-gray-900/10">
                  <h4 className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Section 1: Sticky Header
                  </h4>
                  <p className="font-sans text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    - <strong>Elementor Structure:</strong> 1 Section, 3 Columns (Widths: 25% | 50% | 25%). Set Section to "Sticky: Top" under Advanced options.<br />
                    - <strong>Column 1 (Logo):</strong> Elementor Image or Site Logo widget.<br />
                    - <strong>Column 2 (Links):</strong> WordPress Navigation Menu widget.<br />
                    - <strong>Column 3 (Search/Toggle):</strong> Custom HTML widget. Insert the input bar styled with Tailwind, or use a Search Form widget paired with a Theme Toggle switch.
                  </p>
                </div>

                {/* Hero Blueprint */}
                <div className="rounded-xl border border-gray-100 bg-gray-50/30 p-4.5 dark:border-gray-800/80 dark:bg-gray-900/10">
                  <h4 className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Section 2: Hero Value Proposition
                  </h4>
                  <p className="font-sans text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    - <strong>Elementor Structure:</strong> 1 Section, 2 Columns (Asymmetric Widths: 60% Left | 40% Right). Set Section Padding to 80px Top/Bottom.<br />
                    - <strong>Left Column:</strong> Heading widget ("Stop Paying For These Tools"), Text Editor widget for supportive paragraph, and Icon List widget mapping your custom checkboxes.<br />
                    - <strong>Right Column:</strong> Inner Section containing a beautiful background (white/slate gray) with custom border radius and thin shadow. Insert a Title widget, several Counter blocks or horizontal list elements, and a Button widget linking down to the detailed calculator page.
                  </p>
                </div>

                {/* Matrix Blueprint */}
                <div className="rounded-xl border border-gray-100 bg-gray-50/30 p-4.5 dark:border-gray-800/80 dark:bg-gray-900/10">
                  <h4 className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Section 3: The Value Comparison Matrix
                  </h4>
                  <p className="font-sans text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    - <strong>Elementor Structure:</strong> 1 Full-width Section. Heading widget and Text Editor widget centering descriptions.<br />
                    - <strong>Row Component Mapping:</strong> Replicate the row styling using Elementor's <strong>Inner Section</strong> with 5 Columns:<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;* Col 1 (Paid tool info): Logo icon + Heading + Subtitle.<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;* Col 2 (Price): Text Editor containing the red monthly price.<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;* Col 3 (Arrow): Icon widget displaying arrow pointing right.<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;* Col 4 (Free Recommended): Star rating element + Emerald heading alternative name.<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;* Col 5 (CTA): Button widget styled with emerald colors.
                  </p>
                </div>

                {/* Hub & Calculators Blueprint */}
                <div className="rounded-xl border border-gray-100 bg-gray-50/30 p-4.5 dark:border-gray-800/80 dark:bg-gray-900/10">
                  <h4 className="font-display text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Section 4: Tool & Calculator Hub (Your 250+ Tools Library)
                  </h4>
                  <p className="font-sans text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    - <strong>Elementor Structure:</strong> 1 Section, Grid Layout mapping standard cards.<br />
                    - <strong>Interactive JS widgets (Calculators, search):</strong> To preserve full interactivity inside WordPress, add an <strong>HTML Widget</strong> inside your Elementor Column and copy-paste the Vanilla JS scripts and custom HTML blueprints provided in the adjacent tabs. The JS automatically queries the DOM classes and updates math calculations instantaneously!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* === TAB 2: CSS === */}
          {activeTab === "css" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs font-bold text-gray-500 dark:text-gray-400">
                  ISOLATED STYLES FOR THEME CUSTOMIZER
                </span>
                <button
                  onClick={() => triggerCopy(isolatedCss, "css")}
                  className="inline-flex items-center gap-1 rounded bg-indigo-600 px-3 py-1.5 font-sans text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer"
                >
                  {copiedText === "css" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedText === "css" ? "Copied!" : "Copy CSS Code"}</span>
                </button>
              </div>

              <div className="relative rounded-xl bg-gray-900 border border-gray-800 overflow-hidden text-left">
                <pre className="p-4 overflow-x-auto max-h-[300px]">
                  <code className="font-mono text-xs text-indigo-300 leading-relaxed block">
                    {isolatedCss}
                  </code>
                </pre>
              </div>
            </div>
          )}

          {/* === TAB 3: JAVASCRIPT === */}
          {activeTab === "javascript" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs font-bold text-gray-500 dark:text-gray-400">
                  VANILLA JAVASCRIPT ENGINE (CALCS & FILTERS)
                </span>
                <button
                  onClick={() => triggerCopy(vanillaJsCode, "js")}
                  className="inline-flex items-center gap-1 rounded bg-indigo-600 px-3 py-1.5 font-sans text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer"
                >
                  {copiedText === "js" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedText === "js" ? "Copied!" : "Copy JS Code"}</span>
                </button>
              </div>

              <div className="relative rounded-xl bg-gray-900 border border-gray-800 overflow-hidden text-left">
                <pre className="p-4 overflow-x-auto max-h-[300px]">
                  <code className="font-mono text-xs text-indigo-300 leading-relaxed block">
                    {vanillaJsCode}
                  </code>
                </pre>
              </div>
            </div>
          )}

          {/* === TAB 4: HTML === */}
          {activeTab === "html" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs font-bold text-gray-500 dark:text-gray-400">
                  SEMANTIC HTML Blueprints FOR ELEMENTOR CUSTOM HTML WIDGET
                </span>
                <button
                  onClick={() => triggerCopy(semanticHtml, "html")}
                  className="inline-flex items-center gap-1 rounded bg-indigo-600 px-3 py-1.5 font-sans text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer"
                >
                  {copiedText === "html" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedText === "html" ? "Copied!" : "Copy HTML Code"}</span>
                </button>
              </div>

              <div className="relative rounded-xl bg-gray-900 border border-gray-800 overflow-hidden text-left">
                <pre className="p-4 overflow-x-auto max-h-[300px]">
                  <code className="font-mono text-xs text-indigo-300 leading-relaxed block">
                    {semanticHtml}
                  </code>
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Footer info bar inside dialog */}
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 text-center text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900/60">
          Pro-designed code exports. Convert from React to WordPress Elementor templates seamlessly.
        </div>

      </div>
    </div>
  );
}
