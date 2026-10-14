// Brand fonts, shared by the locale layout and the global 404 page.
import {
  Unbounded,
  Lexend_Exa,
  Be_Vietnam_Pro,
  JetBrains_Mono,
} from "next/font/google";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const lexendExa = Lexend_Exa({
  variable: "--font-lexend-exa",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  display: "swap",
  // Logo-style labels only, never the hero text: load on use, not preload.
  preload: false,
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  display: "swap",
  // Small code-style labels below the fold: load on use, not preload.
  preload: false,
});

export const fontVariables = `${unbounded.variable} ${lexendExa.variable} ${beVietnamPro.variable} ${jetbrainsMono.variable}`;
