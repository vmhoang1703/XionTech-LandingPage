import {
  BookOpenIcon,
  ChalkboardTeacherIcon,
  ChartDonutIcon,
  ChatTeardropTextIcon,
  ClipboardTextIcon,
  CpuIcon,
  DoorOpenIcon,
  GaugeIcon,
  IdentificationCardIcon,
  LightbulbIcon,
  LightningIcon,
  MegaphoneIcon,
  ProjectorScreenIcon,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";
import { PLACEHOLDER_HREF, webAppLinks } from "@/content/product-links";
import { productsIot, productsLxp, productsSxp } from "@/content/products";

type WebAppId = keyof typeof webAppLinks;
type Feature = { id: string; name: string; line: string };
// Keyed by the content's feature ids, so a renamed id fails the type check.
type FeatureId<T extends { features: readonly Feature[] }> =
  T["features"][number]["id"];

// LXP, SXP and IoT sections of /products (Story 4.3), ported from the
// prototype products.html. Server Components: nothing here needs state.

// While a web address is the stand-in (decision A1) the pill is a disabled
// label, so a click goes nowhere; a real address becomes a link that opens a
// new tab and says so (lead, 2026-10-03).
export function UrlPill({
  href,
  label,
}: Readonly<{ href: string; label: string }>) {
  if (href === PLACEHOLDER_HREF) {
    return (
      <span className="bar-url" aria-disabled="true">
        {label}
      </span>
    );
  }
  return (
    <a
      className="bar-url"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (opens in a new tab)`}
    >
      {label}
    </a>
  );
}

// Static browser chrome around an empty media frame. The URL pill opens the
// app in a new tab; until Story 4.4 the frame shows its empty grid, never an
// <img> with a broken source.
function BrowserFrame({
  app,
  media,
}: Readonly<{ app: WebAppId; media: string }>) {
  const { label, href } = webAppLinks[app];
  return (
    <div className="browser">
      <div className="bar">
        <i aria-hidden="true" />
        <i aria-hidden="true" />
        <i aria-hidden="true" />
        <UrlPill href={href} label={label} />
      </div>
      <div className="browser-media">
        <div className="home-media">
          <span>{media}</span>
        </div>
      </div>
    </div>
  );
}

function Chips({ items }: Readonly<{ items: readonly string[] }>) {
  return (
    <div className="chips">
      {items.map((item) => (
        <span key={item} className="chip">
          {item}
        </span>
      ))}
    </div>
  );
}

function FeatureList({
  features,
  icons,
  className,
}: Readonly<{
  features: readonly Feature[];
  icons: Record<string, Icon>;
  className?: string;
}>) {
  return (
    <ul className={["feature-list", className].filter(Boolean).join(" ")}>
      {features.map((feature) => {
        const FeatureIcon = icons[feature.id];
        return (
          <li key={feature.id}>
            <FeatureIcon aria-hidden="true" />
            <p>
              <b>{feature.name}</b>
              <span>{feature.line}</span>
            </p>
          </li>
        );
      })}
    </ul>
  );
}

const LXP_ICONS: Record<FeatureId<typeof productsLxp>, Icon> = {
  lessons: BookOpenIcon,
  assignments: ClipboardTextIcon,
  progress: ChartDonutIcon,
  feedback: ChatTeardropTextIcon,
};

export function LxpSection() {
  const { badge, title, lede, audience, features, media } = productsLxp;
  return (
    <section
      id="lxp"
      aria-labelledby="lxp-h"
      className="products-anchor sec surface-mist linen"
    >
      <div className="wrap">
        <div className="sec-head sec-head-center">
          <span className="badge badge-lg b-lxp">{badge}</span>
          <h2 id="lxp-h">{title}</h2>
          <p className="lede">{lede}</p>
          <Chips items={audience} />
        </div>
        <div className="web-app-wide">
          <BrowserFrame app="lxp" media={media} />
          <FeatureList
            features={features}
            icons={LXP_ICONS}
            className="feature-list-4"
          />
        </div>
      </div>
    </section>
  );
}

const SXP_ICONS: Record<FeatureId<typeof productsSxp>, Icon> = {
  attendance: IdentificationCardIcon,
  classes: ChalkboardTeacherIcon,
  communication: MegaphoneIcon,
  dashboards: GaugeIcon,
};

export function SxpSection() {
  const { badge, title, lede, audience, features, media } = productsSxp;
  return (
    <section
      id="sxp"
      aria-labelledby="sxp-h"
      className="products-anchor sec surface-navy gridbg"
    >
      {/* Text first in reading order; from 900px the frame shows on the left */}
      <div className="wrap split split-media-first">
        <div className="web-app-text">
          {/* Amber badge: the navy SXP badge would vanish on the navy surface */}
          <span className="badge badge-lg b-pxp">{badge}</span>
          <h2 id="sxp-h">{title}</h2>
          <p className="lede">{lede}</p>
          <Chips items={audience} />
          <FeatureList features={features} icons={SXP_ICONS} />
        </div>
        <BrowserFrame app="sxp" media={media} />
      </div>
    </section>
  );
}

const IOT_CARDS: Record<
  FeatureId<typeof productsIot>,
  { icon: Icon; variant?: "feature" | "navy" }
> = {
  av: { icon: ProjectorScreenIcon },
  climate: { icon: LightbulbIcon, variant: "feature" },
  access: { icon: DoorOpenIcon },
  energy: { icon: LightningIcon, variant: "navy" },
};

export function IotSection() {
  const { badgeLabel, title, lede, audience, features, media } = productsIot;
  return (
    <section
      id="iot"
      aria-labelledby="iot-h"
      className="products-anchor sec surface-paper"
    >
      <div className="wrap">
        <div className="sec-head sec-head-center">
          <span
            className="badge badge-lg b-iot"
            role="img"
            aria-label={badgeLabel}
          >
            <CpuIcon aria-hidden="true" />
          </span>
          <h2 id="iot-h">{title}</h2>
          <p className="lede">{lede}</p>
          <Chips items={audience} />
        </div>
        <div className="svc-grid">
          {features.map((feature) => {
            const { icon: CardIcon, variant } = IOT_CARDS[feature.id];
            return (
              <div
                key={feature.id}
                className={["spot", "svc", variant].filter(Boolean).join(" ")}
              >
                <span className="ic">
                  <CardIcon aria-hidden="true" />
                </span>
                <h3>{feature.name}</h3>
                <p>{feature.line}</p>
              </div>
            );
          })}
        </div>
        <div className="web-app-wide web-app-after">
          <BrowserFrame app="iot" media={media} />
        </div>
      </div>
    </section>
  );
}
