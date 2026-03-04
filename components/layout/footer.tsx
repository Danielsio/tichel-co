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
];

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="gradient-luxury text-ivory">
      <div className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-display text-ivory text-[28px] font-semibold tracking-tight">
                Tichel & Co.
              </span>
            </Link>
            <p className="text-ivory/40 mt-5 text-[13px] leading-relaxed whitespace-pre-line">
              {t("brand")}
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-gold mb-5 text-[11px] font-semibold tracking-[0.2em] uppercase">
              {t("shop")}
            </h3>
            <ul className="flex flex-col gap-3">
              {shopLinkKeys.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-ivory/50 hover:text-ivory text-[13px] transition-colors duration-300"
                  >
                    {tNav(
                      link.key as
                        | "collections"
                        | "tichels"
                        | "scarves"
                        | "accessories"
                        | "custom"
                        | "lookbook",
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h3 className="text-gold mb-5 text-[11px] font-semibold tracking-[0.2em] uppercase">
              {t("info")}
            </h3>
            <ul className="flex flex-col gap-3">
              {infoLinkKeys.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-ivory/50 hover:text-ivory text-[13px] transition-colors duration-300"
                  >
                    {t(`links.${link.key}` as "links.story" | "links.care")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-gold mb-5 text-[11px] font-semibold tracking-[0.2em] uppercase">
              {t("newsletter.title")}
            </h3>
            <p className="text-ivory/40 mb-5 text-[13px] leading-relaxed">
              {t("newsletter.text")}
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t("newsletter.placeholder")}
                className="text-ivory placeholder:text-ivory/30 focus:border-gold border-ivory/20 h-12 flex-1 rounded-none border bg-transparent px-4 text-[13px] focus:ring-0 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-gold text-navy hover:bg-gold-light h-12 cursor-pointer px-6 text-[12px] font-semibold tracking-wider uppercase transition-all duration-300 active:scale-[0.97]"
              >
                {t("newsletter.submit")}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-ivory/10 mt-16 flex flex-col items-center justify-between gap-4 border-t pt-10 md:flex-row">
          <p className="text-ivory/25 text-[11px] tracking-wider">
            {t("rights", { year: new Date().getFullYear() })}
          </p>
          <p className="font-display text-ivory/15 text-sm italic">{t("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
