import { flag } from "@johnmorrisdotca/hata/load";
import { flagName } from "@johnmorrisdotca/hata/names";

// A server reads the same SVG a browser does: pure, no DOM, no browser globals.
const svg = await flag("JP-13", { shape: "round" });
const page = `<!doctype html><title>${flagName("JP-13", "ja")}</title>${svg}`;
console.log(page.length > 300, flagName("JP-13", "ja"));
