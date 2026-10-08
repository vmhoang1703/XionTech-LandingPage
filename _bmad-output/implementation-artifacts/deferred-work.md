# Deferred work

## Deferred from: code review (2026-09-28)

Change reviewed: team CLAUDE.md rules, test tooling, local-only SonarQube gate (branch `feature/setup-project`).

### Agent-context files (fix edits CLAUDE.md / AGENTS.md / SKILL.md — needs owner OK)

**Resolved 2026-09-28** (lead asked "fix the 5 docs items"; reviewed with bmad-code-review, 11 follow-up fixes applied):

- [x] RESOLVED [medium] CLAUDE.md "SonarQube — LOCAL ONLY" one-time setup omits `cp scripts/sonar/sonar.env.example scripts/sonar/sonar.env`; the gate dies with "Missing sonar.env" on a fresh clone that follows CLAUDE.md (README has the step).
- [x] RESOLVED [low] CLAUDE.md "Language / toolchain" omits Docker Desktop, Python 3.10+, uv and curl, which `coverage:diff` and the Sonar gate need.
- [x] RESOLVED [low] CLAUDE.md says the gate "refuses" when `SONAR_HOST_URL`/`SONAR_TOKEN` are set; the code silently unsets them. Only `SONAR_LOCAL_HOST_URL` and `sonar.host.url` are refused.
- [x] RESOLVED [low] AGENTS.md says the pre-push hook runs `npm run sonar:gate`; it execs `scripts/sonar/check_quality_gate.sh` directly.
- [x] RESOLVED [low] sonar-prepush-gate SKILL.md examples use `dev`/`main` and a Python probe; this repo uses `develop` and TypeScript (the real probe used `value === value` in a `.ts` file).

### Filed as defer by the verification-gap layer
- [medium] Unit tests, smoke and diff coverage do not block a push or merge: the gate only warns on test failures, and there is no CI.
- [low] The baseline "create missing source/test folders" fix has no automated test.
- [low] `test_local_only_guards.sh` runs only by hand (no hook or CI). Same decision as the CI item above.

### Pre-existing in the upstream sonar-prepush-gate skill (not caused by this change)
- [medium] Gate scans HEAD + working tree, not the pushed commits (`git push origin other-branch`, dirty tree, delete-only pushes).
- [medium] Baseline API writes (`projects/delete`, `projects/create`, `new_code_periods/set`) use `curl -s` without status checks; a failed period set still writes `sonar.baseline` and may judge zero lines.
- [medium] A test command that crashes before writing coverage leaves an older report that passes the existence check (stale coverage scanned).
- [medium] Container port is published on all interfaces (`-p 9000:9000`); bind to `127.0.0.1`.
- [medium] `sonar.env` saved with CRLF (Windows editors) leaves `\r` in values; reference branch lookup fails.
- [low] `local_sonar.sh` run by hand ignores `sonar.env` overrides (port, image, container).
- [low] `wait_for_analysis` writes diagnostics to stdout, which is captured into ANALYSIS_ID and lost.
- [low] `sonar_property` + `pipefail` exits silently for Python projects without `sonar.sources`.
- [low] Docker images unpinned (`sonar-scanner-cli:latest`, `sonarqube:community`).
- [low] Scripts call `python`, not `python3`; fails on Linux/macOS machines without `python`.
- [low] `project_status` error JSON raises a Python KeyError with no readable cause.
- [low] Coverage path rewrite stops at spaces in the repo path.
- [low] Container states paused/restarting/dead fall through to `docker run` and a name conflict.
- [low] Empty `serverUrl` in report-task.txt gives a misleading "published to ''" tripwire message.

## Deferred from: code review (2026-09-28), UX first draft

Change reviewed: UX prototype and README (branch `docs/ux-first-draft`). The 14 findings became 16 acceptance criteria for the Next.js build; they are in `_bmad-output/planning-artifacts/ux-designs/ux-XionTech-LandingPage-2026-09-26/code-review-2026-09-28.md`.

- [medium] No automated tests for the prototype script (forms, EN/VI, news filters, navigation). Test these behaviours in the Next.js build.
- [medium] Translation beyond visible text: page titles, meta descriptions, aria labels and toasts need VI versions; serve `/en/` and `/vi/` URLs with hreflang.
- [low] Per-page metadata (favicon, canonical, Open Graph) is missing in the prototype; use the Next.js Metadata API.
- [low] "Read story" has no detail page and the news filters have no empty state; depends on the CMS choice.
- [low] Stats band and 4-D flow are copied across prototype pages; build each as one component.

## Deferred from: code review (2026-09-28), UX round 3

Change reviewed: approved prototype changes, final UX specs, PRD and epics (branch `docs/ux-first-draft`).

- [low] Prototype `site.css` has stacked patch layers (v3.1 to v3.7) that redefine the same rules. Consolidate when the prototype is next touched; the specs, not the CSS, are the build reference.
- [medium] FAQ "How do you keep our data secure?" reuses the current site answer, which does not name hosting, access control or certifications. Replace with real facts before launch.
- [medium] Story 6.3: decide whether a story or role can be published with only one language filled, or must wait for both EN and VI.

## Deferred from: code review (2026-09-29), Demo-day scope change

Change reviewed: prototype v3.8 (job page, roles list, removals) and the PRD, UX spec and epics updates (branch `docs/ux-first-draft`). Fixed before commit: build order in the Demo-day plan, breadcrumbs note, stale Flow 4 route and capture exceptions in `EXPERIENCE.md`, privacy text, CV field description and empty-file check, success focus.

- [low] Message and cover note limits say "under 2,000 characters" while the check allows exactly 2,000 (same in the contact form); align the wording or the check in the Next.js build.
- [low] "(opens in a new tab)" accessible names on store and app links are English only; add VI with Story 1.2.
- [low] Epic 1 title and Story 7.3 still say "bilingual" and "both locales"; Vietnamese is after Demo day.
- [low] `.people` and `.person` CSS in the prototype is unused since the leadership section was removed.

## Deferred from: code review (2026-10-01), create-pr skill moved to GitHub

Change reviewed: `create-pr` skill ported from `az` to `gh`, the "open every PR with /create-pr" rule and the narrowed no-hand-edit rule in `AGENTS.md` (branch `fix/create-pr-github`).

- [low] There is no `.github/pull_request_template.md`, so PRs opened in the GitHub web UI get no template; the template checklist also does not list the pre-PR gates from `AGENTS.md` (lint, coverage, smoke, build, Sonar, code review, AI log). Decide whether to move the template to `.github/` and extend the checklist.
- [low] `storyKey` is read only from branches named `<type>/<epic>-<story>-<slug>`, but `AGENTS.md` still says `feature/<short-name>`. Write the story branch format into `AGENTS.md` → Git workflow.
- [low] `AGENTS.md` describes `.claude/skills/` as the 57 BMad skills only; the team-owned skills (`create-pr`, `sonar-prepush-gate`, `maestro-flows`, `code-review-and-quality`, …) and their owners are not listed. `maestro-flows` was copied from the same PXP workspace and still targets `pxp_mobile`.
- [x] RESOLVED [low] `test_pr_scripts.sh` runs only by hand — `npm run test:skills` now runs it (still by hand: there is no CI).
- [low] `.claude/skills/sonar-prepush-gate/template/scripts/sonar/test_local_only_guards.sh` runs only by hand: no npm script and no CI.

## Deferred from: code review (2026-10-01), faster checks until Demo day

Change reviewed: `eslint-plugin-sonarjs` in lint, `sonar:gate:full`, and the until-Demo-day rules in `CLAUDE.md`, `AGENTS.md` and `README.md` (branch `fix/create-pr-github`).

- [medium] The planning docs still require the local Sonar gate before every PR: NFR-8 in `_bmad-output/planning-artifacts/epics.md`, `prd.md`, and the Definition of Done line in every `_bmad-output/specs/*/SPEC.md`. Amber Do owns these files; tell her about the daily-gate rule so story reviews do not flag "no Sonar gate" as a DoD failure.
- [low] No test proves that `sonar:gate:full` really uses `main` as the reference branch (a caller's `SONAR_LOCAL_REFERENCE_BRANCH` must win over `sonar.env`). The case belongs in the `sonar-prepush-gate` template's `test_local_only_guards.sh` (no hand edits under `scripts/sonar/`).
- [medium] After Demo day (2026-10-09), undo the temporary rules: every clone runs `git config core.hooksPath scripts/git-hooks`; remove the "until Demo day" text from `CLAUDE.md`, `AGENTS.md`, `README.md` and `.claude/skills/create-pr/SKILL.md`; delete `scripts/git-hooks-demo/` and decide whether `sonar:gate:full` stays. Keep `eslint-plugin-sonarjs` in lint (it is not temporary).

## Deferred from: code review (2026-10-01), UX quality loop tooling

Change reviewed: `ux:parity` / `ux:shots`, the `ux-critic` skill and `docs/ux-quality.md` (branch `feature/ux-quality-loop`).

- [low] `scripts/ux/browser.mjs`, `parity.mjs` and `shots.mjs` have no automated test of their own (only `lib.mjs` does). A small local HTML fixture driven by Playwright would catch a flipped probe step, and a fixture with a hidden trigger would prove that a probe step that throws becomes a counted `error: …` row (today only `probeError` and the report side are unit-tested); the real check is running `ux:parity` against the prototype.
- [low] No probe yet for the EN/VI switch (Story 1.2) or the mobile Menu button (Story 1.4); add them to `scripts/ux/surfaces/header.json` with those stories.
- [low] `parity.mjs` and `shots.mjs` have no top-level `catch`: a failure such as "Cannot open … start npm run dev" prints a clear message, but Node adds its stack trace under it.
- [low] A probe `error: …` row shows Playwright's first line (e.g. `locator.hover: Timeout 5000ms exceeded.`) but not which selector failed — trigger, hover area or panel. Add the probe key to the message, as `runActions` does for state actions.
- [low] `widths: []` and repeated widths pass `validateSurface`. With `[]` the report lists every element as never found and every state and probe as never ran (their entries are left out, since that cause is listed); a repeated width runs twice and counts each difference twice.
- [low] An intended `width` written as a string gives a confusing "1280 is not a parity width (1280, …)"; check `Number.isInteger` first.
- [low] An element `prop` typo (e.g. `colour`) is caught only after the run, as an entry that matched nothing; `validateSurface` only checks for a non-empty string, though its message names examples ("x", "color", "missing"). It could check the box keys, `missing` and `STYLE_PROPS`.
- [low] Very long names can pass the 255-character file-name limit; the plain-name rule has no length cap.
- [low] `con`, `nul`, `aux`, `prn`, `com1`… are Windows device names on Windows 10; the plain-name rule allows them.
- [low] `prototype` and `route` go into the report head unescaped (a line break or backtick breaks it).
- [low] Two surface files with the same `name` share `ux-reports/<name>/` and overwrite each other's reports; the scripts could check `basename(options.surface, ".json") === surface.name`.
- [low] The default `ux-reports/<name>/parity` folder keeps images from older runs (e.g. the old `-`-joined names); a run could clear its own default folder first.
- [low] Default widths and the reserved state names are written in more than one file (`lib.mjs`, `parity.mjs`, `shots.mjs`).
- [low] `shots.mjs` names files `<state>-<width>.png`, safe only because the width comes last and is all digits; `parityImageName` uses `.`.
- [low] The built-in `default` state is not checked for "ran but compared no element", and a state with `elements: []` is always listed as "compared no element". A shots-only state (e.g. an app-only error state for the critic) needs a way to skip parity, such as `parity: false`.
- [low] A state whose listed elements are all never found is counted twice: under "Never found" and as "compared no element".
- [low] An entry whose `state` does not compare its element (not in that state's `elements`) is caught only after the run, as "matched nothing"; `validateSurface` could check it.
- [low] The diff-coverage gate measures `src/` only (`coverage.include` in `vitest.config.mts`), so `scripts/ux/lib.mjs` is outside it. Measured by hand on 2026-10-02 with `npx vitest run scripts/ux/lib.test.mjs --coverage --coverage.include=scripts/ux/lib.mjs`: 100% lines, 98% branches. After Demo day add `scripts/ux/lib.mjs` and `scripts/coverage-branches.mjs` (not all of `scripts/`: `browser.mjs`, `parity.mjs` and `shots.mjs` have no unit tests).
- [low] The "cause listed already" rule uses the whole run, not the entry's `state`/`width`: an entry narrowed to a width where its element is missing on one side is listed as "matched nothing" next to the `missing` row; and a property entry for an element only ever found on one side, whose `missing` row an entry explains, is never listed.
- [low] A pending probe entry whose probe could not run shows in the pending list without "not seen in this run", though nothing was measured (its row says "not applied").
- [low] "Pending design decisions: N" counts entries, not decisions (the header's 16 entries cover about 6 decisions), and "(rows marked "pending")" does not fit entries marked "not seen in this run"; the console line says the same.
- [low] No test pins the pending list's file order.
- [low] `ux:shots` has the same gap the parity report now closes: a state whose `minWidth` is above every `shotWidths` value gets no screenshot and no axe scan, and `--strict` still passes (Similar check).
- [low] The report head and the console say "unexplained difference(s)", but the count also includes "Never found" and "Never ran or never used" lines, and the head line's advice ("listed in `intended`") does not fit those; the Tools table in `docs/ux-quality.md` says the same.
- [medium] After Demo day, before the UX tools become a rule again: make `ux:parity --strict` stable. On 2026-10-02 runs failed by chance on the same code: the dev server compiling a page on first visit, a public CDN stall while loading the prototype's fonts and icons, and probably probes acting before React hydrates. Tried and set aside (the lead made the tools optional): a production build (`next start`), waiting for `load` + fonts + an idle main thread instead of `networkidle` (a production build prefetches nav links to missing pages, so the network never goes idle), one load retry, and keeping the failing report. On the dev server a header parity run takes 2–5 minutes and shots about 2 minutes (58–87s for shots on the production build). The load retry and the kept failing report were tried in uncommitted work and dropped; a failing `report.md` is still overwritten by the next run, which makes the flake hard to trace.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-2-contact-form.md`
  summary: Check with a real screen reader (NVDA/VoiceOver) that the contact form's tabpanels, styled `display: contents`, are still announced as tab panels.
  evidence: maybe-false (medium if true); older Chrome/Safari dropped `display: contents` elements from the accessibility tree. Settle with one screen-reader pass on /demo.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-2-contact-form.md`
  summary: Story 2.3 server validation should cap name/org/email length and check the date format (YYYY-MM-DD) before comparing with today.
  evidence: the shared rules cap only the message and compare dates as strings; the client date input limits the format, a server cannot rely on that.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-2-contact-form.md`
  summary: The consent link to `/privacy` returns 404 until Story 2.1 builds the privacy page.
  evidence: `next build` routes list only `/`, `/_not-found`, `/demo`; CAP-8 requires the link now.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-8-sanity-setup.md`
  summary: `/api/revalidate` accepts replayed signed deliveries; add a timestamp age check that still allows Sanity's retries.
  evidence: `@sanity/webhook` only checks the timestamp is after 2021 (`node_modules/@sanity/webhook/dist/index.mjs`); the route adds no window. Impact: cache churn for someone holding one delivery.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-8-sanity-setup.md`
  summary: `scripts/sanity-check.mjs` `main()` has no test (probe perspective, no token, exit code).
  evidence: `scripts/sanity-check.test.mjs` imports only `summarize`.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-8-sanity-setup.md`
  summary: `studio/` has no lint or typecheck; the root tools exclude it.
  evidence: `tsconfig.json` excludes `studio`, `eslint.config.mjs` ignores `studio/**`, and `studio/` has no tsconfig.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-8-sanity-setup.md`
  summary: `src/lib/sanity/next-config.test.ts` asserts the loaded config equals `{}`; change it to a non-throw check before adding a real option to `next.config.ts`.
  evidence: patch re-review minor, 2026-10-02.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-3-submission-delivery.md`
  summary: Validate the contact delivery variables at server start (log-only `instrumentation.ts` register), as the CLAUDE.md guardrail asks; today they are checked per request.
  evidence: `getDeliveryConfig` runs per request (`delivery.ts`); a build-time check would force secrets on every teammate, a start-time log would not.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-3-submission-delivery.md`
  summary: The form shows "Thank you!" for any 2xx; check the body is `{ ok: true }`.
  evidence: `postSubmission` returns sent on `response.ok` (`contact-form.tsx`); only a proxy or portal answering 200 would trigger it.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-3-submission-delivery.md`
  summary: Check whether browser autofill or password managers fill the `website` honeypot, and count honeypot hits (no personal data).
  evidence: maybe-false, medium if true: a filled honeypot gets 200 and no mail, silently; settle with Chrome, Edge and one password manager on /demo.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-3-submission-delivery.md`
  summary: Avoid a duplicate mail when the response is lost after Gmail accepted it (per-submit id checked in Upstash).
  evidence: the client shows the send error and the visitor retries; nothing de-duplicates.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-3-submission-delivery.md`
  summary: Keep the worst-case route time under `maxDuration` (3 s store + 5 s per SMTP phase + DNS), e.g. one overall deadline.
  evidence: a platform stop gives no 502 log line; the visitor still sees the send error with values kept.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-3-submission-delivery.md`
  summary: Screen-reader pass (NVDA/VoiceOver) of the contact form: nothing announced while sending; the failure alert may be cut by the focus move.
  evidence: maybe-false; jsdom cannot announce; settle with one pass on /demo.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-3-submission-delivery.md`
  summary: Mark non-production mails (e.g. a VERCEL_ENV subject prefix), since every environment sends to the same inbox.
  evidence: lead's 2026-10-03 inbox decision; test and real leads look the same.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-3-submission-delivery.md`
  summary: Add `import "server-only"` to `src/lib/contact/delivery.ts` and move `ContactSubmission` out of the client component.
  evidence: `delivery.ts` reads secrets; only the route imports it today; tests would need the server-only mock used in Story 1.8.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-5-site-footer.md`
  summary: Wrap the footer link columns (Products, Services, Company) in a `<nav aria-label="Footer">` landmark.
  evidence: Blind Hunter review 2026-10-01; the prototype has no landmark and FR-7 does not ask for one, so it is an a11y improvement beyond this story.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-4-email-capture.md`
  summary: One exported email helper (trim + `isValidEmail` + 254) used by `contact-rules.ts`, `submission.ts` and `capture-band.tsx`.
  evidence: The rule is copied in three places today.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-4-email-capture.md`
  summary: Expire or clear the capture email in session storage when `/demo` is never reached.
  evidence: Only `/demo` removes the key.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-4-email-capture.md`
  summary: A Playwright browser test: Home band → client push → `/demo` tab and prefill.
  evidence: Only the manual walk covers the full hand-off; unit tests mock the router.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-4-email-capture.md`
  summary: Check Back after a successful capture does not leave the band on Sending...
  evidence: maybe-false; settle in a browser.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-4-email-capture.md`
  summary: Stop hover styles on disabled `.btn` (`:not(:disabled)` on hover rules).
  evidence: Hover glow still shows on a disabled button.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-4-email-capture.md`
  summary: Move the misplaced focus comment in capture-band.tsx and assert `.capture { overflow: hidden }` (the ring relies on it).
  evidence: patch re-review minors, 2026-10-03.

- source_spec: `_bmad-output/implementation-artifacts/spec-3-1-dark-home-hero.md`
  summary: Add an automated browser check for the Home hero CSS (glow layer painted, 2 columns at 900px / 1 at 899px, no sideways scroll at 390px); today only the walk script checks it.
  evidence: jsdom tests check class names only and the smoke project is request-only; a deleted `.silk-fallback` rule would pass every test. The team has to choose which Playwright project runs it.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-7-not-found-page.md`
  summary: Tighten the 404 smoke test (page marker and noindex end to end, band absence by marker, not by one string) and check `min-h-[70dvh]` at 320px.
  evidence: full review 2026-10-03, Minor findings 4 and 5.
- source_spec: `_bmad-output/implementation-artifacts/spec-2-1-privacy-policy-page.md`
  summary: Privacy page follow-ups for the legal owner (7.5): name Vietnam's Personal Data Protection Law 2025 next to Decree 13/2023; add a `[Placeholder]` "Last updated" line and outline rows for legal basis, security and children's data; re-check "private CV storage" if 6.6 drops CV upload; confirm the exact CAP-6 retention wording with Amber.
  evidence: full review 2026-10-03, Blind Hunter and Acceptance Auditor (Minor).
- source_spec: `_bmad-output/implementation-artifacts/spec-2-1-privacy-policy-page.md`
  summary: Find the capture band by one marker in every test (unit, smoke, walk) instead of `<form`; use section id plus index as the paragraph key on `/privacy`.
  evidence: full review 2026-10-03, Blind Hunter and Edge Case Hunter (Minor).


- source_spec: `_bmad-output/implementation-artifacts/spec-3-6-4d-process-flow.md`
  summary: On `/services#process` (Story 5.4), check that the flow opened by the hash link is not dimmed and replayed (the browser's hash scroll may come after the reveal's first measurement).
  evidence: maybe-false; on Home `/#process-title` goes static > on in the walk, but the Services page layout and timing differ. Settle with the 3.6 walk's hash scenario on `/services#process`.
- source_spec: `_bmad-output/implementation-artifacts/spec-4-1-products-hero-subnav.md`
  summary: Add a browser Playwright project that asserts the Products anchor offset (section top 144px after a pill, a direct `/products#lxp` and a cross-page link); recheck `#iot` and the `.products-anchor` padding (80px at every width) when Stories 4.2/4.3 replace the stubs; recheck sub-nav sideways scroll when Story 4.5 adds the Updates pill.
  evidence: full review 2026-10-05, Verification Gap, Blind Hunter and Acceptance Auditor (Minor); the 216px regression was caught only by the hand-run walk.
- source_spec: `_bmad-output/implementation-artifacts/spec-4-2-pxp-story-phone.md`
  summary: PXP story phone follow-ups: the active screen (empty frame, `tabIndex=0`) is a tab stop before the tablist; arrow keys step from the selected tab, not from a focused unselected one; the crossfade story must swap `hidden` for `inert` plus an opacity fade; confirm PXP's platforms (iOS and Android, still `[Placeholder]` on `/products`; the feature lines were confirmed on 2026-09-28, decision A7, superseding the 4.2 marking); when real store URLs land, recheck mobile Tab order (phone tabs come before the store links in the markup below md); apply `PLACEHOLDER_HREF` to the Story 4.3 URL pills.
  evidence: full review 2026-10-03, Blind Hunter, Edge Case Hunter and Acceptance Auditor (Minor).
- source_spec: `_bmad-output/implementation-artifacts/spec-4-3-lxp-sxp-iot-sections.md`
  summary: Products follow-ups: only `#` exactly counts as a stand-in address; a real href can ship with a `[Placeholder]` label (derive the label or test the pair); layout (columns, SXP order, ellipsis) is checked only by the hand-run walk; linen, grid, card tints and frame details are class tests plus screenshots; ask Amber about the amber SXP badge.
  evidence: full review 2026-10-03, Blind Hunter, Edge Case Hunter, Verification Gap and Acceptance Auditor (Minor).
- source_spec: `_bmad-output/implementation-artifacts/spec-4-3-lxp-sxp-iot-sections.md`
  summary: Products layout follow-ups (decision L1): below 900px the media comes before the text in the markup, so once a real address makes the URL pill or store button a link, mobile Tab and reading order will not match the screen; `.pxp-phone` and `.split-media-first > .browser` hold the same `order` rule twice (one shared class would stop drift); `FeatureList` type safety relies on the content objects staying `as const`.
  evidence: second full review 2026-10-03, Blind Hunter, Edge Case Hunter and Verification Gap (Minor).
- source_spec: `_bmad-output/implementation-artifacts/spec-6-5-careers-open-roles.md`
  summary: Careers follow-ups: the culture photo frame has no story that adds a real photo; `.news-grid` is shared with Story 6.1 (keep one rule); breadcrumbs lack `aria-current` and a hidden separator (Story 1.6); the shared `.split` / `.svc-grid` breakpoints are 1px off the "or less" wording in UX rows.
  evidence: full review 2026-10-04, all five layers (Minor).
- source_spec: `_bmad-output/implementation-artifacts/spec-6-5-careers-open-roles.md`
  summary: Role-card checks not done on 2026-10-04: pen input, and a meta line with all three parts (team · location · work type, wrapping at 390px) — the sample role has only a team. Studio lists show "Untitled" for a document with only a Vietnamese title (`preview` reads `title.en`). Release risk: live role cards link to `/careers/<slug>`, which is the Not found page until Story 6.6 merges — ship 6.6 before the release PR, or unpublish the sample role. Studio lists could mark closed or slugless roles, and format the post date.
  evidence: role-card walk on the dev site and the Studio follow-up review, 2026-10-04 (Minor).
- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-mobile-menu.md`
  summary: Mobile menu has no browser test: no `e2e/*.spec.ts` for the scroll lock, the 375px layout and the 640px/1080px switches, and no Menu-button probe in `scripts/ux/surfaces/header.json` (the 1.3 UX parity surface); no real touch swipe test of the scroll lock. Also: focus falls to the page when the window grows above 1080px with focus in the panel; a hash-only back/forward keeps the menu open; no `inert` on the page while open; the panel z-index token works only inside the header. Release risk: the mobile panel's Services, News and About links open the Not found page until those pages ship.
  evidence: one-layer review (Blind Hunter) 2026-10-04; jsdom cannot check layout and Turbopack rejects the build worktree, so neither could run there (Minor).
- source_spec: `_bmad-output/implementation-artifacts/spec-1-4-mobile-menu.md`
  summary: Mobile menu focus follow-ups: the `#form` card shows a focus ring after a keyboard jump; give `#form` a static `tabIndex={-1}` (as `#main`) instead of setting it from script; a modifier click on the panel `/demo#form` while on `/demo` moves focus without scrolling; the header-bar Book a demo (641px and up) leaves focus in the header; middle click (`auxclick`) leaves the menu open; untested branches (existing `tabindex`, missing `#part` target, SVG `<a>`); decode the hash before the id lookup. The CAP-8 lock test clicks a header link (not a panel link) and cancels navigation on the element, so a future guard placed after the panel check, or one that reads `defaultPrevented`, would pass it; move the cancel to `window` and loop over a panel link too.
  evidence: fourth full review 2026-10-04, all layers (Minor).
- source_spec: `_bmad-output/implementation-artifacts/spec-3-7-home-news-demo-capture.md`
  summary: Story 6.1 may need `newsDate` and `categoryTag` moved out of `src/lib/news/latest-posts.ts` (which imports the server-only Sanity client) if a client component imports `NewsCard`.
  evidence: maybe-false, medium if true (Edge Case Hunter, 2026-10-04). Settled when 6.1 decides whether the cards render on the server (its spec says the chip filter is the only client part) or inside the client filter.
- source_spec: `_bmad-output/implementation-artifacts/spec-3-7-home-news-demo-capture.md`
  summary: Similar check: `src/components/careers/open-roles.tsx:26` builds `/careers/${role.slug}` without `encodeURIComponent`, the idiom Story 3.7 fixed for news links; apply the same encoding there (and in 6.6 links) or record why job slugs cannot hold "/", "?" or "#".
  evidence: 3.7 review patch 312fe79 encodes the news slug; the job slug is required but hand-editable in the Studio (2026-10-04).
- source_spec: `_bmad-output/implementation-artifacts/spec-3-7-home-news-demo-capture.md`
  summary: Home news follow-ups: use the `--text-*` tokens for the card tag, meta and excerpt sizes; clamp the excerpt to one line (DESIGN.md); type the categories and their labels from one list; query `.frame` directly in the card test; add a static-HTML test of real cards; scope the `.sec-head ~ .link-arrow` hover to the news section; mark after-demo items in `epic-3-context.md`; strip ANSI codes from the verification files; replace pre-rebase commit hashes in the spec.
  evidence: full review 2026-10-04, all layers (Minor).
- source_spec: `_bmad-output/implementation-artifacts/spec-3-7-home-news-demo-capture.md`
  summary: After a Sanity outage at build or refresh time, Home caches an empty news section until a post is re-published or the site redeploys (a short time-based `revalidate` on Home would heal it; lead's call, Home is Sammy's page). `/careers` (6.5) still lets a Sanity error fail the page and the build (same guard as Home could apply). A card with an unreadable date renders an empty `<time>`; the failure test restores its console spy only when it passes; `docs/sanity.md` step 3 still says one post; Story 6.1 must use the same slug/title/date filter as Home.
  evidence: second full review of the 3.7 fixes 2026-10-04 (Important points answered in docs; code follow-ups for the lead).
- source_spec: `_bmad-output/implementation-artifacts/spec-3-7-home-news-demo-capture.md`
  summary: After A11 (no CDN): the 1.8, 6.1, 6.2 and 6.5 specs, `cms-spike.md` and the epic contexts still say `useCdn: true` (A11 records the override; Amber owns epics.md); measure the card "no lift" at one scroll position and walk all three tags with their colours; walk Home on the dev site once after this merge (no sample note, 3 cards); the 3.7 SPEC (Amber's) still describes the sample note (A9 records the override).
  evidence: review of the real-posts/no-CDN PR 2026-10-04 (Important points fixed in docs; these are Minor).
- source_spec: `_bmad-output/implementation-artifacts/spec-3-7-home-news-demo-capture.md`
  summary: Second review of the real-posts/no-CDN PR: the "time-based `revalidate`" idea in the outage entry above is now ruled out by A11; the offices post slug and id still say "one team" (fix before 6.2 makes `/news/[slug]` live; list the three corrected phrases in `published-posts.md`); the 3.7 build spec's Approach, I/O row, tasks and verification lines and A9's "sample post" still mention the sample note; `home-news-dev-1280.png` shows the texts before the fix; A10 lives on the 6.6 branch, so keep A10 before A11 when it merges; Story 6.2 `/news/[slug]` should limit unknown slugs (`generateStaticParams`, `dynamicParams`) so bots cannot use up the 250k API quota; no test pins the `sanity:check` client config; `rawClient` repeats `useCdn: false`; the post wording could follow the source more literally.
  evidence: second full review 2026-10-04, all layers (Important points fixed: A11 cost and Replaces list, `docs/sanity.md` step 3, the `sanity:check` message; these are Minor).
- source_spec: `_bmad-output/implementation-artifacts/spec-6-6-job-page-cv-upload.md`
  summary: A cleanup job for CVs after Demo day, for uploads that never reach the apply route (a script or an abandoned form).
  evidence: Story 6.6 review 2026-10-04; the lead chose option 1 (A10): the apply route deletes the CV of any application it does not send, and the token limit is about 5 per IP per hour, but a CV uploaded without any apply call stays in the 1 GB store (about 25 MB per IP per hour at most).
- source_spec: `_bmad-output/implementation-artifacts/spec-6-6-job-page-cv-upload.md`
  summary: On the job page at exactly 900px the shared `.split` is still two columns, but the AC and UX checks say the form sits below the details at 900px and below.
  evidence: Story 6.6 review 2026-10-04 (Edge Case Hunter); `.split` switches at `--breakpoint-md` (900px) since before this story, same as the 6.5 deferral of the 1px offset.
- source_spec: `_bmad-output/implementation-artifacts/spec-6-6-job-page-cv-upload.md`
  summary: Story 6.6 full review (Minor): check the CV's first bytes (`%PDF-`, `D0 CF 11 E0`, `PK`) and cap the bytes read instead of trusting `blob.size` (0 when Content-Length is missing); a deadline on Blob `get` and the token request; an idempotency key so a slow send is not mailed twice; `generateMetadata` with the role title; `aria-hidden` on the breadcrumb slashes; index-based React keys for CMS lists and chips; an absolute role URL and "(not given)" in the application mail; render the description as Portable Text, not `pt::text`; `/careers/[slug]` still reads Sanity once per unknown slug (`generateStaticParams`/`dynamicParams`); the upload limit fails open when Upstash is down; tests: the `localized()` block shape, the 3 s delete deadline, a filled honeypot from the job form, a different path per re-upload; `observed.md` is older than A10 part 4; the build ledger holds local absolute paths; `docs/sanity.md` has no step for the two job lists; a contract test that runs the real `uploadPresigned` against the token route's rate body (re-check the "Missing presignedUrlPayload" text on any `@vercel/blob` bump); `checkRateLimits` also fails open, so during an Upstash outage the CV delete and the role lookup are unthrottled; a log line when the upload limit is hit (the 200 answer is silent); a failing walk step should throw, not log.
  evidence: full 5-layer review 2026-10-04 (Important points fixed: CV delete only after the rate limits, rate message for a used-up upload limit, 390px sideways scroll, UX checks filled from the walk).
- source_spec: `_bmad-output/implementation-artifacts/spec-6-1-news-filters.md`
  summary: Story 6.1 review (Minor): the feature card keeps a 26px strip under its frame and puts "Read story" in row 3 when a post has no excerpt; "Read story" fills the text column's width (as in the 3.7 cards); the empty text says "category" when there are no stories at all; the live count does not repeat when two chips give the same number; without JavaScript the chips do nothing; a post with an unknown category shows only under All; the feature card follows the overall order, not the filtered list; chips are 36px tall (WCAG ok, below 44px touch); the GROQ filter and projection are copied from Home's query; no class check on the empty panel; weak query-field assertions; an unneeded Sanity mock in the page test; UX lines for chip hover, pen and the Show all look; the hero bottom padding (104px, mockup 64px) and the empty panel's 18px top margin; Amber to decide mist or transparent inactive chips.
  evidence: full 5-layer review 2026-10-04 (Important points fixed: a page test for the category wiring, the two UX rows marked partly).
- source_spec: `_bmad-output/implementation-artifacts/spec-6-2-story-detail.md`
  summary: Story 6.2 review (Minor): give `getOpenRole` the same list-first check as `getPost`, so an unknown `/careers/<slug>` costs no Sanity request; `productAnchor("")` returns "" not null; `aria-hidden` on breadcrumb slashes (story and job pages); render list items, quotes and h3+ properly instead of flattening to p/h2; no `<time>` for an unreadable date; Open Graph title and description per story; wrap `getPost` in React `cache()`; share the crumb copy between `newsPage` and `newsStory`; a branded `error.tsx` for Sanity outages; slug encoding for hand-typed slugs; Amber to say whether the empty story photo frame needs a `[Placeholder]` caption.
  evidence: full 5-layer review 2026-10-05 (medium points fixed: product link gate, excerpt fallback, keyboard and crumb walk checks, a real-story smoke test).


- source_spec: `_bmad-output/implementation-artifacts/spec-5-1-services-hero-clocks.md`
  summary: `npm run dev` returned 500 on every page on Sammy's machine on 2026-10-05: "next/font/google queries have exactly one entry" from the Google fonts in `src/app/layout.tsx`.
  evidence: maybe-false, medium if true (it blocks UX walks on the dev server for the team); the production build and `next start` work. Settle by running `npm run dev` on another machine or network.
- source_spec: `_bmad-output/implementation-artifacts/spec-6-3-editors-publish-sanity.md`
  summary: Story 6.3 review (Minor): a test that reads `studio/sanity.config.ts` (singleton wiring); check Sanity project write roles before Story 4.4 shows clips and check the clip type there; honour the editor's crop and hotspot (image URL builder) and use width/height or a hand-made srcset instead of one `?w=800`; style the Life figcaption; keep the PXP/LXP/SXP/IoT list in one place in the Studio; loosen the whitespace-bound query test; guard `/careers` if `getOpenRoles` throws inside `Promise.all`; drop local absolute paths from build ledgers; make walk scripts throw on a bad status.
  evidence: full 5-layer review 2026-10-05 (medium points patched: product fields removed, blank alt guarded).

- source_spec: `_bmad-output/implementation-artifacts/spec-5-2-stats-eight-services.md`
  summary: Add an automated browser check that `/services#<id>` lands each service heading below the sticky header (CAP-3, AC-NAV-5).
  evidence: The Playwright `smoke` project is request-only, so the landing is covered only by the CSS-source unit test and the evidence walk (`spec-5-2-stats-eight-services-evidence/walk.mjs`). A browser project, also useful for `#process` (5.4) and the Products anchors, would catch a broken `scroll-margin-top`.

- source_spec: `_bmad-output/implementation-artifacts/spec-5-4-process-project-capture.md`
  summary: At 390px the capture band's email input (`#cap-email`, Story 2.4, Andy) is 344×20px, below the 24×24 target-size floor, on Home and on Services.
  evidence: Measured in Chrome on the production build on 2026-10-05: 20px tall at 390px, 50px at 1280px, padding 0 18px. The white `.cap-row` pill around it looks taller than the input itself. Owner: Andy (capture band CSS).

- source_spec: `_bmad-output/implementation-artifacts/spec-5-4-process-project-capture.md`
  summary: The `/services#process` landing (hero link, mega menu, direct link) has no automated browser test either; add it with the 5.2 anchor check when a browser Playwright project exists.
  evidence: Story 5.4 review (Verification Gap). Only a CSS-source regex and the hand-run `walk.mjs` cover it.
- source_spec: `_bmad-output/implementation-artifacts/spec-5-4-process-project-capture.md`
  summary: The mega menu's "See the process" (`next/link` to `/services#process`, Andy's `site-nav.tsx`) may not scroll when the visitor is already on `/services#process`.
  evidence: maybe-false, medium if true. The same `next/link` same-hash behaviour broke the Services hero link (fixed in 5.4 with a plain `<a>`). Settle it by opening `/services#process`, scrolling up, and choosing "See the process" from the mega menu.

- source_spec: `_bmad-output/implementation-artifacts/spec-6-4-about-page.md`
  summary: The shared `.offices` rule in `globals.css` (Andy's, used on `/demo`) is one column at every width, because its base `grid-template-columns: 1fr` comes after its own `width >= md` two-column query.
  evidence: Found by the 6.4 walk, where the About office cards were one column at 1280px. About now widens only `.offices:has(> .office-card)`. Check whether `/demo` should be two columns from md, and if so, move the base rule above the query.
- source_spec: `_bmad-output/implementation-artifacts/spec-6-4-about-page.md`
  summary: The `/about` layouts (values 3/2/1 columns, offices 2/1), the featured cell, the FAQ marker and the anchor landings are checked only by the hand-run `walk.mjs`; add them to a browser Playwright project with the 5.2 and 5.4 anchor checks.
  evidence: Story 6.4 review (Verification Gap). jsdom cannot evaluate media queries, so unit tests only check class names and CSS text.
- source_spec: `_bmad-output/implementation-artifacts/spec-7-3-accessibility-checks.md`
  summary: Story 7.3 review (Minor): measure ring contrast on the page, not only in the token table; log or fail on axe `incomplete` contrast results; check every required field of each form, not one; scan menus and tabs in their open state and the form error state with axe; walk /careers, a story, a job page, /privacy and 404 by keyboard; document that `test:a11y` needs Chrome and clear `.next/cache/fetch-cache` before it (a `pretest:a11y` step); the date-field ring also shows on mouse focus (`:focus-within`).
  evidence: full review 2026-10-05 (medium points patched; these are Minor).
- source_spec: `_bmad-output/implementation-artifacts/spec-enh-a7-careers.md`
  summary: Q15 — the Life photo frames left `/careers` in E-A7, but their Sanity code stays unrendered: `getLifePhotos` (`src/lib/careers/life-photos.ts`), the `careersPhotos` schema and singleton (`studio/schemas/careers-photos.ts`, `index.ts`, `structure.ts`), `LifeFrames` (`src/components/careers/life-frames.tsx`), `careersLife` in `src/content/careers.ts`, and the `careersPhotos` revalidate tag. Decide after the demo: reuse it (for example for real photos in the Inside XionTech tiles) or remove the code and the schema in one change.
  evidence: Lead decision Q15 (plan default, 2026-10-08): keep the code and list it here.
  Review note (2026-10-08): the kept code still has its tests in `careers.test.tsx` and its CSS (`.illo` frames) in `globals.css`; the `careersPhotos` revalidate tag still revalidates `/careers`; the Studio help text (`studio/schemas/careers-photos.ts`) still says the photos show in "Life at XionTech". Fix the help text, or remove it all, in the same change.

## Deferred from: code review of spec-enh-a7-careers (2026-10-08)

- source_spec: `_bmad-output/implementation-artifacts/spec-enh-a7-careers.md`
  summary: The Careers flip card's accessible name changes when it is pressed (front title, then the whole back text). The spec and prototype ask for this, but the ARIA toggle-button pattern prefers a stable name (title as the name, back text as a description).
  evidence: maybe-false, medium if true. Settle it with NVDA or VoiceOver on `/careers`: flip a card and listen whether the change is clear.
- source_spec: `_bmad-output/implementation-artifacts/spec-enh-a7-careers.md`
  summary: E-A7 CAP-7 (job page has no sideways scroll from 320px to 1440px) is checked only by a hand-run browser walk; add a Playwright check (`scrollWidth <= clientWidth` at 320px on `/careers/<slug>`) when a browser e2e project runs per PR.
  evidence: Verification-gap and acceptance layers, 2026-10-08. The walk passed at 320/360/390/768/1024/1280/1440px.

## Deferred from: code review of spec-enh-a2-app-rename (2026-10-08)

- source_spec: `_bmad-output/implementation-artifacts/spec-enh-a2-app-rename.md`
  summary: The header Products menu row "AI Tutor" and a news post with app `ai-tutor` link to `/products#ai-tutor`, which has no section until E-A5 adds the AI Tutor card (`id="ai-tutor"`); E-A5 must add that id.
  evidence: E-A2 review (edge-case, blind, verification-gap, acceptance layers). Today the link lands at the top of /products, no error. No AI Tutor post exists until the Studio is deployed.
- source_spec: `_bmad-output/implementation-artifacts/spec-enh-a2-app-rename.md`
  summary: Home, About and the footer still say PXP, LXP and SXP, and the footer links `/products#lxp` (lands at the top of /products); Sammy's E-S1, E-S3 and E-S4 switch them to `src/content/apps.ts`.
  evidence: E-A2 review; out of scope by the E-A2 spec (Sammy's files). Grep `PXP|SXP|LXP` in `src/content/home.ts`, `about.ts`, `site-footer.ts`, `src/components/home/`.
- source_spec: `_bmad-output/implementation-artifacts/spec-enh-a2-app-rename.md`
  summary: The /products hero still says "Four apps. One connected school." and its lede names AI Tutor, but the page shows three app sections until E-A5 replaces the hero and adds the AI Tutor card.
  evidence: E-A2 review (blind hunter). E-A5 CAP-1 replaces the hero with "Built apart. Better together."
- source_spec: `_bmad-output/implementation-artifacts/spec-enh-a2-app-rename.md`
  summary: After deploy, a browser tab still holding the old Demo page sends products ["PXP", ...] and gets a 400; reloading fixes it.
  evidence: E-A2 review (edge-case hunter); low, only during the deploy window.

## Deferred from: code review of spec-enh-a3-header (2026-10-08)

- source_spec: `_bmad-output/implementation-artifacts/spec-enh-a3-header.md`
  summary: `scripts/ux/surfaces/header.json` still targets `#mega-products`, `#mega-services` and the Products/Services triggers, so `npm run ux:parity -- scripts/ux/surfaces/header.json --strict` checks parts that no longer exist; rewrite it for six plain links and the hamburger (UX-Q1 and UX-Q4 in `docs/ux-quality.md` become moot).
  evidence: E-A3 review (edge-case, blind, acceptance layers). Optional tool until Demo day (AGENTS.md); outside the E-A3 file list.
- source_spec: `_bmad-output/implementation-artifacts/spec-enh-a3-header.md`
  summary: The `--z-index-mega-menu: 55` token in `src/app/globals.css` has no user after E-A3; remove it together with its line in `src/lib/design/contrast.test.ts`.
  evidence: E-A3 review (all four layers). Low; `globals.css` is edited by parallel tasks today, so a one-line follow-up avoids conflicts.
- source_spec: `_bmad-output/implementation-artifacts/spec-enh-a3-header.md`
  summary: The comment at `src/content/products.ts:121-122` says the IoT audience comes from the Products mega menu, which E-A3 removed; reword it when E-A5 touches that file.
  evidence: E-A3 review (edge-case, acceptance). Comment only; `products.ts` belongs to E-A5.
- source_spec: `_bmad-output/implementation-artifacts/spec-enh-a3-header.md`
  summary: Planning docs still describe the old header: `EXPERIENCE.md` (Mega menu; Book a demo first in the mobile menu at 640px and below), AC-NAV-2/AC-NAV-3 in the PRD and `epics.md`, and the example rows in `docs/ux-checks.md`. Amber owns them; update after the decision Q8 and the T11 change.
  evidence: E-A3 review (blind hunter). Planning docs are Amber's (team roles); the fix edits other specs.

- source_spec: `_bmad-output/implementation-artifacts/spec-enh-a5-products.md`
  summary: On /products under prefers-reduced-motion, "Play motion" saves the choice but the hero glows stay still, because the global reduced-motion rule (`animation: none !important` in the base layer) wins over any later rule.
  evidence: E-A5 review (verification gap). Fix needs a design call: either hide the Pause/Play button under reduced motion, or move the glows to a JS animation like the Home silk.
- source_spec: `_bmad-output/implementation-artifacts/spec-enh-a5-products.md`
  summary: The footer (`src/content/site-footer.ts`) and the Home app bento (`lxp` tile) still link `/products#lxp`, which has no card; they land at the top of /products.
  evidence: E-A5 review (verification gap). Pre-existing since E-A2 removed the LXP section; Sammy's files. Point them at `#ai-tutor` or drop them.
- source_spec: `_bmad-output/implementation-artifacts/spec-enh-a5-products.md`
  summary: E-A5 Tier 2 parts stay out: A day at school (ENH-015, ENH-023, ENH-050, ENH-051), Product updates (ENH-024, ENH-042) and the page-long background flow (ENH-022); also the hero glows do not pause when off screen.
  evidence: Spec Non-goals (Q14); prototype site.js pauses the glows off screen (`is-off`), not ported.
