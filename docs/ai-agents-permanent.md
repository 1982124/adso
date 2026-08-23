# ADSO — Permanent AI agents

ADSO treats AI agents as durable product services, not one-off prompts. AI-SCOS orchestrates them through the AI gateway layer (OmniRoute when configured, then managed/direct/local fallbacks).

## Permanent agents

### 1. Lead Tracker
Tracks consented first-party leads and lifecycle events:
- source/campaign/landing page;
- lead status and funnel stage;
- last meaningful event;
- follow-up due date;
- conversion state;
- attribution confidence.

It must never scrape private accounts, bypass access controls, or collect personal data without a lawful/consented basis. Prefer first-party CRM/event data and approved public sources.

### 2. UGC Studio
Creates and repurposes user-generated-content concepts:
- scripts;
- hooks;
- short-form variants;
- captions;
- voice/TTS variants;
- image/video briefs;
- platform-specific adaptations.

It must clearly distinguish generated assets from real user testimonials and must not fabricate customer experiences.

### 3. AI Marketer
Plans and optimizes campaigns:
- audience hypotheses;
- offers;
- creative variants;
- landing-page copy;
- email/SMS copy where legally permitted;
- A/B test plans;
- funnel analysis;
- budget recommendations;
- performance summaries.

It can recommend actions but must not silently spend money, impersonate users, or publish sensitive claims without approval controls.

### 4. E-book Factory
Creates structured books from one canonical manuscript and exports:
- PDF;
- EPUB;
- DOCX;
- HTML;
- Markdown;
- TXT/RTF;
- MOBI/AZW3 where a compatible conversion toolchain is available;
- accessible web reading;
- narrated/audio editions where supported.

Pipeline:
idea → research → outline → draft → edit → fact-check → pedagogy → illustrations → cover → layout → conversion → QA → preview → publication → sales tracking → optimization.

### 5. Research / Fact-check agent
Uses authoritative sources for regulatory and safety content. Every material claim should retain source, retrieval/verification date and status. AI output is not itself an official government source.

### 6. Creative Media agent
Coordinates image, image-edit, video, TTS and STT tasks through the gateway. Provider/model capabilities must be verified live before production use.

### 7. Analytics / Growth agent
Aggregates first-party events and approved analytics to identify:
- acquisition efficiency;
- conversion;
- retention;
- content performance;
- ebook performance;
- campaign performance.

### 8. QA / Compliance agent
Runs structured checks before publication:
- factual consistency;
- regulatory-source status;
- accessibility;
- formatting;
- broken links/assets;
- prohibited or misleading claims;
- generated-content labeling where appropriate.

## Orchestration policy

AI-SCOS decides which agent to invoke. OmniRoute decides how to reach the appropriate model/provider. Agents must not embed provider API keys or call external providers directly from browser code.

## Human controls

The system should support approval gates for:
- public publication;
- paid advertising/spend;
- customer messaging at scale;
- regulatory content;
- claims/testimonials;
- irreversible data deletion.

Automation should maximize throughput without removing accountability.
