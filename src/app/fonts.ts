// Brand fonts, shared by the locale layout and the global 404 page.
//
// `subsets` only picks the files that are preloaded: next/font still writes
// the @font-face rules for every subset Google serves (each with its own
// unicode-range), so a Vietnamese page fetches the Vietnamese files when its
// text needs them. Preloading Latin only keeps the first screen to four font
// files instead of fourteen (mobile speed pass, 2026-10-17).
import {
  Unbounded,
  Lexend_Exa,
  Be_Vietnam_Pro,
  JetBrains_Mono,
} from "next/font/google";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const lexendExa = Lexend_Exa({
  variable: "--font-lexend-exa",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  // Logo-style labels only, never the hero text: load on use, not preload.
  preload: false,
});

// No italic: nothing on the site sets italic body text.
const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  // Small code-style labels below the fold: load on use, not preload.
  preload: false,
});

export const fontVariables = `${unbounded.variable} ${lexendExa.variable} ${beVietnamPro.variable} ${jetbrainsMono.variable}`;
