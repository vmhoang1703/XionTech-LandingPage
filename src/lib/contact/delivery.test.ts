// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ContactSubmission } from "@/components/contact/contact-form";

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

import {
  checkRateLimit,
  getDeliveryConfig,
  rateLimitKey,
  sendContactMail,
} from "./delivery";

const ENV = {
  CONTACT_INBOX: "inbox@example.test",
  GMAIL_USER: "sender@example.test",
  GMAIL_APP_PASSWORD: "test-only-app-password",
  KV_REST_API_URL: "https://store.example.test",
  KV_REST_API_TOKEN: "test-only-store-token",
};

const CONFIG = {
  inbox: ENV.CONTACT_INBOX,
  gmailUser: ENV.GMAIL_USER,
  gmailAppPassword: ENV.GMAIL_APP_PASSWORD,
};

const DEMO: ContactSubmission = {
  type: "demo",
  name: "Ana Tran",
  email: "Ana@Sunrise.edu",
  org: "Sunrise School",
  role: "Principal",
  message: "First line\nSecond line",
  products: ["PXP", "LXP"],
  schoolSize: "500 to 1,500 students",
  date: "2026-10-20",
};

const PROJECT: ContactSubmission = {
  type: "project",
  name: "Ben Le",
  email: "ben@acme.test",
  org: "Acme Ltd",
  role: "",
  message: "",
  service: "Not sure yet",
  startTiming: "In 1 to 3 months",
};

function stubEnv(): void {
  for (const [name, value] of Object.entries(ENV)) vi.stubEnv(name, value);
}

/** The options of the one mail that was sent. */
function sentMail(): Record<string, unknown> {
  expect(sendMailMock).toHaveBeenCalledTimes(1);
  return sendMailMock.mock.calls[0][0] as Record<string, unknown>;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  stubEnv();
  createTransportMock.mockReturnValue({ sendMail: sendMailMock });
  sendMailMock.mockResolvedValue({});
  slidingWindowMock.mockReturnValue("sliding-window-limiter");
  ratelimitMock.mockImplementation(function () {
    return { limit: limitMock };
  });
  limitMock.mockResolvedValue({ success: true });
});

describe("getDeliveryConfig", () => {
  it("returns the inbox and the Gmail login when all five variables are set", () => {
    expect(getDeliveryConfig()).toEqual(CONFIG);
  });

  it.each(Object.keys(ENV))("throws naming %s when it is missing", (name) => {
    vi.stubEnv(name, "");

    expect(() => getDeliveryConfig()).toThrow(name);
  });

  it("names the variable but not any value in the error text", () => {
    vi.stubEnv("KV_REST_API_URL", "");
    let message = "";
    try {
      getDeliveryConfig();
    } catch (error) {
      message = (error as Error).message;
    }

    expect(message).toContain("KV_REST_API_URL");
    for (const value of Object.values(ENV)) {
      expect(message).not.toContain(value);
    }
  });
});

describe("rateLimitKey", () => {
  it("is a SHA-256 hex digest with no raw email or IP in it", () => {
    const key = rateLimitKey("203.0.113.7", "Ana@Sunrise.edu");

    expect(key).toMatch(/^[0-9a-f]{64}$/);
    expect(key.toLowerCase()).not.toContain("ana");
    expect(key).not.toContain("203.0.113.7");
  });

  it("is the same for the same IP and the same email in another case", () => {
    expect(rateLimitKey("203.0.113.7", "Ana@Sunrise.edu")).toBe(
      rateLimitKey("203.0.113.7", "ana@sunrise.edu"),
    );
  });

  it("differs for another email or another IP", () => {
    const key = rateLimitKey("203.0.113.7", "ana@sunrise.edu");

    expect(rateLimitKey("203.0.113.7", "ben@sunrise.edu")).not.toBe(key);
    expect(rateLimitKey("203.0.113.8", "ana@sunrise.edu")).not.toBe(key);
  });

  it("still gives a key when the IP is unknown", () => {
    const key = rateLimitKey(undefined, "ana@sunrise.edu");

    expect(key).toMatch(/^[0-9a-f]{64}$/);
    expect(key).not.toBe(rateLimitKey(undefined, "ben@sunrise.edu"));
  });
});

describe("checkRateLimit", () => {
  it("allows a send the store accepts", async () => {
    limitMock.mockResolvedValue({ success: true });

    expect(await checkRateLimit("key-1")).toBe(true);
    expect(limitMock).toHaveBeenCalledWith("key-1");
  });

  it("denies a send the store refuses", async () => {
    limitMock.mockResolvedValue({ success: false });

    expect(await checkRateLimit("key-1")).toBe(false);
  });

  it("uses 5 sends per 10 minutes, the contact prefix and no in-process cache", async () => {
    await checkRateLimit("key-1");

    expect(slidingWindowMock).toHaveBeenCalledWith(5, "10 m");
    expect(ratelimitMock).toHaveBeenCalledWith(
      expect.objectContaining({
        limiter: "sliding-window-limiter",
        prefix: "contact",
        ephemeralCache: false,
      }),
    );
  });

  it("connects to the store with the KV variables", async () => {
    await checkRateLimit("key-1");

    expect(redisMock).toHaveBeenCalledWith({
      url: ENV.KV_REST_API_URL,
      token: ENV.KV_REST_API_TOKEN,
    });
  });

  it("allows the send and logs once when the store fails", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    limitMock.mockRejectedValue(new Error(`boom for ${ENV.KV_REST_API_URL}`));

    expect(await checkRateLimit("key-1")).toBe(true);

    expect(error).toHaveBeenCalledTimes(1);
    const line = String(error.mock.calls[0].join(" "));
    expect(line).toContain("rate limit unavailable");
    expect(line).not.toContain("key-1");
    expect(line).not.toContain(ENV.KV_REST_API_URL);
    error.mockRestore();
  });
});

describe("sendContactMail", () => {
  it("logs in to Gmail with the app password", async () => {
    await sendContactMail(CONFIG, DEMO);

    expect(createTransportMock).toHaveBeenCalledWith({
      service: "gmail",
      secure: true,
      auth: { user: ENV.GMAIL_USER, pass: ENV.GMAIL_APP_PASSWORD },
    });
  });

  it("sends a demo request to the inbox with Reply-To set to the visitor", async () => {
    await sendContactMail(CONFIG, DEMO);

    const mail = sentMail();
    expect(mail.to).toBe(ENV.CONTACT_INBOX);
    expect(mail.from).toBe(ENV.GMAIL_USER);
    expect(mail.replyTo).toBe(DEMO.email);
    expect(mail.subject).toBe("Product demo request: Sunrise School");
  });

  it("puts every demo field in a plain-text body", async () => {
    await sendContactMail(CONFIG, DEMO);

    const mail = sentMail();
    expect(mail).not.toHaveProperty("html");
    for (const value of [
      "Ana Tran",
      "Ana@Sunrise.edu",
      "Sunrise School",
      "Principal",
      "PXP, LXP",
      "500 to 1,500 students",
      "2026-10-20",
      "First line\nSecond line",
    ]) {
      expect(mail.text).toContain(value);
    }
  });

  it("sends a project request with its own subject and fields", async () => {
    await sendContactMail(CONFIG, PROJECT);

    const mail = sentMail();
    expect(mail.subject).toBe("Outsourcing project request: Acme Ltd");
    expect(mail.replyTo).toBe(PROJECT.email);
    for (const value of [
      "Ben Le",
      "ben@acme.test",
      "Acme Ltd",
      "Not sure yet",
      "In 1 to 3 months",
    ]) {
      expect(mail.text).toContain(value);
    }
  });

  it("does not put demo-only fields in a project mail", async () => {
    await sendContactMail(CONFIG, PROJECT);

    expect(sentMail().text).not.toMatch(/school size|preferred date/i);
  });

  it("removes CR and LF from the subject", async () => {
    await sendContactMail(CONFIG, {
      ...DEMO,
      org: "Sunrise\r\nBcc: spy@example.test\nSchool",
    });

    const subject = sentMail().subject as string;
    expect(subject).not.toMatch(/[\r\n]/);
    expect(subject).toBe(
      "Product demo request: SunriseBcc: spy@example.testSchool",
    );
  });

  it("lets a send failure through so the route can answer 502", async () => {
    sendMailMock.mockRejectedValue(new Error("SMTP down"));

    await expect(sendContactMail(CONFIG, DEMO)).rejects.toThrow("SMTP down");
  });
});
