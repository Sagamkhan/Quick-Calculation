import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Sparkles, 
  Film, 
  Download, 
  Loader2, 
  AlertCircle, 
  RefreshCw, 
  Maximize2, 
  Sliders, 
  Check, 
  ArrowRight,
  Play,
  RotateCcw
} from 'lucide-react';
import { triggerConfetti } from '../../utils/confetti';

interface VeoTextToVideoProps {
  tool?: any;
  onBack?: () => void;
}

const SAMPLE_PROMPTS = [
  "A majestic soaring cinematic drone shot over snowcapped jagged mountains at sunrise with golden clouds drifting through peaks",
  "Cyberpunk neon street in Tokyo in slow motion with reflections glistening in rain puddles and ambient holographic signs",
  "Macro 4k slow-motion shot of a crystal glass sphere falling into still turquoise water, creating crystalline ripple rings",
  "A cozy warm coffee shop in Paris during a gentle autumn rain, camera smoothly gliding past steamed window panes"
];

export default function VeoTextToVideo({ onBack }: VeoTextToVideoProps) {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [status, setStatus] = useState<'idle' | 'generating' | 'polling' | 'downloading' | 'completed' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pollIntervalRef = useRef<any>(null);

  // Clean up Blob URLs on unmount
  useEffect(() => {
    return () => {
      if (videoBlobUrl) URL.revokeObjectURL(videoBlobUrl);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [videoBlobUrl]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setStatus('generating');
    setStatusMessage('Initiating Veo 3 video engine (veo-3.1-fast-generate-preview)...');
    setProgressPercent(10);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspectRatio
        })
      });

      const data = await response.json();
      if (!response.ok || !data.operationName) {
        throw new Error(data.error || 'Failed to start video generation operation');
      }

      const operationName = data.operationName;
      setStatus('polling');
      setStatusMessage('Veo is rendering frames, motion vectors & atmospheric lighting...');
      setProgressPercent(25);

      // Start polling
      let attempts = 0;
      const maxAttempts = 60; // Up to ~2-3 minutes

      pollIntervalRef.current = setInterval(async () => {
        attempts++;
        const simulatedProgress = Math.min(25 + attempts * 2.5, 90);
        setProgressPercent(Math.round(simulatedProgress));

        if (attempts > 15) {
          setStatusMessage('Synthesizing fluid motion physics and temporal coherence...');
        } else if (attempts > 8) {
          setStatusMessage('Rendering high-fidelity textures, depth maps and lighting...');
        }

        try {
          const statusRes = await fetch('/api/video-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operationName })
          });

          const statusData = await statusRes.json();

          if (statusData.error) {
            clearInterval(pollIntervalRef.current);
            throw new Error(statusData.error.message || 'Video generation encountered an error');
          }

          if (statusData.done) {
            clearInterval(pollIntervalRef.current);
            setStatus('downloading');
            setStatusMessage('Finalizing and streaming high-definition MP4...');
            setProgressPercent(95);

            // Fetch video stream
            const downloadRes = await fetch('/api/video-download', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ operationName })
            });

            if (!downloadRes.ok) {
              throw new Error('Failed to download completed video');
            }

            const blob = await downloadRes.blob();
            const url = URL.createObjectURL(blob);
            setVideoBlobUrl(url);
            setStatus('completed');
            setProgressPercent(100);
            setStatusMessage('Generation complete!');
            triggerConfetti(0.4);
          } else if (attempts >= maxAttempts) {
            clearInterval(pollIntervalRef.current);
            throw new Error('Generation took longer than expected. Please try again with a shorter prompt.');
          }
        } catch (pollErr: any) {
          clearInterval(pollIntervalRef.current);
          setStatus('error');
          setErrorMessage(pollErr.message || 'Error checking video generation progress');
        }
      }, 3500);

    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to generate video');
    }
  };

  const handleDownload = () => {
    if (!videoBlobUrl) return;
    const a = document.createElement('a');
    a.href = videoBlobUrl;
    a.download = `veo-video-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-300">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-400">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Veo 3 Text-to-Video Engine</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
                veo-3.1-fast-generate-preview
              </span>
            </div>
            <div className="text-xs text-indigo-300/80">
              Generates high-definition, temporal-coherent motion videos from text prompts.
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prompt & Parameters */}
        <div className="lg:col-span-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              1. Video Description Prompt
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to see (camera angle, action, lighting, scenery)..."
              disabled={status === 'generating' || status === 'polling' || status === 'downloading'}
              className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 text-sm text-white placeholder-slate-500 outline-none transition-all resize-none font-sans"
            />
          </div>

          {/* Sample Prompts */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono text-slate-400">Try an inspiring idea:</div>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(p)}
                  disabled={status === 'generating' || status === 'polling'}
                  className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition-all cursor-pointer truncate max-w-full"
                  title={p}
                >
                  {p.slice(0, 52)}...
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              2. Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                disabled={status === 'generating' || status === 'polling'}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  aspectRatio === '16:9'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">16:9 Landscape</div>
                  <div className="text-[10px] text-slate-400">Widescreen, YouTube, Desktop</div>
                </div>
                {aspectRatio === '16:9' && <Check className="w-4 h-4 text-indigo-400" />}
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                disabled={status === 'generating' || status === 'polling'}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  aspectRatio === '9:16'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">9:16 Portrait</div>
                  <div className="text-[10px] text-slate-400">Reels, TikTok, Shorts</div>
                </div>
                {aspectRatio === '9:16' && <Check className="w-4 h-4 text-indigo-400" />}
              </button>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!prompt.trim() || status === 'generating' || status === 'polling' || status === 'downloading'}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {status === 'generating' || status === 'polling' || status === 'downloading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Generating Veo Video ({progressPercent}%)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Video with Veo 3</span>
                </>
              )}
            </button>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Generation error: </span>
                {errorMessage}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Output Video Player & Loading Status */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900 border border-slate-800 min-h-[380px]">
          {status === 'generating' || status === 'polling' || status === 'downloading' ? (
            <div className="w-full max-w-md p-6 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping" />
                <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin flex items-center justify-center">
                  <Film className="w-6 h-6 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-display">Veo 3 AI Video Generation</h4>
                <p className="text-xs text-indigo-300 mt-1">{statusMessage}</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                AI video rendering can take ~1-2 minutes. Please keep this tab open.
              </div>
            </div>
          ) : videoBlobUrl ? (
            <div className="w-full space-y-4">
              <div className={`relative overflow-hidden rounded-xl bg-black border border-slate-700 shadow-2xl mx-auto flex items-center justify-center ${
                aspectRatio === '9:16' ? 'max-w-[280px] aspect-[9/16]' : 'w-full aspect-video'
              }`}>
                <video
                  src={videoBlobUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                    ✓ MP4 Ready ({aspectRatio})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download MP4</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoBlobUrl(null);
                      setStatus('idle');
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                    title="Generate New Video"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
                <Film className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">No Video Generated Yet</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Type your scene description on the left and select your preferred aspect ratio to generate high-resolution video.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
