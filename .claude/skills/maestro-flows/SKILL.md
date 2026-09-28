---
name: maestro-flows
description: Works the Maestro device-test suite in pxp_mobile/.maestro — the flows that drive the packaged app on a real Android handset. Runs AFTER a bmad-build run completes (never inside it) to build device coverage for what was just shipped — trigger it on "bmad-build is done, now write the e2e tests", "add maestro coverage for what we just built", or any ask for e2e tests following a finished build. Three modes. STORY - build a story's coverage directory end to end - scaffold one flow per acceptance criterion, run it on the device, harvest the evidence, write COVERAGE.md from what actually happened - triggered by "write maestro flows for 23960", "add device e2e coverage for this story", "test these ACs on a real phone", "run the suite for that story and update coverage", "harvest the last run". LEG - author or verify the shared subflows in .maestro/shared/ through their smoke/ flows - triggered by "I changed send-utterance, verify it", "run the smoke flows", "add a shared leg", "does open-app still work". TRIAGE - a flow went red and it is unclear whether the story or a shared leg is broken - triggered by "why did this flow fail", "is it the story or the leg", "this selector stopped matching", "a string was renamed and flows are red". Not for Playwright (`yarn e2e`), which drives the app as a web page in a browser and is a separate suite.
---

# Maestro flows

The suite lives in `pxp_mobile/.maestro/`. It drives the **packaged app on a
device**; Playwright (`e2e/`, `yarn e2e`) drives the same app as a **web page in
a browser**. Neither replaces the other — if the ask is about a browser, this is
the wrong skill.

**Before writing or editing any flow, read
[`references/authoring-rules.md`](references/authoring-rules.md).** Thirteen rules,
every one of them a silent failure: a flow that goes green while proving nothing,
or one that fails somewhere that does not point at the cause. Rule 12 is the one
to re-read when a flow goes **red** — a red AC is a question, not a verdict. They
apply to story flows and smoke flows alike and are not repeated below.

**Every assertion declares which of AD-26's three contracts it is** — handle,
exact value, or semantic (rule 11). Handles cover most ACs and Maestro decides
them. Where an AC names particular copy, the literal is the contract and a red
stays red. Where an AC defines intent answered by a dynamic agent, a
`semantic:` label declares that contract and an LLM judges it — the only
assertion an LLM can pass, and only because the flow said so before the run.
Full model: [`references/semantic-assertions.md`](references/semantic-assertions.md).

**Extending the skill's own scripts is a different question**, and it has its
own rule: structure from the pipeline, judgement from the model, no parser in
between. Before adding a check to `clause_queue.py`, `collect-evidence.py` or
`explain-red.py`, read
[`references/judgement-boundaries.md`](references/judgement-boundaries.md) — it
says what a script here may decide and what it must instead require someone to
declare. Both mechanisms in this suite exist because the approximating version
went green while proving nothing.

`pxp_mobile/.maestro/README.md` is the source of truth behind all of this.
`sprints/sprint-18/23960-assignment-results/` is the worked example — when a
question is not answered anywhere, copy what that directory does.

## Route first

| The thing under test | Mode |
|---|---|
| has an ADO id / acceptance criteria | **[Story](#mode-story)** |
| is a file in `.maestro/shared/` | **[Leg](#mode-leg)** |
| already exists and went red | **[Triage](#mode-triage)** |

## After a bmad-build run

**This skill runs after `bmad-build` finishes, never inside it.** `bmad-build`
implements the feature and completes its own five steps; once step 05 has
committed and the spec reads `status: done`, invoke this skill to build the
device coverage for what was just shipped. Two skills in sequence, composed by
whoever is driving — no BMad customization, no hook, nothing wired into the
build workflow itself.

The order is what makes it work. Coverage authored against a finished, committed
feature is authored against the screen that actually exists: selectors come off a
live `maestro hierarchy` of the shipped build, not off a guess about markup that
is still being written. Coverage attempted mid-build reads a screen that changes
under it, and every loopback in step 04 invalidates what it found.

So the sequence is:

1. `bmad-build` runs to completion — feature implemented, reviewed, committed.
2. **Rebuild and install the debug APK**, or the handset is still running the
   previous build and every verdict below describes code that is not the code
   just written. Nothing on an installed APK identifies its commit —
   `android/app/build.gradle` pins `versionCode` and `versionName` to static
   values — so there is no staleness check to substitute for rebuilding:

   ```bash
   cd pxp_mobile
   ls android/app/google-services.json || echo "MISSING — app will crash on launch"
   yarn build && npx cap sync android
   cd android && ./gradlew assembleDebug
   adb install -r app/build/outputs/apk/debug/app-debug.apk
   ```

   `install -r` keeps the stored session; debug builds share the stable debug
   keystore. Never `adb uninstall` — that costs a manual sign-in.
3. This skill, in [story mode](#mode-story), with the ADO id the spec names.

**Read the finished spec before anything else, and prefer it over the sprint-wide
AC inventory.** `bmad-build` should hand over its path; if it did not, find it by
the ADO id under `_bmad-output/implementation-artifacts/<sprint>/`. `acs.json`
says what the *sprint* planned — the spec says what this build actually did, and
where the two disagree the spec is the one that matches the code on disk.

Four sections earn their reading:

| Section | Use it for |
|---|---|
| `## Tasks & Acceptance` | which ACs this build covered; its Given/When/Then lines are near-assertions already |
| `## I/O & Edge-Case Matrix` | edge cases already enumerated — cheaper and better than inventing them |
| `## Verification` | what was checked *without* a device, so flows go where nothing else reached |
| `## Acceptance Evidence` | what O3 observed, and any `BLOCKED` row naming a surface nobody looked at |

A `BLOCKED` row is the strongest signal in the file: it is an explicit record
that something went unverified, which is exactly what a device flow is for.

Cover what the build changed. Do not re-author flows for ACs it never touched —
and where the spec says an AC was satisfied by a remote agent rather than by this
code, say so in `COVERAGE.md` rather than asserting it as though PXP built it.

If the story turns out to be satisfied by a remote agent rather than by the code
`bmad-build` wrote, that is still coverage worth having — it is the difference
between "blocked on the remote" and "the remote has a defect", and only the
second is provable. #27738 is the worked example: the feature was already live
remotely, and the flows exist to prove which ACs it meets.

Arguments arrive as free text. A bare number is an ADO id (`27738` → story mode).
`smoke` alone means run the leg suite. A flow or leg filename means triage or leg
mode. Ambiguous input gets one question, not a guess — the modes write to
different directories and mixing them puts smoke flows under `sprints/`, where
they read as coverage of a story they do not cover.

## Preflight, every mode

```bash
.claude/skills/maestro-flows/scripts/preflight.sh
```

The answer changes the plan: **no device means nothing can be run**, and unrun
flows are not coverage. Author and `check-syntax` offline if the user wants, then
say plainly that nothing was run. Do not attempt setup — device access, the debug
build and the one-time sign-in are the README's Setup steps and are the user's
to do.

---

## Mode: story

Deliverable is one directory: a flow per AC, plus `COVERAGE.md` recording what is
covered, what is blocked, and what a green does *not* prove.

### 1. Get the acceptance criteria

In order of preference:

1. **`_bmad-output/implementation-artifacts/<sprint>/testcases/acs.json`** — AC
   inventory keyed by `ado_id`, with line numbers into
   `_bmad-output/planning-artifacts/epics-sprint-N.md`. Read the AC bodies from
   those lines; the JSON carries titles only.
2. **The BMad spec**, `spec-<ado id>-<slug>.md` in the same sprint directory.
3. **ADO**, via `.claude/skills/ado-sprint-to-bmad/scripts/fetch_sprint.py` or
   `scripts/ado-fetch-work-items.sh`.

Planning artifacts drift from ADO and from the app. Where an AC's text and the
shipped app disagree, test the app and record the discrepancy in `COVERAGE.md` —
#23960's AC1 names the Students topic and the app had already moved the prompt to
Assignments. That mismatch is a finding, not a detail to smooth over.

### 1b. Classify every AC before scaffolding

Clause by clause — one AC is often two contracts — into **handle**, **exact
value**, **semantic**, or **not device-observable**. Full procedure and the
worked examples: [`references/authoring-rules.md`](references/authoring-rules.md#before-the-rules-classify-the-storys-acs).

Do it on paper. The fourth outcome is why: an AC the device cannot see costs a
build, an install and a run to discover on the handset — a clause about another
service, about matching data the flow cannot read, or about state the app never
puts in the accessibility tree. Scaffolding one flow per AC without this pass
produces flows that cannot pass for reasons no rerun will fix.

**Then write it into the story's `COVERAGE.md` as a CLASSIFICATION block and run
the queue:**

```bash
.claude/skills/maestro-flows/scripts/clause_queue.py \
  pxp_mobile/.maestro/sprints/sprint-18/23959-assignment-rubrics
```

It prints the five buckets — authorable now, probe first, blocked on data, not
observable, has a flow — and **exits non-zero** if any AC in the story's
`acs.json` inventory has no clause row, if two rows of one AC describe the same
clause, if a contract or reachability word is outside the closed vocabulary, or
if a clause is ruled out with no reason recorded. That is the whole point: the
judgement is yours, but the script will not let it go unrecorded.

The AC identity comes from `acs.json`, not from parsing the AC markdown — a BA
writes that however they like. It also reports where `acs.json` and the client's
`testcases.tsv` disagree about the story's ACs.

`sprints/sprint-18/23959-assignment-rubrics/COVERAGE.md` is the worked example.
Run this **before** scaffolding, and again whenever an AC is re-read — the
"authorable now" bucket is the work queue, and it is the only place the
difference between *nobody has written this yet* and *no flow can ever cover it*
is written down. `collect-evidence.py`'s generated table prints `not covered` for
both.

### 2. Scaffold

```bash
.claude/skills/maestro-flows/scripts/scaffold_story.py \
  --sprint sprint-18 --ado-id 23960 --slug assignment-results \
  --acs-json _bmad-output/implementation-artifacts/sprint-18/testcases/acs.json
```

Directory, one TODO-marked stub per AC, `COVERAGE.md` skeleton. Never overwrites
an existing `COVERAGE.md`, never writes `EVIDENCE.md`. `--langs en,ar` where a
story needs both. New sprint? Create `sprints/<sprint>/COVERAGE.md` too, modelled
on `sprints/sprint-18/COVERAGE.md`.

`config.yaml`'s glob is `sprints/*/*/*.yaml`, so the directory *is* the
registration — nothing else to edit.

### 3. Author

Stubs are inert: every one needs a real utterance, real selectors read off a live
`maestro hierarchy`, and an assertion that can only pass for the right reason.
Apply [`references/authoring-rules.md`](references/authoring-rules.md) in full —
rules 5 (echo assertions), 7–8 (icon buttons, mirrored taps) and 11 (which
contract each assertion is) are where story flows go wrong most.

**Classify every assertion before writing it**, per rule 11. Two questions
settle it: *who authors this text* — a remote agent, or PXP config and data —
and *does the AC name the sentence or the intent*. A prompt title, a nav label,
a mark or a date is never semantic. Then, for a semantic one, capture it with
the sentinel — an ordinary assertion that passes records no screen and is
silently never judged, which is a plain green over an unevaluated AC. See
[`references/semantic-assertions.md`](references/semantic-assertions.md).

An AC the app does not satisfy still gets a flow, tagged with the opt-in family
that says why. Then `maestro check-syntax` every file.

### 4. Run and harvest

```bash
cd pxp_mobile && ./.maestro/run.sh --include-tags "23960"
./.maestro/explain-red.py         # why each red happened — run it on any red
./.maestro/collect-evidence.py
```

Repeat two to four times before calling anything covered.

`explain-red.py` prints, for every red step, what the assertion looked for, what
Maestro said, the failure frame and the string on screen nearest it — the things
you would otherwise dig out of `commands.json` and a hierarchy dump by hand.

Two separate jobs, and keeping them apart is the point:

- **Diagnosis** (`--write`) explains ANY red and changes no verdict. The
  explanation is persisted in the story's COVERAGE.md; an explained red is still
  a red.
- **Semantic evaluation** (`--evaluate`) applies only to a step that DECLARED a
  `semantic:` contract, and produces the acceptance verdict for that one
  assertion. It is written into the run directory, is authoritative for that run
  and no other, rescues only its own step, and prints as `PASS (semantic)` —
  never a plain green.

See [`references/semantic-assertions.md`](references/semantic-assertions.md).

`collect-evidence.py` harvests each flow's frames **and its `.mp4` screen
recording** into `evidence/<flow>/`. Every flow records itself PASS and FAIL —
the recording is closed by Maestro when the flow ends, so a red flow leaves a
video of its own failure. Both stay under gitignored `evidence/`; the video
shows the whole session including every child name and mark, so it never goes on
a work item or into a PR.

**Every red flow gets triaged before it becomes a verdict — rule 12.** Open
`~/.maestro/tests/<timestamp>/<flow>/screenshots/` and look at the frame *before*
forming a theory. Below the fold, a system dialog in the foreground, and a
missing accessible name all produce the same "not visible" message, and only the
screenshot tells them apart. Scroll and re-run before writing "not met" anywhere
— on 2026-08-27 an unscrolled AC1 was reported as a stale deployment, and one
`scrollUntilVisible` turned six red flows green across three stories.

### 5. Write COVERAGE.md

Last, from what actually happened — never from what was authored.

**The AC and test case tables are generated; do not type them.**
`collect-evidence.py` owns the block between the `<!-- TRACEABILITY:START -->`
and `<!-- TRACEABILITY:END -->` markers and rewrites it on every collection —
the story's ACs first, then the cases behind each, with the verdict from the run
just harvested. It reads the sprint's `testcases.tsv` and matches flows by the
`acN` tag they already carry, or by an explicit `# tc: S18-68` header where one
flow covers a specific case rather than a whole AC. Add that header when you
write a flow from a named test case.

Those tables were hand-maintained until 2026-09-03, and the reason they are not
any more is worth keeping: a hand-typed Run? column is correct on the day it is
written and silently wrong afterwards — six flows still read "never run" the
morning after they ran. Anything you type inside the markers is lost on the next
collection.

Everything OUTSIDE the markers is yours, and none of it can be derived from a
run:

- which flows are opt-in and why;
- per-run verdicts across the repeat runs, not one column. Footnote any red that
  was a suite defect rather than app behaviour, and say which patch fixed it;
- for every red-by-design flow, the exact assertion that failed, and that it
  turns green on its own when the remote ships;
- what a green does **not** cover — an AC whose positive case no test anywhere
  verifies belongs here by name;
- every live UAT value the flows pin (child names, marks, assignment titles)
  under "Data this suite depends on". They change without warning and fail as
  selector errors that read like app bugs;
- intermittent ≠ covered. Record the pass ratio and leave the AC uncovered;
- every `PASS (semantic)` by name — the declared intent, the wording actually on
  screen, and who judged it. It is a weaker green than a plain one: the capture
  step is `optional: true`, so Maestro decided nothing and an LLM did, and the
  verdict covers that run only.
- every red left standing on a `semantic:` assertion — the AC is uncovered, and
  say whether the fix is the agent's copy or a handle the flow should assert.

Then add the story's row to `sprints/<sprint>/COVERAGE.md`.

---

## Mode: leg

`shared/` holds the sprint- and story-agnostic subflows every story routes
through. **A leg that breaks breaks every sprint at once, and the failure never
points at itself** — the three defects that cost a day getting #23960's AC2 green
were all in `shared/`, and each surfaced as a story flow failing at a line that
was not the broken one.

A leg cannot be run directly: it has no tags and no env of its own, so
`maestro test shared/open-app.yaml` fails on an uninterpolated selector rather
than testing anything. `smoke/` holds one flow per leg that supplies the env and
asserts the leg's postcondition.

**Verifying a leg after editing it:**

```bash
cd pxp_mobile && ./.maestro/run.sh --include-tags smoke
./.maestro/collect-evidence.py
```

Expected green. If a run dies inside `shared-set-language.yaml`, switch the
handset's language back by hand before reading anything after it.

**Adding a leg:** write `shared/<name>.yaml` first — every selector arrives
through `env`, none is defined in the leg — then scaffold its smoke flow:

```bash
.claude/skills/maestro-flows/scripts/scaffold_leg.py --leg new-chat \
  --branches welcome,in-chat
```

The script refuses fewer than two branches when the leg contains a `when:` guard,
and that refusal is the point: **a smoke flow must exercise both sides of every
guard.** `new-chat` shipped with a guard that could never match, and a flow
calling it only from the welcome screen passed anyway — skipping is correct
there. The second call, from inside a chat where the tap *must* happen, is the
one that catches it.

Smoke flows live in `smoke/`, never under `sprints/` — they belong to no ADO id
and no sprint, and filing them under one would make them look like coverage of a
story. Their write-up goes in `smoke/README.md`, not any `COVERAGE.md`.

---

## Mode: triage

A red flow answers one question first: **is the story broken, or a leg?**

1. **Look at the failure screenshot before anything else** —
   `~/.maestro/tests/<timestamp>/<flow>/`. It separates a wrong selector from an
   app that is no longer running, and those have completely different fixes.
2. **Read the failing assertion's `label:`**, and check the step it failed at. A
   failure *inside* a `runFlow` is a leg failure.
3. **Run `./.maestro/explain-red.py`** — it prints what each red looked for and
   what was on screen instead. If the assertion declared a `semantic:` contract,
   judge the observed text against that intent and record the verdict with
   `--evaluate`; that is the one case where a red can resolve to
   `PASS (semantic)`, for that run only. Every other red is explained, not
   cleared.
4. **Run the smoke suite.** Green legs mean the story flow is wrong; a red leg
   means every story is affected and the leg is the fix.
5. **Watch the flow's video** — `evidence/<flow>/<flow>.mp4` after
   `collect-evidence.py`, or `startRecording/` in the run directory. Every flow
   records itself, PASS or FAIL. It is the only artifact showing what happened
   BETWEEN the screenshots, which is where an intermittent render or a slow turn
   hides — start here for the results-card instability below. A `—` in
   `EVIDENCE.md`'s Video column means the flow is missing its `startRecording`
   first command.
6. **Read the captured hierarchy** — `screen-hierarchy/*.json` carries `text`,
   `accessibilityText`, `resource-id` and `bounds` for every node that was on
   screen. `desc=''` on the node you targeted means no text selector will ever
   match it. Use `maestro hierarchy` for the live tree, never
   `adb shell uiautomator dump`.

   **The hierarchy holds only what was rendered, so it cannot tell you an element
   is missing** — it stops where rendering stops, which looks identical to a list
   that ends there. Never conclude "the feature is not there" from a dump alone;
   that is rule 12, and it is how an unscrolled AC1 got reported as a stale
   deployment on 2026-08-27. Scroll and re-run before any verdict.

The README's [When something fails](../../../pxp_mobile/.maestro/README.md#when-something-fails)
table maps symptoms to causes — a silent run, a skipped step, the Android
launcher in the screenshot, `app is signed out`. Check it before theorising.

Five failures that look like app bugs and are not: a **language** left behind by
an earlier failed flow, a **UAT data** change (a child renamed on the signed-in
account), the **results card** rendering unreliably (#23960's typo flow passes
about half the time with no configuration difference), an element **below the
fold** (rule 12 — scroll before judging), and a **system dialog** taking the
foreground mid-run. That last one was Samsung's "Update ready to install" on
2026-08-27, which appeared because the handset was on the charger and made every
app-text assertion fail at once; keep the phone **off the charger** during a run.

A string renamed in the app turns flows red across several stories at once. Fix
it wherever it belongs — if two stories reference it, that is a `shared/` env
value, not a copy in each flow.

---

## Reporting back

State separately: what was authored, what was **run**, and what was neither.
"Written but never run is not coverage" is the README's rule and it is the one
most easily blurred in a summary. If preflight blocked the run, lead with that.

Commit in `pxp_mobile` — the repo that owns the code — per this workspace's
Conventional Commits rule, scope `maestro`.
