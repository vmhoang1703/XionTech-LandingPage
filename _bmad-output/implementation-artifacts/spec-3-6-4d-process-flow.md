---
title: 'Story 3.6: 4-D process component'
type: 'feature'
created: '2026-10-05'
status: 'in-progress'
route: 'oneshot'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Home's navy band must show the 4-D process as one ordered flow ("Your request", 01 Discovery, 02 Design, 03 Development, 04 Deployment, "Launch", each step with its line and "You receive"), lighting up once when 30% visible, readable without motion or JavaScript, with the "You receive" rows aligned above 1080px; one shared component Story 5.4 reuses at `/services#process` (FR-23, UX-DR14, AC-UI-2). Contract: `_bmad-output/specs/sammy/spec-3-6-4d-process-flow/SPEC.md` (CAP-1 to CAP-5).

**Approach:** `src/components/sections/process-flow.tsx` (step content passed as data) with the client `flow-reveal.tsx` driving the one-time reveal; `src/components/home/home-process.tsx` places it on Home before Andy's capture band. Built first on 2026-10-01 before 1.1 merged with Tailwind-only styling and no illustrations. The 2026-10-05 comparison with the prototype found missing step art (main icon and three orbs), node icons, the dashed track and "You receive" rule, the section's `.label` and grid texture, and a flash on load (server HTML visible, hidden at hydration, then replayed even when already on screen). Fixed here by porting the prototype `.gridbg`, `.flow`, `.track`, `.node`, `.step4`, `.art`, `.orb`, `.num`, `.get` rules into the Home section of `globals.css` with tokens (`@theme` untouched), Phosphor icons for the prototype's `ph-*` glyphs (icons are part of the step data so 5.4 can reuse them), and a reveal that skips the hide when the flow is already in view at hydration. The 1080px subgrid alignment (CAP-4) stays. Non-goal: the travelling amber dot (after demo).

</frozen-after-approval>

## UX checks

Sources: story spec CAP-1 to CAP-5, `EXPERIENCE.md` (Motion, Responsive), `DESIGN.md` (process-flow), prototype `index.html` (`.flow`) and `site.css` (4-D process, v3 motion overrides). Checked by the walk in `spec-3-6-4d-process-flow-evidence/`.

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Band | page load | — | navy section with the faint grid texture; label "How we work" with the amber rule; H2 "From your request to launch, in four steps." | static | CAP-1, prototype `.s-navy.gridbg`, `.sec-head` |  ✅ walk + unit test: navy gradient, grid texture layer; "How we work" with amber rule; H2 (after fix: plain caps, no texture) |
| Flow | read | — | one ordered list: Your request, 01 Discovery, 02 Design, 03 Development, 04 Deployment, Launch; each step's line and "You receive" text | static | CAP-1 |  ✅ walk + unit tests: Your request > Discovery > Design > Development > Deployment > Launch, lines and "You receive" |
| Nodes | 1280px | — | 128px dashed circle with a paper-plane icon for "Your request"; amber circle with a flag icon for "Launch" | static | prototype `.node`, `.node.end` |  ✅ walk + unit test: 128px dashed glass circle with svg; amber gradient circle with svg (after fix: no icons) |
| Steps | 1280px | — | each card: art panel (navy icon tile, three small orbs, amber glow), amber mono number, Unbounded title, muted line, dashed rule, "You receive" label and text | static | CAP-1, prototype `.step4`, `.art` |  ✅ walk + unit test: 24px card, art 128px with main svg and 3 orbs, mono number in amber-tint, dashed `.get` rule (after fix: no art) |
| Track | 1280px | — | dashed line behind the nodes and card tops, at the art's middle | static | prototype `.flow .track` |  ✅ walk: track y 447 vs art middle 448; dashed |
| Reveal | flow scrolled to 30% visible | — | amber track fills left to right; steps fade and rise in at 0.3s, 0.85s, 1.4s, 1.95s; once only | track 2.4s | CAP-2 |  ✅ walk + unit tests: off screen all four at 0.35/18px; at 0.85s step 1 in, step 2 entering, 3–4 waiting; at 3.3s all in, track full; delays 0.3/0.85/1.4/1.95s; phases static > armed > on, unchanged after scrolling away and back (after fix: the delay also delayed hiding) |
| Reveal | flow already in view when the page loads | — | no hide-and-replay flash: steps stay visible | instant | audit 2026-10-04 (flash) |  ✅ walk (`/#process-title`) + unit test: phases static > on, steps 1/0 from the start (after fix: armed then replayed) |
| Reveal | reduced motion | — | full track and all steps shown at once, no orb bob | static | CAP-3 |  ✅ walk + unit test: phase static, steps 1/0, track none, orb animation none |
| Reveal | JavaScript off | — | all steps and the full track visible | static | CAP-3 |  ✅ walk (JS off): phase static, steps 1/0, track full |
| Alignment | 1280px | — | the four "You receive" rows start on one line | static | CAP-4 (AC-UI-2) |  ✅ walk: all four rows at 663px (subgrid) |
| Layout | 1079px / 639px / 390px | — | track and nodes out of the layout (kept in the list for screen readers); steps 2 columns at 1079, 1 column at 639 and 390; no sideways scroll | static | CAP-5 |  ✅ walk: 1079 and 640 2 columns, 639 and 390 1 column; node and track visually hidden (1px, clipped) but in the list; no sideways scroll |
| Layout | exactly 1080px / 640px | — | wider layout (1.1 switches at ≥) | static | pending: same breakpoint question as 3.1, 3.3–3.5 — ask Amber/Hoang |  ✅ walk: 1080 → 6-column flow with nodes; 640 → 2 columns (pending) |
| Order | page | — | … services → process band → capture band last | static | 3.6 constraint (capture band last) |  ✅ walk + page test: … services > process > capture band |

## Implementation Notes

- 2026-10-05: merged `develop` (3.5); resolved `page.tsx` (process before the capture band), its test (both mocks and both tests) and `home.ts` (`homeServices` stays `as const`).
- Ported the prototype `.gridbg`, `.flow`, `.track`, `.node`, `.step4`, `.art`, `.orb`, `.num`, `.get` rules into the Home section of `globals.css` (tokens; `@theme` untouched); the band uses `.sec`, `.label`, `.sec-head`. Icons are part of the step data in `src/content/process.ts` (Phosphor, the prototype's `ph-*`), so 5.4 reuses them. Orbs are keyed by icon name, not index (Sonar).
- The reveal skips the hide when the flow is already on screen at hydration; the step delay is a `--d` variable applied only while revealing (`.flow[data-phase="on"] .step4`), so hiding is never delayed — the walk first showed steps 2–4 still visible off screen for up to 2s.
- Andy's "no CSS hides content until JavaScript" test flags any `display: none`, even in a media query. Below 1080px the track and nodes are visually hidden (1px, clipped) instead: out of the layout, still in the list for screen readers, not gated on JavaScript.
- Test first: 5 new tests failed, then passed; the delay test failed, then passed. The walk's first "already in view" check used a tall window, which only makes the 100dvh hero taller; it now opens `/#process-title`.

