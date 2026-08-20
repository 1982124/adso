# ADSO — eBook Commerce Go-Live Checklist

## Objective

ADSO may present an eBook as commercially available only when the complete server-side purchase lifecycle is verified.

## Implemented in code

- Public published eBook catalogue.
- Dedicated eBook product page.
- Authenticated checkout-order creation with idempotency.
- Provider-specific checkout links for Chariow and Maketou, plus a generic checkout link.
- Signed payment webhook endpoint.
- Idempotent payment event processing.
- Server-side entitlement creation after a verified `PAID` event.
- Authenticated personal library backed by `EbookEntitlement`.
- Private Vercel Blob upload path for PDF/EPUB assets.
- Entitlement-protected private Blob delivery.
- Administrative eBook creation and upload cockpit.
- Prisma migrations for the eBook commerce tables.

## Required lifecycle

`catalogue → product → checkout → verified payment → entitlement → library → protected reader/download`

## Security requirements

- eBook source files are not stored in GitHub.
- Commercial source files use private Blob storage.
- Protected delivery checks authentication and entitlement before reading the Blob.
- Client-side success states never grant access.
- Webhook signatures are required.
- Payment events and entitlements are idempotent.
- Failed, cancelled or unverified payments do not grant access.

## External configuration required before the first real sale

1. Connect a Vercel Blob store configured as **Private** for the production project.
2. Configure the appropriate Blob authentication/token mechanism for the deployment.
3. Create the actual Chariow and/or Maketou product checkout links for each eBook and enter them in the admin eBook cockpit.
4. Configure the matching `PAYMENT_WEBHOOK_SECRET_<PROVIDER>` value and the provider callback to `/api/ebooks/webhook` using the documented ADSO webhook headers/payload.
5. Upload the real PDF/EPUB and publish the eBook only after its payment route is configured.

## Acceptance test

A release is **GO** only after a real or provider-approved test transaction demonstrates:

`catalogue → product → checkout → verified payment → entitlement → library → protected reader/download`

A catalogue-only implementation is **NOT** considered a commercial eBook store.
