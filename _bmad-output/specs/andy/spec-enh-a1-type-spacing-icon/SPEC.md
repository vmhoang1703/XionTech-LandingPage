---
id: SPEC-ENH-A1-type-spacing-icon
owner: Andy
build_day: 2026-10-08
depends_on: []
companions:
  - ../../enhancement-2026-10-07/README.md
  - ../../decisions-2026-10-01.md
  - ../../../prototype-enhancement/prototype/css/site.css
  - ../../../prototype-enhancement/prototype/design-system.html
  - ../../../prototype-enhancement/prototype/assets/favicon-32.png
  - ../../../prototype-enhancement/prototype/assets/favicon-192.png
  - ../../../prototype-enhancement/prototype/assets/apple-touch-icon.png
sources:
  - ../../../prototype-enhancement/enhancement-log.md
---

# E-A1 Calmer type, tighter spacing and the site icon

Covers: ENH-004 (spacing part), ENH-006 (spacing part), ENH-009 (heading gap part), ENH-025, ENH-038,
ENH-039, ENH-040 (heading rhythm part), ENH-056 (site icon part).

## Why

Every page in the prototype uses lighter headings and tighter section spacing, and the browser tab
shows the XionTech X. This task changes the shared tokens once so the page tasks build on the right
base. **Merge it first.**

## Capabilities (Tier 1)

- **CAP-1 Weights.** In `globals.css` `@theme`, following the prototype (`site.css:1290-1294` and the
  card rules such as `.svc h3`):
  - Page and section headings (`--text-display-hero*`, `--text-display-page`, `--text-headline*`)
    change from 700/600 to **300**.
  - Card titles (`--text-title-lg`, `--text-title-md`, `--text-title-sm`, `--text-news-title`) and stats
    (`--text-stat*`) change to **400** (the prototype's `.scard-title` is 400).
  - Buttons (`--text-button`, `--text-button-sm`) and plain `h3`/`h4` change to **500**.
  - Hard-coded `font-weight: 600|700` rules in `globals.css` change to 500, except card titles (400).
    Inline bold stays 600.
  - The `font-semibold` and `font-bold` classes in `site-nav.tsx` and `mobile-menu.tsx` change to 500.
- **CAP-2 Fonts.** Unbounded also loads weights 300 and 400 (`layout.tsx`), so the browser does not
  fake them.
- **CAP-3 Heading rhythm.**
  - Page titles: line height 1.04, letter spacing -0.04em.
  - Section headings: 1.06 and -0.035em.
  - Card titles: 1.3 and -0.02em.
  - Every page H1 uses the one page-title style (ENH-038).
- **CAP-4 Spacing.**
  - `--spacing-section` changes from 112px to 64px, and from 80px to 48px on phones.
  - The gap under a section heading changes from 48px to 24px.
  - The gap between a heading and its description changes from 14px to 20px.
- **CAP-5 Site icon.**
  - Add `src/app/icon.png` (from `favicon-192.png`) and `src/app/apple-icon.png` (from
    `apple-touch-icon.png`), following the Next.js 16 metadata file conventions in
    `node_modules/next/dist/docs/`.
  - Delete the scaffold `src/app/favicon.ico`.

## Constraints

- Blast radius: every heading, stat, button and section on all routes.
  - Check each route at 390px and 1280px for overlaps, and for sticky or anchor offsets after the
    spacing change.
  - Anchored headings must still land fully visible (`--spacing-anchor-offset`, AC-NAV-5 tests).
- Decision Q2: the prototype overrides `DESIGN.md`; Amber updates `DESIGN.md` after the demo.
- Definition of Done from `CLAUDE.md`.

## Open questions

- Q2: default "prototype wins". If the answer is no, drop CAP-1 to CAP-4; the site icon still ships.

## Success signal

On the preview, headings read light (300), card titles 400, sections are visibly tighter, and the tab
shows the X.

## Request to paste

```
/bmad-build _bmad-output/specs/andy/spec-enh-a1-type-spacing-icon — E-A1 headings 300, card titles and stats 400, buttons 500; Unbounded 300/400; heading rhythm; 64/48px sections; X site icon. Branch feature/enh-a1-type-spacing-icon from an up-to-date develop. Merge first: every other enhancement task builds on it.
```
