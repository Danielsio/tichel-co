"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { use, useMemo, useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  getCollectionBySlug,
  getProductsByCollection,
  MOCK_COLLECTIONS,
  type MockProduct,
} from "@/lib/mock-data";
import type { Locale } from "@/types";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

type SortOption = "newest" | "price-low" | "price-high";

export default function CollectionPage({ params }: Props) {
  const { slug } = use(params);
  const locale = useLocale() as Locale;
  const t = useTranslations("filter");
  const tCol = useTranslations("collection");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  const collection = getCollectionBySlug(slug);
  const allProducts = useMemo(() => getProductsByCollection(slug), [slug]);

  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);

  const fabrics = useMemo(() => {
    const set = new Set<string>();
    allProducts.forEach((p) => p.variants.forEach((v) => set.add(v.fabric[locale])));
    return Array.from(set);
  }, [allProducts, locale]);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

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
  }, [allProducts, sortBy, selectedFabrics, locale]);

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

  if (!collection) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center lg:px-6">
        <h1 className="font-display text-navy text-3xl font-semibold">
          {tCol("allProducts")}
        </h1>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: tNav("collections"), href: "/collections/signature-collection" },
    { label: collection.title[locale] },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <Breadcrumb items={breadcrumbItems} ariaLabel={tCommon("breadcrumb")} />

      {/* Collection Header */}
      <div className="mt-4 mb-10">
        <h1 className="font-display text-navy text-3xl font-semibold md:text-4xl">
          {collection.title[locale]}
        </h1>
        <p className="text-charcoal/60 mt-2 max-w-2xl text-sm leading-relaxed">
          {collection.description[locale]}
        </p>
      </div>

      {/* Toolbar */}
      <div className="border-stone mb-8 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <p className="text-charcoal/50 text-sm">
          {tCol("productsCount", { count: filteredProducts.length })}
        </p>
        <div className="flex items-center gap-3">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-auto text-sm"
          >
            <option value="newest">{t("sortNewest")}</option>
            <option value="price-low">{t("sortPriceLow")}</option>
            <option value="price-high">{t("sortPriceHigh")}</option>
          </Select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filter Sidebar (desktop) */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-28">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-navy text-sm font-semibold">{t("title")}</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-gold text-xs font-medium hover:underline"
                >
                  {t("clearAll")}
                </button>
              )}
            </div>

            {/* Fabric Filter */}
            {fabrics.length > 0 && (
              <div className="mb-6">
                <h4 className="text-navy mb-3 text-xs font-semibold tracking-wider uppercase">
                  {t("fabric")}
                </h4>
                <div className="flex flex-col gap-2">
                  {fabrics.map((fabric) => (
                    <label
                      key={fabric}
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFabrics.includes(fabric)}
                        onChange={() => toggleFabric(fabric)}
                        className="accent-gold h-4 w-4 rounded"
                      />
                      <span className="text-charcoal/80">{fabric}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Other Collections */}
            <div className="border-stone border-t pt-6">
              <h4 className="text-navy mb-3 text-xs font-semibold tracking-wider uppercase">
                {tNav("collections")}
              </h4>
              <div className="flex flex-col gap-1">
                {MOCK_COLLECTIONS.map((col) => (
                  <Link
                    key={col.id}
                    href={`/collections/${col.slug}` as never}
                    className={`rounded-sm px-2 py-1.5 text-sm transition-colors ${
                      col.slug === slug
                        ? "text-gold font-medium"
                        : "text-charcoal/60 hover:text-navy"
                    }`}
                  >
                    {col.title[locale]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedFabrics.map((fabric) => (
                <button
                  key={fabric}
                  onClick={() => toggleFabric(fabric)}
                  className="bg-stone text-charcoal/80 hover:bg-stone/80 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors"
                >
                  {fabric}
                  <span className="ms-1 text-[10px]">✕</span>
                </button>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-charcoal/50 text-sm">{t("noResults")}</p>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-4">
                {t("clearAll")}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:gap-x-6">
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
  );
}

function CollectionProductCard({
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
