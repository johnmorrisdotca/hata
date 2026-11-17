import { flag, flagOn } from "@johnmorrisdotca/hata/load";
import { variantOn } from "@johnmorrisdotca/hata/manifest";

const found = variantOn("DE", "1940");
console.log(found?.withheld, found?.restricted?.allowedFor); // true "education and history"
console.log(await flag("DE", { date: "1940" }));             // null
console.log((await flagOn("DE", "1940")).none?.reason);      // the restriction, in a sentence
console.log((await flag("DE", { date: "1940", allowRestricted: true }))?.startsWith("<svg")); // for history and education only
