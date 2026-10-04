import { defineCliConfig } from "sanity/cli";

// Project ID and dataset are public values, not secrets.
export default defineCliConfig({
  api: { projectId: "1khn3hf4", dataset: "production" },
  studioHost: "xiontech-landing",
  // The deployed Studio's app id (public, not a secret); without it every
  // `sanity deploy` asks for it.
  deployment: { appId: "b9d2zk2qeaue8fu7bdxtiwsc" },
});
