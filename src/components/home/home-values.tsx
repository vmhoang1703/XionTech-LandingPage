import { aboutValues, homeValuesHeading } from "@/content/values";

// Home core values, with the Home heading. No id="values": the About page no
// longer has that anchor either.
export function HomeValues() {
  return (
    <section aria-labelledby="home-values-h" className="sec home-values">
      <div className="wrap">
        <div className="sec-head" data-reveal="">
          <h2 id="home-values-h">{homeValuesHeading.title}</h2>
          <p className="lede">{homeValuesHeading.lede}</p>
        </div>
        <div className="values" data-reveal="">
          {aboutValues.items.map(
            ({ icon: ValueIcon, title, text, featured }) => (
              <div key={title} className={featured ? "value feat" : "value"}>
                <ValueIcon aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
