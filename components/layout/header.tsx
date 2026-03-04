"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { useCartStore } from "@/stores/cart-store";
import { useUIStore } from "@/stores/ui-store";
import { useMounted } from "@/hooks/use-mounted";
import { Drawer } from "@/components/ui/drawer";
import {
  LocaleSwitcher,
  LocaleSwitcherMinimal,
} from "@/components/layout/locale-switcher";

const navLinks = [
  { href: "/collections/signature-collection" as const, key: "collections" as const },
  { href: "/collections/silk-dreams" as const, key: "tichels" as const },
  { href: "/collections/everyday-elegance" as const, key: "scarves" as const },
  { href: "/collections/bridal" as const, key: "headWraps" as const },
  { href: "/collections/accessories" as const, key: "accessories" as const },
  { href: "/custom" as const, key: "custom" as const },
];

export function Header() {
  const t = useTranslations("nav");
  const tTopBar = useTranslations("topBar");
  const totalItems = useCartStore((s) => s.totalItems);
  const openCart = useCartStore((s) => s.openCart);
  const { isMobileMenuOpen, openMobileMenu, closeMobileMenu } = useUIStore();
  const mounted = useMounted();

  const itemCount = mounted ? totalItems() : 0;

  return (
    <>
      {/* Announcement Bar */}
      <div className="gradient-luxury hidden lg:block">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-ivory/70 py-2.5 text-center text-[11px] tracking-[0.15em] uppercase">
            {tTopBar("message")}
          </p>
        </div>
      </div>

      <header className="bg-ivory/95 sticky top-0 z-40 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="flex h-[72px] items-center justify-between">
            {/* Mobile menu */}
            <button
              onClick={openMobileMenu}
              className="text-navy hover:text-gold flex h-10 w-10 cursor-pointer items-center justify-center transition-colors duration-300 lg:hidden"
              aria-label={t("openMenu")}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>

            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2">
              <span className="font-display text-navy group-hover:text-gold text-[26px] font-semibold tracking-tight transition-colors duration-300 lg:text-[30px]">
                Tichel & Co.
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex lg:items-center lg:gap-10" aria-label="main">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="text-navy/70 hover:text-navy after:bg-gold relative text-[13px] font-medium tracking-wide transition-colors duration-300 after:absolute after:inset-x-0 after:-bottom-1 after:h-[1.5px] after:origin-center after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-0.5">
              <LocaleSwitcherMinimal />

              <button
                className="text-navy/60 hover:text-navy flex h-10 w-10 cursor-pointer items-center justify-center transition-colors duration-300"
                aria-label={t("search")}
              >
                <svg
                  className="h-[18px] w-[18px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>

              <Link
                href="/account"
                className="text-navy/60 hover:text-navy flex h-10 w-10 items-center justify-center transition-colors duration-300"
                aria-label={t("account")}
              >
                <svg
                  className="h-[18px] w-[18px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </Link>

              <button
                onClick={openCart}
                className="text-navy/60 hover:text-navy relative flex h-10 w-10 cursor-pointer items-center justify-center transition-colors duration-300"
                aria-label={t("cart")}
              >
                <svg
                  className="h-[18px] w-[18px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                {itemCount > 0 && (
                  <span className="bg-navy text-ivory absolute -end-0.5 top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full text-[9px] font-bold">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Subtle border */}
        <div className="from-stone via-stone-dark h-px bg-gradient-to-r to-transparent opacity-60" />
      </header>

      {/* Mobile Menu Drawer */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        title={t("menu")}
        side="start"
      >
        <nav className="flex flex-col gap-1 pt-2" aria-label="main">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              onClick={closeMobileMenu}
              className="text-navy hover:text-gold rounded-sm px-3 py-3.5 text-[15px] font-medium transition-colors duration-200"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>
        <div className="border-stone mt-10 border-t pt-6">
          <Link
            href="/account"
            onClick={closeMobileMenu}
            className="text-charcoal/60 hover:text-navy flex items-center gap-3 px-3 py-3 text-sm transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            {t("account")}
          </Link>
          <LocaleSwitcher className="mt-2 w-full justify-start px-3 py-3" />
        </div>
      </Drawer>
    </>
  );
}
