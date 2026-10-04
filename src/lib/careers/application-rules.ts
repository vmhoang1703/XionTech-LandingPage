import {
  EMAIL_MAX_LENGTH,
  LENGTH_ERROR,
  MESSAGE_MAX_LENGTH,
  TEXT_MAX_LENGTH,
  isValidEmail,
} from "@/lib/contact/contact-rules";

export type ApplicationField = "name" | "email" | "phone" | "note" | "cv";

export type ApplicationErrors = Partial<Record<ApplicationField, string>>;

export type ApplicationValues = {
  name: string;
  email: string;
  phone: string;
  note: string;
  cv: { name: string; size: number } | null;
};

export const JOB_ERRORS = {
  name: "Please enter your name.",
  email: "Please enter a valid email address.",
  cv: "Please upload your CV as a PDF or Word file, up to 5 MB.",
  note: "Please keep your note under 2,000 characters.",
} as const;

export const CV_MAX_BYTES = 5 * 1024 * 1024;

export const CV_TYPES: Readonly<Record<string, string>> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function extensionOf(name: string): string | undefined {
  const ext = name.slice(name.lastIndexOf(".") + 1).toLowerCase();
  return name.includes(".") && Object.hasOwn(CV_TYPES, ext) ? ext : undefined;
}

function sizeOk(size: number): boolean {
  return size >= 1 && size <= CV_MAX_BYTES;
}

/** Browser check on a chosen file: extension and size only. */
export function cvError(file: {
  name: string;
  size: number;
}): string | undefined {
  return extensionOf(file.name) && sizeOk(file.size)
    ? undefined
    : JOB_ERRORS.cv;
}

/** Server check on the stored blob: extension, size and a matching MIME type. */
export function storedCvError(blob: {
  pathname: string;
  size: number;
  contentType: string;
}): string | undefined {
  const ext = extensionOf(blob.pathname);
  const mime = blob.contentType.split(";")[0].trim().toLowerCase();
  return ext && sizeOk(blob.size) && CV_TYPES[ext] === mime
    ? undefined
    : JOB_ERRORS.cv;
}

export function validateApplication(
  values: ApplicationValues,
): ApplicationErrors {
  const errors: ApplicationErrors = {};
  const email = values.email.trim();
  if (!values.name.trim()) errors.name = JOB_ERRORS.name;
  else if (values.name.length > TEXT_MAX_LENGTH) errors.name = LENGTH_ERROR;
  if (!isValidEmail(email) || email.length > EMAIL_MAX_LENGTH) {
    errors.email = JOB_ERRORS.email;
  }
  if (values.phone.length > TEXT_MAX_LENGTH) errors.phone = LENGTH_ERROR;
  if (values.note.replaceAll("\r\n", "\n").length > MESSAGE_MAX_LENGTH) {
    errors.note = JOB_ERRORS.note;
  }
  if (!values.cv || cvError(values.cv)) errors.cv = JOB_ERRORS.cv;
  return errors;
}
