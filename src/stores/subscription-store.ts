import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { COMMERCIAL_OFFERS } from '@/lib/commercial-offers';

export interface Plan {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number | null;
  currency: string;
  features: string[];
}

const DEFAULT_PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    yearlyPrice: 0,
    currency: 'XOF',
    features: ['Découverte d’ADSO', 'Contenus gratuits', 'Profil utilisateur'],
  },
  ...COMMERCIAL_OFFERS.map((offer) => ({
    id: offer.id,
    name: offer.name,
    price: offer.monthly ?? 0,
    yearlyPrice: offer.yearly,
    currency: offer.currency,
    features: [...offer.features],
  })),
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

function addBillingPeriod(date: Date, period: BillingPeriod): Date {
  const next = new Date(date);
  if (period === 'yearly') next.setFullYear(next.getFullYear() + 1);
  else next.setMonth(next.getMonth() + 1);
  return next;
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
        const now = new Date();
        const expires = addBillingPeriod(now, get().billingPeriod);
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
        const expires = addBillingPeriod(now, get().billingPeriod);
        set({
          isActive: true,
          expiresAt: expires.toISOString(),
        });
      },
    }),
    { name: 'adso-subscription-store' }
  )
);
