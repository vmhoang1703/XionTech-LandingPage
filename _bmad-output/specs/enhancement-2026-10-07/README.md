# Prototype enhancements: catch-up plan, 2026-10-07

For Sammy (Son Nguyen) and Andy (Hoang Vu). Written by Sammy with Claude Code on 2026-10-07 and
revised on 2026-10-08 after a four-lens `bmad-review` of the plan against the log and the prototype.

The prototype in `_bmad-output/prototype-enhancement/prototype/` moved a long way while we built the
stories. Amber logged ENH-001 to ENH-090 (there is no ENH-068), all merged into `develop` by PR #48,
#63, #65 and #67. This plan compares the prototype as it is now with what `develop` renders and splits
the catch-up into 12 tasks, one spec each, ready for `/bmad-build`.

## Who does what

Sammy owns Home (except the news row and the contact form), Services, About, the footer and now the
404 page (his Story 1.7 before Plan C, decision P1). Andy owns the `globals.css` `@theme` tokens,
fonts, the header, the forms and their API, Products, News, Careers and everything that reads Sanity.

**Tier 1** goes into the demo on 2026-10-09. **Tier 2** is after the demo; each spec lists it under
"Non-goals for this build". Sizes are Tier 1 hours for one developer with `bmad-build`.

| Order | Task | Owner | Spec | Size | Hard dependencies (soft: fallback until merged) |
| --- | --- | --- | --- | --- | --- |
| 1 | E-A1 Type, spacing, fonts, site icon | Andy | [`spec-enh-a1-type-spacing-icon`](../andy/spec-enh-a1-type-spacing-icon/SPEC.md) | 2 h | none: **merge first** |
| 2 | E-A2 App rename | Andy | [`spec-enh-a2-app-rename`](../andy/spec-enh-a2-app-rename/SPEC.md) | 3 h | E-A1; Q1 |
| 3 | E-A3 Header | Andy | [`spec-enh-a3-header`](../andy/spec-enh-a3-header/SPEC.md) | 2 h | E-A1, E-A2 (same nav files) |
| 3 | E-A4 Home contact form, plain bands, Summit success | Andy | [`spec-enh-a4-forms-bands`](../andy/spec-enh-a4-forms-bands/SPEC.md) | 4 h | E-A1, E-A2 (contact schema); Q3 |
| 3 | E-A5 Products | Andy | [`spec-enh-a5-products`](../andy/spec-enh-a5-products/SPEC.md) | 6 h | E-A1, E-A2; soft E-A4 (navy band) |
| 3 | E-A6 News, Home news row, story page | Andy | [`spec-enh-a6-news-story`](../andy/spec-enh-a6-news-story/SPEC.md) | 4 h | E-A1, E-A2 (Sanity `post`); soft E-A4 |
| 3 | E-A7 Careers | Andy | [`spec-enh-a7-careers`](../andy/spec-enh-a7-careers/SPEC.md) | 4 h | E-A1; soft E-A4; Q6, Q14 |
| 3 | E-S1 Home | Sammy | [`spec-enh-s1-home`](../sammy/spec-enh-s1-home/SPEC.md) | 5 h | E-A1; soft E-A2 (names), E-A4 (`#contact`) |
| 3 | E-S4 Footer and offices | Sammy | [`spec-enh-s4-footer-offices`](../sammy/spec-enh-s4-footer-offices/SPEC.md) | 3 h | E-A1; Q7 |
| 3 | E-S5 404 trail page | Sammy | [`spec-enh-s5-not-found`](../sammy/spec-enh-s5-not-found/SPEC.md) | 1.5 h | E-A1 |
| 4 | E-S2 Services | Sammy | [`spec-enh-s2-services`](../sammy/spec-enh-s2-services/SPEC.md) | 4 h | E-A1, E-S1 (shared process copy, `services.ts`) |
| 4 | E-S3 About | Sammy | [`spec-enh-s3-about`](../sammy/spec-enh-s3-about/SPEC.md) | 4 h | E-A1, E-S1 (values), E-S4 (offices); soft E-A2, E-A4; Q5 |

**Load: Andy about 25 h of Tier 1, Sammy about 17.5 h, with about 1.5 working days left. That does
not fit for Andy.** The cut is decision Q14 below.

Tasks with the same order number run in parallel, one branch each: `feature/enh-<id>-<slug>`, for
example `feature/enh-s1-home`. A soft dependency means: build now, use the fallback the spec names, and
switch in a follow-up commit once the other task merges.

## Shared files

| File | Owner | Others | Rule |
| --- | --- | --- | --- |
| `src/app/globals.css` | each task | all | Add CSS in its own block, headed by a comment such as `/* E-S1 Home */`, next to the page's existing block. Only E-A1 edits `@theme`. |
| `src/content/apps.ts` (new) | E-A2 | E-S1, E-S3, E-S4, E-A5, E-A6 | Until E-A2 merges, write the names as plain strings, then switch to the `apps.ts` imports. |
| `nav-data.ts`, `site-nav.tsx`, `mobile-menu.tsx` | E-A3 | E-A1 (weights), E-A2 (names) | E-A3 starts after both merge. |
| `contact-rules.ts`, the contact schema, `contact-strings.ts` | E-A4 | E-A2 (product pills) | E-A2 merges first; E-A4 rebases. |
| `studio/schemas/post.ts`, `structure.ts` | E-A6 | E-A2 (`app` values), E-A7 (life photos) | E-A2 merges first; E-A6 changes `category` and the `app` field's `hidden` rule together. |
| `src/content/offices.ts` | E-S4 | footer, About, Demo, Home Capabilities, `services.ts` clocks | E-S4 updates the Demo tests it breaks. The shared order stays Plano first. |
| `process-flow.tsx`, `process.ts`, `services.ts` | E-S1 | E-S2 | E-S2 builds after E-S1. |
| `src/components/home/hero-silk.tsx` | E-S1 | E-A5 (shared Pause motion key) | E-A5 adds the stored setting; E-S1 keeps it when rebasing. |
| `e2e/a11y.spec.ts` | E-A3 | E-A5 | Whoever merges second rebases and keeps both changes. |
| `src/content/values.ts` (new, from `aboutValues`) | E-S1 | E-S3 | E-S1 repoints About's import; E-S3 removes the About section. |
| `CaptureBand` | E-A4 | E-S2, E-S3, E-A5, E-A6 | E-S2 stops using it on Services; E-S3, E-A5 and E-A6 keep it and pick a look. Only E-A4 edits the component. |
| `src/app/page.tsx` | E-S1 (order) | E-A4 (`<HomeContact />` last), E-A6 (`home-news.tsx` only) | Whoever merges second rebases and keeps both. |

## Rules that always hold

- Write "XionTech" in copy even where the prototype says "XionTechs" (`AGENTS.md`). "newXion" is a
  separate name; see Q12.
- Never ship any "Prototype: nothing was sent" text (Home has it without brackets). Check with
  `grep -r "Prototype: nothing was sent" src`.
- Everything not verified starts with `[Placeholder]`.
- Port the prototype; do not redesign.

## How to build each task

Branch from an up-to-date `develop`, run `/bmad-build` on the spec folder (each spec ends with the
request line to paste), write the UX checks table before coding (`docs/ux-checks.md`), run the full
`bmad-code-review` once, and open the PR with `/create-pr`. Walks intercept `POST /api/contact` so no
real mail is sent. Log what mattered in `docs/ai-log.md`.

After a task merges, set the ENH entries on its "Covers" line to **Built** in
`_bmad-output/prototype-enhancement/enhancement-log.md`. For an entry split across tasks, set it to
Built when the last part merges.

## Decisions

Each has a default so building does not wait. The owner confirms or changes it in the team chat; the
builder copies the answer into the spec's "Open questions".

| ID | Question | Default if no answer by Thu 08/10 09:00 | If the answer differs | Owner |
| --- | --- | --- | --- | --- |
| Q1 | Rename the apps site-wide (Parent Hub, Staff Hub, IoT, AI Tutor; LXP no longer shown)? The names come from team feedback (ENH-086, ENH-087). | Rename. | `apps.ts` still ships with the old names, so E-S1 and E-A5 keep importing it unchanged. | Andy (lead) |
| Q2 | The prototype's weights and spacing (300/400/500, 64px sections) override `DESIGN.md` (700/600, 112px)? | Prototype wins (Amber approved the entries); Amber updates `DESIGN.md` after the demo. | Drop E-A1 CAP-1 to CAP-4; the site icon still ships. | Amber |
| Q3 | Home contact form: where does it send? | `/api/contact` gets a third type `general`, delivered like the others (decision D1). | The Home form posts type `project` with the phone in the message, or links to `/demo`. | Andy |
| Q4 | News newsletter sign-up needs a new API and somewhere to store subscriber emails. Before the demo? | After the demo. News keeps the demo band in the plain look. | E-A4 Tier 2 becomes Tier 1. | Andy |
| Q5 | The About mountain pictures (`mountain-clear.webp`, `mountain-glow.webp`) came from Amber's source file. Licence and origin? | Ship them only if Amber confirms they are ours. Otherwise the two chapters ship without the picture. | — | Amber |
| Q6 | Careers: the Growth Learning Model, the "Celebration" tile and the five flip-card values (different from the six core values) have no verified source. | Ship them marked `[Placeholder]`. | — | Amber |
| Q7 | New contact facts: `vinni.tran@xiontechs.com` for Vietnam, the "US Delivery Center" and "Vietnam Delivery Center" tags, phones written "(+1) 469 322 9899". | Tags and format ship; the Vietnam email ships only once the business confirms it. The US email `vinni.tran@newxion.com` is already confirmed. | — | Andy (asks the business) |
| Q8 | With Book a demo gone from the header and Contact gone from the footer, `/demo` is reached only from email bands and Services' "Start a project". Intended? | Yes. Home's Get in touch and About's "Ask us directly" go to the Home contact form (`/#contact`). | Keep a Book a demo link in E-A3 or a Contact link in E-S4. | Amber |
| Q9 | The data-security FAQ answer: the prototype drops `[Placeholder]`. | Keep `[Placeholder]` until the business confirms the answer. | — | Amber |
| Q10 | EN/VI language switch in the header. | After the demo (Story 1.2). | — | Andy |
| Q11 | Publish the live AI Tutor demo address (`xt-ai-tutor-demo.azurewebsites.net`) on Products? | Stand-in: a disabled "View prototype" label (decision A6). | Use the real address with the new-tab rules of decision A6. | Andy |
| Q12 | "newXion" in copy (the News sample note, the About founding chapter). Keep it as the prototype has it? And is "a group of pioneers established newXion in America" confirmed? | Keep "newXion" as written. The founding sentence ships marked `[Placeholder]` until confirmed. | Replace "newXion" in both places. | Amber, Andy |
| Q13 | ENH-051 removes the consent line from email bands. Decision A4 (privacy) needs it. | Keep the consent line. | Remove it in E-A4 CAP-4 after the privacy check. | Amber, Andy |
| Q14 | Tier 1 cut for Andy's load. | (1) E-A7 Careers moves to Tier 2; (2) E-A5 ships the hero, cards and detail view, while A day at school and Product updates move to Tier 2; (3) if Sammy finishes early, he takes E-A3 Header after E-A1 and E-A2 merge. | — | Andy (lead) |
| Q15 | Careers: after the photo frames go, keep or remove the Sanity life-photo code? | Keep it and list it in `deferred-work.md`. | Remove the code and the schema in E-A7. | Andy |

## What changed, in one line per page

| Page | Prototype now | Task |
| --- | --- | --- |
| Every page | Headings at 300, card titles 400, buttons 500; 64px sections; X-mark site icon | E-A1 |
| App names | Parent Hub (P-Hub), Staff Hub (S-Hub), IoT (IoT Device Management on Products), AI Tutor | E-A2 |
| Header | Plain links Home, Products, Services, News, About, Careers; no Book a demo; underline hover; hamburger icon | E-A3 |
| Footer | Navy ridge; climber one step up per page (Tier 2); audience links; offices with icons, Vietnam first | E-S4 |
| Home | "School apps and software teams that get IT done." hero with two cards across its edge; Capabilities; Core values; How we approach (4-D); case studies (Tier 2); news; contact form | E-S1, E-A6, E-A4 |
| Services | Navy hero panel and light blue services panel; sticky heading beside two-column cards; "What can we help you achieve?"; light 4-D process; no email band | E-S2 |
| About | "We're XionTech, technology built with ownership." intro; mountain story; two-column FAQ; white offices; white email band | E-S3 |
| Products | "Built apart. Better together." diagram; four showcase cards with a detail view; A day at school; Product updates; navy band | E-A5 |
| News and story | "Catch up with us"; audience filters; full-photo cards with a lead story; story page with summary and photo | E-A6 |
| Careers | "Stay curious. Build what's next." with the Growth Learning Model; Inside XionTech tiles; five flip cards; roles last | E-A7 |
| 404 | "You've wandered off the trail." with a trail map | E-S5 |
| Forms | A flag on a small summit: "Summit reached." | E-A4 |
| Privacy, job page | Unchanged (job page: no sideways scroll at 320px) | E-A7 check |

Full gap rows, with file paths, are in each task's spec.

## Entries with no task

| Entries | Why |
| --- | --- |
| ENH-075, ENH-076, ENH-078 to ENH-084, withdrawn parts of ENH-077 | Withdrawn. |
| ENH-005, ENH-008, ENH-013, ENH-021 | "What we build" on Home, removed by ENH-087. |
| ENH-011, ENH-012 | Five-step "How we work", replaced by the 4-D process in ENH-087 and ENH-088. |
| ENH-017, ENH-020, ENH-027 to ENH-029, ENH-062; the Products tab parts of ENH-049 to ENH-052 | Products tabs and stacked cards, replaced by the showcase cards in ENH-089. |
| ENH-019; the background part of ENH-016 | FAQ background, replaced by plain white in ENH-059. |
| ENH-033 | Services background, replaced by ENH-048, ENH-065 and ENH-069. |
| ENH-041; the reel part of ENH-054 | Careers event reel, replaced by Inside XionTech tiles in ENH-055. |
| ENH-045 (News bento part) | Replaced by the lead story layout in ENH-053. |
| ENH-074, ENH-090 | The prototype's design-system page and clean-up; no site code. |
| ENH-068 | Not in the log. |
| ENH-091 | Presenter device toggle (PR #69), prototype only. |
