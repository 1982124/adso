# ADSO MVP — Production Contract

## Objective

Make the core product reliable before expanding AI capabilities.

## Definition of done

A feature is MVP-ready only after implementation, type-check, lint, build where environment permits, deployment, browser verification, and a production smoke test.

## Core gates

- Home renders the intended hero media without blocking text or navigation.
- Home media follows upload → persistent Vercel Blob storage → draft → explicit publish → Home rendering → restore.
- Cockpit metrics come from real data or are explicitly marked as demo data.
- Authentication and role checks protect administrative mutations.
- Database access is server-side and production uses PostgreSQL/Neon.
- API responses do not expose secrets.
- AI is optional for core navigation and learning; provider failure must not crash the product.
- OmniRoute is an adapter/gateway, not a business dependency that prevents the core app from loading.
- Country data supports all 54 African countries with explicit completeness/verification status.
- E-book workflows use a canonical manuscript and only advertise formats that have passed QA.
- Payment credentials and webhook secrets remain server-side.

## AI rollout

AI-SCOS orchestrates specialist agents. OmniRoute routes requests to providers. The initial production strategy is free/open-source-first with controlled fallbacks. No provider is declared production-ready until a real endpoint has been verified.

## External infrastructure gates

The remaining non-code gates are external credentials/infrastructure: a persistent OmniRoute host, its API key, provider credentials, and any Vercel production variables not already configured. Never fabricate these values.

## Non-regression rule

Do not replace a working core flow with an AI-dependent flow unless the new path has a tested fallback and a measurable benefit.
