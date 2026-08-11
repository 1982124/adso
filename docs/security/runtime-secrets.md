# ADSO runtime secrets

Production secrets must live in the deployment secret store (for example Vercel Environment Variables), never in Git.

Required for production authentication:

- `NEXTAUTH_SECRET`: long, random, private signing/encryption secret. This is an application secret, not a user's password.
- `NEXTAUTH_URL`: canonical HTTPS application URL.
- `DATABASE_URL`: production database connection string.

Optional integrations:

- `ZAI_API_KEY`
- `DD_API_KEY`
- `DD_APP_KEY`

Do not copy production values into `.env.example`, issues, pull requests, logs, or chat. Rotate a secret immediately if it is ever exposed.
