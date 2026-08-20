import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { COMMERCIAL_OFFERS, type CommercialOffer } from '@/lib/commercial-offers';

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
}

const DEFAULT_PLANS: Plan[] = COMMERCIAL_OFFERS.map((offer: CommercialOffer) => ({
  id: offer.id,
  name: offer.name,
  price: offer.monthly ?? offer.yearly ?? 0,
  currency: offer.currency,
  features: offer.features,
}));

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

function getExpiry(period: BillingPeriod): string {
  const expires = new Date();
  if (period === 'yearly') expires.setFullYear(expires.getFullYear() + 1);
  else expires.setMonth(expires.getMonth() + 1);
  return expires.toISOString();
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      plan: 'jeune',
      plans: DEFAULT_PLANS,
      billingPeriod: 'monthly',
      isActive: true,
      expiresAt: null,

      setPlan: (planId) => {
        const isKnownPlan = DEFAULT_PLANS.some((plan) => plan.id === planId);
        if (!isKnownPlan) return;
        set({
          plan: planId,
          isActive: true,
          expiresAt: getExpiry(get().billingPeriod),
        });
      },

      setBillingPeriod: (billingPeriod) => set({ billingPeriod }),

      cancelSubscription: () => set({ isActive: false }),

      reactivateSubscription: () => set({
        isActive: true,
        expiresAt: getExpiry(get().billingPeriod),
      }),
    }),
    { name: 'adso-subscription-store' },
  ),
);
