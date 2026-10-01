# Epic 1 Context: Bilingual site shell

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Give every visitor a branded site they can move through at any width: shared brand tokens and fonts, a sticky header with mega menus, a mobile menu, a footer with both offices, a Not found page, and a working Sanity content source for the pages that read stories and roles. Every later page renders inside this shell, so Story 1.1 blocks all other work. Demo day (2026-10-09) is English only: locale routing, the EN/VI switch and all Vietnamese strings follow after demo, so VI parts of acceptance criteria are checked later.

## Stories

- Story 1.1: Brand tokens, fonts, surfaces and motion primitives (must-have; scroll reveal after demo)
- Story 1.2: Locale routing and EN/VI switch (after demo)
- Story 1.3: Desktop header, mega menus and skip link (must-have; hover-open and fade after demo)
- Story 1.4: Mobile menu (must-have; inline mega content after demo)
- Story 1.5: Site footer (must-have)
- Story 1.6: Inner page hero, breadcrumbs and anchor landing (after demo)
- Story 1.7: Not found page (must-have)
- Story 1.8: Sanity setup (must-have)

## Requirements & Constraints

- **Content integrity:** no invented content. Unverified text starts with `[Placeholder]`. Links to `#updates` ("Product updates") are hidden on Demo day.
- **Accessibility (WCAG 2.2 AA):** contrast 4.5:1 for text and 3:1 for large text, icons and field borders. Amber text uses `#8A6700`; `#C99700` is never used for text or icons. Every surface has a visible focus ring. Hidden content cannot be focused. No interactive element sits inside a link. Each page has one H1, tab order follows reading order, and targets are at least 24x24px.
- **Motion:** under reduced motion nothing animates or transitions and content shows in its final state. Without JS every section is visible.
- **Performance:** icons come from a React icon package, and no icon or third-party script blocks rendering. Fonts use `display: swap` with the `vietnamese` subset.
- **Layouts:** 320px to wide desktop, with breakpoints at 1080, 900 and 640px. Vietnamese text never truncates buttons.
- **Navigation:** the header is sticky on every page and shows Products, Services, News, About and Careers. Book a demo (`/demo#form`) sits in the header above 640px and is the first menu item, styled as a button, at 640px and below. "Skip to content" is the first focusable element.
- **Footer:** Plano first ("7950 Legacy Drive, Suite 400, Plano, Texas 75024, USA", `tel:+14693229899`, WhatsApp `https://wa.me/14694399345` in a new tab with "(opens in a new tab)", `mailto:vinni.tran@newxion.com`). Then the HCMC "Vietnam Delivery Center" ("Floor 15, B1 Building, 279 Nguyen Tri Phuong Street, Dien Hong Ward, Ho Chi Minh City, Vietnam", `tel:+84908107552`). There is no "Head office" label, no Da Nang office and no second HCMC address. The bottom bar has copyright, a Privacy policy link and GET IT **DONE** with DONE in amber.
- **Not found:** HTTP 404 (assumed). It shows "We couldn't find that page.", one primary "Go to Home" button and glass links to Products, Services and News. Header and footer are present, and there is no email capture band.
- **Quality gate per PR:** lint, typecheck, unit tests, 100% changed-line coverage, branch coverage of at least 80% per changed file, Playwright smoke, build, and the local-only SonarQube gate.

## Technical Decisions

- Next.js 16 App Router in `src/`, React 19, strict TypeScript. Read `node_modules/next/dist/docs/` before using any Next API. Use Server Components by default.
- Tailwind v4: every DESIGN.md token is mapped 1:1 into `@theme` in `src/app/globals.css` (`--color-*`, `--font-display|brand|body|mono`, `--text-*`, `--radius-*`, `--spacing-*`, `--container-page`). Build tokens are the breakpoints, z layers (background -1, content 0, sub-nav 40, header 50, mega 55, mobile menu 60, toast 100, skip link 200), `--ease-brand`, durations and three shadows. shadcn variables are mapped too.
- Fonts load through `next/font`: Unbounded, Lexend Exa, Be Vietnam Pro and JetBrains Mono, with subsets `latin` and `vietnamese`. Under `:lang(vi)`, H1 and H2 use line-height 1.2.
- Products in the mega menu come from one data list, so a new product is one new row.
- The footer component lives in `src/components/layout/site-footer.tsx` (Sammy). Andy mounts it in `src/app/layout.tsx` (in 1.3 at the latest).
- Mobile menu: it closes when a link inside it is activated and when the viewport grows above 1080px.
- Locale (after demo): routes live under `/en/` and `/vi/`. Bare `/` is redirected on the server from an essential first-party locale cookie, then browser language, then `/en/`. The URL locale wins. Static and asset paths are excluded from the redirect.
- Sanity (1.8): Andy builds the client and one tagged fetch helper in `src/lib/sanity/*`, and each page story writes its own GROQ query. Required config is `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`; the build fails with a clear message if either is missing. Public reads use `useCdn: true` and tag-based caching (not `force-dynamic`). A webhook with a secret revalidates tags, and calls with a wrong secret are rejected. Translation is field-level (assumed). The Studio is hosted on `<name>.sanity.studio`, with `/studio` as the fallback. Reading drafts must need a token. CORS lists exact origins only. Andy also resolves the 3 high `npm audit` findings from the Sanity packages, or records in the PR why they are accepted.
- Sanity holds only published content. CVs and applicant data never go there, because free datasets are public. The Demo-day editor is Hoang Vu.

## UX & Interaction Patterns

- The design reference is the prototype at `planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/`: header and footer templates in `js/site.js`, styles in `css/site.css`, and `404.html`. DESIGN.md and EXPERIENCE.md win on any conflict.
- **Surfaces:** `surface-paper|mist|navy|amber`, `hero-silk|light|navy|amber`, each with scoped text, link and focus tokens. The focus ring is 2.5px with a 3px offset and an 8px radius: navy on light and amber surfaces, `focus-on-navy` on navy.
- **Buttons:** `button-primary` (navy on amber), `button-navy` and `button-glass`. There is one primary button per group and never white text on amber.
- **Header:** sticky glass, a 32px logo, and text-only 40px items with no caret. The active item has `aria-current="page"` and shows navy bold with a 2px amber underline. Mega menus are text only (no badges, icons or arrows), open one at a time, and close on Escape (focus returns to the trigger) or on a click outside. Triggers use `aria-expanded`. Products lists name, value and a "for" line, then "More products are on the way." and "All products". Services lists 8 links to `/services#...` plus "See the process" (`/services#process`). On Demo day the menus open on click or tap only.
- **Mobile menu (at 1080px and below):** a 40px "Menu" pill with no icon, using `aria-controls` and `aria-expanded`. Escape closes it and returns focus to the button. The page behind it does not scroll. Focus is trapped in the panel plus the logo, the EN/VI slot and the Menu button. Closed items cannot be focused.
- **Skip link:** an amber pill on focus that moves focus to `main`.
- **Footer:** ink background, a white logo plate, four columns with amber-tint Lexend Exa headings. It uses 2 columns at 900px and 1 column at 640px.
- **Breadcrumbs:** until Story 1.6 lands, each page builds simple prototype-style breadcrumbs (mono, muted: Home and the current page).

## Cross-Story Dependencies

- 1.1 blocks every story. Its token and font part merges first.
- 1.4 depends on 1.3. The EN/VI switch slot in 1.3 and 1.4 is filled by 1.2 after demo.
- 1.8 unblocks 3.7, 6.1, 6.2, 6.5 and 6.6 (stories and roles are entered in Sanity with `[Placeholder]` titles).
- Footer links to pages from later epics resolve to the Not found page (1.7) until those epics land.
- The privacy link in the footer points to `/privacy`, which Story 2.1 builds.
