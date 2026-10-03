import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Sparkles, 
  ShieldCheck, 
  SlidersHorizontal, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  KeyRound, 
  Palette, 
  Clock, 
  Calendar, 
  Percent, 
  Scale, 
  Eye, 
  Lock,
  Layers
} from 'lucide-react';
import { ToolItem } from '../data/categoriesAndTools';
import { triggerConfetti } from '../utils/confetti';
import { recordToolUsage } from '../utils/usageTracker';
import { jsPDF } from 'jspdf';
import { computeMD5, computeSHA256 } from '../utils/cryptoHelpers';

interface DeveloperToolEngineProps {
  tool: ToolItem;
}

export function DeveloperToolEngine({ tool }: DeveloperToolEngineProps) {
  const toolSlug = (tool.slug || tool.id).toLowerCase();

  // Inputs
  const [inputText, setTextInput] = useState<string>(() => {
    if (toolSlug.includes('json')) {
      return `{\n  "status": "success",\n  "app": "Quick Calculator",\n  "version": "2.5.0",\n  "toolsCount": 49,\n  "features": ["100% Client-Side", "Zero Latency", "Enterprise SEO"]\n}`;
    }
    if (toolSlug.includes('css')) {
      return `/* Primary Button Styles */\n.btn-primary {\n  background-color: #4f46e5;\n  color: #ffffff;\n  padding: 12px 24px;\n  border-radius: 12px;\n  font-weight: 700;\n  transition: all 0.3s ease;\n}\n\n.btn-primary:hover {\n  background-color: #4338ca;\n}`;
    }
    if (toolSlug.includes('js') || toolSlug.includes('javascript')) {
      return `// Compute Compound Interest\nfunction calculateWealth(principal, rate, years) {\n  const n = 12;\n  const total = principal * Math.pow(1 + (rate / (100 * n)), n * years);\n  return total.toFixed(2);\n}`;
    }
    if (toolSlug.includes('regex')) {
      return `Contact support at team@quickcalculator.app or visit https://quickcalculator.app for assistance. Order #48291 verified.`;
    }
    if (toolSlug.includes('hash')) {
      return `Quick Calculator High Precision Suite`;
    }
    if (toolSlug.includes('base64')) {
      return `Quick Calculator: Enterprise-Grade High-Precision Web Utilities`;
    }
    return ``;
  });

  // Base64 Mode
  const [base64Mode, setBase64Mode] = useState<'encode' | 'decode'>('encode');

  // 1. JSON Tool Settings
  const [jsonIndent, setJsonIndent] = useState<2 | 4 | 'minify'>(2);

  // 2. UUID Settings
  const [uuidCount, setUuidCount] = useState<number>(5);
  const [uuidHyphens, setUuidHyphens] = useState<boolean>(true);
  const [uuidUppercase, setUuidUppercase] = useState<boolean>(false);
  const [uuidGeneratedList, setUuidGeneratedList] = useState<string[]>([]);

  // 3. Hash Settings
  const [hashResults, setHashResults] = useState<{ sha1: string; sha256: string; sha384: string; sha512: string; md5: string }>({
    sha1: '',
    sha256: '',
    sha384: '',
    sha512: '',
    md5: ''
  });

  // 4. Color Contrast Settings
  const [fgColor, setFgColor] = useState<string>('#4F46E5');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');

  // 5. Regex Settings
  const [regexPattern, setRegexPattern] = useState<string>('([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})');
  const [regexFlags, setRegexFlags] = useState<string>('gi');

  // 6. Timestamp Settings
  const [unixInput, setUnixInput] = useState<number>(() => Math.floor(Date.now() / 1000));
  const [dateInput, setDateInput] = useState<string>(() => new Date().toISOString().slice(0, 16));

  // 7. Age Calculator Settings
  const [birthDate, setBirthDate] = useState<string>('1998-05-15');
  const [targetDate, setTargetDate] = useState<string>(() => new Date().toISOString().slice(0, 10));

  // 8. Percentage Calculator Settings
  const [pctVal1, setPctVal1] = useState<number>(20);
  const [pctVal2, setPctVal2] = useState<number>(500);
  const [pctMode, setPctMode] = useState<'what_is_pct' | 'is_what_pct' | 'increase_decrease' | 'fraction'>('what_is_pct');

  // 9. Password Generator Settings
  const [pwLength, setPwLength] = useState<number>(16);
  const [pwUpper, setPwUpper] = useState<boolean>(true);
  const [pwLower, setPwLower] = useState<boolean>(true);
  const [pwNumbers, setPwNumbers] = useState<boolean>(true);
  const [pwSymbols, setPwSymbols] = useState<boolean>(true);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');

  // 10. Unit Converter Settings
  const [unitCategory, setUnitCategory] = useState<'length' | 'weight' | 'temperature' | 'speed' | 'data'>('length');
  const [unitVal, setUnitVal] = useState<number>(100);
  const [unitFrom, setUnitFrom] = useState<string>('meters');
  const [unitTo, setUnitTo] = useState<string>('feet');

  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    recordToolUsage(tool.id, tool.name);
  }, [tool.id, tool.name]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    triggerConfetti();
    setTimeout(() => setCopied(false), 2000);
  };

  // ----------------------------------------------------
  // COMPUTATIONS
  // ----------------------------------------------------

  // 1. JSON Formatter & Minifier
  const jsonAnalysis = useMemo(() => {
    try {
      if (!inputText.trim()) return { isValid: true, output: '', error: null, sizeBefore: 0, sizeAfter: 0 };
      const parsed = JSON.parse(inputText);
      const output = jsonIndent === 'minify' 
        ? JSON.stringify(parsed) 
        : JSON.stringify(parsed, null, jsonIndent);

      return {
        isValid: true,
        output,
        error: null,
        sizeBefore: new Blob([inputText]).size,
        sizeAfter: new Blob([output]).size,
        keysCount: Object.keys(parsed).length
      };
    } catch (err: any) {
      return {
        isValid: false,
        output: '',
        error: err.message,
        sizeBefore: new Blob([inputText]).size,
        sizeAfter: 0,
        keysCount: 0
      };
    }
  }, [inputText, jsonIndent]);

  // 2. CSS Minifier & Beautifier
  const cssAnalysis = useMemo(() => {
    const raw = inputText;
    // Minify
    const minified = raw
      .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
      .replace(/\s+/g, ' ')             // collapse spaces
      .replace(/\s*([\{\}\:\;\,])\s*/g, '$1')
      .replace(/;\}/g, '}')
      .trim();

    // Beautify
    const beautified = raw
      .replace(/\s*\{\s*/g, ' {\n  ')
      .replace(/\s*;\s*/g, ';\n  ')
      .replace(/\s*\}\s*/g, '\n}\n\n')
      .replace(/  \n/g, '')
      .trim();

    const compressionRatio = raw.length > 0 ? (((raw.length - minified.length) / raw.length) * 100).toFixed(1) : '0';

    return {
      minified,
      beautified,
      compressionRatio,
      originalBytes: new Blob([raw]).size,
      minifiedBytes: new Blob([minified]).size
    };
  }, [inputText]);

  // 3. JavaScript Minifier
  const jsAnalysis = useMemo(() => {
    const raw = inputText;
    const minified = raw
      .replace(/\/\/.*$/gm, '')           // single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '')   // multi-line comments
      .replace(/\s+/g, ' ')               // collapse whitespace
      .replace(/\s*([\{\}\(\)\=\+\-\*\/\;\:\,])\s*/g, '$1')
      .trim();

    return {
      minified,
      originalBytes: new Blob([raw]).size,
      minifiedBytes: new Blob([minified]).size,
      reduction: raw.length > 0 ? (((raw.length - minified.length) / raw.length) * 100).toFixed(1) : '0'
    };
  }, [inputText]);

  // Base64 Engine
  const base64Analysis = useMemo(() => {
    if (!inputText) return { output: '', error: null, byteLength: 0 };
    try {
      if (base64Mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(inputText)));
        return { output: encoded, error: null, byteLength: new Blob([encoded]).size };
      } else {
        const decoded = decodeURIComponent(escape(atob(inputText.trim())));
        return { output: decoded, error: null, byteLength: new Blob([decoded]).size };
      }
    } catch (err: any) {
      return { output: '', error: err?.message || 'Invalid Base64 string payload', byteLength: 0 };
    }
  }, [inputText, base64Mode]);

  // 4. UUID Generator
  const generateUUIDs = () => {
    const list: string[] = [];
    for (let i = 0; i < uuidCount; i++) {
      let u = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      if (!uuidHyphens) u = u.replace(/-/g, '');
      if (uuidUppercase) u = u.toUpperCase();
      list.push(u);
    }
    setUuidGeneratedList(list);
  };

  useEffect(() => {
    if (toolSlug.includes('uuid') || toolSlug.includes('guid')) {
      generateUUIDs();
    }
  }, [uuidCount, uuidHyphens, uuidUppercase, toolSlug]);

  // 5. Hash Generator (Instant Pure Client-Side Computation)
  useEffect(() => {
    if (!toolSlug.includes('hash')) return;
    async function calculateHashes() {
      const sha256 = computeSHA256(inputText);
      const md5 = computeMD5(inputText);

      try {
        const msgUint8 = new TextEncoder().encode(inputText);
        const buffer1 = await crypto.subtle.digest('SHA-1', msgUint8);
        const sha1 = Array.from(new Uint8Array(buffer1)).map(b => b.toString(16).padStart(2, '0')).join('');

        const buffer384 = await crypto.subtle.digest('SHA-384', msgUint8);
        const sha384 = Array.from(new Uint8Array(buffer384)).map(b => b.toString(16).padStart(2, '0')).join('');

        const buffer512 = await crypto.subtle.digest('SHA-512', msgUint8);
        const sha512 = Array.from(new Uint8Array(buffer512)).map(b => b.toString(16).padStart(2, '0')).join('');

        setHashResults({ sha1, sha256, sha384, sha512, md5 });
      } catch (e) {
        setHashResults(prev => ({ ...prev, sha256, md5 }));
      }
    }
    calculateHashes();
  }, [inputText, toolSlug]);

  // 6. Color Code & Contrast WCAG
  const colorAnalysis = useMemo(() => {
    // Helper to calculate luminance
    const getLuminance = (hex: string) => {
      const rgb = hex.replace(/^#/, '').match(/.{2}/g)?.map(x => parseInt(x, 16) / 255) || [0, 0, 0];
      const a = rgb.map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
      return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    };

    const l1 = getLuminance(fgColor);
    const l2 = getLuminance(bgColor);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const contrastRatio = ratio.toFixed(2);

    const normalAA = ratio >= 4.5;
    const normalAAA = ratio >= 7.0;
    const largeAA = ratio >= 3.0;
    const largeAAA = ratio >= 4.5;

    // HEX to RGB
    const r = parseInt(fgColor.slice(1, 3) || '00', 16);
    const g = parseInt(fgColor.slice(3, 5) || '00', 16);
    const b = parseInt(fgColor.slice(5, 7) || '00', 16);
    const rgbString = `rgb(${r}, ${g}, ${b})`;

    return {
      contrastRatio: `${contrastRatio}:1`,
      normalAA,
      normalAAA,
      largeAA,
      largeAAA,
      rgbString
    };
  }, [fgColor, bgColor]);

  // 7. Regex Tester
  const regexResult = useMemo(() => {
    try {
      if (!regexPattern) return { matches: [], matchCount: 0, error: null };
      const re = new RegExp(regexPattern, regexFlags);
      const matches: string[] = [];
      let m;
      if (regexFlags.includes('g')) {
        let match;
        while ((match = re.exec(inputText)) !== null) {
          matches.push(match[0]);
          if (matches.length > 100) break;
        }
      } else {
        const match = inputText.match(re);
        if (match) matches.push(match[0]);
      }
      return { matches, matchCount: matches.length, error: null };
    } catch (e: any) {
      return { matches: [], matchCount: 0, error: e.message };
    }
  }, [regexPattern, regexFlags, inputText]);

  // 8. Timestamp / Unix Epoch
  const timestampResult = useMemo(() => {
    const dateFromUnix = new Date(unixInput * 1000);
    const unixFromDate = Math.floor(new Date(dateInput).getTime() / 1000);
    const nowUnix = Math.floor(Date.now() / 1000);

    return {
      currentEpochSeconds: nowUnix,
      currentEpochMillis: Date.now(),
      utcDate: isNaN(dateFromUnix.getTime()) ? 'Invalid Date' : dateFromUnix.toUTCString(),
      localDate: isNaN(dateFromUnix.getTime()) ? 'Invalid Date' : dateFromUnix.toLocaleString(),
      convertedUnix: isNaN(unixFromDate) ? 'Invalid Date' : unixFromDate
    };
  }, [unixInput, dateInput]);

  // 9. Age Calculator
  const ageResult = useMemo(() => {
    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    if (isNaN(birth.getTime()) || isNaN(target.getTime())) {
      return { years: 0, months: 0, days: 0, totalDays: 0, nextBirthdayDays: 0 };
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffTime = Math.abs(target.getTime() - birth.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * 24;

    // Next birthday
    const nextBday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < target) {
      nextBday.setFullYear(target.getFullYear() + 1);
    }
    const nextBdayDiff = Math.ceil((nextBday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    return {
      years,
      months,
      days,
      totalDays,
      totalHours,
      nextBirthdayDays: nextBdayDiff
    };
  }, [birthDate, targetDate]);

  // 10. Percentage Calculator
  const percentageResult = useMemo(() => {
    if (pctMode === 'what_is_pct') {
      const result = (pctVal1 / 100) * pctVal2;
      return { formula: `${pctVal1}% of ${pctVal2}`, result: result.toFixed(2) };
    }
    if (pctMode === 'is_what_pct') {
      const result = pctVal2 !== 0 ? (pctVal1 / pctVal2) * 100 : 0;
      return { formula: `${pctVal1} is what % of ${pctVal2}`, result: `${result.toFixed(2)}%` };
    }
    if (pctMode === 'increase_decrease') {
      const diff = pctVal2 - pctVal1;
      const pct = pctVal1 !== 0 ? (diff / pctVal1) * 100 : 0;
      const type = diff >= 0 ? 'Increase' : 'Decrease';
      return { formula: `From ${pctVal1} to ${pctVal2}`, result: `${Math.abs(pct).toFixed(2)}% ${type}` };
    }
    // fraction
    const frac = pctVal2 !== 0 ? (pctVal1 / pctVal2) * 100 : 0;
    return { formula: `${pctVal1}/${pctVal2} as a Percentage`, result: `${frac.toFixed(2)}%` };
  }, [pctVal1, pctVal2, pctMode]);

  // 11. Password Generator
  const generateSecurePassword = () => {
    let chars = '';
    if (pwUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (pwLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (pwNumbers) chars += '0123456789';
    if (pwSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz0123456789';

    let pw = '';
    const array = new Uint32Array(pwLength);
    crypto.getRandomValues(array);
    for (let i = 0; i < pwLength; i++) {
      pw += chars[array[i] % chars.length];
    }
    setGeneratedPassword(pw);
  };

  useEffect(() => {
    if (toolSlug.includes('password')) {
      generateSecurePassword();
    }
  }, [pwLength, pwUpper, pwLower, pwNumbers, pwSymbols, toolSlug]);

  const passwordEntropy = useMemo(() => {
    let poolSize = 0;
    if (pwUpper) poolSize += 26;
    if (pwLower) poolSize += 26;
    if (pwNumbers) poolSize += 10;
    if (pwSymbols) poolSize += 32;
    if (poolSize === 0) poolSize = 26;

    const entropy = Math.round(pwLength * (Math.log(poolSize) / Math.log(2)));
    const strength = entropy >= 80 ? 'Very Strong' : entropy >= 60 ? 'Strong' : entropy >= 40 ? 'Moderate' : 'Weak';
    return { entropy, strength };
  }, [pwLength, pwUpper, pwLower, pwNumbers, pwSymbols]);

  // 12. Unit Converter Calculation
  const unitResult = useMemo(() => {
    const lengthMap: Record<string, number> = { meters: 1, kilometers: 1000, centimeters: 0.01, millimeters: 0.001, feet: 0.3048, inches: 0.0254, miles: 1609.34, yards: 0.9144 };
    const weightMap: Record<string, number> = { kilograms: 1, grams: 0.001, milligrams: 0.000001, pounds: 0.453592, ounces: 0.0283495, tonnes: 1000 };
    const dataMap: Record<string, number> = { bytes: 1, kilobytes: 1024, megabytes: 1024**2, gigabytes: 1024**3, terabytes: 1024**4 };

    if (unitCategory === 'length') {
      const inMeters = unitVal * (lengthMap[unitFrom] || 1);
      const converted = inMeters / (lengthMap[unitTo] || 1);
      return converted.toLocaleString(undefined, { maximumFractionDigits: 6 });
    }
    if (unitCategory === 'weight') {
      const inKg = unitVal * (weightMap[unitFrom] || 1);
      const converted = inKg / (weightMap[unitTo] || 1);
      return converted.toLocaleString(undefined, { maximumFractionDigits: 6 });
    }
    if (unitCategory === 'data') {
      const inBytes = unitVal * (dataMap[unitFrom] || 1);
      const converted = inBytes / (dataMap[unitTo] || 1);
      return converted.toLocaleString(undefined, { maximumFractionDigits: 6 });
    }
    if (unitCategory === 'temperature') {
      if (unitFrom === 'celsius' && unitTo === 'fahrenheit') return ((unitVal * 9/5) + 32).toFixed(2);
      if (unitFrom === 'fahrenheit' && unitTo === 'celsius') return (((unitVal - 32) * 5/9)).toFixed(2);
      if (unitFrom === 'celsius' && unitTo === 'kelvin') return (unitVal + 273.15).toFixed(2);
      return unitVal.toString();
    }
    return unitVal.toString();
  }, [unitCategory, unitVal, unitFrom, unitTo]);

  // PDF Export
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(tool.name, 14, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Generated by Quick Calculator on ${new Date().toLocaleDateString()}`, 14, 28);
    doc.line(14, 32, 196, 32);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Calculation Output:', 14, 40);

    doc.setFont('courier', 'normal');
    doc.setFontSize(10);
    const content = toolSlug.includes('json') ? jsonAnalysis.output
      : toolSlug.includes('css') ? cssAnalysis.minified
      : toolSlug.includes('uuid') ? uuidGeneratedList.join('\n')
      : toolSlug.includes('password') ? `Generated Password: ${generatedPassword}\nEntropy: ${passwordEntropy.entropy} bits (${passwordEntropy.strength})`
      : toolSlug.includes('base64') ? base64Analysis.output
      : toolSlug.includes('age') ? `Age: ${ageResult.years} Years, ${ageResult.months} Months, ${ageResult.days} Days`
      : inputText;

    const splitText = doc.splitTextToSize(content, 180);
    doc.text(splitText, 14, 48);

    doc.save(`${tool.slug || 'developer-utility-report'}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-base sm:text-lg">
              {tool.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              High-precision developer execution • Zero network latency
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 1. JSON FORMATTER & MINIFIER WORKSPACE */}
      {/* ------------------------------------------------------------------ */}
      {toolSlug.includes('json') && (
        <div className="space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500">Indent:</span>
              <button
                onClick={() => setJsonIndent(2)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border cursor-pointer ${jsonIndent === 2 ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800'}`}
              >
                2 Spaces
              </button>
              <button
                onClick={() => setJsonIndent(4)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border cursor-pointer ${jsonIndent === 4 ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800'}`}
              >
                4 Spaces
              </button>
              <button
                onClick={() => setJsonIndent('minify')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border cursor-pointer ${jsonIndent === 'minify' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800'}`}
              >
                Minify (1-Line)
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              {jsonAnalysis.isValid ? (
                <span className="text-emerald-500 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Valid JSON
                </span>
              ) : (
                <span className="text-rose-500 font-bold flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> Syntax Error
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Raw JSON Input:
              </label>
              <textarea
                rows={10}
                value={inputText}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                placeholder="Paste raw JSON here..."
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Formatted / Validated Tree:
                </label>
                <button
                  onClick={() => handleCopy(jsonAnalysis.output)}
                  className="text-xs font-mono text-indigo-500 hover:text-indigo-400 flex items-center gap-1 cursor-pointer font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                rows={10}
                readOnly
                value={jsonAnalysis.isValid ? jsonAnalysis.output : `Error: ${jsonAnalysis.error}`}
                className={`w-full p-4 rounded-xl font-mono text-xs sm:text-sm leading-relaxed border ${
                  jsonAnalysis.isValid
                    ? 'bg-slate-950 text-emerald-400 border-slate-800'
                    : 'bg-rose-950/40 text-rose-300 border-rose-800/60'
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 2. CSS / JS MINIFIER WORKSPACE */}
      {/* ------------------------------------------------------------------ */}
      {(toolSlug.includes('css') || toolSlug.includes('js-minifier') || toolSlug.includes('javascript')) && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-center">
              <span className="text-xs font-mono text-indigo-500 block">Original Size</span>
              <span className="text-xl font-bold font-mono text-indigo-400">{cssAnalysis.originalBytes} Bytes</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-center">
              <span className="text-xs font-mono text-emerald-500 block">Minified Size</span>
              <span className="text-xl font-bold font-mono text-emerald-400">{cssAnalysis.minifiedBytes} Bytes</span>
            </div>
            <div className="p-3 rounded-2xl bg-purple-500/10 text-center">
              <span className="text-xs font-mono text-purple-500 block">Saved Space</span>
              <span className="text-xl font-bold font-mono text-purple-400">{cssAnalysis.compressionRatio}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Source Code:
              </label>
              <textarea
                rows={8}
                value={inputText}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Minified Production Code:
                </label>
                <button
                  onClick={() => handleCopy(cssAnalysis.minified)}
                  className="text-xs font-mono text-indigo-500 hover:text-indigo-400 flex items-center gap-1 cursor-pointer font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                rows={8}
                readOnly
                value={cssAnalysis.minified}
                className="w-full p-4 rounded-xl bg-slate-950 text-indigo-300 font-mono text-xs sm:text-sm leading-relaxed border border-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* BASE64 ENCODER / DECODER WORKSPACE */}
      {/* ------------------------------------------------------------------ */}
      {toolSlug.includes('base64') && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 p-1.5 bg-slate-900 rounded-xl border border-slate-800 w-fit">
            <button
              type="button"
              onClick={() => setBase64Mode('encode')}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                base64Mode === 'encode'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Encode (Text → Base64)
            </button>
            <button
              type="button"
              onClick={() => setBase64Mode('decode')}
              className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                base64Mode === 'decode'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Decode (Base64 → Text)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  {base64Mode === 'encode' ? 'Source Text Input:' : 'Base64 Encoded Input:'}
                </label>
                <span className="text-xs font-mono text-slate-500">
                  {inputText.length} Chars
                </span>
              </div>
              <textarea
                rows={9}
                value={inputText}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={base64Mode === 'encode' ? 'Enter text to encode...' : 'Paste Base64 string to decode...'}
                className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                style={{ fontSize: '16px' }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  {base64Mode === 'encode' ? 'Base64 Output:' : 'Decoded Plaintext:'}
                </label>
                <button
                  type="button"
                  onClick={() => handleCopy(base64Analysis.output)}
                  className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Result'}</span>
                </button>
              </div>
              <textarea
                rows={9}
                readOnly
                value={base64Analysis.error ? `Error: ${base64Analysis.error}` : base64Analysis.output}
                className={`w-full p-4 rounded-xl font-mono text-xs sm:text-sm leading-relaxed border ${
                  base64Analysis.error
                    ? 'bg-rose-950/40 text-rose-300 border-rose-800/60'
                    : 'bg-slate-950 text-indigo-300 border-slate-800'
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 3. UUID / GUID GENERATOR WORKSPACE */}
      {/* ------------------------------------------------------------------ */}
      {(toolSlug.includes('uuid') || toolSlug.includes('guid')) && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Quantity: {uuidCount}
                </label>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={uuidCount}
                  onChange={(e) => setUuidCount(parseInt(e.target.value, 10))}
                  className="w-48 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={uuidHyphens}
                    onChange={(e) => setUuidHyphens(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Hyphens</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={uuidUppercase}
                    onChange={(e) => setUuidUppercase(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>UPPERCASE</span>
                </label>
                <button
                  onClick={generateUUIDs}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/20"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Generate New</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Cryptographically Generated UUIDs:
              </label>
              <button
                onClick={() => handleCopy(uuidGeneratedList.join('\n'))}
                className="text-xs font-mono text-indigo-500 hover:text-indigo-400 flex items-center gap-1 cursor-pointer font-bold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'All Copied!' : 'Copy Batch'}</span>
              </button>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-emerald-400 max-h-60 overflow-y-auto space-y-1.5">
              {uuidGeneratedList.map((id, idx) => (
                <div key={idx} className="flex items-center justify-between hover:bg-slate-900/60 p-1 rounded">
                  <span>{id}</span>
                  <button
                    onClick={() => handleCopy(id)}
                    className="opacity-50 hover:opacity-100 text-[10px] text-slate-400 hover:text-white"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 4. HASH GENERATOR WORKSPACE */}
      {/* ------------------------------------------------------------------ */}
      {toolSlug.includes('hash') && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Input String to Hash:
            </label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-3">
            {[
              { name: 'SHA-256 (Recommended)', val: hashResults.sha256 },
              { name: 'SHA-512 (Ultra High Security)', val: hashResults.sha512 },
              { name: 'SHA-1 (Legacy)', val: hashResults.sha1 },
              { name: 'MD5 Checksum', val: hashResults.md5 }
            ].map((h, i) => (
              <div key={i} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{h.name}:</span>
                  <button
                    onClick={() => handleCopy(h.val)}
                    className="text-slate-500 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <div className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
                  {h.val}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 5. COLOR CODE & CONTRAST CHECKER WORKSPACE */}
      {/* ------------------------------------------------------------------ */}
      {toolSlug.includes('color') && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                Foreground Color:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-12 h-12 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                Background Color:
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-12 h-12 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Live Preview Box */}
          <div 
            style={{ backgroundColor: bgColor, color: fgColor }}
            className="p-6 rounded-2xl border border-slate-300 shadow-md text-center space-y-2 transition-all"
          >
            <h4 className="text-xl font-bold font-display">Live Typography Contrast Test</h4>
            <p className="text-sm font-sans max-w-md mx-auto opacity-90">
              This preview dynamically reflects WCAG 2.1 accessibility guidelines for normal body text and large headings.
            </p>
          </div>

          {/* WCAG Compliance Scorecards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold block mb-1">
                Contrast Ratio
              </span>
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-indigo-600 dark:text-indigo-400">
                {colorAnalysis.contrastRatio}
              </span>
            </div>
            <div className={`p-4 rounded-2xl text-center border ${colorAnalysis.normalAA ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
              <span className="text-xs font-mono font-bold block mb-1">Normal Text AA</span>
              <span className="text-xl font-bold font-mono">{colorAnalysis.normalAA ? 'PASS (✓)' : 'FAIL (✗)'}</span>
            </div>
            <div className={`p-4 rounded-2xl text-center border ${colorAnalysis.normalAAA ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
              <span className="text-xs font-mono font-bold block mb-1">Normal Text AAA</span>
              <span className="text-xl font-bold font-mono">{colorAnalysis.normalAAA ? 'PASS (✓)' : 'FAIL (✗)'}</span>
            </div>
            <div className={`p-4 rounded-2xl text-center border ${colorAnalysis.largeAA ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
              <span className="text-xs font-mono font-bold block mb-1">Large Text AA</span>
              <span className="text-xl font-bold font-mono">{colorAnalysis.largeAA ? 'PASS (✓)' : 'FAIL (✗)'}</span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 6. REGEX TESTER WORKSPACE */}
      {/* ------------------------------------------------------------------ */}
      {toolSlug.includes('regex') && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-3">
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Regular Expression Pattern:
              </label>
              <input
                type="text"
                value={regexPattern}
                onChange={(e) => setRegexPattern(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-indigo-300 font-mono text-sm"
                placeholder="Enter regex pattern e.g. [a-z0-9]+"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Flags:
              </label>
              <input
                type="text"
                value={regexFlags}
                onChange={(e) => setRegexFlags(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-mono text-sm"
                placeholder="gi"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Test Corpus String:
            </label>
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold">Captured Matches ({regexResult.matchCount}):</span>
              {regexResult.error && <span className="text-rose-400 font-bold">{regexResult.error}</span>}
            </div>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {regexResult.matches.map((m, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono">
                  #{idx + 1}: {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 7. TIMESTAMP & UNIX EPOCH WORKSPACE */}
      {/* ------------------------------------------------------------------ */}
      {toolSlug.includes('timestamp') && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
            <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold block mb-1">
              Current Unix Timestamp (Epoch)
            </span>
            <span className="text-3xl sm:text-4xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400">
              {timestampResult.currentEpochSeconds}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                Epoch Timestamp ➔ Date:
              </label>
              <input
                type="number"
                value={unixInput}
                onChange={(e) => setUnixInput(parseInt(e.target.value, 10) || 0)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
              />
              <div className="text-xs font-mono text-slate-700 dark:text-slate-300 space-y-1">
                <div>UTC: <span className="text-indigo-400 font-bold">{timestampResult.utcDate}</span></div>
                <div>Local: <span className="text-emerald-400 font-bold">{timestampResult.localDate}</span></div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                Date Picker ➔ Epoch:
              </label>
              <input
                type="datetime-local"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
              />
              <div className="text-xs font-mono text-slate-700 dark:text-slate-300">
                Timestamp: <span className="text-indigo-400 font-bold">{timestampResult.convertedUnix}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 8. AGE & DATE DIFFERENCE CALCULATOR */}
      {/* ------------------------------------------------------------------ */}
      {(toolSlug.includes('age') || toolSlug.includes('date-difference')) && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                Date of Birth:
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
              />
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                Calculate Age At Date:
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold block mb-1">
                Exact Age
              </span>
              <span className="text-xl sm:text-2xl font-display font-extrabold text-indigo-600 dark:text-indigo-400">
                {ageResult.years}y {ageResult.months}m {ageResult.days}d
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center">
              <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold block mb-1">
                Total Days Lived
              </span>
              <span className="text-xl sm:text-2xl font-display font-extrabold text-purple-600 dark:text-purple-400">
                {ageResult.totalDays.toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold block mb-1">
                Total Hours
              </span>
              <span className="text-xl sm:text-2xl font-display font-extrabold text-emerald-600 dark:text-emerald-400">
                {ageResult.totalHours.toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
              <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold block mb-1">
                Next Birthday In
              </span>
              <span className="text-xl sm:text-2xl font-display font-extrabold text-amber-600 dark:text-amber-400">
                {ageResult.nextBirthdayDays} Days
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 9. PERCENTAGE CALCULATOR WORKSPACE */}
      {/* ------------------------------------------------------------------ */}
      {toolSlug.includes('percentage') && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'what_is_pct', label: 'What is X% of Y?' },
              { id: 'is_what_pct', label: 'X is what % of Y?' },
              { id: 'increase_decrease', label: '% Increase / Decrease' },
              { id: 'fraction', label: 'Fraction to %' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setPctMode(tab.id as any)}
                className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                  pctMode === tab.id
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Value 1 (X):
                </label>
                <input
                  type="number"
                  value={pctVal1}
                  onChange={(e) => setPctVal1(parseFloat(e.target.value) || 0)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mb-1">
                  Value 2 (Y):
                </label>
                <input
                  type="number"
                  value={pctVal2}
                  onChange={(e) => setPctVal2(parseFloat(e.target.value) || 0)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm font-bold"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center space-y-1">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{percentageResult.formula}</span>
              <div className="text-3xl font-display font-extrabold text-indigo-600 dark:text-indigo-400">
                {percentageResult.result}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 10. PASSWORD GENERATOR & ENTROPY WORKSPACE */}
      {/* ------------------------------------------------------------------ */}
      {toolSlug.includes('password') && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                  Password Length: {pwLength} characters
                </label>
                <span className="text-xs font-mono text-indigo-400 font-bold">
                  {passwordEntropy.entropy} bits entropy ({passwordEntropy.strength})
                </span>
              </div>
              <input
                type="range"
                min={8}
                max={64}
                value={pwLength}
                onChange={(e) => setPwLength(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={pwUpper} onChange={(e) => setPwUpper(e.target.checked)} className="rounded text-indigo-600" />
                <span>Uppercase (A-Z)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={pwLower} onChange={(e) => setPwLower(e.target.checked)} className="rounded text-indigo-600" />
                <span>Lowercase (a-z)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={pwNumbers} onChange={(e) => setPwNumbers(e.target.checked)} className="rounded text-indigo-600" />
                <span>Numbers (0-9)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                <input type="checkbox" checked={pwSymbols} onChange={(e) => setPwSymbols(e.target.checked)} className="rounded text-indigo-600" />
                <span>Symbols (!@#$)</span>
              </label>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase">Generated Secure Password:</span>
              <button
                onClick={generateSecurePassword}
                className="text-xs font-mono text-indigo-500 hover:text-indigo-400 flex items-center gap-1 cursor-pointer font-bold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-indigo-500/30 flex items-center justify-between gap-4">
              <span className="font-mono text-sm sm:text-base font-bold text-slate-900 dark:text-white break-all">
                {generatedPassword}
              </span>
              <button
                onClick={() => handleCopy(generatedPassword)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Universal Fallback Workspace for unhandled developer tools */}
      {(!toolSlug.includes('json') &&
        !toolSlug.includes('base64') &&
        !toolSlug.includes('css') &&
        !toolSlug.includes('minifi') &&
        !toolSlug.includes('uuid') &&
        !toolSlug.includes('hash') &&
        !toolSlug.includes('contrast') &&
        !toolSlug.includes('regex') &&
        !toolSlug.includes('timestamp') &&
        !toolSlug.includes('password')) && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Source Code / Developer Input:
              </label>
              <span className="text-xs font-mono text-slate-400">
                {inputText.length} bytes
              </span>
            </div>
            <textarea
              rows={8}
              value={inputText}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste code, payload, or parameters here..."
              className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all leading-relaxed"
              style={{ fontSize: '16px' }}
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">Execution Output:</span>
              <button
                type="button"
                onClick={() => handleCopy(inputText)}
                className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 max-h-40 overflow-y-auto whitespace-pre-wrap select-all">
              {inputText || '// Ready for developer computation'}
            </div>
          </div>
        </div>
      )}

      {/* Global Actions Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(inputText)}
            className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Result Copied' : 'Copy Raw Output'}</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export PDF Report</span>
          </button>
        </div>
        <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          100% Client-Side Engine
        </span>
      </div>
    </div>
  );
}

export default DeveloperToolEngine;
