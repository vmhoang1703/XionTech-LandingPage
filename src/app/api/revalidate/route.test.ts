// @vitest-environment node
import { encodeSignatureHeader, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { revalidateTagMock } = vi.hoisted(() => ({
  revalidateTagMock: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidateTag: revalidateTagMock }));

import { POST } from "./route";

const SECRET = "test-only-fake-secret";

async function signedRequest(body: string, secret = SECRET): Promise<Request> {
  const signature = await encodeSignatureHeader(body, Date.now(), secret);
  return new Request("http://localhost/api/revalidate", {
    method: "POST",
    headers: { [SIGNATURE_HEADER_NAME]: signature },
    body,
  });
}

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    vi.stubEnv("SANITY_REVALIDATE_SECRET", SECRET);
  });

  it.each(["post", "job"])(
    "revalidates the %s tag with the max profile for a signed request",
    async (type) => {
      const response = await POST(
        await signedRequest(JSON.stringify({ _type: type })),
      );

      expect(response.status).toBe(200);
      expect(revalidateTagMock).toHaveBeenCalledTimes(1);
      expect(revalidateTagMock).toHaveBeenCalledWith(type, "max");
    },
  );

  it("returns 401 when the signature was made with another secret", async () => {
    const response = await POST(
      await signedRequest(JSON.stringify({ _type: "post" }), "wrong-secret"),
    );

    expect(response.status).toBe(401);
    expect(revalidateTagMock).not.toHaveBeenCalled();
  });

  it("returns 401 when the signature header is missing", async () => {
    const response = await POST(
      new Request("http://localhost/api/revalidate", {
        method: "POST",
        body: JSON.stringify({ _type: "post" }),
      }),
    );

    expect(response.status).toBe(401);
    expect(revalidateTagMock).not.toHaveBeenCalled();
  });

  it("returns 401 when the body was changed after signing", async () => {
    const signed = await signedRequest(JSON.stringify({ _type: "post" }));
    const response = await POST(
      new Request("http://localhost/api/revalidate", {
        method: "POST",
        headers: {
          [SIGNATURE_HEADER_NAME]: signed.headers.get(SIGNATURE_HEADER_NAME)!,
        },
        body: JSON.stringify({ _type: "job" }),
      }),
    );

    expect(response.status).toBe(401);
    expect(revalidateTagMock).not.toHaveBeenCalled();
  });

  it.each([
    ["unset", undefined],
    ["empty", ""],
  ])(
    "returns 500 and logs without values when the secret is %s",
    async (_label, value) => {
      vi.stubEnv("SANITY_REVALIDATE_SECRET", value);
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const body = JSON.stringify({ _type: "post" });

      const response = await POST(await signedRequest(body));

      expect(response.status).toBe(500);
      expect(await response.text()).toMatch(/not configured/);
      expect(revalidateTagMock).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledTimes(1);
      const logged = errorSpy.mock.calls.flat().join(" ");
      expect(logged).not.toContain(SECRET);
      expect(logged).not.toContain(body);
      errorSpy.mockRestore();
    },
  );

  it("returns 400 for a signed body with an unknown type", async () => {
    const response = await POST(
      await signedRequest(JSON.stringify({ _type: "page" })),
    );

    expect(response.status).toBe(400);
    expect(revalidateTagMock).not.toHaveBeenCalled();
  });

  it.each([
    ["bad JSON", "{not json"],
    ["JSON null", "null"],
    ["no _type", JSON.stringify({ title: "x" })],
  ])("returns 400 for a signed body with %s", async (_label, body) => {
    const response = await POST(await signedRequest(body));

    expect(response.status).toBe(400);
    expect(revalidateTagMock).not.toHaveBeenCalled();
  });
});
