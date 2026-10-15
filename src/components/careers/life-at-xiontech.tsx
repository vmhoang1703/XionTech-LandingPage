import Image from "next/image";
import type { careersLife } from "@/content/careers";

type LifeCopy = Pick<
  typeof careersLife,
  "heading" | "lede" | "tagsLabel" | "tags" | "stripLabel" | "photoAlt"
>;

// Shown when public/careers/life/ holds no photos: plain tinted tiles, no text.
const EMPTY_TILES = 4;
// A set must be taller than the strip for the loop to stay seamless, so a
// short folder is repeated up to this many tiles (repeats are decorative).
const MIN_SET = 3;

type Tile = { key: string; src: string | null; repeat: boolean };

function buildSet(photos: readonly string[]): Tile[] {
  if (photos.length === 0) {
    return Array.from({ length: EMPTY_TILES }, (_, i) => ({
      key: `empty-${i}`,
      src: null,
      repeat: true,
    }));
  }
  return Array.from({ length: Math.max(MIN_SET, photos.length) }, (_, i) => {
    const src = photos[i % photos.length];
    return { key: `${i}-${src}`, src, repeat: i >= photos.length };
  });
}

// Careers "Meet the team at XionTech" (Amber's culture strip mock,
// 2026-10-15): copy and interest tags on the left, one vertical photo strip on
// the right that loops upward. `photos` are the files found in
// public/careers/life/ (any count from one up). The track holds the set
// twice and moves by half, so the loop is seamless; the second set is hidden
// from assistive tech. Hover or focus pauses the strip; with reduced motion it
// stands still and scrolls by hand.
export function LifeAtXionTech({
  copy,
  photos,
}: Readonly<{ copy: LifeCopy; photos: readonly string[] }>) {
  const empty = photos.length === 0;
  const tiles = buildSet(photos);

  return (
    <section id="meet-the-team" className="sec life" aria-labelledby="life-h">
      <div className="wrap life-grid">
        <div className="life-copy" data-reveal="">
          <h2 id="life-h">{copy.heading}</h2>
          <p className="lede">{copy.lede}</p>
          <ul className="life-tags" aria-label={copy.tagsLabel}>
            {copy.tags.map((tag) => (
              <li key={tag} className="life-tag">
                {tag}
              </li>
            ))}
          </ul>
        </div>
        <div
          className="life-strip"
          role={empty ? undefined : "region"}
          aria-label={empty ? undefined : copy.stripLabel}
          aria-hidden={empty || undefined}
          tabIndex={empty ? undefined : 0}
        >
          <div className="life-track">
            {[false, true].map((copyOfSet) => (
              <ul
                key={String(copyOfSet)}
                className="life-set"
                aria-hidden={copyOfSet || undefined}
              >
                {tiles.map(({ key, src, repeat }) => (
                  <li
                    key={key}
                    className={src ? "life-tile" : "life-tile is-empty"}
                  >
                    {src && (
                      <Image
                        src={src}
                        alt={copyOfSet || repeat ? "" : copy.photoAlt}
                        fill
                        sizes="(width <= 640px) 92vw, 430px"
                      />
                    )}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
