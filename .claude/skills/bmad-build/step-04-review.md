# Step 4: Review

## RULES

- **Language** — Speak in `{{.communication_language}}`. Write any file output in `{{.document_output_language}}`.
- Dispatch every review subagent with an explicitly named model. An omitted model silently inherits the session's — usually the most capable and most expensive — which defeats this rule. Scale the model to the work: a small mechanical diff does not need the session's best model; a subtle concurrency, security, or data-integrity change does. Reviewers take a mid tier as their floor.
- Run subagents synchronously: launch them together, then wait for all results before continuing.

## INSTRUCTIONS

Change `{spec_file}` status to `in-review` in the frontmatter before continuing.

### Stage the Diff

Read `{baseline_commit}` from `{spec_file}` frontmatter. If `{baseline_commit}` is missing or `NO_VCS`, use best effort to determine what changed. Otherwise use the repository's version-control tooling to rewrite `{diff_file}` — the temp file staged in step-03, or a uniquely-named file in the system temp directory when this run has none — with a unified diff of all changes since `{baseline_commit}`, untracked files included. The review layers read that file; the diff text is never pasted into their prompts.

Set `{claims_file}` = `{spec_file}`. The spec is the change's own account of itself, and it goes to the edge-case layer alone — as a path, so that layer reads it only after its own tracing and the other layers never see it at all.

Writing `{diff_file}` is the only change this section makes. Do NOT `git add` anything.

### Review

Runtime placeholders: `{diff_file}` and `{claims_file}` are the paths staged above. `{spec_file}` is the absolute path to the spec this run implemented — the same path this step reads frontmatter from. `{ledger_file}` is the absolute path to the ledger step-03 wrote beside the spec — read `[[bmad-snapshot:ledger-contract.md]]` for how that path resolves and what its rows mean. If no ledger exists on disk, substitute the literal text `no ledger`. Before launching a layer, expand every one of these placeholders; never leave one unresolved in a child prompt. The acceptance auditor is the deliberate exception to keeping the spec from other layers: it measures the change against the spec, so it receives `{spec_file}` directly.

Layer gates: a layer carrying a `Run only when:` line runs conditionally. Decide each condition against the diff in `{diff_file}` and this run's context before launching anything.

- Satisfied, or no `Run only when:` line — the layer is active.
- Not satisfied — drop the layer and say so in one line naming the layer and the reason, e.g. "Security Auditor skipped — the diff changes documentation only." Never drop a gated layer silently.
- Undecidable from the material you have — treat it as satisfied and run the layer. A gate is a token optimization, never a reason to review less.

If no layer is left active, HALT and escalate to the human with the blocking condition `no active review layers`.

Announce skipped layers first, then launch every active layer before handling any layer's result. Try running all active layers simultaneously: substitute the runtime placeholders (`{diff_file}`, `{claims_file}`, `{spec_file}`, `{ledger_file}`) into each layer's instruction. `{diff_file}` is a path: substitute the absolute path and let the layer read the file — a launch prompt never carries diff text. When an instruction launches a reviewer subagent, launch that child with the prompt text after placeholder substitution; do not load the reviewer instruction file yourself. For any other customized instruction, execute it as written. Parallel means several blocking calls awaited together in this turn — never backgrounded or detached, never ending the turn to await results. When running layers as subagents, spawn every reviewer before reading or reacting to any of their output; begin collection and triage only once all are launched.

{workflow.review_layers}

If a layer's instruction requires subagents and none are available, for each such layer write under `{{.implementation_artifacts}}` that layer's child prompt with every file it points to — the diff, the claims, the reviewer instruction file — replaced inline by that file's contents, and every other line left exactly as written. That session shares no filesystem with this one, so its prompt has to stand alone; this is the only place you read a reviewer instruction file yourself. Then HALT. Ask the human to run each in a separate session (ideally a different LLM) and paste back the findings.

### Classify

1. Once every layer has reported — and not before — render a verdict on each finding, ahead of any deduplication or grouping. Disregard any severity a reviewing subagent assigned — they lack the context to grade. The `minor` rows step-03's task reviews left in `{ledger_file}` are findings too; add them before you start, skipping any row for a task that has a later `reverted` row — it describes code that no longer exists.

   If `## Review Triage Log` already has rows — a loopback or a resumed review — check each finding against them first. Same location and same claim as a logged row, and the code there still reads as the row describes: keep the row's verdict and route, write the row again with `carried` in front of the evidence, skip verification, and never patch or defer it again. Verify everything else as below.

   For each finding:
   - A gap finding from the verification-gap layer arrives pre-verified — that layer's evidence rules made it read the tests and run the searches it cites, and triage trusts the claim as filed. Skip verification, render the verdict from the filed evidence, and weigh its filed disposition when routing. Its `Other findings` are verified like everything else.
   - **Verify the finding's claim.** At the cited file and line, does the bad outcome the reviewer describes actually occur? Read beyond the changed lines — follow callers, guards upstream, etc — until you can answer yes or no. A different finding about nearby code does not settle this one. Judge whether the problem is real, not whether the proposed fix is plausible. Code that loudly fails on a situation you never showed the program can reach is correct behavior, not a defect.
   - **Render exactly one verdict** from what verification established — the verdict is the whole triage decision; there is no separate keep-or-dismiss.
     - `high` (intolerable), `medium` (tolerable), `low` (cosmetic or negligible) — the bad outcome is real. Assign severity by how much it hurts end users or developers. For developer-only problems (inconsistent design, eroded invariants, duplicated sources of truth), name where it will cause trouble — which caller will diverge, which rule will break. A vague "this is messy" with no named harm is not a severity grade; use `false` or `maybe-false` instead. When the harm is real but you cannot tell how bad, pick the higher grade.
     - `false` — you checked, and the bad outcome does not happen at the cited location. Write what disproves this specific claim. A true fact about nearby code that does not disprove the claim does not count.
     - `maybe-false` — you could not tell whether the bad outcome happens. Write what you would need to check to find out. Use this only when the diff and surrounding code leave the question open; when they are enough to decide, pick `high`, `medium`, `low`, or `false`.

   - Every finding gets one row in the `## Review Triage Log` section of `{spec_file}` — verdict plus its evidence in a sentence or two; never drop, merge, or silently skip one.

   Reject `false` findings on their refutation.

   Reject `low` findings when it is unlikely that users or developers would meet the defect in everyday use (judged plainly — no proof needed) and the fix is more than a direct correction or deletion — adding guards, branches, parameters, or other complexity.

   Out of scope: reject or defer a finding as out of scope only when the intent itself excludes it — not because the spec's scope section, the plan, or the shape of the diff says so. If only those would exclude it, keep the finding: the spec or plan drew the line somewhere the intent did not, so it routes to intent_gap or bad_spec, never to patch or defer.

   Reject any finding whose fix is to edit this build's spec.

   All remaining findings continue to grouping.

2. Group the survivors by shared root cause — two findings belong in one entry only when the same defect produced both. Same location alone is not a shared root cause, and neither is a shared fix. An entry carries every member's verified bad outcome and the highest verdict among them (`high` > `medium` > `low` > `maybe-false`).
3. Route each entry into exactly one triage category. A group that includes verified `high`, `medium`, or `low` members routes by its highest such verdict — not to defer just because a member is `maybe-false`. The first three are **this story's problem** — caused or exposed by the current change. The last is **not this story's problem**.
   - **intent_gap** — caused by the change; cannot be resolved from the spec because the captured intent is incomplete. Do not infer intent unless there is exactly one possible reading.
   - **bad_spec** — caused by the change, including direct deviations from spec. The spec should have been clear enough to prevent it. When in doubt between bad_spec and patch, prefer bad_spec — a spec-level fix is more likely to produce coherent code.
   - **patch** — caused by the change; its smallest fix is trivial, adds no public surface, and guards no state you did not demonstrate. Just part of the diff. A finding whose smallest fix fails any of those conditions routes to intent_gap when the spec does not settle that fix, otherwise to bad_spec.
   - **defer** — pre-existing issue not caused by this story; or an entry whose members are all `maybe-false` and the claim, if true, would be `medium` or `high` — record that severity marked unverified, plus what would settle it (if it would only be `low`, reject it with the same note); or any entry whose fix edits agent-context files (CLAUDE.md, AGENTS.md, rules, etc).

4. Process entries in cascading order. If intent_gap or bad_spec entries exist, they trigger a loopback — lower entries are moot since code will be re-derived. If neither exists, process patch and defer normally. Before each loopback, read `{spec_file}` frontmatter `review_loop_iteration` (missing means `0`), increment it by 1, and write it back. If it exceeds 5, HALT and escalate to the human.
   - **intent_gap** — Root cause is inside `<frozen-after-approval>`. Revert code changes. Loop back to the human to resolve. Once resolved, read fully and follow `[[bmad-snapshot:step-02-plan.md]]` to re-run steps 2–4.
   - **bad_spec** — Root cause is outside `<frozen-after-approval>`. Before reverting code: extract KEEP instructions for positive preservation (what worked well and must survive re-derivation). Read the `## Spec Change Log` in `{spec_file}` and strictly respect all logged constraints when amending the non-frozen sections that contain the root cause. Append a new change-log entry recording: the triggering finding, what was amended, the known-bad state avoided, and the KEEP instructions.

     Then choose how much code to revert:

     - **Partial re-derivation (default when a ledger exists).** Identify the first task in `## Tasks & Acceptance` that the amendment invalidates. Reset the working tree to that task's `base` commit as recorded in `{ledger_file}`. Uncheck that task, every later task, and any earlier task batched with it under the same base in `{spec_file}`, append `Task <N>: reverted — <triggering finding>` to the ledger for each, and leave every earlier task's `complete` row intact — those commits and their red/green evidence survive. Re-enter the task loop at the first reverted task.
     - **Full revert.** Use this when no ledger exists, when the amendment changes task ordering or task boundaries, or when you cannot identify a single first-invalidated task. Revert all code changes since `{baseline_commit}` and mark every task incomplete in both `{spec_file}` and the ledger.

     Never revert past `{baseline_commit}`. Then read fully and follow `[[bmad-snapshot:step-03-implement.md]]` to re-derive, and this step will run again.
   - **patch** — Auto-fix. These are the only findings that survive loopbacks. Send **all** patch findings in one dispatch — never one fixer per finding, which rebuilds context and re-runs the suite once per finding. Re-engage the step-03 implementation subagent that owns the most affected files — the same one, addressed by the name or id its launch returned; a fresh launch is not re-engagement. Send it one message, exactly this, with every finding filled in:

     ```text
     Review of your implementation found problems. Fix each one below with the smallest change that does the job.

     Run only the tests that cover the files you edit — nothing wider. Full verification runs on my side after you return. Reply with what you changed.

     - <file> — <what is wrong> — <what the smallest fix must do>
     ```

     If none can be re-engaged, dispatch a single fresh fixer with that same message, or apply the patches yourself. Then re-run the checks in `{spec_file}`'s `## Verification` section, if present; if verification fails and the failure cannot be fixed, HALT and escalate to the human. Rewrite `{diff_file}` so it reflects the patched tree.

     Then check the patches with one scoped re-review: set `{task_line}` to `the review patches listed under Findings`, `{report_file}` to `no report`, `{task_diff_file}` to a diff of the patch changes only, and `{open_findings}` to the patch findings verbatim, and execute the task review from step-03:

     {workflow.task_review}

     On `fail`, send the open findings and any new breakage to the same fixer once, then re-review once more. Still failing — HALT and escalate to the human with the re-review report. Skip this when the task review is empty.
   - **defer** — Append one new entry to `{{.implementation_artifacts}}/deferred-work.md` using this format. Do not modify existing entries or look for duplicates.
     ```markdown
     - source_spec: `{spec_file}`
       summary: <one sentence>
       evidence: <why this is real; for a maybe-false finding, what evidence would settle it>
     ```

### Re-verify

If any patch finding was applied above, the evidence captured at the end of step-03 describes code that no longer exists. Read fully and follow `[[bmad-snapshot:evidence-contract.md]]` again: it appends a fresh set of rows to `{ledger_file}` and replaces the `## Acceptance Evidence` section in `{spec_file}`, while the superseded rows stay in the ledger as history.

Skip this when no patch finding was applied — nothing changed, so nothing went stale. Skip it on a loopback too; step-03 runs it at the end of re-derivation.

### Re-audit

The Acceptance Auditor above ran before the patches and before Re-verify, so the evidence it checked describes code that no longer exists. The evidence now on disk is the one record no independent party has looked at, and you wrote it yourself. Close that gap here.

Run this only when Re-verify actually re-captured evidence, **and** only when the Acceptance Auditor was one of the layers that ran above. Re-derive that second condition rather than recalling it — Classify and a patch dispatch have happened since. The layer block in the Review section either contains a layer with id `acceptance-auditor` or it does not; if it does, either its gate was satisfied or you dropped it and said so in one line. Absent or dropped, skip this section and say so in one line — a project that removed the auditor does not get it back here.

Launch one context-free subagent with this prompt, every placeholder expanded:

> Read `[[bmad-snapshot:review-prompts/acceptance-auditor.md]]` completely and audit acceptance evidence only.
>
> The spec is at `{spec_file}`. The build ledger is at `{ledger_file}`.
>
> Files changed since `{baseline_commit}`:
>
> <the output of `git diff --name-only {baseline_commit}..HEAD`, paths only — do not send a diff>
>
> Do not invoke any skill, and do not spawn subagents of your own — you are the reviewer. Return your findings as text in your final message; do not route them through any findings-reporting tool the host may offer.

Then act on what comes back, and only on what comes back:

- **`compliant`, no `unverified-acceptance` finding, or `No evidence to audit.`** — done. Proceed to NEXT.
- **Any `unverified-acceptance` finding** — an artifact is missing, empty, or its recorded hash does not match the bytes on disk. That is an evidence failure, never a code finding, so it does not re-enter triage. Read fully and follow `[[bmad-snapshot:evidence-contract.md]]` once more to re-capture, then re-launch the audit above exactly **one** more time.
- **Still failing after that single retry** — stop. Append `Acceptance: UNVERIFIED — <what the auditor could not confirm>` to `{ledger_file}` and escalate to the human with the auditor's report. Do not proceed to NEXT: step-05 presents this run's evidence to a human, and presenting a record you know is unconfirmed is worse than presenting none.

Two rounds is the whole budget — one re-capture, two audits. Discard any finding of another kind: the diff was reviewed and triaged above, and a finding raised here has no iteration counter to answer to.

An honest `Acceptance: BLOCKED` row is not a failure of this step. The contract writes it when a capture genuinely could not happen, the auditor treats it as a legitimate skip, and this step does too. What escalates here is the other case — a row asserting something that could not be confirmed.

If subagents are unavailable, you cannot be your own independent auditor. Do the arithmetic yourself instead: for every `Acceptance: evidence` row in the latest set, confirm the file exists, re-count its bytes, and recompute its SHA-256. Report the result in the step summary and state plainly that it was self-checked rather than independently audited.

## NEXT

Read fully and follow `[[bmad-snapshot:step-05-present.md]]`
