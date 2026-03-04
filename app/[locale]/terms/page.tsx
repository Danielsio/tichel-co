import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return {
    title: t("termsTitle"),
    alternates: { languages: { he: "/he/terms", en: "/en/terms" } },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TermsContent />;
}

function TermsContent() {
  const t = useTranslations("legal");

  const sections = [
    { title: t("terms.generalTitle"), body: t("terms.generalText") },
    { title: t("terms.productsTitle"), body: t("terms.productsText") },
    { title: t("terms.paymentTitle"), body: t("terms.paymentText") },
    { title: t("terms.shippingTitle"), body: t("terms.shippingText") },
    { title: t("terms.liabilityTitle"), body: t("terms.liabilityText") },
    { title: t("terms.governingTitle"), body: t("terms.governingText") },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-6">
      <h1 className="font-display text-navy text-3xl font-semibold">
        {t("termsTitle")}
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
