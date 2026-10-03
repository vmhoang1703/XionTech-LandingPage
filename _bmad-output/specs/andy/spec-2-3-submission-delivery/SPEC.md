---
id: SPEC-2-3-submission-delivery
owner: Andy
build_day: 2026-10-05
depends_on: ["2.2"]
companions:
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/EXPERIENCE.md
  - ../../../planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/mockups/site-v3/demo.html
  - ../../decisions-2026-10-01.md
sources:
  - ../../../planning-artifacts/epics.md
  - ../../../planning-artifacts/prds/prd-XionTech-LandingPage-2026-09-28/prd.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Story 2.3: Submission delivery and spam protection

## Why

Forms are live on Demo day 2026-10-09, and the site is used as the real company site after it. Every demo and project request must reach XionTechs, a visitor like Quân must never retype a request or wonder if it arrived, and spam must not flood the inbox. Personal data is under Vietnam PDPD (NFR-3).

## Capabilities

- **CAP-1**
  - **intent:** The visitor sees that the request is sending and that it arrived.
  - **success:** On submit of a valid form the button is disabled and reads "Sending..."; on success the form is replaced by a `role="status"` panel reading "Thank you!" and "We will be in touch soon." (FR-36).
- **CAP-2**
  - **intent:** A failed send never loses what the visitor typed.
  - **success:** When the server rejects or times out, every entered value is kept and an error shows above the button with a way to retry.
- **CAP-3**
  - **intent:** The server applies the same rules as the browser.
  - **success:** A Submission that bypasses client checks is rejected by the server for missing required fields, bad email format, a message over 2,000 characters or a preferred date before today, with the same wording as the client, including "Please keep your message under 2,000 characters." (FR-38).
- **CAP-4**
  - **intent:** Bots that fill every field are stopped without bothering people.
  - **success:** The hidden honeypot field has `tabindex="-1"`, `aria-hidden="true"` and `autocomplete="off"`; a Submission with it filled is rejected and not delivered.
- **CAP-5**
  - **intent:** Repeated sending from one source is limited without blocking a whole office.
  - **success:** Keyed on IP plus email, a key over 5 Submissions per 10 minutes is rejected and not delivered; another email on the same IP is not blocked; a real visitor over the limit sees a retryable error and keeps what they typed; counters live in a shared store that works across serverless instances.
- **CAP-6**
  - **intent:** Valid requests reach the contact inbox and personal data stays out of URLs.
  - **success:** An accepted demo or project Submission is sent by the mail sender service to the contact inbox (the lead's company email, decided 2026-10-03; before: vinni.tran@newxion.com), set in server configuration; no personal data appears in any URL, query string or hash (NFR-3).

## Constraints

- Depends on 2.2 (form and shared validation rules). Story 6.6 reuses these server checks for job applications. Capture (2.4) and job applications (6.6) send through the same mail sender (T4).
- Andy owns `src/app/api/*`. The inbox address, mail sender key and store credentials are server-only environment variables, validated at startup, never `NEXT_PUBLIC_*`, never in source; logs never contain personal data.
- Andy picks a free mail sender and a free shared rate-limit store in this story and writes their free-tier limits in the PR (T4); name any limit that would force a paid plan. No in-process counters (serverless, and no unbounded in-memory state).
- Submissions are kept with no time limit; the privacy policy (Story 2.1) says so (A4). No automatic deletion.
- Do not ship the prototype success suffix "Prototype: nothing was sent."
- Keep the "Sending..." and error strings translatable (VI "Đang gửi..." after demo).
- Next.js 16: read `node_modules/next/dist/docs/` for server actions or route handlers before writing code.
- Definition of Done per CLAUDE.md (unit tests 100% changed lines, 80% branch, smoke, lint, local Sonar gate, `bmad-code-review`).

## Non-goals

- Job applications and CV upload to a private Vercel Blob store: Story 6.6. Nothing is stored in Sanity (T1).
- Email capture band behaviour: Story 2.4.
- Form submit without JavaScript: Story 7.2 (after demo).
- Cookie consent (Story 2.5) and privacy policy text (Story 2.1).

## Success signal

- On https://xiontech-dev.vercel.app/demo a reviewer sends a Product demo request and the email arrives at the contact inbox; a sixth request with the same email within 10 minutes shows a retryable error with all values kept.

## Assumptions

- The limit of 5 Submissions per 10 minutes per IP plus email is a PRD `[ASSUMPTION]`.

## Open Questions

- How does a person ask for their submitted data to be deleted? Owner: Amber (A4); the privacy policy must say.
