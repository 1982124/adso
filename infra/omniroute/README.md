# ADSO — persistent OmniRoute gateway

OmniRoute is deployed as a separate persistent service. ADSO/Vercel remains the application layer and calls OmniRoute over HTTPS.

## Why this topology

OmniRoute keeps provider connections, keys, aliases, routing settings, usage state and SQLite-backed application state. Its documentation explicitly recommends persistent storage for SQLite deployments. Fly Volumes provide persistent storage across restarts and deployments.

The included `fly.toml` uses the official OmniRoute Docker image, mounts a 20 GB persistent volume at `/data`, keeps one machine running, forces HTTPS, and uses `/api/monitoring/health` for health checks.

## One-time deployment

Prerequisites:

1. A Fly.io account.
2. `flyctl` installed and authenticated.
3. The Fly app name in `fly.toml` must be globally available. If it is already taken, change `app` before launch.

From this directory:

```bash
fly launch --no-deploy --copy-config
fly volumes create omniroute_data --region jnb --size 20
fly secrets set REQUIRE_API_KEY=true
fly secrets set OMNIROUTE_API_KEY=<generate-a-long-random-server-key>
fly deploy
```

Do not commit the real key.

## Configure OmniRoute providers

After the service is online, open its HTTPS dashboard and configure only the providers ADSO needs. A strong starting policy is:

- one economical/free provider for resilience;
- one fast provider for support and simple tasks;
- one high-quality provider for complex reasoning/content;
- image providers for Home/content creation;
- video providers only after a live test;
- TTS/STT for Françoise and accessibility.

Use `model: auto` where appropriate so OmniRoute can route according to its configured policy. OmniRoute supports chat, embeddings, image generation, image edits, video generation, audio, moderation and reranking through its OpenAI-compatible API surface.

## ADSO connection

Set these as Vercel server-side environment variables:

```text
OMNIROUTE_BASE_URL=https://<your-omniroute-host>
OMNIROUTE_API_KEY=<ADSO-scoped-key>
OMNIROUTE_MODEL=auto
OMNIROUTE_IMAGE_MODEL=auto
OMNIROUTE_IMAGE_EDIT_MODEL=auto
OMNIROUTE_VIDEO_MODEL=auto
OMNIROUTE_TTS_MODEL=auto
OMNIROUTE_STT_MODEL=auto
OMNIROUTE_MODERATION_MODEL=auto
```

Then redeploy ADSO and verify:

1. `GET /v1/models`
2. chat completion
3. image generation
4. image edit
5. TTS/STT
6. moderation
7. video job submission and polling
8. provider failure → fallback
9. OmniRoute restart → persistent configuration remains
10. ADSO fallback when OmniRoute is unavailable

## Important video note

Video generation is asynchronous and provider support varies. ADSO must not assume every model works merely because it appears in a catalog. Perform a live generation test for every provider/model selected for production. OmniRoute's current documentation exposes `/v1/videos/generations`, but provider-specific failures can occur and must be covered by fallback/health policies.

## Scaling rule

Start with one machine because the SQLite state is volume-backed and Fly Volumes are attached to individual machines. Do not horizontally scale OmniRoute to multiple machines until its state synchronization strategy is explicitly configured and tested. This prevents divergent provider/key/routing state.
