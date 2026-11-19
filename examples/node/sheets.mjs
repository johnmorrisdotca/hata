import { flagCss, flagSprite } from "@johnmorrisdotca/hata/sheets";

// The classes and the symbols of the flags a page uses, written to the files the page serves.
const css = await flagCss(["jp", "ca-bc"], { base: "/flags" });
const sprite = await flagSprite(["jp", "ca-bc"]);
console.log(css.includes(".hata-jp{"), sprite.includes('<symbol id="hata-ca-bc"'));
