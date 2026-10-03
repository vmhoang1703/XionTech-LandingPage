---
title: 'Story 3.3: Stats band inside the hero'
type: 'feature'
created: '2026-10-04'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The Home hero must end with five confirmed figures so a visitor judges the team without scrolling (FR-12; figures confirmed 2026-09-28), and the band must be one shared component Services (5.2) and About (6.4) feed with their own figures. Contract: `_bmad-output/specs/sammy/spec-3-3-stats-band/SPEC.md` (CAP-1 to CAP-4).

**Approach:** `src/components/sections/stats-band.tsx` takes a label, figures and a tone as data (amber suffix on navy, amber-text on light, a `[Placeholder]` flag per figure), rendered at the bottom of the 3.1 hero. Built first on 2026-10-01 before 1.1 merged; the 2026-10-04 comparison with the prototype `.stats` / `.stat` rules found the label without 1.1's `.label` class, a fixed figure size instead of the fluid stat token, a divider and padding on the first figure, and no caption width, fixed here. 5/3/2 columns use 1.1's breakpoints (≥ 1080 / ≥ 640).

</frozen-after-approval>

## UX checks

Sources: story spec CAP-1 to CAP-4, `DESIGN.md` (stats-band, UX-DR13), prototype `index.html` (`.hero-stats`) and `site.css` (`.stats`, `.stat`). Checked by the walk in `spec-3-3-stats-band-evidence/`.

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Band | page load, 1280px | — | at the bottom of the Home hero, inside the first screen: label "Experience you can count on" in Lexend Exa caps with the amber rule, a line above the figures | static | CAP-1, prototype `.hero-stats` |  ✅ walk: band ends at 872px of 900; Lexend Exa caps, amber rule rgb(255,192,0); 1px line above (after fix: plain caps, no rule) |
| Figures | read | — | 25+ / 24/7 / 20+ / 8 / 2 with the captions from the prototype, in that order | static | CAP-1 |  ✅ walk + unit test: 25+ / 24/7 / 20+ / 8 / 2 with the five captions, in order |
| Figures | read | — | Unbounded 700, fluid size `clamp(2rem, 3.6vw, 3rem)`, white (heading on navy); suffix in amber | static | CAP-2, UX-DR13, prototype `.stat .n` |  ✅ walk + unit test: Unbounded 700, 46px at 1280 (fluid), white; suffix rgb(255,192,0) (after fix: was fixed 3rem) |
| Captions | read | — | muted on-navy text, at most 22ch wide | static | prototype `.stat p` |  ✅ walk + unit test: rgb(197,208,227), max-width 22ch (after fix: no limit) |
| Dividers | 1280px | — | thin border between figures; none before the first | static | prototype `.stat`, `.stat:first-child` |  ✅ walk + unit test: borders 0 1 1 1 1 (after fix: first had one) |
| Layout | 1280px | — | 5 columns | static | CAP-4 |  ✅ walk: 5 columns |
| Layout | 1079px | — | 3 columns, 28px between rows | static | CAP-4 |  ✅ walk: 3 columns, row gap 28px |
| Layout | 639px / 390px | — | 2 columns, no dividers; no sideways scroll | static | CAP-4, prototype `@media (max-width:640px)` |  ✅ walk: 2 columns, borders 0 at 639 and 390, no sideways scroll |
| Values | screen reader | — | the final values are read ("25+", "24/7"); no count-up | static | CAP-3 |  ✅ markup: figures are plain text ("25" + "+"), no count-up; group named by the label |
| Shared use | data | — | a figure with `placeholder` shows "[Placeholder] …"; tone "light" uses the amber-text suffix | static | CAP-2, A2 |  ✅ unit tests (placeholder caption, light tone amber-text) |
| Layout | exactly 1080px / 640px | — | 5 / 3 columns (1.1 switches at ≥) | static | pending: spec says 3 columns "at 1080px and below" and 2 "at 640px and below"; 1.1 breakpoints switch at ≥ site-wide — ask Amber |  ✅ walk: 5 columns at 1080, 3 at 640 (pending Amber) |

## Implementation Notes

- 2026-10-04: merged `develop` (3.1, 3.2 and the 1.6 motion part); one conflict in `home-hero.test.tsx`, both tests kept.
- Compared with the prototype `.stats` / `.stat` rules and fixed test-first: the label uses 1.1's `.label` (amber rule), figures use `text-stat-fluid` and `text-heading`, the first figure has no divider or left padding (`sm:first:`), captions are at most 22ch. The hero's stats wrapper uses `.wrap`. Red: 2 failed (after first fixing a typo in the new tests that made them fail for the wrong reason); green: 625 passed.


## Review Triage Log

- Full `bmad-code-review` (4 layers) ran on 3.1–3.6 together on 2026-10-01; its 3.3 findings were fixed then (read-only props).
- Light review of the 2026-10-04 fix (32 lines, Edge Case Hunter):
  - In 3 columns, the fourth figure starts row two with a divider — low, rejected: the prototype does the same (`.stat:first-child` only), and the spec says port, not redesign; the walk confirms borders 0 1 1 1 1 at 1079px like the prototype.
  - More than 5 figures would put a divider at the start of row two in 5 columns — low, rejected: no caller passes more than 5 (Home 5; Services and About specs list 4–5).
  - At exactly 640px `.wrap` uses the mobile gutter while `sm:` padding applies — low, rejected: it comes from Story 1.1's shared `.wrap` rule, not this diff.
