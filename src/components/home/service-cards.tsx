import Link from "next/link";
import { homeServices } from "@/content/home";
import { serviceIcons } from "@/content/service-icons";

// Eight service cards, each one link to its /services anchor (FR-14).
// 4 columns from 1080px, 2 from 640px, 1 below.
export function ServiceCards() {
  const { title, lede, cards } = homeServices;

  return (
    <section aria-labelledby="services-title" className="sec surface-paper">
      <div className="wrap">
        <div className="sec-head">
          <h2 id="services-title">{title}</h2>
          <p className="lede">{lede}</p>
        </div>
        <div className="svc-grid">
          {cards.map((card) => {
            const { icon: CardIcon, variant } = serviceIcons[card.id];
            return (
              <Link
                key={card.id}
                href={`/services#${card.id}`}
                className={["spot", "svc", variant].filter(Boolean).join(" ")}
              >
                <span className="ic">
                  <CardIcon aria-hidden="true" />
                </span>
                <h3>{card.name}</h3>
                <p>{card.line}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
