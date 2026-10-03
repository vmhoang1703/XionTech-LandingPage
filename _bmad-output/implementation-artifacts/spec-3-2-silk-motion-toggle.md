---
title: 'Story 3.2: Continuous silk animation and motion toggle'
type: 'feature'
created: '2026-10-04'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The Home hero needs the moving silk cloth behind it, and a discreet control so a visitor can stop the motion (FR-10, NFR-2, WCAG 2.2.2). It must start still under reduced motion, pause off screen and in a hidden tab, and fall back to the static glow without JavaScript or WebGL. Contract: `_bmad-output/specs/sammy/spec-3-2-silk-motion-toggle/SPEC.md` (CAP-1 to CAP-8).

**Approach:** A client island `src/components/home/hero-silk.tsx` inside the 3.1 Server Component hero: a WebGL canvas running the shader ported from the prototype `site.js` (`silk-shader.ts`, time scale 0.35), and a Pause/Play button. Built first on 2026-10-01; the 2026-10-04 audit against the merged 3.1 and 1.1 found the canvas painted below 3.1's opaque glow layer (so the silk could never show) and inline SVG icons instead of the Phosphor package, fixed here. The shader colours stay raw values in `silk-shader.ts` (WebGL uniforms need numbers), matching the DESIGN.md tokens they name.

</frozen-after-approval>

## UX checks

Sources: story spec CAP-1 to CAP-8, `EXPERIENCE.md` Component Patterns › Motion toggle, `DESIGN.md` (UX-DR12), prototype `site.js` / `site.css`. Checked by the walk in `spec-3-2-silk-motion-toggle-evidence/`.

| Part | State or action | Input | Expected (visible) | Timing | Source | Checked |
| ---- | --------------- | ----- | ------------------ | ------ | ------ | ------- |
| Silk | page load, motion allowed | — | silk cloth visible above the static glow and moving slowly and continuously; canvas `aria-hidden` | continuous, time scale 0.35 | CAP-1 |  ✅ walk: canvas visible, z −1 above glow −2, moving (screenshots 1.5s apart differ); `aria-hidden`; after fix (was z −10, hidden under the glow) |
| Toggle | page load | — | 36px round button at the hero's top right, 70% opacity, ink 50% fill, white 30% border, pause icon only (label hidden) | static | CAP-2, UX-DR12 |  ✅ walk + unit test: 36 × 36 after fix (was 38 wide), top 16 / right 24, opacity 0.7, ink 50%, white 30%, round; label width 0 |
| Toggle | accessible name | — | "Pause motion" while moving; no `aria-pressed` | static | CAP-2, CAP-4 |  ✅ walk + unit test: "Pause motion", `aria-pressed` null |
| Toggle | hover | mouse | opacity 100%, label "Pause motion" slides out | 0.35s | CAP-3, EXPERIENCE.md Motion toggle |  ✅ walk: opacity 1, label 105px |
| Toggle | Tab | keyboard | amber focus ring, label slides out | 0.35s | CAP-3, EXPERIENCE.md Focus ring |  ✅ walk: 2px rgb(255,192,0), label 105px |
| Toggle | click | mouse | silk stops; icon and name switch to "Play motion" | instant | CAP-4 |  ✅ walk + unit test: "Play motion", silk stops |
| Toggle | click again | mouse | silk moves again; "Pause motion" | instant | CAP-4 |  ✅ walk + unit test: "Pause motion", silk moves |
| Toggle | Enter / Space | keyboard | same as click | instant | CAP-4 |  ✅ walk: Enter → Play motion, Space → Pause motion |
| Silk | `prefers-reduced-motion: reduce` | — | page loads with the silk still, toggle reads "Play motion", no transition | static | CAP-5 |  ✅ walk + unit test: "Play motion", silk still |
| Silk | JavaScript off | — | no canvas drawn, no toggle; static glow shows | static | CAP-6 |  ✅ walk (JS off): 0 toggles, canvas not shown |
| Silk | no WebGL / context lost | — | canvas hidden, toggle hidden, static glow shows | instant | CAP-6 |  ✅ walk (getContext webgl → null) + unit test (context lost): 0 toggles, canvas hidden |
| Silk | hero scrolled off screen, or tab hidden | — | animation pauses; resumes on return unless the visitor paused it | instant | CAP-7 |  ✅ unit tests (IntersectionObserver, visibilitychange); walk: moving again after scrolling away and back |
| Silk | first view | — | text and CTA paint before the silk starts (silk starts in an effect after hydration) | after first paint | CAP-8 |  ✅ unit test (silk starts in an effect); Lighthouse not run — see Tests in the PR |
| Toggle | 390px | — | toggle 16px from the right edge, does not overlap the label text | static | prototype `@media (max-width:640px){.motion-toggle{right:16px}}` |  ✅ walk: 16px right gap, no overlap with the label |

## Implementation Notes

- 2026-10-04 audit after merging `develop` (3.1 merged): 3.1's opaque `.silk-fallback` glow sits at z-index −2, but the canvas was `-z-10`, so the silk was painted under the glow and could never be seen. Now `-z-1` (as the prototype: canvas −1, fallback −2), test first. Caught while resolving the merge conflict in `home-hero.tsx`.
- The Pause/Play icons were inline SVG; now Phosphor `PauseIcon` / `PlayIcon` (fill), test first.
- The walk measured the toggle at 38px wide (padding plus border); now `h-9 min-w-9 px-2 justify-center`, 36 × 36, test first.
- The first walk reported the silk still moving after Pause: it compared the whole canvas area, which includes the toggle and text drawn over it. Measuring a 30px strip at the hero's right edge shows it stopped.
- Shader colours stay hex in `silk-shader.ts`: WebGL uniforms need numbers; the comment names the DESIGN.md hero-silk palette they come from.


## Review Triage Log

- Full `bmad-code-review` (4 layers) ran on 3.1–3.6 together on 2026-10-01; its 3.2 findings were fixed then (reduced-motion label, unmount cleanup test, spy restore).
- Light review of the 2026-10-04 fix and `develop` merge (42 lines plus the conflict resolution, Edge Case Hunter): no findings.
