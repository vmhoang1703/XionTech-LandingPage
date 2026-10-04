# Epic 3 Context: Home

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Build the Home page so a visitor understands in about five seconds what XionTech makes for schools and picks one of two front doors: Products for schools or the software delivery (outsourcing) team. Home starts the school-buyer, CTO and parent flows. It also builds two shared components that later epics reuse: the stats band (Services, About) and the 4-D process flow (Services `#process`).

## Stories

- Story 3.1: Dark Home hero with one CTA
- Story 3.2: Continuous silk animation and motion toggle
- Story 3.3: Stats band inside the hero
- Story 3.4: Two front doors
- Story 3.5: Four-app bento and eight service cards
- Story 3.6: 4-D process flow component
- Story 3.7: Latest news, demo capture and Home section rhythm

## Requirements & Constraints

- Section order: dark hero (silk, motion toggle, headline, one CTA, tablet + phone, stats band at its bottom), then two front doors, four-app bento, eight services, 4-D process, latest three stories, demo capture.
- The hero has exactly one primary CTA, "Explore our products", to `/products`; the only other control is the motion toggle.
- Colour rhythm: after the dark hero every section is light (doors, products mist with linen, services paper, news mist), except the navy 4-D band and the one amber capture band.
- Stats figures are confirmed by the business: 25+ years of leadership experience in software, 24/7 global coverage, 20+ technology stacks, 8 service offerings, 2 offices (Ho Chi Minh City and Plano). Figures and captions are passed in as data.
- No interactive element inside a link: each front door and each product tile is one link (stretched link for tiles); badges, chips and the mini phone are not interactive.
- Missing media shows an empty media frame (faint navy grid), never a broken image.
- Content is real or starts with `[Placeholder]`; sample news stories and their note start with `[Placeholder]`. Brand name in copy is "XionTech" (so the news heading reads "Latest from XionTech."), never "XionTechs" outside the domain.
- English only on Demo day: no `/vi/` routes and no EN/VI switch yet. Vietnamese strings named in stories are checked after demo.
- Motion must be controllable (WCAG 2.2.2): the silk always has the toggle and pauses off screen and in a hidden tab; under reduced motion nothing animates and every final state shows at once.
- Performance: mobile p75 LCP at most 2.5s, INP at most 200ms, CLS at most 0.1. The silk loads after first paint and must never be the LCP element. If motion hurts these targets, reduce the motion, not the targets.
- WCAG 2.2 AA: one H1, `aria-hidden` decorative canvas, amber text on light surfaces uses `#8A6700` (never `#C99700`), visible focus on every surface.
- Demo-day slices (the rest follows after demo): 3.1 with empty media frames and static fallback; 3.2 without remembering the Play or Pause choice; 3.3 with static final figures (no count-up); 3.5 without spotlight glow and lift; 3.6 without the travelling dot; 3.7 with the latest three stories from Sanity, the no-stories state, the rhythm and the demo capture.

## Technical Decisions

- Next.js 16 App Router; Server Components by default; client islands only where needed (silk canvas and toggle, scroll-triggered animations, count-up).
- Tailwind v4 tokens and surfaces (`hero-silk`, `surface-mist`, `surface-paper`, `surface-navy`, `surface-amber`) in `src/app/globals.css`; port the prototype `mockups/site-v3/index.html`, `css/site.css` and `js/site.js`, do not redesign. The UX spines win over the prototype on any conflict.
- WebGL silk is a client-only component loaded after first paint, ported from the prototype shader (time scale 0.35). Without JavaScript, without WebGL, or on `webglcontextlost`, the toggle hides and the static navy and amber glow fallback shows.
- Motion choice is remembered (prototype key `xt3-motion`); a saved Play or Pause wins over `prefers-reduced-motion`; with no saved choice, reduced motion starts paused.
- Stats band and 4-D process flow are one shared component each, data-driven, usable on navy and light surfaces (stat suffix amber on navy, `#8A6700` on light).
- News comes from Sanity through the client and the one tagged fetch helper from the Sanity setup story (`src/lib/sanity/*`): each page story writes its own GROQ query, there is no shared content access module (decision T2); `useCdn: true`, tag-based caching with webhook revalidation, never `force-dynamic`.
- Motion uses the brand easing `cubic-bezier(.16, 1, .3, 1)`; icons come from the `@phosphor-icons/react` package, never a render-blocking script.
- Owners: Sammy builds 3.1 to 3.6; 3.7 moved to Andy (decision P1, 2026-10-03).

## UX & Interaction Patterns

- Hero: fills `100dvh` minus the header; text column 0.92fr, devices 1.08fr; H1 "Every school community, connected." with the amber highlight mark on "connected" (scales in over 1.2s after 0.5s). At 900px and below it stacks to one column and devices are at most 560px wide.
- Motion toggle: 36px round icon button at the top right of the hero, ink at 50%, white border at 30%, 70% opacity at rest. The label slides out on hover or keyboard focus. Its accessible name is "Pause motion" or "Play motion" and carries the state; no `aria-pressed`.
- Stats band: label "Experience you can count on"; 5, 3 and 2 columns above 1080px, at 1080px and below, and at 640px and below. Count-up once over 1.4s at 60% visible, ease out; "24/7" never counts; screen readers get final values only.
- Front doors: overlap the hero bottom by 104px (80px at 900px and below) and stack at 900px and below. Products door is a light gradient with four badges and chips; Services door is navy with service chips and "+3 more".
- Bento "Four apps. One school day.": above 900px PXP spans 7 columns and 2 rows (amber), SXP 5 (navy), LXP 3, IoT 2; badges swap for contrast on PXP and SXP; the app name always sits next to a badge. Tiles link to `/products#pxp|#lxp|#sxp|#iot`.
- Services "Eight ways we get IT done for you.": 8 cards linking to `/services` anchors, in 4, 2 and 1 columns. Spotlight hover (pointer glow, 4px lift) starts at once after scroll reveal and only on hover-capable devices.
- 4-D process: ordered list "Your request", 01 Discovery, 02 Design, 03 Development, 04 Deployment, "Launch". At 30% visible the track fills amber over 2.4s and steps enter at 0.3s, 0.85s, 1.4s and 1.95s. "You receive" rows align across the four cards above 1080px. At 1080px and below the track and end nodes hide and steps show in 2 columns, then 1 column at 640px and below.
- News cards: 16:10 photo, mono date, category tag (product stories add the app name, for example "Product · PXP"), title, excerpt, "Read story" to `/news/[slug]`. Fewer than three stories shows only those; no stories hides the grid and keeps "See all news".
- Without JavaScript every section stays visible; reveal animations are an enhancement.

## Cross-Story Dependencies

- All stories depend on the brand tokens, fonts and surfaces story (1.1).
- 3.2, 3.3 and 3.4 build on the hero from 3.1.
- 3.7 needs the email capture band (2.4, amber demo kind "See it working at your school.") and the Sanity setup with its tagged fetch helper (1.8). "Read story" targets the story detail page from Epic 6 (6.2); until it lands, those links show the Not found page.
- The stats band from 3.3 is reused on Services (5.2) and About (6.4); the 4-D process from 3.6 is reused at `/services#process` (5.4). Keep both components data-driven and surface-aware.
- Real hero media comes later with product media (4.4); until then the device frames show empty media frames.
