# UX quality loop

Matching Amber's mockup is the **floor**. The goal is the best experience the spec allows: the
**ceiling**. Every UI story goes through this loop; the pages the demo shows first get all of it.

## The loop (per UI story)

1. **UX brief — before building.** The build spec names the experience goal (who, what they should
   feel or do), the mockup page and parts, and the UX acceptance list: states (hover, focus, open,
   error, empty, loading), widths, motion and reduced motion, accessibility, speed budget. Where
   the prototype and `DESIGN.md` disagree, ask Amber now; agents never pick silently.
2. **Floor — match the mockup, in looks and in behaviour.** Build to the prototype, then run
   `npm run ux:parity -- <surface> --strict` for the surface. It compares how parts look (states) and how they behave
   (interaction probes: hover, moving away, click, keyboard, Escape). Every interactive part named
   in `EXPERIENCE.md` (Component Patterns, Interaction, acceptance criteria) needs a probe in the
   surface file. Every difference is either fixed or listed in the surface file's `intended` with
   a reason or a decision ID. The report goes in the PR.
3. **Ceiling — critic pass** (timebox about 30 minutes). Run `npm run ux:shots`, then the
   `ux-critic` skill as a separate subagent. It scores the scorecard below from real screenshots and
   ranks proposals. The developer applies the **fix** items; Amber chooses which **enhance** items
   to build.
4. **Measure.** `npm run ux:shots -- <surface> --strict` fails on any axe violation (every
   state is scanned) or a cumulative layout shift above 0.05; for whole pages,
   Lighthouse on `next start` (Chrome DevTools MCP `lighthouse_audit` or `npx lighthouse`):
   performance ≥ 90, accessibility 100, LCP under 2.5 s on mobile.
5. **Feed back.** Amber records every accepted enhancement in `DESIGN.md` / `EXPERIENCE.md`, so
   the mockup and the code stay in step. Before/after screenshots go in the PR.

**Scope until Demo day (2026-10-09):** full loop for the header, Home hero, Products and Book a
demo; floor and measure for every other page.

## Scorecard (1–5 per area, target 4 or more)

| Area                    | What 5 looks like                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| Fidelity                | Matches the approved look; every difference is intended and recorded                                         |
| Hierarchy & readability | Clear order of headings and text, comfortable line length, balanced breaks (`text-wrap: balance` / `pretty`) |
| Interaction feedback    | Every hover, press, focus, open and error state is visible, quick and consistent                             |
| Accessibility           | WCAG 2.2 AA, keyboard-complete, focus never hidden, axe-clean                                                |
| Responsive              | Good at every width from 360 to 1920 px, not only at the 640 / 1080 breakpoints                              |
| Speed                   | Budgets above met; no layout shift; images and fonts do not block                                            |
| Motion                  | Purposeful and short (`--ease-brand`), never in the way; reduced motion respected                            |
| Content                 | Real or `[Placeholder]`; works for English and Vietnamese text lengths                                       |

## Tools

| Command                                                | What it does                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run ux:parity -- scripts/ux/surfaces/<name>.json` | Floor. Opens the prototype page and the running app (default `http://localhost:3000`, change with `--dev`) at each width and state, and compares every mapped element: box, computed styles and pixels; then runs the interaction probes (behaviour). Writes `ux-reports/<name>/parity/report.md` with prototype / dev / diff images. `--strict` exits 1 on any unexplained difference. |
| `npm run ux:shots -- scripts/ux/surfaces/<name>.json`  | Critic input. Screenshots the app at 360, 390, 768, 1024, 1280, 1440 and 1920 px in every state, plus reduced motion and JavaScript off; runs axe (WCAG 2.2 AA tags) and reads layout shift. Writes `ux-reports/<name>/shots/shots.md`.                                                                                                                                                 |
| `ux-critic` skill                                      | Ceiling. Scores the scorecard from those screenshots and ranks proposals (`.claude/skills/ux-critic/SKILL.md`).                                                                                                                                                                                                                                                                         |

`ux-reports/` is not committed; attach the report (or its key images) to the PR.

### Surface files

`scripts/ux/surfaces/<name>.json` maps the prototype to the app for one page or shared part:

- `prototype` — the page under the mockup folder (`index.html`); `route` — the app route (`/`).
- `elements` — `{ name, proto, dev }` CSS selectors for the same part on both sides.
- `states` — named actions on both sides (`click`, `hover`, `focus`, `press`, `wait`), the
  `elements` to compare in that state, and an optional `minWidth` for desktop-only states.
- `probes` — `{ name, trigger, hover?, observe, minWidth? }` with `proto` / `dev` selectors: the
  part a visitor acts on, the area that reacts to the pointer (default: the trigger) and what
  should open. Each probe runs hover, hover-then-leave, hover-into-panel (the pointer travels across the gap
  into the panel), hover-then-click, click, click-then-leave, click-twice, keyboard (Enter) and
  Escape on a fresh page on both sides and compares open / closed and focus. A selector that
  matches nothing reports an error instead of passing.
- `intended` — `{ element, prop, note }` for differences that stay, with the reason or decision
  ID (for a probe: `{ element: <probe name>, prop: <event> }`; for an element found on one side
  only: `prop: "missing"`). Optional `state` and `width`
  narrow an entry so it cannot hide the same property drifting elsewhere. Add `pending: true`
  for a design question that is built one way but still open: the report counts and lists those
  separately, so "0 unexplained" never hides an open decision.
- `widths` (parity) and `shotWidths` (shots) — optional; shots default to 360, 390, 768, 1024,
  1280, 1440 and 1920 px. Mapped elements never found at any width or state are reported.

**Why probes exist:** the first header run compared only looks. The menus opened on click only,
while `EXPERIENCE.md` and the prototype open them on hover; the Demo-day plan had cut hover, and
no check looked at behaviour. A scope cut that makes the experience worse than the spec is raised
to the lead, not filed under "later".

`scripts/ux/surfaces/header.json` is the worked example.

## Open design questions (Amber)

| ID    | Question                                                                                                                                    | Where it shows              |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| UX-Q1 | Mega menu item name: prototype 0.92rem, `DESIGN.md` `title-sm` 1rem, and `DESIGN.md` also says 1.08rem. Which size?                         | Products and Services menus |
| UX-Q2 | Mega "for" line: prototype weight 400 and 0.12em spacing, `label-sm` 500 and 0.14em. Which?                                                 | Products menu               |
| UX-Q3 | Header bottom border: prototype 10% navy, `DESIGN.md` border token 12%. Which?                                                              | Header                      |
| UX-Q4 | Below 1080 px the prototype puts the tools (EN/VI, Book a demo, Menu) right after the logo; `DESIGN.md` says tools sit on the right. Which? | Header at tablet width      |
