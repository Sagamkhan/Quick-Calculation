# Next-Gen AI Creative Studio Suite & Multimodal Engine

Integrate 5 cutting-edge generative AI capabilities into Quick Calculator powered by Google's latest Gemini and Veo models: Veo 3 text-to-video, Veo image animation to video, Gemini 3.1 Flash image generation and editing, Gemini 3.5 high-accuracy audio transcription, and Gemini 3.8 Live API real-time voice conversations.

## User Review & Critical Decisions

> [!IMPORTANT]
> The five generative features requested rely on specific Google GenAI models and capabilities:
> - **Generate Video from Text**: Veo 3 model `veo-3.1-fast-generate-preview` with configurable aspect ratio (`16:9` landscape and `9:16` portrait).
> - **Animate Images into Video**: Veo 3 model `veo-3.1-fast-generate-preview` taking an uploaded photo + optional motion prompt to render a video in `16:9` or `9:16`.
> - **Create & Edit Images**: Model `gemini-3.1-flash-image-preview` allowing prompt-based image creation and conversational editing with image references.
> - **Transcribe Audio**: Model `gemini-3.5-transcribe` accepting live microphone recordings or uploaded audio clips.
> - **Real-Time Voice Conversations**: Live API model `gemini-3.8-live` enabling bidirectional real-time audio interaction with zero latency.

- **Confirmed Decision 1 (Dual Access Pattern)**: Implement a unified **AI Creative Studio** hub (`#/ai-studio`) with tabbed workspaces, while also registering each of the 5 capabilities as individual, searchable tools in the main 250+ catalog under the `ai-tools` category.
- **Confirmed Decision 2 (Secure Server-Side Architecture)**: Build an Express backend (`server.ts`) hosting Vite middleware to securely execute all `@google/genai` calls server-side, protecting API credentials and supporting WebSocket streaming for the Live API.
- **Confirmed Decision 3 (Aspect Ratio & Media Controls)**: Video generators will default to `16:9` (landscape) with a toggle for `9:16` (portrait/shorts), featuring in-browser preview players, download actions, and progress indicators during asynchronous Veo rendering.

---

## 1. Overview & Core Concept

- **What It Does**: Transforms Quick Calculator into a comprehensive utilities platform that pairs computational tools with professional generative AI workflows:
  1. **Veo Text-to-Video**: Generates HD video clips directly from text descriptions.
  2. **Veo Image-to-Video**: Animates uploaded still photos into cinematic videos.
  3. **Gemini Image Studio**: Creates new graphics and modifies existing images using natural language prompts.
  4. **Microphone Audio Transcriber**: Records speech from the user's mic and returns accurate transcripts.
  5. **Live Voice Assistant**: Real-time two-way spoken conversation with Gemini Live API.
- **Target Audience**: Creators, professionals, students, and everyday users who need instant creative generation, media editing, and voice assistance alongside calculation tools.
- **Key Value**: 100% web-native, zero-configuration access to state-of-the-art video, audio, image, and voice intelligence in a sleek, responsive interface.

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **AI Studio Navigation**:
     - Users click the sparkling **AI Studio** button in the top navbar or select any of the 5 AI tools from the catalog.
     - A tabbed creative studio opens with dedicated panels: *Text to Video*, *Animate Photo*, *Image Studio*, *Audio Transcribe*, and *Live Voice Chat*.
  2. **Text to Video & Photo Animation (Veo 3)**:
     - User inputs a prompt (or uploads a reference photo for animation).
     - Selects aspect ratio (`16:9` Widescreen vs `9:16` Portrait Shorts).
     - Clicks "Generate Video". An animated progress monitor displays live status messages while polling the operation.
     - Upon completion, an embedded HTML5 video player appears with playback controls, looping, and a direct MP4 download button.
  3. **Image Studio (Create & Edit)**:
     - User enters a prompt to generate a new image, or uploads an image and describes changes (e.g. "Add a glowing neon aura", "Change background to cyberpunk city").
     - Renders preview with aspect ratio selector (`1:1`, `16:9`, `9:16`, `4:3`, `3:4`), instant full-resolution preview modal, and PNG download.
  4. **Audio Transcription**:
     - User clicks "Start Recording" to speak into the microphone (or uploads a voice memo).
     - Shows visual audio waveform during recording.
     - On completion, `gemini-3.5-transcribe` returns the text transcript with copy-to-clipboard, export as TXT/PDF, and word count statistics.
  5. **Live Voice Conversation**:
     - User clicks "Start Voice Conversation" to connect to `gemini-3.8-live`.
     - An interactive pulsing glowing orb reflects live audio amplitude.
     - Supports natural backchanneling and interruptions with real-time audio playback.
- **Visual Identity**:
  - Deep dark-mode aesthetic with vibrant indigo, purple, and rose neon gradients.
  - Glassmorphic panels, fluid micro-interactions, and clear feedback during AI processing states.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Stack Express Server (`server.ts`)**:
  - *Chosen Approach*: Convert the Vite dev setup to `"dev": "tsx server.ts"` running Express with Vite middlewares mounted in dev mode.
  - *Why*: `@google/genai` guidelines strictly require server-side execution with zero API key exposure to the browser. Additionally, the Live API requires WebSocket proxying.
  - *Alternatives Considered*: Client-side SDK calls — rejected as it violates system and security guidelines.
- **Decision 2: Asynchronous Veo Polling Pattern**:
  - *Chosen Approach*: The backend initiates `ai.models.generateVideos`, returns the operation ID to the frontend, and the frontend polls `/api/ai/video-status` every 5 seconds until `done: true`, then fetches the video via `/api/ai/video-download`.
  - *Why*: Video generation can take 30–90 seconds; asynchronous polling prevents HTTP gateway timeouts.
- **Decision 3: Dual Studio + Catalog Discovery**:
  - *Chosen Approach*: Both a unified `/ai-studio` workspace and standalone catalog tools (`/tools/veo-text-to-video`, `/tools/veo-image-to-video`, etc.).
  - *Why*: Provides power users with an all-in-one workstation while preserving discoverability in search and category browsing.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Frontend Client (React 19)                    │
│                                                                        │
│  ┌───────────────────────┐  ┌───────────────────────────────────────┐  │
│  │    Top Navbar CTA     │  │          Standalone Tools             │  │
│  │   "AI Studio" Sparkle │  │  (Searchable in 250+ Tool Catalog)    │  │
│  └───────────┬───────────┘  └───────────────────┬───────────────────┘  │
│              │                                  │                      │
│              ▼                                  ▼                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    AI Creative Studio Workspace                  │  │
│  │  [Veo Text-to-Video] [Veo Image-to-Video] [Image Studio]        │  │
│  │  [Audio Transcriber] [Gemini Live Voice Conversation]            │  │
│  └───────────────────┬──────────────────────────┬───────────────────┘  │
└──────────────────────┼──────────────────────────┼──────────────────────┘
                       │ HTTP REST (JSON/Blob)    │ WebSocket (PCM 16k/24k)
                       ▼                          ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Backend Server (server.ts)                      │
│                                                                        │
│  • Express API Endpoints:                                              │
│    - POST /api/ai/video-generate      (veo-3.1-fast-generate-preview)   │
│    - POST /api/ai/video-status        (operation status check)         │
│    - POST /api/ai/video-download      (binary MP4 streaming)           │
│    - POST /api/ai/transcribe          (gemini-3.5-transcribe)          │
│    - POST /api/ai/image-create-edit   (gemini-3.1-flash-image-preview) │
│  • WebSocket Endpoint:                                                 │
│    - WS /live                         (gemini-3.8-live bidirectional)  │
│  • Vite Middleware (HMR & client SPA serving)                          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ GoogleGenAI SDK (@google/genai)
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                           Google Gemini & Veo APIs                     │
│    • veo-3.1-fast-generate-preview                                     │
│    • gemini-3.1-flash-image-preview                                    │
│    • gemini-3.5-transcribe                                             │
│    • gemini-3.8-live                                                   │
└────────────────────────────────────────────────────────────────────────┘
```

- **Interactive State & Components**:
  - `server.ts`: Configures Express server, `@google/genai` client, API routes, and WebSocket server (`ws`).
  - `src/components/ai/AiStudioPage.tsx`: Full creative studio hub with interactive tabs and responsive layouts.
  - `src/components/ai/VeoVideoGenerator.tsx`: Text-to-video & image animation with prompt suggestions, aspect ratio toggles, progress status, and player.
  - `src/components/ai/GeminiImageStudio.tsx`: Text-to-image creation and image editing with canvas/upload and download options.
  - `src/components/ai/AudioTranscriber.tsx`: Web Audio API mic recording, waveform visualization, and transcript export.
  - `src/components/ai/LiveVoiceAssistant.tsx`: Real-time voice interaction with animated audio orb and mic/speaker stream handling.
  - `src/data/categoriesAndTools.ts`: Adds the 5 tools into the `ai-tools` category so they appear across search and catalog views.
