import { ToolItem } from './categoriesAndTools';

export interface AIToolConfig {
  id: string;
  indexNumber: string;
  title: string;
  description: string;
  badges: {
    isPopular?: boolean;
    isTrending?: boolean;
    difficulty: 'Easy' | 'Medium' | 'Advanced';
  };
  actions: {
    canCompare: boolean;
    isFavorite: boolean;
  };
  comparisonText: string;
  executionSpeed: string;
  category: 'AI Tools & Generators';
  categoryGradient: 'PURPLE / INDIGO';
  engineComponent: string;
}

export const AI_TOOLS: AIToolConfig[] = [
  {
    id: 'ai-1',
    indexNumber: '01',
    title: 'AI Prompt Optimizer & Studio',
    description: 'Refines rough prompts into high-performing, structured instructions for Claude, Gemini, and GPT-4.',
    badges: {
      isPopular: true,
      isTrending: true,
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: 'PromptBase ($10/mo)',
    executionSpeed: 'Instant (< 20ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-2',
    indexNumber: '02',
    title: 'ChatGPT Free Assistant Interface',
    description: 'Direct browser access to top conversational AI models for copywriting, coding, and brainstorming.',
    badges: {
      isPopular: true,
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: 'Jasper AI ($49/mo)',
    executionSpeed: 'Instant (< 25ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-3',
    indexNumber: '03',
    title: 'Claude 3.5 Sonnet Playground',
    description: 'Nuanced AI writing assistant suited for long-form research papers and complex code generation.',
    badges: {
      isTrending: true,
      difficulty: 'Medium'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: 'Copy.ai ($36/mo)',
    executionSpeed: 'Instant (< 25ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-4',
    indexNumber: '04',
    title: 'Google Gemini Workspace AI',
    description: 'Multimodal AI assistant with live Google Search integration for up-to-the-second web facts.',
    badges: {
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: 'Writesonic ($20/mo)',
    executionSpeed: 'Instant (< 20ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-5',
    indexNumber: '05',
    title: 'OpenSource HuggingChat Assistant',
    description: 'Open-source chat interface powered by Llama 3, Mistral, and DeepSeek models with zero tracking.',
    badges: {
      difficulty: 'Medium'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: 'Perplexity Pro ($20/mo)',
    executionSpeed: 'Instant (< 20ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-6',
    indexNumber: '06',
    title: 'Flux & Stable Diffusion Canvas Studio',
    description: 'Generates high-detail image prompts with fine-tuned lighting, composition, and engine parameters.',
    badges: {
      isPopular: true,
      difficulty: 'Advanced'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: 'Midjourney ($30/mo)',
    executionSpeed: 'Instant (< 30ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-7',
    indexNumber: '07',
    title: 'AI Text Humanizer & Detector Bypass',
    description: 'Rewrites AI-generated text into authentic, natural human phrasing that passes AI detection filters.',
    badges: {
      isPopular: true,
      isTrending: true,
      difficulty: 'Medium'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: 'Undetectable AI ($15/mo)',
    executionSpeed: 'Instant (< 35ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-8',
    indexNumber: '08',
    title: 'AI Viral Headline & Hook Generator',
    description: 'Generates high-converting headlines and opening hooks using proven copywriting frameworks.',
    badges: {
      isPopular: true,
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: 'CoSchedule ($29/mo)',
    executionSpeed: 'Instant (< 15ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-9',
    indexNumber: '09',
    title: 'AI Cold Email & Outreach Copywriter',
    description: 'Creates personalized cold email pitches, subject lines, and multi-step follow-up sequences.',
    badges: {
      isTrending: true,
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: 'Instantly ($37/mo)',
    executionSpeed: 'Instant (< 20ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-10',
    indexNumber: '10',
    title: 'AI Code Explainer & Bug Fixer',
    description: 'Analyzes code snippets across languages, explaining execution logic and providing one-click bug fixes.',
    badges: {
      isPopular: true,
      difficulty: 'Medium'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: 'GitHub Copilot ($10/mo)',
    executionSpeed: 'Instant (< 30ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-11',
    indexNumber: '11',
    title: 'YouTube Video Script & Hook Generator',
    description: 'Generates complete video scripts featuring retention-optimized intros, core beats, and call-to-actions.',
    badges: {
      isPopular: true,
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: 'VidIQ Pro ($19/mo)',
    executionSpeed: 'Instant (< 25ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-12',
    indexNumber: '12',
    title: 'Midjourney Parameter & Style Builder',
    description: 'Visual builder for Midjourney prompts with aspect ratio, stylize, chaos, and camera lens controls.',
    badges: {
      isTrending: true,
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: '100% Web Tool',
    executionSpeed: 'Instant (< 15ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-13',
    indexNumber: '13',
    title: 'AI Grammar Fixer & Tone Polisher',
    description: 'Fixes spelling and grammatical errors while adjusting content tone to Professional, Casual, or Persuasive.',
    badges: {
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: 'Grammarly Premium ($12/mo)',
    executionSpeed: 'Instant (< 20ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-14',
    indexNumber: '14',
    title: 'AI Product Description Writer',
    description: 'Writes compelling, SEO-rich product descriptions and feature bullet points for e-commerce listings.',
    badges: {
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: 'Copy.ai ($36/mo)',
    executionSpeed: 'Instant (< 20ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-15',
    indexNumber: '15',
    title: 'AI Bio & Social Profile Generator',
    description: 'Generates memorable, keyword-optimized bios tailored for LinkedIn, X/Twitter, and Instagram profiles.',
    badges: {
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: '100% Web Tool',
    executionSpeed: 'Instant (< 15ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-16',
    indexNumber: '16',
    title: 'AI Resume Bullet & Action Verb Enhancer',
    description: 'Rewrites generic resume duties into high-impact, quantifiable bullet points following the STAR method.',
    badges: {
      isPopular: true,
      difficulty: 'Medium'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: 'Rezi AI ($29/mo)',
    executionSpeed: 'Instant (< 25ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-17',
    indexNumber: '17',
    title: 'AI Article Outline & Content Brief Architect',
    description: 'Generates structured article outlines with H2/H3 heading hierarchies and primary keyword suggestions.',
    badges: {
      isTrending: true,
      difficulty: 'Medium'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: 'SurferSEO ($89/mo)',
    executionSpeed: 'Instant (< 25ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-18',
    indexNumber: '18',
    title: 'AI FAQ & Knowledge Base Generator',
    description: 'Scans raw text or product features to generate comprehensive, user-friendly FAQ question-and-answer pairs.',
    badges: {
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: '100% Web Tool',
    executionSpeed: 'Instant (< 20ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-19',
    indexNumber: '19',
    title: 'AI Story & Creative Plot Generator',
    description: 'Generates dynamic story concepts, character motivations, and multi-chapter narrative outlines.',
    badges: {
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: 'Sudowrite ($19/mo)',
    executionSpeed: 'Instant (< 30ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-20',
    indexNumber: '20',
    title: 'AI TL;DR Summarizer & Key Takeaways Extractor',
    description: 'Condenses articles, reports, and long transcripts into bulleted key insights and actionable takeaways.',
    badges: {
      isPopular: true,
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: '100% Web Tool',
    executionSpeed: 'Instant (< 20ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-21',
    indexNumber: '21',
    title: 'AI Paraphraser & Vocabulary Booster',
    description: 'Rephrases sentences to enhance clarity, avoid redundancy, and elevate lexical variety.',
    badges: {
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: 'QuillBot ($10/mo)',
    executionSpeed: 'Instant (< 20ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-22',
    indexNumber: '22',
    title: 'AI Ad Copy & Creative Variations Studio',
    description: 'Crafts multi-variant ad headlines, body copy, and CTA buttons optimized for Google and Meta Ads.',
    badges: {
      difficulty: 'Medium'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: 'AdCreative.ai ($29/mo)',
    executionSpeed: 'Instant (< 25ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-23',
    indexNumber: '23',
    title: 'AI Regex & SQL Query Builder',
    description: 'Translates plain conversational requests into syntax-validated Regex expressions and SQL queries.',
    badges: {
      difficulty: 'Advanced'
    },
    actions: {
      canCompare: true,
      isFavorite: false
    },
    comparisonText: '100% Web Tool',
    executionSpeed: 'Instant (< 20ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-24',
    indexNumber: '24',
    title: 'AI Token Counter & API Cost Estimator',
    description: 'Calculates exact token counts and estimates pricing across OpenAI, Anthropic, and Gemini API models.',
    badges: {
      isTrending: true,
      difficulty: 'Easy'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: '100% Web Tool',
    executionSpeed: 'Instant (< 15ms)',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  },
  {
    id: 'ai-25',
    indexNumber: '25',
    title: 'AI System Prompt & Persona Architect',
    description: 'Designs custom system instructions, behavioral guardrails, and role definitions for AI agents.',
    badges: {
      isPopular: true,
      difficulty: 'Advanced'
    },
    actions: {
      canCompare: true,
      isFavorite: true
    },
    comparisonText: 'LangChain Studio',
    executionSpeed: '1 min tool',
    category: 'AI Tools & Generators',
    categoryGradient: 'PURPLE / INDIGO',
    engineComponent: 'AiToolEngine'
  }
];

// Helper to convert AIToolConfig to standard ToolItem for the main app catalog
export const AI_CATALOG_TOOLS: ToolItem[] = AI_TOOLS.map((tool) => {
  const slug = tool.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  return {
    id: tool.id,
    slug: slug,
    number: `AI-${tool.indexNumber}`,
    name: tool.title,
    description: tool.description,
    category: 'ai-tools',
    complexity: tool.badges.difficulty,
    readTime: tool.executionSpeed.includes('min') ? '1 min' : 'Instant',
    isPopular: tool.badges.isPopular,
    isTrending: tool.badges.isTrending,
    freeAlternativeTo: tool.comparisonText,
    tags: [
      'AI Tool',
      'Generative AI',
      tool.title.split(' ')[0],
      'AI Generator'
    ],
    interactiveType: 'ai-prompt',
    rating: 4.9,
    useCount: `${(90 + parseInt(tool.indexNumber, 10) * 6).toFixed(1)}k`
  };
});
// Flagship Google GenAI & Veo 3 Studio tools permanently removed (paid billing required)
export const NEW_GENAI_FLAGSHIP_TOOLS: ToolItem[] = [];

