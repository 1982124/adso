# Task 1c — Real API Routes & Module Frontend Connections

## Summary
Connected 3 module frontends (Telematics, Security, Marketplace) to real database-backed API routes.

## PART 1: Telematics API

### API Route (`/src/app/api/telematics/route.ts`) — REPLACED
- **GET?type=trips**: Returns real `TelematicsTrip` records from DB, formatted for frontend (date, depart, arrivee, distance, duree, vitesseMoy, conso)
- **GET?type=stats**: Computes real stats from DB:
  - totalKm, totalTrips, avgConsumption, avgSpeed, harshBrakes, harshAccel, speedViolations, drivingScore
  - weeklyData: groups events by day of week (last 7 days)
  - monthlyFuel: groups fuel cost by month (last 6 months)
  - carburant: fuel level, range, avg consumption, monthly cost
  - Returns zeros with message "Aucune donnée" if no trips
- **POST**: Creates a new TelematicsTrip record

### Frontend (`/src/components/modules/TelematicsModule.tsx`) — MODIFIED
- Changed initial state: `trips = []`, `stats = null`, added `loading` state
- Added `useEffect` to fetch both trips and stats in parallel on mount
- Falls back to MOCK_TRIPS/MOCK_STATS if API returns empty data
- Added loading guard: shows "Chargement des données télématiques..." while fetching

## PART 2: Security API

### API Route (`/src/app/api/security/route.ts`) — CREATED
- **GET**: Returns real `SecurityEvent` records with user info, French event labels, severity colors
- **POST**: Creates a new SecurityEvent (type, severity, latitude, longitude, address, speed)
- **DELETE?id=**: Deletes an unresolved event (rejects if already resolved)

### Frontend (`/src/components/modules/SecurityModule.tsx`) — MODIFIED
- Removed hardcoded `EVENTS` array and old `SecurityEvent` interface (with `icon: React.ReactNode`)
- Added `ApiSecurityEvent` interface matching API response shape
- Added `eventIcon()` function to resolve icons by event type
- Added `useEffect` to fetch events from `/api/security` on mount
- Replaced `EVENTS` references with `events` state in both anti-vol table and timeline
- `toggleControl` now POSTs a security event to the API when toggling controls
- `statusBadge` updated to use `ApiSecurityEvent['status']`

## PART 3: Marketplace API

### API Route (`/src/app/api/marketplace/route.ts`) — CREATED
- **GET**: Returns real `MarketplaceListing` records with reviewCount, rating, French category labels, formatted prices, gradient colors
- **GET?search=**: Filters by title/description/category
- **GET?category=**: Filters by French category label (reverse-mapped to DB key)
- **POST**: Creates a new listing

### API Route (`/src/app/api/marketplace/reviews/route.ts`) — CREATED
- **GET?listingId=**: Returns reviews for a listing
- **POST**: Creates a review (1-5 rating), updates listing average rating

### API Route (`/src/app/api/marketplace/bookings/route.ts`) — CREATED
- **GET**: Returns bookings (filter by userId or listingId)
- **POST**: Creates a new booking record

### Frontend (`/src/components/modules/MarketplaceModule.tsx`) — MODIFIED
- Changed `Service.id` type from `number` to `string` (matching DB CUID)
- Changed `favorites` state from `number[]` to `string[]`
- Replaced hardcoded `SERVICES` with `FALLBACK_SERVICES` (8 items, used when API returns empty)
- Added `categoryIcon()` function to resolve icons by category name
- Added `useCallback(fetchListings)` to fetch from `/api/marketplace` with search/category params
- Added `useEffect` to fetch on mount and re-fetch on search/category changes
- All `useMemo` filters now use `services` state instead of hardcoded `SERVICES`

## Files Created (5)
- `/src/app/api/security/route.ts` (102 lines)
- `/src/app/api/marketplace/route.ts` (118 lines)
- `/src/app/api/marketplace/reviews/route.ts` (72 lines)
- `/src/app/api/marketplace/bookings/route.ts` (78 lines)

## Files Modified (4)
- `/src/app/api/telematics/route.ts` — Replaced entirely (212 lines, was 69 lines)
- `/src/components/modules/TelematicsModule.tsx` — Surgical edits (state, useEffect, loading guard)
- `/src/components/modules/SecurityModule.tsx` — Surgical edits (events state, useEffect, icon resolver, toggle POST)
- `/src/components/modules/MarketplaceModule.tsx` — Surgical edits (API fetch, fallback data, type changes)

## Quality
- ESLint: 0 errors, 0 warnings
- All 3 API routes verified with curl (returning real DB data)
- Telematics: 15 trips, stats with weekly/monthly breakdowns
- Security: 8 events with proper French labels and colors
- Marketplace: 10 listings across all categories
