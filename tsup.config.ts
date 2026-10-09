import { readdirSync } from "node:fs";
import { basename } from "node:path";

import type { Plugin } from "esbuild";
import { defineConfig } from "tsup";

// One entry for each flag (src/flags/<code>.ts, written by scripts/build-data.ts), and for each drawing made for a
// frame (src/flags/<code>.4x3.ts, <code>.1x1.ts). Their types are written by
// scripts/build-extras.ts, one small file each, rather than by a TypeScript build per flag.
const flagEntries: Record<string, string> = Object.fromEntries(
  readdirSync("src/flags")
    .filter((file) => /^[a-z]{2}(-[a-z0-9]{1,3})?(\.(4x3|1x1))?\.ts$/.test(file))
    .map((file) => [`flags/${basename(file, ".ts")}`, `src/flags/${file}`]),
);

// /load imports each flag's entry when it is asked for, and a flag that shares another's picture imports that
// flag's entry. Both are left as imports of the built entry file, so no picture is copied into another file.
const flagImports: Plugin = {
  name: "hata-flag-imports",
  setup(build) {
    // /load's table of the drawings made for a frame is an entry of its own, loaded when a frame is asked for.
    build.onResolve({ filter: /^\.\/data\/adapted\.data\.js$/ }, () => ({ path: "./adapted.js", external: true }));
    build.onResolve({ filter: /^\.\.\/flags\/[a-z0-9.-]+\.js$/ }, (args) => ({ path: `./flags/${basename(args.path)}`, external: true }));
    build.onResolve({ filter: /^\.\/[a-z]{2}(-[a-z0-9]{1,3})?$/ }, (args) => (args.importer.includes("/src/flags/") ? { path: `${args.path}.js`, external: true } : undefined));
  },
};

const shared = {
  format: ["esm"] as "esm"[],
  // Each entry stands alone, so that a flag's file carries only its own picture.
  splitting: false,
  sourcemap: false,
  target: "es2022",
  outDir: "dist",
  esbuildPlugins: [flagImports],
};

export default defineConfig([
  {
    ...shared,
    entry: { index: "src/index.ts", load: "src/load.ts", manifest: "src/manifest.ts", adapted: "src/data/adapted.data.ts" },
    dts: true,
    minify: false,
    esbuildOptions(options) {
      options.charset = "utf8";
    },
  },
  {
    ...shared,
    entry: flagEntries,
    dts: false,
    // A flag's entry is its SVG string and an export: nothing to gain from more than whitespace.
    esbuildOptions(options) {
      options.charset = "utf8";
      options.minifyWhitespace = true;
    },
  },
]);
