import { FlipToggle } from "@/components/sections/flip-toggle";
import { aboutValues, homeValuesHeading } from "@/content/values";

// Home core values as flip cards: the front shows the icon, the title and a
// short line; the back the full value. Home is the only page with them. No
// id="values": the About page no longer has that anchor either.
export function HomeValues() {
  const { frontHint, backHint } = homeValuesHeading;

  return (
    <section aria-labelledby="home-values-h" className="sec home-values">
      <div className="wrap">
        <div className="sec-head" data-reveal="">
          <h2 id="home-values-h">{homeValuesHeading.title}</h2>
          <p className="lede">{homeValuesHeading.lede}</p>
        </div>
        <div className="flip-cards" data-reveal="">
          {aboutValues.items.map(
            ({ icon: ValueIcon, title, short, text, featured }) => (
              <FlipToggle
                key={title}
                accent={featured}
                front={
                  <>
                    <ValueIcon aria-hidden="true" className="flip-icon" />
                    <span>
                      <span className="flip-title">{title}</span>
                      <span className="flip-text">{short}</span>
                    </span>
                    <span className="flip-hint">{frontHint}</span>
                  </>
                }
                back={
                  <>
                    <span>
                      <span className="flip-title">{title}</span>
                      <span className="flip-text">{text}</span>
                    </span>
                    <span className="flip-hint">{backHint}</span>
                  </>
                }
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
