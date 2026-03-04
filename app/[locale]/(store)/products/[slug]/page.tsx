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
  const tCommon = useTranslations("common");

  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center lg:px-6">
        <h1 className="font-display text-navy text-3xl font-semibold">
          Product not found
        </h1>
        <Link href="/" className="text-gold mt-4 inline-block text-sm hover:underline">
          {t("backToCollection")}
        </Link>
      </div>
    );
  }

  return (
    <ProductPageContent
      product={product}
      locale={locale}
      t={t}
      tNav={tNav}
      tCommon={tCommon}
    />
  );
}

function ProductPageContent({
  product,
  locale,
  t,
  tNav,
  tCommon,
}: {
  product: NonNullable<ReturnType<typeof getProductBySlug>>;
  locale: Locale;
  t: ReturnType<typeof useTranslations>;
  tNav: ReturnType<typeof useTranslations>;
  tCommon: ReturnType<typeof useTranslations>;
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
      <Breadcrumb items={breadcrumbItems} ariaLabel={tCommon("breadcrumb")} />

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <ProductGallery images={images} />

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Badges */}
          <div className="mb-3 flex gap-2">
            {product.isNew && <Badge variant="new">{t("new")}</Badge>}
            {isOnSale && <Badge variant="sale">{t("sale")}</Badge>}
          </div>

          <h1 className="font-display text-navy text-2xl font-semibold md:text-3xl">
            {product.title[locale]}
          </h1>

          {/* Price */}
          <div className="mt-3 flex items-center gap-3">
            <span
              className={cn(
                "text-xl font-semibold",
                isOnSale ? "text-gold" : "text-charcoal",
              )}
            >
              {formatPrice(product.priceCents)}
            </span>
            {isOnSale && product.comparePriceCents && (
              <span className="text-charcoal/40 text-base line-through">
                {formatPrice(product.comparePriceCents)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mt-2">
            {selectedVariant.stockQty > 0 ? (
              <span className="text-success text-xs font-medium">
                {selectedVariant.stockQty <= 5
                  ? t("lowStock", { count: selectedVariant.stockQty })
                  : t("inStock")}
              </span>
            ) : (
              <span className="text-error text-xs font-medium">{t("outOfStock")}</span>
            )}
          </div>

          {/* Color Variants */}
          {product.variants.length > 1 && (
            <div className="mt-6">
              <h3 className="text-navy mb-2 text-xs font-semibold tracking-wider uppercase">
                {t("color")}: {selectedVariant.color[locale]}
              </h3>
              <div className="flex gap-2">
                {product.variants.map((variant, idx) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantIdx(idx)}
                    className={cn(
                      "rounded-sm border-2 px-3 py-2 text-sm transition-all",
                      idx === selectedVariantIdx
                        ? "border-gold text-navy font-medium"
                        : "border-stone text-charcoal/60 hover:border-charcoal/30",
                      variant.stockQty === 0 && "opacity-40",
                    )}
                  >
                    {variant.color[locale]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fabric */}
          <div className="mt-4">
            <span className="text-charcoal/50 text-xs tracking-wider uppercase">
              {t("fabric")}:
            </span>{" "}
            <span className="text-charcoal text-sm">
              {selectedVariant.fabric[locale]}
            </span>
          </div>

          {/* Add to Cart */}
          <div className="mt-8">
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
          </div>

          {/* Description */}
          <div className="border-stone mt-8 border-t pt-6">
            <h3 className="text-navy mb-3 text-sm font-semibold">{t("description")}</h3>
            <p className="text-charcoal/70 text-sm leading-relaxed">
              {product.description[locale]}
            </p>
          </div>

          {/* Shipping */}
          <div className="border-stone mt-6 border-t pt-6">
            <h3 className="text-navy mb-2 text-sm font-semibold">{t("shipping")}</h3>
            <p className="text-charcoal/60 text-sm">{t("shippingText")}</p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-navy mb-8 text-2xl font-semibold">
            {t("completeTheLook")}
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 lg:gap-x-6">
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
