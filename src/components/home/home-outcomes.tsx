import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { homeOutcomes } from "@/content/home";

// Home "What can we help you achieve?": the four Services outcomes beside a
// sticky heading with the two next steps (the Services split layout). The
// outcomes are not links; the two calls to action are.
export function HomeOutcomes() {
  const { title, lede, items, cta, link } = homeOutcomes;

  return (
    <section aria-labelledby="home-outcomes-h" className="sec">
      <div className="wrap svc-split">
        <div className="sec-head svc-stick">
          <h2 id="home-outcomes-h">{title}</h2>
          <p className="lede">{lede}</p>
          <div className="goal-ctas">
            {/* A plain anchor, as in the hero: next/link does not scroll
                again when the hash is already #contact. */}
            <a href={cta.href} className="btn btn-primary">
              {cta.label}
              <ArrowRightIcon aria-hidden="true" />
            </a>
            <Link href={link.href} className="link-arrow">
              <span>{link.label}</span>
              <ArrowRightIcon aria-hidden="true" />
            </Link>
          </div>
        </div>
        <ul className="goal-list" data-reveal="">
          {items.map((item) => (
            <li key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
