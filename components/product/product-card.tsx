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
  /** Whether to show a "new" badge */
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
      {/* Image */}
      <div className="bg-stone relative aspect-[3/4] overflow-hidden rounded-sm">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt || title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-charcoal/20 text-lg">Tichel & Co.</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute start-2 top-2 flex flex-col gap-1">
          {isNew && <Badge variant="new">חדש</Badge>}
          {isOnSale && <Badge variant="sale">מבצע</Badge>}
          {isOutOfStock && <Badge variant="outOfStock">אזל</Badge>}
        </div>

        {/* Quick add overlay (desktop) */}
        {!isOutOfStock && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="bg-navy/90 text-ivory px-4 py-3 text-center text-sm font-medium">
              הוספה מהירה
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 flex flex-col gap-1">
        <h3 className="text-navy group-hover:text-gold line-clamp-1 text-sm font-medium transition-colors duration-150">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-medium",
              isOnSale ? "text-gold" : "text-charcoal/70",
            )}
          >
            {formatPrice(priceCents)}
          </span>
          {isOnSale && (
            <span className="text-charcoal/40 text-xs line-through">
              {formatPrice(comparePriceCents)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
