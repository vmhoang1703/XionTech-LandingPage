import { careersBenefits } from "@/content/careers";

// Server Component. Four benefit cards; the 1st is a feature card, the 3rd navy.
const VARIANTS = ["feature", undefined, "navy", undefined];

export function Benefits() {
  const { heading, items } = careersBenefits;

  return (
    <section className="sec surface-mist linen" aria-labelledby="ben-h">
      <div className="wrap">
        <div className="sec-head">
          <h2 id="ben-h">{heading}</h2>
        </div>
        <div className="svc-grid">
          {items.map(({ icon: BenefitIcon, title, text }, index) => (
            <div
              key={title}
              className={["spot", "svc", VARIANTS[index]]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="ic">
                <BenefitIcon aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
