# Story 1.3 — what was observed

Date: 2026-10-01. Code: branch `feature/1-3-desktop-header` at ba8857e.

## How

- Surface: every page's header; checked on `/`, `/about`, `/services#process`, `/demo#form`.
- Server: the `next dev` (Turbopack) already running for this repo on http://localhost:3000 (a second `next dev` on port 3210 refused to start: "Another next dev server is already running"). The dev overlay element was present, so this was the dev server, serving the working tree of this branch.
- Browser: Playwright driving installed Chrome (headless), viewport 1280×800, then 1000 and 600 wide. Script: keyboard Tab/Enter/Escape, real clicks, computed styles read from the live DOM. Output: `browser-check.json`.

## Seen

- First Tab focuses "Skip to content" (`href="#main"`): amber `rgb(255, 192, 0)` background, navy text, radius 9999px (pill), at 16px/12px, focus outline `2px solid rgb(22, 54, 99)`. Enter moves focus to `MAIN#main`. Screenshot: `skip-link.png`.
- Header: 72px, `position: sticky`, z-index 50, `backdrop-filter: blur(16px) saturate(1.7)`. On `/` no nav item is current.
- Click Products: `aria-expanded="true"`, panel shown as a 660px grid with two 312px columns, footer row spans `1/-1`. Screenshot: `products-open.png`. Escape: panel hidden, `aria-expanded="false"`, focus back on Products.
- Open Products, then click Services: Products hidden, Services shown (`services-open.png`). Click outside the nav: Services hidden.
- Services → "See the process" lands on `/services#process` and the panel is hidden after the navigation. Book a demo lands on `/demo#form`. Both pages show Not found until their stories land, as the spec says.
- 1000px wide: nav `display: none`, Book a demo shown. 600px wide: nav and Book a demo `display: none`, logo 26px high (`header-600.png`).
- `/about`: About has `aria-current="page"`, weight 700, navy `rgb(22, 54, 99)`, bottom border `2px solid rgb(255, 192, 0)`.

## Noticed, not part of the checks

- Mega product and service names render in the body font, not Unbounded 600 as in the prototype; the "for" lines are not Lexend Exa uppercase; an open trigger has no mist pill background. Left to the step-04 review.

## Re-verify after the review patches (2026-10-01, commit 6011653)

How: `npx next dev --port 3210` (the earlier server on port 3000 had stopped; dev overlay present), Playwright with installed Chrome at 1280×800, then 1000 and 600 wide, plus a second browser context with JavaScript disabled. Output: `browser-check-2.json`.

Seen:

- Skip link as before (amber pill, 2px navy ring); after Enter, `main#main` has focus and `outline-style: none`.
- Products open: product names in Unbounded 600; "for" lines in Lexend Exa, uppercase, letter-spacing 1.39px (0.14em of 0.62rem); the open trigger has the mist background `rgb(238, 242, 249)` (`products-open-2.png`).
- Escape closes Products with focus back on it. With Products open, focus on "All products" then Tab: focus moves to Services and the Products panel is hidden.
- Hovering News: mist background, radius 9999px, 40px high.
- Services/outside-click/navigation/breakpoints as before (`services-open-2.png`, `header-600-2.png`).
- `/about`: About is current, bold navy, underline drawn as `inset 0 -2px 0 rgb(255, 192, 0)`.
- JavaScript disabled: header, skip link, `main#main` and the page text render; both mega panels are hidden; 17 links are in the nav markup (`no-js.png`).
- Verification commands (`verification-2.txt`): the first lint/typecheck/format run failed on Prettier because the working copy of `globals.css` had CRLF line endings (the committed file was already LF; `prettier --write` changed nothing git could see); the re-run exits 0.
