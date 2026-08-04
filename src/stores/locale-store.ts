import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LocaleOption {
  code: string;
  name: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

interface LocaleState {
  locale: string;
  locales: LocaleOption[];
  direction: 'ltr' | 'rtl';

  setLocale: (locale: string) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'fr',
      direction: 'ltr',
      locales: [
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
        { code: 'pt', name: 'Português', flag: '🇧🇷' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'zh', name: '中文', flag: '🇨🇳' },
        { code: 'ja', name: '日本語', flag: '🇯🇵' },
        { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
        { code: 'bm', name: 'Bamanankan', flag: '🇲🇱' },
      ],

      setLocale: (locale) => {
        const selectedLocale = ['fr', 'en', 'es', 'ar', 'pt', 'de', 'zh', 'ja', 'sw', 'bm'].includes(locale)
          ? locale
          : 'fr';
        set({
          locale: selectedLocale,
          direction: selectedLocale === 'ar' ? 'rtl' : 'ltr',
        });
      },
    }),
    { name: 'adso-locale-store' }
  )
);
