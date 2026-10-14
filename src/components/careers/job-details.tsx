import { ArrowLeftIcon, CheckCircleIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import type { ReactNode } from "react";
import { jobDetails } from "@/content/job";
import { ApplyBar } from "./apply-bar";
import type { OpenRoleDetail } from "@/lib/careers/open-roles";

function CheckList({ items }: Readonly<{ items: readonly string[] }>) {
  return (
    <ul className="list-check">
      {items.map((item) => (
        <li key={item}>
          <CheckCircleIcon weight="fill" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// Server Component. Role text left, the application form (children) right (CAP-1).
// A section with no content is left out, heading included.
export function JobDetails({
  role,
  children,
}: Readonly<{ role: OpenRoleDetail; children: ReactNode }>) {
  const paragraphs = (role.about ?? "")
    .split("\n\n")
    .map((text) => text.trim())
    .filter(Boolean);
  const responsibilities = role.responsibilities ?? [];
  const requirements = role.requirements ?? [];

  return (
    <section className="sec surface-paper" aria-label={jobDetails.sectionLabel}>
      <div className="wrap split items-start">
        <article className="job-body">
          {paragraphs.length > 0 && (
            <>
              <h2>{jobDetails.aboutHeading}</h2>
              {paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </>
          )}
          {responsibilities.length > 0 && (
            <>
              <h2>{jobDetails.doHeading}</h2>
              <CheckList items={responsibilities} />
            </>
          )}
          {requirements.length > 0 && (
            <>
              <h2>{jobDetails.bringHeading}</h2>
              <CheckList items={requirements} />
            </>
          )}
          <p className="mt-7">
            <Link className="link-arrow" href={jobDetails.backHref}>
              <ArrowLeftIcon aria-hidden="true" />
              <span>{jobDetails.backLabel}</span>
            </Link>
          </p>
        </article>
        <div id="apply" className="form-card">
          {children}
        </div>
        <ApplyBar target="apply" />
      </div>
    </section>
  );
}
