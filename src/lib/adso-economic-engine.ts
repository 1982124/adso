/**
 * ADSO Economic Engine
 *
 * Central, code-level commercial assumptions for the first monetisation wave.
 * These are planning prices, not historical ADSO revenue and not guarantees.
 * All production checkout amounts must remain configurable by country/currency.
 */

export type EconomicPlanId =
  | 'free'
  | 'student'
  | 'driver'
  | 'pro'
  | 'professional_driver'
  | 'school_primary'
  | 'school_secondary'
  | 'school_lycee'
  | 'university'
  | 'driving_school'
  | 'moto_school'
  | 'fleet'
  | 'enterprise'
  | 'insurance'
  | 'government';

export type BillingPeriod = 'monthly' | 'yearly';

export type EconomicPlan = {
  id: EconomicPlanId;
  segment: 'b2c' | 'education' | 'b2b' | 'institutional';
  label: string;
  baseMonthlyEur: number;
  yearlyDiscount: number;
  includedUsers: number;
  includedVehicles: number;
  aiCredits: number;
  targetGrossMargin: number;
};

/**
 * Initial reference prices for modelling.
 * Local country pricing is applied separately; do not hard-code these as
 * customer-facing currency values.
 */
export const ADSO_ECONOMIC_PLANS: readonly EconomicPlan[] = [
  { id: 'free', segment: 'b2c', label: 'Free', baseMonthlyEur: 0, yearlyDiscount: 0, includedUsers: 1, includedVehicles: 0, aiCredits: 5, targetGrossMargin: 0.55 },
  { id: 'student', segment: 'b2c', label: 'Student', baseMonthlyEur: 2.99, yearlyDiscount: 0.20, includedUsers: 1, includedVehicles: 0, aiCredits: 30, targetGrossMargin: 0.70 },
  { id: 'driver', segment: 'b2c', label: 'Driver', baseMonthlyEur: 5.99, yearlyDiscount: 0.20, includedUsers: 1, includedVehicles: 1, aiCredits: 60, targetGrossMargin: 0.72 },
  { id: 'pro', segment: 'b2c', label: 'Pro', baseMonthlyEur: 12.99, yearlyDiscount: 0.20, includedUsers: 1, includedVehicles: 2, aiCredits: 150, targetGrossMargin: 0.75 },
  { id: 'professional_driver', segment: 'b2c', label: 'Professional Driver', baseMonthlyEur: 9.99, yearlyDiscount: 0.20, includedUsers: 1, includedVehicles: 1, aiCredits: 100, targetGrossMargin: 0.75 },
  { id: 'school_primary', segment: 'education', label: 'Primary School', baseMonthlyEur: 39, yearlyDiscount: 0.15, includedUsers: 100, includedVehicles: 0, aiCredits: 0, targetGrossMargin: 0.80 },
  { id: 'school_secondary', segment: 'education', label: 'Secondary School', baseMonthlyEur: 59, yearlyDiscount: 0.15, includedUsers: 150, includedVehicles: 0, aiCredits: 100, targetGrossMargin: 0.80 },
  { id: 'school_lycee', segment: 'education', label: 'High School / Lycée', baseMonthlyEur: 79, yearlyDiscount: 0.15, includedUsers: 250, includedVehicles: 0, aiCredits: 250, targetGrossMargin: 0.80 },
  { id: 'university', segment: 'education', label: 'University / Campus', baseMonthlyEur: 199, yearlyDiscount: 0.15, includedUsers: 1000, includedVehicles: 0, aiCredits: 1000, targetGrossMargin: 0.82 },
  { id: 'driving_school', segment: 'b2b', label: 'Driving School', baseMonthlyEur: 99, yearlyDiscount: 0.15, includedUsers: 100, includedVehicles: 50, aiCredits: 500, targetGrossMargin: 0.80 },
  { id: 'moto_school', segment: 'b2b', label: 'Moto School', baseMonthlyEur: 79, yearlyDiscount: 0.15, includedUsers: 75, includedVehicles: 75, aiCredits: 400, targetGrossMargin: 0.80 },
  { id: 'fleet', segment: 'b2b', label: 'Fleet', baseMonthlyEur: 149, yearlyDiscount: 0.15, includedUsers: 25, includedVehicles: 25, aiCredits: 500, targetGrossMargin: 0.78 },
  { id: 'enterprise', segment: 'b2b', label: 'Enterprise', baseMonthlyEur: 499, yearlyDiscount: 0.15, includedUsers: 100, includedVehicles: 100, aiCredits: 2500, targetGrossMargin: 0.82 },
  { id: 'insurance', segment: 'institutional', label: 'Insurance', baseMonthlyEur: 1500, yearlyDiscount: 0.10, includedUsers: 500, includedVehicles: 500, aiCredits: 5000, targetGrossMargin: 0.85 },
  { id: 'government', segment: 'institutional', label: 'Government / National Program', baseMonthlyEur: 5000, yearlyDiscount: 0.10, includedUsers: 10000, includedVehicles: 0, aiCredits: 10000, targetGrossMargin: 0.85 },
] as const;

export function getEconomicPlan(id: EconomicPlanId): EconomicPlan {
  const plan = ADSO_ECONOMIC_PLANS.find((item) => item.id === id);
  if (!plan) throw new Error(`Unknown ADSO economic plan: ${id}`);
  return plan;
}

export function yearlyPriceEur(id: EconomicPlanId): number {
  const plan = getEconomicPlan(id);
  return Math.round(plan.baseMonthlyEur * 12 * (1 - plan.yearlyDiscount) * 100) / 100;
}

/** Simple contribution model used by dashboards and planning tools. */
export function contributionMargin(revenue: number, serviceCost: number): number {
  if (revenue <= 0) return 0;
  return Math.max(0, (revenue - serviceCost) / revenue);
}

/**
 * Revenue needed to cover fixed costs at a target contribution margin.
 * Returns Infinity for a non-positive margin.
 */
export function breakEvenRevenue(fixedCosts: number, contributionMarginRate: number): number {
  if (contributionMarginRate <= 0) return Number.POSITIVE_INFINITY;
  return fixedCosts / contributionMarginRate;
}

/**
 * Revenue target expressed as the number of customers paying a given ARPU.
 */
export function customersForRevenue(annualRevenue: number, annualRevenuePerCustomer: number): number {
  if (annualRevenue <= 0 || annualRevenuePerCustomer <= 0) return Number.POSITIVE_INFINITY;
  return Math.ceil(annualRevenue / annualRevenuePerCustomer);
}

export const ADSO_EDUCATION_POSITIONING = {
  primary: 'Road-safety education from childhood: pedestrian, passenger, bicycle and risk awareness.',
  secondary: 'Structured road-safety and mobility literacy before motorised driving age.',
  lycee: 'Pre-driving preparation, code foundations, risk perception and responsible mobility.',
  university: 'Campus mobility, motorcycle safety, certification and transition toward professional driving.',
  professionalDriver: 'Continuous safety, professional certification, prevention and employability for taxi-moto, taxi, delivery and transport drivers.',
} as const;
