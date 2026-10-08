import type { DocumentActionComponent, TemplateItem } from "sanity";
import type { StructureResolver } from "sanity/structure";

// Types that have fixed documents: editors open them, never create more.
export const singletonTypes = ["careersPhotos", "product"];

const products = [
  { title: "Parent Hub", id: "product-pxp" },
  { title: "Staff Hub", id: "product-sxp" },
  { title: "IoT", id: "product-iot" },
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Careers photos")
        .id("careersPhotos")
        .child(
          S.document().schemaType("careersPhotos").documentId("careersPhotos"),
        ),
      S.listItem()
        .title("Products")
        .id("products")
        .child(
          S.list()
            .title("Products")
            .items(
              products.map(({ title, id }) =>
                S.listItem()
                  .title(title)
                  .id(id)
                  .child(S.document().schemaType("product").documentId(id)),
              ),
            ),
        ),
      S.documentTypeListItem("post").title("News posts"),
      S.documentTypeListItem("job").title("Job openings"),
    ]);

export const singletonNewDocumentOptions = (
  templates: TemplateItem[],
): TemplateItem[] =>
  templates.filter(({ templateId }) => !singletonTypes.includes(templateId));

export const singletonActions = (
  actions: DocumentActionComponent[],
  { schemaType }: { schemaType: string },
): DocumentActionComponent[] =>
  singletonTypes.includes(schemaType)
    ? actions.filter(
        ({ action }) => action !== "duplicate" && action !== "delete",
      )
    : actions;
