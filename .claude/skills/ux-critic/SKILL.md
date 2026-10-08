---
name: ux-critic
description: Score a built UI surface (a page or a shared part such as the header) against the team's UX scorecard and propose ranked improvements beyond the mockup. Optional until Demo day (2026-10-16); no story has to run it. Use after `npm run ux:parity` is clean for that surface — "run the UX critic on the header", "critic pass for Story 3.1", "how can this page feel better", "UX ceiling pass". Works from real screenshots (`npm run ux:shots`), never from code alone. Changes no code; the team picks which proposals to apply.
---

# UX critic (the ceiling pass)

The mockup is the floor; this pass looks for the best experience the spec allows. It is step 3 of
the UX quality loop in `docs/ux-quality.md` — read that file first for the scorecard and the rules.

Run it as a **context-free subagent** when you can: the critic should not be the agent that built
the surface, so it judges what is on the screen rather than what the code intended.

## Inputs

1. The surface file, e.g. `scripts/ux/surfaces/header.json` (route, states, story).
2. Fresh screenshots: `npm run ux:shots -- <surface.json>` with the dev server running (`npm run dev`; not `next start`), then read
   `ux-reports/<surface>/shots/shots.md` and **open every image** it lists (all widths and states,
   reduced motion, JavaScript off) plus the axe and layout-shift results.
3. The parity report `ux-reports/<surface>/parity/report.md` (what still differs from the mockup and why).
4. The story's spec (Intent / UX brief) and the matching sections of `DESIGN.md` and `EXPERIENCE.md`
   under `_bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/`.
5. For pages (not shared parts): a Lighthouse run on `next start` (Chrome DevTools MCP
   `lighthouse_audit`, or `npx lighthouse`) — dev-server numbers are not budgets.

## What to produce

Write `ux-reports/<surface>/critic.md`:

1. **Scorecard** — the eight areas from `docs/ux-quality.md`, each scored 1–5 with one line of
   evidence naming the screenshot (`default-390.png`) or measurement it comes from. Score what is
   visible; "not visible in these shots" is a valid note and lowers confidence, not the score.
2. **Keep** — up to five things that work and must survive later changes.
3. **Proposals** — ranked by impact on the visitor, then by effort (S under 30 min, M under 2 h,
   L more). Each proposal: the problem as a visitor would meet it, the evidence (screenshot or
   measurement), the change, the scorecard area it raises, and its source — `DESIGN.md` /
   `EXPERIENCE.md` section, WCAG 2.2 criterion, or a named, well-known guideline. Mark each one
   **fix** (the build misses the spec or a standard) or **enhance** (goes beyond the mockup).
4. **Open questions for Amber** — anything that needs a design decision, never decided by you.

Rules:

- Evidence or it does not count. No proposal without a screenshot, a measurement or a quoted rule.
- Stay inside the brand: tokens and type from `DESIGN.md`; no new colours, fonts or icons.
- Judge behaviour, not only looks. Read the parity report's "Behaviour (interaction probes)"
  section, and check every behaviour `EXPERIENCE.md` gives this surface (its Component Patterns
  row, Interaction rules and acceptance criteria) against the build. A behaviour with no probe is a
  finding: say which probe the surface file is missing.
- Scope cuts are not a reason to stay quiet. If a non-goal or a "later" item leaves the visitor
  with a worse experience than `EXPERIENCE.md` or the prototype describes (for example menus that
  open only on click when the spec says hover opens them), raise it as a **proposal** with its cost
  and mark it "scope decision for the lead". Only ideas that do not touch the specified
  experience go under "Later".
- Do not edit code or docs. The developer applies the chosen fixes; Amber approves every
  **enhance** before it is built and then records it in `DESIGN.md`, so mockup and code stay in step.
- Plain, short English (the team reads English as a second language).

Finish with a three-line summary: the lowest-scoring area, the top three proposals, and the
questions for Amber.
