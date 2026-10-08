---
title: 'E-A2 one set of app names: Parent Hub, Staff Hub, IoT, AI Tutor'
type: 'feature'
created: '2026-10-08'
status: 'done'
baseline_commit: '5256884a5947771081d331d4e52ab23ff9ec4d06'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/AGENTS.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The prototype names the apps for who uses them (PXP → Parent Hub "P-Hub", SXP → Staff Hub "S-Hub", IoT stays, AI Tutor added, LXP no longer shown), but Andy's code, the Demo form, the contact payload and the Sanity `post.app` field still use PXP/LXP/SXP. Planned spec: `_bmad-output/specs/andy/spec-enh-a2-app-rename/SPEC.md` (ENH-086, ENH-087 names part).

**Approach:** One new `src/content/apps.ts` (id, shortName, fullName, badge, anchor, tagline). Andy's files read names from it. Sanity stores the app ids; the read code maps old stored values.

Decisions (lead, 2026-10-08): Q1 rename; Q6 unverified copy ships `[Placeholder]` (AI Tutor tagline); Q14 Tier 1 only; Demo day 2026-10-16. No Studio deploy or content migration in this task: the lead runs them after merge.

## Boundaries & Constraints

**Always:**
- `apps.ts` records, in this order: `parent-hub` (Parent Hub / Parent Hub / text "P-Hub" / anchor `pxp`), `staff-hub` (Staff Hub / Staff Hub / "S-Hub" / `sxp`), `iot` (IoT / IoT Device Management / icon `Cpu` / `iot`), `ai-tutor` (AI Tutor / AI Tutor / icon `Sparkle` / `ai-tutor`). Taglines from `products.html` `ps-title`; AI Tutor's starts `[Placeholder]`. Icons are names (strings), so the file has no React import.
- Card ids `#pxp`, `#sxp`, `#iot` stay. The LXP section and its sub-nav pill go, so `/products#lxp` lands at the top.
- Demo product options: Parent Hub, Staff Hub, IoT (no AI Tutor), default Parent Hub. The payload sends these short names; the server accepts only them.
- Demo copy: "Parent Hub and Staff Hub" (meta and first item), third item "For projects: a first Discovery conversation, the first of our four steps.", label "Your role", label "When do you want to start?".
- Sanity `post.app` options: Parent Hub `parent-hub`, Staff Hub `staff-hub`, IoT `iot`, AI Tutor `ai-tutor`. Read mapping: `PXP`→`parent-hub`, `SXP`→`staff-hub`, `IoT`→`iot`, new ids → themselves, `LXP` and anything else → no app.
- Studio structure keeps ids `product-pxp`, `product-sxp`, `product-iot` with new titles; `product-lxp` hidden; no AI Tutor document.
- Header Products menu: names only (four rows: Parent Hub, Staff Hub, IoT Device Management, AI Tutor in `apps.ts` order; LXP's row becomes AI Tutor).

**Never:**
- Sammy's files: `src/content/home.ts`, `about.ts`, `site-footer.ts`, `src/components/home/*`, and their tests.
- New Products cards, dialogs or AI Tutor section (E-A5). Menu structure changes (E-A3). Contact type `general` (E-A4).
- Deploy the Studio or migrate content. Send mail.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| New app value | post `app: "staff-hub"`, category product | tag "Product · Staff Hub"; story button "See Staff Hub" → `/products#sxp` | N/A |
| Old value | `app: "PXP"` / `"IoT"` | "Product · Parent Hub" → `/products#pxp`; "Product · IoT" → `/products#iot` | N/A |
| Dropped app | `app: "LXP"` or unknown | tag "Product", no app button | no error |
| Not product | category company, `app: "PXP"` | tag "Company", no button | N/A |
| Demo submit | `products: ["Parent Hub","IoT"]` | accepted; mail lists "Parent Hub, IoT" | N/A |
| Old payload | `products: ["PXP"]` or an AI Tutor value | 400 bad request | existing `bad` path |

</frozen-after-approval>

## Code Map

- `src/content/apps.ts` (new) -- the four records, `AppId`, `appById`.
- `src/content/products.ts` -- hero lede, meta, sub-nav (drop `lxp`), `pxpSection` (badge, lede, tabsLabel, caption), drop `productsLxp`, `productsSxp` (badge, lede, "Reach parents through Parent Hub.", media), `productsIot.badgeLabel`.
- `src/content/product-links.ts` -- comment; drop `webAppLinks.lxp`.
- `src/components/products/products-web-apps.tsx` -- drop `LxpSection`, `LXP_ICONS` and their icon imports; `src/app/products/page.tsx` drops `<LxpSection/>`; `src/app/globals.css` `.feature-list-4` becomes unused (only LXP used it) → remove. Keep `.b-lxp`/`.t-lxp` (Home uses them).
- `src/components/layout/nav-data.ts` -- `PRODUCTS` names from `apps.ts` (`fullName`); value lines drop "eXperience Place"; LXP row → AI Tutor (tagline, "Students").
- `src/components/contact/contact-strings.ts` -- pills, default, demo copy. `src/lib/contact/submission.ts` `isProductList` already reads `productPills`; only its tests change. `src/lib/contact/delivery.ts` unchanged (mail labels stay).
- `src/lib/news/post-app.ts` (new) -- `postApp(value): App | null` with the old-value map.
- `src/lib/news/latest-posts.ts` `categoryTag` → shortName via `postApp`. `src/lib/news/post.ts` `productAnchor` → `productLink(app): {href,label}|null`; `src/app/news/[slug]/page.tsx` uses it.
- `studio/schemas/post.ts`, `studio/schemas/structure.ts` -- options and titles; studio cannot import `src/`, so its tests check the values against `APPS`.
- `docs/sanity.md` -- app values and the migration steps.
- Tests: `products/page.test.tsx`, `pxp-section`, `pxp-story-phone`, `products-web-apps`, `nav-data`, `site-nav`, `contact-form`, `submission`, `delivery`, `api/contact/route`, `latest-posts`, `post`, `news-card`, `home-news`, `news/page`, `news/[slug]/page`, studio `schemas`, `structure`; `e2e/products.spec.ts` (drop `lxp`).

## Tasks & Acceptance

**Execution:**
- [x] `src/content/apps.ts` -- create the records -- one source for every page task.
  - red: `src/content/apps.test.ts` -- ids, names, badges, anchors and order as listed; AI Tutor tagline starts `[Placeholder]`.
- [x] `src/lib/news/post-app.ts`, `latest-posts.ts`, `post.ts`, `news/[slug]/page.tsx` -- read-time mapping.
  - red: `src/lib/news/post-app.test.ts`, `latest-posts.test.ts`, `post.test.ts` -- every I/O matrix news row.
- [x] `contact-strings.ts` -- options and Demo copy.
  - red: `contact-form.test.tsx`, `submission.test.ts` -- three Parent Hub/Staff Hub/IoT checkboxes, Parent Hub checked; "PXP" rejected; "Your role", "When do you want to start?".
- [x] `products.ts`, `product-links.ts`, `products-web-apps.tsx`, `products/page.tsx`, `globals.css` -- names, LXP section removed.
  - red: `products/page.test.tsx` -- pills Parent Hub, Staff Hub, IoT; no `#lxp` section.
- [x] `nav-data.ts` -- names.
  - red: `nav-data.test.ts` -- names Parent Hub, Staff Hub, IoT Device Management, AI Tutor.
- [x] `studio/schemas/post.ts`, `structure.ts` -- values and titles.
  - red: `schemas.test.ts`, `structure.test.ts` -- app values equal `APPS` ids; product titles Parent Hub, Staff Hub, IoT; no `product-lxp`.
- [x] Remaining tests, `e2e/products.spec.ts`, `docs/sanity.md`.

**Acceptance Criteria:**
- Given `/products#pxp`, when it loads, then the Parent Hub section (badge "P-Hub") is in view; `#lxp` stays at the top.
- Given `/demo`, when the Product demo tab shows, then the options are Parent Hub (checked), Staff Hub, IoT.
- Given the grep `PXP|SXP|LXP|eXperience` over Andy's files, then only the old-value map and comments that name the old values remain.

## Implementation Notes

Commits: Conventional Commits, files added by explicit path (never `git add -A`: untracked `lighthouse-reports/` and `.claude/worktrees/` stay out), trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Do not push.

UX checks (`docs/ux-checks.md`), written before coding.

| # | Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | /products sub-nav | load | none | pills Parent Hub, Staff Hub, IoT; no LXP | static | CAP-1, Q1 | yes: page.test + browser 1280/390 |
| 2 | Parent Hub section | load `/products#pxp` | link | section heading in view under the header; badge "P-Hub" fits its square | scroll | CAP-4 | yes: browser, section 144px, H2 335px/266px, badge 56x56 fits |
| 3 | Staff Hub section | load | none | amber badge "S-Hub" fits; lede starts "Staff Hub" | static | CAP-1 | yes: products-web-apps.test + browser |
| 4 | `/products#lxp` | load | link | page stays at the top, no error | static | CAP-4 | yes: browser scrollY 0; e2e products.spec |
| 5 | Header Products menu | open | mouse, keyboard | rows Parent Hub, Staff Hub, IoT Device Management, AI Tutor | — | CAP-2 | yes: nav-data.test + browser (menu-1280.png) |
| 6 | Demo products | Product demo tab | mouse, keyboard | checkboxes Parent Hub (checked), Staff Hub, IoT | static | demo.html:52 | yes: contact-form.test + browser |
| 7 | Demo labels | load / Outsourcing tab | mouse | "Your role"; "When do you want to start?" | static | demo.html | yes: contact-form.test + browser |
| 8 | Demo hero list | load | none | "Parent Hub and Staff Hub"; "the first of our four steps" | static | demo.html:29-31 | yes: browser (no unit test) |
| 9 | News tag and story button | Product post | none | "Product · Parent Hub"; "See Parent Hub" → `/products#pxp` | static | CAP-3 | yes: post-app, latest-posts, news/[slug]/page tests (no live post) |

## Spec Change Log

## Review Triage Log

Full `bmad-code-review`, 4 layers (blind hunter, edge-case hunter, verification gap, acceptance auditor), 2026-10-08, plus the step-03 task-review minors.

- patch (low): `AppBadge.icon` was any string → `"Cpu" | "Sparkle"` (blind, task 1 minor).
- patch (low): `globals.css` comments still named the removed LXP section; `products.ts` comment said "PXP section"; `SXP_ICONS` → `STAFF_HUB_ICONS` (acceptance, blind).
- patch (low): `docs/architecture.md` listed Products as PXP, LXP, SXP, IoT and "PXP story tabs" (blind).
- patch (low): `docs/sanity.md` had no way to find posts with old values and did not say what LXP posts lose → CLI query and LXP note added (blind).
- patch (low, step-03): Demo pills were literals → read from `apps.ts` (56506de); `docs/sanity.md` deploy note order fixed; AI Tutor value rejection test added (5a2cec7).
- defer (low): AI Tutor menu row and an `ai-tutor` news post link to `/products#ai-tutor` before E-A5 adds the card (all four layers). The spec puts AI Tutor in the menu; the link lands at the top of /products.
- defer (low): Home, About, footer still say PXP/LXP/SXP; footer `#lxp` lands at the top (edge, blind). Sammy's E-S1/E-S3/E-S4, out of scope by intent.
- defer (low): hero "Four apps" with three sections until E-A5 (blind).
- defer (low): a stale Demo tab sends "PXP" after deploy and gets 400 (edge).
- false: Demo copy names only Parent Hub and Staff Hub while IoT is offered → the spec and `demo.html` say so.
- false: the 4-item product test cannot tell count from duplicate checks → there is no duplicate rule; the count is the only rule.
- rejected (low): unused taglines for three apps → E-A5 and Sammy's tasks read them; nav value lines are confirmed copy.
- rejected (low): Studio lists are literals → the Studio cannot import `src/`; tests compare them with `APPS`.
- rejected (low): no test that every menu anchor has a section → E-A5 adds the anchor; a cross-page test adds complexity.
- rejected (low): `pxp-story-phone.tsx` comment says PXP → file untouched here; E-A5 removes the component.
- rejected (low, task minors): duplicate `not.toContain("product-lxp")`, `S-Hub` literal in a test, old-name check on value lines only, lede/meta tests (added in e02ad7e).

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npx prettier --check src e2e studio` -- expected: clean
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines
- `npm run build` -- expected: success

**Manual checks:**
- `next start --port 3201`: rows 1-8 above at 1280px and 390px.

## Acceptance Evidence

Captured at the end of step-03 on 2026-10-08.

**Commands**

- `npm run lint && npm run typecheck && npx prettier --check src e2e studio` -- exit 0 -- All matched files use Prettier code style!
- `npm test` -- exit 0 -- Tests 1178 passed (1178)
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- Diff coverage 100% (22 lines, 0 missing); C1 ok, 17 changed files >= 80%
- `npm run build` -- exit 0 -- 16 static pages generated

**Observed**

- `/products` at 1280px and 390px: pills Parent Hub, Staff Hub, IoT; no `#lxp`; `/products#pxp` puts the section 144px from the top with the "P-Hub" badge (56x56, text fits) and H2 in view; `/products#lxp` stays at scrollY 0; no sideways scroll -- `next start --port 3201`, Playwright (Chrome)
- Header Products menu: Parent Hub, Staff Hub, IoT Device Management, AI Tutor -- same
- `/demo`: Parent Hub (checked), Staff Hub, IoT; "Your role"; "When do you want to start?"; hero items with the new copy; no sideways scroll -- same

**Artifacts**

- spec-enh-a2-app-rename-evidence/verification.txt -- 5057 bytes -- sha256 a7135e6a9325 -- command output
- spec-enh-a2-app-rename-evidence/browser-check.txt -- 2046 bytes -- sha256 ddcd23253c40 -- browser check lines
- spec-enh-a2-app-rename-evidence/products-pxp-1280.png -- 144273 bytes -- sha256 b25db997e944 -- /products#pxp desktop
- spec-enh-a2-app-rename-evidence/products-pxp-390.png -- 73713 bytes -- sha256 83ea03d7364b -- /products#pxp phone
- spec-enh-a2-app-rename-evidence/menu-1280.png -- 312133 bytes -- sha256 b5719ac89f37 -- Products menu
- spec-enh-a2-app-rename-evidence/demo-1280.png -- 761123 bytes -- sha256 c8b7eaf5e788 -- Demo form desktop
- spec-enh-a2-app-rename-evidence/demo-390.png -- 411133 bytes -- sha256 1fa78006c599 -- Demo form phone

After the review patches (255fb3b): `verification-after-review.txt` -- lint, typecheck and Prettier exit 0; `npm test` 1178 passed; diff coverage 100%, C1 ok; build exit 0. The patch changed comments, a type, a name and docs only, so the browser check was not repeated.

**Not captured**

- News tag and story button (UX row 9): no published Product post on the build's Sanity data was checked in the browser; covered by unit tests (`post-app`, `latest-posts`, `news/[slug]/page`).
