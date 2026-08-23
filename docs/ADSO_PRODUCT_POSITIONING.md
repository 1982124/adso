# ADSO — Product Positioning Contract

## Decision

ADSO is a platform for **formation à la mobilité, prévention, éducation routière et contenus éducatifs numériques**.

The product has two primary pillars:

1. **Formation à la mobilité**
2. **E-books et contenus éducatifs numériques**

## Explicitly out of the core product

The following domains are no longer primary ADSO products or navigation destinations:

- assurance
- marketplace généraliste
- gestion de flotte
- télématique

They must not appear in the public home experience, primary navigation, principal CTAs, pricing cards, onboarding, or core marketing positioning.

Existing code and database structures for these domains are **not automatically deleted**. They must first be dependency-mapped, deactivated from the product experience, and migrated/archived safely where appropriate.

## Target navigation

- Accueil
- Formation
- ADSO Immersif
- Mon parcours
- Sécurité
- E-books
- Afrique
- Tarifs
- Établissements (contextual)

## Product truth

Every feature must be classified as:

- LIVE
- PARTIAL
- DEMO
- PLACEHOLDER
- NOT IMPLEMENTED

A feature is never considered complete merely because a route, UI, or database model exists.

## Learning model

PARCOURS → MODULE → LEÇON → SCÈNE → QUESTION → DÉCISION → CONSÉQUENCE → EXPLICATION → EXERCICE → SCORE → COMPÉTENCE → PROGRESSION

## E-book model

The e-book pillar supports discovery, product pages, preview, purchase, personal library, reading/progress, publishing workflow, and analytics as each capability becomes genuinely operational.

AI-assisted publishing must distinguish generated, checked, approved, published, and archived content. Regulatory claims require traceable sources and verification dates.

## Country data

Country information must carry a verification state and source metadata. No regulatory fact may be invented. Incomplete country data must not silently remove a country from the experience.

## Certification

ADSO may issue its own completion certificates or attestations where implemented. It must never imply that an ADSO certificate is a government driving licence or state-issued qualification unless legally authorized and explicitly verified.

## CTO rule

Prefer:

**simplicity > complexity**  
**real product > demo**  
**stability > new features**  
**usefulness > marketing**  
**verified data > invention**
