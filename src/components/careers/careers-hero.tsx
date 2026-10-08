import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { careersHero } from "@/content/careers";
import { GrowthRing } from "./growth-ring";

// Server Component. Light hero beside the Growth Learning Model; no
// breadcrumb (E-A7 CAP-1, prototype careers.html).
export function CareersHero() {
  const { title, lede, cta } = careersHero;

  return (
    <section
      className="hero-light page-hero careers-hero"
      aria-labelledby="careers-h1"
    >
      <div aria-hidden="true" className="aurora" />
      <div className="wrap ch-grid">
        <div>
          <h1 id="careers-h1">
            {title.first}
            <br />
            {title.second}
          </h1>
          <p className="lede mt-4.5 mb-8">{lede}</p>
          <a className="btn btn-primary" href={cta.href}>
            {cta.label}
            <ArrowRightIcon aria-hidden="true" />
          </a>
        </div>
        <GrowthRing />
      </div>
    </section>
  );
}
