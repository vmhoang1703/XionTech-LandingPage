---
id: SPEC-ENH-A4-forms-bands
owner: Andy
build_day: 2026-10-08
depends_on: ["E-A1", "E-A2"]
companions:
  - ../../enhancement-2026-10-07/README.md
  - ../../decisions-2026-10-01.md
  - ../../../prototype-enhancement/prototype/index.html
  - ../../../prototype-enhancement/prototype/about.html
  - ../../../prototype-enhancement/prototype/demo.html
  - ../../../prototype-enhancement/prototype/js/site.js
  - ../../../prototype-enhancement/prototype/css/site.css
  - ../../../../docs/contact-delivery.md
sources:
  - ../../../prototype-enhancement/enhancement-log.md
---

# E-A4 Home contact form, plain email bands, "Summit reached"

Covers: ENH-001, ENH-010, ENH-026 (Home contact part), ENH-036, ENH-043 (forms part), ENH-051 (email
band part), ENH-059 (About band look). Tier 2: ENH-066 (newsletter).

## Why

A visitor can start a conversation on Home without leaving it. The email sections blend into the page
instead of sitting in coloured boxes, and every form thanks the visitor with a small summit.

## Capabilities (Tier 1)

- **CAP-1 Home contact section `#contact`.**
  - An amber section with "Have something you want to build?" and its lede, copied from `index.html`.
  - Contact links: `vinni.tran@newxion.com` (the confirmed address the prototype uses on Home), and the
    Plano and Ho Chi Minh City phone links from `offices.ts`.
  - Fields:
    - Name (required);
    - Work email (required);
    - Phone (optional), with placeholder "(+1) 469 322 9899";
    - Message (required, 2,000 characters at most).
  - The button "Start the conversation", with no glow and no lift.
  - A consent line that links to Privacy.
  - Success shows in place.
  - It is the last section of Home and replaces `CaptureBand` there. Add `<HomeContact />` to
    `src/app/page.tsx` and keep Sammy's order (E-S1).
  - It fits a 320px screen with no sideways scroll (ENH-026).
- **CAP-2 API.** `/api/contact` accepts a third type, `general` (decision Q3).
  - Fields: name, email, optional phone, message. No organisation, role or product.
  - `contact-rules.ts`: add `general` to `ContactType`. Organisation is required only for `demo` and
    `project`.
  - `submission.ts`: add a `general` branch; the current code assumes demo, otherwise project.
  - Phone: empty, or 7 to 15 digits with an optional leading `+` and spaces, dots, dashes or brackets
    (`js/site.js:593`). The same rule runs on the client and the server.
  - `delivery.ts`: a `general` subject and mail text with no service rows.
  - Delivered and rate-limited like the others (decisions D1, D3 and T4).
  - Tests cover the new type and keep the old ones green.
- **CAP-3 Summit success.**
  - The contact, Demo, Home and job forms show a small mountain with a rising flag above "Summit
    reached." and the existing thank-you text.
  - The flag is decorative (`aria-hidden`). With reduced motion it shows without moving.
  - Never ship any "Prototype: nothing was sent" text: Home has it without brackets, Demo and job with
    brackets. Check with `grep -r "Prototype: nothing was sent" src`.
- **CAP-4 Plain bands.**
  - `CaptureBand` gets a plain look: no corner rings, on the colour of the page around it.
  - Pages choose the look: About white, News the page's light blue, Products navy.
  - The consent line stays (decision Q13, privacy decision A4).
  - Services no longer renders a band; Sammy removes it in E-S2.

## Constraints

- Andy owns the forms, `CaptureBand` and the contact API. E-A2 changes the product options first;
  rebase on it.
- The `@smoke` check `e2e/smoke.spec.ts:11` expects "See it working at your school." on `/`. Whichever
  of E-A4 and E-S1 merges second changes it to the new H1.
- Walks intercept `POST /api/contact`, so no real mail is sent.
- Definition of Done from `CLAUDE.md`.

## Non-goals for this build (Tier 2, after the demo)

- **News newsletter sign-up** (ENH-066, decision Q4). "Subscribe to our newsletter." with "You're
  subscribed" shown in place. It needs a new contact type and somewhere to store subscriber emails.

## Open questions

- Q3 (delivery): default type `general`. If the answer differs, the Home form posts type `project` with
  the phone in the message, or links to `/demo`.
- Q4 (newsletter): default "after the demo".
- Q13 (consent line): default "keep".

## Success signal

On the preview, a visitor sends the Home form with no phone number and sees "Summit reached." in
place, and a phone number of "12" is rejected on the client and on the server.

## Request to paste

```
/bmad-build _bmad-output/specs/andy/spec-enh-a4-forms-bands — E-A4 Home contact form (#contact; new "general" type in /api/contact with an optional phone), "Summit reached" success on every form, plain CaptureBand look. Branch feature/enh-a4-forms-bands from an up-to-date develop after E-A1 and E-A2 merge. Full route: API change.
```
