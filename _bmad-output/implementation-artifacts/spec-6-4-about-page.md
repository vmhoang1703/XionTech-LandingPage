---
title: 'Story 6.4: About page'
type: 'feature'
created: '2026-10-05'
status: 'done'
baseline_commit: '057ff8744d68ce4ced00036f8e7d41e1dedb7d6c'
route: 'dispatch'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `/about` does not exist. The footer's About, "Core values" (`/about#values`) and "FAQ" (`/about#faq`) links, and the header's About, lead nowhere. Quân cannot check who is behind the services before he starts a project (FR-28, FR-29, FR-30, FR-46, UX-DR19, UX-DR23, UX-DR27). Contract: `_bmad-output/specs/sammy/spec-6-4-about-page/SPEC.md` (CAP-1 to CAP-7).

**Approach:** a Server Component page, `src/app/about/page.tsx`, ported from the prototype `about.html`, with all copy in `src/content/about.ts`. Sections in order:
- **Hero:** navy, built like Services (`HeroArt tone="navy"`, `.page-hero`, `.crumbs`, H1 "Tech made simple. Solutions made powerful." with `.hl`, lede).
- **Stats:** `StatsBand tone="light" hideLabel`, label "Key facts". The fourth figure is "4 School products ready to demo", marked `[Placeholder]` (decision A2, not confirmed).
- **Story:** "Two strengths, one team." in `.split`, with a `[Placeholder] Photo` frame (`.illo`) and a `.list-check`.
- **Values:** `#values`, six core values in a 3 × 2 grid with "Get IT Done" as the amber featured cell.
- **FAQ:** `#faq`, nine native `<details>`/`<summary>`. The data-security answer starts with `[Placeholder]`.
- **Offices:** a navy band with one office card per office from `src/content/offices.ts`, Plano first. Each card has a large mono `LiveClock` (5.1), the city, the tag, the address and the contact links.
- **Capture:** a demo capture reading "See our apps in action." / "Leave your work email and we'll arrange a walkthrough of PXP, LXP and SXP." / "Book a demo".

Further rules:
- `#values` and `#faq` join the anchor rule (`.svc[id], #process`).
- New CSS (`.values`, `.value`, `.faq`, `.office-card`) goes in an About section of `globals.css` `@layer components`.
- Copy says "XionTech", including the FAQ's first question, where the mockup says "XionTechs".
- No leadership section, and no names of people.

**Decision (Son Nguyen, 2026-10-05): About capture wording.**
- `CaptureBand` gets an optional `copy` prop (`heading`, `lede`) that replaces the kind's heading and lede.
- The button, consent, validation and redirect stay those of `kind`; existing callers are unchanged.
- It is one small edit to Andy's file, with a test, and the PR tells Andy.
- **Spec length:** kept whole at about 2,800 tokens.

</frozen-after-approval>

## Code Map

- `src/app/services/page.tsx` -- the pattern to copy:
  - the hero (`HeroArt`, `.crumbs`, `h1 .hl`, `p.lede mt-5`);
  - the stats section (`<section class="sec surface-paper">` + `StatsBand … hideLabel`);
  - the `.sec-head` sections;
  - `LiveClock` usage.
- `src/app/services/page.test.tsx` -- test setup to reuse:
  - mocks: `HeroArt` and `next/navigation`;
  - stubs: `matchMedia` and `IntersectionObserver`;
  - the CSS contract via `undefinedClasses` (exempt Tailwind utilities like `mt-5`, `sr-only`).
- `src/components/sections/stats-band.tsx` -- `Stat.placeholder` prints `[Placeholder] <caption>`. Reuse `homeStats.stats` for figures 1, 2, 3 and 5.
- `src/components/sections/live-clock.tsx` + `src/content/offices.ts` -- `plano`, `hcmc`, `offices` (Plano first), with `timeZone`, `zoneLabel`, `tag`, `addressLines`, `contacts` (`external` opens a new tab with `ariaLabel`).
- `src/app/demo/page.tsx` -- Andy's office rendering; follow how it renders `contacts`. The `.offices` grid already exists in `globals.css`: 1 column, 2 from md (900), `margin-top: 36px`; reuse it.
- `src/app/globals.css` --
  - These exist: `.split`, `.illo`, `.list-check`, `.link-arrow`, `.label`, `.sec-head`, `.surface-*`, `.gridbg`, `.linen`, `.spot`, `.office-tag`.
  - These are missing: `.values`, `.value`, `.value.feat`, `.faq …` and `.office-card …` (prototype `site.css` 278–285, 369–373, 558–566).
  - The anchor rule `.svc[id], #process` sits at the end of the Services section.
- `src/components/contact/capture-band.tsx` (+ `capture-band.test.tsx`, a `describe.each` over kinds) -- `copy = S[kind]` at line 43 feeds the h2 and lede; add the optional override there.
- `src/content/site-footer.ts` -- `/about`, `/about#values` and `/about#faq` already link here.
- Prototype `mockups/site-v3/about.html` -- every string, the value icons (`ph-rocket-launch`, `ph-handshake`, `ph-shield-check`, `ph-lightbulb-filament`, `ph-target`, `ph-users-three`) and the check icon (`ph-check-circle`, fill).

## Tasks & Acceptance

**Execution:**
- [x] `src/content/about.ts` -- meta, hero, stats (figure 4 placeholder), story, six values with icons, nine FAQ entries, offices heading, capture copy -- copy out of components
  - red: `src/content/about.test.ts` -- nine FAQ entries, the data-security answer starts with `[Placeholder]`, six values in order with only "Get IT Done" featured, the stats' fourth figure is "4" with `placeholder: true`, no "XionTechs" anywhere
- [x] `src/components/contact/capture-band.tsx` -- optional `copy?: { heading: string; lede: string }` replacing the kind's heading and lede; nothing else changes -- About wording (decision above)
  - red: `src/components/contact/capture-band.test.tsx` -- with `copy`, the h2 and lede show the given text while the button, placeholder and redirect stay the kind's; without it, output is unchanged
- [x] `src/app/about/page.tsx` -- the seven sections in order, as in Intent; metadata "About | XionTech" -- CAP-1 to CAP-7
  - red: `src/app/about/page.test.tsx` --
    - one H1;
    - section order and surfaces;
    - five figures with the fourth "[Placeholder] School products ready to demo";
    - the story list;
    - `#values` with six cells and one `.feat`;
    - `#faq` with nine `details > summary` and the security answer starting `[Placeholder]`;
    - two office cards, Plano first, each with a zone label, address and `tel:` link;
    - the capture heading "See our apps in action." and button "Book a demo";
    - no "XionTechs";
    - the CSS contract.
- [x] `src/app/globals.css` -- About section:
  - `.values`/`.value`/`.value.feat` (3 columns, 2 at 900px, 1 at 640px; hover tint on non-featured);
  - `.faq` (summary `+`/`−` marker, focus ring);
  - `.office-card` (+ large mono clock);
  - `#values, #faq` added to the anchor rule.

  Missing rules, CAP-2/4/6.
  - red: `src/app/about/page.test.tsx` -- the anchor rule lists `#values` and `#faq` with `--spacing-anchor-offset`
- [x] `e2e/about.spec.ts` -- `@smoke`: `/about` 200 with the H1, `id="values"`, `id="faq"`, nine `<details`, both zone labels and "See our apps in action." in the HTML -- the page without JavaScript

**Acceptance Criteria:**
- Given `/about`, when it loads, then the sections appear in order: navy hero, stats, story, values, FAQ, navy offices, amber capture (CAP-1).
- Given the footer's "FAQ" or "Core values" link, when followed, then `#faq` or `#values` lands with its heading fully below the sticky header (CAP-2, CAP-4).
- Given the FAQ, when a visitor clicks, or presses Enter or Space on, two questions, then both stay open; the security answer starts with `[Placeholder]` (CAP-2, CAP-3).
- Given JavaScript, when the offices band shows, then each card's clock shows its office's live `HH:MM`; without JavaScript it shows "US Central" or "GMT+7" (CAP-6).
- Given the page, then no person's name, photo or title appears outside the office contact email the business supplied (CAP-5).

## UX checks

Sources: SPEC CAP-1 to CAP-7, `EXPERIENCE.md` (FAQ, Office card, Clock, Stats band, Focus ring, Reduced motion, Responsive), `DESIGN.md` (About surfaces line 442, Stats band), prototype `about.html` and `site.css`, decision A2.

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Hero | page loads | — | navy with aurora and strands; crumbs Home / About; H1 "Tech made simple. Solutions made powerful." with the highlight; lede | — | CAP-1, prototype |  ✅ walk: aurora + strands, crumbs, H1 with highlight, lede; page.test |
| Stats | page loads | — | paper band; 25+, 24/7, 20+, 4, 2; the fourth caption "[Placeholder] School products ready to demo"; no visible label | static | CAP-7, A2, DESIGN.md Stats band |  ✅ walk: 25+, 24/7, 20+, 4 [Placeholder], 2; label sr-only 1×1; page.test |
| Story | page loads | — | mist with linen; `[Placeholder] Photo` frame and the h2 "Two strengths, one team.", lede, three check items | — | CAP-1, prototype |  ✅ walk: mist + linen, [Placeholder] Photo, h2, lede, 3 checks |
| Story | width 900px and below | — | photo frame and text stack in one column | — | EXPERIENCE.md Responsive |  ⏳ pending: stacked at 899, 640 and 390px; at exactly 900px still side by side (shared `.split` switches at ≥ 900; site-wide ≥/≤ question, Amber/Hoang) |
| Values | page loads | — | label "Our core values", h2; six cells 3 × 2 with icons; "Get IT Done" cell amber with navy text | — | CAP-4, UX-DR23 |  ✅ walk: label, h2, six cells with icons, featured amber gradient with navy text; page.test |
| Values | hover a non-featured cell | mouse | cell background tints | 0.4s | prototype site.css |  ✅ walk: transparent → rgb(238, 242, 249), 0.4s |
| Values | width 900px and below / 640px and below | — | 2 columns, then 1 | — | EXPERIENCE.md Responsive |  ✅ walk: 3 at 1280; 2 at 900 and 899; 1 at 640 and 390 |
| Footer "Core values" | click | mouse | `/about#values`; h2 fully below the 72px header after the scroll | on load | CAP-4, AC-NAV-5 |  ✅ walk: /about#values, h2 230–281 below header 72 |
| Footer "FAQ" | click | mouse | `/about#faq`; h2 fully below the header | on load | CAP-2, AC-NAV-5 |  ✅ walk: /about#faq, h2 200–250 below header 72 |
| FAQ | page loads | — | h2 "Frequently asked questions.", lede; nine closed questions with a + marker | — | CAP-2 |  ✅ walk: h2, lede, 9 closed, + marker; page.test |
| FAQ | click a question | mouse | answer opens, marker becomes −; click again closes | — | CAP-2, UX-DR27 |  ✅ walk: opens, marker −; second click closes |
| FAQ | Tab to a question, Enter / Space | keyboard | focus ring visible; Enter and Space toggle it | — | CAP-2, EXPERIENCE.md FAQ |  ✅ walk: focus-visible navy 2px ring; Enter opens, Space closes |
| FAQ | open two questions | mouse, keyboard | both stay open | — | CAP-2 |  ✅ walk: Q1 (click) and Q3 (Space) both open |
| FAQ | tap a question | touch | toggles like a click | — | CAP-2 |  ✅ walk: tap opens Q4 at 390px |
| FAQ | "How do you keep our data secure?" | — | answer starts with "[Placeholder]" | — | CAP-3 |  ✅ walk and page.test: starts with [Placeholder] |
| Offices | page loads | — | navy band with gridbg; h2 "Two offices, serving the world."; Plano card first, then Ho Chi Minh City with "Vietnam Delivery Center" | — | CAP-6 |  ✅ walk: navy gridbg, h2, Plano left and HCMC right at 1280 (with tag), 1 column at 900 and below |
| Office clock | without JavaScript / with JavaScript | — | "US Central" / "GMT+7" first, then the live `HH:MM` in large mono | refresh 30s | CAP-6, EXPERIENCE.md Office card |  ✅ walk: JS off US Central / GMT+7; JS on 22:15 / 10:15 then 22:16 / 10:16, JetBrains Mono 32px |
| Office links | click phone / WhatsApp / email | mouse | `tel:` link; WhatsApp opens a new tab; `mailto:` | — | CAP-6, PRD offices |  ✅ walk: tel: links, WhatsApp target _blank, mailto: |
| Capture | page loads | — | amber band last; "See our apps in action.", About lede, "Book a demo" | — | CAP-7 |  ✅ walk: last in main, About heading and lede, Book a demo; page.test |
| Capture | submit a valid email | keyboard | lands on `/demo#form` with the email prefilled | after send | Story 2.4 behaviour |  ✅ walk (POST intercepted): /demo#form, email prefilled |
| People | whole page | — | no leadership section, no photos, names or titles of people | — | CAP-5, FR-29 |  ✅ page.test "names no people" (no img, no leadership/team headings, no titles, one office mailto); walk: no title words in main |
| Whole page | reduced motion | — | no animation; anchor jumps instant | — | EXPERIENCE.md Reduced motion |  ✅ walk: scroll-behavior auto, transition 0s, #faq lands on load |
| Whole page | width 390px | — | no sideways scroll | — | EXPERIENCE.md Responsive |  ✅ walk: no sideways scroll at 900, 899, 640, 390 |

## Implementation Notes

- **Office grid (acceptance fix by the controller).** The walk showed the office cards in one column at 1280px. In `globals.css` the shared `.offices` base rule comes after its own md query and wins, which also affects `/demo` (deferred to Andy). About adds `.offices:has(> .office-card)`: two columns above md, gap 18px and no top margin, all ported from the prototype (`site.css` 369, 441). `/demo` is unchanged.
- **Review patches (controller):**
  - The services anchor test names `#process` explicitly again.
  - The capture band's `copy` alias is now `copyOverride`, and its tests share one constant and assert the default heading and lede are gone.
  - The smoke test checks one H1 with the About headline and counts `<details` exactly.
  - A "names no people" page test was added.

## Spec Change Log

## Review Triage Log

Step 4 review, 2026-10-05. Layers: Blind Hunter, Edge Case Hunter, Verification Gap, Acceptance Auditor, and the Security Auditor (clean). The task-review minors from the ledger are included.

- **Services anchor test no longer proves `#process` stays** (Edge Case Hunter, Blind Hunter) — medium, patch: the regex names `#process`.
- **"No leadership words" overstated, People row cited the brand test** (Edge Case Hunter, Blind Hunter) — low, patch: a real "names no people" page test. The walk wording now says "no title words", because "leadership experience" is real copy.
- **Smoke checks any `<h1` and a loose `<details` count** (Edge Case Hunter, Blind Hunter, Task 5 minors) — low, patch.
- **Capture `copy` tests: defaults not asserted absent; duplicated literal; `customCopy` alias** (Blind Hunter, Verification Gap, Task 2 minors) — low, patch.
- **The 900px story row is still pending** (Acceptance Auditor, Blind Hunter, Edge Case Hunter) — kept as pending.
  - It is the site-wide ≥/≤ breakpoint question with Amber and Hoang. The shared `.split` is Andy's.
  - `docs/ux-checks.md` lets pending lines merge if they are listed in the PR.
- **About spacing overrides on `.offices` (gap, margin-top) not in the spec** (Acceptance Auditor) — low, recorded in Implementation Notes: ported from the prototype, needed for the two-column fix.
- **Shared `.offices` md query is dead on `/demo`** (Edge Case Hunter, Verification Gap) — defer: Andy's rule.
- **CSS layouts, hover, marker and featured cell only verified by the manual walk** (Verification Gap) — medium, defer: jsdom has no media queries. It joins the browser Playwright project entry.
- **Safari `::-webkit-details-marker` not hidden** (Edge Case Hunter, Blind Hunter, Task 4 minor) — low, rejected:
  - The contrast test forbids `display: none`.
  - `list-style: none` already hides the marker in current Safari, where `summary` is `display: list-item`.
- **Office clock read before the city** (Blind Hunter) — low, rejected: the prototype order. The h3 follows immediately, and the time is not interactive.
- **FAQ "Book a demo" / 4-D mentions not linked; OG, canonical, sitemap, FAQPage** (Blind Hunter) — rejected: not in the prototype or the spec. FAQPage is after demo (SPEC non-goals).
- **Unverified claims in FAQ and values copy; "Led by more than 25 years"** (Blind Hunter) — false:
  - FR-46 and CAP-3 make only the security answer `[Placeholder]`.
  - The values are the office-banner wording (UX-DR23).
  - The copy is the prototype's word for word, which is the copy authority.
- **`homeStats` picked by position** (Edge Case Hunter) — false: the page test pins all five figures and captions, so a reorder fails it.
- **Empty `copy` strings** (Edge Case Hunter) — false: the only caller passes static content.
- **FAQ shadow transition under reduced motion** (Edge Case Hunter) — false: the global reduced-motion rule sets `transition: none` on every element.
- **No AI log entry; no review recorded; status still in-review** (Blind Hunter) — false at the time: this review, then step 5.
- **Absolute paths in the ledger and `verification.txt`; `walk.mjs` committed** (Blind Hunter, Acceptance Auditor) — low, rejected: BMad records and the evidence convention since Story 1.1.
- **Task minors not listed above** (copy checks cover exports only; Plano order pinned by the page test; exemption comment fixed in Task 4) — resolved in later tasks.

## Verification

**Commands:**
- `npm test` -- expected: all pass, including the About content, page and capture tests
- `npm run lint && npm run typecheck && npm run format:check` -- expected: clean
- `npm run test:coverage && npm run coverage:diff` -- expected: 100% changed lines, branches ≥ 80%
- `npm run test:smoke` -- expected: build passes; `/about` 200 with the anchors, FAQ and zone labels

**Manual checks (if no CLI):**
- Chrome walk on a production build (`npx next start -p 3005`), covering:
  - the footer "FAQ" and "Core values" links, waiting for the smooth scroll to stop;
  - the FAQ by mouse and keyboard;
  - the clocks with and without JavaScript;
  - 1280, 900, 899, 640 and 390px, and reduced motion.
- The capture `POST /api/contact` is answered by the walk.
- Screenshots go in the evidence folder.

## Acceptance Evidence

Captured again after the step-04 review patches on 2026-10-05, on a production build (`next start -p 3005`).

**Commands**

- `npm test` -- exit 0 -- Test Files 75 passed (75), Tests 1130 passed (1130)
- `npm run lint && npm run typecheck && npm run format:check` -- exit 0 -- All matched files use Prettier code style!
- `npm run test:coverage && npm run coverage:diff` -- exit 0 -- Total: 18 lines, Missing: 0 lines, Coverage: 100%; "C1 ok: 3 changed file(s) with branch coverage >= 80%"
- `npm run test:smoke` -- exit 0 -- 15 passed (13.4s)

**Observed**

- The footer's "Core values" and "FAQ" land the h2 at 230 and 200, below the 72px header. The FAQ toggles by click, Enter, Space and tap, two stay open, and the keyboard focus ring shows. -- walk
- The office clocks show "US Central" and "GMT+7" without JavaScript, then 22:15 and 10:15, then 22:16 and 10:16 after 30 s. The offices are two columns at 1280px. The capture goes to `/demo#form` with the email prefilled. -- walk

**Artifacts**

- [capture-1280.png](spec-6-4-about-page-evidence/capture-1280.png) -- 132466 bytes -- sha256 8b4ab797c786
- [faq-two-open-1280.png](spec-6-4-about-page-evidence/faq-two-open-1280.png) -- 126262 bytes -- sha256 86e433124601
- [observed.md](spec-6-4-about-page-evidence/observed.md) -- 4181 bytes -- sha256 22d92ef66bef
- [offices-1280.png](spec-6-4-about-page-evidence/offices-1280.png) -- 283838 bytes -- sha256 0b3fb17ccd4a
- [values-1280.png](spec-6-4-about-page-evidence/values-1280.png) -- 182438 bytes -- sha256 2f6e5f6018d9
- [values-390.png](spec-6-4-about-page-evidence/values-390.png) -- 166504 bytes -- sha256 3befe0e124ca
- [verification.txt](spec-6-4-about-page-evidence/verification.txt) -- 5949 bytes -- sha256 ab03cc42c62e
- [walk-output.txt](spec-6-4-about-page-evidence/walk-output.txt) -- 3675 bytes -- sha256 033b329b3462

**Not captured**

- A real mail send. The walk answered `POST /api/contact` itself.
- A screen reader, and pen input.
