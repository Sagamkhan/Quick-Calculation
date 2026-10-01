import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, IndianRupee, FileText, ArrowRight } from 'lucide-react';
import { ToolComponentProps } from './registry';

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const TEENS = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function convertTwoDigits(n: number): string {
  if (n === 0) return '';
  if (n < 10) return ONES[n];
  if (n < 20) return TEENS[n - 10];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return `${TENS[t]} ${ONES[o]}`.trim();
}

function convertThreeDigits(n: number): string {
  const h = Math.floor(n / 100);
  const rem = n % 100;
  let res = '';
  if (h > 0) res += `${ONES[h]} Hundred `;
  if (rem > 0) res += convertTwoDigits(rem);
  return res.trim();
}

function numberToIndianWords(num: number): string {
  if (num === 0) return 'Zero';
  if (num < 0) return `Minus ${numberToIndianWords(Math.abs(num))}`;

  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundredPart = num;

  let words = '';
  if (crore > 0) {
    words += `${numberToIndianWords(crore)} Crore `;
  }
  if (lakh > 0) {
    words += `${convertTwoDigits(lakh)} Lakh `;
  }
  if (thousand > 0) {
    words += `${convertTwoDigits(thousand)} Thousand `;
  }
  if (hundredPart > 0) {
    words += convertThreeDigits(hundredPart);
  }

  return words.trim();
}

// Format comma as 1,23,45,678
function formatIndianCurrencyNumber(num: number): string {
  const parts = num.toString().split('.');
  let lastThree = parts[0].substring(parts[0].length - 3);
  const otherNumbers = parts[0].substring(0, parts[0].length - 3);
  if (otherNumbers !== '') lastThree = ',' + lastThree;
  const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return parts.length > 1 ? `${res}.${parts[1]}` : res;
}

export default function NumberToWordsIndian({ tool, onBack }: ToolComponentProps) {
  const [numInput, setNumInput] = useState<string>('14528350');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const results = useMemo(() => {
    const raw = Number(numInput.trim());
    if (isNaN(raw) || !numInput.trim()) {
      return { isValid: false, words: '', chequeText: '', formattedNum: '' };
    }

    const integerPart = Math.floor(Math.abs(raw));
    const decimalPart = Math.round((Math.abs(raw) - integerPart) * 100);

    const intWords = numberToIndianWords(integerPart);
    const paiseWords = decimalPart > 0 ? `and ${convertTwoDigits(decimalPart)} Paise` : '';

    const words = decimalPart > 0 ? `${intWords} Point ${convertTwoDigits(decimalPart)}` : intWords;
    const chequeText = `Rupees ${intWords} ${paiseWords} Only`.replace(/\s+/g, ' ');
    const formattedNum = formatIndianCurrencyNumber(raw);

    return {
      isValid: true,
      raw,
      words,
      chequeText,
      formattedNum
    };
  }, [numInput]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Number to Words Indian Converter - Lakhs & Crores Cheque Formatter
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Convert numeric amounts into words using the Indian numbering system (Lakhs and Crores) for bank cheques, GST invoices, and legal agreements.
        </p>
      </div>

      {/* Input */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-300">Enter Number / Amount (INR)</span>
            {results.isValid && (
              <span className="font-mono text-cyan-400 font-bold">₹{results.formattedNum}</span>
            )}
          </div>
          <input
            type="number"
            value={numInput}
            onChange={(e) => setNumInput(e.target.value)}
            placeholder="e.g. 500000 or 14528350"
            className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-base text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap gap-2 text-xs pt-1 border-t border-slate-800">
          <span className="text-slate-400 font-semibold self-center">Presets:</span>
          {[100000, 500000, 1000000, 5000000, 10000000, 25000000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setNumInput(String(preset))}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition"
            >
              ₹{formatIndianCurrencyNumber(preset)}
            </button>
          ))}
        </div>
      </div>

      {/* Output Results */}
      {results.isValid && (
        <div className="space-y-4">
          {/* Bank Cheque Format Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Bank Cheque / Demand Draft Format
              </span>
              <button
                type="button"
                onClick={() => handleCopy(results.chequeText, 'cheque')}
                className="text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-1"
              >
                {copiedKey === 'cheque' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'cheque' ? 'Copied' : 'Copy Cheque Text'}
              </button>
            </div>
            <div className="font-mono text-base sm:text-lg font-bold text-white bg-slate-950 p-3 rounded-lg border border-slate-800 tracking-wide">
              {results.chequeText}
            </div>
          </div>

          {/* Standard Words Format Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Indian Lakhs & Crores Words</span>
              <button
                type="button"
                onClick={() => handleCopy(results.words, 'words')}
                className="text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1"
              >
                {copiedKey === 'words' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === 'words' ? 'Copied' : 'Copy Words'}
              </button>
            </div>
            <div className="font-mono text-sm text-cyan-300 bg-slate-950 p-3 rounded-lg border border-slate-800">
              {results.words}
            </div>
          </div>
        </div>
      )}

      {/* 3-Line FAQ */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-cyan-400" /> Frequently Asked Questions
        </h4>
        <div className="space-y-2 text-xs text-slate-400 divide-y divide-slate-800/80">
          <div className="pt-2">
            <strong className="text-slate-300">How does the Indian numbering system place commas?</strong>
            <p className="mt-0.5">The first comma groups the rightmost 3 digits (hundreds), while subsequent commas group digits in pairs of twos (thousands, lakhs, crores).</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">How many lakhs equal one Indian crore?</strong>
            <p className="mt-0.5">One crore is mathematically equivalent to 100 lakhs (1,00,00,000 or ten million in the International system).</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Why must cheque amounts terminate with the word 'Only'?</strong>
            <p className="mt-0.5">Appending 'Only' prevents fraudulent unauthorized alteration by stopping anyone from inserting additional numerical denominations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
