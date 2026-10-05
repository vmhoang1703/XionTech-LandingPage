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
| Home, products | Four-app bento with phone mockups, right after the doors | "What we build.": seven equal app cards (PXP, LXP, SXP, IoT, AI Tutor, AI Timetable, AI Grader) in a row with back and forward buttons, below the process | Batch 1, ENH-005, ENH-008, ENH-009, ENH-013, ENH-021 |
| Home, eight services | Eight service cards | Removed from Home (they stay on Services) | Batch 1 |
| Home and News, news | "Latest from XionTechs." with a placeholder note; pills "Product · PXP" | One-line intro with "See all news" on the same row; an app's story shows only the app name in its pill | ENH-007 |
| Products, hero | "Four apps. One connected school." with a breadcrumb, two buttons and tablet and phone mockups, on amber | "Built apart. Better together.", no button, and four app cards (PXP, LXP, SXP, IoT) around an X tile joined by lines, on a warm light background with slowly drifting glows and a Pause motion button (shared with Home) | ENH-014, ENH-018, ENH-020 |
| Products, after the apps | — | New: "A day at school.", a five-step timeline (07:45 to 15:30) on dark blue that plays step by step once, filling the rail and each dot with amber | ENH-015, ENH-023 |
| About, FAQ | "Frequently asked questions." above one column of nine bordered cards | "Your question, we answer": the same nine questions in two columns of hairline rows, closed by default, a + or − at the right of each; soft clouds drifting in the bottom left of a light-to-navy background | ENH-016 |
| About, FAQ background | — | The clouds and gradient hold still; the drifting and the sheen are gone | ENH-019 |
| Products, the apps | Four separate sections (PXP, LXP, SXP, IoT) with their own layouts, and a PXP / LXP / SXP / IoT / Updates bar | Seven stacked app cards (SXP, IoT, AI Timetable, AI Grader, PXP, LXP, AI Tutor) that pin and replace one another on desktop; phone or browser mockup, app name, one sentence, a Features list, store or View prototype buttons; School / Parents / Students pills that jump and highlight | ENH-020 |
| Products, background | Separate coloured bands per section | One background flowing down the page: white with amber dots, bright amber through the apps, easing into light blue by AI Tutor, then dark blue to the footer | ENH-022 |
| Products, updates and last band | "See all news" below the stories; navy band with a ring illustration | "See all news" on the heading row; plain dark navy band, continuous with the footer | ENH-024 |
| Every page, type | Bold headings, labels and buttons (600 to 700) | The same fonts and sizes at weight 500; body 400 | ENH-025 |
| Job page and Home contact, phones | The job page ran 89px past a phone screen; Home ran 2px at 320px | Both fit the screen at every width | ENH-026 |
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

Changes on this page: Batch 1, ENH-001 to ENH-013, ENH-021, ENH-025, ENH-026 (see the change list at the top).

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
║ ┌─ 6. What we build. · white · [Batch 1 · moved in ENH-005 · What we build in ENH-008, ENH-009 · AI … ─┐ ║
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
║ │ │   products.html#iot]         │ │   products.html#ai-tutor]    │ │   products.html#ai-timetable]  │ │ ║
║ │ │ Text: IoT                    │ │ Text: AI Tutor               │ │ Text: AI Timetable             │ │ ║
║ │ │ Text: School staff and       │ │ Text: Students               │ │ Text: School leaders           │ │ ║
║ │ │   facilities                 │ │ Text: Solve new problems on  │ │ Text: A transparent “best fit” │ │ ║
║ │ │ Text: Devices, lighting and  │ │   your own, not just read    │ │   timetable.                   │ │ ║
║ │ │   climate.                   │ │   solutions.                 │ │                                │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ │ ┌──────────────────────────────┐                                                                     │ ║
║ │ │ [WHOLE CARD IS A LINK →      │                                                                     │ ║
║ │ │   products.html#ai-grader]   │                                                                     │ ║
║ │ │ Text: AI Grader              │                                                                     │ ║
║ │ │ Text: Teachers               │                                                                     │ ║
║ │ │ Text: Rubric-based marking,  │                                                                     │ ║
║ │ │   with teachers in charge.   │                                                                     │ ║
║ │ └──────────────────────────────┘                                                                     │ ║
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

Changes on this page: ENH-014 and ENH-018 (hero), ENH-020 (stacked app cards), ENH-022 (background flow), ENH-023 (A day at school), ENH-024 (updates link, plain email band), ENH-027 and ENH-028 (resizing keeps the card; pill clears below the cards); site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing; ENH-025 calmer type weights).

```text
╔═ PRODUCTS PAGE ══════════════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. Built apart. Better together. · warm light, drifting glows · [ENH-014 · ENH-018 · ENH-020] ──────┐ ║
║ │ [BUTTON: Pause motion]                                                                               │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ H1: Built apart. Better together.             │ │ [LINK: Parent experience · PXP → #pxp]         │ │ ║
║ │ │ Text: A connected suite for school            │ │ [LINK: Learning experience · LXP → #lxp]       │ │ ║
║ │ │   communities — bringing parents, learning,   │ │ [LINK: Staff experience · SXP → #sxp]          │ │ ║
║ │ │   staff operations and campus technology into │ │ [LINK: Connected campus · IoT → #iot]          │ │ ║
║ │ │   one shared ecosystem.                       │ │                                                │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 2. Our apps · [new in ENH-020] ─────────────────────────────────────────────────────────────────────┐ ║
║ │ [LINK: School → #sxp]                                                                                │ ║
║ │ [LINK: Parents → #pxp]                                                                               │ ║
║ │ [LINK: Students → #lxp]                                                                              │ ║
║ │ H2: Our apps                                                                                         │ ║
║ │ [CARDS PIN AND STACK ON SCROLL (desktop): each card settles under the header and the next slides     │ ║
║ │   over and replaces it; the School / Parents / Students pills jump to a group and highlight the one  │ ║
║ │   being read]                                                                                        │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ Text: [Placeholder] sxp.xiontechs.com         │ │ H3: Staff eXperience Place                     │ │ ║
║ │ │ [IMAGE: [Placeholder] SXP screenshot · 1600 × │ │ Text: One workspace where staff, teachers and  │ │ ║
║ │ │   1000]                                       │ │   leaders share the same data.                 │ │ ║
║ │ │                                               │ │ H4: Features                                   │ │ ║
║ │ │                                               │ │ • Attendance and records in real time          │ │ ║
║ │ │                                               │ │ • Classes, timetables and grades               │ │ ║
║ │ │                                               │ │ • Messages to parents through PXP              │ │ ║
║ │ │                                               │ │ • Leader dashboards for today's priorities     │ │ ║
║ │ │                                               │ │ [BUTTON: View prototype → #]                   │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ Text: [Placeholder] iot.xiontechs.com         │ │ H3: IoT Device Management                      │ │ ║
║ │ │ [IMAGE: [Placeholder] IoT Device Management   │ │ Text: Run classroom devices, lighting, climate │ │ ║
║ │ │   screenshot · 1600 × 1000]                   │ │   and access from one screen.                  │ │ ║
║ │ │                                               │ │ H4: Features                                   │ │ ║
║ │ │                                               │ │ • Projectors, displays and sound               │ │ ║
║ │ │                                               │ │ • Lighting and climate on the timetable        │ │ ║
║ │ │                                               │ │ • Doors and zones managed centrally            │ │ ║
║ │ │                                               │ │ • Energy use across the campus                 │ │ ║
║ │ │                                               │ │ [BUTTON: View prototype → #]                   │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ Text: [Placeholder] timetable.xiontechs.com   │ │ H3: AI Timetable                               │ │ ║
║ │ │ [IMAGE: [Placeholder] AI Timetable screenshot │ │ Text: A transparent “best fit” timetable,      │ │ ║
║ │ │   · 1600 × 1000]                              │ │   built around what your school values.        │ │ ║
║ │ │                                               │ │ H4: Features                                   │ │ ║
║ │ │                                               │ │ • Bring in your school’s data                  │ │ ║
║ │ │                                               │ │ • Tell Felix what your school values           │ │ ║
║ │ │                                               │ │ • A transparent “best fit” timetable,          │ │ ║
║ │ │                                               │ │   generated for you                            │ │ ║
║ │ │                                               │ │ • Talked through every step, alongside the     │ │ ║
║ │ │                                               │ │   timetable                                    │ │ ║
║ │ │                                               │ │ [BUTTON: View prototype → #]                   │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ Text: [Placeholder] grader.xiontechs.com      │ │ H3: AI Grader                                  │ │ ║
║ │ │ [IMAGE: [Placeholder] AI Grader screenshot ·  │ │ Text: Mark a whole class against your rubric,  │ │ ║
║ │ │   1600 × 1000]                                │ │   with you in charge of every mark.            │ │ ║
║ │ │                                               │ │ H4: Features                                   │ │ ║
║ │ │                                               │ │ • Marks typed, handwritten, image and audio    │ │ ║
║ │ │                                               │ │   work                                         │ │ ║
║ │ │                                               │ │ • Rubric-aligned marks and feedback for every  │ │ ║
║ │ │                                               │ │   student                                      │ │ ║
║ │ │                                               │ │ • Each score linked to evidence in the work    │ │ ║
║ │ │                                               │ │ • Nothing reaches the markbook until you       │ │ ║
║ │ │                                               │ │   approve                                      │ │ ║
║ │ │                                               │ │ [BUTTON: View prototype → #]                   │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ [IMAGE: [Placeholder] PXP phone screenshot ·  │ │ H3: Parent eXperience Place                    │ │ ║
║ │ │   1170 × 2532]                                │ │ Text: Keeps parents close to every school day, │ │ ║
║ │ │                                               │ │   on their phone.                              │ │ ║
║ │ │                                               │ │ H4: Features                                   │ │ ║
║ │ │                                               │ │ • Alerts when your child reaches the gate      │ │ ║
║ │ │                                               │ │ • Scores and comments as soon as published     │ │ ║
║ │ │                                               │ │ • Two-way messages with teachers               │ │ ║
║ │ │                                               │ │ • Fee payments with clear receipts             │ │ ║
║ │ │                                               │ │ [BUTTON: Download on the · App Store → #]      │ │ ║
║ │ │                                               │ │ [BUTTON: Get it on · Google Play → #]          │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ Text: [Placeholder] lxp.xiontechs.com         │ │ H3: Learner eXperience Place                   │ │ ║
║ │ │ [IMAGE: [Placeholder] LXP screenshot · 1600 × │ │ Text: Lessons, assignments and progress in one │ │ ║
║ │ │   1000]                                       │ │   calm place to learn.                         │ │ ║
║ │ │                                               │ │ H4: Features                                   │ │ ║
║ │ │                                               │ │ • Every lesson material in one place           │ │ ║
║ │ │                                               │ │ • Assignments with clear due dates             │ │ ║
║ │ │                                               │ │ • Progress at a glance                         │ │ ║
║ │ │                                               │ │ • Comments from teachers                       │ │ ║
║ │ │                                               │ │ [BUTTON: View prototype → #]                   │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ Text: xt-ai-tutor-demo.azurewebsites.net      │ │ H3: AI Tutor                                   │ │ ║
║ │ │ [IMAGE: [Placeholder] AI Tutor screenshot ·   │ │ Text: Solve new problems on your own. Not just │ │ ║
║ │ │   1600 × 1000]                                │ │   read solutions.                              │ │ ║
║ │ │                                               │ │ H4: Features                                   │ │ ║
║ │ │                                               │ │ • Skill-by-skill diagnosis                     │ │ ║
║ │ │                                               │ │ • Step-by-step hints once you have tried       │ │ ║
║ │ │                                               │ │ • Mastery only when you can do it alone        │ │ ║
║ │ │                                               │ │ [BUTTON: View prototype →                      │ │ ║
║ │ │                                               │ │   https://xt-ai-tutor-demo.azurewebsites.net/] │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 3. A day at school. · dark navy · [new in ENH-015 · rebuilt in ENH-023] ────────────────────────────┐ ║
║ │ H2: A day at school.                                                                                 │ ║
║ │ Text: Follow one student journey through a typical school day and see how students, parents and      │ ║
║ │   school staff stay informed and connected across each step.                                         │ ║
║ │ [TIMELINE PLAYS ONCE on arrival: step by step every 1.8s, the rail and each dot fill with amber;     │ ║
║ │   resets only above the section]                                                                     │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ Text: 07:45                  │ │ Text: 08:00                  │ │ Text: 08:01                    │ │ ║
║ │ │ H3: Student arrives          │ │ H3: Attendance recorded      │ │ H3: Parent updated             │ │ ║
║ │ │ Text: The student arrives on │ │ Text: A teacher marks the    │ │ Text: PXP notifies parents     │ │ ║
║ │ │   campus.                    │ │   student's attendance in    │ │   that the student is at       │ │ ║
║ │ │                              │ │   SXP.                       │ │   school.                      │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐                                    │ ║
║ │ │ Text: 09:30                  │ │ Text: 15:30                  │                                    │ ║
║ │ │ H3: Student learns in LXP    │ │ H3: Day stays connected      │                                    │ ║
║ │ │ Text: Students access        │ │ Text: Notifications and      │                                    │ ║
║ │ │   learning materials, marks  │ │   school information stay    │                                    │ ║
║ │ │   and assignments in LXP.    │ │   connected across the       │                                    │ ║
║ │ │                              │ │   system.                    │                                    │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘                                    │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 4. Product updates. · light blue · [ENH-024] ───────────────────────────────────────────────────────┐ ║
║ │ H2: Product updates.                                                                                 │ ║
║ │ Text: New features and stories from PXP, LXP, SXP and IoT.                                           │ ║
║ │ Text: [Placeholder] Sample stories. Replace with real news before launch.                            │ ║
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
║ ┌─ 5. See it working at your school. · navy ───────────────────────────────────────────────────────────┐ ║
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

Changes on this page: ENH-011 (the five-step How we work. replaces the 4-D process); site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing; ENH-025 calmer type weights).

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

Changes on this page: Batch 1 (no label above "Our core values."); ENH-011 (FAQ says five steps); ENH-016 (FAQ rebuilt), ENH-019 (FAQ background holds still); site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing; ENH-025 calmer type weights).

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
║ ┌─ 5. Your question, we answer · [rebuilt in ENH-016 · background stilled in ENH-019] ─────────────────┐ ║
║ │ H2: Your question, we answer                                                                         │ ║
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
║ │ │ Text: 7950 Legacy Drive, Suite 400 Plano,     │ │ Text: Vietnam Delivery Center                  │ │ ║
║ │ │   Texas 75024, USA                            │ │ Text: Floor 15, B1 Building 279 Nguyen Tri     │ │ ║
║ │ │ [LINK: +1 469 322 9899 → tel:+14693229899]    │ │   Phuong Street Dien Hong Ward, Ho Chi Minh    │ │ ║
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

Changes on this page: ENH-007 (a story about an app shows the app name in its pill); site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing; ENH-025 calmer type weights).

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

Changes on this page: site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing; ENH-025 calmer type weights).

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

Changes on this page: site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing; ENH-025 calmer type weights).

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

Changes on this page: ENH-026 (fits phone screens); site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing; ENH-025 calmer type weights).

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

Changes on this page: ENH-011 (checklist says five steps); site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing; ENH-025 calmer type weights).

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
║ │ │ │ Text: 7950 Legacy Drive, Suite 400 Plano, │ │ │ │     address."                              │ │ │ ║
║ │ │ │   Texas 75024, USA                        │ │ │ └────────────────────────────────────────────┘ │ │ ║
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
║ │ │ │ Text: Floor 15, B1 Building 279 Nguyen    │ │ │ │ [CHECKBOXES: Products of interest: PXP /   │ │ │ ║
║ │ │ │   Tri Phuong Street Dien Hong Ward, Ho    │ │ │ │   LXP / SXP / IoT; Product demo tab only]  │ │ │ ║
║ │ │ │   Chi Minh City, Vietnam                  │ │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │ │ [LINK: +84 908 107 552 →                  │ │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │ │   tel:+84908107552]                       │ │ │ │ [FIELD: School size (dropdown: Under 500   │ │ │ ║
║ │ │ └───────────────────────────────────────────┘ │ │ │   students / 500 to 1,500 students / Over  │ │ │ ║
║ │ │                                               │ │ │   1,500 students / Multiple campuses;      │ │ │ ║
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

Changes on this page: site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing; ENH-025 calmer type weights).

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

Changes on this page: Batch 1 (no label above the heading); site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing; ENH-025 calmer type weights).

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
