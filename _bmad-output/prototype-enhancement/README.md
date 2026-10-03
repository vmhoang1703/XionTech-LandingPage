# Prototype enhancement

Owner: Amber Do (BA and UX). Branch: `docs/prototype-enhancement`.

This folder holds the one clickable prototype of the XionTechs website and the log of every change
made to it. Developers build from the prototype; the log tells them what changed and why.

| Path | What it is |
| --- | --- |
| `prototype/` | The prototype: static HTML, CSS and JS. Open `prototype/index.html` in a browser (double-click, no build step). |
| `enhancement-log.md` | Every change made to the prototype since 2026-10-03: what, why, status and the stories it touches. |

The UX specs (`_bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md`
and `EXPERIENCE.md`), the PRD and the epics are not edited for prototype changes. The log is the
hand-off; the team updates a story when it picks up a logged change.

## How we work

1. **One branch.** All prototype work happens on `docs/prototype-enhancement`. No branch per change.
2. **Stay current.** Before each work session and before each push, the branch is rebased on
   `develop`, so the prototype always starts from what the team has merged.
3. **Change the prototype first.** Amber reviews the change in the browser.
4. **Log it.** Each change gets an `ENH-NNN` entry in `enhancement-log.md`, status **Proposed**.
5. **Approve.** When Amber approves, the status becomes **Approved**.
6. **Hand off.** Approved entries go to `develop` in one PR from this branch (status **In PR**, then
   **Merged**). The branch stays open for the next round. Developers pick up merged entries and set
   **Built** when the code matches.

## Names

| Name | Meaning |
| --- | --- |
| `prototype/` | The only prototype. Earlier names (`mockups/site-v3`, the `site-v4` to `site-v6` drafts and the "second draft") are retired. |
| `ENH-NNN` | An enhancement-log entry, numbered in order and never reused. |
| `docs/prototype-enhancement` | The single long-lived branch for prototype work. |
