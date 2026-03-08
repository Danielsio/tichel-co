"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

const shopLinkKeys = [
  { href: "/collections/signature-collection" as const, key: "collections" },
  { href: "/collections/silk-dreams" as const, key: "tichels" },
  { href: "/collections/everyday-elegance" as const, key: "scarves" },
  { href: "/collections/accessories" as const, key: "accessories" },
  { href: "/custom" as const, key: "custom" },
  { href: "/lookbook" as const, key: "lookbook" },
];

const infoLinkKeys = [
  { href: "/about" as const, key: "story" },
  { href: "/care-guide" as const, key: "care" },
  { href: "/terms" as const, key: "terms" },
  { href: "/returns" as const, key: "shipping" },
  { href: "/privacy" as const, key: "privacy" },
];

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="gradient-luxury text-ivory">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:py-16 lg:px-6 lg:py-20">
        <div className="grid grid-cols-2 gap-10 sm:gap-12 md:grid-cols-3 lg:gap-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-display text-ivory text-[26px] font-semibold tracking-tight sm:text-[28px]">
                Tichel & Co.
              </span>
            </Link>
            <p className="text-ivory/40 mt-4 max-w-xs text-[13px] leading-relaxed whitespace-pre-line sm:mt-5">
              {t("brand")}
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-gold mb-4 text-[11px] font-semibold tracking-[0.2em] uppercase sm:mb-5">
              {t("shop")}
            </h3>
            <ul className="flex flex-col gap-2.5 sm:gap-3">
              {shopLinkKeys.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-ivory/40 hover:text-ivory text-[13px] transition-colors duration-300"
                  >
                    {tNav(link.key as "collections")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h3 className="text-gold mb-4 text-[11px] font-semibold tracking-[0.2em] uppercase sm:mb-5">
              {t("info")}
            </h3>
            <ul className="flex flex-col gap-2.5 sm:gap-3">
              {infoLinkKeys.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-ivory/40 hover:text-ivory text-[13px] transition-colors duration-300"
                  >
                    {t(`links.${link.key}` as "links.story")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-ivory/10 mt-12 flex flex-col items-center justify-between gap-3 border-t pt-8 sm:mt-16 sm:flex-row sm:pt-10">
          <p className="text-ivory/25 text-[11px] tracking-wider">
            {t("rights", { year: new Date().getFullYear() })}
          </p>
          <p className="font-display text-ivory/25 text-sm italic">{t("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
