// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";

// next.config.ts runs the Sanity config check when Next.js loads it.
describe("next.config.ts", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("stops with the missing variable's name", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "");
    vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "production");

    await expect(import("../../../next.config")).rejects.toThrow(
      /Missing NEXT_PUBLIC_SANITY_PROJECT_ID/,
    );
  });

  it("loads when both variables are set", async () => {
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "abc123");
    vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "production");

    const { default: nextConfig } = await import("../../../next.config");

    expect(nextConfig).toEqual({});
  });
});
