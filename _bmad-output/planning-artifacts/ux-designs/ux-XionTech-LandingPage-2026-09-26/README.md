# UX first draft: XionTech company website

Owner: Amber Do. Made with the BMad UX workflow (`bmad-agent-ux-designer` + `bmad-ux`) in Claude Code.
Status: **first draft for team review.** `DESIGN.md` and `EXPERIENCE.md` are still empty stubs;
they get written when the design is agreed.

## Open the prototype

Open `.working/site-v3/index.html` in a browser (double-click works, no build step).
It has 7 linked pages: Home, Products, Services, News, About, Careers, Book a demo.

- **EN/VI:** the switch in the header.
- **Screenshots:** click, drag or paste (Ctrl+V) an image onto any device or photo frame.
  Images are kept in your browser only.
- **Email forms:** prototype only. Nothing is sent anywhere.

## What is in this folder

| Path | What it is |
| --- | --- |
| `.memlog.md` | Decision log for the design, oldest first. Start here to see why things look the way they do. |
| `.working/site-v3/` | **Current draft.** Multi-page static prototype (HTML, CSS, JS). |
| `.working/brand-type-kit.html` | Type kit from the logo: Unbounded, Lexend Exa, Be Vietnam Pro, JetBrains Mono (all support Vietnamese). |
| `.working/*.html` (others) | Earlier rounds, superseded: colour themes, 3 concepts, landing v1 and v2. Kept to show how the design evolved. They contain unmarked sample data (made-up names and numbers) and must not be reused as content. |
| `imports/` | Company logos and the hero reference screenshot supplied by the team. |
| `ai-log-entry.md` | AI log entry for this work (see below). |

## Key design decisions

- Two front doors on Home, both near the top: **Products for schools** (PXP, LXP, SXP, IoT) and **Outsourcing services** (8 services).
- Brand colour rhythm per section (paper, mist, navy band, one amber band) instead of a dark-mode toggle.
- 4-D process shown as an illustrated flow: request, 01 Discovery, 02 Design, 03 Development, 04 Deployment, launch.
- Core values use the wording from the office banner.
- Only two offices: Ho Chi Minh City and Dallas.

## Before this becomes real pages

The prototype follows the challenge rule: everything not verified is marked `[Placeholder]`.

- `grep -rn "\[Placeholder\]" .working/site-v3` lists every item still to replace or verify.
- Stats (25+ years, 24/7, 20+ stacks), service descriptions and careers benefits come from the
  current xiontechs.com and need a human check. "24/7 global coverage" especially.
- Still missing: Dallas street address, contact email, real leadership team, partner-school
  logos (with permission), real news stories, product screenshots or clips.
- The prototype is not the production code. The real site is built in Next.js 16 + Tailwind v4
  (see `AGENTS.md`); reuse the decisions, not the HTML.
