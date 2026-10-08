---
id: SPEC-ENH-S3-about
owner: Sammy
build_day: 2026-10-08
depends_on: ["E-A1", "E-S1", "E-S4"]
soft_depends_on: ["E-A2", "E-A4"]
companions:
  - ../../enhancement-2026-10-07/README.md
  - ../../decisions-2026-10-01.md
  - ../../../prototype-enhancement/prototype/about.html
  - ../../../prototype-enhancement/prototype/css/site.css
  - ../../../prototype-enhancement/prototype/js/site.js
sources:
  - ../../../prototype-enhancement/enhancement-log.md
---

# E-S3 About matches the prototype

Covers: ENH-016, ENH-030, ENH-031, ENH-046, ENH-049 (About part), ENH-050 (About part), ENH-054
(offices part), ENH-055 (About offices part), ENH-056 (mountain part), ENH-057 (mountain glow part),
ENH-058 (About office cards part), ENH-059, ENH-067 (About part), ENH-087 (values move). Tier 2:
ENH-032, ENH-051 (drawings part), ENH-052 (drawings part).

## Why

About now tells the company story through an intro and the mountain, then answers questions and shows
the offices, all on white. The values moved to Home.

## Target section order

| # | Prototype (`about.html`) | Replaces on `develop` |
| --- | --- | --- |
| 1 | `#mission` intro over pastel peaks | Navy hero with breadcrumb |
| 2 | `#story` the mountain | Stats band and "Two strengths, one team." (removed) |
| — | — | `#values` (moves to Home in E-S1) |
| 3 | `#faq` in two columns | One-column FAQ |
| 4 | `#offices` white cards | Navy offices |
| 5 | `#book` white email band | Amber band |

## Capabilities (Tier 1)

- **CAP-1 Intro.**
  - Centred H1 "We're XionTech, technology built with **ownership**.", with "ownership" in amber text
    and no underline.
  - Then the paragraph about the mission and where XionTech comes from, and the links "Explore our
    products" and "Explore our services".
  - Inline SVG pastel peaks.
  - No breadcrumb and no stats.
- **CAP-2 Mountain story (static version).**
  - H2 "Inspired by a mountain. United by **purpose**."
  - Chapter 01, "The inspiration", and chapter 02, "The purpose". The second closes on "Our inspiration
    is a mountain. Our purpose is people." and "Vision · Community · Technology".
  - The picture shows the X mark (`x-mark.webp`) at the summit and the tag "newXion / Founded in
    America", but only if Q5 clears the images; otherwise the chapters ship without the picture.
  - Copy the assets into `public/`, compressed.
  - The founding sentence ("a group of pioneers established newXion in America") ships marked
    `[Placeholder]` unless Q12 confirms it.
- **CAP-3 Remove** the stats band, "Two strengths, one team." and `#values`.
  - The values now live in `src/content/values.ts` (E-S1).
  - Remove `#values` from the anchor rule in `globals.css`.
  - The footer's "Core values" link goes in E-S4.
- **CAP-4 FAQ.**
  - Heading "Your question, we answer". Keep native `<details>`.
  - Two columns of hairline rows, 96px apart, with + / − at the right.
  - One column at 760px and below.
  - All rows closed by default, on white.
  - The last slot holds "Still have a question? Ask us directly →" (44px target), linking to
    `/#contact`, or to `/demo` until E-A4 merges.
  - Copy changes:
    - FAQ question 1 names Parent Hub, Staff Hub and IoT Device Management;
    - FAQ question 3 reads "How can our school try Parent Hub or Staff Hub?";
    - FAQ question 5 says "the first of our four steps".
  - The security answer keeps `[Placeholder]` (decision Q9).
- **CAP-5 Offices.**
  - A white section with two cards (max 400px) at opposite edges: Plano first, then Ho Chi Minh City,
    as in `about.html`.
  - Each card shows the local time, the city, the tag ("US Delivery Center" or "Vietnam Delivery
    Center") and icon rows for the address, phone, WhatsApp and email.
  - Office data, icons and the phone format come from `offices.ts` (E-S4). The Vietnam email shows only
    once Q7 confirms it.
- **CAP-6 Email band.**
  - Keep `CaptureBand kind="demo"` with the About copy, on white (E-A4's plain look, or the current
    look until E-A4 merges).
  - The lede names "Parent Hub and Staff Hub".
- **CAP-7 Background.** White with soft light blue radial glows that alternate sides.
- **CAP-8 Page title.** "About XionTech | Get IT Done".

## Constraints

- Update the Story 6.4 tests and `e2e/about.spec.ts` (it checks `id="values"` and the H1) in this task.
  Keep the no-people test and one `@smoke` check on `/about`.
- `globals.css`: own block `/* E-S3 About */`.
- Definition of Done from `CLAUDE.md`.

## Non-goals for this build (Tier 2, after the demo)

- **Held scroll** (ENH-030, ENH-032).
  - The mountain story holds on screen while the two chapters switch at 40% of the scroll.
  - A grey-to-colour climb and a beacon dot.
  - Fallbacks for short screens, reduced motion and no JavaScript.
  - Large-screen sizing.
- **City drawings** (ENH-050 to ENH-052). Inline SVGs in the office cards: Plano balloons and skyline,
  and Ben Thanh Market.

## Open questions

- Q5 (mountain picture licence): default "ship only if confirmed".
- Q7 (Vietnam email): default "hidden until confirmed".
- Q9 (security answer): default "keep `[Placeholder]`".
- Q12 (newXion and the founding sentence): default "keep newXion; mark the sentence `[Placeholder]`".

## Success signal

On the preview, a reviewer opens two FAQ answers in the two-column layout with the keyboard, follows
"Ask us directly" to the contact form, and sees both office cards with live times.

## Request to paste

```
/bmad-build _bmad-output/specs/sammy/spec-enh-s3-about — E-S3 About matches the prototype (static mountain in Tier 1). Branch feature/enh-s3-about from an up-to-date develop after E-A1, E-S1 and E-S4 merge. UI task: UX checks table before coding. Port about.html; write "XionTech" for "XionTechs"; the security FAQ keeps [Placeholder].
```
