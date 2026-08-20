# ADSO — eBook Commerce Go-Live Checklist

## Objective
ADSO may present an eBook as commercially available only when the complete server-side purchase lifecycle is verified.

## Required lifecycle
1. Public catalogue displays a published eBook.
2. Product page displays title, author, cover, description, price and currency.
3. Customer starts checkout.
4. Payment provider confirms payment server-side.
5. Server creates exactly one entitlement for the purchaser and product.
6. Purchased eBook appears in the authenticated personal library.
7. Reader/download endpoint checks entitlement before delivering protected content.
8. Unauthenticated users and users without entitlement cannot retrieve the protected source file.
9. Payment retries/webhooks are idempotent and cannot create duplicate entitlements.
10. Failed, cancelled or unverified payments do not grant access.

## Security requirements
- Do not expose private eBook files through `public/` or predictable static URLs.
- Do not trust a client-side `success` flag to grant access.
- Do not expose payment account credentials or receiving-account details in the UI.
- Verify webhook authenticity according to the selected provider.
- Keep entitlement creation server-side and idempotent.

## Product requirements
- Support real eBook metadata and cover assets.
- Support the configured currency and pricing model.
- Provide clear purchase, owned/read and unavailable states.
- Keep catalogue visibility independent from whether regulatory/content enrichment is complete.

## Acceptance test
A release is **GO** only after a real or provider-approved test transaction demonstrates:

`catalogue → product → checkout → verified payment → entitlement → library → protected reader/download`

A catalogue-only implementation is **NOT** considered a commercial eBook store.
