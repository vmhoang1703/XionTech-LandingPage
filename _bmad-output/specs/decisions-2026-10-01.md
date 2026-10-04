# Spec decisions — 2026-10-01

Decided by Hoang Vu (Andy), team lead, after the 31 story specs were written. Each affected spec
records the decision in its `.memlog.md` and its `SPEC.md`.

## Technical

| ID | Decision | Specs |
| --- | --- | --- |
| T1 | CVs go to a **private Vercel Blob store** (free, 1 GB on Hobby), uploaded straight from the browser (client upload), so the 4.5 MB Vercel Function request limit does not apply and the 5 MB CV limit stays. CVs and applicant data are never stored in Sanity: free Sanity datasets are public. Sanity holds only published content (news stories, job posts, Life at XionTechs photos). | 6.6, 1.8, 2.3, 6.5 |
| T2 | Story 1.8 (Andy) builds the Sanity client and one tagged fetch helper in `src/lib/sanity/*`. Each page story writes its own GROQ query with that helper. There is no separate content access module story. | 1.8, 3.7, 6.1, 6.2, 6.3, 6.5, 6.6 |
| T3 | Sammy writes the footer component in `src/components/layout/site-footer.tsx` (the one Sammy file in that folder); Andy mounts it in `src/app/layout.tsx` (in 1.3 at the latest). Andy owns `src/app/demo/*` (2.2) and `src/app/careers/[slug]/*` (6.6). | 1.5, 1.3, 2.2, 2.4, 6.5, 6.6 |
| T4 | Andy chooses a free mail sender and a free shared rate-limit store in Story 2.3 and writes their free-tier limits in the PR. Contact, capture and job applications use the same sender. | 2.2, 2.3, 2.4, 6.6 |
| T5 | All links to `#updates` ("Product updates", sub-nav "Updates") are **hidden on Demo day**; Story 4.5 adds them back with the section. | 1.5, 4.1, 4.2, 4.3, 6.3 |
| T6 | The mobile menu closes when a link in it is activated and when the viewport grows above 1080px. | 1.4 |
| T7 | Story 1.8 (Andy) checks the 3 high `npm audit` findings from the Sanity packages: clear them with an upgrade or `overrides`, or record in the PR why they are accepted. | 1.8 |
| T8 | Demo-day Lighthouse SEO target is **≥ 90**, using the site-wide metadata; 100 needs per-page metadata (Story 7.1, after demo). | 7.4 |

## Content and business

| ID | Decision | Specs |
| --- | --- | --- |
| A1 | App Store and Google Play links and the LXP, SXP and IoT web addresses use **temporary values marked `[Placeholder]`**, kept in one place in the code so they are easy to find and replace later. | 4.2, 4.3 |
| A2 | The 4th About stat ("4 School products ready to demo" replacing "8 Service offerings") is **not confirmed**. Owner: Amber. If it is not confirmed by the build day, it ships marked `[Placeholder]`. | 6.4, 3.3 |
| A3 | The privacy page's cookie section uses **temporary text marked `[Placeholder]`**, filled in later. | 2.1 |
| A4 | Contact and capture submissions, job applications and CVs are **kept with no time limit**. The privacy policy must say so. Open (Amber): how a person asks for their data to be deleted. | 2.1, 2.3, 2.4, 6.6 |
| A5 | The Demo-day Sanity editor is **Hoang Vu**. He needs a Sanity account invited to the project (free plan allows 20 users). | 1.8, 6.3, 3.7, 6.1, 6.5 |

## Added 2026-10-01 (evening)

Decided by Hoang Vu (Andy) before Story 1.3.

| ID | Decision | Specs |
| --- | --- | --- |
| T9 | The focus ring is **2px** wide (DESIGN.md said 2.5px). Chrome draws a 2.5px outline as 2px, even at 2× pixel density (measured in Story 1.1), so 2px is what users saw anyway and now every browser shows the same ring. 2px still meets WCAG 2.2 AA (3:1 contrast) and the AAA 2px minimum. Offset 3px and radius 8px are unchanged. Andy changes `globals.css` in Story 1.3; Amber updates DESIGN.md (focus-ring width). | 1.1, 1.3, every story with focusable elements |
| T10 | Story 1.3 is built **without CAP-7** (mounting the footer), because Story 1.5 is not merged yet. Andy mounts Sammy's footer in `src/app/layout.tsx` in a small follow-up PR as soon as 1.5 merges. | 1.3, 1.5 |
| D1 | Form emails from **dev and preview go to Andy's own inbox**; production goes to vinni.tran@newxion.com. **Changed 2026-10-03 (Andy): every environment, production too, goes to Andy's company email; Vinni receives no form mail.** The address is a server-only environment variable set per Vercel environment, never in the repo. | 2.3, 2.2, 2.4, 6.6 |
| D2 | **XionTech IT / Vinni controls DNS** for newxion.com. Andy asks them to add the mail service's SPF and DKIM records before Story 2.3 (Sun 05/10). | 2.3 |
| D3 | For demo, project and capture requests **the inbox is the record**: the site stores no copy. If sending fails, the form shows a retryable error and keeps every value. (CVs still go to the private Blob store, T1.) | 2.3, 2.2, 2.4 |
| T11 | **Mega menus open on hover** on desktop with a mouse (moved forward from "after demo"): moving away closes after 150ms, a click never closes a menu that hover just opened (AC-NAV-3), touch and pen still use click. This follows `EXPERIENCE.md` "Mega menu" and the prototype. The 0.3s fade and drop stay after demo. | 1.3, 1.4 |

## Added 2026-10-03

Decided by Hoang Vu (Andy), team lead, after Sammy had 1 of 20 stories started on 03/10.

| ID | Decision | Specs |
| --- | --- | --- |
| P1 | **Plan C:** 9 stories move from Sammy to Andy: 1.7 Not found, 2.1 Privacy, 6.5 Careers, 3.7 Home news and demo capture, 6.1 News, 6.2 Story detail, 4.1–4.3 Products. Andy builds the forms and every page that reads Sanity, plus Products (15 stories, about 9.5 developer-days); Sammy owns Home, Services and About and places the capture band in 5.4 and 6.4 (11 stories, about 6.5 developer-days, or 6.0 without the footer under review). Total remaining is about 16 developer-days. The spec folders moved to `specs/andy/`. Cross-owner waits left: Sammy's 5.4 and 6.4 on Andy's 2.4, Andy's 3.7 on Sammy's 3.1, and the footer mount on Sammy's PR #15; 7.3 and 7.4 wait on all pages. The `epics.md` Demo-day plan table (Amber's file) still shows the old split; Amber is told to update it (the lead tells her). Work still exceeds the days left; cuts to decide: 6.3 (lead edits in the Studio by hand), slim 7.3/7.4, 6.6 without CV upload on Demo day, Thu 08 morning as buffer. | 1.7, 1.8, 2.1, 2.4, 3.7, 4.1, 4.2, 4.3, 6.1, 6.2, 6.5, 6.6, 7.3, 7.4 |
| A6 | **A product control whose address is still the stand-in `#` is a disabled label, not a link** (Products: PXP store buttons, LXP/SXP/IoT URL pills; `PLACEHOLDER_HREF` in `src/content/product-links.ts`). A real address makes it a link that opens a new tab with `rel="noopener noreferrer"` and a name ending "(opens in a new tab)". Replaces the new-tab wording for stand-in links in 4.2 CAP-4, 4.3 CAP-2 and EXPERIENCE.md (Browser frame, store buttons); Amber is told to update them. | 4.2, 4.3 |
| A7 | **Product feature copy is shown as fact** for PXP, LXP, SXP and IoT: the business confirmed descriptions and feature lists on 2026-09-28 (EXPERIENCE.md). PXP's platforms ("iOS and Android") stay `[Placeholder]` until confirmed. | 4.2, 4.3 |
| L1 | **Products layout:** the media (PXP phone, SXP browser frame) comes first in the markup, as in the mockup, so desktop Tab order matches the screen; below 900px CSS `order` shows the text first so an anchor jump shows the heading. Accepted: below 900px a screen reader reads the media before the text. | 4.2, 4.3 |
| A8 | **Careers (Story 6.5):** the Sanity `job` type gets `slug` (from `title.en`, required), `team` (EN/VI) and `closed` (starts false); an open role is published and not closed. The Life at XionTech photos are three fixed `[Placeholder]` frames until Story 6.3 adds the photo schema; the culture photo is a fixed `[Placeholder]` frame. Replaces the Sanity part of 6.5 CAP-4 and closes its open question. After merge the lead runs `cd studio && npx sanity deploy` and fills slug and team on the sample role. | 6.5, 6.3, 6.6 |

## Added 2026-10-04

Decided by Hoang Vu (Andy), team lead, while building Story 3.7.

| ID | Decision | Specs |
| --- | --- | --- |
| A9 | **News category (Story 3.7):** the Sanity `post` type gets `category` (Product, Company, Schools or Team; required) and `app` (PXP, LXP, SXP or IoT; shown only when the category is Product). The Home news card tag reads from them ("Product · PXP", "Team"); the post had no category field, so the tag had no data source. After merge the lead switches to `develop` and pulls, runs `cd studio && npx sanity deploy`, then sets a category (and an app for product stories) on each sample post. Until then the Home cards show no tag. Also (lead, 2026-10-04): `slug` and `publishedAt` are required too, so every published post can show; Home never fails because of news — a failed fetch is logged and the section shows its no-stories state (this replaces the 3.7 spec's "Sanity error propagates" for Home; Careers keeps it). | 3.7, 6.1, 6.3 |
