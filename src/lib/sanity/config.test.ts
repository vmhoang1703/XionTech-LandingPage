// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

import { getSanityConfig } from "./config";

describe("getSanityConfig", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns the project ID, dataset and a fixed API version", () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "abc123");
    vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "production");

    expect(getSanityConfig()).toEqual({
      projectId: "abc123",
      dataset: "production",
      apiVersion: "2025-02-19",
    });
  });

  it("throws a message naming NEXT_PUBLIC_SANITY_PROJECT_ID when it is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "");
    vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "production");

    expect(() => getSanityConfig()).toThrow(
      /Missing NEXT_PUBLIC_SANITY_PROJECT_ID/,
    );
  });

  it("throws a message naming NEXT_PUBLIC_SANITY_DATASET when it is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "abc123");
    vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "");

    expect(() => getSanityConfig()).toThrow(
      /Missing NEXT_PUBLIC_SANITY_DATASET/,
    );
  });
});
