export interface GlobalSeoSettings {
  siteName: string;
  brandTagline: string;
  canonicalBaseUrl: string;
  titleSuffix: string;
  defaultAuthor: string;
  defaultAuthorRole: string;
  organizationName: string;
  defaultOgImage: string;
  gscVerificationCode: string;
  bingVerificationCode: string;
  defaultMetaDescription: string;
  googleAnalyticsId?: string;
}

export const DEFAULT_GLOBAL_SEO_SETTINGS: GlobalSeoSettings = {
  siteName: 'Quick Calculator',
  brandTagline: '250+ Free High-Speed Client-Side Calculators & Web Utilities',
  canonicalBaseUrl: 'https://quickcalc.in',
  titleSuffix: '| Quick Calculator',
  defaultAuthor: 'Sagam Khan',
  defaultAuthorRole: 'Founder & Lead Engineer',
  organizationName: 'Quick Calculator',
  defaultOgImage: 'https://quickcalc.in/og-image.png',
  gscVerificationCode: '',
  bingVerificationCode: '',
  defaultMetaDescription: 'Over 250+ free online calculators for finance, engineering, technical SEO, health, unit conversions, and developer utilities with 100% in-browser privacy.',
  googleAnalyticsId: ''
};

export const GLOBAL_SEO_STORAGE_KEY = 'quickcalc_cms_global_seo_settings';

export function getStoredGlobalSeoSettings(): GlobalSeoSettings {
  if (typeof window === 'undefined') return DEFAULT_GLOBAL_SEO_SETTINGS;
  try {
    const saved = localStorage.getItem(GLOBAL_SEO_STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_GLOBAL_SEO_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (err) {
    console.warn('[adminCmsSettings] Failed to parse stored global SEO settings:', err);
  }
  return DEFAULT_GLOBAL_SEO_SETTINGS;
}

export function saveStoredGlobalSeoSettings(settings: GlobalSeoSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GLOBAL_SEO_STORAGE_KEY, JSON.stringify(settings));
    // Trigger global update event so public pages immediately react
    window.dispatchEvent(new CustomEvent('quickcalc-settings-updated', { detail: settings }));
    if (settings.googleAnalyticsId !== undefined) {
      injectGoogleAnalyticsScript(settings.googleAnalyticsId);
    }
  } catch (err) {
    console.warn('[adminCmsSettings] Failed to save global SEO settings:', err);
  }
}

/**
 * Dynamically injects or cleans up Google Analytics (gtag.js) script tags
 */
export function injectGoogleAnalyticsScript(rawId?: string): void {
  if (typeof document === 'undefined') return;

  const trackingId = (rawId || '').trim();
  const SCRIPT_TAG_ID = 'quickcalc-ga-script';
  const INLINE_TAG_ID = 'quickcalc-ga-inline';

  const existingScript = document.getElementById(SCRIPT_TAG_ID);
  const existingInline = document.getElementById(INLINE_TAG_ID);

  if (!trackingId) {
    // Remove if tracking ID was cleared
    if (existingScript) existingScript.remove();
    if (existingInline) existingInline.remove();
    return;
  }

  // 1. Inject external gtag.js script if not present or changed
  if (!existingScript || existingScript.getAttribute('data-ga-id') !== trackingId) {
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = SCRIPT_TAG_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(trackingId)}`;
    script.setAttribute('data-ga-id', trackingId);
    document.head.appendChild(script);
  }

  // 2. Inject inline initialization script
  if (!existingInline || existingInline.getAttribute('data-ga-id') !== trackingId) {
    if (existingInline) existingInline.remove();

    const inlineScript = document.createElement('script');
    inlineScript.id = INLINE_TAG_ID;
    inlineScript.setAttribute('data-ga-id', trackingId);
    inlineScript.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingId.replace(/'/g, "\\'")}', {
        send_page_view: true,
        page_path: window.location.pathname + window.location.search
      });
    `;
    document.head.appendChild(inlineScript);
  }
}

/**
 * Safely track page view for SPA route transitions
 */
export function trackPageView(path: string, title?: string): void {
  if (typeof window === 'undefined') return;
  const anyWindow = window as any;
  if (typeof anyWindow.gtag === 'function') {
    const settings = getStoredGlobalSeoSettings();
    if (settings.googleAnalyticsId) {
      anyWindow.gtag('event', 'page_view', {
        page_path: path,
        page_title: title || document.title,
        page_location: window.location.href
      });
    }
  }
}

