export const product = {
  name: "product",
  title: "Product",
  type: "document",
  description:
    "One fixed document per product (its id names the app). The clip is stored only; no page shows it yet.",
  fields: [
    {
      name: "clip",
      title: "Clip",
      type: "file",
      description: "A short product video in MP4 format.",
      options: { accept: "video/mp4" },
    },
  ],
};
