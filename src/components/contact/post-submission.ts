import type { ContactErrors, ContactField } from "@/lib/contact/contact-rules";

/** Fields in form order, so the first invalid one gets focus. */
export const FIELD_ORDER: readonly ContactField[] = [
  "name",
  "email",
  "org",
  "date",
  "message",
];

const CONTACT_ENDPOINT = "/api/contact";
export const SEND_TIMEOUT_MS = 15_000;

export type SendResult =
  | { kind: "sent" | "rate" | "send" }
  | { kind: "errors"; errors: ContactErrors };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/** The known fields of a 400 `{ errors }` body; empty when there are none. */
function readFieldErrors(body: unknown): ContactErrors {
  const found: ContactErrors = {};
  const errors = isRecord(body) ? body.errors : undefined;
  if (!isRecord(errors)) return found;
  for (const field of FIELD_ORDER) {
    const message = errors[field];
    if (typeof message === "string" && message) found[field] = message;
  }
  return found;
}

/** Post the request; every way to fail comes back as a result, never a throw. */
export async function postSubmission(payload: unknown): Promise<SendResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SEND_TIMEOUT_MS);
  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (response.ok) return { kind: "sent" };
    if (response.status === 429) return { kind: "rate" };
    if (response.status === 400) {
      const errors = readFieldErrors(await response.json().catch(() => null));
      if (Object.keys(errors).length > 0) return { kind: "errors", errors };
    }
    return { kind: "send" };
  } catch {
    return { kind: "send" };
  } finally {
    clearTimeout(timer);
  }
}
