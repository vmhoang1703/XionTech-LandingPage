import {
  BriefcaseIcon,
  GraduationCapIcon,
  HeartbeatIcon,
  TruckIcon,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";
import { DaylightIcon } from "@/components/sections/daylight-icon";
import { LiveClock } from "@/components/sections/live-clock";
import { homeCapabilities, homeCapabilitiesVi } from "@/content/home";
import { pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import { hcmc, hcmcVi, plano, planoVi } from "@/content/offices";
import { MoreIndustries } from "./more-industries";

const INDUSTRY_ICON: Record<
  (typeof homeCapabilities.industries.more)[number],
  Icon
> = {
  Healthcare: HeartbeatIcon,
  Logistics: TruckIcon,
  "Private Equity": BriefcaseIcon,
};

// Home "Why XionTech.": Global delivery and Domain expertise in a 5+7 row,
// then the motto. Server Component; only the "+3" reveal, the live clocks and
// their sun or moon are client parts.
export function Capabilities({ locale = "en" }: Readonly<{ locale?: Locale }>) {
  const { title, lede, delivery, industries, motto } = pickLocale(locale, {
    en: homeCapabilities,
    vi: homeCapabilitiesVi,
  });
  const [usOffice, vnOffice] = pickLocale(locale, {
    en: [plano, hcmc],
    vi: [planoVi, hcmcVi],
  });

  return (
    <section aria-labelledby="capabilities-title" className="sec">
      <div className="wrap">
        <div className="sec-head" data-reveal="">
          <h2 id="capabilities-title">{title}</h2>
          <p className="lede">{lede}</p>
        </div>
        <div className="why2" data-reveal="">
          <article className="w-card w-delivery">
            <span className="w-label">{delivery.label}</span>
            <h3>{delivery.title}</h3>
            <p>{delivery.line}</p>
            <span className="w-chips">
              <span className="w-chip">
                <DaylightIcon timeZone={usOffice.timeZone} />
                Plano{" "}
                <b>
                  <LiveClock
                    timeZone={usOffice.timeZone}
                    zoneLabel={usOffice.zoneLabel}
                  />
                </b>
              </span>
              <span className="w-chip">
                <DaylightIcon timeZone={vnOffice.timeZone} />
                <abbr title={vnOffice.name.split(",")[0]}>HCMC</abbr>{" "}
                <b>
                  <LiveClock
                    timeZone={vnOffice.timeZone}
                    zoneLabel={vnOffice.zoneLabel}
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
                {industries.more.map((name, index) => {
                  // Icons are keyed by the English name.
                  const IndustryIcon =
                    INDUSTRY_ICON[homeCapabilities.industries.more[index]];
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
        </div>
        <div className="w-motto" data-reveal="">
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
