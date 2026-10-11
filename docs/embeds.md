# Embed a flag

[Build a flag](https://johnmorrisdotca.github.io/hata/builder.html) to choose a country or region, shape, display size, pixel width, language, spoken label, border, shadow and theme. The preview and code follow each choice; Copy link shares the complete setup in the builder's URL hash. The builder offers a custom element, a static image or data URI, an iframe, an ES module, React 19, Vue, Svelte, Angular, plain HTML and an iframe URL on its own.

The gallery's existing inline builder uses the same shared code writers and retains its flag-specific static-image and data-URI support.

## Custom element

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@johnmorrisdotca/hata@1/dist/element-define.js"></script>
<hata-flag code="JP" width="120" size="medium" lang="en" label="Japan"></hata-flag>
```

`width` is a CSS pixel width; the height follows the flag's proportions. Without it, `size="small"`, `medium` and `large` select heights of 24, 48 and 96 pixels. The existing numeric `size="48"` remains a supported height in pixels. With neither attribute, the flag keeps its existing inline 1em size. Shapes are own proportions, 4:3, square and round. Language defaults to the surrounding document, and theme defaults to the device's light/dark preference.

All attributes are reflected as properties. Booleans are off with off, false, no or 0, including uppercase and surrounding whitespace. The element works in a shadow root and under an alternate tag registered with `defineFlag(tag)`. Loaded/error events bubble and are composed, with the same code/shape/reason detail as before.

## Iframe

The standard iframe page is `embed/`:

```html
<iframe src="https://johnmorrisdotca.github.io/hata/embed/?code=JP&amp;width=120&amp;lang=ja"
  title="Flag of Japan" width="128" height="88"
  style="border:0;max-width:100%" loading="lazy"></iframe>
```

The builder calculates frame width and height from the selected flag's proportions, leaving room for its border and shadow. The page validates its query parameters, uses a transparent background, does not scroll internally and is marked noindex. It reads no cookies or stored preferences and imports its local built files. Existing embed.html links and numeric sizes continue to work.

Codes are selected from the built flag list. Invalid codes fall back to JP; unrecognised shapes, sizes, themes, fits and languages are omitted. Width and legacy pixel height must be finite values from 12 through 2048. Labels remain text, with a 200-character limit. Border and shadow accept enabled values 1, true, on or a bare parameter; disabled spellings remain off.

## Messages to the host

The iframe sends the same JSON-safe native event detail in an envelope:

```json
{ "type": "hata-load", "detail": { "code": "JP", "shape": "own" } }
```

An error has type hata-error and adds its reason. The payload contains flag data, not the spoken label or other personal information. A host checks both origin and source before using a message:

```js
const frame = document.querySelector("iframe");
window.addEventListener("message", (event) => {
  if (event.origin !== "https://johnmorrisdotca.github.io") return;
  if (event.source !== frame.contentWindow) return;
  if (event.data?.type === "hata-load") {
    console.log(event.data.detail.code, event.data.detail.shape);
  }
});
```

The legacy embed.html message format remains available on that legacy page. New integrations should use embed/ and the event envelope above.

## Coverage

The standalone builder checks the real FLAG_ELEMENT_ATTRIBUTES list against its rows and explicit reasons for excluded options. Fit follows each flag's curated framing; loading is eager in the preview and lazy on the host iframe. The browser checks cover language and URL restoration, every host format, phone layout, safe labels, query validation, reflected false flags, shadow-root rendering and native/message event agreement.

## Released crops and flag variants

The builder and canonical frame retain native fit choices auto, whole, crop,
cover, hoist and contain. Variant ids come from variantsOf(code) and the gallery
panel; an empty variant uses the native default. The frame validates ids for
the chosen place. Image, data-URI and element previews use the variant's own
proportions. Brittany FR-BRE uses the released public-domain Gwenn-ha-du drawing
and its native local status. Existing square crops and disputed-place variants
are preserved; nothing is redrawn by the builder.

Places without a default flag, such as Northern Ireland, are available when a
shipped variant is selected explicitly. The builder withholds code until a valid
variant id is supplied, following the native package's decision to have no default.
