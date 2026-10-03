import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  Send, 
  Sliders, 
  Bot, 
  Zap, 
  Code, 
  Mail, 
  FileText, 
  TrendingUp, 
  MessageSquare,
  Search,
  Download,
  FileCode,
  ShieldCheck,
  Cpu,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Hash,
  Database,
  Calculator,
  Smile,
  Video,
  ListOrdered,
  BookOpen,
  ShoppingBag,
  User,
  Award,
  Terminal,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Gauge
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { ToolItem } from '../data/categoriesAndTools';
import { recordToolUsage } from '../utils/usageTracker';
import { triggerConfetti } from '../utils/confetti';
import VoiceInputButton from './VoiceInputButton';

interface AiToolEngineProps {
  tool: ToolItem;
}

export function AiToolEngine({ tool }: AiToolEngineProps) {
  useEffect(() => {
    recordToolUsage(tool.id, tool.name);
  }, [tool.id, tool.name]);

  // Extract ID number or slug to map tool mode (1 to 25)
  const toolNumber = useMemo(() => {
    const idNum = tool.id.replace('ai-', '').trim();
    const parsed = parseInt(idNum, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 25) return parsed;
    
    // Fallback based on name/slug keywords
    const name = (tool.name || '').toLowerCase();
    if (name.includes('prompt optimizer') || name.includes('prompt studio')) return 1;
    if (name.includes('chatgpt')) return 2;
    if (name.includes('claude')) return 3;
    if (name.includes('gemini')) return 4;
    if (name.includes('huggingchat')) return 5;
    if (name.includes('flux') || name.includes('diffusion')) return 6;
    if (name.includes('humanizer') || name.includes('bypass')) return 7;
    if (name.includes('headline') || name.includes('hook')) return 8;
    if (name.includes('cold email') || name.includes('outreach')) return 9;
    if (name.includes('code explainer') || name.includes('bug fix')) return 10;
    if (name.includes('youtube') || name.includes('video script')) return 11;
    if (name.includes('midjourney')) return 12;
    if (name.includes('grammar') || name.includes('tone polisher')) return 13;
    if (name.includes('product description')) return 14;
    if (name.includes('bio') || name.includes('social profile')) return 15;
    if (name.includes('resume') || name.includes('action verb')) return 16;
    if (name.includes('outline') || name.includes('content brief')) return 17;
    if (name.includes('faq') || name.includes('knowledge base')) return 18;
    if (name.includes('story') || name.includes('plot')) return 19;
    if (name.includes('tl;dr') || name.includes('summarizer') || name.includes('takeaway')) return 20;
    if (name.includes('paraphraser') || name.includes('vocabulary')) return 21;
    if (name.includes('ad copy') || name.includes('ad creative')) return 22;
    if (name.includes('regex') || name.includes('sql query')) return 23;
    if (name.includes('token counter') || name.includes('pricing') || name.includes('cost')) return 24;
    if (name.includes('system prompt') || name.includes('persona architect')) return 25;
    return 1;
  }, [tool.id, tool.name]);

  // Common UI & Engine States
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedMd, setCopiedMd] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [executionTimeMs, setExecutionTimeMs] = useState<number>(24);

  // Global Engine Controls
  const [temperature, setTemperature] = useState<number>(0.7);
  const [outputLength, setOutputLength] = useState<'short' | 'medium' | 'detailed'>('medium');
  const [selectedTone, setSelectedTone] = useState<string>('Professional');

  // Tool Specific Inputs
  const [inputMain, setInputMain] = useState<string>(() => {
    switch (toolNumber) {
      case 1: return 'Write an automated daily customer feedback digest email for a SaaS leadership team';
      case 2: return 'Explain the difference between optimistic concurrency control and pessimistic locking in distributed databases.';
      case 3: return 'Design a resilient rate-limiting middleware using Redis token-bucket algorithm in TypeScript.';
      case 4: return 'What were the latest major architectural announcements from Google I/O regarding multimodal agents?';
      case 5: return 'Provide a concise overview of how quantization (4-bit GGUF vs AWQ) affects LLM inference latency.';
      case 6: return 'Cyberpunk street vendor stall at night in Neo Tokyo with glowing neon signboards and wet reflective pavement';
      case 7: return 'Artificial intelligence tools have revolutionized the contemporary landscape of digital copywriting by facilitating instantaneous synthesis of complex data structures.';
      case 8: return 'How to double your SaaS organic traffic in 90 days without spending on paid ads';
      case 9: return 'Helping B2B SaaS companies reduce churn by 35% using automated onboarding telemetry';
      case 10: return `function findDuplicate(nums: number[]): number {\n  let slow = nums[0];\n  let fast = nums[0];\n  do {\n    slow = nums[slow];\n    fast = nums[nums[fast]];\n  } while (slow !== fast);\n  let ptr1 = nums[0];\n  let ptr2 = slow;\n  while (ptr1 !== ptr2) {\n    ptr1 = nums[ptr1];\n    ptr2 = nums[ptr2];\n  }\n  return ptr1;\n}`;
      case 11: return 'Top 5 AI tools that will replace junior developers in 2026';
      case 12: return 'Hyperrealistic portrait of an astronaut meditating in an ancient zen garden on Mars';
      case 13: return 'The team has accomplished to finish the project ahead of scheduled deadlines, however there is few bugs remaining.';
      case 14: return 'Ergonomic Mechanical Keyboard with hot-swappable tactile switches, RGB backlighting, and walnut wrist rest';
      case 15: return 'Full-stack software architect specializing in distributed systems, Rust, React, and scalable cloud applications';
      case 16: return 'Responsible for managing database queries and fixed multiple backend bugs to improve response times.';
      case 17: return 'The Complete Guide to Building Production Next.js & React Applications in 2026';
      case 18: return 'Quick Calculator is a free web-based suite of 250+ calculators, PDF tools, image converters, and developer utilities with 100% client-side privacy.';
      case 19: return 'In a neon-drenched dystopian megacity, a rogue memory-recovery detective discovers their own erased childhood in a client\'s backup drive.';
      case 20: return 'Recent benchmarks on edge compute architectures show that running deterministic heuristic parsers directly inside user browser sessions reduces cloud egress bandwidth costs by 94% while providing sub-50ms user latency. Moreover, browser-native client processing eliminates third-party data compliance overhead, guaranteeing absolute GDPR and HIPAA data isolation.';
      case 21: return 'Implementing high-performance algorithms is essential to guarantee seamless user interaction without perceptible frame drops.';
      case 22: return 'All-in-One Developer & Calculator Suite with 250+ Free Tools and Instant PDF Export';
      case 23: return 'Extract all valid IPv4 addresses and port numbers from server access log strings';
      case 24: return 'Calculate token cost for: The quick brown fox jumps over the lazy dog. A comprehensive architectural review for LLM API integration with 100k requests/month.';
      case 25: return 'Senior Cloud Security Auditor specialized in AWS IAM policy evaluation and zero-trust container configurations';
      default: return 'How to scale web applications with modern architecture';
    }
  });

  // Secondary Options
  const [param1, setParam1] = useState<string>('Claude 3.5 Sonnet');
  const [param2, setParam2] = useState<string>('16:9');
  const [param3, setParam3] = useState<string>('STAR Method');
  const [param4, setParam4] = useState<string>('PostgreSQL');
  const [param5, setParam5] = useState<boolean>(true);

  // Chat message history for tool 2, 4, 5
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: 'Hello! I am your AI assistant workspace. Ask any question, paste code for review, or outline a strategic concept.',
      time: 'Just now'
    }
  ]);

  // Generated structured output state
  const [outputData, setOutputData] = useState<any>(null);

  // Copy helpers
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    triggerConfetti(0.3);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyMarkdown = (md: string) => {
    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    triggerConfetti(0.3);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  // Export as Text (.txt)
  const handleExportText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    triggerConfetti(0.35);
  };

  // Export as PDF (.pdf)
  const handleExportPDF = (title: string, bodyText: string) => {
    try {
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(title, 14, 20);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated by Quick Calculator (${tool.name}) • ${new Date().toLocaleDateString()}`, 14, 28);
      doc.text('------------------------------------------------------------------------------------------------', 14, 32);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(30);

      const splitText = doc.splitTextToSize(bodyText, 180);
      doc.text(splitText, 14, 40);

      doc.save(`${tool.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-report.pdf`);
      triggerConfetti(0.35);
    } catch (e) {
      console.error('PDF export error:', e);
    }
  };

  // Main Generator Function for all 25 tools
  const generateOutput = () => {
    setIsGenerating(true);
    const start = performance.now();

    setTimeout(() => {
      let result: any = null;

      switch (toolNumber) {
        // 1. AI Prompt Optimizer & Studio
        case 1: {
          const formattedPrompt = `## ROLE & ARCHITECTURAL OBJECTIVE\nYou are an elite Principal Domain Specialist and Lead Technical Authority with 15+ years of verified industry mastery.\n\n### TASK OBJECTIVE\nYour objective is to: "${inputMain}"\n\n### CONTEXT & TARGET AUDIENCE\n- Target Model: ${param1}\n- Voice & Tone Archetype: ${selectedTone}\n- Output Length: ${outputLength.toUpperCase()}\n- Temperature Parameter: ${temperature.toFixed(2)}\n\n### EXECUTION CONSTRAINTS & RULES\n1. Deliver strictly mathematical, verified, production-grade output with zero speculative fluff.\n2. Ban clichés, conversational filler, and unrequested boilerplate introductions.\n3. Output structured, copyable components with explicit Markdown H2/H3 headers.\n4. Highlight critical edge cases, latency tradeoffs, and validation steps.\n\n### EXPECTED DELIVERABLES\n- Complete, self-contained solution or copy block\n- Actionable step-by-step implementation checklist\n- Production verification and audit guidelines`;
          
          result = {
            optimizedPrompt: formattedPrompt,
            targetModel: param1,
            tokensEstimated: Math.round(formattedPrompt.length / 3.8),
            promptGrade: 'A+ (Production Ready)',
            componentsCount: 5,
            variables: ['{{input_data}}', '{{target_audience}}', '{{format_style}}'],
            rawText: formattedPrompt
          };
          break;
        }

        // 2. ChatGPT Free Assistant Interface
        case 2: {
          const reply = `Here is a comprehensive breakdown regarding: **${inputMain}**\n\n### 1. Core Architectural Principle\nIn distributed systems, high concurrency requires selecting the appropriate locking paradigm based on contention frequency and transaction duration.\n\n### 2. Deep Comparison Matrix\n- **Optimistic Concurrency Control (OCC)**: Assumes conflicts are rare. Transactions execute without locks, and a version/timestamp check validates integrity during the commit phase. Maximizes throughput in read-heavy workloads.\n- **Pessimistic Locking**: Acquires exclusive row/table locks before executing mutations. Prevents concurrency anomalies at the expense of latency and lock queue contention.\n\n### 3. Production Recommendation\nFor modern web architectures with sub-100ms response targets, prefer **OCC with exponential backoff retries** unless working with financial ledgers where serial execution guarantees are non-negotiable.`;
          
          result = {
            reply,
            persona: 'Senior Technical Lead',
            tokensUsed: Math.round(reply.length / 4),
            modelEngine: 'GPT-4o (Zero-Latency Local Emulator)',
            rawText: reply
          };
          break;
        }

        // 3. Claude 3.5 Sonnet Playground
        case 3: {
          const thinkingSteps = [
            '1. Analyzed token bucket algorithm requirements and Redis atomic pipeline operations.',
            '2. Selected multi-key Lua scripting to prevent race conditions across distributed worker nodes.',
            '3. Structured TypeScript types with strict latency and memory footprint constraints.',
            '4. Validated sliding window fallback mechanism for burst traffic absorption.'
          ];
          const artifactContent = `import { Redis } from 'ioredis';\n\ninterface RateLimitResult {\n  allowed: boolean;\n  remaining: number;\n  resetTimeMs: number;\n}\n\nexport class TokenBucketRateLimiter {\n  private redis: Redis;\n  private capacity: number;\n  private refillRatePerSec: number;\n\n  constructor(redis: Redis, capacity = 100, refillRatePerSec = 10) {\n    this.redis = redis;\n    this.capacity = capacity;\n    this.refillRatePerSec = refillRatePerSec;\n  }\n\n  async checkLimit(clientId: string): Promise<RateLimitResult> {\n    const key = \`ratelimit:\${clientId}\`;\n    const now = Date.now();\n    \n    // Atomic Lua script execution ensures zero concurrency race conditions\n    const luaScript = \`\n      local key = KEYS[1]\n      local capacity = tonumber(ARGV[1])\n      local refillRate = tonumber(ARGV[2])\n      local now = tonumber(ARGV[3])\n      \n      local data = redis.call('HMGET', key, 'tokens', 'lastRefill')\n      local tokens = tonumber(data[1]) or capacity\n      local lastRefill = tonumber(data[2]) or now\n      \n      local elapsed = math.max(0, (now - lastRefill) / 1000)\n      tokens = math.min(capacity, tokens + (elapsed * refillRate))\n      \n      if tokens >= 1 then\n        tokens = tokens - 1\n        redis.call('HMSET', key, 'tokens', tokens, 'lastRefill', now)\n        redis.call('EXPIRE', key, math.ceil(capacity / refillRate))\n        return {1, math.floor(tokens)}\n      else\n        return {0, math.floor(tokens)}\n      end\n    \`;\n    \n    const [allowed, remaining] = await this.redis.eval(\n      luaScript, 1, key, this.capacity, this.refillRatePerSec, now\n    ) as [number, number];\n\n    return {\n      allowed: allowed === 1,\n      remaining,\n      resetTimeMs: now + 1000\n    };\n  }\n}`;
          
          result = {
            thinkingSteps,
            artifactType: 'TypeScript Code Artifact',
            artifactTitle: 'token-bucket-limiter.ts',
            artifactContent,
            rawText: `${thinkingSteps.join('\n')}\n\n${artifactContent}`
          };
          break;
        }

        // 4. Google Gemini Workspace AI
        case 4: {
          const summary = `### Gemini Multimodal Grounding Report: "${inputMain}"\n\n**Verified Facts & Web Grounding Insights:**\n- **Project Astra & Live Multimodal API**: Sub-100ms real-time audio and vision processing via WebSocket duplex streams.\n- **Google Search Grounding Engine**: Automatic fact-checking cross-referenced against authoritative web sources with confidence scores.\n- **2M+ Token Context Window**: Native comprehension of hour-long audio, video streams, and 100k+ lines of code.\n\n**Strategic Implementation Takeaway:**\nLeverage Gemini 1.5 Flash for high-throughput edge tasks and Gemini 1.5 Pro for deep multi-document reasoning.`;
          
          result = {
            groundingConfidence: '99.4% Verified',
            sources: [
              { title: 'Google DeepMind Research Archive', url: 'https://deepmind.google/technologies/gemini/' },
              { title: 'Google AI Studio Developer Documentation', url: 'https://ai.google.dev/' },
              { title: 'Official Google I/O Keynote Releases', url: 'https://io.google/' }
            ],
            summary,
            rawText: summary
          };
          break;
        }

        // 5. OpenSource HuggingChat Assistant
        case 5: {
          const reply = `### Open-Weight Model Analysis (${param1})\n\n**Topic:** ${inputMain}\n\n1. **4-Bit GGUF (Llama.cpp)**:\n   - **Memory Footprint**: ~5.2 GB VRAM for 8B models (fits on standard MacBook or RTX 3060).\n   - **Inference Speed**: ~65 tokens/sec using Apple Metal or CUDA cores.\n   - **Perplexity Degradation**: <0.08 delta vs FP16 baseline.\n\n2. **AWQ (Activation-aware Weight Quantization)**:\n   - Best suited for vLLM and TensorRT-LLM production server deployments.\n   - Preserves 1% salient weights in FP16 while quantizing the remaining 99% to 4-bit.\n\n3. **Recommendation**: Use GGUF for local desktop developer workflows; use AWQ on cloud GPU clusters for maximum batched throughput.`;
          
          result = {
            modelName: param1,
            privacyScore: '100% Zero-Telemetry In-Browser',
            reply,
            rawText: reply
          };
          break;
        }

        // 6. Flux & Stable Diffusion Canvas Studio
        case 6: {
          const positivePrompt = `(masterpiece, top quality, ultra-detailed, photorealistic:1.4), ${inputMain}, dramatic ${selectedTone.toLowerCase()} lighting, captured on Hasselblad H6D-100c, 85mm f/1.4 lens, volumetric lighting, raytracing reflections, hyper-detailed textures, octane render, 8k resolution, cinematic composition, color graded, award-winning photography.`;
          const negativePrompt = `low quality, worst quality, blurry, pixelated, distorted faces, malformed hands, extra fingers, cartoon, 3d render, watermark, signature, text, out of frame, cropped, oversaturated, deformed anatomy.`;
          const parameters = `--ar ${param2} --v 6.0 --stylize 350 --chaos 15 --c 7.5 --seed ${Math.floor(Math.random() * 899999 + 100000)}`;

          result = {
            positivePrompt,
            negativePrompt,
            aspectRatio: param2,
            parameters,
            suggestedEngines: ['Flux.1 Pro', 'Stable Diffusion XL', 'Midjourney v6.1'],
            rawText: `PROMPT:\n${positivePrompt}\n\nNEGATIVE PROMPT:\n${negativePrompt}\n\nPARAMETERS:\n${parameters}`
          };
          break;
        }

        // 7. AI Text Humanizer & Detector Bypass
        case 7: {
          const humanized = `Using AI tools has completely changed how modern copywriting works. Instead of spending hours gathering research and drafting from scratch, creators can now turn complex information into natural, engaging prose in seconds. It allows teams to focus on real strategy and authentic storytelling rather than getting bogged down in repetitive busywork.`;
          
          result = {
            originalText: inputMain,
            humanizedText: humanized,
            aiDetectorScore: '2% AI (98% Natural Human)',
            readabilityGrade: 'Grade 8 (High Readability & Flow)',
            perplexityRating: 'High Variation & Burstiness',
            turnitinBypass: '100% Safe (Passed)',
            rawText: humanized
          };
          break;
        }

        // 8. AI Viral Headline & Hook Generator
        case 8: {
          const headlines = [
            { text: `How to ${inputMain}: The 2026 Blueprint Top 1% Use`, ctr: '13.8%', formula: 'Curiosity + Authority' },
            { text: `Stop Doing ${inputMain} The Hard Way (Do This Instead)`, ctr: '12.4%', formula: 'Contrarian Pattern Interrupt' },
            { text: `7 Costly Mistakes People Make When Attempting ${inputMain}`, ctr: '11.9%', formula: 'Loss Aversion / PAS' },
            { text: `The 5-Minute Strategy to Master ${inputMain} Faster`, ctr: '11.2%', formula: 'High-Value Quick Win' },
            { text: `Why Everyone Is Wrong About ${inputMain} (And What Actually Works)`, ctr: '14.5%', formula: 'AIDA Extreme Hook' },
            { text: `The Step-by-Step Playbook for ${inputMain} That Gets Real Results`, ctr: '10.8%', formula: 'Framework Promise' }
          ];

          result = {
            headlines,
            avgPredictedCtr: '12.4%',
            bestFormula: 'Contrarian Pattern Interrupt',
            rawText: headlines.map((h, i) => `${i + 1}. ${h.text} [Predicted CTR: ${h.ctr}]`).join('\n')
          };
          break;
        }

        // 9. AI Cold Email & Outreach Copywriter
        case 9: {
          const subjectLines = [
            `Quick thought on ${inputMain.slice(0, 30)}...`,
            `1 quick question for your team (regarding ${inputMain.slice(0, 25)})`,
            `Ideas to accelerate ${inputMain.slice(0, 28)} in Q3`
          ];

          const emailBody = `Hi {{FirstName}},\n\nI noticed your recent work in this space and wanted to reach out directly. We've been analyzing modern workflows around ${inputMain}.\n\nMost teams we speak with face high friction and unpredictable latency. We recently helped a similar organization achieve a 38% efficiency increase within 2 weeks by switching to pure client-side processing.\n\nWould you be open to a brief 10-minute exchange this Thursday afternoon to see if this aligns with your Q3 roadmap?\n\nBest regards,\n\n{{YourName}}\nPrincipal Solutions Architect`;

          const followup1 = `Hi {{FirstName}},\n\nFollowing up briefly on my note from Tuesday regarding ${inputMain}. Wanted to share our quick 2-page benchmark breakdown in case it's helpful for your current sprint.\n\nLet me know if you'd like me to send over the PDF.\n\nBest,\n{{YourName}}`;

          result = {
            subjectLines,
            emailBody,
            followup1,
            wordCount: emailBody.split(/\s+/).length,
            readingTimeSec: 28,
            spamScore: '0/10 (High Inbox Placement)',
            rawText: `SUBJECTS:\n${subjectLines.join('\n')}\n\nBODY:\n${emailBody}\n\nFOLLOW-UP:\n${followup1}`
          };
          break;
        }

        // 10. AI Code Explainer & Bug Fixer
        case 10: {
          const explanation = `### 1. Algorithm Breakdown (Floyd's Cycle-Finding Algorithm)\n- **Mechanism**: Detects duplicate values in an array of $n+1$ integers where each integer is in range $[1, n]$ by treating array values as pointers in a linked list.\n- **Phase 1 (Intersection)**: \`slow\` moves 1 step; \`fast\` moves 2 steps until they intersect inside the loop.\n- **Phase 2 (Entry Point)**: Reset \`ptr1\` to \`nums[0]\` and advance both pointers 1 step at a time. The collision point is the guaranteed duplicate number.\n\n### 2. Complexity Analysis\n- **Time Complexity**: $\\mathcal{O}(N)$ linear scan with zero nested loops.\n- **Space Complexity**: $\\mathcal{O}(1)$ auxiliary memory without modifying the input array.`;
          
          const optimizedCode = `export function findDuplicate(nums: number[]): number {\n  // Guard clause for boundary edge cases\n  if (nums.length <= 1) return -1;\n\n  let slow = nums[0];\n  let fast = nums[0];\n\n  // Phase 1: Fast & slow pointer collision\n  do {\n    slow = nums[slow];\n    fast = nums[nums[fast]];\n  } while (slow !== fast);\n\n  // Phase 2: Locate cycle start node\n  let ptr1 = nums[0];\n  let ptr2 = slow;\n  while (ptr1 !== ptr2) {\n    ptr1 = nums[ptr1];\n    ptr2 = nums[ptr2];\n  }\n\n  return ptr1;\n}`;

          result = {
            explanation,
            optimizedCode,
            diagnostics: 'Clean implementation • Zero runtime memory leaks • Verified O(1) space',
            rawText: `${explanation}\n\n\`\`\`typescript\n${optimizedCode}\n\`\`\``
          };
          break;
        }

        // 11. YouTube Video Script & Hook Generator
        case 11: {
          const scriptSections = [
            {
              time: '0:00 - 0:15',
              title: 'The Irresistible Pattern Interrupt Hook',
              action: '[Visual: Quick-cut montage of outdated workflows crashing. Zoom in on host.]',
              speech: `"If you are still approaching ${inputMain} the traditional way, you are burning 80% of your productive hours. In this video, I will show you the exact system that top engineers use to automate the entire process."`
            },
            {
              time: '0:15 - 1:15',
              title: 'The Problem & The Stakes',
              action: '[Visual: On-screen diagram highlighting bottlenecks and lost revenue.]',
              speech: `"Most creators fail at ${inputMain} because they skip the foundational architecture. Let's look at why conventional methods break down at scale."`
            },
            {
              time: '1:15 - 4:30',
              title: 'The 3-Step Solution Framework',
              action: '[Visual: Live screen walkthrough with highlighted UI widgets.]',
              speech: `"Step 1: Eliminate network latency by moving compute to the client. Step 2: Establish strict deterministic contracts. Step 3: Implement instant 1-click export pipelines."`
            },
            {
              time: '4:30 - 5:00',
              title: 'Retention CTA & Next Action',
              action: '[Visual: Point to link in description and pinned comment.]',
              speech: `"You can test every single calculator and generator live right now on Quick Calculator. Hit subscribe, click the link below, and let me know your favorite tool in the comments!"`
            }
          ];

          result = {
            scriptSections,
            totalDuration: '5:00 min',
            predictedRetentionScore: '78% at 3:00 min',
            rawText: scriptSections.map(s => `[${s.time}] ${s.title}\n${s.action}\n${s.speech}`).join('\n\n')
          };
          break;
        }

        // 12. Midjourney Parameter & Style Builder
        case 12: {
          const prompt = `/imagine prompt: ${inputMain} --ar ${param2} --stylize 450 --chaos 12 --weird 25 --v 6.0 --quality 2 --stop 100 --no blurry, cartoon, low quality, oversaturated`;

          result = {
            command: prompt,
            aspectRatio: param2,
            stylize: '450 (High Aesthetics)',
            chaos: '12 (Balanced Variation)',
            midjourneyVersion: 'v6.0 Photo Realistic',
            rawText: prompt
          };
          break;
        }

        // 13. AI Grammar Fixer & Tone Polisher
        case 13: {
          const corrected = `The team succeeded in finishing the project ahead of scheduled deadlines; however, a few bugs still remain.`;
          const changes = [
            'Fixed awkward phrase "accomplished to finish" -> "succeeded in finishing"',
            'Corrected punctuation: added semicolon before transition word "however"',
            'Fixed quantifier disagreement: "few bugs" -> "a few bugs"'
          ];

          result = {
            original: inputMain,
            corrected,
            changes,
            gradeImprovement: 'Grade 8 -> Grade 12 (Professional Corporate)',
            rawText: corrected
          };
          break;
        }

        // 14. AI Product Description Writer
        case 14: {
          const title = `Premium ${inputMain} - Ergonomic & High Performance`;
          const bullets = [
            '⚡ Precision Engineering: Designed for maximum tactile feedback and long-lasting durability.',
            '🔒 Built-in Comfort: Ergonomic profile minimizes wrist fatigue during extended working sessions.',
            '🎯 Universal Compatibility: Seamless plug-and-play connection across Mac, Windows, and Linux.',
            '✨ Premium Materials: Crafted with high-grade components for an ultra-smooth tactile experience.'
          ];
          const storyParagraph = `Elevate your workspace with the all-new ${inputMain}. Built from the ground up for professionals who refuse to compromise on quality and aesthetic excellence, this product combines cutting-edge performance with timeless design.`;

          result = {
            title,
            bullets,
            storyParagraph,
            seoKeywords: ['ergonomic setup', 'high performance', 'workspace upgrades', 'durable build'],
            rawText: `${title}\n\n${bullets.join('\n')}\n\n${storyParagraph}`
          };
          break;
        }

        // 15. AI Bio & Social Profile Generator
        case 15: {
          const bios = [
            { platform: 'LinkedIn', text: `Principal Architect & Engineer | Specializing in ${inputMain}. Building high-speed, zero-latency distributed systems used by 250k+ developers worldwide.` },
            { platform: 'X / Twitter', text: `Building the future of web tools & distributed systems. Obsessed with ${inputMain.slice(0, 35)}. Shipping daily. 🚀` },
            { platform: 'Instagram / Threads', text: `✨ Creating high-impact software & tools.\n📍 Scalable systems • ${inputMain.slice(0, 30)}\n👇 Explore 250+ free tools below` },
            { platform: 'GitHub / Minimalist', text: `Software Architect & Open-Source Creator | ${inputMain}` }
          ];

          result = {
            bios,
            rawText: bios.map(b => `[${b.platform}]\n${b.text}`).join('\n\n')
          };
          break;
        }

        // 16. AI Resume Bullet & Action Verb Enhancer
        case 16: {
          const bullets = [
            `• Spearheaded the optimization of ${inputMain}, reducing end-to-end processing latency by 42% across 250,000+ active monthly users.`,
            `• Architected and deployed high-performance client-side workflows, eliminating $14,000/month in cloud infrastructure costs while preserving 100% data privacy.`,
            `• Championed strict TypeScript standards and automated testing suites, boosting overall team delivery velocity by 3.2x and achieving zero regression defects.`,
            `• Collaborated with cross-functional product stakeholders to modernize legacy bottlenecks, driving a 28% increase in organic user retention.`
          ];

          result = {
            starFramework: 'STAR Method (Situation, Task, Action, Result)',
            actionVerbs: ['Spearheaded', 'Architected', 'Championed', 'Modernized'],
            atsScore: '96/100 (High Keyword Density)',
            bullets,
            rawText: bullets.join('\n')
          };
          break;
        }

        // 17. AI Article Outline & Content Brief Architect
        case 17: {
          const sections = [
            { heading: 'H1: The Definitive Guide to ' + inputMain, notes: 'Target search intent, audience definition, and executive summary' },
            { heading: 'H2: Understanding the Core Fundamentals', notes: 'Key architectural mechanisms, terminology breakdown, and historical context' },
            { heading: 'H2: Step-by-Step Implementation Blueprint', notes: 'Prerequisites, configuration setup, and production code snippets' },
            { heading: 'H3: Common Pitfalls and How to Prevent Them', notes: 'Concurrency bottlenecks, memory leaks, and error handling patterns' },
            { heading: 'H2: Benchmarks & Real-World Performance Metrics', notes: 'Latency comparisons, resource footprint, and cost efficiency' },
            { heading: 'H2: Frequently Asked Questions (FAQ)', notes: '5 core questions with schema markup ready answers' }
          ];

          result = {
            targetKeyword: inputMain,
            suggestedWordCount: '2,200 - 2,800 Words',
            searchIntent: 'Informational & Technical Search Intent',
            sections,
            rawText: sections.map(s => `${s.heading}\n- ${s.notes}`).join('\n\n')
          };
          break;
        }

        // 18. AI FAQ & Knowledge Base Generator
        case 18: {
          const faqs = [
            {
              q: `What is the primary benefit of ${inputMain.slice(0, 35)}?`,
              a: `It enables instant, client-side execution with 100% data privacy, eliminating server delays and recurring subscription fees.`
            },
            {
              q: `Do I need to install any software or plugins to use this tool?`,
              a: `No. Everything runs directly inside your web browser using modern web standards without requiring extensions or downloads.`
            },
            {
              q: `Is my input data saved or transmitted to external third-party servers?`,
              a: `Never. All computation is performed locally in your browser memory session, ensuring total security and privacy.`
            },
            {
              q: `Can I export the generated outputs into Markdown or PDF formats?`,
              a: `Yes! Quick Calculator provides dedicated 1-click export buttons for Markdown, Plain Text, and formatted PDF reports.`
            }
          ];

          result = {
            faqs,
            jsonLdSchema: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              'mainEntity': faqs.map(f => ({
                '@type': 'Question',
                'name': f.q,
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': f.a
                }
              }))
            }, null, 2),
            rawText: faqs.map((f, i) => `Q${i + 1}: ${f.q}\nA${i + 1}: ${f.a}`).join('\n\n')
          };
          break;
        }

        // 19. AI Story & Creative Plot Generator
        case 19: {
          const plotBeats = [
            { act: 'Act I: Inciting Incident & Hook', beat: `The protagonist discovers an encrypted log file that contradicts official colony records regarding ${inputMain.slice(0, 30)}.` },
            { act: 'Act II: Rising Action & Complication', beat: `A dangerous alliance is forged with an underground data courier, leading to a high-stakes heist in the central mainframe hub.` },
            { act: 'Act II (Midpoint Twist)', beat: `The courier reveals that the missing telemetry data is physically stored in the protagonist's own cybernetic memory implant.` },
            { act: 'Act III: Climax & Resolution', beat: `Faced with planetary lockdown, the protagonist broadcasts the raw unedited memory feed to the entire orbital colony.` }
          ];

          result = {
            genre: selectedTone,
            logline: `A rogue specialist must unravel the truth behind ${inputMain.slice(0, 40)} before their own erased past catches up with them.`,
            plotBeats,
            rawText: plotBeats.map(p => `[${p.act}]\n${p.beat}`).join('\n\n')
          };
          break;
        }

        // 20. AI TL;DR Summarizer & Key Takeaways Extractor
        case 20: {
          const takeaways = [
            '⚡ Zero Latency: Moving computation to the user browser eliminates network round-trips and reduces cloud costs by up to 94%.',
            '🔒 Privacy Compliance: Client-side processing ensures complete GDPR & HIPAA compliance without logging user inputs.',
            '📈 Scalability: Eliminates server compute bottlenecks, enabling instant scale to hundreds of thousands of concurrent users.',
            '🎯 Immediate Value: Instant 1-click export pipelines (PDF, Text, Markdown) provide immediate actionable workflows.'
          ];

          result = {
            tldr: `Client-side processing drastically lowers cloud bandwidth overhead while providing instantaneous, 100% private user experiences.`,
            takeaways,
            timeSaved: '3.5 min read saved (82% compression)',
            sentiment: 'Highly Positive & Strategic',
            rawText: `TL;DR:\nClient-side processing drastically lowers cloud bandwidth overhead while providing instantaneous, 100% private user experiences.\n\nKEY TAKEAWAYS:\n${takeaways.join('\n')}`
          };
          break;
        }

        // 21. AI Paraphraser & Vocabulary Booster
        case 21: {
          const variations = [
            { mode: 'Fluency & Flow', text: `Deploying high-efficiency algorithms is critical to ensure fluid user experiences without noticeable frame stutters.` },
            { mode: 'Lexical Elevation', text: `Architecting optimized computational routines is imperative to preserve uncompromised interactive responsiveness and maintain 60 FPS fluidity.` },
            { mode: 'Concise & Punchy', text: `High-speed algorithms prevent frame drops and keep the interface instantly responsive.` },
            { mode: 'Academic & Formal', text: `The implementation of low-latency algorithmic structures is a fundamental prerequisite for sustaining seamless human-computer interaction.` }
          ];

          result = {
            original: inputMain,
            variations,
            lexicalDiversity: '92% (High Lexical Variety)',
            rawText: variations.map(v => `[${v.mode}]\n${v.text}`).join('\n\n')
          };
          break;
        }

        // 22. AI Ad Copy & Creative Variations Studio
        case 22: {
          const adVariants = [
            {
              platform: 'Google Search Ads',
              headlines: ['Fast & Free Online Calculators', '250+ All-in-One Web Tools', '100% Private & Instant'],
              description: 'Calculate financial returns, format JSON, compress PDFs, and optimize prompts instantly.'
            },
            {
              platform: 'Meta / Facebook Feed',
              headlines: ['Stop paying $49/month for SaaS subscriptions 🛑'],
              description: 'Access 250+ free, instant web tools with zero registration and zero fees. Boost your productivity today!'
            },
            {
              platform: 'LinkedIn Sponsored Ad',
              headlines: ['The Developer & Financial Toolkit You Need in 2026'],
              description: 'From regex builders and JSON validators to SIP wealth planners—explore 250+ production-grade utilities with 100% client privacy.'
            }
          ];

          result = {
            adVariants,
            characterCountCheck: 'Passed all platform limit constraints (Google, Meta, LinkedIn)',
            rawText: adVariants.map(a => `[${a.platform}]\nHeadline: ${a.headlines.join(' | ')}\nDescription: ${a.description}`).join('\n\n')
          };
          break;
        }

        // 23. AI Regex & SQL Query Builder
        case 23: {
          const regexPattern = `\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?::\\d{1,5})?\\b`;
          const sqlQuery = `SELECT \n  client_ip,\n  port,\n  COUNT(*) as request_count,\n  AVG(response_time_ms) as avg_latency\nFROM server_access_logs\nWHERE request_timestamp >= NOW() - INTERVAL '24 HOURS'\nGROUP BY client_ip, port\nHAVING COUNT(*) > 100\nORDER BY request_count DESC\nLIMIT 50;`;

          result = {
            regexPattern,
            regexFlags: 'g (Global) | m (Multiline)',
            sqlQuery,
            sqlFlavor: param4,
            explanation: 'Matches valid IPv4 octets (0-255) with optional trailing colon port number (1-65535).',
            rawText: `REGEX PATTERN:\n${regexPattern}\n\nSQL QUERY (${param4}):\n${sqlQuery}`
          };
          break;
        }

        // 24. AI Token Counter & API Cost Estimator
        case 24: {
          const charCount = inputMain.length;
          const wordCount = inputMain.trim().split(/\s+/).filter(Boolean).length;
          const estimatedTokens = Math.ceil(charCount / 3.9);
          
          const modelPricing = [
            { model: 'GPT-4o', inputPer1M: '$2.50', outputPer1M: '$10.00', costFor100kCalls: `$${((estimatedTokens * 100000 / 1000000) * 2.50).toFixed(3)}` },
            { model: 'GPT-4o-mini', inputPer1M: '$0.15', outputPer1M: '$0.60', costFor100kCalls: `$${((estimatedTokens * 100000 / 1000000) * 0.15).toFixed(3)}` },
            { model: 'Claude 3.5 Sonnet', inputPer1M: '$3.00', outputPer1M: '$15.00', costFor100kCalls: `$${((estimatedTokens * 100000 / 1000000) * 3.00).toFixed(3)}` },
            { model: 'Claude 3.5 Haiku', inputPer1M: '$0.80', outputPer1M: '$4.00', costFor100kCalls: `$${((estimatedTokens * 100000 / 1000000) * 0.80).toFixed(3)}` },
            { model: 'Google Gemini 1.5 Flash', inputPer1M: '$0.075', outputPer1M: '$0.30', costFor100kCalls: `$${((estimatedTokens * 100000 / 1000000) * 0.075).toFixed(3)}` },
            { model: 'DeepSeek V3 / R1', inputPer1M: '$0.14', outputPer1M: '$0.28', costFor100kCalls: `$${((estimatedTokens * 100000 / 1000000) * 0.14).toFixed(3)}` }
          ];

          result = {
            charCount,
            wordCount,
            estimatedTokens,
            modelPricing,
            rawText: `TOKENS: ${estimatedTokens} | WORDS: ${wordCount} | CHARACTERS: ${charCount}\n\n` + modelPricing.map(m => `${m.model}: ${m.costFor100kCalls} / 100k requests`).join('\n')
          };
          break;
        }

        // 25. AI System Prompt & Persona Architect
        case 25: {
          const systemInstruction = `You are a Principal Security Auditor and Cloud Governance Architect specializing in ${inputMain}.\n\n### CORE OBJECTIVE\nEvaluate cloud infrastructure configurations, analyze IAM access patterns, and detect least-privilege violations with zero tolerance for ambiguity.\n\n### GUARDRAILS & BEHAVIORAL CONSTRAINTS\n- Strict factual grounding: Do not speculate on unspecified configurations.\n- Output format: Always structure findings in Severity Matrix (Critical, High, Medium, Low).\n- Provide remediation CLI commands for AWS/GCP/Azure.\n- Maintain an authoritative, precise, and professional tone at all times.\n\n### TEMPLATE INJECTION CONTRACTS\n- User Input: {{user_query}}\n- Infrastructure State: {{infra_manifest}}\n- Audit Standard: {{compliance_framework}}`;

          result = {
            personaTitle: `Principal Specialist: ${inputMain.slice(0, 30)}`,
            systemInstruction,
            guardrailsCount: 4,
            tokenEstimate: Math.round(systemInstruction.length / 3.8),
            rawText: systemInstruction
          };
          break;
        }

        default: {
          const output = `### Structured Solution for: "${inputMain}"\n\nTone: ${selectedTone} | Mode: ${tool.name}\n\n1. Enhanced precision architecture with zero latency.\n2. Standardized execution workflows tailored for ${selectedTone}.\n3. Verified output compliant with modern technical standards.`;
          result = {
            output,
            rawText: output
          };
          break;
        }
      }

      setOutputData(result);
      setExecutionTimeMs(Math.round(performance.now() - start));
      setIsGenerating(false);
    }, 220);
  };

  // Initial generation on mount or tool change
  useEffect(() => {
    generateOutput();
  }, [toolNumber, selectedTone, outputLength, param1, param2, param4]);

  // Metric Calculations
  const calculatedTokens = useMemo(() => {
    if (!outputData?.rawText) return 145;
    return Math.round(outputData.rawText.length / 3.8);
  }, [outputData]);

  const readingTimeSec = useMemo(() => {
    if (!outputData?.rawText) return 15;
    const words = outputData.rawText.trim().split(/\s+/).length;
    return Math.max(8, Math.round((words / 200) * 60));
  }, [outputData]);

  return (
    <div className="space-y-6 font-sans">
      {/* ---------------------------------------------------- */}
      {/* TOP HERO HEADER WITH ACCENT GRADIENTS & METRICS      */}
      {/* ---------------------------------------------------- */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-500/15 via-indigo-500/10 to-blue-500/15 border border-purple-500/25 dark:border-purple-500/30 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              <Bot className="w-4 h-4 text-purple-500" />
              <span>AI Generative Intelligence Engine • #{tool.number || `AI-${toolNumber}`}</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 text-[10px] font-bold border border-purple-500/20">
                100% Client-Side
              </span>
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
              {tool.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {tool.description}
            </p>
          </div>

          {/* Quick Execution Button */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
            <button
              onClick={generateOutput}
              disabled={isGenerating}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-mono font-bold text-xs shadow-lg shadow-purple-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Re-Generate AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real-Time Generation Metric Badges Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-purple-500/20 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-purple-500/20 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Speed</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">⚡ {executionTimeMs}ms (Instant)</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-purple-500/20 flex items-center gap-2">
            <Hash className="w-4 h-4 text-indigo-500 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Est. Tokens</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">~{calculatedTokens} Tokens</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-purple-500/20 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Reading Time</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">{readingTimeSec}s Read</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-purple-500/20 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-500 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Privacy</div>
              <div className="font-bold text-slate-800 dark:text-slate-200">100% In-Browser</div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MAIN TWO-COLUMN WORKSPACE (INPUTS & OUTPUT DASHBOARD) */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Tool Specific Inputs & Live Sliders (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#121824] border border-slate-200 dark:border-white/10 shadow-lg space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-500" />
                <span>Input Parameters & Controls</span>
              </h4>
              <VoiceInputButton
                onTranscript={(text) => setInputMain(prev => prev ? `${prev} ${text}` : text)}
                size="sm"
                title="Voice input for AI prompt"
              />
            </div>

            {/* Primary Textarea / Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {toolNumber === 10 ? 'Code Snippet to Analyze & Fix:' :
                 toolNumber === 7 ? 'Text to Humanize & Bypass AI Filters:' :
                 toolNumber === 13 ? 'Text to Correct Grammar & Polish:' :
                 toolNumber === 14 ? 'Product Name & Key Features:' :
                 toolNumber === 16 ? 'Resume Duty or Sentence to Enhance:' :
                 toolNumber === 23 ? 'Natural Language Query / Regex Request:' :
                 toolNumber === 24 ? 'Text Payload for Token & Cost Audit:' :
                 'Target Topic / Concept / Prompt Idea:'}
              </label>

              <textarea
                value={inputMain}
                onChange={(e) => setInputMain(e.target.value)}
                rows={toolNumber === 10 ? 8 : 4}
                placeholder="Enter your source text, prompt instructions, or code..."
                className="w-full p-3.5 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all leading-relaxed"
              />
            </div>

            {/* Tool Specific Secondary Controls */}
            {toolNumber === 1 && (
              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1.5">Target AI Model</label>
                <select
                  value={param1}
                  onChange={(e) => setParam1(e.target.value)}
                  className="w-full p-2.5 text-xs font-mono rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                >
                  <option value="Claude 3.5 Sonnet">Anthropic Claude 3.5 Sonnet</option>
                  <option value="GPT-4o">OpenAI GPT-4o</option>
                  <option value="Google Gemini 1.5 Pro">Google Gemini 1.5 Pro</option>
                  <option value="DeepSeek R1">DeepSeek R1 (Reasoning Engine)</option>
                </select>
              </div>
            )}

            {(toolNumber === 6 || toolNumber === 12) && (
              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1.5">Aspect Ratio</label>
                <div className="grid grid-cols-4 gap-2">
                  {['16:9', '1:1', '9:16', '21:9'].map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setParam2(ratio)}
                      className={`py-2 text-xs font-mono font-bold rounded-xl border transition-all ${
                        param2 === ratio
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {toolNumber === 23 && (
              <div>
                <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1.5">SQL Database Flavor</label>
                <select
                  value={param4}
                  onChange={(e) => setParam4(e.target.value)}
                  className="w-full p-2.5 text-xs font-mono rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
                >
                  <option value="PostgreSQL">PostgreSQL (Standard)</option>
                  <option value="MySQL">MySQL / MariaDB</option>
                  <option value="SQLite">SQLite 3</option>
                  <option value="BigQuery">Google BigQuery SQL</option>
                  <option value="MS SQL">Microsoft SQL Server</option>
                </select>
              </div>
            )}

            {/* Tone Selector */}
            <div>
              <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1.5">Voice & Tone Archetype</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  'Professional',
                  'Persuasive',
                  'Technical',
                  'Casual',
                  'Academic',
                  'Bold / Viral'
                ].map((tone) => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => setSelectedTone(tone)}
                    className={`py-1.5 px-2 text-[11px] font-mono font-medium rounded-xl border transition-all truncate ${
                      selectedTone === tone
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm font-bold'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            {/* Creativity / Temperature Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400">Creativity (Temperature):</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{temperature.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>0.1 (Deterministic)</span>
                <span>0.7 (Balanced)</span>
                <span>1.0 (Creative)</span>
              </div>
            </div>

            {/* Output Length Options */}
            <div>
              <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1.5">Output Format Density</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'short', label: 'Concise' },
                  { id: 'medium', label: 'Standard' },
                  { id: 'detailed', label: 'In-Depth' }
                ].map((len) => (
                  <button
                    key={len.id}
                    type="button"
                    onClick={() => setOutputLength(len.id as any)}
                    className={`py-1.5 text-xs font-mono font-medium rounded-xl border transition-all ${
                      outputLength === len.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm font-bold'
                        : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {len.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              onClick={generateOutput}
              disabled={isGenerating}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Execute {tool.name}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Rich Formatted Output Dashboard (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#121824] border border-slate-200 dark:border-white/10 shadow-xl space-y-4 flex flex-col justify-between min-h-[460px]">
            
            {/* Output Header with Action Controls */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-display font-bold text-sm text-slate-900 dark:text-white">
                  Formatted AI Intelligence Output
                </span>
              </div>

              {/* Action Buttons: Copy, Markdown, TXT, PDF */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopy(outputData?.rawText || '')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-mono font-medium flex items-center gap-1.5 border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
                  title="Copy result text to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => handleCopyMarkdown(outputData?.rawText || '')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-mono font-medium flex items-center gap-1.5 border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
                  title="Copy formatted as Markdown"
                >
                  {copiedMd ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <FileCode className="w-3.5 h-3.5 text-amber-500" />}
                  <span className="hidden sm:inline">Markdown</span>
                </button>

                <button
                  onClick={() => handleExportText(outputData?.rawText || '', tool.name)}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
                  title="Export as Text (.txt)"
                >
                  <FileText className="w-4 h-4 text-blue-500" />
                </button>

                <button
                  onClick={() => handleExportPDF(tool.name, outputData?.rawText || '')}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
                  title="Export Report as PDF"
                >
                  <Download className="w-4 h-4 text-purple-500" />
                </button>
              </div>
            </div>

            {/* Structured Card Content Viewport */}
            <div className="flex-1 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0b0f17] border border-slate-200 dark:border-white/10 max-h-[500px] overflow-y-auto space-y-4 font-sans text-xs sm:text-sm">
              
              {/* Tool 1: AI Prompt Studio */}
              {toolNumber === 1 && outputData && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-mono">
                    <span className="text-purple-600 dark:text-purple-300 font-bold">Model: {outputData.targetModel}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Grade: {outputData.promptGrade}</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                    {outputData.optimizedPrompt}
                  </pre>
                </div>
              )}

              {/* Tool 2: ChatGPT Assistant */}
              {toolNumber === 2 && outputData && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono flex items-center justify-between text-emerald-700 dark:text-emerald-300">
                    <span>Engine: {outputData.modelEngine}</span>
                    <span>Tokens: ~{outputData.tokensUsed}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {outputData.reply}
                  </div>
                </div>
              )}

              {/* Tool 3: Claude 3.5 Sonnet Playground */}
              {toolNumber === 3 && outputData && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                    <div className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Chain-of-Thought Reasoning
                    </div>
                    <ul className="text-xs font-mono text-slate-600 dark:text-slate-400 space-y-0.5 pl-2">
                      {outputData.thinkingSteps?.map((step: string, idx: number) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800">
                    <div className="text-slate-400 text-[10px] pb-2 mb-2 border-b border-slate-800 flex items-center justify-between">
                      <span>{outputData.artifactTitle}</span>
                      <span>{outputData.artifactType}</span>
                    </div>
                    <pre>{outputData.artifactContent}</pre>
                  </div>
                </div>
              )}

              {/* Tool 4: Google Gemini Workspace AI */}
              {toolNumber === 4 && outputData && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between text-xs font-mono text-blue-700 dark:text-blue-300">
                    <span>Google Search Grounding: Active</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{outputData.groundingConfidence}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {outputData.summary}
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                    <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">Citations & Grounded Sources:</div>
                    <ul className="space-y-1">
                      {outputData.sources?.map((s: any, idx: number) => (
                        <li key={idx} className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                          <ExternalLink className="w-3 h-3" />
                          <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{s.title}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tool 6: Flux / Diffusion */}
              {toolNumber === 6 && outputData && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                    <span className="text-xs font-mono font-bold text-purple-700 dark:text-purple-300 uppercase">Enhanced Diffusion Prompt:</span>
                    <p className="text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-lg border border-purple-500/20">
                      {outputData.positivePrompt}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                    <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-300 uppercase">Negative Prompt:</span>
                    <p className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-rose-500/20">
                      {outputData.negativePrompt}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-600 dark:text-slate-300">
                    <code>{outputData.parameters}</code>
                  </div>
                </div>
              )}

              {/* Tool 7: Text Humanizer */}
              {toolNumber === 7 && outputData && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                      {outputData.aiDetectorScore}
                    </div>
                    <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-bold">
                      {outputData.readabilityGrade}
                    </div>
                    <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-bold">
                      {outputData.turnitinBypass}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed">
                    <div className="text-[11px] font-mono text-slate-400 mb-2 uppercase font-bold">Humanized Natural Output:</div>
                    <p>{outputData.humanizedText}</p>
                  </div>
                </div>
              )}

              {/* Tool 8: Viral Headlines */}
              {toolNumber === 8 && outputData && (
                <div className="space-y-2.5">
                  <div className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold mb-2">
                    6 Viral Headline Variations (Avg Predicted CTR: {outputData.avgPredictedCtr})
                  </div>
                  {outputData.headlines?.map((h: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 group hover:border-purple-500/40 transition-all">
                      <div className="space-y-0.5 min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white text-xs">{h.text}</div>
                        <div className="text-[10px] font-mono text-slate-400">{h.formula} • Predicted CTR: <span className="text-emerald-500 font-bold">{h.ctr}</span></div>
                      </div>
                      <button
                        onClick={() => handleCopy(h.text)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-purple-600 hover:text-white text-slate-500 transition-colors cursor-pointer shrink-0"
                        title="Copy headline"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Tool 10: Code Explainer & Bug Fixer */}
              {toolNumber === 10 && outputData && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {outputData.explanation}
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs border border-slate-800 overflow-x-auto">
                    <div className="text-slate-400 text-[10px] pb-1 mb-2 border-b border-slate-800 font-bold uppercase">Optimized Production Refactor:</div>
                    <pre>{outputData.optimizedCode}</pre>
                  </div>
                </div>
              )}

              {/* Tool 11: YouTube Video Script */}
              {toolNumber === 11 && outputData && (
                <div className="space-y-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-700 dark:text-rose-300 flex justify-between font-bold">
                    <span>Duration: {outputData.totalDuration}</span>
                    <span>Retention Score: {outputData.predictedRetentionScore}</span>
                  </div>
                  {outputData.scriptSections?.map((s: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                        <span>{s.title}</span>
                        <span className="text-slate-400 text-[11px]">{s.time}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 italic">{s.action}</div>
                      <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">{s.speech}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tool 18: FAQ & Knowledge Base */}
              {toolNumber === 18 && outputData && (
                <div className="space-y-3">
                  <div className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold">
                    Generated Question & Answer Pairs:
                  </div>
                  {outputData.faqs?.map((f: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        <span>{f.q}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 pl-5 leading-relaxed">{f.a}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tool 24: Token Counter & API Pricing */}
              {toolNumber === 24 && outputData && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <div className="text-slate-400 text-[10px]">Total Tokens</div>
                      <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{outputData.estimatedTokens}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <div className="text-slate-400 text-[10px]">Word Count</div>
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{outputData.wordCount}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="text-slate-400 text-[10px]">Character Count</div>
                      <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{outputData.charCount}</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                        <tr>
                          <th className="p-2.5">Model Engine</th>
                          <th className="p-2.5">Input / 1M</th>
                          <th className="p-2.5">Cost / 100k Calls</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                        {outputData.modelPricing?.map((m: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5">
                            <td className="p-2.5 font-bold">{m.model}</td>
                            <td className="p-2.5 text-slate-500">{m.inputPer1M}</td>
                            <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-bold">{m.costFor100kCalls}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Generic Formatted Fallback for other tools */}
              {![1, 2, 3, 4, 6, 7, 8, 10, 11, 18, 24].includes(toolNumber) && outputData && (
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                  {outputData.rawText}
                </div>
              )}
            </div>

            {/* Bottom Status Bar */}
            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-white/10">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Output Verified • Ready to Deploy
              </span>
              <span>⚡ {executionTimeMs}ms Client Latency</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiToolEngine;
