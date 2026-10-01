import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import sonarjs from "eslint-plugin-sonarjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // SonarQube's own JS/TS rules, so most gate findings show up in `npm run lint`
  // (seconds) instead of only in the local SonarQube scan (minutes). Same scope
  // as sonar-project.properties: src/ without test files.
  {
    ...sonarjs.configs.recommended,
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/**/*.test.{ts,tsx}"],
    // Type information: rules such as sonarjs/prefer-regexp-exec stay silent
    // without it.
    languageOptions: { parserOptions: { projectService: true } },
    rules: {
      ...sonarjs.configs.recommended.rules,
      // Sonar S7773; the sonarjs plugin has no rule for it.
      "no-restricted-globals": [
        "error",
        ...["parseInt", "parseFloat", "isNaN", "isFinite"].map((name) => ({
          name,
          message: `Use Number.${name} instead.`,
        })),
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    "test-results/**",
    "playwright-report/**",
    // BMad method files (installed by @xiontechs/bmad-method, not our code):
    ".claude/**",
    "_bmad/**",
    "_bmad-output/**",
  ]),
]);

export default eslintConfig;
