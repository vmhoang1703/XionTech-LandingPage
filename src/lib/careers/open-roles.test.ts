// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { sanityFetchMock } = vi.hoisted(() => ({ sanityFetchMock: vi.fn() }));

vi.mock("@/lib/sanity/client", () => ({ sanityFetch: sanityFetchMock }));

import {
  getOpenRole,
  getOpenRoles,
  roleMeta,
  roleTypeLabel,
} from "./open-roles";

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

  it("projects each role to flat strings: slug, title, team, location, type", async () => {
    sanityFetchMock.mockResolvedValue([]);

    await getOpenRoles();

    const { query } = sanityFetchMock.mock.calls[0][0];
    const projection = query.slice(query.indexOf("{"));
    for (const line of [
      '"slug": slug.current',
      '"title": select(length(title[$locale]) > 0 => title[$locale], title.en)',
      '"team": select(length(team[$locale]) > 0 => team[$locale], team.en)',
      '"location": select(length(location[$locale]) > 0 => location[$locale], location.en)',
    ]) {
      expect(projection).toContain(line);
    }
    expect(projection).toMatch(/[,{]\s*type\s*}/);
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

describe("getOpenRole", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches one role by slug with the job tag and the open filter", async () => {
    sanityFetchMock.mockResolvedValue(null);

    await getOpenRole("qa-engineer");

    expect(sanityFetchMock).toHaveBeenCalledTimes(1);
    const { query, params, tags } = sanityFetchMock.mock.calls[0][0];
    expect(tags).toEqual(["job"]);
    expect(params).toEqual({ slug: "qa-engineer", locale: "en" });
    expect(query).toContain(
      '*[_type == "job" && closed != true && defined(slug.current) && defined(title.en) && slug.current == $slug][0]',
    );
  });

  it("projects the plain text of the English description and the lists", async () => {
    sanityFetchMock.mockResolvedValue(null);

    await getOpenRole("qa-engineer");

    const { query } = sanityFetchMock.mock.calls[0][0];
    const projection = query.slice(query.indexOf("{", query.indexOf("[0]")));
    for (const line of [
      '"slug": slug.current',
      '"title": select(length(title[$locale]) > 0 => title[$locale], title.en)',
      '"team": select(length(team[$locale]) > 0 => team[$locale], team.en)',
      '"location": select(length(location[$locale]) > 0 => location[$locale], location.en)',
      '"about": pt::text(select(length(description[$locale]) > 0 => description[$locale], description.en))',
      '"responsibilities": select(length(responsibilities[$locale]) > 0 => responsibilities[$locale], responsibilities.en)',
      '"requirements": select(length(requirements[$locale]) > 0 => requirements[$locale], requirements.en)',
    ]) {
      expect(projection).toContain(line);
    }
    expect(projection).toMatch(/[,{]\s*type\s*[,}]/);
  });

  it("returns the role from the fetch", async () => {
    const role = {
      slug: "qa-engineer",
      title: "QA Engineer",
      team: "Engineering",
      location: "Ho Chi Minh City",
      type: "full-time",
      about: "Test our products.",
      responsibilities: ["Write tests"],
      requirements: ["2 years of QA"],
    };
    sanityFetchMock.mockResolvedValue(role);

    await expect(getOpenRole("qa-engineer")).resolves.toEqual(role);
  });

  it.each([[null], [[]], [undefined]])(
    "returns null when the fetch gives %j",
    async (result) => {
      sanityFetchMock.mockResolvedValue(result);

      await expect(getOpenRole("nope")).resolves.toBeNull();
    },
  );

  it("lets a fetch error propagate", async () => {
    const error = new Error("Sanity fetch failed for tags [job]");
    sanityFetchMock.mockRejectedValue(error);

    await expect(getOpenRole("a")).rejects.toBe(error);
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

  it.each(["constructor", "toString", "__proto__"])(
    "leaves out a type that names an object built-in (%s)",
    (type) => {
      expect(roleMeta({ slug: "a", title: "A", location: "Hanoi", type })).toBe(
        "Hanoi",
      );
    },
  );

  it("returns an empty string when no part is present", () => {
    expect(roleMeta({ slug: "a", title: "A", type: null })).toBe("");
  });
});

describe("roleTypeLabel", () => {
  it("maps a known type to its label", () => {
    expect(roleTypeLabel("full-time")).toBe("Full-time");
  });

  it.each([undefined, null, "", "weekend", "constructor"])(
    "gives undefined for %s",
    (type) => {
      expect(roleTypeLabel(type)).toBeUndefined();
    },
  );
});

describe("Vietnamese", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches roles with the locale and marks English fallbacks", async () => {
    sanityFetchMock.mockResolvedValue([]);

    await getOpenRoles("vi");

    const { query, params } = sanityFetchMock.mock.calls[0][0];
    expect(params).toEqual({ locale: "vi" });
    expect(query).toContain(
      '"titleLang": select(length(title[$locale]) > 0 => $locale, "en")',
    );
    for (const field of ["team", "location"]) {
      expect(query).toContain(
        `"${field}Lang": select(length(${field}[$locale]) > 0 => $locale, "en")`,
      );
    }
  });

  it("marks an English description fallback on one role", async () => {
    sanityFetchMock.mockResolvedValue(null);

    await getOpenRole("qa-engineer", "vi");

    const { query, params } = sanityFetchMock.mock.calls[0][0];
    expect(params).toEqual({ slug: "qa-engineer", locale: "vi" });
    expect(query).toContain(
      '"aboutLang": select(length(description[$locale]) > 0 => $locale, "en")',
    );
    for (const field of [
      "title",
      "team",
      "location",
      "responsibilities",
      "requirements",
    ]) {
      expect(query).toContain(
        `"${field}Lang": select(length(${field}[$locale]) > 0 => $locale, "en")`,
      );
    }
  });

  it("labels the role type and meta in Vietnamese", () => {
    expect(roleTypeLabel("full-time", "vi")).toBe("Toàn thời gian");
    expect(
      roleMeta({ slug: "a", title: "A", team: "QA", type: "internship" }, "vi"),
    ).toBe("QA · Thực tập");
  });
});
