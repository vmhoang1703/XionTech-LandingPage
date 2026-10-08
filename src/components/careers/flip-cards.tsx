import { careersValues } from "@/content/careers";
import { FlipCard } from "./flip-card";

// Server Component. "Five things that shape the way we work." (E-A7 CAP-3).
// The values are not yet confirmed (Q6), so the section carries a note.
export function FlipCards() {
  const { heading, lede, note, frontHint, backHint, cards } = careersValues;

  return (
    <section id="culture" className="sec" aria-labelledby="cul-h">
      <div className="wrap">
        <div className="sec-head">
          <h2 id="cul-h">{heading}</h2>
          <p className="lede">{lede}</p>
          <p className="sample">{note}</p>
        </div>
        <div className="flip-cards">
          {cards.map((card, index) => (
            <FlipCard
              key={card.icon}
              card={card}
              num={`0${index + 1}`}
              frontHint={frontHint}
              backHint={backHint}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
