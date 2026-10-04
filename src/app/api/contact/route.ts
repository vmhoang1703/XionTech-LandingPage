import { ipAddress } from "@vercel/functions";
import {
  checkRateLimits,
  getDeliveryConfig,
  sendContactMail,
  type DeliveryConfig,
} from "@/lib/contact/delivery";
import { parseSubmission } from "@/lib/contact/submission";
import { describeError, readBody } from "@/lib/http/route-helpers";

export const maxDuration = 10;

const SEND_FAILED = { error: "send" } as const;

/** The delivery settings, or null after one log line naming the missing variable. */
function readConfig(): DeliveryConfig | null {
  try {
    return getDeliveryConfig();
  } catch (error) {
    console.error("Contact delivery: not configured:", String(error));
    return null;
  }
}

/** Log lines name the step, the error class and the code, never a message. */
function logSendFailed(error: unknown): void {
  console.error("Contact delivery: send failed", describeError(error));
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
  if (!(await checkRateLimits(ipAddress(request), submission.email))) {
    return Response.json({ error: "rate" }, { status: 429 });
  }

  try {
    await sendContactMail(config, submission);
  } catch (error) {
    logSendFailed(error);
    return Response.json(SEND_FAILED, { status: 502 });
  }
  return Response.json({ ok: true });
}
