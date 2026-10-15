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

    // Allows this project's Sanity images for optimized use; the life photos
    // are `unoptimized`, so this list is not checked for them (Story 6.3).
    expect(nextConfig).toEqual({
      experimental: { globalNotFound: true },
      redirects: expect.any(Function),
      images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "cdn.sanity.io",
            pathname: "/images/1khn3hf4/**",
          },
        ],
      },
    });
  });
});
