import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { useLocalized } from "@/components/layout/locale-link";
import { appById } from "@/content/apps";
import {
  productDetails,
  productDetailsVi,
  type RoadApp,
} from "@/content/products";
import { SCREENSHOTS } from "./screenshots";

// What a device shows on its screen: the product's real screenshots, one after
// another (screenshots.ts), else a wireframe. The wireframe is a stand-in made of
// skeleton bars and blocks: it invents no figures, names or data. Its only
// words are the product's own name and its real feature names, and a tag that
// says it is a placeholder.

/** The tag on every wireframe, so no one takes it for the product's screen. */
export const PLACEHOLDER_TAG = "[Placeholder] screen";

export type DeviceKind = "phone" | "laptop" | "monitor";

/** The device each product is shown on. */
export const DEVICE_OF: Readonly<Record<RoadApp, DeviceKind>> = {
  "parent-hub": "phone",
  "staff-hub": "laptop",
  "ai-tutor": "monitor",
};

/** How long each screenshot shows before the next fades in. */
export const SLIDE_MS = 3200;

export function DeviceScreen({
  app,
  images = SCREENSHOTS[app],
  play = false,
}: Readonly<{ app: RoadApp; images?: readonly string[]; play?: boolean }>) {
  const features = useLocalized("productDetails", {
    en: productDetails,
    vi: productDetailsVi,
  })[app].features.map((feature) => feature.title);
  const name = appById(app).shortName;
  if (images?.length) return <Slides images={images} play={play} />;
  const kind = DEVICE_OF[app];
  if (kind === "phone") return <PhoneWire name={name} features={features} />;
  if (kind === "laptop") return <DashWire name={name} features={features} />;
  return <LessonWire name={name} features={features} />;
}

// The screenshots stacked, the current one shown; with motion on, the next
// fades in every SLIDE_MS (opacity only). Still (reduced motion, a saved
// Pause): the first screenshot only. The dots say which one is showing.
function Slides({
  images,
  play,
}: Readonly<{ images: readonly string[]; play: boolean }>) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!play || images.length < 2) return;
    const timer = window.setInterval(
      () => setShown((i) => (i + 1) % images.length),
      SLIDE_MS,
    );
    return () => window.clearInterval(timer);
  }, [play, images.length]);
  return (
    <div className="ws-slides">
      {images.map((src, i) => (
        // Decoration inside the hidden scene: the card holds the real text.
        <Image
          key={src}
          className="ws-image"
          src={src}
          alt=""
          fill
          sizes="640px"
          unoptimized
          draggable={false}
          data-on={i === shown ? "true" : undefined}
        />
      ))}
      {images.length > 1 ? (
        <span className="ws-dots">
          {images.map((src, i) => (
            <i key={src} data-on={i === shown ? "true" : undefined} />
          ))}
        </span>
      ) : null}
    </div>
  );
}

type Wire = Readonly<{ name: string; features: readonly string[] }>;

// A skeleton bar, as wide as `width` per cent of its row.
function Bar({ width }: Readonly<{ width: number }>) {
  return <span className="ws-bar" style={{ width: `${width}%` }} />;
}

function Tag() {
  return <span className="ws-tag">{PLACEHOLDER_TAG}</span>;
}

// A few skeleton bars at the foot of a side panel.
function Skeleton() {
  return (
    <div className="ws-skel">
      <Bar width={70} />
      <Bar width={52} />
      <Bar width={62} />
    </div>
  );
}

// The browser frame of a web screen: three dots and an address bar.
function Chrome() {
  return (
    <div className="ws-chrome">
      <i />
      <i />
      <i />
      <span className="ws-url" />
    </div>
  );
}

// A phone: a status row, the name, and a card for each feature.
function PhoneWire({ name, features }: Wire) {
  return (
    <div className="ws ws-phone">
      <div className="ws-status">
        <Bar width={20} />
        <Bar width={16} />
      </div>
      <p className="ws-name">{name}</p>
      <ul className="ws-feed">
        {features.map((title) => (
          <li key={title}>
            <span className="ws-dot" />
            <span className="ws-label">{title}</span>
          </li>
        ))}
      </ul>
      <Tag />
    </div>
  );
}

// A web dashboard: the features down the side, blocks and rows beside them.
function DashWire({ name, features }: Wire) {
  return (
    <div className="ws ws-dash">
      <Chrome />
      <div className="ws-body">
        <nav className="ws-side">
          <p className="ws-name">{name}</p>
          <ul>
            {features.map((title) => (
              <li key={title}>
                <span className="ws-sq" />
                <span className="ws-label">{title}</span>
              </li>
            ))}
          </ul>
          <Skeleton />
        </nav>
        <div className="ws-main">
          <Bar width={38} />
          <div className="ws-tiles">
            <span />
            <span />
            <span />
          </div>
          <div className="ws-rows">
            {[88, 72, 80, 64, 76].map((width) => (
              <span key={width} className="ws-row">
                <i />
                <Bar width={width} />
              </span>
            ))}
          </div>
        </div>
      </div>
      <Tag />
    </div>
  );
}

// A web lesson: the features down the side, a conversation beside them.
function LessonWire({ name, features }: Wire) {
  const talk: readonly [string, number][] = [
    ["ws-ask", 46],
    ["ws-say", 78],
    ["ws-ask", 34],
    ["ws-say", 62],
  ];
  return (
    <div className="ws ws-lesson">
      <Chrome />
      <div className="ws-body">
        <nav className="ws-side">
          <p className="ws-name">{name}</p>
          <ul>
            {features.map((title) => (
              <li key={title}>
                <span className="ws-sq" />
                <span className="ws-label">{title}</span>
              </li>
            ))}
          </ul>
          <Skeleton />
        </nav>
        <div className="ws-main">
          {talk.map(([who, width], i) => (
            <span
              key={`${who}-${width}`}
              className={`ws-bubble ${who}`}
              style={{ "--at": i } as CSSProperties}
            >
              <Bar width={width} />
              <Bar width={width - 20} />
            </span>
          ))}
          <span className="ws-input" />
        </div>
      </div>
      <Tag />
    </div>
  );
}
