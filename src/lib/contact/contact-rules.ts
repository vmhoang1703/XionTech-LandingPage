export type ContactType = "demo" | "project";

export type ContactField = "name" | "email" | "org" | "date" | "message";

export type ContactValues = Record<ContactField, string>;

export type ContactErrors = Partial<Record<ContactField, string>>;

export const CONTACT_ERRORS: Record<ContactField, string> = {
  name: "Please enter your name.",
  email: "Please enter a valid email address.",
  org: "Please enter your organisation.",
  date: "Please choose today or a later date.",
  message: "Please keep your message under 2,000 characters.",
};

export const MESSAGE_MAX_LENGTH = 2000;

export const TEXT_MAX_LENGTH = 200;

export const EMAIL_MAX_LENGTH = 254;

export const LENGTH_ERROR = "Please keep this under 200 characters.";

const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(value: string): boolean {
  if (!DATE_FORMAT.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value)
  );
}

const EMAIL_PARTS = /^[^\s@]+@[^\s@]+$/;

// Prototype rule: text, "@", then a domain with a dot and 2+ characters after it.
function isValidEmail(value: string): boolean {
  if (!EMAIL_PARTS.test(value)) return false;
  const domain = value.slice(value.indexOf("@") + 1);
  const dot = domain.indexOf(".", 1);
  return dot !== -1 && domain.length - dot - 1 >= 2;
}

/**
 * Validate a contact request. `today` is a YYYY-MM-DD string in the
 * visitor's time zone. The date applies to the "demo" type only.
 */
export function validateContact(
  type: ContactType,
  values: ContactValues,
  today: string,
): ContactErrors {
  const errors: ContactErrors = {};
  const email = values.email.trim();
  if (!values.name.trim()) errors.name = CONTACT_ERRORS.name;
  else if (values.name.length > TEXT_MAX_LENGTH) errors.name = LENGTH_ERROR;
  if (!isValidEmail(email) || email.length > EMAIL_MAX_LENGTH) {
    errors.email = CONTACT_ERRORS.email;
  }
  if (!values.org.trim()) errors.org = CONTACT_ERRORS.org;
  else if (values.org.length > TEXT_MAX_LENGTH) errors.org = LENGTH_ERROR;
  if (
    type === "demo" &&
    values.date &&
    (!isValidDate(values.date) || values.date < today)
  ) {
    errors.date = CONTACT_ERRORS.date;
  }
  // Form posts send line breaks as CRLF; count each as one character.
  if (values.message.replaceAll("\r\n", "\n").length > MESSAGE_MAX_LENGTH) {
    errors.message = CONTACT_ERRORS.message;
  }
  return errors;
}
