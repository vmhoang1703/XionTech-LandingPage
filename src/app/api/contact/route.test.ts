// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONTACT_STRINGS } from "@/components/contact/contact-strings";
import { CONTACT_ERRORS, LENGTH_ERROR } from "@/lib/contact/contact-rules";
import { ipRateLimitKey, rateLimitKey } from "@/lib/contact/delivery";

const {
  createTransportMock,
  sendMailMock,
  limitMock,
  ratelimitMock,
  slidingWindowMock,
  redisMock,
} = vi.hoisted(() => ({
  createTransportMock: vi.fn(),
  sendMailMock: vi.fn(),
  limitMock: vi.fn(),
  ratelimitMock: vi.fn(),
  slidingWindowMock: vi.fn(),
  redisMock: vi.fn(),
}));

vi.mock("nodemailer", () => ({ createTransport: createTransportMock }));
vi.mock("@upstash/redis", () => ({ Redis: redisMock }));
vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: Object.assign(ratelimitMock, {
    slidingWindow: slidingWindowMock,
  }),
}));

import { maxDuration, POST } from "./route";

const ENV = {
  CONTACT_INBOX: "inbox@example.test",
  GMAIL_USER: "sender@example.test",
  GMAIL_APP_PASSWORD: "test-only-app-password",
  KV_REST_API_URL: "https://store.example.test",
  KV_REST_API_TOKEN: "test-only-store-token",
};

const IP = "203.0.113.7";

// Midday UTC on 2026-10-10: the earliest local date on Earth is 2026-10-09.
const NOW = new Date("2026-10-10T12:00:00Z");

const VISITOR = {
  name: "Ana Tran",
  email: "ana@sunrise.edu",
  org: "Sunrise School",
};

const demoBody = {
  type: "demo",
  ...VISITOR,
  role: "Principal",
  message: "Hello",
  products: ["Parent Hub", "IoT"],
  schoolSize: CONTACT_STRINGS.schoolSizes[0],
  date: "2026-10-20",
  website: "",
};

const projectBody = {
  type: "project",
  ...VISITOR,
  role: "",
  message: "",
  service: CONTACT_STRINGS.services[0],
  startTiming: CONTACT_STRINGS.startTimings[0],
  website: "",
};

const generalBody = {
  type: "general",
  ...VISITOR,
  phone: "",
  message: "Hello team",
  website: "",
};

function post(body: unknown, ip: string = IP): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-real-ip": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

async function answer(
  response: Response,
): Promise<{ status: number; body: unknown }> {
  return { status: response.status, body: await response.json() };
}

function stubEnv(): void {
  for (const [name, value] of Object.entries(ENV)) vi.stubEnv(name, value);
}

const logSpies = {
  error: vi.spyOn(console, "error"),
  warn: vi.spyOn(console, "warn"),
  info: vi.spyOn(console, "info"),
  log: vi.spyOn(console, "log"),
};

/** Every line the route and its helpers wrote to the console. */
function loggedLines(): string[] {
  return Object.values(logSpies).flatMap((spy) =>
    spy.mock.calls.map((call) => call.join(" ")),
  );
}

function expectNoPersonalData(): void {
  const logged = loggedLines().join("\n");
  expect(logged).not.toContain(VISITOR.email);
  expect(logged).not.toContain("Ana");
  expect(logged).not.toContain("Sunrise");
  expect(logged).not.toContain(IP);
  expect(logged).not.toContain(rateLimitKey(IP, VISITOR.email));
  expect(logged).not.toContain(ipRateLimitKey(IP));
  for (const value of Object.values(ENV)) expect(logged).not.toContain(value);
}

/**
 * A store that counts like Upstash: each prefix has its own limit, and every
 * key counts on its own.
 */
function useCountingStore(): void {
  const limits: Record<string, number> = { contact: 5, "contact-ip": 20 };
  const counts = new Map<string, number>();
  ratelimitMock.mockImplementation(function (config: { prefix: string }) {
    return {
      limit: async (key: string) => {
        const id = `${config.prefix}:${key}`;
        const count = (counts.get(id) ?? 0) + 1;
        counts.set(id, count);
        return { success: count <= limits[config.prefix] };
      },
    };
  });
}

function expectNothingSent(): void {
  expect(limitMock).not.toHaveBeenCalled();
  expect(sendMailMock).not.toHaveBeenCalled();
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(NOW);
  stubEnv();
  for (const spy of Object.values(logSpies)) spy.mockImplementation(() => {});
  createTransportMock.mockReturnValue({ sendMail: sendMailMock });
  sendMailMock.mockResolvedValue({});
  slidingWindowMock.mockReturnValue("sliding-window-limiter");
  ratelimitMock.mockImplementation(function () {
    return { limit: limitMock };
  });
  limitMock.mockResolvedValue({ success: true });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("POST /api/contact valid send", () => {
  it("allows up to 30 seconds, longer than the worst-case send", () => {
    expect(maxDuration).toBe(30);
  });

  it("answers 200 and sends one mail to the inbox for a demo request", async () => {
    const response = await POST(post(demoBody));

    expect(await answer(response)).toEqual({ status: 200, body: { ok: true } });
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock.mock.calls[0][0]).toMatchObject({
      to: ENV.CONTACT_INBOX,
      replyTo: VISITOR.email,
      subject: "Product demo request: Sunrise School",
    });
  });

  it("answers 200 and sends one mail to the inbox for a project request", async () => {
    const response = await POST(post(projectBody));

    expect(await answer(response)).toEqual({ status: 200, body: { ok: true } });
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock.mock.calls[0][0]).toMatchObject({
      to: ENV.CONTACT_INBOX,
      subject: "Outsourcing project request: Sunrise School",
    });
  });

  it("answers 200 and sends one mail to the inbox for a general message", async () => {
    const response = await POST(post(generalBody));

    expect(await answer(response)).toEqual({ status: 200, body: { ok: true } });
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock.mock.calls[0][0]).toMatchObject({
      to: ENV.CONTACT_INBOX,
      replyTo: VISITOR.email,
      subject: "Contact message: Ana Tran",
    });
  });

  it("answers 400 with a phone error for phone 12 and sends nothing", async () => {
    const response = await POST(post({ ...generalBody, phone: "12" }));

    expect(await answer(response)).toEqual({
      status: 400,
      body: { errors: { phone: CONTACT_ERRORS.phone } },
    });
    expectNothingSent();
  });

  it("answers 400 { error: send } for the type newsletter", async () => {
    const response = await POST(post({ ...generalBody, type: "newsletter" }));

    expect(await answer(response)).toEqual({
      status: 400,
      body: { error: "send" },
    });
    expectNothingSent();
  });

  it("checks the limits with hashes of the client IP and the email, not the raw values", async () => {
    await POST(post(demoBody));

    expect(limitMock).toHaveBeenCalledTimes(2);
    const [pairKey, ipKey] = limitMock.mock.calls.map(
      (call) => call[0] as string,
    );
    expect(pairKey).toBe(rateLimitKey(IP, VISITOR.email));
    expect(ipKey).toBe(ipRateLimitKey(IP));
    expect(pairKey).toMatch(/^[0-9a-f]{64}$/);
    expect(ipKey).toMatch(/^[0-9a-f]{64}$/);
  });

  it("writes no log line", async () => {
    await POST(post(demoBody));

    expect(loggedLines()).toEqual([]);
  });
});

describe("POST /api/contact honeypot", () => {
  it("answers 200 and does nothing else when the website field is filled", async () => {
    const response = await POST(
      post({ ...demoBody, website: "https://spam.example" }),
    );

    expect(await answer(response)).toEqual({ status: 200, body: { ok: true } });
    expectNothingSent();
    expect(createTransportMock).not.toHaveBeenCalled();
    expect(ratelimitMock).not.toHaveBeenCalled();
  });

  it("answers 200 even when the delivery is not configured and logs nothing", async () => {
    vi.stubEnv("CONTACT_INBOX", "");

    const response = await POST(post({ ...demoBody, website: "x" }));

    expect(await answer(response)).toEqual({ status: 200, body: { ok: true } });
    expect(loggedLines()).toEqual([]);
  });
});

const captureBody = {
  type: "capture",
  kind: "demo",
  email: VISITOR.email,
  website: "",
};

describe("POST /api/contact capture", () => {
  it.each([
    ["demo", "Demo capture"],
    ["project", "Project capture"],
  ])(
    "answers 200 and sends one %s capture mail with Reply-To the email",
    async (kind, subject) => {
      const response = await POST(post({ ...captureBody, kind }));

      expect(await answer(response)).toEqual({
        status: 200,
        body: { ok: true },
      });
      expect(sendMailMock).toHaveBeenCalledTimes(1);
      expect(sendMailMock.mock.calls[0][0]).toMatchObject({
        to: ENV.CONTACT_INBOX,
        replyTo: VISITOR.email,
        subject,
      });
      expect(loggedLines()).toEqual([]);
    },
  );

  it("checks both limits with hashes of the client IP and the email", async () => {
    await POST(post(captureBody));

    expect(limitMock.mock.calls.map((call) => call[0])).toEqual([
      rateLimitKey(IP, VISITOR.email),
      ipRateLimitKey(IP),
    ]);
  });

  it("answers 429 rate and sends nothing when the limit is reached", async () => {
    limitMock.mockResolvedValue({ success: false });

    const response = await POST(post(captureBody));

    expect(await answer(response)).toEqual({
      status: 429,
      body: { error: "rate" },
    });
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("answers 200 and does nothing else when the website field is filled", async () => {
    const response = await POST(
      post({ ...captureBody, website: "https://spam.example" }),
    );

    expect(await answer(response)).toEqual({ status: 200, body: { ok: true } });
    expectNothingSent();
    expect(createTransportMock).not.toHaveBeenCalled();
    expect(ratelimitMock).not.toHaveBeenCalled();
  });

  it("answers 400 with the client wording for a bad email and sends nothing", async () => {
    const response = await POST(post({ ...captureBody, email: "lan@school" }));

    expect(await answer(response)).toEqual({
      status: 400,
      body: { errors: { email: CONTACT_ERRORS.email } },
    });
    expectNothingSent();
  });

  it("answers 400 send for an unknown kind and sends nothing", async () => {
    const response = await POST(post({ ...captureBody, kind: "careers" }));

    expect(await answer(response)).toEqual({
      status: 400,
      body: { error: "send" },
    });
    expectNothingSent();
  });
});

describe("POST /api/contact bypassed client", () => {
  it.each([
    ["a missing name", { name: "" }, { name: CONTACT_ERRORS.name }],
    ["a bad email", { email: "not-an-email" }, { email: CONTACT_ERRORS.email }],
    [
      "a message over 2,000 characters",
      { message: "a".repeat(2001) },
      { message: CONTACT_ERRORS.message },
    ],
    ["a past date", { date: "2026-10-01" }, { date: CONTACT_ERRORS.date }],
    ["a bad date format", { date: "2027-1-5" }, { date: CONTACT_ERRORS.date }],
    [
      "a name over 200 characters",
      { name: "a".repeat(201) },
      { name: LENGTH_ERROR },
    ],
    [
      "an email over 254 characters",
      { email: `${"a".repeat(250)}@b.co` },
      { email: CONTACT_ERRORS.email },
    ],
    [
      "an organisation over 200 characters",
      { org: "a".repeat(201) },
      { org: LENGTH_ERROR },
    ],
  ])(
    "answers 400 with the client wording for %s",
    async (_label, patch, errors) => {
      const response = await POST(post({ ...demoBody, ...patch }));

      expect(await answer(response)).toEqual({ status: 400, body: { errors } });
      expectNothingSent();
    },
  );

  it("reports every wrong field in one answer", async () => {
    const response = await POST(
      post({ ...demoBody, name: "", email: "x", date: "2026-10-01" }),
    );

    expect(await answer(response)).toEqual({
      status: 400,
      body: {
        errors: {
          name: CONTACT_ERRORS.name,
          email: CONTACT_ERRORS.email,
          date: CONTACT_ERRORS.date,
        },
      },
    });
  });

  it("applies the same rules to a project request", async () => {
    const response = await POST(post({ ...projectBody, name: "" }));

    expect(await answer(response)).toEqual({
      status: 400,
      body: { errors: { name: CONTACT_ERRORS.name } },
    });
    expectNothingSent();
  });
});

describe("POST /api/contact bad body", () => {
  it.each([
    ["not JSON", "{not json"],
    ["an empty body", ""],
    ["JSON null", "null"],
    ["a JSON array", "[]"],
    ["no type", JSON.stringify({ ...demoBody, type: undefined })],
    ["an unknown type", JSON.stringify({ ...demoBody, type: "job" })],
    ["a select value that is not an option", { ...demoBody, schoolSize: "x" }],
  ])("answers 400 send for %s", async (_label, body) => {
    const response = await POST(post(body));

    expect(await answer(response)).toEqual({
      status: 400,
      body: { error: "send" },
    });
    expectNothingSent();
  });

  it("is judged before the configuration is read", async () => {
    vi.stubEnv("CONTACT_INBOX", "");

    const response = await POST(post("{not json"));

    expect(response.status).toBe(400);
    expect(loggedLines()).toEqual([]);
  });
});

describe("POST /api/contact not configured", () => {
  it.each(Object.keys(ENV))(
    "answers 500 send and logs one line naming %s when it is missing",
    async (name) => {
      vi.stubEnv(name, "");

      const response = await POST(post(demoBody));

      expect(await answer(response)).toEqual({
        status: 500,
        body: { error: "send" },
      });
      expectNothingSent();
      const lines = loggedLines();
      expect(lines).toHaveLength(1);
      expect(lines[0]).toContain(name);
      expectNoPersonalData();
    },
  );

  it("is judged before the fields are validated", async () => {
    vi.stubEnv("GMAIL_USER", "");

    const response = await POST(post({ ...demoBody, name: "" }));

    expect(await answer(response)).toEqual({
      status: 500,
      body: { error: "send" },
    });
  });
});

describe("POST /api/contact rate limit", () => {
  it("answers 429 rate and sends nothing for the sixth send", async () => {
    limitMock.mockResolvedValue({ success: false });

    const response = await POST(post(demoBody));

    expect(await answer(response)).toEqual({
      status: 429,
      body: { error: "rate" },
    });
    expect(sendMailMock).not.toHaveBeenCalled();
    expect(limitMock).toHaveBeenCalledTimes(1);
  });

  it("answers 429 rate and sends nothing when the IP alone is over its limit", async () => {
    const blocked = ipRateLimitKey(IP);
    limitMock.mockImplementation(async (key: string) => ({
      success: key !== blocked,
    }));

    const response = await POST(post(demoBody));

    expect(await answer(response)).toEqual({
      status: 429,
      body: { error: "rate" },
    });
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it("blocks the 21st send in the hour from one IP even with a new email each time", async () => {
    useCountingStore();

    const statuses: number[] = [];
    for (let n = 1; n <= 21; n++) {
      const response = await POST(
        post({ ...demoBody, email: `visitor${n}@sunrise.edu` }),
      );
      statuses.push(response.status);
    }

    expect(statuses.slice(0, 20).every((status) => status === 200)).toBe(true);
    expect(statuses[20]).toBe(429);
    expect(sendMailMock).toHaveBeenCalledTimes(20);
    const other = await POST(post(demoBody, "198.51.100.9"));
    expect(other.status).toBe(200);
  });

  it("blocks the sixth send of one email from one IP", async () => {
    useCountingStore();

    const statuses: number[] = [];
    for (let n = 1; n <= 6; n++) {
      statuses.push((await POST(post(demoBody))).status);
    }

    expect(statuses).toEqual([200, 200, 200, 200, 200, 429]);
  });

  it("lets the same IP through with another email", async () => {
    const blocked = rateLimitKey(IP, VISITOR.email);
    limitMock.mockImplementation(async (key: string) => ({
      success: key !== blocked,
    }));

    const first = await POST(post(demoBody));
    const other = await POST(post({ ...demoBody, email: "ben@acme.test" }));

    expect(first.status).toBe(429);
    expect(other.status).toBe(200);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });

  it("counts the same email in another case as the same visitor", async () => {
    await POST(post({ ...demoBody, email: "Ana@Sunrise.edu" }));

    expect(limitMock).toHaveBeenCalledWith(rateLimitKey(IP, VISITOR.email));
  });

  it("sends the mail anyway, logs once and asks the store once when the store is down", async () => {
    limitMock.mockRejectedValue(
      new TypeError(`down for ${VISITOR.email} at ${ENV.KV_REST_API_URL}`),
    );

    const response = await POST(post(demoBody));

    expect(await answer(response)).toEqual({ status: 200, body: { ok: true } });
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(limitMock).toHaveBeenCalledTimes(1);
    const lines = loggedLines();
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain("rate limit unavailable");
  });

  it("sends the mail anyway, logs once and asks the store once when the store does not answer", async () => {
    limitMock.mockResolvedValue({ success: true, reason: "timeout" });

    const response = await POST(post(demoBody));

    expect(await answer(response)).toEqual({ status: 200, body: { ok: true } });
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(limitMock).toHaveBeenCalledTimes(1);
    expect(loggedLines()).toHaveLength(1);
  });
});

describe("POST /api/contact mail fails", () => {
  it("answers 502 send and logs the step, the error class and the SMTP code only", async () => {
    sendMailMock.mockRejectedValue(
      Object.assign(
        new RangeError(`550 no such user ${VISITOR.email} for ${VISITOR.name}`),
        { code: "EAUTH" },
      ),
    );

    const response = await POST(post(demoBody));

    expect(await answer(response)).toEqual({
      status: 502,
      body: { error: "send" },
    });
    const lines = loggedLines();
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain("send");
    expect(lines[0]).toContain("RangeError");
    expect(lines[0]).toContain("EAUTH");
    expect(lines[0]).not.toContain("550");
    expectNoPersonalData();
  });

  it("logs no code when the error has none or the code is not a string", async () => {
    for (const error of [
      new RangeError("550"),
      Object.assign(new RangeError("550"), { code: 550 }),
    ]) {
      vi.clearAllMocks();
      sendMailMock.mockRejectedValue(error);

      await POST(post(demoBody));

      expect(loggedLines()).toEqual([
        "Contact delivery: send failed RangeError",
      ]);
    }
  });

  it("logs an unknown class when the mail rejects with something that is not an Error", async () => {
    sendMailMock.mockRejectedValue(`boom ${VISITOR.email}`);

    const response = await POST(post(demoBody));

    expect(response.status).toBe(502);
    const lines = loggedLines();
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain("unknown");
    expect(lines[0]).not.toContain("boom");
  });
});

describe("POST /api/contact logs", () => {
  const failures: [string, () => void][] = [
    [
      "the mail fails",
      () => sendMailMock.mockRejectedValue(new Error(VISITOR.email)),
    ],
    [
      "the store is down",
      () => limitMock.mockRejectedValue(new Error(VISITOR.email)),
    ],
    ["the delivery is not configured", () => vi.stubEnv("KV_REST_API_URL", "")],
  ];

  it.each(failures)(
    "keeps the visitor's email, name, organisation and limit key out of the log when %s",
    async (_label, fail) => {
      fail();

      await POST(post(demoBody));

      expect(loggedLines().length).toBeGreaterThan(0);
      expectNoPersonalData();
    },
  );
});
