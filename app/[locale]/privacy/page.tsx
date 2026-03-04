import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return {
    title: t("privacyTitle"),
    alternates: { languages: { he: "/he/privacy", en: "/en/privacy" } },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PrivacyContent />;
}

function PrivacyContent() {
  const t = useTranslations("legal");

  const sections = [
    { title: t("privacy.collectTitle"), body: t("privacy.collectText") },
    { title: t("privacy.useTitle"), body: t("privacy.useText") },
    { title: t("privacy.shareTitle"), body: t("privacy.shareText") },
    { title: t("privacy.cookiesTitle"), body: t("privacy.cookiesText") },
    { title: t("privacy.rightsTitle"), body: t("privacy.rightsText") },
    { title: t("privacy.contactTitle"), body: t("privacy.contactText") },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-6">
      <h1 className="font-display text-navy text-3xl font-semibold">
        {t("privacyTitle")}
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
