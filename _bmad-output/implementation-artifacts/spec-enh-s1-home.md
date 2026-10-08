---
title: 'E-S1 Home matches the prototype'
type: 'feature'
created: '2026-10-08'
status: 'in-progress'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'c8cb49cd8a71bebd2924cfad013d52a8155e0745'
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/docs/ux-checks.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Home on `develop` is the old product-led page (label, device mockups, app bento, eight
service cards, navy four-step process). The approved prototype (ENH-086 to ENH-088,
`_bmad-output/prototype-enhancement/prototype/index.html`) says in one screen what XionTech does, opens
both offerings across the hero edge, then shows Capabilities, core values and the 4-D process.

**Approach:** Port the prototype's Home (planned spec
`_bmad-output/specs/sammy/spec-enh-s1-home/SPEC.md`, CAP-1 to CAP-8): new hero copy and one
"Get in touch" button, the doors inside the hero, a new Capabilities section with a "+3" reveal, core
values moved from About to a shared module, a light "How we approach." 4-D section with the long step
copy shared with Services, and removal of the bento and service cards. Andy's news row and capture band
stay as they are.

## Boundaries & Constraints

**Always:**
- Copy is verbatim from `index.html`, writing "XionTech" for "XionTechs".
- Server Components; the only new client part is the "+3" toggle (`LiveClock`, `HeroSilk` already are).
- Own CSS block `/* E-S1 Home */` in `globals.css`; no `@theme` edits.
- App names as plain strings (E-A2 not merged): P-Hub, S-Hub, Parent Hub, Staff Hub, IoT, AI Tutor.
- "Get in touch" links to `/demo` until E-A4 adds `#contact` (fallback in the planned spec).
- About and Services keep rendering correctly: About still shows its values section (E-S3 removes it);
  Services keeps its process title "From your request to launch, in four steps." (E-S2 changes it).
- Industries Healthcare, Logistics and Private Equity are confirmed (`src/content/about.ts:126`), not
  `[Placeholder]`.

**Never:**
- No edits to `home-news.tsx`, `capture-band.tsx`, `/api/contact` or the header (Andy's).
- No case-study slider, no count-up, no hash-free scroll (Tier 2).
- Do not delete shared CSS (`.sec-head`, `.linen`, `.spot`, `.svc-grid`, `.svc`, `.chip(s)`, `.badge`,
  `.home-media`, `.silk-fallback`) or change `StatsBand`'s grid (About and Services use it).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Reveal by click | "+3" clicked | Healthcare, Logistics, Private Equity visible; `aria-expanded="true"`; click again hides | N/A |
| Reveal by keyboard | Tab to "+3", Enter or Space | Same as click; focus stays on the button | N/A |
| Focus leaves | Open list, Tab away from the card's reveal area | List closes, `aria-expanded="false"` | N/A |
| No JavaScript | Server HTML only | The three industries are in the HTML and readable; the button's name lists them | N/A |
| Narrow screen | 390px | Capabilities one column; figures two per row; doors stacked; no sideways scroll | N/A |

</frozen-after-approval>

## Code Map

- `src/app/page.tsx` -- Home order; add `metadata` (title "XionTech | School Platforms & Software Outsourcing in Vietnam"); keep `<HomeNews/>` then `<CaptureBand kind="demo"/>` last.
- `src/content/home.ts` -- `homeHero` (title, sub, cta, devices go), `homeStats` (used by `about.ts:10,36` and `services.ts:7,45` — keep shape), `homeDoors`, `homeApps` and `homeServices` (delete), `homeProcess` (used by `services.ts:137`).
- `src/components/home/home-hero.tsx` -- hero section; remove the label and `.home-devices` column; render the doors inside the hero; StatsBand stays (`tone="navy"`).
- `src/components/home/front-doors.tsx` -- door markup; becomes the in-hero card pair (light and dark), badges P-Hub, S-Hub, IoT `CpuIcon` with `sr-only` "IoT".
- `src/components/home/hero-silk.tsx` -- client silk + motion toggle; untouched.
- `src/components/home/home-process.tsx` -- navy band with label; becomes light, H2 "How we approach.", 4-D lede, `link-arrow` "See how we work" → `/services#process` on the heading row.
- `src/components/sections/process-flow.tsx`, `src/content/process.ts` -- `processFlow.steps` hold the short lines; move the long lines here (from `services.ts:111-128` `servicesStepCopy`), 03 = "Agile sprints with regular demos. Testing and quality assurance (QA) run inside every sprint, not at the end.", 03 receive "Tested, working software every sprint.", 01 receive "A clear scope, estimate and delivery plan.".
- `src/content/services.ts` -- drop `servicesStepCopy`; `servicesProcess.flow = processFlow`; own title "From your request to launch, in four steps." instead of `homeProcess.title`.
- `src/content/about.ts:65-118` -- `aboutValues` (+ phosphor icon imports 1-9) moves to new `src/content/values.ts`; `src/app/about/page.tsx:17` and `about.test.ts` repoint.
- `src/content/service-icons.ts:12-14` -- `ServiceId` from `homeServices`; derive from `servicesSection.services` instead; `service-icons.test.ts:2,7` and `services.test.ts:2,12,23-28` follow.
- `src/components/home/product-bento.tsx`, `service-cards.tsx` (+ tests) -- delete; CSS `globals.css:1473-1679` (bento) and `:1124-1201`, `~1230-1235` (`.home-devices`) go.
- `src/components/sections/live-clock.tsx`, `src/content/offices.ts` -- `LiveClock {timeZone, zoneLabel}`; `plano` (America/Chicago, "US Central"), `hcmc` (Asia/Ho_Chi_Minh, "GMT+7").
- Prototype CSS to port: hero overrides `site.css:594-614,1582-1589`; doors and stats-5 `1555-1593`; Capabilities `.why2/.w-*` `658-735`; `.sec-head-row` `774-778`; flow stops `js/site.js:409-418`.

## Tasks & Acceptance

**Execution:**
- [x] `src/content/process.ts`, `src/content/services.ts` -- long step copy in `processFlow`; remove `servicesStepCopy`; Services keeps its own title -- one copy for Home and Services
  - red: `src/components/sections/process-flow.test.tsx` -- step 03 reads "Agile sprints with regular demos. Testing and quality assurance (QA) run inside every sprint, not at the end." and receive "Tested, working software every sprint."
- [x] `src/content/values.ts` (new), `src/content/about.ts`, `src/app/about/page.tsx` -- move `aboutValues` unchanged, add Home heading copy ("Our core values." / "What guides how we work.") -- shared by Home now, About until E-S3
- [x] `src/content/home.ts`, `src/components/home/home-hero.tsx`, `src/components/home/front-doors.tsx`, `globals.css` -- CAP-1, CAP-2: new hero copy, "Get in touch" → `/demo`, no label or devices, doors inside the hero with new badges/chips and the dark card kicker; figures 3+2 at 561–900px and 2 per row at ≤560px via a Home-scoped override
  - red: `src/components/home/home-hero.test.tsx` -- H1 "School apps and software teams that get IT done." and a "Get in touch" link to `/demo`; no device frames
- [x] `src/components/home/capabilities.tsx` + `more-industries.tsx` (client) + content in `home.ts` + `globals.css` -- CAP-3: four cards, clocks, "+3" reveal per the I/O matrix, motto
  - red: `src/components/home/capabilities.test.tsx` -- "+3" toggles `aria-expanded` and the three industries are in the markup before any click
- [x] `src/components/home/home-values.tsx`, `src/components/home/home-process.tsx` -- CAP-4, CAP-5: values section (`id="values"` not used on Home; heading ids unique), light "How we approach." with the link on the heading row
  - red: `src/components/home/home-process.test.tsx` -- region named "How we approach." with a "See how we work" link to `/services#process`, not a navy band
- [x] `src/app/page.tsx`, `src/content/service-icons.ts`, deletions, `globals.css` -- CAP-6 to CAP-8: new order, `ServiceId` from `servicesSection`, delete bento and service cards, flowing background wrapper (navy to the doors' middle, `#F4F6FA`, `#F7F9FD`, news and capture keep their own surfaces), page title
  - red: `src/app/page.test.tsx` -- section order hero, Capabilities, core values, How we approach, news, capture band; metadata title
- [x] `src/app/no-js.test.tsx`, `e2e/home-hero.spec.ts`, `e2e/a11y.spec.ts`, `src/content/*.test.ts` -- update assertions to the new copy; keep the `@smoke` checks on `/` -- tests only

**Acceptance Criteria:**
- Given `/`, when the page loads at 1280px, then the hero H1, sub line, "Get in touch" and five figures show on navy and the two cards straddle the hero's lower edge.
- Given `/services`, when it loads, then the process shows the new step 03 copy and the old title, and the page still passes its tests.
- Given `/about`, when it loads, then the six values still render (from `values.ts`).
- Given the repo, when `npm run typecheck` runs, then no import of `homeServices`, `homeApps` or `servicesStepCopy` remains.

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| Hero heading | Load at 1280px | — | H1 "School apps and software teams that get IT done." with "get IT done" amber, no underline, no label above | Static | CAP-1, `index.html`, ENH-086 |  ✅ walk; `home-hero.test.tsx` |
| Hero layout | Load at 1280px | — | No device mockups; copy runs over the silk; one "Get in touch" button | Static | CAP-1 |  ✅ walk; `home-hero.test.tsx` |
| Get in touch | Activate | Mouse, keyboard | Goes to `/demo` (fallback until E-A4) | Instant | CAP-1, plan Q8 |  ✅ walk (-> /demo); `home-hero.test.tsx` |
| Figures | 1280px / 768px / 390px | — | 5 in a row / 3 then 2 / 2 per row, heading "Experience you can count on" | Static | CAP-1, `site.css:1579-1580` |  ✅ walk (5 / 3 / 2 columns); `a11y.spec.ts` reflow |
| Doors | Load at 1280px | — | Two cards side by side across the hero's lower edge; navy ends at their middle | Static | CAP-2, ENH-086 |  ✅ walk, `home-1280-doors-edge.png` |
| Doors | Load at 390px | — | Cards stacked, no sideways scroll | Static | CAP-2, `site.css:1579` |  ✅ walk; `a11y.spec.ts` reflow |
| Products door | Hover or focus | Mouse, keyboard | Whole card is one link to `/products`; focus ring visible | Instant | CAP-2, EXPERIENCE.md "Front door" |  ✅ walk (Tab, 2px ring); `front-doors.test.tsx` |
| Products door content | Load | — | Badges P-Hub, S-Hub, IoT icon; chips Parent Hub, Staff Hub, IoT, AI Tutor | Static | CAP-2 |  ✅ walk; `front-doors.test.tsx` |
| Services door content | Load | — | Kicker "Outsourcing services"; chips Product Engineering, AI-Driven Analytics, Staffing, Low-code, Cloud, +3 more; links to `/services` | Static | CAP-2 |  ✅ walk; `front-doors.test.tsx` |
| Capabilities | Load at 1280px | — | "Capabilities." + lede; four cards in two rows (7+5 columns) | Static | CAP-3, `site.css:658-665` |  ✅ walk (689 + 487px rows); `capabilities.test.tsx` |
| Capabilities | Load at 900px and below | — | One card per row | Static | `site.css:718-729` |  ✅ walk (358px at 390); `a11y.spec.ts` reflow |
| Global delivery | Load with JS | — | Plano and HCMC chips show live times; without JS "US Central" and "GMT+7" | Ticks each minute | CAP-3, Story 5.1 |  ✅ walk (live times; no-JS zone labels); `capabilities.test.tsx` |
| "+3" button | Click, then click again | Mouse, touch, pen | Healthcare, Logistics, Private Equity appear, then hide; `aria-expanded` follows | Instant | CAP-3, `site.js:218-222` |  ✅ walk: touch and pen tap twice hide it; mouse: hides when the pointer leaves (hover reveal, as in the prototype); `capabilities.test.tsx` |
| "+3" button | Enter or Space | Keyboard | Same as click; focus stays on the button | Instant | CAP-3 |  ✅ walk; `capabilities.test.tsx` |
| "+3" button | Focus leaves the reveal area | Keyboard | List closes | Instant | `site.js:218-222` |  ✅ `capabilities.test.tsx` (focus-out) |
| "+3" button | No JavaScript | — | Industries readable in the HTML; button name lists them | Static | CAP-3 |  ✅ walk (JS off); `capabilities.test.tsx`; `e2e/home-hero.spec.ts` |
| Motto | Load | — | "Get IT Done" then "Built with ownership." line | Static | CAP-3 |  ✅ walk; `capabilities.test.tsx` |
| Core values | Load | — | "Our core values." / "What guides how we work."; six values, "Get IT Done" featured | Static | CAP-4 |  ✅ walk; `home-values.test.tsx` |
| How we approach | Load | — | H2 "How we approach.", 4-D lede, light background, no label | Static | CAP-5, ENH-088 |  ✅ walk; `home-process.test.tsx` |
| See how we work | Activate | Mouse, keyboard | On the heading row (under it at 640px and below); goes to `/services#process` | Instant | CAP-5, `site.css:774-778` |  ✅ walk (heading row; below at 390); `home-process.test.tsx` |
| Removed sections | Load | — | No app bento, no eight service cards | Static | CAP-6 |  ✅ walk; `page.test.tsx` |
| Background | Scroll the page | — | No visible edges between hero, Capabilities, values and process | Static | CAP-7 |  ✅ walk (one gradient, transparent sections), screenshots |
| Page title | Load | — | Tab title "XionTech \| School Platforms & Software Outsourcing in Vietnam" | Static | CAP-8 |  ✅ walk; `page.test.tsx` |

## Implementation Notes

## Spec Change Log

## Review Triage Log

## Design Notes

The flowing background is a static gradient: the hero keeps its navy (`#0B1730` to `#1A3C70`) and ends
at the middle of the doors, which straddle it (`margin-bottom: -120px` in the prototype); the sections
after it sit on one light surface (`#F4F6FA` to `#F7F9FD`). Andy's news and capture band keep their own
surface classes in this task.

Process copy moves into `processFlow` once so Home and Services cannot drift:

```ts
// process.ts, step 03
{ num: "03", name: "Development",
  line: "Agile sprints with regular demos. Testing and quality assurance (QA) run inside every sprint, not at the end.",
  receive: "Tested, working software every sprint." }
```

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: clean
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines; changed files ≥ 80% branches
- `npm run test:smoke` -- expected: all `@smoke` pass
- `npm run build` -- expected: success

**Manual checks (if no CLI):**
- Walk `/` at 1280px and 390px on a production build (`npx next start -p 3005`, Chrome channel) and check every UX line; `/about` and `/services` still render.

## Acceptance Evidence

Captured at the end of step-03 on 2026-10-08.

**Commands**

- `npm run lint && npm run typecheck && npm run format:check` -- exit 0 -- All matched files use Prettier code style!
- `npm test` -- exit 0 -- Test Files 75 passed (75), Tests 1145 passed (1145)
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- Coverage: 100%; C1 ok: 33 changed file(s) with branch coverage >= 80%
- `npm run test:smoke` -- exit 0 -- 15 passed
- `npm run build` -- exit 0 -- Generating static pages (15/15)
- `npx playwright test --project=a11y -g "Home at 390px"` (added for the Narrow screen matrix row) -- exit 0 -- 1 passed

**Observed**

- Every UX line on `/` at 1280px, 768px and 390px, with JavaScript off, and by real touch taps -- production build on :3005 in Chrome, [observed.md](spec-enh-s1-home-evidence/observed.md), [walk-output.txt](spec-enh-s1-home-evidence/walk-output.txt)
- `/about` still shows six values; `/services` keeps its process title with the new step 03 copy -- same walk

**Artifacts**

- [verification.txt](spec-enh-s1-home-evidence/verification.txt) -- transcript of the five commands
- [home-1280-doors-edge.png](spec-enh-s1-home-evidence/home-1280-doors-edge.png) -- doors across the hero edge, navy ends at their middle
- [home-1280-industries-open.png](spec-enh-s1-home-evidence/home-1280-industries-open.png) -- "+3" opened by click
- [home-1280-process-head.png](spec-enh-s1-home-evidence/home-1280-process-head.png) -- "How we approach." with the link on the heading row
- [home-390-industries-tapped.png](spec-enh-s1-home-evidence/home-390-industries-tapped.png) -- "+3" opened by a touch tap
- [home-nojs-industries.png](spec-enh-s1-home-evidence/home-nojs-industries.png) -- industries visible without JavaScript
- [home-1280-full.png](spec-enh-s1-home-evidence/home-1280-full.png), [home-390-full.png](spec-enh-s1-home-evidence/home-390-full.png), [home-1280-top.png](spec-enh-s1-home-evidence/home-1280-top.png) -- whole page and hero
- Byte counts and SHA-256 prefixes are in the ledger `spec-enh-s1-home-progress.md`.

**Not captured**

- Andy's parts of Home (news row, capture band, header "Book a demo") were not checked; they are unchanged by this spec.

