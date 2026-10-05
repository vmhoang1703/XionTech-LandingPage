export const product = {
  name: "product",
  title: "Product",
  type: "document",
  description:
    "One document per product. The clip is stored only; no page shows it yet.",
  fields: [
    { name: "name", title: "Name", type: "string" },
    {
      name: "app",
      title: "App",
      type: "string",
      options: {
        list: [
          { title: "PXP", value: "PXP" },
          { title: "LXP", value: "LXP" },
          { title: "SXP", value: "SXP" },
          { title: "IoT", value: "IoT" },
        ],
      },
    },
    {
      name: "clip",
      title: "Clip",
      type: "file",
      description: "A short product video in MP4 format.",
      options: { accept: "video/mp4" },
    },
  ],
  preview: { select: { title: "name" } },
};
