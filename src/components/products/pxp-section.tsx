import {
  AppleLogoIcon,
  ChartLineUpIcon,
  ChatsCircleIcon,
  CheckCircleIcon,
  GooglePlayLogoIcon,
  WalletIcon,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";
import { PLACEHOLDER_HREF, productLinks } from "@/content/product-links";
import { pxpSection } from "@/content/products";
import { PxpStoryPhone } from "./pxp-story-phone";

// Keyed by feature id, so a new feature without an icon is a type error.
const FEATURE_ICONS: Record<(typeof pxpSection.features)[number]["id"], Icon> =
  {
    arrived: CheckCircleIcon,
    progress: ChartLineUpIcon,
    teachers: ChatsCircleIcon,
    fees: WalletIcon,
  };

// While a store address is the stand-in (decision A1) the button is a
// disabled label, so a click goes nowhere; a real address becomes a link that
// opens a new tab and says so (lead, 2026-10-03).
export function StoreButton({
  href,
  label,
  Icon,
}: Readonly<{ href: string; label: string; Icon: Icon }>) {
  const content = (
    <>
      <Icon weight="fill" aria-hidden="true" />
      {label}
    </>
  );
  if (href === PLACEHOLDER_HREF) {
    return (
      <span className="btn btn-glass" aria-disabled="true">
        {content}
      </span>
    );
  }
  return (
    <a
      className="btn btn-glass"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label}${pxpSection.stores.newTab}`}
    >
      {content}
    </a>
  );
}

const STORES = [
  {
    href: productLinks.pxpAppStore,
    label: pxpSection.stores.appStore,
    Icon: AppleLogoIcon,
  },
  {
    href: productLinks.pxpGooglePlay,
    label: pxpSection.stores.googlePlay,
    Icon: GooglePlayLogoIcon,
  },
];

// Server Component for /products#pxp. Only the story phone is a client island.
export function PxpSection() {
  const { badge, heading, lede, features } = pxpSection;

  return (
    <section
      id="pxp"
      aria-labelledby="pxp-h"
      className="sec surface-paper products-anchor"
    >
      {/* The phone comes first, as in the mockup; below md, .pxp-phone moves
          it under the text so a #pxp jump shows the heading. */}
      <div className="wrap split">
        <div className="pxp-phone">
          <PxpStoryPhone />
        </div>
        <div>
          <span className="badge b-pxp size-14">{badge}</span>
          <h2 id="pxp-h" className="mt-4.5">
            {heading}
          </h2>
          <p className="lede mt-3">{lede}</p>
          <div className="feature-list">
            {features.map((f) => {
              const FeatureIcon = FEATURE_ICONS[f.id];
              return (
                <div key={f.id}>
                  <FeatureIcon aria-hidden="true" />
                  <p>
                    <b>{f.title}</b>
                    <span>{f.body}</span>
                  </p>
                </div>
              );
            })}
          </div>
          <div className="store-row">
            {STORES.map((store) => (
              <StoreButton key={store.label} {...store} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
