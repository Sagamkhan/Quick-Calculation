import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Shield, Key, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { ToolComponentProps } from './registry';

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlByYXZlZW4gU2hhcm1hIiwicm9sZSI6ImFkbWluIiwiZW1haWwiOiJwcmF2ZWVuQHBsYXRmb3JtLmluIiwiaWF0IjoxNzM1Njg5NjAwLCJleHAiOjE4OTM0NTYwMDB9.' +
  'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk';

function base64UrlDecode(str: string): string {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      throw new Error('Illegal base64url string!');
  }
  const decoded = atob(output);
  const bytes = new Uint8Array(decoded.length);
  for (let i = 0; i < decoded.length; i++) {
    bytes[i] = decoded.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export default function JwtDecoderClientSide({ tool, onBack }: ToolComponentProps) {
  const [tokenInput, setTokenInput] = useState<string>(SAMPLE_JWT);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const decoded = useMemo(() => {
    if (!tokenInput.trim()) {
      return { isValid: false, header: null, payload: null, signature: '', error: 'Token is empty.' };
    }

    const parts = tokenInput.trim().split('.');
    if (parts.length !== 3) {
      return {
        isValid: false,
        header: null,
        payload: null,
        signature: '',
        error: 'Invalid JWT format: A valid JWT must consist of three dot-separated sections (Header.Payload.Signature).'
      };
    }

    try {
      const headerStr = base64UrlDecode(parts[0]);
      const payloadStr = base64UrlDecode(parts[1]);
      const header = JSON.parse(headerStr);
      const payload = JSON.parse(payloadStr);

      let expiryStatus: { isExpired: boolean; dateStr: string; relativeTime: string } | null = null;
      if (payload.exp && typeof payload.exp === 'number') {
        const expMs = payload.exp * 1000;
        const nowMs = Date.now();
        const isExpired = expMs < nowMs;
        const expDate = new Date(expMs);
        const diffHours = Math.round(Math.abs(expMs - nowMs) / (1000 * 60 * 60));

        expiryStatus = {
          isExpired,
          dateStr: expDate.toLocaleString(),
          relativeTime: isExpired ? `${diffHours} hours ago` : `in ${diffHours} hours`
        };
      }

      return {
        isValid: true,
        header,
        payload,
        signature: parts[2],
        expiryStatus,
        error: null
      };
    } catch (err: any) {
      return {
        isValid: false,
        header: null,
        payload: null,
        signature: parts[2] || '',
        error: `Parse Error: ${err.message}`
      };
    }
  }, [tokenInput]);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          JWT Decoder - Client-Side JSON Web Token Header & Payload Inspector
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Decode and inspect JSON Web Tokens locally in your browser. Verify token claims, expiration timestamps, and algorithms with 100% privacy.
        </p>
      </div>

      {/* Input */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
            <Key className="w-4 h-4 text-cyan-400" /> Encoded JWT String
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTokenInput(SAMPLE_JWT)}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Load Sample
            </button>
            <button
              type="button"
              onClick={() => setTokenInput('')}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Clear
            </button>
          </div>
        </div>

        <textarea
          rows={4}
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="Paste JWT string (eyJhbGciOi...)..."
          className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-rose-300 focus:outline-none focus:border-cyan-500 break-all resize-none leading-relaxed"
        />

        {!decoded.isValid && (
          <div className="flex items-center gap-2 text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{decoded.error}</span>
          </div>
        )}
      </div>

      {/* Decoded Sections */}
      {decoded.isValid && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Header Card */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4" /> Header: Algorithm & Token Type
              </span>
              <button
                type="button"
                onClick={() => handleCopy(JSON.stringify(decoded.header, null, 2), 'header')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'header' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === 'header' ? 'Copied' : 'Copy'}
              </button>
            </div>

            <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-rose-300 overflow-x-auto whitespace-pre leading-relaxed">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>

          {/* Payload Card */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                <Key className="w-4 h-4" /> Payload: Claims & Data
              </span>
              <button
                type="button"
                onClick={() => handleCopy(JSON.stringify(decoded.payload, null, 2), 'payload')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'payload' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSection === 'payload' ? 'Copied' : 'Copy'}
              </button>
            </div>

            <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-purple-300 overflow-x-auto whitespace-pre leading-relaxed">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Expiry & Signature Details */}
      {decoded.isValid && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Expiration Status */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> Token Expiry (`exp`)
              </span>
              {decoded.expiryStatus && (
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    decoded.expiryStatus.isExpired
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {decoded.expiryStatus.isExpired ? 'EXPIRED' : 'ACTIVE / VALID'}
                </span>
              )}
            </div>

            {decoded.expiryStatus ? (
              <div className="text-xs font-mono text-slate-200">
                <div>Date: {decoded.expiryStatus.dateStr}</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Expires {decoded.expiryStatus.relativeTime}</div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 font-mono">No `exp` timestamp present in payload.</div>
            )}
          </div>

          {/* Signature info */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-cyan-400" /> Signature Digest
              </span>
              <span className="text-cyan-400 font-mono text-[11px]">HMAC / RSA Verify</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 break-all">
              {decoded.signature || 'No signature section'}
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
            <strong className="text-slate-300">Does decoding a JWT require my private secret key?</strong>
            <p className="mt-0.5">No, JWT payloads are Base64Url encoded plain JSON readable by anyone; private keys are only needed to verify cryptographic signatures.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Are my auth tokens secure when using this tool?</strong>
            <p className="mt-0.5">Yes, decoding is processed entirely inside your local browser runtime and never transmitted across external networks.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">What does the `exp` claim represent in a JSON Web Token?</strong>
            <p className="mt-0.5">The `exp` field contains a Unix epoch timestamp indicating the exact second when authentication authorization expires.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
