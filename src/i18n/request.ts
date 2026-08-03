import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, type Locale, isValidLocale } from './config';

export default getRequestConfig(async () => {
  // For non-routing approach, default to French on server side
  // Client-side locale switching is handled by IntlClientProvider
  const locale: Locale = defaultLocale;

  let messages: Record<string, unknown>;
  try {
    messages = (await import(`./${locale}.json`)).default;
  } catch {
    // Fallback to French if the locale file is missing
    messages = (await import('./fr.json')).default;
  }

  return {
    locale,
    messages,
  };
});
