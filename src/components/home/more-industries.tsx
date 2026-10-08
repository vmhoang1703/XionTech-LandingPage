"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

type MoreIndustriesProps = {
  label: string;
  children: ReactNode;
};

const noSubscribe = () => () => {};

// The "+3" reveal. The server HTML shows the industries, so they are readable
// without JavaScript (the button's name lists them too). Once hydrated, the
// list is hidden until a mouse hovers or a click, tap or key opens it;
// Escape or focus leaving closes it.
export function MoreIndustries({
  label,
  children,
}: Readonly<MoreIndustriesProps>) {
  const hydrated = useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  );
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const shown = !hydrated || open || hovered;
  const rootRef = useRef<HTMLSpanElement>(null);

  // Native listeners on the wrapper: hover, Escape and focus leaving belong
  // to the whole reveal, while the button stays the only interactive part.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const close = () => {
      setOpen(false);
      setHovered(false);
    };
    const enter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") setHovered(true);
    };
    const leave = () => setHovered(false);
    const focusOut = (event: FocusEvent) => {
      if (!root.contains(event.relatedTarget as Node | null)) close();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    root.addEventListener("pointerenter", enter);
    root.addEventListener("pointerleave", leave);
    root.addEventListener("focusout", focusOut);
    root.addEventListener("keydown", key);
    return () => {
      root.removeEventListener("pointerenter", enter);
      root.removeEventListener("pointerleave", leave);
      root.removeEventListener("focusout", focusOut);
      root.removeEventListener("keydown", key);
    };
  }, []);

  return (
    <span ref={rootRef} className={shown ? "w-more open" : "w-more"}>
      <button
        type="button"
        className="w-more-trigger"
        aria-expanded={open}
        aria-label={label}
        onClick={() => {
          // A click decides alone; the next pointer enter may re-arm hover.
          setHovered(false);
          setOpen((current) => !current);
        }}
      >
        +3
      </button>
      <span className="w-more-list" aria-hidden="true" hidden={!shown}>
        {children}
      </span>
    </span>
  );
}
