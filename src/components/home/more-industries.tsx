"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type MoreIndustriesProps = {
  label: string;
  children: ReactNode;
};

// The "+3" reveal. The industries are in the server HTML, so they are
// readable without JavaScript (the button's name lists them too); CSS opens
// them on hover or focus, and this state opens them on click, tap or key.
export function MoreIndustries({
  label,
  children,
}: Readonly<MoreIndustriesProps>) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className={open ? "w-more open" : "w-more"}
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
      <span className="w-more-list" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}
