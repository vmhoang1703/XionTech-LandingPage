import type { Metadata } from "next";
import {
  Unbounded,
  Lexend_Exa,
  Be_Vietnam_Pro,
  JetBrains_Mono,
} from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ScrollReveal } from "@/components/sections/scroll-reveal";
import "./globals.css";

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

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
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

export const metadata: Metadata = {
  title: "XionTech",
  description:
    "IT services and product engineering: AI, cloud, custom apps and low-code solutions.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // globals.css sets smooth scroll for in-page links; this asks Next.js 16
      // to switch it off during route changes so they stay instant.
      data-scroll-behavior="smooth"
      className={`${unbounded.variable} ${lexendExa.variable} ${beVietnamPro.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex flex-1 flex-col">
          {children}
        </main>
        <SiteFooter />
        <ScrollReveal />
      </body>
    </html>
  );
}
