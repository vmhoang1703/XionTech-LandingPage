---
title: XionTechs Website PRD
status: draft
created: 2026-09-28
updated: 2026-09-28
owner: Amber Do
sources:
  - AGENTS.md
  - README.md
  - docs/ai-log.md
  - _bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/.memlog.md
  - _bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/README.md
  - _bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/code-review-2026-09-28.md
  - _bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/
---

# PRD: XionTechs Website

## 0. Document Purpose

This PRD is for the XionTechs website team (lead Hoang Vu, UX/BA owner Amber Do, and the third team member), for the challenge judges, and for the downstream BMad workflows (architecture, epics and stories, `bmad-build`). It turns the finished UX work into numbered, testable requirements. It does not repeat the UX specs.

- **UX source of truth:** `EXPERIENCE.md` (behaviour) and `DESIGN.md` (look), both in `_bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/`. They win over the prototype on any conflict. Each FR names the section it comes from as `EXP > Section` or `DES > Section`.
- **Acceptance criteria:** the 16 criteria from `code-review-2026-09-28.md` (AC-NAV-1 to AC-NAV-5, AC-A11Y-1 to AC-A11Y-5, AC-FORM-1 to AC-FORM-3, AC-UI-1, AC-UI-2, AC-PERF-1) are cited by ID and are not restated in full.
- **Prototype:** `mockups/site-v3/` (10 pages) shows every current UI decision. It is a design reference, not production code.
- **Conventions:** paths in this document are relative to the repo root. Terms in the Glossary (section 3) are used exactly. Inferences are tagged `[ASSUMPTION]` inline and listed in section 13. Content that the business has not verified appears on the site as `[Placeholder]`.

## 1. Vision

XionTechs has two businesses that share one engineering team: school platforms it builds and runs (PXP, LXP, SXP and IoT Device Management), and software outsourcing for companies. The current site at xiontechs.com is a WordPress theme that speaks only to outsourcing and carries unverified content.

The new website opens both front doors on the first screen. A school principal sees in five seconds what the products do and can book a demo in a few clicks. A CTO sees eight services, a 4-D delivery process and two offices in overlapping time zones, and can start a project with one email. Everything works in English and Vietnamese, meets WCAG 2.2 AA and treats personal data under Vietnam's PDPD.

The thesis: showing real products first makes XionTechs more credible as an outsourcing partner too, because "the same team that builds PXP, LXP and SXP" is the proof behind the services.

### 1.1 Why now

The site is built for the XionTech internal AI build challenge. Demo day is **2026-10-09** (10 minute presentation plus 5 minute Q&A). The hand-in is a public URL, full git history, the shared context file and `docs/ai-log.md`. Scoring: build quality 30%, AI usage 25%, teamwork and context sharing 25%, presentation 20%. The UX specs were finalised on 2026-09-28, leaving 7 to 8 build days for 2 developers (Andy and Sammy) before Demo day 2026-10-09, about 15 developer-days. The epics' Demo-day plan splits the stories into Demo-day must-haves and after-demo work.

## 2. Target User

### 2.1 Jobs To Be Done

- **School buyer (principal, head of IT):** understand what each app does for my school, check it reads well in Vietnamese for my staff, and book a demo that uses my school's scenarios.
- **Company buyer (CTO, product lead):** judge whether this team can deliver, see how they work and whether our time zones overlap, then start a conversation without a long form.
- **Parent:** confirm my child's school app is real and install it from the right store.
- **Job seeker (engineer, tester, designer):** understand the culture and benefits, see open roles, and be told when a matching role opens.
- **XionTechs team (internal):** publish news and roles without a developer, and receive every form submission. `[ASSUMPTION]` Editors are non-developers, per the decision to keep a CMS in scope (`docs/ai-log.md`, 2026-09-26 Tech stack).

### 2.2 Non-Users (v1)

- Existing PXP, LXP, SXP or IoT users looking to sign in. The website has no sign-in and does not link to app logins in v1. `[ASSUMPTION]`
- Students as buyers. LXP is shown to school buyers; students are not a target audience for the website.
- Investors and press. No investor or press pages.

### 2.3 Key User Journeys

These mirror the four Key Flows in `EXPERIENCE.md` with the same protagonists.

- **UJ-1. Lan, a principal, evaluates the products and books a demo.**
  - **Persona + context:** Nguyễn Thị Lan, school principal, after school on her office laptop.
  - **Entry state:** no sign-in; arrives on Home from search.
  - **Path:** sees the headline, device frames and the Products for schools door; opens Products; jumps to SXP with the sub-nav (heading fully visible); switches to VI and every string changes; taps the five PXP story phone tabs; reads two product updates; enters her work email in the demo capture and presses "Book a demo".
  - **Climax:** the contact form opens on the Product demo tab with her email prefilled; she adds name, school, role, PXP and SXP, school size and a date next week, presses "Send request" and sees "Thank you! We will be in touch soon."
  - **Edge case:** a mistyped email shows "Please enter a valid email address.", announced, focus kept; a past date cannot be picked.

- **UJ-2. Quân, a CTO, looks for an outsourcing team and starts a project.**
  - **Persona + context:** Trần Minh Quân, CTO of a logistics company, between meetings.
  - **Entry state:** arrives on Home from a referral.
  - **Path:** opens the Outsourcing services door; checks live Ho Chi Minh City and Dallas times; scans eight services and "Three ways to work with us"; follows "See our 4-D process"; sees Logistics under Industries; checks About; enters his work email and presses "Start a project".
  - **Climax:** the contact form opens on the Outsourcing project tab, scrolled to the form, email prefilled; he picks Product Engineering and "In 1 to 3 months" and sends. Discovery is the next step he already read about.
  - **Edge case:** submitting without a company name marks the field, announces "Please enter your organisation." and moves focus to it.

- **UJ-3. Hà, a parent, finds PXP on her phone.**
  - **Persona + context:** Phạm Thu Hà, mother of a primary pupil, on her phone in the evening; her child's school will use PXP.
  - **Entry state:** lands on Home from search on a phone.
  - **Path:** switches to VI in the header (visible on her phone); opens the menu, expands Products, taps PXP; lands at the PXP section with the heading visible; taps the phone tabs; reads the four features.
  - **Climax:** taps App Store or Google Play and lands on the PXP store page.
  - **Edge case:** until real store links are confirmed the buttons are `[Placeholder]` and this journey cannot launch.

- **UJ-4. Nam, a QA engineer, joins the talent network.**
  - **Persona + context:** Lê Hoàng Nam, QA engineer, browsing at the weekend.
  - **Entry state:** reads a Team news story, then follows Careers from the header.
  - **Path:** reads culture, values and why people grow here; sees "No open roles right now." with a route to the talent network; views Life at XionTechs photos; enters his email and presses "Join".
  - **Climax:** the band shows "Thanks, you're on the list." in place.
  - **Edge case:** an invalid email shows the inline error and keeps him in the band.

## 3. Glossary

- **Front door:** one of the two large linked panels under the Home hero: the Products door (to Products) and the Services door (to Services).
- **Product:** one of the four school apps: **PXP** (Parent eXperience Place, mobile app for parents), **LXP** (Learner eXperience Place, web portal for students), **SXP** (Staff eXperience Place, web app for staff, teachers and leaders), **IoT Device Management** (web app for school staff and facilities). Product names stay in English in both languages.
- **Service:** one of the eight outsourcing services: Product Engineering, AI-Driven Analytics, Product Co-Creation, Staffing Service, Custom App Development, Low-code Solutions, AI-Powered Solutions, Cloud Computing. Each has an anchor on Services.
- **4-D process:** the delivery process Discovery, Design, Development, Deployment, shown from "Your request" to "Launch", with what the client receives at each step.
- **Stats band:** the five figures "Experience you can count on": 25+ years of leadership experience, 24/7 global coverage, 20+ technology stacks, 8 service offerings, 2 offices. Confirmed by the business on 2026-09-28.
- **Email capture:** an inline band with one email field and one button. Four kinds: **demo capture** ("Book a demo"), **project capture** ("Start a project"), **subscribe capture** ("Subscribe", News), **talent capture** ("Join", Careers).
- **Contact form:** the form on the Book a demo page with two tabs: **Product demo** (`#form`) and **Outsourcing project** (`#project`).
- **Submission:** one successful send of a contact form or email capture.
- **Consent line:** the short text under every form that says how the data is used and ends with a Privacy policy link.
- **Story:** one dated News item with a category (Product, Company, Schools, Team). Product stories name the app. **Product update** is a Story in the Product category.
- **Talent network:** the list of job seekers who joined through the talent capture.
- **Placeholder:** content not verified by the business, prefixed `[Placeholder]` in both languages. A launch blocker.
- **Locale:** `en` or `vi`, carried in the URL prefix `/en/` or `/vi/`.
- **Motion toggle:** the discreet pause and play icon button in the Home hero that stops and restarts the silk animation.
- **Prototype:** the static HTML reference in `mockups/site-v3/`.
- **Demo day:** 2026-10-09, the challenge presentation.
- **Public launch:** the point where the site replaces xiontechs.com for real visitors. Distinct from Demo day. `[ASSUMPTION]`

## 4. Features

FRs are numbered globally. "Traces" names the spec section and AC IDs.

### 4.1 Navigation, layout and bilingual (EN/VI)

**Description:** Every page shares a sticky header, a footer and a locale. Products and Services open mega menus organised by app and by service, never by audience. The EN/VI switch is always in the header. Book a demo sits next to it above 640px and becomes the first mobile menu item at 640px and below. Realizes UJ-1 to UJ-4.

#### FR-1: Sticky header with mega menus
A visitor can reach Products (PXP, LXP, SXP, IoT Device Management, "All products"), Services (8 services, "See the process"), News, About and Careers from a sticky header on every page.

**Consequences (testable):**
- The header and both mega menus are text only (no product badges, service icons, arrows or caret icons); the mobile menu button reads "Menu"; Products and Services triggers are aligned with the plain links; the current page is marked with `aria-current="page"`.
- On hover-capable desktop, hover opens a mega menu and leaving closes it after 150ms; a click never closes a menu that hover just opened; Escape closes and returns focus to the trigger; opening one closes the other; a click outside closes (AC-NAV-3).
- A new product is added as one new row in the Products mega menu without restructuring.

Traces: EXP > Information Architecture (Header navigation), Component Patterns (Site header, Mega menu); AC-NAV-3.

#### FR-2: Mobile menu
A visitor below 1080px can open all navigation from a menu button.

**Consequences (testable):**
- The menu button has `aria-controls` and `aria-expanded`; Escape closes the menu and returns focus to the button (AC-NAV-4).
- Mega content expands inline inside the menu; background does not scroll while open.
- While open, focus is trapped in the open menu panel plus the header bar controls (logo link, EN/VI switch, Menu button), so the language switch stays reachable.

Traces: EXP > Component Patterns (Mobile menu), Accessibility Floor; AC-NAV-4.

#### FR-3: Book a demo always reachable
A visitor can reach "Book a demo" at every width.

**Consequences (testable):**
- Above 640px the Book a demo button sits next to the EN/VI switch in the header.
- At 640px and below it is the first item of the mobile menu, in button style, and is not shown in the header bar (AC-NAV-2).

Traces: EXP > Responsive & Platform (Header at every width); AC-NAV-2.

#### FR-4: Language switch
A visitor can switch between English and Vietnamese on any page.

**Consequences (testable):**
- The switch is two toggle buttons with `aria-pressed`, in a group labelled "Language", visible in the header at every width and never moved into the menu (AC-NAV-1).
- Switching routes to the same page under the other locale, keeps scroll position and typed form values, and updates `lang`, title and meta description.
- Every visible string, page title, meta description, alt text, screen-reader label and toast exists in EN and VI. Product and service names stay in English.
- Who writes and checks the Vietnamese copy is open question 17.

Traces: EXP > Component Patterns (Language switch), Bilingual (EN / VI), Voice and Tone; AC-NAV-1.

#### FR-5: Locale routing
The system serves every page under `/en/` and `/vi/`.

**Consequences (testable):**
- A bare `/` redirects to the saved locale, else to `/vi/` when the browser prefers Vietnamese, else to `/en/`.
- A locale in the URL always wins over the saved choice.
- The chosen locale is saved in an essential first-party locale cookie, so the server can redirect a bare `/` on the next visit. It is not kept in local storage, which the server cannot read.

Traces: EXP > Information Architecture (Locale routing).

#### FR-6: In-page anchors land visible
A visitor following an in-page link (`#process`, `#pxp`, `#values`, service anchors and others) sees the target heading fully below the sticky header and, on Products, the sub-nav.

**Consequences (testable):**
- Every anchor target uses `scroll-margin-top` from `{spacing.anchor-offset}` or `{spacing.anchor-offset-subnav}` (AC-NAV-5).
- Smooth scroll is used, and turned off under reduced motion.

Traces: EXP > Interaction Primitives, Component Patterns (Product sub-nav); AC-NAV-5.

#### FR-7: Footer
A visitor can reach Products, Services, Company links, both offices and the Privacy policy from a footer on every page.

**Consequences (testable):**
- Company column: About, Core values, FAQ (to `/about#faq`), News, Careers, Contact.
- Offices: Ho Chi Minh City (Viettel Tower, Floor 12, 285 CMT8, HCMC 70064, +84 908 107 552) and Dallas, USA (Texas, United States, +1 469 322 9899), phone numbers as `tel:` links.
- The bottom bar shows copyright, the Privacy policy link and the GET IT DONE tag.
- No Da Nang office and no second HCMC address appear anywhere.

Traces: EXP > Information Architecture (Footer); DES > Brand & Style.

#### FR-8: Skip link and breadcrumbs
A keyboard user can skip to main content, and a visitor on an inner page sees where they are.

**Consequences (testable):**
- "Skip to content" is the first focusable element and moves focus to `main`.
- Inner pages show breadcrumbs (Home link plus current page); Home does not.

Traces: EXP > Component Patterns (Skip link, Breadcrumbs).

#### FR-9: Not found page
A visitor on an unknown path sees a short message and links to Home, Products, Services and News in the current locale, with an HTTP 404 status. `[ASSUMPTION]` The 404 status code is inferred; the spec defines only the page content.

Traces: EXP > Information Architecture (Not found).

### 4.2 Home

**Description:** Home shows what the products do in the first five seconds and opens both front doors. The hero is dark with the silk cloth moving slowly and continuously, one primary CTA and the stats band inside it. All sections after the hero are light, except the navy 4-D band and the amber capture band that the colour rhythm allows. Realizes UJ-1, UJ-2, UJ-3.

#### FR-10: Dark hero with continuous silk and motion toggle
A visitor sees a dark `hero-silk` hero with the headline, a tablet and phone device frame, and a silk cloth background that ripples slowly and continuously.

**Consequences (testable):**
- A discreet round icon button at the top right of the hero pauses and plays the silk; its accessible name is always "Pause motion" or "Play motion" (VI "Tạm dừng chuyển động" / "Chạy chuyển động"), the text label slides out on hover or keyboard focus; the changing name carries the state (no `aria-pressed`), and the button is hidden without JavaScript or WebGL, or when the WebGL context is lost.
- A saved explicit choice (Play or Pause) wins over `prefers-reduced-motion`; with no saved choice, reduced motion starts the silk paused. It also pauses when off screen or when the tab is hidden (`visibilitychange`).
- The canvas is `aria-hidden`; without WebGL or JavaScript the static navy and amber glow fallback shows.

Traces: EXP > Motion (Home hero background), Component Patterns (Motion toggle); DES > Colors (`hero-silk`), Components (Motion toggle); WCAG 2.2.2.

#### FR-11: One primary hero CTA
A visitor sees exactly one primary button in the hero, "Explore our products", which goes to Products.

Traces: EXP > Information Architecture (Home), Component Patterns (Button: one primary button per group).

#### FR-12: Stats band inside the hero
A visitor sees "Experience you can count on" at the bottom of the hero with five figures: 25+ years of leadership experience, 24/7 global coverage, 20+ technology stacks, 8 service offerings, 2 offices (Ho Chi Minh City and Dallas).

**Consequences (testable):**
- Numbers count up once over 1.4s when 60% visible; "24/7" does not count; screen readers get only the final value; reduced motion shows final values.
- The band is one shared component reused on Services and About.

Traces: EXP > Component Patterns (Stats band); DES > Components (Stats band).

#### FR-13: Two front doors
A visitor sees the Products door and the Services door directly under the hero, overlapping its bottom edge.

**Consequences (testable):**
- Each door is one link (Products door to Products, Services door to Services); chips inside are text, not links.

Traces: EXP > Component Patterns (Front door); DES > Layout & Spacing (Home hero).

#### FR-14: Product bento, services, 4-D process, news and demo capture
A visitor sees, in order after the doors: the four-app bento ("Four apps. One school day."), the eight services, the 4-D process, the latest three stories and a demo capture.

**Consequences (testable):**
- Each product tile is one stretched link to its Products anchor, with no interactive element inside the link (AC-A11Y-4).
- Each service card links to its anchor on Services.
- With no stories, the news grid hides and "See all news" stays.

Traces: EXP > Information Architecture (Home), Component Patterns (Product tile, Service card, News card), State Patterns; AC-A11Y-4.

### 4.3 Products

**Description:** One page presents all four products under an amber hero, with a sticky sub-nav and a section per product. Realizes UJ-1, UJ-3.

#### FR-15: Product sub-nav
A visitor can jump between PXP, LXP, SXP, IoT and Updates with a sticky sub-nav under the header.

**Consequences (testable):**
- The section in view is highlighted; at the end of the page Updates is highlighted.
- The sub-nav scrolls horizontally on narrow screens; anchors land visible (AC-NAV-5).

Traces: EXP > Component Patterns (Product sub-nav); AC-NAV-5.

#### FR-16: PXP story phone
A visitor can tap five tabs (Attendance, Grades, Messages, Payments, Events) and see the matching screen crossfade in.

**Consequences (testable):**
- Tabs follow the ARIA tab pattern; inactive screens cannot take focus and are hidden from assistive tech (AC-A11Y-3).
- The four PXP features and App Store and Google Play buttons are shown; store buttons stay `[Placeholder]` until real links are confirmed.

Traces: EXP > Component Patterns (PXP story phone), Key Flows (Flow 3); AC-A11Y-3.

#### FR-17: LXP, SXP and IoT sections
A visitor sees each web app in a browser frame with its audience, four features and its web address.

**Consequences (testable):**
- The URL pill shows the real app address once confirmed and `[Placeholder]` until then.
- A missing media asset shows an empty media frame, never a broken image.

Traces: EXP > Component Patterns (Browser frame, Media frame), State Patterns (Media missing).

#### FR-18: Product updates
A visitor sees three Product stories under `#updates` and a "See all news" link.

**Consequences (testable):**
- With no Product stories, the grid hides and the link stays.

Traces: EXP > Information Architecture (Products), State Patterns.

#### FR-19: Real product media in device frames
A visitor sees real product screens or short product clips in device frames.

**Consequences (testable):**
- Clips never autoplay with sound, show a poster frame and have visible play and pause controls; a muted autoplay clip stops after 5s unless played.
- Devices float for one cycle under 5s, then rest; pointer tilt up to 8 degrees on hover-capable devices only.

Traces: EXP > Motion (Devices), Component Patterns (Device frame).

### 4.4 Services

**Description:** Services lets a company judge the delivery team and start a project. Navy hero, stats, eight services, three ways to work, the 4-D process and industries. Realizes UJ-2.

#### FR-20: Services hero with live office clocks
A visitor sees "Start a project" and "See our 4-D process" plus the live local time in Ho Chi Minh City and Dallas.

**Consequences (testable):**
- Times use IANA zones `Asia/Ho_Chi_Minh` and `America/Chicago`, refresh every 30 seconds, and show the zone label (GMT+7, US Central) rendered on the server before JavaScript runs.

Traces: EXP > Component Patterns (Office card, Clock strip), State Patterns.

#### FR-21: Eight services with anchors
A visitor sees the eight services, each with its description and tags, at the anchors `#product-engineering`, `#ai-analytics`, `#co-creation`, `#staffing`, `#custom-apps`, `#low-code`, `#ai-solutions`, `#cloud`.

Traces: EXP > Information Architecture (Service anchors); AC-NAV-5.

#### FR-22: Three ways to work with us
A visitor sees Dedicated team, End-to-end delivery and Co-creation, each naming the service it runs through.

Traces: EXP > Information Architecture (Services), Key Flows (Flow 2).

#### FR-23: 4-D process flow
A visitor sees the 4-D process at `#process` from "Your request" to "Launch", with what they receive at each step.

**Consequences (testable):**
- At 30% visible the track fills with amber over 2.4s, steps 01 to 04 enter in turn and a dot travels once and rests at Launch; reduced motion shows the final state.
- "You receive" rows align across the four cards (AC-UI-2).
- Below 1080px the track and end nodes hide and steps stack.
- One shared component serves Home and Services.

Traces: EXP > Component Patterns (Process flow), Motion; AC-UI-2.

#### FR-24: Industries and time zones
A visitor sees EdTech, Healthcare, Logistics and Private Equity as static chips, plus the USA, Europe and Australia time-zone note.

Traces: EXP > Information Architecture (Services), Component Patterns (Industry chip).

### 4.5 News

**Description:** Dated short stories about products, schools, team and company, filtered by category, with a detail page per story. Content comes from Sanity (see FR-27). Realizes UJ-1, UJ-4.

#### FR-25: Category filters
A visitor can filter stories by All, Product, Company, Schools and Team.

**Consequences (testable):**
- Chips are toggle buttons with `aria-pressed`; exactly one is active; pressing the active chip does nothing; filtering is instant with no reload.
- The result count is announced ("Showing 3 stories").
- No matches shows "No stories in this category yet." with a "Show all" button that resets to All.

Traces: EXP > Component Patterns (Filter chips), State Patterns (News).

#### FR-26: Story detail page
A visitor can open a story at `/news/[slug]` with breadcrumbs, H1, date and category tag, photo, body, a related product link and "Back to News".

**Consequences (testable):**
- Dates show `18 SEP 2026` in EN and `18/09/2026` in VI, in mono type.
- Each story has its own title, meta description and Open Graph image.

Traces: EXP > Information Architecture (News story), Bilingual (EN / VI).

#### FR-27: Editors publish stories without a developer
A XionTechs editor can create, edit and publish a story in both languages in Sanity Studio without a code change. `[ASSUMPTION]` Implied by the lead's decision to keep a CMS for Blog and Careers. The CMS is Sanity (chosen 2026-09-28, `docs/spikes/cms-spike.md`).

**Consequences (testable):**
- A published story appears on the site through webhook revalidation, with no deploy.

Traces: `AGENTS.md` (Tech stack, CMS); `docs/ai-log.md` (2026-09-26 Tech stack); `docs/spikes/cms-spike.md`.

### 4.6 About

**Description:** Who XionTechs is: story, stats, six core values, leadership and two offices. Realizes UJ-2.

#### FR-28: Story, stats and core values
A visitor sees the company story, the stats band and the six core values at `#values` (Startup Spirit, Client Centricity, Integrity First, Innovation Driven, "Get IT Done" Attitude, People-Centered Culture) in the office-banner wording.

Traces: EXP > Information Architecture (About); `.memlog.md` (offices and core values decision).

#### FR-29: Leadership grid only with real people
A visitor sees the leadership grid (photo, name, role) only once real people are confirmed by the business. No names from the old site are reused.

Traces: EXP > Component Patterns (Person card), Inspiration & Anti-patterns.

#### FR-30: Office cards
A visitor sees both offices with live local time, address and a `tel:` link.

Traces: EXP > Component Patterns (Office card).

#### FR-46: FAQ
A visitor finds answers to nine common questions (what XionTechs does, industries, trying the school products, time zones, when the solution is shaped, expected results, data security, feedback, measuring value) on `/about#faq`, in both languages, reached from the footer "FAQ" link. Answers reuse the facts on the current xiontechs.com FAQ page.

**Consequences (testable):**
- Each question expands and collapses with mouse, Enter or Space; several can be open at once.
- The page carries FAQPage structured data with the same questions and answers, in the page's language (Vietnamese on `/vi/about`).
- The answer to "How do you keep our data secure?" starts with `[Placeholder]` in both languages until the business supplies real facts (hosting, access control, certifications).

Traces: EXP > Information Architecture (About), Component Patterns (FAQ); DES > Components (FAQ).

### 4.7 Careers

**Description:** Attract engineers, testers and designers and grow the talent network. Realizes UJ-4.

#### FR-31: Culture, benefits and Life at XionTechs
A visitor sees the culture section, four benefits ("Why you'll grow here") and Life at XionTechs photos at `#life`.

**Consequences (testable):**
- Photos are real team photos; until supplied, placeholder frames are shown and never shipped at public launch.

Traces: EXP > Information Architecture (Careers), Component Patterns (Placeholder frame).

#### FR-32: Open roles
A visitor sees open roles when there are any, or "No open roles right now." with a route to `#talent` when there are none.

**Consequences (testable):**
- An editor can add or close a role in Sanity Studio without a code change. `[ASSUMPTION]` Same CMS dependency as FR-27.
- No invented job openings are shown.

Traces: EXP > Component Patterns (Open roles panel), State Patterns (Careers); `AGENTS.md` (Hard rules).

### 4.8 Contact form and email capture

**Description:** One contact page serves both intents; every other page has an inline email capture band. Realizes UJ-1, UJ-2, UJ-4.

#### FR-33: Email capture on every page
A visitor can leave an email in a capture band on every page except these, which have no capture band: Book a demo (`/demo`, which is the form), Not found, Privacy policy and News story (`/news/[slug]`).

**Consequences (testable):**
- Validates on submit; an invalid email shows "Please enter a valid email address.", sets `aria-invalid="true"`, links the error with `aria-describedby`, returns focus to the field, and clears as the user types (AC-A11Y-5).
- On navy bands the field focus ring uses `{colors.focus-on-navy}` (AC-A11Y-2).
- While sending, the button is disabled and reads "Sending..." ("Đang gửi..."); a send failure keeps the email and shows an inline error with a retry.
- No modal pop-ups; captures are inline bands.

Traces: EXP > Component Patterns (Email capture), Interaction Primitives; AC-A11Y-2, AC-A11Y-5.

#### FR-34: Demo and project capture prefill the contact form
A visitor who submits a valid demo capture lands on `/demo#form` (Product demo tab) and a valid project capture lands on `/demo#project` (Outsourcing project tab, scrolled to the form), with the email prefilled in both.

**Consequences (testable):**
- The email travels through session storage or a server session, never in the URL (no query string, no hash).
- If session storage is unavailable, there is no prefill and the visitor types the email on `/demo`.
- The Outsourcing tab opens and is scrolled into view for a project capture (AC-FORM-2).

Traces: EXP > Component Patterns (Email capture); AC-FORM-2.

#### FR-35: Subscribe and join in place
A visitor who submits a valid subscribe or talent capture sees "Thanks, you're subscribed." or "Thanks, you're on the list." replace the row in a `role="status"` region.

Traces: EXP > Component Patterns (Email capture), Voice and Tone.

#### FR-36: Two-tab contact form
A visitor can send a Product demo or an Outsourcing project request from one form.

**Consequences (testable):**
- The URL hash picks the tab on load (`#project` opens Outsourcing; any other opens Product demo).
- Fields follow the Contact form fields table in EXPERIENCE.md: Full name, Work email, School or company are required; Message is at most 2,000 characters ("Please keep your message under 2,000 characters."); PXP is checked by default.
- Hidden-tab fields are not validated, not focusable (AC-A11Y-3) and not submitted, but keep their values.
- Submit marks every invalid visible field and moves focus to the first.
- While sending, the button is disabled and reads "Sending..." ("Đang gửi..."); success shows "Thank you!" and "We will be in touch soon."; a send failure keeps all values and shows an error above the button with a retry.

Traces: EXP > Component Patterns (Contact form), Contact form fields, State Patterns; AC-A11Y-3, AC-A11Y-5.

#### FR-37: Preferred date not in the past
A visitor cannot choose a demo date before today in their own time zone; the picker starts at today and a past value shows "Please choose today or a later date."

Traces: EXP > Contact form fields; AC-FORM-1.

#### FR-38: Submissions delivered and protected
The system delivers every Submission (demo, project, subscribe, join) to a XionTechs destination and stops spam.

**Consequences (testable):**
- Server-side validation mirrors the client rules: required fields, email format, message up to 2,000 characters, preferred date today or later. An invalid Submission is rejected with the same wording as the client.
- A hidden honeypot field (`tabindex="-1"`, `aria-hidden="true"`, `autocomplete="off"`) rejects automated submissions.
- A server-side rate limit keyed on IP plus email allows 5 Submissions per 10 minutes per key, so a shared office IP is not blocked outright. `[ASSUMPTION]`
- Each Submission reaches the chosen destination. `[ASSUMPTION]` Destination (inbox or CRM) is an open question (section 12), as are the mail sender service and the shared rate-limit store (open questions 18 and 19).

Traces: EXP > Component Patterns (Contact form), Open Questions (Form destination).

#### FR-39: One CTA label per intent
The site uses "Book a demo" only for the product demo intent and "Start a project" only for the project intent, with the EN and VI labels from the CTA table.

Traces: EXP > Voice and Tone (CTA labels).

### 4.9 Privacy and legal

**Description:** Forms collect personal data, so Vietnam PDPD (Decree 13/2023) applies. Realizes UJ-1, UJ-2, UJ-4.

#### FR-40: Consent line under every form
A visitor sees a consent line under every form that states the single use of the data and ends with a "Privacy policy" link, using the exact wording in EXPERIENCE.md Voice and Tone.

Traces: EXP > Voice and Tone (Wording to reuse).

#### FR-41: Privacy policy page
A visitor can read the privacy policy at `/privacy`, linked from every consent line and the footer, covering what is collected, how it is used, how long it is kept and the visitor's rights.

**Consequences (testable):**
- The cookies section lists the essential first-party locale cookie (FR-5) and says no non-essential cookies are set without consent.
- No form goes live at public launch before the policy text is real (not `[Placeholder]`).

Traces: EXP > Information Architecture (Privacy policy), Open Questions; code review finding 11.

#### FR-42: Cookie consent if non-essential cookies are added
If analytics or other non-essential cookies are added, the system shows a consent banner with decline as the default before setting them.

Traces: EXP > Open Questions (Analytics and cookies).

### 4.10 SEO and metadata

**Description:** Search is how Lan, Quân and Hà arrive (UJ-1 to UJ-3).

#### FR-43: Per-page metadata
Each page, in each locale, has its own title, meta description, canonical URL, Open Graph tags and favicon.

Traces: EXP > Foundation (Rendering); code review (Deferred: Page metadata).

#### FR-44: hreflang pairs
Each page links its `/en/` and `/vi/` versions with `hreflang`, plus `x-default` pointing to `/en/`.

Traces: EXP > Information Architecture (Locale routing).

#### FR-45: Server-rendered content and structured data
Header, footer and News are rendered on the server; Home carries Organization and app JSON-LD.

**Consequences (testable):**
- Page content is readable with JavaScript disabled; reveal animations are an enhancement only.

Traces: EXP > Foundation (Rendering), State Patterns (No JavaScript).

## 5. Cross-Cutting Non-Functional Requirements

#### NFR-1: WCAG 2.2 AA on every page, both locales
- Text contrast at least 4.5:1 (3:1 large text), icons and field borders at least 3:1; amber text on light surfaces uses `{colors.amber-text}` `#8A6700`; `{colors.amber-decor}` is never text (AC-A11Y-1).
- Visible `:focus-visible` ring on every section colour (AC-A11Y-2).
- Hidden content not focusable (AC-A11Y-3); no interactive element inside a link (AC-A11Y-4); errors announced and linked (AC-A11Y-5).
- One H1 per page; tab order follows reading order; touch targets at least 24 x 24px; meaningful alt text in both languages.

Traces: EXP > Accessibility Floor; DES > Colors.

#### NFR-2: Motion is controllable (WCAG 2.2.2)
- The Home silk runs continuously and always has the visible motion toggle (FR-10); it pauses when off screen or when the tab is hidden.
- Every other decorative loop (inner hero aurora and strand ribbon, device float, muted clips) stops within 5s.
- Under `prefers-reduced-motion: reduce` there is no animation or transition anywhere, clips never autoplay, and the Home silk starts paused unless the visitor has saved an explicit choice: a saved Play or Pause wins over `prefers-reduced-motion`.

Traces: EXP > Motion; WCAG 2.2.2.

#### NFR-3: Personal data under Vietnam PDPD (Decree 13/2023)
- Data is collected only through the forms, only for the purpose in each consent line.
- Personal data never appears in URLs.
- A retention period is defined before public launch. `[ASSUMPTION]` Owner and period are not yet decided.
- No non-essential cookies without opt-in consent (FR-42). The locale cookie (FR-5) is essential and listed on the privacy page.

Traces: EXP > Foundation (Stakes), Open Questions.

#### NFR-4: Performance
- Icon sets and third-party scripts never block rendering (AC-PERF-1).
- Core Web Vitals "good" at the 75th percentile on mobile: LCP at most 2.5s, INP at most 200ms, CLS at most 0.1. `[ASSUMPTION]`
- Fonts use `display: swap` with system fallbacks and load the `vietnamese` subset.
- The silk canvas pauses when off screen.

Traces: EXP > Foundation (Performance), State Patterns; AC-PERF-1.

#### NFR-5: SEO
- `/en/` and `/vi/` URLs with `hreflang` and `x-default` (FR-44); per-page metadata (FR-43); server rendering (FR-45).
- A sitemap covering both locales. `[ASSUMPTION]`

Traces: EXP > Foundation, Information Architecture.

#### NFR-6: Browser and device support
- Current evergreen browsers on desktop and mobile. `[ASSUMPTION]` Read as the latest two versions of Chrome, Edge, Safari (macOS and iOS) and Firefox, plus Chrome on Android.
- Layouts work from 320px to wide desktop at the breakpoints 1080px, 900px and 640px; Vietnamese strings never truncate buttons.

Traces: EXP > Responsive & Platform, Bilingual (EN / VI).

#### NFR-7: Content integrity
- No Lorem Ipsum; no invented testimonials, client logos, stats, team members or job openings.
- Unverified content starts with `[Placeholder]` in both languages; `grep -rn "\[Placeholder\]"` over `src/` and the build output (excluding planning artifacts, tests and the check script) returns nothing before public launch.

Traces: `AGENTS.md` (Hard rules); EXP > Voice and Tone.

#### NFR-8: Engineering quality gate
- Before every PR: lint, typecheck, unit tests, 100% line coverage on changed lines, branch coverage at least 80% per changed file, Playwright smoke, build, and the local SonarQube gate pass. SonarQube runs locally only.

Traces: `AGENTS.md` (Commands, Hard rules); `docs/ai-log.md` (2026-09-28 entries).

## 6. Current UI Decisions (prototype v3.4, 2026-09-28)

Captured from the latest prototype so stories do not regress them.

- **Home hero:** dark `hero-silk`; the silk cloth moves slowly and continuously (time scale 0.35 in the prototype `site.js`); a discreet round icon pause button at the top right, label shown on hover or focus.
- **One primary CTA** in the hero: "Explore our products".
- **Stats inside the hero:** "Experience you can count on": 25+ years, 24/7, 20+ stacks, 8 services, 2 offices (Ho Chi Minh City and Dallas).
- **Light after the hero:** every section after the Home hero is light, apart from the navy 4-D band and the amber capture band allowed by the colour rhythm.
- **Header:** text-only nav (no carets); the EN/VI switch with Book a demo right next to it; Book a demo moves into the mobile menu at 640px and below; EN/VI never moves.
- **Colour rhythm instead of dark mode:** each page has at least one navy band and at most one full-width amber band; each page hero uses a different mix (light, navy, amber).
- **Type:** Unbounded (display), Lexend Exa (brand caps), Be Vietnam Pro (body), JetBrains Mono (dates and data), all with the Vietnamese subset.

Traces: DES > Brand & Style, Colors, Typography, Layout & Spacing, Components; `mockups/site-v3/index.html`, `css/site.css`, `js/site.js`.

## 7. Non-Goals (Explicit)

- Not an app portal: no sign-in, accounts or links into PXP, LXP, SXP or IoT for existing users.
- Not a shop: no e-commerce, pricing or online payment.
- No dark mode toggle; the colour rhythm replaces it (the business may reverse this later).
- No audience-based navigation; Products is organised by app.
- No carousels, autoplaying sound, infinite scroll or modal email pop-ups.
- No AI-generated illustrations or photos.
- No reuse of the old WordPress theme, CSS, images or layout.

## 8. MVP Scope

### 8.1 In Scope (v1)

- Ten page types in EN and VI: Home, Products, Services, News, News story, About, Careers, Book a demo (Contact), Privacy policy, Not found.
- Header, mobile menu, footer, locale routing, EN/VI switch.
- Four email capture kinds and the two-tab contact form, with delivery, honeypot and rate limit.
- News stories and Careers roles from Sanity, edited in Sanity Studio (chosen 2026-09-28, `docs/spikes/cms-spike.md`). The Demo-day plan in the epics says which parts land before Demo day.
- SEO metadata, hreflang, JSON-LD, all 16 acceptance criteria.

### 8.2 Out of Scope for v1

- Login, e-commerce, dark mode toggle, audience-based navigation (see section 7).
- Job application forms or CV upload; the talent capture collects email only. `[ASSUMPTION]`
- Newsletter sending itself; v1 only collects subscribers. `[ASSUMPTION]`
- Analytics and non-essential cookies, unless FR-42 consent is built with them.
- Prototype-only tooling (screenshot slots that accept click, drop or paste).

### 8.3 Dependencies

- **Sanity setup:** a free Sanity project with proven reads, env vars, CORS origins, `useCdn` with webhook revalidation, the EN/VI content model and the Studio location (`docs/spikes/cms-spike.md`, Open work). Blocks FR-26, FR-27, FR-32 and media uploads (AC-FORM-3).
- **Services to pick in architecture (free tier):** a mail sender and a shared store for rate limits on serverless (open questions 18 and 19). Block delivery and rate limiting in FR-38.
- **Real content from the business:** privacy policy text, store links, app web addresses, product screens or clips, real news stories, leadership, team photos, Dallas street address, contact email, logo SVG.
- **Form destination:** inbox or CRM for FR-38.
- **Hosting:** Vercel, with a public URL by Demo day.

**[NOTE FOR PM]** Demo day and public launch pull in different directions. Demo day needs a public URL on 2026-10-09; public launch needs zero `[Placeholder]` markers and a real privacy policy, which depend on content the team does not control. This PRD treats them as two gates (see SM-1 and SM-2). Confirm that a Demo-day build may still show `[Placeholder]` markers.

## 9. Success Metrics

Measurement: Submissions are counted at the form destination on the server, so no analytics cookie is needed. Lighthouse and axe-core run locally before release on every page in both locales (there is no CI yet; see open question 20). All targets are proposals, since the business has set none.

**Primary**
- **SM-1: Demo-day readiness.** Public URL live on Vercel by 2026-10-09 with every Demo-day must-have story in the epics' Demo-day plan done in EN and VI; the after-demo stories, the remaining page types and all 16 acceptance criteria follow before public launch. Validates FR-1 to FR-46.
- **SM-2: Public launch readiness.** `grep -rn "\[Placeholder\]"` over `src/` and the build output (excluding planning artifacts, tests and the check script) returns 0 and the privacy policy is real before public launch. `[ASSUMPTION]` Target date to be set by the business. Validates FR-41, NFR-7.
- **SM-3: Demo requests.** At least 8 Product demo Submissions per month by the third month after public launch. `[ASSUMPTION]` Validates FR-34, FR-36.
- **SM-4: Project inquiries.** At least 5 Outsourcing project Submissions per month by the third month after public launch. `[ASSUMPTION]` Validates FR-34, FR-36.

**Secondary**
- **SM-5: Talent network sign-ups.** At least 20 per month after public launch. `[ASSUMPTION]` Validates FR-35.
- **SM-6: Lighthouse scores.** Performance at least 90 on mobile, Accessibility 100, SEO 100, Best Practices at least 95, on every page in both locales. `[ASSUMPTION]` Validates NFR-1, NFR-4, NFR-5.
- **SM-7: Accessibility defects.** Zero serious or critical axe-core violations and zero failing AC-A11Y criteria in the local pre-release run. `[ASSUMPTION]` Validates NFR-1.
- **SM-8: Core Web Vitals.** Mobile p75 LCP at most 2.5s, INP at most 200ms, CLS at most 0.1. `[ASSUMPTION]` Validates NFR-4.

**Counter-metrics (do not optimise)**
- **SM-C1: Unusable Submissions.** Share of Submissions that are spam or cannot be followed up; keep under 10%. Counterbalances SM-3 and SM-4: do not raise volume by loosening validation, adding pop-ups or dropping the honeypot. `[ASSUMPTION]`
- **SM-C2: Content honesty.** Any invented stat, person, client or role on the site counts as a failure, whatever it does to conversion. Counterbalances SM-3 to SM-5.
- **SM-C3: Motion versus speed.** The silk and other motion must not push SM-6 or SM-8 below target; if they do, motion is reduced, not the targets. Counterbalances FR-10.

## 10. Change Control

The prototype, the UX specs, this PRD and the user stories must stay in step.

1. Any change to the HTML prototype (`mockups/site-v3/`) is checked by **Amber Do** (UX/BA owner) before it is accepted.
2. After approval, `DESIGN.md` and `EXPERIENCE.md` are updated first, because they win over the prototype on any conflict.
3. This PRD is then updated (FRs, NFRs, section 6) and its `updated` date changed.
4. The affected user stories and their acceptance criteria are updated.
5. A PR is opened into `develop` with all of the above, and a line is added to `docs/ai-log.md` when an AI tool made or proposed the change.

## 11. Risks

- **Short timeline** (7 to 8 build days to Demo day 2026-10-09, 2 developers, about 15 developer-days): the Sanity setup and real content can slip. Mitigation: the Demo-day plan in the epics (must-have versus after demo, two parallel tracks); news and roles show their empty states until Sanity content lands; placeholders stay grep-able.
- **WebGL silk cost** on low-end phones can hurt LCP and INP. Mitigation: pause off screen, static fallback, SM-C3.
- **Unverified scraped facts:** the AI has misread facts before (the contact email came back as an obfuscated string). Mitigation: a human verifies every fact before it loses its `[Placeholder]` tag.
- **Personal data without a policy:** forms could go live before the privacy policy. Mitigation: FR-41 gate.

## 12. Open Questions

1. **Dallas address:** only "Texas, United States" is known; a street address is needed.
2. **Contact email:** no public contact email is defined yet.
3. **Leadership:** real names, roles and photos.
4. **Privacy policy:** text needed before any form goes live (PDPD); also who owns it.
5. **Store links:** real App Store and Google Play links for PXP (blocks UJ-3).
6. **CMS choice:** resolved 2026-09-28: Sanity (`docs/spikes/cms-spike.md`). Its setup (reads, env vars, CORS, revalidation, EN/VI model, Studio location) is epics Story 1.8.
7. **Real app URLs:** LXP, SXP and IoT web addresses.
8. **Still `[Placeholder]`:** news stories, leadership, team photos, partner-school logos (with permission), product screenshots or clips, store links, app web addresses, the privacy policy and the news email frequency. (Stats including 24/7, product and service descriptions, feature lists, careers benefits and open-roles text were confirmed by the business on 2026-09-28.)
9. **Analytics and cookies:** whether to add analytics; if so, a consent banner with decline as default. How long captured emails are kept.
10. **Form destination:** which inbox or CRM receives demo, project, subscribe and join Submissions.
11. **No-JavaScript behaviour** for the capture redirect and the two-tab contact form.
12. **About page capture:** heading "Let's work together." but the button is "Book a demo" to the Product demo tab. Confirm the intent. The About stats band also shows "4 School products ready to demo" instead of "8 Service offerings"; confirm it is intended.
13. **Logo:** an SVG master is needed for retina and navy surfaces.
14. **Dark mode:** dropped in favour of the colour rhythm; the business may reverse this.
15. **Mobile Book a demo breakpoint:** resolved 2026-09-28. Book a demo sits next to the EN/VI switch above 640px and is the first mobile menu item at 640px and below (the older 1080px log entry is superseded).
16. **Demo day versus public launch:** may the Demo-day build show `[Placeholder]` markers (see the note in section 8.3)?
17. **Vietnamese copy:** written and checked by Amber Do (to confirm), before launch. Needed for FR-4.
18. **Mail sender service** (free tier, chosen in architecture): sends contact form and capture Submissions to the destination (FR-38). No vendor is decided.
19. **Shared store for rate limits on serverless** (free tier, chosen in architecture): holds the FR-38 rate-limit counters across serverless instances. No vendor is decided.
20. **CI pipeline:** there is no CI yet, so axe-core, Lighthouse and the launch content check run locally before release. Setting up CI is after-demo work.

## 13. Assumptions Index

- Section 2.1: editors of news and roles are non-developers.
- Section 2.2: no sign-in or app-login links on the website in v1.
- Section 3: "Public launch" is a separate gate from Demo day.
- FR-9: unknown paths return an HTTP 404 status.
- FR-27: editors publish stories without a developer (CMS).
- FR-32: editors add and close roles without a code change (CMS).
- FR-38: the Submission destination is to be decided.
- NFR-3: a retention period and owner will be set before public launch.
- NFR-4: Core Web Vitals "good" thresholds as targets.
- NFR-5: a sitemap covers both locales.
- NFR-6: "current evergreen browsers" means the latest two versions of the main browsers.
- FR-38: the rate limit allows 5 Submissions per 10 minutes per IP plus email.
- Section 8.2: talent capture collects email only; no CV upload.
- Section 8.2: v1 collects subscribers but does not send newsletters.
- SM-2: public launch date to be set by the business.
- SM-3: at least 8 demo requests per month.
- SM-4: at least 5 project inquiries per month.
- SM-5: at least 20 talent network sign-ups per month.
- SM-6: Lighthouse targets.
- SM-7: zero serious or critical axe violations.
- SM-8: Core Web Vitals targets.
- SM-C1: unusable Submissions under 10%.
