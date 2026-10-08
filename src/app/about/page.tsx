import { CheckCircleIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { CaptureBand } from "@/components/contact/capture-band";
import { HeroArt } from "@/components/sections/hero-art";
import { LiveClock } from "@/components/sections/live-clock";
import { StatsBand } from "@/components/sections/stats-band";
import {
  aboutCapture,
  aboutFaq,
  aboutHero,
  aboutMeta,
  aboutOffices,
  aboutStats,
  aboutStory,
} from "@/content/about";
import { aboutValues } from "@/content/values";

export const metadata: Metadata = {
  title: aboutMeta.title,
  description: aboutMeta.description,
};

// Story 6.4: hero, stats, story, values (#values), FAQ (#faq), offices and
// the demo capture. Only the clocks and the capture form are client parts.
export default function AboutPage() {
  const { title } = aboutHero;

  return (
    <>
      <section className="hero-navy page-hero" aria-labelledby="about-h1">
        <HeroArt tone="navy" />
        <div className="wrap">
          <nav className="crumbs" aria-label={aboutHero.breadcrumbLabel}>
            <Link href="/">{aboutHero.breadcrumbHome}</Link>
            <span>/</span>
            <span>{aboutHero.breadcrumbCurrent}</span>
          </nav>
          <h1 id="about-h1">
            {title.lead}
            <span className="hl">{title.highlight}</span>
            {title.tail}
          </h1>
          <p className="lede mt-5">{aboutHero.lede}</p>
        </div>
      </section>
      <section className="sec surface-paper">
        <div className="wrap">
          <StatsBand
            label={aboutStats.label}
            stats={aboutStats.stats}
            tone="light"
            hideLabel
          />
        </div>
      </section>
      <section
        className="sec surface-mist linen"
        aria-labelledby="about-story-h"
      >
        <div className="wrap split">
          <div className="illo" style={{ minHeight: 420 }}>
            <b>{aboutStory.photoLabel}</b>
            <span>{aboutStory.photoHint}</span>
          </div>
          <div>
            <h2 id="about-story-h">{aboutStory.title}</h2>
            <p className="lede mt-4">{aboutStory.lede}</p>
            <ul className="list-check mt-6">
              {aboutStory.checks.map((check) => (
                <li key={check}>
                  <CheckCircleIcon weight="fill" aria-hidden="true" />
                  <span>{check}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section
        id="values"
        className="sec surface-paper"
        aria-labelledby="about-values-h"
      >
        <div className="wrap">
          <div className="sec-head">
            <span className="label">{aboutValues.label}</span>
            <h2 id="about-values-h">{aboutValues.title}</h2>
          </div>
          <div className="values">
            {aboutValues.items.map(
              ({ icon: ValueIcon, title: name, text, featured }) => (
                <div key={name} className={featured ? "value feat" : "value"}>
                  <ValueIcon aria-hidden="true" />
                  <h3>{name}</h3>
                  <p>{text}</p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
      <section
        id="faq"
        className="sec surface-paper"
        aria-labelledby="about-faq-h"
      >
        <div className="wrap">
          <div className="sec-head">
            <h2 id="about-faq-h">{aboutFaq.title}</h2>
            <p className="lede">{aboutFaq.lede}</p>
          </div>
          <div className="faq">
            {aboutFaq.items.map(({ question, answer }) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section
        className="sec surface-navy gridbg"
        aria-labelledby="about-offices-h"
      >
        <div className="wrap">
          <div className="sec-head">
            <h2 id="about-offices-h">{aboutOffices.title}</h2>
          </div>
          <div className="offices">
            {aboutOffices.offices.map((office) => (
              <div key={office.id} className="spot office-card">
                <b className="clock">
                  <LiveClock
                    timeZone={office.timeZone}
                    zoneLabel={office.zoneLabel}
                  />
                </b>
                <h3>{office.name}</h3>
                {office.tag ? (
                  <small className="office-tag">{office.tag}</small>
                ) : null}
                <address>
                  {office.addressLines.map((line, index) => (
                    <Fragment key={line}>
                      {index > 0 ? <br /> : null}
                      {line}
                    </Fragment>
                  ))}
                </address>
                {office.contacts.map((contact) => (
                  <p key={contact.href}>
                    <a
                      className="link-arrow"
                      href={contact.href}
                      aria-label={contact.ariaLabel}
                      {...(contact.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {contact.label}
                    </a>
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      <CaptureBand kind="demo" copy={aboutCapture} />
    </>
  );
}
