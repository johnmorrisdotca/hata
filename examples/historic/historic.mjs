import { flag } from "@johnmorrisdotca/hata/load";
import { variantOn, variantsOf } from "@johnmorrisdotca/hata/manifest";

// The flag a country had on a day: Canada's Red Ensign in 1962, the Maple Leaf from 1965-02-15, and today's flag after the newest change.
const ensign = variantOn("CA", "1962-09-29");
const leaf = variantOn("CA", "1965-02-15");
const earlier = await flag("CA", { date: "1962-09-29" });
const unknown = await flag("CA", { date: "1850" }); // null: no flag is known for that day, which is not the same as no flag
console.log(ensign?.id, leaf?.id, earlier === (await flag("CA", { variant: "red-ensign-1957" })), unknown, variantsOf("US").length);
