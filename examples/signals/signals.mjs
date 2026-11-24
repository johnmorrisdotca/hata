import { frame } from "@johnmorrisdotca/hata";
import { signalFlag, signalMeaning, signalsFor } from "@johnmorrisdotca/hata/signals";

// A hoist that spells a word: one flag a letter, each an SVG string framed like a country's; its id begins with "ics:".
const hoist = signalsFor("SOS 7");
const round = frame(signalFlag(hoist[0] ?? "") ?? "", { shape: "round", label: "S" });
console.log(hoist.join(" "), round?.includes("clipPath"));
console.log(signalMeaning("ics:o"), signalMeaning("ics:o", "ja"));
