import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, RefreshCw, KeyRound, ShieldCheck, Sliders } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function RandomPasswordGenerator({ tool, onBack }: ToolComponentProps) {
  const [length, setLength] = useState<number>(16);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);
  const [batchCount, setBatchCount] = useState<number>(1);
  const [seed, setSeed] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const passwords = useMemo(() => {
    let charset = '';
    if (includeUpper) charset += excludeAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLower) charset += excludeAmbiguous ? 'abcdefghijkmnopqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += excludeAmbiguous ? '23456789' : '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz0123456789';

    const results: string[] = [];
    const count = Math.max(1, Math.min(20, batchCount));

    for (let b = 0; b < count; b++) {
      const array = new Uint32Array(length);
      window.crypto.getRandomValues(array);
      let pwd = '';
      for (let i = 0; i < length; i++) {
        pwd += charset[array[i] % charset.length];
      }
      results.push(pwd);
    }
    return results;
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols, excludeAmbiguous, batchCount, seed]);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const poolSize = (includeUpper ? 26 : 0) + (includeLower ? 26 : 0) + (includeNumbers ? 10 : 0) + (includeSymbols ? 32 : 0) || 1;
  const entropyBits = Math.round(length * Math.log2(poolSize));

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Random Password Generator - Cryptographically Strong Key Creator
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Generate high-entropy randomized passwords in single or batch mode using browser cryptographic hardware randomness.
        </p>
      </div>

      {/* Primary Generator Display */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-cyan-400" /> Primary Generated Password
          </span>
          <span className="font-mono text-xs text-emerald-400 font-bold">{entropyBits} Bits Entropy</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="flex-1 font-mono text-base sm:text-lg text-white font-bold tracking-wider break-all select-all">
            {passwords[0]}
          </span>
          <button
            type="button"
            onClick={() => handleCopy(passwords[0], 0)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 transition"
            title="Copy password"
          >
            {copiedIndex === 0 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setSeed((s) => s + 1)}
            className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition"
            title="Generate new password"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Length Slider */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs text-slate-300 font-semibold">
            <span>Password Length</span>
            <span className="font-mono text-cyan-400 font-bold">{length} Characters</span>
          </div>
          <input
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-cyan-500"
          />
        </div>

        {/* Character Set Toggles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => setIncludeUpper(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Uppercase (A-Z)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeLower}
              onChange={(e) => setIncludeLower(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Lowercase (a-z)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Numbers (0-9)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Symbols (!@#$)</span>
          </label>
        </div>

        {/* Batch mode and exclude ambiguous */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Exclude Look-alike Characters (l, 1, I, O, 0)</span>
          </label>

          <div className="flex items-center gap-2">
            <span>Quantity:</span>
            {[1, 5, 10].map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => setBatchCount(cnt)}
                className={`px-2.5 py-1 rounded font-mono ${batchCount === cnt ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}`}
              >
                {cnt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Batch List */}
      {passwords.length > 1 && (
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
          <span className="text-xs font-semibold text-slate-300">Batch Passwords Generated ({passwords.length})</span>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {passwords.map((pwd, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
                <span className="text-cyan-300 break-all select-all">{pwd}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(pwd, idx)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
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
            <strong className="text-slate-300">Are these passwords cryptographically unpredictable?</strong>
            <p className="mt-0.5">Yes, passwords are created using `window.crypto.getRandomValues`, avoiding the pseudo-random vulnerabilities of `Math.random`.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">What is the recommended minimum password length for online accounts?</strong>
            <p className="mt-0.5">NIST SP 800-63B standards recommend a minimum length of 16 characters with mixed case and numeric diversity.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Why should look-alike ambiguous characters be avoided?</strong>
            <p className="mt-0.5">Excluding visually identical characters (such as uppercase 'I', lowercase 'l', and number '1') reduces transcription typing errors.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
