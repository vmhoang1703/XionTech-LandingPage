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
| D1 | Form emails from **dev and preview go to Andy's own inbox**; production goes to vinni.tran@newxion.com. The address is a server-only environment variable set per Vercel environment, never in the repo. | 2.3, 2.2, 2.4, 6.6 |
| D2 | **XionTech IT / Vinni controls DNS** for newxion.com. Andy asks them to add the mail service's SPF and DKIM records before Story 2.3 (Sun 05/10). | 2.3 |
| D3 | For demo, project and capture requests **the inbox is the record**: the site stores no copy. If sending fails, the form shows a retryable error and keeps every value. (CVs still go to the private Blob store, T1.) | 2.3, 2.2, 2.4 |
