import { createHash } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
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

/**
 * The rate-limit key: a SHA-256 hex digest of the IP and the lower-cased
 * email, so the store holds no personal data. An unknown IP still gets a key.
 */
export function rateLimitKey(ip: string | undefined, email: string): string {
  return createHash("sha256")
    .update(`${ip ?? "unknown"}|${email.toLowerCase()}`)
    .digest("hex");
}

/**
 * True when the send may go ahead: at most 5 per key in 10 minutes. When the
 * store fails the send is allowed (fail open) and one line is logged.
 */
export async function checkRateLimit(key: string): Promise<boolean> {
  try {
    const limiter = new Ratelimit({
      redis: new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN,
      }),
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      prefix: "contact",
      ephemeralCache: false,
    });
    const { success } = await limiter.limit(key);
    return success;
  } catch {
    console.error("Contact delivery: rate limit unavailable");
    return true;
  }
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
  });
  await transport.sendMail({
    from: config.gmailUser,
    to: config.inbox,
    replyTo: submission.email,
    subject: `${SUBJECTS[submission.type]}: ${submission.org.replaceAll(/[\r\n]/g, "")}`,
    text: mailText(submission),
  });
}
