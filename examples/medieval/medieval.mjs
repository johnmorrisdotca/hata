import { frame } from "@johnmorrisdotca/hata";
import { medievalFlag, medievalInfo, medievalName } from "@johnmorrisdotca/hata/medieval";

// A banner is an SVG string, framed like a country's; its id begins with "med:", and its record says what its source documents.
const banner = await medievalFlag("med:red-cross");
const round = banner === null ? "" : frame(banner, { shape: "round", label: medievalName("med:red-cross", "ja") ?? "" });
console.log(banner?.startsWith("<svg"), round.includes("clipPath"), medievalInfo("med:red-cross")?.dates?.from);
