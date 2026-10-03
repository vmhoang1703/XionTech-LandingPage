---
id: SPEC-1-5-site-footer
owner: Sammy
build_day: 2026-10-01
depends_on: ["1.1"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/js/site.js
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/css/site.css
  - ../../decisions-2026-10-01.md
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 1.5: Site footer

## Why

Mandate (FR-7, Demo-day must-have): every visitor, such as Quân the CTO checking time zones, must reach Products, Services, Company links, both real offices and the Privacy policy from the foot of every page. The office facts were supplied by the business on 2026-09-29 and are the only contact route shown site-wide.

## Capabilities

- **CAP-1**
  - **intent:** Visitors see the logo, the blurb and three link columns on every page.
  - **success:** Footer shows the logo, the blurb "Education technology products and software delivery services for schools and businesses.", Products (PXP, LXP, SXP, IoT Device Management to `/products#pxp`, `#lxp`, `#sxp`, `#iot`; the "Product updates" link to `#updates` is hidden on Demo day, T5), Services (Product Engineering, AI-Driven Analytics, Staffing Service, Low-code Solutions, Cloud Computing to `/services#product-engineering`, `#ai-analytics`, `#staffing`, `#low-code`, `#cloud`; All services to `/services`) and Company (About `/about`, Core values `/about#values`, FAQ `/about#faq`, News `/news`, Careers `/careers`, Contact `/demo`) (FR-7).
- **CAP-2**
  - **intent:** Visitors can call, message or email the right office straight from the footer.
  - **success:** Offices column lists Plano, Texas, USA first: "7950 Legacy Drive, Suite 400, Plano, Texas 75024, USA", `tel:+14693229899`, "WhatsApp +1 469 439 9345" to `https://wa.me/14694399345` in a new tab with an accessible name ending "(opens in a new tab)", and `mailto:vinni.tran@newxion.com`; then Ho Chi Minh City, Vietnam labelled "Vietnam Delivery Center", "Floor 15, B1 Building, 279 Nguyen Tri Phuong Street, Dien Hong Ward, Ho Chi Minh City, Vietnam", `tel:+84908107552`. No "Head office" label, no Da Nang office, no second HCMC address (FR-7).
- **CAP-3**
  - **intent:** Visitors see the bottom bar with the legal link and the brand tag.
  - **success:** Bottom bar shows the copyright, a "Privacy policy" link to `/privacy` and the GET IT DONE tag with DONE in amber (FR-7, UX-DR25).
- **CAP-4**
  - **intent:** The footer reads well from wide desktop down to phones.
  - **success:** Footer matches the prototype look (ink surface, white logo plate, amber-tint Lexend Exa headings, UX-DR25) and uses 2 columns at 900px and 1 column at 640px.

## Constraints

- Story 1.1 tokens must be merged first.
- The footer component is `src/components/layout/site-footer.tsx`, the one Sammy file in that folder; Andy mounts it in `src/app/layout.tsx` in Story 1.3 at the latest, so it shows on every page (T3).
- Office data is defined once so Story 2.2 (Book a demo) and Story 6.4 (About) render the same blocks from it.
- Links point at their final paths even when the target page or anchor is built by a later story; the exception is `#updates`, hidden on Demo day (T5).
- Definition of Done (CLAUDE.md): unit tests with 100% changed-line and 80% branch coverage, an `@smoke` Playwright test, lint, typecheck, format check, build, local Sonar gate (LOCAL ONLY) and bmad-code-review must pass.
- Next.js 16 App Router; Server Components by default, `"use client"` only for state, effects or browser APIs; read `node_modules/next/dist/docs/` before using a Next.js API.
- Use the Tailwind v4 tokens from Story 1.1 (`@theme` in `src/app/globals.css`); no new hard-coded colours, sizes or breakpoints.
- Port the prototype markup, copy and look; do not redesign. The UX spines win over the prototype on any conflict.
- Routes have no `/en` or `/vi` prefix (locale routing, Story 1.2, is after demo); Demo day is English only, but every string is kept in a form that can be translated later (no copy baked into logic).
- Every visible fact is real or starts with `[Placeholder]` (NFR-7).
- Sammy owns `src/app/page.tsx`, `src/app/services/*`, `src/app/about/*`, `src/components/home/*` and `src/components/layout/site-footer.tsx`; do not edit Andy's other files (`src/app/layout.tsx`, `@theme` in `globals.css`, the rest of `src/components/layout/*`, `src/lib/sanity/*`, `src/app/api/*`, and the products, news, careers, privacy, not-found and demo pages).

## Non-goals

- Office blocks on About (Story 6.4) and Book a demo (Story 2.2).
- VI copy and locale-aware links (Story 1.2, after demo).
- Real privacy policy text (Story 2.1 and the launch gate, Story 7.5).
- Toast component from UX-DR25 (not in this story's ACs).
- Site header (Story 1.3).
- Mounting the footer in `src/app/layout.tsx` (Andy, T3).
- The "Product updates" footer link on Demo day (Story 4.5 adds it back with `#updates`, T5).

## Success signal

- On https://xiontech-dev.vercel.app any page shows the footer; the Plano phone is a `tel:` link, WhatsApp opens a new tab, Privacy policy opens `/privacy`, no footer link points at `#updates`, and at 640px the columns stack into one.

## Assumptions

- Footer uses the same logo asset as the header (Story 1.3) until the SVG master is supplied (PRD open question 13).
- Copyright reads "© 2026 XionTechs" as in the prototype.
