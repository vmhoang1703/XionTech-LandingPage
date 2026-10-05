---
title: 'Story 5.1: Services hero with live office clocks'
type: 'feature'
created: '2026-10-05'
status: 'done'
baseline_commit: 'f9ad4d033ad8e9d8a3c5615323d9cf7abde08935'
route: 'dispatch'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `/services` does not exist. Quân (a CTO checking time-zone overlap, Flow 2) needs a navy Services hero with two next steps and the live local time in Ho Chi Minh City and Plano, readable as zone labels before JavaScript runs (FR-20, FR-30, UX-DR19). Contract: `_bmad-output/specs/sammy/spec-5-1-services-hero-clocks/SPEC.md` (CAP-1 to CAP-3).

**Approach:** A new Server Component page `src/app/services/page.tsx` with copy in `src/content/services.ts`, built like Andy's inner pages (`HeroArt tone="navy"`, `.page-hero`, `.crumbs`, `.hl`, `.lede`). One shared clock module that About (6.4) reuses: a pure formatter `src/lib/clock/office-time.ts` (IANA zone → `HH:MM`, en-GB 24-hour, as the prototype `clocks()`) and a client `src/components/sections/live-clock.tsx` that server-renders the zone label and replaces it with the live time, refreshed every 30 seconds. Each office's zone and label live once in `src/content/offices.ts` (`timeZone`, `zoneLabel`). Only `.cta-row` and `.clock-strip` are new CSS, ported from the prototype into a Services section of `globals.css` `@layer components` (`@theme` untouched).

</frozen-after-approval>

## Boundaries & Constraints

**Always:** Server Component page; `LiveClock` is the only client part. Zone labels "GMT+7" and "US Central" are in the server HTML. IANA zones `Asia/Ho_Chi_Minh` and `America/Chicago`; 30-second refresh; the interval is cleared on unmount. Copy in `src/content/*` for later translation. Tokens from Story 1.1; port the prototype `services.html` hero. "See our 4-D process" links to `#process`, which has no target until Story 5.4 (opens Services at the top).

**Never:** Stats, eight services, 4-D process or the project capture band (Stories 5.2, 5.4); About office cards (6.4); the shared breadcrumb or hero component (1.6, after demo); Vietnamese copy; editing Andy's `layout.tsx`, `@theme` or `src/components/layout/*`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Server render / no JS | first HTML | "Ho Chi Minh City GMT+7" and "Plano US Central" | N/A |
| Live time | 2026-10-05T03:15:00Z | HCMC "10:15", Plano "22:15" (CDT, UTC−5) | N/A |
| Daylight saving | 2026-12-05T03:15:00Z | Plano "21:15" (CST, UTC−6); HCMC "10:15" | N/A |
| Refresh | 30s of fake time pass | each clock re-renders with the new minute | N/A |
| Unmount | page left | the interval is cleared | N/A |
| Bad zone | an invalid IANA zone in data | the zone label stays | the formatter throws `RangeError`; `LiveClock` keeps the label (as the prototype `try/catch`) and logs one warning naming the zone |

## Code Map

- `src/app/news/page.tsx`, `src/app/demo/page.tsx` -- Andy's inner-page hero pattern to copy: `HeroArt` first child, `.wrap`, `.crumbs` (Home / current), H1 with `.hl`, `lede` + margin utility.
- `src/components/sections/hero-art.tsx` -- reuse as is (`tone="navy"`).
- `src/content/offices.ts` -- shared office facts (footer, `/demo`, About); add `timeZone` and `zoneLabel`. `src/content/offices.test.ts` pins the facts — extend, don't break.
- `src/app/globals.css` -- `.page-hero`, `.crumbs`, `.hl`, `.lede`, `.btn .btn-primary .btn-glass`, `.label` exist; `.cta-row` and `.clock-strip` do not (prototype `site.css` 122, 125, 397–399). Add a Services section after the Home section.
- `src/test-utils/css-classes.ts` -- `undefinedClasses` for the CSS contract test.
- `e2e/` -- add an `@smoke` request check for `/services` (status 200 and both zone labels in the HTML).
- Prototype: `mockups/site-v3/services.html` hero, `js/site.js` `clocks()` (line 205), `css/site.css`.

## Tasks & Acceptance

**Execution:**
- [x] `src/content/offices.ts` -- add `timeZone` and `zoneLabel` to both offices -- one source for footer, Services and About
  - red: `src/content/offices.test.ts` -- HCMC is `Asia/Ho_Chi_Minh` / "GMT+7", Plano `America/Chicago` / "US Central"
- [x] `src/lib/clock/office-time.ts` -- `formatOfficeTime(date, timeZone)` → "HH:MM" (en-GB, 24h); `CLOCK_REFRESH_MS = 30_000` -- pure, testable, shared
  - red: `src/lib/clock/office-time.test.ts` -- the matrix times, including daylight saving, and a `RangeError` for a bad zone
- [x] `src/components/sections/live-clock.tsx` -- client; renders `zoneLabel` on the server, then the formatted time; refreshes every `CLOCK_REFRESH_MS`; clears on unmount; keeps the label and logs once on a bad zone -- the shared clock 6.4 reuses
  - red: `src/components/sections/live-clock.test.tsx` -- with fake timers: label before effects (server render), time after mount, new minute after 30s, interval cleared on unmount, bad zone keeps the label
- [x] `src/content/services.ts` -- breadcrumb, H1 (lead / highlight / tail), lede, the two CTAs, the clock strip label -- copy out of the components
- [x] `src/app/services/page.tsx` -- navy page hero with `HeroArt`, crumbs, H1, lede, `.cta-row` (primary "Start a project" → `/demo#project`, glass "See our 4-D process" → `#process`), `.clock-strip` with a `ClockIcon` and `LiveClock` per office (HCMC first); metadata title and description -- the page
  - red: `src/app/services/page.test.tsx` -- one H1 "Software teams that get IT done." with `.hl`, crumbs, both CTAs and hrefs, both zone labels, strip label, metadata, CSS contract
- [x] `src/app/globals.css` -- Services section: `.page-hero .cta-row`, `.cta-row`, `.clock-strip` ported with tokens -- missing classes
- [x] `e2e/services.spec.ts` -- `@smoke`: `/services` 200, both zone labels and the H1 in the HTML -- CAP-2 without JavaScript

**Acceptance Criteria:**
- Given `/services`, when it loads, then the navy hero shows the breadcrumbs, the H1, "Start a project" (to `/demo#project`) and "See our 4-D process" (to `#process`) (CAP-1).
- Given JavaScript is off, when the page loads, then the HTML contains "Ho Chi Minh City GMT+7" and "Plano US Central" (CAP-2).
- Given JavaScript, when the page loads, then each pill shows the office's local `HH:MM` and updates within 30 seconds of a minute turning; About can import the same module (CAP-3).

## UX checks

Sources: story spec CAP-1 to CAP-3, `EXPERIENCE.md` (Component Patterns › Clock strip, Office card; States table line 199; Focus ring), `DESIGN.md` (hero-navy, buttons), prototype `services.html` hero and `site.css`. Checked by the walk in `spec-5-1-services-hero-clocks-evidence/`.

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Hero | page load, 1280px | — | navy gradient hero with the aurora and strand ribbon (5s then still) | ribbon ≤ 5s | CAP-1, Story 1.6 motion (shared) |  ✅ walk: navy gradient, aurora 1, ribbon 1 |
| Breadcrumbs | read | — | mono "Home / Services"; Home links to `/` | static | CAP-1, constraint (prototype crumbs) |  ✅ walk + page test: "Home / Services" in JetBrains Mono; Home → / |
| H1 | read | — | "Software teams that get IT done." in white Unbounded, amber bar under "get IT done" drawing in | 1.2s after 0.5s | CAP-1, prototype |  ✅ walk + page test: Unbounded white; `.hl` "get IT done" with `hl-draw` |
| Lede | read | — | the prototype lede in on-navy muted, 20px below the H1 | static | prototype `.page-hero .lede` |  ✅ walk: on-navy muted rgb(197,208,227), 20px below the H1 (after review patch; was 18px) |
| Primary CTA | read / click | mouse | amber pill "Start a project" with an arrow → `/demo#project` | instant | CAP-1 |  ✅ walk + page test: amber pill with arrow svg → /demo#project |
| Glass CTA | read / click | mouse | glass pill "See our 4-D process" → `#process` (top of Services until 5.4) | instant | CAP-1, constraint |  ✅ walk + page test: glass pill → /services#process, scrollY 0 |
| CTAs | hover | mouse | lift 2px | 0.35s | DESIGN.md button |  ✅ walk: primary lifts 2px |
| CTAs | Tab | keyboard | amber focus ring on each, in order | instant | EXPERIENCE.md Focus ring |  ✅ walk: Tab → Start a project, See our 4-D process, each 2px rgb(255,192,0) |
| Clock strip | JavaScript off | — | two outlined pills with a clock icon: "Ho Chi Minh City GMT+7", "Plano US Central" | static | CAP-2, EXPERIENCE.md States |  ✅ walk (JS off) + page test (renderToString) + smoke: "Ho Chi Minh City GMT+7 | Plano US Central"; 1px full-radius pills with a clock svg |
| Clock strip | JavaScript on | — | the labels become the live local times in mono (HCMC first) | after hydration | CAP-3 |  ✅ walk (clock 03:15:45Z): "Ho Chi Minh City 10:15 | Plano 22:15", mono times, no nested pill |
| Clock strip | a minute turns | — | each time updates | within 30s | CAP-3 |  ✅ walk + LiveClock test: 10:16 / 22:16 after 30 s |
| Clock strip | screen reader | — | group named "Office local times"; each pill reads city and time | static | prototype `aria-label` |  ✅ walk + page test: role group "Office local times"; each pill reads city then time |
| Layout | 899px / 390px | — | CTAs and pills wrap; no sideways scroll | static | EXPERIENCE.md Responsive |  ✅ walk: CTAs and pills wrap at 899 and 390; no sideways scroll |
| Reduced motion | — | — | aurora, ribbon and highlight still; clocks still update | static | NFR-2 |  ✅ walk: aurora and highlight animation none; clocks still 10:16 / 22:16 after 30 s |

## Implementation Notes

## Spec Change Log

## Review Triage Log

Step 4 review, 2026-10-05: Blind Hunter, Edge Case Hunter, Verification Gap, Acceptance Auditor, Security Auditor (clean), plus the task-review minors from the ledger.

- Lede 18px below the H1, spec and prototype say 20px (Acceptance Auditor, Verification Gap, Blind Hunter, Edge Case Hunter) — medium, patch: `mt-5`; contract-test exemption follows.
- `hour12: false` may render "24:05" at midnight on some engines (Edge Case Hunter, Acceptance Auditor, Task 2 minor) — low, patch: `hourCycle: "h23"` plus a 00:05 test (Node already gave 00:05).
- Formatter tests: the "padding" test asserted 23:59, the "daylight saving" cases were October vs December, HCMC "DST" test meaningless (Blind Hunter, Task 2 minors) — low, patch: an 08:05 padding case, a real 2026-03-08 spring-forward pair, honest names.
- Dev server returns 500 on every page (Google font loading in `src/app/layout.tsx`) (Blind Hunter, Edge Case Hunter) — maybe-false, defer: pre-existing in Andy's file; may be this machine's network to Google Fonts. Settle by running `npm run dev` on another machine.
- The live time replaces the zone label (Blind Hunter) — false: `EXPERIENCE.md` States table, "shows the zone label … then the live time".
- `epic-5-context.md` outside the tasks (Acceptance Auditor) — false: written by bmad-build step 1 on purpose.
- LiveClock: stale time when `timeZone` changes at runtime, no resync on `visibilitychange`, ticks not aligned to the minute, StrictMode double warning in dev, `clearInterval(id)` in `tick` (Edge Case Hunter, Blind Hunter, Task 3 minor) — low, rejected: no caller changes the zone; a 30 s refresh meets the spec's "within 30 seconds"; the warning repeat is dev-only; `tick` runs only after `id` is assigned.
- Smoke test checks city names that the footer also has; H1 as substrings (Edge Case Hunter, Blind Hunter, Task 7 minors) — low, rejected: the zone labels are the tight check (rendered only by the clocks); the page test pins the H1.
- `.cta-row` may already exist (Edge Case Hunter) — false: no `.cta-row` rule existed in `globals.css` before this diff.
- `offices.ts` restructured into named constants; city strings duplicate `office.name` (Blind Hunter, Task 5 minor) — low, rejected: needed so the clock strip cannot drop a pill; reviewed in Task 5's fix round; short city names differ from the full names on purpose.
- Lede and meta description are unverified claims (Blind Hunter) — false: the lede is the prototype's copy (service descriptions confirmed by the business, `EXPERIENCE.md`); the meta reuses the Home door's confirmed line.
- Breadcrumb separator not `aria-hidden`, no `aria-current` (Blind Hunter) — low, rejected: the same pattern as every inner page; the shared breadcrumb is Story 1.6.
- Absolute local paths in the ledger and evidence (Blind Hunter) — low, rejected: BMad workflow records (the ledger identity line requires the absolute spec path), not source or config.
- Empty triage log, no AI log entry (Blind Hunter) — false at the time of reading: written in steps 4 and 5.
- Task minors: `offices.test.ts` no IANA validity check, `services.ts` no `as const` (consistent with siblings), page destructuring style, CSS tests by source text — low, rejected: no user-visible harm.

## Verification

**Commands:**
- `npm test` -- expected: all pass, including the new clock, page and offices tests
- `npm run lint && npm run typecheck && npm run format:check` -- expected: clean
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines, branches ≥ 80%
- `npm run test:smoke` -- expected: build passes; `/services` 200 with both zone labels

**Manual checks (if no CLI):**
- Chrome walk of the UX checks table at 1280, 899 and 390px, with JavaScript off and reduced motion; screenshots in the evidence folder.

## Acceptance Evidence

Re-captured in step 4 after the review patches, on 2026-10-05.

**Commands**

- `npm test` -- exit 0 -- Test Files 67 passed (67), Tests 1043 passed (1043)
- `npm run lint && npm run typecheck && npm run format:check` -- exit 0 -- All matched files use Prettier code style!
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- Coverage: 100%; C1 ok: 6 changed file(s) with branch coverage >= 80%
- `npm run test:smoke` -- exit 0 -- 12 passed (10.5s)

**Observed**

- `/services` on a production build (`next start`): navy hero, crumbs, H1 with highlight, lede 20px below it, both CTAs to `/demo#project` and `#process`; clock pills "Ho Chi Minh City 10:15 | Plano 22:15", then 10:16 / 22:16 after 30 s (Playwright clock); JavaScript off shows "GMT+7" and "US Central"; reduced motion stops the hero motion but not the clocks -- spec-5-1-services-hero-clocks-evidence/walk-output.txt

**Artifacts**

- spec-5-1-services-hero-clocks-evidence/verification.txt -- 5794 bytes -- sha256 dca734b17014 -- the four commands' output
- spec-5-1-services-hero-clocks-evidence/walk-output.txt -- 1430 bytes -- sha256 9ab7483b4468 -- walk observations
- spec-5-1-services-hero-clocks-evidence/observed.md -- 1738 bytes -- sha256 410cced07d4d -- route, steps, what was seen
- spec-5-1-services-hero-clocks-evidence/services-1280.png -- 463025 bytes -- sha256 1377a7b0538a -- hero after the 30 s refresh
- spec-5-1-services-hero-clocks-evidence/services-899.png -- 322724 bytes -- sha256 27270f53afb7 -- 899px
- spec-5-1-services-hero-clocks-evidence/services-390.png -- 220837 bytes -- sha256 2e599069de6d -- 390px
- spec-5-1-services-hero-clocks-evidence/services-no-js-1280.png -- 346731 bytes -- sha256 8c637ab826af -- JavaScript off: zone labels
- spec-5-1-services-hero-clocks-evidence/walk.mjs -- 5838 bytes -- sha256 9bdae8e70361 -- the walk script

**Not captured**

- The dev server returned 500 on every page on this machine (Google font loading in `src/app/layout.tsx`; deferred); the walk used the production server. Not observed: touch input, a screen reader.
