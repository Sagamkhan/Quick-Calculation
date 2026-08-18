import React, { useState } from "react";
import { Mail, ArrowRight, Check, Sparkles, ShieldCheck, AlertCircle, RefreshCw, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [subscribedEmail, setSubscribedEmail] = useState("");

  const validateEmail = (val: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setStatus("error");
      setErrorMessage("Please enter an email address.");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address (e.g., you@domain.com).");
      return;
    }

    // Block test/spam emails
    if (trimmedEmail.toLowerCase().includes("spam") || trimmedEmail.toLowerCase().includes("test@")) {
      setStatus("error");
      setErrorMessage("This email address looks like spam. Please use a real address.");
      return;
    }

    // Start loading mock simulation
    setStatus("loading");

    setTimeout(() => {
      // Success!
      setStatus("success");
      setSubscribedEmail(trimmedEmail);
      setEmail("");
      
      // Save subscriber status locally
      try {
        localStorage.setItem("newsletter_subscribed", "true");
        localStorage.setItem("newsletter_subscriber_email", trimmedEmail);
      } catch (err) {
        console.error("Failed to write to localStorage:", err);
      }
    }, 1500);
  };

  const handleReset = () => {
    setStatus("idle");
    setEmail("");
  };

  return (
    <section id="newsletter" className="py-16 bg-gray-50 border-t border-b border-gray-100 transition-colors duration-300 dark:bg-gray-900/40 dark:border-gray-800/80">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-200 p-8 sm:p-12 shadow-xl dark:bg-gray-950 dark:border-gray-800">
          
          {/* Subtle graphic background decorations */}
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="text-center max-w-xl mx-auto py-6"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 mb-6 shadow-md shadow-emerald-500/10">
                  <Check className="h-7 w-7 stroke-[2.5]" />
                </div>
                
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <Sparkles className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                    <span>Welcome to the Club!</span>
                  </span>
                  <h3 className="font-display text-2.5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    You're On the Free Alert List!
                  </h3>
                  <p className="font-sans text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    We've registered <strong className="text-gray-900 dark:text-white font-semibold font-mono">{subscribedEmail}</strong>. 
                    You will now receive weekly notifications whenever a newly-released, high-quality, or open-source software alternative gets added to our curation matrix.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-900 flex justify-center">
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 font-sans text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Subscribe another email</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Content Side */}
                <div className="lg:col-span-7 space-y-4 text-left">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
                    <Mail className="h-3.5 w-3.5" />
                    <span>ToolHub Weekly Newsletter</span>
                  </div>
                  <h3 className="font-display text-2.5xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    Get Free SaaS Alerts & Curated Deals
                  </h3>
                  <p className="font-sans text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Subscription fatigue is real. Every Thursday, we dispatch a bite-sized briefing spotlighting 3 recently discovered premium software alternatives, code repositories, or self-hosted projects that save builders over ₹1,00,000 annually.
                  </p>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span>Zero Spam, Unsubscribe in 1-Click</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span>12,400+ Subscribers</span>
                    </div>
                  </div>
                </div>

                {/* Form Side */}
                <div className="lg:col-span-5 w-full">
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                      <input
                        type="email"
                        disabled={status === "loading"}
                        placeholder="Enter your email address..."
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (status === "error") setStatus("idle");
                        }}
                        className={`h-13 w-full rounded-2xl border bg-gray-50/50 pl-11 pr-4 font-sans text-sm outline-none transition-all dark:bg-gray-900/40 ${
                          status === "error"
                            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-red-900 dark:text-red-200"
                            : "border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-800 dark:text-gray-200 dark:focus:border-indigo-400"
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full h-13 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-sm font-bold shadow-md shadow-indigo-600/10 hover:shadow-lg transition-all disabled:opacity-85 cursor-pointer"
                    >
                      {status === "loading" ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin text-white" />
                          <span>Securing subscriber slot...</span>
                        </>
                      ) : (
                        <>
                          <span>Subscribe for Updates</span>
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Error Notification Banner */}
                  <AnimatePresence>
                    {status === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="mt-3 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200/50 p-3 text-red-800 dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400"
                      >
                        <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-500 mt-0.5" />
                        <p className="font-sans text-xs font-semibold leading-relaxed">
                          {errorMessage}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-3 text-center lg:text-left leading-relaxed">
                    By subscribing, you agree to our privacy policy and to receive weekly digests. We never share your data.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
