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
├── element.ts          the "/element" entry: <hata-flag>
├── element-define.ts   the "/element/define" entry: registers <hata-flag>
├── reflect.ts          an element's attributes as properties too, the family's way
├── manifest.ts         the "/manifest" entry: every flag's record, and the codes left out
├── manifest.types.ts   the shapes of a flag's record, a frame and a code left out
├── version.ts          the package's version
├── data/               written by scripts/build-data.ts: the codes, the loaders, the variants' loaders, the names, the frames, the manifest
└── flags/              written by scripts/build-data.ts: the "/flags/<code>" entries, the "<code>--<id>" variants, and the ".1x1" and ".4x3" drawings
```

`scripts/build-data.ts` (`pnpm data`) makes `src/flags/` and `src/data/` from the inputs in `data-sources/` and the
flag sets in `node_modules`, with no network and no browser, and checks every input's SHA-256 first; run twice, it
leaves the tree as it was. `scripts/choose.mjs` (`pnpm data:choose`) is the comparison that decides which drawing
ships; `scripts/framing.mjs` (`pnpm data:framing`) measures how each flag is framed; `scripts/optimise.ts` is the SVGO settings and the safety checks; `scripts/data-config.ts` holds the few
things decided by hand. Tests sit beside the code (`*.test.ts`). `scripts/` also builds the demo and its API page,
checks every export's documentation and checks the package as npm packs it; `demo/` is the page and `e2e/` its
browser tests.


## Documentation generation

The data writer owns generated flag comments. Its offline --docs-only mode refreshes examples without selecting drawings or changing data-source snapshots. The same transform is used by ordinary generation. Explicit catalogue entries point to the existing modules; wildcard flag and raw SVG exports remain available. The site indexes each direct export and type-checks browser examples without attempting DOM work on a server.
