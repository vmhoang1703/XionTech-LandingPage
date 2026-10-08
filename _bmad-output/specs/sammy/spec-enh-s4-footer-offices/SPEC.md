---
id: SPEC-ENH-S4-footer-offices
owner: Sammy
build_day: 2026-10-08
depends_on: ["E-A1"]
companions:
  - ../../enhancement-2026-10-07/README.md
  - ../../decisions-2026-10-01.md
  - ../../../prototype-enhancement/prototype/index.html
  - ../../../prototype-enhancement/prototype/css/site.css
  - ../../../prototype-enhancement/prototype/js/site.js
sources:
  - ../../../prototype-enhancement/enhancement-log.md
---

# E-S4 Footer and office facts match the prototype

Covers: ENH-043 (ridge part), ENH-044 (footer part), ENH-056 (footer links part), ENH-057,
ENH-058 (footer part), ENH-064, ENH-073 (footer clearance). Tier 2: ENH-045 (climber part), ENH-051
(climber part), ENH-077 (the non-withdrawn part).

## Why

The footer is on every page. It now groups products by audience, lists the offices with icons, and
sits on a mountain ridge. The prototype footer markup is in `js/site.js` lines 31 to 41.

## Capabilities (Tier 1)

- **CAP-1 Columns.** Use the exact links and order from `js/site.js:33-37`.
  - Brand column: the logo and "Education technology products and software delivery services for
    schools and businesses."
  - Products:
    - For schools → `/products#sxp` (Staff Hub);
    - For students → `/products#ai-tutor`;
    - For parents → `/products#pxp` (Parent Hub).

    Until E-A5 merges, `#ai-tutor` does not exist, so the link lands at the top of `/products`.
  - Services: Product Engineering, AI-Driven Analytics, Staffing Service, Low-code Solutions, Cloud
    Computing (each to its `/services#<id>`), How we work (`/services#process`) and All services
    (`/services`).
  - Company: News, About us and Careers. Remove "Core values", "FAQ" and "Contact".
- **CAP-2 Offices in the footer.**
  - Vietnam Delivery Center first, then US Delivery Center, with no city headings.
  - Vietnam rows:
    - pin "Floor 15, B1 Building, 279 Nguyen Tri Phuong Street, Dien Hong Ward, Ho Chi Minh City,
      Vietnam";
    - phone "(+84) 908 107 552";
    - envelope `vinni.tran@xiontechs.com`, only once Q7 confirms it.
  - US rows:
    - pin "7950 Legacy Drive, Suite 400, Plano, Texas 75024, USA";
    - phone "(+1) 469 322 9899";
    - WhatsApp "(+1) 469 439 9345" (new tab, named "(opens in a new tab)");
    - envelope `vinni.tran@newxion.com`.
  - `tel:` links keep the plain international form, for example `tel:+84908107552`.
  - Icons are Phosphor `MapPin`, `Phone`, `WhatsappLogo` and `EnvelopeSimple`, each `aria-hidden`.
- **CAP-3 `src/content/offices.ts`.**
  - Add the tags, the phone display format and the Vietnam email (marked unconfirmed until Q7).
  - The shared order stays Plano first: About and Demo show Plano first in the prototype. Only the
    footer reverses it, for example with a `footerOffices` export.
  - The file is also read by About (E-S3), Demo, Home Capabilities (E-S1) and `services.ts` (the clocks,
    until E-S2 removes them). Update the Demo tests this
    change breaks, and add an order check for About and Demo.
- **CAP-4 Ridge.**
  - A navy mountain-ridge SVG with an amber ridge line on top of the footer, 120px high (72px on
    phones). Copy the paths from `js/site.js:31`.
  - The ridge has no figure on it: ENH-045 removed the X mark from the peak, and the climber is Tier 2.
  - The last section of every page gets bottom padding of `clamp(232px, 17vw, 256px)` (176px on
    phones), so its content clears the ridge.
  - The prototype selector is `main > section:last-of-type`. Use a selector that also matches pages
    whose last section sits inside a background wrapper (Home E-S1, Services E-S2, Careers E-A7).
- **CAP-5 Copyright.** "© 2026 XionTech" stays (brand rule).

## Constraints

- Sammy owns `site-footer.tsx`, `site-footer.ts` and, for this task, `offices.ts`. Andy owns
  `layout.tsx`; this task does not change it.
- Update the footer unit tests and the `e2e` footer checks in this task.
- Definition of Done from `CLAUDE.md`.

## Non-goals for this build (Tier 2, after the demo)

- **Climber** (ENH-045, ENH-064, ENH-077).
  - A small hiker with an amber backpack, decorative (`aria-hidden`).
  - It stands one step further up the ridge on each page, in menu order: Home, Products, Services,
    News, About, Careers (the summit). Privacy, Demo and 404 stay at the foot.
  - It walks there from the previous page's spot and respects reduced motion.

## Open questions

- Q7 (Vietnam email): default "hidden until confirmed".
- Q8 (no Contact link in the footer): default yes.

## Success signal

On every page of the preview, the footer sits on the ridge, the last section's content is not covered,
and "For parents" lands on the Parent Hub card.

## Request to paste

```
/bmad-build _bmad-output/specs/sammy/spec-enh-s4-footer-offices — E-S4 footer columns, offices with icons and the mountain ridge (the climber is Tier 2). Branch feature/enh-s4-footer-offices from an up-to-date develop after E-A1 merges. UI task: UX checks table before coding. offices.ts is shared with About, Demo and Home: keep its order Plano first and reverse it only in the footer. The Vietnam email ships only if confirmed (Q7).
```
