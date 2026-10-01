import Link from "next/link";
import { homeApps } from "@/content/home";

type AppId = (typeof homeApps.tiles)[number]["id"];

// Badges are swapped on the PXP and SXP tiles so they contrast with the tile
// (UX-DR15): the amber PXP tile carries the navy SXP badge and vice versa.
const TILE: Record<AppId, { tile: string; badge: string }> = {
  pxp: {
    tile: "surface-amber sm:col-span-2 md:col-span-7 md:row-span-2",
    badge: "product-badge-sxp",
  },
  sxp: {
    tile: "surface-navy sm:col-span-2 md:col-span-5",
    badge: "product-badge-pxp",
  },
  lxp: { tile: "spotlight-card md:col-span-3", badge: "product-badge-lxp" },
  iot: { tile: "spotlight-card md:col-span-2", badge: "product-badge-iot" },
};

// Each tile is one stretched link (the heading link covers the tile), so the
// mini phone and chips stay non-interactive (AC-A11Y-4).
export function ProductBento() {
  const { title, lede, phoneHint, tiles } = homeApps;

  return (
    <section aria-labelledby="apps-title" className="surface-mist py-section">
      <div className="max-w-page px-gutter-mobile sm:px-gutter mx-auto">
        <div className="mb-section-head-gap">
          <h2 id="apps-title">{title}</h2>
          <p className="text-body-lg mt-4">{lede}</p>
        </div>
        <div className="gap-grid-gap grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12">
          {tiles.map((app) => (
            <article
              key={app.id}
              className={`relative flex flex-col gap-3 overflow-hidden rounded-lg p-8 ${TILE[app.id].tile}`}
            >
              <span aria-hidden="true" className={TILE[app.id].badge}>
                {app.name}
              </span>
              <h3>
                <Link
                  href={`/products#${app.id}`}
                  className="after:absolute after:inset-0 after:rounded-[inherit]"
                >
                  {app.name}
                </Link>
              </h3>
              <span className="font-brand text-label-sm uppercase">
                {app.full}
              </span>
              <p>{app.line}</p>
              {app.chips.length > 0 ? (
                <div className="mt-auto flex flex-wrap gap-2">
                  {app.chips.map((chip) => (
                    <span key={chip} className="industry-chip">
                      {chip}
                    </span>
                  ))}
                </div>
              ) : null}
              {app.id === "pxp" ? (
                <div className="device-frame device-phone mt-4 w-1/3 self-end">
                  <div className="media-frame">
                    <span className="font-brand text-label-sm uppercase">
                      {phoneHint}
                    </span>
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
