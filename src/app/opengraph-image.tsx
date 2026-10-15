import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "XionTech: Build smarter. Ship faster. Get IT done.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY = "#163663";

// The default share image: the logo (navy marks drawn white) and the tagline on navy.
export default async function OpengraphImage() {
  const svg = await readFile(
    join(process.cwd(), "public/brand/xiontech-logo.svg"),
    "utf8",
  );
  const logo = `data:image/svg+xml;base64,${Buffer.from(
    svg.replaceAll(NAVY, "#FFFFFF"),
  ).toString("base64")}`;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 56,
        background: NAVY,
        color: "#FFFFFF",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse needs <img> */}
      <img src={logo} width={780} height={145} alt="" />
      <div style={{ display: "flex", fontSize: 52, fontWeight: 600 }}>
        Build smarter. Ship faster.&nbsp;
        <span style={{ color: "#FFC000" }}>Get IT done.</span>
      </div>
    </div>,
    size,
  );
}
