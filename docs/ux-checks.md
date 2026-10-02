# UX checks in the spec

Every UI story's build spec has a **UX checks** table: how each part must look and behave, one
testable line per check. The developer builds to the table and checks every line before the PR.
This finds gaps before any code exists. On the header (Story 1.3), menus that opened only on click
were found after the build, because no line said "hover opens".

A **UI story** is any story that changes what a visitor sees or uses, including one-shot
page-section stories: the short one-shot spec holds the table too.

## Who writes it, and when

- The **developer** writes the table in the build spec (the `bmad-build` spec step), **before
  coding**, from the story spec and the design docs. Amber's story specs are not edited.
- Sources: `DESIGN.md` and `EXPERIENCE.md` in
  `_bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/`, the story
  spec (its CAP and AC IDs), and decisions in `_bmad-output/specs/decisions-*.md`.
- Applies to specs written from 2026-10-02. A story already in progress adds the table before its
  PR.

## Rules

- **One line, one check a person can see.** No "looks nice", no "works well".
- **Looks and behaviour.** Behaviour lines name the action and the input: mouse, touch, pen or
  keyboard.
- **Every interactive part** gets its behaviour lines from `EXPERIENCE.md` — Component Patterns,
  Interaction Primitives, Accessibility Floor, Responsive & Platform, and the Acceptance Criteria
  Index: open, close, keyboard, Escape, touch, focus, widths. Repeat them for each similar part
  (for example both menus).
- **A source for every line:** an `EXPERIENCE.md` or `DESIGN.md` section, a story CAP or AC ID, or
  a decision ID. No source → ask Amber, or write `[Placeholder]` and list it in the PR.
- **Mockup vs `DESIGN.md`:** where they disagree, ask Amber before building and write the winner
  in the Source cell (`wins: DESIGN.md`). If she has not answered, follow `DESIGN.md` and write
  `pending: <question>` in the Source cell; list pending lines in the PR.
- **Before the PR:** check every line, by hand or with a test, fill **Checked**
  (`hand` or the test name) and copy the table into the PR's "UX checks" section.

## Template

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
|      |                 |       |                    |        |        |         |

## Example: the desktop header (Story 1.3)

Sources: `EXPERIENCE.md` Component Patterns › Mega menu and Skip link, AC-NAV-3, decision T11
(`decisions-2026-10-01.md`), the story's CAP IDs. The same rows apply to the Services menu.

| Part          | State or action                                                        | Input      | Expected (visible)                        | Timing       | Source                   | Checked |
| ------------- | ---------------------------------------------------------------------- | ---------- | ----------------------------------------- | ------------ | ------------------------ | ------- |
| Header bar    | page scrolls                                                           | any        | stays on top; glass background; 72px high | —            | DESIGN.md header, CAP-1  |         |
| Nav item      | current page                                                           | —          | navy, bold, 2px amber underline           | —            | DESIGN.md nav, CAP-1     |         |
| Products menu | hover                                                                  | mouse      | opens; trigger has `aria-expanded="true"` | —            | AC-NAV-3                 |         |
| Products menu | opened by hover, pointer leaves                                        | mouse      | closes                                    | after 150ms  | AC-NAV-3, T11            |         |
| Products menu | pointer leaves and comes back                                          | mouse      | stays open                                | within 150ms | AC-NAV-3                 |         |
| Products menu | opened by hover, then click                                            | mouse      | stays open                                | —            | AC-NAV-3                 |         |
| Products menu | opened by click, Enter or focus inside; pointer passes over and leaves | mouse      | stays open (pinned)                       | —            | T11; pending: lead/Amber |         |
| Products menu | Enter                                                                  | keyboard   | opens; Tab moves into the panel           | —            | AC-NAV-3, CAP-5          |         |
| Products menu | Escape                                                                 | keyboard   | closes; focus back on "Products"          | —            | AC-NAV-3                 |         |
| Products menu | focus leaves the panel                                                 | keyboard   | closes                                    | —            | Mega menu                |         |
| Products menu | tap                                                                    | touch, pen | opens; no hover behaviour                 | —            | Mega menu, T11           |         |
| Products menu | open Services while Products is open                                   | any        | Products closes; one menu at a time       | —            | CAP-2                    |         |
| Products menu | click outside, or go to another page                                   | any        | closes                                    | —            | AC-NAV-3, CAP-2          |         |
| Skip link     | first Tab, then Enter                                                  | keyboard   | amber pill appears; focus moves to `main` | —            | Skip link, CAP-5         |         |
| Book a demo   | width 640px or less                                                    | —          | hidden                                    | —            | CAP-6                    |         |

The optional UX tools on branch `feature/ux-quality-loop` (PR #11: `ux:parity`, `ux:shots`,
`ux-critic`) can check a table like this automatically; until Demo day no story has to run them.
