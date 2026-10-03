# Epic 1 Context: Bilingual site shell

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Give every page one shared, branded shell — tokens, fonts, surfaces, header, mobile menu, footer, Not found page — and connect the Sanity content source, so later page stories only add content sections. The site is bilingual (EN/VI) by design, but Demo day (2026-10-09) ships English only; locale routing and the EN/VI switch come after demo. The shell must meet WCAG 2.2 AA from the first page built, because every later story inherits it.

## Stories

- Story 1.1: Brand tokens, fonts, surfaces and motion primitives
- Story 1.2: Locale routing and EN/VI switch (after demo)
- Story 1.3: Desktop header, mega menus and skip link
- Story 1.4: Mobile menu
- Story 1.5: Site footer
- Story 1.6: Inner page hero, breadcrumbs and anchor landing (after demo)
- Story 1.7: Not found page
- Story 1.8: Sanity setup

## Requirements & Constraints

- Palette is navy, amber and white only. Amber is a fill, never text on light surfaces; amber text/icons on paper, page or mist use the darker amber-text token; the decorative amber is never text. White text on amber is banned; amber always carries navy text.
- No dark mode. Pages follow a colour rhythm: at least one navy band, at most one full-width amber band.
- WCAG 2.2 AA: 4.5:1 text, 3:1 large text, icons, focus indicators and field boundaries. Focus ring 2.5px, 3px offset, 8px radius — navy on light and amber surfaces, amber on navy.
- Four fonts, one job each (display, brand caps, body/UI, data), all with the Vietnamese subset and `display: swap`. Vietnamese H1/H2 need line-height ≥ 1.18 (built as 1.2); never tighten tracking on Vietnamese uppercase.
- Reduced motion: no animation or transition, content in its final state. Without JavaScript every section is visible.
- Icons from a React icon package; nothing render-blocking (no icon CDN script).
- Content is real or marked `[Placeholder]`. Port the prototype (`prototype-enhancement/prototype`); do not redesign. The UX spines win over the prototype on conflict.
- Free-first services; SonarQube local only; Definition of Done per `CLAUDE.md`.

## Technical Decisions

- Next.js 16 App Router, `src/` dir, Server Components by default; read `node_modules/next/dist/docs/` before using a Next.js API.
- Tailwind CSS v4: all design tokens live in `@theme` in `src/app/globals.css`, mapped 1:1 — colours to `--color-*`, fonts to `--font-display|brand|body|mono`, type to `--text-*`, radii to `--radius-*`, spacing to `--spacing-*`, container to `--container-page`. Build tokens: breakpoints 640/900/1080px, z layers (art -1, content 0, sub-nav 40, header 50, mega 55, mobile menu 60, toast 100, skip 200), `--ease-brand`, durations, three shadows, fluid type sizes.
- shadcn/ui variables map to brand tokens (`--primary` amber, `--primary-foreground` navy, `--background` page, `--foreground` text, `--ring` focus, overridden on navy).
- Section surfaces are scoped token sets (`surface-paper|mist|navy|amber`, `hero-silk|light|navy|amber`) that set text, link and focus colours for everything inside.
- Fonts through `next/font`; no Geist, no dark-mode `prefers-color-scheme` rule.
- Sanity is the CMS (free plan): the client and one tagged fetch helper live in `src/lib/sanity/*` (Story 1.8); page stories write their own queries. CVs never go to Sanity.
- File ownership: Andy owns `src/app/layout.tsx`, `globals.css` `@theme`, `src/components/layout/*` (except `site-footer.tsx`, Sammy's), `src/lib/sanity/*`, `src/app/api/*`, `src/app/demo/*`, and since plan C (decision P1, 2026-10-03) also `src/app/careers/*`, `src/app/news/*`, `src/app/products/*`, `src/app/privacy/*`, `src/components/news/*` and the Not found page. Sammy owns `src/app/page.tsx`, `src/app/services/*`, `src/app/about/*`, `src/components/home/*` and the footer.

## UX & Interaction Patterns

- Three button variants, all pills (52px, small 42px): primary (amber gradient, navy text), navy (main action on amber), glass (translucent, secondary). Press 1px down at 0.98 scale; hover lifts 2px.
- Header: sticky glass, 72px; text-only nav; active page navy bold with 2px amber underline; mega menus open on click on Demo day.
- Mobile menu below 1080px: "Menu" text pill, focus trap, scroll lock, Escape closes; Book a demo is the first item at 640px and below.
- Footer: ink background, four link columns with amber-tint caps headings, offices (Plano first, then the Vietnam Delivery Center), bottom bar with GET IT **DONE**.
- Shapes: pills for buttons/chips/fields-in-capture; 24px cards; 28px front doors and form card; 12px fields; 14px badges.

## Cross-Story Dependencies

- 1.1 blocks every story in every epic; its token and font part merges first (end of 2026-10-01).
- 1.3 mounts Sammy's footer (1.5) in the root layout; 1.4 builds on 1.3.
- 1.7's header/footer check passes only once 1.3 and 1.5 are merged.
- 1.8 unblocks 3.7, 6.1, 6.2, 6.5, 6.6 and 6.3 (content schema, fetch helper, cache tags, webhook).
