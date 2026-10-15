// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ContactSubmission } from "@/components/contact/contact-form";
import type { GeneralSubmission } from "./submission";

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
  checkRateLimits,
  checkUploadLimit,
  getDeliveryConfig,
  ipRateLimitKey,
  rateLimitKey,
  sendApplicationMail,
  sendContactMail,
  type ApplicationMail,
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
  products: ["Parent Hub", "Staff Hub"],
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

const GENERAL: GeneralSubmission = {
  type: "general",
  name: "Cam Vo",
  email: "cam@home.test",
  phone: "+84 908.107-552",
  message: "Line one\nLine two",
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

afterEach(() => {
  vi.restoreAllMocks();
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

describe("ipRateLimitKey", () => {
  it("is a SHA-256 hex digest with no raw IP in it", () => {
    const key = ipRateLimitKey("203.0.113.7");

    expect(key).toMatch(/^[0-9a-f]{64}$/);
    expect(key).not.toContain("203.0.113.7");
  });

  it("is the same for the same IP and differs for another IP", () => {
    expect(ipRateLimitKey("203.0.113.7")).toBe(ipRateLimitKey("203.0.113.7"));
    expect(ipRateLimitKey("203.0.113.8")).not.toBe(
      ipRateLimitKey("203.0.113.7"),
    );
  });

  it("is not the key of the IP and email limit", () => {
    expect(ipRateLimitKey("203.0.113.7")).not.toBe(
      rateLimitKey("203.0.113.7", "ana@sunrise.edu"),
    );
  });

  it("still gives a key when the IP is unknown", () => {
    expect(ipRateLimitKey(undefined)).toMatch(/^[0-9a-f]{64}$/);
  });
});

const IP = "203.0.113.7";
const EMAIL = "Ana@Sunrise.edu";

/** The log lines written while a test runs, as text. */
function spyOnLog(): () => string[] {
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  return () => error.mock.calls.map((call) => call.join(" "));
}

describe("checkRateLimits", () => {
  it("allows a send both limits accept, checking the IP and email first, then the IP alone", async () => {
    expect(await checkRateLimits(IP, EMAIL)).toBe(true);

    expect(limitMock.mock.calls).toEqual([
      [rateLimitKey(IP, EMAIL)],
      [ipRateLimitKey(IP)],
    ]);
  });

  it("denies a send the IP and email limit refuses, without using the IP-only limit", async () => {
    limitMock.mockResolvedValueOnce({ success: false });

    expect(await checkRateLimits(IP, EMAIL)).toBe(false);
    expect(limitMock).toHaveBeenCalledTimes(1);
  });

  it("denies a send the IP-only limit refuses", async () => {
    limitMock
      .mockResolvedValueOnce({ success: true })
      .mockResolvedValueOnce({ success: false });

    expect(await checkRateLimits(IP, EMAIL)).toBe(false);
  });

  it("uses 5 sends per 10 minutes under the contact prefix, then 20 per hour under contact-ip", async () => {
    await checkRateLimits(IP, EMAIL);

    expect(slidingWindowMock.mock.calls).toEqual([
      [5, "10 m"],
      [20, "1 h"],
    ]);
    expect(ratelimitMock.mock.calls.map((call) => call[0].prefix)).toEqual([
      "contact",
      "contact-ip",
    ]);
  });

  it("keeps no in-process cache and gives each store call 3 s", async () => {
    await checkRateLimits(IP, EMAIL);

    expect(ratelimitMock).toHaveBeenCalledTimes(2);
    for (const [config] of ratelimitMock.mock.calls) {
      expect(config).toMatchObject({
        limiter: "sliding-window-limiter",
        ephemeralCache: false,
        timeout: 3000,
      });
    }
  });

  it("connects to the store with the KV variables", async () => {
    await checkRateLimits(IP, EMAIL);

    expect(redisMock).toHaveBeenCalledWith({
      url: ENV.KV_REST_API_URL,
      token: ENV.KV_REST_API_TOKEN,
    });
  });

  it("allows the send, logs once and skips the IP-only limit when the first check times out", async () => {
    const logged = spyOnLog();
    limitMock.mockResolvedValue({ success: true, reason: "timeout" });

    expect(await checkRateLimits(IP, EMAIL)).toBe(true);

    expect(limitMock).toHaveBeenCalledTimes(1);
    expect(ratelimitMock).toHaveBeenCalledTimes(1);
    expect(logged()).toHaveLength(1);
    expect(logged()[0]).toContain("rate limit unavailable");
  });

  it("allows the send, logs once with the error class only and skips the IP-only limit when the first check fails", async () => {
    const logged = spyOnLog();
    limitMock.mockRejectedValue(
      new TypeError(`boom for ${ENV.KV_REST_API_URL} and ${EMAIL} at ${IP}`),
    );

    expect(await checkRateLimits(IP, EMAIL)).toBe(true);

    expect(limitMock).toHaveBeenCalledTimes(1);
    expect(ratelimitMock).toHaveBeenCalledTimes(1);
    expect(logged()).toHaveLength(1);
    const [line] = logged();
    expect(line).toContain("rate limit unavailable");
    expect(line).toContain("TypeError");
    expect(line).not.toContain("boom");
    expect(line).not.toContain(ENV.KV_REST_API_URL);
    expect(line).not.toContain("Sunrise");
    expect(line).not.toContain(IP);
    expect(line).not.toContain(rateLimitKey(IP, EMAIL));
    expect(line).not.toContain(ipRateLimitKey(IP));
  });

  it("logs an unknown class when the store rejects with something that is not an Error", async () => {
    const logged = spyOnLog();
    limitMock.mockRejectedValue("boom");

    expect(await checkRateLimits(IP, EMAIL)).toBe(true);

    expect(logged()).toHaveLength(1);
    expect(logged()[0]).toContain("unknown");
    expect(logged()[0]).not.toContain("boom");
  });

  it("allows the send and logs once when the IP-only check fails after the first one passed", async () => {
    const logged = spyOnLog();
    limitMock
      .mockResolvedValueOnce({ success: true })
      .mockRejectedValueOnce(new TypeError("boom"));

    expect(await checkRateLimits(IP, EMAIL)).toBe(true);

    expect(logged()).toHaveLength(1);
    expect(logged()[0]).toContain("TypeError");
  });

  it("allows the send and logs once when the IP-only check times out after the first one passed", async () => {
    const logged = spyOnLog();
    limitMock
      .mockResolvedValueOnce({ success: true })
      .mockResolvedValueOnce({ success: true, reason: "timeout" });

    expect(await checkRateLimits(IP, EMAIL)).toBe(true);

    expect(logged()).toHaveLength(1);
    expect(logged()[0]).toContain("rate limit unavailable");
  });
});

describe("sendContactMail", () => {
  it("logs in to Gmail with the app password and gives up after 5 s", async () => {
    await sendContactMail(CONFIG, DEMO);

    expect(createTransportMock).toHaveBeenCalledWith({
      service: "gmail",
      secure: true,
      auth: { user: ENV.GMAIL_USER, pass: ENV.GMAIL_APP_PASSWORD },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
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
      "Parent Hub, Staff Hub",
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

  it.each([
    ["demo", "Demo capture"],
    ["project", "Project capture"],
  ] as const)(
    "sends a %s capture with a subject that holds no personal data",
    async (kind, subject) => {
      await sendContactMail(CONFIG, { type: "capture", kind, email: EMAIL });

      const mail = sentMail();
      expect(mail.subject).toBe(subject);
      expect(mail.to).toBe(ENV.CONTACT_INBOX);
      expect(mail.from).toBe(ENV.GMAIL_USER);
      expect(mail.replyTo).toBe(EMAIL);
    },
  );

  it("puts the kind and the email in a plain-text capture body and nothing else", async () => {
    await sendContactMail(CONFIG, {
      type: "capture",
      kind: "project",
      email: EMAIL,
    });

    const mail = sentMail();
    expect(mail).not.toHaveProperty("html");
    expect(mail.text).toBe(`Kind: project\nEmail: ${EMAIL}`);
  });

  it("sends a general message with its own subject and fields", async () => {
    await sendContactMail(CONFIG, GENERAL);

    const mail = sentMail();
    expect(mail.subject).toBe("Contact message: Cam Vo");
    expect(mail.to).toBe(ENV.CONTACT_INBOX);
    expect(mail.replyTo).toBe(GENERAL.email);
    expect(mail.text).toBe(
      "Name: Cam Vo\nEmail: cam@home.test\nPhone: +84 908.107-552\n\nMessage:\nLine one\nLine two",
    );
    expect(mail.text).not.toMatch(/organisation|service|role/i);
  });

  it("removes CR and LF from a general subject", async () => {
    await sendContactMail(CONFIG, { ...GENERAL, name: "Cam\r\nBcc: x@y.test" });

    expect(sentMail().subject).toBe("Contact message: CamBcc: x@y.test");
  });

  it("lets a send failure through so the route can answer 502", async () => {
    sendMailMock.mockRejectedValue(new Error("SMTP down"));

    await expect(sendContactMail(CONFIG, DEMO)).rejects.toThrow("SMTP down");
  });
});

const APPLICATION: ApplicationMail = {
  role: { slug: "senior-engineer", title: "Senior Engineer" },
  name: "Nam Nguyen",
  email: "nam@example.test",
  phone: "+84 900 000 000",
  note: "I like the role.\nThanks.",
  cv: {
    pathname: "cv/application-AbC123.PDF",
    size: 1234,
    contentType: "application/pdf",
    content: Buffer.from("cv-bytes"),
  },
};

describe("checkUploadLimit", () => {
  it("allows an upload within 5 per hour under the cv-upload prefix, keyed by the IP", async () => {
    expect(await checkUploadLimit(IP)).toBe(true);

    expect(slidingWindowMock.mock.calls).toEqual([[5, "1 h"]]);
    expect(ratelimitMock.mock.calls[0][0].prefix).toBe("cv-upload");
    expect(limitMock.mock.calls).toEqual([[ipRateLimitKey(IP)]]);
  });

  it("denies an upload the limit refuses", async () => {
    limitMock.mockResolvedValueOnce({ success: false });

    expect(await checkUploadLimit(IP)).toBe(false);
  });

  it("fails open and logs once when the store is unavailable", async () => {
    const logged = spyOnLog();
    limitMock.mockRejectedValue(new TypeError("boom"));

    expect(await checkUploadLimit(undefined)).toBe(true);

    expect(logged()).toHaveLength(1);
    expect(logged()[0]).toContain("rate limit unavailable");
  });
});

describe("sendApplicationMail", () => {
  it("uses the same Gmail transport settings as the contact mail", async () => {
    await sendApplicationMail(CONFIG, APPLICATION);

    expect(createTransportMock).toHaveBeenCalledWith({
      service: "gmail",
      secure: true,
      auth: { user: ENV.GMAIL_USER, pass: ENV.GMAIL_APP_PASSWORD },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
    });
  });

  it("sends to the inbox with Reply-To set to the applicant", async () => {
    await sendApplicationMail(CONFIG, APPLICATION);

    const mail = sentMail();
    expect(mail.to).toBe(ENV.CONTACT_INBOX);
    expect(mail.from).toBe(ENV.GMAIL_USER);
    expect(mail.replyTo).toBe(APPLICATION.email);
    expect(mail.subject).toBe("Job application: Senior Engineer");
  });

  it("removes CR and LF from the subject", async () => {
    await sendApplicationMail(CONFIG, {
      ...APPLICATION,
      role: { slug: "x", title: "Eng\r\nBcc: spy@example.test\nineer" },
    });

    const subject = sentMail().subject as string;
    expect(subject).not.toMatch(/[\r\n]/);
    expect(subject).toBe("Job application: EngBcc: spy@example.testineer");
  });

  it("names the role, the page path, the CV path and the applicant in a plain-text body", async () => {
    await sendApplicationMail(CONFIG, APPLICATION);

    const mail = sentMail();
    expect(mail).not.toHaveProperty("html");
    expect(mail.text).toBe(
      [
        "Role: Senior Engineer",
        "Role page: /careers/senior-engineer",
        "Name: Nam Nguyen",
        "Email: nam@example.test",
        "Phone: +84 900 000 000",
        "CV: cv/application-AbC123.PDF (1234 bytes, application/pdf)",
        "",
        "Cover note:",
        "I like the role.\nThanks.",
      ].join("\n"),
    );
  });

  it("attaches the CV with its type and a filename that holds no personal data", async () => {
    await sendApplicationMail(CONFIG, APPLICATION);

    expect(sentMail().attachments).toEqual([
      {
        filename: "cv.pdf",
        contentType: "application/pdf",
        content: APPLICATION.cv.content,
      },
    ]);
  });

  it("lets a send failure through so the route can answer 502", async () => {
    sendMailMock.mockRejectedValue(new Error("SMTP down"));

    await expect(sendApplicationMail(CONFIG, APPLICATION)).rejects.toThrow(
      "SMTP down",
    );
  });
});
