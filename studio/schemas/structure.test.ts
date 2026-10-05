// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  singletonActions,
  singletonNewDocumentOptions,
  singletonTypes,
  structure,
} from "./structure";

type Node = Record<string, unknown>;

// A small stand-in for Sanity's StructureBuilder: every call returns a chainable
// object that records what it was given.
const makeBuilder = () => {
  const chain = (kind: string, props: Node = {}): Node => {
    const node: Node = { kind, ...props };
    return new Proxy(node, {
      get: (target, key: string) =>
        key in target || typeof key === "symbol"
          ? target[key]
          : (value: unknown) => chain(kind, { ...target, [key]: value }),
    });
  };
  return {
    list: () => chain("list"),
    listItem: () => chain("listItem"),
    document: () => chain("document"),
    documentTypeListItem: (type: string) =>
      chain("typeList", { schemaType: type }),
    divider: () => chain("divider"),
  };
};

const build = () => {
  const S = makeBuilder();
  return structure(S as never) as unknown as { items: Node[] };
};

const doc = (item: Node) => item.child as Node;

describe("studio structure", () => {
  it("lists careers photos, products, news posts and job openings in order", () => {
    const titles = build().items.map((i) => i.title ?? i.schemaType);
    expect(titles).toEqual([
      "Careers photos",
      "Products",
      "News posts",
      "Job openings",
    ]);
  });

  it("opens careers photos as one fixed document", () => {
    const item = build().items[0];
    expect(doc(item).schemaType).toBe("careersPhotos");
    expect(doc(item).documentId).toBe("careersPhotos");
  });

  it("opens products as four fixed documents", () => {
    const products = build().items[1];
    const list = products.child as { items: Node[] };
    expect(
      list.items.map((i) => [i.title, doc(i).schemaType, doc(i).documentId]),
    ).toEqual([
      ["PXP", "product", "product-pxp"],
      ["LXP", "product", "product-lxp"],
      ["SXP", "product", "product-sxp"],
      ["IoT", "product", "product-iot"],
    ]);
  });

  it("removes create from the singleton types", () => {
    expect(singletonTypes).toEqual(["careersPhotos", "product"]);
    const options = [
      { templateId: "post" },
      { templateId: "careersPhotos" },
      { templateId: "product" },
    ];
    expect(singletonNewDocumentOptions(options as never)).toEqual([
      { templateId: "post" },
    ]);
  });

  it("removes duplicate and delete from the singleton types only", () => {
    const actions = [
      { action: "publish" },
      { action: "duplicate" },
      { action: "delete" },
    ];
    const names = (type: string) =>
      singletonActions(actions as never, { schemaType: type } as never).map(
        (a) => a.action,
      );
    expect(names("careersPhotos")).toEqual(["publish"]);
    expect(names("product")).toEqual(["publish"]);
    expect(names("post")).toEqual(["publish", "duplicate", "delete"]);
  });
});
