// Where each word of a stop's scene stands and how big its letters are. All
// sizes are in design pixels: the scene is drawn on a fixed stage that CSS
// scales to the window, a wide stage and a tall one (product-scene.css).

export type Fit = Readonly<{
  /** Font size of the letters. */
  size: number;
  /** How far the letters are stretched up, so the word stands as towers. */
  stretch: number;
  /** Where the word's centre stands: across, and back from the road. */
  x: number;
  z: number;
}>;

export type WordFit = Readonly<{ wide: Fit; narrow: Fit }>;

// What a capital takes of its font size: Unbounded is a wide face. A space is
// narrower than a letter.
const ADVANCE = 0.85;
const SPACE = 0.45;
// The height of a capital, as a share of the font size.
const CAP = 0.75;
// The largest letters, so a short name (IoT) does not tower over its stop.
const MAX_SIZE = 130;
// The gap between two words standing in one row, in letters.
const GAP = 1.4;

// One word on its own: the room for it and how tall its towers stand.
const ALONE = {
  wide: { room: 820, height: 230 },
  narrow: { room: 660, height: 320 },
};
// The four apps. On the wide stage they stand in two rows of two, a low front
// row and a tall back row, so no name hides behind another. On the tall stage
// they stand in a column, each row taller than the one in front; the short
// IoT stands left, so it does not hide AI Tutor behind it.
const ROWS = { room: 860, front: 92, back: 190, depth: 260 };
const COLUMN = {
  room: 640,
  first: 80,
  rise: 70,
  depth: 170,
  across: [0, 0, -230, 90],
};

/** The width of a word in em: its letters, then its spaces. */
export function advance(text: string): number {
  const spaces = text.split(" ").length - 1;
  return (text.length - spaces) * ADVANCE + spaces * SPACE;
}

function fit(size: number, height: number, x: number, z: number): Fit {
  return { size, stretch: height / (size * CAP), x, z };
}

// A row of two words, side by side: each word's centre, from the row's centre.
function pair(a: number, b: number, size: number) {
  const total = (a + b + GAP) * size;
  return [(a * size - total) / 2, (total - b * size) / 2] as const;
}

/** The fit of each word, in the order given (one word, or the four apps). */
export function fitWords(words: readonly string[]): WordFit[] {
  if (words.length === 1) {
    const [text] = words;
    const size = (room: number) => Math.min(MAX_SIZE, room / advance(text));
    return [
      {
        wide: fit(size(ALONE.wide.room), ALONE.wide.height, 0, 0),
        narrow: fit(size(ALONE.narrow.room), ALONE.narrow.height, 0, 0),
      },
    ];
  }
  const wide = words.map(advance);
  const front = wide[0] + wide[1] + GAP;
  const back = wide[2] + wide[3] + GAP;
  const rowSize = Math.min(MAX_SIZE, ROWS.room / Math.max(front, back));
  const [fl, fr] = pair(wide[0], wide[1], rowSize);
  const [bl, br] = pair(wide[2], wide[3], rowSize);
  const spots = [
    [fl, ROWS.front, 0],
    [fr, ROWS.front, 0],
    [bl, ROWS.back, -ROWS.depth],
    [br, ROWS.back, -ROWS.depth],
  ] as const;
  const columnSize = Math.min(MAX_SIZE, COLUMN.room / Math.max(...wide));
  return words.map((_, i) => ({
    wide: fit(rowSize, spots[i][1], spots[i][0], spots[i][2]),
    narrow: fit(
      columnSize,
      COLUMN.first + i * COLUMN.rise,
      COLUMN.across[i],
      -i * COLUMN.depth,
    ),
  }));
}
