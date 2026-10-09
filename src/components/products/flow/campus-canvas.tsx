"use client";

import { PauseIcon, PlayIcon } from "@phosphor-icons/react";
import { cubicBezier } from "motion";
import { useEffect, useRef, useState } from "react";
import type {
  Mesh,
  Object3D,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { audienceFlow, type FlowPlace } from "@/content/products";
import {
  readMotionPaused,
  saveMotionPaused,
} from "@/lib/motion/motion-preference";
import type * as Campus from "./campus-scene";

// Client island for the audience flow: the low-poly campus and its
// Pause/Play toggle. three.js loads only once the section nears the viewport.
// Until the scene is ready, and with no JavaScript, no WebGL or a lost
// context, the still SVG campus shows and the toggle is not rendered.

const TWEEN_MS = 900;
const easeBrand = cubicBezier(0.16, 1, 0.3, 1); // --ease-brand
const BEACON_LIFT = 2.4;
const MAX_PIXEL_RATIO = 2;

type Pose = { position: Vector3; lookAt: Vector3; beacon: Vector3 };

type Stage = {
  campus: typeof Campus;
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  beacon: Object3D;
  focus: (place: FlowPlace) => void;
  tick: (ms: number) => void;
  place: FlowPlace;
  start: number;
  from: Pose;
  to: Pose;
  pose: Pose;
};

function poseAt(campus: typeof Campus, place: FlowPlace): Pose {
  const { position, lookAt } = campus.placeTarget(place);
  const beacon = lookAt.clone();
  beacon.y += BEACON_LIFT;
  return { position, lookAt, beacon };
}

const clonePose = ({ position, lookAt, beacon }: Pose): Pose => ({
  position: position.clone(),
  lookAt: lookAt.clone(),
  beacon: beacon.clone(),
});

// Jump to the chapter's place with no tween.
function settle(stage: Stage, progress: number) {
  const { place } = stage.campus.chapterAt(progress);
  stage.place = place;
  stage.focus(place);
  stage.start = -Infinity;
  stage.to = poseAt(stage.campus, place);
  stage.pose = clonePose(stage.to);
}

// Each new target cancels the running tween: glide on from where we are.
function aim(stage: Stage, progress: number, now: number) {
  const { place } = stage.campus.chapterAt(progress);
  if (place === stage.place) return;
  stage.place = place;
  stage.focus(place);
  stage.start = now;
  stage.from = clonePose(stage.pose);
  stage.to = poseAt(stage.campus, place);
}

// Like lerpVectors, but lands exactly on `to` at t = 1 (no rounding error).
const ease = (out: Vector3, from: Vector3, to: Vector3, t: number) =>
  out
    .subVectors(from, to)
    .multiplyScalar(1 - t)
    .add(to);

function step(stage: Stage, now: number) {
  const t = easeBrand(Math.min(1, (now - stage.start) / TWEEN_MS));
  const { from, to, pose } = stage;
  ease(pose.position, from.position, to.position, t);
  ease(pose.lookAt, from.lookAt, to.lookAt, t);
  ease(pose.beacon, from.beacon, to.beacon, t);
}

// `pulse` is the time for the idle beacon bob; 0 draws it at rest.
function draw(stage: Stage, progress: number, pulse: number) {
  const { camera, beacon, pose, scene } = stage;
  camera.position.copy(pose.position);
  camera.lookAt(pose.lookAt);
  beacon.position.copy(pose.beacon);
  beacon.position.y += Math.sin(pulse / 400) * 0.15;
  beacon.rotation.y = pulse / 1000;
  scene.background = stage.campus.skyAt(progress);
  stage.renderer.render(scene, camera);
}

// Instanced meshes free their instance buffers and the key light its shadow
// map through the object's own dispose().
function dispose(stage: Stage) {
  stage.scene.traverse((object) => {
    object.dispose();
    const mesh = object as Partial<Mesh>;
    if (!mesh.isMesh) return;
    mesh.geometry?.dispose();
    for (const material of [mesh.material ?? []].flat()) material.dispose();
  });
  stage.renderer.dispose();
}

type Status = "waiting" | "ready" | "fallback";

export function CampusCanvas({ progress }: Readonly<{ progress: number }>) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<Stage | null>(null);
  const progressRef = useRef(progress);
  const [status, setStatus] = useState<Status>("waiting");
  const [paused, setPaused] = useState(true);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [resizes, setResizes] = useState(0);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    let unmounted = false;

    const resize = () => {
      const stage = stageRef.current;
      const { clientWidth: width, clientHeight: height } = canvas;
      if (!stage || !width || !height) return;
      stage.renderer.setSize(width, height, false);
      stage.camera.aspect = width / height;
      stage.camera.fov = stage.campus.viewFov(width / height);
      stage.camera.updateProjectionMatrix();
      setResizes((count) => count + 1);
    };

    const load = async () => {
      const context = canvas.getContext("webgl2");
      if (!context) {
        setStatus("fallback");
        return;
      }
      const [three, campus] = await Promise.all([
        import("three"),
        import("./campus-scene"),
      ]);
      if (unmounted) return;
      const { scene, beacon, focus, tick } = campus.buildCampus();
      const renderer = new three.WebGLRenderer({
        canvas,
        context,
        antialias: true,
      });
      renderer.setPixelRatio(Math.min(devicePixelRatio, MAX_PIXEL_RATIO));
      renderer.shadowMap.enabled = true;
      const camera = new three.PerspectiveCamera(
        campus.CAMERA_FOV,
        1,
        0.1,
        100,
      );
      const pose = poseAt(campus, "gate");
      const stage: Stage = {
        campus,
        renderer,
        scene,
        camera,
        beacon,
        focus,
        tick,
        place: "gate",
        start: -Infinity,
        from: pose,
        to: pose,
        pose,
      };
      settle(stage, progressRef.current);
      stageRef.current = stage;
      resize();
      setPaused(readMotionPaused());
      setStatus("ready");
    };

    const loader = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        loader.disconnect();
        load().catch((error: unknown) => {
          console.warn("CampusCanvas: the 3D campus could not start.", error);
          setStatus("fallback");
        });
      },
      { rootMargin: "50% 0px" },
    );
    loader.observe(host);
    const viewer = new IntersectionObserver((entries) =>
      setInView(entries[0].isIntersecting),
    );
    viewer.observe(host);
    const resizer = new ResizeObserver(resize);
    resizer.observe(canvas);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    const onContextLost = () => {
      console.warn(
        "CampusCanvas: WebGL context lost; showing the still campus.",
      );
      setStatus("fallback");
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    return () => {
      unmounted = true;
      loader.disconnect();
      viewer.disconnect();
      resizer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      if (stageRef.current) dispose(stageRef.current);
      stageRef.current = null;
    };
  }, []);

  const showing = status === "ready" && inView && pageVisible;
  const running = showing && !paused;
  const still = showing && paused;

  useEffect(() => {
    const stage = stageRef.current;
    if (!running || !stage) return;
    let frame = 0;
    // The details' own clock counts only running time, so after a pause
    // they carry on from where they stopped.
    let last: number | undefined;
    const loop = (now: number) => {
      stage.tick(last === undefined ? 0 : now - last);
      last = now;
      const progressNow = progressRef.current;
      aim(stage, progressNow, now);
      step(stage, now);
      draw(stage, progressNow, now);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  // Paused or reduced motion: one still frame per chapter, no tween.
  useEffect(() => {
    const stage = stageRef.current;
    if (!still || !stage) return;
    settle(stage, progress);
    draw(stage, progress, 0);
  }, [still, progress, resizes]);

  const ready = status === "ready";
  const { pause, play } = audienceFlow.motion;

  return (
    <div
      ref={hostRef}
      className="flow-canvas"
      data-paused={ready && paused ? "true" : undefined}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        hidden={!ready}
        className="flow-scene"
      />
      {ready ? (
        <button
          type="button"
          className="flow-toggle"
          onClick={() => {
            saveMotionPaused(!paused);
            setPaused(!paused);
          }}
        >
          {paused ? (
            <PlayIcon aria-hidden="true" weight="fill" />
          ) : (
            <PauseIcon aria-hidden="true" weight="fill" />
          )}
          <span>{paused ? play : pause}</span>
        </button>
      ) : (
        <CampusSketch />
      )}
    </div>
  );
}

// The still campus: gate in front, staff room and classroom either side, the
// hall with its rooftop and plant room behind, the beacon over the gate.
function CampusSketch() {
  return (
    <svg
      className="flow-fallback"
      viewBox="0 0 400 300"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="400" height="300" fill="var(--color-ice)" />
      <rect y="210" width="400" height="90" fill="var(--color-mist)" />
      <polygon
        points="190,300 210,300 204,210 196,210"
        fill="var(--color-paper)"
      />
      <g stroke="var(--color-navy)" strokeWidth="2" strokeLinejoin="round">
        <rect
          x="150"
          y="120"
          width="100"
          height="90"
          fill="var(--color-paper)"
        />
        <rect x="160" y="100" width="40" height="20" fill="var(--color-navy)" />
        <rect
          x="215"
          y="94"
          width="20"
          height="26"
          rx="4"
          fill="var(--color-navy-2)"
        />
        <rect x="40" y="160" width="70" height="50" fill="var(--color-paper)" />
        <polygon points="32,160 75,130 118,160" fill="var(--color-navy-2)" />
        <rect
          x="280"
          y="155"
          width="90"
          height="55"
          fill="var(--color-paper)"
        />
        <polygon points="272,155 325,122 378,155" fill="var(--color-navy-2)" />
      </g>
      <g fill="var(--color-navy)">
        <rect x="172" y="236" width="8" height="48" />
        <rect x="220" y="236" width="8" height="48" />
        <rect x="168" y="230" width="64" height="8" />
      </g>
      <polygon
        points="200,198 210,210 200,222 190,210"
        fill="var(--color-amber)"
      />
    </svg>
  );
}
