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

The side-effect entry registers `<hata-flag>` in a browser. Import it once before creating the element; use the unregistered element entry when a host controls registration. Attributes/properties include code, shape, size, width, fit, variant, label, lang, theme, border, shadow and loading. Choose `lang` for its spoken name and a custom label where the context needs one.

## Listen and clean up

`hata-load` and `hata-error` carry the native code/shape/reason details. Distinguish a missing flag from a module failure. Remove host listeners when removing the element. Eager loading is useful for a visible preview; lazy loading is appropriate for an off-screen embed. The original README's framework and iframe recipes remain available, including CSP-safe output and the documented builder choices.
