import type { CSSProperties, ReactNode } from "react";
import type { RoadApp } from "@/content/products";
import { DEVICE_OF, DeviceScreen } from "./device-screen";

// The devices of the stop scene, built from CSS shapes (product-scene.css): no
// images, no WebGL. Sizes are design pixels (CSS turns them into screen
// pixels). A device is a slab: a front face (its bezel and screen)
// and flat copies of the same rounded shape behind it, each a step further
// back and a shade darker, which read as its thickness and its rounded edge.
// Decoration only; the scene hides it from assistive technology.

// Copies behind the front face of a slab, and how many on a small screen.
const COPIES = 16;
const COPIES_SMALL = 8;

function Slab({
  className,
  size,
  thickness,
  radius,
  bezel = 0,
  copies,
  children,
}: Readonly<{
  className: string;
  size: readonly [width: number, height: number];
  thickness: number;
  radius: number;
  bezel?: number;
  copies: number;
  children?: ReactNode;
}>) {
  return (
    <div
      className={`dv-slab ${className}`}
      style={
        {
          "--w": size[0],
          "--h": size[1],
          "--t": thickness,
          "--r": radius,
          "--bezel": bezel,
          "--n": copies,
        } as CSSProperties
      }
    >
      {/* The copies come first, farthest first, and the face last: a browser
          that paints in document order (not by depth) still shows the face on
          top. */}
      {Array.from({ length: copies }, (_, i) => (
        <span
          key={i}
          className="dv-slice"
          style={{ "--k": copies - i } as CSSProperties}
        />
      ))}
      <div className="dv-face">{children}</div>
    </div>
  );
}

// A phone, upright and floating a little above the ground.
function Phone({
  app,
  copies,
  play,
}: Readonly<{ app: RoadApp; copies: number; play: boolean }>) {
  return (
    <div className="dv-part dv-phone">
      <Slab
        className="dv-body"
        size={[196, 424]}
        thickness={16}
        radius={40}
        bezel={7}
        copies={copies}
      >
        <div className="dv-screen">
          <DeviceScreen app={app} play={play} />
        </div>
        <span className="dv-notch" />
      </Slab>
    </div>
  );
}

// A laptop, open: its keyboard lies on the ground and its screen stands
// tilted back from the keyboard's back edge.
function Laptop({
  app,
  copies,
  play,
}: Readonly<{ app: RoadApp; copies: number; play: boolean }>) {
  return (
    <div className="dv-part dv-laptop">
      <div className="dv-hinge">
        <Slab
          className="dv-lid"
          size={[540, 336]}
          thickness={9}
          radius={16}
          bezel={10}
          copies={copies}
        >
          <div className="dv-screen">
            <DeviceScreen app={app} play={play} />
          </div>
          <span className="dv-cam" />
        </Slab>
      </div>
      <Slab
        className="dv-deck"
        size={[540, 300]}
        thickness={11}
        radius={18}
        copies={copies}
      >
        <span className="dv-keys" />
        <span className="dv-pad" />
      </Slab>
    </div>
  );
}

// A desktop monitor on its stand.
function Monitor({
  app,
  copies,
  play,
}: Readonly<{ app: RoadApp; copies: number; play: boolean }>) {
  return (
    <div className="dv-part dv-monitor">
      <Slab
        className="dv-foot"
        size={[230, 140]}
        thickness={8}
        radius={70}
        copies={copies}
      />
      <Slab
        className="dv-neck"
        size={[46, 104]}
        thickness={14}
        radius={8}
        copies={copies}
      />
      <Slab
        className="dv-head"
        size={[640, 340]}
        thickness={14}
        radius={16}
        bezel={9}
        copies={copies}
      >
        <div className="dv-screen">
          <DeviceScreen app={app} play={play} />
        </div>
        <span className="dv-cam" />
      </Slab>
    </div>
  );
}

/** The product's device, with the shadow it casts on the ground. */
export function Device({
  app,
  small,
  play = false,
}: Readonly<{ app: RoadApp; small: boolean; play?: boolean }>) {
  const kind = DEVICE_OF[app];
  const copies = small ? COPIES_SMALL : COPIES;
  return (
    <div className="dv" data-kind={kind}>
      <span className="dv-shadow" />
      <div className="dv-rise">
        <div className="dv-float">
          {kind === "phone" ? (
            <Phone app={app} copies={copies} play={play} />
          ) : null}
          {kind === "laptop" ? (
            <Laptop app={app} copies={copies} play={play} />
          ) : null}
          {kind === "monitor" ? (
            <Monitor app={app} copies={copies} play={play} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
