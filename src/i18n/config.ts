export const locales = ['fr', 'en', 'es', 'ar', 'pt', 'de', 'zh', 'ja', 'sw', 'bm'] as const;

/** Languages exposed as learner choices in ADSO V1. Other locale packs remain internal/forward-compatible. */
export const supportedLearningLocales = ['fr', 'en', 'es', 'ar', 'pt'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  es: 'Español',
  ar: 'العربية',
  pt: 'Português',
  de: 'Deutsch',
  zh: '中文',
  ja: '日本語',
  sw: 'Kiswahili',
  bm: 'Bamanankan',
};

export const localeFlags: Record<Locale, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
  es: '🇪🇸',
  ar: '🇸🇦',
  pt: '🇵🇹',
  de: '🇩🇪',
  zh: '🇨🇳',
  ja: '🇯🇵',
  sw: '🇰🇪',
  bm: '🇲🇱',
};

export const localeDirections: Record<Locale, 'ltr' | 'rtl'> = {
  fr: 'ltr',
  en: 'ltr',
  es: 'ltr',
  ar: 'rtl',
  pt: 'ltr',
  de: 'ltr',
  zh: 'ltr',
  ja: 'ltr',
  sw: 'ltr',
  bm: 'ltr',
};

export function isValidLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}

export function isSupportedLearningLocale(locale: string): locale is (typeof supportedLearningLocales)[number] {
  return (supportedLearningLocales as readonly string[]).includes(locale);
}

export function getLocaleDirection(locale: string): 'ltr' | 'rtl' {
  return isValidLocale(locale) ? localeDirections[locale] : 'ltr';
}
