# ADSO — Next engineering steps

## P0 — Authentification production

- Replace the current demo credentials flow with password hashing and verification.
- Remove the fallback NextAuth secret from source code.
- Add registration/password reset flows with rate limiting.
- Ensure protected API routes consistently use `requireAuth` / `requireRole`.

## P0 — Data & deployment

- Keep SQLite for local development only.
- Validate the production database configuration before enabling real users.
- Exercise `/api/health` against the production deployment after each infrastructure change.

## P1 — Student MVP

- Make the learning journey the primary product path.
- Persist course enrollment and progress for authenticated users.
- Complete the exam loop: start → answer → score → progression.
- Surface real progress in the student dashboard.

## P1 — AI features

- Make AI Coach responses authenticated and rate-limited.
- Persist conversations and connect them to the learner profile.
- Add clear failure states when the AI provider is unavailable.

## P2 — SaaS / monetisation

- Replace the static pricing CTAs with real subscription state.
- Introduce payment provider integration only after authentication and production data storage are stable.

## Quality gate

Every change to `main` must keep:

- `npm run lint` green
- `npm run build` green
- `/api/health` healthy
- no secrets committed to the repository
