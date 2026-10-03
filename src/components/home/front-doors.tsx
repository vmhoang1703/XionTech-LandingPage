import { ArrowRightIcon, CpuIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { homeDoors } from "@/content/home";

const BADGE_CLASS = {
  PXP: "b-pxp",
  LXP: "b-lxp",
  SXP: "b-sxp",
  IoT: "b-iot",
} as const;

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

// Two doors directly under the Home hero, overlapping its bottom. Each door is
// one link; badges and chips are plain text, so Tab stops once per door.
export function FrontDoors() {
  const { label, products, services } = homeDoors;

  return (
    <section aria-label={label} className="doors">
      <div className="wrap doors-grid">
        <Link href={products.href} className="door door-products">
          <div className="top">
            <div className="chips">
              {products.badges.map((badge) => (
                <span key={badge} className={`badge ${BADGE_CLASS[badge]}`}>
                  {badge === "IoT" ? (
                    <>
                      <CpuIcon aria-hidden="true" />
                      <span className="sr-only">{badge}</span>
                    </>
                  ) : (
                    badge
                  )}
                </span>
              ))}
            </div>
            <Go />
          </div>
          <h2>{products.title}</h2>
          <p>{products.line}</p>
          <Chips items={products.chips} />
        </Link>

        <Link href={services.href} className="door door-services surface-navy">
          <div className="top">
            <span className="label">{services.label}</span>
            <Go />
          </div>
          <h2>{services.title}</h2>
          <p>{services.line}</p>
          <Chips items={services.chips} />
        </Link>
      </div>
    </section>
  );
}
