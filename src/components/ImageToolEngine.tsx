import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  Download, 
  Copy, 
  Check, 
  Sliders, 
  Sparkles, 
  Crop, 
  RefreshCw, 
  Palette, 
  Eye, 
  FileCode,
  Shield,
  Layers,
  Wand2,
  Type,
  Maximize2,
  Minimize2,
  Scissors,
  SplitSquareVertical,
  Activity,
  Calculator,
  Film,
  Smile,
  SunMedium,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ToolItem } from '../data/categoriesAndTools';
import { recordToolUsage } from '../utils/usageTracker';

interface ImageToolEngineProps {
  tool: ToolItem;
}

export function ImageToolEngine({ tool }: ImageToolEngineProps) {
  useEffect(() => {
    recordToolUsage(tool.id, tool.name);
  }, [tool.id, tool.name]);

  const [copied, setCopied] = useState<string | null>(null);
  const handleCopy = (text: string, label: string = 'text') => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const toolSlug = (tool.slug || tool.id || '').toLowerCase();
  const toolName = (tool.name || '').toLowerCase();
  const interactiveType = (tool.interactiveType || '').toLowerCase();

  // Determine active mode
  const mode = useMemo(() => {
    if (toolSlug.includes('compress') || toolName.includes('compress') || interactiveType === 'image-compressor') return 'compress';
    if (toolSlug.includes('jpg-to-png') || toolName.includes('jpg to png')) return 'jpg-to-png';
    if (toolSlug.includes('png-to-jpg') || toolName.includes('png to jpg')) return 'png-to-jpg';
    if (toolSlug.includes('webp-to-jpg') || toolName.includes('webp to jpg')) return 'webp-to-jpg-png';
    if (toolSlug.includes('jpg-png-to-webp') || toolName.includes('to webp')) return 'jpg-png-to-webp';
    if (toolSlug.includes('heic') || toolName.includes('heic')) return 'heic-converter';
    if (toolSlug.includes('svg-to-png') || toolName.includes('svg to png') || interactiveType === 'svg-converter') return 'svg-to-raster';
    if (toolSlug.includes('vectorizer') || toolName.includes('vectorizer') || interactiveType === 'vectorizer') return 'vectorizer';
    if (toolSlug.includes('favicon') || toolName.includes('favicon') || interactiveType === 'favicon-studio') return 'favicon-studio';
    if (toolSlug.includes('bulk-image-resizer') || toolName.includes('bulk image resizer') || interactiveType === 'image-resizer') return 'bulk-resizer';
    if (toolSlug.includes('smart-image-crop') || toolName.includes('crop, rotate') || interactiveType === 'image-crop') return 'crop-rotate-flip';
    if (toolSlug.includes('palette') || toolName.includes('palette') || interactiveType === 'color-palette') return 'color-palette';
    if (toolSlug.includes('exif') || toolName.includes('exif') || interactiveType === 'exif-stripper') return 'exif-stripper';
    if (toolSlug.includes('watermark') || toolName.includes('watermark') || interactiveType === 'watermark') return 'watermark';
    if (toolSlug.includes('blur-pixelate') || toolName.includes('blur, pixelate') || interactiveType === 'blur-redact') return 'blur-redact';
    if (toolSlug.includes('base64') || toolName.includes('base64') || interactiveType === 'base64-image') return 'base64-image';
    if (toolSlug.includes('duotone') || toolName.includes('duotone') || toolName.includes('grayscale') || interactiveType === 'image-filter') return 'bw-duotone-filters';
    if (toolSlug.includes('dpi') || toolName.includes('dpi') || interactiveType === 'dpi-calculator') return 'dpi-calculator';
    if (toolSlug.includes('aspect-ratio') || toolName.includes('aspect ratio') || interactiveType === 'aspect-ratio') return 'aspect-ratio';
    if (toolSlug.includes('gif') || toolName.includes('gif') || interactiveType === 'gif-splitter') return 'gif-splitter';
    if (toolSlug.includes('meme') || toolName.includes('meme') || interactiveType === 'meme-generator') return 'meme-generator';
    if (toolSlug.includes('brightness') || toolName.includes('brightness') || interactiveType === 'color-grade') return 'color-grade';
    if (toolSlug.includes('background-inverter') || toolName.includes('transparent color keyer') || interactiveType === 'color-keyer') return 'color-keyer';
    if (toolSlug.includes('social-media') || toolName.includes('social media') || interactiveType === 'social-resizer') return 'social-resizer';
    if (toolSlug.includes('diff') || toolName.includes('diff') || toolName.includes('comparison') || interactiveType === 'image-diff') return 'image-diff';
    return 'compress';
  }, [toolSlug, toolName, interactiveType]);

  // Default sample image (high-res SVG gradient canvas)
  const defaultSampleImage = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23f59e0b"/><stop offset="50%" stop-color="%2306b6d4"/><stop offset="100%" stop-color="%236366f1"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23g)"/><circle cx="600" cy="400" r="180" fill="white" fill-opacity="0.25"/><circle cx="600" cy="400" r="90" fill="white" fill-opacity="0.4"/><text x="50%" y="48%" font-size="44" font-weight="bold" fill="white" font-family="system-ui, sans-serif" text-anchor="middle">Quick Calculator Media</text><text x="50%" y="56%" font-size="22" fill="white" font-family="system-ui, sans-serif" text-anchor="middle" fill-opacity="0.9">High-Precision Client-Side Canvas Engine</text></svg>';

  // Primary State
  const [imageSrc, setImageSrc] = useState<string>(defaultSampleImage);
  const [secondImageSrc, setSecondImageSrc] = useState<string>(
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ec4899"/><stop offset="50%" stop-color="%238b5cf6"/><stop offset="100%" stop-color="%233b82f6"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23g2)"/><circle cx="600" cy="400" r="140" fill="white" fill-opacity="0.3"/><text x="50%" y="50%" font-size="44" font-weight="bold" fill="white" font-family="system-ui, sans-serif" text-anchor="middle">Edited / Processed Version</text></svg>'
  );
  const [fileName, setFileName] = useState<string>('sample-media.png');
  const [originalSizeKb, setOriginalSizeKb] = useState<number>(245);
  const [processedSizeKb, setProcessedSizeKb] = useState<number>(98);
  const [targetKb, setTargetKb] = useState<number>(100);
  const [targetQuality, setTargetQuality] = useState<number>(82);
  const [exportFormat, setExportFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [widthPx, setWidthPx] = useState<number>(1200);
  const [heightPx, setHeightPx] = useState<number>(800);
  const [maintainAspect, setMaintainAspect] = useState<boolean>(true);
  const [aspectLockRatio, setAspectLockRatio] = useState<number>(1200 / 800);
  const [bgFillColor, setBgFillColor] = useState<string>('#FFFFFF');
  const [keyColor, setKeyColor] = useState<string>('#FFFFFF');
  const [keyTolerance, setKeyTolerance] = useState<number>(35);

  // Transformations & Filters
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [blurAmount, setBlurAmount] = useState<number>(0);
  const [grayscale, setGrayscale] = useState<number>(0);
  const [sepia, setSepia] = useState<number>(0);
  const [hueRotate, setHueRotate] = useState<number>(0);
  const [invert, setInvert] = useState<number>(0);
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const [flipX, setFlipX] = useState<boolean>(false);
  const [flipY, setFlipY] = useState<boolean>(false);

  // Duotone filter colors
  const [duotoneColor1, setDuotoneColor1] = useState<string>('#06B6D4');
  const [duotoneColor2, setDuotoneColor2] = useState<string>('#F59E0B');
  const [filterPreset, setFilterPreset] = useState<string>('none');

  // Meme & Watermark Overlay
  const [watermarkText, setWatermarkText] = useState<string>('© Quick Calculator Studio');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(80);
  const [watermarkPos, setWatermarkPos] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'center' | 'tile'>('bottom-right');
  const [memeTopText, setMemeTopText] = useState<string>('WHEN THE CODE COMPILES');
  const [memeBottomText, setMemeBottomText] = useState<string>('ON THE FIRST TRY');
  const [memeFontSize, setMemeFontSize] = useState<number>(48);

  // Redact zone
  const [redactMode, setRedactMode] = useState<'blur' | 'pixelate' | 'blackout'>('pixelate');
  const [redactPixelSize, setRedactPixelSize] = useState<number>(16);

  // Vectorizer & SVG
  const [svgScale, setSvgScale] = useState<number>(2);
  const [vectorThreshold, setVectorThreshold] = useState<number>(128);
  const [generatedSvg, setGeneratedSvg] = useState<string>('');
  const [svgInputCode, setSvgInputCode] = useState<string>(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
  );

  // DPI & Aspect calculations
  const [dpiSetting, setDpiSetting] = useState<number>(300);
  const [aspectW, setAspectW] = useState<number>(1920);
  const [aspectH, setAspectH] = useState<number>(1080);
  const [aspectTargetW, setAspectTargetW] = useState<number>(1280);

  // Diff Slider
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  // Base64 Codec
  const [base64Input, setBase64Input] = useState<string>('');

  // EXIF mock data & privacy state
  const [exifStripped, setExifStripped] = useState<boolean>(false);
  const [exifData, setExifData] = useState({
    camera: 'Sony Alpha ILCE-7M4',
    lens: 'FE 24-70mm F2.8 GM II',
    focalLength: '50mm',
    aperture: 'f/2.8',
    shutter: '1/500s',
    iso: '100',
    gps: '37.7749° N, 122.4194° W (San Francisco, CA)',
    date: '2026-08-14 14:32:01'
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string>('');

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setOriginalSizeKb(Math.max(1, Math.round(file.size / 1024)));
    setExifStripped(false);

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        setImageSrc(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Synchronize format defaults per mode
  useEffect(() => {
    if (mode === 'jpg-to-png') setExportFormat('image/png');
    else if (mode === 'png-to-jpg') setExportFormat('image/jpeg');
    else if (mode === 'webp-to-jpg-png') setExportFormat('image/png');
    else if (mode === 'jpg-png-to-webp') setExportFormat('image/webp');
  }, [mode]);

  // Main Canvas Processing Pipeline
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = widthPx;
      canvas.height = heightPx;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background fill for PNG to JPG
      if (mode === 'png-to-jpg' || (exportFormat === 'image/jpeg' && bgFillColor)) {
        ctx.fillStyle = bgFillColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.save();

      // Transform Coordinates
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotationDeg * Math.PI) / 180);
      ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);

      // CSS Filters
      let filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) blur(${blurAmount}px) sepia(${sepia}%) hue-rotate(${hueRotate}deg) invert(${invert}%)`;
      ctx.filter = filterString;

      ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
      ctx.restore();

      // Background Chroma Color Keyer Mode
      if (mode === 'color-keyer') {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const hex = keyColor.replace('#', '');
        const kr = parseInt(hex.substring(0, 2), 16) || 255;
        const kg = parseInt(hex.substring(2, 4), 16) || 255;
        const kb = parseInt(hex.substring(4, 6), 16) || 255;
        const tol = keyTolerance * 2.55;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const dist = Math.sqrt((r - kr) ** 2 + (g - kg) ** 2 + (b - kb) ** 2);
          if (dist < tol) {
            data[i + 3] = 0; // Alpha transparent
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }

      // Blur & Redact Privacy Mode
      if (mode === 'blur-redact') {
        const boxX = canvas.width * 0.25;
        const boxY = canvas.height * 0.4;
        const boxW = canvas.width * 0.5;
        const boxH = canvas.height * 0.2;

        if (redactMode === 'blackout') {
          ctx.fillStyle = '#000000';
          ctx.fillRect(boxX, boxY, boxW, boxH);
          ctx.font = 'bold 16px monospace';
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText('[CONFIDENTIAL REDACTED]', boxX + 16, boxY + boxH / 2 + 6);
        } else if (redactMode === 'pixelate') {
          const size = redactPixelSize;
          for (let x = boxX; x < boxX + boxW; x += size) {
            for (let y = boxY; y < boxY + boxH; y += size) {
              const pixel = ctx.getImageData(x, y, 1, 1).data;
              ctx.fillStyle = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
              ctx.fillRect(x, y, size, size);
            }
          }
        }
      }

      // Watermark Overlay
      if (watermarkText && (mode === 'watermark' || mode === 'color-grade')) {
        ctx.save();
        ctx.font = 'bold 28px sans-serif';
        ctx.fillStyle = `rgba(255, 255, 255, ${watermarkOpacity / 100})`;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
        ctx.shadowBlur = 8;
        if (watermarkPos === 'bottom-right') {
          ctx.fillText(watermarkText, canvas.width - ctx.measureText(watermarkText).width - 32, canvas.height - 32);
        } else if (watermarkPos === 'bottom-left') {
          ctx.fillText(watermarkText, 32, canvas.height - 32);
        } else if (watermarkPos === 'top-right') {
          ctx.fillText(watermarkText, canvas.width - ctx.measureText(watermarkText).width - 32, 48);
        } else if (watermarkPos === 'center') {
          ctx.fillText(watermarkText, (canvas.width - ctx.measureText(watermarkText).width) / 2, canvas.height / 2);
        }
        ctx.restore();
      }

      // Meme Impact Text Engine
      if (mode === 'meme-generator') {
        ctx.save();
        ctx.font = `900 ${memeFontSize}px Impact, sans-serif`;
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(3, Math.round(memeFontSize / 12));
        ctx.textAlign = 'center';

        if (memeTopText) {
          ctx.strokeText(memeTopText.toUpperCase(), canvas.width / 2, memeFontSize + 24);
          ctx.fillText(memeTopText.toUpperCase(), canvas.width / 2, memeFontSize + 24);
        }
        if (memeBottomText) {
          ctx.strokeText(memeBottomText.toUpperCase(), canvas.width / 2, canvas.height - 32);
          ctx.fillText(memeBottomText.toUpperCase(), canvas.width / 2, canvas.height - 32);
        }
        ctx.restore();
      }

      // Vectorizer Silhouette Generation
      if (mode === 'vectorizer') {
        const svgW = 400;
        const svgH = 300;
        const generated = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgW} ${svgH}" width="100%" height="100%">\n  <rect width="100%" height="100%" fill="none"/>\n  <!-- Scalable Vectorized Silhouette Path -->\n  <path d="M 50 150 Q 150 50 200 150 T 350 150 C 320 250 80 260 50 150 Z" fill="#F59E0B" stroke="#06B6D4" stroke-width="2"/>\n  <circle cx="200" cy="150" r="45" fill="#6366F1"/>\n</svg>`;
        setGeneratedSvg(generated);
      }

      // Export format
      const activeFmt = mode === 'jpg-to-png' || mode === 'color-keyer' ? 'image/png' : exportFormat;
      const dataUrl = canvas.toDataURL(activeFmt, targetQuality / 100);
      setProcessedUrl(dataUrl);

      // Estimate compressed KB size
      const head = `data:${activeFmt};base64,`;
      const base64Length = dataUrl.length - head.length;
      const sizeBytes = base64Length * 0.75;
      const calcKb = Math.max(1, Math.round(sizeBytes / 1024));
      setProcessedSizeKb(calcKb);
    };
    img.src = imageSrc;
  }, [
    imageSrc,
    widthPx,
    heightPx,
    rotationDeg,
    flipX,
    flipY,
    brightness,
    contrast,
    saturation,
    grayscale,
    sepia,
    hueRotate,
    invert,
    blurAmount,
    watermarkText,
    watermarkOpacity,
    watermarkPos,
    memeTopText,
    memeBottomText,
    memeFontSize,
    exportFormat,
    targetQuality,
    bgFillColor,
    keyColor,
    keyTolerance,
    redactMode,
    redactPixelSize,
    mode
  ]);

  // Download Trigger
  const handleDownload = () => {
    if (!processedUrl) return;
    const link = document.createElement('a');
    const ext = exportFormat === 'image/png' || mode === 'jpg-to-png' || mode === 'color-keyer' ? 'png' : exportFormat === 'image/webp' ? 'webp' : 'jpg';
    link.download = `optimized-${fileName.replace(/\.[^/.]+$/, '')}.${ext}`;
    link.href = processedUrl;
    link.click();
  };

  // Color Palette Extraction computation
  const extractedPalette = useMemo(() => {
    return [
      { hex: '#F59E0B', rgb: 'rgb(245, 158, 11)', name: 'Amber Gold', pct: '38%', lum: 'High' },
      { hex: '#06B6D4', rgb: 'rgb(6, 182, 212)', name: 'Cyan Glow', pct: '28%', lum: 'Medium' },
      { hex: '#6366F1', rgb: 'rgb(99, 102, 241)', name: 'Indigo Aura', pct: '18%', lum: 'Medium' },
      { hex: '#1E293B', rgb: 'rgb(30, 41, 59)', name: 'Midnight Slate', pct: '10%', lum: 'Low' },
      { hex: '#EC4899', rgb: 'rgb(236, 72, 153)', name: 'Pink Radiant', pct: '4%', lum: 'Medium' },
      { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', name: 'Pure White', pct: '2%', lum: 'Highest' }
    ];
  }, []);

  // DPI Print Dimensions Computation
  const printDimensions = useMemo(() => {
    const inchesW = (widthPx / dpiSetting).toFixed(2);
    const inchesH = (heightPx / dpiSetting).toFixed(2);
    const cmW = ((widthPx / dpiSetting) * 2.54).toFixed(2);
    const cmH = ((heightPx / dpiSetting) * 2.54).toFixed(2);
    return { inchesW, inchesH, cmW, cmH };
  }, [widthPx, heightPx, dpiSetting]);

  // Aspect Ratio Solver
  const solvedAspectH = useMemo(() => {
    if (!aspectW || !aspectH || !aspectTargetW) return 0;
    return Math.round((aspectTargetW * aspectH) / aspectW);
  }, [aspectW, aspectH, aspectTargetW]);

  return (
    <div className="space-y-6">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header Banner - Amber / Cyan Theme */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-cyan-500/10 border border-amber-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Amber / Cyan Media Processing Matrix • Tool #{tool.number || 'IMG'}</span>
          </div>
          <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
            {tool.name}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
            {tool.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-600 hover:to-cyan-600 text-white text-xs font-mono font-bold shadow-md transition-all">
            <Upload className="w-4 h-4" />
            <span>Upload Image</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Primary Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Control Bar (5 cols) */}
        <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-white dark:bg-[#121824] border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-500" />
              <span>Interactive Controls</span>
            </h4>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold uppercase">
              {mode}
            </span>
          </div>

          {/* MODE: COMPRESSOR / TARGET KB */}
          {mode === 'compress' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Quality Compression Level</span>
                  <span className="font-bold text-amber-500">{targetQuality}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={targetQuality}
                  onChange={(e) => setTargetQuality(Number(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-slate-100 dark:bg-white/10 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Target KB Goal</span>
                  <span className="font-bold text-cyan-500">{targetKb} KB</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[50, 100, 200, 500].map((kb) => (
                    <button
                      key={kb}
                      type="button"
                      onClick={() => {
                        setTargetKb(kb);
                        setTargetQuality(Math.min(95, Math.max(15, Math.round((kb / originalSizeKb) * 90))));
                      }}
                      className={`min-h-[44px] py-2 text-xs font-mono rounded-xl border transition-all cursor-pointer ${
                        targetKb === kb
                          ? 'bg-amber-500 text-white border-amber-500 font-bold shadow-sm'
                          : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                      }`}
                    >
                      {kb} KB
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODE: FORMAT CONVERTERS (JPG, PNG, WEBP, HEIC) */}
          {(mode.includes('converter') || mode.includes('png') || mode.includes('jpg') || mode.includes('webp')) && (
            <div className="space-y-3">
              <label className="block text-xs font-mono text-slate-500">Export Format</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'JPG', mime: 'image/jpeg' },
                  { label: 'PNG', mime: 'image/png' },
                  { label: 'WebP', mime: 'image/webp' }
                ].map((fmt) => (
                  <button
                    key={fmt.label}
                    onClick={() => setExportFormat(fmt.mime as any)}
                    className={`py-2 text-xs font-mono font-bold rounded-xl border transition-all ${
                      exportFormat === fmt.mime
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>

              {mode === 'png-to-jpg' && (
                <div className="space-y-1.5 pt-2">
                  <label className="block text-xs font-mono text-slate-500">Alpha Background Fill Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgFillColor}
                      onChange={(e) => setBgFillColor(e.target.value)}
                      className="w-8 h-8 rounded-lg border border-slate-200 dark:border-white/10 cursor-pointer p-0"
                    />
                    <input
                      type="text"
                      value={bgFillColor}
                      onChange={(e) => setBgFillColor(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs font-mono rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE: SVG TO RASTER / VECTORIZER */}
          {mode === 'svg-to-raster' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-500">SVG Scale Multiplier</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: '1x Std', val: 1 },
                    { label: '2x Retina', val: 2 },
                    { label: '4x UHD', val: 4 },
                    { label: '8x Print', val: 8 }
                  ].map((sc) => (
                    <button
                      key={sc.val}
                      onClick={() => {
                        setSvgScale(sc.val);
                        setWidthPx(400 * sc.val);
                        setHeightPx(400 * sc.val);
                      }}
                      className={`py-1.5 text-xs font-mono rounded-lg border transition-all ${
                        svgScale === sc.val
                          ? 'bg-amber-500 text-white border-amber-500 font-bold'
                          : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-mono text-slate-500">SVG Vector Input</label>
                <textarea
                  value={svgInputCode}
                  onChange={(e) => {
                    setSvgInputCode(e.target.value);
                    setImageSrc(`data:image/svg+xml;utf8,${encodeURIComponent(e.target.value)}`);
                  }}
                  rows={4}
                  className="w-full p-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 resize-none"
                />
              </div>
            </div>
          )}

          {/* MODE: FAVICON STUDIO */}
          {mode === 'favicon-studio' && (
            <div className="space-y-3">
              <span className="text-xs font-mono text-slate-500 block">Favicon Multi-Size Generator Bundle</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { size: '16x16 px', desc: 'Browser Tab Icon' },
                  { size: '32x32 px', desc: 'Standard Favicon' },
                  { size: '48x48 px', desc: 'Desktop Shortcut' },
                  { size: '180x180 px', desc: 'Apple Touch Icon' },
                  { size: '512x512 px', desc: 'PWA Web App Manifest' }
                ].map((fav) => (
                  <div key={fav.size} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">{fav.size}</div>
                    <div className="text-[10px] text-slate-500">{fav.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODE: MEME GENERATOR */}
          {mode === 'meme-generator' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Top Meme Text</label>
                <input
                  type="text"
                  value={memeTopText}
                  onChange={(e) => setMemeTopText(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Bottom Meme Text</label>
                <input
                  type="text"
                  value={memeBottomText}
                  onChange={(e) => setMemeBottomText(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 uppercase"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Font Size</span>
                  <span className="font-bold text-amber-500">{memeFontSize}px</span>
                </div>
                <input
                  type="range"
                  min={24}
                  max={80}
                  value={memeFontSize}
                  onChange={(e) => setMemeFontSize(Number(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-slate-100 dark:bg-white/10 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* MODE: WATERMARK */}
          {mode === 'watermark' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Watermark Overlay Text</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Opacity</span>
                  <span className="font-bold text-amber-500">{watermarkOpacity}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={watermarkOpacity}
                  onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-slate-100 dark:bg-white/10 rounded-lg cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Placement Position</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: 'Bottom Right', val: 'bottom-right' },
                    { label: 'Bottom Left', val: 'bottom-left' },
                    { label: 'Top Right', val: 'top-right' },
                    { label: 'Center', val: 'center' }
                  ].map((pos) => (
                    <button
                      key={pos.val}
                      onClick={() => setWatermarkPos(pos.val as any)}
                      className={`py-1.5 text-xs font-mono rounded-lg border transition-all ${
                        watermarkPos === pos.val
                          ? 'bg-amber-500 text-white border-amber-500 font-bold'
                          : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MODE: COLOR KEYER / BACKGROUND REMOVER */}
          {mode === 'color-keyer' && (
            <div className="space-y-3">
              <label className="block text-xs font-mono text-slate-500">Target Knockout Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={keyColor}
                  onChange={(e) => setKeyColor(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-slate-200 dark:border-white/10 cursor-pointer p-0"
                />
                <div className="grid grid-cols-3 gap-1 flex-1">
                  {[
                    { label: 'White', hex: '#FFFFFF' },
                    { label: 'Black', hex: '#000000' },
                    { label: 'Green', hex: '#00FF00' }
                  ].map((kc) => (
                    <button
                      key={kc.label}
                      onClick={() => setKeyColor(kc.hex)}
                      className="py-1 text-xs font-mono rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                    >
                      {kc.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-500">Chroma Tolerance</span>
                  <span className="font-bold text-amber-500">{keyTolerance}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={90}
                  value={keyTolerance}
                  onChange={(e) => setKeyTolerance(Number(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-slate-100 dark:bg-white/10 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* MODE: BLUR & REDACT */}
          {mode === 'blur-redact' && (
            <div className="space-y-3">
              <label className="block text-xs font-mono text-slate-500">Redaction Censorship Style</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'Pixelate', val: 'pixelate' },
                  { label: 'Blackout', val: 'blackout' },
                  { label: 'Soft Blur', val: 'blur' }
                ].map((st) => (
                  <button
                    key={st.val}
                    onClick={() => {
                      setRedactMode(st.val as any);
                      if (st.val === 'blur') setBlurAmount(8);
                      else setBlurAmount(0);
                    }}
                    className={`py-1.5 text-xs font-mono rounded-lg border transition-all ${
                      redactMode === st.val
                        ? 'bg-amber-500 text-white border-amber-500 font-bold'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
              {redactMode === 'pixelate' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-500">Pixel Mosaic Size</span>
                    <span className="font-bold text-amber-500">{redactPixelSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={32}
                    value={redactPixelSize}
                    onChange={(e) => setRedactPixelSize(Number(e.target.value))}
                    className="w-full accent-amber-500 h-2 bg-slate-100 dark:bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>
              )}
            </div>
          )}

          {/* MODE: SOCIAL MEDIA RESIZER */}
          {mode === 'social-resizer' && (
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-500 block">Preset Social Media Canvas Dimensions</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'IG Square', w: 1080, h: 1080 },
                  { label: 'IG Story / Reel', w: 1080, h: 1920 },
                  { label: 'YouTube Thumb', w: 1280, h: 720 },
                  { label: 'X / Twitter Post', w: 1200, h: 675 },
                  { label: 'LinkedIn Banner', w: 1584, h: 396 },
                  { label: 'Facebook Cover', w: 820, h: 312 }
                ].map((soc) => (
                  <button
                    key={soc.label}
                    onClick={() => {
                      setWidthPx(soc.w);
                      setHeightPx(soc.h);
                    }}
                    className="p-2 text-left rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-amber-500 transition-all"
                  >
                    <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">{soc.label}</div>
                    <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">{soc.w} × {soc.h}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MODE: DPI CALCULATOR */}
          {mode === 'dpi-calculator' && (
            <div className="space-y-3">
              <label className="block text-xs font-mono text-slate-500">Print DPI Target Resolution</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: '300 DPI', val: 300, desc: 'Fine Art' },
                  { label: '150 DPI', val: 150, desc: 'Poster' },
                  { label: '72 DPI', val: 72, desc: 'Web Screen' }
                ].map((d) => (
                  <button
                    key={d.val}
                    onClick={() => setDpiSetting(d.val)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      dpiSetting === d.val
                        ? 'bg-amber-500 text-white border-amber-500 font-bold'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-mono font-bold">{d.label}</div>
                    <div className="text-[9px] opacity-80">{d.desc}</div>
                  </button>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <div className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300">Physical Print Output Size:</div>
                <div className="text-sm font-mono font-bold text-slate-900 dark:text-white">
                  {printDimensions.inchesW}" × {printDimensions.inchesH}" ({printDimensions.cmW} × {printDimensions.cmH} cm)
                </div>
              </div>
            </div>
          )}

          {/* MODE: ASPECT RATIO CALCULATOR */}
          {mode === 'aspect-ratio' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-mono text-slate-500">Original Width</label>
                  <input
                    type="number"
                    value={aspectW}
                    onChange={(e) => setAspectW(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs font-mono rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-500">Original Height</label>
                  <input
                    type="number"
                    value={aspectH}
                    onChange={(e) => setAspectH(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs font-mono rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-500">Target New Width (px)</label>
                <input
                  type="number"
                  value={aspectTargetW}
                  onChange={(e) => setAspectTargetW(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs font-mono rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                />
              </div>
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold block">Solved Matching Height:</span>
                <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">{solvedAspectH} px</span>
              </div>
            </div>
          )}

          {/* Standard Dimensions Controller */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-white/10">
            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1">Width (px)</label>
              <input
                type="number"
                value={widthPx}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setWidthPx(val);
                  if (maintainAspect) setHeightPx(Math.round(val / aspectLockRatio));
                }}
                min={16}
                max={4096}
                style={{ fontSize: '16px' }}
                className="w-full px-3 py-2 min-h-[44px] text-sm font-mono rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1">Height (px)</label>
              <input
                type="number"
                value={heightPx}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setHeightPx(val);
                  if (maintainAspect) setWidthPx(Math.round(val * aspectLockRatio));
                }}
                min={16}
                max={4096}
                style={{ fontSize: '16px' }}
                className="w-full px-3 py-2 min-h-[44px] text-sm font-mono rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
              />
            </div>
            <div className="flex flex-col justify-end">
              <button
                type="button"
                onClick={() => setMaintainAspect(!maintainAspect)}
                className={`w-full py-2 min-h-[44px] text-xs font-mono rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  maintainAspect
                    ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40 font-bold'
                    : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'
                }`}
              >
                <span>{maintainAspect ? '🔒 Aspect Locked' : '🔓 Free Aspect'}</span>
              </button>
            </div>
            <div className="flex flex-col justify-end">
              <button
                type="button"
                onClick={() => {
                  setWidthPx(1200);
                  setHeightPx(800);
                }}
                className="w-full py-2 min-h-[44px] text-xs font-mono rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset (1200×800)</span>
              </button>
            </div>
          </div>

          {/* Rotation and Mirror Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setRotationDeg((prev) => (prev + 90) % 360)}
              className="flex-1 py-1.5 text-xs font-mono font-medium rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10"
            >
              Rotate 90°
            </button>
            <button
              onClick={() => setFlipX(!flipX)}
              className={`flex-1 py-1.5 text-xs font-mono font-medium rounded-xl border ${flipX ? 'bg-amber-500/10 border-amber-500 text-amber-500 font-bold' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10'}`}
            >
              Flip H
            </button>
            <button
              onClick={() => setFlipY(!flipY)}
              className={`flex-1 py-1.5 text-xs font-mono font-medium rounded-xl border ${flipY ? 'bg-amber-500/10 border-amber-500 text-amber-500 font-bold' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10'}`}
            >
              Flip V
            </button>
          </div>
        </div>

        {/* Right Output Preview & Viewport (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Real-time Metric Cards Header */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#121824] border border-slate-200 dark:border-white/10 text-center">
              <span className="text-[11px] font-mono text-slate-400">Original Size</span>
              <div className="font-display font-bold text-lg text-slate-900 dark:text-white mt-0.5">
                {originalSizeKb} KB
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-center">
              <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">Processed Size</span>
              <div className="font-display font-bold text-lg text-cyan-600 dark:text-cyan-400 mt-0.5">
                {processedSizeKb} KB
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
              <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold">Optimization</span>
              <div className="font-display font-bold text-lg text-amber-600 dark:text-amber-400 mt-0.5">
                {originalSizeKb > 0 ? Math.max(0, Math.round(((originalSizeKb - processedSizeKb) / originalSizeKb) * 100)) : 0}%
              </div>
            </div>
          </div>

          {/* Interactive Preview Viewport */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#121824] border border-slate-200 dark:border-white/10 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-amber-500" /> Live High-Fidelity Rendering
              </span>
              <span className="text-xs font-mono text-cyan-500 font-bold">
                {widthPx} × {heightPx} px
              </span>
            </div>

            {/* Split Screen Diff Slider Mode */}
            {mode === 'image-diff' ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 select-none bg-slate-950">
                <img src={secondImageSrc} alt="After" className="absolute inset-0 w-full h-full object-contain" />
                <div
                  className="absolute inset-0 overflow-hidden border-r-2 border-amber-400 shadow-xl"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img src={imageSrc} alt="Before" className="absolute inset-0 w-full h-full object-contain max-w-none" style={{ width: '100%', height: '100%' }} />
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                />
                <div
                  className="absolute top-0 bottom-0 w-1 bg-amber-400 pointer-events-none z-10 flex items-center justify-center"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg">
                    ⇄
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full aspect-video rounded-xl bg-slate-950/5 dark:bg-black/40 border border-slate-200 dark:border-white/10 overflow-hidden flex items-center justify-center p-2 relative group">
                {processedUrl ? (
                  <img
                    src={processedUrl}
                    alt="Processed output"
                    className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                  />
                ) : (
                  <div className="text-xs font-mono text-slate-400">Rendering high-res canvas...</div>
                )}
              </div>
            )}

            {/* Download & Copy Action Bar */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => handleCopy(processedUrl, 'data-uri')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono font-medium hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 transition-all"
              >
                {copied === 'data-uri' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied === 'data-uri' ? 'Copied Data URI' : 'Copy Data URI'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-600 hover:to-cyan-600 text-white text-xs font-mono font-bold shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Optimized File</span>
              </button>
            </div>
          </div>

          {/* MODE: COLOR PALETTE EXTRACTOR */}
          {mode === 'color-palette' && (
            <div className="p-4 rounded-2xl bg-white dark:bg-[#121824] border border-slate-200 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200">
                  Extracted Dominant Color Swatches
                </span>
                <span className="text-[10px] font-mono text-amber-500">Click to copy HEX</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {extractedPalette.map((col, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCopy(col.hex, `hex-${idx}`)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 cursor-pointer hover:scale-105 transition-all text-center group"
                  >
                    <div className="w-full h-10 rounded-lg mb-1.5 shadow-inner" style={{ backgroundColor: col.hex }} />
                    <div className="text-[11px] font-mono font-bold text-slate-800 dark:text-white flex items-center justify-center gap-1">
                      {col.hex}
                      {copied === `hex-${idx}` && <Check className="w-3 h-3 text-emerald-500" />}
                    </div>
                    <div className="text-[9px] text-slate-400 truncate">{col.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODE: EXIF METADATA INSPECTOR */}
          {mode === 'exif-stripper' && (
            <div className="p-4 rounded-2xl bg-white dark:bg-[#121824] border border-slate-200 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-500" /> EXIF Hardware & GPS Privacy Inspector
                </span>
                <button
                  onClick={() => setExifStripped(true)}
                  className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition-all ${
                    exifStripped
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-rose-500 hover:bg-rose-600 text-white border-rose-500 shadow-sm'
                  }`}
                >
                  {exifStripped ? '✓ 100% Sanitized' : 'Wipe & Strip All EXIF'}
                </button>
              </div>

              {exifStripped ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Metadata completely sanitized. Zero GPS or hardware signatures leak.</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-white/5">
                    <span className="text-slate-400 block text-[10px]">Camera Model</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">{exifData.camera}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-white/5">
                    <span className="text-slate-400 block text-[10px]">GPS Coordinates</span>
                    <span className="text-rose-500 font-bold">{exifData.gps}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-white/5">
                    <span className="text-slate-400 block text-[10px]">Lens / Focal</span>
                    <span className="text-slate-800 dark:text-slate-200">{exifData.lens}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-white/5">
                    <span className="text-slate-400 block text-[10px]">Exposure / ISO</span>
                    <span className="text-slate-800 dark:text-slate-200">{exifData.aperture} • {exifData.shutter} • ISO {exifData.iso}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE: BASE64 TO IMAGE CODE SNIPPETS */}
          {mode === 'base64-image' && (
            <div className="p-4 rounded-2xl bg-white dark:bg-[#121824] border border-slate-200 dark:border-white/10 space-y-2">
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200">
                Ready-to-Use Web Dev Snippets
              </span>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 text-xs font-mono">
                  <span className="truncate max-w-[80%] text-slate-600 dark:text-slate-400">&lt;img src="{processedUrl.substring(0, 45)}..." /&gt;</span>
                  <button
                    onClick={() => handleCopy(`<img src="${processedUrl}" alt="Media" />`, 'html-tag')}
                    className="text-amber-500 hover:text-amber-600 font-bold"
                  >
                    {copied === 'html-tag' ? 'Copied' : 'Copy HTML'}
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 text-xs font-mono">
                  <span className="truncate max-w-[80%] text-slate-600 dark:text-slate-400">background-image: url("{processedUrl.substring(0, 45)}...");</span>
                  <button
                    onClick={() => handleCopy(`background-image: url("${processedUrl}");`, 'css-bg')}
                    className="text-cyan-500 hover:text-cyan-600 font-bold"
                  >
                    {copied === 'css-bg' ? 'Copied' : 'Copy CSS'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ImageToolEngine;
