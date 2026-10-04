import { careersCulture } from "@/content/careers";

// Server Component. Culture copy with a fixed placeholder photo frame (CAP-1).
export function Culture() {
  const { heading, lede, bullets, photo } = careersCulture;

  return (
    <section className="sec surface-paper" aria-labelledby="cul-h">
      <div className="wrap split">
        <div>
          <h2 id="cul-h">{heading}</h2>
          <p className="lede mt-4">{lede}</p>
          <ul className="list-check mt-6.5">
            {bullets.map(({ icon: BulletIcon, title, text }) => (
              <li key={title}>
                <BulletIcon weight="fill" aria-hidden="true" />
                <span>
                  <b>{title}</b> <span>{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="illo min-h-110">
          <b>{photo.label}</b>
          <span>{photo.hint}</span>
        </div>
      </div>
    </section>
  );
}
