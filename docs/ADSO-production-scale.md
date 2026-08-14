# ADSO — Production Scale Guardrails

## Product principle

ADSO must remain simple for the learner while the platform absorbs complexity behind the scenes.

**The complexity belongs in the platform, never in the user's face.**

## Readability and projection

- All primary typography uses responsive `rem` sizing.
- The application exposes a persistent text-size control from 100% to 150%.
- Large screens increase the baseline typography automatically.
- Layouts must remain fluid; no critical content may depend on fixed viewport pixels.
- Images must use sufficiently high-resolution source assets and responsive delivery. CSS cannot recover detail that is absent from the source image.
- Respect `prefers-reduced-motion`.
- Keyboard focus must remain visible.

## Global scale target

"One billion subscribers" is a product ambition, not a claim that the current deployment can serve one billion users today.

To reach that order of magnitude, ADSO must progressively enforce:

1. CDN-first delivery for public/static content.
2. Server-rendered and cached public pages wherever personalization is not required.
3. Stateless application servers/functions.
4. PostgreSQL/Neon as the system of record, with indexed access paths and connection management suitable for serverless workloads.
5. Read-heavy learning content separated from write-heavy learner state.
6. Asynchronous jobs for analytics, recommendations, official-content synchronization, certificates and partner notifications.
7. Idempotent APIs and safe retries.
8. Rate limiting and abuse controls at the edge/API boundary.
9. Observability for latency, error rate, saturation and database health.
10. Load testing at progressively larger levels before each major growth stage.

## Data locality

A country selection must determine the regulatory and contextual learning dataset. ADSO must never silently present one country's legal rules as another country's rules.

The application may use a clearly-labelled international safety foundation when a localized legal catalogue is unavailable, but it must not invent or silently substitute regulatory facts.

## AI governance

AI may personalize, explain, recommend and analyze. It must not invent official road rules, legal limits or government requirements. Regulatory facts must come from maintained authoritative sources and be versioned.

## Marketplace and ecosystem

Marketplace, insurance, fleet, maintenance, partner and driving-school capabilities remain ecosystem modules. They must not overload the learner's core journey.

## Production gate

A release is not considered globally production-ready merely because the Next.js build is green. The release gate also requires:

- database connectivity verified;
- schema compatibility verified;
- authentication verified;
- critical API routes smoke-tested;
- runtime errors checked after deployment;
- mobile and large-screen accessibility checked;
- rate limits and security headers verified;
- rollback path identified.
