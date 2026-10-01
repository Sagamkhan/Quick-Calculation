/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from "react";
import {
  Check,
  Copy,
  Sparkles,
  Search,
  Download,
  Share2,
  ChevronRight,
  TrendingUp,
  Coins,
  Calculator,
  Calendar,
  Activity,
  Ruler,
  Clock,
  Code,
  Lock,
  Percent,
  Droplet,
  RefreshCw,
  Zap,
  Info,
  Scale
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  CALCULATOR_CATEGORIES,
  DEFAULT_INPUTS,
  runCalculation,
  CalcItem,
  CalcCategory
} from "../utils/calculatorLogic";
import { useToolEngine } from "../hooks/useToolEngine";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface InteractiveCalculatorsProps {
  forceCalcId?: string;
  forceCategory?: string;
  isStandalone?: boolean;
  favorites?: any[];
  onToggleFavorite?: (item: any) => void;
}

export default function InteractiveCalculators({
  forceCalcId,
  forceCategory,
  isStandalone = false,
  favorites,
  onToggleFavorite
}: InteractiveCalculatorsProps = {}) {
  const [activeCategory, setActiveCategory] = useState<string>("finance");
  const [activeCalcId, setActiveCalcId] = useState<string>("sip");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inputs, setInputs] = useState<Record<string, any>>(DEFAULT_INPUTS);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  
  // Sync router props to states
  useEffect(() => {
    if (forceCalcId) {
      setActiveCalcId(forceCalcId);
      const category = CALCULATOR_CATEGORIES.find(cat => cat.items.some(item => item.id === forceCalcId));
      if (category) {
        setActiveCategory(category.id);
      }
    } else if (forceCategory) {
      setActiveCategory(forceCategory);
      const category = CALCULATOR_CATEGORIES.find(cat => cat.id === forceCategory);
      if (category && category.items.length > 0) {
        // Only override if active calc is not already in that category
        const isCurrentInCat = category.items.some(it => it.id === activeCalcId);
        if (!isCurrentInCat) {
          setActiveCalcId(category.items[0].id);
        }
      }
    }
  }, [forceCalcId, forceCategory]);
  
  // Custom Toast/Copy State
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  // Keep scientific calculator internal typing expression separate
  const [scientificExpr, setScientificExpr] = useState<string>("2 * (15 + 4)");

  // Change active calculator and scroll into workspace
  const selectCalculator = (calcId: string, catId: string) => {
    setActiveCalcId(calcId);
    setActiveCategory(catId);
    
    if (isStandalone) {
      window.location.hash = `#/calculator/${calcId}`;
    } else {
      // Smooth scroll to work container for mobile devices
      const element = document.getElementById("calculator-workspace");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Trigger Toast Notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Find active items
  const activeCalc = useMemo(() => {
    return CALCULATOR_CATEGORIES.flatMap(c => c.items).find(item => item.id === activeCalcId) || CALCULATOR_CATEGORIES[0].items[0];
  }, [activeCalcId]);

  const activeCategoryObject = useMemo(() => {
    return CALCULATOR_CATEGORIES.find(c => c.id === activeCategory) || CALCULATOR_CATEGORIES[0];
  }, [activeCategory]);

  // Handle Input Changes
  const updateInput = (calcId: string, key: string, val: any) => {
    setInputs(prev => ({
      ...prev,
      [calcId]: {
        ...(prev[calcId] || DEFAULT_INPUTS[calcId]),
        [key]: val
      }
    }));
  };

  // Tool Engine Hook instance for standardized state, validation & calculation
  const activeToolInputs = useMemo(() => {
    return inputs[activeCalcId] || DEFAULT_INPUTS[activeCalcId] || {};
  }, [inputs, activeCalcId]);

  const toolEngine = useToolEngine({
    toolId: activeCalcId,
    initialInputs: activeToolInputs,
    autoCalculate: true,
    calculateFn: (inp) => {
      if (activeCalcId === "scientific") {
        return runCalculation("scientific", { expression: scientificExpr });
      }
      return runCalculation(activeCalcId, inp);
    }
  });

  // Sync engine inputs state when active tool or input values update
  useEffect(() => {
    toolEngine.setInputs(activeToolInputs);
  }, [activeCalcId, activeToolInputs]);

  // Calculate results for the current active calculator using tool engine
  const calcResult = toolEngine.result ?? runCalculation(activeCalcId, activeToolInputs);

  // Search filter across all 30 calculators
  const filteredCalculators = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return CALCULATOR_CATEGORIES.flatMap(cat => 
      cat.items.map(item => ({ ...item, categoryId: cat.id, categoryEmoji: cat.emoji }))
    ).filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query) ||
      item.title.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Scientific keyboard action helper
  const handleScientificKey = (key: string) => {
    if (key === "C") {
      setScientificExpr("");
    } else if (key === "⌫") {
      setScientificExpr(prev => prev.slice(0, -1));
    } else if (key === "=") {
      // triggers recalculation
      const res = runCalculation("scientific", { expression: scientificExpr });
      setScientificExpr(res.result.toString());
    } else {
      setScientificExpr(prev => prev + key);
    }
  };

  // Custom clipboard share formatter
  const handleShareResults = () => {
    const currentInputs = inputs[activeCalcId] || DEFAULT_INPUTS[activeCalcId];
    let shareText = `📊 ToolHub India | ${activeCalc.title}\n\n`;
    shareText += `📝 Description: ${activeCalc.desc}\n\n`;
    shareText += `⚙️ Parameters Configured:\n`;
    
    Object.entries(currentInputs).forEach(([key, val]) => {
      shareText += `  • ${key.toUpperCase()}: ${val}\n`;
    });
    
    shareText += `\n✨ Calculated Outcome:\n`;
    
    if (activeCalcId === "sip") {
      shareText += `  - Total Invested: ₹${calcResult.totalInvestment?.toLocaleString('en-IN')}\n`;
      shareText += `  - Est. Wealth Returns: ₹${calcResult.estReturns?.toLocaleString('en-IN')}\n`;
      shareText += `  - Projected Total: ₹${calcResult.totalWealth?.toLocaleString('en-IN')}\n`;
    } else if (activeCalcId === "compound") {
      shareText += `  - Principal Invested: ₹${calcResult.principal?.toLocaleString('en-IN')}\n`;
      shareText += `  - Interest Gained: ₹${calcResult.interestEarned?.toLocaleString('en-IN')}\n`;
      shareText += `  - Total Portfolio: ₹${calcResult.totalAmount?.toLocaleString('en-IN')}\n`;
    } else if (activeCalcId === "emi") {
      shareText += `  - Monthly EMI Amount: ₹${calcResult.emi?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/mo\n`;
      shareText += `  - Interest Payable: ₹${calcResult.totalInterest?.toLocaleString('en-IN')}\n`;
      shareText += `  - Total Cost of Loan: ₹${calcResult.totalAmount?.toLocaleString('en-IN')}\n`;
    } else if (activeCalcId === "buy_rent") {
      shareText += `  - Buying Net Worth (10yr): ₹${calcResult.buyingNetWealth?.toLocaleString('en-IN')}\n`;
      shareText += `  - Renting Net Worth (10yr): ₹${calcResult.rentingNetWealth?.toLocaleString('en-IN')}\n`;
      shareText += `  - Recommendation: ${calcResult.betterOption} wins by ₹${calcResult.diff?.toLocaleString('en-IN')}\n`;
    } else if (activeCalcId === "crypto") {
      shareText += `  - Net Coin Profit/Loss: ₹${calcResult.netProfit?.toLocaleString('en-IN')} (${calcResult.roi?.toFixed(2)}% ROI)\n`;
    } else if (activeCalcId === "gst") {
      shareText += `  - Net Base Cost: ₹${calcResult.baseAmount?.toLocaleString('en-IN')}\n`;
      shareText += `  - CGST Amount (Half): ₹${calcResult.cgst?.toLocaleString('en-IN')}\n`;
      shareText += `  - SGST Amount (Half): ₹${calcResult.sgst?.toLocaleString('en-IN')}\n`;
      shareText += `  - Total Invoice Value: ₹${calcResult.totalAmount?.toLocaleString('en-IN')}\n`;
    } else {
      shareText += `  - Calculated Result Value: ${JSON.stringify(calcResult)}\n`;
    }

    shareText += `\n🔗 Try all 30 professional calculators completely free on ToolHub India!`;
    
    navigator.clipboard.writeText(shareText);
    triggerToast("Calculation results copied to clipboard! Share it anywhere.");
  };

  // Generate beautiful printable layout for any of the 30 calculators using jsPDF and html2canvas
  const downloadPdfReport = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    triggerToast("Compiling calculated analytical vectors into your PDF summary report...");

    const currentInputs = inputs[activeCalcId] || DEFAULT_INPUTS[activeCalcId];
    
    let inputRows = "";
    Object.entries(currentInputs).forEach(([key, val]) => {
      let label = key.replace(/_/g, " ").replace(/([A-Z])/g, ' $1').toUpperCase();
      let displayVal = val;
      if (key === "monthly" || key === "principal" || key === "price" || key === "rent" || key === "investment" || key === "cost" || key === "amount" || key === "ctc" || key === "income" || key === "expenses" || key === "capital" || key === "revenue" || key === "original" || key === "costPrice" || key === "aov" || key === "hourlyRate") {
        displayVal = `₹${parseFloat(String(val)).toLocaleString('en-IN')}`;
      } else if (key === "rate" || key === "appreciation" || key === "inflation" || key === "returnRate" || key === "pf" || key === "fee" || key === "discount" || key === "convRate") {
        displayVal = `${val}%`;
      } else if (key === "years") {
        displayVal = `${val} Years`;
      }
      inputRows += `
        <tr>
          <td class="label">${label}</td>
          <td class="value">${displayVal}</td>
        </tr>
      `;
    });

    let resultRows = "";
    if (activeCalcId === "sip") {
      resultRows = `
        <tr><td class="label">Total Invested Principal</td><td class="value">₹${calcResult.totalInvestment?.toLocaleString('en-IN')}</td></tr>
        <tr><td class="label">Estimated Return Gained</td><td class="value" style="color: #10b981;">₹${calcResult.estReturns?.toLocaleString('en-IN')}</td></tr>
        <tr class="highlight-row"><td class="label">Projected Wealth Value</td><td class="value">₹${calcResult.totalWealth?.toLocaleString('en-IN')}</td></tr>
      `;
    } else if (activeCalcId === "compound") {
      resultRows = `
        <tr><td class="label">Principal Investment</td><td class="value">₹${calcResult.principal?.toLocaleString('en-IN')}</td></tr>
        <tr><td class="label">Interest Accrued</td><td class="value" style="color: #10b981;">₹${calcResult.interestEarned?.toLocaleString('en-IN')}</td></tr>
        <tr class="highlight-row"><td class="label">Total Future Capital</td><td class="value">₹${calcResult.totalAmount?.toLocaleString('en-IN')}</td></tr>
      `;
    } else if (activeCalcId === "emi") {
      resultRows = `
        <tr><td class="label">Loan Amount (Principal)</td><td class="value">₹${currentInputs.principal?.toLocaleString('en-IN')}</td></tr>
        <tr><td class="label">Monthly EMI Installment</td><td class="value" style="color: #4f46e5;">₹${calcResult.emi?.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / mo</td></tr>
        <tr><td class="label">Total Interest Payable</td><td class="value" style="color: #f59e0b;">₹${calcResult.totalInterest?.toLocaleString('en-IN')}</td></tr>
        <tr class="success-row"><td class="label">Total Outstanding Cost (P + I)</td><td class="value">₹${calcResult.totalAmount?.toLocaleString('en-IN')}</td></tr>
      `;
    } else if (activeCalcId === "gst") {
      resultRows = `
        <tr><td class="label">Net Base Cost</td><td class="value">₹${calcResult.baseAmount?.toLocaleString('en-IN')}</td></tr>
        <tr><td class="label">CGST (Central Tax Half)</td><td class="value">₹${calcResult.cgst?.toLocaleString('en-IN')}</td></tr>
        <tr><td class="label">SGST (State Tax Half)</td><td class="value">₹${calcResult.sgst?.toLocaleString('en-IN')}</td></tr>
        <tr><td class="label">GST Slabs Collected</td><td class="value" style="color: #f59e0b;">₹${calcResult.gstAmount?.toLocaleString('en-IN')}</td></tr>
        <tr class="success-row"><td class="label">Total Invoice Bill</td><td class="value">₹${calcResult.totalAmount?.toLocaleString('en-IN')}</td></tr>
      `;
    } else if (activeCalcId === "salary") {
      resultRows = `
        <tr><td class="label">Annual CTC</td><td class="value">₹${currentInputs.ctc?.toLocaleString('en-IN')}</td></tr>
        <tr><td class="label">Taxable Income</td><td class="value">₹${calcResult.taxableIncome?.toLocaleString('en-IN')}</td></tr>
        <tr><td class="label">Yearly Income Tax</td><td class="value" style="color: #ef4444;">₹${calcResult.annualTax?.toLocaleString('en-IN')}</td></tr>
        <tr><td class="label">Provident Fund Deduction</td><td class="value">₹${calcResult.monthlyPf?.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / mo</td></tr>
        <tr class="success-row"><td class="label">Monthly Take-Home Cash</td><td class="value">₹${Math.max(0, calcResult.monthlyTakeHome)?.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / mo</td></tr>
      `;
    } else {
      // General rows
      resultRows = Object.entries(calcResult).map(([k, v]) => {
        let displayVal = typeof v === "number" ? v.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : String(v);
        if (k.toLowerCase().includes("cost") || k.toLowerCase().includes("revenue") || k.toLowerCase().includes("gain") || k.toLowerCase().includes("profit") || k.toLowerCase().includes("wealth") || k.toLowerCase().includes("pay") || k.toLowerCase().includes("target") || k.toLowerCase().includes("rate")) {
          if (typeof v === "number") displayVal = `₹${v.toLocaleString('en-IN', { maximumFractionDigits: 1 })}`;
        }
        let cleanLabel = k.replace(/_/g, " ").replace(/([A-Z])/g, ' $1').replace(/^\w/, c => c.toUpperCase());
        return `
          <tr>
            <td class="label" style="text-transform: capitalize;">${cleanLabel}</td>
            <td class="value">${displayVal}</td>
          </tr>
        `;
      }).join("");
    }

    const reportHtml = `
      <div class="pdf-wrapper">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@500;700&display=swap');
          
          .pdf-wrapper {
            width: 800px;
            padding: 50px;
            background-color: #ffffff;
            color: #1e293b;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            box-sizing: border-box;
            border-top: 8px solid #4f46e5;
          }
          
          .pdf-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #f1f5f9;
            padding-bottom: 24px;
            margin-bottom: 30px;
          }
          
          .pdf-brand {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          
          .pdf-logo {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: #ffffff;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: 700;
            font-size: 18px;
            padding: 6px 12px;
            border-radius: 8px;
            letter-spacing: -0.5px;
            box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.1);
          }
          
          .pdf-title-group h1 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 20px;
            font-weight: 700;
            margin: 0;
            color: #0f172a;
            letter-spacing: -0.5px;
            line-height: 1.1;
          }
          
          .pdf-brand-tagline {
            font-size: 10px;
            font-weight: 700;
            color: #6366f1;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-top: 4px;
          }
          
          .pdf-meta {
            text-align: right;
          }
          
          .pdf-meta-label {
            font-size: 9px;
            font-weight: 700;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          .pdf-meta-value {
            font-size: 14px;
            font-weight: 800;
            color: #0f172a;
            margin-top: 2px;
          }
          
          .pdf-meta-date {
            font-size: 11px;
            color: #64748b;
            font-weight: 500;
            margin-top: 4px;
          }
          
          .pdf-summary-card {
            background: linear-gradient(135deg, rgba(79, 70, 229, 0.02) 0%, rgba(124, 58, 237, 0.02) 100%);
            border: 1px solid rgba(79, 70, 229, 0.06);
            padding: 24px;
            border-radius: 16px;
            margin-bottom: 30px;
          }
          
          .pdf-category-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background-color: rgba(79, 70, 229, 0.08);
            color: #4f46e5;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 4px 10px;
            border-radius: 99px;
            margin-bottom: 12px;
          }
          
          .pdf-summary-card h2 {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 24px;
            font-weight: 700;
            color: #0f172a;
            margin: 0 0 8px 0;
            letter-spacing: -0.5px;
          }
          
          .pdf-summary-card p {
            font-size: 13px;
            line-height: 1.6;
            color: #475569;
            margin: 0;
          }
          
          .pdf-hero-metric {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: #ffffff;
            padding: 28px;
            border-radius: 16px;
            margin-bottom: 35px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.15);
          }
          
          .pdf-hero-metric-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: rgba(255, 255, 255, 0.85);
          }
          
          .pdf-hero-metric-value {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 32px;
            font-weight: 700;
            margin-top: 6px;
            letter-spacing: -1px;
          }
          
          .pdf-hero-metric-detail-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: rgba(255, 255, 255, 0.85);
          }
          
          .pdf-hero-metric-detail-value {
            font-size: 14px;
            font-weight: 600;
            margin-top: 6px;
          }
          
          .pdf-grid {
            display: flex;
            gap: 30px;
            margin-bottom: 35px;
            align-items: flex-start;
          }
          
          .pdf-col {
            flex: 1;
          }
          
          .pdf-col-header {
            font-size: 11px;
            font-weight: 800;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e2e8f0;
            margin-bottom: 15px;
          }
          
          .pdf-col-header.results {
            color: #4f46e5;
            border-bottom: 1px solid rgba(79, 70, 229, 0.2);
          }
          
          .pdf-table {
            width: 100%;
            border-collapse: collapse;
          }
          
          .pdf-table td {
            padding: 10px 0;
            font-size: 12px;
          }
          
          .pdf-table td.label {
            font-weight: 600;
            color: #64748b;
            text-align: left;
          }
          
          .pdf-table td.value {
            font-weight: 800;
            color: #0f172a;
            text-align: right;
          }
          
          .pdf-table tr.highlight-row {
            background-color: rgba(79, 70, 229, 0.03);
          }
          
          .pdf-table tr.highlight-row td {
            padding: 12px 10px;
            border-radius: 6px;
          }
          
          .pdf-table tr.highlight-row td.label {
            color: #4f46e5;
            font-weight: 700;
          }
          
          .pdf-table tr.highlight-row td.value {
            color: #4f46e5;
            font-weight: 800;
          }
          
          .pdf-table tr.success-row {
            background-color: rgba(16, 185, 129, 0.03);
          }
          
          .pdf-table tr.success-row td {
            padding: 12px 10px;
            border-radius: 6px;
          }
          
          .pdf-table tr.success-row td.label {
            color: #10b981;
            font-weight: 700;
          }
          
          .pdf-table tr.success-row td.value {
            color: #10b981;
            font-weight: 800;
          }
          
          .pdf-savings-banner {
            background-color: #faf5ff;
            border-left: 4px solid #c084fc;
            border-radius: 8px;
            padding: 16px 20px;
            margin-bottom: 40px;
            display: flex;
            align-items: center;
            gap: 14px;
          }
          
          .pdf-savings-icon {
            font-size: 26px;
          }
          
          .pdf-savings-title {
            font-size: 13px;
            font-weight: 800;
            color: #6b21a8;
            margin: 0 0 4px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .pdf-savings-desc {
            font-size: 11px;
            color: #581c87;
            margin: 0;
            line-height: 1.5;
          }
          
          .pdf-footer {
            border-top: 1px solid #e2e8f0;
            padding-top: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          
          .pdf-footer-left {
            font-size: 10px;
          }
          
          .pdf-footer-brand {
            font-weight: 800;
            color: #4f46e5;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .pdf-footer-tagline {
            color: #94a3b8;
            margin-top: 4px;
          }
          
          .pdf-footer-copy {
            color: #cbd5e1;
            margin-top: 2px;
          }
          
          .pdf-footer-right {
            text-align: right;
            max-width: 320px;
          }
          
          .pdf-footer-right-text {
            font-size: 9px;
            color: #64748b;
            line-height: 1.4;
          }
          
          .pdf-footer-url {
            font-size: 11px;
            font-weight: 800;
            color: #4f46e5;
            margin-top: 6px;
            letter-spacing: 0.5px;
          }
        </style>

        <!-- Header bar -->
        <div class="pdf-header">
          <div>
            <div class="pdf-brand">
              <div class="pdf-logo">QC</div>
              <div class="pdf-title-group">
                <h1>QUICK CALCULATOR</h1>
                <div class="pdf-brand-tagline">100% Free & Private Online Utilities</div>
              </div>
            </div>
          </div>
          <div class="pdf-meta">
            <div class="pdf-meta-label">Generated Statement</div>
            <div class="pdf-meta-value">#${Math.floor(100000 + Math.random() * 900000)}</div>
            <div class="pdf-meta-date">Date: ${new Date().toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'})}</div>
          </div>
        </div>

        <!-- Document Title/Meta -->
        <div class="pdf-summary-card">
          <div class="pdf-category-badge">
            <span>${activeCategoryObject.emoji}</span>
            <span>${activeCategoryObject.name} Catalog</span>
          </div>
          <h2>${activeCalc.name} Report Summary</h2>
          <p>${activeCalc.desc}</p>
        </div>

        <!-- Highlight Primary Metric Summary -->
        <div class="pdf-hero-metric">
          <div>
            <div class="pdf-hero-metric-label">Primary Metric Output</div>
            <div class="pdf-hero-metric-value">
              ${
                activeCalcId === "sip" ? `₹${calcResult.totalWealth?.toLocaleString('en-IN')}` :
                activeCalcId === "compound" ? `₹${calcResult.totalAmount?.toLocaleString('en-IN')}` :
                activeCalcId === "emi" ? `₹${calcResult.emi?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/mo` :
                activeCalcId === "gst" ? `₹${calcResult.totalAmount?.toLocaleString('en-IN')}` :
                activeCalcId === "salary" ? `₹${Math.max(0, calcResult.monthlyTakeHome)?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}/mo` :
                calcResult.result !== undefined ? calcResult.result : "Calculation Done"
              }
            </div>
          </div>
          <div style="text-align: right;">
            <div class="pdf-hero-metric-detail-label">Metric Detail</div>
            <div class="pdf-hero-metric-detail-value">
              ${
                activeCalcId === "sip" ? "Projected Wealth" :
                activeCalcId === "compound" ? "Total Future Amount" :
                activeCalcId === "emi" ? "EMI Installment" :
                activeCalcId === "gst" ? "Invoice Value" :
                activeCalcId === "salary" ? "Take-home Cash" :
                "Status: Accurate"
              }
            </div>
          </div>
        </div>

        <!-- Two-Column Side-by-Side Flex Tables -->
        <div class="pdf-grid">
          <!-- Left Column: Inputs -->
          <div class="pdf-col">
            <div class="pdf-col-header">
              Configured Inputs
            </div>
            <table class="pdf-table">
              <tbody>
                ${inputRows}
              </tbody>
            </table>
          </div>
          
          <!-- Right Column: Results -->
          <div class="pdf-col">
            <div class="pdf-col-header results">
              Calculated Outcomes
            </div>
            <table class="pdf-table">
              <tbody>
                ${resultRows}
              </tbody>
            </table>
          </div>
        </div>

        <!-- SaaS Sourced Free Alternatives Highlights -->
        <div class="pdf-savings-banner">
          <span class="pdf-savings-icon">💡</span>
          <div>
            <h4 class="pdf-savings-title">SaaS Alternative Savings Radar</h4>
            <p class="pdf-savings-desc">Replacing expensive subscription packages like Canva, SEMrush, Photoshop, or Jasper with free open-source replacements can save you lakhs of Rupees per year. Explore 250+ tools in our directory!</p>
          </div>
        </div>

        <!-- Branding Footer -->
        <div class="pdf-footer">
          <div class="pdf-footer-left">
            <div class="pdf-footer-brand">Quick Calculator</div>
            <div class="pdf-footer-tagline">100% Free, Secure, & Private Client-Side Computations</div>
            <div class="pdf-footer-copy">© ${new Date().getFullYear()} Quick Calculator Hub. All rights reserved.</div>
          </div>
          <div class="pdf-footer-right">
            <div class="pdf-footer-right-text">Swapping paid tools with open-source alternatives saves lakhs of Rupees. Browse 250+ tools at:</div>
            <div class="pdf-footer-url">quickcalculator.com</div>
          </div>
        </div>
      </div>
    `;

    // Create a temporary off-screen node to compile & screenshot
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.top = "-9999px";
    container.style.width = "800px";
    container.innerHTML = reportHtml;
    document.body.appendChild(container);

    setTimeout(async () => {
      try {
        const canvas = await html2canvas(container, {
          scale: 2, // High resolution crisp text rendering
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false
        });

        const imgData = canvas.toDataURL("image/png");
        
        // A4 page dimensions in pt (width: 595.28, height: 841.89)
        const pdf = new jsPDF("p", "pt", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        
        // Render A4 canvas image
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, undefined, "FAST");
        
        pdf.save(`${activeCalcId}_statement_report.pdf`);
        triggerToast("Success! Your professional PDF statement report has downloaded successfully.");
      } catch (error) {
        console.error("Failed to compile canvas output", error);
        triggerToast("Failed to compile PDF. Reverting to basic generation standard.");
      } finally {
        document.body.removeChild(container);
        setIsGeneratingPdf(false);
      }
    }, 400);
  };

  // Map category IDs to cute icons for styling
  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case "finance": return <Coins className="h-5 w-5" />;
      case "business": return <Calculator className="h-5 w-5" />;
      case "health": return <Activity className="h-5 w-5" />;
      case "everyday": return <Ruler className="h-5 w-5" />;
      case "seo": return <TrendingUp className="h-5 w-5" />;
      case "math": return <Code className="h-5 w-5" />;
      default: return <Calculator className="h-5 w-5" />;
    }
  };

  return (
    <section id="calculators" className="py-24 border-t border-gray-100 bg-gray-50/20 dark:border-gray-900 dark:bg-gray-950/40 transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Heading Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-emerald-500" />
            <span>30+ FREE CALCULATORS IN WORKING CONDITION</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            ToolHub Interactive Calculator Suite
          </h2>
          <p className="font-sans text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
            Long-term financial returns, EMI payments, Indian taxes, health benchmarks, age counters, password generators, and square footage measurements. Get absolute step-by-step math breakdowns in Indian Rupees (<span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">₹</span>) with full report exports!
          </p>

          {/* Quick Real-Time Search Bar */}
          <div className="relative max-w-lg mx-auto mt-6">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Search className="h-4.5 w-4.5" />
            </div>
            <input
              type="text"
              placeholder="Search 30+ tools (e.g. SIP, EMI, GST, Pregnancy, Subnet)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full h-11 rounded-xl border border-gray-200 bg-white pl-10 pr-4 font-sans text-xs outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Search Results Display Area */}
        <AnimatePresence>
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-12 p-6 rounded-2xl border border-indigo-100 bg-indigo-50/10 dark:border-indigo-950/40 dark:bg-indigo-950/10"
            >
              <h3 className="font-display text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-4">
                🔍 Search Results ({filteredCalculators.length})
              </h3>
              {filteredCalculators.length === 0 ? (
                <p className="font-sans text-xs text-gray-400 dark:text-gray-500">
                  No calculators found matching your search. Try "SIP", "GST", "BMI", or "Password".
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredCalculators.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        selectCalculator(item.id, item.categoryId);
                        setSearchQuery("");
                      }}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-white hover:border-indigo-500 hover:shadow-xs transition-all text-left dark:border-gray-800 dark:bg-gray-900 cursor-pointer"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-mono">
                          <span>{item.categoryEmoji}</span>
                          <span>{item.categoryId}</span>
                        </span>
                        <h4 className="font-display text-sm font-bold text-gray-900 dark:text-white">
                          {item.name}
                        </h4>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-indigo-500" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Workspaces Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sidebar Category Navigator (Desktop 4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Category Selector Cards */}
            <div className="rounded-2xl border border-gray-150 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 space-y-1.5 shadow-sm transition-all">
              <h3 className="font-display text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-3.5 pt-2.5 pb-1.5">
                Select Domain Category
              </h3>
              {CALCULATOR_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    // Automatically pre-load the first item of that category
                    setActiveCalcId(cat.items[0].id);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all font-sans text-xs font-semibold text-left cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/80 dark:hover:text-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{cat.emoji}</span>
                    <div>
                      <p className="font-bold text-sm tracking-tight">{cat.name}</p>
                      <p className={`text-[10px] font-normal leading-normal truncate max-w-[180px] sm:max-w-xs ${activeCategory === cat.id ? "text-indigo-100" : "text-gray-400 dark:text-gray-500"}`}>
                        {cat.desc}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${activeCategory === cat.id ? "translate-x-0.5" : "text-gray-300"}`} />
                </button>
              ))}
            </div>

            {/* List of sub-calculators for selected category */}
            <div className="rounded-2xl border border-gray-150 bg-white p-3.5 dark:border-gray-800 dark:bg-gray-900 space-y-2 shadow-sm transition-all">
              <h3 className="font-display text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-1 pt-1">
                Calculators under {activeCategoryObject.name}
              </h3>
              <div className="space-y-1">
                {activeCategoryObject.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => selectCalculator(item.id, activeCategory)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                      activeCalcId === item.id
                        ? "bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-indigo-950/20 dark:border-indigo-900/40 dark:text-indigo-300"
                        : "border border-transparent text-gray-700 hover:bg-gray-50/80 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800/60 dark:hover:text-gray-200"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <p className="font-display text-xs font-bold leading-snug">{item.name}</p>
                      <p className="font-sans text-[10px] text-gray-400 dark:text-gray-500 line-clamp-1 leading-normal">
                        {item.desc}
                      </p>
                    </div>
                    {activeCalcId === item.id && (
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Workspace Panel (Desktop 8 cols) */}
          <div id="calculator-workspace" className="lg:col-span-8 scroll-mt-24 space-y-6">
            
            {/* Active Calculator workspace */}
            <div className="rounded-3xl border border-gray-200 bg-white shadow-xl shadow-gray-100/40 p-6 sm:p-8 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none transition-all space-y-6">
              
              {/* Workspace Header */}
              <div className="border-b border-gray-100 pb-5 dark:border-gray-800 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                      {activeCategoryObject.emoji} {activeCategoryObject.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <h1 className="font-display text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {activeCalc.title}
                      </h1>
                      {onToggleFavorite && (
                        <button
                          onClick={() => onToggleFavorite({
                            id: activeCalc.id,
                            name: activeCalc.title || activeCalc.name,
                            emoji: activeCategoryObject.emoji || "📊",
                            url: `#/calculator/${activeCalc.id}`,
                            type: "Calculator",
                            desc: activeCalc.desc
                          })}
                          className={`inline-flex items-center justify-center p-1.5 rounded-xl transition-all cursor-pointer border ${
                            favorites?.some(f => f.id === activeCalc.id)
                              ? "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/40 dark:border-amber-900"
                              : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                          }`}
                          title={favorites?.some(f => f.id === activeCalc.id) ? "Remove Bookmark" : "Bookmark Calculator"}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={favorites?.some(f => f.id === activeCalc.id) ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Share & Download Actions group */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={downloadPdfReport}
                      disabled={isGeneratingPdf}
                      className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 font-sans text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Download professional PDF statement"
                    >
                      {isGeneratingPdf ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 text-indigo-500 animate-spin" />
                          <span>Generating PDF...</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-3.5 w-3.5 text-indigo-500" />
                          <span className="hidden sm:inline">Download Statement</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleShareResults}
                      className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 font-sans text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer transition-all"
                      title="Share results summary"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                <p className="font-sans text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed pt-1.5">
                  📝 <strong>About:</strong> {activeCalc.desc} <span className="italic text-gray-400 dark:text-gray-500">({activeCalc.seoDescription})</span>
                </p>
              </div>

              {/* Dynamic Interactive Panel Split (Forms Left, Outputs Right) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Inputs parameters form (7 cols) */}
                <div className="md:col-span-7 space-y-5">
                  <h3 className="font-display text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <Info className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Configure Input Parameters</span>
                  </h3>

                  {/* RENDER CUSTOM INPUTS BASED ON SELECT CALCID */}
                  <div className="space-y-4">
                    
                    {/* 1. SIP Calculator Inputs */}
                    {activeCalcId === "sip" && (
                      <>
                        <div className="space-y-2">
                          <div className="flex justify-between font-sans text-xs font-semibold">
                            <span className="text-gray-600 dark:text-gray-400">Monthly Investment Amount</span>
                            <span className="font-mono text-indigo-600 dark:text-indigo-400">₹{(inputs.sip?.monthly ?? 5000).toLocaleString('en-IN')}</span>
                          </div>
                          <input
                            type="range"
                            min="500"
                            max="100000"
                            step="500"
                            value={inputs.sip?.monthly ?? 5000}
                            onChange={(e) => updateInput("sip", "monthly", parseInt(e.target.value))}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:bg-gray-800"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between font-sans text-xs font-semibold">
                            <span className="text-gray-600 dark:text-gray-400">Expected Rate of Return (%)</span>
                            <span className="font-mono text-indigo-600 dark:text-indigo-400">{inputs.sip?.rate ?? 12}% per yr</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="30"
                            step="0.5"
                            value={inputs.sip?.rate ?? 12}
                            onChange={(e) => updateInput("sip", "rate", parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:bg-gray-800"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between font-sans text-xs font-semibold">
                            <span className="text-gray-600 dark:text-gray-400">Time Duration (Years)</span>
                            <span className="font-mono text-indigo-600 dark:text-indigo-400">{inputs.sip?.years ?? 10} yrs</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="40"
                            step="1"
                            value={inputs.sip?.years ?? 10}
                            onChange={(e) => updateInput("sip", "years", parseInt(e.target.value))}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:bg-gray-800"
                          />
                        </div>
                      </>
                    )}

                    {/* 2. Compound Interest Inputs */}
                    {activeCalcId === "compound" && (
                      <>
                        <div className="space-y-2">
                          <label className="block font-sans text-xs font-semibold text-gray-600 dark:text-gray-400">Principal Deposit Capital (₹)</label>
                          <input
                            type="number"
                            value={inputs.compound?.principal ?? 50000}
                            onChange={(e) => updateInput("compound", "principal", parseFloat(e.target.value) || 0)}
                            className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white font-mono text-xs outline-none focus:border-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block font-sans text-xs font-semibold text-gray-600 dark:text-gray-400">Annual Rate (%)</label>
                            <input
                              type="number"
                              step="0.1"
                              value={inputs.compound?.rate ?? 8}
                              onChange={(e) => updateInput("compound", "rate", parseFloat(e.target.value) || 0)}
                              className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white font-mono text-xs outline-none focus:border-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block font-sans text-xs font-semibold text-gray-600 dark:text-gray-400">Duration (Years)</label>
                            <input
                              type="number"
                              value={inputs.compound?.years ?? 10}
                              onChange={(e) => updateInput("compound", "years", parseInt(e.target.value) || 0)}
                              className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white font-mono text-xs outline-none focus:border-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block font-sans text-xs font-semibold text-gray-600 dark:text-gray-400">Compounding Frequency</label>
                          <select
                            value={inputs.compound?.frequency ?? "12"}
                            onChange={(e) => updateInput("compound", "frequency", e.target.value)}
                            className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white font-sans text-xs outline-none focus:border-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white cursor-pointer"
                          >
                            <option value="12">Monthly compounding</option>
                            <option value="4">Quarterly compounding</option>
                            <option value="2">Half-Yearly compounding</option>
                            <option value="1">Annual compounding</option>
                          </select>
                        </div>
                      </>
                    )}

                    {/* 3. EMI Calculator Inputs */}
                    {activeCalcId === "emi" && (
                      <>
                        <div className="space-y-2">
                          <label className="block font-sans text-xs font-semibold text-gray-600 dark:text-gray-400">Total Loan Amount Required (₹)</label>
                          <input
                            type="number"
                            value={inputs.emi?.principal ?? 1000000}
                            onChange={(e) => updateInput("emi", "principal", parseFloat(e.target.value) || 0)}
                            className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white font-mono text-xs outline-none focus:border-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block font-sans text-xs font-semibold text-gray-600 dark:text-gray-400">Interest Rate (%)</label>
                            <input
                              type="number"
                              step="0.05"
                              value={inputs.emi?.rate ?? 8.5}
                              onChange={(e) => updateInput("emi", "rate", parseFloat(e.target.value) || 0)}
                              className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white font-mono text-xs outline-none focus:border-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block font-sans text-xs font-semibold text-gray-600 dark:text-gray-400">Tenure (Years)</label>
                            <input
                              type="number"
                              value={inputs.emi?.years ?? 15}
                              onChange={(e) => updateInput("emi", "years", parseInt(e.target.value) || 0)}
                              className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white font-mono text-xs outline-none focus:border-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* 4. GST Calculator Inputs */}
                    {activeCalcId === "gst" && (
                      <>
                        <div className="space-y-2">
                          <label className="block font-sans text-xs font-semibold text-gray-600 dark:text-gray-400">Transaction Base Value (₹)</label>
                          <input
                            type="number"
                            value={inputs.gst?.amount ?? 10000}
                            onChange={(e) => updateInput("gst", "amount", parseFloat(e.target.value) || 0)}
                            className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white font-mono text-xs outline-none focus:border-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block font-sans text-xs font-semibold text-gray-600 dark:text-gray-400">GST Slab Rate</label>
                            <select
                              value={inputs.gst?.rate ?? "18"}
                              onChange={(e) => updateInput("gst", "rate", parseInt(e.target.value))}
                              className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white font-sans text-xs outline-none focus:border-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                            >
                              <option value="5">5% (Essentials)</option>
                              <option value="12">12% (Standard)</option>
                              <option value="18">18% (Services/Tech)</option>
                              <option value="28">28% (Luxury items)</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="block font-sans text-xs font-semibold text-gray-600 dark:text-gray-400">GST Direction</label>
                            <select
                              value={inputs.gst?.type ?? "add"}
                              onChange={(e) => updateInput("gst", "type", e.target.value)}
                              className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white font-sans text-xs outline-none focus:border-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                            >
                              <option value="add">Add GST (+Tax)</option>
                              <option value="remove">Remove GST (Inclusive)</option>
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    {/* 5. Salary Calculator Inputs */}
                    {activeCalcId === "salary" && (
                      <>
                        <div className="space-y-2">
                          <label className="block font-sans text-xs font-semibold text-gray-600 dark:text-gray-400">Annual CTC Package (₹)</label>
                          <input
                            type="number"
                            value={inputs.salary?.ctc ?? 1200000}
                            onChange={(e) => updateInput("salary", "ctc", parseFloat(e.target.value) || 0)}
                            className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white font-mono text-xs outline-none focus:border-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block font-sans text-xs font-semibold text-gray-600 dark:text-gray-400">Prof. Tax Deduct (₹/yr)</label>
                            <input
                              type="number"
                              value={inputs.salary?.pt ?? 2400}
                              onChange={(e) => updateInput("salary", "pt", parseFloat(e.target.value) || 0)}
                              className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white font-mono text-xs outline-none focus:border-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block font-sans text-xs font-semibold text-gray-600 dark:text-gray-400">Other Deducts (₹/yr)</label>
                            <input
                              type="number"
                              value={inputs.salary?.deductions ?? 150000}
                              onChange={(e) => updateInput("salary", "deductions", parseFloat(e.target.value) || 0)}
                              className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white font-mono text-xs outline-none focus:border-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* 6. Advanced Scientific Keyboard inputs */}
                    {activeCalcId === "scientific" && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="block font-sans text-xs font-semibold text-gray-400">Scientific Equation Expression</label>
                          <input
                            type="text"
                            value={scientificExpr}
                            onChange={(e) => setScientificExpr(e.target.value)}
                            className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-white font-mono text-sm outline-none focus:border-indigo-600 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                          />
                        </div>
                        {/* Math buttons key grid */}
                        <div className="grid grid-cols-5 gap-1.5 pt-1.5 text-xs font-mono font-bold">
                          {["sin(", "cos(", "tan(", "C", "⌫", "log(", "ln(", "^", "(", ")", "7", "8", "9", "/", "sqrt(", "4", "5", "6", "*", "pi", "1", "2", "3", "-", "e", "0", ".", "+", "="].map((btn) => (
                            <button
                              type="button"
                              key={btn}
                              onClick={() => handleScientificKey(btn)}
                              className={`h-9 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                                btn === "="
                                  ? "bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700"
                                  : btn === "C" || btn === "⌫"
                                  ? "bg-red-50 border-red-100 text-red-500 hover:bg-red-100 dark:bg-red-950/20 dark:border-red-900/40"
                                  : "bg-gray-50 border-gray-150 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/80"
                              }`}
                            >
                              {btn}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 7. Generic Fallback Input Renderer for remaining 24 calculators */}
                    {activeCalcId !== "sip" && activeCalcId !== "compound" && activeCalcId !== "emi" && activeCalcId !== "gst" && activeCalcId !== "salary" && activeCalcId !== "scientific" && (
                      <div className="space-y-3">
                        {Object.entries(inputs[activeCalcId] || DEFAULT_INPUTS[activeCalcId] || {}).map(([key, val]) => {
                          const isNumber = typeof val === "number";
                          const isBoolean = typeof val === "boolean";
                          
                          if (isBoolean) {
                            return (
                              <label key={key} className="flex items-center gap-2.5 cursor-pointer py-1">
                                <input
                                  type="checkbox"
                                  checked={val}
                                  onChange={(e) => updateInput(activeCalcId, key, e.target.checked)}
                                  className="h-4.5 w-4.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                                <span className="font-sans text-xs font-semibold text-gray-700 dark:text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                              </label>
                            );
                          }

                          if (key === "gender") {
                            return (
                              <div key={key} className="space-y-1.5">
                                <label className="block font-sans text-xs font-semibold text-gray-600 dark:text-gray-400">Gender Identity</label>
                                <select
                                  value={String(val || 'male')}
                                  onChange={(e) => updateInput(activeCalcId, key, e.target.value)}
                                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white font-sans text-xs outline-none focus:border-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                                >
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                </select>
                              </div>
                            );
                          }

                          if (key === "weather") {
                            return (
                              <div key={key} className="space-y-1.5">
                                <label className="block font-sans text-xs font-semibold text-gray-600 dark:text-gray-400">Weather Condition</label>
                                <select
                                  value={String(val || 'temperate')}
                                  onChange={(e) => updateInput(activeCalcId, key, e.target.value)}
                                  className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white font-sans text-xs outline-none focus:border-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                                >
                                  <option value="temperate">Temperate Climate</option>
                                  <option value="cold">Cold Climate</option>
                                  <option value="hot">Hot / Humid climate</option>
                                </select>
                              </div>
                            );
                          }

                          if (key === "text" || key === "word_count") {
                            return (
                              <div key={key} className="space-y-1.5">
                                <label className="block font-sans text-xs font-semibold text-gray-600 dark:text-gray-400">Content Text Field</label>
                                <textarea
                                  value={String(val || '')}
                                  rows={4}
                                  onChange={(e) => updateInput(activeCalcId, key, e.target.value)}
                                  className="w-full p-3 rounded-xl border border-gray-200 bg-white font-sans text-xs outline-none focus:border-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                                />
                              </div>
                            );
                          }

                          return (
                            <div key={key} className="space-y-1.5">
                              <label className="block font-sans text-xs font-semibold text-gray-600 dark:text-gray-400 capitalize">
                                {key.replace(/([A-Z])/g, ' $1')} {isNumber && "(Number value)"}
                              </label>
                              <input
                                type={isNumber ? "number" : "text"}
                                value={(val as any) ?? ''}
                                onChange={(e) => updateInput(activeCalcId, key, isNumber ? (parseFloat(e.target.value) || 0) : e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white font-mono text-xs outline-none focus:border-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                </div>

                {/* Right Side: Calculation Outputs & Results Card (5 cols) */}
                <div className="md:col-span-5 space-y-5">
                  <h3 className="font-display text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Calculated Output Results</span>
                  </h3>

                  {/* Results Display Panel */}
                  <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 text-white space-y-4 shadow-inner relative overflow-visible transition-all duration-300">
                    
                    {/* Glowing Accent background lines */}
                    <div className="absolute top-0 right-0 h-28 w-28 rounded-full bg-indigo-500/10 blur-xl pointer-events-none" />

                    {/* 1. SIP Calculator Output Layout */}
                    {activeCalcId === "sip" && (
                      <div className="space-y-3.5">
                        <div className="space-y-0.5">
                          <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Amount Invested</span>
                          <p className="font-mono text-xl font-bold text-slate-200">₹{calcResult.totalInvestment?.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="font-sans text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Est. Wealth Returns</span>
                          <p className="font-mono text-xl font-bold text-emerald-400">₹{calcResult.estReturns?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                        </div>
                        <div className="border-t border-slate-800/80 pt-3 space-y-1">
                          <span className="font-sans text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Projected Future Wealth</span>
                          <p className="font-display text-2xl font-extrabold text-indigo-300">₹{calcResult.totalWealth?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                        </div>
                      </div>
                    )}

                    {/* 2. Compound Interest Output Layout */}
                    {activeCalcId === "compound" && (
                      <div className="space-y-3.5">
                        <div className="space-y-0.5">
                          <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deposited Capital</span>
                          <p className="font-mono text-xl font-bold text-slate-200">₹{calcResult.principal?.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="font-sans text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Interest Accrued</span>
                          <p className="font-mono text-xl font-bold text-emerald-400">₹{calcResult.interestEarned?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                        </div>
                        <div className="border-t border-slate-800/80 pt-3 space-y-1">
                          <span className="font-sans text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Total Capital Portfolio</span>
                          <p className="font-display text-2xl font-extrabold text-indigo-300">₹{calcResult.totalAmount?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                        </div>
                      </div>
                    )}

                    {/* 3. EMI Calculator Output Layout */}
                    {activeCalcId === "emi" && (
                      <div className="space-y-3.5">
                        <div className="space-y-0.5">
                          <span className="font-sans text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Estimated Monthly EMI</span>
                          <p className="font-display text-2.5xl font-extrabold text-indigo-300">₹{calcResult.emi?.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / mo</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="font-sans text-[10px] font-bold text-amber-400 uppercase tracking-wider">Total Interest Payable</span>
                          <p className="font-mono text-lg font-bold text-amber-400">₹{calcResult.totalInterest?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                        </div>
                        <div className="border-t border-slate-800/80 pt-3 space-y-0.5">
                          <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Cost of Loan (P + I)</span>
                          <p className="font-mono text-lg font-bold text-slate-200">₹{calcResult.totalAmount?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                        </div>
                      </div>
                    )}

                    {/* 4. GST Calculator Output Layout */}
                    {activeCalcId === "gst" && (
                      <div className="space-y-3">
                        <div className="space-y-0.5">
                          <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Taxable Amount</span>
                          <p className="font-mono text-lg font-bold text-slate-200">₹{calcResult.baseAmount?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 border-t border-slate-800/60 pt-2 pb-1">
                          <div className="space-y-0.5">
                            <span className="font-sans text-[9px] font-bold text-slate-400 uppercase">CGST (Central Tax)</span>
                            <p className="font-mono text-sm font-bold text-slate-300">₹{calcResult.cgst?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                          </div>
                          <div className="space-y-0.5">
                            <span className="font-sans text-[9px] font-bold text-slate-400 uppercase">SGST (State Tax)</span>
                            <p className="font-mono text-sm font-bold text-slate-300">₹{calcResult.sgst?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                          </div>
                        </div>
                        <div className="border-t border-slate-800/80 pt-3 space-y-1">
                          <span className="font-sans text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Total Invoice Bill Value</span>
                          <p className="font-display text-2xl font-extrabold text-emerald-400">₹{calcResult.totalAmount?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                        </div>
                      </div>
                    )}

                    {/* 5. Salary Calculator Output Layout */}
                    {activeCalcId === "salary" && (
                      <div className="space-y-3.5">
                        <div className="space-y-0.5">
                          <span className="font-sans text-[10px] font-bold text-red-400 uppercase tracking-wider">Estimated Income Tax</span>
                          <p className="font-mono text-lg font-bold text-red-400">₹{calcResult.annualTax?.toLocaleString('en-IN')} / yr</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Gross Salary</span>
                          <p className="font-mono text-lg font-bold text-slate-200">₹{calcResult.monthlyGross?.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / mo</p>
                        </div>
                        <div className="border-t border-slate-800/80 pt-3 space-y-1">
                          <span className="font-sans text-[11px] font-bold text-emerald-400 uppercase tracking-wider">In-Hand Take Home Salary</span>
                          <p className="font-display text-2.5xl font-extrabold text-emerald-400">₹{Math.max(0, calcResult.monthlyTakeHome)?.toLocaleString('en-IN', { maximumFractionDigits: 0 })} / mo</p>
                        </div>
                      </div>
                    )}

                    {/* 6. Scientific Calculator Output */}
                    {activeCalcId === "scientific" && (
                      <div className="space-y-3">
                        <div className="space-y-0.5">
                          <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-wider">Evaluating Math Expression</span>
                          <p className="font-mono text-sm text-slate-300 break-all">{scientificExpr || "Empty"}</p>
                        </div>
                        <div className="border-t border-slate-800/80 pt-3 space-y-1">
                          <span className="font-sans text-[11px] font-bold text-indigo-400 uppercase tracking-wider font-mono">Output Result</span>
                          <p className="font-display text-2.5xl font-extrabold text-indigo-300 break-all">
                            {calcResult.result !== undefined ? calcResult.result.toString() : "0"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 7. Generic Fallback Output Loop for remaining 24 tools */}
                    {activeCalcId !== "sip" && activeCalcId !== "compound" && activeCalcId !== "emi" && activeCalcId !== "gst" && activeCalcId !== "salary" && activeCalcId !== "scientific" && (
                      <div className="space-y-3">
                        {Object.entries(calcResult).map(([key, val]) => {
                          let labelText = key.replace(/([A-Z])/g, ' $1');
                          let displayVal = typeof val === "number" ? val.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : String(val);
                          
                          if (key.toLowerCase().includes("cost") || key.toLowerCase().includes("revenue") || key.toLowerCase().includes("gain") || key.toLowerCase().includes("profit") || key.toLowerCase().includes("wealth") || key.toLowerCase().includes("pay") || key.toLowerCase().includes("target") || key.toLowerCase().includes("rate")) {
                            if (typeof val === "number") displayVal = `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 1 })}`;
                          } else if (key.toLowerCase().includes("pct") || key.toLowerCase().includes("percent") || key.toLowerCase().includes("roi") || key.toLowerCase().includes("er")) {
                            if (typeof val === "number") displayVal = `${val.toFixed(2)}%`;
                          }

                          return (
                            <div key={key} className="space-y-0.5 border-b border-slate-800/40 pb-2 last:border-0 last:pb-0">
                              <span className="font-sans text-[9px] font-bold text-slate-400 uppercase tracking-wider block capitalize">{labelText}</span>
                              <span className="font-mono text-sm font-bold text-slate-200">{displayVal}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>

                  {/* Math Formula / Method Explanation card */}
                  <div className="rounded-2xl border border-gray-150 p-4 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/60 font-sans text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    <p className="font-bold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                      <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span>Mathematical Formula & Method:</span>
                    </p>
                    {activeCalcId === "sip" && "SIP Formula: M = P * [((1 + i)^n - 1) / i] * (1 + i). Compounded monthly on mutual fund growth rates."}
                    {activeCalcId === "compound" && "Compound Formula: A = P * (1 + r/n)^(n*t). Computed instantly across standard annual time steps."}
                    {activeCalcId === "emi" && "EMI Formula: EMI = P * r * (1 + r)^n / [ (1 + r)^n - 1 ]. Standard bank loan amortization math."}
                    {activeCalcId === "gst" && "GST: Base GST is splitting tax amount equally CGST (Central) and SGST (State) according to selected rate slabs."}
                    {activeCalcId === "salary" && "Salary: Calculated under India New Tax Regime standard slab brackets with automatic 87A rebate and Standard Deductions."}
                    {activeCalcId === "buy_rent" && "Buy vs Rent: Compares purchasing (20% downpayment + 8.5% EMI + 5% house appreciation) against renting (6% rent inflation + 10% returns on investments)."}
                    {activeCalcId === "crypto" && "Crypto ROI: Calculates buy transaction price, sell price, exchange fee percentages and capital gains net tax margins."}
                    {activeCalcId === "inflation" && "Inflation: FV = PV * (1 + r/100)^t. Measures depreciation in purchasing values of Rupee currencies over future years."}
                    {activeCalcId === "freelance" && "Freelance Rate: Rate = (Target Net Income + Annual Business Overheads) / Total Yearly Billable Hours."}
                    {activeCalcId === "roi" && "ROI & CAGR: Absolute ROI is percentage gain. CAGR = (Revenue / Capital)^(1 / years) - 1."}
                    {activeCalcId === "discount" && "Discount: Final Price = Original - (Original * Discount%). Margin = Net Profit / Sale Price."}
                    {activeCalcId === "bmi" && "BMI Index: BMI = weight (kg) / height^2 (meters). Categories matched with WHO standard index bounds."}
                    {activeCalcId === "calorie" && "Calorie TDEE: Basal Metabolic Rate (BMR) scaled with active physical exercise factors (Harris-Benedict equation)."}
                    {activeCalcId === "pregnancy" && "Pregnancy Due Date: Naegele's Rule calculates exactly 280 days from the LMP date, outlining Trimesters."}
                    {activeCalcId === "body_fat" && "Body Fat Index: Computed using US Navy tape measurements for Waist, Neck, Hips and Height."}
                    {activeCalcId === "water" && "Hydration target: 35ml per kg of weight, plus workout session volume scales and hot climate adjustments."}
                    {activeCalcId === "age" && "Age math: Subtracts exact day limits across calendar bounds, finding birthdays and birth week days."}
                    {activeCalcId === "percentage" && "Percentage Solver: Solves X% of Y, fractional ratios, and relative changes from first value to second."}
                    {activeCalcId === "time" && "Hours tracker: Subtracts shift timings, adjusts for unpaid break margins, and multiplies by hourly pay rates."}
                    {activeCalcId === "gpa" && "GPA: Weighted GPA calculated as (Grade Points * Credits) / Total Credit hours. Supports grades up to A+."}
                    {activeCalcId === "fuel" && "Fuel cost: (Trip distance / Mileage) * Fuel Price, divided equally among passengers."}
                    {activeCalcId === "word_count" && "Word Counter: Standard text string parser counting words, sentences, reading and speaking metrics."}
                    {activeCalcId === "password" && "Password strength: Evaluates entropy = length * log2(pool size). Higher entropy translates to stronger passwords."}
                    {activeCalcId === "ai_roi" && "AI ROI: Compares standard manual cost of content production against AI speed assistance saving details."}
                    {activeCalcId === "engagement" && "Engagement: Standard interactions (likes, shares, comments) divided by follower count."}
                    {activeCalcId === "speed_impact" && "Speed Impact: Based on Amazon research, every 1s delay above 2s drops conversions relative ratios by 7%."}
                    {activeCalcId === "sqft" && "Area: Length * Width. Cubic concrete yards volume is Area * (Depth / 12) / 27."}
                    {activeCalcId === "hex_rgb" && "Color Converter: Parses base-16 hexadecimal values to RGB, RGBA, HSL declarations."}
                    {activeCalcId === "subnet" && "Subnetting CIDR: Maps IP addresses into binary masks, locating usable host boundaries and ranges."}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Modern custom toast alerts */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white rounded-xl px-4 py-3.5 border border-slate-800 shadow-xl flex items-center gap-2.5 max-w-sm font-sans text-xs"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-semibold leading-relaxed">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
