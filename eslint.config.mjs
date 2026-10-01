import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import sonarjs from "eslint-plugin-sonarjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // SonarQube's own JS/TS rules, so most gate findings show up in `npm run lint`
  // (seconds) instead of only in the local SonarQube scan (minutes). TS/TSX in
  // src/ without test files, as in sonar-project.properties; CSS, duplication,
  // coverage and hotspots are still only checked by the gate.
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/**/*.test.{ts,tsx}"],
    // Plugin and rules only: the preset's `settings` would replace
    // eslint-config-next's React version ("detect") with "999.999.999".
    plugins: sonarjs.configs.recommended.plugins,
    // Type information: rules such as sonarjs/prefer-regexp-exec stay silent
    // without it. tsconfigRootDir lets ESLint run from any directory.
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...sonarjs.configs.recommended.rules,
      // Sonar S7773; the sonarjs plugin has no rule for it.
      "no-restricted-globals": [
        "error",
        { name: "parseInt", message: "Use Number.parseInt instead." },
        { name: "parseFloat", message: "Use Number.parseFloat instead." },
        {
          name: "isNaN",
          message:
            "Use Number.isNaN(Number(x)): unlike isNaN, Number.isNaN does not convert its argument.",
        },
        {
          name: "isFinite",
          message:
            "Use Number.isFinite(Number(x)): unlike isFinite, Number.isFinite does not convert its argument.",
        },
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
