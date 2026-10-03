import React from 'react';
import {
  Calculator,
  ArrowUp,
  BookOpen,
  Code2,
  WifiOff,
  FileCode2,
  Shield,
  FileText,
  Mail,
  User,
  Heart,
  TrendingUp
} from 'lucide-react';

interface FooterProps {
  onSelectCategory: (id: string | null) => void;
  onNavigatePage?: (pageId: string) => void;
  onSearchQuery?: (query: string) => void;
}

export default function Footer({ onSelectCategory, onNavigatePage, onSearchQuery }: FooterProps) {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLinkClick = (pageId: string) => {
    if (onNavigatePage) onNavigatePage(pageId);
    scrollToTop();
  };

  const handleCategoryClick = (catId: string) => {
    onSelectCategory(catId);
    if (onNavigatePage) onNavigatePage('home');
    scrollToTop();
  };

  return (
    <footer className="w-full bg-slate-950 text-slate-300 border-t border-slate-800/80 font-sans relative overflow-hidden select-none">
      {/* Ambient background soft glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[180px] bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 xl:px-10 py-16 relative z-10 space-y-12">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          
          {/* Column 1: Brand & Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/10 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="font-display font-black text-xl text-white tracking-tight">
                  Quick <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">Calculator</span>
                </span>
                <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest -mt-0.5">
                  Platform by Shahroz Khan
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Ultra-fast, browser-native calculation engines, financial matrix modeling, developer converters, and AI utility assistants with zero server lag.
            </p>

            {/* Operational Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-medium text-slate-300">
                250+ Tools Operational · 100% Client-Side
              </span>
            </div>

            {/* Owner contact tag */}
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 font-mono">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Dev: Shahroz Khan</span>
              <span>·</span>
              <a
                href="mailto:shahrozaslamk@gmail.com"
                className="hover:text-cyan-300 transition-colors"
              >
                shahrozaslamk@gmail.com
              </a>
            </div>
          </div>

          {/* Column 2: Top Categories */}
          <div className="space-y-3">
            <h4 className="font-mono font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Top Categories</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => handleCategoryClick('financial-calculators')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-cyan-400 transition-colors" />
                  <span>Financial Engines</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('text-analysis')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-cyan-400 transition-colors" />
                  <span>Writing & Text Analysis</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('developer-tools')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-cyan-400 transition-colors" />
                  <span>Developer Tools & Formatters</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('seo-tools')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-cyan-400 transition-colors" />
                  <span>SEO Utilities & Meta</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('unit-converters')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-cyan-400 transition-colors" />
                  <span>Universal Unit Converters</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('health-fitness')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-cyan-400 transition-colors" />
                  <span>Health & Fitness Calculators</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources & Guides */}
          <div className="space-y-3">
            <h4 className="font-mono font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Resources & Guides</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => handleLinkClick('blog')}
                  className="hover:text-indigo-300 transition-colors cursor-pointer text-left flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-indigo-400 transition-colors" />
                  <span className="font-medium text-slate-200">Blog & Insights</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('editorial-guidelines')}
                  className="hover:text-indigo-300 transition-colors cursor-pointer text-left flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-indigo-400 transition-colors" />
                  <span>API Documentation</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('about-us')}
                  className="hover:text-indigo-300 transition-colors cursor-pointer text-left flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-indigo-400 transition-colors" />
                  <span>Offline Mode Guide</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('sitemap')}
                  className="hover:text-indigo-300 transition-colors cursor-pointer text-left flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-indigo-400 transition-colors" />
                  <span>Dynamic XML Sitemap</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('donate')}
                  className="hover:text-rose-400 text-rose-300 transition-colors cursor-pointer text-left flex items-center gap-2 group font-semibold"
                >
                  <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                  <span>Support / Donate</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Trust */}
          <div className="space-y-3">
            <h4 className="font-mono font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Legal & Trust</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => handleLinkClick('privacy-policy')}
                  className="hover:text-purple-300 transition-colors cursor-pointer text-left flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-purple-400 transition-colors" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('terms-of-service')}
                  className="hover:text-purple-300 transition-colors cursor-pointer text-left flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-purple-400 transition-colors" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('disclaimer')}
                  className="hover:text-purple-300 transition-colors cursor-pointer text-left flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-purple-400 transition-colors" />
                  <span>Disclaimer & Calculations</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('contact-us')}
                  className="hover:text-purple-300 transition-colors cursor-pointer text-left flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-purple-400 transition-colors" />
                  <span>Contact Us</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('about-us')}
                  className="hover:text-purple-300 transition-colors cursor-pointer text-left flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-slate-700 group-hover:bg-purple-400 transition-colors" />
                  <span>About Us & Mission</span>
                </button>
              </li>
            </ul>
          </div>

        </div>



        {/* Bottom Bar with Copyright and Back to Top */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="text-center sm:text-left">
            © 2026 <strong className="text-slate-200">Quick Calculator</strong>. Built with precision by <strong className="text-slate-200">Shahroz Khan</strong>. All rights reserved.
          </div>

          <button
            onClick={scrollToTop}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-2 group shadow-sm"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
