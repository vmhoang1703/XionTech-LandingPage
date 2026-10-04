"use client";

import { CheckCircleIcon, PaperPlaneTiltIcon } from "@phosphor-icons/react";
import { uploadPresigned } from "@vercel/blob/client";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from "react";
import { postSubmission } from "@/components/contact/post-submission";
import { jobForm } from "@/content/job";
import {
  CV_TYPES,
  JOB_ERRORS,
  cvError,
  validateApplication,
} from "@/lib/careers/application-rules";
import { EMAIL_MAX_LENGTH, TEXT_MAX_LENGTH } from "@/lib/contact/contact-rules";

type JobField = "name" | "email" | "cv" | "note";
type JobErrors = Partial<Record<JobField, string>>;

const UPLOAD_TIMEOUT_MS = 60_000;
// The apply route may run for 30 s; wait longer so a slow send is not sent twice.
const APPLY_TIMEOUT_MS = 35_000;
const CV_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/** Fields in form order, so the first invalid one gets focus. */
const FIELD_ORDER: readonly JobField[] = ["name", "email", "cv", "note"];
const FIELD_IDS: Record<JobField, string> = {
  name: "a-name",
  email: "a-email",
  cv: "a-cv",
  note: "a-note",
};
const errorId = (field: JobField) => `${FIELD_IDS[field]}-err`;
const CV_HELP_ID = "a-cv-help";

function text(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === "string" ? value : "";
}

function withoutError(errors: JobErrors, field: JobField): JobErrors {
  if (!errors[field]) return errors;
  const next = { ...errors };
  delete next[field];
  return next;
}

/** Lower-cased extension of a file the visitor chose; `cvError` has checked it. */
const extensionOf = (name: string) =>
  name.slice(name.lastIndexOf(".") + 1).toLowerCase();

async function uploadCv(file: File): Promise<string> {
  const ext = extensionOf(file.name);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);
  try {
    const blob = await uploadPresigned(`cv/application.${ext}`, file, {
      access: "private",
      handleUploadUrl: "/api/careers/cv-upload",
      contentType: CV_TYPES[ext],
      multipart: false,
      abortSignal: controller.signal,
    });
    return blob.pathname;
  } finally {
    clearTimeout(timer);
  }
}

export function JobApplicationForm({ slug }: Readonly<{ slug: string }>) {
  const [errors, setErrors] = useState<JobErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [failure, setFailure] = useState<"send" | "rate" | null>(null);
  const [announcement, setAnnouncement] = useState({
    count: 0,
    messages: [] as string[],
  });
  const panelRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  // The last file that reached the store, so a retry does not upload it again.
  const uploaded = useRef<{ file: File; pathname: string } | null>(null);

  // The button that had focus is gone (success) or was disabled (failure), so
  // put focus where the visitor can read the result and go on.
  useEffect(() => {
    if (status === "sent") panelRef.current?.focus();
  }, [status]);
  useEffect(() => {
    if (failure) submitRef.current?.focus();
  }, [failure]);

  function announce(found: JobErrors) {
    const messages = FIELD_ORDER.flatMap((field) => found[field] ?? []);
    setAnnouncement((current) => ({ count: current.count + 1, messages }));
  }

  /** Show, announce and focus the invalid fields; true when there are any. */
  function showErrors(form: HTMLFormElement, found: JobErrors): boolean {
    setErrors(found);
    announce(found);
    const first = FIELD_ORDER.find((field) => found[field]);
    if (!first) return false;
    form.querySelector<HTMLElement>(`#${FIELD_IDS[first]}`)?.focus();
    return true;
  }

  function onFieldChange(event: ChangeEvent<HTMLFormElement>) {
    const target = event.target;
    const field = FIELD_ORDER.find((f) => FIELD_IDS[f] === target.id);
    if (!field) return;
    if (field !== "cv") {
      setErrors((current) => withoutError(current, field));
      return;
    }
    const file = target instanceof HTMLInputElement ? target.files?.[0] : null;
    const message = file ? cvError(file) : JOB_ERRORS.cv;
    setErrors((current) =>
      message ? { ...current, cv: message } : withoutError(current, "cv"),
    );
    announce(message ? { cv: message } : {});
  }

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const file = form.querySelector<HTMLInputElement>("#a-cv")?.files?.[0];
    const name = text(data, "name").trim();
    const email = text(data, "email").trim();
    const note = text(data, "note");
    const found: JobErrors = validateApplication({ name, email, note });
    const cv = file ? cvError(file) : JOB_ERRORS.cv;
    if (cv) found.cv = cv;
    setFailure(null);
    if (showErrors(form, found) || !file) return;

    setStatus("sending");
    let pathname: string;
    try {
      pathname =
        uploaded.current?.file === file
          ? uploaded.current.pathname
          : await uploadCv(file);
    } catch {
      setStatus("idle");
      setFailure("send");
      return;
    }
    uploaded.current = { file, pathname };

    const result = await postSubmission(
      {
        slug,
        name,
        email,
        phone: text(data, "phone").trim(),
        note,
        cv: pathname,
        website: text(data, "website"),
      },
      {
        endpoint: "/api/careers/apply",
        fields: FIELD_ORDER,
        timeoutMs: APPLY_TIMEOUT_MS,
      },
    );
    if (result.kind === "sent") {
      setStatus("sent");
      return;
    }
    setStatus("idle");
    if (result.kind === "errors") {
      if (result.errors.cv) uploaded.current = null;
      showErrors(form, result.errors);
    } else {
      setFailure(result.kind);
    }
  }

  const invalidProps = (field: JobField) =>
    errors[field]
      ? { "aria-invalid": true, "aria-describedby": errorId(field) }
      : {};
  const fieldClass = (field: JobField, extra = "") =>
    ["field", extra, errors[field] ? "bad" : ""].filter(Boolean).join(" ");
  const fieldError = (field: JobField) =>
    errors[field] ? (
      <span id={errorId(field)} className="err">
        {errors[field]}
      </span>
    ) : null;

  if (status === "sent") {
    return (
      <>
        <h2>{jobForm.heading}</h2>
        <div ref={panelRef} className="form-ok" role="status" tabIndex={-1}>
          <CheckCircleIcon weight="fill" aria-hidden="true" />
          <h3>{jobForm.successHeading}</h3>
          <p>{jobForm.successText}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h2>{jobForm.heading}</h2>
      <form
        method="post"
        noValidate
        onSubmit={onSubmit}
        onChange={onFieldChange}
      >
        <div className="fgrid2">
          <div className={fieldClass("name", "full")}>
            <label htmlFor="a-name">{jobForm.name}</label>
            <input
              id="a-name"
              name="name"
              autoComplete="name"
              maxLength={TEXT_MAX_LENGTH}
              required
              {...invalidProps("name")}
            />
            {fieldError("name")}
          </div>
          <div className={fieldClass("email")}>
            <label htmlFor="a-email">{jobForm.email}</label>
            <input
              id="a-email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={EMAIL_MAX_LENGTH}
              required
              {...invalidProps("email")}
            />
            {fieldError("email")}
          </div>
          <div className="field">
            <label htmlFor="a-phone">{jobForm.phone}</label>
            <input
              id="a-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={TEXT_MAX_LENGTH}
            />
          </div>
          <div className={fieldClass("cv", "full")}>
            <label htmlFor="a-cv">{jobForm.cv}</label>
            <input
              id="a-cv"
              name="cv"
              type="file"
              accept={CV_ACCEPT}
              required
              aria-describedby={
                errors.cv ? `${CV_HELP_ID} ${errorId("cv")}` : CV_HELP_ID
              }
              aria-invalid={errors.cv ? true : undefined}
            />
            <span id={CV_HELP_ID} className="help">
              {jobForm.cvHelp}
            </span>
            {fieldError("cv")}
          </div>
          <div className={fieldClass("note", "full")}>
            <label htmlFor="a-note">{jobForm.note}</label>
            <textarea id="a-note" name="note" {...invalidProps("note")} />
            {fieldError("note")}
          </div>
        </div>
        <input
          className="sr-only"
          name="website"
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
        />
        {failure && (
          <p className="form-alert" role="alert">
            {failure === "rate" ? jobForm.rateError : jobForm.sendError}
          </p>
        )}
        <button
          ref={submitRef}
          className="btn btn-primary"
          type="submit"
          disabled={status === "sending"}
        >
          <span>{status === "sending" ? jobForm.sending : jobForm.submit}</span>
          <PaperPlaneTiltIcon aria-hidden="true" />
        </button>
        <p className="consent">
          {jobForm.consent}{" "}
          <Link href={jobForm.privacyHref}>{jobForm.privacyLink}</Link>
        </p>
        <div className="sr-only" aria-live="polite">
          {announcement.messages.length > 0 && (
            <div key={announcement.count}>
              <p>{jobForm.errorsHeading}</p>
              <ul>
                {announcement.messages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </form>
    </>
  );
}
