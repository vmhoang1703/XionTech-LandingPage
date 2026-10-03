// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { sanityFetchMock } = vi.hoisted(() => ({ sanityFetchMock: vi.fn() }));

vi.mock("@/lib/sanity/client", () => ({ sanityFetch: sanityFetchMock }));

import { getOpenRoles, roleMeta } from "./open-roles";

describe("getOpenRoles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches with the job tag and the closed, slug and title filter", async () => {
    sanityFetchMock.mockResolvedValue([]);

    await getOpenRoles();

    expect(sanityFetchMock).toHaveBeenCalledTimes(1);
    const { query, tags } = sanityFetchMock.mock.calls[0][0];
    expect(tags).toEqual(["job"]);
    expect(query).toContain(
      '*[_type == "job" && closed != true && defined(slug.current) && defined(title.en)]',
    );
    expect(query).toContain("order(title.en asc)");
  });

  it("returns the roles from the fetch", async () => {
    const roles = [
      {
        slug: "qa-engineer",
        title: "QA Engineer",
        team: "Engineering",
        location: "Ho Chi Minh City",
        type: "full-time",
      },
    ];
    sanityFetchMock.mockResolvedValue(roles);

    await expect(getOpenRoles()).resolves.toEqual(roles);
  });

  it("lets a fetch error propagate", async () => {
    const error = new Error("Sanity fetch failed for tags [job]");
    sanityFetchMock.mockRejectedValue(error);

    await expect(getOpenRoles()).rejects.toBe(error);
  });
});

describe("roleMeta", () => {
  it("joins team, location and the type label with a dot", () => {
    expect(
      roleMeta({
        slug: "a",
        title: "A",
        team: "Engineering",
        location: "Hanoi",
        type: "full-time",
      }),
    ).toBe("Engineering · Hanoi · Full-time");
  });

  it.each([
    ["part-time", "Part-time"],
    ["contract", "Contract"],
    ["internship", "Internship"],
  ])("maps %s to %s", (type, label) => {
    expect(roleMeta({ slug: "a", title: "A", type })).toBe(label);
  });

  it("leaves out missing parts without a stray separator", () => {
    expect(
      roleMeta({ slug: "a", title: "A", location: "Hanoi", type: "contract" }),
    ).toBe("Hanoi · Contract");
    expect(roleMeta({ slug: "a", title: "A", team: "Engineering" })).toBe(
      "Engineering",
    );
  });

  it("leaves out an unknown type", () => {
    expect(
      roleMeta({ slug: "a", title: "A", location: "Hanoi", type: "weekend" }),
    ).toBe("Hanoi");
  });

  it("returns an empty string when no part is present", () => {
    expect(roleMeta({ slug: "a", title: "A", type: null })).toBe("");
  });
});
