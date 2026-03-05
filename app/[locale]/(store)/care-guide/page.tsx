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
      languages: { he: "/care-guide", en: "/en/care-guide" },
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
      <section className="gradient-luxury relative overflow-hidden py-16 lg:py-20">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center lg:px-6">
          <h1 className="font-display text-ivory text-3xl font-semibold text-balance lg:text-5xl">
            {t("title")}
          </h1>
          <p className="text-ivory/40 mx-auto mt-5 max-w-lg text-[14px] leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Fabric Cards */}
      <section className="mx-auto max-w-4xl px-4 py-20 lg:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          {fabrics.map((fabric) => (
            <div key={fabric.title} className="border-stone/60 border p-7">
              <div className="flex items-start gap-4">
                <span className="text-gold mt-0.5 text-xl">{fabric.icon}</span>
                <div>
                  <h2 className="text-navy text-[15px] font-semibold">
                    {fabric.title}
                  </h2>
                  <p className="text-charcoal/50 mt-2 text-[13px] leading-relaxed">
                    {fabric.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* General Tips */}
        <div className="gradient-luxury text-ivory mt-14 p-10">
          <h2 className="font-display mb-4 text-xl font-semibold">
            {t("generalTitle")}
          </h2>
          <p className="text-ivory/50 text-[14px] leading-relaxed">
            {t("generalText")}
          </p>
        </div>
      </section>
    </>
  );
}
