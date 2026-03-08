import type { Metadata } from "next";
import Image from "next/image";
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

export const dynamic = "force-dynamic";

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
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden sm:min-h-[90vh]">
        <div className="gradient-luxury absolute inset-0" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-gold animate-fade-in mb-4 text-[10px] font-semibold tracking-[0.3em] uppercase sm:mb-6 sm:text-[11px]">
            {t("hero.tag")}
          </p>
          <h1 className="font-display text-ivory animate-fade-up text-4xl leading-[1.08] font-semibold text-balance sm:text-5xl md:text-7xl lg:text-[5.5rem]">
            {t("hero.title")}
          </h1>
          <p className="text-ivory/50 animate-fade-up mx-auto mt-6 max-w-lg text-[14px] leading-relaxed [animation-delay:150ms] sm:mt-8 sm:text-base">
            {t("hero.subtitle")}
          </p>
          <div className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-3 [animation-delay:300ms] sm:mt-12 sm:gap-4">
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

        <div className="animate-fade-in absolute bottom-8 left-1/2 -translate-x-1/2 [animation-delay:800ms] sm:bottom-10">
          <div className="border-ivory/20 flex h-10 w-6 items-start justify-center rounded-full border p-1.5">
            <div className="bg-ivory/50 h-2 w-1 animate-bounce rounded-full" />
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20 lg:px-6 lg:py-24">
        <div className="mb-10 text-center sm:mb-14">
          <p className="section-heading">{t("collections.subtitle")}</p>
          <h2 className="font-display text-navy text-3xl font-semibold text-balance md:text-4xl lg:text-5xl">
            {t("collections.title")}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          {collections.map((col, i) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}` as never}
              className="group relative flex flex-col overflow-hidden rounded-xl"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={col.imageUrl}
                  alt={col.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                />
                <div className="from-navy/70 via-navy/20 group-hover:from-navy/80 absolute inset-0 bg-gradient-to-t to-transparent transition-opacity duration-500" />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 lg:p-5">
                  <h3 className="text-ivory font-display text-base font-semibold sm:text-lg lg:text-xl">
                    {col.title}
                  </h3>
                  <span className="text-ivory/50 mt-1 block text-[10px] tracking-[0.15em] uppercase opacity-0 transition-all duration-300 group-hover:opacity-100 sm:text-[11px]">
                    {t("collections.viewCollection")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="border-stone/60 border-y bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-10 flex items-end justify-between sm:mb-14">
            <div>
              <p className="section-heading">{t("featured.subtitle")}</p>
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
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {featured.map((product) => (
              <FeaturedProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="gradient-luxury relative overflow-hidden py-20 sm:py-24 lg:py-28">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="section-heading">{t("brand.tag")}</p>
          <h2 className="font-display text-ivory text-2xl leading-snug font-semibold text-balance sm:text-3xl md:text-4xl lg:text-5xl">
            {t("brand.title")}
          </h2>
          <p className="text-ivory/50 mx-auto mt-6 max-w-xl text-[14px] leading-relaxed sm:mt-8 sm:text-base">
            {t("brand.text")}
          </p>
          <Link href="/about" className="mt-8 inline-block sm:mt-10">
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
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20 lg:px-6 lg:py-24">
        <div className="border-stone overflow-hidden rounded-2xl border bg-white">
          <div className="flex flex-col items-center gap-8 p-8 text-center sm:p-10 md:flex-row md:p-16 md:text-start">
            <div className="flex-1">
              <p className="section-heading">{t("custom.tag")}</p>
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
