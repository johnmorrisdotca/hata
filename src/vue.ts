// The entry @johnmorrisdotca/hata/vue: a flag as a Vue component that draws the flag's SVG inline, from the per-flag modules, so that it works in a
// server render and in a static build as well as in the browser. The props are the element's (`<hata-flag>`), typed. Vue is an optional peer dependency.

import { defineComponent, h, onMounted, onServerPrefetch, shallowRef, watch } from "vue";
import type { PropType } from "vue";

import { boxStyle, cachedFlag, inlineSvg, preloadFlags, resolveFlag } from "./bind.js";
import type { BoundFlag, FlagProps } from "./bind.js";

const text = (): { type: PropType<string>; default: undefined } => ({ type: String, default: undefined });

/**
 * A flag, drawn inline: a `<span role="img">` holding the flag's SVG, with the element's box (its height, proportions, round corners, border and shadow).
 * It takes the props of `<hata-flag>` (`code`, `shape`, `fit`, `size`, `width`, `label`, `lang`, `border`, `shadow`, `theme`, `date`, `variant`, `which`,
 * `allowRestricted`). The SVG is part of the HTML, so it is in `renderToString` (Vue's server renderer waits for it) and in a static build. On the client it
 * is drawn when loaded, or at once where `preloadFlags` loaded it first, which is also what avoids a hydration mismatch.
 *
 * @example
 * ```ts
 * import { createSSRApp } from "vue";
 * import { renderToString } from "vue/server-renderer";
 * import { Flag } from "@johnmorrisdotca/hata/vue";
 *
 * const html = await renderToString(createSSRApp(Flag, { code: "CA-ON", label: "Ontario" }));
 * console.log(html.includes('aria-label="Ontario"'), html.includes("<svg")); // true true
 * ```
 */
const Flag = defineComponent({
  name: "HataFlag",
  props: {
    code: { type: String, required: true },
    shape: text() as unknown as { type: PropType<FlagProps["shape"]>; default: undefined },
    fit: text() as unknown as { type: PropType<FlagProps["fit"]>; default: undefined },
    size: { type: [String, Number] as PropType<FlagProps["size"]>, default: undefined },
    width: { type: [String, Number] as PropType<FlagProps["width"]>, default: undefined },
    label: text(),
    lang: text() as unknown as { type: PropType<FlagProps["lang"]>; default: undefined },
    border: { type: Boolean, default: undefined },
    shadow: { type: Boolean, default: undefined },
    theme: text() as unknown as { type: PropType<FlagProps["theme"]>; default: undefined },
    date: { type: [String, Date] as PropType<FlagProps["date"]>, default: undefined },
    variant: text(),
    which: text() as unknown as { type: PropType<FlagProps["which"]>; default: undefined },
    allowRestricted: { type: Boolean, default: undefined },
  },
  setup(props) {
    const asked = (): FlagProps => ({ code: props.code, shape: props.shape, fit: props.fit, size: props.size, width: props.width, label: props.label, lang: props.lang, border: props.border, shadow: props.shadow, theme: props.theme, date: props.date, variant: props.variant, which: props.which, allowRestricted: props.allowRestricted });
    const found = shallowRef<BoundFlag | null>(cachedFlag(asked()) ?? null);
    const load = async (): Promise<void> => {
      found.value = await resolveFlag(asked());
    };
    onServerPrefetch(load);
    onMounted(() => {
      if (cachedFlag(asked()) === undefined) void load();
    });
    watch(() => [props.code, props.shape, props.fit, props.variant, props.date, props.which, props.allowRestricted, props.label, props.lang], () => void load());

    return () => (found.value === null ? null : h("span", { role: "img", "aria-label": found.value.name, "data-hata-flag": "", style: boxStyle(asked(), found.value.aspect), innerHTML: inlineSvg(found.value.svg) }));
  },
});

export { Flag, preloadFlags };
export type { BoundFlag, FlagProps };
