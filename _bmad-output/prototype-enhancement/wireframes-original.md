# Prototype wireframes: original

Owner: Amber Do. The first draft of the prototype, as merged into `develop` with PR #4 (then in
`mockups/site-v3`), before any enhancement. It does not change. The current version, with every change tracked, is
`wireframes-final.md`. Source: `develop` at commit ae606f7, folder `mockups/site-v3`.

Each page is one frame (double line), drawn top to bottom as it appears on a desktop screen. Inside it, each section is a
block (single line); columns and cards that sit side by side on screen sit side by side here (at most three per row; grids
with more columns continue on the next row). On phones every block stacks into one column. English text only; every string
also has a Vietnamese version in the prototype.

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
┌─ Header · sticky, glass ─────────────────────────────────────────────────────────────────────────────────┐
│ [LINK: Skip to content → #main]                                                                          │
│ [LINK: XionTechs home → index.html]                                                                      │
│ [BUTTON: Book a demo → demo.html]                                                                        │
│ [BUTTON: Products]                                                                                       │
│ ┌─────────────────────────────────────────────────┐ ┌──────────────────────────────────────────────────┐ │
│ │ [WHOLE CARD IS A LINK → products.html#pxp]      │ │ [WHOLE CARD IS A LINK → products.html#lxp]       │ │
│ │ Text: PXP · Parent eXperience Place. The school │ │ Text: LXP · Learner eXperience Place. Lessons,   │ │
│ │   day in every parent's pocket. · Parents       │ │   tasks and progress for students. · Students    │ │
│ └─────────────────────────────────────────────────┘ └──────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────┐ ┌──────────────────────────────────────────────────┐ │
│ │ [WHOLE CARD IS A LINK → products.html#sxp]      │ │ [WHOLE CARD IS A LINK → products.html#iot]       │ │
│ │ Text: SXP · Staff eXperience Place. One         │ │ Text: IoT Device Management · Control campus     │ │
│ │   workspace, role-based views. · Staff ·        │ │   devices from one screen. · School staff and    │ │
│ │   Teachers · Leaders                            │ │   facilities                                     │ │
│ └─────────────────────────────────────────────────┘ └──────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────┐                                                      │
│ │ Text: More products are on the way.             │                                                      │
│ │ [LINK: All products → products.html]            │                                                      │
│ └─────────────────────────────────────────────────┘                                                      │
│ [BUTTON: Services]                                                                                       │
│ ┌─────────────────────────────────────────────────┐ ┌──────────────────────────────────────────────────┐ │
│ │ [LINK: Product Engineering →                    │ │ [LINK: AI-Driven Analytics →                     │ │
│ │   services.html#product-engineering]            │ │   services.html#ai-analytics]                    │ │
│ └─────────────────────────────────────────────────┘ └──────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────┐ ┌──────────────────────────────────────────────────┐ │
│ │ [LINK: Product Co-Creation →                    │ │ [LINK: Staffing Service →                        │ │
│ │   services.html#co-creation]                    │ │   services.html#staffing]                        │ │
│ └─────────────────────────────────────────────────┘ └──────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────┐ ┌──────────────────────────────────────────────────┐ │
│ │ [LINK: Custom App Development →                 │ │ [LINK: Low-code Solutions →                      │ │
│ │   services.html#custom-apps]                    │ │   services.html#low-code]                        │ │
│ └─────────────────────────────────────────────────┘ └──────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────┐ ┌──────────────────────────────────────────────────┐ │
│ │ [LINK: AI-Powered Solutions →                   │ │ [LINK: Cloud Computing → services.html#cloud]    │ │
│ │   services.html#ai-solutions]                   │ │                                                  │ │
│ └─────────────────────────────────────────────────┘ └──────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────┐                                                      │
│ │ Text: Our 4-D process: Discovery, Design,       │                                                      │
│ │   Development, Deployment.                      │                                                      │
│ │ [LINK: See the process → services.html#process] │                                                      │
│ └─────────────────────────────────────────────────┘                                                      │
│ [LINK: News → news.html]                                                                                 │
│ [LINK: About → about.html]                                                                               │
│ [LINK: Careers → careers.html]                                                                           │
│ [BUTTON: EN]                                                                                             │
│ [BUTTON: VI]                                                                                             │
│ [BUTTON: Book a demo → demo.html]                                                                        │
│ [BUTTON: Menu (small screens only; opens the menu)]                                                      │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─ Footer · dark navy ─────────────────────────────────────────────────────────────────────────────────────┐
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

```text
╔═ HOME PAGE ══════════════════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. Every school community, connected. · dark hero, animated silk ───────────────────────────────────┐ ║
║ │ [BACKGROUND: animated silk (WebGL)]                                                                  │ ║
║ │ [BUTTON: Pause motion]                                                                               │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ Text: EdTech products · Software services     │ │ [IMAGE: Web app screenshot · 1440 × 1080]      │ │ ║
║ │ │ H1: Every school community, connected.        │ │ [IMAGE: Phone screenshot · 1170 × 2532]        │ │ ║
║ │ │ Text: PXP for parents, LXP for learners, SXP  │ │                                                │ │ ║
║ │ │   for staff. And the engineering team behind  │ │                                                │ │ ║
║ │ │   them, ready to build yours.                 │ │                                                │ │ ║
║ │ │ [BUTTON: Explore our products →               │ │                                                │ │ ║
║ │ │   products.html]                              │ │                                                │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
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
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 2. What we do ──────────────────────────────────────────────────────────────────────────────────────┐ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ [WHOLE CARD IS A LINK → products.html]        │ │ [WHOLE CARD IS A LINK → services.html]         │ │ ║
║ │ │ Badges: PXP · LXP · SXP · IoT                 │ │ Text: Outsourcing services                     │ │ ║
║ │ │ H2: Products for schools                      │ │ H2: Your software delivery team                │ │ ║
║ │ │ Text: Connected apps for parents, students,   │ │ Text: Dedicated teams and end-to-end delivery  │ │ ║
║ │ │   teachers, leaders and school staff.         │ │   for companies building digital products.     │ │ ║
║ │ │ Tags: PXP · Parents · LXP · Students · SXP ·  │ │ Tags: Product Engineering · AI-Driven          │ │ ║
║ │ │   Staff · IoT · Campus                        │ │   Analytics · Staffing · Low-code · Cloud · +3 │ │ ║
║ │ │                                               │ │   more                                         │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 3. Four apps. One school day. · light blue, linen ──────────────────────────────────────────────────┐ ║
║ │ H2: Four apps. One school day.                                                                       │ ║
║ │ Text: Every role in the school gets its own app, all sharing one source of truth.                    │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ [LINK: PXP, Parent eXperience Place →         │ │ [WHOLE CARD IS A LINK → products.html#sxp]     │ │ ║
║ │ │   products.html#pxp]                          │ │ H3: SXP                                        │ │ ║
║ │ │ H3: PXP                                       │ │ Text: Staff eXperience Place                   │ │ ║
║ │ │ Text: Parent eXperience Place                 │ │ Text: One workspace with role-based views for  │ │ ║
║ │ │ Text: Attendance, grades, messages and fees   │ │   staff, teachers and leaders.                 │ │ ║
║ │ │   in every parent's pocket.                   │ │ Tags: Staff · Teachers · Leaders               │ │ ║
║ │ │ Tags: Parents · iOS and Android               │ │                                                │ │ ║
║ │ │ [IMAGE: PXP screen · 1170 × 2532]             │ │                                                │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ [WHOLE CARD IS A LINK → products.html#lxp]    │ │ [WHOLE CARD IS A LINK → products.html#iot]     │ │ ║
║ │ │ H3: LXP                                       │ │ H3: IoT                                        │ │ ║
║ │ │ Text: Learner eXperience Place                │ │ Text: Device management                        │ │ ║
║ │ │ Text: Lessons, assignments and progress in    │ │ Text: Devices, lighting and climate,           │ │ ║
║ │ │   one calm space.                             │ │   campus-wide.                                 │ │ ║
║ │ │ Tags: Students                                │ │                                                │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 4. Eight ways we get IT done for you. · white ──────────────────────────────────────────────────────┐ ║
║ │ H2: Eight ways we get IT done for you.                                                               │ ║
║ │ Text: The same team that builds PXP, LXP and SXP, working on your product.                           │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ [WHOLE CARD IS A LINK →      │ │ [WHOLE CARD IS A LINK →      │ │ [WHOLE CARD IS A LINK →        │ │ ║
║ │ │ services.html#product-engine │ │ services.html#ai-analytics]  │ │   services.html#co-creation]   │ │ ║
║ │ │ ering]                       │ │ H3: AI-Driven Analytics      │ │ H3: Product Co-Creation        │ │ ║
║ │ │ H3: Product Engineering      │ │ Text: Turn raw data into     │ │ Text: Your domain knowledge,   │ │ ║
║ │ │ Text: Turn ideas into        │ │   actionable intelligence.   │ │   our technical expertise.     │ │ ║
║ │ │   market-ready digital       │ │                              │ │                                │ │ ║
║ │ │   products.                  │ │                              │ │                                │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ [WHOLE CARD IS A LINK →      │ │ [WHOLE CARD IS A LINK →      │ │ [WHOLE CARD IS A LINK →        │ │ ║
║ │ │   services.html#staffing]    │ │   services.html#custom-apps] │ │   services.html#low-code]      │ │ ║
║ │ │ H3: Staffing Service         │ │ H3: Custom App Development   │ │ H3: Low-code Solutions         │ │ ║
║ │ │ Text: Specialised technology │ │ Text: Solutions built around │ │ Text: Power Platform, Make,    │ │ ║
║ │ │   talent, when you need it.  │ │   your requirements.         │ │   n8n, Retool, Bubble.         │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐                                    │ ║
║ │ │ [WHOLE CARD IS A LINK →      │ │ [WHOLE CARD IS A LINK →      │                                    │ ║
║ │ │ services.html#ai-solutions]  │ │   services.html#cloud]       │                                    │ ║
║ │ │ H3: AI-Powered Solutions     │ │ H3: Cloud Computing          │                                    │ ║
║ │ │ Text: Put artificial         │ │ Text: Azure, AWS and GCP     │                                    │ ║
║ │ │   intelligence to work in    │ │   expertise.                 │                                    │ ║
║ │ │   your operations.           │ │                              │                                    │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘                                    │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 5. From your request to launch, in four steps. · navy, grid texture ────────────────────────────────┐ ║
║ │ Text: How we work                                                                                    │ ║
║ │ H2: From your request to launch, in four steps.                                                      │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ • Your request · An idea, a  │ │ Text: 01                     │ │ Text: 02                       │ │ ║
║ │ │   brief or a requirement.    │ │ H3: Discovery                │ │ H3: Design                     │ │ ║
║ │ │                              │ │ Text: We learn your goals,   │ │ Text: We shape flows,          │ │ ║
║ │ │                              │ │   users and scope.           │ │   interfaces and architecture. │ │ ║
║ │ │                              │ │ Text: You receive · A clear  │ │ Text: You receive · A          │ │ ║
║ │ │                              │ │   scope and delivery plan.   │ │   clickable prototype and      │ │ ║
║ │ │                              │ │                              │ │   technical design.            │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ │ ┌──────────────────────────────┐ ┌──────────────────────────────┐ ┌────────────────────────────────┐ │ ║
║ │ │ Text: 03                     │ │ Text: 04                     │ │ • Launch · And we keep growing │ │ ║
║ │ │ H3: Development              │ │ H3: Deployment               │ │   it together.                 │ │ ║
║ │ │ Text: We build in agile      │ │ Text: We release, monitor    │ │                                │ │ ║
║ │ │   sprints with open updates. │ │   and keep improving.        │ │                                │ │ ║
║ │ │ Text: You receive · Working  │ │ Text: You receive · A live   │ │                                │ │ ║
║ │ │   software every sprint.     │ │   release with ongoing       │ │                                │ │ ║
║ │ │                              │ │   support.                   │ │                                │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
║ └──────────────────────────────────────────────────────────────────────────────────────────────────────┘ ║
║                                                                                                          ║
║ ┌─ 6. Latest from XionTechs. · light blue ─────────────────────────────────────────────────────────────┐ ║
║ │ H2: Latest from XionTechs.                                                                           │ ║
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
║ ┌─ 7. See it working at your school. · amber ──────────────────────────────────────────────────────────┐ ║
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

## Products

`products.html` · page title: "School Platforms: PXP Parent App, LXP, SXP & IoT | XionTechs"

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
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ Text: Lessons · Every material in one place.  │ │ Text: Assignments · Clear due dates.           │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
║ │ ┌───────────────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │ ║
║ │ │ Text: Progress · Seen at a glance.            │ │ Text: Feedback · Comments from teachers.       │ │ ║
║ │ └───────────────────────────────────────────────┘ └────────────────────────────────────────────────┘ │ ║
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
║ │ [BUTTON: See our 4-D process → #process]                                                             │ ║
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
║ ┌─ 5. From your request to launch, in four steps. · navy, grid texture ────────────────────────────────┐ ║
║ │ Text: Our 4-D process                                                                                │ ║
║ │ H2: From your request to launch, in four steps.                                                      │ ║
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
║ │ │   regular demos, testing and │ │   monitoring and improvement │ │                                │ │ ║
║ │ │   open progress updates.     │ │   after launch.              │ │                                │ │ ║
║ │ │ Text: You receive · Working  │ │ Text: You receive · A live   │ │                                │ │ ║
║ │ │   software every sprint.     │ │   release with ongoing       │ │                                │ │ ║
║ │ │                              │ │   support.                   │ │                                │ │ ║
║ │ └──────────────────────────────┘ └──────────────────────────────┘ └────────────────────────────────┘ │ ║
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
║ ┌─ 4. What guides how we work. · white ────────────────────────────────────────────────────────────────┐ ║
║ │ Text: Our core values                                                                                │ ║
║ │ H2: What guides how we work.                                                                         │ ║
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
║ │ A: From the start. Discovery, the first step of our 4-D process, sets your goals, users and scope    │ ║
║ │     before design begins.                                                                            │ ║
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

```text
╔═ NEWS STORY PAGE ════════════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. [Placeholder] Parents can now pay school fees in… · light hero ──────────────────────────────────┐ ║
║ │ Breadcrumb: Home › News › Story                                                                      │ ║
║ │ H1: [Placeholder] Parents can now pay school fees in PXP                                             │ ║
║ │ Text: 18 SEP 2026 · Product · PXP                                                                    │ ║
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
║ │ │   conversation in our 4-D process.            │ │ ┌────────────────────────────────────────────┐ │ │ ║
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

```text
╔═ NOT FOUND (404) PAGE ═══════════════════════════════════════════════════════════════════════════════════╗
║ [HEADER: see "Header and footer"]                                                                        ║
║                                                                                                          ║
║ ┌─ 1. We couldn't find that page. · navy hero ─────────────────────────────────────────────────────────┐ ║
║ │ [BACKGROUND: animated strands]                                                                       │ ║
║ │ Text: 404                                                                                            │ ║
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
