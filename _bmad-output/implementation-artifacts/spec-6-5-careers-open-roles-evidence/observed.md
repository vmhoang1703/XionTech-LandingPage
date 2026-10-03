# Story 6.5 — observed surface (2026-10-03)

Surface: `/careers` (new page), reached from the header "Careers" link or directly.

Not reached in this run. `next dev`, `next build` and `next start` cannot run in the
worktree `C:/XionTech/LandingPage-6-5`: Turbopack rejects its `node_modules` junction.
The controller runs `npm run build && npm run test:smoke` and the browser walk of every
UX checks row in the main checkout later.

What was observed instead (jsdom, Vitest; transcript in `verification.txt`):
- `src/app/careers/page.test.tsx`: the page renders the H1, `section#roles`, `section#life`
  in mockup order and no form, input or capture band.
- `src/components/careers/careers.test.tsx`: each role card is one link to `/careers/<slug>`
  with no nested link or button; `[]` shows "No open roles right now."; three `#life`
  frames with `[Placeholder]` captions; hero buttons point to `#roles` and `#life`.
