#!/usr/bin/env python3
"""Which clauses of a story can still get a flow -- and which never will.

`collect-evidence.py` reports ten states for a clause a flow COVERS (PASS, FAIL,
red by design, UNEVALUATED, ...) and exactly one for a clause it does not:
"not covered". Four unrelated situations print identically --

    authorable today          work outstanding, someone should write it
    not observable            no flow can ever decide it; stop asking
    needs data we lack        blocked on the environment, not on effort
    never classified          nobody looked -- and nothing says so

-- which is how #23959's AC8.3, needing no fixture at all, sat unauthored beside
AC2, which no device flow can ever cover.

A script cannot decide which of the four a clause is: that judgement needs the AC
and usually a device. What it CAN do is insist the judgement was recorded, and
check it against the AC inventory BMad already built from ADO.

**It parses no prose.** Acceptance criteria reach this repo as free-form markdown
a BA writes however they like -- headings glued onto the previous paragraph,
clauses numbered or not, "Acceptance Criteria" spelled however it was typed. So
the AC identity is READ FROM `acs.json`, which `ado-sprint-to-bmad` builds from
ADO's own fields, and the block names its AC in a column rather than encoding it
in a string for this script to pick apart. What a clause IS stays prose, in the
model's words, because that is the half no parser should be guessing at.

    clause_queue.py pxp_mobile/.maestro/sprints/sprint-18/23959-assignment-rubrics

Exit 1 if an AC in the inventory has no clause row, a row is malformed, or two
rows of one AC describe the same clause.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

START = "<!-- CLASSIFICATION:START -->"
END = "<!-- CLASSIFICATION:END -->"

# One contract per row. A compound cell ("handle + not observable") means the
# clause was not split finely enough, and it hides the authorable half behind
# the unobservable one -- #23959's AC8.2 did exactly that.
CONTRACTS = {"handle", "exact-value", "semantic", "not-observable"}

# Contract says what to assert; reachability says whether the app can be got
# into the state where you would assert it. Both, or the queue cannot tell
# "write this today" from "probe it first".
REACH = {"producible", "forced-by-construction", "needs-data", "unknown", "n/a"}


def inventory_path(story: Path, sprint: str) -> Path | None:
    """Find acs.json by walking up for the FILE, not for `_bmad-output/`.

    An app repo can carry its own `_bmad-output/` -- pxp_mobile tracks
    `_bmad-output/project-context.md` -- so "nearest ancestor with that
    directory" stops inside the app repo and misses the workspace inventory
    entirely. Matching on the full path skips such strays.
    """
    tail = Path("_bmad-output") / "implementation-artifacts" / sprint / "testcases" / "acs.json"
    for p in story.parents:
        if (p / tail).is_file():
            return p / tail
    return None


def inventory(story: Path) -> tuple[str, dict[str, str], list[str]]:
    """(ado_id, {AC id: title}) from acs.json, plus any problems found.

    acs.json is the canonical inventory: `ado-sprint-to-bmad` builds it from the
    work items, so an AC exists here because ADO says so, not because a heading
    in a markdown file happened to parse.
    """
    problems: list[str] = []
    sprint = story.parent.name
    ado_id = story.name.split("-")[0]
    acs_path = inventory_path(story, sprint)
    if acs_path is None:
        return ado_id, {}, [
            f"no _bmad-output/implementation-artifacts/{sprint}/testcases/acs.json "
            f"in any directory above {story.name}"]
    data = json.loads(acs_path.read_text(encoding="utf-8"))
    story_rec = next((s for s in data.get("stories", [])
                      if str(s.get("ado_id")) == ado_id), None)
    if story_rec is None:
        return ado_id, {}, [f"ado_id {ado_id} is not in {acs_path.name}"]
    acs = {f"AC{a['number']}": a.get("title", "") for a in story_rec.get("acs", [])}
    return ado_id, acs, problems


def sheet_acs(story: Path, ado_id: str) -> dict[str, str]:
    """{AC id: title} as the client's test-case sheet has them.

    Only ever used to CROSS-CHECK the inventory. collect-evidence.py builds its
    traceability from this sheet, so the two drifting apart means the committed
    coverage artefact and the BMad inventory disagree about the story -- worth
    saying out loud rather than silently preferring one.
    """
    tsv = story.parent / "testcases.tsv"
    out: dict[str, str] = {}
    if not tsv.is_file():
        return out
    for line in tsv.read_text(encoding="utf-8").splitlines():
        f = line.split("\t")
        if len(f) < 8 or f[1].strip() != ado_id:
            continue
        out.setdefault(f[3].strip(), f[4].strip())
    return out


def block(coverage: Path) -> list[str]:
    text = coverage.read_text(encoding="utf-8")
    if START not in text or END not in text:
        sys.exit(
            f"{coverage}: no CLASSIFICATION block.\n"
            f"Add one between {START} and {END} -- see the skill's step 1b.\n"
            "Columns: ac | clause | contract | reachability | flow | note"
        )
    body = text.split(START, 1)[1].split(END, 1)[0]
    return [ln for ln in body.splitlines() if ln.strip().startswith("|")]


def rows(lines: list[str], story: Path, acs: dict[str, str]) -> tuple[list[dict], list[str]]:
    out: list[dict] = []
    errs: list[str] = []
    seen_clause: set[tuple[str, str]] = set()
    for ln in lines:
        cells = [c.strip() for c in ln.strip().strip("|").split("|")]
        if set("".join(cells)) <= set("- "):
            continue  # the header's underline row
        if cells and cells[0].lower() == "ac":
            continue  # the header row itself
        # A wrong column count is an ERROR, never a skip. Silently dropping the
        # row loses a clause from the queue, and the missing-AC check does not
        # catch it whenever that AC has other rows -- so the one thing this
        # script exists to prevent, a clause nobody looked at, happens quietly.
        # A stray `|` in a note is all it takes.
        if len(cells) != 6:
            errs.append(
                f"row has {len(cells)} columns, expected 6 "
                f"(a `|` inside a cell splits it): {ln.strip()[:90]}")
            continue
        ac, clause, contract, reach, flow, note = cells
        where = f"{ac} {clause[:40]!r}"
        # The AC must exist in the inventory. This is a set membership test
        # against ADO's own numbering -- nothing is parsed out of the id.
        if ac not in acs:
            errs.append(f"{where}: AC {ac!r} is not in the story's acs.json inventory")
            continue
        if not clause:
            errs.append(f"{ac}: a row with no clause description")
            continue
        key = (ac, " ".join(clause.lower().split()))
        if key in seen_clause:
            errs.append(f"{where}: two rows of {ac} describe the same clause")
            continue
        seen_clause.add(key)
        if contract not in CONTRACTS:
            errs.append(f"{where}: contract {contract!r} not one of " + ", ".join(sorted(CONTRACTS)))
            continue
        if reach not in REACH:
            errs.append(f"{where}: reachability {reach!r} not one of " + ", ".join(sorted(REACH)))
            continue
        # Ruling a clause out is only useful if it says why; otherwise the next
        # session re-litigates it, or worse, believes it.
        if contract == "not-observable" and not note:
            errs.append(f"{where}: not-observable with no reason in `note`")
        if contract == "not-observable" and reach != "n/a":
            errs.append(f"{where}: not-observable must have reachability n/a")
        if reach == "needs-data" and not note:
            errs.append(f"{where}: needs-data without naming the data")
        flows = [f.strip(" `") for f in flow.split(",") if f.strip(" `") not in ("", "—", "-")]
        for name in flows:
            if not (story / f"{name}.yaml").is_file() and not list(story.rglob(f"{name}.yaml")):
                errs.append(f"{where}: names flow {name!r}, which does not exist")
        out.append({"ac": ac, "clause": clause, "contract": contract,
                    "reach": reach, "flows": flows, "note": note})
    return out, errs


def main() -> int:
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("story", type=Path, help="a story directory under sprints/")
    args = ap.parse_args()
    story = args.story.resolve()
    if not story.is_dir():
        sys.stderr.write(f"no such story directory: {story}\n")
        return 1

    ado_id, acs, problems = inventory(story)
    if not acs:
        for p in problems:
            sys.stderr.write(f"! {p}\n")
        return 1
    entries, errs = rows(block(story / "COVERAGE.md"), story, acs)

    # Every AC the inventory names must be accounted for by at least one clause
    # row. This is the "forgotten" case, and the only one of the four that
    # nobody would notice on their own.
    missing = [a for a in acs if not any(e["ac"] == a for e in entries)]

    buckets: dict[str, list[dict]] = {}
    for e in entries:
        if e["flows"]:
            key = "covered"
        elif e["contract"] == "not-observable":
            key = "never"
        elif e["reach"] in ("producible", "forced-by-construction"):
            key = "authorable"
        elif e["reach"] == "needs-data":
            key = "blocked"
        else:
            key = "probe"
        buckets.setdefault(key, []).append(e)

    print(f"# {story.name} -- #{ado_id}, {len(entries)} clauses over {len(acs)} ACs\n")
    for key, head in (
        ("authorable", "AUTHORABLE NOW -- no flow, and nothing blocks one"),
        ("probe", "PROBE FIRST -- reachability unknown; one utterance settles it"),
        ("blocked", "BLOCKED ON DATA -- record the dependency, do not author"),
        ("never", "NOT OBSERVABLE -- no flow can decide these, ever"),
        ("covered", "HAS A FLOW"),
    ):
        got = buckets.get(key, [])
        if not got:
            continue
        print(f"## {head}  ({len(got)})")
        for e in sorted(got, key=lambda x: (x["ac"], x["clause"])):
            tail = ", ".join(e["flows"]) if e["flows"] else e["note"]
            print(f"  {e['ac']:<6} {e['contract']:<15} {e['reach']:<22} {e['clause']}")
            if tail:
                print(f"         -> {tail}")
        print()

    # Cross-check, never authoritative. collect-evidence.py builds the committed
    # traceability from the sheet; a disagreement means those two artefacts
    # describe different stories, which has bitten this repo before.
    sheet = sheet_acs(story, ado_id)
    if sheet:
        drift = [f"{a}: inventory {acs[a]!r} vs sheet {sheet[a]!r}"
                 for a in sorted(acs.keys() & sheet.keys()) if acs[a] != sheet[a]]
        drift += [f"{a}: in acs.json, absent from testcases.tsv" for a in sorted(acs.keys() - sheet.keys())]
        drift += [f"{a}: in testcases.tsv, absent from acs.json" for a in sorted(sheet.keys() - acs.keys())]
        if drift:
            print("## AC INVENTORY vs CLIENT SHEET -- they disagree (not fatal)")
            for d in drift:
                print(f"  ~ {d}")
            print()

    for a in sorted(missing):
        errs.append(f"{a} ({acs[a]}): in the acs.json inventory, no clause row classifies it")
    if errs:
        print("## UNCLASSIFIED / MALFORMED -- fix before harvesting")
        for e in errs:
            print(f"  ! {e}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
