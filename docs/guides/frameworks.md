---
title: In React, Vue, Svelte and Angular
section: how-to
order: 15
description: Use the flag element in React, Vue, Svelte and Angular, with the import that keeps a server render working.
---

`<hata-flag>` is a web component, so every framework can use it. Two things apply everywhere:

1. **Import the entry that registers the tag** (`@johnmorrisdotca/hata/element/define`). It is safe to import on a server, where it registers nothing; the flag is drawn in the browser.
2. **Tell the framework the tag exists.** React needs a type for it, Vue a compiler option, Angular a schema. Svelte needs nothing.

## React

`Flag.tsx`; React 19 passes attributes through to a custom element.

```tsx
import "@johnmorrisdotca/hata/element/define";

export function Flag({ code = "JP-13" }: { code?: string }) {
  return <hata-flag code={code} label="Tokyo" />;
}
```

With TypeScript, tell React the tag exists (a file such as `hata-flag.d.ts`):

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

Mount it as usual. The component renders to a string on a server (`renderToString`), as the package's tests check: the tag is there, the flag is drawn in the browser.

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

Tell Vue's compiler that `hata-*` tags are custom elements, in `main.ts`:

```ts no-check
import { createApp } from "vue";
import Flag from "./Flag.vue";

const app = createApp(Flag);
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("hata-");
app.mount("#app");
```

With Vite, the same option goes in `vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith("hata-") } } })`.

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

Standalone, with `CUSTOM_ELEMENTS_SCHEMA` so the template may hold an unknown tag. Bind an attribute with `[attr.code]`, since the element reads attributes:

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

They render on a server first, and the import above is safe there, so the components work unchanged. In Next.js's App Router the component file starts with `"use client"`.
