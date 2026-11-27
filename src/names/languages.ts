// Which page-language tag reads which extra name entry. English and Japanese stay on /names.

/** The languages besides English and Japanese that `flagName` is published in, one entry each. */
export const NAME_LANGUAGES = ["fr", "es", "de", "zh-Hans", "zh-Hant", "ko", "pt", "ar", "ru"] as const;

/** One of those languages. */
export type ExtraNameLanguage = (typeof NAME_LANGUAGES)[number];

/**
 * The extra name entry a language tag asks for, or null for English, Japanese, and anything else.
 * `zh`, `zh-CN` and `zh-SG` are Simplified Chinese. `zh-TW`, `zh-HK` and `zh-MO` are Traditional Chinese.
 */
export const extraLanguage = (tag: string): ExtraNameLanguage | null => {
  const lower = tag.trim().toLowerCase().replaceAll("_", "-");
  if (lower === "zh" || lower.startsWith("zh-cn") || lower.startsWith("zh-sg") || lower.startsWith("zh-hans")) return "zh-Hans";
  if (lower.startsWith("zh-tw") || lower.startsWith("zh-hk") || lower.startsWith("zh-mo") || lower.startsWith("zh-hant")) return "zh-Hant";
  const base = lower.split("-")[0];
  return NAME_LANGUAGES.find((language) => language.toLowerCase() === base) ?? null;
};
