# ADSO OmniRoute — production runbook

## Architecture

ADSO Vercel → HTTPS → Fly.io OmniRoute → persistent `/data` volume → provider adapters.

The gateway is always-on for the MVP (`min_machines_running = 1`, `auto_stop_machines = false`). OmniRoute state is stored on the persistent volume; Fly snapshots provide rollback/recovery coverage. OmniRoute must not be deployed as an ephemeral Vercel function.

## First provisioning

1. Install/authenticate `flyctl`.
2. Ensure the app `adso-omniroute-gateway` exists in the correct Fly account.
3. Create/attach the persistent volume named `omniroute_data` in the `jnb` region, matching the `fly.toml` mount.
4. Deploy from `infra/omniroute` using the pinned image in `fly.toml`.
5. Verify `https://adso-omniroute-gateway.fly.dev/api/monitoring/health` returns healthy.
6. In OmniRoute Dashboard, connect providers and create a dedicated ADSO endpoint API key.
7. Store the endpoint key only as a Vercel server-side secret (for example `OMNIROUTE_API_KEY`).
8. Store provider credentials only inside OmniRoute's encrypted provider configuration or its server secret store. Never commit them to Git.

## Required production checks

- `/api/monitoring/health` healthy.
- `/v1/models` reachable with the endpoint key.
- Text request succeeds.
- Provider failure causes controlled fallback.
- Image request succeeds if an image provider is configured.
- Image edit succeeds if an image-edit provider is configured.
- TTS/STT succeed if audio providers are configured.
- Video is tested only when a provider explicitly supports the required video capability.
- Restarting the VM preserves provider configuration and endpoint keys.
- Vercel redeploy does not change the OmniRoute URL or stored state.

## Provider strategy

Use a layered policy:

1. Free/open-source provider for low-risk development and baseline workloads.
2. Second independent provider for fallback.
3. Premium provider only for workloads where quality, latency or modality requires it.
4. Local/self-hosted provider later for workloads that justify dedicated compute.

Do not make the core ADSO application depend on any one provider.

## Secrets

Never put provider credentials or `OMNIROUTE_API_KEY` in:

- GitHub files;
- browser code;
- client-side environment variables;
- screenshots;
- logs;
- chat messages.

Use Fly secrets for OmniRoute-side secrets and Vercel server-side environment variables for ADSO-side secrets.

## Backups and recovery

The persistent Fly volume is the source of truth for OmniRoute state. Keep automatic volume snapshots enabled. Before a major OmniRoute upgrade:

1. verify health;
2. verify provider tests;
3. create/confirm a current volume snapshot;
4. upgrade the pinned image deliberately;
5. run smoke tests;
6. roll back to the previous image if tests fail.

For business-critical scale, add an external encrypted backup of the OmniRoute database/configuration. Do not assume a single VM is disaster-proof.

## Stable public endpoint

Use the Fly HTTPS hostname for the MVP. Do not use Cloudflare Quick Tunnels for production because their hostname is temporary. If ADSO later needs a branded stable domain or additional WAF/Zero-Trust controls, use a Cloudflare **named** Tunnel or a direct custom-domain mapping; never replace the stable production endpoint with a Quick Tunnel.

## Upgrade policy

The Docker image is pinned. Do not silently switch back to `latest`. Upgrade only after provider and multimodal smoke tests pass, then commit the new version tag.
