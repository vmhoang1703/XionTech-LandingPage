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

**Approach:** Port the prototype footer (`mockups/site-v3/js/site.js` footer markup, `css/site.css` footer rules) to a Server Component `src/components/layout/site-footer.tsx`. Office data lives once in `src/content/offices.ts` so Stories 2.2 and 6.4 can reuse it; footer copy and links live in `src/content/site-footer.ts`. Style with the Story 1.1 token class names (`bg-ink`, `text-on-navy-muted`, `text-amber-tint`, `font-brand`, `sm:`/`md:` breakpoints = 640/900px); 1.1 is not merged yet, so the styles take effect when it lands. Story 1.1 not being merged is accepted (Sammy README: write markup and content before 1.1 merges). Do not mount the footer in `src/app/layout.tsx` (Andy, T3). No `#updates` link (T5).

</frozen-after-approval>

## Implementation Notes

- Test first: `npx vitest run src/components/layout` failed (no `./site-footer` module), then passed 7/7 after the component was added.
- Files: `src/components/layout/site-footer.tsx` (+ test), `src/content/offices.ts` (shared office data for 2.2 and 6.4), `src/content/site-footer.ts` (copy and links), `public/brand/xiontechs-logo.png` (copied from UX `imports/xiontechs-logo.png`, a business-supplied brand input, 250x46).
- Classes use the Story 1.1 token names from DESIGN.md "Build mapping" (`bg-ink`, `text-on-navy-muted`, `text-amber-tint`, `font-brand`, `text-label-sm`, `px-gutter`, `max-w-page`, `sm`=640/`md`=900 breakpoints). Until 1.1 merges they render unstyled. Tailwind breakpoints are min-width, so 640px and 900px exactly get the wider layout (prototype used max-width); 1px difference accepted.
- Column headings are `h2` (prototype used `h4`) so the outline does not skip levels.
- Footer is not mounted; Andy mounts it in `src/app/layout.tsx` (T3).
- Checks: lint, typecheck, format:check, `npm run test:coverage` (100% statements/branches), `npm run test:smoke` (build + `/` 200) all passed.

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
