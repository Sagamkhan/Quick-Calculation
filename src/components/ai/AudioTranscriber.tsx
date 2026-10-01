import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Square, 
  Upload, 
  Copy, 
  Check, 
  Download, 
  FileAudio, 
  RefreshCw, 
  Loader2, 
  AlertCircle, 
  Volume2, 
  Sparkles 
} from 'lucide-react';
import { triggerConfetti } from '../../utils/confetti';

interface AudioTranscriberProps {
  tool?: any;
  onBack?: () => void;
}

export default function AudioTranscriber({ onBack }: AudioTranscriberProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [status, setStatus] = useState<'idle' | 'recording' | 'transcribing' | 'completed' | 'error'>('idle');
  const [transcription, setTranscription] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  // Start microphone recording
  const startRecording = async () => {
    try {
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());

        // Trigger transcription automatically
        transcribeBlob(blob, mimeType);
      };

      recorder.start(250);
      setIsRecording(true);
      setStatus('recording');
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access error:', err);
      setErrorMessage(err.message || 'Microphone access denied. Please allow microphone permissions in your browser.');
      setStatus('error');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Transcribe audio blob with gemini-3.5-transcribe
  const transcribeBlob = async (blob: Blob, mimeType: string) => {
    setStatus('transcribing');
    setErrorMessage(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          const response = await fetch('/api/transcribe-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioBase64: base64Data,
              mimeType: mimeType || 'audio/webm'
            })
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Failed to transcribe audio');
          }

          setTranscription(data.text);
          setStatus('completed');
          triggerConfetti(0.3);
        } catch (postErr: any) {
          setErrorMessage(postErr.message || 'Failed to process transcription');
          setStatus('error');
        }
      };
      reader.readAsDataURL(blob);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to read audio file');
      setStatus('error');
    }
  };

  // Handle uploaded audio file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(file);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    transcribeBlob(file, file.type || 'audio/mp3');
  };

  const handleCopy = async () => {
    if (!transcription) return;
    try {
      await navigator.clipboard.writeText(transcription);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleDownloadTxt = () => {
    if (!transcription) return;
    const blob = new Blob([transcription], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const wordCount = transcription ? transcription.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = transcription ? transcription.length : 0;

  return (
    <div className="space-y-6">
      {/* Tool Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-300">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-400">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Gemini Audio Transcriber</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
                gemini-3.5-transcribe
              </span>
            </div>
            <div className="text-xs text-indigo-300/80">
              High-accuracy speech-to-text with auto punctuation, formatting, and speaker pauses.
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recording & Uploading Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-5">
            <h4 className="text-sm font-bold text-white">Record Audio from Microphone</h4>

            {/* Mic Button */}
            <div className="flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={status === 'transcribing'}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
                  isRecording
                    ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-rose-600/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                }`}
              >
                {isRecording ? (
                  <Square className="w-8 h-8 fill-current" />
                ) : (
                  <Mic className="w-10 h-10" />
                )}
                {isRecording && (
                  <span className="absolute -inset-2 rounded-full border-2 border-rose-500/40 animate-ping pointer-events-none" />
                )}
              </button>

              <div className="mt-4 font-mono text-sm font-bold text-slate-300">
                {isRecording ? (
                  <span className="text-rose-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    Recording: {formatSeconds(recordingTime)}
                  </span>
                ) : (
                  <span className="text-slate-400">Click microphone to start recording</span>
                )}
              </div>
            </div>

            {/* Audio Wave Simulation when recording */}
            {isRecording && (
              <div className="flex items-center justify-center gap-1 h-8">
                {[40, 70, 90, 60, 100, 50, 80, 45, 95, 65, 30].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-rose-500 rounded-full animate-pulse"
                    style={{ 
                      height: `${h}%`,
                      animationDelay: `${i * 120}ms`,
                      animationDuration: '600ms'
                    }}
                  />
                ))}
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
              <div className="flex-1 h-px bg-slate-800" />
              <span>OR UPLOAD AUDIO</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* File Upload Input */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isRecording || status === 'transcribing'}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Upload className="w-4 h-4 text-indigo-400" />
                <span>Upload Audio File (WAV, MP3, WebM, M4A)</span>
              </button>
            </div>

            {/* Audio Player Preview */}
            {audioUrl && (
              <div className="pt-2">
                <audio src={audioUrl} controls className="w-full h-10 rounded-lg" />
              </div>
            )}
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

        {/* Right Column: Transcription Output */}
        <div className="lg:col-span-7 flex flex-col p-5 rounded-2xl bg-slate-900 border border-slate-800 min-h-[380px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                Transcription Result
              </span>
              {transcription && (
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
                  {wordCount} words • {charCount} chars
                </span>
              )}
            </div>

            {transcription && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
                  title="Download TXT file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 pt-4">
            {status === 'transcribing' ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                <div className="text-sm font-bold text-white">Transcribing Audio with gemini-3.5-transcribe...</div>
                <div className="text-xs text-slate-400 max-w-sm">
                  Analyzing acoustic phonetics and converting speech to clean formatted text.
                </div>
              </div>
            ) : transcription ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans select-text max-h-[380px] overflow-y-auto">
                  {transcription}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
                <FileAudio className="w-10 h-10 text-slate-600" />
                <div className="text-sm font-bold text-slate-400">No Audio Transcribed</div>
                <div className="text-xs text-slate-500 max-w-sm">
                  Record your voice using the microphone or upload an audio file on the left to generate instant text transcripts.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
