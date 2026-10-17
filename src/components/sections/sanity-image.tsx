"use client";

import Image, { type ImageProps } from "next/image";
import { sanityImageLoader } from "@/lib/sanity/image-loader";

type SanityImageProps = Omit<ImageProps, "loader" | "unoptimized"> & {
  src: string;
};

// next/image for a Sanity CDN URL: a srcset of Sanity-resized widths, so a
// phone downloads a phone-sized file. A client component because the loader is
// a function, which a Server Component cannot pass to next/image.
export function SanityImage({ alt, ...props }: Readonly<SanityImageProps>) {
  return <Image alt={alt} loader={sanityImageLoader} {...props} />;
}
