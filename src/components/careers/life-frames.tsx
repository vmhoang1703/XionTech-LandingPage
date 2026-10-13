import Image from "next/image";
import { careersLife, careersLifeVi } from "@/content/careers";
import { pickLocale } from "@/i18n/content";
import type { Locale } from "@/i18n/locales";
import type { LifePhotos } from "@/lib/careers/life-photos";

// Server Component. A slot with a photo (and alt text) shows it; an empty slot
// keeps its [Placeholder] frame.
export function LifeFrames({
  photos,
  locale = "en",
}: Readonly<{ photos?: LifePhotos | null; locale?: Locale }>) {
  const { heading, frames } = pickLocale(locale, {
    en: careersLife,
    vi: careersLifeVi,
  });

  return (
    <section id="life" className="sec surface-mist" aria-labelledby="life-h">
      <div className="wrap">
        <div className="sec-head" data-reveal="">
          <h2 id="life-h">{heading}</h2>
        </div>
        <div className="news-grid" data-reveal="">
          {frames.map(({ slot, placeholder }) => {
            const photo = photos?.[slot];
            if (!photo?.url || !photo.alt?.trim()) {
              return (
                <div key={slot} className="spot aspect-4/3">
                  <div className="illo h-full min-h-0">
                    <b>{placeholder}</b>
                  </div>
                </div>
              );
            }
            return (
              <figure key={slot}>
                <div className="spot aspect-4/3">
                  <Image
                    src={`${photo.url}?w=800&auto=format`}
                    alt={photo.alt}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                {photo.caption ? (
                  <figcaption>{photo.caption}</figcaption>
                ) : null}
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
