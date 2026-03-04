"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { useCartStore, type CartItem } from "@/stores/cart-store";
import { useMounted } from "@/hooks/use-mounted";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/format-price";

function CartItemRow({ item }: { item: CartItem }) {
  const t = useTranslations("cart");
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-4 py-4">
      <div className="bg-stone h-20 w-16 shrink-0 overflow-hidden rounded-sm">
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-navy text-sm font-medium">{item.name}</p>
            {(item.color || item.size) && (
              <p className="text-charcoal/50 mt-0.5 text-xs">
                {[item.color, item.size].filter(Boolean).join(" / ")}
              </p>
            )}
          </div>
          <button
            onClick={() => removeItem(item.variantId)}
            className="text-charcoal/30 hover:text-error cursor-pointer transition-colors"
            aria-label={t("removeItem", { name: item.name })}
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              className="border-stone hover:bg-stone flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm border text-sm transition-colors"
              aria-label={t("decreaseQty")}
            >
              −
            </button>
            <span className="w-6 text-center text-sm">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              className="border-stone hover:bg-stone flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm border text-sm transition-colors"
              aria-label={t("increaseQty")}
            >
              +
            </button>
          </div>
          <p className="text-navy text-sm font-medium">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function CartDrawer() {
  const t = useTranslations("cart");
  const { items, isOpen, closeCart, totalPrice } = useCartStore();
  const mounted = useMounted();

  if (!mounted) return null;

  const total = totalPrice();

  return (
    <Drawer isOpen={isOpen} onClose={closeCart} title={t("title")} side="start">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg
            className="text-charcoal/15 mb-4 h-16 w-16"
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
          <p className="text-charcoal/50 text-sm">{t("empty")}</p>
          <Button variant="link" onClick={closeCart} className="mt-4">
            {t("continueShopping")}
          </Button>
        </div>
      ) : (
        <div className="flex h-full flex-col">
          <div className="divide-stone -mx-6 flex-1 divide-y overflow-y-auto px-6">
            {items.map((item) => (
              <CartItemRow key={item.variantId} item={item} />
            ))}
          </div>
          <div className="border-stone -mx-6 border-t px-6 pt-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-charcoal/70 text-sm">{t("total")}</span>
              <span className="text-navy text-lg font-semibold">
                {formatPrice(total)}
              </span>
            </div>
            <p className="text-charcoal/40 mb-4 text-xs">{t("shippingNote")}</p>
            <Link href="/checkout" onClick={closeCart}>
              <Button fullWidth size="lg">
                {t("checkout")}
              </Button>
            </Link>
            <button
              onClick={closeCart}
              className="text-charcoal/50 hover:text-navy mt-2 w-full cursor-pointer py-2 text-center text-sm transition-colors"
            >
              {t("continueShopping")}
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
