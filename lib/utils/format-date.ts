export function formatDate(
  date: Date | string | number,
  locale: string = "he-IL",
): string {
  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) return "";

  if (locale.startsWith("he")) {
    return new Intl.DateTimeFormat("he-IL", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).format(d);
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}
