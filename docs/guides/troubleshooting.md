---
title: Troubleshooting and FAQ
section: troubleshooting
order: 10
description: Interpret missing drawings, names and host loading errors.
---

## Understand absence

`frame` and `aspectOf` return null for unusable SVG input. `flagCode`, `flagUrl`, `flagName`, `flagAspect`, `manifest` and the asynchronous loaders can return null for unavailable results as their reference explains. `variantsOf` returns an empty list when there are no stored alternatives. `leftOut` explains only a known omission; null also includes an unknown code or one with a primary flag. An optional metadata field can be absent rather than an invented empty value.

## Diagnose a host

Await a loader, choose a supported variant id and keep full region codes. Use the element only in a browser with the registration import. Check your bundler's dynamic chunks or self-hosted SVG base when an asset cannot load. A data URI and an image URL need different CSP allowances; follow the existing CSP-safe embed recipe rather than disabling CSP. If a framed flag loses a colour, compare whole/auto and read the recorded crop decision.
