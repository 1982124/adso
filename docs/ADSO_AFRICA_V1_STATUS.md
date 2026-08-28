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
- The immersive engine has a real persistent media pipeline in ADSO LAB using Vercel Blob.
- Video upload is restricted to MP4, WebM and MOV, with a 500 MB limit and an explicit rights confirmation.
- Uploaded media is stored as a durable `LabMediaAsset` record and remains non-public to the immersive catalogue until moderation is approved.
- The immersive scene API now accepts a `videoAssetId` and resolves the source URL from the stored asset rather than trusting an arbitrary public URL.
- Public scene publication is blocked unless the linked video asset is actually ready, approved and copyright-confirmed.
- The immersive attempt API loads the published scene and canonical choices server-side before evaluating an attempt.
- Partial or forged immersive attempts are rejected when submitted decisions do not cover every canonical interaction.
- The competency dossier is backed by immersive competency/attempt records.
- The learner passport exposes recent scene evidence and recognition status, with explicit rationale and per-competency evidence summary.
- The current main branch contains an administrative Immersive Content Studio at `/admin/immersive` for selecting approved video assets and creating scenes as drafts.
- The Home keeps its existing working image. A reserved canonical asset slot is documented at `/images/home/adso-canonical-home.webp`; no fake image URL is used while the real rights-cleared asset is unavailable.

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
12. At least one real video asset has been uploaded, stored, approved and played successfully before claiming the video-to-scene pipeline is production-demonstrated.
13. The canonical Home image has been supplied as a real rights-cleared asset before claiming that the final mission image is installed.

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
