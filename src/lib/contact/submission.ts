import type { ContactSubmission } from "@/components/contact/contact-form";
import { CONTACT_STRINGS } from "@/components/contact/contact-strings";
import {
  CONTACT_ERRORS,
  EMAIL_MAX_LENGTH,
  TEXT_MAX_LENGTH,
  isValidEmail,
  validateContact,
  type ContactErrors,
  type RequestKind,
} from "./contact-rules";

/** The email band: which form the visitor goes to next, and their email. */
export interface CaptureSubmission {
  type: "capture";
  kind: RequestKind;
  email: string;
}

/** The Home contact form: a message with an optional phone number. */
export interface GeneralSubmission {
  type: "general";
  name: string;
  email: string;
  phone: string;
  message: string;
}

/** A request that passed every check and is ready to mail. */
export type ValidSubmission =
  ContactSubmission | CaptureSubmission | GeneralSubmission;

/**
 * `ok` with the values to send, `ok: false` with field errors in the client
 * wording, `bad` for a body no form can produce, `honeypot` for a bot (the
 * route answers it as if it worked).
 */
export type ParsedSubmission =
  | { ok: true; submission: ValidSubmission }
  | { ok: false; errors: ContactErrors }
  | { ok: false; bad: true }
  | { ok: false; honeypot: true };

type SharedFields = Pick<
  ContactSubmission,
  "name" | "email" | "org" | "role" | "message"
>;

const DAY_MS = 86_400_000;

const bad = (): ParsedSubmission => ({ ok: false, bad: true });

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function isOption(list: readonly string[], value: unknown): value is string {
  return typeof value === "string" && list.includes(value);
}

/** At most as many entries as there are products, each one a product. */
function isProductList(value: unknown): value is string[] {
  const pills: readonly string[] = CONTACT_STRINGS.productPills;
  return (
    Array.isArray(value) &&
    value.length <= pills.length &&
    value.every((item) => isOption(pills, item))
  );
}

/**
 * The earliest "today" a visitor can have in any time zone is the UTC date
 * minus one day (UTC-12), so that is the server's cut-off.
 */
function earliestToday(now: Date): string {
  return new Date(now.getTime() - DAY_MS).toISOString().slice(0, 10);
}

/** The Product demo request, or null when a select value is not an option. */
function readDemo(
  raw: Record<string, unknown>,
  shared: SharedFields,
): ContactSubmission | null {
  const { products, schoolSize } = raw;
  if (
    !isProductList(products) ||
    !isOption(CONTACT_STRINGS.schoolSizes, schoolSize)
  ) {
    return null;
  }
  return {
    ...shared,
    type: "demo",
    products,
    schoolSize,
    date: text(raw.date),
  };
}

/** The Outsourcing project request, or null when a select value is not an option. */
function readProject(
  raw: Record<string, unknown>,
  shared: SharedFields,
): ContactSubmission | null {
  const { service, startTiming } = raw;
  if (
    !isOption(CONTACT_STRINGS.services, service) ||
    !isOption(CONTACT_STRINGS.startTimings, startTiming)
  ) {
    return null;
  }
  return { ...shared, type: "project", service, startTiming };
}

/**
 * The email band's request, or `bad` when the kind is not demo or project.
 * The email follows the form's rule: trimmed, valid and at most 254 characters.
 */
function readCapture(raw: Record<string, unknown>): ParsedSubmission {
  const { kind } = raw;
  if (kind !== "demo" && kind !== "project") return bad();
  const email = text(raw.email).trim();
  if (!isValidEmail(email) || email.length > EMAIL_MAX_LENGTH) {
    return { ok: false, errors: { email: CONTACT_ERRORS.email } };
  }
  return { ok: true, submission: { type: "capture", kind, email } };
}

/** The Home contact form's message; fields of other types are ignored. */
function readGeneral(raw: Record<string, unknown>): ParsedSubmission {
  const submission: GeneralSubmission = {
    type: "general",
    name: text(raw.name).trim(),
    email: text(raw.email).trim(),
    phone: text(raw.phone).trim(),
    message: text(raw.message),
  };
  const errors = validateContact(
    "general",
    { ...submission, org: "", date: "" },
    "",
  );
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, submission };
}

/**
 * Check an untrusted request body with the rules of the form. Only the fields
 * of the chosen tab (or of the email band) are read. `serverToday` is the
 * current time on the server.
 */
export function parseSubmission(
  body: unknown,
  serverToday: Date,
): ParsedSubmission {
  if (typeof body !== "object" || body === null) return bad();
  const raw = body as Record<string, unknown>;
  const { type } = raw;
  if (
    type !== "demo" &&
    type !== "project" &&
    type !== "capture" &&
    type !== "general"
  ) {
    return bad();
  }
  if (raw.website) return { ok: false, honeypot: true };
  if (type === "capture") return readCapture(raw);
  if (type === "general") return readGeneral(raw);

  // Role has no error slot in the form; its 200-character cap is an input
  // `maxLength`, so a longer value did not come from the form.
  const role = text(raw.role);
  if (role.length > TEXT_MAX_LENGTH) return bad();
  const shared: SharedFields = {
    name: text(raw.name).trim(),
    email: text(raw.email).trim(),
    org: text(raw.org).trim(),
    role,
    message: text(raw.message),
  };
  const submission =
    type === "demo" ? readDemo(raw, shared) : readProject(raw, shared);
  if (!submission) return bad();

  const errors = validateContact(
    type,
    { ...shared, date: submission.type === "demo" ? submission.date : "" },
    earliestToday(serverToday),
  );
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, submission };
}
