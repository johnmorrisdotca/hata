---
title: Embed a flag in an iframe
section: how-to
order: 17
description: Show a flag on a page that allows no scripts, with an iframe of the demo's embed page.
---

A site that allows no scripts can still show a flag: an iframe of the demo's embed page needs no code of your own. The address chooses the flag (`code`), its frame (`shape`), its height (`size`), the language of its name (`lang`) and the theme (`theme`); `border` and `shadow` are switches. The keys are the attribute names of `<hata-flag>`.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hata in an iframe</title>
  </head>
  <body>
    <iframe
      src="https://johnmorrisdotca.github.io/hata/embed.html?code=JP-13&shape=round&size=48"
      title="Flag of Tokyo"
      width="56"
      height="56"
      loading="lazy"
      style="border: 0"
    ></iframe>
  </body>
</html>
```

The page draws one flag and nothing else, stores nothing and loads nothing from anywhere else. When the flag is drawn it tells the page around it with `postMessage({ hata: "load", code })`, or `{ hata: "error", code, reason }` when there is no flag for the code; check `event.origin` before you trust either. The [flag builder](https://johnmorrisdotca.github.io/hata/builder.html) writes this frame, and the other formats, for the flag you choose.

The [embed builder](https://johnmorrisdotca.github.io/hata/builder.html) writes this code for you. Its code is in the family's embed panel: a tab for each way to put the flag in a page (custom element, `<img>`, a `data:` URI, iframe, ES module, React 19, Vue, Svelte, Angular, plain HTML and the iframe address), Copy, a link that opens the embed page with your choices, this guide, and the credit of the chosen flag's drawing (its author, its licence and where it is from). Only the choices that differ from the defaults are in the code. "Copy a link to this flag" and "Start again" sit beside Copy, and the tab you chose is kept in the address.
