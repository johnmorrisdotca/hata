// The eight small emblem files (MODULES-1606). The byte size was a guess; the look is written in the audit.
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("the small emblem files", () => {
  it("were looked at, and the drawings were kept", () => {
    const audit = readFileSync("docs/audit-2026-10.md", "utf8");
    expect(audit).toContain("were looked at on 2026-11-27");
    expect(audit).toContain("Kenya the shield and two spears");
    expect(audit).toContain("None is the bands with the emblem left off");
    expect(audit).toContain("No fuller public-domain file was substituted");
    expect(audit).toContain("A government construction sheet was not fetched");
    expect(audit).not.toContain("are likely simplified versions, which need a person to look");
  });
});
