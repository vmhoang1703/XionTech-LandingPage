"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { readMotionPaused } from "@/lib/motion/motion-preference";

type MountainStoryProps = {
  title: { lead: string; middle: string; highlight: string; tail: string };
  paragraphs: readonly string[];
  tagName: string;
};

// The climb path up the picture, in % of its width and height (Amber's
// prototype, site.js "About: the mountain story").
const PATH: readonly (readonly [number, number])[] = [
  [20, 69.5],
  [28, 65.5],
  [38.7, 54.2],
  [43.3, 47],
  [47.3, 45],
  [53.3, 35.5],
  [52.8, 30],
  [55.5, 25],
  [58.4, 19.4],
];
// Website copy v3: the climb plays by itself, once, when
// the story is 40% in view: foot to summit in CLIMB_MS. The brand tag shows
// from halfway up.
export const CLIMB_MS = 3400;
export const IN_VIEW = 0.4;
const LATE_AT = 0.5;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

/** The point of the climb at progress `p` (0 to 1), in % of the picture. */
export function climbPoint(p: number): [number, number] {
  const f = clamp(p) * (PATH.length - 1);
  const j = Math.min(PATH.length - 2, Math.floor(f));
  const q = f - j;
  return [
    PATH[j][0] + (PATH[j + 1][0] - PATH[j][0]) * q,
    PATH[j][1] + (PATH[j + 1][1] - PATH[j][1]) * q,
  ];
}

/** Whether enough of the story is on screen to start the climb. */
export function inView(entry: IntersectionObserverEntry): boolean {
  if (!entry.isIntersecting) return false;
  return (
    entry.intersectionRatio >= IN_VIEW ||
    entry.intersectionRect.height >= innerHeight * IN_VIEW
  );
}

// About "Inspired by a mountain" (lead, 2026-10-13: Amber's prototype,
// ENH-030; website copy v3: one consolidated story, no scroll hold;
// the climb plays once by itself when the story comes into view). The climb
// goes from the foot to the summit:
// a light walks the path, the colour rises behind it and the X mark lights on
// the summit. It moves only with transform and opacity: the colour rises in a
// window that slides up while the picture inside slides down by the same
// amount. With no script the mountain is in full colour; reduced motion or a
// saved Pause show the summit at once.
export function MountainStory({
  title,
  paragraphs,
  tagName,
}: Readonly<MountainStoryProps>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const mtn = ref.current;
    const art = mtn?.querySelector<HTMLElement>(".mtn-art");
    const rise = mtn?.querySelector<HTMLElement>(".mtn-rise");
    const colour = mtn?.querySelector<HTMLElement>(".mtn-color");
    const beacon = mtn?.querySelector<HTMLElement>(".mtn-beacon");
    if (!mtn || !art || !rise || !colour || !beacon) return;
    // No observer (old browsers, tests without one): the summit, at once.
    const canWatch = typeof IntersectionObserver !== "undefined";
    const still =
      !canWatch ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      readMotionPaused();
    let box = art.getBoundingClientRect();
    let p = 0;
    let frame = 0;
    let played = false;

    const draw = (value: number) => {
      p = clamp(value);
      // The window holds the colour picture: it slides up from below the
      // foot as p grows, and the picture slides down as much, so it stays.
      const shift = (1 - p) * rise.offsetHeight;
      rise.style.transform = `translateY(${shift}px)`;
      colour.style.transform = `translateY(${-shift}px)`;
      const [x, y] = climbPoint(p);
      beacon.style.transform = `translate(${(x / 100) * box.width}px, ${(y / 100) * box.height}px) translate(-50%, -50%)`;
      mtn.toggleAttribute("data-top", p > 0.985);
      mtn.toggleAttribute("data-late", p >= LATE_AT);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const climb = () => {
      played = true;
      observer?.disconnect();
      if (still) {
        draw(1);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / CLIMB_MS);
        draw(easeInOut(t));
        frame = t < 1 ? requestAnimationFrame(tick) : 0;
      };
      frame = requestAnimationFrame(tick);
    };
    const observer = canWatch
      ? new IntersectionObserver(
          (entries) => {
            if (!played && entries.some(inView)) climb();
          },
          { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5] },
        )
      : null;
    const onResize = () => {
      box = art.getBoundingClientRect();
      draw(p);
    };
    const onHide = () => {
      if (document.hidden && frame) {
        stop();
        draw(1);
      }
    };

    // The light only makes sense with a script: it carries [hidden] until now.
    beacon.hidden = false;
    mtn.setAttribute("data-armed", "");
    box = art.getBoundingClientRect();
    if (still) draw(1);
    else draw(0);
    observer?.observe(mtn);
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onHide);
    return () => {
      stop();
      observer?.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onHide);
      mtn.removeAttribute("data-armed");
      beacon.hidden = true;
    };
  }, []);

  return (
    <section
      ref={ref}
      id="story"
      className="mtn surface-paper"
      aria-labelledby="about-story-h"
    >
      {/* Round 11: the heading and story rise in with the shared reveal. */}
      <div className="mtn-pin" data-reveal="">
        <div className="wrap">
          <h2 id="about-story-h" className="mtn-h">
            {title.lead}
            <br />
            {title.middle}
            <span className="hl">{title.highlight}</span>
            {title.tail}
          </h2>
          <div className="mtn-grid">
            <div className="mtn-story">
              <div className="mtn-chs">
                <article className="mtn-ch" data-on="">
                  {paragraphs.map((text) => (
                    <p key={text} className="mtn-text">
                      {text}
                    </p>
                  ))}
                </article>
              </div>
            </div>
            <div className="mtn-stage" aria-hidden="true">
              <div className="mtn-art">
                <Image
                  className="mtn-img mtn-glow"
                  src="/about/mountain-glow.webp"
                  width={1536}
                  height={1024}
                  alt=""
                  sizes="(width <= 800px) 90vw, 55vw"
                />
                <Image
                  className="mtn-img mtn-base"
                  src="/about/mountain-clear.webp"
                  width={1536}
                  height={1024}
                  alt=""
                  sizes="(width <= 800px) 90vw, 55vw"
                />
                <div className="mtn-rise">
                  <Image
                    className="mtn-img mtn-color"
                    src="/about/mountain-clear.webp"
                    width={1536}
                    height={1024}
                    alt=""
                    sizes="(width <= 800px) 90vw, 55vw"
                  />
                </div>
                <span className="mtn-beacon" hidden />
                <Image
                  className="mtn-summit mtn-summit-grey"
                  src="/brand/x-mark.webp"
                  width={160}
                  height={86}
                  alt=""
                />
                <Image
                  className="mtn-summit mtn-summit-lit"
                  src="/brand/x-mark.webp"
                  width={160}
                  height={86}
                  alt=""
                />
                <span className="mtn-tag">{tagName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
