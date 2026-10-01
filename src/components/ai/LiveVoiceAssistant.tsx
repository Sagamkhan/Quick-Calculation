import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  PhoneOff, 
  PhoneCall, 
  Loader2, 
  AlertCircle, 
  Radio, 
  Send,
  MessageSquare
} from 'lucide-react';

interface LiveVoiceAssistantProps {
  tool?: any;
  onBack?: () => void;
}

// Helper: Convert Float32Array PCM to 16-bit signed PCM Base64 string
function pcmToBase64(channelData: Float32Array): string {
  const pcm16 = new Int16Array(channelData.length);
  for (let i = 0; i < channelData.length; i++) {
    const s = Math.max(-1, Math.min(1, channelData[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  let binary = '';
  const bytes = new Uint8Array(pcm16.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Helper: Convert 24kHz Base64 PCM to AudioBuffer and play in AudioContext
function playAudioChunk(audioCtx: AudioContext, base64Data: string, scheduledTimeRef: { current: number }): void {
  try {
    const binary = atob(base64Data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 0x8000;
    }

    const audioBuffer = audioCtx.createBuffer(1, float32.length, 24000);
    audioBuffer.copyToChannel(float32, 0);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);

    const startTime = Math.max(audioCtx.currentTime, scheduledTimeRef.current);
    source.start(startTime);
    scheduledTimeRef.current = startTime + audioBuffer.duration;
  } catch (err) {
    console.error('Error playing audio chunk:', err);
  }
}

export default function LiveVoiceAssistant({ onBack }: LiveVoiceAssistantProps) {
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [isModelSpeaking, setIsModelSpeaking] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [conversationLogs, setConversationLogs] = useState<{ sender: 'user' | 'model' | 'system'; text: string; time: string }[]>([
    {
      sender: 'system',
      text: 'Connected to Gemini Live. Speak naturally into your microphone or send text questions.',
      time: 'Ready'
    }
  ]);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const scheduledTimeRef = useRef<{ current: number }>({ current: 0 });
  const speakingTimeoutRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      disconnectLive();
    };
  }, []);

  const connectLive = async () => {
    try {
      setErrorMessage(null);
      setConnectionStatus('connecting');

      // Initialize audio contexts
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const inputAudioCtx = new AudioCtx({ sampleRate: 16000 });
      const outputAudioCtx = new AudioCtx({ sampleRate: 24000 });
      inputAudioCtxRef.current = inputAudioCtx;
      outputAudioCtxRef.current = outputAudioCtx;
      scheduledTimeRef.current = { current: outputAudioCtx.currentTime };

      // Request microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          channelCount: 1, 
          sampleRate: 16000, 
          echoCancellation: true, 
          noiseSuppression: true 
        } 
      });
      mediaStreamRef.current = stream;

      // Connect to server WebSocket
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live-ws`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[Live Assistant] WebSocket opened');
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'ready') {
            setConnectionStatus('connected');
            setIsMicActive(true);
            startMicAudioProcessing(inputAudioCtx, stream, ws);
          } else if (msg.type === 'audio' && msg.audio) {
            setIsModelSpeaking(true);
            if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
            speakingTimeoutRef.current = setTimeout(() => {
              setIsModelSpeaking(false);
            }, 1000);

            if (outputAudioCtxRef.current) {
              playAudioChunk(outputAudioCtxRef.current, msg.audio, scheduledTimeRef.current);
            }
          } else if (msg.type === 'interrupted') {
            setIsModelSpeaking(false);
            if (outputAudioCtxRef.current) {
              scheduledTimeRef.current.current = outputAudioCtxRef.current.currentTime;
            }
          } else if (msg.type === 'error') {
            setErrorMessage(msg.error || 'Live API encountered an error');
            setConnectionStatus('error');
          }
        } catch (e) {
          console.error('Error parsing live WS message:', e);
        }
      };

      ws.onerror = (err) => {
        console.error('Live WS error:', err);
        setErrorMessage('WebSocket connection failed');
        setConnectionStatus('error');
      };

      ws.onclose = () => {
        console.log('Live WS closed');
        setConnectionStatus('disconnected');
        setIsMicActive(false);
        setIsModelSpeaking(false);
      };

    } catch (err: any) {
      console.error('Failed to connect to Live API:', err);
      setErrorMessage(err.message || 'Microphone access denied or connection failed');
      setConnectionStatus('error');
    }
  };

  const startMicAudioProcessing = (audioCtx: AudioContext, stream: MediaStream, ws: WebSocket) => {
    const source = audioCtx.createMediaStreamSource(stream);
    const processor = audioCtx.createScriptProcessor(4096, 1, 1);
    source.connect(processor);
    processor.connect(audioCtx.destination);

    processor.onaudioprocess = (e) => {
      if (ws.readyState === WebSocket.OPEN) {
        const inputData = e.inputBuffer.getChannelData(0);
        const base64Audio = pcmToBase64(inputData);
        ws.send(JSON.stringify({ audio: base64Audio }));
      }
    };
  };

  const disconnectLive = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }
    setConnectionStatus('disconnected');
    setIsMicActive(false);
    setIsModelSpeaking(false);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(JSON.stringify({ text: textInput.trim() }));
    setConversationLogs(prev => [
      ...prev,
      {
        sender: 'user',
        text: textInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setTextInput('');
  };

  const handleQuickTopic = (topic: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ text: topic }));
    setConversationLogs(prev => [
      ...prev,
      {
        sender: 'user',
        text: topic,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-300">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Gemini Real-Time Voice Conversation</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">
                gemini-3.8-live
              </span>
            </div>
            <div className="text-xs text-indigo-300/80">
              Low-latency real-time voice streaming with natural conversation flow and interruption awareness.
            </div>
          </div>
        </div>

        {/* Live Status Indicator */}
        <div className="flex items-center gap-2">
          {connectionStatus === 'connected' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Connected
            </span>
          ) : connectionStatus === 'connecting' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold">
              <Loader2 className="w-3 h-3 animate-spin" />
              Connecting...
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-mono">
              Offline
            </span>
          )}
        </div>
      </div>

      {/* Main Studio Arena */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-8 max-w-3xl mx-auto shadow-2xl">
        {/* Animated Central Avatar / Orb */}
        <div className="relative flex items-center justify-center my-6">
          {/* Pulsing rings when model or user is active */}
          {(connectionStatus === 'connected' || isModelSpeaking) && (
            <>
              <div className={`absolute w-44 h-44 rounded-full border-2 transition-all duration-700 ${
                isModelSpeaking 
                  ? 'border-indigo-500/40 animate-ping' 
                  : 'border-emerald-500/20 animate-pulse'
              }`} />
              <div className={`absolute w-36 h-36 rounded-full border border-indigo-400/30 ${
                isModelSpeaking ? 'animate-pulse' : ''
              }`} />
            </>
          )}

          {/* Central Orb Button */}
          <div className={`relative w-28 h-28 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
            connectionStatus === 'connected'
              ? isModelSpeaking
                ? 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-500 scale-105 shadow-indigo-500/50'
                : 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/30'
              : connectionStatus === 'connecting'
              ? 'bg-amber-600/80 animate-pulse'
              : 'bg-slate-800 border-2 border-slate-700 text-slate-500'
          }`}>
            {connectionStatus === 'connected' ? (
              isModelSpeaking ? (
                <Volume2 className="w-12 h-12 text-white animate-bounce" />
              ) : (
                <Mic className="w-12 h-12 text-white animate-pulse" />
              )
            ) : connectionStatus === 'connecting' ? (
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            ) : (
              <PhoneCall className="w-10 h-10 text-slate-400" />
            )}
          </div>
        </div>

        {/* State Label & Guidance */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold font-display text-white">
            {connectionStatus === 'connected'
              ? isModelSpeaking
                ? 'Gemini is speaking...'
                : 'Listening to you... (Speak anytime)'
              : connectionStatus === 'connecting'
              ? 'Establishing secure Live audio channel...'
              : 'Start Real-Time Voice Conversation'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {connectionStatus === 'connected'
              ? 'Speak naturally at any time. You can interrupt Gemini just like a real person by talking over it.'
              : 'Click below to start an interactive voice conversation with Gemini 3.8 Live.'}
          </p>
        </div>

        {/* Dynamic Sound Wave Animation */}
        {connectionStatus === 'connected' && (
          <div className="flex items-center justify-center gap-1.5 h-10">
            {[20, 50, 80, 40, 95, 60, 100, 75, 45, 85, 30, 90, 50, 70, 35].map((val, idx) => (
              <div
                key={idx}
                className={`w-1 rounded-full transition-all duration-200 ${
                  isModelSpeaking 
                    ? 'bg-indigo-400 animate-pulse' 
                    : 'bg-emerald-400'
                }`}
                style={{
                  height: isModelSpeaking ? `${val}%` : `${Math.max(15, val * 0.35)}%`,
                  animationDelay: `${idx * 80}ms`
                }}
              />
            ))}
          </div>
        )}

        {/* Connection Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          {connectionStatus === 'connected' ? (
            <button
              type="button"
              onClick={disconnectLive}
              className="py-3 px-8 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Voice Call</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={connectLive}
              disabled={connectionStatus === 'connecting'}
              className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Connect Voice Call (Live API)</span>
            </button>
          )}
        </div>

        {/* Quick Conversation Starter Chips */}
        {connectionStatus === 'connected' && (
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="text-[11px] font-mono text-slate-400">Ask or say something interesting:</div>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Calculate compound interest on $5,000 at 7% for 10 years",
                "Explain the theory of relativity simply",
                "Brainstorm 3 catchy names for an AI calculator tool",
                "What is the capital of Australia and what is the time there?"
              ].map((topic, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuickTopic(topic)}
                  className="text-xs px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all cursor-pointer"
                >
                  "{topic}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text Input Message Form */}
        {connectionStatus === 'connected' && (
          <form onSubmit={handleSendText} className="flex items-center gap-2 pt-2 max-w-lg mx-auto">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Or type a question to speak back..."
              className="flex-1 py-2 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!textInput.trim()}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
