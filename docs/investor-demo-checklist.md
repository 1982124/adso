# ADSO investor demo checklist

## Fixed in this pass

- Country explorer falls back to the canonical 49-country catalogue when DB seed data is absent or partial.
- License catalogue falls back to the canonical static license data instead of displaying zero categories.
- Marketplace now has a real authenticated publishing workspace and stores validated image URLs.
- Insurance policy/claim/dashboard API responses normalize monetary values before reaching the UI.
- First fleet vehicle registration can bootstrap a default fleet, validates inputs, and enforces fleet capacity.
- User Journal documents the main workflows with a "understand before acting" rule.
- Facebook promotion/share action is present in the footer and copies the message together with the current platform URL.

## Verification gate

CI and the Vercel preview must be green before calling the build investor-ready. The preview currently associated with PR #5 is:

https://adso-ai-driving-git-investor-ready-ndsa.vercel.app
