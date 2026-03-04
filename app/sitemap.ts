import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://tichel.co";

const staticPages = [
  "",
  "/about",
  "/care-guide",
  "/lookbook",
  "/custom",
  "/collections/silk-tichels",
  "/collections/velvet-wraps",
  "/collections/everyday-essentials",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["he", "en"];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1.0 : 0.8,
        alternates: {
          languages: {
            he: `${BASE_URL}/he${page}`,
            en: `${BASE_URL}/en${page}`,
          },
        },
      });
    }
  }

  return entries;
}
