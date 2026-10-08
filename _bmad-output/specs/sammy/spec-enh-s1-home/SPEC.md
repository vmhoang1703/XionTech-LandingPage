---
id: SPEC-ENH-S1-home
owner: Sammy
build_day: 2026-10-08
depends_on: ["E-A1"]
soft_depends_on: ["E-A2", "E-A4"]
companions:
  - ../../enhancement-2026-10-07/README.md
  - ../../decisions-2026-10-01.md
  - ../../../prototype-enhancement/prototype/index.html
  - ../../../prototype-enhancement/prototype/css/site.css
  - ../../../prototype-enhancement/prototype/js/site.js
sources:
  - ../../../prototype-enhancement/enhancement-log.md
---

# E-S1 Home matches the prototype

Covers: ENH-002 (hero part), ENH-004 (Capabilities), ENH-070, ENH-071, ENH-072, ENH-073 (Home part),
ENH-086 (Home part), ENH-087 (Home part), ENH-088. Tier 2: ENH-003, ENH-006.

## Why

A visitor landing on Home should see in one screen what XionTech does (school apps and software
teams), see both offerings, and reach a person. `develop` still shows the older product-led Home.

## Target section order

| # | Prototype (`index.html`) |
| --- | --- |
| 1 | Hero: copy, Get in touch, five figures, two cards across the hero's lower edge |
| 2 | Capabilities: four-card bento and the "Get IT Done" line |
| 3 | Our core values: six values |
| 4 | How we approach (the 4-D process) |
| 5 | Work built with our partners (Tier 2) |
| 6 | Latest from XionTech (Andy, E-A6) |
| 7 | Contact form `#contact` (Andy, E-A4) |

`develop` today: `HomeHero` (label, mockups, five figures), `FrontDoors`, `ProductBento`,
`ServiceCards`, `HomeProcess` (navy), `HomeNews`, `CaptureBand kind="demo"`.

## Capabilities (Tier 1)

- **CAP-1 Hero.**
  - H1 "School apps and software teams that **get IT done**.", with the highlight on the phrase.
  - The sub line names Parent Hub, Staff Hub and IoT and the two cities. Copy it from `index.html`,
    writing "XionTech" for "XionTechs".
  - No label above the heading and no device mockups: the copy runs full width over the silk (Home's
    animated hero background).
  - One button, "Get in touch", to `#contact`. Until E-A4 merges, link it to `/demo`.
  - The five figures keep their values under the heading "Experience you can count on". From 561px to
    900px they sit three in the first row and two in the second; at 560px and below, two per row
    (`site.css:1579-1580`).
  - Files: `src/content/home.ts`, `src/components/home/home-hero.tsx`; remove `.home-devices` from
    `globals.css`.
- **CAP-2 Two cards across the hero edge.**
  - The front doors sit inside the hero, so the navy stops at the middle of the cards.
  - Light card "Products for schools":
    - text "Connected apps for parents, students, teachers, leaders and school staff.";
    - badges P-Hub, S-Hub and an IoT chip icon;
    - chips Parent Hub, Staff Hub, IoT and AI Tutor.
  - Dark card "Your software delivery team":
    - kicker "Outsourcing services";
    - text "Dedicated teams and end-to-end delivery for companies building digital products.";
    - chips Product Engineering, AI-Driven Analytics, Staffing, Low-code, Cloud and "+3 more".
  - Each card is one link: the light card goes to `/products`, the dark card to `/services`.
  - Names come from `src/content/apps.ts` (E-A2), or are written as plain strings until it merges.
  - Files: `front-doors.tsx`, `home.ts`, `globals.css`.
- **CAP-3 Capabilities (new section).**
  - "Capabilities." with its lede, and four cards:
    - School platforms: the apps, linking to Products;
    - Global delivery: live Plano and Ho Chi Minh City clocks, reusing `LiveClock` and `offices.ts`;
    - Domain expertise: Education, plus a "+3" button that reveals Healthcare, Logistics and Private
      Equity;
    - Software engineering: links to Services.
  - Then the line "Get IT Done / Built with ownership."
  - The three industries are confirmed facts (About FAQ, `src/content/about.ts:126`), so they are not
    marked `[Placeholder]`.
  - The "+3" control is a real `<button>` with `aria-expanded` and the only new client part (`LiveClock`
    is already one).
  - The list renders in the HTML and is hidden only after hydration, so it is readable without
    JavaScript.
- **CAP-4 Our core values on Home.**
  - "Our core values." / "What guides how we work.", then the six values with "Get IT Done" featured,
    as built on About in Story 6.4. Reuse the `.values` CSS.
  - Move `aboutValues` from `src/content/about.ts` to `src/content/values.ts`.
  - Repoint the import in `src/app/about/page.tsx`, so About still builds until E-S3 removes its section.
- **CAP-5 How we approach (4-D).**
  - H2 "How we approach." with the short 4-D lede, and no label.
  - "See how we work" (to `/services#process`) on the heading row.
  - Light background, not navy.
  - Home uses the long step copy, the same as Services:
    - the Development step reads "Agile sprints with regular demos. Testing and quality assurance (QA)
      run inside every sprint, not at the end.";
    - its receive line reads "Tested, working software every sprint.".
  - Files: `home-process.tsx`, `process.ts`, `services.ts`. Services shows the same copy; E-S2 gives it
    the light surface.
- **CAP-6 Remove** `ProductBento` and `ServiceCards`, with their content and tests.
  - `src/content/service-icons.ts` gets its `ServiceId` type from `homeServices`. Move that type to
    `services.ts` before deleting `homeServices`.
  - Services uses these icons, so check that it still type-checks and renders.
- **CAP-7 Background.**
  - One background with no visible edges between sections. Copy the colour stops from the prototype's
    Home branch of the flow script (`js/site.js:409-418`):
    - `#0B1730` from the top of the hero to `#1A3C70` at the middle of the two cards, then `#F4F6FA` at
      once (the navy stops there, CAP-2);
    - `#F7F9FD` behind Capabilities, Values and How we approach;
    - `#F4F7FC` behind the news;
    - `#FDF3D6`, `#FCE6A8` and `#FFD84A` into the contact form;
    - one soft amber glow over the hero.
  - A static CSS gradient on a wrapper is enough.
- **CAP-8 Page title.** "XionTech | School Platforms & Software Outsourcing in Vietnam".

## Constraints

- Sammy owns the order in `src/app/page.tsx` and the Home sections. E-A4 adds the contact section and
  E-A6 changes `home-news.tsx`. Keep their lines when you rebase.
- Server Components. Client parts only for the "+3" toggle and the existing clocks.
- `globals.css`: own block `/* E-S1 Home */`; do not edit `@theme` (E-A1).
- Update, in this task, the tests that pin the old Home wording:
  - `src/app/page.test.tsx`, `process-flow.test.tsx` and `src/app/no-js.test.tsx` (H1, "Explore our
    products", band order);
  - `e2e/home*.spec.ts`.
- The `@smoke` check in `e2e/smoke.spec.ts:11` expects "See it working at your school." on `/`. E-A4
  removes that band, so whichever of E-S1 and E-A4 merges second changes the assertion to a plain-text
  part of the new H1 (the highlight is a separate `<span>`, so the full sentence is not one string).
  Keep one `@smoke` check on `/`.
- Definition of Done from `CLAUDE.md`. Sonar runs daily on `develop`, not per push.

## Non-goals for this build (Tier 2, after the demo)

- **Work built with our partners.** A full-width slider of six partner cards with dots and arrow keys
  (ENH-003, ENH-006). Every card stays `[Placeholder]`, and "View case study" is a disabled label
  (decision A6).
- **Count-up** of 25, 20 and 8 from 0 (ENH-002). This touches `StatsBand`, which About and Services
  also use.
- **Get in touch without a hash.** Scrolling to the form without leaving `#contact` in the URL
  (ENH-086), while About's link still lands on `/#contact`.

## Open questions

- Q1 (names): default rename. Q8 (Get in touch target): default `/#contact`. See the plan README.

## Success signal

On the preview, the hero says what XionTech does, Get in touch reaches the contact form, and the
"+3" button reveals the three industries by keyboard.

## Request to paste

```
/bmad-build _bmad-output/specs/sammy/spec-enh-s1-home — E-S1 Home matches the prototype (ENH-086 to ENH-088). Branch feature/enh-s1-home from an up-to-date develop after E-A1 merges. UI task: write the UX checks table (docs/ux-checks.md) before coding. Port index.html; do not redesign. The contact section and news row belong to Andy (E-A4, E-A6). Until E-A2 and E-A4 merge, use plain-string names and link Get in touch to /demo.
```
