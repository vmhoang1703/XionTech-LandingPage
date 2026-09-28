#!/usr/bin/env python3
"""Scaffold a smoke flow for one shared leg, under .maestro/smoke/.

A shared leg has no tags, no env of its own and no story behind it -- it is a
fragment that reads env a caller supplies, so `maestro test shared/open-app.yaml`
fails on an uninterpolated selector rather than testing anything. The only way to
run a leg is to be a caller. A smoke flow is that caller and nothing else: it
supplies the env, runs the leg, and asserts the leg's own postcondition.

These belong to no ADO id and no sprint. Putting them under sprints/ would make
them look like coverage of a story, which is why config.yaml carries a second
glob for smoke/.

    scaffold_leg.py --leg send-utterance
    scaffold_leg.py --leg new-chat --branches welcome,in-chat

--branches is the rule that matters. Where a leg has a `when:` guard, the smoke
flow must exercise BOTH sides: `new-chat` shipped with a guard that could never
match, and a flow calling it only from the welcome screen passed anyway, because
skipping is correct there. Each name becomes one call + screenshot + assertion.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

HEADER = """\
# shared/{leg}.yaml -- TODO one line on what this leg guarantees.
#
# TODO if this leg has a `when:` guard, say which branch caught which bug. A
# smoke flow that exercises only the easy branch passes with the guard fully
# broken -- that is how new-chat's unmatchable guard shipped and killed #23960's
# AC2 pointing at the wrong file entirely.
appId: {app_id}
tags:
  - smoke
  - shared
  - {lang}
env:
  TARGET_LANG: "{lang}"
  LOGIN_BUTTON: "Log in"
  WELCOME_TAIL: ".*what's on your mind today.*"
  INPUT_ID: "message-input"
  TYPING_LABEL: "Assistant is typing..."
  # TODO every other selector {leg}.yaml reads -- see the shared/ table in
  # ../README.md, then the leg itself. A leg defines no env; the caller does.
---
- runFlow: ../shared/open-app.yaml
"""

BRANCH = """
# Branch: {branch}
# TODO set up the precondition this branch needs, then assert the leg's
# postcondition FOR THIS BRANCH -- not the same assertion twice.
- runFlow: ../shared/{leg}.yaml
- takeScreenshot: evidence/shared-{leg}-{branch}
- assertVisible:
    text: "TODO the postcondition that proves the leg did its job here"
    label: "{leg}: TODO what this branch proves"
"""


def main() -> int:
    p = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--leg", required=True,
                   help="filename stem in shared/, e.g. send-utterance")
    p.add_argument("--branches", default="",
                   help="comma-separated branch names; one call+assertion each. "
                        "Required when the leg has a `when:` guard.")
    p.add_argument("--lang", default="en")
    p.add_argument("--maestro-root", type=Path, default=Path("pxp_mobile/.maestro"))
    p.add_argument("--app-id", default="com.gems.ai.dev")
    p.add_argument("--force", action="store_true")
    args = p.parse_args()

    root = args.maestro_root.resolve()
    if not (root / "run.sh").exists():
        raise SystemExit(f"{root} does not look like the .maestro root (no run.sh)")

    leg = re.sub(r"\.yaml$", "", args.leg)
    leg_file = root / "shared" / f"{leg}.yaml"
    if not leg_file.exists():
        existing = sorted(x.stem for x in (root / "shared").glob("*.yaml"))
        raise SystemExit(
            f"no shared/{leg}.yaml. Present: {', '.join(existing)}.\n"
            "Write the leg first -- a smoke flow tests a leg, it does not define one."
        )

    guarded = "when:" in leg_file.read_text(encoding="utf-8")
    branches = [b.strip() for b in args.branches.split(",") if b.strip()]
    if guarded and len(branches) < 2:
        raise SystemExit(
            f"shared/{leg}.yaml has a `when:` guard, so --branches needs at least two "
            "(e.g. --branches welcome,in-chat). A smoke flow that exercises one side "
            "passes with the guard broken."
        )
    branches = branches or ["default"]

    out = root / "smoke" / f"shared-{leg}.yaml"
    if out.exists() and not args.force:
        raise SystemExit(f"{out} exists. Edit it, or pass --force to overwrite.")

    body = HEADER.format(leg=leg, app_id=args.app_id, lang=args.lang)
    body += "".join(BRANCH.format(leg=leg, branch=b) for b in branches)
    out.write_text(body, encoding="utf-8")

    print(json.dumps({
        "written": str(out),
        "leg": f"shared/{leg}.yaml",
        "leg_has_guard": guarded,
        "branches": branches,
        "next": [
            f"fill the env block from what shared/{leg}.yaml actually reads",
            "give each branch a DIFFERENT precondition and postcondition",
            f"maestro check-syntax {out}",
            "./.maestro/run.sh --include-tags smoke",
            "./.maestro/collect-evidence.py",
            "add a line to smoke/README.md -- not to any COVERAGE.md",
        ],
    }, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
