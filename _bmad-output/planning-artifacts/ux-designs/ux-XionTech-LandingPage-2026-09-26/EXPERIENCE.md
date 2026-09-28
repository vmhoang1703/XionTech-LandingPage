---
name: XionTech Website
status: final
updated: 2026-09-28
sources:
  - .memlog.md
  - README.md
  - code-review-2026-09-28.md
---

# XionTech Website: Experience Spine

## Foundation

- **Form factor:** a public, multi-page, responsive marketing website. One surface (the browser) from phone to desktop. No app shell, no sign-in.
- **Build:** Next.js 16 (App Router) + Tailwind CSS v4 + shadcn/ui (planned) + Motion for animation. `DESIGN.md` is the visual identity reference and maps its tokens to Tailwind `@theme`; this spine is the behaviour. Where shadcn/ui is used, this spine states only the behavioural delta.
- **Two audiences, two front doors:** Products (priority; school and university buyers who explore products and book a demo) and Outsourcing services (companies looking for a delivery partner). Home serves both near the top.
- **Languages:** English by default, Vietnamese via the EN/VI switch. Served as `/en/` and `/vi/` URLs with `hreflang`.
- **No dark mode.** The section colour rhythm in `DESIGN.md` replaces it.
- **Stakes:** a real public company website. Forms collect personal data (Vietnam PDPD, Decree 13/2023, applies). Accessibility floor is WCAG 2.2 AA.
- **Content rule:** anything not verified by the business is marked `[Placeholder]` and must not launch unmarked (see Voice and Tone).
- **Rendering:** header, footer and news are rendered on the server for SEO. Each page has its own title, meta description, canonical, Open Graph tags and favicon (Next.js Metadata API). Organization and app JSON-LD on Home.
- **Performance:** icon sets and third-party scripts never block rendering (use a React icon package or defer the script) (AC-PERF-1).

Reference mockups: [`mockups/site-v3/index.html`](mockups/site-v3/index.html), [`products.html`](mockups/site-v3/products.html), [`services.html`](mockups/site-v3/services.html), [`news.html`](mockups/site-v3/news.html), [`about.html`](mockups/site-v3/about.html), [`careers.html`](mockups/site-v3/careers.html), [`demo.html`](mockups/site-v3/demo.html). They are a design reference, not production code: rebuild in Next.js, do not copy the HTML. **These spines win on any conflict with the mockups.** Prototype-only tooling (screenshot slots that accept click, drop or paste and save in the browser) is not part of the product.

## Information Architecture

| Page | URL | Purpose | Sections in order |
|---|---|---|---|
| Home | `/` | Show what the products do in the first 5 seconds; open both front doors | Hero (headline, 2 CTAs, tablet + phone devices), two front doors (Products for schools, Outsourcing services), stats, four-app bento, eight services, 4-D process, latest news (3), demo capture |
| Products | `/products` | Let school buyers explore every app and book a demo | Hero (devices, Book a demo, Product updates), sticky sub-nav, `#pxp` (story phone with 5 tabs, features, store links), `#lxp`, `#sxp`, `#iot`, `#updates` (3 product stories), demo capture |
| Services | `/services` | Let companies judge the delivery team and start a project | Hero (Start a project, See our 4-D process, office clocks), stats, 8 services (each with an anchor), three ways to work with us, `#process` (4-D), industries + time zones, project capture |
| News | `/news` | Dated short stories about products, schools, team and company | Hero, category filters + story grid, subscribe capture |
| About | `/about` | Who XionTechs is | Hero, stats, story, `#values` (6 core values), leadership, offices, capture |
| Careers | `/careers` | Attract engineers, testers and designers | Hero (Join our talent network, Life at XionTechs), culture, benefits, open roles, `#talent` capture, `#life` photos |
| Book a demo (Contact) | `/demo` | One contact form for both intents | Hero with reassurance list and offices; form card with `#form` (Product demo tab) and `#project` (Outsourcing project tab) |

Service anchors: `#product-engineering`, `#ai-analytics`, `#co-creation`, `#staffing`, `#custom-apps`, `#low-code`, `#ai-solutions`, `#cloud`.

**Header navigation** (every page):

- **Products** mega menu, organised by app, not by audience: PXP (Parents), LXP (Students), SXP (Staff, Teachers, Leaders), IoT Device Management (School staff and facilities). Footer row: "More products are on the way." + "All products". New products are added as new rows with no restructuring.
- **Services** mega menu with all 8 services: Product Engineering, AI-Driven Analytics, Product Co-Creation, Staffing Service, Custom App Development, Low-code Solutions, AI-Powered Solutions, Cloud Computing. Footer row: the 4-D process line + "See the process" (`/services#process`).
- **News**, **About**, **Careers** as plain links.
- **Tools:** EN/VI switch and **Book a demo** button. Both are reachable at every width (see Responsive & Platform).
- Logo links home. A skip link ("Skip to content") comes first in tab order.

**Footer** (every page): logo + one-line blurb; **Products** (PXP, LXP, SXP, IoT Device Management, Product updates); **Services** (Product Engineering, AI-Driven Analytics, Staffing Service, Low-code Solutions, Cloud Computing, All services); **Company** (About, Core values, News, Careers, Contact); **Offices** (Ho Chi Minh City: Viettel Tower, Floor 12, 285 CMT8, HCMC 70064, +84 908 107 552; Dallas, USA: Texas, United States, +1 469 322 9899). Bottom bar: copyright, Privacy policy link, GET IT DONE tag.

**Needs to surfaces:**

| Stated need | Surface | Flow |
|---|---|---|
| School buyer explores products | Home bento, Products mega, `/products` | Flow 1 |
| School buyer books a demo | Book a demo button, demo capture, `/demo#form` | Flow 1 |
| Company finds a delivery partner | Home services door, Services mega, `/services` | Flow 2 |
| Company starts a project | Start a project CTA, project capture, `/demo#project` | Flow 2 |
| Parent finds PXP | Products mega (PXP), `/products#pxp`, store links | Flow 3 |
| Product updates | `/products#updates`, News "Product" filter | Flow 1 |
| News with category filters | `/news` | Flow 4 |
| Company facts, values, offices | `/about`, footer | Flow 2 |
| Job seeker finds roles | `/careers`, `#talent` | Flow 4 |
| Email capture on every page | Capture band on every page except `/demo`, which is the form | Flows 1 to 4 |
| Read in Vietnamese | EN/VI switch in the header | Flows 1, 3 |

## Voice and Tone

Microcopy rules. Brand voice lives in `DESIGN.md` Brand & Style.

- Short, plain sentences. Headlines end with a full stop ("Four apps. One school day.").
- Speak to the reader as "you"; the company is "we".
- Say what the reader gets, not what we are ("A clear scope and delivery plan.").
- Product names stay in English in both languages (PXP, LXP, SXP, IoT). Service names stay in English in both languages.
- Follow the prototype's spelling (organisation, specialised).
- No exclamation marks except the contact form's "Thank you!". No emoji.
- Every visible string, page title, meta description, screen-reader label and toast has an EN and a VI version.

**`[Placeholder]` convention.** Any content not verified by the business (figures, product and service descriptions, feature lists, store links, app URLs, stories, people, photos, legal links) starts with `[Placeholder]` in both languages. It is a launch blocker: `grep -rn "\[Placeholder\]"` must return nothing before launch. Sample content is never presented as real.

**CTA labels: one label per intent.**

| Intent | Label (EN) | Label (VI) | Goes to |
|---|---|---|---|
| Product demo | Book a demo | Đặt lịch demo | `/demo#form` (Product demo tab) |
| Outsourcing project | Start a project | (VI to confirm) | `/demo#project` (Outsourcing project tab) |
| News by email | Subscribe | (VI to confirm) | Inline success |
| Talent network | Join | (VI to confirm) | Inline success |
| Send the contact form | Send request | (VI to confirm) | Form success state |

Secondary links keep their own labels ("Explore our services", "See our 4-D process", "Product updates", "Join our talent network", "Life at XionTechs", "Read story", "See all news", "All products", "See the process"). Never reuse "Book a demo" for a project intent or "Start a project" for a demo.

**Wording to reuse:**

| Situation | Wording |
|---|---|
| Invalid email | "Please enter a valid email address." |
| Missing name / organisation | "Please enter your name." / "Please enter your organisation." |
| Consent line under demo capture | "We only use your email to arrange your demo." |
| Consent line under project and contact forms | "We only use your details to respond to this request." |
| Subscribe success | "Thanks, you're subscribed." |
| Talent network success | "Thanks, you're on the list." |
| Contact form success | "Thank you!" + "We will be in touch soon." |
| No open roles | "No open roles right now." + route to the talent network |
| Role field help | "For example: Principal, Head of IT" |

## Component Patterns

Behavioural. Visual specs live in `DESIGN.md` Components under the same names.

| Component | Behavioural rules |
|---|---|
| Site header | Sticky at the top of every page. Marks the current page (`aria-current="page"`, or the current mega trigger). Below 1080px the menu collapses behind the menu button. |
| Mega menu | Desktop with hover: hover opens, moving away closes. Click toggles predictably and never closes a menu that hover just opened (AC-NAV-3). Escape closes and returns focus to the trigger. Opening one closes the other. A click outside closes. Trigger has `aria-expanded`. Mobile: the mega content expands inline inside the mobile menu. |
| Mobile menu | Menu button has `aria-controls` and `aria-expanded` (AC-NAV-4). Escape closes it and returns focus to the button. Contains all nav items, the EN/VI switch and Book a demo when the header has no room for them (AC-NAV-1, AC-NAV-2). |
| Language switch | Two toggle buttons with `aria-pressed`. Switching changes every string, the page `lang` attribute, title and meta without a full reload of state, then routes to the matching `/en/` or `/vi/` URL. The choice persists for the next visit. |
| Button | Links that look like buttons navigate; buttons submit or toggle. One primary button per group. |
| Product sub-nav | Sticky under the header on `/products`. Highlights the section in view. Links scroll to anchors that land with the heading fully visible (AC-NAV-5). Scrolls horizontally on narrow screens. |
| Front door | Whole panel is one link (Products door to `/products`, Services door to `/services`). Chips inside are text, not links. |
| Product tile | One link per tile to the matching Products anchor. Media inside (the mini phone) is not interactive; use a stretched-link pattern so there is no interactive element inside a link (AC-A11Y-4). |
| Service card | On Home, links to the service anchor on `/services`. On `/services`, it is the anchor target and is not a link. |
| Spotlight card | Pointer-following glow and 4px lift on hover only. Hover starts immediately once scroll reveal has finished (AC-UI-1). |
| Stats band | Numbers count up once when 60% visible (1.4s, ease out). "24/7" does not count. Screen readers get the final value only. Built as one shared component (the prototype copies it across pages). |
| Process flow (4-D) | When 30% visible, the track fills with amber (2.4s) and steps 01 to 04 fade in one after another; then an amber dot travels the track in a loop. Below 1080px the track and end nodes hide and steps stack. "You receive" rows align across cards (AC-UI-2). One shared component. |
| Product badge | Decorative label for an app; never the only way to tell apps apart (the app name is always next to it). |
| Industry chip | Static. |
| Value grid | Hover tints the cell. Static otherwise. |
| News card | "Read story" opens the story detail page. Category tag shows the app for product stories. |
| Category tag | Static text. Product stories append the app name. |
| Filter chips | Toggle buttons with `aria-pressed`; one active at a time; "All" resets. Filtering is instant, with no page reload. [ASSUMPTION] The result count is announced. |
| Email capture | Validates on submit. Invalid: inline error, `aria-invalid="true"`, error linked with `aria-describedby`, focus returns to the field; the error clears as the user types. Valid demo capture: goes to `/demo#form` with the email prefilled. Valid project capture: goes to `/demo#project`, Outsourcing project tab selected, scrolled to the form (AC-FORM-2). Valid subscribe or join: the row is replaced by the success message in a `role="status"` region. |
| Contact form | Two tabs: Product demo and Outsourcing project. The URL hash picks the tab (`#project` opens Outsourcing). Fields hidden by the other tab are not validated and cannot take focus. Required: full name, work email, school or company. Demo tab: products of interest (PXP checked by default), school size, preferred date (cannot be in the past, AC-FORM-1). Project tab: service (8 services + "Not sure yet"), start timing. Message is optional. Submit validates all visible required fields, marks each invalid one and moves focus to the first. Success replaces the form with the thank-you panel. |
| Device frame | Holds real product screens or short product clips. Tilts slightly with the pointer on hover-capable devices only. Frames float gently. |
| Media frame | Shows the real asset. If an asset is missing in production, the frame shows its empty grid, never a broken image. Where a CMS allows uploads, an upload or paste only changes the item the user selected, never a previously hovered one (AC-FORM-3). |
| Browser frame | Static chrome around a web app media frame. The URL pill shows the app's real address once confirmed. |
| PXP story phone + phone tabs | Five tabs (Attendance, Grades, Messages, Payments, Events). Selecting a tab crossfades the matching screen in. Inactive screens are hidden from focus and assistive tech (AC-A11Y-3). |
| Office card | Shows the office's live local time, updated every 30 seconds, plus address and a `tel:` link. |
| Clock strip | Live local time for Ho Chi Minh City and Dallas. |
| Breadcrumbs | Home link + current page name. Inner pages only. |
| Highlight mark | Draws in once when the headline appears. Decorative. |
| Placeholder frame | Stands in for real photos or illustrations until supplied. Never shipped at launch. |
| Person card | Photo, name and role. Leadership grid shows only once real people are confirmed. |
| Open roles panel | Shown when there are no open roles; routes to `#talent`. When roles exist, each role is listed instead. |
| Site footer | Same on every page. The privacy policy link must point at a real policy before launch. |
| Toast | Short status message, bottom centre, `role="status"`, gone after about 2.6s. |
| Skip link | First focusable element; jumps to `main`. |
| Focus ring | Shown on keyboard focus (`:focus-visible`) on every focusable element. Colour follows the section: `{colors.focus-on-navy}` on navy, `{colors.focus}` elsewhere. |

## State Patterns

| Surface | State | Treatment |
|---|---|---|
| All pages | No JavaScript | Every section is visible (reveal animations are an enhancement). [ASSUMPTION] Forms still submit through the server. |
| All pages | Fonts loading | Fonts use `display: swap` with system fallbacks; no invisible text. |
| All pages | Reduced motion | Final states shown with no animation (see Motion). |
| Header | Mega open / closed | See Component Patterns. |
| Office card, clock strip | Before time loads | Shows `--:--`, then the time. |
| Home, Products | Media missing | Empty media frame, no broken image. |
| Products `#pxp` | Tab switch | Only the active screen is visible and focusable. |
| Products `#updates`, Home news | No product stories | Hide the grid and keep the "See all news" link. |
| News | Filter with no matches | [ASSUMPTION] Empty message in the grid ("No stories in this category yet.") with an "All" reset. Depends on the CMS. |
| News | Story detail | Detail page per story. Depends on the CMS choice. |
| Careers | No open roles | Open roles panel + talent network route. |
| Careers | Roles open | List of roles replaces the panel. |
| Email capture | Idle / error / success / redirect | Error inline and announced; subscribe and join show success in place; demo and project redirect to `/demo` with the email prefilled. |
| Contact form | Idle, error, sending, success, send failure | [ASSUMPTION for sending and send failure; the prototype sends nothing] Error per field with focus on the first. While sending, the submit button is disabled and says it is sending. Success shows the thank-you panel. If sending fails, keep every entered value and show an error above the button with a way to retry. |
| Contact form | Arrived from a capture | Email prefilled; tab set by the hash. |
| Contact form | Date in the past | Blocked; the date picker starts at today. |

## Interaction Primitives

- Click or tap to act; Enter and Space on buttons; Escape closes the open mega menu or mobile menu.
- Hover opens mega menus only on hover-capable devices at desktop width; click always works.
- Pointer effects (card glow, device tilt) run only on hover-capable devices and never carry information.
- In-page anchors use smooth scroll and land below the sticky header and sub-nav (`scroll-margin-top` from `{spacing.anchor-offset}` and `{spacing.anchor-offset-subnav}`).
- No carousels, no autoplaying sound, no infinite scroll, no modal pop-ups for email capture. Captures are inline bands.

## Motion

Built with Motion. Easing everywhere is `cubic-bezier(.16, 1, .3, 1)`.

| Effect | Behaviour |
|---|---|
| Scroll reveal | Elements rise 26px and fade in over 0.9s when 12% visible, staggered 70ms in groups of four, once only. |
| Hero background | Aurora blobs drift over 22 to 24s; the strand ribbon canvas moves slowly and pauses when off screen. |
| Devices | Tablet and phone float up and down (10s and 8s loops); pointer tilt up to 8 degrees. |
| Highlight mark | Scales in from the left over 1.2s after a 0.5s delay. |
| Stats | Count up over 1.4s. |
| 4-D process | Track fills over 2.4s; steps enter at 0.3s, 0.85s, 1.4s and 1.95s; dot loops every 5s. |
| Story phone | Screens crossfade over 0.55s. |
| Mega menu | Fades and drops in over 0.3s. |

**Reduced motion** (`prefers-reduced-motion: reduce`): no animation or transition anywhere. Revealed content, the full 4-D track and all steps show immediately; stats show final numbers; the strand ribbon draws one still frame; device float and tilt are off; smooth scroll is off.

## Accessibility Floor

Behavioural. Visual contrast lives in `DESIGN.md` Colors. Every item below is an acceptance criterion for the build.

- WCAG 2.2 AA on every page, in both languages.
- **AC-A11Y-1:** All text meets 4.5:1 (3:1 for large text) and icons meet 3:1. Amber text or icons on light surfaces use `{colors.amber-text}`; `{colors.amber-decor}` is never used for text or icons.
- **AC-A11Y-2:** Every focusable element has a visible focus indicator on every section colour. On navy sections the ring is `{colors.focus-on-navy}`, including the email capture field; elsewhere it is `{colors.focus}`.
- **AC-A11Y-3:** Hidden content (inactive phone screens, closed tabs, closed menus, the inactive contact form tab) cannot receive keyboard focus.
- **AC-A11Y-4:** No interactive element is nested inside a link. Tiles with media use a separate link or a stretched link.
- **AC-A11Y-5:** Invalid fields get `aria-invalid="true"` and are linked to their error text with `aria-describedby`. Validation errors are announced.
- **AC-NAV-1:** The EN/VI switch is available at every screen width.
- **AC-NAV-2:** "Book a demo" is reachable at every width.
- **AC-NAV-3:** On desktop, a click on Products or Services never closes a menu that hover just opened. Hover opens, click toggles predictably, Escape closes.
- **AC-NAV-4:** The mobile menu closes with Escape. The menu button has `aria-controls` and `aria-expanded`.
- **AC-NAV-5:** In-page links (`#process`, `#pxp`, `#values` and the rest) land with the section heading fully visible below the sticky header and the product sub-nav, using `scroll-margin-top`.
- Keyboard: tab order follows reading order; the skip link is first; every mega menu item is reachable by keyboard.
- Screen readers: one H1 per page; sections labelled by their headings; decorative canvases, aurora and orbs are `aria-hidden`; tabs use the ARIA tab pattern; toasts and form success panels use `role="status"`; the language switch group is labelled "Language".
- Images: product screens and photos have meaningful alt text in both languages; decorative images have empty alt.
- Touch targets meet WCAG 2.2 target size (at least 24 x 24px); buttons are 42 to 52px tall.
- Mobile menu: while open, background content does not scroll and focus stays inside the menu.

## Responsive & Platform

Breakpoints from the prototype (max-width):

| Width | Changes |
|---|---|
| Above 1080px | Full header menu with hover mega menus. 4-D flow in one row with track and end nodes. Stats in 5 columns. Services in 4 columns. |
| 1080px and below | Menu moves behind the menu button; mega content expands inline in the mobile menu. 4-D steps in 2 columns without track or end nodes. Stats in 3 columns. Services in 2 columns. |
| 900px and below | Home hero, splits, capture bands, front doors and offices stack to one column; devices max 560px wide. Bento, values, news and leadership in 2 columns; the News feature card spans full width. Footer in 2 columns. |
| 640px and below | Gutters 16px. Section padding shrinks. Bento, values, news, services, 4-D steps, form grid and feature lists in 1 column. Stats in 2 columns. Footer in 1 column. Capture row stacks the field above the button. The highlight mark may wrap. |

**Header at every width** (fixes the prototype, which hid both on phones): the EN/VI switch stays in the header or moves into the mobile menu, and Book a demo stays in the header or moves into the mobile menu. Neither is ever unreachable (AC-NAV-1, AC-NAV-2).

Browsers: current evergreen browsers on desktop and mobile. Content is readable without JavaScript.

## Bilingual (EN / VI)

- English is the default. The EN/VI switch changes the language on every page; the choice persists.
- Each language has its own URL (`/en/...`, `/vi/...`) with `hreflang` links, translated titles, meta descriptions, alt text, screen-reader labels and toasts.
- All four fonts load with the `vietnamese` subset. Vietnamese H1 and H2 use line-height 1.18 or more (`{typography.headline-vi}`).
- Layouts must fit Vietnamese strings, which run longer than English. Buttons do not truncate; headlines may wrap.
- Product and service names stay in English in both languages.
- Dates in news use the mono `DD MON YYYY` format in both languages.

## Inspiration & Anti-patterns

- **Lifted from nashtechglobal.com:** the multi-page IA and the section colour rhythm.
- **Lifted from Figma-style product sites:** product introduction through short animated clips inside device frames rather than static screenshots.
- **Lifted from Stripe-style surfaces:** the moving cloth and strand feel behind heroes.
- **Reference hero:** `imports/ref-hero-device-mockup.png` (tablet + phone over a soft mesh with flowing strands).
- **Rejected:** flat colour-swatch themes (too simple, AI-looking); AI-generated illustrations; a dark mode toggle (replaced by the colour rhythm; the user may reverse this); audience-based navigation (Products is organised by app); fonts without Vietnamese (Michroma, Orbitron, Sora); the Da Nang office and second HCMC address from the old site; leadership names from the old site, which look like theme placeholders.

## Key Flows

### Flow 1: Principal evaluates products and books a demo (Nguyễn Thị Lan, principal, after school on her office laptop)

1. Lan searches for school parent apps and lands on Home. In the first seconds she sees the headline, the tablet and phone showing real product screens, and the Products for schools door.
2. She clicks the Products door. The Products page opens on the amber hero.
3. She uses the sticky sub-nav to jump to SXP. The heading lands fully visible under the header and sub-nav.
4. She switches to VI to check how the staff-facing copy reads for her team. Every string, including the sub-nav and buttons, changes.
5. She scrolls to PXP and taps through Attendance, Grades, Messages, Payments and Events on the story phone.
6. She reads two product updates under `#updates`.
7. In the navy capture band she types her work email and presses "Book a demo".
8. The contact page opens on the Product demo tab with her email already filled in. She adds her name, school, role, ticks PXP and SXP, picks school size and a date next week.
9. **Climax:** she presses "Send request" and the form turns into "Thank you! We will be in touch soon." She closes the laptop knowing the demo will use her school's scenarios.

Failure: she mistypes her email in the capture band; the error "Please enter a valid email address." appears and is announced, focus stays on the field, and it clears as she corrects it. She tries to pick yesterday as the date; the picker does not allow it.

### Flow 2: CTO looks for an outsourcing team and starts a project (Trần Minh Quân, CTO of a logistics company, between meetings)

1. Quân arrives on Home from a referral and goes straight to the Outsourcing services door.
2. On Services, the hero shows live local times for Ho Chi Minh City and Dallas; he checks the overlap with his own day.
3. He scans the eight services and reads "Three ways to work with us": dedicated team, end-to-end delivery or co-creation.
4. He follows "See our 4-D process". The flow lights up step by step, and he reads what he receives at each step.
5. Under Industries he sees Logistics listed next to EdTech, Healthcare and Private Equity.
6. He checks About for the company story, values and the two offices.
7. Back on Services he enters his work email in the amber band and presses "Start a project".
8. **Climax:** the contact page opens already on the Outsourcing project tab, scrolled to the form, with his email filled in. He picks Product Engineering, "In 1 to 3 months", and presses "Send request". The thank-you panel confirms the request, and the next step he read about, Discovery, is now his.

Failure: he submits without his company name; the field is marked, the error "Please enter your organisation." is announced and focus moves to it.

### Flow 3: Parent finds PXP (Phạm Thu Hà, mother of a primary school pupil, on her phone in the evening)

1. Hà hears that her child's school will use PXP and searches for it on her phone. She lands on Home.
2. She switches to VI from the header; the switch is visible on her phone.
3. She opens the menu, expands Products and taps PXP.
4. The Products page opens at `#pxp`, with the heading visible below the header and sub-nav.
5. She taps the phone tabs to see Attendance, Grades, Messages and Payments.
6. She reads the four features: know they arrived, see progress early, talk to teachers, pay fees in a tap.
7. **Climax:** she taps the App Store or Google Play button and lands on the PXP store page, ready to install.

Failure: until the real store links are confirmed, the buttons are `[Placeholder]` and this flow cannot launch (see Open Questions).

### Flow 4: Job seeker joins the talent network (Lê Hoàng Nam, QA engineer, weekend browsing)

1. Nam reads a News story from the team category about release testing and follows Careers from the header.
2. On Careers he reads the culture section, the core values and why people grow here.
3. Open roles shows "No open roles right now." with a route to the talent network.
4. He looks at the Life at XionTechs photos.
5. He enters his email in the talent network band and presses "Join".
6. **Climax:** the band shows "Thanks, you're on the list." in place, and he knows he will hear first when a matching role opens.

Failure: an invalid email shows the inline error and keeps him in the band.

## Open Questions

- **24/7 global coverage:** confirm the claim with the business before it launches.
- **Dallas address:** only "Texas, United States" is known; a street address is needed.
- **Contact email:** no public contact email is defined yet.
- **Leadership:** real names, roles and photos for the leadership grid.
- **Privacy policy:** needed before any form goes live (Vietnam PDPD, Decree 13/2023).
- **Store links:** real App Store and Google Play links for PXP.
- **CMS choice:** drives news story pages, filter empty states, product updates and media uploads.
- **Real app URLs:** the LXP, SXP and IoT web addresses shown in browser frames.
- **Other content still marked `[Placeholder]`:** stats, product and service descriptions, feature lists, news stories, partner-school logos (with permission), product screenshots or clips, team photos, careers benefits, the news email frequency.
- **VI labels** for Start a project, Subscribe, Join and Send request.
- **About page capture:** its heading reads "Let's work together." but the button is "Book a demo" and routes to the Product demo tab. Confirm the intent.
- **Logo:** an SVG master is needed for retina and navy surfaces.
- **Dark mode:** dropped in favour of the colour rhythm; the user may reverse this.
