import React, { useState } from "react";
import { Sun, Moon, Search, Layers, Menu, X, Globe, Landmark } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import VoiceInputButton from "./VoiceInputButton";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  openWpPortal: () => void;
}

export default function Header({
  darkMode,
  setDarkMode,
  searchQuery,
  setSearchQuery,
  openWpPortal
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#/" },
    { name: "Finance", href: "#/category/finance" },
    { name: "Business", href: "#/category/business" },
    { name: "Health", href: "#/category/health" },
    { name: "SEO Tools", href: "#/tools/xml-sitemap-generator" },
    { name: "About", href: "#/about-us" }
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#/")) {
      // It's a router hash link, allow default router behavior
      setMobileMenuOpen(false);
      return;
    }
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-gray-800/80 dark:bg-gray-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <a href="#/" className="flex items-center gap-2.5 cursor-pointer">
          <div className="flex h-10 w-10 items-center justify-between rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-700 p-2 text-white shadow-md shadow-indigo-600/20">
            <Landmark className="h-full w-full" />
          </div>
          <span className="font-display text-xl font-black tracking-tight text-gray-900 dark:text-white">
            QUICK<span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">CALCULATOR</span>
          </span>
          <span className="hidden rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 sm:inline-block">
            100% FREE
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="font-sans text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Header Search bar */}
          <div className="relative hidden sm:flex items-center max-w-[200px] lg:max-w-[240px]">
            <Search className="absolute left-3 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search 250+ tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-8 font-sans text-xs outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-200 dark:focus:border-indigo-400 dark:focus:bg-gray-950"
            />
            <div className="absolute right-1">
              <VoiceInputButton
                onTranscript={(text) => setSearchQuery(text)}
                size="sm"
                title="Voice Search"
              />
            </div>
          </div>

          {/* WordPress Creator Portal Trigger */}
          <button
            onClick={openWpPortal}
            className="hidden lg:flex items-center gap-1.5 rounded-lg border border-indigo-500/20 bg-indigo-50 px-3 py-1.5 font-sans text-xs font-semibold text-indigo-600 shadow-sm transition-all hover:bg-indigo-600 hover:text-white dark:border-indigo-500/10 dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white"
          >
            <Globe className="h-3.5 w-3.5" />
            WordPress Export
          </button>

          {/* Native Dark Mode Toggle switch */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white md:hidden"
            aria-label="Open Mobile Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950 md:hidden"
          >
            <div className="space-y-1.5 px-4 pt-3 pb-5">
              {/* Mobile Search input */}
              <div className="relative mb-3.5 w-full flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search 250+ tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-10 font-sans text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                />
                <div className="absolute right-2">
                  <VoiceInputButton
                    onTranscript={(text) => setSearchQuery(text)}
                    size="sm"
                    title="Voice Search"
                  />
                </div>
              </div>

              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className="block rounded-lg px-3 py-2.5 font-sans text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-indigo-400"
                >
                  {link.name}
                </a>
              ))}

              <div className="border-t border-gray-100 pt-3 dark:border-gray-800 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openWpPortal();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-sans text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700"
                >
                  <Globe className="h-4 w-4" />
                  WordPress Creator Portal
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
