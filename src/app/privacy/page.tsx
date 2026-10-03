import type { Metadata } from "next";
import Link from "next/link";
import { PRIVACY } from "@/content/privacy";

export const metadata: Metadata = {
  title: PRIVACY.metaTitle,
  description: PRIVACY.metaDescription,
};

// Plain reading page: no capture band (FR-33 exception). The aurora hero
// background and shared breadcrumbs come with Story 1.6, after demo.
export default function PrivacyPage() {
  return (
    <>
      <section
        className="hero-light page-hero pb-12"
        aria-labelledby="privacy-h1"
      >
        <div className="wrap mx-auto max-w-180">
          <nav className="crumbs" aria-label={PRIVACY.breadcrumbLabel}>
            <Link href="/">{PRIVACY.breadcrumbHome}</Link>
            <span>/</span>
            <span>{PRIVACY.breadcrumbCurrent}</span>
          </nav>
          <h1 id="privacy-h1">{PRIVACY.title}</h1>
          <p className="lede mt-5">{PRIVACY.lede}</p>
        </div>
      </section>

      <section
        className="surface-paper sec pt-10"
        aria-label={PRIVACY.bodyLabel}
      >
        <div className="wrap text-body-lg mx-auto max-w-180">
          <p className="sample text-body-sm text-muted italic">
            {PRIVACY.outlineNote}
          </p>
          {PRIVACY.sections.map((section) => (
            <div key={section.id} id={section.id}>
              <h2 className="font-display text-title-lg text-heading mt-10">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-4">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
