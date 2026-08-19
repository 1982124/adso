/**
 * ADSO pricing engine.
 *
 * Commercial launch offers are defined once in commercial-offers.ts and reused
 * by the subscription UI and checkout integrations. Provider identifiers remain
 * stable and country-aware.
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

/** Canonical provider identifiers used by payment-core and checkout APIs. */
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

export function getPricingForCountry(countryCode: string, planId: string, billingPeriod: BillingPeriod = 'monthly'): PricingResult {
  if (planId === 'free') {
    return { price: 0, originalPrice: 0, currency: 'XOF', discount: 0 };
  }

  const offer = getCommercialOffer(planId);
  if (!offer) {
    return { price: 0, originalPrice: 0, currency: 'XOF', discount: 0 };
  }

  const country = getCountryByCode(countryCode);
  const currency = country?.currency?.code ?? offer.currency;
  const basePrice = getOfferPrice(planId, billingPeriod);

  if (basePrice === null) {
    return { price: 0, originalPrice: 0, currency, discount: 0 };
  }

  // Validated launch prices are canonical in XOF. International localization
  // can be added per country without changing the offer IDs or checkout API.
  const price = basePrice;
  const monthly = offer.monthly ?? basePrice;
  const yearly = offer.yearly;
  const effectiveMonthlyYearly = yearly === null ? monthly : yearly / 12;
  const discount = billingPeriod === 'yearly' && monthly > 0
    ? Math.max(0, Math.round((1 - effectiveMonthlyYearly / monthly) * 100))
    : 0;

  return {
    price,
    originalPrice: billingPeriod === 'yearly' ? yearly ?? basePrice : monthly,
    currency,
    discount,
  };
}

export function calculateDiscount(planId: string, billingPeriod: BillingPeriod): number {
  return getPricingForCountry('ML', planId, billingPeriod).discount;
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
  const resolvedLocale = locale ?? 'fr-FR';
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

export { COMMERCIAL_OFFERS };
