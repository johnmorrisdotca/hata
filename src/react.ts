// The entry @johnmorrisdotca/hata/react: a flag as a React component that draws the flag's SVG inline, from the per-flag modules, so that it works in a
// server render and in a static build as well as in the browser. The props are the element's (`<hata-flag>`), typed. React is an optional peer dependency.

import * as React from "react";

import { boxStyle, cachedFlag, inlineSvg, preloadFlags, resolveFlag } from "./bind.js";
import type { BoundFlag, FlagProps } from "./bind.js";

// React 19's `use` suspends on a promise, which is what lets a server stream wait for a flag and a client hydrate without a mismatch; React 18 has none, and loads in an effect.
const use = (React as unknown as { use?: <T>(promise: Promise<T>) => T }).use;

/**
 * The flag of a component's props, as a hook: the flag if it is already loaded (`preloadFlags`), else it is loaded: React 19 suspends until it is, and
 * React 18 draws nothing until an effect has loaded it.
 *
 * @param props - The flag, as the element's attributes give it.
 * @returns The flag to draw, or `null` when there is none (or, in React 18 with nothing preloaded, none yet).
 * @throws TypeError when `code` is not a string.
 *
 * @example
 * ```tsx
 * import { createElement } from "react";
 * import { renderToStaticMarkup } from "react-dom/server";
 * import { preloadFlags, useFlag } from "@johnmorrisdotca/hata/react";
 *
 * await preloadFlags([{ code: "JP" }]);
 * const Name = () => createElement("b", null, useFlag({ code: "JP" })?.name);
 * console.log(renderToStaticMarkup(createElement(Name))); // "<b>Japan</b>"
 * ```
 */
const useFlag = (props: FlagProps): BoundFlag | null => {
  const hit = cachedFlag(props);
  if (hit !== undefined) return hit;
  if (use !== undefined) return use(resolveFlag(props));
  const [state, set] = React.useState<BoundFlag | null>(null);
  React.useEffect(() => {
    let live = true;
    void resolveFlag(props).then((found) => live && set(found));

    return () => {
      live = false;
    };
  }, [props.code, props.shape, props.fit, props.variant, props.date, props.which, props.allowRestricted, props.label, props.lang]);

  return state;
};

/**
 * A flag, drawn inline: a `<span role="img">` holding the flag's SVG, with the element's box (its height, proportions, round corners, border and shadow).
 * It takes the props of `<hata-flag>` (`code`, `shape`, `fit`, `size`, `width`, `label`, `lang`, `border`, `shadow`, `theme`, `date`, `variant`, `which`,
 * `allowRestricted`) and any other prop of a span. The SVG is part of the HTML, so it is in a server render and a static build: preload the flags
 * (`preloadFlags`) for `renderToString`, which cannot wait; a streaming render waits for them by itself in React 19.
 *
 * @param props - The flag's props, and any span prop.
 * @returns A React element, or `null` when the package has no flag for it.
 * @throws TypeError when `code` is not a string.
 *
 * @example
 * ```tsx
 * import { createElement } from "react";
 * import { renderToString } from "react-dom/server";
 * import { Flag, preloadFlags } from "@johnmorrisdotca/hata/react";
 *
 * await preloadFlags([{ code: "JP-13", shape: "round" }]);
 * const html = renderToString(createElement(Flag, { code: "JP-13", shape: "round", label: "Tokyo" }));
 * console.log(html.includes('aria-label="Tokyo"'), html.includes("<svg")); // true true
 * ```
 */
const Flag = (props: FlagProps & Omit<React.HTMLAttributes<HTMLSpanElement>, keyof FlagProps | "role" | "dangerouslySetInnerHTML" | "children">): React.ReactElement | null => {
  const { code, shape, fit, size, width, label, lang, border, shadow, theme, date, variant, which, allowRestricted, style, ...rest } = props;
  const asked: FlagProps = { code, shape, fit, size, width, label, lang, border, shadow, theme, date, variant, which, allowRestricted };
  const found = useFlag(asked);
  if (found === null) return null;

  return React.createElement("span", { ...rest, role: "img", "aria-label": found.name, "data-hata-flag": "", style: { ...boxStyle(asked, found.aspect), ...style }, dangerouslySetInnerHTML: { __html: inlineSvg(found.svg) } });
};

export { Flag, preloadFlags, useFlag };
export type { BoundFlag, FlagProps };
