---
id: SPEC-ENH-S2-services
owner: Sammy
build_day: 2026-10-08
depends_on: ["E-A1", "E-S1"]
companions:
  - ../../enhancement-2026-10-07/README.md
  - ../../decisions-2026-10-01.md
  - ../../../prototype-enhancement/prototype/services.html
  - ../../../prototype-enhancement/prototype/css/site.css
  - ../../../prototype-enhancement/prototype/js/site.js
sources:
  - ../../../prototype-enhancement/enhancement-log.md
---

# E-S2 Services matches the prototype

Covers: ENH-048, ENH-055 (Services part), ENH-061, ENH-065, ENH-069, ENH-070 (Services part),
ENH-071 (Services part), ENH-072 (Services part), ENH-086 (Services hero part), ENH-087 (process part).

## Why

Services should read as one calm page: what we do, what you can achieve, and how we work. The
prototype dropped the clocks, stats and email band and added an outcomes section.

## Target section order

| # | Prototype (`services.html`) | Replaces on `develop` |
| --- | --- | --- |
| 1 | Rounded navy hero panel | Full-width navy hero with clocks |
| 2 | Eight services panel (light blue, 28px gap below the hero) | Stats band and the card grid |
| 3 | `#outcomes` "What can we help you achieve?" | — (new) |
| 4 | `#process` 4-D on a light surface | `#process` on navy |
| — | No email band | `CaptureBand kind="project"` (removed) |

## Capabilities (Tier 1)

- **CAP-1 Hero panel.**
  - A rounded, inset navy panel (radius 28px) with amber and white glows, and no `HeroArt` aurora.
  - One button, "Start a project". Keep the current target, `/demo#project`, which opens the project
    tab (the prototype links to `demo.html#form`).
  - Remove the "See our 4-D process" button, the clock strip and the stats band, with their content in
    `services.ts`.
- **CAP-2 Eight services panel.**
  - A light blue rounded panel (`#DCE6F5` to `#E8EEF8`, with glows).
  - The heading and description stay in view on the left (sticky, top 120px) while the cards scroll on
    the right, two per row.
  - At 980px and below, the heading stacks above the cards. At 640px and below, the cards show one per
    row.
- **CAP-3 Service cards.**
  - White cards: the icon and title in one row, a dashed divider, the description, and the tags at the
    bottom.
  - All eight look the same, with no amber or navy variants.
  - Keep each card's `id`: the footer, the header, `/services#<id>` links and the anchor rule in
    `globals.css` use them.
  - `serviceIcons` still has a `variant` field. Remove the field only if nothing else reads it.
- **CAP-4 Outcomes (new).**
  - H2 "What can we help you achieve?"
  - Four numbered cards, 01 "Build a new digital product" to 04 "Apply AI where it creates value".
    Copy the text from `services.html`.
  - Two columns, one on phones.
- **CAP-5 Process.**
  - No label. H2 "Our 4-D process: from your request to launch."
  - A white or light surface (`.d4`: navy text, white step cards).
  - The step copy comes from E-S1 CAP-5.
  - The 4-D reveal stays as built in Story 5.4.
- **CAP-6 Page background.** Light blue around the panels, turning white at the end, with soft glows. A
  static gradient is enough.
- **CAP-7 Page title.** "Software Outsourcing Vietnam | Product Engineering, AI, Low-code & Cloud | XionTech".

## Constraints

- `ProcessFlow`, `process.ts` and `services.ts` are shared with Home and belong to E-S1. Build this
  task after E-S1 merges and make any change to them there.
- Keep `#process` and the eight card ids. Update `e2e/services*.spec.ts`, the footer and nav tests and
  `src/app/services/page.test.tsx` in this task.
- `globals.css`: own block `/* E-S2 Services */`; do not edit `@theme`.
- Definition of Done from `CLAUDE.md`.

## Non-goals for this build (Tier 2, after the demo)

- **Motion** (ENH-070, ENH-073). Service cards rise with a tilt and lift on hover with an icon pop.
  Outcome cards slide in from alternate sides. With reduced motion they only fade.
- **Track dot.** An amber dot moves along the process track after the fill (deferred in Story 5.4).

## Open questions

None of its own.

## Success signal

On the preview, the services heading stays in view while the cards scroll, and the footer's service
links still land on their cards.

## Request to paste

```
/bmad-build _bmad-output/specs/sammy/spec-enh-s2-services — E-S2 Services matches the prototype. Branch feature/enh-s2-services from an up-to-date develop after E-A1 and E-S1 merge. UI task: UX checks table before coding. Port services.html; keep #process and the eight card ids. One-shot if your step 2 agrees (page sections only).
```
