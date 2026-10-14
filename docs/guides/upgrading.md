---
title: Upgrade and migrate flag imports
section: upgrading
order: 11
description: Retain native SVG and source semantics when adopting the docs.
---

## Adopt the documentation site

This branch does not bump a version or release a package. Existing public imports and wildcard raw assets remain available. Named drawing entries use the same existing SVG modules. The API index retains legacy anchors and links to full reference pages; local search and Markdown/llms twins do not need a hosted service. The complete [changelog](../../CHANGELOG.md) retains the existing 1.x history.

## Move from a flag icon set

A Hata import gives SVG text at its original proportions, not a CSS class or a universally square flag. Decide whether you need a whole flag, an adapted drawing or an explicit crop. Preserve author/licence metadata rather than applying the package licence to every image. Keep language labels and status/variant choices explicit. Major-version CDN pins are independent from package-manager locks; update asset and JavaScript versions together when intentionally upgrading.
