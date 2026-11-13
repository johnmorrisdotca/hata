import { customCreditLine, registerFlags } from "@johnmorrisdotca/hata/custom";
import { flag } from "@johnmorrisdotca/hata/load";

// A page's own flag: a set that says whose it is, and records of an id (custom:...), names and an SVG.
const club = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><path fill="#036" d="M0 0h3v2H0z"/><circle cx="1.5" cy="1" r=".5" fill="#fc0"/></svg>';
const done = await registerFlags({
  kind: "records",
  info: {
    id: "harbour",
    name: { en: "Harbour FC", ja: "ハーバーFC" },
    credit: { en: "Harbour FC crest, drawn by the club", ja: "ハーバーFCの紋章（クラブ作成）" },
    licence: { name: "Used with the club's permission", url: "https://example.org/permission" },
    url: "https://example.org/club",
    retrieved: "2026-11-13",
  },
  records: () => [{ id: "custom:harbour-fc", name: { en: "Harbour FC", ja: "ハーバーFC" }, svg: club, group: "Clubs" }],
});
// It is drawn through the same call as a country's.
console.log(done.added.join(), (await flag("custom:harbour-fc", { shape: "round" }))?.includes("clipPath"), customCreditLine("en"));
