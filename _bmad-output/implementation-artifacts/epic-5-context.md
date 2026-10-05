# Epic 5 Context: Services and 4-D process

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Build the `/services` page so companies looking for a delivery partner can judge the XionTech team, check working-hour overlap with the Ho Chi Minh City and Plano offices, read the eight services and the 4-D process, and start a project from the same page. It carries Flow 2 (Quân, a logistics CTO: Home services door, then Services, then "See our 4-D process", then the amber project capture, then `/demo#project` with his email prefilled). Sammy owns the Demo-day stories; Demo day is English only.

## Stories

- Story 5.1: Services hero with live office clocks
- Story 5.2: Stats and eight services with anchors
- Story 5.3: Three ways to work with us and industries (after demo)
- Story 5.4: 4-D process at #process and project capture

## Requirements & Constraints

- Navy hero with breadcrumbs, H1 "Software teams that get IT done.", one primary "Start a project" to `/demo#project` and a glass "See our 4-D process" to `#process`. Until 5.4 lands, `#process` has no target and the link opens Services at the top.
- Clock strip: server HTML shows the zone labels "Ho Chi Minh City GMT+7" and "Plano US Central" before JavaScript; with JavaScript, live times from IANA zones `Asia/Ho_Chi_Minh` and `America/Chicago` (so daylight saving is right), refreshed every 30 seconds. The clock logic is one shared module that About office cards (Story 6.4) reuse; prove the refresh and both zones with fake-timer unit tests.
- Stats on Services reuse the shared stats band with the same five figures (25+, 24/7, 20+, 8, 2) and the light-surface suffix colour (amber-text `#8A6700`, never `#C99700`). Demo day shows static final figures; count-up is after demo.
- "Eight services, one team.": each service shows description and tags and is the anchor target, not a link. Anchors: `#product-engineering`, `#ai-analytics`, `#co-creation`, `#staffing`, `#custom-apps`, `#low-code`, `#ai-solutions`, `#cloud`.
- Every in-page target (the eight services, `#process`) lands with its heading fully visible below the sticky header via `scroll-margin-top` from the 88px anchor-offset token (AC-NAV-5); verify with Playwright or a scripted check.
- 4-D process on a navy band at `id="process"`; "See our 4-D process" (hero) and "See the process" (Services mega menu, `/services#process`) land correctly; above 1080px the "You receive" rows align across the four cards (AC-UI-2).
- Amber project capture "Tell us what you're building." (project mode): a valid work email opens `/demo#project` on the Outsourcing project tab, scrolled to the form, email prefilled (AC-FORM-2). The email never goes in the URL.
- Page colour rhythm: navy hero, navy 4-D band, exactly one amber band (the capture).
- After demo (5.3): "Three ways to work with us" (Dedicated team, End-to-end delivery, Co-creation, each naming its service) and static industry chips (EdTech as primary, Healthcare, Logistics, Private Equity) plus a USA, Europe and Australia time-zone note.
- Content is real or starts with `[Placeholder]`; no invented stats or claims. Keep copy in a translatable form; `/services` has no locale prefix before demo.
- WCAG 2.2 AA: one H1, visible focus (amber ring on navy surfaces, navy elsewhere), targets at least 24 x 24px, no interactive element inside a link.

## Technical Decisions

- Next.js 16 App Router, Server Components by default; the live clock is the only client part this epic adds. Read `node_modules/next/dist/docs/` before using a Next.js API.
- Tailwind v4 tokens from Story 1.1; port `mockups/site-v3/services.html`, `css/site.css` and the `clocks()` logic in `js/site.js`; do not redesign.
- Ownership: Sammy owns `src/app/services/page.tsx` and its sections; Andy owns `src/app/layout.tsx`, `globals.css` `@theme` (including the anchor offset tokens) and `src/components/layout/*`.
- Story 5.4 only places finished components: capture validation, sending states, session-storage prefill and the redirect belong to Story 2.4; the 4-D animation belongs to Story 3.6.
- Breadcrumbs use the simple prototype markup until Story 1.6 makes them a shared component. The inner-hero motion part of 1.6 (shared aurora and strand ribbon for `hero-navy`) already exists and can be reused by the Services hero.

## UX & Interaction Patterns

- Section order and surfaces: `hero-navy`; stats (paper); 8 services (mist, linen); ways to work (paper, after demo); 4-D process (navy); industries (mist, after demo); capture (amber).
- Clock strip: pills with each office city and its local time in JetBrains Mono; zone label shows before the time loads or without JavaScript.
- Service card on `/services`: 48px icon tile, title, one line of copy, optional mono tags row; it is the anchor target. On Home the same services link here.
- 4-D process: at 30% visible the track fills amber over 2.4s and steps enter at 0.3s, 0.85s, 1.4s and 1.95s; the travelling dot is after demo. Below 1080px the track and end nodes hide and steps go 2 columns; 1 column at 640px.
- Responsive: services 4 columns above 1080px, 2 at 1080px and below, 1 at 640px; stats 5/3/2 columns; capture row stacks at 640px; 16px gutters at 640px.
- Reduced motion: no animation or transition; full 4-D track and steps show at once; stats show final numbers; smooth scroll off.

## Cross-Story Dependencies

- 5.1 creates `/services` and needs 1.1; 5.2 needs 3.3 (stats band) and 5.1; 5.4 needs 3.6 (4-D component), 2.4 (capture band, Andy) and 5.1.
- 5.4 gives the hero's "See our 4-D process" and the mega menu's "See the process" their `#process` target.
- The shared clock module from 5.1 is reused by About office cards in Story 6.4.
- Home service cards (Story 3.5) and the footer Services column link to the 5.2 anchors.
