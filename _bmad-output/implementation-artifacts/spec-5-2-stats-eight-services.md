---
title: 'Story 5.2: Stats and eight services with anchors'
type: 'feature'
created: '2026-10-05'
status: 'done'
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
| Stats band | page loads | — | paper surface right under the navy hero; 25+, 24/7, 20+, 8, 2, each with its caption | static (count-up after demo) | CAP-1, DESIGN.md Stats band | ✅ walk: figures, paper after hero; page.test five figures |
| Stats suffix | page loads | — | "+" and "/7" in amber-text (#8A6700), never #C99700 | — | CAP-1, DESIGN.md Stats band | ✅ walk: rgb(138, 103, 0); page.test amber-text |
| Stats band | width | — | 5 columns above 1080px, 3 at 1080px and below, 2 at 640px and below; 1px column dividers | — | EXPERIENCE.md Responsive | ✅ walk: 5 / 3 / 2 columns, 1px dividers |
| Stats label | page loads | — | no visible eyebrow label and no top rule; screen readers name the band "Key facts" | — | prototype services.html 35; decision 2026-10-05 | ✅ walk: h2 1×1, border 0px, group "Key facts" named once (no section aria-label); stats-band.test, page.test |
| Services section | page loads | — | mist surface with linen texture; h2 "Eight services, one team." and the lede | — | DESIGN.md Services surfaces, prototype | ✅ walk: mist gradient, linen, h2 and lede; page.test h2 |
| Service grid | width | — | 4 columns above 1080px, 2 at 1080px and below, 1 at 640px and below | — | EXPERIENCE.md Responsive | ✅ walk: 4 / 2 / 1 columns |
| Service card | page loads | — | 48px icon tile, title, one line of copy, mono tags where given; Product Engineering and Cloud amber-tinted, AI-Powered Solutions navy | — | EXPERIENCE.md Service card, prototype | ✅ walk: 48px tiles, variants, mono tags on 5 cards; page.test |
| Service card | hover or click | mouse, touch, pen | nothing happens; not a link, no pointer cursor | — | CAP-2 | ✅ walk: cursor auto, URL unchanged; page.test no links |
| Service card | Tab through the section | keyboard | no focus stop on any card | — | CAP-2 | ✅ walk: Tab goes hero CTA → footer, 0 focusables in grid |
| Service anchors | open `/services#<id>` for each of the 8 | link | the card's heading fully visible below the sticky header; card top at about 88px | on load | CAP-3, AC-NAV-5 | ✅ walk: 1280px all cards at 88, h3 172–173 |
| Service anchors | Home card, footer link or mega-menu link to a service | mouse | lands on that card on `/services`, heading visible | on load | CAP-3 | ✅ walk: Home card, footer link and Services mega-menu link land at 88 |
| Service anchors | same at 390px | touch | heading fully visible below the header | on load | CAP-3 | ✅ walk: all 8 cards at 88, h3 172–173 after the smooth scroll settles |
| Whole page | reduced motion | — | stats show final numbers; no card motion | — | EXPERIENCE.md Reduced motion | ✅ walk: final figures; scroll-behavior auto, instant landing at 88; cards have no motion in either mode |
| Whole page | width 390px | — | no sideways scroll | — | EXPERIENCE.md Responsive | ✅ walk: no sideways scroll |

## Implementation Notes

- Review patch: the stats `<section>` drops its `aria-label`. The `StatsBand` group is named "Key facts" by its sr-only h2, and a second identical name made screen readers announce it twice.

## Spec Change Log

## Review Triage Log

Step 4 review, 2026-10-05. Layers: Blind Hunter, Edge Case Hunter, Verification Gap, Acceptance Auditor, and the Security Auditor (clean). The task-review minors from the ledger are included.

- **390px landing 6–43px below 88px** (Acceptance Auditor, Edge Case Hunter, Blind Hunter, Verification Gap) — false as a code defect.
  - The page smooth-scrolls to the card, which takes about 1s at 390px. A probe sampling `#cloud` and `#ai-solutions` at 50 ms to 3000 ms shows the top passing 467, then settling at exactly 88 from 1000 ms on.
  - The walk measured at a fixed 700 ms. Patch the walk to wait until the scroll settles, then re-capture.
- **Walk uses fixed sleeps** (Blind Hunter) — low, patch: same root cause as the 390px landing.
- **Mega-menu row ticked without a mega-menu observation** (Acceptance Auditor, Blind Hunter) — medium, patch: the walk opens the Services mega menu and follows "Low-code Solutions".
- **Reduced-motion card check is vacuous** (Acceptance Auditor) — low, patch: the walk checks what reduced motion actually changes here, an instant anchor jump with smooth scroll off (EXPERIENCE.md Reduced motion). The cards have no motion in either mode.
- **"Key facts" named twice**, by the section `aria-label` and by the group's sr-only h2 (Edge Case Hunter, Blind Hunter, Task 4 minor) — low, patch: drop the section `aria-label`, so the group alone carries the name. This deviates from the Task 4 wording; see Implementation Notes.
- **Tag test skips `ai-analytics` and `ai-solutions`** (Verification Gap, Task 4 minor) — low, patch: add both assertions.
- **Service ids not tied across Services, Home, nav and footer** (Edge Case Hunter, Blind Hunter, Task 1 minor) — medium, patch:
  - Test that the Services ids equal the `homeServices` ids and the `SERVICES` anchors, and that every footer `/services#` link is one of them.
  - The `service-icons` test derives its ids from `homeServices.cards`.
- **`service-icons` test title says "four" for five ids** (Edge Case Hunter, Task 1 minor) — low, patch: fix the title.
- **`.svc[id]` regex has no `}` boundary** (Edge Case Hunter, Verification Gap, Task 5 minor) — low, patch: use `[^}]*`.
- **Smoke `toContain('id=…')` would also pass on a non-card element** (Edge Case Hunter, Verification Gap, Task 6 minors) — low, patch: match `<article id="…"`, and name the anchors in the test title.
- **New CSS sits in Home's service-card block, not the Services section** (Acceptance Auditor) — low, patch: move both rules to the Services section, after `.clock-strip b`.
- **CAP-3 has no automated browser check of the landing position** (Verification Gap) — medium, defer: the smoke project is request-only (no browser). The walk evidence and the CSS test cover it for now.
- **Exact 640px and 1080px column counts** (Edge Case Hunter) — low, rejected: this is the site-wide ≥/≤ breakpoint question still pending with Amber and Hoang. It is not caused by this story; `.svc-grid` and `StatsBand` are reused as built.
- **Empty `tags` array renders an empty span** (Edge Case Hunter) — false: no item has an empty array, and the content is static.
- **`.svc[id]` could hit other `.svc` elements with ids** (Edge Case Hunter) — false: the only other `.svc` elements are Home's links, which carry no id.
- **Copy not verifiable against the prototype** (Acceptance Auditor) — false: the Task 3 reviewer compared every string with `services.html` lines 35–62 verbatim.
- **Spec wording omits `pt-6.5`; the `baseline_commit` differs from the first task's base; status still in-review** (Edge Case Hunter, Blind Hunter) — rejected: fixes to the spec, or the workflow working as designed (the baseline predates the spec commit).
- **Absolute paths in the ledger** (Blind Hunter) — low, rejected: BMad workflow records, not source or config (same ruling as Story 5.1).
- **No AI log entry** (Blind Hunter) — false at the time of reading: written in step 5.
- **Services stats import Home's figures** (Blind Hunter) — false: the spec says reuse, don't copy, so one source of truth is intended.
- **Tags as one joined span; muted 11.2px contrast; no wrap line for long tags** (Blind Hunter) — low, rejected: the prototype's markup, and `--color-muted` on mist is the token `.svc p` already uses. The 390px screenshot shows the low-code tags on one line.
- **The CSS-contract test removes the Tailwind stats group; `"tags" in` relies on the `as const` shape; `verification.txt` has ANSI codes; no Firefox, Safari, 899px anchors or touch** (Blind Hunter, Task 3 minor) — low, rejected: no user-visible harm. The cards have no handlers, so touch cannot differ.

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

Captured again after the step-04 review patches on 2026-10-05.

**Commands**

- `npm test` -- exit 0 -- Test Files 71 passed (71), Tests 1074 passed (1074)
- `npm run lint && npm run typecheck && npm run format:check` -- exit 0 -- All matched files use Prettier code style!
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- Total: 7 lines, Missing: 0 lines, Coverage: 100%; branches on changed files 100% (page.tsx 2/2, stats-band.tsx 10/10)
- `npm run test:smoke` -- exit 0 -- 14 passed (14.1s)

**Observed**

- All eight `/services#<id>` links land with the card top at 88 and the h3 at 172–173, below the 72px header, at 1280px and at 390px once the smooth scroll stops. -- walk on `next start -p 3005`
- Home card, footer and Services mega-menu links land at 88. Under reduced motion the jump is instant (`scroll-behavior: auto`). -- same walk
- Stats show 5/3/2 columns, services 4/2/1. The suffixes are #8A6700; "Key facts" is sr-only and named once; the grid has no focusable elements; no width scrolls sideways. -- same walk

**Artifacts**

- [observed.md](spec-5-2-stats-eight-services-evidence/observed.md) -- 2463 bytes -- sha256 8bae5576b1c2 -- the full observations
- [walk-output.txt](spec-5-2-stats-eight-services-evidence/walk-output.txt) -- 2844 bytes -- sha256 b93d9ca5be3f -- raw walk output
- [verification.txt](spec-5-2-stats-eight-services-evidence/verification.txt) -- 5831 bytes -- sha256 f778f0384d4a -- the four commands' output
- [services-5-2-1280.png](spec-5-2-stats-eight-services-evidence/services-5-2-1280.png) -- 343973 bytes -- sha256 87ad492327f1 -- stats band and section head at 1280px
- [services-5-2-899.png](spec-5-2-stats-eight-services-evidence/services-5-2-899.png) -- 303720 bytes -- sha256 0025ba9fc3f0 -- 899px
- [services-5-2-390.png](spec-5-2-stats-eight-services-evidence/services-5-2-390.png) -- 155372 bytes -- sha256 c594195d96d3 -- 390px
- [anchor-low-code-1280.png](spec-5-2-stats-eight-services-evidence/anchor-low-code-1280.png) -- 231132 bytes -- sha256 693908322b96 -- `#low-code` landing at 1280px
- [anchor-low-code-390.png](spec-5-2-stats-eight-services-evidence/anchor-low-code-390.png) -- 120357 bytes -- sha256 d492c83fb50d -- `#low-code` landing at 390px

**Not captured**

- Touch and pen input on a real device. The walk used a mouse and keyboard in Chrome; the cards have no handlers or links, so they cannot react to touch either.
