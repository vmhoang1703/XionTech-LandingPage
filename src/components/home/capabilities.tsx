import {
  BriefcaseIcon,
  GraduationCapIcon,
  HeartbeatIcon,
  TruckIcon,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";
import { DaylightIcon } from "@/components/sections/daylight-icon";
import { LiveClock } from "@/components/sections/live-clock";
import { homeCapabilities } from "@/content/home";
import { hcmc, plano } from "@/content/offices";
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
export function Capabilities() {
  const { title, lede, delivery, industries, motto } = homeCapabilities;

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
                <DaylightIcon timeZone={plano.timeZone} />
                Plano{" "}
                <b>
                  <LiveClock
                    timeZone={plano.timeZone}
                    zoneLabel={plano.zoneLabel}
                  />
                </b>
              </span>
              <span className="w-chip">
                <DaylightIcon timeZone={hcmc.timeZone} />
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
