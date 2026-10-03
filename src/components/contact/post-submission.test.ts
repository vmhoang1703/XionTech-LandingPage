import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { postSubmission, SEND_TIMEOUT_MS } from "./post-submission";

const fetchMock = vi.fn();
const reply = (status: number, body: unknown) =>
  Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("postSubmission", () => {
  it("posts the payload as JSON to the contact route and reports sent on a 200", async () => {
    fetchMock.mockReturnValue(reply(200, { ok: true }));
    const payload = { type: "capture", kind: "demo", email: "ana@gmail.com" };

    await expect(postSubmission(payload)).resolves.toEqual({ kind: "sent" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/contact");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ "Content-Type": "application/json" });
    expect(JSON.parse(init.body)).toEqual(payload);
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("reports rate on a 429", async () => {
    fetchMock.mockReturnValue(reply(429, { error: "rate" }));
    await expect(postSubmission({})).resolves.toEqual({ kind: "rate" });
  });

  it("reports the field errors of a 400, in form order, known fields only", async () => {
    fetchMock.mockReturnValue(
      reply(400, {
        errors: {
          message: "Please keep your message under 2,000 characters.",
          email: "Please enter a valid email address.",
          name: "",
          org: 42,
          unknown: "Ignored",
        },
      }),
    );

    const result = await postSubmission({});

    expect(result).toEqual({
      kind: "errors",
      errors: {
        email: "Please enter a valid email address.",
        message: "Please keep your message under 2,000 characters.",
      },
    });
    expect(result.kind === "errors" ? Object.keys(result.errors) : []).toEqual([
      "email",
      "message",
    ]);
  });

  it.each([
    ["a 400 with no errors object", { error: "send" }],
    ["a 400 with an empty errors object", { errors: {} }],
    ["a 400 whose errors are not an object", { errors: "email" }],
    ["a 400 whose errors hold no known field", { errors: { other: "x" } }],
    ["a 400 whose body is not an object", "nope"],
  ])("reports send for %s", async (_name, body) => {
    fetchMock.mockReturnValue(reply(400, body));
    await expect(postSubmission({})).resolves.toEqual({ kind: "send" });
  });

  it("reports send for a 400 whose body is not JSON", async () => {
    fetchMock.mockReturnValue(
      Promise.resolve(new Response("<html>", { status: 400 })),
    );
    await expect(postSubmission({})).resolves.toEqual({ kind: "send" });
  });

  it.each([500, 502, 404])("reports send for a %i", async (status) => {
    fetchMock.mockReturnValue(reply(status, { error: "send" }));
    await expect(postSubmission({})).resolves.toEqual({ kind: "send" });
  });

  it("reports send when the network fails", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(postSubmission({})).resolves.toEqual({ kind: "send" });
  });

  it("aborts after 15 seconds and reports send", async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
        }),
    );
    let result: unknown;
    void postSubmission({}).then((value) => {
      result = value;
    });

    expect(SEND_TIMEOUT_MS).toBe(15_000);
    await vi.advanceTimersByTimeAsync(14_999);
    expect(result).toBeUndefined();
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
    expect(result).toEqual({ kind: "send" });
  });

  it("clears the timeout once the request is answered", async () => {
    vi.useFakeTimers();
    fetchMock.mockReturnValue(reply(200, { ok: true }));

    await postSubmission({});

    expect(vi.getTimerCount()).toBe(0);
    expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(false);
  });
});
