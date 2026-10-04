import { afterEach, describe, expect, it, vi } from "vitest";
import { CV_PATH_PREFIX, getBlobConfig } from "./cv-storage";

describe("cv-storage", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("keeps CVs under the cv/ prefix", () => {
    expect(CV_PATH_PREFIX).toBe("cv/");
  });

  it("returns the store id and the webhook public key", () => {
    vi.stubEnv("BLOB_STORE_ID", "store_test");
    vi.stubEnv("BLOB_WEBHOOK_PUBLIC_KEY", "key-test");
    expect(getBlobConfig()).toEqual({
      storeId: "store_test",
      webhookPublicKey: "key-test",
    });
  });

  it.each([
    ["BLOB_STORE_ID", "", "key-test"],
    ["BLOB_WEBHOOK_PUBLIC_KEY", "store_test", ""],
  ])("throws naming %s when it is missing", (name, storeId, key) => {
    vi.stubEnv("BLOB_STORE_ID", storeId);
    vi.stubEnv("BLOB_WEBHOOK_PUBLIC_KEY", key);
    expect(() => getBlobConfig()).toThrow(`${name} is not set`);
  });
});
