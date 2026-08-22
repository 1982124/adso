# ADSO — Open-source high-tech reinforcement

## Objective

ADSO uses open-source/open-weight technology where it improves resilience, visual quality, cost control, portability, or vendor independence. Open-source components never replace production verification, security review, licensing review, or the core product architecture.

## AI resilience

### Text / assistant

- Primary path: the configured production AI provider/gateway.
- Fallback path: Hugging Face Inference using an open-weight instruction model, configured through `HF_INFERENCE_API_KEY` and `ADSO_OPEN_SOURCE_AI_MODEL`.
- Current default fallback model: `Qwen/Qwen2.5-7B-Instruct`.
- Provider credentials remain environment variables; no key is committed to Git.
- The application must continue to serve the public product when an AI provider is unavailable. AI is an enhancement, not a single point of failure.

### Future self-hosted path

For higher scale or data-sovereignty requirements, evaluate vLLM or Ollama with an approved open-weight model behind a private API. Do not add this to the critical MVP path until latency, cost, GPU availability, security and operational ownership are proven.

## Visual system

ADSO visuals follow a canonical registry in `src/content/visual-library.ts`.

Priority order:

1. Home signature scene
2. ADSO Immersif scene library
3. Road-safety learning visuals
4. Françoise identity assets
5. 54-country contextual variants
6. eBook / marketplace assets

Preferred pipeline for future photorealistic assets:

- source or generate the master visual with a commercially compatible license;
- preserve attribution/license metadata when required;
- create responsive WebP/AVIF derivatives;
- store production assets in versioned project storage/CDN rather than relying on fragile hotlinks;
- keep a stable visual brief so characters, environments, uniforms, vehicles and safety context remain coherent across scenes;
- never represent an illustration as a photograph or a generated scene as a documented real-world event.

Candidate open/open-weight image tooling may include FLUX-family models, Stable Diffusion/SDXL-compatible tooling, ComfyUI and Hugging Face-hosted inference. Model and checkpoint licenses must be reviewed individually before commercial deployment.

## Production engineering principles

- Next.js/React remains the application shell.
- Vercel remains the production delivery layer.
- Neon/Postgres remains the scalable relational data layer where configured.
- API routes must be idempotent where retries are possible.
- AI calls must have timeouts/fallbacks and must never be required for core navigation.
- Security headers, rate limits, authentication and authorization remain first-class controls.
- `npm audit --audit-level=high`, typecheck, lint and production build remain release gates.
- Production evidence is mandatory: READY deployment + live HTTP checks + runtime error check + browser/visual verification when browser tooling is available.

## Product integration targets

ADSO should integrate with leading technology ecosystems through standards and APIs, not by copying their identity:

- Apple / Android: responsive PWA, Web Share, accessibility, installable web experience.
- Google: structured metadata, SEO, analytics-ready events, maps/geographic services when justified.
- Meta / TikTok: shareable learning clips and campaign-safe social cards when product policy and APIs permit.
- Tesla / connected mobility ecosystems: future telemetry/simulator interfaces through documented APIs and consented data, never by assuming undocumented access.
- Udemy-style learning: modular courses, lessons, assessments, progress and certificates.
- PayPal/fintech-style trust: idempotent payments, verified webhooks, audit trails and no exposed credentials.

These are architectural compatibility goals, not claims that third-party integrations are currently active.
