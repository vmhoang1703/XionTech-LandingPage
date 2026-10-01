---
id: SPEC-2-4-email-capture
owner: Andy
build_day: 2026-10-05
depends_on: ["2.2", "2.3"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/DESIGN.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/index.html
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/services.html
  - ../../decisions-2026-10-01.md
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 2.4: Email capture band (demo, project)

## Why

Lan, reading a page, should leave only her work email and land on a contact form that is already started, so booking a demo or starting a project takes a few clicks. Most pages end with this band, and Sammy's Home (3.7) and Services (5.4) stories wait for it (mandate: Demo day 2026-10-09). The email is personal data under PDPD, so it never goes in a URL (NFR-3).

## Capabilities

- **CAP-1**
  - **intent:** One shared inline band serves the demo and project intents.
  - **success:** The component takes kind `demo` or `project` only; the button reads "Book a demo" or "Start a project"; it renders as an inline band with H2 and lede left and the form right, never a modal (FR-33, FR-39).
- **CAP-2**
  - **intent:** Each band states how the email is used.
  - **success:** Demo shows "We only use your email to arrange your demo."; project shows "We only use your details to respond to this request."; each ends with a "Privacy policy" link to `/privacy` (FR-40).
- **CAP-3**
  - **intent:** A wrong email is explained accessibly.
  - **success:** On submit with an invalid email, "Please enter a valid email address." shows inline and is announced; the field gets `aria-invalid="true"` and `aria-describedby`; focus returns to the field; the error clears as the visitor types (AC-A11Y-5).
- **CAP-4**
  - **intent:** The email reaches XionTechs, and the visitor sees progress and can retry.
  - **success:** A valid capture is sent by the Story 2.3 mail sender before the redirect (T4); while sending, the button is disabled and reads "Sending..."; if the send fails, the email is kept and an inline error with a retry shows in the band (FR-33).
- **CAP-5**
  - **intent:** The band is readable and focus is visible on amber.
  - **success:** On amber bands the white row has a 1.5px navy border, error text uses `{colors.error}`, and keyboard focus shows a 3px ring in the scoped colour (UX-DR20, UX-DR4).
- **CAP-6**
  - **intent:** A valid email opens the right tab of the contact form, already filled in.
  - **success:** Demo capture lands on `/demo#form`, Product demo tab, Work email prefilled; project capture lands on `/demo#project`, Outsourcing project tab selected, scrolled to the form, Work email prefilled (AC-FORM-2, FR-34).
- **CAP-7**
  - **intent:** The email never leaks and never overwrites the visitor's typing.
  - **success:** The email travels through session storage or a server session, never the URL (no query, no hash); it is cleared once read on `/demo` and never overwrites a value already typed; if session storage is blocked or throws, the visitor still lands on the right tab with no prefill and no error.
- **CAP-8**
  - **intent:** The band fits small phones.
  - **success:** At 640px and below the field stacks above the button.
- **CAP-9**
  - **intent:** The band is left off pages where it does not belong.
  - **success:** No band renders on `/demo`, the Not found page, `/privacy`, `/news/[slug]`, `/careers` or `/careers/[slug]` at any width (FR-33 exceptions).

## Constraints

- Depends on 2.2 (form, tabs, Work email field) and 2.3 (mail sender, T4). Must merge before 3.7 and 5.4.
- Andy owns the component, `src/app/demo/*` (where the prefill is read) and `src/app/careers/[slug]/*` (T3); Sammy's page stories place it (3.7 Home, 5.4 Services, 6.1 News, 6.4 About). The CAP-9 check runs over the routes that exist when it is built.
- Only `demo` and `project` kinds exist. No modal pop-ups.
- Capture Submissions are kept with no time limit; the privacy policy (Story 2.1) says so (A4).
- Keep the labels translatable ("Đặt lịch demo", "Bắt đầu dự án", "Đang gửi..." after demo).
- Port the prototype capture (`#cap-h`, `#cap-email`, `data-mode`); do not redesign. The amber band uses `button-navy`.
- Definition of Done per CLAUDE.md (unit tests 100% changed lines, 80% branch, smoke, lint, local Sonar gate, `bmad-code-review`).

## Non-goals

- Subscribe or talent-network kinds (FR-35 removed 2026-09-29).
- Navy-band variant checks (`{colors.focus-on-navy}` ring, `{colors.error-on-navy}`, AC-A11Y-2 on navy): Story 7.3. No Demo-day page has a navy capture; the Products capture is Story 4.5 (after demo).
- Placing the band on each page: the page stories.
- Vietnamese labels (Story 1.2) and the no-JS redirect (Story 7.2): after demo.

## Success signal

- On https://xiontech-dev.vercel.app a reviewer types a work email in the Home demo band and lands on `/demo#form` with it prefilled and no email in the address bar, and the capture mail reaches the contact inbox; on the Services project band they land on the Outsourcing tab, scrolled to the form.

## Assumptions

- Capture mails go to the Story 2.3 contact inbox (server configuration); T4 names only the shared sender.

## Open Questions

- Do the Story 2.3 honeypot and rate limit also guard the capture send? T4 shares only the sender, and an unguarded mail endpoint invites spam.
- How does a person ask for their submitted data to be deleted? Owner: Amber (A4); the privacy policy must say.
