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
