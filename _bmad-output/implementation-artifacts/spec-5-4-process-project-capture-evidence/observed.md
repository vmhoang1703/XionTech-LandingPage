# Story 5.4 — what was observed

Production build made by `npm run test:smoke`, served with `npx next start -p 3005`, in Chrome via Playwright. Script `walk.mjs`, raw output `walk-output.txt`. Run on 2026-10-05. The capture's `POST /api/contact` was answered by the walk with 200, so no mail was sent.

- **4-D band, `/services` at 1280px.**
  - `section#process` comes right after the mist services section.
  - Its background is navy with the amber radial glow (`radial-gradient …`) and the `gridbg` texture.
  - The head reads "Our 4-D process / From your request to launch, in four steps. / Every step ends with something you can see, test and approve."
- **Reveal.**
  - The flow is `armed` before scrolling and `on` after it scrolls into view.
  - After 2.8 s the amber track fill is 1192 of 1192px.
  - The four steps carry the Services lines and the "You receive" lines from the prototype, e.g. Discovery → "A clear scope, estimate and delivery plan."
- **Alignment.** At 1280px the four "You receive" rows start at the same y (585, 585, 585, 585). One row of 4 steps; the track is 1192×3 and the end node 128×409.
- **Hero "See our 4-D process".**
  - By mouse click and by Enter, the URL becomes `/services#process`.
  - The h2 sits at 230–331, below the header bottom at 72, measured after the smooth scroll stops.
- **Other ways in.**
  - The mega menu's "See the process" (hover Services on Home, then click) lands the same.
  - Opening `/services#process` directly puts the h2 at 230 (1280px) and 198 (390px). All visible.
- **Capture.**
  - It is the last section in `main`, with the amber `linear-gradient` background.
  - It reads "Tell us what you're building.", "Leave your work email and we'll reach out to start Discovery.", with the label "Work email" and a navy "Start a project" button (rgb(22, 54, 99)).
  - Exactly 1 amber band on the page; 1 `hero-navy` and 1 `surface-navy`.
- **Invalid email.** "not-an-email" plus Enter shows "Please enter a valid email address.", keeps focus on the field, and stays on `/services`.
- **Valid email.**
  - "quan@logistics-example.com" plus Enter posts `{"type":"capture","kind":"project",…}` (intercepted).
  - It lands on `/demo#project` with the email not in the URL, the "Outsourcing project" tab selected, the email field prefilled, and the form top at 307 of 900.
- **Narrower layouts.**
  - At 899px and 640px: 2 rows of 2 steps; the track and end node are clipped to 1×3 and 1×1.
  - At 390px: 4 rows of 1. No sideways scroll at any width.
  - At exactly 1080px the band is still 1 row of 4 with the track (`lg` switches at ≥ 1080). At exactly 640px it is 2 columns (`sm` at ≥ 640). This is the site-wide ≥/≤ breakpoint question still pending with Amber and Hoang.
- **Capture at 390px.** The row stacks (`flex-direction: column`), input above button. The input element is 344×20px; the same 20px input shows on Home's capture band, so it comes from Story 2.4 (deferred).
- **Reduced motion.** At 390px the flow phase is `static` (all steps shown at once) and `scroll-behavior` is `auto`. `/services#process` puts the h2 at 198 right after load.
