import { aboutValues, homeValuesHeading } from "@/content/values";

// Home core values: same six values as About, with the Home heading. No
// id="values" here; that anchor belongs to About.
export function HomeValues() {
  return (
    <section aria-labelledby="home-values-h" className="sec home-values">
      <div className="wrap">
        <div className="sec-head">
          <h2 id="home-values-h">{homeValuesHeading.title}</h2>
          <p className="lede">{homeValuesHeading.lede}</p>
        </div>
        <div className="values">
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
