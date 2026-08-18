import React from "react";
import { ArrowRight, CheckCircle2, ShieldAlert, Sparkles, TrendingUp, Zap, PiggyBank, Landmark } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  onScrollToHub: () => void;
  onScrollToCalc: () => void;
  favorites?: any[];
  onToggleFavorite?: (item: any) => void;
}

export default function Hero({ onScrollToHub, onScrollToCalc, favorites, onToggleFavorite }: HeroProps) {
  const valueProps = [
    "Replaced 250+ premium SaaS tools with open-source and free alternatives.",
    "Save over ₹3,00,000+ every single year on subscriptions.",
    "100% tested, malware-free, and enterprise-ready resources.",
    "No email gates, paywalls, or hidden trial expiration periods."
  ];

  return (
    <section id="hero" className="relative overflow-hidden bg-white py-16 transition-colors duration-300 dark:bg-gray-950 sm:py-24">
      {/* Dynamic Grid Background Accent */}
      <div className="absolute inset-0 bg-grid-pattern dark:bg-grid-pattern-dark opacity-100 pointer-events-none" />
      
      {/* Light Blur Aura */}
      <div className="absolute top-1/4 -right-1/4 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none dark:bg-indigo-500/5 sm:h-[500px] sm:w-[500px]" />
      <div className="absolute bottom-1/4 -left-1/4 h-[300px] w-[300px] rounded-full bg-violet-500/10 blur-[100px] pointer-events-none dark:bg-violet-500/5 sm:h-[500px] sm:w-[500px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Value Proposition & Copy */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Soft Accent Pill */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              <span>THE ULTIMATE SAAS COST-CUTTING PORTAL</span>
            </motion.div>

            {/* High-Converting Headline */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl"
              >
                Stop Paying For{" "}
                <span className="relative inline-block text-indigo-600 dark:text-indigo-400">
                  These Tools
                  <svg className="absolute -bottom-2 left-0 h-2.5 w-full text-indigo-500/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-sans text-lg text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed"
              >
                Supercharge your workflow without subscription fatigue. Discover elite, 100% free web apps, open-source softwares, and professional utilities mapped directly to expensive corporate platforms.
              </motion.p>
            </div>

            {/* Bullet Points */}
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-3.5"
            >
              {valueProps.map((prop, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-indigo-500 dark:text-indigo-400" />
                  <span className="font-sans text-sm font-medium text-gray-700 dark:text-gray-300">
                    {prop}
                  </span>
                </li>
              ))}
            </motion.ul>

            {/* CTA Actions Group */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <button
                onClick={onScrollToHub}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 font-sans text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:shadow-indigo-500/30 dark:shadow-indigo-950/25"
              >
                <span>Browse 250+ Free Tools</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onScrollToCalc}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-sans text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <PiggyBank className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                <span>Calculate Your Savings</span>
              </button>
            </motion.div>

            {/* My Favorites Section */}
            {favorites && favorites.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="space-y-3 pt-6 border-t border-gray-150 dark:border-gray-800"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4 text-amber-500 animate-pulse"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>My Bookmarked Favorites ({favorites.length})</span>
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {favorites.map((item) => (
                    <div
                      key={item.id}
                      className="group/item flex items-center justify-between p-2.5 rounded-xl border border-gray-150 bg-gray-50/50 hover:bg-white hover:border-indigo-200 transition-all dark:border-gray-800 dark:bg-gray-900/40 dark:hover:bg-gray-900"
                    >
                      <a
                        href={item.url}
                        className="flex-1 flex items-center gap-2.5 overflow-hidden"
                      >
                        <span className="text-base shrink-0">{item.emoji}</span>
                        <div className="min-w-0">
                          <p className="font-display text-xs font-bold text-gray-900 dark:text-white truncate">
                            {item.name}
                          </p>
                          <p className="font-sans text-[10px] text-gray-400 truncate">
                            {item.type}
                          </p>
                        </div>
                      </a>
                      {onToggleFavorite && (
                        <button
                          onClick={() => onToggleFavorite(item)}
                          className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer"
                          title="Remove from favorites"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-3.5 w-3.5"
                          >
                            <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Interactive Savings Card */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xl shadow-gray-100 transition-colors dark:border-gray-800/80 dark:bg-gray-900 dark:shadow-none"
            >
              {/* Header inside Card */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-400">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <h3 className="font-display text-sm font-bold text-gray-900 dark:text-white">
                    Typical Savings Preview
                  </h3>
                </div>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  ANNUAL BASIS
                </span>
              </div>

              {/* Card visual elements (comparison stack) */}
              <div className="my-5 space-y-3">
                {/* Row 1: Premium Adobe vs Free Alternative */}
                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3 transition-all dark:bg-gray-950">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🎨</span>
                    <div>
                      <p className="font-sans text-xs font-semibold text-gray-400">Adobe Creative Cloud</p>
                      <p className="font-display text-sm font-bold text-gray-700 dark:text-gray-300">Photopea / Inkscape</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-[10px] line-through text-red-400">₹5,000/mo</p>
                    <p className="font-sans text-xs font-bold text-emerald-500 dark:text-emerald-400">SAVE 100%</p>
                  </div>
                </div>

                {/* Row 2: Premium Marketing vs Free Alternative */}
                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3 transition-all dark:bg-gray-950">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📈</span>
                    <div>
                      <p className="font-sans text-xs font-semibold text-gray-400">SEMrush / Ahrefs Premium</p>
                      <p className="font-display text-sm font-bold text-gray-700 dark:text-gray-300">Google Search Console + Ahrefs Free</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-[10px] line-through text-red-400">₹11,000/mo</p>
                    <p className="font-sans text-xs font-bold text-emerald-500 dark:text-emerald-400">SAVE 100%</p>
                  </div>
                </div>

                {/* Row 3: ChatGPT Plus vs Gemini Free */}
                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3 transition-all dark:bg-gray-950">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🤖</span>
                    <div>
                      <p className="font-sans text-xs font-semibold text-gray-400">AI Plus Subscription</p>
                      <p className="font-display text-sm font-bold text-gray-700 dark:text-gray-300">Claude Free / Gemini Free</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-[10px] line-through text-red-400">₹1,700/mo</p>
                    <p className="font-sans text-xs font-bold text-emerald-500 dark:text-emerald-400">SAVE 100%</p>
                  </div>
                </div>
              </div>

              {/* Total calculated savings visual pill */}
              <div className="rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 p-4 border border-indigo-500/20 text-center">
                <span className="font-sans text-xs font-medium text-gray-500 dark:text-gray-400">
                  Total Monthly Cost Replaced
                </span>
                <p className="font-display text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 my-0.5">
                  ₹17,700 <span className="text-sm font-semibold text-gray-400">/ mo</span>
                </p>
                <div className="mt-1.5 flex items-center justify-center gap-1.5 font-sans text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <Zap className="h-3.5 w-3.5 fill-emerald-500" />
                  <span>Annual Savings: ₹2,12,400</span>
                </div>
              </div>

              {/* Link to detailed calculator */}
              <button
                onClick={onScrollToCalc}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-sans text-xs font-bold text-white transition-all hover:bg-indigo-700 dark:bg-indigo-900 dark:hover:bg-indigo-800"
              >
                <span>Customize With Your Subscriptions</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
