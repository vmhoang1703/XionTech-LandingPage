import type { NextConfig } from "next";

import { getSanityConfig } from "./src/lib/sanity/config";

// Stops build, dev and start with the missing variable's name.
getSanityConfig();

const nextConfig: NextConfig = {
  // Every page sits under [locale], so unmatched URLs need a global 404.
  experimental: { globalNotFound: true },
  // The careers page lists public/careers/life/ when it renders. A tag
  // revalidation re-renders it on the server, so the folder ships with that
  // route (public/ is not in the server bundle otherwise).
  outputFileTracingIncludes: {
    "/[locale]/careers": ["./public/careers/life/**/*"],
  },
  // The /demo page is gone (website copy v3): old links land on Home's
  // contact section, in the link's language when it has one. Permanent
  // (308) so search engines drop /demo.
  async redirects() {
    return [
      { source: "/demo", destination: "/#contact", permanent: true },
      {
        source: "/:locale(en|vi)/demo",
        destination: "/:locale#contact",
        permanent: true,
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
