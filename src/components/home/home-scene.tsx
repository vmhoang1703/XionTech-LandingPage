"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { readMotionPaused } from "@/lib/motion/motion-preference";

// The tones from the top of the story down (globals.css, "Home scene").
// Contact, last, warms the end with its own background.
const TONES = ["paper", "blue", "mist"] as const;

type Tone = (typeof TONES)[number];

// Where a tone starts: an empty block between two sections.
export function SceneMark({ tone }: Readonly<{ tone: Tone }>) {
  return <div data-tone={tone} />;
}

// The tone at a line across the screen: the last mark above it, or the first.
function toneAt(marks: readonly HTMLElement[], line: number): Tone {
  let tone: Tone = TONES[0];
  for (const mark of marks) {
    if (mark.getBoundingClientRect().top <= line) {
      tone = mark.dataset.tone as Tone;
    }
  }
  return tone;
}

// One background for Home below the hero: a layer that stays on screen and
// shows the tone of the part of the story at the middle of the screen, fading
// from one tone to the next. Until it runs (server HTML, no JavaScript),
// under reduced motion and after a saved Pause, the sections keep their own
// still backgrounds.
export function HomeScene({ children }: Readonly<{ children: ReactNode }>) {
  const ref = useRef<HTMLDivElement>(null);
  const [tone, setTone] = useState<Tone | null>(null);

  useEffect(() => {
    const scene = ref.current;
    if (
      !scene ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      readMotionPaused()
    ) {
      return;
    }
    const marks = Array.from(
      scene.querySelectorAll<HTMLElement>("[data-tone]"),
    );
    const update = () => setTone(toneAt(marks, window.innerHeight / 2));
    // A mark crossing the middle of the screen (the lower edge of the top
    // half) changes the tone.
    const observer = new IntersectionObserver(update, {
      rootMargin: "0px 0px -50% 0px",
    });
    for (const mark of marks) observer.observe(mark);
    update();
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="home-scene" data-scene={tone ?? undefined}>
      <div className="scene-bg" aria-hidden="true">
        {TONES.map((name) => (
          <span key={name} className={`scene-tone scene-${name}`} />
        ))}
        <span className="scene-glow scene-glow-amber" />
        <span className="scene-glow scene-glow-blue" />
      </div>
      {children}
    </div>
  );
}
