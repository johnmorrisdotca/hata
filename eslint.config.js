import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/", "site/", "node_modules/", "test-results/", "playwright-report/", "data-sources/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }],
    },
  },
  { files: ["scripts/**/*.ts", "scripts/**/*.mjs", "tsup.config.ts"], languageOptions: { globals: { console: "readonly", process: "readonly", fetch: "readonly", Buffer: "readonly", URL: "readonly", URLSearchParams: "readonly", setTimeout: "readonly", document: "readonly" } } },
  { files: ["e2e/**/*.mjs", "playwright.config.mjs"], languageOptions: { globals: { console: "readonly", URL: "readonly", document: "readonly", window: "readonly", location: "readonly", getComputedStyle: "readonly", localStorage: "readonly", navigator: "readonly" } } },
  { files: ["scripts/readme-pictures.mjs", "scripts/readme-pictures-lib.mjs", "scripts/screenshots.mjs"], languageOptions: { globals: { window: "readonly", localStorage: "readonly" } } },
  // These run code inside the browser page they drive.
  { files: ["scripts/comparer.mjs", "scripts/sheet.mjs"], languageOptions: { globals: { Image: "readonly", Blob: "readonly", document: "readonly" } } },
  { files: ["demo/**/*.js"], languageOptions: { globals: { document: "readonly", window: "readonly", location: "readonly", history: "readonly", navigator: "readonly", URLSearchParams: "readonly", setTimeout: "readonly", clearTimeout: "readonly", localStorage: "readonly", familyLanguage: "readonly", familyHelp: "readonly", CustomEvent: "readonly", Node: "readonly", Image: "readonly", Blob: "readonly", URL: "readonly", requestAnimationFrame: "readonly", fetch: "readonly", HTMLElement: "readonly" } } },
);
