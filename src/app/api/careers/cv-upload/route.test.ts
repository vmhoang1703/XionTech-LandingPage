// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CV_MAX_BYTES, CV_TYPES } from "@/lib/careers/application-rules";

const {
  handleUploadMock,
  issueSignedTokenMock,
  checkUploadLimitMock,
  ipAddressMock,
} = vi.hoisted(() => ({
  handleUploadMock: vi.fn(),
  issueSignedTokenMock: vi.fn(),
  checkUploadLimitMock: vi.fn(),
  ipAddressMock: vi.fn(),
}));

vi.mock("@vercel/blob", () => ({ issueSignedToken: issueSignedTokenMock }));
vi.mock("@vercel/blob/client", () => ({
  handleUploadPresigned: handleUploadMock,
}));
vi.mock("@vercel/functions", () => ({ ipAddress: ipAddressMock }));
vi.mock("@/lib/contact/delivery", () => ({
  checkUploadLimit: checkUploadLimitMock,
}));

import { POST } from "./route";

const STORE_ID = "store_test";
const WEBHOOK_KEY = "test-only-webhook-key";

function post(body: unknown): Request {
  return new Request("https://site.test/api/careers/cv-upload", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function tokenBody(pathname: string) {
  return {
    type: "blob.generate-presigned-url",
    payload: { pathname, clientPayload: null, multipart: false },
  };
}

describe("POST /api/careers/cv-upload", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.stubEnv("BLOB_STORE_ID", STORE_ID);
    vi.stubEnv("BLOB_WEBHOOK_PUBLIC_KEY", WEBHOOK_KEY);
    ipAddressMock.mockReturnValue("203.0.113.9");
    checkUploadLimitMock.mockResolvedValue(true);
    issueSignedTokenMock.mockResolvedValue({ signed: "token" });
    handleUploadMock.mockResolvedValue({
      type: "blob.generate-presigned-url",
      presignedUrlPayload: { url: "https://blob.test/put" },
    });
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
    errorSpy.mockRestore();
  });

  it.each([
    ["not JSON", "{nope"],
    ["not an object", "null"],
    ["upload-completed event", { type: "blob.upload-completed", payload: {} }],
    [
      "old client-token event",
      {
        type: "blob.generate-client-token",
        payload: { pathname: "cv/application.pdf" },
      },
    ],
    ["unknown type", { type: "other" }],
    ["no payload", { type: "blob.generate-presigned-url" }],
    [
      "payload not an object",
      { type: "blob.generate-presigned-url", payload: "cv" },
    ],
    [
      "pathname not a string",
      { type: "blob.generate-presigned-url", payload: { pathname: 5 } },
    ],
    [
      "multipart upload",
      {
        type: "blob.generate-presigned-url",
        payload: { pathname: "cv/application.pdf", multipart: true },
      },
    ],
  ])("answers 400 for a body that is %s", async (_label, body) => {
    const response = await POST(post(body));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "send" });
    expect(handleUploadMock).not.toHaveBeenCalled();
  });

  it.each([
    "cv/application.png",
    "cv/application.PDF",
    "cv/other.pdf",
    "cv/application.pdf/extra",
    "application.pdf",
    "cv/application",
    "../cv/application.pdf",
  ])("answers 400 for the path %s", async (pathname) => {
    const response = await POST(post(tokenBody(pathname)));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "send" });
    expect(checkUploadLimitMock).not.toHaveBeenCalled();
    expect(handleUploadMock).not.toHaveBeenCalled();
  });

  it.each([
    ["BLOB_STORE_ID", "", WEBHOOK_KEY],
    ["BLOB_WEBHOOK_PUBLIC_KEY", STORE_ID, ""],
  ])("answers 500 and logs %s when it is not set", async (name, id, key) => {
    vi.stubEnv("BLOB_STORE_ID", id);
    vi.stubEnv("BLOB_WEBHOOK_PUBLIC_KEY", key);
    const response = await POST(post(tokenBody("cv/application.pdf")));
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "send" });
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(String(errorSpy.mock.calls[0])).toContain(name);
    expect(handleUploadMock).not.toHaveBeenCalled();
  });

  it("answers 429 when the upload limit is used up", async () => {
    checkUploadLimitMock.mockResolvedValue(false);
    const response = await POST(post(tokenBody("cv/application.pdf")));
    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({ error: "rate" });
    expect(checkUploadLimitMock).toHaveBeenCalledWith("203.0.113.9");
    expect(handleUploadMock).not.toHaveBeenCalled();
  });

  it.each(Object.entries(CV_TYPES))(
    "issues a presigned URL for .%s with the fixed options",
    async (extension, mime) => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-10-04T10:00:00Z"));
      try {
        const pathname = `cv/application.${extension}`;
        const response = await POST(post(tokenBody(pathname)));
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
          type: "blob.generate-presigned-url",
          presignedUrlPayload: { url: "https://blob.test/put" },
        });

        const options = handleUploadMock.mock.calls[0][0];
        expect(options.webhookPublicKey).toBe(WEBHOOK_KEY);
        expect(options.body).toEqual(tokenBody(pathname));
        expect(options.request).toBeInstanceOf(Request);
        expect(options.onUploadCompleted).toBeUndefined();

        const signed = await options.getSignedToken(pathname, null, false);
        const validUntil = Date.now() + 10 * 60_000;
        expect(issueSignedTokenMock).toHaveBeenCalledWith({
          pathname,
          operations: ["put"],
          allowedContentTypes: [mime],
          maximumSizeInBytes: CV_MAX_BYTES,
          validUntil,
          storeId: STORE_ID,
        });
        expect(issueSignedTokenMock.mock.calls[0][0]).not.toHaveProperty(
          "token",
        );
        expect(signed).toEqual({
          token: { signed: "token" },
          urlOptions: {
            addRandomSuffix: true,
            allowedContentTypes: [mime],
            maximumSizeInBytes: CV_MAX_BYTES,
            validUntil,
          },
        });
      } finally {
        vi.useRealTimers();
      }
    },
  );

  it("answers 502 and logs the error class only when handleUpload throws", async () => {
    handleUploadMock.mockRejectedValue(new TypeError("secret detail"));
    const response = await POST(post(tokenBody("cv/application.pdf")));
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "send" });
    expect(errorSpy).toHaveBeenCalledTimes(1);
    const line = errorSpy.mock.calls[0].join(" ");
    expect(line).toContain("TypeError");
    expect(line).not.toContain("secret detail");
    expect(line).not.toContain(WEBHOOK_KEY);
  });
});
