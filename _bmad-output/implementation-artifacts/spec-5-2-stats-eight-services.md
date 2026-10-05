---
title: 'Story 5.2: Stats and eight services with anchors'
type: 'feature'
created: '2026-10-05'
status: 'in-progress'
baseline_commit: '959b8a68afca2828c7a6ae430ff6ba2a62ed182f'
route: 'dispatch'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `/services` stops after the 5.1 hero. Quân follows a service link from Home, the footer or the Services mega menu (`/services#low-code` and the other seven) and finds no target, and no key facts. Contract: `_bmad-output/specs/sammy/spec-5-2-stats-eight-services/SPEC.md` (CAP-1 to CAP-3).

**Approach:** Two Server Component sections after the hero, ported from the prototype `services.html`:
- **Key facts:** a paper section that reuses `StatsBand` (3.3) with `homeStats.stats` and `tone="light"`.
- **"Eight services, one team.":** a mist/linen section with the existing `.svc-grid` / `.spot .svc` cards as `<article id=…>`, not links. Each card has a description and optional mono tags.
- **Copy and icons:**
  - The eight services' Services copy goes in `src/content/services.ts`.
  - The icon and variant map moves out of the Home `ServiceCards` into one shared module, so Home and Services cannot drift.
- **Anchor offset:** one CSS rule gives every service card `scroll-margin-top` so the 88px anchor offset (`--spacing-anchor-offset`) holds below the sticky header. `html` already pads by the header height.

## Boundaries & Constraints

**Always:**
- Server Components only; no new client code.
- The figures are the five confirmed ones (25+, 24/7, 20+, 8, 2), and the light suffix colour is `text-amber-text`.
- Card ids are exactly `product-engineering`, `ai-analytics`, `co-creation`, `staffing`, `custom-apps`, `low-code`, `ai-solutions` and `cloud`, in that order. They match `homeServices`, `SERVICES` in `nav-data.ts` and the footer links.
- Copy lives in `src/content/*`, in English, using "XionTech".
- Tokens come from Story 1.1, and new CSS goes in a Services section of `globals.css` `@layer components`.

**Never:**
- The stats count-up, which is after demo.
- Story 5.3 (ways to work, industries) and Story 5.4 (`#process`, capture).
- Cards as links, or hover effects on cards.
- Editing `@theme`, `layout.tsx` or `src/components/layout/*`.
- Changing what Home renders.

**Decision (Son Nguyen, 2026-10-05): Services stats follow the prototype.**
- `StatsBand` gets an optional `hideLabel` prop.
- When set, the `<h2>` label stays in the DOM as `sr-only`, so the band is still named "Key facts", and the list drops its top border and top gap.
- Home (no prop) is unchanged.
- **Spec length:** kept whole at about 2,400 tokens, since the UX checks table is required.

</frozen-after-approval>

## Code Map

- `src/components/sections/stats-band.tsx` -- shared band. Props: `label`, `stats`, `tone` (`"light"` gives the amber-text suffix). It renders `<h2 className="label">`, then a `<ul>` with `mt-4.5 border-t pt-6.5` and 2/3/5 columns. Tests in `stats-band.test.tsx`.
- `src/content/home.ts` --
  - `homeStats.stats` holds the five confirmed figures; reuse it, don't copy.
  - `homeServices.cards` holds the ids and names, with Home's short lines.
- `src/components/home/service-cards.tsx` -- a private `CARD` map (`ServiceId` to icon and `feature`/`navy` variant) to move into a shared module. Its tests must stay green; Home output is unchanged.
- `src/app/services/page.tsx` -- 5.1 hero as a single `<section>`; wrap it in a fragment and append the two sections.
- `src/content/services.ts` -- 5.1 copy; add a stats aria label and the services section (title, lede, eight items: id, name, description, optional tags).
- `src/app/globals.css` --
  - These exist: `.sec`, `.surface-paper`, `.surface-mist`, `.linen`, `.sec-head`, `.lede`, `.svc-grid` (1/2/4 columns), `.spot`, `.svc`, `.svc .ic`, `.svc.feature` and `.svc.navy`.
  - These are missing: `.svc .tags` (prototype `site.css` line 235) and the anchor rule. Follow `.products-anchor` (around line 2668): `calc(var(--spacing-anchor-offset) - var(--spacing-header-height))`.
- Prototype `mockups/site-v3/services.html` lines 35–62: copy, tags and variants. Its section has an inline `padding-top:40px`, which becomes the `pt-10` utility.
- `src/test-utils/css-classes.ts` -- `undefinedClasses` for the CSS contract test.
- `e2e/services.spec.ts` -- extend the `@smoke` request check: the eight ids in the HTML.

## Tasks & Acceptance

**Execution:**
- [x] `src/content/service-icons.ts` (new), `src/components/home/service-cards.tsx` -- move `CARD` (icon and variant per service id) into the shared module; Home imports it -- one icon map for both pages
  - red: `src/content/service-icons.test.ts` -- all eight ids map to an icon; `product-engineering` and `cloud` are `feature`, `ai-solutions` is `navy`
- [x] `src/components/sections/stats-band.tsx` -- optional `hideLabel`: label `<h2>` gets `sr-only`; the list drops `mt-4.5 border-t pt-6.5`; default output unchanged -- Services stats match the prototype
  - red: `src/components/sections/stats-band.test.tsx` -- with `hideLabel` the h2 still names the group but has `sr-only`, and the list has no `border-t`; without it the classes are unchanged
- [x] `src/content/services.ts` -- stats aria label "Key facts"; services section title, lede and the eight items with the prototype descriptions and tags -- copy out of components
- [x] `src/app/services/page.tsx` -- after the hero:
  - **Stats:** `<section class="sec surface-paper" aria-label=…>` with `StatsBand` (`homeStats.stats`, `tone="light"`, `hideLabel`, label "Key facts").
  - **Services:**
    - `<section class="sec surface-mist linen pt-10" aria-labelledby=…>`, with `.sec-head` holding the h2 and `.lede`.
    - `.svc-grid` of `<article id class="spot svc …">`, each with the icon tile, h3, p and optional `.tags`.
  - **Why:** CAP-1 and CAP-2.
  - red: `src/app/services/page.test.tsx` --
    - five figures with amber-text suffixes;
    - the h2 "Eight services, one team.";
    - eight articles with the exact ids in order, each with an h3 and a description, and tags where the prototype has them;
    - no link inside any card;
    - the CSS contract passes.
- [x] `src/app/globals.css` -- `.svc .tags` (mono, 0.7rem, muted, `margin-top:auto`); `.svc[id]` `scroll-margin-top` from the anchor-offset token -- missing rules, CAP-3
  - red: `src/app/services/page.test.tsx` -- `.svc[id]` has a `scroll-margin-top` that uses `--spacing-anchor-offset`
- [x] `e2e/services.spec.ts` -- `@smoke`: the eight `id="…"` and "Eight services, one team." in the `/services` HTML -- anchors exist without JavaScript

**Acceptance Criteria:**
- Given `/services`, when it loads, then a paper band shows 25+, 24/7, 20+, 8 and 2 with their captions, and the suffixes are amber-text (CAP-1).
- Given `/services`, when it loads, then "Eight services, one team." shows eight non-link cards, each with an id, an icon, a heading and a description, and tags where the prototype has them (CAP-2).
- Given `/services#<id>` for each of the eight ids at 1280px and 390px, when the page lands, then the card's h3 sits fully below the 72px sticky header, with the card's top at about 88px (CAP-3).

## UX checks

Sources: SPEC CAP-1 to CAP-3, `EXPERIENCE.md` (Stats band line 134; Responsive lines 282–285; Reduced motion line 238), `DESIGN.md` (Stats band line 488; Services surfaces line 440; grids line 429), prototype `services.html` 35–62 and `site.css`.

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Stats band | page loads | — | paper surface right under the navy hero; 25+, 24/7, 20+, 8, 2, each with its caption | static (count-up after demo) | CAP-1, DESIGN.md Stats band || ✅ walk: figures, paper after hero; page.test five figures |
| Stats suffix | page loads | — | "+" and "/7" in amber-text (#8A6700), never #C99700 | — | CAP-1, DESIGN.md Stats band || ✅ walk: rgb(138, 103, 0); page.test amber-text |
| Stats band | width | — | 5 columns above 1080px, 3 at 1080px and below, 2 at 640px and below; 1px column dividers | — | EXPERIENCE.md Responsive || ✅ walk: 5 / 3 / 2 columns, 1px dividers |
| Stats label | page loads | — | no visible eyebrow label and no top rule; screen readers name the band "Key facts" | — | prototype services.html 35; decision 2026-10-05 || ✅ walk: h2 1×1, border 0px, group "Key facts"; stats-band.test |
| Services section | page loads | — | mist surface with linen texture; h2 "Eight services, one team." and the lede | — | DESIGN.md Services surfaces, prototype || ✅ walk: mist gradient, linen, h2 and lede; page.test h2 |
| Service grid | width | — | 4 columns above 1080px, 2 at 1080px and below, 1 at 640px and below | — | EXPERIENCE.md Responsive || ✅ walk: 4 / 2 / 1 columns |
| Service card | page loads | — | 48px icon tile, title, one line of copy, mono tags where given; Product Engineering and Cloud amber-tinted, AI-Powered Solutions navy | — | EXPERIENCE.md Service card, prototype || ✅ walk: 48px tiles, variants, mono tags on 5 cards; page.test |
| Service card | hover or click | mouse, touch, pen | nothing happens; not a link, no pointer cursor | — | CAP-2 || ✅ walk: cursor auto, URL unchanged; page.test no links |
| Service card | Tab through the section | keyboard | no focus stop on any card | — | CAP-2 || ✅ walk: Tab goes hero CTA → footer, 0 focusables in grid |
| Service anchors | open `/services#<id>` for each of the 8 | link | the card's heading fully visible below the sticky header; card top at about 88px | on load | CAP-3, AC-NAV-5 || ✅ walk: 1280px all cards at 88, h3 172–173 |
| Service anchors | Home card, footer link or mega-menu link to a service | mouse | lands on that card on `/services`, heading visible | on load | CAP-3 || ✅ walk: Home card and footer link land at 88 |
| Service anchors | same at 390px | touch | heading fully visible below the header | on load | CAP-3 || ✅ walk: every h3 visible; cards at 88–131 (see observed.md) |
| Whole page | reduced motion | — | stats show final numbers; no card motion | — | EXPERIENCE.md Reduced motion || ✅ walk: final figures, animation none |
| Whole page | width 390px | — | no sideways scroll | — | EXPERIENCE.md Responsive || ✅ walk: no sideways scroll |

## Implementation Notes

## Spec Change Log

## Review Triage Log

## Verification

**Commands:**
- `npm test` -- expected: all pass, including the new icon, page and stats tests; Home service-cards tests unchanged and green
- `npm run lint && npm run typecheck && npm run format:check` -- expected: clean
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines, branches ≥ 80%
- `npm run test:smoke` -- expected: build passes; `/services` 200 with the eight ids

**Manual checks (if no CLI):**
- Chrome walk on a production build (`npm run build && npx next start -p 3005`; the dev server returns 500 on this machine):
  - each of the eight anchors at 1280px and 390px, measuring the h3 top against the header bottom;
  - the stats and services at 1280, 899 and 390px;
  - reduced motion.
- Screenshots go in the evidence folder.

## Acceptance Evidence

Captured at the end of step-03 on 2026-10-05.

**Commands**

- `npm test` -- exit 0 -- Test Files 70 passed (70), Tests 1073 passed (1073)
- `npm run lint && npm run typecheck && npm run format:check` -- exit 0 -- All matched files use Prettier code style!
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- Total: 7 lines, Missing: 0 lines, Coverage: 100%; branches on changed files 100% (page.tsx 2/2, stats-band.tsx 10/10)
- `npm run test:smoke` -- exit 0 -- 14 passed (11.8s)

**Observed**

- At 1280px, all eight `/services#<id>` links land with the card top at 88 and the h3 at 172–173, below the 72px header. At 390px every h3 is fully visible, with cards at 88–131. -- walk on `next start -p 3005`
- Stats show 5/3/2 columns, services 4/2/1. The suffixes are #8A6700, the label is sr-only, the grid has no focusable elements, and no width scrolls sideways. -- same walk

**Artifacts**

- [observed.md](spec-5-2-stats-eight-services-evidence/observed.md) -- 2092 bytes -- sha256 0c03620b3ce5 -- the full observations
- [walk-output.txt](spec-5-2-stats-eight-services-evidence/walk-output.txt) -- 2589 bytes -- sha256 de37ae94b99a -- raw walk output
- [verification.txt](spec-5-2-stats-eight-services-evidence/verification.txt) -- 5804 bytes -- sha256 70a3e71579eb -- the four commands' output
- [services-5-2-1280.png](spec-5-2-stats-eight-services-evidence/services-5-2-1280.png) -- 344133 bytes -- sha256 ffe343619703 -- stats band and section head at 1280px
- [services-5-2-899.png](spec-5-2-stats-eight-services-evidence/services-5-2-899.png) -- 303851 bytes -- sha256 05afec209216 -- 899px
- [services-5-2-390.png](spec-5-2-stats-eight-services-evidence/services-5-2-390.png) -- 155349 bytes -- sha256 b7be09323f4b -- 390px
- [anchor-low-code-1280.png](spec-5-2-stats-eight-services-evidence/anchor-low-code-1280.png) -- 231132 bytes -- sha256 693908322b96 -- `#low-code` landing at 1280px
- [anchor-low-code-390.png](spec-5-2-stats-eight-services-evidence/anchor-low-code-390.png) -- 121391 bytes -- sha256 125056680203 -- `#low-code` landing at 390px

**Not captured**

- Touch and pen input on a real device. The walk used a mouse and keyboard in Chromium; the cards have no handlers or links, so they cannot react to touch either.
