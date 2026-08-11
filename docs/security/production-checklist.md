# Production security gate

Before production launch, verify in the deployment provider:

- [ ] `NEXTAUTH_SECRET` is set to a unique random secret.
- [ ] `NEXTAUTH_URL` is the canonical HTTPS URL.
- [ ] `DATABASE_URL` points to the production database, not SQLite development storage.
- [ ] `ZAI_API_KEY` is set only when the AI integration is enabled.
- [ ] Datadog secrets are set only if synthetic monitoring is enabled.
- [ ] No production secret appears in Git history, logs, screenshots, or documentation.
- [ ] Database backups and recovery have been tested.
- [ ] Authentication and authorization are verified on every protected API path.
