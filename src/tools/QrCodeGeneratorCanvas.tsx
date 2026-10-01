import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Sparkles, HelpCircle, Check, Copy, Download, QrCode, Sliders, Palette, Link } from 'lucide-react';
import { ToolComponentProps } from './registry';

export default function QrCodeGeneratorCanvas({ tool, onBack }: ToolComponentProps) {
  const [content, setContent] = useState<string>('https://quickcalc.online');
  const [darkColor, setDarkColor] = useState<string>('#0f172a');
  const [lightColor, setLightColor] = useState<string>('#ffffff');
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [sizePx, setSizePx] = useState<number>(300);
  const [copied, setCopied] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !content.trim()) return;

    QRCode.toCanvas(
      canvasRef.current,
      content,
      {
        width: sizePx,
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: darkColor,
          light: lightColor
        }
      },
      (err) => {
        if (err) console.error('[QRCode] Error rendering to canvas:', err);
      }
    );
  }, [content, darkColor, lightColor, errorLevel, sizePx]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `quickcalc-qrcode-${Date.now()}.png`;
    a.click();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      <div className="border-b border-slate-700/60 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
          QR Code Generator Canvas - High Resolution PNG Download & Vector Tool
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Generate scannable 2D QR codes rendered directly on HTML5 Canvas. Customize error correction levels, custom branding colors, and export high-res PNGs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Settings */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-4">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <Link className="w-4 h-4 text-cyan-400" /> Target Content or URL
            </h3>

            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter URL, text, or payment address (e.g. upi://pay?pa=...)..."
              className="w-full px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
            />

            {/* Color controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-800">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold block">Foreground Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                    className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold block">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={lightColor}
                    onChange={(e) => setLightColor(e.target.value)}
                    className="w-9 h-9 rounded cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={lightColor}
                    onChange={(e) => setLightColor(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Error correction & Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-800">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-semibold block">Error Correction Level</label>
                <div className="grid grid-cols-4 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs text-center font-mono">
                  {(['L', 'M', 'Q', 'H'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setErrorLevel(lvl)}
                      className={`py-1 rounded font-bold transition ${
                        errorLevel === lvl ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500">H (High: 30% recovery for damaged/printed codes)</p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300 font-semibold">
                  <span>Canvas Resolution</span>
                  <span className="font-mono text-cyan-400">{sizePx} × {sizePx} px</span>
                </div>
                <input
                  type="range"
                  min={180}
                  max={600}
                  step={20}
                  value={sizePx}
                  onChange={(e) => setSizePx(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Canvas Display */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 w-full flex flex-col items-center justify-between space-y-4">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 self-start">
              <QrCode className="w-4 h-4 text-cyan-400" /> HTML5 Canvas Render
            </span>

            {/* Canvas wrapper */}
            <div className="p-3 rounded-2xl bg-white shadow-xl flex items-center justify-center max-w-full overflow-hidden">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: '280px' }}
              />
            </div>

            <div className="w-full flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Text'}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition"
              >
                <Download className="w-3.5 h-3.5" /> Download PNG
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Line FAQ */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-700/80 space-y-3">
        <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-cyan-400" /> Frequently Asked Questions
        </h4>
        <div className="space-y-2 text-xs text-slate-400 divide-y divide-slate-800/80">
          <div className="pt-2">
            <strong className="text-slate-300">Do the generated QR codes expire or have scan limits?</strong>
            <p className="mt-0.5">No, these are standard static 2D barcodes that encode raw characters directly into the pixel matrix; they remain valid permanently.</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">What does Error Correction Level (L, M, Q, H) mean?</strong>
            <p className="mt-0.5">Reed-Solomon error correction allows codes to remain scannable even if partly smudged or covered (Level H recovers up to 30% data loss).</p>
          </div>
          <div className="pt-2">
            <strong className="text-slate-300">Can I generate UPI QR codes for Indian digital payments?</strong>
            <p className="mt-0.5">Yes, by formatting content as `upi://pay?pa=yourvpa@upi&pn=YourName&am=Amount`, smartphone camera apps will open Google Pay, PhonePe, or Paytm.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
