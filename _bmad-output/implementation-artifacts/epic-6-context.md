# Epic 6 Context: News, About and Careers

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Visitors read dated stories about products, schools, team and company; learn who XionTechs is (story, values, FAQ, offices); and job seekers find an open role and apply with a CV on the role's own page. XionTechs editors publish stories, roles, team and office photos and product clips in Sanity Studio without a developer or a deploy. This epic turns the shared shell, capture bands and Sanity setup from earlier epics into the trust-building and hiring pages of the site.

## Stories

- Story 6.1: News page with category filters
- Story 6.2: Story detail page
- Story 6.3: Editors publish stories and roles without a developer
- Story 6.4: About page
- Story 6.5: Careers page and open roles
- Story 6.6: Job page and application with CV upload

## Requirements & Constraints

- **Demo day (2026-10-09) is English only.** Vietnamese strings, VI fields in Sanity and VI parts of acceptance criteria follow after demo. Product and service names stay English in both languages.
- **Content integrity:** no invented stories, roles, people, stats or photos. Unverified text starts with `[Placeholder]`. On Demo day, news titles and sample roles come from Sanity and start with `[Placeholder]`. No roles may be invented at public launch.
- **News:** filter chips All, Product, Company, Schools, Team; exactly one active; instant, no reload; pressing the active chip does nothing; result count announced ("Showing 1 story" / "Showing N stories"); empty category shows "No stories in this category yet." with a "Show all" reset. The list is rendered on the server.
- **Story page** `/news/[slug]`: breadcrumbs, H1, mono date and category tag, photo, body, related product link, "Back to News"; dates read `18 SEP 2026` (EN) and `18/09/2026` (VI) in mono; own title, meta and Open Graph image (OG image is after demo). Unknown slug renders the Not found page.
- **About:** no leadership section and no names from the old site. Six core values at `#values`, nine-question FAQ at `#faq` (the data security answer stays `[Placeholder]`), office cards with live local time, address and `tel:` link. FAQPage structured data is after demo.
- **Careers:** culture, four benefits, open roles at `#roles`, Life at XionTechs photos at `#life`. Missing photos show placeholder frames with a `[Placeholder]` caption (never shipped at public launch). No roles shows "No open roles right now."
- **Job application:** Full name (required), Email (required, valid), Phone (optional, tel keypad), CV (required, `.pdf`/`.doc`/`.docx`, up to 5 MB, checked on selection and on submit), Cover note (optional, up to 2,000 characters). Error wording is fixed in the story. Unknown or closed role renders Not found.
- **Capture band placement:** demo capture on News and About; none on the story page, Careers or job pages; no newsletter or talent-network sign-up anywhere.
- **Privacy (Vietnam PDPD):** personal data only through forms, never in any URL. Each form has a consent line ending with a "Privacy policy" link.
- **Accessibility (WCAG 2.2 AA):** one H1 per page; no interactive element inside a link (role cards, news cards); invalid fields get `aria-invalid` and `aria-describedby`, errors announced, focus to the first invalid field; anchors (`#values`, `#faq`, `#roles`) land with the heading fully visible below the sticky header; targets at least 24 x 24px.
- Every story meets the project quality gate (lint, typecheck, tests, 100% changed-line coverage, branch at least 80%, smoke, build).

## Technical Decisions

- **CMS is Sanity** (free plan: 10,000 documents per dataset, 250k API and 1M CDN requests per month, public datasets). Setup is Story 1.8. Stories and roles are read through **one shared content access module** (built in Story 3.7) with `useCdn: true` for public reads and **tag-based revalidation** from a Sanity webhook with a secret. Editor changes appear on News, Home, Products `#updates` and Careers with no code change and no deploy.
- Pages are Server Components by default; only interactive parts (filter chips, FAQ is native `<details>`, job form, clocks) need client code.
- **Job applications** go through a server-side handler that repeats every client check (including file type and size), rejects a filled honeypot, applies the shared rate limit (IP plus email, 5 per 10 minutes) from Story 2.3, and stores the application with its CV in Sanity linked to the role.
- **Open risk:** uploaded Sanity files may be reachable by anyone with the link. Whether CVs may be stored in Sanity is an open question owned by Hoang Vu; it must be settled before job applications go live. Retention for CVs is also undecided.
- Shared components are reused, not rebuilt: stats band (Story 3.3), clock module with IANA zones `Asia/Ho_Chi_Minh` and `America/Chicago`, 30s refresh and server-rendered zone label (Story 5.1), email capture band (Story 2.4), Not found page (Story 1.7).
- Breadcrumbs: until the shared breadcrumb component (Story 1.6, after demo) lands, each page builds them with simple markup.
- Next.js 16 differs from training data: read `node_modules/next/dist/docs/` before using a Next.js API (dynamic routes, metadata, `notFound`, revalidation).

## UX & Interaction Patterns

- **News card:** 16:10 photo, mono date, category tag, title, one-line excerpt, "Read story". First card on News is a wide 2-column feature. Category tag is a Lexend Exa pill; product stories are amber with navy text and append the app ("Product · PXP"); others are mist with navy text.
- **Filter chips:** pill toggle buttons with `aria-pressed`; active is navy with white text.
- **Value grid:** 3 x 2 with hairlines; "Get IT Done" Attitude is the featured amber cell; hover tints a cell.
- **FAQ:** native `<details>`/`<summary>`; several open at once; Enter and Space toggle; the question is the accessible name.
- **Office card:** spotlight card with large mono clock, city title, address, phone link; shows the server-rendered zone label (GMT+7, US Central) before the live time.
- **Role card:** glass card, one stretched link; job title in the display face, then team, location and work type in muted text; "View and apply" on the right (stacks under the title at 640px and below); lifts 2px on hover. **Open roles panel** and **placeholder frame** are dashed panels.
- **Job form states:** idle, error, sending ("Sending...", button disabled), success (form replaced by "Thank you!" and the confirmation, `role="status"`), failure (every value kept, including the chosen CV, error with retry above the button). File field uses the normal field chrome with `{colors.error}` border on error. Form sits beside role details and stacks below them at 900px and below.
- **Surfaces:** About hero navy, Careers hero amber, News hero light; amber text on light uses `#8A6700`, `#C99700` is never text; focus ring on navy uses the on-navy colour.
- **Responsive:** values and news go 2 columns at 900px and 1 column at 640px; the News feature card spans full width at 900px; 16px gutters at 640px.
- Design reference mockups: `news.html`, `news-story.html`, `about.html`, `careers.html`, `job.html` under `_bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/`. `DESIGN.md` and `EXPERIENCE.md` win on any conflict with the mockups.

## Cross-Story Dependencies

- 6.1 and 6.2 need Story 1.8 (Sanity) and the content module from Story 3.7; 6.1 also needs the capture band (2.4); 6.2 needs Not found (1.7).
- 6.3 needs 1.8 and 3.7; it covers editor workflow (AC-FORM-3: an upload or paste changes only the selected item).
- 6.4 needs the stats band (3.3), the clock module (5.1) and the capture band (2.4). About stats: fourth figure "4 School products ready to demo"; capture "See our apps in action." with "Book a demo".
- 6.5 needs 1.8; its role cards link to `/careers/[slug]`, which 6.6 builds.
- 6.6 needs 1.8, the server checks and rate limit from 2.3, role links from 6.5, and Not found from 1.7.
