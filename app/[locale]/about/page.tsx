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
      <section className="bg-stone py-20">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-6">
          <p className="text-gold mb-4 text-[11px] font-medium tracking-[0.2em] uppercase">
            {t("tag")}
          </p>
          <h1 className="font-display text-navy text-4xl leading-tight font-semibold md:text-5xl">
            {t("title")}
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-2xl px-4 py-16 lg:px-6">
        <div className="space-y-6">
          <p className="text-charcoal/80 text-base leading-relaxed">{t("p1")}</p>
          <p className="text-charcoal/80 text-base leading-relaxed">{t("p2")}</p>
          <p className="text-charcoal/80 text-base leading-relaxed">{t("p3")}</p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4 lg:px-6">
          <h2 className="font-display text-navy mb-12 text-center text-3xl font-semibold">
            {t("valuesTitle")}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="bg-stone rounded-sm p-8 text-center">
                <span className="text-gold mb-4 block text-2xl">{value.icon}</span>
                <h3 className="text-navy mb-3 text-lg font-semibold">{value.title}</h3>
                <p className="text-charcoal/60 text-sm leading-relaxed">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
