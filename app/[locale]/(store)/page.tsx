import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import {
  MOCK_COLLECTIONS,
  getFeaturedProducts,
  type MockProduct,
} from "@/lib/mock-data";
import type { Locale } from "@/types";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomePageContent locale={locale as Locale} />;
}

function HomePageContent({ locale }: { locale: Locale }) {
  const t = useTranslations("home");
  const featured = getFeaturedProducts();

  return (
    <>
      {/* Hero */}
      <section className="bg-stone relative flex min-h-[85vh] items-center justify-center">
        <div className="from-navy/5 absolute inset-0 bg-gradient-to-b to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <p className="text-gold mb-4 text-[11px] font-medium tracking-[0.2em] uppercase">
            {t("hero.tag")}
          </p>
          <h1 className="font-display text-navy text-5xl leading-[1.1] font-semibold md:text-7xl lg:text-8xl">
            {t("hero.title")}
          </h1>
          <p className="text-charcoal/60 mx-auto mt-6 max-w-md text-lg leading-relaxed whitespace-pre-line">
            {t("hero.subtitle")}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/collections/signature-collection">
              <Button size="lg">{t("hero.cta")}</Button>
            </Link>
            <Link href="/custom">
              <Button variant="secondary" size="lg">
                {t("hero.customCta")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-display text-navy text-3xl font-semibold md:text-4xl">
            {t("collections.title")}
          </h2>
          <p className="text-charcoal/50 mx-auto mt-3 max-w-md text-sm">
            {t("collections.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-6">
          {MOCK_COLLECTIONS.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}` as never}
              className="group flex flex-col"
            >
              <div className="bg-stone relative aspect-[3/4] overflow-hidden rounded-sm">
                <img
                  src={col.imageUrl}
                  alt={col.title[locale]}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="from-navy/50 absolute inset-0 bg-gradient-to-t to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="text-ivory font-display text-lg font-semibold">
                    {col.title[locale]}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="font-display text-navy text-3xl font-semibold md:text-4xl">
                {t("featured.title")}
              </h2>
              <p className="text-charcoal/50 mt-3 text-sm">{t("featured.subtitle")}</p>
            </div>
            <Link href="/collections/signature-collection">
              <Button variant="ghost" size="sm">
                {t("featured.viewAll")}
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {featured.map((product) => (
              <FeaturedProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Banner */}
      <section className="bg-navy text-ivory py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-gold mb-4 text-[11px] font-medium tracking-[0.2em] uppercase">
            {t("brand.tag")}
          </p>
          <h2 className="font-display text-3xl leading-snug font-semibold md:text-4xl">
            {t("brand.title")}
          </h2>
          <p className="text-ivory/60 mx-auto mt-6 max-w-xl text-base leading-relaxed">
            {t("brand.text")}
          </p>
          <Link href="/about" className="mt-8 inline-block">
            <Button
              variant="secondary"
              className="border-ivory/30 text-ivory hover:bg-ivory hover:text-navy"
            >
              {t("brand.cta")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Custom Design CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <div className="bg-stone overflow-hidden rounded-sm">
          <div className="flex flex-col items-center gap-8 p-8 text-center md:flex-row md:p-12 md:text-start">
            <div className="flex-1">
              <h2 className="font-display text-navy text-2xl font-semibold md:text-3xl">
                {t("custom.title")}
              </h2>
              <p className="text-charcoal/60 mt-3 text-sm leading-relaxed">
                {t("custom.text")}
              </p>
            </div>
            <Link href="/custom">
              <Button size="lg">{t("custom.cta")}</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function FeaturedProductCard({
  product,
  locale,
}: {
  product: MockProduct;
  locale: Locale;
}) {
  const firstVariant = product.variants[0];
  const totalStock = product.variants.reduce((s, v) => s + v.stockQty, 0);

  return (
    <ProductCard
      slug={product.slug}
      title={product.title[locale]}
      priceCents={product.priceCents}
      comparePriceCents={product.comparePriceCents}
      imageUrl={firstVariant?.imageUrls[0]}
      imageAlt={product.title[locale]}
      isNew={product.isNew}
      stockQty={totalStock}
    />
  );
}
