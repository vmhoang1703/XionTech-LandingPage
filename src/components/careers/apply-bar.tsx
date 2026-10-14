"use client";

import { ArrowDownIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { jobForm } from "@/content/job";

// Phones and tablets (lead, 2026-10-13): the form sits under the role text,
// about 1,650px down on a phone, so a bar at the foot of the screen offers it
// while the form is still below the screen. From 900px the form is beside the
// text and the bar is not shown (globals.css, "Apply bar"). Hidden, it is
// inert: no tab stop and nothing read out.
export function ApplyBar({ target }: Readonly<{ target: string }>) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const form = document.getElementById(target);
    if (!form) return;
    const observer = new IntersectionObserver(([entry]) =>
      setShown(!entry.isIntersecting && entry.boundingClientRect.top > 0),
    );
    observer.observe(form);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div className="apply-bar" data-shown={shown || undefined} inert={!shown}>
      <a className="btn btn-primary" href={`#${target}`}>
        {jobForm.heading}
        <ArrowDownIcon aria-hidden="true" />
      </a>
    </div>
  );
}
