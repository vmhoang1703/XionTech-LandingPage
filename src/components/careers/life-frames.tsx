import { careersLife } from "@/content/careers";

// Server Component. Three fixed placeholder frames; Story 6.3 adds real photos (CAP-4).
export function LifeFrames() {
  const { heading, frames } = careersLife;

  return (
    <section id="life" className="sec surface-mist" aria-labelledby="life-h">
      <div className="wrap">
        <div className="sec-head">
          <h2 id="life-h">{heading}</h2>
        </div>
        <div className="news-grid">
          {frames.map((caption) => (
            <div key={caption} className="spot aspect-4/3">
              <div className="illo h-full">
                <b>{caption}</b>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
