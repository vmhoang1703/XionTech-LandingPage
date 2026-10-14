"use client";

import {
  LocaleLink,
  useContactErrorText,
  useLocale,
  useLocalized,
} from "@/components/layout/locale-link";
import { localeHref } from "@/i18n/locales";
import { useRouter } from "next/navigation";
import { useRef, useState, type SubmitEvent } from "react";
import { CONTACT_HREF } from "@/components/layout/nav-data";
import {
  CONTACT_ERRORS,
  EMAIL_MAX_LENGTH,
  isValidEmail,
  type RequestKind,
} from "@/lib/contact/contact-rules";
import { rememberCapturedEmail } from "./capture-storage";
import {
  CONTACT_STRINGS,
  CONTACT_STRINGS_VI,
  localizeError,
} from "./contact-strings";

/** Plain looks have no corner rings and an amber button (E-A4). */
const LOOK_SURFACES = {
  white: "surface-paper",
  page: "hero-light",
  navy: "surface-navy",
} as const;

const ERROR_ID = "cap-err";

// An email field that leads to the Home Get in touch form with the email
// already filled in (lead, 2026-10-13: the Demo page is inactive, one form
// for everything). Nothing is sent from the band itself.
export function CaptureBand({
  kind,
  look,
  copy: copyOverride,
  id,
}: Readonly<{
  kind: RequestKind;
  look?: keyof typeof LOOK_SURFACES;
  copy?: { heading: string; lede: string };
  id?: string;
}>) {
  const router = useRouter();
  const locale = useLocale();
  const T = useLocalized("contactStrings", {
    en: CONTACT_STRINGS,
    vi: CONTACT_STRINGS_VI,
  });
  const errorText = useContactErrorText();
  const S = T.capture;
  const FORM = T.form;
  const copy = copyOverride
    ? { ...S[kind], heading: copyOverride.heading, lede: copyOverride.lede }
    : S[kind];
  const [email, setEmail] = useState("");
  const [invalid, setInvalid] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!isValidEmail(value) || value.length > EMAIL_MAX_LENGTH) {
      setInvalid(true);
      emailRef.current?.focus();
      return;
    }
    rememberCapturedEmail(value);
    router.push(localeHref(locale, CONTACT_HREF));
  }

  return (
    <section
      id={id}
      className={
        look
          ? `capture capture-plain ${LOOK_SURFACES[look]}`
          : "capture surface-amber"
      }
      aria-labelledby="cap-h"
    >
      <div className="wrap cap-grid" data-reveal="">
        <div>
          <h2 id="cap-h">{copy.heading}</h2>
          <p className="lede">{copy.lede}</p>
        </div>
        <form className="cap-form" method="post" noValidate onSubmit={onSubmit}>
          <label htmlFor="cap-email">{S.emailLabel}</label>
          <div className="cap-row">
            <input
              ref={emailRef}
              id="cap-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={copy.placeholder}
              required
              value={email}
              aria-invalid={invalid || undefined}
              aria-describedby={invalid ? ERROR_ID : undefined}
              onChange={(event) => {
                setEmail(event.target.value);
                setInvalid(false);
              }}
            />
            <button
              className={look ? "btn btn-primary" : "btn btn-navy"}
              type="submit"
            >
              {copy.button}
            </button>
          </div>
          {invalid && (
            <small id={ERROR_ID} className="err" role="alert">
              {localizeError(CONTACT_ERRORS.email, locale, errorText)}
            </small>
          )}
          <small>
            <span>{copy.consent}</span>{" "}
            <LocaleLink href="/privacy">{FORM.privacyLink}</LocaleLink>
          </small>
        </form>
      </div>
    </section>
  );
}
