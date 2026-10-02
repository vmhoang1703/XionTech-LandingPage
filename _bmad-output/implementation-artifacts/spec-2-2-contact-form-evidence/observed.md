# Story 2.2 — observed on the dev server (after review patches)

Route: http://localhost:3000/demo (`npm run dev`, branch feature/2-2-contact-form), Chrome via Playwright.
Steps: `node _bmad-output/implementation-artifacts/spec-2-2-contact-form-evidence/walk.mjs`; raw output in `walk-output.txt`, one line per UX check (L1–L15).

Seen, by UX checks line:
- L1/L2: at 1280px the card sits beside the hero (`demo-1280.png`); at 390px it stacks under it with no horizontal scroll (`demo-390.png`).
- L3: breadcrumbs "Home / Contact", 3 check items, 2 offices.
- L4: `/demo#project` selects Outsourcing project; its pill background is navy rgb(22, 54, 99) (`project-1280.png`).
- L5: `/demo` and `/demo#form` select Product demo.
- L6: Arrow Right, Arrow Right (wraps), Arrow Left (wraps), Home and End all move and select as specified.
- L7: Product demo shows name, email, org, role, PXP/LXP/SXP/IoT (PXP checked), school size, date, message — at 1280px and 390px.
- L8: Outsourcing shows name, email, org, role, service (9 options), start timing, message.
- L9: on Outsourcing, Tab never reaches a Product demo field.
- L10: empty submit → 3 fields `aria-invalid`, border rgb(179, 38, 30), focus on Full name, live region reads the three errors (`errors-1280.png`).
- L11: `ana@school` rejected, `ana@gmail.com` accepted. L12: `min` = today (2026-10-02); 2020-01-01 rejected. L13: 2,001 characters rejected. L14: typing clears the error.
- L15: "Send request" with an icon; consent line; "Privacy policy" → `/privacy`, underlined.

Not observed: a real screen reader (the live-region text was read from the DOM). In `errors-1280.png` the sticky header shows mid-page because the page scrolled to focus Full name; not a layout bug.
