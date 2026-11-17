---
title: In React, Vue, Svelte and Angular
section: how-to
order: 15
description: Typed flag components for React, Vue, Svelte and React Native that draw the SVG inline and work in a server render, and the flag element for every other framework.
---

Hata has two ways into a framework. **The typed components** (`@johnmorrisdotca/hata/react`, `/vue`, `/svelte`, `/react-native`) draw the flag's SVG inline from its own module, so the flag is in a server render and in a static build, and their props are typed. **The element** (`<hata-flag>`) works in any framework, and in none, but it draws in the browser, so a server render has only the tag.

## Typed components

All take the element's props, typed: `code`, `shape`, `fit`, `size`, `width`, `label`, `lang`, `border`, `shadow`, `theme`, `date`, `variant`, `which` (the legal flag or the flag in use of a `date`) and `allowRestricted`. Each renders a `<span role="img" aria-label="…">` with the element's box (its height, proportions, round corners, border and shadow) holding the flag's `<svg>`. React, Vue and Svelte are optional peer dependencies: a project that does not import a component installs nothing new.

### React

```tsx
import { createRoot } from "react-dom/client";
import { Flag } from "@johnmorrisdotca/hata/react";

createRoot(document.getElementById("root")!).render(<Flag code="JP-13" shape="round" size="large" label="Tokyo" border />);
```

On a server, `renderToString` cannot wait, so load the flags first with `preloadFlags`; a streaming render (`renderToPipeableStream`, `prerender`) waits for them by itself in React 19. Without a preload on the client, React 19 suspends until the flag is loaded, and React 18 draws it after an effect.

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

In a template, `<Flag code="JP-13" shape="round" />` after the same import. Vue's server renderer waits for the flag by itself:

```js
import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import { Flag } from "@johnmorrisdotca/hata/vue";

// Vue's server renderer waits for the flag by itself.
const html = await renderToString(createSSRApp(Flag, { code: "CA-ON", label: "Ontario" }));
console.log(html.includes("<svg"), html.includes('aria-label="Ontario"'));
```

To hydrate without a mismatch, call `preloadFlags` on the client before mounting.

### Svelte

Svelte 5. The package ships the component as a `.svelte` file (the `svelte` export condition), which your Svelte plugin compiles.

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

A server render does not wait: `await preloadFlags([...])` from `@johnmorrisdotca/hata/bind` before it, and the flag is in the HTML.

### React Native

`@johnmorrisdotca/hata/react-native` draws the flag with [react-native-svg](https://github.com/software-mansion/react-native-svg)'s `SvgXml`, which your app hands to `createFlag` (Hata imports nothing from React Native, so no bundler has to resolve it): `const Flag = createFlag(SvgXml);`. The flag is `size` points high (24 by default) or `width` wide, with the place's name as its accessibility label. It takes `code`, `shape`, `fit`, `label`, `lang`, `date`, `variant`, `which`, `allowRestricted`, `size` and `width`; call `preloadFlags` first on React 18.

### Angular, Solid and the rest

Angular and Solid need a compile step of their own to ship a component, so Hata ships none for them: use the element below (Angular with `CUSTOM_ELEMENTS_SCHEMA`), or `flag()` from `/load` and put its SVG in the template. `@johnmorrisdotca/hata/bind` is the framework-free core the components share (`resolveFlag`, `preloadFlags`, `cachedFlag`, `boxStyle`), for anyone who wants to write one.

## The element, in any framework

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
