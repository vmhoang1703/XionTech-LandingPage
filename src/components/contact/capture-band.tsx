"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type SubmitEvent } from "react";
import {
  CONTACT_ERRORS,
  EMAIL_MAX_LENGTH,
  isValidEmail,
  type RequestKind,
} from "@/lib/contact/contact-rules";
import { CAPTURE_EMAIL_KEY } from "./capture-storage";
import { CONTACT_STRINGS } from "./contact-strings";
import { postSubmission } from "./post-submission";

const S = CONTACT_STRINGS.capture;
const FORM = CONTACT_STRINGS.form;

const DESTINATIONS: Record<RequestKind, string> = {
  demo: "/demo#form",
  project: "/demo#project",
};

/** Plain looks have no corner rings and an amber button (E-A4). */
const LOOK_SURFACES = {
  white: "surface-paper",
  page: "hero-light",
  navy: "surface-navy",
} as const;

const MESSAGES = {
  email: CONTACT_ERRORS.email,
  send: FORM.sendError,
  rate: FORM.rateError,
};
const ERROR_ID = "cap-err";

/** The email is never put in the URL; the /demo form reads it from here once. */
function rememberEmail(email: string) {
  try {
    sessionStorage.setItem(CAPTURE_EMAIL_KEY, email);
  } catch {
    // Storage is blocked: the visitor still lands on the right tab, with no
    // prefill and no error. The email is not logged.
  }
}

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
  const copy = copyOverride
    ? { ...S[kind], heading: copyOverride.heading, lede: copyOverride.lede }
    : S[kind];
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [problem, setProblem] = useState<keyof typeof MESSAGES | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  // The button was disabled while sending and lost focus, so put it back
  // where the visitor can read the message and retry.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (problem === "send" || problem === "rate") submitRef.current?.focus();
  }, [problem]);

  function showEmailError() {
    setProblem("email");
    emailRef.current?.focus();
  }

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!isValidEmail(value) || value.length > EMAIL_MAX_LENGTH) {
      showEmailError();
      return;
    }

    setProblem(null);
    setStatus("sending");
    const result = await postSubmission({
      type: "capture",
      kind,
      email: value,
      website,
    });
    // The visitor left while the send was pending: do not pull them back.
    if (!mountedRef.current) return;
    if (result.kind === "sent") {
      // The button stays disabled until the new page replaces this one.
      rememberEmail(value);
      router.push(DESTINATIONS[kind]);
      return;
    }
    setStatus("idle");
    if (result.kind === "errors") showEmailError();
    else setProblem(result.kind);
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
              aria-invalid={problem === "email" || undefined}
              aria-describedby={problem === "email" ? ERROR_ID : undefined}
              onChange={(event) => {
                setEmail(event.target.value);
                setProblem((current) => (current === "email" ? null : current));
              }}
            />
            <button
              ref={submitRef}
              className={look ? "btn btn-primary" : "btn btn-navy"}
              type="submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? FORM.sending : copy.button}
            </button>
          </div>
          <input
            className="sr-only"
            name="website"
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
          {problem && (
            <small id={ERROR_ID} className="err" role="alert">
              {MESSAGES[problem]}
            </small>
          )}
          <small>
            <span>{copy.consent}</span>{" "}
            <Link href="/privacy">{FORM.privacyLink}</Link>
          </small>
        </form>
      </div>
    </section>
  );
}
