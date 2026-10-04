# Epic 4 Context: Products

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

One `/products` page where school buyers and parents explore every XionTech app (PXP for parents, LXP for students, SXP for staff, teachers and leaders, IoT Device Management for campuses) and book a demo. It carries Flow 3 (a parent checking what PXP shows before installing it) and part of the school-buyer flow.

## Stories

- Story 4.1: Products hero and sticky sub-nav
- Story 4.2: PXP story phone
- Story 4.3: LXP, SXP and IoT sections
- Story 4.4: Product media in device frames (after demo)
- Story 4.5: Product updates and demo capture (after demo)

## Requirements & Constraints

- Every section is an anchor (`#pxp`, `#lxp`, `#sxp`, `#iot`, later `#updates`) whose heading lands fully below the header and sticky sub-nav (144px offset token).
- Content is real or starts with `[Placeholder]`; no invented stats, screenshots or testimonials. Brand name in copy is "XionTech".
- App Store, Google Play and the LXP, SXP and IoT web addresses are temporary `[Placeholder]` values kept in one place in the code (decision A1).
- Links that open a new tab carry `target="_blank"`, `rel="noopener noreferrer"` and an accessible name ending "(opens in a new tab)".
- No link to `#updates` on Demo day (decision T5).
- Missing media shows an empty navy-grid media frame with a `[Placeholder]` caption, never a broken image.
- Copy lives in `src/content/products.ts` so it can be translated later; `/products` has no locale prefix before demo.

## Technical Decisions

- Next.js 16 App Router; Server Components by default, client islands only for interaction (the PXP tab switcher).
- Tailwind v4 tokens and component classes in `src/app/globals.css`; port the prototype `prototype-enhancement/prototype/products.html` and `css/site.css`, do not redesign.
- Icons from `@phosphor-icons/react` (`/ssr` entry in Server Components).
- Owner of the Products stories on Demo day: Andy (decision P1).

## UX & Interaction Patterns

- PXP story phone: 260px phone, five stacked screens (Attendance, Grades, Messages, Payments, Events), navy active pill tab; ARIA tab pattern; inactive screens hidden from focus and assistive tech. Crossfade 0.55s after demo; instant on Demo day.
- Browser frame with a mono URL pill for LXP, SXP and IoT; section colours alternate paper, mist (linen), navy, paper.
- Reduced motion: no transitions; smooth scroll off.

## Cross-Story Dependencies

- 4.2 and 4.3 replace the heading-only stub sections that 4.1 left; they keep the `products-anchor` class and section ids.
- 4.4 fills the empty device and browser frames from 4.1 to 4.3; 4.5 adds `#updates` and the Updates sub-nav pill back.
