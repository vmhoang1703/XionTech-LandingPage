# Assertion contracts — handle, exact value, semantic

Load this before asserting anything about text a remote agent authors, and
whenever a red flow's failure looks like "the app said the right thing in
different words".

AD-26 defines three contracts. **The flow declares which one it is asserting.**
Nothing infers it, least of all after a failure — that inference is the thing
the rule exists to forbid, because semantic equivalence alone cannot tell you
whether the AC wanted the meaning or the string.

| contract | use it for | who decides PASS/FAIL |
| --- | --- | --- |
| **handle** | component existence and type, fields, ordering, navigation, deterministic values, every hand-off envelope | Maestro |
| **exact value** | an AC that explicitly requires a particular user-visible value or wording | Maestro |
| **semantic** | an AC that defines intent rather than wording, answered by a dynamic agent | an LLM, for the one assertion that declared it |

## 1. Handle — the default, and most ACs

```yaml
- assertVisible:
    id: "tt-children"
    label: "AC3: a request naming no child produces the child selector"
```

Invariant across language, text direction, screen size and prompt edits. Choose
it by inspecting the running app before the first flow is written, not after one
fails. This is the required contract wherever it can express the AC.

**Its limit is why the other two exist.** `tt-children` passes whether the agent
asked which child or answered something unrelated — it proves the widget
rendered and nothing about what was said. Do not reach for a handle to make a
wording problem go away; you get a greener suite that checks less.

## 2. Exact value — the AC names the string

```yaml
- assertVisible:
    text: "${APPROVED_LABEL}"
    label: "AC4: the decision reads exactly Approved"
```

Where the AC requires particular copy, the literal assertion **is** the
acceptance contract. A red stays red even when the replacement means the same
thing — the AC asked for the string.

An LLM may diagnose such a failure (`exact_text_mismatch`, or
`same_semantic_different_wording` when the meaning did survive). That diagnosis
explains the red. It never converts it.

## 3. Semantic — the AC names the intent

The agent's replies are generated, so their wording moves without anything in
this repo changing:

```
expected:  Which of your children would you like information about?
got:       Which child would you like to see information for?
```

Same behaviour, red flow. Where the AC is about intent rather than copy, declare
the contract on the assertion:

```yaml
- assertVisible:
    text: "${CAPTURE_SENTINEL}"   # never matches -- see "Declaring one" below
    optional: true
    label: "semantic: the agent asks which child to see information for"
```

The `semantic:` tail is the contract, in your words: what the reply must convey,
and the LLM judges the observed text against it.

**The selector is a sentinel that cannot match, not the sentence you expect.**
Reaching for the real literal here is the intuitive move and it is wrong: on any
run where it matches, the step PASSES, Maestro captures no `SCREEN_HIERARCHY`,
and the contract is dropped for having nothing to judge — a plain green over an
unevaluated AC. "Declaring one" below has the mechanics.

**This is the only place an LLM produces an acceptance verdict**, and only
because the flow said so before the run.

### Judging one

```bash
./.maestro/explain-red.py                          # evidence for every red
./.maestro/explain-red.py --evaluate verdicts.json # verdicts for declared contracts
./.maestro/collect-evidence.py                     # PASS (semantic) where met
```

It meets the contract if a parent reading the observed text learns what the
intent says they should. A different scope, a different subject, a hedge where
the intent promised an answer, an error or a fallback message: it does not.
Absent text never does.

What you judge is the **`SCREEN_HIERARCHY`** Maestro attaches to the capture
step, distilled by `explain-red.py` to the strings the app rendered — `text` and
`accessibilityText`, app subtree only, in tree order. Maestro pairs a
`SCREENSHOT` with it on the same step; that `.png` is for a human, is not the
semantic input, and nothing reads it.

Judge the text list, and treat what is not in it as not on screen. A capture
holds what was rendered at that instant, and a later turn can scroll a reply out
of the viewport, overwrite its wording in place, or unmount it entirely.

### What a semantic verdict cannot do

- **It cannot outlive its run.** Verdicts are written into the run directory and
  name the run they belong to. A copy dropped into another run is ignored, so
  nothing carries forward and no stale accept can rescue a later red. Re-running
  means re-evaluating, deliberately.
- **It cannot answer an undeclared contract.** Only a step whose `label:` opts in
  before the run is eligible.
- **It cannot rescue anything but its own step.** One unrescued failure keeps the
  whole flow red, and the reported failure names that step, not the contract that
  passed.
- **It cannot rescue an absence.** A step whose element never rendered has no
  text to judge and is not eligible at all.
- **It is never a plain green.** `EVIDENCE.md` reads `PASS (semantic)` and names
  the declared intent.

`assertWithAI` as Maestro ships it stays barred: it evaluates every assertion
regardless of declared type, which is the undeclared version of this and gives
back exactly the inference AD-26 forbids.

## Declaring one: the capture step

**A semantic contract must be captured by a step that does NOT pass.** Get this
wrong and the flow reports a plain green while the AC goes unjudged — the exact
failure the mechanism exists to prevent.

Maestro records a `SCREEN_HIERARCHY` for a step that fails or warns, and none
for one that passes. `explain-red.py`'s `contracts()` needs it: it skips
a declared contract with no observed text, because there is nothing to judge. So
an ordinary `assertVisible` carrying a `semantic:` label, on a run where the
literal happens to match, leaves no evidence, drops out of the declared set, and
is silently never evaluated.

Use a sentinel that can never match, with `optional: true`:

```yaml
env:
  # Matches nothing, ever. Its only job is to make the step not-pass so Maestro
  # records the screen. It is not a requirement and not copy.
  CAPTURE_SENTINEL: "__pxp_<name>_probe__"
---
- assertVisible:
    text: "${CAPTURE_SENTINEL}"
    optional: true
    label: "semantic: <what the reply must convey, in your words>"
```

`optional: true` means the step never fails, so it cannot red the flow by
itself; never matching means it never passes, so the `SCREEN_HIERARCHY` is
captured on EVERY run rather than only on runs where something else broke. The
status reads WARNED, which is what `contracts()` looks for.

Put the deterministic precondition ABOVE it as a handle — that the widget
answered at all — so a red there is a rendering failure, not a wording one.

`collect-evidence.py` **gates** on this. Two states, both non-zero, and they are
fixed in different places — confusing them wastes a device run:

| state | means | fix |
| --- | --- | --- |
| `NEEDS-CAPTURE` | the step carries a `semantic:` label but captured no `SCREEN_HIERARCHY` | the **flow** — add the sentinel and `optional: true`, then re-run. `--evaluate` refuses a verdict; there is nothing to judge |
| `NEEDS-EVAL` | captured, but no verdict recorded for this run | the **verdict** — judge it with `--evaluate`. Verdicts never carry across runs, so every run needs its own |

Neither is a pass, and a flow sitting at either CAN be green in Maestro — which
is the point: Maestro does not decide a declared contract. It is not always
green, though. A flow that also failed a literal is reported as that failure
first; the semantic state is not lost, because a red flow already fails the
harvest.

## The synonym-regex antipattern

If you are enumerating wordings over prose a remote agent generated:

```yaml
- assertVisible:
    text: ".*(([Rr]eturned date|due date)[^.]*(kept|unchanged|still appl|remains|preserved)).*"
    label: "ACn: the reply states that the date range is kept"
```

you have written a semantic contract in regex costume. It fails on the first
rewording that still satisfies the AC, and passes on a sentence that contains
the words while meaning something else. **An alternation of synonyms is the
signal**: declare the contract instead and let the judge read the intent.

The exception is contract 2 — where the AC named the string. Then the literal is
the requirement and there is nothing to enumerate.

## One AC can be two contracts — split it

Read each clause separately. Deterministic state stays a handle even when it
sits in the same sentence as an intent clause. The pattern to watch for is a
conjunction: *"do X **and** keep/return/show Y"*, where X is about what the
agent conveys and Y is about what the UI holds.

| clause | contract | assert |
| --- | --- | --- |
| the intent half — guide, explain, offer, acknowledge | **semantic** | declared contract on a capture step |
| the state half — a value retained, a control populated, a component present | **handle** | the control itself, by id |

Asserting the state half through the reply text — that the agent *said* the
value was kept — tests the wrong thing with the weaker instrument. The agent can
say it while the UI dropped it, and the UI can hold it while the agent never
mentions it. Two clauses, two assertions, and a red in one should not be
readable as the other.

## Choosing which contract an AC is

Classified before authoring, clause by clause, against the four outcomes in
[`authoring-rules.md`](authoring-rules.md#before-the-rules-classify-the-storys-acs)
— that table is the canonical guidance and is not repeated here.

Read the AC, not the failure. If it is ambiguous, that is a question for the BA,
not something to settle by looking at what the agent happened to say.

## Diagnosis is separate, and always allowed

Any red may be explained, whatever its contract:

`same_semantic_different_wording` · `different_semantic_wrong_intent` ·
`unrelated_response` · `exact_text_mismatch` · `missing_or_not_rendered` ·
`wrong_language` · `other`

An explanation is not a verdict. A red that has been explained is still a red
unless its assertion declared a semantic contract and an LLM judged that
contract met for that run. Persist the explanation in the story's `COVERAGE.md`
(`explain-red.py --write`), which is the committed human record; `EVIDENCE.md` is
regenerated every collection and stays factual.
