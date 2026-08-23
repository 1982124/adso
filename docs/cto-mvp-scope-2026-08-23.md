# ADSO — CTO MVP scope decision

Date: 2026-08-23
Branch: cto/mvp-focus-cleanup-20260823
Base: df13a4f73556efb6fe5b84df3af09e1cb233ff91

## Product boundary

ADSO MVP is focused on:

- formation à la mobilité
- éducation et sécurité routière
- ADSO Immersif
- progression et compétences
- e-books et contenus éducatifs numériques
- établissements de formation
- paiements liés aux formations et contenus
- administration, sécurité et analytics nécessaires au produit

## Legacy domains

The following domains are explicitly OUT of the MVP product experience:

- assurance
- marketplace généraliste
- flotte
- télématique

They must not appear in primary navigation, home CTAs, product positioning, pricing cards, onboarding, or core dashboards.

## Current codebase evidence

The repository still contains legacy insurance/fleet/telematics API routes and modules. This document records that they are quarantined for dependency and authorization audit before any destructive deletion.

Known examples include `src/app/api/insurance/*`, `src/app/api/telematics/route.ts`, and legacy v41 modules. Presence in the repository is NOT treated as proof that the routes are exposed or exploitable in production.

## Safe cleanup rule

1. Remove legacy domains from client navigation first.
2. Search all imports/usages and API dependencies.
3. Verify authorization before disabling sensitive routes.
4. Verify database dependencies before migrations.
5. Keep rollback available until production smoke tests pass.
6. Delete only after evidence shows the code is unused and data is migratable.

## MVP acceptance gate

A cleanup change is accepted only when:

- TypeScript passes
- lint passes
- production build passes
- health check passes
- home/navigation smoke test passes
- formation smoke test passes
- immersive smoke test passes
- e-book smoke test passes
- no legacy module is reachable from the primary navigation

## Status vocabulary

- LIVE: implemented and verified
- PARTIAL: implemented but not fully verified end-to-end
- DEMO: demonstrative only
- PLACEHOLDER: UI without real capability
- NOT IMPLEMENTED: absent
- QUARANTINED: legacy capability retained temporarily outside the MVP experience pending dependency/security audit
