---
id: SPEC-ENH-A5-products
owner: Andy
build_day: 2026-10-08
depends_on: ["E-A1", "E-A2"]
soft_depends_on: ["E-A4"]
companions:
  - ../../enhancement-2026-10-07/README.md
  - ../../decisions-2026-10-01.md
  - ../../../prototype-enhancement/prototype/products.html
  - ../../../prototype-enhancement/prototype/css/site.css
  - ../../../prototype-enhancement/prototype/js/site.js
sources:
  - ../../../prototype-enhancement/enhancement-log.md
---

# E-A5 Products as four showcase cards

Covers: ENH-014, ENH-018, ENH-038 (Products title), ENH-087 (Products part), ENH-089, and the Products
showcase card shown in the prototype's design-system page (ENH-090). Tier 2: ENH-015, ENH-022, ENH-023,
ENH-024, ENH-050 (timeline flags part), ENH-051 (timeline part).

## Why

The prototype shows the four apps side by side, each with one click to its details, instead of four
long sections.

## Target section order

| # | Prototype (`products.html`) | Replaces on `develop` |
| --- | --- | --- |
| 1 | Hero "Built apart. Better together." with the four-app diagram | Amber hero with frames |
| 2 | "What we build." four showcase cards and their detail views | Sub-nav and four app sections |
| 3 | A day at school (Tier 2) | — |
| 4 | Product updates (Tier 2) | — |
| 5 | Navy "See it working at your school." band | — |

## Capabilities (Tier 1)

- **CAP-1 Hero.**
  - H1 "Built apart. Better together." with the lede from `products.html`, and no button or
    breadcrumb.
  - Four linked app cards (Parent Hub, AI Tutor, Staff Hub, IoT) around the X tile, joined by lines.
  - Slow drifting glows, with a "Pause motion" button.
  - The pause setting is shared with the Home silk (Home's animated hero background). Store it in
    `localStorage` under one key, inside try/catch. With nothing saved, follow
    `prefers-reduced-motion` (`js/site.js:640`). `hero-silk.tsx` reads the same key.
- **CAP-2 Showcase cards.**
  - "What we build." with its lede, then two columns of white cards.
  - Each card:
    - the badge and full name;
    - the tagline as H3 at the top left;
    - a 44px square expand button at the top right, named "Open {name} details", with
      `aria-haspopup="dialog"`;
    - the screenshot slot centred: a phone for Parent Hub, a browser for the others.
  - Names, badges and taglines come from `apps.ts` (E-A2).
  - The card ids stay `pxp`, `sxp`, `iot` and `ai-tutor`, as in the prototype, so old links keep
    landing. Cards use `--spacing-anchor-offset`; remove the sub-nav's `.products-anchor` offset.
- **CAP-3 Detail view.**
  - A native `<dialog>` per app, with the name, tagline, "Made for …", the larger screenshot and the
    "Features" list.
  - Buttons:
    - Parent Hub: the store buttons;
    - Staff Hub and IoT: a disabled "View prototype" label;
    - AI Tutor: "View prototype".

    Every stand-in address is a disabled label marked `[Placeholder]` (decision A6). The AI Tutor
    address is a stand-in until Q11 says it can be published.
  - It closes with X, Esc, or a click outside the dialog's box; padding doesn't count as outside.
    Focus returns to the expand button.
  - Feature titles are copied from `products.html`. **Every feature description is `[Placeholder]`**
    (ENH-089), unless it matches the copy confirmed on 2026-09-28 word for word (decision A7).
  - Without JavaScript, the features are still on the page: render them in the HTML as well, for
    example in a `<details>` fallback.
- **CAP-4 Remove** the sub-nav, `pxp-section`, `pxp-story-phone` and `products-web-apps`, with their
  tests.
- **CAP-5 Last band.** A navy `CaptureBand` with "See it working at your school.", in E-A4's plain
  look (or the current look until E-A4 merges).
- **CAP-6 Page title.** "School Apps: Parent Hub, Staff Hub, IoT & AI Tutor | XionTech".

## Constraints

- Update `e2e/products.spec.ts` and `e2e/a11y.spec.ts` in this task.
- Test the dialog by keyboard: open it, check that Tab stays inside, close it with Esc, and check that
  focus returns.
- Decision L1 (media first in the markup) no longer applies to the cards; say so in the PR.
- Definition of Done from `CLAUDE.md`.

## Non-goals for this build (Tier 2, after the demo; decision Q14)

- **A day at school** (ENH-015, ENH-023, ENH-050, ENH-051).
  - Five navy steps from 07:45 to 15:30 that name the apps.
  - It plays once at 1.8 s per step and resets above the section.
  - It follows Pause motion and supports reduced motion.
- **Product updates** (ENH-024, ENH-042). "Product updates." with "See all news" on the heading row,
  and three story cards that have an app, read from Sanity. Decision T5 hid `#updates` for the demo;
  this brings it back.
- **Page-long background flow** (ENH-022).

## Open questions

- Q1 (names): default "rename".
- Q11 (AI Tutor address): default "stand-in".
- Q14 (cut): default "the timeline and updates are Tier 2".

## Success signal

On the preview, a reviewer opens a showcase card by keyboard, Tab stays in the dialog, Esc closes it,
focus returns to the card, and `/products#pxp` lands on Parent Hub.

## Request to paste

```
/bmad-build _bmad-output/specs/andy/spec-enh-a5-products — E-A5 Products hero diagram, four showcase cards (ids pxp/sxp/iot/ai-tutor) with a <dialog> detail view, [Placeholder] feature descriptions, navy band (A day at school and updates are Tier 2). Branch feature/enh-a5-products from an up-to-date develop after E-A1 and E-A2 merge. UI task: UX checks table before coding.
```
