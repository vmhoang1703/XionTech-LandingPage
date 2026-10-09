---
title: 'E-S5 The 404 page is a lost trail'
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

**Problem:** The 404 page still says "We couldn't find that page." with a "404" label and the shared
hero art. The prototype (`prototype/404.html`; ENH-043, ENH-052; planned spec
`_bmad-output/specs/sammy/spec-enh-s5-not-found/SPEC.md`) turns it into a lost trail that matches the
footer mountain.

**Approach:** Port `404.html`:
- No "404" label. H1 "You’ve wandered off the trail." with the curly apostrophe, no highlight and no
  underline. Lede "The page you were looking for isn’t here. Follow the trail back home, or pick a path
  below." Buttons: primary "Go to Home" → `/`, then glass Products, Services, News.
- Beside the copy (one column at 860px and below): the trail map as an inline SVG (paths, "You are
  here" and "Home" labels from `404.html`), decorative (`aria-hidden`), with the X image
  (`x-mark.webp`, `alt=""`) at "Home". It replaces `HeroArt` on this page only.
- The dotted trail walks and the "here" ring pulses; both stop under reduced motion
  (`site.css:1265-1288`).
- The page still answers HTTP 404, is not indexed, and its title is "Page not found | XionTech".

</frozen-after-approval>

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| Copy | Load `/does-not-exist` at 1280px | — | No "404" label; H1 "You’ve wandered off the trail." without highlight; prototype lede | Static | ENH-043, ENH-052 | |
| Buttons | Activate | Mouse, keyboard, touch | "Go to Home" → `/`; Products, Services, News go to their pages; focus rings visible | Instant | `404.html` | |
| Trail map | Load at 1280px / 860px | — | Map beside the copy / below it, max 420px; "You are here" and "Home" labels legible; X at "Home" | Static | ENH-043 | |
| Trail motion | Load | — | Dotted trail walks, ring pulses | Continuous | `site.css:1271-1275` | |
| Reduced motion | Load with reduced motion | — | Trail and ring do not move | Static | `site.css:1288` | |
| Status and title | Request an unknown path | — | HTTP 404; tab title "Page not found \| XionTech"; not indexed | — | Story 1.7 | |
| Width | Load at 390px | — | No sideways scroll; labels still legible | Static | `site.css:1277` | |

## Implementation Notes

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: clean
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines; changed files ≥ 80% branches
- `npm run test:smoke` -- expected: all pass
- `npm run build` -- expected: success
- `npx playwright test --project=a11y` -- expected: all pass
