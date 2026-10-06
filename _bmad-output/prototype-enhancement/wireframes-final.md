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
| Home, process | "From your request to launch, in four steps." under a small label, four cards | "How we approach.": a light row of five steps (Discovery to Deployment), one short line each, joined by a line, with "See how we work" to Services, on a blue gradient (now on the page's light blue, with more space and the link over step 05: ENH-070 to ENH-072) | Batch 1, ENH-009, ENH-012 |
| Services, process | "Our 4-D process": four cards | "How we work.": the full five-step component (layered diagram, step tabs with the chosen step highlighted, detail panel) on a blue gradient (now on light blue: ENH-065); About and Contact say five steps | ENH-011 |
| Home, products | Four-app bento with phone mockups, right after the doors | "What we build.": seven equal app cards (PXP, LXP, SXP, IoT, AI Tutor, AI Timetable, AI Grader) in a row with back and forward buttons, below the process | Batch 1, ENH-005, ENH-008, ENH-009, ENH-013, ENH-021 |
| Home, eight services | Eight service cards | Removed from Home (they stay on Services) | Batch 1 |
| Home and News, news | "Latest from XionTechs." with a placeholder note; pills "Product · PXP" | One-line intro with "See all news" on the same row; an app's story shows only the app name in its pill | ENH-007 |
| Products, hero | "Four apps. One connected school." with a breadcrumb, two buttons and tablet and phone mockups, on amber | "Built apart. Better together.", no button, and four app cards (PXP, LXP, SXP, IoT) around an X tile joined by lines, on a warm light background with slowly drifting glows and a Pause motion button (shared with Home) | ENH-014, ENH-018, ENH-020 |
| Products, after the apps | — | New: "A day at school.", a five-step timeline (07:45 to 15:30) on dark blue that plays step by step once, filling the rail and each dot with amber | ENH-015, ENH-023 |
| About, hero | Navy hero "Tech made simple. Solutions made powerful." with a breadcrumb and description; five key-fact figures; "Two strengths, one team." | "We’re XionTechs, technology built with ownership." ("ownership" in amber) over soft pastel peaks; below it the mountain story "Inspired by a mountain. United by purpose.": two chapters (the vision, then the pioneers who founded newXion) beside a transparent mountain that fills to the summit, where newXion labels the X; no place name | ENH-030, ENH-046, ENH-049 to ENH-051, ENH-056, ENH-057 |
| About, FAQ | "Frequently asked questions." above one column of nine bordered cards | "Your question, we answer": the same nine questions in two columns of hairline rows, closed by default, a + or − at the right of each; on white (the clouds and light-to-navy background were removed in ENH-059) | ENH-016, ENH-059 |
| About, FAQ background | — | The clouds and gradient hold still; the drifting and the sheen are gone | ENH-019 |
| About, FAQ last row | The ninth question alone on the last row | "Still have a question? Ask us directly" fills the slot beside it, linking to the contact form | ENH-031 |
| About, hero on very large screens | — | On screens at least 1500 × 1050 the held story widens and grows, roughly halving the empty space below it | ENH-032 |
| Services, whole page | Navy hero; white and grey bands; amber email band | One white-and-amber background flowing down the page (no blue); light hero; How we work on amber with a navy step list (since reworked: navy hero panel, light blue below, ENH-065 and ENH-069) | ENH-033 |
| News, whole page | Light hero with its own glow; white stories; amber email band | White with light blue shading throughout, header included; filter buttons no longer turn into "NaN" | ENH-034 |
| Careers, whole page | Bright amber hero; white and grey bands | One pastel, light-amber background flowing down the page; light hero | ENH-035 |
| News, whole page (again) | Product/Company/Schools/Team filters; compact cards | "What we’re building, learning and sharing"; filters by audience (Schools, Students, Parents, Company); full-photo story cards with the newest featured; hover or focus lifts the card and shows "Read story" | ENH-037 |
| Story page | Placeholder headline and body | An editorial article: Back to News, audience label and date, headline, summary, wide rounded photo, subheadings, amber pull quote, inline photo | ENH-037 |
| Every page, headings | Display headings at 500 (reading as bold); page titles in five sizes; Products titles in the body font | One page-title style; display headings at 300 and card titles at 400; the guideline's line height and letter spacing | ENH-038, ENH-039, ENH-040 |
| Careers, Life at XionTechs | Three photo frames in a row | Replaced by Inside XionTechs tiles (ENH-055); the photo reel is gone | ENH-040, ENH-041, ENH-055 |
| News content | Sample stories | Four newXion newsroom stories (news-style titles, fuller articles) plus marked mock stories for Students and Parents; a lead story and square cards (ENH-053); Home and Products rows use the story cards | ENH-042, ENH-044, ENH-045, ENH-047, ENH-053 |
| Every page, footer | Flat footer top | A mountain ridgeline; a small climber stands at a spot set by the page’s place in the navigation (Home at the foot, Careers on the summit) and walks there between pages | ENH-043 to ENH-045 |
| 404 | “We couldn’t find that page.” | “You’ve wandered off the trail.” with a trail map from You are here to Home | ENH-043 |
| Forms (contact, demo, job) | Check-mark thank-you | A flag rises on a small summit above “Summit reached.” and the thank-you | ENH-043 |
| Email and contact sections | Fixed amber or navy boxes with corner rings | Home's contact, and the email sections on About and News, blend into the colours around them; no rings; Services has no email section (ENH-055); About's is white (ENH-059) | ENH-036, ENH-055, ENH-059 |
| Products, the apps | Four separate sections (PXP, LXP, SXP, IoT) with their own layouts, and a PXP / LXP / SXP / IoT / Updates bar | Seven stacked app cards (SXP, IoT, AI Timetable, AI Grader, PXP, LXP, AI Tutor) that pin and replace one another on desktop; phone or browser mockup, app name, one sentence, a Features list, store or View prototype buttons; School / Parents / Students pills that jump and highlight | ENH-020 |
| Products, background | Separate coloured bands per section | One background flowing down the page: white with amber dots, bright amber through the apps, easing into light blue by AI Tutor, then dark blue to the footer | ENH-022 |
| Products, updates and last band | "See all news" below the stories; navy band with a ring illustration | "See all news" on the heading row; plain dark navy band, continuous with the footer | ENH-024 |
| Every page, type | Bold headings, labels and buttons (600 to 700) | The same fonts and sizes at weight 500; body 400 | ENH-025 |
| Job page and Home contact, phones | The job page ran 89px past a phone screen; Home ran 2px at 320px | Both fit the screen at every width | ENH-026 |
| About, after the intro | Navy offices and email band; blue FAQ | Plain white from the mountain story to the footer; two office cards with a city drawing each (Plano balloons, Ben Thanh Market), local time, delivery-center tag and icon rows for address, phone, WhatsApp and email | ENH-050 to ENH-055, ENH-058, ENH-059 |
| Services, more | Four-step process; email band | "What can we help you achieve?" before How we work; three facts (now the 24/7, 20+ and 25+ cards, ENH-069); no email band | ENH-048, ENH-055 |
| Careers, whole page (again) | Pastel hero; event reel; Why you’ll grow here | "Stay curious. Build what’s next." with the Growth Learning Model cycle; Inside XionTechs tiles; five flip cards; "Find your next challenge."; Why you’ll grow here removed | ENH-049, ENH-054, ENH-055 |
| Products, audience tabs | School / Parents / Students pills with colour dots | Transparent tabs on a light frosted bar; the selected tab is amber only where that reads, navy over amber; reached A day at school dots show a flag | ENH-049 to ENH-052 |
| News, layout | Bento grid of mixed shapes | One large lead story (the newest), then square cards three to a row; two thin company posts removed | ENH-047, ENH-051, ENH-053 |
| Footer, every page | Plain link columns | Products: For schools, For students, For parents; Company: News, About us, Careers; offices with icons, Vietnam Delivery Center first, US Delivery Center second; phone codes in brackets; the climber only climbs; XionTech X as the site icon | ENH-051, ENH-056 to ENH-058 |
| Careers, background | Pastel amber with a navy Inside XionTechs band | One light gradient: light blue at the top, white in the middle, amber towards the footer | ENH-060 |
| Services, top of page | Light hero, facts strip, eight cards in a grid, Three ways, Industries | A rounded navy hero panel and a light blue Eight services panel with a gap between them; four metric cards (24/7, 20+, 25+, 4 industries) sit across the gap; the Eight services heading stays in view beside its cards; Three ways and Industries removed | ENH-061, ENH-069, ENH-071, ENH-072 |
| Services, background and motion | White with amber washes | Light blue below the panels turning white at the end, with white and amber glows; metric cards spring in, service cards rise with a tilt, outcome cards slide in from the sides | ENH-065, ENH-070 |
| Products, audience tabs (again) | Transparent tabs on a frosted strip | Larger tabs with icons on exactly the page colour behind them | ENH-062 |
| News, title, motion and sign-up | What we’re building, learning and sharing; demo email band | Catch up with us; cards unfold one by one as they scroll in; Subscribe to our newsletter with an in-place thank-you | ENH-063, ENH-066 |
| Home, background | Separate white, grey and blue bands | One background: the hero's navy through Our partners and Why XionTechs, lightening through Work built with our partners, light blue behind How we approach, white and light amber into the contact form, with no visible edges | ENH-070 to ENH-073 |
| About, background | White after the intro | White with soft light blue glows | ENH-067 |
| Footer and climber | About; climber outline | About us; Vietnam email; a bolder hiker with an amber backpack; every page leaves room above it | ENH-064, ENH-073 |
| Design system | None | design-system.html: brand, colour, surfaces and page backgrounds, type, space and shape, icons, illustration, components, patterns, motion and voice, all read from css/site.css | ENH-074 |
| Home, hero and order | Product headline, mockups, two figures | What XionTechs does, Get in touch, five figures, two cards across the hero edge; then Capabilities, Core values, How we approach (the 4-D process), case studies, news, contact; no Our partners or What we build | ENH-086 to ENH-088 |
| Products page | Stacked app cards (seven apps) | Four plain cards (Parent Hub, Staff Hub, IoT, AI Tutor) on a navy panel | ENH-087 |
| Process | Five-step How we work | The original 4-D process with QA inside Development | ENH-087 |
| App names | PXP, SXP, LXP | Parent Hub and Staff Hub (P-Hub, S-Hub); no Learner Hub | ENH-086, ENH-087 |
| Footer climber | Stays at the highest page reached | Walks one step up on each page, summit on Careers | ENH-077 |
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
│ [LINK: Home → index.html]                                                                                │
│ [LINK: Products → products.html]                                                                         │
│ [LINK: Services → services.html]                                                                         │
│ [LINK: News → news.html]                                                                                 │
│ [LINK: About → about.html]                                                                               │
│ [LINK: Careers → careers.html]                                                                           │
│ [BUTTON: Menu (small screens only; opens the menu)]                                                      │
│ [BUTTON: EN]                                                                                             │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─ Footer · dark navy · [ENH-056 to ENH-058 (Products by audience, Company: News, About us, Careers; off… ─┐
│ ┌────────────────────────────────┐ ┌────────────────────────────────┐ ┌────────────────────────────────┐ │
│ │ [LINK: XionTechs logo →        │ │ H4: Products                   │ │ H4: Services                   │ │
│ │   index.html]                  │ │ [LINK: For schools →           │ │ [LINK: Product Engineering →   │ │
│ │ Text: Education technology     │ │   products.html#sxp]           │ │ services.html#product-engineer │ │
│ │   products and software        │ │ [LINK: For students →          │ │ ing]                           │ │
│ │   delivery services for        │ │   products.html#ai-tutor]      │ │ [LINK: AI-Driven Analytics →   │ │
│ │   schools and businesses.      │ │ [LINK: For parents →           │ │   services.html#ai-analytics]  │ │
│ │                                │ │   products.html#pxp]           │ │ [LINK: Staffing Service →      │ │
│ │                                │ │                                │ │   services.html#staffing]      │ │
│ │                                │ │                                │ │ [LINK: Low-code Solutions →    │ │
│ │                                │ │                                │ │   services.html#low-code]      │ │
│ │                                │ │                                │ │ [LINK: Cloud Computing →       │ │
│ │                                │ │                                │ │   services.html#cloud]         │ │
│ │                                │ │                                │ │ [LINK: How we work →           │ │
│ │                                │ │                                │ │   services.html#process]       │ │
│ │                                │ │                                │ │ [LINK: All services →          │ │
│ │                                │ │                                │ │   services.html]               │ │
│ └────────────────────────────────┘ └────────────────────────────────┘ └────────────────────────────────┘ │
│ ┌────────────────────────────────┐ ┌────────────────────────────────┐                                    │
│ │ H4: Company                    │ │ H4: Offices                    │                                    │
│ │ [LINK: News → news.html]       │ │ Text: Vietnam Delivery Center  │                                    │
│ │ [LINK: About us → about.html]  │ │   · Floor 15, B1 Building279   │                                    │
│ │ [LINK: Careers → careers.html] │ │   Nguyen Tri Phuong StreetDien │                                    │
│ │                                │ │   Hong Ward, Ho Chi Minh City, │                                    │
│ │                                │ │   Vietnam · (+84) 908 107 552  │                                    │
│ │                                │ │   · vinni.tran@xiontechs.com   │                                    │
│ │                                │ │ Text: US Delivery Center ·     │                                    │
│ │                                │ │   7950 Legacy Drive, Suite     │                                    │
│ │                                │ │   400Plano, Texas 75024, USA · │                                    │
│ │                                │ │   (+1) 469 322 9899 · (+1) 469 │                                    │
│ │                                │ │   439 9345 ·                   │                                    │
│ │                                │ │   vinni.tran@newxion.com       │                                    │
│ └────────────────────────────────┘ └────────────────────────────────┘                                    │
│ Text: © 2026 XionTechs · Privacy policy · GET IT · DONE                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## Home

`index.html` · page title: "XionTechs | School Platforms & Software Outsourcing in Vietnam"

Changes on this page: Batch 1, ENH-001 to ENH-013, ENH-021, ENH-025, ENH-026, ENH-036 (contact section blends in), ENH-037 (news cards show their photo and open their story), ENH-070 to ENH-073 (one background from the hero navy, through blue, into white and amber; more space around Our partners; the section colours below are the no-JavaScript fallback) (see the change list at the top).

```text
╔═ HOME PAGE ══════════════════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. School apps and software teams that get IT done. · dark hero, animated silk · [Batch 1 · ENH-0… ─┐ ║
║ │ [BACKGROUND: animated silk (WebGL)]                                                                  │ ║
║ │ [BUTTON: Pause motion]                                                                               │ ║
║ │ H1: School apps and software teams that get IT done.                                                 │ ║
║ │ Text: XionTechs is an education technology company and software partner. We build connected apps for │ ║
║ │   schools (Parent Hub, Staff Hub and IoT) and deliver digital products for companies, from Ho Chi    │ ║
║ │   Minh City and Plano.                                                                               │ ║
║ │ [BUTTON: Get in touch → #contact]                                                                    │ ║
║ │ H2: Experience you can count on                                                                      │ ║
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
║ │ [LINK: Products for schools · Connected apps for parents, students, teachers, leaders and school     │ ║
║ │   staff. · Parent Hub · Staff Hub · IoT · AI Tutor → products.html]                                  │ ║
║ │ [LINK: Outsourcing services · Your software delivery team · Dedicated teams and end-to-end delivery  │ ║
║ │   for companies building digital products. · Product Engineering · AI-Driven Analytics · Staffing ·  │ ║
║ │   Low-code · Cloud · +3 more → services.html]                                                        │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 2. Capabilities. · light blue · [new in Batch 1 · rebuilt in ENH-004 · on dark blue in ENH-070] ────┐ ║
║ │ H2: Capabilities.                                                                                    │ ║
║ │ Text: Why XionTech: the core capabilities behind every school app and every product we deliver.      │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ [WHOLE CARD IS A LINK → products.html]        │ │ Text: Global delivery                          │ │ ║
║ │ │ Text: School platforms                        │ │ H3: Two offices, one working day.              │ │ ║
║ │ │ H3: Products for schools                      │ │ Text: Teams across time zones keep delivery    │ │ ║
║ │ │ Text: Connected apps for parents, students,   │ │   moving with practical overlap.               │ │ ║
║ │ │   teachers, leaders and school staff,         │ │ Text: Plano · US Central · HCMC · GMT+7        │ │ ║
║ │ │   designed as one ecosystem.                  │ │                                                │ │ ║
║ │ │ Text: P-Hub · Parents · S-Hub · Staff ·       │ │                                                │ │ ║
║ │ │   Facilities                                  │ │                                                │ │ ║
║ │ │ Text: Explore products                        │ │                                                │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ Text: Domain expertise                        │ │ [WHOLE CARD IS A LINK → services.html]         │ │ ║
║ │ │ H3: Deep in education. Built to adapt.        │ │ Text: Software engineering                     │ │ ║
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
║ ┌─ 3. Our core values. · white ────────────────────────────────────────────────────────────────────────┐ ║
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
║ ┌─ 4. How we approach. · white · [the 4-D process in ENH-087 · titled How we approach, replacing the… ─┐ ║
║ │ H2: How we approach.                                                                                 │ ║
║ │ Text: Our 4-D process (Discovery, Design, Development, Deployment) takes your idea to launch, and    │ ║
║ │   every step ends with something you can see and approve.                                            │ ║
║ │ [LINK: See how we work → services.html#process]                                                      │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ • Your request · An idea, a  │ │ Text: 01                     │ │ Text: 02                       │ │ ║
║ │ │   brief or a requirement.    │ │ H3: Discovery                │ │ H3: Design                     │ │ ║
║ │ │                              │ │ Text: Workshops to           │ │ Text: User flows, interfaces   │ │ ║
║ │ │                              │ │   understand your goals,     │ │   and architecture agreed      │ │ ║
║ │ │                              │ │   users, risks and scope.    │ │   before code is written.      │ │ ║
║ │ │                              │ │ Text: You receive · A clear  │ │ Text: You receive · A          │ │ ║
║ │ │                              │ │   scope, estimate and        │ │   clickable prototype and      │ │ ║
║ │ │                              │ │   delivery plan.             │ │   technical design.            │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ Text: 03                     │ │ Text: 04                     │ │ • Launch · And we keep growing │ │ ║
║ │ │ H3: Development              │ │ H3: Deployment               │ │   it together.                 │ │ ║
║ │ │ Text: Agile sprints with     │ │ Text: A safe release,        │ │                                │ │ ║
║ │ │   regular demos. Testing and │ │   monitoring and improvement │ │                                │ │ ║
║ │ │   quality assurance (QA) run │ │   after launch.              │ │                                │ │ ║
║ │ │   inside every sprint, not   │ │ Text: You receive · A live   │ │                                │ │ ║
║ │ │   at the end.                │ │   release with ongoing       │ │                                │ │ ║
║ │ │ Text: You receive · Tested,  │ │   support.                   │ │                                │ │ ║
║ │ │   working software every     │ │                              │ │                                │ │ ║
║ │ │   sprint.                    │ │                              │ │                                │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 5. Work built with our partners. · white · [new in ENH-003 · slider in ENH-006 · blue lightening … ─┐ ║
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
║ ┌─ 6. Latest from XionTechs. · light blue · [ENH-007 · story cards in ENH-042] ────────────────────────┐ ║
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
║ ┌─ 7. Have something you want to build? · amber · [new in ENH-001 · ENH-010 · blended in ENH-036] ─────┐ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ H2: Have something you want to build?         │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │ Text: Tell us a little about yourself and     │ │ │ [FIELD: Your name (text, required)]        │ │ │ ║
║ │ │   what you're working on. Our team will get   │ │ │ error: "Please enter your name."           │ │ │ ║
║ │ │   in touch to learn more.                     │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │ [LINK: vinni.tran@newxion.com →               │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │   mailto:vinni.tran@newxion.com]              │ │ │ [FIELD: Work email (email, required)]      │ │ │ ║
║ │ │ • Plano (+1) 469 322 9899                     │ │ │ error: "Please enter a valid email         │ │ │ ║
║ │ │ • Ho Chi Minh City (+84) 908 107 552          │ │ │     address."                              │ │ │ ║
║ │ │                                               │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │                                               │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │                                               │ │ │ [FIELD: Phone number (optional) (tel)]     │ │ │ ║
║ │ │                                               │ │ │ placeholder: "(+1) 469 322 9899"           │ │ │ ║
║ │ │                                               │ │ │ error: "Please enter a valid phone number, │ │ │ ║
║ │ │                                               │ │ │     for example (+1) 469 322 9899."        │ │ │ ║
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
║ │ │                                               │ │ [AFTER SENDING, replaces the form] Summit      │ │ ║
║ │ │                                               │ │   reached. Thanks — we've received your        │ │ ║
║ │ │                                               │ │   message. / Our team will review what you     │ │ ║
║ │ │                                               │ │   shared and get in touch with you. /          │ │ ║
║ │ │                                               │ │   Prototype: nothing was sent.                 │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ [FOOTER: see "Header and footer"]                                                                        ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## Products

`products.html` · page title: "School Apps: Parent Hub, Staff Hub, IoT & AI Tutor | XionTechs"

Changes on this page: ENH-062 (bigger audience tabs with icons on the page colour); ENH-014 and ENH-018 (hero; display font in ENH-038), ENH-037 (news row shows the app stories with photos), ENH-020 (stacked app cards), ENH-022 (background flow), ENH-023 (A day at school), ENH-024 (updates link, plain email band), ENH-027 to ENH-029 (resizing keeps the card; pill clears once A day at school reaches mid-screen), ENH-049 to ENH-052 (transparent audience tabs that stay readable over amber; “Student learns”; flags on A day at school); site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing; ENH-025 calmer type weights; ENH-038 to ENH-040 one page-title style, lighter display headings and the guideline's heading rhythm; ENH-043 to ENH-045 the footer ridgeline with a climber whose spot follows the page; ENH-051 the climber only climbs and email bands drop the small print; ENH-056 to ENH-058 the updated footer and the site icon; ENH-064 a bolder hiker as the climber; ENH-073 room above the footer climber on every page).

```text
╔═ PRODUCTS PAGE ══════════════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. Built apart. Better together. · warm light, drifting glows · [ENH-014 · ENH-018 · ENH-020] ──────┐ ║
║ │ [BUTTON: Pause motion]                                                                               │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ H1: Built apart. Better together.             │ │ [LINK: Parent experience · Parent Hub → #pxp]  │ │ ║
║ │ │ Text: A connected suite for school            │ │ [LINK: AI tutoring · AI Tutor → #ai-tutor]     │ │ ║
║ │ │   communities — bringing parents, learning,   │ │ [LINK: Staff experience · Staff Hub → #sxp]    │ │ ║
║ │ │   staff operations and campus technology into │ │ [LINK: Connected campus · IoT → #iot]          │ │ ║
║ │ │   one shared ecosystem.                       │ │                                                │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 2. What we build. · [new in ENH-020 · audience tabs in ENH-049 to ENH-052 · bigger tabs with icon… ─┐ ║
║ │ H2: What we build.                                                                                   │ ║
║ │ Text: Four apps that connect parents, schools and students.                                          │ ║
║ │ H3: Parent Hub                                                                                       │ ║
║ │ Text: Keeps parents close to every school day, on their phone.                                       │ ║
║ │ [BUTTON: Download on the · App Store]                                                                │ ║
║ │ [BUTTON: Get it on · Google Play]                                                                    │ ║
║ │ H3: Staff Hub                                                                                        │ ║
║ │ Text: One workspace where staff, teachers and leaders share the same data.                           │ ║
║ │ [BUTTON: View prototype]                                                                             │ ║
║ │ H3: IoT Device Management                                                                            │ ║
║ │ Text: Run classroom devices, lighting, climate and access from one screen.                           │ ║
║ │ [BUTTON: View prototype]                                                                             │ ║
║ │ H3: AI Tutor                                                                                         │ ║
║ │ Text: Solve new problems on your own. Not just read solutions.                                       │ ║
║ │ [BUTTON: View prototype → https://xt-ai-tutor-demo.azurewebsites.net/]                               │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 3. A day at school. · dark navy · [new in ENH-015 · rebuilt in ENH-023 · display font in ENH-040 … ─┐ ║
║ │ H2: A day at school.                                                                                 │ ║
║ │ Text: Follow one student journey through a typical school day and see how students, parents and      │ ║
║ │   school staff stay informed and connected across each step.                                         │ ║
║ │ [TIMELINE PLAYS ONCE on arrival: step by step every 1.8s, the rail and each dot fill with amber;     │ ║
║ │   resets only above the section]                                                                     │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ Text: 07:45                  │ │ Text: 08:00                  │ │ Text: 08:01                    │ │ ║
║ │ │ H3: Student arrives          │ │ H3: Attendance recorded      │ │ H3: Parent updated             │ │ ║
║ │ │ Text: The student arrives on │ │ Text: A teacher marks the    │ │ Text: Parent Hub notifies      │ │ ║
║ │ │   campus.                    │ │   student's attendance in    │ │   parents that the student is  │ │ ║
║ │ │                              │ │   Staff Hub.                 │ │   at school.                   │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐                                    │ ║
║ │ │ Text: 09:30                  │ │ Text: 15:30                  │                                    │ ║
║ │ │ H3: Student learns           │ │ H3: Day stays connected      │                                    │ ║
║ │ │ Text: Students practise and  │ │ Text: Notifications and      │                                    │ ║
║ │ │   ask questions with the AI  │ │   school information stay    │                                    │ ║
║ │ │   Tutor.                     │ │   connected across the       │                                    │ ║
║ │ │                              │ │   system.                    │                                    │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘                                    │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 4. Product updates. · light blue · [ENH-024 · story cards in ENH-042] ──────────────────────────────┐ ║
║ │ H2: Product updates.                                                                                 │ ║
║ │ Text: New features and stories from Parent Hub, Staff Hub, IoT and the AI Tutor.                     │ ║
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
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ [FOOTER: see "Header and footer"]                                                                        ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## Services

`services.html` · page title: "Software Outsourcing Vietnam | Product Engineering, AI, Low-code & Cloud | XionTechs"

Changes on this page: ENH-061, ENH-065 and ENH-069 to ENH-072 (rounded navy hero and light blue Eight services panels with four metric cards across the gap, a sticky Eight services heading beside its cards, Three ways and Industries sections removed, navy to light blue to white, playful entrances); ENH-011 (the five-step How we work. replaces the 4-D process); ENH-033 (one white-and-amber background, light hero; the section colours below are the no-JavaScript fallback); ENH-036 (email section blends in); ENH-048 (white with pastel amber; What can we help you achieve? before How we work; three facts, now cards); ENH-055 (no email band); site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing; ENH-025 calmer type weights; ENH-038 to ENH-040 one page-title style, lighter display headings and the guideline's heading rhythm; ENH-043 to ENH-045 the footer ridgeline with a climber whose spot follows the page; ENH-051 the climber only climbs and email bands drop the small print; ENH-056 to ENH-058 the updated footer and the site icon; ENH-064 a bolder hiker as the climber; ENH-073 room above the footer climber on every page).

```text
╔═ SERVICES PAGE ══════════════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. Software teams that get IT done. · light hero · [light hero in ENH-033 · rounded navy panel, o… ─┐ ║
║ │ [BACKGROUND: animated strands]                                                                       │ ║
║ │ Breadcrumb: Home › Services                                                                          │ ║
║ │ H1: Software teams that get IT done.                                                                 │ ║
║ │ Text: Product engineering, AI, low-code and cloud delivery from Ho Chi Minh City, working across     │ ║
║ │   USA, Europe and Australia time zones.                                                              │ ║
║ │ [BUTTON: Start a project → demo.html#form]                                                           │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 2. Eight services, one team. · light blue · [sticky heading beside the cards in ENH-061 · light b… ─┐ ║
║ │ H2: Eight services, one team.                                                                        │ ║
║ │ Text: Pick one service or combine several. We shape the team around your product.                    │ ║
║ │ H3: Product Engineering                                                                              │ ║
║ │ Text: Transform innovative ideas into market-ready digital products with end-to-end engineering      │ ║
║ │   expertise.                                                                                         │ ║
║ │ Text: Web · Mobile                                                                                   │ ║
║ │ H3: AI-Driven Analytics                                                                              │ ║
║ │ Text: Transform raw data into actionable intelligence using AI and advanced visualisation.           │ ║
║ │ Text: AI/ML · Dashboards                                                                             │ ║
║ │ H3: Product Co-Creation                                                                              │ ║
║ │ Text: Accelerate innovation by combining your domain knowledge with our technical expertise.         │ ║
║ │ H3: Staffing Service                                                                                 │ ║
║ │ Text: Access specialised technology talent when you need it, with flexible options.                  │ ║
║ │ H3: Custom App Development                                                                           │ ║
║ │ Text: Develop custom solutions aligned with your unique requirements.                                │ ║
║ │ H3: Low-code Solutions                                                                               │ ║
║ │ Text: Ship tools and automations faster on leading low-code platforms.                               │ ║
║ │ Text: Power Platform · Make · n8n · Retool · Bubble                                                  │ ║
║ │ H3: AI-Powered Solutions                                                                             │ ║
║ │ Text: Harness artificial intelligence to transform your operations.                                  │ ║
║ │ Text: Generative AI · AI/ML                                                                          │ ║
║ │ H3: Cloud Computing                                                                                  │ ║
║ │ Text: Expert solutions on Azure, AWS and GCP.                                                        │ ║
║ │ Text: Azure · AWS · GCP                                                                              │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 3. What can we help you achieve? · white · [new in ENH-048 · more space above in ENH-072] ──────────┐ ║
║ │ H2: What can we help you achieve?                                                                    │ ║
║ │ Text: 01                                                                                             │ ║
║ │ H3: Build a new digital product                                                                      │ ║
║ │ Text: Move from discovery and UX into engineering, testing and launch with one delivery team.        │ ║
║ │ Text: 02                                                                                             │ ║
║ │ H3: Extend your team                                                                                 │ ║
║ │ Text: Add specialised technology talent when your internal team needs more capacity or specific      │ ║
║ │   skills.                                                                                            │ ║
║ │ Text: 03                                                                                             │ ║
║ │ H3: Modernise an existing platform                                                                   │ ║
║ │ Text: Improve applications, infrastructure, cloud delivery and engineering practices while           │ ║
║ │   protecting what already works.                                                                     │ ║
║ │ Text: 04                                                                                             │ ║
║ │ H3: Apply AI where it creates value                                                                  │ ║
║ │ Text: Use AI, analytics and automation to improve products, workflows and business decision-making.  │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 4. Our 4-D process: from your request to launch. · white · [five steps in ENH-011 (full version) … ─┐ ║
║ │ H2: Our 4-D process: from your request to launch.                                                    │ ║
║ │ Text: Every step ends with something you can see, test and approve.                                  │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ • Your request · An idea, a  │ │ Text: 01                     │ │ Text: 02                       │ │ ║
║ │ │   brief or a requirement.    │ │ H3: Discovery                │ │ H3: Design                     │ │ ║
║ │ │                              │ │ Text: Workshops to           │ │ Text: User flows, interfaces   │ │ ║
║ │ │                              │ │   understand your goals,     │ │   and architecture agreed      │ │ ║
║ │ │                              │ │   users, risks and scope.    │ │   before code is written.      │ │ ║
║ │ │                              │ │ Text: You receive · A clear  │ │ Text: You receive · A          │ │ ║
║ │ │                              │ │   scope, estimate and        │ │   clickable prototype and      │ │ ║
║ │ │                              │ │   delivery plan.             │ │   technical design.            │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ Text: 03                     │ │ Text: 04                     │ │ • Launch · And we keep growing │ │ ║
║ │ │ H3: Development              │ │ H3: Deployment               │ │   it together.                 │ │ ║
║ │ │ Text: Agile sprints with     │ │ Text: A safe release,        │ │                                │ │ ║
║ │ │   regular demos. Testing and │ │   monitoring and improvement │ │                                │ │ ║
║ │ │   quality assurance (QA) run │ │   after launch.              │ │                                │ │ ║
║ │ │   inside every sprint, not   │ │ Text: You receive · A live   │ │                                │ │ ║
║ │ │   at the end.                │ │   release with ongoing       │ │                                │ │ ║
║ │ │ Text: You receive · Tested,  │ │   support.                   │ │                                │ │ ║
║ │ │   working software every     │ │                              │ │                                │ │ ║
║ │ │   sprint.                    │ │                              │ │                                │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ [FOOTER: see "Header and footer"]                                                                        ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## About

`about.html` · page title: "About XionTechs | Get IT Done"

Changes on this page: ENH-067 (soft light blue glows); ENH-046 and ENH-049 to ENH-059 (a We’re XionTechs intro over pastel peaks, then the mountain story with newXion at the peak and no place name, core values, FAQ, two office cards with city drawings and icon rows, all on white after the intro); ENH-030 (the mountain story; the old hero, key facts and "Two strengths, one team." are gone); ENH-031 (FAQ last slot asks for more questions); ENH-032 (the story grows on very large screens); ENH-036 then ENH-059 (email section on white, the navy footer follows); Batch 1 (no label above "Our core values."); ENH-011 (FAQ says five steps); ENH-016 (FAQ rebuilt), ENH-019 (FAQ background holds still); site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing; ENH-025 calmer type weights; ENH-038 to ENH-040 one page-title style, lighter display headings and the guideline's heading rhythm; ENH-043 to ENH-045 the footer ridgeline with a climber whose spot follows the page; ENH-051 the climber only climbs and email bands drop the small print; ENH-056 to ENH-058 the updated footer and the site icon; ENH-064 a bolder hiker as the climber; ENH-073 room above the footer climber on every page).

```text
╔═ ABOUT PAGE ═════════════════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. We’re XionTechs, technology built with ownership. · [We’re XionTechs intro in ENH-049 · rounde… ─┐ ║
║ │ H1: We’re XionTechs, technology built with ownership.                                                │ ║
║ │ Text: We bring people, ideas and technology together to build exceptional IT systems and shape a     │ ║
║ │   brighter future for all. From Ho Chi Minh City and Plano, we build our own platforms for schools   │ ║
║ │   and deliver digital products for clients around the world.                                         │ ║
║ │ [LINK: Explore our products → products.html]                                                         │ ║
║ │ [LINK: Explore our services → services.html]                                                         │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 2. Inspired by a mountain. United by purpose. · white · [the mountain story (ENH-030) moved below… ─┐ ║
║ │ H2: Inspired by a mountain. United by purpose.                                                       │ ║
║ │ H3: 01 The inspiration                                                                               │ ║
║ │ Text: Our name is inspired by a mountain: a place people look up to, gather around and climb         │ ║
║ │   together towards a brighter future.                                                                │ ║
║ │ H3: 02 The purpose                                                                                   │ ║
║ │ Text: Inspired by this vision, a group of pioneers established newXion in America. Guided by         │ ║
║ │   enduring core values, they set out to build a community true to the spirit of the mountain: where  │ ║
║ │   people unite, harness cutting-edge technology, and build exceptional IT systems to advance         │ ║
║ │   humanity and shape a brighter future for all.                                                      │ ║
║ │ Text: Our inspiration is a mountain. Our purpose is people.                                          │ ║
║ │ Text: Vision · Community · Technology                                                                │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 3. Your question, we answer · white · [rebuilt in ENH-016 · background stilled in ENH-019 · last … ─┐ ║
║ │ H2: Your question, we answer                                                                         │ ║
║ │ Text: Straight answers about our products, our services and how we work.                             │ ║
║ │ [FAQ, opens on click] Q: What does XionTechs do?                                                     │ ║
║ │ A: We build our own school platforms (Parent Hub, Staff Hub and IoT Device Management) and deliver   │ ║
║ │     software for other companies: product engineering, AI-driven analytics, product co-creation and  │ ║
║ │     staffing.                                                                                        │ ║
║ │ [FAQ, opens on click] Q: Which industries do you work with?                                          │ ║
║ │ A: EdTech is our core. We also serve Healthcare, Logistics and Private Equity.                       │ ║
║ │ [FAQ, opens on click] Q: How can our school try Parent Hub or Staff Hub?                             │ ║
║ │ A: Book a demo. We walk you through the apps using scenarios from your own school.                   │ ║
║ │ [FAQ, opens on click] Q: How do you work across time zones?                                          │ ║
║ │ A: Our teams in Ho Chi Minh City and Plano cover USA, Europe and Australia time zones, with shared   │ ║
║ │     tools for real-time updates.                                                                     │ ║
║ │ [FAQ, opens on click] Q: When do you shape the solution to our needs?                                │ ║
║ │ A: From the start. Discovery, the first of our four steps, sets your goals, users and scope before   │ ║
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
║ │ [LINK: Still have a question? Ask us directly → index.html#contact]                                  │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 4. Two offices, serving the world. · white · [city drawings in ENH-050 to ENH-052 · smaller, furt… ─┐ ║
║ │ H2: Two offices, serving the world.                                                                  │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ Text: US Central                              │ │ Text: GMT+7                                    │ │ ║
║ │ │ H3: Plano, Texas, USA                         │ │ H3: Ho Chi Minh City, Vietnam                  │ │ ║
║ │ │ Text: US Delivery Center                      │ │ Text: Vietnam Delivery Center                  │ │ ║
║ │ │ Text: 7950 Legacy Drive, Suite 400 Plano,     │ │ Text: Floor 15, B1 Building 279 Nguyen Tri     │ │ ║
║ │ │   Texas 75024, USA                            │ │   Phuong Street Dien Hong Ward, Ho Chi Minh    │ │ ║
║ │ │ Text: (+1) 469 322 9899                       │ │   City, Vietnam                                │ │ ║
║ │ │ Text: (+1) 469 439 9345                       │ │ Text: (+84) 908 107 552                        │ │ ║
║ │ │ Text: vinni.tran@newxion.com                  │ │ Text: vinni.tran@xiontechs.com                 │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 5. See our apps in action. · white · [blended in ENH-036 · white in ENH-059] ───────────────────────┐ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ H2: See our apps in action.                   │ │ [FIELD: Work email (email, required)]          │ │ ║
║ │ │ Text: Leave your work email and we'll arrange │ │ placeholder: "name@company.com"                │ │ ║
║ │ │   a walkthrough of Parent Hub and Staff Hub.  │ │ [BUTTON: Book a demo]                          │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ [FOOTER: see "Header and footer"]                                                                        ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## News

`news.html` · page title: "News | XionTechs"

Changes on this page: ENH-063 and ENH-066 (Catch up with us; cards unfold one by one as they scroll in; a newsletter sign-up); ENH-007 (a story about an app shows the app name in its pill); ENH-034 (white with light blue throughout; filter buttons no longer turn into NaN; the section colours below are the no-JavaScript fallback); ENH-037 (audience filter and full-photo story cards); ENH-047 (two thin company posts removed); ENH-053 (one large lead story, then square cards three to a row); ENH-036 (email section blends in); site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing; ENH-025 calmer type weights; ENH-038 to ENH-040 one page-title style, lighter display headings and the guideline's heading rhythm; ENH-043 to ENH-045 the footer ridgeline with a climber whose spot follows the page; ENH-051 the climber only climbs and email bands drop the small print; ENH-056 to ENH-058 the updated footer and the site icon; ENH-064 a bolder hiker as the climber; ENH-073 room above the footer climber on every page).

```text
╔═ NEWS PAGE ══════════════════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. Catch up with us · light hero · [white and light blue in ENH-034 · rebuilt in ENH-037 · newsro… ─┐ ║
║ │ H1: Catch up with us                                                                                 │ ║
║ │ Text: Stay informed with the latest news and announcements, fresh off the press.                     │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 2. All stories · white ─────────────────────────────────────────────────────────────────────────────┐ ║
║ │ [BUTTON: All]                                                                                        │ ║
║ │ [BUTTON: Schools]                                                                                    │ ║
║ │ [BUTTON: Students]                                                                                   │ ║
║ │ [BUTTON: Parents]                                                                                    │ ║
║ │ [BUTTON: Company]                                                                                    │ ║
║ │ Text: Stories from the newXion newsroom; those marked [Placeholder] are samples.                     │ ║
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
║ ┌─ 3. Subscribe to our newsletter. · white · [blended in ENH-036 · newsletter sign-up in ENH-066] ─────┐ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ H2: Subscribe to our newsletter.              │ │ [FIELD: Your email (email, required)]          │ │ ║
║ │ │ Text: Get our latest news, product updates    │ │ placeholder: "name@example.com"                │ │ ║
║ │ │   and stories from the team, straight to your │ │ [BUTTON: Subscribe]                            │ │ ║
║ │ │   inbox.                                      │ │ [AFTER SENDING, replaces the form] You’re      │ │ ║
║ │ │                                               │ │   subscribed. Look out for our next            │ │ ║
║ │ │                                               │ │   newsletter.                                  │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ [FOOTER: see "Header and footer"]                                                                        ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## News story

`news-story.html` · page title: "How our team is putting agentic AI to work every day | XionTechs"

Changes on this page: ENH-037 (an editorial article: label, date, headline, summary, wide photo); ENH-042 and ENH-044 (each story's own text, with subheadings, from the newXion newsroom); site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing; ENH-025 calmer type weights; ENH-038 to ENH-040 one page-title style, lighter display headings and the guideline's heading rhythm; ENH-043 to ENH-045 the footer ridgeline with a climber whose spot follows the page; ENH-051 the climber only climbs and email bands drop the small print; ENH-056 to ENH-058 the updated footer and the site icon; ENH-064 a bolder hiker as the climber; ENH-073 room above the footer climber on every page).

```text
╔═ NEWS STORY PAGE ════════════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. How our team is putting agentic AI to work every… · light hero · [editorial article in ENH-037] ─┐ ║
║ │ [LINK: Back to News → news.html]                                                                     │ ║
║ │ Text: Company · 31 Jul 2026                                                                          │ ║
║ │ H1: How our team is putting agentic AI to work every day                                             │ ║
║ │ Text: At our “Thực Chiến AI với Agentic Workflow” workshop, team members showed how they use AI      │ ║
║ │   tools in their everyday work, then stayed on to celebrate together.                                │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 2. Story · white ───────────────────────────────────────────────────────────────────────────────────┐ ║
║ │ Text: Applying AI not only to software development but also to everyday work activities is becoming  │ ║
║ │   increasingly important for improving productivity and efficiency. That idea shaped the internal    │ ║
║ │   workshop we held on July 31.                                                                       │ ║
║ │ H2: Learning from the people doing the work                                                          │ ║
║ │ Text: The “Thực Chiến AI với Agentic Workflow” workshop was led by our own team members. Colleagues  │ ║
║ │   shared practical experiences from their day-to-day roles and demonstrated how they leverage AI     │ ║
║ │   tools to take on parts of their daily work.                                                        │ ║
║ │ Text: Because the examples came from real work, the session quickly became an exchange of ideas.     │ ║
║ │   Team members learned from one another and explored new ways to integrate AI into their own         │ ║
║ │   workflows, so they can work smarter and more effectively.                                          │ ║
║ │ H2: Beyond the workshop                                                                              │ ║
║ │ Text: To conclude the event, we enjoyed a team-building gathering where conversations extended       │ ║
║ │   beyond work. It was a valuable time to connect, share personal experiences and strengthen          │ ║
║ │   relationships across the team.                                                                     │ ║
║ │ Text: Moments like this reinforce the culture that makes newXion feel not just like a workplace, but │ ║
║ │   like a family, and keep learning an everyday habit rather than a one-off event.                    │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ [FOOTER: see "Header and footer"]                                                                        ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## Careers

`careers.html` · page title: "Careers at XionTechs | Software Jobs in Ho Chi Minh City"

Changes on this page: ENH-060 (light blue into white and amber, no navy band); ENH-035 (one pastel light-amber background, light hero; the section colours below are the no-JavaScript fallback); ENH-041 (event reel, later replaced); ENH-049 and ENH-055 (Stay curious. Build what’s next. hero with the Growth Learning Model, Inside XionTechs tiles, five flip cards, Find your next challenge.; Why you’ll grow here removed); site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing; ENH-025 calmer type weights; ENH-038 to ENH-040 one page-title style, lighter display headings and the guideline's heading rhythm; ENH-043 to ENH-045 the footer ridgeline with a climber whose spot follows the page; ENH-051 the climber only climbs and email bands drop the small print; ENH-056 to ENH-058 the updated footer and the site icon; ENH-064 a bolder hiker as the climber; ENH-073 room above the footer climber on every page).

```text
╔═ CAREERS PAGE ═══════════════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. Stay curious. Build what’s next. · light hero · [Stay curious. Build what’s next. with the Gro… ─┐ ║
║ │ H1: Stay curious. Build what’s next.                                                                 │ ║
║ │ Text: We’re building a team for people who learn fast, ask better questions, adapt when things       │ ║
║ │   change, and care about the outcome, not just the task.                                             │ ║
║ │ [BUTTON: Explore open roles → #roles]                                                                │ ║
║ │ Text: Growth                                                                                         │ ║
║ │ Text: 01 · Curious                                                                                   │ ║
║ │ Text: 02 · Learn                                                                                     │ ║
║ │ Text: 03 · Ask                                                                                       │ ║
║ │ Text: 04 · Grow                                                                                      │ ║
║ │ Text: 05 · Improve                                                                                   │ ║
║ │ Text: Growth Learning Model                                                                          │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 2. Inside XionTechs. · [Inside XionTechs tiles in ENH-055 · on the light gradient in ENH-060] ──────┐ ║
║ │ H2: Inside XionTechs.                                                                                │ ║
║ │ Text: A look at the moments that shape life here: workshops, project starts, team days,              │ ║
║ │   celebrations, shared learning and the small moments in between.                                    │ ║
║ │ Text: Learn together                                                                                 │ ║
║ │ H3: Workshops & experiments                                                                          │ ║
║ │ Text: Hands-on sessions where the team tries new tools, agentic workflows and better ways to work.   │ ║
║ │ Text: Build relationships                                                                            │ ║
║ │ H3: Client visits                                                                                    │ ║
║ │ Text: Understand context directly and build stronger working relationships.                          │ ║
║ │ Text: Shared direction                                                                               │ ║
║ │ H3: Town halls                                                                                       │ ║
║ │ Text: What changed, what matters now, and where we’re going next.                                    │ ║
║ │ Text: Start together                                                                                 │ ║
║ │ H3: Project kickoffs                                                                                 │ ║
║ │ Text: New work starts with shared context, not a mysterious task list.                               │ ║
║ │ Text: Celebrate progress                                                                             │ ║
║ │ H3: Celebration                                                                                      │ ║
║ │ Text: Because shipped work deserves more than a green status label.                                  │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 3. Five things that shape the way we work. · white · [five flip cards in ENH-055] ──────────────────┐ ║
║ │ H2: Five things that shape the way we work.                                                          │ ║
║ │ Text: These are the behaviours we want people to experience from us every day. Flip a card to see    │ ║
║ │   what each one means in practice.                                                                   │ ║
║ │ [BUTTON: 01 · Stay agile · Flip for details]                                                         │ ║
║ │ [BUTTON: 02 · Own the outcome · Flip for details]                                                    │ ║
║ │ [BUTTON: 03 · Innovate with purpose · Flip for details]                                              │ ║
║ │ [BUTTON: 04 · Grow together · Flip for details]                                                      │ ║
║ │ [BUTTON: 05 · Get IT Done · Flip for details]                                                        │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 4. Find your next challenge. · white · [Find your next challenge. in ENH-049] ──────────────────────┐ ║
║ │ H2: Find your next challenge.                                                                        │ ║
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
║ [FOOTER: see "Header and footer"]                                                                        ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## Job

`job.html` · page title: "[Placeholder] Job title | Careers at XionTechs"

Changes on this page: ENH-026 (fits phone screens); site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing; ENH-025 calmer type weights; ENH-038 to ENH-040 one page-title style, lighter display headings and the guideline's heading rhythm; ENH-043 to ENH-045 the footer ridgeline with a climber whose spot follows the page; ENH-051 the climber only climbs and email bands drop the small print; ENH-056 to ENH-058 the updated footer and the site icon; ENH-064 a bolder hiker as the climber; ENH-073 room above the footer climber on every page).

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
║ │ │                                               │ │ [AFTER SENDING, replaces the form] Summit      │ │ ║
║ │ │                                               │ │   reached. Thank you! / We've received your    │ │ ║
║ │ │                                               │ │   application and will be in touch if it's a   │ │ ║
║ │ │                                               │ │   match. (Prototype: nothing was sent.)        │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ [FOOTER: see "Header and footer"]                                                                        ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## Contact

`demo.html` · page title: "Book a Demo or Start a Project | XionTechs"

Changes on this page: ENH-011 (checklist says five steps); site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing; ENH-025 calmer type weights; ENH-038 to ENH-040 one page-title style, lighter display headings and the guideline's heading rhythm; ENH-043 to ENH-045 the footer ridgeline with a climber whose spot follows the page; ENH-051 the climber only climbs and email bands drop the small print; ENH-056 to ENH-058 the updated footer and the site icon; ENH-064 a bolder hiker as the climber; ENH-073 room above the footer climber on every page).

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
║ │ │ • A walkthrough of Parent Hub and Staff Hub   │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │   using your school's scenarios.              │ │ │ [FIELD: Full name (text, required)]        │ │ │ ║
║ │ │ • Answers on setup, data and support.         │ │ │ error: "Please enter your name."           │ │ │ ║
║ │ │ • For projects: a first Discovery             │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │   conversation, the first of our four steps.  │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │ ┌───────────────────────────────────────────┐ │ │ │ [FIELD: Work email (email, required)]      │ │ │ ║
║ │ │ │ Text: Plano, Texas, USA                   │ │ │ │ error: "Please enter a valid email         │ │ │ ║
║ │ │ │ Text: 7950 Legacy Drive, Suite 400 Plano, │ │ │ │     address."                              │ │ │ ║
║ │ │ │   Texas 75024, USA                        │ │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │ │ [LINK: (+1) 469 322 9899 →                │ │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │ │   tel:+14693229899]                       │ │ │ │ [FIELD: School or company (text,           │ │ │ ║
║ │ │ │ [LINK: WhatsApp (+1) 469 439 9345 →       │ │ │ │   required)]                               │ │ │ ║
║ │ │ │   https://wa.me/14694399345]              │ │ │ │ error: "Please enter your organisation."   │ │ │ ║
║ │ │ │ [LINK: vinni.tran@newxion.com →           │ │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │ │   mailto:vinni.tran@newxion.com]          │ │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │ └───────────────────────────────────────────┘ │ │ │ [FIELD: Your role (text)]                  │ │ │ ║
║ │ │ ┌───────────────────────────────────────────┐ │ │ │ help: "For example: Principal, Head of IT" │ │ │ ║
║ │ │ │ Text: Ho Chi Minh City, Vietnam           │ │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │ │ Text: Vietnam Delivery Center             │ │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │ │ Text: Floor 15, B1 Building 279 Nguyen    │ │ │ │ [CHECKBOXES: Products of interest: Parent  │ │ │ ║
║ │ │ │   Tri Phuong Street Dien Hong Ward, Ho    │ │ │ │   Hub / Staff Hub / IoT; Product demo tab  │ │ │ ║
║ │ │ │   Chi Minh City, Vietnam                  │ │ │ │   only]                                    │ │ │ ║
║ │ │ │ [LINK: (+84) 908 107 552 →                │ │ │ └────────────────────────────────────────────┘ │ │ ║
║ │ │ │   tel:+84908107552]                       │ │ │ ┌────────────────────────────────────────────┐ │ │ ║
║ │ │ │ [LINK: vinni.tran@xiontechs.com →         │ │ │ │ [FIELD: School size (dropdown: Under 500   │ │ │ ║
║ │ │ │   mailto:vinni.tran@xiontechs.com]        │ │ │ │   students / 500 to 1,500 students / Over  │ │ │ ║
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
║ │ │                                               │ │ [AFTER SENDING, replaces the form] Summit      │ │ ║
║ │ │                                               │ │   reached. Thank you! / We will be in touch    │ │ ║
║ │ │                                               │ │   soon. (Prototype: nothing was sent.)         │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ [FOOTER: see "Header and footer"]                                                                        ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```

## Privacy policy

`privacy.html` · page title: "Privacy Policy | XionTechs"

Changes on this page: site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing; ENH-025 calmer type weights; ENH-038 to ENH-040 one page-title style, lighter display headings and the guideline's heading rhythm; ENH-043 to ENH-045 the footer ridgeline with a climber whose spot follows the page; ENH-051 the climber only climbs and email bands drop the small print; ENH-056 to ENH-058 the updated footer and the site icon; ENH-064 a bolder hiker as the climber; ENH-073 room above the footer climber on every page).

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

Changes on this page: Batch 1 (no label above the heading); ENH-043 (You’ve wandered off the trail, with a trail map); ENH-052 (no underline in the heading); site-wide rules only (Batch 1 readability; ENH-004 heading-first reveal; ENH-006 and ENH-009 spacing; ENH-025 calmer type weights; ENH-038 to ENH-040 one page-title style, lighter display headings and the guideline's heading rhythm; ENH-043 to ENH-045 the footer ridgeline with a climber whose spot follows the page; ENH-051 the climber only climbs and email bands drop the small print; ENH-056 to ENH-058 the updated footer and the site icon; ENH-064 a bolder hiker as the climber; ENH-073 room above the footer climber on every page).

```text
╔═ NOT FOUND (404) PAGE ═══════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. You’ve wandered off the trail. · navy hero · [lost-trail map in ENH-043] ────────────────────────┐ ║
║ │ H1: You’ve wandered off the trail.                                                                   │ ║
║ │ Text: The page you were looking for isn’t here. Follow the trail back home, or pick a path below.    │ ║
║ │ [BUTTON: Go to Home → index.html]                                                                    │ ║
║ │ [BUTTON: Products → products.html]                                                                   │ ║
║ │ [BUTTON: Services → services.html]                                                                   │ ║
║ │ [BUTTON: News → news.html]                                                                           │ ║
║ │ Text: You are here Home                                                                              │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ [FOOTER: see "Header and footer"]                                                                        ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝
```
