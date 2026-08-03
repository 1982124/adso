import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
}

const DEFAULT_PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    currency: 'EUR',
    features: [
      'Accès aux cours de base',
      '3 quiz par jour',
      'Profil étudiant',
      'Support communautaire',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 9.99,
    currency: 'EUR',
    features: [
      'Tous les cours de théorie',
      'Quiz illimités',
      'Simulations de base',
      'Suivi de progression',
      'Support par email',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    currency: 'EUR',
    features: [
      'Tout le contenu Starter',
      'Simulations avancées',
      'Examens blancs illimités',
      'Coach IA personnel',
      'Moniteur en ligne',
      'Support prioritaire',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 39.99,
    currency: 'EUR',
    features: [
      'Tout le contenu Pro',
      'Certification officielle',
      'Neuro-pédagogie avancée',
      'Tablette moniteur incluse',
      'API marketplace',
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

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set) => ({
      plan: 'free',
      plans: DEFAULT_PLANS,
      billingPeriod: 'monthly',
      isActive: true,
      expiresAt: null,

      setPlan: (planId) => {
        const isPaidPlan = planId !== 'free';
        const now = new Date();
        const expires = new Date(now);
        expires.setMonth(expires.getMonth() + 1);
        set({
          plan: planId,
          isActive: true,
          expiresAt: isPaidPlan ? expires.toISOString() : null,
        });
      },

      setBillingPeriod: (billingPeriod) => set({ billingPeriod }),

      cancelSubscription: () => set({ isActive: false }),

      reactivateSubscription: () => {
        const now = new Date();
        const expires = new Date(now);
        expires.setMonth(expires.getMonth() + 1);
        set({
          isActive: true,
          expiresAt: expires.toISOString(),
        });
      },
    }),
    { name: 'adso-subscription-store' }
  )
);
