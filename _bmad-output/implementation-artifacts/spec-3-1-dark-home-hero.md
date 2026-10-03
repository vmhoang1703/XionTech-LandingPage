---
title: 'Story 3.1: Dark Home hero with one CTA'
type: 'feature'
created: '2026-10-03'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Home needs the dark hero: label, H1 with the highlight on "connected", sub line, exactly one primary CTA to `/products`, tablet and phone frames that never show a broken image, and a static navy and amber glow when JavaScript or WebGL is off (FR-10, FR-11). Contract: `_bmad-output/specs/sammy/spec-3-1-dark-home-hero/SPEC.md` (CAP-1 to CAP-5).

**Approach:** Server Component `src/components/home/home-hero.tsx` on the Story 1.1 `hero-silk` surface, using 1.1's `.label`, `.hl`, `.btn .btn-primary` and `.wrap`. Hero-only styles (glow fallback layer, device frames, empty media frame) are ported from the prototype `site.css` into a Home section of `globals.css` `@layer components`, using colour tokens; `@theme` is not touched. The CTA arrow is a Phosphor icon (`@phosphor-icons/react/ssr`). Device frames stay empty with `[Placeholder]` captions (media is Story 4.4). Built first on 2026-10-01 before 1.1 merged; the 2026-10-03 audit against the merged 1.1 found undefined class names, no glow layer and no icon, fixed here.

</frozen-after-approval>

## UX checks

Sources: story spec CAP-1 to CAP-5, `EXPERIENCE.md`, `DESIGN.md`, prototype `index.html` / `site.css`. Checked by the walk in `spec-3-1-dark-home-hero-evidence/`.

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Hero | page load, 1280px | — | ink hero fills the viewport below the header (100dvh minus 72px) | static | CAP-1 |  ✅ walk: 828px = 900 − header |
| Hero | page load | — | navy glow right of centre and amber glow lower right behind the devices | static | CAP-4, prototype `.silk-fallback` |  ✅ walk: `.silk-fallback` navy-2 75% + amber 22% radial glows, z −2 |
| Label | read | — | "EdTech products · Software services" in Lexend Exa caps with the amber rule before it | static | CAP-1, DESIGN.md label |  ✅ walk: Lexend Exa, uppercase, amber-tint; rule rgb(255,192,0) |
| H1 | read | — | "Every school community, connected." in white Unbounded; amber highlight bar under "connected" | static | CAP-1, DESIGN.md highlight-mark |  ✅ walk + unit test: Unbounded, white, `text-display-hero-fluid`; `.hl` amber bar (after fix: was ~1.1rem) |
| Sub line | read | — | the PXP / LXP / SXP sentence in on-navy text | static | CAP-1 |  ✅ walk: rgb(238,242,249) |
| CTA | read | — | one amber pill button "Explore our products" with navy text and an arrow icon; no other button or link in the hero | static | CAP-2, DESIGN.md button-primary |  ✅ walk + unit test: 1 link, 0 buttons; amber gradient, navy text, 52px pill, arrow svg |
| CTA | hover | mouse | lifts 2px | 0.3s | DESIGN.md button (UX-DR5) |  ✅ walk: 2px |
| CTA | click | mouse | opens `/products` | instant | CAP-2 |  ✅ walk: URL /products |
| CTA | Tab | keyboard | amber focus ring (focus-on-navy) | instant | EXPERIENCE.md Focus ring, T9 |  ✅ walk: 2px rgb(255,192,0) |
| Devices | page load | — | white tablet frame and phone frame (with notch), gradient edge, each showing an empty grid frame with a `[Placeholder]` caption; no broken image | static | CAP-3, UX-DR17 |  ✅ walk + unit test: frames, notch, grid paper, navy caption, 0 img |
| Hero | JavaScript off | — | all text readable on the static glow | static | CAP-4 |  ✅ walk (JS off): H1 present, glow present; `hero-no-js-1280.png` |
| Layout | 1280px | — | text left, devices right | static | CAP-5 |  ✅ walk: 2 columns |
| Layout | 899px / 390px | — | text above devices, one column; devices at most 560px wide; no sideways scroll | static | CAP-5 |  ✅ walk: 899px 1 column, devices 560px; 390px 1 column, 358px; no sideways scroll |
| Layout | exactly 900px | — | two columns (1.1 switches at `width >= 900px`) | static | pending: spec says one column "at 900px and below"; 1.1 breakpoints switch at ≥ 900 site-wide — ask Amber |  ✅ walk: 2 columns at 900px (pending Amber) |

## Implementation Notes

- 2026-10-03 audit against the merged Story 1.1: the first build (2026-10-01, before 1.1) used class names 1.1 never defined (`highlight-mark`, `button-primary`, `device-frame`, `media-frame`), had no glow layer and no CTA icon. Fixed: 1.1's `.label`, `.hl`, `.btn .btn-primary`, `.wrap`; hero styles ported into a Home section of `globals.css` `@layer components` with colour tokens (`@theme` untouched); Phosphor `ArrowRightIcon` from `@phosphor-icons/react/ssr`.
- Test first: `npx vitest run src/components/home` 4 failed, then 4 passed. One first assertion (`toContain("hl")`) passed by accident on "highlight-mark"; switched to `classList.contains`.
- The walk then found two more: the H1 rendered at about 1.1rem (now 1.1's `text-display-hero-fluid`, test first) and the phone caption overflowed at 390px (smaller, wrapping caption). Also caught before the walk: the caption first used `--color-heading`, which is white inside the ink hero, so it would vanish on the paper frame; it uses navy.
- Exactly 900px shows two columns because 1.1's breakpoints switch at `width >= 900px` site-wide; the spec says one column "at 900px and below". Pending: Amber.


## Review Triage Log

Full `bmad-code-review` of the 2026-10-03 fix (211 lines; Blind Hunter, Edge Case Hunter, Verification Gap, Acceptance Auditor):

- Glow depends on `relative isolate` with no test — medium, patched: the test now asserts both classes.
- Comment said the glow shows only without JavaScript or WebGL — low, patched: it is always painted, the canvas draws above it.
- Raw sizes in the hero CSS (560px, paddings, notch, 30px, 0.58rem) — low, patched with a comment: they are the prototype's own values (`.devices`, `.tablet`, `.phone`, `.notch`, `.phone .slot`, `.hint small`); no 1.1 token exists for them.
- Phone caption 0.58rem is a new value — false: prototype `.phone .slot .hint small{font-size:.58rem}`.
- No `-webkit-mask` prefix for older Safari — false: the built CSS (`.next/…globals_css…css`) contains `-webkit-mask`; Tailwind v4 adds it.
- Old class names left as dead CSS — false: they were never defined in `globals.css`.
- `<mark>` replaced by `<span class="hl">` — low, rejected: the prototype and Story 1.1 use a span; `<mark>`'s default yellow fill would fight `.hl`.
- Exactly 900px shows two columns — known, pending Amber (UX checks).
- CSS look checked only by the walk, no automated browser test — maybe-false, deferred (`deferred-work.md`).
- Duplicate label assertion, class-order-sensitive `btn btn-primary` check, `#000` in the mask, forced-colors outline, CTA icon size at mobile — low, rejected: no user-visible harm found (walk shows the icon aligned at 390px).
- Missing AI log — patched (`docs/ai-log.md`).
