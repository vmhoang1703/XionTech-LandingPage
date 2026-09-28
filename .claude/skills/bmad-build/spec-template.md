---
title: '{title}'
type: 'feature' # feature | bugfix | refactor | chore
created: '{date}'
status: 'draft' # draft | ready-for-dev | in-progress | in-review | done
route: '' # oneshot | dispatch — set by step-02's route gate after design
review_loop_iteration: 0 # incremented by step-04 before each review loopback
context: [] # `{project-root}/`-prefixed paths to project-wide standards/docs every context-free agent on this spec must load. Max 3. Set in step-02; empty only when nothing qualifies.
---

<!-- Target: 900–1300 tokens. Above 1600 = high risk of context rot.
     Never over-specify "how" — use boundaries + examples instead.
     Cohesive cross-layer stories (DB+BE+UI) stay in ONE file.
     IMPORTANT: Remove all HTML comments when filling this template. -->

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

<!-- What is broken or missing, and why it matters. Then the high-level approach — the "what", not the "how". -->

**Problem:** ONE_TO_TWO_SENTENCES

**Approach:** ONE_TO_TWO_SENTENCES

## Boundaries & Constraints

<!-- Two tiers: Always = invariant rules. Never = out of scope + forbidden approaches. -->
<!-- If step-02's route gate reported all facts clean (route: 'oneshot'), DELETE THIS ENTIRE SECTION. -->

**Always:** INVARIANT_RULES

**Never:** NON_GOALS_AND_FORBIDDEN_APPROACHES

## I/O & Edge-Case Matrix

<!-- If no meaningful I/O scenarios exist, DELETE THIS ENTIRE SECTION. Do not write "N/A" or "None". -->

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | INPUT | OUTCOME | N/A |
| ERROR_CASE | INPUT | OUTCOME | ERROR_HANDLING |

</frozen-after-approval>

## Open Questions

<!-- One entry per intent gap: something the request does not say, the code cannot settle,
     and the user would notice in the result. Choices the user would not notice are yours. State the choice, the defensible
     options, and each option's consequence. The spec cannot leave `draft` while any entry
     remains: when the human answers, record the decision inside <frozen-after-approval> and
     delete the entry. When no entries remain, DELETE THIS ENTIRE SECTION. -->

- CHOICE — options: OPTION_A (CONSEQUENCE_A) / OPTION_B (CONSEQUENCE_B)

## Code Map

<!-- Agent-populated during planning. Annotated paths prevent blind codebase searching. -->
<!-- If step-02's route gate reported all facts clean (route: 'oneshot'), DELETE THIS ENTIRE SECTION. -->

- `FILE` -- ROLE_OR_RELEVANCE
- `FILE` -- ROLE_OR_RELEVANCE

## Tasks & Acceptance

<!-- Tasks: backtick-quoted file path -- action -- rationale. Prefer one task per file; group tightly-coupled changes when splitting would be artificial. -->
<!-- Each task is one dispatch unit for step-03. Size them so a reviewer could reject one while approving its neighbor. -->
<!-- Every task that changes behavior carries one `red:` line: the test file, and the behavior that must be
     observed FAILING before that task's implementation exists. Name the behavior, never the test code —
     the token budget above is why. Omit `red:` only for tasks that change no behavior (config, docs, pure renames). -->
<!-- If an I/O Matrix is present, include a task to unit-test its edge cases. -->
<!-- AC covers system-level behaviors not captured by the I/O Matrix. Do not duplicate I/O scenarios here. -->
<!-- If step-02's route gate reported all facts clean (route: 'oneshot'), DELETE THIS ENTIRE SECTION. -->

**Execution:**
- [ ] `FILE` -- ACTION -- RATIONALE
  - red: `TEST_FILE` -- BEHAVIOR_THAT_MUST_FAIL_FIRST

**Acceptance Criteria:**
- Given PRECONDITION, when ACTION, then EXPECTED_RESULT

## Implementation Notes

<!-- Agent-owned. Append-only during implementation: decisions made, files touched, surprises
     encountered. Leave empty at planning time; never delete this section. -->

## Spec Change Log

<!-- Append-only. Populated by step-04 during review loops. Do not modify or delete existing entries.
     Each entry records: what finding triggered the change, what was amended, what known-bad state
     the amendment avoids, and any KEEP instructions (what worked well and must survive re-derivation).
     Empty until the first bad_spec loopback. -->

## Review Triage Log

<!-- Append-only. Populated by step-04 on every review pass: one row per reviewer finding —
     verdict (high/medium/low/false/maybe-false) with its evidence: the refutation for
     false, what would settle it for maybe-false. Empty until the first review pass. -->

## Design Notes

<!-- If the approach is straightforward, DELETE THIS ENTIRE SECTION. Do not write "N/A" or "None". -->
<!-- Design rationale and golden examples only when non-obvious. Keep examples to 5–10 lines. -->

DESIGN_RATIONALE_AND_EXAMPLES

## Verification

<!-- DELETE THIS ENTIRE SECTION only when no build, test, or lint command exists to run at all. Do not write "N/A" or "None". -->
<!-- Never delete it because the tasks' `red:` lines seem to cover testing. Those prove one test each; this is the only whole-suite run in the workflow, and step-03 feeds its output to the Matrix Test Audit. -->
<!-- How the agent confirms its own work. Prefer CLI commands. When no CLI check applies, state what to inspect manually. -->

**Commands:**
- `COMMAND` -- expected: SUCCESS_CRITERIA

**Manual checks (if no CLI):**
- WHAT_TO_INSPECT_AND_EXPECTED_STATE
