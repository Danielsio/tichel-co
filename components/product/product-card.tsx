"use client";

import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/format-price";

export interface ProductCardProps {
  slug: string;
  title: string;
  priceCents: number;
  comparePriceCents?: number | null;
  imageUrl?: string;
  imageAlt?: string;
  isNew?: boolean;
  stockQty?: number;
  className?: string;
}

export const ProductCard = memo(function ProductCard({
  slug,
  title,
  priceCents,
  comparePriceCents,
  imageUrl,
  imageAlt,
  isNew,
  stockQty,
  className,
}: ProductCardProps) {
  const t = useTranslations("product");
  const isOnSale = comparePriceCents && comparePriceCents > priceCents;
  const isOutOfStock = stockQty !== undefined && stockQty <= 0;

  return (
    <Link href={`/products/${slug}`} className={cn("group flex flex-col", className)}>
      <div className="bg-stone relative aspect-[3/4] overflow-hidden rounded-xl">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-charcoal/10 text-xl">Tichel & Co.</span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-black/[0.03] to-transparent transition-opacity duration-500 group-hover:from-black/[0.08]" />

        <div className="absolute start-3 top-3 flex flex-col gap-1.5">
          {isNew && <Badge variant="new">{t("new")}</Badge>}
          {isOnSale && <Badge variant="sale">{t("sale")}</Badge>}
          {isOutOfStock && <Badge variant="outOfStock">{t("outOfStock")}</Badge>}
        </div>

        {!isOutOfStock && (
          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <div className="bg-navy/90 text-ivory rounded-lg py-3 text-center text-[11px] font-medium tracking-[0.15em] uppercase backdrop-blur-sm">
              {t("quickAdd")}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <h3 className="text-navy group-hover:text-gold line-clamp-1 text-[13px] font-medium tracking-wide transition-colors duration-300 sm:text-[14px]">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-[13px] sm:text-[14px]",
              isOnSale ? "text-error font-medium" : "text-charcoal/60",
            )}
          >
            {formatPrice(priceCents)}
          </span>
          {isOnSale && (
            <span className="text-charcoal/30 text-[11px] line-through sm:text-[12px]">
              {formatPrice(comparePriceCents)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
});
