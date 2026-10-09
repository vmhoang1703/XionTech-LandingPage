---
title: 'E-S2 Services matches the prototype'
type: 'feature'
created: '2026-10-09'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
baseline_commit: 'c9dd287ee92f2c3dadce98043ecfe6ae2333e18f'
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
| Hero panel | Load at 1280px | — | Rounded navy panel inset from the page edges, amber and white glows, no aurora, no breadcrumb | Static | ENH-069, `site.css:1480-1483` |  ✅ walk (radius 28px, inset 26px, glows, no aurora or crumbs) |
| Hero copy | Load | — | H1 "Software teams that get IT done." with the amber highlight; prototype lede; one "Start a project" button | Static | ENH-069, ENH-086 |  ✅ walk; `services/page.test.tsx` |
| Start a project | Activate | Mouse, keyboard | Goes to `/demo#project` with the project tab open | Instant | planned spec CAP-1 |  ✅ walk (lands on the project tab); `services/page.test.tsx` |
| Removed parts | Load | — | No clocks, no "See our 4-D process", no stats band, no email band | Static | ENH-055, ENH-069 |  ✅ walk; `services/page.test.tsx`, `e2e/services.spec.ts` |
| Services panel | Load at 1280px | — | Light blue rounded panel 28px below the hero | Static | ENH-072, `site.css:1583` |  ✅ walk (28px gap) |
| Sticky heading | Scroll through the cards | Mouse wheel, touch | "Eight services, one team." and its lede stay in view on the left while the cards scroll | Continuous | ENH-061 |  ✅ walk (sticky at 120px while card 6 scrolls); `a11y.spec.ts` services layout |
| Panel layout | Load at 980px / 640px / 390px | — | Heading above the cards from 980px down; one card per row from 640px down; no sideways scroll | Static | `site.css:1445-1446` |  ✅ walk (980 / 640 / 390, no sideways scroll); `a11y.spec.ts` services layout |
| Service cards | Load | — | Eight white cards alike: icon and title in one row, dashed divider, description, tags at the bottom | Static | ENH-061, `site.css:1438-1444` |  ✅ walk (8 alike, dashed divider); `services/page.test.tsx` |
| Card anchors | Open `/services#cloud` | — | The Cloud card heading lands fully visible under the header | After smooth scroll | Story 5.2, anchor rule |  ✅ walk (heading 118px under the 72px header); `a11y.spec.ts` services layout |
| Outcomes | Load at 1280px / 390px | — | "What can we help you achieve?" with cards 01–04 in two columns / one column | Static | ENH-048, `site.css:1126-1131` |  ✅ walk (2 / 1 columns); `services/page.test.tsx`, `a11y.spec.ts` (`#outcomes` anchor) |
| Process | Load | — | No label; H2 "Our 4-D process: from your request to launch."; light surface with white step cards | Static | ENH-087, `site.css:1621` |  ✅ walk (no label, white step cards); `services/page.test.tsx` |
| Process anchor | Open `/services#process` | — | The process heading lands fully visible | After smooth scroll | Story 5.4 |  ✅ walk (heading 152px under the header) |
| 4-D reveal | Scroll the process into view | — | Steps reveal as built in Story 5.4 | Once | Story 5.4 |  ✅ walk (data-phase on); `process-flow.test.tsx` |
| Background | Scroll the page | — | Light blue around the panels, turning white at the end, no hard edges | Static | ENH-065, `site.js:441-449` |  ✅ walk, `services-1280-full.png` |
| Page title | Load | — | "Software Outsourcing Vietnam \| Product Engineering, AI, Low-code & Cloud \| XionTech" | Static | planned spec CAP-7 |  ✅ `services/page.test.tsx`, `e2e/services.spec.ts` |

## Implementation Notes

- Built by one implementer subagent (one-shot route), then reviewed. RED: `npx vitest run src/app/services src/content/service-icons.test.ts` 13 failed | 3 passed; GREEN: 16 passed.
- `src/app/services/page.tsx` rewritten: `.svc-hero` navy panel, `.svc-panel` with `.svc-split` (sticky `.svc-stick`, `.svc-cards` of `article.svc-card`), `#outcomes`, `#process.sec.d4`, all inside one `.svc-flow` gradient. No HeroArt, breadcrumb, clocks, stats, second button or capture band.
- `src/content/services.ts`: new title and lede, `servicesOutcomes` (typed, stable ids); unused crumbs, clocks, stats and label removed. `service-icons.ts` loses `variant`.
- `globals.css`: E-S2 block with token colours and `top: calc(var(--spacing-header-height) + 48px)`; removed Services-only `.svc-grid`, `.svc*`, `.clock-strip` and the dead `.surface-navy .step4` rules; anchor rule now `.svc-card[id], #process, #outcomes, #values, #faq`.
- Tests: services page and smoke rewritten; new `@a11y` "services layout" browser test (sticky below the header, 980 stacked, 640 one column, `#cloud` and `#outcomes` land fully visible).
- Review: full five layers (security clean, acceptance compliant), then two fix rounds (123 and 57 lines, each reviewed again) and a 16-line follow-up with one edge-case layer.
- Evidence: `spec-enh-s2-services-evidence/` (verification.txt: lint, 1234 unit tests, diff coverage 100%, 15 smoke, build, 39 a11y; walk.mjs, walk-output.txt, screenshots).


## Review Triage Log

| # | Finding | Verdict | Evidence / route |
| --- | --- | --- | --- |
| 1 | `#outcomes` missing from the anchor scroll-margin list | medium | Heading would land under the header; patched |
| 2 | Hex colours duplicate tokens; `.d4` re-declares root values | low | Direct correction; patched |
| 3 | Sticky `top: 120px` magic number | low | Now derived from the header height; patched |
| 4 | Dead `.surface-navy .step4` rules after the process went light | low | Orphans of this change (CLAUDE.md); deleted |
| 5 | 980px regex matched an older block; no 640px check | low | Tied to Services selectors, 640 added; patched |
| 6 | No browser check of sticky, breakpoints, anchors | medium | New `@a11y` "services layout" test; patched |
| 7 | Outcomes list semantics (`list-style: none`, numbers read twice) | low | `role="list"`, `aria-hidden` on numbers, tests; patched |
| 8 | `servicesOutcomes` untyped, keyed by title | low | `as const`, stable ids; patched |
| 9 | Smoke "removed" checks relied on encoded text | low | Structural markers and full title; patched |
| 10 | Home test `.svc-grid` vacuous | low | Now `.svc-cards`; patched |
| 11 | Anchor e2e settled before the smooth scroll / no upper bound | medium | Waits for scroll, three equal readings, top and bottom bounds, fresh load per anchor; patched |
| 12 | Sticky e2e did not compare with the header | low | Now `stick.top >= header.bottom`; patched |
| 13 | Skip comment overclaimed "only" | low | Reworded; patched |
| 14 | Highlight bar removed on the hero without the spec saying so | false | Prototype hides `.hl::after` on night-phase sections (`site.css` `.flow-js [data-flow-phase="night"] .hl::after`) |
| 15 | Page has no call to action at the end | false | `services.html` ends at `#process`; the frozen intent removes the email band |
| 16 | Remaining literal gradient stops | low | Prototype literals; no token exists for them; rejected |
| 17 | Short viewports: sticky lede taller than the screen | low | Same as the prototype; rejected |
| 18 | CaptureBand `project` kind now unused in production | low | Andy's component; kind kept for reuse; deferred note in the PR |
| 19 | Layout e2e runs only in the opt-in `a11y` project | low | Project-wide choice (Story 7.3); deferred |
| 20 | Same-document vs cold-load deep link; scroll stall | low | Walk covers cold-load deep links; rejected |
| 21 | Title long; ENH-073 Built in the branch | false | Title is the frozen intent; ENH-073 commit predates the baseline and was agreed |
| 22 | Security (three passes) | — | Clean |

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: clean
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines; changed files ≥ 80% branches
- `npm run test:smoke` -- expected: all pass
- `npm run build` -- expected: success
- `npx playwright test --project=a11y` -- expected: all pass
