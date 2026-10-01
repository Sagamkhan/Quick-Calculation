import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, GenerateVideosOperation, LiveServerMessage, Modality } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Generous body parsing limits for high-res images and recorded audio
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * 1 & 4. Veo Video Generation (Text-to-Video & Image-to-Video)
 * Model: veo-3.1-fast-generate-preview
 * Aspect Ratios: 16:9 or 9:16
 */
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt, aspectRatio = '16:9', imageBase64, imageMimeType = 'image/jpeg' } = req.body;
    if (!prompt && !imageBase64) {
      return res.status(400).json({ error: 'Prompt or image is required' });
    }

    const config: any = {
      numberOfVideos: 1,
      aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
    };

    const params: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'Animate this photo with smooth cinematic camera motion and vivid lighting',
      config
    };

    if (imageBase64) {
      params.image = {
        imageBytes: imageBase64,
        mimeType: imageMimeType
      };
    }

    const operation = await ai.models.generateVideos(params);
    res.json({ operationName: operation.name });
  } catch (error: any) {
    console.error('Error generating video:', error);
    res.status(500).json({ error: error.message || 'Video generation failed' });
  }
});

app.post('/api/video-status', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }
    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    res.json({ done: Boolean(updated.done), error: updated.error || null });
  } catch (error: any) {
    console.error('Error checking video status:', error);
    res.status(500).json({ error: error.message || 'Status check failed' });
  }
});

app.post('/api/video-download', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }
    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) {
      return res.status(404).json({ error: 'Video URI not found or video not ready' });
    }

    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': apiKey },
    });

    if (!videoRes.ok) {
      throw new Error(`Failed to fetch video: ${videoRes.statusText}`);
    }

    res.setHeader('Content-Type', 'video/mp4');
    const arrayBuffer = await videoRes.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    console.error('Error downloading video:', error);
    res.status(500).json({ error: error.message || 'Download failed' });
  }
});

/**
 * 2. Audio Transcription
 * Model: gemini-3.5-transcribe
 */
app.post('/api/transcribe-audio', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: audioBase64,
                mimeType
              }
            },
            {
              text: 'Transcribe this audio recording into clean, accurate text. Format with proper capitalization, paragraphs, and punctuation.'
            }
          ]
        }
      ]
    });

    res.json({ text: response.text || '' });
  } catch (error: any) {
    console.error('Error transcribing audio:', error);
    res.status(500).json({ error: error.message || 'Transcription failed' });
  }
});

/**
 * 3. Create & Edit Images
 * Model: gemini-3.1-flash-image-preview
 */
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, aspectRatio = '1:1', inputImageBase64, inputImageMimeType = 'image/jpeg' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const parts: any[] = [];
    if (inputImageBase64) {
      parts.push({
        inlineData: {
          data: inputImageBase64,
          mimeType: inputImageMimeType
        }
      });
    }
    parts.push({ text: prompt });

    const config: any = {};
    if (!inputImageBase64 && aspectRatio) {
      config.imageConfig = { aspectRatio };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: { parts },
      ...(Object.keys(config).length > 0 ? { config } : {})
    });

    let imageUrl = null;
    let text = '';
    const partsArray = response.candidates?.[0]?.content?.parts || [];
    for (const part of partsArray) {
      if (part.inlineData?.data) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      } else if (part.text) {
        text += part.text;
      }
    }

    if (!imageUrl && !text) {
      return res.status(500).json({ error: 'No image or text returned from model' });
    }

    res.json({ imageUrl, text });
  } catch (error: any) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: error.message || 'Image generation failed' });
  }
});

/**
 * 5. Voice Conversations (Live API)
 * Model: gemini-3.8-live
 */
const wss = new WebSocketServer({ server, path: '/api/live-ws' });

wss.on('connection', async (clientWs) => {
  console.log('[Live API] Client connected to WebSocket');
  let session: any = null;

  try {
    session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
        },
        systemInstruction: 'You are Quick Calculator Live Assistant, an intelligent, helpful, and concise conversational AI assistant. You help users with calculations, writing, brainstorming, and technical problem-solving. Answer questions directly, concisely, and warmly.'
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'audio', audio }));
          }
          if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'interrupted' }));
          }
        },
        onclose: () => {
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ type: 'closed' }));
          }
        }
      }
    });

    clientWs.send(JSON.stringify({ type: 'ready' }));

    clientWs.on('message', (data) => {
      try {
        const payload = JSON.parse(data.toString());
        if (payload.audio && session) {
          session.sendRealtimeInput({
            audio: { data: payload.audio, mimeType: 'audio/pcm;rate=16000' }
          });
        } else if (payload.text && session) {
          session.send({
            clientContent: {
              turns: [{ role: 'user', parts: [{ text: payload.text }] }],
              turnComplete: true
            }
          });
        }
      } catch (err) {
        console.error('[Live API] Error handling client message:', err);
      }
    });

    clientWs.on('close', () => {
      if (session) {
        try { session.close(); } catch (e) {}
      }
    });
  } catch (err: any) {
    console.error('[Live API] Connection error:', err);
    if (clientWs.readyState === WebSocket.OPEN) {
      clientWs.send(JSON.stringify({ type: 'error', error: err.message || 'Live API connection error' }));
    }
  }
});

// Vite middleware in dev or static files in production
const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
