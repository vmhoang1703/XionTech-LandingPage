# UX: XionTechs company website

Owner: Amber Do. Made with the BMad UX workflow (`bmad-agent-ux-designer` + `bmad-ux`) in Claude Code.
Status: **UX specs final** (2026-09-28), except the items listed under Open Questions in `EXPERIENCE.md`. `DESIGN.md` (how it looks) and `EXPERIENCE.md` (how it works)
are the source of truth and win over the prototype on any conflict. The prototype shows every UI
decision in the specs; UI changes are checked in the prototype before a PR.

The AI log for this work is in `docs/ai-log.md` (entry "Website UX first draft").

## Open the prototype

Open `mockups/site-v3/index.html` in a browser (double-click works, no build step).
It has 7 linked pages (Home, Products, Services, News, About, Careers, Book a demo) plus a sample
news story, a sample job page with the application form, the privacy policy page and a 404 page.

- **EN/VI:** the switch in the header.
- **Screenshots:** click, drag or paste (Ctrl+V) an image onto any device or photo frame.
  Images are kept in your browser only.
- **Email forms:** prototype only. Nothing is sent anywhere.

## What is in this folder

| Path | What it is |
| --- | --- |
| `DESIGN.md` | Visual spec: design tokens (ready for Tailwind `@theme`), colours with contrast, type, layout, components. |
| `EXPERIENCE.md` | Behaviour spec: pages and navigation, microcopy, component and state patterns, accessibility, responsive, EN/VI, key user journeys, open questions. |
| `.memlog.md` | Decision log for the design, oldest first. Start here to see why things look the way they do. |
| `mockups/site-v3/` | **Reference prototype.** Multi-page static HTML, CSS and JS that the specs link to. |
| `.working/brand-type-kit.html` | Type kit from the logo: Unbounded, Lexend Exa, Be Vietnam Pro, JetBrains Mono (all support Vietnamese). |
| `.working/*.html` (others) | Earlier rounds, superseded: colour themes, 3 concepts, landing v1 and v2. Kept to show how the design evolved. They contain unmarked sample data (made-up names and numbers) and must not be reused as content. |
| `imports/` | Company logos and the hero reference screenshot supplied by the team. |
| `code-review-2026-09-28.md` | `bmad-code-review` results: 4 fixes applied, **16 acceptance criteria (from 14 findings) for the Next.js build**, plus the spec review, deferred and rejected items. |

## Key design decisions

- Two front doors on Home, both near the top: **Products for schools** (PXP, LXP, SXP, IoT) and **Outsourcing services** (8 services).
- Brand colour rhythm per section (paper, mist, navy band, one amber band) instead of a dark-mode toggle.
- 4-D process shown as an illustrated flow: request, 01 Discovery, 02 Design, 03 Development, 04 Deployment, launch.
- Core values use the wording from the office banner.
- Only two offices: Ho Chi Minh City and Dallas.

## For developers

Treat this folder as a **design reference**. Rebuild in Next.js; do not copy the HTML.
Before a story is ready for development it needs acceptance criteria, a link to the prototype
section (for example `services.html#process`), design tokens from `DESIGN.md` and verified content.
Add the acceptance criteria in `code-review-2026-09-28.md` to the matching stories.

## Before this becomes real pages

The prototype follows the challenge rule: everything not verified is marked `[Placeholder]`.

- `grep -rn "\[Placeholder\]" mockups/site-v3` lists every item still to replace or verify.
- Stats (25+ years, 24/7, 20+ stacks), service and product descriptions and careers text are
  confirmed by the business (2026-09-28). The `[Placeholder]` markers left are sample content.
- Still missing: both office street addresses, the contact email address, team and office photos,
  real news stories and roles, product clips, app store links and web addresses,
  and a **privacy policy** (the forms collect personal data; Vietnam PDPD, Decree 13/2023, applies).
- The prototype is not the production code. The real site is built in Next.js 16 + Tailwind v4
  (see `AGENTS.md`); reuse the decisions, not the HTML.
