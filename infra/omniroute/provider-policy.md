# ADSO provider policy

## Production principle

OmniRoute is the routing layer. No single AI provider is a hard dependency of ADSO.

## Tiers

### Tier A — baseline/free/open source

Use for development, low-cost text tasks, classification, drafting and experiments where terms and privacy are acceptable.

Candidate classes supported by OmniRoute include free-tier providers and local/self-hosted providers such as Ollama, LM Studio and vLLM.

### Tier B — independent fallback

Configure a provider from a different upstream infrastructure so a provider outage does not become an ADSO outage.

### Tier C — premium

Use for high-value image/video/audio or tasks where quality/latency materially affects the user experience.

## Routing rules

- Text: cheap/fast baseline → independent fallback → premium.
- Education/exam: quality-first model → independent validation where appropriate.
- Image: image-capable provider → independent image fallback.
- Video: video-capable provider → queued retry/fallback; never claim video support without a real provider test.
- TTS/STT: audio provider → independent fallback.
- Moderation: moderation-capable provider → safe failure policy.

## Verification

A provider is `configured` only after credentials are stored.
A provider is `healthy` only after a real provider test succeeds.
A capability is `production` only after an end-to-end ADSO smoke test succeeds through OmniRoute.

Never infer capability from a provider catalog entry alone.
