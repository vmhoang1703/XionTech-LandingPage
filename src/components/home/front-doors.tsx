import Link from "next/link";
import { homeDoors } from "@/content/home";

const BADGE_CLASS = {
  PXP: "product-badge-pxp",
  LXP: "product-badge-lxp",
  SXP: "product-badge-sxp",
  IoT: "product-badge-iot",
} as const;

const doorClass =
  "relative flex min-h-75 flex-col gap-3.5 overflow-hidden rounded-xl p-8.5 transition-transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-5 fill-current">
      <path d="M9.3 3.3 8.2 4.4l2.8 2.8H2v1.6h9l-2.8 2.8 1.1 1.1L14 8z" />
    </svg>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="mt-auto flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="industry-chip">
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
    <section aria-label={label} className="relative z-10 -mt-20 md:-mt-26">
      <div className="max-w-page px-gutter-mobile sm:px-gutter mx-auto grid grid-cols-1 gap-4.5 md:grid-cols-2">
        <Link
          href={products.href}
          className={`front-door-products ${doorClass}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-wrap gap-2">
              {products.badges.map((badge) => (
                <span key={badge} className={BADGE_CLASS[badge]}>
                  {badge}
                </span>
              ))}
            </div>
            <Arrow />
          </div>
          <h2>{products.title}</h2>
          <p className="text-muted">{products.line}</p>
          <Chips items={products.chips} />
        </Link>

        <Link
          href={services.href}
          className={`front-door-services surface-navy ${doorClass}`}
        >
          <div className="flex items-start justify-between">
            <span className="font-brand text-label uppercase">
              {services.label}
            </span>
            <Arrow />
          </div>
          <h2>{services.title}</h2>
          <p>{services.line}</p>
          <Chips items={services.chips} />
        </Link>
      </div>
    </section>
  );
}
