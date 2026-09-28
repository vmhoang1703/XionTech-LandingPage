# Authoring rules — every Maestro flow in this suite

Story flows and smoke flows both. Load this before writing or editing any flow.

Source of truth is `pxp_mobile/.maestro/README.md`; this is the checklist form of
it. Where the two disagree, the README wins — and fix this file.

Every rule below cost someone a debugging session. Most describe a **silent**
failure: the flow goes green while proving nothing, or it fails somewhere that
does not point at the cause.

---

## Before the rules: classify the story's ACs

Do this on paper, before the first flow. Read each AC **clause by clause** — one
AC is often two contracts — and give every clause one of four outcomes:

| outcome | the question that decides it | what you write |
| --- | --- | --- |
| **handle** | is there a stable identifier, invariant across language and prompt edits, that settles this? | a normal assertion on that id |
| **exact value** | does the AC name the string it wants? | the literal assertion IS the contract |
| **semantic** | does the AC name an intent whose wording the agent generates? | a declared contract on a capture step |
| **not device-observable** | can any flow SEE the thing this clause is about? | no flow — record it uncovered in `COVERAGE.md`, with the reason |

**The fourth outcome is the one that saves a device run.** Not every AC reduces
to something a flow can assert, and finding that out on the handset costs a
build, an install and a run. Five shapes recur:

- **The actor is not the app.** "BE must validate…", "the service must reject…",
  "the agent must classify…". A flow can sometimes see a downstream effect, but
  that is a different assertion about a different thing — say so rather than
  quietly testing the effect and calling the AC covered.
- **The assertion needs data the flow cannot read.** Anything of the form "must
  match the list/value returned by X". The flow sees what rendered, not what X
  returned, so it cannot decide equality. It can assert shape, or one known
  member, and that is weaker — record which.
- **The state is not in the accessibility tree.** Selection, focus, enablement,
  ordering and styling reach the tree only if the app puts them there. Remote-
  authored UI often renders them as inert text. **Check in Maestro Studio before
  assuming either way** — this is the one outcome that must be verified rather
  than reasoned about, and it is cheap to check.
- **The clause is negative with no positive.** "must not …" alone goes green on
  a blank screen (rule 6). If nothing observable pairs with it, it is not
  coverage.
- **The state cannot be produced.** A clause about what happens in an invalid
  state, where the UI cannot be driven into that state — a control that only
  accepts valid input, a combination the widget refuses to render. The state
  would be visible if it occurred; it cannot occur. Distinct from the previous
  shape, and the difference decides the fix: state that is missing from the tree
  becomes observable if the app adds a handle, state that cannot be produced
  needs the control changed instead. Say which, so nobody re-litigates it.

Notice that the fourth and fifth shapes are opposite failures — invisible state
that exists, and visible state that never arrives — and both read as "the flow
just goes green" if you only look at the run.

**Flag data dependencies in the same pass.** Any clause whose flow will pin a
live value from the environment — a person's name, a code, a title — goes into
`COVERAGE.md`'s "Data this suite depends on". Those change without warning and
fail as selector errors that read like app bugs.

**Then ask, of every clause you did NOT rule out: can its precondition be
produced?** Contract type says what to assert; this says whether you can get the
app into the state where you would assert it. Four answers, and they set the
authoring order — not the AC numbering:

| answer | example shape | do |
| --- | --- | --- |
| **producible now** | any input the flow can send on its own | author it first |
| **forced by construction** | the ABSENCE case — no match, not found, unavailable, empty | author it first; it needs nothing from the environment |
| **needs data we do not control** | a case requiring particular records to EXIST in the environment | check the data before authoring, and record the dependency |
| **unknown** | a path that depends on how a remote behaves | **probe first** — one utterance and a hierarchy read is cheaper than a flow that cannot reach its own assertion |

Skipping this is how an easy clause ends up unauthored while an unreachable one
gets a flow: they look identical in a classification table, and only this
question separates them. A shortcut worth using — an analogous clause already
covered in a sibling story is proof that path is reachable.

### Absence is not a data dependency

The two middle answers are the ones that get confused, always in the same
direction: a clause about search results reads like it needs records to exist,
so it lands in "needs data we do not control" and goes unauthored.

**Asserting something about a non-empty result needs data. Forcing an empty one
never does.** Invent an input that cannot match — an assignment name nobody has,
a class nobody teaches — and the absence case is produced deterministically,
whatever the environment holds. No fixture, no UAT lookup, no premise that can
flip overnight.

So a "if none are found…", "if unavailable…", "when there is no…" clause is
**forced by construction** unless something else blocks it. Ask which of the two
you actually have:

| the clause is about | reachability |
| --- | --- |
| what is returned, or a property of the matches | needs data we do not control |
| what happens when NOTHING is returned | forced by construction |

Watch this in the other direction too: a flow already pinned to a real value
(`PE`, a child's name, a real assignment title) to reach an ABSENCE case is
carrying a data dependency it does not need, and it reds for the wrong reason the
day that value changes. Invent the input instead and the dependency is gone.

The genuine exception is a **near**-miss: "similar names must not be treated as
typo corrections" needs two similar names to exist, and that premise cannot be
invented — a name nobody has produces no match, not a near-match. That is the
real "needs data we do not control", and it is a much smaller category than it
first looks.

### Classify each clause from scratch

Ruling a clause out contaminates the next one. Having decided that two clauses of
an AC are unobservable, the third arrives pre-judged — "this AC is about things
the device cannot see" — and gets ruled out on the strength of its neighbours
rather than on its own shape.

It happens because the correct calls are correct: an AC whose first clauses are
equality claims against what a service returned really is unobservable there.
The next clause can still be an ordinary semantic-plus-handle pair.

**Reset between clauses.** The unit of classification is the clause, not the AC,
and an AC with two ruled-out clauses is where to slow down, not speed up. A whole
AC landing in one outcome is a signal to re-read it, not a tidy result.

Write the classification, and the reachability answer, into the story's
`COVERAGE.md` before authoring. It is the artefact that says why an AC has no
flow, which is the difference between *uncovered and known* and *forgotten*.

### The CLASSIFICATION block

Write it between `<!-- CLASSIFICATION:START -->` and `<!-- CLASSIFICATION:END -->`,
six columns, and run `scripts/clause_queue.py <story dir>` — it prints the work
queue and fails on anything unrecorded. Unlike the TRACEABILITY block below it,
this one is **hand-written**; the script only reads it.

| column | what goes in it |
| --- | --- |
| `ac` | the AC id **from `acs.json`** — `AC1`, `AC7`. Checked by set membership |
| `clause` | what this clause of the AC requires, in your words. Prose, not an id |
| `contract` | `handle` · `exact-value` · `semantic` · `not-observable` |
| `reachability` | `producible` · `forced-by-construction` · `needs-data` · `unknown` · `n/a` |
| `flow` | flow stems, or `—` |
| `note` | why; **required** for `not-observable` and for `needs-data` |

**Nothing is parsed out of prose, and the clause has no id.** Acceptance criteria
reach this repo as free-form markdown a BA writes however they like: headings
glued onto the end of the previous paragraph (#23959's own AC6 and AC8), clauses
numbered or not, "Acceptance Criteria" spelled however it was typed. So the AC
identity comes from `acs.json` — which `ado-sprint-to-bmad` builds from ADO's own
fields — and everything else stays prose for a reader to judge.

An earlier version of this block gave each clause a synthetic id (`AC8.2a`) and
recovered the AC by string-splitting it. That invented clause numbers ADO does
not have, disagreed with itself about whether `AC8a` was legal, and produced a
gate that failed on correctly classified work. The `ac` column replaces all of
it: structure from the pipeline, judgement from the model, no parser in between.

**One contract per row.** A compound cell — `handle (the count) + not observable
(set correctness)` — hides the authorable half behind the unobservable one, and
the row reads as ruled out. #23959's AC8 sat that way while a clause needing no
data at all went unwritten. Give each half its own row; two rows of one AC are
normal, and the script only objects when two describe the *same* clause.

The reasoning behind this shape — and the rule for anyone extending the skill's
scripts — is in
[`judgement-boundaries.md`](judgement-boundaries.md).

The script also cross-checks `acs.json` against the sprint's `testcases.tsv`,
which is what `collect-evidence.py` builds the committed traceability from. A
disagreement is reported, not fatal — but it means those two artefacts describe
different stories, which has happened here before.

---

## The thirteen rules

1. **Tag the ADO id quoted** — `- "23960"`, never `- 23960`. YAML reads the bare
   form as an integer and `--include-tags "23960"` will not match it. Smoke flows
   carry `smoke` + `shared` + language instead.

2. **Declare the whole `env` block in the flow.** A leg *reads* env and defines
   none — which is why no leg can be run directly. Copy an existing flow's block:
   it is the inventory of translated strings the legs need. The one exception is
   `ensure-language.yaml`, which carries both languages' nav strings as literals.

3. **Set `TARGET_LANG` and never switch language by hand.** `open-app` normalises
   on every cold start. Language is *persisted* state that `stopApp: true` does
   not reset, and Maestro has no teardown — so a flow that switches for itself
   and then fails strands the handset for everything after it. One such run turned
   three green flows red with nothing in the failures pointing at language.

4. **`takeScreenshot: evidence/<case>` immediately BEFORE every assertion block.**
   A screenshot below a failing assertion never runs, so there is no frame on
   precisely the run where one was needed. **`extendedWaitUntil` counts as an
   assertion for this rule** and is the easy one to miss — it reads as a wait, so
   a screenshot lands naturally below it. `smoke/shared-set-language.yaml` shipped
   with that mistake. A passing run leaves no PNG at all without `takeScreenshot`.

5. **Never assert on words your own flow just typed.** The transcript echoes the
   utterance, so the assertion passes on the echo rather than the reply — the
   strongest available false positive, because the flow is doing exactly what it
   looks like it is doing. Caught three times on #23960 before any run.

   ```yaml
   # WRONG -- "last week" is in the utterance this flow sent two steps earlier
   - assertVisible: ".*[Ll]ast week.*"
   # RIGHT -- a mark only the agent's reply can contain
   - assertVisible: "65.0/100"
   ```

   If an AC's subject genuinely cannot be distinguished from the echo yet, leave
   the assertion out and say so in `COVERAGE.md`. **A missing assertion is
   visible; a self-matching one is not.**

6. **Never `assertNotVisible` alone.** It goes green on a blank screen, a crashed
   app, or a renamed string. Pair every negative with a positive assertion that
   the right thing *is* on screen.

7. **Never guard on an icon button's label.** Carbon routes `IconButton`'s `label`
   and `HeaderGlobalAction`'s `aria-label` into a tooltip element, so Send, Voice,
   New Chat and Notifications all expose `desc=''` on device. A `when: visible:
   "New Chat"` guard can never match, the guarded commands are skipped forever,
   and the failure surfaces one leg later pointing at the wrong file. Guard on
   screen text. Before trusting any icon-button selector, check
   `~/.maestro/tests/<timestamp>/.../screen-hierarchy/*.json` — `desc=''` means no
   text selector will ever find it.

8. **Point taps mirror per component, not globally.** Drive the point off
   `TARGET_LANG` where the container mirrors. Both directions fail silently: a
   hardcoded LTR point in an RTL app taps the text field instead of Send, or
   Cancel instead of Apply, and the flow dies later on an unrelated-looking
   assertion.

   | Control | Container | Mirrors? | LTR | RTL |
   |---|---|---|---|---|
   | Apply / Cancel | language modal header | **yes** | `90%,9%` | `10%,9%` |
   | Send / Voice | chat composer | **yes** | `90%,95%` | `10%,95%` |
   | New Chat, notifications | app header | **no** | `92%,8%` | `92%,8%` |
   | Settings back arrow | app header | **no** | `8%,7%` | `8%,7%` |

   ```yaml
   - tapOn:
       point: "${TARGET_LANG == 'ar' ? '10%,95%' : '90%,95%'}"
   ```

   Adding a point tap means testing it in **both** languages before trusting it.

9. **`label:` on every assertion.** It is what `collect-evidence.py` prints in the
   "Failed at" column, and what someone reads six months on instead of a bare
   regex.

10. **The header comment states what a green does NOT prove.** Not decoration —
    whoever reads a failure reads it first. `ac3-child-selection-en.yaml` is the
    model: it proves the selector appears and a confirmation posts, and says
    plainly it cannot prove the widget is #16892's component, because the markup
    arrives as remote HTML and nothing in the accessibility tree names its
    provenance.

11. **Declare which contract an assertion is.** AD-26 defines three, and the
    flow says which — nothing infers it, least of all after a failure.

    - **handle** — component existence and type, fields, ordering, navigation,
      deterministic values, hand-off envelopes. Maestro decides. This is the
      default and covers most ACs.
    - **exact value** — the AC explicitly requires particular copy. Maestro
      decides, and a red stays red even when the replacement means the same
      thing: the AC asked for the string.
    - **semantic** — the AC defines intent, answered by a dynamic agent. Declare
      it with a `semantic:` label and an LLM judges the observed text against
      that intent. This is the only assertion an LLM can pass.

    ```yaml
    - assertVisible:
        id: "tt-children"                       # handle: Maestro decides
        label: "AC3: a request naming no child produces the selector"

    - assertVisible:
        text: "${CHILD_PROMPT}"                 # semantic: declared contract
        label: "semantic: the agent asks which child to see information for"
    ```

    The `semantic:` tail states what the reply must convey, in your words. It is
    a DECLARATION, not a hint: it is what makes the assertion eligible for an
    LLM verdict, and it must be written before the run.

    **A handle is not a substitute for a semantic contract.** `tt-children`
    passes whether the agent asked which child or answered something unrelated —
    reaching for a handle to make a wording problem go away buys a greener suite
    that checks less. Where an AC is about what the agent SAID, say so.

    Do not declare `semantic:` on a prompt title, a nav label, a mark, a date or
    anything `assert-not-fallback` touches. Those are ours or are data; their
    contract is exact value, and mislabelling one makes a real regression
    eligible to be passed by judgement.

    **Capture it with a never-matching sentinel plus `optional: true`.** An
    ordinary assertion that PASSES leaves no `SCREEN_HIERARCHY`, so the contract
    has nothing to judge, drops out of the declared set, and is silently never
    evaluated. `collect-evidence.py` gates on it, with two states that are fixed
    in different places: `NEEDS-CAPTURE` (the step captured no
    `SCREEN_HIERARCHY` — fix the FLOW, no verdict can clear it) and `NEEDS-EVAL`
    (captured but unjudged — record a verdict). Both exit non-zero, and a flow
    sitting at either can be green in Maestro. See `semantic-assertions.md`,
    "Declaring one".

    A semantic verdict is scoped to one run, rescues only its own step, cannot
    rescue an element that never rendered, and never prints as a plain green.
    Full model: [`semantic-assertions.md`](semantic-assertions.md).

12. **A failed AC is not an unmet AC until you have scrolled.** This is a rule
    about *verdicts*, not about authoring. Before you write "not met" in
    `COVERAGE.md`, raise a defect, or tell anyone the feature is missing:
    **scroll to the thing the AC names and look again.**

    An element below the fold is **absent from the accessibility tree entirely**,
    so `assertVisible` fails with wording identical to the element not existing,
    and the hierarchy dump agrees with it. A red flow is a question, not an
    answer.

    The checklist, in order, when an AC goes red:

    1. **Open the failure screenshot** —
       `~/.maestro/tests/<timestamp>/<flow>/screenshots/`. Do this *first*, before
       forming any theory. It is the only artifact that distinguishes the causes
       below, and they look identical in the log.
    2. **Is the container scrolled to the bottom?** A clipped tile or a scrollbar
       means the element may be below the fold - add `scrollUntilVisible` and
       re-run before judging the AC.
    3. **Is the app even in the foreground?** A system dialog backgrounds it and
       every app-text assertion then fails.
    4. **Does the element have an accessible name?** `desc=''` means no text
       selector will ever match it (rule 7).
    5. Only when all four are excluded is the AC genuinely unmet.

    Three causes, one error message:

    | Cause | Fix | Seen |
    |---|---|---|
    | below the fold | `scrollUntilVisible` | #13284/#23957 AC1 (prompt tiles 9-10), both AC6 (sentence under a tall card) |
    | system dialog stole the foreground | keep the phone **off the charger**; dismiss pending updates | 2026-08-27, Samsung "Update ready to install" mid-run |
    | no accessible name | tap/assert by point or id (rule 7) | Carbon icon buttons |

    ```yaml
    - scrollUntilVisible:
        element:
          text: "${PROMPT_TITLE}"
        direction: DOWN
        timeout: 20000
    - assertVisible: "${PROMPT_TITLE}"      # keep it -- names the element
    ```

    `scrollUntilVisible`, never a fixed count of `scroll`: list length is data and
    changes without a commit. It is a no-op when the element is already visible,
    so it costs nothing to add once you know an AC's target can sit off-screen.

    **Why this is a rule and not a tip.** On 2026-08-27 AC1 went red in both
    stories and was reported as *"the environment is serving a stale
    `topics.json` - the prompts were never deployed."* That was wrong, and it
    would have sent someone chasing an infrastructure problem that did not exist.
    The reasoning was that the dump's last node sat at `y=2247` on a 2400px
    screen, so the list looked complete with room to spare. **The dump stops
    where rendering stops.** The screenshot sitting beside it showed the grid
    clipped mid-tile with a scrollbar; the prompts were tiles 9 and 10; the config
    had been correct since PR 4770 merged on 2026-08-21. One scroll turned six
    red flows green across three stories.

    Absence in the tree is not absence in the app.

13. **`- startRecording: <flow basename>` is the FIRST command of every flow, and
    there is no `stopRecording`.** First, because `open-app` is where the
    confusing failures live — a cold start, a sign-in check and a language
    normalisation all happen inside it. No `stopRecording`, because Maestro
    closes the recording when the flow ends however it ended, while a
    `stopRecording` written last is the one command that never runs on a flow
    that failed — the exact case worth watching. The `.mp4` lands in
    `startRecording/` and `collect-evidence.py` harvests it; a `—` in
    `EVIDENCE.md`'s Video column means the flow is missing this command. The
    video is the most disclosing artifact this suite makes — the whole session,
    every name and mark scrolled past — so it stays under gitignored
    `evidence/` and never goes on a work item or a PR.

    **A `—` in the Video column is not always a missing command.** Verified
    2026-09-03 on a Galaxy handset: when the device's H.264 encoder refuses a
    session, `Maestro.close` throws `Encoder failed (err=-38)` and Maestro
    never clears its recording handle, so every LATER flow in the same process
    logs `Screen recording not started: Already in progress` and writes a
    0-byte file — 38 of 40 flows in the run that found it. Worse, the
    exception is thrown AFTER the flow body finishes, so a fully green flow is
    reported `[Failed]`.

    `run.sh` contains the fix and you inherit it for free: one flow per
    `maestro test` process, the verdict read from `commands.json` rather than
    the exit code, and one retry when the `.mp4` is missing. Do not "simplify"
    that loop back into a single `maestro test .maestro` — the failure it
    prevents is silent in the artifacts and loud in the wrong place, as a red
    flow that never failed. `collect-evidence.py` drops 0-byte files rather
    than naming a video that plays nothing.

## Paths

| Flow lives in | Subflow path |
|---|---|
| `sprints/<sprint>/<story>/` | `../../../shared/` |
| `smoke/` | `../shared/` |

Anything a second story would also want belongs in `shared/`, parameterised
through env — never copied.

## Running

Always through `run.sh`. It exports `MAESTRO_DRIVER_STARTUP_TIMEOUT=240000` and
passes `--no-reinstall-driver`; invoking `maestro` directly hangs on this setup.

```bash
./.maestro/run.sh --include-tags "23960"     # one story, opt-in flows included
./.maestro/run.sh --include-tags smoke       # the shared legs
maestro check-syntax <file>                  # parse check, no device
```

`--include-tags` drops the opt-in exclusion **only when you name an opt-in
family** (`run.sh:293-315`). `--include-tags "23959"` runs that story's ordinary
flows and silently leaves its `remote-defect` ones out — verified 2026-09-09,
when a 13-flow story reported "10 passed, 0 failed" and the three red-by-design
flows had never executed. This used to drop for any tag at all, until an
ordinary `--include-tags ar` started sweeping in every opt-in flow carrying
`ar`. To run a red-by-design flow, pass its path:

```bash
./.maestro/run.sh .maestro/sprints/<sprint>/<story>/<flow>.yaml
```

A clean story run is therefore NOT proof the opt-in flows still behave —
their absence looks identical to their passing in the summary line.

- **Silence for minutes at the start is the driver APK push**, not a hang.
  Confirm with `jstack <maestro pid> | grep installMaestroServerApp` and wait.
  Only expected on the first run after a Maestro install, or `REINSTALL_DRIVER=1`.
- **Never `kill -9` mid-reinstall** — it leaves the driver packages half-removed
  and every later run hangs. Recovery is `REINSTALL_DRIVER=1`.
- **Never `adb shell uiautomator dump` while Maestro runs.** Android registers one
  UiAutomation client; stealing it kills the driver *and* the app under test. Use
  `maestro hierarchy`.
- **Every utterance is live backend traffic** — a real message from the signed-in
  account and a real LLM round trip, ~20s each. #23960's AC2 is 21 utterances,
  about seven minutes. Test parent account only.

**One green is not a result.** Repeat a story two to four times before calling
anything covered. #23960's typo flow passed two runs in four with no
configuration difference, which is what exposed the unstable results card.

## Opt-in tag families

An AC the app does not satisfy still gets a flow — one asserting what the AC
*requires*, red today and green by itself the day it ships.

| Tag | Means |
|---|---|
| `remote-defect` | the requirement asserted against a remote agent that does not do it yet |
| `env-unconfigured` | passes only where the backing service is *not* wired |
| `blocked-until-remote` | asserts the AC is still blocked on a remote agent |
| `smoke` | shared-leg flows; opt-in for cost, not correctness |

A new family goes in `run.sh`'s `OPT_IN_TAGS`, **never** `config.yaml` — an
`excludeTags` entry there beats `--include-tags` on the command line and makes
the family permanently unrunnable. That is why `env-unconfigured` and
`blocked-until-remote` had never once been executed.

Do not delete a red-by-design flow and do not retag it to make a run look clean.
A green there is the signal the AC is done.

## Evidence

```bash
./.maestro/collect-evidence.py                               # newest run
./.maestro/collect-evidence.py ~/.maestro/tests/<timestamp>  # a specific one
```

Copies each flow's frames **and its `.mp4` recording** into `evidence/<flow>/`
and regenerates that directory's `EVIDENCE.md` from `commands.json`. Verdicts come from
`commands.json`, never from whether a screenshot exists: a pass can leave none
and a red leaves two.

**`EVIDENCE.md` is generated and overwritten on every collection.** Never
hand-edit it — prose put there disappears on the next run. Narrative belongs in
`COVERAGE.md` (stories) or `smoke/README.md` (legs), which the script never
touches.

**`PASS (semantic)`** in that table is not a plain green. The literal assertion
failed; the flow had DECLARED a semantic contract on it and an LLM judged that
contract met for that run. The flow still ABORTED at the assertion, so nothing
below it ran, and the verdict has no authority over any other run. Every other
red stays red — `explain-red.py` explains why one went red and changes no
verdict at all. See [`semantic-assertions.md`](semantic-assertions.md).

**`.maestro/**/evidence/` is gitignored** because the frames show named children
and their marks — personal data about minors. `EVIDENCE.md` itself is committed
and carries the reviewable part. Do not "fix" that gitignore, and do not paste
frame contents into a PR body. Reproducing someone else's frames is a re-run, not
a checkout.
