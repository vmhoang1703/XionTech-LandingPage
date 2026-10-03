import { ipAddress } from "@vercel/functions";
import {
  checkIpRateLimit,
  checkRateLimit,
  getDeliveryConfig,
  ipRateLimitKey,
  rateLimitKey,
  sendContactMail,
  type DeliveryConfig,
} from "@/lib/contact/delivery";
import { parseSubmission } from "@/lib/contact/submission";

export const maxDuration = 10;

const SEND_FAILED = { error: "send" } as const;

/** The parsed body, or undefined when it is not JSON (judged as a bad body). */
async function readBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

/** The delivery settings, or null after one log line naming the missing variable. */
function readConfig(): DeliveryConfig | null {
  try {
    return getDeliveryConfig();
  } catch (error) {
    console.error("Contact delivery: not configured:", String(error));
    return null;
  }
}

/** The SMTP error code (EAUTH, ETIMEDOUT...) when the error has a string one. */
function errorCode(error: unknown): string | undefined {
  if (!(error instanceof Error) || !("code" in error)) return undefined;
  return typeof error.code === "string" ? error.code : undefined;
}

/** Log lines name the step, the error class and the code, never a message. */
function logSendFailed(error: unknown): void {
  const name = error instanceof Error ? error.name : "unknown";
  const code = errorCode(error);
  console.error(
    "Contact delivery: send failed",
    code ? `${name} ${code}` : name,
  );
}

export async function POST(request: Request): Promise<Response> {
  const parsed = parseSubmission(await readBody(request), new Date());
  if (!parsed.ok && "bad" in parsed) {
    return Response.json(SEND_FAILED, { status: 400 });
  }
  if (!parsed.ok && "honeypot" in parsed) return Response.json({ ok: true });

  const config = readConfig();
  if (!config) return Response.json(SEND_FAILED, { status: 500 });
  if (!parsed.ok) {
    return Response.json({ errors: parsed.errors }, { status: 400 });
  }

  const { submission } = parsed;
  const ip = ipAddress(request);
  // Each limit answers in turn: a send the first one refused does not count
  // against the second.
  const allowed =
    (await checkRateLimit(rateLimitKey(ip, submission.email))) &&
    (await checkIpRateLimit(ipRateLimitKey(ip)));
  if (!allowed) return Response.json({ error: "rate" }, { status: 429 });

  try {
    await sendContactMail(config, submission);
  } catch (error) {
    logSendFailed(error);
    return Response.json(SEND_FAILED, { status: 502 });
  }
  return Response.json({ ok: true });
}
