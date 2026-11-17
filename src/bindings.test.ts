// The framework bindings (MODULES-1431): /react, /vue, /svelte and /react-native draw the flag's SVG inline from the per-flag modules, with the
// element's props, so that a server render and a static build have the flag in them. /bind is what they share.
import { createElement, Suspense } from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import { prerender } from "react-dom/static";
import { createSSRApp } from "vue";
import { renderToString as renderVue } from "vue/server-renderer";
import { render as renderSvelte } from "svelte/server";
import { describe, expect, it } from "vitest";

import { boxStyle, cachedFlag, inlineSvg, preloadFlags, resolveFlag, styleText } from "./bind";
import { flag } from "./load";
import { createFlag } from "./react-native";
import { Flag as ReactFlag } from "./react";
import { Flag as VueFlag } from "./vue";
import SvelteFlag from "./svelte/Flag.svelte";

const text = async (stream: ReadableStream<Uint8Array>): Promise<string> => {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let out = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return out;
    out += decoder.decode(value);
  }
};

describe("/bind", () => {
  it("loads a flag once, with its name and proportions, and keeps it for a render that cannot wait", async () => {
    expect(cachedFlag({ code: "BR" })).toBeUndefined();
    const first = resolveFlag({ code: "BR", label: "Brasil" });
    expect(resolveFlag({ code: "BR", label: "Brasil" })).toBe(first);
    const found = (await first)!;
    expect(found.name).toBe("Brasil");
    expect(found.aspect).toBeCloseTo(10 / 7, 2);
    expect(found.svg).toBe(await flag("BR"));
    expect(cachedFlag({ code: "BR", label: "Brasil" })).toBe(found);
    expect(await resolveFlag({ code: "XX" })).toBeNull();
    expect(cachedFlag({ code: "XX" })).toBeNull();
    await preloadFlags([{ code: "JP" }, { code: "JP", lang: "ja" }]);
    expect(cachedFlag({ code: "JP" })?.name).toBe("Japan");
    expect(cachedFlag({ code: "JP", lang: "ja" })?.name).toBe("日本");
  });

  it("takes the element's props: shape, fit, variant, date, which and allowRestricted give what flag() gives", async () => {
    expect((await resolveFlag({ code: "CA", shape: "1:1" }))!.svg).toBe(await flag("CA", { shape: "1:1" }));
    expect((await resolveFlag({ code: "CA", shape: "round", fit: "whole" }))!.aspect).toBe(1);
    expect((await resolveFlag({ code: "CA", shape: "4:3" }))!.aspect).toBeCloseTo(4 / 3, 5);
    expect((await resolveFlag({ code: "AF", variant: "de-facto" }))!.svg).toBe(await flag("AF", { variant: "de-facto" }));
    expect((await resolveFlag({ code: "CA", date: "1962-09-29", which: "in-use" }))!.svg).toBe(await flag("CA", { variant: "red-ensign-1957" }));
    expect((await resolveFlag({ code: "CA", date: "1962-09-29" }))!.svg).toBe(await flag("GB"));
    expect((await resolveFlag({ code: "CA", date: new Date(Date.UTC(1962, 8, 29)), which: "in-use" }))!.svg).toBe(await flag("CA", { variant: "red-ensign-1957" }));
    // A restricted flag is not drawn unless it is asked for, as in flag().
    expect(await resolveFlag({ code: "DE", date: "1940" })).toBeNull();
    expect((await resolveFlag({ code: "DE", date: "1940", allowRestricted: true }))!.svg).toContain("<svg");
    expect(() => resolveFlag({ code: 1 as unknown as string })).toThrow(TypeError);
  });

  it("gives the element's box as a style: its height, proportions, round corners, border and shadow", () => {
    expect(boxStyle({ code: "JP" }, 1.5)).toMatchObject({ display: "inline-block", height: "1em", aspectRatio: "1.5", width: "" });
    expect(boxStyle({ code: "JP", size: "medium" }, 1.5).height).toBe("48px");
    expect(boxStyle({ code: "JP", size: "small" }, 1.5).height).toBe("24px");
    expect(boxStyle({ code: "JP", size: 31 }, 1.5).height).toBe("31px");
    expect(boxStyle({ code: "JP", width: 90, size: "large" }, 1.5)).toMatchObject({ width: "90px", height: "auto" });
    expect(boxStyle({ code: "JP", shape: "round" }, 1)).toMatchObject({ borderRadius: "50%", overflow: "hidden" });
    expect(boxStyle({ code: "JP", border: true, shadow: true }, 1.5).boxShadow).toContain("0 0 0 1px");
    expect(boxStyle({ code: "JP" }, 1.5).boxShadow).toBeUndefined();
    expect(styleText(boxStyle({ code: "JP", size: 24 }, 1.5))).toMatch(/^display:inline-block;height:24px;aspect-ratio:1.5;/);
    expect(styleText({ a: "", bB: "1" })).toBe("b-b:1");
    expect(inlineSvg('<svg viewBox="0 0 3 2"></svg>')).toBe('<svg style="display:block;width:100%;height:100%" aria-hidden="true" focusable="false" viewBox="0 0 3 2"></svg>');
  });
});

describe("/react", () => {
  it("renders the flag's SVG inline to a string once the flags are preloaded, with the element's box and its name", async () => {
    await preloadFlags([{ code: "JP-13", shape: "round", label: "Tokyo" }]);
    const html = renderToString(createElement(ReactFlag, { code: "JP-13", shape: "round", label: "Tokyo", size: "medium", border: true, className: "tokyo" }));
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Tokyo"');
    expect(html).toContain("<svg");
    expect(html).toContain("border-radius:50%");
    expect(html).toContain("height:48px");
    expect(html).toContain('class="tokyo"');
    expect(html).toContain((await flag("JP-13", { shape: "round" }))!.slice(5, 60));
    expect(html).not.toContain("<hata-flag");
  });

  it("waits for a flag that is not preloaded in a streaming render (React 19), and gives a fallback to renderToString, which cannot wait", async () => {
    const tree = createElement(Suspense, { fallback: createElement("i", null, "loading") }, createElement(ReactFlag, { code: "KR", label: "Korea" }));
    expect(renderToString(tree)).toContain("loading");
    const { prelude } = await prerender(tree);
    const html = await text(prelude);
    expect(html).toContain('aria-label="Korea"');
    expect(html).toContain("<svg");
  });

  it("draws nothing for a code with no flag, and a restricted flag only when asked", async () => {
    await preloadFlags([{ code: "XX" }, { code: "DE", date: "1940" }, { code: "DE", date: "1940", allowRestricted: true }]);
    expect(renderToStaticMarkup(createElement(ReactFlag, { code: "XX" }))).toBe("");
    expect(renderToStaticMarkup(createElement(ReactFlag, { code: "DE", date: "1940" }))).toBe("");
    expect(renderToStaticMarkup(createElement(ReactFlag, { code: "DE", date: "1940", allowRestricted: true }))).toContain("<svg");
  });
});

describe("/vue", () => {
  it("renders the flag's SVG inline in the server renderer, which waits for it, with the element's box and its name", async () => {
    const html = await renderVue(createSSRApp(VueFlag, { code: "CA-ON", label: "Ontario", size: "large", shape: "4:3" }));
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Ontario"');
    expect(html).toContain("<svg");
    expect(html).toContain("height:96px");
    expect(html).toContain("aspect-ratio:1.3333");
    expect(html).toContain((await flag("CA-ON", { shape: "4:3" }))!.slice(5, 60));
  });

  it("takes date and which, and draws nothing for a code with no flag", async () => {
    const used = await renderVue(createSSRApp(VueFlag, { code: "CA", date: "1962-09-29", which: "in-use" }));
    expect(used).toContain("red-ensign-1957");
    expect(await renderVue(createSSRApp(VueFlag, { code: "XX" }))).not.toContain("<svg");
  });
});

describe("/svelte", () => {
  it("renders the flag's SVG inline on the server for a preloaded flag, with the element's box and its name", async () => {
    await preloadFlags([{ code: "AU-NSW", label: "New South Wales", size: "small" }]);
    const { body } = renderSvelte(SvelteFlag, { props: { code: "AU-NSW", label: "New South Wales", size: "small" } });
    expect(body).toContain('role="img"');
    expect(body).toContain('aria-label="New South Wales"');
    expect(body).toContain("<svg");
    expect(body).toContain("height:24px");
    expect(renderSvelte(SvelteFlag, { props: { code: "XX" } }).body).not.toContain("<svg");
  });
});

describe("/react-native", () => {
  it("draws the flag with SvgXml at the flag's proportions, and its name as the accessibility label", async () => {
    await preloadFlags([{ code: "JP" }]);
    const NativeFlag = createFlag("SvgXml" as never);
    const propsOf = (element: ReturnType<typeof NativeFlag>): Record<string, unknown> => (element as unknown as { props: Record<string, unknown> }).props;
    const element = NativeFlag({ code: "JP", size: "medium" })!;
    expect((element as unknown as { type: string }).type).toBe("SvgXml");
    expect(propsOf(element)).toMatchObject({ height: 48, width: 72, accessibilityRole: "image", accessibilityLabel: "Japan" });
    expect(propsOf(element).xml).toBe(await flag("JP"));
    expect(propsOf(NativeFlag({ code: "JP", width: 90 }))).toMatchObject({ width: 90, height: 60 });
    expect(propsOf(NativeFlag({ code: "JP" })).height).toBe(24);
  });
});
