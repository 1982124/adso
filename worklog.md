# ADSO V4.2 — Worklog

## Historique consolidé

### V4.2 / Infrastructure historique
- Audit initial: Prisma passé de 28 à 39 modèles; API et modules V4.2 étendus.
- Trust-score corrigé; modules assurance, flotte, gouvernement, entreprise, télématique, sécurité, marketplace et Vehicle Twin reliés à des APIs/DB.
- Fondations production: NextAuth, RBAC, rate limiting, headers de sécurité, protection du seed, indexes Prisma.
- APIs protégées par `requireAuth` / `requireRole` selon leur exposition.
- Récupération d'un crash client: référence `SteeringWheel` corrigée, erreurs TypeScript historiques résolues, validation Zod et types Framer Motion corrigés.

### Préparation ADSO Africa V1
- Positionnement public confirmé: éducation routière, formation, prévention, simulation, évaluation et reconnaissance des compétences acquises, e-books.
- Parcours et navigation publics durcis; liens internes convertis vers la navigation Next.js.
- Empty state du Learner Cockpit rendu honnête et actionnable; aucune réglementation nationale inventée.
- Dead-link guard ajouté au Production Quality Gate.
- `fast-uri` forcé en `3.1.7` après vulnérabilité high détectée.
- Anciennes configurations mortes supprimées; URL canonique centralisée via `NEXT_PUBLIC_SITE_URL`.

### Audit sévère pré-livraison
- CI historique: absence de lockfile + cache npm dans `node.js.yml` provoquait un échec avant installation; corrigé en supprimant le cache dépendant du lockfile.
- Home: l'ancien SVG opaque n'est plus utilisé par `HeroRealisticHome.tsx`; le composant actuel reste une composition CSS/Lucide et ne constitue pas le visuel éditorial réaliste final.
- Asset `/images/home/adso-canonical-home.webp` non présent; aucune fausse livraison d'image n'est déclarée.
- Vercel `adso-safety` n'est toujours pas exposé dans l'inventaire du compte Vercel connecté; aucune production E2E n'est déclarée.
- Les 7 chaînes d'acceptation restent PENDING tant qu'elles ne sont pas exécutées et prouvées.

---
## CTO-WORLD-2026-09-06-B — Correction, stabilisation, consolidation, scalabilisation

Actions exécutées:
- Vérification des check-runs du commit précédent: Node 22 échouait au build tandis que TypeScript et ESLint passaient.
- `.github/workflows/ci.yml` durci avec `DATABASE_URL` CI-only, `NEXTAUTH_SECRET` CI-only et `NEXTAUTH_URL`, sans secret de production.
- `.github/workflows/quality.yml` durci avec `DATABASE_URL` CI-only et variables NextAuth synthétiques.
- `production-quality.yml` conserve Prisma validate/generate, TypeScript, ESLint, dead-link guard, audit npm high/critical et build.
- Commits: `d2d9eadcdcfb1f05344450363ba35c2b424ed7a0`, `b647eaac18b1a322d807f47cbf8400aff70fd6f2`.

### Preuves CI en cours
- Sur `b647eaac18b1a322d807f47cbf8400aff70fd6f2`, les jobs `build (20.x)`, `build (22.x)` et `quality (22)` sont en cours au dernier contrôle; aucun GO n'est déduit avant leur conclusion.
- Un ancien job `validate` a été annulé par concurrence, ce qui n'est pas assimilé à un échec applicatif.

### CTO-WORLD-2026-09-06-C — Home: suppression de la répétition visuelle
- Constat utilisateur intégré comme exigence UX: la même photographie ne doit pas être recyclée à plusieurs endroits de l'expérience.
- Création de l'asset éditorial original `public/images/home/adso-mobilite-ecole.svg`, dédié au Hero Home. Il représente une zone scolaire, la mobilité, le vélo avec casque, le taxi-moto et la signalisation dans une composition distincte.
- `HeroRealisticHome.tsx` ne construit plus une fausse scène CSS/Lucide et ne réutilise plus l'ancien visuel opaque. Il affiche désormais l'asset dédié avec texte alternatif accessible et dimensions explicites.
- La légende du Hero précise que cette scène est éditorialement distincte du reste du parcours.
- Commit asset: `95e34c9a65338b93a58f70238be6ea19e334f960`.
- Commit Hero: `8fe6a45b2a428eb73de5c1bb24a313538a16cacd`.
- L'image photographique générée pendant la session reste une proposition créative de référence; elle n'est pas déclarée comme asset production tant qu'elle n'est pas intégrée et vérifiée dans le dépôt.

### État de livraison après correction Home
- Code: durcissement actif.
- Sécurité: correctif `fast-uri` appliqué; audit doit être revalidé par le CI.
- Home: amélioré contre la répétition visuelle; validation production encore requise.
- Vercel: NOT VERIFIED — le compte connecté n'expose pas actuellement `adso-safety` dans son inventaire; ne pas prétendre à une production E2E.
- Acceptance 01–07: PENDING.
- GO GEL V1: NOT GRANTED.

### Règles CTO permanentes
- Aucune affirmation sans preuve.
- Aucun secret réel dans le dépôt.
- Aucun provider de paiement/IA, pays, média, transaction ou contrôle sécurité déclaré LIVE sans vérification réelle.
- Aucun faux état vide ni bouton mort.
- Ne jamais remplacer un asset réaliste manquant par une illustration CSS présentée comme une photo.
- Livraison seulement après CI vert, production vérifiée et 7 chaînes d'acceptation vertes.
