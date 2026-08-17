/**
 * Dynamic pricing engine for ADSO.
 *
 * Customer-facing prices remain country-aware while payment providers use
 * stable canonical identifiers internally.
 */

import { countries, type Country } from '@/data/countries';

export interface PricingResult {
  price: number;
  originalPrice: number;
  currency: string;
  discount: number;
}

export type BillingPeriod = 'monthly' | 'yearly';
export type PlanId = 'free' | 'starter' | 'pro' | 'premium';

const BASE_PRICES: Record<PlanId, number> = {
  free: 0,
  starter: 9.99,
  pro: 19.99,
  premium: 39.99,
} as const;

const PPP_MULTIPLIERS: Record<string, number> = {
  Afrique: 0.25,
  Europe: 1.0,
  Asie: 0.35,
  Amerique: 0.50,
  'Amérique du Nord': 1.0,
  'Amérique du Sud': 0.50,
  'Moyen-Orient': 0.45,
  Océanie: 1.0,
} as const;

const YEARLY_DISCOUNT_PERCENT = 20;
const DEFAULT_PPP = 1.0;

/** Canonical provider identifiers used by payment-core and checkout APIs. */
const PAYMENT_PROVIDER_ALIASES: Record<string, string> = {
  'Orange Money': 'orange_money',
  'Orange Money Africa': 'orange_money',
  'MTN Mobile Money': 'mtn_momo',
  'MTN MoMo': 'mtn_momo',
  'Moov Money': 'moov_money',
  'Wave': 'wave',
  'Free Money': 'free_money',
  'M-Pesa': 'mpesa',
  'Airtel Money': 'airtel_money',
  'Express Union Mobile': 'express_union_mobile',
  'KCB M-Pesa': 'kcb_mpesa',
  'Chariow': 'chariow',
  'Maketou': 'maketou',
  'Carte bancaire': 'card',
  'PayPal': 'paypal',
  'Apple Pay': 'apple_pay',
  'Google Pay': 'google_pay',
  'Virement bancaire': 'bank_transfer',
  'Bancontact': 'bancontact',
  'TWINT': 'twint',
  'Klarna': 'klarna',
  'Bizum': 'bizum',
  'Satispay': 'satispay',
  'Sofortüberweisung': 'sofort',
  'Cash Plus': 'cash_plus',
  'Flouci': 'flouci',
  'BaridiMob': 'baridimob',
  'CIB': 'cib',
};

export function getPricingForCountry(countryCode: string, planId: string): PricingResult {
  const basePrice = BASE_PRICES[planId as PlanId] ?? 0;
  const country = getCountryByCode(countryCode);
  const ppp = country ? (PPP_MULTIPLIERS[country.region] ?? DEFAULT_PPP) : DEFAULT_PPP;
  const currency = country?.currency?.code ?? 'EUR';
  const price = Math.round(basePrice * ppp * 100) / 100;
  const discount = ppp < 1 ? Math.round((1 - ppp) * 100) : 0;
  return { price, originalPrice: basePrice, currency, discount };
}

export function calculateDiscount(_planId: string, billingPeriod: BillingPeriod): number {
  return billingPeriod === 'yearly' ? YEARLY_DISCOUNT_PERCENT : 0;
}

export function getAvailablePaymentMethods(countryCode: string): string[] {
  const country = getCountryByCode(countryCode);
  if (!country) return [];
  return country.paymentProviders.map((provider) => PAYMENT_PROVIDER_ALIASES[provider] ?? canonicalizeProvider(provider));
}

export function canonicalizeProvider(provider: string): string {
  const trimmed = provider.trim();
  return PAYMENT_PROVIDER_ALIASES[trimmed] ?? trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

export function formatPrice(amount: number, currencyCode: string, locale?: string): string {
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
    return `${amount.toFixed(2)} ${currencyCode}`;
  }
}

function getCountryByCode(code: string): Country | undefined {
  return countries.find((c) => c.code === code.toUpperCase());
}
