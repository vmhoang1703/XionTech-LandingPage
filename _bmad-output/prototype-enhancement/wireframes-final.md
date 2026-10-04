# Prototype wireframes: final

Owner: Amber Do. The prototype as it is now (`prototype/` on `docs/prototype-enhancement`).
Each section title ends, in brackets, with the change that shaped it; `enhancement-log.md` has the details of every
entry. Site-wide rows (every page) apply to every section too, so "content unchanged" means the section's content did not
change. The first draft is `wireframes-original.md`. Regenerated whenever an enhancement is approved.

Each page is one frame (double line), drawn top to bottom as it appears on a desktop screen. Inside it, each section is a
block (single line); columns and cards that sit side by side on screen sit side by side here (at most three per row; grids
with more columns continue on the next row). On phones every block stacks into one column. English text only; every string
also has a Vietnamese version in the prototype.

## Changes since the original

| Where | Original (first draft) | Now | Entry |
| --- | --- | --- | --- |
| Header, every page | Menu in the middle, Book a demo button, EN/VI toggle, Products and Services mega menus | Menu on the right, no Book a demo button, EN/VI dropdown last | Batch 1 |
| Header, every page | Products mega menu; mist pill on hover; "Menu" text button on small screens | Products is a plain link (Services already was); amber underline under the word on hover; hamburger icon before the language dropdown; no header border | ENH-002 |
| Every page | Small labels above headings; some text under 11.5px; some controls under 44px | No labels above headings; text at least 11.5px; controls at least 44px; one tokenised stylesheet | Batch 1 |
| Every page | 112px around sections; 48px under a heading; 14px between a heading and its description; content revealed on its own | 64px around sections (48px on phones); 24px under a heading; 20px between a heading and its description; each section's heading appears first, then its content | ENH-004, ENH-006, ENH-009 |
| Home, hero | Underlined "connected"; five stats; silk on the right only | Amber "connected"; no button glow; two stats ("25+ Years", "8") that count up from 0; silk across the hero, quieter on the left, fading out before the stats; bigger headline on small screens | ENH-002 |
| Home, below the hero | Two front doors overlapping the hero | Removed here; their content is the first row of Why XionTechs | ENH-002, ENH-004 |
| Home, Our partners | — | New: placeholder logo strip that scrolls in a loop (pauses on hover, focus or tap); heading left-aligned | ENH-003, ENH-008 |
| Home, Why XionTechs | — | New in Batch 1 (four tiles); rebuilt as a four-card bento: Products with app logos, Delivery with live clocks, Industries with a "+3" reveal, Outsourcing services; a small "Get IT Done" line | Batch 1, ENH-004 |
| Home, Case studies | — | New (ENH-003); now "Work built with our partners.": a full-width slider of six placeholder partner cards (partner name, description, "View case study") with carousel dots | ENH-003, ENH-006 |
| Home, process | "From your request to launch, in four steps." under a small label, four cards | "How we approach.": a light row of five steps (Discovery to Deployment), one short line each, joined by a line, with "See how we work" to Services, on a blue gradient | Batch 1, ENH-009, ENH-012 |
| Services, process | "Our 4-D process": four cards | "How we work.": the full five-step component (layered diagram, step tabs with the chosen step highlighted, detail panel) on a blue gradient; About and Contact say five steps | ENH-011 |
| Home, products | Four-app bento with phone mockups, right after the doors | "What we build.": six equal app cards (PXP, LXP, SXP, IoT, AI Tutor, AI Timetable) in a row with back and forward buttons, below the process | Batch 1, ENH-005, ENH-008, ENH-009 |
| Home, eight services | Eight service cards | Removed from Home (they stay on Services) | Batch 1 |
| Home and News, news | "Latest from XionTechs." with a placeholder note; pills "Product · PXP" | One-line intro with "See all news" on the same row; an app's story shows only the app name in its pill | ENH-007 |
| Home, last section | Amber "See it working at your school." email band (Book a demo) | Amber contact form "Have something you want to build?"; example phone number as placeholder; quiet button | ENH-001, ENH-010 |

**Legend:** `H1`–`H4` heading · `Text` paragraph or caption · `•` list item · `[IMAGE: …]` image or screenshot
block with its intended size · `[BUTTON: …]` button · `[LINK: …]` text link · `[WHOLE CARD IS A LINK]` the whole card
is clickable · `[FIELD: …]` form field · `→` where it goes.

## Pages

- [Home](#home) (`index.html`)
- [Products](#products) (`products.html`)
- [Services](#services) (`services.html`)
- [About](#about) (`about.html`)
- [News](#news) (`news.html`)
- [News story](#news-story) (`news-story.html`)
- [Careers](#careers) (`careers.html`)
- [Job](#job) (`job.html`)
- [Contact](#contact) (`demo.html`)
- [Privacy policy](#privacy-policy) (`privacy.html`)
- [Not found (404)](#not-found-404) (`404.html`)

## Header and footer (on every page)

```text
┌─ Header · sticky, glass · [Batch 1 · ENH-002] ───────────────────────────────────────────────────────────┐
│ [LINK: Skip to content → #main]                                                                          │
│ [LINK: XionTechs home → index.html]                                                                      │
│ [LINK: Products → products.html]                                                                         │
│ [LINK: Services → services.html]                                                                         │
│ [LINK: News → news.html]                                                                                 │
│ [LINK: About → about.html]                                                                               │
│ [LINK: Careers → careers.html]                                                                           │
│ [BUTTON: Menu (small screens only; opens the menu)]                                                      │
│ [BUTTON: EN]                                                                                             │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─ Footer · dark navy · [content unchanged] ───────────────────────────────────────────────────────────────┐
│ ┌────────────────────────────────┐ ┌────────────────────────────────┐ ┌────────────────────────────────┐ │
│ │ [LINK: XionTechs logo →        │ │ H4: Products                   │ │ H4: Services                   │ │
│ │   index.html]                  │ │ [LINK: PXP →                   │ │ [LINK: Product Engineering →   │ │
│ │ Text: Education technology     │ │   products.html#pxp]           │ │ services.html#product-engineer │ │
│ │   products and software        │ │ [LINK: LXP →                   │ │ ing]                           │ │
│ │   delivery services for        │ │   products.html#lxp]           │ │ [LINK: AI-Driven Analytics →   │ │
│ │   schools and businesses.      │ │ [LINK: SXP →                   │ │   services.html#ai-analytics]  │ │
│ │                                │ │   products.html#sxp]           │ │ [LINK: Staffing Service →      │ │
│ │                                │ │ [LINK: IoT Device Management → │ │   services.html#staffing]      │ │
│ │                                │ │   products.html#iot]           │ │ [LINK: Low-code Solutions →    │ │
│ │                                │ │ [LINK: Product updates →       │ │   services.html#low-code]      │ │
│ │                                │ │   products.html#updates]       │ │ [LINK: Cloud Computing →       │ │
│ │                                │ │                                │ │   services.html#cloud]         │ │
│ │                                │ │                                │ │ [LINK: All services →          │ │
│ │                                │ │                                │ │   services.html]               │ │
│ └────────────────────────────────┘ └────────────────────────────────┘ └────────────────────────────────┘ │
│ ┌────────────────────────────────┐ ┌────────────────────────────────┐                                    │
│ │ H4: Company                    │ │ H4: Offices                    │                                    │
│ │ [LINK: About → about.html]     │ │ Text: Plano, Texas, USA        │                                    │
│ │ [LINK: Core values →           │ │ Text: 7950 Legacy Drive, Suite │                                    │
│ │   about.html#values]           │ │   400                          │                                    │
│ │ [LINK: FAQ → about.html#faq]   │ │ Text: Plano, Texas 75024, USA  │                                    │
│ │ [LINK: News → news.html]       │ │ [LINK: +1 469 322 9899 →       │                                    │
│ │ [LINK: Careers → careers.html] │ │   tel:+14693229899]            │                                    │
│ │ [LINK: Contact → demo.html]    │ │ [LINK: WhatsApp +1 469 439     │                                    │
│ │                                │ │   9345 →                       │                                    │
│ │                                │ │   https://wa.me/14694399345]   │                                    │
│ │                                │ │ [LINK: vinni.tran@newxion.com  │                                    │
│ │                                │ │   → mailto:vinni.tran@newxion. │                                    │
│ │                                │ │ com]                           │                                    │
│ │                                │ │ Text: Ho Chi Minh City,        │                                    │
│ │                                │ │   Vietnam                      │                                    │
│ │                                │ │ Text: Vietnam Delivery Center  │                                    │
│ │                                │ │ Text: Floor 15, B1 Building    │                                    │
│ │                                │ │ Text: 279 Nguyen Tri Phuong    │                                    │
│ │                                │ │   Street                       │                                    │
│ │                                │ │ Text: Dien Hong Ward, Ho Chi   │                                    │
│ │                                │ │   Minh City, Vietnam           │                                    │
│ │                                │ │ [LINK: +84 908 107 552 →       │                                    │
│ │                                │ │   tel:+84908107552]            │                                    │
│ └────────────────────────────────┘ └────────────────────────────────┘                                    │
│ Text: © 2026 XionTechs · Privacy policy · GET IT · DONE                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## Home

`index.html` · page title: "XionTechs | School Platforms & Software Outsourcing in Vietnam"

Changes on this page: Batch 1, ENH-001 to ENH-012 (see the change list at the top).

```text
╔═ HOME PAGE ══════════════════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. Every school community, connected. · dark hero, animated silk · [Batch 1 · ENH-002] ─────────────┐ ║
║ │ [BACKGROUND: animated silk (WebGL)]                                                                  │ ║
║ │ [BUTTON: Pause motion]                                                                               │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ H1: Every school community, connected.        │ │ [IMAGE: Web app screenshot · 1440 × 1080]      │ │ ║
║ │ │ Text: PXP for parents, LXP for learners, SXP  │ │ [IMAGE: Phone screenshot · 1170 × 2532]        │ │ ║
║ │ │   for staff. And the engineering team behind  │ │                                                │ │ ║
║ │ │   them, ready to build yours.                 │ │                                                │ │ ║
║ │ │ [BUTTON: Explore our products →               │ │                                                │ │ ║
║ │ │   products.html]                              │ │                                                │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ │ H2: Experience you can count on                                                                      │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ H3: 25+ Years                                 │ │ H3: 8                                          │ │ ║
║ │ │ Text: Leadership experience in software       │ │ Text: Service offerings, from idea to          │ │ ║
║ │ │                                               │ │   operation                                    │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 2. Our partners. · white · [new in ENH-003 · left-aligned in ENH-008] ──────────────────────────────┐ ║
║ │ H2: Our partners.                                                                                    │ ║
║ │ [ANIMATION: logos scroll right to left in a loop; hover, focus or tap pauses]                        │ ║
║ │ [IMAGE: [Placeholder] Partner logo 1 · 320 × 160]                                                    │ ║
║ │ [IMAGE: [Placeholder] Partner logo 2 · 320 × 160]                                                    │ ║
║ │ [IMAGE: [Placeholder] Partner logo 3 · 320 × 160]                                                    │ ║
║ │ [IMAGE: [Placeholder] Partner logo 4 · 320 × 160]                                                    │ ║
║ │ [IMAGE: [Placeholder] Partner logo 5 · 320 × 160]                                                    │ ║
║ │ [IMAGE: [Placeholder] Partner logo 6 · 320 × 160]                                                    │ ║
║ │ [IMAGE: [Placeholder] Partner logo 7 · 320 × 160]                                                    │ ║
║ │ [IMAGE: [Placeholder] Partner logo 8 · 320 × 160]                                                    │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 3. Why XionTechs. · light blue · [new in Batch 1 · rebuilt in ENH-004] ─────────────────────────────┐ ║
║ │ H2: Why XionTechs.                                                                                   │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ [WHOLE CARD IS A LINK → products.html]        │ │ Text: Delivery                                 │ │ ║
║ │ │ Text: Products                                │ │ H3: Two offices, one working day.              │ │ ║
║ │ │ H3: Products for schools                      │ │ Text: Teams across time zones keep delivery    │ │ ║
║ │ │ Text: Connected apps for parents, students,   │ │   moving with practical overlap.               │ │ ║
║ │ │   teachers, leaders and school staff,         │ │ Text: Plano · US Central · HCMC · GMT+7        │ │ ║
║ │ │   designed as one ecosystem.                  │ │                                                │ │ ║
║ │ │ Text: PXP · Parents · LXP · Students · SXP ·  │ │                                                │ │ ║
║ │ │   Staff · Facilities                          │ │                                                │ │ ║
║ │ │ Text: Explore products                        │ │                                                │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ Text: Industries                              │ │ [WHOLE CARD IS A LINK → services.html]         │ │ ║
║ │ │ H3: Deep in education. Built to adapt.        │ │ Text: Outsourcing services                     │ │ ║
║ │ │ Text: Education is where we go deepest, while │ │ H3: Your software delivery team                │ │ ║
║ │ │   the same engineering capability supports    │ │ Text: Dedicated teams and end-to-end delivery  │ │ ║
║ │ │   other industries too.                       │ │   for companies building digital products.     │ │ ║
║ │ │ Chips: Education · [BUTTON: +3]               │ │ Text: Explore services                         │ │ ║
║ │ │ [ON HOVER OR FOCUS OF +3: Healthcare ·        │ │                                                │ │ ║
║ │ │   Logistics · Private Equity slide out on the │ │                                                │ │ ║
║ │ │   same line]                                  │ │                                                │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ │ Text: Get IT Done                                                                                    │ ║
║ │ Text: Built with ownership.                                                                          │ ║
║ │ Text: Ownership of our commitments and pride in quality.                                             │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 4. Work built with our partners. · white · [new in ENH-003 · slider in ENH-006] ────────────────────┐ ║
║ │ H2: Work built with our partners.                                                                    │ ║
║ │ Text: Explore a selection of company partnerships and see how different business needs became        │ ║
║ │   focused digital solutions.                                                                         │ ║
║ │ [ROW SCROLLS SIDEWAYS: drag, swipe or arrow keys; carousel dots below, one per page of cards; all    │ ║
║ │   cards listed in order]                                                                             │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ [IMAGE: [Placeholder] Case   │ │ [IMAGE: [Placeholder] Case   │ │ [IMAGE: [Placeholder] Case     │ │ ║
║ │ │   study screenshot 1 · 1200  │ │   study screenshot 2 · 1200  │ │   study screenshot 3 · 1200 ×  │ │ ║
║ │ │   × 750]                     │ │   × 750]                     │ │   750]                         │ │ ║
║ │ │ H3: [Placeholder] Partner 1  │ │ H3: [Placeholder] Partner 2  │ │ H3: [Placeholder] Partner 3    │ │ ║
║ │ │ Text: [Placeholder] One or   │ │ Text: [Placeholder] One or   │ │ Text: [Placeholder] One or two │ │ ║
║ │ │   two sentences: the         │ │   two sentences: the         │ │   sentences: the partner's     │ │ ║
║ │ │   partner's need and what we │ │   partner's need and what we │ │   need and what we built.      │ │ ║
║ │ │   built.                     │ │   built.                     │ │ [LINK: View case study]        │ │ ║
║ │ │ [LINK: View case study]      │ │ [LINK: View case study]      │ │                                │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ [IMAGE: [Placeholder] Case   │ │ [IMAGE: [Placeholder] Case   │ │ [IMAGE: [Placeholder] Case     │ │ ║
║ │ │   study screenshot 4 · 1200  │ │   study screenshot 5 · 1200  │ │   study screenshot 6 · 1200 ×  │ │ ║
║ │ │   × 750]                     │ │   × 750]                     │ │   750]                         │ │ ║
║ │ │ H3: [Placeholder] Partner 4  │ │ H3: [Placeholder] Partner 5  │ │ H3: [Placeholder] Partner 6    │ │ ║
║ │ │ Text: [Placeholder] One or   │ │ Text: [Placeholder] One or   │ │ Text: [Placeholder] One or two │ │ ║
║ │ │   two sentences: the         │ │   two sentences: the         │ │   sentences: the partner's     │ │ ║
║ │ │   partner's need and what we │ │   partner's need and what we │ │   need and what we built.      │ │ ║
║ │ │   built.                     │ │   built.                     │ │ [LINK: View case study]        │ │ ║
║ │ │ [LINK: View case study]      │ │ [LINK: View case study]      │ │                                │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 5. How we approach. · blue gradient · [rebuilt in ENH-009 · light version in ENH-012] ──────────────┐ ║
║ │ H2: How we approach.                                                                                 │ ║
║ │ Text: Five clear steps, from the first conversation to launch and beyond.                            │ ║
║ │ [LINK: See how we work → services.html#process]                                                      │ ║
║ │ H3: Discovery                                                                                        │ ║
║ │ Text: Learn your goals, users and scope.                                                             │ ║
║ │ H3: Design                                                                                           │ ║
║ │ Text: Shape flows, interfaces and architecture.                                                      │ ║
║ │ H3: Development                                                                                      │ ║
║ │ Text: Build the product in agile sprints.                                                            │ ║
║ │ H3: QA & Improvement                                                                                 │ ║
║ │ Text: Test and refine before release.                                                                │ ║
║ │ H3: Deployment                                                                                       │ ║
║ │ Text: Release, monitor and keep improving.                                                           │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 6. What we build. · white · [Batch 1 · moved in ENH-005 · What we build in ENH-008, ENH-009] ───────┐ ║
║ │ H2: What we build.                                                                                   │ ║
║ │ Text: Digital products we design, build and run for every role in school, with more on the way.      │ ║
║ │ [BUTTON: Previous apps]                                                                              │ ║
║ │ [BUTTON: Next apps]                                                                                  │ ║
║ │ [ROW SCROLLS SIDEWAYS: back and forward buttons beside the heading; four cards visible on desktop]   │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ [WHOLE CARD IS A LINK →      │ │ [WHOLE CARD IS A LINK →      │ │ [WHOLE CARD IS A LINK →        │ │ ║
║ │ │   products.html#pxp]         │ │   products.html#lxp]         │ │   products.html#sxp]           │ │ ║
║ │ │ Text: PXP                    │ │ Text: LXP                    │ │ Text: SXP                      │ │ ║
║ │ │ Text: Parents                │ │ Text: Students               │ │ Text: Staff, teachers, leaders │ │ ║
║ │ │ Text: Attendance, grades,    │ │ Text: Lessons, assignments   │ │ Text: One workspace with       │ │ ║
║ │ │   messages and fees.         │ │   and progress.              │ │   role-based views.            │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ [WHOLE CARD IS A LINK →      │ │ [WHOLE CARD IS A LINK →      │ │ [WHOLE CARD IS A LINK →        │ │ ║
║ │ │   products.html#iot]         │ │   products.html]             │ │   products.html]               │ │ ║
║ │ │ Text: IoT                    │ │ Text: AI Tutor               │ │ Text: AI Timetable             │ │ ║
║ │ │ Text: School staff and       │ │ Text: Students               │ │ Text: School leaders           │ │ ║
║ │ │   facilities                 │ │ Text: [Placeholder] Study    │ │ Text: [Placeholder] The whole  │ │ ║
║ │ │ Text: Devices, lighting and  │ │   help at each student's own │ │   school timetable, planned in │ │ ║
║ │ │   climate.                   │ │   pace.                      │ │   fewer steps.                 │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ │ [LINK: Explore our products → products.html]                                                         │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 7. Latest from XionTechs. · light blue · [ENH-007] ─────────────────────────────────────────────────┐ ║
║ │ H2: Latest from XionTechs.                                                                           │ ║
║ │ Text: Catch up with what our team is building and shipping.                                          │ ║
║ │ [LINK: See all news → news.html]                                                                     │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ [IMAGE: story photo]         │ │ [IMAGE: story photo]         │ │ [IMAGE: story photo]           │ │ ║
║ │ │ Category · date              │ │ Category · date              │ │ Category · date                │ │ ║
║ │ │ H3: story title              │ │ H3: story title              │ │ H3: story title                │ │ ║
║ │ │ Text: summary                │ │ Text: summary                │ │ Text: summary                  │ │ ║
║ │ │ [LINK: Read more → story]    │ │ [LINK: Read more → story]    │ │ [LINK: Read more → story]      │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 8. Have something you want to build? · amber · [new in ENH-001 · ENH-010] ──────────────────────────┐ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ H2: Have something you want to build?         │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │ Text: Tell us a little about yourself and     │ │ │ [FIELD: Your name (text, required)]        │ │ │ ║
║ │ │   what you're working on. Our team will get   │ │ │ error: "Please enter your name."           │ │ │ ║
║ │ │   in touch to learn more.                     │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │ [LINK: vinni.tran@newxion.com →               │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │   mailto:vinni.tran@newxion.com]              │ │ │ [FIELD: Work email (email, required)]      │ │ │ ║
║ │ │ • Plano +1 469 322 9899                       │ │ │ error: "Please enter a valid email         │ │ │ ║
║ │ │ • Ho Chi Minh City +84 908 107 552            │ │ │     address."                              │ │ │ ║
║ │ │                                               │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │                                               │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │                                               │ │ │ [FIELD: Phone number (optional) (tel)]     │ │ │ ║
║ │ │                                               │ │ │ placeholder: "+1 469 322 9899"             │ │ │ ║
║ │ │                                               │ │ │ error: "Please enter a valid phone number, │ │ │ ║
║ │ │                                               │ │ │     for example +1 469 322 9899."          │ │ │ ║
║ │ │                                               │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │                                               │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │                                               │ │ │ [FIELD: Tell us about your project (text   │ │ │ ║
║ │ │                                               │ │ │   area, required)]                         │ │ │ ║
║ │ │                                               │ │ │ placeholder: "What are you looking to      │ │ │ ║
║ │ │                                               │ │ │     build? Tell us about your idea,        │ │ │ ║
║ │ │                                               │ │ │     existing product, team or challenge."  │ │ │ ║
║ │ │                                               │ │ │ error: "Please tell us a little about your │ │ │ ║
║ │ │                                               │ │ │     project."                              │ │ │ ║
║ │ │                                               │ │ │ error: "Please keep your message under     │ │ │ ║
║ │ │                                               │ │ │     2,000 characters."                     │ │ │ ║
║ │ │                                               │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │                                               │ │ [BUTTON: Start the conversation]               │ │ ║
║ │ │                                               │ │ Text: We only use your details to reply to     │ │ ║
║ │ │                                               │ │   your message.                                │ │ ║
║ │ │                                               │ │ [LINK: Privacy policy → privacy.html]          │ │ ║
║ │ │                                               │ │ [AFTER SENDING, replaces the form] Thanks —    │ │ ║
║ │ │                                               │ │   we've received your message. / Our team will │ │ ║
║ │ │                                               │ │   review what you shared and get in touch with │ │ ║
║ │ │                                               │ │   you. / Prototype: nothing was sent.          │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ [FOOTER: see "Header and footer"]                                                                        ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## Products

`products.html` · page title: "School Platforms: PXP Parent App, LXP, SXP & IoT | XionTechs"

Changes on this page: site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing).

```text
╔═ PRODUCTS PAGE ══════════════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. Four apps. One connected school. · amber hero ───────────────────────────────────────────────────┐ ║
║ │ [BACKGROUND: animated strands]                                                                       │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ Breadcrumb: Home › Products                   │ │ [IMAGE: Web app screenshot · 1440 × 1080]      │ │ ║
║ │ │ H1: Four apps. One connected school.          │ │ [IMAGE: Phone screenshot · 1170 × 2532]        │ │ ║
║ │ │ Text: PXP, LXP, SXP and IoT share one source  │ │                                                │ │ ║
║ │ │   of truth, so every role sees the same       │ │                                                │ │ ║
║ │ │   school day.                                 │ │                                                │ │ ║
║ │ │ [BUTTON: Book a demo → demo.html]             │ │                                                │ │ ║
║ │ │ [BUTTON: Product updates → #updates]          │ │                                                │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 2. Products on this page ───────────────────────────────────────────────────────────────────────────┐ ║
║ │ [LINK: PXP → #pxp]                                                                                   │ ║
║ │ [LINK: LXP → #lxp]                                                                                   │ ║
║ │ [LINK: SXP → #sxp]                                                                                   │ ║
║ │ [LINK: IoT → #iot]                                                                                   │ ║
║ │ [LINK: Updates → #updates]                                                                           │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 3. The school day, in a parent's pocket. · white ───────────────────────────────────────────────────┐ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ [IMAGE: PXP: Attendance · 1170 × 2532]        │ │ H2: The school day, in a parent's pocket.      │ │ ║
║ │ │ [IMAGE: PXP: Grades · 1170 × 2532]            │ │ Text: Parent eXperience Place keeps parents    │ │ ║
║ │ │ [IMAGE: PXP: Messages · 1170 × 2532]          │ │   close to every school day, on iOS and        │ │ ║
║ │ │ [IMAGE: PXP: Payments · 1170 × 2532]          │ │   Android.                                     │ │ ║
║ │ │ [IMAGE: PXP: Events · 1170 × 2532]            │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │ [BUTTON: Attendance (tab)]                    │ │ │ Text: Know they arrived · Alerts when your │ │ │ ║
║ │ │ [BUTTON: Grades (tab)]                        │ │ │   child reaches the gate.                  │ │ │ ║
║ │ │ [BUTTON: Messages (tab)]                      │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │ [BUTTON: Payments (tab)]                      │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │ [BUTTON: Events (tab)]                        │ │ │ Text: See progress early · Scores and      │ │ │ ║
║ │ │                                               │ │ │   comments as soon as published.           │ │ │ ║
║ │ │                                               │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │                                               │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │                                               │ │ │ Text: Talk to teachers · Two-way messages  │ │ │ ║
║ │ │                                               │ │ │   with teachers.                           │ │ │ ║
║ │ │                                               │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │                                               │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │                                               │ │ │ Text: Pay fees in a tap · Clear due dates  │ │ │ ║
║ │ │                                               │ │ │   and receipts.                            │ │ │ ║
║ │ │                                               │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │                                               │ │ [BUTTON: [Placeholder] App Store → #]          │ │ ║
║ │ │                                               │ │ [BUTTON: [Placeholder] Google Play → #]        │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 4. A calm place to learn. · light blue, linen ──────────────────────────────────────────────────────┐ ║
║ │ H2: A calm place to learn.                                                                           │ ║
║ │ Text: Learner eXperience Place brings a student's lessons, assignments and progress into one place.  │ ║
║ │ Tags: Students · Web app                                                                             │ ║
║ │ [LINK: [Placeholder] lxp.xiontechs.com → #]                                                          │ ║
║ │ [IMAGE: LXP screenshot or clip still · 1600 × 1000]                                                  │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ Text: Lessons · Every        │ │ Text: Assignments · Clear    │ │ Text: Progress · Seen at a     │ │ ║
║ │ │   material in one place.     │ │   due dates.                 │ │   glance.                      │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ │ ┌──────────────────────────────┐                                                                     │ ║
║ │ │ Text: Feedback · Comments    │                                                                     │ ║
║ │ │   from teachers.             │                                                                     │ ║
║ │ └──────────────────────────────┘                                                                     │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 5. One workspace for the whole school. · navy, grid texture ────────────────────────────────────────┐ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ [LINK: [Placeholder] sxp.xiontechs.com → #]   │ │ H2: One workspace for the whole school.        │ │ ║
║ │ │ [IMAGE: SXP screenshot or clip still · 1600 × │ │ Text: Staff eXperience Place gives staff,      │ │ ║
║ │ │   1000]                                       │ │   teachers and leaders their own views of the  │ │ ║
║ │ │                                               │ │   same data.                                   │ │ ║
║ │ │                                               │ │ Tags: Staff · Teachers · Leaders               │ │ ║
║ │ │                                               │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │                                               │ │ │ Text: Attendance and records · Updated in  │ │ │ ║
║ │ │                                               │ │ │   real time.                               │ │ │ ║
║ │ │                                               │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │                                               │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │                                               │ │ │ Text: Classes · Classes, timetables and    │ │ │ ║
║ │ │                                               │ │ │   grades.                                  │ │ │ ║
║ │ │                                               │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │                                               │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │                                               │ │ │ Text: Communication · Reach parents        │ │ │ ║
║ │ │                                               │ │ │   through PXP.                             │ │ │ ║
║ │ │                                               │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │                                               │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │                                               │ │ │ Text: Leader dashboards · What needs       │ │ │ ║
║ │ │                                               │ │ │   attention today.                         │ │ │ ║
║ │ │                                               │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 6. A campus you run from one screen. · white ───────────────────────────────────────────────────────┐ ║
║ │ H2: A campus you run from one screen.                                                                │ ║
║ │ Text: IoT Device Management lets school staff control classroom AV, lighting, climate and access     │ ║
║ │   across campus.                                                                                     │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ H3: Classroom AV             │ │ H3: Lighting and climate     │ │ H3: Access                     │ │ ║
║ │ │ Text: Projectors, displays   │ │ Text: Scheduled around the   │ │ Text: Doors and zones, managed │ │ ║
║ │ │   and sound.                 │ │   timetable.                 │ │   centrally.                   │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ │ ┌──────────────────────────────┐                                                                     │ ║
║ │ │ H3: Energy                   │                                                                     │ ║
║ │ │ Text: See usage across the   │                                                                     │ ║
║ │ │   campus.                    │                                                                     │ ║
║ │ └──────────────────────────────┘                                                                     │ ║
║ │ [LINK: [Placeholder] iot.xiontechs.com → #]                                                          │ ║
║ │ [IMAGE: IoT screenshot or clip still · 1600 × 1000]                                                  │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 7. Product updates. · light blue ───────────────────────────────────────────────────────────────────┐ ║
║ │ H2: Product updates.                                                                                 │ ║
║ │ Text: New features and stories from PXP, LXP, SXP and IoT.                                           │ ║
║ │ Text: [Placeholder] Sample stories. Replace with real news before launch.                            │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ [IMAGE: story photo]         │ │ [IMAGE: story photo]         │ │ [IMAGE: story photo]           │ │ ║
║ │ │ Category · date              │ │ Category · date              │ │ Category · date                │ │ ║
║ │ │ H3: story title              │ │ H3: story title              │ │ H3: story title                │ │ ║
║ │ │ Text: summary                │ │ Text: summary                │ │ Text: summary                  │ │ ║
║ │ │ [LINK: Read more → story]    │ │ [LINK: Read more → story]    │ │ [LINK: Read more → story]      │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ │ [LINK: See all news → news.html]                                                                     │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 8. See it working at your school. · navy ───────────────────────────────────────────────────────────┐ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ H2: See it working at your school.            │ │ [FIELD: Work email (email, required)]          │ │ ║
║ │ │ Text: Leave your work email and we'll arrange │ │ placeholder: "name@school.edu.vn"              │ │ ║
║ │ │   a walkthrough built around your school.     │ │ [BUTTON: Book a demo]                          │ │ ║
║ │ │                                               │ │ Text: We only use your email to arrange your   │ │ ║
║ │ │                                               │ │   demo.                                        │ │ ║
║ │ │                                               │ │ [LINK: Privacy policy → privacy.html]          │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ [FOOTER: see "Header and footer"]                                                                        ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## Services

`services.html` · page title: "Software Outsourcing Vietnam | Product Engineering, AI, Low-code & Cloud | XionTechs"

Changes on this page: ENH-011 (the five-step How we work. replaces the 4-D process); site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing).

```text
╔═ SERVICES PAGE ══════════════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. Software teams that get IT done. · navy hero ────────────────────────────────────────────────────┐ ║
║ │ [BACKGROUND: animated strands]                                                                       │ ║
║ │ Breadcrumb: Home › Services                                                                          │ ║
║ │ H1: Software teams that get IT done.                                                                 │ ║
║ │ Text: Product engineering, AI, low-code and cloud delivery from Ho Chi Minh City, working across     │ ║
║ │   USA, Europe and Australia time zones.                                                              │ ║
║ │ [BUTTON: Start a project → demo.html#project]                                                        │ ║
║ │ [BUTTON: See how we work → #process]                                                                 │ ║
║ │ Text: Ho Chi Minh City · GMT+7 · Plano · US Central                                                  │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 2. Key facts · white ───────────────────────────────────────────────────────────────────────────────┐ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ H3: 25+                      │ │ H3: 24/7                     │ │ H3: 20+                        │ │ ║
║ │ │ Text: Years of leadership    │ │ Text: Global coverage across │ │ Text: Technology stacks we     │ │ ║
║ │ │   experience in software     │ │   time zones                 │ │   work in                      │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐                                    │ ║
║ │ │ H3: 8                        │ │ H3: 2                        │                                    │ ║
║ │ │ Text: Service offerings,     │ │ Text: Offices: Ho Chi Minh   │                                    │ ║
║ │ │   from idea to operation     │ │   City and Plano             │                                    │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘                                    │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 3. Eight services, one team. · light blue, linen ───────────────────────────────────────────────────┐ ║
║ │ H2: Eight services, one team.                                                                        │ ║
║ │ Text: Pick one service or combine several. We shape the team around your product.                    │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ H3: Product Engineering      │ │ H3: AI-Driven Analytics      │ │ H3: Product Co-Creation        │ │ ║
║ │ │ Text: Transform innovative   │ │ Text: Transform raw data     │ │ Text: Accelerate innovation by │ │ ║
║ │ │   ideas into market-ready    │ │   into actionable            │ │   combining your domain        │ │ ║
║ │ │   digital products with      │ │   intelligence using AI and  │ │   knowledge with our technical │ │ ║
║ │ │   end-to-end engineering     │ │   advanced visualisation.    │ │   expertise.                   │ │ ║
║ │ │   expertise.                 │ │ Text: AI/ML · Dashboards     │ │                                │ │ ║
║ │ │ Text: Web · Mobile           │ │                              │ │                                │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ H3: Staffing Service         │ │ H3: Custom App Development   │ │ H3: Low-code Solutions         │ │ ║
║ │ │ Text: Access specialised     │ │ Text: Develop custom         │ │ Text: Ship tools and           │ │ ║
║ │ │   technology talent when you │ │   solutions aligned with     │ │   automations faster on        │ │ ║
║ │ │   need it, with flexible     │ │   your unique requirements.  │ │   leading low-code platforms.  │ │ ║
║ │ │   options.                   │ │                              │ │ Text: Power Platform · Make ·  │ │ ║
║ │ │                              │ │                              │ │   n8n · Retool · Bubble        │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐                                    │ ║
║ │ │ H3: AI-Powered Solutions     │ │ H3: Cloud Computing          │                                    │ ║
║ │ │ Text: Harness artificial     │ │ Text: Expert solutions on    │                                    │ ║
║ │ │   intelligence to transform  │ │   Azure, AWS and GCP.        │                                    │ ║
║ │ │   your operations.           │ │ Text: Azure · AWS · GCP      │                                    │ ║
║ │ │ Text: Generative AI · AI/ML  │ │                              │                                    │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘                                    │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 4. Three ways to work with us. · white ─────────────────────────────────────────────────────────────┐ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ H2: Three ways to work with us.               │ │ Text: Dedicated team · Engineers who work as   │ │ ║
║ │ │ Text: Start the way that suits you, and       │ │   part of your team, in your process. Through  │ │ ║
║ │ │   change as your product grows.               │ │   our Staffing Service.                        │ │ ║
║ │ │                                               │ │ Text: End-to-end delivery · We own the project │ │ ║
║ │ │                                               │ │   from discovery to deployment. Through        │ │ ║
║ │ │                                               │ │   Product Engineering and Custom App           │ │ ║
║ │ │                                               │ │   Development.                                 │ │ ║
║ │ │                                               │ │ Text: Co-creation · Your domain knowledge and  │ │ ║
║ │ │                                               │ │   our engineering, building the product        │ │ ║
║ │ │                                               │ │   together. Through Product Co-Creation.       │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 5. How we work. · blue gradient · [five steps in ENH-011 (full version)] ───────────────────────────┐ ║
║ │ H2: How we work.                                                                                     │ ║
║ │ Text: Every step ends with something you can see, test and approve.                                  │ ║
║ │ [BUTTON: 01 · Discovery (tab)]                                                                       │ ║
║ │ [BUTTON: 02 · Design (tab)]                                                                          │ ║
║ │ [BUTTON: 03 · Development (tab)]                                                                     │ ║
║ │ [BUTTON: 04 · QA & Improvement (tab)]                                                                │ ║
║ │ [BUTTON: 05 · Deployment (tab)]                                                                      │ ║
║ │ Text: Step 01 — · Discovery                                                                          │ ║
║ │ H3: Learn your goals, users and scope                                                                │ ║
║ │ Text: We begin by understanding your business context, audience, product goals and delivery          │ ║
║ │   boundaries so the project starts with clarity.                                                     │ ║
║ │ • Stakeholder alignment and kickoff workshops                                                        │ ║
║ │ • User goals, pain points and workflow discovery                                                     │ ║
║ │ • Scope, risks, priorities and constraints                                                           │ ║
║ │ • Initial roadmap and delivery planning                                                              │ ║
║ │ Text: You receive                                                                                    │ ║
║ │ Text: A clear scope, estimate and delivery plan.                                                     │ ║
║ │ • Clear project scope                                                                                │ ║
║ │ • Priorities agreed                                                                                  │ ║
║ │ • Delivery roadmap                                                                                   │ ║
║ │ Text: Step 02 — · Design                                                                             │ ║
║ │ H3: Shape flows, interfaces and architecture                                                         │ ║
║ │ Text: We turn the discovery findings into user journeys, interface concepts and technical direction  │ ║
║ │   so everyone can see how the product should work.                                                   │ ║
║ │ • User flows and information architecture                                                            │ ║
║ │ • Wireframes and UI exploration                                                                      │ ║
║ │ • Clickable prototype creation                                                                       │ ║
║ │ • Technical design and solution structure                                                            │ ║
║ │ Text: You receive                                                                                    │ ║
║ │ Text: A clickable prototype and technical design.                                                    │ ║
║ │ • Clickable prototype                                                                                │ ║
║ │ • User flows                                                                                         │ ║
║ │ • Technical direction                                                                                │ ║
║ │ Text: Step 03 — · Development                                                                        │ ║
║ │ H3: Build the product in agile sprints                                                               │ ║
║ │ Text: We implement the solution in working increments, keeping progress visible through regular      │ ║
║ │   updates, reviews and collaboration.                                                                │ ║
║ │ • Frontend and backend implementation                                                                │ ║
║ │ • Agile sprint planning and demos                                                                    │ ║
║ │ • Continuous collaboration and feedback loops                                                        │ ║
║ │ • Ongoing refinement during delivery                                                                 │ ║
║ │ Text: You receive                                                                                    │ ║
║ │ Text: Working software every sprint.                                                                 │ ║
║ │ • Sprint builds                                                                                      │ ║
║ │ • Regular demos                                                                                      │ ║
║ │ • Visible progress                                                                                   │ ║
║ │ Text: Step 04 — · QA & Improvement                                                                   │ ║
║ │ H3: Test, refine and optimise before release                                                         │ ║
║ │ Text: Before go-live, we strengthen quality through validation, issue fixing and improvement so the  │ ║
║ │   release is more polished and reliable.                                                             │ ║
║ │ • Functional testing and defect resolution                                                           │ ║
║ │ • UX refinement and performance checks                                                               │ ║
║ │ • Quality review against requirements                                                                │ ║
║ │ • Final improvement pass before release                                                              │ ║
║ │ Text: You receive                                                                                    │ ║
║ │ Text: A polished, launch-ready product.                                                              │ ║
║ │ • Tested build                                                                                       │ ║
║ │ • Resolved issues                                                                                    │ ║
║ │ • Final refinements                                                                                  │ ║
║ │ Text: Step 05 — · Deployment                                                                         │ ║
║ │ H3: Release, monitor and keep improving                                                              │ ║
║ │ Text: We launch the product, monitor how it performs and continue supporting improvements so the     │ ║
║ │   solution keeps delivering value after release.                                                     │ ║
║ │ • Deployment and release coordination                                                                │ ║
║ │ • Production monitoring and support                                                                  │ ║
║ │ • Post-launch review and iteration planning                                                          │ ║
║ │ • Continuous enhancement and maintenance                                                             │ ║
║ │ Text: You receive                                                                                    │ ║
║ │ Text: A live release with ongoing support.                                                           │ ║
║ │ • Live production release                                                                            │ ║
║ │ • Monitoring                                                                                         │ ║
║ │ • Ongoing support                                                                                    │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 6. Industries we serve. · light blue ───────────────────────────────────────────────────────────────┐ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ H2: Industries we serve.                      │ │ H3: Working in your time zone                  │ │ ║
║ │ │ Text: Education is where we go deepest, and   │ │ Text: Our teams in Ho Chi Minh City and Plano  │ │ ║
║ │ │   the same engineering serves other           │ │   collaborate with clients in the USA, Europe  │ │ ║
║ │ │   industries too.                             │ │   and Australia.                               │ │ ║
║ │ │ Text: EdTech · Healthcare · Logistics ·       │ │ Tags: USA · Europe · Australia                 │ │ ║
║ │ │   Private Equity                              │ │ Text: Ho Chi Minh City · GMT+7 · Plano · US    │ │ ║
║ │ │                                               │ │   Central                                      │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 7. Tell us what you're building. · amber ───────────────────────────────────────────────────────────┐ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ H2: Tell us what you're building.             │ │ [FIELD: Work email (email, required)]          │ │ ║
║ │ │ Text: Leave your work email and we'll reach   │ │ placeholder: "name@company.com"                │ │ ║
║ │ │   out to start Discovery.                     │ │ [BUTTON: Start a project]                      │ │ ║
║ │ │                                               │ │ Text: We only use your details to respond to   │ │ ║
║ │ │                                               │ │   this request.                                │ │ ║
║ │ │                                               │ │ [LINK: Privacy policy → privacy.html]          │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ [FOOTER: see "Header and footer"]                                                                        ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## About

`about.html` · page title: "About XionTechs | Get IT Done"

Changes on this page: Batch 1 (no label above "Our core values."); ENH-011 (FAQ says five steps); site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing).

```text
╔═ ABOUT PAGE ═════════════════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. Tech made simple. Solutions made powerful. · navy hero ──────────────────────────────────────────┐ ║
║ │ [BACKGROUND: animated strands]                                                                       │ ║
║ │ Breadcrumb: Home › About                                                                             │ ║
║ │ H1: Tech made simple. Solutions made powerful.                                                       │ ║
║ │ Text: We are an education technology company and software partner. We build our own school platforms │ ║
║ │   and deliver digital products for clients around the world.                                         │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 2. Key facts · white ───────────────────────────────────────────────────────────────────────────────┐ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ H3: 25+                      │ │ H3: 24/7                     │ │ H3: 20+                        │ │ ║
║ │ │ Text: Years of leadership    │ │ Text: Global coverage across │ │ Text: Technology stacks we     │ │ ║
║ │ │   experience in software     │ │   time zones                 │ │   work in                      │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐                                    │ ║
║ │ │ H3: 4                        │ │ H3: 2                        │                                    │ ║
║ │ │ Text: School products ready  │ │ Text: Offices: Ho Chi Minh   │                                    │ ║
║ │ │   to demo                    │ │   City and Plano             │                                    │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘                                    │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 3. Two strengths, one team. · light blue, linen ────────────────────────────────────────────────────┐ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ Text: [Placeholder] Photo · Real team photo   │ │ H2: Two strengths, one team.                   │ │ ║
║ │ │   at the Ho Chi Minh City office (no AI       │ │ Text: We build PXP, LXP, SXP and IoT Device    │ │ ║
║ │ │   imagery).                                   │ │   Management for schools. The same team        │ │ ║
║ │ │                                               │ │   delivers software for companies in           │ │ ║
║ │ │                                               │ │   education, healthcare, logistics and private │ │ ║
║ │ │                                               │ │   equity.                                      │ │ ║
║ │ │                                               │ │ • We understand education from the inside,     │ │ ║
║ │ │                                               │ │   because we run products for schools.         │ │ ║
║ │ │                                               │ │ • Led by more than 25 years of leadership      │ │ ║
║ │ │                                               │ │   experience in software.                      │ │ ║
║ │ │                                               │ │ • Offices in Ho Chi Minh City and Plano,       │ │ ║
║ │ │                                               │ │   serving clients in the USA, Europe and       │ │ ║
║ │ │                                               │ │   Australia.                                   │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 4. Our core values. · white ────────────────────────────────────────────────────────────────────────┐ ║
║ │ H2: Our core values.                                                                                 │ ║
║ │ Text: What guides how we work.                                                                       │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ H3: Startup Spirit           │ │ H3: Client Centricity        │ │ H3: Integrity First            │ │ ║
║ │ │ Text: Embody an              │ │ Text: Clients are at the     │ │ Text: Operate with honesty,    │ │ ║
║ │ │   entrepreneurial mindset,   │ │   heart of everything we do. │ │   transparency, and            │ │ ║
║ │ │   embracing agility,         │ │   We strive to deliver       │ │   accountability. Ethical      │ │ ║
║ │ │   flexibility, and a passion │ │   exceptional experiences    │ │   standards guide every        │ │ ║
║ │ │   for innovation. Our        │ │   and impactful outcomes     │ │   decision and interaction,    │ │ ║
║ │ │   commitment to excellence   │ │   through deep               │ │   fostering trust and          │ │ ║
║ │ │   is driven by resilience    │ │   understanding, proactive   │ │   long-term relationships.     │ │ ║
║ │ │   and a culture of           │ │   engagement, and tailored   │ │                                │ │ ║
║ │ │   continuous improvement.    │ │   solutions.                 │ │                                │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ H3: Innovation Driven        │ │ H3: "Get IT Done" Attitude   │ │ H3: People-Centered Culture    │ │ ║
║ │ │ Text: Passionate about       │ │ Text: Take ownership of our  │ │ Text: Cultivate a workplace    │ │ ║
║ │ │   exploring emerging         │ │   commitments and deliver    │ │   where every team member      │ │ ║
║ │ │   technologies and creative  │ │   high-quality, reliable,    │ │   feels valued, supported, and │ │ ║
║ │ │   approaches. Innovation is  │ │   and efficient solutions.   │ │   empowered. Our culture goes  │ │ ║
║ │ │   embedded in our DNA,       │ │   Our team is driven by      │ │   beyond employment: it's      │ │ ║
║ │ │   enabling us to evolve our  │ │   accountability and a       │ │   about belonging,             │ │ ║
║ │ │   solutions and stay ahead   │ │   results-oriented mindset   │ │   collaboration, and shared    │ │ ║
║ │ │   of industry trends.        │ │   that meets or exceeds      │ │   success.                     │ │ ║
║ │ │                              │ │   industry standards.        │ │                                │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 5. Frequently asked questions. · white ─────────────────────────────────────────────────────────────┐ ║
║ │ H2: Frequently asked questions.                                                                      │ ║
║ │ Text: Straight answers about our products, our services and how we work.                             │ ║
║ │ [FAQ, opens on click] Q: What does XionTechs do?                                                     │ ║
║ │ A: We build our own school platforms (PXP, LXP, SXP and IoT Device Management) and deliver software  │ ║
║ │     for other companies: product engineering, AI-driven analytics, product co-creation and staffing. │ ║
║ │ [FAQ, opens on click] Q: Which industries do you work with?                                          │ ║
║ │ A: EdTech is our core. We also serve Healthcare, Logistics and Private Equity.                       │ ║
║ │ [FAQ, opens on click] Q: How can our school try PXP, LXP or SXP?                                     │ ║
║ │ A: Book a demo. We walk you through the apps using scenarios from your own school.                   │ ║
║ │ [FAQ, opens on click] Q: How do you work across time zones?                                          │ ║
║ │ A: Our teams in Ho Chi Minh City and Plano cover USA, Europe and Australia time zones, with shared   │ ║
║ │     tools for real-time updates.                                                                     │ ║
║ │ [FAQ, opens on click] Q: When do you shape the solution to our needs?                                │ ║
║ │ A: From the start. Discovery, the first of our five steps, sets your goals, users and scope before   │ ║
║ │     design begins.                                                                                   │ ║
║ │ [FAQ, opens on click] Q: What results can we expect?                                                 │ ║
║ │ A: Cost-efficient delivery by skilled Vietnamese engineers, on-time releases and measurable results  │ ║
║ │     that support your growth.                                                                        │ ║
║ │ [FAQ, opens on click] Q: How do you keep our data secure?                                            │ ║
║ │ A: We work with honesty, transparency and clear ethical standards, backed by security automation and │ ║
║ │     continuous scanning.                                                                             │ ║
║ │ [FAQ, opens on click] Q: How do we give feedback during a project?                                   │ ║
║ │ A: Through dedicated channels, frequent check-ins and agile sprints, so your input shapes the        │ ║
║ │     product all the way through.                                                                     │ ║
║ │ [FAQ, opens on click] Q: How do you measure and show value?                                          │ ║
║ │ A: We track speed, quality, product impact and team autonomy, and share them openly with you.        │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 6. Two offices, serving the world. · navy, grid texture ────────────────────────────────────────────┐ ║
║ │ H2: Two offices, serving the world.                                                                  │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ Text: US Central                              │ │ Text: GMT+7                                    │ │ ║
║ │ │ H3: Plano, Texas, USA                         │ │ H3: Ho Chi Minh City, Vietnam                  │ │ ║
║ │ │ Text: 7950 Legacy Drive, Suite 400Plano,      │ │ Text: Vietnam Delivery Center                  │ │ ║
║ │ │   Texas 75024, USA                            │ │ Text: Floor 15, B1 Building279 Nguyen Tri      │ │ ║
║ │ │ [LINK: +1 469 322 9899 → tel:+14693229899]    │ │   Phuong StreetDien Hong Ward, Ho Chi Minh     │ │ ║
║ │ │ [LINK: WhatsApp +1 469 439 9345 →             │ │   City, Vietnam                                │ │ ║
║ │ │   https://wa.me/14694399345]                  │ │ [LINK: +84 908 107 552 → tel:+84908107552]     │ │ ║
║ │ │ [LINK: vinni.tran@newxion.com →               │ │                                                │ │ ║
║ │ │   mailto:vinni.tran@newxion.com]              │ │                                                │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 7. See our apps in action. · amber ─────────────────────────────────────────────────────────────────┐ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ H2: See our apps in action.                   │ │ [FIELD: Work email (email, required)]          │ │ ║
║ │ │ Text: Leave your work email and we'll arrange │ │ placeholder: "name@company.com"                │ │ ║
║ │ │   a walkthrough of PXP, LXP and SXP.          │ │ [BUTTON: Book a demo]                          │ │ ║
║ │ │                                               │ │ Text: We only use your email to arrange your   │ │ ║
║ │ │                                               │ │   demo.                                        │ │ ║
║ │ │                                               │ │ [LINK: Privacy policy → privacy.html]          │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ [FOOTER: see "Header and footer"]                                                                        ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## News

`news.html` · page title: "News | XionTechs"

Changes on this page: ENH-007 (a story about an app shows the app name in its pill); site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing).

```text
╔═ NEWS PAGE ══════════════════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. What we've been up to. · light hero ─────────────────────────────────────────────────────────────┐ ║
║ │ [BACKGROUND: animated strands]                                                                       │ ║
║ │ Breadcrumb: Home › News                                                                              │ ║
║ │ H1: What we've been up to.                                                                           │ ║
║ │ Text: Short stories about our products, schools, team and client work.                               │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 2. All stories · white ─────────────────────────────────────────────────────────────────────────────┐ ║
║ │ [BUTTON: All]                                                                                        │ ║
║ │ [BUTTON: Product]                                                                                    │ ║
║ │ [BUTTON: Company]                                                                                    │ ║
║ │ [BUTTON: Schools]                                                                                    │ ║
║ │ [BUTTON: Team]                                                                                       │ ║
║ │ Text: [Placeholder] Sample stories. Replace with real news before launch.                            │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ [IMAGE: story photo]         │ │ [IMAGE: story photo]         │ │ [IMAGE: story photo]           │ │ ║
║ │ │ Category · date              │ │ Category · date              │ │ Category · date                │ │ ║
║ │ │ H3: story title              │ │ H3: story title              │ │ H3: story title                │ │ ║
║ │ │ Text: summary                │ │ Text: summary                │ │ Text: summary                  │ │ ║
║ │ │ [LINK: Read more → story]    │ │ [LINK: Read more → story]    │ │ [LINK: Read more → story]      │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ │ (more cards follow, from the news list)                                                              │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 3. See it working at your school. · amber ──────────────────────────────────────────────────────────┐ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ H2: See it working at your school.            │ │ [FIELD: Work email (email, required)]          │ │ ║
║ │ │ Text: Leave your work email and we'll arrange │ │ placeholder: "name@school.edu.vn"              │ │ ║
║ │ │   a walkthrough built around your school.     │ │ [BUTTON: Book a demo]                          │ │ ║
║ │ │                                               │ │ Text: We only use your email to arrange your   │ │ ║
║ │ │                                               │ │   demo.                                        │ │ ║
║ │ │                                               │ │ [LINK: Privacy policy → privacy.html]          │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ [FOOTER: see "Header and footer"]                                                                        ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## News story

`news-story.html` · page title: "[Placeholder] Parents can now pay school fees in PXP | XionTechs News"

Changes on this page: site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing).

```text
╔═ NEWS STORY PAGE ════════════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. [Placeholder] Parents can now pay school fees in… · light hero ──────────────────────────────────┐ ║
║ │ Breadcrumb: Home › News › Story                                                                      │ ║
║ │ H1: [Placeholder] Parents can now pay school fees in PXP                                             │ ║
║ │ Text: 18 SEP 2026 · PXP                                                                              │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 2. Story · white ───────────────────────────────────────────────────────────────────────────────────┐ ║
║ │ [IMAGE: Story photo · 1600 × 900]                                                                    │ ║
║ │ Text: [Placeholder] Sample story to show the layout. Replace with a real story before launch.        │ ║
║ │ Text: [Placeholder] Opening paragraph: what happened, when, and why it matters to schools and        │ ║
║ │   parents.                                                                                           │ ║
║ │ H2: [Placeholder] Subheading                                                                         │ ║
║ │ Text: [Placeholder] Main body: two to four short paragraphs, optionally with a quote from a school   │ ║
║ │   (with permission).                                                                                 │ ║
║ │ [BUTTON: See PXP → products.html#pxp]                                                                │ ║
║ │ [BUTTON: Back to News → news.html]                                                                   │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ [FOOTER: see "Header and footer"]                                                                        ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## Careers

`careers.html` · page title: "Careers at XionTechs | Software Jobs in Ho Chi Minh City"

Changes on this page: site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing).

```text
╔═ CAREERS PAGE ═══════════════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. Build what schools use every day. · amber hero ──────────────────────────────────────────────────┐ ║
║ │ [BACKGROUND: animated strands]                                                                       │ ║
║ │ Breadcrumb: Home › Careers                                                                           │ ║
║ │ H1: Build what schools use every day.                                                                │ ║
║ │ Text: Join a people-centered team working with AI/ML, generative AI, cloud and agile delivery.       │ ║
║ │ [BUTTON: See open roles → #roles]                                                                    │ ║
║ │ [BUTTON: Life at XionTechs → #life]                                                                  │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 2. A culture that goes beyond employment. · white ──────────────────────────────────────────────────┐ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ H2: A culture that goes beyond employment.    │ │ Text: [Placeholder] Photo · A real photo of    │ │ ║
║ │ │ Text: We cultivate a workplace where every    │ │   the team at work or at a company event.      │ │ ║
║ │ │   team member feels valued, supported, and    │ │                                                │ │ ║
║ │ │   empowered. It's about belonging,            │ │                                                │ │ ║
║ │ │   collaboration, and shared success.          │ │                                                │ │ ║
║ │ │ • Startup Spirit. · Agility, flexibility and  │ │                                                │ │ ║
║ │ │   a passion for innovation.                   │ │                                                │ │ ║
║ │ │ • "Get IT Done" Attitude. · Ownership of our  │ │                                                │ │ ║
║ │ │   commitments and pride in quality.           │ │                                                │ │ ║
║ │ │ • People-Centered Culture. · A place where    │ │                                                │ │ ║
║ │ │   everyone belongs.                           │ │                                                │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 3. Why you'll grow here. · light blue, linen ───────────────────────────────────────────────────────┐ ║
║ │ H2: Why you'll grow here.                                                                            │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ H3: Innovative workspace     │ │ H3: Growth opportunities     │ │ H3: Engaging work              │ │ ║
║ │ │ Text: Cutting-edge           │ │ Text: Structured training,   │ │ Text: Projects with AI/ML,     │ │ ║
║ │ │   technologies to create     │ │   knowledge resources and    │ │   generative AI, cloud         │ │ ║
║ │ │   transformative IT systems. │ │   role-specific onboarding.  │ │   computing and agile methods. │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ │ ┌──────────────────────────────┐                                                                     │ ║
║ │ │ H3: Meaningful impact        │                                                                     │ ║
║ │ │ Text: Solutions that drive   │                                                                     │ ║
║ │ │   digital transformation,    │                                                                     │ ║
║ │ │   used by schools every day. │                                                                     │ ║
║ │ └──────────────────────────────┘                                                                     │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 4. Open roles. · white ─────────────────────────────────────────────────────────────────────────────┐ ║
║ │ H2: Open roles.                                                                                      │ ║
║ │ Text: [Placeholder] Sample roles. Real roles are published through Sanity.                           │ ║
║ │ [WHOLE CARD IS A LINK → job.html]                                                                    │ ║
║ │ Text: [Placeholder] Job title · Engineering · Ho Chi Minh City · Full-time                           │ ║
║ │ Text: View and apply                                                                                 │ ║
║ │ [WHOLE CARD IS A LINK → job.html]                                                                    │ ║
║ │ Text: [Placeholder] Job title · Product · Ho Chi Minh City · Full-time                               │ ║
║ │ Text: View and apply                                                                                 │ ║
║ │ [WHOLE CARD IS A LINK → job.html]                                                                    │ ║
║ │ Text: [Placeholder] Job title · Quality · Ho Chi Minh City · Full-time                               │ ║
║ │ Text: View and apply                                                                                 │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 5. Life at XionTechs. · light blue ─────────────────────────────────────────────────────────────────┐ ║
║ │ H2: Life at XionTechs.                                                                               │ ║
║ │ Text: Click a frame to add a real team photo.                                                        │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ [IMAGE: Team photo · 1200 ×  │ │ [IMAGE: Office photo · 1200  │ │ [IMAGE: Event photo · 1200 ×   │ │ ║
║ │ │   900]                       │ │   × 900]                     │ │   900]                         │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ [FOOTER: see "Header and footer"]                                                                        ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## Job

`job.html` · page title: "[Placeholder] Job title | Careers at XionTechs"

Changes on this page: site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing).

```text
╔═ JOB PAGE ═══════════════════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. [Placeholder] Job title · amber hero ────────────────────────────────────────────────────────────┐ ║
║ │ [BACKGROUND: animated strands]                                                                       │ ║
║ │ Breadcrumb: Home › Careers › [Placeholder] Job title                                                 │ ║
║ │ H1: [Placeholder] Job title                                                                          │ ║
║ │ Tags: Engineering · Ho Chi Minh City · Full-time                                                     │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 2. Role details and application · white ────────────────────────────────────────────────────────────┐ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ Text: [Placeholder] Sample content. The real  │ │ H2: Apply for this role                        │ │ ║
║ │ │   description is published through Sanity.    │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │ H2: About the role                            │ │ │ [FIELD: Full name (text, required)]        │ │ │ ║
║ │ │ Text: [Placeholder] Two or three sentences    │ │ │ error: "Please enter your name."           │ │ │ ║
║ │ │   about the team, the product and why this    │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │   role matters.                               │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │ H2: What you'll do                            │ │ │ [FIELD: Email (email, required)]           │ │ │ ║
║ │ │ • [Placeholder] Responsibility one            │ │ │ error: "Please enter a valid email         │ │ │ ║
║ │ │ • [Placeholder] Responsibility two            │ │ │     address."                              │ │ │ ║
║ │ │ • [Placeholder] Responsibility three          │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │ H2: What you bring                            │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │ • [Placeholder] Requirement one               │ │ │ [FIELD: Phone (optional) (tel)]            │ │ │ ║
║ │ │ • [Placeholder] Requirement two               │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │ • [Placeholder] Requirement three             │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │ [LINK: All open roles → careers.html#roles]   │ │ │ [FIELD: CV (file, required)]               │ │ │ ║
║ │ │                                               │ │ │ help: "PDF or Word, up to 5 MB."           │ │ │ ║
║ │ │                                               │ │ │ error: "Please upload your CV as a PDF or  │ │ │ ║
║ │ │                                               │ │ │     Word file, up to 5 MB."                │ │ │ ║
║ │ │                                               │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │                                               │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │                                               │ │ │ [FIELD: Cover note (optional) (text area)] │ │ │ ║
║ │ │                                               │ │ │ error: "Please keep your note under 2,000  │ │ │ ║
║ │ │                                               │ │ │     characters."                           │ │ │ ║
║ │ │                                               │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │                                               │ │ [BUTTON: Send application]                     │ │ ║
║ │ │                                               │ │ Text: We only use your details and CV to       │ │ ║
║ │ │                                               │ │   consider your application.                   │ │ ║
║ │ │                                               │ │ [LINK: Privacy policy → privacy.html]          │ │ ║
║ │ │                                               │ │ [AFTER SENDING, replaces the form] Thank you!  │ │ ║
║ │ │                                               │ │   / We've received your application and will   │ │ ║
║ │ │                                               │ │   be in touch if it's a match. (Prototype:     │ │ ║
║ │ │                                               │ │   nothing was sent.)                           │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ [FOOTER: see "Header and footer"]                                                                        ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## Contact

`demo.html` · page title: "Book a Demo or Start a Project | XionTechs"

Changes on this page: ENH-011 (checklist says five steps); site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing).

```text
╔═ CONTACT PAGE ═══════════════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. Let's talk about your school or your project. · navy hero ───────────────────────────────────────┐ ║
║ │ [BACKGROUND: animated strands]                                                                       │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ Breadcrumb: Home › Contact                    │ │ H2: What can we help with?                     │ │ ║
║ │ │ H1: Let's talk about your school or your      │ │ [BUTTON: Product demo (tab)]                   │ │ ║
║ │ │   project.                                    │ │ [BUTTON: Outsourcing project (tab)]            │ │ ║
║ │ │ • A walkthrough of PXP, LXP and SXP using     │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │   your school's scenarios.                    │ │ │ [FIELD: Full name (text, required)]        │ │ │ ║
║ │ │ • Answers on setup, data and support.         │ │ │ error: "Please enter your name."           │ │ │ ║
║ │ │ • For projects: a first Discovery             │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │   conversation, the first of our five steps.  │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │ ┌───────────────────────────────────────────┐ │ │ │ [FIELD: Work email (email, required)]      │ │ │ ║
║ │ │ │ Text: Plano, Texas, USA                   │ │ │ │ error: "Please enter a valid email         │ │ │ ║
║ │ │ │ Text: 7950 Legacy Drive, Suite 400        │ │ │ │     address."                              │ │ │ ║
║ │ │ │ Text: Plano, Texas 75024, USA             │ │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │ │ [LINK: +1 469 322 9899 →                  │ │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │ │   tel:+14693229899]                       │ │ │ │ [FIELD: School or company (text,           │ │ │ ║
║ │ │ │ [LINK: WhatsApp +1 469 439 9345 →         │ │ │ │   required)]                               │ │ │ ║
║ │ │ │   https://wa.me/14694399345]              │ │ │ │ error: "Please enter your organisation."   │ │ │ ║
║ │ │ │ [LINK: vinni.tran@newxion.com →           │ │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │ │   mailto:vinni.tran@newxion.com]          │ │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │ └───────────────────────────────────────────┘ │ │ │ [FIELD: Your role (text)]                  │ │ │ ║
║ │ │ ┌───────────────────────────────────────────┐ │ │ │ help: "For example: Principal, Head of IT" │ │ │ ║
║ │ │ │ Text: Ho Chi Minh City, Vietnam           │ │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │ │ Text: Vietnam Delivery Center             │ │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │ │ Text: Floor 15, B1 Building               │ │ │ │ [CHECKBOXES: Products of interest: PXP /   │ │ │ ║
║ │ │ │ Text: 279 Nguyen Tri Phuong Street        │ │ │ │   LXP / SXP / IoT; Product demo tab only]  │ │ │ ║
║ │ │ │ Text: Dien Hong Ward, Ho Chi Minh City,   │ │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │ │   Vietnam                                 │ │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │ │ [LINK: +84 908 107 552 →                  │ │ │ │ [FIELD: School size (dropdown: Under 500   │ │ │ ║
║ │ │ │   tel:+84908107552]                       │ │ │ │   students / 500 to 1,500 students / Over  │ │ │ ║
║ │ │ └───────────────────────────────────────────┘ │ │ │   1,500 students / Multiple campuses;      │ │ │ ║
║ │ │                                               │ │ │   Product demo tab only)]                  │ │ │ ║
║ │ │                                               │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │                                               │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │                                               │ │ │ [FIELD: Preferred date (date; Product demo │ │ │ ║
║ │ │                                               │ │ │   tab only)]                               │ │ │ ║
║ │ │                                               │ │ │ error: "Please choose today or a later     │ │ │ ║
║ │ │                                               │ │ │     date."                                 │ │ │ ║
║ │ │                                               │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │                                               │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │                                               │ │ │ [FIELD: Service (dropdown: Product         │ │ │ ║
║ │ │                                               │ │ │   Engineering / AI-Driven Analytics /      │ │ │ ║
║ │ │                                               │ │ │   Product Co-Creation / Staffing Service / │ │ │ ║
║ │ │                                               │ │ │   Custom App Development / Low-code        │ │ │ ║
║ │ │                                               │ │ │   Solutions / AI-Powered Solutions / Cloud │ │ │ ║
║ │ │                                               │ │ │   Computing / Not sure yet; Outsourcing    │ │ │ ║
║ │ │                                               │ │ │   project tab only)]                       │ │ │ ║
║ │ │                                               │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │                                               │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │                                               │ │ │ [FIELD: When do you want to start?         │ │ │ ║
║ │ │                                               │ │ │   (dropdown: As soon as possible / In 1 to │ │ │ ║
║ │ │                                               │ │ │   3 months / Just exploring; Outsourcing   │ │ │ ║
║ │ │                                               │ │ │   project tab only)]                       │ │ │ ║
║ │ │                                               │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │                                               │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │                                               │ │ │ [FIELD: Message (optional) (text area)]    │ │ │ ║
║ │ │                                               │ │ │ error: "Please keep your message under     │ │ │ ║
║ │ │                                               │ │ │     2,000 characters."                     │ │ │ ║
║ │ │                                               │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │                                               │ │ [BUTTON: Send request]                         │ │ ║
║ │ │                                               │ │ Text: We only use your details to respond to   │ │ ║
║ │ │                                               │ │   this request.                                │ │ ║
║ │ │                                               │ │ [LINK: Privacy policy → privacy.html]          │ │ ║
║ │ │                                               │ │ [AFTER SENDING, replaces the form] Thank you!  │ │ ║
║ │ │                                               │ │   / We will be in touch soon. (Prototype:      │ │ ║
║ │ │                                               │ │   nothing was sent.)                           │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ [FOOTER: see "Header and footer"]                                                                        ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## Privacy policy

`privacy.html` · page title: "Privacy Policy | XionTechs"

Changes on this page: site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing).

```text
╔═ PRIVACY POLICY PAGE ════════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. Privacy policy. · light hero ────────────────────────────────────────────────────────────────────┐ ║
║ │ Breadcrumb: Home › Privacy policy                                                                    │ ║
║ │ H1: Privacy policy.                                                                                  │ ║
║ │ Text: [Placeholder] Policy text to be supplied by the legal owner, compliant with Vietnam's Decree   │ ║
║ │   13/2023 (PDPD).                                                                                    │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 2. Policy · white ──────────────────────────────────────────────────────────────────────────────────┐ ║
║ │ Text: [Placeholder] Content outline. The sections below are what the policy must cover, not the real │ ║
║ │   policy.                                                                                            │ ║
║ │ H2: Who we are and how to reach us                                                                   │ ║
║ │ Text: [Placeholder] The data controller (XionTechs legal entity), its address and a contact for      │ ║
║ │   privacy requests.                                                                                  │ ║
║ │ H2: What we collect                                                                                  │ ║
║ │ Text: [Placeholder] Email, name, organisation, role and anything you send through our forms.         │ ║
║ │ H2: How we use it                                                                                    │ ║
║ │ Text: [Placeholder] Only to answer your request, arrange a demo, or consider your job application    │ ║
║ │   and CV.                                                                                            │ ║
║ │ H2: Who we share it with                                                                             │ ║
║ │ Text: [Placeholder] Service providers that process data for us, such as the form inbox or CRM and    │ ║
║ │   website hosting.                                                                                   │ ║
║ │ H2: Transfers outside Vietnam                                                                        │ ║
║ │ Text: [Placeholder] When data is transferred abroad (for example to our Plano office) and the        │ ║
║ │   safeguards required by Decree 13/2023.                                                             │ ║
║ │ H2: How long we keep it                                                                              │ ║
║ │ Text: [Placeholder] Retention period to be decided.                                                  │ ║
║ │ H2: Cookies and analytics                                                                            │ ║
║ │ Text: [Placeholder] Which cookies the site uses, and consent for any non-essential cookies or        │ ║
║ │   analytics.                                                                                         │ ║
║ │ H2: Your rights                                                                                      │ ║
║ │ Text: [Placeholder] Access, correct or delete your data, or withdraw consent; how to contact us.     │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ [FOOTER: see "Header and footer"]                                                                        ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## Not found (404)

`404.html` · page title: "Page not found | XionTechs"

Changes on this page: Batch 1 (no label above the heading); site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing).

```text
╔═ NOT FOUND (404) PAGE ═══════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. We couldn't find that page. · navy hero ─────────────────────────────────────────────────────────┐ ║
║ │ [BACKGROUND: animated strands]                                                                       │ ║
║ │ H1: We couldn't find that page.                                                                      │ ║
║ │ Text: The link may be old or mistyped. These pages can help.                                         │ ║
║ │ [BUTTON: Go to Home → index.html]                                                                    │ ║
║ │ [BUTTON: Products → products.html]                                                                   │ ║
║ │ [BUTTON: Services → services.html]                                                                   │ ║
║ │ [BUTTON: News → news.html]                                                                           │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ [FOOTER: see "Header and footer"]                                                                        ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```
