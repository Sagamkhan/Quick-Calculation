import React, { useState } from 'react';
import { Share2, Code, Copy, Check, Sparkles, Plus, Trash2, Globe, Eye, Layers } from 'lucide-react';
import { triggerConfetti } from '../../utils/confetti';

interface SchemaSocialStudioProps {
  mode: 'metatags' | 'schema' | 'faq' | 'social';
}

export function SchemaSocialStudio({ mode }: SchemaSocialStudioProps) {
  const [copied, setCopied] = useState(false);

  // Common Metadata State
  const [pageTitle, setPageTitle] = useState('Quick Calculator - Free Online Tools & SEO Utilities');
  const [pageDescription, setPageDescription] = useState('Explore 250+ instant online calculators, developer formatters, PDF optimizers, and technical SEO website audit tools with 100% browser privacy.');
  const [pageUrl, setPageUrl] = useState('https://quickcalculator.app/category/seo-website-tools');
  const [imageUrl, setImageUrl] = useState('https://quickcalculator.app/og-image.png');
  const [siteName, setSiteName] = useState('Quick Calculator');
  const [twitterHandle, setTwitterHandle] = useState('@quickcalcapp');

  // Schema Specific State
  const [schemaType, setSchemaType] = useState<'FAQPage' | 'Article' | 'LocalBusiness' | 'Product' | 'Organization' | 'HowTo'>('FAQPage');

  // FAQ Schema & Accordion List
  const [faqs, setFaqs] = useState([
    { q: 'Is Quick Calculator free to use?', a: 'Yes, 100% free with unlimited calculations and zero subscription fees.' },
    { q: 'Are my data calculations private and secure?', a: 'All data processing occurs purely client-side inside your browser sandbox. No input data is sent to external servers.' },
    { q: 'How do I download my generated SEO reports?', a: 'Click the Download PDF or Export CSV buttons on any tool page for instant offline reports.' }
  ]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    triggerConfetti(0.3);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate Meta Tag HTML
  const generateMetaTagHtml = () => {
    return `<!-- Primary HTML Meta Tags -->
<title>${pageTitle}</title>
<meta name="title" content="${pageTitle}" />
<meta name="description" content="${pageDescription}" />
<link rel="canonical" href="${pageUrl}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${pageUrl}" />
<meta property="og:title" content="${pageTitle}" />
<meta property="og:description" content="${pageDescription}" />
<meta property="og:image" content="${imageUrl}" />
<meta property="og:site_name" content="${siteName}" />

<!-- Twitter / X Card -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${pageUrl}" />
<meta property="twitter:title" content="${pageTitle}" />
<meta property="twitter:description" content="${pageDescription}" />
<meta property="twitter:image" content="${imageUrl}" />
<meta name="twitter:creator" content="${twitterHandle}" />`;
  };

  // Generate JSON-LD Schema
  const generateJsonLd = () => {
    let schemaObj: any = {};

    if (schemaType === 'FAQPage') {
      schemaObj = {
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
      };
    } else if (schemaType === 'Article') {
      schemaObj = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': pageTitle,
        'description': pageDescription,
        'image': imageUrl,
        'author': {
          '@type': 'Organization',
          'name': siteName,
          'url': 'https://quickcalculator.app'
        },
        'publisher': {
          '@type': 'Organization',
          'name': siteName,
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://quickcalculator.app/logo.png'
          }
        },
        'datePublished': new Date().toISOString().split('T')[0]
      };
    } else if (schemaType === 'LocalBusiness') {
      schemaObj = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        'name': siteName,
        'image': imageUrl,
        'url': pageUrl,
        'telephone': '+1-800-555-0199',
        'priceRange': 'Free',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': '100 Tech Square',
          'addressLocality': 'San Francisco',
          'addressRegion': 'CA',
          'postalCode': '94105',
          'addressCountry': 'US'
        }
      };
    } else {
      schemaObj = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': siteName,
        'url': pageUrl,
        'logo': imageUrl,
        'sameAs': [
          'https://twitter.com/quickcalcapp',
          'https://github.com/quickcalculator'
        ]
      };
    }

    return `<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n</script>`;
  };

  // Generate Accordion HTML
  const generateAccordionHtml = () => {
    return `<div class="faq-accordion-group">\n` +
      faqs.map(f => `  <details class="faq-item">\n    <summary class="faq-question">${f.q}</summary>\n    <div class="faq-answer">\n      <p>${f.a}</p>\n    </div>\n  </details>`).join('\n') +
      `\n</div>`;
  };

  return (
    <div className="space-y-6">
      {/* 1. Meta Tag Studio View */}
      {mode === 'metatags' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 space-y-3">
              <div>
                <label className="text-xs font-mono font-bold text-cyan-300">Page Title</label>
                <input
                  type="text"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-sans text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-cyan-300">Meta Description</label>
                <textarea
                  rows={2}
                  value={pageDescription}
                  onChange={(e) => setPageDescription(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-sans text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-mono text-slate-400">Canonical URL</label>
                  <input
                    type="url"
                    value={pageUrl}
                    onChange={(e) => setPageUrl(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400">Social OG Image URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-200"
                  />
                </div>
              </div>
            </div>

            {/* Generated Code */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300">Generated &lt;head&gt; Meta Tags</span>
                <button
                  type="button"
                  onClick={() => handleCopy(generateMetaTagHtml())}
                  className="px-3 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied!' : 'Copy Tags'}</span>
                </button>
              </div>
              <textarea
                rows={11}
                readOnly
                value={generateMetaTagHtml()}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-teal-300 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. JSON-LD Schema Generator View */}
      {mode === 'schema' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-bold text-cyan-300">Schema.org Structured Type</label>
              <div className="flex flex-wrap gap-1">
                {(['FAQPage', 'Article', 'LocalBusiness', 'Organization'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSchemaType(type)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      schemaType === type ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-300">
                JSON-LD Structured Data Schema Markup ({schemaType})
              </span>
              <button
                type="button"
                onClick={() => handleCopy(generateJsonLd())}
                className="px-3 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied Schema!' : 'Copy JSON-LD'}</span>
              </button>
            </div>
            <textarea
              rows={12}
              readOnly
              value={generateJsonLd()}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-teal-300 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* 3. FAQ Schema & Accordion Generator View */}
      {mode === 'faq' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-300">Frequently Asked Questions ({faqs.length})</span>
              <button
                type="button"
                onClick={() => setFaqs([...faqs, { q: 'New question topic?', a: 'Answer explaining details clearly.' }])}
                className="px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add FAQ Item</span>
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {faqs.map((f, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={f.q}
                      onChange={(e) => {
                        const copy = [...faqs];
                        copy[i].q = e.target.value;
                        setFaqs(copy);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-semibold text-cyan-100"
                      placeholder="Question..."
                    />
                    <button
                      type="button"
                      onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))}
                      className="p-1 text-rose-400 hover:bg-rose-500/10 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={f.a}
                    onChange={(e) => {
                      const copy = [...faqs];
                      copy[i].a = e.target.value;
                      setFaqs(copy);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-sans text-slate-300"
                    placeholder="Answer description..."
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Double Output: JSON-LD + HTML Accordion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300">1. Google Rich Snippet JSON-LD</span>
                <button
                  type="button"
                  onClick={() => handleCopy(generateJsonLd())}
                  className="px-2 py-1 rounded bg-slate-800 text-xs font-mono text-cyan-300 cursor-pointer"
                >
                  Copy JSON-LD
                </button>
              </div>
              <textarea
                rows={8}
                readOnly
                value={generateJsonLd()}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-teal-300 focus:outline-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-300">2. HTML5 &lt;details&gt; Accordion Code</span>
                <button
                  type="button"
                  onClick={() => handleCopy(generateAccordionHtml())}
                  className="px-2 py-1 rounded bg-slate-800 text-xs font-mono text-cyan-300 cursor-pointer"
                >
                  Copy HTML
                </button>
              </div>
              <textarea
                rows={8}
                readOnly
                value={generateAccordionHtml()}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-200 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. Social Sharing Preview Debugger View */}
      {mode === 'social' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/20 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-cyan-300">Social Post Title</label>
                <input
                  type="text"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-cyan-300">Domain Name</label>
                <input
                  type="text"
                  value="quickcalculator.app"
                  readOnly
                  className="w-full mt-1 p-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Social Mockup Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Facebook / OpenGraph Card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-blue-400">Facebook OpenGraph Card</span>
              <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                <div className="h-36 bg-gradient-to-r from-cyan-900 to-slate-900 flex items-center justify-center text-cyan-300 font-display font-bold text-sm">
                  1200 x 630 OpenGraph Banner
                </div>
                <div className="p-3 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400">QUICKCALCULATOR.APP</span>
                  <h5 className="text-xs font-bold text-white line-clamp-1">{pageTitle}</h5>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{pageDescription}</p>
                </div>
              </div>
            </div>

            {/* Twitter / X Large Summary Card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400">Twitter / X Summary Large Image</span>
              <div className="rounded-2xl overflow-hidden border border-slate-700 bg-black">
                <div className="h-36 bg-gradient-to-r from-slate-900 to-teal-950 flex items-center justify-center text-teal-300 font-display font-bold text-sm">
                  Twitter Card Large Image
                </div>
                <div className="p-3 space-y-0.5">
                  <span className="text-[10px] text-slate-500 font-mono">From quickcalculator.app</span>
                  <h5 className="text-xs font-bold text-slate-100 line-clamp-1">{pageTitle}</h5>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{pageDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
