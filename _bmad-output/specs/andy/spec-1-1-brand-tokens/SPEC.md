---
id: SPEC-1-1-brand-tokens
owner: Andy
build_day: 2026-10-01
depends_on: []
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../prototype-enhancement/prototype/css/site.css
  - ../../../prototype-enhancement/prototype/index.html
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 1.1: Brand tokens, fonts, surfaces and motion primitives

## Why

Every other story renders on these tokens, so this story blocks the whole team (mandate: Demo day 2026-10-09). Lan, reading on a laptop, must see one navy, amber and white company look with readable type that already supports Vietnamese, and every surface must meet WCAG 2.2 AA from the first page built.

## Capabilities

- **CAP-1**
  - **intent:** Every `DESIGN.md` token and build token is available as a Tailwind v4 `@theme` token.
  - **success:** `src/app/globals.css` `@theme` holds every DESIGN.md token under its mapped name (`--color-*`, `--font-display|brand|body|mono`, `--text-*`, `--radius-*`, `--spacing-*`, `--container-page`); breakpoints 640/900/1080px, z layers, `--ease-brand`, durations, the three shadows and fluid sizes match the Build tokens table; shadcn variables map as in DES > Brand & Style (UX-DR1). The build passes.
- **CAP-2**
  - **intent:** The four brand fonts load fast and support Vietnamese.
  - **success:** Unbounded, Lexend Exa, Be Vietnam Pro and JetBrains Mono load through `next/font` with subsets `latin` and `vietnamese` and `display: swap` (NFR-4); `:lang(vi) h1, :lang(vi) h2` have line-height 1.2; no tightened tracking on Vietnamese uppercase (UX-DR2).
- **CAP-3**
  - **intent:** Amber text and icons on light surfaces are readable.
  - **success:** Amber text or icons on paper, page or mist use `{colors.amber-text}` `#8A6700`; a check finds no text or icon using `#C99700` (AC-A11Y-1).
- **CAP-4**
  - **intent:** Keyboard focus is visible on every section colour.
  - **success:** A focused element on paper, mist, amber and navy shows a 2.5px ring, 3px offset, 8px radius: navy on light and amber, `{colors.focus-on-navy}` on navy (AC-A11Y-2, UX-DR4).
- **CAP-5**
  - **intent:** Icons never slow first paint.
  - **success:** Icons come from a React icon package; no icon set or third-party script blocks rendering (AC-PERF-1).
- **CAP-6**
  - **intent:** Motion respects the visitor and content never depends on JavaScript.
  - **success:** Under `prefers-reduced-motion: reduce` no animation or transition runs and content shows in its final state; with JavaScript off every section is visible (NFR-2).
- **CAP-7**
  - **intent:** Pages use three consistent button variants.
  - **success:** `button-primary` (navy text on amber), `button-navy` (main action on amber) and `button-glass` render with normal and small sizes, 1px-down/0.98 press and 2px hover lift; no button puts white text on amber (UX-DR5).
- **CAP-8**
  - **intent:** Sections pick a scoped surface that sets their text, link and focus colours.
  - **success:** `surface-paper`, `surface-mist`, `surface-navy`, `surface-amber`, `hero-silk`, `hero-light`, `hero-navy`, `hero-amber` apply the DESIGN.md Colors surface table (UX-DR3); container, gutters (16px at 640px and below) and section padding follow the breakpoints (UX-DR26, NFR-6).

## Constraints

- No dependency. Merge the token and font part first (target end of 2026-10-01): every story depends on it.
- Andy owns `src/app/layout.tsx` and the `@theme` block of `src/app/globals.css`. Port the prototype `site.css` values; do not redesign. DESIGN.md and EXPERIENCE.md win over the prototype on conflict.
- Remove the scaffold's dark-mode `prefers-color-scheme` rule and Geist fonts: no dark mode (PRD section 7).
- English only on Demo day (`lang="en"`), but ship the `:lang(vi)` rule and Vietnamese subset now so Story 1.2 needs no token work.
- Next.js 16 App Router: read `node_modules/next/dist/docs/` before using `next/font`. Server Components by default.
- Definition of Done per CLAUDE.md: unit tests with 100% changed-line and 80% branch coverage, smoke, lint, typecheck, format, local Sonar gate, `bmad-code-review`.

## Non-goals

- Scroll-reveal primitive (UX-DR10): after demo.
- Locale routing and EN/VI switch: Story 1.2 (after demo).
- Inner hero aurora, strand ribbon and highlight mark: Story 1.6 (after demo).
- Header (1.3), mobile menu (1.4), footer (1.5), Home silk (3.2).
- Dark mode or a theme switch.

## Success signal

- On https://xiontech-dev.vercel.app the page uses the four brand fonts, navy/amber surfaces and the scoped focus ring when tabbing; with reduced motion on, nothing animates, and DevTools shows no render-blocking icon or third-party script.

## Assumptions

- The icon package is a React package replacing the prototype's Phosphor CDN script; the builder picks a free one.
- shadcn/ui variables are mapped in this story; adding shadcn components is not required by any acceptance criterion.
