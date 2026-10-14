"use client";

import { CaretDownIcon } from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  DEFAULT_LOCALE,
  htmlLang,
  isLocale,
  LOCALE_COOKIE,
  LANGUAGE_NAMES,
  LOCALES,
  type Locale,
} from "@/i18n/locales";

const LIST_ID = "language-list";
const STATE_KEY = "locale-switch";
const ONE_YEAR = 60 * 60 * 24 * 365;
// Typed values kept across a switch; passwords and files are never stored.
const FIELDS =
  "input[name]:not([type=password]):not([type=file]):not([type=hidden]), input[id]:not([name]):not([type=password]):not([type=file]):not([type=hidden]), textarea, select";

interface SavedState {
  path: string;
  scrollY: number;
  fields: Record<string, string | boolean>;
}

type Field = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

// A checkbox group shares one name (the contact form's product pills), so each box is
// keyed by name and value; a radio group keeps one key holding the checked value.
function fieldKey(field: Field) {
  if (
    field instanceof HTMLInputElement &&
    field.type === "checkbox" &&
    field.name
  ) {
    return `${field.name}=${field.value}`;
  }
  return field.name || field.id;
}

function isToggle(field: Field): field is HTMLInputElement {
  return (
    field instanceof HTMLInputElement &&
    (field.type === "checkbox" || field.type === "radio")
  );
}

function readFields(): SavedState["fields"] {
  const fields: SavedState["fields"] = {};
  document.querySelectorAll<Field>(FIELDS).forEach((field) => {
    const key = fieldKey(field);
    if (!key) return;
    if (isToggle(field)) {
      if (field.type === "checkbox") fields[key] = field.checked;
      else if (field.checked) fields[key] = field.value;
    } else {
      fields[key] = field.value;
    }
  });
  return fields;
}

// React tracks input values itself; set through the native setter and fire "input" so a
// controlled field's state follows.
function writeField(field: Field, value: string | boolean) {
  const proto = Object.getPrototypeOf(field) as object;
  if (isToggle(field)) {
    const checked = typeof value === "boolean" ? value : field.value === value;
    Object.getOwnPropertyDescriptor(proto, "checked")?.set?.call(
      field,
      checked,
    );
  } else {
    Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(
      field,
      String(value),
    );
  }
  field.dispatchEvent(new Event("input", { bubbles: true }));
  field.dispatchEvent(new Event("change", { bubbles: true }));
}

// Storage can be blocked (private mode, site data off); the switch still works without it.
function save(state: SavedState) {
  try {
    sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    // Restore is skipped silently when storage is unavailable (spec I/O matrix).
  }
}

function takeSaved(): SavedState | null {
  try {
    const raw = sessionStorage.getItem(STATE_KEY);
    sessionStorage.removeItem(STATE_KEY);
    return raw ? (JSON.parse(raw) as SavedState) : null;
  } catch {
    return null;
  }
}

// The new page grows as images, fonts and reveals load, and Next or a layout shift can move
// the scroll meanwhile. Keep putting it back (instant, so the smooth-scroll CSS does not
// animate it) until it has held for SETTLE_MS, the visitor scrolls, or GIVE_UP_MS passes.
const SETTLE_MS = 500;
const GIVE_UP_MS = 3000;
const USER_SCROLL = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

function restoreScroll(top: number) {
  const start = Date.now();
  let heldSince = start;
  let frame = 0;
  const stop = () => {
    cancelAnimationFrame(frame);
    USER_SCROLL.forEach((type) => window.removeEventListener(type, stop));
  };
  const step = () => {
    const now = Date.now();
    if (Math.abs(window.scrollY - top) > 1) {
      window.scrollTo({ top, behavior: "instant" });
      heldSince = now;
    }
    if (now - heldSince >= SETTLE_MS || now - start >= GIVE_UP_MS) {
      stop();
      return;
    }
    frame = requestAnimationFrame(step);
  };
  USER_SCROLL.forEach((type) =>
    window.addEventListener(type, stop, { passive: true }),
  );
  step();
  return stop;
}

// Off a locale path (the global 404, e.g. /de/products) the chosen locale replaces a
// two-letter first segment and is prefixed to anything else.
function swapLocale(pathname: string, locale: Locale) {
  const segments = pathname.split("/").slice(1);
  const rest = /^[a-z]{2}$/.test(segments[0] ?? "")
    ? segments.slice(1)
    : segments;
  const tail = rest.join("/");
  return tail ? `/${locale}/${tail}` : `/${locale}`;
}

function setLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
}

/** `label` is "Language" in the page's language (SiteHeader passes it). */
export function LanguageMenu({ label }: Readonly<{ label: string }>) {
  const pathname = usePathname();
  const router = useRouter();
  const segment = pathname.split("/")[1];
  const current = isLocale(segment) ? segment : undefined;
  const shown = current ?? DEFAULT_LOCALE;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Choosing and Escape return focus to the button; an outside click or Tab away only
  // closes, so focus stays where the visitor put it (AC-NAV-1).
  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  // Restore what the page had before a switch, once, on the page it was meant for.
  useEffect(() => {
    const saved = takeSaved();
    if (saved?.path !== pathname) return;
    Object.entries(saved.fields).forEach(([key, value]) => {
      document
        .querySelectorAll<Field>(FIELDS)
        .forEach(
          (field) => fieldKey(field) === key && writeField(field, value),
        );
    });
    // The header remounts on the new locale, so focus goes back to the button here.
    buttonRef.current?.focus({ preventScroll: true });
    return restoreScroll(saved.scrollY);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  const choose = (locale: Locale) => {
    close();
    if (locale === current) return;
    setLocaleCookie(locale);
    const path = swapLocale(pathname, locale);
    save({ path, scrollY: window.scrollY, fields: readFields() });
    router.push(`${path}${window.location.search}${window.location.hash}`, {
      scroll: false,
    });
  };

  return (
    <div
      ref={rootRef}
      className="relative shrink-0"
      onBlur={(event) => {
        // A null relatedTarget is a mouse press that does not focus (Safari, macOS
        // Firefox) or a window blur; the outside-click handler covers the mouse.
        const next = event.relatedTarget;
        if (next && !event.currentTarget.contains(next)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className="text-navy inline-flex h-11 min-w-11 items-center justify-center gap-1 rounded-full px-2 text-sm font-semibold transition-[background-color] duration-[250ms] ease-[var(--ease-brand)] hover:bg-[color-mix(in_srgb,var(--color-ice)_70%,transparent)] aria-expanded:bg-[color-mix(in_srgb,var(--color-ice)_70%,transparent)]"
        aria-controls={LIST_ID}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className="sr-only">{label}: </span>
        {shown.toUpperCase()}
        <CaretDownIcon aria-hidden="true" />
      </button>
      <ul
        id={LIST_ID}
        hidden={!open}
        className="border-border bg-paper absolute top-full right-0 z-[var(--z-index-mobile-menu)] mt-2 flex min-w-24 flex-col rounded-2xl border p-1 shadow-[0_24px_48px_-24px_rgb(11_23_48/0.35)]"
      >
        {LOCALES.map((locale) => (
          <li key={locale}>
            <button
              type="button"
              lang={htmlLang(locale)}
              aria-current={locale === current ? "true" : undefined}
              className="text-navy flex h-11 w-full items-center rounded-xl px-3 text-sm font-semibold whitespace-nowrap hover:bg-[color-mix(in_srgb,var(--color-ice)_70%,transparent)] aria-[current=true]:bg-[color-mix(in_srgb,var(--color-ice)_70%,transparent)]"
              onClick={() => choose(locale)}
            >
              {LANGUAGE_NAMES[locale]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
