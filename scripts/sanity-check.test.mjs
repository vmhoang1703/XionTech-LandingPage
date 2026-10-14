import { describe, expect, it } from "vitest";

import { checkLocalized, summarize } from "./sanity-check.mjs";

const post = { _id: "p1", title: "[Placeholder] Post" };
const job = { _id: "j1", title: "[Placeholder] Job" };
const probeId = "drafts.abc";

describe("summarize", () => {
  it("passes and proves draft privacy when the probe draft is not readable", () => {
    const result = summarize({ post, job, probeId, probeCount: 0 });
    expect(result.ok).toBe(true);
    expect(result.lines).toEqual([
      "post: p1 [Placeholder] Post",
      "job: j1 [Placeholder] Job",
      "draft privacy: proven (draft drafts.abc not readable without a token)",
    ]);
  });

  it("says draft privacy is not proven when no probe id is given", () => {
    const result = summarize({ post, job });
    expect(result.ok).toBe(true);
    expect(result.lines.at(-1)).toBe(
      "draft privacy: not proven — save an unpublished post in the Studio and run with SANITY_DRAFT_PROBE_ID=drafts.<id>",
    );
  });

  it("prints a placeholder when the English title is missing", () => {
    const result = summarize({
      post: { _id: "p1", title: null },
      job,
      probeId,
      probeCount: 0,
    });
    expect(result.lines[0]).toBe("post: p1 (no English title)");
  });

  it("fails when no post is found", () => {
    const result = summarize({ post: null, job, probeId, probeCount: 0 });
    expect(result.ok).toBe(false);
    expect(result.lines.join("\n")).toContain(
      "no post found — publish a real post in the Studio",
    );
  });

  it("fails when no job is found", () => {
    const result = summarize({ post, job: null, probeId, probeCount: 0 });
    expect(result.ok).toBe(false);
    expect(result.lines.join("\n")).toContain(
      "no job found — publish a [Placeholder] job in the Studio",
    );
  });

  it("fails when the probe draft can be read without a token", () => {
    const result = summarize({ post, job, probeId, probeCount: 1 });
    expect(result.ok).toBe(false);
    expect(result.lines.join("\n")).toContain(
      "draft drafts.abc is readable without a token",
    );
  });

  it("reports every problem at once", () => {
    const result = summarize({
      post: null,
      job: null,
      probeId,
      probeCount: 1,
    });
    expect(result.ok).toBe(false);
    expect(result.lines.filter((l) => l.startsWith("FAIL"))).toHaveLength(3);
  });
});

describe("checkLocalized", () => {
  const langs = ["titleLang"];

  it("passes when every document has a title and an en or vi language", () => {
    const result = checkLocalized({
      "news list (vi)": {
        docs: [
          { slug: "a", title: "Tin", titleLang: "vi" },
          { slug: "b", title: "News", titleLang: "en" },
        ],
        langs,
      },
    });
    expect(result.ok).toBe(true);
    expect(result.lines).toEqual([
      "news list (vi): 2 ok — Tin [vi] | News [en]",
    ]);
  });

  it("fails on no documents, a missing title or a missing language", () => {
    const result = checkLocalized({
      "roles list (en)": { docs: [], langs },
      "role (vi)": { docs: [{ slug: "r", title: null }], langs },
      "story (vi)": { docs: [{ title: "T", titleLang: null }], langs },
    });
    expect(result.ok).toBe(false);
    expect(result.lines).toEqual([
      "FAIL: roles list (en): no documents",
      "FAIL: role (vi): r has no title; r has titleLang = undefined",
      "FAIL: story (vi): ? has titleLang = null",
    ]);
  });
});
