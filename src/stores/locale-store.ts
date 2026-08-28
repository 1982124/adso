import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getLocaleDirection, isSupportedLearningLocale, localeFlags, localeNames, type Locale, supportedLearningLocales } from '@/i18n/config';

export interface LocaleOption {
  code: string;
  name: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

export interface CountryContext {
  code: string;
  name: string;
}

interface LocaleState {
  locale: string;
  locales: LocaleOption[];
  direction: 'ltr' | 'rtl';
  country: CountryContext;
  setLocale: (locale: string) => void;
  setCountry: (country: CountryContext) => void;
  setLanguageAndCountry: (locale: string, country: CountryContext) => void;
}

const defaultCountry: CountryContext = { code: 'ZZ', name: 'International — choisissez votre pays' };
const LOCALE_COOKIE = 'adso-locale';
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function persistLocaleCookie(locale: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${LOCALE_COOKIE}=${encodeURIComponent(locale)}; Path=/; Max-Age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
}

const learnerLocales: LocaleOption[] = supportedLearningLocales.map((code) => ({
  code,
  name: localeNames[code as Locale],
  flag: localeFlags[code as Locale],
  dir: getLocaleDirection(code),
}));

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'fr',
      direction: 'ltr',
      country: defaultCountry,
      locales: learnerLocales,
      setLocale: (locale) => {
        const selectedLocale = isSupportedLearningLocale(locale) ? locale : 'fr';
        persistLocaleCookie(selectedLocale);
        set({ locale: selectedLocale, direction: getLocaleDirection(selectedLocale) });
      },
      setCountry: (country) => {
        if (!country?.code || !country?.name) return;
        set({ country });
      },
      setLanguageAndCountry: (locale, country) => {
        const selectedLocale = isSupportedLearningLocale(locale) ? locale : 'fr';
        if (!country?.code || !country?.name) return;
        persistLocaleCookie(selectedLocale);
        set({ locale: selectedLocale, direction: getLocaleDirection(selectedLocale), country });
      },
    }),
    { name: 'adso-locale-store' },
  ),
);
