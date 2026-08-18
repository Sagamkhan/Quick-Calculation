import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, ShieldCheck, Check, X, Settings2, Lock } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [prefs, setPrefs] = useState({
    essential: true,
    preferences: true,
    advertising: true
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('qc-cookie-consent');
      if (!consent) {
        // Show after 1 second delay
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('qc-cookie-consent', JSON.stringify({ essential: true, preferences: true, advertising: true }));
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('qc-cookie-consent', JSON.stringify({ essential: true, preferences: false, advertising: false }));
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    localStorage.setItem('qc-cookie-consent', JSON.stringify(prefs));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-5 rounded-3xl bg-neutral-900/95 text-white border border-neutral-800 shadow-2xl backdrop-blur-xl space-y-4 font-sans"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Cookie className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm">
                  Cookie & Privacy Preferences
                </h4>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold">GDPR & CCPA Compliant</span>
              </div>
            </div>
            <button
              onClick={handleDecline}
              className="p-1 text-neutral-400 hover:text-white cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!isCustomizing ? (
            <>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Quick Calculator runs calculations 100% locally in your browser. We use standard cookies to remember your theme & favorites, and Google AdSense to serve non-intrusive advertisements that keep our 250+ tools 100% free.
              </p>

              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <button
                  onClick={handleAccept}
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept All</span>
                </button>

                <button
                  onClick={() => setIsCustomizing(true)}
                  className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono text-xs font-semibold transition-all cursor-pointer flex items-center gap-1"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  <span>Customize</span>
                </button>

                <button
                  onClick={handleDecline}
                  className="py-2 px-3 rounded-xl bg-neutral-800/60 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 font-mono text-xs transition-all cursor-pointer"
                >
                  <span>Essential Only</span>
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-3 pt-1">
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      <span>Strictly Necessary</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Core calculation execution & security (Always active)</p>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10">Active</span>
                </div>

                <label className="p-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/50 flex items-center justify-between cursor-pointer">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                      <Settings2 className="w-3 h-3 text-indigo-400" />
                      <span>Preferences & Favorites</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Remembers theme (dark/light) & saved calculations</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.preferences}
                    onChange={(e) => setPrefs({ ...prefs, preferences: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 bg-neutral-900 border-neutral-700"
                  />
                </label>

                <label className="p-2.5 rounded-xl bg-neutral-800/80 border border-neutral-700/50 flex items-center justify-between cursor-pointer">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                      <ShieldCheck className="w-3 h-3 text-amber-400" />
                      <span>Google AdSense Ads</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Relevant ads that support free tool hosting</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefs.advertising}
                    onChange={(e) => setPrefs({ ...prefs, advertising: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 bg-neutral-900 border-neutral-700"
                  />
                </label>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleSaveCustom}
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all cursor-pointer text-center"
                >
                  Save Preferences
                </button>
                <button
                  onClick={() => setIsCustomizing(false)}
                  className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono text-xs transition-all cursor-pointer"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
