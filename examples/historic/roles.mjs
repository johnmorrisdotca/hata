import { flag } from "@johnmorrisdotca/hata/load";
import { variantOn } from "@johnmorrisdotca/hata/manifest";

const legal = variantOn("CA", "1962-09-29");
console.log(legal?.id, legal?.role);                    // "union-flag" "legal"
console.log(legal?.other?.id, legal?.other?.role);      // "red-ensign-1957" "in-use"
console.log(legal?.other?.note?.why);                   // why: the government kept the Union Flag as the national flag in law
console.log(legal?.other?.note?.source);                // the page that says so
console.log(variantOn("CA", "1962-09-29", { role: "in-use" })?.id); // "red-ensign-1957"
console.log(variantOn("US", "1950")?.other);            // null: one flag was both
console.log((await flag("CA", { date: "1962-09-29", role: "in-use" }))?.startsWith("<svg"));
