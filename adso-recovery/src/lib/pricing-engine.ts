/**
 * Dynamic pricing engine for ADSO.
 *
 * Calculates localised prices using Purchasing Power Parity (PPP) multipliers,
 * applies billing-period discounts, resolves payment methods, and formats
 * currency values with `Intl.NumberFormat`.
 */

import { countries, type Country } from '@/data/countries';

// ─── Types ──────────────────────────────────────────────────────────────────

/** Result of a pricing calculation for a given country and plan. */
export interface PricingResult {
  /** Localised price after PPP and billing discounts. */
  price: number;
  /** Original base price in EUR (before any discounts). */
  originalPrice: number;
  /** ISO 4217 currency code for the country. */
  currency: string;
  /** Discount percentage applied (0–100). */
  discount: number;
}

/** Supported billing periods. */
export type BillingPeriod = 'monthly' | 'yearly';

/** Supported plan identifiers. */
export type PlanId = 'free' | 'starter' | 'pro' | 'premium';

// ─── Constants ──────────────────────────────────────────────────────────────

/** Base prices in EUR for each plan (monthly). */
const BASE_PRICES: Record<PlanId, number> = {
  free: 0,
  starter: 9.99,
  pro: 19.99,
  premium: 39.99,
} as const;

/**
 * PPP multipliers by region.
 * Values < 1 reduce the price for lower-purchasing-power economies.
 */
const PPP_MULTIPLIERS: Record<string, number> = {
  west_africa: 0.25,
  east_africa: 0.30,
  north_africa: 0.40,
  south_america: 0.50,
  south_asia: 0.35,
  southeast_asia: 0.45,
  europe: 1.0,
  north_america: 1.0,
} as const;

/** Discount applied when billing yearly instead of monthly. */
const YEARLY_DISCOUNT_PERCENT = 20;

/** Default multiplier when a country's region is unknown. */
const DEFAULT_PPP = 1.0;

// ─── Core functions ─────────────────────────────────────────────────────────

/**
 * Calculate localised pricing for a given country and plan.
 *
 * Applies the PPP multiplier for the country's region and assumes
 * monthly billing. Use {@link calculateDiscount} + manual math if you
 * need the yearly price directly.
 *
 * @param countryCode - ISO 3166-1 alpha-2 code (e.g. `'SN'`, `'FR'`).
 * @param planId      - Plan identifier (`'free'`, `'starter'`, `'pro'`, `'premium'`).
 * @returns A {@link PricingResult} with localised price, original price, currency, and discount.
 *          Falls back to EUR with PPP 1.0 for unknown countries/plans.
 */
export function getPricingForCountry(
  countryCode: string,
  planId: string,
): PricingResult {
  const basePrice = BASE_PRICES[planId as PlanId] ?? 0;
  const country = getCountryByCode(countryCode);

  const ppp = country
    ? (PPP_MULTIPLIERS[country.region] ?? DEFAULT_PPP)
    : DEFAULT_PPP;

  const currency = country?.currency?.code ?? 'EUR';

  // price = base × PPP (rounded to 2 dp)
  const price = Math.round(basePrice * ppp * 100) / 100;

  // Discount represents the PPP reduction as a percentage
  const discount = ppp < 1 ? Math.round((1 - ppp) * 100) : 0;

  return {
    price,
    originalPrice: basePrice,
    currency,
    discount,
  };
}

/**
 * Calculate the discount percentage for a given plan and billing period.
 *
 * - `monthly` → 0 % discount
 * - `yearly`  → 20 % discount
 *
 * @param _planId        - Plan identifier (reserved for future plan-specific discounts).
 * @param billingPeriod  - `'monthly'` or `'yearly'`.
 * @returns Discount percentage (0–100).
 */
export function calculateDiscount(
  _planId: string,
  billingPeriod: BillingPeriod,
): number {
  return billingPeriod === 'yearly' ? YEARLY_DISCOUNT_PERCENT : 0;
}

/**
 * Return the list of available payment method identifiers for a country.
 *
 * @param countryCode - ISO 3166-1 alpha-2 code.
 * @returns Array of payment provider strings (e.g. `['orange_money', 'wave']`).
 *          Returns an empty array for unknown countries.
 */
export function getAvailablePaymentMethods(countryCode: string): string[] {
  const country = getCountryByCode(countryCode);
  return country ? [...country.paymentProviders] : [];
}

/**
 * Format a price amount as a localised currency string.
 *
 * Uses `Intl.NumberFormat` with the country's locale and currency.
 * Falls back to `'en-US'` locale and `'EUR'` currency when unavailable.
 *
 * @param amount       - Numeric amount to format.
 * @param currencyCode - ISO 4217 currency code (e.g. `'XOF'`, `'EUR'`).
 * @param locale       - Optional BCP 47 locale override.
 * @returns A formatted string (e.g. `'9,99 €'`, `'5 000 XOF'`).
 */
export function formatPrice(
  amount: number,
  currencyCode: string,
  locale?: string,
): string {
 const resolvedLocale = locale ?? 'en-US';

  try {
    const formatter = new Intl.NumberFormat(resolvedLocale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currencyCode === 'XOF' || currencyCode === 'XAF' ? 0 : 2,
      maximumFractionDigits: currencyCode === 'XOF' || currencyCode === 'XAF' ? 0 : 2,
    });
    return formatter.format(amount);
  } catch {
    // Fallback for unsupported currency codes
    return `${amount.toFixed(2)} ${currencyCode}`;
  }
}

// ─── Internal helpers ───────────────────────────────────────────────────────

/**
 * Find a country by code from the countries data.
 */
function getCountryByCode(code: string): Country | undefined {
  return countries.find((c) => c.code === code);
}
