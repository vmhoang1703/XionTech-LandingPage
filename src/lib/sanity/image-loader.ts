import type { ImageLoaderProps } from "next/image";

// Sanity's image CDN resizes and converts on its side (AVIF or WebP through
// auto=format), so next/image asks it for each width in the srcset instead of
// one fixed large file, without using the Vercel image optimization quota
// (docs/architecture.md, limits). fit=max never upscales a small original.
export const SANITY_QUALITY = 75;

export function sanityImageLoader({ src, width, quality }: ImageLoaderProps) {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? SANITY_QUALITY));
  url.searchParams.set("fit", "max");
  url.searchParams.set("auto", "format");
  return url.toString();
}
