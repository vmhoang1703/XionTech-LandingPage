---
name: create-pr
description: Create GitHub pull requests for the XionTech landing page repo with the `gh` CLI. Use this whenever the user wants to open, raise, or submit a PR — "create a PR", "open a PR for this", "raise the PR for this story", "ship this", "my branch is ready" — and equally whenever a story's PR has merged and they want it closed out — "the PR merged", "update sprint status", "story 2.2 is finished", "close out the story" — since this skill owns the sprint-status promotion to `done` that BMad never performs. Resolves the base branch (`develop`), writes the description against the PR template, and calls `gh pr create` with an explicit `--repo`. Prefer this over hand-running `gh pr create` or `git` commands.
---

# Creating PRs in this repo

Every change reaches `develop` through a GitHub PR (see `AGENTS.md` → Git
workflow). This skill turns a pushed feature branch into one PR whose
description follows the team's PR template, so every PR reads the same way.

Three facts drive the design:

- **`gh` must not guess the target repo.** With more than one remote, `gh`
  asks which one to use, or picks the upstream of a fork. The scripts parse
  `origin` and pass `--repo <owner>/<name>` explicitly.
- **The base is `develop`.** Every PR here targets it; only a release PR goes
  from `develop` to `main` (see step 6). The scripts use `origin/develop` when
  it exists, else the remote default from `origin/HEAD`. Always show the
  resolved base before creating. `main`, `develop` and the GitHub default
  branch (which is `develop` here) are shared: no feature PR is opened from
  them.
- **The repo ships no `.github/pull_request_template.md`.** The template
  bundled at `assets/pull_request_template.md` is the fallback; a repo template
  added later wins over it automatically.

## Workflow

The scripts live in `.claude/skills/create-pr/scripts/` under the project
root. **Invoke them by path from the project root.** `pr-gather.sh` and
`pr-create.sh` take `--repo <dir>` — a local directory (default: the current
one), not `owner/name`; `pr-scan.sh` takes `--root <dir>`. For a `prReady` row
of a nested clone, pass that row's `path` as `--repo`. The scripts need `git`,
`bash` (Git Bash on Windows), `python` (Python 3, as `CLAUDE.md` requires) and,
for the create step only, `gh`.

### 1. Scan

```bash
.claude/skills/create-pr/scripts/pr-scan.sh
```

Read-only. Returns a JSON array (the project repo, plus any nested clone):
current branch, upstream, resolved `baseBranch`, `defaultBranch`, `aheadCount`,
`aheadOfUpstream`, `dirty`, `githubRepo`, `storyKey`, `onSharedBranch`,
`largeRange`, and `prReady`.

Print a compact line of it — branch, base, ahead, unpushed, ready — so the
user sees the picture before anything is created.

`prReady` already accounts for the trap that `main` leads `develop` after a
release merge: a repo sitting on a shared branch (`main`, `develop`, the
default) is never PR-able, no matter how far ahead of the base it is.

If nothing is `prReady`, there is nothing to open — say so and stop, unless
the ask was to close a story out after its PR merged, in which case go straight
to step 7.

Then confirm the branch and its resolved base with the user before going
further. Creating a PR is outward-facing and hard to take back, so this
confirmation is the point where a wrong base gets caught.

**`largeRange: true` means confirm the base before going on.** It fires above
30 commits, which is usually a wrong base rather than one story. A genuinely
large story is fine once the user confirms the base.

`storyKey` is the BMad story key read from the branch name
(`feature/1-1-brand-tokens` → `1-1-brand-tokens`, matching the spec folder
`_bmad-output/specs/andy/spec-1-1-brand-tokens/`). It is `null` for branches
that are not named after a story (`fix/create-pr-github`); when the user names
the story, use that instead.

### 2. Gather

```bash
.claude/skills/create-pr/scripts/pr-gather.sh
```

Returns commits, `diffStat`, `numstat`, `totals`, the raw `diff` (capped at
`--max-diff-bytes`, default 60000, with `diffTruncated` telling you when it
hit the cap), `storyKey`, `githubRepo`, and the resolved `template`. Override
with `--base-branch` or `--commit-ref` when the defaults are wrong.

This one call is the whole context. Resist issuing follow-up `git log` /
`git diff` / `git merge-base` commands — the script already resolved them, and
each extra call costs a round-trip for information you have.

When `storyKey` is set, also read that story's specs:

- the planned spec `_bmad-output/specs/<dev>/spec-<storyKey>/SPEC.md` (the
  `<dev>` folder is `andy` or `sammy`) — its capabilities and acceptance
  criteria fill `## AC covered`;
- once `bmad-build` has run on the branch, its build spec
  `_bmad-output/implementation-artifacts/spec-<storyKey>.md` — its
  `## Acceptance Evidence` gives the verification results and screenshots.

If neither exists, say so in `## AC covered` rather than inventing criteria.

### 3. Write the title

Conventional Commits, matching `AGENTS.md`: `{type}: {description}` or
`{type}({scope}): {description}`.

- Type from `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`,
  `build`, `ci`. Take it from the commits when they are conventional; infer it
  from the diff when they are not.
- Scope is the area inside the repo (`specs`, `ux`, `setup`), optional.
- Under 72 chars, no trailing period.
- **Name the story in the title** when there is one, so the PR list reads as
  the plan: `feat: Story 1.1 brand tokens, fonts, surfaces and motion primitives`.

### 4. Write the description

Fill the `template` returned by the gather call. Keep its headings, order, and
checkbox lists intact — the template is what a reviewer expects to skim, so an
invented layout costs them time.

- Replace every `<!-- ... -->` hint with real content. No placeholders survive
  into the PR.
- Tick `[x]` only what genuinely holds. An unticked box is information; a
  falsely ticked one is a lie a reviewer will act on.
- Name the story and its spec in `## Why`; link related PRs as `#<number>`.
- Report check results honestly in `## Tests added`: the commands that ran and
  what they printed. If the local Sonar gate was skipped
  (`SONAR_GATE_SKIP=1`), say so and who approved it (`CLAUDE.md` requires this).
  Name any acceptance criterion that is only partly covered.
- Keep file counts consistent with `numstat`. Do not describe changes you
  cannot point at in the diff — especially tests. If `diffTruncated` is true,
  say the description covers a truncated diff rather than guessing at the rest.
- Exclude merge commits unless they are all there is; ignore WIP churn unless
  it reflects shipped behaviour.
- End with the AI attribution line when an AI agent wrote the PR.

Show the user the title and the filled description, then write the description
to a scratch `.md` file for the create call.

### 5. Push

The create script does not push — a PR built from a stale remote branch reviews
code nobody can see, so it refuses rather than silently opening one. When
`aheadOfUpstream > 0` or `hasUpstream` is false, push first:

```bash
git push -u origin <branch>
```

The `pre-push` hook runs the local SonarQube gate (`CLAUDE.md` → "SonarQube —
LOCAL ONLY"); until Demo day (2026-10-09) it runs `npm run lint` only and the
gate runs daily on `develop`. If it blocks, fix the findings and push again.
Skip it only with the user's explicit OK, and say so in the PR.

### 6. Create

```bash
.claude/skills/create-pr/scripts/pr-create.sh \
  --title "feat: Story 1.1 brand tokens, fonts, surfaces and motion primitives" \
  --description-file /path/to/description.md
```

Optional: `--target-branch` to override the resolved base, `--reviewers a,b`
(GitHub logins; no default — leave them off unless the user names people),
`--draft`, and `--dry-run` to print the exact `gh` invocation without running
it. Use `--dry-run` when anything about the target looks uncertain.

Report the PR URL that `gh` prints.

**Release PR (`develop` → `main`).** The only PR opened from a shared branch,
and only when asked for explicitly. On `develop`, gather with
`--base-branch main`, title it `release: …`, and create with
`--target-branch main`; without that flag the script refuses `develop` like any
shared branch.

To fix a description after the PR exists, use
`gh pr edit <number> --repo <githubRepo> --body-file <file>` — do not open a
second PR.

### 7. Sprint status

`bmad-build` moves a story to `in-progress` and then `review`, and stops there —
**nothing in BMad ever writes `done` to `sprint-status.yaml`.** Its step-05 sets
the *spec's* frontmatter to `done` on the line above the one that syncs sprint
status to `review`, so a finished story reads `done` in one file and `review` in
the other. Closing that gap is this step.

**This step has its own entrance.** "The PR merged, close it out", "update
sprint status" — start here and skip steps 1–6 entirely. There is no branch to
scan by then, and insisting on one is how this step becomes unreachable at the
exact moment it is needed.

**If `_bmad-output/implementation-artifacts/sprint-status.yaml` does not exist,
skip this step and say so once** — the sprint was never planned with
`bmad-sprint-planning`, which is a gap to fix there, not here.

Otherwise resolve the story — from the scan's `storyKey` when you came through
step 1, otherwise from what the user named ("Story 2.2" → key `2-2-*`).

**Two moments, and they are not the same moment.**

- **PR opened** → floor the story at `review`. This is a repair, not a
  promotion: `sync-sprint-status.md` returns silently when `story_key` is unset
  or the file is missing, so a story sitting at `backlog` with an open PR means
  build's sync never fired. Say that you repaired it.
- **Every PR for the story merged** → `done`. Usually a later invocation than
  the one that created them, so no branch is at hand. Story PR titles name the
  story (step 3), so search by title:

  ```bash
  gh pr list --repo <githubRepo> --state all \
    --search '"Story 2.2" in:title' --json number,state,headRefName,url
  ```

  A story can have more than one PR (a follow-up fix). Any `OPEN` → the story
  stays at `review`. No `OPEN` and at least one `MERGED` → `done`. Only
  `CLOSED` (not merged) → ask; the work usually moved to another branch. No
  rows → report it and stop; do not guess.

Follow the same write rules as `bmad-build/sync-sprint-status.md`, so both
writers agree:

- **Never regress.** `backlog` < `ready-for-dev` < `in-progress` < `review` <
  `done`. Already at or past the target → leave it.
- **Key not in `development_status`** → report it and stop; do not add one. An
  invented key survives until the next `bmad-sprint-planning` run drops it as an
  orphan.
- Refresh `last_updated`; preserve every comment and the STATUS DEFINITIONS
  block.

**Epic rollup, which build never does.** After setting a story to `done`, check
its siblings under `epic-N`. All `done` → set `epic-N: done`.

## When it fails

Fail loudly and name what is missing rather than retrying blind.

- `gh` not authenticated → the user runs `gh auth login` (suggest
  `! gh auth login`); check with `gh auth status`.
- Branch behind upstream → `git pull --rebase`, then re-run.
- Branch tracks another branch (e.g. created from `origin/develop`) → push it
  with `git push -u origin <branch>`, then re-run.
- `origin/<base>` missing → pass `--base-branch` explicitly.
- Remote URL unparseable → `origin` is not a GitHub repo; report it.
- "is a shared branch" → the work is not on a feature branch. Check out the
  right branch; do not work around the guard. A release PR is the one
  exception (step 6).
- "a pull request for branch ... already exists" → report the existing PR
  (`gh pr list --head <branch>`); edit it rather than opening another.

## Tests

`scripts/test_pr_scripts.sh` checks, offline against a throwaway repo shaped
like this one (default branch `develop`, `main` ahead of it): the remote
parser, the story key, each refusal in `pr-create.sh` except "gh not
installed", the release PR, the `--dry-run` command line, a real run against a
fake `gh`, and the scan and gather output (including the `.github` template
taking precedence). Run it after any change to the scripts:

```bash
bash .claude/skills/create-pr/scripts/test_pr_scripts.sh
```

## Scope boundaries

Do not commit, amend, rebase, force-push, or edit code to make a PR look
tidier. This skill turns work that already exists into a PR. If the branch is
dirty (`dirty: true` in the scan), say so and let the user decide.

`sprint-status.yaml` is the one file it writes, and only per step 7 — status
promotion is bookkeeping about work that already shipped, not a change to the
work. Everything else in `_bmad-output/` belongs to the BMad skills that own it.
