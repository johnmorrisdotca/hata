// The flags of international organisations taken from Wikimedia Commons: only bodies whose own pages state no terms for their flag or emblem
// (docs/decisions.md, "Organisations", and NOTICE.md say which pages were read, on which day, and what they said). A body whose own terms or law
// restrict its flag or emblem is never here, whatever its Commons licence. Each file's licence is read from Commons and only public domain and
// CC0 ship; the fetch is scripts/fetch-organisations.ts and the data is made by scripts/draw-organisations.ts.
interface OrganisationFile {
  slug: string;
  name: { en: string; ja: string };
  file: string;
  /** The page of the body read for terms, and what it said on the day (2026-11-24). */
  terms: { url: string; says: string };
}

const READ = "2026-11-24";
const NONE = "No terms for the flag or emblem were found on the page";
const o = (slug: string, en: string, ja: string, file: string, url: string, says: string): OrganisationFile => ({ slug, name: { en, ja }, file, terms: { url, says } });

const ORGANISATION_FILES: readonly OrganisationFile[] = [
  o("caricom", "Caribbean Community (CARICOM)", "カリブ共同体", "Flag of CARICOM.svg", "https://caricom.org/", `${NONE}: its footer reads "© Copyright 2026, All Rights Reserved | Caribbean Community Secretariat", a notice for the site, and its privacy and data-protection pages say nothing of the flag.`),
  o("arab-league", "League of Arab States", "アラブ連盟", "Flag of the Arab League.svg", "http://www.lasportal.org/en/Pages/default.aspx", `${NONE} (the portal's page carries an all-rights-reserved notice for the site and says nothing of the flag; on 2026-11-24 the page itself did not load, so the earlier reading of 2026-11-13 stands).`),
  o("cis", "Commonwealth of Independent States", "独立国家共同体", "Flag of the CIS.svg", "https://eccis.org/en/about-cis", `${NONE}; it offers the emblem as an SVG download and states no terms of use.`),
  o("commonwealth", "Commonwealth of Nations", "英連邦（コモンウェルス）", "Infobox Commonwealth of Nations flag.svg", "https://thecommonwealth.org/commonwealth-secretariat-logo-kit-and-guidelines", `${NONE}: it covers the Secretariat's logo ("used exactly as supplied and not reproduced or altered in any way") and says nothing of the flag.`),
  o("andean-community", "Andean Community", "アンデス共同体", "Flag of the Andean Community of Nations.svg", "https://www.comunidadandina.org/", `${NONE}: its footer reads "© 2026 Secretaría General de la Comunidad Andina | ® Derechos Reservados", and a disclaimer link whose text was not shown; the logo is shown with no usage rules.`),
  o("oic", "Organisation of Islamic Cooperation (the flag of 1981 to 2011)", "イスラム協力機構（1981年から2011年の旗）", "Flag of the Organization of Islamic Cooperation (1981–2011).svg", "https://www.oic-oci.org/", `${NONE}: its footer reads "© 2026 Organisation of Islamic Cooperation. All rights reserved.", a notice for the site, with no terms link and nothing on the flag.`),
];

export { ORGANISATION_FILES, READ };
export type { OrganisationFile };
