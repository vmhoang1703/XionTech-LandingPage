---
title: 'Dark mode for the whole site'
type: 'feature'
created: '2026-10-15'
status: 'in-progress'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '15ed030922de8d6eb666ad41e2a98a7b5f03c569'
context:
  - '{project-root}/AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The site is light-only. Hoang Vu and Sammy want a dark theme for every page (decided 2026-10-15), overriding `DESIGN.md` ("There is no dark mode", Don't: "add a dark mode toggle").

**Approach:** Redefine the colour tokens under `html[data-theme="dark"]`, set before first paint by an inline script (saved choice, else `prefers-color-scheme`). A sun/moon toggle in the header switches and remembers the theme. Then fix the hard-coded colours page by page.

## Boundaries & Constraints

**Always:**
- Light mode stays pixel-identical: every light rule keeps its value, and dark rules only add overrides.
- Dark palette (approved preview):
  - page `#0b1730`, paper/cards `#12213f`, mist `#0f1d38`, ice `#1e4178`;
  - headings `#ffffff`, text `#eef2f9`, muted `#c5d0e3`, placeholder `#9fb0cc`;
  - border `#ffffff24`, field border `#6f8fc1`;
  - link `#ffcf06`, focus `#ffc000`, amber-text `#ffd84a`;
  - highlight `#ffc000` with `#0b1730` text;
  - amber buttons keep navy text.
- WCAG AA contrast in both themes (axe `color-contrast` passes on every page type).
- No flash of the wrong theme: the inline script runs before paint, and `<html>` gets `suppressHydrationWarning`.
- The toggle is a real `<button>` with `aria-pressed` and a translated accessible label in en, vi, ja, fr, ko and zh. AI translations are flagged by re-running `npm run i18n:review`.
- Storage follows the `motion-preference.ts` pattern: key `xt-theme`, `"dark"`/`"light"`, try/catch, no stored value means follow the OS.
- Theme changes are instant (no colour transition) and honour reduced motion.
- `DESIGN.md`, `AGENTS.md` and `docs/ai-log.md` record the override in the same PR.
- **Decision (Q1, logo):** the header nav pill stays white in dark mode and the logo is untouched.
- **Decision (Q2, bands):** bands that are navy or ink in light mode use brand navy `#163663` in dark mode, with a 1px `#ffffff24` top and bottom edge, so the section rhythm stays visible.
- **Decision (Q3, toggle):** on desktop (header with the full nav), the toggle is a separate round button outside the nav pill, directly to its right. On phones and tablets (mobile-menu sizes), it is a row inside the Menu sheet, and the phone header pill is unchanged.

**Never:**
- No change to light-mode values, copy, layout or motion.
- No new dependency (no next-themes).
- Don't retune the WebGL hero shader or replace photos or screenshots in this PR.
- Never store anything other than the theme choice.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| First visit, OS dark | no `xt-theme`, OS dark | page paints dark on first frame | N/A |
| First visit, OS light | no `xt-theme`, OS light | light, identical to today | N/A |
| Toggle | click the toggle | theme flips instantly, saved, `aria-pressed` updates | N/A |
| Saved choice beats OS | `xt-theme=light`, OS dark | light | N/A |
| OS changes, no saved choice | OS switches while open | page follows the OS | N/A |
| Storage blocked | localStorage throws | follows the OS; toggle still works for the visit | try/catch, no error |
| No JavaScript | script disabled | `@media (prefers-color-scheme: dark)` fallback applies the dark tokens | N/A |
| Locale switch / client nav | change language or page | theme kept, no flash | N/A |

</frozen-after-approval>

## Code Map

- `src/app/[locale]/layout.tsx:46-90` -- `<html>` at line 54. Add `suppressHydrationWarning` and the inline theme script in `<head>`. No CSP exists (`next.config.ts`, `src/proxy.ts`), so an inline script is allowed.
- `src/app/global-not-found.tsx:19-24` -- its own `<html>`; needs the same script.
- `src/lib/motion/motion-preference.ts` -- pattern to copy for `src/lib/theme/theme-preference.ts` (`THEME_KEY = "xt-theme"`, read/save in try/catch).
- `src/components/layout/site-header.tsx:27,54-55` -- `.nav-pill` is hard-coded `bg-white/95 border-white/80` and stays white (Q1). The desktop toggle is a sibling after the pill, not inside it, so `site-header.test.tsx:90` (language is `pill.lastElementChild`) and `e2e/header-language.spec.ts` (phone) stay valid. Hide it at mobile-menu sizes.
- `src/components/layout/mobile-menu.tsx`, `language-menu.tsx` -- literal colours. The phone toggle is a row in the Menu sheet; update the focus-trap tests in `mobile-menu.test.tsx:97,276-330` for the new focusable item.
- `src/i18n/shell.ts:31,69,108…` -- add `theme: { toDark, toLight }` for all six locales. Checks: `shell.test.ts`, `registry-coverage.test.ts`, `scripts/i18n/untranslated.test.mjs`, `scripts/i18n/review.test.mjs` (re-run `npm run i18n:review`, commit `docs/translations/*-review.md`).
- `src/app/globals.css`:
  - `@theme static` at line 9 (tokens);
  - `:root` at lines 236-269;
  - surfaces `.surface-paper` 414, `-mist` 418, `-navy` 426, `-amber` 441;
  - second token block at 484-530.

  Add one `html[data-theme="dark"]` token block, plus a `@media (prefers-color-scheme: dark) { html:not([data-theme="light"]) … }` copy for no-JS. Then add dark overrides for the literal hotspots:
  - `.door-products .chip` 1681;
  - `.flip-face` 1980;
  - `.scard` 2306;
  - `.art-pill` 2610;
  - `.step4 .art` 3095;
  - `.rm-pin`, `.road-dialog-body` 3563-4065;
  - `.about-hero` ~4445;
  - `.app-card` 4958;
  - `.home-flow` 5083;
  - `.svc-card` 5622;
  - `#process .dot` 5714;
  - `.apply-bar` 6097;
  - `.loc-card` 6588-6726;
  - `.life-cap` 7816;
  - `.dv-card`, `.gain-card` 8178-8347.
- `src/components/careers/gain-cards.tsx`, `src/components/sections/three-layer-stack.tsx` -- SVG literals. Switch them to `currentColor` or CSS variables.
- Do not touch: `public/**` images, `src/components/home/hero-silk.tsx` shader colours. `src/app/type-scale.test.ts` and `mobile.test.ts` parse `globals.css`, so keep existing rules in place and append the dark overrides.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/theme/theme-preference.ts` (+ test) -- `readTheme()`, `saveTheme()`, `THEME_SCRIPT` (inline string) -- one source for the script and the toggle
  - red: `src/lib/theme/theme-preference.test.ts` -- saved choice beats OS; blocked storage falls back to OS
- [ ] `src/app/[locale]/layout.tsx`, `src/app/global-not-found.tsx` -- inline script in `<head>`, `suppressHydrationWarning` -- no flash
  - red: `src/app/[locale]/layout.test.tsx` -- the head contains the theme script
- [ ] `src/components/layout/theme-toggle.tsx` (+ test), `site-header.tsx`, `mobile-menu.tsx` -- sun/moon button with `aria-pressed`, follows the OS until clicked; desktop: separate button right of the pill; phone: row in the Menu sheet
  - red: `theme-toggle.test.tsx` -- click flips `data-theme`, saves, and updates `aria-pressed`
- [ ] `src/i18n/shell.ts` + `docs/translations/*-review.md` -- toggle labels in six locales
  - red: `src/i18n/shell.test.ts` -- every locale has the theme labels
- [ ] `src/app/globals.css` -- dark token block, no-JS media copy, header pill stays white, navy bands lifted with an edge, hotspot overrides
- [ ] `src/components/careers/gain-cards.tsx`, `three-layer-stack.tsx` -- literals switched to variables
- [ ] `e2e/dark-mode.spec.ts` (`@a11y`) -- every page type in dark: axe colour-contrast passes, no flash (`data-theme` set at DOMContentLoaded), toggle kept across navigation
  - red: same file -- dark home has no contrast violations
- [ ] `_bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md`, `AGENTS.md`, `docs/ai-log.md` -- record the override and the dark palette

**Acceptance Criteria:**
- Given any page in light mode, when compared with `develop` screenshots at 1280 and 390px, then they match.
- Given dark mode, when axe runs on Home, About, Products, Services, News, a story, Careers, a job, Contact, Privacy and 404, then there are no colour-contrast violations.
- Given dark mode at 390px and 1280px, when each page is viewed, then no light-background panel with light text or dark text on a dark panel remains (screenshot review).

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: pass
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: C0 100%, C1 ≥ 80%
- `npm run test:smoke` and `npm run test:a11y` -- expected: all pass (including `dark-mode.spec.ts`)
- `npm run i18n:review` -- expected: committed review pages unchanged after a re-run
- `npm run build` -- expected: pass

**Manual checks:**
- Screenshots of every page in both themes at 390 and 1280px.
- Toggle by mouse, keyboard and touch.
- Lighthouse mobile Home is not lower than on `develop`.

- 2026-10-15: user asked for "quick dev, no testing for now" after task 1. Tasks 2-8 were built directly without the per-task loop. Open: 8 unit tests in `site-header.test.tsx` and `mobile-menu.test.tsx` expect the old header (pill as the header's direct child, phone links last in the menu); `e2e/dark-mode.spec.ts` not written; step-04 review not run. Dark pages checked by axe colour-contrast and screenshots only.
