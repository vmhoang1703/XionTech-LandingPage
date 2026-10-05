# Story 5.1 — observed

Surface: `/services`, reached by opening the URL on a production build (`npm run build`, `next start -p 3005`). The dev server returned 500 for every page in this run (Google font loading in `src/app/layout.tsx`: "next/font/google queries have exactly one entry"), so the walk ran on the production server, as the smoke test does.

Steps and what was seen are in `walk-output.txt` (written by `walk.mjs`, Playwright Chrome; the 30 s refresh uses Playwright's clock set to 2026-10-05T03:15:45Z):

- Navy gradient hero with the aurora and strand ribbon; crumbs "Home / Services" in JetBrains Mono, Home → `/`.
- H1 "Software teams that get IT done." in white Unbounded; the highlight on "get IT done" draws in (`hl-draw`).
- Lede in on-navy muted (rgb 197,208,227), 20px below the H1 (`mt-5`, after the step-4 review patch; it was 18px).
- "Start a project" (amber, arrow) → `/demo#project`; "See our 4-D process" (glass) → `/services#process`, page stays at the top (scrollY 0; no target until 5.4). Hover lifts 2px; Tab gives a 2px amber ring on each.
- Clock strip, group "Office local times": "Ho Chi Minh City 10:15 | Plano 22:15", then after 30 s "10:16 | 22:16". Pills have a 1px border and full radius, a clock icon, mono times, and no nested pill around the time.
- JavaScript off: "Ho Chi Minh City GMT+7 | Plano US Central".
- Reduced motion: aurora and highlight not animated; clocks still update (10:16 / 22:16 after 30 s).
- 899px and 390px: CTAs and pills wrap onto rows; no sideways scroll. The header shows the Menu button at 390px.

Screenshots: `services-1280.png` (after the 30 s refresh), `services-899.png`, `services-390.png` (highlight caught mid draw-in), `services-no-js-1280.png`.
