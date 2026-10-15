"use client";

import {
  useId,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { readMotionPaused } from "@/lib/motion/motion-preference";
import { H, POINTS, ROAD, W } from "../journey/road-geometry";
import type { RoadApp } from "@/content/products";
import { Device } from "./devices";
import "./product-scene.css";

// The stop's scene, behind the stop dialog (lead, 2026-10-14): the product's
// device (a phone, a laptop or a desktop monitor) stands on a piece of the
// road, and the camera settles at a distance where the whole device, its
// thickness and the road are in view. It is pure CSS 3D (devices.tsx). It is
// decoration (aria-hidden); the dialog holds the real text. Only this file's
// chunk and stylesheet carry the 3D, and they load on the first click on a
// stop.
//
// The camera move, the rise of the device and the road's slide between stops
// are CSS (transform and opacity only) and play only with `data-play="on"`.
// Reduced motion and a saved Pause leave the scene still, at its final view,
// with no move and no pointer look-around.

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
// Narrow or short screens draw each device with fewer layers.
const SMALL_SCREEN = "(width < 700px), (height < 500px)";

// The view turns with the pointer: this far at the window's edge, and with a
// drag (touch, pen, or a pressed mouse) this much per pixel. A press that
// moves less than TAP_PX is a tap, not a drag.
const HOVER_YAW = 9;
const HOVER_PITCH = 4;
const DRAG_YAW = 0.22;
const DRAG_PITCH = 0.14;
const MAX_YAW = 34;
const MAX_PITCH = 10;
const TAP_PX = 8;

// Two decimals are far finer than a turn of the view shows.
function degrees(value: number) {
  return `${Math.round(value * 100) / 100}deg`;
}

function clamp(value: number, limit: number) {
  return Math.max(-limit, Math.min(limit, value));
}

// The ground around the road's drawing (W by H), in design pixels.
const GROUND = { left: 700, top: 800, width: W + 1400, height: H + 800 };

type Press = Readonly<{ x: number; y: number; yaw: number; pitch: number }>;

export function ProductScene({
  index,
  app,
}: Readonly<{ index: number; app: RoadApp }>) {
  // Decided once, as the scene opens: it is built on the first click, never
  // on the server.
  const [play] = useState(
    () => !matchMedia(REDUCED_MOTION).matches && !readMotionPaused(),
  );
  const [small] = useState(() => matchMedia(SMALL_SCREEN).matches);

  const view = useRef({ yaw: 0, pitch: 0 });
  const press = useRef<Press | null>(null);
  const dragged = useRef(false);

  const turn = (root: HTMLElement, yaw: number, pitch: number) => {
    view.current = { yaw, pitch };
    root.style.setProperty("--yaw", degrees(yaw));
    root.style.setProperty("--pitch", degrees(pitch));
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!play) return;
    press.current = {
      x: event.clientX,
      y: event.clientY,
      ...view.current,
    };
    dragged.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!play) return;
    const { clientX, clientY, currentTarget } = event;
    const from = press.current;
    if (from) {
      const dx = clientX - from.x;
      const dy = clientY - from.y;
      if (Math.hypot(dx, dy) > TAP_PX) dragged.current = true;
      turn(
        currentTarget,
        clamp(from.yaw + dx * DRAG_YAW, MAX_YAW),
        clamp(from.pitch - dy * DRAG_PITCH, MAX_PITCH),
      );
    } else if (event.pointerType !== "touch") {
      turn(
        currentTarget,
        (0.5 - clientX / innerWidth) * 2 * HOVER_YAW,
        (clientY / innerHeight - 0.5) * 2 * HOVER_PITCH,
      );
    }
  };

  // A finger lifted: the view settles back. A mouse or pen keeps its look.
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!press.current) return;
    press.current = null;
    if (event.pointerType === "touch") turn(event.currentTarget, 0, 0);
  };

  // The click that ends a drag is not a click on the backdrop: it must not
  // reach the dialog, which closes on one.
  const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!dragged.current) return;
    dragged.current = false;
    event.stopPropagation();
  };

  return (
    <div
      className="rd-scene"
      aria-hidden="true"
      data-play={play ? "on" : "off"}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={onClickCapture}
    >
      <div className="rd-frame">
        <div className="rd-fit">
          <div className="rd-persp">
            <div className="rd-orbit">
              <div className="rd-sway">
                <div className="rd-world">
                  <Ground index={index} />
                  <div className="rd-city" key={index}>
                    <Device app={app} small={small} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// The road laid flat on the ground, with a pin per stop. The ground is slid so
// the stop being shown lies in front of the device (its --px and --py), and a
// move to the next stop slides it along the road.
function Ground({ index }: Readonly<{ index: number }>) {
  const grid = useId();
  return (
    <div
      className="rd-ground"
      style={
        { "--px": POINTS[index].x, "--py": POINTS[index].y } as CSSProperties
      }
    >
      <svg
        className="rd-plane"
        viewBox={`${-GROUND.left} ${-GROUND.top} ${GROUND.width} ${GROUND.height}`}
        width={GROUND.width}
        height={GROUND.height}
        style={{ left: -GROUND.left, top: -GROUND.top }}
        focusable="false"
      >
        <defs>
          <pattern
            id={grid}
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path className="rd-grid" d="M 100 0 L 0 0 0 100" />
          </pattern>
        </defs>
        <rect
          className="rd-lawn"
          x={-GROUND.left}
          y={-GROUND.top}
          width={GROUND.width}
          height={GROUND.height}
        />
        <rect
          x={-GROUND.left}
          y={-GROUND.top}
          width={GROUND.width}
          height={GROUND.height}
          fill={`url(#${grid})`}
        />
        <path className="rd-edge" d={ROAD} />
        <path className="rd-asphalt" d={ROAD} />
        <path className="rd-line" d={ROAD} />
        {POINTS.map((point, i) => (
          <g
            key={`${point.x}-${point.y}`}
            className="rd-pin"
            data-on={i === index ? "true" : undefined}
            transform={`translate(${point.x} ${point.y})`}
          >
            <circle className="rd-pin-halo" r="46" />
            <circle className="rd-pin-dot" r="30" />
            <text className="rd-pin-no" y="9" textAnchor="middle">
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
