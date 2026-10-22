// फाइल का पता: data/toolsData.js

export const ALL_TOOLS = [
  // 1. Financial & Tax Calculators
  {
    id: "fin-01",
    slug: "sip-calculator", // इससे URL बनेगा: /tools/sip-calculator
    name: "SIP Calculator Online – Mutual Fund Return Calculator",
    shortName: "SIP Calculator",
    category: "Financial & Tax Calculators",
    badge: "100% Client-Side",
    difficulty: "Easy",
    popular: true,
    description: "Calculate wealth growth, total invested principal, capital gains, and inflation-adjusted corpus from monthly mutual fund SIP investments.",
    replaces: "Wealthfront / Vanguard ($120/yr)",
    formula: "M = P × ({[1 + i]^n – 1} / i) × (1 + i)",
    faqs: [
      {
        q: "SIP कैलकुलेटर कैसे काम करता है?",
        a: "यह आपके मासिक निवेश (Monthly Investment), अनुमानित ब्याज दर (Expected Return Rate) और समय (Years) के आधार पर चक्रवृद्धि ब्याज (Compound Interest) से कुल रिटर्न की गणना करता है।"
      },
      {
        q: "क्या SIP में निवेश सुरक्षित है?",
        a: "लंबे समय (5 से 15 साल) के लिए SIP में निवेश करने पर मार्केट के उतार-चढ़ाव का जोखिम कम हो जाता है और अच्छा रिटर्न मिलता है।"
      }
    ]
  },
  {
    id: "fin-02",
    slug: "loan-emi-calculator",
    name: "Loan EMI Calculator Online – Home, Car & Personal Loan Planner",
    shortName: "Loan EMI Calculator",
    category: "Financial & Tax Calculators",
    badge: "Instant PDF Export",
    difficulty: "Easy",
    popular: true,
    description: "Calculate monthly loan EMI repayments, total interest payable, and month-by-month principal payoff schedule for home, auto, or personal loans.",
    replaces: "Banker Pro Loan Calc ($25)",
    formula: "EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]",
    faqs: [
      {
        q: "EMI कम करने का सबसे अच्छा तरीका क्या है?",
        a: "लोन की अवधि (Tenure) बढ़ाने से मासिक EMI कम हो जाती है, लेकिन कुल ब्याज बचाने के लिए समय-समय पर Prepayment करना सबसे बेहतर होता है।"
      }
    ]
  },
  {
    id: "fin-05",
    slug: "gst-income-tax-calculator",
    name: "GST & Income Tax Calculator – CGST, SGST & Tax Slabs FY 2026-27",
    shortName: "GST Calculator",
    category: "Financial & Tax Calculators",
    badge: "Updated FY 2026-27",
    difficulty: "Easy",
    popular: true,
    description: "Calculate GST amounts (inclusive & exclusive) and estimated income tax liability with central (CGST) and state (SGST) tax splits for FY 2026-27.",
    replaces: "ClearTax Pro ($19/mo)",
    formula: "GST Amount = (Original Cost × GST%) / 100",
    faqs: [
      {
        q: "Inclusive और Exclusive GST में क्या अंतर है?",
        a: "Exclusive GST में कीमत के ऊपर से टैक्स जोड़ा जाता है, जबकि Inclusive GST में एमआरपी (MRP) के अंदर ही टैक्स शामिल होता है।"
      }
    ]
  },

  // 2. Text & Writing Utilities
  {
    id: "txt-01",
    slug: "word-counter",
    name: "Word Counter & Readability Inspector – Character & Sentence Tool",
    shortName: "Word Counter",
    category: "Text & Writing Utilities",
    badge: "Instant Live Count",
    difficulty: "Easy",
    popular: true,
    description: "Count live words, characters with/without spaces, sentences, paragraphs, and reading/speaking time with Flesch-Kincaid readability scoring.",
    replaces: "Grammarly Premium ($12/mo)",
    formula: "Reading Time = Total Words / 200 (Average WPM)",
    faqs: [
      {
        q: "SEO आर्टिकल के लिए कितने शब्द होने चाहिए?",
        a: "Google पर अच्छी रैंकिंग के लिए एक विस्तृत ब्लॉग पोस्ट में कम से कम 1,200 से 2,000 शब्द होने चाहिए।"
      }
    ]
  },
  {
    id: "txt-31",
    slug: "percentage-calculator",
    name: "Percentage Calculator with Steps – Increase, Decrease & Difference",
    shortName: "Percentage Calculator",
    category: "Text & Writing Utilities",
    badge: "Step-by-Step Math",
    difficulty: "Easy",
    popular: true,
    description: "Calculate percentage of numbers, percentage increases/decreases, and what percent a number is with step-by-step mathematical breakdowns.",
    replaces: "100% Web Tool",
    formula: "Percentage = (Part / Whole) × 100",
    faqs: [
      {
        q: "किसी संख्या का प्रतिशत (Percentage) कैसे निकालें?",
        a: "जितने प्रतिशत निकालना है उसे कुल संख्या से गुणा करें और 100 से भाग दे दें। उदाहरण: 500 का 20% = (500 × 20) / 100 = 100।"
      }
    ]
  },

  // 3. Health & Fitness Calculators
  {
    id: "hlth-01",
    slug: "bmi-calculator",
    name: "BMI & Body Fat Matrix Calculator – Accurate Body Mass Index",
    shortName: "BMI Calculator",
    category: "Health & Fitness Calculators",
    badge: "WHO Standard",
    difficulty: "Easy",
    popular: true,
    description: "Calculate exact Body Mass Index (BMI), healthy weight ranges, body composition category, and prime BMI for adult men and women.",
    replaces: "MyFitnessPal Premium ($20/mo)",
    formula: "BMI = Weight (kg) / [Height (m)]²",
    faqs: [
      {
        q: "सही (Normal) BMI कितना होना चाहिए?",
        a: "WHO के अनुसार 18.5 से 24.9 के बीच का BMI स्वस्थ (Healthy Weight) माना जाता है।"
      }
    ]
  },

  // 4. Web Developer & Code Tools
  {
    id: "dev-01",
    slug: "json-formatter",
    name: "JSON Formatter & Schema Inspector – Beautify, Minify & Validate",
    shortName: "JSON Formatter",
    category: "Web Developer & Code Tools",
    badge: "100% Browser Private",
    difficulty: "Easy",
    popular: true,
    description: "Beautify nested JSON payloads, minify production code, inspect JSON schema, and pinpoint syntax errors with line-number highlights.",
    replaces: "Paid JSON Parsers ($10)",
    formula: "JSON.stringify(JSON.parse(input), null, 2)",
    faqs: [
      {
        q: "क्या मेरा JSON डेटा सर्वर पर अपलोड होता है?",
        a: "नहीं, QuickCalc का JSON Formatter 100% आपके ब्राउज़र के अंदर काम करता है। आपका डेटा पूरी तरह सुरक्षित रहता है।"
      }
    ]
  }
  // नोट: इसी तरह आप अपने बाकी टूल्स को भी इसी फॉर्मेट में नीचे जोड़ सकते हैं।
];

// स्लग (URL) से टूल ढूंढने का फंक्शन
export function getToolBySlug(slug) {
  return ALL_TOOLS.find((tool) => tool.slug === slug);
}
