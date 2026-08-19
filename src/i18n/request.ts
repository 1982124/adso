import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { defaultLocale, type Locale, isValidLocale } from './config';

const LOCALE_COOKIE = 'adso-locale';

export default getRequestConfig(async () => {
  // ADSO uses a non-routing i18n architecture. Persist the selected locale in
  // a durable cookie so server-rendered content and the client store resolve
  // the same language after refresh and navigation.
  const cookieStore = await cookies();
  const requestedLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: Locale = requestedLocale && isValidLocale(requestedLocale)
    ? requestedLocale
    : defaultLocale;

  let messages: Record<string, unknown>;
  try {
    messages = (await import(`./${locale}.json`)).default;
  } catch {
    messages = (await import('./fr.json')).default;
  }

  return { locale, messages };
});
