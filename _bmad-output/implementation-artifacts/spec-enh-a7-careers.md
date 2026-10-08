---
title: 'E-A7 Careers matches the prototype'
type: 'feature'
created: '2026-10-08'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `/careers` on `develop` still renders the Story 6.5 page (amber hero with breadcrumb, "A culture that goes beyond employment.", "Why you'll grow here.", open roles, Life photo frames), while the prototype (`_bmad-output/prototype-enhancement/prototype/careers.html`, ENH-035, ENH-049, ENH-055, ENH-060, ENH-067) has a light page about how people grow here, with the roles last. Planned spec: `_bmad-output/specs/andy/spec-enh-a7-careers/SPEC.md`.

**Approach:** Port the prototype's Careers page (no redesign) onto the E-A1 tokens:
- CAP-1 light hero ("Stay curious. Build what's next.", lede, "Explore open roles" to `#roles`, no breadcrumb) beside the Growth Learning Model ring (Curious, Learn, Ask, Grow, Improve round a navy "Growth" circle). When 40% of the ring is in view, an amber dot travels once round it (first step after 1.2s, then every 2.6s), lights each step and rests on Improve. With reduced motion, or before JavaScript runs, it stays on Curious.
- CAP-2 "Inside XionTech." (`#life`): five text tiles (Workshops & experiments large, Client visits amber, Town halls and Project kickoffs cream, Celebration navy).
- CAP-3 "Five things that shape the way we work.": five flip cards, each a `<button>` with `aria-pressed`; click, tap, Enter or Space flips it and again flips it back; the hidden face is `inert`; with reduced motion the faces swap with no rotation.
- CAP-4 remove "Why you'll grow here" and "A culture that goes beyond employment." and the Life photo frames from the page.
- CAP-5 "Find your next challenge." (`#roles`) is the last section; the role list, links and empty panel are unchanged.
- CAP-6 one light gradient: light blue in the hero, white in the middle, light amber at the end (prototype `site.js` "pastel" path; done in CSS, no scroll script).
- CAP-7 job page: no sideways scroll from 320px to 1440px.
- CAP-8 title stays "Careers at XionTech | Software Jobs in Ho Chi Minh City".

Decisions (lead, 2026-10-08, plan defaults): Tier 1 (Q14 superseded, Demo day 2026-10-16). Q6: the Growth Learning Model, the "Celebration" tile and the five flip-card values ship marked `[Placeholder]`. Q15: keep the Sanity life-photo code (`getLifePhotos`, `careersPhotos` schema, `LifeFrames`) unrendered and list it in `deferred-work.md`. Write "XionTech" (the prototype says "Inside XionTechs"). E-A4 (soft): the job form's "Summit reached." success is E-A4 CAP-3; until it merges the job form keeps its current success panel.

</frozen-after-approval>

## Implementation Notes

UX checks (`docs/ux-checks.md`), written before coding. Source P = prototype `css/site.css` line, J = `js/site.js` line, C = `careers.html`.

| # | Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Hero | load | none | light hero, no breadcrumb; H1 "Stay curious." / "Build what's next." on two lines at 300; lede; amber "Explore open roles" button with arrow | static | C, CAP-1, P1155-1157 | yes: test (careers.test) + browser 1280 (H1 300, 1.04) |
| 2 | Explore open roles | click / Enter | mouse, keyboard | page scrolls to "Find your next challenge.", heading below the header | scroll | CAP-1, AC-NAV-5 | yes: browser: #roles-h top 136px, header bottom 72px |
| 3 | Growth ring | load, 1280px | none | two columns: text left, ring right; navy "Growth" circle, five white step circles 01 Curious to 05 Improve; Curious amber; caption "[Placeholder] Growth Learning Model" | static | P1156-1171, Q6 | yes: browser 1280/1440 two columns + screenshot |
| 4 | Growth ring | 40% in view | scroll | dot moves Curious → Learn → Ask → Grow → Improve, each step turns amber in turn, then stops on Improve and never moves again | 1.2s, then 2.6s per step | J283-288, CAP-1 | yes: test (growth-ring.test) + browser: steps 0,1,2,3,4,4 at 0/1.4/4/6.6/9.2/13.2s |
| 5 | Growth ring | reduced motion | none | dot stays on Curious, nothing moves | static | J283-288, CAP-1 | yes: test + browser (reduced motion, still on Curious after 6s) |
| 6 | Growth ring | 900px and less; 390px; 320px | none | ring under the text, whole ring visible, no sideways scroll | static | P1172-1173 | yes: browser 320/390/820/900: one column, all circles inside the screen, overflow 0 |
| 7 | Growth ring | screen reader | none | read once as "[Placeholder] Growth Learning Model: Curious, Learn, Ask, Grow, Improve"; the circles are hidden | static | C, Q6 | yes: test + Chrome aria snapshot |
| 8 | Inside XionTech | load, 1280px | none | heading "Inside XionTech." and lede side by side; five tiles: large navy Workshops (two rows), amber Client visits, cream Town halls and Project kickoffs, navy "[Placeholder] Celebration" | static | P1179-1194, CAP-2, Q6 | yes: test + browser 1280 screenshot |
| 9 | Inside XionTech | 980px and less / 640px and less | none | two equal columns of 240px tiles / one column of 220px tiles | static | P1196-1197 | yes: browser: 2 cols x 240px at 820/900, 1 col x 220px at 320/390 |
| 10 | Flip card | load | none | five cards in a row at 1280px (3 at ≤1180px, 2 at ≤820px, 1 at ≤520px); number, line icon, title starting "[Placeholder]", "Flip for details"; card 5 amber; no text cut off | static | P1200-1220, Q6 | yes: test + browser: 5/5/3/3/2/1 cols at 1440/1280/1180/900/820/390; no face or tile clipped at 320/521/821/981/1181/1280 |
| 11 | Flip card | click or tap | mouse, touch, pen | card turns to its back (number · label, meaning, text, "Flip back"); `aria-pressed="true"`; again turns back, `aria-pressed="false"` | 0.65s | J290-292, CAP-3 | yes: test (flip-card.test) + browser click |
| 12 | Flip card | Tab, then Enter or Space | keyboard | 3px navy focus ring; the card flips | 0.65s | P1217, CAP-3 | yes: browser: Enter flips, Space flips back, outline solid 3px |
| 13 | Flip card | either side | screen reader | only the face on show is read; the other face is `inert` | static | CAP-3 | yes: test (inert) + Chrome AX tree: name is the face on show only |
| 14 | Flip card | reduced motion | mouse, keyboard | faces swap with no visible turn (transition removed, as the prototype does) | instant | P1221, CAP-3 | yes: browser (reduced motion): transition 0s, back face shown at once after Enter |
| 15 | Removed sections | load | none | no "Why you'll grow here", no "A culture that goes beyond employment.", no Life photo frames, no breadcrumb, no email band | static | CAP-4 | yes: test (page.test) |
| 16 | Find your next challenge | load | none | heading "Find your next challenge."; last section before the footer; role cards (or the empty panel) as today, each one link to `/careers/<slug>` | static | CAP-5 | yes: test + browser: sections life, culture, roles last |
| 17 | Page background | scroll the page | none | one gradient: light blue hero, white through Inside XionTech and the flip cards, light amber behind the roles; no hard edge between sections | static | CAP-6, ENH-060 | yes: browser: section backgrounds transparent, one gradient on .careers-flow; screenshot |
| 18 | Job page | 320px to 1440px | none | no sideways scroll | static | CAP-7, ENH-026 | yes: browser /careers/fresh-full-stack-developer at 320/360/390/768/1024/1280/1440: overflow 0 |
| 19 | Browser tab | load | none | "Careers at XionTech \| Software Jobs in Ho Chi Minh City" | static | CAP-8 | yes: test (metadata) + browser title |

Tests: `growth-ring.test.tsx`, `flip-card.test.tsx`, the new `careers.test.tsx` and `page.test.tsx` cases written first and seen failing (`npx vitest run src/components/careers src/app/careers/page.test.tsx`: 4 files failed, 5 tests; missing modules and the old hero), then 65 of 65 passing. Browser walk on `next start --port 3207` (Chrome, Playwright) for rows 1-19.

Decisions:
- The Q6 marks: the ring's caption and accessible name start with `[Placeholder]`; the tile title is "[Placeholder] Celebration"; each flip card's front and back title starts with `[Placeholder]` (review: one section note did not meet the AGENTS.md rule that placeholder text starts with the mark).
- The gradient is CSS, not the prototype's scroll script: the hero runs `--color-ice` to `#e8eff9`, and `.careers-flow` (around the three later sections) runs the prototype's pastel stops (`#e8eff9`, `#f5f8fd` 28%, white 45%, `#fff5d9` 70%, `#ffe7a3`) with its faint amber glow. `OpenRoles` loses `surface-paper` so the gradient shows through (it is used only on Careers).
- The hero keeps `.aurora` (pastel colours, masked to fade out, ENH-060) but not the strand ribbon, as in the prototype. Its rule is `.careers-hero.hero-light .aurora`, because the shared `.hero-light .aurora` comes later in the file (the first walk showed the amber default glow).
- The figcaption is `aria-hidden`, so the model is read once from the figure's name.
- Q15: `LifeFrames`, `getLifePhotos`, the `careersPhotos` schema and `careersLife` stay but are not rendered; listed in `deferred-work.md`. `Culture`, `Benefits` and their copy are deleted.
- Footer clearance under the roles is E-S4 CAP-4's; the job form's "Summit reached." is E-A4 CAP-3 (soft dependency: the current success panel stays until it merges).
- Reduced motion: no extra CSS. The base reduced-motion rule removes the 0.65s transition, so the faces swap at once (prototype P1221). A first version hid the back face with `visibility: hidden`, which the "CSS hides no content" test in `contrast.test.ts` rejected.

## Review Triage Log

Full `bmad-code-review`, 4 layers (Blind Hunter, Edge Case Hunter, Verification Gap, Acceptance Auditor), 2026-10-08, on `c60ed80`.

- patch (medium): flip-card values marked only by one section note, not each value (AGENTS.md hard rule 1, Q6) -> each front and back title starts with `[Placeholder]`; the note is gone.
- patch (medium): the new flip-card Tab stops are not in the keyboard a11y run -> `/careers` added to `KEYBOARD_PAGES` in `e2e/a11y.spec.ts`.
- patch (low): the H1 text read "Stay curious.Build what's next." with no space -> a space before the `<br>`.
- patch (low): the growth ring read `entries[0]`; a batch with an enter then a leave could play off screen -> `entries.at(-1)`.
- patch (low): step numbers built as `0${n}` -> `padStart(2, "0")`.
- patch (low): new roles heading not asserted -> `page.test.tsx` checks "Find your next challenge."; the smoke test also checks `#life` < `#culture` < `#roles`.
- patch (low): UX table rows had an extra empty cell -> fixed.
- defer (medium, unverified): the flip card's accessible name changes when pressed (front text, then back text); the spec asks for exactly this, but the ARIA toggle pattern prefers a stable name. Needs a screen-reader check (deferred-work.md).
- defer (low): CAP-7 (job page, no sideways scroll) has no automated check; the browser walk passed at 7 widths (deferred-work.md).
- defer (low): the kept life-photo code still costs tests and CSS, the revalidate tag still revalidates `/careers`, and the Studio help text still names the hidden section (added to the Q15 deferred entry).
- false: Demo day 2026-10-16 conflicts with AGENTS.md -> PR #71 changes it (lead decision 2026-10-08).
- false: no AI log entry / stale spec status -> written after the review, before the commit.
- maybe-false -> checked, false: text clipped in fixed-height flip faces and tiles -> browser walk at 320/521/821/981/1181/1280px: no face or tile overflows, no tag overlaps a title.
- rejected (low): hard-coded hex colours -> they are the prototype's values; E-A1 tokens are used where one exists (`--color-ice`, `--color-mist`, `--color-amber`, `--color-navy`).
- rejected (low): no contrast test for the new pairs -> measured: `#3f4f6c` on `#ffc31f` 5.14, muted on `#ffe7a3` 5.63, on `#fff3b7` 6.13, `#d9e2ed` on `#224f81` 6.41; axe runs on `/careers` in `test:a11y`.
- rejected (low): reduced motion turned on mid-session, no `IntersectionObserver`/`matchMedia` fallback, steps not matching 5 angles, flip cards need JavaScript -> rare or impossible in the supported browsers and fixed content; the prototype behaves the same.
- rejected (low): the Inside lede mentions "celebrations" and "team days" unmarked -> the lede is Amber's section copy from the same file as the verified tiles; Q6 names only the tile.
- rejected (low): `LifeFrames` would reuse `id="life"` if rendered again -> it is not rendered; the Q15 deferred entry covers any reuse.
- false: `surface-paper` removed from `OpenRoles` drops its tokens -> the root tokens are the same light set, and `OpenRoles` is used only on Careers.
