# Code review: UX first draft (2026-09-28)

Review of commit `5de6f01` on `docs/ux-first-draft` with `bmad-code-review`.

- **Layers:** Blind Hunter, Edge Case Hunter, Verification Gap. Acceptance Auditor was skipped because there is no spec.
- **Scope:** `.working/site-v3/`, `README.md`, `ai-log-entry.md`. The earlier exploration rounds were out of scope.
- **Result:** 18 patch, 5 defer, 12 rejected.

The prototype is a design reference, not production code (see `README.md`). So only the findings
that block reviewing the prototype or break team rules were fixed in it. The rest are acceptance
criteria for the Next.js build, so the lessons land in the real code.

## Fixed in the prototype

| # | Finding | Fix |
| --- | --- | --- |
| 1 | Clicking or pressing Enter on a screenshot frame did not open the file picker (the input's own click bubbled up and was cancelled). Enter on the remove button opened the picker. | Slot handlers ignore events coming from their own children. |
| 2 | Unverified content was not marked: store links, the app web addresses, "hiring round coming soon" and "about twice a month". | Marked `[Placeholder]`. |
| 11 | Forms collect personal data but there is no privacy policy link (Vietnam PDPD, Decree 13/2023). | `[Placeholder] Privacy policy` link in the footer; listed as missing in `README.md`. |
| 18 | The AI log did not say that accessibility and responsive layout were never checked. | Added to `ai-log-entry.md`. |

## Acceptance criteria for the Next.js build (from the other 14 findings)

Add these to the relevant stories when the epics are created.

### Navigation and header
- **AC-NAV-1:** The EN/VI switch is available at every screen width. On mobile it is in the header or the menu.
- **AC-NAV-2:** "Book a demo" is reachable at every width. Below the desktop breakpoint it appears inside the mobile menu.
- **AC-NAV-3:** On desktop, a click on "Products" or "Services" never closes a menu that hover just opened. Hover opens, click toggles predictably, Escape closes.
- **AC-NAV-4:** The mobile menu closes with Escape. The menu button has `aria-controls` and `aria-expanded`.
- **AC-NAV-5:** In-page links (`#process`, `#pxp`, `#values`, and so on) land with the section heading fully visible below the sticky header and the product sub-nav (`scroll-margin-top`).

### Accessibility
- **AC-A11Y-1:** All text meets WCAG 2.2 AA (4.5:1, or 3:1 for large text) and icons meet 3:1. Do **not** use `#C99700` for text or icons on white or mist; use `#8A6700` (5.14:1 on paper, 4.65:1 on mist). `#8F6B00` fails on mist (4.38:1).
- **AC-A11Y-2:** Every focusable element has a visible focus indicator on every section colour. On navy sections, the email field's focus ring uses amber, not navy.
- **AC-A11Y-3:** Hidden content (inactive phone screens, closed tabs) cannot receive keyboard focus.
- **AC-A11Y-4:** There are no interactive elements nested inside links. Product tiles that contain media use a separate link or a stretched-link pattern.
- **AC-A11Y-5:** Invalid form fields get `aria-invalid="true"` and are linked to their error text with `aria-describedby`. Validation errors are announced.

### Forms and content
- **AC-FORM-1:** The preferred demo date cannot be in the past.
- **AC-FORM-2:** A "Start a project" email capture opens the contact page on the **Outsourcing project** tab, scrolled to the form.
- **AC-FORM-3:** Image and screenshot uploads, where they exist in the CMS, only change the item the user selected. A paste never goes to a previously hovered item.

### Styling and performance
- **AC-UI-1:** Card hover animations start without delay after scroll-reveal has finished.
- **AC-UI-2:** The "You receive" rows in the 4-D process line up across all four cards.
- **AC-PERF-1:** Icon libraries and third-party scripts do not block rendering (use a React icon package or defer the script).

## Deferred

- **No automated tests for the prototype script.** Test navigation, forms, EN/VI and news filters in the Next.js build (Vitest and Playwright are set up on `feature/setup-project`).
- **Translation beyond visible text.** Page titles, meta descriptions, screen-reader labels and toasts need VI versions. Serve `/en/` and `/vi/` URLs with `hreflang`.
- **Page metadata.** Favicon, canonical and Open Graph tags per page (use the Next.js Metadata API).
- **News story pages.** "Read story" needs a detail page, and the filters need an empty state. This depends on the CMS decision.
- **Duplicated blocks.** The stats band and the 4-D flow are copied across pages in the prototype. Build them as single components.

## Rejected (12)

- The page goes blank if IntersectionObserver is missing. Low: every supported browser has it.
- A script error if the header or footer placeholder is missing. False: all 7 pages have both.
- A zero-size image is saved as empty. Low and unlikely.
- An invalid stored language value. Low: it only happens if storage is edited by hand.
- The `.hl` highlight overflows on tablets. Low: the measured phrases fit their containers.
- The README points to files missing from the commit. False: they are in `5de6f01`; the review diff was deliberately narrowed.
- The About page's email capture opens the demo tab. Low: both tabs are on the form.
- Badge colours are swapped on coloured tiles. Low: the swap is intentional, for contrast.
- Form inputs have no `name` attributes. Low: the prototype deliberately submits nothing.
- The tabs do not follow the full ARIA tab pattern. Low: the fix adds complexity to a prototype.
- Mobile menu scroll lock and focus trap. Low: the fix adds complexity to a prototype.
- A duplicate `.flow.lit .step4` rule. False: the two rules set different properties.
