// @vitest-environment node
import { describe, expect, it } from "vitest";
import type { LatestPost } from "./latest-posts";
import { moreStories } from "./more-stories";

const post = (slug: string, publishedAt: string, category: string) =>
  ({ slug, title: slug, publishedAt, category }) as LatestPost;

const posts = [
  post("a", "2026-01-01", "company"),
  post("b", "2026-05-01", "schools"),
  post("c", "2026-03-01", "company"),
  post("d", "2026-06-01", "parents"),
  post("e", "2026-04-01", "schools"),
];

describe("moreStories", () => {
  it("leaves out the current story and puts the same audience first, newest first", () => {
    expect(moreStories(posts, posts[1]).map((p) => p.slug)).toEqual([
      "e",
      "d",
      "c",
    ]);
  });

  it("fills with the newest others when the audience has none", () => {
    expect(
      moreStories(posts, post("x", "2026-07-01", "students")).map(
        (p) => p.slug,
      ),
    ).toEqual(["d", "b", "e"]);
  });

  it("returns at most the count asked for, and none when alone", () => {
    expect(moreStories(posts, posts[0], 2)).toHaveLength(2);
    expect(moreStories([posts[0]], posts[0])).toEqual([]);
  });
});
