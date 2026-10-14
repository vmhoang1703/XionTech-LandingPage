"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { LocaleLink, useLocale } from "@/components/layout/locale-link";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from "react";
import {
  EMAIL_MAX_LENGTH,
  PHONE_MAX_LENGTH,
  TEXT_MAX_LENGTH,
  validateContact,
  type ContactErrors,
} from "@/lib/contact/contact-rules";
import { fillCapturedEmail } from "./capture-storage";
import { pickLocale } from "@/i18n/content";
import {
  CONTACT_STRINGS,
  CONTACT_STRINGS_VI,
  localizeErrors,
} from "./contact-strings";
import { postSubmission } from "./post-submission";
import { SummitMark } from "./summit-mark";

/** Fields in form order, so the first invalid one gets focus. */
const FIELDS = ["name", "email", "phone", "message"] as const;
type HomeField = (typeof FIELDS)[number];

const FIELD_IDS: Record<HomeField, string> = {
  name: "c-name",
  email: "c-email",
  phone: "c-phone",
  message: "c-msg",
};
const errorId = (field: HomeField) => `${FIELD_IDS[field]}-err`;

function text(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === "string" ? value : "";
}

function withoutError(errors: ContactErrors, field: HomeField): ContactErrors {
  if (!errors[field]) return errors;
  const next = { ...errors };
  delete next[field];
  return next;
}

export function HomeContactForm() {
  const locale = useLocale();
  const T = pickLocale(locale, { en: CONTACT_STRINGS, vi: CONTACT_STRINGS_VI });
  const S = T.home;
  const F = T.form;
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [failure, setFailure] = useState<"send" | "rate" | null>(null);
  const [announcement, setAnnouncement] = useState({
    count: 0,
    messages: [] as string[],
  });
  const panelRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  // The button that had focus is gone (success) or was disabled (failure), so
  // put focus where the visitor can read the result and go on.
  useEffect(() => {
    if (status === "sent") panelRef.current?.focus();
  }, [status]);
  // A capture band on another page sends its email here (lead, 2026-10-13).
  useEffect(() => {
    fillCapturedEmail("c-email");
  }, []);
  useEffect(() => {
    if (failure) submitRef.current?.focus();
  }, [failure]);

  function onFieldChange(event: ChangeEvent<HTMLFormElement>) {
    const field = FIELDS.find((f) => FIELD_IDS[f] === event.target.id);
    if (!field) return;
    setErrors((current) => withoutError(current, field));
  }

  /** Show, announce and focus the invalid fields; true when there are any. */
  function showErrors(form: HTMLFormElement, english: ContactErrors): boolean {
    const found: ContactErrors = localizeErrors(english, locale);
    const invalid = FIELDS.filter((field) => found[field]);
    setErrors(found);
    setAnnouncement((current) => ({
      count: current.count + 1,
      messages: invalid.map((field) => found[field] ?? ""),
    }));
    if (invalid.length === 0) return false;
    form.querySelector<HTMLElement>(`#${FIELD_IDS[invalid[0]]}`)?.focus();
    return true;
  }

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      name: text(data, "name").trim(),
      email: text(data, "email").trim(),
      phone: text(data, "phone").trim(),
      message: text(data, "message"),
    };
    const found = validateContact(
      "general",
      { ...values, org: "", date: "" },
      "",
    );
    setFailure(null);
    if (showErrors(form, found)) return;

    setStatus("sending");
    const result = await postSubmission(
      { type: "general", ...values, website: text(data, "website") },
      { fields: FIELDS },
    );
    if (result.kind === "sent") {
      setStatus("sent");
      return;
    }
    setStatus("idle");
    if (result.kind === "errors") showErrors(form, result.errors);
    else setFailure(result.kind);
  }

  const invalidProps = (field: HomeField) =>
    errors[field]
      ? { "aria-invalid": true, "aria-describedby": errorId(field) }
      : {};
  const fieldClass = (field: HomeField, extra = "") =>
    ["field", extra, errors[field] ? "bad" : ""].filter(Boolean).join(" ");
  const fieldError = (field: HomeField) =>
    errors[field] ? (
      <span id={errorId(field)} className="err">
        {errors[field]}
      </span>
    ) : null;

  if (status === "sent") {
    return (
      <div
        ref={panelRef}
        className="form-ok"
        aria-live="polite"
        aria-atomic="true"
        tabIndex={-1}
      >
        <SummitMark />
        <h3>{S.successHeading}</h3>
        <p>{S.successText}</p>
      </div>
    );
  }

  return (
    <form
      id="contactForm"
      method="post"
      noValidate
      onSubmit={onSubmit}
      onChange={onFieldChange}
    >
      <div className="fgrid2">
        <div className={fieldClass("name")}>
          <label htmlFor="c-name">{S.name}</label>
          <input
            id="c-name"
            name="name"
            autoComplete="name"
            maxLength={TEXT_MAX_LENGTH}
            required
            {...invalidProps("name")}
          />
          {fieldError("name")}
        </div>
        <div className={fieldClass("email")}>
          <label htmlFor="c-email">{S.email}</label>
          <input
            id="c-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={EMAIL_MAX_LENGTH}
            required
            {...invalidProps("email")}
          />
          {fieldError("email")}
        </div>
        <div className={fieldClass("phone", "full")}>
          <label htmlFor="c-phone">
            {S.phone} <span className="opt">{S.optional}</span>
          </label>
          <input
            id="c-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={PHONE_MAX_LENGTH}
            placeholder={S.phonePlaceholder}
            {...invalidProps("phone")}
          />
          {fieldError("phone")}
        </div>
        <div className={fieldClass("message", "full")}>
          <label htmlFor="c-msg">{S.message}</label>
          <textarea
            id="c-msg"
            name="message"
            rows={5}
            required
            placeholder={S.messagePlaceholder}
            {...invalidProps("message")}
          />
          {fieldError("message")}
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
          {failure === "rate" ? F.rateError : F.sendError}
        </p>
      )}
      <button
        ref={submitRef}
        className="btn btn-primary form-submit"
        type="submit"
        disabled={status === "sending"}
      >
        <span>{status === "sending" ? F.sending : S.submit}</span>
        <ArrowRightIcon aria-hidden="true" />
      </button>
      <p className="consent">
        {S.consent} <LocaleLink href="/privacy">{F.privacyLink}</LocaleLink>
      </p>
      <div className="sr-only" aria-live="polite">
        {announcement.messages.length > 0 && (
          <div key={announcement.count}>
            <p>{F.errorsHeading}</p>
            <ul>
              {announcement.messages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </form>
  );
}
