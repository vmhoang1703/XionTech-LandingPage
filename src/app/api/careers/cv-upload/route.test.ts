// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CV_MAX_BYTES, CV_TYPES } from "@/lib/careers/application-rules";

const { handleUploadMock, checkUploadLimitMock, ipAddressMock } = vi.hoisted(
  () => ({
    handleUploadMock: vi.fn(),
    checkUploadLimitMock: vi.fn(),
    ipAddressMock: vi.fn(),
  }),
);

vi.mock("@vercel/blob/client", () => ({ handleUpload: handleUploadMock }));
vi.mock("@vercel/functions", () => ({ ipAddress: ipAddressMock }));
vi.mock("@/lib/contact/delivery", () => ({
  checkUploadLimit: checkUploadLimitMock,
}));

import { POST } from "./route";

const TOKEN = "test-only-blob-token";

function post(body: unknown): Request {
  return new Request("https://site.test/api/careers/cv-upload", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function tokenBody(pathname: string) {
  return {
    type: "blob.generate-client-token",
    payload: { pathname, clientPayload: null, multipart: false },
  };
}

describe("POST /api/careers/cv-upload", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", TOKEN);
    ipAddressMock.mockReturnValue("203.0.113.9");
    checkUploadLimitMock.mockResolvedValue(true);
    handleUploadMock.mockResolvedValue({
      type: "blob.generate-client-token",
      clientToken: "client-token",
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
    ["unknown type", { type: "other" }],
    ["no payload", { type: "blob.generate-client-token" }],
    [
      "pathname not a string",
      { type: "blob.generate-client-token", payload: { pathname: 5 } },
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

  it("answers 500 and logs the variable name when the token is not set", async () => {
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", "");
    const response = await POST(post(tokenBody("cv/application.pdf")));
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "send" });
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(String(errorSpy.mock.calls[0])).toContain("BLOB_READ_WRITE_TOKEN");
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
    "issues a token for .%s with the fixed options",
    async (extension, mime) => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-10-04T10:00:00Z"));
      try {
        const body = tokenBody(`cv/application.${extension}`);
        const response = await POST(post(body));
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
          type: "blob.generate-client-token",
          clientToken: "client-token",
        });

        const options = handleUploadMock.mock.calls[0][0];
        expect(options.token).toBe(TOKEN);
        expect(options.body).toEqual(body);
        expect(options.request).toBeInstanceOf(Request);
        expect(options.onUploadCompleted).toBeUndefined();
        const settings = await options.onBeforeGenerateToken(
          `cv/application.${extension}`,
          null,
          false,
        );
        expect(settings).toEqual({
          allowedContentTypes: [mime],
          maximumSizeInBytes: CV_MAX_BYTES,
          addRandomSuffix: true,
          validUntil: Date.now() + 10 * 60_000,
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
    expect(line).not.toContain(TOKEN);
  });

  it("logs 'unknown' when a non-error is thrown", async () => {
    handleUploadMock.mockRejectedValue("text");
    const response = await POST(post(tokenBody("cv/application.pdf")));
    expect(response.status).toBe(502);
    expect(errorSpy.mock.calls[0].join(" ")).toContain("unknown");
  });
});
