---
title: 'Story 3.5: Bento and service cards'
type: 'feature'
created: '2026-10-05'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Home must show the four apps as a bento under "Four apps. One school day." (PXP large in amber, SXP navy, LXP and IoT smaller, badges swapped for contrast, each tile one link to its `/products` anchor) and the eight services under "Eight ways we get IT done for you." (each card one link to its `/services` anchor, 4/2/1 columns) (FR-14, UX-DR15, UX-DR24, AC-A11Y-4). Contract: `_bmad-output/specs/sammy/spec-3-5-bento-service-cards/SPEC.md` (CAP-1 to CAP-3).

**Approach:** `src/components/home/product-bento.tsx` and `service-cards.tsx` (Server Components), placed after the doors and before Andy's capture band. Built first on 2026-10-01 before 1.1 merged with class names 1.1 never defined (`product-badge-*`, `industry-chip`, `spotlight-card`, `service-card`, `device-frame`, `media-frame`), so the tiles, badges, chips, mini phone and cards rendered unstyled. Fixed here by porting the prototype `.sec-head`, `.linen`, `.spot`, `.bento`, `.tile`, `.t-*`, `.mini-phone`, `.svc-grid`, `.svc`, `.svc.feature`, `.svc.navy` rules into the Home section of `globals.css` with tokens, reusing 3.4's `.badge`, `.b-*`, `.chips`, `.chip`, `.go` and 3.1's `.home-media`. Icons from Phosphor (the prototype's `ph-*`): tile arrows, the IoT CPU badge, one icon per service. The spotlight pointer glow and 4px card lift are after demo (spec non-goal), so the glass cards are static; the tile arrow keeps the prototype hover (full opacity, −45°) on hover-capable devices only.

</frozen-after-approval>

## UX checks

Sources: story spec CAP-1 to CAP-3, `EXPERIENCE.md` (Component Patterns, Responsive, pointer effects), `DESIGN.md` (product badges, service-card), prototype `index.html` (bento and services sections) and `site.css`. Checked by the walk in `spec-3-5-bento-service-cards-evidence/`.

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Bento section | page load | — | mist section with the faint linen texture; H2 "Four apps. One school day." and the lede | static | CAP-1, prototype `.s-mist.linen`, `.sec-head` |  ✅ walk + unit test: mist gradient, linen texture layer, H2 and lede in `.sec-head` |
| Bento | 1280px | — | 12-column grid: PXP spans 7 columns and 2 rows (amber gradient), SXP 5 (navy), LXP 3 and IoT 2 (glass cards) | static | CAP-1, UX-DR15 |  ✅ walk + unit test: 12 columns; PXP 688×654 (7 cols, 2 rows), SXP 486×317, LXP 285×319, IoT 184×319 |
| Badges | read | — | 52px badges with the app name beside each: PXP tile carries the navy SXP-style badge, SXP tile the amber PXP-style badge, LXP navy-soft, IoT mist with a CPU icon | static | CAP-1, UX-DR15, UX-DR24 |  ✅ walk + unit tests: 52px; PXP tile `b-sxp`, SXP tile `b-pxp`, LXP `b-lxp`, IoT `b-iot` with CPU svg; name beside each (after fix: unstyled) |
| Tiles | read | — | name (Unbounded), full name in Lexend Exa caps, line, chips; PXP and SXP chips tinted for their tile | static | CAP-1, prototype `.tile`, `.t-pxp`, `.t-sxp` |  ✅ walk: Lexend Exa full names (navy on PXP, amber-tint on SXP, muted on LXP/IoT); chips tinted per tile |
| PXP tile | read | — | the rotated mini phone with an empty `[Placeholder] PXP screen` frame, bleeding off the tile bottom; not interactive | static | CAP-2, spec assumption, prototype `.mini-phone` |  ✅ walk + unit test: rotated −7°, 210px, `[Placeholder] PXP screen`, `aria-hidden`, 129px past the tile edge (clipped) |
| Tile | click anywhere on the tile | mouse | PXP → `/products#pxp`, SXP → `#sxp`, LXP → `#lxp`, IoT → `#iot` | instant | CAP-2 |  ✅ walk: click on each tile body (the PXP phone included) → /products#pxp, #sxp, #lxp, #iot |
| Tile | Tab | keyboard | one stop per tile; visible focus ring; name "PXP, Parent eXperience Place" (and the same pattern for each) | instant | CAP-2, AC-A11Y-4, prototype `aria-label` |  ✅ walk + unit test: 4 stops; tile-wide ring 2px with the tile's 24px corners (navy on PXP, LXP, IoT; amber on SXP); names "PXP, Parent eXperience Place" … |
| Tile arrow | hover | mouse | arrow circle to full opacity, rotated −45° (PXP, SXP, LXP; IoT has none) | 0.35s | prototype `.tile:hover .go` |  ✅ walk: PXP arrow opacity 1, −45°; IoT has no arrow |
| Tile arrow | tap / reduced motion | touch / — | no rotation stays | static | EXPERIENCE.md pointer effects, NFR-2 |  ✅ walk: touch tap and reduced-motion hover → arrow transform none |
| Services section | page load | — | paper section; H2 "Eight ways we get IT done for you." and the lede | static | CAP-3, prototype `.sec-head` |  ✅ walk + unit test: paper section, H2 and lede in `.sec-head` |
| Service cards | read | — | 8 glass cards with a 48px icon tile, name and line; Product Engineering and Cloud Computing with the amber "feature" tint; AI-Powered Solutions navy with an amber icon | static | CAP-3, prototype `.svc`, `.svc.feature`, `.svc.navy` |  ✅ walk + unit tests: 8 cards, 48px icon tiles with svg; feature on Product Engineering and Cloud, navy on AI-Powered Solutions (white heading, amber icon) (after fix: unstyled) |
| Service card | click / Tab | mouse / keyboard | each opens `/services#product-engineering`, `#ai-analytics`, `#co-creation`, `#staffing`, `#custom-apps`, `#low-code`, `#ai-solutions`, `#cloud`; one Tab stop each | instant | CAP-3 |  ✅ walk + unit test: anchors in order; card 3 → /services#co-creation; Tab reaches each card; the navy card's ring is navy on the paper section (after fix: amber, ~1.6:1) |
| Layout | 1280px / 1079px / 639px / 390px | — | bento 12-col / 2-col (PXP and SXP full width) / 1-col; services 4 / 2 / 1 columns; no sideways scroll | static | CAP-1, CAP-3, EXPERIENCE.md Responsive |  ✅ walk: 1280 bento 12 / services 4; 1079 12 / 2; 899 2 (PXP full width) / 2; 639 and 390 1 / 1; no sideways scroll |
| Layout | exactly 900px / 1080px / 640px | — | wider layout (1.1 switches at ≥) | static | pending: same breakpoint question as 3.1, 3.3, 3.4 — ask Amber/Hoang |  ✅ walk: 900 → 12 cols, 1080 → 4 services, 640 → 2 / 2 (pending) |
| Order | page | — | hero → doors → bento → services → capture band last | static | 3.5 constraint (capture band last) |  ✅ walk + page test: hero > doors > apps > services > capture band |

## Implementation Notes

- 2026-10-05: merged `develop` (3.4 doors); `page.tsx` resolved to hero → doors → bento → services → capture band.
- Ported the prototype `.sec-head`, `.linen`, `.spot`, `.bento`, `.tile`, `.t-*`, `.mini-phone`, `.svc-grid`, `.svc`, `.svc.feature`, `.svc.navy` rules into the Home section of `globals.css` (tokens, `@theme` untouched), reusing 3.4's badges, chips and `.go` and 3.1's `.home-media`. Tile links cover the tile through `h3 a::after` with a tile-wide focus ring; names follow the prototype's `aria-label` ("PXP, Parent eXperience Place"). Phosphor icons per service card and the IoT CPU badge. `homeServices` is now `as const`, so the icon map must cover every card id.
- The "classes must exist in globals.css" check from 3.4 moved into `src/test-utils/css-classes.ts`, used by the doors, bento and service tests.
- Test first: 10 new tests failed, then 644 passed. Writing a test through a script again produced a backspace character; the script's own assertion stopped it before the file was written, and the check now uses `classList`.
- One lint error (nested template literal for the card class) fixed with an array join.

## Review Triage Log

Full `bmad-code-review` (4 layers: Blind Hunter, Edge Case Hunter, Verification Gap, Acceptance Auditor), 2026-10-05:

- Navy service card's focus ring amber on the paper section, ~1.6:1 (three layers) — high, patched: no `--color-focus` override on `.svc.navy` (the prototype has none); the ring is navy on paper. Walk line updated.
- Tile focus ring corners clipped: the link's `::after` inherited the link's radius, not the tile's (two layers) — medium, patched: `border-radius: var(--radius-lg)`; walk measures 24px.
- `undefinedClasses` passed on comments (`.go` in a CSS comment), compounds of other classes (`.field.full`) and unescaped names (Blind Hunter, Edge Case Hunter, Verification Gap) — medium, patched: comments stripped, names escaped, a compound counts only with a class the same element has (`.svc.feature`); own tests in `src/test-utils/css-classes.test.ts`; `utilities` now optional.
- Linen texture painted over the section content — medium, patched: `.linen > *` above the texture.
- Tile names built in code (`${name}, ${full}`), against "no copy baked into logic" — medium, patched: `label` strings in `src/content/home.ts`.
- Full app name read twice (link label + visible `.full`) — low, patched: `.full` is `aria-hidden`.
- Bento tests lost the span checks, the reduced-motion reset and badge text for SXP/LXP — low, patched (CSS assertions and a loop).
- `.t-iot` padding 26px where `--spacing-card-padding-sm` exists — low, patched.
- A click on the PXP phone opens the tile, unlike the prototype (phone above the link) — kept on purpose (CAP-2 "click anywhere on the tile"); CSS comment added.
- PXP and SXP tiles without `spot` — low, rejected: their opaque fills override the glass; the spotlight work is after demo.
- Service cards have no hover feedback — rejected: the prototype's hover is the spotlight glow and lift, a spec non-goal for Demo day.
- Raw sizes (14px gaps, 52px, 210px, phone radii, −150px) — low, rejected: prototype values with no 1.1 token.
- IoT tile is narrow between 900 and 1080px — low, rejected: the prototype has the same layout; the walk at 900px shows no overflow or sideways scroll.
- Exactly 900/1080/640px use the wider layout — pending Amber/Hoang (same as 3.1, 3.3, 3.4).

