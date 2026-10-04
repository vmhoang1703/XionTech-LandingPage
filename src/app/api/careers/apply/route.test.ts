// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { JOB_ERRORS } from "@/lib/careers/application-rules";

const {
  delMock,
  getMock,
  getOpenRoleMock,
  getDeliveryConfigMock,
  checkRateLimitsMock,
  sendApplicationMailMock,
  ipAddressMock,
} = vi.hoisted(() => ({
  delMock: vi.fn(),
  getMock: vi.fn(),
  getOpenRoleMock: vi.fn(),
  getDeliveryConfigMock: vi.fn(),
  checkRateLimitsMock: vi.fn(),
  sendApplicationMailMock: vi.fn(),
  ipAddressMock: vi.fn(),
}));

vi.mock("@vercel/blob", () => ({ del: delMock, get: getMock }));
vi.mock("@vercel/functions", () => ({ ipAddress: ipAddressMock }));
vi.mock("@/lib/careers/open-roles", () => ({ getOpenRole: getOpenRoleMock }));
vi.mock("@/lib/contact/delivery", () => ({
  getDeliveryConfig: getDeliveryConfigMock,
  checkRateLimits: checkRateLimitsMock,
  sendApplicationMail: sendApplicationMailMock,
}));

import { POST, maxDuration } from "./route";

const STORE_ID = "store_test";
const CONFIG = { inbox: "inbox@example.test" };
const PDF = "application/pdf";

function post(body: unknown): Request {
  return new Request("https://site.test/api/careers/apply", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const valid = {
  slug: "backend-engineer",
  name: "Nam Tran",
  email: "nam@example.test",
  phone: "0900000000",
  note: "Hello",
  cv: "cv/application-abc123.pdf",
  website: "",
};

function blobResult(overrides: Partial<{ size: number; contentType: string }>) {
  const cancel = vi.fn();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new Uint8Array([1, 2]));
      controller.enqueue(new Uint8Array([3]));
      controller.close();
    },
    cancel,
  });
  return {
    cancel,
    result: {
      statusCode: 200,
      stream,
      blob: { size: 3, contentType: PDF, ...overrides },
    },
  };
}

describe("POST /api/careers/apply", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.stubEnv("BLOB_STORE_ID", STORE_ID);
    vi.stubEnv("BLOB_WEBHOOK_PUBLIC_KEY", "key-test");
    ipAddressMock.mockReturnValue("203.0.113.9");
    getDeliveryConfigMock.mockReturnValue(CONFIG);
    getOpenRoleMock.mockResolvedValue({
      slug: "backend-engineer",
      title: "Backend Engineer",
      team: "Engineering",
    });
    checkRateLimitsMock.mockResolvedValue(true);
    getMock.mockResolvedValue(blobResult({}).result);
    sendApplicationMailMock.mockResolvedValue(undefined);
    delMock.mockResolvedValue(undefined);
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
    errorSpy.mockRestore();
  });

  it("allows 30 seconds", () => {
    expect(maxDuration).toBe(30);
  });

  it.each([
    ["not JSON", "{nope"],
    ["not an object", "null"],
    ["a CV path outside cv/", { ...valid, cv: "other/x.pdf" }],
  ])("answers 400 send for a body that is %s", async (_label, body) => {
    const response = await POST(post(body));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "send" });
    expect(getDeliveryConfigMock).not.toHaveBeenCalled();
  });

  it("answers a honeypot with 200, no rate limit, no mail", async () => {
    vi.unstubAllEnvs();
    const response = await POST(post({ ...valid, website: "http://spam" }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(getDeliveryConfigMock).not.toHaveBeenCalled();
    expect(checkRateLimitsMock).not.toHaveBeenCalled();
    expect(sendApplicationMailMock).not.toHaveBeenCalled();
  });

  it("answers 500 when a mail variable is missing", async () => {
    getDeliveryConfigMock.mockImplementation(() => {
      throw new Error("GMAIL_APP_PASSWORD is not set");
    });
    const response = await POST(post(valid));
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "send" });
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(String(errorSpy.mock.calls[0])).toContain("GMAIL_APP_PASSWORD");
  });

  it.each([
    // The missing store id also skips the CV delete, with its own log line.
    ["BLOB_STORE_ID", 1],
    ["BLOB_WEBHOOK_PUBLIC_KEY", 1],
  ])("answers 500 when %s is missing", async (name, lines) => {
    vi.stubEnv(name, "");
    const response = await POST(post(valid));
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "send" });
    expect(errorSpy).toHaveBeenCalledTimes(lines);
    expect(String(errorSpy.mock.calls[0])).toContain(name);
    expect(getOpenRoleMock).not.toHaveBeenCalled();
  });

  it("answers 400 with field errors", async () => {
    const response = await POST(post({ ...valid, name: "", email: "nope" }));
    expect(response.status).toBe(400);
    expect((await response.json()).errors).toEqual({
      name: JOB_ERRORS.name,
      email: JOB_ERRORS.email,
    });
    expect(getOpenRoleMock).not.toHaveBeenCalled();
  });

  it("answers 400 send when the role is not open", async () => {
    getOpenRoleMock.mockResolvedValue(null);
    const response = await POST(post(valid));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "send" });
    expect(getOpenRoleMock).toHaveBeenCalledWith("backend-engineer");
    expect(checkRateLimitsMock).toHaveBeenCalled();
  });

  it("answers 502 and logs the class when the role lookup throws", async () => {
    getOpenRoleMock.mockRejectedValue(new TypeError("secret detail"));
    const response = await POST(post(valid));
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "send" });
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(String(errorSpy.mock.calls[0])).toContain("TypeError");
    expect(String(errorSpy.mock.calls[0])).not.toContain("secret");
  });

  it("answers 429 when rate limited", async () => {
    checkRateLimitsMock.mockResolvedValue(false);
    const response = await POST(post(valid));
    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({ error: "rate" });
    expect(checkRateLimitsMock).toHaveBeenCalledWith(
      "203.0.113.9",
      "nam@example.test",
    );
    expect(getOpenRoleMock).not.toHaveBeenCalled();
    expect(getMock).not.toHaveBeenCalled();
  });

  it("answers 400 cv when the blob is missing", async () => {
    getMock.mockResolvedValue(null);
    const response = await POST(post(valid));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ errors: { cv: JOB_ERRORS.cv } });
    expect(sendApplicationMailMock).not.toHaveBeenCalled();
  });

  it.each([
    ["too big", { size: 5 * 1024 * 1024 + 1 }],
    ["the wrong type", { contentType: "image/png" }],
  ])(
    "answers 400 cv and cancels the stream when the blob is %s",
    async (_label, overrides) => {
      const { result, cancel } = blobResult(overrides);
      getMock.mockResolvedValue(result);
      const response = await POST(post(valid));
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ errors: { cv: JOB_ERRORS.cv } });
      expect(cancel).toHaveBeenCalled();
      expect(sendApplicationMailMock).not.toHaveBeenCalled();
    },
  );

  it("answers 400 cv for a 304 result with no stream", async () => {
    getMock.mockResolvedValue({
      statusCode: 304,
      stream: null,
      blob: { size: null, contentType: null },
    });
    const response = await POST(post(valid));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ errors: { cv: JOB_ERRORS.cv } });
  });

  it("answers 502 when reading the blob throws", async () => {
    getMock.mockRejectedValue(new RangeError("x"));
    const response = await POST(post(valid));
    expect(response.status).toBe(502);
    expect(String(errorSpy.mock.calls[0])).toContain("RangeError");
  });

  it("answers 502 when the stream cannot be read", async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.error(new Error("broken"));
      },
    });
    getMock.mockResolvedValue({
      statusCode: 200,
      stream,
      blob: { size: 3, contentType: PDF },
    });
    const response = await POST(post(valid));
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "send" });
    expect(sendApplicationMailMock).not.toHaveBeenCalled();
  });

  it("answers 502 and logs class and code when the mail fails", async () => {
    sendApplicationMailMock.mockRejectedValue(
      Object.assign(new Error("nam@example.test refused"), { code: "EAUTH" }),
    );
    const response = await POST(post(valid));
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "send" });
    expect(errorSpy).toHaveBeenCalledTimes(1);
    const line = String(errorSpy.mock.calls[0]);
    expect(line).toContain("Error EAUTH");
    expect(line).not.toContain("nam@example.test");
  });

  it("sends the mail with the role from the store and the CV bytes", async () => {
    const response = await POST(post(valid));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(getMock).toHaveBeenCalledWith("cv/application-abc123.pdf", {
      access: "private",
      storeId: STORE_ID,
      useCache: false,
    });
    expect(sendApplicationMailMock).toHaveBeenCalledWith(CONFIG, {
      role: { slug: "backend-engineer", title: "Backend Engineer" },
      name: "Nam Tran",
      email: "nam@example.test",
      phone: "0900000000",
      note: "Hello",
      cv: {
        pathname: "cv/application-abc123.pdf",
        size: 3,
        contentType: PDF,
        content: Buffer.from([1, 2, 3]),
      },
    });
  });

  describe("deletes the uploaded CV when no mail is sent after the rate limits", () => {
    const failures: [string, unknown, () => void][] = [
      ["a closed role", valid, () => getOpenRoleMock.mockResolvedValue(null)],
      [
        "a failed role lookup",
        valid,
        () => getOpenRoleMock.mockRejectedValue(new Error("x")),
      ],
      ["a wrong stored CV", valid, () => getMock.mockResolvedValue(null)],
      [
        "a failed CV read",
        valid,
        () => getMock.mockRejectedValue(new Error("x")),
      ],
      [
        "a failed mail",
        valid,
        () => sendApplicationMailMock.mockRejectedValue(new Error("x")),
      ],
    ];

    it.each(failures)("after %s", async (_label, body, arrange) => {
      arrange();
      await POST(post(body));
      expect(delMock).toHaveBeenCalledTimes(1);
      expect(delMock).toHaveBeenCalledWith("cv/application-abc123.pdf", {
        storeId: STORE_ID,
        abortSignal: expect.any(AbortSignal),
      });
    });

    it("keeps the CV when the mail is sent", async () => {
      const response = await POST(post(valid));
      expect(response.status).toBe(200);
      expect(delMock).not.toHaveBeenCalled();
    });

    it.each([
      ["no CV path", { ...valid, cv: undefined }],
      ["a CV path outside cv/", { ...valid, cv: "other/x.pdf" }],
      ["a body that is not JSON", "{nope"],
      ["a bad body with a CV path", { ...valid, phone: "1".repeat(201) }],
      ["a honeypot", { ...valid, website: "http://spam" }],
      ["field errors", { ...valid, name: "" }],
    ])("deletes nothing for %s", async (_label, body) => {
      await POST(post(body));
      expect(delMock).not.toHaveBeenCalled();
    });

    it.each([
      [
        "a missing mail variable",
        () =>
          getDeliveryConfigMock.mockImplementation(() => {
            throw new Error("GMAIL_USER is not set");
          }),
      ],
      ["a rate limit", () => checkRateLimitsMock.mockResolvedValue(false)],
    ])("deletes nothing after %s", async (_label, arrange) => {
      arrange();
      await POST(post(valid));
      expect(delMock).not.toHaveBeenCalled();
    });

    it("keeps the answer and logs only the error class when the delete fails", async () => {
      getOpenRoleMock.mockResolvedValue(null);
      delMock.mockRejectedValue(
        new TypeError("cv/application-abc123.pdf gone"),
      );
      const response = await POST(post(valid));
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: "send" });
      expect(errorSpy).toHaveBeenCalledTimes(1);
      const line = String(errorSpy.mock.calls[0]);
      expect(line).toContain("CV delete failed");
      expect(line).toContain("TypeError");
      expect(line).not.toContain("cv/");
    });
  });
});
