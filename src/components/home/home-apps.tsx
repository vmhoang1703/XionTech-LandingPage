import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { LocaleLink } from "@/components/layout/locale-link";
import { homeApps } from "@/content/home";
import { HomeAppBadge } from "./home-app-badge";

// Home "One connected school.": each app is one link to its section on
// Products, with who it is for and two of its features. The cards share the
// doors' lift, press and pointer glow; a thin line joins them on wide screens.
export function HomeApps() {
  const { title, lede, apps, link } = homeApps;

  return (
    <section aria-labelledby="home-apps-h" className="sec">
      <div className="wrap">
        <div className="sec-head-row" data-reveal="">
          <div className="sec-head">
            <h2 id="home-apps-h">{title}</h2>
            <p className="lede">{lede}</p>
          </div>
          <LocaleLink href={link.href} className="link-arrow">
            <span>{link.label}</span>
            <ArrowRightIcon aria-hidden="true" />
          </LocaleLink>
        </div>
        <ul className="app-cards" data-reveal="">
          {apps.map(({ app, href, madeFor, features }) => (
            <li key={app.id}>
              <LocaleLink href={href} className="app-card" data-glow="">
                <span className="app-card-top">
                  <HomeAppBadge app={app} />
                  <span className="go">
                    <ArrowRightIcon aria-hidden="true" />
                  </span>
                </span>
                <h3>{app.fullName}</h3>
                <span className="app-for">{madeFor}</span>
                <ul className="app-feats">
                  {features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </LocaleLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
