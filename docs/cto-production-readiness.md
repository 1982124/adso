# ADSO — CTO Production Readiness

This document records the production-hardening baseline and the remaining blockers for global SaaS scale.

## Current critical findings

1. **Production database is SQLite**. The Prisma datasource currently targets SQLite. This is suitable for development but not for a multi-instance Vercel SaaS. Production migration to managed PostgreSQL is required before relying on durable user data at scale.
2. **CI package-manager mismatch**. The repository contains `bun.lock` but the existing GitHub Actions workflows use `npm ci`. CI must use the committed Bun lockfile or a committed npm lockfile must be introduced deliberately.
3. **Production query logging must remain disabled**. Prisma must not emit SQL/query payloads in production logs because queries can expose sensitive user data and create unnecessary overhead.
4. **In-memory rate limiting is not a global control**. The current proxy limiter is only an instance-local safety net. Production abuse protection must be enforced at a shared edge/cache/rate-limit layer.
5. **RBAC hierarchy needs domain separation**. A simple ordered hierarchy makes an administrator inherit business-role permissions such as insurer/mechanic/fleet-manager. Production authorization should use explicit capabilities and resource ownership checks instead of privilege ordering alone.

## Release gates

A release is not considered production-ready until:

- CI installs from the committed lockfile.
- lint, typecheck, tests and production build pass.
- production uses managed PostgreSQL with migrations and backups.
- authentication and authorization tests cover IDOR and privilege escalation.
- payment/webhook flows are server-authoritative and idempotent.
- AI endpoints have quotas, timeouts, abuse controls and safe error handling.
- rate limiting is shared across instances.
- observability is enabled without logging secrets or sensitive payloads.
- critical user journeys pass end-to-end verification.
- Vercel production deployment is verified after a real main-branch push.

## Scaling strategy

ADSO should scale progressively: stabilize the application first, migrate persistence second, add shared caching/rate limiting third, then optimize high-volume workloads and background jobs. Avoid premature microservices.
