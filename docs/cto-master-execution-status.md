# ADSO — CTO Master Execution Status

Status: ACTIVE / PERMANENT

## Architecture locked

ADSO is a global-by-design technology platform dedicated to road safety education, driver training, simulation, prevention and skills certification. It does not present itself as a government road-safety authority.

Core architecture:

ADSO → AI-SCOS → specialized agents → OmniRoute → model/provider layer → QA/approval → product action → Analytics → Optimization → AI-SCOS.

AI-SCOS owns business orchestration. OmniRoute owns model/provider routing. Agents must not embed provider credentials or call providers from browser code.

## Implemented in repository

- OmniRoute-first resilient chat gateway with managed/direct/local fallbacks.
- Server-side OmniRoute media gateway for image generation, image editing, video, TTS, STT, moderation and model discovery.
- Configurable per-capability OmniRoute model variables.
- Persistent OmniRoute infrastructure configuration with Docker image, HTTPS, health check and persistent data volume.
- Permanent AI-agent operating specification covering Lead Tracker, UGC Studio, AI Marketer, E-book Factory, Research/Fact-check, Creative Media, Analytics/Growth and QA/Compliance.
- E-book canonical-manuscript strategy and multi-format export requirements.
- Global-by-design requirements for language, localization, international distribution, payments, SEO and country availability.
- Human approval gates for public publication, paid spend, scaled customer messaging, regulatory content, claims/testimonials and irreversible deletion.
- Server-side secret policy and production environment template.
- Explicit MVP production contract.
- GitHub Actions quality gate on pull requests and main pushes: dependency install, Prisma generation, ESLint and TypeScript checks on Node 20 and 22.
- Home media upload/publish/restore flow backed by persistent Vercel Blob storage and database state.
- Production health endpoint with database connectivity check.

## Production gates still requiring external credentials or infrastructure

These are deliberately NOT faked:

1. A persistent OmniRoute server must be actually provisioned on an external host.
2. A real OmniRoute API key must be generated and stored as a Vercel secret.
3. Real provider credentials must be supplied/configured on the OmniRoute server.
4. Vercel Production/Preview secrets must be configured where needed.
5. Real multimodal endpoints must be tested provider-by-provider before production claims.

## Recommended infrastructure decision

InfinityFree is not the target runtime for OmniRoute because free shared hosting does not provide the server/process/container control required by a persistent gateway.

Prefer a genuinely persistent Linux/Docker host. Test an Always Free option first where eligibility permits. Do not incur paid spend or add billing details automatically.

## Production verification checklist

- OmniRoute /v1/models reachable over HTTPS.
- ADSO chat succeeds through OmniRoute.
- Provider failure triggers controlled fallback.
- Image generation succeeds.
- Image editing succeeds.
- Video generation is confirmed with an actually supported provider.
- TTS succeeds.
- STT succeeds.
- Moderation succeeds.
- Restart preserves OmniRoute state.
- ADSO deployment remains healthy.
- No secrets appear in browser bundles, Git history or logs.
- Home image upload → persistent storage → preview → publication → Home rendering → restore is verified.
- Cockpit metrics are sourced from real data or explicitly marked demo data.
- E-book generation pipeline is tested at least through canonical manuscript → export → QA for every claimed production format.
- CI quality checks remain green.

## Non-negotiable truthfulness rule

Never report a provider, server, payment account, credential, test, deployment or feature as connected/working unless it has actually been verified. When an external account or credential is required, prepare all code/configuration possible and state the exact remaining human action.
