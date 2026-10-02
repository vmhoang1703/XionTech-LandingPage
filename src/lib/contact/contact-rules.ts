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
  if (!values.name.trim()) errors.name = CONTACT_ERRORS.name;
  if (!isValidEmail(values.email.trim())) errors.email = CONTACT_ERRORS.email;
  if (!values.org.trim()) errors.org = CONTACT_ERRORS.org;
  if (type === "demo" && values.date && values.date < today) {
    errors.date = CONTACT_ERRORS.date;
  }
  if (values.message.length > MESSAGE_MAX_LENGTH) {
    errors.message = CONTACT_ERRORS.message;
  }
  return errors;
}
