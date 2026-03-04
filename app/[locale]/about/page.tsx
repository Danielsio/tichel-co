import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
      <h1 className="font-display text-navy text-3xl font-semibold">
        About Tichel & Co.
      </h1>
      <p className="text-charcoal/60 mt-4">
        Brand story, values, founder story — Phase 2
      </p>
    </div>
  );
}
