import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { LocaleLink } from "@/components/layout/locale-link";
import { homeDoors, homeDoorsVi } from "@/content/home";
import { pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import { HomeAppBadge } from "./home-app-badge";

function Go() {
  return (
    <span className="go">
      <ArrowRightIcon aria-hidden="true" />
    </span>
  );
}

// Two doors inside the Home hero, straddling its lower edge. Each door is
// one link; badges and chips are plain text, so Tab stops once per door. Both
// show the pointer glow (data-glow) on a mouse or pen.
export function FrontDoors({ locale = "en" }: Readonly<{ locale?: Locale }>) {
  const { label, products, services } = pickLocale(locale, {
    en: homeDoors,
    vi: homeDoorsVi,
  });

  return (
    <section aria-label={label} className="doors">
      <div className="wrap doors-grid" data-reveal="">
        <LocaleLink
          href={products.href}
          className="door door-products"
          data-glow=""
        >
          <div className="top">
            <span className="label">{products.label}</span>
            <Go />
          </div>
          <h2>{products.title}</h2>
          <p>{products.line}</p>
          <div className="door-minis">
            {products.badges.map((app) => (
              <span key={app.id} className="door-mini">
                <HomeAppBadge app={app} />
                <b>{app.shortName}</b>
              </span>
            ))}
          </div>
        </LocaleLink>

        <LocaleLink
          href={services.href}
          className="door door-services surface-navy"
          data-glow=""
        >
          <div className="top">
            <span className="label">{services.label}</span>
            <Go />
          </div>
          <h2>{services.title}</h2>
          <p>{services.line}</p>
        </LocaleLink>
      </div>
    </section>
  );
}
