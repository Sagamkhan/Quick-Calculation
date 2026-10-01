import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Upload, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Loader2, 
  AlertCircle, 
  Sliders, 
  Wand2, 
  Layers,
  X
} from 'lucide-react';
import { triggerConfetti } from '../../utils/confetti';

interface ImageStudioProps {
  tool?: any;
  onBack?: () => void;
}

const STYLE_PRESETS = [
  { name: 'Photorealistic', promptSuffix: ', hyperrealistic 8k resolution, cinematic lighting, photoreal portrait' },
  { name: '3D Animation', promptSuffix: ', stylized 3D render, Pixar aesthetic, vibrant soft lighting, smooth textures' },
  { name: 'Anime Art', promptSuffix: ', beautiful anime illustration, Makoto Shinkai style, vibrant colors, detailed line art' },
  { name: 'Cyberpunk', promptSuffix: ', cyberpunk aesthetic, glowing neon lights, rain reflections, futuristic high-tech' },
  { name: 'Oil Painting', promptSuffix: ', textured classical oil painting on canvas, expressive brush strokes, dramatic chiaroscuro' }
];

const ASPECT_RATIOS = [
  { label: '1:1 Square', value: '1:1' },
  { label: '16:9 Landscape', value: '16:9' },
  { label: '9:16 Portrait', value: '9:16' },
  { label: '4:3 Standard', value: '4:3' },
  { label: '3:4 Mobile', value: '3:4' }
];

export default function ImageStudio({ onBack }: ImageStudioProps) {
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [status, setStatus] = useState<'idle' | 'generating' | 'completed' | 'error'>('idle');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [explanationText, setExplanationText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Edit mode image upload state
  const [inputImageBase64, setInputImageBase64] = useState<string | null>(null);
  const [inputImagePreview, setInputImagePreview] = useState<string | null>(null);
  const [inputImageMimeType, setInputImageMimeType] = useState<string>('image/jpeg');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setInputImageMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setInputImagePreview(result);
      const base64 = result.split(',')[1];
      setInputImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPreset = (suffix: string) => {
    setPrompt(prev => {
      const trimmed = prev.trim();
      if (!trimmed) return `A breathtaking scene${suffix}`;
      return `${trimmed}${suffix}`;
    });
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setStatus('generating');
    setErrorMessage(null);
    setExplanationText('');

    try {
      const payload: any = {
        prompt: prompt.trim()
      };

      if (mode === 'create') {
        payload.aspectRatio = aspectRatio;
      } else if (mode === 'edit' && inputImageBase64) {
        payload.inputImageBase64 = inputImageBase64;
        payload.inputImageMimeType = inputImageMimeType;
      }

      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setGeneratedImageUrl(data.imageUrl);
      setExplanationText(data.text || '');
      setStatus('completed');
      triggerConfetti(0.35);
    } catch (err: any) {
      console.error('Error generating image:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Image generation failed');
    }
  };

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const a = document.createElement('a');
    a.href = generatedImageUrl;
    a.download = `gemini-image-${Date.now()}.png`;
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
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Gemini Image Studio</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
                gemini-3.1-flash-image-preview
              </span>
            </div>
            <div className="text-xs text-indigo-300/80">
              Generate new artwork or edit existing photos using text instructions.
            </div>
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex p-1.5 rounded-xl bg-slate-900 border border-slate-800 max-w-md">
        <button
          type="button"
          onClick={() => setMode('create')}
          className={`flex-1 py-2 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mode === 'create'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Create Image from Text</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('edit')}
          className={`flex-1 py-2 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mode === 'edit'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Edit Existing Image</span>
        </button>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-4">
          {/* Edit Mode: Upload Image Field */}
          {mode === 'edit' && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Original Image to Edit
              </label>

              {inputImagePreview ? (
                <div className="relative rounded-lg overflow-hidden border border-slate-700 max-h-48 group flex items-center justify-center bg-black">
                  <img src={inputImagePreview} alt="Original input" className="max-h-48 object-contain" />
                  <button
                    type="button"
                    onClick={() => {
                      setInputImagePreview(null);
                      setInputImageBase64(null);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-slate-950/80 text-rose-400 hover:text-rose-300 transition-colors"
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
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-6 px-4 rounded-xl border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-950/50 hover:bg-indigo-950/20 text-slate-400 hover:text-white flex flex-col items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Upload className="w-6 h-6 text-indigo-400" />
                    <span className="text-xs font-bold">Upload a photo to edit</span>
                    <span className="text-[10px] text-slate-500">PNG, JPG, WebP supported</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              {mode === 'create' ? 'Image Prompt' : 'Editing Instruction'}
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                mode === 'create'
                  ? 'Describe the image you want to create in vivid detail...'
                  : 'Describe what to add, remove, or transform in the photo (e.g. "Add a glowing neon hat", "Make it look like an oil painting")...'
              }
              disabled={status === 'generating'}
              className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 text-sm text-white placeholder-slate-500 outline-none transition-all resize-none font-sans"
            />
          </div>

          {/* Style Presets (Create Mode) */}
          {mode === 'create' && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-mono text-slate-400">Quick Style Enhancers:</div>
              <div className="flex flex-wrap gap-1.5">
                {STYLE_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPreset(preset.promptSuffix)}
                    disabled={status === 'generating'}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    +{preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Aspect Ratio Selector (Create Mode) */}
          {mode === 'create' && (
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ASPECT_RATIOS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setAspectRatio(item.value)}
                    disabled={status === 'generating'}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer truncate ${
                      aspectRatio === item.value
                        ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={
                !prompt.trim() || 
                (mode === 'edit' && !inputImageBase64) || 
                status === 'generating'
              }
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {status === 'generating' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Generating with gemini-3.1-flash-image-preview...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{mode === 'create' ? 'Generate Image' : 'Apply AI Edit'}</span>
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

        {/* Right Column: Image Preview */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-900 border border-slate-800 min-h-[420px]">
          {status === 'generating' ? (
            <div className="text-center p-8 space-y-3">
              <div className="w-14 h-14 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto" />
              <div className="text-sm font-bold text-white">Synthesizing Artwork with Gemini...</div>
              <div className="text-xs text-slate-400 max-w-sm">
                Generating high-resolution raster output with realistic textures and lighting.
              </div>
            </div>
          ) : generatedImageUrl ? (
            <div className="w-full space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-black border border-slate-700 shadow-2xl flex items-center justify-center max-h-[500px]">
                <img
                  src={generatedImageUrl}
                  alt={prompt}
                  className="max-h-[480px] w-auto object-contain rounded-lg"
                />
              </div>

              {explanationText && (
                <div className="p-3 rounded-xl bg-slate-950 text-slate-300 text-xs italic">
                  {explanationText}
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                  ✓ Ready
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
                <ImageIcon className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">No Image Generated Yet</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  {mode === 'create'
                    ? 'Enter your text prompt and select an aspect ratio to create a new high-quality image.'
                    : 'Upload an existing photo and write an instruction prompt to apply creative edits.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
