---
title: 'E-S4 Footer and office facts match the prototype'
type: 'feature'
created: '2026-10-08'
status: 'in-progress'
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
| Ridge | Load at 1280px | — | Navy ridge with an amber line above the footer, peak right of centre, 120px high, nothing on the peak | Static | CAP-4, ENH-043, ENH-045 | |
| Ridge | Load at 390px | — | Ridge 72px high, no sideways scroll | Static | CAP-4, `site.css` ≤640 | |
| Last section | Scroll to the end of `/`, `/about`, `/careers`, `/services` | — | The last content ends above the ridge; room 232–256px (176px on phones) | Static | CAP-4, ENH-073 | |
| Footer grid | Load at 1280 / 900 / 390px | — | Five columns / two columns / one column | Static | `site.css:456-492` | |
| Brand column | Load | — | Logo and "Education technology products and software delivery services for schools and businesses." | Static | CAP-1 | |
| Products links | Activate each | Mouse, keyboard | For schools → `/products#sxp`, For students → `#ai-tutor`, For parents → `#pxp`; each lands on its card | Instant | CAP-1 | |
| Services links | Activate | Mouse, keyboard | Five services land on their cards; How we work → `#process`; All services → `/services` | Instant | CAP-1 | |
| Company links | Load | — | News, About us, Careers only | Static | CAP-1, ENH-057, ENH-064 | |
| Offices | Load | — | "Vietnam Delivery Center" first, then "US Delivery Center"; no city headings | Static | CAP-2, ENH-057 | |
| Office rows | Load | — | Map pin, phone, WhatsApp, envelope icons beside their rows; phones "(+84) 908 107 552", "(+1) 469 322 9899" | Static | CAP-2, ENH-058 | |
| Phone links | Hover, focus | Mouse, keyboard | Lighter text on hover; visible focus ring; target at least 24px | Instant | EXPERIENCE.md "Footer", decision T9 | |
| WhatsApp | Activate | Mouse, keyboard | Opens wa.me in a new tab; name ends "(opens in a new tab)" | Instant | CAP-2, decision A6 | |
| Vietnam email | Load | — | Not shown | Static | Q7 | |
| Bottom bar | Load | — | "© 2026 XionTech · Privacy policy" and "GET IT DONE" | Static | CAP-5 | |
| Other pages | Load `/about`, `/demo`, `/` | — | Office names, phones and order unchanged | Static | Boundaries | |

## Implementation Notes

## Spec Change Log

## Review Triage Log

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
