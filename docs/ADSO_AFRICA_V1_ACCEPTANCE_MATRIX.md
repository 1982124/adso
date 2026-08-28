# ADSO AFRICA V1 — Acceptance Matrix

## Statut

**CTO TOTAL — ACTIVE**

This document is evidence-oriented. `GO` is forbidden unless the complete production journey has been tested.

## Seven acceptance chains

| Chain | Complete journey | Evidence required | Current gate |
|---|---|---|---|
| 01 | Discovery → public content → reading → value → sharing | Production journey + share attribution | PENDING |
| 02 | Public content → account → country → language → profile → goal → personalized path | Persisted learner state + correct destination | PENDING |
| 03 | Course → illustration → exercise → assessment → competency → progression | Real result persisted and visible | PENDING |
| 04 | Immersive → pause → decision → consequence → explanation → score → progression | Scene API + attempt + resume test | PENDING |
| 05 | PDF → AI enrichment → teaser → publication → product page → checkout → payment → entitlement → library | Real transaction in configured payment environment | PENDING |
| 06 | Country → language → profile → goal → adapted experience | Five-language journey + country persistence | PENDING |
| 07 | Cockpit → create/edit → validate → publish → public user experience | Protected mutation + published result | PENDING |

## Required hardening

### Runtime

- No known critical runtime errors in production.
- PostgreSQL schema initialization must be safe under concurrency and repeated serverless invocations.
- External storage failures must have explicit fallbacks or truthful degraded states.

### AI media

Assets must carry provenance: `AI_GENERATED`, `AI_ASSISTED`, `HUMAN_PROVIDED`, or `EXTERNAL_SOURCE`.

AI generation is never equivalent to regulatory verification.

### Françoise

Françoise is the pedagogical companion, not the product and not a government authority. The interface may provide country, language, profile, goal, course and competency context; the server must still treat user-supplied context as non-authoritative for regulatory claims.

### eBooks

The target flow is:

`upload → AI enrichment → cover/metadata → teaser → preview → price → publication → product page → checkout → payment → entitlement → library → analytics → sharing`.

The implementation may adopt proven digital-product marketplace patterns such as seller catalog management, product pages, checkout, post-payment access, sales analytics and shareable purchase links, without copying another platform's branding or code.

### Truthfulness

Never report a country pack, payment provider, AI provider, credential, media asset, transaction or security control as live until it is actually verified.

## Release rule

V1 can only move from `PENDING` to `GO GEL V1` when all seven chains are green and no critical runtime/security/transaction blocker remains.
