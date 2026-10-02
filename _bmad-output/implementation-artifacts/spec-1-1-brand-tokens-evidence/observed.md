# Observed — Story 1.1 (2026-10-01)

Surface: `/` (home placeholder page) served by `npx next start --port 3210` from the production build of commit a02fd2d.

Steps: `npm run build`; start the server; `curl http://localhost:3210` → `home.html`; fetch the page's CSS chunk → `site.css`; grep both.

Seen:
- `home.html`: 0 references to fonts.googleapis.com, fonts.gstatic.com, jsdelivr, unpkg or phosphor. Font `<link rel="preload">` tags point to `/_next/static/media/*.woff2` (self-hosted by next/font).
- `<html lang="en">` carries the four next/font variable classes (unbounded, lexend_exa, be_vietnam_pro, jetbrains_mono).
- `site.css`: `body{… font-family:var(--font-body)}`; `:focus-visible{… outline:2.5px solid var(--color-focus)}` with `outline-offset:3px`; `.surface-navy … --color-focus:var(--color-focus-on-navy)`; a `prefers-reduced-motion:reduce` block; a `:lang(vi)` rule.
- `site.css`: 0 occurrences of `--color-red-500`, `--color-gray-*`, `--color-black` or `--breakpoint-xl` (default palette and breakpoints removed).
- `.btn-primary` = amber-tint→amber gradient with `color:var(--color-navy)`; `.btn:hover` translateY(-2px); `.btn:active` translateY(1px) scale(.98).

Not observed: the focus ring and fonts were not looked at in a real browser window (no browser automation connected); they were verified from the served HTML and CSS only.

## Re-verify after review patches (2026-10-01, commit aa3380a) — real Chrome

Steps: `npm run build`; `next start --port 3210` (an earlier stale server on that port was stopped first — it had been serving a deleted build and returned 500 for the CSS, which a first run of this check wrongly showed as unstyled); Playwright driving installed Chrome (`channel: "chrome"`, headless, 1200×700); two test-only links injected into the live DOM (one `.btn-primary` on the light page, one `.btn-glass` inside a `.surface-navy` block); Tab twice; computed styles read and screenshots taken.

Seen:
- Stylesheet `/_next/static/chunks/1-r5idv5ce2_3.css` → 200 `text/css`, 128 rules parsed.
- body font `"Be Vietnam Pro", "Be Vietnam Pro Fallback", system-ui, sans-serif`; h1 font `Unbounded, …`; `document.fonts` reports Unbounded and Be Vietnam Pro loaded.
- 22 woff2 requests, all from localhost; 0 requests to any other host.
- Focus on the light-surface link: `2px solid rgb(22, 54, 99)` (navy), offset 3px. Focus on the navy-surface link: `2px solid rgb(255, 192, 0)` (amber), offset 3px. Chrome snaps the specified 2.5px outline width to 2px at 1× device pixel ratio. Pill buttons keep their pill radius on focus (same as the prototype, where `.btn` outranks `:focus-visible`).
- Screenshots: `focus-light.png`, `focus-navy.png` (amber ring visible around the navy-surface button).

## Re-capture on `npm run dev` (2026-10-01, commit aa3380a) — as the manual-check bullet asks

Steps: `npx next dev --port 3210` (Turbopack, "Ready in 1310ms"); the same Playwright/Chrome script; the same two test-only links injected into the live DOM (the placeholder page has no focusable element of its own yet); Tab twice.

Seen: body Be Vietnam Pro, h1 Unbounded, both loaded; focus ring navy `rgb(22, 54, 99)` on the light page and amber `rgb(255, 192, 0)` inside `.surface-navy`, offset 3px; 22 woff2 requests to localhost; 0 requests to any other host (no fonts.googleapis.com, no CDN script). Screenshots: `dev-focus-light.png`, `dev-focus-navy.png`.

## Focus ring width and radius at 2x density on `npm run dev` (2026-10-01, commit aa3380a)

Why: the second acceptance audit found that AC 3's 2.5px width and 8px radius were never observed (the 1x probes were pill `.btn` links).

Steps: `npx next dev --port 3210`; Playwright with installed Chrome, `deviceScaleFactor: 2`; four test-only links injected into the live DOM — a plain link and a `.btn-primary` on the light page, a plain link and a `.btn-glass` inside `.surface-navy`; Tab through all four. The JSON now records the URL, `devOverlayPresent` (the Next.js dev overlay element, only present under `next dev`), `devicePixelRatio` and the `:focus-visible` rule text as served.

Seen (`browser-check-dev-2x.json`, `dev2x-*.png`):

- Served rule: `:focus-visible { outline: 2.5px solid var(--color-focus); outline-offset: 3px; border-radius: var(--radius-xs); }`.
- Plain links: radius 8px, offset 3px; navy `rgb(22, 54, 99)` on light, amber `rgb(255, 192, 0)` on navy.
- Pill buttons keep their 9999px radius (the `.btn` rule wins over the base rule), same colours and offset.
- Width: Chrome computes `outlineWidth: 2px` even at 2x, and paints 4 device px (= 2 CSS px), measured at the middle column of each plain-link screenshot. So Chrome floors the authored 2.5px to 2px. The 2.5px width is in the CSS but is not what Chrome draws.
- Fonts loaded (Be Vietnam Pro, Unbounded); 22 woff2 from localhost; 0 external requests.
