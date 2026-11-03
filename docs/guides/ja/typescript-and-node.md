---
title: TypeScript と Node
section: how-to
order: 16
description: パッケージの型を使います。DOM のないサーバーでも、同じ旗を SVG の文字列として読めます。
---

パッケージは、エントリーポイントごとに自分の型を持っています。旗はただの SVG テキストなので、Node でも Deno でも Bun でもワーカーでもブラウザでも、同じ呼び出しは同じ答えを返します。このファイルは型を検査したあと、型を取り除いてくれる Node 22.18 以降でそのまま実行します。

```ts
import japan from "@johnmorrisdotca/hata/flags/jp";
import { aspectOf, flagUrl, isFlagCode, type FlagCode } from "@johnmorrisdotca/hata";

const code: FlagCode = "JP-13";
console.log(japan.startsWith("<svg"), aspectOf(japan), flagUrl(code), isFlagCode("XX"));

// @ts-expect-error "XX" is not a flag's code
const unknown: FlagCode = "XX";
console.log(unknown);
```

`@ts-expect-error` は、`"XX"` が旗のコードではなく、コンパイラが断ることを示すためのものです。

## サーバーで

サーバーでも、ブラウザと同じ SVG を読めます。DOM がないので、ページは文字列です。

```mjs
import { flag } from "@johnmorrisdotca/hata/load";
import { flagName } from "@johnmorrisdotca/hata/names";

// A server reads the same SVG a browser does: pure, no DOM, no browser globals.
const svg = await flag("JP-13", { shape: "round" });
const page = `<!doctype html><title>${flagName("JP-13", "ja")}</title>${svg}`;
console.log(page.length > 300, flagName("JP-13", "ja"));
```

最初の旗は [はじめに](getting-started.md)、ほかの旗は [旗の読み込み](loading-flags.md) を見てください。
