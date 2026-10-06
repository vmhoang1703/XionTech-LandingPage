import type { Metadata } from "next";
import {
  Unbounded,
  Lexend_Exa,
  Be_Vietnam_Pro,
  JetBrains_Mono,
} from "next/font/google";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

// Story 7.4: `subsets` only picks what is preloaded; the Vietnamese files
// still load when a page needs them. Preloading every subset (19 files)
// delayed the first paint, so only the Latin files of the heading font are
// preloaded (its late swap moved the layout); the others load on use.
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const lexendExa = Lexend_Exa({
  variable: "--font-lexend-exa",
  preload: false,
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  preload: false,
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  preload: false,
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
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
      </body>
    </html>
  );
}
