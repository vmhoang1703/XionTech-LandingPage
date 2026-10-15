// A tree beside the road, drawn in SVG units with its foot at (0, 0) and lit
// from the top left: a soft shadow on the ground, a trunk, then a canopy built
// in layers (shade, body, light) so its outline is irregular. Five kinds, so a
// grove reads as trees and not as map pins: a round deciduous tree, a pine, a
// tall poplar, a blossom tree with a few amber flowers and a slim birch with a
// pale trunk. Decoration only (the SVG holding it is aria-hidden).
export type TreeKind = "round" | "pine" | "poplar" | "blossom" | "birch";

type Lobe = readonly [cx: number, cy: number, r: number];

// The round canopy: shade lobes (the whole outline), body lobes up and to the
// left of them, and the light where the sun falls.
const ROUND_SHADE: readonly Lobe[] = [
  [-13, -24, 11],
  [12, -24, 12],
  [0, -21, 12],
  [-8, -37, 13],
  [9, -38, 12],
  [0, -47, 11],
];
const ROUND_BODY: readonly Lobe[] = [
  [-14, -27, 9],
  [8, -27, 9],
  [-2, -26, 10],
  [-9, -39, 11],
  [6, -40, 10],
  [-2, -48, 9],
];
const ROUND_LIGHT: readonly Lobe[] = [
  [-11, -43, 5],
  [-4, -50, 4],
  [-15, -31, 3.5],
];

// The birch: a small, airy crown of loose lobes high on a slim trunk.
const BIRCH_SHADE: readonly Lobe[] = [
  [-8, -40, 8],
  [7, -42, 8],
  [0, -52, 9],
  [-3, -33, 6],
  [9, -32, 5],
];
const BIRCH_BODY: readonly Lobe[] = [
  [-9, -43, 6.5],
  [4, -45, 6.5],
  [-2, -54, 7],
  [-5, -35, 4.5],
];
const BIRCH_LIGHT: readonly Lobe[] = [
  [-8, -49, 3],
  [-3, -58, 2.5],
];

// The poplar: one tall, narrow flame of a crown, shaded on its right.
const POPLAR_SHADE =
  "M0 -88 C 9 -74, 12 -44, 9 -18 C 6 -10, -6 -10, -9 -18 C -12 -44, -9 -74, 0 -88 Z";
const POPLAR_BODY =
  "M-1 -86 C 5 -72, 6 -46, 3 -20 C 0 -14, -6 -14, -8 -20 C -11 -44, -8 -72, -1 -86 Z";
const POPLAR_LIGHT =
  "M-3 -78 C -1 -66, -2 -52, -4 -40 C -7 -50, -7 -66, -3 -78 Z";

// The pine: three tiers, each with a ragged hem; the right of each tier is in
// shade.
const PINE_TIERS = [
  "M0 -62 L-9 -47 L-5 -48 L-13 -36 L-4 -38 L0 -36 L4 -38 L13 -36 L5 -48 L9 -47 Z",
  "M0 -50 L-13 -32 L-7 -33 L-17 -20 L-6 -22 L0 -20 L6 -22 L17 -20 L7 -33 L13 -32 Z",
  "M0 -36 L-17 -14 L-9 -15 L-20 -4 L-7 -6 L0 -4 L7 -6 L20 -4 L9 -15 L17 -14 Z",
];
const PINE_SHADE = [
  "M0 -62 L9 -47 L5 -48 L13 -36 L4 -38 L0 -36 Z",
  "M0 -50 L13 -32 L7 -33 L17 -20 L6 -22 L0 -20 Z",
  "M0 -36 L17 -14 L9 -15 L20 -4 L7 -6 L0 -4 Z",
];

const BLOSSOMS: readonly Lobe[] = [
  [-12, -40, 2.4],
  [5, -45, 2.2],
  [-3, -31, 2.4],
  [11, -32, 2],
  [-16, -27, 1.8],
];

// The ground shadow's half width: about as wide as the crown.
const SHADOW: Readonly<Record<TreeKind, number>> = {
  round: 20,
  pine: 20,
  poplar: 12,
  blossom: 20,
  birch: 14,
};

function Lobes({
  lobes,
  className,
}: Readonly<{ lobes: readonly Lobe[]; className: string }>) {
  return (
    <g className={className}>
      {lobes.map(([cx, cy, r]) => (
        <circle key={`${cx} ${cy}`} cx={cx} cy={cy} r={r} />
      ))}
    </g>
  );
}

function Trunk({ height }: Readonly<{ height: number }>) {
  // Wider at the foot, with a darker right side.
  return (
    <>
      <path
        className="rm-tree-trunk"
        d={`M-5 0 L-3.5 ${-height} L3.5 ${-height} L5 0 Z`}
      />
      <path
        className="rm-tree-trunk-shade"
        d={`M1 0 L1 ${-height} L3.5 ${-height} L5 0 Z`}
      />
    </>
  );
}

function Crown({ kind }: Readonly<{ kind: TreeKind }>) {
  if (kind === "pine") {
    return (
      <>
        <Trunk height={8} />
        {PINE_TIERS.map((d, i) => (
          <g key={d}>
            <path className="rm-tree-pine" d={d} />
            <path className="rm-tree-pine-shade" d={PINE_SHADE[i]} />
          </g>
        ))}
        <path className="rm-tree-light" d="M0 -60 L-6 -50 L-2 -51 Z" />
      </>
    );
  }
  if (kind === "poplar") {
    return (
      <>
        <Trunk height={14} />
        <path className="rm-tree-shade" d={POPLAR_SHADE} />
        <path className="rm-tree-body" d={POPLAR_BODY} />
        <path className="rm-tree-light" d={POPLAR_LIGHT} />
      </>
    );
  }
  if (kind === "birch") {
    return (
      <>
        {/* A slim pale trunk with dark bark marks and two thin branches. */}
        <path className="rm-tree-bark" d="M-2 0 L-1.4 -46 L1.4 -46 L2 0 Z" />
        <path className="rm-tree-branch" d="M0 -30 L-7 -38 M0 -36 L6 -44" />
        <path
          className="rm-tree-bark-mark"
          d="M-2 -7 h2.5 v1.2 h-2.5 Z M0 -15 h2 v1 h-2 Z M-1.8 -23 h2 v1 h-2 Z"
        />
        <Lobes lobes={BIRCH_SHADE} className="rm-tree-shade" />
        <Lobes lobes={BIRCH_BODY} className="rm-tree-body" />
        <Lobes lobes={BIRCH_LIGHT} className="rm-tree-light" />
      </>
    );
  }
  return (
    <>
      <Trunk height={16} />
      <Lobes lobes={ROUND_SHADE} className="rm-tree-shade" />
      <Lobes lobes={ROUND_BODY} className="rm-tree-body" />
      <Lobes lobes={ROUND_LIGHT} className="rm-tree-light" />
      {kind === "blossom" ? (
        <Lobes lobes={BLOSSOMS} className="rm-tree-blossom" />
      ) : null}
    </>
  );
}

export function RoadTree({
  x,
  y,
  size = 1,
  kind = "round",
}: Readonly<{ x: number; y: number; size?: number; kind?: TreeKind }>) {
  return (
    <g
      className="rm-tree"
      data-kind={kind}
      transform={`translate(${x} ${y}) scale(${size * 1.15})`}
    >
      <ellipse
        className="rm-tree-shadow"
        cx="7"
        cy="1"
        rx={SHADOW[kind]}
        ry="5"
      />
      <g className="rm-tree-sway">
        <Crown kind={kind} />
      </g>
    </g>
  );
}
