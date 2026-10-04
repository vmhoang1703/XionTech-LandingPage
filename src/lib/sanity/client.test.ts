// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { fetchMock, createClientMock } = vi.hoisted(() => {
  const fetchMock = vi.fn();
  return {
    fetchMock,
    createClientMock: vi.fn(() => ({ fetch: fetchMock })),
  };
});

vi.mock("server-only", () => ({}));
vi.mock("@sanity/client", () => ({ createClient: createClientMock }));

describe("sanityFetch", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "abc123");
    vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "production");
  });

  it("creates a client with no CDN, the published perspective and no token", async () => {
    const { sanityFetch } = await import("./client");
    fetchMock.mockResolvedValue([]);

    await sanityFetch({ query: "*", tags: ["post"] });

    expect(createClientMock).toHaveBeenCalledTimes(1);
    const config = (
      createClientMock.mock.calls as unknown as [Record<string, unknown>][]
    )[0][0];
    expect(config).toEqual({
      projectId: "abc123",
      dataset: "production",
      apiVersion: "2025-02-19",
      useCdn: false,
      perspective: "published",
    });
    expect(config).not.toHaveProperty("token");
  });

  it("passes the query, params, force-cache and tags to the client", async () => {
    const { sanityFetch } = await import("./client");
    fetchMock.mockResolvedValue([{ _id: "1" }]);

    const result = await sanityFetch<{ _id: string }[]>({
      query: "*[_type == $type]",
      params: { type: "job" },
      tags: ["job"],
    });

    expect(result).toEqual([{ _id: "1" }]);
    expect(fetchMock).toHaveBeenCalledWith(
      "*[_type == $type]",
      { type: "job" },
      { cache: "force-cache", next: { tags: ["job"] } },
    );
  });

  it("defaults params to an empty object", async () => {
    const { sanityFetch } = await import("./client");
    fetchMock.mockResolvedValue([]);

    await sanityFetch({ query: "*", tags: ["post"] });

    expect(fetchMock).toHaveBeenCalledWith("*", {}, expect.any(Object));
  });

  it("rethrows a Sanity error with context", async () => {
    const { sanityFetch } = await import("./client");
    fetchMock.mockRejectedValue(new Error("boom"));

    const failure = await sanityFetch({ query: "*", tags: ["post"] }).catch(
      (error: unknown) => error,
    );

    expect(failure).toBeInstanceOf(Error);
    expect((failure as Error).message).toBe(
      "Sanity fetch failed for tags [post]",
    );
    expect((failure as Error).cause).toEqual(new Error("boom"));
  });
});
