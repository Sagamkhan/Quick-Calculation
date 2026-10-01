import React, { useState, useMemo } from 'react';
import { Sparkles, HelpCircle, Check, Copy, Printer, Plus, Trash2, IndianRupee, FileText } from 'lucide-react';
import { ToolComponentProps } from './registry';

interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
  gstRate: number;
}

export default function InvoiceGeneratorGst({ tool, onBack }: ToolComponentProps) {
  const [sellerName, setSellerName] = useState<string>('Quick Calculator Tech Private Limited');
  const [sellerGstin, setSellerGstin] = useState<string>('27AABCU9603R1ZM');
  const [buyerName, setBuyerName] = useState<string>('Praveen Enterprises');
  const [invoiceNo, setInvoiceNo] = useState<string>('QC-2026-0042');
  const [invoiceDate, setInvoiceDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [isInterstate, setIsInterstate] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Web Development & Calculation Engine Software', qty: 1, rate: 25000, gstRate: 18 },
    { id: '2', description: 'API Integration & Security Audit Maintenance', qty: 2, rate: 5000, gstRate: 18 }
  ]);

  const totals = useMemo(() => {
    let subtotal = 0;
    let totalTax = 0;

    items.forEach((item) => {
      const lineTotal = item.qty * item.rate;
      const tax = (lineTotal * item.gstRate) / 100;
      subtotal += lineTotal;
      totalTax += tax;
    });

    const grandTotal = subtotal + totalTax;

    return {
      subtotal,
      totalTax,
      cgst: isInterstate ? 0 : totalTax / 2,
      sgst: isInterstate ? 0 : totalTax / 2,
      igst: isInterstate ? totalTax : 0,
      grandTotal
    };
  }, [items, isInterstate]);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: String(Date.now()),
      description: 'Consulting Services',
      qty: 1,
      rate: 2000,
      gstRate: 18
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, val: any) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: val } : item)));
  };

  const handleCopySummary = () => {
    const text = `GST Invoice Summary:
Invoice #${invoiceNo} | Date: ${invoiceDate}
Billed To: ${buyerName}
Billed By: ${sellerName} (GSTIN: ${sellerGstin})
Subtotal: ₹${totals.subtotal.toLocaleString('en-IN')}
GST Tax: ₹${totals.totalTax.toLocaleString('en-IN')} (${isInterstate ? 'IGST' : 'CGST + SGST'})
Grand Total: ₹${Math.round(totals.grandTotal).toLocaleString('en-IN')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          Invoice Generator India GST Basic - Tax Bill Maker & Printable Receipt
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Generate professional Indian GST-compliant tax invoices with itemized rates, CGST/SGST/IGST splits, and printable receipt sheets.
        </p>
      </div>

      {/* Invoice Meta Grid */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-semibold">Seller / Business Name</label>
            <input
              type="text"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-semibold">Seller GSTIN</label>
            <input
              type="text"
              value={sellerGstin}
              onChange={(e) => setSellerGstin(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500 uppercase"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-semibold">Buyer / Client Name</label>
            <input
              type="text"
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-semibold">Invoice Number & Date</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className="w-1/2 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-1/2 px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-slate-800 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={isInterstate}
              onChange={(e) => setIsInterstate(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Inter-State Supply (IGST Integrated Tax instead of CGST + SGST)</span>
          </label>
        </div>
      </div>

      {/* Item Line Rows */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-cyan-400" /> Billed Items & Services
          </h3>
          <button
            type="button"
            onClick={addItem}
            className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add Item
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 items-center text-xs"
            >
              <div className="sm:col-span-5">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  placeholder="Item description..."
                  className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <input
                  type="number"
                  min={1}
                  value={item.qty || ''}
                  onChange={(e) => updateItem(item.id, 'qty', Math.max(1, Number(e.target.value)))}
                  placeholder="Qty"
                  className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono text-center"
                />
              </div>

              <div className="sm:col-span-2">
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={item.rate || ''}
                  onChange={(e) => updateItem(item.id, 'rate', Math.max(0, Number(e.target.value)))}
                  placeholder="Rate ₹"
                  className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono text-right"
                />
              </div>

              <div className="sm:col-span-2">
                <select
                  value={item.gstRate}
                  onChange={(e) => updateItem(item.id, 'gstRate', Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                >
                  <option value={0}>0% GST</option>
                  <option value={5}>5% GST</option>
                  <option value={12}>12% GST</option>
                  <option value={18}>18% GST</option>
                  <option value={28}>28% GST</option>
                </select>
              </div>

              <div className="sm:col-span-1 flex justify-center">
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  disabled={items.length <= 1}
                  className="p-1.5 rounded hover:bg-rose-500/20 text-rose-400 disabled:opacity-30"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Taxable Subtotal</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
            ₹{totals.subtotal.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80">
          <span className="text-xs text-slate-400">Total GST</span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1">
            ₹{totals.totalTax.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            {isInterstate ? `IGST: ₹${totals.igst.toFixed(2)}` : `CGST: ₹${totals.cgst.toFixed(2)} | SGST: ₹${totals.sgst.toFixed(2)}`}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-500/30">
          <span className="text-xs text-slate-400">Grand Total Invoice</span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 mt-1">
            ₹{Math.round(totals.grandTotal).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-700/80 flex items-center justify-between">
          <button
            type="button"
            onClick={handleCopySummary}
            className="px-3.5 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-semibold text-xs flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Summary'}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" /> Print Invoice
          </button>
        </div>
      </div>

      {/* 3-Line FAQ */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-cyan-400" /> Frequently Asked Questions
        </h4>
        <div className="space-y-2 text-xs text-slate-400 divide-y divide-slate-800/80">
          <div className="pt-2">
            <strong className="text-slate-300">When does Integrated GST (IGST) apply instead of CGST + SGST?</strong>
            <p className="mt-0.5">IGST applies whenever goods or services are supplied across state borders or for cross-border export shipments.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">What mandatory fields must appear on a valid GST tax invoice?</strong>
            <p className="mt-0.5">Essential details include the supplier's 15-digit GSTIN, consecutive invoice number, date of supply, and individual tax slab breakdowns.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Can small businesses create invoices without a GSTIN?</strong>
            <p className="mt-0.5">Yes, unregistered businesses operating beneath statutory thresholds (₹20/40 Lakhs turnover) can issue standard non-tax bills of supply.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
