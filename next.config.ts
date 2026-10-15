import type { NextConfig } from "next";

import { getSanityConfig } from "./src/lib/sanity/config";

// Stops build, dev and start with the missing variable's name.
getSanityConfig();

const nextConfig: NextConfig = {
  // Every page sits under [locale], so unmatched URLs need a global 404.
  experimental: { globalNotFound: true },
  // The /demo page is gone (website copy v3): old links land on Home's
  // contact section, in the link's language when it has one.
  async redirects() {
    return [
      { source: "/demo", destination: "/#contact", permanent: false },
      {
        source: "/:locale(en|vi|ja|fr|ko|zh)/demo",
        destination: "/:locale#contact",
        permanent: false,
      },
    ];
  },
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
