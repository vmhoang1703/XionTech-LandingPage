# What a script here may decide, and what it may not

Load this before adding or extending any script in this skill. It is not about
authoring flows — [`authoring-rules.md`](authoring-rules.md) covers that — it is
about where the line falls between what tooling settles and what a person or a
model settles.

Both mechanisms in this suite are the same idea applied twice, and both were
built after the approximating version failed silently.

---

## The rule

**Structure from the pipeline, judgement from the model, no parser in between.**

Three layers, and each has exactly one legitimate source:

| layer | source of truth | decided by |
| --- | --- | --- |
| identity — which AC, which flow, which run | an artefact a machine produced (`acs.json`, `commands.json`, flow `tags:`) | the pipeline |
| judgement — what a clause requires, whether a reply meets an intent | the AC body, the screen | a person or an LLM |
| bookkeeping — was the judgement recorded, in a readable form | the committed block | the script |

A script may check the third. It may read the first. It must never compute the
second.

## May / may not

**May:** set membership against an inventory · closed-vocabulary checks ·
"is this AC accounted for at all" · "do two rows describe the same clause" ·
"does a ruled-out clause say why" · "did this step capture a screen" ·
cross-check two artefacts and report where they disagree.

**May not:** parse an id for meaning · assume a numbering scheme · read a
heading · infer which contract an assertion is · decide whether an AC is met.

Every item on the first list is a mechanical fact about a *document*. Every item
on the second is a claim about the *feature*.

## Why: the source is not structured

Acceptance criteria arrive as free-form markdown a BA writes however they like.
#23959 shows every failure mode at once, and it is not an unusual story:

- AC6's and AC8's headings are glued onto the end of the preceding paragraph;
- `acs.json`'s line numbers for AC5/AC6 and AC7/AC8 are transposed;
- the AC4 clause the BA removed in ADO rev 31 still survives in three workspace
  files;
- clauses are numbered only because this BA happened to number them, and the
  heading itself can be spelled anything at all.

So any grammar a script imposes on that text is a fiction about the source.
`AC3.1` was not a normalisation — it was a number invented to satisfy a regex,
for an AC that is one unnumbered sentence.

## The two mechanisms, and the failure each replaced

**Semantic contracts.** Maestro cannot decide whether an agent *said the right
thing*, because the agent authors the wording. The approximating version was a
regex alternating over synonyms; it failed on the first harmless rewording and
passed on a sentence containing the words while meaning something else. The
replacement: the flow DECLARES the intent before the run, and an LLM judges it.
See [`semantic-assertions.md`](semantic-assertions.md).

**Clause classification.** A script cannot decide whether a clause is
*observable*, because that needs the AC and usually a device. The approximating
version gave each clause a synthetic id and regex-parsed the AC back out of it;
it disagreed with itself about which ids were legal and produced a gate that
failed on correctly classified work. The replacement: the block NAMES its AC in
a column, checked against `acs.json`, and the clause stays prose.

Same shape both times: **declare the judgement before, gate on its presence
after.**

## Why approximations are worse than gaps here

An approximation of judgement fails *silently*, and silence is the one failure a
coverage tool cannot afford. Every mechanism in this suite exists because
something went green while proving nothing:

- a semantic contract captured by a step that passed, so the AC was never judged;
- a classification row with a stray `|`, dropped for the wrong column count, so a
  clause vanished from the queue and exit stayed 0;
- an `--include-tags` story run reporting "10 passed" while three red-by-design
  flows never executed.

A missing check announces itself the first time someone looks. A wrong one
answers confidently forever. When in doubt, **make the script refuse rather than
guess** — a gate that fires on a shape you did not anticipate costs a minute; a
gate that quietly accepts one costs the thing it was built to protect.

## Extending this skill

Before adding a check, ask which layer it belongs to. If the answer is "it would
have to read the AC text and work out what it means", it is not a check — it is a
judgement, and it needs a declaration to gate on instead.
