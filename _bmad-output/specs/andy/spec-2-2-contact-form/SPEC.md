---
id: SPEC-2-2-contact-form
owner: Andy
build_day: 2026-10-04
depends_on: ["1.1"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/demo.html
  - ../../decisions-2026-10-01.md
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 2.2: Two-tab contact form

## Why

Lan (booking a demo) and Quân (starting a project) need one clear form that asks only what is needed and blocks mistakes, so the request is complete the first time. Forms are live on Demo day 2026-10-09, and Stories 2.3 and 2.4 build on this form. The field table and wording in EXPERIENCE.md (Contact form fields, Wording to reuse) are the exact contract.

## Capabilities

- **CAP-1**
  - **intent:** `/demo` shows the contact page with the form next to the reassurance content.
  - **success:** A navy hero shows breadcrumbs "Home / Contact", the H1, three reassurance items and both offices; the paper form card sits beside it on desktop and stacks below 900px; no email capture band on this page.
- **CAP-2**
  - **intent:** The URL hash picks the request type.
  - **success:** `#project` selects the Outsourcing project tab on load; any other hash or none selects Product demo; tabs follow the ARIA tab pattern (FR-36).
- **CAP-3**
  - **intent:** Each tab asks only for its fields.
  - **success:** Both tabs: Full name, Work email, School or company (required), Role (optional, help "For example: Principal, Head of IT"), Message (optional). Product demo adds Products of interest (PXP, LXP, SXP, IoT pills, PXP checked by default), School size (Under 500 students; 500 to 1,500 students; Over 1,500 students; Multiple campuses) and Preferred date. Outsourcing project adds Service (the 8 services plus "Not sure yet") and Start timing (As soon as possible; In 1 to 3 months; Just exploring).
- **CAP-4**
  - **intent:** Fields of the hidden tab stay out of the way.
  - **success:** With Outsourcing active, Tab never focuses a Product demo field, and Product demo fields are not validated or submitted (and the same the other way) (AC-A11Y-3).
- **CAP-5**
  - **intent:** Submit shows every problem clearly and accessibly.
  - **success:** Pressing "Send request" with empty required fields and a malformed email sets `aria-invalid="true"` on each invalid field, links it to its error with `aria-describedby`, announces the errors and focuses the first invalid field; wording is "Please enter your name.", "Please enter a valid email address.", "Please enter your organisation."; free-mail domains are accepted (AC-A11Y-5).
- **CAP-6**
  - **intent:** A demo cannot be booked for a past date.
  - **success:** The Preferred date picker starts at today in the visitor's time zone; a date before today shows "Please choose today or a later date." (AC-FORM-1, FR-37).
- **CAP-7**
  - **intent:** Messages stay a readable length.
  - **success:** A message over 2,000 characters shows "Please keep your message under 2,000 characters." on submit.
- **CAP-8**
  - **intent:** The form uses the agreed action label and consent line.
  - **success:** The submit reads "Send request"; the consent line reads "We only use your details to respond to this request." and ends with a "Privacy policy" link to `/privacy` (FR-39, FR-40).

## Constraints

- Depends on 1.1. Stories 2.3 and 2.4 depend on this one.
- Keep the validation rules and error wording in one shared module, so Story 2.3 runs the same rules on the server.
- Andy owns `src/app/demo/*` and builds the `/demo` route in this story (T3).
- No `/en` `/vi` prefix on Demo day; keep every string in a form that can be translated later (VI submit label "Gửi yêu cầu"). Service and product names stay English.
- Port `demo.html` (`.ftabs`, `#demoForm`, `#f-name` to `#f-msg`); do not redesign. Invalid border `{colors.error-border}`, error text `{colors.error}` on paper (UX-DR21).
- Server Components by default; the form is a client component. Next.js 16: read `node_modules/next/dist/docs/` for forms first.
- Definition of Done per CLAUDE.md (unit tests 100% changed lines, 80% branch, smoke, lint, local Sonar gate, `bmad-code-review`).

## Non-goals

- Bringing back typed hidden-tab values when the visitor switches tabs: after demo.
- Sending, success and failure states, delivery, server validation, honeypot and rate limit: Story 2.3.
- Reading the prefilled email from a capture band: Story 2.4.
- Vietnamese strings (Story 1.2), shared breadcrumbs component (Story 1.6), behaviour without JavaScript (Story 7.2): after demo.

## Success signal

- On https://xiontech-dev.vercel.app/demo#project the Outsourcing tab opens; pressing "Send request" with empty fields focuses Full name and a screen reader announces the three errors; on `/demo` a past Preferred date is rejected.

## Assumptions

- Breadcrumbs use the simple prototype markup until Story 1.6.
- The offices block reuses the office data of the footer (Story 1.5 says the same blocks appear on Book a demo).
