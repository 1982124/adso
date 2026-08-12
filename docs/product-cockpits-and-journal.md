# ADSO — Cockpits, journal and growth analytics

## Product decision

ADSO presents the experience according to the user's role and objective instead of exposing one generic dashboard.

Supported cockpit identities:

- Student: preparation, revision, exams, journal, AI coach.
- Driver: driving sessions, safety, vehicle, journal, performance.
- Instructor: learners, progress, evaluations, content, reports.
- Mechanic: diagnostics, vehicles, interventions, parts, history.
- Insurer: portfolio, claims, risk, fraud, reports.
- Fleet manager: fleet, drivers, maintenance, fuel, safety.
- Admin: users, content, analytics, security, revenue.
- Super admin: governance, analytics, security, revenue, infrastructure.

## Journal

The user journal is owner-scoped and authenticated. Entries are stored as `AnalyticsEvent` records with `eventType=journal_entry`, keeping the first implementation migration-free while preserving a future path to a dedicated journal model.

Operations implemented:

- GET: last 100 personal entries.
- POST: title/body/mood with length limits.
- DELETE: only the owner can delete their own journal entry.

## Sharing analytics

The share event endpoint records:

- platform
- country
- content type
- content ID/path when available
- authenticated user when available

Admin analytics expose:

- daily shares
- monthly shares
- yearly shares
- lifetime total
- unique sharers
- platform ranking
- country ranking
- country × platform matrix
- recent shares

## Security posture

- User cockpit and journal require authentication.
- Journal reads/writes are scoped by authenticated user ID.
- Journal deletion verifies both user ownership and event type.
- Journal fields are length-limited before persistence.
- Admin analytics remain protected by the existing admin RBAC gate.
- Share tracking accepts anonymous events for acquisition measurement but normalizes the platform and bounds payload fields.

## Product impact

High utility: personalization, continuity, measurable learning progress, and a persistent reflection/history layer.

High growth impact: share events connect organic sharing to country/platform performance and create the foundation for referral/conversion attribution.

High operational impact: role-aware cockpit APIs create one reusable information architecture for B2C and the existing ADSO mobility ecosystem.

## Validation limitation

The connected repository currently has no GitHub Actions workflow run available for these latest commits. The implementation was therefore checked structurally against the current Prisma schema and auth/RBAC helpers, but a real TypeScript build/lint execution still needs to run in the project environment before production deployment.
