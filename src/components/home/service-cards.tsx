import Link from "next/link";
import { homeServices } from "@/content/home";

// Eight service cards, each one link to its /services anchor (FR-14).
// 4 columns from 1080px, 2 from 640px, 1 below.
export function ServiceCards() {
  const { title, lede, cards } = homeServices;

  return (
    <section
      aria-labelledby="services-title"
      className="surface-paper py-section"
    >
      <div className="max-w-page px-gutter-mobile sm:px-gutter mx-auto">
        <div className="mb-section-head-gap">
          <h2 id="services-title">{title}</h2>
          <p className="text-body-lg mt-4">{lede}</p>
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.id}
              href={`/services#${card.id}`}
              className="service-card spotlight-card flex flex-col gap-2"
            >
              <h3>{card.name}</h3>
              <p className="text-body-sm text-muted">{card.line}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
