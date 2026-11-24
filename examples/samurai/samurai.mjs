import { frame } from "@johnmorrisdotca/hata";
import { samuraiFlag, samuraiInfo, samuraiName } from "@johnmorrisdotca/hata/samurai";

// A banner is an SVG string, framed like a country's; its id begins with "samurai:", and its record says what is documented.
const nobori = await samuraiFlag("samurai:sanada-rokumonsen");
const round = nobori === null ? "" : frame(nobori, { shape: "round", label: samuraiName("samurai:sanada-rokumonsen", "ja") ?? "" });
console.log(nobori?.startsWith("<svg"), round.includes("clipPath"), samuraiName("samurai:sanada-rokumonsen", "ja"));
console.log(samuraiInfo("samurai:sanada-rokumonsen")?.status);
