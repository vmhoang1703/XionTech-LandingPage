"use client";

import { ArrowsOutSimpleIcon, XIcon } from "@phosphor-icons/react";
import {
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import { PLACEHOLDER_HREF } from "@/content/product-links";
import { productsShowcase, type Audience } from "@/content/products";
import { useHydrated } from "./use-hydrated";

// While an address is the stand-in (decision A6) the control is a disabled
// label, so a click goes nowhere; a real address becomes a link that opens a
// new tab and says so.
export function ProductLink({
  href,
  className,
  children,
}: Readonly<{ href: string; className: string; children: ReactNode }>) {
  if (href === PLACEHOLDER_HREF) {
    return (
      <span className={className} aria-disabled="true">
        {children}
      </span>
    );
  }
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children} <span className="sr-only">{productsShowcase.newTab}</span>
    </a>
  );
}

// A click whose target is the dialog itself and whose point lies outside its
// box landed on the backdrop. Clicks inside the box (padding too) and keyboard
// clicks on controls never close it.
function onBackdropClick(event: MouseEvent<HTMLDialogElement>) {
  const dialog = event.currentTarget;
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  const inside =
    event.clientX >= box.left &&
    event.clientX <= box.right &&
    event.clientY >= box.top &&
    event.clientY <= box.bottom;
  if (!inside) dialog.close();
}

const FOCUSABLE =
  'a[href], button:not([disabled]):not([hidden]), [tabindex]:not([tabindex="-1"])';

// A modal dialog makes the page inert, but Tab from its last control still
// leaves for the browser's own toolbar. Wrap at both edges instead, so focus
// stays on the dialog's controls (CAP-3).
function keepTabInside(event: KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== "Tab") return;
  const items = [
    ...event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE),
  ];
  const first = items[0];
  const last = items.at(-1);
  const edge = event.shiftKey ? first : last;
  if (!edge?.isSameNode(document.activeElement)) return;
  event.preventDefault();
  (event.shiftKey ? last : first)?.focus();
}

// Client island (E-A5 CAP-3): the card's expand button and its native modal
// dialog. The dialog body is rendered on the server and passed in as children.
// showModal() closes on Esc and keepTabInside wraps Tab; on close, focus goes back to
// the expand button, which shows only once JavaScript runs.
export function ProductDetail({
  dialogId,
  name,
  audience,
  badge,
  children,
}: Readonly<{
  dialogId: string;
  name: string;
  audience: Audience;
  badge: ReactNode;
  children: ReactNode;
}>) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = `${dialogId}-h`;
  const hydrated = useHydrated();

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="pc-expand"
        hidden={!hydrated}
        aria-haspopup="dialog"
        aria-label={productsShowcase.openLabel(name)}
        onClick={() => dialogRef.current?.showModal()}
      >
        <ArrowsOutSimpleIcon aria-hidden="true" />
      </button>
      {/* Esc is native; these add the backdrop click and the Tab wrap. */}
      <dialog
        ref={dialogRef}
        id={dialogId}
        className="pdetail"
        data-aud={audience}
        aria-labelledby={headingId}
        onClick={onBackdropClick}
        onKeyDown={keepTabInside}
        onClose={() => buttonRef.current?.focus()}
      >
        <div className="pd-inner">
          <header className="pd-top">
            <div className="pc-kick">
              {badge}
              <h2 className="pd-name" id={headingId}>
                {name}
              </h2>
            </div>
            <button
              type="button"
              className="pd-close"
              aria-label={productsShowcase.closeLabel(name)}
              onClick={() => dialogRef.current?.close()}
            >
              <XIcon aria-hidden="true" />
            </button>
          </header>
          {children}
        </div>
      </dialog>
    </>
  );
}
