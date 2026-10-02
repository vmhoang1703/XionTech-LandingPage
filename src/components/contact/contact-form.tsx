"use client";

import { PaperPlaneTiltIcon } from "@phosphor-icons/react";
import Link from "next/link";
import {
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type SubmitEvent,
  type KeyboardEvent,
} from "react";
import {
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactType,
} from "@/lib/contact/contact-rules";
import { CONTACT_STRINGS } from "./contact-strings";

const S = CONTACT_STRINGS.form;

const TYPES: readonly ContactType[] = ["demo", "project"];
const TAB_LABELS: Record<ContactType, string> = {
  demo: S.tabDemo,
  project: S.tabProject,
};

/** Fields in form order, so the first invalid one gets focus. */
const FIELD_IDS: Record<ContactField, string> = {
  name: "f-name",
  email: "f-email",
  org: "f-org",
  date: "f-date",
  message: "f-msg",
};
const FIELD_ORDER: readonly ContactField[] = [
  "name",
  "email",
  "org",
  "date",
  "message",
];
const errorId = (field: ContactField) => `${FIELD_IDS[field]}-err`;

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

interface ContactFormProps {
  /** Called with the values of a valid submit. Story 2.3 adds sending. */
  readonly onValidSubmit?: (values: ContactSubmission) => void;
}

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

const typeFromHash = (hash: string): ContactType =>
  hash === "#project" ? "project" : "demo";

function text(data: FormData, key: string): string {
  const value = data.get(key);
  return typeof value === "string" ? value : "";
}

function readValues(form: HTMLFormElement, type: ContactType) {
  const data = new FormData(form);
  const shared: SharedValues = {
    name: text(data, "name"),
    email: text(data, "email"),
    org: text(data, "org"),
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

export function ContactForm({ onValidSubmit = () => {} }: ContactFormProps) {
  // The hash and today's date only exist in the browser; the server snapshot
  // ("") keeps the server HTML on Product demo with no `min`.
  const hash = useSyncExternalStore(subscribeToHash, readHash, serverValue);
  const today = useSyncExternalStore(noSubscribe, localToday, serverValue);
  // A tab picked by the visitor holds until the hash changes again.
  const [choice, setChoice] = useState<{ type: ContactType; hash: string }>();
  const type = choice?.hash === hash ? choice.type : typeFromHash(hash);

  const [errors, setErrors] = useState<ContactErrors>({});
  const [announcement, setAnnouncement] = useState({
    count: 0,
    messages: [] as string[],
  });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function selectType(next: ContactType) {
    setChoice({ type: next, hash });
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next = nextTabIndex(event.key, TYPES.indexOf(type));
    if (next === null) return;
    event.preventDefault();
    selectType(TYPES[next]);
    tabRefs.current[next]?.focus();
  }

  function onFieldChange(event: ChangeEvent<HTMLFormElement>) {
    const field = FIELD_ORDER.find((f) => FIELD_IDS[f] === event.target.id);
    if (!field) return;
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = readValues(form, type);
    const found = validateContact(
      type,
      { ...values, date: values.type === "demo" ? values.date : "" },
      localToday(),
    );
    const invalid = FIELD_ORDER.filter((field) => found[field]);
    setErrors(found);
    setAnnouncement((current) => ({
      count: current.count + 1,
      messages: invalid.map((field) => found[field] ?? ""),
    }));
    if (invalid.length > 0) {
      form.querySelector<HTMLElement>(`#${FIELD_IDS[invalid[0]]}`)?.focus();
      return;
    }
    onValidSubmit(values);
  }

  const invalidProps = (field: ContactField) =>
    errors[field]
      ? { "aria-invalid": true, "aria-describedby": errorId(field) }
      : {};
  const fieldClass = (field: ContactField, extra = "") =>
    ["field", extra, errors[field] ? "bad" : ""].filter(Boolean).join(" ");
  const fieldError = (field: ContactField) =>
    errors[field] ? (
      <span id={errorId(field)} className="err">
        {errors[field]}
      </span>
    ) : null;

  return (
    <>
      <h2>{S.heading}</h2>
      <div
        className="ftabs"
        role="tablist"
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
        <button className="btn btn-primary" type="submit">
          <span>{S.submit}</span>
          <PaperPlaneTiltIcon aria-hidden="true" />
        </button>
        <p className="consent">
          {S.consent} <Link href="/privacy">{S.privacyLink}</Link>
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
