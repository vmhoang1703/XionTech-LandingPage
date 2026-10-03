---
title: 'Story 4.2: PXP story phone'
type: 'feature'
created: '2026-10-03'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `/products#pxp` is still the heading-only stub from Story 4.1. Hà (Flow 3) needs the PXP section "The school day, in a parent's pocket.": a 260px story phone with five screens and pill tabs Attendance, Grades, Messages, Payments, Events (ARIA tab pattern, exactly one selected, instant switch on Demo day), inactive screens out of the focus and screen-reader path (AC-A11Y-3), the four PXP features, and App Store and Google Play buttons that are always shown, read `[Placeholder]`, open a new tab with `rel="noopener noreferrer"` and have an accessible name ending "(opens in a new tab)" (FR-16, UX-DR18). Contract: `_bmad-output/specs/andy/spec-4-2-pxp-story-phone/SPEC.md` (CAP-1 to CAP-4), decisions A1 and T5.

**Approach:** Port `products.html#pxp`. A Server Component `src/components/products/pxp-section.tsx` renders the section (keeps `id="pxp"`, `pxp-h` and the `products-anchor` class) with badge, H2, lede, feature list and store buttons; the only client part is `pxp-story-phone.tsx` (phone with five tab panels plus the tablist; roving tabindex, arrows, Home and End; inactive panels use the `hidden` attribute). Screens are empty media frames with a `[Placeholder]` caption (no screen data invented; real media is Story 4.4). Copy goes in `src/content/products.ts`; the temporary store link values go in a new `src/content/product-links.ts`, the one place Story 4.3 also uses for the LXP, SXP and IoT addresses (A1). `page.tsx` renders `PxpSection` for `pxp` and keeps the stubs for `lxp`, `sxp`, `iot`. `globals.css` gets a PXP block (`.story-phone`, `.ptabs`, `.feature-list`, `.store-row`). No crossfade (after demo).

</frozen-after-approval>

## UX checks

Sources: SPEC CAP-1 to CAP-4, decisions A1 and T5, `EXPERIENCE.md` Component Patterns › PXP story phone + phone tabs, Motion › Story phone, Accessibility Floor, Flow 3; `DESIGN.md` Components › PXP story phone; prototype `products.html#pxp`, `site.css` (`.story-phone`, `.ptabs`, `.feature-list`), `site.js` (tabs). Tests in `src/components/products/pxp-section.test.tsx` and `pxp-story-phone.test.tsx`.

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Section | page load | — | paper section: phone and tabs left, PXP badge, H2 "The school day, in a parent's pocket.", lede, features, store buttons right; one column below 900px | static | CAP-1, prototype | test: keeps the #pxp anchor with its heading; layout and widths pending (controller walk) |
| Phone | page load | — | 260px wide dark phone with a notch; Attendance screen shown | static | CAP-1, DESIGN.md story phone | test: links every tab to its own panel (notch, no img); 260px pending (controller walk) |
| Screens | page load | — | each screen is an empty grid frame with a `[Placeholder]` caption naming the screen; no broken image | static | SPEC Assumptions, NFR-7 | test: shows only the Attendance screen at first |
| Tabs | read | — | five pills in order Attendance, Grades, Messages, Payments, Events, each with an icon; selected pill navy with white text | static | CAP-1, DESIGN.md | test: renders five tabs in order with Attendance selected; colours pending (controller walk) |
| Tabs | read | screen reader | tablist with five tabs; one has `aria-selected="true"`; each `aria-controls` its tabpanel | — | CAP-1, UX-DR18 | test: renders five tabs…, links every tab to its own panel |
| Grades tab | click or tap | mouse, touch, pen | Grades screen shows, the other four hide; Grades pill turns navy | instant (crossfade after demo) | CAP-2, decision slice | test: shows the Grades screen… when Grades is clicked; touch and pen pending (controller walk) |
| Tabs | Tab into the tablist | keyboard | focus lands on the selected tab only (one tab stop); 2px navy focus ring | instant | EXPERIENCE.md Accessibility Floor, T9 | test: roving tabindex (0 on the selected tab only); focus ring pending (controller walk) |
| Tabs | ArrowRight / ArrowLeft / Home / End | keyboard | focus and selection move to next / previous (wraps) / first / last tab; its screen shows | instant | prototype `site.js`, ARIA tab pattern | test: moves focus and selection with the arrow, Home and End keys |
| Hidden screens | Tab through the section | keyboard | focus never enters an inactive screen | — | CAP-3, AC-A11Y-3 | test: keeps inactive screens out of focus and the accessibility tree; real Tab pending (controller walk) |
| Hidden screens | browse | screen reader | inactive screens are not announced | — | CAP-3, AC-A11Y-3 | test: inactive panels carry `hidden` |
| Tab pill | hover | mouse | hand cursor; no colour change (the prototype has no hover style) | — | prototype `.ptabs` | pending (controller walk) |
| Features | read | — | four items with icons: Know they arrived, See progress early, Talk to teachers, Pay fees in a tap; two columns, one at 640px or less | static | CAP-4, Flow 3 | test: lists the four PXP features; columns pending (controller walk) |
| Store buttons | read | — | "[Placeholder] App Store" and "[Placeholder] Google Play" glass buttons with Apple and Google Play icons, always shown | static | CAP-4, A1 | test: shows App Store and Google Play placeholders… |
| Store buttons | click | mouse, touch, keyboard | opens the link in a new tab; `rel="noopener noreferrer"` | instant | CAP-4, FR-16 | test: target and rel; new tab pending (controller walk) |
| Store buttons | read | screen reader | name ends "(opens in a new tab)" | — | CAP-4 | test: shows App Store and Google Play placeholders… (name) |
| Store button | hover | mouse | border darkens, button lifts 2px | 0.3s | DESIGN.md button (`.btn-glass`) | pending (controller walk) |
| Section heading | `/products#pxp`, sub-nav PXP pill, mega menu PXP | any | heading fully visible below header and sub-nav (144px) | smooth | AC-NAV-5 (4.1) | pending (controller walk) |
| Page | reduced motion | — | no transition on tabs or screens | — | EXPERIENCE.md Motion | no transition in the PXP block (no crossfade on Demo day); pending (controller walk) |
| Page | any width | — | no link to `#updates` | — | T5 | test (page): no Updates link |

## Implementation Notes

- Route: one-shot. No intent gaps (screens are empty frames as in the prototype; store link values follow A1 and the prototype's `#`), nothing irreversible, small footprint.
- Test first: `npx vitest run src/components/products` failed with "no tests" (both components missing), then 12 passed; 13 after adding the `undefinedClasses` check (the 3.x lesson: classes that `globals.css` never defines).
- Files: `src/components/products/pxp-section.tsx` (Server), `pxp-story-phone.tsx` (the only client island), their tests, `src/content/products.ts` (`pxpSection` copy), new `src/content/product-links.ts` (A1: the one place for temporary product addresses; Story 4.3 adds the LXP, SXP and IoT addresses there), `src/app/products/page.tsx` (renders `PxpSection` for `pxp`, keeps the `lxp`, `sxp`, `iot` stubs), `src/app/globals.css` (PXP block after `.products-anchor`).
- Inactive screens use the HTML `hidden` attribute (Tailwind preflight makes it `display: none !important`, so the `.home-media` grid cannot override it). The active panel has `tabIndex=0` (ARIA tab pattern: a panel with no focusable content takes focus). Arrow keys select as they move (automatic activation), as in the prototype `site.js`.
- Screens reuse 4.1's `.home-media` empty frame, as 4.1 reused the Home hero's. The section keeps `products-anchor`, whose `padding-block` (80px, from the 4.1 stub) overrides `.sec` (112px from 640px up). Left as is so 4.3 merges cleanly; once 4.2 and 4.3 are both in, drop `padding-block` from `.products-anchor` (already in `deferred-work.md` from 4.1).
- Badge size: prototype inline `56px` → Tailwind `size-14` utility.
- Merge with 4.3 (built at the same time): both stories append to `src/content/products.ts`, change the `productsSections.map` in `page.tsx` and may add a CSS block after `.products-anchor`; expect small textual conflicts there. `epic-4-context.md` is new here; if 4.3 also compiles it, keep one.
- After review: icons are keyed by screen and feature id (a missing icon is a type error); the keyboard test fires keys on the focused tab; the focus test checks the tab order after switching; a brand-name test that could never fail was removed.
- Crossfade (after demo): `hidden` is `display: none` and cannot fade. The crossfade story must switch to the prototype's method: all screens stay laid out, inactive ones get `inert` (or `aria-hidden` plus `tabIndex=-1`) and fade with `opacity` 0.55s.
- For Story 4.3: the prototype also has `.s-navy .feature-list i { color: #FFCF06 }`; this port has only the paper colour. Add the navy rule with the SXP section.
- Build, smoke (`npm run test:smoke`) and the browser walk: pending (controller), because Turbopack rejects the worktree's `node_modules` junction. All UX rows marked "test:" are checked by unit tests; the rest need the walk.

## Review Triage Log

One layer (Blind Hunter, 26.7 kB, floor 6, 11 findings), 2026-10-03:

- Store links `href="#"` open a copy of `/products` in a new tab — rejected: decision A1 and SPEC CAP-4 ask for temporary `[Placeholder]` values that open a new tab; `#` is the prototype's value, kept in `product-links.ts` for replacement.
- Tab pill hover row had no source — false: the row was already changed to "no colour change" (prototype has no `.ptabs` hover) before the review; the reviewer read the earlier staged copy.
- `hidden` blocks the later crossfade — low, patched as a note in Implementation Notes (crossfade is a non-goal).
- Spec not finished (empty notes, blank Checked, status) — false at the time of finalizing: filled in this step.
- Icons matched to content by array index — medium, patched: `Record` keyed by id.
- Product claims (iOS and Android, gate alerts, fees) not confirmed by a human — rejected for this story: copy is Amber's mockup copy and the SPEC assumption says screens and copy are ported from it; listed as an open question for the PR.
- No browser test of the client island, anchor offset, widths — maybe-false: the controller's walk and smoke cover it (pending); the browser Playwright project is already in `deferred-work.md` from 4.1.
- Weak tests (keys on the tablist, focus test cannot fail, brand test) — low, patched.
- `.feature-list` navy variant missing — low, noted for Story 4.3.
- `page.tsx` ternary on `"pxp"` and unused stub heading — low, rejected: the smallest change that keeps the 4.3 merge simple; 4.3 can replace it with a map.
- AI log not updated — low, patched (`docs/ai-log.md`).
