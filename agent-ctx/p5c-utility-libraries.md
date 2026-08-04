# Task p5c — Utility Libraries

## Status: Completed

## Files Created

### 1. `src/data/countries.ts` (prerequisite)
- 26 countries across 7 PPP regions (west_africa, east_africa, north_africa, south_america, south_asia, southeast_asia, europe, north_america)
- Each country: code, name (French), currency, locale, region, paymentMethods
- Exports: `countries` array, `getCountryByCode()`, `getCountriesByRegion()`

### 2. `src/lib/validation.ts`
- 7 Zod v4 schemas: createUser, login, chatMessage, quizAnswer, courseEnroll, contact, updateProfile
- `parseBody<T>()` helper returning discriminated union
- French error messages throughout
- Inferred types exported (CreateUserInput, LoginInput, etc.)

### 3. `src/lib/api-response.ts`
- 8 typed helpers: apiSuccess, apiError, apiBadRequest, apiUnauthorized, apiForbidden, apiNotFound, apiRateLimited, apiInternalError
- Consistent envelope: `{ success, data?, error?: { message, details? } }`
- All return `NextResponse` with proper generic typing

### 4. `src/lib/security.ts`
- `sanitizeHtml()`: whitelist of 13 safe tags, strips event handlers + javascript:/data: URLs, escapes attribute values
- `rateLimit()`: in-memory IP-based with Map, periodic cleanup, returns check + getRemaining
- `getClientIp()`: x-forwarded-for (leftmost) → x-real-ip → 127.0.0.1
- `generateRequestId()`: crypto.randomUUID()
- `sanitizeEntities()`: full HTML strip + entity decoding

### 5. `src/lib/pricing-engine.ts`
- `getPricingForCountry()`: PPP-adjusted pricing per region, returns price/originalPrice/currency/discount
- `calculateDiscount()`: 20% for yearly, 0% for monthly
- `getAvailablePaymentMethods()`: per-country from countries data
- `formatPrice()`: Intl.NumberFormat with locale/currency, XOF/XAF zero-decimal handling

### 6. `src/components/ViewErrorBoundary.tsx`
- React class component error boundary
- French default fallback: "Une erreur est survenue. Veuillez réessayer." + "Réessayer" button
- Supports custom fallback prop and onError callback
- Uses `cn()` from @/lib/utils

## Notes
- All files use strict TypeScript (no `any`)
- JSDoc on all exported functions
- ESLint passes (0 errors in new files; pre-existing error in src/i18n/client.ts is unrelated)
- Dev server compiles successfully with all new files