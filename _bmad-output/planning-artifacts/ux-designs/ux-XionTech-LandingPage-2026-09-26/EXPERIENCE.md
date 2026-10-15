---
name: XionTech Website
status: final
updated: 2026-10-01
sources:
  - .memlog.md
  - README.md
  - code-review-2026-09-28.md
---

# XionTech Website: Experience Spine

## Shipped Site (2026-10-15)

What the code in `src/` ships today. Where an older section below disagrees (Book a demo, the `/demo` page, English-only Demo day), this section wins. Visual tokens are in `DESIGN.md` › Shipped Site.

- **Contact:** one get-in-touch form, on Home (`/{locale}#contact`). Every primary button on every page goes there with a label that fits its page; the header "Let's talk" (amber primary) and the same button in the mobile menu reach it from any page. Email capture bands also send the visitor there. `/demo` redirects to `/#contact`.
- **Careers:** hero (H1 "Careers at XionTech", lede, the prompt line "Ready to build with us?", stacked-cards picture that floats; no buttons), then Principles we value, Meet the team at XionTech (`#meet-the-team`) and open roles (`#roles`). Team photos: every image file in `public/careers/life/` (any filename; `.webp`, `.jpg`, `.jpeg`, `.png` or `.avif`; sorted by filename) shows in the strip with the generic localized alt "XionTech team moment" and no caption. The page reads the folder when it is built, so rebuild and redeploy after adding photos (in `npm run dev` a refresh is enough). An empty folder shows plain tinted tiles. HEIC files are skipped (browsers cannot show them); export them as JPEG or WebP first.
- **Locales:** six, en, vi, ja, fr, ko, zh (`/zh` is Simplified Chinese). Every visible string needs an entry in all six dictionaries; AI translations are listed for a native reader in `docs/translations/<locale>-review.md` (run `npm run i18n:review` after any copy change). Product names and "Get IT done" stay English.
- **Motion:**
  - *Hero load-in:* every page title opens word by word (`heroWords`, `[data-hw]`), then the lines under it, then the button, in about 1.5s, with no script.
  - *Sequential reveal:* one shared system (`src/components/sections/scroll-reveal.tsx`) plays each section's children in page order as they cross 10% above the bottom of the screen, 100ms apart, capped at five steps. Parts that animate themselves (mountain story, three-layer stack, 4-D flow) or carry `[data-reveal-off]` are left alone. New sections join it; do not add a second reveal script.
  - *Reduced motion:* under `prefers-reduced-motion: reduce` everything shows in its final state; loops (Life strip, hero picture float) stop.
  - *Hidden states:* a new rule that hides content with `opacity: 0` fails `src/lib/design/contrast.test.ts` unless it is on that test's allowlist; use `opacity: 0.01`.
  - Animate only `transform` and `opacity`.
- **One section, one screen:** on desktop and tablet a section should fit one viewport, without forcing an empty band on phones.
- **Interactive parts:** value flip cards turn over on click, tap, Enter or Space and keep the hidden face inert; the Life strip pauses on hover or focus; the mobile menu sheet (1080px and below) keeps focus between the header bar and the sheet and closes when the window grows past 1080px.

## Foundation

- **Form factor:** a public, multi-page, responsive marketing website. One surface (the browser) from phone to desktop. No app shell, no sign-in.
- **Build:** Next.js 16 (App Router) + Tailwind CSS v4 + shadcn/ui (planned) + Motion for animation. `DESIGN.md` is the visual identity reference and maps its tokens to Tailwind `@theme`; this spine is the behaviour. Where shadcn/ui is used, this spine states only the behavioural delta.
- **Two audiences, two front doors:** Products (priority; school and university buyers who explore products and book a demo) and Outsourcing services (companies looking for a delivery partner). Home serves both near the top.
- **Languages:** English by default, Vietnamese via the language dropdown. Served as `/en/` and `/vi/` URLs with `hreflang`.
- **No dark mode.** The section colour rhythm in `DESIGN.md` replaces it.
- **Stakes:** a real public company website. Forms collect personal data (Vietnam PDPD, Decree 13/2023, applies). Accessibility floor is WCAG 2.2 AA.
- **Content rule:** anything not verified by the business is marked `[Placeholder]` and must not launch unmarked (see Voice and Tone).
- **Rendering:** header, footer and news are rendered on the server for SEO. Each page has its own title, meta description, canonical, Open Graph tags and favicon (Next.js Metadata API). Organization and app JSON-LD on Home.
- **Performance:** icon sets and third-party scripts never block rendering (use a React icon package or defer the script) (AC-PERF-1).

Reference mockups: [`prototype-enhancement/prototype/index.html`](../../../prototype-enhancement/prototype/index.html), [`products.html`](../../../prototype-enhancement/prototype/products.html), [`services.html`](../../../prototype-enhancement/prototype/services.html), [`news.html`](../../../prototype-enhancement/prototype/news.html), [`about.html`](../../../prototype-enhancement/prototype/about.html), [`careers.html`](../../../prototype-enhancement/prototype/careers.html), [`job.html`](../../../prototype-enhancement/prototype/job.html), [`demo.html`](../../../prototype-enhancement/prototype/demo.html). They are a design reference, not production code: rebuild in Next.js, do not copy the HTML. **These spines win on any conflict with the mockups.** Prototype-only tooling (screenshot slots that accept click, drop or paste and save in the browser) is not part of the product.

## Information Architecture

| Page | URL | Purpose | Sections in order |
|---|---|---|---|
| Home | `/` | Show what the products do in the first 5 seconds; open both front doors | Dark hero (silk background with a motion toggle, headline, one primary CTA "Explore our products", tablet + phone devices, and the stats "Experience you can count on"), then light sections: two front doors (Products for schools, Outsourcing services), Why XionTech (a 12-column grid of four tiles: "We build and run our own school platforms." with a team photo slot, spanning 7 columns and 2 rows; "Two offices, one working day." in navy with the live local times of Plano and Ho Chi Minh City; "Education is our core."; a full-width amber "Get IT Done" strip linking to the core values), the four-app row "Four apps for every role in school." (PXP, LXP, SXP, IoT: badge, name, who it is for and one line each, every item one link to its Products anchor, then "Explore our products"), 4-D process, latest news (3), demo capture |
| Products | `/products` | Let school buyers explore every app and book a demo | Hero (devices, Book a demo, Product updates), sticky sub-nav, `#pxp` (story phone with 5 tabs, features, store links that open a new tab), `#lxp`, `#sxp`, `#iot`, `#updates` (3 product stories), demo capture |
| Services | `/services` | Let companies judge the delivery team and start a project | Hero (Start a project, See our 4-D process, office clocks), stats, 8 services (each with an anchor), three ways to work with us, `#process` (4-D), industries + time zones, project capture |
| News | `/news` | Dated short stories about products, schools, team and company | Hero, category filters + story grid, demo capture |
| About | `/about` | Who XionTech is | Hero, stats, story, `#values` (6 core values), `#faq` (9 questions), offices, demo capture "See our apps in action." (no leadership section) |
| Careers | `/careers` | Attract engineers, testers and designers | Shipped (2026-10-15): hero without buttons, Principles we value, `#meet-the-team` photo strip, `#roles`. Original plan: Hero (See open roles, Life at XionTech), culture, benefits, `#roles` (open roles list), `#life` photos |
| Job page | `/careers/[slug]` | Read one role and apply | Breadcrumbs (Home / Careers / job title), H1 job title, team, location and work type; "About the role", "What you'll do", "What you bring"; "Apply for this role" form with CV upload; "All open roles" link back. From Sanity. |
| Book a demo (Contact), removed: `/demo` now redirects to `/#contact` | `/demo` | One contact form for both intents | Hero with reassurance list and offices; form card with `#form` (Product demo tab) and `#project` (Outsourcing project tab) |
| News story | `/news/[slug]` | One dated story | Breadcrumbs (Home / News / story), H1, date + category tag, photo, body, related product link, back to News. Own title, meta and Open Graph image. Depends on the CMS. |
| Privacy policy | `/privacy` | How personal data from the forms is used (PDPD) | Linked from every consent line and the footer. Content is an open question. |
| Not found | any unknown path | Recover from a broken link | Short message, links to Home, Products, Services and News, in the current language. |

The 2026-09-29 English-only plan was dropped; the site ships six locales (see Shipped Site).

**Locale routing.** Paths above are shown without the locale prefix; every page exists under `/en/` and `/vi/`. A bare `/` redirects to the saved language, else to `/vi/` if the browser prefers Vietnamese, else to `/en/`. A locale in the URL always wins over the saved choice, so a shared link opens in the sender's language. `hreflang` links pair each page, with `x-default` pointing to `/en/`.

Service anchors: `#product-engineering`, `#ai-analytics`, `#co-creation`, `#staffing`, `#custom-apps`, `#low-code`, `#ai-solutions`, `#cloud`.

**Header navigation** (every page):

- **Products** mega menu, organised by app, not by audience: PXP (Parents), LXP (Students), SXP (Staff, Teachers, Leaders), IoT Device Management (School staff and facilities). Footer row: "More products are on the way." + "All products". New products are added as new rows with no restructuring.
- **Services** as a plain link to `/services` (no mega menu, decided 2026-10-01). The 8 services and the 4-D process are on the Services page.
- **News**, **About**, **Careers** as plain links.
- **Text only:** the header and the Products mega menu show text only (no product badges, service icons, arrows or caret icons); the language dropdown is the only control with a caret. The mobile menu button reads "Menu".
- **Layout:** logo on the left and the menu on the right (Products, Services, News, About, Careers), with the language dropdown as the last item. The header has one amber primary "Let's talk" before the language dropdown, linking to the Home get-in-touch form (see Shipped Site).
- The Products trigger is text only, with no caret icon, aligned with the plain links.
- Logo links home. A skip link ("Skip to content") comes first in tab order.

**Footer** (every page): logo + one-line blurb; **Products** (PXP, LXP, SXP, IoT Device Management, Product updates); **Services** (Product Engineering, AI-Driven Analytics, Staffing Service, Low-code Solutions, Cloud Computing, All services); **Company** (About, Core values, FAQ, News, Careers, Contact); **Offices**: Plano, Texas, USA (7950 Legacy Drive, Suite 400, Plano, Texas 75024, USA; +1 469 322 9899; WhatsApp +1 469 439 9345; vinni.tran@newxion.com) first, then Ho Chi Minh City, Vietnam, labelled "Vietnam Delivery Center" (Floor 15, B1 Building, 279 Nguyen Tri Phuong Street, Dien Hong Ward, Ho Chi Minh City, Vietnam; +84 908 107 552). Bottom bar: copyright, Privacy policy link, GET IT DONE tag.

**Needs to surfaces:**

| Stated need | Surface | Flow |
|---|---|---|
| School buyer explores products | Home four-app row, Products mega, `/products` | Flow 1 |
| School buyer books a demo | Hero buttons, demo capture bands, footer "Contact", `/demo#form` | Flow 1 |
| Company finds a delivery partner | Home services door, Services link, `/services` | Flow 2 |
| Company starts a project | Start a project CTA, project capture, `/demo#project` | Flow 2 |
| Parent finds PXP | Products mega (PXP), `/products#pxp`, store links | Flow 3 |
| Product updates | `/products#updates`, News "Product" filter | Flow 1 |
| News with category filters | `/news` | Flow 4 |
| Company facts, values, offices | `/about`, footer | Flow 2 |
| Job seeker finds and applies for a role | `/careers#roles`, `/careers/[slug]` | Flow 4 |
| Email capture on every page | Capture band on every page except `/demo` (which is the form), Not found, Privacy policy, News story, Careers and job pages (`/careers/[slug]`), which have no capture band | Flows 1 to 4 |
| Read in Vietnamese | Language dropdown in the header | Flows 1, 3 |

## Voice and Tone

Microcopy rules. Brand voice lives in `DESIGN.md` Brand & Style.

- Short, plain sentences. Headlines end with a full stop ("Four apps. One school day.").
- Speak to the reader as "you"; the company is "we".
- Say what the reader gets, not what we are ("A clear scope and delivery plan.").
- Product names stay in English in both languages (PXP, LXP, SXP, IoT). Service names stay in English in both languages.
- Follow the prototype's spelling (organisation, specialised).
- No exclamation marks except the contact form's "Thank you!". No emoji.
- Every visible string, page title, meta description, screen-reader label and toast has an EN and a VI version.

**`[Placeholder]` convention.** Any content not verified by the business (figures, product and service descriptions, feature lists, store links, app URLs, stories, people, photos, legal links) starts with `[Placeholder]` in both languages. It is a launch blocker: `grep -rn "\[Placeholder\]"` over `src/` and the build output (excluding planning artifacts, tests and the check script) must return nothing before launch. Sample content is never presented as real.

**CTA labels: one label per intent.**

| Intent | Label (EN) | Label (VI) | Goes to |
|---|---|---|---|
| Product demo | Book a demo | Đặt lịch demo | `/demo#form` (Product demo tab) |
| Outsourcing project | Start a project | Bắt đầu dự án | `/demo#project` (Outsourcing project tab) |
| Send the contact form | Send request | Gửi yêu cầu | Form success state |
| Apply for a role | Send application | Gửi hồ sơ | Form success state |

Secondary links keep their own labels ("Explore our products", "Explore our services", "See our 4-D process", "Product updates", "See open roles", "View and apply", "All open roles", "Life at XionTech", "Read story", "See all news", "All products", "See the process"). Never reuse "Book a demo" for a project intent or "Start a project" for a demo.

**Wording to reuse:**

| Situation | Wording |
|---|---|
| Invalid email | "Please enter a valid email address." |
| Missing name / organisation | "Please enter your name." / "Please enter your organisation." |
| Consent line under demo capture | "We only use your email to arrange your demo." |
| Consent line under project and contact forms | "We only use your details to respond to this request." |
| Consent line under the job application | "We only use your details and CV to consider your application." |
| Privacy link | Every consent line ends with a "Privacy policy" link. |
| Contact form success | "Thank you!" + "We will be in touch soon." |
| Job application success | "Thank you!" + "We've received your application and will be in touch if it's a match." |
| Wrong or missing CV | "Please upload your CV as a PDF or Word file, up to 5 MB." |
| No open roles | "No open roles right now." |
| Role field help | "For example: Principal, Head of IT" |

## Component Patterns

Behavioural. Visual specs live in `DESIGN.md` Components under the same names.

| Component | Behavioural rules |
|---|---|
| Site header | Sticky at the top of every page. Marks the current page (`aria-current="page"`, or the current mega trigger). Below 1080px the menu collapses behind the menu button. |
| Mega menu | Desktop with hover: hover opens; moving away closes after a 150ms delay so the pointer can cross the gap to the panel. Click toggles predictably and never closes a menu that hover just opened (AC-NAV-3). Escape closes and returns focus to the trigger. A click outside closes. Trigger has `aria-expanded`. Mobile: the mega content expands inline inside the mobile menu. |
| Mobile menu | Menu button has `aria-controls` and `aria-expanded` (AC-NAV-4). Escape closes it and returns focus to the button. Contains all nav items. The language dropdown never moves into the menu; it stays in the header bar (AC-NAV-1). While open, the focus trap covers the open menu panel plus the header bar controls (logo link, language dropdown, Menu button), so the language dropdown stays reachable. |
| Language dropdown | The last item in the header: a button styled like the nav links showing the current code (EN or VI) with a caret that flips up when open, opening a small list of "EN" and "VI" (named English and Tiếng Việt) in the same text style on the header glass; the chosen language is marked with `aria-current`; choosing closes the list and returns focus to the button; Escape or a click outside closes it. Switching routes to the matching `/en/` or `/vi/` URL of the same page and keeps the scroll position and any values typed in forms. The page `lang` attribute, title and meta change with it. The choice is saved for the next visit in an essential first-party locale cookie, so the server can redirect a bare `/` (see Locale routing). |
| Button | Links that look like buttons navigate; buttons submit or toggle. One primary button per group. |
| Product sub-nav | Sticky under the header on `/products`. Highlights the section in view; at the end of the page the last item (Updates) is highlighted. Links scroll to anchors that land with the heading fully visible (AC-NAV-5). Scrolls horizontally on narrow screens. |
| Front door | Whole panel is one link (Products door to `/products`, Services door to `/services`). Chips inside are text, not links. |
| Four-app row | Each item is one link to its Products anchor (`#pxp`, `#lxp`, `#sxp`, `#iot`); nothing interactive inside it. |
| Why XionTech | Static tiles; only the "Our core values" link in the amber strip is interactive. The navy tile shows the live local times, which update every 30 seconds like the office clocks. The team photo slot shows a placeholder frame until a real photo is supplied. |
| Service card | Lives on `/services` only (removed from Home 2026-10-01), where it is the anchor target and is not a link. The Home services door and the Services link lead there. |
| Spotlight card | Pointer-following glow and 4px lift on hover only. Hover starts immediately once scroll reveal has finished (AC-UI-1). |
| Stats band | Numbers count up once when 60% visible (1.4s, ease out). "24/7" does not count. Screen readers get the final value only. Built as one shared component (the prototype copies it across pages). On Home it sits at the bottom of the dark hero. |
| Process flow (4-D) | When 30% visible, the track fills with amber (2.4s) and steps 01 to 04 fade in one after another; then an amber dot travels the track once and rests at Launch. Below 1080px the track and end nodes hide and steps stack. "You receive" rows align across cards (AC-UI-2). One shared component. |
| Product badge | Decorative label for an app; never the only way to tell apps apart (the app name is always next to it). |
| Industry chip | Static. |
| Value grid | Hover tints the cell. Static otherwise. |
| News card | "Read story" opens the story detail page (`/news/[slug]`; the prototype has one sample, `news-story.html`). Category tag shows the app for product stories. |
| Category tag | Static text. Product stories append the app name. |
| Filter chips | Toggle buttons with `aria-pressed`; exactly one active at a time; pressing the active chip does nothing; "All" resets. Filtering is instant, with no page reload. The result count is announced ("Showing 3 stories"). |
| Email capture | Validates on submit. Invalid: inline error, `aria-invalid="true"`, error linked with `aria-describedby`, focus returns to the field; the error clears as the user types. Valid demo capture: goes to `/demo#form` with the email prefilled. The email travels through session storage or a server-side session, never in the URL (no query string, no hash). Valid project capture: goes to `/demo#project`, Outsourcing project tab selected, scrolled to the form (AC-FORM-2). There are only these two kinds; no subscribe or talent-network capture (decided 2026-09-29). |
| Contact form | Two tabs: Product demo and Outsourcing project. The URL hash picks the tab on load (`#project` opens Outsourcing; any other hash opens Product demo). Fields in the hidden tab are not validated, cannot take focus and are not submitted; values typed there are kept if the user switches back. Fields and rules are in the Contact form fields table below. Submit validates all visible required fields, marks each invalid one and moves focus to the first. Success replaces the form with the thank-you panel. A hidden honeypot field and a server-side rate limit stop spam. |
| Device frame | Holds real product screens or short product clips. Tilts slightly with the pointer on hover-capable devices only. Frames float gently. |
| Media frame | Shows the real asset. If an asset is missing in production, the frame shows its empty grid, never a broken image. Where a CMS allows uploads, an upload or paste only changes the item the user selected, never a previously hovered one (AC-FORM-3). |
| Browser frame | Static chrome around a web app media frame. The URL pill is a link that opens the app in a new tab (accessible name ends "(opens in a new tab)"); it shows the real address once confirmed and a `[Placeholder]` link until then. |
| Store buttons | App Store and Google Play buttons under PXP, always shown. They open a new tab (accessible name ends "(opens in a new tab)"); `[Placeholder]` links until real ones exist. |
| PXP story phone + phone tabs | Five tabs (Attendance, Grades, Messages, Payments, Events). Selecting a tab crossfades the matching screen in. Inactive screens are hidden from focus and assistive tech (AC-A11Y-3). |
| Office card | Shows the office's live local time, updated every 30 seconds, plus address and a `tel:` link. Times use IANA zones (`Asia/Ho_Chi_Minh`, `America/Chicago`) so daylight saving is right. |
| Clock strip | Live local time for Ho Chi Minh City and Plano. |
| Breadcrumbs | Home link + current page name. Inner pages only. |
| Highlight mark | Draws in once when the headline appears. Decorative. |
| Placeholder frame | Stands in for real photos or illustrations until supplied. Never shipped at launch. |
| Role card | One stretched link per open role: job title, then team, location and work type, and "View and apply". Opens the job page. Roles come from Sanity. |
| Open roles panel | Shown only when there are no open roles: "No open roles right now." |
| Job application form | On the job page, beside the role details (stacks below them at 900px and below). Fields and rules are in the Job application fields table below. Submit marks every invalid field and focuses the first; errors are announced and linked (AC-A11Y-5). Stored in Sanity; honeypot and rate limit as for the contact form. |
| Site footer | Same on every page. The privacy policy link must point at a real policy before launch. |
| Toast | Short status message, bottom centre, `role="status"`, gone after about 2.6s. |
| Motion toggle | Discreet icon button at the top right of the Home hero; the label is always in its accessible name and fades in beside the button on hover or keyboard focus. Label and icon switch between "Pause motion" and "Play motion" (VI "Tạm dừng chuyển động" / "Chạy chuyển động"); the changing name carries the state, so there is no `aria-pressed`. Hidden without JavaScript or WebGL, or when the WebGL context is lost. Under reduced motion the label stays visible next to the button. |
| FAQ | Native disclosure (`<details>` / `<summary>`): several answers can be open at once; Enter and Space toggle; the question is the accessible name. FAQPage structured data on `/about`. Reached from the footer "FAQ" link at `/about#faq`. |
| Skip link | First focusable element; jumps to `main`. |
| Focus ring | Shown on keyboard focus (`:focus-visible`) on every focusable element. Colour follows the section: `{colors.focus-on-navy}` on navy, `{colors.focus}` elsewhere. |

**Contact form fields**

| Field | Tab | Required | Rules and error wording |
|---|---|---|---|
| Full name | Both | Yes | "Please enter your name." |
| Work email | Both | Yes | Valid format; free-mail domains are accepted. "Please enter a valid email address." |
| School or company | Both | Yes | "Please enter your organisation." |
| Role | Both | No | Help text "For example: Principal, Head of IT". |
| Products of interest | Product demo | No | Checkbox pills PXP, LXP, SXP, IoT; PXP checked by default. |
| School size | Product demo | No | Under 500 students; 500 to 1,500 students; Over 1,500 students; Multiple campuses. |
| Preferred date | Product demo | No | Today or later in the visitor's time zone (AC-FORM-1). "Please choose today or a later date." |
| Service | Outsourcing project | No | The 8 services + "Not sure yet". |
| Start timing | Outsourcing project | No | As soon as possible; In 1 to 3 months; Just exploring. |
| Message | Both | No | Up to 2,000 characters. "Please keep your message under 2,000 characters." |

**Job application fields**

| Field | Required | Rules and error wording |
|---|---|---|
| Full name | Yes | "Please enter your name." |
| Email | Yes | Valid format. "Please enter a valid email address." |
| Phone | No | Telephone keypad on phones. |
| CV | Yes | PDF or Word (.pdf, .doc, .docx), up to 5 MB, checked on selection and on submit. "Please upload your CV as a PDF or Word file, up to 5 MB." |
| Cover note | No | Up to 2,000 characters. "Please keep your note under 2,000 characters." |

Error text uses `{colors.error}` on paper and amber and `{colors.error-on-navy}` on navy. Demo and project Submissions go to vinni.tran@newxion.com; job applications are stored in Sanity (whether CVs belong there is for Hoang Vu to confirm).

## State Patterns

| Surface | State | Treatment |
|---|---|---|
| All pages | No JavaScript | Every section is visible (reveal animations are an enhancement). [ASSUMPTION] Forms still submit through the server. |
| All pages | Fonts loading | Fonts use `display: swap` with system fallbacks; no invisible text. |
| All pages | Reduced motion | Final states shown with no animation (see Motion). |
| Header | Mega open / closed | See Component Patterns. |
| Office card, clock strip | Before time loads or without JavaScript | Shows the zone label (GMT+7, US Central) rendered on the server, then the live time. |
| Home, Products | Media missing | Empty media frame, no broken image. |
| Products `#pxp` | Tab switch | Only the active screen is visible and focusable. |
| Products `#updates`, Home news | No product stories | Hide the grid and keep the "See all news" link. |
| News | Filter with no matches | Empty message in the grid ("No stories in this category yet.") with a "Show all" button that resets to All. |
| News | Story detail | Detail page per story. Depends on the CMS choice. |
| Careers | No open roles | Open roles panel. |
| Careers | Roles open | Role cards replace the panel. |
| Job page | Unknown or closed role | The Not found page. |
| Job application | Idle, error, sending, success, send failure | Same as the contact form: errors per field with focus on the first; "Sending..." while sending; success replaces the form with the thank-you panel; a failure keeps every value, including the chosen CV, and offers a retry. |
| Email capture | Idle / error / sending / send failure / success / redirect | Error inline and announced; while sending the button is disabled and reads "Sending..." ("Đang gửi..."); a send failure keeps the email and shows an inline error with a retry; demo and project redirect to `/demo` with the email prefilled (no prefill if session storage is unavailable). |
| Contact form | Idle, error, sending, success, send failure | Error per field with focus on the first. While sending, the submit button is disabled and reads "Sending..." ("Đang gửi..."). Success shows the thank-you panel. If sending fails, keep every entered value and show an error above the button with a way to retry. |
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
| Home hero background | The silk cloth ripples slowly and continuously (time scale 0.35 in the prototype `site.js`). A visible "Pause motion" / "Play motion" button in the hero stops and restarts it (WCAG 2.2.2). The choice is remembered, and a saved explicit choice (Play or Pause) wins over `prefers-reduced-motion` on the next visit; with no saved choice and reduced motion it starts paused; it also pauses when off screen or when the tab is hidden (`visibilitychange`). |
| Inner page hero background | Aurora blobs drift and the strand ribbon moves slowly, then both stop after 5s and hold the frame (WCAG 2.2.2). The ribbon also pauses when off screen. |
| Devices | Tablet and phone float up and down for one cycle (under 5s), then rest; pointer tilt up to 8 degrees. Product clips never autoplay with sound, show a poster frame and have visible play and pause controls; a muted autoplay clip stops after 5s unless the user plays it. |
| Highlight mark | Scales in from the left over 1.2s after a 0.5s delay. |
| Stats | Count up over 1.4s. |
| 4-D process | Track fills over 2.4s; steps enter at 0.3s, 0.85s, 1.4s and 1.95s; the dot travels the track once and rests at Launch. |
| Story phone | Screens crossfade over 0.55s. |
| Mega menu | Fades and drops in over 0.3s. |

**Reduced motion** (`prefers-reduced-motion: reduce`): no movement anywhere; state changes (tabs, menus, form results, reveals) keep short opacity fades of 150 to 250ms so the change is still visible. Revealed content, the full 4-D track and all steps show immediately; stats show final numbers; the strand ribbon draws one still frame; device float and tilt are off; smooth scroll is off.

## Accessibility Floor

Behavioural. Visual contrast lives in `DESIGN.md` Colors. Every item below is an acceptance criterion for the build.

- WCAG 2.2 AA on every page, in both languages.
- **AC-A11Y-1:** All text meets 4.5:1 (3:1 for large text) and icons meet 3:1. Amber text or icons on light surfaces use `{colors.amber-text}`; `{colors.amber-decor}` is never used for text or icons.
- **AC-A11Y-2:** Every focusable element has a visible focus indicator on every section colour. On navy sections the ring is `{colors.focus-on-navy}`, including the email capture field; elsewhere it is `{colors.focus}`.
- **AC-A11Y-3:** Hidden content (inactive phone screens, closed tabs, closed menus, the inactive contact form tab) cannot receive keyboard focus.
- **AC-A11Y-4:** No interactive element is nested inside a link. Tiles with media use a separate link or a stretched link.
- **AC-A11Y-5:** Invalid fields get `aria-invalid="true"` and are linked to their error text with `aria-describedby`. Validation errors are announced.
- **AC-NAV-1:** The language dropdown is available in the header bar at every screen width.
- **AC-NAV-2:** "Book a demo" is reachable at every width without a header button: from the hero button or capture band on Home, Products, About and News (Services offers "Start a project"), and from "Contact" in the footer on every page, which is the only route on Careers, Job, News story, Privacy and Not found.
- **AC-NAV-3:** On desktop, a click on Products never closes a menu that hover just opened. Hover opens, click toggles predictably, Escape closes.
- **AC-NAV-4:** The mobile menu closes with Escape. The menu button has `aria-controls` and `aria-expanded`.
- **AC-NAV-5:** In-page links (`#process`, `#pxp`, `#values` and the rest) land with the section heading fully visible below the sticky header and the product sub-nav, using `scroll-margin-top`.
- Keyboard: tab order follows reading order; the skip link is first; every mega menu item is reachable by keyboard.
- Screen readers: one H1 per page; sections labelled by their headings; decorative canvases, aurora and orbs are `aria-hidden`; tabs use the ARIA tab pattern; toasts and form success panels use `role="status"`; The trigger's accessible name is "Language: EN" (visually hidden "Language:" plus the visible code); the options are named "EN English" and "VI Tiếng Việt", so each name contains its visible text (WCAG 2.5.3). The list is a disclosure, not a menu role: Tab moves through the options, Escape closes it and returns focus to the trigger, moving focus out of it closes it, and only one popup (the Products mega menu or the language list) is open at a time. When the mobile menu and the language list are both open, Escape closes the language list first.
- Images: product screens and photos have meaningful alt text in both languages; decorative images have empty alt.
- Touch targets: Every control (buttons, tabs, chips that act, filters, the sub-nav, checkboxes, the language dropdown and its options, the menu and pause buttons) is at least 44 x 44px; inline text links in paragraphs, breadcrumbs, the footer lists and browser-frame addresses meet the WCAG 2.2 minimum of 24 x 24px. Buttons are 44 to 52px tall. Functional text is never smaller than 11.5px.
- Mobile menu: while open, background content does not scroll and focus stays inside the open menu panel plus the header bar controls (logo link, language dropdown, Menu button).
- Headings: no small label sits above a section heading (the only labels are the front-door names and the stats heading); the heading carries its own meaning (for example "Our 4-D process: from your request to launch.", "Our core values.").

## Acceptance Criteria Index

The code review of the prototype turned 14 findings into 16 criteria. All 16 apply to the Next.js build; stories trace to these IDs.

| ID | Rule | Where specified |
|---|---|---|
| AC-NAV-1 to AC-NAV-5 | EN/VI always visible, Book a demo always reachable, predictable mega menus, mobile menu Escape and ARIA, anchors not hidden by sticky bars | Accessibility Floor, Component Patterns, Responsive & Platform |
| AC-A11Y-1 to AC-A11Y-5 | Text, icon and field contrast, visible focus on every surface, hidden content not focusable, no controls inside links, announced field errors | Accessibility Floor; `DESIGN.md` Colors |
| AC-FORM-1 | Preferred date cannot be in the past | Contact form fields |
| AC-FORM-2 | Project capture opens the Outsourcing tab, scrolled to the form | Component Patterns: Email capture |
| AC-FORM-3 | Uploads and pastes change only the selected item | Component Patterns: Media frame |
| AC-UI-1 | Card hover starts without delay after scroll reveal | Component Patterns: Spotlight card |
| AC-UI-2 | "You receive" rows align across the 4-D cards | Component Patterns: Process flow |
| AC-PERF-1 | Icon sets and third-party scripts do not block rendering | Foundation |

## Responsive & Platform

Breakpoints from the prototype (max-width):

| Width | Changes |
|---|---|
| Above 1080px | Full header menu with hover mega menus. 4-D flow in one row with track and end nodes. Stats in 5 columns. Services in 4 columns. |
| 1080px and below | Menu moves behind the menu button; mega content expands inline in the mobile menu. 4-D steps in 2 columns without track or end nodes. Stats in 3 columns. The Home app row in 2 columns. Services in 2 columns. |
| 900px and below | Home hero, splits, capture bands, front doors and offices stack to one column; devices max 560px wide. Why XionTech tiles stack to one column; values and news in 2 columns; the job page form stacks below the role details; the News feature card spans full width. Footer in 2 columns. |
| 640px and below | Gutters 16px. Section padding shrinks. Why XionTech tiles, the app row, values, news, services, 4-D steps, form grid and feature lists in 1 column. Stats in 2 columns. Footer in 1 column. Capture row stacks the field above the button. The highlight mark may wrap. |

**Header at every width:** the language dropdown stays in the header bar at every width (AC-NAV-1). The header "Let's talk" button reaches the Home get-in-touch form (Shipped Site).

Browsers: current evergreen browsers on desktop and mobile. Content is readable without JavaScript.

## Bilingual (EN / VI)

- English is the default. The language dropdown changes the language on every page; the choice persists.
- Each language has its own URL (`/en/...`, `/vi/...`) with `hreflang` links, translated titles, meta descriptions, alt text, screen-reader labels and toasts.
- All four fonts load with the `vietnamese` subset. Vietnamese H1 and H2 use line-height 1.2 (never below 1.18) through a `:lang(vi)` rule (see `DESIGN.md` Typography).
- Layouts must fit Vietnamese strings, which run longer than English. Buttons do not truncate; headlines may wrap.
- Product and service names stay in English in both languages.
- Dates in news use mono type: `18 SEP 2026` in English and `18/09/2026` in Vietnamese.

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
2. On Services, the hero shows live local times for Ho Chi Minh City and Plano; he checks the overlap with his own day.
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

Failure: until the real store links exist, the buttons open a `[Placeholder]` link in a new tab and this flow cannot reach a store (see Open Questions).

### Flow 4: Job seeker applies for a role (Lê Hoàng Nam, QA engineer, weekend browsing)

1. Nam reads a News story from the team category about release testing and follows Careers from the header.
2. On Careers he reads Principles we value and looks at the Meet the team at XionTech photos.
3. In Open roles he picks a QA role and presses "View and apply".
4. The job page shows the role: about the role, what he'll do, what he brings.
5. He fills in his name and email, uploads his CV (PDF) and adds a short cover note.
6. **Climax:** he presses "Send application" and the form is replaced by "Thank you!" and "We've received your application and will be in touch if it's a match."

Failure: a CV over 5 MB or in another format shows "Please upload your CV as a PDF or Word file, up to 5 MB." and keeps everything he typed.

## Open Questions

- **Office addresses:** resolved 2026-09-29. Plano, Texas, USA and the Vietnam Delivery Center in Ho Chi Minh City (see Footer).
- **Contact email:** resolved 2026-09-29. vinni.tran@newxion.com; demo and project Submissions go to it.
- **Leadership:** resolved 2026-09-29. No leadership section.
- **Privacy policy:** a placeholder document on Demo day; real text needed before public launch (Vietnam PDPD, Decree 13/2023).
- **Store links:** none yet; the buttons open `[Placeholder]` links in a new tab.
- **CV storage:** whether Sanity is acceptable for CVs, since uploaded files may be reachable by anyone with the link (owner: Hoang Vu).
- **CMS choice:** resolved 2026-09-28: Sanity (`docs/spikes/cms-spike.md`). It drives news stories, product updates, roles and job pages, job applications, team and office photos and product clips.
- **Real app URLs:** the LXP, SXP and IoT web addresses shown in browser frames.
- **Content confirmed by the business (2026-09-28):** stats (including 24/7 global coverage), product and service descriptions, feature lists, careers benefits and open-roles text. **Still `[Placeholder]`:** news story titles and bodies, roles, team and office photos, product clips, store links, app web addresses and the privacy policy. No partner-school logos exist yet.
- **Analytics and cookies:** if analytics or non-essential cookies are added, a consent banner with decline as the default is required (PDPD). Also decide how long demo and project Submissions and job applications (CVs) are kept.
- **Form destination:** resolved 2026-09-29. Demo and project to the contact inbox; job applications to Sanity. No newsletter or talent network.
- **Behaviour without JavaScript** for the capture redirect and the two-tab contact form: depends on how the Next.js build handles form submission (deferred from review).
- **About page capture:** resolved 2026-09-29. "See our apps in action." with "Book a demo".
- **Logo:** an SVG master will be supplied later.
- **Dark mode:** resolved 2026-09-29. No dark mode and no theme switch.
