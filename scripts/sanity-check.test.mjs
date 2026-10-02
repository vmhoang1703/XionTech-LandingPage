import { describe, expect, it } from "vitest";

import { summarize } from "./sanity-check.mjs";

const post = { _id: "p1", title: "[Placeholder] Post" };
const job = { _id: "j1", title: "[Placeholder] Job" };

describe("summarize", () => {
  it("passes when one post, one job and no drafts are found", () => {
    const result = summarize({ post, job, draftCount: 0 });
    expect(result.ok).toBe(true);
    expect(result.lines).toEqual([
      "post: p1 [Placeholder] Post",
      "job: j1 [Placeholder] Job",
      "drafts readable without a token: 0",
    ]);
  });

  it("fails when no post is found", () => {
    const result = summarize({ post: null, job, draftCount: 0 });
    expect(result.ok).toBe(false);
    expect(result.lines.join("\n")).toContain(
      "no post found — publish a [Placeholder] post in the Studio",
    );
  });

  it("fails when no job is found", () => {
    const result = summarize({ post, job: null, draftCount: 0 });
    expect(result.ok).toBe(false);
    expect(result.lines.join("\n")).toContain(
      "no job found — publish a [Placeholder] job in the Studio",
    );
  });

  it("fails when a draft can be read without a token", () => {
    const result = summarize({ post, job, draftCount: 1 });
    expect(result.ok).toBe(false);
    expect(result.lines.join("\n")).toContain(
      "draft documents are readable without a token (1)",
    );
  });

  it("reports every problem at once", () => {
    const result = summarize({ post: null, job: null, draftCount: 2 });
    expect(result.ok).toBe(false);
    expect(result.lines.filter((l) => l.startsWith("FAIL"))).toHaveLength(3);
  });
});
