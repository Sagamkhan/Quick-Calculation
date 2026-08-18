import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Copy, 
  Check, 
  QrCode, 
  ShieldCheck, 
  ExternalLink,
  CreditCard,
  Mail,
  MapPin,
  User,
  Phone,
  IndianRupee,
  CheckCircle2,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface DonationSectionProps {
  onOpenDonatePage?: () => void;
  isStandalonePage?: boolean;
}

export default function DonationSection({
  onOpenDonatePage,
  isStandalonePage = false
}: DonationSectionProps) {
  const EXACT_UPI_ID = "shahrozaslamkakrala@axl";
  const OWNER_NAME = "Shahroz Khan";

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | 'custom'>(101);
  const [customAmount, setCustomAmount] = useState('');
  const [reason, setReason] = useState('Supporting Quick Calculator tools & servers');

  // Form Execution / Payment View Toggle State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(EXACT_UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const getEffectiveAmount = (): string => {
    if (selectedPreset === 'custom') {
      return customAmount && Number(customAmount) > 0 ? customAmount : '101';
    }
    return selectedPreset.toString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!stateName.trim()) newErrors.stateName = "State is required";
    if (!reason.trim()) newErrors.reason = "Reason for donation is required";
    if (selectedPreset === 'custom' && (!customAmount || Number(customAmount) <= 0)) {
      newErrors.amount = "Please enter a valid custom amount in ₹";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitted(true);
  };

  const finalAmountStr = getEffectiveAmount();
  const encodeReason = encodeURIComponent(reason.slice(0, 50) || 'Quick Calculator Donation');
  
  // Construct standard UPI deep link URL
  const upiPayUrl = `upi://pay?pa=${encodeURIComponent(EXACT_UPI_ID)}&pn=${encodeURIComponent(OWNER_NAME)}&am=${finalAmountStr}&cu=INR&tn=${encodeReason}`;

  // Dynamic QR code generated for UPI payment
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiPayUrl)}&color=0f172a`;

  return (
    <section id="donate-section" className={`${isStandalonePage ? 'py-6' : 'py-14'} bg-gradient-to-b from-neutral-50 via-indigo-950/5 to-neutral-50 dark:from-neutral-950 dark:via-indigo-950/20 dark:to-neutral-950 border-y border-neutral-200/80 dark:border-neutral-800/80 relative overflow-hidden`}>
      
      {/* Background Decorative Blur Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-rose-500/10 dark:bg-rose-500/15 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Title Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono font-bold"
          >
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
            <span>Support Free Software & Open Access</span>
          </motion.div>

          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-neutral-900 dark:text-white tracking-tight">
            Donate to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500">Quick Calculator</span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
            Your donation helps keep all Quick Calculator tools 100% free for everyone.
          </p>
        </div>

        {/* Main Content Container */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Form or Submitted Thank-you State */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
              
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                      <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-indigo-500" />
                        <span>Donor Details & Amount</span>
                      </h3>
                      <span className="text-xs font-mono text-neutral-400">* Required fields</span>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border ${
                            errors.fullName ? 'border-rose-500 focus:ring-rose-500' : 'border-neutral-200 dark:border-neutral-800 focus:ring-indigo-500'
                          } text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2`}
                        />
                      </div>
                      {errors.fullName && <p className="text-xs text-rose-500 mt-1 font-mono">{errors.fullName}</p>}
                    </div>

                    {/* City & State (Grid) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Delhi / Mumbai"
                          className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border ${
                            errors.city ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-800'
                          } text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.city && <p className="text-xs text-rose-500 mt-1 font-mono">{errors.city}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                          placeholder="e.g. Uttar Pradesh"
                          className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border ${
                            errors.stateName ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-800'
                          } text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.stateName && <p className="text-xs text-rose-500 mt-1 font-mono">{errors.stateName}</p>}
                      </div>
                    </div>

                    {/* Mobile & Email (Optional) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1">
                          Mobile Number <span className="text-neutral-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input
                            type="tel"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            placeholder="+91 9876543210"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 mb-1">
                          Email <span className="text-neutral-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contribution Amount Preset Selector */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                        Amount (₹ INR) *
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {[51, 101, 501, 1001].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => {
                              setSelectedPreset(amt);
                              setCustomAmount('');
                            }}
                            className={`py-2 px-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                              selectedPreset === amt
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-indigo-400'
                            }`}
                          >
                            ₹{amt}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setSelectedPreset('custom')}
                          className={`py-2 px-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                            selectedPreset === 'custom'
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                              : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-indigo-400'
                          }`}
                        >
                          Custom
                        </button>
                      </div>

                      {selectedPreset === 'custom' && (
                        <div className="mt-2 relative">
                          <IndianRupee className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <input
                            type="number"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            placeholder="Enter Custom Amount (e.g. 250)"
                            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      )}
                      {errors.amount && <p className="text-xs text-rose-500 mt-1 font-mono">{errors.amount}</p>}
                    </div>

                    {/* Reason for Donation / Description */}
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1">
                        Reason for Donation / Description *
                      </label>
                      <textarea
                        rows={2}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Why are you supporting Quick Calculator? (e.g., Thank you for the free tools)"
                        className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-neutral-950 border ${
                          errors.reason ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-800'
                        } text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      />
                      {errors.reason && <p className="text-xs text-rose-500 mt-1 font-mono">{errors.reason}</p>}
                    </div>

                    {/* Submit / Proceed Button */}
                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-display font-bold text-sm tracking-wide shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all group"
                    >
                      <span>Proceed to Pay (₹{finalAmountStr})</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="thankyou"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-5"
                  >
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span>Thank You, {fullName}!</span>
                      </div>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400">
                        Your donation helps keep all Quick Calculator tools 100% free for everyone. Please scan or tap below to complete your payment of <strong className="font-mono">₹{finalAmountStr}</strong>.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
                      <h4 className="font-mono font-bold text-neutral-500 uppercase">Donation Details Summary</h4>
                      <div className="grid grid-cols-2 gap-2 text-neutral-700 dark:text-neutral-300 font-mono">
                        <div>
                          <span className="text-neutral-400 block text-[10px]">Name:</span>
                          <span className="font-bold">{fullName}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-[10px]">Location:</span>
                          <span>{city}, {stateName}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-[10px]">Amount:</span>
                          <span className="font-bold text-emerald-500">₹{finalAmountStr}</span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-[10px]">UPI VPA:</span>
                          <span className="font-bold text-indigo-500">{EXACT_UPI_ID}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-800/60 text-neutral-600 dark:text-neutral-400">
                        <span className="text-neutral-400 block text-[10px] font-mono">Reason:</span>
                        <p className="italic">{reason}</p>
                      </div>
                    </div>

                    {/* Pay via Mobile App Button */}
                    <a
                      href={upiPayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-display font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Pay via UPI App (GPay / PhonePe / Paytm / BHIM)</span>
                    </a>

                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="w-full py-2 text-xs font-mono text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Edit Details / Enter Different Amount</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Right Column: Direct UPI Payment Info, Copy VPA, & QR Code */}
            <div className="lg:col-span-5 bg-gradient-to-br from-neutral-900 to-neutral-950 text-white p-6 sm:p-8 flex flex-col justify-between space-y-6 border-t lg:border-t-0 lg:border-l border-neutral-800">
              
              <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Scan QR Code to Pay</span>
                </div>

                {/* Direct UPI ID Box */}
                <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3 text-left space-y-1">
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                    Official Direct UPI VPA ID
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-300 select-all truncate">
                      {EXACT_UPI_ID}
                    </span>
                    <button
                      onClick={handleCopyUpi}
                      className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      {copiedUpi ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-300" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* QR Code Image Container */}
                <div className="bg-white p-3.5 rounded-2xl max-w-[210px] mx-auto shadow-2xl border-4 border-indigo-500/30">
                  <img
                    src={qrCodeImageUrl}
                    alt={`UPI Donation QR Code for ${EXACT_UPI_ID}`}
                    className="w-full h-auto rounded-lg mx-auto"
                  />
                </div>
                <p className="text-[11px] font-mono text-neutral-400">
                  Amount: <strong className="text-white">₹{finalAmountStr}</strong> • Direct to {EXACT_UPI_ID}
                </p>
              </div>

              {/* Extra Trust & Owner Info */}
              <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-neutral-200">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>Owner: {OWNER_NAME}</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Your donation helps keep all Quick Calculator tools 100% free for everyone.
                </p>
              </div>

              <div className="text-center pt-2 border-t border-neutral-800">
                <span className="text-[10px] font-mono text-neutral-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  100% Direct UPI Transfer • Zero Fees
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
