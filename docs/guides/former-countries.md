---
title: Former countries
section: how-to
order: 24
description: Every ISO 3166-3 code and the larger states that never had one, with the flag each flew, its dates, the flag of the law and the flag in use, and what is left out and why.
---

A medal table, an atlas of 1900 or a history lesson names countries that no longer exist. Hata has the flags of 43 of them, each under a code that no present-day country uses, with the days each flag was in use, a source for the dates and the licence of the drawing. Of the 30 codes of ISO 3166-3 (the standard for names that countries have left behind) 24 have a flag, and the other six are listed with the reason there is none.

```mjs
import { flag } from "@johnmorrisdotca/hata/load";
import { flagOn, leftOut, manifest, variantOn } from "@johnmorrisdotca/hata/manifest";

// A state with no ISO 3166-3 code has a code of Hata's own: X and two letters ("XOT", the Ottoman Empire).
console.log(variantOn("XOT", "1900")?.id, manifest("XOT")?.historical?.from);
// Dahomey's flag is the one picture Benin flies again today, under two codes.
console.log(manifest("DYBJ")?.sameAs, (await flag("DYBJ")) === (await flag("BJ")));
// Austria-Hungary had no flag in law: its civil ensign is the flag in use, and the answer says why.
const ensign = variantOn("XAH", "1900", { role: "in-use" });
console.log(ensign?.id, flagOn("XAH", "1900").none?.kind);
// What is not here has a reason.
console.log(leftOut("SKIN")?.reason.slice(0, 30));
```

## The codes

- **ISO 3166-3 codes are four letters** (`SUHH`, `DDDE`, `DYBJ`): the code the place had, then the two letters of its successor, or `HH` where it had none. Each is the place's code here. The code it had before (`DY`, `HV`, `YD`) and its three-letter code (`DHY`, `HVO`, `YMD`) find it too, in any case, unless a present-day country has taken the letters (`BY` is Belarus, so the Byelorussian Soviet Socialist Republic is `BYAA` only).
- **A state with no ISO 3166-3 code has a code of Hata's own: `X` and two letters.** ISO 3166 keeps `XAA` to `XZZ` for users and never gives them to a country, so such a code can never be an official code of anything, now or later. They are `XAH` Austria-Hungary, `XOT` the Ottoman Empire, `XPR` Prussia, `XHW` the Kingdom of Hawaii, `XGE` the German Empire, `XSV` South Vietnam, `XKR` the Korean Empire, `XQI` the Qing Empire, `XUA` the United Arab Republic, `XTX` the Republic of Texas, `XIT` the Kingdom of Italy `XZB` the Sultanate of Zanzibar and `XCS` the Confederate States of America, `XPS` the Papal States, `XSD` the Kingdom of Sardinia and `XSM` Siam.
- **The IOC's codes** (`FRG`, `BOH`, `WIF`) stay for the places that had no ISO 3166-3 code before this list.

## The flag of a day, the law's and the one in use

Every former country added with this guide has dated flags, found with `variantOn(code, date)` and `flag(code, { date })` as for a present-day country (see [historic flags](historic-flags.md)), and only inside the years the state existed. A flag is the legal flag, the flag in use or both. Most are both. Three states are not, and each says why in `roleNote`: Austria-Hungary had no national flag in law (the 1867 compromise left each half its own), the Qing Empire's Yellow Dragon Flag was made for the dynasty's ceremonies and ships and came to be its national flag without a law, and the Kingdom of Hawaii's flag of 1816 has no decree that anybody has found.

## A territory flies its country's flag

The Territory of the Afars and the Issas, the French Southern and Antarctic Territories, Dronning Maud Land, Johnston Island, the Midway Islands, Wake Island, the Panama Canal Zone and the United States' other Pacific islands flew the flag of the country that governed them, and had none of their own. Each is a code of its own and draws the one picture (`manifest("NQAQ")?.sameAs` is `"NO"`), the way West Germany shares Germany's. The years of the code are in the entry; the days the flag flew over it are in its variant.

## What is left out, and why

`leftOut(code)` gives the reason for each. Six ISO 3166-3 codes have no flag: the British Antarctic Territory (no source says that the drawing on Commons is the ensign of 1969), Canton and Enderbury Islands (run jointly by Britain and the United States, each flying its own), the New Hebrides (a condominium of Britain and France, with no flag of its own), the Neutral Zone (no state's land), Sikkim (its last flag is under CC BY-SA, which Hata does not ship) and East Timor (Portugal's and then Indonesia's flag). Two states that never had a code are left out for their licence (Gran Colombia and Tanganyika, drawings under CC BY-SA), and two are held for the maintainer's decision because their status is disputed today: Tibet (1912 to 1950) and Manchukuo. The full list, with each reason, is [docs/left-out.md](../left-out.md); [the list of every former country](../historical.md) has every code, alias, year and flag.

Continue with [disputed, former and historic flags](places-with-more-than-one-flag.md).
