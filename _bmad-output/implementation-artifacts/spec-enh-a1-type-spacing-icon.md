---
title: 'E-A1 calmer type, tighter spacing and the site icon'
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

**Problem:** The prototype (`_bmad-output/prototype-enhancement/prototype/css/site.css`) now uses light headings, tighter sections and an X-mark tab icon, while `develop` still renders the 700/600 weights, 112px sections and the Next.js scaffold favicon. Every page task in the 2026-10-07 catch-up plan builds on these shared tokens, so they change first. Planned spec: `_bmad-output/specs/andy/spec-enh-a1-type-spacing-icon/SPEC.md` (ENH-004/006/009 spacing parts, ENH-025, ENH-038, ENH-039, ENH-040, ENH-056 icon part).

**Approach:** Change the `@theme` tokens and the hard-coded weights in `src/app/globals.css` to the prototype's values, load Unbounded 300 and 400, change the nav's bold classes to 500, and add `src/app/icon.png` and `src/app/apple-icon.png` (Next.js 16 metadata file convention) in place of `src/app/favicon.ico`.

Decisions (lead, 2026-10-08, all plan defaults): Q2 — the prototype's weights and spacing override `DESIGN.md`; Amber updates `DESIGN.md` after the demo. Demo day is now 2026-10-16.

Values:
- Weights: page and section headings (`--text-display-hero*`, `--text-display-page`, `--text-headline*`) 300; card titles (`--text-title-lg/md/sm`, `--text-news-title`) and stats (`--text-stat*`) 400; buttons (`--text-button*`) and plain `h3`/`h4` 500. Hard-coded 600/700 rules in `globals.css` become 500, except card-title rules, which become 400 where the prototype sets 400 (`.svc h3`, `.tile h3`, `.ncard h3`, `.step4 h3`, `.value h3`, `.office-card h3`, `.form-ok h3`, `.role-main b`, `.faq summary`, `.badge`). Inline `b`/`strong` stays 600. `font-semibold`/`font-bold` in `site-nav.tsx` and `mobile-menu.tsx` become `font-medium`.
- Rhythm: page titles line height 1.04, letter spacing -0.04em; section headings 1.06 and -0.035em; card titles 1.3 and -0.02em. Every page H1 already uses `.page-hero h1` (`--text-display-page`) or, on Home, `--text-display-hero-fluid`; both get the page-title rhythm (ENH-038).
- Spacing: `--spacing-section` 112px → 64px, `--spacing-section-mobile` 80px → 48px, `--spacing-section-head-gap` 48px → 24px, `.sec-head` gap 14px → 20px.

</frozen-after-approval>

## Implementation Notes

UX checks (`docs/ux-checks.md`), written before coding. Source P = prototype `site.css` line.

| # | Part | State / action | Input | Visible result | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Page H1 (all inner pages) | load | none | Unbounded 300, line height 1.04, letter spacing -0.04em | static | P142, P1290 || yes: test + browser |
| 2 | Home hero H1 | load | none | Unbounded 300, 1.04, -0.04em | static | P162 || yes: test + browser |
| 3 | Section H2 | load | none | weight 300, line height 1.06, -0.035em | static | P1099 || yes: test + browser |
| 4 | Card titles (services, news, values, offices, form success; steps at 400 and 1.3 only, as in the prototype) | load | none | weight 400, line height 1.3, -0.02em | static | P1029, P1100 || yes: test |
| 5 | Stats numbers | load | none | weight 400 | static | `.stat .n` || yes: test |
| 6 | Buttons | load | none | weight 500 | static | `.btn` || yes: test |
| 7 | Sections | load at 1280px / 390px | none | 64px / 48px top and bottom padding | static | P54, P527 || yes: test + browser |
| 8 | Section head | load | none | 20px between heading and description, 24px under the head | static | P55 || yes: test |
| 9 | Header nav links | load, current page | mouse, keyboard | weight 500, current link 500 with amber underline | static | P1295-1296 || yes: by hand (screenshot) |
| 10 | Mobile menu button | load at 390px | touch | weight 500 | static | ENH-025 || yes: by hand (screenshot) |
| 11 | Browser tab | load any page | none | X-mark icon; `<link rel="icon">` and `<link rel="apple-touch-icon">` in `<head>`, no `/favicon.ico` link | static | ENH-056 || yes: smoke test + browser |
| 12 | Anchored headings | `/products#…`, `/services#…` | link | heading lands fully visible below the header | scroll | AC-NAV-5 || yes: browser: /services#process top 188px, /products#iot 284px, header bottom 72px |
| 13 | All routes at 390px and 1280px | load | none | no overlap, no sideways scroll | static | Constraints || yes: browser: 9 routes, no sideways scroll |

Tests: `src/app/type-scale.test.ts` written first and seen failing (18 of 18, `npx vitest run src/app/type-scale.test.ts`), then passing. `src/lib/design/contrast.test.ts` lists the Q2 overrides by exact token name. Browser check on `next start` at 1280px and 390px for 9 routes (H1 300 / 1.04, section H2 300 / 1.06, sections 64px / 48px, icon links, no sideways scroll).

Decisions: base `h3, h4` 500, `main h3` 1.3 and `b, strong` 600 follow the prototype's global rules (`site.css:1290-1294`, `1100`). Unbounded loads 300, 400, 500, 600 (700 dropped: nothing uses it). Mega-menu titles keep `font-medium` (500) as the spec says.

## Review Triage Log

Full `bmad-code-review`, 4 layers, 2026-10-08.

- patch (medium): icon `<link>` tags only checked by file presence → `e2e/smoke.spec.ts` asserts `rel="icon"` `/icon.png`, `rel="apple-touch-icon"` `/apple-icon.png`, no `favicon.ico`.
- patch (low): Unbounded 700 loaded but unused → removed.
- patch (medium): DESIGN.md override regex also skipped unchanged tokens → exact list of changed names.
- patch (low): 600 test depended on exact whitespace and missed `bold`/800/900 → normalised and widened.
- patch (low): UX row 4 listed steps with -0.02em; the prototype gives `.step4 h3` none → row corrected.
- false: global `h3/h4` 500, `main h3` 1.3 and `b` 600 are too broad → the prototype has exactly these rules.
- false: Demo date not in AGENTS.md → PR #71 changes it.
- rejected (spec): nav links 500 not 450, mega-menu titles 500 → the spec says 500.
- false: page-hero and capture padding unchanged → not in the spec's scope.
- false: UX table unchecked → checked above before the PR.
