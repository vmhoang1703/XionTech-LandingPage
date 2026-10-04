// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { job } from "./job";
import { post } from "./post";

type Field = { name: string; type: string; fields?: Field[] };
type Schema = { name: string; type: string; fields: Field[] };

const findField = (schema: Schema, name: string): Field => {
  const field = schema.fields.find((f) => f.name === name);
  if (!field) throw new Error(`Missing field "${name}" in ${schema.name}`);
  return field;
};

const translated: [Schema, string[]][] = [
  [post, ["title", "excerpt", "body"]],
  [job, ["title", "location", "team", "description"]],
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

  it("makes the post slug and published date required, so every published post can show on Home", () => {
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

  it("gives a post an app field with four apps, hidden unless Product", () => {
    const app = findField(post, "app") as Field & {
      options?: { list?: { title: string; value: string }[] };
      hidden?: (ctx: { document?: { category?: string } }) => boolean;
    };
    expect(app.type).toBe("string");
    expect(app.options?.list?.map((o) => o.value)).toEqual([
      "PXP",
      "LXP",
      "SXP",
      "IoT",
    ]);
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

  it.each([post, job])("has no application or CV field (%#)", (schema) => {
    const names = JSON.stringify(schema)
      .match(/"name":"[^"]*"/g)
      ?.join(" ");
    expect(names).not.toMatch(/appl|cv|resume|curriculum/i);
  });
});
