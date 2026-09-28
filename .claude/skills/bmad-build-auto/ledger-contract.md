# Ledger Contract

Shared definition of the build ledger. Written by step-03's task loop, read by step-03 on resume and by step-04 during partial re-derivation.

The ledger is what survives context loss. A controller that loses its place mid-spec and has no ledger re-dispatches work that is already committed — the most expensive failure this workflow can have, because the duplicate work looks like progress. After a compaction, trust the ledger and version control over your own recollection of what you did.

## Location

`{ledger_file}` is a sibling of `{spec_file}`: the same directory, the same basename with `.md` replaced by `-progress.md`.

The ledger follows the spec, never a fixed directory. A spec may be colocated inside a spec folder rather than living in the central implementation-artifacts directory, and the sibling rule is correct on both routes.

## Identity

The first line names the spec the ledger belongs to:

```
# Build ledger — spec: <absolute path to spec_file>
```

On resume, read that line first. If it names a different spec, this ledger belongs to other work: leave it untouched and create your own. Never merge two ledgers.

## Rows

Append-only. Never rewrite, reorder, or delete a row — a superseding row is how the record changes. One row per event.

Task rows begin with `Task <N>:` where `<N>` is the task's 1-based position in `## Tasks & Acceptance`. Acceptance-evidence rows begin with `Acceptance:` and carry no task number: they describe the finished spec rather than one task. They are written at the end of step-03 once every task is complete, and again by step-04 after patch findings are applied.

| Row | Written when |
|---|---|
| `Task <N>: dispatched (model <model>, base <sha7>, report <path>)` | immediately before dispatching an implementer; batched tasks each get one, sharing the base |
| `Task <N>: red — <command> — <one-line failing output>` | the task's `red:` test was run and observed failing |
| `Task <N>: green — <command> — <one-line passing output>` | the same test passes after implementation |
| `Task <N>: no-red (<reason>)` | the task carries no `red:` line because it changes no behavior |
| `Task <N>: review — <pass or fail> — <counts; open findings on a re-review>` | a task review or scoped re-review returned |
| `Task <N>: minor — <finding with file:line>` | a task review raised a Minor finding; step-04 triages it |
| `Task <N>: complete (commits <base7>..<head7>, diff verified)` | the evidence gate and task review passed and the task is done |
| `Task <N>: fix round <R>/5 (<summary>)` | one fix round finished |
| `Task <N>: parked — <finding> — ruling: <why the code stands>` | adjudicated at the fix cap |
| `Task <N>: reverted — <reason>` | step-04 rolled this task back |
| `Task <N>: BLOCKED — <reason>` | the run halted `blocked` on this task |
| `Acceptance: verification — <command> — exit <code> — <one-line output>` | a `## Verification` command was run |
| `Acceptance: manual — <check> — observed: <what was actually seen>` | a `## Verification` manual check was inspected |
| `Acceptance: evidence — <path relative to the ledger> — <N> bytes — sha256 <first 12 hex> — <what it shows>` | an artifact was captured and hashed by the controller |
| `Acceptance: no-surface (<what changed, why nothing is user-observable>)` | the change has no user-observable surface to capture |
| `Acceptance: skipped — <reason>` | the scope gate did not open |
| `Acceptance: BLOCKED — <what was not observed and why>` | evidence could not be captured |
| `Acceptance: UNVERIFIED — <what the auditor could not confirm>` | step-04's evidence re-audit failed twice; the run halted `blocked` |

## Reading the ledger

- A task whose latest row is `complete` is **done**. Never re-dispatch it.
- A task whose latest row is `reverted` or `BLOCKED` is **not** done, whatever earlier rows say.
- A task whose latest row is `dispatched`, `red`, `green`, `review`, `minor`, or `fix round` was interrupted mid-flight: verify against version control what actually landed, then resume that task rather than starting the next one.
- A task with a `green` row and no preceding `red` or `no-red` row is a **test-first violation**. Do not treat it as evidence of a working test.
- `Acceptance:` rows never affect whether a task is done. A task's state is decided by its own `Task <N>:` rows alone.
- The latest set of `Acceptance:` rows describes the current code. Earlier sets survive from before a revert or a patch round and describe code that no longer exists; read them as history, never as current state.
- An `Acceptance: evidence` row is a claim about a file. Either the file exists with the recorded byte count and hash, or the row is false. Recompute rather than trust.
- A spec whose tasks are all `complete` with no `Acceptance:` rows at all means the evidence step never ran. That is a gap in the record, not proof there was nothing to check.
- `Acceptance: BLOCKED` and `Acceptance: UNVERIFIED` are opposites, not neighbours. `BLOCKED` is an honest report that something was not observed, and it is a legitimate outcome. `UNVERIFIED` means something **was** claimed and an independent auditor could not confirm it. Treat every `Acceptance:` row in the set above an `UNVERIFIED` row as unreliable, whatever it asserts.
