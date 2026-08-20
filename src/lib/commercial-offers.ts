/**
 * Canonical ADSO commercial catalogue.
 *
 * Every customer-facing offer and checkout integration should resolve through
 * this module instead of hard-coding names or prices in UI components.
 */
export type BillingPeriod = 'monthly' | 'yearly';

export type CommercialOfferId =
  | 'jeune'
  | 'communaute'
  | 'pro'
  | 'premium'
  | 'etablissement';

export interface CommercialOffer {
  id: CommercialOfferId;
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
    id: 'jeune',
    name: 'ADSO Jeune',
    audience: 'Élèves, étudiants et jeunes apprenants',
    monthly: 600,
    yearly: 5000,
    currency: 'XOF',
    features: [
      'Éducation routière et mobilité sûre',
      'Parcours d’apprentissage progressif',
      'ADSO Immersif',
      'Progression personnelle',
    ],
    checkoutEnabled: true,
  },
  {
    id: 'communaute',
    name: 'ADSO Communauté',
    audience: 'Communautés, associations et groupes de sensibilisation',
    monthly: null,
    yearly: null,
    currency: 'XOF',
    features: [
      'Apprentissage collectif du code de la mobilité',
      'Scènes visuelles et contenus vocaux',
      'Sensibilisation adaptée au contexte local',
      'Socle de progression collective extensible',
    ],
    checkoutEnabled: false,
  },
  {
    id: 'pro',
    name: 'ADSO Pro',
    audience: 'Conducteurs, chauffeurs et professionnels de la mobilité',
    monthly: 1500,
    yearly: 12000,
    currency: 'XOF',
    features: [
      'Parcours conducteur professionnel',
      'Conduite responsable',
      'ADSO Immersif avancé',
      'Progression et compétences',
    ],
    checkoutEnabled: true,
  },
  {
    id: 'premium',
    name: 'ADSO Premium',
    audience: 'Utilisateurs souhaitant un accompagnement individuel avancé',
    monthly: 2500,
    yearly: 20000,
    currency: 'XOF',
    features: [
      'Tout le parcours ADSO individuel',
      'Accompagnement avancé',
      'Contenus et exercices supplémentaires',
      'Expérience personnalisée selon les fonctionnalités disponibles',
    ],
    checkoutEnabled: true,
  },
  {
    id: 'etablissement',
    name: 'ADSO Établissement',
    audience: 'Écoles, universités, entreprises et organisations',
    monthly: null,
    yearly: 180000,
    currency: 'XOF',
    features: [
      'Jusqu’à 100 licences dans l’offre de lancement',
      'Déploiement collectif',
      'Suivi des apprenants',
      'Administration établissement',
    ],
    checkoutEnabled: true,
  },
] as const;

export function getCommercialOffer(id: string): CommercialOffer | undefined {
  return COMMERCIAL_OFFERS.find((offer) => offer.id === id);
}

export function getOfferPrice(id: string, period: BillingPeriod): number | null {
  return getCommercialOffer(id)?.[period] ?? null;
}

export function formatXof(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(amount);
}
