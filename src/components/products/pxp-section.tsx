import {
  AppleLogoIcon,
  ChartLineUpIcon,
  ChatsCircleIcon,
  CheckCircleIcon,
  GooglePlayLogoIcon,
  WalletIcon,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";
import { productLinks } from "@/content/product-links";
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
  const { badge, heading, lede, features, stores } = pxpSection;

  return (
    <section
      id="pxp"
      aria-labelledby="pxp-h"
      className="sec surface-paper products-anchor"
    >
      <div className="wrap split">
        <PxpStoryPhone />
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
            {STORES.map(({ href, label, Icon }) => (
              <a
                key={label}
                className="btn btn-glass"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label}${stores.newTab}`}
              >
                <Icon weight="fill" aria-hidden="true" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
