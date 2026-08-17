# ADSO Autonomous CTO Operating Model

This document records the operating rules for continuous ADSO engineering: inspect the real product, prioritize security/data/payments/stability, preserve verified functionality, distinguish real/partial/mock/placeholder/unimplemented capabilities, test critical user journeys, and never expose secrets or private payment information.

## Product priorities

1. Security
2. Data, payments and money movement
3. Authentication and authorization
4. Stability and error handling
5. Critical user journeys
6. Formation core
7. Monetization
8. Performance
9. Analytics
10. UX/UI
11. Growth
12. New features

## Product architecture direction

- ADSO Education: primary, secondary, lycée and university road-safety education
- ADSO Driver: learner and private driver education
- ADSO Professional: taxi, moto-taxi, delivery and transport drivers
- ADSO Business: driving schools, businesses and fleets
- ADSO Safety: prevention, certification and analytics
- ADSO Partners: insurers, telecoms, fintechs, NGOs and public institutions

New modules are introduced only when the core formation and commercial journeys are stable and economically justified.

## Commercial principle

ADSO monetizes real value: real learners, real schools, real drivers, real fleets, real partners and real paid services. Partner commissions are tied to real paid sales and retention, never primarily to recruitment.

## Verification principle

A production-ready claim requires more than a successful build: the deployed application, critical APIs, data path, authentication boundaries, payments where configured, AI providers, and critical user journeys must be verified with evidence.

## Human intervention

Human intervention is requested only for mandatory authentication, OTP/KYC, legal signatures, purchases, regulatory approvals, access unavailable to the connected tools, or other genuinely irreversible/high-risk actions.
