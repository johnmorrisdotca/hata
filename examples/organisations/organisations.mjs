import { frame } from "@johnmorrisdotca/hata";
import { organisationFlag, organisationName } from "@johnmorrisdotca/hata/organisations";

// An organisation's flag is an SVG string, framed like a country's; its id begins with "org:".
const svg = organisationFlag("org:eu");
const round = svg === null ? "" : frame(svg, { shape: "round", label: organisationName("org:eu", "ja") ?? "" });
console.log(svg?.startsWith("<svg"), round.includes("clipPath"), organisationName("org:eu", "ja"));
