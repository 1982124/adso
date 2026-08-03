# Task p5d: i18n Infrastructure Setup

## Summary
Set up internationalization using next-intl v4.3.4 with a client-side, non-routing approach (no `[locale]` route segments). The locale defaults to French and is changeable via a LocaleSwitcher component.

## Files Created

### 1. `src/i18n/config.ts`
- Exports `locales` (10 languages: fr, en, es, ar, pt, de, zh, ja, sw, bm)
- `Locale` type, `defaultLocale` ('fr')
- `localeNames`, `localeFlags`, `localeDirections` records
- Helper functions: `isValidLocale()`, `getLocaleDirection()`

### 2. `src/i18n/request.ts`
- Server-side `getRequestConfig()` for next-intl SSR
- Defaults to French, falls back gracefully

### 3. `src/i18n/client.tsx`
- `IntlClientProvider` React component wrapping `NextIntlClientProvider`
- Dynamic message loading with in-memory cache
- Syncs locale from zustand `locale-store`
- Sets `dir` and `lang` attributes on `<html>` for RTL support
- Exports `useAppLocale()` convenience hook

### 4. `src/i18n/fr.json` — Complete French translations
- Sections: common, nav, hero, stats, ecosystem, ai_features, dashboard, quiz, pricing (with B2C/B2B), roadmap, security (with international), analytics, footer

### 5. `src/i18n/en.json` — Complete English translations
- Same structure as fr.json

### 6. `src/i18n/es.json` — Complete Spanish translations
- Same structure as fr.json

### 7. `src/i18n/bm.json` — Bambara translations (Mali market)
- Complete: common, nav, hero, stats, ecosystem, ai_features (partial), dashboard, quiz, pricing (partial), roadmap, security (partial), analytics (partial), footer

### 8. `src/components/LocaleSwitcher.tsx`
- Client component using DropdownMenu from shadcn/ui
- Shows current flag + name, RTL badge for Arabic
- Lists all 10 languages with check mark for active
- Responsive (flag-only on mobile, flag+name on desktop)

## Files Modified

### 9. `src/components/Providers.tsx`
- Wrapped children with `IntlClientProvider` (outermost)
- Maintains existing QueryClientProvider inside

## Architecture Decisions
- **Non-routing approach**: No `[locale]` in URL. Locale is stored in zustand with localStorage persistence.
- **Client-side switching**: Locale changes trigger dynamic import of the corresponding JSON message file.
- **Message caching**: In-memory Map prevents re-fetching already loaded locales.
- **RTL support**: Arabic (`ar`) is the only RTL language; dir attribute is dynamically set on `<html>`.
- **Integration point**: Existing `locale-store.ts` (zustand) is used as the source of truth for locale state.

## Lint Status
- `bun run lint` passes with 0 errors.

## Pre-existing Issue (Not Related)
- Dev server has a pre-existing error: `Blueprint` icon not found in lucide-react (in `Navbar.tsx`). This is unrelated to i18n changes.
