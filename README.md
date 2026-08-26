# ADSO AFRICA

**La plateforme africaine pour une mobilité plus sûre et plus responsable.**

ADSO AFRICA est une plateforme technologique dédiée à l'éducation routière, à la formation à la mobilité, à la prévention, à la simulation et à l'évaluation et reconnaissance des compétences acquises.

## Architecture de marque

- **LÉGENDE VISION** — la vision humaine du fondateur : contribuer à améliorer positivement la vie des citoyens du continent africain.
- **Neo Digital Startup Academy (NDSA)** — l'entreprise porteuse qui conçoit, développe et exploite ADSO AFRICA.
- **ADSO AFRICA** — la plateforme continentale.

## Mobilité-first

ADSO AFRICA ne se limite pas aux futurs conducteurs. Un usager peut cumuler plusieurs situations de mobilité : élève, apprenti de tout secteur d'activité, étudiant, piéton, passager, cycliste, motocycliste, usager de taxi-moto, conducteur ou professionnel.

**Apprenti** signifie apprenti de tout domaine d'activité, pas « apprenti conducteur ». Un apprenti peut être exposé à la circulation lors de ses trajets, comme piéton, passager, cycliste, motocycliste ou conducteur selon son contexte professionnel. ADSO traite donc l'apprenti comme une population prioritaire de prévention et d'apprentissage de la mobilité sûre.

## Pédagogie

`VOIR → DÉCIDER → CONSÉQUENCE → COMPRENDRE → EXERCER → PROGRESSER`

Le moteur pédagogique suit :

`MODULE → LEÇON → SCÈNE → QUESTION → DÉCISION → CONSÉQUENCE → EXPLICATION → EXERCICE → SCORE → COMPÉTENCE → PROGRESSION`

## Publics

Élèves · Apprentis de tous secteurs · Étudiants · Piétons · Passagers · Cyclistes · Motocyclistes · Usagers de taxi-moto · Conducteurs · Conducteurs professionnels · Enseignants · Formateurs · Établissements · Entreprises · Institutions.

## Afrique

L'architecture vise les **54 pays africains** grâce aux Country Packs. Un pays ne doit pas disparaître parce que ses données réglementaires ne sont pas encore complètes : les données peuvent être `Disponible`, `Enrichi`, `À compléter` ou `À vérifier`, avec source et date de vérification lorsque des règles nationales sont affichées.

Le Mali est un premier terrain de déploiement et de preuve de concept ; il ne définit pas la limite géographique du produit. Le Bénin peut constituer un second terrain de référence. L'architecture reste continentale.

## Institutionnel

ADSO AFRICA peut être décliné en :

- **ADSO Africa Citizen** — citoyens et apprenants ;
- **ADSO Africa Établissements** — écoles, centres d'apprentissage, universités, auto-écoles et entreprises ;
- **ADSO Africa Institutionnel** — ministères, agences, collectivités et partenaires.

ADSO AFRICA ne remplace aucune autorité publique et ne prétend pas piloter la sécurité routière à la place des États. Il fournit une infrastructure technologique et pédagogique complémentaire.

## Priorité produit — apprentis et usagers vulnérables

Le produit doit séparer quatre dimensions :

`PERSONNE → MOBILITÉ → EXPOSITION AU RISQUE → COMPÉTENCES`

Un apprenti peut changer de mode de déplacement sans changer de profil. Le parcours doit donc enseigner la sécurité sur les trajets quotidiens et dans les contextes professionnels, sans supposer que l'apprenti conduit un véhicule.

Voir `docs/ADSO_AFRICA_INSTITUTIONAL_PRODUCT_BLUEPRINT.md` pour le blueprint institutionnel.

## MVP

- Formation à la mobilité et éducation routière
- ADSO Immersif
- Parcours et progression
- Compétences et prévention des usagers vulnérables
- E-books et bibliothèque numérique
- Afrique / Country Packs
- Offres établissements
- Authentification, paiement et administration selon les fonctionnalités réellement activées

Les domaines assurance, marketplace généraliste, flotte et télématique sont hors du périmètre produit central du MVP.

## Stack technique

- Next.js 16
- React 19
- TypeScript
- Prisma + PostgreSQL
- Tailwind CSS
- Vercel
- NextAuth

## Vérifications

```bash
npm install
cp .env.example .env
npm run db:generate
npm run dev
npm run lint
npx tsc --noEmit
npm run build
npm audit --audit-level=high
```

Le endpoint `/api/health` vérifie la disponibilité de l'application et de la base de données.

## CI

Les pull requests vers `main` exécutent l'installation, la génération Prisma, ESLint, TypeScript, le build de production et un audit des dépendances avec Node.js 20 et 22.

## Déploiement

Le déploiement de production est géré par Vercel. Les secrets et variables d'environnement doivent être configurés dans le projet Vercel, jamais committés dans le dépôt.
