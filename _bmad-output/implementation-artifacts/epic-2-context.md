# Epic 2 Context: Contact, email capture and privacy (PDPD)

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Give visitors one reliable way to reach XionTechs: a two-tab contact form at `/demo` (Product demo and Outsourcing project) and inline email capture bands on most pages that hand off to that form. Every Submission must be validated on client and server, protected from spam, and delivered to the contact inbox, and a privacy policy at `/privacy` must cover all data collected (Vietnam PDPD, Decree 13/2023). This epic comes early because later page epics embed the capture band. Demo day (2026-10-09) is English only; Vietnamese strings and VI parts of the acceptance criteria are checked after demo. No architecture document exists, so technical choices below are partly assumptions.

## Stories

- Story 2.1: Privacy policy page
- Story 2.2: Two-tab contact form
- Story 2.3: Submission delivery and spam protection
- Story 2.4: Email capture band (demo, project)
- Story 2.5: No non-essential cookies without consent

## Requirements & Constraints

- **Contact form:** URL hash picks the tab (`#project` opens Outsourcing; anything else opens Product demo). Fields in the hidden tab cannot take focus, are not validated and are not submitted, but typed values are kept when switching back (the "values return" part is deferred past Demo day). Submit marks every invalid visible field and focuses the first.
- **Fields:** both tabs: Full name, Work email, School or company (required), Role (optional, help "For example: Principal, Head of IT"), Message (optional, max 2,000 chars). Product demo adds Products of interest pills (PXP, LXP, SXP, IoT; PXP checked), School size, Preferred date (today or later in the visitor's time zone; picker starts at today). Outsourcing adds Service (8 services + "Not sure yet") and Start timing.
- **Exact wording:** "Please enter your name.", "Please enter a valid email address." (free-mail domains accepted), "Please enter your organisation.", "Please choose today or a later date.", "Please keep your message under 2,000 characters." Submit "Send request"; sending "Sending..."; success "Thank you!" + "We will be in touch soon." (only exclamation mark allowed on the site). Capture buttons "Book a demo" (demo intent only) and "Start a project" (project intent only).
- **Consent lines** (each ends with a "Privacy policy" link to `/privacy`): contact and project forms "We only use your details to respond to this request."; demo capture "We only use your email to arrange your demo."
- **States:** idle, error, sending (button disabled), success (form replaced by a `role="status"` panel), send failure (keep every value, error above the button with retry). Rate-limited visitors also get a retryable error and keep their input.
- **Server rules mirror the client** (required fields, email format, message length, date not in the past) with the same wording. Honeypot field has `tabindex="-1"`, `aria-hidden="true"`, `autocomplete="off"`; filled honeypot is rejected silently (not delivered). Rate limit keyed on IP + email, 5 per 10 minutes (assumption), so colleagues on one office IP are not blocked.
- **Delivery:** demo and project Submissions are emailed to the contact inbox (the lead's company email in every environment, changed 2026-10-03 from vinni.tran@newxion.com), set in server configuration, not hardcoded.
- **Personal data (PDPD):** never in any URL, query string or hash; collected only for the stated purpose. No non-essential or third-party cookies; the only stored values are the essential first-party locale cookie, the motion preference (local storage) and the capture email (session storage, cleared once read).
- **Capture band:** one shared component with kind `demo` or `project` only (no subscribe or talent-network kinds). Valid demo capture goes to `/demo#form` (Product demo tab); valid project capture goes to `/demo#project` (Outsourcing tab, scrolled to form); email prefilled via session storage, never overwriting a typed value. If session storage is blocked or throws, still redirect, no prefill, no error. No band on `/demo`, Not found, `/privacy`, `/news/[slug]`, `/careers` or `/careers/[slug]`.
- **Privacy page:** H1 "Privacy policy." plus eight sections (Who we are and how to reach us; What we collect; How we use it; Who we share it with; Transfers outside Vietnam; How long we keep it; Cookies and analytics; Your rights). The cookies section names the essential locale cookie and states no non-essential cookies without consent. Unverified text starts with `[Placeholder]`. No form may go live at public launch before the policy text is real.
- **Cookies later:** if analytics or any non-essential cookie is added, a consent banner with decline as the default must show before anything is set. An automated test must prove a fresh page load sets no non-essential cookies.
- **Accessibility:** errors get `aria-invalid="true"`, linked with `aria-describedby`, and are announced (AC-A11Y-5); hidden tab content is unfocusable (AC-A11Y-3); visible focus on every surface (AC-A11Y-2). Capture errors clear as the visitor types; focus returns to the email field.
- **Content integrity:** no invented content; unverified text starts with `[Placeholder]`.

## Technical Decisions

- Next.js 16 App Router (`src/`), React 19, TypeScript strict, Tailwind v4 tokens in `src/app/globals.css`. Read `node_modules/next/dist/docs/` before using form/server APIs.
- Submissions go through a server-side handler (server action or route handler) that runs validation, honeypot and rate limit (assumption). Share one validation rule set between client and server so wording stays identical.
- Mail sender service and the shared rate-limit store are not yet chosen; both must be free tier, and the store must work across serverless instances on Vercel (no in-process counters). Configuration comes from environment variables, validated at startup; no secrets in code.
- Form card and capture band build on shadcn/ui primitives (Tabs, Input, Select, Checkbox) once added.
- Behaviour without JavaScript for the capture redirect and the two-tab form is still open (handled later in Story 7.2).
- Data retention period for Submissions is undecided and must be set before public launch.

## UX & Interaction Patterns

- `/demo`: `hero-navy` split hero with breadcrumbs "Home / Contact", H1, three reassurance items and both offices; paper form card (28px radius, large shadow) beside it on desktop, stacked full width below 900px. Pill tabs follow the ARIA tab pattern; 2-column field grid; checkbox pills for products; full-width message.
- Invalid field border uses `{colors.error-border}`; error text uses `{colors.error}` on paper and amber, `{colors.error-on-navy}` on navy.
- Capture band: H2 + lede left, form right; never a modal. White pill row holding field and button; 1.5px navy border on amber bands; 3px focus ring in `{colors.focus-on-navy}` on navy bands. At 640px and below the field stacks above the button.
- Focus ring: 2.5px, 3px offset; navy on light and amber surfaces, amber on navy.
- Visual reference: prototype `prototype-enhancement/prototype/demo.html` (form) and `index.html` / `services.html` captures; the UX spines win on any conflict. The prototype's "Prototype: nothing was sent." suffix is not shipped.

## Cross-Story Dependencies

- All stories depend on Story 1.1 (brand tokens, fonts, surfaces). Story 2.5 depends on 1.2 (locale routing and the locale cookie), which is after demo.
- 2.3 and 2.4 depend on 2.2 (form, field rules, hash-to-tab logic, prefill target).
- 2.1 must exist for every consent line's and the footer's "Privacy policy" link.
- Later page stories (3.7 Home, 5.4 Services, News, About) embed the 2.4 capture band and start after it merges.
- Job application form (Story 6.6) reuses the honeypot, rate limit and server-validation approach from 2.3, but stores to Sanity instead of email.
- Navy-band focus and error colours for captures are verified in Story 7.3.
