import { del, get } from "@vercel/blob";
import { ipAddress } from "@vercel/functions";
import { JOB_ERRORS, storedCvError } from "@/lib/careers/application-rules";
import { parseApplication } from "@/lib/careers/application";
import { getBlobConfig } from "@/lib/careers/cv-storage";
import { getOpenRole } from "@/lib/careers/open-roles";
import {
  checkRateLimits,
  getDeliveryConfig,
  sendApplicationMail,
  type DeliveryConfig,
} from "@/lib/contact/delivery";
import { describeError, readBody } from "@/lib/http/route-helpers";

export const maxDuration = 30;

const SEND_FAILED = { error: "send" } as const;
// The SDK retries a failed delete with backoff; stop it well inside maxDuration.
const DELETE_TIMEOUT_MS = 3000;
const CV_FAILED = { errors: { cv: JOB_ERRORS.cv } } as const;

interface Config {
  delivery: DeliveryConfig;
  storeId: string;
}

interface StoredCv {
  size: number;
  contentType: string;
  content: Buffer;
}

interface StoredCvRef {
  pathname: string;
  storeId: string;
}

/** The mail and Blob settings, or null after one log line naming the missing variable. */
function readConfig(): Config | null {
  try {
    return { delivery: getDeliveryConfig(), storeId: getBlobConfig().storeId };
  } catch (error) {
    console.error("Job application: not configured:", String(error));
    return null;
  }
}

/** Log lines name the step and the error class (and code), never a message. */
function logFailed(step: string, error: unknown): void {
  console.error(`Job application: ${step} failed`, describeError(error));
}

/** Read the whole stream into one Buffer. */
async function readStream(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  return Buffer.from(await new Response(stream).arrayBuffer());
}

/** The stored CV, or null when it is missing or fails the stored-blob checks. */
async function readStoredCv(
  pathname: string,
  storeId: string,
): Promise<StoredCv | null> {
  const blob = await get(pathname, {
    access: "private",
    storeId,
    useCache: false,
  });
  if (!blob) return null;
  if (blob.statusCode !== 200) return null;
  const { size, contentType } = blob.blob;
  if (storedCvError({ pathname, size, contentType })) {
    await blob.stream.cancel();
    return null;
  }
  return { size, contentType, content: await readStream(blob.stream) };
}

/**
 * Delete the uploaded CV of an application that was not mailed (decision A10).
 * A failure is logged with the error class only and never changes the answer.
 */
async function discardCv({ pathname, storeId }: StoredCvRef): Promise<void> {
  try {
    await del(pathname, {
      storeId,
      abortSignal: AbortSignal.timeout(DELETE_TIMEOUT_MS),
    });
  } catch (error) {
    logFailed("CV delete", error);
  }
}

interface Outcome {
  /** Set once the rate limits passed: only then may the CV be deleted. */
  cv?: StoredCvRef;
  sent: boolean;
}

async function handle(
  body: unknown,
  request: Request,
  outcome: Outcome,
): Promise<Response> {
  const parsed = parseApplication(body);
  if (!parsed.ok && "bad" in parsed) {
    return Response.json(SEND_FAILED, { status: 400 });
  }
  if (!parsed.ok && "honeypot" in parsed) return Response.json({ ok: true });

  const config = readConfig();
  if (!config) return Response.json(SEND_FAILED, { status: 500 });
  if (!parsed.ok) {
    return Response.json({ errors: parsed.errors }, { status: 400 });
  }

  const { application } = parsed;
  // Rate limits first: they guard the Sanity lookup and the CV delete.
  if (!(await checkRateLimits(ipAddress(request), application.email))) {
    return Response.json({ error: "rate" }, { status: 429 });
  }
  outcome.cv = { pathname: application.cv, storeId: config.storeId };

  let role;
  try {
    role = await getOpenRole(application.slug);
  } catch (error) {
    logFailed("role lookup", error);
    return Response.json(SEND_FAILED, { status: 502 });
  }
  if (!role) return Response.json(SEND_FAILED, { status: 400 });

  let cv;
  try {
    cv = await readStoredCv(application.cv, config.storeId);
  } catch (error) {
    logFailed("CV read", error);
    return Response.json(SEND_FAILED, { status: 502 });
  }
  if (!cv) return Response.json(CV_FAILED, { status: 400 });

  try {
    await sendApplicationMail(config.delivery, {
      role: { slug: role.slug, title: role.title },
      name: application.name,
      email: application.email,
      phone: application.phone,
      note: application.note,
      cv: { pathname: application.cv, ...cv },
    });
  } catch (error) {
    logFailed("send", error);
    return Response.json(SEND_FAILED, { status: 502 });
  }
  outcome.sent = true;
  return Response.json({ ok: true });
}

export async function POST(request: Request): Promise<Response> {
  const body = await readBody(request);
  const outcome: Outcome = { sent: false };
  try {
    return await handle(body, request, outcome);
  } finally {
    // A CV is kept only with a sent application (A4). An unsent one is deleted
    // only after the rate limits passed, so the delete cannot be driven freely
    // (A10 part 4, narrowed 2026-10-04).
    if (outcome.cv && !outcome.sent) await discardCv(outcome.cv);
  }
}
