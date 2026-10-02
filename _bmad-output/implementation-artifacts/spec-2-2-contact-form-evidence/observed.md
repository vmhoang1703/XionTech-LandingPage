# Story 2.2 — observed on the dev server

Route: http://localhost:3000/demo (`npm run dev`, branch feature/2-2-contact-form), Chrome via Playwright.
Steps: `node _bmad-output/implementation-artifacts/spec-2-2-contact-form-evidence/walk.mjs`; its raw output is `walk-output.txt`.

Seen:
- 1280px: the form card sits beside the hero (`demo-1280.png`); 390px: it stacks under the hero (`demo-390.png`).
- Breadcrumbs "Home / Contact", 3 check items, 2 offices (Plano with phone, WhatsApp +1 469 439 9345, email; Ho Chi Minh City "Vietnam Delivery Center").
- `/demo` selects Product demo; `/demo#project` selects Outsourcing project (`project-1280.png`); Arrow Right / Home move and select tabs.
- Empty submit: 3 fields `aria-invalid="true"` with red borders and error text, focus on Full name, the live region reads the three errors (`errors-1280.png`).
- `ana@school` rejected; a past date (2020-01-01) rejected; 2,001-character message rejected; typing clears the error.
- Preferred date `min` = 2026-10-02 (today); Service select has 9 options.
- On Outsourcing, Tab goes f-email > f-org > f-role > f-svc > f-when > f-msg > submit > Privacy link — no Product demo field.
- Submit reads "Send request" with the paper-plane icon; consent line ends with "Privacy policy" → `/privacy`.

Note: in `errors-1280.png` the sticky header appears mid-page because the page scrolled to focus Full name and a full-page capture paints it there; not a layout bug.
