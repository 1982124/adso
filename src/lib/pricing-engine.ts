/**
 * ADSO pricing engine.
 *
 * The commercial catalogue is the single source of truth for launch offers.
 * Payment providers keep stable identifiers while customer-facing prices stay
 * canonical in XOF for the validated launch market.
 */

import { countries, type Country } from '@/data/countries';
import {
  COMMERCIAL_OFFERS,
  getCommercialOffer,
  getOfferPrice,
  type BillingPeriod,
} from '@/lib/commercial-offers';

export interface PricingResult {
  price: number;
  originalPrice: number;
  currency: string;
  discount: number;
}

export type PlanId = 'free' | (typeof COMMERCIAL_OFFERS)[number]['id'];
export type { BillingPeriod } from '@/lib/commercial-offers';

const PAYMENT_PROVIDER_ALIASES: Record<string, string> = {
  'Orange Money': 'orange_money',
  'Orange Money Africa': 'orange_money',
  'MTN Mobile Money': 'mtn_momo',
  'MTN MoMo': 'mtn_momo',
  'Moov Money': 'moov_money',
  Wave: 'wave',
  'Free Money': 'free_money',
  'M-Pesa': 'mpesa',
  'Airtel Money': 'airtel_money',
  'Express Union Mobile': 'express_union_mobile',
  'KCB M-Pesa': 'kcb_mpesa',
  Chariow: 'chariow',
  Maketou: 'maketou',
  'Carte bancaire': 'card',
  PayPal: 'paypal',
  'Apple Pay': 'apple_pay',
  'Google Pay': 'google_pay',
  'Virement bancaire': 'bank_transfer',
  Bancontact: 'bancontact',
  TWINT: 'twint',
  Klarna: 'klarna',
  Bizum: 'bizum',
  Satispay: 'satispay',
  Sofortüberweisung: 'sofort',
  'Cash Plus': 'cash_plus',
  Flouci: 'flouci',
  BaridiMob: 'baridimob',
  CIB: 'cib',
};

export function getPricingForCountry(
  countryCode: string,
  planId: string,
  billingPeriod: BillingPeriod = 'monthly',
): PricingResult {
  if (planId === 'free') return { price: 0, originalPrice: 0, currency: 'XOF', discount: 0 };

  const offer = getCommercialOffer(planId);
  if (!offer) return { price: 0, originalPrice: 0, currency: 'XOF', discount: 0 };

  const price = getOfferPrice(planId, billingPeriod);
  if (price === null) {
    return { price: 0, originalPrice: 0, currency: offer.currency, discount: 0 };
  }

  const monthly = offer.monthly ?? price;
  const yearly = offer.yearly;
  const effectiveMonthlyYearly = yearly === null ? monthly : yearly / 12;
  const discount = billingPeriod === 'yearly' && monthly > 0
    ? Math.max(0, Math.round((1 - effectiveMonthlyYearly / monthly) * 100))
    : 0;

  return {
    price,
    originalPrice: billingPeriod === 'yearly' ? yearly ?? price : monthly,
    currency: offer.currency,
    discount,
  };
}

export function calculateDiscount(planId: string, billingPeriod: BillingPeriod): number {
  return getPricingForCountry('ML', planId, billingPeriod).discount;
}

export function getAvailablePaymentMethods(countryCode: string): string[] {
  const country = getCountryByCode(countryCode);
  if (!country) return [];
  return country.paymentProviders.map(
    (provider) => PAYMENT_PROVIDER_ALIASES[provider] ?? canonicalizeProvider(provider),
  );
}

export function canonicalizeProvider(provider: string): string {
  const trimmed = provider.trim();
  return PAYMENT_PROVIDER_ALIASES[trimmed]
    ?? trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

export function formatPrice(amount: number, currencyCode: string, locale = 'fr-FR'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currencyCode === 'XOF' || currencyCode === 'XAF' ? 0 : 2,
      maximumFractionDigits: currencyCode === 'XOF' || currencyCode === 'XAF' ? 0 : 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currencyCode}`;
  }
}

function getCountryByCode(code: string): Country | undefined {
  return countries.find((country) => country.code === code.toUpperCase());
}

export { COMMERCIAL_OFFERS };
