import React, { useState } from 'react';
import { 
  Film, 
  Mic, 
  Sparkles, 
  Image as ImageIcon, 
  Radio, 
  Wand2, 
  Layers, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import VeoTextToVideo from './VeoTextToVideo';
import AudioTranscriber from './AudioTranscriber';
import ImageStudio from './ImageStudio';
import VeoImageToVideo from './VeoImageToVideo';
import LiveVoiceAssistant from './LiveVoiceAssistant';

export type AiStudioTab = 
  | 'text-to-video' 
  | 'transcribe-audio' 
  | 'create-edit-images' 
  | 'animate-photo-video' 
  | 'live-voice';

interface AiStudioHubProps {
  initialTab?: AiStudioTab;
  onGoHome?: () => void;
}

export default function AiStudioHub({ initialTab = 'text-to-video', onGoHome }: AiStudioHubProps) {
  const [activeTab, setActiveTab] = useState<AiStudioTab>(initialTab);

  const tabs = [
    {
      id: 'text-to-video' as AiStudioTab,
      name: 'Veo 3 Video from Text',
      model: 'veo-3.1-fast-generate-preview',
      icon: Film,
      color: 'from-indigo-500 to-purple-600',
      tag: 'Veo 3'
    },
    {
      id: 'transcribe-audio' as AiStudioTab,
      name: 'Audio Transcriber',
      model: 'gemini-3.5-transcribe',
      icon: Mic,
      color: 'from-blue-500 to-indigo-600',
      tag: 'Speech-to-Text'
    },
    {
      id: 'create-edit-images' as AiStudioTab,
      name: 'Create & Edit Images',
      model: 'gemini-3.1-flash-image-preview',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-600',
      tag: 'Nano Banana'
    },
    {
      id: 'animate-photo-video' as AiStudioTab,
      name: 'Animate Photos to Video',
      model: 'veo-3.1-fast-generate-preview',
      icon: Wand2,
      color: 'from-rose-500 to-amber-600',
      tag: 'Veo Motion'
    },
    {
      id: 'live-voice' as AiStudioTab,
      name: 'Real-Time Voice Assistant',
      model: 'gemini-3.8-live',
      icon: Radio,
      color: 'from-emerald-500 to-teal-600',
      tag: 'Live API'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Studio Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/80 via-purple-950/60 to-slate-950 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Next-Gen Gemini & Veo Creative Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              AI Creative & Voice Studio
            </h1>
            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Explore 5 Google DeepMind & Gemini tools: Generate cinematic Veo 3 videos, transcribe live speech, generate & edit high-resolution images, animate photos into video, and converse with real-time Gemini Live voice.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-mono flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Server-Side GenAI SDK</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-mono flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Secure Key Proxy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.name}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-500'
              }`}>
                {tab.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Studio View Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl">
        {activeTab === 'text-to-video' && <VeoTextToVideo onBack={onGoHome} />}
        {activeTab === 'transcribe-audio' && <AudioTranscriber onBack={onGoHome} />}
        {activeTab === 'create-edit-images' && <ImageStudio onBack={onGoHome} />}
        {activeTab === 'animate-photo-video' && <VeoImageToVideo onBack={onGoHome} />}
        {activeTab === 'live-voice' && <LiveVoiceAssistant onBack={onGoHome} />}
      </div>
    </div>
  );
}
