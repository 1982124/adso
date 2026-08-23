# ADSO — persistent OmniRoute gateway

OmniRoute is deployed as a separate persistent service. ADSO/Vercel remains the application layer and calls OmniRoute over HTTPS.

## Production topology

`ADSO (Vercel) → HTTPS → OmniRoute (Fly.io) → providers`

OmniRoute keeps provider connections, endpoint keys, routing settings, usage state and SQLite-backed application state. The Fly Volume is mounted at `/data` so the state survives machine restarts and deployments.

## Current production target

- Fly App: `adso-omniroute-gateway`
- Region: `jnb`
- OmniRoute image: `diegosouzapw/omniroute:3.8.50` (pinned; never `latest` in production)
- Port: `20128`
- Persistent volume: `20 GB` at `/data`
- Snapshots: `14` days
- Machines: `1` always running for MVP
- HTTPS: forced
- Health: `/api/monitoring/health`

## Security model

Never commit provider credentials, OmniRoute JWT secrets, API-key secrets, initial passwords or ADSO API keys.

Production secrets belong in Fly secrets. ADSO's OmniRoute API key belongs only in Vercel server-side environment variables. It must never be exposed to browser/client code.

Recommended first-run Fly secrets:

```text
JWT_SECRET=<long-random-secret>
API_KEY_SECRET=<different-long-random-secret>
INITIAL_PASSWORD=<strong-one-time-admin-password>
REQUIRE_API_KEY=true
AUTH_COOKIE_SECURE=true
```

The initial password must be changed/rotated immediately after the first authenticated dashboard login.

## Deployment automation

`.github/workflows/deploy-omniroute.yml` deploys only `infra/omniroute` when that directory changes. It uses a least-privilege Fly deploy token stored in the GitHub Actions secret `FLY_API_TOKEN`.

Fly's current documentation recommends deploy-scoped tokens for CI/CD instead of an all-powerful personal token. The token should be created only after the Fly App exists and should use a practical expiry.

## Provider policy for ADSO MVP

Do not configure dozens of providers merely because OmniRoute lists them. Start with a small, tested resilience chain:

1. economical/free provider for routine tasks;
2. fast provider for support and simple generation;
3. high-quality provider for complex reasoning/content;
4. image provider(s);
5. TTS/STT provider(s);
6. video provider only after a real generation test.

Every production model must pass a live request test. Catalog presence is not proof of operational availability.

## ADSO server-side connection

Vercel should receive these server-side variables after the Fly endpoint is live:

```text
OMNIROUTE_BASE_URL=https://adso-omniroute-gateway.fly.dev
OMNIROUTE_API_KEY=<endpoint-key-created-in-OmniRoute>
OMNIROUTE_MODEL=auto
OMNIROUTE_IMAGE_MODEL=auto
OMNIROUTE_IMAGE_EDIT_MODEL=auto
OMNIROUTE_VIDEO_MODEL=auto
OMNIROUTE_TTS_MODEL=auto
OMNIROUTE_STT_MODEL=auto
OMNIROUTE_MODERATION_MODEL=auto
```

Only `OMNIROUTE_BASE_URL` and the required server-side API key need to be present for the initial text smoke test; modality-specific variables are enabled only after their providers are actually verified.

## Production verification sequence

1. Fly Machine is `started`.
2. HTTPS health check is green.
3. `GET /v1/models` succeeds with the ADSO endpoint key.
4. Real text completion succeeds.
5. Provider failure triggers a tested fallback.
6. Image generation succeeds, if an image provider is configured.
7. Image edit succeeds, if supported by the selected provider.
8. TTS/STT succeeds, if configured.
9. Video generation is submitted and polled successfully, if configured.
10. OmniRoute restart preserves provider/routing/key state.
11. ADSO falls back safely when OmniRoute is unavailable.

## Scaling rule

Keep one Machine for the MVP. Fly Volumes are attached to individual Machines; horizontal scaling must not be enabled until OmniRoute state synchronization is explicitly designed and tested. This prevents divergent SQLite/provider/routing state.
