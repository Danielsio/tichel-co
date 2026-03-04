"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { useCartStore } from "@/stores/cart-store";
import { useMounted } from "@/hooks/use-mounted";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/format-price";

export default function CartPage() {
  const t = useTranslations("cart");
  const mounted = useMounted();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const totalItems = useCartStore((s) => s.totalItems);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
        <h1 className="font-display text-navy text-3xl font-semibold">{t("title")}</h1>
        <div className="bg-stone mt-8 h-64 animate-pulse rounded-sm" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center lg:px-6">
        <div className="text-charcoal/20 mx-auto mb-6">
          <svg
            className="mx-auto h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </div>
        <h1 className="font-display text-navy text-2xl font-semibold">{t("empty")}</h1>
        <Link href="/" className="mt-6 inline-block">
          <Button variant="secondary">{t("continueShopping")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
      <h1 className="font-display text-navy text-3xl font-semibold">{t("title")}</h1>
      <p className="text-charcoal/50 mt-1 text-sm">
        {t("items", { count: totalItems() })}
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {items.map((item) => (
          <div key={item.variantId} className="border-stone flex gap-4 border-b pb-6">
            <div className="bg-stone h-28 w-20 shrink-0 overflow-hidden rounded-sm">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-charcoal/20 text-xs">Tichel & Co.</span>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="text-navy text-sm font-medium">{item.name}</h3>
                <p className="text-charcoal/50 mt-0.5 text-xs">
                  {item.color} · {item.size}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="border-stone flex items-center rounded-sm border">
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    className="text-charcoal/60 hover:bg-stone flex h-8 w-8 items-center justify-center transition-colors"
                    aria-label={t("decreaseQty")}
                  >
                    −
                  </button>
                  <span className="text-navy flex h-8 w-8 items-center justify-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    className="text-charcoal/60 hover:bg-stone flex h-8 w-8 items-center justify-center transition-colors"
                    aria-label={t("increaseQty")}
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-navy text-sm font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-charcoal/40 hover:text-error text-xs transition-colors"
                    aria-label={t("removeItem", { name: item.name })}
                  >
                    {t("remove")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="border-stone mt-8 border-t pt-6">
        <div className="flex items-center justify-between">
          <span className="text-navy text-base font-semibold">{t("total")}</span>
          <span className="text-navy text-xl font-semibold">
            {formatPrice(totalPrice())}
          </span>
        </div>
        <p className="text-charcoal/40 mt-1 text-xs">{t("shippingNote")}</p>
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/checkout">
            <Button size="lg" fullWidth>
              {t("checkout")}
            </Button>
          </Link>
          <Link href="/" className="text-center">
            <Button variant="ghost" size="sm">
              {t("continueShopping")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
