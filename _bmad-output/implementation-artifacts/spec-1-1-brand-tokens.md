---
title: 'Story 1.1: Brand tokens, fonts, surfaces and motion primitives'
type: 'feature'
created: '2026-10-01'
status: 'done'
baseline_commit: '93c384218766d4fd4e4f7d211f814f65ff6bdd4f'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The app still has the create-next-app theme (Geist, black/white, dark mode). Every Demo-day story renders on brand tokens that do not exist yet, so Sammy is blocked until they land (target merge: end of 2026-10-01). Source contract: `_bmad-output/specs/andy/spec-1-1-brand-tokens/SPEC.md` (CAP-1..CAP-8, Demo-day slice; scroll-reveal UX-DR10 is after demo).

**Approach:** Port the DESIGN.md tokens and the prototype `site.css` foundations into Tailwind v4 `@theme` plus a small base/component layer in `globals.css`, load the four brand fonts with `next/font/google` (latin + vietnamese, `display: swap`), and add an automated contrast/amber check so the AA rules are tested, not just stated.

## Boundaries & Constraints

**Always:** Every DESIGN.md token in `@theme` under its mapped name (colors `--color-*`, families `--font-display|brand|body|mono`, typography `--text-*` with `--line-height`/`--letter-spacing`/`--font-weight` sub-keys, rounded `--radius-*`, spacing `--spacing-*`, container `--container-page`) plus the Build tokens table (breakpoints 640/900/1080, z layers, `--ease-brand`, durations, 3 shadows, fluid sizes). Semantic text tokens (`heading`, `text`, `muted`, `border`, link, focus) are overridable per surface so utilities follow the section. Port prototype values; DESIGN.md wins on conflict. `lang="en"` on Demo day, but ship the `:lang(vi)` H1/H2 rule and the vietnamese subset. Server Components only.

**Never:** Dark mode or `prefers-color-scheme`; Geist; any `<link>`/`<script>` to a font or icon CDN; white text on amber; `#C99700` (amber-decor) as a text or icon colour; scroll-reveal (after demo); header, menu, footer or silk (other stories); installing shadcn/ui components.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| Token contrast | Each text/icon pair listed in DESIGN.md Colors | Ratio ≥ 4.5 (text) or ≥ 3 (icons, focus ring, field border) | Test fails naming the pair and ratio |
| Amber-decor misuse | Any `src/**` file using `#C99700` or `amber-decor` in a text/fill/stroke class | Check fails | Test lists file and line |
| Reduced motion | `prefers-reduced-motion: reduce` | No animation or transition runs | N/A |
| No JavaScript | JS disabled | All content visible (nothing hidden waiting for JS) | N/A |

</frozen-after-approval>

## Code Map

- `src/app/globals.css` -- replace scaffold: `@theme` tokens, `:root` semantic + shadcn variable mapping, base (body font, headings, `:focus-visible` ring, `:lang(vi)`), reduced-motion rule, components (`.btn`, `.btn-primary|navy|glass|sm`, surfaces `.surface-paper|mist|navy|amber`, `.hero-silk|light|navy|amber` backgrounds + scoped vars, `.wrap`, `.sec`, `.label`, `.lede`, `.skip` base). Reference: prototype `prototype-enhancement/prototype/css/site.css` lines 1–60, 94–120, 422–470.
- `src/app/layout.tsx` -- swap Geist for `Unbounded`, `Lexend_Exa`, `Be_Vietnam_Pro` (weights 400/500/600/700 + italic 400), `JetBrains_Mono` via `next/font/google`, each with a CSS `variable`; keep `metadata` and `lang="en"`.
- `src/app/layout.test.tsx` -- update the `next/font/google` mock to the four fonts; keep existing assertions.
- `src/app/page.tsx` -- replace `text-foreground/70` (no longer exists) with brand tokens; keep the `[Placeholder]` text.
- `src/lib/design/contrast.ts` (new) -- WCAG relative-luminance contrast helper + token reader that parses `@theme` colours from `globals.css`.
- `src/lib/design/contrast.test.ts` (new) -- AA pair table from DESIGN.md + amber-decor scan of `src/`.
- `AGENTS.md` -- tech stack table: add Icons row (`@phosphor-icons/react`, installed by the first story that renders an icon).
- Do not touch: `scripts/`, `_bmad*`, `e2e/`, config files.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/design/contrast.ts` -- add `contrastRatio(hexA, hexB)` (handles `#RRGGBB` and `#RRGGBBAA` over a given background) and `readThemeColors(css)` -- needed by the token tests and by Story 7.3 later
  - red: `src/lib/design/contrast.test.ts` -- known pairs (navy on paper 11.86, white on amber 1.64) return the documented ratios
- [x] `src/app/globals.css` -- write all tokens, semantic/surface scopes, base, reduced-motion, button and layout classes -- CAP-1, 3, 4, 6, 7, 8
  - red: `src/lib/design/contrast.test.ts` -- every DESIGN.md token name is present in `@theme`; every listed AA pair passes; no `amber-decor`/`#C99700` used for text, fill or stroke in `src/`
- [x] `src/app/layout.tsx` -- load the four fonts with `subsets: ['latin','vietnamese']`, `display: 'swap'` and variables consumed by `--font-*` -- CAP-2
  - red: `src/app/layout.test.tsx` -- html carries all four font variable classes and `lang="en"`
- [x] `src/app/page.tsx` -- use brand tokens only -- build stays green with the default palette removed
- [x] `AGENTS.md` -- record the icon package decision -- CAP-5 (no icon is rendered in this story)

**Acceptance Criteria:**
- Given the built CSS, when inspected, then all DESIGN.md and Build tokens exist under their mapped names and no default Tailwind colour palette remains.
- Given any page, when rendered, then there is no third-party font or icon `<link>`/`<script>` and fonts are self-hosted by `next/font`.
- Given a focusable element inside `.surface-navy` or a navy hero, when focused, then the ring is amber; elsewhere navy, 2.5px, 3px offset, 8px radius.
- Given the three button classes on light, navy and amber surfaces, when rendered, then no button has white text on amber and hover lifts 2px, press moves 1px down at 0.98.

### Review Findings

Code review of commit e249282 (local Sonar fixes in `src/lib/design/contrast.ts`), 2026-10-01. Layers: Blind Hunter, Edge Case Hunter, Verification Gap, Acceptance Auditor.

- [x] [Review][Patch] No `readThemeColors` test reads an 8-digit `#RRGGBBAA` value, so the optional alpha group this commit edited is untested; if it broke, `--color-border: #1636631f` would be read as opaque `#163663` and no test would fail [src/lib/design/contrast.test.ts:99]

Rejected:

- `false` — `colorLineRegex` has no end boundary, so `#1234567` is read as `#123456` (blind-hunter+edge-case-hunter): every `@theme` colour (39 DESIGN.md tokens + `--color-link`) is also compared by full value in the parity tests, which read `globals.css` with `readThemeVars`; a 7- or 9-digit typo fails those tests, so it cannot pass silently.
- `false` — shorthand `#RGB` is skipped silently (edge-case-hunter): same parity tests; `#fff` ≠ the DESIGN.md value and fails.
- `false` — uppercase token names keep their case (edge-case-hunter): CSS custom properties are case-sensitive, so `--color-Brand` and `--color-brand` are different properties; keeping the case matches the browser.
- `false` — no proof the Sonar gate passes (blind-hunter): the `pre-push` hook runs the gate and blocks the push until it is green.
- `low` — commit message leaves out the Sonar rule keys (blind-hunter): cosmetic; fixing it means rewriting a commit.
- `low` — the hex pattern is written twice (blind-hunter): the two have different jobs (anchored validator vs extractor); a shared constant is new abstraction for a drift the parity tests already catch.
- `false` — the `i` flag now does two jobs (blind-hunter): tests use `#FDFDFE` and `#FFC000`, so removing `i` fails them.
- `false` — `exec` on a reused regex (blind-hunter): `colorLineRegex` has no `g` or `y` flag, so `exec` keeps no state between lines.
- `false` — no ledger row for this change (blind-hunter): rows for e249282 and `verification-3.txt` were added.
- `false` — Acceptance Evidence older than HEAD (acceptance-auditor): the 3 Verification commands were re-run at e249282 (`verification-3.txt`).
- Verification Gap: no gaps found.

## Design Notes

Semantic colours must be real `@theme` variables (not `@theme inline`) so `.surface-navy { --color-heading: var(--color-on-navy-heading) }` re-themes `text-heading` utilities inside the section. Font families point at the `next/font` variables set on `<html>`, e.g. `--font-display: var(--font-unbounded), system-ui, sans-serif`. Remove the default palette with `--color-*: initial;` before defining brand colours, so off-brand colours fail at build time instead of in review. Buttons and surfaces are CSS classes (work on `<a>` and `<button>`, zero JS), not React components.

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: no errors
- `npm run test:coverage && npm run coverage:diff` -- expected: all tests pass, C0 100% on changed lines, C1 ok
- `npm run build && npm run test:smoke` -- expected: build passes, smoke 200 with "XionTech"

**Manual checks:**
- `npm run dev`: page uses Be Vietnam Pro body text; Tab shows the navy ring; DevTools Network shows no fonts.googleapis.com or CDN script request.

## Implementation Notes

## Spec Change Log

## Review Triage Log

| # | Source | Finding | Verdict | Evidence | Route |
|---|---|---|---|---|---|
| 1 | task-1 minor + edge | `contrastRatio` returns 1 for invalid hex; non-hex digits of valid length parse to NaN | medium | `parseHexColor` checks length only; silent fallback hides a bad token in a test (CLAUDE.md: no silent swallow) | patch: throw on invalid hex |
| 2 | task-1 minor + edge | `readThemeColors` matches `@themeFoo {` and commented-out `--color-*` lines | low | regex has no word boundary and does not strip `/* */`; direct correction | patch |
| 3 | task-1 minor + blind | test comment says transparent composites to black; code composites over white | low | `contrast.ts` white base; assertion still correct | patch (comment) |
| 4 | blind | AA pairs miss heading/page, placeholder+error on page/mist, focus+field-border on page | medium | `AA_PAIRS` lacks these pairs; page is the body background | patch: add pairs |
| 5 | blind + edge (claim) | `h1` renders in the body font, not the display font | medium | base layer sets `font-family` for `h2` only; DESIGN.md: Unbounded for hero and section headlines | patch: display font for h1 (and h3, h4 per card titles) |
| 6 | edge | `:lang(vi) h1, h2 { line-height: 1.2 }` sits in `@layer base`, so any `text-*` utility on a heading overrides it | medium | Tailwind layer order theme, base, components, utilities; `text-4xl` sets line-height | patch: rule must win over size utilities |
| 7 | edge | `--destructive` not re-scoped on navy surfaces | low | DESIGN.md: error text on navy uses error-on-navy; one-line direct fix | patch |
| 8 | blind | `--breakpoint-*: initial` removes `xl`/`2xl` with no note | low | future `xl:` classes emit nothing silently; comment is a direct fix | patch: comment in globals.css |
| 9 | verification-gap | no test asserts the home paragraph uses `text-muted` | low | pre-verified; unknown classes emit no CSS | patch: assertion in page.test.tsx |
| 10 | edge | no-JS guard misses `visibility: collapse` | low | regex matches `hidden` only; direct correction | patch |
| 11 | blind | no `docs/ai-log.md` entry for this story | low | AGENTS.md asks for one; controller adds it with the commit | patch (controller) |
| 12 | acceptance | `epic-1-context.md` under `_bmad*` is in the diff | false | written by bmad-build step 1 (compile epic context), not by an implementer; committed separately as a workflow artifact | rejected |
| 13 | acceptance | manual Tab-focus check recorded as done but not seen in a browser | — | evidence finding, not code; handled in Re-verify with a real browser check | evidence |
| 14 | blind | `DESIGN.md` path in the test has a dated folder | low | unlikely to move before demo; fix adds indirection | rejected |
| 15 | blind | "Andy owns" vs author Hoang Vu | false | Andy is Hoang Vu | rejected |
| 16 | blind + task-2 minor | `BUILD_TOKENS` names/values hand-copied in the test | low | developer-only drift, caught by the test after the fact; fix is a restructure | rejected |
| 17 | blind | `.btn*`, `.label`, `.lede`, `.skip` have no rendering test | low | button rules verified in served CSS evidence; first use is Story 1.3/3.x | rejected |
| 18 | edge | amber-decor guard misses declarations split across lines | low | Prettier keeps declarations on one line; fix adds complexity | rejected |
| 19 | edge (claim) | page `h1` uses Tailwind `text-4xl`, not a brand size token | low | placeholder page, replaced by Story 3.1 on 2026-10-02 | rejected |
| 20 | task-3 minor | Be Vietnam Pro loads italic at 400–700 | low | next/font weight×style cross-product; accepted trade-off | rejected |
| 21 | security | clean | — | no entry point, secret or dependency change | — |

## Acceptance Evidence

Re-captured in step-04 after the review patches (commit aa3380a) on 2026-10-01; the 3 Verification commands were run again at e249282 (local Sonar fixes, same behaviour). The step-03 set is kept in the ledger as history.

**Commands**

- `npm run lint && npm run typecheck && npm run format:check` -- exit 0 -- All matched files use Prettier code style!
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- Tests 126 passed (126); Coverage: 100%; C1 ok
- `npm run build && npm run test:smoke` -- exit 0 -- ✓ Compiled successfully; 1 passed

**Observed**

- `npm run dev` (Turbopack, dev overlay present) in real Chrome at 2× density: body Be Vietnam Pro, h1 Unbounded, both loaded; 22 woff2 from localhost, 0 external requests -- browser-check-dev-2x.json
- AC 3 on `npm run dev`: plain links get radius 8px and offset 3px, navy `rgb(22, 54, 99)` on the light page and amber `rgb(255, 192, 0)` inside `.surface-navy`; pill `.btn` links keep their 9999px radius -- browser-check-dev-2x.json, dev2x-plain-light.png, dev2x-plain-navy.png
- AC 3 width: the served rule is `outline: 2.5px solid var(--color-focus)`, but Chrome computes 2px and paints 4 device px (= 2 CSS px) at 2× -- Chrome floors the 2.5px to 2px -- browser-check-dev-2x.json, dev2x-plain-light.png
- Same fonts, focus colours, offset and 0 external requests at 1× on `npm run dev` and on `next start` -- browser-check-dev.json, browser-check.json

**Artifacts**

- [verification-3.txt](spec-1-1-brand-tokens-evidence/verification-3.txt) -- 781 bytes -- sha256 c55678320738 -- real output of the 3 Verification commands at e249282
- [verification-2.txt](spec-1-1-brand-tokens-evidence/verification-2.txt) -- 2651 bytes -- sha256 988f4fb36c00 -- real output of the 3 Verification commands after the patches (LF line endings, as committed)
- [browser-check-dev-2x.json](spec-1-1-brand-tokens-evidence/browser-check-dev-2x.json) -- 1327 bytes -- sha256 87de5bdb26c0 -- npm run dev at 2× density: URL, dev overlay, served :focus-visible rule, fonts, four focus rings, requests
- [dev2x-plain-light.png](spec-1-1-brand-tokens-evidence/dev2x-plain-light.png) -- 5330 bytes -- sha256 28b373208f5d -- plain link on light, navy ring, 8px radius
- [dev2x-plain-navy.png](spec-1-1-brand-tokens-evidence/dev2x-plain-navy.png) -- 16384 bytes -- sha256 9baae09538df -- plain link on navy, amber ring, 8px radius
- [dev2x-btn-light.png](spec-1-1-brand-tokens-evidence/dev2x-btn-light.png) -- 19315 bytes -- sha256 75fad084e8fa -- primary pill button on light, navy ring
- [dev2x-btn-navy.png](spec-1-1-brand-tokens-evidence/dev2x-btn-navy.png) -- 32777 bytes -- sha256 925b2a1083c9 -- glass pill button on navy, amber ring
- [browser-check-dev.json](spec-1-1-brand-tokens-evidence/browser-check-dev.json) -- 662 bytes -- sha256 6f41cd294ca6 -- npm run dev at 1×: fonts, focus rings, requests (same bytes as browser-check.json: same values, no URL field)
- [dev-focus-light.png](spec-1-1-brand-tokens-evidence/dev-focus-light.png) -- 43756 bytes -- sha256 7ec7590ae333 -- npm run dev at 1×: focus on the light-surface button (dev indicator visible)
- [dev-focus-navy.png](spec-1-1-brand-tokens-evidence/dev-focus-navy.png) -- 43791 bytes -- sha256 4273e6368279 -- npm run dev at 1×: amber focus ring on the navy-surface button
- [browser-check.json](spec-1-1-brand-tokens-evidence/browser-check.json) -- 662 bytes -- sha256 6f41cd294ca6 -- next start at 1×: fonts, focus rings, requests
- [focus-light.png](spec-1-1-brand-tokens-evidence/focus-light.png) -- 41407 bytes -- sha256 a49cd319231e -- next start: focus on the light-surface button
- [focus-navy.png](spec-1-1-brand-tokens-evidence/focus-navy.png) -- 41441 bytes -- sha256 9b0cfc7be21d -- next start: amber focus ring on the navy-surface button
- [observed.md](spec-1-1-brand-tokens-evidence/observed.md) -- 4861 bytes -- sha256 5737b15b394e -- what was observed and how, incl. both dev-server captures

**Not captured**

- The focusable elements were test-only links injected into the live DOM (on both `next start` and `npm run dev`), because the placeholder page has no focusable element of its own yet; Story 1.3 adds the real header links.
- A painted 2.5px focus ring: Chrome draws 2px. The CSS holds 2.5px as AC 3 asks; whether to keep 2.5px or move to a value Chrome can draw (2px or 3px) is a design decision for the human. 2px still meets WCAG 2.2 AA (3:1 contrast) and the AAA 2px minimum.
