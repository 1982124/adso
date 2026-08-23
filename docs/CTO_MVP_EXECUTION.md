# ADSO — CTO MVP Execution

## Objective
Stabilize the MVP around the real product promise: education routière, formation, simulation, prévention and certification of competencies.

## Architecture
- Vercel: web application and server-side API routes.
- Neon: durable application data.
- OmniRoute: optional AI gateway, isolated behind a server-side adapter.
- AI-SCOS: orchestration layer for specialized agents.
- Object storage: persistent media (home image, ebooks, generated assets).

## MVP priorities
1. Stable Home with persistent hero media.
2. Real cockpit data, no fabricated production metrics.
3. Auth and authorization.
4. Learning path: module → lesson → scene → question → decision → consequence → explanation → exercise → score → competence → progression.
5. Immersive media support.
6. Country architecture for all 54 African countries with verification status.
7. E-book foundation: canonical manuscript + export targets (PDF/EPUB/DOCX/HTML/Markdown/TXT/RTF where supported).
8. AI adapter with graceful degradation when OmniRoute/providers are unavailable.
9. Analytics and audit events.
10. Production verification after deployment.

## OmniRoute production rule
Do not claim OmniRoute is production-connected until a real persistent endpoint and real provider credentials have been configured and tested. Use a single persistent instance for the MVP; OmniRoute persists state in SQLite and requires persistent storage. Keep secrets server-side.

## Provider strategy
Free/open-source first where quality and terms permit; premium fallback for critical image/video/audio/reasoning tasks. Never hard-code a provider into business logic. Provider selection belongs to the AI gateway configuration.

## Safety / compliance
- Never expose secrets in browser bundles, logs or Git.
- No fake testimonials.
- No spam or unauthorized lead tracking.
- Regulatory road-safety content must retain source/date/verification status.
- Do not represent ADSO as a government authority.

## Definition of done
A feature is not complete because it compiles. It is complete only after implementation, tests, build, deployment, browser verification and a production smoke test. If an external credential/account is required, document the exact human-only step without fabricating success.
