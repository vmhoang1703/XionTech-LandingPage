import type { NextConfig } from "next";

import { getSanityConfig } from "./src/lib/sanity/config";

// Stops build, dev and start with the missing variable's name.
getSanityConfig();

const nextConfig: NextConfig = {/* config options here */};

export default nextConfig;
