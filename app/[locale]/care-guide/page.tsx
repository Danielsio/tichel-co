import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "careGuide" });
  return {
    title: t("title"),
    description:
      locale === "he"
        ? "מדריך טיפול בכיסויי ראש — משי, קטיפה, קשמיר"
        : "Care guide for head coverings — silk, velvet, cashmere",
    alternates: {
      languages: { he: "/he/care-guide", en: "/en/care-guide" },
    },
  };
}

export default async function CareGuidePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CareGuideContent />;
}

function CareGuideContent() {
  const t = useTranslations("careGuide");

  const fabrics = [
    { title: t("silkTitle"), text: t("silkText"), icon: "◈" },
    { title: t("velvetTitle"), text: t("velvetText"), icon: "◆" },
    { title: t("cashmereTitle"), text: t("cashmereText"), icon: "◇" },
    { title: t("linenTitle"), text: t("linenText"), icon: "▣" },
    { title: t("cottonTitle"), text: t("cottonText"), icon: "○" },
  ];

  return (
    <>
      {/* Header */}
      <section className="bg-stone py-16">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-6">
          <h1 className="font-display text-navy text-4xl font-semibold">
            {t("title")}
          </h1>
          <p className="text-charcoal/60 mx-auto mt-4 max-w-lg text-sm leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Fabric Cards */}
      <section className="mx-auto max-w-4xl px-4 py-16 lg:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          {fabrics.map((fabric) => (
            <div key={fabric.title} className="border-stone rounded-sm border p-6">
              <div className="flex items-start gap-4">
                <span className="text-gold mt-0.5 text-xl">{fabric.icon}</span>
                <div>
                  <h2 className="text-navy text-lg font-semibold">{fabric.title}</h2>
                  <p className="text-charcoal/70 mt-2 text-sm leading-relaxed">
                    {fabric.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* General Tips */}
        <div className="bg-navy text-ivory mt-12 rounded-sm p-8">
          <h2 className="font-display mb-3 text-xl font-semibold">
            {t("generalTitle")}
          </h2>
          <p className="text-ivory/70 text-sm leading-relaxed">{t("generalText")}</p>
        </div>
      </section>
    </>
  );
}
