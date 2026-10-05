import type { NextConfig } from "next";

import { getSanityConfig } from "./src/lib/sanity/config";

// Stops build, dev and start with the missing variable's name.
getSanityConfig();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/1khn3hf4/**",
      },
    ],
  },
};

export default nextConfig;
