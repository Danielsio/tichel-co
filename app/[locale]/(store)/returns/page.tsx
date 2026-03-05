import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return {
    title: t("returnsTitle"),
    alternates: { languages: { he: "/returns", en: "/en/returns" } },
  };
}

export default async function ReturnsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ReturnsContent />;
}

function ReturnsContent() {
  const t = useTranslations("legal");

  const sections = [
    { title: t("returns.policyTitle"), body: t("returns.policyText") },
    { title: t("returns.eligibleTitle"), body: t("returns.eligibleText") },
    { title: t("returns.processTitle"), body: t("returns.processText") },
    { title: t("returns.refundTitle"), body: t("returns.refundText") },
    { title: t("returns.exchangeTitle"), body: t("returns.exchangeText") },
    { title: t("returns.contactTitle"), body: t("returns.contactText") },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-6">
      <h1 className="font-display text-navy text-3xl font-semibold">
        {t("returnsTitle")}
      </h1>
      <p className="text-charcoal/50 mt-2 text-sm">{t("lastUpdated")}</p>
      <div className="mt-10 flex flex-col gap-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-navy text-lg font-semibold">{section.title}</h2>
            <p className="text-charcoal/70 mt-2 leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
