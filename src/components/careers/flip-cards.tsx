import { careersValues } from "@/content/careers";
import { FlipCard } from "./flip-card";

// Server Component. "Five things that shape the way we work." (E-A7 CAP-3).
// The values are not yet confirmed (Q6), so each card title is [Placeholder].
export function FlipCards() {
  const { heading, lede, frontHint, backHint, cards } = careersValues;

  return (
    <section id="culture" className="sec" aria-labelledby="cul-h">
      <div className="wrap">
        <div className="sec-head" data-reveal="">
          <h2 id="cul-h">{heading}</h2>
          <p className="lede">{lede}</p>
        </div>
        <div className="flip-cards" data-reveal="">
          {cards.map((card, index) => (
            <FlipCard
              key={card.icon}
              card={card}
              num={String(index + 1).padStart(2, "0")}
              frontHint={frontHint}
              backHint={backHint}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
