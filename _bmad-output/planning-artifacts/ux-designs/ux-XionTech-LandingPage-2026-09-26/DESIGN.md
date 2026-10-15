---
name: XionTech Website
description: Multi-page company website for XionTech in English and Vietnamese, selling four school products and outsourcing services. Navy, amber and white from the logo, with a section colour rhythm instead of dark mode. Built on Next.js 16 + Tailwind CSS v4 + shadcn/ui (planned) + Motion; tokens map to Tailwind @theme.
status: final
updated: 2026-10-01
colors:
  # Brand core, sampled from the logo
  navy: '#163663'
  amber: '#FFC000'
  amber-tint: '#FFCF06'
  # Navy family
  navy-2: '#244C85'
  navy-hover: '#0F2748'
  navy-glow: '#1E4178'
  navy-soft: '#3F66A0'
  ink: '#0B1730'
  # Amber family (gradients and fills only; never text on light surfaces)
  amber-light: '#FFD84A'
  amber-pale: '#FFE27A'
  amber-deep: '#F0B300'
  amber-decor: '#C99700'
  amber-text: '#8A6700'
  # Light surfaces
  paper: '#FDFDFE'
  page: '#F7F9FD'
  mist: '#EEF2F9'
  mist-end: '#F4F7FC'
  ice: '#DCE6F5'
  door-tint: '#EAF0FA'
  edge-blue: '#6F8FC1'
  white: '#FFFFFF'
  # Text on light surfaces
  heading: '#163663'
  text: '#10223F'
  muted: '#4A5B78'
  placeholder: '#5B6B86'
  border: '#1636631F'
  field-border: '#75869F'
  # Text on navy surfaces
  on-navy-heading: '#FFFFFF'
  on-navy-text: '#EEF2F9'
  on-navy-muted: '#C5D0E3'
  on-navy-link: '#FFCF06'
  on-navy-border: '#FFFFFF24'
  # Text on amber surfaces
  on-amber-text: '#163663'
  on-amber-muted: '#23406B'
  # Feedback
  error: '#8A1C14'
  error-border: '#B3261E'
  error-on-navy: '#FFB4AB'
  # Focus
  focus: '#163663'
  focus-on-navy: '#FFC000'
typography:
  display-hero:
    fontFamily: Unbounded
    fontSize: 3.5rem
    fontWeight: '700'
    lineHeight: '1.08'
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Unbounded
    fontSize: 2.2rem
    fontWeight: '700'
    lineHeight: '1.08'
    letterSpacing: -0.03em
  headline:
    fontFamily: Unbounded
    fontSize: 2.8rem
    fontWeight: '600'
    lineHeight: '1.12'
    letterSpacing: -0.025em
  headline-mobile:
    fontFamily: Unbounded
    fontSize: 1.9rem
    fontWeight: '600'
    lineHeight: '1.12'
    letterSpacing: -0.025em
  stat:
    fontFamily: Unbounded
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.03em
  title-lg:
    fontFamily: Unbounded
    fontSize: 1.7rem
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  title-md:
    fontFamily: Unbounded
    fontSize: 1.2rem
    fontWeight: '600'
    lineHeight: '1.3'
  title-sm:
    fontFamily: Unbounded
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 1.12rem
    fontWeight: '400'
    lineHeight: '1.6'
  body:
    fontFamily: Be Vietnam Pro
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 0.92rem
    fontWeight: '400'
    lineHeight: '1.5'
  ui:
    fontFamily: Be Vietnam Pro
    fontSize: 0.95rem
    fontWeight: '500'
    lineHeight: '1.4'
  button:
    fontFamily: Be Vietnam Pro
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: '1'
  button-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 0.92rem
    fontWeight: '600'
    lineHeight: '1'
  label:
    fontFamily: Lexend Exa
    fontSize: 0.72rem
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.16em
  label-sm:
    fontFamily: Lexend Exa
    fontSize: 0.72rem
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.14em
  data:
    fontFamily: JetBrains Mono
    fontSize: 0.8rem
    fontWeight: '400'
    lineHeight: '1.5'
  data-lg:
    fontFamily: JetBrains Mono
    fontSize: 2rem
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
rounded:
  xs: 8px
  sm: 12px
  md: 14px
  lg: 24px
  xl: 28px
  browser: 20px
  device-tablet: 26px
  device-phone: 38px
  full: 9999px
spacing:
  container: 1240px
  gutter: 24px
  gutter-mobile: 16px
  header-height: 72px
  section: 112px
  section-mobile: 80px
  page-hero-top: 96px
  page-hero-bottom: 104px
  page-hero-mobile: 64px
  capture: 88px
  section-head-gap: 48px
  grid-gap: 18px
  card-padding: 32px
  card-padding-sm: 26px
  button-height: 52px
  button-height-sm: 44px
  tap-target: 44px
  field-height: 50px
  anchor-offset: 88px
  anchor-offset-subnav: 144px
components:
  button-primary:
    background: 'linear-gradient({colors.amber-tint}, {colors.amber})'
    foreground: '{colors.navy}'
    radius: '{rounded.full}'
    height: '{spacing.button-height}'
    typography: '{typography.button}'
  button-navy:
    background: '{colors.navy}'
    background-hover: '{colors.navy-hover}'
    foreground: '{colors.white}'
    radius: '{rounded.full}'
    height: '{spacing.button-height}'
  button-glass:
    background: 'translucent current surface, 12px backdrop blur'
    border: '{colors.border}'
    foreground: '{colors.heading}'
    radius: '{rounded.full}'
  site-header:
    background: '{colors.page} at 90% opacity, 16px blur'
    border-bottom: '{colors.border}'
    height: '{spacing.header-height}'
  mega-menu:
    background: '{colors.paper}'
    border: '{colors.border}'
    radius: '{rounded.lg}'
    item-hover: '{colors.mist}'
  language-dropdown:
    typography: '{typography.ui}'
    height: '{spacing.tap-target}'
    radius: '{rounded.full}'
    foreground: '{colors.text}'
    hover-background: '{colors.mist}'
    list-background: '{colors.page} at 96% opacity'
    list-radius: '{rounded.lg}'
    current: 'bold {colors.navy}'
  product-badge-pxp:
    background: 'linear-gradient({colors.amber-light}, {colors.amber})'
    foreground: '{colors.navy}'
    radius: '{rounded.md}'
  product-badge-lxp:
    background: 'linear-gradient({colors.navy-soft}, {colors.navy})'
    foreground: '{colors.white}'
    radius: '{rounded.md}'
  product-badge-sxp:
    background: 'linear-gradient({colors.navy}, {colors.ink})'
    foreground: '{colors.amber-tint}'
    radius: '{rounded.md}'
  product-badge-iot:
    background: '{colors.mist}'
    foreground: '{colors.navy}'
    radius: '{rounded.md}'
  front-door-products:
    background: 'linear-gradient({colors.white}, {colors.door-tint})'
    foreground: '{colors.navy}'
    radius: '{rounded.xl}'
  front-door-services:
    background: 'linear-gradient({colors.ink}, {colors.navy}, {colors.navy-glow})'
    foreground: '{colors.on-navy-text}'
    radius: '{rounded.xl}'
  stats-band:
    number: '{typography.stat}'
    suffix-on-light: '{colors.amber-text}'
    suffix-on-navy: '{colors.amber}'
  spotlight-card:
    background: 'translucent current surface, 14px backdrop blur'
    border: '{colors.border}'
    radius: '{rounded.lg}'
    glow: '{colors.amber} at 16% under the pointer'
  service-card:
    radius: '{rounded.lg}'
    padding: '{spacing.card-padding-sm}'
    title: '{typography.title-sm}'
    icon-tile: '{rounded.md}'
  process-flow:
    step-radius: '{rounded.lg}'
    number: '{typography.data}'
    number-on-light: '{colors.amber-text}'
    number-on-navy: '{colors.amber-tint}'
    track-fill: 'linear-gradient({colors.amber-tint}, {colors.amber})'
  industry-chip:
    radius: '{rounded.full}'
    primary-on-light: '{colors.navy}'
    primary-on-navy: '{colors.amber}'
    default-on-light: '{colors.navy} text, {colors.border} border, glass fill'
    default-on-navy: '{colors.on-navy-text} text, {colors.on-navy-border} border'
  value-grid:
    border: '{colors.border}'
    featured-background: 'linear-gradient({colors.amber-light}, {colors.amber}, {colors.amber-deep})'
    featured-foreground: '{colors.navy}'
  news-card:
    radius: '{rounded.lg}'
    title: '{typography.title-sm}'
    meta: '{typography.data}'
  category-tag:
    typography: '{typography.label-sm}'
    radius: '{rounded.full}'
    product-background: '{colors.amber}'
    product-foreground: '{colors.navy}'
    default-background: '{colors.mist}'
    default-foreground: '{colors.navy}'
  filter-chips:
    radius: '{rounded.full}'
    active-background: '{colors.navy}'
    active-foreground: '{colors.white}'
  email-capture:
    field-background: '{colors.paper}'
    row-border-on-amber: '1.5px {colors.navy}'
    error-on-amber: '{colors.error}'
    field-radius: '{rounded.full}'
    focus-on-light: '{colors.focus}'
    focus-on-navy: '{colors.focus-on-navy}'
  contact-form:
    background: '{colors.paper}'
    radius: '{rounded.xl}'
    field-radius: '{rounded.sm}'
    field-height: '{spacing.field-height}'
    field-border: '{colors.field-border}'
    tab-active-background: '{colors.navy}'
  device-frame:
    tablet-radius: '{rounded.device-tablet}'
    phone-radius: '{rounded.device-phone}'
    edge: 'linear-gradient({colors.amber-tint}, {colors.edge-blue}, {colors.navy})'
  media-frame:
    radius: '{rounded.md}'
    empty-background: '{colors.paper} with 24px navy grid at 5%'
  browser-frame:
    radius: '{rounded.browser}'
    bar-background: '{colors.mist}'
    url: '{typography.data}'
  product-subnav:
    background: '{colors.paper} at 88% opacity, 12px blur'
    active-background: '{colors.navy}'
    active-foreground: '{colors.white}'
  office-card:
    clock: '{typography.data-lg}'
    radius: '{rounded.lg}'
  site-footer:
    background: '{colors.ink}'
    foreground: '{colors.on-navy-muted}'
    heading: '{colors.amber-tint}'
  toast:
    background: '{colors.ink}'
    foreground: '{colors.white}'
    radius: '{rounded.sm}'
  placeholder-frame:
    border: '1.5px dashed {colors.heading} at 35%'
    radius: '{rounded.lg}'
    caption: '{typography.label-sm}'
  highlight-mark:
    fill-on-light: 'linear-gradient({colors.amber-tint}, {colors.amber})'
    fill-on-amber: '{colors.white}'
    fill-on-navy: 'linear-gradient({colors.amber-tint}, {colors.amber})'
  focus-ring:
    width: 2.5px
    offset: 3px
    color-on-light: '{colors.focus}'
    color-on-navy: '{colors.focus-on-navy}'
    color-on-amber: '{colors.focus}'
---

## Shipped Site (2026-10-15)

What the code in `src/` ships today. Where an older section below disagrees, this section wins; the sections below keep the original design reasoning.

- **Brand spelling:** "XionTech" in every visible string, title and alt text, never "XionTech". The domain `xiontechs.com` and its email addresses stay as they are.
- **Positioning:** an AI-driven product and engineering company for any industry. Copy does not list industries. The Home headline stays "Build smarter. Ship faster. Get IT done."
- **Evidence:** no invented stats, testimonials or client logos. Unverified text starts with `[Placeholder]`.
- **Locations:** four. Two delivery centers, Plano, Texas (US Delivery Center) and Ho Chi Minh City (Vietnam Delivery Center), with address, phone and email in the footer and on About; two offices, Ha Noi and Da Nang, named only, as one white line under the footer offices. Contact emails: Plano `vinni.tran@newxion.com`, Ho Chi Minh City `vinni.tran@xiontechs.com` (`src/content/offices.ts`).
- **Primary buttons:** every primary call to action (`.btn-primary`, the amber gradient pill) links to the Home get-in-touch form, `/{locale}#contact` (`CONTACT_HREF` in `src/components/layout/nav-data.ts`), with a label that fits its page, for example "Get in touch" (Home hero), "Let's build together" (Services), "Let's talk about your project" (About). The header has one amber primary "Let's talk" beside the nav, and the mobile menu repeats it under the links. Form submit buttons and the job page's apply bar are the only primaries that do something else. The Careers hero has no buttons; it ends on the prompt line "Ready to build with us?" (`.ch-prompt`: brand font, 500, heading colour, a 32 x 2px amber rule before it).
- **No Demo page:** `/demo` and `/{locale}/demo` redirect to `/#contact` (`next.config.ts`). There are no "Book a demo" buttons.
- **Copy style:** section titles have no trailing full stop; US spelling.
- **Section spacing:** the shared `.sec` padding follows the screen height: `clamp(48px, 7.5svh, 96px)` above 1024px, `clamp(40px, 5svh, 80px)` at 1024px and below, `clamp(40px, 5svh, 64px)` at 640px and below. The `--spacing-section` tokens stay 64px / 48px. Page heroes add `--spacing-header-room` (header height + 24px) on top, because the header pill floats over the first section.
- **One section, one screen:** on desktop and tablet a section should fit one viewport. The Careers hero is `100svh` tall above 640px (content centred, the floating header over its top padding) and takes its natural height on phones.
- **Components in use** (styles in `src/app/globals.css`):
  - *What drives us* value flip cards (`ValueFlipCard`, `.flip-card`): the front shows number, label, icon or line drawing and title; the back shows the line. Home uses the icon variant, About the line-drawing variant.
  - *4-D process* (`ProcessFlow`): four steps on an amber track that fills over 2.4s; Home navy band and Services `#process`; 2 columns at 1080px and below, 1 column at 640px and below.
  - *Three-layer stack* (`ThreeLayerStack`, `.tls-*`): the Services hero illustration, three isometric plates with callouts; a CSS opening that plays once per page load.
  - *Mountain story card* (`MountainStory`, `.mtn-*`): About "Inspired by a mountain"; the climb plays once when the story is 40% in view.
  - *Meet the team at XionTech strip* (`.life-*`, `#meet-the-team`): copy and interest tags beside one vertical photo strip that loops upward over 44s and pauses on hover or focus; reduced motion stands it still. Photos have no caption. Team photos: every image file in `public/careers/life/` (any filename; `.webp`, `.jpg`, `.jpeg`, `.png` or `.avif`; sorted by filename) shows in the strip with the generic localized alt "XionTech team moment" and no caption. The page reads the folder when it is built, so rebuild and redeploy after adding photos (in `npm run dev` a refresh is enough). An empty folder shows plain tinted tiles. HEIC files are skipped (browsers cannot show them); export them as JPEG or WebP first.
  - *Mobile menu sheet* (`.mm-sheet`): drops from the header pill at 1080px and below, 28px bottom radius; links, then the "Let's talk" button and both delivery centers' phones. The header "Let's talk" fades out while the sheet is open.
- **Motion:** see `EXPERIENCE.md` › Shipped Site.
- **Locales:** two (en, vi). Every string has both.

## Brand & Style

XionTech sells two things from one team: four school products (PXP, LXP, SXP, IoT Device Management) and software outsourcing. The site has to feel futuristic, modern and professional, and it has to look unique to XionTech rather than like a template. It must never look AI-generated.

The identity comes straight from the logo: a navy X mark, an amber swoosh and the tagline GET IT DONE. Navy is trust, amber is energy, and white is a full partner in the palette, not just empty space. Surfaces use soft gradients, an aurora glow, a faint woven linen texture and a flowing strand ribbon behind heroes. Flat solid blocks are avoided.

Products lead. The first five seconds of Home show what the products do (device mockups with real product screens) and put both business lines, Products for schools and Outsourcing services, directly under the hero.

There is no dark mode. Instead each page follows a colour rhythm of paper and mist with at least one navy band (a navy hero counts) and at most one full-width amber band (an amber hero counts). Amber tiles, cards and the featured value cell are accents and do not count. Each page hero uses a different mix (light, navy or amber).

Brand inputs: `imports/xiontechs-logo.png`, `imports/xiontechs-logo-square.png` (PNG only; an SVG master is still needed) and `imports/ref-hero-device-mockup.png` (the reference for the tablet + phone hero).

**Build mapping.** The build is Next.js 16 + Tailwind CSS v4 + shadcn/ui (planned) + Motion. Every token here maps 1:1 into Tailwind `@theme`: `colors.*` to `--color-*`, font families to `--font-display`, `--font-brand`, `--font-body`, `--font-mono`, `typography.*` to `--text-*`, `rounded.*` to `--radius-*`, `spacing.*` to `--spacing-*` except `spacing.container`, which maps to `--container-page`. Breakpoints, layers, motion and shadows are in the Build tokens table under Layout & Spacing. shadcn variables map as `--primary` = `{colors.amber}`, `--primary-foreground` = `{colors.navy}`, `--background` = `{colors.page}`, `--foreground` = `{colors.text}`, `--muted-foreground` = `{colors.muted}`, `--border` = `{colors.border}`, `--ring` = `{colors.focus}` (overridden to `{colors.focus-on-navy}` inside navy sections), `--destructive` = `{colors.error}`.

Reference mockups: [`prototype-enhancement/prototype/index.html`](../../../prototype-enhancement/prototype/index.html) and its sibling pages show every token in use. These spines win on any conflict with the mockups.

## Colors

- **Navy (`#163663`)** is the brand ink: headings, primary text links, the navy button, active nav and tab states, badges, and the focus ring on light and amber surfaces. Navy on paper is 11.86:1.
- **Ink (`#0B1730`)** is the deepest navy. It starts the navy band gradient and fills the footer, the toast and phone bezels.
- **Navy 2, Navy glow, Navy soft (`#244C85`, `#1E4178`, `#3F66A0`)** only appear inside gradients (navy band end, LXP badge).
- **Amber (`#FFC000`) and Amber tint (`#FFCF06`)** are energy: the primary button fill, the highlight mark under a key word, stat suffixes on navy, the 4-D progress track, the PXP badge, product category tags, and text or icons on navy (7.34:1 and 8.14:1). Amber is a fill, never a text colour on light surfaces. Amber always carries navy text: navy on amber is 7.34:1, white on amber is 1.64:1 and is banned.
- **Amber light, pale, deep (`#FFD84A`, `#FFE27A`, `#F0B300`)** build the amber band, amber hero and featured tile gradients.
- **Amber decor (`#C99700`)** is decorative only (2.61:1 on paper). Never use it for text or icons.
- **Amber text (`#8A6700`)** is the only amber allowed for text or icons on paper, page or mist (5.14:1 on paper, 4.65:1 on mist). It replaces `#C99700` in stat suffixes, 4-D step numbers and check-list icons on light surfaces.
- **Paper, page, mist, ice (`#FDFDFE`, `#F7F9FD`, `#EEF2F9`, `#DCE6F5`)** are the light surfaces. Paper for content sections and cards, page for the body and header glass, mist for alternating sections, hover fills and inactive chips.
- **Text (`#10223F`) and Muted (`#4A5B78`)** are body and secondary text on light surfaces (15.62:1 and 6.75:1 on paper, 6.11:1 on mist). Placeholder text uses `#5B6B86` (5.31:1).
- **On-navy text set** (`#FFFFFF` headings, `#EEF2F9` text, `#C5D0E3` muted, `#FFCF06` links and labels) is used inside every navy surface. Muted on navy is 7.75:1.
- **On-amber text set** (`#163663` text and headings, `#23406B` muted at 6.34:1 on amber).
- **Error (`#8A1C14`, 9.15:1 on paper)** for error text, `#B3261E` for the invalid field border, `#FFB4AB` for error text on navy (7.10:1).
- **Borders** are navy at 12% (`#1636631F`) on light and white at 14% (`#FFFFFF24`) on navy. Field and control borders use `#75869F` (3.65:1 on paper, 3.30:1 on mist) to meet WCAG 1.4.11. The white email row on an amber band gets a 1.5px navy border (7.34:1; white on amber alone is 1.64:1). Error text on amber uses `{colors.error}` (5.67:1).

Section surfaces are scoped token sets, so components adapt to the section they sit in:

| Surface | Background | Heading / text / muted | Link | Focus |
|---|---|---|---|---|
| `surface-paper` | `{colors.paper}` | navy / text / muted | navy | `{colors.focus}` |
| `surface-mist` | gradient `{colors.mist}` to `{colors.mist-end}` | navy / text / muted | navy | `{colors.focus}` |
| `surface-navy` | gradient `{colors.ink}` to `{colors.navy}` to `{colors.navy-glow}`, with an amber glow at 16% in the top right | on-navy set | `{colors.on-navy-link}` | `{colors.focus-on-navy}` |
| `surface-amber` | gradient `{colors.amber-light}` to `{colors.amber}` to `{colors.amber-deep}` | on-amber set | navy | `{colors.focus}` |
| `hero-silk` | `{colors.ink}` with an animated WebGL silk cloth (deep navy folds lit to `{colors.navy-glow}`, `{colors.amber-tint}` sheen, thin `{colors.amber}` threads along the folds), masked so the text side stays ink; static navy-glow and amber radial glows as the fallback. Dark: the Home hero is dark and the sections after it are light, apart from the navy 4-D band and the amber capture band | on-navy set | `{colors.on-navy-link}` | `{colors.focus-on-navy}` |
| `hero-light` | `{colors.page}` with aurora (amber 42%, navy 28%, pale blue) | as paper | navy | `{colors.focus}` |
| `hero-navy` | gradient `{colors.ink}` to `{colors.navy}` to `{colors.navy-glow}` with aurora | on-navy set | `{colors.on-navy-link}` | `{colors.focus-on-navy}` |
| `hero-amber` | gradient `{colors.amber-pale}` to `{colors.amber}` to `{colors.amber-deep}` with a white glow | on-amber set | navy | `{colors.focus}` |

Contrast target: WCAG 2.2 AA everywhere. 4.5:1 for text, 3:1 for large text, icons, focus indicators and the boundaries of form fields and controls. Every pair above is measured. On navy gradients the figures hold at the lightest stop `#1E4178` (muted 6.49:1, amber 6.14:1).

## Typography

Four typefaces, one job each. All four load with the `vietnamese` subset from Google Fonts (in the build, through `next/font` with `subsets: ['latin', 'vietnamese']`).

- **Unbounded (500 to 700): display.** Hero and section headlines, card titles, stat numbers. Wide geometric caps echo the logo. Never for paragraphs, never all caps for long headings.
- **Lexend Exa (400 to 600): brand caps.** Category tags, "for" lines in the mega menu, footer column headings and the GET IT DONE tag. (The language dropdown uses the body face, like the nav links.) Always uppercase with open tracking (0.12 to 0.2em). Never for paragraphs.
- **Be Vietnam Pro (400 to 700): body and UI.** Paragraphs, nav, buttons, forms, lists.
- **JetBrains Mono (400 to 500): data.** News dates, breadcrumbs, 4-D step numbers, office clocks, browser-frame URLs, screenshot size hints. Small doses only.

| Role | Token | Use |
|---|---|---|
| Home hero H1 | `{typography.display-hero}`, fluid down to `{typography.display-hero-mobile}` (clamp 2.2rem, 4vw, 3.5rem) | One per page |
| Page hero H1 | same family and weight, clamp 2.2rem, 4.4vw, 3.6rem, max 18ch | Inner pages |
| Section H2 | `{typography.headline}`, fluid down to `{typography.headline-mobile}` | Section heads, capture bands |
| Stat number | `{typography.stat}` (clamp 2rem, 3.6vw, 3rem) | Stats band |
| Why tile title | `{typography.title-md}`, the large tile up to 1.6rem | Home Why XionTech |
| Step, value, office title | `{typography.title-md}` | 4-D steps, values, office cards |
| Card title | `{typography.title-sm}` | Service cards, mega menu items, news cards (1.08rem) |
| Lede | `{typography.body-lg}`, max 60ch | Under H1 and H2 |
| Body | `{typography.body}` | Paragraphs |
| Small body | `{typography.body-sm}` | Card copy, footer links, helper text |
| Nav item | `{typography.ui}` | Header menu |
| Label | `{typography.label}` with a 22px amber rule before it | Door names and the stats heading only; never above a section heading |
| Tag | `{typography.label-sm}` | Category tags, badges' "for" line |
| Data | `{typography.data}` | Dates, crumbs, step numbers |
| Clock | `{typography.data-lg}` | Office cards |

**Vietnamese.** When the page language is `vi`, H1 and H2 get line-height 1.2 through a language rule (`:lang(vi) h1, :lang(vi) h2 { line-height: 1.2 }`; the floor is 1.18) so stacked diacritics do not collide. Never tighten tracking on Vietnamese uppercase. The brand name is always the logo file, never typeset.

## Layout & Spacing

- **Container:** `{spacing.container}` max width, `{spacing.gutter}` side padding, `{spacing.gutter-mobile}` below 640px.
- **Sections:** `{spacing.section}` vertical padding (`{spacing.section-mobile}` below 640px). Email capture bands use `{spacing.capture}`. Page heroes use `{spacing.page-hero-top}` / `{spacing.page-hero-bottom}` (`{spacing.page-hero-mobile}` below 640px). Section heads sit `{spacing.section-head-gap}` above their content, max 760px wide.
- **Grids:** 12-column grid for the Why XionTech tiles, a 4-column app row, 4-column service grid, 3-column news and values grids, 5-column stats, 2-column split for text + media. Gaps 14 to 20px, default `{spacing.grid-gap}`.
- **Home hero:** fills the viewport under the header (`100dvh` minus `{spacing.header-height}`), text column 0.92fr, devices 1.08fr. The two front doors overlap the hero bottom by 104px (80px below 900px).
- **Forms:** the contact form card sits in the right half of the split hero on desktop and stacks full width below 900px. Email capture rows sit in a 2-column band (copy left, form right).
- **Anchors:** every in-page target sets `scroll-margin-top` to `{spacing.anchor-offset}` (sticky header plus breathing room) or `{spacing.anchor-offset-subnav}` on the Products page, where the sticky product sub-nav sits under the header. Confirm both values against the built header heights.

**Page colour rhythm:** at least one navy band (a navy hero counts) and at most one full-width amber band (an amber hero counts). Amber tiles, cards and the featured value cell are accents and do not count.

| Page | Hero | Sections in order |
|---|---|---|
| Home | `hero-silk` (dark, with the stats inside) | front doors, why XionTech (paper, with a navy tile and an amber strip), four-app row (mist, linen), 4-D process (navy), news (mist), capture (amber) |
| Products | `hero-amber` | sub-nav, PXP (paper), LXP (mist, linen), SXP (navy), IoT (paper), product updates (mist), capture (navy) |
| Services | `hero-navy` | stats (paper), 8 services (mist, linen), ways to work (paper), 4-D process (navy), industries (mist), capture (amber) |
| News | `hero-light` | filters + story grid (paper), demo capture (amber) |
| About | `hero-navy` | stats (paper), story (mist, linen), values (paper), FAQ (paper), offices (navy), capture (amber) |
| Careers | `hero-light`, one screen tall above 640px; the stacked-cards picture takes a bit over half the hero (about 680px wide at 1440) | Principles we value, Meet the team at XionTech, open roles |
| Job page | `hero-amber` | role details and application form card (paper) |

**Build tokens** (outside the frontmatter schema; add them to `@theme` as listed):

| Group | Tokens |
|---|---|
| Breakpoints | `--breakpoint-sm: 640px`, `--breakpoint-md: 900px`, `--breakpoint-lg: 1080px` (what changes at each is in `EXPERIENCE.md` Responsive & Platform) |
| Layers (z-index) | background art -1, content 0, sticky sub-nav 40, header 50, mega menu 55, mobile menu 60, toast 100, skip link 200 |
| Motion | `--ease-brand: cubic-bezier(.16, 1, .3, 1)`; durations 300ms (menus), 550ms (screen crossfade), 900ms (reveal), 1200ms (highlight), 1400ms (count-up), 2400ms (4-D track). Reduced motion: no movement; state changes keep short opacity fades (150 to 250ms) |
| Type scale | `--fs-label` .72rem (the smallest functional size, about 11.5px), `--fs-caption` .8rem, `--fs-small` .92rem, `--fs-ui` .95rem, `--fs-body` 1rem, `--fs-lead` 1.12rem, `--fs-title-sm` 1rem, `--fs-card` 1.08rem, `--fs-title-md` 1.2rem, `--fs-title-lg` 1.7rem |
| Tap targets | Every control (buttons, tabs, chips that act, filters, the sub-nav, checkboxes, the language dropdown and its options, the menu and pause buttons) is at least `{spacing.tap-target}` (44px); inline text links in paragraphs, breadcrumbs, the footer lists and browser-frame addresses meet the WCAG 2.2 minimum of 24 x 24px |
| Prototype CSS | `prototype-enhancement/prototype/css/site.css` is one consolidated file; every colour, radius, size and space is a token in `:root` that mirrors this file, and pages use shared classes, not inline styles (the only exception is the `--d` stagger delay on each 4-D step) |
| Shadows | `--shadow-card: 0 40px 80px -40px rgb(11 23 48 / .45)`, `--shadow-device: 0 60px 100px -40px rgb(11 23 48 / .55)`, `--shadow-primary: 0 12px 30px -12px rgb(255 192 0 / .7)` |
| Fluid sizes | Home H1 `clamp(2.2rem, 4vw, 3.5rem)`, page H1 `clamp(2.2rem, 4.4vw, 3.6rem)`, H2 `clamp(1.9rem, 3.5vw, 2.8rem)`, stat `clamp(2rem, 3.6vw, 3rem)`, news card title 1.08rem |

## Elevation & Depth

Depth is soft and navy-tinted, never grey.

- **Cards and doors:** large diffused shadow, navy ink at 45 to 55% with a negative spread (for example `0 40px 80px -40px`). On hover, cards lift 4px and gain a shadow.
- **Devices:** the heaviest shadows (`0 60px 100px -40px` ink at 55%), plus a 1.5px gradient edge from amber tint through pale blue to navy.
- **Primary button:** amber glow shadow and a 1px white inner highlight.
- **Glass:** header, sub-nav, glass buttons and spotlight cards use translucent surfaces with 12 to 16px backdrop blur.
- **Spotlight glow:** an amber radial glow at 16% follows the pointer inside cards on hover.
- **Backgrounds:** aurora blobs (blurred radial gradients), a 56px navy grid at 5% masked to one corner on navy bands (`gridbg`), a woven linen texture at very low opacity on some mist sections, and the strand ribbon canvas in heroes (navy strands with every ninth strand in amber).

## Shapes

- Buttons, chips, the language dropdown trigger, tags, filter chips and the email field are pills (`{rounded.full}`).
- Cards, tiles, news cards, 4-D steps and office cards use `{rounded.lg}` (24px). Front doors and the contact form card use `{rounded.xl}` (28px).
- Form fields use `{rounded.sm}` (12px). Badges, icon tiles and screenshot frames use `{rounded.md}` (14px).
- Device frames follow real hardware: tablet `{rounded.device-tablet}`, phone `{rounded.device-phone}`.
- The focus outline and the skip link use `{rounded.xs}`.
- Circles only for the 4-D flow nodes, the "go" arrow buttons and the travelling amber dot.

## Components

Visual specs. Behaviour lives in `EXPERIENCE.md` Component Patterns under the same names. shadcn/ui primitives to build on are named in brackets.

- **Button** [Button]. Three variants, all pills, `{spacing.button-height}` (small `{spacing.button-height-sm}`): `button-primary` amber gradient with navy text, used for the main action on light, navy and paper surfaces; `button-navy` navy with white text, used as the main action on amber surfaces; `button-glass` translucent with a border, for secondary actions. Press state: 1px down, scale 0.98. Hover: lift 2px.
- **Site header** [NavigationMenu]. Sticky glass bar, `{spacing.header-height}` tall: logo on the left and the menu on the right (Products, Services, News, About, Careers), with the language dropdown as the last item. Below 1080px the menu moves behind the menu button and the language dropdown stays in the bar. One amber primary "Let's talk" to `/{locale}#contact` sits before the language dropdown (Shipped Site). Menu items are text only: the Products trigger has no caret icon and shares the plain links' 44px height so they align. Services is a plain link. The language dropdown is the only control with a caret.
- **Mobile menu** [Sheet or inline panel]. Below 1080px, a paper panel under the header, full width, scrolls within the viewport; mega content becomes a single column without shadow. Menu button is a 44px-high pill with the text "Menu" (no icon) and a navy border at 14%.
- **Mega menu** [NavigationMenu content]. Paper panel, 24px radius, up to 660px wide, 2 columns. Text only, with no badges, icons or arrows. Products mega: app name + one-line value + "for" line in `{typography.label-sm}`, footer row "More products are on the way." + "All products". Only Products has a mega menu; Services is a plain link (decided 2026-10-01).
- **Language dropdown** [Popover disclosure, not a menu role]. The last item in the header, styled like the nav links: Be Vietnam Pro 500 at `{typography.ui}`, ink text, no border, mist fill on hover and while open, 44px tall, with a caret that flips up when open. The options (EN, VI) open in a small list on the header glass (page at 96%, hairline border, `{rounded.lg}`), in the same text style; the current one is bold navy.
- **Product badge.** 44px rounded square, app initials in Unbounded 700. PXP amber, LXP navy-soft to navy, SXP navy to ink with amber-tint text, IoT mist with a chip icon. On a section whose fill matches the badge (the navy SXP section on Products), the badge swaps for contrast. The app name always sits next to the badge; where it does, the badge is `aria-hidden`.
- **Front door.** Two large linked panels under the Home hero. Products door: white to pale blue gradient, four badges, four audience chips. Services door: navy surface, amber label, service chips ("+3 more").
- **Stats band.** Five columns separated by 1px borders. On Home it sits at the bottom of the dark hero under the label "Experience you can count on". Number in `{typography.stat}`; the suffix (+, /7) uses `{colors.amber-text}` on light and `{colors.amber}` on navy. Muted caption under each, max 22ch. The figures are confirmed by the business (2026-09-28); an italic `[Placeholder]` note is added under the band only if a figure is ever unverified.
- **Spotlight card.** Base for service cards (Services), news cards and office cards: glass fill, border, 24px radius, pointer-following amber glow.
- **Why XionTech grid.** Four tiles on a 12-column grid: a large paper tile (7 columns, 2 rows) with a 16:10 team photo slot and text below; a navy tile (5 columns) with a globe icon and the live local times in mono; a mist tile (5 columns); a full-width amber strip with "Get IT Done" in Unbounded and a link to the core values. Tiles use `{rounded.lg}`; they stack to one column below 900px.
- **Four-app row.** One row of four items divided by hairlines: badge, app name in Unbounded, audience in caption size and one line below; each item is one link. Two columns at 1080px, one at 640px. Replaces the earlier Home bento.
- **Service card.** 48px icon tile, title in `{typography.title-sm}`, one line of copy, optional mono tags row. Variants: `feature` (amber wash at 22%), `navy` (navy fill, amber icon).
- **Process flow (4-D).** Six items in a row: "Your request" node, four step cards (01 Discovery, 02 Design, 03 Development, 04 Deployment) and an amber "Launch" node, joined by a dashed track that fills with amber. Each step card: illustrated header (navy icon tile with three floating orbs), mono step number, title, one line, then a dashed divider and a "You receive" row. The "You receive" rows align across all four cards.
- **Industry chip.** Pill with icon. EdTech is the primary chip: navy fill on light, amber fill on navy.
- **Value grid.** 3 x 2 grid with hairline borders; "Get IT Done" Attitude is the featured amber cell.
- **News card.** 16:10 photo frame on top, then mono date + category tag, title, one-line excerpt, "Read story" link. The first card on the News page is a wide 2-column feature.
- **Category tag.** Tiny Lexend Exa pill; product stories use amber with navy text and append the app name (for example "Product · PXP"); other categories (Schools, Team, Company) use mist with navy text.
- **Filter chips** [ToggleGroup]. Pills; active is navy with white text.
- **Email capture.** Band with H2 + lede on the left and the form on the right: label, a white pill row holding the email field and the band's button (1.5px navy border on amber bands), error line, consent line with a privacy policy link. Success replaces the row with a status panel.
- **Contact form.** Paper card, 28px radius, large shadow. Two pill tabs (Product demo / Outsourcing project) [Tabs], 2-column field grid [Input, Select, Checkbox], checkbox pills for products, full-width message, primary submit. Invalid field: `{colors.error-border}` border and error text below.
- **Device frame.** Tablet (4:3) and phone (1170:2532) frames with a light metallic gradient bezel, gradient edge and a notch on phones. Used in heroes and the PXP story.
- **Media frame.** The screen or photo area inside a device, browser or card. Empty state is a faint navy grid on paper. In production it holds real screenshots, short clips or photos.
- **Browser frame.** Window chrome for web apps: mist bar with three dots and a mono URL pill, 16:10 media frame.
- **PXP story phone + phone tabs** [Tabs]. A 260px phone holding five stacked screens (Attendance, Grades, Messages, Payments, Events) with pill tabs below; active tab navy.
- **Product sub-nav.** Sticky glass bar under the header on Products, pill links for PXP, LXP, SXP, IoT, Updates; the current section is navy.
- **Office card.** Spotlight card with a large mono local-time clock, city title, address and phone link.
- **Clock strip.** Pills showing each office city with its local time in mono.
- **Breadcrumbs.** Mono, muted, above inner page H1s.
- **Highlight mark.** An amber bar behind the lower third of one key phrase per hero headline: amber on light and navy heroes, white on amber surfaces.
- **Placeholder frame.** Dashed border panel with a Lexend Exa caption, standing in for real photos and illustrations until they exist.
- **Role card.** Glass card, full-width stretched link: job title in the display face, then team, location and work type in muted text; "View and apply" link-arrow on the right (stacks under the title at 640px and below). Lifts 2px on hover.
- **Open roles panel.** Dashed panel stating there are no open roles.
- **File field.** Same field chrome as other inputs, auto height; error border `{colors.error}`.
- **Site footer.** Ink background, white logo plate, blurb, four link columns with amber-tint Lexend Exa headings, office addresses, a bottom bar with copyright, privacy policy link and the GET IT **DONE** tag (DONE in amber).
- **Toast** [Sonner]. Small ink pill at the bottom centre.
- **Motion toggle.** Discreet round icon button (44px, ink at 50%, white border at 30%, 70% opacity at rest) with a pause or play icon at the top right of the Home hero. Its text label fades in beside it on hover or keyboard focus (opacity and transform only, no width animation).
- **FAQ.** Stacked question cards (paper, `{rounded.md}`, hairline border) with the question in `{typography.title-sm}` and a round plus / minus marker; the open card gains a soft shadow. Max width 880px.
- **Skip link.** Hidden until focused; then an amber pill with navy text at the top left.
- **Focus ring.** 2.5px outline, 3px offset, 8px radius. Navy on light and amber surfaces, amber (`{colors.focus-on-navy}`) on navy surfaces. The email capture row shows a 3px ring in the same scoped colour.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Keep the palette to navy, amber, white and their tints | Add a new hue, or a flat solid block with no gradient or texture |
| Put navy text on amber | Put white text on amber (1.64:1) |
| Use `{colors.amber-text}` or darker for amber text and icons on light surfaces | Use `#C99700` for text or icons; it is decorative only |
| Scope the focus ring to the section: amber on navy, navy elsewhere | Show a navy ring on a navy section |
| Use at least one navy band and at most one full-width amber band per page | Stack two amber bands, or add a dark mode toggle |
| Use Unbounded for headlines, Lexend Exa for caps, Be Vietnam Pro for text, JetBrains Mono for data | Use Michroma, Orbitron or Sora (no Vietnamese), or two display faces in one component (Lexend Exa and JetBrains Mono are small accents and may sit beside the body and display faces) |
| Give Vietnamese H1 and H2 line-height 1.18 or more | Tighten tracking on Vietnamese uppercase |
| Use real product screens, clips and team photos | Use AI-generated art or stock that looks generated; use a hand-crafted illustrator brief |
| Mark unverified content `[Placeholder]` until verified | Ship sample names, numbers or stories as if real |
| Highlight one phrase per hero headline | Highlight several phrases, or set whole headings in amber |
| Let the heading carry the section; fold any label words into it | Put a small caps label above a section heading |
| Keep functional text at `--fs-label` (11.5px) or larger | Set tags, captions or badges below 11.5px |
