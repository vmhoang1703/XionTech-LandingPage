import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { LocaleLink } from "@/components/layout/locale-link";
import { homeDoors } from "@/content/home";
import { HomeAppBadge } from "./home-app-badge";

function Go() {
  return (
    <span className="go">
      <ArrowRightIcon aria-hidden="true" />
    </span>
  );
}

function Chips({ items }: Readonly<{ items: string[] }>) {
  return (
    <div className="chips">
      {items.map((item) => (
        <span key={item} className="chip">
          {item}
        </span>
      ))}
    </div>
  );
}

// Two doors inside the Home hero, straddling its lower edge. Each door is
// one link; badges and chips are plain text, so Tab stops once per door. Both
// show the pointer glow (data-glow) on a mouse or pen.
export function FrontDoors() {
  const { label, products, services } = homeDoors;

  return (
    <section aria-label={label} className="doors">
      <div className="wrap doors-grid">
        <LocaleLink
          href={products.href}
          className="door door-products"
          data-glow=""
        >
          <div className="top">
            <div className="chips">
              {products.badges.map((app) => (
                <HomeAppBadge key={app.id} app={app} />
              ))}
            </div>
            <Go />
          </div>
          <h2>{products.title}</h2>
          <p>{products.line}</p>
          <Chips items={products.chips} />
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
          <Chips items={services.chips} />
        </LocaleLink>
      </div>
    </section>
  );
}
