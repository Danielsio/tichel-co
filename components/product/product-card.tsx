import Link from "next/link";
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
  isFeatured?: boolean;
  isNew?: boolean;
  stockQty?: number;
  className?: string;
}

export function ProductCard({
  slug,
  title,
  priceCents,
  comparePriceCents,
  imageUrl,
  imageAlt,
  isFeatured: _isFeatured,
  isNew,
  stockQty,
  className,
}: ProductCardProps) {
  const isOnSale = comparePriceCents && comparePriceCents > priceCents;
  const isOutOfStock = stockQty !== undefined && stockQty <= 0;

  return (
    <Link href={`/products/${slug}`} className={cn("group flex flex-col", className)}>
      {/* Image Container */}
      <div className="bg-stone relative aspect-[3/4] overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt || title}
            className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-charcoal/10 text-xl">Tichel & Co.</span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="bg-navy/0 group-hover:bg-navy/5 pointer-events-none absolute inset-0 transition-colors duration-500" />

        {/* Badges */}
        <div className="absolute start-3 top-3 flex flex-col gap-1.5">
          {isNew && <Badge variant="new">חדש</Badge>}
          {isOnSale && <Badge variant="sale">מבצע</Badge>}
          {isOutOfStock && <Badge variant="outOfStock">אזל</Badge>}
        </div>

        {/* Quick add — slides up */}
        {!isOutOfStock && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-400 ease-out group-hover:translate-y-0">
            <div className="bg-navy text-ivory py-3.5 text-center text-[11px] font-medium tracking-[0.15em] uppercase">
              הוספה מהירה
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-4 flex flex-col gap-1.5">
        <h3 className="text-navy group-hover:text-gold line-clamp-1 text-[13px] font-medium tracking-wide transition-colors duration-300">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-[13px]",
              isOnSale ? "text-error font-medium" : "text-charcoal/60",
            )}
          >
            {formatPrice(priceCents)}
          </span>
          {isOnSale && (
            <span className="text-charcoal/30 text-[11px] line-through">
              {formatPrice(comparePriceCents)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
