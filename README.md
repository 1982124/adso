# ADSO — Formation à la mobilité et éducation routière

ADSO est une plateforme de formation, de prévention et de contenus éducatifs numériques autour de la mobilité, avec une priorité donnée aux usages africains.

## MVP

- Formation à la mobilité et éducation routière
- ADSO Immersif
- Parcours et progression
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

## Développement local

```bash
npm install
cp .env.example .env
npm run db:generate
npm run dev
```

L'application est disponible sur `http://localhost:3000`.

## Vérifications

```bash
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

Domaine de production canonique : `https://adso-safety.vercel.app`.
