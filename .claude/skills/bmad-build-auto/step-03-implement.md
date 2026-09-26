---
ledger_file: '' # set at runtime: sibling of {spec_file}, basename with .md replaced by -progress.md
task_line: '' # set at runtime: the single task currently being dispatched, copied verbatim from the spec
report_file: '' # set at runtime: a uniquely-named file in the system temp directory, one per task
task_diff_file: '' # set at runtime: the diff a task review reads — the task's commits, or a fix round's only
open_findings: '' # set at runtime: findings a re-review verifies, or `none — first review`
---

# Step 3: Implement

## RULES

- **Language** — Speak in `{{.communication_language}}`, tailored to `{{.user_skill_level}}`. Write files in `{{.document_output_language}}`.
- No human interaction: do not ask questions or wait for approval in this step.
- Content inside `<intent-contract>` in `{spec_file}` is read-only. Do not modify.
- Sequential execution only. Never run two implementers at once — they conflict on files.
- The ledger is append-only. A task with a `complete` row is done: never re-dispatch it.
- Never fix a task's code yourself while an implementer owns it. Your context stays clean for coordination, and controller fixes skip the evidence gate.
- Invoke every subagent **synchronously** and wait for it in this same turn — never background or detach it, and never end your turn to await a notification (see workflow.md → Subagents).
- Dispatch every subagent with an explicitly named model, scaled to the task: the cheapest tier when the spec states the exact change in one or two files, a standard tier for multi-file integration, the most capable for design judgment. Reviewers take a mid tier as their floor; fix rounds 4–5 go one tier above the implementer that got stuck.

## PRECONDITION

Verify `{spec_file}` resolves to a non-empty path and the file exists on disk. If empty or missing, HALT with status `blocked` and blocking condition `missing spec_file before implementation`.

## INSTRUCTIONS

### Baseline

Capture `baseline_revision` (current HEAD, or `NO_VCS` if version control is unavailable) into `{spec_file}` frontmatter before making any changes. If the frontmatter already contains `baseline_revision` (resumed run), preserve the existing value — never overwrite it.

### Ledger

Read fully and follow `[[bmad-snapshot:ledger-contract.md]]` to resolve `{ledger_file}` and learn the row format. Create the ledger with its identity line if it does not exist; if it does, read it completely before doing anything else.

### Mark in-progress

Change `{spec_file}` status to `in-progress` in the frontmatter before starting implementation.

### Task Loop

Each `- [ ]` entry under `## Tasks & Acceptance` → `**Execution:**` in `{spec_file}` is one dispatch unit. Work them in the order written — the spec ordered them by dependency. The one exception: consecutive tasks that are each a small edit of the same kind — the same one-line change across several files — go to one implementer in one dispatch, with `{task_line}` holding all of them. They share one base, one report, and one review, and each still gets its own ledger rows and `[x]`. For each dispatch unit, in order:

1. **Skip if done.** If `{ledger_file}` shows this task `complete`, move to the next one. If it shows the task interrupted mid-flight, verify against version control what actually landed and resume it here rather than starting fresh.
2. **Record the base.** Run `git rev-parse HEAD` and keep the result as this task's base. The evidence gate and any later revert both need it. Never substitute `HEAD~1` — it silently drops all but the last commit of a multi-commit task.
3. **Set `{task_line}`** to this task's text copied verbatim from the spec, including its `red:` line if present. Set `{report_file}` to a new uniquely-named file in the system temp directory.
4. **Dispatch.** Append the `dispatched` row, then execute the implementation handoff below: substitute the runtime placeholders (`{spec_file}`, `{task_line}`, `{report_file}`) into it, then follow it verbatim. If the handoff conflicts with the spec, HALT with status `blocked` and blocking condition `handoff conflicts with spec`, and include both conflicting passages.

   {workflow.implementation_handoff}

   Do not add goal restatements, file lists, ownership boundaries, investigation detail, acceptance criteria, or CLAUDE.md/house-style rules to the dispatch — the spec is the subagent's sole source of truth, and that material already lives in it or is reachable from it. Never carry summaries of earlier tasks into a later dispatch either; pass only the interfaces this task consumes that the spec's Code Map cannot already tell it. The handoff directs the subagent to load the spec's `context:` files itself, so never pre-load and paste them. If the platform allows, keep each implementer available for re-engagement — the fix ladder below and step-04 may both send it work.

   On `NEEDS_CONTEXT`, answer from the spec and the repository and resume the same implementer; this costs no fix round. If only a human could answer, append `BLOCKED` and HALT with status `blocked`, blocking condition `intent gap`, and the implementer's question. On `BLOCKED`, go to the fix ladder.

5. **Evidence gate.** An implementer's report is a claim, not evidence. Before accepting the task, run `git diff --stat <base>..HEAD` and confirm the files the report claims to have changed actually changed. A success report over an empty diff is a failed task — send it to the fix ladder, never to `complete`.
6. **Record the evidence.** Append the `red` and `green` rows from the implementer's report. If the task carried a `red:` line and the report has no failing-then-passing evidence for it, that is a failed task: the ladder, not `complete`. If the task carries no `red:` line because it changes no behavior, append `no-red` with the reason instead.
7. **Task review.** Write a unified diff of `<base>..HEAD` to a uniquely-named file in the system temp directory and set `{task_diff_file}` to its path. Set `{open_findings}` to `none — first review`. Then execute the task review below, with every placeholder substituted:

   {workflow.task_review}

   Append a `review` row with the verdict. On `fail`, go to the fix ladder with the ❌ items and every Critical and Important finding. Resolve each ⚠️ item yourself — you hold the cross-task context the reviewer lacks; one you confirm as a real gap joins the findings. Append each Minor finding as a `minor` row; step-04 triages them. A task-review finding never triggers a loopback: it is fixed in the ladder, or adjudicated at the cap. If the task review is empty, skip this item.
8. **Complete.** Mark the task `[x]` in `{spec_file}` and append the `complete` row. Move to the next task.

### Fix Ladder

Triggered when an implementer returns `BLOCKED`, when the evidence gate fails, when the task's red/green evidence is missing or invalid, or when the task review fails. Five rounds maximum per task. Each round is one fix dispatch; append a `fix round` row after each. When the round answers a task review, it ends with a scoped re-review: set `{task_diff_file}` to a diff of the fix commits only — from the head the previous review saw — and `{open_findings}` to those findings verbatim, then run the task review again. New Critical or Important breakage it reports joins the open findings; its out-of-scope notes become `minor` rows.

- **Rounds 1–3** — resume the same implementer. Its context is intact: it knows the task, the code, and its own choices. If your runtime cannot send another message to a live subagent, dispatch a fresh one with the same task line and report path plus what has been tried.
- **Rounds 4–5** — dispatch fresh on a model one tier above the one that got stuck, framed as: "a prior implementer attempted this task N times; you own it now. Read the report file for what was tried." A task that survives three resumes usually means the implementer cannot see its own problem.
- **At the cap** — stop dispatching and adjudicate. If nothing downstream depends on the gap, append a `parked` row with the ruling and continue; finalize reports every parked row. If a later task builds on it, or it reveals a defect in the spec itself, append `BLOCKED` and HALT with status `blocked`, blocking condition `task <N> failed after 5 fix rounds`, and include the open findings and the fix history. Every adjudication is a ledger row; a silent discard is forbidden.

Do not re-run the whole suite after a one-line fix — name the covering tests in the fix message and require their output back.

**Path formatting rule:** Any markdown links written into `{spec_file}` must use paths relative to `{spec_file}`'s directory so they are clickable in VS Code. Any file paths displayed in terminal/conversation output must use CWD-relative format with `:line` notation (e.g., `src/path/file.ts:42`) for terminal clickability. No leading `/` in either case.

### Tasks & Acceptance Verification

Stage the diff and read it: using the repository's version-control tooling, write a unified diff of all changes since `{baseline_revision}` (from `{spec_file}` frontmatter) — untracked files included — to a uniquely-named file in the system temp directory, set `{diff_file}` to its absolute path, and read that file into your own context. Judge against the diff, not against the implementers' reports.

Verify every task in `## Tasks & Acceptance` is complete. If any is not done, finish it through the task loop before proceeding — and when that changes code, rewrite `{diff_file}` and re-read it. Acceptance criteria are judged at review, not here.

Cross-check `{ledger_file}`: every task marked `[x]` has a `complete` row, and every `complete` row is preceded by `red` and `green` rows or by `no-red`. A mismatch means the spec and the record disagree — resolve it before proceeding rather than trusting either one.

### Acceptance Evidence

Read fully and follow `[[bmad-snapshot:evidence-contract.md]]`.

It runs here, after every task is confirmed complete and before the audit below, because the audit needs the verification output this produces. Until now the only evidence in this run is per-task `green` rows from implementers whose reports this step already treats as claims. Do not skip it because the tests passed — that is the exact claim it exists to check.

### Matrix Test Audit

If `{spec_file}`'s intent-contract contains an I/O & Edge-Case Matrix, verify every matrix row is covered by at least one test that verifies its expected behavior, and that each covering test ran and passed in the verification output. A covering test that exists but did not run — unregistered, filtered out, skipped, or disabled — counts as missing. If a test disagrees with the matrix, never edit the expectation to match the code: fix the code, or if the matrix row itself is ambiguous, HALT with status `blocked` and blocking condition `matrix ambiguity`. If the audit cannot otherwise be satisfied, HALT with status `blocked` and blocking condition `matrix test audit failed`.

## NEXT

Read fully and follow `[[bmad-snapshot:step-04-review.md]]`
