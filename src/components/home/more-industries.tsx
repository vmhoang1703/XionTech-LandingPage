"use client";

import { useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

type MoreIndustriesProps = {
  label: string;
  children: ReactNode;
};

const noSubscribe = () => () => {};

// The "+3" reveal. The server HTML shows the industries, so they are readable
// without JavaScript (the button's name lists them too). Once hydrated, the
// list is hidden until a mouse hovers or a click, tap or key opens it.
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

  return (
    <span
      className={shown ? "w-more open" : "w-more"}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        className="w-more-trigger"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((current) => !current)}
      >
        +3
      </button>
      <span className="w-more-list" aria-hidden="true" hidden={!shown}>
        {children}
      </span>
    </span>
  );
}
