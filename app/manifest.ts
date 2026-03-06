import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tichel & Co.",
    short_name: "Tichel",
    description: "כיסויי ראש יוקרתיים — עוצבו בישראל",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F5",
    theme_color: "#1B2A4A",
  };
}
