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
