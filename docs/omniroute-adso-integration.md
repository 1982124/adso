# ADSO — OmniRoute / AI routing

## Architecture

ADSO uses a layered AI routing policy:

1. **OmniRoute** — preferred multi-provider gateway when `OMNIROUTE_BASE_URL` and `OMNIROUTE_API_KEY` are configured.
2. **Vercel AI Gateway** — managed routing/failover fallback using `AI_GATEWAY_API_KEY` or `VERCEL_OIDC_TOKEN`.
3. **Direct OpenAI** — emergency provider fallback using `OPENAI_API_KEY`.
4. **Françoise open-source fallback** — keeps the assistant available when external AI routes are unavailable.

This keeps AI-SCOS independent from any single provider. The application calls `aiChat()`; provider routing remains an infrastructure concern.

## OmniRoute configuration

Server-side environment variables only:

```text
OMNIROUTE_BASE_URL=https://<your-omniroute-host>
OMNIROUTE_API_KEY=<scoped-server-token>
OMNIROUTE_MODEL=auto
```

Do not expose these variables to browser code. Do not commit real credentials.

OmniRoute supports an OpenAI-compatible `/v1/chat/completions` interface and provides routing/fallback capabilities. ADSO therefore integrates it as an optional infrastructure gateway rather than coupling the product to its internal implementation.

## Vercel fallback

When OmniRoute is unavailable, ADSO uses Vercel AI Gateway if configured. On Vercel, prefer OIDC authentication. Do not forward an OIDC token supplied by a browser request; the server reads the deployment credential from its environment.

## Model policy

- OmniRoute defaults to `auto`, allowing OmniRoute to choose according to its routing policy.
- Vercel AI Gateway uses `ADSO_AI_MODEL` when explicitly configured; otherwise ADSO uses a current documented default.
- Direct OpenAI uses `ADSO_OPENAI_MODEL`, then `ADSO_AI_MODEL`, then its current documented default.

Never hard-code a provider model slug in feature code when an environment or routing policy can select it.

## Resilience

Each external call has a 20-second timeout. A failed route is recorded internally as a failure and the next available route is attempted. The final local fallback prevents a provider outage from becoming an application outage.

## Agent attribution

AI callers can provide `agent` to `aiChat()`. When OmniRoute is active, ADSO sends this as the `X-ADSO-Agent` request header for operational attribution without putting user secrets into the prompt.

Recommended agent values include:

- `coach`
- `teacher`
- `examiner`
- `simulator`
- `business-analyst`
- `customer-support`
- `content-creator`
- `country-specialist`
- `ebook-creator`
- `qa`

## Security

Never send provider credentials to the client. Never accept provider tokens from request headers. Keep OmniRoute behind authenticated server-to-server access and use scoped tokens where supported.

For regulatory content, AI output is advisory until verified against authoritative sources. ADSO must not present AI-generated regulatory information as an official government rule.

## What remains external configuration

The code integration is ready, but a real OmniRoute endpoint and scoped server credential must exist before production traffic can use OmniRoute. This is intentionally not fabricated in source control or Vercel environment configuration.
