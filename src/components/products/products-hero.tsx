import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { productsHero } from "@/content/products";

// Server Component. Reuses the Home hero's device frames (.home-devices and
// friends in globals.css) so the two pages stay identical until Story 4.4.
export function ProductsHero() {
  const { breadcrumbLabel, breadcrumbHome, breadcrumbCurrent } = productsHero;
  const { title, lede, cta, devices } = productsHero;

  return (
    <section className="hero-amber page-hero" aria-labelledby="products-h1">
      <div className="wrap split">
        <div>
          <nav className="crumbs" aria-label={breadcrumbLabel}>
            <Link href="/">{breadcrumbHome}</Link>
            <span>/</span>
            <span>{breadcrumbCurrent}</span>
          </nav>
          <h1 id="products-h1">
            {title.lead}
            <span className="hl">{title.highlight}</span>
            {title.tail}
          </h1>
          <p className="lede mt-4.5 mb-8">{lede}</p>
          <Link href={cta.href} className="btn btn-navy">
            {cta.label}
            <ArrowRightIcon aria-hidden="true" />
          </Link>
        </div>

        <div className="home-devices">
          <div className="home-device-tablet">
            <div className="home-media">
              <span>{devices.tablet}</span>
            </div>
          </div>
          <div className="home-device-phone">
            <span className="home-notch" aria-hidden="true" />
            <div className="home-media">
              <span>{devices.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
