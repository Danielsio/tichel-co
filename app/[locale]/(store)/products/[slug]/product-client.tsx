"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ProductGallery } from "@/components/product/product-gallery";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { formatPrice } from "@/lib/utils/format-price";
import { cn } from "@/lib/utils/cn";
import type { StoreProduct } from "@/types";

export function ProductPageClient({
  product,
  relatedProducts,
  collectionTitle,
}: {
  product: StoreProduct;
  relatedProducts: StoreProduct[];
  collectionTitle?: string;
}) {
  const t = useTranslations("product");
  const tNav = useTranslations("nav");

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const selectedVariant = product.variants[selectedVariantIdx]!;

  const isOnSale =
    product.comparePriceCents && product.comparePriceCents > product.priceCents;

  const images = selectedVariant.imageUrls.map((url) => ({
    url,
    altText: product.title,
  }));

  const firstCollection = product.collectionIds[0];

  const breadcrumbItems = [
    { label: tNav("collections"), href: "/collections/signature-collection" },
    ...(firstCollection
      ? [
          {
            label: collectionTitle ?? firstCollection,
            href: `/collections/${firstCollection}` as const,
          },
        ]
      : []),
    { label: product.title },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:px-6">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mt-6 grid gap-8 sm:mt-8 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={images} />

        <div className="flex flex-col">
          {(product.isNew || isOnSale) && (
            <div className="mb-4 flex gap-2">
              {product.isNew && <Badge variant="new">{t("new")}</Badge>}
              {isOnSale && <Badge variant="sale">{t("sale")}</Badge>}
            </div>
          )}

          <h1 className="font-display text-navy text-2xl font-semibold md:text-3xl lg:text-4xl">
            {product.title}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span
              className={cn(
                "text-xl font-semibold lg:text-2xl",
                isOnSale ? "text-error" : "text-navy",
              )}
            >
              {formatPrice(product.priceCents)}
            </span>
            {isOnSale && product.comparePriceCents && (
              <span className="text-charcoal/30 text-base line-through">
                {formatPrice(product.comparePriceCents)}
              </span>
            )}
          </div>

          <div className="mt-3">
            {selectedVariant.stockQty > 0 ? (
              <span className="text-success/80 inline-flex items-center gap-1.5 text-[12px] font-medium tracking-wide">
                <span className="bg-success inline-block h-1.5 w-1.5 rounded-full" />
                {selectedVariant.stockQty <= 5
                  ? t("lowStock", { count: selectedVariant.stockQty })
                  : t("inStock")}
              </span>
            ) : (
              <span className="text-error inline-flex items-center gap-1.5 text-[12px] font-medium tracking-wide">
                <span className="bg-error inline-block h-1.5 w-1.5 rounded-full" />
                {t("outOfStock")}
              </span>
            )}
          </div>

          <div className="border-stone/60 my-6 border-t" />

          {product.variants.length > 1 && (
            <div className="mb-6">
              <h3 className="text-navy/60 mb-3 text-[11px] font-semibold tracking-[0.15em] uppercase">
                {t("color")}: <span className="text-navy">{selectedVariant.color}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, idx) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantIdx(idx)}
                    aria-pressed={idx === selectedVariantIdx}
                    className={cn(
                      "cursor-pointer rounded-lg border px-4 py-2.5 text-[13px] transition-all duration-200",
                      idx === selectedVariantIdx
                        ? "border-navy bg-navy/5 text-navy font-medium"
                        : "border-stone text-charcoal/50 hover:border-navy/30",
                      variant.stockQty === 0 &&
                        "pointer-events-none line-through opacity-30",
                    )}
                  >
                    {variant.color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <span className="text-navy/60 text-[11px] tracking-[0.15em] uppercase">
              {t("fabric")}:
            </span>{" "}
            <span className="text-navy text-[13px] font-medium">
              {selectedVariant.fabric}
            </span>
          </div>

          <AddToCartButton
            variantId={selectedVariant.id}
            productId={product.id}
            name={product.title}
            price={product.priceCents}
            image={selectedVariant.imageUrls[0] ?? ""}
            color={selectedVariant.color}
            size={selectedVariant.size ?? t("oneSize")}
            stockQty={selectedVariant.stockQty}
          />

          <div className="border-stone/60 mt-10 space-y-6 border-t pt-8">
            <div>
              <h3 className="text-navy mb-3 text-[11px] font-semibold tracking-[0.15em] uppercase">
                {t("description")}
              </h3>
              <p className="text-charcoal/60 text-[14px] leading-[1.8]">
                {product.description}
              </p>
            </div>

            <div className="border-stone/60 border-t pt-6">
              <h3 className="text-navy mb-2 text-[11px] font-semibold tracking-[0.15em] uppercase">
                {t("shipping")}
              </h3>
              <p className="text-charcoal/50 text-[13px]">{t("shippingText")}</p>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="border-stone/60 mt-20 border-t pt-16 sm:mt-24">
          <h2 className="font-display text-navy mb-10 text-center text-2xl font-semibold md:text-3xl">
            {t("completeTheLook")}
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 lg:gap-x-6">
            {relatedProducts.map((rp) => {
              const v = rp.variants[0];
              const stock = rp.variants.reduce((s, vr) => s + vr.stockQty, 0);
              return (
                <ProductCard
                  key={rp.id}
                  slug={rp.slug}
                  title={rp.title}
                  priceCents={rp.priceCents}
                  comparePriceCents={rp.comparePriceCents}
                  imageUrl={v?.imageUrls[0]}
                  imageAlt={rp.title}
                  isNew={rp.isNew}
                  stockQty={stock}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
