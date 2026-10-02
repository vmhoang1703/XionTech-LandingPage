import { defineCliConfig } from "sanity/cli";

// Project ID and dataset are public values, not secrets.
export default defineCliConfig({
  api: { projectId: "1khn3hf4", dataset: "production" },
  studioHost: "xiontech-landing",
});
