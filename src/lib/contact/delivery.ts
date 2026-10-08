import { createHash } from "node:crypto";
import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createTransport } from "nodemailer";
import type { ContactType } from "./contact-rules";
import type { CaptureSubmission, ValidSubmission } from "./submission";

export interface DeliveryConfig {
  /** Where the requests are delivered (CONTACT_INBOX). */
  inbox: string;
  gmailUser: string;
  gmailAppPassword: string;
}

const SUBJECTS: Record<ContactType, string> = {
  demo: "Product demo request",
  project: "Outsourcing project request",
  general: "Contact message",
};

const CAPTURE_SUBJECTS: Record<CaptureSubmission["kind"], string> = {
  demo: "Demo capture",
  project: "Project capture",
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

type LimitOutcome = "allowed" | "blocked" | "unavailable";

/**
 * Ask one limit: at most `tokens` per key in `window`. When the store fails or
 * does not answer in 3 s the outcome is "unavailable" and one line is logged.
 */
async function askLimit(
  prefix: string,
  tokens: number,
  window: Duration,
  key: string,
): Promise<LimitOutcome> {
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
    if (reason === "timeout") {
      logRateLimitUnavailable("timeout");
      return "unavailable";
    }
    return success ? "allowed" : "blocked";
  } catch (error) {
    logRateLimitUnavailable(error instanceof Error ? error.name : "unknown");
    return "unavailable";
  }
}

/**
 * True when the send may go ahead: about 5 per IP and email in 10 minutes,
 * and about 20 per IP in 1 hour. The IP-only limit is asked only when the
 * first one allowed the send, so a refused send does not use its allowance.
 * When the store is unavailable the send is allowed (fail open) and the
 * second limit is skipped, so there is one log line and one wait.
 */
export async function checkRateLimits(
  ip: string | undefined,
  email: string,
): Promise<boolean> {
  const byEmail = await askLimit("contact", 5, "10 m", rateLimitKey(ip, email));
  if (byEmail !== "allowed") return byEmail === "unavailable";
  const byIp = await askLimit("contact-ip", 20, "1 h", ipRateLimitKey(ip));
  return byIp !== "blocked";
}

/**
 * True when a CV upload token may be issued: about 5 per IP in 1 hour. When
 * the store is unavailable the upload is allowed (fail open).
 */
export async function checkUploadLimit(
  ip: string | undefined,
): Promise<boolean> {
  const outcome = await askLimit("cv-upload", 5, "1 h", ipRateLimitKey(ip));
  return outcome !== "blocked";
}

function mailText(submission: ValidSubmission): string {
  if (submission.type === "capture") {
    return `Kind: ${submission.kind}\nEmail: ${submission.email}`;
  }
  if (submission.type === "general") {
    return [
      `Name: ${submission.name}`,
      `Email: ${submission.email}`,
      `Phone: ${submission.phone}`,
      "",
      "Message:",
      submission.message,
    ].join("\n");
  }
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
 * A capture subject names the kind only; a general one ends with the name,
 * the others with the organisation.
 */
function mailSubject(submission: ValidSubmission): string {
  if (submission.type === "capture") return CAPTURE_SUBJECTS[submission.kind];
  const detail =
    submission.type === "general" ? submission.name : submission.org;
  return `${SUBJECTS[submission.type]}: ${detail.replaceAll(/[\r\n]/g, "")}`;
}

function gmailTransport(config: DeliveryConfig) {
  return createTransport({
    service: "gmail",
    secure: true,
    auth: { user: config.gmailUser, pass: config.gmailAppPassword },
    connectionTimeout: MAIL_TIMEOUT_MS,
    greetingTimeout: MAIL_TIMEOUT_MS,
    socketTimeout: MAIL_TIMEOUT_MS,
  });
}

/**
 * Send one plain-text mail to the inbox through Gmail. Reply-To is the
 * visitor. A send failure is thrown for the caller to handle.
 */
export async function sendContactMail(
  config: DeliveryConfig,
  submission: ValidSubmission,
): Promise<void> {
  await gmailTransport(config).sendMail({
    from: config.gmailUser,
    to: config.inbox,
    replyTo: submission.email,
    subject: mailSubject(submission),
    text: mailText(submission),
  });
}

export interface ApplicationMail {
  role: { slug: string; title: string };
  name: string;
  email: string;
  phone: string;
  note: string;
  cv: { pathname: string; size: number; contentType: string; content: Buffer };
}

function applicationText({
  role,
  name,
  email,
  phone,
  note,
  cv,
}: ApplicationMail): string {
  return [
    `Role: ${role.title}`,
    `Role page: /careers/${role.slug}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `CV: ${cv.pathname} (${cv.size} bytes, ${cv.contentType})`,
    "",
    "Cover note:",
    note,
  ].join("\n");
}

/**
 * Send one application mail to the inbox through Gmail. Reply-To is the
 * applicant and the CV is attached under a name with no personal data. A send
 * failure is thrown for the caller to handle.
 */
export async function sendApplicationMail(
  config: DeliveryConfig,
  application: ApplicationMail,
): Promise<void> {
  const { role, email, cv } = application;
  const extension = cv.pathname.slice(cv.pathname.lastIndexOf(".") + 1);
  await gmailTransport(config).sendMail({
    from: config.gmailUser,
    to: config.inbox,
    replyTo: email,
    subject: `Job application: ${role.title.replaceAll(/[\r\n]/g, "")}`,
    text: applicationText(application),
    attachments: [
      {
        filename: `cv.${extension.toLowerCase()}`,
        contentType: cv.contentType,
        content: cv.content,
      },
    ],
  });
}
