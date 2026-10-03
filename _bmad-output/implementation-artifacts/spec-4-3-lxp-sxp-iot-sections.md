---
title: 'Story 4.3: LXP, SXP and IoT sections'
type: 'feature'
created: '2026-10-03'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `/products` has heading-only stubs at `#lxp`, `#sxp` and `#iot` (Story 4.1). A school principal comparing apps needs each web app's audience, four features and a browser frame with a mono URL pill that opens the app in a new tab; surfaces mist with linen, navy with grid, paper (FR-17, UX-DR17). Contract: `_bmad-output/specs/andy/spec-4-3-lxp-sxp-iot-sections/SPEC.md` (CAP-1 to CAP-3), decisions A1 and T5.

**Approach:** Server Components `LxpSection`, `SxpSection`, `IotSection` and a shared `BrowserFrame` in `src/components/products/products-web-apps.tsx`, composed by `src/app/products/page.tsx` in place of the three stubs; the PXP stub stays for Story 4.2. Copy (confirmed by the business 2026-09-28) lives in `src/content/products.ts`. The three `[Placeholder]` web addresses live in a new `src/content/product-links.ts`, the one place Story 4.2 also puts its store links (A1). Each section keeps its id and the `products-anchor` class (144px landing). The frame body is the existing empty media frame (`.home-media`), never an `<img>`. `globals.css` gets a small block for `.browser`, `.feature-list` and the centred section head, ported from the prototype `site.css`.

</frozen-after-approval>

## UX checks

Sources: story spec CAP-1 to CAP-3, decisions A1 and T5, `EXPERIENCE.md` (Component Patterns › Browser frame and Media frame, Responsive & Platform, Accessibility Floor), prototype `products.html#lxp/#sxp/#iot` and `site.css` (`.browser`, `.feature-list`). Checked by the unit tests in `src/components/products/products-web-apps.test.tsx` and `src/app/products/page.test.tsx`, or by the controller in a browser (pending).

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| `#lxp` | page load | — | mist gradient with linen texture; centred navy LXP badge, H2 "A calm place to learn.", lede, chips Students and Web app | static | CAP-1, prototype | ✅ Chrome 1280: `surface-mist linen`, mist gradient, H2 navy; test: surface and copy. Linen texture: class test only |
| `#lxp` features | read | — | Lessons, Assignments, Progress, Feedback with icons; 4 columns from 1080px, 2 from 641px, 1 at 640 and below | static | CAP-1, prototype | ✅ Chrome: 4 at 1280/1080, 2 at 900/641, 1 at 640/390/320 (fixed in review: a duplicate 4.2 `.feature-list` rule had forced 2) |
| `#sxp` | page load | — | navy surface with the faint grid; frame first in the markup; frame left, text right from 900px; text above the frame below 900px; amber SXP badge, white H2 "One workspace for the whole school.", chips Staff, Teachers, Leaders | static | CAP-1, prototype; lead 2026-10-03 (same pattern as PXP) | ✅ Chrome: frame left at 1280/1080/900 (x 44 vs 668 at 1280), text above at 899/641/640/390/320; H2 white; test: frame first in the markup |
| `#sxp` features | read | — | four features in two columns, amber icons: Attendance and records, Classes, Communication, Leader dashboards | static | CAP-1, prototype | test: names and lines; icon colour: class test only |
| `#iot` | page load | — | paper surface; centred IoT badge with a chip icon, H2 "A campus you run from one screen.", lede, four cards (Classroom AV, Lighting and climate amber tint, Access, Energy navy), browser frame below | static | CAP-1, prototype | ✅ Chrome 1280: `surface-paper`, H2 navy; test: cards and variants. Tints: class test only |
| Browser frame | page load | — | paper frame, 20px radius, mist bar with three dots and a mono URL pill, 16:10 empty media frame with a faint navy grid and a `[Placeholder]` caption; no `<img>` | static | CAP-1, CAP-3, EXPERIENCE.md Browser frame | test: caption, no img, classes; look: screenshots `lxp-1280.png`, `sxp-1280.png`, `iot-1280.png` |
| URL pill | read | — | `[Placeholder] lxp.xiontechs.com`, `[Placeholder] sxp.xiontechs.com`, `[Placeholder] iot.xiontechs.com` in mono | static | CAP-2, A1 | ✅ Chrome 1280; test: labels |
| URL pill | click, Enter, tap | mouse, keyboard, touch | while the address is the stand-in `PLACEHOLDER_HREF`: a disabled label, not a link — nothing happens, no new tab, not in the Tab order; a real address becomes a link that opens a new tab with `rel="noopener noreferrer"` (lead, 2026-10-03; replaces CAP-2's new-tab wording for stand-in addresses) | instant | CAP-2, A1 | ✅ Chrome: click at 1280 and tap at 390 open 0 tabs, no scroll; 0 pills in the Tab order; test: disabled labels; `UrlPill` with a real URL renders the new-tab link. Pen not checked |
| URL pill | screen reader | — | stand-in: plain text (`aria-disabled` is a style hook; not announced on a `span`); real address: name ends "(opens in a new tab)" | — | CAP-2 | test: no link for the stand-in; real-URL name |
| URL pill | hover | mouse | stand-in: not-allowed cursor, no underline; real link: underline | instant | prototype `a.bar-url:hover`; lead 2026-10-03 | ✅ Chrome 1280 (stand-in): `not-allowed`, no underline |
| URL pill | size | touch | at least 24px high | static | Accessibility Floor (targets ≥ 24×24) | ✅ Chrome: 24px at every width |
| URL pill | width 320px | — | address ends in an ellipsis inside the frame; frame not wider than the screen | static | EXPERIENCE.md Responsive | ✅ Chrome 320: pill 202px with ellipsis, frame 288px, no sideways scroll |
| Section heading | `/products#lxp`, `#sxp`, `#iot` from sub-nav, mega menu or URL | any | heading fully visible below header and sub-nav (section at 144px) | smooth | AC-NAV-5, 4.1 CAP-3 | ✅ Chrome 1280: sub-nav, direct URL and mega menu put each section at 144px, H2 at 326–330px; 390: `#iot` H2 at 294px, `#sxp` H2 at 298px |
| Feature lists | width 640px or less | — | one column; no sideways page scroll | static | EXPERIENCE.md Responsive (640px) | ✅ Chrome 640/390/320 |
| IoT cards | 1080px / 640–1079px / below 640 | — | 4 / 2 / 1 columns (Story 3.5 `.svc-grid`) | static | Story 3.5 `.svc-grid` | ✅ Chrome: 4 at 1280/1080, 2 at 900–640, 1 at 390/320 |
| Page | any | — | no link to `#updates`; no stub sections left | — | T5 | test (page) |

## Implementation Notes

- Test first: `npx vitest run src/app/products src/components/products` failed (the new component file did not exist; the page test "renders PXP, LXP, SXP and IoT sections in order" failed with `expected null not to be null`), then 26 passed. The old "every sub-nav link has a heading" test now asks for the level-2 heading, because `#iot` also has four `h3` cards.
- Files: `src/components/products/products-web-apps.tsx` (+ test), `src/content/product-links.ts` (new), `src/content/products.ts`, `src/app/products/page.tsx`, `src/app/products/page.test.tsx`, `src/app/globals.css` (Story 4.3 block before the 4.1 sub-nav block).
- **Merged onto Story 4.2:** one `product-links.ts` (with `PLACEHOLDER_HREF`), `productsSections` and the stub map are gone, the page renders the four real sections, and one `.feature-list` rule styles both PXP (`div` items) and the web apps (`li` items).
- **URL pill:** while the address is `PLACEHOLDER_HREF` it is a disabled label (`span.bar-url[aria-disabled]`), not a link (lead, 2026-10-03). A real address in `product-links.ts` turns it into a new-tab link.
- **IoT audience chips** "School staff" and "Facilities": the prototype's `#iot` has none, but CAP-1 asks for an audience in each section; the words come from the Products mega menu (`nav-data.ts`, "School staff and facilities").
- **SXP badge is amber** (`b-pxp`) as in the prototype: the navy `b-sxp` badge would vanish on the navy surface.
- Feature-list copy, ledes and titles are the prototype text; `EXPERIENCE.md` says product descriptions and feature lists were confirmed by the business on 2026-09-28, so they carry no `[Placeholder]`. The frame captions (`[Placeholder] LXP screenshot` …) and the web addresses do.
- Every Products section has `.sec`, so the stub-only `padding-block` on `.products-anchor` is removed. `.browser` fixes `--color-focus` to navy, so a real pill link keeps a visible ring inside the navy `#sxp`.
- The URL pill has `min-height: 24px` (prototype: about 18px) for the 24px target size.
- No new Next.js API: plain Server Components and an `<a>` for the external link.
- Lint first failed on `sonarjs/prefer-read-only-props` (3 helpers); props are now `Readonly<…>`.
- `undefinedClasses` (shared test helper) proves every class the sections use is defined in `globals.css`.

## Review Triage Log

One layer (Blind Hunter, 19.8 kB code diff, floor 5, 11 findings):

- URL pill `#` opens a useless new tab — low, rejected: CAP-2 and A1 ask for a link that opens a new tab with a temporary value; the success signal clicks it. Replace the href in `product-links.ts` when real.
- URL pill clipped on 320–360px phones (pill about 232px in a 288px frame) — medium, patched: `min-width: 0`, ellipsis, 24px line height.
- `.feature-list-4` 4 columns from 641px are too narrow — low, patched: 2 columns from 641px, 4 from 1080px, like `.svc-grid`.
- Icon maps typed `Record<string, Icon>` let a renamed feature id crash at render — medium, patched: keyed by the content's id union.
- LXP/SXP feature names are `<b>`, IoT's are `<h3>` — low, rejected: ported from the prototype; heading-navigation gain is small and the fix restyles all lists.
- SXP frame before the H2 in reading order — medium, patched: text first in the DOM, frame shown left from 900px with `order: -1`.
- `.sec.products-anchor` is an order-dependent patch — low, patched: comment says to drop it when 4.2 removes the stub.
- No tests for linen, grid, SXP amber badge, IoT badge name — low, patched: tests added.
- SXP amber badge looks like PXP's — maybe-false: the prototype chooses `b-pxp` on purpose; only Amber can say if she wants a different SXP badge on navy. Listed as an open question, not deferred.
- Build, smoke and walk still pending — false: the controller runs them in the main checkout (Turbopack rejects this worktree's junction).
- `Icon` type from `@phosphor-icons/react` next to `/ssr` imports — false: `service-cards.tsx` does the same; type-only import.

Full `bmad-code-review` on 2026-10-03 after rebasing onto Story 4.2 (9334b19), 5 layers. Security: clean. Acceptance: CAP-1 to CAP-3 met.

- patch (merge): one `product-links.ts`; no stubs left; duplicate `.feature-list` rules (4.2's later copy forced LXP to 2 columns from 1080px) merged into one; stub-only section padding removed.
- patch (lead decisions, 2026-10-03): a stand-in URL pill is a disabled label (the triage line above that rejected this is reversed); SXP frame first in the markup like PXP, text above it below md; the business confirmed product feature copy on 2026-09-28 (EXPERIENCE.md), so the PXP feature lines lose `[Placeholder]` and only "iOS and Android" stays marked.
- patch: `FeatureList` ties the icon map to the section's feature ids at compile time; spec table and notes rewritten from the walk; the two rows that disagreed about IoT cards at 640px now follow Story 3.5 (2 columns).
- defer (Minor, `deferred-work.md`): layout is checked only by the walk (no browser test project); only `#` exactly counts as a stand-in; a label and its href can drift (a real href with a `[Placeholder]` label); the linen, grid, tints and frame details are class tests plus screenshots.
- open for Amber: the SXP badge uses the amber PXP style because the navy SXP badge would vanish on the navy surface.

## Verification

- `npm run lint && npm run typecheck && npm run format:check` — pass (0 problems).
- `npm test` — 43 files, 706 tests passed.
- `npm run test:coverage && npm run coverage:diff` — diff coverage 100% (24 lines, 0 missing); C1 ok (5 changed files ≥ 80% branches). Three `test:coverage` runs hit timeouts in two old tests while other worktrees loaded the machine (`scripts/eslint-config.test.mjs` 129–211s vs 120s; `site-nav.test.tsx` 5.1–5.4s vs 5s); both pass alone (eslint config 52s). The coverage report was then made with `npx vitest run --coverage --testTimeout=300000`: 706 passed.
- Build, smoke and browser walk ran in the main checkout (Turbopack rejects this worktree's `node_modules` junction): `npm run build` passes, `npm run test:smoke` 7 passed; walk script and output in `spec-4-3-lxp-sxp-iot-sections-evidence/` (run: `OUT=<folder> BASE_URL=http://localhost:3000 node walk.mjs` with Chrome installed).
