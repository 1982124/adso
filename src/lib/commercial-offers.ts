/**
 * ADSO commercial offer catalogue.
 *
 * This is the customer-facing source of truth for the validated West African
 * launch offers. Payment integrations must use these stable offer IDs rather
 * than hard-coded display prices.
 */

export type BillingPeriod = 'monthly' | 'yearly';

export interface CommercialOffer {
  id: string;
  name: string;
  audience: string;
  monthly: number | null;
  yearly: number | null;
  currency: 'XOF';
  features: string[];
  checkoutEnabled: boolean;
}

export const COMMERCIAL_OFFERS: readonly CommercialOffer[] = [
  {
    id: 'driver',
    name: 'Conducteur',
    audience: 'Conducteurs et apprenants individuels',
    monthly: 600,
    yearly: 5000,
    currency: 'XOF',
    features: [
      'Formation sécurité routière',
      'Parcours conducteur',
      'Progression personnelle',
      'Accès aux contenus inclus dans l’offre',
    ],
    checkoutEnabled: true,
  },
  {
    id: 'institution-100',
    name: 'Établissement · 100 apprenants',
    audience: 'Écoles, universités et établissements',
    monthly: 20000,
    yearly: 200000,
    currency: 'XOF',
    features: [
      'Jusqu’à 100 apprenants',
      'Suivi établissement',
      'Formation sécurité routière',
      'Accès administrateur',
    ],
    checkoutEnabled: true,
  },
  {
    id: 'institution-250',
    name: 'Établissement · 250 apprenants',
    audience: 'Écoles, universités et établissements',
    monthly: 40000,
    yearly: 400000,
    currency: 'XOF',
    features: [
      'Jusqu’à 250 apprenants',
      'Suivi établissement',
      'Formation sécurité routière',
      'Accès administrateur',
    ],
    checkoutEnabled: true,
  },
  {
    id: 'institution-500',
    name: 'Établissement · 500 apprenants',
    audience: 'Écoles, universités et établissements',
    monthly: 70000,
    yearly: 700000,
    currency: 'XOF',
    features: [
      'Jusqu’à 500 apprenants',
      'Suivi établissement',
      'Formation sécurité routière',
      'Accès administrateur',
    ],
    checkoutEnabled: true,
  },
  {
    id: 'fleet-custom',
    name: 'Entreprise / Flotte',
    audience: 'Entreprises et gestionnaires de flottes',
    monthly: null,
    yearly: null,
    currency: 'XOF',
    features: [
      'Tarification selon le parc',
      'Déploiement adapté',
      'Suivi de flotte',
      'Accompagnement commercial',
    ],
    checkoutEnabled: false,
  },
] as const;

export function getCommercialOffer(id: string): CommercialOffer | undefined {
  return COMMERCIAL_OFFERS.find((offer) => offer.id === id);
}

export function getOfferPrice(id: string, period: BillingPeriod): number | null {
  const offer = getCommercialOffer(id);
  return offer?.[period] ?? null;
}

export function formatXof(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(amount);
}
