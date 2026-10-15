# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two front doors, same weight (lead, 2026-10-10):

- **School buyers** (principal, head of IT): understand what each app does for their school, read it in their language, get in touch.
- **Company buyers** (CTO, product lead): judge whether the team can deliver, see the process and the overlapping time zones, get in touch through one form.

Also served: parents checking that their school's app is real, and job seekers reading roles and applying with a CV.

## Product Purpose

Marketing site for XionTech, rebuilt for the XionTech internal AI build challenge. It shows the school platforms (Parent Hub, Staff Hub, AI Tutor) and the software outsourcing services on the first screen. Success for the current stage: impress the judges on Demo day, 2026-10-16, with motion, 3D and polish, without breaking any rule below. Full requirements: `_bmad-output/planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md`.

## Positioning

XionTech is an AI-driven product and engineering company that builds for any industry; copy does not list industries. The same team builds and runs real school products, and those products are the proof behind the services. The Home headline stays "Build smarter. Ship faster. Get IT done."

## Capabilities and Constraints

- Next.js 16 App Router, React 19, Tailwind CSS v4 (`src/app/globals.css` `@theme`), Sanity CMS for news and careers, Vercel.
- Every page in two locales: en and vi. New text needs its Vietnamese twin, then `npm run i18n:review`.
- Lighthouse mobile performance at least 90; LCP at most 2.5s, INP at most 200ms, CLS at most 0.1. If motion or 3D pushes a score below target, the motion is reduced, not the target (PRD SM-6, SM-8, SM-C3).

## Brand Commitments

- Write "XionTech" in copy, titles and alt text, never "XionTechs". The domain `xiontechs.com`, its email addresses and the logo stay as they are.
- Four locations: two delivery centers, Plano, Texas (vinni.tran@newxion.com) and Ho Chi Minh City (vinni.tran@xiontechs.com), and two offices, Ha Noi and Da Nang (named only, one line in the footer).
- One contact path: every primary button links to the Home get-in-touch form (`/{locale}#contact`) with a label that fits its page; the header shows "Let's talk". There is no Demo page (`/demo` redirects to `/#contact`).
- Careers, top to bottom: hero "Careers at XionTech" (no buttons), Principles we value, Meet the team at XionTech, open roles. Team photos: any image files dropped in `public/careers/life/` (any filename), shown sorted by filename; rebuild and redeploy after adding them.
- Section titles have no trailing full stop. US spelling.
- Visual and behaviour rules for the shipped site: `DESIGN.md` and `EXPERIENCE.md`, section "Shipped Site".
- Amber's prototype (`_bmad-output/prototype-enhancement/prototype/`) and `DESIGN.md` (`_bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md`) set brand, colours and fonts. Enhancements build on them; they do not replace them.

## Evidence on Hand

- Real: products and their app names (`src/content/apps.ts`), services, offices, news posts with photos in Sanity.
- Absent, never to be invented: testimonials, client logos, stats, team members, job openings. Unconfirmed text starts with `[Placeholder]`.

## Product Principles

1. Real products first; they make the services believable.
2. Both buyers find their door in five seconds.
3. Motion serves meaning and never costs speed or access.
4. Honest content beats impressive content.

## Accessibility & Inclusion

WCAG 2.2 AA on every page in both languages (PRD NFR-1). Motion is controllable (NFR-2): under `prefers-reduced-motion: reduce` nothing moves, state changes keep short opacity fades (150 to 250ms), and the Home background has a visible motion toggle. Touch targets at least 44 x 44px.
