---
title: 'E-S4 Footer and office facts match the prototype'
type: 'feature'
created: '2026-10-08'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '504e2b66076e044eb209d2fa7728a8838fe709dd'
context:
  - '{project-root}/AGENTS.md'
  - '{project-root}/docs/ux-checks.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The footer on every page still lists PXP, LXP (a dead `#lxp` link), SXP and IoT, has
Company links the prototype removed, shows Plano first with city headings and no icons, and sits on a
flat top. The prototype (ENH-043, 044, 056, 057, 058, 064, 073; planned spec
`_bmad-output/specs/sammy/spec-enh-s4-footer-offices/SPEC.md`) groups products by audience, lists the
offices Vietnam first with icon rows, and puts the footer on a navy mountain ridge with room above it.

**Approach:** Port the prototype footer (`prototype/js/site.js:31-41`, `css/site.css:456-492`): new
columns and links, office rows with Phosphor icons and bracketed phone numbers, the ridge SVG above the
footer, and bottom room on the last element of every page. The shared office data keeps its order and
labels so About, Demo and Home are unchanged.

## Boundaries & Constraints

**Always:**
- Links exactly as the prototype: Products For schools `/products#sxp`, For students `/products#ai-tutor`,
  For parents `/products#pxp`; Services Product Engineering, AI-Driven Analytics, Staffing Service,
  Low-code Solutions, Cloud Computing (`/services#<id>`), How we work `/services#process`, All services
  `/services`; Company News, About us, Careers.
- Footer offices: Vietnam Delivery Center first, then US Delivery Center; no city headings; rows with
  `aria-hidden` icons (map pin, phone, WhatsApp, envelope); phones shown "(+84) 908 107 552",
  "(+1) 469 322 9899", WhatsApp "(+1) 469 439 9345" (new tab, name "WhatsApp (+1) 469 439 9345 (opens in
  a new tab)"); `tel:` hrefs keep the plain international form; US email `vinni.tran@newxion.com`.
- `src/content/offices.ts` keeps `offices = [plano, hcmc]`, every existing `name`, `tag`, `label` and
  contact order; additions are new optional fields or new exports only.
- Ridge: navy fill and amber ridge line from the prototype paths, decorative (`aria-hidden`), above the
  footer, 120px high (72px at 640px and below), no figure on it.
- Bottom room `clamp(232px, 17vw, 256px)` (176px at 640px and below) on the last element in `<main>`
  on every route, including wrapper elements such as Careers' `.careers-flow`.
- "© 2026 XionTech", the Privacy link and the "GET IT DONE" tag stay.

**Never:**
- No Vietnam email (decision Q7: shown only once the business confirms it).
- No climber (Tier 2), no X mark on the peak (ENH-045 removed it).
- No change to `layout.tsx` (Andy's), About, Demo, Home contact or Services markup.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Last element is a section | `/`, `/about`, `/news`, `/products`, `/services`, `/demo`, `/privacy`, a story, a job, 404 | Its bottom padding is the bottom room; its content is not covered by the ridge | N/A |
| Last element is a wrapper | `/careers` (`.careers-flow`) | The wrapper gets the bottom room; the roles list is not covered | N/A |
| Phone width | 390px | Ridge 72px, footer one column, no sideways scroll, room 176px | N/A |
| WhatsApp link | Activate | Opens wa.me in a new tab with `rel="noopener noreferrer"` | N/A |

</frozen-after-approval>

## Code Map

- `src/components/layout/site-footer.tsx` -- Server Component, all Tailwind: brand column, `siteFooter.columns` mapped to `h2` + `ul`, an Offices column rendering `offices` as `<address>` (name, optional tag, address lines, contacts as links), bottom bar. Mounted once in `src/app/layout.tsx:61` after `<main id="main" class="flex flex-1 flex-col">`.
- `src/content/site-footer.ts` -- `siteFooter {logoAlt, blurb, columns, officesHeading, copyright, privacy, tag}`; columns hold the old PXP/LXP/SXP/IoT, the services links and Company with Core values, FAQ, Contact.
- `src/content/offices.ts` -- `OfficeContact {href,label,ariaLabel?,external?}`, `Office {id,name,tag?,addressLines,contacts,timeZone,zoneLabel}`; `plano` (no tag; tel, WhatsApp "WhatsApp +1 469 439 9345", mailto newxion), `hcmc` (tag "Vietnam Delivery Center"; tel only). Consumers: footer; About (`about.ts:111` → `about/page.tsx:133-165`, reads name, tag, addressLines, contacts); Demo (`demo/page.tsx:42-70`); Home contact (`home-contact.tsx:8-17`, city from `name`, contacts by href prefix); Capabilities and Services (time zone only). Tests pin labels and order: `offices.test.ts`, `demo/page.test.tsx:42-77`, `app/page.test.tsx:140-141`.
- `src/content/services.ts:49-95` -- ids `product-engineering`, `ai-analytics`, `staffing`, `low-code`, `cloud`; `#process` is a section id on `/services`, not a service id.
- `src/content/services.test.ts:11-16` -- asserts every footer `/services#` link is a service id; must allow `#process`.
- `src/components/layout/site-footer.test.tsx` -- pins old hrefs (:40-75), office order and labels (:79-108), and `> 20` text links (:144).
- `src/components/products/product-showcase.tsx:171` -- card ids `pxp`, `sxp`, `iot`, `ai-tutor` exist.
- Page ends: every route ends with a `<section>` except `/careers`, which ends with `div.careers-flow` (its last child is `section#roles`); Home ends with `section#contact`.
- Prototype: footer `js/site.js:31-41`; CSS `site.css:456-492` (`footer.site`, `.fgrid` 1.2fr .8fr 1fr .7fr 1.4fr, gap 32px; 2 columns at ≤1024, 1 at ≤640; `.orow` flex gap 10px, icon 1rem amber-tint; `.office+.office` margin 20px), ridge `.ridge{position:absolute;left:0;right:0;bottom:100%;height:120px}` (72px ≤640), `ridge-line` stroke amber 1.5, opacity .55, `vector-effect: non-scaling-stroke`; bottom room `site.css:1529-1530`.

## Tasks & Acceptance

**Execution:**
- [x] `src/content/offices.ts` -- add footer-only data without changing existing fields: delivery-center names ("Vietnam Delivery Center", "US Delivery Center"), a bracketed phone display ("(+84) 908 107 552", "(+1) 469 322 9899", "(+1) 469 439 9345"), and a `footerOffices` order `[hcmc, plano]` -- About, Demo and Home stay unchanged
  - red: `src/content/offices.test.ts` -- `footerOffices` is Vietnam then US with the bracketed phones, while `offices` is still Plano then HCMC with the old labels
- [x] `src/content/site-footer.ts`, `src/content/services.test.ts` -- prototype columns and links; services test accepts `#process` -- no dead `#lxp`
  - red: `src/components/layout/site-footer.test.tsx` -- Products links For schools, For students, For parents to `#sxp`, `#ai-tutor`, `#pxp`; Company is News, About us, Careers
- [x] `src/components/layout/site-footer.tsx`, `globals.css` -- render the columns, the office rows with icons from `footerOffices`, the ridge SVG; port the footer grid and row CSS in a `/* E-S4 Footer */` block
  - red: `src/components/layout/site-footer.test.tsx` -- offices render Vietnam Delivery Center before US Delivery Center with icon rows and "(+84) 908 107 552"; an `aria-hidden` ridge SVG is present; no Vietnam email
- [x] `globals.css`, `e2e/a11y.spec.ts` -- bottom room on `main > :last-child` (176px at ≤640px) and a browser test that the ridge does not cover the last content on `/` and `/careers` at 1280 and 390, with no sideways scroll -- every page clears the ridge
  - red: `e2e/a11y.spec.ts` -- on `/careers` at 1280 the last role link's bottom sits above the ridge's top

**Acceptance Criteria:**
- Given any page, when it loads, then the footer shows the prototype columns and offices and sits on the ridge.
- Given `/about`, `/demo` and `/`, when they load, then their office content is unchanged.
- Given the repo, when `npm test` runs, then no footer link points to a missing anchor.

## UX checks

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| Ridge | Load at 1280px | — | Navy ridge with an amber line above the footer, peak right of centre, 120px high, nothing on the peak | Static | CAP-4, ENH-043, ENH-045 |  ✅ walk (120px, nothing on the peak); `site-footer.test.tsx` |
| Ridge | Load at 390px | — | Ridge 72px high, no sideways scroll | Static | CAP-4, `site.css` ≤640 |  ✅ walk (72px, no sideways scroll); `a11y.spec.ts` footer ridge |
| Last section | Scroll to the end of `/`, `/about`, `/careers`, `/services` | — | The last content ends above the ridge; room 232–256px (176px on phones) | Static | CAP-4, ENH-073 |  ✅ walk (nine routes, 232px / 176px); `a11y.spec.ts` footer ridge |
| Footer grid | Load at 1280 / 900 / 390px | — | Five columns / two columns / one column | Static | `site.css:456-492` |  ✅ walk (5 / 2 / 1) |
| Brand column | Load | — | Logo and "Education technology products and software delivery services for schools and businesses." | Static | CAP-1 |  ✅ walk; `site-footer.test.tsx` |
| Products links | Activate each | Mouse, keyboard | For schools → `/products#sxp`, For students → `#ai-tutor`, For parents → `#pxp`; each lands on its card | Instant | CAP-1 |  ✅ walk (cards land at 88px); `site-footer.test.tsx` |
| Services links | Activate | Mouse, keyboard | Five services land on their cards; How we work → `#process`; All services → `/services` | Instant | CAP-1 |  ✅ walk (How we work heading visible); `site-footer.test.tsx`, `services.test.ts` |
| Company links | Load | — | News, About us, Careers only | Static | CAP-1, ENH-057, ENH-064 |  ✅ walk; `site-footer.test.tsx` |
| Offices | Load | — | "Vietnam Delivery Center" first, then "US Delivery Center"; no city headings | Static | CAP-2, ENH-057 |  ✅ walk; `site-footer.test.tsx`, `offices.test.ts` |
| Office rows | Load | — | Map pin, phone, WhatsApp, envelope icons beside their rows; phones "(+84) 908 107 552", "(+1) 469 322 9899" | Static | CAP-2, ENH-058 |  ✅ walk (icons per row); `site-footer.test.tsx` |
| Phone links | Hover, focus | Mouse, keyboard | Lighter text on hover; visible focus ring; target at least 24px | Instant | EXPERIENCE.md "Footer", decision T9 |  ✅ walk (2px ring, 24px, white on hover); `a11y.spec.ts` keyboard |
| WhatsApp | Activate | Mouse, keyboard | Opens wa.me in a new tab; name ends "(opens in a new tab)" | Instant | CAP-2, decision A6 |  ✅ walk; `site-footer.test.tsx` |
| Vietnam email | Load | — | Not shown | Static | Q7 |  ✅ walk; `site-footer.test.tsx` |
| Bottom bar | Load | — | "© 2026 XionTech · Privacy policy" and "GET IT DONE" | Static | CAP-5 |  ✅ walk; `layout.test.tsx` |
| Other pages | Load `/about`, `/demo`, `/` | — | Office names, phones and order unchanged | Static | Boundaries |  ✅ walk; `offices.test.ts`, `demo/page.test.tsx`, `page.test.tsx` |

## Implementation Notes

## Spec Change Log

## Review Triage Log

| # | Source | Finding | Verdict | Evidence | Route |
| --- | --- | --- | --- | --- | --- |
| 1 | verification-gap, edge, blind | No test ties footer `/products#` links to the Products card anchors | medium | `site-footer.test.tsx` compares the footer to its own literals; product tests ignore the footer | patch |
| 2 | edge, blind | Footer phone labels can drift from the number they dial | low | Labels are typed; hrefs come from `plano`/`hcmc`; a digits test is a direct guard | patch |
| 3 | blind | "Vietnam Delivery Center" typed twice (hcmc `tag` and footer `name`) | low | Same string in two places; reuse `hcmc.tag` | patch |
| 4 | edge | Contact icon picker falls back to the phone icon for an unknown href | low | Silent wrong icon for a future `sms:` or other link; explicit prefixes plus a throw | patch |
| 5 | verification-gap, blind, edge, Task 3 minor | `not.toMatch(/…Vietnam$/)` second branch can never fire | low | The `$` anchor binds only the Vietnam branch; assert the `<b>` headings exactly | patch |
| 6 | blind, Task 3 minor | Test pins the Tailwind class `relative` | low | Source-wording check; the e2e observes the ridge position | patch |
| 7 | blind, edge, Task 2 minor | Link count `> 15` is loose (18 links) | low | A dropped link passes; assert the exact count | patch |
| 8 | verification-gap, edge, blind, Task 4 minor | Bottom-room e2e measures only the last link and only `/` and `/careers`; story and job pages unverified | medium | `main > :last-child a:visible`; spec matrix names story and job pages, the walk did not visit them | patch |
| 9 | acceptance, edge, verification-gap | ENH-088 set Built in this PR | false | The user approved marking ENH-088 Built in this branch's first commit (S1 merged in #78); the PR says so | reject |
| 10 | blind | The footer no longer links to the contact form | false | Plan decision Q8: Home's Get in touch and About's link lead to `/#contact`; Services keeps "Start a project" | reject |
| 11 | blind | Ridge has no z-index or overflow guard | false | `preserveAspectRatio="none"` scales to the width; the walk shows no sideways scroll on nine routes at 1280 and 390 | reject |
| 12 | blind | 640/641px boundary mismatch between grid and ridge rules | low | Fractional widths only; no visible defect at the boundary in the walk | reject |
| 13 | blind, edge | `contactByPrefix` throws at module load | false | Loud failure on bad static data is the intended guard; it is tested | reject |
| 14 | edge | Bottom room replaces the last section's own bottom padding | low | No last section on any route has more than 232px of its own bottom padding; the room is the larger value | reject |
| 15 | edge | `services.test.ts` filters `#process` instead of asserting it | low | `#process` is a page section id covered by `e2e/services.spec.ts`; the walk lands on it | reject |
| 16 | blind, verification-gap | `[WebServer] … stream closed early` lines in the a11y transcript | false | Playwright web-server log noise when a test aborts a request; all 30 tests passed | reject |
| 17 | blind | `walk.mjs` only logs, no assertions | low | It is the evidence walk; assertions live in the unit and e2e tests | reject |
| 18 | blind | No `docs/ai-log.md` entry | low | Project hand-in rule; added before the PR | patch (docs, at PR) |
| 19 | blind | Keyboard input on footer links not exercised by the walk | low | The a11y keyboard suite tabs every page and checks rings and 24px targets | reject |
| 20 | acceptance | Bottom bar and unchanged pages rest on existing tests | false | `npm test` (1237 passed) runs `layout.test.tsx`, `demo/page.test.tsx`, `app/page.test.tsx`, which assert them | reject |
| 21 | security | Clean | — | No sources, sinks, secrets or dependency changes | — |
| 22 | patch re-review | `hcmc.tag ?? hcmc.name` fallback branch is untestable | low | Replaced by one `VIETNAM_DELIVERY_CENTER` constant used by the tag and the footer name (controller patch e83d868) | patch |
| 23 | patch re-review | News-story and job-page ridge checks skip silently when `/news` or `/careers` has no link | low | Both ran and passed (12 of 12); data can legitimately be empty, so a skip is the honest outcome | defer |

## Verification

**Commands:**
- `npm run lint && npm run typecheck && npm run format:check` -- expected: clean
- `npm test` -- expected: all pass
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines; changed files ≥ 80% branches
- `npm run test:smoke` -- expected: all `@smoke` pass
- `npm run build` -- expected: success
- `npx playwright test --project=a11y` -- expected: all pass (new footer test included)

**Manual checks (if no CLI):**
- Walk `/`, `/about`, `/careers`, `/services` and a 404 at 1280px and 390px on a production build (`npx next start -p 3005`, Chrome) and check every UX line.

## Acceptance Evidence

Captured after the step-04 review patches on 2026-10-09 (the step-03 set is history in the ledger).

**Commands**

- `npm run lint && npm run typecheck && npm run format:check` -- exit 0 -- All matched files use Prettier code style!
- `npm test` -- exit 0 -- Test Files 83 passed (83), Tests 1240 passed (1240)
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- Coverage: 100%; C1 ok: 3 changed file(s) with branch coverage >= 80%
- `npm run test:smoke` -- exit 0 -- 15 passed
- `npm run build` -- exit 0 -- compiled successfully
- `npx playwright test --project=a11y` -- exit 0 -- 38 passed (footer ridge on `/`, `/careers`, `/about`, `/privacy`, a news story and a job page at 1280 and 390)

**Observed**

- Every UX line on nine routes at 1280px and 390px and the footer at 900px -- production build on :3005 in Chrome, [observed.md](spec-enh-s4-footer-offices-evidence/observed.md), [walk-output.txt](spec-enh-s4-footer-offices-evidence/walk-output.txt)

**Artifacts**

- [verification.txt](spec-enh-s4-footer-offices-evidence/verification.txt) -- transcript of the six commands
- [walk.mjs](spec-enh-s4-footer-offices-evidence/walk.mjs) -- the walk that produced the output and screenshots
- [footer-1280.png](spec-enh-s4-footer-offices-evidence/footer-1280.png), [footer-1280-full.png](spec-enh-s4-footer-offices-evidence/footer-1280-full.png), [footer-390.png](spec-enh-s4-footer-offices-evidence/footer-390.png) -- ridge and footer
- [careers-end-1280.png](spec-enh-s4-footer-offices-evidence/careers-end-1280.png), [careers-end-390.png](spec-enh-s4-footer-offices-evidence/careers-end-390.png) -- the wrapper page ends above the ridge
- Byte counts and SHA-256 prefixes are in the ledger `spec-enh-s4-footer-offices-progress.md`.

**Not captured**

- Nothing.
