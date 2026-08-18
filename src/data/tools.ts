export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'ideas' | 'design' | 'graphs' | 'stock' | 'social' | 'analytics' | 'seo' | 'calculators';
  freeAlternativeTo: string;
  rating: number;
  url: string;
  tags: string[];
}

export const CATEGORIES = [
  { id: 'ideas', name: 'Ideas & Content', color: 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30' },
  { id: 'design', name: 'Design & Graphics', color: 'border-pink-500 text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/30' },
  { id: 'graphs', name: 'Charts & Graphs', color: 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30' },
  { id: 'stock', name: 'Stock & Assets', color: 'border-teal-500 text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30' },
  { id: 'social', name: 'Social & Hashtags', color: 'border-sky-500 text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30' },
  { id: 'analytics', name: 'Analytics & Speed', color: 'border-violet-500 text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30' },
  { id: 'seo', name: 'Marketing & SEO', color: 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30' },
  { id: 'calculators', name: 'Calculators & Tools', color: 'border-rose-500 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30' }
] as const;

export const TOOLS_DATA: Tool[] = [
  // === CATEGORY 1: IDEAS & CONTENT (32 tools) ===
  {
    id: "id-1",
    name: "ChatGPT (Free Tier)",
    description: "Highly capable conversational AI model for generating ideas, blog outlines, and copywriting.",
    category: "ideas",
    freeAlternativeTo: "Jasper AI ($49/mo)",
    rating: 4.8,
    url: "https://chatgpt.com",
    tags: ["AI Writer", "Ideation", "Copywriting"]
  },
  {
    id: "id-2",
    name: "Claude (Free)",
    description: "Exceptional writing assistant with high nuance, perfect for refining long-form content.",
    category: "ideas",
    freeAlternativeTo: "Copy.ai ($36/mo)",
    rating: 4.9,
    url: "https://claude.ai",
    tags: ["AI Writer", "Editing", "Brainstorming"]
  },
  {
    id: "id-3",
    name: "Gemini (Free)",
    description: "Google's direct-access AI with real-time web integration, great for content research.",
    category: "ideas",
    freeAlternativeTo: "Writesonic ($20/mo)",
    rating: 4.7,
    url: "https://gemini.google.com",
    tags: ["Research", "AI Writer", "Google"]
  },
  {
    id: "id-4",
    name: "Hemingway Editor",
    description: "Desktop and web app that highlights complex, long sentences and common errors.",
    category: "ideas",
    freeAlternativeTo: "ProWritingAid ($30/mo)",
    rating: 4.6,
    url: "https://hemingwayapp.com",
    tags: ["Editing", "Grammar", "Readability"]
  },
  {
    id: "id-5",
    name: "AnswerThePublic (Free Tier)",
    description: "Discovers what people ask on search engines, yielding direct content ideas.",
    category: "ideas",
    freeAlternativeTo: "BuzzSumo ($199/mo)",
    rating: 4.5,
    url: "https://answerthepublic.com",
    tags: ["Keywords", "Topic Ideas", "SEO"]
  },
  {
    id: "id-6",
    name: "Portent Idea Generator",
    description: "Enter a subject to generate catchy, high-click-through blog title recommendations.",
    category: "ideas",
    freeAlternativeTo: "Title generators ($15/mo)",
    rating: 4.4,
    url: "https://www.portent.com/tools/title-maker",
    tags: ["Headlines", "Content Ideas", "Blogging"]
  },
  {
    id: "id-7",
    name: "HubSpot Blog Ideas Generator",
    description: "Enter up to five nouns and receive a full week's worth of custom blog topic ideas.",
    category: "ideas",
    freeAlternativeTo: "Content calendars ($12/mo)",
    rating: 4.5,
    url: "https://www.hubspot.com/blog-topic-generator",
    tags: ["Ideation", "Blogging", "Strategy"]
  },
  {
    id: "id-8",
    name: "QuillBot (Free Tier)",
    description: "Excellent paraphrasing tool that helps restructure sentences while keeping context.",
    category: "ideas",
    freeAlternativeTo: "SpinBot Premium ($10/mo)",
    rating: 4.7,
    url: "https://quillbot.com",
    tags: ["Paraphraser", "Writing", "SEO"]
  },
  {
    id: "id-9",
    name: "Grammarly (Free)",
    description: "Real-time grammar checker, spelling checker, and basic tone detector extension.",
    category: "ideas",
    freeAlternativeTo: "Grammarly Premium ($12/mo)",
    rating: 4.6,
    url: "https://grammarly.com",
    tags: ["Grammar", "Chrome Ext", "Writing"]
  },
  {
    id: "id-10",
    name: "LanguageTool",
    description: "Open-source multilingual style and grammar checker supporting over 30 languages.",
    category: "ideas",
    freeAlternativeTo: "Grammarly Business ($15/mo)",
    rating: 4.8,
    url: "https://languagetool.org",
    tags: ["Open-Source", "Grammar", "Writing"]
  },
  {
    id: "id-11",
    name: "Coschedule Headline Analyzer",
    description: "Analyzes headline structure, word balance, and sentiment to predict conversion rate.",
    category: "ideas",
    freeAlternativeTo: "OptinMonster Analyzer ($9/mo)",
    rating: 4.5,
    url: "https://coschedule.com/headline-analyzer",
    tags: ["Headlines", "SEO", "Clickthrough"]
  },
  {
    id: "id-12",
    name: "Trello (Free Tier)",
    description: "Visual Kanban board for mapping out blog post pipelines and general content plans.",
    category: "ideas",
    freeAlternativeTo: "Asana Premium ($13/mo)",
    rating: 4.6,
    url: "https://trello.com",
    tags: ["Organization", "Kanban", "Workflow"]
  },
  {
    id: "id-13",
    name: "Notion (Free Tier)",
    description: "Flexible workspace to write, plan, organize, and store your editorial database.",
    category: "ideas",
    freeAlternativeTo: "Coda Paid ($12/mo)",
    rating: 4.9,
    url: "https://notion.so",
    tags: ["Database", "Editor", "Productivity"]
  },
  {
    id: "id-14",
    name: "Miro (Free Tier)",
    description: "Collaborative whiteboard, perfect for remote brainstorming sessions and mind mapping.",
    category: "ideas",
    freeAlternativeTo: "Lucidchart ($10/mo)",
    rating: 4.7,
    url: "https://miro.com",
    tags: ["Whiteboard", "Mind Map", "Brainstorm"]
  },
  {
    id: "id-15",
    name: "GitMind",
    description: "Free online mind mapping tool with elegant built-in structural design templates.",
    category: "ideas",
    freeAlternativeTo: "XMind ($8/mo)",
    rating: 4.5,
    url: "https://gitmind.com",
    tags: ["Mind Map", "Flowcharts", "Design"]
  },
  {
    id: "id-16",
    name: "MindMup",
    description: "Free, infinite-canvas mind map editor designed specifically for Google Drive storage.",
    category: "ideas",
    freeAlternativeTo: "MindMeister ($6/mo)",
    rating: 4.3,
    url: "https://www.mindmup.com",
    tags: ["Mind Map", "Google Drive", "Ideation"]
  },
  {
    id: "id-17",
    name: "Feedly (Free)",
    description: "Aggregates news, blogs, and trend alerts into a single custom reading dashboard.",
    category: "ideas",
    freeAlternativeTo: "Inoreader Pro ($8/mo)",
    rating: 4.4,
    url: "https://feedly.com",
    tags: ["RSS", "Content Curation", "Trends"]
  },
  {
    id: "id-18",
    name: "Pocket (Free)",
    description: "Saves high-quality reference articles and content inspirations for offline reading.",
    category: "ideas",
    freeAlternativeTo: "Instapaper Premium ($3/mo)",
    rating: 4.5,
    url: "https://getpocket.com",
    tags: ["Bookmarks", "Offline Reading", "Curation"]
  },
  {
    id: "id-19",
    name: "Airstory (Free)",
    description: "Clip research snippets from around the web to easily drag-and-drop into documents.",
    category: "ideas",
    freeAlternativeTo: "Scrivener ($59)",
    rating: 4.3,
    url: "https://www.airstory.co",
    tags: ["Research", "Clip Tool", "Writing"]
  },
  {
    id: "id-20",
    name: "Copywriting Prompts",
    description: "Generates hundreds of high-quality creative copywriting prompts to break writer's block.",
    category: "ideas",
    freeAlternativeTo: "PromptBase Paid ($5/ea)",
    rating: 4.4,
    url: "https://copywritingprompts.com",
    tags: ["Prompts", "Inspiration", "Writing"]
  },
  {
    id: "id-21",
    name: "Ahrefs Free AI Writer",
    description: "Simple AI generators for paragraph writing, introductions, outlines, and summaries.",
    category: "ideas",
    freeAlternativeTo: "Rytr Paid ($15/mo)",
    rating: 4.6,
    url: "https://ahrefs.com/writing-tools",
    tags: ["AI Writer", "Outlines", "SEO"]
  },
  {
    id: "id-22",
    name: "Substack (Free Hosting)",
    description: "Start a paid or free newsletter with unlimited subscribers and modern blog design.",
    category: "ideas",
    freeAlternativeTo: "Ghost Pro ($25/mo)",
    rating: 4.8,
    url: "https://substack.com",
    tags: ["Newsletter", "Publishing", "Writing"]
  },
  {
    id: "id-23",
    name: "Medium (Free Publishing)",
    description: "Publish your thoughts directly to an active reader community with built-in authority.",
    category: "ideas",
    freeAlternativeTo: "WordPress Managed ($15/mo)",
    rating: 4.5,
    url: "https://medium.com",
    tags: ["Blogging", "Publishing", "SEO"]
  },
  {
    id: "id-24",
    name: "ZenPen",
    description: "A minimalist web-based text editor built to filter out noise and support deep writing.",
    category: "ideas",
    freeAlternativeTo: "Ulysses ($6/mo)",
    rating: 4.4,
    url: "http://www.zenpen.io",
    tags: ["Minimalist", "Editor", "Distraction-Free"]
  },
  {
    id: "id-25",
    name: "Calmly Writer Online",
    description: "Elegant distractions-free web writing editor with formatting shortcuts and autosave.",
    category: "ideas",
    freeAlternativeTo: "Ia Writer ($29)",
    rating: 4.6,
    url: "https://www.calmlywriter.com/online",
    tags: ["Distraction-Free", "Editor", "Writing"]
  },
  {
    id: "id-26",
    name: "Obsidian (Free)",
    description: "A powerful, local-first markdown note-taking app that builds a private brain map.",
    category: "ideas",
    freeAlternativeTo: "Roam Research ($15/mo)",
    rating: 4.9,
    url: "https://obsidian.md",
    tags: ["Local Notes", "Markdown", "Wiki"]
  },
  {
    id: "id-27",
    name: "Joplin",
    description: "Open-source, secure note-taking app with end-to-end synchronization options.",
    category: "ideas",
    freeAlternativeTo: "Evernote Personal ($14/mo)",
    rating: 4.7,
    url: "https://joplinapp.org",
    tags: ["Open-Source", "Notes", "Sync"]
  },
  {
    id: "id-28",
    name: "DailyPage (Free Trial/Tier)",
    description: "Encourages writing habits by prompting you to write a default entry every morning.",
    category: "ideas",
    freeAlternativeTo: "750 Words ($5/mo)",
    rating: 4.3,
    url: "https://www.dailypage.co",
    tags: ["Journal", "Habit", "Writing"]
  },
  {
    id: "id-29",
    name: "Diffchecker",
    description: "Instantly compare two blocks of text to highlight structural edits and word differences.",
    category: "ideas",
    freeAlternativeTo: "Paid text comparison ($8/mo)",
    rating: 4.7,
    url: "https://www.diffchecker.com",
    tags: ["Diff Utility", "Editing", "Code"]
  },
  {
    id: "id-30",
    name: "TypeLit.io",
    description: "Practice your typing speed by typing out classic literature direct in the browser.",
    category: "ideas",
    freeAlternativeTo: "Typing Club Paid ($10/mo)",
    rating: 4.8,
    url: "https://www.typelit.io",
    tags: ["Typing", "EdTech", "Literature"]
  },
  {
    id: "id-31",
    name: "Buzzfeed Quiz Maker",
    description: "Create engaging viral web quizzes for audience lead generation completely free.",
    category: "ideas",
    freeAlternativeTo: "Interact Quiz Builder ($29/mo)",
    rating: 4.4,
    url: "https://www.buzzfeed.com/quizmaker",
    tags: ["Viral Quiz", "Lead Gen", "Marketing"]
  },
  {
    id: "id-32",
    name: "WordCounter",
    description: "Analyzes sentence length, word count, character count, and top keyword frequencies.",
    category: "ideas",
    freeAlternativeTo: "Desktop analysis tools ($19)",
    rating: 4.5,
    url: "https://wordcounter.net",
    tags: ["Writing Utilities", "Word Count", "SEO"]
  },

  // === CATEGORY 2: DESIGN & GRAPHICS (32 tools) ===
  {
    id: "id-33",
    name: "Figma (Free Starter)",
    description: "The gold standard for UI/UX design, wireframing, and interactive digital prototyping.",
    category: "design",
    freeAlternativeTo: "Sketch ($12/mo) / Adobe XD",
    rating: 4.9,
    url: "https://figma.com",
    tags: ["UI/UX", "Prototyping", "Vector"]
  },
  {
    id: "id-34",
    name: "Photopea",
    description: "Full browser-based clone of Photoshop that supports .PSD files and standard layers.",
    category: "design",
    freeAlternativeTo: "Adobe Photoshop ($22/mo)",
    rating: 4.8,
    url: "https://photopea.com",
    tags: ["Raster Editor", "Photoshop", "PSD"]
  },
  {
    id: "id-35",
    name: "GIMP",
    description: "Highly stable, open-source downloadable desktop image editor with advanced masking.",
    category: "design",
    freeAlternativeTo: "Adobe Photoshop ($263/yr)",
    rating: 4.5,
    url: "https://gimp.org",
    tags: ["Open-Source", "Raster Editor", "Desktop"]
  },
  {
    id: "id-36",
    name: "Inkscape",
    description: "Open-source professional vector editor comparable to Illustrator using standard SVG formatting.",
    category: "design",
    freeAlternativeTo: "Adobe Illustrator ($22/mo)",
    rating: 4.6,
    url: "https://inkscape.org",
    tags: ["Vector Editor", "Open-Source", "SVG"]
  },
  {
    id: "id-37",
    name: "Canva (Free Tier)",
    description: "Pre-made templates and simple interface for fast social media designs and pitch decks.",
    category: "design",
    freeAlternativeTo: "Canva Pro ($13/mo)",
    rating: 4.7,
    url: "https://canva.com",
    tags: ["Social Media", "Graphic Design", "Templates"]
  },
  {
    id: "id-38",
    name: "Coolors",
    description: "Lightning-fast color palette generator with beautiful export and sharing systems.",
    category: "design",
    freeAlternativeTo: "Adobe Color / Paid Palettes ($10)",
    rating: 4.8,
    url: "https://coolors.co",
    tags: ["Colors", "Palettes", "Contrast"]
  },
  {
    id: "id-39",
    name: "CSS Gradient",
    description: "Web tool to visualize, slide, and copy flawless multi-color CSS gradient code.",
    category: "design",
    freeAlternativeTo: "Gradient creators ($8/mo)",
    rating: 4.7,
    url: "https://cssgradient.io",
    tags: ["CSS Code", "Gradient", "Backgrounds"]
  },
  {
    id: "id-40",
    name: "CapCut (Free)",
    description: "Stunning browser-based and desktop video editing with high-end effects and automatic subtitles.",
    category: "design",
    freeAlternativeTo: "Adobe Premiere Pro ($22/mo)",
    rating: 4.8,
    url: "https://capcut.com",
    tags: ["Video Editor", "Reels", "Subtitles"]
  },
  {
    id: "id-41",
    name: "DaVinci Resolve (Free)",
    description: "Industry-leading professional color grading and Hollywood-grade offline video editor.",
    category: "design",
    freeAlternativeTo: "Adobe Premiere / Final Cut ($300)",
    rating: 4.9,
    url: "https://www.blackmagicdesign.com/products/davinciresolve",
    tags: ["Video Production", "Color Grading", "VFX"]
  },
  {
    id: "id-42",
    name: "Handbrake",
    description: "Open-source video transcoder to compress massive files to MP4/WebM safely.",
    category: "design",
    freeAlternativeTo: "Adobe Media Encoder ($20/mo)",
    rating: 4.8,
    url: "https://handbrake.fr",
    tags: ["Video Compression", "Transcoder", "Open-Source"]
  },
  {
    id: "id-43",
    name: "TinyPNG",
    description: "Smart lossy compression algorithms to shrink PNG and JPEG images for fast site speed.",
    category: "design",
    freeAlternativeTo: "Paid bulk compressors ($9/mo)",
    rating: 4.8,
    url: "https://tinypng.com",
    tags: ["Image Compressor", "Web Speed", "Optimization"]
  },
  {
    id: "id-44",
    name: "Remove.bg (Free)",
    description: "AI-based background removal utility. Fast, automated, and accurate.",
    category: "design",
    freeAlternativeTo: "Photoshop Lasso Tool / Paid API ($19/mo)",
    rating: 4.6,
    url: "https://remove.bg",
    tags: ["AI Bg Remover", "Image Editing", "Utilities"]
  },
  {
    id: "id-45",
    name: "Vectr",
    description: "Web and desktop 2D vector editor built with clean collaboration links.",
    category: "design",
    freeAlternativeTo: "Illustrator ($240/yr)",
    rating: 4.4,
    url: "https://vectr.com",
    tags: ["Vector Editor", "Browser", "Collaboration"]
  },
  {
    id: "id-46",
    name: "Krita",
    description: "Advanced painting and sketch application designed by artists, perfect for digital illustrators.",
    category: "design",
    freeAlternativeTo: "Corel Painter ($350) / Clip Studio",
    rating: 4.8,
    url: "https://krita.org",
    tags: ["Drawing", "Illustrations", "Open-Source"]
  },
  {
    id: "id-47",
    name: "Blender",
    description: "Stunning 3D pipeline suite for modeling, sculpting, animation, simulation, and render.",
    category: "design",
    freeAlternativeTo: "Autodesk Maya / 3ds Max ($225/mo)",
    rating: 4.9,
    url: "https://blender.org",
    tags: ["3D Modeling", "Animation", "VFX"]
  },
  {
    id: "id-48",
    name: "Spline (Free Tier)",
    description: "Easily design, animate, and export high-performance interactive 3D objects to web.",
    category: "design",
    freeAlternativeTo: "Cinema4D Paid ($94/mo)",
    rating: 4.8,
    url: "https://spline.design",
    tags: ["3D Web", "Animations", "UI/UX"]
  },
  {
    id: "id-49",
    name: "Fontshare",
    description: "A free-for-commercial-use professional typeface library curated by Indian Type Foundry.",
    category: "design",
    freeAlternativeTo: "Adobe Fonts ($15/mo) / Monotype",
    rating: 4.9,
    url: "https://fontshare.com",
    tags: ["Typography", "Fonts", "Branding"]
  },
  {
    id: "id-50",
    name: "Google Fonts",
    description: "Massive open-source, fast-loading, web-safe typography embedding CDN catalog.",
    category: "design",
    freeAlternativeTo: "Premium Web Fonts ($49/yr)",
    rating: 4.8,
    url: "https://fonts.google.com",
    tags: ["Fonts", "Google", "WebDev"]
  },
  {
    id: "id-51",
    name: "Scribe (Free Trial)",
    description: "Browser extension that records your clicks to instantly build beautiful how-to guides.",
    category: "design",
    freeAlternativeTo: "Snagit ($62)",
    rating: 4.7,
    url: "https://scribehow.com",
    tags: ["Documentation", "SaaS Guide", "Screencast"]
  },
  {
    id: "id-52",
    name: "OBS Studio",
    description: "Best open-source video streaming, gameplay recording, and screen capturing client.",
    category: "design",
    freeAlternativeTo: "Camtasia ($299) / Bandicam",
    rating: 4.9,
    url: "https://obsproject.com",
    tags: ["Screen Recorder", "Streaming", "Open-Source"]
  },
  {
    id: "id-53",
    name: "LottieFiles",
    description: "Find and customize lightweight interactive JSON vector animations for web UI.",
    category: "design",
    freeAlternativeTo: "Adobe After Effects ($22/mo)",
    rating: 4.7,
    url: "https://lottiefiles.com",
    tags: ["Lottie", "Animations", "UI/UX"]
  },
  {
    id: "id-54",
    name: "Squoosh",
    description: "Google's offline image compressor tool to preview and compress images side-by-side.",
    category: "design",
    freeAlternativeTo: "Paid desktop batchers ($25)",
    rating: 4.8,
    url: "https://squoosh.app",
    tags: ["Web Compression", "Squoosh", "Google"]
  },
  {
    id: "id-55",
    name: "Piktochart (Free Tier)",
    description: "Design-rich templates to build educational infographics and professional reports easily.",
    category: "design",
    freeAlternativeTo: "Infogram Premium ($19/mo)",
    rating: 4.4,
    url: "https://piktochart.com",
    tags: ["Infographics", "Templates", "Data Reports"]
  },
  {
    id: "id-56",
    name: "Haikei",
    description: "Generate gorgeous customizable SVG shapes, waves, blobs, and clean polygon backgrounds.",
    category: "design",
    freeAlternativeTo: "Paid vector asset makers ($12/mo)",
    rating: 4.8,
    url: "https://haikei.app",
    tags: ["SVG Generator", "Backgrounds", "UI/UX"]
  },
  {
    id: "id-57",
    name: "Veed.io (Free Tier)",
    description: "Web browser video editor with automated transcripts, clean subtitle cards, and text overlays.",
    category: "design",
    freeAlternativeTo: "Premium caption generators ($18/mo)",
    rating: 4.5,
    url: "https://veed.io",
    tags: ["Video Captions", "Browser Editing", "SaaS"]
  },
  {
    id: "id-58",
    name: "Screely",
    description: "Instantly turn plain web screenshots into a beautiful browser mockup frame window.",
    category: "design",
    freeAlternativeTo: "Paid mockup software ($10/mo)",
    rating: 4.6,
    url: "https://screely.com",
    tags: ["Mockups", "Screenshots", "Branding"]
  },
  {
    id: "id-59",
    name: "Neumorphism.io",
    description: "Generate clean shadow coordinates for soft Neumorphic visual CSS styling effects.",
    category: "design",
    freeAlternativeTo: "CSS shadow builders ($5)",
    rating: 4.5,
    url: "https://neumorphism.io",
    tags: ["Neumorphism", "CSS Code", "UI Shadows"]
  },
  {
    id: "id-60",
    name: "Mesh Gradient Generator",
    description: "Generate gorgeous 2D mesh, color blending, and fluid aesthetic vector background gradients.",
    category: "design",
    freeAlternativeTo: "Illustrator Mesh tool ($22/mo)",
    rating: 4.7,
    url: "https://meshgradient.in",
    tags: ["Gradients", "Mesh Gradient", "Aesthetics"]
  },
  {
    id: "id-61",
    name: "Brandfetch",
    description: "Instant brand assets library; copy official logo vectors, hex codes, and fonts.",
    category: "design",
    freeAlternativeTo: "Logo databases ($15/mo)",
    rating: 4.8,
    url: "https://brandfetch.com",
    tags: ["Logos", "Branding Assets", "API Search"]
  },
  {
    id: "id-62",
    name: "Tailwind CSS Play",
    description: "The official online playground sandbox to code, compile, and preview raw Tailwind CSS classes.",
    category: "design",
    freeAlternativeTo: "CodeSandbox Premium ($9/mo)",
    rating: 4.9,
    url: "https://play.tailwindcss.com",
    tags: ["Tailwind", "CSS Sandbox", "Prototyping"]
  },
  {
    id: "id-63",
    name: "Unscreen",
    description: "Instantly remove the backgrounds from video clips and GIFs 100% automatically.",
    category: "design",
    freeAlternativeTo: "After Effects Rotobrush ($22/mo)",
    rating: 4.4,
    url: "https://unscreen.com",
    tags: ["Video Bg Remover", "GIF Editing", "Utilities"]
  },
  {
    id: "id-64",
    name: "CleanPNG",
    description: "Exhaustive searchable directory of millions of pure transparent PNG stock cliparts.",
    category: "design",
    freeAlternativeTo: "Shutterstock PNGs ($29/mo)",
    rating: 4.5,
    url: "https://www.cleanpng.com",
    tags: ["PNG Stock", "Clipart", "No-Background"]
  },

  // === CATEGORY 3: CHARTS & GRAPHS (30 tools) ===
  {
    id: "id-65",
    name: "Recharts",
    description: "Redefined react-based composable charting library built with standard SVG layout.",
    category: "graphs",
    freeAlternativeTo: "FusionCharts ($499/yr)",
    rating: 4.8,
    url: "https://recharts.org",
    tags: ["React Charts", "SVG", "Open-Source"]
  },
  {
    id: "id-66",
    name: "Chart.js",
    description: "Simple yet highly flexible HTML5 Canvas chart layouts with responsive behaviors.",
    category: "graphs",
    freeAlternativeTo: "Highcharts Commercial ($150)",
    rating: 4.7,
    url: "https://www.chartjs.org",
    tags: ["Canvas Charts", "Vanilla JS", "Visuals"]
  },
  {
    id: "id-67",
    name: "D3.js",
    description: "The gold standard data-driven document manipulation graphing engine for custom visuals.",
    category: "graphs",
    freeAlternativeTo: "Tableau Enterprise ($75/mo)",
    rating: 4.9,
    url: "https://d3js.org",
    tags: ["D3 Data", "Advanced Graphing", "Open-Source"]
  },
  {
    id: "id-68",
    name: "Mermaid.js",
    description: "Markdown-like text definitions to auto-render complex flowcharts and diagrams.",
    category: "graphs",
    freeAlternativeTo: "Microsoft Visio ($15/mo)",
    rating: 4.8,
    url: "https://mermaid.js.org",
    tags: ["Flowcharts", "Markdown Layout", "Diagrams"]
  },
  {
    id: "id-69",
    name: "Excalidraw",
    description: "Stunning virtual whiteboard with a distinct organic hand-drawn visual style.",
    category: "graphs",
    freeAlternativeTo: "Balsamiq Wireframes ($9/mo)",
    rating: 4.9,
    url: "https://excalidraw.com",
    tags: ["Wireframing", "Whiteboard", "Hand-drawn"]
  },
  {
    id: "id-70",
    name: "Draw.io (diagrams.net)",
    description: "Complete free enterprise flowcharting and diagram maker syncing to Cloud drives.",
    category: "graphs",
    freeAlternativeTo: "Lucidchart ($9/mo)",
    rating: 4.7,
    url: "https://app.diagrams.net",
    tags: ["Flowcharts", "Diagrams", "Google Drive"]
  },
  {
    id: "id-71",
    name: "ApexCharts",
    description: "Modern SVG charting library with interactive legends, zoom filters, and beautiful gradients.",
    category: "graphs",
    freeAlternativeTo: "AnyChart Paid ($79)",
    rating: 4.6,
    url: "https://apexcharts.com",
    tags: ["SVG Charts", "Interactive", "Dashboard"]
  },
  {
    id: "id-72",
    name: "RawGraphs",
    description: "Open-source web tool to build complex, unique charts by dragging spreadsheet files.",
    category: "graphs",
    freeAlternativeTo: "Tableau Creator ($70/mo)",
    rating: 4.7,
    url: "https://rawgraphs.io",
    tags: ["Data Visuals", "CSV Drag", "Open-Source"]
  },
  {
    id: "id-73",
    name: "Flourish (Free Tier)",
    description: "Stunning animated data visualizations and racing bar chart builders.",
    category: "graphs",
    freeAlternativeTo: "Tableau Premium ($70/mo)",
    rating: 4.8,
    url: "https://flourish.studio",
    tags: ["Racing Charts", "Data Stories", "Presentations"]
  },
  {
    id: "id-74",
    name: "Datawrapper (Free)",
    description: "Create interactive, responsive, clean maps and charts for journalism projects.",
    category: "graphs",
    freeAlternativeTo: "Infogram Enterprise ($149/mo)",
    rating: 4.7,
    url: "https://www.datawrapper.de",
    tags: ["Journalism", "Maps", "Charts"]
  },
  {
    id: "id-75",
    name: "Google Looker Studio",
    description: "Connect your databases, Sheets, and AdWords to render dynamic custom business reports.",
    category: "graphs",
    freeAlternativeTo: "Microsoft PowerBI ($10/mo)",
    rating: 4.7,
    url: "https://lookerstudio.google.com",
    tags: ["Dashboards", "Google", "BI Analytics"]
  },
  {
    id: "id-76",
    name: "Vega-Lite",
    description: "A high-level declarative grammar of interactive visualization systems in JSON structures.",
    category: "graphs",
    freeAlternativeTo: "HighCharts Commercial ($150)",
    rating: 4.5,
    url: "https://vega.github.io/vega-lite",
    tags: ["Declarative", "JSON Schema", "Data Science"]
  },
  {
    id: "id-77",
    name: "Plotly.js",
    description: "Built on top of d3.js, specializes in complex scientific and 3D web visualizations.",
    category: "graphs",
    freeAlternativeTo: "MATLAB Web ($250/yr)",
    rating: 4.7,
    url: "https://plotly.com/javascript",
    tags: ["Scientific Charts", "3D Plotting", "Python Friendly"]
  },
  {
    id: "id-78",
    name: "Chartist.js",
    description: "Simple, responsive, lightweight SVG charting using CSS styling for all details.",
    category: "graphs",
    freeAlternativeTo: "Paid lightweight graph libraries ($19)",
    rating: 4.4,
    url: "https://gionkunz.github.io/chartist-js",
    tags: ["SVG Charts", "CSS Styled", "Lightweight"]
  },
  {
    id: "id-79",
    name: "Mapbox GL JS (Free Tier)",
    description: "Build custom high-performance vector-map graphics in the browser with custom styles.",
    category: "graphs",
    freeAlternativeTo: "ArcGIS Web ($500/yr)",
    rating: 4.8,
    url: "https://docs.mapbox.com/mapbox-gl-js",
    tags: ["Web Maps", "3D Terrain", "GIS"]
  },
  {
    id: "id-80",
    name: "Leaflet",
    description: "Incredibly lightweight, mobile-friendly open-source interactive mapping framework.",
    category: "graphs",
    freeAlternativeTo: "Google Maps Paid API",
    rating: 4.9,
    url: "https://leafletjs.com",
    tags: ["Maps API", "Mobile-Friendly", "Open-Source"]
  },
  {
    id: "id-81",
    name: "Gantt.io (Free Tier)",
    description: "Build visually beautiful, modern, color-coded project Gantt charts online.",
    category: "graphs",
    freeAlternativeTo: "Instagantt ($14/mo)",
    rating: 4.3,
    url: "https://gantt.io",
    tags: ["Gantt Chart", "Timeline", "Project Planning"]
  },
  {
    id: "id-82",
    name: "QuickChart.io",
    description: "An open-source API web service that renders chart images from plain HTTP URL parameters.",
    category: "graphs",
    freeAlternativeTo: "Image Charts Paid ($10/mo)",
    rating: 4.6,
    url: "https://quickchart.io",
    tags: ["Chart API", "Email Charts", "Utility"]
  },
  {
    id: "id-83",
    name: "Mindmeister (Free Tier)",
    description: "Elegant, cloud-based brain charting, mapping, and structural outline building.",
    category: "graphs",
    freeAlternativeTo: "XMind Cloud ($8/mo)",
    rating: 4.4,
    url: "https://www.mindmeister.com",
    tags: ["Mind Map", "Brainstorming", "Collaboration"]
  },
  {
    id: "id-84",
    name: "Vis.js",
    description: "Dynamic, browser-based network topology graphing and timeline visualization datasets.",
    category: "graphs",
    freeAlternativeTo: "Paid network mappers ($29/mo)",
    rating: 4.5,
    url: "https://visjs.org",
    tags: ["Network Graph", "Time series", "Canvas"]
  },
  {
    id: "id-85",
    name: "Chartify",
    description: "A fast, lightweight, zero-dependency bar, line, pie, and ring web chart builder.",
    category: "graphs",
    freeAlternativeTo: "Adobe Illustrator Graphs",
    rating: 4.2,
    url: "https://chartify.io",
    tags: ["Lightweight", "Fast Graphs", "Templates"]
  },
  {
    id: "id-86",
    name: "GeoJSON.io",
    description: "Rapidly draw and generate GeoJSON spatial coordinate geometries directly on a satellite map.",
    category: "graphs",
    freeAlternativeTo: "ArcGIS Desktop ($1500/yr)",
    rating: 4.8,
    url: "http://geojson.io",
    tags: ["GIS Utilities", "Map Drawing", "JSON Geo"]
  },
  {
    id: "id-87",
    name: "SankeyMATIC",
    description: "An incredible browser tool to map cash flows or data distributions into a Sankey Diagram.",
    category: "graphs",
    freeAlternativeTo: "Paid flow designers ($12/mo)",
    rating: 4.9,
    url: "https://sankeymatic.com",
    tags: ["Sankey Flow", "Budget Visual", "Charts"]
  },
  {
    id: "id-88",
    name: "UMLletino",
    description: "Free, online web-based tool to construct rapid UML software architecture charts.",
    category: "graphs",
    freeAlternativeTo: "Lucidchart UML ($9/mo)",
    rating: 4.4,
    url: "https://www.umlet.com/umletino/umletino.html",
    tags: ["UML Diagrams", "Software Architecture", "Flows"]
  },
  {
    id: "id-89",
    name: "Infogram (Free Starter)",
    description: "Excellent layout builder for reports, dynamic charts, and slide decks.",
    category: "graphs",
    freeAlternativeTo: "Infogram Premium ($19/mo)",
    rating: 4.4,
    url: "https://infogram.com",
    tags: ["Infographics", "Charts", "SaaS"]
  },
  {
    id: "id-90",
    name: "WordArt",
    description: "Generates stunning custom word-cloud shapes and cluster visual art pieces.",
    category: "graphs",
    freeAlternativeTo: "Paid visual clouds ($5)",
    rating: 4.5,
    url: "https://wordart.com",
    tags: ["Word Clouds", "Graphic Art", "Text Tools"]
  },
  {
    id: "id-91",
    name: "Billboard.js",
    description: "Easy-to-use reusable charting library based on D3.js v4+ with custom API handles.",
    category: "graphs",
    freeAlternativeTo: "HighCharts ($150)",
    rating: 4.6,
    url: "https://naver.github.io/billboard.js",
    tags: ["D3.js Charts", "Open-Source", "SaaS"]
  },
  {
    id: "id-92",
    name: "Witeboard",
    description: "Real-time collaborative drawing canvas; draw layouts with instant shape detection.",
    category: "graphs",
    freeAlternativeTo: "Miro Team ($10/mo)",
    rating: 4.5,
    url: "https://witeboard.com",
    tags: ["Collaboration Whiteboard", "Wireframe", "Utilities"]
  },
  {
    id: "id-93",
    name: "JSON Hero",
    description: "Clean, visual web-based JSON viewer that maps object trees into an interactive graph dashboard.",
    category: "graphs",
    freeAlternativeTo: "Paid JSON parsers ($5)",
    rating: 4.8,
    url: "https://jsonhero.io",
    tags: ["JSON Utility", "Trees", "Developer Tools"]
  },
  {
    id: "id-94",
    name: "Heptabase (Free Trial/Alternative: Logseq)",
    description: "Heptabase visual whiteboard system mapped to structural note nodes.",
    category: "graphs",
    freeAlternativeTo: "Heptabase ($10/mo)",
    rating: 4.7,
    url: "https://logseq.com",
    tags: ["Visual Wiki", "Mind Maps", "Open-Source"]
  },

  // === CATEGORY 4: STOCK RESOURCES (32 tools) ===
  {
    id: "id-95",
    name: "Unsplash",
    description: "Over 3 million ultra-high resolution, stunning stock photos shared by top photographers.",
    category: "stock",
    freeAlternativeTo: "Shutterstock Stock ($29/mo)",
    rating: 4.9,
    url: "https://unsplash.com",
    tags: ["Photos", "Royalty-Free", "HD Stock"]
  },
  {
    id: "id-96",
    name: "Pexels",
    description: "Massive library of beautiful commercial-use free stock photos and vertical stock videos.",
    category: "stock",
    freeAlternativeTo: "Getty Images ($150/img)",
    rating: 4.8,
    url: "https://pexels.com",
    tags: ["Videos", "Photos", "Stock"]
  },
  {
    id: "id-97",
    name: "Pixabay",
    description: "Over 4 million high-quality stock images, vectors, illustrations, sound effects, and music tracks.",
    category: "stock",
    freeAlternativeTo: "Adobe Stock ($30/mo)",
    rating: 4.7,
    url: "https://pixabay.com",
    tags: ["Vectors", "Audio", "Photos"]
  },
  {
    id: "id-98",
    name: "SVG Repo",
    description: "Search and download from over 500,000 commercial-use optimized SVG vector icons and graphics.",
    category: "stock",
    freeAlternativeTo: "The Noun Project Premium ($40/yr)",
    rating: 4.9,
    url: "https://svgrepo.com",
    tags: ["Vector Icons", "SVG", "Developer Assets"]
  },
  {
    id: "id-99",
    name: "Lucide Icons",
    description: "Beautiful, pixel-perfect open-source stroke icons library, community-run branch of Feather.",
    category: "stock",
    freeAlternativeTo: "FontAwesome Pro ($99/yr)",
    rating: 4.9,
    url: "https://lucide.dev",
    tags: ["React Icons", "SVGs", "Open-Source"]
  },
  {
    id: "id-100",
    name: "unDraw",
    description: "Constantly updated directory of aesthetic flat vector illustrations with instant hex-color match.",
    category: "stock",
    freeAlternativeTo: "Premium Adobe Vector illustrations ($15/ea)",
    rating: 4.8,
    url: "https://undraw.co/illustrations",
    tags: ["Illustrations", "Hex Color Code", "Flat Art"]
  },
  {
    id: "id-101",
    name: "Humaaans",
    description: "Mix and match illustrated human postures, heads, clothing, and body shapes in Figma or web.",
    category: "stock",
    freeAlternativeTo: "Paid avatar kits ($29)",
    rating: 4.7,
    url: "https://www.humaaans.com",
    tags: ["Avatars", "Vector Illustrations", "Character Kits"]
  },
  {
    id: "id-102",
    name: "Reshot",
    description: "Unique, non-generic stock illustrations and SVG icon packs created by individual designers.",
    category: "stock",
    freeAlternativeTo: "CreativeMarket Packs ($49)",
    rating: 4.6,
    url: "https://www.reshot.com",
    tags: ["Illustrations", "Icons", "SVG Pack"]
  },
  {
    id: "id-103",
    name: "ManyPixels (Free Assets)",
    description: "Download beautiful, minimalist flat and outline illustrations across business categories.",
    category: "stock",
    freeAlternativeTo: "ManyPixels SaaS Subscription ($549/mo)",
    rating: 4.5,
    url: "https://www.manypixels.co/gallery",
    tags: ["Illustrations", "Royalty-Free", "SVG Gallery"]
  },
  {
    id: "id-104",
    name: "OpenPeeps",
    description: "Hand-drawn illustration library of people cards to mix, match, and export vector characters.",
    category: "stock",
    freeAlternativeTo: "Paid hand-drawn libraries ($19)",
    rating: 4.7,
    url: "https://www.openpeeps.com",
    tags: ["Hand-drawn", "Vector Peeps", "Figma Kit"]
  },
  {
    id: "id-105",
    name: "Iconify",
    description: "Unified web framework interface that pulls from over 100 open-source vector icon libraries.",
    category: "stock",
    freeAlternativeTo: "Premium icons ($5/mo)",
    rating: 4.8,
    url: "https://iconify.design",
    tags: ["Icon Engine", "Web Frameworks", "SVG Icons"]
  },
  {
    id: "id-106",
    name: "Font Awesome (Free Tier)",
    description: "The internet's classic icon set and toolkit, providing thousands of web-safe solid and brand icons.",
    category: "stock",
    freeAlternativeTo: "Font Awesome Pro ($99/yr)",
    rating: 4.5,
    url: "https://fontawesome.com",
    tags: ["Web Icons", "Fonts", "CSS Frameworks"]
  },
  {
    id: "id-107",
    name: "Boxicons",
    description: "High-quality, simple web-safe vector icons designed for developers and custom designs.",
    category: "stock",
    freeAlternativeTo: "Paid icon packs ($15)",
    rating: 4.6,
    url: "https://boxicons.com",
    tags: ["Icons Pack", "Web SVGs", "Dev Assets"]
  },
  {
    id: "id-108",
    name: "Tabler Icons",
    description: "Over 4,200 pixel-perfect, highly responsive stroke vector icons with simple size slider.",
    category: "stock",
    freeAlternativeTo: "Paid stroke icons ($39)",
    rating: 4.9,
    url: "https://tabler-icons.io",
    tags: ["Stroke Icons", "Figma Assets", "React-ready"]
  },
  {
    id: "id-109",
    name: "Phosphor Icons",
    description: "Flexible, friendly stroke and filled icon family with multiple visual line weights.",
    category: "stock",
    freeAlternativeTo: "Paid UI libraries ($29)",
    rating: 4.8,
    url: "https://phosphoricons.com",
    tags: ["Line Weight", "UI Design", "Icon Set"]
  },
  {
    id: "id-110",
    name: "Free Music Archive",
    description: "High-quality, royalty-free audio tracks and background music under Creative Commons licenses.",
    category: "stock",
    freeAlternativeTo: "Epidemic Sound ($15/mo)",
    rating: 4.4,
    url: "https://freemusicarchive.org",
    tags: ["Audio Tracks", "Creative Commons", "Royalty-Free"]
  },
  {
    id: "id-111",
    name: "Incompetech",
    description: "Legendary repository of royalty-free background soundtrack scores created by Kevin MacLeod.",
    category: "stock",
    freeAlternativeTo: "AudioJungle ($15/track)",
    rating: 4.7,
    url: "https://incompetech.com",
    tags: ["Background Tracks", "Video Scores", "Royalty-Free"]
  },
  {
    id: "id-112",
    name: "Mixkit",
    description: "Stunning free templates, stock videos, high-fidelity sound effects, and music assets.",
    category: "stock",
    freeAlternativeTo: "Envato Elements ($16/mo)",
    rating: 4.8,
    url: "https://mixkit.co",
    tags: ["Video Templates", "Screencast SFX", "Soundtracks"]
  },
  {
    id: "id-113",
    name: "Freesound",
    description: "Massive collaborative community database of raw audio recordings, loops, and custom sound effects.",
    category: "stock",
    freeAlternativeTo: "Splice ($12/mo)",
    rating: 4.5,
    url: "https://freesound.org",
    tags: ["Sound Effects", "Audio Loops", "Community Run"]
  },
  {
    id: "id-114",
    name: "Burst (by Shopify)",
    description: "Stunning commercial stock image library tailored specifically for online store mockups.",
    category: "stock",
    freeAlternativeTo: "Getty Stock ($150)",
    rating: 4.6,
    url: "https://burst.shopify.com",
    tags: ["E-Commerce Photos", "Shopify Stock", "HD Image"]
  },
  {
    id: "id-115",
    name: "Kaboompics",
    description: "Gorgeously color-categorized high-fashion and aesthetic home-design stock photos.",
    category: "stock",
    freeAlternativeTo: "Stocksy Premium ($49/img)",
    rating: 4.7,
    url: "https://kaboompics.com",
    tags: ["Color Categorized", "Interior Design", "HD Photos"]
  },
  {
    id: "id-116",
    name: "Gratisography",
    description: "High-contrast, quirky, unique, and highly creative stock photos that stand out.",
    category: "stock",
    freeAlternativeTo: "Paid creative photography ($39/ea)",
    rating: 4.5,
    url: "https://gratisography.com",
    tags: ["Quirky Photos", "Creative Stock", "Aesthetic"]
  },
  {
    id: "id-117",
    name: "Foodiesfeed",
    description: "Stunning, high-resolution commercial-use culinary and mouth-watering food photos.",
    category: "stock",
    freeAlternativeTo: "Stock Food Premium ($150/img)",
    rating: 4.6,
    url: "https://www.foodiesfeed.com",
    tags: ["Food Photography", "Restaurant Assets", "HD Image"]
  },
  {
    id: "id-118",
    name: "StockSnap.io",
    description: "High-resolution stock photos with instant CC0 commercial use rights.",
    category: "stock",
    freeAlternativeTo: "Shutterstock Stock ($29/mo)",
    rating: 4.5,
    url: "https://stocksnap.io",
    tags: ["CC0 Photos", "HD Free", "Searchable"]
  },
  {
    id: "id-119",
    name: "Ouch! (by Icons8 Free Tier)",
    description: "Download beautifully curated tech and UI vector illustration assets in standard PNG format.",
    category: "stock",
    freeAlternativeTo: "Icons8 Subscription ($29/mo)",
    rating: 4.6,
    url: "https://icons8.com/illustrations",
    tags: ["UI Graphics", "SaaS Icons", "PNG Stocks"]
  },
  {
    id: "id-120",
    name: "Glaze (Free Tier)",
    description: "Unique corporate-memphis and abstract isometric design vector illustration assets.",
    category: "stock",
    freeAlternativeTo: "Premium custom illustrations ($25)",
    rating: 4.4,
    url: "https://www.glazestock.com",
    tags: ["Isometric", "Vector illustrations", "Tech Art"]
  },
  {
    id: "id-121",
    name: "Icons8 (Free Tier)",
    description: "Download thousands of consistent UI icons in matching visual styles and designs.",
    category: "stock",
    freeAlternativeTo: "Icons8 Premium ($19/mo)",
    rating: 4.5,
    url: "https://icons8.com",
    tags: ["Consistent Icons", "UI Packs", "PNG SVGs"]
  },
  {
    id: "id-122",
    name: "UI Faces",
    description: "Generate beautiful, diverse user avatar faces for mockup profiles and UI templates.",
    category: "stock",
    freeAlternativeTo: "Paid avatar generators ($5)",
    rating: 4.7,
    url: "https://uifaces.co",
    tags: ["Avatars", "UI Mockups", "Profile Photos"]
  },
  {
    id: "id-123",
    name: "This Person Does Not Exist",
    description: "AI-generated photorealistic face pictures created dynamically using generative networks.",
    category: "stock",
    freeAlternativeTo: "Mock profile costs ($5)",
    rating: 4.6,
    url: "https://thispersondoesnotexist.com",
    tags: ["AI Faces", "Mock Profiles", "Generative"]
  },
  {
    id: "id-124",
    name: "Coverr",
    description: "Stunning stock cinematic backgrounds designed specifically for high-converting website hero loops.",
    category: "stock",
    freeAlternativeTo: "Shutterstock Video ($79)",
    rating: 4.7,
    url: "https://coverr.co",
    tags: ["Hero Videos", "Cinematic Loops", "Web Assets"]
  },
  {
    id: "id-125",
    name: "Videvo (Free Tier)",
    description: "Stunning free cinematic overlay effects, video footage, and generic stock backgrounds.",
    category: "stock",
    freeAlternativeTo: "Adobe Stock Video ($79/mo)",
    rating: 4.5,
    url: "https://www.videvo.net",
    tags: ["Video Clips", "HD Overlay", "Soundtracks"]
  },
  {
    id: "id-126",
    name: "Mockup World",
    description: "Massive directory of free-to-download high-quality PSD packaging and device mockup templates.",
    category: "stock",
    freeAlternativeTo: "Placeit Premium ($14/mo)",
    rating: 4.8,
    url: "https://www.mockupworld.co",
    tags: ["PSD Mockup", "Device Framing", "Packaging Design"]
  },

  // === CATEGORY 5: SOCIAL & HASHTAGS (30 tools) ===
  {
    id: "id-127",
    name: "Buffer (Free Tier)",
    description: "Schedule up to 10 automated social posts in advance across 3 platform profiles.",
    category: "social",
    freeAlternativeTo: "Hootsuite ($99/mo)",
    rating: 4.6,
    url: "https://buffer.com",
    tags: ["Scheduling", "Automation", "SaaS Planner"]
  },
  {
    id: "id-128",
    name: "Later (Free Starter)",
    description: "Visual social media scheduler specifically optimized for beautiful Instagram grid planning.",
    category: "social",
    freeAlternativeTo: "Sprout Social ($249/mo)",
    rating: 4.5,
    url: "https://later.com",
    tags: ["Instagram", "Grid Planner", "SaaS"]
  },
  {
    id: "id-129",
    name: "Publer (Free Tier)",
    description: "Schedule, collaborate, and analyze social posts across major networks including Google Business.",
    category: "social",
    freeAlternativeTo: "Buffer Paid ($15/mo)",
    rating: 4.7,
    url: "https://publer.io",
    tags: ["Automation", "Post Scheduling", "Social Analytics"]
  },
  {
    id: "id-130",
    name: "Linktree (Free Tier)",
    description: "The classic, lightweight bio-link router to connect your entire digital footprint.",
    category: "social",
    freeAlternativeTo: "Linktree Pro ($9/mo)",
    rating: 4.5,
    url: "https://linktr.ee",
    tags: ["Bio Link", "Link Router", "Landing Page"]
  },
  {
    id: "id-131",
    name: "Bento.me",
    description: "Stunning, highly modern bento-grid styled personal profile page and bio-link organizer.",
    category: "social",
    freeAlternativeTo: "Linktree Premium ($9/mo)",
    rating: 4.9,
    url: "https://bento.me",
    tags: ["Bento Layout", "Bio Link", "Branding Assets"]
  },
  {
    id: "id-132",
    name: "Beacons.ai (Free Tier)",
    description: "Powerful creator link-in-bio tool with built-in digital store modules.",
    category: "social",
    freeAlternativeTo: "Koji Paid ($15/mo)",
    rating: 4.6,
    url: "https://beacons.ai",
    tags: ["Bio Link", "Creator Shop", "Analytics"]
  },
  {
    id: "id-133",
    name: "RiteTag (Free Trial)",
    description: "Provides instant hashtags suggestions based on uploaded images or live text analysis.",
    category: "social",
    freeAlternativeTo: "Hashtagify Pro ($29/mo)",
    rating: 4.4,
    url: "https://ritetag.com",
    tags: ["Hashtags", "Insta Analytics", "Engagement"]
  },
  {
    id: "id-134",
    name: "All-Hashtag",
    description: "Enter a keyword to instantly generate 30 optimal popular, random, or live hashtags.",
    category: "social",
    freeAlternativeTo: "Hashtagify Pro ($29/mo)",
    rating: 4.5,
    url: "https://www.all-hashtag.com",
    tags: ["Hashtag Gen", "Social Search", "SEO"]
  },
  {
    id: "id-135",
    name: "Hashtag Stack",
    description: "Full hashtag generator and research tool suite to manage social reach groups.",
    category: "social",
    freeAlternativeTo: "Display Purposes Paid ($12/mo)",
    rating: 4.5,
    url: "https://hashtagstack.com",
    tags: ["Hashtags", "Instagram", "Social Growth"]
  },
  {
    id: "id-136",
    name: "Inoreader (Free)",
    description: "Power RSS content reader; build custom feeds and monitor social tags in one list.",
    category: "social",
    freeAlternativeTo: "Feedly Pro ($8/mo)",
    rating: 4.6,
    url: "https://www.inoreader.com",
    tags: ["RSS Reader", "Curation", "News Alerts"]
  },
  {
    id: "id-137",
    name: "TweetDeck (Free Alternative: Tweeten)",
    description: "Tweeten provides a clean, multi-column desktop application to monitor X (Twitter) trends.",
    category: "social",
    freeAlternativeTo: "X Premium/TweetDeck ($8/mo)",
    rating: 4.5,
    url: "https://tweetenapp.com",
    tags: ["Twitter Client", "Multi-column", "Social Monitoring"]
  },
  {
    id: "id-138",
    name: "Bitly (Free Tier)",
    description: "Shorten links, generate QR codes, and track basic clickthrough statistics.",
    category: "social",
    freeAlternativeTo: "Bitly Premium ($35/mo)",
    rating: 4.5,
    url: "https://bitly.com",
    tags: ["Link Shortener", "QR Codes", "Click Analytics"]
  },
  {
    id: "id-139",
    name: "Dub.co",
    description: "Stunning open-source modern link infrastructure with advanced location and device metrics.",
    category: "social",
    freeAlternativeTo: "Bitly Enterprise ($300/mo)",
    rating: 4.9,
    url: "https://dub.co",
    tags: ["Open-Source", "Link Shortener", "Deep Analytics"]
  },
  {
    id: "id-140",
    name: "Kut (kutt.it)",
    description: "Modern, open-source URL shortener with a comprehensive web and API administration interface.",
    category: "social",
    freeAlternativeTo: "Rebrandly Paid ($29/mo)",
    rating: 4.7,
    url: "https://kutt.it",
    tags: ["Open-Source", "URL Shortener", "Link Branded"]
  },
  {
    id: "id-141",
    name: "Feedive",
    description: "Instantly convert RSS feeds into beautiful visual slider cards to embed on site pages.",
    category: "social",
    freeAlternativeTo: "Paid feed widgets ($12/mo)",
    rating: 4.2,
    url: "https://feedive.com",
    tags: ["Feed Widgets", "RSS Embed", "SaaS"]
  },
  {
    id: "id-142",
    name: "Social Blade",
    description: "Track subscriber growth trends and view estimates across YouTube, Twitch, and Instagram.",
    category: "social",
    freeAlternativeTo: "Sprout Social Metrics ($249/mo)",
    rating: 4.6,
    url: "https://socialblade.com",
    tags: ["Creator Analytics", "Stats Tracker", "Audits"]
  },
  {
    id: "id-143",
    name: "Phlanx (Free Engagement Calculator)",
    description: "Audit Instagram engagement ratios to easily identify real audience interaction.",
    category: "social",
    freeAlternativeTo: "HypeAuditor Pro ($399/mo)",
    rating: 4.4,
    url: "https://phlanx.com/instagram-engagement-calculator",
    tags: ["Engagement Audit", "Instagram Metric", "Utilities"]
  },
  {
    id: "id-144",
    name: "Threads Photo Downloader",
    description: "Download high-resolution thread media files instantly completely free.",
    category: "social",
    freeAlternativeTo: "Paid download extensions ($5)",
    rating: 4.5,
    url: "https://threadsdownloader.com",
    tags: ["Download Utility", "Threads App", "Media"]
  },
  {
    id: "id-145",
    name: "Typefully (Free Tier)",
    description: "Write, schedule, and analyze engaging X (Twitter) threads with visual previews.",
    category: "social",
    freeAlternativeTo: "Hypefury Paid ($19/mo)",
    rating: 4.8,
    url: "https://typefully.com",
    tags: ["Twitter Thread", "Outlining", "Branding Assets"]
  },
  {
    id: "id-146",
    name: "Chime (Free Tier)",
    description: "Build custom interactive automated web push-notification alerts for blog readers.",
    category: "social",
    freeAlternativeTo: "OneSignal Premium ($99/mo)",
    rating: 4.4,
    url: "https://chime.me",
    tags: ["Push Alert", "Subscriber List", "Marketing"]
  },
  {
    id: "id-147",
    name: "Feedity",
    description: "Create an RSS feed from any plain web page by clicking on structural element classes.",
    category: "social",
    freeAlternativeTo: "Paid feed scrapers ($19/mo)",
    rating: 4.3,
    url: "https://feedity.com",
    tags: ["RSS Scraping", "Feed Creators", "Web Dev"]
  },
  {
    id: "id-148",
    name: "Profile Picture Maker (pfpmaker.com)",
    description: "Upload any face photo to instantly generate dozens of clean profile backgrounds.",
    category: "social",
    freeAlternativeTo: "Paid photo editing apps ($9/mo)",
    rating: 4.8,
    url: "https://pfpmaker.com",
    tags: ["Avatars", "Bg Generator", "Social Assets"]
  },
  {
    id: "id-149",
    name: "Caption Generator",
    description: "Fast, web-based tool to structure social caption spacings and avoid paragraph breaks.",
    category: "social",
    freeAlternativeTo: "Insta spacing apps ($3)",
    rating: 4.5,
    url: "https://captiongenerator.com",
    tags: ["Social Writing", "Aesthetic Spacer", "Utilities"]
  },
  {
    id: "id-150",
    name: "Tagify",
    description: "Generate highly relevant hashtag strings across multiple social platforms.",
    category: "social",
    freeAlternativeTo: "Hashtagify ($29/mo)",
    rating: 4.4,
    url: "https://tagify.io",
    tags: ["Hashtags", "Social reach", "SaaS Tools"]
  },
  {
    id: "id-151",
    name: "Tailwind CSS Grid Generator",
    description: "Generate clean custom CSS and Tailwind CSS Grid grid layouts with responsive preview sliders.",
    category: "social",
    freeAlternativeTo: "Paid canvas grids ($12)",
    rating: 4.7,
    url: "https://grid.layoutit.com",
    tags: ["Tailwind", "CSS Grid", "Developer Tools"]
  },
  {
    id: "id-152",
    name: "MockupBro",
    description: "Create realistic product and apparel mockups directly in your web browser.",
    category: "social",
    freeAlternativeTo: "Placeit Subscription ($14/mo)",
    rating: 4.6,
    url: "https://mockupbro.com",
    tags: ["Apparel Mockup", "Product Frames", "Social Branding"]
  },
  {
    id: "id-153",
    name: "TweetX Mockup",
    description: "Generate highly realistic Twitter posts and user profile graphic screenshots.",
    category: "social",
    freeAlternativeTo: "Paid meme generators ($5)",
    rating: 4.5,
    url: "https://tweetxmockup.com",
    tags: ["Meme Mockup", "Twitter Screen", "Aesthetics"]
  },
  {
    id: "id-154",
    name: "Manychat (Free Tier)",
    description: "Automate automated Instagram DM and Facebook Messenger reply funnel sequences.",
    category: "social",
    freeAlternativeTo: "Manychat Pro ($15/mo)",
    rating: 4.6,
    url: "https://manychat.com",
    tags: ["DM Funnel", "Bot Reply", "Automation"]
  },
  {
    id: "id-155",
    name: "Metricool (Free Tier)",
    description: "Comprehensive social media analytics, scheduling, and local reporting metrics.",
    category: "social",
    freeAlternativeTo: "Sprout Social ($249/mo)",
    rating: 4.8,
    url: "https://metricool.com",
    tags: ["Creator Reports", "SaaS Dashboard", "Schedule Posts"]
  },
  {
    id: "id-156",
    name: "CapCut Online",
    description: "Edit high-converting TikTok and Reels video layouts with captions inside your browser.",
    category: "social",
    freeAlternativeTo: "Adobe Rush ($9/mo)",
    rating: 4.8,
    url: "https://capcut.com/editor",
    tags: ["CapCut Editor", "Video Reels", "Subtitles"]
  },

  // === CATEGORY 6: ANALYTICS & SPEED (30 tools) ===
  {
    id: "id-157",
    name: "Google Analytics (Free)",
    description: "The enterprise-standard web traffic tracking, path auditing, and conversion dashboard.",
    category: "analytics",
    freeAlternativeTo: "Fathom / Paid Metrics ($14/mo)",
    rating: 4.7,
    url: "https://analytics.google.com",
    tags: ["Web Traffic", "Conversion", "Google"]
  },
  {
    id: "id-158",
    name: "Umami",
    description: "Beautiful, self-hosted, GDPR-compliant open-source alternative to Google Analytics.",
    category: "analytics",
    freeAlternativeTo: "Fathom Analytics ($14/mo)",
    rating: 4.9,
    url: "https://umami.is",
    tags: ["GDPR Traffic", "Open-Source", "Privacy"]
  },
  {
    id: "id-159",
    name: "Plausible Analytics (Self-Hosted)",
    description: "Extremely lightweight, open-source analytics dashboard that complies with privacy laws.",
    category: "analytics",
    freeAlternativeTo: "Simple Analytics ($19/mo)",
    rating: 4.8,
    url: "https://plausible.io",
    tags: ["Privacy", "Self-Hosted", "Lightweight"]
  },
  {
    id: "id-160",
    name: "GTmetrix (Free Tier)",
    description: "Detailed performance reports showing Core Web Vitals and load speed watermaps.",
    category: "analytics",
    freeAlternativeTo: "Pingdom Premium ($15/mo)",
    rating: 4.6,
    url: "https://gtmetrix.com",
    tags: ["Web Speed", "Performance Check", "SEO"]
  },
  {
    id: "id-161",
    name: "Google PageSpeed Insights",
    description: "Analyzes actual mobile and desktop load performance, returning exact optimization lists.",
    category: "analytics",
    freeAlternativeTo: "Paid performance audits ($50/ea)",
    rating: 4.8,
    url: "https://pagespeed.web.dev",
    tags: ["Google Lighthouse", "Core Vitals", "Utilities"]
  },
  {
    id: "id-162",
    name: "Pingdom Free Tools",
    description: "Test website load speeds from multiple servers located worldwide.",
    category: "analytics",
    freeAlternativeTo: "Pingdom Business ($15/mo)",
    rating: 4.5,
    url: "https://tools.pingdom.com",
    tags: ["Global Load Speed", "Performance Check", "Web Dev"]
  },
  {
    id: "id-163",
    name: "Hotjar (Free Basic)",
    description: "Record real anonymous user scroll maps, click sessions, and heatmaps.",
    category: "analytics",
    freeAlternativeTo: "CrazyEgg Premium ($29/mo)",
    rating: 4.6,
    url: "https://hotjar.com",
    tags: ["Heatmaps", "User Recording", "UX Testing"]
  },
  {
    id: "id-164",
    name: "Microsoft Clarity",
    description: "100% free, unlimited, GDPR-compliant session recordings and heatmaps with AI summaries.",
    category: "analytics",
    freeAlternativeTo: "Hotjar Plus ($39/mo)",
    rating: 4.9,
    url: "https://clarity.microsoft.com",
    tags: ["Unlimited Recording", "UX Insights", "Heatmaps"]
  },
  {
    id: "id-165",
    name: "Mixpanel (Free Tier)",
    description: "Event-based behavioral tracking to monitor retention and click funnel paths.",
    category: "analytics",
    freeAlternativeTo: "Amplitude Pro ($990/yr)",
    rating: 4.7,
    url: "https://mixpanel.com",
    tags: ["Funnel Tracking", "Event Metrics", "SaaS Insights"]
  },
  {
    id: "id-166",
    name: "Amplitude (Free Tier)",
    description: "Product intelligence analytics to track user growth cohorts and feature retention rates.",
    category: "analytics",
    freeAlternativeTo: "Mixpanel Paid ($25/mo)",
    rating: 4.7,
    url: "https://amplitude.com",
    tags: ["Product Growth", "Cohorts", "Data Analytics"]
  },
  {
    id: "id-167",
    name: "UptimeRobot (Free Tier)",
    description: "Monitors up to 50 URLs every 5 minutes and alerts you instantly if a server goes offline.",
    category: "analytics",
    freeAlternativeTo: "Pingdom Monitoring ($15/mo)",
    rating: 4.7,
    url: "https://uptimerobot.com",
    tags: ["Uptime Status", "Cron Monitoring", "Slack Alerts"]
  },
  {
    id: "id-168",
    name: "Cronitor (Free Tier)",
    description: "Simple cron job monitoring, application heartbeats, and status alerts.",
    category: "analytics",
    freeAlternativeTo: "Dead Man's Snitch ($5/mo)",
    rating: 4.6,
    url: "https://cronitor.io",
    tags: ["Cron Status", "Heartbeats", "SaaS Alerts"]
  },
  {
    id: "id-169",
    name: "Sentry (Free Tier)",
    description: "Track real-time browser code crashes and backend server exceptions instantly.",
    category: "analytics",
    freeAlternativeTo: "Bugsnag Paid ($29/mo)",
    rating: 4.8,
    url: "https://sentry.io",
    tags: ["Error Tracking", "Crashes", "Developer Tools"]
  },
  {
    id: "id-170",
    name: "LogRocket (Free Tier)",
    description: "Combines high-fidelity session replay recordings with browser error log analysis.",
    category: "analytics",
    freeAlternativeTo: "FullStory Premium ($199/mo)",
    rating: 4.6,
    url: "https://logrocket.com",
    tags: ["Error Tracking", "Replay UX", "Frontend Developer"]
  },
  {
    id: "id-171",
    name: "Inspectlet (Free Tier)",
    description: "Track user friction by watching live session recordings and key mouse paths.",
    category: "analytics",
    freeAlternativeTo: "Hotjar ($39/mo)",
    rating: 4.4,
    url: "https://inspectlet.com",
    tags: ["Mouse Tracking", "UX Session", "SaaS Analytics"]
  },
  {
    id: "id-172",
    name: "DNS Checker",
    description: "Test domain name propagation records globally across dozens of international DNS servers.",
    category: "analytics",
    freeAlternativeTo: "Paid DNS tracking ($10)",
    rating: 4.8,
    url: "https://dnschecker.org",
    tags: ["DNS Propagation", "Domain Record", "Utilities"]
  },
  {
    id: "id-173",
    name: "WhatIsMyIP",
    description: "Instant, ad-free diagnostic tool displaying IPv4, IPv6, location, and ISP details.",
    category: "analytics",
    freeAlternativeTo: "Paid IP tracking ($5)",
    rating: 4.5,
    url: "https://www.whatismyip.com",
    tags: ["IP Checker", "Diagnostic", "IP Location"]
  },
  {
    id: "id-174",
    name: "Speedtest by Ookla",
    description: "The global gold standard network ping, jitter, upload, and download speed checker.",
    category: "analytics",
    freeAlternativeTo: "Paid network audits ($10)",
    rating: 4.8,
    url: "https://www.speedtest.net",
    tags: ["Network Ping", "Load Metrics", "Utilities"]
  },
  {
    id: "id-175",
    name: "Fast.com",
    description: "Netflix's clean, lightning-fast, ad-free web network download speed checker.",
    category: "analytics",
    freeAlternativeTo: "Paid diagnostic dashboards",
    rating: 4.9,
    url: "https://fast.com",
    tags: ["Ad-Free Speed", "Netflix Diagnostics", "Minimalist"]
  },
  {
    id: "id-176",
    name: "SecurityHeaders.com",
    description: "Audits HTTP response headers to verify site protection against scripting attacks.",
    category: "analytics",
    freeAlternativeTo: "Paid security audits ($99/ea)",
    rating: 4.8,
    url: "https://securityheaders.com",
    tags: ["HTTP Audit", "Security Rating", "Web Dev"]
  },
  {
    id: "id-177",
    name: "SSL Shopper",
    description: "Diagnose security certificate expiration dates and key domain trust chains.",
    category: "analytics",
    freeAlternativeTo: "Paid SSL tools ($12)",
    rating: 4.6,
    url: "https://www.sslshopper.com",
    tags: ["SSL Diagnose", "Certificate Check", "Security"]
  },
  {
    id: "id-178",
    name: "Whois.com",
    description: "Look up registrar registration, domain administration, and ownership contact databases.",
    category: "analytics",
    freeAlternativeTo: "Paid whois lookups ($10)",
    rating: 4.5,
    url: "https://www.whois.com",
    tags: ["Whois Search", "Domain Admin", "Registrar"]
  },
  {
    id: "id-179",
    name: "BuiltWith (Free Tier)",
    description: "Uncover which server, frameworks, tracking scripts, and frameworks build any website.",
    category: "analytics",
    freeAlternativeTo: "Wappalyzer Paid ($29/mo)",
    rating: 4.7,
    url: "https://builtwith.com",
    tags: ["SaaS Detector", "CMS Audit", "Sales Tech"]
  },
  {
    id: "id-180",
    name: "Wappalyzer (Chrome Ext)",
    description: "Identifies web tools and analytics software instantly inside your active tab.",
    category: "analytics",
    freeAlternativeTo: "Wappalyzer Premium ($29/mo)",
    rating: 4.6,
    url: "https://www.wappalyzer.com",
    tags: ["Browser Extension", "Tech Stacks", "Chrome Ext"]
  },
  {
    id: "id-181",
    name: "PageSpeed Ninja",
    description: "An optimization analysis checking browser script compilation and asset sizes.",
    category: "analytics",
    freeAlternativeTo: "Desktop page speeds ($49)",
    rating: 4.3,
    url: "https://pagespeed.ninja",
    tags: ["Optimization Check", "Asset Sizes", "SEO Tools"]
  },
  {
    id: "id-182",
    name: "WebPageTest",
    description: "Deep diagnostic performance profiling showing full web filmstrip renders from real devices.",
    category: "analytics",
    freeAlternativeTo: "Enterprise speed diagnostics ($199)",
    rating: 4.8,
    url: "https://www.webpagetest.org",
    tags: ["Filmstrip Renders", "Diagnostic Speed", "Mobile Audits"]
  },
  {
    id: "id-183",
    name: "Core Web Vitals Checker",
    description: "Monitor visual layout shifts and first contentful paint timings.",
    category: "analytics",
    freeAlternativeTo: "Lighthouse Plugins ($15)",
    rating: 4.5,
    url: "https://vitalchecker.com",
    tags: ["CLS shifts", "FCP Paint", "Performance Check"]
  },
  {
    id: "id-184",
    name: "Metatags.io Analyzer",
    description: "Test social card metadata snippets across X, Google, Slack, and Facebook.",
    category: "analytics",
    freeAlternativeTo: "Social preview mockups ($9)",
    rating: 4.7,
    url: "https://metatags.io",
    tags: ["Metadata Test", "Previews Social", "SEO"]
  },
  {
    id: "id-185",
    name: "Bundlephobia",
    description: "Analyze how much NPM package installs will expand your final production bundle.",
    category: "analytics",
    freeAlternativeTo: "Webpack premium plugins ($29)",
    rating: 4.8,
    url: "https://bundlephobia.com",
    tags: ["NPM Weights", "Bundle Analyser", "Developer Tools"]
  },
  {
    id: "id-186",
    name: "PurgeCSS (Free CLI)",
    description: "Scans compiled stylesheet files to cleanly delete unused CSS styling coordinates.",
    category: "analytics",
    freeAlternativeTo: "Paid web optimizers ($39)",
    rating: 4.7,
    url: "https://purgecss.com",
    tags: ["CSS Cleansers", "File Optimizer", "Webpack Tools"]
  },

  // === CATEGORY 7: MARKETING & SEO (36 tools) ===
  {
    id: "id-187",
    name: "Ahrefs Free SEO Tools",
    description: "Free keyword generators, backlink audits, broken link checkers, and rank monitors.",
    category: "seo",
    freeAlternativeTo: "Ahrefs Premium ($99/mo)",
    rating: 4.8,
    url: "https://ahrefs.com/free-seo-tools",
    tags: ["Backlinks Check", "Keywords", "SEO Rank"]
  },
  {
    id: "id-188",
    name: "Google Search Console",
    description: "Track real index keywords, organic impressions, click ratios, and link integrations.",
    category: "seo",
    freeAlternativeTo: "SEMrush Analytics ($129/mo)",
    rating: 4.9,
    url: "https://search.google.com/search-console",
    tags: ["Google Search", "Index Metrics", "Keyword Rank"]
  },
  {
    id: "id-189",
    name: "Ubersuggest (Free Tier)",
    description: "Provides helpful monthly search volumes, SEO difficulties, and key search variations.",
    category: "seo",
    freeAlternativeTo: "SEMrush Core ($129/mo)",
    rating: 4.6,
    url: "https://neilpatel.com/ubersuggest",
    tags: ["Keyword Volumes", "Competitor Audit", "SEO"]
  },
  {
    id: "id-190",
    name: "Moz Link Explorer (Free Tier)",
    description: "Analyze backlink quality profiles and domain authority scores completely free.",
    category: "seo",
    freeAlternativeTo: "Moz Pro ($99/mo)",
    rating: 4.5,
    url: "https://moz.com/link-explorer",
    tags: ["Domain Score", "Backlinks Check", "MozRank"]
  },
  {
    id: "id-191",
    name: "Screaming Frog SEO Spider (Free)",
    description: "Scans up to 500 URLs looking for broken links, duplicate pages, and bad tags.",
    category: "seo",
    freeAlternativeTo: "Screaming Frog Paid ($259/yr)",
    rating: 4.8,
    url: "https://www.screamingfrog.co.uk/seo-spider",
    tags: ["Crawling SEO", "Broken Links", "Desktop App"]
  },
  {
    id: "id-192",
    name: "Keyword Surfer (Chrome Ext)",
    description: "Discovers exact search volumes direct inside Google Search query results.",
    category: "seo",
    freeAlternativeTo: "Keywords Everywhere ($15/mo)",
    rating: 4.7,
    url: "https://surferseo.com/keyword-surfer-extension",
    tags: ["Keyword Extension", "Chrome Ext", "Search Metrics"]
  },
  {
    id: "id-193",
    name: "Exploding Topics (Free Tier)",
    description: "Identifies expanding trending search categories and topics months before they peak.",
    category: "seo",
    freeAlternativeTo: "BuzzSumo Trends ($199/mo)",
    rating: 4.8,
    url: "https://explodingtopics.com",
    tags: ["Trends Monitoring", "Business Ideas", "SEO Insights"]
  },
  {
    id: "id-194",
    name: "Google Trends",
    description: "Compare absolute term query popularity variations across counties and times.",
    category: "seo",
    freeAlternativeTo: "Market trends software ($50/mo)",
    rating: 4.9,
    url: "https://trends.google.com",
    tags: ["Google Data", "Trends", "Market Analysis"]
  },
  {
    id: "id-195",
    name: "Yoast SEO (Free Plugin)",
    description: "The classic WordPress SEO plugin optimizing page content, meta tags, and sitemaps.",
    category: "seo",
    freeAlternativeTo: "Yoast SEO Premium ($99/yr)",
    rating: 4.5,
    url: "https://yoast.com/wordpress/plugins/seo",
    tags: ["WordPress SEO", "Meta Tags", "Sitemaps"]
  },
  {
    id: "id-196",
    name: "RankMath (Free Plugin)",
    description: "Exceptional SEO configuration engine for WordPress, featuring schema mapping.",
    category: "seo",
    freeAlternativeTo: "RankMath Pro ($59/yr)",
    rating: 4.8,
    url: "https://rankmath.com",
    tags: ["WordPress plugin", "Schema SEO", "Sitemaps"]
  },
  {
    id: "id-197",
    name: "Schema Markup Generator (Merkle)",
    description: "Create schema script models (JSON-LD) for articles, FAQs, and local businesses.",
    category: "seo",
    freeAlternativeTo: "Paid schema builders ($10/mo)",
    rating: 4.8,
    url: "https://technicalseo.com/tools/schema-generator",
    tags: ["JSON-LD Schema", "Structured Data", "SEO Tools"]
  },
  {
    id: "id-198",
    name: "Google Rich Results Test",
    description: "Verify that Google indexing spiders can accurately parse structured schema markup.",
    category: "seo",
    freeAlternativeTo: "Paid schema testers",
    rating: 4.7,
    url: "https://search.google.com/test/rich-results",
    tags: ["Google Schema", "Structured Data", "Utilities"]
  },
  {
    id: "id-199",
    name: "Keyword Sheeter",
    description: "Scrapes Google autocomplete suggestions to return thousands of raw keywords in seconds.",
    category: "seo",
    freeAlternativeTo: "Paid autocomplete scrapers ($15)",
    rating: 4.4,
    url: "https://keywordsheeter.com",
    tags: ["Keyword Scraping", "Topic research", "SEO"]
  },
  {
    id: "id-200",
    name: "XML Sitemaps Generator",
    description: "Crawl and output up to 500 page URL coordinates in a clean XML sitemap list.",
    category: "seo",
    freeAlternativeTo: "Paid map crawl software ($10)",
    rating: 4.5,
    url: "https://www.xml-sitemaps.com",
    tags: ["XML Sitemaps", "Index Tools", "Search SEO"]
  },
  {
    id: "id-201",
    name: "Hreflang Tags Generator (Aleyda Solis)",
    description: "Generate multi-regional localization hreflang tags to map global domains.",
    category: "seo",
    freeAlternativeTo: "Paid localization builders ($15)",
    rating: 4.8,
    url: "https://www.aleydasolis.com/en/hreflang-tags-generator",
    tags: ["Hreflang Tools", "International SEO", "Utilities"]
  },
  {
    id: "id-202",
    name: "Robots.txt Generator",
    description: "Generate file crawl rules, managing path exclusions for Google indexing crawlers.",
    category: "seo",
    freeAlternativeTo: "Paid file creators ($5)",
    rating: 4.5,
    url: "https://www.robotstxt.org",
    tags: ["Robots.txt", "Search crawlers", "Utilities"]
  },
  {
    id: "id-203",
    name: "Link Miner (Free Extension)",
    description: "Identifies broken links on external sites to help with backlink building campaigns.",
    category: "seo",
    freeAlternativeTo: "Ahrefs Broken Links ($99/mo)",
    rating: 4.4,
    url: "https://linkminer.com",
    tags: ["Broken Links", "Backlink building", "Chrome Ext"]
  },
  {
    id: "id-204",
    name: "Serp Robot (Free Checker)",
    description: "Test immediate keyword position placements in real-time desktop or mobile search indexes.",
    category: "seo",
    freeAlternativeTo: "AccuRanker Premium ($119/mo)",
    rating: 4.6,
    url: "https://www.serprobot.com",
    tags: ["Serp rank", "Keyword Rank", "SEO Utilities"]
  },
  {
    id: "id-205",
    name: "Copyscape (Free Compare)",
    description: "Compares content between two URLs to safeguard against plagiarism search penalties.",
    category: "seo",
    freeAlternativeTo: "Copyscape Premium API ($10/mo)",
    rating: 4.5,
    url: "https://www.copyscape.com/compare.php",
    tags: ["Plagiarism Check", "Duplicate SEO", "Utilities"]
  },
  {
    id: "id-206",
    name: "Snov.io (Free Tracker)",
    description: "Chrome extension to track email open rates directly inside Google Gmail dashboards.",
    category: "seo",
    freeAlternativeTo: "Yesware Premium ($15/mo)",
    rating: 4.6,
    url: "https://snov.io/email-tracker",
    tags: ["Email Tracker", "Gmail Dashboard", "Sales Outreach"]
  },
  {
    id: "id-207",
    name: "Hunter.io (Free Tier)",
    description: "Find professional corporate email addresses linked to any domain search query.",
    category: "seo",
    freeAlternativeTo: "ZoomInfo Enterprise ($500/mo)",
    rating: 4.7,
    url: "https://hunter.io",
    tags: ["Email Search", "Lead Gen", "Sales Outreach"]
  },
  {
    id: "id-208",
    name: "Voila Norbert (Free Trial)",
    description: "Validates and discovers corporate contact addresses to help clean up mailing lists.",
    category: "seo",
    freeAlternativeTo: "Lusha Premium ($39/mo)",
    rating: 4.5,
    url: "https://www.voilanorbert.com",
    tags: ["Contact Finder", "Lead Gen", "Outreach Tools"]
  },
  {
    id: "id-209",
    name: "MailerLite (Free Tier)",
    description: "Schedule elegant newsletters for lists of up to 1,000 subscribers completely free.",
    category: "seo",
    freeAlternativeTo: "Mailchimp Paid ($20/mo)",
    rating: 4.8,
    url: "https://www.mailerlite.com",
    tags: ["Newsletters", "Campaign Builder", "Email List"]
  },
  {
    id: "id-210",
    name: "Brevo (formerly Sendinblue Free)",
    description: "Send up to 300 professional marketing transactional emails daily completely free.",
    category: "seo",
    freeAlternativeTo: "SendGrid Paid ($15/mo)",
    rating: 4.7,
    url: "https://www.brevo.com",
    tags: ["Transactional SMTP", "Email Marketing", "Automation"]
  },
  {
    id: "id-211",
    name: "Carrd (Free Basic)",
    description: "Build clean, fully responsive single-page visual portfolio landing pages.",
    category: "seo",
    freeAlternativeTo: "Unbounce SaaS ($99/mo)",
    rating: 4.9,
    url: "https://carrd.co",
    tags: ["Landing Page", "Single-Page", "Branding Assets"]
  },
  {
    id: "id-212",
    name: "Loom (Free Starter)",
    description: "Record up to 25 quick screen-share videos capped at 5 minutes each.",
    category: "seo",
    freeAlternativeTo: "Vidyard Pro ($19/mo)",
    rating: 4.7,
    url: "https://loom.com",
    tags: ["Screencast Video", "Demos", "SaaS Outreach"]
  },
  {
    id: "id-213",
    name: "Canva Pitch Decks",
    description: "Generate highly professional startup sales pitch decks using drag-and-drop elements.",
    category: "seo",
    freeAlternativeTo: "Beautiful.ai ($12/mo)",
    rating: 4.7,
    url: "https://www.canva.com/presentations",
    tags: ["Pitch Decks", "Sales Slides", "Graphic Design"]
  },
  {
    id: "id-214",
    name: "UTM Link Builder (Google)",
    description: "Clean wizard tool to configure tracking codes for marketing URLs.",
    category: "seo",
    freeAlternativeTo: "Paid UTM tracking ($10/mo)",
    rating: 4.8,
    url: "https://ga-dev-tools.google/campaign-url-builder",
    tags: ["UTM Codes", "Link Tracker", "Utilities"]
  },
  {
    id: "id-215",
    name: "Keyword Tool.io (Free Tier)",
    description: "Discovers target keywords matching YouTube, Bing, and Amazon autocompletes.",
    category: "seo",
    freeAlternativeTo: "Ahrefs ($99/mo)",
    rating: 4.4,
    url: "https://keywordtool.io",
    tags: ["E-Commerce SEO", "YouTube Keywords", "Search SEO"]
  },
  {
    id: "id-216",
    name: "AnswerThePublic",
    description: "Visual topic matrix showing search questions grouped by Who, What, Why, and How.",
    category: "seo",
    freeAlternativeTo: "Semrush Topic Search ($129/mo)",
    rating: 4.6,
    url: "https://answerthepublic.com",
    tags: ["Topic Matrix", "Keyword Questions", "Inspiration"]
  },
  {
    id: "id-217",
    name: "FatRank (Chrome Ext)",
    description: "Check exactly where any website ranks for a specific search term in Google indexes.",
    category: "seo",
    freeAlternativeTo: "Rank trackers ($20/mo)",
    rating: 4.5,
    url: "https://fatmedia.co.uk/fatrank",
    tags: ["Serp Rank", "Chrome Ext", "Search SEO"]
  },
  {
    id: "id-218",
    name: "Seoptimer",
    description: "Audits page elements, returning checklists to resolve header, speed, and image tag issues.",
    category: "seo",
    freeAlternativeTo: "Site audits ($49/ea)",
    rating: 4.6,
    url: "https://www.seoptimer.com",
    tags: ["Page Auditing", "Meta Check", "SEO Checklists"]
  },
  {
    id: "id-219",
    name: "Google Business Profile",
    description: "The absolute required free asset to rank in Google Maps local listings.",
    category: "seo",
    freeAlternativeTo: "Yext Premium ($499/yr)",
    rating: 4.8,
    url: "https://www.google.com/business",
    tags: ["Local Maps SEO", "Google Business", "Audience Traffic"]
  },
  {
    id: "id-220",
    name: "Bing Webmaster Tools",
    description: "Track search console indexing, index keywords, and crawling on Microsoft Bing indexes.",
    category: "seo",
    freeAlternativeTo: "Paid search engines crawlers",
    rating: 4.6,
    url: "https://www.bing.com/webmasters",
    tags: ["Bing indexing", "Keyword Rank", "Diagnostics"]
  },
  {
    id: "id-221",
    name: "SimilarWeb (Free Extension)",
    description: "Review estimates of monthly traffic levels, traffic channels, and countries for any domain.",
    category: "seo",
    freeAlternativeTo: "SimilarWeb Enterprise ($1600/mo)",
    rating: 4.7,
    url: "https://www.similarweb.com",
    tags: ["Competitor Traffic", "Chrome Ext", "SaaS Insights"]
  },
  {
    id: "id-222",
    name: "Bulk Redirect Checker",
    description: "Verify that hundreds of server redirects (301, 302) are configured correctly.",
    category: "seo",
    freeAlternativeTo: "Paid server diagnostic tools ($19)",
    rating: 4.6,
    url: "https://redirectchecker.org",
    tags: ["Redirects 301", "Crawl Status", "Developer Tools"]
  },

  // === CATEGORY 8: CALCULATORS & UTILITIES (30 tools) ===
  {
    id: "id-223",
    name: "Subscription Savings Calculator",
    description: "Calculate what you can save annually by replacing premium tools with free equivalents.",
    category: "calculators",
    freeAlternativeTo: "Paid budgeting utilities ($9/mo)",
    rating: 4.9,
    url: "#savings-calculator",
    tags: ["Budgeting", "Calculators", "Interactive"]
  },
  {
    id: "id-224",
    name: "Meta Tag Generator Tool",
    description: "Generate clean SEO header tags to preview how pages will look on search indexes.",
    category: "calculators",
    freeAlternativeTo: "SEO meta compilers ($5)",
    rating: 4.8,
    url: "#meta-tag-generator",
    tags: ["SEO Tags", "Interactions", "Code Generator"]
  },
  {
    id: "id-225",
    name: "CSS Grid layoutit Builder",
    description: "Interactive visual drag-and-drop tool to construct code coordinates for CSS grids.",
    category: "calculators",
    freeAlternativeTo: "Paid layouts engines ($12/mo)",
    rating: 4.8,
    url: "https://grid.layoutit.com",
    tags: ["CSS Code", "Layout Generator", "Web Dev"]
  },
  {
    id: "id-226",
    name: "Omni Calculator",
    description: "Massive directory of over 3,000 highly accurate custom calculators covering all topics.",
    category: "calculators",
    freeAlternativeTo: "Premium calculator builders ($15/mo)",
    rating: 4.9,
    url: "https://www.omnicalculator.com",
    tags: ["Directory Calculators", "Utilities", "Calculations"]
  },
  {
    id: "id-227",
    name: "Calculator.net",
    description: "Simple, accurate, ad-free calculators for mortgage, finance, and mathematical equations.",
    category: "calculators",
    freeAlternativeTo: "Paid math apps ($5)",
    rating: 4.7,
    url: "https://www.calculator.net",
    tags: ["Math calculators", "Financial Planner", "Utilities"]
  },
  {
    id: "id-228",
    name: "HashTag Generator Tool",
    description: "Generate highly relevant hashtag groups based on target keyword terms instantly.",
    category: "calculators",
    freeAlternativeTo: "Hashtagify ($29/mo)",
    rating: 4.7,
    url: "#hashtag-generator",
    tags: ["Social Outreach", "Hashtags", "Interactions"]
  },
  {
    id: "id-229",
    name: "Contrast Checker (WebAIM)",
    description: "Check contrast ratios between background and text colors to conform with WCAG standards.",
    category: "calculators",
    freeAlternativeTo: "Accessibility audit software ($299)",
    rating: 4.9,
    url: "https://webaim.org/resources/contrastchecker",
    tags: ["Accessibility WCAG", "Contrast", "Web Dev"]
  },
  {
    id: "id-230",
    name: "Invoice Generator (Invoiced)",
    description: "Build, download, and send clean, custom invoice PDF templates completely free.",
    category: "calculators",
    freeAlternativeTo: "FreshBooks Paid ($17/mo)",
    rating: 4.8,
    url: "https://invoice-generator.com",
    tags: ["Billing invoices", "Client Management", "Finance"]
  },
  {
    id: "id-231",
    name: "Wave Invoicing (Free)",
    description: "A complete professional cloud invoicing and bookkeeping suite tailored for freelancers.",
    category: "calculators",
    freeAlternativeTo: "QuickBooks Simple ($30/mo)",
    rating: 4.8,
    url: "https://www.waveapps.com",
    tags: ["Bookkeeping", "SaaS Finance", "Invoicing"]
  },
  {
    id: "id-232",
    name: "RegExr",
    description: "Fabulous interactive editor to learn, test, compile, and debug regular expressions.",
    category: "calculators",
    freeAlternativeTo: "Paid regex matchers ($5)",
    rating: 4.9,
    url: "https://regexr.com",
    tags: ["RegEx Matches", "Learn Code", "Developer Tools"]
  },
  {
    id: "id-233",
    name: "JSONLint",
    description: "The classic, lightweight validator, compiler, and formatter to check JSON syntax rules.",
    category: "calculators",
    freeAlternativeTo: "Paid compiler utilities",
    rating: 4.8,
    url: "https://jsonlint.com",
    tags: ["JSON syntax", "JSON Validator", "Developer Tools"]
  },
  {
    id: "id-234",
    name: "Base64 Encoder",
    description: "Convert media files or code strings into Base64 formats directly inside your browser.",
    category: "calculators",
    freeAlternativeTo: "Paid converters ($10)",
    rating: 4.6,
    url: "https://www.base64encode.org",
    tags: ["Base64 convert", "Codec Utilities", "Developer Tools"]
  },
  {
    id: "id-235",
    name: "URL Encoder / Decoder",
    description: "Convert query parameters to safe URL structures or decode URL-encoded values.",
    category: "calculators",
    freeAlternativeTo: "Paid codec tools",
    rating: 4.7,
    url: "https://www.urldecoder.org",
    tags: ["URL Coordinates", "Codec Utilities", "Web Dev"]
  },
  {
    id: "id-236",
    name: "Markdown Live Preview",
    description: "A dual-pane editor that compiles markdown strings into clean visual HTML renders.",
    category: "calculators",
    freeAlternativeTo: "Typora Premium ($15)",
    rating: 4.8,
    url: "https://markdownlivepreview.com",
    tags: ["Markdown", "Dual-pane HTML", "Writing Utilities"]
  },
  {
    id: "id-237",
    name: "Lorem Ipsum Generator",
    description: "Generate standard placeholder text paragraphs, sentences, or word strings.",
    category: "calculators",
    freeAlternativeTo: "Paid text builders ($3)",
    rating: 4.6,
    url: "https://lipsum.com",
    tags: ["Lorem Ipsum", "Aesthetics Placeholder", "Utilities"]
  },
  {
    id: "id-238",
    name: "TinyPNG Analyzer",
    description: "Analyze site page sizes and inspect how much image compression will boost site speed.",
    category: "calculators",
    freeAlternativeTo: "Paid performance diagnostics ($49)",
    rating: 4.5,
    url: "https://tinypng.com/analyzer",
    tags: ["Web Speed", "Performance Check", "Image Weights"]
  },
  {
    id: "id-239",
    name: "AdSense Calculator",
    description: "Predict earnings potential by adjusting pageview counts and average click values.",
    category: "calculators",
    freeAlternativeTo: "Paid AdWords analyzers ($10)",
    rating: 4.5,
    url: "https://www.google.com/adsense/start/#calculator",
    tags: ["AdWords earnings", "Revenue Planner", "Utilities"]
  },
  {
    id: "id-240",
    name: "QR Code Generator (qr-code-generator.com)",
    description: "Generate clean custom QR codes mapped to target URLs completely free.",
    category: "calculators",
    freeAlternativeTo: "Paid QR managers ($15/mo)",
    rating: 4.6,
    url: "https://www.qr-code-generator.com",
    tags: ["QR Codes", "Marketing Assets", "SaaS"]
  },
  {
    id: "id-241",
    name: "Diff Checker (Code/Text)",
    description: "Paste two code snippets or copy blocks to highlight differences and syntax errors.",
    category: "calculators",
    freeAlternativeTo: "Paid text comparison ($9/mo)",
    rating: 4.8,
    url: "https://www.diffchecker.com",
    tags: ["Diff Utility", "Developer Tools", "Syntax check"]
  },
  {
    id: "id-242",
    name: "CoSchedule headline analyzer",
    description: "Analyzes heading characters, keyword balances, and sentiment structures.",
    category: "calculators",
    freeAlternativeTo: "OptinMonster Analyzer ($9/mo)",
    rating: 4.5,
    url: "https://coschedule.com/headline-analyzer",
    tags: ["Headlines SEO", "Clickthrough", "SEO"]
  },
  {
    id: "id-243",
    name: "Markup Structured Data Generator",
    description: "Generate JSON-LD schema scripts to improve search index snippets.",
    category: "calculators",
    freeAlternativeTo: "Paid schema builders ($12/mo)",
    rating: 4.8,
    url: "https://technicalseo.com/tools/schema-generator",
    tags: ["JSON-LD Schema", "Structured Data", "SEO Tools"]
  },
  {
    id: "id-244",
    name: "Password Generator (Bitwarden)",
    description: "Highly secure password generator creating randomized strings of numbers, symbols, and text.",
    category: "calculators",
    freeAlternativeTo: "1Password Paid ($4/mo)",
    rating: 4.9,
    url: "https://bitwarden.com/password-generator",
    tags: ["Security Encryption", "Utilities", "Developer Tools"]
  },
  {
    id: "id-245",
    name: "Color Contrast Checker (Coolors)",
    description: "Verify hex color pairings conform to accessibility contrast recommendations.",
    category: "calculators",
    freeAlternativeTo: "Paid accessibility mappers ($15)",
    rating: 4.7,
    url: "https://coolors.co/contrast-checker",
    tags: ["Contrast", "Hex Colors", "WCAG accessibility"]
  },
  {
    id: "id-246",
    name: "Carbon.now.sh",
    description: "Create and export stunning, stylized code-snippet mockup pictures for social sharing.",
    category: "calculators",
    freeAlternativeTo: "Paid code capture utilities ($5)",
    rating: 4.9,
    url: "https://carbon.now.sh",
    tags: ["Carbon Mockups", "Code Capture", "Social Branding"]
  },
  {
    id: "id-247",
    name: "SVGomg",
    description: "Incredible SVG optimization cleanup utility to safely delete bloated vector metadata coordinates.",
    category: "calculators",
    freeAlternativeTo: "Paid vector optimizers ($10)",
    rating: 4.9,
    url: "https://jakearchibald.github.io/svgomg",
    tags: ["SVG Cleanse", "Developer Tools", "Performance Check"]
  },
  {
    id: "id-248",
    name: "JSON to TS",
    description: "Paste a standard JSON object to instantly compile type-safe TypeScript interfaces.",
    category: "calculators",
    freeAlternativeTo: "Paid ts code generators ($5)",
    rating: 4.8,
    url: "https://transform.tools/json-to-typescript",
    tags: ["JSON to TS", "TypeScript Types", "Developer Tools"]
  },
  {
    id: "id-249",
    name: "Cron Query Builder",
    description: "Interactive visual wizard to define cron timelines and output cron text schedules.",
    category: "calculators",
    freeAlternativeTo: "Paid cron managers ($8)",
    rating: 4.7,
    url: "https://crontab.guru",
    tags: ["Cron Scheduler", "Visual Cron", "Developer Tools"]
  },
  {
    id: "id-250",
    name: "YAML to JSON Converter",
    description: "Instantly parse YAML structures to validate and output standard JSON strings.",
    category: "calculators",
    freeAlternativeTo: "Paid codec tools",
    rating: 4.6,
    url: "https://jsonformatter.org/yaml-to-json",
    tags: ["YAML to JSON", "Codec Utilities", "Developer Tools"]
  },
  {
    id: "id-251",
    name: "Keycode Checker",
    description: "Diagnostic utility showing key numbers, event variables, and codes for pressed keyboard keys.",
    category: "calculators",
    freeAlternativeTo: "Paid input trackers",
    rating: 4.7,
    url: "https://keycode.info",
    tags: ["Key Event", "Diagnostics", "Developer Tools"]
  },
  {
    id: "id-252",
    name: "RegEx101",
    description: "The complete regular expression builder featuring real-time match explanations and debuggers.",
    category: "calculators",
    freeAlternativeTo: "Paid Regex Software ($19)",
    rating: 4.9,
    url: "https://regex101.com",
    tags: ["RegEx Matches", "Regex Debugger", "Developer Tools"]
  }
];
