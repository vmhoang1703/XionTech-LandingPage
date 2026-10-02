// @vitest-environment node
import { describe, expect, it } from "vitest";
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
  [job, ["title", "location", "description"]],
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
      expect.arrayContaining(["title", "location", "type", "description"]),
    );
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
