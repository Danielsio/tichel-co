import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://tichel.co";

const staticPages = [
  "",
  "/about",
  "/care-guide",
  "/lookbook",
  "/custom",
  "/collections/signature-collection",
  "/collections/silk-dreams",
  "/collections/everyday-elegance",
  "/collections/bridal",
  "/collections/accessories",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return staticPages.map((page) => ({
    url: `${BASE_URL}${page}`,
    lastModified: new Date(),
    changeFrequency: page === "" ? "daily" : "weekly",
    priority: page === "" ? 1.0 : 0.8,
    alternates: {
      languages: {
        he: `${BASE_URL}${page}`,
        en: `${BASE_URL}/en${page}`,
      },
    },
  }));
}
