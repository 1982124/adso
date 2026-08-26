# ADSO AFRICA — CTO Master Execution Status

Status: ACTIVE / PERMANENT

## Truth-first product definition

ADSO AFRICA is a technology platform dedicated to road-safety education, mobility training, prevention, simulation, and evaluation and recognition of acquired skills. It does not present itself as a government road-safety authority and does not replace official State certifications or permits.

## Architecture locked

ADSO → AI-SCOS → specialized agents → OmniRoute → model/provider layer → QA/approval → product action → Analytics → Optimization → AI-SCOS.

AI-SCOS owns business orchestration. OmniRoute owns model/provider routing. Agents must not embed provider credentials or call providers from browser code.

## Current verified product state

- Production project: `adso-safety` on Vercel.
- Latest production deployment checked: READY, commit `cb5d3813b148b4d9e196dd875aa01dd51b6690e8`.
- Home positioning now explicitly uses ADSO AFRICA and presents the educational/mobility pathway from school through professional life.
- Institutional page exists and uses cautious, non-authority language.
- Institutional inbound API exists with validation, honeypot handling, analytics persistence and AI qualification with a deterministic fallback.
- A real institutional inquiry form is now connected to the institutional page (commits `81f50b16` and `cc9a2fd4`).
- Home currently uses a local hero asset and does not depend on the failing legacy upload endpoint for rendering.

## Important truth gaps

- The repository contains certification-related legacy engines/routes. Public positioning must use `évaluation et reconnaissance des compétences acquises` unless an official jurisdiction and mandate justify the term `certification`.
- `54 pays` is an architectural target, not evidence that 54 complete, verified Country Packs are production-ready. Country readiness must be measured per country.
- Institutional Pull is partly operational: inbound capture and AI qualification exist; discovery, automated outreach, briefing, follow-up and pilot conversion are not yet proven end-to-end.
- AI infrastructure has documented production gates requiring external credentials/infrastructure. These must not be reported as connected until verified.

## Production gates still requiring external credentials or infrastructure

1. A persistent OmniRoute server must be actually provisioned on an external host.
2. A real OmniRoute API key must be generated and stored as a Vercel secret.
3. Real provider credentials must be supplied/configured on the OmniRoute server.
4. Vercel Production/Preview secrets must be configured where needed.
5. Real multimodal endpoints must be tested provider-by-provider before production claims.

## Runtime finding

Historical production errors include `/api/admin/home-media` failing because `BLOB_READ_WRITE_TOKEN` was absent. The current `main` tree no longer exposes the legacy upload route at that path, while a restore route remains. This historical failure must not be represented as a current Home-rendering failure without a fresh reproduction.

## Verification checklist

- Home returns HTTP 200 in production.
- Home metadata identifies ADSO AFRICA.
- Home includes the real ADSO AFRICA hero pathway and institutional entry.
- Institutional inquiry form posts to `/api/institutional/inbound`.
- Inbound API validates required fields, rejects invalid institution types, silently handles the honeypot and records the request/qualification events.
- No secrets are placed in browser code.
- Cockpit metrics are sourced from real data or explicitly marked demo data.
- Country readiness is measured per country rather than inferred from a country list.
- AI/provider claims are made only after live verification.

## Non-negotiable truthfulness rule

Never report a provider, server, payment account, credential, test, deployment or feature as connected/working unless it has actually been verified. When an external account or credential is required, prepare all code/configuration possible and state the exact remaining human action.
