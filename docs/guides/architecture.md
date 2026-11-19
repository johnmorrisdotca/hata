---
title: Architecture and source data
section: explanation
order: 9
description: Read the complete original source tree and generation boundaries.
---

## Original architecture

```text
src/
├── index.ts            the main entry: the codes, flagCode, flagUrl, and the helpers from svg.ts
├── svg.ts              aspectOf, frame and toDataUri: pure string work on a flag's SVG
├── load.ts             the "/load" entry: a flag by its code, by dynamic import, framed as measured
├── names.ts            the "/names" entry: each flag's place in English and Japanese, and its aspect ratio
├── organisations.ts    the "/organisations" entry: the flags of international organisations by their "org:" id
├── search.ts           the "/search" entry: each flag's colours and tags, and the flags that have the ones asked for
├── organisations.data.ts   the organisations' records (id, names, drawing, terms): the one place to add a flag
├── custom.ts           the "/custom" entry: flags a page registers itself, as custom:<slug>, from a data-door source
├── custom-svg.ts       the check on a page's SVG: an allowlist, then written again from what was read
├── dates.ts            a date as a day, a month or a year, compared as text (`variantOn`, `flag(code, { date })`)
├── data-door.ts        the family's data door, copied unchanged from kazoku-ui: a source's licence and credit, and its checks
├── element.ts          the "/element" entry: <hata-flag>
├── element-define.ts   the "/element/define" entry: registers <hata-flag>
├── reflect.ts          an element's attributes as properties too, the family's way
├── bind.ts             the "/bind" entry: the framework-free core of the typed components (props, the inline SVG, a cache a server can fill)
├── sheets.ts           the "/sheets" entry: flagCss (a class for each flag) and flagSprite (a symbol for each flag), for the flags a page names
├── react.ts            the "/react" entry: the React component
├── vue.ts              the "/vue" entry: the Vue component
├── svelte/             the "/svelte" entry: Flag.svelte, copied to dist/svelte by scripts/build-extras.ts
├── react-native.ts     the "/react-native" entry: createFlag(SvgXml), the React Native component
├── manifest.ts         the "/manifest" entry: every flag's record, and the codes left out
├── manifest.types.ts   the shapes of a flag's record and a code left out
├── manifest-framing.types.ts  the shapes of a frame and its crop
├── version.ts          the package's version
├── data/               written by scripts/build-data.ts: the codes, the loaders, the variants' loaders, the names, the frames, the manifest
└── flags/              written by scripts/build-data.ts: the "/flags/<code>" entries, the "<code>--<id>" variants, and the ".1x1" and ".4x3" drawings
```

`scripts/build-data.ts` (`pnpm data`) makes `src/flags/` and `src/data/` from the inputs in `data-sources/` and the
flag sets in `node_modules`, with no network and no browser, and checks every input's SHA-256 first; run twice, it
leaves the tree as it was. `scripts/choose.mjs` (`pnpm data:choose`) is the comparison that decides which drawing
ships; `scripts/framing.mjs` (`pnpm data:framing`) measures how each flag is framed; `scripts/colours.mjs` (`pnpm data:colours`) measures each flag's colours, and `scripts/colour-data.ts` names them; `scripts/tags.mjs` (`pnpm data:tags`) measures each flag's bands, `scripts/fetch-tags.ts` (`pnpm data:tags:fetch`) asks Wikidata and Commons what is on it, and `scripts/tag-data.ts` makes the tags by the tables in `scripts/tag-config.ts`; `scripts/rasters.ts` (`pnpm rasters`) makes the PNG and WebP files and the zip for the demo's site, and `scripts/sheets.ts` (`pnpm css`, `pnpm sprite`) writes a stylesheet or sprite of the flags named; `scripts/optimise.ts` is the SVGO settings and the safety checks; `scripts/data-config.ts` holds the few
things decided by hand. Tests sit beside the code (`*.test.ts`). `scripts/` also builds the demo and its API page,
checks every export's documentation and checks the package as npm packs it; `demo/` is the page and `e2e/` its
browser tests.


## Documentation generation

The data writer owns generated flag comments. Its offline --docs-only mode refreshes examples without selecting drawings or changing data-source snapshots. The same transform is used by ordinary generation. Explicit catalogue entries point to the existing modules; wildcard flag and raw SVG exports remain available. The site indexes each direct export and type-checks browser examples without attempting DOM work on a server.
