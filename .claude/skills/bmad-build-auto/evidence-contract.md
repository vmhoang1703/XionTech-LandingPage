# Acceptance Evidence Contract

Shared sub-step. Called at the end of step-03 once every task is complete, and again by step-04 after patch findings are applied.

A green suite proves the code does what its author thought it did. It does not prove the feature works. A component renders, a route resolves, a handler returns 200 — and the screen is still blank. This step closes that distance by running what the spec said to run, observing what the spec said to observe, and recording both somewhere a later reader can check them.

The rule that governs everything below: **a claim about evidence is not evidence.** The same reasoning that makes step-03 verify an implementer's report against `git diff --stat` applies here, with the controller now the party being checked. Run these checks yourself. Do not delegate them to a subagent that reports back and then record its report as fact.

## Location

`{evidence_dir}` is a sibling of `{spec_file}`: the same directory, the same basename with `.md` replaced by `-evidence`. It follows the spec exactly as the ledger does, so a spec colocated in a story folder keeps its evidence beside it on either route.

Create `{evidence_dir}` only when this run actually writes an artifact into it. Never leave an empty directory behind.

`{ledger_file}` and its row rules come from `[[bmad-snapshot:ledger-contract.md]]`. Read that file if you have not already — this step appends to the same ledger, and the `Acceptance:` rows defined there are the durable record. A project that excludes `*-evidence/` from version control keeps the ledger rows regardless; the artifacts are disposable, the rows are not.

## Scope gate

Answer these in order, before doing anything else.

1. **Is there anything declared to verify?** If `{spec_file}` has no `## Verification` section, stop. The spec template instructs the planner to delete that section when no build, test, lint, or manual check applies, so its absence is a decision rather than an oversight. Append `Acceptance: skipped — no Verification section in spec`, write the spec section with `Nothing.` under every label, and return to the caller.

2. **Is there a CLI half?** Obligation O1 applies when `## Verification` has bullets under `**Commands:**`. It does not apply otherwise.

3. **Is there a user-observable surface?** Obligation O3 applies when either holds:
   - `## Verification` has any bullet under `**Manual checks (if no CLI):**` — the planner already declared something must be looked at.
   - The change touches a file that renders, routes, or styles something a person sees or interacts with: a component, template, page, view, route, stylesheet, markup file, or a handler whose output reaches one of those. Determine what changed from `git diff --name-only {baseline_revision}..HEAD`, reading `{baseline_revision}` from `{spec_file}`'s frontmatter where step-03 captured it. If it is absent or reads `NO_VCS`, use the file paths in the spec's `## Tasks & Acceptance` section instead.

   If neither holds, append `Acceptance: no-surface (<what changed, and why nothing is user-observable>)` and skip O3 only. O1, O2, O4, and O5 still apply. A bare `no-surface` with no reason is not an answer.

## Obligations

These five are the contract. The recipe below is how observation happens; it has no licence to skip any of them.

**O1 — Run the declared commands.** Every bullet under `**Commands:**` runs, verbatim, once, and each produces one `Acceptance: verification` row carrying the command, the exit status you observed, and one line of real output. This is the only whole-artifact run in the workflow: a per-task `green` row proves one test, never the suite. A command you did not run has no row and no substitute. A non-zero exit is reported, never omitted.

**O2 — Perform the declared manual checks.** Every bullet under `**Manual checks (if no CLI):**` produces one `Acceptance: manual` row recording what you actually observed. Record the observation, not a restatement of the prediction: `theme attribute reads "dark" after reload` is an observation; `dark mode works as expected` is a restatement of the bullet you were supposed to check.

**O3 — Capture an artifact for the surface.** When the scope gate opened O3, this run writes at least one file into `{evidence_dir}` showing the feature in the state a person would encounter. Each artifact produces one `Acceptance: evidence` row.

**O4 — Record every row as you observe it.** The ledger is append-only. Rows land when the observation happens, never reconstructed afterwards from memory.

**O5 — Write the spec section.** Always, including on the skipped path. Format below.

If a declared command fails and the failure is real, that is a task failure rather than an evidence failure: fix it through step-03's fix ladder rather than recording a green run; if it cannot be fixed, HALT with status `blocked` and blocking condition `implementation verification failed`, naming the failing command.

## The recipe

Substitute the runtime placeholders — `{spec_file}`, `{ledger_file}`, `{evidence_dir}`, `{baseline_revision}` — into the recipe below, then follow it. Never leave a placeholder unresolved.

{workflow.acceptance_evidence}

**If nothing appears above,** no project capture tool is configured, which is the shipped default. Satisfy the obligations directly:

- Run each `**Commands:**` bullet yourself from the repository root, one invocation each, streaming stdout and stderr into `{evidence_dir}/verification.txt` by redirection. Never build that file with `echo`, a heredoc, or output you are recalling — it is evidence only because a real invocation wrote it.
- Answer each `**Manual checks (if no CLI):**` bullet by the cheapest means that actually observes the state: read the built output, curl the endpoint, run the binary, print the rendered file. Reading the source that is supposed to produce the state is not observing the state.
- If O3 is open, write `{evidence_dir}/observed.md` naming, for each surface, the exact route, screen, command, or endpoint a person would reach; the steps you took to reach it; and what you saw. If you could not reach it, write that instead and name the blocker. A short honest note that the surface was not exercised is worth more than a confident paragraph that it was.

## The evidence gate

An artifact path is a claim until you have checked it. Before writing any `Acceptance: evidence` row:

1. **List `{evidence_dir}` before the recipe runs and again after.** A file that was already there proves nothing about this run and gets no row. Only files this run produced are evidence.
2. **Confirm the file exists and is not empty.** A zero-byte artifact is a failed capture, not a captured artifact. Record the byte count.
3. **Compute a SHA-256 yourself** with whatever tool the shell has, and record the first twelve hex characters. Never copy a hash out of a report, a log, or a subagent's message — the hash is worth recording only because you computed it from the bytes on disk. The acceptance auditor recomputes it independently, and a hash you did not compute will not survive that check.
4. **Confirm the transcript was written by a real invocation.** `{evidence_dir}/verification.txt`, if it exists, must hold the literal output of the commands you ran. Output assembled by hand is prose wearing a filename.

If the recipe reported a capture and the gate finds no new file, the capture failed. Treat it exactly as step-03 treats a success report over an empty diff: it did not happen.

## When evidence cannot be captured

Say so, in a row, with the blocker named. Never manufacture an artifact and never quietly drop the obligation. Append `Acceptance: BLOCKED — <what was not observed and why>`, record whatever you did manage to verify, and name it under `## Auto Run Result` at finalize. This does not halt the workflow — step-04 still runs, and the auditor sees the row.

An honest `BLOCKED` row is a better outcome than a confident row about something nobody looked at. The auditor can act on the first and is deceived by the second.

## Spec section format

Append `## Acceptance Evidence` to `{spec_file}` after the last existing section. On a re-run, **replace the existing section in full** rather than appending a second one: the spec carries current state, the ledger carries history.

Artifact links are relative to `{spec_file}`'s own directory, per the path formatting rule in step-03, so they resolve when the spec is opened in an editor.

```markdown
## Acceptance Evidence

Captured at the end of step-03 on YYYY-MM-DD.

**Commands**

- `COMMAND` -- exit CODE -- ONE_LINE_OF_REAL_OUTPUT

**Observed**

- WHAT_YOU_SAW -- where you saw it

**Artifacts**

- SPEC_BASENAME-evidence/FILE.png -- N bytes -- sha256 TWELVE_HEX -- what it shows

**Not captured**

- WHAT_WAS_NOT_OBSERVED_AND_WHY
```

Every label appears every time. A label with nothing under it reads `Nothing.` — an omitted label is indistinguishable from a forgotten one.

## Overriding the recipe

A project may replace the recipe with anything that observes its own product. Whatever it runs, it still owes the contract every obligation above: the declared commands run, the declared manual checks happen, artifacts land in `{evidence_dir}`, rows are appended, and the spec section is written. An override that captures a beautiful screenshot and never runs the test command has failed this step.

Two rules an override must respect:

- **Write artifacts into `{evidence_dir}`, not into a tool's own scratch directory.** A tool that defaults to its own temporary folder must be pointed at `{evidence_dir}` explicitly, or its output copied there before the gate runs. Recording a path the file is not at is the most common way this step produces a false record.
- **Never leave a question in the path.** A capture tool that asks the human which mode to use, or waits for a browser extension to connect, stalls the run. Pin every choice in the override.

Unlike the review layers, this step may invoke a skill: nothing in step-03 or in this contract forbids it, and the "do not invoke any skill" rule exists only inside reviewer child prompts. Prefer running such a skill inside a subagent so the controller's context stays clean for coordination — then apply the evidence gate to whatever it reports, because a subagent's screenshot claim is still a claim.
