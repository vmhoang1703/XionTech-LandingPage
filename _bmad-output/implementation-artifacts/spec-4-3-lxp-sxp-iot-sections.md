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
| `#lxp` | page load | — | mist gradient with linen texture; centred navy LXP badge, H2 "A calm place to learn.", lede, chips Students and Web app | static | CAP-1, prototype | test: LXP surface and copy; look pending (controller) |
| `#lxp` features | read | — | four features: 4 columns from 1080px, 2 columns from 641px, 1 below; Lessons, Assignments, Progress, Feedback, each with an icon and one line | static | CAP-1, prototype (fixed in review: 4 columns from 641px were too narrow) | test: four features per section; columns pending (controller) |
| `#sxp` | page load | — | navy surface with the faint grid; browser frame left, text right from 900px (text first below 900px and in reading order); amber SXP badge, H2 "One workspace for the whole school.", chips Staff, Teachers, Leaders; white heading, light text | static | CAP-1, prototype | test: SXP surface and copy, text before frame, amber badge; look pending (controller) |
| `#sxp` features | read | — | four features in two columns, amber icons: Attendance and records, Classes, Communication, Leader dashboards | static | CAP-1, prototype | test: four features per section |
| `#iot` | page load | — | paper surface; centred IoT badge with a chip icon, H2 "A campus you run from one screen.", lede, four cards (Classroom AV, Lighting and climate amber tint, Access, Energy navy), browser frame below | static | CAP-1, prototype | test: IoT surface and copy; look pending (controller) |
| Browser frame | page load | — | paper frame, 20px radius, mist bar with three dots and a mono URL pill, 16:10 empty media frame with a faint navy grid and a `[Placeholder]` caption; no `<img>` | static | CAP-1, CAP-3, EXPERIENCE.md Browser frame | test: empty frames, no img; look pending (controller) |
| URL pill | read | — | `[Placeholder] lxp.xiontechs.com`, `[Placeholder] sxp.xiontechs.com`, `[Placeholder] iot.xiontechs.com` | static | CAP-2, A1 | test: pill text and link |
| URL pill | click or Enter | mouse, keyboard | opens a new tab (`target="_blank"`, `rel="noopener noreferrer"`); temporary href `#` | instant | CAP-2, A1 | test (attributes); new tab pending (controller) |
| URL pill | tap | touch, pen | opens a new tab | instant | CAP-2 | pending (controller, touch); pen not checked |
| URL pill | screen reader | — | accessible name "[Placeholder] lxp.xiontechs.com (opens in a new tab)" (same for SXP, IoT) | — | CAP-2, EXPERIENCE.md Browser frame | test: accessible name |
| URL pill | hover | mouse | underline | instant | prototype `a.bar-url:hover` | pending (controller) |
| URL pill | Tab | keyboard | visible 2px navy focus ring and underline, also inside the navy `#sxp` | instant | EXPERIENCE.md Focus ring, T9 | pending (controller) |
| URL pill | size | touch | at least 24px high | static | Accessibility Floor (targets ≥ 24×24) | pending (controller) |
| URL pill | width 320px | — | address ends in an ellipsis inside the frame; frame not wider than the screen | static | EXPERIENCE.md Responsive (fixed in review) | pending (controller) |
| Section heading | `/products#lxp`, `#sxp`, `#iot` from sub-nav, mega menu or URL | any | heading fully visible below header and sub-nav (section at 144px) | smooth | AC-NAV-5, 4.1 CAP-3 | test: anchor class and ids; position pending (controller) |
| Feature lists, cards | width 640px or less | — | one column; no sideways page scroll | static | EXPERIENCE.md Responsive (640px) | pending (controller) |
| IoT cards | 1080px / 640–1079px | — | 4 columns / 2 columns | static | Story 3.5 `.svc-grid` | pending (controller) |
| Page | any | — | no link to `#updates`; `#pxp` stub still present | — | T5, Story 4.2 | test: no Updates link; sections per pill |

## Implementation Notes

- Test first: `npx vitest run src/app/products src/components/products` failed (the new component file did not exist; the page test "renders PXP, LXP, SXP and IoT sections in order" failed with `expected null not to be null`), then 26 passed. The old "every sub-nav link has a heading" test now asks for the level-2 heading, because `#iot` also has four `h3` cards.
- Files: `src/components/products/products-web-apps.tsx` (+ test), `src/content/product-links.ts` (new), `src/content/products.ts`, `src/app/products/page.tsx`, `src/app/products/page.test.tsx`, `src/app/globals.css` (Story 4.3 block before the 4.1 sub-nav block).
- **Merge with Story 4.2 (built at the same time):** the PXP stub stays. `productsSections` now holds only the PXP stub; 4.2 removes it and the stub map in `page.tsx`. Store links go into `src/content/product-links.ts` (one place, A1); if 4.2 made its own file, move them into this one.
- **URL pill href is `#`**, the prototype's temporary value (A1). With `target="_blank"` it opens `/products` in a new tab. Replace it in `product-links.ts` when the real addresses are confirmed.
- **IoT audience chips** "School staff" and "Facilities": the prototype's `#iot` has none, but CAP-1 asks for an audience in each section; the words come from the Products mega menu (`nav-data.ts`, "School staff and facilities").
- **SXP badge is amber** (`b-pxp`) as in the prototype: the navy `b-sxp` badge would vanish on the navy surface.
- Feature-list copy, ledes and titles are the prototype text; `EXPERIENCE.md` says product descriptions and feature lists were confirmed by the business on 2026-09-28, so they carry no `[Placeholder]`. The frame captions (`[Placeholder] LXP screenshot` …) and the web addresses do.
- `.sec.products-anchor` restores the full section padding; 4.1's `.products-anchor` padding is for the stubs. `.browser` fixes `--color-focus` to navy, so the pill's focus ring stays visible on the paper frame inside the navy `#sxp`.
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

## Verification

- `npm run lint && npm run typecheck && npm run format:check` — pass (0 problems).
- `npm test` — 43 files, 706 tests passed.
- `npm run test:coverage && npm run coverage:diff` — diff coverage 100% (24 lines, 0 missing); C1 ok (5 changed files ≥ 80% branches). Three `test:coverage` runs hit timeouts in two old tests while other worktrees loaded the machine (`scripts/eslint-config.test.mjs` 129–211s vs 120s; `site-nav.test.tsx` 5.1–5.4s vs 5s); both pass alone (eslint config 52s). The coverage report was then made with `npx vitest run --coverage --testTimeout=300000`: 706 passed.
- Build, smoke and browser walk: pending (controller) — Turbopack rejects this worktree's `node_modules` junction.
