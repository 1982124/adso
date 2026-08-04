# Task 1d — API Routes Builder Work Record

## Task
Build API routes for Vehicle Twin, AI Collaboration, and comprehensive seed route with V4.2 demo data.

## Files Created (2 new files)

### 1. `/src/app/api/vehicle-twin/route.ts` (147 lines)
- **GET**: Returns all VehicleTwin records for user (with vehicle profile). Supports `?vehicleId=` query param for specific twin.
- **POST**: Creates or updates VehicleTwin via upsert. Auto-computes: totalTrips (TelematicsTrip count), totalDistance (sum of distances), avgFuelConsumption (distance-weighted average), aiHealthScore (from DiagnosticRecord severities with penalty system: low=2, medium=8, high=20, critical=40), insuranceStatus (from active InsurancePolicy).
- **PATCH**: Updates specific VehicleTwin fields (whitelisted field list for safety).

### 2. `/src/app/api/collaboration/route.ts` (86 lines)
- **GET**: Returns CollaborationEvent records (latest first). Supports `?unresolved=true` to filter unresolved events only.
- **POST**: Creates CollaborationEvent (central event bus). Accepts triggerModule, eventType, severity, description, affectedModules (JSON string).
- **PATCH**: Resolves a CollaborationEvent (sets resolved=true, optionally stores actions as JSON).

## Files Modified (2 files)

### 3. `/src/app/api/seed/route.ts` — Extended with V4.2 demo data (~350 lines added)
Added `seedV42Data()` function with idempotent seeding for:
- **Insurance**: 3 InsurancePolicy (AXA comprehensive, MAIF third_party, Groupama collision), 2 InsuranceClaims (approved collision + pending weather), 1 TrustScore (realistic French driver metrics)
- **Telematics**: 15 TelematicsTrip records with realistic French locations (Paris, Lyon, Marseille, Bordeaux, Toulouse, Nantes, Strasbourg, Lille, Nice), varied distances (3.8-465 km), scores (65-95), fuel consumption, harsh events
- **Fleet**: 1 FleetOrganization ("Flotte ADSO Demo"), 4 FleetVehicle (Renault Kangoo E-Tech, Peugeot 308, Citroën Jumpy, Dacia Spring), 1 FleetDriver, 5 MaintenanceRecord, 6 FuelRecord, 3 FleetAssignment
- **Security**: 8 SecurityEvent records (movement, geofence_exit, speed_alert, impact, engine_start, tow, door)
- **Marketplace**: 10 MarketplaceListing (garages, parts, towing, driving schools, charging stations, inspection, rental, accessories in French cities), 5 ListingReview, 3 BookingRecord
- **Government**: 6 TrafficViolation records (speeding x2, parking, phone_use, red_light, no_seatbelt)
- **Collaboration**: 3 CollaborationEvent (cross-module workflows: security→insurance, telematics→insurance→driving, diagnostic→fleet→insurance→marketplace)
- **Vehicle Twin**: Auto-creates VehicleTwin for each existing VehicleProfile
- **Fraud**: 1 FraudAlert (linked to pending weather claim)
- **Accident**: 1 AccidentIncident (linked to approved collision claim)
- **Damage Assessment**: 1 DamageAssessment (linked to approved claim with detailed scores)
- **Enterprise**: 3 FeatureFlag (ai_instructor, fleet_optimization, insurance_phyd — all enabled), 1 ApiKey

### 4. `/src/components/modules/TelematicsModule.tsx` — Pre-existing lint fix
Removed `setLoading(true)` from inside useEffect (react-hooks/set-state-in-effect rule).

## Quality
- ESLint: 0 errors, 0 warnings
- All API routes return structured JSON in French
- Seed function is idempotent (checks existing data before creating)
- Proper error handling with try/catch on all routes
- Uses `db.user.findFirst({ orderBy: { createdAt: 'asc' } })` for demo user

## Seed Results
```
{
  "countries": 60, "licenses": 15, "signs": 125, "questions": 274, "practical": 16,
  "insurancePolicies": 3, "insuranceClaims": 2, "trustScores": 1, "telematicsTrips": 15,
  "fleetOrganizations": 1, "securityEvents": 8, "marketplaceListings": 10,
  "trafficViolations": 6, "collaborationEvents": 3, "featureFlags": 3
}
```

## Notes
- FleetDriver limited to 1 record because `userId` has `@unique` constraint and only 1 user exists in DB
- VehicleTwin count is 0 because no VehicleProfile records exist yet (will be auto-created when vehicles are added via the driving module)
- GET /api/seed endpoint updated to include V4.2 model counts
- POST /api/seed now also triggers V4.2 seeding after V3 data
- POST /api/seed with `{"action":"v42"}` triggers only V4.2 data seeding
