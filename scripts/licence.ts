// What Commons says a file's licence is, sorted into the kinds this package can ship under MIT with a notice.
//
// The licence read is the one Commons itself puts first for the file (its extended metadata's License and
// LicenseShortName, which come from the licence templates on the file's page). Only these are shipped:
//
//   - public-domain: the file, or the design it draws, is in the public domain (PD-…, often because a flag is a
//     government work or too simple to be copyrighted);
//   - cc0: given to the public domain by its author;
//   - cc-by: Creative Commons Attribution, which asks only that the author be credited (NOTICE.md does, and so
//     does each flag's manifest entry).
//
// Everything else is left out of the package and listed in docs/left-out.md for the maintainer to decide: CC
// BY-SA (share-alike would bind every user of the package to it), GFDL, and anything Commons does not state in a
// form read here. A file whose first licence is share-alike but whose page also carries a public-domain
// template is still left out, and listed apart, because which of the two covers the drawing is a judgement.

// "accepted": a licence outside these, brought in by the maintainer's decision (ACCEPTED in data-config.ts), with the decision in its name.
type LicenceKind = "public-domain" | "cc0" | "cc-by" | "accepted";

type Licence =
  | { shipped: true; kind: LicenceKind; name: string; url: string | null }
  | { shipped: false; kind: "cc-by-sa" | "gfdl" | "other"; name: string; url: string | null; publicDomainTemplate: boolean };

const classify = (metadata: Readonly<Record<string, string>>, templates: readonly string[]): Licence => {
  const code = (metadata.License ?? "").toLowerCase().trim();
  const name = metadata.LicenseShortName ?? metadata.UsageTerms ?? metadata.License ?? "not stated";
  const url = metadata.LicenseUrl ?? null;
  const publicDomainTemplate = templates.some((template) => /^Template:(PD-|Pd-|PD |Public domain)/i.test(template));
  if (code === "cc0" || /^cc0\b/i.test(name)) return { shipped: true, kind: "cc0", name, url };
  if (code.startsWith("pd") || /^public domain$/i.test(name)) return { shipped: true, kind: "public-domain", name, url };
  if (/^cc-by-\d/.test(code)) return { shipped: true, kind: "cc-by", name, url };
  if (/^cc-by-sa-/.test(code)) return { shipped: false, kind: "cc-by-sa", name, url, publicDomainTemplate };
  if (/gfdl/.test(code)) return { shipped: false, kind: "gfdl", name, url, publicDomainTemplate };

  return { shipped: false, kind: "other", name, url, publicDomainTemplate };
};

// The restrictions Commons lists that are not about copyright: an insignia's use may be limited by law,
// a trademark, a personality right. Kept in each flag's manifest entry as Commons spells them.
const restrictionsOf = (metadata: Readonly<Record<string, string>>): string[] =>
  (metadata.Restrictions ?? "")
    .split(/[|,]/)
    .map((one) => one.trim())
    .filter((one) => one !== "");

export { classify, restrictionsOf };
export type { Licence, LicenceKind };
