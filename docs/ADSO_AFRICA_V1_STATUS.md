# ADSO AFRICA V1 — Objective Status

**Date:** 2026-08-27  
**Branch:** `main`  
**Production project:** `adso-safety`  
**Production domain:** `https://adso-safety.vercel.app`

## Mission boundary

ADSO AFRICA is a technology platform for road-safety education, mobility training, prevention, simulation, and evaluation and pedagogical recognition of acquired competencies.

ADSO does not issue driving licences, impose sanctions, regulate traffic, or replace a public authority.

## Current evidence

- The production project is connected to GitHub repository `1982124/adso`.
- The latest production deployment before the current competency-evidence cycle was `f997efc418aa9e39efd2cf88d42a510ae9e4f2fd` and was `READY`.
- Vercel reported no runtime errors during the latest 24-hour check before this cycle.
- The immersive attempt API loads the published scene and canonical choices server-side before evaluating an attempt.
- Partial or forged immersive attempts are rejected when the submitted decisions do not cover every canonical interaction.
- The competency dossier is backed by `ImmersiveCompetency` and `ImmersiveAttempt` records.
- The learner passport exposes recent scene evidence and recognition status.
- The current cycle strengthens the passport so the recognition status includes an explicit rationale and per-competency recent evidence summary.

## V1 competency recognition rule

- **En développement:** below the acquisition threshold.
- **Acquise:** demonstrated level >= 35%.
- **Consolidée:** demonstrated level >= 60% and at least 2 evaluations.
- **Reconnaissance ADSO:** demonstrated level >= 80% and at least 2 evaluations.

These thresholds are pedagogical V1 rules. They are not official government certification criteria.

## Evidence requirement

A recognized competency must be traceable to completed immersive evaluations associated with that competency. The passport must be able to answer:

> Why is this competency at this level?

The V1 interface therefore exposes the recognition rationale and recent pedagogical evidence.

## Country governance

### Mali — priority pilot context

Mali is the first operational context for the product. Regulatory content must be treated as country-specific reference data and must not be represented as legally authoritative unless a competent national source and verification date are attached.

### Benin — second reference context

Benin is a strategic second context. The same source-and-version discipline applies.

### Burkina Faso

Burkina Faso is a comparative/extension context, not the founder's current location or personal context.

### Continental scope

The 54-country architecture is a product architecture. It is **not** evidence that 54 national regulatory packs are currently validated.

## Freeze gates still required

V1 must not be declared frozen until the following are objectively demonstrated in production:

1. A real authenticated learner can complete a published immersive scene.
2. The server rejects forged/partial scoring data.
3. A completed attempt persists in the database.
4. The related competency is updated deterministically.
5. The learner passport retrieves the resulting competency and evidence.
6. The recognition rationale matches the actual stored evidence.
7. Course/module progress remains consistent after an immersive completion.
8. Critical production routes return expected responses.
9. No critical runtime/build errors remain after the final deployment.
10. Mali country learning content has a verified-source status before any regulatory claim is presented as official.
11. The final production deployment corresponds exactly to the final `main` commit.

## Explicit non-goals for V1

- Official licence issuance.
- Government certification.
- Traffic regulation or enforcement.
- Fabricated impact statistics.
- Claims of accident reduction without a valid impact study.
- Selling personal learner data.
- Treating AI output as an official regulatory authority.

## Freeze rule

When all gates are demonstrated, the product enters **V1 FROZEN**. After that, only critical bug fixes, security, compliance, reliability, and maintenance changes are permitted without opening a new version.
