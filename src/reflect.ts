// Every observed attribute of a custom element as a property too, the way the family's elements do it (Kyuubu's
// <kyuubu-cube> first), so React 19, Vue 3 and Svelte 5, which set a property where an element has one, draw the
// element the same as markup and setAttribute do.

/** A custom element's class, as far as `reflectAttributes` needs one. */
type ElementClass = { prototype: object };

// What an object or anything it inherits from has under a name, if anything.
const describe = (object: object, name: string): PropertyDescriptor | undefined => {
  for (let at: object | null = object; at !== null; at = Object.getPrototypeOf(at)) {
    const found = Object.getOwnPropertyDescriptor(at, name);
    if (found !== undefined) return found;
  }

  return undefined;
};

/**
 * Give every observed attribute a property that writes the attribute. Writing `true` or `""` turns a flag on;
 * `false`, `null` and `undefined` turn it off; any other value is the attribute's text, so a number is fine.
 * Reading gives the attribute's text (or `null`), and a flag reads as a boolean. A name the browser already gives
 * every element, such as `lang`, is left as the browser has it.
 */
const reflectAttributes = (element: ElementClass, names: readonly string[], flags: readonly string[] = []): void => {
  const prototype = element.prototype;
  for (const name of names) {
    // Read the descriptor, never the property: a browser's own getter refuses a prototype for a receiver.
    if (describe(prototype, name) !== undefined) continue;
    const flag = flags.includes(name);
    Object.defineProperty(prototype, name, {
      configurable: true,
      get(this: Element) {
        const text = this.getAttribute(name);
        if (!flag) return text;

        return text !== null && text !== "false" && text !== "0";
      },
      set(this: Element, value: unknown) {
        if (value === null || value === undefined || value === false) this.removeAttribute(name);
        else this.setAttribute(name, value === true ? "" : String(value));
      },
    });
  }
};

export { reflectAttributes };
