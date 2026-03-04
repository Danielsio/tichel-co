import type { Metadata } from "next";
import { Cormorant_Garamond, Heebo, Noto_Serif_Hebrew } from "next/font/google";
import { getLocale } from "next-intl/server";
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
    default: "Tichel & Co.",
    template: "%s | Tichel & Co.",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
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
      <body className="bg-ivory text-charcoal font-body antialiased">{children}</body>
    </html>
  );
}
