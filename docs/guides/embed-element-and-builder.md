---
title: The element, the iframe and the builder
section: how-to
order: 22
description: Every attribute of the hata-flag element, the iframe for a page with no scripts, framework use, and the builder in the demo.
---

## One script tag and an element

One script tag and an element, for any page:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/element-define.js"></script>
<p>Where I live: <hata-flag code="CA-BC"></hata-flag> British Columbia</p>
<hata-flag code="JP-13" shape="round" size="48" border shadow></hata-flag>
```

## The attributes

| Attribute | What it does |
| --- | --- |
| `code` | The flag's code, in any case: `JP`, `jp-13`, `CA-ON`, `DE-BY` |
| `shape` | `own` (the default: its own proportions), `4:3`, `1:1` or `round`, framed as `flag(code, { shape })` frames it |
| `size` | Its height in CSS pixels; left out, `1em`, the height of the text around it, and any CSS height works |
| `variant` | Which of the place's flags in real use to draw, by its `id` from `variantsOf(code)`: `de-facto`, `stripes`, `local`; left out, the default |
| `date` | The day whose flag to draw, `"1962-09-29"`: the flag then (`variantOn`), the legal one by default; a `variant` wins |
| `which` | With `date`: `legal` (the default) or `in-use`, the flag flown in practice (not `role`, which is the ARIA role the element sets) |
| `allow-restricted` | Draw a flag the law restricts (Germany's of 1935 to 1945), for history and education; without it nothing is drawn, with `data-restricted` and the reason in `data-reason` |
| `fit` | `auto` (the default), `whole` (all of the flag), `crop` (a crop at the side chosen for the flag), `cover`, `hoist` or `contain`, as `frame()` takes them |
| `label` | What a screen reader says; left out, the place's name |
| `lang` | `en` or `ja`, the language of that name; left out, the language of the page where the element is |
| `theme` | `auto` (the default), `light` or `dark`: the colour of the border on a light or a dark page |
| `border`, `shadow` | A hairline round the flag (a white flag on a white page needs one), and a soft shadow |
| `loading` | `lazy` (the default: loaded as it comes near the screen) or `eager` |

It is drawn in the page's own document, with no shadow root: `role="img"` and an `aria-label`, and an `<img>` of
the flag inside, so it is crisp at any size and the page's CSS sizes it like any inline element
(`--hata-flag-border-light`, `--hata-flag-border-dark` and `--hata-flag-shadow` change the border and shadow).
Every attribute is a property too, as React 19, Vue and Svelte set them, and `await element.ready` waits for the
picture. It fires `hata-load` when drawn and `hata-error` when there is no flag for the code; then it draws nothing,
takes no room, and says why once on the console. These are the family's conventions, from
[Kyuubu](https://github.com/johnmorrisdotca/kyuubu)'s `<kyuubu-cube>`.

## A page that allows no scripts

For a site that allows no scripts, an iframe of the demo's embed page, which takes the same attributes as its query:

```html
<iframe src="https://johnmorrisdotca.github.io/hata/embed.html?code=JP-13&amp;shape=round&amp;size=48" title="Flag of Tokyo" width="56" height="56" style="border:0" loading="lazy"></iframe>
```

## In a framework

In a framework, import the definition once and use the tag:

```ts
import "@johnmorrisdotca/hata/element/define";
// React 19: <hata-flag code="FR-20R" size={32} />
// Vue: <hata-flag code="FR-20R" size="32" /> (with isCustomElement for "hata-")
// Svelte: <hata-flag code="FR-20R" size="32" />; Angular: CUSTOM_ELEMENTS_SCHEMA
```

## The builder

The [demo](https://johnmorrisdotca.github.io/hata/)'s detail panel has an **Embed this flag** builder: choose the
shape, the height, the language, the border, the shadow and the theme, see it live, and copy the exact code as a
custom element, a plain `<img>` of the CDN's file (framed by CSS as the package frames it), a data: URI, an iframe,
an ES module, React, Vue, Svelte or Angular. The builder is one self-contained module,
[`demo/embed-builder.js`](https://github.com/johnmorrisdotca/hata/blob/main/demo/embed-builder.js), that names no product: Hata's options and the code only Hata
writes are in [`demo/embed-hata.js`](https://github.com/johnmorrisdotca/hata/blob/main/demo/embed-hata.js).

See also [the flag element and events](element-and-events.md) and [embedding flags](../embeds.md).
