import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Plan {
  id: string;
  name: string;
  price: number;
  annualPrice?: number;
  currency: string;
  features: string[];
  audience?: 'b2c';
  recommended?: boolean;
}

const DEFAULT_PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    annualPrice: 0,
    currency: 'EUR',
    audience: 'b2c',
    features: [
      'Accès aux cours de base',
      'Quiz limités',
      'Profil étudiant',
      'Suivi de progression',
      'Partage de résultats',
      'Support communautaire',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 9.99,
    annualPrice: 99.9,
    currency: 'EUR',
    audience: 'b2c',
    features: [
      'Tous les cours de théorie',
      'Quiz illimités',
      'Examens adaptatifs',
      'Progression sauvegardée',
      'Statistiques personnelles',
      'Support par email',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    annualPrice: 199.9,
    currency: 'EUR',
    audience: 'b2c',
    recommended: true,
    features: [
      'Tout le contenu Starter',
      'Examens blancs illimités',
      'Coach IA personnel',
      'Simulations avancées',
      'Analyse des erreurs et points faibles',
      'Parcours de préparation personnalisé',
      'Support prioritaire',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 39.99,
    annualPrice: 399.9,
    currency: 'EUR',
    audience: 'b2c',
    features: [
      'Tout le contenu Pro',
      'Cours pratiques guidés',
      'Moniteur dédié',
      'Certification',
      'Neuro-pédagogie avancée',
      'Parcours IA complet',
      'Support dédié 24/7',
      'Accès multi-appareils',
    ],
  },
];

type BillingPeriod = 'monthly' | 'yearly';

interface SubscriptionState {
  plan: string;
  plans: Plan[];
  billingPeriod: BillingPeriod;
  isActive: boolean;
  expiresAt: string | null;

  setPlan: (planId: string) => void;
  setBillingPeriod: (period: BillingPeriod) => void;
  cancelSubscription: () => void;
  reactivateSubscription: () => void;
}

function getExpiration(period: BillingPeriod) {
  const expires = new Date();
  if (period === 'yearly') {
    expires.setFullYear(expires.getFullYear() + 1);
  } else {
    expires.setMonth(expires.getMonth() + 1);
  }
  return expires.toISOString();
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      plan: 'free',
      plans: DEFAULT_PLANS,
      billingPeriod: 'monthly',
      isActive: true,
      expiresAt: null,

      setPlan: (planId) => {
        const isPaidPlan = planId !== 'free';
        const billingPeriod = get().billingPeriod;
        set({
          plan: planId,
          isActive: true,
          expiresAt: isPaidPlan ? getExpiration(billingPeriod) : null,
        });
      },

      setBillingPeriod: (billingPeriod) => set({ billingPeriod }),

      cancelSubscription: () => set({ isActive: false }),

      reactivateSubscription: () => {
        const { plan, billingPeriod } = get();
        set({
          isActive: true,
          expiresAt: plan === 'free' ? null : getExpiration(billingPeriod),
        });
      },
    }),
    { name: 'adso-subscription-store' }
  )
);
