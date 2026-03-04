"use client";

import { use, useState, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { ProductGallery } from "@/components/product/product-gallery";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { formatPrice } from "@/lib/utils/format-price";
import { getProductBySlug, MOCK_PRODUCTS } from "@/lib/mock-data";
import { cn } from "@/lib/utils/cn";
import type { Locale } from "@/types";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default function ProductPage({ params }: Props) {
  const { slug } = use(params);
  const locale = useLocale() as Locale;
  const t = useTranslations("product");
  const tNav = useTranslations("nav");

  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center lg:px-6">
        <h1 className="font-display text-navy text-3xl font-semibold">
          Product not found
        </h1>
        <Link
          href="/"
          className="text-navy/50 hover:text-navy mt-4 inline-block text-sm transition-colors"
        >
          {t("backToCollection")}
        </Link>
      </div>
    );
  }

  return <ProductPageContent product={product} locale={locale} t={t} tNav={tNav} />;
}

function ProductPageContent({
  product,
  locale,
  t,
  tNav,
}: {
  product: NonNullable<ReturnType<typeof getProductBySlug>>;
  locale: Locale;
  t: ReturnType<typeof useTranslations>;
  tNav: ReturnType<typeof useTranslations>;
}) {
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const selectedVariant = product.variants[selectedVariantIdx]!;

  const isOnSale =
    product.comparePriceCents && product.comparePriceCents > product.priceCents;

  const images = selectedVariant.imageUrls.map((url) => ({
    url,
    altText: product.title[locale],
  }));

  const relatedProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.id !== product.id &&
        p.collectionIds.some((c) => product.collectionIds.includes(c)),
    ).slice(0, 4);
  }, [product]);

  const firstCollection = product.collectionIds[0];

  const breadcrumbItems = [
    { label: tNav("collections"), href: "/collections/signature-collection" },
    ...(firstCollection
      ? [
          {
            label: firstCollection
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l: string) => l.toUpperCase()),
            href: `/collections/${firstCollection}` as const,
          },
        ]
      : []),
    { label: product.title[locale] },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <ProductGallery images={images} />

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Badges */}
          {(product.isNew || isOnSale) && (
            <div className="mb-4 flex gap-2">
              {product.isNew && <Badge variant="new">{t("new")}</Badge>}
              {isOnSale && <Badge variant="sale">{t("sale")}</Badge>}
            </div>
          )}

          <h1 className="font-display text-navy text-2xl font-semibold md:text-3xl lg:text-4xl">
            {product.title[locale]}
          </h1>

          {/* Price */}
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

          {/* Stock */}
          <div className="mt-3">
            {selectedVariant.stockQty > 0 ? (
              <span className="text-success/80 text-[12px] font-medium tracking-wide">
                {selectedVariant.stockQty <= 5
                  ? t("lowStock", { count: selectedVariant.stockQty })
                  : t("inStock")}
              </span>
            ) : (
              <span className="text-error text-[12px] font-medium tracking-wide">
                {t("outOfStock")}
              </span>
            )}
          </div>

          {/* Separator */}
          <div className="border-stone/60 my-6 border-t" />

          {/* Color Variants */}
          {product.variants.length > 1 && (
            <div className="mb-6">
              <h3 className="text-navy/60 mb-3 text-[11px] font-semibold tracking-[0.15em] uppercase">
                {t("color")}:{" "}
                <span className="text-navy">{selectedVariant.color[locale]}</span>
              </h3>
              <div className="flex gap-2">
                {product.variants.map((variant, idx) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantIdx(idx)}
                    className={cn(
                      "cursor-pointer border px-4 py-2.5 text-[13px] transition-all duration-200",
                      idx === selectedVariantIdx
                        ? "border-navy text-navy font-medium"
                        : "border-stone text-charcoal/50 hover:border-navy/30",
                      variant.stockQty === 0 && "opacity-30",
                    )}
                  >
                    {variant.color[locale]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fabric */}
          <div className="mb-8">
            <span className="text-navy/60 text-[11px] tracking-[0.15em] uppercase">
              {t("fabric")}:
            </span>{" "}
            <span className="text-navy text-[13px] font-medium">
              {selectedVariant.fabric[locale]}
            </span>
          </div>

          {/* Add to Cart */}
          <AddToCartButton
            variantId={selectedVariant.id}
            productId={product.id}
            name={product.title[locale]}
            price={product.priceCents}
            image={selectedVariant.imageUrls[0] ?? ""}
            color={selectedVariant.color[locale]}
            size={selectedVariant.size ?? "One Size"}
            stockQty={selectedVariant.stockQty}
          />

          {/* Description */}
          <div className="border-stone/60 mt-10 border-t pt-8">
            <h3 className="text-navy mb-3 text-[11px] font-semibold tracking-[0.15em] uppercase">
              {t("description")}
            </h3>
            <p className="text-charcoal/60 text-[14px] leading-[1.8]">
              {product.description[locale]}
            </p>
          </div>

          {/* Shipping */}
          <div className="border-stone/60 mt-6 border-t pt-6">
            <h3 className="text-navy mb-2 text-[11px] font-semibold tracking-[0.15em] uppercase">
              {t("shipping")}
            </h3>
            <p className="text-charcoal/50 text-[13px]">{t("shippingText")}</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-stone/60 mt-24 border-t pt-16">
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
                  title={rp.title[locale]}
                  priceCents={rp.priceCents}
                  comparePriceCents={rp.comparePriceCents}
                  imageUrl={v?.imageUrls[0]}
                  imageAlt={rp.title[locale]}
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
