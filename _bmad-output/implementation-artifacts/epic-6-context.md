# Epic 6 Context: News, About and Careers

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Visitors read dated stories about products, schools, team and company; learn who XionTech is (story, values, FAQ, offices); and job seekers find an open role and apply with a CV on the role's own page. XionTech editors publish stories, roles, team and office photos and product clips in Sanity Studio without a developer or a deploy. This epic turns the shared shell, capture bands and Sanity setup from earlier epics into the trust-building and hiring pages of the site.

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
- **Careers:** culture, four benefits, open roles at `#roles`, Life at XionTech photos at `#life`. Missing photos show placeholder frames with a `[Placeholder]` caption (never shipped at public launch). No roles shows "No open roles right now."
- **Job application:** Full name (required), Email (required, valid), Phone (optional, tel keypad), CV (required, `.pdf`/`.doc`/`.docx`, up to 5 MB, checked on selection and on submit), Cover note (optional, up to 2,000 characters). Error wording is fixed in the story. Unknown or closed role renders Not found.
- **Capture band placement:** demo capture on News and About; none on the story page, Careers or job pages; no newsletter or talent-network sign-up anywhere.
- **Privacy (Vietnam PDPD):** personal data only through forms, never in any URL. Each form has a consent line ending with a "Privacy policy" link.
- **Accessibility (WCAG 2.2 AA):** one H1 per page; no interactive element inside a link (role cards, news cards); invalid fields get `aria-invalid` and `aria-describedby`, errors announced, focus to the first invalid field; anchors (`#values`, `#faq`, `#roles`) land with the heading fully visible below the sticky header; targets at least 24 x 24px.
- Every story meets the project quality gate (lint, typecheck, tests, 100% changed-line coverage, branch at least 80%, smoke, build).

## Technical Decisions

- **CMS is Sanity** (free plan: 10,000 documents per dataset, 250k API and 1M CDN requests per month, public datasets). Setup is Story 1.8. There is **no shared content access module** (decision T2, 2026-10-01): each page story writes its own GROQ query with the Story 1.8 server-only client and its one tagged fetch helper `sanityFetch` in `src/lib/sanity/*` (`useCdn: true`, published perspective, `force-cache` with `post` / `job` tags), with **tag-based revalidation** from the Story 1.8 Sanity webhook with a secret. Never `force-dynamic`. Editor changes appear on News, Home, Products `#updates` and Careers with no code change and no deploy.
- Pages are Server Components by default; only interactive parts (filter chips, FAQ is native `<details>`, job form, clocks) need client code.
- **Job applications** go through a server-side handler that repeats every client check (including file type and size), rejects a filled honeypot, applies the shared rate limit (IP plus email, 5 per 10 minutes) from Story 2.3, and sends the application with the Story 2.3 mail sender. The CV is uploaded from the browser straight to a **private Vercel Blob store** (decision T1). Applications and CVs are **never stored in Sanity**: free Sanity datasets are public. Sanity holds only published content (news stories, job posts, Life at XionTech photos).
- **Retention:** applications and CVs are kept with no time limit, and the privacy policy says so (decision A4). How an applicant asks for deletion is still open (owner: Amber).
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
- Design reference mockups: `news.html`, `news-story.html`, `about.html`, `careers.html`, `job.html` under `_bmad-output/prototype-enhancement/prototype/`. `DESIGN.md` and `EXPERIENCE.md` win on any conflict with the mockups.

## Cross-Story Dependencies

- 6.1 and 6.2 need Story 1.8 (Sanity and its tagged fetch helper; no content module, T2); 6.1 also needs the capture band (2.4); 6.2 needs Not found (1.7).
- 6.3 needs 1.8 and 3.7; it covers editor workflow (AC-FORM-3: an upload or paste changes only the selected item).
- 6.4 needs the stats band (3.3), the clock module (5.1) and the capture band (2.4). About stats: fourth figure "4 School products ready to demo"; capture "See our apps in action." with "Book a demo".
- 6.5 needs 1.8; its role cards link to `/careers/[slug]`, which 6.6 builds.
- 6.6 needs 1.8, the server checks and rate limit from 2.3, role links from 6.5, and Not found from 1.7.
