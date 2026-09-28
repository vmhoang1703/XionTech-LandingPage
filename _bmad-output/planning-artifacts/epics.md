---
title: XionTechs Website Epics and Stories
status: draft
updated: 2026-09-28
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
  - _bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/code-review-2026-09-28.md
  - _bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/
  - AGENTS.md
sources:
  - _bmad-output/planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
  - _bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/code-review-2026-09-28.md
  - _bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/
  - AGENTS.md
---

# XionTechs Website: Epic Breakdown

## Overview

This document breaks the XionTechs Website PRD (46 FRs, 8 NFRs), the UX spines (`DESIGN.md`, `EXPERIENCE.md`) and the 16 review acceptance criteria into epics and stories for `bmad-build`. No architecture document exists; technical enablers are inferred from `AGENTS.md` and tagged `[ASSUMPTION]`.

**Conventions**

- `EXP >` means `EXPERIENCE.md` section, `DES >` means `DESIGN.md` section.
- Prototype paths are relative to `_bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/` and written `mockups/site-v3/...`. The prototype is the visual acceptance reference; the spines win on any conflict.
- Header and footer are rendered by the prototype script into `#site-header` and `#site-footer`, so their design reference is `mockups/site-v3/js/site.js` (header and footer templates) with `css/site.css`.
- All routes exist under `/en/` and `/vi/`; paths below omit the prefix.
- Book a demo sits next to the EN/VI switch above 640px and is the first mobile menu item at 640px and below. 640px is current; the 1080px mention in the UX decision log is superseded.
- Every story's Definition of Done includes NFR-8 (lint, typecheck, unit tests, 100% changed-line coverage, branch coverage at least 80% per changed file, Playwright smoke, build, local SonarQube gate) and NFR-7 (no invented content; unverified text starts with `[Placeholder]` in EN and VI). These are not repeated per story.
- **Owner** on every story is `[ASSUMPTION]`, to be assigned by the lead (Hoang Vu). Size: S (up to 1 day), M (1 to 2 days), L (2 to 3 days). `[ASSUMPTION]` day ranges.

**Personas** (EXP > Key Flows): Lan (Nguyễn Thị Lan, school principal, Flow 1), Quân (Trần Minh Quân, CTO, Flow 2), Hà (Phạm Thu Hà, parent on a phone, Flow 3), Nam (Lê Hoàng Nam, QA engineer and job seeker, Flow 4). Internal: a XionTechs editor (PRD 2.1).

## Requirements Inventory

### Functional Requirements

FR-1: Sticky header on every page reaches Products (mega: PXP, LXP, SXP, IoT Device Management, All products), Services (mega: 8 services, See the process), News, About, Careers. Text-only triggers, no caret; `aria-current="page"`; hover opens, 150ms close delay, click never closes a hover-opened menu, Escape returns focus, one menu at a time, click outside closes.
FR-2: Below 1080px a menu button opens all navigation; `aria-controls`, `aria-expanded`; Escape closes and returns focus; mega content inline; scroll lock and focus kept inside.
FR-3: Book a demo reachable at every width: next to EN/VI above 640px; first mobile menu item in button style at 640px and below, not in the header bar.
FR-4: EN/VI switch: two toggle buttons with `aria-pressed` in a group labelled "Language", in the header at every width; switching keeps page, scroll and typed values and updates `lang`, title, meta; every string exists in EN and VI; product and service names stay English.
FR-5: Every page under `/en/` and `/vi/`; bare `/` redirects to saved locale, else `/vi/` for Vietnamese browsers, else `/en/`; URL locale wins; choice remembered.
FR-6: In-page anchors land with the heading fully visible below the sticky header (and Products sub-nav) via `scroll-margin-top`; smooth scroll off under reduced motion.
FR-7: Footer on every page: Products, Services, Company, both offices with `tel:` links, bottom bar with copyright, Privacy policy link, GET IT DONE tag; no Da Nang or second HCMC office.
FR-8: "Skip to content" is the first focusable element; inner pages show breadcrumbs (Home + current page).
FR-9: Unknown paths show a short message and links to Home, Products, Services, News in the current locale, with HTTP 404. `[ASSUMPTION]` status code.
FR-10: Dark `hero-silk` Home hero with headline, tablet and phone frames, slow continuous silk; discreet motion toggle (accessible name "Pause motion"/"Play motion", label on hover or focus, no `aria-pressed`, the changing name carries the state, remembered, hidden without JS or WebGL); reduced motion starts paused; pauses off screen; canvas `aria-hidden`; static fallback without WebGL or JS.
FR-11: Exactly one primary hero button, "Explore our products", to Products.
FR-12: Stats band "Experience you can count on" at the bottom of the hero: 25+, 24/7, 20+, 8, 2; counts up once over 1.4s at 60% visible; 24/7 static; screen readers get final values; one shared component reused on Services and About.
FR-13: Products door and Services door directly under the hero, overlapping its bottom edge; each door one link; chips are text.
FR-14: After the doors: four-app bento, eight services, 4-D process, latest three stories, demo capture; tiles are stretched links with nothing interactive inside; service cards link to Services anchors; no stories hides the grid and keeps "See all news".
FR-15: Sticky Products sub-nav (PXP, LXP, SXP, IoT, Updates) highlights the section in view, Updates at page end; scrolls horizontally on narrow screens.
FR-16: PXP story phone with five tabs (Attendance, Grades, Messages, Payments, Events) crossfading screens, ARIA tab pattern, inactive screens unfocusable and hidden; four features; store buttons `[Placeholder]` until confirmed.
FR-17: LXP, SXP, IoT in browser frames with audience, four features and web address (`[Placeholder]` until confirmed); missing media shows an empty frame.
FR-18: Three Product stories under `#updates` plus "See all news"; none hides the grid.
FR-19: Real product screens or clips in device frames; clips never autoplay with sound, poster frame, visible play and pause, muted autoplay stops after 5s; devices float one cycle under 5s; tilt up to 8 degrees on hover-capable devices.
FR-20: Services hero with "Start a project", "See our 4-D process" and live HCMC and Dallas clocks (IANA zones, 30s refresh, server-rendered zone label).
FR-21: Eight services at `#product-engineering`, `#ai-analytics`, `#co-creation`, `#staffing`, `#custom-apps`, `#low-code`, `#ai-solutions`, `#cloud`.
FR-22: Three ways to work with us: Dedicated team, End-to-end delivery, Co-creation, each naming its service.
FR-23: 4-D process at `#process` from "Your request" to "Launch" with "You receive" per step; track fills over 2.4s at 30% visible, steps enter in turn, dot rests at Launch; reduced motion final state; rows aligned; below 1080px track and end nodes hide; one shared component for Home and Services.
FR-24: Industries EdTech, Healthcare, Logistics, Private Equity as static chips, plus USA, Europe and Australia time-zone note.
FR-25: News filters All, Product, Company, Schools, Team as `aria-pressed` toggles; exactly one active; instant; count announced; empty state with "Show all".
FR-26: Story page `/news/[slug]` with breadcrumbs, H1, date and category tag, photo, body, related product link, "Back to News"; dates `18 SEP 2026` EN and `18/09/2026` VI in mono; own title, meta, OG image.
FR-27: Editors create, edit and publish stories in both languages without a code change. `[ASSUMPTION]` CMS not chosen.
FR-28: About shows story, stats band and six core values at `#values` in office-banner wording.
FR-29: Leadership grid shown only once real people are confirmed; no names from the old site.
FR-30: Office cards with live local time, address and `tel:` link.
FR-31: Careers culture, four benefits ("Why you'll grow here") and Life at XionTechs photos at `#life`; placeholder frames never ship at public launch.
FR-32: Open roles when there are any, else "No open roles right now." with a route to `#talent`; editors add or close roles without code `[ASSUMPTION]`; no invented roles.
FR-33: Email capture band on every page except Book a demo; validation on submit with "Please enter a valid email address.", `aria-invalid`, `aria-describedby`, focus back, clears on typing; amber focus ring on navy bands; no modal pop-ups.
FR-34: Valid demo capture goes to `/demo#form` and project capture to `/demo#project` (Outsourcing tab, scrolled to form), email prefilled through session storage or server session, never in the URL.
FR-35: Valid subscribe or talent capture replaces the row with "Thanks, you're subscribed." or "Thanks, you're on the list." in a `role="status"` region.
FR-36: Two-tab contact form: hash picks the tab; fields per the EXPERIENCE.md field table; hidden-tab fields not validated, focusable or submitted but kept; submit marks invalid fields and focuses the first; sending, success and failure states.
FR-37: Preferred date cannot be before today in the visitor's time zone; picker starts at today; "Please choose today or a later date."
FR-38: Every Submission (demo, project, subscribe, join) reaches a XionTechs destination; honeypot and server-side rate limit stop spam. `[ASSUMPTION]` destination open.
FR-39: "Book a demo" only for the demo intent and "Start a project" only for the project intent, with EN and VI labels from the CTA table.
FR-40: Consent line under every form with the exact EXPERIENCE.md wording, ending with a "Privacy policy" link.
FR-41: Privacy policy at `/privacy` linked from every consent line and the footer, covering what is collected, use, retention, rights; no form goes live at public launch before the text is real.
FR-42: If non-essential cookies are added, a consent banner with decline as the default shows before they are set.
FR-43: Per page and locale: title, meta description, canonical URL, Open Graph tags, favicon.
FR-44: `hreflang` pairs for `/en/` and `/vi/`, plus `x-default` to `/en/`.
FR-45: Header, footer and News server-rendered; Organization and app JSON-LD on Home; content readable without JavaScript.
FR-46: FAQ on `/about#faq` with nine questions, disclosure pattern and FAQPage structured data.

### NonFunctional Requirements

NFR-1: WCAG 2.2 AA on every page in both locales: contrast 4.5:1 text, 3:1 large text, icons and field borders; amber text uses `#8A6700`, `#C99700` never text (AC-A11Y-1); visible focus on every surface (AC-A11Y-2); hidden content unfocusable (AC-A11Y-3); no interactive element inside a link (AC-A11Y-4); errors announced and linked (AC-A11Y-5); one H1; reading-order tab order; targets at least 24 x 24px; meaningful alt text in EN and VI.
NFR-2: Motion is controllable (WCAG 2.2.2): Home silk always has the toggle; every other decorative loop stops within 5s; reduced motion means no animation or transition anywhere and the silk starts paused.
NFR-3: Personal data under Vietnam PDPD (Decree 13/2023): collected only through forms for the stated purpose; never in URLs; retention period defined before public launch `[ASSUMPTION]`; no non-essential cookies without opt-in.
NFR-4: Performance: icon sets and third-party scripts never block rendering (AC-PERF-1); mobile p75 LCP at most 2.5s, INP at most 200ms, CLS at most 0.1 `[ASSUMPTION]`; fonts `display: swap` with `vietnamese` subset; silk pauses off screen.
NFR-5: SEO: locale URLs with `hreflang` and `x-default`; per-page metadata; server rendering; sitemap for both locales `[ASSUMPTION]`.
NFR-6: Latest two versions of Chrome, Edge, Safari (macOS, iOS), Firefox and Chrome on Android `[ASSUMPTION]`; layouts from 320px to wide desktop at 1080px, 900px, 640px; Vietnamese never truncates buttons.
NFR-7: Content integrity: no Lorem Ipsum or invented testimonials, logos, stats, people or roles; `[Placeholder]` prefix in both languages; `grep -rn "\[Placeholder\]"` empty before public launch.
NFR-8: Engineering quality gate before every PR: lint, typecheck, unit tests, 100% changed-line coverage, branch coverage at least 80% per changed file, Playwright smoke, build, local SonarQube gate (local only).

### Additional Requirements

No architecture document exists. The items below come from `AGENTS.md` and the PRD and are tagged `[ASSUMPTION]` where they go beyond what those sources state.

- Next.js 16 App Router with `src/`, React 19, TypeScript strict. Agents read `node_modules/next/dist/docs/` before writing code (AGENTS.md).
- Tailwind CSS v4 with all tokens in `src/app/globals.css` under `@theme` (AGENTS.md, DES > Brand & Style build mapping).
- shadcn/ui (to be added) as the base for the primitives named in DES > Components; Motion (to be added) for animation.
- Fonts via `next/font` with `subsets: ['latin', 'vietnamese']` (DES > Typography).
- Metadata API for titles, meta, canonical, Open Graph, favicon (EXP > Foundation).
- `[ASSUMPTION]` Locale segment `src/app/[locale]/...` with request-level redirect for bare `/`; exact Next.js 16 mechanism to be confirmed in the Next.js docs.
- `[ASSUMPTION]` Form submissions go through a server-side handler (server action or route handler) with honeypot and rate limit; destination is configured by environment and is an open question (PRD 12.10).
- `[ASSUMPTION]` Stories and roles ship as typed content files in the repo until a CMS is chosen, behind one content access module so a CMS can replace it (PRD 8.1).
- `[ASSUMPTION]` WebGL silk runs as a client-only component loaded after first paint so it never becomes the LCP element.
- `[ASSUMPTION]` A React icon package replaces the prototype's deferred Phosphor CDN script (AC-PERF-1).
- Vercel hosting with a public URL by Demo day 2026-10-09 (AGENTS.md).
- Git: branch from `develop`, `feature/<short-name>`, Conventional Commits, small PRs with one owner per feature, all three members commit, AI `Co-Authored-By` trailers kept, `docs/ai-log.md` updated for decisions that mattered (AGENTS.md).
- SonarQube runs locally only; never add `SONAR_HOST_URL`, `SONAR_TOKEN` or `sonar.host.url` (AGENTS.md).
- No starter template story: the Next.js project is already scaffolded with Vitest, Playwright smoke, diff-cover and the Sonar hook (AGENTS.md Commands). `[ASSUMPTION]` scaffold is on `develop` before Epic 1 starts.

### UX Design Requirements

UX-DR1: Map every `DESIGN.md` token to Tailwind `@theme` 1:1 (`--color-*`, `--font-display|brand|body|mono`, `--text-*`, `--radius-*`, `--spacing-*`, `--container-page`), plus build tokens: breakpoints 640/900/1080px, z layers (background -1, content 0, sub-nav 40, header 50, mega 55, mobile menu 60, toast 100, skip link 200), `--ease-brand`, durations, three shadows, fluid sizes. Map shadcn variables as listed in DES > Brand & Style.
UX-DR2: Four fonts with Vietnamese subset; `:lang(vi) h1, :lang(vi) h2 { line-height: 1.2 }`; no tightened tracking on Vietnamese uppercase.
UX-DR3: Scoped section surfaces `surface-paper`, `surface-mist`, `surface-navy`, `surface-amber`, `hero-silk`, `hero-light`, `hero-navy`, `hero-amber` with their text, link and focus tokens; colour rhythm per page (at least one navy band, at most one full-width amber band).
UX-DR4: Focus ring 2.5px, 3px offset, 8px radius; navy on light and amber, `{colors.focus-on-navy}` on navy; email capture row 3px ring in the scoped colour.
UX-DR5: Button variants `button-primary`, `button-navy`, `button-glass`, small size, press and hover states; one primary button per group.
UX-DR6: Site header (sticky glass, logo 32px, text-only 40px items, active navy bold with 2px amber underline) and mega menus, text only with no badges, icons or arrows (Products: name, value, "for" line, footer row; Services: the 8 service names, footer row).
UX-DR7: Mobile menu panel below 1080px, 40px round menu button, single-column mega content, Book a demo first at 640px and below.
UX-DR8: Language switch pill segment (ToggleGroup), active navy fill with white text.
UX-DR9: Skip link (amber pill on focus), breadcrumbs (mono, muted), highlight mark (one phrase per hero, 1.2s after 0.5s).
UX-DR10: Scroll reveal (26px rise, 0.9s, at 12% visible, 70ms stagger in fours, once) and global reduced-motion rule.
UX-DR11: Inner hero background: aurora and strand ribbon stop after 5s, ribbon pauses off screen, all `aria-hidden`.
UX-DR12: Home silk canvas with static fallback and Motion toggle (36px, ink 50%, white border 30%, 70% opacity at rest, label slides out on hover or focus).
UX-DR13: Stats band shared component (5/3/2 columns by breakpoint, suffix colour per surface, count-up).
UX-DR14: Process flow (4-D) shared component: six items, dashed track, step card anatomy, aligned "You receive" rows, stacked below 1080px.
UX-DR15: Spotlight card base (glass, pointer glow, 4px lift) with hover live immediately after reveal; Product tile (bento spans, badge swap, go arrow, stretched link); Service card (`feature`, `navy` variants).
UX-DR16: Front door panels (Products light gradient with four badges and chips; Services navy with service chips "+3 more").
UX-DR17: Device frame (tablet 4:3, phone 1170:2532), Media frame (empty grid state), Browser frame (mist bar, mono URL pill, 16:10).
UX-DR18: PXP story phone (260px, five stacked screens, pill tabs, 0.55s crossfade) and Product sub-nav (sticky glass pills, current navy, horizontal scroll).
UX-DR19: Office card and Clock strip (IANA zones, 30s refresh, server-rendered zone label, `tel:` link).
UX-DR20: Email capture band (H2 and lede left, form right; white pill row; 1.5px navy border on amber; error line; consent line; success status panel; stacks at 640px).
UX-DR21: Contact form card (paper, 28px radius, pill tabs, 2-column grid, checkbox pills, full-width message, primary submit, invalid border `{colors.error-border}`; error colour per surface).
UX-DR22: News card (16:10 photo, mono date, category tag, title, excerpt, "Read story"; first card on News is a wide feature), Category tag (product stories amber with app name), Filter chips (active navy).
UX-DR23: Value grid (3 x 2, hairlines, featured amber cell "Get IT Done" Attitude), Person card (4:5), Placeholder frame (dashed, Lexend Exa caption), Open roles panel (dashed).
UX-DR24: Industry chip (EdTech primary), Product badge (never the only way to tell apps apart).
UX-DR25: Site footer (ink, white logo plate, four columns with amber-tint Lexend Exa headings, GET IT **DONE** with DONE in amber) and Toast (ink pill, bottom centre, `role="status"`, about 2.6s).
UX-DR26: Responsive rules from EXP > Responsive & Platform at 1080px, 900px and 640px, including 16px gutters and stacked capture rows at 640px and below.

### FR Coverage Map

| FR | Epic | Story |
|---|---|---|
| FR-1 | Epic 1 | 1.3 |
| FR-2 | Epic 1 | 1.4 |
| FR-3 | Epic 1 | 1.3, 1.4 |
| FR-4 | Epic 1 | 1.2 |
| FR-5 | Epic 1 | 1.2 |
| FR-6 | Epic 1, 4, 5, 6 | 1.6, 4.1, 5.2, 5.4, 6.4 |
| FR-7 | Epic 1 | 1.5 |
| FR-8 | Epic 1 | 1.3 (skip link), 1.6 (breadcrumbs) |
| FR-9 | Epic 1 | 1.7 |
| FR-10 | Epic 3 | 3.2 |
| FR-11 | Epic 3 | 3.1 |
| FR-12 | Epic 3, 5, 6 | 3.3 (built), 5.2, 6.4 (reused) |
| FR-13 | Epic 3 | 3.4 |
| FR-14 | Epic 3 | 3.5, 3.6, 3.7 |
| FR-15 | Epic 4 | 4.1 |
| FR-16 | Epic 4 | 4.2 |
| FR-17 | Epic 4 | 4.3 |
| FR-18 | Epic 4 | 4.5 |
| FR-19 | Epic 4 | 4.4 |
| FR-20 | Epic 5 | 5.1 |
| FR-21 | Epic 5 | 5.2 |
| FR-22 | Epic 5 | 5.3 |
| FR-23 | Epic 3, 5 | 3.6 (built), 5.4 (`#process`) |
| FR-24 | Epic 5 | 5.3 |
| FR-25 | Epic 6 | 6.1 |
| FR-26 | Epic 6 | 6.2 |
| FR-27 | Epic 6 | 6.3 |
| FR-28 | Epic 6 | 6.4 |
| FR-29 | Epic 6 | 6.4 |
| FR-30 | Epic 5, 6 | 5.1 (clock), 6.4 (office cards) |
| FR-31 | Epic 6 | 6.5 |
| FR-32 | Epic 6 | 6.5, 6.3 |
| FR-33 | Epic 2 | 2.4 |
| FR-34 | Epic 2 | 2.4 |
| FR-35 | Epic 2, 6 | 2.4 (built), 6.1, 6.5 (placed) |
| FR-36 | Epic 2 | 2.2, 2.3 |
| FR-37 | Epic 2 | 2.2 |
| FR-38 | Epic 2 | 2.3 |
| FR-39 | Epic 2 | 2.2, 2.4 |
| FR-40 | Epic 2 | 2.2, 2.4 |
| FR-41 | Epic 2, 7 | 2.1, 7.5 (launch gate) |
| FR-42 | Epic 2 | 2.5 |
| FR-43 | Epic 7 | 7.1 |
| FR-44 | Epic 7 | 7.1 |
| FR-45 | Epic 7 | 7.2 |
| FR-46 | Epic 6 | 6.4 |

Result: 46 of 46 FRs covered. NFR-1 (1.1, 7.3), NFR-2 (1.1, 1.6, 3.2, 4.4), NFR-3 (2.3, 2.4, 2.5), NFR-4 (1.1, 3.2, 7.4), NFR-5 (7.1), NFR-6 (1.1, 1.4, 7.3), NFR-7 (all stories, 7.5), NFR-8 (all stories).

### AC-ID Coverage

| AC ID | Rule (short) | Stories |
|---|---|---|
| AC-NAV-1 | EN/VI switch at every width, never in the menu | 1.2, 1.4 |
| AC-NAV-2 | Book a demo reachable at every width (header above 640px, first menu item at 640px and below) | 1.3, 1.4 |
| AC-NAV-3 | Click never closes a hover-opened mega menu; Escape closes | 1.3 |
| AC-NAV-4 | Mobile menu Escape; `aria-controls`, `aria-expanded` | 1.4 |
| AC-NAV-5 | Anchors land with heading visible (`scroll-margin-top`) | 1.6, 4.1, 5.2, 5.4, 6.4 |
| AC-A11Y-1 | Contrast; `#8A6700` for amber text; `#C99700` never text | 1.1, 7.3 |
| AC-A11Y-2 | Visible focus on every surface; amber ring on navy incl. email field | 1.1, 2.4, 7.3 |
| AC-A11Y-3 | Hidden content not focusable | 1.4, 2.2, 4.2, 7.3 |
| AC-A11Y-4 | No interactive element inside a link | 3.4, 3.5, 7.3 |
| AC-A11Y-5 | `aria-invalid`, `aria-describedby`, announced errors | 2.2, 2.4, 7.3 |
| AC-FORM-1 | Preferred date not in the past | 2.2 |
| AC-FORM-2 | Project capture opens Outsourcing tab, scrolled to form | 2.4, 5.4 |
| AC-FORM-3 | Uploads and pastes change only the selected item | 6.3 |
| AC-UI-1 | Card hover starts without delay after reveal | 3.5 |
| AC-UI-2 | "You receive" rows align across 4-D cards | 3.6, 5.4 |
| AC-PERF-1 | Icons and third-party scripts never block rendering | 1.1, 7.4 |

Result: 16 of 16 AC IDs covered.

### Prototype Traceability

| Prototype page | Section or anchor | Story |
|---|---|---|
| `js/site.js` header template, all pages | `#site-header`: logo, text-only nav, mega menus, EN/VI, `.head-cta` Book a demo, `#burger` | 1.2, 1.3, 1.4 |
| `js/site.js` footer template, all pages | `#site-footer`: columns, offices, `.fbot` bottom bar | 1.5 |
| `css/site.css` | `@theme`-equivalent variables, `@media` 1080/900/640, reduced motion, `.menu-cta` 640px rules | 1.1, 1.4 |
| `index.html` | hero `section.hero-silk`, `.motion-toggle`, `canvas.silk`, `.silk-fallback` | 3.1, 3.2 |
| `index.html` | `.hero-stats` (`#stats-h`) | 3.3 |
| `index.html` | `section.doors` | 3.4 |
| `index.html` | bento (`#prod-h`), services (`#svc-h`) | 3.5 |
| `index.html` | 4-D process `ol.flow` (`#flow-h`) | 3.6 |
| `index.html` | news (`#news-h`), capture (`#cap-h`, `#cap-email`, `data-mode="demo"`) | 3.7, 2.4 |
| `products.html` | hero `section.hero-amber`, `nav.subnav` | 4.1 |
| `products.html` | `#pxp` (`#pxpPhone`, `.ptabs`, store buttons) | 4.2 |
| `products.html` | `#lxp`, `#sxp`, `#iot` | 4.3, 4.4 |
| `products.html` | `#updates`, capture (navy, `data-mode="demo"`) | 4.5 |
| `services.html` | hero `section.hero-navy`, `.clock-strip` | 5.1 |
| `services.html` | key facts stats, `#all-h` with 8 service anchors | 5.2 |
| `services.html` | `#ways-h`, `#ind-h` | 5.3 |
| `services.html` | `#process`, capture (amber, `data-mode="project"`) | 5.4 |
| `news.html` | hero, `.filters`, `#newsGrid`, `#newsCount`, `#newsEmpty`, subscribe capture | 6.1 |
| `news-story.html` | breadcrumbs, H1, date and tag, photo, body, related product, Back to News | 6.2 |
| `about.html` | hero, key facts stats, `#story-h`, `#values`, `#lead-h`, `#faq`, `#off-h`, capture | 6.4 |
| `careers.html` | hero, `#cul-h`, `#ben-h`, `#roles-h`, `#talent`, `#life` | 6.5 |
| `demo.html` | hero reassurance list and offices, `#form`, `.ftabs`, `#demoForm`, `.form-ok` | 2.2, 2.3 |
| `privacy.html` | hero, four policy sections | 2.1 |
| `404.html` | navy hero with four recovery links | 1.7 |

Result: 10 of 10 pages covered.

## Epic List

Order is chosen so no story depends on a later story. Contact and capture (Epic 2) comes before the content pages because every page after it embeds a capture band. Links to pages built in later epics resolve to the Not found page until those epics land; no acceptance criterion depends on them.

### Epic 1: Bilingual site shell
Any visitor can move through a branded, bilingual site from any width: header, mega menus, mobile menu, EN/VI, footer, breadcrumbs, anchors and a Not found page.
**FRs covered:** FR-1, FR-2, FR-3, FR-4, FR-5, FR-6, FR-7, FR-8, FR-9

### Epic 2: Contact, email capture and privacy (PDPD)
Lan and Quân can request a demo or start a project through one contact form or a capture band, every Submission reaches XionTechs, and every form is covered by a privacy policy.
**FRs covered:** FR-33, FR-34, FR-35, FR-36, FR-37, FR-38, FR-39, FR-40, FR-41, FR-42

### Epic 3: Home
Visitors see what the products do in five seconds and pick a front door: dark silk hero, one CTA, stats, doors, bento, services, 4-D process, latest news and demo capture.
**FRs covered:** FR-10, FR-11, FR-12, FR-13, FR-14, FR-23 (component)

### Epic 4: Products
School buyers and parents can explore every app, jump by sub-nav, try the PXP story phone and book a demo.
**FRs covered:** FR-6 (sub-nav offset), FR-15, FR-16, FR-17, FR-18, FR-19

### Epic 5: Services and 4-D process
Companies can judge the delivery team, see office hours overlap and the 4-D process, and start a project.
**FRs covered:** FR-6, FR-12 (reuse), FR-20, FR-21, FR-22, FR-23, FR-24, FR-30 (clock)

### Epic 6: News, About and Careers
Visitors read dated stories, learn who XionTechs is, and job seekers join the talent network; editors publish without a developer.
**FRs covered:** FR-25, FR-26, FR-27, FR-28, FR-29, FR-30, FR-31, FR-32, FR-35 (placement)

### Epic 7: SEO, performance and accessibility hardening
Visitors find the site in search in their language, and every page in both locales passes the accessibility, performance and launch-content gates.
**FRs covered:** FR-41 (launch gate), FR-43, FR-44, FR-45

## Epic 1: Bilingual site shell

Any visitor can move through a branded, bilingual site from any width. Stories 1.1 to 1.7 deliver the shared layout every later page renders inside.

### Story 1.1: Brand tokens, fonts, surfaces and motion primitives

As Lan, a principal reading on her office laptop,
I want every page to share one navy, amber and white look with readable Vietnamese type,
So that the site feels like one trustworthy company in either language.

- **Design reference:** `mockups/site-v3/css/site.css` (variables, `@media` 1080/900/640, `prefers-reduced-motion`); `mockups/site-v3/index.html` section surfaces
- **Spec references:** DES > Brand & Style (build mapping), Colors, Typography, Layout & Spacing (Build tokens), Elevation & Depth, Shapes, Components (Button, Focus ring); EXP > Motion (Scroll reveal, Reduced motion), Accessibility Floor
- **Requirements:** NFR-1, NFR-2, NFR-4, NFR-6; UX-DR1, UX-DR2, UX-DR3, UX-DR4, UX-DR5, UX-DR10, UX-DR26
- **AC IDs:** AC-A11Y-1, AC-A11Y-2, AC-PERF-1
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** L

**Acceptance Criteria:**

**Given** `src/app/globals.css`
**When** the build runs
**Then** every `DESIGN.md` token exists in `@theme` under its mapped name (`--color-*`, `--font-*`, `--text-*`, `--radius-*`, `--spacing-*`, `--container-page`)
**And** breakpoints are 640px, 900px and 1080px, z layers, `--ease-brand`, durations and the three shadows match the Build tokens table.

**Given** any page in `vi`
**When** it renders
**Then** Unbounded, Lexend Exa, Be Vietnam Pro and JetBrains Mono load through `next/font` with the `vietnamese` subset and `display: swap`
**And** H1 and H2 have line-height 1.2 through `:lang(vi)`.

**Given** amber text or an amber icon on paper, page or mist
**When** a contrast check runs
**Then** it uses `{colors.amber-text}` `#8A6700` and no text or icon uses `#C99700` (AC-A11Y-1).

**Given** a focusable element on paper, mist, amber and navy surfaces
**When** it gets keyboard focus
**Then** a 2.5px ring with 3px offset shows in navy on light and amber and in `{colors.focus-on-navy}` on navy (AC-A11Y-2).

**Given** any icon on any page
**When** the page loads
**Then** icons come from a React icon package and no icon or third-party script blocks rendering (AC-PERF-1).

**Given** `prefers-reduced-motion: reduce`
**When** any page loads
**Then** no animation or transition runs and revealed content shows in its final state
**And** without JavaScript every section is visible.

**Given** the three button variants
**When** rendered on light, navy and amber surfaces
**Then** `button-primary` has navy text on amber, `button-navy` is used as the main action on amber, and no button puts white text on amber.

### Story 1.2: Locale routing and EN/VI switch

As Hà, a parent on her phone,
I want to switch the site to Vietnamese from the header on any page,
So that I can read everything in my language without losing my place.

- **Design reference:** `mockups/site-v3/js/site.js` header template (language switch next to `.head-cta`)
- **Spec references:** EXP > Information Architecture (Locale routing), Component Patterns (Language switch), Bilingual (EN / VI), Voice and Tone; DES > Components (Language switch)
- **Requirements:** FR-4, FR-5; UX-DR8
- **AC IDs:** AC-NAV-1
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** L

**Acceptance Criteria:**

**Given** a first visit to `/` with no saved choice
**When** the browser prefers Vietnamese
**Then** the visitor is redirected to `/vi/`, otherwise to `/en/`
**And** with a saved choice the saved locale wins.

**Given** a shared link `/en/products`
**When** a visitor with a saved `vi` choice opens it
**Then** the page opens in English (URL locale wins).

**Given** a path without a locale, such as `/products`
**When** it is requested
**Then** it redirects to the same path under the resolved locale.

**Given** any page at 320px, 640px, 900px, 1080px and wide desktop
**When** it renders
**Then** the EN/VI switch is visible in the header bar, is never inside the mobile menu, and is a group labelled "Language" with two toggle buttons using `aria-pressed` (AC-NAV-1).

**Given** a visitor mid-page with text typed in a form
**When** they press VI
**Then** they land on the same page under `/vi/`, at the same scroll position, with typed values kept
**And** `lang`, title and meta description are Vietnamese and the choice is saved for the next visit.

**Given** the EN and VI string sets
**When** unit tests run
**Then** a key present in one locale and missing in the other fails the test
**And** product and service names are identical in both locales.

### Story 1.3: Desktop header, mega menus and skip link

As Quân, a CTO between meetings,
I want a clear header whose Services menu opens predictably,
So that I can reach any service or Book a demo in one move.

- **Design reference:** `mockups/site-v3/js/site.js` header template (`#site-header`, `.skip`, mega panels with "More products are on the way." and "See the process", `.head-cta`)
- **Spec references:** EXP > Information Architecture (Header navigation), Component Patterns (Site header, Mega menu, Skip link, Button), Interaction Primitives, Motion (Mega menu); DES > Components (Site header, Mega menu, Product badge, Skip link)
- **Requirements:** FR-1, FR-3, FR-8; UX-DR6, UX-DR9, UX-DR24
- **AC IDs:** AC-NAV-2, AC-NAV-3
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** L

**Acceptance Criteria:**

**Given** any page above 1080px
**When** the header renders
**Then** it is sticky glass with the logo linking Home, Products, Services, News, About, Careers
**And** Products and Services are text only with no caret icon and share the plain links' 40px height and alignment
**And** the current page carries `aria-current="page"` and shows navy bold text with a 2px amber underline.

**Given** a hover-capable desktop
**When** the pointer enters Products and then the visitor clicks Products
**Then** the menu stays open (AC-NAV-3)
**And** leaving closes it after 150ms, Escape closes it and returns focus to the trigger, opening Services closes Products, and a click outside closes both
**And** triggers expose `aria-expanded`.

**Given** the Products mega menu
**When** it opens
**Then** it lists PXP (Parents), LXP (Students), SXP (Staff, Teachers, Leaders), IoT Device Management (School staff and facilities) with name, value and "for" line (text only: no badges, icons or arrows), then "More products are on the way." and "All products"
**And** products come from one data list so a new product is one new row.

**Given** the Services mega menu
**When** it opens
**Then** all 8 services link to their `/services#...` anchors and the footer row links "See the process" to `/services#process`.

**Given** a keyboard user on any page
**When** they press Tab once
**Then** "Skip to content" appears as an amber pill and activating it moves focus to `main`
**And** every mega menu item is reachable by keyboard.

**Given** a viewport wider than 640px
**When** the header renders
**Then** the Book a demo button sits right next to the EN/VI switch and links to `/demo#form` (AC-NAV-2).

**Given** reduced motion
**When** a mega menu opens
**Then** it appears without the 0.3s fade and drop.

### Story 1.4: Mobile menu

As Hà, a parent on her phone,
I want a menu I can open, expand Products in, and close with the keyboard or a tap,
So that I can reach PXP and Book a demo on a small screen.

- **Design reference:** `mockups/site-v3/js/site.js` header template (`#burger`, `#menu`, `.menu-cta`); `mockups/site-v3/css/site.css` rules at 1080px and 640px (`.head-cta`, `.menu-cta`)
- **Spec references:** EXP > Component Patterns (Mobile menu), Responsive & Platform (Header at every width), Accessibility Floor; DES > Components (Mobile menu)
- **Requirements:** FR-2, FR-3; NFR-6; UX-DR7, UX-DR26
- **AC IDs:** AC-NAV-1, AC-NAV-2, AC-NAV-4, AC-A11Y-3
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** M

**Acceptance Criteria:**

**Given** a viewport at 1080px or below
**When** the menu button renders
**Then** it shows the text "Menu" with no icon, and its accessible name is "Menu".

**Given** a viewport at 1080px or below
**When** the header renders
**Then** the nav collapses behind a 40px-high pill button reading "Menu" (no icon) with `aria-controls` and `aria-expanded` (AC-NAV-4).

**Given** the mobile menu is open
**When** the visitor presses Escape
**Then** it closes and focus returns to the menu button (AC-NAV-4)
**And** while open the background does not scroll and focus stays inside the menu.

**Given** the mobile menu is closed
**When** a keyboard user tabs through the page
**Then** no menu item receives focus (AC-A11Y-3).

**Given** the menu is open
**When** the visitor expands Products
**Then** the mega content expands inline as a single column and PXP links to `/products#pxp`.

**Given** a viewport of 640px or below
**When** the menu opens
**Then** Book a demo is its first item in button style and is not shown in the header bar (AC-NAV-2).

**Given** a viewport between 641px and 1080px
**When** the header renders
**Then** Book a demo stays next to the EN/VI switch in the header and is not duplicated in the menu (AC-NAV-2).

**Given** any width
**When** the menu opens or closes
**Then** the EN/VI switch stays in the header bar (AC-NAV-1).

### Story 1.5: Site footer

As Quân, a CTO checking time zones,
I want both offices and key links in the footer of every page,
So that I can call or navigate from wherever I am.

- **Design reference:** `mockups/site-v3/js/site.js` footer template (`#site-footer`, `.fbot`)
- **Spec references:** EXP > Information Architecture (Footer), Component Patterns (Site footer); DES > Components (Site footer)
- **Requirements:** FR-7; UX-DR25
- **AC IDs:** none
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** S

**Acceptance Criteria:**

**Given** any page in either locale
**When** the footer renders
**Then** it shows the logo and blurb, Products (PXP, LXP, SXP, IoT Device Management, Product updates), Services (Product Engineering, AI-Driven Analytics, Staffing Service, Low-code Solutions, Cloud Computing, All services), Company (About, Core values, News, Careers, Contact) and Offices.

**Given** the Offices column
**When** it renders
**Then** Ho Chi Minh City reads "Viettel Tower, Floor 12, 285 CMT8, HCMC 70064" with `tel:+84908107552` and Dallas, USA reads "Texas, United States" with `tel:+14693229899`
**And** no Da Nang office and no second HCMC address appear.

**Given** the bottom bar
**When** it renders
**Then** it shows copyright, a "Privacy policy" link to `/privacy` and the GET IT DONE tag with DONE in amber.

**Given** 900px and 640px
**When** the footer renders
**Then** it uses 2 columns and 1 column respectively.

### Story 1.6: Inner page hero, breadcrumbs and anchor landing

As Lan, following a link to a section,
I want the section heading to land fully visible and to see where I am,
So that I never read a page with its title hidden under the header.

- **Design reference:** `mockups/site-v3/news.html` hero (`hero-light`, `nav.crumbs`), `services.html` hero (`hero-navy`, `canvas.strands`), `products.html` hero (`hero-amber`)
- **Spec references:** EXP > Component Patterns (Breadcrumbs, Highlight mark), Interaction Primitives, Motion (Inner page hero background, Highlight mark); DES > Layout & Spacing (Anchors), Colors (hero surfaces)
- **Requirements:** FR-6, FR-8; NFR-2; UX-DR9, UX-DR11
- **AC IDs:** AC-NAV-5
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** M

**Acceptance Criteria:**

**Given** any inner page
**When** it renders
**Then** mono breadcrumbs show a Home link and the current page name above the H1, and Home shows none.

**Given** an in-page link to any anchor target
**When** it is followed
**Then** the target heading is fully visible below the sticky header using `scroll-margin-top` from `{spacing.anchor-offset}`, measured against the built header height (AC-NAV-5)
**And** scrolling is smooth except under reduced motion.

**Given** a `hero-light`, `hero-navy` or `hero-amber` inner hero
**When** it loads
**Then** aurora and the strand ribbon move, stop within 5s and hold the frame, and the ribbon pauses off screen
**And** all background art is `aria-hidden`.

**Given** a hero headline with a highlight mark
**When** it appears
**Then** one phrase gets the mark, drawn in over 1.2s after 0.5s, and it is static under reduced motion.

### Story 1.7: Not found page

As any visitor on a broken link,
I want a clear message and a way back in my language,
So that a dead link does not end my visit.

- **Design reference:** `mockups/site-v3/404.html` navy hero
- **Spec references:** EXP > Information Architecture (Not found)
- **Requirements:** FR-9
- **AC IDs:** none
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** S

**Acceptance Criteria:**

**Given** an unknown path under `/en/` or `/vi/`
**When** it is requested
**Then** the response status is 404 `[ASSUMPTION]` and the page shows "We couldn't find that page." (VI "Không tìm thấy trang này.") with the lede "The link may be old or mistyped. These pages can help."
**And** one primary "Go to Home" button plus glass links to Products, Services and News, all in the current locale.

**Given** the Not found page
**When** it renders
**Then** header and footer are present and there is exactly one H1.

## Epic 2: Contact, email capture and privacy (PDPD)

Lan and Quân can reach XionTechs through one form or any capture band, every Submission is delivered and protected, and the privacy policy covers all of it.

### Story 2.1: Privacy policy page

As Lan, about to leave my work email,
I want to read how XionTechs uses my data,
So that I can trust the form.

- **Design reference:** `mockups/site-v3/privacy.html` hero and eight policy sections
- **Spec references:** EXP > Information Architecture (Privacy policy), Voice and Tone (`[Placeholder]` convention), Open Questions
- **Requirements:** FR-41; NFR-3, NFR-7
- **AC IDs:** none
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** S

**Acceptance Criteria:**

**Given** `/privacy` in either locale
**When** it renders
**Then** it shows breadcrumbs, the H1 "Privacy policy." and sections "Who we are and how to reach us", "What we collect", "How we use it", "Who we share it with", "Transfers outside Vietnam", "How long we keep it", "Cookies and analytics", "Your rights" in EN and VI (PDPD, Decree 13/2023).

**Given** the policy text is not yet supplied by its legal owner
**When** the page renders
**Then** every unverified paragraph starts with `[Placeholder]` in both languages.

**Given** the footer
**When** "Privacy policy" is followed
**Then** it opens `/privacy` in the current locale.

### Story 2.2: Two-tab contact form

As Lan, a principal booking a demo,
I want one clear form that asks only what is needed and blocks mistakes,
So that my request is complete the first time.

- **Design reference:** `mockups/site-v3/demo.html` hero (reassurance list, offices) and `#form` card (`.ftabs`, `#demoForm`, fields `#f-name` to `#f-msg`)
- **Spec references:** EXP > Component Patterns (Contact form), Contact form fields, State Patterns (Contact form), Voice and Tone (CTA labels, Wording to reuse), Accessibility Floor; DES > Components (Contact form), Layout & Spacing (Forms)
- **Requirements:** FR-36, FR-37, FR-39, FR-40; UX-DR21
- **AC IDs:** AC-A11Y-3, AC-A11Y-5, AC-FORM-1
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** L

**Acceptance Criteria:**

**Given** `/demo`
**When** it renders
**Then** a navy hero shows breadcrumbs "Home / Contact", the H1, three reassurance items and both offices, with the paper form card beside it on desktop and stacked below 900px
**And** no email capture band appears on this page.

**Given** the URL hash `#project`
**When** the page loads
**Then** the Outsourcing project tab is selected; any other or no hash selects Product demo
**And** tabs follow the ARIA tab pattern.

**Given** the field table
**When** each tab is shown
**Then** both tabs show Full name, Work email, School or company (required) and Role (optional, help "For example: Principal, Head of IT") and Message (optional)
**And** Product demo adds Products of interest (PXP, LXP, SXP, IoT pills, PXP checked by default), School size (Under 500 students; 500 to 1,500 students; Over 1,500 students; Multiple campuses) and Preferred date
**And** Outsourcing project adds Service (the 8 services plus "Not sure yet") and Start timing (As soon as possible; In 1 to 3 months; Just exploring).

**Given** the Outsourcing tab is active
**When** a keyboard user tabs through the form
**Then** Product demo fields cannot take focus, are not validated and are not submitted, and their typed values return when the visitor switches back (AC-A11Y-3).

**Given** empty required fields and a malformed email
**When** Quân presses "Send request"
**Then** each invalid field gets `aria-invalid="true"`, is linked to its error with `aria-describedby`, the errors are announced, and focus moves to the first invalid field (AC-A11Y-5)
**And** the wording is "Please enter your name.", "Please enter a valid email address." and "Please enter your organisation."; free-mail domains are accepted.

**Given** the Preferred date picker
**When** Lan opens it
**Then** it starts at today in her time zone and a date before today shows "Please choose today or a later date." (AC-FORM-1).

**Given** a message over 2,000 characters
**When** the form is submitted
**Then** it shows "Please keep your message under 2,000 characters."

**Given** the form card
**When** it renders
**Then** the submit reads "Send request" ("Gửi yêu cầu") and the consent line reads "We only use your details to respond to this request." followed by a "Privacy policy" link to `/privacy`.

### Story 2.3: Submission delivery and spam protection

As Quân, sending a project request,
I want clear feedback while it sends and my details kept if it fails,
So that I never retype a request or wonder if it arrived.

- **Design reference:** `mockups/site-v3/demo.html` `.form-ok` success panel (prototype suffix "Prototype: nothing was sent." is not shipped)
- **Spec references:** EXP > Component Patterns (Contact form), State Patterns (Contact form), Open Questions (Form destination, Behaviour without JavaScript)
- **Requirements:** FR-36, FR-38; NFR-3
- **AC IDs:** none
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** M

**Acceptance Criteria:**

**Given** a valid contact form
**When** it is submitted
**Then** the button is disabled and reads "Sending..." ("Đang gửi...")
**And** on success the form is replaced by a `role="status"` panel reading "Thank you!" and "We will be in touch soon."

**Given** the server rejects or times out
**When** the send fails
**Then** every entered value is kept and an error shows above the button with a way to retry.

**Given** a submission with the hidden honeypot field filled, or more submissions from one source than the rate limit allows
**When** it reaches the server
**Then** it is rejected and not delivered
**And** a real visitor who hits the rate limit sees a retryable error and keeps what they typed.

**Given** a valid demo, project, subscribe or join Submission
**When** it is accepted
**Then** it is delivered to the destination set in server configuration `[ASSUMPTION]` (inbox or CRM is an open question)
**And** no personal data appears in any URL, query string or hash.

### Story 2.4: Email capture band (demo, project, subscribe, join)

As Lan, reading the Products page,
I want to leave only my work email and land on a form already started,
So that booking a demo takes a few clicks.

- **Design reference:** `mockups/site-v3/index.html` capture (`#cap-h`, `#cap-email`, amber, `data-mode="demo"`); `services.html` capture (amber, `data-mode="project"`); `news.html` capture (navy, subscribe); `careers.html#talent` (navy, join)
- **Spec references:** EXP > Component Patterns (Email capture), State Patterns (Email capture), Voice and Tone (CTA labels, Wording to reuse), Interaction Primitives; DES > Components (Email capture, Focus ring), Colors (error on navy)
- **Requirements:** FR-33, FR-34, FR-35, FR-39, FR-40; NFR-3; UX-DR20
- **AC IDs:** AC-A11Y-2, AC-A11Y-5, AC-FORM-2
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** L

**Acceptance Criteria:**

**Given** one shared capture component with a kind of demo, project, subscribe or join
**When** it renders
**Then** the button reads "Book a demo", "Start a project", "Subscribe" or "Join" (VI "Đặt lịch demo", "Bắt đầu dự án", "Đăng ký", "Tham gia")
**And** it is an inline band with H2 and lede left and the form right, never a modal.

**Given** each kind
**When** it renders
**Then** the consent line reads, respectively, "We only use your email to arrange your demo.", "We only use your details to respond to this request.", "We only use your email to send XionTechs news. You can unsubscribe at any time." and "We only use your email to contact you about matching roles.", each ending with a "Privacy policy" link.

**Given** an invalid email
**When** the visitor submits
**Then** "Please enter a valid email address." shows inline and is announced, the field gets `aria-invalid="true"` and `aria-describedby`, focus returns to the field, and the error clears as the visitor types (AC-A11Y-5).

**Given** a capture band on a navy surface
**When** the email field has keyboard focus
**Then** the row shows a 3px ring in `{colors.focus-on-navy}` (AC-A11Y-2)
**And** on amber bands the white row has a 1.5px navy border and error text uses `{colors.error}`; on navy it uses `{colors.error-on-navy}`.

**Given** a valid demo capture
**When** submitted
**Then** the visitor lands on `/demo#form`, Product demo tab, with Work email prefilled.

**Given** a valid project capture
**When** submitted
**Then** the visitor lands on `/demo#project` with the Outsourcing project tab selected, scrolled to the form, and Work email prefilled (AC-FORM-2)
**And** in both cases the email travels through session storage or a server session, never the URL
**And** it is cleared once read on `/demo` and never overwrites a value already typed.

**Given** a valid subscribe or join capture
**When** submitted
**Then** the row is replaced by "Thanks, you're subscribed." or "Thanks, you're on the list." in a `role="status"` region.

**Given** 640px and below
**When** the band renders
**Then** the field stacks above the button.

**Given** `/demo` at any width
**When** the page renders
**Then** no capture band is shown (the page is the form).

### Story 2.5: No non-essential cookies without consent

As Nam, a visitor who cares about privacy,
I want the site to set no tracking cookies unless I opt in,
So that my data is handled under Vietnam's PDPD.

- **Design reference:** none (no banner in the prototype)
- **Spec references:** EXP > Open Questions (Analytics and cookies), Foundation (Stakes)
- **Requirements:** FR-42; NFR-3
- **AC IDs:** none
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** S

**Acceptance Criteria:**

**Given** v1 with no analytics
**When** any page loads in a fresh browser
**Then** an automated test finds no non-essential or third-party cookies
**And** the only stored values are the locale and motion preferences (local storage) and the capture email (session storage, cleared once read on `/demo`) `[ASSUMPTION]`.

**Given** analytics or another non-essential cookie is added later
**When** a page first loads
**Then** a consent banner shows with decline as the default and no such cookie is set before the visitor accepts.

## Epic 3: Home

Visitors understand the products in five seconds and choose a front door.

### Story 3.1: Dark Home hero with one CTA

As Lan, arriving from search,
I want a headline, real product screens and one obvious next step,
So that I know in seconds what XionTechs makes for schools.

- **Design reference:** `mockups/site-v3/index.html` hero (`section.hero-silk`, `.home-grid`, `.devices`, `.cta-row`)
- **Spec references:** EXP > Information Architecture (Home), Component Patterns (Button, Device frame, Media frame, Highlight mark); DES > Colors (`hero-silk`), Layout & Spacing (Home hero), Components (Device frame)
- **Requirements:** FR-11, FR-10 (layout and fallback); UX-DR3, UX-DR17
- **AC IDs:** none
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** M

**Acceptance Criteria:**

**Given** Home in either locale
**When** it renders
**Then** the hero is dark `hero-silk` filling `100dvh` minus the header, with the label "EdTech products · Software services", the H1 "Every school community, connected." (highlight on "connected") and the sub line from the prototype.

**Given** the hero
**When** a tester counts buttons and button-styled links
**Then** there is exactly one primary CTA, "Explore our products" ("Khám phá sản phẩm"), linking to `/products`, and no other CTA apart from the motion toggle.

**Given** the device column
**When** it renders
**Then** a tablet and a phone frame show real product screens, or an empty media frame when an asset is missing, never a broken image.

**Given** no WebGL or no JavaScript
**When** Home loads
**Then** the static navy and amber glow fallback shows and all hero text is readable.

**Given** 900px and below
**When** the hero renders
**Then** text and devices stack to one column and devices are at most 560px wide.

### Story 3.2: Continuous silk animation and motion toggle

As Lan, who finds constant motion distracting,
I want a discreet way to stop the moving background that the site remembers,
So that I can read in peace on every visit.

- **Design reference:** `mockups/site-v3/index.html` hero (`canvas.silk`, `.motion-toggle`); `js/site.js` silk loop and `xt3-motion` preference
- **Spec references:** EXP > Motion (Home hero background), Component Patterns (Motion toggle); DES > Colors (`hero-silk`), Components (Motion toggle)
- **Requirements:** FR-10; NFR-2, NFR-4; UX-DR12
- **AC IDs:** none
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** L

**Acceptance Criteria:**

**Given** Home with motion allowed
**When** the hero is on screen
**Then** the silk cloth ripples slowly and continuously (time scale 0.35 in the prototype `site.js`) and the canvas is `aria-hidden`.

**Given** the motion toggle at the top right of the hero
**When** it is at rest
**Then** it is a discreet 36px round icon button at 70% opacity with its label hidden visually
**And** its accessible name is always "Pause motion" or "Play motion" (VI "Tạm dừng chuyển động" or "Chạy chuyển động").

**Given** a pointer hover or keyboard focus on the toggle
**When** it activates
**Then** the text label slides out.

**Given** the visitor presses the toggle
**When** the silk pauses
**Then** the icon and accessible name switch to Play motion (no `aria-pressed`), and the choice is remembered and wins on the next visit.

**Given** `prefers-reduced-motion: reduce`
**When** Home loads
**Then** the silk starts paused with no transition.

**Given** the hero scrolls off screen
**When** it is not visible
**Then** the animation pauses and resumes only if the visitor has not paused it.

**Given** a mobile Lighthouse run
**When** Home loads
**Then** the silk loads after first paint and is not the LCP element `[ASSUMPTION]`.

### Story 3.3: Stats band inside the hero

As Quân, judging the team fast,
I want five confirmed figures at the bottom of the hero,
So that I can see experience and coverage without scrolling.

- **Design reference:** `mockups/site-v3/index.html` `.hero-stats` (`#stats-h`)
- **Spec references:** EXP > Component Patterns (Stats band), Motion (Stats); DES > Components (Stats band)
- **Requirements:** FR-12; UX-DR13
- **AC IDs:** none
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** M

**Acceptance Criteria:**

**Given** the Home hero
**When** it renders
**Then** the label "Experience you can count on" ("Kinh nghiệm bạn có thể tin cậy") sits at the bottom of the hero above five figures: 25+ years of leadership experience in software, 24/7 global coverage across time zones, 20+ technology stacks, 8 service offerings, 2 offices (Ho Chi Minh City and Dallas).

**Given** the band becomes 60% visible
**When** it animates
**Then** numbers count up once over 1.4s with ease out and "24/7" does not count
**And** screen readers get only the final values and reduced motion shows final values.

**Given** one shared component
**When** used on navy and light surfaces
**Then** suffixes use `{colors.amber}` on navy and `{colors.amber-text}` on light, and figures and captions are passed in as data.

**Given** above 1080px, 1080px and below, and 640px and below
**When** the band renders
**Then** it shows 5, 3 and 2 columns.

### Story 3.4: Two front doors

As Quân, arriving from a referral,
I want a clear outsourcing door right under the hero,
So that I can go straight to services.

- **Design reference:** `mockups/site-v3/index.html` `section.doors` (`.door-products`, `.door-services`)
- **Spec references:** EXP > Component Patterns (Front door); DES > Components (Front door), Layout & Spacing (Home hero)
- **Requirements:** FR-13; UX-DR16
- **AC IDs:** AC-A11Y-4
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** S

**Acceptance Criteria:**

**Given** Home
**When** the doors render
**Then** "Products for schools" and "Your software delivery team" sit directly under the hero, overlapping its bottom by 104px (80px at 900px and below), and stack at 900px and below.

**Given** each door
**When** inspected
**Then** the whole panel is one link (Products door to `/products`, Services door to `/services`) and its badges and chips are text with no interactive element inside the link (AC-A11Y-4).

### Story 3.5: Four-app bento and eight service cards

As Lan, scanning what exists,
I want one tile per app and one card per service that take me to the details,
So that I can go deeper on the one I care about.

- **Design reference:** `mockups/site-v3/index.html` bento (`#prod-h`, `.tile.t-pxp` stretched link) and services (`#svc-h`, `.svc-grid`)
- **Spec references:** EXP > Component Patterns (Product tile, Service card, Spotlight card, Product badge); DES > Components (Product tile, Service card, Spotlight card, Product badge)
- **Requirements:** FR-14; UX-DR15, UX-DR24
- **AC IDs:** AC-A11Y-4, AC-UI-1
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** M

**Acceptance Criteria:**

**Given** the bento "Four apps. One school day."
**When** it renders above 900px
**Then** PXP spans 7 columns and 2 rows in amber, SXP spans 5 in navy, LXP spans 3 and IoT spans 2, with badges swapped for contrast on PXP and SXP and the app name next to every badge.

**Given** each tile
**When** inspected
**Then** it is one link to `/products#pxp`, `#lxp`, `#sxp` or `#iot` using a stretched link, and the mini phone inside is not interactive (AC-A11Y-4).

**Given** "Eight ways we get IT done for you."
**When** it renders
**Then** 8 service cards link to their `/services` anchors in 4, 2 and 1 columns by breakpoint.

**Given** a hover-capable device after scroll reveal has finished
**When** the pointer enters a tile or card
**Then** the pointer glow and 4px lift start immediately with no delay (AC-UI-1)
**And** no pointer effect runs on touch devices.

### Story 3.6: 4-D process flow component

As Quân, deciding if this team is organised,
I want to see the four delivery steps and what I receive at each,
So that I know what working together looks like.

- **Design reference:** `mockups/site-v3/index.html` `ol.flow` (`#flow-h`); same block in `services.html#process`
- **Spec references:** EXP > Component Patterns (Process flow (4-D)), Motion (4-D process); DES > Components (Process flow (4-D))
- **Requirements:** FR-23, FR-14; UX-DR14
- **AC IDs:** AC-UI-2
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** M

**Acceptance Criteria:**

**Given** one shared component on Home's navy band
**When** it renders
**Then** it shows "Your request", 01 Discovery, 02 Design, 03 Development, 04 Deployment and "Launch" as an ordered list, each step with its line and "You receive" text from the prototype.

**Given** the flow becomes 30% visible
**When** it animates
**Then** the track fills with amber over 2.4s, steps enter at 0.3s, 0.85s, 1.4s and 1.95s, and a dot travels once and rests at Launch
**And** reduced motion shows the final state immediately.

**Given** above 1080px
**When** the four cards render
**Then** the "You receive" rows align on one line across all four cards in EN and VI (AC-UI-2).

**Given** 1080px and below, and 640px and below
**When** the flow renders
**Then** the track and end nodes hide and steps show in 2 columns, then 1 column.

### Story 3.7: Latest news, demo capture and Home section rhythm

As Lan, finishing the Home page,
I want recent news and a quick way to ask for a demo,
So that I see the company is active and can act at once.

- **Design reference:** `mockups/site-v3/index.html` news (`#news-h`, `.news-grid`, "See all news") and capture (`#cap-h`)
- **Spec references:** EXP > Information Architecture (Home), Component Patterns (News card, Category tag), State Patterns (Home news); DES > Components (News card, Category tag), Layout & Spacing (Page colour rhythm)
- **Requirements:** FR-14, FR-33 (placement); UX-DR3, UX-DR22
- **AC IDs:** none
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** M

**Acceptance Criteria:**

**Given** a story content source `[ASSUMPTION]` (typed files in the repo behind one access module)
**When** Home renders "Latest from XionTechs."
**Then** the three newest stories show as news cards with mono date, category tag (product stories append the app name), title, excerpt and "Read story" linking to `/news/[slug]`
**And** when fewer than three stories exist, only those show, with no empty slots.

**Given** no stories
**When** Home renders
**Then** the news grid is hidden and "See all news" stays.

**Given** sample stories
**When** they render
**Then** they and the sample note start with `[Placeholder]`.

**Given** the end of Home
**When** it renders
**Then** the amber demo capture "See it working at your school." from Story 2.4 is shown.

**Given** Home top to bottom
**When** a tester checks surfaces
**Then** after the dark hero every section is light (doors, products mist with linen, services paper, news mist) apart from the navy 4-D band and the one amber capture band.

## Epic 4: Products

School buyers and parents explore every app and book a demo from one page.

### Story 4.1: Products hero and sticky sub-nav

As Hà, arriving from the mobile menu at `#pxp`,
I want the PXP heading visible under the header and a sub-nav to jump between apps,
So that I land exactly where I meant to.

- **Design reference:** `mockups/site-v3/products.html` hero (`section.hero-amber`, Book a demo, Product updates) and `nav.subnav`
- **Spec references:** EXP > Information Architecture (Products), Component Patterns (Product sub-nav); DES > Components (Product sub-nav), Layout & Spacing (Anchors, Page colour rhythm)
- **Requirements:** FR-15, FR-6; UX-DR18
- **AC IDs:** AC-NAV-5
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** M

**Acceptance Criteria:**

**Given** `/products`
**When** it renders
**Then** an amber hero shows breadcrumbs, the H1 "Four apps. One connected school.", device frames, a navy "Book a demo" button to `/demo#form` and a glass "Product updates" link to `#updates`.

**Given** the sticky sub-nav under the header
**When** Lan scrolls
**Then** PXP, LXP, SXP, IoT and Updates highlight the section in view in navy, and Updates is highlighted at the end of the page.

**Given** a link to `#pxp`, `#lxp`, `#sxp`, `#iot` or `#updates` from the sub-nav, mega menu or another page
**When** it is followed
**Then** the section heading is fully visible below both the header and the sub-nav using `{spacing.anchor-offset-subnav}` (AC-NAV-5).

**Given** 640px and below
**When** the sub-nav renders
**Then** it scrolls horizontally and no item wraps or truncates in VI.

### Story 4.2: PXP story phone

As Hà, a parent,
I want to tap through what PXP shows a parent,
So that I know what my child's school app does before I install it.

- **Design reference:** `mockups/site-v3/products.html#pxp` (`#pxpPhone`, `.ptabs`, feature list, store buttons)
- **Spec references:** EXP > Component Patterns (PXP story phone + phone tabs), Motion (Story phone), Key Flows (Flow 3); DES > Components (PXP story phone + phone tabs)
- **Requirements:** FR-16; UX-DR18
- **AC IDs:** AC-A11Y-3
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** M

**Acceptance Criteria:**

**Given** the PXP section "The school day, in a parent's pocket."
**When** it renders
**Then** a 260px phone holds five screens with pill tabs Attendance, Grades, Messages, Payments, Events following the ARIA tab pattern.

**Given** Hà taps Grades
**When** the tab activates
**Then** the Grades screen crossfades in over 0.55s (instant under reduced motion).

**Given** four inactive screens
**When** a keyboard or screen reader user moves through the page
**Then** they cannot take focus and are hidden from assistive tech (AC-A11Y-3).

**Given** the four PXP features and store buttons
**When** they render
**Then** App Store and Google Play read `[Placeholder]` until real links are confirmed.

### Story 4.3: LXP, SXP and IoT sections

As Lan, choosing apps for staff and students,
I want each web app shown in a browser frame with its audience and features,
So that I can compare them.

- **Design reference:** `mockups/site-v3/products.html#lxp`, `#sxp` (navy), `#iot`
- **Spec references:** EXP > Component Patterns (Browser frame, Media frame), State Patterns (Media missing); DES > Components (Browser frame, Media frame)
- **Requirements:** FR-17; UX-DR17
- **AC IDs:** none
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** M

**Acceptance Criteria:**

**Given** `#lxp`, `#sxp` and `#iot`
**When** they render
**Then** each shows its audience, four features and a browser frame with a mono URL pill, and the sections use mist with linen, navy and paper.

**Given** an app address that is not confirmed
**When** the URL pill renders
**Then** it reads `[Placeholder] lxp.xiontechs.com`, `[Placeholder] sxp.xiontechs.com` or `[Placeholder] iot.xiontechs.com`.

**Given** a missing media asset
**When** the frame renders
**Then** it shows the empty navy grid, never a broken image.

### Story 4.4: Product media in device frames

As Lan, watching how the apps work,
I want short clips I control, with no sound surprises,
So that I can see the products without distraction.

- **Design reference:** `mockups/site-v3/products.html` hero devices and `#pxpPhone`; `index.html` `.devices`
- **Spec references:** EXP > Motion (Devices), Component Patterns (Device frame); DES > Components (Device frame)
- **Requirements:** FR-19; NFR-2; UX-DR17
- **AC IDs:** none
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** M

**Acceptance Criteria:**

**Given** a product clip in a device frame
**When** the page loads
**Then** it never plays with sound, shows a poster frame and has visible play and pause controls
**And** a muted autoplay clip stops after 5s unless the visitor plays it.

**Given** tablet and phone frames
**When** they appear
**Then** they float for one cycle under 5s, then rest
**And** on hover-capable devices only they tilt up to 8 degrees with the pointer; float and tilt are off under reduced motion.

**Given** real screens or clips are not yet supplied
**When** frames render
**Then** they show the empty media frame and a `[Placeholder]` caption.

### Story 4.5: Product updates and demo capture

As Lan, checking the products are alive,
I want three recent product updates and a demo capture,
So that I can read what changed and book a demo.

- **Design reference:** `mockups/site-v3/products.html#updates` and capture (navy, `data-mode="demo"`)
- **Spec references:** EXP > Information Architecture (Products), State Patterns (Products `#updates`); DES > Layout & Spacing (Page colour rhythm)
- **Requirements:** FR-18, FR-33 (placement)
- **AC IDs:** none
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** S

**Acceptance Criteria:**

**Given** stories in the Product category
**When** `#updates` renders
**Then** the three newest show as news cards with "Product · {app}" tags, followed by "See all news".

**Given** no Product stories
**When** `#updates` renders
**Then** the grid hides and "See all news" stays.

**Given** the end of Products
**When** it renders
**Then** the navy demo capture "See it working at your school." is shown and the page has exactly one full-width amber band (the hero).

## Epic 5: Services and 4-D process

Companies judge the delivery team and start a project.

### Story 5.1: Services hero with live office clocks

As Quân, checking time-zone overlap,
I want live local times for Ho Chi Minh City and Dallas,
So that I know when the team is working.

- **Design reference:** `mockups/site-v3/services.html` hero (`section.hero-navy`, `.cta-row`, `.clock-strip`)
- **Spec references:** EXP > Component Patterns (Clock strip, Office card), State Patterns (Office card, clock strip); DES > Components (Clock strip, Office card)
- **Requirements:** FR-20, FR-30 (shared clock); UX-DR19
- **AC IDs:** none
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** M

**Acceptance Criteria:**

**Given** `/services`
**When** it renders
**Then** a navy hero shows breadcrumbs, the H1 "Software teams that get IT done.", a primary "Start a project" to `/demo#project` and a glass "See our 4-D process" to `#process`.

**Given** the clock strip before JavaScript runs
**When** the server responds
**Then** it shows "Ho Chi Minh City GMT+7" and "Dallas US Central".

**Given** JavaScript runs
**When** the page is open
**Then** live times use `Asia/Ho_Chi_Minh` and `America/Chicago` and refresh every 30 seconds
**And** the clock logic is one shared module reused by office cards.

### Story 5.2: Stats and eight services with anchors

As Quân, following a service link from Home,
I want to land on that service with its heading visible,
So that I read the right description straight away.

- **Design reference:** `mockups/site-v3/services.html` key facts stats and `#all-h` with `#product-engineering`, `#ai-analytics`, `#co-creation`, `#staffing`, `#custom-apps`, `#low-code`, `#ai-solutions`, `#cloud`
- **Spec references:** EXP > Information Architecture (Services, Service anchors), Component Patterns (Service card, Stats band)
- **Requirements:** FR-21, FR-12 (reuse), FR-6
- **AC IDs:** AC-NAV-5
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** M

**Acceptance Criteria:**

**Given** the stats section on paper
**When** it renders
**Then** it reuses the Story 3.3 component with the same five figures and light-surface suffix colour.

**Given** "Eight services, one team."
**When** it renders
**Then** each of the 8 services shows its description and tags and is the anchor target (not a link).

**Given** a link to any of the 8 anchors
**When** it is followed
**Then** the service heading lands fully visible below the sticky header (AC-NAV-5).

### Story 5.3: Three ways to work with us and industries

As Quân, a logistics CTO,
I want to see engagement models and that logistics is an industry served,
So that I know the team fits my company.

- **Design reference:** `mockups/site-v3/services.html` `#ways-h` and `#ind-h` (`.industries`)
- **Spec references:** EXP > Information Architecture (Services), Component Patterns (Industry chip), Key Flows (Flow 2); DES > Components (Industry chip)
- **Requirements:** FR-22, FR-24; UX-DR24
- **AC IDs:** none
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** S

**Acceptance Criteria:**

**Given** "Three ways to work with us."
**When** it renders
**Then** Dedicated team, End-to-end delivery and Co-creation each name the service they run through.

**Given** "Industries we serve."
**When** it renders
**Then** EdTech (primary chip), Healthcare, Logistics and Private Equity are static chips and the USA, Europe and Australia time-zone note is shown.

### Story 5.4: 4-D process at #process and project capture

As Quân, ready to start,
I want to follow "See our 4-D process" and then start a project from the same page,
So that I move from reading to acting without searching.

- **Design reference:** `mockups/site-v3/services.html#process` and capture (amber, `data-mode="project"`, "Tell us what you're building.")
- **Spec references:** EXP > Component Patterns (Process flow (4-D), Email capture), Key Flows (Flow 2)
- **Requirements:** FR-23, FR-34 (placement), FR-6
- **AC IDs:** AC-NAV-5, AC-UI-2, AC-FORM-2
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** S

**Acceptance Criteria:**

**Given** the Story 3.6 component placed on a navy band with `id="process"`
**When** Quân follows "See our 4-D process" or "See the process" in the Services mega menu
**Then** the heading lands fully visible (AC-NAV-5) and the "You receive" rows align across the four cards (AC-UI-2).

**Given** the amber project capture "Tell us what you're building."
**When** Quân submits a valid work email
**Then** `/demo#project` opens on the Outsourcing project tab, scrolled to the form, with his email prefilled (AC-FORM-2).

**Given** the Services page
**When** a tester checks surfaces
**Then** it has the navy hero and navy 4-D band and exactly one amber band (the capture).

## Epic 6: News, About and Careers

Visitors read stories and learn who XionTechs is; Nam joins the talent network; editors publish without a developer.

### Story 6.1: News page with category filters and subscribe capture

As Nam, looking for team stories,
I want to filter news by category instantly,
So that I only read what interests me.

- **Design reference:** `mockups/site-v3/news.html` hero, `.filters`, `#newsGrid`, `#newsCount`, `#newsEmpty`, subscribe capture (navy)
- **Spec references:** EXP > Component Patterns (Filter chips, News card, Category tag), State Patterns (News); DES > Components (Filter chips, News card)
- **Requirements:** FR-25, FR-35 (placement), FR-45 (server-rendered list); UX-DR22
- **AC IDs:** none
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** M

**Acceptance Criteria:**

**Given** `/news`
**When** it renders on the server
**Then** a light hero with the H1 "What we've been up to." precedes filter chips All, Product, Company, Schools, Team and a story grid whose first card is a wide feature.

**Given** the chips
**When** Nam presses Team
**Then** only Team stories show without a reload, Team has `aria-pressed="true"` and the others false, and "Showing N stories" is announced
**And** pressing the active chip does nothing.

**Given** a category with no stories
**When** it is selected
**Then** "No stories in this category yet." shows with a "Show all" button that resets to All.

**Given** the navy subscribe capture "Get our news by email."
**When** a valid email is submitted
**Then** "Thanks, you're subscribed." replaces the row (Story 2.4)
**And** the unverified frequency note starts with `[Placeholder]`.

### Story 6.2: Story detail page

As Nam, opening a Team story,
I want a readable page with the date, category and a way back,
So that I can finish the story and keep browsing.

- **Design reference:** `mockups/site-v3/news-story.html`
- **Spec references:** EXP > Information Architecture (News story), Bilingual (EN / VI), Component Patterns (News card, Category tag)
- **Requirements:** FR-26
- **AC IDs:** none
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** M

**Acceptance Criteria:**

**Given** `/news/[slug]` for an existing story
**When** it renders
**Then** it shows breadcrumbs Home / News / story, H1, mono date and category tag, photo, body, a related product link (for example `/products#pxp`) and "Back to News".

**Given** a story dated 18 September 2026
**When** shown in EN and VI
**Then** the date reads `18 SEP 2026` and `18/09/2026` in mono type.

**Given** each story
**When** its metadata is generated
**Then** it has its own title, meta description and Open Graph image.

**Given** an unknown slug
**When** requested
**Then** the Not found page from Story 1.7 renders.

### Story 6.3: Editors publish stories and roles without a developer

As a XionTechs editor,
I want to create, edit and publish stories and open roles in both languages,
So that news and hiring stay current without a code change.

- **Design reference:** none (editor workflow); media shown in `mockups/site-v3/news-story.html` photo frame
- **Spec references:** EXP > Component Patterns (Media frame), Open Questions (CMS choice); PRD 8.1 fallback
- **Requirements:** FR-27, FR-32 (editing)
- **AC IDs:** AC-FORM-3
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** L

**Acceptance Criteria:**

**Given** the CMS decision `[ASSUMPTION]` (file-based content remains if it is not made before Demo day)
**When** an editor publishes a story or role with EN and VI fields
**Then** it appears on News, Home, Products `#updates` or Careers through the same content access module without a code change.

**Given** a CMS that allows image uploads
**When** an editor uploads or pastes an image
**Then** only the item the editor selected changes, never a previously hovered item (AC-FORM-3).

**Given** an editor closes the last open role
**When** Careers renders
**Then** the Open roles panel shows instead.

### Story 6.4: About page

As Quân, checking who is behind the services,
I want the company story, values and offices on one page,
So that I trust the team before I start a project.

- **Design reference:** `mockups/site-v3/about.html` hero, key facts stats, `#story-h`, `#values`, `#lead-h`, `#faq`, `#off-h`, capture (amber)
- **Spec references:** EXP > Information Architecture (About), Component Patterns (Value grid, Person card, Office card, Placeholder frame); DES > Components (Value grid, Person card, Office card)
- **Requirements:** FR-28, FR-29, FR-30, FR-46, FR-12 (reuse), FR-6; UX-DR19, UX-DR23
- **AC IDs:** AC-NAV-5
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** M

**Acceptance Criteria:**

**Given** `/about`
**When** it renders
**Then** a navy hero with "Tech made simple. Solutions made powerful." is followed by stats, the story "Two strengths, one team.", values, leadership, FAQ, offices and a capture band.

**Given** `#faq`
**When** a visitor opens it from the footer "FAQ" link
**Then** the heading lands fully visible (AC-NAV-5) and nine questions show as a disclosure list in EN and VI; each opens and closes with mouse, Enter or Space; several can be open at once
**And** the page carries FAQPage structured data with the same questions and answers, in the page's language (Vietnamese on `/vi/about`).

**Given** `#values`
**When** reached from the footer "Core values" link
**Then** the heading lands fully visible (AC-NAV-5) and the 3 x 2 grid shows Startup Spirit, Client Centricity, Integrity First, Innovation Driven, "Get IT Done" Attitude (featured amber cell) and People-Centered Culture in office-banner wording.

**Given** leadership is not confirmed by the business
**When** the section renders
**Then** it shows `[Placeholder]` person cards only and no names from the old site.

**Given** the navy offices section
**When** it renders
**Then** each office card shows the live local time from the Story 5.1 clock module, address and a `tel:` link.

**Given** the About stats band and capture
**When** built
**Then** they follow the prototype (fourth figure "4 School products ready to demo", capture "Let's work together." with "Book a demo") pending PRD open question 12.

### Story 6.5: Careers page and talent network

As Nam, a QA engineer,
I want to see the culture, what roles are open and a way to hear about new ones,
So that I can join the talent network in one step.

- **Design reference:** `mockups/site-v3/careers.html` hero, `#cul-h`, `#ben-h`, `#roles-h` (`.roles-empty`), `#talent` capture (navy), `#life`
- **Spec references:** EXP > Information Architecture (Careers), Component Patterns (Open roles panel, Placeholder frame), State Patterns (Careers), Key Flows (Flow 4)
- **Requirements:** FR-31, FR-32, FR-35 (placement); UX-DR23
- **AC IDs:** none
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** M

**Acceptance Criteria:**

**Given** `/careers`
**When** it renders
**Then** an amber hero "Build what schools use every day." with "Join our talent network" (to `#talent`) and "Life at XionTechs" (to `#life`) is followed by culture, four benefits (Innovative workspace, Growth opportunities, Engaging work, Meaningful impact), open roles, the talent capture and Life at XionTechs.

**Given** no open roles
**When** Open roles renders
**Then** it shows "No open roles right now." with a route to `#talent`, and no invented role appears.

**Given** open roles exist in the content source
**When** Open roles renders
**Then** each role is listed in place of the panel.

**Given** Nam submits a valid email in the navy `#talent` band
**When** it succeeds
**Then** "Thanks, you're on the list." replaces the row; an invalid email keeps him in the band with the inline error.

**Given** team photos are not supplied
**When** `#life` renders
**Then** placeholder frames with a `[Placeholder]` caption show.

## Epic 7: SEO, performance and accessibility hardening

Visitors find the site in their language, and every page in both locales passes the quality gates before Demo day and public launch.

### Story 7.1: Per-page metadata, hreflang and sitemap

As Lan, searching for school parent apps,
I want search results in my language that open the right page,
So that I land where I need to be.

- **Design reference:** `mockups/site-v3/index.html` `<title>` and meta description (wording baseline)
- **Spec references:** EXP > Foundation (Rendering), Information Architecture (Locale routing), Bilingual (EN / VI)
- **Requirements:** FR-43, FR-44; NFR-5
- **AC IDs:** none
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** M

**Acceptance Criteria:**

**Given** each of the 10 page types in each locale
**When** its HTML is fetched
**Then** it has a unique title, meta description, canonical URL, Open Graph tags and favicon, all translated.

**Given** any page
**When** its head is inspected
**Then** it links its `/en/` and `/vi/` versions with `hreflang` and `x-default` points to `/en/`.

**Given** the site
**When** `/sitemap.xml` is fetched
**Then** it lists every public page in both locales `[ASSUMPTION]`.

### Story 7.2: Server rendering, no-JS content and structured data

As Hà, on a slow phone connection,
I want the content to be there before scripts load,
So that I can read even if JavaScript fails.

- **Design reference:** all 10 prototype pages (content order)
- **Spec references:** EXP > Foundation (Rendering), State Patterns (No JavaScript, Fonts loading)
- **Requirements:** FR-45; NFR-5
- **AC IDs:** none
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** M

**Acceptance Criteria:**

**Given** JavaScript disabled
**When** each page loads
**Then** header, footer, News and all section content are present and readable, with reveal effects skipped.

**Given** Home
**When** its HTML is fetched
**Then** it contains Organization JSON-LD and app JSON-LD for the products, passing a structured-data validator.

**Given** the capture redirect and contact form without JavaScript
**When** a visitor submits
**Then** behaviour follows the decision on PRD open question 11 `[ASSUMPTION]` and is documented in the story PR.

### Story 7.3: Accessibility checks on every page in both locales

As Hà, using a screen reader or keyboard,
I want every page to meet WCAG 2.2 AA,
So that I can use the whole site.

- **Design reference:** all 10 prototype pages
- **Spec references:** EXP > Accessibility Floor, Acceptance Criteria Index; DES > Colors
- **Requirements:** NFR-1, NFR-6
- **AC IDs:** AC-A11Y-1, AC-A11Y-2, AC-A11Y-3, AC-A11Y-4, AC-A11Y-5
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** M

**Acceptance Criteria:**

**Given** CI runs axe-core on all 10 page types in EN and VI
**When** the run finishes
**Then** there are zero serious or critical violations.

**Given** Playwright keyboard tests
**When** they run
**Then** they prove contrast tokens (AC-A11Y-1), a visible ring on paper, mist, amber and navy including the navy capture field (AC-A11Y-2), no focus into closed menus, inactive tabs or phone screens (AC-A11Y-3), no nested interactive elements in links (AC-A11Y-4) and announced, linked field errors (AC-A11Y-5).

**Given** each page
**When** checked
**Then** it has one H1, tab order follows reading order, touch targets are at least 24 x 24px, and images have EN and VI alt text or empty alt when decorative.

**Given** 320px width in VI
**When** each page renders
**Then** there is no horizontal page scroll and no button text is truncated.

### Story 7.4: Performance budget

As Hà, on a mid-range phone,
I want pages to load fast despite the animation,
So that I do not give up waiting.

- **Design reference:** `mockups/site-v3/index.html` (silk hero as heaviest page)
- **Spec references:** EXP > Foundation (Performance), Motion; PRD 9 (SM-6, SM-8, SM-C3)
- **Requirements:** NFR-4
- **AC IDs:** AC-PERF-1
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** M

**Acceptance Criteria:**

**Given** a production build
**When** a Lighthouse check runs on every page in both locales
**Then** no icon set or third-party script is render-blocking (AC-PERF-1)
**And** mobile Performance is at least 90, Accessibility 100, SEO 100, Best Practices at least 95 `[ASSUMPTION]`.

**Given** Home on a mobile profile
**When** measured
**Then** LCP is at most 2.5s, INP at most 200ms, CLS at most 0.1 `[ASSUMPTION]`
**And** if the silk breaks the budget, motion is reduced, not the targets (SM-C3).

### Story 7.5: Launch content gate

As a XionTechs lead preparing public launch,
I want a check that no placeholder or missing policy ships to real visitors,
So that the site never shows invented or unverified content.

- **Design reference:** every `[Placeholder]` in `mockups/site-v3/`
- **Spec references:** EXP > Voice and Tone (`[Placeholder]` convention), Open Questions
- **Requirements:** FR-41, NFR-7, NFR-3
- **AC IDs:** none
- **Owner:** `[ASSUMPTION]` to be assigned by the lead
- **Size:** S

**Acceptance Criteria:**

**Given** a launch check script
**When** it runs against the site source (`src/`) and the built output, excluding planning artifacts, tests and the script itself
**Then** it lists every `[Placeholder]` match and fails the public-launch build if any remain.

**Given** the Demo-day build
**When** the same check runs
**Then** it reports matches without failing, pending PRD open question 16 `[ASSUMPTION]`.

**Given** the privacy policy still contains `[Placeholder]` or no retention period is set
**When** the public-launch check runs
**Then** it fails, so no form goes live without a real policy.

## Change Control

When the HTML prototype (`mockups/site-v3/`) changes and Amber Do approves the change, update only the affected stories (their acceptance criteria and design references) and the PRD, then open or update a PR into `develop`. Per PRD section 10, `DESIGN.md` and `EXPERIENCE.md` are updated first because they win over the prototype, and a line goes into `docs/ai-log.md` when an AI tool made or proposed the change. Coverage tables in this document are updated in the same PR.

## Workflow Checkpoint Decisions

This document was produced in non-interactive mode. At each halt point the default below was taken.

- Step 1, document discovery: used the PRD draft dated 2026-09-28 (not yet in the repo), the single UX run folder `ux-XionTech-LandingPage-2026-09-26` (DESIGN.md and EXPERIENCE.md as one contract), the code review and the prototype; no architecture document; no documents excluded.
- Step 1, requirement confirmation: accepted 45 FRs (FR-46 FAQ was added later on 2026-09-28), 8 NFRs, AGENTS.md-derived additional requirements and 26 UX-DRs as extracted; applied the 640px Book a demo correction.
- Step 2, epic approval: kept the seven suggested themes but moved Contact, email capture and privacy to Epic 2 so pages that embed capture bands do not depend on a later epic; built the stats band and 4-D process in Home (first use) and reused them in Services and About.
- Step 3, story approval and menus: no Advanced Elicitation or Party Mode; continued.
- Step 4, final validation: FR, AC-ID and page coverage complete; no forward story dependencies; no starter-template story because the project is already scaffolded.

## Open Items Carried From the PRD

- CMS choice (Story 6.3), form destination (Story 2.3), no-JS form behaviour (Story 7.2), About stats and capture intent (Story 6.4), Demo-day placeholders (Story 7.5).
- Real content still `[Placeholder]`: store links, app URLs, product media, news stories, leadership, team photos, privacy policy text, Dallas street address, contact email, logo SVG.
