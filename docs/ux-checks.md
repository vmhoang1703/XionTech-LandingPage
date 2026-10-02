# UX checks in the spec

Every UI story's build spec has a **UX checks** table: how each part must look and behave, one
testable line per check. The developer builds to the table and checks every line before the PR.
This finds gaps before any code exists (on the header, menus that open only on click were found
only after the build, because no line said "hover opens").

## Rules

- **One line, one check a person can see.** No "looks nice", no "works well".
- **Looks and behaviour.** Behaviour lines name the action and the input: mouse, touch or keyboard.
- **Every interactive part** in `EXPERIENCE.md` (Component Patterns, Interaction, acceptance
  criteria) gets its behaviour lines: open, close, keyboard, Escape, touch, focus.
- **A source for every line:** a `DESIGN.md` or `EXPERIENCE.md` section, or a decision ID.
- **Mockup vs `DESIGN.md`:** where they disagree, the line says which one wins. Ask Amber before
  building; agents never pick silently.
- **Before the PR:** check every line, by hand or with a test, and copy the table into the PR
  with a tick per line.

## Template

| Part | State or action | Input | Expected (visible) | Timing | Source |
| ---- | --------------- | ----- | ------------------ | ------ | ------ |
|      |                 |       |                    |        |        |

## Example: the desktop header (Story 1.3)

| Part          | State or action            | Input    | Expected (visible)                               | Timing      | Source                 |
| ------------- | -------------------------- | -------- | ------------------------------------------------ | ----------- | ---------------------- |
| Header bar    | page scrolls               | any      | stays on top; glass background; 72px high        | —           | DESIGN.md header       |
| Nav item      | current page               | —        | navy, bold, 2px amber underline                  | —           | DESIGN.md nav          |
| Products menu | hover                      | mouse    | opens                                            | —           | EXPERIENCE.md AC-NAV-3 |
| Products menu | pointer leaves             | mouse    | closes                                           | after 150ms | AC-NAV-3, decision T11 |
| Products menu | click, then pointer leaves | mouse    | stays open                                       | —           | decision T11           |
| Products menu | Enter                      | keyboard | opens; Tab moves into the panel                  | —           | AC-NAV-3               |
| Products menu | Escape                     | keyboard | closes; focus back on "Products"                 | —           | AC-NAV-3               |
| Products menu | tap                        | touch    | opens; no hover behaviour                        | —           | EXPERIENCE.md          |
| Products menu | click outside              | mouse    | closes                                           | —           | AC-NAV-3               |
| Skip link     | first Tab                  | keyboard | amber pill appears; Enter moves focus to content | —           | CAP-5                  |
| Book a demo   | width 640px or less        | —        | hidden                                           | —           | CAP-6                  |

The optional UX tools in `docs/ux-quality.md` (`ux:parity`, `ux:shots`, `ux-critic`) can check a
table like this automatically; until Demo day no story has to run them.
