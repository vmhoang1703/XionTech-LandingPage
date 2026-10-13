"use client";

import { PaperPlaneTiltIcon } from "@phosphor-icons/react";
import { LocaleLink } from "@/components/layout/locale-link";
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type SubmitEvent,
  type KeyboardEvent,
} from "react";
import {
  EMAIL_MAX_LENGTH,
  TEXT_MAX_LENGTH,
  validateContact,
  type ContactErrors,
  type RequestKind,
} from "@/lib/contact/contact-rules";
import { CAPTURE_EMAIL_KEY } from "./capture-storage";
import { CONTACT_STRINGS } from "./contact-strings";
import {
  FIELD_ORDER,
  postSubmission,
  type DemoFormField,
} from "./post-submission";
import { SummitMark } from "./summit-mark";

const S = CONTACT_STRINGS.form;

const TYPES: readonly RequestKind[] = ["demo", "project"];
const TAB_LABELS: Record<RequestKind, string> = {
  demo: S.tabDemo,
  project: S.tabProject,
};

/** Fields in form order, so the first invalid one gets focus. */
const FIELD_IDS: Record<DemoFormField, string> = {
  name: "f-name",
  email: "f-email",
  org: "f-org",
  date: "f-date",
  message: "f-msg",
};
const errorId = (field: DemoFormField) => `${FIELD_IDS[field]}-err`;

interface SharedValues {
  name: string;
  email: string;
  org: string;
  role: string;
  message: string;
}

/** Values of the active tab only; the hidden tab's fields are never included. */
export type ContactSubmission = SharedValues &
  (
    | { type: "demo"; products: string[]; schoolSize: string; date: string }
    | { type: "project"; service: string; startTiming: string }
  );

function subscribeToHash(onChange: () => void) {
  globalThis.addEventListener("hashchange", onChange);
  return () => globalThis.removeEventListener("hashchange", onChange);
}
const readHash = () => globalThis.location.hash;
const noSubscribe = () => () => {};
const serverValue = () => "";

/** Today as YYYY-MM-DD in the visitor's time zone. */
function localToday(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

const typeFromHash = (hash: string): RequestKind =>
  hash === "#project" ? "project" : "demo";

function text(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === "string" ? value : "";
}

function readValues(data: FormData, type: RequestKind) {
  const shared: SharedValues = {
    name: text(data, "name").trim(),
    email: text(data, "email").trim(),
    org: text(data, "org").trim(),
    role: text(data, "role"),
    message: text(data, "message"),
  };
  const submission: ContactSubmission =
    type === "demo"
      ? {
          type,
          ...shared,
          products: data
            .getAll("products")
            .filter((value) => typeof value === "string"),
          schoolSize: text(data, "schoolSize"),
          date: text(data, "date"),
        }
      : {
          type,
          ...shared,
          service: text(data, "service"),
          startTiming: text(data, "startTiming"),
        };
  return submission;
}

function withoutError(
  errors: ContactErrors,
  field: DemoFormField,
): ContactErrors {
  if (!errors[field]) return errors;
  const next = { ...errors };
  delete next[field];
  return next;
}

function nextTabIndex(key: string, index: number): number | null {
  const last = TYPES.length - 1;
  switch (key) {
    case "ArrowRight":
      return index === last ? 0 : index + 1;
    case "ArrowLeft":
      return index === 0 ? last : index - 1;
    case "Home":
      return 0;
    case "End":
      return last;
    default:
      return null;
  }
}

export function ContactForm() {
  // The hash and today's date only exist in the browser; the server snapshot
  // ("") keeps the server HTML on Product demo with no `min`.
  const hash = useSyncExternalStore(subscribeToHash, readHash, serverValue);
  const today = useSyncExternalStore(noSubscribe, localToday, serverValue);
  // A tab picked by the visitor holds until the hash changes again.
  const [choice, setChoice] = useState<{ type: RequestKind; hash: string }>();
  const type = choice?.hash === hash ? choice.type : typeFromHash(hash);

  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [failure, setFailure] = useState<"send" | "rate" | null>(null);
  const [announcement, setAnnouncement] = useState({
    count: 0,
    messages: [] as string[],
  });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  // The button that had focus is gone (success) or was disabled (failure), so
  // put focus where the visitor can read the result and go on.
  useEffect(() => {
    if (status === "sent") panelRef.current?.focus();
  }, [status]);
  useEffect(() => {
    if (failure) submitRef.current?.focus();
  }, [failure]);

  // The capture band leaves its email in session storage. Read it once after
  // mount, never overwrite a typed value, and never fail when storage is blocked.
  useEffect(() => {
    try {
      const email = sessionStorage.getItem(CAPTURE_EMAIL_KEY);
      if (email === null) return;
      sessionStorage.removeItem(CAPTURE_EMAIL_KEY);
      const input = document.getElementById("f-email");
      if (input instanceof HTMLInputElement && input.value === "") {
        input.value = email;
      }
    } catch {
      // Storage is blocked: the visitor still gets the form, without a prefill.
    }
  }, []);

  // `/demo#project` has no element to scroll to, so bring the form card in view.
  useEffect(() => {
    if (hash === "#project") {
      document.getElementById("form")?.scrollIntoView();
    }
  }, [hash]);

  function selectType(next: RequestKind) {
    if (next === type) return;
    setChoice({ type: next, hash });
    // The date is the only validated field on a single tab (Product demo).
    if (type === "demo") setErrors((current) => withoutError(current, "date"));
    setAnnouncement((current) => ({ ...current, messages: [] }));
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }
    const next = nextTabIndex(event.key, TYPES.indexOf(type));
    if (next === null) return;
    event.preventDefault();
    selectType(TYPES[next]);
    tabRefs.current[next]?.focus();
  }

  function onFieldChange(event: ChangeEvent<HTMLFormElement>) {
    const field = FIELD_ORDER.find((f) => FIELD_IDS[f] === event.target.id);
    if (!field) return;
    setErrors((current) => withoutError(current, field));
  }

  /** Show, announce and focus the invalid fields; true when there are any. */
  function showErrors(form: HTMLFormElement, found: ContactErrors): boolean {
    const invalid = FIELD_ORDER.filter((field) => found[field]);
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
    const values = readValues(data, type);
    const found = validateContact(
      type,
      {
        ...values,
        phone: "",
        date: values.type === "demo" ? values.date : "",
      },
      localToday(),
    );
    setFailure(null);
    if (showErrors(form, found)) return;

    setStatus("sending");
    const result = await postSubmission({
      ...values,
      website: text(data, "website"),
    });
    if (result.kind === "sent") {
      setStatus("sent");
      return;
    }
    setStatus("idle");
    if (result.kind === "errors") showErrors(form, result.errors);
    else setFailure(result.kind);
  }

  const invalidProps = (field: DemoFormField) =>
    errors[field]
      ? { "aria-invalid": true, "aria-describedby": errorId(field) }
      : {};
  const fieldClass = (field: DemoFormField, extra = "") =>
    ["field", extra, errors[field] ? "bad" : ""].filter(Boolean).join(" ");
  const fieldError = (field: DemoFormField) =>
    errors[field] ? (
      <span id={errorId(field)} className="err">
        {errors[field]}
      </span>
    ) : null;

  if (status === "sent") {
    return (
      <>
        <h2>{S.heading}</h2>
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
      </>
    );
  }

  return (
    <>
      <h2>{S.heading}</h2>
      <div
        className="ftabs"
        role="tablist"
        tabIndex={-1}
        aria-label={S.tabsLabel}
        onKeyDown={onTabKeyDown}
      >
        {TYPES.map((t, index) => (
          <button
            key={t}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${t}`}
            aria-selected={type === t}
            aria-controls={`panel-${t}`}
            tabIndex={type === t ? 0 : -1}
            onClick={() => selectType(t)}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>
      <form
        id="demoForm"
        method="post"
        noValidate
        onSubmit={onSubmit}
        onChange={onFieldChange}
      >
        <div className="fgrid2">
          <div className={fieldClass("name")}>
            <label htmlFor="f-name">{S.name}</label>
            <input
              id="f-name"
              name="name"
              autoComplete="name"
              maxLength={TEXT_MAX_LENGTH}
              required
              {...invalidProps("name")}
            />
            {fieldError("name")}
          </div>
          <div className={fieldClass("email")}>
            <label htmlFor="f-email">{S.email}</label>
            <input
              id="f-email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={EMAIL_MAX_LENGTH}
              required
              {...invalidProps("email")}
            />
            {fieldError("email")}
          </div>
          <div className={fieldClass("org")}>
            <label htmlFor="f-org">{S.org}</label>
            <input
              id="f-org"
              name="org"
              autoComplete="organization"
              maxLength={TEXT_MAX_LENGTH}
              required
              {...invalidProps("org")}
            />
            {fieldError("org")}
          </div>
          <div className="field">
            <label htmlFor="f-role">{S.role}</label>
            <input
              id="f-role"
              name="role"
              autoComplete="organization-title"
              maxLength={TEXT_MAX_LENGTH}
              aria-describedby="f-role-help"
            />
            <span id="f-role-help" className="help">
              {S.roleHelp}
            </span>
          </div>

          <div
            role="tabpanel"
            id="panel-demo"
            aria-labelledby="tab-demo"
            className="fpanel"
            hidden={type !== "demo"}
          >
            <fieldset className="field full">
              <legend>{S.products}</legend>
              <div className="checks">
                {CONTACT_STRINGS.productPills.map((product) => (
                  <label key={product}>
                    <input
                      type="checkbox"
                      name="products"
                      value={product}
                      defaultChecked={
                        product === CONTACT_STRINGS.defaultProduct
                      }
                    />{" "}
                    {product}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="field">
              <label htmlFor="f-size">{S.schoolSize}</label>
              <select id="f-size" name="schoolSize">
                {CONTACT_STRINGS.schoolSizes.map((size) => (
                  <option key={size}>{size}</option>
                ))}
              </select>
            </div>
            <div className={fieldClass("date")}>
              <label htmlFor="f-date">{S.date}</label>
              <input
                id="f-date"
                name="date"
                type="date"
                min={today || undefined}
                {...invalidProps("date")}
              />
              {fieldError("date")}
            </div>
          </div>

          <div
            role="tabpanel"
            id="panel-project"
            aria-labelledby="tab-project"
            className="fpanel"
            hidden={type !== "project"}
          >
            <div className="field">
              <label htmlFor="f-svc">{S.service}</label>
              <select id="f-svc" name="service">
                {CONTACT_STRINGS.services.map((service) => (
                  <option key={service}>{service}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="f-when">{S.startTiming}</label>
              <select id="f-when" name="startTiming">
                {CONTACT_STRINGS.startTimings.map((timing) => (
                  <option key={timing}>{timing}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={fieldClass("message", "full")}>
            <label htmlFor="f-msg">{S.message}</label>
            <textarea id="f-msg" name="message" {...invalidProps("message")} />
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
            {failure === "rate" ? S.rateError : S.sendError}
          </p>
        )}
        <button
          ref={submitRef}
          className="btn btn-primary"
          type="submit"
          disabled={status === "sending"}
        >
          <span>{status === "sending" ? S.sending : S.submit}</span>
          <PaperPlaneTiltIcon aria-hidden="true" />
        </button>
        <p className="consent">
          {S.consent} <LocaleLink href="/privacy">{S.privacyLink}</LocaleLink>
        </p>
        <div className="sr-only" aria-live="polite">
          {announcement.messages.length > 0 && (
            <div key={announcement.count}>
              <p>{S.errorsHeading}</p>
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
