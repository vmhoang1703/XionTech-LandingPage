import { careersInside } from "@/content/careers";

// Server Component. Inside XionTech: five text tiles, no links (E-A7 CAP-2).
// Navy tiles use the base `.ins-card` look; the others add their tone.
export function Inside() {
  const { heading, lede, tiles } = careersInside;

  return (
    <section id="life" className="sec" aria-labelledby="life-h">
      <div className="wrap">
        <div className="sec-head ins-head">
          <h2 id="life-h">{heading}</h2>
          <p className="lede">{lede}</p>
        </div>
        <div className="ins-grid">
          {tiles.map(({ tag, title, text, tone, big }) => (
            <article
              key={title}
              className={[
                "ins-card",
                big ? "big" : undefined,
                tone === "navy" ? undefined : tone,
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="ins-tag">{tag}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
