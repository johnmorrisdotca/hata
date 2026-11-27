import { readdirSync } from "node:fs";
import { basename } from "node:path";

import type { Plugin } from "esbuild";
import { defineConfig } from "tsup";

// One entry for each flag (src/flags/<code>.ts, written by scripts/build-data.ts), and for each drawing made for a
// frame (src/flags/<code>.4x3.ts, <code>.1x1.ts), and for each variant (<code>--<id>.ts); a former country's code is three or four letters (frg, suhh). Their types are written by
// scripts/build-extras.ts, one small file each, rather than by a TypeScript build per flag.
const flagEntries: Record<string, string> = Object.fromEntries(
  readdirSync("src/flags")
    .filter((file) => /^([a-z]{2}(-[a-z0-9]{1,3})?|[a-z]{3,4})(--[a-z0-9]+(-[a-z0-9]+)*)?(\.(4x3|1x1))?\.ts$/.test(file))
    .map((file) => [`flags/${basename(file, ".ts")}`, `src/flags/${file}`]),
);

// The sets drawn for this package (signals, samurai, military, medieval) and the organisations: one entry for each drawing too
// (src/sets/<set>/<slug>.ts, written by scripts/draw-*.ts), at dist/<set>/<slug>.js. The set's entry keeps only the records and a dynamic
// import for each drawing, so a page carries the drawings it asks for and no others.
const SETS = ["signals", "samurai", "military", "medieval", "organisations"] as const;
const setEntries: Record<string, string> = Object.fromEntries(
  SETS.flatMap((set) => readdirSync(`src/sets/${set}`).filter((file) => /^[a-z0-9]+(-[a-z0-9]+)*\.ts$/.test(file)).map((file) => [`${set}/${basename(file, ".ts")}`, `src/sets/${set}/${file}`])),
);

// /load imports each flag's entry when it is asked for, and a flag that shares another's picture imports that
// flag's entry. Both are left as imports of the built entry file, so no picture is copied into another file.
const flagImports: Plugin = {
  name: "hata-flag-imports",
  setup(build) {
    // The element's modules are entries of their own: <hata-flag> loads /load and /names, and element-define the
    // element, rather than carry a copy of each.
    build.onResolve({ filter: /^\.\/(load|names|element|custom|manifest|bind|react)\.js$/ }, (args) => ({ path: args.path, external: true }));
    // A language's names are an entry of their own. <hata-flag> loads the one the page asked for.
    build.onResolve({ filter: /^\.\/names\/[a-z]+(?:-[A-Za-z]+)?\.js$/ }, (args) => ({ path: args.path, external: true }));
    // /load's table of the drawings made for a frame is an entry of its own, loaded when a frame is asked for.
    build.onResolve({ filter: /^\.\/data\/adapted\.data\.js$/ }, () => ({ path: "./adapted.js", external: true }));
    // So is its table of variants, loaded when a variant is asked for.
    build.onResolve({ filter: /^\.\/data\/variants\.data\.js$/ }, () => ({ path: "./variants.js", external: true }));
    // A set's entry imports each drawing's module as an entry of its own, left as an import of the built file.
    build.onResolve({ filter: /^\.\/(sets\/)?(signals|samurai|military|medieval|organisations)\/[a-z0-9-]+$/ }, (args) => ({ path: `./${args.path.replace(/^\.\/(sets\/)?/, "")}.js`, external: true }));
    build.onResolve({ filter: /^\.\.\/flags\/[a-z0-9.-]+\.js$/ }, (args) => ({ path: `./flags/${basename(args.path)}`, external: true }));
    build.onResolve({ filter: /^\.\/([a-z]{2}(-[a-z0-9]{1,3})?|[a-z]{3,4})$/ }, (args) => (args.importer.includes("/src/flags/") ? { path: `${args.path}.js`, external: true } : undefined));
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
    entry: { index: "src/index.ts", load: "src/load.ts", manifest: "src/manifest.ts", adapted: "src/data/adapted.data.ts", variants: "src/data/variants.data.ts", names: "src/names.ts", "names/fr": "src/names/fr.ts", "names/es": "src/names/es.ts", "names/de": "src/names/de.ts", "names/zh-Hans": "src/names/zh-Hans.ts", "names/zh-Hant": "src/names/zh-Hant.ts", "names/ko": "src/names/ko.ts", "names/pt": "src/names/pt.ts", "names/ar": "src/names/ar.ts", "names/ru": "src/names/ru.ts", organisations: "src/organisations.ts", signals: "src/signals.ts", samurai: "src/samurai.ts", military: "src/military.ts", medieval: "src/medieval.ts", search: "src/search.ts", custom: "src/custom.ts", element: "src/element.ts", "element-define": "src/element-define.ts", bind: "src/bind.ts", react: "src/react.ts", vue: "src/vue.ts", "react-native": "src/react-native.ts" },
    dts: true,
    minify: false,
    esbuildOptions(options) {
      options.charset = "utf8";
    },
  },
  {
    ...shared,
    entry: { ...flagEntries, ...setEntries },
    dts: false,
    // A flag's entry is its SVG string and an export: nothing to gain from more than whitespace.
    esbuildOptions(options) {
      options.charset = "utf8";
      options.minifyWhitespace = true;
    },
  },
]);
