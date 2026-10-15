import Image from "next/image";
import type { CSSProperties } from "react";
import { useLocalized } from "@/components/layout/locale-link";
import { appById } from "@/content/apps";
import {
  productDetails,
  productDetailsVi,
  type RoadApp,
} from "@/content/products";
import { SCREENSHOTS } from "./screenshots";

// What a device shows on its screen: a real screenshot when one has been added
// (screenshots.ts), else a wireframe. The wireframe is a stand-in made of
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

export function DeviceScreen({
  app,
  image = SCREENSHOTS[app],
}: Readonly<{ app: RoadApp; image?: string }>) {
  const features = useLocalized("productDetails", {
    en: productDetails,
    vi: productDetailsVi,
  })[app].features.map((feature) => feature.title);
  const name = appById(app).shortName;
  if (image) {
    // A screenshot is sized for its device by whoever adds it: no resizing.
    return (
      <Image
        className="ws-image"
        src={image}
        alt=""
        fill
        sizes="520px"
        unoptimized
        draggable={false}
      />
    );
  }
  const kind = DEVICE_OF[app];
  if (kind === "phone") return <PhoneWire name={name} features={features} />;
  if (kind === "laptop") return <DashWire name={name} features={features} />;
  return <LessonWire name={name} features={features} />;
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
