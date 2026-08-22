# ADSO — Phase 1 E-book Commerce Execution

## Objective

Deliver a real, persistent e-book commerce foundation before activating the autonomous AI publishing agents.

## Phase 1 scope

- Administrative e-book cockpit
- PDF/EPUB upload to private persistent storage
- AI metadata/commercial analysis before publication
- Cover and product metadata
- Draft → validation → publication lifecycle
- Chariow/Maketou/generic checkout configuration
- Verified payment webhook
- Idempotent order/payment processing
- Entitlement creation after verified payment
- Protected reader/library delivery
- Tracking and conversion events
- Sales/commerce analytics foundation
- Marketing media and teaser assets as a first-class extension point

## Existing implementation verified in repository

The repository already contains the administrative e-book cockpit, AI finalization endpoint, upload endpoint, publication endpoint, checkout, webhook, library and protected commerce routes. Do not duplicate these systems; extend them.

## Publication rule

An e-book is not considered commercially live merely because it exists in the catalogue. The complete lifecycle must be verified:

`catalogue → product → checkout → verified payment → entitlement → library → protected reader/download`

## Phase 1 completion gate

Before declaring the e-book commerce engine production-ready, verify:

1. Admin can create an e-book.
2. PDF/EPUB is stored privately and persistently.
3. AI can prepare metadata and a commercial description.
4. Product can remain a draft.
5. Product can be published only when a valid payment route is configured.
6. Checkout creates an idempotent order.
7. Only a verified signed payment event grants entitlement.
8. Library and reader enforce entitlement server-side.
9. Tracking records the product funnel without collecting unnecessary personal data.
10. Sales metrics can be derived from real order/payment data.

## Phase 2 handoff

After Phase 1 is verified, add autonomous agents for:

- opportunity discovery;
- e-book concept generation;
- content planning and drafting;
- cover/creative briefing;
- teaser/script generation;
- sales-page generation;
- pricing recommendations;
- campaign recommendations;
- conversion analysis;
- public competitive intelligence.

All autonomous actions that publish, spend money, change prices or materially alter public content must remain governed by configurable human approval policies.
