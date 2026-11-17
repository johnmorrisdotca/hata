---
title: React・Vue・Svelte・Angular で使う
section: how-to
order: 15
description: React、Vue、Svelte、React Native 用の型付きコンポーネント（SVG をそのまま描き、サーバーでの描画にも対応）と、ほかのフレームワーク向けの旗の要素を説明します。
---

Hata をフレームワークで使う方法は2つあります。**型付きコンポーネント**（`@johnmorrisdotca/hata/react`、`/vue`、`/svelte`、`/react-native`）は、旗の SVG を旗ごとのモジュールから読み込んでそのまま描くので、サーバーでの描画にも静的ビルドにも旗が入り、props には型があります。**要素**（`<hata-flag>`）はどのフレームワークでも、フレームワークなしでも使えますが、描くのはブラウザなので、サーバーでの描画にはタグしか入りません。

## 型付きコンポーネント

どれも要素の props を型付きで受け取ります。`code`、`shape`、`fit`、`size`、`width`、`label`、`lang`、`border`、`shadow`、`theme`、`date`、`variant`、`which`（`date` で指定した日の、法律上の国旗か実際に使われた旗か）、`allowRestricted` です。どれも `<span role="img" aria-label="…">` を描き、その中に旗の `<svg>` が入ります。外枠は要素と同じで、高さ、縦横比、丸い角、枠線、影が揃います。React、Vue、Svelte は省略可能なピア依存関係です。コンポーネントを import しないプロジェクトでは、追加でインストールするものはありません。

### React

```tsx
import { createRoot } from "react-dom/client";
import { Flag } from "@johnmorrisdotca/hata/react";

createRoot(document.getElementById("root")!).render(<Flag code="JP-13" shape="round" size="large" label="Tokyo" border />);
```

サーバーでは `renderToString` は読み込みを待てないので、先に `preloadFlags` で旗を読み込みます。ストリーミングの描画（`renderToPipeableStream`、`prerender`）は、React 19 なら旗の読み込みを自分で待ちます。クライアントで `preloadFlags` を呼ばないときは、React 19 は旗の読み込みが終わるまで描画を一時停止し、React 18 はエフェクトの実行後に描きます。

```tsx
import { renderToString } from "react-dom/server";
import { Flag, preloadFlags } from "@johnmorrisdotca/hata/react";

// renderToString cannot wait, so load the flags first; a streaming render (renderToPipeableStream, prerender) waits for them by itself.
await preloadFlags([{ code: "JP-13", shape: "round", label: "Tokyo" }]);
const html = renderToString(<Flag code="JP-13" shape="round" size="medium" label="Tokyo" />);
console.log(html.includes("<svg"), html.includes('aria-label="Tokyo"'));
```

### Vue

```ts no-run
import { createApp, h } from "vue";
import { Flag } from "@johnmorrisdotca/hata/vue";

createApp({ render: () => h(Flag, { code: "JP-13", shape: "round", size: "large", label: "Tokyo", border: true }) }).mount("#app");
```

テンプレートでは、同じ import のあとに `<Flag code="JP-13" shape="round" />` と書けます。Vue のサーバーレンダラーは、旗を自分で待ちます。

```js
import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import { Flag } from "@johnmorrisdotca/hata/vue";

// Vue's server renderer waits for the flag by itself.
const html = await renderToString(createSSRApp(Flag, { code: "CA-ON", label: "Ontario" }));
console.log(html.includes("<svg"), html.includes('aria-label="Ontario"'));
```

ハイドレーションの不一致を避けるには、マウントの前にクライアントで `preloadFlags` を呼びます。

### Svelte

Svelte 5 用です。パッケージはコンポーネントを `.svelte` ファイルのまま（`svelte` のエクスポート条件で）提供し、Svelte のプラグインがコンパイルします。

```svelte
<script>
  import Flag from "@johnmorrisdotca/hata/svelte";
</script>

<Flag code="JP-13" shape="round" size="large" label="Tokyo" border />
```

```ts no-check
import { mount } from "svelte";
import App from "./App.svelte";

mount(App, { target: document.getElementById("app")! });
```

サーバーでの描画は旗の読み込みを待ちません。描画の前に `@johnmorrisdotca/hata/bind` の `await preloadFlags([...])` を呼ぶと、旗が HTML に入ります。

### React Native

`@johnmorrisdotca/hata/react-native` は、[react-native-svg](https://github.com/software-mansion/react-native-svg) の `SvgXml` で旗を描きます。`SvgXml` はアプリが `createFlag` に渡します（Hata は React Native から何も import しないので、バンドラーが解決する必要はありません）。`const Flag = createFlag(SvgXml);` と書きます。高さは `size` ポイント（既定は24）で、`width` を指定すると幅で決められます。アクセシビリティのラベルには地名が入ります。受け取るのは `code`、`shape`、`fit`、`label`、`lang`、`date`、`variant`、`which`、`allowRestricted`、`size`、`width` です。React 18 では先に `preloadFlags` を呼びます。

### Angular、Solid、そのほか

Angular と Solid は、コンポーネントを配布するのにそれぞれ独自のコンパイル手順が必要なため、Hata は用意していません。後述の要素を使うか（Angular は `CUSTOM_ELEMENTS_SCHEMA` と組み合わせます）、`/load` の `flag()` で SVG を取り出してテンプレートに入れてください。`@johnmorrisdotca/hata/bind` は、コンポーネントが共有するフレームワーク非依存の中核（`resolveFlag`、`preloadFlags`、`cachedFlag`、`boxStyle`）で、自分でコンポーネントを書きたい人向けです。

## どのフレームワークでも使える要素

`<hata-flag>` は Web コンポーネントなので、どのフレームワークでも使えます。共通のことが2つあります。

1. **タグを登録するエントリー** (`@johnmorrisdotca/hata/element/define`) を import します。サーバーで import しても何も登録しないので安全です。旗はブラウザで描かれます。
2. **フレームワークにそのタグがあることを伝えます。** React は型、Vue はコンパイラーのオプション、Angular はスキーマが要ります。Svelte は何も要りません。

## React

`Flag.tsx` です。React 19 は属性をそのままカスタム要素に渡します。

```tsx
import "@johnmorrisdotca/hata/element/define";

export function Flag({ code = "JP-13" }: { code?: string }) {
  return <hata-flag code={code} label="Tokyo" />;
}
```

TypeScript では、React にそのタグがあることを教えます (`hata-flag.d.ts` のようなファイル)。

```ts no-run
import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "hata-flag": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & { code?: string; shape?: string; size?: number | string; label?: string; lang?: string; theme?: string; border?: boolean; shadow?: boolean };
    }
  }
}
```

いつもどおりにマウントします。コンポーネントはサーバーでも文字列に描画できます (`renderToString`)。パッケージのテストで確かめています。タグは出力され、旗はブラウザで描かれます。

```tsx
import { createRoot } from "react-dom/client";
import { Flag } from "./Flag";

createRoot(document.getElementById("root")!).render(<Flag />);
```

## Vue

```vue
<script setup lang="ts">
import "@johnmorrisdotca/hata/element/define";

withDefaults(defineProps<{ code?: string }>(), { code: "JP-13" });
</script>

<template>
  <hata-flag :code="code" label="Tokyo"></hata-flag>
</template>
```

Vue のコンパイラーに、`hata-*` のタグはカスタム要素だと伝えます (`main.ts`)。

```ts no-check
import { createApp } from "vue";
import Flag from "./Flag.vue";

const app = createApp(Flag);
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("hata-");
app.mount("#app");
```

Vite では、同じオプションを `vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith("hata-") } } })` に書きます。

## Svelte

```svelte
<script lang="ts">
  import "@johnmorrisdotca/hata/element/define";

  let { code = "JP-13" }: { code?: string } = $props();
</script>

<hata-flag {code} label="Tokyo"></hata-flag>
```

```ts no-check
import { mount } from "svelte";
import Flag from "./Flag.svelte";

mount(Flag, { target: document.getElementById("app")! });
```

## Angular

スタンドアロンで、テンプレートに未知のタグを書けるよう `CUSTOM_ELEMENTS_SCHEMA` を付けます。要素は属性を読むので、属性は `[attr.code]` で結びます。

```ts no-check
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from "@angular/core";
import "@johnmorrisdotca/hata/element/define";

@Component({
  selector: "app-flag",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `<hata-flag [attr.code]="code" label="Tokyo"></hata-flag>`,
})
export class FlagComponent {
  @Input() code = "JP-13";
}
```

```ts no-check
import "@angular/compiler";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZonelessChangeDetection } from "@angular/core";
import { FlagComponent } from "./flag.component";

void bootstrapApplication(FlagComponent, { providers: [provideZonelessChangeDetection()] });
```

## Next.js, Nuxt, SvelteKit

どれも先にサーバーで描画しますが、上の import はサーバーでも安全なので、コンポーネントはそのまま動きます。Next.js の App Router では、コンポーネントのファイルの先頭に `"use client"` を書きます。
