// Hata's existing inline panel, using the shared family code writers.
// The flag-specific image writers and asynchronous context remain in embed-hata.js.
import { familyEmbedBuilder } from "../scripts/family-template.mjs";
export const FORMATS = familyEmbedBuilder({ packageName: "@example/embed", major: 1, site: "https://example.test/", makers: {} }).formats;
/** The builder's own words; a page may pass others. */
export const BUILDER_WORDS = {
  en: { copy: "Copy", copied: "Copied.", copyFailed: "Could not copy: the code is selected, so press Ctrl+C or ⌘C.", preview: "Preview", code: "Code", options: "Options" },
  ja: { copy: "コピー", copied: "コピーしました。", copyFailed: "コピーできませんでした。コードを選択したので、Ctrl+C か ⌘C でコピーしてください。", preview: "プレビュー", code: "コード", options: "オプション" },
};

/** Every option's value: the one given where it is one of the option's, else its default. */
export function settingsFrom(schema, values = {}) {
  const out = {};
  for (const option of schema) {
    const value = values[option.id];
    if (value === undefined || value === null) out[option.id] = option.default;
    else if (option.kind === "number") {
      const number = Number(value);
      out[option.id] = Number.isFinite(number) ? Math.min(option.max ?? Infinity, Math.max(option.min ?? -Infinity, number)) : option.default;
    } else if (option.kind === "boolean") out[option.id] = value === true || value === "1" || value === "true" || value === "";
    else if (option.kind === "choice") out[option.id] = option.choices.some((choice) => choice.value === value) ? value : option.default;
    else out[option.id] = String(value);
  }
  return out;
}


const rows = (schema) => schema.map((option) => ({
  id: option.id, group: "options", kind: option.kind === "fixed" ? "text" : option.kind,
  default: option.default, choices: option.choices?.map((choice) => choice.value),
  range: option.kind === "number" ? { min: option.min ?? 0, max: option.max ?? 10000, step: option.step ?? 1 } : undefined,
  names: { call: option.attribute, element: option.attribute },
}));
const shared = (product, schema, settings, context = {}) => {
  const dimensions = product.frameSize?.(settings, context) ?? { width: 360, height: 360 };
  return familyEmbedBuilder({ packageName: product.package ?? "@example/embed", major: product.major ?? /@(\d+)\//.exec(product.cdn ?? "")?.[1] ?? 1,
    site: product.embed ?? "https://example.test/", title: product.title?.(settings, context) ?? product.name,
    component: "Embed", selector: "app-embed", options: rows(schema),
    makers: { embed: { names: "call", element: "element", tag: product.tag,
      embed: product.embed, width: dimensions.width, height: dimensions.height,
      required: schema.filter((option) => option.required).map((option) => option.id), formats: product.formats ?? ["element"] } },
    code: ({ format, attrs }) => product.writers?.[format]?.write(settings, attrs, context),
  });
};
export function attributesFor(schema, settings) {
  return shared({}, schema, settings).attributesFor(rows(schema), settings, "embed");
}
export function embedAddress(product, schema, settings) {
  return shared(product, schema, settings).embedAddress(rows(schema), settings, "embed");
}
export function codeFor(format, product, schema, settings, context = {}) {
  const builder = shared(product, schema, settings, context);
  const code = builder.codeFor("embed", format, rows(schema), settings);
  return code?.replaceAll(builder.cdn, product.cdn ?? builder.cdn).replace("border:0;max-width:100%", "border:0;vertical-align:middle") ?? null;
}
export function allCode(product, schema, settings, context = {}) {
  return Object.fromEntries(product.formats.map((format) => [format, codeFor(format, product, schema, settings, context)]));
}
/** What a format is called, from this file or the product's own writer. */
export function formatLabel(product, format, lang) {
  const label = product.writers?.[format]?.label ?? FORMATS[format]?.label ?? { en: format, ja: format };
  return label[lang] ?? label.en;
}

/**
 * Draw the builder into `container`: the options as controls, the live preview, and a tab for each format with
 * its code and a Copy button. Returns `{ update(values), setLanguage(lang), settings() }`. Every element it makes
 * has a `data-testid` beginning `embed-`, and a class beginning `embed-` for the page's CSS; it uses the family's
 * `fam-` classes for buttons and fields where the page has them.
 */
export function mountEmbedBuilder(container, { product, schema, values = {}, lang = "en", words = BUILDER_WORDS, onChange } = {}) {
  let settings = settingsFrom(schema, values);
  let language = lang;
  let format = product.formats[0];
  let drawn = 0;
  const say = (key) => words[language]?.[key] ?? words.en[key];
  const make = (tag, props = {}, ...children) => {
    const element = Object.assign(document.createElement(tag), props);
    element.append(...children);
    return element;
  };

  const controls = make("div", { className: "embed-options" });
  controls.setAttribute("data-testid", "embed-options");
  const previewBox = make("div", { className: "embed-preview" });
  previewBox.setAttribute("data-testid", "embed-preview");
  const tabs = make("div", { className: "embed-tabs fam-seg" });
  tabs.setAttribute("role", "tablist");
  tabs.setAttribute("data-testid", "embed-tabs");
  const code = make("textarea", { className: "embed-code fam-field", readOnly: true, spellcheck: false, rows: 6 });
  code.setAttribute("data-testid", "embed-code");
  const copyButton = make("button", { type: "button", className: "fam-button embed-copy" });
  copyButton.setAttribute("data-testid", "embed-copy");
  const status = make("p", { className: "fam-fine embed-status" });
  status.setAttribute("aria-live", "polite");
  status.setAttribute("data-testid", "embed-status");
  const panel = make("div", { className: "embed-panel" }, make("div", { className: "embed-code-head" }, copyButton), code, status);
  panel.setAttribute("role", "tabpanel");
  container.replaceChildren(controls, previewBox, tabs, panel);

  const drawControls = () => {
    controls.replaceChildren(
      ...schema
        .filter((option) => option.kind !== "fixed")
        .map((option) => {
          const id = `embed-option-${option.id}`;
          const label = make("label", { htmlFor: id, className: "fam-label", textContent: option.label[language] ?? option.label.en });
          let field;
          if (option.kind === "choice") {
            field = make("select", { className: "fam-field" }, ...option.choices.map((choice) => make("option", { value: choice.value, textContent: choice.label[language] ?? choice.label.en })));
            field.value = settings[option.id];
          } else if (option.kind === "boolean") {
            field = make("input", { type: "checkbox", checked: Boolean(settings[option.id]) });
          } else if (option.kind === "number") {
            field = make("input", { type: "number", className: "fam-field", min: option.min ?? "", max: option.max ?? "", step: option.step ?? 1, value: settings[option.id], inputMode: "numeric" });
          } else field = make("input", { type: "text", className: "fam-field", value: settings[option.id] ?? "", spellcheck: false });
          field.id = id;
          field.setAttribute("data-testid", id);
          if (option.help) field.title = option.help[language] ?? option.help.en;
          field.addEventListener(option.kind === "text" || option.kind === "number" ? "input" : "change", () => {
            const value = option.kind === "boolean" ? field.checked : field.value;
            update({ [option.id]: value });
          });
          const row = make("div", { className: `embed-option embed-option-${option.kind}` });
          if (option.kind === "boolean") row.append(field, label);
          else row.append(label, field);
          return row;
        }),
    );
  };

  const drawTabs = () => {
    tabs.replaceChildren(
      ...product.formats.map((one) => {
        const button = make("button", { type: "button", textContent: formatLabel(product, one, language) });
        button.setAttribute("role", "tab");
        button.setAttribute("aria-selected", String(one === format));
        button.setAttribute("aria-pressed", String(one === format));
        button.setAttribute("data-testid", `embed-tab-${one}`);
        button.addEventListener("click", () => {
          format = one;
          drawTabs();
          drawCode();
        });
        return button;
      }),
    );
    copyButton.textContent = say("copy");
  };

  let context = {};
  let codes = {};
  const drawCode = () => {
    code.value = codes[format] ?? "";
    code.rows = Math.min(14, Math.max(3, code.value.split("\n").length));
    code.setAttribute("aria-label", formatLabel(product, format, language));
    panel.setAttribute("data-format", format);
    status.textContent = "";
  };

  const redraw = async () => {
    const turn = ++drawn;
    const made = (await product.context?.(settings)) ?? {};
    if (turn !== drawn) return;
    context = made;
    codes = allCode(product, schema, settings, context);
    product.preview(previewBox, settings, context);
    drawCode();
    onChange?.(settings);
  };

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(code.value);
      status.textContent = say("copied");
    } catch (_error) {
      code.focus();
      code.select();
      status.textContent = say("copyFailed");
    }
  });

  function update(changes) {
    settings = settingsFrom(schema, { ...settings, ...changes });
    return redraw();
  }

  drawControls();
  drawTabs();
  const first = redraw();
  return {
    ready: first,
    update,
    settings: () => ({ ...settings }),
    setLanguage(next) {
      language = next;
      drawControls();
      drawTabs();
      return redraw();
    },
  };
}
