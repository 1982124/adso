import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getLocaleDirection, isValidLocale, locales } from '@/i18n/config';

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

const defaultCountry: CountryContext = { code: 'BJ', name: 'Bénin' };

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'fr',
      direction: 'ltr',
      country: defaultCountry,
      locales: locales.map((code) => ({
        code,
        name: ({
          fr: 'Français', en: 'English', es: 'Español', ar: 'العربية', pt: 'Português',
          de: 'Deutsch', zh: '中文', ja: '日本語', sw: 'Kiswahili', bm: 'Bamanankan',
        } as Record<string, string>)[code] ?? code,
        flag: ({
          fr: '🇫🇷', en: '🇬🇧', es: '🇪🇸', ar: '🇸🇦', pt: '🇧🇷',
          de: '🇩🇪', zh: '🇨🇳', ja: '🇯🇵', sw: '🇰🇪', bm: '🇲🇱',
        } as Record<string, string>)[code] ?? '🌍',
        dir: getLocaleDirection(code),
      })),

      setLocale: (locale) => {
        const selectedLocale = isValidLocale(locale) ? locale : 'fr';
        set({ locale: selectedLocale, direction: getLocaleDirection(selectedLocale) });
      },

      setCountry: (country) => {
        if (!country?.code || !country?.name) return;
        set({ country });
      },

      // Critical ADSO rule: country and language are independent dimensions.
      // Example: country=US + locale=fr means US road reality presented in French.
      setLanguageAndCountry: (locale, country) => {
        const selectedLocale = isValidLocale(locale) ? locale : 'fr';
        if (!country?.code || !country?.name) return;
        set({
          locale: selectedLocale,
          direction: getLocaleDirection(selectedLocale),
          country,
        });
      },
    }),
    { name: 'adso-locale-store' },
  ),
);
