"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { readMotionPaused } from "@/lib/motion/motion-preference";

type Chapter = { number: string; title: string; text: string };

type MountainStoryProps = {
  title: { lead: string; middle: string; highlight: string; tail: string };
  chapters: readonly Chapter[];
  closing: { line: string; tags: string };
  cue: string;
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
// The newXion tag shows from this chapter on.
const LATE = 1;

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

/**
 * The chapter that the held scroll is on: each takes an equal share of the
 * scroll while the story sticks. Not held (short screens, no sticky): the last
 * chapter whose title is above 60% of the screen.
 */
export function chapterAt(mtn: HTMLElement, pin: HTMLElement): number {
  const chapters = [...mtn.querySelectorAll<HTMLElement>(".mtn-ch")];
  const style = getComputedStyle(pin);
  if (style.position === "sticky") {
    const run = Math.max(1, mtn.offsetHeight - pin.offsetHeight);
    const progress =
      (Number.parseFloat(style.top) - mtn.getBoundingClientRect().top) / run;
    return Math.max(
      0,
      Math.min(chapters.length - 1, Math.floor(progress * chapters.length)),
    );
  }
  let at = 0;
  chapters.forEach((chapter, index) => {
    const top = chapter
      .querySelector(".mtn-title")
      ?.getBoundingClientRect().top;
    if (top !== undefined && top < innerHeight * 0.6) at = index;
  });
  return at;
}

// About "Inspired by a mountain" (lead, 2026-10-13: Amber's prototype,
// ENH-030). The story holds while the reader scrolls through its chapters;
// each chapter climbs the mountain: a light walks the path, the colour rises
// behind it and the X mark lights on the summit. It moves only with transform
// and opacity: the colour rises in a window that slides up while the picture
// inside slides down by the same amount. With no script both chapters show
// and the mountain is in full colour; reduced motion or a saved Pause jump
// straight to each chapter's place.
export function MountainStory({
  title,
  chapters,
  closing,
  cue,
  tagName,
}: Readonly<MountainStoryProps>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const mtn = ref.current;
    const pin = mtn?.querySelector<HTMLElement>(".mtn-pin");
    const art = mtn?.querySelector<HTMLElement>(".mtn-art");
    const rise = mtn?.querySelector<HTMLElement>(".mtn-rise");
    const colour = mtn?.querySelector<HTMLElement>(".mtn-color");
    const beacon = mtn?.querySelector<HTMLElement>(".mtn-beacon");
    const dots = mtn?.querySelector<HTMLElement>(".mtn-dots");
    if (!mtn || !pin || !art || !rise || !colour || !beacon || !dots) return;
    const parts = [...mtn.querySelectorAll<HTMLElement>(".mtn-ch")];
    const targets = parts.map((_, i) =>
      parts.length > 1 ? i / (parts.length - 1) : 0,
    );
    const still =
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      readMotionPaused();
    let box = art.getBoundingClientRect();
    let p = 0;
    let active = -1;
    let frame = 0;

    const draw = (value: number, chapter: number) => {
      p = clamp(value);
      // The window holds the colour picture: it slides up from below the
      // foot as p grows, and the picture slides down as much, so it stays.
      const shift = (1 - p) * rise.offsetHeight;
      rise.style.transform = `translateY(${shift}px)`;
      colour.style.transform = `translateY(${-shift}px)`;
      const [x, y] = climbPoint(p);
      beacon.style.transform = `translate(${(x / 100) * box.width}px, ${(y / 100) * box.height}px) translate(-50%, -50%)`;
      mtn.toggleAttribute("data-top", p > 0.985);
      if (chapter === active) return;
      active = chapter;
      mtn.toggleAttribute("data-late", chapter >= LATE);
      parts.forEach((part, i) =>
        part.toggleAttribute("data-on", i === chapter),
      );
      dots.style.setProperty("--i", String(chapter));
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const travel = (chapter: number) => {
      stop();
      const from = p;
      const to = targets[chapter];
      const distance = Math.abs(to - from);
      draw(from, chapter);
      if (still || distance < 0.001) {
        draw(to, chapter);
        return;
      }
      const start = performance.now();
      const duration = 1400 + distance * 3000;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        draw(from + (to - from) * easeInOut(t), chapter);
        frame = t < 1 ? requestAnimationFrame(tick) : 0;
      };
      frame = requestAnimationFrame(tick);
    };
    const settle = () => {
      stop();
      const chapter = chapterAt(mtn, pin);
      draw(targets[chapter], chapter);
    };
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const chapter = chapterAt(mtn, pin);
        if (chapter !== active) travel(chapter);
      });
    };
    const onResize = () => {
      box = art.getBoundingClientRect();
      settle();
    };
    const onHide = () => {
      if (document.hidden && active >= 0) {
        stop();
        draw(targets[active], active);
      }
    };

    mtn.setAttribute("data-armed", "");
    box = art.getBoundingClientRect();
    // Opened part-way down: show that chapter at once, no climb replay.
    settle();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onHide);
    return () => {
      stop();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onHide);
      mtn.removeAttribute("data-armed");
    };
  }, []);

  const last = chapters.length - 1;
  return (
    <section
      ref={ref}
      id="story"
      className="mtn surface-paper"
      aria-labelledby="about-story-h"
    >
      <div className="mtn-pin">
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
                {chapters.map(({ number, title: name, text }, i) => (
                  <article key={number} className="mtn-ch">
                    <h3 className="mtn-title">
                      <span className="mtn-num">{number}</span> {name}
                    </h3>
                    <p className="mtn-text">{text}</p>
                    {i === 0 && (
                      <p className="mtn-cue" aria-hidden="true">
                        {cue}
                      </p>
                    )}
                    {i === last && (
                      <div className="mtn-close">
                        <p>
                          <strong>{closing.line}</strong>
                        </p>
                        <p>{closing.tags}</p>
                      </div>
                    )}
                  </article>
                ))}
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
                <span className="mtn-beacon" />
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
              <div className="mtn-dots">
                {chapters.map(({ number }) => (
                  <span key={number} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
