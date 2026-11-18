---
title: Use the flag element and events
section: how-to
order: 7
description: Register once and keep loading and accessibility explicit.
---

## Use the native API

```ts
import "@johnmorrisdotca/hata/element/define";
import { FLAG_ELEMENT_ATTRIBUTES } from "@johnmorrisdotca/hata/element";
console.log(FLAG_ELEMENT_ATTRIBUTES);
```

The side-effect entry registers `<hata-flag>` in a browser. Import it once before creating the element; use the unregistered element entry when a host controls registration. Attributes/properties include code, shape, size, width, fit, variant, label, lang, theme, border, shadow, rounded, gloss, wave and loading. Choose `lang` for its spoken name and a custom label where the context needs one.

## Optional looks

Three attributes dress the flag, and every one is off until you ask. They are for the element: the typed framework components draw the flag as it is.

```html
<hata-flag code="CA" size="96" rounded gloss></hata-flag>
<hata-flag code="JP" size="96" wave></hata-flag>
```

- `rounded` rounds the corners of the flag's box (8%, or `--hata-flag-corner`). The corners are clipped, so use it for a tile and not where every pixel of the flag must show. A round frame is already round.
- `gloss` lays a soft light across the flag. It is a layer over the picture: the SVG is not changed and no colour is recoloured.
- `wave` sways the picture gently, as in a light wind (`--hata-flag-wave-time` sets the period, `--hata-flag-depth` the perspective). It is a transform on the graphics card, with no timer and no script. It stands still for a reader whose system asks for reduced motion, it is paused while the flag is out of sight and runs again when it comes into view, and the flag keeps its name for a screen reader. The sway keeps the picture a little inside its box, so nothing is cropped, and the flag is never recoloured.

Each is also a property (`flag.wave = true`), as a framework sets it.

## Listen and clean up

`hata-load` and `hata-error` carry the native code/shape/reason details. Distinguish a missing flag from a module failure. Remove host listeners when removing the element. Eager loading is useful for a visible preview; lazy loading is appropriate for an off-screen embed. The original README's framework and iframe recipes remain available, including CSP-safe output and the documented builder choices.
