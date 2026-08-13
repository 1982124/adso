# ADSO production / investor verification checklist

## Fixed in the hardening pass

- Country explorer can use the canonical bundled country catalogue when DB seed data is absent or unavailable.
- License catalogue can use the bundled license data instead of showing zero categories.
- Road-sign library can use the bundled French sign catalogue when DB data is unavailable.
- Course API no longer returns a blank/500 response solely because the runtime database is unavailable; it uses bundled course content only where the requested country is actually supported.
- Learning platform statistics no longer depend on the demo `/api/seed` endpoint.
- Marketplace, insurance, fleet, journal and share analytics remain subject to their real authentication/database requirements.

## Explicit non-goals / not yet production-ready

- The repository still uses Prisma + SQLite. A deployment-local SQLite file is not an acceptable durable production database on Vercel. A persistent production database and Prisma provider migration are required before claiming production persistence.
- There is no implemented ADSO LAB video-generation pipeline in this repository. No video-generation capability should be advertised as available until a real provider, storage path, moderation rules and failure handling are implemented.
- Existing course entries marked as `video` are not proof of a functioning video service. They must be backed by real media assets or be presented as ordinary lesson content until the media pipeline exists.
- CI/Vercel must be green before the build is called investor-ready.

## Current deployment status

The Vercel deployment associated with ADSO has reported failure on the base branch as well as the hardening branch. I am not hiding that failure or attributing it to these catalogue fixes without deployment logs.

After the required environment variables and persistent database are configured, inspect the Vercel deployment log for the concrete build/runtime failure before calling the release production-ready.
