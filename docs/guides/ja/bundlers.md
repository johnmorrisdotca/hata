---
title: Vite と webpack
section: how-to
order: 14
description: パッケージをインストールし、Vite や webpack のプロジェクトで旗の要素を import します。
---

インストールします。

```sh
npm install @johnmorrisdotca/hata
# or: pnpm add @johnmorrisdotca/hata
# or: yarn add @johnmorrisdotca/hata
```

どれも ES モジュールで、エントリーポイントごとに分かれているので、バンドラーは import したものだけを残します。`@johnmorrisdotca/hata`、`/load` (コードで指定した旗を、必要なときに読み込む)、`/flags/<code>` (旗1つの SVG テキスト)、`/names`、`/manifest`、`/element`、そして `<hata-flag>` を一度だけ登録する `/element/define` があります。

## Vite

ページです。

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

スクリプトです。Vite は設定なしでこのエントリーをビルドします。

```ts no-run
import "@johnmorrisdotca/hata/element/define";

const flag = document.querySelector("hata-flag")!;
flag.addEventListener("hata-load", (event) => console.log((event as CustomEvent<{ code: string }>).detail.code));
```

## webpack

エントリーです。

```js no-run
import "@johnmorrisdotca/hata/element/define";

const flag = document.createElement("hata-flag");
flag.setAttribute("code", "JP-13");
flag.setAttribute("label", "Tokyo");
document.body.append(flag);
```

`webpack.config.mjs` です。`exports` を持つパッケージに、webpack 5 は特別な設定を要りません。

```mjs no-run
import { fileURLToPath } from "node:url";

export default {
  mode: "production",
  entry: "./src/index.js",
  output: { path: fileURLToPath(new URL("./dist", import.meta.url)), filename: "main.js" },
};
```

`npx webpack` を実行し、できた `dist/main.js` をページから読み込みます。

## ほかのツール

`package.json` の `exports` を読むツールなら同じように使えます。Rollup、esbuild、Parcel、Bun、Deno (`npm:@johnmorrisdotca/hata/element/define`) などです。副作用があるエントリーは `element/define` だけで、`package.json` の `sideEffects` にそう書いてあるので、ツリーシェイキングがほかを取り除きます。
