"use client";

import { ArrowsOutSimpleIcon, XIcon } from "@phosphor-icons/react";
import { useRef, type MouseEvent, type ReactNode } from "react";
import { PLACEHOLDER_HREF } from "@/content/product-links";
import { productsShowcase, type Audience } from "@/content/products";

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

// Client island (E-A5 CAP-3): the card's expand button and its native modal
// dialog. The dialog body is rendered on the server and passed in as children.
// showModal() keeps Tab inside and closes on Esc; on close, focus goes back to
// the expand button.
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

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="pc-expand"
        aria-haspopup="dialog"
        aria-label={productsShowcase.openLabel(name)}
        onClick={() => dialogRef.current?.showModal()}
      >
        <ArrowsOutSimpleIcon aria-hidden="true" />
      </button>
      {/* Esc is handled by the native dialog; this only adds the backdrop click. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        ref={dialogRef}
        id={dialogId}
        className="pdetail"
        data-aud={audience}
        aria-labelledby={headingId}
        onClick={onBackdropClick}
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
