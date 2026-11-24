import { frame } from "@johnmorrisdotca/hata";
import { militaryFlag, militaryInfo, militaryName } from "@johnmorrisdotca/hata/military";

// A military flag is an SVG string, framed like a country's; its id begins with "mil:", and its record has its dates and its source.
const ensign = militaryFlag("mil:gb-white-ensign");
const round = ensign === null ? "" : frame(ensign, { shape: "round", label: militaryName("mil:gb-white-ensign", "ja") ?? "" });
console.log(ensign?.startsWith("<svg"), round.includes("clipPath"), militaryInfo("mil:gb-white-ensign")?.dates?.from);
