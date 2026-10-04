import { TEXT_MAX_LENGTH } from "@/lib/contact/contact-rules";
import {
  validateApplication,
  type ApplicationErrors,
} from "@/lib/careers/application-rules";

/** An application that passed every text check. `cv` is the blob pathname. */
export interface ValidApplication {
  slug: string;
  name: string;
  email: string;
  phone: string;
  note: string;
  cv: string;
}

/**
 * `ok` with the values to send, `ok: false` with field errors in the client
 * wording, `bad` for a body no form can produce, `honeypot` for a bot (the
 * route answers it as if it worked).
 */
export type ParsedApplication =
  | { ok: true; application: ValidApplication }
  | { ok: false; errors: ApplicationErrors }
  | { ok: false; bad: true }
  | { ok: false; honeypot: true };

/** The blob pathname the token route issues: `cv/<name>` with one CV extension. */
const CV_PATH = /^cv\/[\w-]+\.(?:pdf|docx?)$/i;

const bad = (): ParsedApplication => ({ ok: false, bad: true });

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/**
 * Check an untrusted request body with the rules of the form. The CV is only
 * checked as a path here; the route checks the stored blob itself.
 */
export function parseApplication(body: unknown): ParsedApplication {
  if (typeof body !== "object" || body === null) return bad();
  const raw = body as Record<string, unknown>;
  if (raw.website) return { ok: false, honeypot: true };

  const slug = text(raw.slug);
  const cv = text(raw.cv);
  // Phone has no error slot in the form; its 200-character cap is an input
  // `maxLength`, so a longer value did not come from the form.
  const phone = text(raw.phone).trim();
  if (!slug || !CV_PATH.test(cv) || phone.length > TEXT_MAX_LENGTH) {
    return bad();
  }

  const values = {
    name: text(raw.name).trim(),
    email: text(raw.email).trim(),
    note: text(raw.note),
  };
  const errors = validateApplication(values);
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, application: { slug, ...values, phone, cv } };
}
