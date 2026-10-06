---
title: 'Story 1.5: Site footer'
type: 'feature'
created: '2026-10-01'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** There is no site footer. Visitors need Products, Services and Company links, both real offices (Plano first, then the HCMC Vietnam Delivery Center), the Privacy policy link and the GET IT DONE tag at the foot of every page (FR-7). Contract: `_bmad-output/specs/sammy/spec-1-5-site-footer/SPEC.md` (CAP-1 to CAP-4).

**Approach:** Port the prototype footer (`prototype-enhancement/prototype/js/site.js` footer markup, `css/site.css` footer rules) to a Server Component `src/components/layout/site-footer.tsx`. Office data lives once in `src/content/offices.ts` so Stories 2.2 and 6.4 can reuse it; footer copy and links live in `src/content/site-footer.ts`. Style with the Story 1.1 token class names (`bg-ink`, `text-on-navy-muted`, `text-amber-tint`, `font-brand`, `sm:`/`md:` breakpoints = 640/900px); 1.1 is not merged yet, so the styles take effect when it lands. Story 1.1 not being merged is accepted (Sammy README: write markup and content before 1.1 merges). Do not mount the footer in `src/app/layout.tsx` (Andy, T3). No `#updates` link (T5).

</frozen-after-approval>

## UX checks

Added before the PR (docs/ux-checks.md: a story in progress adds the table before its PR). Sources: story spec `spec-1-5-site-footer/SPEC.md` (CAP-1 to CAP-4), `EXPERIENCE.md`, `DESIGN.md`, decisions T3/T5. Checked column filled by the walk in `spec-1-5-site-footer-evidence/` (footer mounted locally for the walk only; Andy mounts it, T3).

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Footer | page load | — | ink background, white logo plate, blurb, Products / Services / Company / Offices headings in amber-tint caps | static | CAP-1, CAP-4, DESIGN.md Site footer | ✅ walk 1280 (ink rgb(11,23,48), plate rgb(253,253,254), headings rgb(255,207,6)) |
| Products column | read | — | PXP, LXP, SXP, IoT Device Management → `/products#pxp` `#lxp` `#sxp` `#iot`; no "Product updates" | static | CAP-1, T5 | ✅ walk + unit test; 0 `#updates` links |
| Services column | read | — | 5 services → their `/services#…` anchors, then "All services" → `/services` | static | CAP-1 | ✅ walk + unit test |
| Company column | read | — | About, Core values, FAQ, News, Careers, Contact → `/about`, `/about#values`, `/about#faq`, `/news`, `/careers`, `/demo` | static | CAP-1 | ✅ walk + unit test |
| Offices | read | — | Plano first with address, phone, WhatsApp, email; then Ho Chi Minh City with "Vietnam Delivery Center" tag, address, phone; no "Head office", no Da Nang | static | CAP-2 | ✅ walk + unit test |
| Plano phone | click | mouse | `tel:+14693229899` link | instant | CAP-2 | ✅ walk |
| WhatsApp | click | mouse | opens `https://wa.me/14694399345` in a new tab; accessible name ends "(opens in a new tab)" | instant | CAP-2, EXPERIENCE.md new-tab rule | ✅ walk (`_blank`, `noopener noreferrer`) |
| Email | click | mouse | `mailto:vinni.tran@newxion.com` | instant | CAP-2 | ✅ walk |
| HCMC phone | click | mouse | `tel:+84908107552` | instant | CAP-2 | ✅ walk |
| Footer link | hover | mouse | text turns white | instant | DESIGN.md Site footer (prototype `li a:hover`) | ✅ walk (rgb(197,208,227) → white) |
| Footer link | Tab | keyboard | visible amber focus ring (focus-on-navy) on every link, in reading order | instant | EXPERIENCE.md Focus ring | ✅ walk, after fix (was navy rgb(22,54,99); now amber rgb(255,192,0)) |
| Bottom bar | read | — | "© 2026 XionTechs · Privacy policy" (→ `/privacy`) and GET IT **DONE** with DONE in amber | static | CAP-3 | ✅ walk + unit test (DONE rgb(255,192,0)) |
| Layout | 1280px | — | 5 columns (logo + 4) | static | CAP-4 | ✅ walk, 5 columns |
| Layout | 899px | — | 2 columns | static | CAP-4, EXPERIENCE.md Responsive (900px and below) | ✅ walk, 2 columns |
| Layout | 639px / 390px | — | 1 column, no sideways scroll | static | CAP-4, EXPERIENCE.md Responsive (640px and below) | ✅ walk, 1 column, no sideways scroll |
| Links | size | touch | every link target at least 24px tall | static | EXPERIENCE.md Accessibility Floor (24 x 24) | ✅ walk, after fix (was 19px; smallest now 24px) |

## Implementation Notes

- Test first: `npx vitest run src/components/layout` failed (no `./site-footer` module), then passed 7/7 after the component was added.
- Files: `src/components/layout/site-footer.tsx` (+ test), `src/content/offices.ts` (shared office data for 2.2 and 6.4), `src/content/site-footer.ts` (copy and links), `public/brand/xiontechs-logo.png` (copied from UX `imports/xiontechs-logo.png`, a business-supplied brand input, 250x46).
- Classes use the Story 1.1 token names from DESIGN.md "Build mapping" (`bg-ink`, `text-on-navy-muted`, `text-amber-tint`, `font-brand`, `text-label-sm`, `px-gutter`, `max-w-page`, `sm`=640/`md`=900 breakpoints). Until 1.1 merges they render unstyled. Tailwind breakpoints are min-width, so 640px and 900px exactly get the wider layout (prototype used max-width); 1px difference accepted.
- Column headings are `h2` (prototype used `h4`) so the outline does not skip levels.
- Footer is not mounted; Andy mounts it in `src/app/layout.tsx` (T3).
- Checks: lint, typecheck, format:check, `npm run test:coverage` (100% statements/branches), `npm run test:smoke` (build + `/` 200) all passed.

- UX walk 2026-10-03 (`spec-1-5-site-footer-evidence/walk.mjs`, Chrome, footer mounted locally only): two lines failed and were fixed test-first. The focus ring was navy on the ink footer (now `--color-focus` = focus-on-navy, as `.surface-navy` does), and text links were 19px tall (now `min-h-6`, 24px). Red: `npx vitest run src/components/layout` 2 failed; green: 76 passed.

## Review Triage Log

- Footer not mounted — false: mounting is Andy's (T3), a spec non-goal.
- Links to pages not built yet — false: spec requires final paths.
- "Contact" points to /demo — false: spec CAP-1.
- Hard-coded "© 2026" — false: spec assumption.
- Personal email on newxion.com — false: business-supplied fact (2026-09-29).
- HCMC has only a phone — false: spec CAP-2.
- No `<nav>` landmark — low, deferred (deferred-work.md).
- Key collisions — low, rejected: no duplicate hrefs or lines exist.
- Missing negative tests — low, rejected: branch coverage already 100%.
- `column()` helper re-renders — low, rejected: one call per test.
- Logo size and source — false: PNG is 250x46, a business brand input from UX imports.
- `siteFooter` untyped / translation comment — low, rejected; the comment states a spec constraint.
- `overflow-wrap:anywhere` on the whole address — medium, patched: scoped to contact links as in the prototype.

Light review of the UX fix (31 lines, Edge Case Hunter, 2026-10-03):
- `--ring` not overridden in the footer — false: no ring-styled (shadcn) control is in the footer; links use the global `:focus-visible` outline from `--color-focus`.
- Target-size test passes with zero text links — low, patched: asserts more than 20 text links.
- Focus test checks the class string only — false: the computed amber outline is proven by the walk (`walk-output.txt`, rgb(255,192,0)).

