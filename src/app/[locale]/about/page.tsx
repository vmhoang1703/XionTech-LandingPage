import { ArrowRightIcon, MapPinIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { CaptureBand } from "@/components/contact/capture-band";
import { contactIcon } from "@/components/sections/contact-icon";
import { FaqList } from "@/components/sections/faq-list";
import { LiveClock } from "@/components/sections/live-clock";
import { PageScene } from "@/components/sections/page-scene";
import {
  aboutCapture,
  aboutFaq,
  aboutHero,
  aboutMeta,
  aboutOffices,
  aboutStory,
} from "@/content/about";

export const metadata: Metadata = {
  title: aboutMeta.title,
  description: aboutMeta.description,
};

// E-S3 (prototype about.html): the intro over pastel peaks, the mountain story
// (static, no picture), the FAQ at #faq, the offices and the demo capture, on
// the shared page scene below the hero (lead, 2026-10-12). Only the clocks,
// the capture form and the scene are client parts.
export default function AboutPage() {
  const { title, text, links } = aboutHero;
  const { title: story, chapters, closing } = aboutStory;

  return (
    <>
      <section id="mission" className="about-hero" aria-labelledby="about-h1">
        <svg
          className="ah-peaks"
          viewBox="0 0 1440 360"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="about-peaks-a" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FCE7B0" />
              <stop offset="1" stopColor="#FFF8E6" />
            </linearGradient>
            <linearGradient id="about-peaks-b" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F8D98A" />
              <stop offset="1" stopColor="#FDF1D2" />
            </linearGradient>
          </defs>
          <path
            fill="url(#about-peaks-a)"
            d="M0 360V214C30 190 66 160 84 154S132 172 146 168 226 84 240 76 270 78 284 92 318 132 330 134 392 108 408 108 444 140 470 160 532 196 560 360Z"
          />
          <path
            fill="url(#about-peaks-a)"
            d="M880 360C910 300 938 246 958 236S1022 262 1040 256 1130 132 1146 124 1176 130 1194 146 1210 168 1226 162 1282 96 1300 92 1334 116 1364 136 1414 128 1440 128V360Z"
          />
          <path
            fill="url(#about-peaks-b)"
            opacity=".7"
            d="M0 360V272C40 248 92 218 118 212S192 246 210 244 282 196 300 192 336 214 358 238 418 284 460 360Z"
          />
          <path
            fill="url(#about-peaks-b)"
            opacity=".7"
            d="M1000 360C1036 318 1078 270 1100 262S1160 286 1180 286 1266 210 1288 204 1360 230 1440 258V360Z"
          />
          <path className="ah-ground" d="M0 360 C360 300 1080 300 1440 360 Z" />
        </svg>
        <div className="wrap ah-inner">
          <h1 id="about-h1">
            {title.lead}
            <br />
            {title.middle}
            <span className="ah-accent">{title.accent}</span>
            {title.tail}
          </h1>
          <p className="ah-text">{text}</p>
          <div className="ah-links">
            {links.map(({ href, label }) => (
              <Link key={href} className="link-arrow" href={href}>
                {label}
                <ArrowRightIcon aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <PageScene>
        <section
          id="story"
          className="sec surface-paper"
          aria-labelledby="about-story-h"
        >
          <div className="wrap">
            <h2 id="about-story-h" className="mtn-h">
              {story.lead}
              <br />
              {story.middle}
              <span className="hl">{story.highlight}</span>
              {story.tail}
            </h2>
            <div className="mtn-story" data-reveal="">
              {chapters.map(({ number, title: name, text: body }) => (
                <article key={number}>
                  <h3 className="mtn-title">
                    <span className="mtn-num">{number}</span> {name}
                  </h3>
                  <p className="mtn-text">{body}</p>
                </article>
              ))}
              <div className="mtn-close">
                <p>
                  <strong>{closing.line}</strong>
                </p>
                <p>{closing.tags}</p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="faq"
          className="sec surface-paper"
          aria-labelledby="about-faq-h"
        >
          <div className="wrap faq-head" data-reveal="">
            <h2 id="about-faq-h">{aboutFaq.title}</h2>
            <p className="lede">{aboutFaq.lede}</p>
          </div>
          <div className="wrap">
            <FaqList items={aboutFaq.items} link={aboutFaq.ask} />
          </div>
        </section>
        <section
          id="offices"
          className="sec surface-paper"
          aria-labelledby="about-offices-h"
        >
          <div className="wrap">
            <div className="sec-head">
              <h2 id="about-offices-h">{aboutOffices.title}</h2>
              <p>{aboutOffices.more}</p>
            </div>
            <div className="offices" data-reveal="">
              {aboutOffices.offices.map((office) => (
                <div key={office.id} className="spot office-card">
                  <span className="clock">
                    <LiveClock
                      timeZone={office.timeZone}
                      zoneLabel={office.zoneLabel}
                    />
                  </span>
                  <h3>{office.name}</h3>
                  {office.tag ? (
                    <small className="office-tag">{office.tag}</small>
                  ) : null}
                  <address>
                    <span className="orow">
                      <MapPinIcon aria-hidden="true" />
                      <span>
                        {office.addressLines.map((line, index) => (
                          <Fragment key={line}>
                            {index > 0 ? <br /> : null}
                            {line}
                          </Fragment>
                        ))}
                      </span>
                    </span>
                    {office.contacts.map((contact) => {
                      const ContactIcon = contactIcon(contact.href);
                      return (
                        <span key={contact.href} className="orow">
                          <ContactIcon aria-hidden="true" />
                          <span>
                            <a
                              href={contact.href}
                              aria-label={contact.ariaLabel}
                              {...(contact.external
                                ? {
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                  }
                                : {})}
                            >
                              {contact.label}
                            </a>
                          </span>
                        </span>
                      );
                    })}
                  </address>
                </div>
              ))}
            </div>
          </div>
        </section>
        <CaptureBand id="book" kind="demo" look="white" copy={aboutCapture} />
      </PageScene>
    </>
  );
}
