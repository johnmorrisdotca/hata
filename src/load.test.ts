// /load: a flag by its code, by dynamic import, framed when asked.
import { describe, expect, it } from "vitest";

import canada from "./flags/ca";
import canadaSquare from "./flags/ca.1x1";
import japan from "./flags/jp";
import tokyo from "./flags/jp-13";
import { FLAG_CODES } from "./index";
import { flag, flagDataUri } from "./load";
import { frame, toDataUri } from "./svg";

describe("flag", () => {
  it("loads the same string as the flag's own module, whatever case the code is in", async () => {
    expect(await flag("JP")).toBe(japan);
    expect(await flag("jp-13")).toBe(tokyo);
    expect(await flag(" Jp_13 ")).toBe(tokyo);
  });

  it("loads every flag there is", async () => {
    for (const code of FLAG_CODES) expect((await flag(code))?.startsWith("<svg"), code).toBe(true);
    // Every one of the modules is transformed on first import, which takes longer than a test's usual five seconds.
  }, 60_000);

  it("frames it when asked, as frame() does, where no drawing was made for the frame", async () => {
    expect(await flag("JP-13", { shape: "round", label: "Tokyo" })).toBe(frame(tokyo, { shape: "round", label: "Tokyo" }));
    expect(await flag("JP", { shape: "round", fit: "contain" })).toBe(frame(japan, { shape: "round", fit: "contain" }));
  });

  it("uses the drawing made by hand for a frame where there is one: Canada's square, and in a circle", async () => {
    expect(await flag("CA", { shape: "1:1" })).toBe(canadaSquare);
    expect(await flag("ca", { shape: "round", label: "Canada" })).toBe(frame(canadaSquare, { shape: "round", fit: "cover", label: "Canada" }));
    // A fit asked for by name is that fit of the flag's own drawing.
    expect(await flag("CA", { shape: "1:1", fit: "cover" })).toBe(frame(canada, { shape: "1:1", fit: "cover" }));
  });

  it("answers null for a code with no flag or not a code, and throws at once for misuse", async () => {
    expect(await flag("XX")).toBeNull();
    expect(await flag("EH")).toBeNull();
    expect(await flag("")).toBeNull();
    expect(() => flag(7 as unknown as string)).toThrow(TypeError);
    expect(() => flag("JP", { shape: "star" as "round" })).toThrow(TypeError);
  });
});

describe("flagDataUri", () => {
  it("is the flag, framed when asked, as a data: URI; null for no flag", async () => {
    expect(await flagDataUri("JP")).toBe(toDataUri(japan));
    expect(await flagDataUri("jp-13", { shape: "1:1" })).toBe(toDataUri(frame(tokyo, { shape: "1:1" })!));
    expect(await flagDataUri("XX")).toBeNull();
  });
});
