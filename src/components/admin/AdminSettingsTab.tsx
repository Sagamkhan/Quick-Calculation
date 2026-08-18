import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Code2,
  Copy,
  Check,
  CheckCircle2,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  GlobalSeoSettings,
  saveStoredGlobalSeoSettings
} from '../../utils/adminCmsSettings';

interface AdminSettingsTabProps {
  settings: GlobalSeoSettings;
  onSaveSettings: (settings: GlobalSeoSettings) => void;
}

export default function AdminSettingsTab({
  settings: initialSettings,
  onSaveSettings
}: AdminSettingsTabProps) {
  const [formData, setFormData] = useState<GlobalSeoSettings>(initialSettings);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (field: keyof GlobalSeoSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: formData.organizationName || formData.siteName,
    url: formData.canonicalBaseUrl,
    logo: `${formData.canonicalBaseUrl}/icon.png`,
    description: formData.defaultMetaDescription,
    founder: {
      '@type': 'Person',
      name: formData.defaultAuthor,
      jobTitle: formData.defaultAuthorRole
    },
    sameAs: [
      'https://github.com',
      'https://twitter.com'
    ]
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(organizationSchema, null, 2));
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-md">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-white">
              Global SEO & Schema Configuration
            </h3>
            <p className="text-xs text-slate-400">
              Manage website metadata, canonical root domains, Google Search Console tags, and structured data schemas.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Fields */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Domain & Brand Metadata</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
                  SITE TITLE
                </label>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
                  CANONICAL BASE URL
                </label>
                <input
                  type="url"
                  value={formData.canonicalBaseUrl}
                  onChange={(e) => handleChange('canonicalBaseUrl', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
                BRAND TAGLINE
              </label>
              <input
                type="text"
                value={formData.brandTagline}
                onChange={(e) => handleChange('brandTagline', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
                DEFAULT META DESCRIPTION
              </label>
              <textarea
                value={formData.defaultMetaDescription}
                onChange={(e) => handleChange('defaultMetaDescription', e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
                  DEFAULT AUTHOR
                </label>
                <input
                  type="text"
                  value={formData.defaultAuthor}
                  onChange={(e) => handleChange('defaultAuthor', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
                  AUTHOR ROLE
                </label>
                <input
                  type="text"
                  value={formData.defaultAuthorRole}
                  onChange={(e) => handleChange('defaultAuthorRole', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
                  GOOGLE SEARCH CONSOLE TAG
                </label>
                <input
                  type="text"
                  value={formData.gscVerificationCode}
                  onChange={(e) => handleChange('gscVerificationCode', e.target.value)}
                  placeholder="google-site-verification code..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
                  BING WEBMASTER TAG
                </label>
                <input
                  type="text"
                  value={formData.bingVerificationCode}
                  onChange={(e) => handleChange('bingVerificationCode', e.target.value)}
                  placeholder="Bing verification code..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Google Analytics Tracking ID Configuration */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono text-slate-200 font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>Google Analytics Tracking ID (GA4 / G-Tag)</span>
                </label>
                {formData.googleAnalyticsId ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-300 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Active on Public Pages</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-500">
                    Not Configured
                  </span>
                )}
              </div>
              <input
                type="text"
                value={formData.googleAnalyticsId || ''}
                onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                placeholder="e.g. G-XXXXXXXXXX or UA-XXXXXXXX-X"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Entering your Google Analytics Measurement ID automatically injects the official Google Tag (<code className="text-cyan-300 font-mono">gtag.js</code>) onto all public tool and article pages for live visitor tracking, page engagement metrics, and calculation events.
              </p>
            </div>

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Global SEO Settings saved successfully!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              Save SEO Settings
            </button>
          </div>
        </form>

        {/* JSON-LD Organization Schema Preview */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Organization Schema</span>
            </h4>
            <button
              type="button"
              onClick={handleCopySchema}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[10px] text-cyan-300 font-mono overflow-x-auto max-h-[380px] custom-scrollbar">
            {JSON.stringify(organizationSchema, null, 2)}
          </pre>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            This structured schema markup is automatically generated and embedded into your website HTML to give search engine crawlers rich organizational and knowledge graph signals.
          </p>
        </div>
      </div>
    </div>
  );
}
