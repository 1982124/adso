# ADSO — AI Driven & Smart Optimization

Plateforme intelligente d'apprentissage du code de la route et de la conduite.

## Stack technique

- Next.js 16
- React 19
- TypeScript
- Prisma + SQLite (développement)
- Tailwind CSS
- Vercel
- NextAuth

## Développement local

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:push
npm run dev
```

L'application est disponible sur `http://localhost:3000`.

## Vérifications

```bash
npm run lint
npm run build
```

Le endpoint `/api/health` vérifie la disponibilité de l'application et de la base de données.

## CI

Les pull requests vers `main` exécutent ESLint puis le build avec Node.js 20 et 22.

## Déploiement

Le déploiement de production est géré par Vercel. Les secrets et variables d'environnement doivent être configurés dans le projet Vercel, jamais committés dans le dépôt.
