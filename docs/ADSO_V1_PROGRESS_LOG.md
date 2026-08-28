# ADSO AFRICA V1 — Progress Log

## 2026-08-28 — CTO TOTAL

### Completed in this cycle

- Public education page now exposes the restored curriculum directly, without requiring an account.
- Public course CTA is explicitly `LIRE`.
- Learner country picker uses the canonical 54-country African directory as its guaranteed first-render source.
- Learner language selection remains restricted to the V1 international learning languages: French, English, Spanish, Arabic and Portuguese.
- Country context is now persisted in a dedicated cookie in addition to the client-side store, allowing server-rendered features to recover the learner's selected country.
- Françoise can receive learning context (country, language, profile, goal, course and competency) without treating it as regulatory authority.
- The seven V1 Acceptance Chains remain PENDING until their complete production journeys are demonstrated.

### Still requiring production proof

- Account creation and personalized-path persistence across a real session.
- Course assessment → competency → progression persistence.
- Immersive scene decision/score/progression with real published media.
- AI eBook factory → real checkout/payment → entitlement → library.
- Protected Cockpit authentication and content publication.
- Cross-country and five-language end-to-end verification.
- Share links and analytics across public content and commerce.

### Release discipline

No claim of V1 freeze is valid until the seven acceptance chains are production-proven and critical runtime/security/transaction regressions are absent.
