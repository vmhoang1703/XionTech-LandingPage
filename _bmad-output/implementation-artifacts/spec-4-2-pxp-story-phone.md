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
| Section | page load | — | paper section: phone and tabs left, PXP badge, H2 "The school day, in a parent's pocket.", lede, features, store buttons right; one column below 900px | static | CAP-1, prototype | ✅ Chrome: 1280 phone left (x 198), text right (x 668), markup phone first so Tab order matches; 899/640/390 text first, phone under it (CSS `order`, lead 2026-10-03, AC-NAV-5); test: phone before the text in the markup |
| Phone | page load | — | 260px wide dark phone with a notch; Attendance screen shown | static | CAP-1, DESIGN.md story phone | ✅ Chrome: 260px at 1280, 899, 640, 390; test: notch, no img |
| Screens | page load | — | each screen is an empty grid frame with a `[Placeholder]` caption naming the screen; no broken image | static | SPEC Assumptions, NFR-7 | test: shows only the Attendance screen at first |
| Tabs | read | — | five pills in order Attendance, Grades, Messages, Payments, Events, each with an icon; selected pill navy with white text | static | CAP-1, DESIGN.md | ✅ Chrome 1280: selected rgb(22,54,99) with white text; others transparent, muted text; test: order |
| Tabs | read | screen reader | tablist with five tabs; one has `aria-selected="true"`; each `aria-controls` its tabpanel | — | CAP-1, UX-DR18 | test: renders five tabs…, links every tab to its own panel |
| Grades tab | click or tap | mouse, touch, pen | Grades screen shows, the other four hide; Grades pill turns navy | instant (crossfade after demo) | CAP-2, decision slice | ✅ mouse click and touch tap (Chrome); pen: synthetic pen pointer events only (proves the click handler, not pen hardware); test: click |
| Tabs | Tab into the tablist | keyboard | focus lands on the selected tab only (one tab stop); 2px navy focus ring | instant | EXPERIENCE.md Accessibility Floor, T9 | ✅ Chrome 1280: Tab lands on the selected tab, `:focus-visible`, solid 2px navy ring with 3px offset (outside the navy pill); test: roving tabindex |
| Tabs | ArrowRight / ArrowLeft / Home / End | keyboard | focus and selection move to next / previous (wraps) / first / last tab; its screen shows | instant | prototype `site.js`, ARIA tab pattern | ✅ Chrome 1280: ArrowRight → Grades, End → Events; test: keys; modifier keys (Alt+Left) left to the browser (fixed in review) |
| Hidden screens | Tab through the section | keyboard | focus never enters an inactive screen | — | CAP-3, AC-A11Y-3 | ✅ Chrome 1280: Tab reaches the tablist (16 presses from the top, before the text column); later stops leave the section (footer logo, then footer links), none inside a hidden screen; test: inactive screens out of focus |
| Hidden screens | browse | screen reader | inactive screens are not announced | — | CAP-3, AC-A11Y-3 | test: inactive panels carry `hidden` |
| Tab pill | hover | mouse | hand cursor; no colour change (the prototype has no hover style) | — | prototype `.ptabs` | ✅ Chrome 1280: pointer cursor, no colour change |
| Features | read | — | four items with icons: Know they arrived, See progress early, Talk to teachers, Pay fees in a tap; two columns, one at 640px or less | static | CAP-4, Flow 3 | ✅ Chrome: two columns at 1280 and 899, one at 640; test: four features |
| Store buttons | read | — | "[Placeholder] App Store" and "[Placeholder] Google Play" glass buttons with Apple and Google Play icons, always shown | static | CAP-4, A1 | test: shows App Store and Google Play placeholders… |
| Store buttons | click | mouse, touch, keyboard | while the address is the stand-in `PLACEHOLDER_HREF` (A1): a disabled label (`span`, `aria-disabled`), not a link, so a click goes nowhere; a real store address becomes a link that opens a new tab with `rel="noopener noreferrer"` (lead, 2026-10-03; replaces CAP-4's new-tab wording for stand-in links) | instant | CAP-4, FR-16, A1 | ✅ Chrome 1280: both are `span aria-disabled=true`, click opens 0 tabs, scroll stays 952; test: disabled labels; `StoreButton` with a real URL renders the new-tab link |
| Store buttons | read | screen reader | stand-in: plain text "[Placeholder] App Store", not a link (`aria-disabled` is a style hook; screen readers do not announce it on a `span`); real address: link name ends "(opens in a new tab)" | — | CAP-4 | test: no link for the stand-in; real-URL name |
| Store button | hover | mouse | border darkens, button lifts 2px | 0.3s | DESIGN.md button (`.btn-glass`) | ✅ Chrome 1280 stand-in label: opacity 0.6, not-allowed cursor, no lift, border unchanged (same look as `.btn:disabled`); a real link keeps the `.btn` lift (2px, seen on an earlier walk) |
| Section heading | `/products#pxp`, sub-nav PXP pill, mega menu PXP | any | heading fully visible below header and sub-nav (144px) | smooth | AC-NAV-5 (4.1) | ✅ Chrome 1280: direct URL, sub-nav pill and mega menu put #pxp at 144px, H2 at 348px; 899/640/390: H2 at 298px, inside the screen |
| Page | reduced motion | — | no transition on tabs or screens | — | EXPERIENCE.md Motion | ✅ Chrome reduced motion: 0 tabs or panels with a transition; screen switches within 30ms |
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
- Build, smoke and the browser walk ran in the main checkout (Turbopack rejects the worktree's `node_modules` junction): `npm run build` passes, `npm run test:smoke` 7 passed; walk script and output in `spec-4-2-pxp-story-phone-evidence/`.

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

Full `bmad-code-review` on 2026-10-03 after rebasing onto `develop` (7f98006), 5 layers. Security: clean. Acceptance: CAP-1 to CAP-4 met.

- patch (lead decisions, 2026-10-03): the lede and the four feature lines start with `[Placeholder]` until someone checks the real PXP app; text before the phone below 900px so a `#pxp` jump shows the heading (the mockup stacks the phone first); a store link that is still `#` stays on the page (no new tab), a real address opens a new tab.
- patch: modifier-key shortcuts (Alt+Left = Back) were blocked by the tablist key handler; no page test proved `#pxp` renders the story section.
- patch (evidence): UX rows filled from the walk; the store hover was first read while the page scrolled; pen marked as synthetic.
- false: focus ring invisible on the navy pill (the global rule has a 3px offset); empty-named link after the store buttons (the footer logo, named by its alt text).
- defer (Minor, `deferred-work.md`): inside the phone the active screen (an empty `[Placeholder]` frame, `tabIndex=0`) is a tab stop before the tablist, as in the prototype's markup; arrow keys start from the selected tab, not a focused unselected one; walk script hardening.
- note for 4.3: the SXP feature icon colour rule must target `.feature-list svg` (Phosphor), not `i`.

Second full review of the follow-up fixes (2026-10-03, 5 layers): Security and Verification Gap clean.

- patch (lead decisions): text-first markup made desktop Tab order differ from the screen (EXPERIENCE.md "tab order follows reading order"); the markup is phone first again and CSS `order` moves the phone under the text only below md. A `#` store link jumped to the top of the page; a stand-in address now renders a disabled label, a real address a new-tab link (`StoreButton`, `PLACEHOLDER_HREF` in `product-links.ts`).
- defer (Minor): only `#` exactly counts as a stand-in; feature titles and screen labels are not marked `[Placeholder]` (the lead asked for the lede and the four feature lines); the new-tab link pattern also lives in `/demo` and the footer (no shared helper); AltGr is not in the modifier list.
- patch (third round, under 50 lines, one Edge Case layer): the stand-in label still lifted on press, changed its border on hover and was not dimmed; it now shares the `.btn:disabled` look (rule moved next to it); a direct `StoreButton` test for the stand-in.
- accepted (lead's layout choice): below md a screen reader reads the phone before the text shown above it; keyboard order is not affected today because the stand-in store labels are not focusable. When real store URLs land, mobile Tab order will reach the phone tabs before the store links — listed in `deferred-work.md`.
- open for the lead: the four feature titles and the H2 are still unmarked; the lead asked for the lede and the four feature lines.
- defer (Minor, light review): native `:disabled` `.btn-navy`/`.btn-primary` buttons still change on hover (existed before this story; capture band and contact form while sending).
