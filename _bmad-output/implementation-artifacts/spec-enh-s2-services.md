---
title: 'E-S2 Services matches the prototype'
type: 'feature'
created: '2026-10-09'
status: 'in-progress'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/docs/ux-checks.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `/services` is still the older page: a full-width navy hero with clocks and two buttons, a
stats band, a card grid with amber and navy variants, a navy process band and an email band. The
prototype (`_bmad-output/prototype-enhancement/prototype/services.html`; ENH-048, 055, 061, 065, 069,
070, 071, 072, 086, 087; planned spec `_bmad-output/specs/sammy/spec-enh-s2-services/SPEC.md`) reads as
one calm page: a rounded navy hero panel, a light blue Eight services panel with a sticky heading
beside two columns of plain cards, "What can we help you achieve?", and the 4-D process on light.

**Approach:** Port the prototype, keeping the content that is already confirmed:
- Hero panel: rounded inset navy panel (radius 28px, glows from `site.css:1480-1483`), no `HeroArt`,
  no breadcrumb, H1 "Software teams that **get IT done**." with the prototype lede, one button "Start a
  project" to `/demo#project`. Remove the clocks, the second button and the stats band.
- Eight services panel 28px below the hero: light blue rounded panel (`site.css:1485`, `1583`); heading
  "Eight services, one team." and its lede sticky on the left (top 120px), cards two per row on the
  right; at 980px and below the heading stacks above; at 640px and below one card per row.
- Cards: white, icon and title in one row, dashed divider, description, tags at the bottom; all eight
  alike (remove `variant`); keep every card `id` and the existing names, descriptions and tags.
- New `#outcomes` "What can we help you achieve?" with the four numbered cards, copy verbatim from
  `services.html`; two columns, one at 760px and below.
- `#process`: no label, H2 "Our 4-D process: from your request to launch.", same lede and flow, on a
  light surface with white step cards.
- No email band. Page background: light blue around the panels turning white at the end (static
  gradient from the stops in `site.js:441-449`).
- Title "Software Outsourcing Vietnam | Product Engineering, AI, Low-code & Cloud | XionTech".
- Motion and the process track dot stay out (Tier 2).

</frozen-after-approval>

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| Hero panel | Load at 1280px | — | Rounded navy panel inset from the page edges, amber and white glows, no aurora, no breadcrumb | Static | ENH-069, `site.css:1480-1483` | |
| Hero copy | Load | — | H1 "Software teams that get IT done." with the amber highlight; prototype lede; one "Start a project" button | Static | ENH-069, ENH-086 | |
| Start a project | Activate | Mouse, keyboard | Goes to `/demo#project` with the project tab open | Instant | planned spec CAP-1 | |
| Removed parts | Load | — | No clocks, no "See our 4-D process", no stats band, no email band | Static | ENH-055, ENH-069 | |
| Services panel | Load at 1280px | — | Light blue rounded panel 28px below the hero | Static | ENH-072, `site.css:1583` | |
| Sticky heading | Scroll through the cards | Mouse wheel, touch | "Eight services, one team." and its lede stay in view on the left while the cards scroll | Continuous | ENH-061 | |
| Panel layout | Load at 980px / 640px / 390px | — | Heading above the cards from 980px down; one card per row from 640px down; no sideways scroll | Static | `site.css:1445-1446` | |
| Service cards | Load | — | Eight white cards alike: icon and title in one row, dashed divider, description, tags at the bottom | Static | ENH-061, `site.css:1438-1444` | |
| Card anchors | Open `/services#cloud` | — | The Cloud card heading lands fully visible under the header | After smooth scroll | Story 5.2, anchor rule | |
| Outcomes | Load at 1280px / 390px | — | "What can we help you achieve?" with cards 01–04 in two columns / one column | Static | ENH-048, `site.css:1126-1131` | |
| Process | Load | — | No label; H2 "Our 4-D process: from your request to launch."; light surface with white step cards | Static | ENH-087, `site.css:1621` | |
| Process anchor | Open `/services#process` | — | The process heading lands fully visible | After smooth scroll | Story 5.4 | |
| 4-D reveal | Scroll the process into view | — | Steps reveal as built in Story 5.4 | Once | Story 5.4 | |
| Background | Scroll the page | — | Light blue around the panels, turning white at the end, no hard edges | Static | ENH-065, `site.js:441-449` | |
| Page title | Load | — | "Software Outsourcing Vietnam \| Product Engineering, AI, Low-code & Cloud \| XionTech" | Static | planned spec CAP-7 | |

## Implementation Notes

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: clean
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines; changed files ≥ 80% branches
- `npm run test:smoke` -- expected: all pass
- `npm run build` -- expected: success
- `npx playwright test --project=a11y` -- expected: all pass
