import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";
import {
  singletonActions,
  singletonNewDocumentOptions,
  structure,
} from "./schemas/structure";

// Project ID and dataset are public values, not secrets.
export default defineConfig({
  name: "default",
  title: "XionTech Landing Page",
  projectId: "1khn3hf4",
  dataset: "production",
  plugins: [structureTool({ structure })],
  schema: { types: schemaTypes },
  document: {
    newDocumentOptions: singletonNewDocumentOptions,
    actions: singletonActions,
  },
});
