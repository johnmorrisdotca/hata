---
title: Disputed, former and historic flags
section: how-to
order: 23
description: Flags a place has had or has at once: disputed and alternative flags, the former countries a medal table names, and the flag of a date.
---

## Disputed and alternative flags

A place can have more than one flag in real use. Hata ships them all, with a `status` for each, and **takes no political
side**: the default is the flag of the authority the world recognises (Afghanistan's Islamic Republic, which holds its seat
at the United Nations), or the place's own flag where it has one (Saint Helena's blue ensign, not the Union Flag), and
every other flag is one call away, never hidden and never the default by accident.

```ts
import { variantsOf, manifest } from "@johnmorrisdotca/hata/manifest";
import { flag } from "@johnmorrisdotca/hata/load";
import taliban from "@johnmorrisdotca/hata/flags/af--de-facto";

variantsOf("AF");
// [ { id: "republic", status: "official", default: true, from: "2013", … },
//   { id: "de-facto", status: "de-facto", default: false, from: "2021-08-15", why: "…", source: "https://…", module: "af--de-facto", drawing: { file, licence, author, … } } ]
manifest("AF")?.disputed;                             // true: two authorities claim it
await flag("AF");                                     // the Republic's tricolour
await flag("AF", { variant: "de-facto" });            // the Taliban's flag, framed like any flag: { shape, fit, label }
await flag("GB-NIR", { variant: "ulster-banner" });   // Northern Ireland has no flag of its own, so flag("GB-NIR") is null
```

```html
<hata-flag code="AF" variant="de-facto" size="48"></hata-flag>
```

- **`variantsOf(code)`** (from `/manifest`) lists a place's flags, the default first: an `id`, an English and a Japanese `name`, a `status`
  (`official`, `de-facto`, `historical` or `local`), `from` and `until`, a `why`, a `source`, the `module` that has its SVG and the `drawing` it comes
  from. `manifest(code)` carries the same list with `disputed` and `defaultVariant`.
- **`flag(code, { variant })`**, `flagDataUri` and `<hata-flag variant>` draw one, framed like any flag; an unknown id gives `null`.
- **A place with no flag of its own by default** (Northern Ireland, since 1973) is left out of `FLAG_CODES`, has a reason in `LEFT_OUT`, and its flags in
  use are its variants, asked for by name. **A flag in real use that is not the place's official symbol** (Brittany's Gwenn-ha-du) is its default with the status `local`.
- **Deprecated** (gone in 2.0): Martinique's `local` and `/flags/mq--local`, aliases of `martinique` and `/flags/mq`.

[The variant list](../variants.md) lists every variant with its reason, source, drawing and licence, and
[the decisions](../decisions.md) says why each default was chosen and what is not offered (Libya's and Myanmar's earlier flags).
See also [choose a flag variant explicitly](variants.md).

## Former countries

A medal table, a record book or a history of a sport still names countries that no longer exist. Hata has the flag of 39 of them, each under a code no present-day
country uses: the ISO 3166-3 code where that standard has one (`SUHH` the Soviet Union, `DDDE` East Germany, `YUCS` Yugoslavia, `CSHH` Czechoslovakia and more: 24 of its 30), else the IOC's
(`FRG` West Germany, `BOH` Bohemia, `WIF` the West Indies Federation), else a code of Hata's own, `X` and two letters (`XAH` Austria-Hungary, `XOT` the Ottoman Empire, `XHW` the Kingdom of Hawaii; [former countries](former-countries.md) lists them). The codes a table is likely to hold find them too, in any case: `SU`, `DD`, `YU`, `BU` and the IOC's
`URS`, `GDR`, `TCH`, `YUG`, `SCG`, `ZAI`, `RHO`, `BWI`. They are `FLAG_ALIASES`.

```ts
import { flag } from "@johnmorrisdotca/hata/load";
import { manifest } from "@johnmorrisdotca/hata/manifest";

await flag("URS");                         // the Soviet Union's flag of 1955 to 1991 (also "SU", "SUHH")
await flag("YUG", { variant: "kingdom" }); // Yugoslavia's flag before 1941, a variant with its dates
manifest("FRG")?.sameAs;                   // "DE": West Germany's flag is Germany's, the one picture
manifest("SUHH")?.historical;              // { from: "1922", until: "1991", aliases: ["SU", "SUN", "URS"] }
```

[The former countries list](../historical.md) has every code, alias, year and reason; [the decisions](../decisions.md#what-to-know-about-the-former-countries) the notes.

## Historic flags, and the flag of a date

Countries that still exist have had other flags. Hata has the earlier national flags since 1900 of 35 of them, each a `historical` variant with `from`, `until`
(the day of a change belongs to the new flag), a `source` and its kind. **`flag(code, { date })`** loads the flag of a day, **`variantOn(code, date)`** from `/manifest`
finds its variant, and **`<hata-flag date>`** draws it.

What the law made a country's flag and what its people flew were sometimes two flags, and Hata keeps both, each with a role (`legal`, `in-use` or both) and, where the
two differ, the reason and its source. The legal flag is the default; `{ role: "in-use" }` (`which="in-use"` on the element) picks the other; `flagOn()` adds the
drawing, the other flag and, where there is nothing to draw, the reason in words.

```ts
import { flag, flagOn } from "@johnmorrisdotca/hata/load";
import { variantOn } from "@johnmorrisdotca/hata/manifest";

variantOn("CA", "1962-09-29")?.id;                        // "union-flag", Canada's legal flag; "1965-02-15" is "maple-leaf"
variantOn("CA", "1962-09-29")?.other?.id;                 // "red-ensign-1957", the flag flown, with `note.why` and its source
await flag("CA", { date: "1962-09-29", role: "in-use" }); // the Red Ensign
(await flagOn("SUHH", "1991-12-26")).none?.reason;        // "It had ended by 1991-12-26 (its years are 1922 to 1991)."
```

Germany's flag of 1935 to 1945 is shipped for history and education only, and withheld unless asked for (`allowRestricted`, [the decisions](../decisions.md#restricted-flags)). The [Historic flags page](https://johnmorrisdotca.github.io/hata/historic.html) shows every country in date order, the legal flag and the flag in use side by side where they differ; [historic flags and the flag of a date](historic-flags.md),
[the earlier flags list](../historical.md#earlier-flags-of-present-day-countries) and [the decisions](../decisions.md#historic-flags-of-present-day-countries) have the rest.
