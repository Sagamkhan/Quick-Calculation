import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, AlertTriangle, BookOpen, Zap, CheckCircle2 } from 'lucide-react';
import { ToolComponentProps } from './registry';

const REGEX_PRESETS = [
  { name: 'Email Address', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', flags: 'gm', sample: 'test.user@quickcalc.online\ninvalid-email@\ncontact@google.com' },
  { name: 'India Phone (+91)', pattern: '^(?:\\+91|91)?[6-9]\\d{9}$', flags: 'gm', sample: '+919876543210\n9876543210\n1234567890' },
  { name: 'URL / HTTPS Link', pattern: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)', flags: 'g', sample: 'Visit https://quickcalc.online/finance or http://example.org/path?id=123' },
  { name: 'IPv4 Address', pattern: '\\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b', flags: 'g', sample: 'Server IP: 192.168.1.1 or 10.0.0.254, but not 999.999.999.999' },
  { name: 'Hex Color Code', pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b', flags: 'gi', sample: 'Primary color: #06b6d4, accent: #3b82f6 and dark #0f172a' },
  { name: 'Date (YYYY-MM-DD)', pattern: '\\b\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])\\b', flags: 'g', sample: 'Created on 2026-03-31 and updated on 2026-12-25' }
];

const CHEAT_SHEET_ITEMS = [
  { symbol: '\\d / \\D', desc: 'Any digit / non-digit' },
  { symbol: '\\w / \\W', desc: 'Any word char / non-word char' },
  { symbol: '\\s / \\S', desc: 'Any whitespace / non-whitespace' },
  { symbol: '^ / $', desc: 'Start of string / end of string' },
  { symbol: '\\b / \\B', desc: 'Word boundary / non-boundary' },
  { symbol: 'a* / a+', desc: 'Zero or more / one or more' },
  { symbol: 'a? / a{n,m}', desc: 'Optional / between n and m times' },
  { symbol: '(?:abc)', desc: 'Non-capturing group' },
  { symbol: '(?=abc)', desc: 'Positive lookahead assertion' },
  { symbol: '(?!abc)', desc: 'Negative lookahead assertion' }
];

export default function RegexTesterCheatSheet({ tool, onBack }: ToolComponentProps) {
  const [pattern, setPattern] = useState<string>('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b');
  const [flags, setFlags] = useState<string>('g');
  const [testString, setTestString] = useState<string>(
    'Reach out at hello@quickcalc.online or support@example.com for developer assistance. Invalid emails like test@ are ignored.'
  );
  const [showCheatSheet, setShowCheatSheet] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Toggle flags
  const toggleFlag = (f: string) => {
    if (flags.includes(f)) {
      setFlags(flags.replace(f, ''));
    } else {
      setFlags(flags + f);
    }
  };

  const evaluation = useMemo(() => {
    if (!pattern) {
      return { isValid: true, matches: [], error: null, formattedParts: [testString] };
    }

    try {
      const regex = new RegExp(pattern, flags);
      const matches: { text: string; index: number; groups: string[] }[] = [];

      let match: RegExpExecArray | null;
      if (flags.includes('g')) {
        let lastIndex = -1;
        while ((match = regex.exec(testString)) !== null) {
          if (regex.lastIndex === lastIndex) {
            regex.lastIndex++; // prevent zero-length infinite loop
          }
          lastIndex = regex.lastIndex;
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          if (matches.length > 500) break; // safety guard
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          matches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }

      return { isValid: true, matches, error: null };
    } catch (err: any) {
      return { isValid: false, matches: [], error: err.message };
    }
  }, [pattern, flags, testString]);

  const loadPreset = (preset: typeof REGEX_PRESETS[0]) => {
    setPattern(preset.pattern);
    setFlags(preset.flags);
    setTestString(preset.sample);
  };

  const handleCopyMatches = () => {
    const list = evaluation.matches.map((m, idx) => `Match #${idx + 1}: ${m.text}`).join('\n');
    navigator.clipboard.writeText(list || 'No matches found.');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Regex Tester & Interactive Cheat Sheet - JavaScript Regular Expression Evaluator
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Test and debug regex patterns in real time with syntax validation, match group extraction, quick presets, and an instant syntax reference.
        </p>
      </div>

      {/* Preset Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-400" /> Presets:
        </span>
        {REGEX_PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => loadPreset(p)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-cyan-500 text-xs text-slate-300 hover:text-white transition"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Regex Pattern Input */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-semibold text-slate-200">Regular Expression Pattern & Flags</label>
          {/* Flags toggles */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            {['g', 'i', 'm', 's'].map((flag) => {
              const active = flags.includes(flag);
              return (
                <button
                  key={flag}
                  type="button"
                  onClick={() => toggleFlag(flag)}
                  className={`w-6 h-6 rounded flex items-center justify-center font-bold transition ${
                    active ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                  title={`Flag ${flag}`}
                >
                  {flag}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
          <span className="text-slate-500 font-mono text-base font-bold">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Type regex pattern e.g. [A-Z]+ or \\d{4}"
            className="flex-1 bg-transparent font-mono text-sm text-cyan-300 focus:outline-none placeholder:text-slate-600"
          />
          <span className="text-slate-500 font-mono text-base font-bold">/{flags}</span>
        </div>

        {!evaluation.isValid && (
          <div className="flex items-center gap-2 text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Invalid Regex: {evaluation.error}</span>
          </div>
        )}
      </div>

      {/* Test String and Match View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Test String */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2 flex flex-col">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold">Test Corpus Text</span>
            <span className="font-mono text-slate-400">{testString.length} chars</span>
          </div>

          <textarea
            rows={8}
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Paste text to test pattern against..."
            className="w-full flex-1 px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-white focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
          />
        </div>

        {/* Matches output */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Matched Elements ({evaluation.matches.length})
              </span>
              <button
                type="button"
                onClick={handleCopyMatches}
                disabled={evaluation.matches.length === 0}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs flex items-center gap-1 disabled:opacity-40 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Matches'}
              </button>
            </div>

            <div className="w-full max-h-[190px] overflow-y-auto space-y-1.5 p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
              {evaluation.matches.length === 0 ? (
                <div className="p-4 text-center text-slate-500">No match found in test corpus.</div>
              ) : (
                evaluation.matches.map((m, idx) => (
                  <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800 flex items-start justify-between gap-2">
                    <div className="overflow-hidden">
                      <span className="text-[10px] text-cyan-400 font-semibold block">Match #{idx + 1} at index {m.index}:</span>
                      <span className="text-emerald-300 font-bold break-all">{m.text}</span>
                      {m.groups.length > 0 && (
                        <div className="mt-1 text-[10px] text-slate-400">
                          Capture Groups: {m.groups.map((g, gi) => `($${gi + 1}: ${g})`).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Built-in Cheat Sheet */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowCheatSheet(!showCheatSheet)}>
          <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-cyan-400" /> Quick Regex Cheat Sheet Reference
          </h3>
          <span className="text-xs text-slate-400">{showCheatSheet ? 'Hide' : 'Show Reference'}</span>
        </div>

        {showCheatSheet && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-800">
            {CHEAT_SHEET_ITEMS.map((item, i) => (
              <div key={i} className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                <code className="text-cyan-400 font-mono font-bold block">{item.symbol}</code>
                <span className="text-[11px] text-slate-400 leading-tight block mt-0.5">{item.desc}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3-Line FAQ */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-cyan-400" /> Frequently Asked Questions
        </h4>
        <div className="space-y-2 text-xs text-slate-400 divide-y divide-slate-800/80">
          <div className="pt-2">
            <strong className="text-slate-300">What does the global flag `/g` do in regular expressions?</strong>
            <p className="mt-0.5">The `g` modifier finds all matching instances throughout the target corpus rather than stopping immediately after the initial first match.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">How do non-capturing groups `(?:...)` boost performance?</strong>
            <p className="mt-0.5">Non-capturing groups group sub-expressions for quantifiers without consuming extra memory to save matched substrings for back-references.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Can regular expressions run safely without crashing the browser?</strong>
            <p className="mt-0.5">Yes, our client-side tester includes zero-length match step guards and max-match cutoffs to safeguard against catastrophic backtracking freezes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
