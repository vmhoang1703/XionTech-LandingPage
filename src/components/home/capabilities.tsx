import {
  ArrowRightIcon,
  BriefcaseIcon,
  ClockIcon,
  CpuIcon,
  GraduationCapIcon,
  HeartbeatIcon,
  TruckIcon,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";
import Link from "next/link";
import { LiveClock } from "@/components/sections/live-clock";
import { homeCapabilities } from "@/content/home";
import { hcmc, plano } from "@/content/offices";
import { MoreIndustries } from "./more-industries";

const BADGE_CLASS = {
  "P-Hub": "b-pxp",
  "S-Hub": "b-sxp",
  IoT: "b-iot",
} as const;

const INDUSTRY_ICON: Record<string, Icon> = {
  Healthcare: HeartbeatIcon,
  Logistics: TruckIcon,
  "Private Equity": BriefcaseIcon,
};

// Home Capabilities: four cards in a 7+5 / 7+5 grid, then the motto. Server
// Component; only the "+3" reveal and the live clocks are client parts.
export function Capabilities() {
  const { title, lede, products, delivery, industries, services, motto } =
    homeCapabilities;

  return (
    <section aria-labelledby="capabilities-title" className="sec">
      <div className="wrap">
        <div className="sec-head">
          <h2 id="capabilities-title">{title}</h2>
          <p className="lede">{lede}</p>
        </div>
        <div className="why2">
          <Link href={products.href} className="w-card w-products">
            <span className="w-label">{products.label}</span>
            <h3>{products.title}</h3>
            <p>{products.line}</p>
            <span className="w-apps">
              {products.apps.map((app) => (
                <span key={app.badge} className="w-app">
                  <span className={`badge ${BADGE_CLASS[app.badge]}`}>
                    {app.badge === "IoT" ? (
                      <>
                        <CpuIcon aria-hidden="true" />
                        <span className="sr-only">{app.badge}</span>
                      </>
                    ) : (
                      app.badge
                    )}
                  </span>
                  <small>{app.caption}</small>
                </span>
              ))}
            </span>
            <span className="w-link">
              {products.link}
              <ArrowRightIcon aria-hidden="true" />
            </span>
          </Link>

          <article className="w-card w-delivery">
            <span className="w-label">{delivery.label}</span>
            <h3>{delivery.title}</h3>
            <p>{delivery.line}</p>
            <span className="w-chips">
              <span className="w-chip">
                <ClockIcon aria-hidden="true" />
                Plano{" "}
                <b>
                  <LiveClock
                    timeZone={plano.timeZone}
                    zoneLabel={plano.zoneLabel}
                  />
                </b>
              </span>
              <span className="w-chip">
                <ClockIcon aria-hidden="true" />
                <abbr title="Ho Chi Minh City">HCMC</abbr>{" "}
                <b>
                  <LiveClock
                    timeZone={hcmc.timeZone}
                    zoneLabel={hcmc.zoneLabel}
                  />
                </b>
              </span>
            </span>
          </article>

          <article className="w-card w-industries">
            <span className="w-label">{industries.label}</span>
            <h3>{industries.title}</h3>
            <p>{industries.line}</p>
            <span className="w-industry-row">
              <span className="w-chip solid">
                <GraduationCapIcon aria-hidden="true" />
                {industries.main}
              </span>
              <MoreIndustries label={industries.moreLabel}>
                {industries.more.map((name) => {
                  const IndustryIcon = INDUSTRY_ICON[name];
                  return (
                    <span key={name} className="w-chip revealed">
                      <IndustryIcon aria-hidden="true" />
                      {name}
                    </span>
                  );
                })}
              </MoreIndustries>
            </span>
          </article>

          <Link href={services.href} className="w-card w-services">
            <span className="w-label">{services.label}</span>
            <h3>{services.title}</h3>
            <p>{services.line}</p>
            <span className="w-link">
              {services.link}
              <ArrowRightIcon aria-hidden="true" />
            </span>
          </Link>
        </div>
        <div className="w-motto">
          <p className="w-gid">{motto.lead}</p>
          <div className="w-own">
            <p className="w-own-title">{motto.title}</p>
            <p>{motto.line}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
