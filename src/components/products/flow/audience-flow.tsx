import { audienceFlow, productsShowcase } from "@/content/products";
import { FlowProgress } from "./flow-progress";

// Server Component: the Products audience flow. The intro carries the page
// H1; each chapter is one person in a school, the app they use, its steps and
// a link down to the app's card. The sticky campus and the scroll progress
// are the client island FlowProgress.
export function AudienceFlow() {
  const { intro, chapters, detailsLink } = audienceFlow;

  return (
    <section id="flow" className="sec surface-paper" aria-labelledby="flow-h1">
      <div className="wrap">
        <div className="flow-intro">
          <h1 id="flow-h1">{intro.title}</h1>
          <p className="lede">{intro.lede}</p>
        </div>
        <FlowProgress count={chapters.length}>
          {chapters.map(({ id, audience, app, madeFor, tagline, steps }) => (
            <li key={id} className="flow-chapter">
              <h2>{audience}</h2>
              <p className="flow-app">{app.fullName}</p>
              <p>
                {productsShowcase.madeFor} {madeFor}
              </p>
              <p>{tagline}</p>
              <ol className="flow-steps">
                {steps.map((step) => (
                  <li key={step.id}>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </li>
                ))}
              </ol>
              <a className="flow-link" href={`#${app.anchor}`}>
                {detailsLink(app.fullName)}
              </a>
            </li>
          ))}
        </FlowProgress>
      </div>
    </section>
  );
}
