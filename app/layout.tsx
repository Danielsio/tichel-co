import type { Metadata } from "next";
import { Cormorant_Garamond, Heebo, Noto_Serif_Hebrew } from "next/font/google";
import { getLocale } from "next-intl/server";
import { WebVitalsReporter } from "@/components/perf/web-vitals-reporter";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display-latin",
  display: "swap",
});

const notoSerifHebrew = Noto_Serif_Hebrew({
  subsets: ["hebrew"],
  weight: ["400", "600"],
  variable: "--font-display-hebrew",
  display: "swap",
});

const heebo = Heebo({
  subsets: ["latin", "hebrew"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tichel & Co. — Luxury Modest Head Coverings",
    template: "%s | Tichel & Co.",
  },
  description:
    "Luxury head coverings, tichels, and scarves for women who cover with intention. Silk, velvet, cashmere — designed in Israel.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    siteName: "Tichel & Co.",
    locale: "he_IL",
    alternateLocale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tichel & Co. — Luxury Modest Head Coverings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    languages: {
      he: "/",
      en: "/en",
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      dir={locale === "he" ? "rtl" : "ltr"}
      className={`${cormorant.variable} ${notoSerifHebrew.variable} ${heebo.variable}`}
    >
      <body className="bg-ivory text-charcoal font-body antialiased">
        {children}
        <WebVitalsReporter />
      </body>
    </html>
  );
}
