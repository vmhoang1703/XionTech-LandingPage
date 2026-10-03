import { createHash } from "node:crypto";
import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createTransport } from "nodemailer";
import type { ContactSubmission } from "@/components/contact/contact-form";

export interface DeliveryConfig {
  /** Where the requests are delivered (CONTACT_INBOX). */
  inbox: string;
  gmailUser: string;
  gmailAppPassword: string;
}

const SUBJECTS: Record<ContactSubmission["type"], string> = {
  demo: "Product demo request",
  project: "Outsourcing project request",
};

const MAIL_TIMEOUT_MS = 5000;

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

/**
 * Read the server-only variables of the delivery on each request. Throws an
 * error that names the first missing variable, never a value.
 */
export function getDeliveryConfig(): DeliveryConfig {
  const config = {
    inbox: required("CONTACT_INBOX"),
    gmailUser: required("GMAIL_USER"),
    gmailAppPassword: required("GMAIL_APP_PASSWORD"),
  };
  required("KV_REST_API_URL");
  required("KV_REST_API_TOKEN");
  return config;
}

function sha256Hex(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

/**
 * The key of the IP and email limit: a SHA-256 hex digest of the IP and the
 * lower-cased email, so the store holds no personal data. An unknown IP still
 * gets a key.
 */
export function rateLimitKey(ip: string | undefined, email: string): string {
  return sha256Hex(`${ip ?? "unknown"}|${email.toLowerCase()}`);
}

/** The key of the IP-only limit: a SHA-256 hex digest of the IP. */
export function ipRateLimitKey(ip: string | undefined): string {
  return sha256Hex(ip ?? "unknown");
}

/** One log line; `cause` is an error class or "timeout", never a message. */
function logRateLimitUnavailable(cause: string): void {
  console.error("Contact delivery: rate limit unavailable", cause);
}

/**
 * True when the send may go ahead: at most `tokens` per key in `window`. When
 * the store fails or does not answer in 3 s the send is allowed (fail open)
 * and one line is logged.
 */
async function withinLimit(
  prefix: string,
  tokens: number,
  window: Duration,
  key: string,
): Promise<boolean> {
  try {
    const limiter = new Ratelimit({
      redis: new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      }),
      limiter: Ratelimit.slidingWindow(tokens, window),
      prefix,
      ephemeralCache: false,
      timeout: 3000,
    });
    const { success, reason } = await limiter.limit(key);
    if (reason === "timeout") logRateLimitUnavailable("timeout");
    return success;
  } catch (error) {
    logRateLimitUnavailable(error instanceof Error ? error.name : "unknown");
    return true;
  }
}

/** The IP and email limit: 5 sends per key in 10 minutes. */
export function checkRateLimit(key: string): Promise<boolean> {
  return withinLimit("contact", 5, "10 m", key);
}

/** The IP-only limit: 20 sends per key in 1 hour, whatever the email. */
export function checkIpRateLimit(key: string): Promise<boolean> {
  return withinLimit("contact-ip", 20, "1 h", key);
}

function mailText(submission: ContactSubmission): string {
  const shared: [string, string][] = [
    ["Name", submission.name],
    ["Email", submission.email],
    ["Organisation", submission.org],
    ["Role", submission.role],
  ];
  const specific: [string, string][] =
    submission.type === "demo"
      ? [
          ["Products", submission.products.join(", ")],
          ["School size", submission.schoolSize],
          ["Preferred date", submission.date],
        ]
      : [
          ["Service", submission.service],
          ["Start timing", submission.startTiming],
        ];
  const fields = [...shared, ...specific].map(
    ([label, value]) => `${label}: ${value}`,
  );
  return [...fields, "", "Message:", submission.message].join("\n");
}

/**
 * Send one plain-text mail to the inbox through Gmail. Reply-To is the
 * visitor. A send failure is thrown for the caller to handle.
 */
export async function sendContactMail(
  config: DeliveryConfig,
  submission: ContactSubmission,
): Promise<void> {
  const transport = createTransport({
    service: "gmail",
    secure: true,
    auth: { user: config.gmailUser, pass: config.gmailAppPassword },
    connectionTimeout: MAIL_TIMEOUT_MS,
    greetingTimeout: MAIL_TIMEOUT_MS,
    socketTimeout: MAIL_TIMEOUT_MS,
  });
  await transport.sendMail({
    from: config.gmailUser,
    to: config.inbox,
    replyTo: submission.email,
    subject: `${SUBJECTS[submission.type]}: ${submission.org.replaceAll(/[\r\n]/g, "")}`,
    text: mailText(submission),
  });
}
