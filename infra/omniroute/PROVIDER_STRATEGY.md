# ADSO — OmniRoute Provider Strategy

## CTO decision

ADSO must not depend on one AI provider. OmniRoute is the gateway; AI-SCOS selects the business agent and task; provider policy selects the best available model for the task.

The production strategy is **free/open-source first for development and resilience, paid providers only where quality, video/image capability, throughput or SLA requires them**.

## Tier 0 — zero/near-zero-cost development and fallback

### Google Gemini Developer API / Google AI Studio
- Use for: multimodal reasoning, text, document understanding, image/video/audio understanding where the selected model supports it.
- Current official pricing has a free tier for selected models; limits apply and Google states that free-tier content may be used to improve products.
- Status: preferred initial free development provider.

### OpenRouter
- Use for: multi-model fallback and experimentation through one OpenAI-compatible API.
- Current free plan exposes 25+ free models / 4 free providers and a 50-request/day limit; the `openrouter/free` router can select among currently free models.
- Status: secondary fallback, not the sole production backbone.

### Hugging Face Inference Providers
- Use for: testing open models and provider diversification.
- Current free accounts receive a small monthly credit; additional use is pay-as-you-go.
- Status: research/testing and selected workloads.

### Cloudflare Workers AI
- Use for: open-source model inference without managing GPU infrastructure.
- Current Free plan includes 10,000 Neurons/day; model availability varies and some large models now require the paid Workers plan.
- Status: low-cost/open-model provider and future edge inference option.

### Local open-source models
- Ollama / vLLM / LM Studio where appropriate.
- Use for: privacy-sensitive workloads, development, deterministic internal jobs and cost control.
- Status: optional self-hosted provider; production use requires adequate CPU/GPU capacity.

## Tier 1 — production quality providers

Add only after live verification and with spending controls:

- OpenAI — reasoning, text, image/audio where appropriate.
- Anthropic — complex reasoning, writing and review.
- Google Gemini — multimodal and long-context workloads.
- Mistral — European/open-weight-oriented workloads and multilingual use cases.
- Groq — low-latency inference where supported.
- Together / Fireworks / DeepInfra / Novita — open-model inference and cost diversification.
- Replicate / Fal / other specialist providers — image/video/audio workloads after live testing.

These are not assumed to be free. No provider is considered production-ready until its current terms, pricing, limits, privacy behavior and API reliability are verified.

## Task routing policy

| ADSO workload | Primary class | Fallback class |
|---|---|---|
| Simple chat/support | fast/low-cost | free model |
| Complex reasoning | premium reasoning | Gemini / open model |
| Education content | strong multilingual model | free model |
| Examiner / grading | strong model + second-pass QA | independent verifier |
| Research | web/search-capable provider | second research provider |
| Fact-check | research + verifier | second verifier |
| E-book drafting | long-context writing model | open model |
| E-book correction | independent editor | second editor |
| Translation/localization | multilingual model | second multilingual model |
| Image generation | specialist image provider | second image provider |
| Image editing | specialist edit provider | second edit provider |
| Video generation | specialist video provider | second video provider |
| TTS | specialist audio provider | second TTS provider |
| STT | specialist transcription provider | second STT provider |
| Moderation | dedicated moderation model | second moderation model |
| Embeddings/reranking | embedding/rerank provider | open model |

## Fallback policy

Never create a fallback chain containing only free providers. Free providers can be rate-limited, unavailable, changed or discontinued.

Recommended production shape:

`Primary high-quality -> secondary provider -> open/free provider -> ADSO graceful degradation`

For expensive media generation:

`Primary specialist -> secondary specialist -> queue/retry -> user-visible pending state`

Never silently generate a lower-quality paid asset when the user requested a premium asset without recording the downgrade.

## Security

Provider API keys must remain server-side in OmniRoute. Never commit keys to GitHub and never expose provider credentials to the browser.

Do not use web-cookie/OAuth provider connections for automated commercial workloads unless their terms explicitly permit the intended use. Prefer official API credentials for production automation.

## Production gates

A provider is promoted to production only after:

1. authentication test;
2. model discovery;
3. representative prompt test;
4. latency test;
5. error/429 test;
6. timeout test;
7. fallback test;
8. privacy/retention review;
9. cost/budget review;
10. license/terms review;
11. multimodal output validation where applicable.

## Hosting decision for persistent OmniRoute

### Preferred no/low-cost route

1. **Oracle Cloud Always Free VM** — preferred if the account can be created and verified. OCI currently offers Always Free compute, block storage and object storage; most users require phone + credit card for account verification, so this is not guaranteed to satisfy the no-card constraint.
2. **Any existing always-on Linux machine** — valid zero-infrastructure-cost fallback. Run OmniRoute with Docker and persistent volume, then expose it securely with Cloudflare Tunnel. This is only production-grade if the machine and internet connection have adequate uptime and backups.
3. **Low-cost VPS** — production fallback when the business is ready to pay for reliability.

### Not selected as primary OmniRoute host

- InfinityFree: conventional web hosting; unsuitable for a persistent Docker/Node gateway.
- Cloudflare Workers AI: provider/inference layer, not the persistent OmniRoute host.
- OpenRouter: provider aggregation layer, not the OmniRoute host.
- Free serverless platforms that sleep/recycle instances: unsuitable for the always-on gateway requirement unless explicitly tested and accepted.

## Scaling

Start with one persistent OmniRoute instance. Because OmniRoute keeps local state and persistent data, do not horizontally scale until state synchronization and secret/config management are explicitly designed.

## Business rule

ADSO should be able to operate in a constrained/free mode, but production revenue-generating workloads must have an explicit cost policy. Free tiers are resilience/development resources, not a promise of unlimited production capacity.
