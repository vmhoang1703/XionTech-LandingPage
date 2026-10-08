---
id: SPEC-ENH-S5-not-found
owner: Sammy
build_day: 2026-10-08
depends_on: ["E-A1"]
companions:
  - ../../enhancement-2026-10-07/README.md
  - ../../decisions-2026-10-01.md
  - ../../../prototype-enhancement/prototype/404.html
  - ../../../prototype-enhancement/prototype/css/site.css
sources:
  - ../../../prototype-enhancement/enhancement-log.md
---

# E-S5 The 404 page is a lost trail

Covers: ENH-043 (404 part), ENH-052 (404 part).

## Why

A lost visitor should smile and find the way home. The prototype turns 404 into a trail map that
matches the footer mountain. Story 1.7 (the 404 page) was Sammy's before the 2026-10-03 re-plan
(decision P1) moved it to Andy; this follow-up comes back to him.

## Capabilities (Tier 1)

- **CAP-1 Copy.**
  - Remove the "404" label.
  - H1 "You’ve wandered off the trail." with the curly apostrophe (’) as in `404.html`, with no
    highlight and no underline. React would escape a straight `'` as `&#x27;` in the server HTML.
  - Lede "The page you were looking for isn't here. Follow the trail back home, or pick a path below."
  - Buttons: the primary Home button to `/`, then Products, Services and News as glass buttons. Take
    the Home button's label from `404.html`.
- **CAP-2 Trail map.**
  - An inline SVG trail from "You are here" to "Home", with the X image (`x-mark.webp`, `alt=""`) at
    "Home".
  - The map is decorative (`aria-hidden`). Its "You are here" and "Home" labels stay legible on screen.
  - It replaces `HeroArt` on this page only.
- **CAP-3 Keep the rest.** The page still returns HTTP 404, and its title is "Page not found | XionTech".

## Constraints

- Files: `src/app/not-found.tsx`, `src/content/not-found.ts`, `globals.css` block `/* E-S5 404 */`.
- `HeroArt` is used by other pages; do not change it.
- The `@smoke` test `e2e/not-found.spec.ts:11` expects "that page". Change it in this task to assert
  the new H1, with the curly apostrophe.
- Definition of Done from `CLAUDE.md`.

## Open questions

None.

## Success signal

On the preview, `/does-not-exist` returns 404, shows the trail map, and the Home button goes to `/`.

## Request to paste

```
/bmad-build _bmad-output/specs/sammy/spec-enh-s5-not-found — E-S5 404 lost-trail page. Branch feature/enh-s5-not-found from an up-to-date develop after E-A1 merges. Simple page-section task; one-shot if your step 2 agrees. UX checks table before coding. Update the @smoke assertion in e2e/not-found.spec.ts.
```
