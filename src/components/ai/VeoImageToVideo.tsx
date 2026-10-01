import React, { useState, useEffect, useRef } from 'react';
import { 
  Film, 
  Upload, 
  Sparkles, 
  Download, 
  Loader2, 
  AlertCircle, 
  Check, 
  RotateCcw,
  X,
  Play
} from 'lucide-react';
import { triggerConfetti } from '../../utils/confetti';

interface VeoImageToVideoProps {
  tool?: any;
  onBack?: () => void;
}

const MOTION_PRESETS = [
  "Slow cinematic camera zoom in with atmospheric lighting and subtle environmental breeze",
  "Gentle panning shot across the scene with delicate particle dust floating in the light",
  "Subtle breathing movement, lifelike portrait animation with natural ambient reflections",
  "Dynamic time-lapse motion with dramatic clouds and changing sun rays"
];

export default function VeoImageToVideo({ onBack }: VeoImageToVideoProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoMimeType, setPhotoMimeType] = useState<string>('image/jpeg');
  const [prompt, setPrompt] = useState('Animate this photo with smooth cinematic camera motion and vivid lighting');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [status, setStatus] = useState<'idle' | 'generating' | 'polling' | 'downloading' | 'completed' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pollIntervalRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (videoBlobUrl) URL.revokeObjectURL(videoBlobUrl);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [videoBlobUrl]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      const base64 = result.split(',')[1];
      setPhotoBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!photoBase64) return;

    setStatus('generating');
    setStatusMessage('Submitting photo to Veo 3 engine (veo-3.1-fast-generate-preview)...');
    setProgressPercent(10);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim() || 'Animate this photo with smooth cinematic camera motion',
          aspectRatio,
          imageBase64: photoBase64,
          imageMimeType: photoMimeType
        })
      });

      const data = await response.json();
      if (!response.ok || !data.operationName) {
        throw new Error(data.error || 'Failed to start image-to-video animation');
      }

      const operationName = data.operationName;
      setStatus('polling');
      setStatusMessage('Analyzing photo depth & synthesizing camera motion...');
      setProgressPercent(25);

      let attempts = 0;
      const maxAttempts = 60;

      pollIntervalRef.current = setInterval(async () => {
        attempts++;
        const simulatedProgress = Math.min(25 + attempts * 2.5, 90);
        setProgressPercent(Math.round(simulatedProgress));

        if (attempts > 12) {
          setStatusMessage('Synthesizing temporal consistency & physics across frames...');
        } else if (attempts > 6) {
          setStatusMessage('Generating smooth fluid animations and specular lighting...');
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
            throw new Error(statusData.error.message || 'Animation generation encountered an error');
          }

          if (statusData.done) {
            clearInterval(pollIntervalRef.current);
            setStatus('downloading');
            setStatusMessage('Streaming completed high-definition video...');
            setProgressPercent(95);

            const downloadRes = await fetch('/api/video-download', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ operationName })
            });

            if (!downloadRes.ok) {
              throw new Error('Failed to download animated video');
            }

            const blob = await downloadRes.blob();
            const url = URL.createObjectURL(blob);
            setVideoBlobUrl(url);
            setStatus('completed');
            setProgressPercent(100);
            setStatusMessage('Animation complete!');
            triggerConfetti(0.4);
          } else if (attempts >= maxAttempts) {
            clearInterval(pollIntervalRef.current);
            throw new Error('Generation took longer than expected. Please try again.');
          }
        } catch (pollErr: any) {
          clearInterval(pollIntervalRef.current);
          setStatus('error');
          setErrorMessage(pollErr.message || 'Error checking animation progress');
        }
      }, 3500);

    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to animate photo');
    }
  };

  const handleDownload = () => {
    if (!videoBlobUrl) return;
    const a = document.createElement('a');
    a.href = videoBlobUrl;
    a.download = `veo-animated-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-300">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-400">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Veo Photo-to-Video Animator</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
                veo-3.1-fast-generate-preview
              </span>
            </div>
            <div className="text-xs text-indigo-300/80">
              Upload any still photo or illustration and generate fluid cinematic video motion.
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload & Parameters */}
        <div className="lg:col-span-6 space-y-4">
          {/* Photo Upload Area */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              1. Upload Photo to Animate
            </label>

            {photoPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black max-h-56 flex items-center justify-center">
                <img src={photoPreview} alt="Uploaded source" className="max-h-56 object-contain" />
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview(null);
                    setPhotoBase64(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/80 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-8 px-4 rounded-xl border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-900/60 hover:bg-indigo-950/20 text-slate-400 hover:text-white flex flex-col items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Upload className="w-7 h-7 text-indigo-400" />
                  <span className="text-xs font-bold">Select Photo or Drag & Drop</span>
                  <span className="text-[10px] text-slate-500">Supports PNG, JPG, WebP</span>
                </button>
              </div>
            )}
          </div>

          {/* Animation Motion Prompt */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              2. Animation Motion & Camera Direction
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe camera movement (zoom, pan), environment changes, or action..."
              disabled={status === 'generating' || status === 'polling' || status === 'downloading'}
              className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 text-sm text-white placeholder-slate-500 outline-none transition-all resize-none font-sans"
            />
          </div>

          {/* Motion Presets */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono text-slate-400">Motion Presets:</div>
            <div className="flex flex-wrap gap-1.5">
              {MOTION_PRESETS.map((m, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(m)}
                  disabled={status === 'generating' || status === 'polling'}
                  className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition-all cursor-pointer truncate max-w-full"
                >
                  {m.slice(0, 48)}...
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              3. Video Aspect Ratio
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
                  <div className="text-[10px] text-slate-400">Widescreen & YouTube</div>
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
                  <div className="text-[10px] text-slate-400">Reels & Mobile Shorts</div>
                </div>
                {aspectRatio === '9:16' && <Check className="w-4 h-4 text-indigo-400" />}
              </button>
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!photoBase64 || status === 'generating' || status === 'polling' || status === 'downloading'}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {status === 'generating' || status === 'polling' || status === 'downloading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Animating with Veo ({progressPercent}%)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Animate Photo into Video</span>
                </>
              )}
            </button>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Error: </span>
                {errorMessage}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Video Output */}
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
                <h4 className="text-base font-bold text-white font-display">Veo 3 Photo Animation</h4>
                <p className="text-xs text-indigo-300 mt-1">{statusMessage}</p>
              </div>

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
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                  ✓ MP4 Animation Ready ({aspectRatio})
                </span>
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
                    title="Animate another photo"
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
                  Upload a photo on the left, describe the desired camera or scene motion, and click Animate to create an AI video.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
