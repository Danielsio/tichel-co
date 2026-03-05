"use client";

import { useTranslations, useLocale } from "next-intl";
import { useMemo, useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import type { Locale, StoreProduct, StoreCollection } from "@/types";

type SortOption = "newest" | "price-low" | "price-high";

export function CollectionPageClient({
  collection,
  products,
  allCollections,
}: {
  collection: StoreCollection;
  products: StoreProduct[];
  allCollections: StoreCollection[];
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("filter");
  const tCol = useTranslations("collection");
  const tNav = useTranslations("nav");

  const slug = collection.slug;

  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);

  const fabrics = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.variants.forEach((v) => set.add(v.fabric[locale])));
    return Array.from(set);
  }, [products, locale]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedFabrics.length > 0) {
      result = result.filter((p) =>
        p.variants.some((v) => selectedFabrics.includes(v.fabric[locale])),
      );
    }

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.priceCents - b.priceCents);
        break;
      case "price-high":
        result.sort((a, b) => b.priceCents - a.priceCents);
        break;
      case "newest":
      default:
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [products, sortBy, selectedFabrics, locale]);

  const toggleFabric = (fabric: string) => {
    setSelectedFabrics((prev) =>
      prev.includes(fabric) ? prev.filter((f) => f !== fabric) : [...prev, fabric],
    );
  };

  const clearFilters = () => {
    setSelectedFabrics([]);
    setSortBy("newest");
  };

  const hasActiveFilters = selectedFabrics.length > 0;

  const breadcrumbItems = [
    { label: tNav("collections"), href: "/collections/signature-collection" },
    { label: collection.title[locale] },
  ];

  return (
    <>
      <section className="gradient-luxury relative overflow-hidden py-16 lg:py-20">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <Breadcrumb
            items={breadcrumbItems}
            className="[&_a]:text-ivory/50 [&_a]:hover:text-ivory/80 [&_span]:text-ivory/50 [&_svg]:text-ivory/30 mb-6"
          />
          <h1 className="font-display text-ivory text-3xl font-semibold text-balance md:text-4xl lg:text-5xl">
            {collection.title[locale]}
          </h1>
          <p className="text-ivory/50 mt-3 max-w-2xl text-[14px] leading-relaxed">
            {collection.description[locale]}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <div className="border-stone/60 mb-8 flex flex-wrap items-center justify-between gap-4 border-b pb-5">
          <p className="text-charcoal/50 text-[13px]">
            {tCol("productsCount", { count: filteredProducts.length })}
          </p>
          <div className="flex items-center gap-3">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-auto border-0 bg-transparent text-[13px]"
            >
              <option value="newest">{t("sortNewest")}</option>
              <option value="price-low">{t("sortPriceLow")}</option>
              <option value="price-high">{t("sortPriceHigh")}</option>
            </Select>
          </div>
        </div>

        <div className="flex gap-10">
          <aside className="hidden w-52 shrink-0 lg:block">
            <div className="sticky top-28">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-navy text-[11px] font-semibold tracking-[0.2em] uppercase">
                  {t("title")}
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-navy/50 hover:text-navy cursor-pointer text-[11px] font-medium transition-colors"
                  >
                    {t("clearAll")}
                  </button>
                )}
              </div>

              {fabrics.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-navy/60 mb-3 text-[11px] font-semibold tracking-[0.15em] uppercase">
                    {t("fabric")}
                  </h4>
                  <div className="flex flex-col gap-2.5">
                    {fabrics.map((fabric) => (
                      <label
                        key={fabric}
                        className="flex cursor-pointer items-center gap-2.5 text-[13px]"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFabrics.includes(fabric)}
                          onChange={() => toggleFabric(fabric)}
                          className="accent-navy h-3.5 w-3.5"
                        />
                        <span className="text-charcoal/80">{fabric}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-stone/60 border-t pt-8">
                <h4 className="text-navy/60 mb-4 text-[11px] font-semibold tracking-[0.15em] uppercase">
                  {tNav("collections")}
                </h4>
                <div className="flex flex-col gap-1">
                  {allCollections.map((col) => (
                    <Link
                      key={col.id}
                      href={`/collections/${col.slug}` as never}
                      className={`py-1.5 text-[13px] transition-colors duration-200 ${
                        col.slug === slug
                          ? "text-navy font-medium"
                          : "text-charcoal/50 hover:text-navy"
                      }`}
                    >
                      {col.title[locale]}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedFabrics.map((fabric) => (
                  <button
                    key={fabric}
                    onClick={() => toggleFabric(fabric)}
                    className="border-stone text-charcoal/60 hover:border-navy/30 flex cursor-pointer items-center gap-1.5 border px-3 py-1.5 text-[11px] font-medium tracking-wide transition-colors"
                  >
                    {fabric}
                    <span className="text-charcoal/30 text-[10px]">✕</span>
                  </button>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-charcoal/50 text-[13px]">{t("noResults")}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  {t("clearAll")}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6">
                {filteredProducts.map((product) => (
                  <CollectionProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function CollectionProductCard({
  product,
  locale,
}: {
  product: StoreProduct;
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
