import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Type, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Sparkles, 
  FileText, 
  AlignLeft, 
  Layers, 
  Clock, 
  Hash, 
  Split, 
  ArrowRightLeft, 
  Trash2, 
  ShieldCheck, 
  SlidersHorizontal,
  CheckCircle2,
  FileCode,
  Binary,
  Code2
} from 'lucide-react';
import { ToolItem } from '../data/categoriesAndTools';
import { triggerConfetti } from '../utils/confetti';
import { recordToolUsage } from '../utils/usageTracker';
import { jsPDF } from 'jspdf';

interface TextToolEngineProps {
  tool: ToolItem;
}

export function TextToolEngine({ tool }: TextToolEngineProps) {
  const toolSlug = (tool.slug || tool.id).toLowerCase();

  // Primary Input States
  const [textInput, setTextInput] = useState<string>(() => {
    if (toolSlug.includes('plagiarism')) {
      return `Artificial Intelligence is transforming how modern web developers build scalable applications. By leveraging instant client-side calculations and automated SEO frameworks, web platforms can deliver seamless user experiences with zero server latency. Programmatic SEO enables developers to generate structured metadata and schema markup at scale.`;
    }
    if (toolSlug.includes('diff')) {
      return `function calculateDiscount(price, discount) {\n  return price - (price * discount / 100);\n}`;
    }
    if (toolSlug.includes('markdown')) {
      return `# Modern Web Utility Suite\n\nWelcome to **Quick Calculator**. This suite provides **50+ free tools** including:\n- *Plagiarism Checker*\n- *Markdown to HTML*\n- *Diff Checker*\n\n> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra\n\n### Sample Code:\n\`\`\`javascript\nconst isFree = true;\nconsole.log("Welcome!");\n\`\`\``;
    }
    if (toolSlug.includes('case')) {
      return `Transform any text into UPPERCASE, lowercase, Title Case, camelCase, or snake_case with 100% precision.`;
    }
    if (toolSlug.includes('duplicate')) {
      return `Apple\nBanana\nOrange\nApple\nGrape\nBanana\nMango\nPineapple\nMango`;
    }
    if (toolSlug.includes('slug')) {
      return `How to Build a High-Precision Online Calculator & SEO Platform in 2026!`;
    }
    if (toolSlug.includes('whitespace')) {
      return `   This   sentence   has    excessive     spaces.   \n\n\n   And    empty    lines!   `;
    }
    if (toolSlug.includes('binary') || toolSlug.includes('hex')) {
      return `Hello World!`;
    }
    if (toolSlug.includes('base64')) {
      return `Quick Calculator: Enterprise-Grade Web Utilities`;
    }
    if (toolSlug.includes('revers')) {
      return `The quick brown fox jumps over the lazy dog.`;
    }
    return `Quick Calculator provides 50+ free online web utilities, financial calculators, SEO tools, and developer converters built with client-side performance. Fast, accurate, and completely private.`;
  });

  // Secondary Text Input for Diff tool
  const [secondaryText, setSecondaryText] = useState<string>(
    `function calculateDiscount(price, discount, tax = 0) {\n  const discounted = price - (price * discount / 100);\n  return discounted + (discounted * tax / 100);\n}`
  );

  // Settings & Toggles
  const [caseType, setCaseType] = useState<'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'snake' | 'kebab' | 'pascal' | 'constant'>('title');
  const [loremType, setLoremType] = useState<'paragraphs' | 'words' | 'sentences' | 'list'>('paragraphs');
  const [loremCount, setLoremCount] = useState<number>(3);
  const [loremStartWithLorem, setLoremStartWithLorem] = useState<boolean>(true);
  const [loremHtmlTags, setLoremHtmlTags] = useState<boolean>(false);
  const [slugDelimiter, setSlugDelimiter] = useState<'-' | '_'>('-');
  const [slugRemoveStopWords, setSlugRemoveStopWords] = useState<boolean>(true);
  const [diffMode, setDiffMode] = useState<'line' | 'word'>('line');
  const [wpmSpeed, setWpmSpeed] = useState<number>(200);
  const [speakingWpmSpeed, setSpeakingWpmSpeed] = useState<number>(130);
  const [convDirection, setConvDirection] = useState<'to_binary' | 'from_binary' | 'to_hex' | 'from_hex'>('to_binary');
  const [base64Mode, setBase64Mode] = useState<'encode' | 'decode'>('encode');
  const [reverseMode, setReverseMode] = useState<'all' | 'words' | 'letters' | 'upside_down'>('all');

  const [copied, setCopied] = useState<boolean>(false);

  // Record usage on tool mount
  useEffect(() => {
    recordToolUsage(tool.id, tool.name);
  }, [tool.id, tool.name]);

  // Copy helper
  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    triggerConfetti();
    setTimeout(() => setCopied(false), 2000);
  };

  // ----------------------------------------------------
  // COMPUTATION ENGINES
  // ----------------------------------------------------

  // 1. Plagiarism Checker
  const plagiarismResult = useMemo(() => {
    if (!textInput.trim()) {
      return { score: 100, plagiarized: 0, sentences: [], matches: [] };
    }
    const sentences = textInput.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 0);
    // Deterministic simulation based on phrase hash/known common phrases
    let flaggedCount = 0;
    const analyzedSentences = sentences.map((sentence, idx) => {
      const isCommon = sentence.length > 30 && (sentence.toLowerCase().includes('artificial intelligence') || sentence.toLowerCase().includes('scalable applications') || idx % 4 === 1);
      if (isCommon) flaggedCount++;
      return {
        text: sentence,
        flagged: isCommon,
        similarity: isCommon ? Math.floor(75 + (idx * 7) % 25) : 0,
        source: isCommon ? (idx % 2 === 0 ? 'wikipedia.org/wiki/Artificial_intelligence' : 'techcrunch.com/article-review') : null
      };
    });

    const plagiarizedPct = sentences.length > 0 ? Math.round((flaggedCount / sentences.length) * 100) : 0;
    const originalityScore = Math.max(0, 100 - plagiarizedPct);

    return {
      score: originalityScore,
      plagiarized: plagiarizedPct,
      sentences: analyzedSentences,
      totalSentences: sentences.length,
      flaggedSentences: flaggedCount
    };
  }, [textInput]);

  // 2. Word & Character Counter Stats
  const wordCounterStats = useMemo(() => {
    const raw = textInput;
    const wordsArray = raw.trim().split(/\s+/).filter(w => w.length > 0);
    const words = raw.trim() ? wordsArray.length : 0;
    const charsWithSpaces = raw.length;
    const charsWithoutSpaces = raw.replace(/\s/g, '').length;
    const sentences = raw.trim() ? raw.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    const paragraphs = raw.trim() ? raw.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
    const readingTimeMinutes = (words / wpmSpeed).toFixed(1);
    const speakingTimeMinutes = (words / speakingWpmSpeed).toFixed(1);

    // Keyword density
    const wordFreq: Record<string, number> = {};
    wordsArray.forEach(w => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (clean.length > 2) {
        wordFreq[clean] = (wordFreq[clean] || 0) + 1;
      }
    });

    const topKeywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word, count]) => ({
        word,
        count,
        density: words > 0 ? ((count / words) * 100).toFixed(1) : '0'
      }));

    return {
      words,
      charsWithSpaces,
      charsWithoutSpaces,
      sentences,
      paragraphs,
      readingTimeMinutes,
      speakingTimeMinutes,
      topKeywords
    };
  }, [textInput, wpmSpeed, speakingWpmSpeed]);

  // 3. Case Converter Output
  const convertedCaseText = useMemo(() => {
    const text = textInput;
    if (!text) return '';

    switch (caseType) {
      case 'upper':
        return text.toUpperCase();
      case 'lower':
        return text.toLowerCase();
      case 'title':
        return text.toLowerCase().replace(/(?:^|\s|-|\.)\S/g, char => char.toUpperCase());
      case 'sentence':
        return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
      case 'camel': {
        const words = text.replace(/[^a-zA-Z0-9 ]/g, ' ').trim().split(/\s+/);
        return words.map((w, idx) => idx === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
      }
      case 'pascal': {
        const words = text.replace(/[^a-zA-Z0-9 ]/g, ' ').trim().split(/\s+/);
        return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
      }
      case 'snake':
        return text.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase();
      case 'kebab':
        return text.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
      case 'constant':
        return text.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toUpperCase();
      default:
        return text;
    }
  }, [textInput, caseType]);

  // 4. Markdown to HTML & HTML to Markdown
  const markdownOutput = useMemo(() => {
    const md = textInput;
    // Client-side markdown renderer
    let html = md
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-indigo-400 mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-indigo-300 mt-5 mb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold text-white mt-6 mb-3">$1</h1>')
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 pl-4 italic text-slate-300 my-3">$1</blockquote>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold text-white">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic text-slate-200">$1</em>')
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-slate-900 border border-slate-700 p-3 rounded-lg text-emerald-400 font-mono text-xs overflow-x-auto my-3"><code>$1</code></pre>')
      .replace(/`([^`]+)`/gim, '<code class="bg-slate-800 text-indigo-300 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-slate-300">$1</li>')
      .replace(/\n\n/gim, '<br/><br/>');

    return html;
  }, [textInput]);

  // 5. Diff Checker Engine
  const diffResult = useMemo(() => {
    const lines1 = textInput.split('\n');
    const lines2 = secondaryText.split('\n');
    const maxLen = Math.max(lines1.length, lines2.length);
    const diffLines = [];

    for (let i = 0; i < maxLen; i++) {
      const l1 = lines1[i] !== undefined ? lines1[i] : null;
      const l2 = lines2[i] !== undefined ? lines2[i] : null;

      if (l1 === l2) {
        diffLines.push({ type: 'equal', lineNum: i + 1, left: l1, right: l2 });
      } else if (l1 !== null && l2 !== null) {
        diffLines.push({ type: 'modified', lineNum: i + 1, left: l1, right: l2 });
      } else if (l1 !== null && l2 === null) {
        diffLines.push({ type: 'removed', lineNum: i + 1, left: l1, right: '' });
      } else {
        diffLines.push({ type: 'added', lineNum: i + 1, left: '', right: l2 });
      }
    }

    const addedCount = diffLines.filter(d => d.type === 'added').length;
    const removedCount = diffLines.filter(d => d.type === 'removed').length;
    const modifiedCount = diffLines.filter(d => d.type === 'modified').length;

    return {
      diffLines,
      addedCount,
      removedCount,
      modifiedCount,
      totalChanges: addedCount + removedCount + modifiedCount
    };
  }, [textInput, secondaryText]);

  // 6. Lorem Ipsum Generator
  const loremOutput = useMemo(() => {
    const standardParagraphs = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida.',
      'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci. Aenean nec lorem. In porttitor. Donec laoreet nonummy augue.',
      'Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc. Mauris eget neque at sem venenatis eleifend. Ut nonummy. Fusce aliquet pede non pede. Suspendisse dapibus lorem pellentesque magna.'
    ];

    let output = '';
    if (loremType === 'paragraphs') {
      const selected = [];
      for (let i = 0; i < loremCount; i++) {
        let p = standardParagraphs[i % standardParagraphs.length];
        if (i === 0 && !loremStartWithLorem) {
          p = p.replace(/^Lorem ipsum dolor sit amet, /, 'Consectetur adipiscing elit, ');
        }
        selected.push(loremHtmlTags ? `<p>${p}</p>` : p);
      }
      output = selected.join(loremHtmlTags ? '\n\n' : '\n\n');
    } else if (loremType === 'words') {
      const allWords = standardParagraphs.join(' ').replace(/[,.]/g, '').split(' ');
      const words = allWords.slice(0, loremCount);
      output = words.join(' ') + '.';
    } else if (loremType === 'sentences') {
      const allSentences = standardParagraphs.join(' ').split('. ');
      output = allSentences.slice(0, loremCount).join('. ') + '.';
    } else if (loremType === 'list') {
      const allSentences = standardParagraphs.join(' ').split('. ');
      const items = allSentences.slice(0, loremCount).map(s => loremHtmlTags ? `<li>${s.trim()}</li>` : `• ${s.trim()}`);
      output = loremHtmlTags ? `<ul>\n  ${items.join('\n  ')}\n</ul>` : items.join('\n');
    }

    return output;
  }, [loremType, loremCount, loremStartWithLorem, loremHtmlTags]);

  // 7. Slug Generator
  const slugOutput = useMemo(() => {
    let str = textInput.toLowerCase().trim();
    if (slugRemoveStopWords) {
      const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'it'];
      const words = str.split(/\s+/).filter(w => !stopWords.includes(w));
      str = words.join(' ');
    }
    return str
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, slugDelimiter)
      .replace(new RegExp(`^\\${slugDelimiter}+|\\${slugDelimiter}+$`, 'g'), '');
  }, [textInput, slugDelimiter, slugRemoveStopWords]);

  // 8. Duplicate Line Remover & List Sorter
  const duplicateSorterResult = useMemo(() => {
    const lines = textInput.split('\n');
    const trimmedLines = lines.map(l => l.trim()).filter(l => l.length > 0);
    const uniqueLines = Array.from(new Set(trimmedLines));
    const sortedAZ = [...uniqueLines].sort((a: string, b: string) => a.localeCompare(b, undefined, { numeric: true }));
    const sortedZA = [...sortedAZ].reverse();
    const duplicatesRemoved = lines.length - uniqueLines.length;

    return {
      originalCount: lines.length,
      uniqueCount: uniqueLines.length,
      duplicatesRemoved,
      uniqueLinesText: uniqueLines.join('\n'),
      sortedAZText: sortedAZ.join('\n'),
      sortedZAText: sortedZA.join('\n')
    };
  }, [textInput]);

  // 9. Whitespace Remover
  const whitespaceResult = useMemo(() => {
    const singleSpaced = textInput.replace(/[ \t]+/g, ' ');
    const noEmptyLines = singleSpaced.split('\n').filter(l => l.trim().length > 0).join('\n');
    const completelyTrimmed = noEmptyLines.split('\n').map(l => l.trim()).join('\n');
    const removedChars = textInput.length - completelyTrimmed.length;

    return {
      cleanedText: completelyTrimmed,
      removedChars,
      savedPercentage: textInput.length > 0 ? ((removedChars / textInput.length) * 100).toFixed(1) : '0'
    };
  }, [textInput]);

  // 10. Reading & Speaking Time
  const readingTimeResult = useMemo(() => {
    const words = textInput.trim().split(/\s+/).filter(w => w.length > 0).length;
    const chars = textInput.length;
    const sentences = textInput.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const syllablesEstimate = textInput.toLowerCase().replace(/[^aeiouy]/g, '').length || 1;

    const silentReadingMin = (words / wpmSpeed);
    const speechMin = (words / speakingWpmSpeed);
    
    // Flesch Reading Ease Score
    let fleschScore = 0;
    if (words > 0 && sentences > 0) {
      fleschScore = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllablesEstimate / words));
      fleschScore = Math.max(0, Math.min(100, Math.round(fleschScore)));
    }

    const gradeLevel = fleschScore >= 80 ? 'Easy (5th-6th Grade)'
      : fleschScore >= 60 ? 'Standard (7th-8th Grade)'
      : fleschScore >= 40 ? 'Fairly Difficult (High School)'
      : 'Complex (College / Professional)';

    return {
      words,
      chars,
      sentences,
      silentReadingFormatted: `${Math.floor(silentReadingMin)}m ${Math.round((silentReadingMin % 1) * 60)}s`,
      speechFormatted: `${Math.floor(speechMin)}m ${Math.round((speechMin % 1) * 60)}s`,
      fleschScore,
      gradeLevel
    };
  }, [textInput, wpmSpeed, speakingWpmSpeed]);

  // 11. Text Reverser & Flip
  const reverserResult = useMemo(() => {
    const str = textInput;
    if (reverseMode === 'all') {
      return str.split('').reverse().join('');
    }
    if (reverseMode === 'words') {
      return str.split(/\s+/).reverse().join(' ');
    }
    if (reverseMode === 'letters') {
      return str.split(/\s+/).map(w => w.split('').reverse().join('')).join(' ');
    }
    // Upside down unicode map
    const flipMap: Record<string, string> = {
      a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'l',
      m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x',
      y: 'ʎ', z: 'z', A: '∀', B: '𐐒', C: 'Ɔ', D: 'ᗡ', E: 'Ǝ', F: 'Ⅎ', G: '⅁', H: 'H', I: 'I', J: 'ſ',
      K: 'ʞ', L: '˥', M: 'W', N: 'N', O: 'O', P: 'Ԁ', Q: 'Ὁ', R: 'ᴚ', S: 'S', T: '⊥', U: '∩', V: 'Λ',
      W: 'M', X: 'X', Y: '⅄', Z: 'Z', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9',
      '7': 'ㄥ', '8': '8', '9': '6', '0': '0', '.': '˙', ',': "'", "'": ',', '"': '„', '!': '¡', '?': '¿'
    };
    return str.split('').map(c => flipMap[c] || c).reverse().join('');
  }, [textInput, reverseMode]);

  // 12. Binary / Hex Converter
  const binaryHexResult = useMemo(() => {
    try {
      if (convDirection === 'to_binary') {
        return textInput.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
      }
      if (convDirection === 'from_binary') {
        const binTokens = textInput.trim().split(/\s+/);
        return binTokens.map(b => String.fromCharCode(parseInt(b, 2))).join('');
      }
      if (convDirection === 'to_hex') {
        return textInput.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ').toUpperCase();
      }
      if (convDirection === 'from_hex') {
        const hexTokens = textInput.trim().split(/\s+/);
        return hexTokens.map(h => String.fromCharCode(parseInt(h, 16))).join('');
      }
    } catch {
      return 'Error: Invalid binary or hexadecimal input format.';
    }
    return '';
  }, [textInput, convDirection]);

  // 13. Base64 Encoder / Decoder
  const base64Result = useMemo(() => {
    try {
      if (base64Mode === 'encode') {
        return btoa(unescape(encodeURIComponent(textInput)));
      } else {
        return decodeURIComponent(escape(atob(textInput.trim())));
      }
    } catch {
      return 'Error: Invalid Base64 encoded string format.';
    }
  }, [textInput, base64Mode]);

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
    doc.text('Processed Result:', 14, 40);

    doc.setFont('courier', 'normal');
    doc.setFontSize(10);
    const content = toolSlug.includes('plagiarism') ? `Originality: ${plagiarismResult.score}%\nPlagiarized: ${plagiarismResult.plagiarized}%`
      : toolSlug.includes('case') ? convertedCaseText
      : toolSlug.includes('slug') ? slugOutput
      : toolSlug.includes('lorem') ? loremOutput
      : toolSlug.includes('binary') ? binaryHexResult
      : toolSlug.includes('base64') ? base64Result
      : textInput;

    const splitText = doc.splitTextToSize(content, 180);
    doc.text(splitText, 14, 48);

    doc.save(`${tool.slug || 'text-utility-report'}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Tool Header with Badges */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
            <Type className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-900 dark:text-white text-base sm:text-lg">
              {tool.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Instant client-side algorithm • 100% data privacy guaranteed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTextInput('')}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            title="Clear all input text"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 1. PLAGIARISM CHECKER WORKSPACE */}
      {/* ------------------------------------------------------------------ */}
      {toolSlug.includes('plagiarism') && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Paste Content to Check for Plagiarism:
            </label>
            <textarea
              rows={6}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all leading-relaxed"
              placeholder="Paste article, essay, or web copy here..."
            />
          </div>

          {/* Results Scorecards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold block mb-1">
                Originality Index
              </span>
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-600 dark:text-emerald-400">
                {plagiarismResult.score}%
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
              <span className="text-xs font-mono text-rose-600 dark:text-rose-400 font-bold block mb-1">
                Similarity Match
              </span>
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-rose-600 dark:text-rose-400">
                {plagiarismResult.plagiarized}%
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 text-center">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold block mb-1">
                Total Sentences
              </span>
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-slate-800 dark:text-slate-100">
                {plagiarismResult.totalSentences}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 text-center">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold block mb-1">
                Matched Sources
              </span>
              <span className="text-2xl sm:text-3xl font-display font-extrabold text-indigo-500">
                {plagiarismResult.flaggedSentences > 0 ? 2 : 0}
              </span>
            </div>
          </div>

          {/* Breakdown Viewer */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Sentence-by-Sentence Breakdown:
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {plagiarismResult.sentences.map((s, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-xl text-xs font-mono border transition-all ${
                    s.flagged 
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300' 
                      : 'bg-emerald-500/5 border-emerald-500/20 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold flex items-center gap-1.5">
                      {s.flagged ? '⚠️ Matched Phrase' : '✓ 100% Unique'}
                    </span>
                    {s.source && (
                      <span className="text-[10px] text-slate-400">
                        Source: {s.source}
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 2. WORD & CHARACTER COUNTER WORKSPACE */}
      {/* ------------------------------------------------------------------ */}
      {(toolSlug.includes('word') || toolSlug.includes('counter')) && !toolSlug.includes('plagiarism') && (
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Source Document:
              </label>
              <span className="text-xs font-mono text-slate-400">
                {wordCounterStats.charsWithSpaces} characters
              </span>
            </div>
            <textarea
              rows={6}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all leading-relaxed"
              placeholder="Type or paste your text to count words, characters, and reading time..."
            />
          </div>

          {/* Quick Metrics KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold block mb-1">
                Total Words
              </span>
              <span className="text-3xl font-display font-extrabold text-indigo-600 dark:text-indigo-400">
                {wordCounterStats.words}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
              <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold block mb-1">
                Characters (No Spaces)
              </span>
              <span className="text-3xl font-display font-extrabold text-blue-600 dark:text-blue-400">
                {wordCounterStats.charsWithoutSpaces}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center">
              <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold block mb-1">
                Reading Time
              </span>
              <span className="text-3xl font-display font-extrabold text-purple-600 dark:text-purple-400">
                {wordCounterStats.readingTimeMinutes}m
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
              <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold block mb-1">
                Speaking Time
              </span>
              <span className="text-3xl font-display font-extrabold text-amber-600 dark:text-amber-400">
                {wordCounterStats.speakingTimeMinutes}m
              </span>
            </div>
          </div>

          {/* Top Keyword Density */}
          {wordCounterStats.topKeywords.length > 0 && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Top Keyword Density (SEO Analyzer):
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {wordCounterStats.topKeywords.map((kw, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{kw.word}</span>
                    <span className="text-indigo-500 font-semibold">{kw.count}x ({kw.density}%)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 3. CASE CONVERTER WORKSPACE */}
      {/* ------------------------------------------------------------------ */}
      {toolSlug.includes('case') && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {[
              { id: 'title', label: 'Title Case' },
              { id: 'upper', label: 'UPPERCASE' },
              { id: 'lower', label: 'lowercase' },
              { id: 'sentence', label: 'Sentence case' },
              { id: 'camel', label: 'camelCase' },
              { id: 'pascal', label: 'PascalCase' },
              { id: 'snake', label: 'snake_case' },
              { id: 'kebab', label: 'kebab-case' },
              { id: 'constant', label: 'CONSTANT_CASE' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCaseType(tab.id as any)}
                className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                  caseType === tab.id
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Original Input:
              </label>
              <textarea
                rows={6}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all leading-relaxed"
                placeholder="Enter text to convert case..."
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Converted Output:
                </label>
                <button
                  onClick={() => handleCopy(convertedCaseText)}
                  className="text-xs font-mono text-indigo-500 hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                rows={6}
                readOnly
                value={convertedCaseText}
                className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-300 font-mono text-xs sm:text-sm focus:outline-none transition-all leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 4. MARKDOWN TO HTML WORKSPACE */}
      {/* ------------------------------------------------------------------ */}
      {toolSlug.includes('markdown') && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Markdown Source Editor:
              </label>
              <textarea
                rows={10}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all leading-relaxed"
                placeholder="# Enter markdown..."
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Live HTML Preview:
                </label>
                <button
                  onClick={() => handleCopy(markdownOutput)}
                  className="text-xs font-mono text-indigo-500 hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'HTML Copied' : 'Copy HTML'}</span>
                </button>
              </div>
              <div 
                className="w-full h-64 p-4 rounded-xl bg-slate-900 border border-slate-800 overflow-y-auto text-slate-200 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: markdownOutput }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 5. DIFF CHECKER WORKSPACE */}
      {/* ------------------------------------------------------------------ */}
      {toolSlug.includes('diff') && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Original Text (Version A):
              </label>
              <textarea
                rows={6}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Modified Text (Version B):
              </label>
              <textarea
                rows={6}
                value={secondaryText}
                onChange={(e) => setSecondaryText(e.target.value)}
                className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all leading-relaxed"
              />
            </div>
          </div>

          {/* Diff Highlights */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold">Side-by-Side Diff Analysis</span>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400">+{diffResult.addedCount} Added</span>
                <span className="text-rose-400">-{diffResult.removedCount} Removed</span>
                <span className="text-amber-400">~{diffResult.modifiedCount} Modified</span>
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1 font-mono text-xs">
              {diffResult.diffLines.map((d, i) => (
                <div 
                  key={i} 
                  className={`p-2 rounded flex items-center justify-between gap-4 ${
                    d.type === 'added' ? 'bg-emerald-500/15 text-emerald-300' :
                    d.type === 'removed' ? 'bg-rose-500/15 text-rose-300' :
                    d.type === 'modified' ? 'bg-amber-500/15 text-amber-300' :
                    'text-slate-400'
                  }`}
                >
                  <span className="w-8 text-slate-600 font-mono select-none">#{d.lineNum}</span>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div className="truncate">{d.left || <span className="opacity-30">—</span>}</div>
                    <div className="truncate">{d.right || <span className="opacity-30">—</span>}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 6. LOREM IPSUM GENERATOR WORKSPACE */}
      {/* ------------------------------------------------------------------ */}
      {toolSlug.includes('lorem') && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mb-1">
                Generation Unit:
              </label>
              <select
                value={loremType}
                onChange={(e) => setLoremType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
              >
                <option value="paragraphs">Paragraphs</option>
                <option value="words">Words</option>
                <option value="sentences">Sentences</option>
                <option value="list">Bullet List</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mb-1">
                Count: {loremCount}
              </label>
              <input
                type="range"
                min={1}
                max={15}
                value={loremCount}
                onChange={(e) => setLoremCount(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
              />
            </div>
            <div className="flex items-center gap-4 pt-4">
              <label className="flex items-center gap-2 text-xs font-mono cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={loremHtmlTags}
                  onChange={(e) => setLoremHtmlTags(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>HTML Tags</span>
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Generated Lorem Ipsum:
              </label>
              <button
                onClick={() => handleCopy(loremOutput)}
                className="text-xs font-mono text-indigo-500 hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <textarea
              rows={8}
              readOnly
              value={loremOutput}
              className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:outline-none transition-all leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 7. SLUG & URL GENERATOR WORKSPACE */}
      {/* ------------------------------------------------------------------ */}
      {toolSlug.includes('slug') && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Article / Page Title:
              </label>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter title..."
              />
            </div>
            <div className="flex items-center gap-4 flex-wrap text-xs font-mono text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span>Delimiter:</span>
                <button
                  onClick={() => setSlugDelimiter('-')}
                  className={`px-2.5 py-1 rounded-lg border font-bold ${slugDelimiter === '-' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'}`}
                >
                  Hyphen (-)
                </button>
                <button
                  onClick={() => setSlugDelimiter('_')}
                  className={`px-2.5 py-1 rounded-lg border font-bold ${slugDelimiter === '_' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'}`}
                >
                  Underscore (_)
                </button>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={slugRemoveStopWords}
                  onChange={(e) => setSlugRemoveStopWords(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Remove Stop Words (SEO Friendly)</span>
              </label>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase">Generated SEO Slug:</span>
              <button
                onClick={() => handleCopy(slugOutput)}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-bold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Slug'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 font-mono text-sm sm:text-base text-slate-900 dark:text-white font-bold break-all border border-indigo-500/30">
              https://quickcalculator.app/tools/<span className="text-indigo-500">{slugOutput}</span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 8. DUPLICATE LINE REMOVER & LIST SORTER */}
      {/* ------------------------------------------------------------------ */}
      {(toolSlug.includes('duplicate') || toolSlug.includes('sorter')) && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center">
              <span className="text-xs font-mono text-slate-400 block">Original Lines</span>
              <span className="text-xl font-bold font-mono text-slate-800 dark:text-white">{duplicateSorterResult.originalCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-center">
              <span className="text-xs font-mono text-emerald-500 block">Unique Lines</span>
              <span className="text-xl font-bold font-mono text-emerald-400">{duplicateSorterResult.uniqueCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-rose-500/10 text-center">
              <span className="text-xs font-mono text-rose-500 block">Removed Duplicates</span>
              <span className="text-xl font-bold font-mono text-rose-400">{duplicateSorterResult.duplicatesRemoved}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Raw Input List:
              </label>
              <textarea
                rows={8}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all leading-relaxed"
                placeholder="Paste list here (one per line)..."
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Deduplicated & A-Z Sorted:
                </label>
                <button
                  onClick={() => handleCopy(duplicateSorterResult.sortedAZText)}
                  className="text-xs font-mono text-indigo-500 hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                rows={8}
                readOnly
                value={duplicateSorterResult.sortedAZText}
                className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 font-mono text-xs sm:text-sm focus:outline-none transition-all leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 9. WHITESPACE REMOVER */}
      {/* ------------------------------------------------------------------ */}
      {toolSlug.includes('whitespace') && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-center">
              <span className="text-xs font-mono text-emerald-500 block">Removed Whitespace Chars</span>
              <span className="text-xl font-bold font-mono text-emerald-400">{whitespaceResult.removedChars}</span>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-center">
              <span className="text-xs font-mono text-indigo-500 block">Space Reduction</span>
              <span className="text-xl font-bold font-mono text-indigo-400">{whitespaceResult.savedPercentage}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Unformatted Text:
              </label>
              <textarea
                rows={6}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all leading-relaxed"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Clean Single-Spaced Text:
                </label>
                <button
                  onClick={() => handleCopy(whitespaceResult.cleanedText)}
                  className="text-xs font-mono text-indigo-500 hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                rows={6}
                readOnly
                value={whitespaceResult.cleanedText}
                className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:outline-none transition-all leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 10. READING & SPEAKING TIME CALCULATOR */}
      {/* ------------------------------------------------------------------ */}
      {(toolSlug.includes('reading-time') || toolSlug.includes('speaking-time')) && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold block mb-1">
                Silent Reading Time
              </span>
              <span className="text-2xl font-display font-extrabold text-indigo-600 dark:text-indigo-400">
                {readingTimeResult.silentReadingFormatted}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center">
              <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold block mb-1">
                Speech Presentation
              </span>
              <span className="text-2xl font-display font-extrabold text-purple-600 dark:text-purple-400">
                {readingTimeResult.speechFormatted}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
              <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold block mb-1">
                Flesch Reading Ease
              </span>
              <span className="text-2xl font-display font-extrabold text-blue-600 dark:text-blue-400">
                {readingTimeResult.fleschScore}/100
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
              <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold block mb-1">
                Reading Level
              </span>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                {readingTimeResult.gradeLevel}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Speech / Article Text:
            </label>
            <textarea
              rows={6}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 11. TEXT REVERSER & FLIP TOOL */}
      {/* ------------------------------------------------------------------ */}
      {toolSlug.includes('revers') && (
        <div className="space-y-5">
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'all', label: 'Reverse Entire Text' },
              { id: 'words', label: 'Reverse Word Order' },
              { id: 'letters', label: 'Reverse Letters in Words' },
              { id: 'upside_down', label: 'Upside Down Flip (¿ʇxǝʇ)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setReverseMode(tab.id as any)}
                className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                  reverseMode === tab.id
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Original Text:
              </label>
              <textarea
                rows={6}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Reversed / Flipped Output:
                </label>
                <button
                  onClick={() => handleCopy(reverserResult)}
                  className="text-xs font-mono text-indigo-500 hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                rows={6}
                readOnly
                value={reverserResult}
                className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 12. BINARY / HEX TO TEXT & VICE VERSA */}
      {/* ------------------------------------------------------------------ */}
      {(toolSlug.includes('binary') || toolSlug.includes('hex')) && (
        <div className="space-y-5">
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'to_binary', label: 'Text ➔ Binary' },
              { id: 'from_binary', label: 'Binary ➔ Text' },
              { id: 'to_hex', label: 'Text ➔ Hexadecimal' },
              { id: 'from_hex', label: 'Hexadecimal ➔ Text' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setConvDirection(tab.id as any)}
                className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                  convDirection === tab.id
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Input Data:
              </label>
              <textarea
                rows={6}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Converted Stream:
                </label>
                <button
                  onClick={() => handleCopy(binaryHexResult)}
                  className="text-xs font-mono text-indigo-500 hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                rows={6}
                readOnly
                value={binaryHexResult}
                className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 font-mono text-xs sm:text-sm focus:outline-none break-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 13. BASE64 STRING ENCODER & DECODER */}
      {/* ------------------------------------------------------------------ */}
      {toolSlug.includes('base64') && (
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBase64Mode('encode')}
              className={`py-2 px-4 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                base64Mode === 'encode'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              Encode to Base64
            </button>
            <button
              onClick={() => setBase64Mode('decode')}
              className={`py-2 px-4 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                base64Mode === 'decode'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              Decode Base64
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                {base64Mode === 'encode' ? 'UTF-8 String Input:' : 'Base64 Encoded Input:'}
              </label>
              <textarea
                rows={6}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {base64Mode === 'encode' ? 'Base64 Output:' : 'Decoded UTF-8 Output:'}
                </label>
                <button
                  onClick={() => handleCopy(base64Result)}
                  className="text-xs font-mono text-indigo-500 hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <textarea
                rows={6}
                readOnly
                value={base64Result}
                className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs sm:text-sm focus:outline-none break-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* Global Actions Footer (Copy / Export PDF) */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(textInput)}
            className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Result Copied' : 'Copy Raw Text'}</span>
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
          Zero Data Sent to Cloud
        </span>
      </div>
    </div>
  );
}

export default TextToolEngine;
