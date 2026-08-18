import React, { useState } from "react";
import { 
  Shield, 
  FileText, 
  Scale, 
  Info, 
  Mail, 
  Check, 
  AlertCircle, 
  ArrowLeft,
  MapPin,
  User,
  Heart,
  Globe,
  Clock
} from "lucide-react";
import Breadcrumbs from "./Breadcrumbs";
import { calculateReadingTime } from "../utils/readingTime";

interface LegalPageProps {
  pageId: "privacy-policy" | "terms-of-service" | "disclaimer" | "about-us" | "contact-us" | "editorial-guidelines";
  onGoHome: () => void;
}

export default function LegalPages({ pageId, onGoHome }: LegalPageProps) {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const ownerName = "Shahroz Khan";
  const ownerEmail = "shahrozaslamk@gmail.com";
  const ownerAddress = "Ward No 17, Kakrala, Budaun 243637, Uttar Pradesh, India";
  const lastUpdated = "July 25, 2026";

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 4000);
  };

  const getPageTitle = () => {
    switch (pageId) {
      case "privacy-policy": return "Privacy Policy";
      case "terms-of-service": return "Terms of Service";
      case "disclaimer": return "Disclaimer";
      case "about-us": return "About Us";
      case "contact-us": return "Contact Us";
      case "editorial-guidelines": return "Editorial Guidelines & E-E-A-T Standards";
    }
  };

  const renderContent = () => {
    switch (pageId) {
      case "privacy-policy":
        return (
          <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-sans leading-relaxed text-sm">
            <div className="flex items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">Privacy Policy</h1>
                  <p className="text-xs text-neutral-400 font-mono">Last Updated: {lastUpdated}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 font-mono text-xs font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-white/10">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>{calculateReadingTime("Welcome to Quick Calculator. Your privacy is of paramount importance to us...").detailedStats}</span>
              </span>
            </div>

            <p>
              Welcome to <strong>Quick Calculator</strong> (accessible at quickcalculator.app). Your privacy is of paramount importance to us. This Privacy Policy outlines the types of personal and non-personal information we collect, how it is used, and the steps we take to safeguard your data.
            </p>

            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white pt-2">1. Client-Side Data Security & Privacy</h3>
            <p>
              At Quick Calculator, all computational utilities, calculators, formatters, and converters run 100% locally in your web browser environment. We do not transmit, record, or store any sensitive inputs you enter (such as loan amounts, salary inputs, medical data, or text streams) on external servers.
            </p>

            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white pt-2">2. Google AdSense, DoubleClick DART Cookies & Advertisers</h3>
            <p>
              We use <strong>Google AdSense</strong> to display non-intrusive, relevant advertisements on our website to keep all 250+ calculators and utilities 100% free for users worldwide. Google, as a third-party vendor, uses cookies to serve ads on our site:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
              <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.</li>
              <li>Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Google Ads Settings</a> or by utilizing our on-site Cookie Consent banner.</li>
              <li>You may also opt out of third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold underline">aboutads.info</a>.</li>
            </ul>

            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white pt-2">3. GDPR (General Data Protection Regulation) Compliance</h3>
            <p>
              For European Economic Area (EEA) residents, Quick Calculator adheres strictly to the GDPR framework. Because our tools execute calculations locally within your web browser runtime, we do not process, store, or sell any personal calculation payloads or user inputs. When accessing our site from the EEA, non-personalized or consent-based advertising is served in accordance with European privacy regulations.
            </p>

            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white pt-2">4. CCPA / CPRA (California Consumer Privacy Act) Disclosures</h3>
            <p>
              Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents have the right to know what personal data is collected and request non-sale of personal data. <strong>Quick Calculator does NOT sell, rent, or trade your personal information or calculation data to third parties.</strong>
            </p>

            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white pt-2">5. Log Files & Performance Analytics</h3>
            <p>
              Like most standard websites, Quick Calculator utilizes standard server access logs and privacy-friendly web analytics to analyze traffic trends, detect malicious traffic, and ensure high platform availability. Log entries contain anonymized IP addresses, browser types, referring pages, and timestamps.
            </p>

            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white pt-2">6. Contact Information & Data Requests</h3>
            <p>
              If you have any questions, concerns, or data rights inquiries regarding this Privacy Policy, please contact site owner <strong>{ownerName}</strong> at <a href={`mailto:${ownerEmail}`} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">{ownerEmail}</a>.
            </p>
          </div>
        );

      case "terms-of-service":
        return (
          <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-sans leading-relaxed text-sm">
            <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <FileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">Terms of Service</h1>
                <p className="text-xs text-neutral-400 font-mono">Last Updated: {lastUpdated}</p>
              </div>
            </div>

            <p>
              By accessing and using <strong>Quick Calculator</strong>, you accept and agree to be bound by the terms and provisions of this agreement.
            </p>

            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white pt-2">1. Permitted Use</h3>
            <p>
              All tools, calculators, software utilities, and articles on Quick Calculator are provided completely free of charge for personal, educational, or professional planning purposes. You may not scrape our directory, re-host our source code without permission, or engage in automated abuse.
            </p>

            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white pt-2">2. Accuracy & Formulas</h3>
            <p>
              While we make every effort to verify mathematical logic, tax regimes, and inflation formulas, Quick Calculator does not guarantee the mathematical infallibility of any output. Users should consult licensed financial advisors, certified tax professionals, or medical experts for critical life decisions.
            </p>

            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white pt-2">3. Owner & Operator</h3>
            <p>
              Quick Calculator is owned and operated by <strong>{ownerName}</strong>, residing at {ownerAddress}.
            </p>
          </div>
        );

      case "disclaimer":
        return (
          <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-sans leading-relaxed text-sm">
            <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <Scale className="h-8 w-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">Disclaimer</h1>
                <p className="text-xs text-neutral-400 font-mono">Last Updated: {lastUpdated}</p>
              </div>
            </div>

            <p>
              The information, computational algorithms, and estimated outputs provided across all 250+ calculators and utilities on <strong>Quick Calculator</strong> are provided solely for general educational, self-help, and illustrative purposes.
            </p>

            <div className="bg-amber-500/10 p-5 rounded-2xl border border-amber-500/20 space-y-2 text-amber-900 dark:text-amber-300">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <span>Critical Legal Safeguard & Policy Notice</span>
              </div>
              <p className="text-xs leading-relaxed font-semibold">
                "The calculators and tools provided on this site are for informational and educational purposes only and do not constitute professional financial, tax, legal, or medical advice."
              </p>
            </div>

            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white pt-2">1. Financial, Investment & Tax Calculations</h3>
            <p>
              Calculators such as SIP, Loan EMI, Compound Interest, Salary Take-Home, Inflation, and Tax estimators rely on mathematical models with user-supplied assumptions. Interest rates, tax brackets, market yields, and loan terms vary by jurisdiction and bank policies. Calculated projections do not represent guaranteed financial returns or official loan commitments. Always consult a Certified Financial Planner (CFP) or Chartered Accountant (CA) before making major financial decisions.
            </p>

            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white pt-2">2. Health, Nutrition & Fitness Utilities</h3>
            <p>
              Calculators estimating Body Mass Index (BMI), Basal Metabolic Rate (BMR), Daily Caloric Requirements, or Body Fat percentages are based on standardized statistical formulas. They do not account for individual medical history, muscle mass density, pregnancy, or metabolic conditions. These tools are not intended to diagnose, treat, or prevent any disease. Always seek the advice of a licensed physician or registered dietitian.
            </p>

            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white pt-2">3. Developer & Cryptographic Utilities</h3>
            <p>
              Utilities providing password generation, hashing (MD5/SHA-256), JSON formatting, and regex testing are provided as-is for development assistance. While all calculations execute entirely within the client's local browser sandbox, users are responsible for implementing secure key management and production authorization standards.
            </p>

            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white pt-2">4. Trademark & Brand Attribution Notice</h3>
            <p>
              All product names, trademarks, and registered trademarks mentioned in our tool descriptions (e.g. Adobe, Google, Canva, ChatGPT, SEMrush, Claude) are property of their respective owners. Their mention does not imply affiliation or endorsement; they are cited solely to describe free web alternatives and productivity workflows.
            </p>
          </div>
        );

      case "about-us":
        return (
          <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-sans leading-relaxed text-sm">
            <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <Info className="h-8 w-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">About Us</h1>
                <p className="text-xs text-neutral-400 font-mono">Mission & Ownership Details</p>
              </div>
            </div>

            <p>
              Welcome to <strong>Quick Calculator</strong>, a high-end, professional free online tools & calculator platform created to empower students, developers, freelancers, and investors worldwide.
            </p>

            {/* Owner Details Profile Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-emerald-900/10 border border-indigo-500/20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-display font-extrabold text-xl flex items-center justify-center shadow-lg">
                  SK
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-neutral-900 dark:text-white">
                    {ownerName}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                    Founder, Developer & Sole Proprietor
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono text-neutral-600 dark:text-neutral-300">
                <div className="p-3 rounded-xl bg-white/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-500" />
                  <span>{ownerEmail}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{ownerAddress}</span>
                </div>
              </div>
            </div>

            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white pt-2">Our Core Mission</h3>
            <p>
              Quick Calculator was built with a clear purpose: eliminating subscription fatigue and providing instant, browser-native tools that execute locally with total privacy. Whether you need an SIP calculator, PDF compressor, JSON validator, or BMI calculator, Quick Calculator delivers accurate results in milliseconds.
            </p>

            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white pt-2">Why Quick Calculator is 100% Free</h3>
            <p>
              We do not require account creation, credit cards, or hidden paywalls. Our operating costs are supported through non-intrusive Google AdSense advertising and voluntary user donations.
            </p>
          </div>
        );

      case "contact-us":
        return (
          <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-sans leading-relaxed text-sm">
            <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <Mail className="h-8 w-8 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">Contact Us</h1>
                <p className="text-xs text-neutral-400 font-mono">Direct Communication & Support</p>
              </div>
            </div>

            <p>
              Have feedback, bug reports, feature requests, or partnership queries? Reach out to site owner <strong>{ownerName}</strong> directly using the form below or via official mail.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-2">
              <div className="md:col-span-7">
                {formSubmitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                      <Check className="h-6 w-6" />
                    </div>
                    <h4 className="font-display font-bold text-emerald-700 dark:text-emerald-400">Message Delivered!</h4>
                    <p className="font-sans text-xs text-neutral-600 dark:text-neutral-300">
                      Thank you for contacting Quick Calculator. Shahroz Khan will review your message and reply within 24-48 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold font-mono text-neutral-500 dark:text-neutral-400 mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full h-10 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3.5 text-xs outline-none focus:border-indigo-600 text-neutral-900 dark:text-white"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold font-mono text-neutral-500 dark:text-neutral-400 mb-1">Your Email</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full h-10 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3.5 text-xs outline-none focus:border-indigo-600 text-neutral-900 dark:text-white"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold font-mono text-neutral-500 dark:text-neutral-400 mb-1">Subject</label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full h-10 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3.5 text-xs outline-none focus:border-indigo-600 text-neutral-900 dark:text-white"
                        placeholder="Feedback / Tool Suggestion"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold font-mono text-neutral-500 dark:text-neutral-400 mb-1">Message</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-3.5 text-xs outline-none focus:border-indigo-600 text-neutral-900 dark:text-white resize-none"
                        placeholder="Write your message here..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold shadow-md transition-all cursor-pointer"
                    >
                      Send Message to Shahroz Khan
                    </button>
                  </form>
                )}
              </div>

              {/* Direct Address & Email Column */}
              <div className="md:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 space-y-3">
                  <h4 className="font-display font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-500" />
                    <span>Owner & Developer</span>
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                    <strong>{ownerName}</strong><br />
                    Founder of Quick Calculator
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 space-y-3">
                  <h4 className="font-display font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-500" />
                    <span>Official Email</span>
                  </h4>
                  <a href={`mailto:${ownerEmail}`} className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline block">
                    {ownerEmail}
                  </a>
                </div>

                <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 space-y-3">
                  <h4 className="font-display font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>Official Address</span>
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-mono">
                    {ownerAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "editorial-guidelines":
        return (
          <div className="space-y-6 text-neutral-700 dark:text-neutral-300 font-sans leading-relaxed text-sm">
            <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <Heart className="h-8 w-8 text-rose-500 shrink-0" />
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">Editorial Guidelines & E-E-A-T Standards</h1>
                <p className="text-xs text-neutral-400 font-mono">Experience, Expertise, Authoritativeness & Trustworthiness</p>
              </div>
            </div>

            <p>
              At <strong>Quick Calculator</strong>, we believe every calculation tool, formula explanation, and FAQ should adhere to rigorous academic, mathematical, and software engineering standards. Our editorial process follows strict Google Search Quality Rater (E-E-A-T) principles.
            </p>

            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white pt-2">1. Formula Verification & Precision</h3>
            <p>
              All mathematical algorithms (including SIP, EMI amortization, Compound Interest, BMI, and Flesch-Kincaid Readability) are benchmarked against official ISO, IEEE, and standard financial banking equations. Every formula undergoes automated continuous integration tests to prevent floating-point rounding errors.
            </p>

            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white pt-2">2. Zero-Plagiarism & Human-Authored Guides</h3>
            <p>
              Each tool is accompanied by an original, human-crafted technical guide outlining exact operational steps, variable breakdowns, real-world case scenarios, and keyword-targeted FAQs. We actively reject low-effort automated content generation in favor of genuine utility.
            </p>

            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white pt-2">3. Independence & Transparent Monetization</h3>
            <p>
              Calculations and tool outputs are strictly objective and mathematically unbiased. Our platform is monetized solely via standardized, non-intrusive Google AdSense display advertisements, ensuring that our operational guidance remains free from undisclosed commercial sponsorship or affiliate manipulation.
            </p>

            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white pt-2">4. Correction & Fact-Checking Process</h3>
            <p>
              We welcome community feedback, tax regime updates, and algorithmic suggestions. If you discover a discrepancy in any formula or explanation, reach out to <strong>{ownerName}</strong> at <a href={`mailto:${ownerEmail}`} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">{ownerEmail}</a> for prompt editorial review and rectification.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 font-sans">
      
      {/* Breadcrumbs */}
      <Breadcrumbs
        currentRoute={{
          path: `/${pageId}`,
          param: getPageTitle()
        }}
        onNavigate={(path) => {
          if (path === '#/' || path === '/') {
            onGoHome();
          }
        }}
      />

      {/* Main Legal Card Container */}
      <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-10 shadow-xl mt-6">
        {renderContent()}
      </div>
    </div>
  );
}
