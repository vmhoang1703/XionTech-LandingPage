"use client";

import {
  CheckIcon,
  FacebookLogoIcon,
  LinkIcon,
  LinkedinLogoIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

export type ShareLabels = Readonly<{
  heading: string;
  linkedin: string;
  facebook: string;
  newTab: string;
  copy: string;
  copied: string;
  copyFailed: string;
}>;

const COPIED_MS = 4000;

export function shareLinks(url: string) {
  const encoded = encodeURIComponent(url);
  return {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
  };
}

// Share a story (audit 2026-10-16, #9): LinkedIn and Facebook open their own
// share page in a new tab with the story's canonical URL; Copy link puts the
// URL on the clipboard and a polite live region says so (or that it failed).
export function StoryShare({
  url,
  labels,
}: Readonly<{ url: string; labels: ShareLabels }>) {
  const [status, setStatus] = useState<"" | "copied" | "failed">("");
  const timer = useRef<number>(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const links = shareLinks(url);

  const copy = async () => {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    timer.current = window.setTimeout(() => setStatus(""), COPIED_MS);
  };

  let message = "";
  if (status === "copied") message = labels.copied;
  else if (status === "failed") message = labels.copyFailed;

  return (
    <div className="art-share" role="group" aria-labelledby="art-share-h">
      <h2 id="art-share-h" className="art-share-h">
        {labels.heading}
      </h2>
      <div className="art-share-row">
        <a
          className="art-share-btn"
          href={links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${labels.linkedin} ${labels.newTab}`}
        >
          <LinkedinLogoIcon aria-hidden="true" weight="fill" />
          <span>LinkedIn</span>
        </a>
        <a
          className="art-share-btn"
          href={links.facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${labels.facebook} ${labels.newTab}`}
        >
          <FacebookLogoIcon aria-hidden="true" weight="fill" />
          <span>Facebook</span>
        </a>
        <button type="button" className="art-share-btn" onClick={copy}>
          {status === "copied" ? (
            <CheckIcon aria-hidden="true" weight="bold" />
          ) : (
            <LinkIcon aria-hidden="true" weight="bold" />
          )}
          <span>{labels.copy}</span>
        </button>
      </div>
      <p className="art-share-status" aria-live="polite">
        {message}
      </p>
    </div>
  );
}
