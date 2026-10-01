import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Eye, EyeOff, ShieldCheck, ShieldAlert, KeyRound, RefreshCw, Zap } from 'lucide-react';
import { ToolComponentProps } from './registry';

function generateRandomPassword(length = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  let res = '';
  for (let i = 0; i < length; i++) {
    res += chars[array[i] % chars.length];
  }
  return res;
}

export default function PasswordStrengthMeter({ tool, onBack }: ToolComponentProps) {
  const [password, setPassword] = useState<string>('Tr0ng#P@ssw0rd!2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const analysis = useMemo(() => {
    if (!password) {
      return {
        entropyBits: 0,
        score: 0,
        crackTime: 'Instant',
        checks: {
          hasMinLength: false,
          hasUpper: false,
          hasLower: false,
          hasNumber: false,
          hasSpecial: false,
          isLong: false
        }
      };
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const hasMinLength = password.length >= 8;
    const isLong = password.length >= 14;

    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNumber) poolSize += 10;
    if (hasSpecial) poolSize += 33;
    if (poolSize === 0) poolSize = 1;

    // Shannon Entropy: E = L * log2(R)
    const entropyBits = Math.round(password.length * Math.log2(poolSize));

    // Crack time estimation at 100 billion (10^11) guesses/sec
    const totalCombinations = Math.pow(poolSize, password.length);
    const secondsToCrack = totalCombinations / 1e11;

    let crackTime = 'Instant';
    if (secondsToCrack > 31536000 * 1e9) {
      crackTime = 'Centuries / Billions of Years';
    } else if (secondsToCrack > 31536000 * 1000) {
      crackTime = `${Math.round(secondsToCrack / (31536000 * 1000))} Thousand Years`;
    } else if (secondsToCrack > 31536000) {
      crackTime = `${Math.round(secondsToCrack / 31536000)} Years`;
    } else if (secondsToCrack > 86400 * 30) {
      crackTime = `${Math.round(secondsToCrack / (86400 * 30))} Months`;
    } else if (secondsToCrack > 86400) {
      crackTime = `${Math.round(secondsToCrack / 86400)} Days`;
    } else if (secondsToCrack > 3600) {
      crackTime = `${Math.round(secondsToCrack / 3600)} Hours`;
    } else if (secondsToCrack > 60) {
      crackTime = `${Math.round(secondsToCrack / 60)} Minutes`;
    } else if (secondsToCrack > 1) {
      crackTime = `${Math.round(secondsToCrack)} Seconds`;
    }

    let score = 0;
    if (entropyBits >= 80) score = 4;
    else if (entropyBits >= 60) score = 3;
    else if (entropyBits >= 40) score = 2;
    else if (entropyBits >= 20) score = 1;

    return {
      entropyBits,
      score,
      crackTime,
      checks: {
        hasMinLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial,
        isLong
      }
    };
  }, [password]);

  const strengthLabels = ['Very Weak', 'Weak', 'Fair / Moderate', 'Strong', 'Uncrackable'];
  const strengthColors = ['bg-rose-600', 'bg-rose-500', 'bg-amber-500', 'bg-cyan-500', 'bg-emerald-400'];

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = () => {
    const fresh = generateRandomPassword(16);
    setPassword(fresh);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Password Strength Meter - Shannon Entropy & Brute-Force Crack Time Estimator
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Evaluate password complexity using cryptographic entropy calculation, character diversity analysis, and GPU brute-force recovery models.
        </p>
      </div>

      {/* Main input */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-cyan-400" /> Password Input
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGenerate}
              className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Generate 16-Char Strong
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type password to evaluate strength..."
            className="flex-1 bg-transparent font-mono text-base text-white focus:outline-none placeholder:text-slate-600"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-slate-400 hover:text-white p-1"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="text-cyan-400 hover:text-cyan-300 p-1"
            title="Copy password"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Strength Assessment:</span>
            <span className="font-bold text-white font-mono">{strengthLabels[analysis.score]}</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 h-2">
            {[0, 1, 2, 3].map((step) => (
              <div
                key={step}
                className={`rounded-full transition-all duration-300 ${
                  analysis.score > step ? strengthColors[analysis.score] : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Entropy Bits */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-1">
          <span className="text-xs text-slate-400">Shannon Entropy</span>
          <div className="text-2xl font-bold font-mono text-cyan-400">{analysis.entropyBits} Bits</div>
          <p className="text-[11px] text-slate-500">Standard recommendation: 60+ bits</p>
        </div>

        {/* Crack Time */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-1">
          <span className="text-xs text-slate-400">Brute-Force Crack Time</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 truncate">{analysis.crackTime}</div>
          <p className="text-[11px] text-slate-500">Assuming 100B guesses/sec GPU array</p>
        </div>

        {/* Length */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-1">
          <span className="text-xs text-slate-400">Character Length</span>
          <div className="text-2xl font-bold font-mono text-white">{password.length} Chars</div>
          <p className="text-[11px] text-slate-500">NIST guidelines suggest 12+ chars</p>
        </div>
      </div>

      {/* Check Criteria Grid */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-200">Security Criteria Checklist</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${analysis.checks.hasMinLength ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
            {analysis.checks.hasMinLength ? <Check className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
            <span>At least 8 characters</span>
          </div>

          <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${analysis.checks.isLong ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
            {analysis.checks.isLong ? <Check className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
            <span>14+ chars (High Entropy)</span>
          </div>

          <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${analysis.checks.hasUpper ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
            {analysis.checks.hasUpper ? <Check className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
            <span>Uppercase Letters (A-Z)</span>
          </div>

          <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${analysis.checks.hasLower ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
            {analysis.checks.hasLower ? <Check className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
            <span>Lowercase Letters (a-z)</span>
          </div>

          <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${analysis.checks.hasNumber ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
            {analysis.checks.hasNumber ? <Check className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
            <span>Numbers (0-9)</span>
          </div>

          <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${analysis.checks.hasSpecial ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
            {analysis.checks.hasSpecial ? <Check className="w-4 h-4 text-emerald-400" /> : <div className="w-4 h-4 rounded-full border border-slate-600" />}
            <span>Special Symbols (!@#$)</span>
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
            <strong className="text-slate-300">What does Shannon Entropy measure in password security?</strong>
            <p className="mt-0.5">Shannon entropy measures password unpredictability in binary bits; every added bit doubles the mathematical effort needed to crack the password.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Why is password length more critical than adding odd symbols?</strong>
            <p className="mt-0.5">Exponential growth means adding 3 or 4 extra characters increases combination possibilities far more effectively than substituting '@' for 'a'.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Is it safe to test sensitive passwords on this web page?</strong>
            <p className="mt-0.5">Yes, evaluation occurs exclusively inside your browser memory; zero inputs are sent across any network connection.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
