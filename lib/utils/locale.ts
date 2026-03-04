import type { LocaleMap, Locale } from "@/types";

export function t(field: LocaleMap | undefined | null, locale: Locale): string {
  if (!field) return "";
  return field[locale] ?? field["he"] ?? field["en"] ?? "";
}
