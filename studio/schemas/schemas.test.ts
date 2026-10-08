// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { APPS } from "../../src/content/apps";
import { careersPhotos } from "./careers-photos";
import { job } from "./job";
import { post } from "./post";
import { product } from "./product";
import { schemaTypes } from "./index";

type Field = {
  name: string;
  type: string;
  fields?: Field[];
  of?: { type: string }[];
};
type Schema = { name: string; type: string; fields: Field[] };

const findField = (schema: Schema, name: string): Field => {
  const field = schema.fields.find((f) => f.name === name);
  if (!field) throw new Error(`Missing field "${name}" in ${schema.name}`);
  return field;
};

const translated: [Schema, string[]][] = [
  [post, ["title", "excerpt", "body"]],
  [
    job,
    [
      "title",
      "location",
      "team",
      "description",
      "responsibilities",
      "requirements",
    ],
  ],
];

describe("studio schemas", () => {
  it("defines post and job documents", () => {
    expect(post).toMatchObject({ name: "post", type: "document" });
    expect(job).toMatchObject({ name: "job", type: "document" });
  });

  it("has the fields the spec lists", () => {
    const postNames = post.fields.map((f) => f.name);
    expect(postNames).toEqual(
      expect.arrayContaining([
        "title",
        "slug",
        "publishedAt",
        "excerpt",
        "body",
      ]),
    );
    const jobNames = job.fields.map((f) => f.name);
    expect(jobNames).toEqual(
      expect.arrayContaining([
        "title",
        "slug",
        "location",
        "team",
        "type",
        "closed",
        "description",
      ]),
    );
  });

  it("makes the job slug required, from the English title", () => {
    const slug = findField(job, "slug") as Field & {
      options?: { source?: string };
      validation?: unknown;
    };
    expect(slug.type).toBe("slug");
    expect(slug.options?.source).toBe("title.en");
    expect(slug.validation).toBeTypeOf("function");
    const required = vi.fn().mockReturnValue("required-rule");
    const rule = { required };
    expect((slug.validation as (r: typeof rule) => unknown)(rule)).toBe(
      "required-rule",
    );
    expect(required).toHaveBeenCalledTimes(1);
  });

  it("shows the English title in the Studio lists, not Untitled", () => {
    const preview = (schema: unknown) =>
      (schema as { preview?: { select?: Record<string, string> } }).preview
        ?.select;
    expect(preview(job)).toEqual({ title: "title.en", subtitle: "team.en" });
    expect(preview(post)).toEqual({
      title: "title.en",
      subtitle: "publishedAt",
    });
  });

  it("makes the post slug and published date required (Home also needs an English title)", () => {
    for (const name of ["slug", "publishedAt"]) {
      const field = findField(post, name) as Field & { validation?: unknown };
      const required = vi.fn().mockReturnValue("required-rule");
      expect(
        (field.validation as (r: { required: typeof required }) => unknown)({
          required,
        }),
      ).toBe("required-rule");
      expect(required).toHaveBeenCalledTimes(1);
    }
  });

  it("gives a post a required category with four values", () => {
    const category = findField(post, "category") as Field & {
      options?: { list?: { title: string; value: string }[] };
      validation?: unknown;
    };
    expect(category.type).toBe("string");
    expect(category.options?.list?.map((o) => o.value)).toEqual([
      "product",
      "company",
      "schools",
      "team",
    ]);
    const required = vi.fn().mockReturnValue("required-rule");
    expect(
      (category.validation as (r: { required: typeof required }) => unknown)({
        required,
      }),
    ).toBe("required-rule");
    expect(required).toHaveBeenCalledTimes(1);
  });

  it("gives a post an app field with the four app ids, hidden unless Product", () => {
    const app = findField(post, "app") as Field & {
      options?: { list?: { title: string; value: string }[] };
      hidden?: (ctx: { document?: { category?: string } }) => boolean;
    };
    expect(app.type).toBe("string");
    expect(app.options?.list?.map((o) => o.value)).toEqual(
      APPS.map((a) => a.id),
    );
    expect(app.options?.list?.map((o) => o.title)).toEqual(
      APPS.map((a) => a.shortName),
    );
    expect(app.hidden).toBeTypeOf("function");
    expect(app.hidden?.({ document: { category: "product" } })).toBe(false);
    expect(app.hidden?.({ document: { category: "team" } })).toBe(true);
    expect(app.hidden?.({ document: {} })).toBe(true);
    expect(app.hidden?.({})).toBe(true);
  });

  it("has a job closed flag that starts false", () => {
    const closed = findField(job, "closed") as Field & {
      initialValue?: boolean;
    };
    expect(closed.type).toBe("boolean");
    expect(closed.initialValue).toBe(false);
  });

  it.each(translated)(
    "keeps EN and VI in one document (%#)",
    (schema, names) => {
      for (const name of names) {
        const field = findField(schema, name);
        expect(field.type).toBe("object");
        expect((field.fields ?? []).map((f) => f.name)).toEqual(["en", "vi"]);
      }
    },
  );

  it.each(["responsibilities", "requirements"])(
    "has a job %s list of EN and VI strings",
    (name) => {
      const field = findField(job, name);
      expect(field.type).toBe("object");
      expect((field.fields ?? []).map((f) => f.name)).toEqual(["en", "vi"]);
      for (const lang of field.fields ?? []) {
        expect(lang.type).toBe("array");
        expect(lang.of).toEqual([{ type: "string" }]);
      }
    },
  );

  it.each([post, job])("has no application or CV field (%#)", (schema) => {
    const names = JSON.stringify(schema)
      .match(/"name":"[^"]*"/g)
      ?.join(" ");
    expect(names).not.toMatch(/appl|cv|resume|curriculum/i);
  });

  it("registers the four types", () => {
    expect(schemaTypes.map((t) => t.name)).toEqual([
      "post",
      "job",
      "careersPhotos",
      "product",
    ]);
  });

  describe("careersPhotos", () => {
    type Rule = {
      custom: (fn: (value: unknown, ctx: unknown) => unknown) => Rule;
    };
    const slots = ["team", "office", "event"];

    it("is a document with three fixed slots", () => {
      expect(careersPhotos).toMatchObject({
        name: "careersPhotos",
        type: "document",
      });
      expect(careersPhotos.fields.map((f) => f.name)).toEqual(slots);
    });

    it.each(slots)("slot %s has a photo, alt text and a caption", (slot) => {
      const field = findField(careersPhotos, slot);
      expect(field.type).toBe("object");
      expect((field.fields ?? []).map((f) => f.name)).toEqual([
        "photo",
        "alt",
        "caption",
      ]);
      expect(field.fields?.[0].type).toBe("image");
    });

    it("requires alt text only when a photo is set", () => {
      const alt = findField(
        findField(careersPhotos, "team") as Schema,
        "alt",
      ) as Field & { validation?: (rule: Rule) => unknown };
      let check: (value: unknown, ctx: unknown) => unknown = () => null;
      const rule: Rule = {
        custom: (fn) => {
          check = fn;
          return rule;
        },
      };
      alt.validation?.(rule);
      const message = "Describe the photo for screen readers.";
      const withPhoto = { parent: { photo: { asset: { _ref: "image-1" } } } };
      expect(check(undefined, withPhoto)).toBe(message);
      expect(check("   ", withPhoto)).toBe(message);
      expect(check("Team at work", withPhoto)).toBe(true);
      expect(check(undefined, { parent: {} })).toBe(true);
      expect(check(undefined, {})).toBe(true);
    });
  });

  describe("product", () => {
    it("is a document with only an mp4 clip (the fixed id names the app)", () => {
      expect(product).toMatchObject({ name: "product", type: "document" });
      expect(product.fields.map((f) => f.name)).toEqual(["clip"]);
      const clip = findField(product, "clip") as Field & {
        options?: { accept?: string };
      };
      expect(clip.type).toBe("file");
      expect(clip.options?.accept).toBe("video/mp4");
    });
  });
});
