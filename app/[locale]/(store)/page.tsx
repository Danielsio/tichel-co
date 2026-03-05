import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import {
  getFeaturedProducts,
  getPublishedCollections,
} from "@/lib/firebase/admin-queries";
import type { StoreProduct, StoreCollection } from "@/types";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: t("hero.title"),
    description: t("hero.subtitle"),
    alternates: {
      languages: { he: "/", en: "/en" },
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [featured, collections] = await Promise.all([
    getFeaturedProducts(),
    getPublishedCollections(),
  ]);

  return <HomePageContent featured={featured} collections={collections} />;
}

function HomePageContent({
  featured,
  collections,
}: {
  featured: StoreProduct[];
  collections: StoreCollection[];
}) {
  const t = useTranslations("home");

  return (
    <>
      {/* Hero — Full Impact */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        <div className="gradient-luxury absolute inset-0" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <p className="text-gold animate-fade-in mb-6 text-[11px] font-semibold tracking-[0.3em] uppercase">
            {t("hero.tag")}
          </p>
          <h1 className="font-display text-ivory animate-fade-up text-5xl leading-[1.08] font-semibold text-balance md:text-7xl lg:text-[5.5rem]">
            {t("hero.title")}
          </h1>
          <p className="text-ivory/50 animate-fade-up mx-auto mt-8 max-w-lg text-base leading-relaxed [animation-delay:150ms]">
            {t("hero.subtitle")}
          </p>
          <div className="animate-fade-up mt-12 flex flex-wrap items-center justify-center gap-4 [animation-delay:300ms]">
            <Link href="/collections/signature-collection">
              <Button
                size="lg"
                className="bg-ivory text-navy hover:bg-ivory/90 border-ivory"
              >
                {t("hero.cta")}
              </Button>
            </Link>
            <Link href="/custom">
              <Button
                variant="secondary"
                size="lg"
                className="border-ivory/30 text-ivory hover:border-ivory hover:bg-ivory hover:text-navy"
              >
                {t("hero.customCta")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-in absolute bottom-10 left-1/2 -translate-x-1/2 [animation-delay:800ms]">
          <div className="border-ivory/20 flex h-10 w-6 items-start justify-center rounded-full border p-1.5">
            <div className="bg-ivory/50 h-2 w-1 animate-bounce rounded-full" />
          </div>
        </div>
      </section>

      {/* Collections — Editorial Grid */}
      <section className="mx-auto max-w-7xl px-4 py-24 lg:px-6">
        <div className="mb-14 text-center">
          <p className="text-gold mb-3 text-[11px] font-semibold tracking-[0.3em] uppercase">
            {t("collections.subtitle")}
          </p>
          <h2 className="font-display text-navy text-3xl font-semibold text-balance md:text-4xl lg:text-5xl">
            {t("collections.title")}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 lg:gap-4">
          {collections.map((col, i) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}` as never}
              className="group relative flex flex-col overflow-hidden"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={col.imageUrl}
                  alt={col.title}
                  className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="from-navy/70 via-navy/20 group-hover:from-navy/80 absolute inset-0 bg-gradient-to-t to-transparent transition-opacity duration-500" />
                <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5">
                  <h3 className="text-ivory font-display text-lg font-semibold lg:text-xl">
                    {col.title}
                  </h3>
                  <span className="text-ivory/50 mt-1 block text-[11px] tracking-[0.15em] uppercase opacity-0 transition-all duration-300 group-hover:opacity-100">
                    {t("collections.viewCollection")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="border-stone/60 border-y bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-14 flex items-end justify-between">
            <div>
              <p className="text-gold mb-3 text-[11px] font-semibold tracking-[0.3em] uppercase">
                {t("featured.subtitle")}
              </p>
              <h2 className="font-display text-navy text-3xl font-semibold md:text-4xl">
                {t("featured.title")}
              </h2>
            </div>
            <Link href="/collections/signature-collection">
              <Button variant="ghost" size="sm">
                {t("featured.viewAll")}
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {featured.map((product) => (
              <FeaturedProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Banner */}
      <section className="gradient-luxury relative overflow-hidden py-28">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <p className="text-gold mb-5 text-[11px] font-semibold tracking-[0.3em] uppercase">
            {t("brand.tag")}
          </p>
          <h2 className="font-display text-ivory text-3xl leading-snug font-semibold text-balance md:text-4xl lg:text-5xl">
            {t("brand.title")}
          </h2>
          <p className="text-ivory/50 mx-auto mt-8 max-w-xl text-base leading-relaxed">
            {t("brand.text")}
          </p>
          <Link href="/about" className="mt-10 inline-block">
            <Button
              variant="secondary"
              className="border-ivory/20 text-ivory hover:border-ivory hover:bg-ivory hover:text-navy"
            >
              {t("brand.cta")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Custom Design CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 lg:px-6">
        <div className="border-stone overflow-hidden border">
          <div className="flex flex-col items-center gap-10 p-10 text-center md:flex-row md:p-16 md:text-start">
            <div className="flex-1">
              <p className="text-gold mb-3 text-[11px] font-semibold tracking-[0.3em] uppercase">
                {t("custom.tag")}
              </p>
              <h2 className="font-display text-navy text-2xl font-semibold md:text-3xl lg:text-4xl">
                {t("custom.title")}
              </h2>
              <p className="text-charcoal/50 mt-4 max-w-md text-[14px] leading-relaxed">
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

function FeaturedProductCard({ product }: { product: StoreProduct }) {
  const firstVariant = product.variants[0];
  const totalStock = product.variants.reduce((s, v) => s + v.stockQty, 0);

  return (
    <ProductCard
      slug={product.slug}
      title={product.title}
      priceCents={product.priceCents}
      comparePriceCents={product.comparePriceCents}
      imageUrl={firstVariant?.imageUrls[0]}
      imageAlt={product.title}
      isNew={product.isNew}
      stockQty={totalStock}
    />
  );
}
