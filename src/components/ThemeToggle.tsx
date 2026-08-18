import React, { useState } from "react";
import { Sun, Moon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ThemeToggleProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function ThemeToggle({ darkMode, setDarkMode }: ThemeToggleProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans pointer-events-none">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="pointer-events-auto flex items-center gap-2"
        >
          {/* Tooltip */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-900/95 dark:bg-white text-gray-100 dark:text-gray-950 text-[11px] font-black uppercase tracking-wider shadow-lg border border-gray-800 dark:border-gray-200 backdrop-blur-sm"
            >
              <Sparkles className="h-3 w-3 text-amber-400 dark:text-indigo-600 animate-pulse" />
              <span>Switch to {darkMode ? "Light Mode" : "Dark Mode"}</span>
            </motion.div>
          )}

          {/* Floating Action Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="h-12 w-12 rounded-full flex items-center justify-center bg-gray-950 dark:bg-white text-gray-100 dark:text-gray-950 shadow-2xl border border-gray-800 dark:border-gray-200 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
            aria-label="Toggle Global Theme"
            id="floating-theme-toggle"
          >
            <motion.div
              key={darkMode ? "dark" : "light"}
              initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {darkMode ? (
                <Sun className="h-5.5 w-5.5 text-amber-400" />
              ) : (
                <Moon className="h-5.5 w-5.5 text-indigo-600" />
              )}
            </motion.div>
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
