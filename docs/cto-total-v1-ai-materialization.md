# ADSO AFRICA V1 — CTO TOTAL AI MATERIALIZATION

## Mission

Transform ADSO AFRICA from a collection of implemented surfaces into a coherent, testable, auditable V1. The governing loop is:

**CONSTRUIRE → PROUVER → ATTAQUER → CORRIGER → REPROUVER → DÉPLOYER → MESURER → GELER**

No feature may be represented as operational unless its end-to-end path is verified in production.

## 1. AI-first media policy

ADSO does **not** depend on physical filming crews or cameras for its initial immersive library. The media factory is AI-generated, with human/administrative validation before publication.

Preferred architecture:

- **Images:** open-weight/open-source-capable image generation, prioritizing FLUX.1 schnell where its Apache-2.0 license is appropriate; use higher-quality models only after license/commercial-use review.
- **Video:** evaluate and integrate an open-weight video model such as Wan2.1 or HunyuanVideo through an isolated generation worker/service. Do not run heavy generation inside Vercel serverless functions. Store generated assets in durable object storage and persist provenance metadata.
- **Voice:** use a multilingual open model such as XTTS-v2 only after verifying its model license and voice rights. V1 language targets are French, English, Arabic, Spanish and Portuguese. No native-language TTS is promised merely because a locale exists.
- **Post-production:** deterministic FFmpeg pipeline for trim, normalization, subtitles/captions, thumbnails and scene variants.

Every generated asset must store: model, model version, prompt, seed when available, generation date, source/reference assets, license status, reviewer status and publication status.

## 2. Canonical Home scene

Generate and publish the canonical ADSO Home scene: African school environment; child cyclist wearing a helmet; taxi-moto rider without helmet; non-gory near-collision/impact educational situation; clearly visible “ATTENTION ÉCOLIERS” sign; parent pointing toward the sign and confronting the driver; group of pupils approaching in the distance. The image must communicate ADSO's mission immediately and remain pedagogical, dignified and non-sensational.

## 3. Immersive engine

The production pipeline is:

**brief → AI storyboard → generated image/video assets → validation → scene metadata → publish → OBSERVER → PAUSE → QUESTION → DECISION → CONSEQUENCE → EXPLANATION → EXERCISE → SCORE → COMPETENCE → PROGRESSION**

If a video is unavailable, do not fake a video. Use a real generated still/animated scene only when that is explicitly the delivered media type. The system must make media type visible to administrators.

## 4. AI eBook factory

The administrator uploads only:

- PDF or source text;
- cover image when available.

The AI pipeline then produces a draft package:

**ingest → OCR/text extraction → structure → cleanup → metadata → synopsis → target audience → categories → keywords → chapters → teaser → short description → sales copy → language variants → accessibility metadata → cover validation → catalogue draft**

The administrator reviews and approves before publication.

The commercial chain must be:

**upload → AI enrichment → review → price/country currency rules → publish → catalogue → teaser → checkout → payment confirmation → order → entitlement → library → telemetry**

No “marketplace ready” claim is allowed until the complete chain has passed a real test purchase in the configured payment environment.

## 5. Teasers are first-class content

Every published eBook should have a real public teaser: cover, title, promise, short synopsis, selected preview pages or excerpt, audience, language and CTA. The teaser is public; purchase and protected library access require the appropriate account/entitlement.

## 6. Remove the credibility defect

Do not describe ADSO as having “too many promises” as a permanent product defect. Instead create a machine-checkable **Capability Registry**:

- `implemented`
- `connected`
- `production_verified`
- `partially_available`
- `disabled`

UI claims must be generated from this registry or otherwise be backed by a documented production check. Unsupported marketing claims must be removed or rewritten immediately.

## 7. Learning and public funnel

The V1 funnel is:

**DISCOVER → LEARN PUBLICLY → SEE VALUE → SHARE → CREATE ACCOUNT → COUNTRY → LANGUAGE → PROFILE → OBJECTIVE → PERSONALIZED PATH → PRACTICE → EVALUATE → RECOGNIZE ACQUIRED SKILLS → DEEPEN → CONVERT IF VALUE JUSTIFIES IT → RETURN → SHARE**

Public content must remain useful without an account. Account creation must unlock concrete persistence/personalization rather than act as an arbitrary gate.

## 8. African country architecture

Use three layers:

**COMMON MOBILITY SAFETY PRINCIPLES → REGIONAL CONTEXT → NATIONAL RULES**

National facts require source, verification date, version and provenance. The informational watch engine should collect candidate updates from official sources, but publication of legally sensitive claims requires an explicit validation state.

## 9. Cockpit

The Cockpit is the governance source of truth for content. Test:

**create → enrich → validate → publish → public visibility → edit/version → unpublish**

The same principle applies to lessons, illustrations, immersive scenes, eBooks, teasers and country content.

## 10. Red-team gates

Before V1 freeze, test every critical route and API for:

- navigation;
- authentication;
- public learning;
- onboarding;
- country/language/profile/objective persistence;
- lesson content and illustrations;
- sharing and Smart Links;
- immersive scenes;
- scoring and skill progression;
- Cockpit publication lifecycle;
- eBook upload/enrichment/publish/teaser/checkout/library;
- payment success/failure/retry;
- institution intake;
- production runtime errors;
- mobile/responsive behavior.

Classify defects P0/P1/P2/P3. P0 and P1 critical defects block the freeze.

## 11. Production truth rule

A GitHub commit is not proof. A Vercel READY deployment is not proof of product correctness. A page that renders is not proof of backend functionality. A database table is not proof of a user journey.

V1 is frozen only when the critical user journeys are executed successfully in production and their evidence is recorded.

## 12. Execution rule

Make the smallest safe changes necessary. Preserve working behavior. Never invent credentials, payment confirmations, AI generations or regulatory facts. Heavy AI generation must be decoupled from Vercel runtime and configured through explicit provider adapters and environment variables.

When an external AI service is unavailable, keep the adapter honest and expose the feature as not-yet-connected rather than silently substituting a fake result.
