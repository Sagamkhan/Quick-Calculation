import React, { useState, useMemo } from 'react';
import { 
  Video, 
  HardDrive, 
  Wifi, 
  Cpu, 
  Copy, 
  Check, 
  Download, 
  Clock, 
  Sliders, 
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';
import { ToolComponentProps } from './registry';
import { triggerConfetti } from '../utils/confetti';
import { jsPDF } from 'jspdf';

interface ResolutionSpec {
  id: string;
  name: string;
  width: number;
  height: number;
  recommendedBitrate30: number; // kbps
  recommendedBitrate60: number; // kbps
}

const RESOLUTIONS: ResolutionSpec[] = [
  { id: '720p', name: '720p HD (1280×720)', width: 1280, height: 720, recommendedBitrate30: 3500, recommendedBitrate60: 4500 },
  { id: '1080p', name: '1080p Full HD (1920×1080)', width: 1920, height: 1080, recommendedBitrate30: 6000, recommendedBitrate60: 8500 },
  { id: '1440p', name: '1440p 2K QHD (2560×1440)', width: 2560, height: 1440, recommendedBitrate30: 12000, recommendedBitrate60: 18000 },
  { id: '4k', name: '4K UHD (3840×2160)', width: 3840, height: 2160, recommendedBitrate30: 28000, recommendedBitrate60: 42000 }
];

export default function ObsBitrateStorageCalculator({ tool, onBack }: ToolComponentProps) {
  const [selectedResId, setSelectedResId] = useState<string>('1080p');
  const [fps, setFps] = useState<30 | 60 | 120>(60);
  const [videoBitrateKbps, setVideoBitrateKbps] = useState<number>(8500);
  const [audioBitrateKbps, setAudioBitrateKbps] = useState<number>(192);
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [encoderCodec, setEncoderCodec] = useState<'nvenc' | 'x264' | 'quicksync' | 'apple_vt'>('nvenc');
  const [rateControl, setRateControl] = useState<'cbr' | 'cqp' | 'vbr'>('cbr');
  const [copied, setCopied] = useState<boolean>(false);

  const selectedRes = useMemo(() => {
    return RESOLUTIONS.find(r => r.id === selectedResId) || RESOLUTIONS[1];
  }, [selectedResId]);

  // Handle Resolution Preset Switch
  const handleSelectResolution = (resId: string) => {
    setSelectedResId(resId);
    const target = RESOLUTIONS.find(r => r.id === resId);
    if (target) {
      setVideoBitrateKbps(fps === 30 ? target.recommendedBitrate30 : target.recommendedBitrate60);
    }
  };

  // Calculations
  const calculations = useMemo(() => {
    const totalBitrateKbps = videoBitrateKbps + audioBitrateKbps;
    const totalBitrateMbps = totalBitrateKbps / 1000;
    
    // Bytes per second = (Total bits per sec) / 8
    const bytesPerSecond = (totalBitrateKbps * 1000) / 8;
    
    // Total file size for duration
    const totalSeconds = durationMinutes * 60;
    const totalBytes = bytesPerSecond * totalSeconds;
    const totalMB = totalBytes / (1024 * 1024);
    const totalGB = totalBytes / (1024 * 1024 * 1024);

    // Hourly rate
    const gbPerHour = (bytesPerSecond * 3600) / (1024 * 1024 * 1024);
    
    // Minimum suggested upload bandwidth (with 25% safety overhead)
    const requiredUploadMbps = (totalBitrateMbps * 1.25).toFixed(1);

    // Timeline row estimates
    const timeline = [
      { time: '15 Minutes', mins: 15 },
      { time: '30 Minutes', mins: 30 },
      { time: '1 Hour', mins: 60 },
      { time: '2 Hours', mins: 120 },
      { time: '4 Hours', mins: 240 },
      { time: '8 Hours', mins: 480 }
    ].map(item => {
      const b = bytesPerSecond * (item.mins * 60);
      const gb = b / (1024 * 1024 * 1024);
      return {
        duration: item.time,
        sizeGB: gb < 1 ? `${(b / (1024 * 1024)).toFixed(0)} MB` : `${gb.toFixed(2)} GB`,
        rawGB: gb
      };
    });

    return {
      totalBitrateKbps,
      totalBitrateMbps: totalBitrateMbps.toFixed(2),
      totalMB: Math.round(totalMB),
      totalGB: totalGB < 1 ? `${totalMB.toFixed(0)} MB` : `${totalGB.toFixed(2)} GB`,
      gbPerHour: gbPerHour.toFixed(2),
      requiredUploadMbps,
      timeline
    };
  }, [videoBitrateKbps, audioBitrateKbps, durationMinutes]);

  const handleCopy = () => {
    const summary = `=== OBS Studio Recording & Bitrate Estimates ===
Resolution: ${selectedRes.name}
Frame Rate: ${fps} FPS
Video Bitrate: ${videoBitrateKbps} Kbps
Audio Bitrate: ${audioBitrateKbps} Kbps
Encoder: ${encoderCodec.toUpperCase()} (${rateControl.toUpperCase()})
Duration: ${durationMinutes} minutes
Estimated File Size: ${calculations.totalGB}
Storage Rate: ${calculations.gbPerHour} GB/hour
Required Upload Bandwidth: ${calculations.requiredUploadMbps} Mbps
Generated via Quick Calculator (100% Client-Side Privacy)`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    triggerConfetti(0.2);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 32, 'F');
    doc.setTextColor(56, 189, 248);
    doc.setFontSize(16);
    doc.text('OBS Studio Recording & Bitrate Calculation Report', 14, 18);
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated: ${new Date().toLocaleString()} | Quick Calculator`, 14, 26);

    let y = 46;
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`Resolution: ${selectedRes.name}`, 14, y); y += 8;
    doc.text(`Frame Rate: ${fps} FPS`, 14, y); y += 8;
    doc.text(`Video Bitrate: ${videoBitrateKbps} Kbps`, 14, y); y += 8;
    doc.text(`Audio Bitrate: ${audioBitrateKbps} Kbps`, 14, y); y += 8;
    doc.text(`Duration: ${durationMinutes} Minutes`, 14, y); y += 8;
    doc.text(`Projected File Size: ${calculations.totalGB}`, 14, y); y += 8;
    doc.text(`Storage Consumption: ${calculations.gbPerHour} GB/Hour`, 14, y); y += 8;
    doc.text(`Upload Speed Requirement: ${calculations.requiredUploadMbps} Mbps`, 14, y);

    doc.save('obs-bitrate-storage-calculation.pdf');
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider mb-1">
            <Video className="w-4 h-4 text-indigo-400" />
            <span>OBS Studio Recording & Bitrate Matrix</span>
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
            OBS Bitrate & File Size Storage Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Calculate exact disk storage file size, streaming upload bandwidth requirements, and optimal OBS Studio bitrate settings for 720p, 1080p, 1440p, and 4K recording.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-all border border-slate-700 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Specs' : 'Copy Specs'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold transition-all shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>
      </div>

      {/* 2-Column Responsive Workspace: Left Controls (5 cols), Right Metrics & Table (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
        
        {/* Left Column: Interactive Parameters */}
        <div className="lg:col-span-5 space-y-5 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Recording Configuration</span>
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold">
              Real-time Live Engine
            </span>
          </div>

          {/* 1. Resolution Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Target Resolution</span>
              <span className="text-indigo-400 font-normal">{selectedRes.width}×{selectedRes.height}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {RESOLUTIONS.map(res => (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => handleSelectResolution(res.id)}
                  className={`p-2.5 rounded-xl text-xs font-mono text-left transition-all border cursor-pointer ${
                    selectedResId === res.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold shadow-xs'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="block font-bold">{res.id.toUpperCase()}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{res.width}×{res.height}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. FPS Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Frame Rate (FPS)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([30, 60, 120] as const).map(rate => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setFps(rate)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                    fps === rate
                      ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-xs'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {rate} FPS
                </button>
              ))}
            </div>
          </div>

          {/* 3. Video Bitrate Slider & Presets */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold uppercase tracking-wider text-slate-300">Video Bitrate</span>
              <span className="text-cyan-400 font-bold text-sm">{videoBitrateKbps.toLocaleString()} Kbps</span>
            </div>
            <input
              type="range"
              min={1500}
              max={50000}
              step={500}
              value={videoBitrateKbps}
              onChange={(e) => setVideoBitrateKbps(Number(e.target.value))}
              className="w-full accent-cyan-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
            />
            {/* Quick Bitrate Presets */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[4500, 6000, 8500, 15000].map(kb => (
                <button
                  key={kb}
                  type="button"
                  onClick={() => setVideoBitrateKbps(kb)}
                  className={`py-1 text-[11px] font-mono rounded-lg border transition-all cursor-pointer ${
                    videoBitrateKbps === kb
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {kb >= 1000 ? `${kb / 1000}M` : `${kb}K`}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Audio Bitrate & Duration */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block">
                Audio Bitrate
              </label>
              <select
                value={audioBitrateKbps}
                onChange={(e) => setAudioBitrateKbps(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono"
                style={{ fontSize: '16px' }}
              >
                <option value={128}>128 Kbps (Standard)</option>
                <option value={160}>160 Kbps (Clean)</option>
                <option value={192}>192 Kbps (HQ Broadcast)</option>
                <option value={320}>320 Kbps (Studio Music)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block">
                Duration (Mins)
              </label>
              <input
                type="number"
                min={1}
                max={1440}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono font-bold"
                style={{ fontSize: '16px' }}
              />
            </div>
          </div>

          {/* 5. Encoder Selection */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block">
              OBS Video Encoder Hardware
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'nvenc', label: 'NVIDIA NVENC (GPU)', desc: 'RTX 20/30/40 Series' },
                { id: 'x264', label: 'x264 (Software CPU)', desc: 'High CPU Overhead' },
                { id: 'quicksync', label: 'Intel QuickSync', desc: 'Intel iGPU Acceleration' },
                { id: 'apple_vt', label: 'Apple VideoToolbox', desc: 'Apple Silicon M1/M2/M3' }
              ].map(enc => (
                <button
                  key={enc.id}
                  type="button"
                  onClick={() => setEncoderCodec(enc.id as any)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    encoderCodec === enc.id
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-xs font-mono block">{enc.label}</span>
                  <span className="text-[10px] text-slate-500 block truncate">{enc.desc}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Calculated Outputs & Breakdown Table (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Key Output Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-center">
              <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-wider block">Estimated File Size</span>
              <div className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
                {calculations.totalGB}
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">For {durationMinutes} mins recording</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">Storage Consumption</span>
              <div className="font-display font-black text-2xl sm:text-3xl text-emerald-300 mt-1">
                {calculations.gbPerHour} <span className="text-sm font-normal">GB/hr</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">Average hourly rate</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center col-span-2 sm:col-span-1">
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">Required Upload</span>
              <div className="font-display font-black text-2xl sm:text-3xl text-amber-300 mt-1">
                {calculations.requiredUploadMbps} <span className="text-sm font-normal">Mbps</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">Includes 25% safety headroom</span>
            </div>
          </div>

          {/* Timeline Storage Table */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <span>Recording Duration vs. Disk Space Projection</span>
              </h4>
              <span className="text-[11px] font-mono text-slate-400">
                {videoBitrateKbps} Kbps Stream
              </span>
            </div>

            <div className="overflow-x-auto touch-pan-x cyan-scrollbar">
              <table className="w-full text-left text-xs font-mono min-w-[480px]">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Session Length</th>
                    <th className="py-2.5 px-3 text-cyan-400">Video + Audio Bitrate</th>
                    <th className="py-2.5 px-3 text-right text-emerald-400 font-bold">Estimated Storage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {calculations.timeline.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-200">{row.duration}</td>
                      <td className="py-2.5 px-3 text-slate-400">{calculations.totalBitrateMbps} Mbps ({videoBitrateKbps}k + {audioBitrateKbps}k)</td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-300">{row.sizeGB}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommended OBS Settings Reference Guide */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h4 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Recommended OBS Settings for {selectedRes.name}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Rate Control / Keyframe</span>
                <span className="text-white font-bold block">CBR (Constant) • 2s Keyframe</span>
                <span className="text-[10px] text-slate-500 block">Strictly required by Twitch and YouTube</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase">Recommended Preset</span>
                <span className="text-white font-bold block">P5: Slow (Good Quality)</span>
                <span className="text-[10px] text-slate-500 block">Tuning: High Quality, Multipass: Two Passes</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
