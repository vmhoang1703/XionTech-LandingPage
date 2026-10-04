import { afterEach, describe, expect, it, vi } from "vitest";
import { CV_PATH_PREFIX, getBlobToken } from "./cv-storage";

describe("cv-storage", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("keeps CVs under the cv/ prefix", () => {
    expect(CV_PATH_PREFIX).toBe("cv/");
  });

  it("returns the Blob token", () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "test-only-token");
    expect(getBlobToken()).toBe("test-only-token");
  });

  it("throws an error naming the variable, not a value", () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "");
    expect(() => getBlobToken()).toThrow("BLOB_READ_WRITE_TOKEN is not set");
  });
});
