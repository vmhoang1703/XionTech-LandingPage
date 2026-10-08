import { Fragment } from "react";
import { productsHero } from "@/content/products";
import { EcoMotion } from "./eco-motion";

// Server Component (E-A5 CAP-1), ported from the prototype products.html:
// "Built apart. Better together." with the four apps around the X tile.
// Only the glows and their Pause motion button are a client island.
export function ProductsHero() {
  const { titleLines, lede, diagramLabel, hub, diagram } = productsHero;

  return (
    <section className="eco-hero surface-paper" aria-labelledby="products-h1">
      <EcoMotion />
      <div className="wrap eco-grid">
        <div className="eco-copy">
          <h1 id="products-h1">
            {titleLines.map((line, index) => (
              <Fragment key={line}>
                {index > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </h1>
          <p className="lede">{lede}</p>
        </div>
        <fieldset className="eco-diagram" aria-label={diagramLabel}>
          <svg
            className="eco-lines"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <line x1="20" y1="22" x2="80" y2="78" />
            <line x1="80" y1="22" x2="20" y2="78" />
          </svg>
          <span className="eco-hub" aria-hidden="true">
            {hub}
          </span>
          {diagram.map(({ app, eyebrow, corner }) => (
            <a
              key={app.id}
              className={`eco-card eco-${corner}`}
              href={`#${app.anchor}`}
            >
              <small>{eyebrow}</small>
              <b>{app.shortName}</b>
            </a>
          ))}
        </fieldset>
      </div>
    </section>
  );
}
