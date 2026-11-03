---
title: React・Vue・Svelte・Angular で使う
section: how-to
order: 15
description: React、Vue、Svelte、Angular で旗の要素を使います。サーバーでの描画でも動く import の仕方も説明します。
---

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
