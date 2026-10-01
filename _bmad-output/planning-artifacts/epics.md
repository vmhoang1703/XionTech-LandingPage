---
title: XionTechs Website Epics and Stories
status: draft
updated: 2026-10-01
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

This document breaks the XionTechs Website PRD (47 FRs, 8 NFRs), the UX spines (`DESIGN.md`, `EXPERIENCE.md`) and the 16 review acceptance criteria into epics and stories for `bmad-build`. No architecture document exists; technical enablers are inferred from `AGENTS.md` and tagged `[ASSUMPTION]`.

**Conventions**

- `EXP >` means `EXPERIENCE.md` section, `DES >` means `DESIGN.md` section.
- Prototype paths are relative to `_bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/` and written `mockups/site-v3/...`. The prototype is the visual acceptance reference; the spines win on any conflict.
- Header and footer are rendered by the prototype script into `#site-header` and `#site-footer`, so their design reference is `mockups/site-v3/js/site.js` (header and footer templates) with `css/site.css`.
- All routes exist under `/en/` and `/vi/`; paths below omit the prefix. **Demo day is English only** (decided 2026-09-29): Story 1.2 (locale routing and the language dropdown) and every Vietnamese string follow after demo, so VI parts of acceptance criteria are checked after demo.
- Header (2026-10-01): logo on the left and the menu on the right (Products, Services, News, About, Careers), with the language dropdown as the last item. No Book a demo button in the header; it is reached from heroes, capture bands and the footer "Contact" link.
- Every story's Definition of Done includes NFR-8 (lint, typecheck, unit tests, 100% changed-line coverage, branch coverage at least 80% per changed file, Playwright smoke, build, local SonarQube gate) and NFR-7 (no invented content; unverified text starts with `[Placeholder]` in EN and VI). These are not repeated per story.
- **Owner** on every story is proposed (Andy or Sammy, following the two tracks in the Demo-day plan) and is confirmed by the lead (Hoang Vu). Size: S (up to 1 day), M (1 to 2 days), L (2 to 3 days). `[ASSUMPTION]` day ranges.
- **Demo day** on every story is `must-have` or `after demo`. A must-have story may carry a **Demo-day slice** line: only that part is built before Demo day, and the rest follows after demo.
- **Depends on** lists the earlier stories that must be merged first. Every story depends on 1.1, directly or through a story it lists.

**Personas** (EXP > Key Flows): Lan (Nguyễn Thị Lan, school principal, Flow 1), Quân (Trần Minh Quân, CTO, Flow 2), Hà (Phạm Thu Hà, parent on a phone, Flow 3), Nam (Lê Hoàng Nam, QA engineer and job seeker, Flow 4). Internal: a XionTechs editor (PRD 2.1).

## Demo-day plan (PROPOSED, to confirm with Hoang, Andy and Sammy)

Budget: 2 developers (Andy and Sammy), 7 to 8 build days before Demo day 2026-10-09, about 15 developer-days. Sizes use the midpoints of the epics' scale: S = 0.5, M = 1.5, L = 2.5 days. A split story is counted at the size of its Demo-day slice (full size in brackets); the rest of it is after demo.

**Scope decided by Amber Do on 2026-09-29.** The site will be used as the real company site after Demo day, so Demo day includes the moving silk, the 4-D process on Home and Services (a simple animation update), News with `[Placeholder]` titles from Sanity, Careers with job pages and CV upload, live demo and project forms, and the accessibility and performance audits. The site is English only on Demo day. There is no newsletter, no talent network, no leadership section and no dark mode. **No cuts:** the must-haves come to **23.5 developer-days against about 15**, so the lead decides how to cover the gap (more days, another developer, or cuts); see PRD open question 22.

**Must-have stories in build order (31 of 40)**

| Step | Andy (proposed) | Size | Andy total | Sammy (proposed) | Size | Sammy total |
|---|---|---|---|---|---|---|
| 1 | 1.1 Brand tokens, fonts, surfaces (slice) | M (L) | 1.5 | 1.5 Site footer | S | 0.5 |
| 2 | 1.3 Desktop header, mega menus, skip link (slice) | M (L) | 3.0 | 1.7 Not found page | S | 1.0 |
| 3 | 1.8 Sanity setup | M | 4.5 | 2.1 Privacy policy page | S | 1.5 |
| 4 | 2.2 Two-tab contact form (slice) | M (L) | 6.0 | 3.1 Dark Home hero with one CTA (slice) | S (M) | 2.0 |
| 5 | 2.3 Submission delivery and spam protection | M | 7.5 | 3.2 Continuous silk and motion toggle (slice) | M (L) | 3.5 |
| 6 | 2.4 Email capture band (slice) | S (M) | 8.0 | 3.3 Stats band (slice) | S (M) | 4.0 |
| 7 | 1.4 Mobile menu (slice) | S (M) | 8.5 | 3.4 Two front doors | S | 4.5 |
| 8 | 6.6 Job page and application with CV upload | M | 10.0 | 6.5 Careers page and open roles (slice) | S (M) | 5.0 |
| 9 | 6.3 Editors publish in Sanity Studio (slice) | S (L) | 10.5 | 3.5 Why XionTechs and app row (slice) | S (M) | 5.5 |
| 10 | 7.4 Performance budget (slice) | S (M) | 11.0 | 3.6 4-D process component (slice) | S (M) | 6.0 |
| 11 | 7.3 Accessibility checks (slice) | S (M) | 11.5 | 4.1 Products hero and sub-nav (slice) | S (M) | 6.5 |
| 12 | | | | 4.2 PXP story phone (slice) | S (M) | 7.0 |
| 13 | | | | 4.3 LXP, SXP and IoT sections (slice) | S (M) | 7.5 |
| 14 | | | | 5.1 Services hero and clocks (slice) | S (M) | 8.0 |
| 15 | | | | 5.2 Stats and eight services (slice) | S (M) | 8.5 |
| 16 | | | | 5.4 4-D process at `#process` and project capture | S | 9.0 |
| 17 | | | | 3.7 Home news and demo capture (slice) | S (M) | 9.5 |
| 18 | | | | 6.1 News page with category filters | M | 11.0 |
| 19 | | | | 6.2 Story detail page (slice) | S (M) | 11.5 |
| 20 | | | | 6.4 About page (slice) | S (M) | 12.0 |

Total: Andy 11.5, Sammy 12.0, together 23.5 developer-days (about 8.5 over the 15 available).

- Story 1.1 blocks everyone. Andy merges its token and font part first (target end of day 1); until then Sammy prepares the content for 1.5, 1.7 and 2.1.
- Story 1.8 (Andy step 3, done by day 4.5) unblocks 3.7, 6.1, 6.2, 6.5 and 6.6; news stories and roles are entered in Sanity with `[Placeholder]` titles. Sammy builds 6.5 right after it, so Andy can start 6.6 at day 8.5.
- Stories 3.7 and 5.4 start after 2.4 is merged (Andy step 6, day 8.0); 6.3 starts after 3.7 is merged (day 9.5).
- Stories 7.3 and 7.4 check each page as it is merged; a final run follows Sammy's last page (day 12.0).
- Breadcrumbs: until Story 1.6 lands after demo, each page story builds its breadcrumbs with the simple markup from the prototype; 1.6 turns them into the shared component.
- If the gap is closed by cuts, the lowest-risk order to drop is: 6.3 (enter content through the Studio defaults), 3.7 spotlight, 4.1 in-view highlight, 5.1 clocks.

**After demo (9 stories, plus the deferred parts of the sliced must-haves):** 1.2 Locale routing and language dropdown, 1.6 Inner page hero and breadcrumbs, 2.5 No non-essential cookies without consent, 4.4 Product media in device frames (clips uploaded in Sanity), 4.5 Product updates and demo capture, 5.3 Three ways to work and industries, 7.1 Metadata, hreflang and sitemap, 7.2 Server rendering and structured data, 7.5 Launch content gate. The CI pipeline is an open item, not a story.

## Requirements Inventory

### Functional Requirements

FR-1: Sticky header on every page reaches Products (mega: PXP, LXP, SXP, IoT Device Management, All products), Services (plain link), News, About, Careers. Text-only triggers, no caret (the language dropdown caret is the only exception); `aria-current="page"`; hover opens, 150ms close delay, click never closes a hover-opened menu, Escape returns focus, click outside closes.
FR-2: Below 1080px a menu button opens all navigation; `aria-controls`, `aria-expanded`; Escape closes and returns focus; mega content inline; scroll lock; focus trapped in the open menu panel plus the header bar controls (logo link, language dropdown, Menu button).
FR-3: Book a demo reachable at every width without a header button: hero or capture band on Home, Products, Services, About and News; footer "Contact" on every page.
FR-4: Language dropdown, the last header item: code button (EN or VI) opening EN and VI (named "EN English" and "VI Tiếng Việt"), current marked with `aria-current`, Escape and outside click close; in the header bar at every width; switching keeps page, scroll and typed values and updates `lang`, title, meta; every string exists in EN and VI; product and service names stay English; Vietnamese copy owner is an open item.
FR-5: Every page under `/en/` and `/vi/`; bare `/` redirects to saved locale, else `/vi/` for Vietnamese browsers, else `/en/`; URL locale wins; choice saved in an essential first-party locale cookie.
FR-6: In-page anchors land with the heading fully visible below the sticky header (and Products sub-nav) via `scroll-margin-top`; smooth scroll off under reduced motion.
FR-7: Footer on every page: Products, Services, Company (About, Core values, FAQ to `/about#faq`, News, Careers, Contact), both offices with `tel:` links, bottom bar with copyright, Privacy policy link, GET IT DONE tag; no Da Nang or second HCMC office.
FR-8: "Skip to content" is the first focusable element; inner pages show breadcrumbs (Home + current page).
FR-9: Unknown paths show a short message and links to Home, Products, Services, News in the current locale, with HTTP 404. `[ASSUMPTION]` status code.
FR-10: Dark `hero-silk` Home hero with headline, tablet and phone frames, slow continuous silk; discreet motion toggle (accessible name "Pause motion"/"Play motion", label on hover or focus, no `aria-pressed`, the changing name carries the state, remembered, hidden without JS or WebGL or when the WebGL context is lost); a saved Play or Pause wins over reduced motion; with no saved choice reduced motion starts paused; pauses off screen and when the tab is hidden; canvas `aria-hidden`; static fallback without WebGL or JS.
FR-11: Exactly one primary hero button, "Explore our products", to Products.
FR-12: Stats band "Experience you can count on" at the bottom of the hero: 25+, 24/7, 20+, 8, 2; counts up once over 1.4s at 60% visible; 24/7 static; screen readers get final values; one shared component reused on Services and About.
FR-13: Products door and Services door directly under the hero, overlapping its bottom edge; each door one link; chips are text.
FR-14: After the doors: Why XionTechs, four-app row, 4-D process, latest three stories, demo capture; each app item is one link with nothing interactive inside; no stories hides the grid and keeps "See all news".
FR-15: Sticky Products sub-nav (PXP, LXP, SXP, IoT, Updates) highlights the section in view, Updates at page end; scrolls horizontally on narrow screens.
FR-16: PXP story phone with five tabs (Attendance, Grades, Messages, Payments, Events) crossfading screens, ARIA tab pattern, inactive screens unfocusable and hidden; four features; store buttons always shown, opening a new tab, with `[Placeholder]` links until real ones exist.
FR-17: LXP, SXP, IoT in browser frames with audience, four features and web address as a link that opens a new tab (`[Placeholder]` until confirmed); missing media shows an empty frame.
FR-18: Three Product stories under `#updates` plus "See all news"; none hides the grid.
FR-19: Real product screens or clips in device frames; clips never autoplay with sound, poster frame, visible play and pause, muted autoplay stops after 5s; devices float one cycle under 5s; tilt up to 8 degrees on hover-capable devices.
FR-20: Services hero with "Start a project", "See our 4-D process" and live HCMC and Plano clocks (IANA zones, 30s refresh, server-rendered zone label).
FR-21: Eight services at `#product-engineering`, `#ai-analytics`, `#co-creation`, `#staffing`, `#custom-apps`, `#low-code`, `#ai-solutions`, `#cloud`.
FR-22: Three ways to work with us: Dedicated team, End-to-end delivery, Co-creation, each naming its service.
FR-23: 4-D process at `#process` from "Your request" to "Launch" with "You receive" per step; track fills over 2.4s at 30% visible, steps enter in turn, dot rests at Launch; reduced motion final state; rows aligned; below 1080px track and end nodes hide; one shared component for Home and Services.
FR-24: Industries EdTech, Healthcare, Logistics, Private Equity as static chips, plus USA, Europe and Australia time-zone note.
FR-25: News filters All, Product, Company, Schools, Team as `aria-pressed` toggles; exactly one active; instant; count announced; empty state with "Show all".
FR-26: Story page `/news/[slug]` with breadcrumbs, H1, date and category tag, photo, body, related product link, "Back to News"; dates `18 SEP 2026` EN and `18/09/2026` VI in mono; own title, meta, OG image.
FR-27: Editors create, edit and publish stories in both languages in Sanity Studio without a code change (CMS is Sanity, `docs/spikes/cms-spike.md`). `[ASSUMPTION]` editors are non-developers.
FR-28: About shows story, stats band and six core values at `#values` in office-banner wording.
FR-29: Removed 2026-09-29: no leadership section on About; no names from the old site.
FR-30: Office cards with live local time, address and `tel:` link.
FR-31: Careers culture, four benefits ("Why you'll grow here") and Life at XionTechs photos at `#life`; placeholder frames never ship at public launch.
FR-32: Open roles as role cards (title, team, location, work type) opening their job pages, else "No open roles right now."; hero "See open roles" to `#roles`; editors add or close roles without code `[ASSUMPTION]`; no invented roles at public launch (`[Placeholder]` sample roles allowed on Demo day).
FR-33: Email capture band (demo or project) on every page except Book a demo, Not found, Privacy policy, News story, Careers and job pages; sending and retry states; validation on submit with "Please enter a valid email address.", `aria-invalid`, `aria-describedby`, focus back, clears on typing; amber focus ring on navy bands; no modal pop-ups.
FR-34: Valid demo capture goes to `/demo#form` and project capture to `/demo#project` (Outsourcing tab, scrolled to form), email prefilled through session storage or server session, never in the URL; no prefill if session storage is unavailable.
FR-35: Removed 2026-09-29: no subscribe or talent-network capture.
FR-36: Two-tab contact form: hash picks the tab; fields per the EXPERIENCE.md field table; hidden-tab fields not validated, focusable or submitted but kept; submit marks invalid fields and focuses the first; sending, success and failure states.
FR-37: Preferred date cannot be before today in the visitor's time zone; picker starts at today; "Please choose today or a later date."
FR-38: Every Submission (demo, project, job application) reaches a XionTechs destination (contact inbox; Sanity for job applications); server-side validation mirrors the client rules; honeypot and a rate limit keyed on IP plus email (5 per 10 minutes `[ASSUMPTION]`) stop spam. Contact inbox: vinni.tran@newxion.com.
FR-39: "Book a demo" only for the demo intent and "Start a project" only for the project intent, with EN and VI labels from the CTA table.
FR-40: Consent line under every form with the exact EXPERIENCE.md wording, ending with a "Privacy policy" link.
FR-41: Privacy policy at `/privacy` linked from every consent line and the footer, covering what is collected, use, retention, rights, and listing the essential locale cookie; no form goes live at public launch before the text is real.
FR-42: If non-essential cookies are added, a consent banner with decline as the default shows before they are set.
FR-43: Per page and locale: title, meta description, canonical URL, Open Graph tags, favicon.
FR-44: `hreflang` pairs for `/en/` and `/vi/`, plus `x-default` to `/en/`.
FR-45: Header, footer and News server-rendered; Organization and app JSON-LD on Home; content readable without JavaScript.
FR-46: FAQ on `/about#faq` with nine questions, disclosure pattern and FAQPage structured data; the data security answer is `[Placeholder]` until real facts are supplied.
FR-47: Job page `/careers/[slug]` with breadcrumbs, title, team, location, work type, role sections and an application form: Full name, Email, Phone (optional), CV (PDF or Word, up to 5 MB), Cover note (optional, up to 2,000 characters); "Please upload your CV as a PDF or Word file, up to 5 MB."; sending, success ("We've received your application and will be in touch if it's a match.") and failure states; stored in Sanity with the FR-38 server checks; unknown or closed role shows Not found; no capture band.

### NonFunctional Requirements

NFR-1: WCAG 2.2 AA on every page in both locales: contrast 4.5:1 text, 3:1 large text, icons and field borders; amber text uses `#8A6700`, `#C99700` never text (AC-A11Y-1); visible focus on every surface (AC-A11Y-2); hidden content unfocusable (AC-A11Y-3); no interactive element inside a link (AC-A11Y-4); errors announced and linked (AC-A11Y-5); one H1; reading-order tab order; targets at least 44 x 44px for controls and 24 x 24px for inline text links; functional text at least 11.5px; no label above a section heading (door names and the stats heading excepted); meaningful alt text in EN and VI.
NFR-2: Motion is controllable (WCAG 2.2.2): Home silk always has the toggle and pauses off screen or in a hidden tab; every other decorative loop stops within 5s; reduced motion means no movement (short opacity fades for state changes), no clip autoplay, and the silk starts paused unless a saved Play or Pause choice exists (the saved choice wins).
NFR-3: Personal data under Vietnam PDPD (Decree 13/2023): collected only through forms for the stated purpose; never in URLs; retention period defined before public launch `[ASSUMPTION]`; no non-essential cookies without opt-in; the locale cookie is essential.
NFR-4: Performance: icon sets and third-party scripts never block rendering (AC-PERF-1); mobile p75 LCP at most 2.5s, INP at most 200ms, CLS at most 0.1 `[ASSUMPTION]`; fonts `display: swap` with `vietnamese` subset; silk pauses off screen.
NFR-5: SEO: locale URLs with `hreflang` and `x-default`; per-page metadata; server rendering; sitemap for both locales `[ASSUMPTION]`.
NFR-6: Latest two versions of Chrome, Edge, Safari (macOS, iOS), Firefox and Chrome on Android `[ASSUMPTION]`; layouts from 320px to wide desktop at 1080px, 900px, 640px; Vietnamese never truncates buttons.
NFR-7: Content integrity: no Lorem Ipsum or invented testimonials, logos, stats, people or roles; `[Placeholder]` prefix in both languages; `grep -rn "\[Placeholder\]"` over `src/` and the build output (excluding planning artifacts, tests and the check script) empty before public launch.
NFR-8: Engineering quality gate before every PR: lint, typecheck, unit tests, 100% changed-line coverage, branch coverage at least 80% per changed file, Playwright smoke, build, local SonarQube gate (local only).

### Additional Requirements

No architecture document exists. The items below come from `AGENTS.md` and the PRD and are tagged `[ASSUMPTION]` where they go beyond what those sources state.

- Next.js 16 App Router with `src/`, React 19, TypeScript strict. Agents read `node_modules/next/dist/docs/` before writing code (AGENTS.md).
- Tailwind CSS v4 with all tokens in `src/app/globals.css` under `@theme` (AGENTS.md, DES > Brand & Style build mapping).
- shadcn/ui (to be added) as the base for the primitives named in DES > Components; Motion (to be added) for animation.
- Fonts via `next/font` with `subsets: ['latin', 'vietnamese']` (DES > Typography).
- Metadata API for titles, meta, canonical, Open Graph, favicon (EXP > Foundation).
- `[ASSUMPTION]` Locale segment `src/app/[locale]/...` with request-level redirect for bare `/`, reading the essential locale cookie; exact Next.js 16 mechanism to be confirmed in the Next.js docs.
- `[ASSUMPTION]` Form submissions go through a server-side handler (server action or route handler) with server-side validation, honeypot and rate limit; destination is configured by environment and is an open question (PRD 12.10). The mail sender and the shared rate-limit store are picked in architecture from free tiers (PRD 12.18, 12.19).
- CMS is Sanity (decided 2026-09-28, `docs/spikes/cms-spike.md`): stories and roles are read from Sanity through one content access module (Story 3.7), with `useCdn: true` for public reads and tag-based revalidation from a Sanity webhook with a secret. Setup is Story 1.8. Free plan limits: 10,000 documents per dataset, 250k API and 1M CDN requests per month, public datasets.
- No CI yet: axe-core, Lighthouse and the launch content check run locally before release; a CI pipeline is an open item.
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
UX-DR6: Site header (sticky glass, logo 32px, text-only 44px items, active navy bold with 2px amber underline): logo left, menu right, language dropdown last; one mega menu (Products: name, value, "for" line, footer row), text only with no badges, icons or arrows; Services is a plain link.
UX-DR7: Mobile menu panel below 1080px, 44px-high "Menu" pill button (text, no icon) on the right next to the language dropdown, single-column mega content.
UX-DR8: Language dropdown (DropdownMenu): styled like the nav links (ink text, mist on hover), code with a caret, options EN and VI in a small list on the header glass, current bold navy.
UX-DR9: Skip link (amber pill on focus), breadcrumbs (mono, muted), highlight mark (one phrase per hero, 1.2s after 0.5s).
UX-DR10: Scroll reveal (26px rise, 0.9s, at 12% visible, 70ms stagger in fours, once) and global reduced-motion rule.
UX-DR11: Inner hero background: aurora and strand ribbon stop after 5s, ribbon pauses off screen, all `aria-hidden`.
UX-DR12: Home silk canvas with static fallback and Motion toggle (44px, ink 50%, white border 30%, 70% opacity at rest, label fades in on hover or focus, always visible under reduced motion).
UX-DR13: Stats band shared component (5/3/2 columns by breakpoint, suffix colour per surface, count-up).
UX-DR14: Process flow (4-D) shared component: six items, dashed track, step card anatomy, aligned "You receive" rows, stacked below 1080px.
UX-DR15: Spotlight card base (glass, pointer glow, 4px lift) with hover live immediately after reveal; Why XionTechs grid (four tiles, navy tile with live times, amber strip); four-app row (one link per app); Service card (`feature`, `navy` variants).
UX-DR16: Front door panels (Products light gradient with four badges and chips; Services navy with service chips "+3 more").
UX-DR17: Device frame (tablet 4:3, phone 1170:2532), Media frame (empty grid state), Browser frame (mist bar, mono URL pill, 16:10).
UX-DR18: PXP story phone (260px, five stacked screens, pill tabs, 0.55s crossfade) and Product sub-nav (sticky glass pills, current navy, horizontal scroll).
UX-DR19: Office card and Clock strip (IANA zones, 30s refresh, server-rendered zone label, `tel:` link).
UX-DR20: Email capture band (H2 and lede left, form right; white pill row; 1.5px navy border on amber; error line; consent line; success status panel; stacks at 640px).
UX-DR21: Contact form card (paper, 28px radius, pill tabs, 2-column grid, checkbox pills, full-width message, primary submit, invalid border `{colors.error-border}`; error colour per surface).
UX-DR22: News card (16:10 photo, mono date, category tag, title, excerpt, "Read story"; first card on News is a wide feature), Category tag (product stories amber with app name), Filter chips (active navy).
UX-DR23: Value grid (3 x 2, hairlines, featured amber cell "Get IT Done" Attitude), Role card (stretched link, title then team, location and work type), Placeholder frame (dashed, Lexend Exa caption), Open roles panel (dashed), File field.
UX-DR24: Industry chip (EdTech primary), Product badge (never the only way to tell apps apart).
UX-DR25: Site footer (ink, white logo plate, four columns with amber-tint Lexend Exa headings, GET IT **DONE** with DONE in amber) and Toast (ink pill, bottom centre, `role="status"`, about 2.6s).
UX-DR26: Responsive rules from EXP > Responsive & Platform at 1080px, 900px and 640px, including 16px gutters and stacked capture rows at 640px and below.
UX-DR27: FAQ component per DES > Components (FAQ) and EXP > Component Patterns (FAQ): native disclosure (`<details>` / `<summary>`), several answers open at once, Enter and Space toggle, the question is the accessible name.

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
| FR-27 | Epic 1, 6 | 1.8 (Sanity setup), 6.3 |
| FR-28 | Epic 6 | 6.4 |
| FR-29 | Epic 6 | 6.4 (removed section) |
| FR-30 | Epic 5, 6 | 5.1 (clock), 6.4 (office cards) |
| FR-31 | Epic 6 | 6.5 |
| FR-32 | Epic 1, 6 | 1.8 (Sanity setup), 6.5, 6.3 |
| FR-33 | Epic 2 | 2.4 |
| FR-34 | Epic 2 | 2.4 |
| FR-35 | Epic 2 | 2.4 (removed kinds) |
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
| FR-47 | Epic 6 | 6.6, 1.8, 2.3 (server checks) |

Result: 47 of 47 FRs covered. NFR-1 (1.1, 7.3), NFR-2 (1.1, 1.6, 3.2, 4.4), NFR-3 (1.2, 2.1, 2.3, 2.4, 2.5), NFR-4 (1.1, 3.2, 7.4), NFR-5 (7.1), NFR-6 (1.1, 1.4, 7.3), NFR-7 (all stories, 7.5), NFR-8 (all stories).

### AC-ID Coverage

| AC ID | Rule (short) | Stories |
|---|---|---|
| AC-NAV-1 | Language dropdown in the header bar at every width, never in the menu | 1.2, 1.4 |
| AC-NAV-2 | Book a demo reachable at every width without a header button (heroes, capture bands, footer Contact) | 1.3, 1.4, 1.5 |
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
| AC-UI-1 | Card hover starts without delay after reveal | 3.7 |
| AC-UI-2 | "You receive" rows align across 4-D cards | 3.6, 5.4 |
| AC-PERF-1 | Icons and third-party scripts never block rendering | 1.1, 7.4 |

Result: 16 of 16 AC IDs covered.

### Prototype Traceability

| Prototype page | Section or anchor | Story |
|---|---|---|
| `js/site.js` header template, all pages | `#site-header`: logo, text-only nav, Products mega menu, `.lang` dropdown, `#burger` | 1.2, 1.3, 1.4 |
| `js/site.js` footer template, all pages | `#site-footer`: columns, offices, `.fbot` bottom bar | 1.5 |
| `css/site.css` | `@theme`-equivalent variables, `@media` 1080/900/640, reduced motion fades, type scale and tap-target tokens | 1.1, 1.4 |
| `index.html` | hero `section.hero-silk`, `.motion-toggle`, `canvas.silk`, `.silk-fallback` | 3.1, 3.2 |
| `index.html` | `.hero-stats` (`#stats-h`) | 3.3 |
| `index.html` | `section.doors` | 3.4 |
| `index.html` | Why XionTechs (`#why-h`, `.why`), four-app row (`#prod-h`, `.app-strip`) | 3.5 |
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
| `news.html` | hero, `.filters`, `#newsGrid`, `#newsCount`, `#newsEmpty`, demo capture | 6.1 |
| `news-story.html` | breadcrumbs, H1, date and tag, photo, body, related product, Back to News | 6.2 |
| `about.html` | hero, key facts stats, `#story-h`, `#values`, `#faq`, `#off-h`, capture | 6.4 |
| `careers.html` | hero, `#cul-h`, `#ben-h`, `#roles` (`.roles`, `.role`), `#life` | 6.5 |
| `job.html` | hero with breadcrumbs and chips, `.job-body`, `#apply` (`#applyForm`, `#a-cv`, `.form-ok`) | 6.6 |
| `demo.html` | hero reassurance list and offices, `#form`, `.ftabs`, `#demoForm`, `.form-ok` | 2.2, 2.3 |
| `privacy.html` | hero, eight policy sections | 2.1 |
| `404.html` | navy hero with four recovery links | 1.7 |

Result: 11 of 11 pages covered. Stories 1.8, 2.5 and 6.3 are non-visual and have no prototype section.

## Epic List

Order is chosen so no story depends on a later story. Dependencies on earlier stories are listed on each story ("Depends on") so the two tracks can be split. Contact and capture (Epic 2) comes before the content pages because every page after it embeds a capture band. Links to pages built in later epics resolve to the Not found page until those epics land; no acceptance criterion depends on them.

### Epic 1: Bilingual site shell
Any visitor can move through a branded, bilingual site from any width: header, mega menus, mobile menu, EN/VI, footer, breadcrumbs, anchors and a Not found page; the Sanity content source is set up for the pages that read from it.
**FRs covered:** FR-1, FR-2, FR-3, FR-4, FR-5, FR-6, FR-7, FR-8, FR-9, FR-27 and FR-32 (Sanity content source, Story 1.8)

### Epic 2: Contact, email capture and privacy (PDPD)
Lan and Quân can request a demo or start a project through one contact form or a capture band, every Submission reaches XionTechs, and every form is covered by a privacy policy.
**FRs covered:** FR-33, FR-34, FR-35 (removed), FR-36, FR-37, FR-38, FR-39, FR-40, FR-41, FR-42

### Epic 3: Home
Visitors see what the products do in five seconds and pick a front door: dark silk hero, one CTA, stats, doors, Why XionTechs, four-app row, 4-D process, latest news and demo capture.
**FRs covered:** FR-10, FR-11, FR-12, FR-13, FR-14, FR-23 (component)

### Epic 4: Products
School buyers and parents can explore every app, jump by sub-nav, try the PXP story phone and book a demo.
**FRs covered:** FR-6 (sub-nav offset), FR-15, FR-16, FR-17, FR-18, FR-19

### Epic 5: Services and 4-D process
Companies can judge the delivery team, see office hours overlap and the 4-D process, and start a project.
**FRs covered:** FR-6, FR-12 (reuse), FR-20, FR-21, FR-22, FR-23, FR-24, FR-30 (clock)

### Epic 6: News, About and Careers
Visitors read dated stories, learn who XionTechs is, and job seekers apply for a role with a CV; editors publish without a developer.
**FRs covered:** FR-6, FR-12 (reuse), FR-25, FR-26, FR-27, FR-28, FR-29 (removed), FR-30, FR-31, FR-32, FR-46, FR-47

### Epic 7: SEO, performance and accessibility hardening
Visitors find the site in search in their language, and every page in both locales passes the accessibility, performance and launch-content gates.
**FRs covered:** FR-41 (launch gate), FR-43, FR-44, FR-45

## Epic 1: Bilingual site shell

Any visitor can move through a branded, bilingual site from any width. Stories 1.1 to 1.7 deliver the shared layout every later page renders inside; Story 1.8 sets up the Sanity content source.

### Story 1.1: Brand tokens, fonts, surfaces and motion primitives

As Lan, a principal reading on her office laptop,
I want every page to share one navy, amber and white look with readable Vietnamese type,
So that the site feels like one trustworthy company in either language.

- **Design reference:** `mockups/site-v3/css/site.css` (variables, `@media` 1080/900/640, `prefers-reduced-motion`); `mockups/site-v3/index.html` section surfaces
- **Spec references:** DES > Brand & Style (build mapping), Colors, Typography, Layout & Spacing (Build tokens), Elevation & Depth, Shapes, Components (Button, Focus ring); EXP > Motion (Scroll reveal, Reduced motion), Accessibility Floor
- **Requirements:** NFR-1, NFR-2, NFR-4, NFR-6; UX-DR1, UX-DR2, UX-DR3, UX-DR4, UX-DR5, UX-DR10, UX-DR26
- **AC IDs:** AC-A11Y-1, AC-A11Y-2, AC-PERF-1
- **Owner:** Andy (proposed)
- **Size:** L
- **Demo day:** must-have
- **Demo-day slice:** M. Every AC except the scroll-reveal primitive (UX-DR10), which follows after demo. The token and font part is merged first (target end of day 1) because every story depends on it.
- **Depends on:** none

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

### Story 1.2: Locale routing and language dropdown

As Hà, a parent on her phone,
I want to switch the site to Vietnamese from the header on any page,
So that I can read everything in my language without losing my place.

- **Design reference:** `mockups/site-v3/js/site.js` header template (`.lang`, `#langBtn`, `#langList`)
- **Spec references:** EXP > Information Architecture (Locale routing), Component Patterns (Language dropdown), Bilingual (EN / VI), Voice and Tone; DES > Components (Language dropdown)
- **Requirements:** FR-4, FR-5; NFR-3; UX-DR8
- **AC IDs:** AC-NAV-1
- **Owner:** Andy (proposed)
- **Size:** L
- **Demo day:** after demo (English only on Demo day, decided 2026-09-29)
- **Depends on:** 1.1

**Acceptance Criteria:**

**Given** a first visit to `/` with no saved choice
**When** the browser prefers Vietnamese
**Then** the visitor is redirected to `/vi/`, otherwise to `/en/`
**And** with a saved choice the saved locale wins; the redirect is done on the server at request level from the locale cookie.

**Given** a visitor who chooses a language
**When** the choice is saved
**Then** it is stored in an essential first-party locale cookie (not local storage) so the server can read it on the next request.

**Given** a shared link `/en/products`
**When** a visitor with a saved `vi` choice opens it
**Then** the page opens in English (URL locale wins).

**Given** a path without a locale, such as `/products`
**When** it is requested
**Then** it redirects to the same path under the resolved locale
**And** `sitemap.xml`, `robots.txt`, the favicon, `_next` paths and public assets are excluded from the add-locale redirect and are served as they are.

**Given** any page at 320px, 640px, 900px, 1080px and wide desktop
**When** it renders
**Then** the language dropdown is the last item in the header bar, is never inside the mobile menu, and is a button styled like the nav links showing the current code (EN or VI) with a caret that flips up when open, opening a small list of "EN" and "VI" (named English and Tiếng Việt) in the same text style on the header glass; the chosen language is marked with `aria-current`; choosing closes the list and returns focus to the button; Escape or a click outside closes it (AC-NAV-1).

**Given** a visitor mid-page with text typed in a form
**When** they press VI
**Then** they land on the same page under `/vi/`, at the same scroll position, with typed values kept
**And** `lang`, title and meta description are Vietnamese and the choice is saved in the locale cookie for the next visit.

**Given** the EN and VI string sets
**When** unit tests run
**Then** a key present in one locale and missing in the other fails the test
**And** product and service names are identical in both locales.

### Story 1.3: Desktop header, mega menus and skip link

As Quân, a CTO between meetings,
I want a clear header whose Products menu opens predictably,
So that I can reach any app or the Services page in one move.

- **Design reference:** `mockups/site-v3/js/site.js` header template (`#site-header`, `.skip`, the Products mega panel with "More products are on the way.")
- **Spec references:** EXP > Information Architecture (Header navigation), Component Patterns (Site header, Mega menu, Skip link, Button), Interaction Primitives, Motion (Mega menu); DES > Components (Site header, Mega menu, Product badge, Skip link)
- **Requirements:** FR-1, FR-3, FR-8; UX-DR6, UX-DR9, UX-DR24
- **AC IDs:** AC-NAV-2, AC-NAV-3
- **Owner:** Andy (proposed)
- **Size:** L
- **Demo day:** must-have
- **Demo-day slice:** M. Header, the click-toggled Products mega menu (Escape, click outside, one popup open at a time, tap on large touch screens), the Services link and the skip link; hover opening with the 150ms close delay and the reduced-motion fade follow after demo.
- **Depends on:** 1.1 (the language dropdown slot is filled by Story 1.2 after demo)

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

**Given** a large touch screen (above 1080px, no hover)
**When** the visitor taps Products or Services
**Then** the mega menu opens on tap, a second tap on the trigger closes it, and a tap outside closes it.

**Given** the Products mega menu
**When** it opens
**Then** it lists PXP (Parents), LXP (Students), SXP (Staff, Teachers, Leaders), IoT Device Management (School staff and facilities) with name, value and "for" line (text only: no badges, icons or arrows), then "More products are on the way." and "All products"
**And** products come from one data list so a new product is one new row.

**Given** the Services item
**When** a visitor follows it
**Then** it is a plain link to `/services` with no mega menu, marked `aria-current="page"` on the Services page.

**Given** a keyboard user on any page
**When** they press Tab once
**Then** "Skip to content" appears as an amber pill and activating it moves focus to `main`
**And** every mega menu item is reachable by keyboard.

**Given** a viewport wider than 1080px
**When** the header renders
**Then** it shows the logo on the left and the menu on the right (Products, Services, News, About, Careers), with the language dropdown as the last item
**And** there is no Book a demo button in the header (AC-NAV-2).

**Given** reduced motion
**When** a mega menu opens
**Then** it appears without the 0.3s fade and drop.

### Story 1.4: Mobile menu

As Hà, a parent on her phone,
I want a menu I can open, expand Products in, and close with the keyboard or a tap,
So that I can reach PXP or any page on a small screen.

- **Design reference:** `mockups/site-v3/js/site.js` header template (`#burger`, `#menu`, `.lang`); `mockups/site-v3/css/site.css` rules at 1080px and 640px
- **Spec references:** EXP > Component Patterns (Mobile menu), Responsive & Platform (Header at every width), Accessibility Floor; DES > Components (Mobile menu)
- **Requirements:** FR-2, FR-3; NFR-6; UX-DR7, UX-DR26
- **AC IDs:** AC-NAV-1, AC-NAV-2, AC-NAV-4, AC-A11Y-3
- **Owner:** Andy (proposed)
- **Size:** M
- **Demo day:** must-have
- **Demo-day slice:** S. Menu button, Escape, ARIA, scroll lock and the focus trap (logo, language dropdown, Menu button and the menu), with Products and Services as plain links to their pages; inline single-column mega content follows after demo.
- **Depends on:** 1.3

**Acceptance Criteria:**

**Given** a viewport at 1080px or below
**When** the header renders
**Then** the nav collapses behind a 40px-high pill button reading "Menu" (no icon), whose accessible name is "Menu", with `aria-controls` and `aria-expanded` (AC-NAV-4).

**Given** the mobile menu is open
**When** the visitor presses Escape
**Then** it closes and focus returns to the menu button (AC-NAV-4)
**And** while open the background does not scroll
**And** Tab and Shift+Tab cycle only through the open menu panel plus the header bar controls (logo link, language dropdown, Menu button), so the language dropdown stays reachable.

**Given** the mobile menu is closed
**When** a keyboard user tabs through the page
**Then** no menu item receives focus (AC-A11Y-3).

**Given** the menu is open
**When** the visitor expands Products
**Then** the mega content expands inline as a single column and PXP links to `/products#pxp`.

**Given** a viewport of 640px or below
**When** the header renders
**Then** the bar shows the logo, the language dropdown and the Menu button.

**Given** a viewport between 641px and 1080px
**When** the header renders
**Then** the bar shows the logo, the language dropdown and the Menu button, and there is no Book a demo button (AC-NAV-2).

**Given** any width
**When** the menu opens or closes
**Then** the language dropdown stays in the header bar (AC-NAV-1).

### Story 1.5: Site footer

As Quân, a CTO checking time zones,
I want both offices and key links in the footer of every page,
So that I can call or navigate from wherever I am.

- **Design reference:** `mockups/site-v3/js/site.js` footer template (`#site-footer`, `.fbot`)
- **Spec references:** EXP > Information Architecture (Footer), Component Patterns (Site footer); DES > Components (Site footer)
- **Requirements:** FR-7; UX-DR25
- **AC IDs:** AC-NAV-2
- **Owner:** Sammy (proposed)
- **Size:** S
- **Demo day:** must-have
- **Depends on:** 1.1

**Acceptance Criteria:**

**Given** any page in either locale
**When** the footer renders
**Then** it shows the logo and blurb, Products (PXP, LXP, SXP, IoT Device Management, Product updates), Services (Product Engineering, AI-Driven Analytics, Staffing Service, Low-code Solutions, Cloud Computing, All services), Company (About, Core values, FAQ to `/about#faq`, News, Careers, Contact) and Offices.

**Given** the Offices column
**When** it renders
**Then** Plano, Texas, USA comes first and reads "7950 Legacy Drive, Suite 400, Plano, Texas 75024, USA" with `tel:+14693229899`, "WhatsApp +1 469 439 9345" (`https://wa.me/14694399345`, new tab, accessible name ending "(opens in a new tab)") and `mailto:vinni.tran@newxion.com`
**And** Ho Chi Minh City, Vietnam follows with the label "Vietnam Delivery Center", "Floor 15, B1 Building, 279 Nguyen Tri Phuong Street, Dien Hong Ward, Ho Chi Minh City, Vietnam" and `tel:+84908107552`
**And** there is no "Head office" label, no Da Nang office and no second HCMC address; the same blocks appear on About and Book a demo.

**Given** the bottom bar
**When** it renders
**Then** it shows copyright, a "Privacy policy" link to `/privacy` and the GET IT DONE tag with DONE in amber.

**Given** 900px and 640px
**When** the footer renders
**Then** it uses 2 columns and 1 column respectively.

**Given** any page, including Careers, Job, News story, Privacy and Not found
**When** the footer renders
**Then** "Contact" in the Company column links to `/demo` (`/demo#form` opens the Product demo tab), so Book a demo is reachable without a header button (AC-NAV-2).

### Story 1.6: Inner page hero, breadcrumbs and anchor landing

As Lan, following a link to a section,
I want the section heading to land fully visible and to see where I am,
So that I never read a page with its title hidden under the header.

- **Design reference:** `mockups/site-v3/news.html` hero (`hero-light`, `nav.crumbs`), `services.html` hero (`hero-navy`, `canvas.strands`), `products.html` hero (`hero-amber`)
- **Spec references:** EXP > Component Patterns (Breadcrumbs, Highlight mark), Interaction Primitives, Motion (Inner page hero background, Highlight mark); DES > Layout & Spacing (Anchors), Colors (hero surfaces)
- **Requirements:** FR-6, FR-8; NFR-2; UX-DR9, UX-DR11
- **AC IDs:** AC-NAV-5
- **Owner:** Sammy (proposed)
- **Size:** M
- **Demo day:** after demo (until then each must-have page story builds its own breadcrumbs from the prototype markup)
- **Depends on:** 1.1

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
- **Owner:** Sammy (proposed)
- **Size:** S
- **Demo day:** must-have
- **Depends on:** 1.1

**Acceptance Criteria:**

**Given** an unknown path under `/en/` or `/vi/`
**When** it is requested
**Then** the response status is 404 `[ASSUMPTION]` and the page shows "We couldn't find that page." (VI "Không tìm thấy trang này.") with the lede "The link may be old or mistyped. These pages can help."
**And** one primary "Go to Home" button plus glass links to Products, Services and News, all in the current locale.

**Given** the Not found page
**When** it renders
**Then** header and footer are present and there is exactly one H1
**And** there is no email capture band (FR-33 exception).

### Story 1.8: Sanity setup

As a XionTechs editor,
I want the site connected to a working Sanity project,
So that stories and roles I publish can appear on the site.

- **Design reference:** none (non-visual)
- **Spec references:** `docs/spikes/cms-spike.md` (Decision, Free-tier cost, Trade-offs, Open work items 1 to 4 and 7); EXP > Open Questions (CMS choice)
- **Requirements:** FR-27, FR-32 (content source)
- **AC IDs:** none
- **Owner:** Andy (proposed)
- **Size:** M
- **Demo day:** must-have
- **Depends on:** 1.1

**Acceptance Criteria:**

**Given** a free Sanity project with one `post` and one `job` document
**When** the site reads them on the server
**Then** both are returned with real content, proving reads (the spike used a fake project ID and did not prove this).

**Given** `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`
**When** they are set locally and on Vercel
**Then** the site reads the dataset
**And** when either is missing the build fails with a clear message instead of rendering empty pages.

**Given** the Sanity CORS origins
**When** they are configured
**Then** they list localhost, the production domain, `xiontech-dev.vercel.app` and the preview URLs as exact origins, with no credentials on a wildcard origin.

**Given** public reads
**When** a page fetches stories or roles
**Then** it uses `useCdn: true` and tag-based caching, not `force-dynamic`
**And** a Sanity webhook with a secret triggers tag revalidation on publish, so reads stay far below the free 250k API and 1M CDN requests per month
**And** a webhook call without the right secret is rejected.

**Given** the EN/VI content model
**When** the `post` and `job` schemas are defined
**Then** translation is field-level (one document with EN and VI fields) `[ASSUMPTION]`, because document-level translation doubles the document count against the 10,000 per-dataset limit; the spike leaves this choice open.

**Given** the Studio location
**When** the Studio is deployed
**Then** it is hosted free on `<name>.sanity.studio` `[ASSUMPTION]`, which keeps the heavy Studio bundle and `styled-components` out of our Next.js build; `/studio` is the fallback. The spike names both options without choosing.

**Given** the free dataset is public
**When** content is set up
**Then** only published documents are read without a token, and draft reads (IDs starting `drafts.`) are checked to need a token.

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
- **Owner:** Sammy (proposed)
- **Size:** S
- **Demo day:** must-have
- **Depends on:** 1.1

**Acceptance Criteria:**

**Given** `/privacy` in either locale
**When** it renders
**Then** it shows breadcrumbs, the H1 "Privacy policy." and sections "Who we are and how to reach us", "What we collect", "How we use it", "Who we share it with", "Transfers outside Vietnam", "How long we keep it", "Cookies and analytics", "Your rights" in EN and VI (PDPD, Decree 13/2023)
**And** there is no email capture band (FR-33 exception).

**Given** the "Cookies and analytics" section
**When** it renders
**Then** it lists the essential first-party locale cookie (what it stores and why) and states that no non-essential cookies are set without consent.

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
- **Owner:** Andy (proposed)
- **Size:** L
- **Demo day:** must-have
- **Demo-day slice:** M. Every AC except bringing back typed hidden-tab values when the visitor switches tabs, which follows after demo.
- **Depends on:** 1.1

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
- **Owner:** Andy (proposed)
- **Size:** M
- **Demo day:** must-have (forms are live on Demo day)
- **Depends on:** 2.2

**Acceptance Criteria:**

**Given** a valid contact form
**When** it is submitted
**Then** the button is disabled and reads "Sending..." ("Đang gửi...")
**And** on success the form is replaced by a `role="status"` panel reading "Thank you!" and "We will be in touch soon."

**Given** the server rejects or times out
**When** the send fails
**Then** every entered value is kept and an error shows above the button with a way to retry.

**Given** a Submission that bypasses the client checks
**When** it reaches the server
**Then** the server applies the same rules as the client (required fields, email format, message up to 2,000 characters, preferred date today or later) and rejects an invalid Submission with the same wording, including "Please keep your message under 2,000 characters."

**Given** the hidden honeypot field
**When** the form renders
**Then** it has `tabindex="-1"`, `aria-hidden="true"` and `autocomplete="off"`, so keyboard, screen reader and autofill users never fill it
**And** a Submission with the honeypot filled is rejected and not delivered.

**Given** the rate limit, keyed on IP plus email and allowing 5 Submissions per 10 minutes per key `[ASSUMPTION]`
**When** a key goes over the limit
**Then** further Submissions are rejected and not delivered, while other people on the same office IP with a different email are not blocked
**And** a real visitor who hits the rate limit sees a retryable error and keeps what they typed
**And** the counters live in a shared store that works across serverless instances (free tier, chosen in architecture).

**Given** a valid demo or project Submission
**When** it is accepted
**Then** it is sent through the mail sender service (free tier, chosen in architecture) to the contact inbox vinni.tran@newxion.com, set in server configuration
**And** no personal data appears in any URL, query string or hash.

### Story 2.4: Email capture band (demo, project)

As Lan, reading the Products page,
I want to leave only my work email and land on a form already started,
So that booking a demo takes a few clicks.

- **Design reference:** `mockups/site-v3/index.html` capture (`#cap-h`, `#cap-email`, amber, `data-mode="demo"`); `services.html` capture (amber, `data-mode="project"`); `news.html` and `about.html` captures (amber, demo)
- **Spec references:** EXP > Component Patterns (Email capture), State Patterns (Email capture), Voice and Tone (CTA labels, Wording to reuse), Interaction Primitives; DES > Components (Email capture, Focus ring), Colors (error on navy)
- **Requirements:** FR-33, FR-34, FR-39, FR-40; NFR-3; UX-DR20 (FR-35 removed: no subscribe or join kinds)
- **AC IDs:** AC-A11Y-2, AC-A11Y-5, AC-FORM-2
- **Owner:** Andy (proposed)
- **Size:** M
- **Demo day:** must-have
- **Demo-day slice:** S. Both kinds with validation, sending and retry states, redirect and prefill; the navy-band focus and error colours are checked in Story 7.3.
- **Depends on:** 2.2

**Acceptance Criteria:**

**Given** one shared capture component with a kind of demo or project (there is no subscribe or join kind)
**When** it renders
**Then** the button reads "Book a demo" or "Start a project" (VI "Đặt lịch demo", "Bắt đầu dự án")
**And** it is an inline band with H2 and lede left and the form right, never a modal.

**Given** each kind
**When** it renders
**Then** the consent line reads, respectively, "We only use your email to arrange your demo." and "We only use your details to respond to this request.", each ending with a "Privacy policy" link.

**Given** an invalid email
**When** the visitor submits
**Then** "Please enter a valid email address." shows inline and is announced, the field gets `aria-invalid="true"` and `aria-describedby`, focus returns to the field, and the error clears as the visitor types (AC-A11Y-5).

**Given** a valid demo or project email
**When** it is sending
**Then** the button is disabled and reads "Sending..." ("Đang gửi...")
**And** if the send fails, the email is kept and an inline error with a retry shows in the band.

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

**Given** session storage is unavailable (blocked or throws)
**When** a valid demo or project capture is submitted
**Then** the visitor still lands on the right `/demo` tab with no prefill and types the email there, and no error is shown.

**Given** 640px and below
**When** the band renders
**Then** the field stacks above the button.

**Given** `/demo`, the Not found page, `/privacy`, a `/news/[slug]` story page, `/careers` or a `/careers/[slug]` job page at any width
**When** the page renders
**Then** no capture band is shown (FR-33 exceptions; `/demo` is the form).

### Story 2.5: No non-essential cookies without consent

As Nam, a visitor who cares about privacy,
I want the site to set no tracking cookies unless I opt in,
So that my data is handled under Vietnam's PDPD.

- **Design reference:** none (non-visual; no banner in the prototype)
- **Spec references:** EXP > Open Questions (Analytics and cookies), Foundation (Stakes)
- **Requirements:** FR-42; NFR-3
- **AC IDs:** none
- **Owner:** Andy (proposed)
- **Size:** S
- **Demo day:** after demo
- **Depends on:** 1.2

**Acceptance Criteria:**

**Given** v1 with no analytics
**When** any page loads in a fresh browser
**Then** an automated test finds no non-essential or third-party cookies
**And** the only stored values are the essential first-party locale cookie, the motion preference (local storage) and the capture email (session storage, cleared once read on `/demo`) `[ASSUMPTION]`.

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
- **Owner:** Sammy (proposed)
- **Size:** M
- **Demo day:** must-have
- **Demo-day slice:** S. Every AC, with empty media frames in the device column (real media is Story 4.4) and the static fallback background (the silk is Story 3.2).
- **Depends on:** 1.1

**Acceptance Criteria:**

**Given** Home in either locale
**When** it renders
**Then** the hero is dark `hero-silk` filling `100dvh` minus the header, with no label above it, the H1 "Every school community, connected." (highlight on "connected") and the sub line from the prototype.

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
- **Owner:** Sammy (proposed)
- **Size:** L
- **Demo day:** must-have
- **Demo-day slice:** M. The continuous silk ported from the prototype shader, the pause button, pausing off screen and in a hidden tab, reduced-motion start and the static fallback; remembering the Play or Pause choice follows after demo.
- **Depends on:** 3.1

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

**Given** `prefers-reduced-motion: reduce` and no saved choice
**When** Home loads
**Then** the silk starts paused with no transition.

**Given** a saved explicit choice (Play or Pause)
**When** Home loads, with or without `prefers-reduced-motion: reduce`
**Then** the saved choice wins: a saved Play runs the silk and a saved Pause keeps it paused.

**Given** no JavaScript, no WebGL, or a lost WebGL context (`webglcontextlost`)
**When** Home renders or the context is lost
**Then** the motion toggle is hidden and the static navy and amber glow fallback shows.

**Given** the hero scrolls off screen, or the tab becomes hidden (`visibilitychange`)
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
- **Owner:** Sammy (proposed)
- **Size:** M
- **Demo day:** must-have
- **Demo-day slice:** S. The shared component with static final figures in all layouts; the count-up follows after demo.
- **Depends on:** 3.1

**Acceptance Criteria:**

**Given** the Home hero
**When** it renders
**Then** the label "Experience you can count on" ("Kinh nghiệm bạn có thể tin cậy") sits at the bottom of the hero above five figures: 25+ years of leadership experience in software, 24/7 global coverage across time zones, 20+ technology stacks, 8 service offerings, 2 offices (Ho Chi Minh City and Plano).

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
- **Owner:** Sammy (proposed)
- **Size:** S
- **Demo day:** must-have
- **Depends on:** 3.1

**Acceptance Criteria:**

**Given** Home
**When** the doors render
**Then** "Products for schools" and "Your software delivery team" sit directly under the hero, overlapping its bottom by 104px (80px at 900px and below), and stack at 900px and below.

**Given** each door
**When** inspected
**Then** the whole panel is one link (Products door to `/products`, Services door to `/services`) and its badges and chips are text with no interactive element inside the link (AC-A11Y-4).

### Story 3.5: Why XionTechs and the four-app row

As Lan, scanning what exists,
I want to see why XionTechs, then one item per app that takes me to the details,
So that I trust the team and can go deeper on the one I care about.

- **Design reference:** `mockups/site-v3/index.html` Why XionTechs (`#why-h`, `.why`) and the four-app row (`#prod-h`, `.app-strip`)
- **Spec references:** EXP > Component Patterns (Why XionTechs, Four-app row, Spotlight card, Product badge); DES > Components (Why XionTechs grid, Four-app row, Spotlight card, Product badge)
- **Requirements:** FR-14; UX-DR15, UX-DR24
- **AC IDs:** AC-A11Y-4
- **Owner:** Sammy (proposed)
- **Size:** M
- **Demo day:** must-have
- **Demo-day slice:** S. Every AC.
- **Depends on:** 1.1

**Acceptance Criteria:**

**Given** "Why XionTechs." after the doors
**When** it renders above 900px
**Then** the large tile "We build and run our own school platforms." spans 7 columns and 2 rows with a team photo slot, "Two offices, one working day." (navy, live local times for Plano and Ho Chi Minh City) and "Education is our core." span 5 columns each, and a full-width amber "Get IT Done" strip links to `/about#values`
**And** below 900px the tiles stack in one column.

**Given** "Four apps for every role in school."
**When** it renders
**Then** PXP, LXP, SXP and IoT each show a badge, name, audience and one line, in 4, 2 and 1 columns by breakpoint
**And** each item is one link to `/products#pxp`, `#lxp`, `#sxp` or `#iot` with nothing interactive inside (AC-A11Y-4), followed by "Explore our products".

**Given** Home
**When** it renders
**Then** there is no services grid; the Home services door and the header Services link lead to `/services`.


### Story 3.6: 4-D process flow component

As Quân, deciding if this team is organised,
I want to see the four delivery steps and what I receive at each,
So that I know what working together looks like.

- **Design reference:** `mockups/site-v3/index.html` `ol.flow` (`#flow-h`); same block in `services.html#process`
- **Spec references:** EXP > Component Patterns (Process flow (4-D)), Motion (4-D process); DES > Components (Process flow (4-D))
- **Requirements:** FR-23, FR-14; UX-DR14
- **AC IDs:** AC-UI-2
- **Owner:** Sammy (proposed)
- **Size:** M
- **Demo day:** must-have
- **Demo-day slice:** S. A simple update of the prototype animation: steps enter in turn and the amber track fills once; reduced motion shows the final state; aligned "You receive" rows and the 2- and 1-column layouts. The travelling dot follows after demo.
- **Depends on:** 1.1

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
- **AC IDs:** AC-UI-1
- **Owner:** Sammy (proposed)
- **Size:** M
- **Demo day:** must-have
- **Demo-day slice:** S. The demo capture at the end of Home, the section rhythm, the no-stories state and the latest three stories from Sanity (sample titles start with `[Placeholder]`) through the content access module.
- **Depends on:** 2.4 (capture band), 1.8 (Sanity setup)

**Acceptance Criteria:**

**Given** stories read from Sanity through one content access module (set up in Story 1.8)
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

**Given** a hover-capable device after scroll reveal has finished
**When** the pointer enters a news card (the shared spotlight card)
**Then** the pointer glow and 4px lift start immediately with no delay (AC-UI-1)
**And** no pointer effect runs on touch devices.

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
- **Owner:** Sammy (proposed)
- **Size:** M
- **Demo day:** must-have
- **Demo-day slice:** S. Hero, sticky sub-nav links, anchor landing (AC-NAV-5) and horizontal scroll; the in-view highlight follows after demo.
- **Depends on:** 1.1

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
- **Owner:** Sammy (proposed)
- **Size:** M
- **Demo day:** must-have
- **Demo-day slice:** S. Tabs with the ARIA tab pattern, hidden inactive screens (AC-A11Y-3), features and store buttons opening a new tab; screens switch instantly and the 0.55s crossfade follows after demo.
- **Depends on:** 4.1

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
**Then** App Store and Google Play are always shown and read `[Placeholder]` until real links exist
**And** each opens its link in a new tab (`target="_blank"`, `rel="noopener noreferrer"`) and its accessible name ends "(opens in a new tab)".

### Story 4.3: LXP, SXP and IoT sections

As Lan, choosing apps for staff and students,
I want each web app shown in a browser frame with its audience and features,
So that I can compare them.

- **Design reference:** `mockups/site-v3/products.html#lxp`, `#sxp` (navy), `#iot`
- **Spec references:** EXP > Component Patterns (Browser frame, Media frame), State Patterns (Media missing); DES > Components (Browser frame, Media frame)
- **Requirements:** FR-17; UX-DR17
- **AC IDs:** none
- **Owner:** Sammy (proposed)
- **Size:** M
- **Demo day:** must-have
- **Demo-day slice:** S. Every AC, with browser frames holding empty media frames until real media arrives (Story 4.4).
- **Depends on:** 4.1

**Acceptance Criteria:**

**Given** `#lxp`, `#sxp` and `#iot`
**When** they render
**Then** each shows its audience, four features and a browser frame with a mono URL pill, and the sections use mist with linen, navy and paper.

**Given** an app address that is not confirmed
**When** the URL pill renders
**Then** it reads `[Placeholder] lxp.xiontechs.com`, `[Placeholder] sxp.xiontechs.com` or `[Placeholder] iot.xiontechs.com`
**And** the pill is a link that opens the app in a new tab, with an accessible name ending "(opens in a new tab)".

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
- **Owner:** Sammy (proposed)
- **Size:** M
- **Demo day:** after demo
- **Depends on:** 3.1, 4.3

**Acceptance Criteria:**

**Given** a product clip in a device frame
**When** the page loads
**Then** it never plays with sound, shows a poster frame and has visible play and pause controls
**And** a muted autoplay clip stops after 5s unless the visitor plays it.

**Given** `prefers-reduced-motion: reduce`
**When** a page with product clips loads
**Then** no clip autoplays, even muted; each shows its poster frame until the visitor presses play.

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
- **Owner:** Sammy (proposed)
- **Size:** S
- **Demo day:** after demo
- **Depends on:** 3.7 (content module), 2.4, 4.1

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
I want live local times for Ho Chi Minh City and Plano,
So that I know when the team is working.

- **Design reference:** `mockups/site-v3/services.html` hero (`section.hero-navy`, `.cta-row`, `.clock-strip`)
- **Spec references:** EXP > Component Patterns (Clock strip, Office card), State Patterns (Office card, clock strip); DES > Components (Clock strip, Office card)
- **Requirements:** FR-20, FR-30 (shared clock); UX-DR19
- **AC IDs:** none
- **Owner:** Sammy (proposed)
- **Size:** M
- **Demo day:** must-have
- **Demo-day slice:** S. Every AC; until Story 5.4 lands, "See our 4-D process" opens Services at the top of the page.
- **Depends on:** 1.1

**Acceptance Criteria:**

**Given** `/services`
**When** it renders
**Then** a navy hero shows breadcrumbs, the H1 "Software teams that get IT done.", a primary "Start a project" to `/demo#project` and a glass "See our 4-D process" to `#process`.

**Given** the clock strip before JavaScript runs
**When** the server responds
**Then** it shows "Ho Chi Minh City GMT+7" and "Plano US Central".

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
- **Owner:** Sammy (proposed)
- **Size:** M
- **Demo day:** must-have
- **Demo-day slice:** S. Every AC, reusing the static stats from the Story 3.3 slice.
- **Depends on:** 3.3 (stats band)

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
- **Owner:** Sammy (proposed)
- **Size:** S
- **Demo day:** after demo
- **Depends on:** 1.1

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
- **Owner:** Sammy (proposed)
- **Size:** S
- **Demo day:** must-have
- **Depends on:** 3.6 (4-D component), 2.4, 5.1

**Acceptance Criteria:**

**Given** the Story 3.6 component placed on a navy band with `id="process"`
**When** Quân follows "See our 4-D process" from the Services hero
**Then** the heading lands fully visible (AC-NAV-5) and the "You receive" rows align across the four cards (AC-UI-2).

**Given** the amber project capture "Tell us what you're building."
**When** Quân submits a valid work email
**Then** `/demo#project` opens on the Outsourcing project tab, scrolled to the form, with his email prefilled (AC-FORM-2).

**Given** the Services page
**When** a tester checks surfaces
**Then** it has the navy hero and navy 4-D band and exactly one amber band (the capture).

## Epic 6: News, About and Careers

Visitors read stories and learn who XionTechs is; Nam applies for a role; editors publish without a developer.

### Story 6.1: News page with category filters

As Nam, looking for team stories,
I want to filter news by category instantly,
So that I only read what interests me.

- **Design reference:** `mockups/site-v3/news.html` hero, `.filters`, `#newsGrid`, `#newsCount`, `#newsEmpty`, demo capture (amber)
- **Spec references:** EXP > Component Patterns (Filter chips, News card, Category tag), State Patterns (News); DES > Components (Filter chips, News card)
- **Requirements:** FR-25, FR-33 (placement), FR-45 (server-rendered list); UX-DR22
- **AC IDs:** none
- **Owner:** Sammy (proposed)
- **Size:** M
- **Demo day:** must-have
- **Depends on:** 3.7 (content module), 1.8, 2.4

**Acceptance Criteria:**

**Given** `/news`
**When** it renders on the server
**Then** a light hero with the H1 "What we've been up to." precedes filter chips All, Product, Company, Schools, Team and a story grid whose first card is a wide feature.

**Given** the chips
**When** Nam presses Team
**Then** only Team stories show without a reload, Team has `aria-pressed="true"` and the others false, and the result count is announced
**And** pressing the active chip does nothing.

**Given** the announced result count
**When** it renders in EN and VI
**Then** EN uses plural forms, "Showing 1 story" or "Showing N stories", and VI reads "Đang hiển thị N tin" for every N.

**Given** a category with no stories
**When** it is selected
**Then** "No stories in this category yet." shows with a "Show all" button that resets to All.

**Given** the end of `/news`
**When** it renders
**Then** the amber demo capture "See it working at your school." from Story 2.4 is shown, and there is no newsletter sign-up
**And** on Demo day the stories come from Sanity with titles that start with `[Placeholder]`.

### Story 6.2: Story detail page

As Nam, opening a Team story,
I want a readable page with the date, category and a way back,
So that I can finish the story and keep browsing.

- **Design reference:** `mockups/site-v3/news-story.html`
- **Spec references:** EXP > Information Architecture (News story), Bilingual (EN / VI), Component Patterns (News card, Category tag)
- **Requirements:** FR-26
- **AC IDs:** none
- **Owner:** Sammy (proposed)
- **Size:** M
- **Demo day:** must-have
- **Demo-day slice:** S. Every AC except the per-story Open Graph image, which follows after demo.
- **Depends on:** 3.7 (content module), 1.8, 1.7

**Acceptance Criteria:**

**Given** `/news/[slug]` for an existing story
**When** it renders
**Then** it shows breadcrumbs Home / News / story, H1, mono date and category tag, photo, body, a related product link (for example `/products#pxp`) and "Back to News"
**And** there is no email capture band (FR-33 exception).

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
I want to create, edit and publish stories, open roles, team and office photos and product clips,
So that news and hiring stay current without a code change.

- **Design reference:** none (non-visual editor workflow in Sanity Studio); media shown in `mockups/site-v3/news-story.html` photo frame
- **Spec references:** EXP > Component Patterns (Media frame), Open Questions (CMS choice); `docs/spikes/cms-spike.md`; PRD 8.1
- **Requirements:** FR-27, FR-32 (editing)
- **AC IDs:** AC-FORM-3
- **Owner:** Andy (proposed)
- **Size:** L
- **Demo day:** must-have
- **Demo-day slice:** S. Stories, roles, team and office photos and product clips editable in Sanity Studio with English fields, appearing after revalidation; Vietnamese fields follow after demo.
- **Depends on:** 1.8 (Sanity setup), 3.7 (content module)

**Acceptance Criteria:**

**Given** Sanity Studio (Story 1.8)
**When** an editor publishes a story or role with EN and VI fields
**Then** the webhook revalidates the tagged pages and it appears on News, Home, Products `#updates` or Careers through the same content access module, with no code change and no deploy.

**Given** Sanity Studio image fields
**When** an editor uploads or pastes an image
**Then** only the item the editor selected changes, never a previously hovered item (AC-FORM-3).

**Given** an editor closes the last open role
**When** Careers renders
**Then** the Open roles panel shows instead.

### Story 6.4: About page

As Quân, checking who is behind the services,
I want the company story, values and offices on one page,
So that I trust the team before I start a project.

- **Design reference:** `mockups/site-v3/about.html` hero, key facts stats, `#story-h`, `#values`, `#faq`, `#off-h`, capture (amber)
- **Spec references:** EXP > Information Architecture (About), Component Patterns (Value grid, Office card, Placeholder frame); DES > Components (Value grid, Office card)
- **Requirements:** FR-28, FR-29 (no leadership), FR-30, FR-46, FR-12 (reuse), FR-6; UX-DR19, UX-DR23, UX-DR27
- **AC IDs:** AC-NAV-5
- **Owner:** Sammy (proposed)
- **Size:** M
- **Demo day:** must-have
- **Demo-day slice:** S. Every AC except the FAQPage structured data, which follows after demo; stats come from the Story 3.3 slice.
- **Depends on:** 3.3 (stats band), 5.1 (clock), 2.4 (capture band)

**Acceptance Criteria:**

**Given** `/about`
**When** it renders
**Then** a navy hero with "Tech made simple. Solutions made powerful." is followed by stats, the story "Two strengths, one team.", values, FAQ, offices and a capture band.

**Given** `#faq`
**When** a visitor opens it from the footer "FAQ" link
**Then** the heading lands fully visible (AC-NAV-5) and nine questions show as a disclosure list in EN and VI; each opens and closes with mouse, Enter or Space; several can be open at once
**And** the page carries FAQPage structured data with the same questions and answers, in the page's language (Vietnamese on `/vi/about`).

**Given** the FAQ answer to "How do you keep our data secure?"
**When** it renders, and in the FAQPage structured data
**Then** it starts with `[Placeholder]` in EN and VI until the business supplies real facts (hosting, access control, certifications).

**Given** `#values`
**When** reached from the footer "Core values" link
**Then** the heading lands fully visible (AC-NAV-5) and the 3 x 2 grid shows Startup Spirit, Client Centricity, Integrity First, Innovation Driven, "Get IT Done" Attitude (featured amber cell) and People-Centered Culture in office-banner wording.

**Given** `/about`
**When** it renders
**Then** there is no leadership section (no photos, names or titles; FR-29, decided 2026-09-29) and no names from the old site appear.

**Given** the navy offices section
**When** it renders
**Then** each office card shows the live local time from the Story 5.1 clock module, address and a `tel:` link.

**Given** the About stats band and capture
**When** built
**Then** they follow the prototype: fourth figure "4 School products ready to demo", and the amber demo capture "See our apps in action." with "Leave your work email and we'll arrange a walkthrough of PXP, LXP and SXP." and "Book a demo" (decided 2026-09-29).

### Story 6.5: Careers page and open roles

As Nam, a QA engineer,
I want to see the culture and the roles that are open,
So that I can pick a role and read it in full.

- **Design reference:** `mockups/site-v3/careers.html` hero, `#cul-h`, `#ben-h`, `#roles` (`.roles`, `.role`), `#life`
- **Spec references:** EXP > Information Architecture (Careers), Component Patterns (Role card, Open roles panel, Placeholder frame), State Patterns (Careers), Key Flows (Flow 4); DES > Components (Role card)
- **Requirements:** FR-31, FR-32; UX-DR23
- **AC IDs:** AC-A11Y-4
- **Owner:** Sammy (proposed)
- **Size:** M
- **Demo day:** must-have
- **Demo-day slice:** S. Every AC, with roles, team and office photos read from Sanity (sample roles start with `[Placeholder]`).
- **Depends on:** 1.8 (Sanity setup)

**Acceptance Criteria:**

**Given** `/careers`
**When** it renders
**Then** an amber hero "Build what schools use every day." with "See open roles" (to `#roles`) and "Life at XionTechs" (to `#life`) is followed by culture, four benefits (Innovative workspace, Growth opportunities, Engaging work, Meaningful impact), open roles and Life at XionTechs
**And** there is no email capture band and no talent-network sign-up.

**Given** open roles exist in Sanity
**When** Open roles renders
**Then** each role is a card showing the job title, then team, location and work type, and "View and apply", and the whole card is one link to its job page `/careers/[slug]` with nothing interactive inside (AC-A11Y-4).

**Given** no open roles
**When** Open roles renders
**Then** it shows "No open roles right now." and no invented role appears.

**Given** team and office photos in Sanity
**When** `#life` renders
**Then** they show in the three frames; missing photos show placeholder frames with a `[Placeholder]` caption.

### Story 6.6: Job page and application with CV upload

As Nam, a QA engineer,
I want to read a role in full and apply with my CV on the same page,
So that applying takes one short form.

- **Design reference:** `mockups/site-v3/job.html` hero (breadcrumbs, H1, chips), `.job-body`, `#apply` (`#applyForm`, `#a-cv`, `.form-ok`)
- **Spec references:** EXP > Information Architecture (Job page), Component Patterns (Job application form), Job application fields, State Patterns (Job page, Job application), Key Flows (Flow 4); DES > Components (File field)
- **Requirements:** FR-47, FR-38 (server checks), FR-40; NFR-1, NFR-3
- **AC IDs:** AC-A11Y-5
- **Owner:** Andy (proposed)
- **Size:** M
- **Demo day:** must-have
- **Depends on:** 1.8 (Sanity setup), 2.3 (server checks), 6.5 (role links); 1.7 for unknown roles

**Acceptance Criteria:**

**Given** `/careers/[slug]` for an open role
**When** it renders
**Then** it shows breadcrumbs Home / Careers / job title, the H1 job title, team, location and work type, "About the role", "What you'll do", "What you bring" and "All open roles" back to `/careers#roles`, with the "Apply for this role" form beside the details (below them at 900px and below)
**And** there is no email capture band.

**Given** the application form
**When** Nam submits it with a missing name, an invalid email, no CV, a CV that is not PDF or Word, a CV over 5 MB, or a cover note over 2,000 characters
**Then** each invalid field is marked with its wording ("Please enter your name.", "Please enter a valid email address.", "Please upload your CV as a PDF or Word file, up to 5 MB.", "Please keep your note under 2,000 characters."), errors are announced and linked with `aria-describedby`, and focus moves to the first invalid field (AC-A11Y-5)
**And** a CV that is too large or the wrong type is flagged as soon as it is chosen.

**Given** a valid application
**When** it is sending
**Then** the button is disabled and reads "Sending..."
**And** on success the form is replaced by "Thank you!" and "We've received your application and will be in touch if it's a match."
**And** on failure every value, including the chosen CV, is kept and an error with a retry shows above the button.

**Given** a valid application
**When** the server receives it
**Then** it repeats the same checks (including file type and size), rejects a filled honeypot and applies the FR-38 rate limit, and stores the application with its CV in Sanity linked to the role
**And** no personal data appears in any URL.

**Given** the consent line
**When** the form renders
**Then** it reads "We only use your details and CV to consider your application." and ends with a "Privacy policy" link.

**Given** an unknown or closed role
**When** `/careers/[slug]` is requested
**Then** the Not found page from Story 1.7 renders.

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
- **Owner:** Andy (proposed)
- **Size:** M
- **Demo day:** after demo
- **Depends on:** 1.2, 1.7

**Acceptance Criteria:**

**Given** each of the 11 page types in each locale
**When** its HTML is fetched
**Then** it has a unique title, meta description, canonical URL (except the Not found page), Open Graph tags and favicon, all translated.

**Given** any page other than Not found
**When** its head is inspected
**Then** it links its `/en/` and `/vi/` versions with `hreflang` and `x-default` points to `/en/`.

**Given** the site
**When** `/sitemap.xml` is fetched
**Then** it lists every public page in both locales `[ASSUMPTION]`.

**Given** the Not found page
**When** its head is inspected
**Then** it has `<meta name="robots" content="noindex">` and no canonical URL or `hreflang` links
**And** it has no entry in `/sitemap.xml`.

### Story 7.2: Server rendering, no-JS content and structured data

As Hà, on a slow phone connection,
I want the content to be there before scripts load,
So that I can read even if JavaScript fails.

- **Design reference:** all 10 prototype pages (content order)
- **Spec references:** EXP > Foundation (Rendering), State Patterns (No JavaScript, Fonts loading)
- **Requirements:** FR-45; NFR-5
- **AC IDs:** none
- **Owner:** Andy (proposed)
- **Size:** M
- **Demo day:** after demo
- **Depends on:** the page stories it checks (Epics 1 to 6)

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
- **Owner:** Andy (proposed)
- **Size:** M
- **Demo day:** must-have
- **Demo-day slice:** S. axe-core and the keyboard checks on every English page, fixing every serious or critical issue; the Vietnamese run and the 320px VI check follow after demo.
- **Depends on:** the page stories it checks (Epics 1 to 6)

**Acceptance Criteria:**

**Given** axe-core run locally before release on all 11 page types in EN and VI (there is no CI yet)
**When** the run finishes
**Then** there are zero serious or critical violations, including colour contrast (AC-A11Y-1).

**Given** a design-token contrast unit test
**When** unit tests run
**Then** every text and icon token pair used on paper, mist, amber and navy meets 4.5:1 (3:1 for large text and icons), amber text on light surfaces uses `#8A6700`, and `#C99700` is never paired as text (AC-A11Y-1).

**Given** Playwright keyboard tests
**When** they run
**Then** they prove a visible ring on paper, mist, amber and navy including the navy capture field (AC-A11Y-2), no focus into closed menus, inactive tabs or phone screens (AC-A11Y-3), no nested interactive elements in links (AC-A11Y-4) and announced, linked field errors (AC-A11Y-5).

**Given** each page
**When** checked
**Then** it has one H1, tab order follows reading order, touch targets are at least 44 x 44px, functional text is at least 11.5px, and images have EN and VI alt text or empty alt when decorative.

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
- **Owner:** Andy (proposed)
- **Size:** M
- **Demo day:** must-have
- **Demo-day slice:** S. A mobile Lighthouse run on every English page, fixing render-blocking assets (AC-PERF-1) and anything that breaks the LCP, INP or CLS budget.
- **Depends on:** 3.2 and the page stories it measures (Epics 1 to 6)

**Acceptance Criteria:**

**Given** a production build
**When** a Lighthouse check runs locally before release on every page in both locales (there is no CI yet)
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
- **Owner:** Andy (proposed)
- **Size:** S
- **Demo day:** after demo
- **Depends on:** 2.1

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
- Scope update (2026-09-29, Amber Do): English only on Demo day; silk, 4-D process, News, Careers with the new Story 6.6 (job page and CV upload), live forms and the accessibility and performance audits are Demo-day must-haves; newsletter, talent network and leadership removed; no cuts, so the plan is 23.5 developer-days for the lead to resolve.
- Lead review (2026-09-28): added the Demo-day plan, owners, Demo-day tags and "Depends on" lines; Sanity replaced the file-based fallback and Story 1.8 (Sanity setup) was added; UX-DR27 (FAQ) was added; the other review fixes are applied in the stories above.

## Open Items Carried From the PRD

- Sanity setup (Story 1.8; CMS chosen, `docs/spikes/cms-spike.md`), contact inbox address (Story 2.3), CV storage privacy in Sanity (Story 6.6; PRD open question 21), Demo-day capacity (PRD open question 22), no-JS form behaviour (Story 7.2), About stats (Story 6.4), Demo-day placeholders (Story 7.5).
- Vietnamese copy: written and checked by Amber Do (to confirm), after Demo day (FR-4; PRD open question 17).
- Mail sender service (free tier, chosen in architecture) for Story 2.3; no vendor is decided (PRD open question 18).
- Shared store for rate limits on serverless (free tier, chosen in architecture) for Story 2.3; no vendor is decided (PRD open question 19).
- CI pipeline (after demo): until it exists, axe-core, Lighthouse and the launch content check run locally before release (Stories 7.3, 7.4, 7.5; PRD open question 20).
- Real content still `[Placeholder]`: store links, app URLs, product clips, news stories, roles, team and office photos, privacy policy text, logo SVG.
