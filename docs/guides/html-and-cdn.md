---
title: Plain HTML and CDNs
section: how-to
order: 13
description: Put a flag on a plain page with one script tag from jsDelivr or unpkg.
---

A page needs no build step. The `element/define` entry registers the `<hata-flag>` tag; a script tag from a CDN loads it, and the tag draws the flag named by its `code`. Each flag is a file of its own, fetched when the tag asks for it.

## jsDelivr

jsDelivr serves the package's files as they are, so the address is the built file.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hata from jsDelivr</title>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/element-define.js"></script>
  </head>
  <body>
    <p>Tokyo: <hata-flag code="JP-13" label="Tokyo"></hata-flag></p>
  </body>
</html>
```

## unpkg

unpkg serves the package's own files too; `?module` makes it rewrite the imports inside them for the browser.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hata from unpkg</title>
    <script type="module" src="https://unpkg.com/@johnmorrisdotca/hata@1/dist/element-define.js?module"></script>
  </head>
  <body>
    <p>Tokyo: <hata-flag code="JP-13" label="Tokyo"></hata-flag></p>
  </body>
</html>
```

## Notes

- Use `<script type="module">`. A classic script cannot `import`.
- Pin a major version in the address (`@johnmorrisdotca/hata@1`) so the page stays as it is.
- The attributes are in [the flag element and its events](element-and-events.md). If nothing appears, see [troubleshooting](troubleshooting.md).
