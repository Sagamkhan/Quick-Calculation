import React, { useState } from "react";
import { Bookmark, Share2, Sparkles, Check, Twitter, Facebook, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

export default function CtaBanner() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [bookmarkSuccess, setBookmarkSuccess] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleBookmark = () => {
    // Notify user to use native keyboard shortcuts since browser APIs don't allow arbitrary bookmark creation anymore
    setBookmarkSuccess(true);
    setTimeout(() => setBookmarkSuccess(false), 4000);
  };

  return (
    <section id="cta" className="relative overflow-hidden py-20 bg-gradient-to-tr from-indigo-600 to-violet-700 text-white">
      {/* Visual background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-black/10 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* soft badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" />
          <span>HELP US GROW THE OPEN WEB</span>
        </div>

        {/* Heading */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4.5xl">
            Bookmark This Hub. Never Overpay Again.
          </h2>
          <p className="font-sans text-sm sm:text-base text-indigo-50 leading-relaxed opacity-90">
            Keep this exhaustive free alternative catalog in your favorites bar. Share it with freelancers, small business owners, startup founders, and creators to help them save thousands in SaaS capital.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          
          {/* Bookmark Trigger */}
          <button
            onClick={handleBookmark}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-sans text-sm font-bold text-indigo-700 shadow-lg hover:bg-indigo-50 transition-all cursor-pointer"
          >
            <Bookmark className="h-4.5 w-4.5 fill-indigo-600 stroke-indigo-600" />
            <span>{bookmarkSuccess ? "Press Ctrl+D or ⌘+D to Save!" : "Bookmark Directory"}</span>
          </button>

          {/* Share Link Trigger */}
          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-800/40 border border-indigo-400/20 px-6 py-3.5 font-sans text-sm font-bold text-white hover:bg-indigo-800/60 transition-all cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="h-4.5 w-4.5 text-indigo-300" />
                <span>Link Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="h-4.5 w-4.5 text-indigo-200" />
                <span>Copy Shareable Link</span>
              </>
            )}
          </button>

          {/* Social Tweet */}
          <a
            href="https://twitter.com/intent/tweet?text=Stop%20paying%20for%20expensive%20SaaS%20subscriptions!%20Check%20out%20this%20directory%20of%20250%2B%20free%20web%20alternatives%20and%20interactive%20calculators%3A"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#1DA1F2] px-6 py-3.5 font-sans text-sm font-bold text-white hover:bg-[#1a94df] transition-all"
          >
            <Twitter className="h-4.5 w-4.5 fill-white" />
            <span>Post on X</span>
          </a>
        </div>

        {/* Short notice */}
        {bookmarkSuccess && (
          <p className="font-sans text-xs text-indigo-100 animate-pulse bg-indigo-800/30 py-2 px-4 rounded-lg inline-block">
            🔔 <strong>Tip:</strong> Press <strong>Ctrl + D</strong> (Windows) or <strong>Command + D</strong> (Mac OS) on your keyboard to instantly add this tool hub to your bookmark folder!
          </p>
        )}

      </div>
    </section>
  );
}
