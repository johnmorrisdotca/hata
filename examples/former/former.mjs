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
