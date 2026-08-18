import React from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSpeechToText } from '../hooks/useSpeechToText';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  placeholderHint?: string;
  title?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  className = '',
  size = 'md',
  title = 'Voice search / Dictate input'
}) => {
  const { isListening, isSupported, error, toggleListening } = useSpeechToText({
    onResult: (text) => {
      if (text) {
        onTranscript(text);
      }
    }
  });

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-2.5 text-base'
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }[size];

  return (
    <div className="relative inline-flex items-center group">
      <button
        type="button"
        onClick={toggleListening}
        title={isSupported ? title : 'Voice input not supported in this browser'}
        className={`relative flex items-center justify-center rounded-xl transition-all cursor-pointer outline-none ${
          isListening
            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 ring-2 ring-rose-400/50 animate-pulse'
            : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400'
        } ${sizeClasses} ${className}`}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      >
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="listening"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-1"
            >
              <Volume2 className={`${iconSizes} animate-bounce`} />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {isSupported ? (
                <Mic className={iconSizes} />
              ) : (
                <MicOff className={`${iconSizes} opacity-40`} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Floating Status Badge / Tooltip while listening */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-mono font-semibold whitespace-nowrap shadow-xl z-50 flex items-center gap-2 border border-slate-700"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>Listening... Speak now</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Popup */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-[11px] font-sans font-medium whitespace-nowrap shadow-xl z-50"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceInputButton;
