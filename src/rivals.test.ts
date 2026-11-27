// The rival comparison (MODULES-1611): flag-icons 7.6.0 was read and did not replace the shipped
// 7.5.0 drawings, and Twemoji is recorded from its own README. flagpack-core was already on the page.
import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("the rival comparison", () => {
  it("keeps the shipped flag-icons 7.5.0 drawings after reading 7.6.0", () => {
    const page = readFileSync("docs/guides/sources-sizes-and-limits.md", "utf8");
    expect(page).toContain("| flag-icons 7.5.0, 4:3 (a crop, not the true proportions) |");
    expect(page).toContain("Of the 542 SVG files in its 4:3 and square folders, 20 differ from 7.5.0");
    expect(page).toContain("still chooses the Commons drawing every time");
    expect(page).toContain("The drawings made for a frame stay the 7.5.0 files");
    const japanese = readFileSync("docs/guides/ja/sources-sizes-and-limits.md", "utf8");
    expect(japanese).toContain("flag-icons 7.5.0、4:3");
    expect(japanese).toContain("7.5.0と違うのは20枚である");
    expect(japanese).toContain("どれもCommonsの絵が選ばれた");
  });

  it("records Twemoji from its README, beside the flagpack rows already there", () => {
    const page = readFileSync("docs/guides/other-flag-sets.md", "utf8");
    expect(page).toContain("flagpack-core");
    expect(page).toContain("Twemoji v17.0 follows Unicode 17.0 and Emoji 17.0");
    expect(page).toContain("Its README does not say how many of them are flags");
    expect(page).toContain("72×72 PNG");
    expect(page).toContain("| twemoji | its README does not say a country code | its README does not say | CC-BY 4.0 |");
    const japanese = readFileSync("docs/guides/ja/other-flag-sets.md", "utf8");
    expect(japanese).toContain("Twemoji v17.0はUnicode 17.0と絵文字17.0に従う");
    expect(japanese).toContain("72×72のPNG");
    expect(japanese).toContain("| twemoji | READMEは国コードを書いていない | READMEには書かれていない | CC-BY 4.0 |");
  });
});
