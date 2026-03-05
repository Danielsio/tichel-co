import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-navy text-6xl font-semibold">404</h1>
        <p className="text-charcoal/70 mt-4 text-lg">{t("notFoundText")}</p>
        <Link
          href="/"
          className="border-gold text-gold mt-8 inline-block border-b-2 transition-opacity hover:opacity-80"
        >
          {t("backToHome")}
        </Link>
      </div>
    </div>
  );
}
