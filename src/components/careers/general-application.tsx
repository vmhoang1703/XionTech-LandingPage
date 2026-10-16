"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type SubmitEvent } from "react";
import {
  useContactErrorText,
  useLocale,
  useLocalized,
} from "@/components/layout/locale-link";
import {
  CONTACT_STRINGS,
  CONTACT_STRINGS_VI,
  localizeErrors,
} from "@/components/contact/contact-strings";
import { postSubmission } from "@/components/contact/post-submission";
import type { careersGeneralApplication } from "@/content/careers";
import { focusField } from "@/lib/a11y/focus-field";
import {
  CONTACT_ERRORS,
  EMAIL_MAX_LENGTH,
  isValidEmail,
} from "@/lib/contact/contact-rules";

const FIELDS = ["email"] as const;

/**
 * "Don't see a role that fits?": an email-only form below the roles list. It
 * posts a `general-application` to /api/contact, which mails the contact inbox
 * (docs/contact-delivery.md). Same honeypot, rules and messages as the other
 * site forms.
 */
export function GeneralApplication({
  copy,
}: Readonly<{ copy: typeof careersGeneralApplication }>) {
  const locale = useLocale();
  const F = useLocalized("contactStrings", {
    en: CONTACT_STRINGS,
    vi: CONTACT_STRINGS_VI,
  }).form;
  const errorText = useContactErrorText();
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [failure, setFailure] = useState<"send" | "rate" | null>(null);
  const okRef = useRef<HTMLParagraphElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (status === "sent") okRef.current?.focus();
  }, [status]);
  useEffect(() => {
    if (failure) submitRef.current?.focus();
  }, [failure]);

  function showError(form: HTMLFormElement, english: string) {
    setError(localizeErrors({ email: english }, locale, errorText).email);
    focusField(form.querySelector<HTMLElement>("#ga-email"));
  }

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const raw = data.get("email");
    const email = typeof raw === "string" ? raw.trim() : "";
    const website = data.get("website");
    setFailure(null);
    if (!isValidEmail(email) || email.length > EMAIL_MAX_LENGTH) {
      showError(form, CONTACT_ERRORS.email);
      return;
    }
    setError(undefined);
    setStatus("sending");
    const result = await postSubmission(
      {
        type: "general-application",
        email,
        website: typeof website === "string" ? website : "",
      },
      { fields: FIELDS },
    );
    if (result.kind === "sent") {
      setStatus("sent");
      return;
    }
    setStatus("idle");
    if (result.kind === "errors") showError(form, result.errors.email ?? "");
    else setFailure(result.kind);
  }

  const invalidProps = error
    ? { "aria-invalid": true, "aria-describedby": "ga-email-err" }
    : {};
  const submitLabel = status === "sending" ? copy.sending : copy.submit;

  return (
    <div className="general-app" data-reveal="">
      <div className="general-app-copy">
        <h3 id="general-app-h">{copy.heading}</h3>
        <p>{copy.lede}</p>
      </div>
      {status === "sent" ? (
        <p
          ref={okRef}
          className="general-app-ok"
          aria-live="polite"
          tabIndex={-1}
        >
          {copy.success}
        </p>
      ) : (
        <form
          method="post"
          noValidate
          onSubmit={onSubmit}
          onChange={() => setError(undefined)}
          aria-labelledby="general-app-h"
        >
          <div className="general-app-row">
            <div className={error ? "field bad" : "field"}>
              <label htmlFor="ga-email">{copy.emailLabel}</label>
              <input
                id="ga-email"
                name="email"
                type="email"
                autoComplete="email"
                maxLength={EMAIL_MAX_LENGTH}
                required
                {...invalidProps}
              />
              {error ? (
                <span id="ga-email-err" className="err">
                  {error}
                </span>
              ) : null}
            </div>
            <button
              ref={submitRef}
              className="btn btn-primary"
              type="submit"
              disabled={status === "sending"}
            >
              <span>{submitLabel}</span>
              <ArrowRightIcon aria-hidden="true" />
            </button>
          </div>
          <input
            className="sr-only"
            name="website"
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
          />
          {failure ? (
            <p className="form-alert" role="alert">
              {failure === "rate" ? F.rateError : F.sendError}
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}
