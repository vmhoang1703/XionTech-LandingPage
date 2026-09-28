#!/usr/bin/env python3
"""Scaffold a Maestro story directory under pxp_mobile/.maestro/sprints/.

Creates the directory, one stub flow per acceptance criterion, and a COVERAGE.md
skeleton -- the mechanical half of `.maestro/README.md` "Adding a story". The
judgement half (real selectors, what each assertion proves, which flows are
opt-in) is left to whoever runs the skill: every stub is marked TODO and
`maestro check-syntax` passes on it, but it asserts nothing useful yet.

Nothing here touches EVIDENCE.md -- that is collect-evidence.py's file.

    scaffold_story.py --sprint sprint-18 --ado-id 23960 --slug assignment-results \
        --acs-json _bmad-output/implementation-artifacts/sprint-18/testcases/acs.json

Without --acs-json, pass --ac-count N to get N unnamed stubs.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

FLOW_TEMPLATE = """\
# ADO #{ado_id} AC{ac} -- {ac_title}
#
# TODO state what this flow proves, and -- just as important -- what a green run
# does NOT prove. Whoever reads a failure reads this first.
#
#   proves  -- TODO
#   not     -- TODO
appId: {app_id}
tags:
  - "{ado_id}"
  - {sprint}
  - ac{ac}
  - {lang}
env:
  TARGET_LANG: "{lang}"
  LOGIN_BUTTON: "{login_button}"
  WELCOME_TAIL: "{welcome_tail}"
  INPUT_ID: "message-input"
  TYPING_LABEL: "{typing_label}"
  OUT_OF_SCOPE_WITH_TOPICS: "{oos_topics}"
  OUT_OF_SCOPE_NO_TOPICS: "{oos_no_topics}"
  # TODO add every other selector the legs and assertions below need.
---
# Record the whole flow, PASS or FAIL. First command, and no matching
# `stopRecording`: Maestro closes the recording when the flow ends, whereas a
# `stopRecording` after a failing assertion would never run. See the README.
- startRecording: ac{ac}-TODO-{lang}
- runFlow: {up}shared/open-app.yaml
- runFlow: {up}shared/new-chat.yaml

- runFlow:
    file: {up}shared/send-utterance.yaml
    env:
      UTTERANCE: "TODO the utterance this AC is about"

# takeScreenshot goes BEFORE the assertion block, always: a flow that fails
# never reaches a line below the failure.
- takeScreenshot: evidence/ac{ac}-TODO-case
- assertVisible:
    text: "TODO a mark only a correct reply can contain -- never a word from the
      utterance this flow just typed, which the transcript echoes"
    label: "AC{ac}: TODO what a green here means"

- runFlow: {up}shared/assert-not-fallback.yaml
"""

COVERAGE_TEMPLATE = """\
# Coverage — #{ado_id} {title}

ADO [#{ado_id}]({ado_url}).
Spec: `TODO path to the BMad spec, or delete this line`.

Suite-wide setup, the session checklist, and how to run any of this live in
[{up}README.md]({up}README.md). This file covers only what is specific to this
story. Last run's verdicts and frames are in `EVIDENCE.md`, which is generated —
do not edit it.

## Flows

| Flow | AC | Notes |
|---|---|---|
{flow_rows}

Opt-in families (`remote-defect`, `env-unconfigured`, `blocked-until-remote`) are
excluded from a default run. To run everything here, name the story:
`./.maestro/run.sh --include-tags "{ado_id}"`. Passing any tag flag disables
`run.sh`'s opt-in exclusion.

## Status

**Nothing here has been run yet.** Written-but-never-run is not coverage. Fill
this section in from an actual run — flow, verdict, and for a red, the assertion
that failed — and re-run before reading a single green as acceptance.

| AC | Flow | Result |
|---|---|---|
{status_rows}

## Data this suite depends on

TODO name every live UAT value these flows pin — child names, marks, assignment
titles. They are account data, not fixtures: if the signed-in parent changes,
these flows fail with a selector error that reads like an app bug.
"""

ADO_URL = ("https://dev.azure.com/varkeyeducation/"
           "Product%20Development%20-%20PXP/_workitems/edit/{ado_id}")


def slugify(text: str) -> str:
    text = re.sub(r"\[.*?\]\(.*?\)", "", text)
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return re.sub(r"-{2,}", "-", text)


def load_acs(acs_json: Path, ado_id: str) -> tuple[str, list[dict]]:
    data = json.loads(acs_json.read_text(encoding="utf-8"))
    for story in data.get("stories", []):
        if str(story.get("ado_id")) == ado_id:
            return story.get("title", ""), story.get("acs", [])
    raise SystemExit(
        f"no story with ado_id {ado_id} in {acs_json}. Present: "
        + ", ".join(str(s.get("ado_id")) for s in data.get("stories", []))
    )


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--sprint", required=True, help="e.g. sprint-18")
    p.add_argument("--ado-id", required=True, help="quoted in tags; e.g. 23960")
    p.add_argument("--slug", required=True, help="directory suffix, e.g. assignment-results")
    p.add_argument("--acs-json", type=Path,
                   help="testcases/acs.json; supplies AC titles and count")
    p.add_argument("--ac-count", type=int, help="use instead of --acs-json")
    p.add_argument("--title", default="", help="story title for COVERAGE.md")
    p.add_argument("--langs", default="en",
                   help="comma-separated; one flow per AC per language (default en)")
    p.add_argument("--maestro-root", type=Path, default=Path("pxp_mobile/.maestro"))
    p.add_argument("--app-id", default="com.gems.ai.dev")
    p.add_argument("--force", action="store_true",
                   help="overwrite existing stub flows (never touches COVERAGE.md)")
    args = p.parse_args()

    if not args.acs_json and not args.ac_count:
        p.error("one of --acs-json or --ac-count is required")

    root = args.maestro_root.resolve()
    if not (root / "run.sh").exists():
        raise SystemExit(f"{root} does not look like the .maestro root (no run.sh)")

    title = args.title
    if args.acs_json:
        found_title, acs = load_acs(args.acs_json, args.ado_id)
        title = title or found_title
    else:
        acs = [{"number": n, "title": ""} for n in range(1, args.ac_count + 1)]

    story_dir = root / "sprints" / args.sprint / f"{args.ado_id}-{args.slug}"
    story_dir.mkdir(parents=True, exist_ok=True)

    langs = [x.strip() for x in args.langs.split(",") if x.strip()]
    # Story flows sit three directories below .maestro/.
    up = "../../../"
    written, skipped, rows, status_rows = [], [], [], []

    for ac in acs:
        num = ac["number"]
        ac_title = ac.get("title", "") or f"AC{num}"
        for lang in langs:
            name = f"ac{num}-{slugify(ac_title) or 'todo'}-{lang}.yaml"
            path = story_dir / name
            if path.exists() and not args.force:
                skipped.append(name)
            else:
                path.write_text(FLOW_TEMPLATE.format(
                    ado_id=args.ado_id, ac=num, ac_title=ac_title,
                    app_id=args.app_id, sprint=args.sprint, lang=lang, up=up,
                    login_button="Log in" if lang == "en" else "تسجيل الدخول",
                    welcome_tail=".*what's on your mind today.*" if lang == "en"
                    else ".*TODO the Arabic welcome tail.*",
                    typing_label="Assistant is typing..." if lang == "en"
                    else "TODO the Arabic typing label",
                    oos_topics=".*That isn't something I can help with.*",
                    oos_no_topics=".*couldn't find a related topic either.*",
                ), encoding="utf-8")
                written.append(name)
            rows.append(f"| `{name}` | AC{num} | TODO — {ac_title} |")
        status_rows.append(f"| AC{num} | TODO | **not run** |")

    coverage = story_dir / "COVERAGE.md"
    coverage_written = False
    if not coverage.exists():
        coverage.write_text(COVERAGE_TEMPLATE.format(
            ado_id=args.ado_id, title=title or "TODO story title",
            ado_url=ADO_URL.format(ado_id=args.ado_id), up=up,
            flow_rows="\n".join(rows), status_rows="\n".join(status_rows),
        ), encoding="utf-8")
        coverage_written = True

    print(json.dumps({
        "story_dir": str(story_dir),
        "flows_written": written,
        "flows_skipped_existing": skipped,
        "coverage_written": coverage_written,
        "acs": len(acs),
        "languages": langs,
        "next": [
            "fill every TODO in the stubs -- selectors, utterances, assertions",
            "maestro check-syntax each flow",
            "tag unmet ACs remote-defect / env-unconfigured / blocked-until-remote",
            f"./.maestro/run.sh --include-tags \"{args.ado_id}\"",
            "./.maestro/collect-evidence.py",
            "write COVERAGE.md Status from what actually happened",
            f"add a row for this story to sprints/{args.sprint}/COVERAGE.md",
        ],
    }, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
