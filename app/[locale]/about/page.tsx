import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("p1"),
    alternates: { languages: { he: "/he/about", en: "/en/about" } },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutPageContent />;
}

function AboutPageContent() {
  const t = useTranslations("about");

  const values = [
    { title: t("value1Title"), text: t("value1Text"), icon: "✦" },
    { title: t("value2Title"), text: t("value2Text"), icon: "◇" },
    { title: t("value3Title"), text: t("value3Text"), icon: "❋" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="gradient-luxury relative overflow-hidden py-20 lg:py-28">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center lg:px-6">
          <p className="text-gold mb-4 text-[11px] font-semibold tracking-[0.3em] uppercase">
            {t("tag")}
          </p>
          <h1 className="font-display text-ivory text-4xl leading-tight font-semibold text-balance md:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-2xl px-4 py-20 lg:px-6">
        <div className="space-y-7">
          <p className="text-charcoal/70 text-[15px] leading-[1.9]">{t("p1")}</p>
          <p className="text-charcoal/70 text-[15px] leading-[1.9]">{t("p2")}</p>
          <p className="text-charcoal/70 text-[15px] leading-[1.9]">{t("p3")}</p>
        </div>
      </section>

      {/* Values */}
      <section className="border-stone/60 border-y bg-white py-24">
        <div className="mx-auto max-w-5xl px-4 lg:px-6">
          <h2 className="font-display text-navy mb-14 text-center text-3xl font-semibold md:text-4xl">
            {t("valuesTitle")}
          </h2>
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {values.map((value) => (
              <div key={value.title} className="border-stone/60 border p-8 text-center">
                <span className="text-gold mb-5 block text-2xl">{value.icon}</span>
                <h3 className="text-navy mb-3 text-[15px] font-semibold">
                  {value.title}
                </h3>
                <p className="text-charcoal/50 text-[13px] leading-relaxed">
                  {value.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
