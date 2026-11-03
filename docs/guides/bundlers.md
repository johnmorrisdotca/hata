---
title: Vite and webpack
section: how-to
order: 14
description: Install the package and import the flag element in a Vite or webpack project.
---

Install it.

```sh
npm install @johnmorrisdotca/hata
# or: pnpm add @johnmorrisdotca/hata
# or: yarn add @johnmorrisdotca/hata
```

Everything is an ES module with its own entry point, so a bundler keeps only what you import: `@johnmorrisdotca/hata`, `/load` (a flag by its code, when asked), `/flags/<code>` (one flag's SVG text), `/names`, `/manifest`, `/element` and `/element/define`, which registers `<hata-flag>` once.

## Vite

The page.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hata with Vite</title>
  </head>
  <body>
    <hata-flag code="JP-13" label="Tokyo"></hata-flag>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```

The script. Vite builds this entry with no configuration.

```ts no-run
import "@johnmorrisdotca/hata/element/define";

const flag = document.querySelector("hata-flag")!;
flag.addEventListener("hata-load", (event) => console.log((event as CustomEvent<{ code: string }>).detail.code));
```

## webpack

The entry.

```js no-run
import "@johnmorrisdotca/hata/element/define";

const flag = document.createElement("hata-flag");
flag.setAttribute("code", "JP-13");
flag.setAttribute("label", "Tokyo");
document.body.append(flag);
```

`webpack.config.mjs`. webpack 5 needs nothing special for a package with `exports`.

```mjs no-run
import { fileURLToPath } from "node:url";

export default {
  mode: "production",
  entry: "./src/index.js",
  output: { path: fileURLToPath(new URL("./dist", import.meta.url)), filename: "main.js" },
};
```

Run `npx webpack` and load the `dist/main.js` it makes from a page.

## Other tools

Anything that reads `exports` in `package.json` works the same way: Rollup, esbuild, Parcel, Bun, Deno (`npm:@johnmorrisdotca/hata/element/define`). The only entry with a side effect is `element/define`, which `package.json` says in `sideEffects`, so tree shaking removes the rest.
