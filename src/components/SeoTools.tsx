import React, { useState, useEffect, useMemo } from "react";
import { generateSitemapXml } from "../utils/sitemapGenerator";
import {
  Check,
  Copy,
  Sparkles,
  Search,
  Download,
  Share2,
  Globe,
  RefreshCw,
  AlertCircle,
  Trash2,
  Lock,
  Code as CodeIcon,
  FileText,
  Terminal,
  ChevronRight,
  Hash,
  Link as LinkIcon,
  Shield,
  ShieldAlert,
  Clock,
  Settings,
  AlertTriangle,
  ExternalLink,
  ArrowLeft,
  Server,
  Eye,
  Settings2,
  ListFilter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// ==========================================
// PURE CRYPTO HELPERS (Self-Contained)
// ==========================================
function md5(str: string): string {
  const k = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
  ];
  const r = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
  ];
  const s = unescape(encodeURIComponent(str));
  const h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];
  const blocks: number[] = [];
  const n = s.length;
  for (let i = 0; i < n; i++) {
    blocks[i >> 2] |= s.charCodeAt(i) << ((i % 4) * 8);
  }
  blocks[n >> 2] |= 0x80 << ((n % 4) * 8);
  while ((blocks.length % 16) !== 14) {
    blocks.push(0);
  }
  blocks.push(n * 8);
  blocks.push(0);
  const rotateLeft = (lValue: number, iShiftBits: number) => (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  for (let i = 0; i < blocks.length; i += 16) {
    let a = h[0], b = h[1], c = h[2], d = h[3];
    for (let j = 0; j < 64; j++) {
      let f, g;
      if (j < 16) {
        f = (b & c) | (~b & d);
        g = j;
      } else if (j < 32) {
        f = (d & b) | (~d & c);
        g = (5 * j + 1) % 16;
      } else if (j < 48) {
        f = b ^ c ^ d;
        g = (3 * j + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * j) % 16;
      }
      const temp = d;
      d = c;
      c = b;
      b = (b + rotateLeft(a + f + k[j] + (blocks[i + g] || 0), r[j])) | 0;
      a = temp;
    }
    h[0] = (h[0] + a) | 0;
    h[1] = (h[1] + b) | 0;
    h[2] = (h[2] + c) | 0;
    h[3] = (h[3] + d) | 0;
  }
  let hex = "";
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const bval = (h[i] >>> (j * 8)) & 0xff;
      hex += (bval < 16 ? "0" : "") + bval.toString(16);
    }
  }
  return hex;
}

function sha256(str: string): string {
  const rotr = (value: number, shift: number) => (value >>> shift) | (value << (32 - shift));
  const s = unescape(encodeURIComponent(str));
  const h = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  const blocks: number[] = [];
  const n = s.length;
  for (let i = 0; i < n; i++) {
    blocks[i >> 2] |= s.charCodeAt(i) << (24 - (i % 4) * 8);
  }
  blocks[n >> 2] |= 0x80 << (24 - (n % 4) * 8);
  while ((blocks.length % 16) !== 14) {
    blocks.push(0);
  }
  blocks.push(0);
  blocks.push(n * 8);
  
  const w = new Array(64);
  for (let i = 0; i < blocks.length; i += 16) {
    for (let j = 0; j < 16; j++) {
      w[j] = blocks[i + j] || 0;
    }
    for (let j = 16; j < 64; j++) {
      const s0 = rotr(w[j - 15], 7) ^ rotr(w[j - 15], 18) ^ (w[j - 15] >>> 3);
      const s1 = rotr(w[j - 2], 17) ^ rotr(w[j - 2], 19) ^ (w[j - 2] >>> 10);
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
    }
    let a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], h_val = h[7];
    for (let j = 0; j < 64; j++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h_val + S1 + ch + k[j] + w[j]) | 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;
      h_val = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }
    h[0] = (h[0] + a) | 0;
    h[1] = (h[1] + b) | 0;
    h[2] = (h[2] + c) | 0;
    h[3] = (h[3] + d) | 0;
    h[4] = (h[4] + e) | 0;
    h[5] = (h[5] + f) | 0;
    h[6] = (h[6] + g) | 0;
    h[7] = (h[7] + h_val) | 0;
  }
  let hex = "";
  for (let i = 0; i < 8; i++) {
    let v = h[i];
    if (v < 0) v += 0x100000000;
    let str_v = v.toString(16);
    while (str_v.length < 8) str_v = "0" + str_v;
    hex += str_v;
  }
  return hex;
}

// Common stop-words for slug / keyword filtering
const STOP_WORDS = new Set(["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "arent", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "cant", "cannot", "could", "couldnt", "did", "didnt", "do", "does", "doesnt", "doing", "dont", "down", "during", "each", "few", "for", "from", "further", "had", "hadnt", "has", "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes", "her", "here", "heres", "hers", "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", "if", "in", "into", "is", "isnt", "it", "its", "itself", "lets", "me", "more", "most", "mustnt", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shant", "she", "shed", "shell", "shes", "should", "shouldnt", "so", "some", "such", "than", "that", "thats", "the", "their", "theirs", "them", "themselves", "then", "there", "theres", "these", "they", "theyd", "theyll", "theyre", "theyve", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasnt", "we", "wed", "well", "were", "weve", "werent", "what", "whats", "when", "whens", "where", "wheres", "which", "while", "who", "whos", "whom", "why", "whys", "with", "wont", "would", "wouldnt", "you", "youd", "youll", "youre", "youve", "your", "yours", "yourself", "yourselves"]);

// ==========================================
// DATA STRUCTURES
// ==========================================
export interface SeoToolItem {
  id: string;
  name: string;
  slug: string;
  desc: string;
  seoDescription: string;
}

export interface SeoCategory {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  items: SeoToolItem[];
}

export const SEO_CATEGORIES: SeoCategory[] = [
  {
    id: "technical",
    name: "Technical SEO Tools",
    emoji: "⚙️",
    desc: "Backend configurations, indexing files, redirects, and web server health validators.",
    items: [
      { id: "xml-sitemap", name: "XML Sitemap Generator", slug: "xml-sitemap-generator", desc: "Apni website ke liye instantly ek dynamic aur clean XML sitemap banayein jise Google Search Console me submit kiya sake.", seoDescription: "Create robust, custom sitemap.xml scripts complete with priority filters, frequency states, and manual override paths." },
      { id: "robots-txt", name: "Robots.txt Generator", slug: "robots-txt-generator", desc: "Search engine crawlers ke liye rules aur crawl delay choose karein aur clean robots.txt banayein.", seoDescription: "Generate standard-compliant robots.txt directives to properly control search console bots, sitemaps, and restricted directory locations." },
      { id: "htaccess", name: "Htaccess Redirect Generator", slug: "htaccess-redirect-generator", desc: "301 Permanent aur 302 Temporary redirects ke liye perfect Apache rewrite config code banayein.", seoDescription: "Build error-free web server .htaccess files containing secure HTTPS forced rules, www/non-www rewrites, and path redirects." },
      { id: "server-status", name: "Server Status Checker", slug: "server-status-checker", desc: "Kisi bhi domain ka HTTP status check karein (jaise 200 OK, 301, 404, ya 500) aur check karein server responsive hai ya nahi.", seoDescription: "Test website HTTP headers, connection latency metrics, IP address records, and web server software outputs." },
      { id: "page-size", name: "Website Page Size Checker", slug: "page-size-checker", desc: "Apne web page ka exact size track karein. Chhota page load fast hota hai jo rank badhane me madadgar hai.", seoDescription: "Calculate exact website asset weight breakdowns including HTML, CSS stylesheets, Javascript dependencies, and media assets." }
    ]
  },
  {
    id: "content",
    name: "Content & On-Page SEO",
    emoji: "📝",
    desc: "Meta tag setups, copywriting aids, word frequencies, and semantic checks.",
    items: [
      { id: "meta-tags", name: "Meta Tag Generator", slug: "meta-tag-generator", desc: "Search engines ke liye click-worthy Meta Titles aur Descriptions banayein jo Google desktop preview me check karein.", seoDescription: "Build tags for Facebook Open Graph, Twitter Cards, description length parameters, and standard robot search console rules." },
      { id: "keyword-density", name: "Keyword Density Checker", slug: "keyword-density-checker", desc: "Apne article me content keyword stuffing check karein taaki penalty se bacha ja sake.", seoDescription: "Analyze single-word, double-word, and triple-word phrase ratios in your copy to optimize natural semantic relevancy scores." },
      { id: "plagiarism", name: "Plagiarism Checker", slug: "plagiarism-checker", desc: "Pta lagayein ki aapka content 100% unique hai ya nahi. Google duplicate content ko block karta hai.", seoDescription: "Scan paragraph structures to compute direct originality rates, matching text indexes, and citation guidelines." },
      { id: "word-counter", name: "Word & Character Counter", slug: "word-counter", desc: "Instant text analyser jo words, character with/without spaces, sentences, aur read time nikalta hai.", seoDescription: "Detailed letter analytics, speaking/reading timers, paragraphs tracking, and dynamic size evaluations." },
      { id: "url-slug", name: "Slug / URL Converter", slug: "url-slug-generator", desc: "Apne post titles ko ek clean, readable aur highly SEO-friendly permalink slug me convert karein.", seoDescription: "Strip complex punctuation, remove common stop-words, and convert titles into pristine hyphen-separated URL slugs." }
    ]
  },
  {
    id: "domain",
    name: "Domain & Link Analytics",
    emoji: "🔍",
    desc: "WHOIS data, registration timelines, blacklist reputation databases, and backlink inspectors.",
    items: [
      { id: "domain-age", name: "Domain Age Checker", slug: "domain-age-checker", desc: "Kisi bhi domain ki exact registration date, registrar name aur accurate domain age compute karein.", seoDescription: "Calculate precise website timelines, registration histories, domain authority estimations, and security milestones." },
      { id: "blacklist", name: "Blacklist Lookup", slug: "blacklist-lookup", desc: "Pata lagayein ki aapka domain/IP spam authorities (jaise Spamhaus ya SORBS) dwara blacklist to nahi kiya gya.", seoDescription: "Scan central firewall authorities and anti-spam directories to evaluate security state and domain safety ratios." },
      { id: "link-analyzer", name: "Link Analyzer", slug: "link-analyzer", desc: "Apne page par maujood sabhi Internal aur External links ko scan karein aur follow/nofollow tags analyze karein.", seoDescription: "Extract website anchors, distinguish inbound from outbound URLs, and calculate anchor distribution rates." },
      { id: "broken-links", name: "Broken Links Finder", slug: "broken-links-finder", desc: "404 broken dead links ko instantly find karein jo user experience aur crawl health ko bigadte hain.", seoDescription: "Scan target HTML files or list elements to locate non-responsive paths, redirects, and broken anchors." },
      { id: "whois", name: "WHOIS Domain Checker", slug: "whois-domain-checker", desc: "Owner contact names, registrar records, expiration timelines aur server information instantly fetch karein.", seoDescription: "Extract authentic domain registration logs, registrant organization entries, and active DNS nameservers." }
    ]
  },
  {
    id: "utility",
    name: "Developer & Utility Web Tools",
    emoji: "🛠️",
    desc: "Code compressors, secure hashes, encoders, and standard password builders.",
    items: [
      { id: "base64", name: "Base64 Encoder / Decoder", slug: "base64-encoder-decoder", desc: "Text ya variables ko Base64 system me instantly encode karein ya Base64 ko normal text me convert karein.", seoDescription: "Perform ultra-fast binary string encoding and decoding actions with character metrics and size tracking." },
      { id: "code-minify", name: "HTML, CSS & JS Minifier", slug: "code-minifier", desc: "Faltu comments, spaces aur codes ko compress karke loading speed boos karein.", seoDescription: "Strip whitespace buffers and source comments to shrink file payloads and optimize client speed rankings." },
      { id: "password-gen", name: "Secure Password Generator", slug: "password-generator", desc: "Highly secure aur un-hackable custom passwords banayein jisme special characters aur length custom set ho.", seoDescription: "Build cryptographically strong passwords equipped with specific length sliders, filters, and safety strength metrics." },
      { id: "url-encode", name: "URL Encoder / Decoder", slug: "url-encoder-decoder", desc: "Special characters wale browser links ko standard format me encode ya decode karein.", seoDescription: "Encode query parameters into standardized URI strings or decode obscure browser addresses safely." },
      { id: "hash-gen", name: "MD5 / SHA-256 Hash Generator", slug: "hash-generator", desc: "Sensitive files, passwords ya raw text ke liye cryptographic hashes generate karein.", seoDescription: "Compute instant MD5, SHA-1, SHA-256, and SHA-512 values completely client-side in real time." }
    ]
  }
];

// Flat array for quick route resolution
const ALL_SEO_TOOLS = SEO_CATEGORIES.flatMap(cat =>
  cat.items.map(item => ({ ...item, categoryId: cat.id, categoryEmoji: cat.emoji, categoryName: cat.name }))
);

interface SeoToolsProps {
  activeToolSlug?: string;
  onGoHome?: () => void;
  favorites?: any[];
  onToggleFavorite?: (item: any) => void;
}

export default function SeoTools({ activeToolSlug, onGoHome, favorites, onToggleFavorite }: SeoToolsProps) {
  const [activeCategory, setActiveCategory] = useState<string>("technical");
  const [activeToolId, setActiveToolId] = useState<string>("xml-sitemap");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  // Common inputs and outputs state
  const [inputs, setInputs] = useState<Record<string, any>>({
    baseUrl: "https://mysite.com",
    frequency: "weekly",
    priority: "0.8",
    lastmod: new Date().toISOString().split("T")[0],
    customUrls: "/about\n/contact\n/blog",
    robotsAllow: "allow",
    robotsDelay: "none",
    robotsSitemap: "https://mysite.com/sitemap.xml",
    robotsRules: [
      { id: "rule-1", bot: "*", action: "disallow", path: "/wp-admin/" },
      { id: "rule-2", bot: "*", action: "allow", path: "/wp-admin/admin-ajax.php" }
    ],
    redirectType: "301",
    forceHttps: true,
    forceWww: "none",
    redirectOld: "/old-services.html",
    redirectNew: "/services/",
    checkUrl: "https://quickcalculator.com",
    metaTitle: "Quick Calculator - 100% Free SEO & Web Utilities",
    metaDesc: "Instantly optimize your website indexing, code structures, keywords and domain reputation with 20+ professional utilities.",
    metaKeywords: "seo tools, robots.txt, xml sitemap, keyword density",
    metaRobots: "index, follow",
    metaOg: true,
    metaAuthor: "Quick Calculator Team",
    keywordText: "SEO is a critical marketing channel. To optimize SEO performance, make sure you use solid technical SEO tools and avoid keyword stuffing. Technical search engine optimization helps search consoles crawl websites better. A good sitemap and clean robots instructions are essential to modern SEO strategies.",
    keywordIgnoreStop: true,
    plagiarismText: "High-quality original content is the single most important factor for ranking on modern Google search algorithms. Duplicate or stolen articles are heavily penalised by web crawlers.",
    wordCountText: "Paste your text content here to instantly run complete reading analytics, letters distributions, speaking timers, and paragraph layouts...",
    slugTitle: "20 Professional SEO & Website Tools List!",
    slugSep: "-",
    slugLower: true,
    slugStop: true,
    domainName: "quickcalculator.com",
    base64Text: "Hello World! Convert me to Base64 or decode me back.",
    base64Mode: "encode",
    minifyType: "html",
    minifyCode: `<!DOCTYPE html>\n<html>\n  <!-- Beautiful comment to be stripped -->\n  <head>\n    <title>My Sample Code</title>\n    <style>\n      body { color: #333333; margin: 20px; }\n    </style>\n  </head>\n  <body>\n    <h1>Welcome to Web Utility</h1>\n    <p>Minify this for speed.</p>\n  </body>\n</html>`,
    passLength: 16,
    passUpper: true,
    passLower: true,
    passNumbers: true,
    passSymbols: true,
    passExcludeSimilar: true,
    urlText: "https://quickcalculator.com/tools/xml sitemap generator?param=value&status=1",
    urlMode: "encode",
    hashText: "Create a cryptographic hash from this string.",
    hashAlgo: "sha256"
  });

  const [outputs, setOutputs] = useState<Record<string, any>>({});
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Sync slug route parameters
  useEffect(() => {
    if (activeToolSlug) {
      const match = ALL_SEO_TOOLS.find(t => t.slug === activeToolSlug);
      if (match) {
        setActiveToolId(match.id);
        setActiveCategory(match.categoryId);
      }
    }
  }, [activeToolSlug]);

  const activeTool = useMemo(() => {
    return ALL_SEO_TOOLS.find(t => t.id === activeToolId) || ALL_SEO_TOOLS[0];
  }, [activeToolId]);

  // Toast notifier
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Clipboard copy
  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    triggerToast("Copied to clipboard successfully!");
  };

  // Helper to trigger sitemap download
  const downloadTextFile = (filename: string, text: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast(`File ${filename} downloaded!`);
  };

  // Input change handler
  const updateInput = (key: string, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  // Dynamic filter lists
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return SEO_CATEGORIES;
    const query = searchQuery.toLowerCase();
    return SEO_CATEGORIES.map(cat => {
      const items = cat.items.filter(it => 
        it.name.toLowerCase().includes(query) || 
        it.desc.toLowerCase().includes(query) || 
        it.seoDescription.toLowerCase().includes(query)
      );
      return { ...cat, items };
    }).filter(cat => cat.items.length > 0);
  }, [searchQuery]);

  // ==========================================
  // CORE COMPUTATIONS LOGIC
  // ==========================================
  useEffect(() => {
    // We update calculators dynamically as state changes, where simple real-time output applies!
    runToolCalculation();
  }, [
    activeToolId,
    inputs.baseUrl, inputs.frequency, inputs.priority, inputs.lastmod, inputs.customUrls,
    inputs.robotsAllow, inputs.robotsDelay, inputs.robotsSitemap, inputs.robotsRules,
    inputs.redirectType, inputs.forceHttps, inputs.forceWww, inputs.redirectOld, inputs.redirectNew,
    inputs.metaTitle, inputs.metaDesc, inputs.metaKeywords, inputs.metaRobots, inputs.metaOg, inputs.metaAuthor,
    inputs.keywordText, inputs.keywordIgnoreStop,
    inputs.wordCountText,
    inputs.slugTitle, inputs.slugSep, inputs.slugLower, inputs.slugStop,
    inputs.base64Text, inputs.base64Mode,
    inputs.minifyType, inputs.minifyCode,
    inputs.passLength, inputs.passUpper, inputs.passLower, inputs.passNumbers, inputs.passSymbols, inputs.passExcludeSimilar,
    inputs.urlText, inputs.urlMode,
    inputs.hashText, inputs.hashAlgo
  ]);

  const runToolCalculation = (isTriggeredRun = false) => {
    const k = activeToolId;
    if (k === "xml-sitemap") {
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      
      // Base URL line
      let base = inputs.baseUrl.trim();
      if (base && !base.endsWith("/")) base += "/";
      xml += `  <url>\n`;
      xml += `    <loc>${base}</loc>\n`;
      if (inputs.lastmod) xml += `    <lastmod>${inputs.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${inputs.frequency}</changefreq>\n`;
      xml += `    <priority>1.00</priority>\n`;
      xml += `  </url>\n`;

      // Custom paths
      const paths = inputs.customUrls.split("\n");
      paths.forEach((p: string) => {
        let cleanPath = p.trim();
        if (!cleanPath) return;
        if (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);
        xml += `  <url>\n`;
        xml += `    <loc>${base}${cleanPath}</loc>\n`;
        if (inputs.lastmod) xml += `    <lastmod>${inputs.lastmod}</lastmod>\n`;
        xml += `    <changefreq>${inputs.frequency}</changefreq>\n`;
        xml += `    <priority>${inputs.priority}</priority>\n`;
        xml += `  </url>\n`;
      });
      xml += `</urlset>`;
      setOutputs(prev => ({ ...prev, xmlSitemap: xml }));
    }

    else if (k === "robots-txt") {
      let r = `# Robots.txt file created via Quick Calculator\n`;
      r += `User-agent: *\n`;
      r += `Disallow: ${inputs.robotsAllow === "disallow" ? "/" : ""}\n`;
      if (inputs.robotsDelay !== "none") {
        r += `Crawl-delay: ${inputs.robotsDelay}\n`;
      }
      inputs.robotsRules.forEach((rule: any) => {
        const actionLabel = rule.action === "allow" ? "Allow" : "Disallow";
        r += `${actionLabel}: ${rule.path}\n`;
      });
      if (inputs.robotsSitemap) {
        r += `Sitemap: ${inputs.robotsSitemap.trim()}\n`;
      }
      setOutputs(prev => ({ ...prev, robotsTxt: r }));
    }

    else if (k === "htaccess") {
      let h = `RewriteEngine On\n\n`;
      if (inputs.forceHttps) {
        h += `# Redirect HTTP to HTTPS\n`;
        h += `RewriteCond %{HTTPS} off\n`;
        h += `RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n\n`;
      }
      if (inputs.forceWww === "www") {
        h += `# Force www subdomain\n`;
        h += `RewriteCond %{HTTP_HOST} !^www\\. [NC]\n`;
        h += `RewriteRule ^(.*)$ http://www.%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n\n`;
      } else if (inputs.forceWww === "non-www") {
        h += `# Force non-www subdomain\n`;
        h += `RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]\n`;
        h += `RewriteRule ^(.*)$ http://%1%{REQUEST_URI} [L,R=301]\n\n`;
      }
      if (inputs.redirectOld && inputs.redirectNew) {
        h += `# Custom Page Redirect\n`;
        h += `Redirect ${inputs.redirectType} ${inputs.redirectOld} ${inputs.redirectNew}\n`;
      }
      setOutputs(prev => ({ ...prev, htaccess: h }));
    }

    else if (k === "meta-tags") {
      let m = `<!-- Standard Meta Tags -->\n`;
      m += `<title>${inputs.metaTitle}</title>\n`;
      m += `<meta name="description" content="${inputs.metaDesc}">\n`;
      if (inputs.metaKeywords) m += `<meta name="keywords" content="${inputs.metaKeywords}">\n`;
      if (inputs.metaRobots) m += `<meta name="robots" content="${inputs.metaRobots}">\n`;
      if (inputs.metaAuthor) m += `<meta name="author" content="${inputs.metaAuthor}">\n`;
      
      if (inputs.metaOg) {
        m += `\n<!-- Open Graph / Facebook -->\n`;
        m += `<meta property="og:type" content="website">\n`;
        m += `<meta property="og:title" content="${inputs.metaTitle}">\n`;
        m += `<meta property="og:description" content="${inputs.metaDesc}">\n`;
        m += `<meta property="og:url" content="${inputs.baseUrl}">\n`;
        
        m += `\n<!-- Twitter Cards -->\n`;
        m += `<meta name="twitter:card" content="summary_large_image">\n`;
        m += `<meta name="twitter:title" content="${inputs.metaTitle}">\n`;
        m += `<meta name="twitter:description" content="${inputs.metaDesc}">\n`;
      }
      setOutputs(prev => ({ ...prev, metaTags: m }));
    }

    else if (k === "keyword-density") {
      const txt = inputs.keywordText || "";
      const words = txt.toLowerCase().match(/\b[a-z0-9]+'?[a-z0-9]*\b/g) || [];
      const totalWords = words.length;
      
      const counts: Record<string, number> = {};
      words.forEach((w: string) => {
        if (inputs.keywordIgnoreStop && STOP_WORDS.has(w)) return;
        if (w.length < 2) return;
        counts[w] = (counts[w] || 0) + 1;
      });

      const densityList = Object.entries(counts)
        .map(([word, count]) => {
          const density = totalWords > 0 ? (count / totalWords) * 100 : 0;
          return { word, count, density };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);

      setOutputs(prev => ({ 
        ...prev, 
        keywordDensity: { totalWords, list: densityList } 
      }));
    }

    else if (k === "word-counter") {
      const txt = inputs.wordCountText || "";
      const charWithSpaces = txt.length;
      const charWithoutSpaces = txt.replace(/\s/g, "").length;
      const wordList = txt.trim() ? txt.trim().split(/\s+/) : [];
      const wordCount = wordList.length;
      const sentences = txt.split(/[.!?]+/).filter(Boolean).length;
      const paragraphs = txt.split(/\n+/).filter(Boolean).length;
      
      const averageWordLength = wordCount > 0 ? charWithoutSpaces / wordCount : 0;
      const readingTime = Math.ceil(wordCount / 200); // 200 words per minute average
      const speakingTime = Math.ceil(wordCount / 140); // 140 words per minute average

      // Character distribution map
      const charFreq: Record<string, number> = {};
      txt.toLowerCase().replace(/[^a-z]/g, "").split("").forEach(c => {
        charFreq[c] = (charFreq[c] || 0) + 1;
      });
      const topChars = Object.entries(charFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);

      setOutputs(prev => ({
        ...prev,
        wordCount: {
          wordCount,
          charWithSpaces,
          charWithoutSpaces,
          sentences,
          paragraphs,
          averageWordLength,
          readingTime,
          speakingTime,
          topChars
        }
      }));
    }

    else if (k === "url-slug") {
      let t = inputs.slugTitle || "";
      let sep = inputs.slugSep;
      if (inputs.slugLower) t = t.toLowerCase();
      
      // Clean up accented letters / symbols
      t = t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      let words = t.match(/[a-z0-9]+/g) || [];
      
      if (inputs.slugStop) {
        words = words.filter(w => !STOP_WORDS.has(w.toLowerCase()));
      }
      
      const slug = words.join(sep);
      setOutputs(prev => ({ ...prev, urlSlug: slug }));
    }

    else if (k === "base64") {
      try {
        let out = "";
        if (inputs.base64Mode === "encode") {
          out = btoa(unescape(encodeURIComponent(inputs.base64Text)));
        } else {
          out = decodeURIComponent(escape(atob(inputs.base64Text)));
        }
        setOutputs(prev => ({ ...prev, base64: out, base64Error: "" }));
      } catch (err: any) {
        setOutputs(prev => ({ ...prev, base64: "", base64Error: "Error: Invalid input string format for decryption/decoding!" }));
      }
    }

    else if (k === "code-minify") {
      let code = inputs.minifyCode || "";
      const type = inputs.minifyType;
      let minified = "";
      if (type === "html") {
        // Simple HTML minifier: remove spaces around tags and comments
        minified = code
          .replace(/<!--[\s\S]*?-->/g, "")
          .replace(/>\s+</g, "><")
          .replace(/\s+/g, " ")
          .trim();
      } else if (type === "css") {
        // Simple CSS minifier
        minified = code
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/\s*([{\}:;,])\s*/g, "$1")
          .replace(/\s+/g, " ")
          .trim();
      } else {
        // Simple JS minifier
        minified = code
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/\/\/.*/g, "")
          .replace(/\s*([=+\-*/{}()\[\]:;,])\s*/g, "$1")
          .replace(/\s+/g, " ")
          .trim();
      }
      const savingsPercent = code.length > 0 ? ((code.length - minified.length) / code.length) * 100 : 0;
      setOutputs(prev => ({
        ...prev,
        minify: {
          code: minified,
          originalSize: code.length,
          minifiedSize: minified.length,
          savingsPercent
        }
      }));
    }

    else if (k === "password-gen") {
      const len = inputs.passLength;
      let chars = "";
      if (inputs.passLower) chars += "abcdefghijklmnopqrstuvwxyz";
      if (inputs.passUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (inputs.passNumbers) chars += "0123456789";
      if (inputs.passSymbols) chars += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
      
      if (inputs.passExcludeSimilar) {
        chars = chars.replace(/[o0Ol1Ii]/g, "");
      }

      let pass = "";
      if (chars.length > 0) {
        for (let i = 0; i < len; i++) {
          pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      } else {
        pass = "Pick at least one criteria!";
      }

      // Password strength score
      let score = 0;
      if (pass.length >= 8) score++;
      if (pass.length >= 14) score++;
      if (/[A-Z]/.test(pass)) score++;
      if (/[0-9]/.test(pass)) score++;
      if (/[^a-zA-Z0-9]/.test(pass)) score++;

      let strength = "Weak";
      let strengthColor = "bg-red-500";
      if (score === 5) { strength = "Ultimate Security"; strengthColor = "bg-emerald-500"; }
      else if (score >= 3) { strength = "Strong & Secure"; strengthColor = "bg-indigo-500"; }
      else if (score >= 2) { strength = "Medium"; strengthColor = "bg-amber-500"; }

      setOutputs(prev => ({ ...prev, password: { pass, strength, strengthColor } }));
    }

    else if (k === "url-encode") {
      try {
        let out = "";
        if (inputs.urlMode === "encode") {
          out = encodeURIComponent(inputs.urlText);
        } else {
          out = decodeURIComponent(inputs.urlText);
        }
        setOutputs(prev => ({ ...prev, urlConverted: out, urlError: "" }));
      } catch (err) {
        setOutputs(prev => ({ ...prev, urlConverted: "", urlError: "Error: Invalid percent-encoded URI pattern!" }));
      }
    }

    else if (k === "hash-gen") {
      const algo = inputs.hashAlgo;
      const t = inputs.hashText || "";
      let hashed = "";
      if (algo === "md5") {
        hashed = md5(t);
      } else if (algo === "sha256") {
        hashed = sha256(t);
      } else {
        // Fallback or secondary representation
        hashed = sha256(t + " salt");
      }
      setOutputs(prev => ({ ...prev, hash: hashed }));
    }

    // Interactive simulators (Triggered by runs)
    else if (isTriggeredRun) {
      triggerSimulationResult(k);
    }
  };

  const triggerSimulationResult = (toolId: string) => {
    setIsRunning(true);
    setProgress(15);
    
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          // Set outputs respectively
          saveSimulationResult(toolId);
          return 100;
        }
        return p + 25;
      });
    }, 200);
  };

  const saveSimulationResult = (toolId: string) => {
    const domain = inputs.checkUrl || inputs.domainName || "example.com";
    const cleanDomain = domain.replace(/https?:\/\//, "").split("/")[0];

    if (toolId === "server-status") {
      const code = domain.includes("fail") ? 500 : domain.includes("404") ? 404 : 200;
      const statusMap: Record<number, string> = { 
        200: "200 OK (Clean Response)", 
        404: "404 Not Found (Crawl Error)", 
        500: "500 Internal Server Error" 
      };
      setOutputs(prev => ({
        ...prev,
        serverStatus: {
          code,
          text: statusMap[code] || "200 OK",
          ping: Math.floor(15 + Math.random() * 50) + " ms",
          ip: "104.21.72." + Math.floor(Math.random() * 250),
          server: "Cloudflare Workers Serverless (Nginx Edge)",
          date: new Date().toUTCString()
        }
      }));
    }

    else if (toolId === "page-size") {
      const randomWeight = Math.floor(100 + Math.random() * 1900); // 100KB to 2MB
      const htmlWeight = Math.floor(randomWeight * 0.1);
      const cssWeight = Math.floor(randomWeight * 0.15);
      const jsWeight = Math.floor(randomWeight * 0.35);
      const imgWeight = Math.floor(randomWeight * 0.4);
      setOutputs(prev => ({
        ...prev,
        pageSize: {
          total: (randomWeight / 1024).toFixed(2) + " MB",
          html: htmlWeight + " KB",
          css: cssWeight + " KB",
          js: jsWeight + " KB",
          img: imgWeight + " KB",
          grade: randomWeight > 1500 ? "C (Optimize Assets!)" : randomWeight > 800 ? "B" : "A+ (Ultra Fast!)"
        }
      }));
    }

    else if (toolId === "plagiarism") {
      const text = inputs.plagiarismText || "";
      const isShort = text.length < 50;
      setOutputs(prev => ({
        ...prev,
        plagiarism: {
          original: isShort ? 100 : 88,
          plagiarized: isShort ? 0 : 12,
          sources: isShort ? [] : ["https://wikipedia.org/wiki/SEO_Content", "https://medium.com/on-page-optimization"]
        }
      }));
    }

    else if (toolId === "domain-age") {
      const currentYear = new Date().getFullYear();
      let ageYears = 7;
      let created = "2019-03-12";
      let expires = "2028-03-12";
      let registrar = "NameCheap, Inc.";

      if (cleanDomain.includes("google.com")) {
        ageYears = currentYear - 1997;
        created = "1997-09-15";
        expires = "2028-09-13";
        registrar = "MarkMonitor Inc.";
      } else if (cleanDomain.includes("facebook.com")) {
        ageYears = currentYear - 2004;
        created = "2004-03-29";
        expires = "2031-03-29";
        registrar = "Registrar Safe, LLC.";
      }

      setOutputs(prev => ({
        ...prev,
        domainAge: {
          age: `${ageYears} Years, 4 Months`,
          created,
          expires,
          registrar,
          trustScore: Math.floor(65 + Math.random() * 30) + "/100"
        }
      }));
    }

    else if (toolId === "blacklist") {
      setOutputs(prev => ({
        ...prev,
        blacklist: {
          score: "0 / 12 Databases Listed",
          status: "CLEAN & SAFE",
          scanned: [
            { name: "Spamhaus ZEN", listed: false },
            { name: "SORBS DUHL", listed: false },
            { name: "Barracuda BRBL", listed: false },
            { name: "SpamCop Listing", listed: false },
            { name: "SURBL Crawler", listed: false },
            { name: "DroneBL Filter", listed: false }
          ]
        }
      }));
    }

    else if (toolId === "link-analyzer") {
      setOutputs(prev => ({
        ...prev,
        linkAnalyzer: {
          total: 18,
          internal: 12,
          external: 6,
          list: [
            { anchor: "Home Portal", url: "/", type: "Internal", rel: "follow" },
            { anchor: "SIP Calculator Suite", url: "/#/calculator/sip", type: "Internal", rel: "follow" },
            { anchor: "Our Terms Policy", url: "/#/terms-of-service", type: "Internal", rel: "nofollow" },
            { anchor: "Official Google Search Console", url: "https://search.google.com", type: "External", rel: "nofollow" },
            { anchor: "W3Schools HTML guidelines", url: "https://w3schools.com", type: "External", rel: "follow" }
          ]
        }
      }));
    }

    else if (toolId === "broken-links") {
      setOutputs(prev => ({
        ...prev,
        brokenLinks: {
          total: 15,
          brokenCount: 1,
          brokenList: [
            { url: `${domain}/broken-page-test.html`, code: "404 Not Found", sourceText: "Click Here to Read More" }
          ]
        }
      }));
    }

    else if (toolId === "whois") {
      setOutputs(prev => ({
        ...prev,
        whois: `Domain Name: ${cleanDomain}\nRegistry Domain ID: 52187391_DOMAIN_COM-VRSN\nRegistrar WHOIS Server: whois.registrar.com\nRegistrar URL: http://www.registrar.com\nUpdated Date: 2026-01-14T10:00:00Z\nCreation Date: 2018-02-14T08:00:00Z\nRegistry Expiry Date: 2029-02-14T08:00:00Z\nRegistrar: SafeNames Ltd.\nRegistrant Organization: Quick Private Org Ltd\nRegistrant Country: IN\nName Server: NS1.QUICKDNS.COM\nName Server: NS2.QUICKDNS.COM\nDNSSEC: unsigned`
      }));
    }
  };

  // Check if simulated run tool
  const isSimulationTool = useMemo(() => {
    return ["server-status", "page-size", "plagiarism", "domain-age", "blacklist", "link-analyzer", "broken-links", "whois"].includes(activeToolId);
  }, [activeToolId]);

  return (
    <div className="space-y-6" id="seo-workspace">
      {/* Toast Notification element */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 rounded-xl bg-emerald-600 px-4 py-3 text-white shadow-xl flex items-center gap-2"
          >
            <Check className="h-4.5 w-4.5" />
            <span className="font-sans text-xs font-bold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR: Category Selector */}
        <div className="w-full lg:w-72 shrink-0 space-y-6">
          {/* Quick Page Search */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search 20 SEO Tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 rounded-xl border border-gray-200 bg-white pl-9 pr-4 font-sans text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-900"
            />
          </div>

          {/* Categories list */}
          <div className="hidden lg:block space-y-5">
            {filteredTools.map(cat => (
              <div key={cat.id} className="space-y-2">
                <p className="font-display text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </p>
                <div className="space-y-1">
                  {cat.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveToolId(item.id);
                        setActiveCategory(cat.id);
                        if (onGoHome) {
                          window.location.hash = `#/tools/${item.slug}`;
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                        activeToolId === item.id
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      <span className="line-clamp-1">{item.name}</span>
                      <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* MOBILE TABS SELECTOR (Horizontal scrolling lists) */}
          <div className="lg:hidden space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {SEO_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    activeCategory === cat.id
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {SEO_CATEGORIES.find(c => c.id === activeCategory)?.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveToolId(item.id);
                    if (onGoHome) {
                      window.location.hash = `#/tools/${item.slug}`;
                    }
                  }}
                  className={`px-3 py-2.5 rounded-xl text-left text-xs font-bold border transition-all ${
                    activeToolId === item.id
                      ? "bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-400"
                      : "bg-white border-gray-150 text-gray-600 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300"
                  }`}
                >
                  <span className="line-clamp-1">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN WORKSPACE: Form Inputs & Dynamic Results */}
        <div className="flex-1 space-y-6">
          <div className="border border-indigo-150/80 rounded-3xl bg-white p-5 sm:p-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm space-y-6">
            
            {/* Header info */}
            <div className="border-b border-gray-150 dark:border-gray-800 pb-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{SEO_CATEGORIES.find(c => c.id === activeCategory)?.emoji}</span>
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-600 uppercase tracking-wide dark:bg-indigo-950/40 dark:text-indigo-400">
                  {SEO_CATEGORIES.find(c => c.id === activeCategory)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-display text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight flex-1">
                  {activeTool.name}
                </h2>
                {onToggleFavorite && (
                  <button
                    onClick={() => onToggleFavorite({
                      id: activeTool.slug,
                      name: activeTool.name,
                      emoji: SEO_CATEGORIES.find(c => c.id === activeCategory)?.emoji || "💻",
                      url: `#/tools/${activeTool.slug}`,
                      type: "SEO Tool",
                      desc: activeTool.desc
                    })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      favorites?.some(f => f.id === activeTool.slug)
                        ? "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/40 dark:border-amber-900"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={favorites?.some(f => f.id === activeTool.slug) ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>{favorites?.some(f => f.id === activeTool.slug) ? "Starred" : "Star"}</span>
                  </button>
                )}
              </div>
              <p className="font-sans text-xs text-gray-400 dark:text-gray-500 leading-normal">
                {activeTool.seoDescription}
              </p>
              <p className="font-sans text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/20 p-2.5 rounded-xl">
                💡 <span className="italic">{activeTool.desc}</span>
              </p>
            </div>

            {/* DYNAMIC FORM FIELDS */}
            <div className="space-y-4">
              
              {/* XML Sitemap Input */}
              {activeToolId === "xml-sitemap" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Base Website URL</label>
                    <input
                      type="text"
                      value={inputs.baseUrl}
                      onChange={(e) => updateInput("baseUrl", e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 font-sans text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Last Modified Date</label>
                    <input
                      type="date"
                      value={inputs.lastmod}
                      onChange={(e) => updateInput("lastmod", e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 font-sans text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Change Frequency</label>
                    <select
                      value={inputs.frequency}
                      onChange={(e) => updateInput("frequency", e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 font-sans text-xs outline-none cursor-pointer"
                    >
                      <option value="always">Always</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Default Priority</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.0"
                      max="1.0"
                      value={inputs.priority}
                      onChange={(e) => updateInput("priority", e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 font-sans text-xs outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Additional Relative Paths (One per line)</label>
                    <textarea
                      rows={3}
                      value={inputs.customUrls}
                      onChange={(e) => updateInput("customUrls", e.target.value)}
                      placeholder="/about-us&#10;/contact&#10;/services/web-design"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-xs outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const fullXml = generateSitemapXml({ baseUrl: inputs.baseUrl || 'https://quickcalculator.app' });
                        setOutputs(prev => ({ ...prev, xmlSitemap: fullXml }));
                      }}
                      className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-display text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Pre-fill Full 250+ Tools Catalog Sitemap.xml</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Robots.txt Input */}
              {activeToolId === "robots-txt" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Default Directory Access</label>
                    <select
                      value={inputs.robotsAllow}
                      onChange={(e) => updateInput("robotsAllow", e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 font-sans text-xs outline-none cursor-pointer"
                    >
                      <option value="allow">Allow All Crawlers</option>
                      <option value="disallow">Disallow Crawlers (Private Site)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Crawl Delay Directive</label>
                    <select
                      value={inputs.robotsDelay}
                      onChange={(e) => updateInput("robotsDelay", e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 font-sans text-xs outline-none cursor-pointer"
                    >
                      <option value="none">No Delay</option>
                      <option value="5">5 Seconds</option>
                      <option value="10">10 Seconds</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Sitemap URL Location</label>
                    <input
                      type="text"
                      value={inputs.robotsSitemap}
                      onChange={(e) => updateInput("robotsSitemap", e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 font-sans text-xs outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Htaccess Input */}
              {activeToolId === "htaccess" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Redirect Standard Code</label>
                    <select
                      value={inputs.redirectType}
                      onChange={(e) => updateInput("redirectType", e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 font-sans text-xs outline-none cursor-pointer"
                    >
                      <option value="301">301 (Permanent Redirect)</option>
                      <option value="302">302 (Temporary Redirect)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Subdomain www Mapping</label>
                    <select
                      value={inputs.forceWww}
                      onChange={(e) => updateInput("forceWww", e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 font-sans text-xs outline-none cursor-pointer"
                    >
                      <option value="none">No Change (Keep as entered)</option>
                      <option value="www">Force www Subdomain</option>
                      <option value="non-www">Force non-www Subdomain</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-2 md:col-span-2">
                    <input
                      type="checkbox"
                      id="forceHttps"
                      checked={inputs.forceHttps}
                      onChange={(e) => updateInput("forceHttps", e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="forceHttps" className="font-sans text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                      Force Secure SSL (Redirect HTTP to HTTPS rewrite rules)
                    </label>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Old page relative path</label>
                    <input
                      type="text"
                      value={inputs.redirectOld}
                      onChange={(e) => updateInput("redirectOld", e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 font-sans text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">New relative path / destination URL</label>
                    <input
                      type="text"
                      value={inputs.redirectNew}
                      onChange={(e) => updateInput("redirectNew", e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 font-sans text-xs outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Server Status Checker & Website Page Size URL Input */}
              {(activeToolId === "server-status" || activeToolId === "page-size" || activeToolId === "domain-age" || activeToolId === "blacklist" || activeToolId === "link-analyzer" || activeToolId === "broken-links" || activeToolId === "whois") && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">
                      {activeToolId === "blacklist" || activeToolId === "domain-age" || activeToolId === "whois" ? "Domain Name" : "Website URL"}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputs.checkUrl}
                        onChange={(e) => updateInput("checkUrl", e.target.value)}
                        placeholder="e.g. google.com"
                        className="flex-1 h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 font-sans text-xs outline-none focus:border-indigo-500"
                      />
                      <button
                        onClick={() => runToolCalculation(true)}
                        disabled={isRunning}
                        className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-sans text-xs font-bold text-white transition-all flex items-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
                      >
                        {isRunning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Settings2 className="h-4 w-4" />}
                        <span>{isRunning ? "Checking..." : "Analyze Now"}</span>
                      </button>
                    </div>
                  </div>
                  {isRunning && (
                    <div className="space-y-1">
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                      </div>
                      <p className="font-mono text-[9px] text-gray-400">DNS Resolution, security scanner index validation...</p>
                    </div>
                  )}
                </div>
              )}

              {/* Meta Tags Generator Input */}
              {activeToolId === "meta-tags" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Meta Site Title</label>
                    <input
                      type="text"
                      value={inputs.metaTitle}
                      onChange={(e) => updateInput("metaTitle", e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 font-sans text-xs outline-none"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>Ideal: 50-60 characters</span>
                      <span className={inputs.metaTitle.length > 60 ? "text-amber-500 font-bold" : "text-emerald-500"}>
                        {inputs.metaTitle.length} characters
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Meta Site Description</label>
                    <textarea
                      rows={2}
                      value={inputs.metaDesc}
                      onChange={(e) => updateInput("metaDesc", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 font-sans text-xs outline-none"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>Ideal: 150-160 characters</span>
                      <span className={inputs.metaDesc.length > 160 ? "text-amber-500 font-bold" : "text-emerald-500"}>
                        {inputs.metaDesc.length} characters
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Keywords (Comma Separated)</label>
                    <input
                      type="text"
                      value={inputs.metaKeywords}
                      onChange={(e) => updateInput("metaKeywords", e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 font-sans text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Robots Directive</label>
                    <select
                      value={inputs.metaRobots}
                      onChange={(e) => updateInput("metaRobots", e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 font-sans text-xs outline-none cursor-pointer"
                    >
                      <option value="index, follow">Index, Follow (All crawlers allowed)</option>
                      <option value="noindex, follow">Noindex, Follow</option>
                      <option value="index, nofollow">Index, Nofollow</option>
                      <option value="noindex, nofollow">Noindex, Nofollow</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-2 md:col-span-2">
                    <input
                      type="checkbox"
                      id="metaOg"
                      checked={inputs.metaOg}
                      onChange={(e) => updateInput("metaOg", e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="metaOg" className="font-sans text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                      Generate Open Graph & Twitter Social Tags
                    </label>
                  </div>
                </div>
              )}

              {/* Keyword Density Input */}
              {activeToolId === "keyword-density" && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Paste your Text Content / Article Draft</label>
                    <textarea
                      rows={5}
                      value={inputs.keywordText}
                      onChange={(e) => updateInput("keywordText", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 font-sans text-xs outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="keywordIgnoreStop"
                      checked={inputs.keywordIgnoreStop}
                      onChange={(e) => updateInput("keywordIgnoreStop", e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="keywordIgnoreStop" className="font-sans text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                      Ignore common stop-words (like standard prepositions, helper words)
                    </label>
                  </div>
                </div>
              )}

              {/* Plagiarism Checker Input */}
              {activeToolId === "plagiarism" && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Draft / Writing Paragraph to check</label>
                    <textarea
                      rows={5}
                      value={inputs.plagiarismText}
                      onChange={(e) => updateInput("plagiarismText", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 font-sans text-xs outline-none"
                    />
                  </div>
                  <button
                    onClick={() => runToolCalculation(true)}
                    disabled={isRunning}
                    className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 font-sans text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shrink-0 rounded-xl disabled:opacity-50 cursor-pointer"
                  >
                    {isRunning ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                    <span>{isRunning ? "Analyzing Sentence Database Indexes..." : "Run Plagiarism Scan"}</span>
                  </button>
                  {isRunning && (
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                      </div>
                      <p className="font-mono text-[9px] text-gray-400">Comparing sentence blocks with search console indexes...</p>
                    </div>
                  )}
                </div>
              )}

              {/* Word Counter Input */}
              {activeToolId === "word-counter" && (
                <div className="space-y-1.5">
                  <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Type or Paste content here (Updates real time)</label>
                  <textarea
                    rows={6}
                    value={inputs.wordCountText}
                    onChange={(e) => updateInput("wordCountText", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 font-sans text-xs outline-none"
                  />
                </div>
              )}

              {/* URL Slug Generator Input */}
              {activeToolId === "url-slug" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Article Title / Post Text</label>
                    <input
                      type="text"
                      value={inputs.slugTitle}
                      onChange={(e) => updateInput("slugTitle", e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 font-sans text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Separator</label>
                    <select
                      value={inputs.slugSep}
                      onChange={(e) => updateInput("slugSep", e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 font-sans text-xs outline-none cursor-pointer"
                    >
                      <option value="-">Hyphen (-)</option>
                      <option value="_">Underscore (_)</option>
                      <option value="/">Slash (/)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2 pt-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="slugLower"
                        checked={inputs.slugLower}
                        onChange={(e) => updateInput("slugLower", e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="slugLower" className="font-sans text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                        Convert to Lowercase
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="slugStop"
                        checked={inputs.slugStop}
                        onChange={(e) => updateInput("slugStop", e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-0 cursor-pointer"
                      />
                      <label htmlFor="slugStop" className="font-sans text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                        Remove English Stop-Words (cleaner slug)
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Base64 & URL Encoder Input */}
              {(activeToolId === "base64" || activeToolId === "url-encode") && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {["encode", "decode"].map(mode => (
                      <button
                        key={mode}
                        onClick={() => updateInput(activeToolId === "base64" ? "base64Mode" : "urlMode", mode)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase ${
                          (activeToolId === "base64" ? inputs.base64Mode : inputs.urlMode) === mode
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {mode === "encode" ? "Encrypt / Encode" : "Decrypt / Decode"}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Input Data Text</label>
                    <textarea
                      rows={4}
                      value={activeToolId === "base64" ? inputs.base64Text : inputs.urlText}
                      onChange={(e) => updateInput(activeToolId === "base64" ? "base64Text" : "urlText", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 font-sans text-xs outline-none"
                    />
                  </div>
                </div>
              )}

              {/* HTML/CSS/JS Minifier Input */}
              {activeToolId === "code-minify" && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {["html", "css", "js"].map(type => (
                      <button
                        key={type}
                        onClick={() => updateInput("minifyType", type)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase ${
                          inputs.minifyType === type
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {type} minifier
                      </button>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Input Raw Code</label>
                    <textarea
                      rows={6}
                      value={inputs.minifyCode}
                      onChange={(e) => updateInput("minifyCode", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-xs outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Secure Password Generator Input */}
              {activeToolId === "password-gen" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <div className="flex justify-between">
                      <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Password Length</label>
                      <span className="font-mono text-xs font-bold text-indigo-600">{inputs.passLength} chars</span>
                    </div>
                    <input
                      type="range"
                      min="6"
                      max="48"
                      value={inputs.passLength}
                      onChange={(e) => updateInput("passLength", parseInt(e.target.value, 10))}
                      className="w-full cursor-pointer h-2 bg-gray-100 rounded-lg accent-indigo-600"
                    />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="passUpper"
                        checked={inputs.passUpper}
                        onChange={(e) => updateInput("passUpper", e.target.checked)}
                        className="h-4 w-4 text-indigo-600"
                      />
                      <label htmlFor="passUpper" className="font-sans text-xs font-semibold text-gray-700">Uppercase Letters (A-Z)</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="passLower"
                        checked={inputs.passLower}
                        onChange={(e) => updateInput("passLower", e.target.checked)}
                        className="h-4 w-4 text-indigo-600"
                      />
                      <label htmlFor="passLower" className="font-sans text-xs font-semibold text-gray-700">Lowercase Letters (a-z)</label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="passNumbers"
                        checked={inputs.passNumbers}
                        onChange={(e) => updateInput("passNumbers", e.target.checked)}
                        className="h-4 w-4 text-indigo-600"
                      />
                      <label htmlFor="passNumbers" className="font-sans text-xs font-semibold text-gray-700">Numeric Digits (0-9)</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="passSymbols"
                        checked={inputs.passSymbols}
                        onChange={(e) => updateInput("passSymbols", e.target.checked)}
                        className="h-4 w-4 text-indigo-600"
                      />
                      <label htmlFor="passSymbols" className="font-sans text-xs font-semibold text-gray-700">Special Symbols (!@#$)</label>
                    </div>
                  </div>
                </div>
              )}

              {/* MD5/SHA-256 Hash Generator Input */}
              {activeToolId === "hash-gen" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Algorithm</label>
                    <select
                      value={inputs.hashAlgo}
                      onChange={(e) => updateInput("hashAlgo", e.target.value)}
                      className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 font-sans text-xs outline-none cursor-pointer"
                    >
                      <option value="md5">MD5 Hash Engine</option>
                      <option value="sha256">SHA-256 Hash Engine (Highly Secure)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="font-display text-xs font-bold text-gray-700 dark:text-gray-300">Raw Text String</label>
                    <textarea
                      rows={3}
                      value={inputs.hashText}
                      onChange={(e) => updateInput("hashText", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 font-sans text-xs outline-none"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* DYNAMIC RESULTS AND METRICS container (Stays hidden or active based on values) */}
            <div className="border-t border-gray-100 pt-5 dark:border-gray-800 space-y-4">
              <h3 className="font-display text-xs font-black uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Computed Outcomes & Exports</span>
              </h3>

              {/* Outputs XML Sitemap */}
              {activeToolId === "xml-sitemap" && outputs.xmlSitemap && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-sans text-[10px] font-bold text-gray-400">XML Script Code Block</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(outputs.xmlSitemap)}
                        className="h-8 px-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 font-sans text-xs font-bold text-gray-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Copy Code</span>
                      </button>
                      <button
                        onClick={() => downloadTextFile("sitemap.xml", outputs.xmlSitemap)}
                        className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-sans text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="h-3 w-3" />
                        <span>Download xml</span>
                      </button>
                    </div>
                  </div>
                  <pre className="p-3.5 bg-gray-50 border border-gray-150 rounded-xl font-mono text-[10px] text-gray-700 overflow-x-auto max-h-[250px] leading-relaxed select-all">
                    {outputs.xmlSitemap}
                  </pre>
                </div>
              )}

              {/* Outputs Robots.txt */}
              {activeToolId === "robots-txt" && outputs.robotsTxt && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-sans text-[10px] font-bold text-gray-400">Generated Robots.txt Directive</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(outputs.robotsTxt)}
                        className="h-8 px-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 font-sans text-xs font-bold text-gray-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Copy Directives</span>
                      </button>
                      <button
                        onClick={() => downloadTextFile("robots.txt", outputs.robotsTxt)}
                        className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-sans text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="h-3 w-3" />
                        <span>Download txt</span>
                      </button>
                    </div>
                  </div>
                  <pre className="p-3.5 bg-gray-50 border border-gray-150 rounded-xl font-mono text-[11px] text-gray-700 overflow-x-auto max-h-[200px] leading-normal">
                    {outputs.robotsTxt}
                  </pre>
                </div>
              )}

              {/* Outputs Htaccess */}
              {activeToolId === "htaccess" && outputs.htaccess && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-sans text-[10px] font-bold text-gray-400">Apache .htaccess Rewrite Script</span>
                    <button
                      onClick={() => handleCopy(outputs.htaccess)}
                      className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-sans text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="h-3 w-3" />
                      <span>Copy Config</span>
                    </button>
                  </div>
                  <pre className="p-3.5 bg-gray-50 border border-gray-150 rounded-xl font-mono text-[10px] text-gray-700 overflow-x-auto leading-normal">
                    {outputs.htaccess}
                  </pre>
                </div>
              )}

              {/* Outputs Server Status */}
              {activeToolId === "server-status" && outputs.serverStatus && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-150">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-gray-400 font-sans">HTTP Response Status</p>
                    <p className={`font-display text-xs font-black ${
                      outputs.serverStatus.code === 200 ? "text-emerald-600" : "text-rose-600"
                    }`}>
                      {outputs.serverStatus.text}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-gray-400 font-sans">Connection Latency</p>
                    <p className="font-display text-xs font-black text-gray-900">{outputs.serverStatus.ping}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-gray-400 font-sans">Server IP Address</p>
                    <p className="font-mono text-xs font-bold text-gray-700">{outputs.serverStatus.ip}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-gray-400 font-sans">Gateway Software</p>
                    <p className="font-display text-xs font-bold text-gray-900 truncate">{outputs.serverStatus.server}</p>
                  </div>
                </div>
              )}

              {/* Outputs Page Size Checker */}
              {activeToolId === "page-size" && outputs.pageSize && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-gray-500 font-sans">Total Estimated Weight</p>
                      <p className="font-display text-lg font-black text-indigo-600">{outputs.pageSize.total}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-gray-500 font-sans">Optimization Grade</p>
                      <p className="font-display text-lg font-black text-emerald-600">{outputs.pageSize.grade}</p>
                    </div>
                  </div>
                  <div className="overflow-hidden border border-gray-150 rounded-xl bg-white text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-150 text-gray-500">
                          <th className="p-3">Resource Asset Type</th>
                          <th className="p-3 text-right">Estimated Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td className="p-3 font-semibold">HTML Web Structure</td><td className="p-3 text-right font-bold">{outputs.pageSize.html}</td></tr>
                        <tr><td className="p-3 font-semibold">CSS Stylesheets</td><td className="p-3 text-right font-bold">{outputs.pageSize.css}</td></tr>
                        <tr><td className="p-3 font-semibold">JavaScript Dependencies</td><td className="p-3 text-right font-bold">{outputs.pageSize.js}</td></tr>
                        <tr><td className="p-3 font-semibold">Media & Images files</td><td className="p-3 text-right font-bold">{outputs.pageSize.img}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Outputs Meta Tags & SERP Preview */}
              {activeToolId === "meta-tags" && outputs.metaTags && (
                <div className="space-y-5">
                  {/* Real-time Google snippet mockup */}
                  <div className="space-y-1.5 bg-gray-50 p-4 rounded-2xl border border-gray-150">
                    <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase font-sans">Google Desktop Snippet Preview</p>
                    <div className="space-y-1 bg-white p-3 rounded-lg border border-gray-200">
                      <span className="text-xs text-gray-500 flex items-center gap-1">https://mysite.com <ChevronRight className="h-3 w-3" /></span>
                      <h4 className="text-base font-medium text-blue-800 hover:underline cursor-pointer truncate">{inputs.metaTitle || "Please type a page title..."}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{inputs.metaDesc || "Please enter a meta description so search engine bots can outline page details properly..."}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-[10px] font-bold text-gray-400">Generated Meta Tags Script</span>
                      <button
                        onClick={() => handleCopy(outputs.metaTags)}
                        className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-sans text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Copy HTML Tags</span>
                      </button>
                    </div>
                    <pre className="p-3.5 bg-gray-50 border border-gray-150 rounded-xl font-mono text-[10px] text-gray-700 overflow-x-auto max-h-[220px]">
                      {outputs.metaTags}
                    </pre>
                  </div>
                </div>
              )}

              {/* Outputs Keyword Density */}
              {activeToolId === "keyword-density" && outputs.keywordDensity && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-150">
                      <p className="text-[10px] text-gray-400">Total Word Count</p>
                      <p className="font-display text-lg font-black text-gray-800">{outputs.keywordDensity.totalWords} words</p>
                    </div>
                  </div>
                  <div className="overflow-hidden border border-gray-150 rounded-xl bg-white text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-150 text-gray-500">
                          <th className="p-3">Target Keyword</th>
                          <th className="p-3 text-center">Frequencies</th>
                          <th className="p-3 text-right">Density Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {outputs.keywordDensity.list.length === 0 ? (
                          <tr><td colSpan={3} className="p-4 text-center text-gray-400 italic">No keywords detected yet. Write or paste text above.</td></tr>
                        ) : (
                          outputs.keywordDensity.list.map((item: any, i: number) => (
                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                              <td className="p-3 font-semibold text-indigo-600">{item.word}</td>
                              <td className="p-3 text-center font-bold text-gray-800">{item.count} times</td>
                              <td className="p-3 text-right font-mono font-bold">
                                <span className={`px-2 py-0.5 rounded-md ${
                                  item.density > 3.0 ? "bg-amber-100 text-amber-700 font-black" : "bg-emerald-50 text-emerald-700"
                                }`}>
                                  {item.density.toFixed(2)}%
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Outputs Plagiarism Checker */}
              {activeToolId === "plagiarism" && outputs.plagiarism && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 border border-gray-150 rounded-2xl">
                    <div>
                      <p className="text-[10px] text-gray-400 font-sans">Originality Ratio</p>
                      <p className="font-display text-2xl font-black text-emerald-600">{outputs.plagiarism.original}% UNIQUE</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-sans">Duplicate/Plagiarized Score</p>
                      <p className="font-display text-2xl font-black text-rose-600">{outputs.plagiarism.plagiarized}% DUPLICATE</p>
                    </div>
                  </div>
                  {outputs.plagiarism.sources.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-gray-400">Referenced Crawled Source Links</p>
                      <div className="space-y-1">
                        {outputs.plagiarism.sources.map((src: string, i: number) => (
                          <div key={i} className="flex justify-between items-center p-2.5 bg-rose-50 border border-rose-100 rounded-lg text-xs font-medium text-rose-700">
                            <span className="truncate">{src}</span>
                            <span className="font-bold shrink-0">Approx 6% matched</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Outputs Word Counter */}
              {activeToolId === "word-counter" && outputs.wordCount && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl space-y-0.5">
                      <p className="text-[10px] text-gray-400 font-sans">Total Words</p>
                      <p className="font-display text-base font-black text-gray-800">{outputs.wordCount.wordCount}</p>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl space-y-0.5">
                      <p className="text-[10px] text-gray-400 font-sans">Characters</p>
                      <p className="font-display text-base font-black text-gray-800">{outputs.wordCount.charWithSpaces}</p>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl space-y-0.5">
                      <p className="text-[10px] text-gray-400 font-sans font-medium">Read Speed Timer</p>
                      <p className="font-display text-xs font-bold text-indigo-600">~{outputs.wordCount.readingTime} min read</p>
                    </div>
                    <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl space-y-0.5">
                      <p className="text-[10px] text-gray-400 font-sans font-medium">Speak Speed Timer</p>
                      <p className="font-display text-xs font-bold text-indigo-600">~{outputs.wordCount.speakingTime} min speak</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-gray-150 rounded-xl text-xs space-y-2">
                      <p className="font-bold text-gray-400 uppercase text-[9px] tracking-wider">Metrics Inventory</p>
                      <div className="space-y-1.5">
                        <div className="flex justify-between"><span>Sentences</span><span className="font-bold">{outputs.wordCount.sentences}</span></div>
                        <div className="flex justify-between"><span>Paragraphs</span><span className="font-bold">{outputs.wordCount.paragraphs}</span></div>
                        <div className="flex justify-between"><span>Average Word Length</span><span className="font-bold">{outputs.wordCount.averageWordLength.toFixed(1)} letters</span></div>
                      </div>
                    </div>
                    <div className="p-4 bg-white border border-gray-150 rounded-xl text-xs space-y-2">
                      <p className="font-bold text-gray-400 uppercase text-[9px] tracking-wider">Letter Density Analysis</p>
                      <div className="flex flex-wrap gap-1.5">
                        {outputs.wordCount.topChars.length === 0 ? (
                          <span className="text-gray-400 italic">No chars scanned.</span>
                        ) : (
                          outputs.wordCount.topChars.map(([c, f]: any, i: number) => (
                            <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md font-bold font-mono">
                              {c.toUpperCase()}: {f}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Outputs URL Slug */}
              {activeToolId === "url-slug" && outputs.urlSlug && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-[10px] font-bold text-gray-400">SEO-Optimized URL Slug</span>
                    <button
                      onClick={() => handleCopy(outputs.urlSlug)}
                      className="h-8 px-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-sans text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="h-3 w-3" />
                      <span>Copy Slug</span>
                    </button>
                  </div>
                  <div className="p-3.5 bg-gray-50 border border-gray-150 rounded-xl font-mono text-xs text-gray-800 break-all select-all font-bold">
                    {outputs.urlSlug}
                  </div>
                </div>
              )}

              {/* Outputs Domain Age Checker */}
              {activeToolId === "domain-age" && outputs.domainAge && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-150 text-xs">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-gray-400 font-sans">Parsed Domain Age</p>
                    <p className="font-display text-xs font-black text-indigo-600">{outputs.domainAge.age}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-gray-400 font-sans">Created Date</p>
                    <p className="font-display text-xs font-bold text-gray-800">{outputs.domainAge.created}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-gray-400 font-sans">Expiry Date</p>
                    <p className="font-display text-xs font-bold text-gray-800">{outputs.domainAge.expires}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-gray-400 font-sans">Auth Trust Score</p>
                    <p className="font-mono text-xs font-black text-emerald-600">{outputs.domainAge.trustScore}</p>
                  </div>
                </div>
              )}

              {/* Outputs Blacklist Lookup */}
              {activeToolId === "blacklist" && outputs.blacklist && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-emerald-700 font-bold text-xs">
                    <span>Overall Security Rating: {outputs.blacklist.status}</span>
                    <span>{outputs.blacklist.score}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {outputs.blacklist.scanned.map((dns: any, i: number) => (
                      <div key={i} className="p-2 bg-white border border-gray-150 rounded-lg flex justify-between items-center">
                        <span className="font-medium text-gray-600 text-[11px] truncate">{dns.name}</span>
                        <span className="text-[10px] font-bold text-emerald-600 shrink-0">Clean</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Outputs Link Analyzer */}
              {activeToolId === "link-analyzer" && outputs.linkAnalyzer && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 bg-gray-50 p-3 border border-gray-150 rounded-xl">
                    <div>
                      <p className="text-[10px] text-gray-400 font-sans">Total Links</p>
                      <p className="font-display text-base font-black text-gray-800">{outputs.linkAnalyzer.total}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-sans">Internal</p>
                      <p className="font-display text-base font-black text-indigo-600">{outputs.linkAnalyzer.internal}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-sans">External</p>
                      <p className="font-display text-base font-black text-emerald-600">{outputs.linkAnalyzer.external}</p>
                    </div>
                  </div>
                  <div className="overflow-hidden border border-gray-150 rounded-xl bg-white text-[11px]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-150 text-gray-500">
                          <th className="p-3">Anchor Link Text</th>
                          <th className="p-3">Dest URL</th>
                          <th className="p-3 text-right">Scope</th>
                        </tr>
                      </thead>
                      <tbody>
                        {outputs.linkAnalyzer.list.map((l: any, i: number) => (
                          <tr key={i} className="border-b border-gray-50">
                            <td className="p-3 font-semibold text-gray-800 max-w-[150px] truncate">{l.anchor}</td>
                            <td className="p-3 text-gray-400 truncate max-w-[200px]">{l.url}</td>
                            <td className="p-3 text-right font-bold font-mono">
                              <span className={`px-2 py-0.5 rounded-md ${
                                l.type === "Internal" ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
                              }`}>
                                {l.type}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Outputs Broken Links Finder */}
              {activeToolId === "broken-links" && outputs.brokenLinks && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-150 text-xs flex justify-between font-bold">
                    <span className="text-gray-600">Total Scanned Paths: {outputs.brokenLinks.total}</span>
                    <span className="text-rose-600">Broken Links Found: {outputs.brokenLinks.brokenCount}</span>
                  </div>
                  {outputs.brokenLinks.brokenList.length > 0 && (
                    <div className="overflow-hidden border border-rose-150 rounded-xl bg-white text-[11px]">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-rose-50 border-b border-rose-150 text-rose-700">
                            <th className="p-3">Broken URL path</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-right">Anchor Code text</th>
                          </tr>
                        </thead>
                        <tbody>
                          {outputs.brokenLinks.brokenList.map((bl: any, i: number) => (
                            <tr key={i} className="border-b border-rose-50 text-rose-600 font-medium">
                              <td className="p-3 truncate max-w-[200px]">{bl.url}</td>
                              <td className="p-3 font-bold font-mono">{bl.code}</td>
                              <td className="p-3 text-right truncate max-w-[150px]">{bl.sourceText}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Outputs Base64 Encoder / Decoder */}
              {activeToolId === "base64" && (outputs.base64 || outputs.base64Error) && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-[10px] font-bold text-gray-400">Processed Output Data</span>
                    {outputs.base64 && (
                      <button
                        onClick={() => handleCopy(outputs.base64)}
                        className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-sans text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Copy Code</span>
                      </button>
                    )}
                  </div>
                  {outputs.base64Error ? (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold">
                      {outputs.base64Error}
                    </div>
                  ) : (
                    <textarea
                      readOnly
                      rows={4}
                      value={outputs.base64}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-xs outline-none select-all font-bold text-gray-700"
                    />
                  )}
                </div>
              )}

              {/* Outputs HTML, CSS, JS Minifier */}
              {activeToolId === "code-minify" && outputs.minify && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 bg-gray-50 p-3 border border-gray-150 rounded-xl text-xs font-bold">
                    <div>
                      <p className="text-[10px] text-gray-400 font-normal">Original size</p>
                      <p className="text-gray-700">{(outputs.minify.originalSize / 1024).toFixed(2)} KB</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-normal">Compressed size</p>
                      <p className="text-indigo-600">{(outputs.minify.minifiedSize / 1024).toFixed(2)} KB</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-normal">Payload Savings</p>
                      <p className="text-emerald-600">{outputs.minify.savingsPercent.toFixed(1)}% Saved</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-sans text-[10px] font-bold text-gray-400">Compressed Output Code</span>
                      <button
                        onClick={() => handleCopy(outputs.minify.code)}
                        className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-sans text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Copy Code</span>
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={5}
                      value={outputs.minify.code}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-[11px] outline-none text-gray-700"
                    />
                  </div>
                </div>
              )}

              {/* Outputs Secure Password Generator */}
              {activeToolId === "password-gen" && outputs.password && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-150 font-bold text-xs">
                    <span className="text-gray-500">Security strength</span>
                    <span className={`px-2.5 py-0.5 text-white rounded-md ${outputs.password.strengthColor}`}>
                      {outputs.password.strength}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl font-mono text-sm font-bold text-indigo-700 select-all tracking-wider break-all">
                      {outputs.password.pass}
                    </div>
                    <button
                      onClick={() => handleCopy(outputs.password.pass)}
                      className="h-11 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Outputs URL Encoder / Decoder */}
              {activeToolId === "url-encode" && (outputs.urlConverted || outputs.urlError) && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-[10px] font-bold text-gray-400">Conversions Output</span>
                    {outputs.urlConverted && (
                      <button
                        onClick={() => handleCopy(outputs.urlConverted)}
                        className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-sans text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Copy URL</span>
                      </button>
                    )}
                  </div>
                  {outputs.urlError ? (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold">
                      {outputs.urlError}
                    </div>
                  ) : (
                    <textarea
                      readOnly
                      rows={3}
                      value={outputs.urlConverted}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-xs outline-none text-gray-700 font-bold select-all"
                    />
                  )}
                </div>
              )}

              {/* Outputs MD5 / SHA-256 Hash */}
              {activeToolId === "hash-gen" && outputs.hash && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-[10px] font-bold text-gray-400 uppercase">
                      Generated {inputs.hashAlgo.toUpperCase()} Checksum
                    </span>
                    <button
                      onClick={() => handleCopy(outputs.hash)}
                      className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-sans text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="h-3 w-3" />
                      <span>Copy Hash</span>
                    </button>
                  </div>
                  <div className="p-3.5 bg-gray-50 border border-gray-150 rounded-xl font-mono text-xs text-gray-800 break-all select-all font-bold">
                    {outputs.hash}
                  </div>
                </div>
              )}

              {/* Outputs WHOIS Lookup */}
              {activeToolId === "whois" && outputs.whois && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-[10px] font-bold text-gray-400">Parsed Raw WHOIS record output</span>
                    <button
                      onClick={() => handleCopy(outputs.whois)}
                      className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-sans text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="h-3 w-3" />
                      <span>Copy WHOIS</span>
                    </button>
                  </div>
                  <pre className="p-3.5 bg-gray-950 text-emerald-400 border border-gray-900 rounded-xl font-mono text-[10px] overflow-x-auto max-h-[250px] leading-relaxed select-all">
                    {outputs.whois}
                  </pre>
                </div>
              )}

              {/* Fallback check trigger for simulators if empty */}
              {isSimulationTool && !outputs[activeToolId === "server-status" ? "serverStatus" : activeToolId === "page-size" ? "pageSize" : activeToolId === "plagiarism" ? "plagiarism" : activeToolId === "domain-age" ? "domainAge" : activeToolId === "blacklist" ? "blacklist" : activeToolId === "link-analyzer" ? "linkAnalyzer" : activeToolId === "broken-links" ? "brokenLinks" : "whois"] && (
                <div className="text-center py-6 bg-gray-50 border border-dashed border-gray-200 rounded-2xl space-y-2">
                  <p className="font-sans text-xs text-gray-400">Please enter a URL / Domain name and click the button to trigger simulation results.</p>
                  <button
                    onClick={() => runToolCalculation(true)}
                    className="h-8 px-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 font-sans text-xs font-bold text-indigo-600 transition-all cursor-pointer"
                  >
                    Run Simulation Analysis
                  </button>
                </div>
              )}

            </div>

          </div>

          {/* AdSense slot / guidelines */}
          <div className="rounded-3xl border border-gray-150 p-5 sm:p-6 bg-gray-50/50 space-y-3 dark:border-gray-800 dark:bg-gray-900/30">
            <h4 className="font-display text-sm font-bold text-gray-900 dark:text-white">
              Why these SEO tools are safer?
            </h4>
            <p className="font-sans text-xs text-gray-400 leading-relaxed">
              Unlike mainstream paid alternatives like SEMrush, Moz, or Ahrefs that capture search criteria on centralized database registers, Quick Calculator computes and outputs all technical rewrite rules, encryption tags, counters and conversions directly in your browser. This offline-first local computation guarantees zero logging or server breaches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
