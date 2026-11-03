import japan from "@johnmorrisdotca/hata/flags/jp";
import { aspectOf, flagUrl, isFlagCode, type FlagCode } from "@johnmorrisdotca/hata";

const code: FlagCode = "JP-13";
console.log(japan.startsWith("<svg"), aspectOf(japan), flagUrl(code), isFlagCode("XX"));

// @ts-expect-error "XX" is not a flag's code
const unknown: FlagCode = "XX";
console.log(unknown);
