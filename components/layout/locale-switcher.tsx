"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";

export interface LocaleSwitcherProps {
  className?: string;
}

export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const t = useTranslations("locale");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const otherLocale = locale === "he" ? "en" : "he";

  const handleSwitch = () => {
    router.replace({ pathname }, { locale: otherLocale });
  };

  return (
    <button
      onClick={handleSwitch}
      className={cn(
        "text-navy/70 hover:bg-stone hover:text-navy inline-flex cursor-pointer items-center gap-1.5 rounded-sm px-2 py-1.5 text-sm font-medium transition-colors",
        className,
      )}
      aria-label={t("switchTo")}
      lang={otherLocale}
      dir={otherLocale === "he" ? "rtl" : "ltr"}
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495A18.048 18.048 0 0 1 16 6.741"
        />
      </svg>
      {t("switchTo")}
    </button>
  );
}

export function LocaleSwitcherMinimal({ className }: LocaleSwitcherProps) {
  const t = useTranslations("locale");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const otherLocale = locale === "he" ? "en" : "he";
  const label = otherLocale === "he" ? "עב" : "EN";

  const handleSwitch = () => {
    router.replace({ pathname }, { locale: otherLocale });
  };

  return (
    <button
      onClick={handleSwitch}
      className={cn(
        "text-navy/70 hover:bg-stone hover:text-navy flex h-10 w-10 cursor-pointer items-center justify-center rounded-sm text-xs font-bold uppercase transition-colors",
        className,
      )}
      aria-label={t("switchLabel")}
      lang={otherLocale}
    >
      {label}
    </button>
  );
}
