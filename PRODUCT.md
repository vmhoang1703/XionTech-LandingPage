# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two front doors, same weight (lead, 2026-10-10):

- **School buyers** (principal, head of IT): understand what each app does for their school, read it in Vietnamese, book a demo.
- **Company buyers** (CTO, product lead): judge whether the team can deliver, see the process and the overlapping time zones, start a project with one email.

Also served: parents checking that their school's app is real, and job seekers reading roles and applying with a CV.

## Product Purpose

Marketing site for XionTech, rebuilt for the XionTech internal AI build challenge. It shows the school platforms (Parent Hub, Staff Hub, IoT Device Management, AI Tutor) and the software outsourcing services on the first screen. Success for the current stage: impress the judges on Demo day, 2026-10-16, with motion, 3D and polish, without breaking any rule below. Full requirements: `_bmad-output/planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md`.

## Positioning

The same engineering team that builds and runs real school products also builds software for companies. The products are the proof behind the services.

## Capabilities and Constraints

- Next.js 16 App Router, React 19, Tailwind CSS v4 (`src/app/globals.css` `@theme`), Sanity CMS for news and careers, Vercel.
- Every page in English and Vietnamese. New text needs both.
- Lighthouse mobile performance at least 90; LCP at most 2.5s, INP at most 200ms, CLS at most 0.1. If motion or 3D pushes a score below target, the motion is reduced, not the target (PRD SM-6, SM-8, SM-C3).

## Brand Commitments

- Write "XionTech" in copy, titles and alt text. The domain `xiontechs.com` and the logo stay as they are.
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
