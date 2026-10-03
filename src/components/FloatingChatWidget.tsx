import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, HelpCircle, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

interface FloatingChatWidgetProps {
  onSelectCategory?: (catId: string) => void;
  onSearchQuery?: (q: string) => void;
}

export default function FloatingChatWidget({ onSelectCategory, onSearchQuery }: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: '👋 Hi! Welcome to Quick Calculator. Looking for a financial calculator, text tool, image converter, or developer utility?',
      time: 'Just now'
    }
  ]);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const quickPrompts = [
    { label: 'SIP Calculator', query: 'SIP step up calculator' },
    { label: 'JPG to WebP', query: 'JPG to WebP' },
    { label: 'Home Loan EMI', query: 'Home Loan EMI' },
    { label: 'OBS Bitrate', query: 'OBS Studio Recorder' },
    { label: 'Word Counter', query: 'Word and character counter' }
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user' as const, text, time };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMsg('');

    // Generate instant client-side assistant reply
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = "Here's what I found for you! Click any suggested tool to jump straight to the live engine.";
      if (lower.includes('sip') || lower.includes('invest') || lower.includes('compound')) {
        reply = "Our Step-Up SIP Calculator & Compound Interest Chart provide instant inflation-adjusted projections and annual growth schedules!";
      } else if (lower.includes('loan') || lower.includes('emi') || lower.includes('interest')) {
        reply = "Try the Home Loan EMI & Prepayment Calculator to see how extra monthly payments can save you lakhs in interest.";
      } else if (lower.includes('obs') || lower.includes('bitrate') || lower.includes('record')) {
        reply = "The OBS Studio Bitrate & File Size Calculator helps you optimize 720p, 1080p, 1440p, and 4K recording bandwidth.";
      } else if (lower.includes('webp') || lower.includes('image') || lower.includes('jpg')) {
        reply = "The JPG/PNG to WebP Converter runs 100% locally in your browser with real-time compression preview and zero server latency.";
      } else if (lower.includes('word') || lower.includes('character') || lower.includes('count')) {
        reply = "The Real-Time Word & Character Counter calculates words, chars, reading time, and readability grade with every keystroke.";
      } else {
        reply = `You can search for "${text}" directly in the top search bar or browse all 250+ calculators across 8 core categories!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 400);
  };

  return (
    <>
      {/* Floating Trigger Button: Positioned bottom-6 right-6 with mobile mb-20 to avoid bottom navigation bar */}
      <div className="fixed bottom-6 right-6 z-50 mb-20 md:mb-0">
        <motion.button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative h-14 w-14 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center cursor-pointer border border-white/20 focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
          aria-label={isOpen ? 'Close Quick Help' : 'Open Quick Help & Feedback'}
          title="Quick Help & Feedback Assistant"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400"></span>
              </span>
            </>
          )}
        </motion.button>
      </div>

      {/* Floating Assistant Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 mb-20 md:mb-0 w-[calc(100vw-32px)] sm:w-96 max-w-sm rounded-3xl bg-slate-900/95 dark:bg-[#121824]/95 border border-slate-700/80 dark:border-white/10 shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden text-slate-100 font-sans"
            style={{ maxHeight: 'min(580px, 80vh)' }}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm leading-tight">Quick Help & Navigator</h3>
                  <span className="text-[11px] font-mono text-cyan-200">100% Client-Side Privacy</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="p-3 bg-slate-950/60 border-b border-slate-800 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-1.5 min-w-max">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mr-1">Suggested:</span>
                {quickPrompts.map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => {
                      if (onSearchQuery) onSearchQuery(q.query);
                      handleSend(`Show me the ${q.label}`);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800/80 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-300 border border-slate-700 transition-all cursor-pointer whitespace-nowrap"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Body */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3 max-h-72 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                        : 'bg-slate-800/90 text-slate-200 rounded-bl-none border border-slate-700/60 shadow-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 mt-0.5 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder="Ask about any tool or calculation..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-sans"
                style={{ fontSize: '16px' }}
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!inputMsg.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all cursor-pointer flex items-center justify-center shrink-0 min-h-[44px] min-w-[44px]"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
