import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tichel & Co.",
    short_name: "Tichel",
    description: "Luxury modest head coverings — designed in Israel",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F5",
    theme_color: "#1B2A4A",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
