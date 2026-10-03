import { ArrowRightIcon, CpuIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { homeApps } from "@/content/home";

type AppId = (typeof homeApps.tiles)[number]["id"];

// Badges are swapped on the PXP and SXP tiles so they contrast with the tile
// (UX-DR15): the amber PXP tile carries the navy SXP badge and vice versa.
const TILE: Record<AppId, { tile: string; badge: string }> = {
  pxp: { tile: "t-pxp", badge: "b-sxp" },
  sxp: { tile: "t-sxp", badge: "b-pxp" },
  lxp: { tile: "spot t-lxp", badge: "b-lxp" },
  iot: { tile: "spot t-iot", badge: "b-iot" },
};

// Each tile is one stretched link (the heading link covers the tile), so the
// mini phone and chips stay non-interactive (AC-A11Y-4). Ported from the
// prototype bento; the spotlight glow and card lift come after demo.
export function ProductBento() {
  const { title, lede, phoneHint, tiles } = homeApps;

  return (
    <section aria-labelledby="apps-title" className="sec surface-mist linen">
      <div className="wrap">
        <div className="sec-head">
          <h2 id="apps-title">{title}</h2>
          <p className="lede">{lede}</p>
        </div>
        <div className="bento">
          {tiles.map((app) => (
            <article key={app.id} className={`tile ${TILE[app.id].tile}`}>
              {app.id === "iot" ? null : (
                <span className="go" aria-hidden="true">
                  <ArrowRightIcon />
                </span>
              )}
              <span
                aria-hidden="true"
                className={`badge ${TILE[app.id].badge}`}
              >
                {app.id === "iot" ? <CpuIcon /> : app.name}
              </span>
              <h3>
                <Link
                  href={`/products#${app.id}`}
                  aria-label={`${app.name}, ${app.full}`}
                >
                  {app.name}
                </Link>
              </h3>
              <span className="full">{app.full}</span>
              <p>{app.line}</p>
              {app.chips.length > 0 ? (
                <div className="chips">
                  {app.chips.map((chip) => (
                    <span key={chip} className="chip">
                      {chip}
                    </span>
                  ))}
                </div>
              ) : null}
              {app.id === "pxp" ? (
                <div className="mini-phone" aria-hidden="true">
                  <div className="home-media">
                    <span>{phoneHint}</span>
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
