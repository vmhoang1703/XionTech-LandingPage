import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import { collectStrings } from "./vi-review.mjs";

// No Vietnamese string may be left equal to its English unless it is on purpose:
// a name, a tagline, a tag, contact data, an id, a link or a number.
const ROOT = join(import.meta.dirname, "../..");
const load = (file) =>
  import(/* @vite-ignore */ pathToFileURL(join(ROOT, file)).href);

/** Strings that stay English in Vietnamese (decisions 2 and 4, spec-vi-page-content). */
const ALLOWED = new Set([
  // Brand and tagline.
  "XionTech",
  "Get IT done",
  "Get IT Done",
  "GET IT DONE",
  "XionTech, Get IT Done",
  "[Placeholder] Get IT Done",
  "newXion",
  // Place names that read the same in Vietnamese.
  "Plano",
  // App, product and service names and badges.
  "Parent Hub",
  "Staff Hub",
  "IoT",
  "IoT Device Management",
  "AI Tutor",
  "P-Hub",
  "S-Hub",
  "Product Engineering",
  "AI-Driven Analytics",
  "Product Co-Creation",
  "Staffing Service",
  "Custom App Development",
  "Low-code Solutions",
  "AI-Powered Solutions",
  "Cloud Computing",
  "Staffing",
  "Low-code",
  "Cloud",
  // Tech tags and loanwords Vietnamese uses as is.
  "Web",
  "Mobile",
  "AI/ML",
  "Dashboards",
  "Power Platform",
  "Make",
  "n8n",
  "Retool",
  "Bubble",
  "Generative AI",
  "Azure",
  "AWS",
  "GCP",
  "Logistics",
  "Menu",
  "Email",
  "CV",
  // Language names, each in its own language.
  "English",
  "Tiếng Việt",
  // Icon names and time zones (data).
  "Cpu",
  "Sparkle",
  "America/Chicago",
  "Asia/Ho_Chi_Minh",
  "GMT+7",
  // Addresses, emails and phone labels.
  "7950 Legacy Drive, Suite 400",
  "Plano, Texas 75024, USA",
  "Floor 15, B1 Building",
  "279 Nguyen Tri Phuong Street",
  "Dien Hong Ward, Ho Chi Minh City, Vietnam",
  "vinni.tran@newxion.com",
  "WhatsApp +1 469 439 9345",
  "name@school.edu.vn",
  "name@company.com",
]);

/** Ids, links and numbers: no words to translate. */
const DATA = /^(?:[^A-Za-z]*|[a-z0-9-]+|(?:\/|#|https?:|mailto:|tel:).*)$/;

/** Shared app records inside Home dictionaries (not shown as text there); taglines are translated in appTaglinesVi. */
const SHARED_APP =
  /^home:(?:homeAppsVi\.apps\[\d+\]\.app|homeDoorsVi\.products\.badges\[\d+\])\./;

describe("Vietnamese dictionaries", () => {
  it("leave no string in English unless it is on the allow-list", async () => {
    const same = await collectStrings(load, { same: true });
    const untranslated = same
      .filter(
        ({ english, location }) =>
          !ALLOWED.has(english) &&
          !DATA.test(english) &&
          !SHARED_APP.test(location),
      )
      .map(({ location, english }) => `${location}: ${english}`);
    expect(untranslated).toEqual([]);
  }, 60_000);
});
