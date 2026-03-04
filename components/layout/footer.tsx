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
    <footer className="border-stone border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-display text-navy text-2xl font-semibold">
                Tichel & Co.
              </span>
            </Link>
            <p className="text-charcoal/60 mt-4 text-sm leading-relaxed whitespace-pre-line">
              {t("brand")}
            </p>
          </div>

          <div>
            <h3 className="text-navy mb-4 text-sm font-semibold tracking-[0.08em] uppercase">
              {t("shop")}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {shopLinkKeys.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-charcoal/60 hover:text-gold text-sm transition-colors"
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

          <div>
            <h3 className="text-navy mb-4 text-sm font-semibold tracking-[0.08em] uppercase">
              {t("info")}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {infoLinkKeys.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-charcoal/60 hover:text-gold text-sm transition-colors"
                  >
                    {t(`links.${link.key}` as "links.story" | "links.care")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-navy mb-4 text-sm font-semibold tracking-[0.08em] uppercase">
              {t("newsletter.title")}
            </h3>
            <p className="text-charcoal/60 mb-4 text-sm">{t("newsletter.text")}</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t("newsletter.placeholder")}
                className="border-stone text-charcoal placeholder:text-charcoal/40 focus:border-gold focus:ring-gold h-11 flex-1 rounded-sm border bg-white px-4 text-sm focus:ring-1 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-gold text-navy h-11 cursor-pointer rounded-sm px-5 text-sm font-medium transition-all hover:brightness-110 active:scale-[0.98]"
              >
                {t("newsletter.submit")}
              </button>
            </form>
          </div>
        </div>

        <div className="border-stone mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-charcoal/40 text-xs">
            {t("rights", { year: new Date().getFullYear() })}
          </p>
          <p className="font-display text-charcoal/30 text-sm italic">{t("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
