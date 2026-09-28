---
name: create-pr
description: Create Azure DevOps pull requests for the XTP0008 / PXP workspace, one per repo that has work on a branch. Use this whenever the user wants to open, raise, or submit a PR — "create a PR", "open a PR for this", "raise the PRs for this story", "ship this", "my branch is ready" — and equally whenever a story's PRs have merged and they want it closed out — "the PRs merged", "mark #23957 done", "update sprint status", "story 2.2 is finished", "close out the story" — since this skill owns the sprint-status promotion to `done` that BMad never performs. Also use it when they finish a change across pxp-ai, pxp-backend, pxp-data-aggregator, pxp-infra, pxp_mobile, or the workspace repo and ask what to do next. Handles the multi-repo case where one story becomes several PRs, resolves each repo's base branch, writes descriptions against the PR template, and calls `az repos pr create` with an explicit org and project. Prefer this over hand-running `az repos pr create` or `git` commands.
---

# Creating PRs in this workspace

One story here usually lands as **several PRs — one per repo it touches**. The
job is therefore: find every repo with PR-able work, write a description per
repo, and open the PRs so a reviewer can trace them back to one unit of work.

Three facts drive the design, all verified against the repos:

- **`az`'s auto-detection is unsafe here.** The configured `az devops` defaults
  on this machine point at a different organisation and project entirely. The
  scripts parse `origin` in each repo and pass `--organization/--project/
  --repository` explicitly, so a PR can never land in the wrong project.
- **`develop` is not universal.** It exists in `pxp-ai`,
  `pxp-data-aggregator`, `pxp_mobile` — not in `pxp-backend` or `pxp-infra`.
  The base resolves per repo: `origin/develop` if present, else the remote
  default from `origin/HEAD`. Always show the resolved base before creating.
- **No repo ships `.azuredevops/pull_request_template.md`.** The template
  bundled at `assets/pull_request_template.md` is the fallback; a repo that
  later adds its own wins over it automatically.

## Workflow

The scripts live at `<workspace-root>/.claude/skills/create-pr/scripts/` —
where `<workspace-root>` is the directory holding the five app repos. **Invoke
them by absolute path**, whatever the current directory is: a session started
inside `pxp-backend/` still loads this skill, and the relative paths below
would not resolve there. The scripts locate the workspace themselves and take
`--repo` for the target, so cwd never has to change.

### 1. Scan — one call, all repos

```bash
<workspace-root>/.claude/skills/create-pr/scripts/pr-scan.sh
```

Read-only. Returns a JSON array covering the workspace repo and every app repo:
current branch, upstream, resolved `baseBranch`, `defaultBranch`, `aheadCount`,
`aheadOfUpstream`, `dirty`, `workItemIds`, `onSharedBranch`, `largeRange`, and
`prReady`.

Print a compact table of it — repo, branch, base, ahead, unpushed, ready — so
the user sees the whole picture before anything is created. Most repos sit on
their default branch with nothing to open; that is normal, not an error.

`prReady` already accounts for the trap that `main` is ahead of `develop` in
several of these repos: a repo sitting on a shared branch is never PR-able, no
matter how far ahead of the base it is.

If **no** repo is `prReady`, there is nothing to open — say so and stop, unless
the ask was to close a story out after its PRs merged, in which case go straight
to step 7. That is the normal state post-merge, not a failure.

Then confirm the target set with the user before going further, naming the
repos and their resolved bases. Creating a PR is outward-facing and hard to
take back, so this confirmation is the point where a wrong base gets caught.

**`largeRange: true` means confirm the base before going on.** It fires above
30 commits, which is usually a wrong base rather than one story —
`pxp_mobile`'s long-lived `prototype` branch is 366 commits from `develop`, and
a description written from that range would be fiction. A genuinely large story
is fine once the user confirms the base; the flag asks the question, it does not
refuse the work.

### 2. Gather — one call per target repo

```bash
<workspace-root>/.claude/skills/create-pr/scripts/pr-gather.sh --repo pxp-backend
```

Returns commits, `diffStat`, `numstat`, `totals`, the raw `diff` (capped at
`--max-diff-bytes`, default 60000, with `diffTruncated` telling you when it
hit the cap), `workItemIds`, and the resolved `template`. Override with
`--base-branch` or `--commit-ref` when the defaults are wrong.

This one call is the whole context. Resist issuing follow-up `git log` /
`git diff` / `git merge-base` commands — the script already resolved them, and
each extra call costs a round-trip for information you have.

### 3. Write the title

`{type}({scope}): {description}` — Conventional Commits, matching the rule in
the workspace `CLAUDE.md`.

- Type from `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`,
  `build`, `ci`. Take it from the commits when they are conventional; infer it
  from the diff when they are not.
- Scope is the area **inside** the repo (`auth`, `helm`, `chatkit`) — never the
  repo name, since the PR already belongs to one repo.
- Under 72 chars, lowercase after the colon, no trailing period.
- **Put the work item id in the title** when there is one, so sibling PRs in
  other repos are visibly one story: `feat(auth): add refresh flow (#16569)`.
  When one story spans repos, use the same id in every title.

### 4. Write the description

Fill the `template` returned by the gather call. Keep its headings, order, and
checkbox lists intact — the template is what a reviewer expects to skim, so an
invented layout costs them time.

- Replace every `<!-- ... -->` hint with real content. No placeholders survive
  into the PR.
- Tick `[x]` only what genuinely holds. An unticked box is information; a
  falsely ticked one is a lie a reviewer will act on.
- Reference the work item in `## Why` as `#<id>`. Note that plain `AB#<id>` is
  GitHub→Azure Boards syntax and does **not** link inside a native ADO PR —
  the real link comes from passing `--work-items` in step 6.
- When the story spans repos, name the sibling PRs in `## Why` so a reviewer
  landing on one can find the others.
- Repo-qualify paths (`pxp-backend/src/...`), per the workspace convention.
- Keep file counts consistent with `numstat`. Do not describe changes you
  cannot point at in the diff — especially tests. If `diffTruncated` is true,
  say the description covers a truncated diff rather than guessing at the rest.
- Exclude merge commits unless they are all there is; ignore WIP churn unless
  it reflects shipped behaviour.
- Under ~2000 chars. If trimming is needed, cut in this order: prose summary,
  change bullets, file rows. Never drop a heading.

Show the user the title and the filled description, then write the description
to a scratch `.md` file for the create call.

### 5. Push

The create script does not push — a PR built from a stale remote branch reviews
code nobody can see, so it refuses rather than silently opening one. When
`aheadOfUpstream > 0` or `hasUpstream` is false, push first:

```bash
git -C <repo> push          # or: git -C <repo> push -u origin <branch>
```

### 6. Create

```bash
<workspace-root>/.claude/skills/create-pr/scripts/pr-create-azure.sh \
  --repo pxp-backend \
  --title "feat(auth): add refresh flow (#16569)" \
  --description-file /path/to/description.md \
  --work-items 16569
```

Optional: `--target-branch` to override the resolved base, `--reviewers a,b`
(no default — these become *optional* reviewers in ADO, so leave them off
unless the user names people), `--draft`, and `--dry-run` to print the exact
`az` invocation without running it. Use `--dry-run` when anything about the
target looks uncertain.

Run it once per repo and report each PR URL. If several repos are in play, do
them one at a time and report as you go, rather than batching — a failure
halfway through is then obvious.

### 7. Sprint status

`bmad-build` moves a story to `in-progress` and then `review`, and stops there —
**nothing in BMad ever writes `done` to `sprint-status.yaml`.** Its step-05 sets
the *spec's* frontmatter to `done` on the line above the one that syncs sprint
status to `review`, so a finished story reads `done` in one file and `review` in
the other. Closing that gap is this step.

**This step has its own entrance.** "Mark #23957 done", "the PRs merged, close
it out", "update sprint status" — start here and skip steps 1–6 entirely. There
is no branch to scan by then, and insisting on one is how this step becomes
unreachable at the exact moment it is needed.

Resolve the story by tracker id — from the scan's `workItemIds` when you came
through step 1, otherwise from what the user named:

```
work item id → {implementation_artifacts}/<batch>/spec-<id>-*.md
             → frontmatter title "Story N.M" → sprint-status key N-M-*
```

That chain is more reliable than `bmad-build`'s own, which infers the numbers by
reading the spec rather than by tracker id.

**Two moments, and they are not the same moment.**

- **PRs opened** → floor the story at `review`. This is a repair, not a
  promotion: `sync-sprint-status.md` returns silently when `story_key` is unset
  or the file is missing, so a story sitting at `backlog` with open PRs means
  build's sync never fired. Say that you repaired it, so the silent skip gets
  noticed rather than papered over.
- **Every PR for the story merged** → `done`. Almost always a later invocation
  than the one that created them, so the PR ids are gone — step 6 reports URLs
  to the user and persists nothing. Find them by work item rather than asking
  the user to dig:

  ```bash
  az repos pr list --organization <org> --project <project> \
    --repository <repo> --status all \
    --query "[?contains(title,'#23957')].{id:pullRequestId,status:status}" -o tsv
  ```

  Run it per repo the story touched. Every row `completed` → `done`. Any row
  `active` → the story stays at `review`. Any row `abandoned` → ask; an
  abandoned PR usually means the work moved to another branch.

That per-repo sweep is the part not to shortcut: **one story is several PRs**,
and a story whose backend PR merged while its mobile PR is still open is not
done. A single merge notification is the most tempting wrong trigger in this
workspace, and it arrives one repo at a time.

Follow the same write rules as `bmad-build/sync-sprint-status.md`, so both
writers agree:

- **Never regress.** `backlog` < `ready-for-dev` < `in-progress` < `review` <
  `done`. Already at or past the target → leave it.
- **Key not in `development_status`** → report it and stop; do not add one. An
  invented key survives until the next `bmad-sprint-planning` run drops it as an
  orphan.
- **Enablers have no key at all** and cannot be given one — `sprint_plan.py`
  rebuilds `development_status` from parsed epics only. An enabler's status
  lives in its spec frontmatter and `build-plan.md`; say so rather than
  improvising an entry.
- Refresh `last_updated`; preserve every comment and the STATUS DEFINITIONS
  block.

**Epic rollup, which build never does.** After setting a story to `done`, check
its siblings under `epic-N`. All `done` → set `epic-N: done`. Build's epic lift
only fires on `in-progress`, so without this an epic stays `in-progress` forever
and the status view keeps reporting a finished epic as open.

If `sprint-status.yaml` does not exist, skip this step and say so once — the
sprint was never planned with `bmad-sprint-planning`, which is a gap to fix
there, not here.

## When it fails

Fail loudly and name what is missing rather than retrying blind.

- `az` not authenticated → `az login`, or set `AZURE_DEVOPS_EXT_PAT`.
- Branch behind upstream → `git -C <repo> pull --rebase`, then re-run.
- `origin/<base>` missing → pass `--base-branch` explicitly.
- Remote URL unparseable → the repo is not on Azure DevOps; report it.
- "is this repo's default branch" → the work is not on a feature branch. Check
  out the right branch; do not work around the guard.

## Scope boundaries

Do not commit, amend, rebase, force-push, or edit code to make a PR look
tidier. This skill turns work that already exists into PRs. If the branch is
dirty (`dirty: true` in the scan), say so and let the user decide.

`sprint-status.yaml` is the one file it writes, and only per step 7 — status
promotion is bookkeeping about work that already shipped, not a change to the
work. Everything else in `_bmad-output/` belongs to the BMad skills that own it.
