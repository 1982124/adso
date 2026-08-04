# Task 1a — Insurance Intelligence Platform API Routes

## Status: COMPLETED ✅

## Files Created (7 new files)

### 1. `/src/app/api/insurance/premium/route.ts` — Dynamic Premium Engine
- **GET**: Calculates premium for all user policies using TrustScore, DrivingSession behavior data, vehicle age, mileage, claims count, maintenance quality
- **POST**: Recalculates premium for a specific policyId, creates PremiumCalculation record, updates policy.premium
- Formula: `basePremium * (1 - trustScore/200) * (1 + behaviorPenalty) * (1 + riskFactor)`
- Base premiums: third_party=500, comprehensive=900, collision=700, theft=600, gap=400

### 2. `/src/app/api/insurance/phyd/route.ts` — Pay How You Drive
- **GET**: Returns PHYD metrics from TelematicsTrip records — total km, duration, night/city/highway %, avg driving score, avg eco score, monthly breakdown
- **POST**: Generates monthly PHYD report for specified month/year
- Returns zeros with "Aucune donnée de télématique" when no trips exist

### 3. `/src/app/api/insurance/accident/route.ts` — Accident Detection
- **GET**: Lists all AccidentIncident records for user (latest first)
- **POST**: Creates AccidentIncident from telemetry data (type, severity, lat/lng, speed, deceleration, vehicleId)
  - Auto-creates InsuranceClaim (status='draft') for high/critical severity
  - Creates CollaborationEvent (triggerModule='telematics', eventType='accident')

### 4. `/src/app/api/insurance/damage/route.ts` — AI Damage Assessment
- **GET**: Gets DamageAssessment for a claim (query param claimId)
- **POST**: Creates DamageAssessment with 7 component scores (0-100 each: bumper/doors/hood/windshield/lights/wheels/chassis)
  - Calculates overallSeverity: >80=minor, >60=moderate, >40=severe, else total_loss
  - Calculates estimatedRepairCost: total_loss=15000, severe=8000, moderate=3000, minor=800
  - Calculates estimatedRepairDuration from severity
  - Generates replacement parts list for scores below 50 (French part names)

### 5. `/src/app/api/insurance/fraud/route.ts` — Fraud Detection
- **GET**: Analyzes all claims for 3 fraud patterns:
  - Duplicate claims (same description + same location within 30 days)
  - Repeated accidents (3+ claims in 6 months)
  - Abnormal declarations (cost > 3x average and > 5000€)
  - Creates FraudAlert records for new patterns, avoids duplicates
  - Returns all fraud alerts for user
- **POST**: Creates manual fraud alert (accepts claimId, type, description)

### 6. `/src/app/api/insurance/partners/route.ts` — Insurance Partner Portal
- **GET**: Lists all InsurancePartner records
- **POST**: Creates new partner (name, code, country, contactEmail, contactPhone, commissionRate)
  - Validates unique code, returns 409 on conflict

### 7. `/src/app/api/insurance/dashboard/route.ts` — Insurance Dashboard KPIs
- **GET**: Returns real KPIs from database:
  - activePolicies, totalClaims, totalClaimCost (approved+paid), pending fraudAlerts
  - averagePremium, averageRisk (from TrustScore)
  - claimsByMonth, policiesByType, claimsByStatus (all grouped)

## Quality
- ESLint: 0 errors in new files
- All text in French
- All routes use `import { db } from '@/lib/db'` and Prisma client
- All routes use first user via `db.user.findFirst({ orderBy: { createdAt: 'asc' } })`
- All routes have try/catch with console.error and proper HTTP status codes
- No existing files were modified