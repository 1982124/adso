# ADSO eBook / AudioBook Commerce Architecture

## Product model
Each eBook is a catalog product that may expose three sellable variants:
- eBook: online reading + authorized download
- AudioBook: chapter-based audio playback + authorized download
- Bundle: eBook + AudioBook

A user may purchase multiple products and owns each entitlement independently.

## Target flow
Catalog -> product detail -> checkout -> verified payment -> entitlement -> personal library -> read/listen/download.

## Audio generation
Audio generation is an admin workflow, not an automatic claim that an audiobook exists. A manuscript is converted into chapter audio, reviewed, stored privately, linked to the eBook, and only then published.

## Security
Digital files must not be exposed from a public static path. Download endpoints must authenticate the user, verify the relevant entitlement, and return a short-lived authorized URL or protected stream. Unauthorized users receive 401/403.

## Bundle behavior
A purchased bundle grants both eBook and AudioBook entitlements. Purchasing one variant alone grants only that variant.

## Scalability
The catalog must be data-driven so 50+ titles can be published without code changes. Use pagination/search/filtering rather than rendering an unbounded catalog on one page.

## Production rule
This document defines the target architecture only. The feature is not considered delivered until checkout, payment confirmation, entitlement, reading, audio playback, and authorized downloads are tested end-to-end in Production.