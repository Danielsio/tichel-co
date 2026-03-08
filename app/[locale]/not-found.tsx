import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-navy text-6xl font-semibold">{t("title")}</h1>
        <p className="text-charcoal/70 mt-4 text-lg">{t("text")}</p>
        <Link
          href="/"
          className="border-gold text-gold mt-8 inline-block border-b-2 transition-opacity hover:opacity-80"
        >
          {t("home")}
        </Link>
      </div>
    </div>
  );
}
