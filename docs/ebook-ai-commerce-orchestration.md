# ADSO — Autonomous AI eBook Commerce Orchestration

## Purpose

The eBook business must be operated as an autonomous customer lifecycle, not as a static catalogue. AI is responsible for customer-facing assistance and non-destructive follow-up; payment confirmation, entitlement, delivery, refunds, and other financial/security state changes remain server-controlled.

## Customer lifecycle

1. **Welcome** — greet the visitor, understand language and intent, explain the eBook value without pressure.
2. **Discovery** — answer questions about the book, author, audience, format, reading experience, and educational value.
3. **Recommendation** — recommend the right eBook or bundle based on stated interest.
4. **Conversion** — present the official purchase action and explain available payment options without exposing receiving-account credentials.
5. **Checkout assistance** — help the customer recover from an abandoned or failed checkout; never claim payment succeeded without a verified provider event.
6. **Purchase confirmation** — after server-side payment verification, confirm the purchase and guide the customer to the library.
7. **Delivery** — provide protected reader/download access only when entitlement exists.
8. **Onboarding** — after purchase, encourage the customer to start reading and offer contextual help.
9. **Follow-up** — schedule useful reminders for unfinished reading, abandoned checkout, support requests, and post-purchase feedback, subject to consent and messaging-channel availability.
10. **Retention** — recommend related educational content based on actual interaction and purchase history; avoid spam.
11. **Support** — answer routine questions, detect payment/access problems, and escalate issues that require human action.
12. **Feedback** — request a review or satisfaction signal after an appropriate reading interval.
13. **Referral** — offer referral/sharing options only where configured and legally permitted.

## AI guardrails

- AI must never fabricate payment success, entitlement, delivery, refunds, or account state.
- AI must read authoritative server state before describing an order as paid or an eBook as owned.
- AI must not expose private eBook URLs, storage credentials, payment secrets, or receiving-account details.
- AI may draft and send customer messages only through configured, consent-aware messaging providers.
- AI must respect opt-out, quiet hours, rate limits, and channel availability.
- Financial refunds, chargebacks, KYC/OTP, legal acceptance, and irreversible account changes require the appropriate server workflow or human intervention.
- Every automated action should be auditable with customer, event, timestamp, channel, template/reason, and outcome metadata.

## Event-driven triggers

- `visitor_started_ebook_chat`
- `ebook_viewed`
- `checkout_started`
- `checkout_abandoned`
- `payment_pending`
- `payment_failed`
- `payment_confirmed`
- `entitlement_created`
- `ebook_opened`
- `ebook_progressed`
- `ebook_completed`
- `support_requested`
- `refund_requested`
- `review_due`

## Required automation capabilities

- event ingestion;
- scheduled jobs for reminders;
- idempotent message dispatch;
- customer preference/consent checks;
- retry and dead-letter handling;
- message templates with localization;
- conversation context linked to customer/order/eBook;
- delivery-status tracking;
- admin audit trail;
- provider health monitoring.

## Channels

Use only channels configured and authorized for ADSO. The architecture should support web chat and email first, then WhatsApp/SMS/push where the corresponding provider and consent are available. No channel should be represented as active merely because its UI exists.

## Mansa Musa eBook

The product record must be created from the supplied master eBook asset and its authoritative metadata. Do not invent price, author, ISBN, cover, file URL, or rights metadata. The binary master must be stored privately and linked to the product through the secure asset workflow.

## Definition of done

The eBook operation is considered complete only when a test customer can discover the book, converse with the assistant, start checkout, complete/verify payment, receive entitlement, access the protected book, receive appropriate post-purchase assistance, and have automated follow-up executed through a configured channel with full auditability.
