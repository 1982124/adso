# Authentication hardening

## Baseline

- Passwords are hashed with salted `scrypt` and compared with `timingSafeEqual`.
- Credentials are never returned by the registration endpoint.
- New accounts are created with the `student` role.
- Session lifetime is limited to 24 hours.

## Production requirements

- `NEXTAUTH_SECRET` must be a strong random production secret.
- Authentication endpoints must be rate-limited at the edge/deployment layer for reliable protection across multiple instances.
- Do not use application seed/demo credentials in production.
- Keep authorization checks in server-side route handlers; middleware is not a substitute for object-level authorization.
