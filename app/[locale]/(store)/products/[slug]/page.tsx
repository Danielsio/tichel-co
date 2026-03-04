import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { locale, slug: _slug } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
      <h1 className="font-display text-navy text-3xl font-semibold">Product Detail</h1>
      <p className="text-charcoal/60 mt-4">
        Full PDP with gallery, variants, reviews — Phase 2/3
      </p>
    </div>
  );
}
