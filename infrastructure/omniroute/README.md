# ADSO OmniRoute persistent runtime

This directory is the deployment boundary for OmniRoute. ADSO itself remains on Vercel.

## Target

- Fly app: `adso-omniroute`
- persistent volume: `omniroute_data` mounted at `/data`
- HTTPS required
- one always-running Machine for MVP
- health check on `/health`

## Provisioning

Run from a trusted local terminal after installing `flyctl` and authenticating to the correct Fly organization:

```bash
fly auth login
fly launch --no-deploy --config infrastructure/omniroute/fly.toml
fly volumes create omniroute_data --size 20 --region cdg --app adso-omniroute
fly secrets set OMNIROUTE_API_KEY="<generate-a-strong-random-value>" --app adso-omniroute
fly deploy --config infrastructure/omniroute/fly.toml --app adso-omniroute
```

Do not commit API keys or provider credentials.

## Verification

```bash
fly status --app adso-omniroute
fly logs --app adso-omniroute
fly machine list --app adso-omniroute
```

Then verify the public HTTPS endpoint:

- `/health`
- `/v1/models`

Only after `/v1/models` succeeds should provider-by-provider multimodal tests be enabled.

## Provider policy

Keep provider credentials in Fly secrets or the provider's server-side configuration. Use multiple providers/fallbacks. Never expose provider keys to the browser or Vercel client bundle.

## Cost safety

Do not increase VM size, add replicas, or attach paid services without an explicit production need. The MVP starts with one persistent Machine and one volume.
