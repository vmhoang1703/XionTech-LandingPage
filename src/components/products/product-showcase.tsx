import {
  AppleLogoIcon,
  ArrowUpRightIcon,
  BellRingingIcon,
  CalendarBlankIcon,
  ChatsCircleIcon,
  CpuIcon,
  DoorOpenIcon,
  ExamIcon,
  GaugeIcon,
  GooglePlayLogoIcon,
  LightbulbIcon,
  LightningIcon,
  MagnifyingGlassIcon,
  ProjectorScreenIcon,
  ReceiptIcon,
  SparkleIcon,
  ThermometerSimpleIcon,
  TrophyIcon,
  UserCheckIcon,
} from "@phosphor-icons/react/ssr";
import type { Icon } from "@phosphor-icons/react";
import { APPS, type App, type AppBadge } from "@/content/apps";
import { productLinks, webAppLinks } from "@/content/product-links";
import {
  FEATURE_PLACEHOLDER,
  productDetails,
  productsShowcase,
  type FeatureId,
  type ProductDetail as Detail,
} from "@/content/products";
import { ProductDetail, ProductLink } from "./product-detail";

const S = productsShowcase;

// Keyed by name and by feature id, so a new badge or feature without an icon
// is a type error.
const BADGE_ICONS: Record<Extract<AppBadge, { kind: "icon" }>["icon"], Icon> = {
  Cpu: CpuIcon,
  Sparkle: SparkleIcon,
};

const FEATURE_ICONS: Record<FeatureId, Icon> = {
  gate: BellRingingIcon,
  scores: ExamIcon,
  messages: ChatsCircleIcon,
  fees: ReceiptIcon,
  attendance: UserCheckIcon,
  classes: CalendarBlankIcon,
  parents: ChatsCircleIcon,
  dashboards: GaugeIcon,
  av: ProjectorScreenIcon,
  climate: ThermometerSimpleIcon,
  doors: DoorOpenIcon,
  energy: LightningIcon,
  diagnosis: MagnifyingGlassIcon,
  hints: LightbulbIcon,
  mastery: TrophyIcon,
};

// The name sits right beside the badge, so the badge is decoration.
function Badge({ badge }: Readonly<{ badge: AppBadge }>) {
  if (badge.kind === "text") {
    return (
      <span className="badge" aria-hidden="true">
        {badge.text}
      </span>
    );
  }
  const BadgeIcon = BADGE_ICONS[badge.icon];
  return (
    <span className="badge" aria-hidden="true">
      <BadgeIcon />
    </span>
  );
}

// An empty screenshot frame: a phone for Parent Hub, a browser for the web
// apps. Real screens arrive after the demo (Story 4.4).
function Media({ app, detail }: Readonly<{ app: App; detail: Detail }>) {
  const caption = S.screenshot(app.fullName, detail.media);
  if (app.id === "parent-hub") {
    return (
      <div className="pmedia is-mobile">
        <div className="pm-phone">
          <span className="pm-notch" aria-hidden="true" />
          <div className="home-media">
            <span>{caption}</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="pmedia">
      <div className="browser pm-browser">
        <div className="bar">
          <i aria-hidden="true" />
          <i aria-hidden="true" />
          <i aria-hidden="true" />
          <span className="bar-url">{webAppLinks[app.id].label}</span>
        </div>
        <div className="pm-slot home-media">
          <span>{caption}</span>
        </div>
      </div>
    </div>
  );
}

function Features({ detail }: Readonly<{ detail: Detail }>) {
  return (
    <ul className="pd-feats">
      {detail.features.map((feature) => {
        const FeatureIcon = FEATURE_ICONS[feature.id];
        return (
          <li key={feature.id}>
            <FeatureIcon aria-hidden="true" />
            <h4>{feature.title}</h4>
            <p>{FEATURE_PLACEHOLDER}</p>
          </li>
        );
      })}
    </ul>
  );
}

function Actions({ app }: Readonly<{ app: App }>) {
  if (app.id === "parent-hub") {
    const stores = [
      {
        href: productLinks.pxpAppStore,
        text: S.stores.appStore,
        StoreIcon: AppleLogoIcon,
      },
      {
        href: productLinks.pxpGooglePlay,
        text: S.stores.googlePlay,
        StoreIcon: GooglePlayLogoIcon,
      },
    ];
    return (
      <div className="pd-cta">
        {stores.map(({ href, text, StoreIcon }) => (
          <ProductLink key={text.name} href={href} className="store-btn">
            <StoreIcon weight="fill" aria-hidden="true" />
            <span>
              <small>{text.small}</small>
              <b>{text.name}</b>
            </span>
          </ProductLink>
        ))}
      </div>
    );
  }
  return (
    <div className="pd-cta">
      <ProductLink href={webAppLinks[app.id].href} className="btn btn-navy">
        {S.viewPrototype}
        <ArrowUpRightIcon aria-hidden="true" />
      </ProductLink>
    </div>
  );
}

function ShowcaseCard({ app }: Readonly<{ app: App }>) {
  const detail = productDetails[app.id];
  const headingId = `${app.anchor}-h`;
  return (
    <article
      id={app.anchor}
      className="pshow"
      data-aud={detail.audience}
      aria-labelledby={headingId}
    >
      <div className="ps-head">
        <div>
          <div className="pc-kick">
            <Badge badge={app.badge} />
            <span className="ps-name">{app.fullName}</span>
          </div>
          <h3 className="ps-title" id={headingId}>
            {app.tagline}
          </h3>
        </div>
        <ProductDetail
          dialogId={`pd-${app.anchor}`}
          name={app.fullName}
          audience={detail.audience}
          badge={<Badge badge={app.badge} />}
        >
          <div className="pd-intro">
            <div>
              <p className="pd-tag">{app.tagline}</p>
              <p className="pd-who">
                <span className="pd-label">{S.madeFor}</span> {detail.madeFor}
              </p>
              <Actions app={app} />
            </div>
            <div className="pd-media">
              <Media app={app} detail={detail} />
            </div>
          </div>
          <h3 className="pd-h">{S.featuresHeading}</h3>
          <Features detail={detail} />
        </ProductDetail>
      </div>
      <div className="ps-visual">
        <Media app={app} detail={detail} />
      </div>
      {/* Without JavaScript the dialog cannot open; React renders noscript
          content only in the server HTML, so JS visitors never see it. */}
      <noscript>
        <details className="pd-nojs">
          <summary>{S.featuresHeading}</summary>
          <Features detail={detail} />
        </details>
      </noscript>
    </article>
  );
}

// Server Component (E-A5 CAP-2): "What we build." with the four apps as
// showcase cards. Card ids are the apps.ts anchors, so old links still land.
export function ProductShowcase() {
  return (
    <section id="apps" className="sec surface-paper" aria-labelledby="apps-h">
      <div className="wrap">
        <div className="sec-head" data-reveal="">
          <h2 id="apps-h">{S.heading}</h2>
          <p className="lede">{S.lede}</p>
        </div>
        <div className="pshows">
          {APPS.map((app) => (
            <ShowcaseCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </section>
  );
}
